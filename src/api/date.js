export function addDate(dates, days) {
	var date = new Date(dates);
	date.setDate(date.getDate() + days);
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	var mm = "'" + month + "'";
	var dd = "'" + day + "'";
	if (mm.length == 3) {
		month = "0" + month;
	}
	if (dd.length == 3) {
		day = "0" + day;
	}
	var time = year + "/" + month + "/" + day
	return time;
}
