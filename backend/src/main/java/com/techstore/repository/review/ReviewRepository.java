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
public interface ReviewRepository extends JpaRepository<Review, String> {
    Page<Review> findByProductIdOrderByCreatedAtDesc(String productId, Pageable pageable);
    Page<Review> findByUserIdOrderByCreatedAtDesc(String userId, Pageable pageable);
    Optional<Review> findByUserIdAndProductId(String userId, String productId);
    boolean existsByUserIdAndProductId(String userId, String productId);

    long countByProductId(String productId);
    
    // ✅ Batch query để tránh N+1 khi đếm số lượng Review cho danh sách sản phẩm
    @Query("SELECT r.product.id, COUNT(r) FROM Review r WHERE r.product.id IN :productIds GROUP BY r.product.id")
    List<Object[]> countByProductIdIn(@Param("productIds") List<String> productIds);

    @Query("SELECT COALESCE(AVG(r.rating), 0) FROM Review r WHERE r.product.id = :productId")
    Double getAverageRatingByProductId(String productId);
}
