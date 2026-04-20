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
public class GeminiApiClient {

    @Value("${gemini.api-key}")
    private String apiKey;

    @Value("${gemini.model:gemini-2.0-flash}")
    private String model;

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    public GeminiApiClient(WebClient.Builder builder,
                           @Value("${gemini.base-url}") String baseUrl,
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
        Map<String, Object> body = buildRequestBody(systemPrompt, history, userMessage);

        return webClient.post()
                .uri("/models/{model}:streamGenerateContent?key={key}&alt=sse", model, apiKey)
                .bodyValue(body)
                .retrieve()
                .bodyToFlux(String.class)
                .filter(line -> line.startsWith("data: "))
                .map(line -> line.substring(6))
                .filter(data -> !data.equals("[DONE]"))
                .mapNotNull(this::extractStreamText);
    }

    private Map<String, Object> buildRequestBody(String systemPrompt,
                                                   List<ChatMessage> history,
                                                   String userMessage) {
        List<Map<String, Object>> contents = new ArrayList<>();

        for (ChatMessage msg : history) {
            contents.add(Map.of(
                "role", msg.getRole(),
                "parts", List.of(Map.of("text", msg.getContent()))
            ));
        }

        contents.add(Map.of(
            "role", "user",
            "parts", List.of(Map.of("text", userMessage))
        ));

        return Map.of(
            "system_instruction", Map.of(
                "parts", List.of(Map.of("text", systemPrompt))
            ),
            "contents", contents,
            "generationConfig", Map.of(
                "maxOutputTokens", 1024,
                "temperature", 0.7,
                "topP", 0.9
            )
        );
    }

    private String extractStreamText(String json) {
        try {
            JsonNode root = objectMapper.readTree(json);
            return root.at("/candidates/0/content/parts/0/text").asText("");
        } catch (Exception e) {
            return "";
        }
    }
}
