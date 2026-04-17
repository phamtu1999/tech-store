package com.techstore.controller.cart;

import com.techstore.dto.ApiResponse;
import com.techstore.dto.cart.CartItemRequest;
import com.techstore.dto.cart.CartResponse;
import com.techstore.entity.cart.Cart;
import com.techstore.entity.user.User;
import com.techstore.service.cart.CartService;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ApiResponse<CartResponse> getCart(@AuthenticationPrincipal User user) {
        return ApiResponse.<CartResponse>builder()
                .result(cartService.getCart(user))
                .build();
    }

    @PostMapping("/add")
    public ApiResponse<CartResponse> addToCart(@AuthenticationPrincipal User user, @RequestBody CartItemRequest request) {
        return ApiResponse.<CartResponse>builder()
                .result(cartService.addToCart(user, request))
                .build();
    }

    @PutMapping("/items/{itemId}")
    public ApiResponse<CartResponse> updateCartItem(
            @AuthenticationPrincipal User user,
            @PathVariable Long itemId,
            @RequestBody Map<String, Integer> body
    ) {
        return ApiResponse.<CartResponse>builder()
                .result(cartService.updateCartItem(user, itemId, body.get("quantity")))
                .build();
    }

    @DeleteMapping("/items/{itemId}")
    public ApiResponse<CartResponse> removeFromCart(@AuthenticationPrincipal User user, @PathVariable Long itemId) {
        return ApiResponse.<CartResponse>builder()
                .result(cartService.removeFromCart(user, itemId))
                .build();
    }

    @DeleteMapping("/clear")
    public ApiResponse<Void> clearCart(@AuthenticationPrincipal User user) {
        cartService.clearCart(user);
        return ApiResponse.<Void>builder()
                .message("Cart cleared successfully")
                .build();
    }
}
