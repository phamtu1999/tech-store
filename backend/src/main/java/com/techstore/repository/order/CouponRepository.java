package com.techstore.repository.order;

import com.techstore.entity.order.Coupon;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, String> {
    Optional<Coupon> findByCodeAndActiveTrue(String code);
    
    Optional<Coupon> findByCodeIgnoreCase(String code);

    @Query("SELECT c FROM Coupon c WHERE LOWER(c.code) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Coupon> searchByCode(@Param("query") String query, Pageable pageable);
}
