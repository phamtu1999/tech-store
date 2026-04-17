package com.techstore.service.user;

import com.techstore.dto.cart.CartItemRequest;
import com.techstore.dto.user.WishlistItemResponse;
import com.techstore.entity.product.Product;
import com.techstore.entity.product.ProductVariant;
import com.techstore.entity.user.User;
import com.techstore.entity.user.Wishlist;
import com.techstore.exception.AppException;
import com.techstore.exception.ErrorCode;
import com.techstore.repository.product.ProductRepository;
import com.techstore.repository.product.ProductVariantRepository;
import com.techstore.repository.user.WishlistRepository;
import com.techstore.service.cart.CartService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final CartService cartService;

    @Transactional(readOnly = true)
    public List<WishlistItemResponse> getWishlist(User user) {
        return wishlistRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public WishlistItemResponse addToWishlist(User user, Long productId) {
        if (wishlistRepository.existsByUserIdAndProductId(user.getId(), productId)) {
            return wishlistRepository.findByUserIdAndProductId(user.getId(), productId)
                    .map(this::mapToResponse)
                    .orElseThrow(() -> new AppException(ErrorCode.ENTITY_NOT_FOUND));
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException(ErrorCode.ENTITY_NOT_FOUND));

        Wishlist wishlist = wishlistRepository.save(Wishlist.builder()
                .user(user)
                .product(product)
                .build());

        return mapToResponse(wishlist);
    }

    @Transactional
    public void removeFromWishlist(User user, Long productId) {
        wishlistRepository.deleteByUserIdAndProductId(user.getId(), productId);
    }

    @Transactional
    public void clearWishlist(User user) {
        wishlistRepository.deleteByUserId(user.getId());
    }

    @Transactional
    public void moveToCart(User user, Long productId) {
        ProductVariant variant = getPrimaryVariant(productId);
        if (variant == null) {
            throw new AppException(ErrorCode.ENTITY_NOT_FOUND);
        }

        cartService.addToCart(user, CartItemRequest.builder()
                .variantId(variant.getId())
                .quantity(1)
                .build());
        wishlistRepository.deleteByUserIdAndProductId(user.getId(), productId);
    }

    private WishlistItemResponse mapToResponse(Wishlist wishlist) {
        Product product = wishlist.getProduct();
        ProductVariant variant = getPrimaryVariant(product.getId());
        String imageUrl = product.getImages() == null || product.getImages().isEmpty()
                ? null
                : product.getImages().iterator().next().getImageUrl();

        return WishlistItemResponse.builder()
                .id(wishlist.getId())
                .productId(product.getId())
                .variantId(variant != null ? variant.getId() : null)
                .productName(product.getName())
                .slug(product.getSlug())
                .productImage(imageUrl)
                .price(variant != null ? variant.getPrice() : BigDecimal.ZERO)
                .inStock(variant != null && variant.getStockQuantity() > 0)
                .build();
    }

    private ProductVariant getPrimaryVariant(Long productId) {
        return productVariantRepository.findByProductIdOrderBySortOrderAsc(productId).stream()
                .min(Comparator.comparing(ProductVariant::getSortOrder).thenComparing(ProductVariant::getId))
                .orElse(null);
    }
}
