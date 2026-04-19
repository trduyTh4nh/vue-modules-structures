import type { RouteRecordRaw } from "vue-router";
import { projectPrivateRoute } from "./routes.private";
import { projectPublicRoutes } from "./routes.public";

export const projectRoutes: RouteRecordRaw[] = [
  ...projectPrivateRoute,
  ...projectPublicRoutes,
];

export { projectPrivateRoute, projectPublicRoutes };
export * from "./project.guard";
