<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({ editing: Object })
const emit = defineEmits(['submit', 'cancel'])

function blank() {
  return {
    id: null, name: '', email: '', phone: '', position: '', posLabel: '', city: '',
    telegram: '', totalExp: '', stack: '', education: '', verdict: 'FIT', summary: '',
    criteria: [], experience: [], questions: []
  }
}

const form = reactive(blank())

watch(
  () => props.editing,
  (candidate) => {
    Object.assign(form, blank())
    if (candidate) {
      Object.assign(form, candidate)
      // shallow-copy the nested arrays so editing here never mutates the selected candidate
      // shown in the detail panel until Save actually round-trips through the API
      form.criteria = (candidate.criteria || []).map((x) => ({ ...x }))
      form.experience = (candidate.experience || []).map((x) => ({ ...x }))
      form.questions = [...(candidate.questions || [])]
    }
  },
  { immediate: true }
)

function addCriteria() { form.criteria.push({ key: '', result: 'OK', comment: '' }) }
function addExperience() { form.experience.push({ period: '', company: '', title: '', duration: '' }) }
function addQuestion() { form.questions.push('') }

function submit() {
  emit('submit', {
    ...form,
    criteria: form.criteria.filter((c) => c.key),
    experience: form.experience.filter((e) => e.company || e.title),
    questions: form.questions.filter(Boolean)
  })
}
</script>

<template>
  <div class="panel form">
    <div class="form-head">
      <strong>{{ form.id ? 'Редактирование: ' + form.id : 'Новый кандидат' }}</strong>
      <button class="ghost" @click="$emit('cancel')">Закрыть</button>
    </div>

    <div class="grid">
      <div class="field"><label>Имя *</label><input v-model="form.name" required /></div>
      <div class="field"><label>Email *</label><input v-model="form.email" type="email" required /></div>
      <div class="field"><label>Телефон</label><input v-model="form.phone" placeholder="+996 700 111222" /></div>
      <div class="field"><label>Позиция * (a-z0-9-)</label><input v-model="form.position" required /></div>
      <div class="field"><label>Название позиции</label><input v-model="form.posLabel" /></div>
      <div class="field"><label>Город</label><input v-model="form.city" /></div>
      <div class="field"><label>Telegram</label><input v-model="form.telegram" /></div>
      <div class="field"><label>Опыт</label><input v-model="form.totalExp" placeholder="~3.5 г." /></div>
      <div class="field"><label>Стек</label><input v-model="form.stack" /></div>
      <div class="field"><label>Образование</label><input v-model="form.education" /></div>
      <div class="field">
        <label>Вердикт *</label>
        <select v-model="form.verdict" required>
          <option>FIT</option><option>PARTIAL</option><option>NO_FIT</option>
        </select>
      </div>
    </div>

    <div class="field full"><label>Резюме</label><textarea v-model="form.summary" rows="3" /></div>

    <div class="list-field">
      <div class="list-head"><label>Критерии</label><button class="ghost small" @click="addCriteria">+ строка</button></div>
      <div class="list-row" v-for="(c, i) in form.criteria" :key="i">
        <input v-model="c.key" placeholder="ключ" />
        <select v-model="c.result"><option>OK</option><option>PARTIAL</option><option>NO</option></select>
        <input v-model="c.comment" placeholder="комментарий" />
        <button class="ghost small danger" @click="form.criteria.splice(i, 1)">✕</button>
      </div>
    </div>

    <div class="list-field">
      <div class="list-head"><label>Опыт работы</label><button class="ghost small" @click="addExperience">+ строка</button></div>
      <div class="list-row" v-for="(e, i) in form.experience" :key="i">
        <input v-model="e.period" placeholder="период" />
        <input v-model="e.company" placeholder="компания" />
        <input v-model="e.title" placeholder="должность" />
        <input v-model="e.duration" placeholder="длительность" />
        <button class="ghost small danger" @click="form.experience.splice(i, 1)">✕</button>
      </div>
    </div>

    <div class="list-field">
      <div class="list-head"><label>Вопросы</label><button class="ghost small" @click="addQuestion">+ строка</button></div>
      <div class="list-row" v-for="(q, i) in form.questions" :key="i">
        <input v-model="form.questions[i]" placeholder="вопрос" />
        <button class="ghost small danger" @click="form.questions.splice(i, 1)">✕</button>
      </div>
    </div>

    <div class="actions">
      <button @click="submit">{{ form.id ? 'Сохранить' : 'Создать' }}</button>
    </div>
  </div>
</template>

<style scoped>
.form-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
@media (max-width: 580px) { .grid { grid-template-columns: 1fr; } }
.field { display: flex; flex-direction: column; gap: 4px; }
.field.full { margin-top: 10px; }
.list-field { margin-top: 14px; }
.list-head { display: flex; justify-content: space-between; align-items: center; }
.list-row { display: flex; gap: 6px; margin-top: 6px; align-items: center; }
.list-row input { flex: 1; min-width: 0; }
.list-row select { flex: 0 0 110px; }
.actions { margin-top: 14px; }
button.small { padding: 3px 8px; font-size: 12px; }
</style>
