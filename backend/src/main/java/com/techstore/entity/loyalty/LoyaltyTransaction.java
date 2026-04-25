package com.techstore.entity.loyalty;

import com.techstore.entity.base.BaseEntity;
import com.techstore.entity.user.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "loyalty_transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoyaltyTransaction extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private Integer points; // Positive for earned, negative for spent

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LoyaltySource source;

    @Column(length = 500)
    private String description;

    @Column(name = "order_id")
    private String orderId; // Optional link to an order
}
