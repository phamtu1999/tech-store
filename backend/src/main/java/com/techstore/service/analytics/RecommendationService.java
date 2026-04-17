package com.techstore.service.analytics;

import com.techstore.dto.analytics.RecommendationResponse;
import com.techstore.dto.product.ProductResponse;
import com.techstore.entity.product.Product;
import com.techstore.entity.user.User;
import com.techstore.exception.AppException;
import com.techstore.exception.ErrorCode;
import com.techstore.repository.product.ProductRepository;
import com.techstore.service.product.ProductService;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final ProductRepository productRepository;
    private final ProductService productService;

    public List<RecommendationResponse> getPopular(int limit) {
        return getRecentActiveProducts(limit).stream()
                .map(p -> new RecommendationResponse(p, 0.9, "POPULAR"))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<RecommendationResponse> getTrending(int limit) {
        return getRecentActiveProducts(limit).stream()
                .map(p -> new RecommendationResponse(p, 0.85, "TRENDING"))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<RecommendationResponse> getPersonalized(User user, int limit) {
        if (user == null) {
            return getPopular(limit);
        }
        return getRecentActiveProducts(limit).stream()
                .map(p -> new RecommendationResponse(p, 0.95, "HYBRID"))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<RecommendationResponse> getSimilar(Long productId, int limit) {
        Product baseProduct = productRepository.findById(productId)
                .orElseThrow(() -> new AppException(ErrorCode.ENTITY_NOT_FOUND));

        return productRepository
                .findAll(PageRequest.of(0, Math.max(limit * 2, 8), Sort.by(Sort.Direction.DESC, "createdAt")))
                .getContent()
                .stream()
                .filter(Product::isActive)
                .filter(product -> !product.getId().equals(productId))
                .filter(product -> product.getCategory() != null
                        && baseProduct.getCategory() != null
                        && product.getCategory().getId().equals(baseProduct.getCategory().getId()))
                .limit(limit)
                .map(productService::mapToProductResponse)
                .map(p -> new RecommendationResponse(p, 0.8, "CONTENT"))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<RecommendationResponse> getFrequentlyBoughtTogether(Long productId, int limit) {
        // Mock frequently bought together as a hybrid placeholder
        return getRecentActiveProducts(limit).stream()
                .map(p -> new RecommendationResponse(p, 0.75, "FREQUENTLY_BOUGHT"))
                .toList();
    }

    @Transactional(readOnly = true)
    public java.util.Map<String, List<RecommendationResponse>> getHomepageLayout(User user) {
        java.util.Map<String, List<RecommendationResponse>> layout = new java.util.HashMap<>();

        if (user == null) {
            layout.put("Trending", getTrending(8));
            layout.put("Popular Options", getPopular(8));
            return layout;
        }

        layout.put("Recommended For You", getPersonalized(user, 8));
        layout.put("Based On Your Recent Views", getTrending(8).stream()
                .map(r -> new RecommendationResponse(r.getProduct(), r.getRecommendationScore(), "CONTENT")).toList());
        layout.put("Trending In Your Categories", getTrending(8));
        layout.put("New Arrivals You Might Like", getRecentActiveProducts(8).stream()
                .map(p -> new RecommendationResponse(p, 0.7, "NEW_ARRIVAL")).toList());

        return layout;
    }

    public void trackView(User user, Long productId) {
        productRepository.existsById(productId);
    }

    public void trackClick(User user, Long productId) {
        productRepository.existsById(productId);
    }

    private List<ProductResponse> getRecentActiveProducts(int limit) {
        return productRepository
                .findAll(PageRequest.of(0, Math.max(limit, 1), Sort.by(Sort.Direction.DESC, "createdAt")))
                .getContent()
                .stream()
                .filter(Product::isActive)
                .limit(limit)
                .map(productService::mapToProductResponse)
                .toList();
    }
}
