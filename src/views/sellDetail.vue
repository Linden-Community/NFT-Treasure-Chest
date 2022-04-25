<template>
	<div class="wrap">
		<div class="headerbox">
			<van-nav-bar title="NFT details" left-arrow @click-left="$router.go(-1)" />
		</div>
		<div class="contentone">
			<div class="onecell"><span class="onecelll">Minted by</span><span
					@click="gootheraddress(detaillist.creator)"
					class="onecellr">{{detaillist.creator==null?'creator':detaillist.creator | ellipsis}}</span></div>
			<div class="twocell"><span class="twocelll">{{detaillist.name==null?'name':detaillist.name}}</span><span
					class="twocellr">#{{detaillist.tokenId}}</span></div>
			<div class="threecell">
				<img v-if="detaillist.image==null" src="../assets/images/zw.png" />
				<img v-else :src="detaillist.image" />
			</div>
			<div class="fourcell">
				<div class="fourcelll">
					<span class="fourcellone">Owned by</span>
					<span class="fourcelltwo"
						@click="gootheraddress(detaillist.owner)">{{detaillist.owner==null?'detaillistowner':detaillist.owner | ellipsis }}</span>
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
						<van-field v-model="amount" type="number" placeholder="Please enter the amount" @change="inputchange"/>
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
						<div class="datatimeboxtt">
							<span>Select shelf cycle</span>
							<span  @click="nochoosedate"><van-icon name="cross" /></span>	
						</div>
						<van-picker title="标题" :columns="columns" :default-index="0" @change="onChange" />
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
						<van-cell title="Contract Address">
							<template #right-icon>
								<span
									class="copyadd">{{detaillist.contract==null?'detaillistcontract':detaillist.contract | ellipsis }}</span>
								<img class="copyimg" @click="copyclick(detaillist.contract)"
									src="../assets/images/copy.png">
							</template>
						</van-cell>
						<van-cell title="Token ID">
							<template #right-icon>
								<span
									class="copyadd">{{detaillist.tokenId==null?'detaillisttokenId':detaillist.tokenId | ellipsis }}</span>
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
		<van-loading v-show="pageLoading" type="spinner" size="24px" class="loadingbox"/>
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
		NavBar,
		Loading
	} from 'vant'
	Vue.use(Collapse).use(CollapseItem).use(Cell).use(Field).use(CellGroup).use(Icon).use(Picker).use(NavBar).use(Loading)
	import {
		getNft
	} from "../api";
	import Abi from '../json/Abi.js'
	import AbiNft from '../json/AbiNft.js'
	import BigNumber from "bignumber.js";
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
				minDate: new Date(2010, 0, 1),
				maxDate: new Date(2010, 0, 31),
				columns: [],
				dateboxshow: false, //日期弹框快捷方式
				mydate: '1',
				mychangedate: '',
				shopid: '',
				mytime: parseInt(new Date().getTime()/1000)+87000, //默认一天
				copyIds: '',
				mytokenId: '',
				pageLoading:false,
			}
		},
		mounted() {
			this.shopid = this.$route.query.userId
			this.detailNft(this.$route.query.userId) //商品详情
			this.putdate() //获取处理时间
			this.mychangedate = addDate(new Date, parseInt(0)) + ' - ' + addDate(new Date, parseInt(0)) +
				' ( 1 Day ) ' //默认时间
	
		},
		methods: {	
			inputchange(e) {
				var val = e.target.value
				//先把非数字的都替换掉，除了数字和.
				val = val.replace(/[^\d.]/g,"");
			    //保证只有出现一个.而没有多个.
			    val = val.replace(/\.{2,}/g,".");
			    //必须保证第一个为数字而不是.
			    val = val.replace(/^\./g,"");
			    //保证.只出现一次，而不能出现两次以上
			    val = val.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
			    //只能输入两个小数
			    val = val.replace(/^(\-)*(\d+)\.(\d\d\d\d).*$/,'$1$2.$3');
				this.amount = val
			},
			gootheraddress(address) {
				this.$router.push({
					name: 'otherList',
					query: {
						address: address
					}
				})
			},
			//复制
			copyclick(txt) {
				this.$copyText(txt).then(() => {
					this.$toast('已成功复制到剪切板')
				}).catch(() => {
					this.$toast('复制失败')
				})
			},
			//大弹框
			showdatebox() {
				this.dateboxshow = !this.dateboxshow
			},
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
				this.mytime = parseInt(new Date().getTime()/1000) + index.split(' ')[0] * 24 * 60 * 60+600
				console.log(`当前值: ${value}, 当前索引: ${index}`, this.mytime);
			},
			nochoosedate(){
				this.dateboxshow = false
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
						this.empower()
					} else {
						this.$toast(res.message)
					}
				})
			},
			//授权
			empower() {
				if (window.ethereum) {
					window.ethereum.enable().then((res) => {
						if (!res[0]) {
							this.$toast('请先登录小狐狸')
						} else {
							const web3 = new this.Web3(window.web3.currentProvider)
							//NFT合约地址
							const addressNFT = "0x990CfeB4d7EC56c95a08881896630AA6F92D04Dd"
							const myContractNft = new web3.eth.Contract(AbiNft, addressNFT)
							//授权nft
							this.mytokenId = BigNumber(this.detaillist.tokenId)
							this.pageLoading = true
							myContractNft.methods.approve(addressNFT, this.mytokenId)
								.send({
									from: res[0]
								}).then(res => {
									console.log('from res :' + res)
									if (JSON.stringify(res.status) == 'true') {
										this.$toast('Authorization succeeded')
										console.log("success")
										//刷新页面
										//location.reload()
										this.pageLoading = false
									} else {
										this.$toast(res.message)
										console.log(res.message)
									}
								}).catch((error) => {
									this.pageLoading = false
									this.$toast(error.message)
									console.log("授权error--->" + error.code, error.message)
								})
						}
					})
				} else {
					this.$toast('请安装 MetaMask,浏览器才能开始使用。');
				}
			},
			//上架
			sellsub() {
				if (this.amount == '' || this.amount < 0.0001 || this.amount > 9999.9999) {
					this.$toast('请输入0.0001-9999.9999之间的数字')
				} else {
					if (window.ethereum) {
						window.ethereum.enable().then((res) => {
							if (!res[0]) {
								this.$toast('请先登录小狐狸')
							} else {
								const web3 = new this.Web3(window.web3.currentProvider)
								//交易所合约地址
								const address = "0x0e0eb3Aac0FDCb5Cff2F92d7E5D632224F7EC29c"
								const myContract = new web3.eth.Contract(Abi, address)
								//授权nft
								this.mytokenId = BigNumber(this.detaillist.tokenId)
								this.pageLoading = true
								//上架NFT商品（商品id 金额 时间）
								myContract.methods.sell(this.mytokenId, BigNumber(web3.utils.toWei(this.amount,
											'ether')),
										this.mytime)
									.send({
										from: res[0]
									}).then(res => {
										console.log('from res :' + res)
										if (JSON.stringify(res.status) == 'true') {
											this.$toast('Successful launch')
											console.log("success")
											this.pageLoading = false
											//跳转页面
											this.$router.push('me') 
										} else {
											this.$toast(res.message)
											console.log(res.message)
										}
									}).catch((error) => {
										this.pageLoading = false
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
	.headerbox {
		position: fixed;
		width: 100%;
		top: 0;
		border-bottom: 10px solid #F7F7F7;
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
	}

	.warp {
		position: relative;
	}

	.contentone {
		border-bottom: 10px solid #F7F7F7;
		padding: 20px 16px 10px 16px;
		margin-top: 45px;
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
		float: right;
	}

	.threecell {
		width: 100%;
	}

	.threecell img {
		width: 100%;
		height: 300px;
		margin: 0 auto;
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
		margin: 0 auto;
		height: 35px;
		background: #FFFFFF;
		font-size: 12px;
		font-weight: 400;
		line-height: 35px;
		font-family: SourceHanSansCN-Regular, SourceHanSansCN;
	}

	.fourcelll {
		width: 200px;
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
	}

	.contenttwo {
		background: #FFFFFF;
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
		height: 50px;
		line-height: 50px;
		display: lex;
		border-bottom: 0.026667rem solid #D8D8D8;
		padding: 0px 20px;
	}

	.contenttwote {
		padding: 0px 5px;
	}

	.contenttwotl {
		display: inline;
		width: 350px;
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
	.datatimeboxtt{
		margin: 20px 0;
	}

	.datatimeboxtt span:nth-child(1){
		font-size: 20px;
		color: #333333
	}
		
	.datatimeboxtt span:nth-child(2){
		float: right;
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
	.loadingbox{
		width: 100%;
		position: fixed;
		top:50%;
		text-align: center;
	}
	/deep/.van-nav-bar .van-icon {
		color: #000000;
	}
</style>
