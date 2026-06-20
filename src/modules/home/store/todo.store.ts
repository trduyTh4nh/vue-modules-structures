import { defineStore } from "pinia";
import { computed, ref } from "vue";

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export const dataTodoSample: Todo[] = [
  {
    id: "1",
    title: "Learn Vue 3 Composition API",
    description: "Understand ref, reactive, computed, watch",
    completed: false,
    priority: "high",
    dueDate: "2026-06-01",
    createdAt: "2026-05-01",
    updatedAt: "2026-05-01",
  },
  {
    id: "2",
    title: "Build reusable table component",
    description: "Support pagination + sorting + emit options",
    completed: true,
    priority: "high",
    dueDate: "2026-05-10",
    createdAt: "2026-05-01",
    updatedAt: "2026-05-02",
  },
  {
    id: "3",
    title: "Setup Vue project structure",
    completed: true,
    priority: "medium",
    createdAt: "2026-04-28",
    updatedAt: "2026-04-29",
  },
  {
    id: "4",
    title: "Integrate API with Axios",
    description: "Add interceptor + error handling",
    completed: false,
    priority: "high",
    createdAt: "2026-05-02",
    updatedAt: "2026-05-02",
  },
  {
    id: "5",
    title: "Write unit tests",
    completed: false,
    priority: "low",
    createdAt: "2026-05-02",
    updatedAt: "2026-05-02",
  },
];

export type TodoStatus = "all" | "completed" | "pending";

export const useTodoStore = defineStore("todo", () => {
  const todos = ref<Todo[]>([...dataTodoSample]);
  const filterStatus = ref<TodoStatus>("all");

  const getTodos = computed(() => {
    if (filterStatus.value === "completed") {
      return todos.value.filter((todo) => todo.completed === true);
    }
    if (filterStatus.value === "pending") {
      return todos.value.filter((todo) => todo.completed === false);
    }
    return todos.value;
  });

  const toggleTodo = (id: string) => {
    const todo = todos.value.find((todo) => todo.id === id);

    if (!todo) return;
    todo.completed = !todo.completed;
    todo.updatedAt = new Date().toISOString();
  };

  const updateTodo = (id: string, payload: Partial<Todo>) => {
    const index = todos.value.findIndex((todo) => todo.id === id);
    if (index === -1) return;

    // ✅ splice đảm bảo Vue detect mutation
    todos.value.splice(index, 1, {
      ...todos.value[index],
      ...payload,
      updatedAt: new Date().toISOString(),
    });
  };

  const deleteTodo = (id: string) => {
    todos.value = todos.value.filter((todo) => todo.id !== id);
    console.log("todo deleted: ", todos.value);
  };

  const createTodo = (todo: Omit<Todo, "id" | "createdAt" | "updatedAt">) => {
    const newTodo = {
      ...todo,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    todos.value.unshift(newTodo);
  };

  return {
    todos,
    getTodos,
    toggleTodo,
    updateTodo,
    deleteTodo,
    createTodo,
    filterStatus,
  };
});
