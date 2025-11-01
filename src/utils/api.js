import BASE_URL from "../config";

export async function apiFetch(path, options = {}) {
  const url = `${BASE_URL}${path}`;

  const defaultHeaders = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const res = await fetch(url, {
    ...options,
    headers: defaultHeaders,
    credentials: "include", // keep this if using cookies/sessions
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "API request failed");
  }

  return res;
}
