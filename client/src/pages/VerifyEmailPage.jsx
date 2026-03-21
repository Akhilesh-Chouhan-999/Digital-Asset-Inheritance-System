import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Alert } from "../components/Common";
import { CheckCircle, XCircle, Loader } from "lucide-react";
import "./Auth.css";

export const VerifyEmailPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setError("❌ Invalid verification link. Token is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Call the backend to verify the email
        const response = await fetch(`http://localhost:5000/api/v1/auth/verify-email/${token}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Failed to verify email. Please try again."
          );
        }

        const data = await response.json();
        setSuccess(true);

        // Auto-redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } catch (err) {
        let errorMsg = err.message || "Failed to verify email";

        if (errorMsg.toLowerCase().includes("invalid") || 
            errorMsg.toLowerCase().includes("expired")) {
          errorMsg = "❌ Verification link is invalid or expired. Please register again.";
        } else if (errorMsg.toLowerCase().includes("already")) {
          errorMsg = "✓ Your email is already verified! You can now log in.";
          setSuccess(true);
          setTimeout(() => {
            navigate("/login");
          }, 3000);
          setError("");
          return;
        }

        setError(errorMsg);
        console.error("Email verification error:", err);
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token, navigate]);

  if (loading) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">DAIS</div>
            <h1>Verifying Email</h1>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
              padding: "40px 20px",
            }}
          >
            <Loader size={48} style={{ animation: "spin 1s linear infinite", color: "#667eea" }} />
            <p style={{ fontSize: "1.1rem", color: "var(--gray)" }}>
              Verifying your email address...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">DAIS</div>
            <h1>Email Verified</h1>
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
              Your email has been verified successfully.
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

  if (error) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">DAIS</div>
            <h1>Verification Failed</h1>
          </div>

          <div
            className="error-container"
            style={{ textAlign: "center", padding: "40px 20px" }}
          >
            <XCircle
              size={64}
              style={{ color: "#e74c3c", marginBottom: "20px" }}
            />
            <h2 style={{ color: "#e74c3c", marginBottom: "10px" }}>Failed</h2>
            <p style={{ marginBottom: "20px", color: "#e74c3c" }}>{error}</p>

            <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "20px" }}>
              <Link to="/register" className="btn btn-primary btn-lg">
                Register Again
              </Link>
              <Link to="/login" className="btn btn-primary btn-lg">
                Go to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default VerifyEmailPage;
