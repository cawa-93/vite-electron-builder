<script lang="ts" setup>
import {versions} from '#preload';
</script>

<template>
  <ul id="process-versions">
    <li
      v-for="(version, lib) in versions"
      :key="lib"
    >
      <strong>{{ lib }}</strong>
      <span>: v{{ version }}</span>
    </li>
  </ul>
  <code>packages/renderer/src/components/ElectronVersions.vue</code>
</template>

<style scoped>
ul {
  list-style: none;
}
</style>
