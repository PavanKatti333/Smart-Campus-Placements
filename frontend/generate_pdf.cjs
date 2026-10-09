const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const outputPath = path.resolve(__dirname, '..', 'Smart_Campus_Placement_Interview_Guide.pdf');
const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 45, bottom: 45, left: 45, right: 45 },
  bufferPages: true
});

const stream = fs.createWriteStream(outputPath);
doc.pipe(stream);

// Color Palette
const PRIMARY = '#1e3a8a';      // Deep Navy
const SECONDARY = '#2563eb';    // Bright Blue
const TEXT_DARK = '#0f172a';    // Slate 900
const TEXT_MUTED = '#475569';   // Slate 600
const BG_LIGHT = '#f8fafc';     // Light Gray
const BORDER_COLOR = '#cbd5e1'; // Slate 300
const ACCENT = '#059669';       // Emerald

function drawHeaderStrip() {
  doc.rect(45, 45, 505, 4).fill(SECONDARY);
  doc.y = 58;
}

// -------------------------------------------------------------
// COVER / TITLE
// -------------------------------------------------------------
drawHeaderStrip();

doc.font('Helvetica-Bold').fontSize(10).fillColor(SECONDARY).text('CAMPUS RECRUITMENT AUTOMATION ECOSYSTEM', 45, 60, { characterSpacing: 1 });
doc.moveDown(0.3);

doc.font('Helvetica-Bold').fontSize(22).fillColor(TEXT_DARK).text('Smart Campus Placement Management Platform');
doc.moveDown(0.2);

doc.font('Helvetica').fontSize(12).fillColor(TEXT_MUTED).text('End-to-End Working Flow, State Machine Architecture & Technical Interview Master Guide');
doc.moveDown(0.8);

// Horizontal line
doc.strokeColor(BORDER_COLOR).lineWidth(1).moveTo(45, doc.y).lineTo(550, doc.y).stroke();
doc.moveDown(0.8);

// -------------------------------------------------------------
// PART 1: FLOW OF WORKING & ARCHITECTURE
// -------------------------------------------------------------
function addSectionHeader(title) {
  doc.moveDown(0.5);
  doc.font('Helvetica-Bold').fontSize(15).fillColor(PRIMARY).text(title);
  doc.strokeColor(SECONDARY).lineWidth(1.5).moveTo(45, doc.y + 3).lineTo(550, doc.y + 3).stroke();
  doc.moveDown(0.6);
}

function addSubHeader(title) {
  doc.font('Helvetica-Bold').fontSize(12).fillColor(TEXT_DARK).text(title);
  doc.moveDown(0.3);
}

function addParagraph(text) {
  doc.font('Helvetica').fontSize(9.5).fillColor(TEXT_DARK).text(text, { lineGap: 2.5 });
  doc.moveDown(0.4);
}

function addBullet(title, desc) {
  doc.font('Helvetica-Bold').fontSize(9.5).fillColor(TEXT_DARK).text('• ' + title + ': ', { continued: true, lineGap: 2 });
  doc.font('Helvetica').fillColor(TEXT_MUTED).text(desc);
  doc.moveDown(0.25);
}

addSectionHeader('PART 1: SYSTEM ARCHITECTURE & WORKING FLOW');

addSubHeader('1. High-Level Technology Architecture');
addParagraph(
  'The platform is an enterprise full-stack recruitment automation solution that replaces manual spreadsheets and uncoordinated circulars with a centralized real-time hiring engine.'
);

// Tech Stack box
const startBoxY = doc.y;
doc.rect(45, startBoxY, 505, 52).fillAndStroke(BG_LIGHT, BORDER_COLOR);
doc.fillColor(TEXT_DARK).font('Helvetica-Bold').fontSize(9).text('Architecture Layers:', 55, startBoxY + 8);
doc.font('Helvetica').fontSize(8.5).fillColor(TEXT_MUTED)
   .text('• Frontend: React 19 + Vite 8.2 (Context API, Custom Hooks, Modern CSS Custom Properties)', 55, startBoxY + 22)
   .text('• Backend API: Spring Boot 3.4.3 & Java 23 (REST Controllers, Service State Machine, Jakarta Bean Validation)', 55, startBoxY + 34)
   .text('• Persistence & Security: MySQL 8.0 with Spring Data JPA / Hibernate ORM, BCrypt Password Encryption', 55, startBoxY + 46);
