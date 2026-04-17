package com.techstore.entity.order;

import com.techstore.entity.base.BaseEntity;
import com.techstore.entity.product.ProductVariant;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    // We keep variant as a reference for re-ordering, but we use variantName/Sku for snapshot
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variant_id")
    private ProductVariant variant;

    // Snapshot fields
    @Column(nullable = false)
    private String variantName;

    @Column(nullable = false)
    private String variantSku;

    private String imageUrl;

    @Column(nullable = false)
    private BigDecimal priceAtPurchase;

    @Column(nullable = false)
    private Integer quantity;
}
