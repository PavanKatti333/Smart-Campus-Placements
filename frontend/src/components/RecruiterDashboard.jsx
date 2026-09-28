import React, { useState } from "react";
import StatusBadge from "./StatusBadge";
import InterviewScheduleModal from "./InterviewScheduleModal";
import OfferGenerateModal from "./OfferGenerateModal";
import { useToast } from "../context/ToastContext";
import api from "../services/api";

export function RecruiterDashboard({
  jobs,
  applications,
  interviews,
  offers,
  onRefreshData,
}) {
  const { success, error: toastError } = useToast();
  const [activeTab, setActiveTab] = useState("APPLICATIONS"); // "APPLICATIONS", "INTERVIEWS", "OFFERS"
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const [schedulingApp, setSchedulingApp] = useState(null);
  const [offeringApp, setOfferingApp] = useState(null);
  const [updatingAppId, setUpdatingAppId] = useState(null);
  const [updatingInterviewId, setUpdatingInterviewId] = useState(null);

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      setUpdatingAppId(appId);
      await api.updateApplicationStatus(appId, newStatus);
      success(`Candidate status moved to ${newStatus}`);
      if (onRefreshData) onRefreshData();
    } catch (err) {
      toastError(err.message || "Failed to update status.");
    } finally {
      setUpdatingAppId(null);
    }
  };

  const handleInterviewResult = async (interviewId, resultStatus) => {
    try {
      setUpdatingInterviewId(interviewId);
      await api.updateInterviewStatus(interviewId, resultStatus);
      success(`Interview marked as ${resultStatus}! Candidate status updated.`);
      if (onRefreshData) onRefreshData();
    } catch (err) {
      toastError(err.message || "Failed to update interview.");
    } finally {
      setUpdatingInterviewId(null);
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesStatus =
      statusFilter === "ALL" || app.status?.toUpperCase() === statusFilter;
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      app.student?.name?.toLowerCase().includes(q) ||
      app.student?.branch?.toLowerCase().includes(q) ||
      app.job?.jobTitle?.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="recruiter-dashboard-view">
      <div className="recruiter-header-card">
        <div className="admin-header-title">
          <div className="recruiter-badge-icon">💼</div>
          <div>
            <h2>Campus Recruiter Portal</h2>
            <p>Review shortlisted talent, coordinate candidate interviews, and issue campus offers</p>
          </div>
        </div>

        <div className="recruiter-stats-pills">
          <div className="quick-pill">
            <span className="pill-num">{applications.length}</span>
            <span className="pill-text">Applicants</span>
          </div>
          <div className="quick-pill">
            <span className="pill-num">{interviews.length}</span>
            <span className="pill-text">Interviews</span>
          </div>
          <div className="quick-pill">
            <span className="pill-num">{offers.length}</span>
            <span className="pill-text">Offers</span>
          </div>
        </div>
      </div>

      <div className="admin-nav-tabs">
        <button
          className={`admin-nav-tab ${activeTab === "APPLICATIONS" ? "active" : ""}`}
          onClick={() => setActiveTab("APPLICATIONS")}
        >
          📋 Candidate Applicants ({applications.length})
        </button>
        <button
          className={`admin-nav-tab ${activeTab === "INTERVIEWS" ? "active" : ""}`}
          onClick={() => setActiveTab("INTERVIEWS")}
        >
          📅 Interview Rounds ({interviews.length})
        </button>
        <button
          className={`admin-nav-tab ${activeTab === "OFFERS" ? "active" : ""}`}
          onClick={() => setActiveTab("OFFERS")}
        >
          🏆 Campus Offers ({offers.length})
        </button>
      </div>

      {activeTab === "APPLICATIONS" && (
        <section className="admin-tab-section">
          <div className="admin-filter-bar">
            <div className="status-filter-pills">
              {["ALL", "ELIGIBLE", "SHORTLISTED", "INTERVIEW", "SELECTED", "REJECTED"].map(
                (status) => (
                  <button
                    key={status}
                    className={`filter-pill ${statusFilter === status ? "active" : ""}`}
                    onClick={() => setStatusFilter(status)}
                  >
                    {status}
                  </button>
                )
              )}
            </div>

            <div className="admin-search-input">
              <input
                type="text"
                placeholder="Search candidate name, branch, position..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="applications-table-card">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Major & CGPA</th>
                  <th>Applied Role</th>
                  <th>Status</th>
                  <th>Resume</th>
                  <th>Recruiter Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      No candidate applications found for this filter.
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((app) => (
                    <tr key={app.id}>
                      <td>
                        <strong>{app.student?.name}</strong>
                        <div className="sub-text">{app.student?.email}</div>
                      </td>
                      <td>
                        <div>
                          <strong>{app.student?.branch}</strong> • CGPA:{" "}
                          <strong>{app.student?.cgpa}</strong>
                        </div>
                        <div className="sub-text">
                          Backlogs: {app.student?.backlogs ?? 0}
                        </div>
                      </td>
                      <td>
                        <strong>{app.job?.jobTitle}</strong>
                        <div className="sub-text">{app.job?.company?.companyName}</div>
                      </td>
                      <td>
                        <StatusBadge status={app.status} />
                      </td>
                      <td>
                        {app.student?.resumeUrl ? (
                          <a
                            href={app.student.resumeUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-icon-link"
                          >
                            📄 View CV
                          </a>
                        ) : (
                          <span className="sub-text">None</span>
                        )}
                      </td>
                      <td>
                        <div className="table-actions-cell">
                          {app.status?.toUpperCase() === "ELIGIBLE" && (
                            <button
                              className="btn btn-sm btn-primary"
                              disabled={updatingAppId === app.id}
                              onClick={() => handleUpdateStatus(app.id, "SHORTLISTED")}
                            >
                              ★ Shortlist
                            </button>
                          )}

                          {app.status?.toUpperCase() === "SHORTLISTED" && (
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => setSchedulingApp(app)}
                            >
                              📅 Schedule Interview
                            </button>
                          )}

                          {app.status?.toUpperCase() === "SELECTED" && (
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => setOfferingApp(app)}
                            >
                              💼 Issue Offer
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === "INTERVIEWS" && (
        <section className="admin-tab-section">
          <div className="applications-table-card">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Round</th>
                  <th>Candidate</th>
                  <th>Role</th>
                  <th>Date & Time</th>
                  <th>Mode</th>
                  <th>Interviewer</th>
                  <th>Status</th>
                  <th>Assessment</th>
                </tr>
              </thead>
              <tbody>
                {interviews.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      No interviews scheduled.
                    </td>
                  </tr>
                ) : (
                  interviews.map((item) => (
                    <tr key={item.id}>
                      <td className="font-mono">#{item.id}</td>
                      <td>
                        <strong>{item.application?.student?.name}</strong>
                        <div className="sub-text">{item.application?.student?.branch}</div>
                      </td>
                      <td>{item.application?.job?.jobTitle}</td>
                      <td>
                        <div>{item.interviewDate}</div>
                        <div className="sub-text">{item.interviewTime}</div>
                      </td>
                      <td><span className="badge badge-interview">{item.interviewType}</span></td>
                      <td>{item.interviewer}</td>
                      <td><StatusBadge status={item.status} /></td>
                      <td>
                        {item.status === "SCHEDULED" ? (
                          <div className="decision-btn-group">
                            <button
                              className="btn btn-sm btn-success"
                              disabled={updatingInterviewId === item.id}
                              onClick={() => handleInterviewResult(item.id, "PASSED")}
                            >
                              ✓ Passed
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              disabled={updatingInterviewId === item.id}
                              onClick={() => handleInterviewResult(item.id, "FAILED")}
                            >
                              ✕ Failed
                            </button>
                          </div>
                        ) : (
                          <span className="sub-text">Completed</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === "OFFERS" && (
        <section className="admin-tab-section">
          <div className="applications-table-card">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Offer #</th>
                  <th>Candidate</th>
                  <th>Branch</th>
                  <th>Position</th>
                  <th>Offered CTC</th>
                  <th>Joining Date</th>
                  <th>Candidate Acceptance</th>
                </tr>
              </thead>
              <tbody>
                {offers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      No campus offers rolled out yet.
                    </td>
                  </tr>
                ) : (
                  offers.map((offer) => (
                    <tr key={offer.id}>
                      <td className="font-mono">#{offer.id}</td>
                      <td>
                        <strong>{offer.application?.student?.name}</strong>
                        <div className="sub-text">{offer.application?.student?.email}</div>
                      </td>
                      <td>{offer.application?.student?.branch}</td>
                      <td>{offer.application?.job?.jobTitle}</td>
                      <td>
                        <strong className="text-success">
                          ₹{(offer.offeredSalary / 100000).toFixed(2)} LPA
                        </strong>
                      </td>
                      <td>{offer.joiningDate}</td>
                      <td><StatusBadge status={offer.offerStatus} /></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <InterviewScheduleModal
        isOpen={!!schedulingApp}
        application={schedulingApp}
        onClose={() => setSchedulingApp(null)}
        onSuccess={() => onRefreshData && onRefreshData()}
      />

      <OfferGenerateModal
        isOpen={!!offeringApp}
        application={offeringApp}
        onClose={() => setOfferingApp(null)}
        onSuccess={() => onRefreshData && onRefreshData()}
      />
    </div>
  );
}

export default RecruiterDashboard;
