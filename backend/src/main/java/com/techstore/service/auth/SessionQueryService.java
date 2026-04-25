package com.techstore.service.auth;

import com.techstore.entity.auth.ActiveSession;
import com.techstore.repository.auth.ActiveSessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
@RequiredArgsConstructor
@Slf4j
public class SessionQueryService {

    private final ActiveSessionRepository activeSessionRepository;
    private final SecuritySettingsService securitySettingsService;

    public List<ActiveSession> getAllActiveSessions() {
        log.debug("Retrieving all active sessions");
        int timeout = securitySettingsService.getSecuritySettings().getSessionTimeoutMinutes();
        
        return StreamSupport.stream(activeSessionRepository.findAll().spliterator(), false)
                .filter(session -> session.isValid(timeout))
                .collect(Collectors.toList());
    }

    public List<ActiveSession> getActiveSessionsForUser(String userId) {
        log.debug("Retrieving active sessions for user ID: {}", userId);
        int timeout = securitySettingsService.getSecuritySettings().getSessionTimeoutMinutes();
        
        return activeSessionRepository.findByUserId(userId).stream()
                .filter(session -> session.isValid(timeout))
                .collect(Collectors.toList());
    }

    public boolean isSessionValid(String sessionId) {
        return activeSessionRepository.findById(sessionId)
                .map(session -> session.isValid(securitySettingsService.getSecuritySettings().getSessionTimeoutMinutes()))
                .orElse(false);
    }

    public Optional<ActiveSession> getSession(String sessionId) {
        return activeSessionRepository.findById(sessionId);
    }

    public long getActiveSessionCount() {
        int timeout = securitySettingsService.getSecuritySettings().getSessionTimeoutMinutes();
        return StreamSupport.stream(activeSessionRepository.findAll().spliterator(), false)
                .filter(session -> session.isValid(timeout))
                .count();
    }
}
