import { useState } from "react";

const ChatInterface = ({ onSend, messages }) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col flex-1 p-4">
      <div className="flex-1 overflow-y-auto space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className="bg-gray-100 p-3 rounded-md">
            <strong>Pregunta:</strong> {msg.question}
            <br />
            <strong>Respuesta:</strong> <div dangerouslySetInnerHTML={{ __html: msg.answer }} />
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
