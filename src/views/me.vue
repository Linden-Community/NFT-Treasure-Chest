<template>
	<div class="wrap">
		<div class="contenttop">
			<div class="contenttitle">
				<span>占位</span>
				<span>My list</span>
				<span @click="search">
					<van-icon name="search" size="25" />
				</span>
			</div>
			<div class="userInfobox">
				<div class="userInfoboxl"><img src="../assets/images/icon1.png"></div>
				<div class="userInfoboxr">
					<!-- <div class="userInfoboxrt">User name</div> -->
					<div class="userInfoboxrb">
						<span class="userInfoboxrbl"><img src="../assets/images/icon1.png"></span>
						<span class="userInfoboxrbc">{{myAddress}}</span>
						<span class="userInfoboxrbr" @click="copyClick(myAddress)"><img
								src="../assets/images/copy.png"></span>
					</div>
				</div>
			</div>
		</div>
		<div class="contentbottom">
			<van-tabs :active="active" shrink @click="getInfo">
				<van-tab v-for="(item,index) in tablist" :key='index' :title="item">
					<div v-if="sellList.length==0" class="nolist">
						<div><img src="../assets/images/nolist.png" /></div>
						<div>No items to display</div>
					</div>
					<div v-else>
						<van-list v-model:loading="loading" :finished="finished" :finished-text="finishedText" @load="onMore">
							<div v-if="index==0" class="onebox">
								<div class="oneboxcell" v-for="(item,index) in sellList" :key='index' :title="item"
									@click="gotosell(item)">
									<div class="oneboxl">
										<img v-if="item.image==null" src="../assets/images/nolist.png">
										<img v-else :src="item.image">
									</div>
									<div class="oneboxr">
										<div class="oneboxrt">
											<span class="oneboxrtl">{{item.name}} #{{item.tokenId}}</span>
											<span
												class="oneboxrtr">{{item.creator==null?'itemcreator':item.creator | ellipsis}}</span>
										</div>
										<div class="oneboxrc"></div>
										<div class="oneboxrb">
											<span class="oneboxrbl">Purchase time</span>
											<span class="oneboxrbr">{{item.offSheftTime}}</span>
										</div>
									</div>
								</div>
							</div>
							<div v-else-if="index==1" class="onebox">
								<div class="oneboxcell" v-for="(item,index) in sellList" :key='index' :title="item">
									<div class="oneboxl">
										<img v-if="item.image==null" src="../assets/images/nolist.png">
										<img v-else :src="item.image">
									</div>
									<div class="oneboxr">
										<div class="oneboxrt">
											<span class="oneboxrtl">{{item.name}}</span>
											<span class="oneboxrtl">#{{item.tokenId}}</span>
											<span
												class="oneboxrtr">{{item.creator==null?'itemcreator':item.creator | ellipsis}}</span>
										</div>
										<div class="oneboxrc">
											<img src="../assets/images/icon1.png" />
											{{item.price==null?'0':item.price}}
										</div>
										<div class="oneboxrb">
											<span class="oneboxrbl">Purchase time</span>
											<span class="oneboxrbr">{{item.offSheftTime}}</span>
										</div>
									</div>
								</div>
							</div>
							<div v-else-if="index==2" class="onebox">
								<div class="oneboxcell" v-for="(item,index) in sellList" :key='index' :title="item">
									<div class="oneboxl">
										<img v-if="item.image==null" src="../assets/images/nolist.png">
										<img v-else :src="item.image">
									</div>
									<div class="oneboxr">
										<div class="oneboxrt">
											<span class="oneboxrtl">{{item.name}}</span>
											<span class="oneboxrtl">#{{item.tokenId}}</span>
											<span
												class="oneboxrtr">{{item.creator==null?'itemcreator':item.creator | ellipsis}}</span>
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
							</div>
						</van-list>
					</div>
				</van-tab>
			</van-tabs>
		</div>
		<foot-bar v-if="$route.meta.isMenu"></foot-bar>
	</div>
