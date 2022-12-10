// import {createApp} from 'vue';
// import App from '/@/App.vue';

// createApp(App).mount('#app');

import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('app') as Element);
root.render(<App />);
