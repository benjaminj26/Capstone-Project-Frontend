package com.example.Management.Client;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Generated;
import lombok.NoArgsConstructor;

import java.sql.Date;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vendor{
    private Long vendorId;
    private String vendorName;
    private String vendorEmail;
    private String vendorPhone;
    private String vendorLocation;
    private String type;
    private Float rate;
    private List<Date> bookedDates;
    private List<String> images;
    private VendorStatus status;
}
