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
	unaBase.toolbox.menu.init({
		entity: 'Negocios',
		presupuesto: true,
		buttons: ['exit', 'save','discard','restore','clone_current','create_oc', 'close_compras_negocio', 'open_compras_negocio', /*'close_negocio', 'open_negocio', 'preview', 'share', 'template',*/ 'export'],
		data: function(){
			//
			//return $('#form-negocios').serializeAnything();
			var values = {
				id: $('#main-container').data('id'),
				text: $('input[name="cotizacion[titulo][text]"]').val(),
				'cotizacion[condiciones][fecha_proyecto]': $('input[name="cotizacion[condiciones][fecha_proyecto]"]').val(),
				'negocio[area_negocio]': $('input[name="cotizacion[area_negocio]"]').data('id'),
                'cotizacion[tipo_presupuesto]': $('input[name="cotizacion[tipo_presupuesto]"]').data('id'),
				'cotizacion[precios][subtotal]': (parseFloat($('input[name="cotizacion[precios][subtotal]"]').val()) * exchange_rate).toString().replace(/\./g, ','),
				'cotizacion[costos][subtotal]': (parseFloat($('input[name="cotizacion[costos][subtotal]"]').val()) * exchange_rate).toString().replace(/\./g, ','),
				'cotizacion[utilidades][subtotal]': (parseFloat($('input[name="cotizacion[utilidades][subtotal]"]').val()) * exchange_rate).toString().replace(/\./g, ','),
				'cotizacion[margenes][margen_venta]': $('input[name="cotizacion[margenes][margen_venta]"]').val(),
				'cotizacion[margenes][margen_compra]': $('input[name="cotizacion[margenes][margen_compra]"]').val(),
				'cotizacion[condiciones][fecha_proyecto]': $('input[name="cotizacion[condiciones][fecha_proyecto]"]').val(),
				'cotizacion[condiciones][fecha_entrega]': $('input[name="cotizacion[condiciones][fecha_entrega]"]').val(),
				'cotizacion[condiciones][notas]': $('[name="cotizacion[condiciones][notas]"]').val(),
				'cotizacion[montos][utilidad]': (parseFloat($('input[name="cotizacion[montos][utilidad]"]').val()) * exchange_rate).toString().replace(/\./g, ','),
				'cotizacion[montos][utilidad_ratio]': $('input[name="cotizacion[montos][utilidad_ratio]"]').val(),
				'cotizacion[montos][costo]': (parseFloat($('input[name="cotizacion[montos][costo]"]').val()) * exchange_rate).toString().replace(/\./g, ','),
				'cotizacion[montos][costo_ratio]': $('input[name="cotizacion[montos][costo_ratio]"]').val(),
				'cotizacion[moneda]': $('input[name="cotizacion[moneda]"]').first().val(),
				'cotizacion[tipo_cambio]': $('input[name="cotizacion[tipo_cambio]"]').val(),
				ejecutivo: $('input[name="cotizacion[ejecutivo][id]"]').data('id'),
			};

			// se guardan los sobrecargos

			$('section.sheet section.sobrecargos ul li').each(function() {
				var fields = {
					id: $(this).data('id'),
					fk: $('section.sheet').data('id'),
					porcentaje: parseFloat($(this).find('[name^="sobrecargo"][name$="[porcentaje]"]').data('value')),
					valor: (parseFloat($(this).find('[name^="sobrecargo"][name$="[valor]"]').val()) * exchange_rate).toString().replace(/\./g, ','),
					cerrado: $(this).find('[name^="sobrecargo"][name$="[cerrado]"]').prop('checked'),
					real: $(this).find('[name^="sobrecargo"][name$="[real]"]').prop('checked')
				};

				$.ajax({
					url: '/4DACTION/_V3_setSobrecargoByCotizacion',
					dataType: 'json',
					data: fields,
					async: false, // ver que pasa si se saca
					cache: false,
					success: function(data) {
					},
					error: function() {
						toastr.error('No se pudo guardar el sobrecargo');
						// manejar esta situación
					}
				});
			});

			return values;
		},
		validate:function(){

			return true;
		}
	});

	/* Quitar botones según permiso */
	if (!access._488)
		$('#menu [data-name="close_negocio"]').remove();
	if (!access._489)
		$('#menu [data-name="open_negocio"]').remove();
	if (!access._490)
		$('#menu [data-name="close_compras_negocio"]').remove();
	if (!access._491)
		$('#menu [data-name="open_compras_negocio"]').remove();
	if (!access._485)
		$('#menu li[data-name="convert_cotizacion"]').remove();
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
    $('#dialog-profile-negocio .numeric.percent input:not([name="cotizacion[descuento][porcentaje]"])').number(true, 1, ',', '.');


	$('section.sheet').find('tfoot .numeric.currency input').number(true, currency.decimals, ',', '.');
	$('section.sheet').find('tfoot .numeric.percent input').number(true, 2, ',', '.');

	$('section.sheet').find('footer .numeric.currency input').number(true, currency.decimals, ',', '.');
	$('section.sheet').find('footer .numeric.percent input:not([name="cotizacion[descuento][porcentaje]"])').number(true, 2, ',', '.');

    // Deja seleccionable las tablas
    var selector = $('#dialog-profile-negocio #tabs-4 .items');
    selectInTable(selector);

});
