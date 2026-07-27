import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import ChatBot from "../components/Chatbot";

const WEEK_COLORS = [
  { color: "#10b981", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.25)" },
  { color: "#3b82f6", bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.25)" },
  { color: "#a855f7", bg: "rgba(168,85,247,0.08)", border: "rgba(168,85,247,0.25)" },
  { color: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.25)" },
];

const DAY_ICON = { Mon: "🌅", Tue: "⚡", Wed: "🔥", Thu: "🎯", Fri: "🏆", Sat: "📝", Sun: "😌" };

function Roadmap() {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState("");
  const [expandedWeek, setExpandedWeek] = useState(0);

  const fetchRoadmap = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/roadmap");
      setRoadmap(res.data);
    } catch (err) {
      setError("Failed to generate roadmap. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const regenerate = async () => {
    setRegenerating(true);
    setError("");
    try {
      const res = await api.post("/roadmap/regenerate");
      setRoadmap(res.data);
      setExpandedWeek(0);
    } catch (err) {
      setError("Regeneration failed. Please try again.");
    } finally {
      setRegenerating(false);
    }
  };

  useEffect(() => { fetchRoadmap(); }, []);

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
              <li><Link to="/resume" className="menu-item"><span>📄</span> Resume Analyser</Link></li>
              <li><Link to="/roadmap" className="menu-item active"><span>🗺️</span> My Roadmap</Link></li>
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
            <h2>My Personalized Roadmap 🗺️</h2>
            <p>AI-generated 4-week interview preparation plan tailored to your career track.</p>
          </div>
          <button
            onClick={regenerate}
            className="btn btn-secondary"
            disabled={regenerating || loading}
            style={{ width: "auto" }}
          >
            {regenerating ? "Generating..." : "🔄 Regenerate"}
          </button>
        </header>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: "24px" }}>
            <span>⚠️</span> {error}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: "3rem", marginBottom: "20px", animation: "pulse 2s infinite" }}>🗺️</div>
            <h3 style={{ marginBottom: "12px" }}>Generating Your Roadmap...</h3>
            <p style={{ color: "var(--text-secondary)" }}>Gemini AI is crafting a personalized 4-week plan for you.</p>
          </div>
        ) : roadmap && (
          <>
            {/* Quick Tips */}
            {roadmap.quick_tips?.length > 0 && (
              <div style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "var(--radius-lg)", padding: "20px 24px", marginBottom: "32px" }}>
                <h4 style={{ color: "#10b981", marginBottom: "14px", fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  ⚡ Quick Success Tips
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "10px" }}>
                  {roadmap.quick_tips.map((tip, i) => (
                    <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                      <span style={{ color: "#10b981", flexShrink: 0 }}>→</span>
                      {tip}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Week Timeline */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "12px", marginBottom: "32px" }}>
              {roadmap.weeks?.map((week, idx) => {
                const wc = WEEK_COLORS[idx % WEEK_COLORS.length];
                return (
                  <button
                    key={week.week}
                    onClick={() => setExpandedWeek(idx)}
                    style={{
                      background: expandedWeek === idx ? wc.bg : "rgba(255,255,255,0.02)",
                      border: `2px solid ${expandedWeek === idx ? wc.border : "var(--border-glass)"}`,
                      borderRadius: "var(--radius-md)",
                      padding: "20px",
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div style={{ fontSize: "0.75rem", fontWeight: "700", color: wc.color, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
                      Week {week.week}
                    </div>
                    <div style={{ fontSize: "0.95rem", fontWeight: "600", color: "var(--text-primary)", marginBottom: "8px" }}>
                      {week.theme}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: "1.5" }}>
                      {week.goal}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Expanded Week Detail */}
            {roadmap.weeks?.[expandedWeek] && (() => {
              const week = roadmap.weeks[expandedWeek];
              const wc = WEEK_COLORS[expandedWeek % WEEK_COLORS.length];
              return (
                <div style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${wc.border}`, borderRadius: "var(--radius-lg)", padding: "28px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                    <div>
                      <span style={{ fontSize: "0.8rem", fontWeight: "700", color: wc.color, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                        Week {week.week}
                      </span>
                      <h3 style={{ margin: "6px 0 4px", color: "var(--text-primary)" }}>{week.theme}</h3>
                      <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", margin: 0 }}>{week.goal}</p>
                    </div>
                    <div style={{ background: wc.bg, border: `1px solid ${wc.border}`, borderRadius: "var(--radius-md)", padding: "12px 16px", textAlign: "center", minWidth: "120px" }}>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "4px" }}>Milestone</div>
                      <div style={{ fontSize: "0.8rem", color: wc.color, fontWeight: "600", lineHeight: "1.4" }}>{week.milestone}</div>
                    </div>
                  </div>

                  {/* Day grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "12px", marginBottom: "24px" }}>
                    {week.days?.map((day) => (
                      <div key={day.day} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-glass)", borderRadius: "var(--radius-md)", padding: "16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                          <span style={{ fontSize: "1.1rem" }}>{DAY_ICON[day.day] || "📌"}</span>
                          <span style={{ fontWeight: "700", color: wc.color, fontSize: "0.85rem" }}>{day.day}</span>
                        </div>
                        <div style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--text-primary)", marginBottom: "8px" }}>{day.focus}</div>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "5px" }}>
                          {day.tasks?.map((task, ti) => (
                            <li key={ti} style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: "1.5", paddingLeft: "12px", position: "relative" }}>
                              <span style={{ position: "absolute", left: 0, color: wc.color }}>·</span>
                              {task}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* Resources */}
                  {week.resources?.length > 0 && (
                    <div style={{ background: "rgba(0,0,0,0.15)", borderRadius: "var(--radius-md)", padding: "16px" }}>
                      <span style={{ fontSize: "0.8rem", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        📚 Key Resources
                      </span>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "10px" }}>
                        {week.resources.map((r, i) => (
                          <span key={i} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--border-glass)", borderRadius: "99px", padding: "4px 12px", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </>
        )}
      </main>
      <ChatBot />
    </div>
  );
}

export default Roadmap;
