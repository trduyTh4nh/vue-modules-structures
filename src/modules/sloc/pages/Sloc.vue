<script setup lang="ts">
import { onMounted, ref } from "vue";
import SlocTable from "./SlocTable.vue";

const desserts = [
  {
    name: "Frozen Yogurt",
    calories: 159,
    fat: 6,
    carbs: 24,
    protein: 4,
    iron: "1",
  },
  {
    name: "Jelly bean",
    calories: 375,
    fat: 0,
    carbs: 94,
    protein: 0,
    iron: "0",
  },
  {
    name: "KitKat",
    calories: 518,
    fat: 26,
    carbs: 65,
    protein: 7,
    iron: "6",
  },
  {
    name: "Eclair",
    calories: 262,
    fat: 16,
    carbs: 23,
    protein: 6,
    iron: "7",
  },
  {
    name: "Gingerbread",
    calories: 356,
    fat: 16,
    carbs: 49,
    protein: 3.9,
    iron: "16",
  },
  {
    name: "Ice cream sandwich",
    calories: 237,
    fat: 9,
    carbs: 37,
    protein: 4.3,
    iron: "1",
  },
  {
    name: "Lollipop",
    calories: 392,
    fat: 0.2,
    carbs: 98,
    protein: 0,
    iron: "2",
  },
  {
    name: "Cupcake",
    calories: 305,
    fat: 3.7,
    carbs: 67,
    protein: 4.3,
    iron: "8",
  },
  {
    name: "Honeycomb",
    calories: 408,
    fat: 3.2,
    carbs: 87,
    protein: 6.5,
    iron: "45",
  },
  {
    name: "Donut",
    calories: 452,
    fat: 25,
    carbs: 51,
    protein: 4.9,
    iron: "22",
  },{
    name: "Donut",
    calories: 452,
    fat: 25,
    carbs: 51,
    protein: 4.9,
    iron: "22",
  },
];

const headers = ref([
  {
    title: "Dessert (100g serving)",
    align: "start",
    sortable: true,
    key: "name",
  },
  { title: "Calories", key: "calories", align: "end" },
  { title: "Fat (g)", key: "fat", align: "end" },
  { title: "Carbs (g)", key: "carbs", align: "end" },
  { title: "Protein (g)", key: "protein", align: "end" },
  { title: "Iron (%)", key: "iron", align: "end" },
]);

interface Dessert {
  name: string;
  calories: number;
  fat: number;
  carbs: number;
  protein: number;
  iron: string;
}

type SortItem = {
  key: keyof Dessert;
  order: "asc" | "desc";
};

interface FakeParams {
  page: number;
  items_page: number;
  sort_by: SortItem[];
}
const FakeApi = {
  async fetch({ page, items_page, sort_by }: FakeParams) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const start = (page - 1) * items_page;
        const end = start + items_page;
        const items = desserts.slice();

        if (sort_by.length > 0) {
          const { key, order } = sort_by[0];
          items.sort((a, b) => {
            const aValue = a[key];
            const bValue = b[key];

            if (typeof aValue === "number" && typeof bValue === "number") {
              return order === "desc" ? bValue - aValue : aValue - bValue;
            }

            return String(aValue).localeCompare(String(bValue));
          });
        }
        const paginated = items.slice(start, end === -1 ? undefined : end);
        resolve({ items: paginated, total: items.length });
      }, 500);
    });
  },
};

const severItems = ref([]);
const itemsPerPage = ref(5);
const loading = ref(false);
const totalItems = ref(0);

interface TableOptions {
  page: number;
  itemsPerPage: number;
  sortBy: SortItem[];
}

const loadItems = async ({ page, itemsPerPage, sortBy } : TableOptions) => {
  loading.value = true;

  const res: any = await FakeApi.fetch({
    page,
    items_page: itemsPerPage,
    sort_by: sortBy,
  });

  severItems.value = res.items;
  totalItems.value = res.total;

  loading.value = false;
};

</script>

<template>
  <div>
    <h1>Sloc</h1>
    <SlocTable
      :headers="headers"
      :items="severItems"
      :items-per-page="itemsPerPage"
      :loading="loading"
      :total-items="totalItems"
      @update:options="loadItems"
    />
  </div>
</template>
