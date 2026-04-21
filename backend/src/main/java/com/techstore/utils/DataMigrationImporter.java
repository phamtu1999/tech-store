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
import java.sql.SQLException;
import java.util.*;

@Component
@Slf4j
public class DataMigrationImporter implements CommandLineRunner {

    @Autowired
    private DataSource dataSource;

    @Autowired
    private JdbcTemplate jdbcTemplate;

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
    }

    @Override
    public void run(String... args) throws Exception {
        Integer userCount = jdbcTemplate.queryForObject("SELECT count(*) FROM users", Integer.class);
        if (userCount != null && userCount > 10) {
            log.info("Database đã có dữ liệu. Bỏ qua bước Seeding.");
            return;
        }

        log.info("Bắt đầu migration dữ liệu...");
        importAndMigrate();
        log.info("Hoàn tất migration!");
    }

    private void importAndMigrate() {
        Connection connection = null;
        try {
            connection = dataSource.getConnection();
            connection.setAutoCommit(false);
            
            // Bước 1: Dọn dẹp dữ liệu
            try (var stmt = connection.createStatement()) {
                log.info("--- BƯỚC 1: Xóa dữ liệu cũ ---");
                stmt.execute("TRUNCATE TABLE users, brands, categories, addresses, coupons, products, product_variants, orders, order_items, product_images, product_attributes CASCADE");
                connection.commit();
                log.info("--- [OK] Đã dọn dẹp xong ---");
            }

            // Bước 2: Nạp dữ liệu
            connection.setAutoCommit(false);
            try (var stmt = connection.createStatement()) {
                stmt.execute("SET session_replication_role = 'replica'");
            }

            PGConnection pgConn = connection.unwrap(PGConnection.class);
            CopyManager copyManager = pgConn.getCopyAPI();

            ClassPathResource resource = new ClassPathResource("seed_data.sql");
            if (!resource.exists()) resource = new ClassPathResource("/seed_data.sql");
            
            if (!resource.exists()) {
                log.error("Không tìm thấy file seed_data.sql!");
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
                            try {
                                String processedData = processDataRows(currentTableName, currentData.toString());
                                copyManager.copyIn(currentCopyCommand, new StringReader(processedData));
                                log.info("   [OK] Đã import bảng: {}", currentTableName);
                            } catch (Exception e) {
                                log.error("   [LỖI] Tại bảng {}: {}", currentTableName, e.getMessage());
                                throw e; // Rethrow to trigger rollback
                            }
                            inCopyBlock = false;
                        }
                    } else if (inCopyBlock) {
                        currentData.append(line).append("\n");
                    }
                }
                connection.commit();
                log.info("--- [XONG] Đã nạp toàn bộ dữ liệu ---");
            }
        } catch (Exception e) {
            log.error("Lỗi nạp dữ liệu: {}", e.getMessage());
            try { if (connection != null) connection.rollback(); } catch (Exception ex) {}
        } finally {
            if (connection != null) {
                try {
                    if (!connection.isClosed()) {
                        try (var stmt = connection.createStatement()) {
                            stmt.execute("SET session_replication_role = 'origin'");
                        }
                    }
                    connection.close();
                } catch (Exception e) {}
            }
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
                if (idIndices.contains(i)) columns[i] = formatToUUID(columns[i]);
                sb.append(columns[i]);
                if (i < columns.length - 1) sb.append("\t");
            }
            sb.append("\n");
        }
        return sb.toString();
    }

    private String formatToUUID(String oldId) {
        if (oldId == null || oldId.equals("\\N") || oldId.trim().isEmpty()) return oldId;
        try {
            long id = Long.parseLong(oldId);
            return String.format("00000000-0000-0000-0000-%12d", id).replace(' ', '0');
        } catch (Exception e) { return oldId; }
    }
}
