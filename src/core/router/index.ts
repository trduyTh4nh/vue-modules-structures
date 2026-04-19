import {
  createRouter,
  createWebHistory,
  type Router,
  type RouteRecordRaw,
} from "vue-router";
import { authRoutes } from "@/modules/auth/router";
import { executeGuards } from "./guard";
import { homeRoutes } from "@/modules/home/router";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { slocRoute } from "@/modules/sloc/router";
import { projectRoutes } from "@/modules/projects-management/router";
import { userRoutes } from "@/modules/user-management/router";

const routes: RouteRecordRaw[] = [
  ...authRoutes,
  ...homeRoutes,
  ...projectRoutes,
  ...slocRoute,
  ...userRoutes,
  {
    path: "/:pathMatch(.*)*",
    redirect: () => {
      const authStore = useAuthStore();
      if (authStore.isAuthenticated) {
        return { name: "home" };
      }
      return { name: "login" };
    },
  },
];

// Create router
export const createAppRouter = (): Router => {
  const router = createRouter({
    history: createWebHistory(),
    routes,
  });

  console.log("DEBUG: ", routes);

  router.beforeEach(async (to, from) => {
    console.log("DEBUG-1: ", to.meta.requiresAuth);
    console.log("DEBUG-2: ", to.meta.name);
    if (to.meta.requiresAuth === undefined) {
      to.meta.requiresAuth = true;
    }
    return await executeGuards(to, from);
  });

  return router;
};
