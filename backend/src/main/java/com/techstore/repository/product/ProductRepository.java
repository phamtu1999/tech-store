package com.techstore.repository.product;

import com.techstore.entity.product.Product;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    // Prevent N+1 Query Problem by using EntityGraph to JOIN FETCH category and brand
    @EntityGraph(attributePaths = {"category", "brand"})
    Page<Product> findAll(Pageable pageable);

    @EntityGraph(attributePaths = {"category", "brand", "variants", "images", "attributes"})
    Optional<Product> findBySlug(String slug);
    
    // Count products by category
    long countByCategoryId(Long categoryId);
}
