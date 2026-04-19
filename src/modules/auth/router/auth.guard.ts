import type { RouteLocationNormalized, RouteLocationRaw } from "vue-router";
import { useAuthStore } from "../store/auth.store";

export type AuthGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
) =>
  | Promise<boolean | RouteLocationRaw | string | void>
  | boolean
  | RouteLocationRaw
  | string
  | void;

export const authRequireAuthGuard: AuthGuard = (_to, _from) => {
  const authStore = useAuthStore();

  console.log("token trong guard:", authStore.token);
  console.log("isAuthenticated:", authStore.isAuthenticated);

  if (_to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: "login", query: { redirect: _to.fullPath } };
  }

  if (_to.meta.requiresAuth === false && authStore.isAuthenticated) {
    return { name: "home" };
  }

  return true;
};
