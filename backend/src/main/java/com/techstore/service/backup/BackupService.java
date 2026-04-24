package com.techstore.service.backup;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.techstore.dto.backup.BackupResponse;
import com.techstore.entity.backup.Backup;
import com.techstore.repository.backup.BackupRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.InvalidPathException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.zip.GZIPInputStream;
import java.util.zip.GZIPOutputStream;

@Service
@RequiredArgsConstructor
@Slf4j
public class BackupService {

    private final BackupRepository backupRepository;
    private final Cloudinary cloudinary;

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

    @Value("${app.backup.cleanup-orphan-records:true}")
    private boolean cleanupOrphanRecords;

    @Value("${app.backup.schedule-enabled:true}")
    private boolean scheduledBackupEnabled;

    @jakarta.annotation.PostConstruct
    public void init() {
        try {
            Files.createDirectories(getBackupRootPath());
            log.info("Backup directory: {}", getBackupRootPath());
        } catch (Exception exception) {
            log.error("Failed to create backup directory: {}", backupDir, exception);
        }
    }

    public BackupResponse createBackup() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String fileName = "backup_" + timestamp + ".sql.gz";

        Path tempPath = null;
        try {
            Files.createDirectories(getBackupRootPath());
            tempPath = Files.createTempFile("backup_", ".sql.gz");

            ProcessBuilder processBuilder = new ProcessBuilder(
                    "pg_dump",
                    "-h", dbHost,
                    "-p", dbPort,
                    "-U", dbUser,
                    dbName
            );
            configureDatabaseProcess(processBuilder);

            Process process = processBuilder.start();
            StringBuilder stderr = new StringBuilder();
            Thread stderrThread = startStreamCollector(process.getErrorStream(), stderr, "pg_dump");

            try (InputStream databaseDump = process.getInputStream();
                 OutputStream fileOutput = Files.newOutputStream(tempPath);
                 GZIPOutputStream gzipOutputStream = new GZIPOutputStream(fileOutput)) {
                databaseDump.transferTo(gzipOutputStream);
            }

            int exitCode = process.waitFor();
            stderrThread.join();
            if (exitCode != 0) {
                Files.deleteIfExists(tempPath);
                throw new RuntimeException("Backup failed with exit code: " + exitCode + ". " + stderr.toString().trim());
            }

            File file = tempPath.toFile();
            Map<?, ?> uploadResult = cloudinary.uploader().upload(file, ObjectUtils.asMap(
                    "resource_type", "raw",
                    "folder", "techstore/backups",
                    "public_id", fileName,
                    "overwrite", true,
                    "use_filename", false
            ));

            String cloudinaryPublicId = uploadResult.get("public_id").toString();
            String cloudinaryUrl = uploadResult.get("secure_url").toString();

            Backup backup = backupRepository.save(Backup.builder()
                    .fileName(fileName)
                    .fileSize(formatFileSize(file.length()))
                    .cloudinaryPublicId(cloudinaryPublicId)
                    .cloudinaryUrl(cloudinaryUrl)
                    .build());

            return BackupResponse.builder()
                    .fileName(backup.getFileName())
                    .fileSize(backup.getFileSize())
                    .createdAt(backup.getCreatedAt())
                    .downloadUrl(backup.getCloudinaryUrl())
                    .build();
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Backup was interrupted", exception);
        } catch (Exception exception) {
            log.error("Error creating backup", exception);
            throw new RuntimeException("Failed to create backup: " + exception.getMessage());
        } finally {
            if (tempPath != null) {
                try {
                    Files.deleteIfExists(tempPath);
                } catch (IOException ignored) {
                }
            }
        }
    }

    public List<BackupResponse> getAllBackups() {
        try {
            return backupRepository.findAllByOrderByCreatedAtDesc().stream()
                    .map(backup -> BackupResponse.builder()
                            .fileName(backup.getFileName())
                            .fileSize(backup.getFileSize())
                            .createdAt(backup.getCreatedAt())
                            .downloadUrl(backup.getCloudinaryUrl())
                            .build())
                    .collect(Collectors.toList());
        } catch (Exception exception) {
            log.error("Error listing backups from DB", exception);
            return new ArrayList<>();
        }
    }

    public BackupResponse uploadBackup(org.springframework.web.multipart.MultipartFile file) {
        try {
            String fileName = sanitizeBackupFileName(file.getOriginalFilename());
            if (!fileName.endsWith(".sql.gz") && !fileName.endsWith(".sql")) {
                throw new RuntimeException("Only .sql and .sql.gz files are allowed");
            }

            Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                    "resource_type", "raw",
                    "folder", "techstore/backups",
                    "public_id", fileName,
                    "overwrite", true,
                    "use_filename", false
            ));

            String cloudinaryPublicId = uploadResult.get("public_id").toString();
            String cloudinaryUrl = uploadResult.get("secure_url").toString();

            Backup backup = backupRepository.save(Backup.builder()
                    .fileName(fileName)
                    .fileSize(formatFileSize(file.getSize()))
                    .cloudinaryPublicId(cloudinaryPublicId)
                    .cloudinaryUrl(cloudinaryUrl)
                    .build());

            return BackupResponse.builder()
                    .fileName(backup.getFileName())
                    .fileSize(backup.getFileSize())
                    .createdAt(backup.getCreatedAt())
                    .downloadUrl(backup.getCloudinaryUrl())
                    .build();
        } catch (Exception exception) {
            log.error("Error uploading backup", exception);
            throw new RuntimeException("Could not upload backup: " + exception.getMessage());
        }
    }

    public void deleteBackup(String fileName) {
        try {
            Backup backup = backupRepository.findByFileName(fileName)
                    .orElseThrow(() -> new RuntimeException("Backup record not found: " + fileName));

            if (backup.getCloudinaryPublicId() != null && !backup.getCloudinaryPublicId().isBlank()) {
                cloudinary.uploader().destroy(backup.getCloudinaryPublicId(), ObjectUtils.asMap("resource_type", "raw"));
            }

            backupRepository.delete(backup);
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
        List<Backup> all = backupRepository.findAllByOrderByCreatedAtDesc();
        if (all.size() <= retentionCount) {
            return;
        }

        log.info("Cleaning up old backups. Existing: {}, limit: {}", all.size(), retentionCount);
        List<Backup> toDelete = all.subList(retentionCount, all.size());
        for (Backup backup : toDelete) {
            log.info("Deleting old backup file: {}", backup.getFileName());
            deleteBackup(backup.getFileName());
        }
    }

    public void restoreBackup(String fileName) {
        Backup backup = backupRepository.findByFileName(fileName)
                .orElseThrow(() -> new RuntimeException("Backup record not found: " + fileName));

        if (backup.getCloudinaryUrl() == null || backup.getCloudinaryUrl().isBlank()) {
            throw new RuntimeException("Backup file URL is missing: " + fileName);
        }

        log.warn("Restoring database from cloud backup: {}", fileName);
        Path tempPath = null;
        try {
            tempPath = Files.createTempFile("restore_", fileName.endsWith(".gz") ? ".gz" : ".sql");
            try (InputStream remoteInput = new java.net.URL(backup.getCloudinaryUrl()).openStream();
                 OutputStream localOutput = Files.newOutputStream(tempPath)) {
                remoteInput.transferTo(localOutput);
            }

            ProcessBuilder processBuilder = new ProcessBuilder(
                    "psql",
                    "-h", dbHost,
                    "-p", dbPort,
                    "-U", dbUser,
                    dbName
            );
            configureDatabaseProcess(processBuilder);
            processBuilder.redirectErrorStream(true);

            Process process = processBuilder.start();
            StringBuilder processOutput = new StringBuilder();
            Thread outputThread = startStreamCollector(process.getInputStream(), processOutput, "psql");

            try (InputStream backupInputStream = openBackupInputStream(tempPath);
                 OutputStream databaseInput = process.getOutputStream()) {
                backupInputStream.transferTo(databaseInput);
            }

            int exitCode = process.waitFor();
            outputThread.join();
            if (exitCode != 0) {
                throw new RuntimeException("Restore failed with exit code: " + exitCode + ". " + processOutput.toString().trim());
            }

            log.info("Restore successful: {}", fileName);
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Restore was interrupted", exception);
        } catch (Exception exception) {
            log.error("Restore error", exception);
            throw new RuntimeException("Restore failed: " + exception.getMessage());
        } finally {
            if (tempPath != null) {
                try {
                    Files.deleteIfExists(tempPath);
                } catch (IOException ignored) {
                }
            }
        }
    }

    public Resource loadBackupResource(String fileName) {
        try {
            return new UrlResource(resolveBackupPath(fileName).toUri());
        } catch (Exception exception) {
            throw new RuntimeException("Could not load backup file: " + exception.getMessage(), exception);
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

    private Path getBackupRootPath() {
        return Paths.get(backupDir).toAbsolutePath().normalize();
    }

    private Path resolveBackupPath(String fileName) {
        String sanitizedFileName = sanitizeBackupFileName(fileName);
        Path backupRoot = getBackupRootPath();
        Path resolvedPath = backupRoot.resolve(sanitizedFileName).normalize();
        if (!resolvedPath.startsWith(backupRoot)) {
            throw new IllegalArgumentException("Invalid backup file name");
        }
        return resolvedPath;
    }

    private String sanitizeBackupFileName(String fileName) {
        if (fileName == null || fileName.isBlank()) {
            throw new IllegalArgumentException("Backup file name is required");
        }

        try {
            String sanitizedFileName = Paths.get(fileName).getFileName().toString();
            if (sanitizedFileName.isBlank() || sanitizedFileName.contains("..")) {
                throw new IllegalArgumentException("Invalid backup file name");
            }
            return sanitizedFileName;
        } catch (InvalidPathException exception) {
            throw new IllegalArgumentException("Invalid backup file name", exception);
        }
    }

    private void configureDatabaseProcess(ProcessBuilder processBuilder) {
        processBuilder.environment().put("PGPASSWORD", dbPassword);
        processBuilder.environment().put("PGSSLMODE", dbSslMode);
    }

    private InputStream openBackupInputStream(Path path) throws IOException {
        InputStream fileInputStream = Files.newInputStream(path);
        if (path.getFileName().toString().endsWith(".gz")) {
            return new GZIPInputStream(fileInputStream);
        }
        return fileInputStream;
    }

    private Thread startStreamCollector(InputStream inputStream, StringBuilder outputBuffer, String logPrefix) {
        Thread collectorThread = new Thread(() -> {
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    outputBuffer.append(line).append(System.lineSeparator());
                    log.info("{}: {}", logPrefix, line);
                }
            } catch (IOException exception) {
                log.warn("Failed to read process output for {}", logPrefix, exception);
            }
        });
        collectorThread.setDaemon(true);
        collectorThread.start();
        return collectorThread;
    }
}
