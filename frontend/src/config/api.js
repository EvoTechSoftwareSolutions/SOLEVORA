const API_BASE_URL = "http://localhost:5000";

export const API_URL = `${API_BASE_URL}/api`;
export const BASE_URL = API_BASE_URL;

export const getImageUrl = (path) => {
  if (!path) return "/placeholder.png";
  if (path.startsWith("http")) return path;
  return `${BASE_URL}${path}`;
};
