<template>
	<div class="wrap">
		<van-nav-bar title="NFT details" left-arrow @click-left="$router.go(-1)" />
		<div class="contentone">
			<div class="onecell"><span class="onecelll">Minted by</span><span @click="gootheraddress(detaillist.creator)" class="onecellr">{{detaillist.creator==null?'creator':detaillist.creator | ellipsis}}</span></div>
			<div class="twocell"><span class="twocelll">{{detaillist.name==null?'name':detaillist.name}}</span><span
					class="twocellr">#{{detaillist.tokenId}}</span></div>
			<div class="threecell"><img :src="detaillist.image" /></div>
			<div class="fourcell">
				<div class="fourcelll">
					<span class="fourcellone">Owned by</span>
					<span
						class="fourcelltwo" @click="gootheraddress(detaillist.owner)">{{detaillist.owner==null?'detaillistowner':detaillist.owner | ellipsis }}</span>
				</div>
				<div class="fourcellr">{{detaillist.offSheftTime}}</div>
			</div>
		</div>
		<div class="contenttwo">
			<div class="contenttwo1">
				<div class="contenttwooo">
					<div class="contenttwooot"><span class="contenttwoooto">Current Price</span><span
							class="contenttwooott">Fixed price</span></div>
					<div class="contenttwooob">
						<van-field v-model="amount" type="number" placeholder="Please enter the amount" />
						<span class="coinCompany">BNB</span>
					</div>
				</div>
				<div class="contenttwoot">
					<div class="contenttwooot"><span class="contenttwoooto">Listing cycle</span></div>
					<div class="contenttwooob">
						<van-field v-model="mychangedate" placeholder="Please enter the amount" disabled />
						<img src="../assets/images/timeicon.png" class="dateimg" @click="showdatebox" />
					</div>
					<div class="datatimebox" v-show="dateboxshow">
						<van-picker title="标题" :columns="columns" :default-index="0" @change="onChange" />
						<!-- <div class="datatimeboxt">
							<span>Days</span>
							<div :class="index==nowIndex?'checkedbox':'checkedboxno'" @click="checked(index,item)"
								v-for="(item,index) in daylist" :key='index'>{{item}} Day</div>
						</div>
						<div class="datatimeboxb">
							<div class="datatimeboxbo"><span>Start</span><span>End</span></div>
							<div class="datatimeboxbt">
								<span class="datatimeboxbtspan" @click="choosedatetime">1</span>
								<span>——</span>
								<span class="datatimeboxbtspan" @click="choosedatetime">1</span>
							</div>
							<div class="datatimeboxbe" v-show="datetimeshow">
								<van-datetime-picker v-model="currentDate" type="date" :min-date="minDate"
									:max-date="maxDate" />
							</div>
						</div> -->
						<div class="datatimeboxbf" @click="choosedatesub">Confirm</div>
					</div>
				</div>
			</div>
			<div class="contenttwoo">
				<span>Cost</span>
				<van-icon name="info-o" @click="icontip" />
				<span v-show="tipboxshow" class="tipbox">Listing is free. Once sold, the following fees will be
					deducted.</span>
			</div>
			<div class="contenttwot">
				<div class="contenttwotl">Service charge</div>
				<div class="contenttwotr">2%</div>
			</div>
			<div class="contenttwote">
				<van-collapse v-model="activeNames">
					<van-collapse-item title="Details of the works" name="1" class='mycell'>
						<!-- <van-cell title="Contract Address" :value="detaillist.contract" />
						<van-cell title="Token ID" :value="detaillist.tokenId" /> -->
						<van-cell title="Contract Address">
							<template #right-icon>
								<span class="copyadd">{{detaillist.contract==null?'detaillistcontract':detaillist.contract | ellipsis }}</span>
								<img class="copyimg" @click="copyclick(detaillist.contract)" src="../assets/images/copy.png">
							</template>
						</van-cell>
						<van-cell title="Token ID">
							<template #right-icon>
								<span class="copyadd">{{detaillist.tokenId==null?'detaillisttokenId':detaillist.tokenId | ellipsis }}</span>
								<img class="copyimg" @click="copyclick(copyIds)" src="../assets/images/copy.png">
							</template>
						</van-cell>
						
						<van-cell title="Token Standard" value="ERC-721" />
						<van-cell title="Blockchain" value="BNB" />
					</van-collapse-item>
				</van-collapse>
			</div>
		</div>
		<div class="sell" @click="sellsub">sell</div>
	</div>
