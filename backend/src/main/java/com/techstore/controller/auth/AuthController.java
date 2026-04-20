package com.techstore.controller.auth;
import com.techstore.dto.auth.AuthRequest;
import com.techstore.dto.auth.AuthResponse;
import com.techstore.dto.auth.RegisterRequest;
import com.techstore.dto.auth.VerifyPasswordRequest;
import com.techstore.service.auth.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;
import com.techstore.security.LogAction;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @LogAction("USER_REGISTER")
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @LogAction("USER_LOGIN")
    @PostMapping("/authenticate")
    public ResponseEntity<AuthResponse> authenticate(@RequestBody AuthRequest request, HttpServletRequest httpRequest) {
        return ResponseEntity.ok(authService.authenticate(request, httpRequest));
    }
    @PostMapping("/password/forgot")
    public ResponseEntity<Map<String, String>> forgotPassword(@RequestBody Map<String, String> request) {
        authService.forgotPassword(request.get("email"));
        return ResponseEntity.ok(Map.of("message", "Password reset instructions sent"));
    }
    @PostMapping("/password/reset")
    public ResponseEntity<Map<String, String>> resetPassword(@RequestBody Map<String, String> request) {
        authService.resetPassword(request.get("token"), request.get("password"));
        return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
    }
    @PostMapping("/password/verify")
    public ResponseEntity<Map<String, Boolean>> verifyPassword(@RequestBody VerifyPasswordRequest request) {
        boolean isValid = authService.verifyPassword(request.getPassword());
        if (isValid) {
            return ResponseEntity.ok(Map.of("valid", true));
        } else {
            return ResponseEntity.status(401).body(Map.of("valid", false));
        }
    }
}
