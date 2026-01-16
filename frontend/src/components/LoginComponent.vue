<script setup>
  import LoginForm from './LoginForm.vue'
  import RegistrationForm from './RegistrationForm.vue'
  import { onMounted, ref } from 'vue'

  const registrationFormHeading = ref('Sign up for our bookshop')
  const loginFormHeading = ref('Enter your credentials')
  const displayRegistrationForm = ref(false)
  const toggleForms = () => {
    displayRegistrationForm.value = !displayRegistrationForm.value
  }

  onMounted(() => {
    displayRegistrationForm.value = false
  })
</script>

<template>
  <div>
    <RegistrationForm
      v-if="displayRegistrationForm"
      @success="toggleForms"
      >
        <template #heading>
        <h2>{{ registrationFormHeading }}</h2>
      </template>
    </RegistrationForm>
    <div
      v-if="!displayRegistrationForm">
      <LoginForm>
          <template #heading>
          <h2>{{ loginFormHeading }}</h2>
        </template>
      </LoginForm>
      <p>New user? <button type="button" class="nav-button" @click="toggleForms">Click here</button> to register.</p>
    </div>
  </div>
</template>

<style scoped>
  p {
    font-size: 1rem;
    margin: 1rem;
    color: var(--color-text-light-on-dark);
  }
</style>
