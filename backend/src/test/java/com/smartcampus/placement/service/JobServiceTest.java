package com.smartcampus.placement.service;

import com.smartcampus.placement.dto.JobRequest;
import com.smartcampus.placement.dto.JobResponse;
import com.smartcampus.placement.entity.Company;
import com.smartcampus.placement.entity.Job;
import com.smartcampus.placement.exception.ResourceNotFoundException;
import com.smartcampus.placement.repository.CompanyRepository;
import com.smartcampus.placement.repository.JobRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class JobServiceTest {

    @Mock
    private JobRepository jobRepository;

    @Mock
    private CompanyRepository companyRepository;

    @InjectMocks
    private JobService jobService;

    private Company company;
    private JobRequest jobRequest;
    private Job job;

    @BeforeEach
    void setUp() {
        company = new Company();
        company.setId(1L);
        company.setCompanyName("TCS");
        company.setEmail("campus@tcs.com");

        jobRequest = new JobRequest();
        jobRequest.setCompanyId(1L);
        jobRequest.setJobTitle("Software Engineer");
        jobRequest.setJobDescription("Full-stack Java development");
        jobRequest.setSalary(750000.0);
        jobRequest.setMinimumCgpa(7.0);
        jobRequest.setAllowedBranch("CSE, IT, ECE");
        jobRequest.setMaximumBacklogs(0);
        jobRequest.setApplicationDeadline(LocalDate.now().plusDays(30));
        jobRequest.setStatus("OPEN");

        job = new Job();
        job.setId(10L);
        job.setCompany(company);
        job.setJobTitle("Software Engineer");
        job.setJobDescription("Full-stack Java development");
        job.setSalary(750000.0);
        job.setMinimumCgpa(7.0);
        job.setAllowedBranch("CSE, IT, ECE");
        job.setMaximumBacklogs(0);
        job.setApplicationDeadline(LocalDate.now().plusDays(30));
        job.setStatus("OPEN");
    }

    @Test
    void testCreateJobSuccess() {
        when(companyRepository.findById(1L)).thenReturn(Optional.of(company));
        when(jobRepository.save(any(Job.class))).thenReturn(job);

        JobResponse response = jobService.createJob(jobRequest);

        assertNotNull(response);
        assertEquals("Software Engineer", response.getJobTitle());
        assertEquals("TCS", response.getCompanyName());
        assertEquals(750000.0, response.getSalary());
        verify(jobRepository, times(1)).save(any(Job.class));
    }

    @Test
    void testCreateJobCompanyNotFound() {
        when(companyRepository.findById(99L)).thenReturn(Optional.empty());
        jobRequest.setCompanyId(99L);

        assertThrows(ResourceNotFoundException.class, () -> jobService.createJob(jobRequest));
        verify(jobRepository, never()).save(any(Job.class));
    }

    @Test
    void testGetJobByIdSuccess() {
        when(jobRepository.findById(10L)).thenReturn(Optional.of(job));

        JobResponse response = jobService.getJobById(10L);

        assertNotNull(response);
        assertEquals(10L, response.getId());
        assertEquals("Software Engineer", response.getJobTitle());
    }

    @Test
    void testGetJobByIdNotFound() {
        when(jobRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> jobService.getJobById(999L));
    }

    @Test
    void testGetAllJobs() {
        when(jobRepository.findAll()).thenReturn(List.of(job));

        List<JobResponse> list = jobService.getAllJobs();

        assertEquals(1, list.size());
        assertEquals("Software Engineer", list.get(0).getJobTitle());
    }
}
