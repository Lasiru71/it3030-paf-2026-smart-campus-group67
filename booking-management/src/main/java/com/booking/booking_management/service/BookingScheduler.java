package com.booking.booking_management.service;

import com.booking.booking_management.model.Booking;
import com.booking.booking_management.repository.BookingRepository;
import com.booking.booking_management.repository.ResourceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class BookingScheduler {

    private static final Logger logger = LoggerFactory.getLogger(BookingScheduler.class);

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ResourceRepository resourceRepository;

    /**
     * Periodically checks for bookings that have reached their booking date
     * but haven't had their seats deducted from the resource yet.
     * Runs every minute.
     */
    @Scheduled(fixedRate = 60000)
    public void processPendingDeductions() {
        String today = LocalDate.now().toString();
        List<Booking> pendingBookings = bookingRepository.findByBookingDateLessThanEqualAndSeatsDeductedFalse(today);

        if (!pendingBookings.isEmpty()) {
            logger.info("Processing {} pending seat deductions...", pendingBookings.size());
        }

        for (Booking booking : pendingBookings) {
            // We only deduct seats for non-REJECTED bookings
            if (!"REJECTED".equals(booking.getStatus())) {
                resourceRepository.findById(booking.getResourceId()).ifPresent(resource -> {
                    int requestedSeats = booking.getMembers();
                    int currentAvailable = resource.getAvailableSpaces();
                    
                    // Deduct seats
                    int newAvailable = Math.max(0, currentAvailable - requestedSeats);
                    resource.setAvailableSpaces(newAvailable);
                    
                    if (newAvailable == 0) {
                        resource.setStatus("Booked");
                    }
                    
                    resourceRepository.save(resource);
                    booking.setSeatsDeducted(true);
                    bookingRepository.save(booking);
                    
                    logger.info("Automatically deducted {} seats for booking {} on resource {}", 
                        requestedSeats, booking.getId(), resource.getName());
                });
            } else {
                // If the booking is REJECTED, mark it as "processed" (true) without deducting
                // to avoid re-scanning it in future runs.
                booking.setSeatsDeducted(true);
                bookingRepository.save(booking);
            }
        }
    }
}
