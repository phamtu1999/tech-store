package com.techstore.repository.loyalty;

import com.techstore.entity.loyalty.LoyaltyTransaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LoyaltyTransactionRepository extends JpaRepository<LoyaltyTransaction, String> {
    Page<LoyaltyTransaction> findByUserIdOrderByCreatedAtDesc(String userId, Pageable pageable);
    List<LoyaltyTransaction> findByOrderId(String orderId);
}
