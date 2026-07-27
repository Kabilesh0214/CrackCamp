import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import ChatBot from "../components/Chatbot";

const QUESTION_TIME = 45; // seconds per question

function MCQArena() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState("lobby"); // lobby | quiz | review
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Timer logic
  useEffect(() => {
    if (phase !== "quiz") return;
    if (timeLeft <= 0) {
      handleNext();
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [phase, timeLeft, currentIdx]);

  const startQuiz = async () => {
    setLoading(true);
    try {
      const res = await api.get("/mcq/questions");
      setQuestions(res.data);
      setAnswers({});
      setCurrentIdx(0);
      setTimeLeft(QUESTION_TIME);
      setPhase("quiz");
    } catch (err) {
      console.error("Failed to load questions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId, option) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleNext = useCallback(() => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((i) => i + 1);
      setTimeLeft(QUESTION_TIME);
    } else {
      submitQuiz();
    }
  }, [currentIdx, questions.length]);

  const submitQuiz = async () => {
    setSubmitLoading(true);
    try {
      const res = await api.post("/mcq/submit", { answers });
      setResult(res.data);
      setPhase("review");
    } catch (err) {
      console.error("Failed to submit:", err);
    } finally {
      setSubmitLoading(false);
    }
  };

  const q = questions[currentIdx];
  const timerPct = (timeLeft / QUESTION_TIME) * 100;
  const timerColor = timeLeft > 20 ? "#10b981" : timeLeft > 10 ? "#f59e0b" : "#ef4444";

  const optionLabels = ["A", "B", "C", "D"];

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div>
          <div className="sidebar-brand"><span>🚀</span> CrackCamp</div>
          <nav>
            <ul className="sidebar-menu">
              <li><Link to="/dashboard" className="menu-item"><span>📊</span> Dashboard</Link></li>
              <li><Link to="/self-intro" className="menu-item"><span>🎥</span> Interview Prep</Link></li>
              <li><Link to="/dsa-arena" className="menu-item"><span>⚔️</span> DSA Arena</Link></li>
              <li><Link to="/mcq" className="menu-item active"><span>🧪</span> MCQ Test</Link></li>
              <li><Link to="/question-bank" className="menu-item"><span>📋</span> Question Bank</Link></li>
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
        {/* LOBBY */}
        {phase === "lobby" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "70vh", textAlign: "center" }}>
            <div style={{ fontSize: "4rem", marginBottom: "20px" }}>🧪</div>
            <h2 style={{ fontSize: "2rem", marginBottom: "12px" }}>MCQ Test Arena</h2>
            <p style={{ color: "var(--text-secondary)", maxWidth: "520px", marginBottom: "40px", lineHeight: "1.7" }}>
              10 role-based multiple choice questions. <strong style={{ color: "var(--accent)" }}>45 seconds</strong> per question.
              Auto-advances when time runs out. Detailed score breakdown at the end.
            </p>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center", marginBottom: "40px" }}>
              {[["⏱️", "45 sec/question"], ["📝", "10 Questions"], ["🎯", "Instant Scoring"], ["🔍", "Full Review"]].map(([icon, label]) => (
                <div key={label} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-glass)", borderRadius: "var(--radius-md)", padding: "16px 24px", minWidth: "120px" }}>
                  <div style={{ fontSize: "1.5rem", marginBottom: "6px" }}>{icon}</div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{label}</div>
                </div>
              ))}
            </div>
            <button onClick={startQuiz} className="btn btn-primary" disabled={loading} style={{ fontSize: "1.1rem", padding: "14px 40px" }}>
              {loading ? "Loading Questions..." : "🚀 Start Test"}
            </button>
          </div>
        )}

        {/* QUIZ */}
        {phase === "quiz" && q && (
          <div>
            <header className="dashboard-header" style={{ marginBottom: "24px" }}>
              <div className="dashboard-welcome">
                <h2>MCQ Test</h2>
                <p>Question {currentIdx + 1} of {questions.length} · <span style={{ color: "var(--text-muted)" }}>{q.category}</span></p>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "2rem", fontWeight: "700", color: timerColor, fontVariantNumeric: "tabular-nums" }}>
                  {String(timeLeft).padStart(2, "0")}s
                </span>
              </div>
            </header>

            {/* Progress bar */}
            <div style={{ height: "4px", background: "rgba(255,255,255,0.08)", borderRadius: "99px", marginBottom: "32px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${((currentIdx) / questions.length) * 100}%`, background: "var(--accent)", transition: "width 0.4s ease" }} />
            </div>

            {/* Timer ring */}
            <div style={{ height: "6px", background: "rgba(255,255,255,0.06)", borderRadius: "99px", marginBottom: "32px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${timerPct}%`, background: timerColor, transition: "width 1s linear" }} />
            </div>

            {/* Question card */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-glass)", borderRadius: "var(--radius-lg)", padding: "32px", marginBottom: "24px" }}>
              <p style={{ fontSize: "1.15rem", lineHeight: "1.7", color: "var(--text-primary)", marginBottom: 0 }}>
                <span style={{ color: "var(--accent)", fontWeight: "700", marginRight: "10px" }}>Q{currentIdx + 1}.</span>
                {q.question}
              </p>
            </div>

            {/* Options */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "32px" }}>
              {optionLabels.map((label) => {
                const text = q.options[label];
                const selected = answers[q.id] === label;
                return (
                  <button
                    key={label}
                    onClick={() => handleAnswer(q.id, label)}
                    style={{
                      background: selected ? "rgba(16, 185, 129, 0.15)" : "rgba(255,255,255,0.03)",
                      border: selected ? "2px solid var(--accent)" : "1px solid var(--border-glass)",
                      borderRadius: "var(--radius-md)",
                      padding: "16px 20px",
                      textAlign: "left",
                      cursor: "pointer",
                      color: selected ? "var(--accent)" : "var(--text-primary)",
                      fontSize: "0.95rem",
                      lineHeight: "1.5",
                      transition: "all 0.2s ease",
                      display: "flex",
                      gap: "12px",
                      alignItems: "flex-start",
                    }}
                  >
                    <span style={{ fontWeight: "700", minWidth: "20px", color: selected ? "var(--accent)" : "var(--text-muted)" }}>{label}.</span>
                    {text}
                  </button>
                );
              })}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
                {Object.keys(answers).length} / {questions.length} answered
              </span>
              <button
                onClick={handleNext}
                className="btn btn-primary"
                disabled={submitLoading}
                style={{ width: "auto", padding: "12px 32px" }}
              >
                {currentIdx < questions.length - 1
                  ? (answers[q.id] ? "Next →" : "Skip →")
                  : (submitLoading ? "Submitting..." : "Submit Quiz ✓")}
              </button>
            </div>
          </div>
        )}

        {/* REVIEW */}
        {phase === "review" && result && (
          <div>
            <header className="dashboard-header" style={{ marginBottom: "32px" }}>
              <div className="dashboard-welcome">
                <h2>Quiz Complete! 🎉</h2>
                <p>Here's your detailed breakdown</p>
              </div>
              <button onClick={() => setPhase("lobby")} className="btn btn-secondary" style={{ width: "auto" }}>
                Retake Quiz
              </button>
            </header>

            {/* Score card */}
            <div style={{ background: result.percentage >= 70 ? "rgba(16,185,129,0.08)" : result.percentage >= 50 ? "rgba(245,158,11,0.08)" : "rgba(239,68,68,0.08)", border: `1px solid ${result.percentage >= 70 ? "rgba(16,185,129,0.3)" : result.percentage >= 50 ? "rgba(245,158,11,0.3)" : "rgba(239,68,68,0.3)"}`, borderRadius: "var(--radius-lg)", padding: "32px", marginBottom: "32px", textAlign: "center" }}>
              <div style={{ fontSize: "3.5rem", fontWeight: "800", color: result.percentage >= 70 ? "#10b981" : result.percentage >= 50 ? "#f59e0b" : "#ef4444" }}>
                {result.percentage}%
              </div>
              <div style={{ fontSize: "1.1rem", marginTop: "8px", color: "var(--text-secondary)" }}>
                {result.score} / {result.total} correct
              </div>
              <div style={{ marginTop: "12px", fontSize: "1rem", fontWeight: "600", color: result.percentage >= 70 ? "#10b981" : result.percentage >= 50 ? "#f59e0b" : "#ef4444" }}>
                {result.percentage >= 80 ? "🏆 Excellent!" : result.percentage >= 60 ? "✅ Good job!" : "📚 Keep practicing!"}
              </div>
            </div>

            {/* Breakdown */}
            <h3 style={{ fontSize: "1.15rem", marginBottom: "20px" }}>Question Breakdown</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {result.breakdown.map((item, i) => (
                <div key={item.id} style={{ background: item.correct ? "rgba(16,185,129,0.05)" : "rgba(239,68,68,0.05)", border: `1px solid ${item.correct ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.25)"}`, borderRadius: "var(--radius-md)", padding: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                    <p style={{ fontSize: "0.95rem", lineHeight: "1.6", flex: 1 }}>
                      <strong style={{ color: "var(--text-muted)", marginRight: "8px" }}>Q{i + 1}.</strong>
                      {item.question}
                    </p>
                    <span style={{ marginLeft: "16px", fontSize: "1.2rem" }}>{item.correct ? "✅" : "❌"}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "12px" }}>
                    {["A", "B", "C", "D"].map((label) => (
                      <div key={label} style={{ padding: "8px 12px", borderRadius: "var(--radius-sm)", fontSize: "0.85rem", background: label === item.correctAnswer ? "rgba(16,185,129,0.15)" : label === item.yourAnswer && !item.correct ? "rgba(239,68,68,0.12)" : "rgba(255,255,255,0.02)", border: `1px solid ${label === item.correctAnswer ? "rgba(16,185,129,0.4)" : label === item.yourAnswer && !item.correct ? "rgba(239,68,68,0.3)" : "transparent"}`, color: label === item.correctAnswer ? "#10b981" : label === item.yourAnswer && !item.correct ? "#ef4444" : "var(--text-secondary)" }}>
                        <strong>{label}.</strong> {item.options[label]}
                        {label === item.correctAnswer && " ✓"}
                        {label === item.yourAnswer && !item.correct && " ✗"}
                      </div>
                    ))}
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "var(--radius-sm)", padding: "12px 14px", fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                    💡 <strong style={{ color: "var(--text-primary)" }}>Explanation:</strong> {item.explanation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <ChatBot />
    </div>
  );
}

export default MCQArena;
