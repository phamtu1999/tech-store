package com.techstore.integration;

import com.techstore.dto.cart.CartItemRequest;
import com.techstore.dto.cart.CartResponse;
import com.techstore.entity.brand.Brand;
import com.techstore.entity.category.Category;
import com.techstore.entity.product.Product;
import com.techstore.entity.product.ProductVariant;
import com.techstore.entity.user.User;
import com.techstore.exception.AppException;
import com.techstore.exception.ErrorCode;
import com.techstore.repository.brand.BrandRepository;
import com.techstore.repository.category.CategoryRepository;
import com.techstore.repository.product.ProductRepository;
import com.techstore.repository.product.ProductVariantRepository;
import com.techstore.repository.user.UserRepository;
import com.techstore.service.cart.CartService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashSet;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class CartIntegrationTest {

    @Autowired
    private CartService cartService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductVariantRepository variantRepository;

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    private User testUser;
    private ProductVariant testVariant;

    @BeforeEach
    void setUp() {
        // 1. Create User
        testUser = new User();
        testUser.setEmail("integration@test.com");
        testUser.setFullName("Integration User");
        testUser.setPassword("encoded_password");
        testUser.setRole(com.techstore.entity.user.Role.ROLE_USER);
        testUser.setStatus(com.techstore.entity.user.UserStatus.ACTIVE);
        testUser.setActive(true);
        testUser = userRepository.save(testUser);

        // 2. Create Brand & Category (using builder for cleaner code)
        Brand brand = Brand.builder()
                .name("Test Apple")
                .slug("test-apple")
                .build();
        brand = brandRepository.save(brand);

        Category category = Category.builder()
                .name("Test Phone")
                .slug("test-phone")
                .active(true)
                .build();
        category = categoryRepository.save(category);

        // 3. Create Product & Variant
        Product product = Product.builder()
                .name("Test iPhone 15")
                .slug("test-iphone-15")
                .brand(brand)
                .category(category)
                .active(true)
                .build();
        product = productRepository.save(product);

        testVariant = ProductVariant.builder()
                .product(product)
                .sku("TEST-SKU")
                .name("Standard Edition")
                .price(new BigDecimal("1000"))
                .stockQuantity(10)
                .active(true)
                .build();
        testVariant = variantRepository.save(testVariant);
    }

    @Test
    void addToCart_Success() {
        CartItemRequest request = new CartItemRequest();
        request.setVariantId(testVariant.getId());
        request.setQuantity(2);

        cartService.addToCart(testUser, request);
        CartResponse response = cartService.getCart(testUser);

        assertEquals(1, response.getCartItems().size());
        assertEquals(2, response.getCartItems().get(0).getQuantity());
        assertEquals(0, new BigDecimal("2000").compareTo(response.getTotalPrice()));
    }

    @Test
    void addToCart_WhenProductNotFound_ShouldThrowException() {
        CartItemRequest request = new CartItemRequest();
        request.setVariantId("non-existent-id");
        request.setQuantity(1);

        AppException exception = assertThrows(AppException.class, () -> 
            cartService.addToCart(testUser, request)
        );
        assertEquals(ErrorCode.ENTITY_NOT_FOUND, exception.getErrorCode());
    }

    @Test
    void addToCart_WhenOutOfStock_ShouldThrowException() {
        CartItemRequest request = new CartItemRequest();
        request.setVariantId(testVariant.getId());
        request.setQuantity(11); // Stock is 10

        AppException exception = assertThrows(AppException.class, () -> 
            cartService.addToCart(testUser, request)
        );
        assertEquals(ErrorCode.INSUFFICIENT_STOCK, exception.getErrorCode());
    }

    @Test
    void updateCartQuantity_ShouldUpdateCorrectly() {
        // Pre-add 2 items
        CartItemRequest request = new CartItemRequest();
        request.setVariantId(testVariant.getId());
        request.setQuantity(2);
        cartService.addToCart(testUser, request);

        CartResponse cartBefore = cartService.getCart(testUser);
        String itemId = cartBefore.getCartItems().get(0).getId();

        // Update to 5 items
        cartService.updateCartItem(testUser, itemId, 5);
        CartResponse cartAfter = cartService.getCart(testUser);

        assertEquals(5, cartAfter.getCartItems().get(0).getQuantity());
        assertEquals(0, new BigDecimal("5000").compareTo(cartAfter.getTotalPrice()));
    }

    @Test
    void removeFromCart_ShouldDeleteItem() {
        // Pre-add 1 item
        CartItemRequest request = new CartItemRequest();
        request.setVariantId(testVariant.getId());
        request.setQuantity(1);
        cartService.addToCart(testUser, request);

        String itemId = cartService.getCart(testUser).getCartItems().get(0).getId();

        // Remove
        cartService.removeFromCart(testUser, itemId);
        CartResponse response = cartService.getCart(testUser);

        assertTrue(response.getCartItems().isEmpty());
        assertEquals(0, BigDecimal.ZERO.compareTo(response.getTotalPrice()));
    }

    @Test
    void clearCart_ShouldRemoveAllItems() {
        // Pre-add items
        CartItemRequest request = new CartItemRequest();
        request.setVariantId(testVariant.getId());
        request.setQuantity(1);
        cartService.addToCart(testUser, request);

        // Clear
        cartService.clearCart(testUser);
        CartResponse response = cartService.getCart(testUser);

        assertEquals(0, response.getCartItems().size());
        assertEquals(0, response.getTotalItems());
    }
}
