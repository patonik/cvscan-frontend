<script setup>
import { onMounted, ref } from 'vue'
import { useCandidates, STATUSES } from './composables/useCandidates.ts'
import ErrorBanner from './components/ErrorBanner.vue'
import CandidateFilters from './components/CandidateFilters.vue'
import CandidateTable from './components/CandidateTable.vue'
import CandidateForm from './components/CandidateForm.vue'
import CandidateDetail from './components/CandidateDetail.vue'

const c = useCandidates()
const formOpen = ref(false)
const editing = ref(null)

function openCreate() { editing.value = null; formOpen.value = true }
function openEdit() { editing.value = c.selected.value; formOpen.value = true }

async function onSubmitForm(payload) {
  const ok = await c.save(payload)
  if (ok) formOpen.value = false
}

function onSearch() { c.page.value = 0; c.loadList() }
function onPrev() { c.page.value--; c.loadList() }
function onNext() { c.page.value++; c.loadList() }

async function onDelete() {
  if (!c.selected.value) return
  if (!confirm(`Удалить кандидата ${c.selected.value.id}?`)) return
  await c.remove(c.selected.value.id)
}

onMounted(c.loadList)
</script>

<template>
  <div id="layout">
    <header>
      <h1>Candidate Service</h1>
      <p class="muted">CV-Scan · управление кандидатами</p>
    </header>

    <ErrorBanner :error="c.error.value" />

    <CandidateFilters :filters="c.filters" :statuses="STATUSES" @search="onSearch" @create="openCreate" />

    <CandidateTable
      :list="c.list.value"
      :loading="c.loading.value"
      :total-elements="c.totalElements.value"
      :total-pages="c.totalPages.value"
      :page="c.page.value"
      :selected-id="c.selected.value && c.selected.value.id"
      @select="c.select"
      @prev="onPrev"
      @next="onNext"
    />

    <CandidateForm v-if="formOpen" :editing="editing" @submit="onSubmitForm" @cancel="formOpen = false" />

    <CandidateDetail
      v-if="c.selected.value"
      :candidate="c.selected.value"
      :history="c.history.value"
      @edit="openEdit"
      @delete="onDelete"
      @change-status="(status, comment) => c.patchStatus(c.selected.value.id, status, comment)"
    />
  </div>
</template>