doc.y = startBoxY + 62;
doc.moveDown(0.5);

addSubHeader('2. Recruitment Workflow State Machine');
addParagraph(
  'Every student application progresses through a strict, deterministic state machine enforced by ApplicationService and InterviewService:'
);

// Pipeline diagram box
const pipeBoxY = doc.y;
doc.rect(45, pipeBoxY, 505, 34).fillAndStroke('#0f172a', '#0f172a');
doc.fillColor('#38bdf8').font('Courier-Bold').fontSize(8.5)
   .text('[APPLIED] ──► [SHORTLISTED] ──► [INTERVIEW] ──► [SELECTED] ──► [OFFER GENERATED] ──► [ACCEPTED]', 55, pipeBoxY + 12);
doc.y = pipeBoxY + 44;
doc.moveDown(0.4);

addBullet('Stage 1 (Applied)', 'Student submits application after passing the 4-point Pre-Eligibility Rule Check.');
addBullet('Stage 2 (Shortlisted)', 'Placement Officer (Admin) or Recruiter evaluates credentials and shortlists valid candidates.');
addBullet('Stage 3 (Interview Scheduled)', 'Recruiter books technical or HR round with date, time, mode (virtual/offline), and panel name. Instant notification dispatches to the student.');
addBullet('Stage 4 (Interview Outcome)', 'Marking interview PASSED automatically transitions application to SELECTED. Marking FAILED transitions directly to REJECTED.');
addBullet('Stage 5 (Formal Offer Released)', 'Recruiter or TPO rolls out official placement offer with annual CTC (LPA) and joining date.');
addBullet('Stage 6 (Candidate Decision)', 'Student reviews terms and formally clicks ACCEPT (permanently registering placement in campus analytics) or DECLINE.');

addSubHeader('3. User Roles & Capabilities');
addBullet('🎓 Student Portal', 'Profile & resume management, live pre-eligibility evaluation on job cards, 1-click application submission, real-time stage badges, notification center alerts, and offer acceptance.');
addBullet('🏛️ College Management (Admin)', 'Executive Placement Intelligence dashboard (placement % rate, department distribution, avg/highest LPA), talent pool inspection, partner employer registration, campus job drive publishing, and candidate pipeline tracking.');
addBullet('💼 Campus Recruiter Portal', 'Company-specific applicant screening, CV review, technical/HR interview scheduling, Pass/Fail result logging, and formal offer letter release.');

doc.addPage();

// -------------------------------------------------------------
// PRE-ELIGIBILITY RULE ENGINE TABLE
// -------------------------------------------------------------
addSubHeader('4. Deterministic Pre-Eligibility Rule Engine');
addParagraph(
  'Encapsulated in EligibilityService.java, this engine evaluates four deterministic criteria before any application can be created:'
);

// Draw table
const colX = [45, 145, 320, 550];
let tableY = doc.y + 4;

function drawTableRow(c1, c2, c3, isHeader) {
  const rowHeight = 22;
  if (isHeader) {
    doc.rect(colX[0], tableY, colX[3] - colX[0], rowHeight).fillAndStroke(PRIMARY, PRIMARY);
    doc.font('Helvetica-Bold').fontSize(8.5).fillColor('#ffffff');
  } else {
    doc.rect(colX[0], tableY, colX[3] - colX[0], rowHeight).fillAndStroke(BG_LIGHT, BORDER_COLOR);
    doc.font('Helvetica').fontSize(8.5).fillColor(TEXT_DARK);
  }
  doc.text(c1, colX[0] + 6, tableY + 6);
  doc.text(c2, colX[1] + 6, tableY + 6);
  doc.text(c3, colX[2] + 6, tableY + 6);
  tableY += rowHeight;
}

drawTableRow('Rule', 'Evaluation Logic', 'User Explanation On Failure', true);
drawTableRow('1. Academic Cutoff', 'Student.CGPA >= Job.MinCGPA', 'CGPA is below the minimum requirement');
drawTableRow('2. Branch Match', 'Job.Branch == "ALL" || Allowed.contains(Branch)', 'Department is not eligible for this opening');
drawTableRow('3. Backlog Limit', 'Student.Backlogs <= Job.MaxBacklogs', 'Active backlogs exceed maximum allowed limit');
drawTableRow('4. Application Deadline', 'LocalDate.now() <= Job.Deadline', 'Application deadline for this drive has passed');

doc.y = tableY + 14;

