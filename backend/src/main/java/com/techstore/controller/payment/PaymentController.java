package com.techstore.controller.payment;

import com.techstore.dto.ApiResponse;
import com.techstore.dto.payment.PaymentResultResponse;
import com.techstore.entity.user.User;
import com.techstore.service.payment.PaymentService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @GetMapping("/vnpay/create-url/{orderId}")
    public ApiResponse<String> createVnPayUrl(
            @PathVariable Long orderId,
            HttpServletRequest request,
            @AuthenticationPrincipal User user
    ) {
        return ApiResponse.<String>builder()
                .result(paymentService.createVnPayPaymentUrl(orderId, request, user))
                .build();
    }

    @GetMapping("/vnpay-ipn")
    public String vnpayIpn(@RequestParam Map<String, String> allParams) {
        // VNPay IPN should return specific response format for the gateway
        try {
            paymentService.processVnPayIpn(allParams);
            return "{\"RspCode\":\"00\",\"Message\":\"Confirm Success\"}";
        } catch (Exception e) {
            return "{\"RspCode\":\"99\",\"Message\":\"Unknow error\"}";
        }
    }

    @GetMapping("/vnpay/return")
    public ApiResponse<PaymentResultResponse> vnpayReturn(@RequestParam Map<String, String> allParams) {
        return ApiResponse.<PaymentResultResponse>builder()
                .result(paymentService.processVnPayReturn(allParams))
                .build();
    }
}
