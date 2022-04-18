<template>
	<div class="wrap">
		<van-nav-bar title="List of NFTs" @click-right="onClickRight">
			<template #right>
				<van-icon name="search" size="25" />
			</template>
		</van-nav-bar>
		<div v-if="shoplist.length==0" class="nolist">
			<div><img src="../assets/images/nolist.png" /></div>
			<div>No items to display</div>
		</div>
		<!-- 列表 -->
		<div class="content-box" v-else>
			<div class="content-boxleft" v-for="(item,index) in shoplist" :key='index' @click="godetail(item)">
				<!-- item.image -->
				<img v-if="item.image==null" class="boximg" src="../assets/images/nolist.png" />
				<img v-else class="boximg" :src="item.image" />
				<div class="boxleft">
					<span class="boxleftonel">User name</span>
					<span class="boxleftoner">Price</span>
				</div>
				<div class="boxleft">
					<span class="boxlefttwol omit">{{item.name==null?'name':item.name}}</span>
					<span class="boxlefttwor omit"><img src="../assets/images/icon1.png">{{item.price}}</span>
				</div>
				<div class="boxleft">
					<span class="boxleftthreel omit">#{{item.tokenId}}</span>
					<span class="boxleftthreer omit">{{item.offSheftTime}}</span>
				</div>
			</div>
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
		Icon
	} from 'vant'
	Vue.use(NavBar).use(Icon)
	import {
		getShopDetail,
		listNft
	} from "../api";
	export default {
		data() {
			return {
				myShop: [],
				shopImage: '',
				shoplist: []
			}
		},
		mounted() {
			this.listRequest()
			this.empower() //授权账户
		},
		methods: {
			//nft列表
			listRequest() {
				const params = {
					pageNo: 1,
					pageSize: 10,
				}
				listNft(params).then(res => {
					if (res.code == '200') {
						this.shoplist = res.result.list
					} else {
						this.$toast(res.message)
					}
				})
			},
			//跳转详情
			godetail(item) {
				//this.$router.push({path: 'shopDetail', query: {selected: "2"}})
				this.$router.push({
					name: 'shopDetail',
					params: {
						userId: item.id
					}
				})
			},
			//跳转搜索
			onClickRight() {
				this.$router.push({
					name: 'search',
					params: {
						owneradd: ''
					}
				})
			},
			//钱包账户授权
			empower() {
				if (window.ethereum) {
					window.ethereum.enable().then((res) => {
						if (!res[0]) {
							this.$toast('请先登录小狐狸')
						}
					})
				} else {
					this.$toast('请安装 MetaMask,浏览器才能开始使用。');
				}
			},
			
			get() {
				if (window.ethereum) {
					window.ethereum.enable().then((res) => {
						if (!res[0]) {
							this.$toast('请先登录小狐狸')
						} else {
							//this.getBalance(res[0], 11111)
							const web3 = new this.Web3(window.web3.currentProvider)
							const address = "0x0cd43FFF2a992E094E829B4b826fC67aBAe2D6E3"
							//合约地址
							const addressNFT = "0x250019C9E3EB59Ef6eFAB410408F6c8E246f5A24"
							const myContract = new web3.eth.Contract(Abi, address)
							const myContractNft = new web3.eth.Contract(AbiNft, addressNFT)
							//查询NFT余额
							myContract.methods.balanceOf(res[0]).call().then(balance => {
								console.log('from balance:' + balance)
							})
							//查询NFT授权
							myContract.methods.getApproved(104).call().then(address => {
								console.log('from address :' + address)
							})
							//读合约
							// myContract.methods.approve("0xaB069f281a15a3D0C2876F939331F4B63601cDBE", 106)
							// 	.send({
							// 		from: res[0]
							// 	}).then(res => {
							// 		console.log('from res :' + res)		
							// 	})
							//写合约
							// myContract.methods.safeTransferFrom(res[0],"0xaB069f281a15a3D0C2876F939331F4B63601cDBE", 106)
							// 	.send({
							// 		from: res[0]
							// 	}).then(res => {
							// 		console.log('from res :' + res)
							// 	})
							//查询归属人
							myContract.methods.ownerOf(110).call().then(ownerAddress => {
								console.log('from ownerAddress :' + ownerAddress)
							})
							//查询元数据
							myContract.methods.tokenURI(110).call().then(urlAddress => {
								console.log('from urlAddress :' + urlAddress)
							})
							//NFT下架时间戳
							// myContractNft.methods.getTimestamp(107).call().then(timesTamp => {
							// 	//获取当前时间戳单位毫秒
							// 	var dataTime = new Date().getTime()
							// 	//当前时间戳与上架时间（秒）相比
							// 	console.log('from timesTamp :' + timesTamp, dataTime)
							// 	if (timesTamp*1000 - dataTime > 0) {
							// 		//商品未下架获取商品价格
							// 		//NFT上架价格
							// 		myContractNft.methods.getPrices(110).call().then(prices => {
							// 			console.log('from prices :' + prices)
							// 		})
							// 		//购买NFT 获取是否授权（授权在上架商品时操作只需操作一次 获取时间戳 获取价格 
							// 		myContractNft.methods.buy(110)
							// 		.send({
							// 			from: res[0],
							// 			value:web3.utils.toWei('0.1', 'ether')//动态获取商品价格
							// 		}).then(res => {
							// 			console.log('from res :' + res)
							// 		})
							// 	} else {
							// 		this.$toast('商品已下架')
							// 	}
							// })
							//上架NFT商品
							//授权nft
							myContract.methods.approve("0x0cd43FFF2a992E094E829B4b826fC67aBAe2D6E3", 100)
								.send({
									from: res[0]
								}).then(res => {
									console.log('from res :' + res)
								}).catch((error) => {
									console.log("授权error--->" + error.code, error.message)
								})
							myContractNft.methods.sell(108, web3.utils.toWei('0.01', 'ether'), 360000)
								.send({
									from: res[0]
								}).then(res => {
									console.log('from res :' + res)
								}).catch((error) => {
									console.log("上架error--->" + error.code, error.message)
								})
						}
					})
				} else {
					this.$toast('请安装 MetaMask,浏览器才能开始使用。');
				}
			},
			//获取账号余额
			getBalance(address) {
				window.ethereum.request({
						method: 'eth_getBalance',
						params: [
							address,
							'latest'
						]
					})
					.then((result) => {
						console.log("获取余额success--->" + result)
						console.log(result)
						if (result < 0) {
							this.$toast('账户余额不足请先充值')
						} else {
							this.send()
						}
					})
					.catch((error) => {
						console.log("获取余额error--->" + error.code)
					});
			},
			//调用平台智能合约
			send() {
				let params = [{
					"from": "0x38e6ed533127698b7df183caae070cdde602a5e3",
					"to": "0x38e6ed533127698B7df183caAE070cDdE602A5E3",
					"gas": "100", // 30400
					"gasPrice": "1", // 30400
					"value": "1", // 30400
					"data": "0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675"
				}]
				window.ethereum.sendAsync({
					method: 'eth_sendTransaction',
					params: params,
					from: "0x38e6ed533127698b7df183caae070cdde602a5e3", // Provide the user's account to use.
				}, function(err, result) {
					console.log(err, result)
					// A typical node-style, error-first callback.
					// The result varies by method, per the JSON RPC API.
					// For example, this method will return a transaction hash on success.
				})
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
			//获取上架时间
			getTime() {

			},
			//获取价格
			getPrices() {

			},
			//获取归属人
			getPeople() {

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
		height: 90vh;
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

	.shopName {
		text-align: left;
		margin: 10px auto;
		width: 300px;
	}

	.shopDes {
		width: 300px;
		text-align: left;
		margin: 0 auto;
	}

	.content-box {
		border-top: solid 10px #F7F7F7;
		padding: 10px 16px 100px 16px;
	}

	.content-boxleft {
		width: 48%;
		height: 235px;
		margin: 0 0 10px 0;
		display: inline-block;
		background: #FFFFFF;
		box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.1);
		border-radius: 10px;
	}

	.content-boxleft:nth-child(2n) {
		float:right
	}

	.boximg {
		width: 100%;
		height: 163px;
	}

	.boxleft {
		margin: 8px 10px;
		font-size: 12px;
	}

	.boxleftonel {
		color: #666666;
	}

	.boxleftoner {
		color:#999999;
		float:right;
		text-align:right;
	}

	.boxlefttwol {
		color:#333333;
		width :50px;
	}

	.boxlefttwor {
		color: #F4BB0B;
		float: right;
		width:80px;
		text-align: right;
	}

	.boxlefttwor img {
		width: 12px;
		height: 12px;
		vertical-align: top;
		margin-right: 2px;
	}

	.boxleftthreel {
		color: #333333;
		width: 50px;
	}

	.boxleftthreer {
		color: #999999;
		float: right;
		width: 80px;
		text-align: right;
	}

	.omit {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		display: inline-block;
	}

	/deep/.van-nav-bar .van-icon {
		color: #000000;
	}
</style>