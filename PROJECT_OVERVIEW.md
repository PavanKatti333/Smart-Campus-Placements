# Smart Campus Placement Management Platform

> **An enterprise-grade, automated campus recruitment ecosystem connecting students, placement officers (TPOs), and corporate employers.**

---

## 📌 1. Project Overview

The **Smart Campus Placement Platform** is a full-stack recruitment automation solution designed to replace manual spreadsheets and fragmented emails with a unified, real-time campus hiring hub.

### The Problem It Solves:
- **For Placement Officers (TPOs)**: Manually tracking hundreds of student applications across dozens of visiting companies causes errors, missed deadlines, and delays in releasing offers.
- **For Students**: Lack of visibility into why they were rejected or shortlisted, missing interview schedules, and lack of real-time status tracking.
- **For Recruiters**: Difficulty verifying student credentials (CGPA, active backlogs, branches) and coordinating multi-round interview stages efficiently.

### The Solution:
Smart Campus Placement enforces an **automated state machine** with a **real-time eligibility rule engine**, multi-role dashboards (**Student**, **Admin/TPO**, **Recruiter**), automated interview tracking, formal offer generation, and visual placement analytics.

---

## 🏗️ 2. Technology Stack & Architecture

### Backend Architecture:
- **Framework**: Spring Boot 3.4.3
- **Language**: Java 23
- **Persistence**: Spring Data JPA / Hibernate ORM
- **Database**: MySQL 8.0 (auto-DDL update with database auto-creation)
- **Security & Cryptography**: BCrypt Password Encoder (`spring-security-crypto`)
- **Validation**: Jakarta Bean Validation (`@Valid`, `@NotNull`, `@Positive`, `@Email`)
- **Testing**: JUnit 5, Mockito (22/22 unit & integration test suites passing)
- **Port**: `8083`

### Frontend Architecture:
- **Library**: React 19 with Vite 8.2
- **State Management**: React Context API (`AuthContext` for sessions/roles, `ToastContext` for notifications)
- **Design System**: Modern Vanilla CSS with Glassmorphism, CSS Custom Properties, and responsive flex/grid layouts
- **Typography**: Google Fonts (*Plus Jakarta Sans*, *Inter*)
- **Service Layer**: Centralized asynchronous Fetch API abstraction (`api.js`)
- **Port**: `5173`

---

## 👥 3. User Roles & Capabilities

| Feature / Capability | 🎓 Student | 🏛️ Placement Officer (Admin) | 💼 Campus Recruiter |
| :--- | :---: | :---: | :---: |
| **Personal Profile & Resume Management** | ✅ | ✅ (View Talent Pool) | ✅ (View Candidate CVs) |
| **Job Exploration & Pre-Eligibility Check** | ✅ (Live Rule Check) | ✅ | ✅ |
| **Apply for Campus Openings** | ✅ | — | — |
| **Publish / Delete Job Openings** | — | ✅ | — |
| **Register Partner Employers / Companies** | — | ✅ | — |
| **Application Pipeline Review & Status** | ✅ (My Applications) | ✅ (Full Pipeline) | ✅ (Assigned Company Jobs) |
| **Shortlist Candidates** | — | ✅ | ✅ |
| **Schedule Technical / HR Interviews** | — | ✅ (Modal) | ✅ (Modal) |
| **Record Interview Results (Pass / Fail)** | — | ✅ | ✅ |
| **Issue Formal Placement Offers** | — | ✅ (Modal with CTC) | ✅ (Modal with CTC) |
| **Accept or Decline Job Offers** | ✅ | — | — |
| **Real-Time Notification Center** | ✅ (Live Alerts) | — | — |
| **Executive Placement Analytics & KPIs** | — | ✅ (Interactive Dashboard)| — |

---

## ⚡ 4. Detailed Feature Breakdown

### 1. Real-Time Eligibility Rule Engine
- Evaluates candidate academic metrics against job criteria:
  - **CGPA Cut-off**: Student CGPA ≥ Minimum Job CGPA (e.g. `8.2 ≥ 7.0`).
  - **Engineering Branch Match**: Checks if student branch is allowed (`CSE`, `IT`, `ECE`, or `ALL`).
  - **Backlog Restriction**: Checks if active backlogs ≤ allowed limit (e.g. `0 ≤ 0`).
  - **Deadline Enforcement**: Blocks applications if the deadline date has passed.
