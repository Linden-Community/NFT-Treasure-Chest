<template>
	<div class="wrap">
		<div class="contenttop">
			<van-nav-bar title="NFT details" left-arrow @click-left="$router.go(-1)" />
			<div class="userInfobox">
				<div class="userInfoboxl"><img src="https://cdn.jsdelivr.net/npm/@vant/assets/cat.jpeg"></div>
				<div class="userInfoboxr">
					<div class="userInfoboxrb">
						<span class="userInfoboxrbl"><img
								src="../assets/images/icon1.png"></span>
						<span class="userInfoboxrbc">{{myAddress}}</span>
						<span class="userInfoboxrbr"><img
								src="../assets/images/copy.png" @click="copyClick(myAddress)"></span>
					</div>
				</div>
			</div>
		</div>
		<div class="contentbottom">
			<div v-if="sellList.length==0" class="nolist">
				<div><img src="../assets/images/nolist.png" /></div>
				<div>No items to display</div>
			</div>
			<div class="onebox" v-else>
				<van-list v-model:loading="loading" :finished="finished" :finished-text="finishedText" @load="onMore">
					<div class="oneboxcell" v-for="(item,index) in sellList" :key='index' :title="item">
						<div class="oneboxl">
							<img v-if="item.image==null" src="../assets/images/zw.png">
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
								{{item.price==null?'0':item.price}}
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
	</div>
</template>
<script>
	import Vue from 'vue'
	import {
		Tab,
		Tabs,
		Icon
	} from 'vant'
	Vue.use(Tab).use(Tabs).use(Icon)
	import {
		listSell,
	} from "../api";

	export default {
		data() {
			return {
				sellList: [],
				myAddress: '',
				page: 1,
				num: 10,
				loading: false,
				finished: false,
				finishedText: '',
			}
		},
		mounted() {
			this.myAddress = this.$route.query.address
			this.listRequest(this.$route.query.address)
		},
		methods: {
			copyClick(txt) {
				this.$copyText(txt).then(() => {
					this.$toast('已成功复制到剪切板')
				}).catch(() => {
					this.$toast('复制失败')
				})
			},
			onMore() {
				this.page++
				this.listRequest(this.myAddress)
			},
			listRequest(address) {
				const params = {
					pageNo: this.page,
					pageSize: this.num,
					owner: address,
					type: 1,
				}
				listSell(params).then(res => {
					console.log("数据", res)
					if (res.code == '200') {						
						if (this.page == 1) {
							this.sellList = res.result.list
						} else {
							this.sellList = this.sellList.concat(res.result.list)
						}
						this.loading = false
						if (res.result.list.length == 0 || res.result.list.length < 10) {
							this.finished = true
							this.finishedText = '没有更多了...'
							return
						}	
					} else {
						this.$toast(res.message)
					}
				})
			},
			gotosell(item) {
				this.$router.push({
					name: 'sellDetail',
					query: {
						userId: item.id
					}
				})
			}
		},
	}
</script>
<style scoped>

	.nolist {
		background: #F7F7F7;
		width: 100%;
	}

	.nolist img {
		width: 105px;
		height: 105px;
		margin-top: 100px;
		margin-bottom: 10px;
	}

	.nolist div:nth-child(1) {
		margin: 0 auto;
		text-align: center;
	}

	.nolist div:nth-child(2) {
		font-size: 12px;
		color: #999999;
		line-height: 36px;
		text-align: center;
		padding-bottom: 80px;
	}

	.contenttop {
		width: 100%;
		height: 250px;
		background: #FFFFFF;
	}

	.userInfobox {
		width: 327px;
		margin: 0 auto;
		padding: 16px 10px;
	}

	.userInfoboxl img {
		width: 80px;
		height: 80px;
		border: 1px solid #979797;
		border-radius: 50%;
		display: inline-block;
		margin:0 auto;
	}

	.userInfoboxr,
	.userInfoboxl{
		width: 100%;
		margin:0 auto;
		display:inline-flex;
	}

	.userInfoboxrb {
		margin:15px auto;
		width: 244px;
		height: 45px;
		display: inline-flex;
		background: #F0F0F0;
		border-radius: 8px;
	}

	.userInfoboxrbl img {
		display: inline-flex;
		margin-left: 5px;
		width: 15px;
		height: 15px;
		vertical-align: top;
		margin-top: 15px;
	}

	.userInfoboxrbc {
		width: 180px;
		height: 40px;
		font-size: 12px;
		color: #999999;
		line-height: 20px;
		margin: 0 10px;
		word-wrap: break-word;
	}

	.userInfoboxrbr img {
		width: 15px;
		height: 15px;
		vertical-align: top;
		margin-top: 15px;
		display: inline-flex;
	}

	.onebox {
		border-top: 5px solid #F7F7F7;
		margin-bottom: 50px;
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
		vertical-align:top;
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
	/deep/.van-nav-bar .van-icon{
		color: #000000;
	}
</style>
