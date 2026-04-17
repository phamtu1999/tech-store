package com.techstore.repository.product;

import com.techstore.entity.product.ProductVariant;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {
    
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT v FROM ProductVariant v WHERE v.id = :id")
    Optional<ProductVariant> findByIdWithLock(Long id);

    Optional<ProductVariant> findBySku(String sku);
    
    List<ProductVariant> findByProductIdOrderBySortOrderAsc(Long productId);

    @Query("SELECT v FROM ProductVariant v JOIN FETCH v.product p WHERE v.stockQuantity <= 10")
    List<ProductVariant> findLowStockVariants();
}
