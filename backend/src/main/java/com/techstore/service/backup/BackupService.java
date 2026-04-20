package com.techstore.service.backup;

import com.techstore.dto.backup.BackupResponse;


import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class BackupService {

    private final com.techstore.repository.backup.BackupRepository backupRepository;

    @Value("${spring.datasource.username}")
    private String dbUser;

    @Value("${spring.datasource.password}")
    private String dbPassword;

    @Value("${POSTGRES_DB:techstore}")
    private String dbName;

    @Value("${app.backup.dir:/app/backups}")
    private String backupDir;

    @jakarta.annotation.PostConstruct
    public void init() {
        try {
            Files.createDirectories(Paths.get(backupDir));
            log.info("========== Backup Service Initialized ==========");
            log.info("Backup directory: {}", Paths.get(backupDir).toAbsolutePath());
            log.info("===============================================");
        } catch (Exception e) {
            log.error("Failed to create backup directory: {}", backupDir);
        }
    }

    public BackupResponse createBackup() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String fileName = "backup_" + timestamp + ".sql.gz";
        Path path = Paths.get(backupDir, fileName);

        try {
            Files.createDirectories(Paths.get(backupDir));

            // Use shell to pipe pg_dump to gzip for maximum compression
            String command = String.format(
                "pg_dump -h postgres -U %s %s | gzip > %s",
                dbUser, dbName, path.toString()
            );

            ProcessBuilder pb = new ProcessBuilder("sh", "-c", command);
            pb.environment().put("PGPASSWORD", dbPassword);

            Process process = pb.start();
            int exitCode = process.waitFor();

            if (exitCode == 0) {
                File file = path.toFile();
                log.info("Backup successfully saved at CANONICAL PATH: {}", file.getCanonicalPath());
                log.info("File exists verification: {}", file.exists());
                
                BackupResponse response = BackupResponse.builder()
                        .fileName(fileName)
                        .fileSize(formatFileSize(file.length()))
                        .createdAt(LocalDateTime.now())
                        .downloadUrl("/api/v1/admin/backups/download/" + fileName)
                        .build();

                // Save to database to survive builds
                backupRepository.save(com.techstore.entity.backup.Backup.builder()
                        .fileName(fileName)
                        .fileSize(response.getFileSize())
                        .build());

                return response;
            } else {
                throw new RuntimeException("Backup failed with exit code: " + exitCode);
            }
        } catch (Exception e) {
            log.error("Error creating backup: ", e);
            throw new RuntimeException("Failed to create backup: " + e.getMessage());
        }
    }

    public List<BackupResponse> getAllBackups() {
        try {
            return backupRepository.findAll().stream()
                    .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                    .map(b -> {
                        boolean exists = new File(backupDir, b.getFileName()).exists();
                        return BackupResponse.builder()
                                .fileName(b.getFileName() + (exists ? "" : " (Hết hạn/Mất file)"))
                                .fileSize(b.getFileSize())
                                .createdAt(b.getCreatedAt())
                                .downloadUrl(exists ? "/api/v1/admin/backups/download/" + b.getFileName() : null)
                                .build();
                    })
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error listing backups from DB: ", e);
            return new ArrayList<>();
        }
    }

    public BackupResponse uploadBackup(org.springframework.web.multipart.MultipartFile file) {
        try {
            String fileName = file.getOriginalFilename();
            if (fileName == null || (!fileName.endsWith(".sql.gz") && !fileName.endsWith(".sql"))) {
                throw new RuntimeException("Chỉ cho phép tải lên file .sql hoặc .sql.gz");
            }

            Files.createDirectories(Paths.get(backupDir));
            Path targetLocation = Paths.get(backupDir).resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, java.nio.file.StandardCopyOption.REPLACE_EXISTING);

            File savedFile = targetLocation.toFile();
            
            // Save to DB
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
        } catch (Exception e) {
            log.error("Error uploading backup: ", e);
            throw new RuntimeException("Không thể tải lên bản sao lưu: " + e.getMessage());
        }
    }

    public void deleteBackup(String fileName) {
        try {
            Path path = Paths.get(backupDir).resolve(fileName);
            Files.deleteIfExists(path);
            backupRepository.findByFileName(fileName).ifPresent(backupRepository::delete);
        } catch (Exception e) {
            log.error("Error deleting backup file: ", e);
            throw new RuntimeException("Could not delete backup file: " + e.getMessage());
        }
    }

    private String formatFileSize(long bytes) {
        if (bytes < 1024) return bytes + " B";
        int exp = (int) (Math.log(bytes) / Math.log(1024));
        char pre = "KMGTPE".charAt(exp - 1);
        return String.format("%.1f %sB", bytes / Math.pow(1024, exp), pre);
    }
}
