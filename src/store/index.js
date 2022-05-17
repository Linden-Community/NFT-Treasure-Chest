import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		choosenetwork:localStorage.getItem('switchNetwork')==''||localStorage.getItem('switchNetwork')==null?'56':localStorage.getItem('switchNetwork')
	},
	mutations: {
		updatenetwork(state, val) {
			state.choosenetwork = val
		}
	},
	actions: {},
	modules: {}
})
