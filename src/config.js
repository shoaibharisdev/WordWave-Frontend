const BASE_URL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_BACKEND_URL
    : "http://localhost:4000";

export default BASE_URL;
