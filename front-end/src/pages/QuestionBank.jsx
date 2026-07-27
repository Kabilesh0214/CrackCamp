import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import ChatBot from "../components/Chatbot";

const CATEGORIES = ["All", "Behavioral", "Technical", "System Design"];
const DIFFICULTIES = ["All", "Easy", "Medium", "Hard"];

const difficultyColor = {
  Easy: { color: "#10b981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.25)" },
  Medium: { color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.25)" },
  Hard: { color: "#ef4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.25)" },
};

const categoryIcon = {
  Behavioral: "🤝",
  Technical: "⚙️",
  "System Design": "🏗️",
};

function QuestionBank() {
  const [questions, setQuestions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [expanded, setExpanded] = useState(null);
  const [copied, setCopied] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/question-bank/list")
      .then((res) => {
        setQuestions(res.data || []);
        setFiltered(res.data || []);
      })
      .catch((err) => console.error("Failed to load questions:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = questions;
    if (selectedCategory !== "All") result = result.filter((q) => q.category === selectedCategory);
    if (selectedDifficulty !== "All") result = result.filter((q) => q.difficulty === selectedDifficulty);
    if (search.trim()) {
      const s = search.toLowerCase();
      result = result.filter((q) => q.question.toLowerCase().includes(s) || q.answer.toLowerCase().includes(s));
    }
    setFiltered(result);
  }, [selectedCategory, selectedDifficulty, search, questions]);

  const copyAnswer = (id, answer) => {
    navigator.clipboard.writeText(answer);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
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
              <li><Link to="/question-bank" className="menu-item active"><span>📋</span> Question Bank</Link></li>
              <li><Link to="/resume" className="menu-item"><span>📄</span> Resume Analyser</Link></li>
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
        <header className="dashboard-header">
          <div className="dashboard-welcome">
            <h2>Interview Question Bank</h2>
            <p>Curated behavioral, technical, and system design questions for your role.</p>
          </div>
          <span className="role-badge">{filtered.length} Questions</span>
        </header>

        {/* Search Bar */}
        <div style={{ marginBottom: "24px" }}>
          <input
            type="text"
            placeholder="🔍  Search questions or answers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ maxWidth: "480px" }}
          />
        </div>

        {/* Filters */}
        <div style={{ marginBottom: "32px", display: "flex", gap: "24px", flexWrap: "wrap" }}>
          <div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Category</p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`btn ${selectedCategory === cat ? "btn-primary" : "btn-secondary"}`}
                  style={{ width: "auto", padding: "6px 14px", fontSize: "0.85rem" }}
                >
                  {cat !== "All" && categoryIcon[cat]} {cat}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Difficulty</p>
            <div style={{ display: "flex", gap: "8px" }}>
              {DIFFICULTIES.map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  style={{
                    padding: "6px 14px", fontSize: "0.85rem", borderRadius: "var(--radius-sm)", border: "1px solid", cursor: "pointer", fontWeight: "600", transition: "all 0.2s",
                    ...(selectedDifficulty === diff && diff !== "All"
                      ? { background: difficultyColor[diff]?.bg, borderColor: difficultyColor[diff]?.border, color: difficultyColor[diff]?.color }
                      : selectedDifficulty === diff
                        ? { background: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.2)", color: "var(--text-primary)" }
                        : { background: "transparent", borderColor: "var(--border-glass)", color: "var(--text-secondary)" }),
                  }}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Questions */}
        {loading ? (
          <div style={{ padding: "60px", textAlign: "center", color: "var(--text-secondary)" }}>Loading question bank...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h3>No Questions Found</h3>
            <p>Try adjusting your filters or search term.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {filtered.map((q) => {
              const dc = difficultyColor[q.difficulty] || {};
              const isOpen = expanded === q.id;
              return (
                <div
                  key={q.id}
                  style={{
                    background: isOpen ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${isOpen ? "rgba(255,255,255,0.15)" : "var(--border-glass)"}`,
                    borderRadius: "var(--radius-md)",
                    overflow: "hidden",
                    transition: "all 0.2s ease",
                  }}
                >
                  {/* Question row */}
                  <div
                    onClick={() => setExpanded(isOpen ? null : q.id)}
                    style={{ padding: "18px 20px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: "8px", marginBottom: "8px", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "0.75rem", fontWeight: "600", padding: "2px 8px", borderRadius: "99px", background: "rgba(255,255,255,0.06)", color: "var(--text-muted)" }}>
                          {categoryIcon[q.category]} {q.category}
                        </span>
                        <span style={{ fontSize: "0.75rem", fontWeight: "700", padding: "2px 10px", borderRadius: "99px", background: dc.bg, border: `1px solid ${dc.border}`, color: dc.color }}>
                          {q.difficulty}
                        </span>
                      </div>
                      <p style={{ fontSize: "0.95rem", color: "var(--text-primary)", lineHeight: "1.6", margin: 0 }}>
                        {q.question}
                      </p>
                    </div>
                    <span style={{ color: "var(--text-muted)", fontSize: "1rem", marginTop: "2px", flexShrink: 0, transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>▼</span>
                  </div>

                  {/* Answer */}
                  {isOpen && (
                    <div style={{ borderTop: "1px solid var(--border-glass)", padding: "20px", background: "rgba(0,0,0,0.15)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                        <span style={{ fontSize: "0.8rem", fontWeight: "700", color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                          ✅ Model Answer
                        </span>
                        <button
                          onClick={() => copyAnswer(q.id, q.answer)}
                          style={{ background: "transparent", border: "1px solid var(--border-glass)", borderRadius: "var(--radius-sm)", padding: "4px 12px", cursor: "pointer", fontSize: "0.8rem", color: copied === q.id ? "var(--accent)" : "var(--text-muted)", transition: "all 0.2s" }}
                        >
                          {copied === q.id ? "✓ Copied!" : "Copy"}
                        </button>
                      </div>
                      <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: "1.75", margin: 0, whiteSpace: "pre-wrap" }}>
                        {q.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
      <ChatBot />
    </div>
  );
}

export default QuestionBank;
