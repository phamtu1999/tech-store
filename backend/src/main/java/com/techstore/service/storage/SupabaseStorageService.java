package com.techstore.service.storage;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.UUID;

@Service
@Slf4j
public class SupabaseStorageService implements StorageService {

    private final WebClient webClient;
    private final String bucketName;
    private final String supabaseUrl;

    public SupabaseStorageService(
            WebClient.Builder webClientBuilder,
            @Value("${application.supabase-storage.url}") String supabaseUrl,
            @Value("${application.supabase-storage.service-role-key}") String serviceRoleKey,
            @Value("${application.supabase-storage.bucket}") String bucketName
    ) {
        this.supabaseUrl = supabaseUrl;
        this.bucketName = bucketName;
        this.webClient = webClientBuilder
                .baseUrl(supabaseUrl + "/storage/v1/object")
                .defaultHeader("Authorization", "Bearer " + serviceRoleKey)
                .defaultHeader("apikey", serviceRoleKey)
                .build();
    }

    @Override
    public String uploadFile(byte[] fileData, String fileName, String folder, String contentType) {
        // Tạo đường dẫn tệp: folder/uuid-filename
        String path = String.format("%s/%s-%s", folder, UUID.randomUUID(), fileName);
        
        log.info("Đang tải tệp lên Supabase Storage: {}/{}", bucketName, path);

        try {
            webClient.post()
                    .uri("/{bucket}/{path}", bucketName, path)
                    .contentType(MediaType.parseMediaType(contentType))
                    .bodyValue(fileData)
                    .retrieve()
                    .toBodilessEntity()
                    .block();

            // Trả về public URL
            // Định dạng: https://[project-id].supabase.co/storage/v1/object/public/[bucket]/[path]
            return String.format("%s/storage/v1/object/public/%s/%s", supabaseUrl, bucketName, path);
        } catch (Exception e) {
            log.error("Lỗi khi tải tệp lên Supabase Storage: {}", e.getMessage());
            throw new RuntimeException("Tải ảnh lên Supabase thất bại: " + e.getMessage());
        }
    }

    @Override
    public void deleteFile(String fileUrl) {
        if (fileUrl == null || !fileUrl.contains(bucketName)) return;

        // Trích xuất path từ URL
        String prefix = String.format("%s/storage/v1/object/public/%s/", supabaseUrl, bucketName);
        if (fileUrl.startsWith(prefix)) {
            String path = fileUrl.substring(prefix.length());
            log.info("Đang xóa tệp khỏi Supabase Storage: {}/{}", bucketName, path);
            
            try {
                webClient.delete()
                        .uri("/{bucket}/{path}", bucketName, path)
                        .retrieve()
                        .toBodilessEntity()
                        .block();
            } catch (Exception e) {
                log.warn("Không thể xóa tệp trên Supabase: {}", e.getMessage());
            }
        }
    }
}
