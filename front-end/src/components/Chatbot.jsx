import { useState } from "react";
import ChatWindow from "./ChatWindow";
import api from "../api/axios";

function ChatBot () {

  const [open, setOpen] = useState(false);

  async function createConversation() {
    if (open === false) {
      const response = await api.post("/chatbot/create-conversation");
      localStorage.setItem("Conversation ID", response.data.conversationId);
    }
    setOpen(!open);
  }

  return (
  <>
    {open && <ChatWindow />}
    <button onClick={createConversation}>Chatbot</button>
  </>
  )}

export default ChatBot;