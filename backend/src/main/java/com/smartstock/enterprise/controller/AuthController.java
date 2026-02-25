package com.smartstock.enterprise.controller;

import com.smartstock.enterprise.dto.Dto;
import com.smartstock.enterprise.model.User;
import com.smartstock.enterprise.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Dto.LoginRequest request) {
        // Simple mock login for MVP - updates or creates user
        User user = userRepository.findByMobileNumber(request.getMobileNumber())
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setMobileNumber(request.getMobileNumber());
                    return userRepository.save(newUser);
                });

        // In real app, generate OTP here. For now, return User ID directly.
        return ResponseEntity.ok(Map.of("message", "Login successful", "userId", user.getId()));
    }
}
