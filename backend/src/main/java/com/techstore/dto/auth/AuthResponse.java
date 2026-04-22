package com.techstore.dto.auth;

import com.techstore.entity.user.Role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String token;
    private String sessionId;
    private String id;
    private String email;
    private String fullName;
    private String phone;
    private Role role;
}
