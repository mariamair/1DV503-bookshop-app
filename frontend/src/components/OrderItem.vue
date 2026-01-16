<script setup>
import { ordersApiUrl } from '@/utils/api'
import { inject, onMounted, ref } from 'vue'

defineProps({
  totalAmount: {
    type: Number,
    required: true,
  },
})
const emit = defineEmits(['update:orderNumber'])
const reportError = inject('reportError')
const loading = ref(false)
const order = ref(null)

const createOrder = async () => {
  const response = await fetch(`${ordersApiUrl}`, {
    method: 'POST',
    credentials: 'include'
  })

  const data = await response.json()
  if (!response.ok) {
    throw data
  }

  emit('update:orderNumber', data.orderNumber)
  return data.orderNumber
}

const fetchOrder = async (orderNumber) => {
  const response = await fetch(
    `${ordersApiUrl}/${orderNumber}`,
    {
      method: 'GET',
      credentials: 'include'
    }
  )

  const data = await response.json()
        if (!response.ok) {
        throw data
      }

  order.value = data
}

onMounted(async () => {
  try {
    loading.value = true
    const orderNumber = await createOrder()
    await fetchOrder(orderNumber)
  } catch (error) {
    reportError(error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="container">
    <h3 v-if="order">Invoice for order #{{ order.ono }}</h3>

    <p v-if="loading">Creating order…</p>

    <div v-if="order" id="order-information">
      <div id="address">
        <h4>Shipping address</h4>
        <p>{{ order.fname }} {{ order.lname }}</p>
        <p>{{ order.shipAddress }}</p>
        <p>{{ order.shipZip }} {{ order.shipCity }}</p>
      </div>
      <div id="delivery">
        <h4>Delivery date</h4>
        <p>{{ order.deliveryDate }}</p>
        <h4>Total amount</h4>
        <p>{{ totalAmount.toFixed(2) }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
  h4 {
    color: var(--color-text-dark-on-light);
    font-weight: bold;
  }

  p {
    color: var(--color-text-dark-on-light);
  }

  p ~ h4 {
    margin-top: 0.5rem;
  }
  
  #order-information {
    background-color: var(--color-background-light);
    padding: 1rem;
    margin-bottom: 2rem;
    display: flex;
    flex-direction: row;
    gap: 3rem;
  }
</style>

