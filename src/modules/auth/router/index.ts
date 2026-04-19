import type { RouteRecordRaw } from "vue-router";
import { publicRoutes } from "./routes.public";
import { privateRoutes } from "./routes.private";

// Export all routes
export const authRoutes: RouteRecordRaw[] = [...publicRoutes, ...privateRoutes];

// Export routes
export { privateRoutes, publicRoutes };

// Export guard
export * from "./auth.guard";
