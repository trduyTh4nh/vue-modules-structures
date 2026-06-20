<!-- modules/home/pages/Home/Home.vue -->
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { homeService } from "../services/home.service";
import { useTodoStore, type Todo } from "../store/todo.store";
import TodoList from "../components/TodoList.vue";
import { storeToRefs } from "pinia";
import TodoForm from "../components/TodoForm.vue";

const todoStore = useTodoStore();
const {  filterStatus, getTodos } = storeToRefs(todoStore); // reactive refs
const { toggleTodo, deleteTodo, updateTodo, createTodo } = todoStore;


const editingTodo = ref<Todo | null>(null);

const searchStatus = (e: any) => {
  filterStatus.value = e.target.value;
};

const handleCancel = () => {
  editingTodo.value = null;
};
const handleEdit = (id: string) => {
  editingTodo.value = getTodos.value.find((t) => t.id === id) ?? null;
};


const handleSubmit = (
  payload: Omit<Todo, "id" | "createdAt" | "updatedAt">,
) => {
  if (editingTodo.value) {
    updateTodo(editingTodo.value.id, payload);
    editingTodo.value = null;
  } else {
    createTodo(payload);
  }
};
</script>

<template>
  <div class="home-page">
    <div class="home-page-control">
      <div class="search-todo">
        <select @change="searchStatus" class="filter-status">
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      <div class="create-todo">
        <TodoForm
          :editing-todo="editingTodo"
          @submit="handleSubmit"
          @cancel="handleCancel"
        />
      </div>
    </div>

    <TodoList
      v-for="todo in getTodos"
      :key="todo.id"
      :id="todo.id"
      :title="todo.title"
      :description="todo.description"
      :completed="todo.completed"
      :priority="todo.priority"
      :due-date="todo.dueDate"
      :created-at="todo.createdAt"
      :updated-at="todo.updatedAt"
      @toggle="toggleTodo"
      @delete="deleteTodo"
      @edit="handleEdit"
    />
  </div>
</template>

<style lang="css" scoped>
.home-page-control {
  display: flex;
}
</style>
