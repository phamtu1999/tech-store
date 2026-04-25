package com.techstore.controller.order;

import com.techstore.dto.ApiResponse;
import com.techstore.dto.order.CheckoutRequest;
import com.techstore.dto.order.OrderResponse;
import com.techstore.dto.order.ReorderResponse;
import com.techstore.entity.order.OrderStatus;
import com.techstore.entity.user.User;
import com.techstore.service.order.OrderCommandService;
import com.techstore.service.order.OrderQueryService;

import lombok.RequiredArgsConstructor;
import com.techstore.security.LogAction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderQueryService orderQueryService;
    private final OrderCommandService orderCommandService;

    @LogAction("ORDER_CHECKOUT")
    @PostMapping("/checkout")
    public ApiResponse<String> checkout(
            @AuthenticationPrincipal User user,
            @RequestBody CheckoutRequest request
    ) {
        return ApiResponse.<String>builder()
                .message("Order placed successfully")
                .result(orderCommandService.createOrder(user, request))
                .build();
    }

    @GetMapping("/my-orders")
    public ApiResponse<Page<OrderResponse>> getMyOrders(
            @AuthenticationPrincipal User user,
            Pageable pageable
    ) {
        return ApiResponse.<Page<OrderResponse>>builder()
                .result(orderQueryService.getMyOrders(user, pageable))
                .build();
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'SUPER_ADMIN')")
    public ApiResponse<Page<OrderResponse>> getAllOrders(Pageable pageable) {
        return ApiResponse.<Page<OrderResponse>>builder()
                .result(orderQueryService.getAllOrders(pageable))
                .build();
    }

    @LogAction("UPDATE_ORDER_STATUS")
    @PutMapping("/{orderId}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'SUPER_ADMIN')")
    public ApiResponse<OrderResponse> updateOrderStatus(
            @PathVariable String orderId,
            @RequestParam OrderStatus status
    ) {
        return ApiResponse.<OrderResponse>builder()
                .message("Order status updated successfully")
                .result(orderCommandService.updateOrderStatus(orderId, status))
                .build();
    }

    @PostMapping("/{orderId}/confirm-receipt")
    public ApiResponse<OrderResponse> confirmReceipt(
            @PathVariable String orderId,
            @AuthenticationPrincipal User user
    ) {
        return ApiResponse.<OrderResponse>builder()
                .message("Order receipt confirmed")
                .result(orderCommandService.confirmReceipt(orderId, user))
                .build();
    }

    @GetMapping("/{orderId}")
    public ApiResponse<OrderResponse> getOrderById(
            @PathVariable String orderId,
            @AuthenticationPrincipal User user
    ) {
        return ApiResponse.<OrderResponse>builder()
                .result(orderQueryService.getOrderById(orderId, user))
                .build();
    }

    @LogAction("CANCEL_ORDER")
    @PostMapping("/{orderId}/cancel")
    public ApiResponse<OrderResponse> cancelOrder(
            @PathVariable String orderId,
            @AuthenticationPrincipal User user
    ) {
        return ApiResponse.<OrderResponse>builder()
                .message("Order cancelled successfully")
                .result(orderCommandService.cancelOrder(orderId, user))
                .build();
    }

    @PostMapping("/{orderId}/reorder")
    public ApiResponse<ReorderResponse> reorder(
            @PathVariable String orderId,
            @AuthenticationPrincipal User user
    ) {
        return ApiResponse.<ReorderResponse>builder()
                .message("Reorder processed successfully")
                .result(orderCommandService.reorder(orderId, user))
                .build();
    }
}
