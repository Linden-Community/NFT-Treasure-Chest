<template>
	<div class="wrap">
		<div class="headerbox">
			<van-nav-bar title="Sale details" left-arrow @click-left="$router.go(-1)" />
		</div>
		<div class="contentone">
			<div class="onecelltitle">{{detaillist.name}}</div>
			<div class="onecell">
				<span class="onecelll">Minted by</span>
				<span class="onecellr">{{buyTo | ellipsis}}
					<img class="copyimg" @click="copyclick(buyTo)" src="../assets/images/copy.png" >
				</span>
			</div>
			<div class="twocell">
				<span class="twocelll">Sell to</span>
				<span class="twocellr">
					{{buyFrom | ellipsis}}
					<img class="copyimg" @click="copyclick(buyFrom)" src="../assets/images/copy.png">
				</span>
			</div>
			<div class="threecell">
				<img v-if="detaillist.image==null" src="../assets/images/zw.png" />
				<img v-else :src="detaillist.image" />
			</div>
			<div class="fourcell">
				<div class="fourcelll">
					<span class="fourcellone">Transaction time</span>
				</div>
				<div class="fourcellr">{{createTime.substring(0,16)}}</div>
			</div>
		</div>
		<div class="contenttwo">
			<div class="contenttwoo">Details of the works</div>
			<div class="contenttwoo">
				<span class="twocelll">Contract address</span>
				<span class="twocellr">
					{{detaillist.contract==null?'detaillisttokenId':detaillist.contract | ellipsis }}
					<img class="copyimg" @click="copyclick(detaillist.contract)" src="../assets/images/copy.png">
				</span>
			</div>
			<div class="contenttwoo">
				<span class="twocelll">Token ID</span>
				<span class="twocellr">
					{{detaillist.tokenId==null?'detaillisttokenId':detaillist.tokenId | ellipsis }}
					<img class="copyimg" @click="copyclick(detaillist.tokenId)" src="../assets/images/copy.png">
				</span>
			</div>
			<div class="contenttwoo">
				<span class="twocelll">Token standard</span>
				<span class="twocellr">
					ERC-721
				</span>
			</div>
			<div class="contenttwoo contenttwoolast">
				<span class="twocelll">Blockchain</span>
				<span class="twocellr">
					BNB
				</span>
			</div>
			<div class="contenttwot">
				<span class="twocelll">Selling price</span>
				<span class="twocellr">
					<img class="copyimg" src="../assets/images/icon1.png">
					{{price}}
				</span>
			</div>
		</div>
	</div>
</template>
<script>
	import Vue from 'vue'
	import {
		NavBar,
	} from 'vant'
	Vue.use(NavBar)
	import {
		getNft,
	} from "../api";
	export default {
		data() {
			return {
				detaillist: [],
				buyFrom: '',
				buyTo: '',
				createTime: '',
				price: '',
			}
		},
		mounted() {
			localStorage.setItem('ispage', 'sell')
			this.detailNft(this.$route.query.nftId)
			this.buyFrom = this.$route.query.buyFrom
			this.buyTo = this.$route.query.buyTo
			this.createTime = this.$route.query.createTime
			this.price = this.$route.query.price
		},
		methods: {
			copyclick(txt) {
				console.log(txt)
				this.$copyText(txt).then(() => {
					this.$toast('Successfully copied to clipboard')
				}).catch(() => {
					this.$toast('Copy failed')
				})
			},
			detailNft(userId) {
				const params = {
					id: userId,
				}
				getNft(params).then(res => {
					if (res.code == "200") {
						this.detaillist = res.result
					} else {
						this.$toast(res.message)
					}
				})
			},
		}
	}
</script>
<style scoped>
	.nodata {
		margin: 10px auto;
		text-align: center;
	}

	.headerbox {
		position: fixed;
		width: 100%;
		top: 0;
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

	.onecelltitle {
		font-size: 18px;
		font-weight: 500;
		color: #333333;
	}

	.onecelll {
		height: 14px;
		font-size: 13px;
		font-family: SourceHanSansCN-Regular, SourceHanSansCN;
		font-weight: 400;
		color: #999999;
	}

	.onecellr,
	.twocellr {
		float: right;
		text-align: right;
		color: #666666;
		font-size: 12px;
		width: 200px;
		line-height: 20px;
	}
	.copyimg {
		width: 16px;
		height: 16px;
		vertical-align: top;
	}
	.twocell,
	.onecell {
		margin: 8px 0;
	}

	.twocelll {
		height: 14px;
		font-size: 13px;
		font-family: SourceHanSansCN-Regular, SourceHanSansCN;
		font-weight: 400;
		color: #999999;
	}

	.threecell {
		margin-top:12px ;
		width: 100%;
	}

	.threecell img {
		width: 100%;
		height: 300px;
		margin: 0 auto;
		box-shadow: 0px 2px 5px 5px rgba(0, 0, 0, 0.15);
		border-radius: 5px;
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
.contenttwot{
	font-size: 13px;
	line-height: 20px;
	padding: 10px 20px 70px 20px;
	border-top: 1px solid #D8D8D8;
	
}
.contenttwot span:nth-child(1){
	color: #333333;
}
.contenttwot span:nth-child(2){
	color: #FFA415;
}
.contenttwoolast{
	margin-bottom: 10px;
}
	/deep/.van-nav-bar .van-icon {
		color: #000000;
	}
</style>
