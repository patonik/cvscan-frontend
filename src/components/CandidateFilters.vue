<script setup>
defineProps({ filters: Object, statuses: Array })
defineEmits(['search', 'create'])
</script>

<template>
  <div class="panel filters">
    <div class="field">
      <label for="f-verdict">Вердикт</label>
      <select id="f-verdict" v-model="filters.verdict">
        <option value="">Все</option>
        <option>FIT</option>
        <option>PARTIAL</option>
        <option>NO_FIT</option>
      </select>
    </div>
    <div class="field">
      <label for="f-status">Статус</label>
      <select id="f-status" v-model="filters.status">
        <option value="">Все</option>
        <option v-for="s in statuses" :key="s">{{ s }}</option>
      </select>
    </div>
    <div class="field">
      <label for="f-position">Позиция</label>
      <input id="f-position" v-model="filters.position" placeholder="java-middle" />
    </div>
    <div class="field">
      <label for="f-search">Имя содержит</label>
      <input id="f-search" v-model="filters.search" @keyup.enter="$emit('search')" />
    </div>
    <div class="field">
      <label for="f-sort">Сортировка</label>
      <select id="f-sort" v-model="filters.sort">
        <option value="createdAt,desc">Создан ↓</option>
        <option value="createdAt,asc">Создан ↑</option>
        <option value="name,asc">Имя ↑</option>
        <option value="name,desc">Имя ↓</option>
        <option value="totalExp,asc">Опыт ↑</option>
        <option value="totalExp,desc">Опыт ↓</option>
      </select>
    </div>
    <div class="field size">
      <label for="f-size">На странице</label>
      <input id="f-size" type="number" min="1" v-model.number="filters.size" />
    </div>
    <div class="actions">
      <button @click="$emit('search')">Искать</button>
      <button class="ghost" @click="$emit('create')">Новый кандидат</button>
    </div>
  </div>
</template>

<style scoped>
.filters { display: flex; gap: 10px; flex-wrap: wrap; align-items: end; }
.field { display: flex; flex-direction: column; gap: 4px; min-width: 140px; flex: 1; }
.field.size { max-width: 90px; flex: 0 0 90px; }
.actions { display: flex; gap: 8px; }
</style>
