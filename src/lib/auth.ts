import { get, post, put, del } from '@/lib/api';
import { endpoints } from '@/lib/endpoints';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

// Fetch all events
export const addEvent = async (event: Partial<Event>): Promise<Event> => {
  return post<Event>(endpoints.events, event);
};


export const login = async (data: LoginRequest): Promise<string> => {
  const result = await post<AuthResponse>(`${endpoints.auth}/login`, data);

    if (!result.token) {
      throw new Error("Login failed: No token received");
    }

  // Store JWT in localStorage
  localStorage.setItem("jwt", result.token);

  return result.token;
}

export function logout() {
  localStorage.removeItem("jwt");
}

export function getToken(): string | null {
  return localStorage.getItem("jwt");
}