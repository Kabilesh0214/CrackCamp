import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";


function Verify() {

  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = localStorage.getItem("email");

    try {
      const response = await api.post("/auth/verify", { email, otp: Number(otp) });

      const data = response.data;

      if (data.success) {
        localStorage.removeItem("email");
        navigate("/select-role");
      }
    } catch (error) {
      const message = error.response?.data?.message || "Login failed. Please try again.";
      setErrorMessage(message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={otp} onChange={(e) => setOtp(e.target.value)} />
      <button type="submit">Verify</button>
      <p>{errorMessage}</p>
    </form>
  );
}

export default Verify;