package com.smartcampus.placement.repository;

import com.smartcampus.placement.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {

    boolean existsByCompanyName(String companyName);

    Optional<Company> findByCompanyName(String companyName);
}