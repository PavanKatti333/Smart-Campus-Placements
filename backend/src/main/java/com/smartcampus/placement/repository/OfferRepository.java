package com.smartcampus.placement.repository;

import com.smartcampus.placement.entity.Offer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OfferRepository extends JpaRepository<Offer, Long> {

    boolean existsByApplicationId(Long applicationId);

    Optional<Offer> findByApplicationId(Long applicationId);

    List<Offer> findByApplicationStudentId(Long studentId);

    List<Offer> findByOfferStatus(String offerStatus);
}