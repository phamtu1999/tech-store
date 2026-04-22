package com.techstore.service.backup;

import com.techstore.dto.backup.BackupResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BackupService {

    private final com.techstore.repository.backup.BackupRepository backupRepository;

    @Value("${spring.datasource.username}")
    private String dbUser;

    @Value("${spring.datasource.password}")
    private String dbPassword;

    @Value("${app.backup.db-host}")
    private String dbHost;

    @Value("${app.backup.db-port}")
    private String dbPort;

    @Value("${app.backup.db-name}")
    private String dbName;

    @Value("${app.backup.ssl-mode}")
    private String dbSslMode;

    @Value("${app.backup.dir}")
    private String backupDir;

    @Value("${app.backup.retention-count:10}")
    private int retentionCount;

    @Value("${app.backup.schedule-enabled:true}")
    private boolean scheduledBackupEnabled;

    @jakarta.annotation.PostConstruct
    public void init() {
        try {
            Files.createDirectories(Paths.get(backupDir));
            log.info("Backup directory: {}", Paths.get(backupDir).toAbsolutePath());
        } catch (Exception exception) {
            log.error("Failed to create backup directory: {}", backupDir, exception);
        }
    }

    public BackupResponse createBackup() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String fileName = "backup_" + timestamp + ".sql.gz";
        Path path = Paths.get(backupDir, fileName);

        try {
            Files.createDirectories(Paths.get(backupDir));

            String command = String.format(
                    "pg_dump -h %s -p %s -U %s %s | gzip > \"%s\"",
                    dbHost, dbPort, dbUser, dbName, path
            );

            ProcessBuilder processBuilder = new ProcessBuilder("sh", "-c", command);
            processBuilder.environment().put("PGPASSWORD", dbPassword);
            processBuilder.environment().put("PGSSLMODE", dbSslMode);

            Process process = processBuilder.start();
            int exitCode = process.waitFor();

            if (exitCode != 0) {
                throw new RuntimeException("Backup failed with exit code: " + exitCode);
            }

            File file = path.toFile();
            BackupResponse response = BackupResponse.builder()
                    .fileName(fileName)
                    .fileSize(formatFileSize(file.length()))
                    .createdAt(LocalDateTime.now())
                    .downloadUrl("/api/v1/admin/backups/download/" + fileName)
                    .build();

            backupRepository.save(com.techstore.entity.backup.Backup.builder()
                    .fileName(fileName)
                    .fileSize(response.getFileSize())
                    .build());

            return response;
        } catch (Exception exception) {
            log.error("Error creating backup", exception);
            throw new RuntimeException("Failed to create backup: " + exception.getMessage());
        }
    }

    public List<BackupResponse> getAllBackups() {
        try {
            return backupRepository.findAllByOrderByCreatedAtDesc().stream()
                    .map(backup -> {
                        boolean exists = new File(backupDir, backup.getFileName()).exists();
                        return BackupResponse.builder()
                                .fileName(backup.getFileName() + (exists ? "" : " (Missing file)"))
                                .fileSize(backup.getFileSize())
                                .createdAt(backup.getCreatedAt())
                                .downloadUrl(exists ? "/api/v1/admin/backups/download/" + backup.getFileName() : null)
                                .build();
                    })
                    .collect(Collectors.toList());
        } catch (Exception exception) {
            log.error("Error listing backups from DB", exception);
            return new ArrayList<>();
        }
    }

    public BackupResponse uploadBackup(org.springframework.web.multipart.MultipartFile file) {
        try {
            String fileName = file.getOriginalFilename();
            if (fileName == null || (!fileName.endsWith(".sql.gz") && !fileName.endsWith(".sql"))) {
                throw new RuntimeException("Only .sql and .sql.gz files are allowed");
            }

            Files.createDirectories(Paths.get(backupDir));
            Path targetLocation = Paths.get(backupDir).resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            File savedFile = targetLocation.toFile();
            backupRepository.save(com.techstore.entity.backup.Backup.builder()
                    .fileName(fileName)
                    .fileSize(formatFileSize(savedFile.length()))
                    .build());

            return BackupResponse.builder()
                    .fileName(fileName)
                    .fileSize(formatFileSize(savedFile.length()))
                    .createdAt(LocalDateTime.now())
                    .downloadUrl("/api/v1/admin/backups/download/" + fileName)
                    .build();
        } catch (Exception exception) {
            log.error("Error uploading backup", exception);
            throw new RuntimeException("Could not upload backup: " + exception.getMessage());
        }
    }

    public void deleteBackup(String fileName) {
        try {
            Path path = Paths.get(backupDir).resolve(fileName);
            Files.deleteIfExists(path);
            backupRepository.findByFileName(fileName).ifPresent(backupRepository::delete);
        } catch (Exception exception) {
            log.error("Error deleting backup file", exception);
            throw new RuntimeException("Could not delete backup file: " + exception.getMessage());
        }
    }

    @Scheduled(cron = "${app.backup.schedule-cron:0 0 2 * * *}")
    public void scheduledBackup() {
        if (!scheduledBackupEnabled) {
            return;
        }

        log.info("Starting scheduled backup");
        try {
            createBackup();
            cleanupOldBackups(retentionCount);
            log.info("Scheduled backup completed successfully");
        } catch (Exception exception) {
            log.error("Scheduled backup failed", exception);
        }
    }

    @Transactional
    public void cleanupOldBackups(int retentionCount) {
        List<com.techstore.entity.backup.Backup> all = backupRepository.findAllByOrderByCreatedAtDesc();
        if (all.size() <= retentionCount) {
            return;
        }

        log.info("Cleaning up old backups. Existing: {}, limit: {}", all.size(), retentionCount);
        List<com.techstore.entity.backup.Backup> toDelete = all.subList(retentionCount, all.size());
        for (com.techstore.entity.backup.Backup backup : toDelete) {
            log.info("Deleting old backup file: {}", backup.getFileName());
            deleteBackup(backup.getFileName());
        }
    }

    public void restoreBackup(String fileName) {
        Path path = Paths.get(backupDir).resolve(fileName);
        if (!Files.exists(path)) {
            throw new RuntimeException("Backup file does not exist: " + fileName);
        }

        log.warn("Restoring database from file: {}", fileName);
        try {
            String command = String.format(
                    "gunzip -c \"%s\" | psql -h %s -p %s -U %s %s",
                    path, dbHost, dbPort, dbUser, dbName
            );

            ProcessBuilder processBuilder = new ProcessBuilder("sh", "-c", command);
            processBuilder.environment().put("PGPASSWORD", dbPassword);
            processBuilder.environment().put("PGSSLMODE", dbSslMode);

            Process process = processBuilder.start();
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getErrorStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    log.info("pg_restore output: {}", line);
                }
            }

            int exitCode = process.waitFor();
            if (exitCode != 0) {
                throw new RuntimeException("Restore failed with exit code: " + exitCode);
            }

            log.info("Restore successful: {}", fileName);
        } catch (Exception exception) {
            log.error("Restore error", exception);
            throw new RuntimeException("Restore failed: " + exception.getMessage());
        }
    }

    private String formatFileSize(long bytes) {
        if (bytes < 1024) {
            return bytes + " B";
        }

        int exp = (int) (Math.log(bytes) / Math.log(1024));
        char prefix = "KMGTPE".charAt(exp - 1);
        return String.format("%.1f %sB", bytes / Math.pow(1024, exp), prefix);
    }
}
