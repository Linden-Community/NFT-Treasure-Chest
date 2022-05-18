<template>
	<div class="wrap">
		<div class="headerbox">
		<van-nav-bar title="NFT details" left-arrow @click-left="backup" />
		</div>
		<div class="contentone">
			<div class="onecell"><span class="onecelll">Minted by</span><span
					@click="gootheraddress(detaillist.creator)"
					class="onecellr">{{detaillist.creator==null?'creator':detaillist.creator | ellipsis}}</span></div>
			<div class="twocell"><span class="twocelll">{{detaillist.name==null?'name':detaillist.name}}</span>
			<!-- <span class="twocellr">#{{detaillist.tokenId}}</span> -->
			</div>
			<div class="threecell">
				<img v-if="detaillist.image==null" src="../assets/images/zw.png" />
				<img v-else :src="detaillist.image" />
			</div>
			<div class="fourcell">
				<div class="fourcelll">
					<span class="fourcellone">Owned by</span>
					<span class="fourcelltwo"
						@click="gootheraddress(detaillist.owner)">{{detaillist.owner==null?'detaillistowner':detaillist.owner | ellipsis}}</span>
				</div>
				<div class="fourcellr">End date{{detaillist.offSheftTime!=null?detaillist.offSheftTime.substring(0,16):''}}</div>
			</div>
		</div>
		<div class="contenttwo">
			<div class="contenttwoo">Current price</div>
			<div class="contenttwot">
				<div class="contenttwotl">
					<span><img src="../assets/images/icon1.png"></span>
					<span class="spantwo">{{detaillist.price==null?'0.00':detaillist.price}}</span>
					<span v-if="detaillist.uprice!=null" class="spanthree">{{`（$${detaillist.uprice==null?'':detaillist.uprice}）`}}</span>
				</div>
				<div v-if="detaillist.owner != myaddress" class="contenttwotr" @click="buyClick" v-throttle="3000">Buy now</div>
				<div v-else class="contenttwotrn">Buy now</div>
			</div>
			<div>
				<van-collapse v-model="activeNames">
					<van-collapse-item title="Introduction to the works" name="0" icon="smile-comment-o" class='mycell'>
						<div class="descriptionbox">{{detaillist.description==''?'No details yet':detaillist.description}}</div>
					</van-collapse-item>
					<van-collapse-item title="Details of the works" name="1" icon="coupon-o" class='mycell'>
						<van-cell title="Contract address">
							<template #right-icon>
								<span
									class="copyadd">{{detaillist.contract==null?'detaillistcontract':detaillist.contract | ellipsis }}</span>
								<img class="copyimg" @click="copyclick(detaillist.contract)" src="../assets/images/copy.png">
							</template>
						</van-cell>
						<van-cell title="Token ID">
							<template #right-icon>
								<span
									class="copyadd">{{detaillist.tokenId==null?'detaillisttokenId':detaillist.tokenId | ellipsis }}</span>
								<img class="copyimg" @click="copyclick(copyIds)" src="../assets/images/copy.png">
							</template>
						</van-cell>
						<van-cell title="Token standard" value="ERC-721" />
						<van-cell title="Blockchain" value="BNB" />
					</van-collapse-item>
					<van-list v-model:loading="loading" :finished="finished" @load="onMore" loading-text="Loading">
						<van-collapse-item title="Price history" name="2" icon="todo-list-o" class='mycell'>
							<van-row justify="space-between">
								<van-col span="6">Current price</van-col>
								<van-col span="6">From</van-col>
								<van-col span="6">To</van-col>
								<van-col span="6">Date</van-col>
							</van-row>
							<div v-if="datalist.length==0" class="nodata">No deal</div>
							<div v-else class="hasdata">
							<van-row justify="space-between" v-for="(item,index) in datalist" :key='index'>
									<van-col span="6">{{item.price}}</van-col>
									<van-col span="6"><span class="addurl"
											@click="gootheraddress(item.buyFrom)">{{item.buyFrom | ellipsis}}</span></van-col>
									<van-col span="6"><span class="addurl"
											@click="gootheraddress(item.buyTo)">{{item.buyTo | ellipsis}}</span></van-col>
									<van-col span="6">{{item.createTime.substring(0, item.createTime.indexOf(' '))}}</van-col>
							</van-row>
							</div>
						</van-collapse-item>
					</van-list>
				</van-collapse>
			</div>
		</div>
	<van-loading v-show="pageLoading" type="spinner" size="24px" class="loadingbox" van-loading  color="#0094ff"/>
	</div>
