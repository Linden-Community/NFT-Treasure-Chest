<template>
	<div class="wrap">
		<div class="headerbox">
			<van-nav-bar title="List of NFT" @click-right="onClickRight">
				<template #left>
					<div class="navbarleft" @click="isshowmenu">
						<img src="../assets/images/navleft.png" />
						<span>{{switchTitle}}</span>
						<van-icon name="arrow-down" size="14" />
					</div>
				</template>
				<template #right>
					<van-icon name="search" size="25" />
				</template>
			</van-nav-bar>
		</div>
		<div v-if="shoplist.length==0 && emptyflag == 1" class="nolist">
			<div><img src="../assets/images/nolist.png" /></div>
			<div>No items to display</div>
		</div>
		<!-- 列表 -->
		<div class="content-box" v-else>
			<van-list v-model:loading="loading" loading-text='Loading' :finished="finished"
				:finished-text="finishedText" @load="onMore">
				<div class="content-boxleft" v-for="(item,index) in shoplist" :key='index' @click="godetail(item)">
					<!-- item.image -->
					<!-- <img v-if="item.image==null" class="boximg" src="../assets/images/zw.png" />
					<img v-else class="boximg" :src="item.image" /> -->
					<div class="boximg" :style="{'background-image':'url('+item.image+')'}"></div>
					<div class="boxleft">
						<span class="boxleftonel omit">{{item.name==null?'name':item.name}}</span>
						<!-- <span class="boxleftoner">Price</span> -->
					</div>
					<div class="boxleft">
						<span class="boxlefttwol">Price</span>
						<span class="boxlefttwor omit"><img src="../assets/images/icon1.png">{{item.price}}</span>
					</div>
					<div class="boxleft">
						<span class="boxleftthreel">End date</span>
						<span
							class="boxleftthreer">{{item.offSheftTime.substring(0, item.offSheftTime.indexOf(' '))}}</span>
					</div>
				</div>
			</van-list>
			<van-action-sheet v-model:show="isshowpop" title="Network switching">
				<div class="menulistbox">
					<!-- <van-dropdown-menu active-color="#1989fa">
				  	 <van-dropdown-item :title="switchTitle" v-model="switchVal" :options="option1" @change="changemenu"/>
				  </van-dropdown-menu> -->
					<span class="menutitle">Mainnet</span>
					<div class="menulist" v-for="(item,index) in option1" @click="choose(item,index,1)">
						<img :src="item.image"/>
						<span :class="index!=0?'nochoose':'choose'">{{item.text}}</span>
						<img :class="choosebtn==1&& index==0?'rightchoose':'rightchooseno'" src="../assets/images/choose.png"/>
					</div>
					<span class="menutitle">Testnet</span>
					<div class="menulist" v-for="(item,index) in option2"  @click="choose(item,index,2)">
						<img :src="item.image"/>
						<span :class="index!=0?'nochoose':'choose'">{{item.text}}</span>
						<img :class="index==0 && choosebtn==2?'rightchoose':'rightchooseno'" src="../assets/images/choose.png"/>
					</div>
				</div>
			</van-action-sheet>

		</div>
		<foot-bar v-if="$route.meta.isMenu"></foot-bar>
	</div>
</template>
<script>
	import Abi from '../json/Abi.js'
	import AbiNft from '../json/AbiNft.js'
	import footBar from '../components/footBar'
	import Vue from 'vue'
	import {
		NavBar,
		Icon,
		List,
		DropdownMenu,
		DropdownItem,
		ActionSheet,
	} from 'vant'
	Vue.use(NavBar).use(Icon).use(List).use(DropdownMenu).use(DropdownItem).use(ActionSheet)
	import {
		getShopDetail,
		listNft
	} from "../api";
	export default {
		data() {
			return {
				myShop: [],
				shopImage: '',
				shoplist: [],
				page: 1,
				num: 10,
				loading: false,
				finished: false,
				finishedText: '',
				emptyflag: 0, //接口0调用前1调用后
				isshowpop: false,
				option1: [{
						text: 'BSC Mainet',
						value: 56,
						image:require('../assets/images/navleft.png'),
						id:0,
					},
					{
						text: 'Ethereum Mainnet',
						value: 0,
						image:require('../assets/images/icon2.png'),
						id:1,
					},
					{
						text: 'Filecoin Mainnet',
						value: 0,
						image:require('../assets/images/icon3.png'),
						id:2,
					},
					{
						text: 'Polygon Mainnet',
						value: 0,
						image:require('../assets/images/icon4.png'),
						id:3,
					},
				],
				option2: [{
						text: 'BSC Testnet',
						value: 97,
						image:require('../assets/images/navleft.png')
					},
					{
						text: 'Rinkeby',
						value: 0,
						image:require('../assets/images/icon2.png')
					},
					{
						text: 'Filecoin Testnet',
						value: 0,
						image:require('../assets/images/icon3.png')
					},
					{
						text: 'Mumbai',
						value: 0,
						image:require('../assets/images/icon4.png')
					},
				],
				switchTitle: 'BSC Mainet',
				switchVal: 56,
				choosebtn:1

			}
		},
		created() {
			this.listRequest()
			this.empower() //授权账户
		},
		methods: {
			isshowmenu() {
				this.isshowpop = true
			},
			choose(item,index,type){
				console.log(this.$myContent.choosenetwork,222)
				this.choosebtn=type
				if(type==1&&index==0){
					this.switchTitle = item.text
					this.switchVal = item.value
					this.$myContent.setNetwork(item.value);
				}else if(type==2&&index==0){
					this.switchTitle = item.text
					this.switchVal = item.value
					this.$myContent.setNetwork(item.value);
				}
				console.log(this.$myContent.choosenetwork,222)
			},
			//切换链地址
			// changemenu(value) {
			// 	this.switchTitle = this.option1.filter(item => item.value === this.option1.value).text
			// 	this.switchVal = value
			// 	console.log(this.switchVal)
			// },

			onMore() {
				let times = setTimeout(() => {
					this.page += 1 //每请求一次，页面数+1
					//this.listRequest()
				}, 3000)
			},
			//nft列表
			listRequest() {
				const params = {
					pageNo: this.page,
					pageSize: this.num,
				}
				this.emptyflag = 0
				listNft(params).then(res => {
					this.emptyflag = 1
					if (res.code == '200') {
						this.loading = false
						if (this.page == 1) {
							this.shoplist = res.result.list
						} else {
							this.shoplist = this.shoplist.concat(res.result.list)
							//this.shoplist = [...this.shoplist, ...res.result.list]
						}
						if (res.result.list.length == 0 || res.result.list.length < 10) {
							this.finished = true
							this.finishedText = 'No more...'
						} else {
							this.finished = false
						}
					} else {
						this.$toast(res.message)
					}
				})
			},
			//跳转详情
			godetail(item) {
				this.$router.push({
					path: 'shopDetail',
					query: {
						userId: item.id,
						ispage: 'home'
					}
				})
				// this.$router.push({
				// 	name: 'shopDetail',
				// 	params: {
				// 		userId: item.id
				// 	}
				// })
			},
			//跳转搜索
			onClickRight() {
				this.$router.push({
					name: 'search',
					query: {
						owneradd: '1',
					}
				})
			},
			//钱包账户授权
			empower() {
				if (window.ethereum) {
					window.ethereum.enable().then((res) => {
						if (!res[0]) {
							this.$toast('Please log in to little fox first')
						}
						sessionStorage.setItem("myAddress", res[0])
					})
				} else {
					this.$toast('Please install metamask before the browser can be used.');
				}
			},
			//商品描述
			des() {
				//var api ='http://dweb.lindensys.cn/ipns/k51qzi5uqu5divqrok0get110odatax0tv8uqh3forzp1zhoxy7ft7cua188gt/babaofan/110'
				getShopDetail('/100').then(res => {
					this.myShop = res
					this.shopImage = res.image
					console.log("数据", res, 111)
				})
			},
		},
		components: {
			footBar
		}
	}
