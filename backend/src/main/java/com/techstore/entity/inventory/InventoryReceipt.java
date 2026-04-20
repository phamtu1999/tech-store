package com.techstore.entity.inventory;

import com.techstore.entity.base.BaseEntity;
import com.techstore.entity.user.User;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "inventory_receipts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryReceipt extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String receiptNumber; // Ví dụ: PNK-2024-001

    private String supplierName;
    
    private String contactNumber;

    @Column(columnDefinition = "TEXT")
    private String note;

    @Column(nullable = false)
    private BigDecimal totalAmount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_id")
    private User createdBy;

    @OneToMany(mappedBy = "receipt", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<InventoryReceiptItem> items = new ArrayList<>();

    @Column(nullable = false)
    @Builder.Default
    private String status = "COMPLETED"; // COMPLETED, CANCELLED
}
