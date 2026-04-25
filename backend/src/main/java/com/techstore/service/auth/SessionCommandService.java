package com.techstore.service.auth;

import com.techstore.entity.auth.ActiveSession;
import com.techstore.repository.auth.ActiveSessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class SessionCommandService {

    private final ActiveSessionRepository activeSessionRepository;
    private final SecuritySettingsService securitySettingsService;

    public boolean terminateSession(String sessionId) {
        log.info("Terminating session: {}", sessionId);
        if (activeSessionRepository.existsById(sessionId)) {
            activeSessionRepository.deleteById(sessionId);
            return true;
        }
        return false;
    }

    public int terminateAllSessions(boolean excludeCurrentSession, String currentSessionId) {
        log.info("Terminating all sessions");
        List<ActiveSession> allSessions = new ArrayList<>();
        activeSessionRepository.findAll().forEach(allSessions::add);
        
        int count = 0;
        for (ActiveSession session : allSessions) {
            if (excludeCurrentSession && session.getSessionId().equals(currentSessionId)) continue;
            activeSessionRepository.deleteById(session.getSessionId());
            count++;
        }
        return count;
    }

    public int terminateAllSessionsForUser(String userId, boolean excludeCurrentSession, String currentSessionId) {
        log.info("Terminating sessions for user: {}", userId);
        List<ActiveSession> userSessions = (excludeCurrentSession && currentSessionId != null)
                ? activeSessionRepository.findByUserIdAndSessionIdNot(userId, currentSessionId)
                : activeSessionRepository.findByUserId(userId);
        
        userSessions.forEach(s -> activeSessionRepository.deleteById(s.getSessionId()));
        return userSessions.size();
    }

    public ActiveSession saveSession(ActiveSession session) {
        session.updateLastActivity();
        return activeSessionRepository.save(session);
    }

    public boolean refreshSession(String sessionId) {
        return activeSessionRepository.findById(sessionId)
                .map(session -> {
                    session.updateLastActivity();
                    activeSessionRepository.save(session);
                    return true;
                }).orElse(false);
    }

    public boolean validateAndRefreshSession(String sessionId, String username) {
        Optional<ActiveSession> sessionOpt = activeSessionRepository.findById(sessionId);
        if (sessionOpt.isEmpty()) return false;

        ActiveSession session = sessionOpt.get();
        int timeout = securitySettingsService.getSecuritySettings().getSessionTimeoutMinutes();

        if (!username.equalsIgnoreCase(session.getUsername()) || !session.isValid(timeout)) {
            if (!session.isValid(timeout)) activeSessionRepository.deleteById(sessionId);
            return false;
        }

        session.updateLastActivity();
        activeSessionRepository.save(session);
        return true;
    }

    public int cleanupExpiredSessions() {
        log.info("Starting cleanup of expired sessions");
        int timeout = securitySettingsService.getSecuritySettings().getSessionTimeoutMinutes();
        List<ActiveSession> allSessions = new ArrayList<>();
        activeSessionRepository.findAll().forEach(allSessions::add);
        
        int count = 0;
        for (ActiveSession session : allSessions) {
            if (session.isExpired(timeout)) {
                activeSessionRepository.deleteById(session.getSessionId());
                count++;
            }
        }
        return count;
    }
}
