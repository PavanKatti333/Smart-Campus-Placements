# Smart Campus Placement Management Platform

> **An enterprise-grade, automated campus recruitment ecosystem connecting students, placement officers (TPOs), and corporate employers.**

---

## 📌 1. Project Overview

The **Smart Campus Placement Platform** is a full-stack recruitment automation solution designed to replace manual spreadsheets, fragmented emails, and physical forms with a unified, real-time campus hiring hub.

### The Problem It Solves:
* **Students missing placement opportunities**: Late circulars, lost emails, and uncoordinated deadlines.
* **Manual eligibility checking**: TPOs spending hundreds of hours validating individual student CGPAs, active backlogs, and branch restrictions.
* **Difficult application tracking**: No transparent feedback or real-time stage updates for candidates.
* **Manual interview scheduling**: Time-consuming round coordination between interviewers and shortlisted students.
* **Lack of centralized placement analytics**: Absence of executive insights into placement rates, salary packages, and branch statistics.

### The Solution:
A streamlined, automated workflow engine that governs the student journey:
$$\text{Student} \longrightarrow \text{Job Discovery} \longrightarrow \text{Eligibility Check} \longrightarrow \text{Application} \longrightarrow \text{Shortlisting} \longrightarrow \text{Interview} \longrightarrow \text{Selection} \longrightarrow \text{Offer} \longrightarrow \text{Acceptance/Rejection}$$

---

## ✨ 2. Key Features

### 🎓 1. Student Portal
* **Personal Profile Management**: Update contact details, academic credentials (CGPA, active backlogs, graduation year), and cloud resume link.
* **Live Pre-Eligibility Evaluation**: Real-time rule evaluation before applying with clear explanations for ineligibility.
* **Job Discovery & 1-Click Application**: Filter active openings, inspect company requirements, and submit applications with instant duplicate prevention.
* **Real-Time Application Tracking**: Visual color-coded status badges for every stage (`APPLIED`, `SHORTLISTED`, `INTERVIEW`, `SELECTED`, `REJECTED`).
* **Interview Schedule Tracker**: View upcoming interview rounds with date, time, mode (Online/In-Person), and panel details.
* **Formal Offer Review**: Inspect offered CTC and joining date, and formally **Accept** or **Decline** offers.
* **Notification Center**: Interactive alert bell with unread counters and 1-click status updates for critical recruitment events.

### 🏛️ 2. Placement Officer (Admin) Portal
* **Executive Placement Intelligence**: Live KPI metrics (Total Students, Companies, Jobs, Applications, Shortlisted, Selected, Offers Released, Placement Success Rate %, Average LPA, Highest LPA).
* **Visual Analytics & Department Distribution**: Responsive bar charts comparing placement rates across engineering disciplines (CSE, ECE, IT, etc.) and recruitment funnel volume.
* **Student Talent Pool Management**: Filter, view, and inspect all student academic profiles and CVs.
* **Corporate Employer Registry**: Register visiting hiring partners with headquarters, official contact, and website.
* **Job Posting Management**: Create, view, update, and remove campus job postings with custom CGPA cut-offs, branch rules, and deadlines.
* **Candidate Application Pipeline**: Shortlist or reject candidates based on eligibility.
* **Interview Scheduling Modal**: Schedule technical/HR rounds for shortlisted candidates with automated notification dispatch.
* **Offer Rollout Engine**: Roll out formal placement offers with CTC and reporting dates for selected candidates.

### 💼 3. Campus Recruiter Portal
* **Dedicated Company View**: Filter and evaluate candidates who applied specifically to company-sponsored job openings.
* **Applicant Review & Shortlisting**: Screen eligible candidate credentials and resumes.
* **Conduct & Record Interviews**: Record interview outcomes (`PASSED` / `FAILED`), which automatically updates application states and alerts students.
* **Offer Generation**: Issue formal offer letters to selected candidates.

---

## 🏗️ 3. System Architecture & Design

