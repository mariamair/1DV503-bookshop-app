<script setup>
  import { usersApiUrl } from '@/utils/api'
  import { inject, ref } from 'vue'

  const emit = defineEmits(['success'])
  const reportError = inject('reportError')
  const reportSuccess = inject('reportSuccess')

  const firstName = ref('')
  const lastName = ref('')
  const address = ref('')
  const city = ref('')
  const zip = ref('')
  const phone = ref('')
  const email = ref('')
  const password = ref('')
  const loading = ref(true)

  const onSubmit = () => {
    registerUser() 
  }

const registerUser = async () => {
  try {
    loading.value = true

    const response = await window.fetch(`${usersApiUrl}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName: firstName.value,
        lastName: lastName.value,
        address: address.value,
        city: city.value,
        zip: zip.value,
        phone: phone.value,
        email: email.value,
        password: password.value
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw data
    }

    reportSuccess({ 
      message: 'Registration successful! Please log in with your user credentials.'
    })
    emit('success')

  } catch (error) {
    reportError(error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <slot name="heading"></slot>
  <form v-on:submit.prevent="onSubmit">
    <label for="first-name">First Name</label>
    <input v-model="firstName" type="text" id="first-name" placeholder="Enter your first name">
    <label for="last-name">Last Name</label>
    <input v-model="lastName" type="text" id="last-name" placeholder="Enter your last name">
    <label for="address">Address</label>
    <input v-model="address" type="text" id="address" placeholder="Enter your address">
    <label for="city">City</label>
    <input v-model="city" type="text" id="city" placeholder="Enter your city">
    <label for="zip-code">Zip Code</label>
    <input v-model="zip" type="number" min=1 max=99999 id="zip-code" placeholder="Enter your zip code">
    <label for="phone">Phone</label>
    <input v-model="phone" type="text" id="phone" placeholder="Enter your phone number">
    <label for="email">Email</label>
    <input v-model="email" type="text" id="email" placeholder="Enter your email address">
    <label for="password">Password</label>
    <input v-model="password" type="password" minlength="6" id="password" placeholder="Enter your password">
    <button type="submit" :disabled="!firstName || !lastName || !address || !city || !zip || !email || !password">Sign up</button>
  </form>
</template>
