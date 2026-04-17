package com.techstore.dto.auth;


import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SecuritySettingsRequest {

    // Two-Factor Authentication Settings
    @NotNull(message = "Two-factor authentication enabled flag is required")
    private Boolean twoFactorEnabled;

    private List<String> allowedTwoFactorMethods;

    // Password Policy Settings
    @NotNull(message = "Password minimum length is required")
    @Min(value = 8, message = "Password minimum length must be at least 8")
    @Max(value = 32, message = "Password minimum length must not exceed 32")
    private Integer passwordMinLength;

    @NotNull(message = "Require special character flag is required")
    private Boolean requireSpecialChar;

    @NotNull(message = "Require uppercase flag is required")
    private Boolean requireUppercase;

    @NotNull(message = "Require numeric flag is required")
    private Boolean requireNumeric;

    @NotNull(message = "Password expiration days is required")
    @Min(value = 0, message = "Password expiration days must be at least 0")
    @Max(value = 365, message = "Password expiration days must not exceed 365")
    private Integer passwordExpirationDays;

    @NotNull(message = "Max failed login attempts is required")
    @Min(value = 3, message = "Max failed login attempts must be at least 3")
    @Max(value = 10, message = "Max failed login attempts must not exceed 10")
    private Integer maxFailedLoginAttempts;

    @NotNull(message = "Account lockout minutes is required")
    @Min(value = 5, message = "Account lockout minutes must be at least 5")
    @Max(value = 1440, message = "Account lockout minutes must not exceed 1440")
    private Integer accountLockoutMinutes;

    // Token and Session Settings
    @NotNull(message = "Access token lifetime minutes is required")
    @Min(value = 5, message = "Access token lifetime must be at least 5 minutes")
    @Max(value = 120, message = "Access token lifetime must not exceed 120 minutes")
    private Integer accessTokenLifetimeMinutes;

    @NotNull(message = "Refresh token lifetime days is required")
    @Min(value = 1, message = "Refresh token lifetime must be at least 1 day")
    @Max(value = 90, message = "Refresh token lifetime must not exceed 90 days")
    private Integer refreshTokenLifetimeDays;

    @NotNull(message = "Session timeout minutes is required")
    @Min(value = 10, message = "Session timeout must be at least 10 minutes")
    @Max(value = 480, message = "Session timeout must not exceed 480 minutes")
    private Integer sessionTimeoutMinutes;

    @NotNull(message = "Remember me enabled flag is required")
    private Boolean rememberMeEnabled;

    @NotNull(message = "Remember me lifetime days is required")
    @Min(value = 7, message = "Remember me lifetime must be at least 7 days")
    @Max(value = 365, message = "Remember me lifetime must not exceed 365 days")
    private Integer rememberMeLifetimeDays;

    // CORS and API Security Settings
    private List<String> corsAllowedDomains;

    @NotNull(message = "Rate limit per minute is required")
    @Min(value = 10, message = "Rate limit must be at least 10 requests per minute")
    @Max(value = 1000, message = "Rate limit must not exceed 1000 requests per minute")
    private Integer rateLimitPerMinute;

    @NotNull(message = "API key authentication enabled flag is required")
    private Boolean apiKeyAuthEnabled;

    private List<String> ipWhitelist;

    private List<String> ipBlacklist;
}
