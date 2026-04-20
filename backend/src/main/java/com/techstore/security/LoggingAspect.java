package com.techstore.security;

import com.techstore.service.settings.LoggerService;


import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Aspect
@Component
@Slf4j
@RequiredArgsConstructor
public class LoggingAspect {

    private final LoggerService loggerService;

    @Around("@annotation(logAction)")
    public Object logExecution(ProceedingJoinPoint joinPoint, LogAction logAction) throws Throwable {
        String actionName = logAction.value();
        String ipAddress = getClientIp();
        
        Object result;
        String username = "ANONYMOUS";

        try {
            // Lấy thông tin username BAN ĐẦU (nếu đã login)
            username = getCurrentUsername();

            result = joinPoint.proceed();

            // Lấy lại username SAU KHI THỰC THI
            // Quan trọng cho USER_LOGIN và USER_REGISTER vì lúc này user mới được auth
            String afterActionUsername = getCurrentUsername();
            
            // Nếu vẫn là anonymous nhưng là login/register, thử lấy từ payload hoặc result
            if ("ANONYMOUS".equals(afterActionUsername)) {
                afterActionUsername = extractUsernameFromArgsOrResult(joinPoint.getArgs(), result);
            }
            
            if (!"ANONYMOUS".equals(afterActionUsername)) {
                username = afterActionUsername;
            }

            // Ghi log thành công
            loggerService.log(actionName, "Action executed successfully: " + actionName, username, ipAddress, "SUCCESS");
            return result;
        } catch (Throwable throwable) {
            // Trường hợp lỗi, vẫn cố gắng lấy username từ đối số đầu vào (ví dụ AuthRequest)
            if ("ANONYMOUS".equals(username)) {
                username = extractUsernameFromArgsOrResult(joinPoint.getArgs(), null);
            }
            
            log.error("Action {} failed for user {}: ", actionName, username, throwable);
            loggerService.log(actionName, "Action failed: " + throwable.getMessage(), username, ipAddress, "FAILURE");
            throw throwable;
        }
    }

    private String getCurrentUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName())) {
            return auth.getName();
        }
        return "ANONYMOUS";
    }

    private String extractUsernameFromArgsOrResult(Object[] args, Object result) {
        // 1. Thử lấy từ kết quả trả về (AuthResponse)
        if (result instanceof org.springframework.http.ResponseEntity<?> responseEntity) {
            Object body = responseEntity.getBody();
            if (body != null) {
                try {
                    // Dùng reflection hoặc check type để lấy email/username
                    java.lang.reflect.Field emailField = body.getClass().getDeclaredField("email");
                    emailField.setAccessible(true);
                    return (String) emailField.get(body);
                } catch (Exception ignored) {}
            }
        }

        // 2. Thử lấy từ đối số (AuthRequest hoặc RegisterRequest)
        if (args != null) {
            for (Object arg : args) {
                if (arg != null) {
                    try {
                        java.lang.reflect.Field emailField = arg.getClass().getDeclaredField("email");
                        emailField.setAccessible(true);
                        return (String) emailField.get(arg);
                    } catch (Exception ignored) {}
                }
            }
        }
        return "ANONYMOUS";
    }

    private String getClientIp() {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes == null) return "unknown";

        HttpServletRequest request = attributes.getRequest();
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null || xfHeader.isEmpty()) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }
}