</template>
<script>
	import Vue from 'vue'
	import Abi from '../json/Abi.js'
	import BigNumber from "bignumber.js"
	import {
		Collapse,
		CollapseItem,
		Cell,
		Col,
		Row,
		NavBar,
		List,
		Loading
	} from 'vant'
	Vue.use(Collapse).use(CollapseItem).use(Cell).use(Col).use(Row).use(NavBar).use(List).use(Loading)
	import {
		listLog,
		getNft,
	} from "../api";
	export default {
		data() {
			return {
				activeNames: [0],
				datalist: [],
				detaillist: [],
				copyIds:'',
				page: 1,
				num: 10,
				loading: false,
				finished: false,
				pageLoading:false,
				myaddress:sessionStorage.getItem('myAddress'),
				ispage:'',
				chainId:'',
			}
		},
		created() {
			this.getChainId()
		},
		mounted() {
			//sessionStorage.setItem('shopdelpage', 'shopdelpage')
			this.detailNft(this.$route.query.userId)
			this.ispage = this.$route.query.ispage
		},
		methods: {
			backup(){
				if(this.ispage=='me'){
					this.$router.push({
						name: 'me',
						ispage:'me'
					})
				}else if(this.ispage=='home'){
					this.$router.push({
						name: 'Home',
					})
				}else{
					this.$router.back()
				}
			},
			onMore() {	
				if(this.detaillist!=''){
					this.page++
					this.loglist()
				}
			},
			copyclick(txt) {
				console.log(txt)
				this.$copyText(txt).then(() => {
					this.$toast('Successfully copied to clipboard')
				}).catch(() => {
					this.$toast('Copy failed')
				})
			},
			//跳转他人地址
			gootheraddress(address) {
				if(address==this.myaddress){
					this.$router.push({
						name: 'me',
						query: {
							address: address,
							ispage:'shopdeil'
						}
					})
				}else{
					this.$router.push({
						name: 'otherList',
						query: {
							address: address
						}
					})
				}
				
			},
			async getChainId(){
				this.chainId =await ethereum.request({ method: 'eth_chainId' })
			},
			//购买
			buyClick() {
				if((this.chainId=='0x61' && this.$store.state.choosenetwork =='56')||(this.chainId=='0x38' && this.$store.state.choosenetwork=='97')){
					return	this.$toast('Wallet network is inconsistent with Open NFT network, please reselect; To use Open NFT, switch to (BSC Mainnet) or (BSC Testnet)')
				}
				if (window.ethereum) {
					window.ethereum.enable().then((res) => {
						if (!res[0]) {
							this.$toast('Please log in to little fox first')
						} else {
							const web3 = new this.Web3(window.web3.currentProvider)
							//合约地址测试
							const address =this.$store.state.choosenetwork=='56'?'0xAcD1fD491Eb468f93209F2e63cCFdc9926af7731':'0x1A3B441D42F733fbC55774456D62081CAd462c3C'
							const myContract = new web3.eth.Contract(Abi, address)
							myContract.methods.getOffShelfTime(this.detaillist.contract,this.detaillist.tokenId).call().then(
							timesTamp => {
								//获取当前时间戳单位毫秒
								var dataTime = new Date().getTime()
								//当前时间戳与上架时间（秒）相比
								console.log('from timesTamp :' + timesTamp, dataTime)
								if (timesTamp * 1000 - dataTime > 0) {
									console.log(timesTamp * 1000 - dataTime)
									//商品未下架获取商品价格
									//NFT上架价格
									myContract.methods.getPrices(this.detaillist.contract,this.detaillist.tokenId).call().then(
										prices => {
											console.log('from prices :' + prices)
											var myvalue = BigNumber(prices)
											this.pageLoading = true
											//var myvalue = BigNumber(web3.utils.toWei(this.detaillist.price.toString(), 'ether'))
											//购买NFT 获取是否授权（授权在上架商品时操作只需操作一次 获取时间戳 获取价格 
											myContract.methods.buy(this.detaillist.contract,this.detaillist.tokenId).send({
												from: res[0],
												value: myvalue//动态获取商品价格
											}).then(res => {
												console.log('from res :' + res)
												if (JSON.stringify(res.status) == 'true') {
													this.$toast('Authorization succeeded')
													console.log("success")
													//刷新页面
													//location.reload()
													this.pageLoading = false
													this.$router.push('me') 
												} else {
													this.$toast(res.message)
													console.log(res.message)
												}
											}).catch((error) => {
												this.pageLoading = false
												//this.$toast(error.message)
											})
										})
									
								} else {
									console.log(timesTamp * 1000 - dataTime)
									this.$toast('The product has been taken off the shelf')
								}
							})
						}
					})
				} else {
					this.$toast('Please install metamask before the browser can be used.');
				}
			},
			detailNft(userId) {
				const params = {
					id: userId,
				}
				getNft(params).then(res => {
					if (res.code == "200") {
						this.detaillist = res.result
						this.copyIds = res.result.tokenId
						this.loglist()
					} else {
						this.$toast(res.message)
					}
				})
			},
			loglist() {
				const params = {
					chainId:this.$store.state.choosenetwork,
					pageNo: this.page,
					pageSize: this.num,
					tokenId: this.detaillist.tokenId,
					contract: this.detaillist.contract,
				}
				listLog(params).then(res => {
					if (res.code == "200") {
						if (this.page == 1) {
							this.datalist = res.result.list
						}else{
							this.datalist = this.datalist.concat(res.result.list)
						}
						this.loading = false
						if (res.result.list.length == 0 || res.result.list.length < 10) {
							this.finished = true
							return
						}	
					} else {
						this.$toast(res.message)
					}
				})
			}
		},
	}
