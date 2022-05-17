import HttpRequest from './axios'
const request = new HttpRequest()

//商品详情
export const getShopDetail = (params) => request.get(
	'/ipns/k51qzi5uqu5divqrok0get110odatax0tv8uqh3forzp1zhoxy7ft7cua188gt/babaofan', params)
//我的上架列表
export const listSell = (params) => request.post('/msNft/listSell',params)
//我的页面列表数据和
export const listSellNum = (params) => request.post('/msNft/numSell',params)

//我的上架列表
export const listLog = (params) => request.post('/msBuy/listBuy',params)

//首页nft列表
export const listNft = (params) => request.post('/msNft/listNft',params)

export const getNft = (params) => request.post('/msNft/getNft',params)

//搜索接口
export const getSearch = (params) => request.post('/msNft/search',params)

//铸币页面
export const setCoin = (params) => request.post('/metadataV2',params)

//交易列表
export const transactionList = (params) => request.post('/msBuy/listNftRecord',params)