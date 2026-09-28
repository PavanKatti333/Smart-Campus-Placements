package com.smartcampus.placement.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class JobResponse {

    private Long id;
    private String jobTitle;
    private String jobDescription;
    private double salary;
    private double minimumCgpa;
    private String allowedBranch;
    private int maximumBacklogs;
    private LocalDate applicationDeadline;
    private String status;
    private Long companyId;
    private String companyName;
    private String companyLocation;
    private LocalDateTime createdAt;

    public JobResponse() {
    }

    public JobResponse(Long id, String jobTitle, String jobDescription, double salary,
                       double minimumCgpa, String allowedBranch, int maximumBacklogs,
                       LocalDate applicationDeadline, String status, Long companyId,
                       String companyName, String companyLocation, LocalDateTime createdAt) {
        this.id = id;
        this.jobTitle = jobTitle;
        this.jobDescription = jobDescription;
        this.salary = salary;
        this.minimumCgpa = minimumCgpa;
        this.allowedBranch = allowedBranch;
        this.maximumBacklogs = maximumBacklogs;
        this.applicationDeadline = applicationDeadline;
        this.status = status;
        this.companyId = companyId;
        this.companyName = companyName;
        this.companyLocation = companyLocation;
        this.createdAt = createdAt;
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

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getCompanyLocation() {
        return companyLocation;
    }

    public void setCompanyLocation(String companyLocation) {
        this.companyLocation = companyLocation;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
