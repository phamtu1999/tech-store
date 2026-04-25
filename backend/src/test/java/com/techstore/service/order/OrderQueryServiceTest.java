package com.techstore.service.order;

import com.techstore.dto.order.OrderResponse;
import com.techstore.entity.order.Order;
import com.techstore.entity.user.Role;
import com.techstore.entity.user.User;
import com.techstore.exception.AppException;
import com.techstore.exception.ErrorCode;
import com.techstore.repository.order.OrderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyBoolean;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrderQueryServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private OrderMapper orderMapper;

    @InjectMocks
    private OrderQueryService orderQueryService;

    private User user;
    private Order order;
    private OrderResponse orderResponse;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId("user-1");
        user.setRole(Role.ROLE_USER);

        order = new Order();
        order.setId("order-1");
        order.setUser(user);

        orderResponse = OrderResponse.builder()
                .id("order-1")
                .build();
    }

    @Test
    void getMyOrders_ShouldReturnPage() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Order> page = new PageImpl<>(List.of(order));

        when(orderRepository.findAllByUserOrderByCreatedAtDesc(any(), any())).thenReturn(page);
        when(orderMapper.mapToOrderResponse(any(), anyBoolean())).thenReturn(orderResponse);

        Page<OrderResponse> result = orderQueryService.getMyOrders(user, pageable);

        assertNotNull(result);
        assertEquals(1, result.getContent().size());
    }

    @Test
    void getOrderById_ShouldReturnOrder_WhenOwner() {
        when(orderRepository.findById("order-1")).thenReturn(Optional.of(order));
        when(orderMapper.mapToOrderResponse(any())).thenReturn(orderResponse);

        OrderResponse result = orderQueryService.getOrderById("order-1", user);

        assertNotNull(result);
        assertEquals("order-1", result.getId());
    }

    @Test
    void getOrderById_ShouldThrowException_WhenNotOwner() {
        User otherUser = new User();
        otherUser.setId("user-2");
        otherUser.setRole(Role.ROLE_USER);

        when(orderRepository.findById("order-1")).thenReturn(Optional.of(order));

        assertThrows(AppException.class, () -> orderQueryService.getOrderById("order-1", otherUser));
    }
}
