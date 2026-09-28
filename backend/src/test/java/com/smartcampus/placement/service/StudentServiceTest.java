package com.smartcampus.placement.service;

import com.smartcampus.placement.dto.StudentRequest;
import com.smartcampus.placement.dto.StudentResponse;
import com.smartcampus.placement.entity.Student;
import com.smartcampus.placement.repository.StudentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class StudentServiceTest {

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private StudentService studentService;

    private StudentRequest studentRequest;

    @BeforeEach
    void setUp() {
        studentRequest = new StudentRequest();
        studentRequest.setName("Pavan Kumar");
        studentRequest.setEmail("pavan@example.com");
        studentRequest.setPhone("9876543210");
        studentRequest.setBranch("CSE");
        studentRequest.setCgpa(8.2);
        studentRequest.setBacklogs(0);
        studentRequest.setGraduationYear(2027);
        studentRequest.setPassword("Pass@123");
    }

    @Test
    void testCreateStudentSuccess() {
        when(studentRepository.existsByEmail("pavan@example.com")).thenReturn(false);
        when(passwordEncoder.encode("Pass@123")).thenReturn("hashed_pass");

        Student savedStudent = new Student();
        savedStudent.setId(1L);
        savedStudent.setName("Pavan Kumar");
        savedStudent.setEmail("pavan@example.com");
        savedStudent.setPhone("9876543210");
        savedStudent.setBranch("CSE");
        savedStudent.setCgpa(8.2);
        savedStudent.setBacklogs(0);
        savedStudent.setGraduationYear(2027);
        savedStudent.setPassword("hashed_pass");

        when(studentRepository.save(any(Student.class))).thenReturn(savedStudent);

        StudentResponse response = studentService.createStudent(studentRequest);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Pavan Kumar", response.getName());
        assertEquals("pavan@example.com", response.getEmail());
        assertEquals(8.2, response.getCgpa());
        verify(passwordEncoder, times(1)).encode("Pass@123");
        verify(studentRepository, times(1)).save(any(Student.class));
    }

    @Test
    void testCreateStudentDuplicateEmail() {
        when(studentRepository.existsByEmail("pavan@example.com")).thenReturn(true);

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            studentService.createStudent(studentRequest);
        });

        assertTrue(exception.getMessage().contains("already exists"));
        verify(studentRepository, never()).save(any(Student.class));
    }

    @Test
    void testGetStudentByIdSuccess() {
        Student student = new Student();
        student.setId(1L);
        student.setName("Pavan Kumar");
        student.setEmail("pavan@example.com");
        student.setCgpa(8.2);

        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));

        StudentResponse response = studentService.getStudentById(1L);
        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Pavan Kumar", response.getName());
    }
}
