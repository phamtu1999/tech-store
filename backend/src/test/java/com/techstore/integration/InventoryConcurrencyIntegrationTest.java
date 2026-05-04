package com.techstore.integration;

import com.techstore.entity.brand.Brand;
import com.techstore.entity.category.Category;
import com.techstore.entity.inventory.TransactionType;
import com.techstore.entity.product.Product;
import com.techstore.entity.product.ProductVariant;
import com.techstore.repository.brand.BrandRepository;
import com.techstore.repository.category.CategoryRepository;
import com.techstore.repository.product.ProductRepository;
import com.techstore.repository.product.ProductVariantRepository;
import com.techstore.service.inventory.InventoryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.util.UUID;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class InventoryConcurrencyIntegrationTest {

    @Autowired
    private InventoryService inventoryService;

    @Autowired
    private ProductVariantRepository variantRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private ProductRepository productRepository;

    private String variantId;

    @BeforeEach
    void setUp() {
        // Tạo Category và Brand bắt buộc
        Category category = Category.builder()
                .name("Test Category " + UUID.randomUUID())
                .slug("test-cat-" + UUID.randomUUID())
                .active(true)
                .build();
        category = categoryRepository.save(category);

        Brand brand = Brand.builder()
                .name("Test Brand " + UUID.randomUUID())
                .slug("test-brand-" + UUID.randomUUID())
                .build();
        brand = brandRepository.save(brand);

        // Tạo sản phẩm mẫu với tồn kho = 10
        Product product = Product.builder()
                .name("Concurrency Test Product " + UUID.randomUUID())
                .slug("concurrency-test-" + UUID.randomUUID())
                .description("Test Description")
                .active(true)
                .category(category)
                .brand(brand)
                .build();
        product = productRepository.save(product);

        ProductVariant variant = ProductVariant.builder()
                .product(product)
                .name("Standard")
                .sku("CONC-" + UUID.randomUUID())
                .price(new BigDecimal("100.00"))
                .stockQuantity(10) // Có 10 cái
                .active(true)
                .build();
        variant = variantRepository.save(variant);
        variantId = variant.getId();
    }

    @Test
    void processTransaction_UnderHighConcurrency_ShouldMaintainDataIntegrity() throws InterruptedException {
        int numberOfThreads = 20; // 20 người cùng tranh mua
        ExecutorService executorService = Executors.newFixedThreadPool(numberOfThreads);
        CountDownLatch startLatch = new CountDownLatch(1);
        CountDownLatch endLatch = new CountDownLatch(numberOfThreads);

        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger failureCount = new AtomicInteger(0);

        for (int i = 0; i < numberOfThreads; i++) {
            executorService.execute(() -> {
                try {
                    startLatch.await(); // Đợi hiệu lệnh bắt đầu để tất cả cùng chạy
                    inventoryService.processTransaction(
                            variantId,
                            TransactionType.EXPORT,
                            1, // Mỗi người mua 1 cái
                            null,
                            "REF-" + UUID.randomUUID(),
                            "Concurrency Test",
                            "system",
                            "KHO_CHINH"
                    );
                    successCount.incrementAndGet();
                } catch (Exception e) {
                    failureCount.incrementAndGet();
                } finally {
                    endLatch.countDown();
                }
            });
        }

        startLatch.countDown(); // Bắn súng hiệu cho 20 luồng chạy cùng lúc
        endLatch.await(); // Đợi tất cả hoàn thành

        // Kiểm tra kết quả
        ProductVariant updatedVariant = variantRepository.findById(variantId).get();
        
        System.out.println("Success Count: " + successCount.get());
        System.out.println("Failure Count: " + failureCount.get());
        System.out.println("Final Stock: " + updatedVariant.getStockQuantity());

        assertEquals(10, successCount.get(), "Should have exactly 10 successful transactions");
        assertEquals(10, failureCount.get(), "Should have exactly 10 failed transactions");
        assertEquals(0, updatedVariant.getStockQuantity(), "Final stock should be exactly 0");

        executorService.shutdown();
    }
}
