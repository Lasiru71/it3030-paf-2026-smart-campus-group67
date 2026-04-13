package com.booking.booking_management.service.impl;

import com.booking.booking_management.dto.request.LoginRequest;
import com.booking.booking_management.dto.request.SignupRequest;
import com.booking.booking_management.dto.response.ApiResponse;
import com.booking.booking_management.dto.response.AuthResponse;
import com.booking.booking_management.enums.Role;
import com.booking.booking_management.exception.DuplicateEmailException;
import com.booking.booking_management.exception.InvalidCredentialsException;
import com.booking.booking_management.model.User;
import com.booking.booking_management.repository.UserRepository;
import com.booking.booking_management.security.JwtService;
import com.booking.booking_management.service.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthServiceImpl(UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @Override
    public ApiResponse signup(SignupRequest request) {
        // Email validation: Only @gmail.com
        if (!request.getEmail().toLowerCase().endsWith("@gmail.com")) {
            throw new IllegalArgumentException("Only @gmail.com emails are permitted.");
        }

        // Password validation: Min 6 characters, uppercase, lowercase, and numeric
        String passwordRegex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{6,}$";
        if (!request.getPassword().matches(passwordRegex)) {
            throw new IllegalArgumentException(
                    "Password must be at least 6 characters, and include uppercase, lowercase, and a number.");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException("Email is already registered");
        }

        Role role;
        try {
            role = Role.valueOf(request.getRole().toUpperCase());
            if (role == Role.ADMIN) {
                throw new IllegalArgumentException("Registration as ADMIN is not permitted.");
            }
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(e.getMessage() != null && e.getMessage().contains("ADMIN")
                    ? e.getMessage()
                    : "Invalid role specified");
        }

        User user = new User(
                request.getFullName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                role);

        userRepository.save(user);

        return new ApiResponse(true, "User registered successfully");
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        } catch (AuthenticationException e) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        // Create user details for JWT generation
        org.springframework.security.core.userdetails.User userDetails = new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                java.util.Collections.singleton(new org.springframework.security.core.authority.SimpleGrantedAuthority(
                        "ROLE_" + user.getRole().name())));

        String jwtToken = jwtService.generateToken(userDetails);

        return new AuthResponse(
                jwtToken,
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole().name());
    }
}
