package com.techstore.service.product;

import com.techstore.dto.product.ProductRequest;
import com.techstore.entity.brand.Brand;
import com.techstore.entity.category.Category;
import com.techstore.entity.product.Product;
import com.techstore.entity.product.ProductAttribute;
import com.techstore.entity.product.ProductImage;
import com.techstore.entity.product.ProductVariant;
import com.techstore.exception.AppException;
import com.techstore.exception.ErrorCode;
import com.techstore.repository.brand.BrandRepository;
import com.techstore.repository.category.CategoryRepository;
import com.techstore.repository.product.ProductRepository;
import com.techstore.utils.SlugUtils;

import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductAdminService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;

    @Transactional
    @CacheEvict(value = {"products", "product_detail", "brands"}, allEntries = true)
    public void createProduct(ProductRequest request) {
        // 1. Validate Category & Brand
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new AppException(ErrorCode.ENTITY_NOT_FOUND));
        Brand brand = resolveBrand(request);

        // 2. Create and Save Product
        Product product = Product.builder()
                .name(request.getName())
                .slug(resolveSlug(request, category))
                .description(request.getDescription())
                .category(category)
                .brand(brand)
                .active(request.getActive() == null || request.getActive())
                .variants(new HashSet<>())
                .attributes(new HashSet<>())
                .images(new HashSet<>())
                .build();

        // 3. Add Variants
        if (request.getVariants() != null) {
            for (ProductRequest.VariantRequest vReq : request.getVariants()) {
                ProductVariant variant = ProductVariant.builder()
                        .product(product)
                        .sku(vReq.getSku())
                        .name(vReq.getName())
                        .price(vReq.getPrice())
                        .stockQuantity(vReq.getStockQuantity())
                        .color(vReq.getColor())
                        .size(vReq.getSize())
                        .sortOrder(vReq.getSortOrder())
                        .build();
                product.getVariants().add(variant);
            }
        }

        // 4. Add Attributes
        if (request.getAttributes() != null) {
            for (ProductRequest.AttributeRequest aReq : request.getAttributes()) {
                ProductAttribute attribute = ProductAttribute.builder()
                        .product(product)
                        .attributeName(aReq.getName())
                        .attributeValue(aReq.getValue())
                        .build();
                product.getAttributes().add(attribute);
            }
        }

        // 5. Add Images
        if (request.getImageUrls() != null) {
            for (int i = 0; i < request.getImageUrls().size(); i++) {
                ProductImage image = ProductImage.builder()
                        .product(product)
                        .imageUrl(request.getImageUrls().get(i))
                        .isThumbnail(i == 0) // First image is thumbnail by default
                        .build();
                product.getImages().add(image);
            }
        }

        // 6. Save Everything (CascadeType.ALL will handle child entities)
        productRepository.save(product);
    }

    @Transactional
    @CacheEvict(value = {"products", "product_detail", "brands"}, allEntries = true)
    public void updateProduct(Long id, ProductRequest request) {
        // 1. Find Product
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ENTITY_NOT_FOUND));

        // 2. Validate Category & Brand
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new AppException(ErrorCode.ENTITY_NOT_FOUND));
        Brand brand = resolveBrand(request);

        // 3. Update basic fields
        product.setName(request.getName());
        product.setSlug(resolveSlug(request, category));
        product.setDescription(request.getDescription());
        product.setCategory(category);
        product.setBrand(brand);
        product.setActive(request.getActive() == null || request.getActive());

        // 4. Update child collections
        syncVariants(product, request.getVariants());
        syncAttributes(product, request.getAttributes());
        syncImages(product, request.getImageUrls());

        // 7. Save updated product
        productRepository.save(product);
    }

    @Transactional
    @CacheEvict(value = {"products", "product_detail", "brands"}, allEntries = true)
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new AppException(ErrorCode.ENTITY_NOT_FOUND);
        }
        productRepository.deleteById(id);
    }

    private Brand resolveBrand(ProductRequest request) {
        if (request.getBrandId() != null) {
            return brandRepository.findById(request.getBrandId())
                    .orElseThrow(() -> new AppException(ErrorCode.ENTITY_NOT_FOUND));
        }

        if (request.getBrandName() != null && !request.getBrandName().isBlank()) {
            return brandRepository.findByName(request.getBrandName())
                    .orElseGet(() -> brandRepository.save(Brand.builder()
                            .name(request.getBrandName())
                            .slug(SlugUtils.makeSlug(request.getBrandName()))
                            .build()));
        }

        throw new AppException(ErrorCode.ENTITY_NOT_FOUND);
    }

    private String resolveSlug(ProductRequest request, Category category) {
        if (request.getSlug() != null && !request.getSlug().isBlank()) {
            return SlugUtils.makeSlug(request.getSlug());
        }
        
        // SEO optimization: Prepend parent category if helpful (e.g., "Điện thoại")
        String prefix = category.getName();
        if (category.getParent() != null && !category.getParent().getSlug().equals("dien-tu")) {
            prefix = category.getParent().getName() + " " + prefix;
        }
        
        String slugInput = prefix + " " + request.getName();
        String slug = SlugUtils.makeSlug(slugInput);
        
        // Deduplicate adjacent identical tokens (e.g., laptop-laptop-dell -> laptop-dell)
        return SlugUtils.deduplicate(slug);
    }

    private void syncVariants(Product product, List<ProductRequest.VariantRequest> variantRequests) {
        if (variantRequests == null || variantRequests.isEmpty()) {
            return;
        }

        List<ProductVariant> existingVariants = product.getVariants().stream()
                .sorted(Comparator
                        .comparing((ProductVariant variant) -> variant.getSortOrder() == null ? Integer.MAX_VALUE : variant.getSortOrder())
                        .thenComparing(ProductVariant::getId, Comparator.nullsLast(Long::compareTo)))
                .collect(Collectors.toList());

        for (int i = 0; i < variantRequests.size(); i++) {
            ProductRequest.VariantRequest requestVariant = variantRequests.get(i);
            ProductVariant variant = i < existingVariants.size()
                    ? existingVariants.get(i)
                    : ProductVariant.builder().product(product).build();

            variant.setProduct(product);
            variant.setSku(requestVariant.getSku());
            variant.setName(requestVariant.getName());
            variant.setPrice(requestVariant.getPrice());
            variant.setStockQuantity(requestVariant.getStockQuantity());
            variant.setColor(requestVariant.getColor());
            variant.setSize(requestVariant.getSize());
            variant.setSortOrder(requestVariant.getSortOrder());
            variant.setActive(true);

            if (!product.getVariants().contains(variant)) {
                product.getVariants().add(variant);
            }
        }

    }

    private void syncAttributes(Product product, List<ProductRequest.AttributeRequest> attributeRequests) {
        product.getAttributes().clear();

        if (attributeRequests == null) {
            return;
        }

        for (ProductRequest.AttributeRequest requestAttribute : attributeRequests) {
            if (requestAttribute.getName() == null || requestAttribute.getName().isBlank()
                    || requestAttribute.getValue() == null || requestAttribute.getValue().isBlank()) {
                continue;
            }

            ProductAttribute attribute = ProductAttribute.builder()
                    .product(product)
                    .attributeName(requestAttribute.getName().trim())
                    .attributeValue(requestAttribute.getValue().trim())
                    .build();
            product.getAttributes().add(attribute);
        }
    }

    private void syncImages(Product product, List<String> imageUrls) {
        product.getImages().clear();

        if (imageUrls == null) {
            return;
        }

        List<String> sanitizedImageUrls = imageUrls.stream()
                .filter(Objects::nonNull)
                .map(String::trim)
                .filter(url -> !url.isBlank())
                .collect(Collectors.toList());

        for (int i = 0; i < sanitizedImageUrls.size(); i++) {
            ProductImage image = ProductImage.builder()
                    .product(product)
                    .imageUrl(sanitizedImageUrls.get(i))
                    .isThumbnail(i == 0)
                    .build();
            product.getImages().add(image);
        }
    }
}
