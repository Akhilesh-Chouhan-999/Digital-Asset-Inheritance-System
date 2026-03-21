import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  assetService,
  nomineeService,
  inactivityService,
  adminService,
} from "../services/api";
import { StatCard, Alert, Loading, EmptyState } from "../components/Common";
import { Lock, Users, Clock, Activity, TrendingUp, Zap } from "lucide-react";
import "./Dashboard.css";

export const DashboardPage = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [inactivityStatus, setInactivityStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [recentAssets, setRecentAssets] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setError("");
      const [assetRes, nomineeRes, inactivityRes] = await Promise.all([
        assetService.getAssets({ limit: 5 }),
        nomineeService.getNominees(),
        inactivityService.getStatus(),
      ]);

      setRecentAssets(assetRes.data.data || []);
      setInactivityStatus(inactivityRes.data.data);

      // Calculate stats
      setStats({
        assets: assetRes.data.data?.length || 0,
        nominees: nomineeRes.data.data?.length || 0,
        verified:
          nomineeRes.data.data?.filter((n) => n.status === "verified").length ||
          0,
        active: !inactivityRes.data.data?.hasInactivity,
      });
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {user?.firstName || user?.name}!</h1>
          <p>Manage your digital assets and nominees</p>
        </div>
        <div className="dashboard-date">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError("")} />
      )}

      {inactivityStatus?.hasInactivity && (
        <Alert
          type="warning"
          title="⚠️ Inactivity Detected"
          message={`Your account has been inactive for ${inactivityStatus.daysSinceActive} days. Please verify your account.`}
          actions={[
            {
              label: "Mark Active",
              onClick: () => handleMarkActive(),
              style: "btn-warning",
            },
          ]}
          onClose={() =>
            setInactivityStatus({ ...inactivityStatus, hasInactivity: false })
          }
        />
      )}

      {/* Stats Grid */}
      {stats && (
        <div className="stats-grid">
          <StatCard
            icon={Lock}
            label="Digital Assets"
            value={stats.assets}
            color="primary"
          />
          <StatCard
            icon={Users}
            label="Nominees"
            value={stats.nominees}
            color="secondary"
          />
          <StatCard
            icon={Activity}
            label="Verified Nominees"
            value={stats.verified}
            color="success"
          />
          <StatCard
            icon={Zap}
            label="Account Status"
            value={stats.active ? "Active" : "Inactive"}
            color={stats.active ? "success" : "danger"}
          />
        </div>
      )}

      {/* Recent Assets */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2>Recent Assets</h2>
          <a href="/assets" className="see-all">
            View All →
          </a>
        </div>

        {recentAssets.length > 0 ? (
          <div className="assets-list">
            {recentAssets.map((asset) => (
              <div key={asset._id} className="asset-item">
                <div className="asset-icon">
                  <Lock size={20} />
                </div>
                <div className="asset-info">
                  <div className="asset-title">{asset.title}</div>
                  <div className="asset-type">{asset.type}</div>
                </div>
                <div className="asset-meta">
                  <span className={`badge badge-${asset.visibility}`}>
                    {asset.visibility}
                  </span>
                  <span className="asset-date">
                    {new Date(asset.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Lock}
            title="No Assets Yet"
            description="Create your first digital asset to get started"
            action={{
              label: "Create Asset",
              onClick: () => (window.location.href = "/assets"),
            }}
          />
        )}
      </div>

      {/* Quick Actions */}
      <div className="dashboard-section">
        <h2>Quick Actions</h2>
        <div className="quick-actions">
          <a href="/assets" className="action-btn">
            <Lock size={24} />
            <span>Manage Assets</span>
          </a>
          <a href="/nominees" className="action-btn">
            <Users size={24} />
            <span>Manage Nominees</span>
          </a>
          <a href="/inactivity" className="action-btn">
            <Clock size={24} />
            <span>Activity Status</span>
          </a>
          {isAdmin && (
            <a href="/admin" className="action-btn">
              <TrendingUp size={24} />
              <span>Admin Panel</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );

  async function handleMarkActive() {
    try {
      await inactivityService.markActive();
      await loadDashboardData();
    } catch (err) {
      setError("Failed to update activity status");
    }
  }
};

export default DashboardPage;
