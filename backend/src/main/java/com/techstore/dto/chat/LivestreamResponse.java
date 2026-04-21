package com.techstore.dto.chat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LivestreamResponse {
    private String id;
    private String title;
    private String thumbnailUrl;
    private Integer viewerCount;
    private String streamerUsername;
    private String streamerAvatar;
    private String productId;
    private String productName;
    private String productImage;
    private String streamUrl;
    private String productSlug;
}
