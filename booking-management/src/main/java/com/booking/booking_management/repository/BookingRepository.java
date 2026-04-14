package com.booking.booking_management.repository;

import com.booking.booking_management.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface BookingRepository extends MongoRepository<Booking, String> {
    List<Booking> findByUserEmail(String userEmail);
}
