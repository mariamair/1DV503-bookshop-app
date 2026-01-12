<script setup>
  import NavigationButton from './NavigationButton.vue'

  defineProps({
    isAuthorized: Boolean
  })

  const emit = defineEmits(['home', 'login', 'logout', 'catalog', 'cart'])
</script>

<template>
  <nav>
    <NavigationButton
    title="Home"
    @click="emit('home')"
    />
    <template v-if="!isAuthorized">
      <NavigationButton
      title="Login"
      @click="emit('login')"
      />
    </template>
    <template v-else>
      <NavigationButton
      title="Book Catalog"
      @click="emit('catalog')"
      />
      <NavigationButton
      title="Cart"
      @click="emit('cart')"
      />
      <NavigationButton
      title="Log out"
      @click="emit('logout')"
      />
    </template>
  </nav>
</template>

<style scoped>
  nav {
    padding-bottom: 1rem;
  }
</style>
