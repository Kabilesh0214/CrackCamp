import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function Verify() {
  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    if (!savedEmail) {
      navigate("/register");
    } else {
      setEmail(savedEmail);
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!otp) {
      setErrorMessage("Please enter the verification code.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/verify", { email, otp: Number(otp) });
      const data = response.data;

      if (data.success) {
        setSuccessMessage("OTP verified successfully!");
        localStorage.removeItem("email");
        // Successfully verified, cookie is set. Redirect to role selection.
        setTimeout(() => {
          navigate("/select-role");
        }, 1500);
      }
    } catch (error) {
      const message = error.response?.data?.message || "Verification failed. Please check the code and try again.";
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-card">
        <h2>Enter Verification Code</h2>
        <p className="auth-subtitle">We have sent a 6-digit one-time code to <strong>{email}</strong></p>

        {errorMessage && (
          <div className="alert alert-error">
            <span>⚠️</span> {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success">
            <span>✅</span> {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ textAlign: "center" }}>
            <label className="form-label" style={{ textAlign: "center", display: "block" }} htmlFor="otp-input">
              6-Digit OTP Code
            </label>
            <input
              id="otp-input"
              className="form-input"
              type="text"
              pattern="[0-9]*"
              inputMode="numeric"
              maxLength="6"
              placeholder="000000"
              style={{
                textAlign: "center",
                letterSpacing: "0.5rem",
                fontSize: "1.5rem",
                fontWeight: "700"
              }}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              required
            />
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Verify Code"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Verify;