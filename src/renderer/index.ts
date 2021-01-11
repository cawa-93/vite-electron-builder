import {createApp} from 'vue';
import App from './App.vue';
import router from '/@/router';

createApp(App)
  .use(router)
  .mount('#app');
console.log('FOOO 11 22');
