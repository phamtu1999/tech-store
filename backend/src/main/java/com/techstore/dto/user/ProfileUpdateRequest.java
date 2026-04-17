package com.techstore.dto.user;

import com.techstore.entity.user.Gender;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileUpdateRequest {
    private String fullName;
    private String phone;
    private String avatarUrl;
    private Gender gender;
    private LocalDate dateOfBirth;
}
