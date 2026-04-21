package com.techstore.controller.chat;

import com.techstore.dto.ApiResponse;
import com.techstore.dto.chat.LivestreamResponse;
import com.techstore.service.chat.LivestreamService;


import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/livestreams")
@RequiredArgsConstructor
public class LivestreamController {

    private final LivestreamService livestreamService;

    @GetMapping
    public ApiResponse<List<LivestreamResponse>> getAllCollections() {
        return ApiResponse.<List<LivestreamResponse>>builder()
                .result(livestreamService.getAll())
                .build();
    }

    @GetMapping("/live")
    public ApiResponse<List<LivestreamResponse>> getLive() {
        return ApiResponse.<List<LivestreamResponse>>builder()
                .result(livestreamService.getLive())
                .build();
    }

    @GetMapping("/upcoming")
    public ApiResponse<List<LivestreamResponse>> getUpcoming() {
        return ApiResponse.<List<LivestreamResponse>>builder()
                .result(livestreamService.getUpcoming())
                .build();
    }

    @GetMapping("/popular")
    public ApiResponse<List<LivestreamResponse>> getPopular(@RequestParam(defaultValue = "10") int limit) {
        return ApiResponse.<List<LivestreamResponse>>builder()
                .result(livestreamService.getPopular(limit))
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<LivestreamResponse> getById(@PathVariable String id) {
        return ApiResponse.<LivestreamResponse>builder()
                .result(livestreamService.getById(id))
                .build();
    }
}
