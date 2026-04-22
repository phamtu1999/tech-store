package com.techstore.repository.product;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;

public interface ProductListingRepository {

    Page<ProductListingRow> findPublicProductListing(
            String query,
            String categorySlug,
            String brandSlug,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Pageable pageable
    );
}
