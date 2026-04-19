import type { RouteRecordRaw } from "vue-router";

export const privateRoutes: RouteRecordRaw[] = [
  {
    path: "/update-password",
    name: "update-password",
    component: () =>
      import("@/modules/auth/pages/UpdatePassword/UpdatePassword.vue"),
    meta: { guards: ["authRequireAuthGuard"], requiresAuth: true },
  },
];
