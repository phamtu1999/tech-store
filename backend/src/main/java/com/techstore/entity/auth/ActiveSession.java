package com.techstore.entity.auth;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * ActiveSession entity for tracking user sessions in Redis.
 * This is a POJO for Redis storage, not a JPA entity.
 * 
 * Redis Key Pattern: active_sessions:{sessionId}
 * Data Structure: Redis Hash
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@RedisHash("active_sessions")
public class ActiveSession implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String sessionId;
    
    @Indexed
    private Long userId;
    private String username;
    private String ipAddress;
    private String deviceInfo;
    private LocalDateTime loginTimestamp;
    private LocalDateTime lastActivityTimestamp;

    /**
     * Validates if the session is still active based on the timeout configuration
     * @param sessionTimeoutMinutes the configured session timeout in minutes
     * @return true if session is still valid, false if expired
     */
    public boolean isValid(int sessionTimeoutMinutes) {
        if (lastActivityTimestamp == null) {
            return false;
        }
        LocalDateTime expirationTime = lastActivityTimestamp.plusMinutes(sessionTimeoutMinutes);
        return LocalDateTime.now().isBefore(expirationTime);
    }

    /**
     * Checks if the session has expired based on the timeout configuration
     * @param sessionTimeoutMinutes the configured session timeout in minutes
     * @return true if session has expired, false if still valid
     */
    public boolean isExpired(int sessionTimeoutMinutes) {
        return !isValid(sessionTimeoutMinutes);
    }

    /**
     * Updates the last activity timestamp to the current time
     */
    public void updateLastActivity() {
        this.lastActivityTimestamp = LocalDateTime.now();
    }
}
