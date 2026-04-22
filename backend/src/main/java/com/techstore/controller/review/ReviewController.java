package com.techstore.controller.review;

import com.techstore.dto.ApiResponse;
import com.techstore.dto.review.ReviewRequest;
import com.techstore.dto.review.ReviewResponse;
import com.techstore.entity.user.User;
import com.techstore.service.review.ReviewService;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/product/{productId}")
    public ApiResponse<List<ReviewResponse>> getByProduct(@PathVariable String productId) {
        return ApiResponse.<List<ReviewResponse>>builder()
                .result(reviewService.getByProduct(productId))
                .build();
    }

    @GetMapping("/user/{userId}")
    public ApiResponse<List<ReviewResponse>> getByUser(@PathVariable String userId) {
        return ApiResponse.<List<ReviewResponse>>builder()
                .result(reviewService.getByUser(userId))
                .build();
    }

    @PostMapping
    public ApiResponse<ReviewResponse> create(
            @AuthenticationPrincipal User user,
            @RequestBody ReviewRequest request
    ) {
        return ApiResponse.<ReviewResponse>builder()
                .result(reviewService.create(user, request))
                .build();
    }

    @PutMapping("/{reviewId}")
    public ApiResponse<ReviewResponse> update(
            @AuthenticationPrincipal User user,
            @PathVariable String reviewId,
            @RequestBody ReviewRequest request
    ) {
        return ApiResponse.<ReviewResponse>builder()
                .result(reviewService.update(user, reviewId, request))
                .build();
    }

    @DeleteMapping("/{reviewId}")
    public ApiResponse<Void> delete(
            @AuthenticationPrincipal User user,
            @PathVariable String reviewId
    ) {
        reviewService.delete(user, reviewId);
        return ApiResponse.<Void>builder()
                .message("Đã xóa đánh giá")
                .build();
    }
}
