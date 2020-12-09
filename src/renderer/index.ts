import {createApp} from 'vue'
import App from './App.vue'


const tempVar: number = 'foo'
tempVar = {}
console.log(tempVar)

createApp(App).mount('#app')