</script>
<style scoped>
	.headerbox {
		position: fixed;
		width: 100%;
		z-index: 9999;
	}

	.navbarleft img {
		width: 15px;
		height: 15px;
		vertical-align: middle;
	}

	.navbarleft span {
		font-size: 11px;
		color: #333333;
		line-height: 33px;
		vertical-align: middle;
		margin: 0 2px;
	}

	/deep/.van-icon-arrow-down::before {
		margin-top: 2px;
		vertical-align: top;
	}
.menulistbox{
	margin: 16px;
}
.menutitle{
	font-size: 12px;
	color: #666666;
	line-height: 36px;
}
.menulist img{
	width: 16px;
	height: 16px;
	vertical-align: middle;
}
.rightchoose {
	float: right;
	vertical-align: top;
	margin-top: 5px;
}
.rightchooseno{
	display: none;
}
.choose{
	font-size: 13px;
	font-weight: bold;
	color: #333333;
	line-height: 39px;
	vertical-align: middle;
	margin-left: 5px;
}
.nochoose{
	font-size: 13px;
	font-weight: 400;
	color: #666666;
	line-height: 39px;
	vertical-align: middle;
	margin-left: 5px;
}
	.nolist {
		background: #F7F7F7;
		width: 100%;
		height: 100vh;
	}

	.nolist img {
		/* width: 105px; */
		height: 105px;
		margin-top: 200px;
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

	.content-box {
		border-top: solid 10px #F7F7F7;
		padding: 10px 16px 50px 16px;
		position: relative;
		top: 45px;
	}

	.content-boxleft {
		width: 48%;
		height: 235px;
		margin: 0 0 10px 0;
		display: inline-block;
		background: #FFFFFF;
		box-shadow: 0px 0px 8px 2px rgba(0, 0, 0, 0.1);
		border-radius: 10px;
	}

	.content-boxleft:nth-child(2n) {
		float: right
	}

	.boximg {
		/* object-fit:cover;
		object-position:100% 100%; */
		/* width: 100%; */
		height: 163px;
		height: 163px;
		background-size: contain;
		background-repeat: no-repeat;
		border-radius: 3px 3px 0 0;
		background-position: center
	}

	.boxleft {
		margin: 8px 10px;
		font-size: 12px;
	}

	.boxleftonel {
		font-size: 13px;
		max-width: 145px;
		color: #333333;
		line-height: 15px;
	}

	.boxleftoner {
		color: #999999;
		float: right;
		text-align: right;
	}

	.boxlefttwol {
		color: #333333;
		width: 50px;
	}

	.boxlefttwor {
		color: #F4BB0B;
		float: right;
		width: 80px;
		text-align: right;
	}

	.boxlefttwor img {
		width: 12px;
		height: 12px;
		vertical-align: top;
		margin-right: 2px;
	}

	.boxleftthreel {
		color: #999999;
		width: 50px;
	}

	.boxleftthreer {
		color: #999999;
		float: right;
		width: 80px;
		text-align: right;
	}

	.omit {
		height: 15px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		display: inline-block;
	}

	/deep/.van-nav-bar .van-icon {
		color: #000000;
	}

	/deep/.van-dropdown-menu__bar {
		box-shadow: none;
	}
	/deep/.van-popup--bottom{
		width: 96%;
		left: 2%;
		margin: 0 auto;
	}
	/deep/.van-overlay{
		background: rgba(4, 4, 4, 0.21);
	}
</style>
