package com.smartcampus.placement.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDate;

public class OfferRequest {

    @NotNull(message = "Application ID is required")
    private Long applicationId;

    @Positive(message = "Offered salary must be greater than 0")
    private double offeredSalary;

    @NotNull(message = "Joining date is required")
    private LocalDate joiningDate;

    public OfferRequest() {
    }

    public OfferRequest(Long applicationId, double offeredSalary, LocalDate joiningDate) {
        this.applicationId = applicationId;
        this.offeredSalary = offeredSalary;
        this.joiningDate = joiningDate;
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
}
