import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/home.vue'

Vue.use(VueRouter)

const routes = [{
		path: '/',
		name: 'Home',
		component: Home,
		meta: {
			title: '首页',
			isMenu: true
		}
	},
	{
		path: '/coin',
		name: 'coin',
		component: () => import('../views/coin.vue'),
		meta: {
			title: '我的',
			isMenu: true
		}
	},
	{
		path: '/me',
		name: 'me',
		component: () => import('../views/me.vue'),
		meta: {
			title: '我的',
			isMenu: true
		}
	},
	{
		path: '/shopDetail',
		name: 'shopDetail',
		component: () => import('../views/shopDetail.vue'),
		meta: {
			title: 'NFT details',
			isMenu: true
		}
	},
	{
		path: '/search',
		name: 'search',
		component: () => import('../views/search.vue'),
		meta: {
			title: 'search',
			isMenu: true
		}
	},
	{
		path: '/sellDetail',
		name: 'sellDetail',
		component: () => import('../views/sellDetail.vue'),
		meta: {
			title: 'NFT details',
			isMenu: true
		}
	},
	{
		path: '/otherList',
		name: 'otherList',
		component: () => import('../views/otherList.vue'),
		meta: {
			title: 'NFT details',
			isMenu: true
		}
	}
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

export default router
