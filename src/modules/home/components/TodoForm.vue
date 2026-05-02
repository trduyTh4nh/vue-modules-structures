<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import type { Todo } from "../store/todo.store";

const props = defineProps<{
  editingTodo?: Todo | null;
}>();

const emit = defineEmits<{
  (e: "submit", payload: Omit<Todo, "id" | "createdAt" | "updatedAt">): void;
  (e: "cancel"): void;
}>();


onMounted(() => {
    console.log("TodoForm mounted with editingTodo:", props.editingTodo);
}) 

watch(
  () => props.editingTodo,
  (newVal) => {
    title.value = newVal?.title ?? "";
    description.value = newVal?.description ?? "";
    priority.value = newVal?.priority ?? "medium";
    dueDate.value = newVal?.dueDate ?? "";
  }
);
 
const title = ref(props.editingTodo?.title ?? "");
const description = ref(props.editingTodo?.description ?? "");
const priority = ref(props.editingTodo?.priority ?? "medium");
const dueDate = ref(props.editingTodo?.dueDate ?? "");

const handleSubmit = () => {
  if (!title.value.trim()) return;
  emit("submit", {
    title: title.value,
    description: description.value,
    priority: priority.value,
    dueDate: dueDate.value,
    completed: props.editingTodo?.completed ?? false,
  });

  title.value = "";
  description.value = "";
  priority.value = "medium";
  dueDate.value = "";
};
</script>

<template>
  <div class="todo-form">
    <input v-model="title" type="text" placeholder="Title" />
    <input v-model="description" type="text" placeholder="Description" />
    <select v-model="priority">
      <option value="low">Low</option>
      <option value="medium">Medium</option>
      <option value="high">High</option>
    </select>
    <input v-model="dueDate" type="date" />

    <button @click="handleSubmit">
      {{ editingTodo ? "Update" : "Create" }}
    </button>
    <button v-if="editingTodo" @click="$emit('cancel')">Cancel</button>
  </div>
</template>
