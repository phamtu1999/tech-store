package com.techstore.service.backup;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class CloudinaryAdapter {

    private final Cloudinary cloudinary;
    private static final String FOLDER = "techstore/backups";

    public Map<?, ?> upload(File file, String fileName) throws IOException {
        return cloudinary.uploader().upload(file, ObjectUtils.asMap(
                "resource_type", "raw",
                "folder", FOLDER,
                "public_id", fileName,
                "overwrite", true,
                "use_filename", false
        ));
    }

    public Map<?, ?> upload(byte[] bytes, String fileName) throws IOException {
        return cloudinary.uploader().upload(bytes, ObjectUtils.asMap(
                "resource_type", "raw",
                "folder", FOLDER,
                "public_id", fileName,
                "overwrite", true,
                "use_filename", false
        ));
    }

    public void delete(String publicId) throws IOException {
        if (publicId != null && !publicId.isBlank()) {
            cloudinary.uploader().destroy(publicId, ObjectUtils.asMap("resource_type", "raw"));
        }
    }
}
