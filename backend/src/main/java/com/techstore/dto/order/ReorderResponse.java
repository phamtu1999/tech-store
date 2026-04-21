package com.techstore.dto.order;

import com.techstore.dto.cart.CartResponse;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReorderResponse {
    CartResponse cart;
    List<UnavailableItem> unavailableItems;
    String message;
    int addedItemsCount;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class UnavailableItem {
        String variantId;
        String variantName;
        String variantSku;
        Integer requestedQuantity;
        String reason;
    }
}
