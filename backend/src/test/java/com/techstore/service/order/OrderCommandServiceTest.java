package com.techstore.service.order;

import com.techstore.dto.order.CheckoutRequest;
import com.techstore.entity.order.Order;
import com.techstore.entity.order.OrderStatus;
import com.techstore.entity.product.Product;
import com.techstore.entity.product.ProductVariant;
import com.techstore.entity.user.User;
import com.techstore.repository.order.CouponRepository;
import com.techstore.repository.order.OrderRepository;
import com.techstore.repository.product.ProductVariantRepository;
import com.techstore.service.cart.CartService;
import com.techstore.service.inventory.InventoryService;
import com.techstore.service.notification.EmailService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderCommandServiceTest {

    @Mock
    private OrderRepository orderRepository;
    @Mock
    private ProductVariantRepository variantRepository;
    @Mock
    private CouponRepository couponRepository;
    @Mock
    private InventoryService inventoryService;
    @Mock
    private CartService cartService;
    @Mock
    private EmailService emailService;
    @Mock
    private OrderMapper orderMapper;

    @InjectMocks
    private OrderCommandService orderCommandService;

    private User user;
    private ProductVariant variant;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setEmail("test@example.com");
        user.setFullName("Test User");
        user.setId("user-1");
        
        Product product = new Product();
        product.setName("Test Product");
        product.setImages(new java.util.HashSet<>());

        variant = new ProductVariant();
        variant.setId("var-1");
        variant.setName("Blue");
        variant.setPrice(BigDecimal.valueOf(1000000));
        variant.setStockQuantity(10);
        variant.setProduct(product);
        variant.setSku("SKU-1");
    }

    @Test
    void createOrder_ShouldReturnOrderId() {
        CheckoutRequest request = new CheckoutRequest();
        request.setIdempotencyKey("key-1");
        request.setReceiverName("Receiver");
        request.setReceiverPhone("0123456789");
        request.setShippingAddress("Address");
        
        CheckoutRequest.CartItemRequest item = new CheckoutRequest.CartItemRequest();
        item.setVariantId("var-1");
        item.setQuantity(1);
        request.setItems(List.of(item));

        when(orderRepository.existsByIdempotencyKey("key-1")).thenReturn(false);
        when(variantRepository.findByIdWithLock("var-1")).thenReturn(Optional.of(variant));
        
        Order savedOrder = new Order();
        savedOrder.setTotalAmount(BigDecimal.valueOf(1030000));
        savedOrder.setUser(user);
        savedOrder.setId("order-1");
        when(orderRepository.save(any(Order.class))).thenReturn(savedOrder);

        String orderId = orderCommandService.createOrder(user, request);

        assertNotNull(orderId);
        assertEquals("order-1", orderId);
        verify(orderRepository).save(any(Order.class));
    }
}
