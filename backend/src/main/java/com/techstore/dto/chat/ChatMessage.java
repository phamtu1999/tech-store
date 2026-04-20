package com.techstore.dto.chat;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessage {
    private String role;    // "user" or "model"
    private String content; // text content
}
