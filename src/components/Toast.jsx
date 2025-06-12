import { useEffect, useState } from "react";

const Toast = ({ message, duration = 4000, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timeout = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, duration);

      return () => clearTimeout(timeout);
    }
  }, [message, duration, onClose]);

  return (
    <div
      className={`fixed top-4 right-4 max-w-xs transition-transform duration-500 z-50 shadow-lg rounded px-4 py-2 text-white bg-blue-600 overflow-hidden ${
        visible ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="relative">
        <span>{message}</span>
        <div className="absolute bottom-0 left-0 h-1 bg-white animate-progressBar w-full" />
      </div>
    </div>
  );
};

export default Toast;


