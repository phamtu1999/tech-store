package com.techstore.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserFilterRequest {
    private String search;
    private String role; // ROLE_CUSTOMER, ROLE_STAFF, ROLE_ADMIN, ROLE_SUPER_ADMIN
    private String status; // ACTIVE, LOCKED, UNVERIFIED
    private Boolean emailVerified;
    private Boolean twoFactorEnabled;
    private Integer page;
    private Integer size;
    private String sortBy; // createdAt, fullName, totalSpent
    private String sortDirection; // ASC, DESC
}
