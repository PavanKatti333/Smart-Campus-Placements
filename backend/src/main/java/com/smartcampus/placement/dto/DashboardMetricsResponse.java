package com.smartcampus.placement.dto;

import java.util.Map;

public class DashboardMetricsResponse {

    private long totalStudents;
    private long totalCompanies;
    private long totalJobs;
    private long totalApplications;
    private long totalShortlisted;
    private long totalSelected;
    private long totalOffers;
    private long totalPlacedStudents;
    private double placementRate;
    private double averagePackage;
    private double highestPackage;
    private Map<String, Long> departmentStats;
    private Map<String, Long> statusStats;

    public DashboardMetricsResponse() {
    }

    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public long getTotalCompanies() {
        return totalCompanies;
    }

    public void setTotalCompanies(long totalCompanies) {
        this.totalCompanies = totalCompanies;
    }

    public long getTotalJobs() {
        return totalJobs;
    }

    public void setTotalJobs(long totalJobs) {
        this.totalJobs = totalJobs;
    }

    public long getTotalApplications() {
        return totalApplications;
    }

    public void setTotalApplications(long totalApplications) {
        this.totalApplications = totalApplications;
    }

    public long getTotalShortlisted() {
        return totalShortlisted;
    }

    public void setTotalShortlisted(long totalShortlisted) {
        this.totalShortlisted = totalShortlisted;
    }

    public long getTotalSelected() {
        return totalSelected;
    }

    public void setTotalSelected(long totalSelected) {
        this.totalSelected = totalSelected;
    }

    public long getTotalOffers() {
        return totalOffers;
    }

    public void setTotalOffers(long totalOffers) {
        this.totalOffers = totalOffers;
    }

    public long getTotalPlacedStudents() {
        return totalPlacedStudents;
    }

    public void setTotalPlacedStudents(long totalPlacedStudents) {
        this.totalPlacedStudents = totalPlacedStudents;
    }

    public double getPlacementRate() {
        return placementRate;
    }

    public void setPlacementRate(double placementRate) {
        this.placementRate = placementRate;
    }

    public double getAveragePackage() {
        return averagePackage;
    }

    public void setAveragePackage(double averagePackage) {
        this.averagePackage = averagePackage;
    }

    public double getHighestPackage() {
        return highestPackage;
    }

    public void setHighestPackage(double highestPackage) {
        this.highestPackage = highestPackage;
    }

    public Map<String, Long> getDepartmentStats() {
        return departmentStats;
    }

    public void setDepartmentStats(Map<String, Long> departmentStats) {
        this.departmentStats = departmentStats;
    }

    public Map<String, Long> getStatusStats() {
        return statusStats;
    }

    public void setStatusStats(Map<String, Long> statusStats) {
        this.statusStats = statusStats;
    }
}
