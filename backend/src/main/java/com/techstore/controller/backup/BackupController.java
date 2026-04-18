package com.techstore.controller.backup;

import com.techstore.dto.backup.BackupResponse;
import com.techstore.service.backup.BackupService;


import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/backups")
@RequiredArgsConstructor
@CrossOrigin
@PreAuthorize("hasRole('ADMIN')")
public class BackupController {

    private final BackupService backupService;

    @jakarta.annotation.PostConstruct
    public void init() {
        System.out.println("========== BackupController Initialized ==========");
    }

    @Value("${app.backup.dir:/app/backups}")
    private String backupDir;

    @PostMapping
    public ResponseEntity<BackupResponse> createBackup() {
        return ResponseEntity.ok(backupService.createBackup());
    }

    @GetMapping
    public ResponseEntity<List<BackupResponse>> getAllBackups() {
        return ResponseEntity.ok(backupService.getAllBackups());
    }

    @PostMapping("/upload")
    public ResponseEntity<BackupResponse> uploadBackup(@RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        return ResponseEntity.ok(backupService.uploadBackup(file));
    }

    @GetMapping("/download/{fileName:.+}")
    public ResponseEntity<Resource> downloadBackup(@PathVariable String fileName) {
        try {
            Path path = Paths.get(backupDir).resolve(fileName);
            System.out.println("Processing download request for file: " + path.toString());
            Resource resource = new UrlResource(path.toUri());

            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_OCTET_STREAM)
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                        .body(resource);
            } else {
                System.err.println("File not found or not readable: " + path.toString());
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.err.println("Error processing download: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{fileName:.+}")
    public ResponseEntity<Void> deleteBackup(@PathVariable String fileName) {
        backupService.deleteBackup(fileName);
        return ResponseEntity.noContent().build();
    }
}
