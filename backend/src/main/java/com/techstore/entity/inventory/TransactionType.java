package com.techstore.entity.inventory;


public enum TransactionType {
    IMPORT,         // Nhập kho
    EXPORT,         // Xuất bán
    RETURN,         // Trả hàng có thể bán (Back to stock)
    DAMAGED,        // Trả hàng lỗi / Hủy hàng (Write-off)
    ADJUSTMENT      // Điều chỉnh kho do kiểm kê
}
