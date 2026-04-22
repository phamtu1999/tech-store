package com.techstore.entity.product;

import com.techstore.entity.base.BaseEntity;


import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "product_variants", indexes = {
    @Index(name = "idx_variant_sku", columnList = "sku", unique = true),
    @Index(name = "idx_variant_product_active", columnList = "product_id, active"),
    @Index(name = "idx_variant_product_sort", columnList = "product_id, sort_order"),
    @Index(name = "idx_variant_product_active_price", columnList = "product_id, active, price")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class ProductVariant extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false, unique = true)
    private String sku;

    private String name; // E.g., "128GB Gold"

    @Column(nullable = false)
    private BigDecimal price;

    @Column(name = "original_price")
    private BigDecimal originalPrice;

    @Column(name = "cost_price")
    private BigDecimal costPrice;

    @Column(nullable = false)
    @Builder.Default
    private Integer stockQuantity = 0;

    @Column(name = "sort_order")
    @Builder.Default
    private Integer sortOrder = 0;

    private String color;
    
    private String size;

    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;

    @Version
    private Long version;
}
