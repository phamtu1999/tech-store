package com.techstore.repository.inventory;

import com.techstore.entity.inventory.InventoryTransaction;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryTransactionRepository extends JpaRepository<InventoryTransaction, String> {
    
    // Find history of a specific variant ordered by latest
    List<InventoryTransaction> findByVariantIdOrderByCreatedAtDesc(String variantId);
    
    // Pagination support for heavy audit logs
    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"variant", "variant.product"})
    Page<InventoryTransaction> findByVariantId(String variantId, Pageable pageable);

    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"variant", "variant.product"})
    Page<InventoryTransaction> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
