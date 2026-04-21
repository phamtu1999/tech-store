package com.techstore.repository.auth;

import com.techstore.entity.auth.ActiveSession;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for ActiveSession entities stored in Redis.
 * Uses CrudRepository instead of JpaRepository since ActiveSession is stored in Redis, not a relational database.
 */
@Repository
public interface ActiveSessionRepository extends CrudRepository<ActiveSession, String> {
    
    /**
     * Find all active sessions for a specific user by user ID
     */
    List<ActiveSession> findByUserId(String userId);
    
    /**
     * Find all active sessions for a user excluding a specific session
     * Useful for "terminate other sessions" functionality
     */
    List<ActiveSession> findByUserIdAndSessionIdNot(String userId, String excludeSessionId);
}
