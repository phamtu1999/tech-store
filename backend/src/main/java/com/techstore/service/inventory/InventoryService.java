package com.techstore.service.inventory;

import com.techstore.entity.inventory.InventoryTransaction;
import com.techstore.entity.inventory.TransactionType;
import com.techstore.entity.product.ProductVariant;
import com.techstore.repository.inventory.InventoryTransactionRepository;
import com.techstore.repository.inventory.InventoryReceiptRepository;
import com.techstore.repository.product.ProductVariantRepository;
import com.techstore.dto.inventory.InventoryReceiptRequest;
import com.techstore.entity.inventory.InventoryReceipt;
import com.techstore.entity.inventory.InventoryReceiptItem;
import com.techstore.entity.user.User;
import com.techstore.repository.user.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final ProductVariantRepository variantRepository;
    private final InventoryTransactionRepository inventoryTransactionRepository;
    private final InventoryReceiptRepository inventoryReceiptRepository;
    private final UserRepository userRepository;

    @Transactional
    public void processTransaction(Long variantId, TransactionType type, Integer quantity, BigDecimal costPrice, String referenceNumber, String note, Long userId, String warehouse) {
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
                newStock = quantity; // For adjustments, we set the absolute quantity
                if (costPrice != null) variant.setCostPrice(costPrice);
                break;
            default:
                throw new IllegalArgumentException("Unknown transaction type");
        }

        // 1. Update Variant Stock
        variant.setStockQuantity(newStock);
        variantRepository.save(variant);

        // 2. Log History
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

    @Transactional
    public InventoryReceipt createReceipt(InventoryReceiptRequest request, Long adminId) {
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin user not found"));

        // 1. Tạo phiếu nhập kho (Header)
        InventoryReceipt receipt = InventoryReceipt.builder()
                .receiptNumber("PNK-" + System.currentTimeMillis()) // Tạo mã phiếu tự động
                .supplierName(request.getSupplierName())
                .contactNumber(request.getContactNumber())
                .note(request.getNote())
                .totalAmount(BigDecimal.ZERO) // Sẽ tính toán dựa trên items
                .createdBy(admin)
                .build();

        BigDecimal totalAmount = BigDecimal.ZERO;
        List<InventoryReceiptItem> receiptItems = new java.util.ArrayList<>();

        // 2. Xử lý từng mặt hàng trong phiếu
        for (InventoryReceiptRequest.ItemRequest itemReq : request.getItems()) {
            ProductVariant variant = variantRepository.findById(itemReq.getVariantId())
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

            // 3. Gọi logic nghiệp vụ cốt lõi để cập nhật kho và ghi log động
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
        
        return inventoryReceiptRepository.save(receipt);
    }

    public List<ProductVariant> getLowStockVariants() {
        return variantRepository.findLowStockVariants();
    }

    public List<ProductVariant> getAllVariants() {
        return variantRepository.findAll();
    }

    public Page<InventoryTransaction> getTransactionHistory(Long variantId, Pageable pageable) {
        if (variantId != null) {
            return inventoryTransactionRepository.findByVariantId(variantId, pageable);
        }
        return inventoryTransactionRepository.findAll(pageable);
    }
    
    public BigDecimal calculateTotalInventoryValue() {
        return variantRepository.findAll().stream()
                .filter(v -> v.getCostPrice() != null)
                .map(v -> v.getCostPrice().multiply(BigDecimal.valueOf(v.getStockQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
