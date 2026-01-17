<script setup>
defineProps({
  message: {
    type: String,
    required: true,
  }
})
</script>

<template>
  <div class="info-display">
    <p>{{ message }}</p>
  </div>
</template>

<style scoped>
.info-display {
  background-color: var(--color-background-info);
  margin: 1rem 0;
  padding: 0.8rem 1.5rem;
  border: var(--border-width) var(--border-style) var(--color-border-dark);
  border-radius: var(--border-radius);
}

p {
  font-size: 1rem;
  color: var(--color-text-dark-on-light)
}
</style>
