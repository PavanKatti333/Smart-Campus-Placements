import React from "react";
import { useAuth } from "../context/AuthContext";
import NotificationCenter from "./NotificationCenter";

export function Navbar({ onOpenAuth, onOpenProfile, currentView, onViewChange }) {
  const { user, isAuthenticated, logout } = useAuth();

  const getRoleBadge = (role) => {
    switch (role) {
      case "ADMIN":
        return <span className="role-tag role-admin">★ Placement Officer</span>;
      case "RECRUITER":
        return <span className="role-tag role-recruiter">💼 Recruiter</span>;
      case "STUDENT":
      default:
        return <span className="role-tag role-student">🎓 Student</span>;
    }
  };

  return (
    <header className="main-navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="brand-icon">
            <span role="img" aria-label="Campus">🎓</span>
          </div>
          <div className="brand-details">
            <h1 className="brand-title">Smart Campus Placement</h1>
            <span className="brand-subtitle">Automated Recruitment Platform</span>
          </div>
        </div>

        {/* View Switcher for Admin/Recruiter to inspect Student View */}
        {isAuthenticated && (user.role === "ADMIN" || user.role === "RECRUITER") && (
          <div className="navbar-view-switcher">
            <button
              className={`view-switch-btn ${currentView === "ADMIN" || currentView === "RECRUITER" ? "active" : ""}`}
              onClick={() => onViewChange(user.role)}
            >
              {user.role === "ADMIN" ? "Admin Console" : "Recruiter Console"}
            </button>
            <button
              className={`view-switch-btn ${currentView === "STUDENT_PREVIEW" ? "active" : ""}`}
              onClick={() => onViewChange("STUDENT_PREVIEW")}
            >
              Student Portal Preview
            </button>
          </div>
        )}

        <div className="navbar-actions">
          {isAuthenticated ? (
            <>
              {user.role === "STUDENT" && <NotificationCenter />}

              <div
                className="user-profile-pill"
                onClick={user.role === "STUDENT" ? onOpenProfile : undefined}
                title={user.role === "STUDENT" ? "Click to view/edit profile" : user.name}
              >
                <div className="user-avatar">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="user-meta">
                  <span className="user-name">{user.name || "User"}</span>
                  {getRoleBadge(user.role)}
                </div>
                {user.role === "STUDENT" && <span className="edit-pill-hint">✎</span>}
              </div>

              <button className="btn-logout" onClick={logout} title="Sign out of account">
                <span className="logout-icon">⏻</span>
                <span className="logout-text">Logout</span>
              </button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={onOpenAuth}>
              <span>Sign In / Register</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