</script>
<style scoped>
	.hasdata{
		margin: 10px auto;
	}
	.nodata{
		margin: 10px auto;
		text-align: center;
	}
	.headerbox {
		position: fixed;
		width: 100%;
		top:0;
		border-bottom: 10px solid #F7F7F7;
	}
	.addurl {
		border-bottom: 1px solid #333333;
	}

	.contentone {
		border-bottom: 10px solid #F7F7F7;
		padding: 20px 16px 10px 16px;
		margin-top: 45px;
	}

	.onecelll {
		height: 14px;
		font-size: 14px;
		font-family: SourceHanSansCN-Regular, SourceHanSansCN;
		font-weight: 400;
		color: #666666;
		line-height: 21px;
	}

	.onecellr {
		float: right;
		text-align: right;
		color: #FF5603;
		font-size: 12px;
		width: 200px;
		margin-top: 5px;
	}

	.twocell {
		margin: 8px 0;
	}

	.twocelll {
		max-width: 100%;
		height: 20px;
		font-size: 17px;
		font-family: SourceHanSansCN-Medium, SourceHanSansCN;
		font-weight: 500;
		color: #333333;
		/* overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap; */
		display: inline-block;	
	}

	.twocellr {
		float: right;
		/* margin-top: 3px; */
	}

	.threecell {
		width: 100%;
	}
	.imgobject {
		object-fit: cover;
		object-position: 50% 50%;
	}
	.threecell img {
		width: 100%;
		/* height: 300px; */
		margin: 0 auto;
	}

	.fourcell {
		margin: 0 auto;
		height: 35px;
		background: #FFFFFF;
		font-size: 12px;
		font-weight: 400;
		line-height: 35px;
		font-family: SourceHanSansCN-Regular, SourceHanSansCN;
	}

	.fourcelll {
		display: inline-block;
	}

	.fourcellone {
		color: #666666;
	}

	.fourcelltwo {
		margin-left: 5px;
		color: #FF5603;
	}

	.fourcellr {
		color: #999999;
		float: right;
		display: inline-block;
		font-size: 10px;
	}

	.contenttwo {
		background: #FFFFFF;
	}

	.contenttwoo {
		font-size: 13px;
		color: #000000;
		line-height: 20px;
		padding: 10px 20px 0 20px;
	}

	.contenttwot {
		height: 50px;
		line-height: 50px;
		display: flex;
		border-bottom: 0.026667rem solid #D8D8D8;
		padding: 0px 20px 0 20px;
	}

	.contenttwotl {
		width: 350px;
	}

	.contenttwotl img {
		width: 24px;
		height: 24px;
		vertical-align: middle;
	}

	.spantwo {
		font-size: 20px;
		font-family: SourceHanSansCN-Medium, SourceHanSansCN;
		font-weight: 500;
		color: #F4BB0B;
		vertical-align: middle;
		margin: 0 5px;
	}

	.spanthree {
		font-size: 11px;
		font-family: SourceHanSansCN-Normal, SourceHanSansCN;
		font-weight: 400;
		color: #000000;
		vertical-align: middle;
	}

	.contenttwotr {
		float: right;
		width: 105px;
		height: 27px;
		line-height: 27px;
		background: #FADD5C;
		border-radius: 8px;
		font-family: SourceHanSansCN-Regular, SourceHanSansCN;
		font-weight: 400;
		color: #000000;
		text-align: center;
		font-size: 13px;
		margin-top: 10px;
	}
.contenttwotrn{
	float: right;
	width: 105px;
	height: 27px;
	line-height: 27px;
	background: #CCCCCC;
	border-radius: 8px;
	font-family: SourceHanSansCN-Regular, SourceHanSansCN;
	font-weight: 400;
	color: #FFFFFF;
	text-align: center;
	font-size: 13px;
	margin-top: 10px;
}
	.mycell {
		background-color: #FFFFFF;
	}
.descriptionbox{
	padding: 10px 20px;
	background: #F7F7F7;
	font-size: 12px;
	color: #666666;
}
	.copyadd {
		font-size: 12px;
		color: #999999;
		width: 150px;
		text-align: right;
		margin-right: 5px;
	}

	.copyimg {
		width: 16px;
		height: 16px;
		margin-top: 5px;
	}

	/deep/ .van-collapse-item__content {
		padding: 0;
	}

	/deep/.van-cell {
		font-size: 12px;
	}

	/deep/.van-cell::after {
		border-bottom: none;
	}

	/deep/.van-collapse-item--border::after {
		border-top: none;
	}

	/deep/.van-hairline--top-bottom::after,
	.van-hairline-unset--top-bottom::after {
		border-width: 0;
	}

	/deep/.van-nav-bar .van-icon {
		color: #000000;
	}

	.van-col {
		text-align: center;
		font-size: 11px;
		color: #666666;
		margin-top: 8px;
	}
	.loadingbox{
		width: 100%;
		position: fixed;
		top:50%;
		text-align: center;
	}
</style>
