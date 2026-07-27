import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import ChatBot from "../components/Chatbot";

function ScoreRing({ score }) {
  const color = score >= 75 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444";
  const label = score >= 75 ? "Strong Resume" : score >= 50 ? "Good Foundation" : "Needs Work";
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ width: "120px", height: "120px", borderRadius: "50%", border: `6px solid ${color}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
        <span style={{ fontSize: "2rem", fontWeight: "800", color }}>{score}</span>
        <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>/ 100</span>
      </div>
      <span style={{ fontSize: "0.9rem", fontWeight: "700", color }}>{label}</span>
    </div>
  );
}

function FeedbackCard({ icon, title, items, color, bg }) {
  return (
    <div style={{ background: bg, border: `1px solid ${color}40`, borderRadius: "var(--radius-md)", padding: "20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
        <span style={{ fontSize: "1.3rem" }}>{icon}</span>
        <h4 style={{ color, margin: 0, fontSize: "1rem", fontWeight: "700" }}>{title}</h4>
      </div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
        {items?.map((item, i) => (
          <li key={i} style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: "1.6", paddingLeft: "16px", position: "relative" }}>
            <span style={{ position: "absolute", left: 0, color }}>{i % 2 === 0 ? "▸" : "▸"}</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ResumeAnalyser() {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    try {
      const res = await api.get("/resume/history");
      setHistory(res.data || []);
    } catch (err) {
      console.error("Failed to fetch resume history", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped?.type === "application/pdf") {
      setFile(dropped);
      setResult(null);
      setError("");
    } else {
      setError("Only PDF files are supported.");
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected?.type === "application/pdf") {
      setFile(selected);
      setResult(null);
      setError("");
    } else {
      setError("Only PDF files are supported.");
    }
  };

  const handleAnalyse = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("resume", file);
    try {
      const res = await api.post("/resume/analyse", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 60000,
      });
      setResult(res.data);
      fetchHistory(); // refresh history list
    } catch (err) {
      setError(err.response?.data?.message || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setError("");
  };

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div>
          <div className="sidebar-brand"><span>🚀</span> CrackCamp</div>
          <nav>
            <ul className="sidebar-menu">
              <li><Link to="/dashboard" className="menu-item"><span>📊</span> Dashboard</Link></li>
              <li><Link to="/self-intro" className="menu-item"><span>🎥</span> Interview Prep</Link></li>
              <li><Link to="/dsa-arena" className="menu-item"><span>⚔️</span> DSA Arena</Link></li>
              <li><Link to="/mcq" className="menu-item"><span>🧪</span> MCQ Test</Link></li>
              <li><Link to="/question-bank" className="menu-item"><span>📋</span> Question Bank</Link></li>
              <li><Link to="/resume" className="menu-item active"><span>📄</span> Resume Analyser</Link></li>
              <li><Link to="/roadmap" className="menu-item"><span>🗺️</span> My Roadmap</Link></li>
            </ul>
          </nav>
        </div>
        <div>
          <Link to="/dashboard" className="btn btn-secondary" style={{ width: "100%", textDecoration: "none", justifyContent: "flex-start", gap: "10px" }}>
            <span>←</span> Dashboard
          </Link>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header" style={{ marginBottom: "32px" }}>
          <div className="dashboard-welcome">
            <h2>AI Resume Analyser</h2>
            <p>Upload your PDF resume and get instant Gemini-powered feedback tailored to your role.</p>
          </div>
        </header>

        {!result ? (
          <div style={{ maxWidth: "640px" }}>
            {/* Drop Zone */}
            <div
              className="upload-zone"
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              style={{
                borderColor: dragActive ? "var(--accent)" : file ? "rgba(16,185,129,0.5)" : "var(--border-glass)",
                background: dragActive ? "rgba(16,185,129,0.05)" : file ? "rgba(16,185,129,0.03)" : "transparent",
                marginBottom: "24px",
              }}
            >
              <div className="upload-zone-icon">{file ? "📄" : "📤"}</div>
              {file ? (
                <div style={{ textAlign: "center" }}>
                  <p style={{ color: "var(--accent)", fontWeight: "600", marginBottom: "4px" }}>{file.name}</p>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              ) : (
                <>
                  <p className="upload-zone-text">
                    Drag & drop your resume PDF, or{" "}
                    <label className="auth-link" style={{ cursor: "pointer" }}>
                      browse files
                      <input type="file" accept=".pdf,application/pdf" onChange={handleFileChange} style={{ display: "none" }} />
                    </label>
                  </p>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "5px" }}>PDF only · Max 10MB</p>
                </>
              )}
            </div>

            {error && (
              <div className="alert alert-error" style={{ marginBottom: "20px" }}>
                <span>⚠️</span> {error}
              </div>
            )}

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={handleAnalyse}
                className="btn btn-primary"
                disabled={!file || loading}
                style={{ flex: 1 }}
              >
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}>
                    <span style={{ display: "inline-block", width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                    Analysing with Gemini AI...
                  </span>
                ) : "🔍 Analyse My Resume"}
              </button>
              {file && (
                <button onClick={handleReset} className="btn btn-secondary" style={{ width: "auto" }}>
                  Clear
                </button>
              )}
            </div>

            {loading && (
              <div style={{ marginTop: "24px", padding: "16px", background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "var(--radius-md)", color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: "1.7" }}>
                🤖 AI is reading your resume and cross-referencing it against your role's requirements. This usually takes 15–30 seconds...
              </div>
            )}

            {history.length > 0 && !loading && (
              <div style={{ marginTop: "40px" }}>
                <h3 style={{ fontSize: "1.1rem", marginBottom: "16px", color: "var(--text-secondary)" }}>Past Analyses</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {history.map(item => (
                    <div key={item.id} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-glass)", padding: "16px", borderRadius: "var(--radius-md)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>{item.fileName}</div>
                        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{new Date(item.analysedAt).toLocaleDateString()}</div>
                      </div>
                      <div style={{ fontWeight: 800, fontSize: "1.2rem", color: item.overallScore >= 75 ? "#10b981" : item.overallScore >= 50 ? "#f59e0b" : "#ef4444" }}>
                        {item.overallScore}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* Results Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
              <h3 style={{ fontSize: "1.25rem" }}>Analysis Results for <span style={{ color: "var(--accent)" }}>{file?.name}</span></h3>
              <button onClick={handleReset} className="btn btn-secondary" style={{ width: "auto" }}>
                Analyse Another
              </button>
            </div>

            {/* Score + Summary */}
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "24px", alignItems: "center", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-glass)", borderRadius: "var(--radius-lg)", padding: "28px", marginBottom: "28px" }}>
              <ScoreRing score={result.overall_score} />
              <div>
                <h4 style={{ margin: "0 0 10px", color: "var(--text-primary)" }}>Overall Assessment</h4>
                <p style={{ color: "var(--text-secondary)", lineHeight: "1.75", margin: 0, fontSize: "0.95rem" }}>
                  {result.summary}
                </p>
              </div>
            </div>

            {/* Main feedback cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
              <FeedbackCard
                icon="✅" title="Strengths"
                items={result.strengths}
                color="#10b981" bg="rgba(16,185,129,0.05)"
              />
              <FeedbackCard
                icon="⚠️" title="Weaknesses / Gaps"
                items={result.weaknesses}
                color="#f59e0b" bg="rgba(245,158,11,0.05)"
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <FeedbackCard
                icon="🔑" title="Missing Keywords"
                items={result.missing_keywords}
                color="#3b82f6" bg="rgba(59,130,246,0.05)"
              />
              <FeedbackCard
                icon="🚀" title="Improvement Tips"
                items={result.improvement_tips}
                color="#a855f7" bg="rgba(168,85,247,0.05)"
              />
            </div>
          </div>
        )}
      </main>
      <ChatBot />
    </div>
  );
}

export default ResumeAnalyser;
