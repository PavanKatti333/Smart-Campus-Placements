package com.smartcampus.placement.service;

import com.smartcampus.placement.dto.InterviewRequest;
import com.smartcampus.placement.dto.InterviewResponse;
import com.smartcampus.placement.entity.Application;
import com.smartcampus.placement.entity.Interview;
import com.smartcampus.placement.entity.Job;
import com.smartcampus.placement.entity.Student;
import com.smartcampus.placement.exception.InvalidStatusTransitionException;
import com.smartcampus.placement.exception.ResourceNotFoundException;
import com.smartcampus.placement.repository.ApplicationRepository;
import com.smartcampus.placement.repository.InterviewRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class InterviewService {

    private final InterviewRepository interviewRepository;
    private final ApplicationRepository applicationRepository;
    private final NotificationService notificationService;

    public InterviewService(
            InterviewRepository interviewRepository,
            ApplicationRepository applicationRepository,
            NotificationService notificationService) {
        this.interviewRepository = interviewRepository;
        this.applicationRepository = applicationRepository;
        this.notificationService = notificationService;
    }

    public InterviewResponse scheduleInterview(InterviewRequest request) {
        Long applicationId = request.getApplicationId();

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));

        // Interview can only be scheduled for shortlisted applications
        if (!"SHORTLISTED".equalsIgnoreCase(application.getStatus())) {
            throw new InvalidStatusTransitionException(
                    "Interview can only be scheduled for SHORTLISTED applications. Current status is: " + application.getStatus()
            );
        }

        Interview interview = new Interview();
        interview.setApplication(application);
        interview.setInterviewDate(request.getInterviewDate());
        interview.setInterviewTime(request.getInterviewTime());
        interview.setInterviewType(request.getInterviewType().toUpperCase());
        interview.setInterviewer(request.getInterviewer());
        interview.setStatus("SCHEDULED");

        Interview saved = interviewRepository.save(interview);

        // Transition application status to INTERVIEW
        application.setStatus("INTERVIEW");
        applicationRepository.save(application);

        // Notify student
        Student student = application.getStudent();
        Job job = application.getJob();
        String companyName = (job.getCompany() != null) ? job.getCompany().getCompanyName() : "Company";
        String notifMsg = "Your interview has been scheduled for " + job.getJobTitle() + " at " + companyName +
                " on " + saved.getInterviewDate() + " at " + saved.getInterviewTime() + " (" + saved.getInterviewType() +
                ") with " + saved.getInterviewer() + ".";
        notificationService.sendNotification(student, notifMsg, "INTERVIEW");

        return mapEntityToResponse(saved);
    }

    public InterviewResponse updateInterviewResult(Long id, String status) {
        Interview interview = interviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Interview not found with id: " + id));

        String normalizedStatus = status.trim().toUpperCase();
        if (!"PASSED".equals(normalizedStatus) && !"FAILED".equals(normalizedStatus)) {
            throw new IllegalArgumentException("Interview status must be PASSED or FAILED");
        }

        interview.setStatus(normalizedStatus);
        Interview savedInterview = interviewRepository.save(interview);

        Application application = interview.getApplication();
        Student student = application.getStudent();
        Job job = application.getJob();
        String companyName = (job.getCompany() != null) ? job.getCompany().getCompanyName() : "Company";

        if ("PASSED".equals(normalizedStatus)) {
            application.setStatus("SELECTED");
            notificationService.sendNotification(
                    student,
                    "Congratulations! You PASSED the interview for " + job.getJobTitle() + " at " + companyName +
                            "! Your application status is now SELECTED.",
                    "SELECTION"
            );
        } else {
            application.setStatus("REJECTED");
            notificationService.sendNotification(
                    student,
                    "Your interview for " + job.getJobTitle() + " at " + companyName +
                            " was not cleared. Application status updated to REJECTED.",
                    "INTERVIEW"
            );
        }

        applicationRepository.save(application);
        return mapEntityToResponse(savedInterview);
    }

    public List<InterviewResponse> getAllInterviews() {
        return interviewRepository.findAll().stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }

    public InterviewResponse getInterviewById(Long id) {
        Interview interview = interviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Interview not found with id: " + id));
        return mapEntityToResponse(interview);
    }

    public List<InterviewResponse> getInterviewsByStudentId(Long studentId) {
        return interviewRepository.findByApplicationStudentId(studentId).stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }

    public InterviewResponse mapEntityToResponse(Interview interview) {
        Application app = interview.getApplication();
        Student student = app != null ? app.getStudent() : null;
        Job job = app != null ? app.getJob() : null;

        return new InterviewResponse(
                interview.getId(),
                app != null ? app.getId() : null,
                interview.getInterviewDate(),
                interview.getInterviewTime(),
                interview.getInterviewType(),
                interview.getInterviewer(),
                interview.getStatus(),
                interview.getCreatedAt(),
                student != null ? student.getId() : null,
                student != null ? student.getName() : null,
                student != null ? student.getEmail() : null,
                job != null ? job.getId() : null,
                job != null ? job.getJobTitle() : null,
                (job != null && job.getCompany() != null) ? job.getCompany().getCompanyName() : null
        );
    }
}