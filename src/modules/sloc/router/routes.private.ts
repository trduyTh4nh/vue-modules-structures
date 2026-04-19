import DefaultLayout from "@/shared/layout/DefaultLayout.vue";
import type { RouteRecordRaw } from "vue-router";

export const slocPrivateRoute: RouteRecordRaw[] = [
  {
    path: "/sloc",
    component: DefaultLayout,
    children: [
      {
        path: "",
        name: "sloc",
        component: () => import("@/modules/sloc/pages/Sloc.vue"),
        meta: { guards: ["slocAuthGuard"], requiresAuth: true },
      },
    ],
  },
];