// -------------------------------------------------------------
// PART 2: INTERVIEW QUESTIONS AND ANSWERS
// -------------------------------------------------------------
addSectionHeader('PART 2: HIGH-IMPACT TECHNICAL & BEHAVIORAL INTERVIEW Q&As');

function addQuestionCard(category, qNum, question, answerBlocks) {
  if (doc.y > 680) {
    doc.addPage();
  }

  doc.font('Helvetica-Bold').fontSize(10).fillColor(PRIMARY).text(`[${category}] Q${qNum}: ${question}`);
  doc.moveDown(0.2);

  doc.font('Helvetica').fontSize(9).fillColor(TEXT_DARK);
  for (const block of answerBlocks) {
    if (typeof block === 'string') {
      doc.text(block, { lineGap: 2 });
      doc.moveDown(0.2);
    } else if (block.type === 'bullet') {
      doc.font('Helvetica-Bold').text('• ' + block.title + ': ', { continued: true });
      doc.font('Helvetica').text(block.desc);
      doc.moveDown(0.15);
    } else if (block.type === 'code') {
      doc.font('Courier').fontSize(8).fillColor('#1e293b').text(block.code);
      doc.font('Helvetica').fontSize(9).fillColor(TEXT_DARK);
      doc.moveDown(0.2);
    }
  }

  doc.strokeColor(BORDER_COLOR).lineWidth(0.5).moveTo(45, doc.y + 4).lineTo(550, doc.y + 4).stroke();
  doc.y += 10;
}

addQuestionCard('OVERVIEW', 1, 'Can you give a 2-minute elevator pitch of your Smart Campus Placement project?', [
  'Smart Campus Placement is an enterprise-grade recruitment platform designed to replace manual spreadsheets, delayed circulars, and fragmented emails in college placements.',
  'It connects three key stakeholders—Students, Placement Officers (TPOs), and Corporate Recruiters—in a unified automated ecosystem. The core innovation is our real-time eligibility rule engine that pre-evaluates student academic metrics (CGPA cutoff, engineering branch matching, backlog limits, and deadlines) before applications are submitted, alongside an automated recruitment state machine that manages the pipeline from shortlisting and interview scheduling to formal offer release and visual placement analytics.'
]);

addQuestionCard('TECH STACK', 2, 'What is the technology stack used, and what was your design rationale?', [
  { type: 'bullet', title: 'Spring Boot 3.4.3 & Java 23', desc: 'Chosen for robust enterprise dependency injection, declarative transactions (@Transactional), type safety, and Jakarta Bean Validation.' },
  { type: 'bullet', title: 'MySQL 8.0 & Hibernate ORM', desc: 'Recruitment processes demand strict relational integrity, composite unique constraints, and ACID guarantees across applications, interviews, and offers.' },
  { type: 'bullet', title: 'Spring Security Crypto (BCrypt)', desc: 'Implements salted, multi-round adaptive password hashing with zero plain-text storage.' },
  { type: 'bullet', title: 'React 19 + Vite 8.2', desc: 'Provides sub-second Hot Module Replacement (HMR), Context API for global session state, and modular single-page UI.' },
  { type: 'bullet', title: 'Modern Vanilla CSS', desc: 'Handcrafted CSS Custom Properties (tokens) and glassmorphic aesthetics for full flexibility without third-party CSS overhead.' }
]);

addQuestionCard('BACKEND CORE', 3, 'How does the Eligibility Rule Engine work in the backend?', [
  'The eligibility evaluation is encapsulated in EligibilityService.java. When a student views an opening or submits an application, the engine executes four deterministic validation rules:',
  '1. Academic Cutoff: student.getCgpa() >= job.getMinCgpa()',
  '2. Branch Match: job.getAllowedBranch().equals("ALL") || allowedBranches.contains(student.getBranch())',
  '3. Backlog Constraint: student.getBacklogs() <= job.getMaxBacklogs()',
  '4. Deadline Enforcement: LocalDate.now().isBefore(job.getDeadline()) || isEqual()',
  'We also exposed a dedicated pre-check endpoint (GET /applications/check-eligibility). If any rule fails, the service returns an EligibilityResult with isEligible: false and specific human-readable reasons so candidates immediately know why they are ineligible.'
]);

doc.addPage();

