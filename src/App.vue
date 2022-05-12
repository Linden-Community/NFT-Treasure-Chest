<template>
	<div id="app">
		<router-view v-if="isShow" />
	</div>
</template>
<script>
	export default {
		name: 'App',
		provide() { //父组件中通过provide来提供变量，在子组件中通过inject来注入变量。                                             
			return {
				reload: this.reload
			}
		},
		data() {
			return {
				isShow: true //控制视图是否显示的变量
			}
		},
		methods: {
			reload() {
				this.isShow = false; //先关闭，
				this.$nextTick(function() {
					this.isShow = true; //再打开
				})
			}
		},
	}
</script>
<style scoped>
	#app {
		font-size: 16px;
	}
</style>