### High-Level Architecture
```
┌────────────────────────────────────────────────────────┐
│                   React 19 + Vite                      │
│   (Pages, Components, Context API, Hooks, api.js)      │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTP / REST / JSON
┌──────────────────────────▼─────────────────────────────┐
│                 Spring Boot 3.4.3                      │
│ ┌────────────────────────────────────────────────────┐ │
│ │ Controllers (REST Endpoints)                       │ │
│ ├────────────────────────────────────────────────────┤ │
│ │ Services (Eligibility Engine & State Machine)      │ │
│ ├────────────────────────────────────────────────────┤ │
│ │ Repositories (Spring Data JPA)                     │ │
│ ├────────────────────────────────────────────────────┤ │
│ │ Security & DTO Layer (BCrypt Crypto & Validation)  │ │
│ └────────────────────────────────────────────────────┘ │
└──────────────────────────┬─────────────────────────────┘
                           │ JDBC / Hibernate ORM
┌──────────────────────────▼─────────────────────────────┐
│                 MySQL 8.0 Database                     │
│           (smart_campus_placement)                     │
└────────────────────────────────────────────────────────┘
```

### Recruitment Workflow State Machine
```
[APPLIED / ELIGIBLE] ──► [SHORTLISTED] ──► [INTERVIEW] ──► [SELECTED] ──► [GENERATED] ──► [ACCEPTED]
         │                     │                 │              │
         ▼                     ▼                 ▼              ▼
   [NOT_ELIGIBLE]         [REJECTED]          [FAILED]      [REJECTED]
                                                 │
                                                 ▼
                                            [REJECTED]
```

* **Eligibility Rule**: Students can only apply if `Student CGPA >= Job Min CGPA`, `Branch Matches Job Allowed Branch`, `Active Backlogs <= Job Max Backlogs`, and `Deadline >= Today`.
* **Shortlisting Rule**: Only applications in `APPLIED` / `ELIGIBLE` status can be transitioned to `SHORTLISTED` or `REJECTED`.
* **Interview Rule**: Interviews can only be scheduled for `SHORTLISTED` candidates.
* **Interview Result Rule**: Marking an interview `PASSED` automatically transitions the application to `SELECTED`. Marking an interview `FAILED` transitions it to `REJECTED`.
* **Offer Generation Rule**: Offers can only be rolled out for `SELECTED` candidates. Once accepted, status becomes `ACCEPTED`; if declined, status becomes `REJECTED`.

---

## 🛠️ 4. Technology Stack

### Backend:
* **Language & Runtime**: Java 23 (compatible with Java 21 LTS)
* **Framework**: Spring Boot 3.4.3 / 4.x
* **Core Modules**: Spring Web, Spring Data JPA, Jakarta Bean Validation
* **Security & Crypto**: Spring Security Crypto (`BCryptPasswordEncoder`)
* **ORM & Database**: Hibernate 6.6, MySQL 8.0 Connector (`mysql-connector-j`)
* **Build Tool**: Apache Maven 3.9+
* **Unit Testing**: JUnit 5, Mockito (32 automated unit and integration tests)

### Frontend:
* **Framework**: React 19
* **Build & Dev Tool**: Vite 8.2
* **Styling**: Modern Vanilla CSS, Glassmorphism, CSS Custom Properties, Responsive Flex/Grid
* **Icons & Fonts**: Google Fonts (*Plus Jakarta Sans*, *Inter*)
* **Architecture**: Context API (`AuthContext`, `ToastContext`), Custom Hook (`usePlacementData`), Centralized Service Layer (`api.js`)

---

## 🗄️ 5. Database Schema & Relationships

### Database: `smart_campus_placement`

1. **`student`**:
   * `id` (BIGINT, PK, AUTO_INCREMENT)
   * `name` (VARCHAR(100), NOT NULL)
   * `email` (VARCHAR(100), UNIQUE, NOT NULL)
   * `password` (VARCHAR(255), NOT NULL)
   * `phone` (VARCHAR(20), NOT NULL)
   * `branch` (VARCHAR(50), NOT NULL)
   * `cgpa` (DOUBLE, NOT NULL)
   * `backlogs` (INT, NOT NULL)
   * `graduation_year` (INT, NOT NULL)
   * `resume_url` (VARCHAR(500))
   * `role` (VARCHAR(20), NOT NULL)
   * `created_at` (DATETIME)

2. **`company`**:
   * `id` (BIGINT, PK, AUTO_INCREMENT)
   * `company_name` (VARCHAR(150), NOT NULL)
   * `email` (VARCHAR(100), NOT NULL)
   * `phone` (VARCHAR(20))
   * `location` (VARCHAR(100))
   * `website` (VARCHAR(200))
   * `description` (TEXT)

