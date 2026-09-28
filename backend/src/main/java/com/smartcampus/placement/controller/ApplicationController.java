package com.smartcampus.placement.controller;

import com.smartcampus.placement.dto.ApplicationRequest;
import com.smartcampus.placement.dto.ApplicationResponse;
import com.smartcampus.placement.dto.EligibilityResult;
import com.smartcampus.placement.service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping
    public ResponseEntity<ApplicationResponse> apply(@Valid @RequestBody ApplicationRequest request) {
        ApplicationResponse response = applicationService.apply(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ApplicationResponse>> getAllApplications() {
        return ResponseEntity.ok(applicationService.getAllApplications());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApplicationResponse> getApplicationById(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.getApplicationById(id));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<ApplicationResponse>> getApplicationsByStudentId(@PathVariable Long studentId) {
        return ResponseEntity.ok(applicationService.getApplicationsByStudentId(studentId));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApplicationResponse> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return ResponseEntity.ok(applicationService.updateStatus(id, status));
    }

    @GetMapping("/check-eligibility")
    public ResponseEntity<EligibilityResult> checkEligibility(
            @RequestParam Long studentId,
            @RequestParam Long jobId) {
        return ResponseEntity.ok(applicationService.checkPreEligibility(studentId, jobId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteApplication(@PathVariable Long id) {
        applicationService.deleteApplication(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Application deleted successfully with id: " + id);
        return ResponseEntity.ok(response);
    }
}
