<script setup>
  import OrderItem from './OrderItem.vue'
  import CartItem from './CartItem.vue'
  import { cartApiUrl } from '@/utils/api'
  import { computed, inject, onMounted, ref} from 'vue'

  const reportError = inject('reportError')
  const pageHeading = ref('Shopping cart')
  const cart = ref([])
  const total = computed(() => {
    return cart.value.reduce((sum, item) => sum + (item.price * item.qty), 0)
  })

  const loading = ref(false)

  const displayOrderDetails = ref(false)
  const orderNumber = ref(null)

  const fetchCart = async () => {
    try {
      loading.value = true

      const response = await fetch(`${cartApiUrl}`, {
        method: 'GET',
        credentials: 'include'
      })
      const data = await response.json()

      if (!response.ok) {
        throw data
      }

      // Create a new array from fetched data
      if (data) {
        cart.value = [...data] 
      }

    } catch (error) {
      reportError(error)
    } finally {
      loading.value = false
    }
  }

  const calculateSubTotal = (price, quantity) => {
    return price * quantity
  }
    
  const createOrder = () => {
    displayOrderDetails.value = true
    pageHeading.value = 'Order Details'
  }

  onMounted(() => {
    fetchCart()
    pageHeading.value = 'Shopping cart'
    displayOrderDetails.value = false
  })
</script>

<template>
  <h2>{{ pageHeading }}</h2>
  <OrderItem
    v-if="displayOrderDetails"
    v-model:orderNumber="orderNumber"
    :totalAmount="total"
  />
  <table>
    <thead>
      <tr>
        <th>ISBN</th>
        <th>Title</th>
        <th>Price</th>
        <th>Quantity</th>
        <th>Sub total</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="loading">
        <td>Loading...</td>
      </tr>
      <tr v-else-if="cart.length === 0">
        <td class="alert">No items in cart</td>
      </tr>
      <CartItem class="cart-item" v-else
          v-for="item in cart"
          :key="item.isbn"
          :isbn="item.isbn"
          :title="item.title"
          :price="item.price"
          :quantity="item.qty"
          :subtotal="calculateSubTotal(item.price, item.qty)"
      />
    </tbody>
  </table>
  <div v-if="!displayOrderDetails && cart.length !== 0">
    <p>Total: <span>{{ total.toFixed(2) }}</span></p>
    <button name="check-out" type="submit" @click="createOrder">Check out</button>
  </div>
</template>

<style scoped>
  table {
    margin-bottom: 1.5rem;
    border-collapse: collapse;
  }

  th {
    color: var(--color-text-light-on-dark);
    white-space: nowrap;
    margin-bottom: 0.8rem;
    min-width: 80px;
  }

  th:first-of-type {
    min-width: 110px;
  }

  td {
    padding: 0.5rem 1rem;
  }

  .cart-item:nth-of-type(odd) {
    background-color: var(--bookshop-white);
    color: var(--color-text-dark-on-light);
  }

  .cart-item:nth-of-type(even) {
    background-color: var(--bookshop-grey);
    color: var(--color-text-dark-on-light);
  }

  p {
    margin: 1rem 0;
    font-weight: bold;
  }

  span {
    color: var(--color-text-alert)
  }

  .alert {
    color: var(--color-text-alert);
  }
</style>