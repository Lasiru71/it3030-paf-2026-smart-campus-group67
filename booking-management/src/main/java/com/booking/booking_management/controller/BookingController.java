package com.booking.booking_management.controller;

import com.booking.booking_management.model.Booking;
import com.booking.booking_management.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'TECHNICIAN')")
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public Booking createBooking(@RequestBody Booking booking) {
        return bookingService.createBooking(booking);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('USER', 'TECHNICIAN', 'ADMIN')")
    public Booking updateBookingStatus(@PathVariable String id, @RequestBody Map<String, String> statusUpdate) {
        String status = statusUpdate.get("status");
        System.out.println(">>> REQUEST ARRIVED: updateBookingStatus for ID=" + id + " Status=" + status);
        try {
            return bookingService.updateBookingStatus(id, status);
        } catch (Exception e) {
            System.err.println(">>> ERROR in updateBookingStatus: " + e.getMessage());
            throw e;
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public String deleteBooking(@PathVariable String id) {
        bookingService.deleteBooking(id);
        return "Booking " + id + " deleted by Administrator.";
    }

    @PatchMapping("/{id}/message")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public Booking updateBookingMessage(@PathVariable String id, @RequestBody Map<String, String> messageUpdate) {
        return bookingService.updateBookingMessage(id, messageUpdate.get("message"));
    }
}
