var MSG = (function() {
	var resource = {};
	$.ajax({
		url: '/v3/strings/msg.json',
		dataType: 'json',
		async: false,
		success: function(data) {
			resource = data;
		}
	});
	return {
		get: function(name) { return resource[name]; }
	};
})();

var NOTIFY = (function() {
	var resource = {};
	$.ajax({
		url: '/v3/strings/notify.json',
		dataType: 'json',
		async: false,
		success: function(data) {
			resource = data;
		}
	});
	return {
		get: function(name) { return resource[name]; }
	};
})();
