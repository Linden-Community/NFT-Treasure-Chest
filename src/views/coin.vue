<template>
	<div class="content">
		<van-nav-bar title="Mint quantity" />
		<div class="contentone">
			<span class="spanone">Upload work<span>*</span></span>
			<span class="spantwo">Supported formats: JPG、JPEG、PNG</span>
			<span class="spanthree">Maximum supported: 10MB</span>
			<div :class="imageData==''?'divone':'divonehas'">
				<van-uploader v-model="fileList" multiple :max-count="1" :max-size="10*1024*1024" @oversize="onOversize"
					:before-read="beforeRead" :before-delete="delImg" />
			</div>
		</div>
		<div class="contenttwo">
			<div class="contenttwoo">
				<span>Work title</span><span>*</span>
				<div>
					<van-field v-model="title" center clearable label="" placeholder="Please enter work title"
						maxlength="20">
					</van-field>
				</div>
			</div>
			<div class="contenttwot">
				<span>Description of the work</span>
				<div>
					<van-cell-group inset>
						<van-field v-model="description" autosize rows="3" type="textarea" maxlength="100"
							placeholder="Please enter a description of the work" show-word-limit
							@keydown="checkEnter" />
					</van-cell-group>
				</div>
			</div>
			<div class="contenttwoth">
				<div class="contenttwotho"><span>Mint quantity</span><span>1</span></div>
				<div class="contenttwotht"><span>Blockchain</span><span>BNB</span></div>
				<div class="mint" @click="mintBtn" v-throttle="3000">Mint</div>
				
			</div>
		</div>
		<van-loading v-show="pageLoading" type="spinner" size="24px" class="loadingbox" color="#0094ff" />
		<foot-bar v-if="$route.meta.isMenu"></foot-bar>
	</div>
</template>
<script>
	import footBar from '../components/footBar'
	import Vue from 'vue'
	import {
		Uploader,
		Field,
		CellGroup,
		NavBar,
		Loading
	} from 'vant'
	Vue.use(Uploader).use(Field).use(CellGroup).use(NavBar).use(Loading)
	import {
		setCoin
	} from "../api";
	import AbiNft from '../json/AbiNft.js'
	export default {
		components: {
			footBar
		},
		data() {
			return {
				description: '',
				title: '',
				fileList: [],
				tokenId: '',
				imageData: '',
				pageLoading: false,
			}
		},
		mounted() {},
		methods: {
			checkEnter(e) {
				var et = e || window.event;
				var keycode = et.charCode || et.keyCode;
				if (keycode == 13) {
					if (window.event) {
						window.event.returnValue = false;
					} else {
						e.preventDefault(); //for firefox
					}
				}
			},
			onOversize(file) {
				this.$toast('Image size cannot exceed 10MB')
			},
			delImg(file, detail) {
				this.fileList.splice(detail.index, 1)
				this.imageData = ''
			},
			beforeRead(file) {

				var fileType = file.type.toLowerCase()
				if (fileType == 'image/jpeg' || fileType == 'image/png' || fileType == 'image/jpeg') {
					let FormDatas = new FormData()
					FormDatas.append('file', file)
					this.$http({
						url: 'https://csg.lindensys.cn/poss/v1/testnet/add',
						headers: {
							'Content-Type': 'multipart/form-data',
						},
						method: 'post',
						data: FormDatas,
					}).then(res => {
						console.log(res.data.Hash)
						this.imageData = 'https://csg.lindensys.cn/poss/v1/testnet/ipfs/' + res.data.Hash
					})
					return true
				} else {
					this.$toast('Uploading this format is not supported')
				}
			},
			//获取19位tokenid
			getCurrentTime() {
				let yy = new Date().getFullYear();
				let mm = new Date().getMonth() + 1 < 10 ? "0" + `${new Date().getMonth() + 1}` : new Date().getMonth() + 1;
				let dd = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate();
				let hh = new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours();
				let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes();
				let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds();
				this.tokenId = `${yy}${mm}${dd}` + hh + mf + ss;
				var random = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9);
				var num = '';
				for (var i = 0; i < 5; i++) {
					num += Math.floor(Math.random() * 10);
				}
				this.tokenId = this.tokenId + num
			},
			mintBtn() {
				console.log(this.imageData, 2222)
				this.getCurrentTime()
				if (this.title == '') {
					this.$toast('Please enter the title')
				} else if (this.imageData == '') {
					this.$toast('Please enter the image')
				} else {
					const params = {
						tokenId: this.tokenId, //年月日时分秒+5位随机数
						image: this.imageData,
						nftId: 'babaofan',
						name: this.title,
						description: this.description,
						//后期需要
						//nftId // image// externalUrl	// attributes// backgroundColor	 // animationUrl // youtubeUrl // createTime/ updateTime
					}
					setCoin(params).then(res => {
						if (res.code == "200") {
							this.safeMint(res.result.cid)
						} else {
							this.$toast(res.message)
						}
					})
				}
			},
			safeMint(uri) {
				const web3 = new this.Web3(window.web3.currentProvider)
				//合约地址
				//测试
				const addressNFT = "0x990CfeB4d7EC56c95a08881896630AA6F92D04Dd"
				//正式
				//const addressNFT = "0x1f9887C6F9Bd49952A68BBbFFDDF99334B6fF823"
				const myContractNft = new web3.eth.Contract(AbiNft, addressNFT)
				this.pageLoading = true
				myContractNft.methods.safeMint(sessionStorage.getItem("myAddress"), this.tokenId, uri)
					.send({
						from: sessionStorage.getItem("myAddress")
					}).then(res => {
						if (JSON.stringify(res.status) == 'true') {
							this.$toast('Successful coinage')
							console.log("success")
							//刷新
							//location.reload()
							this.pageLoading = false
							//跳转
							setTimeout(() => {
								this.$router.push('me')
							}, 2000)

						} else {
							this.$toast(res.message)
							console.log(res.message)
						}
					}).catch((error) => {
						this.pageLoading = false
						this.$toast(error.message)
						// if (JSON.stringify(error.status) == 'true') {
						// 	this.$toast(error.message)
						// 	console.log(error.message)
						// } else {
						// 	this.$toast(error.message)
						// 	console.log(error.message)
						// }
					})
			},
		}
	}
