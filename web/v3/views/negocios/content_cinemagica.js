var params = {
	entity: 'Negocios',
	buttons: ['exit', 'save','refresh','clone_current','convert_cotizacion','create_oc', 'close_compras_negocio', 'close_ventas_negocio', 'open_compras_negocio', 'open_ventas_negocio', 'close_negocio', 'open_negocio', 'preview', 'share', 'template', 'export', 'report', 'modification_request' /*, 'approve_modification_request' */, 'offline_mode'],
	data: function(){
		//
		//return $('#form-negocios').serializeAnything();
		var values = {
			id: $('#main-container').data('id'),
			index: $('#main-container').data('index'),
			text: $('input[name="cotizacion[titulo][text]"]').val(),
			empresa: $('input[name="cotizacion[empresa][id]"]').data('id'),
			contacto: $('input[name="cotizacion[empresa][contacto][id]"]').data('id'),
			empresa2: $('input[name="cotizacion[empresa2][id]"]').data('id'),
			contacto2: $('input[name="cotizacion[empresa2][contacto][id]"]').data('id'),
			'cotizacion[condiciones][fecha_proyecto]': $('input[name="cotizacion[condiciones][fecha_proyecto]"]').val(),
			'negocio[area_negocio]': $('input[name="cotizacion[area_negocio]"]').data('id'),
			'cotizacion[proyecto]': $('input[name="cotizacion[proyecto]"]').data('id'),
			'cotizacion[precios][subtotal]': (parseFloat($('input[name="cotizacion[precios][subtotal]"]').val()) * exchange_rate).toString().replace(/\./g, ','),
			'cotizacion[costos_previo][subtotal]': (parseFloat($('input[name="cotizacion[costos_previo][subtotal]"]').val()) * exchange_rate).toString().replace(/\./g, ','),
			'cotizacion[costos][subtotal]': (parseFloat($('input[name="cotizacion[costos][subtotal]"]').val()) * exchange_rate).toString().replace(/\./g, ','),
			'cotizacion[utilidades][subtotal]': (parseFloat($('input[name="cotizacion[utilidades][subtotal]"]').val()) * exchange_rate).toString().replace(/\./g, ','),
			'cotizacion[margenes][margen_venta]': $('input[name="cotizacion[margenes][margen_venta]"]').val(),
			'cotizacion[margenes][margen_compra]': $('input[name="cotizacion[margenes][margen_compra]"]').val(),
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
			'cotizacion[condiciones][fecha_cierre]': $('input[name="cotizacion[condiciones][fecha_cierre]"]').val(),
			'cotizacion[condiciones][notas]': $('[name="cotizacion[condiciones][notas]"]').val(),
			'cotizacion[condiciones][no_incluye]': $('[name="cotizacion[condiciones][no_incluye]"]').val(),
			'cotizacion[montos][utilidad]': (parseFloat($('input[name="cotizacion[montos][utilidad]"]').val()) * exchange_rate).toString().replace(/\./g, ','),
			'cotizacion[montos][utilidad_ratio]': $('input[name="cotizacion[montos][utilidad_ratio]"]').val(),
			'cotizacion[montos][costo]': (parseFloat($('input[name="cotizacion[montos][costo]"]').val()) * exchange_rate).toString().replace(/\./g, ','),
			'cotizacion[montos][costo_ratio]': $('input[name="cotizacion[montos][costo_ratio]"]').val(),
			'cotizacion[moneda]': $('input[name="cotizacion[moneda]"]').first().val(),
			'cotizacion[tipo_cambio]': $('input[name="cotizacion[tipo_cambio]"]').val(),
			ejecutivo: $('input[name="cotizacion[ejecutivo][id]"]').data('id'),
			'cotizacion[ver_solo_items_usados]': $('input[name="cotizacion[ver_solo_items_usados]"]').is(':checked'),

			// Sección datos cinemágica
			'cotizacion[cinemagica][director][porcentaje]': (parseFloat($('input[name="cotizacion[cinemagica][director][porcentaje]"]').val())).toString().replace(/\./g, ','),
			'cotizacion[cinemagica][director][valor]': (parseFloat($('input[name="cotizacion[cinemagica][director][valor]"]').val())).toString().replace(/\./g, ','),
			'cotizacion[cinemagica][compania][valor]': (parseFloat($('input[name="cotizacion[cinemagica][compania][valor]"]').val())).toString().replace(/\./g, ','),
			'cotizacion[cinemagica][valor_pelicula]': (parseFloat(blockCinemagica.find('[name="sobrecargo[1][subtotal]"]').val())).toString().replace(/\./g, ','),
		};

		$('section.sheet input[name^="dato["]').each(function() {
			values[$(this).prop('name')] = $(this).val();
		});

		// se guardan los sobrecargos

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

		return values;
	},
	validate:function(){

		var msgError = '';

		// valida datos personalizados 1 a 4
		var isValidacodigo = true;
		$('input[name="dato[4][valor]"][required]').each(function() {
			if ($(this).val() == '') {
				isValidacodigo = false;
				$(this).invalid();
			}
		});
		if (!isValidacodigo)
			msgError+= "- Falta ingresar código.<br/>";
		// valida datos personalizados 1 a 4

		var isMontoCero = false;
		$('table.items > tbody > tr > * > [name="item[][nombre]"]').each(function (key, item) {
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
						$(item).closest('tr').find('[name="item[][subtotal_precio]"]').css('background-color', 'transparent');
					}
				}
			}

		});

		var isMontoCero = false;
		if (isMontoCero)
			msgError+= "- Existen ítems con diferencias en el cálculo.<br/>";

		if (msgError != '')
			toastr.error(msgError);

		return isValidacodigo && !isMontoCero; // devuelve true o false dependiendo de si pasa o no la validación


	}
};

