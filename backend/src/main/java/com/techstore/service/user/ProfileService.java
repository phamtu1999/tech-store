package com.techstore.service.user;

import com.techstore.dto.user.ProfileResponse;
import com.techstore.dto.user.ProfileUpdateRequest;
import com.techstore.entity.user.User;
import com.techstore.repository.user.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public ProfileResponse getProfile(User user) {
        return ProfileResponse.builder()
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .avatarUrl(user.getAvatarUrl())
                .gender(user.getGender() != null ? user.getGender().name() : null)
                .dateOfBirth(user.getDateOfBirth())
                .createdAt(user.getCreatedAt())
                .build();
    }

    @Transactional
    public ProfileResponse updateProfile(User user, ProfileUpdateRequest request) {
        User existingUser = userRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getFullName() != null) existingUser.setFullName(request.getFullName());
        if (request.getPhone() != null) existingUser.setPhone(request.getPhone());
        if (request.getAvatarUrl() != null) existingUser.setAvatarUrl(request.getAvatarUrl());
        if (request.getGender() != null) existingUser.setGender(request.getGender());
        if (request.getDateOfBirth() != null) existingUser.setDateOfBirth(request.getDateOfBirth());

        User updatedUser = userRepository.save(existingUser);
        return getProfile(updatedUser);
    }

    @Transactional
    public void changePassword(User user, String oldPassword, String newPassword) {
        User existingUser = userRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(oldPassword, existingUser.getPassword())) {
            throw new RuntimeException("Old password does not match");
        }

        existingUser.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(existingUser);
    }
}
