package com.techstore.service.auth;

import com.techstore.dto.auth.AuthRequest;
import com.techstore.dto.auth.AuthResponse;
import com.techstore.dto.auth.RegisterRequest;
import com.techstore.entity.auth.ActiveSession;
import com.techstore.entity.auth.LoginHistory;
import com.techstore.entity.user.Role;
import com.techstore.entity.user.User;
import com.techstore.repository.user.UserRepository;
import com.techstore.security.JwtService;
import com.techstore.service.notification.NotificationService;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.servlet.http.HttpServletRequest;
import com.techstore.entity.auth.LoginHistory.LoginStatus;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final NotificationService notificationService;
    private final LoginHistoryService loginHistoryService;
    private final SessionManagementService sessionManagementService;
    private final SecuritySettingsService securitySettingsService;
    private final Map<String, PasswordResetToken> passwordResetTokens = new ConcurrentHashMap<>();

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Enforce password policy
        securitySettingsService.validatePasswordAgainstPolicy(request.getPassword());

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already taken");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(Role.ROLE_USER)
                .build();

        userRepository.save(user);
        notificationService.createNotification(
                user,
                "Chao mung ban",
                "Tai khoan cua ban da san sang de mua sam.",
                "GENERAL",
                null
        );

        var jwtToken = jwtService.generateToken(user);
        return AuthResponse.builder()
                .token(jwtToken)
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .role(user.getRole())
                .build();
    }

    public AuthResponse authenticate(AuthRequest request, HttpServletRequest httpRequest) {
        String ipAddress = httpRequest.getRemoteAddr();
        String deviceInfo = httpRequest.getHeader("User-Agent");
        
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
            
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow();
            var jwtToken = jwtService.generateToken(user);
            
            loginHistoryService.recordLoginAttempt(request.getEmail(), ipAddress, deviceInfo, LoginStatus.SUCCESS, null);
            
            // Create and save active session
            com.techstore.entity.auth.ActiveSession newSession = com.techstore.entity.auth.ActiveSession.builder()
                    .sessionId(java.util.UUID.randomUUID().toString())
                    .userId(user.getId())
                    .username(user.getEmail())
                    .ipAddress(ipAddress)
                    .deviceInfo(deviceInfo)
                    .loginTimestamp(java.time.LocalDateTime.now())
                    .lastActivityTimestamp(java.time.LocalDateTime.now())
                    .build();
            sessionManagementService.saveSession(newSession);
            
            return AuthResponse.builder()
                    .token(jwtToken)
                    .id(user.getId())
                    .email(user.getEmail())
                    .fullName(user.getFullName())
                    .role(user.getRole())
                    .build();
        } catch (Exception e) {
            loginHistoryService.recordLoginAttempt(request.getEmail(), ipAddress, deviceInfo, LoginStatus.FAILURE, e.getMessage());
            throw e;
        }
    }

    public void forgotPassword(String email) {
        userRepository.findByEmail(email).ifPresent(user -> {
            String token = UUID.randomUUID().toString();
            passwordResetTokens.put(token, new PasswordResetToken(user.getEmail(), Instant.now().plusSeconds(3600)));
        });
    }

    public void resetPassword(String token, String password) {
        // Enforce password policy
        securitySettingsService.validatePasswordAgainstPolicy(password);
        
        PasswordResetToken resetToken = passwordResetTokens.get(token);
        if (resetToken == null || resetToken.expiresAt().isBefore(Instant.now())) {
            throw new RuntimeException("Reset token is invalid or expired");
        }

        User user = userRepository.findByEmail(resetToken.email())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);
        passwordResetTokens.remove(token);
    }

    public boolean verifyPassword(String password) {
        String currentEmail = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(currentEmail)
                .map(user -> passwordEncoder.matches(password, user.getPassword()))
                .orElse(false);
    }

    private record PasswordResetToken(String email, Instant expiresAt) {
    }
}
