package com.techstore.service.cart;

import com.techstore.dto.cart.CartItemRequest;
import com.techstore.dto.cart.CartResponse;
import com.techstore.entity.cart.Cart;
import com.techstore.entity.product.Product;
import com.techstore.entity.product.ProductVariant;
import com.techstore.entity.user.User;
import com.techstore.exception.AppException;
import com.techstore.exception.ErrorCode;
import com.techstore.repository.cart.CartItemRepository;
import com.techstore.repository.cart.CartRepository;
import com.techstore.repository.product.ProductVariantRepository;
import com.techstore.service.notification.NotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CartServiceTest {

    @Mock
    private CartRepository cartRepository;
    @Mock
    private CartItemRepository cartItemRepository;
    @Mock
    private ProductVariantRepository variantRepository;
    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private CartService cartService;

    private User user;
    private Cart cart;
    private ProductVariant variant;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setEmail("test@example.com");
        user.setId("user-1");
        cart = new Cart();
        cart.setUser(user);
        cart.setItems(new ArrayList<>());
        cart.setId("cart-1");
        
        Product product = new Product();
        product.setName("Test Product");
        product.setImages(new java.util.HashSet<>());

        variant = new ProductVariant();
        variant.setId("var-1");
        variant.setName("Blue");
        variant.setPrice(BigDecimal.valueOf(50000));
        variant.setStockQuantity(10);
        variant.setProduct(product);
    }

    @Test
    void getCart_ShouldReturnCartResponse() {
        when(cartRepository.findByUser(user)).thenReturn(Optional.of(cart));

        CartResponse response = cartService.getCart(user);

        assertNotNull(response);
        assertEquals(BigDecimal.ZERO, response.getTotalPrice());
    }

    @Test
    void addToCart_ShouldAddNewItem_WhenVariantNotInCart() {
        CartItemRequest request = new CartItemRequest();
        request.setVariantId("var-1");
        request.setQuantity(2);

        when(cartRepository.findByUser(user)).thenReturn(Optional.of(cart));
        when(variantRepository.findById("var-1")).thenReturn(Optional.of(variant));

        CartResponse response = cartService.addToCart(user, request);

        assertNotNull(response);
        assertEquals(1, cart.getItems().size());
        assertEquals(2, cart.getItems().get(0).getQuantity());
        verify(cartRepository).save(cart);
    }

    @Test
    void addToCart_ShouldThrowException_WhenInsufficientStock() {
        CartItemRequest request = new CartItemRequest();
        request.setVariantId("var-1");
        request.setQuantity(20);

        when(cartRepository.findByUser(user)).thenReturn(Optional.of(cart));
        when(variantRepository.findById("var-1")).thenReturn(Optional.of(variant));

        AppException exception = assertThrows(AppException.class, () -> 
                cartService.addToCart(user, request));
        
        assertEquals(ErrorCode.INSUFFICIENT_STOCK, exception.getErrorCode());
    }

    @Test
    void removeFromCart_ShouldDeleteById() {
        when(cartRepository.findByUser(user)).thenReturn(Optional.of(cart));

        cartService.removeFromCart(user, "item-1");

        verify(cartItemRepository).deleteById("item-1");
    }
}
