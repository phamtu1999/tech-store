package com.techstore.service.chat;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.techstore.dto.chat.ChatIntent;
import com.techstore.dto.chat.ChatMessage;
import com.techstore.dto.chat.ChatRequest;
import com.techstore.entity.user.User;
import com.techstore.repository.product.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatService {

    private final GeminiApiClient geminiClient;
    private final OpenAiApiClient openAiClient;
    private final ProductRepository productRepository;
    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;

    @Value("${chat.provider:openai}")
    private String chatProvider;

    private static final int MAX_HISTORY = 10;
    private static final String SESSION_PREFIX = "chat:session:";

    public Flux<String> streamResponse(ChatRequest request, User user) {
        String sessionId = request.getSessionId() != null ? request.getSessionId() : 
                          (user != null ? user.getId().toString() : "anonymous");
        String sessionKey = SESSION_PREFIX + sessionId;

        // 1. Get History
        List<ChatMessage> history = getHistory(sessionKey);

        // 2. Classify intent and fetch context
        ChatIntent intent = classifyIntent(request.getMessage());
        String contextData = fetchContextData(intent, request.getMessage());

        // 3. Build Prompt
        String systemPrompt = buildSystemPrompt(contextData, user);

        // 4. Call AI Provider
        Flux<String> aiResponse;
        if ("openai".equalsIgnoreCase(chatProvider)) {
            aiResponse = openAiClient.streamChat(systemPrompt, history, request.getMessage());
        } else {
            aiResponse = geminiClient.streamChat(systemPrompt, history, request.getMessage());
        }

        return aiResponse
                .filter(text -> text != null && !text.isBlank())
                .doOnComplete(() -> {
                    saveMessage(sessionKey, "user", request.getMessage());
                })
                .onErrorResume(e -> {
                    log.error("Gemini AI error: ", e);
                    return Flux.just("Hệ thống đang bận một chút, bạn vui lòng quay lại sau nha!");
                });
    }

    private String buildSystemPrompt(String contextData, User user) {
        return """
            Bạn là TECHSTORE AI - trợ lý tư vấn của TechStore Việt Nam.
            Giao diện bạn đang ở có màu Midnight (Xám đen sang trọng).
            Phong cách: thân thiện, ngắn gọn, chuyên nghiệp. Trả lời bằng tiếng Việt.
            Không được bịa thông tin sản phẩm hay giá cả.
            Nếu không biết, hãy nói: "Bạn vui lòng liên hệ hotline 1800-xxxx để được hỗ trợ nhé!"
            
            Khách hàng: %s
            Thông tin liên quan: %s
            """.formatted(
                user != null ? user.getFullName() : "Khách hàng",
                contextData
            );
    }

    private String fetchContextData(ChatIntent intent, String message) {
        if (intent == ChatIntent.PRODUCT) {
            String keyword = extractKeyword(message);
            if (keyword.isEmpty()) return "Chúng tôi có rất nhiều mẫu laptop, điện thoại mới nhất.";
            
            var products = productRepository.findByNameContainingIgnoreCase(keyword, PageRequest.of(0, 3));
            if (products.isEmpty()) return "Hiện không tìm thấy sản phẩm chính xác theo từ khóa này.";
            
            return "Danh sách sản phẩm gợi ý:\n" + 
                products.getContent().stream()
                    .map((com.techstore.entity.product.Product p) -> String.format("- %s (Giá: %sđ)", p.getName(), p.getPrice() != null ? p.getPrice().toString() : "Liên hệ"))
                    .collect(Collectors.joining("\n"));
        }
        if (intent == ChatIntent.ORDER) {
            return "Hướng dẫn user vào mục 'Đơn hàng' để xem chi tiết. Nếu cần hỗ trợ hủy đơn, liên hệ tổng đài.";
        }
        return "";
    }

    private List<ChatMessage> getHistory(String sessionKey) {
        try {
            String json = redisTemplate.opsForValue().get(sessionKey);
            if (json == null) return new ArrayList<>();
            return objectMapper.readValue(json, new TypeReference<List<ChatMessage>>() {});
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    private void saveMessage(String sessionKey, String role, String content) {
        try {
            List<ChatMessage> history = getHistory(sessionKey);
            history.add(new ChatMessage(role, content));
            if (history.size() > MAX_HISTORY) {
                history = history.subList(history.size() - MAX_HISTORY, history.size());
            }
            redisTemplate.opsForValue().set(sessionKey, objectMapper.writeValueAsString(history), Duration.ofHours(2));
        } catch (Exception e) {
            log.error("Failed to save chat history: ", e);
        }
    }

    private ChatIntent classifyIntent(String message) {
        String lower = message.toLowerCase();
        if (lower.matches(".*(giá|mua|sản phẩm|laptop|điện thoại|tai nghe|tư vấn|so sánh|có bán).*"))
            return ChatIntent.PRODUCT;
        if (lower.matches(".*(đơn hàng|vận chuyển|giao hàng|trạng thái|mã đơn|hủy đơn).*"))
            return ChatIntent.ORDER;
        return ChatIntent.GENERAL;
    }

    private String extractKeyword(String msg) {
        String lower = msg.toLowerCase();
        if (lower.contains("iphone")) return "iphone";
        if (lower.contains("macbook")) return "macbook";
        if (lower.contains("samsung")) return "samsung";
        if (lower.contains("laptop")) return "laptop";
        if (lower.contains("watch")) return "watch";
        return "";
    }
}
