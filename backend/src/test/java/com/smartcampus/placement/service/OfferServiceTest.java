package com.smartcampus.placement.service;

import com.smartcampus.placement.dto.OfferRequest;
import com.smartcampus.placement.dto.OfferResponse;
import com.smartcampus.placement.entity.Application;
import com.smartcampus.placement.entity.Company;
import com.smartcampus.placement.entity.Job;
import com.smartcampus.placement.entity.Offer;
import com.smartcampus.placement.entity.Student;
import com.smartcampus.placement.exception.InvalidStatusTransitionException;
import com.smartcampus.placement.repository.ApplicationRepository;
import com.smartcampus.placement.repository.OfferRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class OfferServiceTest {

    @Mock
    private OfferRepository offerRepository;

    @Mock
    private ApplicationRepository applicationRepository;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private OfferService offerService;

    private Application application;
    private Student student;
    private Job job;
    private Company company;

    @BeforeEach
    void setUp() {
        company = new Company("Accenture", "hr@accenture.com", "9876543210", "Hyderabad", "accenture.com", "Consulting");
        company.setId(1L);

        student = new Student("Pavan", "pavan@example.com", "pwd", "9876543210", "CSE", 8.8, 0, 2027, null, "STUDENT");
        student.setId(1L);

        job = new Job("Full Stack Developer", "Spring & React", 850000.0, 7.5, "CSE", 0, LocalDate.now().plusDays(30), "OPEN", company);
        job.setId(1L);

        application = new Application(student, job, "SELECTED", "Passed interview");
        application.setId(10L);
    }

    @Test
    void testCreateOfferSuccess() {
        when(applicationRepository.findById(10L)).thenReturn(Optional.of(application));
        when(offerRepository.existsByApplicationId(10L)).thenReturn(false);

        Offer savedOffer = new Offer(application, 850000.0, LocalDate.now().plusMonths(3), "GENERATED");
        savedOffer.setId(100L);
        savedOffer.setCreatedAt(LocalDateTime.now());
        when(offerRepository.save(any(Offer.class))).thenReturn(savedOffer);

        OfferRequest request = new OfferRequest(10L, 850000.0, LocalDate.now().plusMonths(3));
        OfferResponse response = offerService.createOffer(request);

        assertNotNull(response);
        assertEquals(100L, response.getId());
        assertEquals("GENERATED", response.getOfferStatus());
        assertEquals(850000.0, response.getOfferedSalary());
        verify(notificationService, times(1)).sendNotification(eq(student), anyString(), eq("OFFER"));
    }

    @Test
    void testCreateOfferNotSelectedThrows() {
        application.setStatus("SHORTLISTED");
        when(applicationRepository.findById(10L)).thenReturn(Optional.of(application));

        OfferRequest request = new OfferRequest(10L, 850000.0, LocalDate.now().plusMonths(3));
        assertThrows(InvalidStatusTransitionException.class, () -> {
            offerService.createOffer(request);
        });

        verify(offerRepository, never()).save(any(Offer.class));
    }

    @Test
    void testDuplicateOfferThrows() {
        when(applicationRepository.findById(10L)).thenReturn(Optional.of(application));
        when(offerRepository.existsByApplicationId(10L)).thenReturn(true);

        OfferRequest request = new OfferRequest(10L, 850000.0, LocalDate.now().plusMonths(3));
        assertThrows(IllegalArgumentException.class, () -> {
            offerService.createOffer(request);
        });

        verify(offerRepository, never()).save(any(Offer.class));
    }

    @Test
    void testAcceptOfferSuccess() {
        Offer offer = new Offer(application, 850000.0, LocalDate.now().plusMonths(3), "GENERATED");
        offer.setId(100L);
        when(offerRepository.findById(100L)).thenReturn(Optional.of(offer));
        when(offerRepository.save(any(Offer.class))).thenAnswer(i -> i.getArgument(0));

        OfferResponse response = offerService.updateOfferStatus(100L, "ACCEPTED");

        assertEquals("ACCEPTED", response.getOfferStatus());
        verify(notificationService, times(1)).sendNotification(eq(student), contains("ACCEPTED"), eq("OFFER"));
    }

    @Test
    void testRejectOfferSuccess() {
        Offer offer = new Offer(application, 850000.0, LocalDate.now().plusMonths(3), "GENERATED");
        offer.setId(100L);
        when(offerRepository.findById(100L)).thenReturn(Optional.of(offer));
        when(offerRepository.save(any(Offer.class))).thenAnswer(i -> i.getArgument(0));

        OfferResponse response = offerService.updateOfferStatus(100L, "REJECTED");

        assertEquals("REJECTED", response.getOfferStatus());
        verify(notificationService, times(1)).sendNotification(eq(student), contains("REJECTED"), eq("OFFER"));
    }
}
