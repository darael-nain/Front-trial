var unblockCot = function () {
	try {
		var cotizacionId = $('section.sheet').data('id');
		var module = $('.sidebar li.active').data('name');
		// var socketNew = io.connect(nodeUrl);
		var cotBlock = {
			id: cotizacionId,
			folio: $('#main-container .sheet').data('index'),
			user: $('html > body.menu.home > aside > div > div > h1').data('username'),
			// doc_name: $('.titulofinal').val(),
			// total: $('span[name="cotizacion[montos][subtotal_neto]"]').text(),
			block: false,
			module: module,
			from: "boton volver---"
		};
		//console.log("-----------------se desbloquea documento");
		//console.log(cotBlock);
		//socket_ub.emit('stop editing', { sid: unaBase.sid.encoded(), username, hostname: window.origin, id : unaBase.doc.id, module });
		// $.ajax({
		// 	'url': '/4DACTION/_V3_block_by_use',
		// 	data: {
		// 		id: cotizacionId,
		// 		module: module,
		// 		block: false,
		// 		list: false
		// 	},
		// 	dataType: 'json',
		// 	async: false,
		// 	success: function (datas) {
		// 		if(datas.rows.length > 0){
		// 			
		// 			const id = datas.rows[0].id
		// 			if (id != '') {
		// 				let data = { username: datas.rows[0].userLogin, id: datas.rows[0].id }
		// 				navigator.sendBeacon(nodeUrl + "/stop-editing?user=" + datas.rows[0].userLogin + "&id=" + datas.rows[0].id + "&module=" + module + "&sid=" + unaBase.sid.encoded() + "&hostname=" + window.origin, data);
		// 			}
		// 			//console.log("success unblock!!!!!!!!!!");
		// 			// data.rows.push(cotBlock);
		// 			// 
		// 			// if(!uVar.unableSocket){
		// 			// 	socketNew.emit('sendblock', datas.rows);
		// 			// 	socketNew.emit('sendblockAdd', cotBlock);
		// 			// }

		// 		}
		// 	},
		// 	error: function (xhr, text, error) {
		// 		toastr.error(NOTIFY.get('ERROR_INTERNAL', 'Error'));
		// 	}
		// });

		// window.onbeforeunload = function () {
		// 	return '¿Está seguro que desea salir?';
		// }
	} catch (err) {
		console.warn(err);
		console.warn('socket no disponible, block_by_use no disponible');
	}
}

var unblockDisconnected = function (socketNew) {
	try {
		// socketNew.on('new', function (data) {
		// 	let listItems = $('.ui-selectable tr');
		// 	if (listItems.length == 0) {
		// 		return false;
		// 	} else {
		// 		setTimeout(function () {
		// 			let UserBlocking = [];
		// 			$.each(listItems, function (key, value) {
		// 				if (value.dataset.block == "true") {
		// 					UserBlocking.push(value.dataset.blockuser);
		// 				}
		// 			});
		// 			// console.log("UserBlocking1");
		// 			// console.log(UserBlocking);
		// 			UserBlocking = UserBlocking.filter(function (user) {
		// 				if (typeof data.usersLogin != "undefined") {
		// 					return !data.usersLogin.list.includes(user);

		// 				}
		// 			});
		// 			// UserBlocking = UserBlocking.unique();
		// 			UserBlocking = arrUnique(UserBlocking);
		// 			// console.log("UserBlocking2");
		// 			// console.log(UserBlocking);
		// 			for (let i = 0; i < UserBlocking.length; i++) {
		// 				$.ajax({
		// 					url: '/4DACTION/_v3_unblock_disconnected',
		// 					data: {
		// 						blockingUser: UserBlocking[i]
		// 					},
		// 					method: "POST",
		// 					dataType: 'jsonp',
		// 					async: false,
		// 					success: function (data) {
		// 						console.log("success unblock in database");
		// 					}
		// 				});
		// 			}


		// 		}, 5000);
		// 	}
		// });

	} catch (err) {
		console.warn(err);
		console.warn('socket no disponible, block_by_use no disponible');
	}
}