addQuestionCard('PIPELINE', 4, 'How is the recruitment state machine governed? What happens if an interview passes or fails?', [
  'The recruitment lifecycle is modeled as an automated state machine across ApplicationService.java and InterviewService.java:',
  { type: 'bullet', title: 'Application Creation', desc: 'Applications initialize in APPLIED status upon submission.' },
  { type: 'bullet', title: 'Shortlisting', desc: 'Only applications in APPLIED state can be transitioned to SHORTLISTED.' },
  { type: 'bullet', title: 'Interview Scheduling', desc: 'Interviews can only be booked for candidates currently in SHORTLISTED state.' },
  { type: 'bullet', title: 'Automatic State Transition', desc: 'When an interviewer submits a result, marking PASSED automatically transitions the application to SELECTED and notifies the candidate. Marking FAILED transitions it to REJECTED.' },
  { type: 'bullet', title: 'Offer Generation', desc: 'Formal offers (specifying CTC and reporting date) can only be generated for candidates in SELECTED status.' }
]);

addQuestionCard('CONCURRENCY', 5, 'How do you prevent duplicate applications from the same student for the same job?', [
  'We implement defense-in-depth across two distinct architectural layers:',
  { type: 'bullet', title: '1. Service Layer Pre-Check', desc: 'In ApplicationService.applyForJob(), we query applicationRepository.findByStudentIdAndJobId(studentId, jobId). If found, an IllegalArgumentException is thrown before any write happens.' },
  { type: 'bullet', title: '2. Database Unique Constraint', desc: 'On the MySQL table application, we enforce a composite unique constraint: @UniqueConstraint(name = "uk_student_job", columnNames = {"student_id", "job_id"}). Even under high-concurrency race conditions, the database guarantees referential uniqueness.' }
]);

addQuestionCard('SECURITY', 6, 'How does authentication and Role-Based Access Control (RBAC) work in your platform?', [
  'Authentication is strictly database-driven via AuthService.java:',
  { type: 'bullet', title: 'Password Security', desc: 'Passwords are encrypted using BCrypt (10 salt rounds).' },
  { type: 'bullet', title: 'Database Validation', desc: 'Upon login, the system queries studentRepository.findByEmail(email), verifies password matching via passwordEncoder.matches(), and extracts the stored role (STUDENT, ADMIN, or RECRUITER).' },
  { type: 'bullet', title: 'Zero Hardcoded Bypasses', desc: 'All demo bypasses and mock user IDs were removed. All users must exist in the database with valid hashed passwords.' },
  { type: 'bullet', title: 'Frontend Role Routing', desc: 'The React AuthContext stores the session and dynamically routes users: students see the Job Portal, recruiters see the Candidate Evaluation Console, and placement officers see the Executive Intelligence Dashboard.' }
]);

addQuestionCard('DATABASE', 7, 'Can you describe your database entity relationships?', [
  'The relational schema consists of 7 normalized JPA entities:',
  { type: 'bullet', title: 'Student', desc: 'User entity with authentication credentials, academic metrics (CGPA, backlogs, branch, graduation year), resume link, and role.' },
  { type: 'bullet', title: 'Company & Job', desc: 'Company stores corporate partner details. Job has a ManyToOne link to Company and stores hiring criteria.' },
  { type: 'bullet', title: 'Application', desc: 'Relational join entity connecting Student (ManyToOne) and Job (ManyToOne) with recruitment stage status.' },
  { type: 'bullet', title: 'Interview & Offer', desc: 'Both entities have ManyToOne links to Application, recording round logistics/outcomes and compensation CTC/acceptance.' },
  { type: 'bullet', title: 'Notification', desc: 'ManyToOne link to Student, storing system alerts with read/unread tracking.' }
]);

doc.addPage();

addQuestionCard('FRONTEND STATE', 8, 'How did you manage global state and data synchronization in React without Redux?', [
  'We utilized the React Context API combined with a centralized custom hook:',
  { type: 'bullet', title: 'AuthContext', desc: 'Manages user session, role resolution, login, registration, and logout with persistence in localStorage.' },
  { type: 'bullet', title: 'ToastContext', desc: 'Provides non-blocking, auto-dismissing animated feedback notifications across components.' },
  { type: 'bullet', title: 'usePlacementData Hook', desc: 'Centralizes data fetching across jobs, companies, applications, interviews, offers, and student records using parallel Promise.all calls. It exposes a synchronized refreshData() callback that modals invoke after mutations.' }
]);

