package com.techstore.integration;

import com.techstore.dto.product.ProductRequest;
import com.techstore.entity.brand.Brand;
import com.techstore.entity.category.Category;
import com.techstore.entity.product.Product;
import com.techstore.entity.user.User;
import com.techstore.entity.user.UserStatus;
import com.techstore.repository.brand.BrandRepository;
import com.techstore.repository.category.CategoryRepository;
import com.techstore.repository.product.ProductRepository;
import com.techstore.repository.user.UserRepository;
import com.techstore.service.product.ProductAdminService;
import com.techstore.service.user.AdminUserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class AdminIntegrationTest {

    @Autowired
    private ProductAdminService productAdminService;

    @Autowired
    private AdminUserService adminUserService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private BrandRepository brandRepository;

    private Category testCategory;

    @BeforeEach
    void setUp() {
        testCategory = categoryRepository.save(Category.builder()
                .name("Admin Category")
                .slug("admin-cat-" + UUID.randomUUID())
                .active(true)
                .build());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createProduct_ShouldCascadeSaveVariantsAndAttributes() {
        ProductRequest request = new ProductRequest();
        request.setName("Admin Laptop");
        request.setCategoryId(testCategory.getId());
        request.setBrandName("New Brand " + UUID.randomUUID());
        request.setActive(true);
        request.setDescription("Powerful laptop");

        ProductRequest.VariantRequest v1 = new ProductRequest.VariantRequest();
        v1.setSku("LAP-001");
        v1.setName("Core i7 / 16GB");
        v1.setPrice(new BigDecimal("20000000"));
        v1.setStockQuantity(10);

        ProductRequest.VariantRequest v2 = new ProductRequest.VariantRequest();
        v2.setSku("LAP-002");
        v2.setName("Core i9 / 32GB");
        v2.setPrice(new BigDecimal("35000000"));
        v2.setStockQuantity(5);

        request.setVariants(List.of(v1, v2));

        // Act
        productAdminService.createProduct(request);

        // Assert
        Product product = productRepository.findAll().stream()
                .filter(p -> p.getName().equals("Admin Laptop"))
                .findFirst()
                .orElseThrow();
        
        assertNotNull(product.getBrand());
        assertEquals(2, product.getVariants().size());
        assertTrue(product.getVariants().stream().anyMatch(v -> v.getSku().equals("LAP-002")));
    }

    @Test
    @WithMockUser(roles = "SUPER_ADMIN")
    void lockUser_ShouldDisableUserAccount() {
        User user = userRepository.save(User.builder()
                .email("victim@test.com")
                .fullName("Victim User")
                .role(com.techstore.entity.user.Role.ROLE_USER)
                .status(UserStatus.ACTIVE)
                .active(true)
                .password("pass")
                .build());

        // Act
        adminUserService.lockUser(user.getId());

        // Assert
        User lockedUser = userRepository.findById(user.getId()).orElseThrow();
        assertEquals(UserStatus.LOCKED, lockedUser.getStatus());
        assertFalse(lockedUser.isActive());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void syncVariants_ShouldRemoveDeletedVariants() {
        // 1. Create with S-001, S-002
        ProductRequest createReq = new ProductRequest();
        createReq.setName("Sync Product");
        createReq.setCategoryId(testCategory.getId());
        createReq.setBrandName("Sync Brand");
        
        ProductRequest.VariantRequest v1 = new ProductRequest.VariantRequest();
        v1.setSku("S-001");
        v1.setPrice(BigDecimal.TEN);
        v1.setStockQuantity(10);
        
        ProductRequest.VariantRequest v2 = new ProductRequest.VariantRequest();
        v2.setSku("S-002");
        v2.setPrice(BigDecimal.TEN);
        v2.setStockQuantity(10);
        
        createReq.setVariants(List.of(v1, v2));
        productAdminService.createProduct(createReq);
        
        Product savedProduct = productRepository.findAll().stream()
                .filter(p -> p.getName().equals("Sync Product"))
                .findFirst().orElseThrow();

        // 2. Update to keep S-002, add S-003, remove S-001
        ProductRequest updateReq = new ProductRequest();
        updateReq.setName("Sync Product Updated");
        updateReq.setCategoryId(testCategory.getId());
        updateReq.setBrandName("Sync Brand");
        
        ProductRequest.VariantRequest v2Updated = new ProductRequest.VariantRequest();
        v2Updated.setSku("S-002");
        v2Updated.setPrice(BigDecimal.TEN);
        v2Updated.setStockQuantity(20);

        ProductRequest.VariantRequest v3 = new ProductRequest.VariantRequest();
        v3.setSku("S-003");
        v3.setPrice(BigDecimal.TEN);
        v3.setStockQuantity(30);

        updateReq.setVariants(List.of(v2Updated, v3));

        // Act
        productAdminService.updateProduct(savedProduct.getId(), updateReq);

        // Assert
        Product updatedProduct = productRepository.findById(savedProduct.getId()).orElseThrow();
        assertEquals(2, updatedProduct.getVariants().size());
        assertFalse(updatedProduct.getVariants().stream().anyMatch(v -> v.getSku().equals("S-001")));
        assertTrue(updatedProduct.getVariants().stream().anyMatch(v -> v.getSku().equals("S-003")));
    }
    @Autowired
    private com.techstore.service.analytics.AnalyticsService analyticsService;

    @Test
    @WithMockUser(roles = "ADMIN")
    void getDashboardStats_ShouldReturnData() {
        // Act
        var stats = analyticsService.getDashboardStats("all");

        // Assert
        assertNotNull(stats);
        assertNotNull(stats.getTotalCustomers());
        assertNotNull(stats.getLowStockProducts());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void exportReport_ShouldGenerateByteArray() {
        // Act
        byte[] excelData = analyticsService.exportReport("7d");

        // Assert
        assertNotNull(excelData);
        assertTrue(excelData.length > 0);
        // Verify it starts with ZIP/XLSX header (PK...)
        assertEquals('P', (char) excelData[0]);
        assertEquals('K', (char) excelData[1]);
    }
}
