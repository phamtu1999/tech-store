package com.techstore.service.storage;

public interface StorageService {
    /**
     * Tải tệp lên hệ thống lưu trữ.
     * @param fileData Dữ liệu tệp dưới dạng byte array
     * @param fileName Tên tệp mong muốn
     * @param folder Thư mục lưu trữ (ví dụ: products, avatars)
     * @param contentType Loại tệp (ví dụ: image/png)
     * @return URL công khai của tệp sau khi tải lên
     */
    String uploadFile(byte[] fileData, String fileName, String folder, String contentType);

    /**
     * Xóa tệp khỏi hệ thống lưu trữ.
     * @param fileUrl URL của tệp cần xóa
     */
    void deleteFile(String fileUrl);
}
