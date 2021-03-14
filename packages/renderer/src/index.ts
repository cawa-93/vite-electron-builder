import {createApp} from 'vue';
import App from '/@/App.vue';
import router from '/@/router';
import {useElectron} from '/@/use/electron';

createApp(App)
  .use(router)
  .mount('#app');


  const a = useElectron();
  a.versions.push();

  const e :ElectronApi = {versions: {}};
  e.versions;
