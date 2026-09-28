import React, { useState, useEffect, useCallback } from "react";
import { ToastProvider, useToast } from "./context/ToastContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ToastContainer from "./components/Toast";
import Navbar from "./components/Navbar";
import AuthModal from "./components/AuthModal";
import StudentProfileModal from "./components/StudentProfileModal";
import StudentDashboardPage from "./pages/StudentDashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import RecruiterDashboardPage from "./pages/RecruiterDashboardPage";
import { usePlacementData } from "./hooks/usePlacementData";
import "./App.css";

function AppMain() {
  const { user, isAuthenticated, role } = useAuth();
  const { error: toastError } = useToast();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Active view mode for Admin/Recruiter to switch between console and student portal preview
  const [activeView, setActiveView] = useState(null);

  // Extracted custom hook for platform data management
  const {
    loadingData,
    jobs,
    companies,
    applications,
    interviews,
    offers,
    students,
    refreshData: loadPlatformData,
  } = usePlacementData(isAuthenticated, role, user, toastError);

  // Sync view mode when role changes
  useEffect(() => {
    if (role) {
      setActiveView(role);
    } else {
      setActiveView(null);
    }
  }, [role]);

  return (
    <div className="app-container">
      <Navbar
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        currentView={activeView}
        onViewChange={(v) => setActiveView(v)}
      />

      <main className="app-main-content">
        {!isAuthenticated ? (
          /* Landing Hero for Visitors / Unauthenticated users */
          <div className="landing-hero-container">
            <div className="landing-hero-card">
              <div className="hero-badge">
                <span>✦</span>
                <span>Next-Generation Automated Campus Recruitment</span>
              </div>
              <h1 className="hero-headline">
                Empowering Students. <br />
                Connecting <span className="headline-gradient">Premier Employers.</span>
              </h1>
              <p className="hero-description">
                Smart Campus Placement standardizes the entire campus hiring lifecycle — from
                eligibility verification, applicant shortlisting, and automated interview scheduling
                to formal offer rollout and placement intelligence.
              </p>

              <div className="hero-action-row">
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => setIsAuthModalOpen(true)}
                >
                  🚀 Access Portal Now
                </button>
              </div>

              <div className="hero-features-strip">
                <div className="feature-item">
                  <span className="feature-icon">⚡</span>
                  <div>
                    <strong>Instant Eligibility</strong>
                    <p>Automated rules verify CGPA, branch, and backlog limits</p>
                  </div>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">📅</span>
                  <div>
                    <strong>Coordinated Interviews</strong>
                    <p>Virtual & offline rounds scheduled with instant student alerts</p>
                  </div>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">📈</span>
                  <div>
                    <strong>Executive Intelligence</strong>
                    <p>Live department placement rates and salary analytics</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : loadingData && jobs.length === 0 && applications.length === 0 ? (
          <div className="loading-state-wrapper">
            <div className="spinner-large"></div>
            <p>Syncing your placement records...</p>
          </div>
        ) : (
          /* Authenticated Portals */
          <>
            {(activeView === "STUDENT" || activeView === "STUDENT_PREVIEW") && (
              <StudentDashboardPage
                student={
                  user?.role === "STUDENT"
                    ? user
                    : students[0] || {
                        id: 1,
                        name: "Demo Student",
                        branch: "CSE",
                        cgpa: 8.5,
                        backlogs: 0,
                        graduationYear: 2027,
                        email: "student@smartcampus.edu",
                      }
                }
                jobs={jobs}
                applications={applications}
                interviews={interviews}
                offers={offers}
                onRefreshData={loadPlatformData}
                onOpenProfile={() => setIsProfileModalOpen(true)}
              />
            )}

            {activeView === "ADMIN" && (
              <AdminDashboardPage
                jobs={jobs}
                companies={companies}
                applications={applications}
                interviews={interviews}
                offers={offers}
                students={students}
                onRefreshData={loadPlatformData}
              />
            )}

            {activeView === "RECRUITER" && (
              <RecruiterDashboardPage
                jobs={jobs}
                applications={applications}
                interviews={interviews}
                offers={offers}
                onRefreshData={loadPlatformData}
              />
            )}
          </>
        )}
      </main>

      {/* Global Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <StudentProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppMain />
      </AuthProvider>
    </ToastProvider>
  );
}