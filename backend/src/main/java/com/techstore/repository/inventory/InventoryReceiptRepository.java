package com.techstore.repository.inventory;

import com.techstore.entity.inventory.InventoryReceipt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InventoryReceiptRepository extends JpaRepository<InventoryReceipt, Long>, JpaSpecificationExecutor<InventoryReceipt> {
    Optional<InventoryReceipt> findByReceiptNumber(String receiptNumber);
}
