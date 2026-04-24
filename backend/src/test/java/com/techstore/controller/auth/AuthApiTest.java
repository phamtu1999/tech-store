package com.techstore.controller.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.techstore.dto.auth.AuthRequest;
import com.techstore.entity.user.User;
import com.techstore.entity.user.UserStatus;
import com.techstore.repository.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class AuthApiTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        // Create user for login testing
        userRepository.save(User.builder()
                .email("api@test.com")
                .fullName("API Tester")
                .password(passwordEncoder.encode("password123"))
                .role(com.techstore.entity.user.Role.ROLE_USER)
                .status(UserStatus.ACTIVE)
                .active(true)
                .emailVerified(true)
                .build());
    }

    @Test
    void login_Success_ReturnsTokens() throws Exception {
        AuthRequest request = new AuthRequest();
        request.setEmail("api@test.com");
        request.setPassword("password123");

        mockMvc.perform(post("/api/v1/auth/authenticate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.result.token").exists())
                .andExpect(jsonPath("$.result.refreshToken").exists());
    }

    @Test
    void login_Fail_InvalidPassword() throws Exception {
        AuthRequest request = new AuthRequest();
        request.setEmail("api@test.com");
        request.setPassword("wrong_pass");

        mockMvc.perform(post("/api/v1/auth/authenticate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                // Depending on your GlobalExceptionHandler, this might be 401 or 400
                .andExpect(status().isUnauthorized()); 
    }

    @Test
    void accessProfile_WithoutToken_Returns401() throws Exception {
        mockMvc.perform(get("/api/v1/profile"))
                .andExpect(status().isUnauthorized());
    }
}
