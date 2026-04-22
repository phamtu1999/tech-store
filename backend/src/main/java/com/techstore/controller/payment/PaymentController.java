package com.techstore.controller.payment;

import com.techstore.dto.ApiResponse;
import com.techstore.dto.payment.PaymentResultResponse;
import com.techstore.entity.user.User;
import com.techstore.exception.AppException;
import com.techstore.exception.ErrorCode;
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
            @PathVariable String orderId,
            HttpServletRequest request,
            @AuthenticationPrincipal User user
    ) {
        return ApiResponse.<String>builder()
                .result(paymentService.createVnPayPaymentUrl(orderId, request, user))
                .build();
    }

    @GetMapping("/vnpay-ipn")
    public String vnpayIpn(@RequestParam Map<String, String> allParams) {
        try {
            paymentService.processVnPayIpn(allParams);
            return "{\"RspCode\":\"00\",\"Message\":\"Confirm Success\"}";
        } catch (AppException e) {
            ErrorCode code = e.getErrorCode();
            if (code == ErrorCode.ENTITY_NOT_FOUND || code == ErrorCode.ORDER_NOT_FOUND) {
                return "{\"RspCode\":\"01\",\"Message\":\"Order not found\"}";
            } else if (code == ErrorCode.PAYMENT_ALREADY_CONFIRMED) {
                return "{\"RspCode\":\"02\",\"Message\":\"Order already confirmed\"}";
            } else if (code == ErrorCode.INVALID_PAYMENT_AMOUNT) {
                return "{\"RspCode\":\"04\",\"Message\":\"Invalid amount\"}";
            } else if (code == ErrorCode.UNAUTHORIZED) {
                return "{\"RspCode\":\"97\",\"Message\":\"Invalid checksum\"}";
            }
            return "{\"RspCode\":\"99\",\"Message\":\"" + e.getMessage() + "\"}";
        } catch (Exception e) {
            return "{\"RspCode\":\"99\",\"Message\":\"Unknown error\"}";
        }
    }

    @GetMapping("/vnpay/return")
    public ApiResponse<PaymentResultResponse> vnpayReturn(@RequestParam Map<String, String> allParams) {
        return ApiResponse.<PaymentResultResponse>builder()
                .result(paymentService.processVnPayReturn(allParams))
                .build();
    }
}
