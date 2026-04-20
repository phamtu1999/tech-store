package com.techstore.service.settings;

import com.techstore.entity.settings.SystemLog;
import com.techstore.entity.user.User;
import com.techstore.repository.settings.SystemLogRepository;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
public class LoggerService {

    private final SystemLogRepository logRepository;
    private final ObjectMapper objectMapper;

    @org.springframework.scheduling.annotation.Async
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void log(String action, String message, String username, String ipAddress, String status) {
        logWithDetails(action, message, username, ipAddress, status, null);
    }

    /**
     * Ghi log chuyên sâu kèm theo dữ liệu kỹ thuật (JSON details)
     */
    @org.springframework.scheduling.annotation.Async
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logWithDetails(String action, String message, String username, String ipAddress, String status, Object details) {
        try {
            String jsonDetails = null;
            if (details != null) {
                try {
                    jsonDetails = objectMapper.writeValueAsString(details);
                } catch (Exception e) {
                    log.error("Failed to serialize log details: {}", e.getMessage());
                }
            }

            // 1. Ghi vào File Log
            if ("SUCCESS".equals(status)) {
                log.info("[SYSTEM_LOG] Action: {}, User: {}, Msg: {}", action, username, message);
            } else {
                log.warn("[SYSTEM_LOG_FAILURE] Action: {}, User: {}, Msg: {}", action, username, message);
            }

            // 2. Ghi vào Database
            SystemLog systemLog = SystemLog.builder()
                    .action(action)
                    .message(message)
                    .username(username)
                    .ipAddress(ipAddress)
                    .status(status)
                    .details(jsonDetails)
                    .build();
            logRepository.save(systemLog);
        } catch (Exception e) {
            log.error("CRITICAL: Failed to save system log to DB: {}", e.getMessage());
        }
    }
}
