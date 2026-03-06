var access = {};
var is_modo_cliente = false;

var refreshAccess = function() {
	//var access = {};
	//var menu = $('html > body.menu.home > aside > div > div > ul > li.active');
	//var modulo = menu.data('name');
	var username = $('html > body.menu.home > aside > div > div > h1').length? $('html > body.menu.home > aside > div > div > h1').data('username') : current_username;
	//if (menu.length>0 && modulo!='') {
		$.ajax({
			'url':'/4DACTION/_v3_get_access',
			data:{
				'user': username
			},
			async:false,
			dataType:'json',
			success:function(data){
			  access = data;
			}
		});
	//}
};

/*var usersNotify = {};
var getUserNotify = function() {
	$('html > body.menu.home > aside > div > div > ul > li > a').click(function(){
		var module = $(this).closest('li').data("name");
		$.ajax({
			'url':'/4DACTION/_v3_get_user_notify',
			data:{
				'module': module
			},
			dataType:'json',
			success:function(data){
			  usersNotify = data;
			}
		});
	});
};*/

var getUsersByType = function(id, type) {
	var users = {};
	$.ajax({
		url: "/4DACTION/_v3_get_users_by_type",
		dataType: "json",
		data: {
			'request[type]': type,
			'request[id]': id

		},
		async:false,
		success: function(data) {
			users =  data;
		}
	});
	return users;
};

var verifyActiveRequest = function(param) {
	// param.id
	// param.subject
	var msgs = {};
	$.ajax({
		url: "/4DACTION/_v3_getInbox",
		dataType: "json",
		data: param,
		async:false,
		success: function(data) {
			msgs =  data.rows;
		}
	});
	return msgs;
};

$(document).ready(function(){
	refreshAccess();
	//getUserNotify();
});
