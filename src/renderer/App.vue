<template>
  <p>{{ a }}</p>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'App',
  setup() {
    const a: string = 111;
    return {a};
  },
});
</script>

