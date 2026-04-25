package com.techstore.entity.loyalty;

public enum LoyaltySource {
    ORDER_PLACEMENT, // Earned from buying
    ORDER_REDEEM,    // Spent during checkout
    REFUND,          // Points returned or deducted
    ADMIN_ADJUSTMENT, // Manual adjustment
    REVIEW_REWARD    // Points for writing a review
}