</script>
<style scoped>
	.content {
		background: #F7F7F7;
		/* height: 100vh; */
	}

	.contentone {
		border-bottom: 10px solid #F7F7F7;
		padding: 10px 16px;
		background: #FFFFFF;
	}

	.spanone {
		font-size: 16px;
		color: #333333;
		display: block;
	}

	.spanone span {
		color: #DD3F3F;
	}

	.spantwo {
		margin: 6px 0;
	}

	.spantwo,
	.spanthree {
		font-size: 12px;
		color: #999999;
		display: block;
	}

	.divone {
		margin-top: 12px;
		width: 100%;
		/* height: 150px; */
		background: rgba(59, 59, 59, 0.34);
		border-radius: 5px;
		box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.15);
	}

	.divonehas {
		margin-top: 12px;
		width: 100%;
		/* height: 150px; */
		border-radius: 5px;
		box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.15);
	}

	.contenttwo {
		padding: 10px 16px;
	}

	.contenttwoo span:nth-child(1) {
		font-size: 13px;
		color: #333333;
		line-height: 20px;
	}

	.contenttwoo span:nth-child(2) {
		color: #DD3F3F;
	}

	.contenttwoo div {
		margin: 10px 0;
		background: #FFFFFF;
		box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.15);
		border-radius: 4px;
	}

	.contenttwot span {
		font-size: 13px;
		color: #333333;
		line-height: 20px;
	}

	.contenttwot div {
		margin: 10px 0;
		background: #FFFFFF;
		box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.15);
		border-radius: 4px;
	}

	.contenttwotho {
		margin: 12px 0;
	}

	.contenttwotho span:nth-child(1) {
		font-size: 13px;
		color: #333333;
		font-weight: 500;
	}

	.contenttwotho span:nth-child(2) {
		font-size: 13px;
		color: #666666;
		float: right;
		font-weight: 400;
	}

	.contenttwotht span:nth-child(1) {
		font-size: 13px;
		font-weight: 500;
		color: #333333;
	}

	.contenttwotht span:nth-child(2) {
		font-size: 13px;
		color: #666666;
		font-weight: 400;
		float: right;
	}

	.loadingbox {
		width: 100%;
		position: fixed;
		top: 50%;
		text-align: center;
	}

	.mint {
		width: 170px;
		height: 44px;
		margin: 55px auto 100px auto;
		text-align: center;
		line-height: 44px;
		background: #FADD5C;
		border-radius: 4px;
	}

	/deep/.van-uploader__upload {
		background-color: transparent;
		width: 100%;
		/* height: 150px; */
	}

	/deep/.van-uploader {
		width: 100%;
		/* height: 150px; */
	}

	/deep/.van-uploader__preview-image {
		width: 100%;
		height: 100%;
	}

	/deep/.van-uploader__preview {
		margin: 0 auto;
	}
</style>
