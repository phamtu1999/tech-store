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
    @JsonFormat(pattern = "dd/MM/yyyy")
    private java.time.LocalDate expirationDate;
    private boolean active;
}
