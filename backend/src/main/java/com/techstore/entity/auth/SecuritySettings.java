package com.techstore.entity.auth;

import com.techstore.entity.base.BaseEntity;
import com.techstore.entity.user.User;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "security_settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SecuritySettings extends BaseEntity {

    // Two-Factor Authentication Settings
    @Column(name = "two_factor_enabled", nullable = false)
    @Builder.Default
    private Boolean twoFactorEnabled = false;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "allowed_two_factor_methods", columnDefinition = "JSON")
    private String allowedTwoFactorMethods;

    // Password Policy Settings
    @Column(name = "password_min_length", nullable = false)
    @Builder.Default
    private Integer passwordMinLength = 8;

    @Column(name = "require_special_char", nullable = false)
    @Builder.Default
    private Boolean requireSpecialChar = true;

    @Column(name = "require_uppercase", nullable = false)
    @Builder.Default
    private Boolean requireUppercase = true;

    @Column(name = "require_numeric", nullable = false)
    @Builder.Default
    private Boolean requireNumeric = true;

    @Column(name = "password_expiration_days", nullable = false)
    @Builder.Default
    private Integer passwordExpirationDays = 90;

    @Column(name = "max_failed_login_attempts", nullable = false)
    @Builder.Default
    private Integer maxFailedLoginAttempts = 5;

    @Column(name = "account_lockout_minutes", nullable = false)
    @Builder.Default
    private Integer accountLockoutMinutes = 30;

    // Token and Session Settings
    @Column(name = "access_token_lifetime_minutes", nullable = false)
    @Builder.Default
    private Integer accessTokenLifetimeMinutes = 15;

    @Column(name = "refresh_token_lifetime_days", nullable = false)
    @Builder.Default
    private Integer refreshTokenLifetimeDays = 7;

    @Column(name = "session_timeout_minutes", nullable = false)
    @Builder.Default
    private Integer sessionTimeoutMinutes = 30;

    @Column(name = "remember_me_enabled", nullable = false)
    @Builder.Default
    private Boolean rememberMeEnabled = false;

    @Column(name = "remember_me_lifetime_days", nullable = false)
    @Builder.Default
    private Integer rememberMeLifetimeDays = 30;

    // CORS and API Security Settings
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "cors_allowed_domains", columnDefinition = "JSON")
    private String corsAllowedDomains;

    @Column(name = "rate_limit_per_minute", nullable = false)
    @Builder.Default
    private Integer rateLimitPerMinute = 100;

    @Column(name = "api_key_auth_enabled", nullable = false)
    @Builder.Default
    private Boolean apiKeyAuthEnabled = false;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "ip_whitelist", columnDefinition = "JSON")
    private String ipWhitelist;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "ip_blacklist", columnDefinition = "JSON")
    private String ipBlacklist;

    // Audit Fields
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "last_modified_by")
    private User lastModifiedBy;
}
