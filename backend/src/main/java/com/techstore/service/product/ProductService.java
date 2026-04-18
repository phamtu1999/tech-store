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
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;
    private final ReviewRepository reviewRepository;
    private final OrderRepository orderRepository;

    @Cacheable(value = "products_v2", key = "{#query, #category, #brand, #minPrice, #maxPrice, #pageable.pageNumber, #pageable.pageSize}")
    public PageResponse<ProductResponse> getProducts(
            String query, String category, String brand, 
            BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable
    ) {
        Specification<Product> spec = ProductSpecification.filterProducts(query, category, brand, minPrice, maxPrice);
        Page<ProductResponse> page = productRepository.findAll(spec, pageable).map(this::mapToProductResponse);
        return PageResponse.of(page);
    }

    @Cacheable(value = "product_detail_v2", key = "#slug")
    public ProductResponse getProductBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new AppException(ErrorCode.ENTITY_NOT_FOUND));
        return mapToProductResponse(product, true); // Include details for single product
    }

    public ProductResponse mapToProductResponse(Product product) {
        return mapToProductResponse(product, false); // Light version for list
    }

    public ProductResponse mapToProductResponse(Product product, boolean isDetail) {
        List<ProductVariant> visibleVariants = getVisibleVariants(product);

        BigDecimal displayPrice = product.getPrice() == null ? BigDecimal.ZERO : product.getPrice();
        double averageRating = product.getRating() == null ? 0D : product.getRating();
        long soldCount = product.getSoldCount() == null ? 0L : product.getSoldCount();
        long reviewCount = reviewRepository.countByProductId(product.getId());

        // Optimize description for list
        String description = product.getDescription();
        if (!isDetail && description != null && description.length() > 200) {
            description = description.substring(0, 197) + "...";
        }

        ProductResponse.ProductResponseBuilder builder = ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .slug(product.getSlug())
                .description(description)
                .active(product.isActive())
                .price(displayPrice)
                .originalPrice(displayPrice)
                .rating(averageRating)
                .reviewCount(reviewCount)
                .soldCount(soldCount)
                .discountPercentage(0)
                .isNew(product.getCreatedAt() != null && product.getCreatedAt().isAfter(java.time.LocalDateTime.now().minusDays(30)))
                .createdAt(product.getCreatedAt());

        if (product.getBrand() != null) {
            builder.brand(BrandResponse.builder()
                    .id(product.getBrand().getId())
                    .name(product.getBrand().getName())
                    .slug(product.getBrand().getSlug())
                    .logoUrl(product.getBrand().getLogoUrl())
                    .build());
        }

        if (product.getCategory() != null) {
            builder.category(CategoryResponse.builder()
                    .id(product.getCategory().getId())
                    .name(product.getCategory().getName())
                    .slug(product.getCategory().getSlug())
                    .parentId(null) // Temporarily set null to avoid LazyInitException
                    .build());
        }

        if (!visibleVariants.isEmpty()) {
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
            builder.imageUrls(product.getImages().stream()
                    .sorted(Comparator.comparing(ProductImage::isThumbnail).reversed()
                            .thenComparing(ProductImage::getId, Comparator.nullsLast(Long::compareTo)))
                    .map(ProductImage::getImageUrl)
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
}
