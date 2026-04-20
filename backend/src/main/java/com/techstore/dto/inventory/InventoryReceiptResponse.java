package com.techstore.dto.inventory;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryReceiptResponse {
    private Long id;
    private String receiptNumber;
    private String supplierName;
    private String contactNumber;
    private String note;
    private BigDecimal totalAmount;
    private String createdBy; // Name or Email of user
    private String status;
    private LocalDateTime createdAt;
}
