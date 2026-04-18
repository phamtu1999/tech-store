package com.techstore.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class LoginRateLimitingFilter extends OncePerRequestFilter {

    private final RateLimiterService rateLimiterService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getServletPath();
        String method = request.getMethod();

        // Only apply to login endpoint
        if ("/api/v1/auth/login".equals(path) && "POST".equalsIgnoreCase(method)) {
            String clientIp = getClientIp(request);
            if (rateLimiterService.resolveBucket(clientIp).tryConsume(1)) {
                filterChain.doFilter(request, response);
            } else {
                response.setStatus(429); // Too Many Requests
                response.setContentType("application/json");
                response.getWriter().write("{\"code\": 429, \"message\": \"Too many login attempts. Please try again after 1 minute.\"}");
            }
        } else {
            filterChain.doFilter(request, response);
        }
    }

    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }
}
