import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api/axios";

function RoleSelect() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const roles = [
    { 
      label: "Web Developer", 
      value: "WebDeveloper",
      description: "Build modern, responsive websites and web applications using HTML, CSS, React, and server-side technologies."
    },
    { 
      label: "Data Analyst", 
      value: "DataAnalyst",
      description: "Analyze and model data to discover key business trends, build dashboards, and generate actionable insights."
    },
    { 
      label: "Application Developer", 
      value: "ApplicationDeveloper",
      description: "Design, build, and deploy custom cross-platform mobile and desktop software systems."
    },
    { 
      label: "Cloud Engineer", 
      value: "CloudEngineer",
      description: "Architect and manage secure, scalable cloud infrastructure using AWS, GCP, and automated CI/CD pipelines."
    },
    { 
      label: "Cybersecurity Analyst", 
      value: "CybersecurityAnalyst",
      description: "Protect organizational networks, servers, and data systems from cyber threats, vulnerabilities, and attacks."
    },
    { 
      label: "Machine Learning Engineer", 
      value: "MachineLearningEngineer",
      description: "Develop, train, and deploy advanced artificial intelligence and machine learning models for real-world predictions."
    }
  ];

  const handleRoleSelect = async (role) => {
    setLoading(true);
    setError("");
    try {
      const response = await api.patch("/auth/select-role", { role });
      if (response.data.success) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
      setError("Failed to select role. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "60px 20px", display: "flex", flexDirection: "column", alignItems: "center", minHeight: "100vh", justifyContent: "center" }}>
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h2>Select Your Focus Track</h2>
        <p style={{ color: "var(--text-secondary)", marginTop: "8px", maxWidth: "500px" }}>
          Choose your career specialization. CrackCamp will customize your dashboard, resource materials, and chatbot preparation tools based on your choice.
        </p>
        {error && (
          <div className="alert alert-error" style={{ maxWidth: "500px", margin: "20px auto 0" }}>
            <span>⚠️</span> {error}
          </div>
        )}
      </div>

      <div className="role-grid">
        {roles.map((role) => (
          <div
            key={role.value}
            className="role-card"
            onClick={() => !loading && handleRoleSelect(role.value)}
            style={{ opacity: loading ? 0.6 : 1, pointerEvents: loading ? "none" : "auto" }}
          >
            <div>
              <h3>{role.label}</h3>
              <p>{role.description}</p>
            </div>
            <div className="role-card-footer">
              Select Track <span>→</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RoleSelect;