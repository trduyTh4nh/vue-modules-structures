import { AuthLayout } from "@/shared/layout";
import type { RouteRecordRaw } from "vue-router";

export const publicRoutes: RouteRecordRaw[] = [
  {
    path: "/auth",
    component: AuthLayout,
    children: [
      {
        path: "",
        name: "login",
        component: () => import("@/modules/auth/pages/Login/Login.vue"),
        meta: { guards: ["authRequireAuthGuard"], requiresAuth: false },
      },
    ],
  },
];
