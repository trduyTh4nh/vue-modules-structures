<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    headers: any[];
    data: any[];
    loading: boolean;
    itemsPerPage: number;
    serverItems: any[];
    totalItems: number;
    search: string;
  }>(),
  {
    loading: false,
    itemsPerPage: 5,
  },
);

defineEmits(["update:options"]);


</script>

<template>
  <v-data-table-server
    :items-per-page="itemsPerPage"
    :headers="headers"
    :items="serverItems"
    :items-length="totalItems"
    :loading="loading"
    :search="search"
    item-value="name"
    @update:options="$emit('update:options', $event)"
  ></v-data-table-server>
</template>

<style scoped></style>
