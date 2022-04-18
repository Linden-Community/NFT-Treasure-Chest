import HttpRequest from './axios'
const request = new HttpRequest()

//商品详情
export const getShopDetail = (params) => request.get(
	'/ipns/k51qzi5uqu5divqrok0get110odatax0tv8uqh3forzp1zhoxy7ft7cua188gt/babaofan', params)
//我的上架列表
export const listSell = (params) => request.post('/metadataserver/msNft/listSell',params)
//我的页面列表数据和
export const listSellNum = (params) => request.post('/metadataserver/msNft/numSell',params)

//我的上架列表
export const listLog = (params) => request.post('/metadataserver/msBuy/listBuy',params)

//首页nft列表
export const listNft = (params) => request.post('/metadataserver/msNft/listNft',params)

export const getNft = (params) => request.post('/metadataserver/msNft/getNft',params)

//搜索接口
export const getSearch = (params) => request.post('/metadataserver/msNft/search',params)