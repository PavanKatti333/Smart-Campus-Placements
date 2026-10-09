package com.smartcampus.placement.service;

import com.smartcampus.placement.dto.LoginRequest;
import com.smartcampus.placement.dto.LoginResponse;
import com.smartcampus.placement.dto.StudentRequest;
import com.smartcampus.placement.dto.StudentResponse;
import com.smartcampus.placement.entity.Student;
import com.smartcampus.placement.repository.StudentRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    private final StudentRepository studentRepository;
    private final StudentService studentService;
    private final PasswordEncoder passwordEncoder;

    public AuthService(StudentRepository studentRepository, StudentService studentService, PasswordEncoder passwordEncoder) {
        this.studentRepository = studentRepository;
        this.studentService = studentService;
        this.passwordEncoder = passwordEncoder;
    }

    public LoginResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        String password = request.getPassword().trim();

        Optional<Student> studentOpt = studentRepository.findByEmail(email);
        if (studentOpt.isEmpty()) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        Student student = studentOpt.get();
        boolean passwordMatches = passwordEncoder.matches(password, student.getPassword())
                || password.equals(student.getPassword());

        if (!passwordMatches) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        String role = (student.getRole() != null && !student.getRole().isBlank())
                ? student.getRole().toUpperCase()
                : "STUDENT";

        return new LoginResponse(
                student.getId(),
                student.getName(),
                student.getEmail(),
                role,
                "token-" + UUID.randomUUID(),
                "Login successful"
        );
    }

    public StudentResponse register(StudentRequest request) {
        return studentService.createStudent(request);
    }
}
