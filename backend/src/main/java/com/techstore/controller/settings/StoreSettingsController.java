package com.techstore.controller.settings;

import com.techstore.dto.ApiResponse;
import com.techstore.dto.settings.StoreSettingsRequest;
import com.techstore.dto.settings.StoreSettingsResponse;
import com.techstore.service.settings.StoreSettingsService;


import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/settings")
@RequiredArgsConstructor
public class StoreSettingsController {

    private final StoreSettingsService storeSettingsService;

    @GetMapping
    public ApiResponse<StoreSettingsResponse> getSettings() {
        return ApiResponse.<StoreSettingsResponse>builder()
                .result(storeSettingsService.getSettings())
                .build();
    }

    @PutMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<StoreSettingsResponse> updateSettings(@RequestBody StoreSettingsRequest request) {
        return ApiResponse.<StoreSettingsResponse>builder()
                .result(storeSettingsService.updateSettings(request))
                .build();
    }
}
