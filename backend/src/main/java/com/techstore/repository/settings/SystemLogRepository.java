package com.techstore.repository.settings;

import com.techstore.entity.settings.SystemLog;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface SystemLogRepository extends JpaRepository<SystemLog, Long> {
    Page<SystemLog> findAll(Pageable pageable);
    
    Page<SystemLog> findByTimestampBetween(LocalDateTime start, LocalDateTime end, Pageable pageable);
    
    Page<SystemLog> findByActionAndStatusAndTimestampBetween(
            String action, String status, LocalDateTime start, LocalDateTime end, Pageable pageable);
            
    Page<SystemLog> findByActionAndTimestampBetween(
            String action, LocalDateTime start, LocalDateTime end, Pageable pageable);
            
    Page<SystemLog> findByStatusAndTimestampBetween(
            String status, LocalDateTime start, LocalDateTime end, Pageable pageable);
}
