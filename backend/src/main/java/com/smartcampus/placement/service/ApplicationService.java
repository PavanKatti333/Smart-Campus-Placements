package com.smartcampus.placement.service;

import com.smartcampus.placement.dto.ApplicationRequest;
import com.smartcampus.placement.dto.ApplicationResponse;
import com.smartcampus.placement.dto.EligibilityResult;
import com.smartcampus.placement.entity.Application;
import com.smartcampus.placement.entity.Job;
import com.smartcampus.placement.entity.Student;
import com.smartcampus.placement.exception.DuplicateApplicationException;
import com.smartcampus.placement.exception.InvalidStatusTransitionException;
import com.smartcampus.placement.exception.ResourceNotFoundException;
import com.smartcampus.placement.repository.ApplicationRepository;
import com.smartcampus.placement.repository.JobRepository;
import com.smartcampus.placement.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final StudentRepository studentRepository;
    private final JobRepository jobRepository;
    private final EligibilityService eligibilityService;
    private final NotificationService notificationService;

    public ApplicationService(
            ApplicationRepository applicationRepository,
            StudentRepository studentRepository,
            JobRepository jobRepository,
            EligibilityService eligibilityService,
            NotificationService notificationService) {
        this.applicationRepository = applicationRepository;
        this.studentRepository = studentRepository;
        this.jobRepository = jobRepository;
        this.eligibilityService = eligibilityService;
        this.notificationService = notificationService;
    }

    public ApplicationResponse apply(ApplicationRequest request) {
        Long studentId = request.getStudentId();
        Long jobId = request.getJobId();

        // 1. Prevent duplicate applications
        if (applicationRepository.existsByStudentIdAndJobId(studentId, jobId)) {
            throw new DuplicateApplicationException("You have already applied for this job");
        }

        // 2. Fetch student and job
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        // 3. Evaluate eligibility
        EligibilityResult eligibility = eligibilityService.checkEligibility(student, job);

        Application application = new Application();
        application.setStudent(student);
        application.setJob(job);
        application.setStatus(eligibility.getStatus()); // ELIGIBLE or NOT_ELIGIBLE
        application.setEligibilityRemarks(eligibility.getMessage());
        application.setAppliedDate(LocalDateTime.now());

        Application saved = applicationRepository.save(application);

        // 4. Send notification
        String companyName = job.getCompany() != null ? job.getCompany().getCompanyName() : "Company";
        String notifMsg = "Your application for " + job.getJobTitle() + " at " + companyName +
                " has been submitted. Status: " + saved.getStatus();
        notificationService.sendNotification(student, notifMsg, "APPLICATION");

        return mapEntityToResponse(saved);
    }

    public ApplicationResponse updateStatus(Long id, String targetStatus) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + id));

        String currentStatus = application.getStatus().toUpperCase();
        String newStatus = targetStatus.trim().toUpperCase();

        // Validate state transitions
        validateStatusTransition(currentStatus, newStatus, application);

        application.setStatus(newStatus);
        Application updated = applicationRepository.save(application);

        // Send appropriate notifications
        Student student = application.getStudent();
        String jobTitle = application.getJob().getJobTitle();
        String companyName = application.getJob().getCompany() != null
                ? application.getJob().getCompany().getCompanyName()
                : "Company";

        if ("SHORTLISTED".equals(newStatus)) {
            notificationService.sendNotification(
                    student,
                    "Congratulations! You have been shortlisted for " + jobTitle + " at " + companyName + ".",
                    "SHORTLIST"
            );
        } else if ("REJECTED".equals(newStatus)) {
            notificationService.sendNotification(
                    student,
                    "Your application status for " + jobTitle + " at " + companyName + " has been updated to REJECTED.",
                    "APPLICATION"
            );
        } else if ("SELECTED".equals(newStatus)) {
            notificationService.sendNotification(
                    student,
                    "Congratulations! You have been selected for " + jobTitle + " at " + companyName + "!",
                    "SELECTION"
            );
        }

        return mapEntityToResponse(updated);
    }

    public EligibilityResult checkPreEligibility(Long studentId, Long jobId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        return eligibilityService.checkEligibility(student, job);
    }

    public List<ApplicationResponse> getAllApplications() {
        return applicationRepository.findAll().stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }

    public ApplicationResponse getApplicationById(Long id) {
        Application app = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + id));
        return mapEntityToResponse(app);
    }

    public List<ApplicationResponse> getApplicationsByStudentId(Long studentId) {
        return applicationRepository.findByStudentId(studentId).stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }

    public void deleteApplication(Long id) {
        if (!applicationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Application not found with id: " + id);
        }
        applicationRepository.deleteById(id);
    }

    public Application getApplicationEntityById(Long id) {
        return applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + id));
    }

    private void validateStatusTransition(String current, String target, Application app) {
        if (current.equals(target)) {
            return;
        }

        if ("SHORTLISTED".equals(target)) {
            if ("NOT_ELIGIBLE".equals(current)) {
                throw new InvalidStatusTransitionException(
                        "Application cannot be shortlisted because student is NOT_ELIGIBLE. Reason: " + app.getEligibilityRemarks()
                );
            }
            if ("REJECTED".equals(current)) {
                throw new InvalidStatusTransitionException("Cannot shortlist an application that has already been REJECTED.");
            }
        } else if ("SELECTED".equals(target)) {
            if (!"INTERVIEW".equals(current) && !"SHORTLISTED".equals(current)) {
                throw new InvalidStatusTransitionException(
                        "Cannot transition to SELECTED from current status '" + current + "'. Interview must be completed first."
                );
            }
        }
    }

    public ApplicationResponse mapEntityToResponse(Application app) {
        Student student = app.getStudent();
        Job job = app.getJob();

        return new ApplicationResponse(
                app.getId(),
                app.getStatus(),
                app.getAppliedDate(),
                app.getEligibilityRemarks(),
                student != null ? student.getId() : null,
                student != null ? student.getName() : null,
                student != null ? student.getEmail() : null,
                student != null ? student.getBranch() : null,
                student != null ? student.getCgpa() : 0.0,
                student != null ? student.getBacklogs() : 0,
                job != null ? job.getId() : null,
                job != null ? job.getJobTitle() : null,
                job != null ? job.getSalary() : 0.0,
                (job != null && job.getCompany() != null) ? job.getCompany().getCompanyName() : null
        );
    }
}