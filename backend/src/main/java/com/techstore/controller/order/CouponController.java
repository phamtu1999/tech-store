package com.techstore.controller.order;

import com.techstore.dto.ApiResponse;
import com.techstore.dto.order.CouponRequest;
import com.techstore.entity.order.Coupon;
import com.techstore.service.order.CouponService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/v1/coupons")
@RequiredArgsConstructor
public class CouponController {

    private final CouponService couponService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'MANAGER')")
    public ApiResponse<Page<Coupon>> getAllCoupons(Pageable pageable) {
        return ApiResponse.<Page<Coupon>>builder()
                .result(couponService.getAllCoupons(pageable))
                .build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'MANAGER')")
    public ApiResponse<Coupon> getCouponById(@PathVariable String id) {
        return ApiResponse.<Coupon>builder()
                .result(couponService.getCouponById(id))
                .build();
    }

    @GetMapping("/validate")
    public ApiResponse<Boolean> validateCoupon(@RequestParam String code, @RequestParam BigDecimal subTotal) {
        return ApiResponse.<Boolean>builder()
                .result(couponService.isValid(code, subTotal))
                .build();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'MANAGER')")
    public ApiResponse<Coupon> createCoupon(@RequestBody CouponRequest request) {
        Coupon coupon = Coupon.builder()
                .code(request.getCode().toUpperCase())
                .discountType(request.getDiscountType())
                .discountValue(request.getDiscountValue())
                .minPurchase(request.getMinPurchase())
                .maxDiscount(request.getMaxDiscount())
                .usageLimit(request.getUsageLimit())
                .expirationDate(request.getExpirationDate())
                .active(request.isActive())
                .build();
                
        return ApiResponse.<Coupon>builder()
                .result(couponService.createCoupon(coupon))
                .build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'MANAGER')")
    public ApiResponse<Coupon> updateCoupon(@PathVariable String id, @RequestBody CouponRequest request) {
        Coupon coupon = Coupon.builder()
                .discountType(request.getDiscountType())
                .discountValue(request.getDiscountValue())
                .minPurchase(request.getMinPurchase())
                .maxDiscount(request.getMaxDiscount())
                .usageLimit(request.getUsageLimit())
                .expirationDate(request.getExpirationDate())
                .active(request.isActive())
                .build();
                
        return ApiResponse.<Coupon>builder()
                .result(couponService.updateCoupon(id, coupon))
                .build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'MANAGER')")
    public ApiResponse<Void> deleteCoupon(@PathVariable String id) {
        couponService.deleteCoupon(id);
        return ApiResponse.<Void>builder().build();
    }
}
