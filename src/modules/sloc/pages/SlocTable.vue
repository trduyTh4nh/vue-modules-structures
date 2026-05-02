<script setup lang="ts">
import { onMounted, ref } from "vue";

const props = withDefaults(
  defineProps<{
    headers: any[];
    items: any[];
    loading: boolean;
    itemsPerPage: number;
    totalItems: number;
  }>(),
  {
    loading: false,
    itemsPerPage: 5,
  },
);

const emit = defineEmits<{
  (
    e: "update:options",
    value: {
      page: number;
      itemsPerPage: number;
      sortBy: any[];
    },
  ): void;
}>();

const emitOptions = () => {
  const emitData = {
    page: page.value,
    itemsPerPage: localItemsPerPage.value,
    sortBy: sortBy.value,
  };
  console.log("data emit: ", {
    ...emitData,
    items: props.items,
    total: props.totalItems,
  });
  emit("update:options", emitData);
};

onMounted(() => {
  emitOptions();
});

const page = ref(1);
const localItemsPerPage = ref(props.itemsPerPage);
const sortBy = ref<any[]>([]);

const nextPage = () => {
  const hasNext = page.value * localItemsPerPage.value === props.totalItems;
  if (!hasNext) {
    page.value++;
    emitOptions();
  }
};

const prevPage = () => {
  if (page.value > 1) {
    page.value--;
    emitOptions();
  }
};

const changeItemsPerPage = (e: Event) => {
  const value = Number((e.target as HTMLSelectElement).value);
  localItemsPerPage.value = value;
  page.value = 1;
  emitOptions();
};

const toggleSort = (key: string) => {
  const current = sortBy.value[0];

  if (!current || current.key !== key) {
    sortBy.value = [{ key, order: "asc" }];
  } else {
    sortBy.value = [
      {
        key,
        order: current.order === "asc" ? "desc" : "asc",
      },
    ];
  }

  emitOptions();
};
</script>

<template>
  <table>
    <tr>
      <th
        class="header"
        v-for="value in headers"
        :key="value.key"
        @click="value.sortable && toggleSort(value.key)"
      >
        {{ value.title }} {{ value.sortable === true ? "⬆️" : "⬇️" }}
      </th>
    </tr>

    <tr v-for="item in items" :key="item.id">
      <td v-for="value in headers">{{ item[value.key] }}</td>
    </tr>

    <tr>
      <div class="wrap-footer-table">
        <div class="footer-page-function">
          <button @click="prevPage"><</button>
          <div class="footer-limit">
            <select name="" @change="changeItemsPerPage" id="">
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </select>
            <button @click="nextPage">></button>
          </div>
        </div>
      </div>
    </tr>
  </table>
</template>

<style lang="css" scoped>
.footer-page-function {
  display: flex;
}
</style>
