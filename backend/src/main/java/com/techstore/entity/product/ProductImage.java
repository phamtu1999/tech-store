package com.techstore.entity.product;

import com.techstore.entity.base.BaseEntity;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "product_images")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductImage extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private String imageUrl;

    @Column(nullable = false)
    @Builder.Default
    private boolean isThumbnail = false;
    
    // Note: The logic to ensure only one thumbnail per product 
    // will be enforced at the Application/Service layer when saving.
}
