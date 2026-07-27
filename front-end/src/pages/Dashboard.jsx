import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import ChatBot from "../components/Chatbot";

const roleSkills = {
  WebDeveloper: ["React", "JavaScript", "CSS", "NodeJS", "HTML"],
  DataAnalyst: ["Python", "SQL", "Tableau", "Excel", "Pandas"],
  ApplicationDeveloper: ["Flutter", "React Native", "Swift", "Kotlin", "Java"],
  CloudEngineer: ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD"],
  CybersecurityAnalyst: ["Network Security", "Linux", "Penetration Testing", "Cryptography", "Wireshark"],
  MachineLearningEngineer: ["Python", "TensorFlow", "PyTorch", "Scikit-Learn", "Deep Learning"]
};

const roleNames = {
  WebDeveloper: "Web Developer",
  DataAnalyst: "Data Analyst",
  ApplicationDeveloper: "Application Developer",
  CloudEngineer: "Cloud Engineer",
  CybersecurityAnalyst: "Cybersecurity Analyst",
  MachineLearningEngineer: "Machine Learning Engineer"
};

function StatCard({ icon, label, value, sub, color, bg }) {
  return (
    <div className="stat-card" style={{ background: bg, borderColor: `${color}30` }}>
      <div className="stat-card-icon" style={{ background: `${color}18`, color }}>{icon}</div>
      <div className="stat-card-body">
        <span className="stat-card-value" style={{ color }}>{value ?? "—"}</span>
        <span className="stat-card-label">{label}</span>
        {sub && <span className="stat-card-sub">{sub}</span>}
      </div>
    </div>
  );
}

