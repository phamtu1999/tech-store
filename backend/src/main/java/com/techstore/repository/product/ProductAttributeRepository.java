package com.techstore.repository.product;

import com.techstore.entity.product.Product;
import com.techstore.entity.product.ProductAttribute;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductAttributeRepository extends JpaRepository<ProductAttribute, Long> {
    List<ProductAttribute> findByProductId(Long productId);
    void deleteAllByProduct(Product product);
}
