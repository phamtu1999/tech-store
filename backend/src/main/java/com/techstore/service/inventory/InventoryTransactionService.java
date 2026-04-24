package com.techstore.service.inventory;

import com.techstore.dto.inventory.InventoryTransactionRequest;
import com.techstore.entity.inventory.InventoryTransaction;
import com.techstore.entity.inventory.TransactionType;
import com.techstore.entity.product.ProductVariant;
import com.techstore.repository.inventory.InventoryTransactionRepository;
import com.techstore.repository.product.ProductVariantRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class InventoryTransactionService {

    private final ProductVariantRepository variantRepository;
    private final InventoryTransactionRepository inventoryTransactionRepository;

    @Transactional
    public void processTransaction(String variantId, TransactionType type, Integer quantity, BigDecimal costPrice, String referenceNumber, String note, String userId, String warehouse) {
        if (quantity == null || (type != TransactionType.ADJUSTMENT && quantity <= 0)) {
            throw new IllegalArgumentException("Quantity must be positive for non-adjustment transactions");
        }

        ProductVariant variant = variantRepository.findByIdWithLock(variantId)
                .orElseThrow(() -> new RuntimeException("Variant not found"));

        int currentStock = variant.getStockQuantity();
        int newStock;

        switch (type) {
            case IMPORT:
                newStock = currentStock + quantity;
                if (costPrice != null) variant.setCostPrice(costPrice);
                break;
            case RETURN:
                newStock = currentStock + quantity;
                break;
            case EXPORT:
            case DAMAGED:
                if (currentStock < quantity) {
                    throw new RuntimeException("Insufficient stock for variant: " + variant.getSku());
                }
                newStock = currentStock - quantity;
                break;
            case ADJUSTMENT:
                newStock = quantity;
                if (costPrice != null) variant.setCostPrice(costPrice);
                break;
            default:
                throw new IllegalArgumentException("Unknown transaction type");
        }

        variant.setStockQuantity(newStock);
        variantRepository.save(variant);

        InventoryTransaction transaction = InventoryTransaction.builder()
                .variant(variant)
                .transactionType(type)
                .quantity(Math.abs(newStock - currentStock))
                .balanceAfter(newStock)
                .referenceNumber(referenceNumber)
                .note(note)
                .createdBy(userId)
                .warehouseLocation(warehouse)
                .build();

        inventoryTransactionRepository.save(transaction);
    }
}
