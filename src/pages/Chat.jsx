import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatInterface from "../components/ChatInterface";
import { getAccessToken, refreshAccessToken } from "../utils/token";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState([]);

  const fetchHistorial = async () => {
    const token = getAccessToken();  // <-- Usar helper

    try {
      const response = await fetch("http://localhost:8000/api/historial/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Error al obtener el historial");

      const data = await response.json();
      setChats(data);
    } catch (error) {
      console.error("Error cargando historial:", error);
    }
  };

  const sendQuestion = async (question) => {
    let token = getAccessToken();
  
    const res = await fetch("http://localhost:8000/api/generar-respuesta/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ question }),
    });
  
    if (res.status === 401) {
      token = await refreshAccessToken();
      if (!token) return; 
  
      
      return await sendQuestion(question);
    }
  
    const data = await res.json();
    const newMessage = { question, answer: data.respuesta, id:data.id };
    setMessages((prev) => [...prev, newMessage]);
    await fetchHistorial(); 
  };

  const handleSelectChat = async (chatId) => {
    const token = getAccessToken();  

    try {
      const res = await fetch(`http://localhost:8000/api/historial/${chatId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Error al obtener el detalle del chat");

      const data = await res.json();
      const fullAnswer = `${data.respuesta}<br><br>${data.referencias}`;
      setMessages([{ question: data.pregunta, answer: fullAnswer }]);
    } catch (error) {
      console.error("Error al obtener el chat:", error);
    }
  };

  useEffect(() => {
    fetchHistorial();
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar chats={chats} onSelectChat={handleSelectChat} />
      <ChatInterface onSend={sendQuestion} messages={messages} />
    </div>
  );
};

export default Chat;
