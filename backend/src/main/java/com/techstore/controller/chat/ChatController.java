package com.techstore.controller.chat;

import com.techstore.dto.ApiResponse;
import com.techstore.dto.chat.ChatRequest;
import com.techstore.entity.user.User;
import com.techstore.service.chat.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/api/v1/public/chat")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/send")
    public ResponseEntity<ApiResponse<String>> sendMessage(@RequestBody ChatRequest request) {
        // Fallback for old clients if needed, but we prefer stream
        return ResponseEntity.ok(ApiResponse.<String>builder()
                .message("Please use /stream for AI chat")
                .build());
    }

    @PostMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> streamMessage(
            @RequestBody ChatRequest request,
            @AuthenticationPrincipal User user) {
        return chatService.streamResponse(request, user)
                .map(chunk -> "data: " + chunk + "\n\n");
    }
}
