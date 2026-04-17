package com.techstore.controller.analytics;

import com.techstore.dto.analytics.DashboardResponse;
import com.techstore.dto.ApiResponse;
import com.techstore.service.analytics.AnalyticsService;


import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'SUPER_ADMIN')")
    public ApiResponse<DashboardResponse> getDashboardStats(
            @RequestParam(required = false, defaultValue = "30d") String period) {
        return ApiResponse.<DashboardResponse>builder()
                .result(analyticsService.getDashboardStats(period))
                .build();
    }

    @GetMapping("/export")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public org.springframework.http.ResponseEntity<byte[]> exportReport(
            @RequestParam(required = false, defaultValue = "30d") String period) {
        byte[] excelData = analyticsService.exportReport(period);
        
        return org.springframework.http.ResponseEntity.ok()
                .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=analytics_report_" + period + ".xlsx")
                .contentType(org.springframework.http.MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(excelData);
    }
}
