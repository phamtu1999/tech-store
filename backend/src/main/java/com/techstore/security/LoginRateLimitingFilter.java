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

    private static final java.util.Map<String, Integer> RATE_LIMIT_PATHS = java.util.Map.of(
        "/api/v1/auth/login", 5,
        "/api/v1/auth/register", 3,
        "/api/v1/auth/forgot-password", 3
    );

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getServletPath();
        String method = request.getMethod();

        if (RATE_LIMIT_PATHS.containsKey(path) && "POST".equalsIgnoreCase(method)) {
            String clientIp = getClientIp(request);
            int limit = RATE_LIMIT_PATHS.get(path);
            
            if (rateLimiterService.isAllowed(clientIp + ":" + path, limit)) {
                filterChain.doFilter(request, response);
            } else {
                response.setStatus(429);
                response.setContentType("application/json;charset=UTF-8");
                response.getWriter().write("{\"code\": 429, \"message\": \"Too many attempts. Please try again after 1 minute.\"}");
            }
        } else {
            filterChain.doFilter(request, response);
        }
    }

    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader != null && !xfHeader.isBlank()) {
            // Lấy IP cuối cùng (do Railway thêm vào) — đáng tin hơn IP đầu tiên
            String[] ips = xfHeader.split(",");
            return ips[ips.length - 1].trim();
        }
        return request.getRemoteAddr();
    }
}
