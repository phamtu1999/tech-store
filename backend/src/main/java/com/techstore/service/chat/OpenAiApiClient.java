package com.techstore.service.chat;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.techstore.dto.chat.ChatMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class OpenAiApiClient {

    @Value("${openai.api-key:}")
    private String apiKey;

    @Value("${openai.model:gpt-3.5-turbo}")
    private String model;

    private final WebClient webClient;
    private final ObjectMapper objectMapper;
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(OpenAiApiClient.class);

    public OpenAiApiClient(WebClient.Builder builder,
            @Value("${openai.base-url:https://api.openai.com/v1}") String baseUrl,
            ObjectMapper objectMapper) {
        this.webClient = builder
                .baseUrl(baseUrl)
                .defaultHeader("Content-Type", "application/json")
                .build();
        this.objectMapper = objectMapper;
    }

    public Flux<String> streamChat(String systemPrompt,
            List<ChatMessage> history,
            String userMessage) {
        
        if (apiKey == null || apiKey.isBlank()) {
            return Flux.just("Lỗi: Chưa cấu hình OPENAI_API_KEY.");
        }

        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content", systemPrompt));
        
        for (ChatMessage msg : history) {
            messages.add(Map.of("role", msg.getRole(), "content", msg.getContent()));
        }
        
        messages.add(Map.of("role", "user", "content", userMessage));

        Map<String, Object> body = Map.of(
                "model", model,
                "messages", messages,
                "stream", true,
                "temperature", 0.7
        );

        log.info(">>> REQUESTING OPENAI CHAT: Model={}, URI=/chat/completions", model);

        return webClient.post()
                .uri("/chat/completions")
                .header("Authorization", "Bearer " + apiKey)
                .bodyValue(body)
                .retrieve()
                .bodyToFlux(String.class)
                .flatMap(chunk -> Flux.fromArray(chunk.split("\n")))
                .filter(line -> line.startsWith("data: "))
                .map(line -> line.substring(6).trim())
                .filter(data -> !data.equals("[DONE]") && !data.isEmpty())
                .mapNotNull(this::extractContent)
                .doOnError(e -> log.error("OpenAI Stream Error: {}", e.getMessage()));
    }

    private String extractContent(String json) {
        try {
            JsonNode root = objectMapper.readTree(json);
            return root.at("/choices/0/delta/content").asText("");
        } catch (Exception e) {
            return "";
        }
    }
}
