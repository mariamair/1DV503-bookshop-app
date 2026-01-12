<script setup>
  defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>

<template>
  <button type="button" class="nav-button">{{ title }}</button>
</template>

<style scoped>
.nav-button {
  margin: 0 0.5rem;
}
</style>