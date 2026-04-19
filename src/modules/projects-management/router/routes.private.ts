import DefaultLayout from "@/shared/layout/DefaultLayout.vue";
import type { RouteRecordRaw } from "vue-router";

export const projectPrivateRoute: RouteRecordRaw[] = [
  {
    path: "/project-management",
    component: DefaultLayout,
    children: [
      {
        path: "",
        name: "project-management",
        component: () =>
          import("@/modules/projects-management/pages/ProjectManagement.vue"),
        meta: { guards: ["projectAuthGuard"], requiresAuth: true },
      },
    ],
  },
];
