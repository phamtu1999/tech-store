package com.techstore.controller.settings;

import com.techstore.dto.ApiResponse;
import com.techstore.dto.settings.SystemLogResponse;
import com.techstore.repository.settings.SystemLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/admin/system-logs")
@RequiredArgsConstructor
@CrossOrigin
@PreAuthorize("hasRole('ADMIN')")
@lombok.extern.slf4j.Slf4j
public class LogController {

    private final SystemLogRepository logRepository;

    @GetMapping
    @com.techstore.security.LogAction("VIEW_SYSTEM_LOGS")
    public ApiResponse<Page<SystemLogResponse>> getLogs(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(required = false) String action,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size
    ) {
        log.info("Fetching system logs: status={}, start={}, end={}, page={}, size={}", 
            status, startDate, endDate, page, size);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "timestamp"));
        
        // Default time range if not provided (last 30 days)
        LocalDateTime start = startDate != null ? startDate : LocalDateTime.now().minusDays(30);
        LocalDateTime end = endDate != null ? endDate : LocalDateTime.now();
        
        Page<SystemLogResponse> logs = Page.empty();
        
        // Status filtering - Case insensitive for "ALL"
        boolean isAllStatus = status == null || status.equalsIgnoreCase("ALL");
        
        if (action != null && !action.isBlank() && !isAllStatus) {
            logs = logRepository.findByActionAndStatusAndTimestampBetween(action, status, start, end, pageable).map(SystemLogResponse::fromEntity);
        } else if (action != null && !action.isBlank()) {
            logs = logRepository.findByActionAndTimestampBetween(action, start, end, pageable).map(SystemLogResponse::fromEntity);
        } else if (!isAllStatus) {
            logs = logRepository.findByStatusAndTimestampBetween(status, start, end, pageable).map(SystemLogResponse::fromEntity);
        } else {
            logs = logRepository.findByTimestampBetween(start, end, pageable).map(SystemLogResponse::fromEntity);
        }

        log.info("Found {} log entries", logs.getTotalElements());
        return ApiResponse.<Page<SystemLogResponse>>builder()
                .result(logs)
                .build();
    }
}
