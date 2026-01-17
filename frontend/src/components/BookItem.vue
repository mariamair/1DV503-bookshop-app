<script setup>
import BookIcon from './icons/IconBook.vue'
import { ref } from 'vue'

const emit = defineEmits(['add-to-cart'])
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  isbn: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
})

const quantity = ref(1)

const onSubmit = async () => {
  emit('add-to-cart', {
    isbn: props.isbn,
    quantity: quantity.value
  })
}

</script>
<template>
  <div class="book-item">
    <i>
      <BookIcon/>
    </i>
    <div class="details">
      <h3>{{ title }}</h3>
      <p>Author: {{ author }}</p>
      <p>ISBN: {{ isbn }}</p>
      <p>Subject: {{ subject }}</p>
      <p class="price">Price: {{ price.toFixed(2) }}</p>
      <form v-on:submit.prevent="onSubmit" class="add-item-form">
        <input type="number" min="1" max="100" v-model="quantity">
        <button type="submit">Add to cart</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.book-item {
  margin-top: 1rem;
  padding: 0.8rem;
  display: flex;
  position: relative;
  border: var(--border-width) var(--border-style) var(--border-color);
  border-radius: var(--border-radius);
  min-width: 450px;
}

.details {
  flex: 1;
  margin-left: 1rem;
  min-width: calc(450px - 30px);
}

.price {
  font-weight: bold;
  color: var(--color-heading-2);
}

i {
  display: flex;
  place-items: center;
  place-content: center;
  width: 32px;
  height: 32px;
  color: var(--color-text);
}

p {
  font-size: 1rem;
  color: var(--color-text)
}

.add-item-form {
  border: none;
  padding: 0;
}

.add-item-form > * {
  width: min-content;
  white-space: nowrap;
}
</style>