3. **`job`**:
   * `id` (BIGINT, PK, AUTO_INCREMENT)
   * `job_title` (VARCHAR(150), NOT NULL)
   * `job_description` (TEXT)
   * `salary` (DOUBLE, NOT NULL)
   * `minimum_cgpa` (DOUBLE, NOT NULL)
   * `allowed_branch` (VARCHAR(50), NOT NULL)
   * `maximum_backlogs` (INT, NOT NULL)
   * `application_deadline` (DATE, NOT NULL)
   * `company_id` (BIGINT, FK -> `company.id`, NOT NULL)

4. **`application`**:
   * `id` (BIGINT, PK, AUTO_INCREMENT)
   * `student_id` (BIGINT, FK -> `student.id`, NOT NULL)
   * `job_id` (BIGINT, FK -> `job.id`, NOT NULL)
   * `status` (VARCHAR(30), NOT NULL)
   * `applied_date` (DATETIME, NOT NULL)
   * *Unique Constraint*: `uk_student_job (student_id, job_id)` prevents duplicate applications.

5. **`interview`**:
   * `id` (BIGINT, PK, AUTO_INCREMENT)
   * `application_id` (BIGINT, FK -> `application.id`, NOT NULL)
   * `interview_date` (DATE, NOT NULL)
   * `interview_time` (VARCHAR(20), NOT NULL)
   * `interview_type` (VARCHAR(50), NOT NULL)
   * `interviewer` (VARCHAR(100), NOT NULL)
   * `status` (VARCHAR(30), NOT NULL)

6. **`offer`**:
   * `id` (BIGINT, PK, AUTO_INCREMENT)
   * `application_id` (BIGINT, FK -> `application.id`, NOT NULL)
   * `offered_salary` (DOUBLE, NOT NULL)
   * `joining_date` (DATE, NOT NULL)
   * `offer_status` (VARCHAR(30), NOT NULL)

7. **`notification`**:
   * `id` (BIGINT, PK, AUTO_INCREMENT)
   * `student_id` (BIGINT, FK -> `student.id`, NOT NULL)
   * `message` (TEXT, NOT NULL)
   * `type` (VARCHAR(30), NOT NULL)
   * `is_read` (BOOLEAN, NOT NULL)
   * `created_at` (DATETIME, NOT NULL)

---

## 📡 6. REST API Reference

| Resource | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Authentication** | `POST` | `/auth/login` | Authenticate user (Student, Admin, Recruiter) |
| | `POST` | `/auth/register` | Register new student account |
| **Analytics** | `GET` | `/analytics/dashboard` | Placement stats, department breakdown, and salary metrics |
| **Students** | `GET` | `/students` | Get all registered students (Admin) |
| | `GET` | `/students/{id}` | Get student profile by ID |
| | `POST` | `/students` | Register student |
| | `PUT` | `/students/{id}` | Update student profile (CGPA, resume, phone) |
| | `DELETE`| `/students/{id}` | Delete student record |
| **Companies** | `GET` | `/companies` | Get all partner employers |
| | `GET` | `/companies/{id}` | Get company by ID |
| | `POST` | `/companies` | Register partner company |
| | `PUT` | `/companies/{id}` | Update company details |
| | `DELETE`| `/companies/{id}` | Delete company |
| **Jobs** | `GET` | `/jobs` | Get all active campus job openings |
| | `GET` | `/jobs/{id}` | Get job details |
| | `POST` | `/jobs` | Post new campus opening |
| | `PUT` | `/jobs/{id}` | Update job details |
| | `DELETE`| `/jobs/{id}` | Delete job opening |
| **Applications** | `GET` | `/applications` | Get all applications (Admin/Recruiter) |
| | `GET` | `/applications/{id}` | Get application by ID |
| | `GET` | `/applications/student/{id}` | Get applications submitted by student |
| | `GET` | `/applications/check-eligibility` | Pre-check eligibility rules before applying |
| | `POST` | `/applications` | Submit job application with eligibility verification |
| | `PUT` | `/applications/{id}/status` | Update application stage (`SHORTLISTED`, `REJECTED`) |
| | `DELETE`| `/applications/{id}` | Withdraw application |
| **Interviews** | `GET` | `/interviews` | Get all scheduled interviews |
| | `GET` | `/interviews/{id}` | Get interview by ID |
| | `GET` | `/interviews/student/{id}` | Get candidate interviews |
| | `POST` | `/interviews` | Schedule interview round (SHORTLISTED apps only) |
| | `PUT` | `/interviews/{id}/status` | Record interview outcome (`PASSED` / `FAILED`) |
| **Offers** | `GET` | `/offers` | Get all placement offers |
| | `GET` | `/offers/{id}` | Get offer by ID |
| | `GET` | `/offers/student/{id}` | Get candidate offers |
| | `POST` | `/offers` | Generate formal offer letter (SELECTED apps only) |
| | `PUT` | `/offers/{id}/status` | Student responds to offer (`ACCEPTED` / `REJECTED`) |
| **Notifications**| `GET` | `/notifications/student/{id}` | Get real-time student alerts |
| | `PUT` | `/notifications/{id}/read` | Mark notification as read |

