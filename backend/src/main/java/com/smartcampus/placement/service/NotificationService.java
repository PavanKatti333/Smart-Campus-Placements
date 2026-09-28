package com.smartcampus.placement.service;

import com.smartcampus.placement.dto.NotificationResponse;
import com.smartcampus.placement.entity.Notification;
import com.smartcampus.placement.entity.Student;
import com.smartcampus.placement.exception.ResourceNotFoundException;
import com.smartcampus.placement.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public Notification sendNotification(Student student, String message, String type) {
        Notification notification = new Notification(student, message, type);
        return notificationRepository.save(notification);
    }

    public List<NotificationResponse> getNotificationsForStudent(Long studentId) {
        return notificationRepository.findByStudentIdOrderByCreatedAtDesc(studentId).stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }

    public NotificationResponse markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + id));
        notification.setRead(true);
        Notification updated = notificationRepository.save(notification);
        return mapEntityToResponse(updated);
    }

    public long getUnreadCount(Long studentId) {
        return notificationRepository.countByStudentIdAndIsReadFalse(studentId);
    }

    private NotificationResponse mapEntityToResponse(Notification n) {
        return new NotificationResponse(
                n.getId(),
                n.getStudent() != null ? n.getStudent().getId() : null,
                n.getMessage(),
                n.getType(),
                n.isRead(),
                n.getCreatedAt()
        );
    }
}
