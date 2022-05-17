<template>
	<div class="searchboxs">
		<div class="searchbox">
			<div class="searchone" @click="goback()">
				<van-icon name="arrow-left" />
			</div>
			<div class="searchtwo">
				<van-search v-model="searchkey" placeholder="Search collections/Wallet address/TokenID" @clear="clearbtn"/>
			</div>
			<div class="searchthree" @click="onSearch">Search</div>
		</div>
		<div v-if="searchlist.length==0" class="nosearch">
			<div><img src="../assets/images/nosearch.png" /></div>
			<div>No items to display</div>
		</div>
		<div v-else class="onebox">
			<div class="listnum">{{`Search results（`+total+`）`}}</div>
			<van-list v-model:loading="loading" :finished="finished" :finished-text="finishedText" @load="onMore" loading-text='Loading'>
				<div class="oneboxcell" v-for="(item,index) in searchlist" :key='index' :title="item"
					@click="gotodetail(item)">
					<div class="oneboxl">
						<!-- <img v-if="item.image==null" src="../assets/images/nolist.png">
						<img v-else :src="item.image" class="imgobject"> -->
						<div class="boximg" :style="{'background-image':'url('+item.image+')'}"></div>
					</div>
					<div class="oneboxr">
						<div class="oneboxrt">
							<span class="oneboxrtl oneboxrtl1" v-html="hightKeyword(item.name)">{{item.name}}</span>
							<span class="oneboxrtl oneboxrtl2"
								v-html="hightKeyword(item.tokenId)">{{`#${item.tokenId}`}}</span>
							<span class="oneboxrtl oneboxrtl3" v-html="hightKeyword(item.creator)">{{item.creator==null?'itemcreator':item.creator}}</span>
						</div>
						<!-- <div class="oneboxrc">
							<img v-show="item.price!=null" src="../assets/images/icon1.png" />
							{{item.price}}
						</div> -->
						<div :class="item.price!=null?'oneboxrb':''">
							<span class="oneboxrbl">{{item.offSheftTime!=null?item.offSheftTime.substring(0,16):''}}</span>
							<span class="oneboxrc">
								<img v-show="item.price!=null" src="../assets/images/icon1.png" />
								{{item.price}}
							</span>
						</div>
					</div>
				</div>
			</van-list>
		</div>
	</div>
</template>
<script>
	import Vue from 'vue'
	import {
		Search,
		Icon,
		List
	} from 'vant'
	Vue.use(Search).use(Icon).use(List)
	import {
		getSearch
	} from "../api";
	export default {

		data() {
			return {
				searchkey: '',
				searchlist: [],
				pagetype: '0',
				owneradd: '',
				page: 1,
				num: 10,
				loading: false,
				finished: false,
				finishedText: '',
				total:'',
			}
		},
		mounted() {
			//传参数判断是那个入口（我的页面owneradd="owneradd"和首页owneradd=""）
			this.owneradd = this.$route.query.owneradd
			// console.log(this.$route.query.owneradd)
		},
		beforeRouteLeave(to, from, next) {
			console.log(to, from)
			if(to.name=="me"){
				from.meta.keepAlive = false;
			}else{
				from.meta.keepAlive = true;
			}
		  next();
		},
		
		methods: {
			goback(){
				this.$router.back()
			},
			hightKeyword(val) {
				const Reg = new RegExp(this.searchkey, 'i');
				if (val) {
					return val.replace(Reg, `<span style="color: #409EFF;">${this.searchkey}</span>`);
				}
			},
			onMore() {
				let times = setTimeout(() => {
					this.page += 1 //每请求一次，页面数+1
					this.onSearch()
				}, 500)
			},
			clearbtn(){
				this.searchRequest(this.owneradd)
			},
			onSearch() {
				this.searchRequest(this.owneradd)
			},
			gotodetail(item) {
				if (item.price == null) {
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
							userId: item.id
						}
					})
				}

			},
			searchRequest(owner) {
				const params = {
					pageNo: this.page,
					pageSize: this.num,
					search: this.searchkey,
					owner: owner,
					chainId:this.$store.state.choosenetwork,
				}
				getSearch(params).then(res => {
					if (res.code == '200') {
						this.loading = false
						this.total = res.result.total
						if(res.result.list.length==''){
							this.$toast('Not found')
						}
						if (this.page == 1) {
							this.searchlist = res.result.list
						} else {
							this.searchlist = this.searchlist.concat(res.result.list)
						}
						if (res.result.list.length == 0 || res.result.list.length < 10) {
							this.finished = true
							this.finishedText = 'No more...'
							return
						}else {
							this.finished = false
						}
					} else {
						this.searchlist = []
						this.$toast(res.message)
					}
				})
			},
		},
	}
