package com.techstore.repository.inventory;

import com.techstore.entity.inventory.InventoryTransaction;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryTransactionRepository extends JpaRepository<InventoryTransaction, Long> {
    
    // Find history of a specific variant ordered by latest
    List<InventoryTransaction> findByVariantIdOrderByCreatedAtDesc(Long variantId);
    
    // Pagination support for heavy audit logs
    Page<InventoryTransaction> findByVariantId(Long variantId, Pageable pageable);

    Page<InventoryTransaction> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