---

## 🔑 7. Demo Accounts (1-Click Login Ready)

The application provides instant 1-click login buttons on the login modal:

| Role | Name | Email | Password | Academic / Role Profile |
| :--- | :--- | :--- | :--- | :--- |
| **Placement Admin** | Chief Placement Officer | `admin@smartcampus.edu` | `Admin@123` | Complete administrative control & analytics |
| **Campus Recruiter** | Campus Recruiter | `recruiter@smartcampus.edu` | `Recruiter@123` | Applicant review, interviews & offers |
| **Student (CSE)** | Pavan Kumar | `pavan@example.com` | `Student@123` | CSE, CGPA 8.2, 0 Backlogs, Grad: 2027 |
| **Student (ECE)** | Sneha Reddy | `sneha@example.com` | `Student@123` | ECE, CGPA 7.4, 1 Backlog, Grad: 2026 |

---

## 🚀 8. Getting Started & Setup Guide

### Prerequisites
* **Java**: JDK 21 or JDK 23 installed
* **Maven**: Apache Maven 3.9+ (or use included `mvnw`)
* **Node.js**: Node 18+ and npm
* **MySQL**: MySQL Server 8.0 running on `localhost:3306`

---

### Step 1: Database Setup
1. Ensure your MySQL service is running on port `3306`.
2. Spring Boot is configured with `createDatabaseIfNotExist=true` to automatically create the `smart_campus_placement` database if it does not already exist.
3. Configure your password in `backend/src/main/resources/application.properties` or provide it as an environment variable:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/smart_campus_placement?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
   spring.datasource.username=root
   spring.datasource.password=${DB_PASSWORD:Rishi@19}
   ```

---

### Step 2: Backend Setup
Open a terminal in the `backend` directory:
```bash
cd backend
mvn spring-boot:run
```
*The backend server will initialize the schema, pre-seed demo companies, jobs, and accounts via `DataInitializer.java`, and listen on `http://localhost:8083`.*

To run the full unit and integration test suite:
```bash
mvn test
```
*(32/32 tests passing covering all 12 core recruitment scenarios).*

---

### Step 3: Frontend Setup
Open a second terminal in the `frontend` directory:
```bash
cd frontend
npm install
npm run dev
```
*The Vite development server will start on `http://localhost:5173`.*

---

## 📁 9. Project Directory Structure

