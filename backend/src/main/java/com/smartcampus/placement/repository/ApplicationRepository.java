package com.smartcampus.placement.repository;

import com.smartcampus.placement.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    boolean existsByStudentIdAndJobId(Long studentId, Long jobId);

    Optional<Application> findByStudentIdAndJobId(Long studentId, Long jobId);

    List<Application> findByStudentId(Long studentId);

    List<Application> findByJobId(Long jobId);

    List<Application> findByStatus(String status);
}