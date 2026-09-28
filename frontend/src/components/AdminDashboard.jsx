import React, { useState } from "react";
import StatusBadge from "./StatusBadge";
import AnalyticsDashboard from "./AnalyticsDashboard";
import InterviewScheduleModal from "./InterviewScheduleModal";
import OfferGenerateModal from "./OfferGenerateModal";
import JobModal from "./JobModal";
import CompanyModal from "./CompanyModal";
import { useToast } from "../context/ToastContext";
import api from "../services/api";

export function AdminDashboard({
  jobs,
  companies,
  applications,
  interviews,
  offers,
  students,
  onRefreshData,
}) {
  const { success, error: toastError } = useToast();
  const [activeTab, setActiveTab] = useState("ANALYTICS"); // "ANALYTICS", "APPLICATIONS", "JOBS", "COMPANIES", "INTERVIEWS", "OFFERS", "STUDENTS"
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  // Modals state
  const [schedulingApp, setSchedulingApp] = useState(null);
  const [offeringApp, setOfferingApp] = useState(null);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);

  // Status updating states
  const [updatingAppId, setUpdatingAppId] = useState(null);
  const [updatingInterviewId, setUpdatingInterviewId] = useState(null);

  const handleUpdateAppStatus = async (appId, newStatus) => {
    try {
      setUpdatingAppId(appId);
      await api.updateApplicationStatus(appId, newStatus);
      success(`Application #${appId} moved to ${newStatus}`);
      if (onRefreshData) onRefreshData();
    } catch (err) {
      toastError(err.message || "Failed to update application status.");
    } finally {
      setUpdatingAppId(null);
    }
  };

  const handleInterviewResult = async (interviewId, resultStatus) => {
    try {
      setUpdatingInterviewId(interviewId);
      await api.updateInterviewStatus(interviewId, resultStatus);
      success(`Interview marked as ${resultStatus}! Candidate status updated automatically.`);
      if (onRefreshData) onRefreshData();
    } catch (err) {
      toastError(err.message || "Failed to update interview result.");
    } finally {
      setUpdatingInterviewId(null);
    }
  };

  const handleDeleteJob = async (jobId, title) => {
    if (!window.confirm(`Are you sure you want to delete the job opening: "${title}"?`)) {
      return;
    }
    try {
      await api.deleteJob(jobId);
      success(`Job "${title}" deleted successfully.`);
      if (onRefreshData) onRefreshData();
    } catch (err) {
      toastError(err.message || "Failed to delete job.");
    }
  };

  const handleDeleteCompany = async (companyId, name) => {
    if (!window.confirm(`Are you sure you want to delete employer "${name}"?`)) {
      return;
    }
    try {
      await api.deleteCompany(companyId);
      success(`Company "${name}" deleted.`);
      if (onRefreshData) onRefreshData();
    } catch (err) {
      toastError(err.message || "Failed to delete company. Ensure no active jobs are tied to it.");
    }
  };

  // Filter applications
  const filteredApplications = applications.filter((app) => {
    const matchesStatus =
      statusFilter === "ALL" || app.status?.toUpperCase() === statusFilter;
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      app.student?.name?.toLowerCase().includes(q) ||
      app.student?.email?.toLowerCase().includes(q) ||
      app.job?.jobTitle?.toLowerCase().includes(q) ||
      app.job?.company?.companyName?.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="admin-dashboard-view">
      {/* Admin Title Header */}
      <div className="admin-header-card">
        <div className="admin-header-title">
          <div className="admin-badge-icon">🏛</div>
          <div>
            <h2>Chief Placement Officer Command Center</h2>
            <p>Administer recruitment drives, shortlists, interview rounds, offers, and partner employers</p>
          </div>
        </div>

        <div className="admin-header-actions">
          <button className="btn btn-primary btn-sm" onClick={() => setIsJobModalOpen(true)}>
            ➕ Publish Job Opening
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => setIsCompanyModalOpen(true)}>
            ➕ Add Partner Company
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="admin-nav-tabs">
        <button
          className={`admin-nav-tab ${activeTab === "ANALYTICS" ? "active" : ""}`}
          onClick={() => setActiveTab("ANALYTICS")}
        >
          📊 Intelligence & KPIs
        </button>
        <button
          className={`admin-nav-tab ${activeTab === "APPLICATIONS" ? "active" : ""}`}
          onClick={() => setActiveTab("APPLICATIONS")}
        >
          📋 Applications Pipeline ({applications.length})
        </button>
        <button
          className={`admin-nav-tab ${activeTab === "JOBS" ? "active" : ""}`}
          onClick={() => setActiveTab("JOBS")}
        >
          💼 Job Openings ({jobs.length})
        </button>
        <button
          className={`admin-nav-tab ${activeTab === "COMPANIES" ? "active" : ""}`}
          onClick={() => setActiveTab("COMPANIES")}
        >
          🏢 Employers ({companies.length})
        </button>
        <button
          className={`admin-nav-tab ${activeTab === "INTERVIEWS" ? "active" : ""}`}
          onClick={() => setActiveTab("INTERVIEWS")}
        >
          📅 Interviews ({interviews.length})
        </button>
        <button
          className={`admin-nav-tab ${activeTab === "OFFERS" ? "active" : ""}`}
          onClick={() => setActiveTab("OFFERS")}
        >
          🏆 Offers Issued ({offers.length})
        </button>
        <button
          className={`admin-nav-tab ${activeTab === "STUDENTS" ? "active" : ""}`}
          onClick={() => setActiveTab("STUDENTS")}
        >
          🎓 Students ({students.length})
        </button>
      </div>

      {/* TAB 1: ANALYTICS */}
      {activeTab === "ANALYTICS" && <AnalyticsDashboard />}

      {/* TAB 2: APPLICATIONS PIPELINE */}
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
                placeholder="Search applicant name, email, role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="applications-table-card">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>App #</th>
                  <th>Candidate</th>
                  <th>Academic Info</th>
                  <th>Applied Role</th>
                  <th>Company</th>
                  <th>Current Status</th>
                  <th>Stage Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      No applications found matching the selected filter.
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((app) => (
                    <tr key={app.id}>
                      <td className="font-mono">#{app.id}</td>
                      <td>
                        <strong>{app.student?.name}</strong>
                        <div className="sub-text">{app.student?.email}</div>
                      </td>
                      <td>
                        <div>CGPA: <strong>{app.student?.cgpa}</strong></div>
                        <div className="sub-text">
                          {app.student?.branch} • {app.student?.backlogs} backlogs
                        </div>
                      </td>
                      <td>
                        <strong>{app.job?.jobTitle}</strong>
                        <div className="sub-text">₹{(app.job?.salary / 100000).toFixed(1)} LPA</div>
                      </td>
                      <td>{app.job?.company?.companyName}</td>
                      <td>
                        <select
                          className="status-select"
                          value={app.status || ""}
                          disabled={updatingAppId === app.id}
                          onChange={(e) => handleUpdateAppStatus(app.id, e.target.value)}
                        >
                          <option value="ELIGIBLE">ELIGIBLE</option>
                          <option value="SHORTLISTED">SHORTLISTED</option>
                          <option value="INTERVIEW">INTERVIEW</option>
                          <option value="SELECTED">SELECTED</option>
                          <option value="REJECTED">REJECTED</option>
                        </select>
                      </td>
                      <td>
                        <div className="table-actions-cell">
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
                              💼 Generate Offer
                            </button>
                          )}

                          {app.student?.resumeUrl && (
                            <a
                              href={app.student.resumeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-icon-link"
                              title="View Resume"
                            >
                              📄
                            </a>
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

      {/* TAB 3: JOBS */}
      {activeTab === "JOBS" && (
        <section className="admin-tab-section">
          <div className="section-header-row">
            <div>
              <h3>Active Campus Job Openings</h3>
              <p>Manage criteria, eligibility, compensation, and deadlines</p>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => setIsJobModalOpen(true)}>
              ➕ Add New Job Opening
            </button>
          </div>

          <div className="admin-grid-cards">
            {jobs.map((job) => (
              <div key={job.id} className="admin-resource-card">
                <div className="resource-card-top">
                  <div className="company-logo-avatar">
                    {job.company?.companyName ? job.company.companyName.charAt(0) : "💼"}
                  </div>
                  <div>
                    <h4>{job.jobTitle}</h4>
                    <span className="sub-text">{job.company?.companyName} • {job.company?.location}</span>
                  </div>
                </div>

                <p className="resource-desc">{job.jobDescription}</p>

                <div className="resource-stats-row">
                  <div>
                    <span className="stat-label">Package</span>
                    <strong>₹{(job.salary / 100000).toFixed(1)} LPA</strong>
                  </div>
                  <div>
                    <span className="stat-label">Min CGPA</span>
                    <strong>{job.minimumCgpa}+</strong>
                  </div>
                  <div>
                    <span className="stat-label">Branches</span>
                    <strong>{job.allowedBranch || "ALL"}</strong>
                  </div>
                  <div>
                    <span className="stat-label">Deadline</span>
                    <strong>{job.applicationDeadline}</strong>
                  </div>
                </div>

                <div className="resource-footer">
                  <span className="badge badge-eligible">{job.status}</span>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteJob(job.id, job.jobTitle)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 4: COMPANIES */}
      {activeTab === "COMPANIES" && (
        <section className="admin-tab-section">
          <div className="section-header-row">
            <div>
              <h3>Corporate Hiring Partners</h3>
              <p>Registered enterprise employers participating in campus placements</p>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => setIsCompanyModalOpen(true)}>
              ➕ Add Partner Company
            </button>
          </div>

          <div className="admin-grid-cards">
            {companies.map((company) => (
              <div key={company.id} className="admin-resource-card">
                <div className="resource-card-top">
                  <div className="company-logo-avatar">
                    {company.companyName.charAt(0)}
                  </div>
                  <div>
                    <h4>{company.companyName}</h4>
                    <span className="sub-text">📍 {company.location}</span>
                  </div>
                </div>

                <p className="resource-desc">{company.description || "Campus recruiting partner"}</p>

                <div className="resource-contact-list">
                  <div>✉ {company.email}</div>
                  <div>📞 {company.phone}</div>
                  {company.website && (
                    <div>
                      🌐{" "}
                      <a href={company.website} target="_blank" rel="noreferrer">
                        {company.website}
                      </a>
                    </div>
                  )}
                </div>

                <div className="resource-footer">
                  <span className="sub-text font-mono">Employer #{company.id}</span>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteCompany(company.id, company.companyName)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 5: INTERVIEWS */}
      {activeTab === "INTERVIEWS" && (
        <section className="admin-tab-section">
          <div className="section-header-row">
            <div>
              <h3>Scheduled Technical & HR Interviews</h3>
              <p>Evaluate candidates, record panel decisions, and trigger automatic transitions</p>
            </div>
          </div>

          <div className="applications-table-card">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Round #</th>
                  <th>Candidate</th>
                  <th>Job Position</th>
                  <th>Company</th>
                  <th>Date & Time</th>
                  <th>Mode</th>
                  <th>Panel</th>
                  <th>Status</th>
                  <th>Decision Actions</th>
                </tr>
              </thead>
              <tbody>
                {interviews.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center py-4">
                      No interviews scheduled yet.
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
                      <td>{item.application?.job?.company?.companyName}</td>
                      <td>
                        <div>{item.interviewDate}</div>
                        <div className="sub-text">{item.interviewTime}</div>
                      </td>
                      <td>
                        <span className="badge badge-interview">{item.interviewType}</span>
                      </td>
                      <td>{item.interviewer}</td>
                      <td>
                        <StatusBadge status={item.status} />
                      </td>
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

      {/* TAB 6: OFFERS */}
      {activeTab === "OFFERS" && (
        <section className="admin-tab-section">
          <div className="section-header-row">
            <div>
              <h3>Placement Offers Registry</h3>
              <p>Documented job offers issued to campus candidates</p>
            </div>
          </div>

          <div className="applications-table-card">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Offer #</th>
                  <th>Candidate</th>
                  <th>Branch</th>
                  <th>Company</th>
                  <th>Designation</th>
                  <th>Offered Package</th>
                  <th>Joining Date</th>
                  <th>Student Decision</th>
                </tr>
              </thead>
              <tbody>
                {offers.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      No offers generated yet. Shortlist and select candidates to issue offers.
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
                      <td>{offer.application?.job?.company?.companyName}</td>
                      <td>{offer.application?.job?.jobTitle}</td>
                      <td>
                        <strong className="text-success">
                          ₹{(offer.offeredSalary / 100000).toFixed(2)} LPA
                        </strong>
                      </td>
                      <td>{offer.joiningDate}</td>
                      <td>
                        <StatusBadge status={offer.offerStatus} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* TAB 7: STUDENTS */}
      {activeTab === "STUDENTS" && (
        <section className="admin-tab-section">
          <div className="section-header-row">
            <div>
              <h3>Registered Campus Talent Pool</h3>
              <p>Active student roster eligible for campus placements</p>
            </div>
          </div>

          <div className="applications-table-card">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Branch</th>
                  <th>CGPA</th>
                  <th>Backlogs</th>
                  <th>Graduation</th>
                  <th>Resume</th>
                </tr>
              </thead>
              <tbody>
                {students.map((st) => (
                  <tr key={st.id}>
                    <td className="font-mono">#{st.id}</td>
                    <td><strong>{st.name}</strong></td>
                    <td>{st.email}</td>
                    <td>{st.phone || "-"}</td>
                    <td><span className="badge badge-eligible">{st.branch}</span></td>
                    <td><strong>{st.cgpa}</strong></td>
                    <td>
                      <span className={st.backlogs > 0 ? "text-danger font-bold" : ""}>
                        {st.backlogs}
                      </span>
                    </td>
                    <td>{st.graduationYear}</td>
                    <td>
                      {st.resumeUrl ? (
                        <a
                          href={st.resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-icon-link"
                          title="View Resume"
                        >
                          📄 Resume
                        </a>
                      ) : (
                        <span className="sub-text">None</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Modals */}
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

      <JobModal
        isOpen={isJobModalOpen}
        companies={companies}
        onClose={() => setIsJobModalOpen(false)}
        onSuccess={() => onRefreshData && onRefreshData()}
      />

      <CompanyModal
        isOpen={isCompanyModalOpen}
        onClose={() => setIsCompanyModalOpen(false)}
        onSuccess={() => onRefreshData && onRefreshData()}
      />
    </div>
  );
}

export default AdminDashboard;
