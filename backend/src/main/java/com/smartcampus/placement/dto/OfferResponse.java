package com.smartcampus.placement.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class OfferResponse {

    private Long id;
    private Long applicationId;
    private double offeredSalary;
    private LocalDate joiningDate;
    private String offerStatus;
    private LocalDateTime createdAt;

    // Additional context
    private Long studentId;
    private String studentName;
    private String studentEmail;
    private String studentBranch;
    private Long jobId;
    private String jobTitle;
    private String companyName;

    public OfferResponse() {
    }

    public OfferResponse(Long id, Long applicationId, double offeredSalary, LocalDate joiningDate,
                         String offerStatus, LocalDateTime createdAt, Long studentId,
                         String studentName, String studentEmail, String studentBranch,
                         Long jobId, String jobTitle, String companyName) {
        this.id = id;
        this.applicationId = applicationId;
        this.offeredSalary = offeredSalary;
        this.joiningDate = joiningDate;
        this.offerStatus = offerStatus;
        this.createdAt = createdAt;
        this.studentId = studentId;
        this.studentName = studentName;
        this.studentEmail = studentEmail;
        this.studentBranch = studentBranch;
        this.jobId = jobId;
        this.jobTitle = jobTitle;
        this.companyName = companyName;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getApplicationId() {
        return applicationId;
    }

    public void setApplicationId(Long applicationId) {
        this.applicationId = applicationId;
    }

    public double getOfferedSalary() {
        return offeredSalary;
    }

    public void setOfferedSalary(double offeredSalary) {
        this.offeredSalary = offeredSalary;
    }

    public LocalDate getJoiningDate() {
        return joiningDate;
    }

    public void setJoiningDate(LocalDate joiningDate) {
        this.joiningDate = joiningDate;
    }

    public String getOfferStatus() {
        return offerStatus;
    }

    public void setOfferStatus(String offerStatus) {
        this.offerStatus = offerStatus;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getStudentEmail() {
        return studentEmail;
    }

    public void setStudentEmail(String studentEmail) {
        this.studentEmail = studentEmail;
    }

    public String getStudentBranch() {
        return studentBranch;
    }

    public void setStudentBranch(String studentBranch) {
        this.studentBranch = studentBranch;
    }

    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }
}
