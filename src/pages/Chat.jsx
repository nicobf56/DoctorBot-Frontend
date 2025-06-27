import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatInterface from "../components/ChatInterface";
import { getAccessToken, refreshAccessToken } from "../utils/token";
import useAutoRefreshToken from "../hooks/useAutoRefreshToken";

const Chat = () => {
  useAutoRefreshToken();
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState([]);
  const [votedChats, setVotedChats] = useState({});
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [sessions, setSessions] = useState([]);

  const fetchHistorial = async () => {
    const token = getAccessToken();  

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
    const url = `http://localhost:8000/api/sessions/${currentSessionId}/ask/`


    const res = await fetch(url, {
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
      return await makeRequest(); // retry con nuevo token
    }

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      console.error("Error al enviar pregunta:", data);
      alert("Ocurrió un error al enviar tu pregunta.");
      return;
    }

    const data = await res.json();
    const newMessage = {
      question,
      answer: data.respuesta,
      id: data.id,
      animated: true,
    };
    setMessages((prev) => [...prev, newMessage]);
    await fetchHistorial();
  };

  await makeRequest();
};


  // const handleSelectChat = async (chatId) => {
  //   const token = getAccessToken();  

  //   try {
  //     const res = await fetch(`http://localhost:8000/api/historial/${chatId}/`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     if (!res.ok) throw new Error("Error al obtener el detalle del chat");

  //     const data = await res.json();
  //     const fullAnswer = `${data.respuesta}<br><br>${data.referencias}`;
  //     setMessages([{ id: chatId, question: data.pregunta, answer: fullAnswer, animated: false }]);
  //   } catch (error) {
  //     console.error("Error al obtener el chat:", error);
  //   }
  // };

  const handleSelectSession = async (sessionId) => {
    const token  = getAccessToken();
    try {
      const res = await fetch(`http://localhost:8000/api/sessions/${sessionId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!res.ok) throw new Error("Error al obtener chats");

      const data = await res.json();
      const mapped = data.map((msg) => ({
        id: msg.id,
        question: msg.question,
        answer: `${msg.answer}<br><br>${msg.references}`,
      }));

      setMessages(mapped);
      setCurrentSessionId(sessionId);
    } catch (err) {
      console.error("Error cargando sesión:", err);
    }
  };

  const fetchUserVotes = async () => {
    const token = getAccessToken();

    try {
      const res = await fetch("http://localhost:8000/api/feedback/user/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Error al obtener votos");

      const data = await res.json();

      
      const votes = {};
      data.forEach(v => {
        votes[v.chat] = v.vote;
      });

      setVotedChats(votes);
    } catch (error) {
      console.error("Error cargando votos del usuario:", error);
    }
  };

  const createNewSession = async() => {
    const token = getAccessToken();

    const res = await fetch("http://localhost:8000/api/sessions/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify( {title: "Nueva sesión" })
    });

    if (res.ok) {
      const data = await res.json();
      setCurrentSessionId(data.id);
      setMessages([]);
      await fetchHistorial();
    } else {
      console.error("Error al crear sesión")
    }

  };

  const fetchSessions = async () => {
    const token = getAccessToken();

    try {
      const res = await fetch("http://localhost:8000/api/sessions/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Error al obtener sesiones");
      const data = await res.json();
      setSessions(data);
    } catch (err) {
      console.error("Error cargando sesiones: ", err);
    }

  };

  useEffect(() => {
    fetchSessions();
    fetchUserVotes();
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar sessions={sessions} onSelectSession={handleSelectSession} onNewChat={createNewSession}/>
      <ChatInterface onSend={sendQuestion} messages={messages} votedChats={votedChats} setVotedChats={setVotedChats}/>
    </div>
  );
};

export default Chat;