</script>
<style scoped>
	.searchbox {
		position: fixed;
		width: 100%;
		z-index: 9999;
		text-align: center;
		display: inline-block;
		justify-content: space-between;
		border-bottom: 5px solid #F7F7F7;
		background: #ffff;
	}

	.searchone,
	.searchtwo,
	.searchthree {
		display: inline-block;
	}
/deep/.van-field__control{
	font-size: 11px;
}
	.nosearch {
		width: 100%;
	}

	.nosearch img {
		width: 105px;
		height: 105px;
		margin-top: 200px;
		margin-bottom: 10px;
	}

	.nosearch div:nth-child(1) {
		margin: 0 auto;
		text-align: center;
	}

	.nosearch div:nth-child(2) {
		font-size: 12px;
		color: #999999;
		line-height: 36px;
		text-align: center;
		padding-bottom: 80px;
	}

	.searchone {
		text-align: left;
		width: 5%;
	}

	.searchtwo {
		width: 80%;
	}

	.searchthree {
		width: 10%;
		text-align: right;
		font-size: 12px;
		height: 50px;
		line-height: 50px;
		vertical-align: top;
	}

	.onebox {
		padding-top: 60px;
	}
.listnum{
	padding: 10px;
	font-size: 13px;
	color: #333333;
	line-height: 20px;
	border-bottom: 1px solid #D8D8D8;
}
	.oneboxcell {
		margin: 4px 5px;
		/*margin: 4px auto 8px auto;
		height: 90px;
		background: linear-gradient(311deg, #FFF7EA 0%, #FFFFFF 100%);
		border-radius: 8px; */
		border-bottom: .5px solid #D4D4D4;
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
	.imgobject{
		object-fit:cover;
		object-position:50% 50%;
	}

	.oneboxl,
	.oneboxr {
		margin: 8px 0;
		display: inline-block;
		vertical-align: middle;
		margin-left: 8px;
	}

	.oneboxr {
		width: 250px;
	}

	.oneboxrc {
		float: right;
		height: 12px;
		font-size: 12px;
		color: #FFA415;
		text-align: right;
	}

	.oneboxrc img {
		width: 12px;
		height: 12px;
		vertical-align: top;
	}

	/* .oneboxrbr {
		display: inline-block;
	} */
	.oneboxrt span {
		display: block;
	}

	.oneboxrtl,.oneboxrtl1 {
		font-size: 13px;
		color: #333333;
	}
	.oneboxrtl2 {
		font-size: 11px;
		color: #999999;
		margin: 4px 0;
	}
.oneboxrtl3 {
		font-size: 11px;
		color: #666666;
	}
	.oneboxrtl {
		line-height: 14px;
		word-wrap: break-word;
	}

	/* 	.oneboxrtname {
		max-width: 60px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		display: inline-block;
	} */

	.oneboxrtr {
		font-size: 12px;
		color: #666666;
	}
.oneboxrb{
	margin: 10px 0 ;
}
	.oneboxrbl{
		font-size: 12px;
		color: #999999;
	}
</style>
