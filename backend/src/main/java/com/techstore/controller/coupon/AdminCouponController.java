package com.techstore.controller.coupon;

import com.techstore.dto.ApiResponse;
import com.techstore.dto.PageResponse;
import com.techstore.dto.order.CouponRequest;
import com.techstore.dto.order.CouponResponse;
import com.techstore.service.order.CouponService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/coupons")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminCouponController {

    private final CouponService couponService;

    @GetMapping
    public ApiResponse<PageResponse<CouponResponse>> getAllCoupons(
            @RequestParam(required = false) String query,
            Pageable pageable
    ) {
        return ApiResponse.<PageResponse<CouponResponse>>builder()
                .result(couponService.getAllCoupons(query, pageable))
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<CouponResponse> getCoupon(@PathVariable String id) {
        return ApiResponse.<CouponResponse>builder()
                .result(couponService.getCouponById(id))
                .build();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<CouponResponse> createCoupon(@Valid @RequestBody CouponRequest request) {
        return ApiResponse.<CouponResponse>builder()
                .result(couponService.createCoupon(request))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<CouponResponse> updateCoupon(
            @PathVariable String id,
            @Valid @RequestBody CouponRequest request
    ) {
        return ApiResponse.<CouponResponse>builder()
                .result(couponService.updateCoupon(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteCoupon(@PathVariable String id) {
        couponService.deleteCoupon(id);
        return ApiResponse.<Void>builder()
                .message("Deleted successfully")
                .build();
    }
}
