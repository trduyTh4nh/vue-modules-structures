<script setup lang="ts">
import { useAuthStore } from "@/modules/auth/store/auth.store";
import type { User } from "@/modules/auth/types";
import { onMounted, ref } from "vue";
const authStore = useAuthStore();
const user = ref<User | null>(null);

onMounted(async () => {
  user.value = await authStore.getProfile();
});
</script>

<template>
  <div class="home-page">
    <header class="home-header">
      <h1>Welcome, {{ user?.username }} 👋</h1>
    </header>
  </div>
</template>

<style scoped></style>