addQuestionCard('CHALLENGES', 9, 'What was a major technical or security challenge you resolved in this project?', [
  'A major challenge was hardening the authentication architecture from a prototyping setup into production-ready security.',
  'Initially, the platform contained hardcoded demo bypasses for admin and recruiter logins with dummy IDs (0L, 999L) and fallback passwords. This bypassed database checks and made it impossible to audit real user actions.',
  'I refactored AuthService.java to eliminate all bypass blocks, enforced strict database lookups with BCrypt encryption across all roles, purged test accounts from MySQL while preserving real student application history, and updated the UI into a single unified role-detecting login modal. All 32 automated unit and integration tests passed cleanly.'
]);

addQuestionCard('SCALABILITY', 10, 'How would you scale this platform to support 100,000 students during placement season?', [
  'To support massive concurrent traffic spikes:',
  { type: 'bullet', title: 'Database Optimization', desc: 'Add composite indexes on application(student_id, status) and job(status, deadline). Implement MySQL Read Replicas for read-heavy job browsing.' },
  { type: 'bullet', title: 'In-Memory Caching (Redis)', desc: 'Cache active company listings (/companies) and open campus jobs (/jobs), offloading 80% of database read traffic.' },
  { type: 'bullet', title: 'Asynchronous Queues (RabbitMQ / Kafka)', desc: 'Offload email dispatches, candidate notifications, and interview schedule alerts to background workers.' },
  { type: 'bullet', title: 'Stateless JWT Tokens', desc: 'Replace stateful session tokens with cryptographically signed JSON Web Tokens (JWT) to allow horizontal scaling behind an AWS ALB or NGINX load balancer.' }
]);

// -------------------------------------------------------------
// CHEAT SHEET SUMMARY
// -------------------------------------------------------------
addSectionHeader('PART 3: HIGH-YIELD INTERVIEW BUZZWORD CHEAT SHEET');

const cheatX = [45, 170, 550];
let cheatY = doc.y + 4;

function drawCheatRow(domain, keywords, isHeader) {
  const rowHeight = 22;
  if (isHeader) {
    doc.rect(cheatX[0], cheatY, cheatX[2] - cheatX[0], rowHeight).fillAndStroke(PRIMARY, PRIMARY);
    doc.font('Helvetica-Bold').fontSize(8.5).fillColor('#ffffff');
  } else {
    doc.rect(cheatX[0], cheatY, cheatX[2] - cheatX[0], rowHeight).fillAndStroke(BG_LIGHT, BORDER_COLOR);
    doc.font('Helvetica-Bold').fontSize(8.5).fillColor(TEXT_DARK);
  }
  doc.text(domain, cheatX[0] + 6, cheatY + 6);
  if (!isHeader) doc.font('Helvetica').fillColor(TEXT_MUTED);
  doc.text(keywords, cheatX[1] + 6, cheatY + 6);
  cheatY += rowHeight;
}

drawCheatRow('Domain', 'Key Concepts & Keywords to Speak During Interview', true);
drawCheatRow('Backend Architecture', 'Spring Boot 3.4.3, Java 23, RESTful APIs, Jakarta Validation, Dependency Injection');
drawCheatRow('Data Persistence', 'Spring Data JPA, Hibernate ORM, MySQL 8.0, ACID, Composite Unique Constraints');
drawCheatRow('Recruitment Core', 'Deterministic Rule Engine, State Machine Pipeline, Pre-Eligibility Live Check');
drawCheatRow('Security & Auth', 'BCrypt Salted Hashing (10 rounds), Role-Based Access Control (RBAC), Zero-Bypass Login');
drawCheatRow('Frontend Architecture', 'React 19, Vite 8.2, React Context API, Custom Hooks (usePlacementData), Glassmorphism');
drawCheatRow('Quality Assurance', 'JUnit 5, Mockito Unit Testing, SpringBootTest Integration Suite (32/32 tests passed)');

// Page numbering
const totalPages = doc.bufferedPageRange().count;
for (let i = 0; i < totalPages; i++) {
  doc.switchToPage(i);
  doc.font('Helvetica').fontSize(8).fillColor('#94a3b8')
     .text(`Smart Campus Placement Platform — Technical Interview Guide  |  Page ${i + 1} of ${totalPages}`, 45, 800, { align: 'center', width: 505 });
}

doc.end();

stream.on('finish', () => {
  console.log('PDF generated successfully at ' + outputPath);
});
