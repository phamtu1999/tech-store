package com.techstore.repository.product;

import com.techstore.entity.product.Product;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    @EntityGraph(attributePaths = {"category", "brand"})
    Page<Product> findAll(Pageable pageable);

    // ✅ Enable EntityGraph for Specification queries to prevent N+1 queries
    @EntityGraph(attributePaths = {"category", "brand", "variants", "images"})
    Page<Product> findAll(Specification<Product> spec, Pageable pageable);

    @EntityGraph(attributePaths = {"category", "brand", "variants", "images", "attributes"})
    Optional<Product> findBySlug(String slug);
    
    // Count products by category
    long countByCategoryId(Long categoryId);
}
