import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Alert } from "../components/Common";
import { Mail, Lock, LogIn } from "lucide-react";
import "./Auth.css";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      navigate("/");
    } catch (err) {
      let errorMsg = err.response?.data?.message || "Login failed";

      // Check for specific error types and provide helpful messages
      if (err.response?.status === 401) {
        errorMsg = "❌ Invalid email or password. Please check and try again.";
      } else if (err.response?.status === 403) {
        errorMsg =
          "⚠️ Your email is not verified. Please check your email for the verification link.";
      } else if (err.response?.status === 404) {
        errorMsg =
          "❌ This email is not registered. Please create an account first.";
      } else if (errorMsg.toLowerCase().includes("not verified")) {
        errorMsg =
          "⚠️ Please verify your email before logging in. Check your email for the verification link.";
      } else if (errorMsg.toLowerCase().includes("invalid")) {
        errorMsg = "❌ Invalid email or password. Please check and try again.";
      }

      setError(errorMsg);
      console.error("Login error details:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">DAIS</div>
          <h1>Welcome Back</h1>
          <p>Sign in to your account</p>
        </div>

        {error && (
          <Alert type="error" message={error} onClose={() => setError("")} />
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

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-group">
              <Lock size={20} />
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
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
                Signing in...
              </span>
            ) : (
              <span className="flex-center">
                <LogIn size={20} />
                Sign In
              </span>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <Link to="/forgot-password" className="auth-link">
            Forgot password?
          </Link>
          <span className="auth-divider">•</span>
          <Link to="/register" className="auth-link">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
