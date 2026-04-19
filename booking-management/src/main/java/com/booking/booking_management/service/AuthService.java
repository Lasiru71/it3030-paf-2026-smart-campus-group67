package com.booking.booking_management.service;

import com.booking.booking_management.dto.request.GoogleLoginRequest;
import com.booking.booking_management.dto.request.LoginRequest;
import com.booking.booking_management.dto.request.SignupRequest;
import com.booking.booking_management.dto.response.ApiResponse;
import com.booking.booking_management.dto.response.AuthResponse;

public interface AuthService {
    ApiResponse signup(SignupRequest request);
    AuthResponse login(LoginRequest request);
    AuthResponse googleLogin(GoogleLoginRequest request);
}
