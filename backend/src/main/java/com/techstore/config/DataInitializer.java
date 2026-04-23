package com.techstore.config;

import com.techstore.entity.address.Address;
import com.techstore.entity.brand.Brand;
import com.techstore.entity.category.Category;
import com.techstore.entity.order.Coupon;
import com.techstore.entity.order.DiscountType;
import com.techstore.entity.product.Product;
import com.techstore.entity.product.ProductAttribute;
import com.techstore.entity.product.ProductImage;
import com.techstore.entity.product.ProductVariant;
import com.techstore.entity.user.Role;
import com.techstore.entity.user.User;
import com.techstore.repository.brand.BrandRepository;
import com.techstore.repository.category.CategoryRepository;
import com.techstore.repository.order.CouponRepository;
import com.techstore.repository.product.ProductRepository;
import com.techstore.repository.user.UserRepository;
import com.techstore.utils.SlugUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final ProductRepository productRepository;
    private final CouponRepository couponRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.seed.demo-users.enabled:false}")
    private boolean demoUsersEnabled;

    @Value("${app.seed.demo-users.admin-password:}")
    private String demoAdminPassword;

    @Value("${app.seed.demo-users.customer-password:}")
    private String demoCustomerPassword;

    @Override
    @Transactional
    public void run(String... args) {
        if (demoUsersEnabled && userRepository.count() == 0) {
            seedUsers();
        } else if (!demoUsersEnabled && userRepository.count() == 0) {
            log.warn("Skipping demo user seeding because app.seed.demo-users.enabled=false");
        }
        if (categoryRepository.count() == 0) {
            seedCategoriesAndBrands();
        }
        if (couponRepository.count() == 0) {
            seedCoupons();
        }
        
        // One-time migration: Update all existing slugs to include category name
        migrateProductSlugs();
    }

    private void migrateProductSlugs() {
        List<Product> products = productRepository.findAll();
        boolean hasChanges = false;
        
        for (Product product : products) {
            if (product.getCategory() == null) continue;
            
            Category category = product.getCategory();
            String prefix = category.getName();
            if (category.getParent() != null && !category.getParent().getSlug().equals("dien-tu")) {
                prefix = category.getParent().getName() + " " + prefix;
            }
            String expectedSlug = SlugUtils.deduplicate(SlugUtils.makeSlug(prefix + " " + product.getName()));
            String currentSlug = product.getSlug();
            
            // Use exact match check to ensure even products that start with category name are updated
            if (currentSlug == null || !currentSlug.equals(expectedSlug)) {
                product.setSlug(expectedSlug);
                hasChanges = true;
            }
        }
        
        if (hasChanges) {
            productRepository.saveAll(products);
            System.out.println(">>> SLUG MIGRATION COMPLETED: Updated product URLs with category prefixes.");
        }
    }

    private void seedUsers() {
        if (demoAdminPassword == null || demoAdminPassword.isBlank()
                || demoCustomerPassword == null || demoCustomerPassword.isBlank()) {
            throw new IllegalStateException(
                    "Demo user seeding requires app.seed.demo-users.admin-password and app.seed.demo-users.customer-password"
            );
        }

        User admin = User.builder()
                .fullName("System Admin")
                .email("admin@techstore.com")
                .password(passwordEncoder.encode(demoAdminPassword))
                .role(Role.ROLE_ADMIN)
                .active(true)
                .status(com.techstore.entity.user.UserStatus.ACTIVE)
                .emailVerified(true)
                .build();
        userRepository.save(admin);

        User customer = User.builder()
                .fullName("John Doe")
                .email("customer@gmail.com")
                .password(passwordEncoder.encode(demoCustomerPassword))
                .role(Role.ROLE_CUSTOMER)
                .active(true)
                .status(com.techstore.entity.user.UserStatus.ACTIVE)
                .emailVerified(true)
                .build();
        
        Address address = Address.builder()
                .user(customer)
                .receiverName("John Doe")
                .phone("0987654321")
                .province("Hồ Chí Minh")
                .district("Quận 1")
                .ward("Phường Bến Nghé")
                .detailedAddress("123 Lê Lợi")
                .isDefault(true)
                .build();
        customer.setAddresses(new java.util.ArrayList<>(List.of(address)));
        userRepository.save(customer);
    }

    private void seedCategoriesAndBrands() {
        // Brands
        Brand apple = brandRepository.save(Brand.builder().name("Apple").slug("apple").build());
        Brand samsung = brandRepository.save(Brand.builder().name("Samsung").slug("samsung").build());
        brandRepository.save(Brand.builder().name("Xiaomi").slug("xiaomi").build());
        brandRepository.save(Brand.builder().name("ASUS").slug("asus").build());
        brandRepository.save(Brand.builder().name("HP").slug("hp").build());
        brandRepository.save(Brand.builder().name("Dell").slug("dell").build());
        brandRepository.save(Brand.builder().name("Acer").slug("acer").build());
        brandRepository.save(Brand.builder().name("Lenovo").slug("lenovo").build());
        brandRepository.save(Brand.builder().name("Sony").slug("sony").build());
        brandRepository.save(Brand.builder().name("MSI").slug("msi").build());

        // Categories (Tree)
        Category electronics = categoryRepository.save(Category.builder()
                .name("Điện tử")
                .slug("dien-tu")
                .imageUrl("https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400")
                .active(true)
                .sortOrder(1)
                .build());

        Category smartphone = categoryRepository.save(Category.builder()
                .name("Điện thoại")
                .slug("dien-thoai")
                .imageUrl("https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400")
                .parent(electronics)
                .active(true)
                .sortOrder(1)
                .build());

        Category iphone = categoryRepository.save(Category.builder()
                .name("iPhone")
                .slug("iphone")
                .imageUrl("https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400")
                .parent(smartphone)
                .active(true)
                .sortOrder(1)
                .build());

        // Products
        seedIphoneProduct(iphone, apple);
    }

    private void seedIphoneProduct(Category category, Brand brand) {
        Product iphone15 = Product.builder()
                .name("iPhone 15 Pro Max")
                .slug(SlugUtils.makeSlug(category.getName() + " " + "iPhone 15 Pro Max"))
                .description("iPhone 15 Pro Max - Chiếc iPhone mạnh mẽ nhất từng được sản phẩm. Với khung viền Titanium siêu bền và nhẹ, chip A17 Pro mang lại hiệu năng chơi game chưa từng có. Hệ thống camera được nâng cấp mạnh mẽ với ống kính Tele 5x cho phép bạn chụp những bức ảnh từ xa với độ chi tiết kinh ngạc. Sản phẩm còn được trang bị cổng USB-C tốc độ cao và nút Tùy chỉnh (Action Button) hoàn toàn mới, giúp bạn mở nhanh tác vụ yêu thích chỉ bằng một lần nhấn.")
                .category(category)
                .brand(brand)
                .active(true)
                .build();

        // Variants
        ProductVariant v1 = ProductVariant.builder()
                .product(iphone15)
                .sku("IP15PM-256-BLUE")
                .name("256GB - Blue Titanium")
                .price(new BigDecimal("32000000"))
                .stockQuantity(50)
                .color("Blue")
                .size("256GB")
                .build();

        ProductVariant v2 = ProductVariant.builder()
                .product(iphone15)
                .sku("IP15PM-512-NATURAL")
                .name("512GB - Natural Titanium")
                .price(new BigDecimal("36000000"))
                .stockQuantity(20)
                .color("Natural")
                .size("512GB")
                .build();

        iphone15.setVariants(new java.util.HashSet<>(Set.of(v1, v2)));

        // Images
        ProductImage img = ProductImage.builder()
                .product(iphone15)
                .imageUrl("https://picsum.photos/800/800")
                .isThumbnail(true)
                .build();
        iphone15.setImages(new java.util.HashSet<>(Set.of(img)));

        // Attributes
        ProductAttribute ram = ProductAttribute.builder()
                .product(iphone15)
                .attributeName("RAM")
                .attributeValue("8GB")
                .build();
        ProductAttribute chip = ProductAttribute.builder()
                .product(iphone15)
                .attributeName("Chipset")
                .attributeValue("A17 Pro")
                .build();
        iphone15.setAttributes(new java.util.HashSet<>(Set.of(ram, chip)));

        productRepository.save(iphone15);
    }

    private void seedCoupons() {
        couponRepository.save(Coupon.builder()
                .code("TECHSTORE2024")
                .discountType(DiscountType.PERCENT)
                .discountValue(new BigDecimal("10"))
                .maxDiscount(new BigDecimal("500000"))
                .minPurchase(new BigDecimal("2000000"))
                .expirationDate(LocalDateTime.now().plusMonths(1))
                .usageLimit(100)
                .active(true)
                .build());

        couponRepository.save(Coupon.builder()
                .code("WELCOME50K")
                .discountType(DiscountType.FIXED_AMOUNT)
                .discountValue(new BigDecimal("50000"))
                .minPurchase(new BigDecimal("0"))
                .expirationDate(LocalDateTime.now().plusMonths(12))
                .usageLimit(1000)
                .active(true)
                .build());
    }
}
