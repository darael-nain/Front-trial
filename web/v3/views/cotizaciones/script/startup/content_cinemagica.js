

//--- ini -- agregado el 03-11-17 - gin - para verificar que no se pueda anular cotizaciones con facturas de venta asociada
var cotizacion = {
	verifyHasDocs: function(id){
		var info;
		$.ajax({
			url: '/4DACTION/_V3_verifyHasDocsCot',
			data: {
				id: id
			},
			dataType: 'json',
			async: false,
			success: function(data) {
				info = data;
			}
		});
		return info;
	}

}
//--- ini -- agregado el 03-11-17 - gin - para verificar que no se pueda anular cotizaciones con facturas de venta asociada

var params = {
	entity: 'Cotizacion',
	buttons: [ 'save','refresh', 'delete', 'clone_current', 'convert_negocio', 'conversion_negocio_request', 'discard', 'restore', 'exit', 'preview', 'share', 'template', 'validate', 'offline_mode'],
	data: function() {
		var tuple = {};
		var fields = {
			id: $('section.sheet').data('id'),
			index: $('section.sheet').data('index'),
			text: $('input[name="cotizacion[titulo][text]"]').val(),
			empresa: $('input[name="cotizacion[empresa][id]"]').data('id'),
			contacto: $('input[name="cotizacion[empresa][contacto][id]"]').data('id'),
			empresa2: $('input[name="cotizacion[empresa2][id]"]').data('id'),
			contacto2: $('input[name="cotizacion[empresa2][contacto][id]"]').data('id'),
			ejecutivo: $('input[name="cotizacion[ejecutivo][id]"]').data('id'),
			area_negocio: $('input[name="cotizacion[area_negocio]"]').data('id'),
			proyecto: $('input[name="cotizacion[proyecto]"]').data('id'),
			readonly: $('section.sheet').data('readonly'),
			'cotizacion[precios][subtotal]': (parseFloat($('input[name="cotizacion[precios][subtotal]"]').val()) * exchange_rate).toString().replace(/\./g, ','),
			'cotizacion[costos][subtotal]': (parseFloat($('input[name="cotizacion[costos][subtotal]"]').val()) * exchange_rate).toString().replace(/\./g, ','),
			'cotizacion[utilidades][subtotal]': (parseFloat($('input[name="cotizacion[utilidades][subtotal]"]').val()) * exchange_rate).toString().replace(/\./g, ','),
			'cotizacion[margenes][margen_venta]': $('input[name="cotizacion[margenes][margen_venta]"]').val(),
			'cotizacion[margenes][margen_compra]': $('input[name="cotizacion[margenes][margen_compra]"]').val(),
			//'cotizacion[descuento][porcentaje]': $('input[name="cotizacion[descuento][porcentaje]"]').val().replace('.',','),
			//'cotizacion[descuento][valor]': (parseFloat($('input[name="cotizacion[descuento][valor]"]').val()) * exchange_rate).toString().replace(/\./g, ','),
			'cotizacion[descuento][porcentaje]': 0,
			'cotizacion[descuento][valor]': 0,
			'cotizacion[montos][impuesto]': (parseFloat($('input[name="cotizacion[montos][impuesto]"]').val()) * exchange_rate).toString().replace(/\./g, ','),
			'cotizacion[montos][impuesto][exento]': $('input[name="cotizacion[montos][impuesto][exento]"]').prop('checked'),
			'cotizacion[montos][subtotal_neto]': (parseFloat($('input[name="cotizacion[ajuste]"]').val()) * exchange_rate).toString().replace(/\./g, ','),
			'cotizacion[montos][total]': (parseFloat($('input[name="cotizacion[montos][total]"]').val()) * exchange_rate).toString().replace(/\./g, ','),
			'cotizacion[condiciones][forma_pago]': $('input[name="cotizacion[condiciones][forma_pago]"]').data('id'),
			'cotizacion[condiciones][validez]': $('input[name="cotizacion[condiciones][validez]"]').val(),
			'cotizacion[condiciones][fecha_proyecto]': $('input[name="cotizacion[condiciones][fecha_proyecto]"]').val(),
			'cotizacion[condiciones][fecha_entrega]': $('input[name="cotizacion[condiciones][fecha_entrega]"]').val(),
			'cotizacion[condiciones][vencimiento_cotizacion]': $('input[name="cotizacion[vencimiento_cotizacion]"]').val(),
			'cotizacion[condiciones][notas]': $('[name="cotizacion[condiciones][notas]"]').val(),
			'cotizacion[condiciones][no_incluye]': $('[name="cotizacion[condiciones][no_incluye]"]').val(),
			'cotizacion[montos][utilidad]': (parseFloat($('input[name="cotizacion[montos][utilidad]"]').val()) * exchange_rate).toString().replace(/\./g, ','),
			'cotizacion[montos][utilidad_ratio]': $('input[name="cotizacion[montos][utilidad_ratio]"]').val(),
			'cotizacion[montos][costo]': (parseFloat($('input[name="cotizacion[montos][costo]"]').val()) * exchange_rate).toString().replace(/\./g, ','),
			'cotizacion[montos][costo_ratio]': $('input[name="cotizacion[montos][costo_ratio]"]').val(),
			'cotizacion[moneda]': $('input[name="cotizacion[moneda]"]').first().val(),
			'cotizacion[tipo_cambio]': $('input[name="cotizacion[tipo_cambio]"]').val(),
			'cotizacion[tipo_cambio_trabajo]': $('input[name="cotizacion[tipo_cambio_trabajo]"]').val(),
			'cotizacion[ver_solo_items_usados]': $('input[name="cotizacion[ver_solo_items_usados]"]').is(':checked'),

			// Sección datos cinemágica
			'cotizacion[cinemagica][director][porcentaje]': (parseFloat(blockCinemagica.find('[name="cotizacion[cinemagica][director][porcentaje]"]').val())).toString().replace(/\./g, ','),
			'cotizacion[cinemagica][director][valor]': (parseFloat(blockCinemagica.find('[name="cotizacion[cinemagica][director][valor]"]').val())).toString().replace(/\./g, ','),
			'cotizacion[cinemagica][compania][valor]': (parseFloat(blockCinemagica.find('[name="cotizacion[cinemagica][compania][valor]"]').val())).toString().replace(/\./g, ','),
			'cotizacion[cinemagica][valor_pelicula]': (parseFloat(blockCinemagica.find('[name="sobrecargo[1][subtotal]"]').val())).toString().replace(/\./g, ','),
		};

		$('section.sheet input[name^="dato["]').each(function() {
			fields[$(this).prop('name')] = $(this).val();
		});


		//$('section.sheet section.sobrecargos ul li').each(function() {
			/*
			var fields = {
				id: $(this).data('id'),
				fk: $('section.sheet').data('id'),
				porcentaje: parseFloat($(this).find('[name^="sobrecargo"][name$="[porcentaje]"]').data('value')),
				valor: (parseFloat($(this).find('[name^="sobrecargo"][name$="[valor]"]').val()) * exchange_rate).toString().replace(/\./g, ','),
				// valor: parseFloat($(this).find('[name^="sobrecargo"][name$="[valor]"]').val()),
				cerrado: $(this).find('[name^="sobrecargo"][name$="[cerrado]"]').prop('checked'),
				real: $(this).find('[name^="sobrecargo"][name$="[real]"]').prop('checked')
			};
			*/

			var sobrecargos = [
				{
					id: 1,
					fk: $('section.sheet').data('id'),
					porcentaje: parseFloat(blockCinemagica.find('[name="sobrecargo[1][porcentaje]"]').val()),
					valor: (parseFloat(blockCinemagica.find('[name="sobrecargo[1][valor]"]').val())).toString().replace(/\./g, ','),
					cerrado: false,
					real: false
				},
				{
					id: 2,
					fk: $('section.sheet').data('id'),
					porcentaje: 0,
					valor: 0,
					cerrado: false,
					real: false
				},
				{
					id: 3,
					fk: $('section.sheet').data('id'),
					porcentaje: 0,
					valor: 0,
					cerrado: false,
					real: false
				},
				{
					id: 4,
					fk: $('section.sheet').data('id'),
					porcentaje: parseFloat(blockCinemagica.find('[name="sobrecargo[4][porcentaje]"]').val()),
					valor: (parseFloat(blockCinemagica.find('[name="sobrecargo[4][valor]"]').val())).toString().replace(/\./g, ','),
					cerrado: false,
					real: false
				},
				{
					id: 5,
					fk: $('section.sheet').data('id'),
					porcentaje: 0,
					valor: 0,
					cerrado: false,
					real: false
				},
				{
					id: 6,
					fk: $('section.sheet').data('id'),
					porcentaje: parseFloat(blockCinemagica.find('[name="sobrecargo[6][porcentaje]"]').val()),
					valor: (parseFloat(blockCinemagica.find('[name="sobrecargo[6][valor]"]').val())).toString().replace(/\./g, ','),
					cerrado: false,
					real: false
				},

			];
			// let surcharges = {
			// 	fk: $('section.sheet').data('id'),
			// 	"id[1]": 1,
			// 	"porcentaje[1]": parseFloat(blockCinemagica.find('[name="sobrecargo[1][porcentaje]"]').val()),
			// 	"valor[1]": (parseFloat(blockCinemagica.find('[name="sobrecargo[1][valor]"]').val())).toString().replace(/\./g, ','),
			// 	"cerrado[1]": false,
			// 	"real[1]": false,
			// 	//--------------------
			// 	"id[2]": 2,
			// 	"porcentaje[2]": 0,
			// 	"valor[2]": 0,
			// 	"cerrado[2]": false,
			// 	"real[2]": false,
			// 	//--------------------
			// 	"id[3]": 3,
			// 	"porcentaje[3]": 0,
			// 	"valor[3]": 0,
			// 	"cerrado[3]": false,
			// 	"real[3]": false,
			// 	//--------------------
			// 	"id[4]": 4,
			// 	"porcentaje[4]": parseFloat(blockCinemagica.find('[name="sobrecargo[4][porcentaje]"]').val()),
			// 	"valor[4]": (parseFloat(blockCinemagica.find('[name="sobrecargo[4][valor]"]').val())).toString().replace(/\./g, ','),
			// 	"cerrado[4]": false,
			// 	"real[4]": false,
			// 	//--------------------
			// 	"id[5]": 5,
			// 	"porcentaje[5]": 0,
			// 	"valor[5]": 0,
			// 	"cerrado[5]": false,
			// 	"real[5]": false,
			// 	//--------------------
			// 	"id[6]": 6,
			// 	"porcentaje[6]": parseFloat(blockCinemagica.find('[name="sobrecargo[6][porcentaje]"]').val()),
			// 	"valor[6]": (parseFloat(blockCinemagica.find('[name="sobrecargo[6][valor]"]').val())).toString().replace(/\./g, ','),
			// 	"cerrado[6]": false,
			// 	"real[6]": false,
			// }
		

			// $.ajax({
			// 		url: '/4DACTION/_V3_setSobrecargoByCotizacion1',
			// 		dataType: 'json',
			// 		data: surcharges,
			// 		async: false,
			// 		cache: false,
			// 		success: function(data) {
			// 		},
			// 		error: function() {
			// 			toastr.error('No se pudo guardar el sobrecargo');
			// 			// manejar esta situación
			// 		}
			// 	});

			
			for (var index = 0, len = sobrecargos.length; index < len; index++) {
				$.ajax({
					url: '/4DACTION/_V3_setSobrecargoByCotizacion',
					dataType: 'json',
					data: sobrecargos[index],
					async: false,
					cache: false,
					success: function(data) {
					},
					error: function() {
						toastr.error('No se pudo guardar el sobrecargo');
						// manejar esta situación
					}
				});
			}

		//});

		return fields;
	},
	validate: function() {
		var msgError = '';

		var isValidContent = true;

		var isValidEmpresa = true;
		$('input[name^="cotizacion[empresa]"][required]').not('[name^="cotizacion[empresa][contacto]"]').not('[name^="cotizacion[empresa][rut]"]').not('[type="checkbox"]').each(function() {
			if ($(this).val() == '') {
				isValidEmpresa = false;
				$(this).invalid();
			}
		});

		if (!isValidEmpresa) {
			msgError+= "- Falta seleccionar empresa.<br/>";
			if ($('input[name="cotizacion[empresa][id]"]').data('id'))
				$('button.unlock.empresa').click();
		}

		var isValidEjecutivo = true;
		$('input[name^="cotizacion[ejecutivo][id]"]').each(function(key) {
			if ($(this).val().trim() == '') {
				isValidEjecutivo = false;
				$(this).invalid();
			}
		});

		if (!isValidEjecutivo)
			msgError+= "- Falta seleccionar ejecutivo.<br/>";

		var isValidRut = true;
		$('input[name="cotizacion[empresa][rut]"]').each(function(key) {
			if ($(this).val() == '') {
				isValidRut = false;
				$(this).invalid();
			}
		});

		if (!isValidRut)
			msgError+= "- Falta Ingresar el Rut del Cliente.<br/>";

		var isValidAreaNegocio = true;
		$('input[name^="cotizacion[area_negocio]"]').each(function() {
			if ($(this).val() == '') {
				isValidAreaNegocio = false;
				$(this).invalid();
			}
		});

		if (!isValidAreaNegocio)
			msgError+= "- Falta seleccionar área de negocio.<br/>";

		var isValidContacto = true;
		/*$('input[name^="cotizacion[empresa][contacto]"][required]').each(function() {
			if ($(this).val() == '') {
				isValidContacto = false;
				$(this).invalid();
			}
		});
		if (!isValidContacto) {
			msgError+= "- Falta seleccionar contacto.<br/>";
			if ($('input[name="cotizacion[empresa][contacto][id]"]').data('id'))
				$('button.unlock.contacto').click();
		}*/

		var isValidTitulo = true;
		$('input[name="cotizacion[titulo][text]"]').each(function() {
			if ($(this).val() == '') {
				isValidTitulo = false;
				$(this).invalid();
			}
		});
		if (!isValidTitulo)
			msgError+= "- Falta ingresar título.<br/>";

		var isValidFormaPago = true;
		$('input[name="cotizacion[condiciones][forma_pago]"]').each(function() {
			if ($(this).val() == '') {
				isValidFormaPago = false;
				$(this).invalid();
			}
		});
		if (!isValidFormaPago)
			msgError+= "- Falta seleccionar forma de pago.<br/>";

		var isValidItems = true;
		var isMontoCero = false;
		$('table.items > tbody > tr > * > [name="item[][nombre]"]').each(function (key, item) {
			if ($(item).val() == '') {
				isValidItems = false;
				$(item).invalid();
				isValidItems = isValidItems && false;
			}

			if (!$(item).closest('tr').hasClass('title')) {
				var subtotal_precio = parseFloat($(item).closest('tr').find('[name="item[][subtotal_precio]"]').val());
				var cantidad = parseFloat($(item).closest('tr').find('[name="item[][cantidad]"]').val());
				var factor = parseFloat($(item).closest('tr').find('[name="item[][factor]"]').val());
				var precio_unitario = parseFloat($(item).closest('tr').find('[name="item[][precio_unitario]"]').val());

				if (
					(cantidad * factor * precio_unitario > 0 && subtotal_precio == 0) ||
					(Math.abs(cantidad * factor * precio_unitario - subtotal_precio) > 10)
				) {
					isMontoCero = isMontoCero || true;
					$(item).closest('tr').find('[name="item[][subtotal_precio]"]').css('background-color', 'red');
				} else {
					if (subtotal_precio > 0) {
						$(item).closest('tr').find('[name="item[][subtotal_precio]"]').css('background-color', 'yellow');
					} else {
						$(item).closest('tr').find('[name="item[][subtotal_precio]"]').css('background-color', 'white');
					}
				}
			}

		});
		if (!isValidItems)
			msgError+= "- Falta completar ítems.<br/>";

		isMontoCero = false;
		if (isMontoCero)
			msgError+= "- Existen ítems con diferencias en el cálculo.<br/>";


		var isValidFechaRealizacion = true;
		if (valida_fecha_realizacion) {
			$('input[name="cotizacion[condiciones][fecha_entrega]').each(function() {
				if ($(this).val() == '' || $(this).val() == '0000-00-00' || $(this).val() == '00-00-0000') {
					isValidFechaRealizacion = false;
					$(this).invalid();
				}
			});
		}
		if (!isValidFechaRealizacion)
			msgError+= "- Falta seleccionar fecha de realización.<br/>";

		// valida campos personalizados
		var isValidaPersonalizados = true;
		$('input[name^="dato["][required]').each(function() {
			var isOK = true;
			if ($(this).val().trim() == '') {
				isOK = false;
				$(this).invalid();
			}
			if (!isOK){
				msgError+= "- Falta completar "+ $(this).data("name") + ".<br/>";
				isValidaPersonalizados = false;
			}
		});


		// revisión final de validación
		if (msgError != '')
			toastr.error(msgError);

		return isValidContent && isValidEmpresa && isValidRut && isValidEjecutivo && isValidAreaNegocio && isValidContacto && isValidTitulo && isValidFormaPago && isValidItems && isValidFechaRealizacion && isValidaPersonalizados && !isMontoCero; // devuelve true o false dependiendo de si pasa o no la validación
	}
};


