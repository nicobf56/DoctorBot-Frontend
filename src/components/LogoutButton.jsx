import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  return (
    <button onClick={handleLogout} className="text-red-600 font-semibold mt-4">
      Cerrar sesión
    </button>
  );
};

export default LogoutButton;
