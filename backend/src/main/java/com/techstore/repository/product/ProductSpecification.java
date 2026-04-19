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
            BigDecimal maxPrice,
            boolean onlyActive
    ) {
        return (root, criteriaQuery, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // 1. Filter by Name and Description (Search) - Enhanced Security
            if (StringUtils.hasText(query)) {
                // Sanitize: remove potentially dangerous SQL characters
                String safeQuery = query.trim()
                        .replaceAll("['\";\\\\]", "")
                        .replaceAll("--", "")
                        .replaceAll("/\\*.*?\\*/", "");

                String pattern = "%" + safeQuery.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("name")), pattern),
                        cb.like(cb.lower(root.get("description")), pattern)
                ));
            }

            // 2. Filter by Category Slug
            if (StringUtils.hasText(categorySlug)) {
                predicates.add(cb.equal(
                        cb.lower(root.join("category").get("slug")), 
                        categorySlug.toLowerCase().trim()
                ));
            }

            // 3. Filter by Brand Slug
            if (StringUtils.hasText(brandSlug)) {
                predicates.add(cb.equal(
                        cb.lower(root.join("brand").get("slug")), 
                        brandSlug.toLowerCase().trim()
                ));
            }

            // 4. Filter by Price Range
            if (minPrice != null || maxPrice != null) {
                Join<Product, ProductVariant> variants = root.join("variants");
                if (minPrice != null) {
                    predicates.add(cb.greaterThanOrEqualTo(variants.get("price"), minPrice));
                }
                if (maxPrice != null) {
                    predicates.add(cb.lessThanOrEqualTo(variants.get("price"), maxPrice));
                }
                criteriaQuery.distinct(true); 
            }

            // 5. Visibility filters
            if (onlyActive) {
                predicates.add(cb.isTrue(root.get("active")));
                predicates.add(cb.isTrue(root.get("category").get("active")));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
