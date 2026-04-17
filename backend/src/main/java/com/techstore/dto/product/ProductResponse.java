package com.techstore.dto.product;

import com.techstore.dto.brand.BrandResponse;
import com.techstore.dto.category.CategoryResponse;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductResponse {
    Long id;
    String name;
    String slug;
    String description;
    CategoryResponse category;
    BrandResponse brand;
    List<ProductVariantResponse> variants;
    List<ProductAttributeResponse> attributes;
    List<String> imageUrls;
    boolean active;
    BigDecimal price;
    BigDecimal originalPrice;
    Double rating;
    Long reviewCount;
    Long soldCount;
    Integer discountPercentage;
    Boolean isNew;
    LocalDateTime createdAt;
}
