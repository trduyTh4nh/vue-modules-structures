<script setup lang="ts">
import { computed, ref, watch } from 'vue'

export interface DataTableHeader {
  title: string
  key: string
  sortable?: boolean
  rowspan?: boolean
  align?: 'start' | 'center' | 'end'
  width?: string
}

type SortOrder = 'asc' | 'desc'
interface SortItem { key: string; order: SortOrder }

const props = withDefaults(
  defineProps<{
    headers: DataTableHeader[]
    items: any[]
    totalItems?: number
    page?: number
    itemsPerPage?: number
    itemsPerPageOptions?: number[]
    loading?: boolean
    showSelect?: boolean
    groupKey?: string
    groupIndexKey?: string
    groupTotalKey?: string
    sortBy?: SortItem[]
    noDataText?: string
  }>(),
  {
    totalItems: 0,
    page: 1,
    itemsPerPage: 10,
    itemsPerPageOptions: () => [10, 25, 50, 100],
    loading: false,
    showSelect: false,
    groupKey: 'groupId',
    groupIndexKey: 'groupIndex',
    groupTotalKey: 'groupTotal',
    sortBy: () => [],
    noDataText: 'No data available',
  }
)

const emit = defineEmits<{
  (e: 'update:page', value: number): void
  (e: 'update:itemsPerPage', value: number): void
  (e: 'update:sortBy', value: SortItem[]): void
  (e: 'selection-change', value: any[]): void
}>()

// ===== SELECTION =====
const selected = ref<any[]>([])
watch(selected, (val) => emit('selection-change', val))

const allSelected = computed(() =>
  props.items.length > 0 &&
  props.items.every(item => selected.value.includes(item[props.groupKey]))
)
const someSelected = computed(() =>
  props.items.some(item => selected.value.includes(item[props.groupKey])) && !allSelected.value
)
const toggleSelectAll = () => {
  if (allSelected.value) {
    selected.value = []
  } else {
    const uniqueKeys = [...new Set(props.items.map(item => item[props.groupKey]))]
    selected.value = uniqueKeys
  }
}
const toggleSelectRow = (val: boolean, key: any) => {
  if (val) selected.value = [...selected.value, key]
  else selected.value = selected.value.filter(s => s !== key)
}
const isSelected = (item: any) => selected.value.includes(item[props.groupKey])

// ===== SORT =====
const internalSortBy = ref<SortItem[]>([...props.sortBy])
watch(() => props.sortBy, (val) => { internalSortBy.value = [...val] })

const toggleSort = (key: string) => {
  const existing = internalSortBy.value.find(s => s.key === key)
  if (!existing) {
    internalSortBy.value = [{ key, order: 'asc' }]
  } else if (existing.order === 'asc') {
    internalSortBy.value = [{ key, order: 'desc' }]
  } else {
    internalSortBy.value = []
  }
  emit('update:sortBy', internalSortBy.value)
}

const getSortIcon = (key: string): 'asc' | 'desc' | null => {
  const s = internalSortBy.value.find(s => s.key === key)
  if (!s) return null
  return s.order
}

const isSorted = (key: string) => internalSortBy.value.some(s => s.key === key)

// ===== PAGINATION =====
const internalPage = ref(props.page)
const internalSize = ref(props.itemsPerPage)

watch(() => props.page, v => { internalPage.value = v })
watch(() => props.itemsPerPage, v => { internalSize.value = v })

const totalPages = computed(() => Math.ceil(props.totalItems / internalSize.value) || 1)
const pageStart = computed(() => props.totalItems === 0 ? 0 : (internalPage.value - 1) * internalSize.value + 1)
const pageEnd = computed(() => Math.min(internalPage.value * internalSize.value, props.totalItems))

const goToPage = (p: number) => {
  if (p < 1 || p > totalPages.value) return
  internalPage.value = p
  emit('update:page', p)
}

const changeSize = (size: number) => {
  internalSize.value = size
  internalPage.value = 1
  emit('update:itemsPerPage', size)
  emit('update:page', 1)
}

