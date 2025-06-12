import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatInterface from "../components/ChatInterface";
import { getAccessToken, refreshAccessToken } from "../utils/token";
import useAutoRefreshToken from "../hooks/useAutoRefreshToken";

const Chat = () => {
  useAutoRefreshToken();
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

  const makeRequest = async () => {
    const res = await fetch("http://localhost:8000/api/generar-respuesta/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ question }),
    });

    if (res.status === 401) {
      console.warn("Token expirado. Intentando refrescar...");
      token = await refreshAccessToken();
      if (!token) {
        alert("Tu sesión ha expirado. Por favor inicia sesión nuevamente.");
        return;
      }
      return await makeRequest(); // retry
    }

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      console.error("Error al enviar pregunta:", data);
      alert("Ocurrió un error al enviar tu pregunta.");
      return;
    }

    const data = await res.json();
    const newMessage = { question, answer: data.respuesta, id: data.id };
    setMessages((prev) => [...prev, newMessage]);
    await fetchHistorial();
  };

  await makeRequest();
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
      setMessages([{ id: chatId, question: data.pregunta, answer: fullAnswer }]);
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
