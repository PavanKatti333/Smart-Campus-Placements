import React, { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export function StudentProfileModal({ isOpen, onClose }) {
  const { user, updateUserProfile } = useAuth();
  const { success, error: toastError } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    branch: user?.branch || "CSE",
    cgpa: user?.cgpa ?? 8.0,
    backlogs: user?.backlogs ?? 0,
    graduationYear: user?.graduationYear ?? 2027,
    resumeUrl: user?.resumeUrl || "",
  });

  if (!isOpen || !user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        branch: formData.branch,
        cgpa: parseFloat(formData.cgpa),
        backlogs: parseInt(formData.backlogs, 10),
        graduationYear: parseInt(formData.graduationYear, 10),
        resumeUrl: formData.resumeUrl.trim(),
      };

      const updated = await api.updateStudent(user.id, payload);
      updateUserProfile(updated);
      success("Profile details updated successfully!");
      onClose();
    } catch (err) {
      toastError(err.message || "Failed to update profile.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <h3>🎓 Student Placement Profile</h3>
            <p className="modal-subtitle">Keep your academic standing and resume current</p>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-row-2">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  value={formData.email}
                  disabled
                  title="Email cannot be changed"
                />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  className="form-control"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Engineering Major / Branch</label>
                <select
                  className="form-control"
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                >
                  <option value="CSE">CSE</option>
                  <option value="IT">IT</option>
                  <option value="ECE">ECE</option>
                  <option value="EEE">EEE</option>
                  <option value="MECH">MECH</option>
                  <option value="CIVIL">CIVIL</option>
                  <option value="AI/DS">AI/DS</option>
                </select>
              </div>
            </div>

            <div className="form-row-3">
              <div className="form-group">
                <label>Cumulative CGPA (0-10)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  className="form-control"
                  value={formData.cgpa}
                  onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Active Backlogs</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  className="form-control"
                  value={formData.backlogs}
                  onChange={(e) => setFormData({ ...formData, backlogs: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Graduation Batch</label>
                <input
                  type="number"
                  min="2024"
                  max="2030"
                  className="form-control"
                  value={formData.graduationYear}
                  onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Resume Document Link / Portfolio</label>
              <input
                type="url"
                className="form-control"
                placeholder="https://drive.google.com/..."
                value={formData.resumeUrl}
                onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
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
              {submitting ? "Saving..." : "Save Profile Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StudentProfileModal;
