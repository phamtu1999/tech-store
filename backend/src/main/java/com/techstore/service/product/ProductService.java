package com.techstore.service.product;

import com.techstore.dto.PageResponse;
import com.techstore.dto.brand.BrandResponse;
import com.techstore.dto.category.CategoryResponse;
import com.techstore.dto.product.ProductAttributeResponse;
import com.techstore.dto.product.ProductResponse;
import com.techstore.dto.product.ProductVariantResponse;
import com.techstore.entity.product.Product;
import com.techstore.entity.product.ProductAttribute;
import com.techstore.entity.product.ProductImage;
import com.techstore.entity.product.ProductVariant;
import com.techstore.exception.AppException;
import com.techstore.exception.ErrorCode;
import com.techstore.repository.product.ProductRepository;
import com.techstore.repository.product.ProductSpecification;
import com.techstore.repository.review.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.hibernate.Hibernate;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;
    private final ReviewRepository reviewRepository;

    @Cacheable(value = "products_v3", key = "{#query, #category, #brand, #minPrice, #maxPrice, #pageable.pageNumber, #pageable.pageSize, #pageable.sort.toString()}")
    public PageResponse<ProductResponse> getProducts(
            String query, String category, String brand, 
            BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable
    ) {
        Specification<Product> spec = ProductSpecification.filterProducts(query, category, brand, minPrice, maxPrice, true);
        Page<Product> productPage = productRepository.findAll(spec, pageable);

        List<Product> products = productPage.getContent();
        Hibernate.initialize(products);

        List<Long> productIds = products.stream()
                .map(Product::getId)
                .toList();
        Map<Long, Long> reviewCountMap = getReviewCountMap(productIds);

        Page<ProductResponse> page = productPage.map(p -> mapToProductResponse(p, false, reviewCountMap));
        return PageResponse.of(page);
    }

    public PageResponse<ProductResponse> getAdminProducts(
            String query, String category, String brand, 
            BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable
    ) {
        Specification<Product> spec = ProductSpecification.filterProducts(query, category, brand, minPrice, maxPrice, false);
        Page<Product> productPage = productRepository.findAll(spec, pageable);

        List<Product> products = productPage.getContent();
        Hibernate.initialize(products);

        List<Long> productIds = products.stream()
                .map(Product::getId)
                .toList();
        Map<Long, Long> reviewCountMap = getReviewCountMap(productIds);

        Page<ProductResponse> page = productPage.map(p -> mapToProductResponse(p, true, reviewCountMap));
        return PageResponse.of(page);
    }

    @Cacheable(value = "product_detail_v3", key = "#slug")
    public ProductResponse getProductBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new AppException(ErrorCode.ENTITY_NOT_FOUND));
        
        if (!product.isActive() || (product.getCategory() != null && !product.getCategory().isActive())) {
            throw new AppException(ErrorCode.ENTITY_NOT_FOUND);
        }
        
        return mapToProductResponse(product, true); 
    }

    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ENTITY_NOT_FOUND));
        return mapToProductResponse(product, true);
    }

    public ProductResponse mapToProductResponse(Product product) {
        return mapToProductResponse(product, false);
    }

    public ProductResponse mapToProductResponse(Product product, boolean isDetail) {
        Map<Long, Long> map = getReviewCountMap(List.of(product.getId()));
        return mapToProductResponse(product, isDetail, map);
    }

    public ProductResponse mapToProductResponse(Product product, boolean isDetail, Map<Long, Long> reviewCountMap) {
        BigDecimal displayPrice = product.getPrice() == null ? BigDecimal.ZERO : product.getPrice();
        double averageRating = product.getRating() == null ? 0D : product.getRating();
        long soldCount = product.getSoldCount() == null ? 0L : product.getSoldCount();
        long reviewCount = reviewCountMap.getOrDefault(product.getId(), 0L);

        String description = product.getDescription();
        if (!isDetail && description != null && description.length() > 150) {
            description = description.substring(0, 147) + "...";
        }

        BigDecimal minPrice = displayPrice;
        BigDecimal maxPrice = displayPrice;
        List<ProductVariantResponse> variantResponses = null;
        int variantCount = 0;

        ProductResponse.ProductResponseBuilder builder = ProductResponse.builder();

        List<ProductVariant> allVisibleVariants = isDetail ? getVisibleVariants(product) : List.of();
        if (!allVisibleVariants.isEmpty()) {
            BigDecimal repOriginalPrice = allVisibleVariants.get(0).getOriginalPrice();
            if (repOriginalPrice != null && repOriginalPrice.compareTo(displayPrice) > 0) {
                builder.originalPrice(repOriginalPrice);
                double discount = repOriginalPrice.subtract(displayPrice)
                        .movePointRight(2)
                        .divide(repOriginalPrice, 0, java.math.RoundingMode.HALF_UP).doubleValue();
                builder.discountPercentage((int) discount);
            }
        }

        if (isDetail) {
            variantCount = allVisibleVariants.size();
            minPrice = allVisibleVariants.stream()
                    .map(ProductVariant::getPrice)
                    .min(Comparator.naturalOrder())
                    .orElse(displayPrice);
            maxPrice = allVisibleVariants.stream()
                    .map(ProductVariant::getPrice)
                    .max(Comparator.naturalOrder())
                    .orElse(displayPrice);

            variantResponses = allVisibleVariants.stream()
                    .map(v -> ProductVariantResponse.builder()
                            .id(v.getId()).sku(v.getSku()).name(v.getName())
                            .price(v.getPrice())
                            .originalPrice(v.getOriginalPrice())
                            .stockQuantity(v.getStockQuantity())
                            .color(v.getColor()).size(v.getSize())
                            .build())
                    .collect(Collectors.toList());
        }

        builder.id(product.getId())
                .name(product.getName())
                .slug(product.getSlug())
                .description(description)
                .price(displayPrice)
                .currency("VND")
                .minPrice(minPrice)
                .maxPrice(maxPrice)
                .variantCount(variantCount)
                .rating(averageRating)
                .reviewCount(reviewCount)
                .soldCount(soldCount)
                .isNew(product.getCreatedAt() != null && product.getCreatedAt().isAfter(java.time.LocalDateTime.now().minusDays(30)))
                .active(product.isActive())
                .createdAt(product.getCreatedAt());

        if (variantResponses != null) {
            builder.variants(variantResponses);
        }

        if (product.getBrand() != null) {
            builder.brand(BrandResponse.builder()
                    .id(product.getBrand().getId())
                    .name(product.getBrand().getName())
                    .slug(product.getBrand().getSlug())
                    .logoUrl(product.getBrand().getLogoUrl() != null ? product.getBrand().getLogoUrl().replace("http://", "https://") : null)
                    .build());
        }

        if (product.getCategory() != null) {
            builder.category(CategoryResponse.builder()
                    .id(product.getCategory().getId())
                    .name(product.getCategory().getName())
                    .slug(product.getCategory().getSlug())
                    .build());
        }


        if (isDetail && product.getAttributes() != null) {
            builder.attributes(product.getAttributes().stream()
                    .sorted(Comparator.comparing(ProductAttribute::getAttributeName, Comparator.nullsLast(String::compareToIgnoreCase)))
                    .map(attr -> ProductAttributeResponse.builder().name(attr.getAttributeName()).value(attr.getAttributeValue()).build())
                    .collect(Collectors.toList()));
        }

        if (product.getImages() != null) {
            java.util.stream.Stream<ProductImage> imageStream = product.getImages().stream()
                    .sorted(Comparator.comparing(ProductImage::isThumbnail).reversed());

            if (!isDetail) imageStream = imageStream.limit(1);

            builder.imageUrls(imageStream
                    .map(img -> img.getImageUrl() != null ? img.getImageUrl().replace("http://", "https://") : null)
                    .filter(java.util.Objects::nonNull)
                    .collect(Collectors.toList()));
        }

        return builder.build();
    }

    private List<ProductVariant> getVisibleVariants(Product product) {
        if (product.getVariants() == null || product.getVariants().isEmpty()) return List.of();
        return product.getVariants().stream()
                .filter(ProductVariant::isActive)
                .collect(Collectors.toList());
    }

    private Map<Long, Long> getReviewCountMap(List<Long> productIds) {
        if (productIds.isEmpty()) return Map.of();
        return reviewRepository.countByProductIdIn(productIds).stream()
                .collect(Collectors.toMap(row -> ((Number) row[0]).longValue(), row -> ((Number) row[1]).longValue()));
    }
}
