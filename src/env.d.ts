import type { Router } from "vue-router";

declare global {
  interface Window {
    __appRouter?: Router;
  }
}
