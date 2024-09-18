package com.example.ClientService.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Vendor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long vendorId;
    private String vendorName;
    private String vendorEmail;
    private String vendorPhone;
    private String vendorLocation;
    private String type;
    private Float rate;
    @ElementCollection
    private List<Date> bookedDates;
    @ElementCollection
    @CollectionTable(name = "vendor_images", joinColumns = @JoinColumn(name = "vendor_id"))
    @Column(name = "image_url")
    private List<String> images;
    @Enumerated(EnumType.STRING)
    private VendorStatus status=VendorStatus.PENDING;


}
