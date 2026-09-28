package com.smartcampus.placement.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "application", uniqueConstraints = {
    @UniqueConstraint(name = "uk_student_job", columnNames = {"student_id", "job_id"})
})
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @Column(nullable = false)
    private String status;

    private LocalDateTime appliedDate;

    @Column(length = 500)
    private String eligibilityRemarks;

    @PrePersist
    protected void onCreate() {
        if (this.appliedDate == null) {
            this.appliedDate = LocalDateTime.now();
        }
    }

    public Application() {
    }

    public Application(Student student, Job job, String status, String eligibilityRemarks) {
        this.student = student;
        this.job = job;
        this.status = status;
        this.eligibilityRemarks = eligibilityRemarks;
        this.appliedDate = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public Job getJob() {
        return job;
    }

    public void setJob(Job job) {
        this.job = job;
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
}