package com.smartcampus.placement.service;

import com.smartcampus.placement.dto.ApplicationRequest;
import com.smartcampus.placement.dto.ApplicationResponse;
import com.smartcampus.placement.dto.EligibilityResult;
import com.smartcampus.placement.entity.Application;
import com.smartcampus.placement.entity.Company;
import com.smartcampus.placement.entity.Job;
import com.smartcampus.placement.entity.Student;
import com.smartcampus.placement.exception.DuplicateApplicationException;
import com.smartcampus.placement.exception.InvalidStatusTransitionException;
import com.smartcampus.placement.repository.ApplicationRepository;
import com.smartcampus.placement.repository.JobRepository;
import com.smartcampus.placement.repository.StudentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ApplicationServiceTest {

    @Mock
    private ApplicationRepository applicationRepository;

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private JobRepository jobRepository;

    @Mock
    private EligibilityService eligibilityService;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private ApplicationService applicationService;

    private Student student;
    private Job job;
    private Company company;

    @BeforeEach
    void setUp() {
        company = new Company("TCS", "tcs@example.com", "9876543210", "Bangalore", "tcs.com", "IT Consulting");
        company.setId(1L);

        student = new Student("Pavan", "pavan@example.com", "pass", "9876543210", "CSE", 8.2, 0, 2027, null, "STUDENT");
        student.setId(1L);

        job = new Job("Software Engineer", "Java Developer", 700000.0, 7.5, "CSE", 0, LocalDate.now().plusDays(10), "OPEN", company);
        job.setId(1L);
    }

    @Test
    void testApplySuccess() {
        when(applicationRepository.existsByStudentIdAndJobId(1L, 1L)).thenReturn(false);
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(jobRepository.findById(1L)).thenReturn(Optional.of(job));

        EligibilityResult result = new EligibilityResult(true, "ELIGIBLE", "Eligible", new ArrayList<>());
        when(eligibilityService.checkEligibility(student, job)).thenReturn(result);

        Application savedApp = new Application(student, job, "ELIGIBLE", "Eligible");
        savedApp.setId(10L);
        savedApp.setAppliedDate(LocalDateTime.now());
        when(applicationRepository.save(any(Application.class))).thenReturn(savedApp);

        ApplicationRequest request = new ApplicationRequest(1L, 1L);
        ApplicationResponse response = applicationService.apply(request);

        assertNotNull(response);
        assertEquals(10L, response.getId());
        assertEquals("ELIGIBLE", response.getStatus());
        verify(notificationService, times(1)).sendNotification(eq(student), anyString(), eq("APPLICATION"));
    }

    @Test
    void testDuplicateApplicationThrowsException() {
        when(applicationRepository.existsByStudentIdAndJobId(1L, 1L)).thenReturn(true);

        ApplicationRequest request = new ApplicationRequest(1L, 1L);
        assertThrows(DuplicateApplicationException.class, () -> {
            applicationService.apply(request);
        });

        verify(applicationRepository, never()).save(any(Application.class));
    }

    @Test
    void testShortlistNotEligibleThrowsException() {
        Application app = new Application(student, job, "NOT_ELIGIBLE", "Low CGPA");
        app.setId(10L);
        when(applicationRepository.findById(10L)).thenReturn(Optional.of(app));

        assertThrows(InvalidStatusTransitionException.class, () -> {
            applicationService.updateStatus(10L, "SHORTLISTED");
        });
    }

    @Test
    void testShortlistEligibleApplicationSuccess() {
        Application app = new Application(student, job, "ELIGIBLE", "Meets all criteria");
        app.setId(10L);
        when(applicationRepository.findById(10L)).thenReturn(Optional.of(app));
        when(applicationRepository.save(any(Application.class))).thenAnswer(i -> i.getArgument(0));

        ApplicationResponse response = applicationService.updateStatus(10L, "SHORTLISTED");
        assertEquals("SHORTLISTED", response.getStatus());
        verify(notificationService, times(1)).sendNotification(eq(student), anyString(), eq("SHORTLIST"));
    }
}
