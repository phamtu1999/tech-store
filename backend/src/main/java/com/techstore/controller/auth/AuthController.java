package com.techstore.controller.auth;

import com.techstore.dto.ApiResponse;
import com.techstore.dto.auth.AuthRequest;
import com.techstore.dto.auth.AuthResponse;
import com.techstore.dto.auth.RegisterRequest;
import com.techstore.dto.auth.VerifyPasswordRequest;
import com.techstore.security.LogAction;
import com.techstore.service.auth.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @LogAction("USER_REGISTER")
    @PostMapping("/register")
    public ApiResponse<AuthResponse> register(@RequestBody RegisterRequest request, HttpServletRequest httpRequest) {
        return ApiResponse.<AuthResponse>builder()
                .result(authService.register(request, httpRequest))
                .build();
    }

    @LogAction("USER_LOGIN")
    @PostMapping("/authenticate")
    public ApiResponse<AuthResponse> authenticate(@RequestBody AuthRequest request, HttpServletRequest httpRequest) {
        return ApiResponse.<AuthResponse>builder()
                .result(authService.authenticate(request, httpRequest))
                .build();
    }

    @PostMapping("/password/forgot")
    public ApiResponse<Map<String, String>> forgotPassword(@RequestBody Map<String, String> request) {
        authService.forgotPassword(request.get("email"));
        return ApiResponse.<Map<String, String>>builder()
                .message("Đã gửi hướng dẫn đặt lại mật khẩu")
                .result(Map.of("message", "Đã gửi hướng dẫn đặt lại mật khẩu"))
                .build();
    }

    @PostMapping("/password/reset")
    public ApiResponse<Map<String, String>> resetPassword(@RequestBody Map<String, String> request) {
        authService.resetPassword(request.get("token"), request.get("password"));
        return ApiResponse.<Map<String, String>>builder()
                .message("Đã đặt lại mật khẩu thành công")
                .result(Map.of("message", "Đã đặt lại mật khẩu thành công"))
                .build();
    }

    @PostMapping("/password/verify")
    public ApiResponse<Map<String, Boolean>> verifyPassword(@RequestBody VerifyPasswordRequest request) {
        boolean isValid = authService.verifyPassword(request.getPassword());
        return ApiResponse.<Map<String, Boolean>>builder()
                .message(isValid ? "Mật khẩu hợp lệ" : "Mật khẩu không hợp lệ")
                .result(Map.of("valid", isValid))
                .build();
    }
}
