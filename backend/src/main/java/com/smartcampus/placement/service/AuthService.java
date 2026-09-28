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

        // 1. Check Admin Login
        if (email.equalsIgnoreCase("admin@smartcampus.edu") || email.equalsIgnoreCase("admin@college.edu")) {
            if ("Admin@123".equals(password) || "admin".equals(password)) {
                return new LoginResponse(
                        0L,
                        "Chief Placement Officer",
                        email,
                        "ADMIN",
                        "admin-token-" + UUID.randomUUID(),
                        "Admin login successful"
                );
            } else {
                throw new IllegalArgumentException("Invalid password for Admin");
            }
        }

        // 2. Check Recruiter Login
        if (email.equalsIgnoreCase("recruiter@smartcampus.edu") || email.startsWith("recruiter@")) {
            if ("Recruiter@123".equals(password) || "recruiter".equals(password)) {
                return new LoginResponse(
                        999L,
                        "Campus Recruiter",
                        email,
                        "RECRUITER",
                        "recruiter-token-" + UUID.randomUUID(),
                        "Recruiter login successful"
                );
            }
        }

        // 3. Check Student Login
        Optional<Student> studentOpt = studentRepository.findByEmail(email);
        if (studentOpt.isEmpty()) {
            throw new IllegalArgumentException("No account found with email: " + email);
        }

        Student student = studentOpt.get();
        boolean passwordMatches = passwordEncoder.matches(password, student.getPassword())
                || password.equals(student.getPassword());

        if (!passwordMatches) {
            throw new IllegalArgumentException("Invalid password");
        }

        return new LoginResponse(
                student.getId(),
                student.getName(),
                student.getEmail(),
                student.getRole() != null ? student.getRole() : "STUDENT",
                "student-token-" + UUID.randomUUID(),
                "Login successful"
        );
    }

    public StudentResponse register(StudentRequest request) {
        return studentService.createStudent(request);
    }
}
