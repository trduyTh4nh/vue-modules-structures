import type { RouteRecordRaw } from "vue-router";
import { homePrivateRoutes } from "./routes.private";
import { homePublicRoutes } from "./routes.public";

export const homeRoutes: RouteRecordRaw[] = [
  ...homePrivateRoutes,
  ...homePublicRoutes,
];

export { homePrivateRoutes, homePublicRoutes };
export * from "./home.guard";
