import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function RoleSelect() {
  const navigate = useNavigate();

  const roles = [
    { label: "Web Developer", value: "WebDeveloper" },
    { label: "Data Analyst", value: "DataAnalyst" },
    { label: "Application Developer", value: "ApplicationDeveloper" },
    { label: "Cloud Engineer", value: "CloudEngineer" },
    { label: "Cybersecurity Analyst", value: "CybersecurityAnalyst" },
    { label: "Machine Learning Engineer", value: "MachineLearningEngineer" }
  ];

  const handleRoleSelect = async (role) => {
    try {

      const response = await api.patch("/auth/select-role", { role });

      if (response.data.success) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "120px" }}>
      <h2>Select Your Role</h2>

      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        width: "250px",
        margin: "30px auto"
      }}>
        {roles.map((role) => (
          <button
            key={role.value}
            onClick={() => handleRoleSelect(role.value)}
          >
            {role.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default RoleSelect;