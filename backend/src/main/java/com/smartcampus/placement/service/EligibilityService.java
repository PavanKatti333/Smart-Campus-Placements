package com.smartcampus.placement.service;

import com.smartcampus.placement.dto.EligibilityResult;
import com.smartcampus.placement.entity.Job;
import com.smartcampus.placement.entity.Student;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class EligibilityService {

    public EligibilityResult checkEligibility(Student student, Job job) {
        List<String> failureReasons = new ArrayList<>();

        // 1. Check Job Deadline
        if (job.getApplicationDeadline() != null && job.getApplicationDeadline().isBefore(LocalDate.now())) {
            failureReasons.add("Application deadline passed on " + job.getApplicationDeadline());
        }

        // 2. Check Job Status
        if ("CLOSED".equalsIgnoreCase(job.getStatus())) {
            failureReasons.add("Job posting is closed");
        }

        // 3. Check CGPA
        if (student.getCgpa() < job.getMinimumCgpa()) {
            failureReasons.add("Minimum CGPA required is " + job.getMinimumCgpa() + " (student CGPA: " + student.getCgpa() + ")");
        }

        // 4. Check Backlogs
        if (student.getBacklogs() > job.getMaximumBacklogs()) {
            failureReasons.add("Maximum backlogs allowed is " + job.getMaximumBacklogs() + " (student has: " + student.getBacklogs() + ")");
        }

        // 5. Check Allowed Branch
        String allowedBranch = job.getAllowedBranch();
        if (allowedBranch != null && !allowedBranch.trim().isEmpty() && !allowedBranch.equalsIgnoreCase("ALL")) {
            String studentBranch = student.getBranch() != null ? student.getBranch().trim().toUpperCase() : "";
            boolean branchMatches = Arrays.stream(allowedBranch.split("[,/|\\s]+"))
                    .map(String::trim)
                    .map(String::toUpperCase)
                    .anyMatch(b -> b.equals(studentBranch) || b.equals("ALL"));

            if (!branchMatches) {
                failureReasons.add("Student branch '" + student.getBranch() + "' is not eligible. Allowed branches: " + allowedBranch);
            }
        }

        if (failureReasons.isEmpty()) {
            return new EligibilityResult(
                    true,
                    "ELIGIBLE",
                    "Student meets all eligibility criteria for this job",
                    failureReasons
            );
        } else {
            return new EligibilityResult(
                    false,
                    "NOT_ELIGIBLE",
                    String.join(". ", failureReasons),
                    failureReasons
            );
        }
    }
}
