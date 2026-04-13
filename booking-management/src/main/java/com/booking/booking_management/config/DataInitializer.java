package com.booking.booking_management.config;

import com.booking.booking_management.enums.Role;
import com.booking.booking_management.model.User;
import com.booking.booking_management.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            String adminEmail = "admin1@gmail.com";
            Optional<User> existingAdmin = userRepository.findByEmail(adminEmail);

            if (existingAdmin.isEmpty()) {
                User admin = new User(
                        "Administrator",
                        adminEmail,
                        passwordEncoder.encode("Test123"),
                        Role.ADMIN);
                userRepository.save(admin);
                System.out.println("Default admin user created: " + adminEmail);
            } else {
                User admin = existingAdmin.get();
                admin.setPassword(passwordEncoder.encode("Test123"));
                admin.setRole(Role.ADMIN);
                userRepository.save(admin);
                System.out.println("Admin user credentials reset: " + adminEmail);
            }
        };
    }
}
