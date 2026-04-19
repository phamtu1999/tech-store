package com.techstore.dto.product;

import lombok.*;
import lombok.experimental.FieldDefaults;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProductVariantResponse {
    Long id;
    String sku;
    String name;
    BigDecimal price;
    Integer stockQuantity;
    String color;
    String size;
}
