package com.techstore.dto.address;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddressResponse {
    private Long id;
    private String receiverName;
    private String phone;
    private String detailedAddress;
    private String province;
    private String district;
    private String ward;
    private boolean isDefault;
}
