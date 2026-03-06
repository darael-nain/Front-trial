
const module = document.querySelector('aside ul li.active a span').textContent
const parseTimestamp = (timestamp) => {
	let date = new Date(timestamp);

	let dayOfWeek = date.toLocaleString('es-ES', { weekday: 'long' });
	let day = date.getDate();
	let month = date.toLocaleString('es-ES', { month: 'long' });
	let hour = date.getHours();
	let minute = date.getMinutes();

	day = day < 10 ? '0' + day : day;
	hour = hour < 10 ? '0' + hour : hour;
	minute = minute < 10 ? '0' + minute : minute;

	return `${dayOfWeek} ${day} de ${month} a las ${hour}:${minute} horas`;
}

const checkVersion = () => {
	$.ajax({
		url: window.origin + "/4DACTION/_force_checkVersionByCotizacion",
		data: {
			id: $("section.sheet").data("id"),
		},
		dataType: "json",
		success: function (data) {
			let time = document.querySelector(".view-active span#time-version-text");
			if (data.rows.length > 0) {
				time.textContent = parseTimestamp(data.rows[0].updated_at)
				time.dataset.time = data.rows[0].updated_at
			} else {
				document.querySelectorAll('span.view-active')[1].style.display = 'none'
			}
		}
	});

}




(function init() {
	checkVersion()

})();