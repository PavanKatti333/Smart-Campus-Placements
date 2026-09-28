import React, { useState } from "react";
import api from "../services/api";
import { useToast } from "../context/ToastContext";

export function JobModal({ isOpen, onClose, companies, onSuccess }) {
  const { success, error: toastError } = useToast();
  const [submitting, setSubmitting] = useState(false);

  // 15 days from now formatted as YYYY-MM-DD
  const twoWeeksLater = new Date();
  twoWeeksLater.setDate(twoWeeksLater.getDate() + 15);
  const defaultDeadline = twoWeeksLater.toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    companyId: companies && companies.length > 0 ? companies[0].id : "",
    jobTitle: "",
    jobDescription: "",
    salary: 750000,
    minimumCgpa: 7.0,
    allowedBranch: "CSE, IT, ECE",
    maximumBacklogs: 0,
    applicationDeadline: defaultDeadline,
    status: "OPEN",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.companyId || !formData.jobTitle || !formData.jobDescription) {
      toastError("Please complete all required fields.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        companyId: Number(formData.companyId),
        jobTitle: formData.jobTitle.trim(),
        jobDescription: formData.jobDescription.trim(),
        salary: parseFloat(formData.salary),
        minimumCgpa: parseFloat(formData.minimumCgpa),
        allowedBranch: formData.allowedBranch.trim(),
        maximumBacklogs: parseInt(formData.maximumBacklogs, 10),
        applicationDeadline: formData.applicationDeadline,
        status: formData.status,
      };

      const created = await api.createJob(payload);
      success(`Campus job opening "${created.jobTitle}" published successfully!`);
      if (onSuccess) onSuccess(created);
      onClose();
    } catch (err) {
      toastError(err.message || "Failed to publish job opening.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <h3>💼 Create Campus Job Opening</h3>
            <p className="modal-subtitle">Define hiring role, eligibility criteria, and timeline</p>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-row-2">
              <div className="form-group">
                <label>Hiring Partner / Company *</label>
                <select
                  className="form-control"
                  value={formData.companyId}
                  onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                  required
                >
                  <option value="">-- Select Company --</option>
                  {companies?.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.companyName} ({c.location})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Job Designation / Title *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Software Development Engineer"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Job Description & Responsibilities *</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Key technical expectations, stack, responsibilities, and interview process details..."
                value={formData.jobDescription}
                onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                required
              />
            </div>

            <div className="form-row-3">
              <div className="form-group">
                <label>Annual CTC (₹ INR) *</label>
                <input
                  type="number"
                  step="10000"
                  min="50000"
                  className="form-control"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Min. CGPA Cut-off *</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  className="form-control"
                  value={formData.minimumCgpa}
                  onChange={(e) => setFormData({ ...formData, minimumCgpa: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Max Backlogs Permitted *</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  className="form-control"
                  value={formData.maximumBacklogs}
                  onChange={(e) => setFormData({ ...formData, maximumBacklogs: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>Eligible Engineering Branches *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. CSE, IT, ECE (or ALL)"
                  value={formData.allowedBranch}
                  onChange={(e) => setFormData({ ...formData, allowedBranch: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Application Deadline *</label>
                <input
                  type="date"
                  className="form-control"
                  min={new Date().toISOString().split("T")[0]}
                  value={formData.applicationDeadline}
                  onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? "Publishing..." : "Publish Job Opening"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default JobModal;
