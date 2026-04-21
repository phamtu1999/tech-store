package com.techstore.utils;

import lombok.extern.slf4j.Slf4j;
import org.postgresql.PGConnection;
import org.postgresql.copy.CopyManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.StringReader;
import java.sql.Connection;
import java.util.*;

@Component
@Slf4j
public class DataMigrationImporter implements CommandLineRunner {

    @Autowired
    private DataSource dataSource;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // Cấu hình các cột nào là ID cần chuyển sang UUID cho từng bảng (Index dựa trên file SQL)
    private static final Map<String, Set<Integer>> TABLE_ID_COLUMNS = new HashMap<>();

    static {
        TABLE_ID_COLUMNS.put("public.addresses", Set.of(0, 10)); // id, user_id
        TABLE_ID_COLUMNS.put("public.brands", Set.of(0));
        TABLE_ID_COLUMNS.put("public.categories", Set.of(0, 7)); // id, parent_id
        TABLE_ID_COLUMNS.put("public.products", Set.of(0, 7, 8)); // id, brand_id, category_id
        TABLE_ID_COLUMNS.put("public.product_variants", Set.of(0, 12)); // id, product_id
        TABLE_ID_COLUMNS.put("public.users", Set.of(0));
        TABLE_ID_COLUMNS.put("public.orders", Set.of(0, 13, 14)); // id, coupon_id, user_id
        TABLE_ID_COLUMNS.put("public.order_items", Set.of(0, 8, 9)); // id, order_id, variant_id
        TABLE_ID_COLUMNS.put("public.carts", Set.of(0, 4)); // id, user_id
        TABLE_ID_COLUMNS.put("public.product_images", Set.of(0, 5)); // id, product_id
        TABLE_ID_COLUMNS.put("public.product_attributes", Set.of(0, 5)); // id, product_id
        TABLE_ID_COLUMNS.put("public.reviews", Set.of(0, 9, 10)); // id, product_id, user_id
        TABLE_ID_COLUMNS.put("public.notifications", Set.of(0, 6)); // id, user_id
        TABLE_ID_COLUMNS.put("public.inventory_transactions", Set.of(0, 4, 10)); // id, created_by, variant_id
        TABLE_ID_COLUMNS.put("public.wishlists", Set.of(0, 3, 4)); // id, product_id, user_id
        TABLE_ID_COLUMNS.put("public.login_history", Set.of(0, 8)); // id, user_id
    }

    @Override
    public void run(String... args) throws Exception {
        // Kiểm tra xem đã có dữ liệu chưa để tránh chạy lặp lại
        Integer userCount = jdbcTemplate.queryForObject("SELECT count(*) FROM users", Integer.class);
        if (userCount != null && userCount > 10) {
            log.info("Database đã có nhiều dữ liệu ({} users). Bỏ qua bước Seeding.", userCount);
            return;
        }

        log.info("Bắt đầu quá trình migration dữ liệu từ Long sang UUID...");
        importAndMigrate();
        log.info("Hoàn tất migration dữ liệu!");
    }

    private void importAndMigrate() {
        try (Connection conn = dataSource.getConnection()) {
            PGConnection pgConn = conn.unwrap(PGConnection.class);
            CopyManager copyManager = pgConn.getCopyAPI();

            ClassPathResource resource = new ClassPathResource("seed_data.sql");
            if (!resource.exists()) {
                log.error("Không tìm thấy file seed_data.sql trong resources!");
                return;
            }

            try (BufferedReader reader = new BufferedReader(new InputStreamReader(resource.getInputStream()))) {
                String line;
                String currentCopyCommand = null;
                String currentTableName = null;
                StringBuilder currentData = new StringBuilder();
                boolean inCopyBlock = false;

                while ((line = reader.readLine()) != null) {
                    if (line.startsWith("COPY ")) {
                        currentCopyCommand = line;
                        currentTableName = extractTableName(line);
                        currentData = new StringBuilder();
                        inCopyBlock = true;
                    } else if (line.trim().equals("\\.")) {
                        if (inCopyBlock) {
                            String processedData = processDataRows(currentTableName, currentData.toString());
                            copyManager.copyIn(currentCopyCommand, new StringReader(processedData));
                            inCopyBlock = false;
                            log.info("   [OK] Đã import bảng: {}", currentTableName);
                        }
                    } else if (inCopyBlock) {
                        currentData.append(line).append("\n");
                    }
                }
            }
        } catch (Exception e) {
            log.error("Lỗi nghiêm trọng trong quá trình import: {}", e.getMessage());
        }
    }

    private String extractTableName(String copyCommand) {
        String[] parts = copyCommand.split(" ");
        return parts[1];
    }

    private String processDataRows(String tableName, String rawData) {
        Set<Integer> idIndices = TABLE_ID_COLUMNS.getOrDefault(tableName, Set.of());
        if (idIndices.isEmpty()) return rawData;

        StringBuilder sb = new StringBuilder();
        String[] rows = rawData.split("\n");
        for (String row : rows) {
            if (row.trim().isEmpty()) continue;
            String[] columns = row.split("\t");
            for (int i = 0; i < columns.length; i++) {
                if (idIndices.contains(i)) {
                    columns[i] = formatToUUID(columns[i]);
                }
                sb.append(columns[i]);
                if (i < columns.length - 1) sb.append("\t");
            }
            sb.append("\n");
        }
        return sb.toString();
    }

    private String formatToUUID(String oldId) {
        if (oldId == null || oldId.equals("\\N") || oldId.trim().isEmpty()) {
            return oldId;
        }
        try {
            // Chuyển ID số thành định dạng UUID: 00000000-0000-0000-0000-00000000000X
            long id = Long.parseLong(oldId);
            return String.format("00000000-0000-0000-0000-%12d", id).replace(' ', '0');
        } catch (NumberFormatException e) {
            return oldId; // Nếu đã là UUID thì giữ nguyên
        }
    }
}
