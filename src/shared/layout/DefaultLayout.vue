<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import SideBar from "./SideBar/SideBar.vue";

const router = useRouter();
const authStore = useAuthStore();

const handleLogout = () => {
  authStore.logout();
  router.push({ name: "login" });
};
</script>

<template>
  <div class="default-layout">
    <SideBar />
    <div class="main-wrapper">
      <header class="topbar">
        <span>{{ authStore.user?.username }}</span>
        <button @click="handleLogout">Logout</button>
      </header>

      <main class="page-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped>
.default-layout {
  display: flex;
  min-height: 100vh;
}
.sidebar {
  width: 240px;
  flex-shrink: 0;
  border-right: 1px solid #e5e7eb;
  padding: 1rem;
}
.sidebar nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.main-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.topbar {
  height: 56px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 1.5rem;
  gap: 12px;
}
.page-content {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}
</style>
