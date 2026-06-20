<script setup lang="ts">
import { onMounted } from 'vue'
import { useProjectList } from '../useProjectList'
import type { RowspanHeader } from './AppDataTable.vue'
import AppDataTable from './AppDataTable.vue'
import AppDataTable2 from './AppDataTable2.vue'


const { items, loading, total, page, limit, fetchProject } = useProjectList()

const headers: RowspanHeader[] = [
  { title: 'Title',           key: 'title',           align: 'start', rowspan: true },
  { title: 'Slug',            key: 'slug',            align: 'start', rowspan: true },
  { title: 'Comment Content', key: 'comment_content', align: 'start' },
]

onMounted(() => fetchProject())
</script>

<template>
  <!-- <AppDataTable
    :headers="headers"
    :items="items"
    :loading="loading"
    :total-items="total"
    :page="page"
    :items-per-page="limit"
    group-key="groupId"
    group-index-key="groupIndex"
    group-total-key="groupTotal"
    @update:page="page = $event; fetchProject()"
    @update:items-per-page="limit = $event; fetchProject()"
  /> -->


<AppDataTable2
  :headers="headers"
  :items="items"
  :loading="loading"
  :total-items="total"
  :page="page"
  :items-per-page="limit"
  :show-select="true"
  group-key="groupId"
  group-index-key="groupIndex"
  group-total-key="groupTotal"
  @update:page="page = $event; fetchProject()"
  @update:items-per-page="limit = $event; fetchProject()"

>
  <template #rowspan.title="{ item }">
    <span class="font-weight-bold">{{ item.title }}</span>
  </template>

  <template #item.comment_status="{ item }">
    <v-chip size="small" color="warning">{{ item.comment_status }}</v-chip>
  </template>
</AppDataTable2> 
  

</template>