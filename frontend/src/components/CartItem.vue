<script setup>
  defineProps({
    isbn: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    subtotal: {
      type: Number,
      required: true
    },
  })

</script>
<template>
  <tr class="row">
    <td>{{ isbn }}</td>
    <td>{{ title }}</td>
    <td class="price">{{ price.toFixed(2) }}</td>
    <td class="quantity">{{ quantity }}</td>
    <td class="subtotal">{{ subtotal.toFixed(2) }}</td>
  </tr>
</template>

<style scoped>
  td {
    padding: 0.5rem 1rem;
  }

  .price {
    text-align: right;
  }

  .quantity {
    text-align: center;
  }

  .subtotal {
    font-weight: bold;
    text-align: right;
  }
</style>
