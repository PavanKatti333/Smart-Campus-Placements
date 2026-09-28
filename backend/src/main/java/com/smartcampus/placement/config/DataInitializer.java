package com.smartcampus.placement.config;

import com.smartcampus.placement.entity.Company;
import com.smartcampus.placement.entity.Job;
import com.smartcampus.placement.entity.Student;
import com.smartcampus.placement.repository.CompanyRepository;
import com.smartcampus.placement.repository.JobRepository;
import com.smartcampus.placement.repository.StudentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    private final StudentRepository studentRepository;
    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            StudentRepository studentRepository,
            CompanyRepository companyRepository,
            JobRepository jobRepository,
            PasswordEncoder passwordEncoder) {
        this.studentRepository = studentRepository;
        this.companyRepository = companyRepository;
        this.jobRepository = jobRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Seed default students if missing
        if (studentRepository.findByEmail("pavan@example.com").isEmpty()) {
            Student pavan = new Student(
                    "Pavan Kumar",
                    "pavan@example.com",
                    passwordEncoder.encode("Student@123"),
                    "9876543210",
                    "CSE",
                    8.2,
                    0,
                    2027,
                    "https://smartcampus.edu/resumes/pavan-kumar.pdf",
                    "STUDENT"
            );
            studentRepository.save(pavan);
        }

        if (studentRepository.findByEmail("sneha@example.com").isEmpty()) {
            Student sneha = new Student(
                    "Sneha Reddy",
                    "sneha@example.com",
                    passwordEncoder.encode("Student@123"),
                    "9876543211",
                    "ECE",
                    7.4,
                    1,
                    2026,
                    "https://smartcampus.edu/resumes/sneha-reddy.pdf",
                    "STUDENT"
            );
            studentRepository.save(sneha);
        }

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