// ===== ROWSPAN =====
const isFirstRow = (item: any) => item[props.groupIndexKey] === 0
const getRowspan = (item: any) => item[props.groupTotalKey] ?? 1
const isRowspanCol = (key: string) => props.headers.find(h => h.key === key)?.rowspan === true
</script>

<template>
  <div class="adt-wrapper">

    <!-- Loading bar (top) -->
    <div class="adt-loading-bar" :class="{ 'adt-loading-bar--active': loading }">
      <div class="adt-loading-progress" />
    </div>

    <!-- ===== TABLE ===== -->
    <div class="adt-scroll">
      <table class="adt-table">
        <colgroup>
          <col v-if="showSelect" style="width: 52px;" />
          <col
            v-for="header in headers"
            :key="header.key"
            :style="{ width: header.width ?? `${100 / headers.length}%` }"
          />
        </colgroup>

        <!-- THEAD -->
        <thead class="adt-thead">
          <tr>
            <th v-if="showSelect" class="adt-th adt-th--checkbox">
              <div class="adt-checkbox-wrap">
                <input
                  type="checkbox"
                  class="adt-checkbox"
                  :checked="allSelected"
                  :indeterminate="someSelected"
                  @change="toggleSelectAll"
                />
              </div>
            </th>

            <th
              v-for="header in headers"
              :key="header.key"
              class="adt-th"
              :class="{
                'adt-th--sortable': header.sortable,
                'adt-th--sorted': isSorted(header.key),
                'adt-th--center': header.align === 'center',
                'adt-th--end': header.align === 'end',
              }"
              @click="header.sortable ? toggleSort(header.key) : undefined"
            >
              <div class="adt-th-inner">
                <span class="adt-th-title">{{ header.title }}</span>
                <span v-if="header.sortable" class="adt-sort-icon">
                  <!-- Unsorted -->
                  <svg v-if="!isSorted(header.key)" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 5.83L15.17 9l1.41-1.41L12 3 7.41 7.59 8.83 9 12 5.83zm0 12.34L8.83 15l-1.41 1.41L12 21l4.59-4.59L15.17 15 12 18.17z"/>
                  </svg>
                  <!-- ASC -->
                  <svg v-else-if="getSortIcon(header.key) === 'asc'" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
                  </svg>
                  <!-- DESC -->
                  <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/>
                  </svg>
                </span>
              </div>
            </th>
          </tr>
        </thead>

        <!-- TBODY -->
        <tbody class="adt-tbody">
          <!-- No data -->
          <tr v-if="!loading && !items.length">
            <td :colspan="headers.length + (showSelect ? 1 : 0)" class="adt-td--empty">
              <slot name="no-data">{{ noDataText }}</slot>
            </td>
          </tr>

          <!-- Data rows -->
          <template v-else>
            <tr
              v-for="(item, index) in items"
              :key="index"
              class="adt-tr"
              :class="{ 'adt-tr--selected': isSelected(item) }"
            >
              <!-- Checkbox: rowspan per group -->
              <td
                v-if="showSelect && isFirstRow(item)"
                :rowspan="getRowspan(item)"
                class="adt-td adt-td--checkbox"
              >
                <div class="adt-checkbox-wrap">
                  <input
                    type="checkbox"
                    class="adt-checkbox"
                    :checked="isSelected(item)"
                    @change="(e) => toggleSelectRow((e.target as HTMLInputElement).checked, item[groupKey])"
                  />
                </div>
              </td>
              <template v-else-if="showSelect && !isFirstRow(item)" />

              <!-- Data cells -->
              <template v-for="header in headers" :key="header.key">

                <!-- Rowspan cell: first row only -->
                <td
                  v-if="isRowspanCol(header.key) && isFirstRow(item)"
                  :rowspan="getRowspan(item)"
                  class="adt-td adt-td--rowspan"
                  :class="{
                    'adt-td--center': header.align === 'center',
                    'adt-td--end': header.align === 'end',
                  }"
                >
                  <slot :name="`rowspan.${header.key}`" :item="item">
                    <span class="adt-cell-text">{{ item[header.key] ?? '-' }}</span>
                  </slot>
                </td>

                <!-- Rowspan: skip subsequent -->
                <template v-else-if="isRowspanCol(header.key)" />

                <!-- Normal cell -->
                <td
                  v-else
                  class="adt-td"
                  :class="{
                    'adt-td--center': header.align === 'center',
                    'adt-td--end': header.align === 'end',
                  }"
                >
                  <slot :name="`item.${header.key}`" :item="item">
                    <span class="adt-cell-text">{{ item[header.key] ?? '-' }}</span>
                  </slot>
                </td>

              </template>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <!-- ===== FOOTER ===== -->
    <div class="adt-footer">
      <div class="adt-footer-left">
        <span class="adt-footer-label">Rows per page:</span>
        <select
          class="adt-size-select"
          :value="internalSize"
          @change="changeSize(+($event.target as HTMLSelectElement).value)"
        >
          <option v-for="opt in itemsPerPageOptions" :key="opt" :value="opt">{{ opt }}</option>
        </select>
      </div>

      <div class="adt-footer-right">
        <span class="adt-footer-range">
          {{ pageStart }}–{{ pageEnd }} of {{ totalItems }}
        </span>
        <div class="adt-pagination">
          <!-- First page -->
          <button class="adt-page-btn" :disabled="internalPage <= 1" @click="goToPage(1)" title="First page">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z"/>
            </svg>
          </button>
          <!-- Prev page -->
          <button class="adt-page-btn" :disabled="internalPage <= 1" @click="goToPage(internalPage - 1)" title="Previous page">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z"/>
            </svg>
          </button>
          <!-- Next page -->
          <button class="adt-page-btn" :disabled="internalPage >= totalPages" @click="goToPage(internalPage + 1)" title="Next page">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
            </svg>
          </button>
          <!-- Last page -->
          <button class="adt-page-btn" :disabled="internalPage >= totalPages" @click="goToPage(totalPages)" title="Last page">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* ===== WRAPPER ===== */
