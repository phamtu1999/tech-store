package com.techstore.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WishlistItemResponse {
    private String id;
    private String productId;
    private String variantId;
    private String productName;
    private String slug;
    private String productImage;
    private BigDecimal price;
    private boolean inStock;
}
