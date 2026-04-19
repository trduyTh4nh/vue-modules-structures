import { useAuthStore } from "@/modules/auth/store/auth.store";
import type { RouteLocationNormalized, RouteLocationRaw } from "vue-router";

export type UserGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
) => Promise<boolean | RouteLocationRaw | string | void>;

export const userAuthGuard: UserGuard = async (_to, _from) => {
  const authStore = useAuthStore();
  if (!authStore.isAuthenticated) {
    return { name: "login", query: { redirect: _to.fullPath } };
  }
  return true;
};
