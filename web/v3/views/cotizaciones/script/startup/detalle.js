
// if (typeof selected_currency == 'undefined')
// 	var localCurrency = currency.symbol;
// else {
// 	//var localCurrency = selected_currency;
// 	var localCurrency = currency.symbol;
// }

var localCurrency = ""

var arrSobregargosPreFinal = [];
let tiposDocumento = []




$(document).ready(function () {
	unaBase.ui.block();

	const setTipoDocumento = (row, tiposDocumento, path) => {
		let selectObject = row.find(`.form-select.tipo-documento${path}`);


		var defaultOption = $('<option>', {
			text: 'Tipo doc',
			value: '',
			disabled: true
		});
		selectObject.append(defaultOption);

		tiposDocumento.forEach(function (tipoDocumento) {
			var option = $('<option>', {
				text: tipoDocumento.text,
				value: tipoDocumento.id,
				"data-id": tipoDocumento.id,
				"data-abbr": tipoDocumento.abbr,
				"data-text": tipoDocumento.text
			});
			selectObject.append(option);
		});

		selectObject.on('change', function () {
			let selectedOption = $(this).find('option:selected');
			if (selectedOption.index() > 0) {
				selectedOption.text(selectedOption.data('abbr'));
			}
		});

		selectObject.on('mousedown', function () {
			$(this).find('option').each(function (i, option) {
				if (i > 0) {
					$(option).text($(option).data('text'));
				}
			});
		});

		selectObject.on('blur', function () {
			let selectedOption = $(this).find('option:selected');
			if (selectedOption.index() > 0) {
				selectedOption.text(selectedOption.data('abbr'));
			}
		});

		selectObject.val('');
	}
	//Obtener tipos de documentos
	let idnv = document.querySelector('section.sheet').dataset.id
	//Obtener tipos de documentos
	$.ajax({
		url: "/4DACTION/_V3_getTipoDocumento",
		dataType: "json",
		type: "POST",
		data: {
			sid: unaBase.sid.encoded(),
			q: '',
			valido: true,
			id_nv: idnv
		},
		async: false
	}).done(function (data) {

		tiposDocumento = data.rows

	});

	console.time("start-detalle");
	if (typeof selected_currency == 'undefined') {
		$('section.sheet').find('tfoot .numeric.currency input').number(true, currency.decimals, ',', '.');
		$('section.sheet').find('footer section:not(.sobrecargos) .numeric.currency input').number(true, currency.decimals, ',', '.');
	} else {
		$('section.sheet').find('tfoot .numeric.currency input').number(true, 2, ',', '.');
		$('section.sheet').find('footer section:not(.sobrecargos) .numeric.currency input').number(true, 2, ',', '.');
	}

	$('section.sheet').find('tfoot .numeric.percent input').number(true, 2, ',', '.');
	$('section.sheet').find('footer section:not(.sobrecargos) .numeric.percent input:not([name="cotizacion[descuento][porcentaje]"])').number(true, 2, ',', '.');

	$('section.sheet').find('input[name="cotizacion[descuento][porcentaje]"]').number(true, 6, ',', '.');

	$('section.sheet table > thead button.toggle.all').click(function () {
		if ($(this).hasClass('ui-icon-folder-open')) {
			$(this).removeClass('ui-icon-folder-open');
			$(this).addClass('ui-icon-folder-collapsed');
			$(this).attr('title', 'Contraer todo');
			$('section.sheet table > tbody > tr.title button.toggle.categoria.ui-icon-folder-open').each(function (key, element) {
				$(element).trigger('click');
			});
		} else {
			$(this).removeClass('ui-icon-folder-collapsed');
			$(this).addClass('ui-icon-folder-open');
			$(this).attr('title', 'Expandir todo');
			$('section.sheet table > tbody > tr.title button.toggle.categoria.ui-icon-folder-collapsed').each(function (key, element) {
				$(element).trigger('click');
			});
		}
	});

	$('section.sheet > div > table').on('click', 'tbody tr.title button.toggle.categoria', function () {
		var target = $(this);

		var collapsed = target.hasClass('ui-icon-folder-collapsed');

		if (collapsed)
			target.removeClass('ui-icon-folder-collapsed').addClass('ui-icon-folder-open');
		else
			target.removeClass('ui-icon-folder-open').addClass('ui-icon-folder-collapsed');

		var titles = target.parentTo('tr').nextUntil('.title');

		if (collapsed) {
			titles.removeClass('collapsed');
			target.parentTo('tr').find('.info:eq(0)').html('');
			target.parentTo('tr').find('.info:eq(1)').html('');

		} else {
			titles.addClass('collapsed');
			target.parentTo('tr').find('.info:eq(0)').html(titles.length + ' ítem' + ((titles.length > 1) ? 's' : ''));

			var total = 0;
			$('section.sheet table.items > tbody > tr.title').each(function () {
				total += parseFloat($(this).find('input[name="item[][subtotal_precio]"]').val());
			});
			var subtotal = parseFloat(target.parentTo('tr').find('input[name="item[][subtotal_precio]"]').val());
			var ratio = (total > 0) ? subtotal / total : 0;
			target.parentTo('tr').find('.info:eq(1)').html((ratio * 100).toFixed(2) + '%');

		}
		$('#tabs-2').trigger('scroll');
	});

	// htmlObject.find('button.add.all-items').click(function() {
	$('section.sheet > div > table').on('click', 'tbody tr.title button.add.all-items', function (event) {
		var htmlObject = $(event.target).closest('tr');
		if (htmlObject.data('categoria'))
			addAllItems(htmlObject);
		else
			toastr.warning('Para utilizar esta opción, debe seleccionar una categoría existente en el catálogo.');
	});


	$('section.sheet > div > table').on('focusout', 'tbody tr.title input[name="item[][nombre]"]', function () {
		var htmlObject = $(this).closest('tr');
		var inputObject = $(this);
		if (ingreso_simple_items_cot_neg && inputObject.val().trim() != '') {
			$.ajax({
				url: '/4DACTION/_V3_setCategoria',
				data: {
					text: inputObject.val(),
					replace: true
				},
				dataType: 'json',
				async: false,
				cache: false,
				success: function (data) {
					htmlObject.data('categoria', data.id);
					console.log('Categoría guardada: ' + data.id);
				}
			});
			htmlObject.trigger('change');
		}
	});

	// htmlObject.focusin(function() {
	$('section.sheet > div > table').on('focusin', 'tbody tr.title', function (event) {
		var htmlObject = $(this);
		var inputObject = $(this).find('input[name="item[][nombre]"]');
		if (!ingreso_simple_items_cot_neg) {
			inputObject.autocomplete({
				source: function (request, response) {
					inputObject.data('ajax-call', true);
					$.ajax({
						url: '/4DACTION/_V3_' + 'getCategoria',
						dataType: 'json',
						data: {
							q: request.term,
							area_negocio: $('[name="cotizacion[area_negocio]"]').data('id'),
							from: 'negocio'
						},
						success: function (data) {
							response($.map(data.rows, function (item) {
								return item;
							}));
							setTimeout(function () {
								inputObject.removeData('ajax-call');
							}, 1500);
						},
						error: function (jqXHR, exception) {
							toastr.error('No se pudo cargar el listado de categorías. Error de conexión al servidor.');
							inputObject.removeData('ajax-call');
						}
					});
				},
				minLength: 0,
				delay: 0,
				position: { my: "left top", at: "left bottom", collision: "flip" },
				open: function () {
					$(this).removeClass('ui-corner-all').addClass('ui-corner-top');
				},
				close: function () {
					$(this).removeClass('ui-corner-top').addClass('ui-corner-all');
				},
				focus: function (event, ui) {
					//$(this).val(ui.item.text);
					return false;
				},
				select: function (event, ui) {
					$(this).val(ui.item.text);
					var target = htmlObject;
					target.data('categoria', ui.item.id);
					target.find('[name="item[][ocultar_print]"]').prop('checked', ui.item.ocultar_print);
					target.find('[name="item[][mostrar_carta_cliente]"]').prop('checked', ui.item.mostrar_carta_cliente);

					$(this).trigger('change');
					return false;
				}

			}).data('ui-autocomplete')._renderItem = function (ul, item) {
				return $('<li><a><strong>' + ((item.especial) ? 'Especial' : '') + '</strong><em>' + ((item.gasto_fijo) ? 'Gasto Fijo' : '') + '</em><span class="highlight">' + item.text + '</span></a></li>').appendTo(ul);
			};
		}
	});

	// htmlObject.focusout(function() {
	$('section.sheet > div > table').on('focusout', 'tbody tr.title', function () {
		if ($(this).find('input[name="item[][nombre]"]').hasClass('ui-autocomplete-input'))
			$(this).find('input[name="item[][nombre]"]').autocomplete('destroy');
	});


	// cambio de tipo de documento
	// var changeTipoDocumento = function (target, tipo_documento_old, tipo_documento_new, valor_moneda_new) {
	// 	
	// 	// Se actualiza el valor de las horas extras simulando 'cambio' en el input
	// 	if (tipo_documento_old != tipo_documento_new)
	// 		target.find('input[name="item[][horas_extras]"]').trigger('change');

	// 	// Se extraen los datos relevantes para desglosar el precio
	// 	var tipo_documento_ratio_old = (typeof target.data('tipo-documento-ratio') != 'undefined') ? target.data('tipo-documento-ratio') : 0;
	// 	var tipo_documento_valor_usd_old = (typeof target.data('tipo-documento-valor-usd') != 'undefined') ? target.data('tipo-documento-valor-usd') : false; // Impuesto extranjero
	// 	var tipo_documento_inverse_old = (typeof target.data('tipo-documento-inverse') != 'undefined') ? target.data('tipo-documento-inverse') : false;
	// 	let tipo_documento_valor_moneda_old = target.data('tipo-documento-valor-moneda') ? target.data('tipo-documento-valor-moneda') : 1;

	// 	// Corrección cuando se ocultan decimales
	// 	//var base_imponible_old = (tipo_documento_ratio_old > 0)? target.data('base-imponible') : target.find('[name="item[][precio_unitario]"]').val();


	// 	if (target.find('[name="item[][precio_unitario]"]').data('old-value'))
	// 		var base_imponible_old = (tipo_documento_ratio_old > 0) ? target.data('base-imponible') : target.find('[name="item[][precio_unitario]"]').data('old-value');
	// 	else
	// 		var base_imponible_old = (tipo_documento_ratio_old > 0) ? target.data('base-imponible') : target.find('[name="item[][precio_unitario]"]').val();
	// 	var hora_extra_cantidad_old = target.find('[name="item[][horas_extras]"]').val();

	// 	// Se reconstruye el precio base

	// 	var precio_base = 0;

	// 	if (tipo_documento_inverse_old) {
	// 		// precio_base = Math.round(base_imponible_old * (1 - tipo_documento_ratio_old));
	// 		if (tipo_documento_valor_usd_old)
	// 			//precio_base = parseFloat((((base_imponible_old / tipo_documento_valor_moneda_old ) * valor_moneda_new) * (1 - tipo_documento_ratio_old)).toFixed(currency.decimals + 2));
	// 			precio_base = parseFloat(((base_imponible_old / tipo_documento_valor_moneda_old) * (1 - tipo_documento_ratio_old)).toFixed(currency.decimals + 2));
	// 		else
	// 			precio_base = parseFloat((base_imponible_old * (1 - tipo_documento_ratio_old)).toFixed(currency.decimals + 2));
	// 	} else
	// 		// precio_base = Math.round(base_imponible_old / (1 + tipo_documento_ratio_old));
	// 		precio_base = parseFloat((base_imponible_old / (1 + tipo_documento_ratio_old)).toFixed(currency.decimals + 2));

	// 	target.data('tipo-documento', tipo_documento_new);

	// 	// Se actualizan valores relacionados a las horas hombre de OT
	// 	// TODO: actualziar automáticamente cuando se cambian los días para el contrato por proyecto

	// 	if (target.find('input[name="item[][costo_interno]"]').prop('checked')) {

	// 		if (typeof target.data('costo-presupuestado-hh-cantidad') == 'undefined')
	// 			target.data('costo-presupuestado-hh-cantidad', 0);

	// 		if (typeof target.data('costo-presupuestado-hh-valor') == 'undefined')
	// 			target.data('costo-presupuestado-hh-valor', 0);

	// 		var old_costo_total = parseFloat((target.find('input[name="item[][costo_unitario]"]').data('old-value')) ? target.find('input[name="item[][costo_unitario]"]').data('old-value') : target.find('input[name="item[][costo_unitario]"]').val());
	// 		var old_costo_interno = target.data('costo-presupuestado-hh-cantidad') * target.data('costo-presupuestado-hh-valor');
	// 		var costo_externo = old_costo_total - old_costo_interno;

	// 		var new_costo_interno = parseFloat($('input[name="item[][cant_hh_asig]"]').val()) * parseFloat($('input[name="item[][costo_hh_unitario]"]').val());
	// 		var new_costo_total = costo_externo + new_costo_interno;
	// 		if (old_costo_total != new_costo_total) {
	// 			target.find('input[name="item[][costo_unitario]"]').val(new_costo_total.toFixed(currency.decimals));
	// 			target.find('input[name="item[][costo_unitario]"]').data('old-value', new_costo_total.toFixed(currency.decimals + 2));
	// 			updateRow({
	// 				target: target.find('input[name="item[][costo_unitario]"]')
	// 			});
	// 		}
	// 	}

	// 	if (target.data('costo-presupuestado-hh-cantidad') > 0 && target.find('input[name="item[][costo_interno]"]').prop('checked'))
	// 		target.find('button.detail.cost').visible();
	// 	else
	// 		target.find('button.detail.cost').invisible();


	// 	let id_nv = $('section.sheet').data('id')


	// 	// Se consulta el tipo de documento elegido y se cambian los parámetros de cálculo de acuerdo a él
	// 	if (tipo_documento_old != tipo_documento_new)
	// 		$.ajax({
	// 			url: '/4DACTION/_V3_getTipoDocumento',
	// 			data: {
	// 				q: target.data('tipo-documento'),
	// 				filter: 'id',
	// 				id_nv
	// 			},
	// 			dataType: 'json',
	// 			async: false,
	// 			success: function (data) {

	// 				// Se rescatan y cambian los parámetros de cálculo
	// 				if (data.rows.length) {
	// 					// próximas 2 líneas, ver si se pueden quitar
	// 					if (data.rows[0].ratio == 0)
	// 						target.find('input[name="item[][precio_unitario]"]').removeClass('edited');
	// 					target.data('tipo-documento-text', data.rows[0].text);
	// 					target.data('tipo-documento-ratio', data.rows[0].ratio);
	// 					target.data('tipo-documento-valor-usd', data.rows[0].valor_usd); // Impuesto extranjero
	// 					target.data('tipo-documento-valor-moneda', parseFloat(data.rows[0].valor_moneda_nv.replace(',','.'))); // Impuesto extranjero
	// 					target.data('tipo-documento-valor-usd-code', data.rows[0].code); // Impuesto extranjero
	// 					target.data('tipo-documento-inverse', data.rows[0].inverse);
	// 					target.find('[name="item[][tipo_documento]"]').val(data.rows[0].abbr);

	// 					if (typeof data.rows[0].hora_extra != 'undefined') {
	// 						target.data('hora-extra-enabled', true);
	// 						target.data('hora-extra-factor', data.rows[0].hora_extra.factor);
	// 						target.data('hora-extra-jornada', data.rows[0].hora_extra.jornada);
	// 						target.find('input[name="item[][horas_extras]"]').val(0).parentTo('td').visible();
	// 						target.find('input[name="item[][precio_unitario]"]').addClass('edited')
	// 						target.data('hora-extra-dias', data.rows[0].hora_extra.dias);
	// 						target.find('button.detail.price').visible();
	// 					} else {
	// 						target.data('hora-extra-enabled', false);
	// 						target.find('input[name="item[][horas_extras]"]').val(0).parentTo('td').invisible();
	// 						target.find('input[name="item[][precio_unitario]"]').removeClass('edited').removeClass('special');
	// 						// Corrección cuando se ocultan decimales
	// 						//target.data('base-imponible', parseFloat(target.find('input[name="item[][precio_unitario]"]').val()));
	// 						if (target.find('input[name="item[][precio_unitario]"]').data('old-value'))
	// 							target.data('base-imponible', parseFloat(target.find('input[name="item[][precio_unitario]"]').data('old-value')));
	// 						else
	// 							target.data('base-imponible', parseFloat(target.find('input[name="item[][precio_unitario]"]').val()));
	// 						target.find('button.detail.price').invisible();
	// 					}
	// 				} else {
	// 					target.data('hora-extra-enabled', false);
	// 					target.find('input[name="item[][horas_extras]"]').val(0).parentTo('td').invisible();
	// 					target.find('input[name="item[][precio_unitario]"]').removeClass('edited').removeClass('special');
	// 					target.find('button.detail.price').invisible();
	// 					// Corrección cuando se ocultan decimales
	// 					//target.data('base-imponible', parseFloat(target.find('input[name="item[][precio_unitario]"]').val()));
	// 					if (target.find('input[name="item[][precio_unitario]"]').data('old-value'))
	// 						target.data('base-imponible', parseFloat(target.find('input[name="item[][precio_unitario]"]').data('old-value')));
	// 					else
	// 						target.data('base-imponible', parseFloat(target.find('input[name="item[][precio_unitario]"]').val()));
	// 				}

	// 				// Corrección cuando se ocultan decimales
	// 				//var precio_unitario = target.find('input[name="item[][precio_unitario]"]').val();
	// 				if (target.find('input[name="item[][precio_unitario]"]').data('old-value'))
	// 					var precio_unitario = target.find('input[name="item[][precio_unitario]"]').data('old-value');
	// 				else
	// 					var precio_unitario = target.find('input[name="item[][precio_unitario]"]').val();

	// 				if (precio_unitario != 0) {

	// 					// Se reemplaza el precio base antiguo por el nuevo
	// 					target.find('input[name="item[][precio_unitario]"]').trigger('focus').val(0).trigger('blur').trigger('focus').val(precio_base).data('old-value', precio_base).trigger('blur');

	// 					// Se reemplaza la cantidad horas extras antigua por la nueva
	// 					if (target.data('hora-extra-enabled')) {
	// 						target.find('input[name="item[][horas_extras]"]').val(hora_extra_cantidad_old).trigger('change');
	// 					}

	// 				}

	// 			}
	// 		});
	// };

	$('section.sheet > div > table').on('focusout', 'tbody tr:not(.title) input[name="item[][nombre]"]', function () {
		var htmlObject = $(this).closest('tr');
		var inputObject = $(this);
		if (ingreso_simple_items_cot_neg && inputObject.val().trim() != '') {
			$.ajax({
				url: '/4DACTION/_V3_setProductoByCategoria',
				data: {
					id: htmlObject.prevTo('.title').data('categoria'),
					text: inputObject.val(),
					replace: true
				},
				dataType: 'json',
				async: false,
				cache: false,
				success: function (data) {
					htmlObject.data('producto', data.id);
					console.log('Ítem guardado: ' + data.id);
				}
			});
			if (!modoOffline) {
				updateSubtotalTitulos($(this));
				updateSubtotalItems();
			}
		}
	});

	// htmlObject.focusin(function() {
	$('section.sheet > div > table').on('focusin', 'tbody tr:not(.title)', function () {
		var htmlObject = $(this);
		htmlObject.addClass('focused'); // Fondo línea que se está trabajando
		var inputObject = $(this).find('input[name="item[][nombre]"]');
		if (!ingreso_simple_items_cot_neg) {
			inputObject.autocomplete({
				source: function (request, response) {
					inputObject.data('ajax-call', true);
					$.ajax({
						url: '/4DACTION/_V3_' + 'getProductoByCategoria',
						dataType: 'json',
						data: {
							q: request.term,
							id: htmlObject.prevTo('.title').data('categoria')
						},
						success: function (data) {

							response($.map(data.rows, function (item) {
								return item;
							}));
							setTimeout(function () {
								inputObject.removeData('ajax-call');
							}, 1500);
						},
						error: function (jqXHR, exception) {
							toastr.error('No se pudo cargar el listado de items. Error de conexión al servidor.');
							inputObject.removeData('ajax-call');
						}
					});
				},
				minLength: 0,
				delay: 0,
				position: { my: "left top", at: "left bottom", collision: "flip" },
				open: function () {
					$(this).removeClass('ui-corner-all').addClass('ui-corner-top');
				},
				close: function () {
					$(this).removeClass('ui-corner-top').addClass('ui-corner-all');
				},
				focus: function (event, ui) {
					//$(this).val(ui.item.text);
					return false;
				},
				select: function (event, ui) {
					

					$(this).val(ui.item.text);
					var target = htmlObject;
					$(this)[0].dataset.id = ui.item.id

					if (unaBase.parametros.btn_sica) {
						//let btn = `<button class="detail argentina" title="Configuracion"><i class="fas fa-search-dollar"></i></i></button>`
						const createButtonWithIcon = (type) => {
							let btn = document.createElement('button');
							btn.classList.add('detail', 'argentina', type);

							let i = document.createElement('i');
							i.classList.add('fas', 'fa-search-dollar');
							btn.appendChild(i);

							return btn;
						}

						let btn1 = createButtonWithIcon('presupuesto');
						let btn2 = createButtonWithIcon('previo');


						$.ajax({
							url: '/4DACTION/_light_getValoresSicaServicio',
							data: {
								id_servicio: ui.item.id
							},
							dataType: 'json',
							async: false,
							cache: false,
							success: function (data) {

								if (data.records.total > 0) {
									htmlObject[0].children[8].insertBefore(btn1, htmlObject[0].children[8].children[0]);
									htmlObject[0].children[11].insertBefore(btn2, htmlObject[0].children[11].children[0]);
								} else {
									htmlObject[0].children[8].children[0].style.marginLeft = "22px"
									htmlObject[0].children[11].children[0].style.marginLeft = "22px"
								}

							}
						});
					}


					target.data('producto', ui.item.id);
					target.find('[name="item[][codigo]"]').val(ui.item.index);
					target.find('[name="item[][unidad]"]').val(ui.item.unidad);
					target.find('[name="item[][horas_extras]"]').val(0);

					var cantidad = (typeof target.find('[name="item[][cantidad]"]').data('old-value') != 'undefined') ? parseFloat(target.find('[name="item[][cantidad]"]').data('old-value')) : parseFloat(target.find('[name="item[][cantidad]"]').val());
					var factor = (typeof target.find('[name="item[][factor]"]').data('old-value') != 'undefined') ? parseFloat(target.find('[name="item[][factor]"]').data('old-value')) : parseFloat(target.find('[name="item[][factor]"]').val());


					//detalle
					if (ui.item.porcentaje_monto_total == 0) {

						if (currency.code == "PEN") {
							// no dividir por tipo cambio, gin, 16-01-20
							var punitarioNow = ui.item.precio;
						} else {
							var punitarioNow = ui.item.precio / exchange_rate;
						}

						/*target.find('[name="item[][precio_unitario]"]').val(ui.item.precio / exchange_rate).data('old-value', ui.item.precio / exchange_rate);
						target.find('[name="item[][subtotal_precio]"]').val(cantidad * factor * (ui.item.precio / exchange_rate));*/

						target.find('[name="item[][precio_unitario]"]').val(punitarioNow).data('old-value', punitarioNow);
						target.find('[name="item[][subtotal_precio]"]').val(cantidad * factor * (punitarioNow));


						
	

						target.removeData('porcentaje-monto-total');
						target.find('[name="item[][precio_unitario]"]').removeProp('readonly');
						target.find('[name="item[][costo_unitario]"]').removeProp('readonly');
					} else {
						// var total_a_cliente = $('[name="sobrecargo[5][subtotal]"]').val();
						var total_a_cliente = parseFloat($('input[name="cotizacion[ajuste]"]').val()) - parseFloat($('input[name="cotizacion[ajuste]"]').val()) * parseFloat($('input[name="sobrecargo[6][porcentaje]"]').val() / 100.00);

						target.data('porcentaje-monto-total', ui.item.porcentaje_monto_total);
						target.find('[name="item[][precio_unitario]"]').prop('readonly', true);
						target.find('[name="item[][costo_unitario]"]').prop('readonly', true);
					}

					// Fórmula productor ejecutivo
					if (ui.item.formula_productor_ejecutivo) {
						target.find('[name="item[][precio_unitario]"]').prop('readonly', true);
						target.find('[name="item[][costo_unitario]"]').prop('readonly', true);
						target.data('formula-productor-ejecutivo', true);
						// Bloquear nombre, tipo documento y cantidades
						target.find('[name="item[][nombre]"]').prop('readonly', true);
						target.find('button.show.item').invisible();
						target.find('[name="item[][tipo_documento]"]').prop('readonly', true);
						target.find('button.show.tipo-documento').hide();
						//target.find('[name="item[][cantidad]"]').prop('readonly', true);
						target.find('[name="item[][factor]"]').prop('readonly', true);
					} else {
						target.removeData('formula-productor-ejecutivo');
					}

					// Fórmula asistente producción
					if (ui.item.formula_asistente_produccion) {
						target.find('[name="item[][precio_unitario]"]').prop('readonly', true);
						target.find('[name="item[][costo_unitario]"]').prop('readonly', true);
						target.data('formula-asistente-produccion', true);
						// Bloquear nombre, tipo documento y cantidades
						target.find('[name="item[][nombre]"]').prop('readonly', true);
						target.find('button.show.item').invisible();
						target.find('[name="item[][tipo_documento]"]').prop('readonly', true);
						target.find('button.show.tipo-documento').hide();
						//target.find('[name="item[][cantidad]"]').prop('readonly', true);
						target.find('[name="item[][factor]"]').prop('readonly', true);
					} else {
						target.removeData('formula-asistente-produccion');
					}

					// Fórmula horas extras
					if (ui.item.formula_horas_extras) {
						target.find('[name="item[][precio_unitario]"]').prop('readonly', true);
						target.find('[name="item[][costo_unitario]"]').prop('readonly', true);
						target.data('formula-horas-extras', true);
						// Bloquear nombre, tipo documento y cantidades
						target.find('[name="item[][nombre]"]').prop('readonly', true);
						target.find('button.show.item').invisible();
						target.find('[name="item[][tipo_documento]"]').prop('readonly', true);
						target.find('button.show.tipo-documento').hide();
					} else {
						target.removeData('formula-horas-extras');
					}

					if (ui.item.director_internacional) {
						target.data('director-internacional', true);
					} else {
						target.removeData('director-internacional');
					}

					if (ui.item.porcentaje_monto_total || ui.item.formula_productor_ejecutivo || ui.item.formula_asistente_produccion || ui.item.formula_horas_extras) {
						target.find('.remove.item').remove();
						target.find('.insert.item').remove();
						target.find('.clone.item').remove();
						target.find('.ui-icon-arrow-4').remove();
					}


					if(unaBase.doc.separate_sc)
						target.find('[name="item[][aplica_sobrecargo]"]').prop('checked', ui.item.aplica_sobrecargo);

					target.find('[name="item[][ocultar_print]"]').prop('checked', ui.item.ocultar_print);
					target.find('[name="item[][mostrar_carta_cliente]"]').prop('checked', ui.item.mostrar_carta_cliente);

					// Corrección para caso margen desde compra
					if (typeof copiar_precio_a_costo == 'boolean' && margen_desde_compra)
						target.find('[name="item[][costo_unitario]"]').data('auto', true);

					if (typeof copiar_precio_a_costo == 'boolean' && !margen_desde_compra) {
						target.find('[name="item[][costo_unitario]"]').data('auto', true);
						if (ui.item.costo == 0) {

							if (currency.code == "PEN") {
								// no dividir por tipo cambio, gin, 16-01-20
								var punitarioNowCosto = ui.item.precio;
							} else {
								var punitarioNowCosto = ui.item.precio / exchange_rate;
							}

							//target.find('[name="item[][costo_unitario]"]').val(ui.item.precio / exchange_rate).data('old-value', ui.item.precio / exchange_rate);
							//target.find('[name="item[][subtotal_costo]"]').val(cantidad * factor * (ui.item.precio / exchange_rate));

							target.find('[name="item[][costo_unitario]"]').val(punitarioNowCosto).data('old-value', punitarioNowCosto);

							target.find('[name="item[][subtotal_costo]"]').val(cantidad * factor * (punitarioNowCosto));

						} else {

							if (currency.code == "PEN") {
								// no dividir por tipo cambio, gin, 16-01-20
								var punitarioNowCosto = ui.item.costo;
							} else {
								var punitarioNowCosto = ui.item.costo / exchange_rate;
							}

							//target.find('[name="item[][costo_unitario]"]').val(ui.item.costo / exchange_rate).data('old-value', ui.item.costo / exchange_rate);
							//target.find('[name="item[][subtotal_costo]"]').val(cantidad * factor * (ui.item.costo / exchange_rate));

							target.find('[name="item[][costo_unitario]"]').val(punitarioNowCosto).data('old-value', punitarioNowCosto);

							target.find('[name="item[][subtotal_costo]"]').val(cantidad * factor * (punitarioNowCosto));
						}
					} else {

						if (currency.code == "PEN") {
							// no dividir por tipo cambio, gin, 16-01-20
							var punitarioNowCosto = ui.item.costo;
						} else {
							var punitarioNowCosto = ui.item.costo / exchange_rate;
						}

						htmlObject.find('[name="item[][costo_unitario]"]').val(punitarioNowCosto).data('old-value', punitarioNowCosto);

						htmlObject.find('[name="item[][subtotal_costo]"]').val(cantidad * factor * (punitarioNowCosto));
					}


					target.data('base-imponible', punitarioNow / exchange_rate);
					target.data('base-imponible-compras', punitarioNowCosto / exchange_rate);
					target.data('original-value', punitarioNow / exchange_rate);


					target.find('[name="item[][nombre]"]').data('nombre-original', ui.item.text);

					var tooltip = ' \
					<p>Nombre ítem:</p> \
					<p>' + ui.item.text + '</p> \
					<p>&nbsp;</p> \
					<p>Descripción larga:</p> \
					<p>' + ((ui.item.observacion != '') ? ui.item.observacion.replace(/\n/g, '</p><p>') : 'N/A') + '</p> \
					<p>&nbsp;</p>\
					<p>Observación interna:</p> \
					<p>N/A</p> \
				';
					target.find('button.profile.item').tooltipster('update', tooltip);
					//target.find('button.profile.item').data('tooltip', tooltip);


					var subtotal_precio = target.find('[name="item[][subtotal_precio]"]').val();
					var subtotal_costo = target.find('[name="item[][subtotal_costo]"]').val();

					var margen_compra = ((subtotal_precio - subtotal_costo) / subtotal_costo * 100).toFixed(2);
					var margen_venta = ((subtotal_precio - subtotal_costo) / subtotal_precio * 100).toFixed(2);

					target.find('[name="item[][margen_venta]"]').val(margen_venta);
					target.find('[name="item[][margen_compra]"]').val(margen_compra);

					if (!isFinite(margen_venta))
						target.find('[name="item[][margen_venta]"]').invisible();
					else
						target.find('[name="item[][margen_venta]"]').visible();

					if (!isFinite(margen_compra))
						target.find('[name="item[][margen_compra]"]').invisible();
					else
						target.find('[name="item[][margen_compra]"]').visible();

					target.find('[name="item[][utilidad]"]').val(subtotal_precio - subtotal_costo);

					// Fix: para evitar que quede en blanco el tipo de documento
					// htmlObject.data('tipo-documento', 33);
					// htmlObject.find('input[name="item[][tipo_documento]"]').val('FE');
					// if (typeof ui.item.tipo_documento != 'undefined' && ui.item.tipo_documento.id != 30 && ui.item.tipo_documento.id != 33) {
					// 	target.data('tipo-documento', ui.item.tipo_documento.id);
					// 	target.data('tipo-documento-text', ui.item.tipo_documento.text);
					// 	target.data('tipo-documento-ratio', ui.item.tipo_documento.ratio);
					// 	target.data('tipo-documento-valor-usd', ui.item.tipo_documento.valor_usd); // Impuesto extranjero
					// 	target.data('tipo-documento-valor-moneda', ui.item.tipo_documento.valor_moneda); // Impuesto extranjero
					// 	target.data('tipo-documento-inverse', ui.item.tipo_documento.inverse);
					// 	target.find('[name="item[][tipo_documento]"]').val(ui.item.tipo_documento.abbr);
					// 	if (ui.item.tipo_documento.ratio != 0) {
					// 		target.find('[name="item[][precio_unitario]"]').addClass('edited');
					// 		target.find('button.detail.price').visible();
					// 	} else {
					// 		target.find('[name="item[][precio_unitario]"]').removeClass('edited');
					// 		target.find('button.detail.price').invisible();
					// 	}
					// } else {
					// 	// target.removeData('tipo-documento');
					// 	// target.removeData('tipo-documento-text');
					// 	// target.removeData('tipo-documento-ratio');
					// 	// target.removeData('tipo-documento-valor-usd'); // Impuesto extranjero
					// 	// target.removeData('tipo-documento-valor-moneda'); // Impuesto extranjero

					// 	// target.removeData('tipo-documento-inverse');
					// 	// target.find('[name="item[][precio_unitario]"]').removeClass('edited');
					// }


					target.find('[name="item[][precio_unitario]"]').removeClass('edited');
					target.find('[name="item[][costo_unitario]"]').removeClass('edited');


					// Factor hora extra y jornada
					if (typeof ui.item.hora_extra != 'undefined') {
						target.data('hora-extra-enabled', true);
						target.data('hora-extra-factor', ui.item.hora_extra.factor);
						target.data('hora-extra-jornada', ui.item.hora_extra.jornada);
						target.data('hora-extra-dias', ui.item.hora_extra.dias);
						target.find('[name="item[][horas_extras]"]').parentTo('td').visible();
					} else {
						target.removeData('hora-extra-enabled');
						target.removeData('hora-extra-factor');
						target.removeData('hora-extra-jornada');
						target.data('hora-extra-dias', 7);
						target.find('[name="item[][horas_extras]"]').parentTo('td').invisible();
					}

					// if ((typeof ui.item.tipo_documento != 'undefined' && ui.item.tipo_documento.id != 30 && ui.item.tipo_documento.id != 33) || typeof ui.item.hora_extra != 'undefined')
					// 	target.find('button.detail.price').visible();

					var title = target.prevTo('.title');

					if (title.find('input[name="item[][nombre]"]').val() == '') {
						$.ajax({
							url: '/4DACTION/_V3_getCategoria',
							data: {
								q: ui.item.categoria.id,
								filter: 'id',
								from: 'negocio'
							},
							dataType: 'json',
							success: function (data) {
								if (data.rows.length) {
									var categoria = data.rows[0];
									title.data('categoria', categoria.id);
									title.find('input[name="item[][nombre]"]').val(categoria.text);
								}
							}
						});
					}

					target.find('span.unit').html(ui.item.unidad);

					target.data('observacion', ui.item.observacion);
					target.data('comentario', ui.item.comentario);

					if (ui.item.margen != 0) {
						target.data('preset-margen', true);
						target.data('preset-margen-value', ui.item.margen * 100.00);
						if (margen_desde_compra) {
							target.find('[name="item[][margen_compra]"]').val(ui.item.margen * 100.00);
							// target.find('[name="item[][margen_compra]"]').trigger('blur');
							// target.find('input[name="item[][costo_unitario]"]').trigger('focus').trigger('blur');
							if (!access._566)
								target.find('[name="item[][margen_compra]"]').prop('readonly', true);
							target.find('[name="item[][margen_compra]"]').visible();
						} else {
							target.find('[name="item[][margen_venta]"]').val(ui.item.margen * 100.00);
							//target.find('[name="item[][margen_venta]"]').trigger('blur');
							if (!access._566)
								target.find('[name="item[][margen_venta]"]').prop('readonly', true);
							target.find('[name="item[][margen_venta]"]').visible();
						}
					} else {
						target.data('preset-margen', false);
					}

					// Sección datos cinemágica
					target.data('costo-directo', ui.item.costo_directo);
					target.data('costo-admin', ui.item.costo_admin); // Fórmula productor ejecutivo

					//$(this).trigger('change');

					target.find('[name="item[][precio_unitario]"]').trigger('focus').trigger('blur');
					target.find('[name="item[][costo_unitario]"]').trigger('focus').trigger('blur');

					if (!modoOffline) {
						updateSubtotalTitulos($(this));
						updateSubtotalItems();
					}
					return false;
				}

			}).data('ui-autocomplete')._renderItem = function (ul, item) {
				return $('<li><a><strong>' + item.index + ' ' + ((item.gasto_fijo) ? '[Gasto Fijo]' : '') + ' ' + ((item.especial) ? '[Especial]' : '') + '</strong><em>' + item.categoria.text + '</em><span class="highlight">' + item.text + '</span>' + ((item.precio > 0) ? '<span>Precio venta: $' + item.precio.toLocaleString() + '</span>' : '') + '</a></li>').appendTo(ul);
			};
		}


		if (htmlObject.find('input[name="item[][unidad]"]').length)
			htmlObject.find('input[name="item[][unidad]"]').autocomplete({
				source: function (request, response) {
					$.ajax({
						url: '/4DACTION/_V3_' + 'getUnidad',
						dataType: 'json',
						data: {
							q: request.term
						},
						success: function (data) {
							response($.map(data.rows, function (item) {
								return item;
							}));
						},
						error: function (jqXHR, exception) {
							toastr.error('No se pudo cargar el listado de unidades. Error de conexión al servidor.');
						}
					});
				},
				minLength: 0,
				delay: 0,
				position: { my: "left top", at: "left bottom", collision: "flip" },
				open: function () {
					$(this).removeClass('ui-corner-all').addClass('ui-corner-top');
				},
				close: function () {
					$(this).removeClass('ui-corner-top').addClass('ui-corner-all');
				},
				focus: function (event, ui) {
					$(this).val(ui.item.text);
					return false;
				},
				select: function (event, ui) {
					$(this).val(ui.item.text);
					var target = htmlObject;

					// $(this).trigger('change');
					if (!modoOffline) {
						updateSubtotalTitulos($(this));
						updateSubtotalItems();
					}
					return false;
				}

			}).data('ui-autocomplete')._renderItem = function (ul, item) {
				return $('<li><a>' + item.text + '</a></li>').appendTo(ul);
			};


		// if (htmlObject.find('input[name="item[][tipo_documento]"]').length)
		// 	htmlObject.find('input[name="item[][tipo_documento]"]').autocomplete({
		// 		source: function (request, response) {
		// 			$.ajax({
		// 				url: '/4DACTION/_V3_' + 'getTipoDocumento',
		// 				dataType: 'json',
		// 				data: {
		// 					q: request.term
		// 				},
		// 				success: function (data) {
		// 					response($.map(data.rows, function (item) {
		// 						return item;
		// 					}));
		// 				},
		// 				error: function (jqXHR, exception) {
		// 					toastr.error('No se pudo cargar el listado de tipos de documento. Error de conexión al servidor.');
		// 				}
		// 			});
		// 		},
		// 		minLength: 0,
		// 		delay: 0,
		// 		position: { my: "left top", at: "left bottom", collision: "flip" },
		// 		open: function () {
		// 			$(this).removeClass('ui-corner-all').addClass('ui-corner-top');
		// 		},
		// 		close: function () {
		// 			$(this).removeClass('ui-corner-top').addClass('ui-corner-all');
		// 		},
		// 		focus: function (event, ui) {
		// 			$(this).parentTo('tr').trigger('beforeUpdate'); // Logs tiempo real
		// 			$(this).val(ui.item.abbr);
		// 			return false;
		// 		},
		// 		select: function (event, ui) {
		// 			$(this).val(ui.item.abbr);
		// 			var target = htmlObject;

		// 			target.data('no-update', true);

		// 			changeTipoDocumento(target, target.data('tipo-documento'), ui.item.id);

		// 			target.removeData('no-update');

		// 			target.trigger('afterUpdate'); // Logs tiempo real

		// 			// $(this).trigger('change');
		// 			if (!modoOffline) {
		// 				updateSubtotalTitulos($(this));
		// 				updateSubtotalItems();
		// 			}
		// 			return false;
		// 		}

		// 	}).data('ui-autocomplete')._renderItem = function (ul, item) {
		// 		return $('<li><a>' + item.text + '</a></li>').appendTo(ul);
		// 	};


		// if (htmlObject.find('input[name="item[][tipo_documento_compras]"]').length)
		// 	htmlObject.find('input[name="item[][tipo_documento_compras]"]').autocomplete({
		// 		source: function (request, response) {
		// 			$.ajax({
		// 				url: '/4DACTION/_V3_' + 'getTipoDocumento',
		// 				dataType: 'json',
		// 				data: {
		// 					q: request.term
		// 				},
		// 				success: function (data) {
		// 					response($.map(data.rows, function (item) {
		// 						return item;
		// 					}));
		// 				},
		// 				error: function (jqXHR, exception) {
		// 					toastr.error('No se pudo cargar el listado de tipos de documento. Error de conexión al servidor.');
		// 				}
		// 			});
		// 		},
		// 		minLength: 0,
		// 		delay: 0,
		// 		position: { my: "left top", at: "left bottom", collision: "flip" },
		// 		open: function () {
		// 			$(this).removeClass('ui-corner-all').addClass('ui-corner-top');
		// 		},
		// 		close: function () {
		// 			$(this).removeClass('ui-corner-top').addClass('ui-corner-all');
		// 		},
		// 		focus: function (event, ui) {
		// 			$(this).parentTo('tr').trigger('beforeUpdate'); // Logs tiempo real
		// 			$(this).val(ui.item.abbr);
		// 			return false;
		// 		},
		// 		select: function (event, ui) {

		// 			$(this).val(ui.item.abbr);
		// 			var target = htmlObject;

		// 			target.data('no-update', true);

		// 			changeTipoDocumento(target, target.data('tipo-documento-compras'), ui.item.id,'compras');

		// 			target.removeData('no-update');

		// 			//target.trigger('afterUpdate'); // Logs tiempo real

		// 			// $(this).trigger('change');
		// 			if (!modoOffline) {
		// 				updateSubtotalTitulos($(this));
		// 				updateSubtotalItems();
		// 			}
		// 			return false;
		// 		}

		// 	}).data('ui-autocomplete')._renderItem = function (ul, item) {
		// 		return $('<li><a>' + item.text + '</a></li>').appendTo(ul);
		// 	};
	});

	// htmlObject.focusout(function() {
	$('section.sheet > div > table').on('focusout', 'tbody tr:not(.title)', function () {
		$(this).removeClass('focused'); // Fondo línea que se está trabajando
		if ($(this).find('input[name="item[][nombre]"]').hasClass('ui-autocomplete-input'))
			$(this).find('input[name="item[][nombre]"]').autocomplete('destroy');
		if ($(this).find('input[name="item[][tipo_documento]"]').hasClass('ui-autocomplete-input'))
			$(this).find('input[name="item[][tipo_documento]"]').autocomplete('destroy');
		if ($(this).find('input[name="item[][tipo_documento_compras]"]').hasClass('ui-autocomplete-input'))
			$(this).find('input[name="item[][tipo_documento_compras]"]').autocomplete('destroy');
		if ($(this).find('input[name="item[][unidad]"]').hasClass('ui-autocomplete-input'))
			$(this).find('input[name="item[][unidad]"]').autocomplete('destroy');
	});


	$('section.sheet > div > table').on('click', 'tbody tr:not(.title) button.remove.item', function (event) {
		contentChanged = true;
		contentReady = false;
		var element = this;
		var title = $(element).parentTo('tr').prevTo('.title');
		$(event.target).closest('tr').trigger('beforeRemove'); // Logs tiempo real
		$(element).parentTo('tr').fadeOut(400, function () {
			$(this).remove(); // FIXME: ver si realmente quita de la memoria los nodos
			$(event.target).closest('tr').trigger('afterRemove'); // Logs tiempo real
			if (!modoOffline) {
				updateSubtotalTitulos(title);
				updateSubtotalItems();
			}
		});

		$('section.sheet table.items > tfoot > tr > th.info').trigger('refresh');

		unaBase.changeControl.hasChange = true;

	});

	$('section.sheet > div > table').on('click', 'tbody button.remove.categoria', function (event) {
		var title = $(this).parentTo('tr');
		var current = title.next();
		var hasStatus = {
			success: true,
			opened: true,
			readonly: true
		}
		var action = true;

		var countItems = 0;
		var countProtectedItems = 0;
		if (current.length > 0) {
			if (current.filter('.title').length == 0) {
				countItems = current.nextUntil('.title').andSelf().length;
				current.nextUntil('.title').andSelf().each(function () {
					if (!$(this).find('button.remove.item').isVisible())
						countProtectedItems++;
				});
			}
			else
				countItems = 0;
		}

		var removeTitle = function (title, current) {
			title.trigger('beforeRemove'); // Logs tiempo real
			if (countItems > 0) {
				unaBase.ui.block();

				current = current.prev();
				var stack = [];
				do {
					current = current.next();
					stack.push(current);
					countItems--;
				} while (countItems > 0);

				$.each(stack, function () {
					this.trigger('beforeRemove'); // Logs tiempo real
					this.remove();
					this.trigger('afterRemove'); // Logs tiempo real
				});

				unaBase.ui.unblock();
			}

			title.fadeOut(400, function () {
				$(this).remove();
				$(this).trigger('afterRemove'); // Logs tiempo real
				contentChanged = true;
				contentReady = false;
				if (!modoOffline) {
					updateSubtotalItems();
					$('section.sheet table.items > tfoot > tr > th.info').trigger('refresh');
				}
			});
		};

		if (countProtectedItems == 0) {
			if (countItems > 0)
				confirm('¿Desea quitar el título y todos los items dentro del título?').done(function (data) {
					if (data)
						removeTitle(title, current);
				});
			else
				removeTitle(title, current);
		} else
			toastr.warning('No es posible quitar el título, ya que contiene ítems que no pueden eliminarse debido a que tienen gastos asociados.');

	});

	$('section.sheet > div > table').on('click', 'thead button.add.categoria', function () {
		var current = $(this).parentTo('table').find('tbody');

		var row = getElement.titulo('prependTo', current);
		columnsPermissions(row);

		if (current.find('tr').length > 0)
			row.find('input').focus();
		else
			row.find('input').focus();
	});

	$('section.sheet > div > table').on('click', 'tbody button.add.categoria', function () {
		var current = $(this).parentTo('tr');
		while (!(current.next().html() == undefined || current.next().find('th').length > 0)) {
			current = current.next();
		}
		var row = getElement.titulo('insertAfter', current);
		columnsPermissions(row);
		row.find('input[name="item[][nombre]"]').focus();
	});

	$('section.sheet > div > table').on('click', 'tbody button.add.item', function () {
		let current = $(this).parentTo('tr');
		if (current.find('button.toggle.categoria').hasClass('ui-icon-folder-collapsed'))
			current.find('button.toggle.categoria').triggerHandler('click');
		// if (!current.hasClass('title')) {
		// 	while(!(current.next().html() == undefined || current.next().find('th').length > 0)) {
		// 		current = current.next();
		// 	}
		// }
		let row = getElement.item('insertAfter', current);
		//Marca de item nuevo
		row[0].dataset.newline = true


		setTipoDocumento(row, tiposDocumento, '-select')
		setTipoDocumento(row, tiposDocumento, '-compra-select')


		//simon itemparent start
		if (current.hasClass('itemParent')) {

			let datasetName = typeof parentKey !== 'undefined' ? 'itemparent' : 'parentid';
			row[0].dataset[datasetName] = typeof parentKey !== 'undefined' ? parentKey : current[0].id;
			// row[0].dataset.itemparent = current.data('id');
			// if(typeof row[0].dataset.itemparent !== 'undefined'){
			row.addClass('childItem');
			row.removeClass('item');
			// }
		} else {
			row.addClass('item');
		}

		//simon itemparent end
		columnsPermissions(row);
		row.find('input[name="item[][nombre]"]').focus().parentTo('tr').find('input[name="item[][costo_interno]"]').prop('checked', $('section.sheet table.items > thead > tr > th > input[name="item[][costo_interno]"]').prop('checked'));
		$('section.sheet table.items > tfoot > tr > th.info').trigger('refresh');
	});
	$('section.sheet table').on('click', 'tbody button.add.parent', function () {
		var current = $(this).parentTo('tr');
		if (current.find('button.toggle.categoria').hasClass('ui-icon-folder-collapsed'))
			current.find('button.toggle.categoria').triggerHandler('click');



		var row = getElement.itemParent('insertAfter', current);



		columnsPermissions(row);
	});

	$('section.sheet > div > table').on('click', 'tbody button.insert.item', function () {

		var current = $(this).parentTo('tr');
		if (current.find('button.toggle.categoria').hasClass('ui-icon-folder-collapsed'))
			current.find('button.toggle.categoria').triggerHandler('click');
		var row = getElement.item('insertAfter', current);

		setTipoDocumento(row, tiposDocumento, '-select')
		setTipoDocumento(row, tiposDocumento, '-compra-select')

		//simon itemparent start

		if (current.hasClass('itemParent')) {
			row[0].dataset.itemparent = current.data('id');
			if (typeof row[0].dataset.itemparent !== 'undefined') {
				row.addClass('childItem');
			}
		} else if (current.hasClass('childItem')) {
			let parentKey = current[0].dataset.itemparent;
			row[0].dataset.itemparent = parentKey
			if (typeof row[0].dataset.itemparent !== 'undefined') {
				row.addClass('childItem');
			}
		} else {
			row.addClass('item');
		}

		//simon itemparent end
		columnsPermissions(row);
		row.find('input[name="item[][nombre]"]').focus().parentTo('tr').find('input[name="item[][costo_interno]"]').prop('checked', $('section.sheet table.items > thead > tr > th > input[name="item[][costo_interno]"]').prop('checked'));
		$('section.sheet table.items > tfoot > tr > th.info').trigger('refresh');
	});

	$('section.sheet > div > table').on('click', 'tbody button.clone.categoria', function () {
		var element = $(this);
		var cloneCategoria = function () {

			unaBase.ui.block();
			var current = element.parentTo('tr').nextUntil('tr.title').andSelf();
			current.each(function (key, item) {
				//if (!$(item).hasClass('title'))
				$(item).find('.profile.item').tooltipster('destroy');
			});

			var cloned = current.clone(true);

			const setEventos = (selectClone) => {
				selectClone.on('change', function () {
					let selectedOption = $(this).find('option:selected');
					if (selectedOption.index() > 0) {
						selectedOption.text(selectedOption.data('abbr'));
					}
				});

				selectClone.on('mousedown', function () {
					$(this).find('option').each(function (i, option) {
						if (i > 0) {
							$(option).text($(option).data('text'));
						}
					});
				});

				selectClone.on('blur', function () {
					let selectedOption = $(this).find('option:selected');
					if (selectedOption.index() > 0) {
						selectedOption.text(selectedOption.data('abbr'));
					}
				});
			}

			// Guarda los valores de los select antes de clonar
			var selectValues = current.find('.tipo-documento-select').map(function () {
				return $(this).val();
			}).get();

			var selectValuesCompras = current.find('.tipo-documento-compra-select').map(function () {
				return $(this).val();
			}).get();
			// Asigna los valores originales a los select en los elementos clonados
			cloned.find('.tipo-documento-select').each(function (index) {
				//$(this).val(selectValues[index]);
				var selectClone = $(this);
				selectClone.val(selectValues[index]);
				setEventos(selectClone)

			});

			cloned.find('.tipo-documento-compra-select').each(function (index) {
				//$(this).val(selectValues[index]);
				var selectClone = $(this);
				selectClone.val(selectValuesCompras[index]);
				setEventos(selectClone)

			});

			cloned.removeUniqueId().uniqueId();

			cloned.each(function (key, item) {
				$(item).removeData('id');
				item.dataset.id = '';
			}).insertAfter(current.nextUntil('tr.title').last());

			current.each(function (key, item) {
				//if (!$(item).hasClass('title'))
				$(item).find('button.profile.item').tooltipster({
					delay: 0,
					interactiveAutoClose: false,
					contentAsHTML: true
				});
			});
			cloned.each(function (key, item) {
				//if (!$(item).hasClass('title'))
				$(item).find('button.profile.item').tooltipster({
					delay: 0,
					interactiveAutoClose: false,
					contentAsHTML: true
				});
				$(item).removeUniqueId().uniqueId(); // Logs tiempo real
				item.dataset.id = '';
				$(item).removeData('id');
			});

			cloned.trigger('beforeClone'); // Logs tiempo real
			cloned.trigger('afterClone'); // Logs tiempo real

			$('section.sheet table.items > tfoot > tr > th.info').trigger('refresh');

			if (!modoOffline) {
				updateSubtotalTitulos(element);
				updateSubtotalItems();
			}

			unaBase.ui.unblock();
		};
		if ($('#main-container').data('clone-categoria-no-ask')) {
			cloneCategoria();
		} else {
			var htmlObject = $('<div>¿Confirmas que deseas duplicar la categoría?<br><br><label><input type="checkbox"> No volver a preguntar para esta cotización.</label></div>');
			htmlObject.find('input[type="checkbox"]').change(function (event) {
				if ($(event.target).is(':checked')) {
					$('#main-container').data('clone-categoria-no-ask', true);
				}
			});
			confirm(htmlObject).done(function (data) {
				if (data) {
					cloneCategoria();
				}
			});
		}
	});

	$('section.sheet > div > table').on('click', 'tbody button.clone.item', function () {

		business.item.duplicate(this);
		// var element = $(this);
		// var cloneItem = function() {
		// 	var current = element.parentTo('tr');
		// 	current.find('.profile.item').tooltipster('destroy');
		// 	var cloned = current.removeClass('focused').clone(true);
		// 	cloned.removeUniqueId().uniqueId(); // Logs tiempo real
		// 	cloned.insertAfter(current).removeData('id');
		// 	cloned[0].dataset.id = '';
		// 	current.find('button.profile.item').tooltipster({
		// 		delay: 0,
		// 		interactiveAutoClose: false,
		// 		contentAsHTML: true
		// 	});
		// 	cloned.find('button.profile.item').tooltipster({
		// 		delay: 0,
		// 		interactiveAutoClose: false,
		// 		contentAsHTML: true
		// 	});

		// 	cloned.trigger('afterClone'); // Logs tiempo real
		// 	cloned.trigger('afterClone'); // Logs tiempo real

		// 	if (!modoOffline) {
		// 		updateSubtotalTitulos(element);
		// 		updateSubtotalItems();
		// 		$('section.sheet table.items > tfoot > tr > th.info').trigger('refresh');
		// 	}
		// };
		// if ($('#main-container').data('clone-item-no-ask')) {
		// 	cloneItem();
		// } else {
		// 	var htmlObject = $('<div>¿Confirmas que deseas duplicar el ítem?<br><br><label><input type="checkbox"> No volver a preguntar para esta cotización.</label></div>');
		// 	htmlObject.find('input[type="checkbox"]').change(function(event) {
		// 		if ($(event.target).is(':checked')) {
		// 			$('#main-container').data('clone-item-no-ask', true);
		// 		}
		// 	});
		// 	confirm(htmlObject).done(function(data) {
		// 		if (data) {
		// 			cloneItem();
		// 		}
		// 	});
		// }
	});

	// simon itemparent
	$('section.sheet table').on('click', 'tbody button.parent.item', function (event) {
		setParent(event, this, 'cot');

	});

	$('section.sheet > div > table').on('click', 'tbody button.profile.categoria', function () {
		$('#dialog-profile').dialog('open');
	});


	$('section.sheet > div > table').on('click', 'tbody button.detail.categoria', function (event) {
		saveRow(event, function (id) {
			unaBase.loadInto.dialog('/v3/views/cotizaciones/pop_detalle_items.shtml?id=' + id, 'Detalle de Categoría', 'x-large');
		});
	});

	$('section.sheet > div > table').on('click', 'tbody button.detail.item', function (event) {
		//NO ELIMINAR
		unaBase.doc.lineTrSup = $(event.target).closest('tr.item')[0]
		saveRow(event, function (id) {
			unaBase.loadInto.dialog('/v3/views/cotizaciones/pop_detalle_items.shtml?id=' + id, 'Detalle de Ítem', 'x-large');
		});
	});


	$('section.sheet > div > table').on('click', 'tbody button.profile.item', function (event) {
		saveRow(event, function (id) {
			var id_item = $(event.target).closest('tr').data('producto');
			unaBase.loadInto.dialog('/v3/views/catalogo/content.shtml?id=' + id_item, 'Perfil de Ítem', 'large');
		});
	});

	$('section.sheet > div > table').on('click', 'tbody button.show.item', function () {
		$(this).parentTo('tr').find('[name="item[][nombre]"]').autocomplete('search', '@').focus();
	});

	$('section.sheet > div > table').on('click', 'tbody button.show.unidad', function () {
		$(this).parentTo('tr').find('[name="item[][unidad]"]').autocomplete('search', '@').focus();
	});

	$('section.sheet > div > table').on('click', 'tbody button.show.tipo-documento', function () {
		$(this).parentTo('tr').find('[name="item[][tipo_documento]"]').autocomplete('search', '@').focus();
	});

	var findItem = function (datasource, filter, extraCallbacks, relationship) {
		var options = {
			source: function (request, response) {
				var dataParams = {
					q: request.term,
					filter: ((typeof filter != 'undefined') ? filter : undefined)
				};
				if (typeof relationship != 'undefined')
					$.extend(dataParams, dataParams, {
						id: relationship.fk()
					});
				$.ajax({
					url: '/4DACTION/_V3_' + 'get' + datasource + ((typeof relationship != 'undefined') ? 'by' + relationship.by : ''),
					dataType: 'json',
					data: dataParams,
					success: function (data) {
						response($.map(data.rows, function (item) {
							return item;
						}));
					}
				});
			},
			minLength: 0,
			open: function () {
				$(this).removeClass('ui-corner-all').addClass('ui-corner-top');
			},
			close: function () {
				$(this).removeClass('ui-corner-top').addClass('ui-corner-all');
			}
		};

		$.extend(options, options, extraCallbacks);

		return options;
	};

	$('input[name^="cotizacion"]').keypress(function (event) {
		if (event.charCode == 13) {
			var nextSibling = $("input:visible,textarea:visible")[$("input:visible,textarea:visible").index() + 1];
			nextSibling.focus();
			return false;
		}
	});
	// $('table.items').delayed('blur', 1, 'tbody th input', {}, function(event) {
	$('table.items').on('blur', 'tbody th input', function (event) {
		contentLoaded = true;
		var element = this;
		if ($(element).parentTo('tr').find('[name="item[][nombre]"]').val().trim() == '')
			$(element).parentTo('tr').data('categoria', null);

		if (!$(element).parentTo('tr').data('categoria')) {
			if (!access._480) {
				$(element).parentTo('tr').find('[name="item[][nombre]"]').removeClass('edited').data('nombre-original', null);
				$(element).parentTo('tr').find('input').val('');
				$(element).parentTo('tr').find('input[name="item[][cantidad]"]').val(1).data('old-value', 1);
				$(element).parentTo('tr').find('input[name="item[][factor]"]').val(1).data('old-value', 1);
				$(element).parentTo('tr').find('input[name="item[][horas_extras]"]').val(0);
			} else {
				if ($(element).parentTo('tr').find('[name="item[][nombre]"]').val().trim() != '') {
					if ($(element).parentTo('tr').find('[name="item[][nombre]"]').data('ajax-call') !== undefined) {
						$(element).parentTo('tr').find('[name="item[][nombre]"]').removeClass('edited').data('nombre-original', null);
						$(element).parentTo('tr').find('input').val('');
						$(element).parentTo('tr').find('input[name="item[][cantidad]"]').val(1).data('old-value', 1);
						$(element).parentTo('tr').find('input[name="item[][factor]"]').val(1).data('old-value', 1);
						$(element).parentTo('tr').find('input[name="item[][horas_extras]"]').val(0);
					} else {
						var text = $($(element).parentTo('tr').find('[name="item[][nombre]"]').data('ui-autocomplete').bindings[1]).find('li:first-of-type span').text();
						if ($($(element).parentTo('tr').find('[name="item[][nombre]"]').data('ui-autocomplete').bindings[1]).find('li:first-of-type').length > 0 && $(element).parentTo('tr').find('[name="item[][nombre]"]').val().toLowerCase() == text.toLowerCase()) {
							$(element).parentTo('tr').find('[name="item[][nombre]"]').removeClass('edited').data('nombre-original', null);
							$(element).parentTo('tr').find('[name="item[][nombre]"]').val(text);
							$(element).parentTo('tr').data('categoria', $($(element).parentTo('tr').find('[name="item[][nombre]"]').data('ui-autocomplete').bindings[1]).find('li:first-of-type').closest('li').data('ui-autocomplete-item').id);
						} else {
							confirm('La categoría &laquo;' + $(element).parentTo('tr').find('[name="item[][nombre]"]').val().trim() + '&raquo; no existe en el catálogo.\n\n¿Desea crearla?').done(function (data) {
								if (data)
									$.ajax({
										url: '/4DACTION/_V3_setCategoria',
										data: {
											text: $(element).parentTo('tr').find('[name="item[][nombre]"]').val()
										},
										dataType: 'json',
										success: function (subdata) {
											if (subdata.success) {
												$(element).parentTo('tr').data('categoria', subdata.id);
												toastr.info('Se ha agregado una nueva categoría al catálogo');
											}
										}
									});
								else
									$(element).parentTo('tr').find('[name="item[][nombre]"]').val('');
							});
						}
					}
				}

			}
		}
	});

	var updateLine = function (event) {
		
		if (typeof calculateAll == 'undefined')
			calculateAll = true


		// mostrar decimales en cantidad 1
		if (event.originalEvent !== undefined && $(event.target).prop('name') == 'item[][cantidad]') {
			if (typeof $(event.target).data('first-focusout') == 'undefined') $(event.target).data('first-focusout', true);
			if ($(event.target).data('first-focusout')) {
				$(event.target).data('old-value', $(event.target).val());
				$(event.target).unbind('.format');
				$(event.target).number(true, 1, ',', '.');
				$(event.target).data('first-focusout', false);
				$(event.target).removeData('first-focusin');
			}
		}

		// mostrar decimales en cantidad 2
		if (event.originalEvent !== undefined && $(event.target).prop('name') == 'item[][factor]') {
			if (typeof $(event.target).data('first-focusout') == 'undefined') $(event.target).data('first-focusout', true);
			if ($(event.target).data('first-focusout')) {
				$(event.target).data('old-value', $(event.target).val());
				$(event.target).unbind('.format');
				$(event.target).number(true, 1, ',', '.');
				$(event.target).data('first-focusout', false);
				$(event.target).removeData('first-focusin');
			}
		}

		if ($(event.target).closest('tr').data('first-load') !== true) {

			if (event.originalEvent !== undefined && $(event.target).prop('name') == 'item[][margen_compra]' || $(event.target).prop('name') == 'item[][margen_venta]') {
				var margen = parseFloat($(event.target).val());
				var is_valid = (margen_desde_compra && margen >= 0 && ((margen_desde_compra_inverso && margen < 100) || !margen_desde_compra_inverso)) || (!margen_desde_compra && margen >= 0 && margen <= 100);

				if (!is_valid) {
					if (margen_desde_compra) {
						if (margen_desde_compra_inverso) {
							toastr.warning('El margen debe ser mayor o igual que 0, y menor que 100.');
						} else {
							toastr.warning('El margen no debe ser negativo.');
						}
					} else {
						toastr.warning('El margen debe tener un valor entre 0 y 100.');
					}
					$(event.target).val($(event.target).data('old-value'));
					return false;
				}
			}

			contentChanged = true;
			contentReady = false;
			var element = this;
			if (!$(element).prop('readonly')) {
				if ($(element).parentTo('td').hasClass('numeric') || $(element).prop('type') == 'checkbox') {
					
					updateRow(event);
				} else {
					if ($(element).parentTo('tr').find('[name="item[][nombre]"]').val().trim() == '')
						$(element).parentTo('tr').data('producto', null);

					if (!$(element).parentTo('tr').data('producto')) {
						if (!access._480) {
							$(element).parentTo('tr').find('[name="item[][nombre]"]').removeClass('edited').data('nombre-original', null);
							$(element).parentTo('tr').find('input').val('');
							$(element).parentTo('tr').find('input[name="item[][cantidad]"]').val(1).data('old-value', 1);
							$(element).parentTo('tr').find('input[name="item[][factor]"]').val(1).data('old-value', 1);
							$(element).parentTo('tr').find('input[name="item[][horas_extras]"]').val(0);
						} else {
							if ($(element).parentTo('tr').find('[name="item[][nombre]"]').val().trim() != '') {
								if ($(element).parentTo('tr').find('[name="item[][nombre]"]').data('ajax-call') !== undefined) {
									$(element).parentTo('tr').find('[name="item[][nombre]"]').removeClass('edited').data('nombre-original', null);
									$(element).parentTo('tr').find('input').val('');
									$(element).parentTo('tr').find('input[name="item[][cantidad]"]').val(1).data('old-value', 1);
									$(element).parentTo('tr').find('input[name="item[][factor]"]').val(1).data('old-value', 1);
									$(element).parentTo('tr').find('input[name="item[][horas_extras]"]').val(0);
								} else {
									var text = $($(element).parentTo('tr').find('[name="item[][nombre]"]').data('ui-autocomplete').bindings[1]).find('li:first-of-type span').text();

									if ($($(element).parentTo('tr').find('[name="item[][nombre]"]').data('ui-autocomplete').bindings[1]).find('li:first-of-type').length > 0 && $(element).parentTo('tr').find('[name="item[][nombre]"]').val().toLowerCase() == text.toLowerCase()) {
										var target = $(element).parentTo('tr');
										var ui = {
											item: $($(element).parentTo('tr').find('[name="item[][nombre]"]').data('ui-autocomplete').bindings[1]).find('li:first-of-type').closest('li').data('ui-autocomplete-item')
										};

										target.find('[name="item[][nombre]"]').removeClass('edited').data('nombre-original', null);
										target.find('[name="item[][nombre]"]').val(text);
										target.data('producto', ui.item.id);
										target.data('categoria', ui.item.categoria.id);

										target.find('[name="item[][codigo]"]').val(ui.item.index);
										target.find('[name="item[][unidad]"]').val(ui.item.unidad);
										target.find('[name="item[][horas_extras]"]').val(0);

										if (ui.item.porcentaje_monto_total == 0) {
											target.find('[name="item[][precio_unitario]"]').val(ui.item.precio / exchange_rate).data('old-value', ui.item.precio / exchange_rate);
											target.find('[name="item[][subtotal_precio]"]').val(ui.item.precio / exchange_rate);
											target.removeData('porcentaje-monto-total');
											target.find('[name="item[][precio_unitario]"]').removeProp('readonly');
										} else {
											// var total_a_cliente = $('[name="sobrecargo[5][subtotal]"]').val();
											var total_a_cliente = parseFloat($('input[name="cotizacion[ajuste]"]').val()) - parseFloat($('input[name="cotizacion[ajuste]"]').val()) * parseFloat($('input[name="sobrecargo[6][porcentaje]"]').val() / 100.00);

											target.data('porcentaje-monto-total', ui.item.porcentaje_monto_total);
											target.find('[name="item[][precio_unitario]"]').prop('readonly', true);
										}

										// Fórmula productor ejecutivo
										if (ui.item.formula_productor_ejecutivo) {
											target.find('[name="item[][precio_unitario]"]').prop('readonly', true);
											target.data('formula-productor-ejecutivo', true);
											// Bloquear nombre, tipo documento y cantidades
											target.find('[name="item[][nombre]"]').prop('readonly', true);
											target.find('button.show.item').invisible();
											target.find('[name="item[][tipo_documento]"]').prop('readonly', true);
											target.find('button.show.tipo-documento').hide();
											//target.find('[name="item[][cantidad]"]').prop('readonly', true);
											target.find('[name="item[][factor]"]').prop('readonly', true);
										} else {
											target.removeData('formula-productor-ejecutivo');
										}

										// Fórmula asistente producción
										if (ui.item.formula_asistente_produccion) {
											target.find('[name="item[][precio_unitario]"]').prop('readonly', true);
											target.data('formula-asistente-produccion', true);
											// Bloquear nombre, tipo documento y cantidades
											target.find('[name="item[][nombre]"]').prop('readonly', true);
											target.find('button.show.item').invisible();
											target.find('[name="item[][tipo_documento]"]').prop('readonly', true);
											target.find('button.show.tipo-documento').hide();
											//target.find('[name="item[][cantidad]"]').prop('readonly', true);
											target.find('[name="item[][factor]"]').prop('readonly', true);
										} else {
											target.removeData('formula-asistente-produccion');
										}

										// Fórmula horas extras
										if (ui.item.formula_horas_extras) {
											target.find('[name="item[][precio_unitario]"]').prop('readonly', true);
											target.data('formula-horas-extras', true);
											// Bloquear nombre, tipo documento y cantidades
											target.find('[name="item[][nombre]"]').prop('readonly', true);
											target.find('button.show.item').invisible();
											target.find('[name="item[][tipo_documento]"]').prop('readonly', true);
											target.find('button.show.tipo-documento').hide();
										} else {
											target.removeData('formula-horas-extras');
										}

										if (ui.item.director_internacional) {
											target.data('director-internacional', true);
										} else {
											target.removeData('director-internacional');
										}

										if (ui.item.porcentaje_monto_total || ui.item.formula_productor_ejecutivo || ui.item.formula_asistente_produccion || ui.item.formula_horas_extras) {
											target.find('.remove.item').remove();
											target.find('.insert.item').remove();
											target.find('.clone.item').remove();
											target.find('.ui-icon-arrow-4').remove();
										}

										if (ui.item.margen != 0) {
											target.data('preset-margen', true);
											target.data('preset-margen-value', ui.item.margen * 100.00);
											if (margen_desde_compra) {
												target.find('[name="item[][precio_unitario]"]').trigger('focus').val(0).data('old-value', 0).trigger('blur');
												target.find('[name="item[][margen_compra]"]').val(ui.item.margen * 100.00);
												target.find('[name="item[][margen_compra]"]').trigger('blur');
												if (!access._566)
													target.find('[name="item[][margen_compra]"]').prop('readonly', true);
											} else {
												target.find('[name="item[][margen_venta]"]').val(ui.item.margen * 100.00);
												target.find('[name="item[][margen_venta]"]').trigger('blur');
												if (!access._566)
													target.find('[name="item[][margen_venta]"]').prop('readonly', true);
											}
										} else {
											target.data('preset-margen', false);
										}
										if(unaBase.doc.separate_sc)
											target.find('[name="item[][aplica_sobrecargo]"]').prop('checked', ui.item.aplica_sobrecargo);

										target.find('[name="item[][ocultar_print]"]').prop('checked', ui.item.ocultar_print);
										target.find('[name="item[][mostrar_carta_cliente]"]').prop('checked', ui.item.mostrar_carta_cliente);

										// Corrección para caso margen desde compra
										if (typeof copiar_precio_a_costo == 'boolean' && margen_desde_compra)
											target.find('[name="item[][costo_unitario]"]').data('auto', true);

										if (typeof copiar_precio_a_costo == 'boolean' && !margen_desde_compra) {
											target.find('[name="item[][costo_unitario]"]').data('auto', true);

											if (ui.item.costo == 0) {
												target.find('[name="item[][costo_unitario]"]').val(ui.item.precio / exchange_rate).data('old-value', ui.item.precio / exchange_rate);
												target.find('[name="item[][subtotal_costo]"]').val(ui.item.precio / exchange_rate);
											} else {
												target.find('[name="item[][costo_unitario]"]').val(ui.item.costo / exchange_rate).data('old-value', ui.item.costo / exchange_rate);
												target.find('[name="item[][subtotal_costo]"]').val(ui.item.costo / exchange_rate);
											}
										} else {

											htmlObject.find('[name="item[][costo_unitario]"]').val(ui.item.costo / exchange_rate).data('old-value', ui.item.costo / exchange_rate);
											htmlObject.find('[name="item[][subtotal_costo]"]').val(ui.item.costo / exchange_rate);
										}

										target.find('[name="item[][nombre]"]').data('nombre-original', ui.item.text);

										var tooltip = ' \
										<p>Nombre ítem:</p> \
										<p>' + ui.item.text + '</p> \
										<p>&nbsp;</p> \
										<p>Descripción larga:</p> \
										<p>' + ((ui.item.observacion != '') ? ui.item.observacion.replace(/\n/g, '</p><p>') : 'N/A') + '</p> \
										<p>&nbsp;</p>\
										<p>Observación interna:</p> \
										<p>' + ((ui.item.comentario != '') ? ui.item.comentario.replace(/\n/g, '</p><p>') : 'N/A') + '</p> \
									';
										target.find('button.profile.item').tooltipster('update', tooltip);
										//target.find('button.profile.item').data('tooltip', tooltip);

										var subtotal_precio = target.find('[name="item[][subtotal_precio]"]').val();
										var subtotal_costo = target.find('[name="item[][subtotal_costo]"]').val();

										var margen_compra = ((subtotal_precio - subtotal_costo) / subtotal_costo * 100).toFixed(2);
										var margen_venta = ((subtotal_precio - subtotal_costo) / subtotal_precio * 100).toFixed(2);

										target.find('[name="item[][margen_venta]"]').val(margen_venta);
										target.find('[name="item[][margen_compra]"]').val(margen_compra);

										if (!isFinite(margen_venta))
											target.find('[name="item[][margen_venta]"]').invisible();
										else
											target.find('[name="item[][margen_venta]"]').visible();

										if (!isFinite(margen_compra))
											target.find('[name="item[][margen_compra]"]').invisible();
										else
											target.find('[name="item[][margen_compra]"]').visible();

										target.find('[name="item[][utilidad]"]').val(subtotal_precio - subtotal_costo);

										// Fix: para evitar que quede en blanco el tipo de documento
										target.data('tipo-documento', 33);
										target.find('input[name="item[][tipo_documento]"]').val('FE');
										if (typeof ui.item.tipo_documento != 'undefined' && ui.item.tipo_documento.id != 30 && ui.item.tipo_documento.id != 33) {
											target.data('tipo-documento', ui.item.tipo_documento.id);
											target.data('tipo-documento-text', ui.item.tipo_documento.text);
											target.data('tipo-documento-ratio', ui.item.tipo_documento.ratio);
											target.data('tipo-documento-valor-usd', ui.item.tipo_documento.valor_usd); // Impuesto extranjero
											target.data('tipo-documento-valor-moneda', ui.item.tipo_documento.valor_moneda); // Impuesto extranjero

											target.data('tipo-documento-inverse', ui.item.tipo_documento.inverse);
											target.find('[name="item[][tipo_documento]"]').val(ui.item.tipo_documento.abbr);
											if (ui.item.tipo_documento.ratio != 0) {
												target.find('[name="item[][precio_unitario]"]').addClass('edited');
												target.find('button.detail.price').visible();
											}
										} else {
											target.removeData('tipo-documento');
											target.removeData('tipo-documento-text');
											target.removeData('tipo-documento-ratio');
											target.removeData('tipo-documento-valor-usd'); // Impuesto extranjero
											target.removeData('tipo-documento-valor-moneda'); // Impuesto extranjero
											target.removeData('tipo-documento-inverse');
											target.find('[name="item[][precio_unitario]"]').removeClass('edited');
										}

										// Factor hora extra y jornada
										if (typeof ui.item.hora_extra != 'undefined') {
											target.data('hora-extra-enabled', true);
											target.data('hora-extra-factor', ui.item.hora_extra.factor);
											target.data('hora-extra-jornada', ui.item.hora_extra.jornada);
											target.data('hora-extra-dias', ui.item.hora_extra.dias);
											target.find('[name="item[][horas_extras]"]').parentTo('td').visible();
										} else {
											target.removeData('hora-extra-enabled');
											target.removeData('hora-extra-factor');
											target.removeData('hora-extra-jornada');
											target.data('hora-extra-dias', 7);
											target.find('[name="item[][horas_extras]"]').parentTo('td').invisible();
										}

										if ((typeof ui.item.tipo_documento != 'undefined' && ui.item.tipo_documento.id != 30 && ui.item.tipo_documento.id != 33) || typeof ui.item.hora_extra != 'undefined')
											target.find('button.detail.price').visible();

										var title = target.prevTo('.title');

										if (title.find('input[name="item[][nombre]"]').val() == '') {
											$.ajax({
												url: '/4DACTION/_V3_getCategoria',
												data: {
													q: ui.item.categoria.id,
													filter: 'id',
													from: 'negocio'
												},
												dataType: 'json',
												success: function (data) {
													if (data.rows.length) {
														var categoria = data.rows[0];
														title.data('categoria', categoria.id);
														title.find('input[name="item[][nombre]"]').val(categoria.text);
													}
												}
											});
										}

										target.find('span.unit').html(ui.item.unidad);

										target.data('observacion', ui.item.observacion);
										target.data('comentario', ui.item.comentario);

									} else {
										confirm('El ítem &laquo;' + $(element).parentTo('tr').find('[name="item[][nombre]"]').val().trim() + '&raquo; no existe en el catálogo.\n\n¿Desea crearlo?').done(function (data) {
											if (data)
												$.ajax({
													url: '/4DACTION/_V3_setProductoByCategoria',
													data: {
														id: $(element).parentTo('tr').prevTo('tr.title').data('categoria'),
														text: $(element).parentTo('tr').find('[name="item[][nombre]"]').val()
													},
													dataType: 'json',
													success: function (subdata) {
														if (subdata.success) {
															$(element).parentTo('tr').data('producto', subdata.id);
															$(element).parentTo('tr').find('[name="item[][nombre]"]').data('nombre-original', $(element).parentTo('tr').find('[name="item[][nombre]"]').val());
															toastr.info('Se ha agregado un nuevo ítem al catálogo');
														}
													}
												});
											else
												$(element).parentTo('tr').find('[name="item[][nombre]"]').val('');
										});
									}
								}
							}
						}
					}

					var has_change =
						(
							$(element).parentTo('tr').find('[name="item[][nombre]"]').val() != $(element).parentTo('tr').find('[name="item[][nombre]"]').data('nombre-original')
						) && (
							$(element).parentTo('tr').find('[name="item[][nombre]"]').data('nombre-original') != ''
						);

					if (has_change) {

						if (!$(element).parentTo('tr').hasClass('title')) {
							if ($(element).parentTo('tr').data('producto'))
								$(element).parentTo('tr').find('[name="item[][nombre]"]').addClass('edited');
						}

					} else
						$(element).parentTo('tr').find('[name="item[][nombre]"]').removeClass('edited');
				}
			}

			if ($(event.target).prop('name') == 'item[][margen_venta]')
				$(this).closest('tr').find('input[name="item[][costo_unitario]"]').trigger('focus').trigger('blur');

			/*if ($(event.target).prop('name') == 'item[][margen_compra]')
				$(this).closest('tr').find('input[name="item[][precio_unitario]"]').trigger('focus').trigger('blur');*/


		}

		switch (selected_currency) {
			case 'USD':
				var decimals = 2;
				break;
			case 'CLF':
				var decimals = 2;
				break;
			default:
				var decimals = currency.decimals;
				break;
		}

		// mostrar decimales en precio unitario
		if (event.originalEvent !== undefined && $(event.target).prop('name') == 'item[][precio_unitario]') {

			const costo_unitario = parseFloat($(event.target).val())

			$(event.target).data('old-value', $(event.target).val());
			$(event.target).unbind('.format');
			$(event.target).number(true, decimals, ',', '.');
			console.log('Precio unitario sin decimales es: ' + costo_unitario.toFixed(0).toString());

			if ($(event.target).data('preset-margen')) {
				toastr.warning('No es posible modificar el monto, ya que el ítem cuenta con un margen de porcentaje predeterminado desde el catalogo.')
			}

		}

		// mostrar decimales en costo unitario
		if (event.originalEvent !== undefined && $(event.target).prop('name') == 'item[][costo_unitario]') {
			if (typeof $(event.target).data('first-focusout') == 'undefined') $(event.target).data('first-focusout', true);
			if ($(event.target).data('first-focusout')) {
				$(event.target).data('old-value', $(event.target).val());
				$(event.target).unbind('.format');
				$(event.target).number(true, decimals, ',', '.');
				console.log('Costo unitario sin decimales es: ' + parseFloat($(event.target).val()).toFixed(0).toString());
				$(event.target).data('first-focusout', false);
				$(event.target).removeData('first-focusin');
			}
		}

		if ($('section.sobrecargos li[data-total="true"]:not([data-ajuste="true"])').length > 0) {
			if (!unaBase.reaperMode) {
				for (var i = 0; i <= 6; i++) {
					if (v3_sobrecargos_cinemagica) {
						updateItemsPorcentaje(event);
					}
					sobrecargos.updateSobrecargos();
				}
			}

		}


	};

	$('table.items').on('blur', 'tbody td input[name="item[][precio_unitario]"]', function (event) {
		switch (selected_currency) {
			case 'USD':
				var decimals = 2;
				break;
			case 'CLF':
				var decimals = 2;
				break;
			default:
				var decimals = currency.decimals;
				break;
		}
		$(event.target).unbind('.format');
		$(event.target).number(true, decimals + 2, ',', '.');
		let val = $(event.target).val()
		if (val == '') {
			$(event.target).val(0);
		}

	})

	$('table.items').on('blur', 'tbody td input[name="item[][subtotal_precio]"]', function (event) {
		switch (selected_currency) {
			case 'USD':
				var decimals = 2;
				break;
			case 'CLF':
				var decimals = 2;
				break;
			default:
				var decimals = currency.decimals;
				break;
		}
		$(event.target).unbind('.format');

		let val = $(event.target).val()
		if (val == '') {
			$(event.target).val(0);
		}

	})

	//REAPER ---> Comment --> item action
	$('table.items').on('focus', 'tbody td input[name="item[][precio_unitario]"]', function (event) {
		switch (selected_currency) {
			case 'USD':
				var decimals = 2;
				break;
			case 'CLF':
				var decimals = 2;
				break;
			default:
				var decimals = currency.decimals;
				break;
		}
		// ocultar decimales en precio unitario
		if (event.originalEvent !== undefined) {
			//if (typeof $(event.target).data('first-focusin') == 'undefined') $(event.target).data('first-focusin', true);
			//if ($(event.target).data('first-focusin')) {
			$(event.target).unbind('.format');
			$(event.target).number(true, decimals + 2, ',', '.');
			$(event.target).val($(event.target).data('old-value'));
			// console.log('Precio unitario con decimales es: ' + parseFloat($(event.target).val()).toString());
			//	$(event.target).data('first-focusin', false);
			//	$(event.target).removeData('first-focusout');
			//}
		}
	});

	$('table.items').on('focus', 'tbody td input[name="item[][costo_unitario]"]', function (event) {
		
		switch (selected_currency) {
			case 'USD':
				var decimals = 2;
				break;
			case 'CLF':
				var decimals = 2;
				break;
			default:
				var decimals = currency.decimals;
				break;
		}
		// ocultar decimales en costo unitario
		if (event.originalEvent !== undefined) {
			if (typeof $(event.target).data('first-focusin') == 'undefined') $(event.target).data('first-focusin', true);
			if ($(event.target).data('first-focusin')) {
				if(typeof $(event.target).data('old-value') == 'undefined')
					$(event.target).data('old-value', parseFloat($(event.target).val().replaceAll(".","").replaceAll(",",".")))
				
				if(typeof $(event.target).data('oldValue') == 'undefined')
					$(event.target).data('oldValue', parseFloat($(event.target).val().replaceAll(".","").replaceAll(",",".")))
					
				if( $(event.target).data('old-value') == 0 && parseFloat($(event.target).val()) != $(event.target).data('old-value'))
					$(event.target).data('old-value' , parseFloat($(event.target).val().replaceAll(".","").replaceAll(",",".")))

				$(event.target).unbind('.format');
				$(event.target).number(true, decimals + 2, ',', '.');
				$(event.target).val($(event.target).data('old-value'));
				console.log('Costo unitario con decimales es: ' + parseFloat($(event.target).val()).toString());
				$(event.target).data('first-focusin', false);
				$(event.target).removeData('first-focusout');
			}
		}

	});

	$('table.items').on('focus', 'tbody td input[name="item[][cantidad]"]', function (event) {
		if (event.originalEvent !== undefined) {
			if (typeof $(event.target).data('first-focusin') == 'undefined') $(event.target).data('first-focusin', true);
			if ($(event.target).data('first-focusin')) {
				$(event.target).unbind('.format');
				$(event.target).number(true, decimalesCantidad1, ',', '.');
				$(event.target).val(parseFloat($(event.target).data('old-value')));
				$(event.target).data('first-focusin', false);
				$(event.target).removeData('first-focusout');
			}
		}
	});

	$('table.items').on('focus', 'tbody td input[name="item[][factor]"]', function (event) {
		if (event.originalEvent !== undefined) {
			if (typeof $(event.target).data('first-focusin') == 'undefined') $(event.target).data('first-focusin', true);
			if ($(event.target).data('first-focusin')) {
				$(event.target).unbind('.format');
				$(event.target).number(true, decimalesCantidad2, ',', '.');
				$(event.target).val(parseFloat($(event.target).data('old-value')));
				$(event.target).data('first-focusin', false);
				$(event.target).removeData('first-focusout');
			}
		}
	});

	$('table.items').on('blur', 'tbody td input:not([type="checkbox"])', updateLine);
	$('table.items').on('change', 'tbody td input[type="checkbox"]', updateLine);
	$('table.items').on('update', 'tbody td input', updateLine);

	$('table.items').on('focus', 'tbody input[name="item[][margen_compra]"], tbody input[name="item[][margen_venta]"]', function (event) {
		$(event.target).data('old-value', $(event.target).val());
	});

	$('table.items').on('blur', 'tbody th input[name="item[][margen_compra]"], tbody th input[name="item[][margen_venta]"]', function (event) {

		var margen = parseFloat($(event.target).val());
		var is_valid = (margen_desde_compra && margen >= 0 && ((margen_desde_compra_inverso && margen < 100) || !margen_desde_compra_inverso)) || (!margen_desde_compra && margen >= 0 && margen <= 100);

		if (!is_valid && event.originalEvent !== undefined) {
			if (margen_desde_compra) {
				if (margen_desde_compra_inverso) {
					toastr.warning('El margen debe ser mayor o igual que 0, y menor que 100.');
				} else {
					toastr.warning('El margen no debe ser negativo.');
				}
			} else {
				toastr.warning('El margen debe tener un valor entre 0 y 100.');
			}
			$(event.target).val($(event.target).data('old-value'));
			return false;
		}

		if (event.originalEvent !== undefined) {
			unaBase.ui.block();
		}

		var new_margen = parseFloat($(this).val());
		var items = $(this).closest('tr').nextUntil('tr.title');
		items.each(function () {
			if (($(this).data('preset-margen') && access._566) || !$(this).data('preset-margen')) {
				if (margen_desde_compra) {
					$(this).find('[name="item[][margen_compra]"]').trigger('focus').val(new_margen).trigger('blur');
				} else {
					$(this).find('[name="item[][margen_venta]"]').trigger('focus').val(new_margen).trigger('blur');
				}
			}
		});

		if (event.originalEvent !== undefined) {
			unaBase.ui.unblock();
		}
	});

	$('table.items').on('focus', 'tfoot th input[name="cotizacion[margenes][margen_venta]"], tfoot th input[name="cotizacion[margenes][margen_compra]"]', function (event) {
		$(event.target).data('old-value', $(event.target).val());
	});

	$('table.items').on('blur', 'tfoot th input[name="cotizacion[margenes][margen_venta]"], tfoot th input[name="cotizacion[margenes][margen_compra]"]', function (event) {
		if (event.originalEvent !== undefined) {
			var margen = parseFloat($(event.target).val());
			var is_valid = (margen_desde_compra && margen >= 0 && ((margen_desde_compra_inverso && margen < 100) || !margen_desde_compra_inverso)) || (!margen_desde_compra && margen >= 0 && margen <= 100);
			if (is_valid) {
				unaBase.ui.block();
				var margen_fijo = $(this).closest('tr').find('[name="cotizacion[margenes][fijo]"]').prop('checked');
				$(this).closest('tr').find('[name="cotizacion[margenes][fijo]"]').prop('checked', false).trigger('change');
				var new_margen = parseFloat($(this).val());
				var titulos = $('table.items tbody').find('tr.title');
				titulos.each(function () {
					if (margen_desde_compra) {
						$(this).find('[name="item[][margen_compra]"]').trigger('focus').val(new_margen).trigger('blur');
					} else {
						$(this).find('[name="item[][margen_venta]"]').trigger('focus').val(new_margen).trigger('blur');
					}
				});
				$(this).closest('tr').find('[name="cotizacion[margenes][fijo]"]').prop('checked', margen_fijo).trigger('change');
				unaBase.ui.unblock();
			} else {
				if (margen_desde_compra) {
					if (margen_desde_compra_inverso) {
						toastr.warning('El margen debe ser mayor o igual que 0, y menor que 100.');
					} else {
						toastr.warning('El margen no debe ser negativo.');
					}
				} else {
					toastr.warning('El margen debe tener un valor entre 0 y 100.');
				}
				$(event.target).val($(event.target).data('old-value'));
			}
		}
	});

	$('table.items').on('change', 'tfoot th input[name="cotizacion[margenes][fijo]"]', function (event) {
		var checked = $(event.target).is(':checked');

		var changeMargenFijo = function (event) {
			if (event.originalEvent !== undefined)
				unaBase.ui.block();

			var items = $('table.items tbody').find('tr:not(.title)');
			if (margen_desde_compra) {
				var margen = $('table.items tfoot th input[name="cotizacion[margenes][margen_compra]"]');
			} else {
				var margen = $('table.items tfoot th input[name="cotizacion[margenes][margen_venta]"]');
			}
			items.each(function () {
				var target = $(this);
				if (checked) {
					target.data('fixed-margen', true);
					target.data('fixed-margen-value', parseFloat(margen.val()));
					if (margen_desde_compra) {
						//target.find('[name="item[][margen_compra]"]').trigger('blur');
						target.find('[name="item[][margen_compra]"]').prop('readonly', true);
						target.find('[name="item[][margen_compra]"]').visible();
					} else {
						//target.find('[name="item[][margen_venta]"]').trigger('blur');
						target.find('[name="item[][margen_venta]"]').prop('readonly', true);
						target.find('[name="item[][margen_venta]"]').visible();
					}
				} else {
					target.data('fixed-margen', false);
					if (margen_desde_compra) {
						if (!access._566)
							target.find('[name="item[][margen_compra]"]').prop('readonly', target.data('preset-margen'));
						else
							target.find('[name="item[][margen_compra]"]').prop('readonly', false);
						//target.find('[name="item[][margen_compra]"]').trigger('blur');
					} else {
						if (!access._566)
							target.find('[name="item[][margen_venta]"]').prop('readonly', target.data('preset-margen'));
						else
							target.find('[name="item[][margen_venta]"]').prop('readonly', false);
						//target.find('[name="item[][margen_venta]"]').trigger('blur');
					}
				}
			});

			if (event.originalEvent !== undefined) {
				if (margen_desde_compra) {
					$('table.items tfoot th input[name="cotizacion[margenes][margen_compra]"]').trigger('focus').trigger('blur');
				} else {
					$('table.items tfoot th input[name="cotizacion[margenes][margen_venta]"]').trigger('focus').trigger('blur');
				}
				unaBase.ui.unblock();
			}
		}

		if (event.originalEvent !== undefined && checked) {
			confirm('¿Desea cambiar a margen fijo?\n\nEsto podría cambiar los montos.').done(function (data) {
				if (data) {
					changeMargenFijo(event);
				} else {
					event.preventDefault();
					$(event.target).prop('checked', false);
				}
			}).fail(function () {
				$(event.target).prop('checked', false);
			});
		} else {
			changeMargenFijo(event);
		}


	});

	$('table.items').on('keypress', 'tbody tr input', function (event) {
		console.log('test item rojo');
		var target = $(this).parentTo('tr');
		switch (event.keyCode) {
			case 13:
				if (event.shiftKey) {
					if (target.prev().length > 0)
						target.prev().find('[name="item[][nombre]"]').focus();
				} else {
					target.find('[name="item[][nombre]"]').addClass('invalid');
					if (target.next().length > 0)
						target.next().find('[name="item[][nombre]"]').focus();
					else {
						if (target.find('[name="item[][nombre]"]').val() != '' && target.find('[name="item[][nombre]"]').data('ajax-call') === undefined) {
							if (target.hasClass('title'))
								target.find('button.add.item').click();
							else
								//target.prevTo('.title').find('button.add.item').click();
								target.find('button.insert.item').click();
						}
					}
					target.find('[name="item[][nombre]"]').removeClass('invalid');
				}
				break;
			case 10:
				target.prevTo('.title').find('button.add.item').click();
				break;
		}
	});



	// Sobrecargo cinemágica
	if (v3_sobrecargos_cinemagica) {
		$('section.sheet footer .block-totales').on('blur', '[name="sobrecargo[1][subtotal]"]', function (event) {
			var valor_pelicula = parseFloat($(event.target).closest('li').find('[name^="sobrecargo"][name$="[subtotal]"]').val());
			var valorObject = $(event.target).closest('li').find('[name^="sobrecargo"][name$="[valor]"]');
			var porcentajeObject = $(event.target).closest('li').find('[name^="sobrecargo"][name$="[porcentaje]"]');
			var subtotal_items = parseFloat($('[name="cotizacion[precios][subtotal]"]').val());
			var director_internacional = parseFloat($('[name="cotizacion[precios][subtotal]"]').data('director-internacional'));

			if (valor_pelicula < subtotal_items) {
				toastr.warning('El valor película no puede ser menor al subtotal de ítems.');
				porcentajeObject.val(0).data('value', 0).trigger('focus').trigger('blur');

				// Sección datos cinemágica
				refreshValorPeliculaFromSobrecargos();

				return false;
			}

			//var valor_nuevo_sobrecargo = valor_pelicula - subtotal_items;
			var valor_nuevo_sobrecargo = valor_pelicula - (subtotal_items - director_internacional);

			//var porcentaje = (1 - subtotal_items / valor_pelicula) * 100.00;
			var porcentaje = (1 - (subtotal_items - director_internacional) / valor_pelicula) * 100.00;

			valorObject.val(valor_nuevo_sobrecargo);
			porcentajeObject.val(porcentaje).data('value', porcentaje).trigger('focus').trigger('blur');
			unaBase.ui.block();
			$('table.items.cotizacion').find('tr.title').each(function (key, item) {
				var next = $(item).next();
				if (next.length > 0)
					updateSubtotalTitulos(next);
			});
			updateSubtotalItems();
			unaBase.ui.unblock();

			if (typeof event.originalEvent == 'object') {
				$('section.sheet footer .block-totales [name="sobrecargo[1][subtotal]"]').val(valor_pelicula).trigger('blur');
				//$('section.sheet footer .block-totales [name="sobrecargo[1][subtotal]"]').val(valor_pelicula - director_internacional).trigger('blur');
			}

		});
	}



	$('section.sheet footer .block-totales').on('blur', '[name^="sobrecargo"][name$="[porcentaje]"]', function (event) {


		if (v3_sobrecargos_cinemagica && typeof chain == 'undefined') {
			// actualiza porcentaje de item
			var item;
			var precio_unitario = 0;
		}

		if (!$(this).prop('readonly')) {
			contentChanged = true;
			contentReady = false;
			if ($(event.target).parentTo('ul').find('li[data-total="true"]').length > 1 || $(event.target).prop('name') == 'sobrecargo[1][porcentaje]') {
				if ($('section.sheet').data('no-update')) { // Optimización cálculos cinemágica
					updateItemsPorcentaje(event);
					sobrecargos.updateSobrecargos();
				} else {
					if (!unaBase.reaperMode) {
						for (var i = 0; i <= 10; i++) {
							if (v3_sobrecargos_cinemagica) {
								updateItemsPorcentaje(event);
							}
							sobrecargos.updateSobrecargos();
						}
					} else {
						sobrecargos.updateSobrecargos();
					}


				}
			} else
				sobrecargos.updateSobrecargos();

		}
	});

	//REAPER COMMENT ---> estgo actualiza el total neto cuando modifico el total manualmente
	$('section.sheet footer .block-totales').on('blur', '[name^="sobrecargo"][name$="[valor]"]', function (event) {
		if (event.isSimulated)
			return false;

		if (!scDirectInput) {

			var valor_sobrecargo_anterior = parseFloat($(this).data('old-value'));
			var valor_sobrecargo_actual = parseFloat($(this).val());
			if (valor_sobrecargo_anterior != valor_sobrecargo_actual) {
				var base_total_sobrecargo = parseFloat($('input[name="cotizacion[montos][subtotal_neto]"]').val());
				var porcentaje_sobrecargo = 0;
				if ($(this).parentTo('li').find('[name^="sobrecargo"][name$="[porcentaje]"]').prop('readonly')) {
					var subtotal_sobrecargo_previo = ($(this).parentTo('li').prev().length) ? $(this).parentTo('li').prev().find('[name^="sobrecargo"][name$="[subtotal]"]').val() : $('input[name="cotizacion[precios][subtotal]"]').val();
					porcentaje_sobrecargo = (valor_sobrecargo_actual / subtotal_sobrecargo_previo) * 100;
				} else
					porcentaje_sobrecargo = (valor_sobrecargo_actual / base_total_sobrecargo) * 100;

				$(this).parentTo('li').find('[name^="sobrecargo"][name$="[porcentaje]"]').val(porcentaje_sobrecargo.toFixed(2));

				sobrecargos.updateSobrecargos();
			}
			$(this).triggerHandler('focus');

			if ($(this).parentTo('li').find('[name^="sobrecargo"][name$="[porcentaje]"]').prop('readonly'))
				$('[name="cotizacion[descuento][valor]"]').triggerHandler('blur');


		}

		sobrecargos.updateSobrecargos();

	});

	$('section.sheet footer').on('change', '[name^="sobrecargo"][name$="[cerrado]"]', function (event) {
		// Confirmar cambio en cierre de sobrecargo
		if (!$('table.items.cotizacion').data('edit-sobrecargo-cerrado-remember')) {
			confirm("¿Está seguro de cambiar el cierre del sobrecargo?<br><br><label><input type=\"checkbox\" name=\"edit_sobrecargo_cerrado_remember\"> No volver a preguntar para esta cotización</label>", 'Sí', 'No').done(function (data) {
				if (data) {
					sobrecargos.updateSobrecargos();
				} else {
					var isChecked = $(event.target).prop('checked');
					$(event.target).prop('checked', !isChecked);
				}
				if ($('[name="edit_sobrecargo_cerrado_remember"]').is(':checked')) {
					$('table.items.cotizacion').data('edit-sobrecargo-cerrado-remember', true);
				}
			}).fail(function () {
				var isChecked = $(event.target).prop('checked');
				$(event.target).prop('checked', !isChecked);
			});
		} else {
			sobrecargos.updateSobrecargos();
		}
	});

	$('[name="cotizacion[descuento][porcentaje]"]').on('focus', function () {
		$(this).data('old-value', $(this).val());
	});

	$('[name="cotizacion[descuento][porcentaje]"]').on('change', function () {
		var old_value = $(this).data('old-value');
		var porcentaje_descuento = parseFloat($(this).val());
		if (porcentaje_descuento >= 0.00 && porcentaje_descuento <= 100.00) {
			// for (var i = 0; i < 20; i++) {
			// var subtotal_precios = parseFloat($('[name="cotizacion[precios][subtotal]"]').val());
			// var subtotal_sobrecargos = parseFloat($('[name="cotizacion[sobrecargos][subtotal]"]').val());

			// var valor_descuento = (subtotal_precios + subtotal_sobrecargos) * porcentaje_descuento / 100.00;
			// if (typeof selected_currency == 'undefined')
			// 	$('[name="cotizacion[descuento][valor]"]').val(valor_descuento.toFixed(currency.decimals));
			// else
			// 	$('[name="cotizacion[descuento][valor]"]').val(valor_descuento.toFixed(2));

			// $('[name="cotizacion[descuento][valor]"]').trigger('blur');

			// updateSubtotalNeto();
			sobrecargos.updateSobrecargos();
			//}
		} else {
			toastr.warning('El porcentaje del descuento debe estar entre 0 y 100');
			$(this).val($(this).data('old-value'));
		}
	});

	$('[name="cotizacion[descuento][valor]"]').on('change', function () {
		$(this).validateNumbers();
		var subtotal_precios = parseFloat($('[name="cotizacion[precios][subtotal]"]').val());
		var subtotal_sobrecargos = parseFloat($('[name="cotizacion[sobrecargos][subtotal]"]').val());
		var valor_descuento = parseFloat($(this).val());

		var porcentaje_descuento = valor_descuento / (subtotal_precios + subtotal_sobrecargos) * 100.00;

		if (valor_descuento >= 0 && valor_descuento <= subtotal_precios + subtotal_sobrecargos) {
			$('[name="cotizacion[descuento][porcentaje]"]').val(porcentaje_descuento.toFixed(6));
		} else {
			toastr.warning('El monto del descuento no debe ser mayor al total');
			var zero = 0;
			$('[name="cotizacion[descuento][porcentaje]"]').val(zero.toFixed(6));

		}

		// updateSubtotalNeto();
		sobrecargos.updateSobrecargos();

	});


	//REAPER ----> COMENTADO: ESTUPIDEZ HUMANA
	// var max_iterations_reset_ajuste = 10;
	// var max_iterations_change_ajuste = 24;



	var max_iterations_reset_ajuste = 10;
	var max_iterations_change_ajuste = 24;

	$('input[name="cotizacion[ajuste]"]').on('blur', function (event) {


		if (typeof event.originalEvent == 'object') {
			unaBase.ui.block();

			$(this).data('target-value', parseFloat($(this).val()));
			$(this).data('iterations', parseFloat(1));

		} else {
			if ($(this).data('iterations') == 1)
				totalNeto = parseFloat($(this).val());
			$(this).data('iterations', parseFloat($(this).data('iterations')) + 1);
		}

		// actualiza porcentaje de item
		var item;
		var precio_unitario = 0;

		if ($(this).data('iterations') == 1) {
			if (v3_sobrecargos_cinemagica) {
				var total_a_cliente = parseFloat($('input[name="cotizacion[ajuste]"]').val());
			} else {
				var total_a_cliente = parseFloat($('input[name="cotizacion[ajuste]"]').val()) - parseFloat($('input[name="cotizacion[ajuste]"]').val()) * parseFloat($('input[name="sobrecargo[6][porcentaje]"]').val() / 100.00);
			}
			var that = this;
			$('table.items tbody').find('tr').each(function () {

				if (typeof $(this).data('porcentaje-monto-total') == 'object') {
					item = $(this);

					var id_item = item.data('id');
					var cantidad = parseFloat(item.find('input[name="item[][cantidad]"]').data('old-value'));
					var factor = parseFloat(item.find('input[name="item[][factor]"]').data('old-value'));
					var porcentaje_monto_total = $(this).data('porcentaje-monto-total');

					precio_unitario = total_a_cliente * porcentaje_monto_total / (cantidad * factor);

					if (typeof item != 'undefined' && ((fixedTotalCliente && (precio_unitario == 0 || precio_unitario != parseFloat((item.find('input[name="item[][precio_unitario]"]').data('old-value')) ? item.find('input[name="item[][precio_unitario]"]').data('old-value') : item.find('input[name="item[][precio_unitario]"]').val()))) || !fixedTotalCliente))
						item.find('input[name="item[][precio_unitario]"]').val(precio_unitario).data('old-value', precio_unitario).trigger('blur');
				}
			});
		}


		$(this).validateNumbers();

		var valor_ajuste = parseFloat($(this).val());
		var subtotal_neto = parseFloat($('input[name="cotizacion[montos][subtotal_neto]"]').val());

		let typesc = 'input[name$="[valor]"]';
		// if (unaBase.doc.reaperMode)
		// 	typesc = 'input[name$="[valor-sc]"]';
		// else
		// 	typesc = 'input[name$="[valor]"]';



		document.querySelector('section.sobrecargos li[data-ajuste="true"] input[name$="[valor]"]').value

		var sobrecargo = unaBase.utilities.transformNumber(document.querySelector(`section.sobrecargos li[data-ajuste="true"] ${typesc}`).value);

		var diferencia_ajuste = valor_ajuste - subtotal_neto + sobrecargo;

		if (diferencia_ajuste != 0) {
			$('button.reset.ajuste').show();
			$('[name="cotizacion[montos][subtotal_neto]"]').addClass('ajustado');
		} else {
			$('button.reset.ajuste').hide();
			$('[name="cotizacion[montos][subtotal_neto]"]').removeClass('ajustado');
		}

		if (typeof event.originalEvent != 'undefined')
			$(this).data('first-value', diferencia_ajuste);

		$('[name="cotizacion[montos][subtotal_neto]"]').addClass('ajustado');

		$(this).data('value', diferencia_ajuste);

		if (diferencia_ajuste > 0)
			$('[name="cotizacion[montos][subtotal_neto]"]').addClass('ajustado');
		else
			$('[name="cotizacion[montos][subtotal_neto]"]').removeClass('ajustado');


		$(`section.sobrecargos li[data-ajuste="true"] ${typesc}`).val($(this).data('value')).trigger('blur');

		//REAPER --> NO DESCOMENTAR	
		//$('[name="cotizacion[ajuste][diferencia]"]').val($(this).data('value'));



		if (parseFloat($(this).val()) != parseFloat($(this).data('target-value'))) {
			if ($(this).data('iterations') <= max_iterations_change_ajuste)
				$(this).val($(this).data('target-value')).triggerHandler('blur');
			else {
				unaBase.ui.unblock();
				$('section.sobrecargos li[data-ajuste="true"] input[name$="[valor]"]').val($(this).data('first-value')).trigger('change');
				//$('[name="cotizacion[ajuste][diferencia]"]').val($(this).data('first-value'));
				$('input[name="sobrecargo[5][valor]"]').val($('input[name="cotizacion[ajuste][diferencia]"]').val());
			}

			// $(`section.sobrecargos li[data-ajuste="true"] ${typesc}`).val($(this).data('first-value')).trigger('change');
			// //$('[name="cotizacion[ajuste][diferencia]"]').val($(this).data('first-value'));
			// $('input[name="sobrecargo[5][valor]"]').val($('input[name="cotizacion[ajuste][diferencia]"]').val());

		} else {

			if (diferencia_ajuste != 0) {
				$('[name="cotizacion[montos][subtotal_neto]"]').addClass('ajustado');
			} else
				$('[name="cotizacion[montos][subtotal_neto]"]').removeClass('ajustado');
		}

		unaBase.ui.unblock();
	});



	//Acción del boton reset ajuste
	$('button.reset.ajuste').button({
		caption: 'Restablecer ajuste',
		icons: {
			primary: 'ui-icon-circle-close'
		},
		text: false
	}).click(function () {
		totalNeto = 0;
		unaBase.ui.block();

		let typesc = 'input[name$="[valor]"]';
		// if (unaBase.doc.reaperMode)
		// 	typesc = 'input[name$="[valor-sc]"]';
		// else
		// 	typesc = 'input[name$="[valor]"]';

		$(`section.sobrecargos li[data-ajuste="true"] ${typesc}`).val(0).trigger('change');
		$('input[name="cotizacion[ajuste][diferencia]"]').val(0);
		unaBase.ui.unblock();
		toastr.info('Ajuste restablecido con éxito.');
		$(this).hide();
		if (!unaBase.reaperMode) {
			for (var i = 0; i <= max_iterations_reset_ajuste; i++)
				sobrecargos.updateSobrecargos();
		} else
			sobrecargos.updateSobrecargos();
	});

	$('[name="cotizacion[montos][impuesto][exento]"]').change(function (event) {
		// Confirmar modificación check exento
		confirm('¿Está seguro de modificar el estado exento de la cotización?<br>-Esto podría cambiar los valores totales.').done(function (data) {
			if (data) {
				totales.updateTotal();
			} else {
				$(event.target).prop('checked', !$(event.target).prop('checked'));
			}
		}).fail(function () {
			$(event.target).prop('checked', !$(event.target).prop('checked'));
		});
	});

	console.timeEnd("start-detalle");
	getDetail(function () {

		if ($('section.sheet').data('readonly')) {
			$('table.items button.toggle.all').trigger('click');
			$('section.sheet').find('input, textarea, tr button, tr span').prop('disabled', true).attr('placeholder', '');
			$('section.sheet').find('tr button, tr span.ui-icon, ul.editable button, footer button').hide();
		}

		if ($('section.sheet').data('locked')) {
			$('table.items button.toggle.all').trigger('click');
			$('section.sheet').find('input, textarea, tr button, tr span').prop('disabled', true).attr('placeholder', '');
			$('section.sheet').find('tr button, tr span.ui-icon, ul.editable button, footer button').hide();
		}

		if (!$('section.sheet').data('readonly') && !$('section.sheet').data('locked')) {
			$('table.items tfoot th input[name="cotizacion[margenes][fijo]"]').trigger('change');
		}


		// test speed----------REVISAR GR
		// if (!modoOffline)
		// 	updateSubtotalItems();

		// Sección datos cinemágica
		blockCinemagica.find('[name="sobrecargo[1][subtotal][usd]"]').number(true, 2, ',', '.');
		blockCinemagica.find('.numeric.percent input').bind('focus', function () {
			if (typeof $(this).data('value') == 'undefined')
				$(this).data('value', $(this).val());
			$(this).unbind('.format').number(true, 6, ',', '.').val($(this).data('value'));
		});
		blockCinemagica.find('.numeric.percent input').bind('focusout', function (event) {
			$(this).data('value', $(this).val()).unbind('.format').number(true, 2, ',', '.');
		});

		// Sección sobrecargos cinemagica
		refreshValorPeliculaFromSobrecargos();
		blockCinemagica.find('[name="sobrecargo[1][porcentaje]"]').on('blur', refreshUtilidadBrutaToSobrecargos);
		blockCinemagica.find('[name="sobrecargo[1][subtotal]"]').on('blur', refreshValorPeliculaToSobrecargos);
		blockCinemagica.find('[name="sobrecargo[4][porcentaje]"]').on('blur', refreshCostosFijosToSobrecargos);
		blockCinemagica.find('[name="sobrecargo[6][porcentaje]"]').on('blur', refreshComisionAgenciaToSobrecargos);
		blockCinemagica.find('[name="cotizacion[cinemagica][director][porcentaje]"]').on('blur', refreshDirector);

		var valor_pelicula = parseFloat(blockCinemagica.find('[name="sobrecargo[1][subtotal]"]').val());
		blockCinemagica.find('[name="sobrecargo[1][subtotal]"]').data('old-value', valor_pelicula);

		// Permisos por columna
		//columnsPermissions();

	});






	//-----------------------   Eventos   --------------------------
	//----------------------------------------------------------------

	business.getSobrecargoData();
	sobrecargos.getSobrecargos();
	sobrecargos.getSobrecargosInfo();


	console.time("check1");
	totales.checkAjuste($('section.sheet').data('new'));
	// if (!modoOffline)
	// 	updateSubtotalItems();

	console.timeEnd("check1");
	var showHelp = function () {
		$('[data-help]').each(function () {
			$(this).qtip({
				content: {
					text: $(this).data('help')
				}
			}).on('click focus', function () {
				$(this).qtip('hide');
			})
			$(this).qtip('show');
		});

		$('section.sheet').bind('scroll mousewheel', function () {
			$('[data-help]').each(function () {
				$(this).qtip('hide');
			});
			$('section.sheet').unbind('scroll mousewheel');
		});
	};

	var hideHelp = function () {
		$('[data-help]').each(function () {
			$(this).qtip('hide');
		});
	};

	// FIXME: Se deshabilita hasta poder corregirlo
	/* if ($('section.sheet').data('new')) {
		setTimeout(showHelp, 1000);
	}; */


	// var updatePrecioCotizado = function (event) {

	// 	console.log('updatePrecioCotizado');
	// 	var exchange_rate_usd = (valor_usd_cotizacion > 0) ? valor_usd_cotizacion : valor_usd;
	// 	var exchange_rate_clf = (valor_clf_cotizacion > 0) ? valor_clf_cotizacion : valor_clf;

	// 	// Impuesto extranjero 0%
	// 	//if ($(this).parentTo('tr').data('tipo-documento') && $(this).parentTo('tr').data('tipo-documento-ratio')) {
	// 	if ($(this).parentTo('tr').data('tipo-documento') && ($(this).parentTo('tr').data('tipo-documento-ratio') || (!$(this).parentTo('tr').data('tipo-documento-ratio') && $(this).parentTo('tr').data('tipo-documento-valor-usd')))) {

	// 		if (typeof selected_currency == 'undefined') {
	// 			// Corrección cuando se ocultan decimales
	// 			//var valor_negociado = parseFloat($(this).val());
	// 			if ($(this).data('old-value'))
	// 				var valor_negociado = parseFloat($(this).data('old-value'));
	// 			else
	// 				var valor_negociado = parseFloat($(this).val());
	// 		} else {
	// 			// Corrección cuando se ocultan decimales
	// 			//var valor_negociado = parseFloat($(this).val());
	// 			if ($(this).data('old-value'))
	// 				var valor_negociado = parseFloat($(this).data('old-value'));
	// 			else
	// 				var valor_negociado = parseFloat($(this).val());
	// 		}

	// 		var impuesto = $(this).parentTo('tr').data('tipo-documento-ratio');
	// 		var is_valor_usd = $(this).parentTo('tr').data('tipo-documento-valor-usd'); // Impuesto extranjero
	// 		var division = $(this).parentTo('tr').data('tipo-documento-inverse');
	// 		let valor_moneda_ex = $(this).parentTo('tr').data('tipo-documento-valor-moneda') ? $(this).parentTo('tr').data('tipo-documento-valor-moneda') : 1

	// 		var base_imponible = 0;

	// 		$(this).addClass('edited');
	// 		$(this).parentTo('tr').find('button.detail.price').visible();

	// 		if (typeof selected_currency == 'undefined') {
	// 			if (division) {
	// 				// Impuesto extranjero
	// 				if (is_valor_usd)
	// 					base_imponible = (valor_negociado / (1.00 - impuesto)) * valor_moneda_ex;
	// 				else
	// 					base_imponible = valor_negociado / (1.00 - impuesto);
	// 			} else
	// 				base_imponible = valor_negociado * (1.00 + impuesto);
	// 		} else {
	// 			if (division) {
	// 				// Impuesto extranjero
	// 				if (is_valor_usd)
	// 					base_imponible = (valor_negociado / (1.00 - impuesto)) * valor_moneda_ex;
	// 				else
	// 					base_imponible = valor_negociado / (1.00 - impuesto);
	// 			} else
	// 				base_imponible = valor_negociado * (1.00 + impuesto);
	// 		}

	// 		$(this).val(base_imponible);
	// 		// Corrección cuando se ocultan decimales
	// 		$(this).data('old-value', base_imponible);

	// 		$(this).parentTo('tr').data('base-imponible', base_imponible);

	// 		if ($(this).hasClass('special')) {
	// 			var hora_extra_cantidad = parseFloat($(this).parentTo('tr').find('input[name="item[][horas_extras]"]').val());
	// 			$(this).parentTo('tr').find('input[name="item[][horas_extras]"]').trigger('change');

	// 			var hora_extra_valor = $(this).parentTo('tr').data('hora-extra-valor');
	// 			$(this).val(base_imponible + (hora_extra_valor * hora_extra_cantidad));
	// 			// Corrección cuando se ocultan decimales
	// 			$(this).data('old-value', base_imponible + (hora_extra_valor * hora_extra_cantidad));
	// 		}

	// 	}
	// 	if (typeof $(event.target).data('undo') == 'undefined')
	// 		$(event.target).data('undo', true);


	// 	//REAPER ----> comentado: estupidez humana
	// 	$(this).parentTo('tr').find('[name="item[][cantidad]"]').trigger('focus').trigger('blur');

	// 	if ($(this).parentTo('tr').find('[name="item[][costo_unitario]"]').data('auto'))
	// 		$(this).parentTo('tr').find('[name="item[][costo_unitario]"]').val($(this).val()).data('old-value', $(this).data('old-value')).trigger('blur');

	// };

	// var updatePrecioNegociado = function (event) {

	// 	var exchange_rate_usd = (valor_usd_cotizacion > 0) ? valor_usd_cotizacion : valor_usd;
	// 	var exchange_rate_clf = (valor_clf_cotizacion > 0) ? valor_clf_cotizacion : valor_clf;

	// 	// Impuesto extranjero 0%
	// 	//if ($(this).parentTo('tr').data('tipo-documento') && $(this).parentTo('tr').data('tipo-documento-ratio')) {
	// 	if ($(this).parentTo('tr').data('tipo-documento') && ($(this).parentTo('tr').data('tipo-documento-ratio') || (!$(this).parentTo('tr').data('tipo-documento-ratio') && $(this).parentTo('tr').data('tipo-documento-valor-usd')))) {

	// 		if ($(this).hasClass('special')) {
	// 			// Corrección ocultar decimales
	// 			//var valor_a_cotizar = parseFloat($(this).val());
	// 			if ($(this).data('old-value'))
	// 				var valor_a_cotizar = parseFloat($(this).data('old-value'));
	// 			else
	// 				var valor_a_cotizar = parseFloat($(this).val());
	// 			var hora_extra_cantidad = parseFloat($(this).parentTo('tr').find('input[name="item[][horas_extras]"]').val());

	// 			if (typeof $(this).parentTo('tr').data('hora-extra-valor') == 'undefined')
	// 				$(this).parentTo('tr').find('input[name="item[][horas_extras]"]').trigger('change');

	// 			var impuesto = $(this).parentTo('tr').data('tipo-documento-ratio');
	// 			var is_valor_usd = $(this).parentTo('tr').data('tipo-documento-valor-usd'); // Impuesto extranjero
	// 			var multiplicacion = $(this).parentTo('tr').data('tipo-documento-inverse');
	// 			let valor_moneda_ex = $(this).parentTo('tr').data('tipo-documento-valor-moneda') ? $(this).parentTo('tr').data('tipo-documento-valor-moneda') : 1

	// 			var hora_extra_valor = $(this).parentTo('tr').data('hora-extra-valor');

	// 			$(this).val(valor_a_cotizar - Math.round(hora_extra_valor * hora_extra_cantidad));
	// 			// Corrección ocultar decimales
	// 			$(this).data('old-value', valor_a_cotizar - (hora_extra_valor * hora_extra_cantidad));
	// 		}

	// 		// Corrección ocultar decimales
	// 		//var valor_a_cotizar = parseFloat($(this).val());
	// 		if ($(this).data('old-value'))
	// 			var valor_a_cotizar = parseFloat($(this).data('old-value'));
	// 		else
	// 			var valor_a_cotizar = parseFloat($(this).val());

	// 		var impuesto = $(this).parentTo('tr').data('tipo-documento-ratio');
	// 		var is_valor_usd = $(this).parentTo('tr').data('tipo-documento-valor-usd'); // Impuesto extranjero
	// 		var multiplicacion = $(this).parentTo('tr').data('tipo-documento-inverse');
	// 		let valor_moneda_ex = $(this).parentTo('tr').data('tipo-documento-valor-moneda') ?  $(this).parentTo('tr').data('tipo-documento-valor-moneda') : 1

	// 		var valor_cotizado = 0;

	// 		$(this).removeClass('edited');
	// 		$(this).parentTo('tr').find('button.detail.price').invisible();

	// 		if (multiplicacion) {
	// 			// Impuesto extranjero
	// 			if (is_valor_usd)
	// 				valor_cotizado = (valor_a_cotizar * (1 - impuesto)) / valor_moneda_ex;
	// 			else
	// 				valor_cotizado = valor_a_cotizar * (1 - impuesto);
	// 		} else
	// 			valor_cotizado = valor_a_cotizar / (1 + impuesto);

	// 		$(this).val(valor_cotizado);
	// 		// Corrección ocultar decimales
	// 		$(this).data('old-value', valor_cotizado);
	// 	}

	// 	unaBase.ui.unblock();

	// };

	


	console.time("check2");
	$('section.sheet').on('blur', 'tr:not(.title) input[name="item[][precio_unitario]"]', updatePrecioCotizado);
	$('section.sheet').on('focus', 'tr:not(.title) input[name="item[][precio_unitario]"].edited', updatePrecioNegociado);
	$('section.sheet').on('blur', 'tr:not(.title) input[name="item[][costo_unitario]"]', updatePrecioCotizado);
	$('section.sheet').on('focus', 'tr:not(.title) input[name="item[][costo_unitario]"].edited', updatePrecioNegociado);
	$('section.sheet').on('focus', 'tr:not(.title) input[name="item[][subtotal_costo]"]', updatePrecioNegociado);
	$('section.sheet').on('change', 'tr:not(.title) input[name="item[][horas_extras]"]', updateHorasExtras);
	$('section.sheet').on('change', 'tr:not(.title) input[name="item[][factor]"]', updateHorasExtras);
	$('section.sheet').on('change', 'tr:not(.title) input[name="item[][cantidad]"]', updateHorasExtras);


	$('section.sheet').on('change', 'tr.title input[name="item[][horas_extras]"]', function (event) {
		var horas_extras = $(this).val();
		if (!modoOffline) {

			var items = $(this).parentTo('tr').nextUntil('.title');
			items.each(function () {
				$(this).find('input[name="item[][horas_extras]"]').val(horas_extras).trigger('change').trigger('update');
			});
		}
	});

	console.timeEnd("check2");
	/*$('section.sheet').on('hover', 'button.profile.item', function(event) {
		$(this).tooltipster({
			delay: 0,
			interactiveAutoClose: false,
			contentAsHTML: true,
			content: function() {
				return $($(this).data('tooltip'));
			}
		});
	});
	
	$('section.sheet').on('mouseout', 'button.profile.item', function(event) {
		$(this).tooltipster('destroy');
	});*/

	console.time("check3");

	$('section.sheet').on('click', 'button.detail.argentina', function (event) {
		var element = $(this);

		const saveNvSica = (idnv, llave, temp_llave_nv, cantidad, dias, id_sica, subtotal, type) => {

			$.ajax({
				url: '/4DACTION/_force_setNVSica',
				data: {
					id_nv: idnv,
					cantidad: cantidad,
					dias: dias,
					id_sica: id_sica,
					subtotal,
					llave_nv: llave,
					llave_nv_temp: temp_llave_nv,
					type
				},
				dataType: 'json',
				async: false,
				cache: false,
				success: function (data) {
					let total = 0;
				}
			});
		}

		element.tooltipster({
			content: function () {

				let parentElement = element[0].parentNode.parentNode;

				let id_servicio = parentElement.dataset.producto !== "0" ?
					parentElement.dataset.producto :
					(parentElement.children[2].children[1].dataset.id !== undefined ?
						parentElement.children[2].children[1].dataset.id :
						parentElement.children[2].children[0].dataset.id);


				const id_nv = element[0].parentNode.parentNode.dataset.id

				const type_ = element[0].classList[2]
				let tipo_ = 0
				switch (type_) {
					case 'presupuesto': {
						tipo_ = 1
						break;
					}

					case 'previo': {
						tipo_ = 2
						break;
					}

					case 'actual': {
						tipo_ = 3
						break;
					}
				}

				const type_sica = tipo_

				//let idnv = $('section.sheet').data('id')
				let idnv = $('#main-container').data('id')
				//let temp_llave_nv = idnv + '' + element[0].parentNode.parentNode.children[2].children[1].value.substring(0, 5) + '' + id_servicio
				let llave_nv = element[0].parentNode.parentNode.dataset.id != undefined ? element[0].parentNode.parentNode.dataset.id : ''

				let temp_llave_nv = element[0].parentNode.parentNode.dataset.tempnvsica

				let sel = '<select class="my-1 mr-sm-2 form-control" id="select_version" style="margin-bottom: 20px!important; border: 1px solid #98A1B2;min-width: 180px;min-height: 30px;">'
				$.ajax({
					url: '/4DACTION/_light_getSicaVersion',
					dataType: 'json',
					async: false,
					cache: false,
					success: function (data) {
						let size = data.rows.length

						let cont = 1
						data.rows.forEach(v => {
							sel += `<option value="${v.id}" data-id="${v.id}" ${cont == data.rows.length ? 'selected' : ''}>${v.text}</option>`
							cont++
						})

					}
				});

				sel += '</select>'


				let htmlObject = `<div class="table-responsive" style="padding:10px;background-color:white;font-size: 10px;" class="lines-details-calculate">
				
					${sel}
				
				<table class="table table-striped">
					<thead style="background-color: #F9BD00"; color: white>
						<tr  height="30px" >		
							<th style="font-weight:bold; text-align: center;vertical-align:middle;" width="70px">Nombre</th>
							
							<th  style="font-weight:bold; text-align: center;vertical-align:middle;" width="70px">Cantidad</th>	

							<th  style="font-weight:bold; text-align: center;vertical-align:middle;" width="70px">Dias</th>	
										
							<th style="font-weight:bold; text-align: center;vertical-align:middle;" width="70px">Rate</th>
							
							<th  style="font-weight:bold; text-align: center;vertical-align:middle;" width="70px">Subtotal</th>

							<th  style="font-weight:bold; text-align: center;vertical-align:middle;" width="70px"></th>
							
						</tr>	
						
					</thead>				
				<tbody class="ui-selectable" id="table-data-sica">`;





				$.ajax({
					url: '/4DACTION/_light_getValoresSicaServicio',
					data: {
						id_servicio,
						id_nv: idnv,
						llave_nv: llave_nv,
						llave_nv_temp: temp_llave_nv,
						type: type_sica
					},
					dataType: 'json',
					async: false,
					cache: false,
					success: function (data) {
						let total = 0;
						let subtotal = 0;
						if (data.records.total > 0) {

							data.rows.forEach(val => {


								htmlObject += `<tr title="" height="20px" class="line-detail-calculate" data-id="${val.id}">
											<td style="color:#000000!important;margin: 10px;text-align: center;vertical-align:middle;">${val.nombre_valor}</td>
											<td style="color:#000000 !important;margin-right: 10px;text-align: center;vertical-align:middle;"><input type="text" class="text-center cantidad" value="${unaBase.utilities.transformNumber(val.cantidad, "int")}"></td>
											<td style="color:#000000 !important;margin-right: 10px;text-align: center;vertical-align:middle;"><input type="text" class="text-center cantidad" value="${val.dias}"></td>
											<td style="color:#000000 !important;margin-right: 10px;text-align: center;vertical-align:middle;" class="rate">${unaBase.utilities.transformNumber(val.rate, "int")}</td>
											<td style="color:#000000 !important;margin-right: 10px;text-align: center;vertical-align:middle;" class="subtotal">${unaBase.utilities.transformNumber(val.subtotal.replaceAll(',', '.'), "int")}</td>
											<td style="color:#000000 !important;margin-right: 10px;text-align: center;vertical-align:middle;"></i></td>
										</tr>`;

								total += parseFloat(val.rate);
								subtotal += parseFloat(val.subtotal)

							})




							htmlObject += `</tbody>
										<tfoot>
											<td style="color:#000000!important;margin: 10px;text-align: center;vertical-align:middle;"></td>
											<td style="color:#000000 !important;margin-right: 10px;text-align: center;vertical-align:middle;"></td>
											<td style="color:#000000 !important;margin-right: 10px;text-align: center;vertical-align:middle;"></td>
											<td style="color:#000000 !important;margin-right: 10px;text-align: center;vertical-align:middle;"></td>
											<td style="color:#000000 !important;margin-right: 10px;text-align: center;vertical-align:middle;  font-weight: bold; font-size: 15px;" class="lines-details-subtotal">${unaBase.utilities.transformNumber(subtotal, "int")}</td>
											<td style="color:#000000 !important;margin-right: 10px;text-align: center;vertical-align:middle;" class="apply">  
												<button type="button" class="btn btn-success apply" style="font-size: 0.8em">
													ASIGNAR
												</button>
												
												
											</td>
										</tfoot>
									</table>
								</div>`;


							htmlObject = $(htmlObject);

							const getValoresSica = (idversion, table) => {
								$.ajax({
									url: '/4DACTION/_light_getValoresSicaServicio',
									data: {
										id_servicio,
										id_nv: idnv,
										llave_nv: llave_nv,
										llave_nv_temp: temp_llave_nv,
										id_version: idversion,
										type: type_sica
									},
									dataType: 'json',
									async: false,
									cache: false,
									success: function (data) {
										if (data.records.total > 0) {
											let row = ''
											table[0].innerHTML = ''

											data.rows.forEach(val => {
												row += `<tr title="" height="20px" class="line-detail-calculate" data-id="${val.id}">
													<td style="color:#000000!important;margin: 10px;text-align: center;vertical-align:middle;">${val.nombre_valor}</td>
													<td style="color:#000000 !important;margin-right: 10px;text-align: center;vertical-align:middle;"><input type="text" class="text-center cantidad" value="${unaBase.utilities.transformNumber(val.cantidad, "int")}"></td>
													<td style="color:#000000 !important;margin-right: 10px;text-align: center;vertical-align:middle;"><input type="text" class="text-center cantidad" value="${val.dias}"></td>
													<td style="color:#000000 !important;margin-right: 10px;text-align: center;vertical-align:middle;" class="rate">${unaBase.utilities.transformNumber(val.rate, "int")}</td>
													<td style="color:#000000 !important;margin-right: 10px;text-align: center;vertical-align:middle;" class="subtotal">${unaBase.utilities.transformNumber(val.subtotal.replaceAll(',', '.'), "int")}</td>
													<td style="color:#000000 !important;margin-right: 10px;text-align: center;vertical-align:middle;"></i></td>
												</tr>`
											})

											table[0].innerHTML = row

											const changeInput = (event) => {
												let cantidad = event.target.parentNode.parentNode.children[1].firstElementChild.value
												let dias = event.target.parentNode.parentNode.children[2].firstElementChild.value
												let id_sica = event.target.parentNode.parentNode.dataset.id

												let subtotal = unaBase.utilities.transformNumber(unaBase.utilities.transformNumber(event.target.parentNode.parentNode.children[1].firstElementChild.value) * parseFloat(event.target.parentNode.parentNode.children[2].firstElementChild.value.replaceAll(',', '.')) * parseFloat(event.target.parentNode.parentNode.children[3].textContent.replaceAll('.', '')), "int");

												event.target.parentNode.parentNode.children[4].textContent = subtotal
												let c = 0;
												$('tr.line-detail-calculate td.subtotal').each(function (i, e) {
													c += unaBase.utilities.transformNumber(e.textContent)
												});
												$('td.lines-details-subtotal')[0].textContent = unaBase.utilities.transformNumber(c, "int");

												//saveNvSica(idnv, llave_nv, temp_llave_nv, cantidad, dias, id_sica, subtotal, type_sica)
											}

											table[0].querySelectorAll('td > input.cantidad').forEach(e => {
												e.addEventListener('change', (e) => changeInput(e))
											})

											let total = 0
											table[0].querySelectorAll('td.subtotal').forEach(e => {
												total += parseFloat(e.textContent.replaceAll('.', ''))
											})



											document.querySelector('.lines-details-subtotal').textContent = unaBase.utilities.transformNumber(total, "int")



										}
									}
								})
							}

							htmlObject.find('select#select_version').on("change", function (event) {
								let sel = event.target
								let id = sel.options[sel.selectedIndex].dataset.id
								let table = htmlObject.find('#table-data-sica')
								getValoresSica(id, table)

							})

							htmlObject.find('button.apply').on("click", function (event) {
								let subtotal = event.target.parentNode.parentNode.children[4].textContent
								//element[0].parentNode.parentNode.children[8].children[1].children[0].value = subtotal
								let type = element[0].classList[2]

								let input = ''
								if (type == 'presupuesto') {
									input = 'input[name="item[][precio_unitario]"]'
									element[0].parentNode.parentNode.querySelector(input).value = subtotal
								}

								if (type == 'previo') {
									input = 'input[name="item[][costo_unitario]"]'
									element[0].parentNode.parentNode.querySelector(input).value = subtotal
									//updateSubtotalItems()
								}

								let c_target = $(element[0].parentNode.parentNode.querySelector(input))

								c_target.data("old-value", subtotal)
								c_target.data("value", subtotal)
								c_target[0].dispatchEvent(new Event('blur'));
								let trs = event.target.parentNode.parentNode.parentNode.parentNode.querySelectorAll('tbody tr')
								let values = [];


								for (let i = 0; i < trs.length; i++) {
									let tds = trs[i].querySelectorAll('td'); // obtenemos todas las celdas de la fila
									if (tds.length > 2) { // aseguramos que haya al menos 3 celdas
										values.push({ idnv, llave_nv, temp_llave_nv, cantidad: tds[1].querySelector('input').value, dias: tds[2].querySelector('input').value, id_sica: trs[i].dataset.id, subtotal: tds[4].innerText, type_sica }); // tomamos el valor de la tercera columna
									}
								}

								if (values.length > 0) {
									values.forEach(v => {
										if (v.subtotal > 0) {

											saveNvSica(v.idnv, v.llave_nv, v.temp_llave_nv, v.cantidad, v.dias, v.id_sica, v.subtotal, v.type_sica)
										}
									})
								}


								toastr.success(
									"Valor asignado correctamente!"
								);


							});

							htmlObject.find('td > input.cantidad').on("change", function (event) {
								let cantidad = event.target.parentNode.parentNode.children[1].firstElementChild.value
								let dias = event.target.parentNode.parentNode.children[2].firstElementChild.value
								let id_sica = event.target.parentNode.parentNode.dataset.id

								let subtotal = unaBase.utilities.transformNumber(unaBase.utilities.transformNumber(event.target.parentNode.parentNode.children[1].firstElementChild.value) * parseFloat(event.target.parentNode.parentNode.children[2].firstElementChild.value.replaceAll(',', '.')) * parseFloat(event.target.parentNode.parentNode.children[3].textContent.replaceAll('.', '')), "int");

								event.target.parentNode.parentNode.children[4].textContent = subtotal
								let c = 0;
								$('tr.line-detail-calculate td.subtotal').each(function (i, e) {
									c += unaBase.utilities.transformNumber(e.textContent)
								});
								$('td.lines-details-subtotal')[0].textContent = unaBase.utilities.transformNumber(c, "int");

								//saveNvSica(idnv, llave_nv, temp_llave_nv, cantidad, dias, id_sica, subtotal, type_sica)


							});

						}



					}
				});

				return htmlObject;


			},
			interactive: true,
			autoClose: true,
			delay: 2000,
			contentAsHTML: true,
			onlyOne: true,
			position: 'top',
			interactiveTolerance: 1000,
			theme: 'tooltipster-punk',
			functionReady: function () {

			},
			functionAfter: function () {


			}
		});

		element.tooltipster('show');


		//$(this).load('/v3/views/negocios/compras_items.shtml?id=73937&detail=true')
	});


	

	// $('section.sheet').on('hover', 'button.detail.exchange-rate', function (event) {
	// 	var element = $(this);
	// 	$(this).tooltipster({
	// 		content: function () {
	// 			if (currency.code == 'CLP')
	// 				var htmlObject = $('\
	// 					<ul>																																													\
	// 						<li data-name="valor-clp">																																							\
	// 							<strong style="font-weight: bold; display: inline-block; width: 240px;">Precio en ' + currency.name + '</strong>																		\
	// 							<span class="numeric currency"><tt style="font-family: \'Droid Sans Mono\';">' + currency.code + '</tt> <span style="display: inline-block; width: 140px; text-align: right;"></span></span>		\
	// 						</li>																																						\
	// 						<li data-name="valor-usd">																																	\
	// 							<strong style="font-weight: bold; display: inline-block; width: 240px;">Precio en dólares</strong>																\
	// 							<span class="numeric currency"><tt style="font-family: \'Droid Sans Mono\';">USD</tt> <span style="display: inline-block; width: 140px; text-align: right;"></span></span>									\
	// 						</li>																																						\
	// 						<li data-name="valor-clf">																																	\
	// 							<strong style="font-weight: bold; display: inline-block; width: 240px;">Precio en UF</strong>																		\
	// 							<span class="numeric currency"><tt style="font-family: \'Droid Sans Mono\';">CLF</tt> <span style="display: inline-block; width: 140px; text-align: right;"></span></span>									\
	// 						</li>																																						\
	// 						<li data-name="exchange-rate-usd" style="border-top: 1px solid grey; margin-top: 10px; padding-top: 10px;">													\
	// 							<strong style="font-weight: bold; display: inline-block; width: 240px;">Tipo de cambio USD</strong>														\
	// 							<span class="numeric currency"><tt style="font-family: \'Droid Sans Mono\';">' + currency.code + '</tt> <span style="display: inline-block; width: 140px; text-align: right;"></span></span>									\
	// 						</li>																																						\
	// 						<li data-name="exchange-rate-clf">																															\
	// 							<strong style="font-weight: bold; display: inline-block; width: 240px;">Tipo de cambio CLFF</strong>														\
	// 							<span class="numeric currency"><tt style="font-family: \'Droid Sans Mono\';">' + currency.code + '</tt> <span style="display: inline-block; width: 140px; text-align: right;"></span></span>									\
	// 						</li>																																						\
	// 					</ul>																																							\
	// 				');
	// 			else
	// 				var htmlObject = $('\
	// 					<ul>																																													\
	// 						<li data-name="valor-clp">																																							\
	// 							<strong style="font-weight: bold; display: inline-block; width: 240px;">Precio en ' + currency.name + '</strong>																		\
	// 							<span class="numeric currency"><tt style="font-family: \'Droid Sans Mono\';">' + currency.code + '</tt> <span style="display: inline-block; width: 140px; text-align: right;"></span></span>		\
	// 						</li>																																						\
	// 						<li data-name="valor-usd">																																	\
	// 							<strong style="font-weight: bold; display: inline-block; width: 240px;">Precio en dólares</strong>																\
	// 							<span class="numeric currency"><tt style="font-family: \'Droid Sans Mono\';">USD</tt> <span style="display: inline-block; width: 140px; text-align: right;"></span></span>									\
	// 						</li>																																						\
	// 						<li data-name="exchange-rate-usd" style="border-top: 1px solid grey; margin-top: 10px; padding-top: 10px;">													\
	// 							<strong style="font-weight: bold; display: inline-block; width: 240px;">Tipo de cambio USD</strong>														\
	// 							<span class="numeric currency"><tt style="font-family: \'Droid Sans Mono\';">' + currency.code + '</tt> <span style="display: inline-block; width: 140px; text-align: right;"></span></span>									\
	// 						</li>																																						\
	// 					</ul>																																							\
	// 				');

	// 			var row = element.parentTo('tr');

	// 			var total = parseFloat(row.find('input[name="item[][subtotal_precio]"]').val());

	// 			htmlObject.find('li[data-name="valor-clp"] > span > span').text(total.toFixed(currency.decimals).replace(/\./g, ',')).number(true, currency.decimals, ',', '.');

	// 			var exchange_rate_usd = (valor_usd_cotizacion > 0) ? valor_usd_cotizacion : valor_usd;
	// 			var exchange_rate_clf = (valor_clf_cotizacion > 0) ? valor_clf_cotizacion : valor_clf;

	// 			htmlObject.find('li[data-name="valor-usd"] > span > span').text((total / exchange_rate_usd).toFixed(2).replace(/\./g, ',')).number(true, 2, ',', '.');
	// 			htmlObject.find('li[data-name="valor-clf"] > span > span').text((total / exchange_rate_clf).toFixed(2).replace(/\./g, ',')).number(true, 2, ',', '.');

	// 			htmlObject.find('li[data-name="exchange-rate-usd"] > span > span').text((parseFloat(exchange_rate_usd)).toFixed(2).replace(/\./g, ',')).number(true, 2, ',', '.');
	// 			htmlObject.find('li[data-name="exchange-rate-clf"] > span > span').text((parseFloat(exchange_rate_clf)).toFixed(2).replace(/\./g, ',')).number(true, 2, ',', '.');

	// 			htmlObject.find('span.numeric.percent > span').number(true, 2, ',', '.');

	// 			return htmlObject;
	// 		},
	// 		interactive: true,
	// 		trigger: '',
	// 		delay: 0,
	// 		interactiveAutoClose: true
	// 	});
	// 	$(this).tooltipster('show');
	// });


	$('section.sheet').on('hover', 'button.detail.exchange-rate', function (event) {
		var element = $(this);
		$(this).tooltipster({
			content: function () {
				let idnv = $('section.sheet').data('id')
				let htmlObject = '<ul>'
				$.ajax({
					url: '/4DACTION/_force_getTipoCambioByNv',
					dataType: 'json',
					data: {
						id_nv: idnv
					},
					async: false,
					cache: false,
					success: function (data) {
						var row = element.parentTo('tr');
						var total = parseFloat(row.find('input[name="item[][subtotal_precio]"]').val());
						let curr = document.querySelector('#simbol_code').dataset.simbol
						// Buscar el índice del objeto que tenga el mismo valor de curr
						const index = data.row.findIndex((obj) => obj.codigo === curr);
						let newArray = data.row.filter(obj => obj.codigo === curr);

						htmlObject += `<li data-name="valor-clp">																																							
							<strong style="font-weight: bold; display: inline-block; width: 240px;font-family: 'Calibri'">Precio en ${newArray[0].nombre}</strong>																		
							<span class="numeric currency">${curr} <span style="display: inline-block; width: 140px; text-align: right; font-family: 'Calibri'">${unaBase.utilities.transformNumber(total, 'int')}</span></span>		
						</li>`

						let res_conv = total * parseFloat(newArray[0].value.replace(',', '.'))
						data.row.splice(index, 1)

						data.row.forEach(v => {
							let value = parseFloat(v.value.replace(',', '.'))
							let res = v.codigo === currency.code ? total * value : res_conv / value
							if (v.codigo === currency.code) {
								htmlObject += `<li>																																	
										<strong style="font-weight: bold; display: inline-block; width: 240px; font-family: 'Calibri'">Precio en ${v.nombre} (${v.value})</strong>																
										<span class="numeric currency">${v.codigo}<span style="display: inline-block; width: 140px; text-align: right; font-family: 'Calibri'">${unaBase.utilities.transformNumber(Math.round(res_conv), 'int')}</span></span>									
									</li>`
							} else {
								htmlObject += `<li>																																	
									<strong style="font-weight: bold; display: inline-block; width: 240px; font-family: 'Calibri'">Precio en ${v.nombre} (${v.value})</strong>																
									<span class="numeric currency">${v.codigo}<span style="display: inline-block; width: 140px; text-align: right; font-family: 'Calibri'">${unaBase.utilities.transformNumber(Math.round(res), 'int')}</span></span>									
								</li>`

							}



						})


						htmlObject += `</ul>`
						htmlObject = $(htmlObject);




					},
					error: function (err) {
						console.log('ERROR' + err)
					}
				});



				return htmlObject;
			},
			interactive: true,
			trigger: '',
			delay: 0,
			interactiveAutoClose: true
		});
		$(this).tooltipster('show');
	});

	$('section.sheet').on('mouseout', 'button.detail.exchange-rate', function (event) {
		$(this).tooltipster('destroy');
	});


	$('section.sheet').on('hover', 'button.detail.cost', function (event) {
		var element = $(this);
		$(this).tooltipster({
			content: function () {
				var htmlObject = $('\
				<ul>																																																						\
					<li data-name="costo-presupuestado-externo">																																											\
						<strong style="font-weight: bold; display: inline-block; width: 350px;">Gasto P. externo</strong>																													\
						<span class="numeric currency">' + localCurrency + ' <span style="display: inline-block; width: 100px; text-align: right;"></span></span>																								\
					</li>																																																					\
					<li data-name="costo-presupuestado-interno">																																											\
						<strong style="font-weight: bold; display: inline-block; width: 350px;">Gasto P. interno (<span class="numeric"></span> HH &times; <span class="numeric currency">$ <span></span></span>: <span></span>)</strong>	\
						<span class="numeric currency">' + localCurrency + ' <span style="display: inline-block; width: 100px; text-align: right;"></span></span>																								\
					</li>																																																					\
					<li data-name="total" style="border-top: 1px solid grey; margin-top: 10px; padding-top: 10px;">																															\
						<strong style="font-weight: bold; display: inline-block; width: 350px;">Total</strong>																																\
						<span class="numeric currency">' + localCurrency + ' <span style="display: inline-block; width: 100px; text-align: right;"></span></span>																								\
					</li>																																																					\
				</ul>																																																						\
			');

				var row = element.parentTo('tr');

				var total = parseFloat(row.find('input[name="item[][subtotal_costo]"]').val());
				var hh_cantidad = row.data('costo-presupuestado-hh-cantidad');
				var hh_valor = row.data('costo-presupuestado-hh-valor');
				var hh_username = row.data('costo-presupuestado-hh-username');
				var costo_presupuestado_interno = hh_cantidad * hh_valor;
				var costo_presupuestado_externo = total - costo_presupuestado_interno;

				if (typeof selected_currency == 'undefined')
					htmlObject.find('li[data-name="costo-presupuestado-externo"] > span > span').text(costo_presupuestado_externo.toFixed(currency.decimals));
				else
					htmlObject.find('li[data-name="costo-presupuestado-externo"] > span > span').text(costo_presupuestado_externo.toFixed(2));

				htmlObject.find('li[data-name="costo-presupuestado-interno"] > strong span:nth-of-type(1)').text(hh_cantidad.toFixed(currency.decimals));
				if (typeof selected_currency == 'undefined')
					htmlObject.find('li[data-name="costo-presupuestado-interno"] > strong span:nth-of-type(2) > span').text(hh_valor.toFixed(currency.decimals));
				else
					htmlObject.find('li[data-name="costo-presupuestado-interno"] > strong span:nth-of-type(2) > span').text(hh_valor.toFixed(2));
				htmlObject.find('li[data-name="costo-presupuestado-interno"] > strong span:nth-of-type(3)').text(hh_username);
				if (typeof selected_currency == 'undefined')
					htmlObject.find('li[data-name="costo-presupuestado-interno"] > span > span').text(costo_presupuestado_interno.toFixed(currency.decimals));
				else
					htmlObject.find('li[data-name="costo-presupuestado-interno"] > span > span').text(costo_presupuestado_interno.toFixed(2));

				if (typeof selected_currency == 'undefined')
					htmlObject.find('li[data-name="total"] > span > span').text(total.toFixed(currency.decimals));
				else
					htmlObject.find('li[data-name="total"] > span > span').text(total.toFixed(2));

				htmlObject.find('span.numeric.percent > span').number(true, 2, ',', '.');
				if (typeof selected_currency == 'undefined')
					htmlObject.find('span.numeric.currency > span').number(true, currency.decimals, ',', '.');
				else
					htmlObject.find('span.numeric.currency > span').number(true, 2, ',', '.');


				return htmlObject;
			},
			interactive: true,
			trigger: '',
			delay: 0,
			interactiveAutoClose: true
		});
		$(this).tooltipster('show');
	});

	$('section.sheet').on('mouseout', 'button.detail.cost', function (event) {
		$(this).tooltipster('destroy');
	});

	$('section.sheet table.items > tfoot > tr > th.info').bind('refresh', function () {
		var items = $('section.sheet table.items > tbody > tr:not(.title)').length;
		$('section.sheet table.items > tfoot > tr > th.info').html(items + ' ítem' + ((items > 1) ? 's' : ''));
	});

	$('section.sheet table.items').on('change', '> tbody > tr:not(.title) > td input[name="item[][costo_interno]"]', function (event) {

		$(this).parentTo('tr').find('> td input[name="item[][subtotal_costo]"]').trigger('refresh');
	});

	$('section.sheet table.items').on('refresh', '> tbody > tr:not(.title) > td input[name="item[][subtotal_costo]"]', function (event) {
		var row = $(this).parentTo('tr');

		if (row.find('> td input[name="item[][costo_interno]"]').prop('checked')) {
			if (row.data('costo-presupuestado-hh-cantidad') > 0 && row.data('costo-presupuestado-hh-valor') > 0)
				row.find('button.detail.cost').visible();

			if (!$(this).hasClass('edited')) {
				var row = $(this).parentTo('tr');

				var costo_externo = parseFloat($(this).val());
				var costo_interno = row.data('costo-presupuestado-hh-cantidad') * row.data('costo-presupuestado-hh-valor');

				$(this).val(costo_externo + costo_interno);
				$(this).addClass('edited');
			}
		} else {
			row.find('button.detail.cost').invisible();

			if ($(this).hasClass('edited')) {
				var row = $(this).parentTo('tr');
				var costo_interno = row.data('costo-presupuestado-hh-cantidad') * row.data('costo-presupuestado-hh-valor');
				var costo_total = parseFloat($(this).val());

				$(this).val(costo_total - costo_interno);
				$(this).removeClass('edited');
			}
		}


		// if ($(event.target).closest('tr').data('first-load') !== true)
		updateRow(event);

	});

	$('section.sheet table.items > thead > tr > th > input[name="item[][costo_interno]"]').change(function () {
		if ($(this).prop('checked')) {
			$('section.sheet table.items > tbody > tr:not(.title)').each(function () {
				$(this).find('input[name="item[][costo_interno]"]:not(:checked)').prop('checked', true).trigger('change');
			});
		} else {
			$('section.sheet table.items > tbody > tr:not(.title)').each(function () {
				$(this).find('input[name="item[][costo_interno]"]:checked').prop('checked', false).trigger('change');
			});
		}
	});

	// begin edit -- gin (21.10.15)
	$('section.sheet table.items > thead > tr > th > input[name="item[][ocultar_print]"]').change(function () {
		if ($(this).prop('checked')) {
			$('section.sheet table.items > tbody > tr').each(function () {
				const subTotal = $(this).find('input[name="item[][subtotal_precio]"]')
				if (subTotal && subTotal.val() > 0) {
					$(this).find('input[name="item[][ocultar_print]"]:checked').prop('checked', false);
				} else {
					$(this).find('input[name="item[][ocultar_print]"]:not(:checked)').prop('checked', true);
					$(this).find('input[name="item[][precio_unitario]"]').prop('disabled', true);
					$(this).find('input[name="item[][cantidad]"]').prop('disabled', true);
					$(this).find('input[name="item[][factor]"]').prop('disabled', true);
				}
			});
		} else {
			$('section.sheet table.items > tbody > tr').each(function () {
				$(this).find('input[name="item[][ocultar_print]"]:checked').prop('checked', false);
				$(this).find('input[name="item[][precio_unitario]"]').prop('disabled', false);
				$(this).find('input[name="item[][cantidad]"]').prop('disabled', false);
				$(this).find('input[name="item[][factor]"]').prop('disabled', false);
			});
		}
	});

	$('#main-container').on('change', 'table.items.cotizacion tr.title input[name="item[][ocultar_print]"]', function (event) {
		var titulo = $(event.target).closest('tr');
		if ($(event.target).prop('checked')) {
			titulo.nextUntil("tr.title").find('input[name="item[][ocultar_print]"]:not(:checked)').prop('checked', true);
		} else {
			titulo.nextUntil("tr.title").find('input[name="item[][ocultar_print]"]:checked').prop('checked', false);
		}
	});

	$('#main-container').on('change', 'table.items.cotizacion tr:not(.title) input[name="item[][ocultar_print]"]', function (event) {

		const checkbox = $(event.target);
		const checked = checkbox.prop('checked');
		const tr = checkbox.closest('tr');
		const subTotal = parseFloat(tr.find('input[name="item[][subtotal_precio]"]').val());

		const cantidad = tr.find('input[name="item[][cantidad]"]');
		const dias = tr.find('input[name="item[][factor]"]');
		const precio_unitario = tr.find('input[name="item[][precio_unitario]"]');

		if (checked && subTotal > 0) {
			const mensaje = 'El ítem seleccionado tiene costo unitario mayor a cero.<br>Al imprimir producirá diferencias en los totales.<br><br>Por eso no puede ocultarlo.';
			alert(mensaje);
			checkbox.prop('checked', false);
			cantidad.prop('disabled', false);
			dias.prop('disabled', false);
			precio_unitario.prop('disabled', false);
		}
		if (checked && subTotal === 0) {
			cantidad.prop('disabled', true);
			dias.prop('disabled', true);
			precio_unitario.prop('disabled', true);
		}
		if (!checked) {
			cantidad.prop('disabled', false);
			dias.prop('disabled', false);
			precio_unitario.prop('disabled', false);
		}

	});
	// end edit

	// Confirmar al cambiar check sobrecargo, en caso que afecte los montos
	$('#main-container').on('change', 'table.items.cotizacion tr:not(.title) input[name="item[][aplica_sobrecargo]"]', function (event) {
		confirm("¿Está seguro de modificar el ítem afecto a comisión?<br>-Esto podría cambiar los valores totales.<br><br><label><input type=\"checkbox\" name=\"edit_aplica_sobrecargo_remember\"> No volver a preguntar para esta cotización</label>", 'Sí', 'No').done(function (data) {
			if (!data) {
				var isChecked = $(event.target).prop('checked');
				$(event.target).prop('checked', !isChecked);
				$(event.target).closest('tr').find('[name="item[][precio_unitario]"]').trigger('focus').trigger('blur');
			}
			if ($('[name="edit_aplica_sobrecargo_remember"]').is(':checked')) {
				$('table.items.cotizacion').data('edit-aplica-sobrecargo-remember', true);
			}
		}).fail(function () {
			var isChecked = $(event.target).prop('checked');
			$(event.target).prop('checked', !isChecked);
			$(event.target).closest('tr').find('[name="item[][precio_unitario]"]').trigger('focus').trigger('blur');
		});

	});

	$('input[name="cotizacion[ver_solo_items_usados]"]').on('change', updateVistaItems);

	$('section.sheet').on('hover', 'button.detail.total', function (event) {
		var element = $(this);
		$(this).tooltipster({
			content: function () {
				var exchange_rate_usd = (valor_usd_cotizacion > 0) ? valor_usd_cotizacion : valor_usd;
				var exchange_rate_clf = (valor_clf_cotizacion > 0) ? valor_clf_cotizacion : valor_clf;

				let idnv = $('section.sheet').data('id')
				let htmlObject = '<ul>'
				$.ajax({
					url: '/4DACTION/_force_getTipoCambioByNv',
					dataType: 'json',
					data: {
						id_nv: idnv
					},
					async: false,
					cache: false,
					success: function (data) {
						var row = element.parentTo('tr');
						var total = parseFloat($('[name="cotizacion[ajuste]"]').val());


						let curr = document.querySelector('#simbol_code').dataset.simbol
						// Buscar el índice del objeto que tenga el mismo valor de curr
						const index = data.row.findIndex((obj) => obj.codigo === curr);
						let newArray = data.row.filter(obj => obj.codigo === curr);

						htmlObject += `<li data-name="valor-clp">																																							
							<strong style="font-weight: bold; display: inline-block; width: 240px;font-family: 'Calibri'">Precio en ${newArray[0].nombre}</strong>																		
							<span class="numeric currency">${curr} <span style="display: inline-block; width: 140px; text-align: right; font-family: 'Calibri'">${unaBase.utilities.transformNumber(total, 'int')}</span></span>		
						</li>`

						let res_conv = total * parseFloat(newArray[0].value.replace(',', '.'))
						data.row.splice(index, 1)

						data.row.forEach(v => {
							let value = parseFloat(v.value.replace(',', '.'))
							let res = v.codigo === currency.code ? total * value : res_conv / value
							if (v.codigo === currency.code) {
								htmlObject += `<li>																																	
						<strong style="font-weight: bold; display: inline-block; width: 240px; font-family: 'Calibri'">Precio en ${v.nombre} (${v.value})</strong>																
						<span class="numeric currency">${v.codigo}<span style="display: inline-block; width: 140px; text-align: right; font-family: 'Calibri'">${unaBase.utilities.transformNumber(Math.round(res_conv), 'int')}</span></span>									
					</li>`
							} else {
								htmlObject += `<li>																																	
							<strong style="font-weight: bold; display: inline-block; width: 240px; font-family: 'Calibri'">Precio en ${v.nombre} (${v.value})</strong>																
							<span class="numeric currency">${v.codigo}<span style="display: inline-block; width: 140px; text-align: right; font-family: 'Calibri'">${unaBase.utilities.transformNumber(Math.round(res), 'int')}</span></span>									
						</li>`

							}



						})

						htmlObject += `</ul>`
						htmlObject = $(htmlObject);
					},
					error: function (err) {

					}
				});






				// var htmlObject = $('\
				//     <ul>																																				\
				//         <li data-name="valor-usd">																										        		\
				//             <strong style="font-weight: bold; display: inline-block; width: 140px;">Valor en dólares</strong>											\
				//             <span class="numeric currency">USD <span style="display: inline-block; width: 100px; text-align: right;"></span></span>						\
				//         </li>																																			\
				//     </ul>																																				\
				// ');

				// // Valor en dólares
				// htmlObject.find('li[data-name="valor-usd"] span.currency span').text((total_a_cliente / exchange_rate_usd).toFixed(2).replace(/\./g, ',') + ')');

				// htmlObject.find('span.numeric.percent > span').number(true, 2, ',', '.');

				// htmlObject.find('span.numeric.currency > span').number(true, 2, ',', '.'); // usd


				return htmlObject;
			},
			interactive: true,
			trigger: '',
			delay: 0,
			interactiveAutoClose: true
		});
		$(this).tooltipster('show');
	});

	$('section.sheet').on('mouseout', 'button.detail.total', function (event) {
		$(this).tooltipster('destroy');
	});

	if ($('section.sheet').data('index') > 0)
		contentLoaded = true;


	// Logs tiempo real

	var logBeforeAction = function (event) {
		var currentElement = $(event.target).closest('tr');
		var isTitle = currentElement.hasClass('title');
		currentElement.uniqueId();
		var id_categoria = 0
		var key = parseInt(currentElement.prop('id').substring(6));
		var log = $('#main-container').data('realtime-log');
		if (isTitle) {
			id_categoria = key;
			var nombre_categoria = currentElement.find('[name="item[][nombre]"]').val();
		} else {
			currentElement.prevTo('tr.title').uniqueId();
			id_categoria = parseInt(currentElement.prevTo('tr.title').prop('id')?.substring(6));
			var nombre_categoria = currentElement.prevTo('tr.title').find('[name="item[][nombre]"]').val();
		}
		log = (typeof log == 'undefined') ? [] : log;
		let newElement;
		if (log[key] == undefined) {
			log[key] = [];
			if (currentElement.serializeAnything() != '' && currentElement.find('[name="item[][nombre]"]').val() != '') {
				newElement = {
					"item[][nombre]": currentElement.find('[name="item[][nombre]"]').val(),
					"item[][utilidad]": currentElement.find('[name="item[][utilidad]"]').val(),
					"item[][subtotal_precio]": currentElement.find('[name="item[][subtotal_precio]"]').val(),
					"item[][subtotal_costo]": currentElement.find('[name="item[][subtotal_costo]"]').val(),
					"item[][precio_unitario]": currentElement.find('[name="item[][precio_unitario]"]').val(),
					"item[][margen_venta]": currentElement.find('[name="item[][margen_venta]"]').val(),
					"item[][margen_compra]": currentElement.find('[name="item[][margen_compra]"]').val(),
					"item[][horas_extras]": currentElement.find('[name="item[][horas_extras]"]').val(),
					"item[][factor]": currentElement.find('[name="item[][factor]"]').val(),
					"item[][costo_unitario]": currentElement.find('[name="item[][costo_unitario]"]').val(),
					"item[][codigo]": currentElement.find('[name="item[][codigo]"]').val(),
					"item[][cantidad]": currentElement.find('[name="item[][cantidad]"]').val()

				}
				var isCloned = (event.type == 'beforeClone');
				// var testCompare = JSON.parse('{ "item[][tipo_documento]": "' + currentElement.find('[name="item[][tipo_documento]"]').val() + '", "observacion": "' + escape(currentElement.data('observacion')) + '", "comentario": "' + escape(currentElement.data('comentario')) + '", "item[][aplica_sobrecargo]": ' + (currentElement.find('[name="item[][aplica_sobrecargo]"]').is(':checked')? 'true' : 'false' ) + ', "item[][costo_interno]": ' + (currentElement.find('[name="item[][costo_interno]"]').is(':checked')? 'true' : 'false' ) + ', "item[][ocultar_print]": ' + (currentElement.find('[name="item[][ocultar_print]"]').is(':checked')? 'true' : 'false' ) + ', "item[][mostrar_carta_cliente]": ' + (currentElement.find('[name="item[][mostrar_carta_cliente]"]').is(':checked')? 'true' : 'false' ) + ', "dragged": ' + (event.type == 'beforeMove'? 'true' : 'false') + ', "cloned": ' + (isCloned? 'true' : 'false') + ', "categoria": { "id": ' + id_categoria + ', "nombre": "' + escape(nombre_categoria) + '"  }, "title": ' + (isTitle? 'true' : 'false') + ', "' + decodeURI(currentElement.serializeAnything().replace(/&/g, "\",\"").replace(/=/g,"\":\"")) + '"}');

				log[key]['old'] = JSON.parse(`{ "item[][tipo_documento]": "${currentElement.find('[name="item[][tipo_documento]"]').val()}", "observacion": "${escape(currentElement.data('observacion'))}", "comentario": "${escape(currentElement.data('comentario'))}", "item[][aplica_sobrecargo]": ${(currentElement.find('[name="item[][aplica_sobrecargo]"]').is(':checked') ? 'true' : 'false')}, "item[][costo_interno]": ${(currentElement.find('[name="item[][costo_interno]"]').is(':checked') ? 'true' : 'false')}, "item[][ocultar_print]": ${(currentElement.find('[name="item[][ocultar_print]"]').is(':checked') ? 'true' : 'false')}, "item[][mostrar_carta_cliente]": ${(currentElement.find('[name="item[][mostrar_carta_cliente]"]').is(':checked') ? 'true' : 'false')}, "dragged": ${(event.type == 'beforeMove' ? 'true' : 'false')}, "cloned": ${(isCloned ? 'true' : 'false')}, "categoria": { "id": ${id_categoria}, "nombre": "${escape(nombre_categoria)}"  }, "title": ${(isTitle ? 'true' : 'false')}}`);
				Object.assign(log[key]['old'], newElement);
			}
			// console.log('//////');
			// // console.log(log[key]['old'] == testCompare);
			// console.log( isEquivalent(log[key]['old'], testCompare) );
			// console.log(log[key]['old'] );
			// console.log('//////');
			// console.log(decodeURI(currentElement.serializeAnything().replace(/&/g, "\",\"").replace(/=/g,"\":\"")) );
		}
		$('#main-container').data('realtime-log', log);
	};

	var logAfterAction = function (event) {
		var currentElement = $(event.target).closest('tr');
		var isTitle = currentElement.hasClass('title');
		currentElement.uniqueId();
		var key = parseInt(currentElement.prop('id').substring(6));
		var log = $('#main-container').data('realtime-log');
		if (isTitle) {
			var id_categoria = key;
			var nombre_categoria = currentElement.find('[name="item[][nombre]"]').val();
		} else {
			currentElement.prevTo('tr.title').uniqueId();
			var id_categoria = parseInt(currentElement.prevTo('tr.title').prop('id').substring(6));
			var nombre_categoria = currentElement.prevTo('tr.title').find('[name="item[][nombre]"]').val();
		}
		let newElement;
		log = (typeof log == 'undefined') ? [] : log;
		if (log[key] == undefined) {
			log[key] = [];
		}

		newElement = {
			"item[][nombre]": currentElement.find('[name="item[][nombre]"]').val(),
			"item[][utilidad]": currentElement.find('[name="item[][utilidad]"]').val(),
			"item[][subtotal_precio]": currentElement.find('[name="item[][subtotal_precio]"]').val(),
			"item[][subtotal_costo]": currentElement.find('[name="item[][subtotal_costo]"]').val(),
			"item[][precio_unitario]": currentElement.find('[name="item[][precio_unitario]"]').val(),
			"item[][margen_venta]": currentElement.find('[name="item[][margen_venta]"]').val(),
			"item[][margen_compra]": currentElement.find('[name="item[][margen_compra]"]').val(),
			"item[][horas_extras]": currentElement.find('[name="item[][horas_extras]"]').val(),
			"item[][factor]": currentElement.find('[name="item[][factor]"]').val(),
			"item[][costo_unitario]": currentElement.find('[name="item[][costo_unitario]"]').val(),
			"item[][codigo]": currentElement.find('[name="item[][codigo]"]').val(),
			"item[][cantidad]": currentElement.find('[name="item[][cantidad]"]').val()

		}
		// if ($(event.target).closest('tr').serializeAnything() != '') {
		//           var isCloned = (event.type != 'afterClone' && log[key] && log[key]['new'] && log[key]['new']['cloned']? log[key]['new']['cloned'] : event.type == 'afterClone');
		//           log[key]['new'] = JSON.parse('{ "item[][tipo_documento]": "' + currentElement.find('[name="item[][tipo_documento]"]').val() + '","observacion": "' + escape(currentElement.data('observacion')) + '", "comentario": "' + escape(currentElement.data('comentario')) + '", "item[][aplica_sobrecargo]": ' + (currentElement.find('[name="item[][aplica_sobrecargo]"]').is(':checked')? 'true' : 'false' ) + ', "item[][costo_interno]": ' + (currentElement.find('[name="item[][costo_interno]"]').is(':checked')? 'true' : 'false' ) + ', "item[][ocultar_print]": ' + (currentElement.find('[name="item[][ocultar_print]"]').is(':checked')? 'true' : 'false' ) + ', "item[][mostrar_carta_cliente]": ' + (currentElement.find('[name="item[][mostrar_carta_cliente]"]').is(':checked')? 'true' : 'false' ) + ', "dropped": ' + (event.type == 'afterMove'? 'true' : 'false') + ', "cloned": ' + (isCloned? 'true' : 'false') + ', "categoria": { "id": ' + id_categoria + ', "nombre": "' + escape(nombre_categoria) + '"  }, "title": ' + (isTitle? 'true' : 'false') + ', "' + decodeURI(currentElement.serializeAnything().replace(/&/g, "\",\"").replace(/=/g,"\":\"")) + '"}');
		// }
		if ($(event.target).closest('tr').serializeAnything() != '') {
			var isCloned = (event.type != 'afterClone' && log[key] && log[key]['new'] && log[key]['new']['cloned'] ? log[key]['new']['cloned'] : event.type == 'afterClone');
			log[key]['new'] = JSON.parse('{ "item[][tipo_documento]": "' + currentElement.find('[name="item[][tipo_documento]"]').val() + '","observacion": "' + escape(currentElement.data('observacion')) + '", "comentario": "' + escape(currentElement.data('comentario')) + '", "item[][aplica_sobrecargo]": ' + (currentElement.find('[name="item[][aplica_sobrecargo]"]').is(':checked') ? 'true' : 'false') + ', "item[][costo_interno]": ' + (currentElement.find('[name="item[][costo_interno]"]').is(':checked') ? 'true' : 'false') + ', "item[][ocultar_print]": ' + (currentElement.find('[name="item[][ocultar_print]"]').is(':checked') ? 'true' : 'false') + ', "item[][mostrar_carta_cliente]": ' + (currentElement.find('[name="item[][mostrar_carta_cliente]"]').is(':checked') ? 'true' : 'false') + ', "dropped": ' + (event.type == 'afterMove' ? 'true' : 'false') + ', "cloned": ' + (isCloned ? 'true' : 'false') + ', "categoria": { "id": ' + id_categoria + ', "nombre": "' + escape(nombre_categoria) + '"  }, "title": ' + (isTitle ? 'true' : 'false') + '}');
			Object.assign(log[key]['new'], newElement);
		}

		$('#main-container').data('realtime-log', log);
	};

	$('table.items.cotizacion').on('focus', 'tbody th input, tbody td input', logBeforeAction);
	$('table.items.cotizacion').on('beforeMove beforeRemove beforeClone beforeUpdate', 'tbody tr', logBeforeAction);

	$('table.items.cotizacion').on('blur', 'tbody th input, tbody td input', logAfterAction);
	$('table.items.cotizacion').on('afterMove afterRemove afterUpdate afterClone', 'tbody tr', logAfterAction);

	console.timeEnd("check3");

});
