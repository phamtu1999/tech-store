package com.techstore.service;

import com.techstore.entity.address.Address;
import com.techstore.entity.auth.LoginHistory;
import com.techstore.repository.auth.LoginHistoryRepository;
import com.techstore.service.auth.LoginHistoryService;
import com.techstore.service.settings.GeolocationService;


import com.techstore.entity.auth.LoginHistory.LoginStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

/**
 * Unit tests for LoginHistoryService.
 * Tests login history retrieval, filtering, CSV export, and recording functionality.
 */
@ExtendWith(MockitoExtension.class)
class LoginHistoryServiceTest {

    @Mock
    private LoginHistoryRepository loginHistoryRepository;

    @Mock
    private GeolocationService geolocationService;

    @InjectMocks
    private LoginHistoryService loginHistoryService;

    private LoginHistory successfulLogin;
    private LoginHistory failedLogin;
    private LocalDateTime now;

    @BeforeEach
    void setUp() {
        now = LocalDateTime.now();

        successfulLogin = LoginHistory.builder()
                .id("L1")
                .username("testuser")
                .ipAddress("192.168.1.1")
                .location("San Francisco, CA")
                .deviceInfo("Chrome on Windows")
                .status(LoginStatus.SUCCESS)
                .timestamp(now.minusHours(1))
                .build();

        failedLogin = LoginHistory.builder()
                .id("L2")
                .username("testuser")
                .ipAddress("192.168.1.2")
                .location("New York, NY")
                .deviceInfo("Firefox on Mac")
                .status(LoginStatus.FAILURE)
                .failureReason("Invalid password")
                .timestamp(now.minusHours(2))
                .build();
    }

    @Test
    void testGetLoginHistory_NoFilters_ReturnsAllRecords() {
        // Arrange
        Page<LoginHistory> expectedPage = new PageImpl<>(Arrays.asList(successfulLogin, failedLogin));
        when(loginHistoryRepository.findAll(any(Pageable.class))).thenReturn(expectedPage);

        // Act
        Page<LoginHistory> result = loginHistoryService.getLoginHistory(null, null, null, null, 0, 50);

        // Assert
        assertEquals(2, result.getContent().size());
        verify(loginHistoryRepository).findAll(any(Pageable.class));
    }

    @Test
    void testGetLoginHistory_FilterByUsername() {
        // Arrange
        String username = "testuser";
        Page<LoginHistory> expectedPage = new PageImpl<>(Arrays.asList(successfulLogin, failedLogin));
        when(loginHistoryRepository.findByUsername(eq(username), any(Pageable.class))).thenReturn(expectedPage);

        // Act
        Page<LoginHistory> result = loginHistoryService.getLoginHistory(username, null, null, null, 0, 50);

        // Assert
        assertEquals(2, result.getContent().size());
        verify(loginHistoryRepository).findByUsername(eq(username), any(Pageable.class));
    }

    @Test
    void testGetLoginHistory_FilterByStatus() {
        // Arrange
        Page<LoginHistory> expectedPage = new PageImpl<>(Arrays.asList(successfulLogin));
        when(loginHistoryRepository.findByStatus(eq(LoginStatus.SUCCESS), any(Pageable.class)))
                .thenReturn(expectedPage);

        // Act
        Page<LoginHistory> result = loginHistoryService.getLoginHistory(null, null, null, "SUCCESS", 0, 50);

        // Assert
        assertEquals(1, result.getContent().size());
        assertEquals(LoginStatus.SUCCESS, result.getContent().get(0).getStatus());
        verify(loginHistoryRepository).findByStatus(eq(LoginStatus.SUCCESS), any(Pageable.class));
    }

    @Test
    void testGetLoginHistory_FilterByUsernameAndStatus() {
        // Arrange
        String username = "testuser";
        Page<LoginHistory> expectedPage = new PageImpl<>(Arrays.asList(successfulLogin));
        when(loginHistoryRepository.findByUsernameAndStatus(eq(username), eq(LoginStatus.SUCCESS), any(Pageable.class)))
                .thenReturn(expectedPage);

        // Act
        Page<LoginHistory> result = loginHistoryService.getLoginHistory(username, null, null, "SUCCESS", 0, 50);

        // Assert
        assertEquals(1, result.getContent().size());
        verify(loginHistoryRepository).findByUsernameAndStatus(eq(username), eq(LoginStatus.SUCCESS), any(Pageable.class));
    }

    @Test
    void testGetLoginHistory_FilterByDateRange() {
        // Arrange
        LocalDateTime startDate = now.minusDays(1);
        LocalDateTime endDate = now;
        Page<LoginHistory> expectedPage = new PageImpl<>(Arrays.asList(successfulLogin, failedLogin));
        when(loginHistoryRepository.findAll(any(Pageable.class))).thenReturn(expectedPage);

        // Act
        Page<LoginHistory> result = loginHistoryService.getLoginHistory(null, startDate, endDate, null, 0, 50);

        // Assert
        assertEquals(2, result.getContent().size());
        verify(loginHistoryRepository).findAll(any(Pageable.class));
    }

