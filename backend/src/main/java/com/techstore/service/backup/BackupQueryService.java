package com.techstore.service.backup;

import com.techstore.dto.backup.BackupResponse;
import com.techstore.entity.backup.Backup;
import com.techstore.repository.backup.BackupRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.InvalidPathException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BackupQueryService {

    private final BackupRepository backupRepository;

    @Value("${app.backup.dir}")
    private String backupDir;

    @Transactional(readOnly = true)
    public List<BackupResponse> getAllBackups() {
        try {
            return backupRepository.findAllByOrderByCreatedAtDesc().stream()
                    .map(this::mapToResponse)
                    .collect(Collectors.toList());
        } catch (Exception exception) {
            log.error("Error listing backups from DB", exception);
            return new ArrayList<>();
        }
    }

    public Resource loadBackupResource(String fileName) {
        try {
            Backup backup = backupRepository.findByFileName(fileName)
                    .orElseThrow(() -> new RuntimeException("Backup record not found: " + fileName));
            
            if (backup.getCloudinaryUrl() == null || backup.getCloudinaryUrl().isBlank()) {
                return new UrlResource(resolveBackupPath(fileName).toUri());
            }
            
            return new UrlResource(new java.net.URL(backup.getCloudinaryUrl()));
        } catch (Exception exception) {
            log.error("Could not load backup file: {}", fileName, exception);
            throw new RuntimeException("Could not load backup file: " + exception.getMessage(), exception);
        }
    }

    private BackupResponse mapToResponse(Backup backup) {
        return BackupResponse.builder()
                .fileName(backup.getFileName())
                .fileSize(backup.getFileSize())
                .createdAt(backup.getCreatedAt())
                .downloadUrl(backup.getCloudinaryUrl())
                .build();
    }

    private Path resolveBackupPath(String fileName) {
        String sanitizedFileName = sanitizeBackupFileName(fileName);
        Path backupRoot = Paths.get(backupDir).toAbsolutePath().normalize();
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
}
