package com.techstore.dto.inventory;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryReceiptRequest {
    private String supplierName;
    private String contactNumber;
    private String note;
    private List<ItemRequest> items;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ItemRequest {
        private String variantId;
        private Integer quantity;
        private BigDecimal purchasePrice;
    }
}
