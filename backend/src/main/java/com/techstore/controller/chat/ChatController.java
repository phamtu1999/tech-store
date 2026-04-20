package com.techstore.controller.chat;

import com.techstore.dto.ApiResponse;
import com.techstore.dto.chat.ChatRequest;
import com.techstore.dto.chat.ChatResponse;
import com.techstore.service.chat.ChatService;


import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/public/chat")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/send")
    public ResponseEntity<ApiResponse<com.techstore.dto.chat.ChatResponse>> sendMessage(@RequestBody ChatRequest request) {
        // Fallback for old clients if needed, but we prefer stream
        return ResponseEntity.ok(ApiResponse.<com.techstore.dto.chat.ChatResponse>builder()
                .message("Please use /stream for AI chat")
                .build());
    }

    @PostMapping(value = "/stream", produces = org.springframework.http.MediaType.TEXT_EVENT_STREAM_VALUE)
    public reactor.core.publisher.Flux<String> streamMessage(
            @RequestBody ChatRequest request,
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.techstore.entity.user.User user
    ) {
        return chatService.streamResponse(request, user);
    }
}
