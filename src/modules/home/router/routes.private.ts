// modules/home/router/routes.private.ts
import { DefaultLayout } from "@/shared/layout";
import type { RouteRecordRaw } from "vue-router";

export const homePrivateRoutes: RouteRecordRaw[] = [
  {
    path: "/",
    component: DefaultLayout,
    children: [
      {
        path: "",
        name: "home",
        component: () => import("@/modules/home/pages/Home.vue"),
        meta: { guards: ["homeAuthGuard"], requiresAuth: true },
      },
    ],
  },
];
