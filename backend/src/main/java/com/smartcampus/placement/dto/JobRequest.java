package com.smartcampus.placement.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public class JobRequest {

    @NotNull(message = "Company ID is required")
    private Long companyId;

    @NotBlank(message = "Job title is required")
    private String jobTitle;

    @NotBlank(message = "Job description is required")
    private String jobDescription;

    @Positive(message = "Salary must be greater than 0")
    private double salary;

    @DecimalMin(value = "0.0", message = "Minimum CGPA must be at least 0.0")
    @DecimalMax(value = "10.0", message = "Minimum CGPA cannot exceed 10.0")
    private double minimumCgpa;

    private String allowedBranch;

    @Min(value = 0, message = "Maximum backlogs cannot be negative")
    private int maximumBacklogs;

    @NotNull(message = "Application deadline is required")
    private LocalDate applicationDeadline;

    private String status = "OPEN";

    public JobRequest() {
    }

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
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
}
