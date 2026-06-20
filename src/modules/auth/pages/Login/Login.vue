<!-- modules/auth/pages/Login/Login.vue -->
<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { logger } from "@/shared/common/utils/logger";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const form = reactive({ username: "", password: "" });
const errorMsg = ref("");

const handleLogin = async () => {
  errorMsg.value = "";

  logger.group("Login Attempt", () => {
    logger.debug("Form data", { username: form.username });
  });

  const success = await authStore.login({
    username: form.username,
    password: form.password,
  });

  if (success) {
    const redirect = route.query.redirect as string;
    logger.info("Login successful, redirecting", {
      redirect: redirect || "/home",
    });
    await router.push(
      redirect && redirect !== "/" ? redirect : { name: "home" },
    );
  } else {
    errorMsg.value = "Username or password is incorrect";
    logger.warn("Login failed - invalid credentials", {
      username: form.username,
    });
  }
};
</script>

<template>
  <div class="login-page">
    <form @submit.prevent="handleLogin">
      <h2>Login</h2>

      <div class="form-group">
        <input
          v-model="form.username"
          type="text"
          placeholder="Username"
          autocomplete="username"
        />
      </div>

      <div class="form-group">
        <input
          v-model="form.password"
          type="password"
          placeholder="Password"
          autocomplete="current-password"
        />
      </div>

      <p v-if="errorMsg" class="error-message">{{ errorMsg }}</p>

      <button type="submit" :disabled="authStore.loading">
        {{ authStore.loading ? "Logging in..." : "Login" }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f5f5f5;
}

form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h2 {
  margin-bottom: 1.5rem;
  text-align: center;
}

.form-group {
  margin-bottom: 1rem;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: #4caf50;
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

button:hover:not(:disabled) {
  background-color: #45a049;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  color: red;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  text-align: center;
}

.test-credentials {
  margin-top: 1rem;
  text-align: center;
  color: #666;
}
</style>