$(document).ready(function() {
	$( "#dialog-profile-negocio" ).tabs();
	$('button.show').button({icons:{primary: 'ui-icon-carat-1-s'},text: false});
	$('button.edit').button({
		icons: {
			primary: "ui-icon-pencil"
		},
		text: false
	});
	unaBase.toolbox.init();
	unaBase.toolbox.menu.init(params);

	/* Quitar botones según permiso */
	if (!access._488)
		$('#menu [data-name="close_negocio"]').remove();
	if (!access._489)
		$('#menu [data-name="open_negocio"]').remove();
	if (!access._490)
		$('#menu [data-name="close_compras_negocio"]').remove();
	if (!access._598)
		$('#menu [data-name="close_ventas_negocio"]').remove();
	if (!access._491)
		$('#menu [data-name="open_compras_negocio"]').remove();
	if (!access._599)
		$('#menu [data-name="open_ventas_negocio"]').remove();
	if (!access._485) {
		$('#menu li[data-name="convert_cotizacion"]').remove();
	} else {
		if (negocioFacturado && !access._573) {
			$('#menu li[data-name="convert_cotizacion"]').remove();
		}
		if (cerradoCompras && access._576) {
			$('#menu li[data-name="convert_cotizacion"]').remove();
		}
	}

	/* Ocultar botón para solicitar autorización de modificación si el usuario tiene permiso para modificar, o si es autorizador, o si ya está autorizado */
	if (access._528 || access._582 || autoriza_modificacion)
		$('#menu li[data-name="modification_request"]').remove();
	/* Ocultar botón para autorizar modificación si el usuario no tiene permiso para autorizar */
	/*
	if (!access._582)
		$('#menu li[data-name="approve_modification_request"]').remove();
	*/



  if (access._550) // bloquear exportar resumen
    $('#menu li[data-name="export"]').remove();

	// oculta boton de oc si esta cerrado para compras
	//if ($('#form-negocios .info-header article div.cerrado-compras span').text()=="CERRADO PARA COMPRAS") {
	if ($('#main-container').data('closed-compras')) {
		$('.toolbox ul li[data-name="create_oc"]').hide();

		$('.toolbox ul li[data-name="close_compras_negocio"]').hide();
		$('.toolbox ul li[data-name="open_compras_negocio"]').show();
	} else {
		$('.toolbox ul li[data-name="close_compras_negocio"]').show();
		$('.toolbox ul li[data-name="open_compras_negocio"]').hide();
	}

	if ($('#main-container').data('closed-ventas')) {
		$('.toolbox ul li[data-name="close_ventas_negocio"]').hide();
		$('.toolbox ul li[data-name="open_ventas_negocio"]').show();
	} else {
		$('.toolbox ul li[data-name="close_ventas_negocio"]').show();
		$('.toolbox ul li[data-name="open_ventas_negocio"]').hide();
	}


	if (access._584 && (access._528 || autoriza_modificacion))
		$('#menu [data-name="offline_mode"]').show();
	else
		$('#menu [data-name="offline_mode"]').hide();


	//Seleccionar todos los items
	$('#dialog-profile-negocio  input[name="opcion[seleccionar_todo]"]').click(function(){
		$('#dialog-profile-negocio table tbody input[type="checkbox"]').prop('checked',false);
		if ($(this).prop('checked'))
			$('#dialog-profile-negocio  input[name^="detalle[check_item]"]').prop('checked',true);
		else
			$('#dialog-profile-negocio  input[name^="detalle[check_item]"]').prop('checked',false);
	});

	//Seleccionar todos los items de un titulo
	$('#dialog-profile-negocio  input[name="detalle[check_titulo]"]').click(function(){
		var llaveTitulo = $(this).val();
		if ($(this).prop('checked'))
			$('#dialog-profile-negocio  input[name^="detalle[check_item]"][data-llavetit="'+llaveTitulo+'"]').prop('checked',true);
		else
			$('#dialog-profile-negocio  input[name^="detalle[check_item]"][data-llavetit="'+llaveTitulo+'"]').prop('checked',false);
	});



	// Cargar compras del negocio
	/*$('#dialog-profile-negocio ul li.load-compras').click(function(){
		var id = $(this).data("id");
		var loadComprasNegocio = function(data) {
			var target = $('#dialog-profile-negocio #tabs-4 .items tbody');

			// Elimina todas las oc de la tabla
			target.find("*").remove();

			var htmlObject;
			$.each(data.rows, function(key, item) {
				htmlObject = $('<tr data-id="'+item.id+'">'+
							'<td>'+item.folio+'</td>' +
							'<td>'+item.fecha+'</td>' +
							'<td>'+item.factura_tipo+'</td>' +
							'<td>'+item.proveedor+'</td>' +
							'<td>'+item.referencia+'</td>' +
							'<td class="currency">'+(item.subtotal - item.descuento)+'</td>' +
							'<td>'+item.estado+'</td>' +
							'<td><input disabled checked type="checkbox"></td>' +
							'<td>'+((item.saldo_consolidar<=0)? '<input disabled checked type="checkbox">': '<input disabled type="checkbox">')+'</td>' +
							'</tr>');
				target.append(htmlObject);
			});
		};

		$.ajax({
			url: '/4DACTION/_V3_getOrdenesByNegocio',
			dataType: 'json',
			async: false, // para que no avance hasta que la llamada se complete
			cache: false,
			data: {
				id: id
			},
			success: loadComprasNegocio
		});

		formatCurrency();

		// Ingresar a una oc, dando doble click
	    selector.find("tbody tr").unbind('dblclick').bind('dblclick', function(event) {
			unaBase.loadInto.dialog('/v3/views/compras/content.shtml?id=' + $(this).data('id'), 'Modificar orden de compra','large');
		});

	});*/


formatCurrency();

	 // Formatea los numeros - $ y %
    $('#dialog-profile-negocio .numeric.currency input').number(true, currency.decimals, ',', '.');
    $('#dialog-profile-negocio .numeric.percent input:not([name="cotizacion[descuento][porcentaje]"])').number(true, 4, ',', '.');


	$('section.sheet').find('tfoot .numeric.currency input').number(true, currency.decimals, ',', '.');
	$('section.sheet').find('tfoot .numeric.percent input').number(true, 4, ',', '.');

	$('section.sheet').find('footer .numeric.currency input').number(true, currency.decimals, ',', '.');
	$('section.sheet').find('footer .numeric.percent input:not([name="cotizacion[descuento][porcentaje]"])').number(true, 4, ',', '.');

    // Deja seleccionable las tablas
    var selector = $('#dialog-profile-negocio #tabs-4 .items');
    selectInTable(selector);


	if (access._567) {
	    $('[data-name="clone_current"]').remove();
	}

	$('[name="dato[5][valor]"]').on('blur', function(event) {
		console.log('Modificado días de filmación');
		calcValoresCinemagica();
	});

});