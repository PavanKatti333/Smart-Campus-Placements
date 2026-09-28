package com.smartcampus.placement.service;

import com.smartcampus.placement.dto.CompanyRequest;
import com.smartcampus.placement.dto.CompanyResponse;
import com.smartcampus.placement.entity.Company;
import com.smartcampus.placement.exception.ResourceNotFoundException;
import com.smartcampus.placement.repository.CompanyRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CompanyServiceTest {

    @Mock
    private CompanyRepository companyRepository;

    @InjectMocks
    private CompanyService companyService;

    private CompanyRequest companyRequest;
    private Company company;

    @BeforeEach
    void setUp() {
        companyRequest = new CompanyRequest();
        companyRequest.setCompanyName("TCS");
        companyRequest.setEmail("campus@tcs.com");
        companyRequest.setPhone("022-67789999");
        companyRequest.setLocation("Mumbai, Maharashtra");
        companyRequest.setWebsite("https://www.tcs.com");
        companyRequest.setDescription("Global leader in IT services");

        company = new Company();
        company.setId(1L);
        company.setCompanyName("TCS");
        company.setEmail("campus@tcs.com");
        company.setPhone("022-67789999");
        company.setLocation("Mumbai, Maharashtra");
        company.setWebsite("https://www.tcs.com");
        company.setDescription("Global leader in IT services");
    }

    @Test
    void testCreateCompanySuccess() {
        when(companyRepository.existsByCompanyName("TCS")).thenReturn(false);
        when(companyRepository.save(any(Company.class))).thenReturn(company);

        CompanyResponse response = companyService.createCompany(companyRequest);

        assertNotNull(response);
        assertEquals("TCS", response.getCompanyName());
        assertEquals("campus@tcs.com", response.getEmail());
        verify(companyRepository, times(1)).save(any(Company.class));
    }

    @Test
    void testCreateCompanyDuplicateThrowsException() {
        when(companyRepository.existsByCompanyName("TCS")).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> companyService.createCompany(companyRequest));
        verify(companyRepository, never()).save(any(Company.class));
    }

    @Test
    void testGetCompanyByIdSuccess() {
        when(companyRepository.findById(1L)).thenReturn(Optional.of(company));

        CompanyResponse response = companyService.getCompanyById(1L);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("TCS", response.getCompanyName());
    }

    @Test
    void testGetCompanyByIdNotFound() {
        when(companyRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> companyService.getCompanyById(99L));
    }

    @Test
    void testGetAllCompanies() {
        when(companyRepository.findAll()).thenReturn(List.of(company));

        List<CompanyResponse> list = companyService.getAllCompanies();

        assertEquals(1, list.size());
        assertEquals("TCS", list.get(0).getCompanyName());
    }
}
