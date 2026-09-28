package com.smartcampus.placement.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "offer", uniqueConstraints = {
    @UniqueConstraint(name = "uk_offer_application", columnNames = "application_id")
})
public class Offer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "application_id", nullable = false, unique = true)
    private Application application;

    @Positive(message = "Offered salary must be greater than 0")
    @Column(nullable = false)
    private double offeredSalary;

    @NotNull(message = "Joining date is required")
    @Column(nullable = false)
    private LocalDate joiningDate;

    @Column(nullable = false)
    private String offerStatus = "GENERATED"; // GENERATED, ACCEPTED, REJECTED

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.offerStatus == null || this.offerStatus.isBlank()) {
            this.offerStatus = "GENERATED";
        }
    }

    public Offer() {
    }

    public Offer(Application application, double offeredSalary, LocalDate joiningDate, String offerStatus) {
        this.application = application;
        this.offeredSalary = offeredSalary;
        this.joiningDate = joiningDate;
        this.offerStatus = offerStatus != null ? offerStatus : "GENERATED";
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
}