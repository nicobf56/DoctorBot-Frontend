import LogoutButton from "./LogoutButton";

const Sidebar = ({ chats, onSelectChat }) => {
  return (
    <aside className="w-72 bg-gray-100 p-4 overflow-y-auto border-r h-screen flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-800">🧠 Historial de chats</h2>

        {chats.length === 0 ? (
          <p className="text-gray-500 text-sm">No hay chats previos.</p>
        ) : (
          <ul className="space-y-2">
            {chats.map((chat) => (
              <li
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className="cursor-pointer bg-white p-3 rounded shadow-sm hover:bg-blue-100 transition"
              >
                <p className="text-sm font-medium text-gray-700 truncate">
                  {chat.pregunta}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(chat.created_at).toLocaleString()}
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
