package com.techstore.dto.inventory;

import com.techstore.entity.inventory.TransactionType;

import lombok.*;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryTransactionRequest {
    private String variantId;
    private TransactionType type;
    private Integer quantity;
    private BigDecimal costPrice;
    private String referenceNumber;
    private String note;
    private String warehouse;
}
