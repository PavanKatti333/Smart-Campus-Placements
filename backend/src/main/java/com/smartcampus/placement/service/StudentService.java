package com.smartcampus.placement.service;

import com.smartcampus.placement.dto.StudentRequest;
import com.smartcampus.placement.dto.StudentResponse;
import com.smartcampus.placement.entity.Student;
import com.smartcampus.placement.exception.ResourceNotFoundException;
import com.smartcampus.placement.repository.StudentRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;

    public StudentService(StudentRepository studentRepository, PasswordEncoder passwordEncoder) {
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public StudentResponse createStudent(StudentRequest request) {
        if (studentRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Student with email " + request.getEmail() + " already exists");
        }

        Student student = new Student();
        mapRequestToEntity(request, student);

        String rawPassword = (request.getPassword() != null && !request.getPassword().isBlank())
                ? request.getPassword()
                : "Student@123";
        student.setPassword(passwordEncoder.encode(rawPassword));

        Student saved = studentRepository.save(student);
        return mapEntityToResponse(saved);
    }

    public List<StudentResponse> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }

    public StudentResponse getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        return mapEntityToResponse(student);
    }

    public StudentResponse updateStudent(Long id, StudentRequest request) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));

        if (!student.getEmail().equalsIgnoreCase(request.getEmail()) && studentRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email " + request.getEmail() + " is already in use by another student");
        }

        mapRequestToEntity(request, student);

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            student.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        Student updated = studentRepository.save(student);
        return mapEntityToResponse(updated);
    }

    public void deleteStudent(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Student not found with id: " + id);
        }
        studentRepository.deleteById(id);
    }

    public Student getStudentEntityById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
    }

    private void mapRequestToEntity(StudentRequest request, Student student) {
        student.setName(request.getName());
        student.setEmail(request.getEmail());
        student.setPhone(request.getPhone());
        student.setBranch(request.getBranch());
        student.setCgpa(request.getCgpa());
        student.setBacklogs(request.getBacklogs());
        student.setGraduationYear(request.getGraduationYear());
        student.setResumeUrl(request.getResumeUrl());
        if (request.getRole() != null && !request.getRole().isBlank()) {
            student.setRole(request.getRole());
        }
    }

    public StudentResponse mapEntityToResponse(Student student) {
        return new StudentResponse(
                student.getId(),
                student.getName(),
                student.getEmail(),
                student.getPhone(),
                student.getBranch(),
                student.getCgpa(),
                student.getBacklogs(),
                student.getGraduationYear(),
                student.getResumeUrl(),
                student.getRole(),
                student.getCreatedAt()
        );
    }
}
