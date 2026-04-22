package com.techstore.controller.chat;

import com.techstore.dto.ApiResponse;
import com.techstore.dto.chat.LivestreamRequest;
import com.techstore.dto.chat.LivestreamResponse;
import com.techstore.security.LogAction;
import com.techstore.service.chat.LivestreamService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/livestreams")
@RequiredArgsConstructor
public class AdminLivestreamController {

    private final LivestreamService livestreamService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'SUPER_ADMIN')")
    @LogAction("LIVESTREAM_CREATE")
    public ApiResponse<LivestreamResponse> createStream(@RequestBody @Valid LivestreamRequest request) {
        return ApiResponse.<LivestreamResponse>builder()
                .result(livestreamService.createStream(request))
                .build();
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'SUPER_ADMIN')")
    @LogAction("LIVESTREAM_STATUS_UPDATE")
    public ApiResponse<LivestreamResponse> updateStatus(
            @PathVariable String id, 
            @RequestBody Map<String, String> statusRequest) {
        return ApiResponse.<LivestreamResponse>builder()
                .result(livestreamService.updateStatus(id, statusRequest.get("status")))
                .build();
    }

    @PatchMapping("/{id}/push-product")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'SUPER_ADMIN')")
    @LogAction("LIVESTREAM_PRODUCT_PUSH")
    public ApiResponse<LivestreamResponse> pushProduct(
            @PathVariable String id, 
            @RequestBody Map<String, String> productRequest) {
        return ApiResponse.<LivestreamResponse>builder()
                .result(livestreamService.pushProduct(id, productRequest.get("productId")))
                .build();
    }
}
