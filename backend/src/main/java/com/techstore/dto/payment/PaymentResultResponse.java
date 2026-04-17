package com.techstore.dto.payment;

import lombok.Builder;
import lombok.Value;

import java.math.BigDecimal;

@Value
@Builder
public class PaymentResultResponse {
    boolean success;
    Long orderId;
    String transactionId;
    String paymentStatus;
    String orderStatus;
    String responseCode;
    String message;
    String bankCode;
    BigDecimal amount;
}
