package com.techstore.controller.product;

import com.techstore.dto.ApiResponse;
import com.techstore.dto.brand.BrandResponse;
import com.techstore.service.brand.BrandService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/brands")
@RequiredArgsConstructor
public class BrandController {
    private final BrandService brandService;

    @GetMapping
    public ApiResponse<List<BrandResponse>> getAllBrands() {
        return ApiResponse.<List<BrandResponse>>builder()
                .result(brandService.getAllBrands())
                .build();
    }
}
