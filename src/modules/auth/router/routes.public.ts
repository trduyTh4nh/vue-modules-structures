import { AuthLayout } from "@/shared/layout";
import type { RouteRecordRaw } from "vue-router";

export const publicRoutes: RouteRecordRaw[] = [
  {
    path: "/",
    component: AuthLayout,
    children: [
      {
        path: "login",
        name: "login",
        component: () => import("@/modules/auth/pages/Login/Login.vue"),
        meta: { guards: ["authRequireAuthGuard"], requiresAuth: false },
      },
    ],
  },
];
