import type { RouteRecordRaw } from "vue-router";
import { slocPrivateRoute } from "./routes.private";
import { slocPublicRoutes } from "./routes.public";

export const slocRoute: RouteRecordRaw[] = [
  ...slocPrivateRoute,
  ...slocPublicRoutes,
];

export { slocPrivateRoute, slocPublicRoutes };
export * from "./sloc.guard";
