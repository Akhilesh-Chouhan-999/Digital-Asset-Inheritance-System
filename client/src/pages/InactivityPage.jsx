import React, { useState, useEffect } from "react";
import { inactivityService } from "../services/api";
import { Alert, Loading, StatCard } from "../components/Common";
import { Activity, Clock, AlertCircle, CheckCircle } from "lucide-react";
import "./Inactivity.css";

export const InactivityPage = () => {
  const [status, setStatus] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      setError("");
      const [statusRes, historyRes] = await Promise.all([
        inactivityService.getStatus(),
        inactivityService.getHistory(),
      ]);
      setStatus(statusRes.data.data);
      setHistory(historyRes.data.data || []);
    } catch (err) {
      setError("Failed to load inactivity data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkActive = async () => {
    try {
      setError("");
      await inactivityService.markActive();
      setSuccess("Your account has been marked as active!");
      await loadData();
    } catch (err) {
      setError("Failed to update activity status");
    }
  };

  if (loading) return <Loading />;

  const daysInactive = status?.daysSinceActive || 0;
  const warningThreshold = 60;
  const triggerThreshold = 90;
  const progressPercent = (daysInactive / triggerThreshold) * 100;

  const getStatusColor = () => {
    if (daysInactive >= triggerThreshold) return "critical";
    if (daysInactive >= warningThreshold) return "warning";
    return "safe";
  };

  const getStatusMessage = () => {
    if (daysInactive >= triggerThreshold) {
      return "Your account has been inactive and inheritance has been triggered";
    }
    if (daysInactive >= warningThreshold) {
      return `Your account has been inactive for ${daysInactive} days. You will receive periodic reminders.`;
    }
    return `Your account is active. Last activity was ${daysInactive} day${daysInactive !== 1 ? "s" : ""} ago.`;
  };

  return (
    <div className="inactivity-container">
      <div className="inactivity-header">
        <h1>Account Activity Status</h1>
        <p>Monitor your account inactivity and inheritance triggers</p>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError("")} />
      )}
      {success && (
        <Alert
          type="success"
          message={success}
          onClose={() => setSuccess("")}
        />
      )}

      {/* Status Alert */}
      {status?.hasInactivity && (
        <Alert
          type={getStatusColor() === "critical" ? "error" : "warning"}
          title={getStatusColor() === "critical" ? "🚨 Critical" : "⚠️ Warning"}
          message={getStatusMessage()}
          actions={[
            {
              label: "Mark as Active",
              onClick: handleMarkActive,
              style: "btn-primary",
            },
          ]}
        />
      )}

      {/* Inactivity Progress */}
      {status && (
        <div className="inactivity-progress-card">
          <div className="progress-header">
            <h2>Inactivity Timeline</h2>
            <div className="progress-days">
              Days Inactive: <strong>{daysInactive}</strong>
            </div>
          </div>

          <div className={`progress-bar progress-${getStatusColor()}`}>
            <div
              className="progress-fill"
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
            >
              <span className="progress-label">{daysInactive}d</span>
            </div>
          </div>

          <div className="progress-markers">
            <div className="marker safe">
              <span className="marker-label">Safe</span>
              <span className="marker-days">0-60d</span>
            </div>
            <div className="marker warning">
              <span className="marker-label">Warning</span>
              <span className="marker-days">60-90d</span>
            </div>
            <div className="marker critical">
              <span className="marker-label">Triggered</span>
              <span className="marker-days">90d+</span>
            </div>
          </div>

          <button
            className="btn btn-primary mt-2 w-full"
            onClick={handleMarkActive}
          >
            <Activity size={20} />
            Mark Account as Active
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="stats-grid">
        <StatCard
          icon={Clock}
          label="Days Inactive"
          value={daysInactive}
          color="warning"
        />
        <StatCard
          icon={AlertCircle}
          label="Status"
          value={status?.hasInactivity ? "Inactive" : "Active"}
          color={status?.hasInactivity ? "danger" : "success"}
        />
        <StatCard
          icon={CheckCircle}
          label="Inactivity Cases"
          value={history.length}
          color="info"
        />
      </div>

      {/* Information Box */}
      <div className="info-section">
        <h2>How it Works</h2>
        <div className="info-grid">
          <div className="info-card">
            <div className="info-icon safe">60</div>
            <h3>Day 60: Warning</h3>
            <p>
              Your account is marked as inactive and you'll receive a warning
              email.
            </p>
          </div>
          <div className="info-card">
            <div className="info-icon warning">90</div>
            <h3>Day 90: Triggered</h3>
            <p>
              Your nominees are notified and can access inherited assets based
              on your settings.
            </p>
          </div>
          <div className="info-card">
            <div className="info-icon critical">?</div>
            <h3>Regular Updates</h3>
            <p>
              Log in regularly to prevent inactivity warnings and keep your
              nominees informed.
            </p>
          </div>
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="history-section">
          <h2>Inactivity History</h2>
          <div className="history-list">
            {history.map((item, idx) => (
              <div key={idx} className="history-item">
                <div className="history-icon">
                  {item.status === "triggered" ? (
                    <AlertCircle size={20} />
                  ) : (
                    <Clock size={20} />
                  )}
                </div>
                <div className="history-content">
                  <div className="history-title">
                    {item.status.toUpperCase()}
                  </div>
                  <div className="history-date">
                    {new Date(item.startDate).toLocaleDateString()}
                  </div>
                </div>
                <div className={`history-badge ${item.status}`}>
                  {item.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InactivityPage;
