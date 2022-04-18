export default {
	ellipsis(value) {
		let len = value.length;
		if (!value) return ''
		if (value.length > 10) {
			return value.substring(0, 6) + '......' + value.substring(len - 4, len)
		}
		return value
	},
}
