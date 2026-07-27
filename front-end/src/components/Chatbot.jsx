import { useState } from "react";
import ChatWindow from "./ChatWindow";
import api from "../api/axios";

function ChatBot() {
  const [open, setOpen] = useState(false);

  const toggleConversation = async () => {
    if (!open) {
      const existingConversationId = localStorage.getItem("Conversation ID");
      if (!existingConversationId) {
        try {
          const response = await api.post("/chatbot/create-conversation");
          localStorage.setItem("Conversation ID", response.data.conversationId);
        } catch (err) {
          console.error("Failed to initialize chatbot session:", err);
        }
      }
    }
    setOpen(!open);
  };

  return (
    <>
      {open && <ChatWindow onClose={() => setOpen(false)} />}
      <button className="chatbot-trigger" onClick={toggleConversation} aria-label="Chat with Assistant">
        {open ? (
          <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>✕</span>
        ) : (
          <span style={{ fontSize: "1.6rem" }}>💬</span>
        )}
      </button>
    </>
  );
}

export default ChatBot;