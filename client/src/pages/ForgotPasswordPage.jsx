import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Alert } from "../components/Common";
import { Mail, ArrowLeft } from "lucide-react";
import "./Auth.css";

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    try {
      setLoading(true);
      await forgotPassword(email);
      setSuccess(
        "✓ Reset email sent! Check your email for the password reset link.",
      );
      setEmail("");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      let errorMsg =
        err.response?.data?.message || "Failed to send reset email";

      if (err.response?.status === 404) {
        errorMsg = "❌ Email not found. Please create an account first.";
      } else if (
        errorMsg.toLowerCase().includes("not found") ||
        errorMsg.toLowerCase().includes("does not exist")
      ) {
        errorMsg = "❌ Email not found in our system.";
      }

      setError(errorMsg);
      console.error("Forgot password error:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">DAIS</div>
          <h1>Reset Password</h1>
          <p>Enter your email to receive a reset link</p>
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

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-group">
              <Mail size={20} />
              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg w-full"
            disabled={loading}
          >
            {loading ? (
              <span className="flex-center">
                <span className="spinner"></span>
                Sending...
              </span>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        <div className="auth-footer">
          <Link to="/login" className="auth-link flex-center">
            <ArrowLeft size={16} />
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
