package com.smartcampus.placement.dto;

import java.util.ArrayList;
import java.util.List;

public class EligibilityResult {

    private boolean eligible;
    private String status;
    private String message;
    private List<String> reasons = new ArrayList<>();

    public EligibilityResult() {
    }

    public EligibilityResult(boolean eligible, String status, String message, List<String> reasons) {
        this.eligible = eligible;
        this.status = status;
        this.message = message;
        this.reasons = reasons;
    }

    public boolean isEligible() {
        return eligible;
    }

    public void setEligible(boolean eligible) {
        this.eligible = eligible;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<String> getReasons() {
        return reasons;
    }

    public void setReasons(List<String> reasons) {
        this.reasons = reasons;
    }
}
