import { useEffect } from "react";
import { refreshAccessToken } from "../utils/token";

const useAutoRefreshToken = () => {
  useEffect(() => {
    const interval = setInterval(async () => {
      const newToken = await refreshAccessToken();
      if (!newToken) {
        console.warn("No se pudo renovar el token.");
        // redirigir
        // window.location.href = "/login";
      } else {
        console.log("Token renovado automáticamente.");
      }
    }, 10 * 60 * 1000); // cada 10 minutos

    return () => clearInterval(interval);
  }, []);
};

export default useAutoRefreshToken;
