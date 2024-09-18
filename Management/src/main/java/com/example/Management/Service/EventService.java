package com.example.Management.Service;

import com.example.Management.Client.FullResponse;
import com.example.Management.Client.User;
import com.example.Management.Client.Vendor;
import com.example.Management.Client.Venue;
import com.example.Management.Feign.UserClient;
import com.example.Management.Feign.VendorClient;
import com.example.Management.Feign.VenueClient;
import com.example.Management.Model.*;
import com.example.Management.Repository.EventRepository;
import com.example.Management.Repository.OrderRepository;
import com.example.Management.dto.EntityToDto;
import feign.Client;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
public class EventService {
    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private OrderNumberGenerator ong;

    @Autowired
    private VendorClient vendorClient;

    @Autowired
    private VenueClient venueClient;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserClient userClient;

    @Autowired
    private  EmailSenderService senderService;

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }


    public Event getEventById(Long id) {
        Optional<Event> eventOptional= eventRepository.findById(id);
        return eventOptional.orElse(null);
    }

    public void deleteEvent(Long id) {
        Optional<Event> eventOptional= eventRepository.findById(id);
        eventOptional.ifPresent(event -> eventRepository.delete(event));
    }


    public Event approveEvent(Long eventId) {
        Optional<Event> eventOptional= eventRepository.findById(eventId);
        if(eventOptional.isPresent()){
            Event event=eventOptional.get();
            event.setStatus(EventStatus.CONFIRMED);
            return eventRepository.save(event);
        }
        else{
            return null;
        }
    }

    public Event createEvent(Event event) {
        Event event1 = eventRepository.save(event);
        Order order = new Order();
        order.setOrderId(ong.generateOrderNumber(event1.getId()));
        order.setEventId(event.getId());
        orderRepository.save(order);
        if(event1.getVendorIds() != null){
            for(Long id : event1.getVendorIds()){
                vendorClient.addDate(id,event.getDate());
            }
        }
        if(event1.getVenueId() != null){
            venueClient.addDate(event.getVenueId(),event.getDate());
        }
        return event1;
    }

    public List<Event> getEventsByType(String eventType) {
        return eventRepository.findAllByType(eventType);
    }

    public List<Event> getEventsByDate(LocalDate eventDate) {
        return eventRepository.findAllByDate(eventDate);
    }

    public Event addGuestToEvent(Long eventId, List<Guest> guest) {
        Optional<Event> eventOptional= eventRepository.findById(eventId);
        if(eventOptional.isPresent()){
            Event event=eventOptional.get();
            event.getGuestList().addAll(guest);
            return eventRepository.save(event);
        }
        else{
            return null;
        }
    }

    public FullResponse eventDetails(Long eventId) {
        Optional<Event> eventOptional = eventRepository.findById(eventId);

        if (!eventOptional.isPresent()) {
            return null; // Event not found
        }

        Event event = eventOptional.get();
        FullResponse response = EntityToDto.eventToResponse(event);
        Float budget = 0f;
        Map<String, Float> vendorMap = new HashMap<>();

        if (event.getVendorIds() != null) {
            for (Long vendorId : event.getVendorIds()) {
                try {
                    ResponseEntity<Vendor> vendorResponse = vendorClient.getVendorById(vendorId);
                    if (vendorResponse.getBody() != null) {
                        Vendor vendor = vendorResponse.getBody();
                        vendorMap.put(vendor.getVendorName(), vendor.getRate());
                        budget += vendor.getRate();
                    } else {
                        // Handle case where vendor details are not found
                    }
                } catch (Exception e) {
                    // Handle exceptions from vendorClient calls
                    e.printStackTrace();
                }
            }
            response.setVendorMap(vendorMap);
        }

        response.setType(event.getType());

        try {
            ResponseEntity<String> usernameResponse = userClient.getUsername(event.getUserId());
            if (usernameResponse.getBody() != null) {
                response.setHost(usernameResponse.getBody());
            }
        } catch (Exception e) {
            // Handle exceptions from userClient calls
            e.printStackTrace();
        }

        if (event.getVenueId() != null) {
            try {
                ResponseEntity<Venue> venueResponse = venueClient.getVenueById(event.getVenueId());
                if (venueResponse.getBody() != null) {
                    Venue venue = venueResponse.getBody();
                    response.setAddress(venue.getAddress());
                    response.setVenue(venue.getVenueName());
                    response.setLocation(venue.getLocation());
                    budget += venue.getRent();
                }
            } catch (Exception e) {
                // Handle exceptions from venueClient calls
                e.printStackTrace();
            }
        }

        response.setPaymentStatus(event.getPaymentStatus());

        try {
            Optional<Order> orderOptional = orderRepository.findById(event.getId());
            if (orderOptional.isPresent()) {
                response.setOrderId(orderOptional.get().getOrderId());
            }
        } catch (Exception e) {
            // Handle exceptions from orderRepository calls
            e.printStackTrace();
        }

        response.setGuestList(event.getGuestList());
        response.setBudget(budget);

        return response;
    }



    public FullResponse sendOrder(Long eventId, Long vendorId) {
        Optional<Event> eventOptional= eventRepository.findById(eventId);
        if(eventOptional.isPresent()){
            Vendor vendor = vendorClient.getVendorById(vendorId).getBody();
            if(vendor !=null){
                Event event=eventOptional.get();
                FullResponse response=new FullResponse();
                response.setName(event.getName());

                response.setHost(userClient.getClient(event.getUserId()).getBody().get().getName());
                response.setDate(event.getDate());
                response.setOrderId(orderRepository.findById(event.getId()).get().getOrderId()+"-000" +vendorId);
                Venue venue = venueClient.getVenueById(event.getVenueId()).getBody();
                response.setAddress(venue.getAddress());
                response.setVenue(venue.getVenueName());
                response.setRate(vendor.getRate());
                response.setEmail(vendor.getVendorEmail());
                StringJoiner joiner = getStringJoiner(response, vendor);
                senderService.sendSimpleEmail(response.getEmail(), "Purchase Order",joiner.toString());
                return response;
            }
            else{
                return null;
            }
        }
        else{
            return null;
        }
    }


    private static StringJoiner getStringJoiner(FullResponse response, Vendor vendor) {
        StringJoiner joiner = new StringJoiner("\n");
        joiner.add("Purchase Order");
        joiner.add("====================");
        joiner.add("");
        joiner.add("Order Details:");
        joiner.add("--------------------");
        joiner.add("Order ID:        " + response.getOrderId());
        joiner.add("Event Name:      " + response.getName());
        joiner.add("Vendor Name:    " + vendor.getVendorName());
        joiner.add("Host:            " + response.getHost());
        joiner.add("Date:            " + response.getDate());
        joiner.add("");
        joiner.add("Venue Information:");
        joiner.add("--------------------");
        joiner.add("Venue:           " + response.getVenue());
        joiner.add("Address:         " + response.getAddress());
        joiner.add("");
        joiner.add("Vendor Details:");
        joiner.add("--------------------");
        joiner.add("Rate:            ₹" + response.getRate());
        joiner.add("");
        joiner.add("--------------------");
        joiner.add("Events & Co.");
        joiner.add("Manager");
        joiner.add("");
        joiner.add("Thank you for your business!");
        return joiner;
    }

    public FullResponse sendInvoice(Long eventId) {
        Optional<Event> eventOptional= eventRepository.findById(eventId);
        if(eventOptional.isPresent()){
            Event event=eventOptional.get();
            FullResponse response = EntityToDto.eventToResponse(event);
            Float budget = (float) 0;
            if(event.getVendorIds()!=null){
                Map<String, Float> vendorMap = new HashMap<>();
                for(Long vendorId: event.getVendorIds()){
                    Vendor vendor = vendorClient.getVendorById(vendorId).getBody();
                    vendorMap.put(vendor.getVendorName(), vendor.getRate());
                    budget+= vendor.getRate();
                }
                response.setVendorMap(vendorMap);
            }
            response.setType(event.getType());
            Venue venue = venueClient.getVenueById(event.getVenueId()).getBody();
            response.setAddress(venue.getAddress());
            response.setVenue(venue.getVenueName());
            response.setOrderId(orderRepository.findById(event.getId()).get().getOrderId());
            budget+=venue.getRent();
            response.setBudget(budget);
            User user = userClient.getClient(event.getUserId()).getBody().get();
            response.setHost(userClient.getUsername(user.getId()).getBody());
            response.setEmail(user.getEmail());
            response.setGuestList(event.getGuestList());
            String message =getInvoice(response).toString();
            senderService.sendSimpleEmail(response.getEmail(), "Invoice",message);
            return response;
        }
        else{
            return null;
        }
    }

    private StringJoiner getInvoice(FullResponse event) {
        StringJoiner joiner = new StringJoiner("\n");
        joiner.add("Invoice");
        joiner.add("====================");
        joiner.add("");
        joiner.add("Order Details:");
        joiner.add("--------------------");
        joiner.add("Order ID:        " + orderRepository.findById(event.getId()).get().getOrderId());
        joiner.add("Event Name:      " + event.getName());
        joiner.add("Host:            " + event.getHost());
        joiner.add("Date:            " + event.getDate());
        joiner.add("");
        joiner.add("Venue Information:");
        joiner.add("--------------------");
        Venue venue =venueClient.getVenueById(event.getVenueId()).getBody();
        joiner.add("Venue:           " + venue.getVenueName());
        joiner.add("Address:         " + venue.getAddress());
        joiner.add("");
        joiner.add("Vendors");
        joiner.add("--------------------");
        for (String value : event.getVendorMap().keySet()) {
            joiner.add(value); // Add each value to the joiner
        }
        joiner.add("--------------------");
        joiner.add("Estimated Budget:      ₹" + event.getBudget());
        return joiner;
    }

    public List<Event> getEventsByClientId(Long userId) {
        return eventRepository.findAllByUserId(userId);
    }

    public Event paymentUpdate(Long eventId) {
        Optional<Event> event = eventRepository.findById(eventId);
        if(event.isPresent()){
            event.get().setPaymentStatus(PaymentStatus.PAID);
            return eventRepository.save(event.get());
        }
        return null;
    }

    public List<Event> getEventsByPaymentStatus(PaymentStatus status) {
        return eventRepository.getEventsByPaymentStatus(status);
    }

    public List<Event> getEventsByStatus(EventStatus status) {
        return eventRepository.getEventsByStatus(status);
    }
}
