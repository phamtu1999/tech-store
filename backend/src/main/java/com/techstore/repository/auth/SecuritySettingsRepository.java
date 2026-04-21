package com.techstore.repository.auth;

import com.techstore.entity.auth.SecuritySettings;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SecuritySettingsRepository extends JpaRepository<SecuritySettings, String> {
}
