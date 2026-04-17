package com.techstore.dto.notification;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NotificationResponse {
    Long id;
    String type;
    String title;
    String message;
    boolean isRead;
    String link;
    LocalDateTime createdAt;
}
