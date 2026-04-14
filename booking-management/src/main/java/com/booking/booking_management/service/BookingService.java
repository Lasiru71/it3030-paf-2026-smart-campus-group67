package com.booking.booking_management.service;

import com.booking.booking_management.model.Booking;
import com.booking.booking_management.model.Resource;
import com.booking.booking_management.repository.BookingRepository;
import com.booking.booking_management.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ResourceRepository resourceRepository;

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking createBooking(Booking booking) {
        if (booking.getStatus() == null || booking.getStatus().isEmpty()) {
            booking.setStatus("PENDING");
        }
        
        // Auto-deduct seats
        resourceRepository.findById(booking.getResourceId()).ifPresent(res -> {
            int newSpaces = Math.max(0, res.getAvailableSpaces() - booking.getMembers());
            res.setAvailableSpaces(newSpaces);
            if (newSpaces == 0) res.setStatus("Booked");
            resourceRepository.save(res);
        });

        return bookingRepository.save(booking);
    }

    public Booking updateBookingStatus(String id, String status) {
        return bookingRepository.findById(id).map(booking -> {
            String oldStatus = booking.getStatus();
            booking.setStatus(status);
            
            // If rejected, restore seats
            if ("REJECTED".equals(status) && !"REJECTED".equals(oldStatus)) {
                resourceRepository.findById(booking.getResourceId()).ifPresent(res -> {
                    res.setAvailableSpaces(res.getAvailableSpaces() + booking.getMembers());
                    if (res.getAvailableSpaces() > 0 && "Booked".equals(res.getStatus())) {
                        res.setStatus("Available");
                    }
                    resourceRepository.save(res);
                });
            }
            
            return bookingRepository.save(booking);
        }).orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    public void deleteBooking(String id) {
        bookingRepository.findById(id).ifPresent(booking -> {
            // Restore seats on deletion if it wasn't already rejected
            if (!"REJECTED".equals(booking.getStatus())) {
                resourceRepository.findById(booking.getResourceId()).ifPresent(res -> {
                    res.setAvailableSpaces(res.getAvailableSpaces() + booking.getMembers());
                    if (res.getAvailableSpaces() > 0 && "Booked".equals(res.getStatus())) {
                        res.setStatus("Available");
                    }
                    resourceRepository.save(res);
                });
            }
            bookingRepository.deleteById(id);
        });
    }
}
