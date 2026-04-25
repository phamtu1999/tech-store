package com.techstore.service.loyalty;

import com.techstore.dto.PageResponse;
import com.techstore.dto.loyalty.LoyaltyTransactionResponse;
import com.techstore.entity.loyalty.LoyaltySource;
import com.techstore.entity.loyalty.LoyaltyTransaction;
import com.techstore.entity.user.User;
import com.techstore.repository.loyalty.LoyaltyTransactionRepository;
import com.techstore.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class LoyaltyService {

    private final LoyaltyTransactionRepository transactionRepository;
    private final UserRepository userRepository;

    private static final int EARN_RATE = 100000; // 100k VND = 1 point
    private static final int SPEND_VALUE = 1000; // 1 point = 1k VND

    @Transactional
    public void earnPoints(User user, BigDecimal amount, String orderId) {
        int points = amount.divide(BigDecimal.valueOf(EARN_RATE), 0, java.math.RoundingMode.FLOOR).intValue();
        if (points > 0) {
            addPoints(user, points, LoyaltySource.ORDER_PLACEMENT, "Earned from order " + orderId, orderId);
        }
    }

    @Transactional
    public void spendPoints(User user, int points, String orderId) {
        if (user.getLoyaltyPoints() < points) {
            throw new RuntimeException("Insufficient loyalty points");
        }
        addPoints(user, -points, LoyaltySource.ORDER_REDEEM, "Spent for order " + orderId, orderId);
    }

    @Transactional
    public void refundPoints(User user, int points, String description, String orderId) {
        addPoints(user, points, LoyaltySource.REFUND, description, orderId);
    }

    private void addPoints(User user, int points, LoyaltySource source, String description, String orderId) {
        user.setLoyaltyPoints(user.getLoyaltyPoints() + points);
        userRepository.save(user);

        LoyaltyTransaction transaction = LoyaltyTransaction.builder()
                .user(user)
                .points(points)
                .source(source)
                .description(description)
                .orderId(orderId)
                .build();
        transactionRepository.save(transaction);
    }

    public PageResponse<LoyaltyTransactionResponse> getMyHistory(User user, Pageable pageable) {
        Page<LoyaltyTransaction> page = transactionRepository.findByUserIdOrderByCreatedAtDesc(user.getId(), pageable);
        return PageResponse.of(page.map(this::mapToResponse));
    }

    public int calculatePointsForAmount(BigDecimal amount) {
        return amount.divide(BigDecimal.valueOf(EARN_RATE), 0, java.math.RoundingMode.FLOOR).intValue();
    }

    public BigDecimal calculateDiscountForPoints(int points) {
        return BigDecimal.valueOf(points).multiply(BigDecimal.valueOf(SPEND_VALUE));
    }

    private LoyaltyTransactionResponse mapToResponse(LoyaltyTransaction t) {
        return LoyaltyTransactionResponse.builder()
                .id(t.getId())
                .points(t.getPoints())
                .source(t.getSource())
                .description(t.getDescription())
                .orderId(t.getOrderId())
                .createdAt(t.getCreatedAt())
                .build();
    }
}
