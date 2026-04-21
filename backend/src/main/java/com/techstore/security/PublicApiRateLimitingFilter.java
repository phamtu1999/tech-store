package com.techstore.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class PublicApiRateLimitingFilter extends OncePerRequestFilter {

    private final RateLimiterService rateLimiterService;

    // Path -> Max Attempts per minute
    private static final Map<String, Integer> RATE_LIMIT_PATHS = Map.of(
        "/api/v1/auth/authenticate", 10,
        "/api/v1/auth/register", 5,
        "/api/v1/auth/password/forgot", 5,
        "/api/v1/products", 60, // Public search/listing
        "/api/v1/reviews", 30    // Public reviews
    );

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getServletPath();
        String method = request.getMethod();

        // Find matching path (exact or prefix for some cases)
        String matchedPath = findMatchedPath(path);

        if (matchedPath != null) {
            String clientIp = getClientIp(request);
            int limit = RATE_LIMIT_PATHS.get(matchedPath);
            
            // Key based on IP and matched path to allow different limits for different endpoints
            String key = clientIp + ":" + matchedPath;
            
            if (rateLimiterService.isAllowed(key, limit)) {
                filterChain.doFilter(request, response);
            } else {
                response.setStatus(429);
                response.setContentType("application/json;charset=UTF-8");
                response.getWriter().write("{\"code\": 429, \"message\": \"Too many requests. Please try again after 1 minute.\"}");
            }
        } else {
            filterChain.doFilter(request, response);
        }
    }

    private String findMatchedPath(String path) {
        if (RATE_LIMIT_PATHS.containsKey(path)) {
            return path;
        }
        // Check for common public prefixes
        for (String limitPath : RATE_LIMIT_PATHS.keySet()) {
            if (path.startsWith(limitPath)) {
                return limitPath;
            }
        }
        return null;
    }

    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader != null && !xfHeader.isBlank()) {
            String[] ips = xfHeader.split(",");
            return ips[ips.length - 1].trim();
        }
        return request.getRemoteAddr();
    }
}
