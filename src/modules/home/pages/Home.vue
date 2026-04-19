<!-- modules/home/pages/Home/Home.vue -->
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { homeService } from "../services/home.service";

const authStore = useAuthStore();
const post = ref<any | null>(null);
const todo = ref<any | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

const fetchData = async () => {
  loading.value = true;
  error.value = null;

  try {
    const [postData, todoData] = await Promise.all([
      homeService.getPost(10),
      homeService.getTodo(10),
    ]);

    post.value = postData;
    todo.value = todoData;
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Failed to fetch data";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div class="home-page">
    <header class="home-header">
      <h1>Welcome, {{ authStore.user?.username || "Guest" }} 👋</h1>
      <button class="btn-logout" @click="authStore.logout()">Logout</button>
    </header>

    <div class="content">
      <section class="api-test-section">
        <h2>API Test Results</h2>

        <div v-if="loading" class="loading">Loading data...</div>

        <div v-else-if="error" class="error">Error: {{ error }}</div>

        <div v-else class="data-container">
          <div class="post-card">
            <h3>📝 Post from JSONPlaceholder</h3>
            <p><strong>Title:</strong> {{ post?.title }}</p>
            <p><strong>Body:</strong> {{ post?.body }}</p>
            <small>Post ID: {{ post?.id }} | User ID: {{ post?.userId }}</small>
          </div>

          <div class="todo-card">
            <h3>✅ Todo from JSONPlaceholder</h3>
            <p><strong>Title:</strong> {{ todo?.title }}</p>
            <p>
              <strong>Status:</strong>
              <span :class="{ completed: todo?.completed }">
                {{ todo?.completed ? "Completed ✓" : "Pending ⏳" }}
              </span>
            </p>
            <small>Todo ID: {{ todo?.id }} | User ID: {{ todo?.userId }}</small>
          </div>
        </div>
      </section>

      <section class="user-info">
        <h3>User Information</h3>
        <p><strong>Username:</strong> {{ authStore.user?.username }}</p>
        <p><strong>Email:</strong> {{ authStore.user?.email }}</p>
        <p>
          <strong>Authenticated:</strong>
          {{ authStore.isAuthenticated ? "Yes ✓" : "No ✗" }}
        </p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

.home-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 2rem;
}

.btn-logout {
  padding: 0.5rem 1rem;
  background-color: #dc2626;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
}

.btn-logout:hover {
  background-color: #b91c1c;
}

.content {
  display: grid;
  gap: 2rem;
  grid-template-columns: 2fr 1fr;
}

.api-test-section {
  background: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
}

.data-container {
  display: grid;
  gap: 1rem;
}

.post-card,
.todo-card {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.post-card h3,
.todo-card h3 {
  margin-top: 0;
  color: #333;
}

.completed {
  color: #4caf50;
  font-weight: bold;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.error {
  color: red;
  padding: 1rem;
  background: #fee;
  border-radius: 4px;
}

.user-info {
  background: #f0f9ff;
  padding: 1.5rem;
  border-radius: 8px;
  height: fit-content;
}

.user-info h3 {
  margin-top: 0;
}

@media (max-width: 768px) {
  .content {
    grid-template-columns: 1fr;
  }
}
</style>
