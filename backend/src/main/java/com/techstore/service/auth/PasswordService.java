package com.techstore.service.auth;

import com.techstore.entity.user.User;
import com.techstore.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class PasswordService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SecuritySettingsService securitySettingsService;
    
    // In-memory token store for simplicity. In production, use Redis or DB.
    private final Map<String, PasswordResetToken> passwordResetTokens = new ConcurrentHashMap<>();

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

    public record PasswordResetToken(String email, Instant expiresAt) {}
}
