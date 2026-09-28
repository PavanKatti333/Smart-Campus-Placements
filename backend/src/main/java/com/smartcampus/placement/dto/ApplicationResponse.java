package com.smartcampus.placement.dto;

import java.time.LocalDateTime;

public class ApplicationResponse {

    private Long id;
    private String status;
    private LocalDateTime appliedDate;
    private String eligibilityRemarks;

    // Student Summary
    private Long studentId;
    private String studentName;
    private String studentEmail;
    private String studentBranch;
    private double studentCgpa;
    private int studentBacklogs;

    // Job Summary
    private Long jobId;
    private String jobTitle;
    private double jobSalary;
    private String companyName;

    public ApplicationResponse() {
    }

    public ApplicationResponse(Long id, String status, LocalDateTime appliedDate, String eligibilityRemarks,
                               Long studentId, String studentName, String studentEmail, String studentBranch,
                               double studentCgpa, int studentBacklogs, Long jobId, String jobTitle,
                               double jobSalary, String companyName) {
        this.id = id;
        this.status = status;
        this.appliedDate = appliedDate;
        this.eligibilityRemarks = eligibilityRemarks;
        this.studentId = studentId;
        this.studentName = studentName;
        this.studentEmail = studentEmail;
        this.studentBranch = studentBranch;
        this.studentCgpa = studentCgpa;
        this.studentBacklogs = studentBacklogs;
        this.jobId = jobId;
        this.jobTitle = jobTitle;
        this.jobSalary = jobSalary;
        this.companyName = companyName;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getAppliedDate() {
        return appliedDate;
    }

    public void setAppliedDate(LocalDateTime appliedDate) {
        this.appliedDate = appliedDate;
    }

    public String getEligibilityRemarks() {
        return eligibilityRemarks;
    }

    public void setEligibilityRemarks(String eligibilityRemarks) {
        this.eligibilityRemarks = eligibilityRemarks;
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

    public double getStudentCgpa() {
        return studentCgpa;
    }

    public void setStudentCgpa(double studentCgpa) {
        this.studentCgpa = studentCgpa;
    }

    public int getStudentBacklogs() {
        return studentBacklogs;
    }

    public void setStudentBacklogs(int studentBacklogs) {
        this.studentBacklogs = studentBacklogs;
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

    public double getJobSalary() {
        return jobSalary;
    }

    public void setJobSalary(double jobSalary) {
        this.jobSalary = jobSalary;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }
}
