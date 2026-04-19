import { defineStore } from "pinia";
import type { LoginRequestDto, User } from "@/modules/auth/types";
import { computed, ref } from "vue";
import { authStorage } from "../storage/auth.storage";
import { authApi } from "../api/auth.api";

export const useAuthStore = defineStore("auth", () => {
  const token = ref<string | null>(authStorage.getToken());
  const user = ref<User | null>(null);
  const loading = ref<boolean>(false);

  const isAuthenticated = computed(() => !!token.value);

  const setSession = (newToken: string, newUser: User): void => {
    token.value = newToken;
    user.value = newUser;
    authStorage.setToken(newToken);
    authStorage.setUser(newUser);
  };

  const clearSession = (): void => {
    token.value = null;
    user.value = null;
    authStorage.removeToken();
    authStorage.removeUser();
  };

  const login = async (credentials: LoginRequestDto): Promise<boolean> => {
    loading.value = true;
    try {
      const { accessToken, user: loggedInUser } =
        await authApi.login(credentials);
      setSession(accessToken, loggedInUser);
      return true;
    } catch (error) {
      console.log("error: ", error);
      return false;
    } finally {
      loading.value = false;
    }
  };

  const getProfile = async (): Promise<User | null> => {
    if (!token.value) return null;
    try {
      const profile = await authApi.profile();
      user.value = profile;
      return profile;
    } catch {
      clearSession();
      return null;
    }
  };

  const logout = (): void => {
    clearSession();
  };

  return {
    token,
    user,
    loading,
    isAuthenticated,
    setSession,
    clearSession,
    login,
    logout,
    getProfile,
  };
});
