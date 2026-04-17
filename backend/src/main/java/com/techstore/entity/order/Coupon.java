package com.techstore.entity.order;

import com.techstore.entity.base.BaseEntity;


import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "coupons")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Coupon extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String code;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DiscountType discountType;

    @Column(nullable = false)
    private BigDecimal discountValue;

    @Column(nullable = false)
    @Builder.Default
    private BigDecimal minPurchase = BigDecimal.ZERO;

    private BigDecimal maxDiscount; // Useful for PERCENT type

    @Column(nullable = false)
    @Builder.Default
    private Integer usageLimit = 0; // 0 = unlimited

    @Column(nullable = false)
    @Builder.Default
    private Integer usedCount = 0;

    @Column(nullable = false)
    private LocalDateTime expirationDate;

    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;

    @Version
    private Long version; // Optimistic Locking field to handle Race conditions on usage
}
