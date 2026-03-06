var addslashes = function (str) {
	str = str.replace(/\\/g, '\\\\');
	str = str.replace(/\'/g, '\\\'');
	str = str.replace(/\"/g, '\\"');
	str = str.replace(/\0/g, '\\0');
	return str;
};

var stripslashes = function (str) {
	str = str.replace(/\\'/g, '\'');
	str = str.replace(/\\"/g, '"');
	str = str.replace(/\\0/g, '\0');
	str = str.replace(/\\\\/g, '\\');
	return str;
};

var asyncLoop = function (size, action, callback) {
	var i = -1;
	var loop = function () {
		i++;
		if (i == size) {
			callback();
			return;
		}
		(function (loop, i) {
			setTimeout(action(i), 1);
			loop();
		})(loop, i);
	}
	loop();
};

const coll = (style) => {
	document.querySelectorAll('.submenu-contable').forEach(t => {
		t.style.display = style
		t.style.backgroundColor = '#F5FAF9'
	});
}

const collapseOpen = (e) => {
	//Cambiar icono
	if (e.classList.contains('comprobantes')) {
		//e.currentTarget.childNodes[3].style.display = ''
		if (document.getElementById('submenu-asientos').style.display === 'none') {
			e.childNodes[2].classList.add('rotate')
			coll('')
		} else {
			e.childNodes[2].classList.remove('rotate')
			coll('none')
		}
	}
}

const collapseOut = (e) => {
	let module = e[0].innerText != undefined ? e.innerText.trim() : ''

	if (module != 'Contabilidad' && !e[0].target.parentNode.classList.contains('active') && !e[0].currentTarget.parentNode.classList.contains('active')) {
		document.getElementById('submenu-balance').style.display = 'none'
	}
}

var downloadUrl = function (url) {
	var hiddenIFrameID = 'hiddenDownloader',
		iframe = document.getElementById(hiddenIFrameID);
	if (iframe === null) {
		iframe = document.createElement('iframe');
		iframe.id = hiddenIFrameID;
		iframe.style.display = 'none';
		document.body.appendChild(iframe);
	}
	iframe.src = url;
};

String.prototype.capitalize = function () {
	var str = this.toLowerCase();
	return str.charAt(0).toUpperCase() + str.slice(1);
};

String.prototype.capitalizeAllWords = function () {
	var str = this.toLowerCase();
	var pieces = str.split(" ");
	for (var i = 0; i < pieces.length; i++) {
		var j = pieces[i].charAt(0).toUpperCase();
		pieces[i] = j + pieces[i].substr(1);
	}
	return pieces.join(" ");
};

Date.parse = function (s) {
	var day, tz,
		rx = /^(\d{4}\-\d\d\-\d\d([tT ][\d:\.]*)?)([zZ]|([+\-])(\d\d):(\d\d))?$/,
		p = rx.exec(s) || [];
	if (p[1]) {
		day = p[1].split(/\D/);
		for (var i = 0, L = day.length; i < L; i++)
			day[i] = parseInt(day[i], 10) || 0;
		day[1] -= 1;
		day = new Date(Date.UTC.apply(Date, day));
		if (!day.getDate())
			return NaN;
		if (p[5]) {
			tz = (parseInt(p[5], 10) * 60);
			if (p[6])
				tz += parseInt(p[6], 10);
			if (p[4] == '+')
				tz *= -1;
			if (tz)
				day.setUTCMinutes(day.getUTCMinutes() + tz);
		}
		return day;
	}
	return NaN;
};


window.alert = function (message) {
	var def = $.Deferred();
	$(document.createElement('div')).attr({
		title: 'Mensaje de alerta'
	}).html(message).dialog({
		dialogClass: 'alert',
		buttons: {
			'Aceptar': function () {
				def.resolve();
				$(this).remove();
			}
		},
		close: function () {
			def.resolve();
			$(this).remove();
		},
		draggable: true,
		modal: true,
		resizable: false,
		width: 500,
		height: "auto",
		minHeight: 10
	}).keypress(function (event) {


		if (event.which == 13)
			$('.ui-dialog-buttonset button:eq(0)').trigger('click');
	});

	return def.promise();
};

window.confirm = function (message, btnOk, btnCancel) {
	if (typeof btnOk == 'undefined') btnOk = 'Sí';
	if (typeof btnCancel == 'undefined') btnCancel = 'No';
	var def = $.Deferred();
	var buttons = {};
	buttons[btnOk] = function () {
		def.resolve(true);
		$(this).remove();
	};
	buttons[btnCancel] = function () {
		def.resolve(false);
		$(this).remove();
	};
	$(document.createElement('div')).attr({
		title: 'Mensaje de confirmación'
	}).html(message).dialog({
		dialogClass: 'confirm',
		buttons: buttons,
		close: function () {
			def.reject();
			$(this).remove();
		},
		draggable: true,
		modal: true,
		resizable: false,
		width: 500,
		height: "auto",
		minHeight: 10
	}).keypress(function (event) {


		if (event.which == 13)
			$('.ui-dialog-buttonset button:eq(0)').trigger('click');
	});

	return def.promise();
};

window.prompt = function (message, btnOk, btnCancel, required, rejectCallback) {
	if (typeof btnOk == 'undefined') btnOk = 'Aceptar';
	if (typeof btnCancel == 'undefined') btnCancel = 'Cancelar';
	if (typeof required == 'undefined') required = false;
	var def = $.Deferred();
	var buttons = {};
	buttons[btnOk] = function () {

		if ((typeof $(this).find('section').data('response') == 'undefined' || $(this).find('section').data('response') == "") && $(this).find('section').find('input, textarea').prop('required')) {
			$(this).find('section').find('input, textarea').addClass('invalid');
		} else {
			$(this).find('section').find('input, textarea').removeClass('invalid');
			def.resolve($(this).find('section').data('response'));
			$(this).remove();
		}
	};
	if (typeof required != 'undefined') {
		if (!required) {
			buttons[btnCancel] = function () {
				//def.resolve(false);
				def.reject();
				$(this).remove();
			};
		}
	}
	$(document.createElement('div')).attr({
		title: 'Mensaje de solicitud'
	}).html(message).dialog({
		dialogClass: 'prompt',
		buttons: buttons,
		beforeClose: function () {
			if (required)
				toastr.warning('Debe ingresar la información solicitada antes de continuar.');
			return !required;
		},
		close: function () {
			if (!required) {
				def.reject();
				$(this).remove();
				if (typeof rejectCallback == 'function')
					rejectCallback();
			} else {
				if (typeof rejectCallback == 'function')
					rejectCallback();
				return false;
			}
		},
		draggable: true,
		modal: true,
		resizable: false,
		width: 500,
		height: "auto",
		minHeight: 10
		//}).addClass('dialog');
	}).keypress(function (event) {


		/*if (event.which == 13) {
			$('.ui-dialog [name="response"]').trigger('blur');
			$('.ui-dialog-buttonset button:eq(0)').trigger('click');
		}*/
	})

	return def.promise();


};



/**
 * $.unserialize
 *
 * Takes a string in format "param1=value1&param2=value2" and returns an object { param1: 'value1', param2: 'value2' }. If the "param1" ends with "[]" the param is treated as an array.
 *
 * Example:
 *
 * Input:  param1=value1&param2=value2
 * Return: { param1 : value1, param2: value2 }
 *
 * Input:  param1[]=value1&param1[]=value2
 * Return: { param1: [ value1, value2 ] }
 *
 * @todo Support params like "param1[name]=value1" (should return { param1: { name: value1 } })
 */
(function ($) {
	$.unserialize = function (serializedString) {
		var str = decodeURI(serializedString);
		var pairs = str.split('&');
		var obj = {}, p, idx, val;
		for (var i = 0, n = pairs.length; i < n; i++) {
			p = pairs[i].split('=');
			idx = p[0];

			if (idx.indexOf("[]") == (idx.length - 2)) {
				// Eh um vetor
				var ind = idx.substring(0, idx.length - 2)
				if (obj[ind] === undefined) {
					obj[ind] = [];
				}
				obj[ind].push(p[1]);
			}
			else {
				obj[idx] = p[1];
			}
		}
		return obj;
	};
})(jQuery);

$(document).ready(function () {
	jQuery.fn.extend({
		invalid: function () {
			//var element;
			$(this).addClass('invalid');
			$(this).bind('click focus', function () {
				$(this).removeClass('invalid');
			});

			//element = $(this);
			//return element;
			return this;
		},
		prevTo: function (selector) {
			//var element;

			if ($(this).prevUntil(selector).last().prev().length > 0)
				//element = $(this).prevUntil(selector).last().prev();
				return $(this).prevUntil(selector).last().prev();
			else
				//element = $(this).prev();
				return $(this).prev();

			//return element;
		},
		nextTo: function (selector) {
			//var element;

			if ($(this).nextUntil(selector).last().prev().length > 0)
				//element = $(this).nextUntil(selector).last().next();
				return $(this).nextUntil(selector).last().next();
			else
				//element = $(this).next();
				return $(this).next();

			//return element;
		},
		parentTo: function (selector) {
			//var element;

			if ($(this).parentsUntil(selector).last().parent().length > 0)
				//element = $(this).parentsUntil(selector).last().parent();
				return $(this).parentsUntil(selector).last().parent();
			else
				//element = $(this).parent();
				return $(this).parent();

			//return element;
		},
		validateNumbers: function () {
			//var element;

			if (isNaN($(this).val()) || $(this).val() == '')
				$(this).val(0);

			//element = $(this);

			//return element;
			return this;
		},
		isVisible: function () {
			return (this.css('visibility') != 'hidden');
		},
		visible: function () {
			return this.css('visibility', 'visible');
		},
		invisible: function () {
			return this.css('visibility', 'hidden');
		},
		visibilityToggle: function () {
			return this.css('visibility', function (i, visibility) {
				return (visibility == 'visible') ? 'hidden' : 'visible';
			});
		}
	});


	$("[title]").tooltip();

	unaBase.init();
	// $('html > body.menu.home > aside > div.side-inner > div.nav-menu > ul > li:not(.iframe) > a').click(function () {
	// 	const element = this
	// 	$('section #iframe iframe')[0].src = '' 
	// 	$('section #iframe')[0].style.height = '0px' 
	// })

	$('html > body.menu.home > aside > div.side-inner > div.nav-menu > ul > li.iframe > a').click(function () {
		////href="https://panel-primo.netlify.app/dashboard/v3/soporte/<!--#4DHTML Substring(String(webUrl);9;Length(webUrl))-->"
		const el = this

		// 
		// if(el.text === 'Home'){
		// 	let url = `https://panel-primo.netlify.app/dashboard/v3/${currentUser.username}/${window.origin}`
		// 	$('html > body.menu.home > aside > div.side-inner > div.nav-menu > ul > li').removeClass('active');
		// 	unaBase.loadInto.iframe(url);
		// 	$(this).parent().addClass('active');
		// 	return;
		// }
		// 

		unaBase.toolbox.search.savedSearch = null;
		if ($(this).attr('href') != '#' && $(this).attr('href') != '') {
			$('html > body.menu.home > aside > div.side-inner > div.nav-menu > ul > li').removeClass('active');
			unaBase.loadInto.iframe($(this).attr('href'));
			// let url = `https://dev-panel.herokuapp.com/dashboard?from=v3&user=${currentUser.username}&url=${window.origin.substring(8, window.origin.length)}&sid=${unaBase.sid.encoded()}`
			$(this).parent().addClass('active');
		}
		return false;
	});

	$('html > body.menu.home > aside > div.side-inner > div.nav-menu > ul > li > a').click(function (event) {
		event.preventDefault();
		var clickedElement = $(this).parent('li');
		
		clickedElement.addClass('active').siblings().removeClass('active');
		var element = this;
		unaBase.toolbox.search.savedSearch = null;
		var target = $('#menu [data-name="exit"] button');
		
		// if (element.id === 'incomevx') {
		// 	window.open('https://app.unabase.cc', '_blank');
		// 	return;
		// }
		if (target.length > 0) {
			if (element.id === 'accounting') {
				return;
			}

			// Preguntará siempre, no solo cuando se trate de un doc nuevo
			//if ($('section.sheet').data('index') == 0) {

			var title = $(element).text();
			var href = $(element).attr('href');
			var standalone = $(element).parentTo('li').hasClass('standalone');
			var iframe = $(element).parentTo('li').hasClass('iframe');
			
			event.preventDefault();
			event.stopImmediatePropagation();

			var callback = function (data) {
				if (data) {
					unaBase.utilities.limpiarUrl()
					//target.triggerHandler('click');
					if (!iframe) {
						$('#viewport *').off();
						$('#viewport *').remove();
					}
					if (iframe)
						unaBase.loadInto.iframe(href);
					else {
						unaBase.loadInto.viewport(href, title, standalone);
					}
					$('html > body > aside > div.side-inner > div.nav-menu > ul > li').removeClass('active');
					$(element).parentTo('li').addClass('active');
				}
				if (unaBase.back.callback) {
					unaBase.back.callback();
				}
			}

			if (unaBase.changeControl.query()) {
				confirm(MSG.get('CONFIRM_EXIT_UNSAVED')).done(callback);
			} else {
				callback(true);
			}
			//}
		}
	});

	$('html > body.menu.home > aside > div.side-inner > div.nav-menu > ul > li:not(.iframe) > a').click(function () {

		unaBase.toolbox.search.savedSearch = null;
		let htmlObject = $(this)
		
		if ($(this).attr('href') != '#' && $(this).attr('href') != '') {
			href = $(this).attr('href');
			if (document.querySelector('#iframe') != undefined && document.querySelector('#iframe').style.display === '') {
				setTimeout(() => {
					document.querySelector('#iframe').style.display = 'none'
				}, '2000')
			} else {

				$('html > body.menu.home > aside > div.side-inner > div.nav-menu > ul > li').removeClass('active');
				unaBase.loadInto.viewport(href, $(this).parent().text(), $(this).parentTo('li').hasClass('standalone'));
			}

			$(this).parent().addClass('active');
		} else {

			let module = htmlObject[0]

			if (module.classList.contains('comprobantes')) {
				collapseOpen(htmlObject[0])
			}

		}
		return false;
	});

	$('html > body.menu.home > aside > div.side-inner > div.nav-menu > h1').click(function () {
		unaBase.loadInto.viewport('/v3/views/wizard/index.shtml', 'Asistente de Configuración', true);
	}).triggerHandler('click');

	$('#icon-profile').click(function () {
		unaBase.loadInto.dialog('/v3/views/user-profile/index.shtml', 'Mi perfil', 'medium');
	});

	$('a.client-mode').click(function () {
		$(this).toggleClass('active');
		if ($(this).hasClass('active')) {
			is_modo_cliente = true;
			toastr.info('Modo cliente activado.');
		} else {
			is_modo_cliente = false;
			toastr.info('Modo cliente desactivado.');
		}
	});



	//   if(typeof Chat !== 'undefined'){
	// Chat.initialize('http://' + nodejs_public_ipaddr + ':' + nodejs_port + '/');    	
	//   }
	setTimeout(function () {
		if (typeof Chat !== 'undefined') {
			Chat.initialize(webUrl + '/');
		}

	}, 3000);


	/*$('#dialog-profile').dialog({
	  autoOpen: false,
	  height: 350,
	  width: 600,
	  modal: true,
	  title: 'Perfil',
	  buttons: {
		"Aceptar": function() {
		  alert('Cambios guardados');
		},
		Cancelar: function() {
		  $( this ).dialog( "close" );
		}
	  },
	  close: function() {

	  }
	});

	$('#dialog-profile > div.tabs').tabs();

	$('html > body.menu > aside > div > div > a').click(function() {
		$('#dialog-profile').dialog('open');
	 });*/

	/* $('[title]').live('mouseover', function(event) {
		$(this).qtip({
			content: {
				text: $(this).attr('title')
			},
			show: {
				event: event.type,
				ready: true
			}
		});
	});

	$('[title]').each(function() {
		$(this).qtip({
			content: {
				text: $(this).attr('title')
			}
		});
	}); */

	$('html > body').on('click', '.numeric input', function (event) {
		$(this).select();
		event.preventDefault();
	});

	$.ajaxSetup({
		error: function (xhr, ajaxOptions, thrownError) {
			switch (xhr.status) {
				case 403:
					window.onbeforeunload = null;
					alert(MSG.get('ALERT_SESSION_EXPIRED')).done(function () {
						location.href = '/';
					});
					break;
				default:



			}
		}
	});

	var updateInbox = function () {
		$.ajax({
			url: '/4DACTION/_V3_getLogValidacion',
			dataType: 'json',
			success: function (data) {
				var messages = data.rows.length;
				$('html > body.menu.home > aside > div > div > ul > li[data-name="inbox"] > a > span').text(messages);
			}
		});
	};

	// updateInbox();
	// setInterval(updateInbox, 60000);

	$('html > body.menu.home > div.toggle.menu').click(function () {
		$('html > body.menu.home').toggleClass('tablet');
	});

	// Accesos

	$('html > body.menu > header > button.access').button({
		icons: {
			primary: 'ui-icon-person'
		},
		text: false
	});

	$('#icon-permisos').click(function () {

		//var uri = $('html > body.menu.home > aside > div > div > ul > li.active > a')[0];
		//var path = uri.pathname + uri.search;
		//unaBase.loadInto.dialog('/v3/views/usuarios/dialog/acceso.shtml?path=' + path, 'Permisos', 'medium');

		var modulo = $('html > body.menu.home > aside > div.side-inner > div.nav-menu > ul > li.active').data('name').toUpperCase();
		unaBase.loadInto.dialog('/v3/views/usuarios/dialog/acceso.shtml?m=' + modulo, 'PERMISOS ' + modulo, 'medium');
	});

	// Notificaciones

	$('html > body.menu > header > button.current').button({
		icons: {
			primary: 'ui-icon-zoomin'
		},
		text: false
	});

	if (!access._650) {
		$('html > body.menu > header > button.nodeServer').hide();
	} else {
		$('html > body.menu > header > button.nodeServer').button({
			icons: {
				primary: 'ui-icon-signal'
			},
			text: false
		});

	}

	//if(!access._650){
	$('html > body.menu > header > button.current').hide();
	//}

	$('html > body.menu > header > button.notifications').button({
		icons: {
			primary: 'ui-icon-alert'
		},
		text: false
	});
	$('html > body.menu > header > button.intercom-btn').button({
		icons: {
			primary: 'ui-icon-comment'
		},
		text: false
	});

	$('html > body.menu > header > button.help').button({
		icons: {
			primary: 'ui-icon-help'
		},
		text: false
	});

	$('html > body.menu > header > button.info').button({
		icons: {
			primary: 'ui-icon-info'
		},
		text: false
	});

	// $('html > body.menu > header > button.reportes').button({
	// 	icons: {
	// 		primary: 'ui-icon-document'
	// 	},
	// 	text: false
	// }).click(function(){
	// 	var selectedMenu = $('html > body.menu.home > aside > div > div > ul > li.active').data('name');
	// 	var modulo = (typeof selectedMenu != 'undefined')? selectedMenu.toUpperCase() : '';
	// 	unaBase.loadInto.dialog('/v3/views/reportes2/dialog/reportes.shtml', 'Reportes', 'medium');

	// });

	$('#icon-nodeServer').click(function () {

		$('button.nodeServer').addClass('offline');
		$('button.nodeServer').removeClass('online');
		unaBase.node.check(true).then(res => {
			$('button.nodeServer').addClass('online');
			$('button.nodeServer').removeClass('offline');
		}).catch(err => {

			$('button.nodeServer').addClass('offline');
			$('button.nodeServer').removeClass('online');
			unaBase.node.quickRestart(true, true).then(res => {
			}).catch(err => {

			});
		});
	});
	$('#icon-intercom').click(function () {


		if (document.querySelector(".intercom-lightweight-app"))
			document.querySelector(".intercom-lightweight-app").hidden = !document.querySelector(".intercom-lightweight-app").hidden;
		else
			document.querySelector(".intercom-launcher-frame").style.display == "none" ? document.querySelector(".intercom-launcher-frame").style.display = "" : document.querySelector(".intercom-launcher-frame").style.display = "none";;


	});
	$('#icon-notifications').click(function () {

		//var uri = $('html > body.menu.home > aside > div > div > ul > li.active > a')[0];
		//var path = uri.pathname + uri.search;
		//unaBase.loadInto.dialog('/v3/views/usuarios/dialog/acceso.shtml?path=' + path, 'Permisos', 'medium');
		var selectedMenu = $('html > body.menu.home > aside > div.side-inner > div.nav-menu > ul > li.active').data('name');
		var modulo = (typeof selectedMenu != 'undefined') ? selectedMenu.toUpperCase() : '';
		unaBase.loadInto.dialog('/v3/views/usuarios/dialog/notificaciones.shtml?m=' + modulo, 'NOTIFICACIONES ' + modulo, 'medium');
	});

	$('html > body.menu > header > button.current').click(function () {
		//var uri = $('html > body.menu.home > aside > div > div > ul > li.active > a')[0];
		//var path = uri.pathname + uri.search;
		//unaBase.loadInto.dialog('/v3/views/usuarios/dialog/acceso.shtml?path=' + path, 'Permisos', 'medium');
		var selectedMenu = $('html > body.menu.home > aside > div.side-inner > div.nav-menu > ul > li.active').data('name');
		var modulo = (typeof selectedMenu != 'undefined') ? selectedMenu.toUpperCase() : '';
		unaBase.loadInto.dialog('/v3/views/general/dialog/current.shtml', 'Actual ', 'small');
	});

	$('#icon-help').click(buildHelp);

	$('html > body.menu > aside > div > div > ul > li > a').dblclick(function (e) {
		e.preventDefault();
		e.stopImmediatePropagation();
		return false;
	});

});

window.onbeforeunload = function () {
	return '¿Está seguro que desea salir?';
};

var formatCurrency = function () {
	$('.currency:not(.numeric)').formatCurrency({
		region: 'es-CL',
		decimalSymbol: ',',
		digitGroupSymbol: '.',
		roundToDecimalPlace: currency.decimals,
		symbol: '<span class="symbol">' + currency.symbol + '</span>',
		positiveFormat: (currency.is_right) ? '%n%s' : '%s%n',
		negativeFormat: (currency.is_right) ? '-%n%s' : '-%s%n'
	});
};

var selectInTable = function (selector) {
	selector.find('tbody').bind('mousedown', function (event) {
		//event.metaKey = true;
	}).selectable({
		filter: 'tr',
		distance: 0,
		stop: function (event, ui) {
			$(event.target).children('.ui-selected').not(':first').removeClass('ui-selected');
		}
	});
};




var htmlspecialchars = function (string, quote_style, charset, double_encode) {
	//       discuss at: http://phpjs.org/functions/htmlspecialchars/
	//      original by: Mirek Slugen
	//      improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	//      bugfixed by: Nathan
	//      bugfixed by: Arno
	//      bugfixed by: Brett Zamir (http://brett-zamir.me)
	//      bugfixed by: Brett Zamir (http://brett-zamir.me)
	//       revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	//         input by: Ratheous
	//         input by: Mailfaker (http://www.weedem.fr/)
	//         input by: felix
	// reimplemented by: Brett Zamir (http://brett-zamir.me)
	//             note: charset argument not supported
	//        example 1: htmlspecialchars("<a href='test'>Test</a>", 'ENT_QUOTES');
	//        returns 1: '&lt;a href=&#039;test&#039;&gt;Test&lt;/a&gt;'
	//        example 2: htmlspecialchars("ab\"c'd", ['ENT_NOQUOTES', 'ENT_QUOTES']);
	//        returns 2: 'ab"c&#039;d'
	//        example 3: htmlspecialchars('my "&entity;" is still here', null, null, false);
	//        returns 3: 'my &quot;&entity;&quot; is still here'

	var optTemp = 0,
		i = 0,
		noquotes = false;
	if (typeof quote_style === 'undefined' || quote_style === null) {
		quote_style = 2;
	}
	string = string.toString();
	if (double_encode !== false) { // Put this first to avoid double-encoding
		string = string.replace(/&/g, '&amp;');
	}
	string = string.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');

	var OPTS = {
		'ENT_NOQUOTES': 0,
		'ENT_HTML_QUOTE_SINGLE': 1,
		'ENT_HTML_QUOTE_DOUBLE': 2,
		'ENT_COMPAT': 2,
		'ENT_QUOTES': 3,
		'ENT_IGNORE': 4
	};
	if (quote_style === 0) {
		noquotes = true;
	}
	if (typeof quote_style !== 'number') { // Allow for a single string or an array of string flags
		quote_style = [].concat(quote_style);
		for (i = 0; i < quote_style.length; i++) {
			// Resolve string input to bitwise e.g. 'ENT_IGNORE' becomes 4
			if (OPTS[quote_style[i]] === 0) {
				noquotes = true;
			} else if (OPTS[quote_style[i]]) {
				optTemp = optTemp | OPTS[quote_style[i]];
			}
		}
		quote_style = optTemp;
	}
	if (quote_style & OPTS.ENT_HTML_QUOTE_SINGLE) {
		string = string.replace(/'/g, '&#039;');
	}
	if (!noquotes) {
		string = string.replace(/"/g, '&quot;');
	}

	return string;
};


Number.prototype.numberFormat = function (decimals, dec_point, thousands_sep) {
	dec_point = typeof dec_point !== 'undefined' ? dec_point : '.';
	thousands_sep = typeof thousands_sep !== 'undefined' ? thousands_sep : ',';

	var parts = this.toFixed(decimals).split('.');
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousands_sep);

	return parts.join(dec_point);
};

$(function () {
	/*
	 * this swallows backspace keys on any non-input element.
	 * stops backspace -> back
	 */
	var rx = /INPUT|SELECT|TEXTAREA/i;

	$(document).bind("keydown keypress", function (e) {
		

		if (e.which == 8) { // 8 == backspace
			if (!rx.test(e.target.tagName) || e.target.disabled || e.target.readOnly) {
				e.preventDefault();
				return false;
			}
		}
	});


		
});

$.urlParam = function (name, url) {
	if (!url) {
		url = window.location.href;
	}
	var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(url);
	if (!results) {
		return undefined;
	}
	return results[1] || undefined;
};
