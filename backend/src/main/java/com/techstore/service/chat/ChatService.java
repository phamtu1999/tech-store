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

    private final ProductRepository productRepository;
    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;

    private static final int MAX_HISTORY = 10;
    private static final String SESSION_PREFIX = "chat:session:";

    public Flux<String> streamResponse(ChatRequest request, User user) {
        String sessionId = request.getSessionId() != null ? request.getSessionId() : 
                          (user != null ? user.getId().toString() : "anonymous");
        String sessionKey = SESSION_PREFIX + sessionId;

        // 1. Get History (optional but kept for session context)
        // List<ChatMessage> history = getHistory(sessionKey);

        // 2. Classify intent and fetch context
        ChatIntent intent = classifyIntent(request.getMessage());
        String contextData = fetchContextData(intent, request.getMessage(), user);

        // 3. Generate Internal Response
        Flux<String> responseFlux = generateInternalResponse(intent, contextData, user);

        return responseFlux
                .filter(text -> text != null && !text.isBlank())
                .doOnComplete(() -> saveChatTurn(sessionKey, request.getMessage()))
                .onErrorResume(e -> {
                    log.error("Internal Chat error: ", e);
                    return Flux.just("Hệ thống đang bận một chút, bạn vui lòng quay lại sau nha!");
                });
    }

    private Flux<String> generateInternalResponse(ChatIntent intent, String contextData, User user) {
        StringBuilder response = new StringBuilder();
        String name = user != null ? user.getFullName() : "Quý khách";

        if (intent == ChatIntent.PRODUCT) {
            response.append(String.format("Chào %s! TechStore vừa tìm được các sản phẩm phù hợp với nhu cầu của bạn đây ạ:\n\n", name));
            response.append(contextData);
            response.append("\n\nBạn có muốn tìm hiểu thêm về sản phẩm nào khác không?");
        } else if (intent == ChatIntent.ORDER) {
            response.append(String.format("Chào %s! Về thông tin đơn hàng:\n", name));
            response.append(contextData);
        } else {
            response.append(String.format("Chào mừng %s đến với TechStore! Tôi là trợ lý ảo hỗ trợ tìm kiếm sản phẩm và giải đáp thông tin mua hàng.\n\n", name));
            response.append("Hiện tại bạn có thể hỏi tôi về:\n");
            response.append("- **Tìm sản phẩm**: (vd: 'Laptop văn phòng', 'Giá iPhone 15')\n");
            response.append("- **Đơn hàng**: (vd: 'Kiểm tra đơn hàng', 'Vận chuyển')\n\n");
            response.append("Để được hỗ trợ trực tiếp từ nhân viên, bạn vui lòng liên hệ Hotline: **1800-xxxx** nhé!");
        }

        // Simulate streaming for better UX
        return Flux.just(response.toString())
                .delayElements(Duration.ofMillis(50));
    }

    private String fetchContextData(ChatIntent intent, String message, User user) {
        if (intent == ChatIntent.PRODUCT) {
            String keyword = extractKeyword(message);
            if (keyword.isEmpty()) return "TechStore có rất nhiều mẫu laptop, điện thoại mới nhất. Bạn quan tâm thương hiệu nào ạ?";
            
            var products = productRepository.findByNameContainingIgnoreCase(keyword, PageRequest.of(0, 3));
            if (products.isEmpty()) return String.format("Hiện tại TechStore chưa có kết quả chính xác cho '%s'. Bạn có thể thử tìm kiếm với từ khóa khác nhé!", keyword);
            
            return products.getContent().stream()
                    .map((com.techstore.entity.product.Product p) -> String.format("- **%s** \n  Giá: %sđ \n  [Xem chi tiết](/product/%s)", 
                        p.getName(), 
                        p.getPrice() != null ? String.format("%,d", p.getPrice().longValue()) : "Liên hệ",
                        p.getId()))
                    .collect(Collectors.joining("\n\n"));
        }
        if (intent == ChatIntent.ORDER) {
            String baseMsg = "Bạn có thể xem lịch sử đơn hàng tại mục **Tài khoản > Đơn hàng**.\n";
            if (user != null) {
                return baseMsg + "Nếu bạn cần hỗ trợ về một đơn hàng cụ thể, vui lòng cung cấp mã đơn nhé.";
            }
            return baseMsg + "Vui lòng đăng nhập để kiểm tra trạng thái đơn hàng của bạn.";
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

    private void saveChatTurn(String sessionKey, String userMessage) {
        try {
            List<ChatMessage> history = getHistory(sessionKey);
            history.add(new ChatMessage("user", userMessage));
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
        if (lower.matches(".*(giá|mua|sản phẩm|laptop|điện thoại|tai nghe|tư vấn|so sánh|có bán|iphone|samsung|macbook|ipad|watch|oppo|xiaomi).*"))
            return ChatIntent.PRODUCT;
        if (lower.matches(".*(đơn hàng|vận chuyển|giao hàng|trạng thái|mã đơn|hủy đơn|thanh toán).*"))
            return ChatIntent.ORDER;
        return ChatIntent.GENERAL;
    }

    private String extractKeyword(String msg) {
        String lower = msg.toLowerCase();
        String[] keywords = {"iphone", "macbook", "samsung", "laptop", "watch", "ipad", "oppo", "xiaomi", "asus", "dell", "hp", "lenovo"};
        for (String k : keywords) {
            if (lower.contains(k)) return k;
        }
        String[] words = lower.split("\\s+");
        if (words.length > 0) {
            String last = words[words.length - 1];
            if (last.length() > 2) return last;
        }
        return "";
    }
}