    @Test
    void testGetLoginHistory_FilterByUsernameAndDateRange() {
        // Arrange
        String username = "testuser";
        LocalDateTime startDate = now.minusDays(1);
        LocalDateTime endDate = now;
        Page<LoginHistory> expectedPage = new PageImpl<>(Arrays.asList(successfulLogin, failedLogin));
        when(loginHistoryRepository.findByUsernameAndTimestampBetween(
                eq(username), eq(startDate), eq(endDate), any(Pageable.class)))
                .thenReturn(expectedPage);

        // Act
        Page<LoginHistory> result = loginHistoryService.getLoginHistory(username, startDate, endDate, null, 0, 50);

        // Assert
        assertEquals(2, result.getContent().size());
        verify(loginHistoryRepository).findByUsernameAndTimestampBetween(
                eq(username), eq(startDate), eq(endDate), any(Pageable.class));
    }

    @Test
    void testGetLoginHistory_FilterByStatusAndDateRange() {
        // Arrange
        LocalDateTime startDate = now.minusDays(1);
        LocalDateTime endDate = now;
        Page<LoginHistory> expectedPage = new PageImpl<>(Arrays.asList(successfulLogin));
        when(loginHistoryRepository.findByStatusAndTimestampBetween(
                eq(LoginStatus.SUCCESS), eq(startDate), eq(endDate), any(Pageable.class)))
                .thenReturn(expectedPage);

        // Act
        Page<LoginHistory> result = loginHistoryService.getLoginHistory(null, startDate, endDate, "SUCCESS", 0, 50);

        // Assert
        assertEquals(1, result.getContent().size());
        verify(loginHistoryRepository).findByStatusAndTimestampBetween(
                eq(LoginStatus.SUCCESS), eq(startDate), eq(endDate), any(Pageable.class));
    }

    @Test
    void testGetLoginHistory_AllFilters() {
        // Arrange
        String username = "testuser";
        LocalDateTime startDate = now.minusDays(1);
        LocalDateTime endDate = now;
        Page<LoginHistory> expectedPage = new PageImpl<>(Arrays.asList(successfulLogin));
        when(loginHistoryRepository.findByUsernameAndStatusAndTimestampBetween(
                eq(username), eq(LoginStatus.SUCCESS), eq(startDate), eq(endDate), any(Pageable.class)))
                .thenReturn(expectedPage);

        // Act
        Page<LoginHistory> result = loginHistoryService.getLoginHistory(username, startDate, endDate, "SUCCESS", 0, 50);

        // Assert
        assertEquals(1, result.getContent().size());
        verify(loginHistoryRepository).findByUsernameAndStatusAndTimestampBetween(
                eq(username), eq(LoginStatus.SUCCESS), eq(startDate), eq(endDate), any(Pageable.class));
    }

    @Test
    void testGetLoginHistory_InvalidStatus_IgnoresFilter() {
        // Arrange
        Page<LoginHistory> expectedPage = new PageImpl<>(Arrays.asList(successfulLogin, failedLogin));
        when(loginHistoryRepository.findAll(any(Pageable.class))).thenReturn(expectedPage);

        // Act
        Page<LoginHistory> result = loginHistoryService.getLoginHistory(null, null, null, "INVALID", 0, 50);

        // Assert
        assertEquals(2, result.getContent().size());
        verify(loginHistoryRepository).findAll(any(Pageable.class));
    }

    @Test
    void testGetLoginHistory_StatusAll_ReturnsAllRecords() {
        // Arrange
        Page<LoginHistory> expectedPage = new PageImpl<>(Arrays.asList(successfulLogin, failedLogin));
        when(loginHistoryRepository.findAll(any(Pageable.class))).thenReturn(expectedPage);

        // Act
        Page<LoginHistory> result = loginHistoryService.getLoginHistory(null, null, null, "ALL", 0, 50);

        // Assert
        assertEquals(2, result.getContent().size());
        verify(loginHistoryRepository).findAll(any(Pageable.class));
    }

    @Test
    void testExportLoginHistoryToCsv_Success() throws IOException {
        // Arrange
        Page<LoginHistory> expectedPage = new PageImpl<>(Arrays.asList(successfulLogin, failedLogin));
        when(loginHistoryRepository.findAll(any(Pageable.class))).thenReturn(expectedPage);

        // Act
        String csv = loginHistoryService.exportLoginHistoryToCsv(null, null, null, null);

        // Assert
        assertNotNull(csv);
        assertTrue(csv.contains("ID,Username,IP Address,Location,Device Info,Status,Timestamp,Failure Reason"));
        assertTrue(csv.contains("testuser"));
        assertTrue(csv.contains("192.168.1.1"));
        assertTrue(csv.contains("San Francisco, CA"));
        assertTrue(csv.contains("SUCCESS"));
        assertTrue(csv.contains("FAILURE"));
        assertTrue(csv.contains("Invalid password"));
    }

