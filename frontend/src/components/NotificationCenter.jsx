import React, { useState, useEffect, useRef } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export function NotificationCenter() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    if (!user || user.role !== "STUDENT" || !user.id) return;
    try {
      setLoading(true);
      const data = await api.getNotifications(user.id);
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll every 30 seconds for live updates
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user?.id, user?.role]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkRead = async (id, e) => {
    e.stopPropagation();
    try {
      await api.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark read:", err);
    }
  };

  const handleMarkAllRead = async () => {
    const unread = notifications.filter((n) => !n.isRead);
    for (const n of unread) {
      try {
        await api.markNotificationRead(n.id);
      } catch (e) {
        // ignore
      }
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const formatTimestamp = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  if (!user || user.role !== "STUDENT") {
    return null;
  }

  return (
    <div className="notification-center" ref={dropdownRef}>
      <button
        className="notification-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
        title="View Notifications"
      >
        <span className="bell-icon">🔔</span>
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h4>Notifications</h4>
            {unreadCount > 0 && (
              <button className="mark-all-btn" onClick={handleMarkAllRead}>
                Mark all as read
              </button>
            )}
          </div>

          <div className="notification-list">
            {loading && notifications.length === 0 ? (
              <div className="notification-empty">Loading notifications...</div>
            ) : notifications.length === 0 ? (
              <div className="notification-empty">
                <span className="empty-icon">🔕</span>
                <p>No notifications yet</p>
                <small>Updates regarding tests, interviews, and offers will appear here.</small>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  className={`notification-item ${item.isRead ? "read" : "unread"}`}
                  onClick={(e) => !item.isRead && handleMarkRead(item.id, e)}
                >
                  <div className="notification-item-icon">
                    {item.type === "OFFER"
                      ? "💼"
                      : item.type === "INTERVIEW"
                      ? "📅"
                      : item.type === "APPLICATION"
                      ? "📋"
                      : "📢"}
                  </div>
                  <div className="notification-item-body">
                    <div className="notification-item-title">{item.title}</div>
                    <div className="notification-item-text">{item.message}</div>
                    <div className="notification-item-time">{formatTimestamp(item.createdAt)}</div>
                  </div>
                  {!item.isRead && (
                    <button
                      className="notification-item-read-dot"
                      title="Mark as read"
                      onClick={(e) => handleMarkRead(item.id, e)}
                    />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationCenter;