</template>
<script>
	import Vue from 'vue'
	import {
		Collapse,
		CollapseItem,
		Cell,
		Field,
		CellGroup,
		Icon,
		Picker,
		NavBar
	} from 'vant'
	Vue.use(Collapse).use(CollapseItem).use(Cell).use(Field).use(CellGroup).use(Icon).use(Picker).use(NavBar)
	import {
		getNft
	} from "../api";
	import Abi from '../json/Abi.js'
	import AbiNft from '../json/AbiNft.js'
	import {
		addDate
	} from '../api/date.js'
	export default {
		data() {
			return {
				activeNames: [0],
				amount: '',
				detaillist: [],
				tipboxshow: false,
				//daylist: ['1', '3', '7', '30', '50', '180', ],
				//currentDate: true,
				minDate: new Date(2010, 0, 1),
				maxDate: new Date(2010, 0, 31),
				columns: [],
				//nowIndex: 0,
				//datetimeshow: false,//日期组件
				dateboxshow: false, //日期弹框快捷方式
				mydate: '1',
				mychangedate: '',
				shopid: '',
				mytime: '',
				copyIds:'',
			}
		},
		mounted() {
			this.shopid = this.$route.params.userId
			this.detailNft(this.$route.params.userId)
			this.putdate()
			this.mychangedate = addDate(new Date, parseInt(0)) + ' - ' + addDate(new Date, parseInt(0)) + ' ( 1 Day ) '
		},
		methods: {
			gootheraddress(address){
				console.log(address)
				this.$router.push({
					name: 'otherList',
					params: {
						address: address
					}
				})
			},
			//复制
			copyclick(txt){
				this.$copyText(txt).then(() => {
					this.$toast('已成功复制到剪切板')
				}).catch(() => {
					this.$toast('复制失败')
				})
			},
			// checked(index,item) {
			// 	this.nowIndex = index
			// 	this.mydate = item
			// },
			//大弹框
			showdatebox() {
				this.dateboxshow = !this.dateboxshow
			},
			//时间弹框
			// choosedatetime() {
			// 	this.datetimeshow = true
			// },
			icontip() {
				this.tipboxshow = !this.tipboxshow
			},
			putdate() {
				for (var i = 1; i <= 180; i++) {
					this.mychangedate = addDate(new Date, parseInt(i))
					var newdate = i + ' Day   ' + this.mychangedate
					this.columns.push(newdate)
				}
			},
			onChange(value, index) {
				this.mychangedate = addDate(new Date, parseInt(0)) + ' - ' + index.split(' ')[4] + ' (' + index.split(' ')[
					0] + index.split(' ')[1] + ')'
				this.mytime = index.split(' ')[0] * 24 * 60 * 60
				console.log(`当前值: ${value}, 当前索引: ${index}`, this.mytime);
			},
			//时间选择按钮
			choosedatesub() {
				this.dateboxshow = false
			},
			//商品详情
			detailNft(userId) {
				const params = {
					id: userId,
				}
				getNft(params).then(res => {
					if (res.code == "200") {
						this.detaillist = res.result
						this.copyIds = res.result.tokenId
					} else {
						this.$toast(res.message)
					}
				})
			},
			//上架
			sellsub() {
				if (this.amount == '' || this.amount < 0.0001 || this.amount > 9999.9999) {
					this.$toast('输入不正确，请重新输入')
				} else {
					if (window.ethereum) {
						window.ethereum.enable().then((res) => {
							if (!res[0]) {
								this.$toast('请先登录小狐狸')
							} else {
								const web3 = new this.Web3(window.web3.currentProvider)
								//交易所合约地址
								const address = "0x0cd43FFF2a992E094E829B4b826fC67aBAe2D6E3"
								//NFT合约地址
								const addressNFT = "0x250019C9E3EB59Ef6eFAB410408F6c8E246f5A24"
								const myContract = new web3.eth.Contract(Abi, address)
								const myContractNft = new web3.eth.Contract(AbiNft, addressNFT)
								//授权nft
								myContract.methods.approve(addressNFT, "107")
									.send({
										from: res[0]
									}).then(res => {
										console.log('from res :' + res)
									}).catch((error) => {
										console.log("授权error--->" + error.code, error.message)
									})
								//上架NFT商品（商品id 金额 时间）
								myContractNft.methods.sell("107", web3.utils.toWei(BigNumber(this.amount), 'ether'),
										BigNumber(this.mytime))
									.send({
										from: res[0]
									}).then(res => {
										console.log('from res :' + res)
										this.$toast(res)
									}).catch((error) => {
										this.$toast(error.message)
										console.log("上架error--->" + error.code, error.message)
									})
							}
						})
					} else {
						this.$toast('请安装 MetaMask,浏览器才能开始使用。');
					}
				}
			},
		},
	}
