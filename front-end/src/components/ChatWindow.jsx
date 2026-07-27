import { useState, useEffect, useRef } from "react";
import api from "../api/axios";

function ChatWindow({ onClose }) {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "AI",
      text: "Hello! I am your CrackCamp Prep Assistant. I can help you structure your self-introduction, quiz you on core skills, or simulate a behavioral interview. What would you like to practice today?"
    }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const updatePrompt = (e) => {
    setPrompt(e.target.value);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom when messages list changes
  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const userMessage = prompt;
    setPrompt("");
    setMessages((prev) => [...prev, { role: "User", text: userMessage }]);
    setLoading(true);

    try {
      const conversationId = localStorage.getItem("Conversation ID");
      const response = await api.post("/chatbot/prompt", {
        prompt: userMessage,
        conversationId
      });

      const reply = response.data.reply || "I'm having trouble connecting to my brain. Please try again.";
      setMessages((prev) => [...prev, { role: "AI", text: reply }]);
    } catch (error) {
      console.error("Chatbot request failed:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "AI",
          text: "Sorry, I encountered an error. Please verify your connection or try again."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={onClose ? "chat-window" : "chat-window-embedded"} style={!onClose ? { position: "relative", bottom: "0", right: "0", width: "100%", height: "100%", boxShadow: "none", border: "none" } : {}}>
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-title">
          <span className="chat-status" />
          <h3>AI Recruiter</h3>
        </div>
        {onClose && (
          <button onClick={onClose} className="chat-close-btn" aria-label="Close Chat">
            ✕
          </button>
        )}
      </div>

      {/* Message List */}
      <div className="chat-messages">
        {messages.map((message, i) => (
          <div key={i} className={`chat-msg ${message.role}`}>
            {message.text}
          </div>
        ))}
        {loading && (
          <div className="chat-msg AI" style={{ display: "flex", gap: "4px", padding: "10px 14px" }}>
            <span className="typing-dot" style={{ width: "6px", height: "6px", background: "var(--text-secondary)", borderRadius: "50%", display: "inline-block", animation: "bounce 1.4s infinite ease-in-out both" }} />
            <span className="typing-dot" style={{ width: "6px", height: "6px", background: "var(--text-secondary)", borderRadius: "50%", display: "inline-block", animation: "bounce 1.4s infinite ease-in-out both 0.2s" }} />
            <span className="typing-dot" style={{ width: "6px", height: "6px", background: "var(--text-secondary)", borderRadius: "50%", display: "inline-block", animation: "bounce 1.4s infinite ease-in-out both 0.4s" }} />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="chat-form">
        <input
          type="text"
          className="chat-input"
          placeholder="Ask a question or reply..."
          value={prompt}
          onChange={updatePrompt}
          disabled={loading}
          required
        />
        <button type="submit" className="chat-submit-btn" disabled={loading} aria-label="Send Message">
          {loading ? "..." : "➔"}
        </button>
      </form>

      {/* Styling helper for bounce animation */}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1.0); }
        }
        .chat-window-embedded {
          display: flex;
          flex-direction: column;
          height: 100%;
          width: 100%;
        }
      `}</style>
    </div>
  );
}

export default ChatWindow;