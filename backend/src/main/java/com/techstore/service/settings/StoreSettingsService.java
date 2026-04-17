package com.techstore.service.settings;

import com.techstore.dto.settings.StoreSettingsRequest;
import com.techstore.dto.settings.StoreSettingsResponse;
import com.techstore.entity.settings.StoreSettings;
import com.techstore.repository.settings.StoreSettingsRepository;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class StoreSettingsService {

    private final StoreSettingsRepository storeSettingsRepository;

    private static final String DEFAULT_SETTING_KEY = "general";

    public StoreSettingsResponse getSettings() {
        StoreSettings settings = storeSettingsRepository.findBySettingKey(DEFAULT_SETTING_KEY)
                .orElseGet(() -> createDefaultSettings());
        return mapToResponse(settings);
    }

    @Transactional
    public StoreSettingsResponse updateSettings(StoreSettingsRequest request) {
        StoreSettings settings = storeSettingsRepository.findBySettingKey(DEFAULT_SETTING_KEY)
                .orElseGet(() -> createDefaultSettings());

        settings.setStoreName(request.getStoreName());
        settings.setLogoUrl(request.getLogoUrl());
        settings.setSupportEmail(request.getSupportEmail());
        settings.setHotlinePhone(request.getHotlinePhone());
        settings.setAddress(request.getAddress());

        return mapToResponse(storeSettingsRepository.save(settings));
    }

    private StoreSettings createDefaultSettings() {
        StoreSettings settings = StoreSettings.builder()
                .settingKey(DEFAULT_SETTING_KEY)
                .storeName("Tech Store")
                .logoUrl("https://res.cloudinary.com/demo/image/upload/v1622540000/sample.jpg")
                .supportEmail("support@techstore.com")
                .hotlinePhone("0987.654.321")
                .address("123 Đường Công Nghệ, Quận 1, TP. Hồ Chí Minh")
                .build();
        return storeSettingsRepository.save(settings);
    }

    private StoreSettingsResponse mapToResponse(StoreSettings settings) {
        return StoreSettingsResponse.builder()
                .id(settings.getId())
                .storeName(settings.getStoreName())
                .logoUrl(settings.getLogoUrl())
                .supportEmail(settings.getSupportEmail())
                .hotlinePhone(settings.getHotlinePhone())
                .address(settings.getAddress())
                .updatedAt(settings.getUpdatedAt())
                .build();
    }
}
