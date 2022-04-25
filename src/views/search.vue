<template>
	<div class="searchboxs">
		<div class="searchbox">
			<div class="searchone" @click="$router.go(-1)"><van-icon name="arrow-left" /></div>
			<div class="searchtwo"><van-search v-model="searchkey" placeholder="Search collections/number/address/token id" /></div>
			<div class="searchthree" @click="onSearch">search</div>
		</div>
		<div v-if="searchlist.length==0" class="nosearch">
			<div><img src="../assets/images/nosearch.png" /></div>
			<div>No items to display</div>
		</div>
		<div v-else class="onebox">
			<van-list v-model:loading="loading" :finished="finished" :finished-text="finishedText" @load="onMore">
			<div class="oneboxcell" v-for="(item,index) in searchlist" :key='index' :title="item">
				<div class="oneboxl">
					<img v-if="item.image==null" src="../assets/images/nolist.png">
					<img v-else :src="item.image">
				</div>
				<div class="oneboxr">
					<div class="oneboxrt">
						<span class="oneboxrtl">{{item.name}}</span>
						<span class="oneboxrtl">{{`#${item.tokenId}` | ellipsis}}</span>
						<span class="oneboxrtr">{{item.creator==null?'itemcreator':item.creator | ellipsis}}</span>
					</div>
					<div class="oneboxrc">
						<img v-show="item.price!=null" src="../assets/images/icon1.png" />
						{{item.price}}
					</div>
					<div class="oneboxrb">
						<span class="oneboxrbl">Purchase time</span>
						<span class="oneboxrbr">{{item.offSheftTime}}</span>
					</div>
				</div>
			</div>
			</van-list>
		</div>
	</div>
</template>
<script>
	import Vue from 'vue'
	import {
		Search,Icon,List
	} from 'vant'
	Vue.use(Search).use(Icon).use(List)
	import {
		getSearch
	} from "../api";
	export default {

		data() {
			return {
				searchkey:'',
				searchlist: [],
				pagetype:'0',
				owneradd:'',
				page: 1,
				num: 10,
				loading: false,
				finished: false,
				finishedText: '',
			}
		},
		mounted() {
			//传参数判断是那个入口（我的页面owneradd="owneradd"和首页owneradd=""）
			this.owneradd = this.$route.query.owneradd=='1'?'':this.$route.query.owneradd
			console.log(this.$route.query.owneradd)
		},
		methods: {
			onMore() {
				this.page++
				this.onSearch()
			},
			onSearch(){
				this.searchRequest(this.owneradd)
			},
			searchRequest(owner){
				const params = {
					pageNo: this.page,
					pageSize: this.num,
					search:this.searchkey,
					owner:owner,
				}
				getSearch(params).then(res => {
					if (res.code == '200') {
						if (this.page == 1) {
							this.searchlist = res.result.list
						} else {
							this.searchlist = this.searchlist.concat(res.result.list)
						}
						this.loading = false
						if (res.result.list.length == 0 || res.result.list.length < 10) {
							this.finished = true
							this.finishedText = '没有更多了...'
							return
						}
					} else {
						this.searchlist = []
						this.$toast(res.message)
					}
				})
			},
		},
	}
</script>
<style scoped>
	.searchbox{	
		position: fixed;
		width: 100%;
		z-index: 9999;
		text-align: center;
		display:inline-block;
		justify-content:space-between;
		border-bottom: 5px solid #F7F7F7;
		background: #ffff;
	}
	.searchone,.searchtwo,.searchthree{
		display:inline-block;
	}
	.nosearch {
		width: 100%;
	}
	
	.nosearch img {
		width: 105px;
		height: 105px;
		margin-top: 100px;
		margin-bottom: 10px;
	}
	
	.nosearch div:nth-child(1) {
		margin: 0 auto;
		text-align: center;
	}
	
	.nosearch div:nth-child(2) {
		font-size: 12px;
		color: #999999;
		line-height: 36px;
		text-align: center;
		padding-bottom: 80px;
	}
	.searchone{
		text-align:left;
		width:5%;
	}
	.searchtwo{
		width:70%;
	}
	.searchthree{
		width:15%;
		text-align:right;
	}
	.onebox {
		padding-top: 60px;
	}
	
	.oneboxcell {
		width: 350px;
		margin: 4px auto 8px auto;
		height: 90px;
		background: linear-gradient(311deg, #FFF7EA 0%, #FFFFFF 100%);
		border-radius: 8px;
		border: .5px solid #D4D4D4;
	}
	.oneboxl img {
		width: 72px;
		height: 72px;
		box-shadow: 0px 2px 2px 2px rgba(0, 0, 0, 0.1);
		border-radius: 8px;
	}
	
	.oneboxl,
	.oneboxr {
		margin: 8px 0;
		height: 73px;
		display: inline-block;
		vertical-align: middle;
		margin-left: 8px;
	}
	
	.oneboxr {
		width: 252px;
	}
	.oneboxrc {
		height: 12px;
		display: inline-block;
		float: right;
		margin: 13px 0;
		width: 100%;
		font-size: 12px;
		color: #FFA415;
		text-align: right;
	}
	
	.oneboxrc img {
		width: 12px;
		height: 12px;
	}
	
	.oneboxrtr,
	.oneboxrbr {
		float: right;
		display: inline-block;
	}
	
	.oneboxrtl {
		font-size: 13px;
		color: #333333;
	}
	
	.oneboxrtr {
		font-size: 12px;
		color: #666666;
	}
	
	.oneboxrbl,
	.oneboxrbr {
		font-size: 12px;
		color: #666666;
	}
	
</style>