</script>
<style scoped>
.onecelll {
		height: 14px;
		font-size: 14px;
		font-family: SourceHanSansCN-Regular, SourceHanSansCN;
		font-weight: 400;
		color: #666666;
		line-height: 21px;
	}
.onecellr{
	float:right;
	text-align:right;
	color: #FF5603;
	font-size: 12px;
	width:200px;
}
	.warp {
		position: relative;
	}

	.contentone {
		border-top:10px solid #F7F7F7;
		border-bottom:10px solid #F7F7F7;
		padding:10px 16px;
	}

	.onecell {
		height: 14px;
		font-size: 14px;
		font-family: SourceHanSansCN-Regular, SourceHanSansCN;
		font-weight: 400;
		color: #666666;
		line-height: 21px;
	}

	.twocell {
		margin: 8px 0;
	}

	.twocelll {
		width: 43px;
		height: 18px;
		font-size: 18px;
		font-family: SourceHanSansCN-Medium, SourceHanSansCN;
		font-weight: 500;
		color: #333333;
	}

	.twocellr {
		float:right;
	}

	.threecell {
		width:343px;
	}

	.threecell img {
		width:100%;
		margin:0 auto;
	}

	.dateimg,
	.coinCompany {
		/* width: 18px; */
		height: 18px;
		position: absolute;
		right: 20px;
		top: 0;
		margin: 10px 0;
	}

	.coinCompany {
		position: absolute;
		right: 20px;
		top: 0;
		margin: 10px 0;
		font-size: 12px;
		color: #333333;
		line-height: 18px;
	}

	.fourcell {
		margin:0 auto;
		height:35px;
		background: #FFFFFF;
		font-size: 12px;
		font-weight: 400;
		line-height: 35px;
		font-family: SourceHanSansCN-Regular, SourceHanSansCN;
	}

	.fourcelll {
		width:200px;
		display:inline-block;
	}

	.fourcellone {
		color: #666666;
	}

	.fourcelltwo {
		margin-left:5px;
		color: #FF5603;
	}

	.fourcellr {
		color: #999999;
		float: right;
		display:inline-block;
	}

	.contenttwo {
		background:#FFFFFF;
	}

	.contenttwoo {
		padding: 10px 20px 0 20px;
	}

	.contenttwoo span:nth-child(1) {
		font-size: 13px;
		color: #000000;
		margin-right: 2px;
		vertical-align: top;
	}

	.tipbox {
		display: inline-block;
		width: 260px;
		height: 35px;
		background: #FFF9F1;
		box-shadow: 0px 1px 4px 1px rgba(0, 0, 0, 0.1);
		border-radius: 4px;
		font-size: 11px;
		color: #333333;
		line-height: 15px;
		padding: 2px 7px;
		margin-left: 2px;
	}

	/deep/.van-icon {
		vertical-align: top;
		margin-top: -2px;
	}

	.contenttwot {
		height:50px;
		line-height:50px;
		display:lex;
		border-bottom: 0.026667rem solid #D8D8D8;
		padding:0px 20px;
	}

	.contenttwote {
		padding:0px 5px;
	}

	.contenttwotl {
		display: inline;
		width:350px;
		font-size: 12px;
		color: #666666;
	}


	.contenttwotr {
		float: right;
		height: 27px;
		line-height: 27px;
		color: #333333;
		font-size: 12px;
		margin-top: 10px;
	}

	.mycell {
		/* background-color: #FFFFFF; */
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

	/deep/.van-field__control {
		color: #999999;
	}

	/deep/.van-collapse-item--border::after {
		border-top: none;
	}

	/deep/.van-hairline--top-bottom::after,
	.van-hairline-unset--top-bottom::after {
		border-width: 0;
	}

	.van-col {
		text-align: center;
		font-size: 11px;
		color: #666666;
	}

	/deep/.van-button--default {
		border: none;
	}

	.contenttwo1 {
		padding: 12px 20px;
		border-bottom: 0.026667rem solid #D8D8D8;
	}

	.contenttwooot {
		margin-bottom: 10px;
		margin-top: 10px;
	}

	.contenttwooot {
		margin-bottom: 16px;
	}

	.contenttwoooto {
		height: 26px;
		font-size: 13px;
		color: #333333;
	}

	.contenttwooott {
		float: right;
		font-size: 12px;
		color: #999999;
	}

	.datatimebox {
		z-index: 9999;
		position: fixed;
		bottom: 0px;
		left: 0;
		right: 0;
		margin: 0 auto;
		background: #FFFFFF;
		box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.15);
		border-radius: 8px;
		padding: 0 15px 5px 15px;
	}

	.contenttwooob {
		position: relative;
		background: #FFFFFF;
		box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.15);
		border-radius: 4px;
	}

	/* // .datatimeboxt span {
	// 	font-size: 12px;
	// 	color: #333333;
	// 	line-height: 18px;
	// 	display: inline-block;
	// 	width: 100%;
	// }

	// .datatimeboxbo {
	// 	margin: 24px 0 20px 0;
	// }

	// .datatimeboxbo span {
	// 	width: 130px;
	// 	font-size: 12px;
	// 	color: #333333;
	// 	line-height: 18px;
	// 	display: inline-block;
	// }

	// .datatimeboxbo span:nth-child(1) {
	// 	margin-right: 40px;
	// }

	// .datatimeboxbtspan {
	// 	display: inline-block;
	// 	width: 130px;
	// 	height: 32px;
	// 	background: #F2F2F2;
	// 	border-radius: 5px;
	// 	line-height: 32px;
	// 	text-align: center;
	// 	color: #666666;
	// 	font-size: 12px;
	// }

	// .datatimeboxbt span:nth-child(2) {
	// 	color: #979797;
	// 	text-align: center;
	// 	width: 40px;
	// 	display: inline-block;
	// } 
	// .datatimeboxbt span:nth-child(3) {
	// 	float: right;
	// }

	// .datatimeboxt div {
	// 	display: inline-block;
	// 	width: 90px;
	// 	height: 30px;
	// 	line-height: 30px;
	// 	border-radius: 5px;
	// 	font-size: 12px;
	// 	text-align: center;
	// 	margin-top: 18px;
	// 	margin-right: 10px;
	// }

	// .checkedbox {
	// 	background: #FADD5C;
	// 	color: #333333;
	// }
	// .checkedboxno {
	// 	background: #F2F2F2;
	// 	color: #999999;
	// } */
	.copyadd{
		font-size: 12px;
		color: #999999;
		width:150px;
		text-align:right;
		margin-right:5px;
	}
	.copyimg{
		width: 16px;
		height: 16px;
		margin-top:5px;
	}
	.datatimeboxbf {
		background: #FADD5C;
		width: 180px;
		height: 31px;
		line-height: 31px;
		border-radius: 4px;
		text-align: center;
		margin: 5px auto;
		font-size: 12px;
		color: #000000;
	}

	.sell {
		background: #FADD5C;
		width: 180px;
		height: 44px;
		line-height: 44px;
		border-radius: 4px;
		text-align: center;
		margin: 5px auto;
		font-size: 13px;
		color: #000000;
	}

	/deep/.van-nav-bar .van-icon {
		color: #000000;
	}
</style>
