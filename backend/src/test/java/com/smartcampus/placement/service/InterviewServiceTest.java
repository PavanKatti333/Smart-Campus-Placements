package com.smartcampus.placement.service;

import com.smartcampus.placement.dto.InterviewRequest;
import com.smartcampus.placement.dto.InterviewResponse;
import com.smartcampus.placement.entity.Application;
import com.smartcampus.placement.entity.Company;
import com.smartcampus.placement.entity.Interview;
import com.smartcampus.placement.entity.Job;
import com.smartcampus.placement.entity.Student;
import com.smartcampus.placement.exception.InvalidStatusTransitionException;
import com.smartcampus.placement.repository.ApplicationRepository;
import com.smartcampus.placement.repository.InterviewRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class InterviewServiceTest {

    @Mock
    private InterviewRepository interviewRepository;

    @Mock
    private ApplicationRepository applicationRepository;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private InterviewService interviewService;

    private Application application;
    private Student student;
    private Job job;
    private Company company;

    @BeforeEach
    void setUp() {
        company = new Company("Infosys", "info@infosys.com", "1234567890", "Bangalore", "infosys.com", "IT");
        company.setId(1L);

        student = new Student("Pavan", "pavan@example.com", "pwd", "9876543210", "CSE", 8.5, 0, 2027, null, "STUDENT");
        student.setId(1L);

        job = new Job("Systems Engineer", "SE Role", 650000.0, 7.0, "CSE", 0, LocalDate.now().plusDays(20), "OPEN", company);
        job.setId(1L);

        application = new Application(student, job, "SHORTLISTED", "Eligible");
        application.setId(10L);
    }

    @Test
    void testScheduleInterviewSuccess() {
        when(applicationRepository.findById(10L)).thenReturn(Optional.of(application));

        Interview savedInterview = new Interview(application, LocalDate.now().plusDays(3), LocalTime.of(10, 0), "ONLINE", "Technical Team", "SCHEDULED");
        savedInterview.setId(5L);
        savedInterview.setCreatedAt(LocalDateTime.now());
        when(interviewRepository.save(any(Interview.class))).thenReturn(savedInterview);

        InterviewRequest request = new InterviewRequest(10L, LocalDate.now().plusDays(3), LocalTime.of(10, 0), "ONLINE", "Technical Team");
        InterviewResponse response = interviewService.scheduleInterview(request);

        assertNotNull(response);
        assertEquals(5L, response.getId());
        assertEquals("SCHEDULED", response.getStatus());
        assertEquals("INTERVIEW", application.getStatus());
        verify(notificationService, times(1)).sendNotification(eq(student), anyString(), eq("INTERVIEW"));
    }

    @Test
    void testScheduleInterviewNotShortlistedThrows() {
        application.setStatus("ELIGIBLE");
        when(applicationRepository.findById(10L)).thenReturn(Optional.of(application));

        InterviewRequest request = new InterviewRequest(10L, LocalDate.now().plusDays(3), LocalTime.of(10, 0), "ONLINE", "Technical Team");
        assertThrows(InvalidStatusTransitionException.class, () -> {
            interviewService.scheduleInterview(request);
        });

        verify(interviewRepository, never()).save(any(Interview.class));
    }

    @Test
    void testInterviewPassedMakesApplicationSelected() {
        Interview interview = new Interview(application, LocalDate.now().plusDays(1), LocalTime.of(14, 0), "ONLINE", "Lead Architect", "SCHEDULED");
        interview.setId(5L);
        when(interviewRepository.findById(5L)).thenReturn(Optional.of(interview));
        when(interviewRepository.save(any(Interview.class))).thenAnswer(i -> i.getArgument(0));

        InterviewResponse response = interviewService.updateInterviewResult(5L, "PASSED");

        assertEquals("PASSED", response.getStatus());
        assertEquals("SELECTED", application.getStatus());
        verify(notificationService, times(1)).sendNotification(eq(student), anyString(), eq("SELECTION"));
    }

    @Test
    void testInterviewFailedMakesApplicationRejected() {
        Interview interview = new Interview(application, LocalDate.now().plusDays(1), LocalTime.of(14, 0), "ONLINE", "Lead Architect", "SCHEDULED");
        interview.setId(5L);
        when(interviewRepository.findById(5L)).thenReturn(Optional.of(interview));
        when(interviewRepository.save(any(Interview.class))).thenAnswer(i -> i.getArgument(0));

        InterviewResponse response = interviewService.updateInterviewResult(5L, "FAILED");

        assertEquals("FAILED", response.getStatus());
        assertEquals("REJECTED", application.getStatus());
    }
}
