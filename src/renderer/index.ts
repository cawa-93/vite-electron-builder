import {createApp} from 'vue';
import App from './App.vue';
import router from '/@/router';

import {str} from '/@/demo';

console.log(str);

createApp(App)
  .use(router)
  .mount('#app');
