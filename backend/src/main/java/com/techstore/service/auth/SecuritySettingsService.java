package com.techstore.service.auth;

import com.techstore.entity.auth.SecuritySettings;
import com.techstore.entity.user.User;
import com.techstore.repository.auth.SecuritySettingsRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class SecuritySettingsService {

    private final SecuritySettingsRepository securitySettingsRepository;

    // Validation constants
    private static final int MIN_PASSWORD_LENGTH = 8;
    private static final int MAX_PASSWORD_LENGTH = 32;
    private static final int MIN_PASSWORD_EXPIRATION_DAYS = 0;
    private static final int MAX_PASSWORD_EXPIRATION_DAYS = 365;
    private static final int MIN_FAILED_LOGIN_ATTEMPTS = 3;
    private static final int MAX_FAILED_LOGIN_ATTEMPTS = 10;
    private static final int MIN_LOCKOUT_MINUTES = 5;
    private static final int MAX_LOCKOUT_MINUTES = 1440;
    private static final int MIN_ACCESS_TOKEN_MINUTES = 5;
    private static final int MAX_ACCESS_TOKEN_MINUTES = 120;
    private static final int MIN_REFRESH_TOKEN_DAYS = 1;
    private static final int MAX_REFRESH_TOKEN_DAYS = 90;
    private static final int MIN_SESSION_TIMEOUT_MINUTES = 10;
    private static final int MAX_SESSION_TIMEOUT_MINUTES = 480;
    private static final int MIN_REMEMBER_ME_DAYS = 7;
    private static final int MAX_REMEMBER_ME_DAYS = 365;
    private static final int MIN_RATE_LIMIT = 10;
    private static final int MAX_RATE_LIMIT = 1000;

    // Regex patterns for validation
    private static final Pattern URL_PATTERN = Pattern.compile(
        "^https?://[a-zA-Z0-9.-]+(:[0-9]+)?(/.*)?$"
    );
    private static final Pattern IPV4_PATTERN = Pattern.compile(
        "^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(/([0-9]|[1-2][0-9]|3[0-2]))?$"
    );
    private static final Pattern IPV6_PATTERN = Pattern.compile(
        "^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))(/([0-9]|[1-9][0-9]|1[0-1][0-9]|12[0-8]))?$"
    );

    /**
     * Retrieves the current security settings configuration.
     * If no settings exist, creates and returns default settings.
     *
     * @return the current SecuritySettings entity
     */
    public SecuritySettings getSecuritySettings() {
        List<SecuritySettings> allSettings = securitySettingsRepository.findAll();
        if (allSettings.isEmpty()) {
            return createDefaultSettings();
        }
        return allSettings.get(0);
    }

    /**
     * Updates the security settings with validation.
     * Validates all numeric ranges, domain URLs, and IP addresses.
     *
     * @param settings the SecuritySettings entity with updated values
     * @param currentUser the user making the update (for audit trail)
     * @return the updated SecuritySettings entity
     * @throws IllegalArgumentException if validation fails
     */
    @Transactional
    public SecuritySettings updateSecuritySettings(SecuritySettings settings, User currentUser) {
        // Validate all fields
        validateSecuritySettings(settings);

        // Get existing settings or create new
        SecuritySettings existingSettings = getSecuritySettings();
        
        // Update all fields
        existingSettings.setTwoFactorEnabled(settings.getTwoFactorEnabled());
        existingSettings.setAllowedTwoFactorMethods(settings.getAllowedTwoFactorMethods());
        existingSettings.setPasswordMinLength(settings.getPasswordMinLength());
        existingSettings.setRequireSpecialChar(settings.getRequireSpecialChar());
        existingSettings.setRequireUppercase(settings.getRequireUppercase());
        existingSettings.setRequireNumeric(settings.getRequireNumeric());
        existingSettings.setPasswordExpirationDays(settings.getPasswordExpirationDays());
        existingSettings.setMaxFailedLoginAttempts(settings.getMaxFailedLoginAttempts());
        existingSettings.setAccountLockoutMinutes(settings.getAccountLockoutMinutes());
        existingSettings.setAccessTokenLifetimeMinutes(settings.getAccessTokenLifetimeMinutes());
        existingSettings.setRefreshTokenLifetimeDays(settings.getRefreshTokenLifetimeDays());
        existingSettings.setSessionTimeoutMinutes(settings.getSessionTimeoutMinutes());
        existingSettings.setRememberMeEnabled(settings.getRememberMeEnabled());
        existingSettings.setRememberMeLifetimeDays(settings.getRememberMeLifetimeDays());
        existingSettings.setCorsAllowedDomains(settings.getCorsAllowedDomains());
        existingSettings.setRateLimitPerMinute(settings.getRateLimitPerMinute());
        existingSettings.setApiKeyAuthEnabled(settings.getApiKeyAuthEnabled());
        existingSettings.setIpWhitelist(settings.getIpWhitelist());
        existingSettings.setIpBlacklist(settings.getIpBlacklist());
        existingSettings.setLastModifiedBy(currentUser);

        return securitySettingsRepository.save(existingSettings);
    }

    /**
     * Creates default security settings with secure default values.
     *
     * @return the newly created SecuritySettings entity
     */
    @Transactional
    public SecuritySettings createDefaultSettings() {
        SecuritySettings settings = SecuritySettings.builder()
                .twoFactorEnabled(false)
                .allowedTwoFactorMethods("[]")
                .passwordMinLength(8)
                .requireSpecialChar(true)
                .requireUppercase(true)
                .requireNumeric(true)
                .passwordExpirationDays(90)
                .maxFailedLoginAttempts(5)
                .accountLockoutMinutes(30)
                .accessTokenLifetimeMinutes(15)
                .refreshTokenLifetimeDays(7)
                .sessionTimeoutMinutes(30)
                .rememberMeEnabled(false)
                .rememberMeLifetimeDays(30)
                .corsAllowedDomains("[]")
                .rateLimitPerMinute(100)
                .apiKeyAuthEnabled(false)
                .ipWhitelist("[]")
                .ipBlacklist("[]")
                .build();
        return securitySettingsRepository.save(settings);
    }

    /**
     * Validates all security settings fields.
     *
     * @param settings the SecuritySettings to validate
     * @throws IllegalArgumentException if any validation fails
     */
    private void validateSecuritySettings(SecuritySettings settings) {
        // Validate password policy
        validateRange(settings.getPasswordMinLength(), MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH,
                "Password minimum length must be between " + MIN_PASSWORD_LENGTH + " and " + MAX_PASSWORD_LENGTH);
        
        validateRange(settings.getPasswordExpirationDays(), MIN_PASSWORD_EXPIRATION_DAYS, MAX_PASSWORD_EXPIRATION_DAYS,
                "Password expiration days must be between " + MIN_PASSWORD_EXPIRATION_DAYS + " and " + MAX_PASSWORD_EXPIRATION_DAYS);
        
        validateRange(settings.getMaxFailedLoginAttempts(), MIN_FAILED_LOGIN_ATTEMPTS, MAX_FAILED_LOGIN_ATTEMPTS,
                "Max failed login attempts must be between " + MIN_FAILED_LOGIN_ATTEMPTS + " and " + MAX_FAILED_LOGIN_ATTEMPTS);
        
        validateRange(settings.getAccountLockoutMinutes(), MIN_LOCKOUT_MINUTES, MAX_LOCKOUT_MINUTES,
                "Account lockout minutes must be between " + MIN_LOCKOUT_MINUTES + " and " + MAX_LOCKOUT_MINUTES);

        // Validate token and session settings
        validateRange(settings.getAccessTokenLifetimeMinutes(), MIN_ACCESS_TOKEN_MINUTES, MAX_ACCESS_TOKEN_MINUTES,
                "Access token lifetime must be between " + MIN_ACCESS_TOKEN_MINUTES + " and " + MAX_ACCESS_TOKEN_MINUTES + " minutes");
        
        validateRange(settings.getRefreshTokenLifetimeDays(), MIN_REFRESH_TOKEN_DAYS, MAX_REFRESH_TOKEN_DAYS,
                "Refresh token lifetime must be between " + MIN_REFRESH_TOKEN_DAYS + " and " + MAX_REFRESH_TOKEN_DAYS + " days");
        
        validateRange(settings.getSessionTimeoutMinutes(), MIN_SESSION_TIMEOUT_MINUTES, MAX_SESSION_TIMEOUT_MINUTES,
                "Session timeout must be between " + MIN_SESSION_TIMEOUT_MINUTES + " and " + MAX_SESSION_TIMEOUT_MINUTES + " minutes");
        
        validateRange(settings.getRememberMeLifetimeDays(), MIN_REMEMBER_ME_DAYS, MAX_REMEMBER_ME_DAYS,
                "Remember Me lifetime must be between " + MIN_REMEMBER_ME_DAYS + " and " + MAX_REMEMBER_ME_DAYS + " days");

        // Validate rate limit
        validateRange(settings.getRateLimitPerMinute(), MIN_RATE_LIMIT, MAX_RATE_LIMIT,
                "Rate limit must be between " + MIN_RATE_LIMIT + " and " + MAX_RATE_LIMIT + " requests per minute");

        // Validate CORS domains
        if (settings.getCorsAllowedDomains() != null && !settings.getCorsAllowedDomains().equals("[]")) {
            validateDomainUrls(settings.getCorsAllowedDomains());
        }

        // Validate IP whitelist
        if (settings.getIpWhitelist() != null && !settings.getIpWhitelist().equals("[]")) {
            validateIpAddresses(settings.getIpWhitelist(), "IP whitelist");
        }

        // Validate IP blacklist
        if (settings.getIpBlacklist() != null && !settings.getIpBlacklist().equals("[]")) {
            validateIpAddresses(settings.getIpBlacklist(), "IP blacklist");
        }
    }

    /**
     * Validates that a numeric value is within the specified range.
     *
     * @param value the value to validate
     * @param min the minimum allowed value (inclusive)
     * @param max the maximum allowed value (inclusive)
     * @param errorMessage the error message to throw if validation fails
     * @throws IllegalArgumentException if value is outside the range
     */
    private void validateRange(Integer value, int min, int max, String errorMessage) {
        if (value == null || value < min || value > max) {
            throw new IllegalArgumentException(errorMessage);
        }
    }

    /**
     * Validates domain URLs in JSON array format.
     *
     * @param domainsJson JSON array string containing domain URLs
     * @throws IllegalArgumentException if any domain URL is invalid
     */
    private void validateDomainUrls(String domainsJson) {
        try {
            // Remove brackets and quotes, split by comma
            String cleaned = domainsJson.replaceAll("[\\[\\]\"]", "").trim();
            if (cleaned.isEmpty()) {
                return;
            }
            
            String[] domains = cleaned.split(",");
            for (String domain : domains) {
                String trimmed = domain.trim();
                if (!trimmed.isEmpty() && !URL_PATTERN.matcher(trimmed).matches()) {
                    throw new IllegalArgumentException("Invalid domain URL format: " + trimmed + ". Must start with http:// or https://");
                }
            }
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid CORS domain format: " + e.getMessage());
        }
    }

    /**
     * Validates IP addresses (IPv4 and IPv6) in JSON array format.
     *
     * @param ipListJson JSON array string containing IP addresses
     * @param fieldName the name of the field being validated (for error messages)
     * @throws IllegalArgumentException if any IP address is invalid
     */
    private void validateIpAddresses(String ipListJson, String fieldName) {
        try {
            // Remove brackets and quotes, split by comma
            String cleaned = ipListJson.replaceAll("[\\[\\]\"]", "").trim();
            if (cleaned.isEmpty()) {
                return;
            }
            
            String[] ips = cleaned.split(",");
            for (String ip : ips) {
                String trimmed = ip.trim();
                if (!trimmed.isEmpty() && !isValidIpAddress(trimmed)) {
                    throw new IllegalArgumentException("Invalid IP address format in " + fieldName + ": " + trimmed);
                }
            }
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid " + fieldName + " format: " + e.getMessage());
        }
    }

    /**
     * Validates a password against the current security policy.
     * 
     * @param password the password to validate
     * @throws IllegalArgumentException if the password does not meet the requirements
     */
    public void validatePasswordAgainstPolicy(String password) {
        SecuritySettings settings = getSecuritySettings();
        
        // Check minimum length
        if (password == null || password.length() < settings.getPasswordMinLength()) {
            throw new IllegalArgumentException("Mật khẩu phải có ít nhất " + settings.getPasswordMinLength() + " ký tự");
        }

        StringBuilder regex = new StringBuilder("^");
        List<String> requirements = new java.util.ArrayList<>();

        // Uppercase requirement
        if (settings.getRequireUppercase()) {
            regex.append("(?=.*[A-Z])");
            requirements.add("chữ in hoa");
        }

        // Numeric requirement
        if (settings.getRequireNumeric()) {
            regex.append("(?=.*[0-9])");
            requirements.add("chữ số");
        }

        // Special character requirement
        if (settings.getRequireSpecialChar()) {
            regex.append("(?=.*[@#$%^&+=!])");
            requirements.add("ký tự đặc biệt (@#$%^&+=!)");
        }

        // Finalize regex
        regex.append(".*$");

        if (!Pattern.compile(regex.toString()).matcher(password).matches()) {
            String msg = "Mật khẩu không đạt yêu cầu bảo mật. Cần thêm: " + String.join(", ", requirements);
            throw new IllegalArgumentException(msg);
        }
    }

    /**
     * Checks if a string is a valid IPv4 or IPv6 address (with optional CIDR notation).
     *
     * @param ip the IP address string to validate
     * @return true if valid, false otherwise
     */
    private boolean isValidIpAddress(String ip) {
        return IPV4_PATTERN.matcher(ip).matches() || IPV6_PATTERN.matcher(ip).matches();
    }
}
