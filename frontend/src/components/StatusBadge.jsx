import React from "react";

export function StatusBadge({ status }) {
  if (!status) return null;

  const normalized = status.toUpperCase();

  const getBadgeClass = () => {
    switch (normalized) {
      case "ELIGIBLE":
        return "badge-eligible";
      case "NOT_ELIGIBLE":
        return "badge-not-eligible";
      case "SHORTLISTED":
        return "badge-shortlisted";
      case "INTERVIEW":
      case "TEST_SCHEDULED":
      case "SCHEDULED":
        return "badge-interview";
      case "SELECTED":
        return "badge-selected";
      case "PASSED":
        return "badge-selected";
      case "FAILED":
      case "REJECTED":
        return "badge-rejected";
      case "GENERATED":
        return "badge-generated";
      case "ACCEPTED":
        return "badge-accepted";
      case "APPLIED":
      default:
        return "badge-applied";
    }
  };

  const getIcon = () => {
    switch (normalized) {
      case "ELIGIBLE":
        return "✓";
      case "NOT_ELIGIBLE":
        return "✕";
      case "SHORTLISTED":
        return "★";
      case "INTERVIEW":
      case "SCHEDULED":
        return "📅";
      case "SELECTED":
      case "PASSED":
        return "🏆";
      case "REJECTED":
      case "FAILED":
        return "✕";
      case "GENERATED":
        return "✉";
      case "ACCEPTED":
        return "🤝";
      default:
        return "•";
    }
  };

  return (
    <span className={`badge ${getBadgeClass()}`}>
      <span>{getIcon()}</span>
      <span>{normalized}</span>
    </span>
  );
}

export default StatusBadge;
