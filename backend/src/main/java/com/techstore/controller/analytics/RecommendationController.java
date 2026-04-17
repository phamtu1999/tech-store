package com.techstore.controller.analytics;

import com.techstore.dto.analytics.RecommendationResponse;
import com.techstore.dto.ApiResponse;
import com.techstore.entity.user.User;
import com.techstore.service.analytics.RecommendationService;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;

    @GetMapping("/personalized")
    public ApiResponse<List<RecommendationResponse>> getPersonalized(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "10") int limit
    ) {
        return ApiResponse.<List<RecommendationResponse>>builder()
                .result(recommendationService.getPersonalized(user, Math.min(limit, 50)))
                .build();
    }

    @GetMapping("/similar/{productId}")
    public ApiResponse<List<RecommendationResponse>> getSimilar(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "10") int limit
    ) {
        return ApiResponse.<List<RecommendationResponse>>builder()
                .result(recommendationService.getSimilar(productId, Math.min(limit, 50)))
                .build();
    }

    @GetMapping("/frequently-bought-together/{productId}")
    public ApiResponse<List<RecommendationResponse>> getFrequentlyBoughtTogether(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "10") int limit
    ) {
        return ApiResponse.<List<RecommendationResponse>>builder()
                .result(recommendationService.getFrequentlyBoughtTogether(productId, Math.min(limit, 50)))
                .build();
    }

    @GetMapping("/homepage")
    public ApiResponse<java.util.Map<String, List<RecommendationResponse>>> getHomepageLayout(
            @AuthenticationPrincipal User user
    ) {
        return ApiResponse.<java.util.Map<String, List<RecommendationResponse>>>builder()
                .result(recommendationService.getHomepageLayout(user))
                .build();
    }

    @GetMapping("/popular")
    public ApiResponse<List<RecommendationResponse>> getPopular(@RequestParam(defaultValue = "10") int limit) {
        return ApiResponse.<List<RecommendationResponse>>builder()
                .result(recommendationService.getPopular(Math.min(limit, 50)))
                .build();
    }

    @GetMapping("/trending")
    public ApiResponse<List<RecommendationResponse>> getTrending(@RequestParam(defaultValue = "10") int limit) {
        return ApiResponse.<List<RecommendationResponse>>builder()
                .result(recommendationService.getTrending(Math.min(limit, 50)))
                .build();
    }

    @PostMapping("/track/view/{productId}")
    public ApiResponse<Void> trackView(@AuthenticationPrincipal User user, @PathVariable Long productId) {
        recommendationService.trackView(user, productId);
        return ApiResponse.<Void>builder().message("Tracked view").build();
    }

    @PostMapping("/track/click/{productId}")
    public ApiResponse<Void> trackClick(@AuthenticationPrincipal User user, @PathVariable Long productId) {
        recommendationService.trackClick(user, productId);
        return ApiResponse.<Void>builder().message("Tracked click").build();
    }
}
