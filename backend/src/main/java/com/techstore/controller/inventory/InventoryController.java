package com.techstore.controller.inventory;

import com.techstore.dto.ApiResponse;
import com.techstore.dto.inventory.InventoryTransactionRequest;
import com.techstore.entity.inventory.InventoryTransaction;
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

    @GetMapping("/history")
    public ApiResponse<Page<InventoryTransaction>> getHistory(
            @RequestParam(required = false) Long variantId,
            Pageable pageable
    ) {
        return ApiResponse.<Page<InventoryTransaction>>builder()
                .result(inventoryService.getTransactionHistory(variantId, pageable))
                .build();
    }

    @GetMapping("/low-stock")
    public ApiResponse<List<ProductVariant>> getLowStock() {
        return ApiResponse.<List<ProductVariant>>builder()
                .result(inventoryService.getLowStockVariants())
                .build();
    }

    @GetMapping("/variants")
    public ApiResponse<List<ProductVariant>> getAllVariants() {
        return ApiResponse.<List<ProductVariant>>builder()
                .result(inventoryService.getAllVariants())
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
