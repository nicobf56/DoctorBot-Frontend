import { useState } from "react";
import { getAccessToken } from "../utils/token";

const ChatInterface = ({ onSend, messages }) => {
  const [input, setInput] = useState("");
  
  const [showCorrection, setShowCorrection] = useState({});
  const [corrections, setCorrections] = useState({});

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

  if (res.ok) {
    alert("Corrección enviada");
    // Limpia campo y oculta
    setCorrections((prev) => ({ ...prev, [chatId]: "" }));
    setShowCorrection((prev) => ({ ...prev, [chatId]: false }));
  } else {
    alert("Error al enviar corrección");
  }
};

const handleVote = async (chatId, vote) => {
  const token = getAccessToken();

  const res = await fetch("http://localhost:8000/api/feedback/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ chat: chatId, vote }),
  });

  if (res.ok) {
    alert("Voto registrado");
  } else {
    alert("Ya votaste o hubo un error.");
  }
};


  return (
    <div className="flex flex-col flex-1 p-4">
      <div className="flex-1 overflow-y-auto space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className="bg-gray-100 p-3 rounded-md space-y-2">
            <div>
              <strong>Pregunta:</strong> {msg.question}
              <br />
              <strong>Respuesta:</strong>{" "}
              <div dangerouslySetInnerHTML={{ __html: msg.answer }} />
            </div>

            <div className="flex gap-4 items-center">
              <button onClick={() => handleVote(msg.id, 1)} className="text-green-600">👍</button>
              <button onClick={() => handleVote(msg.id, -1)} className="text-red-600">👎</button>
              <button onClick={() => toggleCorrectionForm(idx)} className="text-blue-600 underline">
                Agregar corrección
              </button>
            </div>

            {showCorrection[idx] && (
              <div className="mt-2">
                <textarea
                  value={corrections[idx] || ""}
                  onChange={(e) => handleCorrectionChange(idx, e.target.value)}
                  className="w-full border p-2 rounded"
                  rows={3}
                />
                <button
                  onClick={() => sendCorrection(msg.id, corrections[idx])}
                  className="bg-blue-600 text-white px-3 py-1 rounded mt-1"
                  disabled={!corrections[idx] || corrections[idx].trim() === ""}
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
