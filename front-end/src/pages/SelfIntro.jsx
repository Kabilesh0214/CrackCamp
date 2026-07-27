import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import ChatWindow from "../components/ChatWindow";

function SelfIntro() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  // Video recording/uploading state
  const [stream, setStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recording, setRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(""); // "success" or "error" or ""
  
  // Drag and drop state
  const [dragActive, setDragActive] = useState(false);
  const [history, setHistory] = useState([]);
  
  // Video element refs
  const liveVideoRef = useRef(null);
  const playbackVideoRef = useRef(null);

  // Fetch role and initialize conversation
  useEffect(() => {
    // 1. Fetch user track
    api.get("/resources/skills")
      .then(res => {
        if (!res.data?.role) {
          navigate("/select-role");
          return;
        }
        setRole(res.data.role);
        setLoading(false);
      })
      .catch(() => {
        navigate("/login");
      });

    // 2. Auto-initialize chatbot session if not already existing
    const existingConversationId = localStorage.getItem("Conversation ID");
    if (!existingConversationId) {
      api.post("/chatbot/create-conversation")
        .then(res => {
          localStorage.setItem("Conversation ID", res.data.conversationId);
        })
        .catch(err => console.error("Auto chatbot conversation creation failed:", err));
    }

    // 3. Fetch past videos
    fetchHistory();
  }, [navigate]);

  const fetchHistory = async () => {
    try {
      const res = await api.get("/self-intro/list");
      setHistory(res.data || []);
    } catch (err) {
      console.error("Failed to fetch past self-intros", err);
    }
  };

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Start Camera
  const startCamera = async () => {
    try {
      setVideoFile(null);
      setVideoUrl("");
      setRecordedChunks([]);
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setStream(mediaStream);
      if (liveVideoRef.current) {
        liveVideoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Unable to access camera. Please check camera permissions or upload a video file instead.");
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  // Start Recording
  const startRecording = () => {
    if (!stream) return;
    setRecordedChunks([]);
    const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    
    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        setRecordedChunks(prev => [...prev, e.data]);
      }
    };

    recorder.onstop = () => {
      // Stream is stopped inside stopRecording helper
    };

    recorder.start();
    setMediaRecorder(recorder);
    setRecording(true);
  };

  // Stop Recording
  const stopRecording = () => {
    if (mediaRecorder && recording) {
      mediaRecorder.stop();
      setRecording(false);
      stopCamera();
    }
  };

  // Process recorded video chunk and create a file/URL preview
  useEffect(() => {
    if (recordedChunks.length > 0 && !recording) {
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      const file = new File([blob], "self-intro-record.webm", { type: "video/webm" });
      setVideoFile(file);
      setVideoUrl(URL.createObjectURL(blob));
    }
  }, [recordedChunks, recording]);

  // Handle local video upload file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      setVideoUrl(URL.createObjectURL(file));
      stopCamera();
    }
  };

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("video/")) {
      setVideoFile(file);
      setVideoUrl(URL.createObjectURL(file));
      stopCamera();
    } else {
      alert("Invalid file type. Please upload a valid video file.");
    }
  };

  // Upload Video File to API
  const uploadVideo = async () => {
    if (!videoFile) return;

    setUploading(true);
    setUploadProgress(0);
    setUploadStatus("");

    const formData = new FormData();
    formData.append("video", videoFile);

    try {
      await api.post("/self-intro/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      });
      setUploadStatus("success");
      fetchHistory(); // refresh list
    } catch (err) {
      console.error("Video upload failed:", err);
      setUploadStatus("error");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0b0f19', color: '#10b981', fontSize: '1.2rem', fontWeight: 600 }}>
        Loading Prep Studio...
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div>
          <div className="sidebar-brand">
            <span>🚀</span> CrackCamp
          </div>
          <nav>
            <ul className="sidebar-menu">
              <li>
                <Link to="/dashboard" className="menu-item">
                  <span>📊</span> Dashboard
                </Link>
              </li>
              <li>
                <Link to="/self-intro" className="menu-item active">
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
          <Link to="/dashboard" className="btn btn-secondary" style={{ width: "100%", textDecoration: "none" }}>
            <span>←</span> Back to Dashboard
          </Link>
        </div>
      </aside>

      {/* Main Studio Area */}
      <main className="dashboard-main" style={{ maxWidth: "1600px" }}>
        <header className="dashboard-header">
          <div className="dashboard-welcome">
            <h2>Mock Interview Prep Studio</h2>
            <p>Practice your 60-second self-introduction, upload your attempt, and prepare with the AI recruiter.</p>
          </div>
        </header>

        <div className="self-intro-container">
          {/* Left panel: Video Recording and upload */}
          <section className="intro-panel">
            <h3 style={{ fontSize: "1.2rem", marginBottom: "15px" }}>Self-Introduction Practice</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.5" }}>
              A perfect self-introduction highlights your core expertise, career motivation, and what makes you a great fit. Use our camera tool to record or upload an existing file.
            </p>

            {/* Video preview player */}
            <div className="video-preview-box">
              {stream && !videoUrl && (
                <video ref={liveVideoRef} autoPlay playsInline muted className="video-preview" />
              )}
              {videoUrl && (
                <video ref={playbackVideoRef} src={videoUrl} controls className="video-preview" />
              )}
              {!stream && !videoUrl && (
                <div style={{ textAlign: "center", color: "var(--text-secondary)" }}>
                  <span style={{ fontSize: "3rem", display: "block", marginBottom: "10px" }}>📷</span>
                  <p>Webcam preview is currently offline</p>
                </div>
              )}
            </div>

            {/* Webcam controller actions */}
            <div className="recorder-controls">
              {!stream && !recording && (
                <button onClick={startCamera} className="btn btn-secondary" style={{ width: "auto" }}>
                  🎬 Enable Webcam
                </button>
              )}
              {stream && !recording && (
                <button onClick={startRecording} className="btn btn-primary" style={{ width: "auto" }}>
                  🔴 Start Recording
                </button>
              )}
              {recording && (
                <button onClick={stopRecording} className="btn btn-primary" style={{ width: "auto", background: "var(--error)", color: "#fff" }}>
                  ⏹️ Stop & Save
                </button>
              )}
              {stream && !recording && (
                <button onClick={stopCamera} className="btn btn-secondary" style={{ width: "auto" }}>
                  Disable Webcam
                </button>
              )}
            </div>

            {/* Drag & Drop File Zone */}
            <div 
              className="upload-zone"
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              style={{
                borderColor: dragActive ? "var(--accent)" : "var(--border-glass)",
                background: dragActive ? "rgba(16, 185, 129, 0.05)" : "transparent"
              }}
            >
              <div className="upload-zone-icon">📤</div>
              <p className="upload-zone-text">
                Drag and drop your self-intro video here, or{" "}
                <label className="auth-link" style={{ cursor: "pointer" }}>
                  browse files
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                </label>
              </p>
              <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "5px" }}>
                Supports WebM, MP4, or MOV formats
              </p>
            </div>

            {/* Selected File Details & Upload Button */}
            {videoFile && (
              <div style={{ marginTop: "20px" }}>
                <div style={{ background: "rgba(255,255,255,0.02)", padding: "12px 16px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-glass)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.9rem", color: "var(--text-primary)", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", maxWidth: "80%" }}>
                    Selected: {videoFile.name}
                  </span>
                  <button onClick={() => { setVideoFile(null); setVideoUrl(""); }} className="chat-close-btn" style={{ fontSize: "1rem" }}>
                    ✕
                  </button>
                </div>

                <div style={{ marginTop: "15px" }}>
                  <button 
                    onClick={uploadVideo} 
                    className="btn btn-primary" 
                    disabled={uploading}
                  >
                    {uploading ? `Uploading (${uploadProgress}%)` : "Confirm & Upload video"}
                  </button>
                </div>
              </div>
            )}

            {/* Upload Feedback */}
            {uploading && (
              <div className="upload-progress-container">
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${uploadProgress}%` }} />
                </div>
                <div className="progress-text">
                  <span>Uploading preparation record...</span>
                  <span>{uploadProgress}%</span>
                </div>
              </div>
            )}

            {uploadStatus === "success" && (
              <div className="alert alert-success" style={{ marginTop: "20px" }}>
                <span>✅</span> Self-intro video uploaded successfully!
              </div>
            )}

            {uploadStatus === "error" && (
              <div className="alert alert-error" style={{ marginTop: "20px" }}>
                <span>⚠️</span> Video upload failed. Please try again.
              </div>
            )}

            {history.length > 0 && (
              <div style={{ marginTop: "40px" }}>
                <h3 style={{ fontSize: "1.1rem", marginBottom: "16px", color: "var(--text-secondary)" }}>Past Recordings</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {history.map(item => (
                    <div key={item.id} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-glass)", padding: "16px", borderRadius: "var(--radius-md)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "200px" }}>{item.title}</div>
                        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{new Date(item.createdAt).toLocaleDateString()}</div>
                      </div>
                      <a href={`http://localhost:4000${item.videoUrl}`} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: "0.8rem" }}>
                        Play
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Right panel: Chatbot */}
          <section className="intro-panel" style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: "550px" }}>
            <h3 style={{ fontSize: "1.2rem", marginBottom: "15px" }}>AI Recruiter Interview Prep</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.5", marginBottom: "20px" }}>
              Get feedback on your self-introduction script, ask for typical behavioral questions, or run a simulated interview.
            </p>
            <div style={{ border: "1px solid var(--border-glass)", borderRadius: "var(--radius-md)", overflow: "hidden", flexGrow: 1, display: "flex", flexDirection: "column", background: "rgba(0,0,0,0.15)" }}>
              {/* Embed ChatWindow directly inside the page grid */}
              <ChatWindow />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default SelfIntro;