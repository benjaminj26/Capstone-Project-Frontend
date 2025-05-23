package com.example.ClientService.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.ClientService.Exceptions.VendorNotFoundException;
import com.example.ClientService.Exceptions.VendorServiceException;
import com.example.ClientService.controller.CloudinaryConfig;
import com.example.ClientService.dtos.VendorRegistrationDto;
import com.example.ClientService.model.Vendor;
import com.example.ClientService.model.VendorStatus;
import com.example.ClientService.repository.VendorRepository;
import com.example.ClientService.utils.AppUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.dao.DataIntegrityViolationException;

import java.io.IOException;
import java.sql.Date;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class VendorService {

    @Autowired
    private AppUtils appUtils;
    @Autowired
    private VendorRepository vendorRepository;

    @Autowired
    private Cloudinary cloudinary;
    public Vendor addVendor(VendorRegistrationDto vendorRegistrationDto) {
        try {
            Vendor newVendor = appUtils.mapToVendor(vendorRegistrationDto);
            List<String> imageUrls = new ArrayList<>();

            // Upload images to Cloudinary
            if (vendorRegistrationDto.getImages() != null && !vendorRegistrationDto.getImages().isEmpty()) {
                for (MultipartFile imageFile : vendorRegistrationDto.getImages()) {
                    if (!imageFile.isEmpty()) {
                        String imageUrl = uploadImageToCloudinary(imageFile);
                        imageUrls.add(imageUrl);
                    }
                }
            }

            newVendor.setImages(imageUrls);
            newVendor.setStatus(VendorStatus.PENDING);
            return vendorRepository.save(newVendor);
        } catch (DataIntegrityViolationException e) {
            throw new VendorServiceException("Vendor data violates a unique constraint", e);
        } catch (IllegalArgumentException e) {
            throw new VendorServiceException("Invalid vendor data provided", e);
        } catch (Exception e) {
            throw new VendorServiceException("An unexpected error occurred while adding a vendor", e);
        }
    }

    public String uploadImageToCloudinary(MultipartFile imageFile) {
        try {
            Map<String, Object> uploadResult = cloudinary.uploader().upload(imageFile.getBytes(), ObjectUtils.emptyMap());
            return (String) uploadResult.get("secure_url");
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload image to Cloudinary", e);
        }
    }


    public List<Vendor> getAvailableVendor(Date date) {
        try {
            List<Vendor> availableVendors = vendorRepository.findAvailableVendorsByDate(date);
            if (availableVendors.isEmpty()) {
                throw new VendorNotFoundException("No vendors available on the specified date");
            }
            return availableVendors;
        } catch (Exception e) {
            throw new VendorServiceException("An unexpected error occurred while retrieving available vendors", e);
        }
    }

    public List<Vendor> getVendorByType(String type) {
        try {
            List<Vendor> vendors = vendorRepository.findVendorsByType(type);
            if (vendors.isEmpty()) {
                throw new VendorNotFoundException("No vendors found for the specified type");
            }
            return vendors;
        } catch (Exception e) {
            throw new VendorServiceException("An unexpected error occurred while retrieving vendors by type", e);
        }
    }

    public List<Vendor> getVendorsByChoice(String location, Date date, String type) {
        try {
            List<Vendor> vendors;
            if (type == null) {
                vendors = vendorRepository.findVendorsByLocationAndDate(location, date);
            } else {
                vendors = vendorRepository.findVendorsByLocationAndDateAndType(location, date, type);
            }
            if (vendors.isEmpty()) {
                throw new VendorNotFoundException("No vendors found matching the specified criteria");
            }
            return vendors;
        } catch (VendorNotFoundException e) {
            // Specific handling for no vendors found
            throw e; // Rethrow or handle as needed
        } catch (Exception e) {
            // General error handling
            throw new VendorServiceException("An unexpected error occurred while retrieving vendors by choice", e);
        }
    }

    public List<Vendor> getAllVendors() {
        try {
            List<Vendor> vendors = vendorRepository.findAll();
            if (vendors.isEmpty()) {
                throw new VendorNotFoundException("No vendors available");
            }
            return vendors;
        } catch (Exception e) {
            throw new VendorServiceException("An unexpected error occurred while retrieving all vendors", e);
        }
    }

    public Vendor createVendor(Vendor vendor) {
        try {
            return vendorRepository.save(vendor);
        } catch (DataIntegrityViolationException e) {
            throw new VendorServiceException("Vendor data violates a unique constraint", e);
        } catch (Exception e) {
            throw new VendorServiceException("An unexpected error occurred while creating a vendor", e);
        }
    }

    public Boolean deleteVendor(Long id) {
        vendorRepository.deleteById(id);
        return true;
    }

    public Vendor getVendorById(Long vendorId) {
        try {
            return vendorRepository.findById(vendorId)
                    .orElseThrow(() -> new VendorNotFoundException("Vendor not found with the provided ID"));
        } catch (Exception e) {
            throw new VendorServiceException("An unexpected error occurred while retrieving the vendor by ID", e);
        }
    }

    public Vendor addDate(Long vendorId, Date date) {
        try {
            Vendor vendor = vendorRepository.findById(vendorId)
                    .orElseThrow(() -> new VendorNotFoundException("Vendor not found with the provided ID"));
            vendor.getBookedDates().add(date);
            return vendorRepository.save(vendor);
        } catch (Exception e) {
            throw new VendorServiceException("An unexpected error occurred while adding the date to the vendor", e);
        }
    }

    public List<Vendor> getVendorsByStatus(VendorStatus status) {
        return vendorRepository.getVendorsByStatus(status);
    }

    public Vendor approveVendor(Long vendorId) {
        try {
            Vendor vendor = vendorRepository.findById(vendorId)
                   .orElseThrow(() -> new VendorNotFoundException("Vendor not found with the provided ID"));
            vendor.setStatus(VendorStatus.APPROVED);
            return vendorRepository.save(vendor);
        } catch (Exception e) {
            throw new VendorServiceException("An unexpected error occurred while approving the vendor", e);
        }
    }

    public List<Vendor> addVendors(List<Vendor> vendors) {
        return vendorRepository.saveAll(vendors);
    }
}
