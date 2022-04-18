/**
 * 请求数据配置
 * 配置编译环境和线上环境之间的IP切换
 *
 * baseURL: 域名地址
 * fileUpBaseUrl:上传文件
 **/
var baseURL = ''
var fileUpBaseUrl = ''

if (process.env.NODE_ENV === 'development') {
	//baseURL = 'http://192.168.0.143:8080'
	baseURL = '/apiPath'
	fileUpBaseUrl = ''
} else {
	fileUpBaseUrl = ''
}
export {
	baseURL,
	fileUpBaseUrl
}
