package com.techstore.repository.settings;

import com.techstore.entity.settings.StoreSettings;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StoreSettingsRepository extends JpaRepository<StoreSettings, String> {
    Optional<StoreSettings> findBySettingKey(String settingKey);
}
