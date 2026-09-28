package com.smartcampus.placement.controller;

import com.smartcampus.placement.dto.InterviewRequest;
import com.smartcampus.placement.dto.InterviewResponse;
import com.smartcampus.placement.service.InterviewService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/interviews")
public class InterviewController {

    private final InterviewService interviewService;

    public InterviewController(InterviewService interviewService) {
        this.interviewService = interviewService;
    }

    @PostMapping
    public ResponseEntity<InterviewResponse> scheduleInterview(@Valid @RequestBody InterviewRequest request) {
        InterviewResponse response = interviewService.scheduleInterview(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<InterviewResponse>> getAllInterviews() {
        return ResponseEntity.ok(interviewService.getAllInterviews());
    }

    @GetMapping("/{id}")
    public ResponseEntity<InterviewResponse> getInterviewById(@PathVariable Long id) {
        return ResponseEntity.ok(interviewService.getInterviewById(id));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<InterviewResponse>> getInterviewsByStudentId(@PathVariable Long studentId) {
        return ResponseEntity.ok(interviewService.getInterviewsByStudentId(studentId));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<InterviewResponse> updateInterviewStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return ResponseEntity.ok(interviewService.updateInterviewResult(id, status));
    }
}