<template>
	<div class="wrapbg">
		<div class="headerbox">
			<van-nav-bar title="Transaction record" left-arrow @click-left="$router.go(-1)" />
		</div>
		<div class="tablebox">
			<span :class="index==0?'ischoose':'noischoose'" @click="chooseone">Buy</span>
			<span :class="index==1?'ischoose':'noischoose'" @click="choosetwo">Sell</span>
		</div>
		<div v-if="sellList.length==0 && emptyflag == 1" class="nolist">
			<div><img src="../assets/images/nolist.png" /></div>
			<div>No items to display</div>
		</div>
		<div v-else>
			<van-list v-model:loading="loading" :finished="finished" :finished-text="finishedText" @load="onMore"
				loading-text="Loading">
				<div v-if="index==0" class="onebox">
					<div class="oneboxcell" v-for="(item,index) in sellList" :key='index' :title="item"
						@click="gotosell(item)">
						<div class="oneboxl">
							<!-- <img v-if="item.image==null" src="../assets/images/zw.png">
							<img v-else :src="item.image" class="imgobject"> -->
							<div class="boximg" :style="{'background-image':'url('+item.image+')'}"></div>
						</div>
						<div class="oneboxr">
							<div class="oneboxrt">
								<span class="oneboxrtl oneboxrtname">{{item.title}}</span>
								<span
									class="oneboxrtr">From：{{item.buyFrom==null?'itemcreator':item.buyFrom | ellipsis}}</span>
							</div>
							<div class="oneboxrc">
								<span class="oneboxrtl">{{`#${item.tokenId}` | ellipsis}}</span>
								<span class="oneboxrcr"><img src="../assets/images/icon1.png" />
									{{item.price}}</span>
							</div>
							<div class="oneboxrb">
								<span class="oneboxrbl">Purchase time</span>
								<span class="oneboxrbr">{{item.createTime.substring(0,16)}}</span>
							</div>
						</div>
					</div>
				</div>
				<div v-else-if="index==1" class="onebox">
					<div class="oneboxcell" v-for="(item,index) in sellList" :key='index' :title="item"
						@click="gotosell(item)">
						<div class="oneboxl">
							<!-- <img v-if="item.image==null" src="../assets/images/zw.png">
							<img v-else :src="item.image" class="imgobject"> -->
							<div class="boximg" :style="{'background-image':'url('+item.image+')'}"></div>
						</div>
						<div class="oneboxr">
							<div class="oneboxrt">
								<span class="oneboxrtl oneboxrtname">{{item.title}}</span>
								<span
									class="oneboxrtr">To：{{item.buyTo==null?'itemcreator':item.buyTo | ellipsis}}</span>
							</div>
							<div class="oneboxrc">
								<span class="oneboxrtl">{{`#${item.tokenId}` | ellipsis}}</span>
								<span class="oneboxrcr"><img src="../assets/images/icon1.png" />
									{{item.price}}</span>
							</div>
							<div class="oneboxrb">
								<span class="oneboxrbl">Transaction time</span>
								<span class="oneboxrbr">{{item.createTime.substring(0,16)}}</span>
							</div>
						</div>
					</div>
				</div>
			</van-list>
		</div>
	</div>
</template>