- **Pre-Eligibility Endpoint (`/applications/check-eligibility`)**: Evaluates and explains eligibility *before* a student applies. If ineligible, it provides specific human-readable reasons (e.g., *"CGPA of 6.8 is below required 7.5"* or *"Branch CIVIL is not eligible"*).

### 2. Recruitment State Machine Pipeline
Applications follow a strict, automated progression:
```
[APPLIED] ──► [SHORTLISTED] ──► [INTERVIEW] ──► [SELECTED] ──► [OFFER GENERATED] ──► [ACCEPTED]
     │              │                │               │
     ▼              ▼                ▼               ▼
 [REJECTED]     [REJECTED]       [FAILED]       [DECLINED]
```
- When an interview is marked as **PASSED**, the backend automatically transitions the candidate application to **SELECTED** and dispatches an instant notification.
- When an interview is marked as **FAILED**, the application status transitions to **REJECTED**.
- When an offer is generated, the status updates to **GENERATED** with the candidate able to formally **ACCEPT** or **DECLINE**.

### 3. Executive Placement Intelligence Dashboard
Consumes `/analytics/dashboard` to provide TPOs with real-time campus statistics:
- **Placement Success Rate**: Real-time percentage of placed students vs. total batch size.
- **Compensation Metrics**: Average Package (LPA) and Highest Package (LPA) across campus.
- **Department-Wise Distribution**: Visual bar distribution of placed candidates per engineering discipline (CSE, ECE, IT, etc.).
- **Pipeline Stage Distribution**: Volume tracking of candidates across each stage (Applied, Shortlisted, Interviewed, Selected).

### 4. Interactive Dialog Modals (No Native Popups)
- **Schedule Interview Modal**: Select date, time, interview mode (*Online virtual meeting* vs. *In-person campus round*), and interviewer panel.
- **Generate Offer Modal**: Specify annual CTC (with real-time LPA currency preview) and anticipated reporting date.
- **Create Job Opening Modal**: Define job title, role description, partner company, compensation, CGPA cut-off, allowed branches, backlog limit, and deadline.
- **Register Partner Company Modal**: Register corporate recruiters with headquarters location, official email, phone, and company website.
- **Student Profile Modal**: Update mobile number, branch, CGPA, backlogs, and Google Drive/cloud resume links.

### 5. Live Notification Center
- Bell trigger with unread counter badge.
- Polls for real-time recruitment updates.
- Categorized icons:
  - 💼 **Offers**: Alerts when a formal offer letter is rolled out.
  - 📅 **Interviews**: Alerts when an interview date and time are scheduled.
  - 📋 **Applications**: Status changes (Shortlisted, Selected, Rejected).
- Single-click **"Mark as read"** and **"Mark all as read"**.

### 6. Non-Blocking Animated Toast Notifications
- Replaces intrusive browser `alert()` dialogs with auto-dismissing toast notifications for success, error, warning, and info states.

---

## 🔑 5. Pre-Seeded Demo Accounts (1-Click Login)

The platform includes pre-configured demo accounts directly accessible via 1-click buttons on the login modal:

| Role | Name | Email | Password | Details |
| :--- | :--- | :--- | :--- | :--- |
| **Placement Admin** | Chief Placement Officer | `admin@smartcampus.edu` | `Admin@123` | Full administrative control & analytics |
| **Campus Recruiter** | Campus Recruiter | `recruiter@smartcampus.edu` | `Recruiter@123` | Applicant review, interviews & offers |
| **Student (CSE)** | Pavan Kumar | `pavan@example.com` | `Student@123` | CSE, CGPA 8.2, 0 Backlogs, Class of 2027 |
| **Student (ECE)** | Sneha Reddy | `sneha@example.com` | `Student@123` | ECE, CGPA 7.4, 1 Backlog, Class of 2026 |

---

