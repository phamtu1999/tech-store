package com.techstore.service.order;

import com.techstore.entity.order.Coupon;
import com.techstore.entity.order.DiscountType;
import com.techstore.exception.AppException;
import com.techstore.exception.ErrorCode;
import com.techstore.repository.order.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CouponService {

    private final CouponRepository couponRepository;

    @Transactional(readOnly = true)
    public Page<Coupon> getAllCoupons(Pageable pageable) {
        return couponRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public Coupon getCouponById(String id) {
        return couponRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ENTITY_NOT_FOUND));
    }

    @Transactional(readOnly = true)
    public Optional<Coupon> findByCode(String code) {
        return couponRepository.findByCodeAndActiveTrue(code);
    }

    @Transactional
    public Coupon createCoupon(Coupon coupon) {
        if (couponRepository.findByCodeAndActiveTrue(coupon.getCode()).isPresent()) {
            throw new AppException(ErrorCode.COUPON_ALREADY_EXISTS);
        }
        return couponRepository.save(coupon);
    }

    @Transactional
    public Coupon updateCoupon(String id, Coupon couponDetails) {
        Coupon coupon = getCouponById(id);
        
        if (couponDetails.getCode() != null) {
            coupon.setCode(couponDetails.getCode());
        }
        coupon.setDiscountType(couponDetails.getDiscountType());
        coupon.setDiscountValue(couponDetails.getDiscountValue());
        coupon.setMinPurchase(couponDetails.getMinPurchase());
        coupon.setMaxDiscount(couponDetails.getMaxDiscount());
        coupon.setUsageLimit(couponDetails.getUsageLimit());
        coupon.setExpirationDate(couponDetails.getExpirationDate());
        coupon.setActive(couponDetails.isActive());
        
        return couponRepository.save(coupon);
    }

    @Transactional
    public void deleteCoupon(String id) {
        Coupon coupon = getCouponById(id);
        coupon.setActive(false); // Soft delete
        couponRepository.save(coupon);
    }

    @Transactional(readOnly = true)
    public boolean isValid(String code, java.math.BigDecimal subTotal) {
        Optional<Coupon> couponOpt = couponRepository.findByCodeAndActiveTrue(code);
        if (couponOpt.isEmpty()) return false;
        
        Coupon coupon = couponOpt.get();
        if (coupon.getExpirationDate().isBefore(LocalDateTime.now())) return false;
        if (coupon.getUsageLimit() > 0 && coupon.getUsedCount() >= coupon.getUsageLimit()) return false;
        if (subTotal.compareTo(coupon.getMinPurchase()) < 0) return false;
        
        return true;
    }
}
