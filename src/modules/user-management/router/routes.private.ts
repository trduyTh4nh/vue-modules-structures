import { DefaultLayout } from "@/shared/layout";
import type { RouteRecordRaw } from "vue-router";

export const userPrivateRoute: RouteRecordRaw[] = [
  {
    path: "/user-management",
    component: DefaultLayout,
    children: [
      {
        path: "",
        name: "user-management",
        component: () =>
          import("@/modules/user-management/pages/UserManagement.vue"),
        meta: { guards: ["userAuthGuard"], requiresAuth: true },
      },
    ],
  },
];
