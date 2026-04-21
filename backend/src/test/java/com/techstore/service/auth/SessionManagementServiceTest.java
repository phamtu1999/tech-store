package com.techstore.service.auth;

import com.techstore.entity.auth.ActiveSession;
import com.techstore.entity.auth.SecuritySettings;
import com.techstore.repository.auth.ActiveSessionRepository;


import com.techstore.service.auth.SecuritySettingsService;
import com.techstore.service.auth.SessionManagementService;


import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * Unit tests for SessionManagementService.
 * Tests session retrieval, termination, and management functionality.
 */
@ExtendWith(MockitoExtension.class)
class SessionManagementServiceTest {

    @Mock
    private ActiveSessionRepository activeSessionRepository;

    @Mock
    private SecuritySettingsService securitySettingsService;

    @InjectMocks
    private SessionManagementService sessionManagementService;

    private SecuritySettings securitySettings;
    private ActiveSession activeSession1;
    private ActiveSession activeSession2;
    private ActiveSession expiredSession;

    @BeforeEach
    void setUp() {
        // Setup security settings with 30 minute timeout
        securitySettings = SecuritySettings.builder()
                .sessionTimeoutMinutes(30)
                .build();

        // Setup active sessions
        LocalDateTime now = LocalDateTime.now();
        
        activeSession1 = ActiveSession.builder()
                .sessionId("session-1")
                .userId("U1")
                .username("user1")
                .ipAddress("192.168.1.1")
                .deviceInfo("Chrome on Windows")
                .loginTimestamp(now.minusMinutes(10))
                .lastActivityTimestamp(now.minusMinutes(5))
                .build();

        activeSession2 = ActiveSession.builder()
                .sessionId("session-2")
                .userId("U2")
                .username("user2")
                .ipAddress("192.168.1.2")
                .deviceInfo("Firefox on Mac")
                .loginTimestamp(now.minusMinutes(20))
                .lastActivityTimestamp(now.minusMinutes(10))
                .build();

        expiredSession = ActiveSession.builder()
                .sessionId("session-expired")
                .userId("U3")
                .username("user3")
                .ipAddress("192.168.1.3")
                .deviceInfo("Safari on iOS")
                .loginTimestamp(now.minusMinutes(60))
                .lastActivityTimestamp(now.minusMinutes(45))
                .build();
    }

    @Test
    void testGetAllActiveSessions_ReturnsOnlyValidSessions() {
        // Arrange
        when(securitySettingsService.getSecuritySettings()).thenReturn(securitySettings);
        when(activeSessionRepository.findAll()).thenReturn(Arrays.asList(
                activeSession1, activeSession2, expiredSession
        ));

        // Act
        List<ActiveSession> result = sessionManagementService.getAllActiveSessions();

        // Assert
        assertEquals(2, result.size());
        assertTrue(result.contains(activeSession1));
        assertTrue(result.contains(activeSession2));
        assertFalse(result.contains(expiredSession));
        verify(activeSessionRepository).findAll();
    }

    @Test
    void testGetActiveSessionsForUser_ReturnsUserSessions() {
        // Arrange
        String userId = "U1";
        when(securitySettingsService.getSecuritySettings()).thenReturn(securitySettings);
        when(activeSessionRepository.findByUserId(userId)).thenReturn(Arrays.asList(activeSession1));

        // Act
        List<ActiveSession> result = sessionManagementService.getActiveSessionsForUser(userId);

        // Assert
        assertEquals(1, result.size());
        assertEquals(activeSession1, result.get(0));
        verify(activeSessionRepository).findByUserId(userId);
    }

    @Test
    void testTerminateSession_Success() {
        // Arrange
        String sessionId = "session-1";
        when(activeSessionRepository.findById(sessionId)).thenReturn(Optional.of(activeSession1));

        // Act
        boolean result = sessionManagementService.terminateSession(sessionId);

        // Assert
        assertTrue(result);
        verify(activeSessionRepository).findById(sessionId);
        verify(activeSessionRepository).deleteById(sessionId);
    }

    @Test
    void testTerminateSession_NotFound() {
        // Arrange
        String sessionId = "non-existent";
        when(activeSessionRepository.findById(sessionId)).thenReturn(Optional.empty());

        // Act
        boolean result = sessionManagementService.terminateSession(sessionId);

        // Assert
        assertFalse(result);
        verify(activeSessionRepository).findById(sessionId);
        verify(activeSessionRepository, never()).deleteById(anyString());
    }

    @Test
    void testTerminateAllSessions_WithoutExclusion() {
        // Arrange
        when(activeSessionRepository.findAll()).thenReturn(Arrays.asList(
                activeSession1, activeSession2
        ));

        // Act
        int result = sessionManagementService.terminateAllSessions(false, null);

        // Assert
        assertEquals(2, result);
        verify(activeSessionRepository).deleteById("session-1");
        verify(activeSessionRepository).deleteById("session-2");
    }

    @Test
    void testTerminateAllSessions_WithExclusion() {
        // Arrange
        String currentSessionId = "session-1";
        when(activeSessionRepository.findAll()).thenReturn(Arrays.asList(
                activeSession1, activeSession2
        ));

        // Act
        int result = sessionManagementService.terminateAllSessions(true, currentSessionId);

        // Assert
        assertEquals(1, result);
        verify(activeSessionRepository, never()).deleteById("session-1");
        verify(activeSessionRepository).deleteById("session-2");
    }

