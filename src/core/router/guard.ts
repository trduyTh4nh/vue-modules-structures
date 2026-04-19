import { authRequireAuthGuard } from "@/modules/auth/router/auth.guard";
import { homeAuthGuard } from "@/modules/home/router";
import { projectAuthGuard } from "@/modules/projects-management/router";
import { slocAuthGuard } from "@/modules/sloc/router";
import { userAuthGuard } from "@/modules/user-management/router";
import type { RouteLocationNormalized, RouteLocationRaw } from "vue-router";

export type RouterGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
) =>
  | Promise<boolean | RouteLocationRaw | string | void>
  | boolean
  | RouteLocationRaw
  | string
  | void;

export const globalGuard: RouterGuard[] = [authRequireAuthGuard];

export const specificGuard: Record<string, RouterGuard> = {
  homeAuthGuard,
  projectAuthGuard,
  slocAuthGuard,
  userAuthGuard,
};

export const executeGuards = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
): Promise<boolean | RouteLocationRaw | string | void> => {
  // Execute global guard

  console.log("guards specific check: ", to.meta.guards);
  console.log("guards global check: ", globalGuard);

  for (const guard of globalGuard) {
    const result = await guard(to, from);

    if (result !== true && result !== undefined) {
      return result;
    }
  }

  // Execute route guard
  if (to.meta.guards && Array.isArray(to.meta.guards)) {
    for (const guardName of to.meta.guards) {
      const guard = specificGuard[guardName];
      if (!guard) continue;
      const result = await guard(to, from);
      if (result !== true && result !== undefined) {
        return result;
      }
    }
  }
};
