package com.techstore.service.inventory;

import com.techstore.entity.inventory.TransactionType;
import com.techstore.entity.product.ProductVariant;
import com.techstore.repository.inventory.InventoryReceiptRepository;
import com.techstore.repository.inventory.InventoryTransactionRepository;
import com.techstore.repository.product.ProductVariantRepository;
import com.techstore.dto.inventory.InventoryReceiptRequest;
import com.techstore.entity.inventory.InventoryReceipt;
import com.techstore.entity.inventory.InventoryReceiptItem;
import com.techstore.entity.user.User;
import com.techstore.repository.user.UserRepository;
import com.techstore.service.inventory.InventoryTransactionService;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final ProductVariantRepository variantRepository;
    private final InventoryTransactionService inventoryTransactionService;
    private final InventoryTransactionRepository inventoryTransactionRepository;
    private final InventoryReceiptRepository inventoryReceiptRepository;
    private final UserRepository userRepository;

    public void processTransaction(String variantId, TransactionType type, Integer quantity, BigDecimal costPrice, String referenceNumber, String note, String userId, String warehouse) {
        inventoryTransactionService.processTransaction(
                variantId,
                type,
                quantity,
                costPrice,
                referenceNumber,
                note,
                userId,
                warehouse
        );
    }

    @Transactional
    public com.techstore.dto.inventory.InventoryReceiptResponse createReceipt(InventoryReceiptRequest request, String adminId) {
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin user not found"));

        // 1. Tạo phiếu nhập kho (Header)
        InventoryReceipt receipt = InventoryReceipt.builder()
                .receiptNumber("PNK-" + System.currentTimeMillis())
                .supplierName(request.getSupplierName())
                .contactNumber(request.getContactNumber())
                .note(request.getNote())
                .totalAmount(BigDecimal.ZERO)
                .createdBy(admin)
                .build();

        BigDecimal totalAmount = BigDecimal.ZERO;
        List<InventoryReceiptItem> receiptItems = new java.util.ArrayList<>();

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
        
        return com.techstore.dto.inventory.InventoryReceiptResponse.builder()
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

    @Transactional(readOnly = true)
    public List<com.techstore.dto.inventory.SimpleProductVariantResponse> getLowStockVariants() {
        return variantRepository.findLowStockVariants().stream()
                .map(this::mapToSimpleResponse)
                .collect(java.util.stream.Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<com.techstore.dto.inventory.SimpleProductVariantResponse> getAllVariants(Pageable pageable, String search, String filter) {
        boolean isLowStockRequest = "low-stock".equalsIgnoreCase(filter);
        String normalizedSearch = search == null ? "" : search.trim().toLowerCase(Locale.ROOT);

        List<ProductVariant> filteredVariants = (isLowStockRequest
                ? variantRepository.findLowStockVariants()
                : variantRepository.findAll()).stream()
                .filter(variant -> normalizedSearch.isEmpty() || matchesInventorySearch(variant, normalizedSearch))
                .sorted(Comparator.comparing(ProductVariant::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .collect(Collectors.toList());

        int totalElements = filteredVariants.size();
        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), totalElements);

        List<com.techstore.dto.inventory.SimpleProductVariantResponse> content = start >= totalElements
                ? List.of()
                : filteredVariants.subList(start, end).stream()
                        .map(this::mapToSimpleResponse)
                        .collect(Collectors.toList());

        return new PageImpl<>(content, pageable, totalElements);
    }

    @Transactional(readOnly = true)
    public Page<com.techstore.dto.inventory.InventoryTransactionResponse> getTransactionHistory(String variantId, Pageable pageable) {
        Page<com.techstore.entity.inventory.InventoryTransaction> transactions;
        if (variantId != null) {
            transactions = inventoryTransactionRepository.findByVariantId(variantId, pageable);
        } else {
            transactions = inventoryTransactionRepository.findAllByOrderByCreatedAtDesc(pageable);
        }
        return transactions.map(this::mapToTransactionResponse);
    }
    
    private com.techstore.dto.inventory.SimpleProductVariantResponse mapToSimpleResponse(ProductVariant variant) {
        String imageUrl = null;
        // Keep pageable inventory queries stable by not fetch-joining images up front.
        if (variant.getProduct().getImages() != null && !variant.getProduct().getImages().isEmpty()) {
            imageUrl = variant.getProduct().getImages().iterator().next().getImageUrl();
        }

        return com.techstore.dto.inventory.SimpleProductVariantResponse.builder()
                .id(variant.getId())
                .productName(variant.getProduct().getName())
                .variantName(variant.getName())
                .sku(variant.getSku())
                .price(variant.getPrice())
                .costPrice(variant.getCostPrice() != null ? variant.getCostPrice() : java.math.BigDecimal.ZERO)
                .stockQuantity(variant.getStockQuantity())
                .imageUrl(imageUrl)
                .active(variant.isActive())
                .build();
    }

    private boolean matchesInventorySearch(ProductVariant variant, String normalizedSearch) {
        return containsIgnoreCase(variant.getProduct().getName(), normalizedSearch)
                || containsIgnoreCase(variant.getName(), normalizedSearch)
                || containsIgnoreCase(variant.getSku(), normalizedSearch);
    }

    private boolean containsIgnoreCase(String source, String normalizedSearch) {
        return source != null && source.toLowerCase(Locale.ROOT).contains(normalizedSearch);
    }

    private com.techstore.dto.inventory.InventoryTransactionResponse mapToTransactionResponse(com.techstore.entity.inventory.InventoryTransaction t) {
        return com.techstore.dto.inventory.InventoryTransactionResponse.builder()
                .id(t.getId())
                .variantId(t.getVariant().getId())
                .variantName(t.getVariant().getProduct().getName() + " - " + t.getVariant().getName())
                .sku(t.getVariant().getSku())
                .transactionType(t.getTransactionType())
                .quantity(t.getQuantity())
                .balanceAfter(t.getBalanceAfter())
                .referenceNumber(t.getReferenceNumber())
                .note(t.getNote())
                .createdBy(t.getCreatedBy())
                .warehouseLocation(t.getWarehouseLocation())
                .createdAt(t.getCreatedAt())
                .build();
    }

    @Transactional(readOnly = true)
    public BigDecimal calculateTotalInventoryValue() {
        return variantRepository.findAll().stream()
                .filter(v -> v.getCostPrice() != null)
                .map(v -> v.getCostPrice().multiply(BigDecimal.valueOf(v.getStockQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
