import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Home, Lock, Users, Clock, Settings, BarChart3, X } from "lucide-react";
import "./Sidebar.css";

export const Sidebar = ({ isOpen, onClose }) => {
  const { isAdmin } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/assets", label: "My Assets", icon: Lock },
    { path: "/nominees", label: "Nominees", icon: Users },
    { path: "/inactivity", label: "Activity Status", icon: Clock },
  ];

  const adminItems = [
    { path: "/admin", label: "Admin Panel", icon: BarChart3 },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? "open" : ""}`}
        onClick={onClose}
      />
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <button className="sidebar-close" onClick={onClose}>
          <X size={24} />
        </button>

        <nav className="nav-menu">
          <div className="nav-section">
            <h3 className="nav-title">Main</h3>
            <ul className="nav-list">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`nav-link ${isActive(item.path) ? "active" : ""}`}
                      onClick={onClose}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {isAdmin && (
            <div className="nav-section">
              <h3 className="nav-title">Admin</h3>
              <ul className="nav-list">
                {adminItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={`nav-link ${isActive(item.path) ? "active" : ""}`}
                        onClick={onClose}
                      >
                        <Icon size={20} />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
