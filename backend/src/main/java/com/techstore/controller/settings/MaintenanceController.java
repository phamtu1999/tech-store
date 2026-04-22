package com.techstore.controller.settings;

import com.techstore.service.settings.MaintenanceService;


import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/maintenance")
@RequiredArgsConstructor
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    @PostMapping("/populate-specs")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public String populateSpecs() {
        return maintenanceService.populateAllProductSpecs();
    }
}
