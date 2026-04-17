package com.techstore.controller.order;

import com.techstore.dto.ApiResponse;
import com.techstore.dto.order.CheckoutRequest;
import com.techstore.dto.order.OrderResponse;
import com.techstore.dto.order.ReorderResponse;
import com.techstore.entity.order.OrderStatus;
import com.techstore.entity.user.User;
import com.techstore.service.order.OrderService;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/checkout")
    public ApiResponse<Long> checkout(
            @AuthenticationPrincipal User user,
            @RequestBody CheckoutRequest request
    ) {
        return ApiResponse.<Long>builder()
                .message("Order placed successfully")
                .result(orderService.createOrder(user, request))
                .build();
    }

    @GetMapping("/my-orders")
    public ApiResponse<Page<OrderResponse>> getMyOrders(
            @AuthenticationPrincipal User user,
            Pageable pageable
    ) {
        return ApiResponse.<Page<OrderResponse>>builder()
                .result(orderService.getMyOrders(user, pageable))
                .build();
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'SUPER_ADMIN')")
    public ApiResponse<Page<OrderResponse>> getAllOrders(Pageable pageable) {
        return ApiResponse.<Page<OrderResponse>>builder()
                .result(orderService.getAllOrders(pageable))
                .build();
    }

    @PutMapping("/{orderId}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'SUPER_ADMIN')")
    public ApiResponse<OrderResponse> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam OrderStatus status
    ) {
        return ApiResponse.<OrderResponse>builder()
                .message("Order status updated successfully")
                .result(orderService.updateOrderStatus(orderId, status))
                .build();
    }

    @PostMapping("/{orderId}/confirm-receipt")
    public ApiResponse<OrderResponse> confirmReceipt(
            @PathVariable Long orderId,
            @AuthenticationPrincipal User user
    ) {
        return ApiResponse.<OrderResponse>builder()
                .message("Order receipt confirmed")
                .result(orderService.confirmReceipt(orderId, user))
                .build();
    }

    @GetMapping("/{orderId}")
    public ApiResponse<OrderResponse> getOrderById(
            @PathVariable Long orderId,
            @AuthenticationPrincipal User user
    ) {
        return ApiResponse.<OrderResponse>builder()
                .result(orderService.getOrderById(orderId, user))
                .build();
    }

    @PostMapping("/{orderId}/cancel")
    public ApiResponse<OrderResponse> cancelOrder(
            @PathVariable Long orderId,
            @AuthenticationPrincipal User user
    ) {
        return ApiResponse.<OrderResponse>builder()
                .message("Order cancelled successfully")
                .result(orderService.cancelOrder(orderId, user))
                .build();
    }

    @PostMapping("/{orderId}/reorder")
    public ApiResponse<ReorderResponse> reorder(
            @PathVariable Long orderId,
            @AuthenticationPrincipal User user
    ) {
        return ApiResponse.<ReorderResponse>builder()
                .message("Reorder processed successfully")
                .result(orderService.reorder(orderId, user))
                .build();
    }
}
