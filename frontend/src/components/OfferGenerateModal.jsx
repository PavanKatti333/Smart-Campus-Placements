import React, { useState } from "react";
import api from "../services/api";
import { useToast } from "../context/ToastContext";

export function OfferGenerateModal({ isOpen, onClose, application, onSuccess }) {
  const { success, error: toastError } = useToast();
  const [submitting, setSubmitting] = useState(false);

  // 1 month from now formatted as YYYY-MM-DD
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  const defaultJoiningDate = nextMonth.toISOString().split("T")[0];

  const defaultSalary = application?.job?.salary || 650000;

  const [salary, setSalary] = useState(defaultSalary);
  const [joiningDate, setJoiningDate] = useState(defaultJoiningDate);

  if (!isOpen || !application) return null;

  const formatLpa = (val) => {
    if (!val) return "₹0.0 LPA";
    return `₹${(val / 100000).toFixed(2)} LPA`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numSalary = parseFloat(salary);
    if (!numSalary || numSalary <= 0) {
      toastError("Please enter a valid salary greater than 0.");
      return;
    }
    if (!joiningDate) {
      toastError("Please select an anticipated joining date.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        applicationId: application.id,
        offeredSalary: numSalary,
        joiningDate: joiningDate,
      };
      const createdOffer = await api.createOffer(payload);
      success(
        `Formal offer of ${formatLpa(numSalary)} generated for ${
          application.student?.name || "Student"
        }!`
      );
      if (onSuccess) onSuccess(createdOffer);
      onClose();
    } catch (err) {
      toastError(err.message || "Failed to generate offer.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <h3>💼 Roll Out Placement Offer</h3>
            <p className="modal-subtitle">
              Issue formal employment offer to <strong>{application.student?.name}</strong>
            </p>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="offer-candidate-summary">
              <div className="summary-item">
                <span className="summary-label">Candidate</span>
                <strong>{application.student?.name} ({application.student?.branch})</strong>
              </div>
              <div className="summary-item">
                <span className="summary-label">Company</span>
                <strong>{application.job?.company?.companyName || "Employer"}</strong>
              </div>
              <div className="summary-item">
                <span className="summary-label">Job Role</span>
                <strong>{application.job?.jobTitle}</strong>
              </div>
            </div>

            <div className="form-group">
              <label>Annual CTC / Salary Offered (₹ INR) *</label>
              <div className="input-with-preview">
                <input
                  type="number"
                  min="50000"
                  step="10000"
                  className="form-control"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  required
                />
                <span className="input-preview-badge">{formatLpa(parseFloat(salary) || 0)}</span>
              </div>
            </div>

            <div className="form-group">
              <label>Official Joining Date *</label>
              <input
                type="date"
                className="form-control"
                min={new Date().toISOString().split("T")[0]}
                value={joiningDate}
                onChange={(e) => setJoiningDate(e.target.value)}
                required
              />
            </div>

            <div className="form-notice success-notice">
              <span>🎉</span>
              <p>
                Generating this offer will make it immediately visible to the student to
                review, accept, or decline.
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
              className="btn btn-success"
              disabled={submitting}
            >
              {submitting ? "Issuing Offer..." : "Issue Formal Offer Letter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default OfferGenerateModal;
