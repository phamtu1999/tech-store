package com.techstore.dto.settings;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StoreSettingsRequest {
    private String storeName;
    private String logoUrl;
    private String supportEmail;
    private String hotlinePhone;
    private String address;
}
