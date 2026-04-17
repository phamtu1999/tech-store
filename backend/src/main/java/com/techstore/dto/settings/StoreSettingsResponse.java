package com.techstore.dto.settings;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StoreSettingsResponse {
    private Long id;
    private String storeName;
    private String logoUrl;
    private String supportEmail;
    private String hotlinePhone;
    private String address;
    private LocalDateTime updatedAt;
}
