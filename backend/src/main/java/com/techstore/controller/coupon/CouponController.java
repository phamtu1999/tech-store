package com.techstore.controller.coupon;

import com.techstore.dto.ApiResponse;
import com.techstore.dto.order.CouponValidationResponse;
import com.techstore.entity.user.User;
import com.techstore.security.RateLimiter;
import com.techstore.service.order.CouponService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/v1/coupons")
@RequiredArgsConstructor
public class CouponController {

    private final CouponService couponService;

    @GetMapping("/validate")
    @RateLimiter(name = "validate_coupon", capacity = 10)
    public ApiResponse<CouponValidationResponse> validateCoupon(
            @RequestParam String code,
            @RequestParam BigDecimal orderValue,
            @AuthenticationPrincipal User user
    ) {
        return ApiResponse.<CouponValidationResponse>builder()
                .result(couponService.validateCoupon(code, orderValue, user))
                .build();
    }
}
