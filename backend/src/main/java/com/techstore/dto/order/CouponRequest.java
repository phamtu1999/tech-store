package com.techstore.dto.order;

import com.techstore.entity.order.DiscountType;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CouponRequest {
    private String code;
    private DiscountType discountType;
    private BigDecimal discountValue;
    private BigDecimal minPurchase;
    private BigDecimal maxDiscount;
    private Integer usageLimit;
    private LocalDateTime expirationDate;
    private boolean active;
}
