package com.techstore.config;

import com.techstore.security.JwtAuthenticationFilter;
import com.techstore.security.LoginRateLimitingFilter;
import jakarta.servlet.http.HttpServletResponse;


import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.access.expression.method.DefaultMethodSecurityExpressionHandler;
import org.springframework.security.access.expression.method.MethodSecurityExpressionHandler;
import org.springframework.security.access.hierarchicalroles.RoleHierarchy;
import org.springframework.security.access.hierarchicalroles.RoleHierarchyImpl;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.http.HttpMethod;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final LoginRateLimitingFilter loginRateLimitingFilter;
    private final AuthenticationProvider authenticationProvider;

    @org.springframework.beans.factory.annotation.Value("${frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Bean
    public RoleHierarchy roleHierarchy() {
        RoleHierarchyImpl roleHierarchy = new RoleHierarchyImpl();
        String hierarchy = "ROLE_SUPER_ADMIN > ROLE_ADMIN \n" +
                          "ROLE_ADMIN > ROLE_MANAGER \n" +
                          "ROLE_MANAGER > ROLE_STAFF \n" +
                          "ROLE_STAFF > ROLE_CUSTOMER";
        roleHierarchy.setHierarchy(hierarchy);
        return roleHierarchy;
    }

    @Bean
    static MethodSecurityExpressionHandler methodSecurityExpressionHandler(RoleHierarchy roleHierarchy) {
        DefaultMethodSecurityExpressionHandler expressionHandler = new DefaultMethodSecurityExpressionHandler();
        expressionHandler.setRoleHierarchy(roleHierarchy);
        return expressionHandler;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .headers(headers -> headers
                .frameOptions(org.springframework.security.config.annotation.web.configurers.HeadersConfigurer.FrameOptionsConfig::deny)
                .xssProtection(xss -> xss.headerValue(org.springframework.security.web.header.writers.XXssProtectionHeaderWriter.HeaderValue.ENABLED_MODE_BLOCK))
                .contentSecurityPolicy(csp -> csp.policyDirectives("default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: blob:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' " + frontendUrl + " https://backend-production-86d7.up.railway.app; frame-ancestors 'none';"))
                .referrerPolicy(referrer -> referrer.policy(org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN))
                .permissionsPolicy(permissions -> permissions.policy("camera=(), microphone=(), geolocation=(), payment=()"))
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.GET,
                        "/api/v1/products",
                        "/api/v1/products/**",
                        "/api/v1/categories",
                        "/api/v1/categories/**",
                        "/api/v1/brands/**",
                        "/api/v1/settings/**",
                        "/api/v1/reviews/**",
                        "/api/v1/recommendations/**",
                        "/api/v1/livestreams/**",
                        "/api/v1/flash-sales/active",
                        "/api/v1/trending/**"
                ).permitAll()
                .requestMatchers("/api/v1/auth/**", "/api/v1/public/**", "/api/v1/chat/**").permitAll()
                .requestMatchers("/api/v1/payments/vnpay-ipn", "/api/v1/payments/vnpay/return").permitAll()
                .requestMatchers("/api/v1/admin/system-logs/**").hasRole("MANAGER")
                .requestMatchers("/api/v1/admin/**").hasRole("MANAGER")
                .anyRequest().authenticated()
            )
            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authenticationProvider(authenticationProvider)
            .exceptionHandling(exc -> exc
                .authenticationEntryPoint((request, response, authException) -> {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"code\": 401, \"message\": \"Unauthorized access\"}");
                })
                .accessDeniedHandler((request, response, accessDeniedException) -> {
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"code\": 403, \"message\": \"Forbidden access: You do not have permission\"}");
                })
            )
            .addFilterBefore(loginRateLimitingFilter, UsernamePasswordAuthenticationFilter.class)
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource() {
        org.springframework.web.cors.CorsConfiguration configuration = new org.springframework.web.cors.CorsConfiguration();
        
        configuration.setAllowedOrigins(java.util.List.of(
            frontendUrl, 
            "http://localhost:5173", 
            "https://frontend-production-a6e71.up.railway.app"
        ));
        configuration.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(java.util.List.of("Authorization", "Content-Type", "X-Requested-With", "Accept", "Origin"));
        configuration.setAllowCredentials(true);
        configuration.setExposedHeaders(java.util.List.of("Content-Disposition"));
        configuration.setMaxAge(3600L); // Cache preflight for 1 hour
        
        org.springframework.web.cors.UrlBasedCorsConfigurationSource source = new org.springframework.web.cors.UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