$(document).ready(function() {

	if (typeof selected_currency == 'undefined')
		$('section.sheet').find('tfoot .numeric.currency input').number(true, currency.decimals, ',', '.');
	else
		$('section.sheet').find('tfoot .numeric.currency input').number(true, 2, ',', '.');

	$('section.sheet').find('tfoot .numeric.percent input').number(true, 2, ',', '.');

	unaBase.toolbox.init();
	unaBase.toolbox.menu.init(params);

	if ($('section.sheet').data('index') == -1)
		unaBase.toolbox.menu.buttons([ 'save', 'delete', 'exit', 'preview' ]);
	else {
		if ($('section.sheet').data('index') == 0) {
			unaBase.toolbox.menu.buttons([ 'save', 'exit', 'preview' ]);
			$('#menu [data-name="preview"]').hide();
		}
		else {
			if ($('section.sheet').find('span.validation-status').text() == 'Validada')
				unaBase.toolbox.menu.buttons([ 'save', 'refresh', 'clone_current', 'convert_negocio', 'conversion_negocio_request', 'discard', 'restore', 'exit', 'share', 'preview', 'template' ]);
			else
				unaBase.toolbox.menu.buttons([ 'save', 'refresh', 'clone_current', 'discard', 'restore', 'exit', 'preview', 'template', 'validate_send' ]);

			if (!access._530)
				$('#menu [data-name="template"]').hide();

		}
	}

	$('[data-name="conversion_negocio_request"]').hide();

	if (!access._530)
		$('#menu [data-name="template"]').hide();

	if (access._584)
		$('#menu [data-name="offline_mode"]').show();

	$('nav.toolbox').find('[data-name="restore"]').hide();


	if (typeof convertir_en_negocio == 'undefined') {
		$('#menu li[data-name="convert_negocio"]').remove();
		$('[data-name="conversion_negocio_request"]').show();
	}

	if (
		$('input[name="cotizacion[empresa][id]"]').val() == '' &&
		$('input[name="cotizacion[empresa][razon_social]"]').val() == ''
	)
		$('button.empresa').hide();

	if (
		$('input[name="cotizacion[empresa][contacto][id]"]').val() == ''
	)
		$('button.contacto').hide();

	if (
		$('input[name="cotizacion[empresa2][id]"]').val() == '' &&
		$('input[name="cotizacion[empresa2][razon_social]"]').val() == ''
	)
		$('button.empresa2').hide();

	if (
		$('input[name="cotizacion[empresa2][contacto][id]"]').val() == ''
	)
		$('button.contacto2').hide();

	var maskRut = function(selector) {
		selector.on('change blur focus', function() {
			$(this).val(
				unaBase.data.rut.format(
					$(this).val()
				)
			);
		});

	};

	var unmaskRut = function(selector) {
		selector.unbind('change blur focus');
	};


	$('button.edit').hide();

	$('input[name="cotizacion[empresa][rut][validate]"]').change(function(event) {
		var checked = $(this).prop('checked');
		if (checked)
			maskRut($('input[name="cotizacion[empresa][rut]"]'));
		else
			unmaskRut($('input[name="cotizacion[empresa][rut]"]'));
		$('input[name="cotizacion[empresa][rut]"]').change();
	});

	$('input[name="cotizacion[empresa2][rut][validate]"]').change(function(event) {
		var checked = $(this).prop('checked');
		if (checked)
			maskRut($('input[name="cotizacion[empresa2][rut]"]'));
		else
			unmaskRut($('input[name="cotizacion[empresa2][rut]"]'));
		$('input[name="cotizacion[empresa2][rut]"]').change();
	});

	$('button.unlock.empresa').button({
		icon: {
			primary: 'ui-icon-unlocked'
		},
		text: false
	}).click(function() {
		var target = $(this).parentTo('ul');

		target.find('input[type="search"][name^="cotizacion[empresa]"]').each(function(key, item) {
			try {
				$(item).autocomplete('disable');
			} catch(e) { }
		});

		target.find('input').not('[type="search"][name^="cotizacion[empresa]"]').not('[type="checkbox"]').removeAttr('readonly');
		target.find('input[type="search"][name^="cotizacion[empresa]"]').removeAttr('placeholder').attr('type', 'text');

		maskRut(target.find('input[name="cotizacion[empresa][rut]"]'));

		target.find('input[name="cotizacion[empresa][rut]"]').parentTo('span').addClass('main');
		target.find('input[name="cotizacion[empresa][rut][validate]"]').parentTo('span').addClass('secondary').removeClass('hidden');

		target.find('button.empresa').hide();
		target.find('button.edit.empresa').show();
		target.find('input[name="cotizacion[empresa][id]"]').focus();
	});

	$('button.unlock.empresa2').button({
		icon: {
			primary: 'ui-icon-unlocked'
		},
		text: false
	}).click(function() {
		var target = $(this).parentTo('ul');

		target.find('input[type="search"][name^="cotizacion[empresa2]"]').each(function(key, item) {
			try {
				$(item).autocomplete('disable');
			} catch(e) { }
		});

		target.find('input').not('[type="search"][name^="cotizacion[empresa2]"]').not('[type="checkbox"]').removeAttr('readonly');
		target.find('input[type="search"][name^="cotizacion[empresa2]"]').removeAttr('placeholder').attr('type', 'text');

		maskRut(target.find('input[name="cotizacion[empresa2][rut]"]'));

		target.find('input[name="cotizacion[empresa2][rut]"]').parentTo('span').addClass('main');
		target.find('input[name="cotizacion[empresa2][rut][validate]"]').parentTo('span').addClass('secondary').removeClass('hidden');

		target.find('button.empresa2').hide();
		target.find('button.edit.empresa2').show();
		target.find('input[name="cotizacion[empresa2][id]"]').focus();
	});

	$('ul button.show').button({
		icons: {
			primary: 'ui-icon-carat-1-s'
		},
		text: false
	});

	$('ul button.profile').button({
		icons: {
			primary: 'ui-icon-gear'
		},
		text: false
	});

	$('ul button.unlock').button({
		icons: {
			primary: 'ui-icon-unlocked'
		},
		text: false
	});

	$('ul button.edit.save').button({
		icons: {
			primary: 'ui-icon-disk'
		},
		text: false
	});

	$('ul button.edit.discard').button({
		icons: {
			primary: 'ui-icon-close'
		},
		text: false
	});

	$('button.profile.empresa').click(function() {
		unaBase.loadInto.dialog('/v3/views/contactos/content.shtml?id=?id=' + $('input[name="cotizacion[empresa][id]"]').data('id'), 'Perfil de Empresa', 'large');
	});

	$('button.profile.empresa2').click(function() {
		unaBase.loadInto.dialog('/v3/views/contactos/content.shtml?id=?id=' + $('input[name="cotizacion[empresa2][id]"]').data('id'), 'Perfil de Empresa', 'large');
	});

	$('button.show.area-negocio').click(function() {
		var target = $(this).parentTo('ul');
		target.find('input[name="cotizacion[area_negocio]"][type="search"]').autocomplete('search', '@').focus();
	});

	$('button.show.proyecto').click(function() {
		var target = $(this).parentTo('ul');
		target.find('input[name="cotizacion[proyecto]"][type="search"]').autocomplete('search', '@').focus();
	});

	$('button.show.ejecutivo').click(function() {
		var target = $(this).parentTo('ul');
		target.find('input[name="cotizacion[ejecutivo][id]"][type="search"]').autocomplete('search', '@').focus();
	});

	$('button.show.contacto').click(function() {
		var target = $(this).parentTo('ul');
		target.find('input[name="cotizacion[empresa][contacto][id]"][type="search"]').autocomplete('search', '@').focus();
	});

	$('button.show.contacto2').click(function() {
		var target = $(this).parentTo('ul');
		target.find('input[name="cotizacion[empresa2][contacto][id]"][type="search"]').autocomplete('search', '@').focus();
	});

	$('button.show.forma-pago').click(function() {
		
		var target = $(this).parentTo('ul');
		target.find('input[name="cotizacion[condiciones][forma_pago]"][type="search"]').autocomplete('search', '@').focus();
	});

	$('button.show.forma-pago2').click(function() {
		
		var target = $(this).parentTo('ul');
		target.find('input[name="cotizacion[condiciones2][forma_pago]"][type="search"]').autocomplete('search', '@').focus();
	});

	$('button.show.validez').click(function() {
		var target = $(this).parentTo('ul');
		target.find('input[name="cotizacion[condiciones][validez]"][type="search"]').autocomplete('search', '@').focus();
	});

	$('button.show.moneda').click(function() {
		var target = $(this).parentTo('ul');
		target.find('input[name="cotizacion[moneda]"][type="search"]').first().autocomplete('search', '@').focus();
	});

	$('button.fetch.exchange-rate').button({
		icons: {
			primary: 'ui-icon-refresh'
		},
		text: false
	}).click(function(event) {
		var selectedCurrency;
		var target = $(this).parentTo('ul');

		if ($(event.target).parent().hasClass('working-currency'))
			selectedCurrency = $('select[name="cotizacion[currency][working]"]').val();
		else {
			switch($('input[name="cotizacion[moneda]"]').first().val()) {
				case 'UF':
					selectedCurrency = 'CLF';
					break;
				case 'DOLARES':
					selectedCurrency = 'USD';
					break;
				case currency.name:
					selectedCurrency = currency.code;
					break;
			}
		}

		// sistema nuevo
		if (target.find('input[name="cotizacion[tipo_cambio_trabajo]"]').length > 0)
			$.ajax({
				url: '/4DACTION/_V3_exchangeRate',
				data: {
					from: selectedCurrency,
					to: currency.code
				},
				dataType: 'json',
				success: function(data) {
					target.find('input[name="cotizacion[tipo_cambio_trabajo]"]').val(parseFloat(data.rate).toFixed(8).replace(/\./g, ',')).trigger('change');
				}
			});
		// sistema antiguo
		else
			$.ajax({
				url: 'https://apilayer.net/api/live',
				data: {
					source: selectedCurrency,
					currencies: currency.code,
					format: 1,
					access_key: 'c3a832a8192829837075ef403d7d00c4'
				},
				dataType: 'jsonp',
				success: function(data) {
					if (data.success) {
						var rate = data.quotes[selectedCurrency + currency.code];
						target.find('input[name="cotizacion[tipo_cambio]"]').val(parseFloat(rate).toFixed(2).replace(/\./g, ',')).trigger('change');
					} else {
						toastr.error('No se pudo obtener el valor del tipo de cambio del día ya que el servicio no está disponible. Por favor ingresar manualmente.');
						console.log(data.error);
					}
				}
			});
	});

	var update_tipo_cambio = function(event) {
		var enteredValue = $(event.target).val();
		$('input[name="cotizacion[tipo_cambio]"]').each(function() {
			$(this).val(enteredValue);
		});

		switch($('input[name="cotizacion[moneda]"]').val()) {
			case 'DOLARES':
				valor_usd_cotizacion = parseFloat(enteredValue.replace(/\./g, '').replace(/,/g, '.'));
				break;
			case 'UF':
				valor_clf_cotizacion = parseFloat(enteredValue.replace(/\./g, '').replace(/,/g, '.'));
				break;
		}

	};

	var update_tipo_cambio_trabajo = function(event) {
		// noop
	};

	$('input[name="cotizacion[tipo_cambio]"]').change(update_tipo_cambio);
	$('input[name="cotizacion[tipo_cambio_trabajo]"]').change(update_tipo_cambio_trabajo);

	$('button.unlock.contacto').click(function() {
		var target = $(this).parentTo('ul');

		target.find('input[name^="cotizacion[empresa][contacto]"][type="search"]').each(function(key, item) {
			// Intentamos deshabilitar el autocomplete, si el campo lo permite
			try {
				$(item).autocomplete('disable');
			} catch(e) {
				// Si no se puede deshabilitar, se deja pasar la excepción
			}
		});

		target.find('input[name^="cotizacion[empresa][contacto]"]').not('[type="search"]').removeAttr('readonly');
		target.find('input[name^="cotizacion[empresa][contacto]"][type="search"]').removeAttr('placeholder').attr('type', 'text');

		target.find('button.show.contacto, button.unlock.contacto, button.profile.contacto').hide();
		target.find('button.edit.contacto').show();
		target.find('input[name="cotizacion[empresa][contacto][id]"]').focus();
	});

	$('button.unlock.contacto2').click(function() {
		var target = $(this).parentTo('ul');

		target.find('input[name^="cotizacion[empresa2][contacto]"][type="search"]').each(function(key, item) {
			// Intentamos deshabilitar el autocomplete, si el campo lo permite
			try {
				$(item).autocomplete('disable');
			} catch(e) {
				// Si no se puede deshabilitar, se deja pasar la excepción
			}
		});

		target.find('input[name^="cotizacion[empresa2][contacto]"]').not('[type="search"]').removeAttr('readonly');
		target.find('input[name^="cotizacion[empresa2][contacto]"][type="search"]').removeAttr('placeholder').attr('type', 'text');

		target.find('button.show.contacto2, button.unlock.contacto2, button.profile.contacto2').hide();
		target.find('button.edit.contacto2').show();
		target.find('input[name="cotizacion[empresa2][contacto][id]"]').focus();
	});

	$('button.profile.contacto').click(function() {
		unaBase.loadInto.dialog('/v3/views/contactos/content.shtml?id=' + $('input[name="cotizacion[empresa][contacto][id]"]').data('id'), 'Perfil de Contacto', 'large');
	});

	$('button.profile.contacto2').click(function() {
		unaBase.loadInto.dialog('/v3/views/contactos/content.shtml?id=' + $('input[name="cotizacion[empresa2][contacto][id]"]').data('id'), 'Perfil de Contacto', 'large');
	});

	$('button.edit.save.empresa').click(function(event) {
		var element = this;
		var fields = {};
		var validate = true;
		$('input[name^="cotizacion[empresa]"').not('[type="checkbox"]').not('input[name^="cotizacion[empresa][contacto]"]').removeClass('invalid');
		$('input[name^="cotizacion[empresa]"').not('input[name^="cotizacion[empresa][contacto]"]').each(function() {
			var tuple = {};

			var name = $(this).attr('name');
			if (name == 'cotizacion[empresa][rut][validate]')
				var value = $(this).prop('checked');
			else
				var value = $(this).val();
			var localValidate = true;
			if (value == '' && $('[name="cotizacion[empresa][rut][validate]"]').prop('checked'))
				localValidate = false;
			if (name == 'cotizacion[empresa][rut]') {
				if ($('input[name="cotizacion[empresa][rut][validate]"]').prop('checked') && !unaBase.data.rut.validate(value))
					localValidate = false;
			}

			if (!localValidate)
				$(this).invalid();

			if ($(this).data('id')) {
				// TODO: Buscar una alternativa al eval que funcione
				eval('var tuple = { "id": "' + $(this).data('id') + '" };');
				/*tuple = {
					id: $(this).data('id')
				};*/
				$.extend(fields, fields, tuple);
			}

			// TODO: Buscar una alternativa al eval que funcione
			eval('var tuple = { "' + name + '": "' + value + '" };');
			/*tuple = {
				name: value
			};*/
			$.extend(fields, fields, tuple);

			validate = validate && localValidate;
		});


		if (validate){
			fields.nvType = unaBase.doc.type;
			fields.nvId = unaBase.doc.number;
			$.ajax({
				url: '/4DACTION/_V3_setEmpresa',
				dataType: 'json',
				data: fields,
				async: false,
				success: function(data) {
					if (data.success) {
						/*if (data.new)
							toastr.info('Empresa creada!');
						else
							toastr.info('Empresa modificada!');*/
						$('input[name="cotizacion[empresa][id]"]').data('id', data.id);

						$('h2 [name="cotizacion[empresa][id]"]').text(fields['cotizacion[empresa][id]']);
						$('h2 [name="cotizacion[empresa][razon_social]"]').text(fields['cotizacion[empresa][razon_social]']);

						afterEditEmpresa(element);
					} else {
						if (data.opened) {
							if (data.readonly)
								toastr.error('No fue posible guardar los datos de la empresa. Otro usuario está bloqueando el registro.');
						} else {
							if (!data.unique)
								toastr.error('La empresa que intenta ingresar ya se almacenó previamente en la base de datos.');
							else
								toastr.error('El id de la empresa no existe (error desconocido).');
						}
						// FIXME: colocar garbage collector (delete element) para ver si funciona
					}
				},
				error: function(xhr, text, error) {
					toastr.error('Falló conexión al servidor.');
				}
			});

		}
		else {
			toastr.error('Hay datos faltantes o incorrecto. Complete y verifique los datos faltantes e intente nuevamente.');
			event.stopImmediatePropagation();
		}
	});

	$('button.edit.save.empresa2').click(function(event) {
		var element = this;
		var fields = {};
		var validate = true;
		$('input[name^="cotizacion[empresa2]"').not('[type="checkbox"]').not('input[name^="cotizacion[empresa2][contacto]"]').removeClass('invalid');
		$('input[name^="cotizacion[empresa2]"').not('input[name^="cotizacion[empresa2][contacto]"]').each(function() {
			var tuple = {};

			var name = $(this).attr('name');
			if (name == 'cotizacion[empresa2][rut][validate]')
				var value = $(this).prop('checked');
			else
				var value = $(this).val();
			var localValidate = true;
			if (value == '' && $('[name="cotizacion[empresa2][rut][validate]"]').prop('checked'))
				localValidate = false;
			if (name == 'cotizacion[empresa2][rut]') {
				if ($('input[name="cotizacion[empresa2][rut][validate]"]').prop('checked') && !unaBase.data.rut.validate(value))
					localValidate = false;
			}

			if (!localValidate)
				$(this).invalid();

			if ($(this).data('id')) {
				// TODO: Buscar una alternativa al eval que funcione
				eval('var tuple = { "id": "' + $(this).data('id') + '" };');
				/*tuple = {
					id: $(this).data('id')
				};*/
				$.extend(fields, fields, tuple);
			}

			// TODO: Buscar una alternativa al eval que funcione
			eval('var tuple = { "' + name + '": "' + value + '" };');
			/*tuple = {
				name: value
			};*/
			$.extend(fields, fields, tuple);

			validate = validate && localValidate;
		});


		if (validate)
			$.ajax({
				url: '/4DACTION/_V3_setEmpresa_cot2',
				dataType: 'json',
				data: fields,
				async: false,
				success: function(data) {
					if (data.success) {
						/*if (data.new)
							toastr.info('Empresa creada!');
						else
							toastr.info('Empresa modificada!');*/
						$('input[name="cotizacion[empresa2][id]"]').data('id', data.id);

						$('h2 [name="cotizacion[empresa2][id]"]').text(fields['cotizacion[empresa2][id]']);
						$('h2 [name="cotizacion[empresa2][razon_social]"]').text(fields['cotizacion[empresa2][razon_social]']);

						afterEditEmpresa2(element);
					} else {
						if (data.opened) {
							if (data.readonly)
								toastr.error('No fue posible guardar los datos de la empresa. Otro usuario está bloqueando el registro.');
						} else {
							if (!data.unique)
								toastr.error('La empresa que intenta ingresar ya se almacenó previamente en la base de datos.');
							else
								toastr.error('El id de la empresa no existe (error desconocido).');
						}
						// FIXME: colocar garbage collector (delete element) para ver si funciona
					}
				},
				error: function(xhr, text, error) {
					toastr.error('Falló conexión al servidor.');
				}
			});
		else {
			toastr.error('Hay datos faltantes o incorrecto. Complete y verifique los datos faltantes e intente nuevamente.');
			event.stopImmediatePropagation();
		}
	});

	$('button.edit.discard.empresa').click(function(event) {
		var element = this;
		confirm('¿Desea descartar los cambios?').done(function(data) {
			if (data) {
				// ver si esto se saca

				$('input[name^="cotizacion[empresa]"').not('input[name^="cotizacion[empresa][contacto]"]').removeClass('invalid');
				var target = $(element).parentTo('ul');
				var id = target.find('input[name="cotizacion[empresa][id]"]').data('id');
				target.find('input[name^="cotizacion[empresa]"]').val('');
				$.ajax({
					url: '/4DACTION/_V3_' + 'get' + 'Empresa',
					dataType: 'json',
					data: {
						q: id,
						filter: 'id'
					},
					success: function(data) {
						$.map(data.rows, function(item) {
							target.find('input[name="cotizacion[empresa][id]"]').val(item.text);
							target.find('input[name="cotizacion[empresa][razon_social]"]').val(item.razon_social);
							target.find('input[name="cotizacion[empresa][rut]"]').val((item.rut_validar)? unaBase.data.rut.format(item.rut) : item.rut);
							target.find('input[name="cotizacion[empresa][giro]"]').val(item.giro);
							target.find('input[name="cotizacion[empresa][direccion]"]').val(item.direccion);
							target.find('input[name="cotizacion[empresa][telefonos]"]').val(item.telefonos);
						});
						afterEditEmpresa(element);
						// FIXME: colocar garbage collector, delete element
					}
				});
			}
		});
		event.stopImmediatePropagation();
	});

	$('button.edit.discard.empresa2').click(function(event) {
		var element = this;
		confirm('¿Desea descartar los cambios?').done(function(data) {
			if (data) {
				// ver si esto se saca

				$('input[name^="cotizacion[empresa2]"').not('input[name^="cotizacion[empresa2][contacto]"]').removeClass('invalid');
				var target = $(element).parentTo('ul');
				var id = target.find('input[name="cotizacion[empresa2][id]"]').data('id');
				target.find('input[name^="cotizacion[empresa2]"]').val('');
				$.ajax({
					url: '/4DACTION/_V3_' + 'get' + 'Empresa',
					dataType: 'json',
					data: {
						q: id,
						filter: 'id'
					},
					success: function(data) {
						$.map(data.rows, function(item) {
							target.find('input[name="cotizacion[empresa2][id]"]').val(item.text);
							target.find('input[name="cotizacion[empresa2][razon_social]"]').val(item.razon_social);
							target.find('input[name="cotizacion[empresa2][rut]"]').val((item.rut_validar)? unaBase.data.rut.format(item.rut) : item.rut);
							target.find('input[name="cotizacion[empresa2][giro]"]').val(item.giro);
							target.find('input[name="cotizacion[empresa2][direccion]"]').val(item.direccion);
							target.find('input[name="cotizacion[empresa2][telefonos]"]').val(item.telefonos);
						});
						afterEditEmpresa2(element);
						// FIXME: colocar garbage collector, delete element
					}
				});
			}
		});
		event.stopImmediatePropagation();
	});

	$('button.edit.save.contacto').click(function(event) {
		event.preventDefault();
		event.stopImmediatePropagation();

		var element = this;
		var fields = {
			fk: $('input[name="cotizacion[empresa][id]"]').data('id')
		};
		$('input[name^="cotizacion[empresa][contacto]"').each(function() {
			var tuple = {};

			var name = $(this).attr('name');
			var value = $(this).val();
			if ($(this).data('id')) {
				//eval('var tuple = { "id": "' + $(this).data('id') + '" };');
				tuple = {
					'id': $(this).data('id')
				};
				$.extend(fields, fields, tuple);
			}

			//eval('var tuple = { "' + name + '": "' + value + '" };');

			tuple[name] = value;

			$.extend(fields, fields, tuple);
		});

		$.ajax({
			url: '/4DACTION/_V3_setContactoByEmpresa',
			dataType: 'json',
			data: fields,
			async: false,
			success: function(data) {
				if (data.success) {
					/*if (data.new)
						toastr.info('Contacto creado!');
					else
						toastr.info('Contacto modificado!');*/
					$('input[name="cotizacion[empresa][contacto][id]"]').data('id', data.id);

					$('h2 [name="cotizacion[empresa][contacto][id]"]').text(fields['cotizacion[empresa][contacto][id]']);

					afterEditContacto(element);
				} else {
					if (data.opened) {
						if (data.readonly)
							toastr.error('No fue posible guardar los datos del contacto. Otro usuario está bloqueando el registro.');
					} else {
						if (!data.unique)
							toastr.error('El contacto que intenta ingresar ya se almacenó previamente en la base de datos.');
						else
							toastr.error('El id del contacto no existe (error desconocido).');
					}
					// FIXME: colocar garbage collector, delete element
				}
			},
			error: function(xhr, text, error) {
				toastr.error('Falló conexión al servidor.');
			}
		});
	});

	$('button.edit.save.contacto2').click(function() {
		var element = this;
		var fields = {
			fk: $('input[name="cotizacion[empresa2][id]"]').data('id')
		};
		$('input[name^="cotizacion[empresa2][contacto]"').each(function() {
			var tuple = {};

			var name = $(this).attr('name');
			var value = $(this).val();
			if ($(this).data('id')) {
				//eval('var tuple = { "id": "' + $(this).data('id') + '" };');
				tuple = {
					'id': $(this).data('id')
				};
				$.extend(fields, fields, tuple);
			}

			//eval('var tuple = { "' + name + '": "' + value + '" };');

			tuple[name] = value;

			$.extend(fields, fields, tuple);
		});

		$.ajax({
			url: '/4DACTION/_V3_setContactoByEmpresa_cot2',
			dataType: 'json',
			data: fields,
			async: false,
			success: function(data) {
				if (data.success) {
					/*if (data.new)
						toastr.info('Contacto creado!');
					else
						toastr.info('Contacto modificado!');*/
					$('input[name="cotizacion[empresa2][contacto][id]"]').data('id', data.id);

					$('h2 [name="cotizacion[empresa2][contacto][id]"]').text(fields['cotizacion[empresa2][contacto][id]']);

					afterEditContacto2(element);
				} else {
					if (data.opened) {
						if (data.readonly)
							toastr.error('No fue posible guardar los datos del contacto. Otro usuario está bloqueando el registro.');
					} else {
						if (!data.unique)
							toastr.error('El contacto que intenta ingresar ya se almacenó previamente en la base de datos.');
						else
							toastr.error('El id del contacto no existe (error desconocido).');
					}
					// FIXME: colocar garbage collector, delete element
				}
			},
			error: function(xhr, text, error) {
				toastr.error('Falló conexión al servidor.');
			}
		});
	});

	$('button.edit.discard.contacto').click(function(event) {
		var element = this;
		confirm('¿Desea descartar los cambios?').done(function(data) {
			if (data) {
				var target = $(element).parentTo('ul');
				var id = target.find('input[name="cotizacion[empresa][contacto][id]"]').data('id');
				target.find('input[name^="cotizacion[empresa][contacto]"]').val('');
				$.ajax({
					url: '/4DACTION/_V3_' + 'get' + 'Contacto',
					dataType: 'json',
					data: {
						q: id,
						filter: 'id'
					},
					success: function(data) {
						$.map(data.rows, function(item) {
							target.find('input[name="cotizacion[empresa][contacto][id]"]').val(item.nombre_completo);
							target.find('input[name="cotizacion[empresa][contacto][cargo]"]').val(item.cargo);
							target.find('input[name="cotizacion[empresa][contacto][email]"]').val(item.email);
						});
						afterEditContacto(element);
						// FIXME: colocar garbage collector, delete element
					}
				});
			}
		});
		event.stopImmediatePropagation();
	});

	$('button.edit.discard.contacto2').click(function(event) {
		var element = this;
		confirm('¿Desea descartar los cambios?').done(function(data) {
			if (data) {
				var target = $(element).parentTo('ul');
				var id = target.find('input[name="cotizacion[empresa2][contacto][id]"]').data('id');
				target.find('input[name^="cotizacion[empresa2][contacto]"]').val('');
				$.ajax({
					url: '/4DACTION/_V3_' + 'get' + 'Contacto',
					dataType: 'json',
					data: {
						q: id,
						filter: 'id'
					},
					success: function(data) {
						$.map(data.rows, function(item) {
							target.find('input[name="cotizacion[empresa2][contacto][id]"]').val(item.nombre_completo);
							target.find('input[name="cotizacion[empresa2][contacto][cargo]"]').val(item.cargo);
							target.find('input[name="cotizacion[empresa2][contacto][email]"]').val(item.email);
						});
						afterEditContacto2(element);
						// FIXME: colocar garbage collector, delete element
					}
				});
			}
		});
		event.stopImmediatePropagation();
	});

	unaBase.toolbox.form.autocomplete({
		fields: [
			{ local: 'cotizacion[empresa][id]', remote: 'alias', type: 'search', default: true },
			{ local: 'cotizacion[empresa][razon_social]', remote: 'razon_social', type: 'text' },
			{ local: 'cotizacion[empresa][giro]', remote: 'giro', type: 'text' },
			{ local: 'cotizacion[empresa][direccion]', remote: 'direccion', type: 'text' },
			{ local: 'cotizacion[empresa][telefonos]', remote: 'telefonos', type: 'text' }
		],
		data: {
			entity: 'Empresa'
		},
		restrict: true,
		response: function(event, ui) {
			var target = $(this).parentTo('ul');
			$(this).data('id', null);
			target.find('input[name^="cotizacion[empresa]"]').not(this).val('');

			$('h2 [name="cotizacion[empresa][id]"]').text('');
			$('h2 [name="cotizacion[empresa][razon_social]"]').text('');
		},
		change: function(event, ui) {
			var target = $(this).parentTo('ul');
			if ($(this).val() == '') {
				$('button.empresa').hide();
				target.find('input').not(this).val('');
			}

			if (!$(this).data('id') && $(this).val() != '') {
				var element = this;
				if (!access._551) {
					confirm('El cliente "' + $(this).val() + '" no está registrado.' + "\n\n" + '¿Desea crearlo?').done(function(data) {
						if (data) {
							$(element).data('id', null);

							target.parent().find('input[name^="cotizacion[empresa][contacto]"]').val('');

							$('button.unlock.empresa').click();
						} else {
							$(element).val('');
							setTimeout(
								function() { $(element).focus(); }
							, 500);
						}
					});
				} else {
					$(element).val('');
					setTimeout(
						function() { $(element).focus(); }
					, 500);
				}
			}


		},
		select: function(event, ui) {
			var target = $(this).parentTo('ul');

			target.find('button.unlock.empresa').show();
			target.find('button.profile.empresa').show();
			target.find('button.edit.empresa').hide();

			$('input[type="search"][name="cotizacion[empresa][id]"]').val((ui.item.text)? ui.item.text : 'Sin Alias');
			$('input[type="search"][name="cotizacion[empresa][id]"]').data('id', ui.item.id);

			target.find('input[name="cotizacion[empresa][razon_social]"]').val(ui.item.razon_social);
			target.find('input[name="cotizacion[empresa][rut]"]').val((ui.item.rut_validar)? unaBase.data.rut.format(ui.item.rut) : ui.item.rut);
			target.find('input[name="cotizacion[empresa][giro]"]').val(ui.item.giro);
			target.find('input[name="cotizacion[empresa][direccion]"]').val(ui.item.direccion);
			target.find('input[name="cotizacion[empresa][telefonos]"]').val(ui.item.telefonos);

			target.find('input[name="cotizacion[condiciones][forma_pago]"]').data('id', ui.item.id_forma_default);
			target.find('input[name="cotizacion[condiciones][forma_pago]"]').val(ui.item.des_forma_default);


			$('h2 [name="cotizacion[empresa][id]"]').text(ui.item.text);
			$('h2 [name="cotizacion[empresa][razon_social]"]').text(ui.item.razon_social);

			// Porcentaje comisión agencia por contacto
			target.find('input[name="cotizacion[empresa][id]"]').data('sobrecargo-ca', ui.item.porcentaje_sobrecargo_ca);
			if (v3_sobrecargos_cinemagica && ui.item.porcentaje_sobrecargo_ca > 0) {
				$('.block-cinemagica input[name="sobrecargo[6][porcentaje]"]').val(ui.item.porcentaje_sobrecargo_ca).trigger('blur');
			}

			$.ajax({
				url: '/4DACTION/_V3_' + 'getContactoByEmpresa',
				dataType: 'json',
				async: false,
				data: {
					id: ui.item.id,
					default: true,
					strict: true
				},
				success: function(data) {
					var target = $('input[type="search"][name="cotizacion[empresa][contacto][id]"]').parentTo('ul');

					target.find('input[name="cotizacion[empresa][contacto][id]"]').data('id', 0); // ID 0 desvincula
					target.find('input[name="cotizacion[empresa][contacto][id]"]').val('');
					target.find('input[name="cotizacion[empresa][contacto][cargo]"]').val('');
					target.find('input[name="cotizacion[empresa][contacto][email]"]').val('');

					$('h2 [name="cotizacion[empresa][contacto][id]"]').text('');

					$.map(data.rows, function(item) {
						target.find('input[name="cotizacion[empresa][contacto][id]"]').data('id', item.id);
						target.find('input[name="cotizacion[empresa][contacto][id]"]').val(item.nombre_completo);
						target.find('input[name="cotizacion[empresa][contacto][cargo]"]').val(item.cargo);
						target.find('input[name="cotizacion[empresa][contacto][email]"]').val(item.email);

						$('h2 [name="cotizacion[empresa][contacto][id]"]').text(item.nombre_completo);
					});

					target.find('button.unlock.contacto, button.profile.contacto, button.show.contacto').show();
					target.find('button.edit.contacto').hide();
				}
			});

			return false;
		},
		renderItem: function(ul, item) {
			return $('<li><a><strong class="highlight">' + ((item.text)? item.text : '[Sin Alias]') + '</strong><em>' + ((item.rut_validar)? unaBase.data.rut.format(item.rut) : item.rut) + '</em><span>' + item.razon_social + '</span></a></li>').appendTo(ul);
		}
	});

	unaBase.toolbox.form.autocomplete({
		fields: [
			{ local: 'cotizacion[empresa2][id]', remote: 'alias', type: 'search', default: true },
			{ local: 'cotizacion[empresa2][razon_social]', remote: 'razon_social', type: 'text' },
			{ local: 'cotizacion[empresa2][giro]', remote: 'giro', type: 'text' },
			{ local: 'cotizacion[empresa2][direccion]', remote: 'direccion', type: 'text' },
			{ local: 'cotizacion[empresa2][telefonos]', remote: 'telefonos', type: 'text' }
		],
		data: {
			entity: 'Empresa'
		},
		restrict: true,
		response: function(event, ui) {
			var target = $(this).parentTo('ul');
			$(this).data('id', null);
			target.find('input[name^="cotizacion[empresa2]"]').not(this).val('');

			$('h2 [name="cotizacion[empresa2][id]"]').text('');
			$('h2 [name="cotizacion[empresa2][razon_social]"]').text('');
		},
		change: function(event, ui) {
			var target = $(this).parentTo('ul');
			if ($(this).val() == '') {
				$('button.empresa2').hide();
				target.find('input').not(this).val('');
			}

			if (!$(this).data('id') && $(this).val() != '') {
				var element = this;
				if (!access._551) {
					confirm('El cliente "' + $(this).val() + '" no está registrado.' + "\n\n" + '¿Desea crearlo?').done(function(data) {
						if (data) {
							$(element).data('id', null);

							target.parent().find('input[name^="cotizacion[empresa2][contacto]"]').val('');

							$('button.unlock.empresa2').click();
						} else {
							$(element).val('');
							setTimeout(
								function() { $(element).focus(); }
							, 500);
						}
					});
				} else {
					$(element).val('');
					setTimeout(
						function() { $(element).focus(); }
					, 500);
				}
			}


		},
		select: function(event, ui) {
			var target = $(this).parentTo('ul');

			target.find('button.unlock.empresa2').show();
			target.find('button.profile.empresa2').show();
			target.find('button.edit.empresa2').hide();

			$('input[type="search"][name="cotizacion[empresa2][id]"]').val((ui.item.text)? ui.item.text : 'Sin Alias');
			$('input[type="search"][name="cotizacion[empresa2][id]"]').data('id', ui.item.id);

			target.find('input[name="cotizacion[empresa2][razon_social]"]').val(ui.item.razon_social);
			target.find('input[name="cotizacion[empresa2][rut]"]').val((ui.item.rut_validar)? unaBase.data.rut.format(ui.item.rut) : ui.item.rut);
			target.find('input[name="cotizacion[empresa2][giro]"]').val(ui.item.giro);
			target.find('input[name="cotizacion[empresa2][direccion]"]').val(ui.item.direccion);
			target.find('input[name="cotizacion[empresa2][telefonos]"]').val(ui.item.telefonos);

			target.find('input[name="cotizacion[condiciones2][forma_pago]"]').data('id', ui.item.id_forma_default);
			target.find('input[name="cotizacion[condiciones2][forma_pago]"]').val(ui.item.des_forma_default);


			$('h2 [name="cotizacion[empresa2][id]"]').text(ui.item.text);
			$('h2 [name="cotizacion[empresa2][razon_social]"]').text(ui.item.razon_social);

			$.ajax({
				url: '/4DACTION/_V3_' + 'getContactoByEmpresa',
				dataType: 'json',
				async: false,
				data: {
					id: ui.item.id,
					default: true,
					strict: true
				},
				success: function(data) {
					var target = $('input[type="search"][name="cotizacion[empresa2][contacto][id]"]').parentTo('ul');

					target.find('input[name="cotizacion[empresa2][contacto][id]"]').data('id', 0); // ID 0 desvincula
					target.find('input[name="cotizacion[empresa2][contacto][id]"]').val('');
					target.find('input[name="cotizacion[empresa2][contacto][cargo]"]').val('');
					target.find('input[name="cotizacion[empresa2][contacto][email]"]').val('');

					$('h2 [name="cotizacion[empresa2][contacto][id]"]').text('');

					$.map(data.rows, function(item) {
						target.find('input[name="cotizacion[empresa2][contacto][id]"]').data('id', item.id);
						target.find('input[name="cotizacion[empresa2][contacto][id]"]').val(item.nombre_completo);
						target.find('input[name="cotizacion[empresa2][contacto][cargo]"]').val(item.cargo);
						target.find('input[name="cotizacion[empresa2][contacto][email]"]').val(item.email);

						$('h2 [name="cotizacion[empresa2][contacto][id]"]').text(item.nombre_completo);
					});

					target.find('button.unlock.contacto2, button.profile.contacto2, button.show.contacto2').show();
					target.find('button.edit.contacto2').hide();
				}
			});

			return false;
		},
		renderItem: function(ul, item) {
			return $('<li><a><strong class="highlight">' + ((item.text)? item.text : '[Sin Alias]') + '</strong><em>' + ((item.rut_validar)? unaBase.data.rut.format(item.rut) : item.rut) + '</em><span>' + item.razon_social + '</span></a></li>').appendTo(ul);
		}
	});

	unaBase.toolbox.form.autocomplete({
		fields: [
			{ local: 'cotizacion[empresa][contacto][id]', remote: 'nombre_completo', type: 'search', default: true },
			{ local: 'cotizacion[empresa][contacto][cargo]', remote: 'cargo', type: 'text' },
			{ local: 'cotizacion[empresa][contacto][email]', remote: 'razon_social', type: 'email' }
		],
		data: {
			entity: 'Contacto',
			filter: 'nombre_completo',
			relationship: function() {
				return {
					key: 'Empresa',
					id: $('input[name="cotizacion[empresa][id]"]').data('id')
				}
			}
		},
		restrict: false,
		response: function(event, ui) {
			var target = $(this).parentTo('ul');
			$(this).data('id', null);
			target.find('input[name^="cotizacion[empresa][contacto]"]').not(this).val('');

			$('h2 [name="cotizacion[empresa][contacto][id]"]').text('');
		},
		change: function(event, ui) {
			var target = $(this).parentTo('ul');
			if ($(this).val() == '')
				target.find('button.contacto').hide();

			if (!$(this).data('id') && $(this).val() != '') {
				var element = this;
				if (!access._551) {
					confirm('El contacto "' + $(this).val() + '" no está registrado.' + "\n\n" + '¿Desea crearlo?').done(function(data) {
						if (data) {
							$(element).data('id', null);
							$('button.unlock.contacto').click();
						} else {
							target.find('input[type="search"][name^="cotizacion[empresa][contacto]"]').val('');
							setTimeout(
								function() { $(element).focus(); }
							, 500);
						}
					});
				} else {
					target.find('input[type="search"][name^="cotizacion[empresa][contacto]"]').val('');
					setTimeout(
						function() { $(element).focus(); }
					, 500);
				}

			}

		},
		select: function(event, ui) {
			var target = $('input[type="search"][name="cotizacion[empresa][contacto][id]"]').parentTo('ul');

			target.find('button.unlock.contacto').show();
			target.find('button.edit.contacto').hide();

			$('input[type="search"][name="cotizacion[empresa][contacto][id]"]').val(ui.item.nombre_completo);
			$('input[type="search"][name="cotizacion[empresa][contacto][id]"]').data('id', ui.item.id);

			// Definir acá cómo se crea o duplica el contacto relacionado, en caso que se seleccione un contacto externo.
			// La forma planeada es dejar vacío los campos de cargo y email, hacer trigger en el botón editar contacto
			// y dejar referenciado un atributo data para saber a qué entrada de contacto debe asociarse la nueva
			// relación a crear.

			target.find('input[name="cotizacion[empresa][contacto][id]"]').val(ui.item.nombre_completo);
			target.find('input[name="cotizacion[empresa][contacto][cargo]"]').val(ui.item.cargo);
			target.find('input[name="cotizacion[empresa][contacto][email]"]').val(ui.item.email);

			$('h2 [name="cotizacion[empresa][contacto][id]"]').text(ui.item.nombre_completo);

			var old_empresa = $('input[name="cotizacion[empresa][id]"]').data('id');
			var new_empresa = ui.item.empresa.id;

			if (!old_empresa) {

				target.find('input[name="cotizacion[empresa][id]"]').data('id', undefined);
				target.find('input[name="cotizacion[empresa][id]"]').val('');
				target.find('input[name="cotizacion[empresa][razon_social]"]').val('');
				target.find('input[name="cotizacion[empresa][rut]"]').val('');

				$('h2 [name="cotizacion[empresa][id]"]').text('');
				$('h2 [name="cotizacion[empresa][razon_social]"]').text('');

				$.ajax({
					url: '/4DACTION/_V3_' + 'getEmpresa',
					dataType: 'json',
					async: false,
					data: {
						q: new_empresa,
						filter: 'id'
					},
					success: function(data) {
						var target = $('input[type="search"][name="cotizacion[empresa][id]"]').parentTo('ul');

						$.map(data.rows, function(item) {
							target.find('input[name="cotizacion[empresa][id]"]').data('id', item.id);
							target.find('input[name="cotizacion[empresa][id]"]').val(item.text);
							target.find('input[name="cotizacion[empresa][razon_social]"]').val(item.razon_social);
							target.find('input[name="cotizacion[empresa][rut]"]').val(item.rut);

							// Porcentaje comisión agencia por contacto
							target.find('input[name="cotizacion[empresa][id]"]').data('sobrecargo-ca', item.porcentaje_sobrecargo_ca);
							if (v3_sobrecargos_cinemagica && item.porcentaje_sobrecargo_ca > 0) {
								$('.block-cinemagica input[name="sobrecargo[6][porcentaje]"]').val(item.porcentaje_sobrecargo_ca).trigger('blur');
							}

							$('h2 [name="cotizacion[empresa][id]"]').text(item.text);
							$('h2 [name="cotizacion[empresa][razon_social]"]').text(item.razon_social);
						});
						$('button.empresa').show();
						$('button.empresa.edit').hide();
					}
				});
			}

			return false;
		},
		renderItem: function(ul, item) {
			var element;
			if (item.empresa.id == $('input[name="cotizacion[empresa][id]"]').data('id'))
				element = $('<li><a><strong class="highlight">' + item.nombre_completo + '</strong><em>[' + item.empresa.text + ']</em><span>' + item.cargo + '</span><span>' + item.email + '</span></a></li>').appendTo(ul);
			else
				element = $('<li><a><strong class="highlight">' + item.nombre_completo + '</strong><em>[' + item.empresa.text + ']</em><span>' + item.cargo + '</span><span>' + item.email + '</span></a></li>').appendTo(ul);
			return element;
		}
	});

	unaBase.toolbox.form.autocomplete({
		fields: [
			{ local: 'cotizacion[empresa2][contacto][id]', remote: 'nombre_completo', type: 'search', default: true },
			{ local: 'cotizacion[empresa2][contacto][cargo]', remote: 'cargo', type: 'text' },
			{ local: 'cotizacion[empresa2][contacto][email]', remote: 'razon_social', type: 'email' }
		],
		data: {
			entity: 'Contacto',
			filter: 'nombre_completo',
			relationship: function() {
				return {
					key: 'Empresa',
					id: $('input[name="cotizacion[empresa2][id]"]').data('id')
				}
			}
		},
		restrict: false,
		response: function(event, ui) {
			var target = $(this).parentTo('ul');
			$(this).data('id', null);
			target.find('input[name^="cotizacion[empresa2][contacto]"]').not(this).val('');

			$('h2 [name="cotizacion[empresa2][contacto][id]"]').text('');
		},
		change: function(event, ui) {
			var target = $(this).parentTo('ul');
			if ($(this).val() == '')
				target.find('button.contacto2').hide();

			if (!$(this).data('id') && $(this).val() != '') {
				var element = this;
				if (!access._551) {
					confirm('El contacto "' + $(this).val() + '" no está registrado.' + "\n\n" + '¿Desea crearlo?').done(function(data) {
						if (data) {
							$(element).data('id', null);
							$('button.unlock.contacto2').click();
						} else {
							target.find('input[type="search"][name^="cotizacion[empresa2][contacto]"]').val('');
							setTimeout(
								function() { $(element).focus(); }
							, 500);
						}
					});
				} else {
					target.find('input[type="search"][name^="cotizacion[empresa2][contacto]"]').val('');
					setTimeout(
						function() { $(element).focus(); }
					, 500);
				}

			}

		},
		select: function(event, ui) {
			var target = $('input[type="search"][name="cotizacion[empresa2][contacto][id]"]').parentTo('ul');

			target.find('button.unlock.contacto2').show();
			target.find('button.edit.contacto2').hide();

			$('input[type="search"][name="cotizacion[empresa2][contacto][id]"]').val(ui.item.nombre_completo);
			$('input[type="search"][name="cotizacion[empresa2][contacto][id]"]').data('id', ui.item.id);

			// Definir acá cómo se crea o duplica el contacto relacionado, en caso que se seleccione un contacto externo.
			// La forma planeada es dejar vacío los campos de cargo y email, hacer trigger en el botón editar contacto
			// y dejar referenciado un atributo data para saber a qué entrada de contacto debe asociarse la nueva
			// relación a crear.

			target.find('input[name="cotizacion[empresa2][contacto][id]"]').val(ui.item.nombre_completo);
			target.find('input[name="cotizacion[empresa2][contacto][cargo]"]').val(ui.item.cargo);
			target.find('input[name="cotizacion[empresa2][contacto][email]"]').val(ui.item.email);

			$('h2 [name="cotizacion[empresa2][contacto][id]"]').text(ui.item.nombre_completo);

			var old_empresa = $('input[name="cotizacion[empresa2][id]"]').data('id');
			var new_empresa = ui.item.empresa.id;

			if (!old_empresa) {

				target.find('input[name="cotizacion[empresa2][id]"]').data('id', undefined);
				target.find('input[name="cotizacion[empresa2][id]"]').val('');
				target.find('input[name="cotizacion[empresa2][razon_social]"]').val('');
				target.find('input[name="cotizacion[empresa2][rut]"]').val('');

				$('h2 [name="cotizacion[empresa2][id]"]').text('');
				$('h2 [name="cotizacion[empresa2][razon_social]"]').text('');

				$.ajax({
					url: '/4DACTION/_V3_' + 'getEmpresa',
					dataType: 'json',
					async: false,
					data: {
						q: new_empresa,
						filter: 'id'
					},
					success: function(data) {
						var target = $('input[type="search"][name="cotizacion[empresa2][id]"]').parentTo('ul');

						$.map(data.rows, function(item) {
							target.find('input[name="cotizacion[empresa2][id]"]').data('id', item.id);
							target.find('input[name="cotizacion[empresa2][id]"]').val(item.text);
							target.find('input[name="cotizacion[empresa2][razon_social]"]').val(item.razon_social);
							target.find('input[name="cotizacion[empresa2][rut]"]').val(item.rut);

							$('h2 [name="cotizacion[empresa2][id]"]').text(item.text);
							$('h2 [name="cotizacion[empresa2][razon_social]"]').text(item.razon_social);
						});
						$('button.empresa2').show();
						$('button.empresa2.edit').hide();
					}
				});
			}

			return false;
		},
		renderItem: function(ul, item) {
			var element;
			if (item.empresa.id == $('input[name="cotizacion[empresa2][id]"]').data('id'))
				element = $('<li><a><strong class="highlight">' + item.nombre_completo + '</strong><em>[' + item.empresa.text + ']</em><span>' + item.cargo + '</span><span>' + item.email + '</span></a></li>').appendTo(ul);
			else
				element = $('<li><a><strong class="highlight">' + item.nombre_completo + '</strong><em>[' + item.empresa.text + ']</em><span>' + item.cargo + '</span><span>' + item.email + '</span></a></li>').appendTo(ul);
			return element;
		}
	});


	if ($('input[name="cotizacion[ejecutivo][id]"]').length > 0)
		$('input[name="cotizacion[ejecutivo][id]"]').autocomplete({
			source: function(request, response) {
				$.ajax({
					url: '/4DACTION/_V3_' + 'getUsuario',
					dataType: 'json',
					data: {
						q: request.term,
						ejecutivo: true
					},
					success: function(data) {
						response($.map(data.rows, function(item) {
							return item;
						}));
					}
				});
			},
			minLength: 0,
			autoFocus: true,
			delay: 5,
			position: { my: "left top", at: "left bottom", collision: "flip" },
			open: function() {
				$(this).removeClass('ui-corner-all').addClass('ui-corner-top');
			},
			close: function() {
				$(this).removeClass('ui-corner-top').addClass('ui-corner-all');
			},
			focus: function(event, ui) {
				//$(this).val(ui.item.text);
				return false;
			},
			response: function(event, ui) {
			},
			select: function(event, ui) {
				$('input[name="cotizacion[ejecutivo][id]"]').val(ui.item.nombres + ' ' + ui.item.ap_pat + ((ui.item.ap_mat)? ' ' + ui.item.ap_mat : ''));
				$('input[name="cotizacion[ejecutivo][id]"]').data('id', ui.item.id);
				return false;
			}

		}).data('ui-autocomplete')._renderItem = function(ul, item) {
			return $('<li><a><strong class="highlight">' +  item.ap_pat + ((item.ap_mat)? ' ' + item.ap_mat : '') + ', ' + item.nombres + '</strong><em>' + item.cargo + '</em><span>' + item.email + '</span></a></li>').appendTo(ul);
		};

	if ($('input[name="cotizacion[area_negocio]"]').length > 0)
		$('input[name="cotizacion[area_negocio]"]').autocomplete({
			source: function(request, response) {
				$.ajax({
					url: '/4DACTION/_V3_' + 'getAreaNegocio',
					dataType: 'json',
					data: {
						q: request.term
					},
					success: function(data) {
						response($.map(data.rows, function(item) {
							return item;
						}));
					}
				});
			},
			minLength: 0,
			delay: 5,
			autoFocus: true,
			position: { my: "left top", at: "left bottom", collision: "flip" },
			open: function() {
				$(this).removeClass('ui-corner-all').addClass('ui-corner-top');
			},
			close: function() {
				$(this).removeClass('ui-corner-top').addClass('ui-corner-all');
			},
			focus: function(event, ui) {
				return false;
			},
			response: function(event, ui) {
			},
			select: function(event, ui) {
				// en el caso que haya integracion
				if ($('#main-container table.items > tbody > tr').length > 0) {
					var currentArea = $('#main-container').find('input[name="cotizacion[area_negocio]"]').val();
					if (integracion && currentArea != ui.item.text) {
						confirm('Los servicios agregados pertenecientes al área de negocio <span style="font-weight:bold">'+ currentArea +'</span> serán borrados de la lista de detalle. </br></br>¿Desea realizar el cambio de todas maneras?').done(function(data) {
							if (data) {
								$('input[name="cotizacion[area_negocio]"]').val(ui.item.text);
								$('input[name="cotizacion[area_negocio]"]').data('id', ui.item.id);
								$('#main-container table.items > tbody > tr').remove();
								updateSubtotalItems();
							}
						});
					}else{
						$('input[name="cotizacion[area_negocio]"]').val(ui.item.text);
						$('input[name="cotizacion[area_negocio]"]').data('id', ui.item.id);
					}
				}else{
					$('input[name="cotizacion[area_negocio]"]').val(ui.item.text);
					$('input[name="cotizacion[area_negocio]"]').data('id', ui.item.id);
				}

				$('input[name="cotizacion[area_negocio]"]').data('codigo', ui.item.cod_contable);
				// building_codeauto();
				return false;
			}

		}).data('ui-autocomplete')._renderItem = function(ul, item) {
			return $('<li><a><span>' + item.text + '</span></a></li>').appendTo(ul);
		};

		if ($('input[name="cotizacion[proyecto]"]').length > 0)
			$('input[name="cotizacion[proyecto]"]').autocomplete({
				source: function(request, response) {
					$.ajax({
						url: '/4DACTION/_V3_' + 'getProyecto',
						dataType: 'json',
						data: {
							q: request.term
						},
						success: function(data) {
							response($.map(data.rows, function(item) {
								return item;
							}));
						}
					});
				},
				minLength: 0,
				delay: 5,
				autoFocus: true,
				position: { my: "left top", at: "left bottom", collision: "flip" },
				open: function() {
					$(this).removeClass('ui-corner-all').addClass('ui-corner-top');
				},
				close: function() {
					$(this).removeClass('ui-corner-top').addClass('ui-corner-all');
				},
				focus: function(event, ui) {
					return false;
				},
				response: function(event, ui) {
				},
				select: function(event, ui) {
					$('input[name="cotizacion[proyecto]"]').val(ui.item.text);
					$('input[name="cotizacion[proyecto]"]').data('id', ui.item.id);

					return false;
				}
			}).data('ui-autocomplete')._renderItem = function(ul, item) {
				return $('<li><a><span>' + item.text + '</span></a></li>').appendTo(ul);
			};

	if ($('input[name="cotizacion[condiciones][forma_pago]"]').length > 0)
		$('input[name="cotizacion[condiciones][forma_pago]"]').autocomplete({
			source: function(request, response) {
				$.ajax({
					url: '/4DACTION/_V3_' + 'getFormaPagos?venta=true', // FIXME: debe ir en singular
					dataType: 'json',
					data: {
						q: request.term
					},
					success: function(data) {
						response($.map(data.rows, function(item) {
							return item;
						}));
					}
				});
			},
			minLength: 0,
			autoFocus: true,
			delay: 5,
			position: { my: "left top", at: "left bottom", collision: "flip" },
			open: function() {
				$(this).removeClass('ui-corner-all').addClass('ui-corner-top');
			},
			close: function() {
				$(this).removeClass('ui-corner-top').addClass('ui-corner-all');
			},
			focus: function(event, ui) {
				return false;
			},
			response: function(event, ui) {
			},
			select: function(event, ui) {
				$('input[name="cotizacion[condiciones][forma_pago]"]').val(ui.item.text).data('id', ui.item.id);
				return false;
			}

		}).data('ui-autocomplete')._renderItem = function(ul, item) {
			return $('<li><a>' + item.text + '</a></li>').appendTo(ul);
		};

	if ($('input[name="cotizacion[condiciones2][forma_pago]"]').length > 0)
		$('input[name="cotizacion[condiciones2][forma_pago]"]').autocomplete({
			source: function(request, response) {
				$.ajax({
					url: '/4DACTION/_V3_' + 'getFormaPagos?venta=true', // FIXME: debe ir en singular
					dataType: 'json',
					data: {
						q: request.term
					},
					success: function(data) {
						response($.map(data.rows, function(item) {
							return item;
						}));
					}
				});
			},
			minLength: 0,
			autoFocus: true,
			delay: 5,
			position: { my: "left top", at: "left bottom", collision: "flip" },
			open: function() {
				$(this).removeClass('ui-corner-all').addClass('ui-corner-top');
			},
			close: function() {
				$(this).removeClass('ui-corner-top').addClass('ui-corner-all');
			},
			focus: function(event, ui) {
				return false;
			},
			response: function(event, ui) {
			},
			select: function(event, ui) {
				$('input[name="cotizacion[condiciones2][forma_pago]"]').val(ui.item.text).data('id', ui.item.id);
				return false;
			}

		}).data('ui-autocomplete')._renderItem = function(ul, item) {
			return $('<li><a>' + item.text + '</a></li>').appendTo(ul);
		};

	if ($('input[name="cotizacion[condiciones][validez]"]').length > 0)
		$('input[name="cotizacion[condiciones][validez]"]').autocomplete({
			source: function(request, response) {
				var data = {
					rows: [
						{ text: '5 días hábiles' },
						{ text: '10 días hábiles' },
						{ text: '15 días hábiles' },
						{ text: '20 días hábiles' },
						{ text: '25 días hábiles' },
						{ text: '30 días hábiles' }
					]
				};
				response($.map(data.rows, function(item) {
					return item;
				}));
			},
			minLength: 0,
			autoFocus: true,
			delay: 5,
			position: { my: "left top", at: "left bottom", collision: "flip" },
			open: function() {
				$(this).removeClass('ui-corner-all').addClass('ui-corner-top');
			},
			close: function() {
				$(this).removeClass('ui-corner-top').addClass('ui-corner-all');
			},
			focus: function(event, ui) {
				return false;
			},
			response: function(event, ui) {
			},
			select: function(event, ui) {
				$('input[name="cotizacion[condiciones][validez]"]').val(ui.item.text).data('id', ui.item.id);
				return false;
			}

		}).data('ui-autocomplete')._renderItem = function(ul, item) {
			return $('<li><a>' +  item.text + '</a></li>').appendTo(ul);
		};


	if ($('input[name="cotizacion[moneda]"]').length > 0)
		$('input[name="cotizacion[moneda]"]').first().autocomplete({
			source: function(request, response) {
				// para sistema nuevo de monedas, esta lista debe traerse desde la tabla moneda
				// if (new_currency_system) {
				if (false) {
					$.ajax({
						url: '/4DACTION/_V3_' + 'getCurrency',
						dataType: 'json',
						data: {
							q: request.term
						},
						success: function(data) {
							response($.map(data.rows, function(item) {
								return item;
							}));
						}
					});
				} else {
					var data = {
						rows: [
							{ text: currency.name },
							{ text: 'DOLARES', tipo_cambio: ((valor_usd_cotizacion > 0)? parseFloat(valor_usd_cotizacion).toFixed(2).replace(/\./g, ',') : parseFloat(valor_usd).toFixed(2).replace(/\./g, ',')) },
							{ text: 'UF', tipo_cambio: ((valor_clf_cotizacion > 0)? parseFloat(valor_clf_cotizacion).toFixed(2).replace(/\./g, ',') : parseFloat(valor_clf).toFixed(2).replace(/\./g, ',')) }
						]
					};
					response($.map(data.rows, function(item) {
						return item;
					}));
				}
			},
			minLength: 0,
			autoFocus: true,
			delay: 5,
			position: { my: "left top", at: "left bottom", collision: "flip" },
			open: function() {
				$(this).removeClass('ui-corner-all').addClass('ui-corner-top');
			},
			close: function() {
				$(this).removeClass('ui-corner-top').addClass('ui-corner-all');
			},
			focus: function(event, ui) {
				return false;
			},
			response: function(event, ui) {
			},
			select: function(event, ui) {
				$('input[name="cotizacion[moneda]"]').first().val(ui.item.text).data('id', ui.item.id);

				if (ui.item.text == currency.name) {
					$('input[name="cotizacion[tipo_cambio]"]').first().parentTo('li').hide();
					$('input[name="cotizacion[tipo_cambio]"]').first().val(1);
				} else {
					$('input[name="cotizacion[tipo_cambio]"]').first().parentTo('li').show();
					$('input[name="cotizacion[tipo_cambio]"]').first().val(ui.item.tipo_cambio);
				}

				return false;
			}

		}).data('ui-autocomplete')._renderItem = function(ul, item) {
			return $('<li><a>' +  item.text + '</a></li>').appendTo(ul);
		};

	var htmlObject;

	if ($('section.sheet').data('index') == -1)
		htmlObject = $('\
			<ul id="dropdown_menu" class="dropdown-menu" style="position: absolute; top: 49px; right: 13px; z-index: 1000;"> \
				<!--#4DIF Not(_V3_verifica_permisos_web(_V3_data_username;600))--><li><a href="/v3/views/cotizaciones/dialog/dato_adicional.shtml" data-size="medium"><span class="ui-icon ui-icon-wrench"></span>Datos adicionales</a></li> <!--#4DENDIF-->\
				<!--#4DIF Not(_V3_verifica_permisos_web(_V3_data_username;602))--><li><a href="/v3/views/cotizaciones/dialog/attachment.shtml" data-size="x-large"><span class="ui-icon ui-icon-image"></span>Imágenes adjuntas</a></li> <!--#4DENDIF-->\
				<!--#4DIF Not(_V3_verifica_permisos_web(_V3_data_username;603))--><li><a href="/v3/views/cotizaciones/dialog/links.shtml" data-size="x-large"><span class="ui-icon ui-icon-link"></span>Archivos enlazados</a></li> <!--#4DENDIF-->\
				<li><a class="load items"><span class="ui-icon ui-icon-transferthick-e-w"></span>Cargar todo el catálogo</a></li> \
			</ul> \
		');
	else
		htmlObject = $('\
			<ul id="dropdown_menu" class="dropdown-menu" style="position: absolute; top: 49px; right: 13px; z-index: 1000;"> \
				<!--#4DIF Not(_V3_verifica_permisos_web(_V3_data_username;600))--><li><a href="/v3/views/cotizaciones/dialog/dato_adicional.shtml" data-size="medium"><span class="ui-icon ui-icon-wrench"></span>Datos adicionales</a></li> <!--#4DENDIF-->\
				<!--#4DIF Not(_V3_verifica_permisos_web(_V3_data_username;601))--><li><a href="/v3/views/cotizaciones/dialog/version.shtml" data-size="x-large"><span class="ui-icon ui-icon-note"></span>Versiones</a></li> <!--#4DENDIF-->\
				<!--#4DIF Not(_V3_verifica_permisos_web(_V3_data_username;602))--><li><a href="/v3/views/cotizaciones/dialog/attachment.shtml" data-size="x-large"><span class="ui-icon ui-icon-image"></span>Imágenes adjuntas</a></li> <!--#4DENDIF-->\
				<!--#4DIF Not(_V3_verifica_permisos_web(_V3_data_username;603))--><li><a href="/v3/views/cotizaciones/dialog/links.shtml" data-size="x-large"><span class="ui-icon ui-icon-link"></span>Archivos enlazados</a></li> <!--#4DENDIF-->\
				<li><a href="#" class="load items"><span class="ui-icon ui-icon-transferthick-e-w"></span>Cargar todo el catálogo</a></li> \
				<li><a href="/v3/views/cotizaciones/dialog/excel_load.shtml" data-size="small"><span class="ui-icon ui-icon-calculator"></span>Cargar ítems desde Excel</a></li> \
				<li><a href="/v3/views/cotizaciones/dialog/excel.shtml" data-size="small"><span class="ui-icon ui-icon-calculator"></span>Modificar desde Excel</a></li> \
				<!--#4DIF _V3_verifica_permisos_web(_V3_data_username;546)--><li><a href="#" class="print-negocio"><span class="ui-icon ui-icon-print"></span>Imprimir ' + etiqueta_negocio + '</a></li> \
				<!--#4DENDIF-->\
			</ul> \
		');

	htmlObject.find('a.print-negocio').click(function(event) {
		var menu = $('#menu');
		var saved = menu.find('[data-name="save"] button').triggerHandler('click');
		if (!saved.success)
			event.stopImmediatePropagation();

		setTimeout(function(event) {
			var sid = '';
			$.each($.cookie(),function(clave,valor) { if (clave == hash && valor.match(/UNABASE/g)) sid = valor; });

			var url = nodeUrl + '/print/?entity=negocios&id=' + $('#main-container').data('id') + '&folio=' + ((typeof $('#main-container').data('index') != 'undefined')? $('#main-container').data('index') : 'S/N') + '&sid=' + encodeURIComponent(sid) + '&nullified=' + $('#main-container').data('readonly') + '&horizontal=true&hostname='+window.location.origin;
			unaBase.loadInto.dialog(url, 'Datos del negocio', 'x-large', true);
			event.preventDefault();
		}, 5000, event);
	});


	htmlObject.find('a.load.items').click(function() {
		$('#dropdown_menu').toggle();
		if ($('section.sheet > table > tbody').find('tr').length == 0) {
			var htmlObject = $('<section> \
				<span>¿Desea cargar automáticamente todo el catálogo en la cotización?</span> \
				<label><input type="checkbox" name="precios"> Incluir precios</label> \
			</section>');
			htmlObject.find('input').bind('change', function() {
				htmlObject.data('response', $('input[name="precios"]').prop('checked'));
			});
			prompt(htmlObject, 'Sí', 'No').done(function(data) {
				unaBase.ui.block();

				var include_values = (typeof data != 'undefined')? data : false;

				$('section.sheet > table > tbody').hide();

				$.ajax({
					url: '/4DACTION/_V3_cloneCatalogoToCotizacion',
					data: {
						id: $('section.sheet').data('id'),
						precios: include_values
					},
					dataType: 'json',
					cache: false
				}).success(function(data) {
					unaBase.ui.unblock();
					var callback = function() {
						$('section.sheet > table > tbody').show('fast', function() {
							if ($('section.sheet > table > thead > tr > th > button.toggle.all').hasClass('ui-icon-folder-open')) {
								$('section.sheet > table > thead > tr > th > button.toggle.all').trigger('click');
							}
						});
					}
					getDetail(callback);
				});

			});
		} else
			toastr.warning('No es posible utilizar esta opción. La cotización no debe contener ningún ítem para poder cargar el catálogo en ella.', 'Opción no disponible');
		event.preventDefault();
	});

	htmlObject.find('a[href!="#"]').each(function() {
		$(this).click(function(event) {
			unaBase.loadInto.dialog($(this).attr('href'), $(this).text(), $(this).data('size'));
			$(this).parentTo('ul').hide();
			event.preventDefault();
		});
	});

	htmlObject.menu().hide();

	$('#dropdown_launcher').parentTo('header').before(htmlObject);

	$('#dropdown_launcher').click(function() {
		var element = this;
		$('#dropdown_menu').toggle();
	});
	$('#dropdown_launcher').show();

	if ($('section.sheet').data('readonly')) {
		$('section.sheet').find('input, textarea, tr button, tr span').prop('disabled', true).attr('placeholder', '');
		$('section.sheet').find('tr button, tr span.ui-icon, ul.editable button, footer button').hide();
		$('nav.toolbox').find(' \
			[data-name="save"], \
			[data-name="convert_negocio"], \
			[data-name="discard"] \
		').hide();
		if (access._515)
			$('nav.toolbox').find('[data-name="restore"]').show();
		if ($('span#index').html().search('[Anulada]') == -1)
			$('span#index').html($('span#index').html() + ' [Anulada]');
	}

	if ($('section.sheet').data('locked')) {
		$('section.sheet').find('input, textarea, tr button, tr span').prop('disabled', true).attr('placeholder', '');
		$('section.sheet').find('tr button, tr span.ui-icon, ul.editable button, footer button').hide();
		$('nav.toolbox').find(' \
			[data-name="discard"] \
			[data-name="restore"] \
		').hide();
	}

	$('input[name="cotizacion[empresa][id]"]').blur(function(event) {
		var target = $(this).parentTo('li');
		if ($(this).val() == '') {
			target.find('span:first-of-type').text('Buscar');
			target.parentTo('ul').find('li:nth-of-type(2) input').attr('placeholder', 'No se ha seleccionado cliente...');
		} else {
			target.find('span:first-of-type').text('Cliente (Alias)');
			target.parentTo('ul').find('li:nth-of-type(2) input').removeAttr('placeholder');
		}
	});

	$('section.sheet article.general-data').on('focusout mouseleave', 'input[data-unique="true"]', function() {
		var input = $(this);
		if (input.val().length > 0) {
			// verificar si el campo es único
			var dato_id = input.prop('name').match(/dato\[([0-9]+)\]\[valor\]/)[1];

			$.ajax({
				url: '/4DACTION/_V3_verificaDatoDuplicado',
				data: {
					id: dato_id,
					idnv: $('section.sheet').data('id'),
					value: input.val()
				},
				dataType: 'json',
				success: function(data) {
					if (!data.success) {
						// toastr.warning('El dato ingresado está duplicado.');

						var registro = "";
						var link = "";
						var refMsg = "";
						if (data.estadoneg == "COTIZACION") {
							refMsg = "Ver Cotización nro. " + data.idneg;
							registro = "a la Cotización nro. " + data.idneg;
							link = '/4DACTION/wbienvenidos#cotizaciones/content.shtml?id=' + data.idnv;
						}else{
							refMsg = "Ver Negocio nro. " + data.idneg;
							registro = "al Negocio nro. " + data.idneg;
							link = '/4DACTION/wbienvenidos#negocios/content.shtml?id=' + data.idnv;
						}

						if(input.val() != ""){
							var msj = "El código ingresado ("+ input.val() +") ya se encuentra asociado "+ registro +".";
							confirm(msj, refMsg, "OK").done(function(data) {
								if (data) {
									window.open(link);
								}
							});
						}

						input.val('');

					}
				}
			});

		}
	});

	unaBase.ui.expandable.init();

	if (access._551) {
		$('button.unlock.empresa').remove();
		$('button.unlock.contacto').remove();
		$('button.profile.empresa').remove();
		$('button.profile.contacto').remove();
	}

	if (access._563) {
		$('[data-name="clone_current"]').remove();
	}


	$('[name="dato[5][valor]"]').on('blur', function(event) {
		console.log('Modificado días de filmación');
		calcValoresCinemagica();
	});

});
