package com.smartcampus.placement.service;

import com.smartcampus.placement.dto.OfferRequest;
import com.smartcampus.placement.dto.OfferResponse;
import com.smartcampus.placement.entity.Application;
import com.smartcampus.placement.entity.Job;
import com.smartcampus.placement.entity.Offer;
import com.smartcampus.placement.entity.Student;
import com.smartcampus.placement.exception.InvalidStatusTransitionException;
import com.smartcampus.placement.exception.ResourceNotFoundException;
import com.smartcampus.placement.repository.ApplicationRepository;
import com.smartcampus.placement.repository.OfferRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OfferService {

    private final OfferRepository offerRepository;
    private final ApplicationRepository applicationRepository;
    private final NotificationService notificationService;

    public OfferService(
            OfferRepository offerRepository,
            ApplicationRepository applicationRepository,
            NotificationService notificationService) {
        this.offerRepository = offerRepository;
        this.applicationRepository = applicationRepository;
        this.notificationService = notificationService;
    }

    public OfferResponse createOffer(OfferRequest request) {
        Long applicationId = request.getApplicationId();

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));

        // Offer can only be generated for selected applications
        if (!"SELECTED".equalsIgnoreCase(application.getStatus())) {
            throw new InvalidStatusTransitionException(
                    "Offer can only be generated for SELECTED applications. Current status is: " + application.getStatus()
            );
        }

        // Prevent duplicate offers for the same application
        if (offerRepository.existsByApplicationId(applicationId)) {
            throw new IllegalArgumentException("An offer has already been generated for this application");
        }

        Offer offer = new Offer();
        offer.setApplication(application);
        offer.setOfferedSalary(request.getOfferedSalary());
        offer.setJoiningDate(request.getJoiningDate());
        offer.setOfferStatus("GENERATED");

        Offer saved = offerRepository.save(offer);

        // Send notification
        Student student = application.getStudent();
        Job job = application.getJob();
        String companyName = (job.getCompany() != null) ? job.getCompany().getCompanyName() : "Company";
        String notifMsg = "Congratulations! An offer has been generated for you by " + companyName +
                " for the role of " + job.getJobTitle() + " with offered salary of ₹" + saved.getOfferedSalary() +
                " and joining date " + saved.getJoiningDate() + ". Please review and accept/reject.";
        notificationService.sendNotification(student, notifMsg, "OFFER");

        return mapEntityToResponse(saved);
    }

    public OfferResponse updateOfferStatus(Long id, String status) {
        Offer offer = offerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Offer not found with id: " + id));

        String normalizedStatus = status.trim().toUpperCase();
        if (!"ACCEPTED".equals(normalizedStatus) && !"REJECTED".equals(normalizedStatus)) {
            throw new IllegalArgumentException("Offer status must be ACCEPTED or REJECTED");
        }

        if ("ACCEPTED".equalsIgnoreCase(offer.getOfferStatus()) || "REJECTED".equalsIgnoreCase(offer.getOfferStatus())) {
            throw new InvalidStatusTransitionException("Offer has already been " + offer.getOfferStatus() + " and cannot be changed");
        }

        offer.setOfferStatus(normalizedStatus);
        Offer updated = offerRepository.save(offer);

        // Notify student
        Application application = offer.getApplication();
        Student student = application != null ? application.getStudent() : null;
        Job job = application != null ? application.getJob() : null;
        String companyName = (job != null && job.getCompany() != null) ? job.getCompany().getCompanyName() : "Company";

        if (student != null) {
            String msg = "ACCEPTED".equals(normalizedStatus)
                    ? "You have ACCEPTED the offer from " + companyName + " for " + (job != null ? job.getJobTitle() : "") + "! Congratulations on your successful placement!"
                    : "You have REJECTED the offer from " + companyName + ".";
            notificationService.sendNotification(student, msg, "OFFER");
        }

        return mapEntityToResponse(updated);
    }

    public List<OfferResponse> getAllOffers() {
        return offerRepository.findAll().stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }

    public OfferResponse getOfferById(Long id) {
        Offer offer = offerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Offer not found with id: " + id));
        return mapEntityToResponse(offer);
    }

    public List<OfferResponse> getOffersByStudentId(Long studentId) {
        return offerRepository.findByApplicationStudentId(studentId).stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }

    public OfferResponse mapEntityToResponse(Offer offer) {
        Application app = offer.getApplication();
        Student student = app != null ? app.getStudent() : null;
        Job job = app != null ? app.getJob() : null;

        return new OfferResponse(
                offer.getId(),
                app != null ? app.getId() : null,
                offer.getOfferedSalary(),
                offer.getJoiningDate(),
                offer.getOfferStatus(),
                offer.getCreatedAt(),
                student != null ? student.getId() : null,
                student != null ? student.getName() : null,
                student != null ? student.getEmail() : null,
                student != null ? student.getBranch() : null,
                job != null ? job.getId() : null,
                job != null ? job.getJobTitle() : null,
                (job != null && job.getCompany() != null) ? job.getCompany().getCompanyName() : null
        );
    }
}