```
smart-campus-placement/
│
├── backend/
│   ├── pom.xml                                <-- Maven configuration & dependencies
│   └── src/
│       ├── main/
│       │   ├── java/com/smartcampus/placement/
│       │   │   ├── PlacementApplication.java  <-- Main Spring Boot Entrypoint
│       │   │   ├── config/
│       │   │   │   ├── CorsConfig.java        <-- Cross-Origin Configuration
│       │   │   │   ├── DataInitializer.java   <-- Seeds Demo Accounts, Companies & Jobs
│       │   │   │   └── SecurityConfig.java    <-- BCrypt Password Encoder Bean
│       │   │   ├── controller/                <-- 9 REST Controllers
│       │   │   ├── dto/                       <-- Request & Response DTOs
│       │   │   ├── entity/                    <-- JPA Entities (Student, Company, Job, etc.)
│       │   │   ├── exception/                 <-- Global Exception Handler & Custom Errors
│       │   │   ├── repository/                <-- Spring Data JPA Repositories
│       │   │   └── service/                   <-- Business Logic, State Machine & Rules
│       │   └── resources/
│       │       └── application.properties     <-- MySQL & Server Config
│       └── test/                              <-- 32 Unit & Integration Tests
│
├── frontend/
│   ├── package.json                           <-- Dependencies & build scripts
│   ├── vite.config.js                         <-- Vite configuration
│   └── src/
│       ├── App.jsx                            <-- App Root & View Router
│       ├── App.css                            <-- Glassmorphism Design System & CSS Rules
│       ├── index.css                          <-- Base Utility Tokens & Variables
│       ├── main.jsx                           <-- React DOM Entrypoint
│       ├── hooks/
│       │   └── usePlacementData.js            <-- Centralized Placement Data Hook
│       ├── pages/
│       │   ├── StudentDashboardPage.jsx       <-- Student Hub Page Container
│       │   ├── AdminDashboardPage.jsx         <-- Placement Admin Page Container
│       │   └── RecruiterDashboardPage.jsx     <-- Recruiter Evaluation Page Container
│       ├── services/
│       │   └── api.js                         <-- Centralized REST Service Abstraction
│       ├── context/
│       │   ├── AuthContext.jsx                <-- Authentication & Session State
│       │   └── ToastContext.jsx               <-- Non-blocking Notification Provider
│       └── components/
│           ├── Navbar.jsx                     <-- Navigation Bar & Role Indicators
│           ├── AuthModal.jsx                  <-- Login/Register Dialog & 1-Click Demo
│           ├── JobCard.jsx                    <-- Job Card with Live Eligibility Check
│           ├── NotificationCenter.jsx         <-- Real-time Alerts Dropdown
│           ├── AnalyticsDashboard.jsx         <-- Placement KPIs & Visual Funnels
│           ├── JobModal.jsx                   <-- Post Campus Job Dialog
│           ├── CompanyModal.jsx               <-- Register Employer Dialog
│           ├── InterviewScheduleModal.jsx     <-- Interview Scheduling Dialog
│           ├── OfferGenerateModal.jsx         <-- Formal Placement Offer Dialog
│           ├── StudentProfileModal.jsx        <-- Academic Profile Edit Dialog
│           ├── StatusBadge.jsx                <-- Color-Coded Stage Badges
│           └── Toast.jsx                      <-- Animated Toast Notifications
│
├── PROJECT_OVERVIEW.md                        <-- Architectural Project Summary
└── README.md                                  <-- Complete Platform Documentation
```

---

## 📸 10. Screenshots & UI Walkthrough

1. **Student Dashboard & Live Eligibility**:
   * Clean overview cards for Applications, Interviews, and Offers.
   * Real-time pre-eligibility evaluation engine gives instant feedback on CGPA, Backlogs, and Branch matching before submitting.
2. **Placement Officer (TPO) Command Center**:
   * Unified tabs for Talent Pool, Corporate Registry, Job Postings, and Candidate Pipeline.
   * Executive Analytics tab displaying overall placement rate %, department-wise placed distributions, and recruitment funnel stage volumes.
3. **Campus Recruiter Portal**:
   * Streamlined candidate review, interview scheduling, interview outcome evaluation (`PASSED` / `FAILED`), and offer letter generation.
4. **Interactive Dialog Modals**:
   * Zero browser `alert()` popups; custom glassmorphic modals with real-time field validation, date pickers, and live LPA currency previews.
5. **Real-Time Notification Center**:
   * Unread badge counter with category-specific alerts for offers, interview schedules, and application shortlisting.

---

## 🔮 11. Future Enhancements

* **JWT Stateless Authentication**: Upgrade session-based authentication to signed JSON Web Tokens (JWT) with refresh token rotation.
* **Resume Parsing Engine**: Automatic PDF resume text extraction and skill keyword matching against job requirements.
* **Email & SMS Webhooks**: Automatic SMTP email dispatch for interview invites and offer letters via SendGrid/Mailgun.
* **Automated Coding Assessment Integration**: Webhook integration with platforms like HackerRank or LeetCode for preliminary screening tests.
* **Multi-Campus Support**: University-wide portal supporting multiple affiliated constituent colleges and departments under a single super-admin.
