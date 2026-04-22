package com.techstore.controller.category;

import com.techstore.dto.ApiResponse;
import com.techstore.dto.category.CategoryRequest;
import com.techstore.dto.category.CategoryResponse;
import com.techstore.entity.category.Category;
import com.techstore.service.category.CategoryService;


import com.techstore.security.LogAction;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ApiResponse<List<CategoryResponse>> getAllCategories() {
        return ApiResponse.<List<CategoryResponse>>builder()
                .result(categoryService.getAllCategories())
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<CategoryResponse> getCategoryById(@PathVariable String id) {
        return ApiResponse.<CategoryResponse>builder()
                .result(categoryService.getCategoryById(id))
                .build();
    }

    @LogAction("CREATE_CATEGORY")
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'SUPER_ADMIN')")
    public ApiResponse<CategoryResponse> createCategory(@RequestBody CategoryRequest request) {
        return ApiResponse.<CategoryResponse>builder()
                .result(categoryService.createCategory(request))
                .build();
    }

    @LogAction("UPDATE_CATEGORY")
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'SUPER_ADMIN')")
    public ApiResponse<CategoryResponse> updateCategory(@PathVariable String id, @RequestBody CategoryRequest request) {
        return ApiResponse.<CategoryResponse>builder()
                .result(categoryService.updateCategory(id, request))
                .build();
    }

    @LogAction("DELETE_CATEGORY")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'SUPER_ADMIN')")
    public ApiResponse<Void> deleteCategory(@PathVariable String id) {
        categoryService.deleteCategory(id);
        return ApiResponse.<Void>builder()
                .message("Category deleted successfully")
                .build();
    }

    @LogAction("ACTIVATE_ALL_CATEGORIES")
    @PostMapping("/admin/activate-all")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ApiResponse<Void> activateAll() {
        categoryService.activateAll();
        return ApiResponse.<Void>builder()
                .message("All categories activated successfully")
                .build();
    }

    @LogAction("UPDATE_CATEGORY_SORT_ORDER")
    @PatchMapping("/admin/sort-order")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'SUPER_ADMIN')")
    public ApiResponse<Void> updateSortOrder(@RequestBody List<Map<String, Object>> sortRequests) {
        categoryService.updateSortOrder(sortRequests);
        return ApiResponse.<Void>builder()
                .message("Category sort order updated successfully")
                .build();
    }

    @GetMapping("/tree")
    public ApiResponse<List<CategoryResponse>> getCategoryTree() {
        return ApiResponse.<List<CategoryResponse>>builder()
                .result(categoryService.getCategoryTree())
                .build();
    }
}
