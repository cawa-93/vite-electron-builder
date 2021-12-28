<script lang="ts" setup>
import {computed, ref} from 'vue';

const rawString = ref('Hello World');
/**
 * window.nodeCrypto was exposed from {@link module:preload}
 */
const hashedString = computed(() => window.nodeCrypto.sha256sum(rawString.value));
</script>

<template>
  <label>
    Raw value
    <input
      v-model="rawString"
      type="text"
    >
  </label>
  <br>
  <label>
    Hashed by node:crypto
    <input
      v-model="hashedString"
      type="text"
      readonly
    >
  </label>
  <br><br>
  <code>packages/renderer/src/components/ReactiveHash.vue</code>
</template>
