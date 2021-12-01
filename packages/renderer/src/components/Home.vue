<template>
  <p>
    For a guide and recipes on how to configure / customize this project,<br>
    check out the
    <a
      href="https://github.com/cawa-93/vite-electron-builder"
      rel="noopener"
      target="_blank"
    >vite-electron-builder documentation</a>.
  </p>

  <p>
    <a
      href="https://vitejs.dev/guide/features.html"
      target="_blank"
    >Vite Documentation</a> |
    <a
      href="https://v3.vuejs.org/"
      target="_blank"
    >Vue 3 Documentation</a>
  </p>

  <fieldset>
    <legend>Test Vue Reactivity</legend>
    <button @click="count++">
      count is: {{ count }}
    </button>
  </fieldset>

  <fieldset>
    <legend>Test Node.js API</legend>
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
  </fieldset>

  <p>
    Edit
    <code>renderer/components/Home.vue</code> to test hot module replacement.
  </p>
</template>

<script lang="ts">
import {computed, defineComponent, ref} from 'vue';

export default defineComponent({
  name: 'HelloWorld',
  setup() {
    const count = ref(0);

    const rawString = ref('Hello World');
    const hashedString = computed(() => window.nodeCrypto.sha256sum(rawString.value));

    return {count, rawString, hashedString};
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
a {
  color: #42b983;
}

fieldset {
  margin: 2rem;
  padding: 1rem;
}
</style>
