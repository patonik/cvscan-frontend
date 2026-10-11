<script setup>
defineProps({
  list: Array,
  loading: Boolean,
  totalElements: Number,
  totalPages: Number,
  page: Number,
  selectedId: String
})
defineEmits(['select', 'prev', 'next'])

function fmt(value) {
  return value ? new Date(value).toLocaleString('ru-RU') : ''
}
</script>

<template>
  <div class="panel">
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Имя</th><th>Позиция</th><th>Вердикт</th><th>Статус</th><th>Создан</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="c in list" :key="c.id"
            :class="{ selected: c.id === selectedId }"
            @click="$emit('select', c.id)"
          >
            <td class="mono">{{ c.id }}</td>
            <td>{{ c.name }}</td>
            <td>{{ c.position }}</td>
            <td>{{ c.verdict }}</td>
            <td><span class="pill">{{ c.status }}</span></td>
            <td class="mono">{{ fmt(c.createdAt) }}</td>
          </tr>
          <tr v-if="!loading && list.length === 0" class="empty-row">
            <td colspan="6" class="empty">Кандидаты не найдены</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="pager">
      <button class="ghost" :disabled="page <= 0" @click="$emit('prev')">Назад</button>
      <span class="muted">стр. {{ page + 1 }} из {{ Math.max(totalPages, 1) }}, всего {{ totalElements }}</span>
      <button class="ghost" :disabled="page + 1 >= totalPages" @click="$emit('next')">Вперёд</button>
      <span v-if="loading" class="muted">загрузка…</span>
    </div>
  </div>
</template>

<style scoped>
.table-wrap { overflow-x: auto; }
table { border-collapse: collapse; width: 100%; font-size: 13px; }
th, td { text-align: left; padding: 7px 10px; border-bottom: 1px solid var(--border); white-space: nowrap; }
tbody tr:not(.empty-row) { cursor: pointer; }
tbody tr.selected { outline: 2px solid var(--accent); outline-offset: -2px; }
.empty { text-align: center; color: var(--muted); padding: 18px; white-space: normal; }
.pager { display: flex; align-items: center; gap: 10px; margin-top: 10px; flex-wrap: wrap; }
</style>
