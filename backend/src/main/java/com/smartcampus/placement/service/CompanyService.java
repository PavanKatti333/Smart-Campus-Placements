package com.smartcampus.placement.service;

import com.smartcampus.placement.dto.CompanyRequest;
import com.smartcampus.placement.dto.CompanyResponse;
import com.smartcampus.placement.entity.Company;
import com.smartcampus.placement.exception.ResourceNotFoundException;
import com.smartcampus.placement.repository.CompanyRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;

    public CompanyService(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    public CompanyResponse createCompany(CompanyRequest request) {
        if (companyRepository.existsByCompanyName(request.getCompanyName())) {
            throw new IllegalArgumentException("Company with name '" + request.getCompanyName() + "' already exists");
        }

        Company company = new Company();
        mapRequestToEntity(request, company);
        Company saved = companyRepository.save(company);
        return mapEntityToResponse(saved);
    }

    public List<CompanyResponse> getAllCompanies() {
        return companyRepository.findAll().stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }

    public CompanyResponse getCompanyById(Long id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + id));
        return mapEntityToResponse(company);
    }

    public CompanyResponse updateCompany(Long id, CompanyRequest request) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + id));

        if (!company.getCompanyName().equalsIgnoreCase(request.getCompanyName())
                && companyRepository.existsByCompanyName(request.getCompanyName())) {
            throw new IllegalArgumentException("Company with name '" + request.getCompanyName() + "' already exists");
        }

        mapRequestToEntity(request, company);
        Company updated = companyRepository.save(company);
        return mapEntityToResponse(updated);
    }

    public void deleteCompany(Long id) {
        if (!companyRepository.existsById(id)) {
            throw new ResourceNotFoundException("Company not found with id: " + id);
        }
        companyRepository.deleteById(id);
    }

    public Company getCompanyEntityById(Long id) {
        return companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + id));
    }

    private void mapRequestToEntity(CompanyRequest request, Company company) {
        company.setCompanyName(request.getCompanyName());
        company.setEmail(request.getEmail());
        company.setPhone(request.getPhone());
        company.setLocation(request.getLocation());
        company.setWebsite(request.getWebsite());
        company.setDescription(request.getDescription());
    }

    public CompanyResponse mapEntityToResponse(Company company) {
        return new CompanyResponse(
                company.getId(),
                company.getCompanyName(),
                company.getEmail(),
                company.getPhone(),
                company.getLocation(),
                company.getWebsite(),
                company.getDescription(),
                company.getCreatedAt()
        );
    }
}