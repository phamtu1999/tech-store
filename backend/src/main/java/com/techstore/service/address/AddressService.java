package com.techstore.service.address;

import com.techstore.dto.address.AddressRequest;
import com.techstore.dto.address.AddressResponse;
import com.techstore.entity.address.Address;
import com.techstore.entity.user.User;
import com.techstore.exception.AppException;
import com.techstore.exception.ErrorCode;
import com.techstore.repository.address.AddressRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AddressService {

    private final AddressRepository addressRepository;

    public List<AddressResponse> getMyAddresses(User user) {
        return addressRepository.findByUser(user).stream()
                .map(this::mapToAddressResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public AddressResponse addAddress(User user, AddressRequest request) {
        if (request.isDefault()) {
            resetDefaultAddresses(user);
        }

        Address address = Address.builder()
                .user(user)
                .receiverName(request.getReceiverName())
                .phone(request.getPhone())
                .detailedAddress(request.getDetailedAddress())
                .province(request.getProvince())
                .district(request.getDistrict())
                .ward(request.getWard())
                .isDefault(request.isDefault() || addressRepository.findByUser(user).isEmpty())
                .build();

        return mapToAddressResponse(addressRepository.save(address));
    }

    @Transactional
    public AddressResponse updateAddress(User user, Long addressId, AddressRequest request) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new AppException(ErrorCode.ENTITY_NOT_FOUND));

        if (!address.getUser().getId().equals(user.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        if (request.isDefault() && !address.isDefault()) {
            resetDefaultAddresses(user);
        }

        address.setReceiverName(request.getReceiverName());
        address.setPhone(request.getPhone());
        address.setDetailedAddress(request.getDetailedAddress());
        address.setProvince(request.getProvince());
        address.setDistrict(request.getDistrict());
        address.setWard(request.getWard());
        address.setDefault(request.isDefault());

        return mapToAddressResponse(addressRepository.save(address));
    }

    @Transactional
    public void deleteAddress(User user, Long addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new AppException(ErrorCode.ENTITY_NOT_FOUND));

        if (!address.getUser().getId().equals(user.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        addressRepository.delete(address);

        // If deleted address was default, set another one as default
        if (address.isDefault()) {
            List<Address> addresses = addressRepository.findByUser(user);
            if (!addresses.isEmpty()) {
                addresses.get(0).setDefault(true);
                addressRepository.save(addresses.get(0));
            }
        }
    }

    @Transactional
    public void setDefaultAddress(User user, Long addressId) {
        resetDefaultAddresses(user);
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new AppException(ErrorCode.ENTITY_NOT_FOUND));
        
        if (!address.getUser().getId().equals(user.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        address.setDefault(true);
        addressRepository.save(address);
    }

    private void resetDefaultAddresses(User user) {
        List<Address> addresses = addressRepository.findByUser(user);
        addresses.forEach(a -> a.setDefault(false));
        addressRepository.saveAll(addresses);
    }

    private AddressResponse mapToAddressResponse(Address address) {
        return AddressResponse.builder()
                .id(address.getId())
                .receiverName(address.getReceiverName())
                .phone(address.getPhone())
                .detailedAddress(address.getDetailedAddress())
                .province(address.getProvince())
                .district(address.getDistrict())
                .ward(address.getWard())
                .isDefault(address.isDefault())
                .build();
    }
}
