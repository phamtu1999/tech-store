package com.techstore.dto.analytics;

import com.techstore.dto.product.ProductResponse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationResponse {
    private ProductResponse product;
    private double recommendationScore;
    private String algorithmType; // HYBRID, COLLABORATIVE, CONTENT, FREQUENTLY_BOUGHT, POPULAR
}
