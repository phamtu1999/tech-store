package com.techstore.controller.address;

import com.techstore.dto.address.AddressRequest;
import com.techstore.dto.address.AddressResponse;
import com.techstore.dto.ApiResponse;
import com.techstore.entity.address.Address;
import com.techstore.entity.user.User;
import com.techstore.service.address.AddressService;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    @GetMapping
    public ApiResponse<List<AddressResponse>> getMyAddresses(@AuthenticationPrincipal User user) {
        return ApiResponse.<List<AddressResponse>>builder()
                .result(addressService.getMyAddresses(user))
                .build();
    }

    @PostMapping
    public ApiResponse<AddressResponse> addAddress(@AuthenticationPrincipal User user, @RequestBody AddressRequest request) {
        return ApiResponse.<AddressResponse>builder()
                .result(addressService.addAddress(user, request))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<AddressResponse> updateAddress(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @RequestBody AddressRequest request
    ) {
        return ApiResponse.<AddressResponse>builder()
                .result(addressService.updateAddress(user, id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteAddress(@AuthenticationPrincipal User user, @PathVariable Long id) {
        addressService.deleteAddress(user, id);
        return ApiResponse.<Void>builder()
                .message("Address deleted successfully")
                .build();
    }

    @PatchMapping("/{id}/default")
    public ApiResponse<Void> setDefaultAddress(@AuthenticationPrincipal User user, @PathVariable Long id) {
        addressService.setDefaultAddress(user, id);
        return ApiResponse.<Void>builder()
                .message("Default address updated successfully")
                .build();
    }
}
