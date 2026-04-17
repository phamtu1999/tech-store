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
    public ResponseEntity<ApiResponse<ChatResponse>> sendMessage(@RequestBody ChatRequest request) {
        ChatResponse response = chatService.processMessage(request);
        return ResponseEntity.ok(ApiResponse.<ChatResponse>builder()
                .result(response)
                .build());
    }
}
