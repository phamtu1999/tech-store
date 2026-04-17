package com.techstore.controller.settings;

import com.techstore.dto.ApiResponse;
import com.techstore.service.settings.UploadService;


import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/files")
@RequiredArgsConstructor
public class FileController {

    private final UploadService uploadService;

    @PostMapping("/upload")
    public ApiResponse<String> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", defaultValue = "general") String folder
    ) {
        String url = uploadService.uploadFile(file, folder);
        return ApiResponse.<String>builder()
                .result(url)
                .build();
    }
}