    @Test
    void testExportLoginHistoryToCsv_WithFilters() throws IOException {
        // Arrange
        String username = "testuser";
        Page<LoginHistory> expectedPage = new PageImpl<>(Arrays.asList(successfulLogin));
        when(loginHistoryRepository.findByUsername(eq(username), any(Pageable.class))).thenReturn(expectedPage);

        // Act
        String csv = loginHistoryService.exportLoginHistoryToCsv(username, null, null, null);

        // Assert
        assertNotNull(csv);
        assertTrue(csv.contains("testuser"));
        assertTrue(csv.contains("SUCCESS"));
        assertFalse(csv.contains("FAILURE"));
    }

    @Test
    void testExportLoginHistoryToCsv_HandlesNullFields() throws IOException {
        // Arrange
        LoginHistory loginWithNulls = LoginHistory.builder()
                .id("L3")
                .username("user3")
                .ipAddress("192.168.1.3")
                .location(null)
                .deviceInfo(null)
                .status(LoginStatus.SUCCESS)
                .failureReason(null)
                .timestamp(now)
                .build();
        Page<LoginHistory> expectedPage = new PageImpl<>(Arrays.asList(loginWithNulls));
        when(loginHistoryRepository.findAll(any(Pageable.class))).thenReturn(expectedPage);

        // Act
        String csv = loginHistoryService.exportLoginHistoryToCsv(null, null, null, null);

        // Assert
        assertNotNull(csv);
        assertTrue(csv.contains("Unknown")); // For null location and deviceInfo
        assertTrue(csv.contains("user3"));
    }

    @Test
    void testRecordLoginAttempt_Success() {
        // Arrange
        String username = "testuser";
        String ipAddress = "192.168.1.1";
        String deviceInfo = "Chrome on Windows";
        LoginStatus status = LoginStatus.SUCCESS;
        
        when(geolocationService.resolveLocation(ipAddress)).thenReturn("San Francisco, CA");
        when(loginHistoryRepository.save(any(LoginHistory.class))).thenReturn(successfulLogin);

        // Act
        LoginHistory result = loginHistoryService.recordLoginAttempt(username, ipAddress, deviceInfo, status, null);

        // Assert
        assertNotNull(result);
        verify(geolocationService).resolveLocation(ipAddress);
        verify(loginHistoryRepository).save(any(LoginHistory.class));
    }

    @Test
    void testRecordLoginAttempt_Failure() {
        // Arrange
        String username = "testuser";
        String ipAddress = "192.168.1.2";
        String deviceInfo = "Firefox on Mac";
        LoginStatus status = LoginStatus.FAILURE;
        String failureReason = "Invalid password";
        
        when(geolocationService.resolveLocation(ipAddress)).thenReturn("New York, NY");
        when(loginHistoryRepository.save(any(LoginHistory.class))).thenReturn(failedLogin);

        // Act
        LoginHistory result = loginHistoryService.recordLoginAttempt(
                username, ipAddress, deviceInfo, status, failureReason);

        // Assert
        assertNotNull(result);
        verify(geolocationService).resolveLocation(ipAddress);
        verify(loginHistoryRepository).save(any(LoginHistory.class));
    }

    @Test
    void testResolveLocation_ReturnsUnknown() {
        // Arrange
        when(geolocationService.resolveLocation("192.168.1.1")).thenReturn("Unknown");

        // Act
        String location = loginHistoryService.resolveLocation("192.168.1.1");

        // Assert
        assertEquals("Unknown", location);
        verify(geolocationService).resolveLocation("192.168.1.1");
    }

    @Test
    void testGetLoginHistory_EmptyUsername_TreatedAsNull() {
        // Arrange
        Page<LoginHistory> expectedPage = new PageImpl<>(Arrays.asList(successfulLogin, failedLogin));
        when(loginHistoryRepository.findAll(any(Pageable.class))).thenReturn(expectedPage);

        // Act
        Page<LoginHistory> result = loginHistoryService.getLoginHistory("", null, null, null, 0, 50);

        // Assert
        assertEquals(2, result.getContent().size());
        verify(loginHistoryRepository).findAll(any(Pageable.class));
    }

    @Test
    void testGetLoginHistory_WhitespaceUsername_TreatedAsNull() {
        // Arrange
        Page<LoginHistory> expectedPage = new PageImpl<>(Arrays.asList(successfulLogin, failedLogin));
        when(loginHistoryRepository.findAll(any(Pageable.class))).thenReturn(expectedPage);

        // Act
        Page<LoginHistory> result = loginHistoryService.getLoginHistory("   ", null, null, null, 0, 50);

        // Assert
        assertEquals(2, result.getContent().size());
        verify(loginHistoryRepository).findAll(any(Pageable.class));
    }

    @Test
    void testGetLoginHistory_Pagination() {
        // Arrange
        int page = 1;
        int size = 10;
        Page<LoginHistory> expectedPage = new PageImpl<>(Arrays.asList(successfulLogin));
        when(loginHistoryRepository.findAll(any(Pageable.class))).thenReturn(expectedPage);

        // Act
        Page<LoginHistory> result = loginHistoryService.getLoginHistory(null, null, null, null, page, size);

        // Assert
        assertNotNull(result);
        verify(loginHistoryRepository).findAll(any(Pageable.class));
    }
}
