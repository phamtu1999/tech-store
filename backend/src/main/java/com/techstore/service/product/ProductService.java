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
import com.techstore.repository.order.OrderRepository;
import com.techstore.repository.product.ProductRepository;
import com.techstore.repository.product.ProductSpecification;
import com.techstore.repository.review.ReviewRepository;

import lombok.RequiredArgsConstructor;
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
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;
    private final ReviewRepository reviewRepository;
    private final OrderRepository orderRepository;

    @Cacheable(value = "products_v3", key = "{#query, #category, #brand, #minPrice, #maxPrice, #pageable.pageNumber, #pageable.pageSize, #pageable.sort.toString()}")
    public PageResponse<ProductResponse> getProducts(
            String query, String category, String brand, 
            BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable
    ) {
        Specification<Product> spec = ProductSpecification.filterProducts(query, category, brand, minPrice, maxPrice, true);
        Page<Product> productPage = productRepository.findAll(spec, pageable);

        // ✅ Batch load review counts to prevent N+1 queries
        List<Long> productIds = productPage.getContent().stream()
                .map(Product::getId)
                .collect(Collectors.toList());
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

        List<Long> productIds = productPage.getContent().stream()
                .map(Product::getId)
                .collect(Collectors.toList());
        Map<Long, Long> reviewCountMap = getReviewCountMap(productIds);

        Page<ProductResponse> page = productPage.map(p -> mapToProductResponse(p, false, reviewCountMap));
        return PageResponse.of(page);
    }

    @Cacheable(value = "product_detail_v3", key = "#slug")
    public ProductResponse getProductBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new AppException(ErrorCode.ENTITY_NOT_FOUND));
        
        // Security check for public detail view
        if (!product.isActive() || 
            (product.getCategory() != null && !product.getCategory().isActive())
            // || (product.getBrand() != null && !product.getBrand().isActive())
        ) {
            throw new AppException(ErrorCode.ENTITY_NOT_FOUND); // Hide it from public
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
        // For detail view or when map is not available, we can still load it
        Map<Long, Long> reviewCountMap = getReviewCountMap(List.of(product.getId()));
        return mapToProductResponse(product, isDetail, reviewCountMap);
    }

    // ✅ Overloaded version that takes a pre-loaded map for performance in lists
    public ProductResponse mapToProductResponse(Product product, boolean isDetail, Map<Long, Long> reviewCountMap) {
        List<ProductVariant> visibleVariants = getVisibleVariants(product);

        BigDecimal displayPrice = product.getPrice() == null ? BigDecimal.ZERO : product.getPrice();
        double averageRating = product.getRating() == null ? 0D : product.getRating();
        long soldCount = product.getSoldCount() == null ? 0L : product.getSoldCount();
        
        // ✅ Get from map instead of querying DB in a loop
        long reviewCount = reviewCountMap.getOrDefault(product.getId(), 0L);

        // Optimize description for list (shorter for mobile/list UX)
        String description = product.getDescription();
        if (!isDetail && description != null && description.length() > 150) {
            description = description.substring(0, 147) + "...";
        }

        BigDecimal minPrice = visibleVariants.stream()
                .map(ProductVariant::getPrice)
                .min(Comparator.naturalOrder())
                .orElse(displayPrice);

        BigDecimal maxPrice = visibleVariants.stream()
                .map(ProductVariant::getPrice)
                .max(Comparator.naturalOrder())
                .orElse(displayPrice);

        ProductResponse.ProductResponseBuilder builder = ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .slug(product.getSlug())
                .description(description)
                .price(displayPrice)
                .currency("VND")
                .minPrice(minPrice)
                .maxPrice(maxPrice)
                .variantCount(visibleVariants.size())
                .rating(averageRating)
                .reviewCount(reviewCount)
                .soldCount(soldCount)
                .isNew(product.getCreatedAt() != null && product.getCreatedAt().isAfter(java.time.LocalDateTime.now().minusDays(30)))
                .createdAt(product.getCreatedAt());

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
                    .parentId(null)
                    .build());
        }

        // ✅ List view optimization: don't return full variant objects
        if (isDetail && !visibleVariants.isEmpty()) {
            builder.variants(visibleVariants.stream()
                    .map(v -> ProductVariantResponse.builder()
                            .id(v.getId())
                            .sku(v.getSku())
                            .name(v.getName())
                            .price(v.getPrice())
                            .stockQuantity(v.getStockQuantity())
                            .color(v.getColor())
                            .size(v.getSize())
                            .build())
                    .collect(Collectors.toList()));
        }

        if (isDetail && product.getAttributes() != null) {
            builder.attributes(product.getAttributes().stream()
                    .sorted(Comparator.comparing(ProductAttribute::getAttributeName, Comparator.nullsLast(String::compareToIgnoreCase)))
                    .map(attribute -> ProductAttributeResponse.builder()
                            .name(attribute.getAttributeName())
                            .value(attribute.getAttributeValue())
                            .build())
                    .collect(Collectors.toList()));
        }

        if (product.getImages() != null) {
            java.util.stream.Stream<ProductImage> imageStream = product.getImages().stream()
                    .sorted(Comparator.comparing(ProductImage::isThumbnail).reversed()
                            .thenComparing(ProductImage::getId, Comparator.nullsLast(Long::compareTo)));

            if (!isDetail) {
                imageStream = imageStream.limit(1);
            }

            builder.imageUrls(imageStream
                    .map(img -> {
                        String url = img.getImageUrl();
                        return url != null ? url.replace("http://", "https://") : null;
                    })
                    .filter(java.util.Objects::nonNull)
                    .collect(Collectors.toList()));
        }

        return builder.build();
    }

    private List<ProductVariant> getVisibleVariants(Product product) {
        if (product.getVariants() == null || product.getVariants().isEmpty()) {
            return List.of();
        }

        List<ProductVariant> activeVariants = product.getVariants().stream()
                .filter(ProductVariant::isActive)
                .sorted(Comparator
                        .comparing((ProductVariant variant) -> variant.getSortOrder() == null ? Integer.MAX_VALUE : variant.getSortOrder())
                        .thenComparing(ProductVariant::getId, Comparator.nullsLast(Long::compareTo)))
                .collect(Collectors.toList());

        if (!activeVariants.isEmpty()) {
            return activeVariants;
        }

        return product.getVariants().stream()
                .sorted(Comparator
                        .comparing((ProductVariant variant) -> variant.getSortOrder() == null ? Integer.MAX_VALUE : variant.getSortOrder())
                        .thenComparing(ProductVariant::getId, Comparator.nullsLast(Long::compareTo)))
                .collect(Collectors.toList());
    }

    // ✅ Helper method to batch load review counts
    private Map<Long, Long> getReviewCountMap(List<Long> productIds) {
        if (productIds.isEmpty()) return Map.of();
        return reviewRepository.countByProductIdIn(productIds).stream()
                .collect(Collectors.toMap(
                        row -> (Long) row[0],
                        row -> (Long) row[1]
                ));
    }
}
