package com.techstore.service.auth;

import com.techstore.entity.address.Address;
import com.techstore.entity.auth.LoginHistory;
import com.techstore.repository.auth.LoginHistoryRepository;
import com.techstore.service.settings.GeolocationService;

import com.techstore.entity.auth.LoginHistory.LoginStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.StringWriter;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Service for managing login history records.
 * Provides functionality for retrieving, filtering, and exporting login history data.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class LoginHistoryService {

    private final LoginHistoryRepository loginHistoryRepository;
    private final GeolocationService geolocationService;

    private static final DateTimeFormatter CSV_DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    /**
     * Retrieves paginated login history with optional filtering.
     *
     * @param username Optional username filter
     * @param startDate Optional start date filter
     * @param endDate Optional end date filter
     * @param status Optional status filter (SUCCESS, FAILURE, or null for ALL)
     * @param page Page number (0-indexed)
     * @param size Page size
     * @return Page of LoginHistory records
     */
    public Page<LoginHistory> getLoginHistory(
            String username,
            LocalDateTime startDate,
            LocalDateTime endDate,
            String status,
            int page,
            int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "timestamp"));

        LoginStatus loginStatus = null;
        if (status != null && !status.equalsIgnoreCase("ALL")) {
            try {
                loginStatus = LoginStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                log.warn("Invalid status filter: {}", status);
            }
        }

        boolean hasUsername = username != null && !username.trim().isEmpty();
        boolean hasDateRange = startDate != null && endDate != null;

        if (hasUsername && hasDateRange && loginStatus != null) {
            return loginHistoryRepository.findByUsernameAndStatusAndTimestampBetween(
                    username, loginStatus, startDate, endDate, pageable
            );
        }
        if (hasUsername && hasDateRange) {
            return loginHistoryRepository.findByUsernameAndTimestampBetween(
                    username, startDate, endDate, pageable
            );
        }
        if (hasUsername && loginStatus != null) {
            return loginHistoryRepository.findByUsernameAndStatus(username, loginStatus, pageable);
        }
        if (hasUsername) {
            return loginHistoryRepository.findByUsername(username, pageable);
        }
        if (hasDateRange && loginStatus != null) {
            return loginHistoryRepository.findByStatusAndTimestampBetween(
                    loginStatus, startDate, endDate, pageable
            );
        }
        if (loginStatus != null) {
            return loginHistoryRepository.findByStatus(loginStatus, pageable);
        }
        return loginHistoryRepository.findAll(pageable);
    }

    /**
     * Exports login history to CSV format with optional filtering.
     * Uses Apache Commons CSV for CSV generation.
     *
     * @param username Optional username filter
     * @param startDate Optional start date filter
     * @param endDate Optional end date filter
     * @param status Optional status filter (SUCCESS, FAILURE, or null for ALL)
     * @return CSV string containing login history data
     * @throws IOException if CSV generation fails
     */
    public String exportLoginHistoryToCsv(
            String username,
            LocalDateTime startDate,
            LocalDateTime endDate,
            String status
    ) throws IOException {
        // Retrieve all matching records (no pagination for export)
        // Use a large page size to get all records
        Page<LoginHistory> loginHistoryPage = getLoginHistory(
                username, startDate, endDate, status, 0, 10000
        );

        // Create CSV writer
        StringWriter stringWriter = new StringWriter();
        
        // Define CSV format with headers
        CSVFormat csvFormat = CSVFormat.DEFAULT.builder()
                .setHeader("ID", "Username", "IP Address", "Location", "Device Info", "Status", "Timestamp", "Failure Reason")
                .build();

        try (CSVPrinter csvPrinter = new CSVPrinter(stringWriter, csvFormat)) {
            // Write each login history record
            for (LoginHistory loginHistory : loginHistoryPage.getContent()) {
                csvPrinter.printRecord(
                        loginHistory.getId(),
                        loginHistory.getUsername(),
                        loginHistory.getIpAddress(),
                        loginHistory.getLocation() != null ? loginHistory.getLocation() : "Unknown",
                        loginHistory.getDeviceInfo() != null ? loginHistory.getDeviceInfo() : "Unknown",
                        loginHistory.getStatus().name(),
                        loginHistory.getTimestamp().format(CSV_DATE_FORMATTER),
                        loginHistory.getFailureReason() != null ? loginHistory.getFailureReason() : ""
                );
            }
        }

        log.info("Exported {} login history records to CSV", loginHistoryPage.getContent().size());
        return stringWriter.toString();
    }

    /**
     * Resolves IP address to geographic location.
     * Integrates with GeolocationService for IP resolution.
     *
     * @param ipAddress IP address to resolve
     * @return Geographic location string or "Unknown" if resolution fails
     */
    public String resolveLocation(String ipAddress) {
        return geolocationService.resolveLocation(ipAddress);
    }

    /**
     * Records a login attempt in the database.
     * This method is called by AuthService during login processing.
     *
     * @param username Username attempting to log in
     * @param ipAddress IP address of the login attempt
     * @param deviceInfo Device/browser information
     * @param status Login status (SUCCESS or FAILURE)
     * @param failureReason Reason for failure (null if successful)
     * @return The saved LoginHistory entity
     */
    public LoginHistory recordLoginAttempt(
            String username,
            String ipAddress,
            String deviceInfo,
            LoginStatus status,
            String failureReason
    ) {
        // Resolve location (currently returns "Unknown", will be implemented in Task 3.9)
        String location = resolveLocation(ipAddress);

        // Truncate fields to 255 characters to match database column limits
        String safeDeviceInfo = deviceInfo != null && deviceInfo.length() > 255 ? deviceInfo.substring(0, 255) : deviceInfo;
        String safeFailureReason = failureReason != null && failureReason.length() > 255 ? failureReason.substring(0, 255) : failureReason;
        String safeLocation = location != null && location.length() > 255 ? location.substring(0, 255) : location;

        LoginHistory loginHistory = LoginHistory.builder()
                .username(username)
                .ipAddress(ipAddress)
                .location(safeLocation)
                .deviceInfo(safeDeviceInfo)
                .status(status)
                .failureReason(safeFailureReason)
                .timestamp(LocalDateTime.now())
                .build();

        LoginHistory saved = loginHistoryRepository.save(loginHistory);
        log.info("Recorded {} login attempt for user: {} from IP: {}", status, username, ipAddress);
        
        return saved;
    }
}
