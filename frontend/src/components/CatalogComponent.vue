<script setup>
  import BookSearchForm from './BookSearchForm.vue'
  import BookList from './BookList.vue'
  import BookItem from './BookItem.vue'
  import PaginationControls from './PaginationControls.vue'
  import { cartApiUrl } from '@/utils/api'
  import { computed, inject, ref } from 'vue'

  const reportError = inject('reportError')
  const reportSuccess = inject('reportSuccess')

  const searchFormHeading = ref('Browse our catalog')
  const searchFormRef = ref(null)
  const bookListHeading = ref('Search results')
  const books = ref([])
  const numberOfResults = ref(0)
  const limit = ref(5)
  const currentPage = ref(1)
  const loading = ref(true)
  const hasSearched = ref(false)
  const selectedItems = ref([])

  const handleSearchResults = (results) => {
    currentPage.value = results.currentPage
    books.value = results.books,
    numberOfResults.value = results.numberOfResults,
    hasSearched.value = true
    loading.value = false
  }

  const totalPages = computed(() => {
    return Math.ceil(numberOfResults.value / limit.value)
  })

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages.value) {
      currentPage.value = pageNumber
      searchFormRef.value.performSearch(pageNumber)
    }
  }

  const addToCart = (selection) => {
    selectedItems.value = selection
    saveToCart(selectedItems.value)
  }

  const saveToCart = async (selection) => {
    try {
      const response = await fetch(`${cartApiUrl}/`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isbn: selection.isbn,
          quantity: selection.quantity,
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw data
      }

      reportSuccess({ message: 'Item saved to cart.'})
    } catch (error) {
      reportError(error)
    } 
  }
</script>

<template>
  <BookSearchForm
    ref="searchFormRef"
    @search="handleSearchResults"
  >
    <template #heading>
      <h2>{{ searchFormHeading }}</h2>
    </template>
  </BookSearchForm>
  <BookList 
    v-if="hasSearched"
  >
    <template #heading>
      <h2>{{ bookListHeading }}</h2>
      <p v-if="books.length">Found {{ numberOfResults }} results</p>
    </template>
    <template #pagination>
      <PaginationControls 
        v-if="hasSearched && totalPages > 0"
        :current-page="currentPage"
        :total-pages="totalPages"
        @go-to-page="goToPage"
      />
    </template>
    <template #book-item>
      <div v-if="loading">Loading...</div>
      <div v-else-if="books.length === 0">No books found</div>
      <div v-else class="books-list">
        <BookItem
          v-for="book in books"
          :key="book.isbn"
          :isbn="book.isbn"
          :title="book.title"
          :author="book.author"
          :subject="book.subject"
          :price="book.price"
          @add-to-cart="addToCart"
        />
      </div>
    </template>
  </BookList>
</template>

<style scoped>
  div {
    color: var(--color-text-light-on-dark);
  }
</style>