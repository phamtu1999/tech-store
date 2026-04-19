package com.techstore.controller.promotion;

import com.techstore.dto.promotion.FlashSaleResponse;
import com.techstore.dto.response.ApiResponse;
import com.techstore.entity.promotion.FlashSale;
import com.techstore.service.promotion.FlashSaleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/flash-sales")
@RequiredArgsConstructor
public class FlashSaleController {

    private final FlashSaleService flashSaleService;

    @GetMapping("/active")
    public ApiResponse<FlashSaleResponse> getActiveFlashSale() {
        return ApiResponse.<FlashSaleResponse>builder()
                .result(flashSaleService.getActiveFlashSale())
                .build();
    }

    @PostMapping
    public ApiResponse<FlashSale> createFlashSale(@RequestBody FlashSale flashSale) {
        return ApiResponse.<FlashSale>builder()
                .result(flashSaleService.createFlashSale(flashSale))
                .build();
    }
}
