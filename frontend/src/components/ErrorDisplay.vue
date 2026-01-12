<script setup>
  import ErrorIcon from './icons/IconError.vue';

  defineProps({
    message: {
      type: String,
      required: true,
    },
  })
</script>

<template>
  <div class="error-display">
    <i>
      <ErrorIcon/>
    </i>
    <p>{{ message }}</p>
  </div>
</template>

<style scoped>
.error-display {
  background-color: var(--color-background-alert);
  margin-top: 1rem;
  padding: 0.8rem;
  display: flex;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  min-width: 450px;
}

p {
  font-size: 1rem;
  margin-left: 1rem;
  color: var(--color-text-dark-on-light);
}

i {
  display: flex;
  place-items: center;
  place-content: center;
  width: 32px;
  height: 32px;
  color: var(--color-text-dark-on-light);
}

</style>
