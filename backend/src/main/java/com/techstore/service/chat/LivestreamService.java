package com.techstore.service.chat;

import com.techstore.dto.chat.LivestreamResponse;
import com.techstore.entity.chat.Livestream;
import com.techstore.entity.product.Product;
import com.techstore.entity.user.User;
import com.techstore.exception.AppException;
import com.techstore.exception.ErrorCode;
import com.techstore.repository.chat.LivestreamRepository;
import com.techstore.repository.product.ProductRepository;
import com.techstore.repository.user.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LivestreamService {

    private final LivestreamRepository livestreamRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<LivestreamResponse> getAll() {
        return livestreamRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<LivestreamResponse> getLive() {
        return livestreamRepository.findByStatus(Livestream.LivestreamStatus.LIVE).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<LivestreamResponse> getUpcoming() {
        return livestreamRepository.findByStatus(Livestream.LivestreamStatus.UPCOMING).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<LivestreamResponse> getPopular(int limit) {
        return livestreamRepository.findPopularLiveStreams().stream()
                .limit(limit)
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public LivestreamResponse getById(String id) {
        Livestream livestream = livestreamRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ENTITY_NOT_FOUND));
        return mapToResponse(livestream);
    }

    @Transactional
    public LivestreamResponse createStream(LivestreamResponse request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User streamer = userRepository.findByEmail(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Livestream livestream = Livestream.builder()
                .title(request.getTitle())
                .description(request.getTitle())
                .thumbnailUrl(request.getThumbnailUrl())
                .streamUrl(request.getStreamUrl())
                .status(Livestream.LivestreamStatus.LIVE)
                .streamer(streamer)
                .startTime(LocalDateTime.now())
                .viewerCount(0)
                .build();

        return mapToResponse(livestreamRepository.save(livestream));
    }

    @Transactional
    public LivestreamResponse updateStatus(String id, String status) {
        Livestream livestream = livestreamRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ENTITY_NOT_FOUND));
        
        livestream.setStatus(Livestream.LivestreamStatus.valueOf(status.toUpperCase()));
        if (livestream.getStatus() == Livestream.LivestreamStatus.ENDED) {
            livestream.setEndTime(LocalDateTime.now());
        }
        
        return mapToResponse(livestreamRepository.save(livestream));
    }

    @Transactional
    public LivestreamResponse pushProduct(String id, String productId) {
        Livestream livestream = livestreamRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ENTITY_NOT_FOUND));
        
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException(ErrorCode.ENTITY_NOT_FOUND));
        
        livestream.setActiveProduct(product);
        return mapToResponse(livestreamRepository.save(livestream));
    }

    private LivestreamResponse mapToResponse(Livestream livestream) {
        Product activeProduct = livestream.getActiveProduct();
        String productImage = (activeProduct != null && activeProduct.getImages() != null && !activeProduct.getImages().isEmpty())
                ? activeProduct.getImages().iterator().next().getImageUrl()
                : livestream.getThumbnailUrl();

        return LivestreamResponse.builder()
                .id(livestream.getId())
                .title(livestream.getTitle())
                .thumbnailUrl(livestream.getThumbnailUrl())
                .viewerCount(livestream.getViewerCount())
                .streamerUsername(livestream.getStreamer().getFullName())
                .streamerAvatar("https://ui-avatars.com/api/?name=" + livestream.getStreamer().getFullName())
                .productId(activeProduct != null ? activeProduct.getId() : null)
                .productName(activeProduct != null ? activeProduct.getName() : null)
                .productImage(productImage)
                .streamUrl(livestream.getStreamUrl())
                .productSlug(activeProduct != null ? activeProduct.getSlug() : null)
                .build();
    }
}
