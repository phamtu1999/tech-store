package com.techstore.service.notification;

import com.techstore.dto.notification.NotificationResponse;
import com.techstore.entity.notification.Notification;
import com.techstore.entity.user.User;
import com.techstore.exception.AppException;
import com.techstore.exception.ErrorCode;
import com.techstore.repository.notification.NotificationRepository;
import com.techstore.repository.user.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional(readOnly = true)
    public List<NotificationResponse> getNotifications(User user) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> getNotificationsPaginated(User user, int page, int size) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId(), PageRequest.of(page, size))
                .getContent()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> getUnreadNotifications(User user) {
        return notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(user.getId()).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(User user) {
        return notificationRepository.countByUserIdAndIsReadFalse(user.getId());
    }

    @Transactional
    public void markAsRead(User user, String notificationId) {
        Notification notification = notificationRepository.findByIdAndUserId(notificationId, user.getId())
                .orElseThrow(() -> new AppException(ErrorCode.ENTITY_NOT_FOUND));
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Transactional
    public void markAllAsRead(User user) {
        notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(user.getId())
                .forEach(notification -> notification.setRead(true));
    }

    @Transactional
    public void delete(User user, String notificationId) {
        Notification notification = notificationRepository.findByIdAndUserId(notificationId, user.getId())
                .orElseThrow(() -> new AppException(ErrorCode.ENTITY_NOT_FOUND));
        notificationRepository.delete(notification);
    }

    @Transactional
    public void clearAll(User user) {
        notificationRepository.deleteByUserId(user.getId());
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public void sendBroadcastNotification(String title, String message, String type, String link) {
        List<User> allUsers = userRepository.findAll();
        List<Notification> notifications = allUsers.stream()
                .map(user -> Notification.builder()
                        .user(user)
                        .title(type == null || type.isBlank() ? title : "[" + type + "] " + title)
                        .message(link == null ? message : message + "\n" + link)
                        .isRead(false)
                        .build())
                .toList();
        List<Notification> saved = notificationRepository.saveAll(notifications);
        
        // Push to each user
        saved.forEach(notif -> 
            messagingTemplate.convertAndSendToUser(
                notif.getUser().getEmail(), 
                "/queue/notifications", 
                mapToResponse(notif)
            )
        );
    }

    @Transactional
    public void createNotification(User user, String title, String message, String type, String link) {
        Notification notification = Notification.builder()
                .user(user)
                .title(type == null || type.isBlank() ? title : "[" + type + "] " + title)
                .message(link == null ? message : message + "\n" + link)
                .isRead(false)
                .build();
        Notification saved = notificationRepository.save(notification);
        
        // Push to WebSocket
        messagingTemplate.convertAndSendToUser(
            user.getEmail(), 
            "/queue/notifications", 
            mapToResponse(saved)
        );
    }

    private NotificationResponse mapToResponse(Notification notification) {
        String title = notification.getTitle();
        String type = "GENERAL";
        if (title != null && title.startsWith("[") && title.contains("]")) {
            int end = title.indexOf(']');
            type = title.substring(1, end);
            title = title.substring(end + 1).trim();
        }

        String message = notification.getMessage();
        String link = null;
        if (message != null && message.contains("\n")) {
            String[] parts = message.split("\n", 2);
            message = parts[0];
            link = parts[1];
        }

        return NotificationResponse.builder()
                .id(notification.getId())
                .type(type)
                .title(title)
                .message(message)
                .isRead(notification.isRead())
                .link(link)
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
