package com.techstore.controller.product;

import com.techstore.dto.ApiResponse;
import com.techstore.dto.PageResponse;
import com.techstore.dto.product.ProductMinResponse;
import com.techstore.dto.product.ProductResponse;
import com.techstore.security.RateLimiter;
import com.techstore.service.product.ProductQueryService;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.util.StringUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
@Validated
public class ProductController {

    private final ProductQueryService productService;

    @GetMapping
    public ApiResponse<PageResponse<ProductMinResponse>> getProducts(
            @RequestParam(required = false) 
            @Size(max = 100) 
            @Pattern(regexp = "^[^'\";<>]*$", message = "Query contains invalid characters")
            String q,
            @RequestParam(required = false) 
            @Size(max = 100) 
            @Pattern(regexp = "^[^'\";<>]*$", message = "Query contains invalid characters")
            String query,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            Pageable pageable
    ) {
        String searchTerm = StringUtils.hasText(query) ? query : q;
        return ApiResponse.<PageResponse<ProductMinResponse>>builder()
                .result(productService.getProducts(searchTerm, category, brand, minPrice, maxPrice, pageable))
                .build();
    }

    @GetMapping("/{slug}")
    @RateLimiter(name = "product_detail", capacity = 50)
    public ApiResponse<ProductResponse> getProduct(@PathVariable String slug) {
        return ApiResponse.<ProductResponse>builder()
                .result(productService.getProductBySlug(slug))
                .build();
    }
}
