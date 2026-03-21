import React, { useState, useEffect } from "react";
import { adminService } from "../services/api";
import { Alert, Loading, StatCard } from "../components/Common";
import { Users, Lock, BarChart3, Activity, TrendingUp } from "lucide-react";
import "./Admin.css";

export const AdminPage = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("stats");
  const [auditFilter, setAuditFilter] = useState("all");

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      setError("");
      const [statsRes, usersRes, logsRes] = await Promise.all([
        adminService.getStats(),
        adminService.getUserManagement({ limit: 20 }),
        adminService.getAuditLogs({ limit: 50 }),
      ]);

      setStats(statsRes.data.data);
      setUsers(usersRes.data.data || []);
      setAuditLogs(logsRes.data.data || []);
    } catch (err) {
      setError("Failed to load admin data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  const filteredLogs =
    auditFilter === "all"
      ? auditLogs
      : auditLogs.filter((log) => log.severity === auditFilter);

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>System statistics and management</p>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError("")} />
      )}

      {/* Tab Navigation */}
      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === "stats" ? "active" : ""}`}
          onClick={() => setActiveTab("stats")}
        >
          <BarChart3 size={20} />
          Statistics
        </button>
        <button
          className={`tab-btn ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          <Users size={20} />
          Users ({users.length})
        </button>
        <button
          className={`tab-btn ${activeTab === "logs" ? "active" : ""}`}
          onClick={() => setActiveTab("logs")}
        >
          <Activity size={20} />
          Audit Logs ({auditLogs.length})
        </button>
      </div>

      {/* Statistics Tab */}
      {activeTab === "stats" && stats && (
        <div className="stats-section">
          <div className="stats-grid-4">
            <StatCard
              icon={Users}
              label="Total Users"
              value={stats.totalUsers}
              color="primary"
            />
            <StatCard
              icon={Lock}
              label="Total Assets"
              value={stats.totalAssets}
              color="secondary"
            />
            <StatCard
              icon={TrendingUp}
              label="Inactivity Cases"
              value={stats.inactiveCases}
              color="warning"
            />
            <StatCard
              icon={Activity}
              label="Active Users"
              value={stats.activeUsers}
              color="success"
            />
          </div>

          <div className="info-cards">
            <div className="info-card">
              <h3>System Health</h3>
              <div className="health-check">
                <div className="health-item">
                  <span className="health-status online">●</span>
                  <span>Database: Connected</span>
                </div>
                <div className="health-item">
                  <span className="health-status online">●</span>
                  <span>Email Service: Active</span>
                </div>
                <div className="health-item">
                  <span className="health-status online">●</span>
                  <span>Scheduler: Running</span>
                </div>
              </div>
            </div>

            <div className="info-card">
              <h3>Database Stats</h3>
              <div className="stat-list">
                <div className="stat-row">
                  <span>Average Assets per User:</span>
                  <strong>
                    {(stats.totalAssets / stats.totalUsers || 0).toFixed(2)}
                  </strong>
                </div>
                <div className="stat-row">
                  <span>Inactivity Rate:</span>
                  <strong>
                    {(
                      (stats.inactiveCases / stats.totalUsers) * 100 || 0
                    ).toFixed(1)}
                    %
                  </strong>
                </div>
                <div className="stat-row">
                  <span>Active Users:</span>
                  <strong>
                    {(
                      (stats.activeUsers / stats.totalUsers) * 100 || 0
                    ).toFixed(1)}
                    %
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <div className="users-section">
          <div className="section-header">
            <h2>User Management</h2>
            <span className="user-count">{users.length} users</span>
          </div>

          {users.length > 0 ? (
            <div className="table-responsive">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Assets</th>
                    <th>Nominees</th>
                    <th>Status</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td className="user-cell">
                        <div className="user-avatar">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span>{user.name}</span>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <span className="badge badge-info">
                          {user.assetCount || 0}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-success">
                          {user.nomineeCount || 0}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`status-badge ${
                            user.isActive ? "active" : "inactive"
                          }`}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="text-small text-muted">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted">No users found</p>
          )}
        </div>
      )}

      {/* Audit Logs Tab */}
      {activeTab === "logs" && (
        <div className="logs-section">
          <div className="section-header">
            <h2>Audit Logs</h2>
            <select
              className="filter-select"
              value={auditFilter}
              onChange={(e) => setAuditFilter(e.target.value)}
            >
              <option value="all">All Events</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          {filteredLogs.length > 0 ? (
            <div className="logs-list">
              {filteredLogs.map((log, idx) => (
                <div key={idx} className={`log-item severity-${log.severity}`}>
                  <div className="log-header">
                    <span className={`severity-badge ${log.severity}`}>
                      {log.severity.toUpperCase()}
                    </span>
                    <span className="log-action">{log.action}</span>
                    <span className="log-time">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="log-details">
                    <div className="log-user">User: {log.userId}</div>
                    {log.metadata && (
                      <div className="log-metadata">
                        {JSON.stringify(log.metadata, null, 2)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted">No logs found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPage;
