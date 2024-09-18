package com.example.Management.Repository;

import com.example.Management.Model.Event;
import com.example.Management.Model.EventStatus;
import com.example.Management.Model.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface EventRepository extends JpaRepository<Event,Long> {

    List<Event> findAllByType(String type);

    List<Event> findAllByDate(Date eventDate);

    List<Event> findAllByDate(LocalDate eventDate);

    List<Event> findAllByUserId(Long userId);

    List<Event> getEventsByPaymentStatus(PaymentStatus status);

    List<Event> getEventsByStatus(EventStatus status);
}
