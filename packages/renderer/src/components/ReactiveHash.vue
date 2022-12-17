<script lang="ts" setup>
import {computed, ref} from 'vue';
import {sha256sum} from '#preload';

const rawString = ref('Hello World');
/**
 * window.nodeCrypto was exposed from {@link module:preload}
 */
const hashedString = computed(() => sha256sum(rawString.value));
</script>

<template>
  <label>
    Raw value
    <input
      id="reactive-hash-raw-value"
      v-model="rawString"
      type="text"
    />
  </label>
  <br />
  <label>
    Hashed by node:crypto
    <input
      id="reactive-hash-hashed-value"
      v-model="hashedString"
      readonly
      type="text"
    />
  </label>
  <br /><br />
  <code>packages/renderer/src/components/ReactiveHash.vue</code>
</template>
