package com.techstore.dto.chat;


import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BroadcastRequest {
    String title;
    String message;
    String type;
    String link;
}
