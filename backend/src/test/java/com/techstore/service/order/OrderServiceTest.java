package com.techstore.service.order;

import com.techstore.dto.order.OrderResponse;
import com.techstore.entity.cart.Cart;
import com.techstore.entity.inventory.TransactionType;
import com.techstore.entity.order.Coupon;
import com.techstore.entity.order.Order;
import com.techstore.entity.order.OrderItem;
import com.techstore.entity.order.OrderStatus;
import com.techstore.entity.payment.Payment;
import com.techstore.entity.payment.PaymentStatus;
import com.techstore.entity.product.Product;
import com.techstore.entity.product.ProductVariant;
import com.techstore.entity.user.Role;
import com.techstore.entity.user.User;
import com.techstore.exception.AppException;
import com.techstore.exception.ErrorCode;
import com.techstore.repository.cart.CartRepository;
import com.techstore.repository.order.CouponRepository;
import com.techstore.repository.order.OrderRepository;
import com.techstore.repository.payment.PaymentRepository;
import com.techstore.repository.product.ProductVariantRepository;
import com.techstore.service.cart.CartService;
import com.techstore.service.inventory.InventoryService;


import com.techstore.service.order.OrderService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private ProductVariantRepository variantRepository;

    @Mock
    private CouponRepository couponRepository;

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private InventoryService inventoryService;

    @Mock
    private CartRepository cartRepository;

    @Mock
    private CartService cartService;

    @InjectMocks
    private OrderService orderService;

    private User owner;
    private Order order;
    private Coupon coupon;
    private ProductVariant variant;

    @BeforeEach
    void setUp() {
        owner = User.builder()
                .email("customer@techstore.com")
                .fullName("Customer")
                .password("secret")
                .role(Role.ROLE_CUSTOMER)
                .build();
        owner.setId(1L);

        variant = ProductVariant.builder()
                .sku("SKU-001")
                .name("Default Variant")
                .price(new BigDecimal("25000000"))
                .stockQuantity(10)
                .build();
        variant.setId(10L);

        coupon = Coupon.builder()
                .code("WELCOME50K")
                .usedCount(1)
                .build();

        order = Order.builder()
                .user(owner)
                .status(OrderStatus.PENDING)
                .receiverName("Customer")
                .receiverPhone("0123456789")
                .shippingAddress("123 Tech Street")
                .subTotal(new BigDecimal("25000000"))
                .shippingFee(new BigDecimal("30000"))
                .discountAmount(new BigDecimal("50000"))
                .totalAmount(new BigDecimal("24980000"))
                .coupon(coupon)
                .items(List.of(
                        OrderItem.builder()
                                .variant(variant)
                                .variantName("Phone - Default Variant")
                                .variantSku("SKU-001")
                                .priceAtPurchase(new BigDecimal("25000000"))
                                .quantity(1)
                                .build()
                ))
                .build();
        order.setId(99L);
    }

    @Test
    void cancelOrder_ShouldCancelAndRestock_WhenOrderIsEligible() {
        when(orderRepository.findById(99L)).thenReturn(Optional.of(order));
        when(paymentRepository.findByOrderId(99L)).thenReturn(List.of());
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));

        OrderResponse response = orderService.cancelOrder(99L, owner);

        assertEquals(OrderStatus.CANCELLED, response.getStatus());
        assertFalse(Boolean.TRUE.equals(response.getCanCancel()));
        assertEquals(0, coupon.getUsedCount());
        verify(inventoryService).processTransaction(
                eq(10L),
                eq(TransactionType.RETURN),
                eq(1),
                any(),
                eq("ORDER_CANCEL_99"),
                eq("Customer cancelled order"),
                eq(1L),
                eq("MAIN_WAREHOUSE")
        );
        verify(couponRepository).save(coupon);
        verify(orderRepository).save(order);
    }

    @Test
    void cancelOrder_ShouldReject_WhenOrderHasSuccessfulPayment() {
        Payment payment = Payment.builder()
                .status(PaymentStatus.SUCCESS)
                .amount(order.getTotalAmount())
                .order(order)
                .build();

        when(orderRepository.findById(99L)).thenReturn(Optional.of(order));
        when(paymentRepository.findByOrderId(99L)).thenReturn(List.of(payment));

        AppException exception = assertThrows(AppException.class, () -> orderService.cancelOrder(99L, owner));

        assertEquals(ErrorCode.ORDER_CANCELLATION_NOT_ALLOWED, exception.getErrorCode());
        verify(inventoryService, never()).processTransaction(any(), any(), any(), any(), any(), any(), any(), any());
        verify(orderRepository, never()).save(any(Order.class));
    }
}
