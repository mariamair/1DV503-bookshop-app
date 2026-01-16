<script setup>
  import { usersApiUrl } from '@/utils/api'
  import { ref, inject } from 'vue'

  const reportError = inject('reportError')
  const reportSuccess = inject('reportSuccess')

  const email = ref('')
  const password = ref('')
  const loading = ref(true)

  const onSubmit = () => {
    loginUser() 
  }

  const loginUser = async () => {
    try {
      loading.value = true

      const response = await window.fetch(`${usersApiUrl}/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email.value,
          password: password.value
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw data
      }

      reportSuccess({ 
        message: `Login successful! Welcome ${data.firstName}!`,
        isAuthorized: true })
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
    <label for="email">Email</label>
    <input v-model="email" type="text" id="email" placeholder="Enter your email address">
    <label for="password">Password</label>
    <input v-model="password" type="password" id="password" placeholder="Enter your password">
    <button type="submit" :disabled="!email || !password">Login</button>
  </form>
</template>
