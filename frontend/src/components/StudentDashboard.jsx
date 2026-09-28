import React, { useState } from "react";
import StatusBadge from "./StatusBadge";
import JobCard from "./JobCard";
import { useToast } from "../context/ToastContext";
import api from "../services/api";

export function StudentDashboard({
  student,
  jobs,
  applications,
  interviews,
  offers,
  onRefreshData,
  onOpenProfile,
}) {
  const { success, error: toastError } = useToast();
  const [activeTab, setActiveTab] = useState("JOBS"); // "JOBS", "APPLICATIONS", "INTERVIEWS", "OFFERS"
  const [searchTerm, setSearchTerm] = useState("");
  const [applyingJobId, setApplyingJobId] = useState(null);
  const [updatingOfferId, setUpdatingOfferId] = useState(null);

  const hasApplied = (jobId) => {
    return applications.some((app) => app.job?.id === jobId);
  };

  const handleApply = async (jobId) => {
    if (!student || !student.id) {
      toastError("Please log in as a student to apply.");
      return;
    }

    try {
      setApplyingJobId(jobId);
      const res = await api.applyForJob(student.id, jobId);
      success("Application submitted successfully! Check status under 'My Applications'.");
      if (onRefreshData) onRefreshData();
    } catch (err) {
      toastError(err.message || "Failed to submit application.");
    } finally {
      setApplyingJobId(null);
    }
  };

  const handleOfferStatus = async (offerId, newStatus) => {
    try {
      setUpdatingOfferId(offerId);
      await api.updateOfferStatus(offerId, newStatus);
      if (newStatus === "ACCEPTED") {
        success("🎉 Congratulations! You have accepted the campus placement offer.");
      } else {
        success("You have declined the offer.");
      }
      if (onRefreshData) onRefreshData();
    } catch (err) {
      toastError(err.message || "Failed to update offer status.");
    } finally {
      setUpdatingOfferId(null);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const q = searchTerm.toLowerCase();
    const titleMatch = job.jobTitle?.toLowerCase().includes(q);
    const companyMatch = job.company?.companyName?.toLowerCase().includes(q);
    const branchMatch = job.allowedBranch?.toLowerCase().includes(q);
    return titleMatch || companyMatch || branchMatch;
  });

  const shortlistedCount = applications.filter(
    (app) => app.status?.toUpperCase() === "SHORTLISTED"
  ).length;

  const activeInterviewsCount = interviews.filter(
    (i) => i.status === "SCHEDULED"
  ).length;

  const pendingOffersCount = offers.filter(
    (o) => o.offerStatus === "GENERATED"
  ).length;

  return (
    <div className="student-dashboard-view">
      {/* Student Welcome & Profile Hero Card */}
      <div className="student-hero-card">
        <div className="hero-profile-left">
          <div className="student-big-avatar">
            {student?.name ? student.name.charAt(0) : "S"}
          </div>
          <div className="student-details">
            <div className="student-name-row">
              <h2>{student?.name || "Student"}</h2>
              <span className="badge badge-eligible">{student?.branch || "Engineering"}</span>
            </div>
            <p className="student-email">{student?.email} • Graduation Class of {student?.graduationYear || 2027}</p>

            <div className="student-stat-chips">
              <div className="stat-chip">
                <span className="stat-chip-label">CGPA</span>
                <span className="stat-chip-val">{student?.cgpa !== undefined ? student.cgpa : "-"}</span>
              </div>
              <div className="stat-chip">
                <span className="stat-chip-label">Backlogs</span>
                <span className={`stat-chip-val ${student?.backlogs > 0 ? "warning" : ""}`}>
                  {student?.backlogs ?? 0}
                </span>
              </div>
              <div className="stat-chip">
                <span className="stat-chip-label">Phone</span>
                <span className="stat-chip-val">{student?.phone || "Not set"}</span>
              </div>
              {student?.resumeUrl && (
                <a
                  href={student.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resume-pill-link"
                >
                  📄 View Resume
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="hero-profile-right">
          <button className="btn btn-secondary btn-sm" onClick={onOpenProfile}>
            ✎ Edit My Profile
          </button>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="student-metrics-grid">
        <div
          className={`student-metric-card ${activeTab === "APPLICATIONS" ? "selected" : ""}`}
          onClick={() => setActiveTab("APPLICATIONS")}
        >
          <div className="metric-top">
            <span className="metric-icon">📋</span>
            <span className="metric-number">{applications.length}</span>
          </div>
          <span className="metric-title">Applied Positions</span>
          <span className="metric-hint">View application timeline →</span>
        </div>

        <div
          className={`student-metric-card ${activeTab === "APPLICATIONS" ? "selected" : ""}`}
          onClick={() => setActiveTab("APPLICATIONS")}
        >
          <div className="metric-top">
            <span className="metric-icon">★</span>
            <span className="metric-number">{shortlistedCount}</span>
          </div>
          <span className="metric-title">Shortlisted Applications</span>
          <span className="metric-hint">Awaiting interview scheduling</span>
        </div>

        <div
          className={`student-metric-card ${activeTab === "INTERVIEWS" ? "selected" : ""}`}
          onClick={() => setActiveTab("INTERVIEWS")}
        >
          <div className="metric-top">
            <span className="metric-icon">📅</span>
            <span className="metric-number">{activeInterviewsCount}</span>
          </div>
          <span className="metric-title">Upcoming Interviews</span>
          <span className="metric-hint">Check dates and schedule →</span>
        </div>

        <div
          className={`student-metric-card ${activeTab === "OFFERS" ? "selected" : ""}`}
          onClick={() => setActiveTab("OFFERS")}
        >
          <div className="metric-top">
            <span className="metric-icon">🏆</span>
            <span className="metric-number">{offers.length}</span>
          </div>
          <span className="metric-title">Offers Received</span>
          <span className="metric-hint">
            {pendingOffersCount > 0 ? `${pendingOffersCount} awaiting action!` : "View offer details"}
          </span>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="dashboard-tabs-container">
        <div className="dashboard-tabs">
          <button
            className={`dashboard-tab ${activeTab === "JOBS" ? "active" : ""}`}
            onClick={() => setActiveTab("JOBS")}
          >
            💼 Available Job Openings ({jobs.length})
          </button>
          <button
            className={`dashboard-tab ${activeTab === "APPLICATIONS" ? "active" : ""}`}
            onClick={() => setActiveTab("APPLICATIONS")}
          >
            📋 My Applications ({applications.length})
          </button>
          <button
            className={`dashboard-tab ${activeTab === "INTERVIEWS" ? "active" : ""}`}
            onClick={() => setActiveTab("INTERVIEWS")}
          >
            📅 My Interviews ({interviews.length})
          </button>
          <button
            className={`dashboard-tab ${activeTab === "OFFERS" ? "active" : ""}`}
            onClick={() => setActiveTab("OFFERS")}
          >
            🏆 My Placement Offers ({offers.length})
          </button>
        </div>

        {activeTab === "JOBS" && (
          <div className="tab-search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by job title, employer, branch..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="clear-search-btn" onClick={() => setSearchTerm("")}>
                ✕
              </button>
            )}
          </div>
        )}
      </div>

      {/* Tab 1: Available Jobs */}
      {activeTab === "JOBS" && (
        <section className="tab-content-section">
          {filteredJobs.length === 0 ? (
            <div className="empty-state-box">
              <span className="empty-state-icon">💼</span>
              <h3>No matching campus openings found</h3>
              <p>Try adjusting your search criteria or check back later for newly published jobs.</p>
            </div>
          ) : (
            <div className="jobs-grid">
              {filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  student={student}
                  hasApplied={hasApplied(job.id)}
                  onApply={handleApply}
                  applying={applyingJobId === job.id}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Tab 2: My Applications */}
      {activeTab === "APPLICATIONS" && (
        <section className="tab-content-section">
          {applications.length === 0 ? (
            <div className="empty-state-box">
              <span className="empty-state-icon">📋</span>
              <h3>You haven't submitted any applications yet</h3>
              <p>Explore the active job listings above and apply to get shortlisted!</p>
              <button className="btn btn-primary" onClick={() => setActiveTab("JOBS")}>
                Browse Job Openings →
              </button>
            </div>
          ) : (
            <div className="applications-table-card">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Application #</th>
                    <th>Company</th>
                    <th>Job Title</th>
                    <th>Salary / Package</th>
                    <th>Status</th>
                    <th>Applied Date</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id}>
                      <td className="font-mono">#{app.id}</td>
                      <td>
                        <strong>{app.job?.company?.companyName || "Employer"}</strong>
                      </td>
                      <td>{app.job?.jobTitle}</td>
                      <td>
                        ₹{(app.job?.salary / 100000).toFixed(1)} LPA
                      </td>
                      <td>
                        <StatusBadge status={app.status} />
                      </td>
                      <td>
                        {app.appliedDate
                          ? new Date(app.appliedDate).toLocaleDateString()
                          : "Recently"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* Tab 3: My Interviews */}
      {activeTab === "INTERVIEWS" && (
        <section className="tab-content-section">
          {interviews.length === 0 ? (
            <div className="empty-state-box">
              <span className="empty-state-icon">📅</span>
              <h3>No interviews scheduled yet</h3>
              <p>When employers shortlist your application, your scheduled interview rounds will appear here.</p>
            </div>
          ) : (
            <div className="interviews-cards-grid">
              {interviews.map((interview) => (
                <div key={interview.id} className="interview-schedule-card">
                  <div className="interview-card-top">
                    <div>
                      <span className="interview-type-tag">{interview.interviewType}</span>
                      <h4>{interview.application?.job?.jobTitle}</h4>
                      <p className="interview-company">
                        {interview.application?.job?.company?.companyName}
                      </p>
                    </div>
                    <StatusBadge status={interview.status} />
                  </div>

                  <div className="interview-details-grid">
                    <div className="detail-box">
                      <span className="detail-label">Date</span>
                      <strong>{interview.interviewDate || "TBA"}</strong>
                    </div>
                    <div className="detail-box">
                      <span className="detail-label">Time</span>
                      <strong>{interview.interviewTime || "TBA"}</strong>
                    </div>
                    <div className="detail-box">
                      <span className="detail-label">Interviewer / Panel</span>
                      <strong>{interview.interviewer || "Technical Team"}</strong>
                    </div>
                  </div>

                  {interview.status === "SCHEDULED" && (
                    <div className="interview-reminder-bar">
                      <span>🔔</span>
                      <p>Please be ready with your resume 10 minutes prior to the scheduled time.</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Tab 4: My Offers */}
      {activeTab === "OFFERS" && (
        <section className="tab-content-section">
          {offers.length === 0 ? (
            <div className="empty-state-box">
              <span className="empty-state-icon">🏆</span>
              <h3>No placement offers received yet</h3>
              <p>Keep applying and preparing for interviews. Best of luck on your recruitment drive!</p>
            </div>
          ) : (
            <div className="offers-cards-grid">
              {offers.map((offer) => (
                <div key={offer.id} className="formal-offer-card">
                  <div className="offer-badge-ribbon">
                    <StatusBadge status={offer.offerStatus} />
                  </div>

                  <div className="offer-header">
                    <div className="offer-icon-badge">💼</div>
                    <div>
                      <h3>{offer.application?.job?.company?.companyName}</h3>
                      <p className="offer-role">{offer.application?.job?.jobTitle}</p>
                    </div>
                  </div>

                  <div className="offer-financials-card">
                    <div className="financial-col">
                      <span className="financial-label">Annual Compensation (CTC)</span>
                      <span className="financial-amount">
                        ₹{(offer.offeredSalary / 100000).toFixed(2)} LPA
                      </span>
                      <span className="financial-sub">₹{offer.offeredSalary.toLocaleString("en-IN")} / year</span>
                    </div>

                    <div className="financial-col border-left">
                      <span className="financial-label">Joining Date</span>
                      <span className="joining-date-val">
                        {offer.joiningDate || "To be announced"}
                      </span>
                      <span className="financial-sub">Reporting Location: Campus / HQ</span>
                    </div>
                  </div>

                  {offer.offerStatus === "GENERATED" && (
                    <div className="offer-actions-bar">
                      <p className="offer-prompt">Please respond to this placement offer:</p>
                      <div className="offer-btn-group">
                        <button
                          className="btn btn-success"
                          disabled={updatingOfferId === offer.id}
                          onClick={() => handleOfferStatus(offer.id, "ACCEPTED")}
                        >
                          {updatingOfferId === offer.id ? "Processing..." : "✓ Accept Offer"}
                        </button>
                        <button
                          className="btn btn-danger"
                          disabled={updatingOfferId === offer.id}
                          onClick={() => handleOfferStatus(offer.id, "REJECTED")}
                        >
                          ✕ Decline Offer
                        </button>
                      </div>
                    </div>
                  )}

                  {offer.offerStatus === "ACCEPTED" && (
                    <div className="offer-confirmed-banner success">
                      <span>🎉</span>
                      <p>
                        You have officially <strong>ACCEPTED</strong> this placement offer!
                        The Training & Placement cell has documented your record.
                      </p>
                    </div>
                  )}

                  {offer.offerStatus === "REJECTED" && (
                    <div className="offer-confirmed-banner rejected">
                      <span>✕</span>
                      <p>You have declined this placement offer.</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default StudentDashboard;
