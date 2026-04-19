import { useAuthStore } from "@/modules/auth/store/auth.store";
import type { RouteLocationNormalized, RouteLocationRaw } from "vue-router";

export type HomeGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
) =>
  | Promise<boolean | RouteLocationRaw | string | void>
  | boolean
  | RouteLocationRaw
  | string
  | void;

export const homeAuthGuard: HomeGuard = async (_to, _from) => {
  const authStore = useAuthStore();

  if (!authStore.isAuthenticated && _to.meta.requiresAuth) {
    return { name: "login", query: { redirect: _to.fullPath } };
  }

  return true;
};
