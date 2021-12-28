<script lang="ts" setup>
/**
 * window.versions was exposed from {@link module:preload}
 */
const versions = Object.entries(window.versions)
  .sort(
    ([key1], [key2]) => key1.localeCompare(key2),
  );
</script>

<template>
  <ul aria-labelledby="versions">
    <li
      v-for="([lib, version]) in versions"
      :key="lib"
    >
      <strong>{{ lib }}</strong>: v{{ version }}
    </li>
  </ul>
  <code>packages/renderer/src/components/ElectronVersions.vue</code>
</template>

<style scoped>
ul {
  list-style: none;
}
</style>
