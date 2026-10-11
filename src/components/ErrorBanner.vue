<script setup>
defineProps({ error: Object })
</script>

<template>
  <div v-if="error" class="banner" role="alert">
    <p><strong>{{ error.status }} {{ error.error }}</strong> — {{ error.message }}</p>
    <ul v-if="error.details">
      <li v-for="d in error.details" :key="d.field">{{ d.field }}: {{ d.message }}</li>
    </ul>
  </div>
</template>

<style scoped>
.banner {
  background: var(--danger-bg);
  color: var(--danger-ink);
  border: 1px solid var(--danger);
  border-radius: var(--radius);
  padding: 10px 14px;
  font-size: 13px;
}
.banner p { margin: 0; }
.banner ul { margin: 6px 0 0; padding-left: 18px; }
</style>
