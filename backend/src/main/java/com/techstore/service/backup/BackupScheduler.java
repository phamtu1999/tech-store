package com.techstore.service.backup;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.nio.file.Files;
import java.nio.file.Paths;

@Component
@RequiredArgsConstructor
@Slf4j
public class BackupScheduler {

    private final BackupCommandService backupCommandService;

    @Value("${app.backup.dir}")
    private String backupDir;

    @Value("${app.backup.retention-count:10}")
    private int retentionCount;

    @Value("${app.backup.schedule-enabled:true}")
    private boolean scheduledBackupEnabled;

    @jakarta.annotation.PostConstruct
    public void init() {
        try {
            Files.createDirectories(Paths.get(backupDir).toAbsolutePath().normalize());
            log.info("Backup system initialized at: {}", backupDir);
        } catch (Exception exception) {
            log.error("Failed to initialize backup directory", exception);
        }
    }

    @Scheduled(cron = "${app.backup.schedule-cron:0 0 2 * * *}")
    public void scheduledBackup() {
        if (!scheduledBackupEnabled) return;

        log.info("Starting scheduled backup...");
        try {
            backupCommandService.createBackup();
            backupCommandService.cleanupOldBackups(retentionCount);
            log.info("Scheduled backup completed successfully");
        } catch (Exception exception) {
            log.error("Scheduled backup failed", exception);
        }
    }
}
