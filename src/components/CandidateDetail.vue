<script setup>
import { ref, watch } from 'vue'
import { allowedNext } from '../composables/useCandidates.js'

const props = defineProps({ candidate: Object, history: Array })
const emit = defineEmits(['edit', 'delete', 'change-status'])

const nextStatus = ref('')
const comment = ref('')
watch(() => props.candidate, () => { nextStatus.value = ''; comment.value = '' })

function fmt(value) {
  return value ? new Date(value).toLocaleString('ru-RU') : ''
}

function submitStatus() {
  emit('change-status', nextStatus.value, comment.value)
  nextStatus.value = ''
  comment.value = ''
}
</script>

<template>
  <div class="panel" v-if="candidate">
    <div class="detail-head">
      <strong>{{ candidate.name }}</strong>
      <span class="pill">{{ candidate.status }}</span>
    </div>
    <p class="muted">
      {{ candidate.id }} · {{ candidate.email }} · создан {{ fmt(candidate.createdAt) }}, обновлён {{ fmt(candidate.updatedAt) }}
    </p>

    <div class="actions">
      <button class="ghost" @click="$emit('edit')">Редактировать</button>
      <button class="danger" @click="$emit('delete')">Удалить</button>
    </div>

    <div class="status-change">
      <div class="field">
        <label>Новый статус</label>
        <select v-model="nextStatus" :disabled="allowedNext(candidate.status).length === 0">
          <option value="">—</option>
          <option v-for="s in allowedNext(candidate.status)" :key="s">{{ s }}</option>
        </select>
      </div>
      <div class="field grow"><label>Комментарий</label><input v-model="comment" /></div>
      <button :disabled="!nextStatus" @click="submitStatus">Сменить статус</button>
    </div>
    <p v-if="allowedNext(candidate.status).length === 0" class="muted">
      Статус финальный, дальнейшие переходы недопустимы.
    </p>

    <div class="history">
      <label>История статусов</label>
      <p v-if="history.length === 0" class="muted">изменений ещё не было</p>
      <div v-for="h in history" :key="h.id" class="hist-item">
        <span>{{ h.fromStatus }} → {{ h.toStatus }}</span>
        <span class="muted">{{ fmt(h.changedAt) }}</span>
        <span v-if="h.comment" class="muted">{{ h.comment }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail-head { display: flex; align-items: center; gap: 10px; }
.actions { display: flex; gap: 8px; margin: 10px 0; }
.status-change { display: flex; gap: 10px; align-items: end; flex-wrap: wrap; margin-top: 6px; }
.field { display: flex; flex-direction: column; gap: 4px; min-width: 140px; }
.field.grow { flex: 1; }
.history { margin-top: 16px; }
.hist-item { display: flex; gap: 10px; padding: 6px 0; border-bottom: 1px solid var(--border); font-size: 13px; flex-wrap: wrap; }
</style>
