package com.smartcampus.placement.service;

import com.smartcampus.placement.dto.DashboardMetricsResponse;
import com.smartcampus.placement.entity.Application;
import com.smartcampus.placement.entity.Offer;
import com.smartcampus.placement.entity.Student;
import com.smartcampus.placement.repository.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final StudentRepository studentRepository;
    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final OfferRepository offerRepository;

    public AnalyticsService(
            StudentRepository studentRepository,
            CompanyRepository companyRepository,
            JobRepository jobRepository,
            ApplicationRepository applicationRepository,
            OfferRepository offerRepository) {
        this.studentRepository = studentRepository;
        this.companyRepository = companyRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.offerRepository = offerRepository;
    }

    public DashboardMetricsResponse getDashboardMetrics() {
        DashboardMetricsResponse metrics = new DashboardMetricsResponse();

        long totalStudents = studentRepository.count();
        long totalCompanies = companyRepository.count();
        long totalJobs = jobRepository.count();
        long totalApplications = applicationRepository.count();

        List<Application> applications = applicationRepository.findAll();
        long totalShortlisted = applications.stream()
                .filter(a -> "SHORTLISTED".equalsIgnoreCase(a.getStatus()) || "INTERVIEW".equalsIgnoreCase(a.getStatus()) || "SELECTED".equalsIgnoreCase(a.getStatus()))
                .count();
        long totalSelected = applications.stream()
                .filter(a -> "SELECTED".equalsIgnoreCase(a.getStatus()))
                .count();

        List<Offer> offers = offerRepository.findAll();
        long totalOffers = offers.size();
        long totalPlaced = offers.stream()
                .filter(o -> "ACCEPTED".equalsIgnoreCase(o.getOfferStatus()))
                .count();

        double placementRate = (totalStudents > 0)
                ? Math.round(((double) totalPlaced / totalStudents) * 1000.0) / 10.0
                : 0.0;

        double avgSalary = offers.stream()
                .mapToDouble(Offer::getOfferedSalary)
                .average()
                .orElse(0.0);
        avgSalary = Math.round(avgSalary * 100.0) / 100.0;

        double maxSalary = offers.stream()
                .mapToDouble(Offer::getOfferedSalary)
                .max()
                .orElse(0.0);

        // Branch breakdown
        List<Student> students = studentRepository.findAll();
        Map<String, Long> deptStats = students.stream()
                .collect(Collectors.groupingBy(
                        s -> (s.getBranch() != null && !s.getBranch().isBlank()) ? s.getBranch().toUpperCase() : "GENERAL",
                        Collectors.counting()
                ));

        // Application status breakdown
        Map<String, Long> statusStats = applications.stream()
                .collect(Collectors.groupingBy(
                        a -> (a.getStatus() != null) ? a.getStatus().toUpperCase() : "APPLIED",
                        Collectors.counting()
                ));

        metrics.setTotalStudents(totalStudents);
        metrics.setTotalCompanies(totalCompanies);
        metrics.setTotalJobs(totalJobs);
        metrics.setTotalApplications(totalApplications);
        metrics.setTotalShortlisted(totalShortlisted);
        metrics.setTotalSelected(totalSelected);
        metrics.setTotalOffers(totalOffers);
        metrics.setTotalPlacedStudents(totalPlaced);
        metrics.setPlacementRate(placementRate);
        metrics.setAveragePackage(avgSalary);
        metrics.setHighestPackage(maxSalary);
        metrics.setDepartmentStats(deptStats);
        metrics.setStatusStats(statusStats);

        return metrics;
    }
}
