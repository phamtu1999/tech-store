package com.techstore.controller.inventory;

import com.techstore.dto.ApiResponse;
import com.techstore.dto.inventory.InventoryTransactionRequest;
import com.techstore.dto.inventory.InventoryReceiptRequest;
import com.techstore.entity.inventory.InventoryTransaction;
import com.techstore.entity.inventory.InventoryReceipt;
import com.techstore.entity.product.ProductVariant;
import com.techstore.entity.user.User;
import com.techstore.service.inventory.InventoryService;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/inventory")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'SUPER_ADMIN')")
public class InventoryController {

    private final InventoryService inventoryService;

    @PostMapping("/transaction")
    public ApiResponse<String> processTransaction(
            @RequestBody InventoryTransactionRequest request,
            @AuthenticationPrincipal User user
    ) {
        inventoryService.processTransaction(
                request.getVariantId(),
                request.getType(),
                request.getQuantity(),
                request.getCostPrice(),
                request.getReferenceNumber(),
                request.getNote(),
                user.getId(),
                request.getWarehouse()
        );
        return ApiResponse.<String>builder()
                .message("Inventory updated successfully")
                .result("OK")
                .build();
    }

    @PostMapping("/receipts")
    public ApiResponse<com.techstore.dto.inventory.InventoryReceiptResponse> createReceipt(
            @RequestBody InventoryReceiptRequest request,
            @AuthenticationPrincipal User user
    ) {
        return ApiResponse.<com.techstore.dto.inventory.InventoryReceiptResponse>builder()
                .message("Warehouse receipt created successfully")
                .result(inventoryService.createReceipt(request, user.getId()))
                .build();
    }

    @GetMapping("/history")
    public ApiResponse<Page<com.techstore.dto.inventory.InventoryTransactionResponse>> getHistory(
            @RequestParam(required = false) String variantId,
            Pageable pageable
    ) {
        return ApiResponse.<Page<com.techstore.dto.inventory.InventoryTransactionResponse>>builder()
                .result(inventoryService.getTransactionHistory(variantId, pageable))
                .build();
    }

    @GetMapping("/low-stock")
    public ApiResponse<List<com.techstore.dto.inventory.SimpleProductVariantResponse>> getLowStock() {
        return ApiResponse.<List<com.techstore.dto.inventory.SimpleProductVariantResponse>>builder()
                .result(inventoryService.getLowStockVariants())
                .build();
    }

    @GetMapping("/variants")
    public ApiResponse<Page<com.techstore.dto.inventory.SimpleProductVariantResponse>> getAllVariants(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String filter,
            Pageable pageable
    ) {
        return ApiResponse.<Page<com.techstore.dto.inventory.SimpleProductVariantResponse>>builder()
                .result(inventoryService.getAllVariants(pageable, search, filter))
                .build();
    }

    @GetMapping("/valuation")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')") // Usually staff don't see total warehouse value
    public ApiResponse<BigDecimal> getValuation() {
        return ApiResponse.<BigDecimal>builder()
                .result(inventoryService.calculateTotalInventoryValue())
                .build();
    }
}
