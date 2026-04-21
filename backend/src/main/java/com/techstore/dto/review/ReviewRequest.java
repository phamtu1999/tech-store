package com.techstore.dto.review;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewRequest {
    private String productId;
    private String orderId;
    private Integer rating;
    private String comment;
    private List<String> imageUrls;
}
