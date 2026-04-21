package com.techstore.exception;

import com.techstore.entity.order.Coupon;
import com.techstore.entity.order.Order;
import com.techstore.entity.user.User;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Lỗi hệ thống không xác định", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "Lỗi từ khóa không hợp lệ", HttpStatus.BAD_REQUEST),
    USER_EXISTED(1002, "Người dùng đã tồn tại", HttpStatus.BAD_REQUEST),
    USERNAME_INVALID(1003, "Tên đăng nhập phải có ít nhất {min} ký tự", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(1004, "Mật khẩu phải có ít nhất {min} ký tự", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(1005, "Tài khoản không tồn tại", HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(1006, "Chưa xác thực người dùng", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1007, "Bạn không có quyền truy cập", HttpStatus.FORBIDDEN),
    INVALID_CREDENTIALS(1014, "Email hoặc mật khẩu không chính xác", HttpStatus.UNAUTHORIZED),
    INVALID_DOB(1008, "Your age must be at least {min}", HttpStatus.BAD_REQUEST),
    ENTITY_NOT_FOUND(1009, "Entity not found", HttpStatus.NOT_FOUND),
    INSUFFICIENT_STOCK(1010, "Insufficient stock quantity", HttpStatus.BAD_REQUEST),
    COUPON_INVALID(1011, "Coupon is invalid or expired", HttpStatus.BAD_REQUEST),
    ORDER_NOT_FOUND(1012, "Order not found", HttpStatus.NOT_FOUND),
    DUPLICATE_ORDER(1013, "Order already processed", HttpStatus.CONFLICT),
    ORDER_CANCELLATION_NOT_ALLOWED(1015, "Order cannot be cancelled in its current state", HttpStatus.BAD_REQUEST),
    CATEGORY_HAS_PRODUCTS(1016, "Cannot delete category with existing products", HttpStatus.BAD_REQUEST),
    CATEGORY_HAS_CHILDREN(1017, "Cannot delete category with child categories", HttpStatus.BAD_REQUEST),
    USER_HAS_ORDERS(1018, "Cannot delete user with existing orders. User has {count} orders.", HttpStatus.BAD_REQUEST),
    INVALID_STATUS_UPDATE(1019, "Trạng thái đơn hàng không hợp lệ cho hành động này", HttpStatus.BAD_REQUEST),
    COUPON_ALREADY_EXISTS(1020, "Mã giảm giá đã tồn tại", HttpStatus.BAD_REQUEST),
    COUPON_NOT_FOUND(1021, "Không tìm thấy mã giảm giá", HttpStatus.NOT_FOUND),
    TOO_MANY_REQUESTS(1022, "Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau.", HttpStatus.TOO_MANY_REQUESTS),
    ;

    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }
}
