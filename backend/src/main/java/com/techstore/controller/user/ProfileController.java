package com.techstore.controller.user;

import com.techstore.dto.ApiResponse;
import com.techstore.dto.auth.ChangePasswordRequest;
import com.techstore.dto.user.ProfileResponse;
import com.techstore.dto.user.ProfileUpdateRequest;
import com.techstore.entity.user.User;
import com.techstore.service.user.ProfileService;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping
    public ApiResponse<ProfileResponse> getMyProfile(@AuthenticationPrincipal User user) {
        return ApiResponse.<ProfileResponse>builder()
                .result(profileService.getProfile(user))
                .build();
    }

    @PutMapping
    public ApiResponse<ProfileResponse> updateProfile(
            @AuthenticationPrincipal User user,
            @RequestBody ProfileUpdateRequest request
    ) {
        return ApiResponse.<ProfileResponse>builder()
                .result(profileService.updateProfile(user, request))
                .build();
    }

    @PostMapping("/change-password")
    public ApiResponse<Void> changePassword(
            @AuthenticationPrincipal User user,
            @RequestBody ChangePasswordRequest request
    ) {
        profileService.changePassword(user, request.getOldPassword(), request.getNewPassword());
        return ApiResponse.<Void>builder()
                .message("Password changed successfully")
                .build();
    }
}
