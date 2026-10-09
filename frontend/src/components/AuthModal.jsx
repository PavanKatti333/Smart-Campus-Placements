import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export function AuthModal({ isOpen, onClose }) {
  const { login, register, loading } = useAuth();
  const { success, error: toastError } = useToast();

  const [activeTab, setActiveTab] = useState("LOGIN"); // "LOGIN" or "REGISTER"

  // Login Form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register Form
  const [regData, setRegData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    branch: "CSE",
    cgpa: 8.0,
    backlogs: 0,
    graduationYear: 2027,
    resumeUrl: "",
    role: "STUDENT",
  });

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const loggedUser = await login(loginEmail, loginPassword);
      success(`Welcome back, ${loggedUser.name}!`);
      onClose();
    } catch (err) {
      toastError(err.message || "Failed to log in. Please check your credentials.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...regData,
        cgpa: parseFloat(regData.cgpa),
        backlogs: parseInt(regData.backlogs, 10),
        graduationYear: parseInt(regData.graduationYear, 10),
      };
      await register(payload);
      success("Registration complete! Welcome to Smart Campus Placement.");
      onClose();
    } catch (err) {
      toastError(err.message || "Registration failed. Please check form fields.");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content auth-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="auth-header-title">
            <span className="auth-icon">🔐</span>
            <div>
              <h3>Smart Campus Portal</h3>
              <p className="auth-subtitle">Access your campus recruitment account</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Tab switch */}
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${activeTab === "LOGIN" ? "active" : ""}`}
            onClick={() => setActiveTab("LOGIN")}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab ${activeTab === "REGISTER" ? "active" : ""}`}
            onClick={() => setActiveTab("REGISTER")}
          >
            New Student Register
          </button>
        </div>

        <div className="modal-body auth-body">
          {activeTab === "LOGIN" ? (
            <form onSubmit={handleLogin} className="auth-form">
              <div className="auth-role-info">
                <span>Sign in for <strong>Students</strong>, <strong>College Management (Admin)</strong>, or <strong>Recruiters</strong>. Your portal opens automatically based on your account role.</span>
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email address"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter your account password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In to Dashboard"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="auth-form register-form">
              <div className="form-row-2">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Rahul Sharma"
                    value={regData.name}
                    onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="student@example.com"
                    value={regData.email}
                    onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Create a strong password"
                    value={regData.password}
                    onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="10-digit mobile number"
                    value={regData.phone}
                    onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-row-3">
                <div className="form-group">
                  <label>Branch / Major</label>
                  <select
                    className="form-control"
                    value={regData.branch}
                    onChange={(e) => setRegData({ ...regData, branch: e.target.value })}
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

                <div className="form-group">
                  <label>CGPA (0-10)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    className="form-control"
                    value={regData.cgpa}
                    onChange={(e) => setRegData({ ...regData, cgpa: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Active Backlogs</label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    value={regData.backlogs}
                    onChange={(e) => setRegData({ ...regData, backlogs: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Graduation Year</label>
                  <input
                    type="number"
                    min="2024"
                    max="2030"
                    className="form-control"
                    value={regData.graduationYear}
                    onChange={(e) => setRegData({ ...regData, graduationYear: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Resume Link / URL</label>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://drive.google.com/..."
                    value={regData.resumeUrl}
                    onChange={(e) => setRegData({ ...regData, resumeUrl: e.target.value })}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Student Account"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
