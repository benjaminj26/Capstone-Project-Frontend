package com.example.ClientService.repository;

import com.example.ClientService.model.Vendor;
import com.example.ClientService.model.VendorStatus;
import feign.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.sql.Date;
import java.util.List;

public interface VendorRepository extends JpaRepository<Vendor,Long> {
    @Query("SELECT v FROM Vendor v WHERE :date NOT MEMBER OF v.bookedDates")
    List<Vendor> findAvailableVendorsByDate(Date date);

    List<Vendor> findVendorsByType(String type);

    @Query("SELECT v FROM Vendor v WHERE v.vendorLocation = :location AND :date NOT MEMBER OF v.bookedDates AND v.status = 'APPROVED'")
    List<Vendor> findVendorsByLocationAndDate(@Param("location") String location, @Param("date") Date date);

    @Query("SELECT v FROM Vendor v WHERE v.vendorLocation = :location AND :date NOT MEMBER OF v.bookedDates AND v.status = 'APPROVED' AND v.type = :type")
    List<Vendor> findVendorsByLocationAndDateAndType(@Param("location") String location, @Param("date") Date date, @Param("type") String type);

    List<Vendor> getVendorsByStatus(VendorStatus status);
}
