import React, { useState, useEffect } from "react";
import api from "../services/api";

export function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getDashboardMetrics();
      setMetrics(data);
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
      setError("Unable to load live placement analytics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  if (loading && !metrics) {
    return (
      <div className="analytics-loading">
        <div className="spinner"></div>
        <p>Calculating live placement metrics...</p>
      </div>
    );
  }

  if (error && !metrics) {
    return (
      <div className="analytics-error">
        <p>{error}</p>
        <button className="btn btn-secondary btn-sm" onClick={fetchMetrics}>
          Retry
        </button>
      </div>
    );
  }

  const formatLpa = (val) => {
    if (val === undefined || val === null || val === 0) return "₹0.00 LPA";
    return `₹${val.toFixed(2)} LPA`;
  };

  const departmentEntries = Object.entries(metrics.departmentStats || {});
  const statusEntries = Object.entries(metrics.statusStats || {});
  const maxDeptCount = Math.max(...departmentEntries.map(([, count]) => count), 1);
  const maxStatusCount = Math.max(...statusEntries.map(([, count]) => count), 1);

  return (
    <div className="analytics-dashboard">
      <div className="analytics-header">
        <div>
          <h2>Placement Intelligence & Insights</h2>
          <p>Real-time campus placement KPIs, department distributions, and offer metrics</p>
        </div>
        <button className="btn btn-secondary btn-sm refresh-btn" onClick={fetchMetrics}>
          ↻ Refresh Data
        </button>
      </div>

      {/* Primary Hero Stats */}
      <div className="metrics-hero-grid">
        <div className="hero-metric-card primary-gradient">
          <div className="metric-icon">📈</div>
          <div className="metric-content">
            <span className="metric-label">Placement Success Rate</span>
            <div className="metric-value-row">
              <span className="metric-value">
                {metrics.placementRate ? metrics.placementRate.toFixed(1) : "0.0"}%
              </span>
              <span className="metric-badge success">
                {metrics.totalPlacedStudents} of {metrics.totalStudents} Placed
              </span>
            </div>
          </div>
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill success"
              style={{ width: `${Math.min(metrics.placementRate || 0, 100)}%` }}
            />
          </div>
        </div>

        <div className="hero-metric-card secondary-gradient">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <span className="metric-label">Average Annual Package</span>
            <div className="metric-value-row">
              <span className="metric-value">{formatLpa(metrics.averagePackage)}</span>
            </div>
          </div>
          <span className="metric-subtext">Calculated across all generated offers</span>
        </div>

        <div className="hero-metric-card accent-gradient">
          <div className="metric-icon">🏆</div>
          <div className="metric-content">
            <span className="metric-label">Highest Package Offered</span>
            <div className="metric-value-row">
              <span className="metric-value">{formatLpa(metrics.highestPackage)}</span>
            </div>
          </div>
          <span className="metric-subtext">Peak CTC in current campus drive</span>
        </div>

        <div className="hero-metric-card purple-gradient">
          <div className="metric-icon">📑</div>
          <div className="metric-content">
            <span className="metric-label">Total Offers Generated</span>
            <div className="metric-value-row">
              <span className="metric-value">{metrics.totalOffers}</span>
              <span className="metric-badge purple">Offers</span>
            </div>
          </div>
          <span className="metric-subtext">Formal letters issued by recruiters</span>
        </div>
      </div>

      {/* Secondary Counters */}
      <div className="secondary-counters-row">
        <div className="counter-item">
          <span className="counter-icon">🎓</span>
          <div>
            <strong className="counter-number">{metrics.totalStudents}</strong>
            <span className="counter-label">Registered Students</span>
          </div>
        </div>

        <div className="counter-item">
          <span className="counter-icon">🏢</span>
          <div>
            <strong className="counter-number">{metrics.totalCompanies}</strong>
            <span className="counter-label">Partner Companies</span>
          </div>
        </div>

        <div className="counter-item">
          <span className="counter-icon">💼</span>
          <div>
            <strong className="counter-number">{metrics.totalJobs}</strong>
            <span className="counter-label">Active Job Openings</span>
          </div>
        </div>

        <div className="counter-item">
          <span className="counter-icon">📋</span>
          <div>
            <strong className="counter-number">{metrics.totalApplications}</strong>
            <span className="counter-label">Total Applications</span>
          </div>
        </div>

        <div className="counter-item">
          <span className="counter-icon">★</span>
          <div>
            <strong className="counter-number">{metrics.totalShortlisted}</strong>
            <span className="counter-label">Shortlisted</span>
          </div>
        </div>

        <div className="counter-item">
          <span className="counter-icon">✓</span>
          <div>
            <strong className="counter-number">{metrics.totalSelected}</strong>
            <span className="counter-label">Interview Cleared</span>
          </div>
        </div>
      </div>

      {/* Analytics Visualizer Grid */}
      <div className="visualizer-grid">
        {/* Department Placement Breakdown */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Department-Wise Placement Distribution</h3>
            <span className="chart-sub">Students placed per engineering major</span>
          </div>
          <div className="bars-list">
            {departmentEntries.length === 0 ? (
              <p className="no-data-msg">No department placement data yet.</p>
            ) : (
              departmentEntries.map(([dept, count]) => {
                const percentage = Math.round((count / maxDeptCount) * 100);
                return (
                  <div key={dept} className="bar-row">
                    <div className="bar-label">
                      <strong>{dept}</strong>
                      <span>{count} {count === 1 ? "student" : "students"}</span>
                    </div>
                    <div className="bar-track">
                      <div
                        className="bar-fill dept-fill"
                        style={{ width: `${Math.max(percentage, 8)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Application Stage Funnel */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Recruitment Pipeline Stages</h3>
            <span className="chart-sub">Volume of applicants at each phase</span>
          </div>
          <div className="bars-list">
            {statusEntries.length === 0 ? (
              <p className="no-data-msg">No application data yet.</p>
            ) : (
              statusEntries.map(([status, count]) => {
                const percentage = Math.round((count / maxStatusCount) * 100);
                return (
                  <div key={status} className="bar-row">
                    <div className="bar-label">
                      <strong>{status}</strong>
                      <span>{count} applications</span>
                    </div>
                    <div className="bar-track">
                      <div
                        className={`bar-fill status-fill status-${status.toLowerCase()}`}
                        style={{ width: `${Math.max(percentage, 8)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsDashboard;
