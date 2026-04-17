package com.techstore.security;

import com.techstore.service.settings.LoggerService;


import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
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
@RequiredArgsConstructor
public class LoggingAspect {

    private final LoggerService loggerService;

    @Around("@annotation(logAction)")
    public Object logExecution(ProceedingJoinPoint joinPoint, LogAction logAction) throws Throwable {
        String actionName = logAction.value();
        String username = "ANONYMOUS";
        String ipAddress = "unknown";

        // Lấy thông tin người dùng từ Security Context
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated()) {
            username = auth.getName();
        }

        // Lấy địa chỉ IP
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes != null) {
            HttpServletRequest request = attributes.getRequest();
            ipAddress = request.getRemoteAddr();
        }

        Object result;
        try {
            result = joinPoint.proceed();
            // Ghi log thành công
            loggerService.log(actionName, "Action executed successfully: " + actionName, username, ipAddress, "SUCCESS");
            return result;
        } catch (Throwable throwable) {
            // Ghi log thất bại
            loggerService.log(actionName, "Action failed: " + throwable.getMessage(), username, ipAddress, "FAILURE");
            throw throwable;
        }
    }
}
