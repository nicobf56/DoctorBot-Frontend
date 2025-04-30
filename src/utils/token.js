export const getAccessToken = () => localStorage.getItem("accessToken");
export const getRefreshToken = () => localStorage.getItem("refreshToken");

export const refreshAccessToken = async () => {
  const refresh = getRefreshToken();
  if (!refresh) return null;

  const res = await fetch("http://localhost:8000/api/refresh/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh }),
  });

  if (!res.ok) return null;

  const data = await res.json();
  localStorage.setItem("accessToken", data.access);
  return data.access;
};
