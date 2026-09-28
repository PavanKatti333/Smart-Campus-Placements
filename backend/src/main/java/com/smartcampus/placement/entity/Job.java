package com.smartcampus.placement.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "job")
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Job title is required")
    @Column(nullable = false)
    private String jobTitle;

    @NotBlank(message = "Job description is required")
    @Column(columnDefinition = "TEXT", nullable = false)
    private String jobDescription;

    @Positive(message = "Salary must be greater than 0")
    @Column(nullable = false)
    private double salary;

    @DecimalMin(value = "0.0", message = "Minimum CGPA must be at least 0.0")
    @DecimalMax(value = "10.0", message = "Minimum CGPA cannot exceed 10.0")
    private double minimumCgpa;

    private String allowedBranch;

    @Min(value = 0, message = "Maximum backlogs cannot be negative")
    private int maximumBacklogs;

    @NotNull(message = "Application deadline is required")
    private LocalDate applicationDeadline;

    @Column(nullable = false)
    private String status = "OPEN";

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.status == null || this.status.isBlank()) {
            this.status = "OPEN";
        }
    }

    public Job() {
    }

    public Job(String jobTitle, String jobDescription, double salary, double minimumCgpa,
               String allowedBranch, int maximumBacklogs, LocalDate applicationDeadline,
               String status, Company company) {
        this.jobTitle = jobTitle;
        this.jobDescription = jobDescription;
        this.salary = salary;
        this.minimumCgpa = minimumCgpa;
        this.allowedBranch = allowedBranch;
        this.maximumBacklogs = maximumBacklogs;
        this.applicationDeadline = applicationDeadline;
        this.status = status != null ? status : "OPEN";
        this.company = company;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getJobDescription() {
        return jobDescription;
    }

    public void setJobDescription(String jobDescription) {
        this.jobDescription = jobDescription;
    }

    public double getSalary() {
        return salary;
    }

    public void setSalary(double salary) {
        this.salary = salary;
    }

    public double getMinimumCgpa() {
        return minimumCgpa;
    }

    public void setMinimumCgpa(double minimumCgpa) {
        this.minimumCgpa = minimumCgpa;
    }

    public String getAllowedBranch() {
        return allowedBranch;
    }

    public void setAllowedBranch(String allowedBranch) {
        this.allowedBranch = allowedBranch;
    }

    public int getMaximumBacklogs() {
        return maximumBacklogs;
    }

    public void setMaximumBacklogs(int maximumBacklogs) {
        this.maximumBacklogs = maximumBacklogs;
    }

    public LocalDate getApplicationDeadline() {
        return applicationDeadline;
    }

    public void setApplicationDeadline(LocalDate applicationDeadline) {
        this.applicationDeadline = applicationDeadline;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Company getCompany() {
        return company;
    }

    public void setCompany(Company company) {
        this.company = company;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}