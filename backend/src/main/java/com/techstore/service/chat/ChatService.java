package com.techstore.service.chat;

import com.techstore.dto.chat.ChatRequest;
import com.techstore.dto.chat.ChatResponse;
import com.techstore.dto.product.ProductResponse;
import com.techstore.entity.product.Product;
import com.techstore.repository.order.OrderRepository;
import com.techstore.repository.product.ProductRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    public ChatResponse processMessage(ChatRequest request) {
        String msg = request.getMessage().toLowerCase();
        
        // 1. Order Status Check
        if (msg.contains("đơn hàng") || msg.contains("kiểm tra đơn") || msg.contains("order")) {
            return handleOrderQuery(msg, request);
        }

        // 2. Product Recommendation
        if (msg.contains("tư vấn") || msg.contains("gợi ý") || msg.contains("mua") || msg.contains("sản phẩm")) {
            return handleProductRecommendation(msg);
        }

        // 3. Handover to Human
        if (msg.contains("nhân viên") || msg.contains("gặp người") || msg.contains("hỗ trợ trực tiếp")) {
            return ChatResponse.builder()
                    .reply("Tôi đã hiểu yêu cầu của bạn. Tôi đang chuyển kết nối tới một nhân viên chăm sóc khách hàng. Vui lòng đợi trong giây lát!")
                    .sessionId(request.getSessionId())
                    .requiresHuman(true)
                    .build();
        }

        // 4. Default AI-like fallback
        return ChatResponse.builder()
                .reply("Xin chào! Tôi là trợ lý AI của Tech Store. Tôi có thể giúp bạn kiểm tra trạng thái đơn hàng (#số-đơn), tư vấn sản phẩm công nghệ hoặc hỗ trợ bạn gặp nhân viên trực tiếp. Bạn muốn mình làm gì trước nhỉ?")
                .sessionId(request.getSessionId())
                .build();
    }

    private ChatResponse handleOrderQuery(String msg, ChatRequest request) {
        // Simple regex or keyword extraction to find order ID
        // For demo, we look for digits
        String digits = msg.replaceAll("\\D+", "");
        if (digits.isEmpty()) {
            return ChatResponse.builder()
                    .reply("Bạn vui lòng cung cấp mã số đơn hàng (Ví dụ: #123) để mình có thể kiểm tra trạng thái giúp bạn nhé!")
                    .sessionId(request.getSessionId())
                    .build();
        }

        try {
            Long orderId = Long.parseLong(digits);
            return orderRepository.findById(orderId)
                .map(order -> {
                    String statusLabel = getVietnameseStatus(order.getStatus().name());
                    return ChatResponse.builder()
                        .reply("Đơn hàng #" + orderId + " của bạn đang ở trạng thái: **" + statusLabel + "**. Tổng giá trị đơn hàng là " + order.getTotalAmount() + "đ.")
                        .sessionId(request.getSessionId())
                        .build();
                })
                .orElse(ChatResponse.builder()
                    .reply("Mình rất tiếc không tìm thấy đơn hàng mang mã #" + orderId + ". Bạn vui lòng kiểm tra lại số đơn nhé!")
                    .sessionId(request.getSessionId())
                    .build());
        } catch (NumberFormatException e) {
            return ChatResponse.builder()
                    .reply("Mã đơn hàng không hợp lệ. Vui lòng thử lại với định dạng số.")
                    .sessionId(request.getSessionId())
                    .build();
        }
    }

    private ChatResponse handleProductRecommendation(String msg) {
        // Search products by keywords from message
        String keyword = extractKeyword(msg);
        List<Product> products = productRepository.findAll((Specification<Product>) (root, query, cb) -> 
            cb.like(cb.lower(root.get("name")), "%" + keyword + "%"), PageRequest.of(0, 3)).getContent();

        if (products.isEmpty()) {
            return ChatResponse.builder()
                    .reply("Tech Store hiện có rất nhiều mẫu sản phẩm cao cấp mới nhất. Bạn quan tâm tới Laptop, Điện thoại hay Phụ kiện để mình tư vấn kỹ hơn nhé?")
                    .build();
        }

        String reply = "Dựa trên yêu cầu của bạn, mình xin gợi ý một số sản phẩm nổi bật:\n" +
                products.stream().map(p -> "- " + p.getName()).collect(Collectors.joining("\n"));

        return ChatResponse.builder()
                .reply(reply)
                .suggestedProducts(new ArrayList<ProductResponse>()) // Explicitly use ProductResponse
                .build();
    }

    private String extractKeyword(String msg) {
        if (msg.contains("iphone")) return "iphone";
        if (msg.contains("laptop")) return "laptop";
        if (msg.contains("samsung")) return "samsung";
        if (msg.contains("macbook")) return "macbook";
        return "";
    }

    private String getVietnameseStatus(String status) {
        switch (status) {
            case "PENDING": return "Đang chờ xử lý";
            case "CONFIRMED": return "Đã xác nhận";
            case "SHIPPING": return "Đang giao hàng";
            case "SHIPPED": return "Đã giao đến bưu cục";
            case "DELIVERED": return "Giao hàng thành công";
            case "REVIEWED": return "Đã đánh giá";
            case "CANCELLED": return "Đã hủy";
            default: return status;
        }
    }
}
