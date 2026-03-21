import React from "react";
import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from "lucide-react";

export const Alert = ({
  type = "info",
  title,
  message,
  onClose,
  actions = [],
}) => {
  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle size={20} />;
      case "error":
        return <AlertCircle size={20} />;
      case "warning":
        return <AlertTriangle size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  return (
    <div className={`alert alert-${type}`}>
      <div className="alert-icon">{getIcon()}</div>
      <div className="alert-content">
        {title && <div className="alert-title">{title}</div>}
        {message && <div className="alert-message">{message}</div>}
        {actions.length > 0 && (
          <div className="alert-actions">
            {actions.map((action, idx) => (
              <button
                key={idx}
                className={`btn btn-sm ${action.style || "btn-primary"}`}
                onClick={action.onClick}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
      {onClose && (
        <button className="alert-close" onClick={onClose}>
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export const Loading = ({ message = "Loading..." }) => {
  return (
    <div className="loading-container">
      <div className="spinner" />
      <span>{message}</span>
    </div>
  );
};

export const EmptyState = ({ icon: Icon, title, description, action }) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Icon size={48} />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-description">{description}</p>
      {action && (
        <button className="btn btn-primary mt-2" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  );
};

export const Modal = ({
  isOpen,
  title,
  children,
  footer,
  onClose,
  size = "md",
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal modal-${size}`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="modal-header">
            <h2>{title}</h2>
            <button className="modal-close" onClick={onClose}>
              <X size={24} />
            </button>
          </div>
        )}
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
};

export const Toast = ({ type = "info", message }) => {
  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle size={20} />;
      case "error":
        return <AlertCircle size={20} />;
      case "warning":
        return <AlertTriangle size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-icon">{getIcon()}</div>
      <div className="toast-message">{message}</div>
    </div>
  );
};

export const Badge = ({ children, type = "info", size = "md" }) => {
  return (
    <span className={`badge badge-${type} badge-${size}`}>{children}</span>
  );
};

export const StatCard = ({ icon: Icon, label, value, color = "primary" }) => {
  return (
    <div className={`stat-card stat-${color}`}>
      <div className="stat-icon">
        <Icon size={24} />
      </div>
      <div className="stat-content">
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
      </div>
    </div>
  );
};

export default {
  Alert,
  Loading,
  EmptyState,
  Modal,
  Toast,
  Badge,
  StatCard,
};
