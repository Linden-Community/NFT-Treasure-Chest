<template>
	<div :class="sellList==''?'wrap':'wrapbg'">
		<div class="contenttop">
			<div class="contenttitle">
				<span @click="search">
					<img src="../assets/images/search.png" />
				</span>
				<span>My list</span>
				<span @click="buylist">
					<img src="../assets/images/list.png" />
				</span>
			</div>
			<div class="userInfobox">
				<div class="userInfoboxl"><img src="../assets/images/logoicon.png"></div>
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
					<div v-if="sellList.length==0 && emptyflag == 1" class="nolist">
						<div><img src="../assets/images/nolist.png" /></div>
						<div>No items to display</div>
					</div>
					<div v-else>
						<van-list v-model:loading="loading" :finished="finished" :finished-text="finishedText"
							@load="onMore" loading-text="Loading">
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
											<span class="oneboxrtl oneboxrtname">{{item.name}}</span>
											<span
												class="oneboxrtr">{{item.creator==null?'itemcreator':item.creator | ellipsis}}</span>
										</div>
										<div class="oneboxrc">
											<span class="oneboxrtl">{{`#${item.tokenId}`}}</span>
										</div>
										<!-- <div class="oneboxrb">
											<span class="oneboxrbl">Purchase time</span>
											<span class="oneboxrbr"></span>
										</div> -->
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
											<span class="oneboxrtl oneboxrtname">{{item.name}}</span>
											<span
												class="oneboxrtr">{{item.creator==null?'itemcreator':item.creator | ellipsis}}</span>
										</div>
										<div class="oneboxrc">
											<span class="oneboxrtl">{{`#${item.tokenId}`}}</span>
											<span class="oneboxrtr">
												<img :src="sellList==''?'':require('../assets/images/icon1.png')" />
												{{item.price==null?'':item.price }}</span>
										</div>
										<div class="oneboxrb">
											<span class="oneboxrbl">{{sellList==''?'':'End time'}}</span>
											<span
												class="oneboxrbr">{{item.offSheftTime!=null?item.offSheftTime.substring(0,16):''}}</span>
										</div>
									</div>
								</div>
							</div>
							<!-- <div v-else-if="index==2" class="onebox">
								<div class="oneboxcell" v-for="(item,index) in sellList" :key='index' :title="item" @click="gotosell(item)">
									<div class="oneboxl">
										<img v-if="item.image==null" src="../assets/images/zw.png">
										<img v-else :src="item.image">
									</div>
									<div class="oneboxr">
										<div class="oneboxrt">
											<span class="oneboxrtl oneboxrtname">{{item.name}}</span>
											<span class="oneboxrtl">{{`#${item.tokenId}` | ellipsis}}</span>
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
							</div> -->
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
				finishedText: '',
				mytype: 0,
				emptyflag: 0, //接口0调用前1调用后
				index: '',
			}
		},
		beforeRouteEnter(to, from, next) {
			next(vm => { //  这里的vm指的就是vue实例，能够用来当作this使用
				console.log(to)
				console.log(from)
				if (from.name == 'shopDetail' && from.query.ispage =='me') {
					vm.active = 1
				} else {
					vm.active = 0
				}	
			})
		},
		mounted() {
			
			
		},
		watch:{
			active(active,activenew){
				console.log(this.active)
				if(this.active==1){
					this.mytype = 1
				}else{
					this.mytype = 0
				}
				this.myAddress = sessionStorage.getItem("myAddress")
				this.getSellNum(this.myAddress)
				console.log(this.mytype,this.active,this.index)
				this.listRequest(this.mytype, this.myAddress)
			}	
		},
		methods: {
			onMore() {
				let times = setTimeout(() => {
					this.page += 1 //每请求一次，页面数+1
					this.listRequest(this.mytype, this.myAddress)
					console.log(this.sellList,1111)
				}, 500)
			},
			//复制
			copyClick(txt) {
				this.$copyText(txt).then(() => {
					this.$toast('Successfully copied to clipboard')
				}).catch(() => {
					this.$toast('Copy failed')
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
						var tabtwo = `On shelves(${res.result.hasBeenOn})`
						//var tabthree = `All(${res.result.notOn+res.result.hasBeenOn})`
						//this.tablist = [tabone, tabtwo, tabthree]
						this.tablist = [tabone, tabtwo]
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
				this.emptyflag = 0
				listSell(params).then(res => {
					this.emptyflag = 1
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
							this.finishedText = 'No more...'
							return
						} else {
							this.finished = false;
						}
						console.log(this.sellList,1111)
					} else {
						this.$toast(res.message)
					}
				})
			},
			getInfo(id) {
				this.active = id
				this.page = 1
				this.loading = true
				this.finished = false
				if (id == 0) {
					this.mytype = 0
					this.listRequest(0, this.myAddress)
				} else if (id == 1) {
					this.mytype = 1
					this.listRequest(1, this.myAddress)
				} 
			},
			search() {
				this.$router.push({
					name: 'searchmy',
					query: {
						owneradd: this.myAddress,
					}
				})
			},
			buylist() {
				this.$router.push({
					name: 'transactionList',
					query: {
						owner: this.myAddress
					}
				})
			},
			gotosell(item) {
				if (item.price == null || this.mytype == 0) {
					this.$router.push({
						name: 'sellDetail',
						query: {
							userId: item.id
						}
					})
				} else {
					this.$router.push({
						name: 'shopDetail',
						query: {
							userId: item.id,
							ispage: 'me'
						}
					})
				}
			}
		},
		components: {
			footBar
		}
	}
</script>
<style scoped>
	.wrapbg {
		background: #FFFFFF;
		height: 100vh;
	}

	.wrap {
		background: #F7F7F7;
		height: 100vh;
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

	.contenttop {
		width: 100%;
		height: 250px;
		background-image: url(../assets/images/mybg.png);
		background-size: 100% 100%;
		background-repeat: no-repeat;
	}

	.contenttitle {
		/* width: 100%; */
		height: 24px;
		font-size: 18px;
		color: #333333;
		line-height: 24px;
		padding: 36px 20px 42px 20px;
		text-align: center;
	}

	.contenttitle img {
		width: 20px;
		height: 20px;
	}

	.contenttitle span:nth-child(1) {
		float: left;
	}

	.contenttitle span {
		justify-content: space-between;
		/* width: 30%; */
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

	.van-list {
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

	.imgobject {
		object-fit: cover;
		object-position: 50% 50%;
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
		vertical-align: top;
	}

	.oneboxrtr,
	.oneboxrbr {
		float: right;
		display: inline-block;
		vertical-align: top;
	}

	.oneboxrtl {
		font-size: 13px;
		line-height: 14px;
		color: #333333;
		vertical-align: top;
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
		vertical-align: top;
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
