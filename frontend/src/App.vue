<script setup>
  import NavigationBar from './components/NavigationBar.vue'
  import HomePage from './components/HomePage.vue'
  import LoginComponent from './components/LoginComponent.vue'
  import CatalogComponent from './components/CatalogComponent.vue'
  import CartComponent from './components/CartComponent.vue'
  import ErrorDisplay from './components/ErrorDisplay.vue'
  import InfoDisplay from './components/InfoDisplay.vue'
  import { usersApiUrl } from './utils/api'
  import { ref, provide  } from 'vue'

  const isAuthorized = ref(false)
  const currentComponent = ref('home')
  const components = {
    home: HomePage,
    login: LoginComponent, 
    catalog: CatalogComponent, 
    cart: CartComponent
  }
  const timeOut = 3000
  const error = ref({
    statusCode: null,
    message: ''
  })

  const feedback = ref({
    message: ''
  })

  const displayError = (errorData) => {
    if (!errorData.statusCode) {
      error.value.statusCode = 500
      error.value.message = 'Internal error'
    } else {
      error.value = errorData
    } 
    
    // Autoclear message
    setTimeout(() => {
      error.value.message = ''
    }, timeOut)
  }

  const displayFeedback = (payload) => {
    feedback.value = payload

    // Autoclear message
    setTimeout(() => {
      feedback.value.message = ''
    }, timeOut)
  }

  const handleSuccess = (payload) => {
    displayFeedback(payload)

    if (payload.isAuthorized === true) {
      handleLogin()
    }
  }

  const handleLogin = () => {
    isAuthorized.value = true
    currentComponent.value = 'catalog'
  }

  const handleLogout = () => {
    isAuthorized.value = false
    currentComponent.value = 'home'
    handleLogoutInBackend()
  }

  const handleLogoutInBackend = async () => {
    try {
      const response = await window.fetch(`${usersApiUrl}/logout`, {
        method: 'GET',
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        throw data
      }
      handleSuccess({ message: 'Logged out successfully.'})

    } catch (error) {
      displayError(error)
    } 
  }

  provide('reportError', displayError)
  provide('reportSuccess', handleSuccess)
</script>

<template>
  <header>
    <NavigationBar 
      :isAuthorized="isAuthorized"
      @home="currentComponent = 'home'"
      @login="currentComponent = 'login'"
      @catalog="currentComponent = 'catalog'"
      @cart="currentComponent = 'cart'"
      @logout="handleLogout"
    />
  </header>

  <main>
    <ErrorDisplay       
      v-if="error.message"
      :message="error.message" 
    />
    <InfoDisplay       
      v-if="feedback.message"
      :message="feedback.message" 
    />
    <component 
      :is="components[currentComponent]" 
    />
  </main>
  <footer>
    <p>&copy; 2026 Maria Mair</p>
  </footer>
</template>

<style scoped>
header {
  line-height: 1.5rem;
}

footer {
 margin-top: 5rem;
}
</style>
