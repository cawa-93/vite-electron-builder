<template>
  <img
    alt="Vue logo"
    src="./assets/logo.png"
  >
  <p>
    <router-link to="/">
      Go to Home
    </router-link>
    <router-link to="/about">
      Go to About
    </router-link>
  </p>
  <router-view />
</template>

<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: 'App',
})
</script>

