package com.smartcampus.placement.service;

import com.smartcampus.placement.dto.EligibilityResult;
import com.smartcampus.placement.entity.Job;
import com.smartcampus.placement.entity.Student;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

public class EligibilityServiceTest {

    private EligibilityService eligibilityService;
    private Student student;
    private Job job;

    @BeforeEach
    void setUp() {
        eligibilityService = new EligibilityService();

        student = new Student();
        student.setCgpa(8.2);
        student.setBranch("CSE");
        student.setBacklogs(0);

        job = new Job();
        job.setMinimumCgpa(7.5);
        job.setAllowedBranch("CSE");
        job.setMaximumBacklogs(0);
        job.setApplicationDeadline(LocalDate.now().plusDays(10));
        job.setStatus("OPEN");
    }

    @Test
    void testEligibleStudent() {
        EligibilityResult result = eligibilityService.checkEligibility(student, job);
        assertTrue(result.isEligible());
        assertEquals("ELIGIBLE", result.getStatus());
        assertTrue(result.getReasons().isEmpty());
    }

    @Test
    void testIneligibleDueToLowCgpa() {
        student.setCgpa(6.5);
        EligibilityResult result = eligibilityService.checkEligibility(student, job);
        assertFalse(result.isEligible());
        assertEquals("NOT_ELIGIBLE", result.getStatus());
        assertTrue(result.getMessage().contains("Minimum CGPA required is 7.5"));
    }

    @Test
    void testIneligibleDueToBacklogs() {
        student.setBacklogs(2);
        EligibilityResult result = eligibilityService.checkEligibility(student, job);
        assertFalse(result.isEligible());
        assertEquals("NOT_ELIGIBLE", result.getStatus());
        assertTrue(result.getMessage().contains("Maximum backlogs allowed"));
    }

    @Test
    void testIneligibleDueToBranch() {
        student.setBranch("CIVIL");
        EligibilityResult result = eligibilityService.checkEligibility(student, job);
        assertFalse(result.isEligible());
        assertEquals("NOT_ELIGIBLE", result.getStatus());
        assertTrue(result.getMessage().contains("Allowed branches"));
    }

    @Test
    void testIneligibleDueToExpiredDeadline() {
        job.setApplicationDeadline(LocalDate.now().minusDays(1));
        EligibilityResult result = eligibilityService.checkEligibility(student, job);
        assertFalse(result.isEligible());
        assertEquals("NOT_ELIGIBLE", result.getStatus());
        assertTrue(result.getMessage().contains("Application deadline passed"));
    }
}
