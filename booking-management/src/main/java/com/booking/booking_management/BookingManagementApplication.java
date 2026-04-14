package com.booking.booking_management;

import com.booking.booking_management.model.Booking;
import com.booking.booking_management.repository.BookingRepository;
import com.booking.booking_management.model.Resource;
import com.booking.booking_management.repository.ResourceRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class BookingManagementApplication {

	public static void main(String[] args) {
		SpringApplication.run(BookingManagementApplication.class, args);
	}

	@Bean
	CommandLineRunner initBookings(BookingRepository repo, ResourceRepository resourceRepo) {
		return args -> {
            if (resourceRepo.count() == 0) {
                Resource r1 = new Resource(); r1.setId("1"); r1.setName("Grand Auditorium"); r1.setCategory("L Halls"); r1.setCapacity(450); r1.setAvailableSpaces(450); r1.setLocation("Block A, Level 2"); r1.setStatus("Available"); r1.setImage("https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?auto=format&fit=crop&q=80&w=800"); resourceRepo.save(r1);
                Resource r2 = new Resource(); r2.setId("2"); r2.setName("Advanced Robotics Lab"); r2.setCategory("Labs"); r2.setCapacity(25); r2.setAvailableSpaces(0); r2.setLocation("Engineering Wing"); r2.setStatus("Booked"); r2.setImage("https://images.unsplash.com/photo-1546776310-eef45dd6d63c?auto=format&fit=crop&q=80&w=800"); resourceRepo.save(r2);
                Resource r3 = new Resource(); r3.setId("3"); r3.setName("Student Lounge B"); r3.setCategory("Common"); r3.setCapacity(60); r3.setAvailableSpaces(60); r3.setLocation("Student Hub"); r3.setStatus("Available"); r3.setImage("https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&q=80&w=800"); resourceRepo.save(r3);
                Resource r4 = new Resource(); r4.setId("4"); r4.setName("Conference Room 104"); r4.setCategory("Meeting"); r4.setCapacity(12); r4.setAvailableSpaces(0); r4.setLocation("Commerce Building"); r4.setStatus("Maintenance"); r4.setImage("https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&q=80&w=800"); resourceRepo.save(r4);
                Resource r5 = new Resource(); r5.setId("5"); r5.setName("Organic Chem Lab"); r5.setCategory("Labs"); r5.setCapacity(30); r5.setAvailableSpaces(30); r5.setLocation("Science Block S3"); r5.setStatus("Available"); r5.setImage("https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&q=80&w=800"); resourceRepo.save(r5);
                Resource r6 = new Resource(); r6.setId("6"); r6.setName("Mini Theater 2"); r6.setCategory("L Halls"); r6.setCapacity(120); r6.setAvailableSpaces(120); r6.setLocation("Arts Pavilion"); r6.setStatus("Available"); r6.setImage("https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800"); resourceRepo.save(r6);
            }

			if (repo.count() == 0) {
				Booking b1 = new Booking();
				b1.setResourceId("1");
				b1.setResourceName("Grand Auditorium");
				b1.setMembers(150);
				b1.setDurationHours(3);
				b1.setDurationMinutes(0);
				b1.setBookingDate("2026-04-14");
				b1.setBookingTime("09:00");
				b1.setUserEmail("student1@gmail.com");
				b1.setStatus("CONFIRMED");
				repo.save(b1);

				Booking b2 = new Booking();
				b2.setResourceId("2");
				b2.setResourceName("Creative Lab B");
				b2.setMembers(10);
				b2.setDurationHours(2);
				b2.setDurationMinutes(30);
				b2.setBookingDate("2026-04-12");
				b2.setBookingTime("14:00");
				b2.setUserEmail("student2@gmail.com");
				b2.setStatus("PENDING");
				repo.save(b2);

				Booking b3 = new Booking();
				b3.setResourceId("3");
				b3.setResourceName("Conference Room 3");
				b3.setMembers(12);
				b3.setDurationHours(1);
				b3.setDurationMinutes(30);
				b3.setBookingDate("2026-04-10");
				b3.setBookingTime("10:00");
				b3.setUserEmail("user@gmail.com");
				b3.setStatus("PENDING");
				repo.save(b3);

				System.out.println("Mock bookings and resources seeded!");
			}
		};
	}
}
