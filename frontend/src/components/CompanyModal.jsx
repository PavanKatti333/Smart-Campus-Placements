import React, { useState } from "react";
import api from "../services/api";
import { useToast } from "../context/ToastContext";

export function CompanyModal({ isOpen, onClose, onSuccess }) {
  const { success, error: toastError } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    description: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.companyName || !formData.email || !formData.phone || !formData.location) {
      toastError("Please fill out all required fields.");
      return;
    }

    try {
      setSubmitting(true);
      const created = await api.createCompany(formData);
      success(`Partner company "${created.companyName}" added successfully!`);
      if (onSuccess) onSuccess(created);
      onClose();
    } catch (err) {
      toastError(err.message || "Failed to add partner company.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <h3>🏢 Register Partner Employer</h3>
            <p className="modal-subtitle">Add a corporate recruiter or hiring partner</p>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-row-2">
              <div className="form-group">
                <label>Company Name *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Microsoft / Google"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Official Email *</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="campus@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>Contact Phone *</label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="e.g. 080-28440011"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Headquarters / Location *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Hyderabad, Telangana"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Official Website</label>
              <input
                type="url"
                className="form-control"
                placeholder="https://www.company.com"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Company Overview</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Brief description of the organization and its hiring initiatives..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
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
              {submitting ? "Saving..." : "Add Partner Company"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CompanyModal;
