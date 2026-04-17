package com.techstore.entity.settings;

import com.techstore.entity.base.BaseEntity;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "store_settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StoreSettings extends BaseEntity {

    @Column(name = "store_name")
    private String storeName;

    @Column(name = "logo_url")
    private String logoUrl;

    @Column(name = "support_email")
    private String supportEmail;

    @Column(name = "hotline_phone")
    private String hotlinePhone;

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    @Column(name = "setting_key", unique = true)
    private String settingKey;
}