.adt-wrapper {
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
  border: thin solid rgba(var(--v-border-color, 0, 0, 0), var(--v-border-opacity, 0.12));
  background: rgb(var(--v-theme-surface, 255, 255, 255));
  color: rgba(var(--v-theme-on-surface, 0, 0, 0), var(--v-high-emphasis-opacity, 0.87));
  font-family: inherit;
  font-size: 0.875rem;
  position: relative;
}

/* ===== LOADING BAR ===== */
.adt-loading-bar {
  position: relative;
  height: 0;
  width: 100%;
  overflow: hidden;
  transition: height 0.2s;
}

.adt-loading-bar--active {
  height: 3px;
}

.adt-loading-progress {
  position: absolute;
  top: 0;
  left: -50%;
  width: 50%;
  height: 100%;
  background: rgb(var(--v-theme-primary, 98, 0, 238));
  animation: adt-progress 1.4s ease-in-out infinite;
}

@keyframes adt-progress {
  0%   { left: -50%; }
  100% { left: 110%; }
}

/* ===== SCROLL ===== */
.adt-scroll {
  width: 100%;
  overflow-x: auto;
}

/* ===== TABLE ===== */
.adt-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

/* ===== THEAD ===== */
.adt-thead {
  background: rgb(var(--v-theme-surface, 255, 255, 255));
}

.adt-th {
  height: 52px;
  padding: 0 16px;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(var(--v-theme-on-surface, 0, 0, 0), var(--v-medium-emphasis-opacity, 0.6));
  white-space: nowrap;
  border-bottom: thin solid rgba(var(--v-border-color, 0, 0, 0), var(--v-border-opacity, 0.12));
  user-select: none;
  vertical-align: middle;
}

