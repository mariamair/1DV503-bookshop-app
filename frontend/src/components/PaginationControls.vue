<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['go-to-page'])

const pageButtons = computed(() => {
  const pages = []
  const maxButtons = 5
  const halfRange = Math.floor(maxButtons / 2)
  
  let start = Math.max(1, props.currentPage - halfRange)
  let end = Math.min(props.totalPages, props.currentPage + halfRange)
  
  if (end - start < maxButtons - 1) {
    if (start === 1) {
      end = Math.min(props.totalPages, start + maxButtons - 1)
    } else {
      start = Math.max(1, end - maxButtons + 1)
    }
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

const goToPage = (pageNumber) => {
  if (pageNumber >= 1 && pageNumber <= props.totalPages) {
    emit('go-to-page', pageNumber)
  }
}
</script>

<template>
  <div v-if="totalPages > 0">
    <p>Page {{ currentPage }} of {{ totalPages }}</p>
    <div>
      <button 
        class="control-button" 
        @click="goToPage(1)" :disabled="currentPage === 1"
      >
        First
      </button>

      <button 
        class="control-button" 
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage === 1"
      >
        Previous
      </button>
      
      <button 
        v-for="page in pageButtons"
        :key="page"
        @click="goToPage(page)"
        :class="{ active: page === currentPage }"
      >
        {{ page }}
      </button>
      
      <button 
        class="control-button" 
        @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages"
      >
        Next
      </button>

      <button 
        class="control-button" 
        @click="goToPage(totalPages)" 
        :disabled="currentPage === totalPages"
      >
        Last
      </button>
    </div>
  </div>
</template>

<style scoped>
  button {
    border: 
      var(--bookshop-grey) 
      var(--border-width) 
      var(--border-style);
    margin: 0.1rem;
  }
  
  button.active {
    background-color: var(--bookshop-olive-green);
    color: white;
  }

  .control-button {
    background-color: var(--color-background-light);
    border: 
      var(--bookshop-grey) 
      var(--border-width) 
      var(--border-style);
  }

  .control-button:hover {
    background-color: var(--color-hover-background);
  }

  .control-button:disabled {
    background-color: #ccc;
  }
</style>