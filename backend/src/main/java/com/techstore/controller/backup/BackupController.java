package com.techstore.controller.backup;

import com.techstore.dto.ApiResponse;
import com.techstore.dto.backup.BackupResponse;
import com.techstore.service.backup.BackupService;
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

    private final BackupService backupService;

    @Value("${app.backup.retention-count:10}")
    private int retentionCount;

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
            Resource resource = backupService.loadBackupResource(fileName);
            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_OCTET_STREAM)
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception exception) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/restore/{fileName:.+}")
    public ResponseEntity<ApiResponse<String>> restoreBackup(@PathVariable String fileName) {
        backupService.restoreBackup(fileName);
        return ResponseEntity.ok(ApiResponse.<String>builder()
                .message("Phục hồi dữ liệu thành công")
                .result("Dữ liệu đã được khôi phục từ file " + fileName)
                .build());
    }

    @DeleteMapping("/{fileName:.+}")
    public ResponseEntity<Void> deleteBackup(@PathVariable String fileName) {
        backupService.deleteBackup(fileName);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/cleanup")
    public ResponseEntity<ApiResponse<String>> cleanupOldBackups() {
        backupService.cleanupOldBackups(retentionCount);
        return ResponseEntity.ok(ApiResponse.<String>builder()
                .message("Dọn dẹp backup cũ thành công")
                .result("Giữ lại " + retentionCount + " bản backup gần nhất")
                .build());
    }
}
