import { TOKEN_KEY, USER_KEY } from "../constants";
import type { User } from "../types";

export const authStorage = {
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },
  removeToken() {
    localStorage.removeItem(TOKEN_KEY);
  },
  getUser(): User | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  setUser(user: User) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  removeUser() {
    localStorage.removeItem(USER_KEY);
  },
};
