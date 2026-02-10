import { useAuth } from "@clerk/nextjs";

// This hook wraps fetch and automatically adds the token
export function useApi() {
  const { getToken } = useAuth();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
    const token = await getToken();
    
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(await res.text());
    }

    return res.json();
  };

  return fetchWithAuth;
}