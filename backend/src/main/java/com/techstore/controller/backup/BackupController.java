package com.techstore.controller.backup;

import com.techstore.dto.ApiResponse;
import com.techstore.dto.backup.BackupResponse;
import com.techstore.service.backup.BackupCommandService;
import com.techstore.service.backup.BackupQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/backups")
@RequiredArgsConstructor
@CrossOrigin
@PreAuthorize("hasRole('ADMIN')")
public class BackupController {

    private final BackupQueryService backupQueryService;
    private final BackupCommandService backupCommandService;

    @Value("${app.backup.retention-count:10}")
    private int retentionCount;

    @PostMapping
    public ResponseEntity<BackupResponse> createBackup() {
        return ResponseEntity.ok(backupCommandService.createBackup());
    }

    @GetMapping
    public ResponseEntity<List<BackupResponse>> getAllBackups() {
        return ResponseEntity.ok(backupQueryService.getAllBackups());
    }

    @PostMapping("/upload")
    public ResponseEntity<BackupResponse> uploadBackup(@RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        return ResponseEntity.ok(backupCommandService.uploadBackup(file));
    }

    @GetMapping("/download/{fileName:.+}")
    public ResponseEntity<?> downloadBackup(@PathVariable String fileName) {
        try {
            String signedUrl = backupQueryService.getSignedDownloadUrl(fileName);
            if (signedUrl != null) {
                return ResponseEntity.status(org.springframework.http.HttpStatus.FOUND)
                        .location(java.net.URI.create(signedUrl))
                        .build();
            }
            
            // Fallback for local files
            Resource resource = backupQueryService.loadBackupResource(fileName);
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType("application/x-gzip"))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                    .body(resource);
        } catch (Exception exception) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/restore/{fileName:.+}")
    public ResponseEntity<ApiResponse<String>> restoreBackup(@PathVariable String fileName) {
        backupCommandService.restoreBackup(fileName);
        return ResponseEntity.ok(ApiResponse.<String>builder()
                .message("Phục hồi dữ liệu thành công")
                .result("Dữ liệu đã được khôi phục từ file " + fileName)
                .build());
    }

    @DeleteMapping("/{fileName:.+}")
    public ResponseEntity<Void> deleteBackup(@PathVariable String fileName) {
        backupCommandService.deleteBackup(fileName);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/cleanup")
    public ResponseEntity<ApiResponse<String>> cleanupOldBackups() {
        backupCommandService.cleanupOldBackups(retentionCount);
        return ResponseEntity.ok(ApiResponse.<String>builder()
                .message("Dọn dẹp backup cũ thành công")
                .result("Giữ lại " + retentionCount + " bản backup gần nhất")
                .build());
    }
}
