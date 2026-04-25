package com.techstore.service.auth;

import com.techstore.dto.auth.AuthRequest;
import com.techstore.dto.auth.AuthResponse;
import com.techstore.dto.auth.RegisterRequest;
import com.techstore.entity.auth.ActiveSession;
import com.techstore.entity.user.Role;
import com.techstore.entity.user.User;
import com.techstore.repository.user.UserRepository;
import com.techstore.security.JwtService;
import com.techstore.service.notification.NotificationService;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthenticationServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtService jwtService;
    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private NotificationService notificationService;
    @Mock
    private LoginHistoryService loginHistoryService;
    @Mock
    private SessionManagementService sessionManagementService;
    @Mock
    private SecuritySettingsService securitySettingsService;
    @Mock
    private HttpServletRequest request;

    @InjectMocks
    private AuthenticationService authService;

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
    void register_ShouldCreateUserAndReturnAuthResponse() {
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setEmail("test@example.com");
        registerRequest.setPassword("password123");
        registerRequest.setFullName("Test User");

        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encoded_password");
        when(request.getRemoteAddr()).thenReturn("127.0.0.1");
        when(request.getHeader("User-Agent")).thenReturn("Mozilla/5.0");
        
        ActiveSession session = ActiveSession.builder().sessionId(UUID.randomUUID().toString()).build();
        when(sessionManagementService.saveSession(any())).thenReturn(session);
        when(jwtService.generateToken(any(), any())).thenReturn("jwt_token");
        when(jwtService.generateRefreshToken(any())).thenReturn("refresh_token");

        AuthResponse response = authService.register(registerRequest, request);

        assertNotNull(response);
        assertEquals("test@example.com", response.getEmail());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void register_ShouldThrowException_WhenEmailExists() {
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setEmail("test@example.com");

        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);

        assertThrows(RuntimeException.class, () -> authService.register(registerRequest, request));
    }

    @Test
    void authenticate_ShouldReturnAuthResponse_WhenCredentialsAreValid() {
        AuthRequest authRequest = new AuthRequest();
        authRequest.setEmail("test@example.com");
        authRequest.setPassword("password123");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(null);
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(request.getRemoteAddr()).thenReturn("127.0.0.1");
        when(request.getHeader("User-Agent")).thenReturn("Mozilla/5.0");

        ActiveSession session = ActiveSession.builder().sessionId(UUID.randomUUID().toString()).build();
        when(sessionManagementService.saveSession(any())).thenReturn(session);
        when(jwtService.generateToken(any(), any())).thenReturn("jwt_token");
        when(jwtService.generateRefreshToken(any())).thenReturn("refresh_token");

        AuthResponse response = authService.authenticate(authRequest, request);

        assertNotNull(response);
        assertEquals("jwt_token", response.getToken());
        verify(loginHistoryService).recordLoginAttempt(anyString(), anyString(), anyString(), any(), any());
    }

    @Test
    void authenticate_ShouldThrowException_WhenUserNotFound() {
        AuthRequest authRequest = new AuthRequest();
        authRequest.setEmail("unknown@example.com");
        authRequest.setPassword("password");

        when(authenticationManager.authenticate(any())).thenThrow(new RuntimeException("Bad credentials"));
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> authService.authenticate(authRequest, request));
    }

    @Test
    void refreshToken_ShouldReturnNewResponse_WhenTokenIsValid() {
        String refreshToken = "valid_refresh_token";
        when(jwtService.extractUsername(refreshToken)).thenReturn("test@example.com");
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(jwtService.isTokenValid(refreshToken, user)).thenReturn(true);
        when(request.getRemoteAddr()).thenReturn("127.0.0.1");
        when(request.getHeader("User-Agent")).thenReturn("Mozilla/5.0");
        
        ActiveSession session = ActiveSession.builder().sessionId("session-123").build();
        when(sessionManagementService.saveSession(any())).thenReturn(session);
        when(jwtService.generateToken(any(), any())).thenReturn("new_access_token");

        AuthResponse response = authService.refreshToken(refreshToken, request);

        assertNotNull(response);
        assertEquals("new_access_token", response.getToken());
    }

    @Test
    void refreshToken_ShouldThrowException_WhenTokenIsInvalid() {
        String refreshToken = "invalid_token";
        when(jwtService.extractUsername(refreshToken)).thenReturn("test@example.com");
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(jwtService.isTokenValid(refreshToken, user)).thenReturn(false);

        assertThrows(RuntimeException.class, () -> authService.refreshToken(refreshToken, request));
    }
}
