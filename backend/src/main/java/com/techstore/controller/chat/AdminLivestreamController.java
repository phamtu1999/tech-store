package com.techstore.controller.chat;

import com.techstore.dto.ApiResponse;
import com.techstore.dto.chat.LivestreamResponse;
import com.techstore.service.chat.LivestreamService;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/livestreams")
@RequiredArgsConstructor
public class AdminLivestreamController {

    private final LivestreamService livestreamService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'SUPER_ADMIN')")
    public ApiResponse<LivestreamResponse> createStream(@RequestBody LivestreamResponse request) {
        return ApiResponse.<LivestreamResponse>builder()
                .result(livestreamService.createStream(request))
                .build();
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'SUPER_ADMIN')")
    public ApiResponse<LivestreamResponse> updateStatus(
            @PathVariable String id, 
            @RequestParam String status) {
        return ApiResponse.<LivestreamResponse>builder()
                .result(livestreamService.updateStatus(id, status))
                .build();
    }

    @PatchMapping("/{id}/push-product")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'SUPER_ADMIN')")
    public ApiResponse<LivestreamResponse> pushProduct(
            @PathVariable String id, 
            @RequestParam String productId) {
        return ApiResponse.<LivestreamResponse>builder()
                .result(livestreamService.pushProduct(id, productId))
                .build();
    }
}
