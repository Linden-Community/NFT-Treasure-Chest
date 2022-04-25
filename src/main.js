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

Vue.config.productionTip = false
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