## 📡 6. REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/auth/login` | Authenticate user (Student, Admin, Recruiter) |
| **POST** | `/auth/register` | Register new student candidate |
| **GET** | `/analytics/dashboard` | Get placement KPIs, department stats, and package metrics |
| **GET** | `/jobs` | Retrieve all active campus job openings |
| **POST** | `/jobs` | Publish a new job opening (Admin) |
| **DELETE**| `/jobs/{id}` | Remove a job posting (Admin) |
| **GET** | `/companies` | List registered hiring employers |
| **POST** | `/companies` | Register a new partner company (Admin) |
| **DELETE**| `/companies/{id}` | Remove a partner employer (Admin) |
| **POST** | `/applications` | Submit job application with eligibility validation |
| **GET** | `/applications/student/{id}` | Retrieve all applications for a specific student |
| **GET** | `/applications/check-eligibility`| Pre-check eligibility rules before applying |
| **PUT** | `/applications/{id}/status` | Update candidate application stage |
| **POST** | `/interviews` | Schedule candidate interview round |
| **GET** | `/interviews/student/{id}` | Get scheduled interviews for a student |
| **PUT** | `/interviews/{id}/status` | Record interview outcome (`PASSED` / `FAILED`) |
| **POST** | `/offers` | Roll out formal placement offer letter |
| **GET** | `/offers/student/{id}` | Get offers received by a student |
| **PUT** | `/offers/{id}/status` | Student action on offer (`ACCEPTED` / `REJECTED`) |
| **GET** | `/notifications/student/{id}` | Fetch real-time notifications for a student |
| **PUT** | `/notifications/{id}/read` | Mark a notification as read |
| **GET** | `/students` | Get all registered campus students (Admin) |
| **PUT** | `/students/{id}` | Update student profile details (CGPA, resume, phone) |

---

## 🚀 7. Running the Platform Locally

### Prerequisites:
- **Java**: JDK 21 or JDK 23
- **Database**: MySQL Server 8.0 running on `localhost:3306` (Default database: `smart_campus_placement`)
- **Node.js**: Node 18+ and npm

### 1. Start the Backend:
```bash
cd backend
./mvnw spring-boot:run
```
*Backend server boots up on `http://localhost:8083`.*

### 2. Start the Frontend:
```bash
cd frontend
npm install
npm run dev
```
*Frontend dev server runs on `http://localhost:5173`.*

---

## 📁 8. Project Directory Structure

```
Smart Campus Placement/
├── PROJECT_OVERVIEW.md                   <-- Complete Project Documentation
├── backend/
│   ├── pom.xml                           <-- Maven Dependencies & Build Config
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/smartcampus/placement/
│   │   │   │   ├── PlacementApplication.java
│   │   │   │   ├── config/              <-- CORS, WebConfig & DataInitializer
│   │   │   │   ├── controller/          <-- 9 REST Controllers
│   │   │   │   ├── dto/                 <-- Request & Response DTOs
│   │   │   │   ├── entity/              <-- JPA Entities (Student, Job, Company, etc.)
│   │   │   │   ├── exception/           <-- Global Exception Handler
│   │   │   │   ├── repository/          <-- Spring Data JPA Repositories
│   │   │   │   └── service/             <-- Business Logic Services
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/                        <-- 22 Unit & Integration Tests
└── frontend/
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx                       <-- Modular App Controller
        ├── App.css                       <-- Modern Design System & Glassmorphic CSS
        ├── index.css                     <-- Base Utility Tokens & Animations
        ├── context/
        │   ├── AuthContext.jsx           <-- User Session, Roles & Profile Sync
        │   └── ToastContext.jsx          <-- Non-blocking Toast Provider
        ├── services/
        │   └── api.js                    <-- Centralized REST API Service
        └── components/
            ├── Navbar.jsx                <-- Header, Role Badges & View Switcher
            ├── AuthModal.jsx             <-- Login, Register & 1-Click Demo Logins
            ├── NotificationCenter.jsx    <-- Real-time Alerts Dropdown
            ├── JobCard.jsx               <-- Job Display with Live Pre-Eligibility
            ├── StudentDashboard.jsx      <-- Student Portal (Jobs, Apps, Interviews, Offers)
            ├── AdminDashboard.jsx        <-- Placement Officer Command Center
            ├── RecruiterDashboard.jsx    <-- Recruiter Evaluation & Offer Portal
            ├── AnalyticsDashboard.jsx    <-- KPI Cards, Charts & Funnel Breakdown
            ├── JobModal.jsx              <-- Create Campus Job Opening
            ├── CompanyModal.jsx          <-- Register Partner Employer
            ├── InterviewScheduleModal.jsx<-- Schedule Technical/HR Rounds
            ├── OfferGenerateModal.jsx    <-- Issue Formal Placement Offer
            ├── StudentProfileModal.jsx   <-- Edit CGPA, Resume & Contact Info
            ├── StatusBadge.jsx           <-- Color-coded Stage Badges
            └── Toast.jsx                 <-- Animated Feedback Toast Stack
```
