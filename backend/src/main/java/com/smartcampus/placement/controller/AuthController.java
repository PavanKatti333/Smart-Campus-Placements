package com.smartcampus.placement.controller;

import com.smartcampus.placement.dto.LoginRequest;
import com.smartcampus.placement.dto.LoginResponse;
import com.smartcampus.placement.dto.StudentRequest;
import com.smartcampus.placement.dto.StudentResponse;
import com.smartcampus.placement.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<StudentResponse> register(@Valid @RequestBody StudentRequest request) {
        return new ResponseEntity<>(authService.register(request), HttpStatus.CREATED);
    }
}
