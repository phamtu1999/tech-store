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

    @Value("${gemini.model:gemini-1.5-flash}")
    private String model;

    private final WebClient webClient;
    private final ObjectMapper objectMapper;
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(GeminiApiClient.class);

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

        String uri = "/v1beta/models/{model}:streamGenerateContent?key={key}&alt=sse";
        log.info("Requesting Gemini AI stream: {}", model);

        return webClient.post()
                .uri(uri, model, apiKey)
                .bodyValue(body)
                .retrieve()
                .bodyToFlux(String.class)
                .flatMap(chunk -> Flux.fromArray(chunk.split("\n"))) // Đảm bảo xử lý từng dòng nếu gộp chung
                .filter(line -> line != null && line.startsWith("data: "))
                .map(line -> line.substring(6).trim())
                .filter(data -> !data.isEmpty())
                .mapNotNull(this::extractStreamText)
                .doOnError(error -> log.error("Gemini Stream Error: {}", error.getMessage()))
                .doOnComplete(() -> log.debug("Gemini Stream Completed"));
    }

    private Map<String, Object> buildRequestBody(String systemPrompt,
            List<ChatMessage> history,
            String userMessage) {
        List<Map<String, Object>> contents = new ArrayList<>();

        for (ChatMessage msg : history) {
            contents.add(Map.of(
                    "role", msg.getRole(),
                    "parts", List.of(Map.of("text", msg.getContent()))));
        }

        contents.add(Map.of(
                "role", "user",
                "parts", List.of(Map.of("text", userMessage))));

        return Map.of(
                "system_instruction", Map.of(
                        "parts", List.of(Map.of("text", systemPrompt))),
                "contents", contents,
                "generationConfig", Map.of(
                        "maxOutputTokens", 1024,
                        "temperature", 0.7,
                        "topP", 0.9));
    }

    private String extractStreamText(String json) {
        try {
            if (apiKey == null || apiKey.isBlank()) {
                log.error("GEMINI_API_KEY is missing!");
                return "Lỗi: Chưa cấu hình API Key cho Gemini.";
            }

            log.debug("Parsing JSON: {}", json);
            JsonNode root = objectMapper.readTree(json);
            JsonNode candidate = root.at("/candidates/0");

            if (candidate.isMissingNode()) {
                log.warn("No candidates found in response");
                return "";
            }

            // Check for safety block
            String finishReason = candidate.at("/finishReason").asText("");
            if ("SAFETY".equals(finishReason)) {
                log.warn("Gemini response blocked by safety filters");
                return " [Tin nhắn bị chặn do vi phạm quy tắc an toàn] ";
            }

            JsonNode textNode = candidate.at("/content/parts/0/text");
            if (textNode.isMissingNode()) {
                log.warn("No text found in candidate");
                return "";
            }

            String text = textNode.asText("");
            log.debug("Extracted text: {}", text);
            return text;
        } catch (Exception e) {
            log.error("Failed to parse Gemini SSE chunk: {}", json, e);
            return "";
        }
    }
}
