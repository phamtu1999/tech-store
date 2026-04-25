package com.techstore.service.inventory;

import com.techstore.dto.inventory.InventoryReceiptRequest;
import com.techstore.dto.inventory.InventoryReceiptResponse;
import com.techstore.entity.inventory.InventoryReceipt;
import com.techstore.entity.inventory.InventoryReceiptItem;
import com.techstore.entity.inventory.InventoryTransaction;
import com.techstore.entity.inventory.TransactionType;
import com.techstore.entity.product.ProductVariant;
import com.techstore.entity.user.User;
import com.techstore.repository.inventory.InventoryReceiptRepository;
import com.techstore.repository.inventory.InventoryTransactionRepository;
import com.techstore.repository.product.ProductVariantRepository;
import com.techstore.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryCommandService {

    private final ProductVariantRepository variantRepository;
    private final InventoryTransactionRepository inventoryTransactionRepository;
    private final InventoryReceiptRepository inventoryReceiptRepository;
    private final UserRepository userRepository;

    @Transactional
    public InventoryTransaction processTransaction(String variantId, TransactionType type, Integer quantity, BigDecimal costPrice, String referenceNumber, String note, String userId, String warehouse) {
        if (quantity == null || (type != TransactionType.ADJUSTMENT && quantity <= 0)) {
            throw new IllegalArgumentException("Quantity must be positive for non-adjustment transactions");
        }

        ProductVariant variant = variantRepository.findByIdWithLock(variantId)
                .orElseThrow(() -> new RuntimeException("Variant not found"));

        int currentStock = variant.getStockQuantity();
        int newStock;
        int changedAmount;

        switch (type) {
            case IMPORT -> {
                newStock = currentStock + quantity;
                changedAmount = quantity;
                if (costPrice != null) variant.setCostPrice(costPrice);
            }
            case RETURN -> {
                newStock = currentStock + quantity;
                changedAmount = quantity;
            }
            case EXPORT, DAMAGED -> {
                if (currentStock < quantity) {
                    throw new RuntimeException("Insufficient stock for variant: " + variant.getSku());
                }
                newStock = currentStock - quantity;
                changedAmount = quantity;
            }
            case ADJUSTMENT -> {
                newStock = quantity;
                changedAmount = Math.abs(newStock - currentStock);
                if (costPrice != null) variant.setCostPrice(costPrice);
            }
            default -> throw new IllegalArgumentException("Unknown transaction type");
        }

        variant.setStockQuantity(newStock);

        InventoryTransaction transaction = InventoryTransaction.builder()
                .variant(variant)
                .transactionType(type)
                .quantity(changedAmount)
                .balanceAfter(newStock)
                .referenceNumber(referenceNumber)
                .note(note)
                .createdBy(userId)
                .warehouseLocation(warehouse)
                .build();

        return inventoryTransactionRepository.save(transaction);
    }

    @Transactional
    public InventoryReceiptResponse createReceipt(InventoryReceiptRequest request, String adminId) {
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin user not found"));

        InventoryReceipt receipt = InventoryReceipt.builder()
                .receiptNumber("PNK-" + System.currentTimeMillis())
                .supplierName(request.getSupplierName())
                .contactNumber(request.getContactNumber())
                .note(request.getNote())
                .totalAmount(BigDecimal.ZERO)
                .createdBy(admin)
                .build();

        BigDecimal totalAmount = BigDecimal.ZERO;
        List<InventoryReceiptItem> receiptItems = new ArrayList<>();

        for (InventoryReceiptRequest.ItemRequest itemReq : request.getItems()) {
            ProductVariant variant = variantRepository.findByIdWithLock(itemReq.getVariantId())
                    .orElseThrow(() -> new RuntimeException("Variant not found: " + itemReq.getVariantId()));

            BigDecimal subtotal = itemReq.getPurchasePrice().multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            totalAmount = totalAmount.add(subtotal);

            InventoryReceiptItem item = InventoryReceiptItem.builder()
                    .receipt(receipt)
                    .variant(variant)
                    .quantity(itemReq.getQuantity())
                    .purchasePrice(itemReq.getPurchasePrice())
                    .subtotal(subtotal)
                    .build();
            receiptItems.add(item);

            processTransaction(
                    variant.getId(),
                    TransactionType.IMPORT,
                    itemReq.getQuantity(),
                    itemReq.getPurchasePrice(),
                    receipt.getReceiptNumber(),
                    "Nhập hàng từ nhà cung cấp: " + request.getSupplierName(),
                    adminId,
                    "KHO_CHINH"
            );
        }

        receipt.setItems(receiptItems);
        receipt.setTotalAmount(totalAmount);

        InventoryReceipt saved = inventoryReceiptRepository.save(receipt);

        return InventoryReceiptResponse.builder()
                .id(saved.getId())
                .receiptNumber(saved.getReceiptNumber())
                .supplierName(saved.getSupplierName())
                .contactNumber(saved.getContactNumber())
                .note(saved.getNote())
                .totalAmount(saved.getTotalAmount())
                .createdBy(admin.getFullName() != null ? admin.getFullName() : admin.getEmail())
                .status(saved.getStatus())
                .createdAt(saved.getCreatedAt())
                .build();
    }
}