<script>
	import footBar from '../components/footBar'
	import Vue from 'vue'
	import {
		List,
		NavBar,
	} from 'vant'
	Vue.use(List).use(NavBar)
	import {
		transactionList,
	} from "../api";
	export default {
		data() {
			return {
				active: '',
				sellList: [],
				myAddress: '',
				page: 1,
				num: 10,
				loading: false,
				finished: false,
				finishedText: '',
				emptyflag: 0, //接口0调用前1调用后
				index: 0,
			}
		},
		mounted() {
			let isthatpage = localStorage.getItem('ispage')
			if(isthatpage=='sell'){
				this.index = 1
			}else{
				this.index = 0
			}
			localStorage.setItem('ispage', '')
			this.myAddress = this.$route.query.owner
			this.listRequest(this.index, this.myAddress)
		},
		methods: {
			chooseone() {
				this.index = 0
				this.page = 1
				this.listRequest(this.index, this.myAddress)
			},
			choosetwo() {
				this.index = 1
				this.page = 1
				this.listRequest(this.index, this.myAddress)
			},
			onMore() {	
				let times = setTimeout(() => {
					this.page += 1 //每请求一次，页面数+1
					this.listRequest(this.index, this.myAddress)
				}, 500)
			},
			gotosell(item) {
				if (this.index == 0) {
					this.$router.push({
						name: 'listBuyDetail',
						query: {
							nftId: item.nftId,
							buyFrom: item.buyFrom,
							buyTo: item.buyTo,
							createTime: item.createTime,
							price: item.price,
						}
					})
				} else {
					this.$router.push({
						name: 'listSellDetail',
						query: {
							nftId: item.nftId,
							buyFrom: item.buyFrom,
							buyTo: item.buyTo,
							createTime: item.createTime,
							price: item.price,
						}
					})
				}

			},
			listRequest(listtype, address) {
				const params = {
					pageNo: this.page,
					pageSize: this.num,
					owner: address,
					type: listtype,
				}
				this.emptyflag = 0
				transactionList(params).then(res => {
					this.emptyflag = 1
					if (res.code == '200') {
						if (this.page == 1) {
							if (listtype == 0) {
								this.sellList = res.result.list
							} else if (listtype == 1) {
								this.sellList = res.result.list
							}
						} else {
							if (listtype == 0) {
								this.sellList = this.sellList.concat(res.result.list)
							} else if (listtype == 1) {
								this.sellList = this.sellList.concat(res.result.list)
							}
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
		}
	}
</script>

<style scoped>
	.wrapbg {
		background: #F7F7F7;
		height: 100vh;
	}

	.tablebox {
		width: 260px;
		height: 25px;
		margin: 25px auto;
		background: #FFFFFF;
		box-shadow: inset 1px 2px 4px 0px rgba(0, 0, 0, 0.1);
		border-radius: 6px;
	}

	.tablebox span {
		width: 130px;
		text-align: center;
		line-height: 25px;
		display: inline-block;
	}

	.ischoose {
		background: #FAC32D;
		border-radius: 3px;
		font-size: 12px;
		color: #333333;
	}

	.noischoose {
		background: #FFFFFF;
		border-radius: 3px;
		font-size: 12px;
		color: #999999;
	}

	.oneboxcell {
		width: 360px;
		margin: 4px auto 8px auto;
		height: 90px;
		background: #FFFFFF;
		border-radius: 8px;
		border: .5px solid #D4D4D4;
	}

	.boximg {
		border-radius: 8px;
		width: 72px;
		height: 72px;
		background-size: contain;
		background-repeat: no-repeat;
		box-shadow: 0px 2px 2px 2px rgba(0, 0, 0, 0.1);
		background-position: center
		
	}

	.imgobject {
		object-fit: cover;
		object-position: 50% 50%;
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
		width: 262px;
	}

	.oneboxrc {
		margin: 13px 0;
	}

	.oneboxrcr {
		height: 12px;
		float: right;
		font-size: 12px;
		color: #FFA415;
		text-align: right;
	}

	.oneboxrcr img {
		width: 12px;
		height: 12px;
		vertical-align: top;
	}

	.oneboxrtr,
	.oneboxrbr {
		float: right;
		display: inline-block;
		text-align: right;
	}

	.oneboxrtl {
		font-size: 13px;
		color: #333333;
		line-height: 14px;
		vertical-align: top;
	}

	.oneboxrtname {
		max-width: 120px;
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

	.nolist {
		background: #F7F7F7;
		width: 100%;
	}

	.nolist img {
		/* width: 105px; */
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

	/deep/.van-nav-bar .van-icon {
		color: #000000;
	}
</style>
