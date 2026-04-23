package com.techstore.service.auth;

import com.techstore.dto.auth.AuthRequest;
import com.techstore.dto.auth.AuthResponse;
import com.techstore.dto.auth.RegisterRequest;
import com.techstore.entity.auth.ActiveSession;
import com.techstore.entity.user.Role;
import com.techstore.entity.user.User;
import com.techstore.repository.user.UserRepository;
import com.techstore.security.JwtService;
import com.techstore.service.notification.NotificationService;
import com.techstore.entity.auth.LoginHistory.LoginStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.servlet.http.HttpServletRequest;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
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
    public AuthResponse register(RegisterRequest request, HttpServletRequest httpRequest) {
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
                "Chào mừng bạn",
                "Tài khoản của bạn đã sẵn sàng để mua sắm.",
                "GENERAL",
                null
        );

        ActiveSession session = createActiveSession(user, httpRequest.getRemoteAddr(), httpRequest.getHeader("User-Agent"));
        var jwtToken = jwtService.generateToken(Map.of(JwtService.SESSION_ID_CLAIM, session.getSessionId()), user);
        var refreshToken = jwtService.generateRefreshToken(user);
        return buildAuthResponse(user, jwtToken, refreshToken, session.getSessionId());
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
            
            // Reset failed attempts on successful login
            if (user.getFailedLoginAttempts() > 0 || user.getLockoutUntil() != null) {
                user.setFailedLoginAttempts(0);
                user.setLockoutUntil(null);
                userRepository.save(user);
            }

            ActiveSession session = createActiveSession(user, ipAddress, deviceInfo);
            var jwtToken = jwtService.generateToken(Map.of(JwtService.SESSION_ID_CLAIM, session.getSessionId()), user);
            var refreshToken = jwtService.generateRefreshToken(user);
            
            loginHistoryService.recordLoginAttempt(request.getEmail(), ipAddress, deviceInfo, LoginStatus.SUCCESS, null);

            return buildAuthResponse(user, jwtToken, refreshToken, session.getSessionId());
        } catch (Exception e) {
            // Handle failed login attempt
            userRepository.findByEmail(request.getEmail()).ifPresent(user -> {
                int attempts = user.getFailedLoginAttempts() + 1;
                user.setFailedLoginAttempts(attempts);
                
                var settings = securitySettingsService.getSecuritySettings();
                if (attempts >= settings.getMaxFailedLoginAttempts()) {
                    user.setLockoutUntil(LocalDateTime.now().plusMinutes(settings.getAccountLockoutMinutes()));
                    log.warn("Account locked for user: {} due to too many failed attempts", user.getEmail());
                }
                userRepository.save(user);
            });

            loginHistoryService.recordLoginAttempt(request.getEmail(), ipAddress, deviceInfo, LoginStatus.FAILURE, e.getMessage());
            throw e;
        }
    }

    public void forgotPassword(String email) {
        userRepository.findByEmail(email).ifPresent(user -> {
            String token = UUID.randomUUID().toString();
            passwordResetTokens.put(token, new PasswordResetToken(user.getEmail(), Instant.now().plusSeconds(3600)));
            // In a real app, send email here
            log.info("Password reset token generated for {}: {}", email, token);
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

    public AuthResponse refreshToken(String refreshToken, HttpServletRequest request) {
        final String userEmail = jwtService.extractUsername(refreshToken);
        if (userEmail != null) {
            var user = userRepository.findByEmail(userEmail)
                    .orElseThrow();
            if (jwtService.isTokenValid(refreshToken, user)) {
                // Keep the same session if possible, or create new one
                // For simplicity, we'll try to find an active session for this user
                String ipAddress = request.getRemoteAddr();
                String deviceInfo = request.getHeader("User-Agent");
                ActiveSession session = createActiveSession(user, ipAddress, deviceInfo);
                
                var accessToken = jwtService.generateToken(Map.of(JwtService.SESSION_ID_CLAIM, session.getSessionId()), user);
                return buildAuthResponse(user, accessToken, refreshToken, session.getSessionId());
            }
        }
        throw new RuntimeException("Refresh token is invalid");
    }

    private ActiveSession createActiveSession(User user, String ipAddress, String deviceInfo) {
        ActiveSession newSession = ActiveSession.builder()
                .sessionId(UUID.randomUUID().toString())
                .userId(user.getId())
                .username(user.getEmail())
                .ipAddress(ipAddress)
                .deviceInfo(deviceInfo)
                .loginTimestamp(LocalDateTime.now())
                .lastActivityTimestamp(LocalDateTime.now())
                .build();
        return sessionManagementService.saveSession(newSession);
    }

    private AuthResponse buildAuthResponse(User user, String jwtToken, String refreshToken, String sessionId) {
        return AuthResponse.builder()
                .token(jwtToken)
                .refreshToken(refreshToken)
                .sessionId(sessionId)
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .role(user.getRole())
                .build();
    }

    private record PasswordResetToken(String email, Instant expiresAt) {
    }
}
