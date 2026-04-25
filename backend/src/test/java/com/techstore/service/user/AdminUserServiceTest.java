package com.techstore.service.user;

import com.techstore.dto.user.UserCreationRequest;
import com.techstore.entity.user.Role;
import com.techstore.entity.user.User;
import com.techstore.entity.user.UserStatus;
import com.techstore.exception.AppException;
import com.techstore.repository.order.OrderRepository;
import com.techstore.repository.user.UserRepository;
import com.techstore.service.auth.SessionCommandService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminUserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private SessionCommandService sessionCommandService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AdminUserService adminUserService;

    private User user;
    private UserCreationRequest creationRequest;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId("U1");
        user.setEmail("test@techstore.com");
        user.setFullName("Test User");
        user.setRole(Role.ROLE_USER);
        user.setStatus(UserStatus.ACTIVE);
        user.setDeleted(false);

        creationRequest = new UserCreationRequest();
        creationRequest.setEmail("new@techstore.com");
        creationRequest.setFullName("New User");
        creationRequest.setPassword("password");
        creationRequest.setPhone("0123456789");
        creationRequest.setRole("ROLE_USER");
    }

    @Test
    void createUser_ShouldSaveUser() {
        when(userRepository.existsByEmail(any())).thenReturn(false);
        when(passwordEncoder.encode(any())).thenReturn("hashed_password");

        adminUserService.createUser(creationRequest);

        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void createUser_ShouldThrowIfExisted() {
        when(userRepository.existsByEmail(any())).thenReturn(true);

        assertThrows(AppException.class, () -> adminUserService.createUser(creationRequest));
    }

    @Test
    void toggleStatus_ShouldLockActiveUser() {
        when(userRepository.findById("U1")).thenReturn(Optional.of(user));

        adminUserService.toggleStatus("U1");

        assertEquals(UserStatus.LOCKED, user.getStatus());
        assertFalse(user.isActive());
        verify(sessionCommandService, times(1)).terminateAllSessionsForUser("U1", false, null);
    }

    @Test
    void toggleStatus_ShouldUnlockLockedUser() {
        user.setStatus(UserStatus.LOCKED);
        user.setActive(false);
        when(userRepository.findById("U1")).thenReturn(Optional.of(user));

        adminUserService.toggleStatus("U1");

        assertEquals(UserStatus.ACTIVE, user.getStatus());
        assertTrue(user.isActive());
    }

    @Test
    void deleteUser_ShouldSoftDeleteWhenNoOrders() {
        when(userRepository.findById("U1")).thenReturn(Optional.of(user));
        when(userRepository.countOrdersByUserId("U1")).thenReturn(0L);

        adminUserService.deleteUser("U1");

        assertTrue(user.getDeleted());
        assertFalse(user.isActive());
        verify(sessionCommandService, times(1)).terminateAllSessionsForUser("U1", false, null);
    }

    @Test
    void deleteUser_ShouldThrowIfHasOrders() {
        when(userRepository.findById("U1")).thenReturn(Optional.of(user));
        when(userRepository.countOrdersByUserId("U1")).thenReturn(5L);

        assertThrows(AppException.class, () -> adminUserService.deleteUser("U1"));
    }

    @Test
    void resetPassword_ShouldUpdatePassword() {
        when(userRepository.findById("U1")).thenReturn(Optional.of(user));
        when(passwordEncoder.encode("new_pass")).thenReturn("new_hashed_pass");

        adminUserService.resetPassword("U1", "new_pass");

        assertEquals("new_hashed_pass", user.getPassword());
        verify(sessionCommandService, times(1)).terminateAllSessionsForUser("U1", false, null);
    }
}
