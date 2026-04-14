package com.booking.booking_management.service;

import com.booking.booking_management.model.Booking;
import com.booking.booking_management.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking createBooking(Booking booking) {
        if (booking.getStatus() == null || booking.getStatus().isEmpty()) {
            booking.setStatus("PENDING");
        }
        return bookingRepository.save(booking);
    }

    public Booking updateBookingStatus(String id, String status) {
        return bookingRepository.findById(id).map(booking -> {
            booking.setStatus(status);
            return bookingRepository.save(booking);
        }).orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    public void deleteBooking(String id) {
        bookingRepository.deleteById(id);
    }
}
