package com.smartcampus.placement.controller;

import com.smartcampus.placement.dto.OfferRequest;
import com.smartcampus.placement.dto.OfferResponse;
import com.smartcampus.placement.service.OfferService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/offers")
public class OfferController {

    private final OfferService offerService;

    public OfferController(OfferService offerService) {
        this.offerService = offerService;
    }

    @PostMapping
    public ResponseEntity<OfferResponse> createOffer(@Valid @RequestBody OfferRequest request) {
        OfferResponse response = offerService.createOffer(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<OfferResponse>> getAllOffers() {
        return ResponseEntity.ok(offerService.getAllOffers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OfferResponse> getOfferById(@PathVariable Long id) {
        return ResponseEntity.ok(offerService.getOfferById(id));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<OfferResponse>> getOffersByStudentId(@PathVariable Long studentId) {
        return ResponseEntity.ok(offerService.getOffersByStudentId(studentId));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<OfferResponse> updateOfferStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return ResponseEntity.ok(offerService.updateOfferStatus(id, status));
    }
}