    @Test
    void testTerminateAllSessionsForUser_WithExclusion() {
        // Arrange
        String userId = "U1";
        String currentSessionId = "session-1";
        ActiveSession anotherUserSession = ActiveSession.builder()
                .sessionId("session-3")
                .userId(userId)
                .username("user1")
                .ipAddress("192.168.1.4")
                .deviceInfo("Mobile")
                .loginTimestamp(LocalDateTime.now().minusMinutes(5))
                .lastActivityTimestamp(LocalDateTime.now().minusMinutes(2))
                .build();

        when(activeSessionRepository.findByUserIdAndSessionIdNot(userId, currentSessionId))
                .thenReturn(Arrays.asList(anotherUserSession));

        // Act
        int result = sessionManagementService.terminateAllSessionsForUser(userId, true, currentSessionId);

        // Assert
        assertEquals(1, result);
        verify(activeSessionRepository).findByUserIdAndSessionIdNot(userId, currentSessionId);
        verify(activeSessionRepository).deleteById("session-3");
    }

    @Test
    void testSaveSession_UpdatesLastActivity() {
        // Arrange
        when(activeSessionRepository.save(any(ActiveSession.class))).thenReturn(activeSession1);

        // Act
        ActiveSession result = sessionManagementService.saveSession(activeSession1);

        // Assert
        assertNotNull(result);
        verify(activeSessionRepository).save(activeSession1);
    }

    @Test
    void testRefreshSession_Success() {
        // Arrange
        String sessionId = "session-1";
        when(activeSessionRepository.findById(sessionId)).thenReturn(Optional.of(activeSession1));
        when(activeSessionRepository.save(any(ActiveSession.class))).thenReturn(activeSession1);

        // Act
        boolean result = sessionManagementService.refreshSession(sessionId);

        // Assert
        assertTrue(result);
        verify(activeSessionRepository).findById(sessionId);
        verify(activeSessionRepository).save(activeSession1);
    }

    @Test
    void testRefreshSession_NotFound() {
        // Arrange
        String sessionId = "non-existent";
        when(activeSessionRepository.findById(sessionId)).thenReturn(Optional.empty());

        // Act
        boolean result = sessionManagementService.refreshSession(sessionId);

        // Assert
        assertFalse(result);
        verify(activeSessionRepository).findById(sessionId);
        verify(activeSessionRepository, never()).save(any());
    }

    @Test
    void testIsSessionValid_ValidSession() {
        // Arrange
        String sessionId = "session-1";
        when(activeSessionRepository.findById(sessionId)).thenReturn(Optional.of(activeSession1));
        when(securitySettingsService.getSecuritySettings()).thenReturn(securitySettings);

        // Act
        boolean result = sessionManagementService.isSessionValid(sessionId);

        // Assert
        assertTrue(result);
    }

    @Test
    void testIsSessionValid_ExpiredSession() {
        // Arrange
        String sessionId = "session-expired";
        when(activeSessionRepository.findById(sessionId)).thenReturn(Optional.of(expiredSession));
        when(securitySettingsService.getSecuritySettings()).thenReturn(securitySettings);

        // Act
        boolean result = sessionManagementService.isSessionValid(sessionId);

        // Assert
        assertFalse(result);
    }

    @Test
    void testIsSessionValid_NotFound() {
        // Arrange
        String sessionId = "non-existent";
        when(activeSessionRepository.findById(sessionId)).thenReturn(Optional.empty());

        // Act
        boolean result = sessionManagementService.isSessionValid(sessionId);

        // Assert
        assertFalse(result);
    }

    @Test
    void testGetSession_Found() {
        // Arrange
        String sessionId = "session-1";
        when(activeSessionRepository.findById(sessionId)).thenReturn(Optional.of(activeSession1));

        // Act
        Optional<ActiveSession> result = sessionManagementService.getSession(sessionId);

        // Assert
        assertTrue(result.isPresent());
        assertEquals(activeSession1, result.get());
    }

    @Test
    void testGetSession_NotFound() {
        // Arrange
        String sessionId = "non-existent";
        when(activeSessionRepository.findById(sessionId)).thenReturn(Optional.empty());

        // Act
        Optional<ActiveSession> result = sessionManagementService.getSession(sessionId);

        // Assert
        assertFalse(result.isPresent());
    }

    @Test
    void testCleanupExpiredSessions() {
        // Arrange
        when(securitySettingsService.getSecuritySettings()).thenReturn(securitySettings);
        when(activeSessionRepository.findAll()).thenReturn(Arrays.asList(
                activeSession1, activeSession2, expiredSession
        ));

        // Act
        int result = sessionManagementService.cleanupExpiredSessions();

        // Assert
        assertEquals(1, result);
        verify(activeSessionRepository).deleteById("session-expired");
        verify(activeSessionRepository, never()).deleteById("session-1");
        verify(activeSessionRepository, never()).deleteById("session-2");
    }

    @Test
    void testGetActiveSessionCount() {
        // Arrange
        when(securitySettingsService.getSecuritySettings()).thenReturn(securitySettings);
        when(activeSessionRepository.findAll()).thenReturn(Arrays.asList(
                activeSession1, activeSession2, expiredSession
        ));

        // Act
        long result = sessionManagementService.getActiveSessionCount();

        // Assert
        assertEquals(2, result);
    }
}
