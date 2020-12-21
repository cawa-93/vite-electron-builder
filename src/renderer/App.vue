<template>
  <img
    alt="Vue logo"
    src="./assets/logo.png"
  >
  {{ data }}
  <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import HelloWorld from './components/HelloWorld.vue'
import {useElectron} from '/@/use/electron'

export default defineComponent({
  name: 'App',
  components: {
    HelloWorld,
  },
  setup() {
    const {data} = useElectron()

    return {data}
  },
})
</script>

