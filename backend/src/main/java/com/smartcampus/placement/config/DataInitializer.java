package com.smartcampus.placement.config;

import com.smartcampus.placement.entity.Company;
import com.smartcampus.placement.entity.Job;
import com.smartcampus.placement.repository.CompanyRepository;
import com.smartcampus.placement.repository.JobRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;

    public DataInitializer(
            CompanyRepository companyRepository,
            JobRepository jobRepository) {
        this.companyRepository = companyRepository;
        this.jobRepository = jobRepository;
    }

    @Override
    public void run(String... args) {

        // Seed Companies if missing
        if (companyRepository.count() == 0) {
            Company tcs = new Company(
                    "TCS",
                    "campus@tcs.com",
                    "022-67789999",
                    "Mumbai, Maharashtra",
                    "https://www.tcs.com",
                    "Global leader in IT services, consulting, and business solutions."
            );
            Company infosys = new Company(
                    "Infosys",
                    "recruitment@infosys.com",
                    "080-28520261",
                    "Bangalore, Karnataka",
                    "https://www.infosys.com",
                    "Next-generation digital services and consulting pioneer."
            );
            Company wipro = new Company(
                    "Wipro",
                    "careers@wipro.com",
                    "080-28440011",
                    "Bangalore, Karnataka",
                    "https://www.wipro.com",
                    "Leading technology services and consulting company delivering innovative solutions."
            );
            Company accenture = new Company(
                    "Accenture",
                    "india.campus@accenture.com",
                    "0124-4321000",
                    "Hyderabad, Telangana",
                    "https://www.accenture.com",
                    "Leading global professional services enterprise with leading digital, cloud, and security capabilities."
            );

            companyRepository.save(tcs);
            companyRepository.save(infosys);
            companyRepository.save(wipro);
            companyRepository.save(accenture);

            // Seed Jobs with realistic eligibility criteria
            Job job1 = new Job(
                    "Software Engineer",
                    "Develop cloud-native backend microservices using Java, Spring Boot, and RESTful APIs. Collaborate with product engineers to build high-scale solutions.",
                    750000.0,
                    7.0,
                    "CSE, IT, ECE",
                    0,
                    LocalDate.now().plusDays(25),
                    "OPEN",
                    tcs
            );

            Job job2 = new Job(
                    "Java Developer",
                    "Design and implement enterprise grade Spring Boot applications, JPA Hibernate entities, and secure database interactions.",
                    680000.0,
                    6.5,
                    "CSE, IT",
                    1,
                    LocalDate.now().plusDays(20),
                    "OPEN",
                    infosys
            );

            Job job3 = new Job(
                    "Full Stack Developer",
                    "Build responsive React frontends and Spring Web REST services. Work across state machines, JWT authentication, and interactive dashboards.",
                    950000.0,
                    8.0,
                    "CSE",
                    0,
                    LocalDate.now().plusDays(30),
                    "OPEN",
                    accenture
            );

            Job job4 = new Job(
                    "Graduate Engineer Trainee",
                    "Entry-level engineering rotational program across software development, network systems, quality engineering, and technical operations.",
                    550000.0,
                    6.0,
                    "ALL",
                    2,
                    LocalDate.now().plusDays(15),
                    "OPEN",
                    wipro
            );

            jobRepository.save(job1);
            jobRepository.save(job2);
            jobRepository.save(job3);
            jobRepository.save(job4);
        }
    }
}
