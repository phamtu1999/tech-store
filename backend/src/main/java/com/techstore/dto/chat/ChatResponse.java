package com.techstore.dto.chat;

import com.techstore.dto.product.ProductResponse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatResponse {
    private String reply;
    private String sessionId;
    private List<ProductResponse> suggestedProducts;
    private boolean requiresHuman;
}
