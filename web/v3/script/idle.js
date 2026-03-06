
var get_cot_cata = function(){

	let cotizacion_to_block2 = {
		id: $('.u-doc-data').attr('data-id'),
		folio: Number($('article.general-data h2 span').text().replace('Nº ','')),
		user: $('html > body.menu.home > aside > div > div > h1').data('username'),
		doc_name: $('.titulofinal').val(),
		total: $('input[name="cotizacion[ajuste]"]').val(),
		name: $('html > body.menu.home > aside > div > div > h1').text(),
		module: $('.sidebar li.active a').attr('data-logsmodulo'),
		block: false,
		from: "onbeforeunload---"
	}
	return cotizacion_to_block2;
}


var idleJs = function (cotizacion, idleTime) {
			console.warn("idleJs");
	if(cotizacion){
		var t;
		window.onload = function(){ resetTimer();};
		document.onload = function(){ resetTimer();};
		// DOM Events
		document.onmousemove = function(){ resetTimer(); };
		document.onkeypress = function(){ resetTimer(); };
		document.onmousedown = function(){ resetTimer(); }; // touchscreen presses
		document.ontouchstart = function(){ resetTimer(); };
		document.onclick = function(){ resetTimer(); };     // touchpad clicks
		document.onscroll = function(){ resetTimer(); };    // scrolling with arrow keys

		// $(document).click(function() {
		// 	resetTimer();	
		// });
		// document.onclick = function(){ resetTimer();	};
		// document.onscroll = function(){ resetTimer();   };

		function logout() {
			console.log("logout");
			$('input[name="toUnblock"]').prop('checked', true);
			$('li[data-name=save] button').click();
			// idleUnblock();
		}

		function resetTimer() {
			clearTimeout(t);
			// t = setTimeout(logout, 1800000)
			t = setTimeout(logout, idleTime)
			// 1000 milisec = 1 sec
		}
	}
};

var idleUnblock = function(){

			// alert("You are now logged out.");
				var moduleDoc;
				cotizacion = get_cot_cata();
				if(cotizacion.module == "cotizaciones"){
					moduleDoc = "la cotización";
				}else if(cotizacion.module == "negocios"){
					moduleDoc = "el negocio";
				}
					$('#block_by_use').prop('checked', false);
					$.ajax({
							url: '/4DACTION/_V3_block_by_use',
							data: {
								id: cotizacion.id,
								module: cotizacion.module,
								block: false
							},
							dataType: 'jsonp',
							//async: false,
							success: function(data) {
							}
						});

					var msgStyle = "body{ padding: 10px; line-height: 120%} .task-titles{ color: #04a76b; font-size: 14px;} ul{list-style-type: none} span{font-style: italic; margin-left: 10px} p{ margin-left: 10px} img{vertical-align:middle} a.u-internal{ background-color: #04a76b; padding: 10px; border-radius: 5px; color: white; text-decoration: none; margin-top: 10px; text-align: center; margin: auto;}\
					";
					$.ajax({
							url: nodeUrl+'/sendEmail',
							data: {
								id: cotizacion.id,
								module: cotizacion.module,
								subject: "Por inactividad, te hemos sacado de "+moduleDoc+" Nro. "+cotizacion.folio,
								msg: "<!DOCTYPE html>\
									<html lang='es'>\
									<head>\
										<style>\
										"+msgStyle+"\
										</style>\
									</head> \
									<body>\
									 Estimado/a <b class='task-titles'>"+camelWord(cotizacion.name)+"</b>,<br> Te hemos sacado de "+moduleDoc+" <b>Nro. "+cotizacion.folio+ "</b> despues de "+(idleTime/1000)/60+" minutos de inactividad. No te preocupes los datos modificados con anterioridad fueron guardados.\
									</body>\
									</html>",
								block: false,
								folio: $('#main-container .sheet').data('index'),
								email: $('.u-user-profile').data('email')
							},
							dataType: 'jsonp',
							async: false,
							success: function(data) {
							}
						});
					// socketNew.emit('sendblockAdd', cotizacion);
					// if(!uVar.unableSocket){
					// 	if(cotizacion.module == "cotizaciones"){
					// 		socketNew.emit('sendblockAdd', cotizacion);
					// 	}else if(cotizacion.module == "negocios"){
					// 		socketNew.emit('sendblockAddNg', cotizacion);
					// 	}
					// 	// $('li[data-name=save] button').click();
					// }

					window.onbeforeunload = function(){
					}
					location.reload();
}