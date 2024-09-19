package com.example.ClientService.dtos;

import com.example.ClientService.model.VendorStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.sql.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VendorRegistrationDto {
    private String vendorName;
    private String vendorEmail;
    private String vendorPhone;
    private String vendorLocation;
    private String type;
    private Float rate;
//    private List<String> images;
    private VendorStatus status;
    private List<MultipartFile> images;
}
