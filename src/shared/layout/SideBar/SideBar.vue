<script setup lang="ts"></script>

<template>
  <aside class="sidebar">
    <nav>
      <RouterLink :to="{ name: 'home' }">Home</RouterLink>
      <RouterLink :to="{ name: 'project-management' }">Projects</RouterLink>
      <RouterLink :to="{ name: 'user-management' }">Users</RouterLink>
      <RouterLink :to="{ name: 'sloc' }">Sloc</RouterLink>
    </nav>
  </aside>
</template>

<style scoped>
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
</style>
