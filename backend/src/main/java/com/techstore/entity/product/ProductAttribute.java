package com.techstore.entity.product;

import com.techstore.entity.base.BaseEntity;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "product_attributes", indexes = {
    @Index(name = "idx_product_attributes_product", columnList = "product_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductAttribute extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private String attributeName; // E.g., "RAM", "Screen"

    @Column(nullable = false)
    private String attributeValue; // E.g., "16GB", "OLED 6.1 inch"
    
    // Optional: attributeType could be added later for frontend rendering context if needed.
}
