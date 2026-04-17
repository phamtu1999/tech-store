package com.techstore.controller.notification;

import com.techstore.dto.ApiResponse;
import com.techstore.dto.notification.NotificationResponse;
import com.techstore.entity.user.User;
import com.techstore.service.notification.NotificationService;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ApiResponse<List<NotificationResponse>> getNotifications(@AuthenticationPrincipal User user) {
        return ApiResponse.<List<NotificationResponse>>builder()
                .result(notificationService.getNotifications(user))
                .build();
    }

    @GetMapping("/paginated")
    public ApiResponse<List<NotificationResponse>> getNotificationsPaginated(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ApiResponse.<List<NotificationResponse>>builder()
                .result(notificationService.getNotificationsPaginated(user, page, size))
                .build();
    }

    @GetMapping("/unread")
    public ApiResponse<List<NotificationResponse>> getUnreadNotifications(@AuthenticationPrincipal User user) {
        return ApiResponse.<List<NotificationResponse>>builder()
                .result(notificationService.getUnreadNotifications(user))
                .build();
    }

    @GetMapping("/unread-count")
    public ApiResponse<Long> getUnreadCount(@AuthenticationPrincipal User user) {
        return ApiResponse.<Long>builder()
                .result(notificationService.getUnreadCount(user))
                .build();
    }

    @PostMapping("/{notificationId}/read")
    public ApiResponse<Void> markAsRead(@AuthenticationPrincipal User user, @PathVariable Long notificationId) {
        notificationService.markAsRead(user, notificationId);
        return ApiResponse.<Void>builder()
                .message("Notification marked as read")
                .build();
    }

    @PostMapping("/read-all")
    public ApiResponse<Void> markAllAsRead(@AuthenticationPrincipal User user) {
        notificationService.markAllAsRead(user);
        return ApiResponse.<Void>builder()
                .message("All notifications marked as read")
                .build();
    }

    @DeleteMapping("/{notificationId}")
    public ApiResponse<Void> delete(@AuthenticationPrincipal User user, @PathVariable Long notificationId) {
        notificationService.delete(user, notificationId);
        return ApiResponse.<Void>builder()
                .message("Notification deleted")
                .build();
    }

    @DeleteMapping
    public ApiResponse<Void> clearAll(@AuthenticationPrincipal User user) {
        notificationService.clearAll(user);
        return ApiResponse.<Void>builder()
                .message("Notifications cleared")
                .build();
    }

    @PostMapping("/broadcast")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> broadcastNotification(@RequestBody com.techstore.dto.chat.BroadcastRequest request) {
        notificationService.sendBroadcastNotification(
                request.getTitle(),
                request.getMessage(),
                request.getType(),
                request.getLink()
        );
        return ApiResponse.<Void>builder()
                .message("Broadcast notification sent successfully")
                .build();
    }
}
