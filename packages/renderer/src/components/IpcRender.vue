<script lang="ts" setup>
import { ref } from 'vue';
const msg = ref('');

function sendMsg(){
window.ipcRenderer.send('renderMsg','ping');
 window.ipcRenderer.on('mainMsg',(e,a)=>{
    msg.value = a;
  });
}
</script>
<template>
  <button
    @click="sendMsg"
  >
    send
  </button>
  <p>ping -> {{ msg }}</p>
</template>
