package com.techstore.dto.order;

import com.techstore.entity.order.OrderStatus;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderResponse {
    Long id;
    String orderNumber;
    String receiverName;
    String receiverPhone;
    String receiverEmail;
    String shippingAddress;
    BigDecimal subTotal;
    BigDecimal shippingFee;
    BigDecimal discountAmount;
    BigDecimal totalAmount;
    OrderStatus status;
    Boolean canCancel;
    String note;
    LocalDateTime createdAt;
    List<OrderItemResponse> items;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class OrderItemResponse {
        Long id;
        Long variantId;
        Long productId;
        String productName;
        String variantName;
        String variantSku;
        String imageUrl;
        BigDecimal priceAtPurchase;
        Integer quantity;
    }
}
