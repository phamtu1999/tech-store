package com.techstore.dto.order;


import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CheckoutRequest {
    String receiverName;
    String receiverPhone;
    String shippingAddress;
    String couponCode;
    Integer pointsToSpend;
    String note;
    String idempotencyKey; // Unique key from frontend
    List<CartItemRequest> items;

    @Data
    public static class CartItemRequest {
        String variantId;
        Integer quantity;
    }
}
