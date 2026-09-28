package com.smartcampus.placement.dto;

import java.time.LocalDateTime;

public class CompanyResponse {

    private Long id;
    private String companyName;
    private String email;
    private String phone;
    private String location;
    private String website;
    private String description;
    private LocalDateTime createdAt;

    public CompanyResponse() {
    }

    public CompanyResponse(Long id, String companyName, String email, String phone,
                           String location, String website, String description, LocalDateTime createdAt) {
        this.id = id;
        this.companyName = companyName;
        this.email = email;
        this.phone = phone;
        this.location = location;
        this.website = website;
        this.description = description;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