function MiniScoreBar({ percentage, color }) {
  return (
    <div className="mini-score-bar">
      <div
        className="mini-score-bar-fill"
        style={{ width: `${percentage}%`, background: color }}
      />
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [skills, setSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [books, setBooks] = useState([]);
  const [tutorials, setTutorials] = useState([]);
  const [booksLoading, setBooksLoading] = useState(false);
  const [tutorialsLoading, setTutorialsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("books"); // "books" or "tutorials"
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    // Fetch user role
    api.get("/resources/skills")
      .then(res => {
        const userRole = res.data?.role;
        if (!userRole) {
          navigate("/select-role");
          return;
        }
        setRole(userRole);
        const skillList = roleSkills[userRole] || [];
        setSkills(skillList);
        if (skillList.length > 0) {
          setSelectedSkill(skillList[0]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Dashboard auth failed:", err);
        navigate("/login");
      });

    // Fetch dashboard stats
    api.get("/dashboard/stats")
      .then(res => {
        setStats(res.data);
      })
      .catch(err => {
        console.error("Failed to load stats:", err);
      })
      .finally(() => setStatsLoading(false));
  }, [navigate]);

  useEffect(() => {
    if (!selectedSkill) return;

    // Fetch books for selected skill
    setBooksLoading(true);
    api.get("/resources/books", { data: { skill: selectedSkill } })
      .then(res => {
        setBooks(res.data || []);
      })
      .catch(err => {
        console.error("Failed to fetch books:", err);
        setBooks([]);
      })
      .finally(() => {
        setBooksLoading(false);
      });

    // Fetch tutorials for selected skill
    setTutorialsLoading(true);
    api.get("/resources/tutorials", { data: { skill: selectedSkill } })
      .then(res => {
        setTutorials(res.data || []);
      })
      .catch(err => {
        console.error("Failed to fetch tutorials:", err);
        setTutorials([]);
      })
      .finally(() => {
        setTutorialsLoading(false);
      });
  }, [selectedSkill]);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (e) {
      // ignore
    }
    navigate("/login");
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0b0f19', color: '#10b981', fontSize: '1.2rem', fontWeight: 600 }}>
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation */}
      <aside className="dashboard-sidebar">
        <div>
          <div className="sidebar-brand">
            <span>🚀</span> CrackCamp
          </div>
          <nav>
            <ul className="sidebar-menu">
              <li>
                <Link to="/dashboard" className="menu-item active">
                  <span>📊</span> Dashboard
                </Link>
              </li>
              <li>
                <Link to="/self-intro" className="menu-item">
                  <span>🎥</span> Interview Prep
                </Link>
              </li>
              <li>
                <Link to="/dsa-arena" className="menu-item">
                  <span>⚔️</span> DSA Arena
                </Link>
              </li>
              <li>
                <Link to="/mcq" className="menu-item">
                  <span>🧪</span> MCQ Test
                </Link>
              </li>
              <li>
                <Link to="/question-bank" className="menu-item">
                  <span>📋</span> Question Bank
                </Link>
              </li>
              <li>
                <Link to="/resume" className="menu-item">
                  <span>📄</span> Resume Analyser
                </Link>
              </li>
              <li>
                <Link to="/roadmap" className="menu-item">
                  <span>🗺️</span> My Roadmap
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div>
          <button onClick={handleLogout} className="btn btn-secondary" style={{ width: "100%", justifyContent: "flex-start", gap: "10px" }}>
            <span>🚪</span> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-main">
        {/* Header */}
        <header className="dashboard-header">
          <div className="dashboard-welcome">
            <h2>Command Center</h2>
            <p>Welcome back! Here's your real-time progress overview.</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <span className="role-badge">
              Active Track: {roleNames[role] || role}
            </span>
          </div>
        </header>

        {/* ─── Stats Cards ────────────────────────────────────────────── */}
        <div className="stats-grid" style={{ marginBottom: "40px" }}>
          <StatCard
            icon="🔥"
            label="DSA Streak"
            value={statsLoading ? "..." : `${stats?.dsa?.streak ?? 0} days`}
            sub={statsLoading ? null : `${stats?.dsa?.completedSubtopics ?? 0}/${stats?.dsa?.totalSubtopics ?? 79} subtopics`}
            color="#10b981"
            bg="rgba(16, 185, 129, 0.06)"
          />
          <StatCard
            icon="🧪"
            label="MCQ Avg Score"
            value={statsLoading ? "..." : stats?.mcq?.averageScore != null ? `${stats.mcq.averageScore}%` : "No tests yet"}
            sub={statsLoading ? null : `${stats?.mcq?.totalAttempts ?? 0} total attempts`}
            color="#3b82f6"
            bg="rgba(59, 130, 246, 0.06)"
          />
          <StatCard
            icon="📄"
            label="Resume Score"
            value={statsLoading ? "..." : stats?.resume?.latestScore != null ? `${stats.resume.latestScore}/100` : "Not analysed"}
            sub={statsLoading ? null : `${stats?.resume?.totalAnalyses ?? 0} analyses done`}
            color="#a855f7"
            bg="rgba(168, 85, 247, 0.06)"
          />
          <StatCard
            icon="🗺️"
            label="Roadmap"
            value={statsLoading ? "..." : stats?.roadmap?.generated ? "Generated" : "Not created"}
            sub={stats?.roadmap?.generated ? "4-week plan ready" : "Generate from sidebar"}
            color="#f59e0b"
            bg="rgba(245, 158, 11, 0.06)"
          />
        </div>

        {/* ─── DSA Progress Bar ───────────────────────────────────────── */}
        {stats?.dsa && (
          <div style={{ marginBottom: "36px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-glass)", borderRadius: "var(--radius-lg)", padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <h3 style={{ fontSize: "1.1rem", margin: 0 }}>⚔️ DSA Progress</h3>
              <span style={{ fontSize: "0.85rem", color: "var(--accent)", fontWeight: 700 }}>
                {stats.dsa.percentage}% complete
              </span>
            </div>
            <MiniScoreBar percentage={stats.dsa.percentage} color="#10b981" />
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "8px" }}>
              {stats.dsa.completedSubtopics} of {stats.dsa.totalSubtopics} subtopics mastered · {stats.dsa.streak}-day streak
            </p>
          </div>
        )}

        {/* ─── Recent MCQ Attempts ────────────────────────────────────── */}
        {stats?.mcq?.recentAttempts?.length > 0 && (
          <div style={{ marginBottom: "36px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-glass)", borderRadius: "var(--radius-lg)", padding: "24px" }}>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "16px" }}>🧪 Recent MCQ Tests</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "10px" }}>
              {stats.mcq.recentAttempts.slice(0, 5).map((a, i) => {
                const color = a.percentage >= 70 ? "#10b981" : a.percentage >= 50 ? "#f59e0b" : "#ef4444";
                return (
                  <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-glass)", borderRadius: "var(--radius-md)", padding: "14px", textAlign: "center" }}>
                    <div style={{ fontSize: "1.4rem", fontWeight: "800", color }}>{a.percentage}%</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>{a.score}/{a.total}</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "2px" }}>
                      {new Date(a.completedAt).toLocaleDateString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── Skill Selector Tabs ─────────────────────────────────────── */}
        <div style={{ marginBottom: "35px" }}>
          <h3 style={{ fontSize: "1.25rem", marginBottom: "15px", color: "var(--text-primary)" }}>Core Skills to Master</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {skills.map(skill => (
              <button
                key={skill}
                onClick={() => setSelectedSkill(skill)}
                className={`btn ${selectedSkill === skill ? "btn-primary" : "btn-secondary"}`}
                style={{ width: "auto", padding: "8px 16px", fontSize: "0.875rem" }}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        {/* Resource Material Tabs */}
        <div>
          <div className="tab-container">
            <button
              onClick={() => setActiveTab("books")}
              className={`tab-btn ${activeTab === "books" ? "active" : ""}`}
            >
              Recommended Books
            </button>
            <button
              onClick={() => setActiveTab("tutorials")}
              className={`tab-btn ${activeTab === "tutorials" ? "active" : ""}`}
            >
              Video Tutorials & Courses
            </button>
          </div>

          {/* Book Resource Listing */}
          {activeTab === "books" && (
            <div>
              {booksLoading ? (
                <div style={{ padding: "40px", textAlign: "center", color: "var(--text-secondary)" }}>
                  Fetching books for {selectedSkill}...
                </div>
              ) : books.length > 0 ? (
                <div className="resource-grid">
                  {books.map((book, i) => (
                    <div key={i} className="resource-card">
                      <div className="resource-img-container">
                        {book.image ? (
                          <img src={book.image} alt={book.title} className="resource-img" />
                        ) : (
                          <span className="resource-placeholder-img">📚</span>
                        )}
                      </div>
                      <div className="resource-content">
                        <div className="resource-title">{book.title}</div>
                        <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                          by {book.author}
                        </div>
                        <div className="resource-meta">
                          <span className="resource-cost">Free Reading</span>
                          <a
                            href={`https://openlibrary.org/search?q=${encodeURIComponent(book.title)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="resource-link"
                          >
                            Read on OpenLibrary <span>→</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-state-icon">📖</div>
                  <h3>No Books Found</h3>
                  <p>We couldn't retrieve reference books for "{selectedSkill}" right now.</p>
                </div>
              )}
            </div>
          )}

          {/* Tutorial Resource Listing */}
          {activeTab === "tutorials" && (
            <div>
              {tutorialsLoading ? (
                <div style={{ padding: "40px", textAlign: "center", color: "var(--text-secondary)" }}>
                  Querying tutorial repository...
                </div>
              ) : tutorials.length > 0 ? (
                <div className="resource-grid">
                  {tutorials.map((tutorial) => (
                    <div key={tutorial.id} className="resource-card">
                      <div className="resource-img-container">
                        {tutorial.imageURL ? (
                          <img src={tutorial.imageURL} alt={tutorial.skill} className="resource-img" />
                        ) : (
                          <span className="resource-placeholder-img">📹</span>
                        )}
                      </div>
                      <div className="resource-content">
                        <div className="resource-title">{tutorial.source}</div>
                        <p className="resource-desc">{tutorial.description}</p>
                        <div className="resource-meta">
                          <span className="resource-cost">
                            {tutorial.cost === 0 ? "Free Access" : `$${tutorial.cost}`}
                          </span>
                          <a
                            href={tutorial.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="resource-link"
                          >
                            Go to Course <span>→</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-state-icon">🎥</div>
                  <h3>No Direct Video Tutorials Yet</h3>
                  <p>There are no pre-seeded local tutorials for "{selectedSkill}" in the database.</p>
                  <p style={{ fontSize: "0.85rem", marginTop: "8px", color: "var(--text-muted)" }}>
                    Try preparing using the floating recruiter chatbot at the bottom right!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Floating Chatbot Assistant */}
      <ChatBot />
    </div>
  );
}

export default Dashboard;
