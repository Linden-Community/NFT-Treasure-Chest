import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import utils from './utils'
import Web3 from 'web3'
import axios from 'axios'
import filters from "./api/filter.js"
import VueClipboard from 'vue-clipboard2'
import '@/assets/css/reset.css'
import content from './api/content.js';

Vue.config.productionTip = false
Vue.prototype.$myContent = content;
Vue.prototype.Web3 = Web3
Vue.prototype.$http = axios
Vue.use(utils)
Vue.use(VueClipboard)
import {
	Button,
	Toast,
} from 'vant';
import {
	Image as VanImage
} from 'vant';
Vue.use(Button,Toast)
Vue.use(VanImage);

new Vue({
	router,
	store,
  render: h => h(App),
}).$mount('#app')
Object.keys(filters).forEach(key=>{
  Vue.filter(key,filters[key])
})
router.afterEach((to,from,next) => {
window.scrollTo(0,0);
});
Vue.directive('throttle',{
  inserted(el,binding){
    el.addEventListener('click',()=>{
      el.style.pointerEvents='none';
      if(!el.disabled){
        setTimeout(()=>{
          el.style.pointerEvents='auto'
        },binding.value||300)
      }
    })
  }
})
