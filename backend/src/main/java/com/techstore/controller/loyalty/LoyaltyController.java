package com.techstore.controller.loyalty;

import com.techstore.dto.ApiResponse;
import com.techstore.dto.PageResponse;
import com.techstore.dto.loyalty.LoyaltyTransactionResponse;
import com.techstore.entity.user.User;
import com.techstore.service.loyalty.LoyaltyService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/loyalty")
@RequiredArgsConstructor
public class LoyaltyController {

    private final LoyaltyService loyaltyService;

    @GetMapping("/my-history")
    public ApiResponse<PageResponse<LoyaltyTransactionResponse>> getMyHistory(
            @AuthenticationPrincipal User user,
            Pageable pageable
    ) {
        return ApiResponse.<PageResponse<LoyaltyTransactionResponse>>builder()
                .result(loyaltyService.getMyHistory(user, pageable))
                .build();
    }

    @GetMapping("/my-points")
    public ApiResponse<Integer> getMyPoints(@AuthenticationPrincipal User user) {
        return ApiResponse.<Integer>builder()
                .result(user.getLoyaltyPoints())
                .build();
    }
}
