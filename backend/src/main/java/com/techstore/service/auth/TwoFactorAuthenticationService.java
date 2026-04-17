package com.techstore.service.auth;

import com.techstore.entity.auth.SecuritySettings;
import com.techstore.entity.user.User;
import com.techstore.repository.user.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TwoFactorAuthenticationService {

    private final UserRepository userRepository;
    private final SecuritySettingsService securitySettingsService;

    // Valid 2FA methods
    private static final List<String> VALID_2FA_METHODS = Arrays.asList("SMS", "EMAIL", "AUTHENTICATOR_APP");

    /**
     * Retrieves all users who have enrolled in 2FA.
     * Returns users where twoFactorEnabled is true.
     *
     * @return list of users with 2FA enabled
     */
    public List<User> get2FAEnrolledUsers() {
        return userRepository.findAll().stream()
                .filter(user -> user.getTwoFactorEnabled() != null && user.getTwoFactorEnabled())
                .collect(Collectors.toList());
    }

    /**
     * Updates system-wide 2FA settings.
     * Validates that at least one 2FA method is selected when 2FA is enabled.
     *
     * @param settings the SecuritySettings entity with updated 2FA configuration
     * @param currentUser the user making the update (for audit trail)
     * @return the updated SecuritySettings entity
     * @throws IllegalArgumentException if validation fails
     */
    @Transactional
    public SecuritySettings update2FASettings(SecuritySettings settings, User currentUser) {
        // Validate 2FA configuration
        validate2FASettings(settings);

        // Update settings through SecuritySettingsService
        return securitySettingsService.updateSecuritySettings(settings, currentUser);
    }

    /**
     * Validates 2FA settings.
     * Ensures that when 2FA is enabled, at least one valid method is selected.
     *
     * @param settings the SecuritySettings to validate
     * @throws IllegalArgumentException if validation fails
     */
    private void validate2FASettings(SecuritySettings settings) {
        if (settings.getTwoFactorEnabled() != null && settings.getTwoFactorEnabled()) {
            String allowedMethods = settings.getAllowedTwoFactorMethods();
            
            // Check if allowedTwoFactorMethods is null or empty
            if (allowedMethods == null || allowedMethods.trim().isEmpty() || 
                allowedMethods.equals("[]") || allowedMethods.equals("")) {
                throw new IllegalArgumentException("At least one 2FA method must be selected when 2FA is enabled");
            }

            // Parse and validate methods
            List<String> methods = parseMethodsFromJson(allowedMethods);
            if (methods.isEmpty()) {
                throw new IllegalArgumentException("At least one 2FA method must be selected when 2FA is enabled");
            }

            // Validate each method is valid
            for (String method : methods) {
                if (!VALID_2FA_METHODS.contains(method)) {
                    throw new IllegalArgumentException("Invalid 2FA method: " + method + 
                        ". Valid methods are: " + String.join(", ", VALID_2FA_METHODS));
                }
            }
        }
    }

    /**
     * Parses 2FA methods from JSON array string.
     * Handles formats like: ["SMS","EMAIL"] or ["SMS", "EMAIL"]
     *
     * @param methodsJson JSON array string containing 2FA methods
     * @return list of method strings
     */
    private List<String> parseMethodsFromJson(String methodsJson) {
        if (methodsJson == null || methodsJson.trim().isEmpty()) {
            return List.of();
        }

        // Remove brackets and quotes, split by comma
        String cleaned = methodsJson.replaceAll("[\\[\\]\"]", "").trim();
        if (cleaned.isEmpty()) {
            return List.of();
        }

        return Arrays.stream(cleaned.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
    }
}
