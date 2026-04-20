package com.techstore.dto.inventory;

import com.techstore.entity.inventory.TransactionType;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryTransactionResponse {
    private Long id;
    private Long variantId;
    private String variantName;
    private String sku;
    private TransactionType transactionType;
    private Integer quantity;
    private Integer balanceAfter;
    private String referenceNumber;
    private String note;
    private Long createdBy;
    private String warehouseLocation;
    private LocalDateTime createdAt;
}
