package com.techstore.service.auth;

import com.techstore.entity.auth.ActiveSession;
import com.techstore.repository.auth.ActiveSessionRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

/**
 * Service for managing active user sessions stored in Redis.
 * Provides functionality to retrieve, terminate, and manage user sessions.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class SessionManagementService {

    private final ActiveSessionRepository activeSessionRepository;
    private final SecuritySettingsService securitySettingsService;

    /**
     * Retrieves all active sessions from Redis.
     * Filters out expired sessions based on the configured session timeout.
     *
     * @return list of all active sessions
     */
    public List<ActiveSession> getAllActiveSessions() {
        log.debug("Retrieving all active sessions from Redis");
        
        // Get session timeout from security settings
        int sessionTimeoutMinutes = securitySettingsService.getSecuritySettings().getSessionTimeoutMinutes();
        
        // Retrieve all sessions from Redis
        Iterable<ActiveSession> allSessions = activeSessionRepository.findAll();
        
        // Filter out expired sessions and collect to list
        List<ActiveSession> activeSessions = StreamSupport.stream(allSessions.spliterator(), false)
                .filter(session -> session.isValid(sessionTimeoutMinutes))
                .collect(Collectors.toList());
        
        log.debug("Found {} active sessions", activeSessions.size());
        return activeSessions;
    }

    /**
     * Retrieves all active sessions for a specific user.
     *
     * @param userId the ID of the user
     * @return list of active sessions for the user
     */
    public List<ActiveSession> getActiveSessionsForUser(String userId) {
        log.debug("Retrieving active sessions for user ID: {}", userId);
        
        int sessionTimeoutMinutes = securitySettingsService.getSecuritySettings().getSessionTimeoutMinutes();
        
        List<ActiveSession> userSessions = activeSessionRepository.findByUserId(userId);
        
        // Filter out expired sessions
        List<ActiveSession> activeSessions = userSessions.stream()
                .filter(session -> session.isValid(sessionTimeoutMinutes))
                .collect(Collectors.toList());
        
        log.debug("Found {} active sessions for user ID: {}", activeSessions.size(), userId);
        return activeSessions;
    }

    /**
     * Terminates a specific session by session ID.
     * Removes the session from Redis storage.
     *
     * @param sessionId the ID of the session to terminate
     * @return true if session was found and terminated, false if session not found
     */
    public boolean terminateSession(String sessionId) {
        log.info("Terminating session: {}", sessionId);
        
        Optional<ActiveSession> session = activeSessionRepository.findById(sessionId);
        
        if (session.isPresent()) {
            activeSessionRepository.deleteById(sessionId);
            log.info("Successfully terminated session: {}", sessionId);
            return true;
        } else {
            log.warn("Session not found: {}", sessionId);
            return false;
        }
    }

    /**
     * Terminates all active sessions, optionally excluding the current session.
     * This is useful for "logout all devices" functionality or when an administrator
     * wants to force all users to re-authenticate.
     *
     * @param excludeCurrentSession if true, excludes the current session from termination
     * @param currentSessionId the ID of the current session to exclude (required if excludeCurrentSession is true)
     * @return the number of sessions terminated
     */
    public int terminateAllSessions(boolean excludeCurrentSession, String currentSessionId) {
        log.info("Terminating all sessions (exclude current: {}, current session: {})", 
                excludeCurrentSession, currentSessionId);
        
        List<ActiveSession> allSessions = new ArrayList<>();
        activeSessionRepository.findAll().forEach(allSessions::add);
        
        int terminatedCount = 0;
        
        for (ActiveSession session : allSessions) {
            // Skip current session if exclusion is requested
            if (excludeCurrentSession && session.getSessionId().equals(currentSessionId)) {
                log.debug("Skipping current session: {}", currentSessionId);
                continue;
            }
            
            activeSessionRepository.deleteById(session.getSessionId());
            terminatedCount++;
        }
        
        log.info("Terminated {} sessions", terminatedCount);
        return terminatedCount;
    }

    /**
     * Terminates all sessions for a specific user, optionally excluding the current session.
     * Useful for "logout all other devices" functionality.
     *
     * @param userId the ID of the user whose sessions should be terminated
     * @param excludeCurrentSession if true, excludes the current session from termination
     * @param currentSessionId the ID of the current session to exclude (required if excludeCurrentSession is true)
     * @return the number of sessions terminated
     */
    public int terminateAllSessionsForUser(String userId, boolean excludeCurrentSession, String currentSessionId) {
        log.info("Terminating all sessions for user ID: {} (exclude current: {}, current session: {})", 
                userId, excludeCurrentSession, currentSessionId);
        
        List<ActiveSession> userSessions;
        
        if (excludeCurrentSession && currentSessionId != null) {
            userSessions = activeSessionRepository.findByUserIdAndSessionIdNot(userId, currentSessionId);
        } else {
            userSessions = activeSessionRepository.findByUserId(userId);
        }
        
        int terminatedCount = 0;
        
        for (ActiveSession session : userSessions) {
            activeSessionRepository.deleteById(session.getSessionId());
            terminatedCount++;
        }
        
        log.info("Terminated {} sessions for user ID: {}", terminatedCount, userId);
        return terminatedCount;
    }

    /**
     * Creates or updates an active session in Redis.
     * This method should be called during user login or when refreshing session activity.
     *
     * @param session the ActiveSession to save
     * @return the saved ActiveSession
     */
    public ActiveSession saveSession(ActiveSession session) {
        log.debug("Saving session: {} for user: {}", session.getSessionId(), session.getUsername());
        
        // Update last activity timestamp
        session.updateLastActivity();
        
        ActiveSession savedSession = activeSessionRepository.save(session);
        log.debug("Successfully saved session: {}", session.getSessionId());
        
        return savedSession;
    }

    /**
     * Updates the last activity timestamp for a session.
     * This should be called on each authenticated request to keep the session alive.
     *
     * @param sessionId the ID of the session to refresh
     * @return true if session was found and updated, false if session not found
     */
    public boolean refreshSession(String sessionId) {
        log.debug("Refreshing session: {}", sessionId);
        
        Optional<ActiveSession> sessionOpt = activeSessionRepository.findById(sessionId);
        
        if (sessionOpt.isPresent()) {
            ActiveSession session = sessionOpt.get();
            session.updateLastActivity();
            activeSessionRepository.save(session);
            log.debug("Successfully refreshed session: {}", sessionId);
            return true;
        } else {
            log.warn("Session not found for refresh: {}", sessionId);
            return false;
        }
    }

    /**
     * Checks if a session exists and is valid.
     *
     * @param sessionId the ID of the session to check
     * @return true if session exists and is valid, false otherwise
     */
    public boolean isSessionValid(String sessionId) {
        Optional<ActiveSession> sessionOpt = activeSessionRepository.findById(sessionId);
        
        if (sessionOpt.isEmpty()) {
            return false;
        }
        
        int sessionTimeoutMinutes = securitySettingsService.getSecuritySettings().getSessionTimeoutMinutes();
        return sessionOpt.get().isValid(sessionTimeoutMinutes);
    }

    /**
     * Retrieves a specific session by ID.
     *
     * @param sessionId the ID of the session to retrieve
     * @return Optional containing the session if found, empty otherwise
     */
    public Optional<ActiveSession> getSession(String sessionId) {
        return activeSessionRepository.findById(sessionId);
    }

    /**
     * Validates that a session belongs to the expected user and refreshes its activity timestamp.
     *
     * @param sessionId the session id embedded in the JWT
     * @param username the authenticated username from JWT subject
     * @return true when the session exists, belongs to the user, and is still valid
     */
    public boolean validateAndRefreshSession(String sessionId, String username) {
        Optional<ActiveSession> sessionOpt = activeSessionRepository.findById(sessionId);
        if (sessionOpt.isEmpty()) {
            return false;
        }

        ActiveSession session = sessionOpt.get();
        int sessionTimeoutMinutes = securitySettingsService.getSecuritySettings().getSessionTimeoutMinutes();

        if (!username.equalsIgnoreCase(session.getUsername())) {
            log.warn("Session {} does not belong to username {}", sessionId, username);
            return false;
        }

        if (!session.isValid(sessionTimeoutMinutes)) {
            activeSessionRepository.deleteById(sessionId);
            return false;
        }

        session.updateLastActivity();
        activeSessionRepository.save(session);
        return true;
    }

    /**
     * Cleans up expired sessions from Redis.
     * This method should be called periodically (e.g., via scheduled task) to remove stale sessions.
     *
     * @return the number of expired sessions removed
     */
    public int cleanupExpiredSessions() {
        log.info("Starting cleanup of expired sessions");
        
        int sessionTimeoutMinutes = securitySettingsService.getSecuritySettings().getSessionTimeoutMinutes();
        
        List<ActiveSession> allSessions = new ArrayList<>();
        activeSessionRepository.findAll().forEach(allSessions::add);
        
        int cleanedCount = 0;
        
        for (ActiveSession session : allSessions) {
            if (session.isExpired(sessionTimeoutMinutes)) {
                activeSessionRepository.deleteById(session.getSessionId());
                cleanedCount++;
                log.debug("Removed expired session: {} for user: {}", 
                        session.getSessionId(), session.getUsername());
            }
        }
        
        log.info("Cleaned up {} expired sessions", cleanedCount);
        return cleanedCount;
    }

    /**
     * Gets the total count of active sessions.
     *
     * @return the number of active sessions
     */
    public long getActiveSessionCount() {
        int sessionTimeoutMinutes = securitySettingsService.getSecuritySettings().getSessionTimeoutMinutes();
        
        List<ActiveSession> allSessions = new ArrayList<>();
        activeSessionRepository.findAll().forEach(allSessions::add);
        
        long count = allSessions.stream()
                .filter(session -> session.isValid(sessionTimeoutMinutes))
                .count();
        
        log.debug("Total active sessions: {}", count);
        return count;
    }
}
