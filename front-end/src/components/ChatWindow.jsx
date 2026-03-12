import { useState, useEffect } from "react";
import api from "../api/axios";

function ChatWindow () {

  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);

  const updatePrompt = (e) => {
    setPrompt(e.target.value);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const conversationId = localStorage.getItem("Conversation ID");

    const response = await api.post("/chatbot/prompt", { prompt, conversationId});
    
    setMessages(prev => [
      ...prev, 
      {role: "User", text: prompt},
      {role: "AI", text: response.data.reply}
    ]);
    setPrompt("");
    
  }

  return (
    <>
      <h1>Chatwindow</h1> 
      <div>
        {messages.map((message, i) => {
          return <div key={i} className={message.role}> 
            {message.text}
          </div>
        })}
      </div>
      <form onSubmit={handleSubmit} >
        <input type="text" value={prompt} onChange={updatePrompt} />
        <button type="submit">Send</button>
      </form>
    </>
  )
}

export default ChatWindow;