.adt-th--checkbox { padding: 0 4px 0 16px; }
.adt-th--sortable { cursor: pointer; }
.adt-th--sortable:hover { background: rgba(var(--v-theme-on-surface, 0, 0, 0), 0.04); }
.adt-th--sorted { color: rgba(var(--v-theme-on-surface, 0, 0, 0), var(--v-high-emphasis-opacity, 0.87)); }
.adt-th--center .adt-th-inner { justify-content: center; }
.adt-th--end .adt-th-inner    { justify-content: flex-end; }

.adt-th-inner {
  display: flex;
  align-items: center;
  gap: 4px;
}

.adt-sort-icon {
  display: flex;
  align-items: center;
  color: rgba(var(--v-theme-on-surface, 0, 0, 0), 0.4);
  transition: color 0.15s;
  flex-shrink: 0;
}

.adt-th--sorted .adt-sort-icon {
  color: rgb(var(--v-theme-primary, 98, 0, 238));
}

/* ===== TR ===== */
.adt-tr { transition: background 0.1s; }

.adt-tr:hover > td {
  background: rgba(var(--v-theme-on-surface, 0, 0, 0), 0.04);
}

.adt-tr--selected > td {
  background: rgba(var(--v-theme-primary, 98, 0, 238), 0.08) !important;
}

/* ===== TD ===== */
.adt-td {
  height: 52px;
  padding: 12px 16px;
  vertical-align: top;
  border-bottom: thin solid rgba(var(--v-border-color, 0, 0, 0), var(--v-border-opacity, 0.12));
  font-size: 0.875rem;
}

.adt-td--checkbox {
  padding: 8px 4px 8px 16px;
  vertical-align: middle;
  width: 52px;
}

.adt-td--rowspan {
  font-weight: 500;
  vertical-align: top;
  border-right: 2px solid rgba(var(--v-theme-primary, 98, 0, 238), 0.15);
}

.adt-td--center { text-align: center; }
.adt-td--end    { text-align: right; }

.adt-td--empty {
  text-align: center;
  padding: 48px 16px;
  color: rgba(var(--v-theme-on-surface, 0, 0, 0), var(--v-medium-emphasis-opacity, 0.6));
  border-bottom: thin solid rgba(var(--v-border-color, 0, 0, 0), var(--v-border-opacity, 0.12));
}

.adt-cell-text {
  display: block;
  word-break: break-word;
}

/* ===== CHECKBOX ===== */
.adt-checkbox-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
}

.adt-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: rgb(var(--v-theme-primary, 98, 0, 238));
}

/* ===== FOOTER ===== */
.adt-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  padding: 0 8px;
  height: 52px;
  font-size: 0.75rem;
  color: rgba(var(--v-theme-on-surface, 0, 0, 0), var(--v-medium-emphasis-opacity, 0.6));
  border-top: thin solid rgba(var(--v-border-color, 0, 0, 0), var(--v-border-opacity, 0.12));
}

.adt-footer-left,
.adt-footer-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.adt-footer-label { white-space: nowrap; }

.adt-size-select {
  background: transparent;
  border: none;
  color: inherit;
  font-size: 0.75rem;
  cursor: pointer;
  padding: 2px 4px;
  outline: none;
}

.adt-footer-range { white-space: nowrap; }

/* ===== PAGINATION ===== */
.adt-pagination {
  display: flex;
  align-items: center;
  gap: 0;
}

.adt-page-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: transparent;
  cursor: pointer;
  color: rgba(var(--v-theme-on-surface, 0, 0, 0), var(--v-medium-emphasis-opacity, 0.6));
  transition: background 0.15s, color 0.15s;
  padding: 0;
}

.adt-page-btn:hover:not(:disabled) {
  background: rgba(var(--v-theme-on-surface, 0, 0, 0), 0.08);
  color: rgba(var(--v-theme-on-surface, 0, 0, 0), var(--v-high-emphasis-opacity, 0.87));
}

.adt-page-btn:disabled {
  opacity: 0.38;
  cursor: default;
}
</style>