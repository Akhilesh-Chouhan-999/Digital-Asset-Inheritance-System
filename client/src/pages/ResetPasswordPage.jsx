import React, { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Alert } from "../components/Common";
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import "./Auth.css";

export const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const { token } = useParams();

  const validatePassword = (pass) => {
    return pass && pass.length >= 6;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await resetPassword(token, password, confirmPassword);
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      let errorMsg = err.response?.data?.message || "Failed to reset password";

      if (err.response?.status === 400) {
        errorMsg =
          "❌ Invalid or expired reset link. Please request a new one.";
      } else if (
        errorMsg.toLowerCase().includes("invalid") ||
        errorMsg.toLowerCase().includes("expired")
      ) {
        errorMsg =
          "❌ Invalid or expired reset link. Please request a new one.";
      } else if (errorMsg.toLowerCase().includes("token")) {
        errorMsg =
          "❌ Invalid reset token. Please request a new password reset.";
      }

      setError(errorMsg);
      console.error("Reset password error:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">DAIS</div>
            <h1>Password Reset</h1>
          </div>

          <div
            className="success-container"
            style={{ textAlign: "center", padding: "40px 20px" }}
          >
            <CheckCircle
              size={64}
              style={{ color: "#26a65b", marginBottom: "20px" }}
            />
            <h2 style={{ color: "#26a65b", marginBottom: "10px" }}>Success!</h2>
            <p style={{ marginBottom: "20px" }}>
              Your password has been reset successfully.
            </p>
            <p style={{ fontSize: "14px", color: "#7f8c8d" }}>
              Redirecting to login page in a moment...
            </p>
            <Link
              to="/login"
              className="btn btn-primary btn-lg"
              style={{ marginTop: "20px" }}
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">DAIS</div>
          <h1>Create New Password</h1>
          <p>Enter your new password</p>
        </div>

        {error && (
          <Alert type="error" message={error} onClose={() => setError("")} />
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <div className="input-group">
              <Lock size={20} />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
                disabled={loading}
              />
              <button
                type="button"
                className="eye-button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <small
              style={{ color: password.length >= 6 ? "#26a65b" : "#e74c3c" }}
            >
              {password.length >= 6
                ? "✓ Strong"
                : `${6 - password.length} characters minimum`}
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-group">
              <Lock size={20} />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (error) setError("");
                }}
                disabled={loading}
              />
              <button
                type="button"
                className="eye-button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex="-1"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {confirmPassword && password === confirmPassword ? (
              <small style={{ color: "#26a65b" }}>✓ Passwords match</small>
            ) : confirmPassword && password !== confirmPassword ? (
              <small style={{ color: "#e74c3c" }}>
                ✗ Passwords don't match
              </small>
            ) : null}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg w-full"
            disabled={
              loading ||
              !validatePassword(password) ||
              password !== confirmPassword
            }
          >
            {loading ? (
              <span className="flex-center">
                <span className="spinner"></span>
                Resetting...
              </span>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

        <div className="auth-footer">
          <Link to="/login" className="auth-link">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
