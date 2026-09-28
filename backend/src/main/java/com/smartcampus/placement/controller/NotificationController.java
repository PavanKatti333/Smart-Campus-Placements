package com.smartcampus.placement.controller;

import com.smartcampus.placement.dto.NotificationResponse;
import com.smartcampus.placement.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<NotificationResponse>> getStudentNotifications(@PathVariable Long studentId) {
        return ResponseEntity.ok(notificationService.getNotificationsForStudent(studentId));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<NotificationResponse> markAsRead(@PathVariable Long id) {
        return ResponseEntity.ok(notificationService.markAsRead(id));
    }
}
