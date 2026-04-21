package com.techstore.controller.user;

import com.techstore.dto.ApiResponse;
import com.techstore.dto.user.WishlistItemResponse;
import com.techstore.entity.user.User;
import com.techstore.service.user.WishlistService;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    public ApiResponse<List<WishlistItemResponse>> getWishlist(@AuthenticationPrincipal User user) {
        return ApiResponse.<List<WishlistItemResponse>>builder()
                .result(wishlistService.getWishlist(user))
                .build();
    }

    @PostMapping("/{productId}")
    public ApiResponse<WishlistItemResponse> addToWishlist(
            @AuthenticationPrincipal User user,
            @PathVariable String productId
    ) {
        return ApiResponse.<WishlistItemResponse>builder()
                .result(wishlistService.addToWishlist(user, productId))
                .build();
    }

    @DeleteMapping("/{productId}")
    public ApiResponse<Void> removeFromWishlist(
            @AuthenticationPrincipal User user,
            @PathVariable String productId
    ) {
        wishlistService.removeFromWishlist(user, productId);
        return ApiResponse.<Void>builder()
                .message("Wishlist item removed successfully")
                .build();
    }

    @DeleteMapping
    public ApiResponse<Void> clearWishlist(@AuthenticationPrincipal User user) {
        wishlistService.clearWishlist(user);
        return ApiResponse.<Void>builder()
                .message("Wishlist cleared successfully")
                .build();
    }

    @PostMapping("/move-to-cart/{productId}")
    public ApiResponse<Void> moveToCart(
            @AuthenticationPrincipal User user,
            @PathVariable String productId
    ) {
        wishlistService.moveToCart(user, productId);
        return ApiResponse.<Void>builder()
                .message("Wishlist item moved to cart successfully")
                .build();
    }
}
