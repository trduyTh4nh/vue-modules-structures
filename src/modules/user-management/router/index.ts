import type { RouteRecordRaw } from "vue-router";
import { userPrivateRoute } from "./routes.private";
import { userPublicRoutes } from "./routes.public";

export const userRoutes: RouteRecordRaw[] = [
  ...userPrivateRoute,
  ...userPublicRoutes,
];

export { userPrivateRoute, userPublicRoutes };

export * from "./user.guard";
