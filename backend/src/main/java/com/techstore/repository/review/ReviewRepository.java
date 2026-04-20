package com.techstore.repository.review;

import com.techstore.entity.review.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    Page<Review> findByProductIdOrderByCreatedAtDesc(Long productId, Pageable pageable);
    Page<Review> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    Optional<Review> findByUserIdAndProductId(Long userId, Long productId);
    boolean existsByUserIdAndProductId(Long userId, Long productId);

    long countByProductId(Long productId);
    
    // ✅ Batch query để tránh N+1 khi đếm số lượng Review cho danh sách sản phẩm
    @Query("SELECT r.product.id, COUNT(r) FROM Review r WHERE r.product.id IN :productIds GROUP BY r.product.id")
    List<Object[]> countByProductIdIn(@Param("productIds") List<Long> productIds);

    @Query("SELECT COALESCE(AVG(r.rating), 0) FROM Review r WHERE r.product.id = :productId")
    Double getAverageRatingByProductId(Long productId);
}
