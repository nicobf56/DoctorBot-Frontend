import LogoutButton from "./LogoutButton";

const Sidebar = ({ sessions, onSelectSession, onNewChat, currentSessionId }) => {
  return (
    <aside className="w-72 bg-gray-100 p-4 overflow-y-auto border-r h-screen flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-800">🧠 Historial de chats</h2>

        <button onClick={onNewChat} className="w-full bg-blue-600 text-white py-2 px-4 rounded mb-4">
          + Nuevo chat
        </button>

        {sessions.length === 0 ? (
          <p className="text-gray-500 text-sm">No hay sesiones previas.</p>
        ) : (
          <ul className="space-y-2">
            {sessions.map((session) => (
              <li
                key={session.id}
                onClick={() => onSelectSession(session.id)}
                className={`cursor-pointer p-3 rounded shadow-sm transition ${
                  currentSessionId === session.id
                    ? "bg-blue-100"
                    : "bg-white hover:bg-blue-50"
                }`}
              >
                <p className="text-sm font-medium text-gray-700 truncate">
                  {session.first_question || session.title}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(session.created_at).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6">
        <LogoutButton />
      </div>
    </aside>
  );
};

export default Sidebar;
