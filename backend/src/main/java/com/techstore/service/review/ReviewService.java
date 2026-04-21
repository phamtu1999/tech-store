package com.techstore.service.review;

import com.techstore.dto.review.ReviewRequest;
import com.techstore.dto.review.ReviewResponse;
import com.techstore.entity.order.OrderStatus;
import com.techstore.entity.product.Product;
import com.techstore.entity.review.Review;
import com.techstore.entity.review.ReviewImage;
import com.techstore.entity.user.Role;
import com.techstore.entity.user.User;
import com.techstore.exception.AppException;
import com.techstore.exception.ErrorCode;
import com.techstore.repository.order.OrderRepository;
import com.techstore.repository.product.ProductRepository;
import com.techstore.repository.review.ReviewRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    @Transactional(readOnly = true)
    public List<ReviewResponse> getByProduct(String productId) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId, PageRequest.of(0, 100))
                .getContent()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ReviewResponse> getByUser(String userId) {
        return reviewRepository.findByUserIdOrderByCreatedAtDesc(userId, PageRequest.of(0, 100))
                .getContent()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public ReviewResponse create(User user, ReviewRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new AppException(ErrorCode.ENTITY_NOT_FOUND));

        Review review = reviewRepository.findByUserIdAndProductId(user.getId(), request.getProductId())
                .orElse(Review.builder()
                        .user(user)
                        .product(product)
                        .build());

        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setVerifiedPurchase(true);

        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
            List<ReviewImage> images = request.getImageUrls().stream()
                    .map(url -> ReviewImage.builder()
                            .review(review)
                            .imageUrl(url)
                            .build())
                    .toList();
            if (review.getImages() != null) {
                review.getImages().clear();
                review.getImages().addAll(images);
            } else {
                review.setImages(images);
            }
        }

        // Update Order status if orderId is provided
        if (request.getOrderId() != null) {
            orderRepository.findById(request.getOrderId()).ifPresent(order -> {
                if (order.getUser().getId().equals(user.getId()) && order.getStatus() == OrderStatus.DELIVERED) {
                    order.setStatus(OrderStatus.REVIEWED);
                    orderRepository.save(order);
                }
            });
        }

        return mapToResponse(reviewRepository.save(review));
    }

    @Transactional
    public ReviewResponse update(User user, String reviewId, ReviewRequest request) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new AppException(ErrorCode.ENTITY_NOT_FOUND));

        if (!review.getUser().getId().equals(user.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        review.setRating(request.getRating());
        review.setComment(request.getComment());
        return mapToResponse(reviewRepository.save(review));
    }

    @Transactional
    public void delete(User user, String reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new AppException(ErrorCode.ENTITY_NOT_FOUND));

        boolean isOwner = review.getUser().getId().equals(user.getId());
        boolean isManagement = user.getRole() == Role.ROLE_ADMIN || 
                             user.getRole() == Role.ROLE_SUPER_ADMIN || 
                             user.getRole() == Role.ROLE_MANAGER;

        if (!isOwner && !isManagement) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        reviewRepository.delete(review);
    }

    private ReviewResponse mapToResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .productId(review.getProduct().getId())
                .username(review.getUser().getFullName())
                .rating(review.getRating())
                .comment(review.getComment())
                .verified(review.isVerifiedPurchase())
                .imageUrls(review.getImages() != null ? review.getImages().stream().map(ReviewImage::getImageUrl).toList() : List.of())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
