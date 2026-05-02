<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  id: string;
  title: string;
  description?: string;   // ✅ fix
  completed: boolean;
  priority: "low" | "medium" | "high";
  dueDate?: string;       // ✅ fix
  createdAt: string;
  updatedAt: string;
}>();

const priorityClass = computed(() => {
  return {
    low: "priority-low",
    medium: "priority-medium",
    high: "priority-high",
  }[props.priority];
});

const isOverdue = computed(() => {
  if (!props.dueDate) {
    return false;
  }
  return new Date(props.dueDate) < new Date() && !props.completed;
});

const emit = defineEmits<{
    (e: "toggle", id:string): void,
    (e: "edit", id: string): void,
    (e: "delete", id: string): void
}>()


</script>

<template>
  <div class="todo-card" :class="{ completed }">
    <!-- Header -->
    <div class="todo-header">
      <input
        type="checkbox"
        :checked="completed"
        @change="$emit('toggle', id)"
      />

      <h3 class="title">
        {{ title }}
      </h3>

      <span class="priority" :class="priorityClass">
        {{ priority }}
      </span>
    </div>

    <!-- Description -->
    <p v-if="description" class="description">
      {{ description }}
    </p>

    <!-- Meta info -->
    <div class="todo-meta">
      <span v-if="dueDate" :class="{ overdue: isOverdue }">
        📅 {{ dueDate }}
      </span>

      <span class="created"> 🕒 {{ createdAt }} </span>
    </div>

    <!-- Actions -->
    <div class="todo-actions">
      <button @click="$emit('edit', id)">✏️ Edit</button>
      <button @click="$emit('delete', id)">🗑 Delete</button>
    </div>
  </div>
</template>


<style scoped>
.todo-card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  background: white;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: 0.2s;
} 

.todo-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* completed */
.todo-card.completed {
  opacity: 0.6;
  text-decoration: line-through;
}

/* header */
.todo-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.title {
  flex: 1;
  font-size: 16px;
  font-weight: 600;
}

/* description */
.description {
  color: #6b7280;
  font-size: 14px;
}

/* meta */
.todo-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #9ca3af;
}

.overdue {
  color: red;
  font-weight: bold;
}

/* priority */
.priority {
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 12px;
}

.priority-low {
  background: #e0f2fe;
  color: #0369a1;
}

.priority-medium {
  background: #fef9c3;
  color: #92400e;
}

.priority-high {
  background: #fee2e2;
  color: #991b1b;
}

/* actions */
.todo-actions {
  display: flex;
  gap: 10px;
}

.todo-actions button {
  cursor: pointer;
  border: none;
  background: transparent;
  font-size: 14px;
}
</style>