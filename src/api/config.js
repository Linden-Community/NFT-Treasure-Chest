/**
 * 请求数据配置
 * 配置编译环境和线上环境之间的IP切换
 *
 * baseURL: 域名地址
 * fileUpBaseUrl:上传文件
 **/
var baseURL = 'https://csg.cipfs.cn'
var fileUpBaseUrl = ''

if (process.env.NODE_ENV === 'development') {
	baseURL = 'https://csg.cipfs.cn'
	//baseURL = '/apiPath'
	//fileUpBaseUrl = ''
} else {
	fileUpBaseUrl = ''
}
export {
	baseURL,
	fileUpBaseUrl
}
