package com.techstore.repository.product;

import com.techstore.entity.brand.Brand;
import com.techstore.entity.category.Category;
import com.techstore.entity.product.Product;
import com.techstore.entity.product.ProductVariant;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class ProductSpecification {

    public static Specification<Product> filterProducts(
            String query,
            String categorySlug,
            String brandSlug,
            BigDecimal minPrice,
            BigDecimal maxPrice
    ) {
        return (root, criteriaQuery, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // 1. Filter by Name (Search)
            if (StringUtils.hasText(query)) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("name")),
                        "%" + query.toLowerCase() + "%"
                ));
            }

            // 2. Filter by Category Slug
            if (StringUtils.hasText(categorySlug)) {
                predicates.add(criteriaBuilder.equal(root.join("category").get("slug"), categorySlug));
            }

            // 3. Filter by Brand Slug
            if (StringUtils.hasText(brandSlug)) {
                predicates.add(criteriaBuilder.equal(root.join("brand").get("slug"), brandSlug));
            }

            // 4. Filter by Price Range (Need to join with ProductVariants)
            if (minPrice != null || maxPrice != null) {
                Join<Product, ProductVariant> variants = root.join("variants");
                if (minPrice != null) {
                    predicates.add(criteriaBuilder.greaterThanOrEqualTo(variants.get("price"), minPrice));
                }
                if (maxPrice != null) {
                    predicates.add(criteriaBuilder.lessThanOrEqualTo(variants.get("price"), maxPrice));
                }
                // Ensure unique products if joining
                criteriaQuery.distinct(true); 
            }

            // 5. Only active products
            // Note: We don't filter by category.active here because it would hide products from Admin Panel
            predicates.add(criteriaBuilder.isTrue(root.get("active")));

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
