package com.smartcampus.placement.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "interview")
public class Interview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    @NotNull(message = "Interview date is required")
    @Column(nullable = false)
    private LocalDate interviewDate;

    @NotNull(message = "Interview time is required")
    @Column(nullable = false)
    private LocalTime interviewTime;

    @NotBlank(message = "Interview type is required")
    @Column(nullable = false)
    private String interviewType; // ONLINE or OFFLINE

    @NotBlank(message = "Interviewer name/details required")
    @Column(nullable = false)
    private String interviewer;

    @Column(nullable = false)
    private String status = "SCHEDULED"; // SCHEDULED, PASSED, FAILED

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.status == null || this.status.isBlank()) {
            this.status = "SCHEDULED";
        }
    }

    public Interview() {
    }

    public Interview(Application application, LocalDate interviewDate, LocalTime interviewTime,
                     String interviewType, String interviewer, String status) {
        this.application = application;
        this.interviewDate = interviewDate;
        this.interviewTime = interviewTime;
        this.interviewType = interviewType;
        this.interviewer = interviewer;
        this.status = status != null ? status : "SCHEDULED";
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Application getApplication() {
        return application;
    }

    public void setApplication(Application application) {
        this.application = application;
    }

    public LocalDate getInterviewDate() {
        return interviewDate;
    }

    public void setInterviewDate(LocalDate interviewDate) {
        this.interviewDate = interviewDate;
    }

    public LocalTime getInterviewTime() {
        return interviewTime;
    }

    public void setInterviewTime(LocalTime interviewTime) {
        this.interviewTime = interviewTime;
    }

    public String getInterviewType() {
        return interviewType;
    }

    public void setInterviewType(String interviewType) {
        this.interviewType = interviewType;
    }

    public String getInterviewer() {
        return interviewer;
    }

    public void setInterviewer(String interviewer) {
        this.interviewer = interviewer;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
