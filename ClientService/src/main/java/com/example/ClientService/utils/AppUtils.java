package com.example.ClientService.utils;

import com.example.ClientService.dtos.VendorRegistrationDto;
import com.example.ClientService.model.Vendor;
import org.springframework.stereotype.Component;

@Component
public class AppUtils {
    public Vendor mapToVendor(VendorRegistrationDto vendorRegistrationDto) {
        if (vendorRegistrationDto == null) {
            return null;
        } else {
            return new Vendor(
                    null,  // Assuming the ID is auto-generated
                    vendorRegistrationDto.getVendorName(),
                    vendorRegistrationDto.getVendorEmail(),
                    vendorRegistrationDto.getVendorPhone(),
                    vendorRegistrationDto.getVendorLocation(),
                    vendorRegistrationDto.getType(),
                    vendorRegistrationDto.getRate(),
                    null,  // Assuming you want to initialize imageUrls to null here; it'll be set later
                    null,  // Placeholder for image URLs; this will be populated after upload
                    vendorRegistrationDto.getStatus()
            );
        }
    }

}
