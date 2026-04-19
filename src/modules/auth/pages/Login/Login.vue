<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/modules/auth/store/auth.store";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const form = reactive({ username: "", password: "" });
const errorMsg = ref("");

const handleLogin = async () => {
  errorMsg.value = "";

  const success = await authStore.login({
    username: form.username,
    password: form.password,
  });

  console.log("success: ", success);
  if (success) {
    const redirect = route.query.redirect as string;
    await router.push(
      redirect && redirect !== "/" ? redirect : { name: "home" },
    );
  } else {
    errorMsg.value = "Email or password is wrong";
  }
};
</script>

<template>
  <div class="login-page">
    <form @submit.prevent="handleLogin">
      <h2>Login</h2>

      <input v-model="form.username" type="text" placeholder="Username" />

      <input v-model="form.password" type="password" placeholder="Password" />

      <p v-if="errorMsg" style="color: red">{{ errorMsg }}</p>

      <button type="submit" :disabled="authStore.loading">
        {{ authStore.loading ? "Logging in..." : "Login" }}
      </button>
    </form>
  </div>
</template>
