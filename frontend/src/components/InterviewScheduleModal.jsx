import React, { useState } from "react";
import api from "../services/api";
import { useToast } from "../context/ToastContext";

export function InterviewScheduleModal({ isOpen, onClose, application, onSuccess }) {
  const { success, error: toastError } = useToast();
  const [submitting, setSubmitting] = useState(false);

  // Tomorrow's date formatted as YYYY-MM-DD
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDate = tomorrow.toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    interviewDate: defaultDate,
    interviewTime: "10:00",
    interviewType: "ONLINE",
    interviewer: "Technical Hiring Panel",
  });

  if (!isOpen || !application) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.interviewDate || !formData.interviewTime || !formData.interviewer) {
      toastError("Please fill out all required fields.");
      return;
    }

    // Ensure interview time has seconds formatted (HH:mm:ss)
    let timeStr = formData.interviewTime;
    if (timeStr.length === 5) {
      timeStr = `${timeStr}:00`;
    }

    const payload = {
      applicationId: application.id,
      interviewDate: formData.interviewDate,
      interviewTime: timeStr,
      interviewType: formData.interviewType,
      interviewer: formData.interviewer.trim(),
    };

    try {
      setSubmitting(true);
      const scheduled = await api.scheduleInterview(payload);
      success(
        `Interview scheduled successfully for ${application.student?.name || "Student"}!`
      );
      if (onSuccess) onSuccess(scheduled);
      onClose();
    } catch (err) {
      toastError(err.message || "Failed to schedule interview.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <h3>📅 Schedule Candidate Interview</h3>
            <p className="modal-subtitle">
              For <strong>{application.student?.name}</strong> •{" "}
              {application.job?.jobTitle} ({application.job?.company?.companyName})
            </p>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-row-2">
              <div className="form-group">
                <label>Interview Date *</label>
                <input
                  type="date"
                  className="form-control"
                  min={new Date().toISOString().split("T")[0]}
                  value={formData.interviewDate}
                  onChange={(e) =>
                    setFormData({ ...formData, interviewDate: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Interview Time *</label>
                <input
                  type="time"
                  className="form-control"
                  value={formData.interviewTime}
                  onChange={(e) =>
                    setFormData({ ...formData, interviewTime: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>Interview Mode / Type *</label>
                <select
                  className="form-control"
                  value={formData.interviewType}
                  onChange={(e) =>
                    setFormData({ ...formData, interviewType: e.target.value })
                  }
                >
                  <option value="ONLINE">Online (Virtual Meeting)</option>
                  <option value="OFFLINE">Offline (Campus In-Person)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Interviewer / Panel *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Lead Engineer / HR Director"
                  value={formData.interviewer}
                  onChange={(e) =>
                    setFormData({ ...formData, interviewer: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="form-notice">
              <span>💡</span>
              <p>
                Scheduling will automatically update application status to{" "}
                <strong>INTERVIEW</strong> and dispatch an instant notification to the
                student.
              </p>
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
              {submitting ? "Scheduling..." : "Confirm & Schedule Interview"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InterviewScheduleModal;
