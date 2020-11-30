import {createRouter, createWebHashHistory} from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import About from './components/About.vue'

const routes = [
  {path: '/', name: 'HelloWorld', component: HelloWorld},
  {path: '/about', name: 'About', component: About},
]

export default createRouter({
  routes,
  history: createWebHashHistory(),
})
