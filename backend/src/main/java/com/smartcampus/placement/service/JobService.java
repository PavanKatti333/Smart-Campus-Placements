package com.smartcampus.placement.service;

import com.smartcampus.placement.dto.JobRequest;
import com.smartcampus.placement.dto.JobResponse;
import com.smartcampus.placement.entity.Company;
import com.smartcampus.placement.entity.Job;
import com.smartcampus.placement.exception.ResourceNotFoundException;
import com.smartcampus.placement.repository.CompanyRepository;
import com.smartcampus.placement.repository.JobRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final CompanyRepository companyRepository;

    public JobService(JobRepository jobRepository, CompanyRepository companyRepository) {
        this.jobRepository = jobRepository;
        this.companyRepository = companyRepository;
    }

    public JobResponse createJob(JobRequest request) {
        Company company = companyRepository.findById(request.getCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + request.getCompanyId()));

        Job job = new Job();
        mapRequestToEntity(request, job, company);
        Job saved = jobRepository.save(job);
        return mapEntityToResponse(saved);
    }

    public List<JobResponse> getAllJobs() {
        return jobRepository.findAll().stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }

    public JobResponse getJobById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));
        return mapEntityToResponse(job);
    }

    public JobResponse updateJob(Long id, JobRequest request) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));

        Company company = job.getCompany();
        if (request.getCompanyId() != null && !request.getCompanyId().equals(company.getId())) {
            company = companyRepository.findById(request.getCompanyId())
                    .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + request.getCompanyId()));
        }

        mapRequestToEntity(request, job, company);
        Job updated = jobRepository.save(job);
        return mapEntityToResponse(updated);
    }

    public void deleteJob(Long id) {
        if (!jobRepository.existsById(id)) {
            throw new ResourceNotFoundException("Job not found with id: " + id);
        }
        jobRepository.deleteById(id);
    }

    public Job getJobEntityById(Long id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));
    }

    private void mapRequestToEntity(JobRequest request, Job job, Company company) {
        job.setCompany(company);
        job.setJobTitle(request.getJobTitle());
        job.setJobDescription(request.getJobDescription());
        job.setSalary(request.getSalary());
        job.setMinimumCgpa(request.getMinimumCgpa());
        job.setAllowedBranch(request.getAllowedBranch());
        job.setMaximumBacklogs(request.getMaximumBacklogs());
        job.setApplicationDeadline(request.getApplicationDeadline());
        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            job.setStatus(request.getStatus());
        }
    }

    public JobResponse mapEntityToResponse(Job job) {
        Company company = job.getCompany();
        return new JobResponse(
                job.getId(),
                job.getJobTitle(),
                job.getJobDescription(),
                job.getSalary(),
                job.getMinimumCgpa(),
                job.getAllowedBranch(),
                job.getMaximumBacklogs(),
                job.getApplicationDeadline(),
                job.getStatus(),
                company != null ? company.getId() : null,
                company != null ? company.getCompanyName() : null,
                company != null ? company.getLocation() : null,
                job.getCreatedAt()
        );
    }
}