import { useState } from "react";
import { getAccessToken } from "../utils/token";
import Toast from "./Toast";

const ChatInterface = ({ onSend, messages, votedChats, setVotedChats }) => {
  const [input, setInput] = useState("");
  
  const [showCorrection, setShowCorrection] = useState({});
  const [corrections, setCorrections] = useState({});
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput("");
    }
  };

  const toggleCorrectionForm = (index) => {
    setShowCorrection((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleCorrectionChange = (index, value) => {
    setCorrections((prev) => ({ ...prev, [index]: value }));
  };

  const sendCorrection = async (chatId, text) => {
    const token = getAccessToken();

    const res = await fetch("http://localhost:8000/api/corrections/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ chat: chatId, text }),
    });

    let data = {};
    const contentType = res.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      data = await res.json();
    }

    if (res.ok) {
      setFeedbackMessage("Corrección enviada");

      setCorrections((prev) => ({ ...prev, [chatId]: "" }));
      setShowCorrection((prev) => ({ ...prev, [chatId]: false }));
    } else {
      console.error("Error al enviar corrección:", res.status, data);
      setFeedbackMessage("Error al enviar corrección");
      
    }
  };

  const handleVote = async (chatId, vote) => {
    const token = getAccessToken();
    const payload = { chat: chatId, vote: vote };

    const res = await fetch("http://localhost:8000/api/feedback/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const resData = await res.json();

    if (res.ok) {
      setVotedChats((prev) => ({ ...prev, [chatId]: vote }));
      setFeedbackMessage("Voto registrado");
      
    } else {
      console.error("Error al votar:", res.status, resData);
      alert("Ya votaste o hubo un error.");
    }
  };








  return (
    <div className="flex flex-col flex-1 p-4">
      <div className="flex-1 overflow-y-auto space-y-4">
        <Toast message={feedbackMessage} onClose={() => setFeedbackMessage("")} />
        {messages.map((msg, idx) => (
          
          <div key={idx} className="bg-gray-100 p-3 rounded-md space-y-2">
            <div>
              <strong>Pregunta:</strong> {msg.question}
              <br />
              <strong>Respuesta:</strong>{" "}
              <div dangerouslySetInnerHTML={{ __html: msg.answer }} />
            </div>

            <div className="flex gap-4 items-center">
              <button onClick={() => handleVote(msg.id, 1)} className={`px-2 py-1 rounded transition ${votedChats[msg.id] === 1 ? "bg-green-100 text-green-700 font-semibold" : "text-green-600 opacity-60 hover:opacity-100"}`}>👍</button>
              <button onClick={() => handleVote(msg.id, -1)} className={`px-2 py-1 rounded transition ${votedChats[msg.id] === -1 ? "bg-red-100 text-red-700 font-semibold": "text-red-600 opacity-60 hover:opacity-100"}`}>👎</button>
              <button onClick={() => toggleCorrectionForm(msg.id)} className="text-blue-600 underline">
                Agregar corrección
              </button>
            </div>

            {showCorrection[msg.id] && (
              <div className="mt-2">
                <textarea
                  value={corrections[msg.id] || ""}
                  onChange={(e) => handleCorrectionChange(msg.id, e.target.value)}
                  className="w-full border p-2 rounded"
                  rows={3}
                />
                <button
                  onClick={() => sendCorrection(msg.id, corrections[msg.id])}
                  className="bg-blue-600 text-white px-3 py-1 rounded mt-1"
                  disabled={!corrections[msg.id] || corrections[msg.id].trim() === ""}
                >
                  Enviar corrección
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 flex">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border px-4 py-2 rounded-l-md"
          placeholder="Escribe tu pregunta médica..."
        />
        <button onClick={handleSend} className="bg-blue-600 text-white px-4 py-2 rounded-r-md">
          Enviar
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
