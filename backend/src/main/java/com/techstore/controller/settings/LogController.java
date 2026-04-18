package com.techstore.controller.settings;

import com.techstore.dto.ApiResponse;
import com.techstore.entity.settings.SystemLog;
import com.techstore.repository.settings.SystemLogRepository;


import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/admin/system-logs")
@RequiredArgsConstructor
@CrossOrigin
@PreAuthorize("hasRole('ADMIN')")
public class LogController {

    private final SystemLogRepository logRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<SystemLog>>> getLogs(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "timestamp"));
        
        // Default time range if not provided (last 30 days)
        LocalDateTime start = startDate != null ? startDate : LocalDateTime.now().minusDays(30);
        LocalDateTime end = endDate != null ? endDate : LocalDateTime.now();
        
        Page<SystemLog> logs;
        
        if (action != null && !action.isBlank() && status != null && !status.equals("ALL")) {
            logs = logRepository.findByActionAndStatusAndTimestampBetween(action, status, start, end, pageable);
        } else if (action != null && !action.isBlank()) {
            logs = logRepository.findByActionAndTimestampBetween(action, start, end, pageable);
        } else if (status != null && !status.equals("ALL")) {
            logs = logRepository.findByStatusAndTimestampBetween(status, start, end, pageable);
        } else {
            logs = logRepository.findByTimestampBetween(start, end, pageable);
        }

        return ResponseEntity.ok(ApiResponse.<Page<SystemLog>>builder()
                .result(logs)
                .build());
    }
}
