package com.techstore.controller.user;

import com.techstore.dto.ApiResponse;
import com.techstore.dto.user.UserCreationRequest;
import com.techstore.dto.user.UserFilterRequest;
import com.techstore.dto.user.UserResponse;
import com.techstore.service.user.AdminUserService;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminUserService adminUserService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ApiResponse<Void> createUser(@RequestBody UserCreationRequest request) {
        adminUserService.createUser(request);
        return ApiResponse.<Void>builder()
                .message("User created successfully")
                .build();
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ApiResponse<List<UserResponse>> getAllUsers() {
        return ApiResponse.<List<UserResponse>>builder()
                .result(adminUserService.getAllUsers())
                .build();
    }

    @PostMapping("/filter")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ApiResponse<Page<UserResponse>> filterUsers(@RequestBody UserFilterRequest filter) {
        return ApiResponse.<Page<UserResponse>>builder()
                .result(adminUserService.getAllUsers(filter))
                .build();
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ApiResponse<Void> toggleStatus(@PathVariable Long id) {
        adminUserService.toggleStatus(id);
        return ApiResponse.<Void>builder()
                .message("User status updated successfully")
                .build();
    }

    @PutMapping("/{id}/lock")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ApiResponse<Void> lockUser(@PathVariable Long id) {
        adminUserService.lockUser(id);
        return ApiResponse.<Void>builder()
                .message("User locked successfully")
                .build();
    }

    @PutMapping("/{id}/unlock")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ApiResponse<Void> unlockUser(@PathVariable Long id) {
        adminUserService.unlockUser(id);
        return ApiResponse.<Void>builder()
                .message("User unlocked successfully")
                .build();
    }

    @PutMapping("/{id}/role")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ApiResponse<Void> updateRole(@PathVariable Long id, @RequestParam String role) {
        adminUserService.updateRole(id, role);
        return ApiResponse.<Void>builder()
                .message("User role updated successfully")
                .build();
    }

    @PutMapping("/{id}/password")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ApiResponse<Void> resetPassword(@PathVariable Long id, @RequestParam String newPassword) {
        adminUserService.resetPassword(id, newPassword);
        return ApiResponse.<Void>builder()
                .message("User password reset successfully")
                .build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ApiResponse<Void> deleteUser(@PathVariable Long id) {
        adminUserService.deleteUser(id);
        return ApiResponse.<Void>builder()
                .message("User deleted successfully")
                .build();
    }
}

