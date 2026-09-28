import React, { useState, useEffect } from "react";
import api from "../services/api";

export function JobCard({ job, student, hasApplied, onApply, applying }) {
  const [eligibility, setEligibility] = useState(null);
  const [loadingEligibility, setLoadingEligibility] = useState(false);
  const [showEligibilityDetails, setShowEligibilityDetails] = useState(false);

  useEffect(() => {
    if (student && student.id && job && job.id) {
      let isMounted = true;
      setLoadingEligibility(true);
      api.checkEligibility(student.id, job.id)
        .then((res) => {
          if (isMounted) setEligibility(res);
        })
        .catch((err) => {
          console.warn("Could not check pre-eligibility:", err);
        })
        .finally(() => {
          if (isMounted) setLoadingEligibility(false);
        });
      return () => {
        isMounted = false;
      };
    }
  }, [student?.id, job?.id]);

  const formatSalary = (amt) => {
    if (!amt) return "₹0";
    if (amt >= 100000) {
      return `₹${(amt / 100000).toFixed(1)} LPA`;
    }
    return `₹${amt.toLocaleString("en-IN")}`;
  };

  const isDeadlinePassed = () => {
    if (!job.applicationDeadline) return false;
    const deadline = new Date(job.applicationDeadline);
    return deadline < new Date();
  };

  const deadlinePassed = isDeadlinePassed();

  return (
    <div className={`enhanced-job-card ${hasApplied ? "applied-card" : ""}`}>
      <div className="job-card-header">
        <div className="job-company-info">
          <div className="company-logo-avatar">
            {job.company?.companyName ? job.company.companyName.charAt(0) : "💼"}
          </div>
          <div>
            <h3 className="job-title">{job.jobTitle}</h3>
            <div className="job-company-sub">
              <span className="company-name">{job.company?.companyName || "Partner Employer"}</span>
              {job.company?.location && (
                <span className="company-location">📍 {job.company.location}</span>
              )}
            </div>
          </div>
        </div>

        <div className="job-salary-badge">
          <span className="salary-amount">{formatSalary(job.salary)}</span>
          <span className="salary-label">Fixed CTC</span>
        </div>
      </div>

      <p className="job-description-text">{job.jobDescription}</p>

      {/* Criteria Badges */}
      <div className="job-criteria-pills">
        <div className="criteria-pill">
          <span className="criteria-icon">🎓</span>
          <span>CGPA: <strong>{job.minimumCgpa}+</strong></span>
        </div>
        <div className="criteria-pill">
          <span className="criteria-icon">🏛</span>
          <span>Branches: <strong>{job.allowedBranch || "ALL"}</strong></span>
        </div>
        <div className="criteria-pill">
          <span className="criteria-icon">⚠️</span>
          <span>Backlogs: <strong>≤ {job.maxBacklogs ?? 0}</strong></span>
        </div>
        <div className={`criteria-pill ${deadlinePassed ? "expired" : ""}`}>
          <span className="criteria-icon">⏰</span>
          <span>
            {deadlinePassed ? "Expired: " : "Deadline: "}
            <strong>{job.applicationDeadline || "Open"}</strong>
          </span>
        </div>
      </div>

      {/* Real-time Student Eligibility Evaluator */}
      {student && (
        <div className="job-eligibility-banner">
          {loadingEligibility ? (
            <span className="eligibility-evaluating">Checking your eligibility...</span>
          ) : eligibility ? (
            <div className="eligibility-row">
              <div className="eligibility-status-group">
                <span className={`eligibility-chip ${eligibility.eligible ? "eligible" : "ineligible"}`}>
                  {eligibility.eligible ? "✓ You Meet All Criteria" : "✕ Not Eligible"}
                </span>
                {!eligibility.eligible && eligibility.reasons && (
                  <button
                    type="button"
                    className="eligibility-toggle-btn"
                    onClick={() => setShowEligibilityDetails(!showEligibilityDetails)}
                  >
                    {showEligibilityDetails ? "Hide details" : "Why am I ineligible?"}
                  </button>
                )}
              </div>

              {showEligibilityDetails && !eligibility.eligible && (
                <div className="eligibility-reasons-box">
                  <ul>
                    {eligibility.reasons?.map((reason, idx) => (
                      <li key={idx}>• {reason}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : null}
        </div>
      )}

      {/* Action Footer */}
      <div className="job-card-footer">
        {job.company?.website && (
          <a
            href={job.company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="company-link"
          >
            Visit Website ↗
          </a>
        )}

        <div className="job-action-buttons">
          {hasApplied ? (
            <span className="applied-pill">✓ Application Submitted</span>
          ) : (
            <button
              className={`btn btn-primary ${eligibility && !eligibility.eligible ? "btn-warning-action" : ""}`}
              onClick={() => onApply(job.id)}
              disabled={applying || deadlinePassed}
            >
              {applying
                ? "Submitting Application..."
                : deadlinePassed
                ? "Deadline Passed"
                : "Apply Now →"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default JobCard;
