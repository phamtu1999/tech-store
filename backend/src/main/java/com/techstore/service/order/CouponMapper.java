package com.techstore.service.order;

import com.techstore.dto.order.CouponRequest;
import com.techstore.dto.order.CouponResponse;
import com.techstore.entity.order.Coupon;
import org.springframework.stereotype.Component;

@Component
public class CouponMapper {

    public Coupon mapToCoupon(CouponRequest request) {
        return Coupon.builder()
                .code(request.getCode().toUpperCase())
                .discountType(request.getDiscountType())
                .discountValue(request.getDiscountValue())
                .minPurchase(request.getMinPurchase())
                .maxDiscount(request.getMaxDiscount())
                .expirationDate(request.getExpirationDate())
                .usageLimit(request.getUsageLimit())
                .active(request.isActive())
                .build();
    }

    public void updateCouponFromRequest(Coupon coupon, CouponRequest request) {
        coupon.setCode(request.getCode().toUpperCase());
        coupon.setDiscountType(request.getDiscountType());
        coupon.setDiscountValue(request.getDiscountValue());
        coupon.setMinPurchase(request.getMinPurchase());
        coupon.setMaxDiscount(request.getMaxDiscount());
        coupon.setExpirationDate(request.getExpirationDate());
        coupon.setUsageLimit(request.getUsageLimit());
        coupon.setActive(request.isActive());
    }

    public CouponResponse mapToCouponResponse(Coupon coupon) {
        return CouponResponse.builder()
                .id(coupon.getId())
                .code(coupon.getCode())
                .discountType(coupon.getDiscountType())
                .discountValue(coupon.getDiscountValue())
                .minPurchase(coupon.getMinPurchase())
                .maxDiscount(coupon.getMaxDiscount())
                .expirationDate(coupon.getExpirationDate())
                .usageLimit(coupon.getUsageLimit())
                .usedCount(coupon.getUsedCount())
                .active(coupon.isActive())
                .build();
    }
}
