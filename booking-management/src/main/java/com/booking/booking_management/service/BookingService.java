package com.booking.booking_management.service;

import com.booking.booking_management.model.Booking;
import com.booking.booking_management.model.Resource;
import com.booking.booking_management.repository.BookingRepository;
import com.booking.booking_management.repository.ResourceRepository;
import com.booking.booking_management.model.Notification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.time.LocalDate;
import java.time.LocalTime;
import org.springframework.lang.NonNull;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ResourceRepository resourceRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private com.booking.booking_management.repository.UserRepository userRepository;

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking createBooking(Booking booking) {
        if (booking.getStatus() == null || booking.getStatus().isEmpty()) {
            booking.setStatus("PENDING");
        }
        
        boolean isIndividual = "INDIVIDUAL".equals(booking.getResourceId());
        Resource resource = null;

        if (!isIndividual) {
            // Fetch resource and validate capacity for standard bookings
            resource = resourceRepository.findById(booking.getResourceId())
                    .orElseThrow(() -> new RuntimeException("Resource not found"));

            if (booking.getMembers() > resource.getAvailableSpaces()) {
                throw new IllegalArgumentException("invalid: cannot exceed available seats");
            }
        }

        if (booking.getDurationHours() >= 10) {
            throw new IllegalArgumentException("invalid: duration hours must be less than 10");
        }

        if (booking.getDurationMinutes() > 59) {
            throw new IllegalArgumentException("invalid: duration minutes cannot be greater than 59");
        }

        // Validate date and time
        try {
            LocalDate bDate = LocalDate.parse(booking.getBookingDate());
            LocalTime bTime = LocalTime.parse(booking.getBookingTime());
            LocalDate today = LocalDate.now();
            LocalTime now = LocalTime.now();

            if (bDate.isBefore(today)) {
                throw new IllegalArgumentException("invalid: booking date cannot be in the past");
            }

            if (bDate.equals(today) && !bTime.isAfter(now.plusMinutes(20))) {
                throw new IllegalArgumentException("invalid: booking time must be at least 20 minutes after from current time");
            }
        } catch (Exception e) {
            if (e instanceof IllegalArgumentException) throw e;
            throw new IllegalArgumentException("invalid: date or time format is incorrect");
        }

        if (!isIndividual && resource != null) {
            // Automated seat deduction logic for standard bookings
            try {
                LocalDate bDate = LocalDate.parse(booking.getBookingDate());
                if (bDate.equals(LocalDate.now())) {
                    // Deduct seats immediately if booking is for today
                    int newSpaces = resource.getAvailableSpaces() - booking.getMembers();
                    resource.setAvailableSpaces(newSpaces);
                    if (newSpaces == 0) resource.setStatus("Booked");
                    resourceRepository.save(resource);
                    booking.setSeatsDeducted(true);
                } else {
                    // Do not deduct seats for future bookings yet
                    booking.setSeatsDeducted(false);
                }
            } catch (Exception e) {
                // Fallback
                int newSpaces = resource.getAvailableSpaces() - booking.getMembers();
                resource.setAvailableSpaces(newSpaces);
                if (newSpaces == 0) resource.setStatus("Booked");
                resourceRepository.save(resource);
                booking.setSeatsDeducted(true);
            }
        } else {
            // Virtual bookings don't deduct physical seats
            booking.setSeatsDeducted(false);
        }

        Booking savedBooking = bookingRepository.save(booking);
        
        // Trigger notification for user
        notificationService.createNotification(
                savedBooking.getUserEmail(),
                "Booking Submitted",
                "Your booking for " + savedBooking.getResourceName() + " has been successfully submitted and is pending approval.",
                "BOOKING"
        );

        // Trigger notification for admins
        try {
            List<com.booking.booking_management.model.User> admins = userRepository.findByRole(com.booking.booking_management.enums.Role.ADMIN);
            for (com.booking.booking_management.model.User admin : admins) {
                notificationService.createNotification(
                        admin.getEmail(),
                        "New Booking Request",
                        "A new booking for " + savedBooking.getResourceName() + " has been submitted by " + savedBooking.getUserEmail() + ".",
                        "BOOKING"
                );
            }
        } catch (Exception e) {
            System.err.println("Failed to notify admins: " + e.getMessage());
        }

        return savedBooking;
    }

    public Booking updateBookingStatus(@NonNull String id, String status, String locationSuggestions, String adminNote) {
        return bookingRepository.findById(id).map(booking -> {
            String oldStatus = booking.getStatus();
            System.out.println("DEBUG: Transitioning booking " + id + " from " + oldStatus + " to " + status);
            booking.setStatus(status);
            
            if (locationSuggestions != null) {
                booking.setLocationSuggestions(locationSuggestions);
            }
            
            if (adminNote != null) {
                booking.setAdminNote(adminNote);
            }
            
            // If rejected or cancelled, restore seats
            if (("REJECTED".equals(status) || "CANCELLED".equals(status)) && (!"REJECTED".equals(oldStatus) && !"CANCELLED".equals(oldStatus))) {
                if (booking.isSeatsDeducted()) {
                    resourceRepository.findById(booking.getResourceId()).ifPresent(res -> {
                        res.setAvailableSpaces(res.getAvailableSpaces() + booking.getMembers());
                        if (res.getAvailableSpaces() > 0 && "Booked".equals(res.getStatus())) {
                            res.setStatus("Available");
                        }
                        resourceRepository.save(res);
                    });
                    booking.setSeatsDeducted(false);
                }
            }
            
            Booking savedBooking = bookingRepository.save(booking);
            
            // Trigger notification for status change
            String title = "Booking " + status;
            String messageDetail = "Your booking for " + savedBooking.getResourceName() + " has been " + status.toLowerCase();
            if (adminNote != null && !adminNote.isEmpty()) {
                messageDetail += ". Admin Note: " + adminNote;
            }
            
            notificationService.createNotification(
                    savedBooking.getUserEmail(),
                    title,
                    messageDetail,
                    "BOOKING"
            );

            return savedBooking;
        }).orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    public void deleteBooking(@NonNull String id) {
        bookingRepository.findById(id).ifPresent(booking -> {
            // Restore seats on deletion if they were deducted and it wasn't already rejected
            if (booking.isSeatsDeducted() && !"REJECTED".equals(booking.getStatus())) {
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

    public Booking updateBookingMessage(@NonNull String id, String message) {
        return bookingRepository.findById(id).map(booking -> {
            booking.setMessage(message);
            return bookingRepository.save(booking);
        }).orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    public Booking updateStudentSelection(@NonNull String id, String selection) {
        return bookingRepository.findById(id).map(booking -> {
            booking.setStudentSelection(selection);
            return bookingRepository.save(booking);
        }).orElseThrow(() -> new RuntimeException("Booking not found"));
    }
}
