package com.techstore.entity.inventory;

import com.techstore.entity.base.BaseEntity;
import com.techstore.entity.product.ProductVariant;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "inventory_transactions", indexes = {
    @Index(name = "idx_inventory_variant_time", columnList = "variant_id, created_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class InventoryTransaction extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variant_id", nullable = false)
    private ProductVariant variant;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType transactionType;

    @Column(nullable = false)
    private Integer quantity; // Always positive, operation depends on TransactionType

    @Column(nullable = false)
    private Integer balanceAfter; // Snapshot of the stock after this transaction

    private String referenceNumber; // E.g., Order ID, Receipt ID

    private String note;

    private String createdBy; // ID of the User/Admin who triggered it, or System if null

    private String warehouseLocation; // E.g., "KHO_HCM", "KHO_HN"
}