</template>
<script>
	import footBar from '../components/footBar'
	import Vue from 'vue'
	import {
		Tab,
		Tabs,
		Icon,
		List
	} from 'vant'
	Vue.use(Tab).use(Tabs).use(Icon).use(List)
	import {
		listSell,
		listSellNum
	} from "../api";

	export default {
		data() {
			return {
				active: '',
				tablist: [],
				sellList: [],
				myAddress: '',
				page: 1,
				num: 10,
				loading: false,
				finished: false,
				finishedText:'',
				mytype:0,
			}
		},
		mounted() {
			//this.getAddress()
			this.myAddress = sessionStorage.getItem("myAddress")
			this.getSellNum(this.myAddress)
			this.listRequest(0, this.myAddress)
		},
		methods: {
			onMore() {
				this.page++
				this.listRequest(this.mytype, this.myAddress)
			},
			//复制
			copyClick(txt) {
				this.$copyText(txt).then(() => {
					this.$toast('已成功复制到剪切板')
				}).catch(() => {
					this.$toast('复制失败')
				})
			},
			//get获去地址
			// getAddress() {
			// 	if (window.ethereum) {
			// 		window.ethereum.enable().then((res) => {
			// 			if (!res[0]) {
			// 				this.$toast('请先登录小狐狸')
			// 			} else {
			// 				this.myAddress = res[0]
			// 				this.getSellNum(res[0])
			// 				this.listRequest(0, res[0])
			// 			}
			// 		})
			// 	} else {
			// 		this.$toast('请安装 MetaMask,浏览器才能开始使用。');
			// 	}
			// },
			getSellNum(address) {
				const params = {
					owner: address,
				}
				listSellNum(params).then(res => {
					if (res.code == '200') {
						var tabone = `Not listed(${res.result.notOn})`
						var tabtwo = `On Shelves(${res.result.hasBeenOn})`
						var tabthree = `All(${res.result.notOn+res.result.hasBeenOn})`
						this.tablist = [tabone, tabtwo, tabthree]
					} else {
						this.$toast(res.message)
					}
				})
			},
			listRequest(listtype, address) {
				const params = {
					pageNo: this.page,
					pageSize: this.num,
					owner: address,
					type: listtype,
				}
				listSell(params).then(res => {
					if (res.code == '200') {
						if (this.page == 1) {
							if (listtype == 0) {
								this.sellList = res.result.list
							} else if (listtype == 1) {
								this.sellList = res.result.list
							} else if (listtype == 3) {
								this.sellList = res.result.list
							}
						} else {
							if (listtype == 0) {
								this.sellList = this.sellList.concat(res.result.list)
							} else if (listtype == 1) {
								this.sellList = this.sellList.concat(res.result.list)
							} else if (listtype == 3) {
								this.sellList = this.sellList.concat(res.result.list)
							}
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
			getInfo(id) {
				this.page = 1
				this.loading = true
				this.finished = false
				if (id == 0) {
					this.mytype = 0
					this.listRequest(0, this.myAddress)
				} else if (id == 1) {
					this.mytype = 1
					this.listRequest(1, this.myAddress)
				} else if (id == 2) {
					this.mytype = 3
					this.listRequest(3, this.myAddress)
				}
			},
			search() {
				this.$router.push({
					name: 'search',
					query: {
						owneradd: this.myAddress
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
		components: {
			footBar
		}
	}
</script>
<style scoped>
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

	.contenttop {
		width: 100%;
		height: 250px;
		background-image: url(../assets/images/mybg.png);
		background-size: 100% 100%;
		background-repeat: no-repeat;
	}

	.contenttitle {
		width: 100%;
		height: 24px;
		font-size: 18px;
		color: #333333;
		line-height: 24px;
		padding: 36px 0 42px 0;
		text-align: center;
	}

	.contenttitle span:nth-child(1) {
		float: left;
		color: transparent;
	}

	.contenttitle span {
		justify-content: space-between;
		width: 30%;
		text-align: center;
	}

	.contenttitle span:nth-child(3) {
		float: right;
	}

	.userInfobox {
		width: 327px;
		margin: 0 auto;
		padding: 16px 10px;
		background: rgba(255, 255, 255, 0.6);
		box-shadow: inset 2px 2px 4px 0px rgba(255, 255, 255, 0.5), inset -2px -2px 4px 0px rgba(0, 0, 0, 0.05);
		border-radius: 8px;
		backdrop-filter: blur(1px);
	}

	.userInfoboxl img {
		width: 60px;
		height: 60px;
		border: 1px solid #979797;
		border-radius: 50%;
		display: inline-block;
	}

	.userInfoboxr,
	.userInfoboxl {
		display: inline-block;
		vertical-align: middle;
	}

	.userInfoboxrb {
		width: 244px;
		height: 45px;
		background: #FFFFFF;
		box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.1);
		border-radius: 8px;
		margin-left: 10px;
		display: inline-flex;
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
		/* margin-bottom: 50px; */
	}
.van-list{
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
		vertical-align: top;
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

	/deep/.van-tabs--line .van-tabs__wrap {
		height: 30px;
	}

	/deep/.van-tabs__line {
		background: #FAC32D;
	}

	/deep/.van-tab {
		font-size: 13px;
		color: #666666;
	}

	/deep/.van-tab--active {
		font-size: 14px;
		color: #333333;
	}
</style>
