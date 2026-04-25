package com.techstore.service.auth;

import com.techstore.entity.user.Role;
import com.techstore.entity.user.User;
import com.techstore.repository.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PasswordServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private SecuritySettingsService securitySettingsService;

    @InjectMocks
    private PasswordService passwordService;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setFullName("Test User");
        user.setEmail("test@example.com");
        user.setPassword("encoded_password");
        user.setRole(Role.ROLE_USER);
        user.setId("user-1");
    }

    @Test
    void forgotPassword_ShouldGenerateToken_WhenUserExists() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));

        passwordService.forgotPassword("test@example.com");

        verify(userRepository).findByEmail("test@example.com");
    }

    @Test
    void resetPassword_ShouldThrowException_WhenTokenIsInvalid() {
        assertThrows(RuntimeException.class, () -> passwordService.resetPassword("invalid_token", "new_password"));
    }
}
