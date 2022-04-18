<template>
	<div class="content">
		<van-nav-bar title="Mint quantity" />
		<div class="contentone">
			<span class="spanone">Upload work<span>*</span></span>
			<span class="spantwo">Supported formats: JPG、PNG</span>
			<span class="spanthree">Maximum supported: 10MB</span>
			<div class="divone">
				<van-uploader v-model="fileList" multiple :max-count="1" :max-size="10240 * 1024"/>
			</div>
		</div>
		<div class="contenttwo">
			<div class="contenttwoo">
				<span>Work title<span>*</span></span>
				<div>
					<van-field v-model="title" center clearable label="" placeholder="Please enter work title">
					</van-field>
				</div>
			</div>
			<div class="contenttwot">
				<span>Description of the work</span>
				<div>
					<van-cell-group inset>
						<van-field v-model="description" rows="2" autosize  type="textarea" maxlength="50"
							placeholder="Please enter a description of the work" show-word-limit />
					</van-cell-group>
				</div>
			</div>
			<div class="contenttwoth">
				<div class="contenttwotho"><span>Mint quantity</span><span>1</span></div>
				<div class="contenttwotht"><span>Blockchain</span><span>BNB</span></div>
				<div class="mint">Mint</div>
			</div>
		</div>
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
		NavBar
	} from 'vant'
	Vue.use(Uploader).use(Field).use(CellGroup).use(NavBar)
	import {
		listLog
	} from "../api";

	export default {
		components: {
			footBar
		},
		data() {
			return {
				description:'',
				title:'',
				fileList:[],
			}
		},
		mounted() {
			const params = {
				pageNo: 1,
				pageSize: 10,
				tokenId: "321",
				contract: "0x250019c9e3eb59ef6efab410408f6c8e246f5a24",
			}
			listLog(params).then(res => {
				console.log("数据", res)
				if (res.code == "200") {
					this.Datalist = res.result.list
				} else {
					this.$toast(res.message)
				}
			})
		},
		methods: {
		},
	}
</script>
<style  scoped>

	.content {
		background:#F7F7F7;
	}

	.contentone {
		border-bottom:10px solid #F7F7F7;
		padding:10px 16px;
		background:#FFFFFF;
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
		height: 150px;
		background: rgba(59, 59, 59, 0.34);
		border-radius: 5px;
		box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.15);
	}
	.contenttwo {
		padding:10px 16px;
	}

	.contenttwoo span:nth-child(1) {
		font-size: 13px;
		color: #333333;
		line-height: 20px;
	}
		
	.contenttwoo span:nth-child(2) {
		color:#DD3F3F;
	}
	
.contenttwoo div{
	margin:10px 0;
	background: #FFFFFF;
	box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.15);
	border-radius: 4px;
}
	.contenttwot span {
		font-size: 13px;
		color: #333333;
		line-height: 20px;
	}
	.contenttwot div{
		margin:10px 0;
		height: 110px;
		background: #FFFFFF;
		box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.15);
		border-radius: 4px;
	}
	.contenttwotho{
		margin:12px 0;
	}
	.contenttwotho span:nth-child(1){
		font-size: 13px;
		color: #333333;
		font-weight: 500;
	}
	.contenttwotho span:nth-child(2){
		font-size: 13px;
		color: #666666;
		float:right;
		font-weight: 400;
	}
	.contenttwotht span:nth-child(1){
		font-size: 13px;
		font-weight: 500;
		color: #333333;
	}
	.contenttwotht span:nth-child(2){
		font-size: 13px;
		color: #666666;
		font-weight: 400;
		float:right;
	}
	.mint{
		width: 170px;
		height: 44px;
		margin: 55px auto;
		text-align:center;
		line-height: 44px;
		background: #FADD5C;
		border-radius: 4px;
	}
	/deep/.van-uploader__upload{
		background-color: transparent;
		width: 100%;
		height: 150px;
	}
	/deep/.van-uploader{
		width: 100%;
		height: 150px;
	}
	/deep/.van-uploader__preview-image{
		width: 100%;
		height: 150px;
	}
</style>
