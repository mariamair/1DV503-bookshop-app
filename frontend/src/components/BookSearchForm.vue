<script setup>
  import { booksApiUrl } from '@/utils/api'
  import { inject, onMounted, ref } from 'vue'

  const emit = defineEmits(['search',])
  const reportError = inject('reportError')
  const subjects = ref([])
  const subject = ref('')
  const title = ref('')
  const author = ref('')
  const lastSearchParams = ref({})
  const books = ref([])
  const numberOfResults = ref(0)
  const loading = ref(true)
  const props = defineProps({
    resultLimit: {
      type: Number,
      default: 5
    },
    page: {
      type: Number,
      default: 1
    }
  })

  const fetchSubjects = async () => {
    try {
      loading.value = true

      const response = await fetch(`${booksApiUrl}/subjects`)
      const data = await response.json()

      if (!response.ok) {
        throw data
      }

      // Create a new array from fetched data
      subjects.value = [...data] 
    } catch (error) {
      reportError(error)
    } finally {
      loading.value = false
    }
  }

  const performSearch = async (pageNumber) => {
   await fetchBooks(lastSearchParams.value, pageNumber)
    emit('search', { 
      books: books.value,
      numberOfResults: numberOfResults.value,
      currentPage: pageNumber
    })
  }

  const fetchBooks = async (searchParams = {}, page = 1) => {
    try {
      loading.value = true
      const offset = (page - 1) * props.resultLimit
      
      const params = new URLSearchParams()
      params.append('offset', offset)
      params.append('limit', props.resultLimit)

      if (searchParams.subject) {
        params.append('subject', searchParams.subject)
      }
      if (searchParams.title) {
        params.append('title', searchParams.title)
      }
      if (searchParams.author) {
        params.append('author', searchParams.author)
      }

      const response = await fetch(`${booksApiUrl}?${params}`)
      const data = await response.json()

      if (!response.ok) {
        if (data.statusCode === 404) {
          books.value = [] 
          numberOfResults.value = 0
          return
        } else {
          throw data
        }
      }

      // Create a new array from fetched data
      books.value = [...data.results] 
      numberOfResults.value = data.rowCount

    } catch (error) {
      reportError(error)
    } finally {
      loading.value = false
    }
  }

  const onSubmit = async () => {
    lastSearchParams.value = {
      subject: subject.value,
      title: title.value,
      author: author.value
    }
    await performSearch(props.page)
/*     // Clear form after submit
    title.value = ''  
    author.value = ''   */
  }

  const resetSearchForm = () => {
    title.value = ''  
    author.value = ''
  }

  onMounted(() => {
    fetchSubjects()
  })

  defineExpose({performSearch})
</script>

<template>
  <slot name="heading"></slot>
  <form 
    v-on:submit.prevent="onSubmit"
  >
      <label for="subject">Subject</label>
      <select 
        v-model="subject" 
        v-on:change="resetSearchForm"
        id="subject"
      >
        <option value="">--Select a subject--</option>
        <option 
          v-for="subject in subjects" 
          :key="subject.subject"
          :value="subject.subject"
        >
          {{ subject.subject }}
      </option>
    </select>
    <label for="title">Title</label>
    <input v-model="title" type="text" id="title" placeholder="Search for a title">
    <label for="author">Author</label>
    <input v-model="author" type="text" id="author" placeholder="Search for an author (first name)">
    <button type="submit" :disabled="!subject && !title && !author">Search</button>
  </form>
</template>
