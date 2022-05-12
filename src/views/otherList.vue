<template>
	<div :class="sellList==''?'wrap':'wrapbg'">
		<div class="contenttop">
			<van-nav-bar title="NFT details" left-arrow @click-left="$router.go(-1)" />
			<div class="userInfobox">
				<div class="userInfoboxl"><img src="../assets/images/icon1.png"></div>
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
				<van-list v-model:loading="loading" :finished="finished" :finished-text="finishedText" @load="onMore" loading-text='Loading'>
					<div class="oneboxcell" v-for="(item,index) in sellList" :key='index' :title="item" @click="gotosell(item)">
						<div class="oneboxl">
							<img v-if="item.image==null" src="../assets/images/zw.png">
							<img v-else :src="item.image" class="imgobject">
						</div>
						<div class="oneboxr">
							<div class="oneboxrt">
								<span class="oneboxrtl oneboxrtname">{{item.name}}</span>
								<span class="oneboxrtr">{{item.creator==null?'itemcreator':item.creator | ellipsis}}</span>
							</div>
							<div class="oneboxrc">
								<span class="oneboxrtl">{{`#${item.tokenId}`}}</span>
								<span class="oneboxrtr"><img src="../assets/images/icon1.png" />
									{{item.price}}</span>
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
					this.$toast('Successfully copied to clipboard')
				}).catch(() => {
					this.$toast('Copy failed')
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
					if (res.code == '200') {						
						if (this.page == 1) {
							this.sellList = res.result.list
						} else {
							this.sellList = this.sellList.concat(res.result.list)
						}
						this.loading = false
						if (res.result.list.length == 0 || res.result.list.length < 10) {
							this.finished = true
							this.finishedText = 'No more...'
							return
						}else {
							this.finished = false;
						}	
					} else {
						this.$toast(res.message)
					}
				})
			},
			gotosell(item) {
				this.$router.push({
					name: 'shopDetail',
					query: {
						userId: item.id
					}
				})
			}
		},
	}
</script>
<style scoped>
	.wrapbg{
		background: #FFFFFF;
		height: 100vh;
	}
	.wrap{
		background: #F7F7F7;
		height: 100vh;
	}
	.nolist {
		background: #F7F7F7;
		width: 100%;
	}

	.nolist img {
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
.imgobject{
		object-fit:cover;
		object-position:50% 50%;
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
		margin: 13px 0;
		width: 100%;
		font-size: 12px;
		color: #FFA415;
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
	.oneboxrtname {
		max-width: 150px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		display: inline-block;
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
