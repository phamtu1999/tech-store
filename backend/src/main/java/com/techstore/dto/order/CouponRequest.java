package com.techstore.dto.order;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.techstore.entity.order.DiscountType;
import lombok.*;

import java.math.BigDecimal;

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
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    private java.time.LocalDateTime expirationDate;
    private boolean active;
}
