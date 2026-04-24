package com.techstore.service.cart;

import com.techstore.dto.cart.CartItemRequest;
import com.techstore.dto.cart.CartItemResponse;
import com.techstore.dto.cart.CartResponse;
import com.techstore.entity.cart.Cart;
import com.techstore.entity.cart.CartItem;
import com.techstore.entity.product.ProductImage;
import com.techstore.entity.product.ProductVariant;
import com.techstore.entity.user.User;
import com.techstore.exception.AppException;
import com.techstore.exception.ErrorCode;
import com.techstore.repository.cart.CartItemRepository;
import com.techstore.repository.cart.CartRepository;
import com.techstore.repository.product.ProductVariantRepository;
import com.techstore.service.notification.NotificationService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductVariantRepository variantRepository;
    private final NotificationService notificationService;

    @Transactional(readOnly = true)
    public CartResponse getCart(User user) {
        Cart cart = cartRepository.findByUser(user)
                .orElseGet(() -> createNewCart(user));
        return mapToCartResponse(cart);
    }

    @Transactional
    public CartResponse addToCart(User user, CartItemRequest request) {
        Cart cart = cartRepository.findByUser(user)
                .orElseGet(() -> createNewCart(user));

        ProductVariant variant = variantRepository.findById(request.getVariantId())
                .orElseThrow(() -> new AppException(ErrorCode.ENTITY_NOT_FOUND));

        if (variant.getStockQuantity() < request.getQuantity()) {
            throw new AppException(ErrorCode.INSUFFICIENT_STOCK);
        }

        CartItem cartItem = cart.getItems().stream()
                .filter(item -> item.getVariant().getId().equals(variant.getId()))
                .findFirst()
                .orElse(null);

        boolean isNewItem = cartItem == null;
        
        if (cartItem != null) {
            cartItem.setQuantity(cartItem.getQuantity() + request.getQuantity());
        } else {
            cartItem = CartItem.builder()
                    .cart(cart)
                    .variant(variant)
                    .quantity(request.getQuantity())
                    .build();
            cart.getItems().add(cartItem);
        }

        cartRepository.save(cart);
        
        // Tạo thông báo ngắn gọn, chuyên nghiệp
        String productName = variant.getProduct().getName();
        String variantName = variant.getName();
        
        // Logic rút gọn: Nếu tên phiên bản chứa tên sản phẩm thì chỉ hiện tên phiên bản
        String displayTitle = variantName.contains(productName) ? variantName : productName + " (" + variantName + ")";
        
        String message = isNewItem 
            ? String.format("Đã thêm %s (x%d) vào giỏ hàng", displayTitle, request.getQuantity())
            : String.format("Đã cập nhật số lượng %s trong giỏ hàng", displayTitle);
        
        notificationService.createNotification(
            user, 
            "Giỏ hàng", 
            message, 
            "CART", 
            "/cart"
        );
        
        return mapToCartResponse(cart);
    }

    @Transactional
    public CartResponse updateCartItem(User user, String itemId, Integer quantity) {
        CartItem cartItem = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new AppException(ErrorCode.ENTITY_NOT_FOUND));

        if (quantity <= 0) {
            Cart cart = cartRepository.findByUser(user)
                    .orElseThrow(() -> new AppException(ErrorCode.ENTITY_NOT_FOUND));
            cart.getItems().remove(cartItem);
            cartItemRepository.delete(cartItem);
            return mapToCartResponse(cart);
        } else {
            if (cartItem.getVariant().getStockQuantity() < quantity) {
                throw new AppException(ErrorCode.INSUFFICIENT_STOCK);
            }
            cartItem.setQuantity(quantity);
            cartItemRepository.save(cartItem);
        }

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new AppException(ErrorCode.ENTITY_NOT_FOUND));
        return mapToCartResponse(cart);
    }

    @Transactional
    public CartResponse removeFromCart(User user, String itemId) {
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new AppException(ErrorCode.ENTITY_NOT_FOUND));
        
        cart.getItems().removeIf(item -> item.getId().equals(itemId));
        cartItemRepository.deleteById(itemId);
        
        return mapToCartResponse(cart);
    }

    @Transactional
    public void clearCart(User user) {
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new AppException(ErrorCode.ENTITY_NOT_FOUND));
        cartItemRepository.deleteAll(cart.getItems());
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    private Cart createNewCart(User user) {
        Cart cart = Cart.builder()
                .user(user)
                .items(new ArrayList<>())
                .build();
        return cartRepository.save(cart);
    }

    private CartResponse mapToCartResponse(Cart cart) {
        List<CartItemResponse> items = cart.getItems().stream()
                .map(item -> {
                    ProductVariant v = item.getVariant();
                    // Lấy ảnh đầu tiên một cách an toàn
                    String imageUrl = v.getProduct().getImages().stream()
                            .findFirst()
                            .map(ProductImage::getImageUrl)
                            .orElse(null);

                    return CartItemResponse.builder()
                            .id(item.getId())
                            .variantId(v.getId())
                            .productName(v.getProduct().getName())
                            .variantName(v.getName())
                            .sku(v.getSku())
                            .imageUrl(imageUrl)
                            .price(v.getPrice())
                            .quantity(item.getQuantity())
                            .subTotal(v.getPrice().multiply(new BigDecimal(item.getQuantity())))
                            .build();
                })
                .collect(Collectors.toList());

        BigDecimal total = items.stream()
                .map(CartItemResponse::getSubTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CartResponse.builder()
                .cartItems(items)
                .totalPrice(total)
                .totalItems(items.stream().mapToInt(CartItemResponse::getQuantity).sum())
                .build();
    }
}
