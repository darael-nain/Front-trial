if (typeof selected_currency == 'undefined')
	var localCurrency = currency.symbol;
else {
	var localCurrency = selected_currency;
}

$(document).ready(function() {

		console.warn('editor_cinamagica.js from script/startup');
	if (access._605) {
		$('tfoot [name="cotizacion[precios][subtotal]"]').hide();
		$('tfoot [name="cotizacion[cinemagica][costos_directos]"]').show();
		$('tfoot [name="cotizacion[costos][subtotal]"]').hide();
		$('tfoot [name="cotizacion[costos][subtotal_directo]"]').show();
		$('tfoot [name="cotizacion[utilidades][subtotal]"]').hide();
		$('tfoot [name="cotizacion[utilidades][subtotal_directo]"]').show();
		$('tfoot [name="cotizacion[margenes][margen_venta]"]').hide();
		$('tfoot [name="cotizacion[margenes][margen_venta_directo]"]').show();
		$('tfoot [name="cotizacion[margenes][margen_compra]"]').hide();
		$('tfoot [name="cotizacion[margenes][margen_compra_directo]"]').show();
	}

		if (typeof selected_currency == 'undefined') {
		$('section.sheet').find('tfoot .numeric.currency input').number(true, currency.decimals, ',', '.');
		$('section.sheet').find('footer section:not(.sobrecargos)  .numeric.currency input').number(true, currency.decimals, ',', '.');
	} else {
		$('section.sheet').find('tfoot .numeric.currency input').number(true, 6, ',', '.');
		$('section.sheet').find('footersection:not(.sobrecargos)  .numeric.currency input').number(true, 6, ',', '.');
	}

	$('section.sheet').find('tfoot .numeric.percent input') .number(true, 6, ',', '.');
	//$('section.sheet').find('footer section:not(.cinemagica) section:not(.sobrecargos)  .numeric.percent input:not([name="cotizacion[descuento][porcentaje]"])').number(true, 2, ',', '.');
$('section.sheet').find('footer section:not(.sobrecargos)   .numeric.percent input:not([name="cotizacion[descuento][porcentaje]"])').number(true, 6, ',', '.');

	$('section.sheet table > thead button.toggle.all').click(function() {
		if ($(this).hasClass('ui-icon-folder-open')) {
			$(this).removeClass('ui-icon-folder-open');
			$(this).addClass('ui-icon-folder-collapsed');
			$(this).attr('title', 'Contraer todo');
			$('section.sheet table > tbody > tr.title button.toggle.categoria.ui-icon-folder-open').each(function(key, element) {
				$(element).trigger('click');
			});
		} else {
			$(this).removeClass('ui-icon-folder-collapsed');
			$(this).addClass('ui-icon-folder-open');
			$(this).attr('title', 'Expandir todo');
			$('section.sheet table > tbody > tr.title button.toggle.categoria.ui-icon-folder-collapsed').each(function(key, element) {
				$(element).trigger('click');
			});
		}
	});

	$('section.sheet table').on('click', 'tbody tr.title button.toggle.categoria', function() {
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
			target.parentTo('tr').find('.info:eq(0)').html(titles.length + '&nbsp;ítem' + ((titles.length > 1)? 's' : ''));

			var total = 0;
			$('section.sheet table.items > tbody > tr.title').each(function() {
				total+= parseFloat($(this).find('input[name="item[][subtotal_precio]"]').val());
			});
			var subtotal = parseFloat(target.parentTo('tr').find('input[name="item[][subtotal_precio]"]').val());
			var ratio = (total > 0)? subtotal / total : 0;
			target.parentTo('tr').find('.info:eq(1)').html((ratio * 100).toFixed(2) + '%');

		}
		$('#tabs-2').trigger('scroll');
	});

	$('section.sheet table').on('click', 'tbody tr.itemParent button.toggle.categoria', function() {
		
		var target = $(this);

		var collapsed = target.hasClass('ui-icon-folder-collapsed');

		if (collapsed)
			target.removeClass('ui-icon-folder-collapsed').addClass('ui-icon-folder-open');
		else
			target.removeClass('ui-icon-folder-open').addClass('ui-icon-folder-collapsed');

		var titles = target.parentTo('tr').nextUntil('.title,.itemParent,:not(.childItem)');

		if (collapsed) {
			titles.removeClass('collapsed');
			target.parentTo('tr').find('.info:eq(0)').html('');
			target.parentTo('tr').find('.info:eq(1)').html('');

		} else {
			titles.addClass('collapsed');
			target.parentTo('tr').find('.info:eq(0)').html(titles.length + '&nbsp;ítem' + ((titles.length > 1)? 's' : ''));

			var total = 0;
			$('section.sheet table.items > tbody > tr.itemParent').each(function() {
				total+= parseFloat($(this).find('input[name="item[][subtotal_precio]"]').val());
			});
			var subtotal = parseFloat(target.parentTo('tr').find('input[name="item[][subtotal_precio]"]').val());
			var ratio = (total > 0)? subtotal / total : 0;
			target.parentTo('tr').find('.info:eq(1)').html((ratio * 100).toFixed(2) + '%');

		}
		$('#tabs-2').trigger('scroll');
	});
	// htmlObject.find('button.add.all-items').click(function() {
	$('section.sheet table').on('click', 'tbody tr.title button.add.all-items', function(event) {
		var htmlObject = $(event.target).closest('tr');
		if (htmlObject.data('categoria'))
			addAllItems(htmlObject);
		else
			toastr.warning('Para utilizar esta opción, debe seleccionar una categoría existente en el catálogo.');
	});

	$('section.sheet table').on('change', 'tr.title th input[name="item[][selected]"]', function(event) {
		if (!event.isSimulated) {
			var is_checked = $(event.target).prop('checked');
			$(this).closest('tr').nextUntil('tr.title').each(function(key, item) {
				$(item).find('input[name="item[][selected]"]').prop('checked', is_checked);
			});
		}
	});

	$('section.sheet table').on('focusout', 'tbody tr.title input[name="item[][nombre]"]', function() {
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
				success: function(data) {
					htmlObject.data('categoria', data.id);
					console.log('Categoría guardada: ' + data.id);
					// Si la categoría se guardó exitosamente, guardar el ID
					if (data.id) {
						htmlObject.data('id', data.id);
						htmlObject[0].dataset.id = data.id;
					}
				}
			});
			htmlObject.trigger('change');
		}
	});

	// htmlObject.focusin(function() {
	$('section.sheet table').on('focusin', 'tbody tr.title', function(event) {
		var htmlObject = $(this);
		var inputObject = $(this).find('input[name="item[][nombre]"]');

		if (!ingreso_simple_items_cot_neg) {
			// Guardar el valor inicial antes de inicializar el autocomplete
			var initialValue = inputObject.val();
			if (initialValue && initialValue.trim() !== '') {
				inputObject.data('before-search-value', initialValue);
			}

			// Interceptor para guardar el valor antes de que el usuario escriba
			inputObject.on('focus', function() {
				var currentVal = $(this).val();
				if (currentVal && currentVal.trim() !== '') {
					$(this).data('before-search-value', currentVal);
				}
			});

			inputObject.autocomplete({
				source: function(request, response) {
					inputObject.data('ajax-call', true);
					
					// Guardar el valor actual ANTES de buscar
					var currentVal = inputObject.val();
					if (!inputObject.data('before-search-value') && currentVal && currentVal.trim() !== '' && currentVal !== request.term) {
						console.log('[EDITOR_CINEMAGICA.JS CATEGORIA AUTOCOMPLETE] Guardando valor antes de búsqueda:', currentVal, 'Término:', request.term);
						inputObject.data('before-search-value', currentVal);
					} else if (currentVal && currentVal.trim() !== '' && currentVal !== request.term) {
						var savedValue = inputObject.data('before-search-value');
						if (!savedValue || savedValue !== currentVal) {
							console.log('[EDITOR_CINEMAGICA.JS CATEGORIA AUTOCOMPLETE] Actualizando valor guardado:', currentVal);
							inputObject.data('before-search-value', currentVal);
						}
					}
					
					$.ajax({
						url: '/4DACTION/_V3_' + 'getCategoria',
						dataType: 'json',
						data: {
							q: request.term,
							area_negocio: $('[name="cotizacion[area_negocio]"]').data('id'),
							from: 'negocio'
						},
						success: function(data) {
							// Si no hay resultados, restaurar el valor que tenía antes de la búsqueda
							if (data.rows.length === 0) {
								var savedValue = inputObject.data('before-search-value');
								var searchTerm = request.term;
								
								console.log('[EDITOR_CINEMAGICA.JS CATEGORIA AUTOCOMPLETE] Sin resultados. Valor guardado:', savedValue, 'Término buscado:', searchTerm, 'Valor actual:', inputObject.val());
								
								// No mostrar sugerencias
								response([]);
								
								// Restaurar el valor guardado SIEMPRE cuando no hay resultados
								if (savedValue && savedValue.trim() !== '') {
									// Forzar el valor ANTES de que jQuery UI procese la respuesta vacía
									inputObject.val(savedValue);
									
									// Restaurar inmediatamente después de que jQuery UI procese la respuesta
									setTimeout(function() {
										var currentVal = inputObject.val();
										if (currentVal === searchTerm || !currentVal || currentVal.trim() === '') {
											console.log('[EDITOR_CINEMAGICA.JS CATEGORIA AUTOCOMPLETE] Restaurando valor guardado (50ms):', savedValue, 'Valor actual:', currentVal);
											inputObject.val(savedValue);
											inputObject.trigger('change');
										}
									}, 50);
									
									// Restaurar de nuevo después de un delay más largo como respaldo
									setTimeout(function() {
										var currentVal = inputObject.val();
										if (currentVal === searchTerm || !currentVal || currentVal.trim() === '') {
											console.log('[EDITOR_CINEMAGICA.JS CATEGORIA AUTOCOMPLETE] Restaurando valor guardado (300ms respaldo):', savedValue);
											inputObject.val(savedValue);
											inputObject.trigger('change');
										}
									}, 300);
									
									// Último intento después de más tiempo
									setTimeout(function() {
										var currentVal = inputObject.val();
										if (currentVal === searchTerm || !currentVal || currentVal.trim() === '') {
											console.log('[EDITOR_CINEMAGICA.JS CATEGORIA AUTOCOMPLETE] Restaurando valor guardado (1000ms respaldo final):', savedValue);
											inputObject.val(savedValue);
											inputObject.trigger('change');
										}
									}, 1000);
								} else {
									console.warn('[EDITOR_CINEMAGICA.JS CATEGORIA AUTOCOMPLETE] No hay valor guardado para restaurar');
								}
							} else {
								response($.map(data.rows, function(item) {
									return item;
								}));
							}
							setTimeout(function() {
								inputObject.removeData('ajax-call');
							}, 1500);
						},
						error: function(jqXHR, exception) {
							toastr.error('No se pudo cargar el listado de categorías. Error de conexión al servidor.');
							inputObject.removeData('ajax-call');
				        }
					});
				},
				minLength: 0,
				delay: 0,
				position: { my: "left top", at: "left bottom", collision: "flip" },
				search: function(event, ui) {
					// Guardar el valor antes de que el usuario empiece a buscar
					var currentVal = $(this).val();
					if (currentVal && currentVal.trim() !== '' && !$(this).data('before-search-value')) {
						$(this).data('before-search-value', currentVal);
					}
				},
				response: function(event, ui) {
					// Interceptar cuando no hay resultados
					if (!ui.content || ui.content.length === 0) {
						var savedValue = inputObject.data('before-search-value');
						if (savedValue) {
							setTimeout(function() {
								var currentVal = inputObject.val();
								// Restaurar si está vacío o si el valor actual no es el guardado
								if (!currentVal || currentVal.trim() === '' || currentVal !== savedValue) {
									console.log('[EDITOR_CINEMAGICA.JS CATEGORIA AUTOCOMPLETE response] Restaurando valor guardado:', savedValue);
									inputObject.val(savedValue);
									inputObject.trigger('change');
								}
							}, 250);
						}
					}
				},
				open: function() {
					$(this).removeClass('ui-corner-all').addClass('ui-corner-top');
					// Guardar el valor actual cuando se abre el autocomplete
					var currentVal = $(this).val();
					if (currentVal && currentVal.trim() !== '') {
						$(this).data('before-search-value', currentVal);
					}
				},
				close: function() {
					$(this).removeClass('ui-corner-top').addClass('ui-corner-all');
					// Si el campo tenía un valor antes de abrir el autocomplete y no se seleccionó nada, restaurarlo
					var currentValue = $(this).val();
					var savedValue = $(this).data('before-search-value');
					if (savedValue && (!currentValue || currentValue.trim() === '')) {
						console.log('[EDITOR_CINEMAGICA.JS CATEGORIA AUTOCOMPLETE close] Campo vacío al cerrar, restaurando:', savedValue);
						$(this).val(savedValue);
						$(this).trigger('change');
					}
				},
				focus: function(event, ui) {
					$(this).val(ui.item.text);
					return false;
				},
				select: function(event, ui) {
					$(this).val(ui.item.text);
					// Guardar el valor seleccionado para restaurarlo si la búsqueda futura no encuentra resultados
					$(this).data('before-search-value', ui.item.text);
					var target = htmlObject;
					target.data('categoria', ui.item.id);
					// Guardar el ID de la categoría, pero NO bloquear todavía (solo después de guardar)
					if (ui.item.id) {
						target.data('id', ui.item.id);
						target[0].dataset.id = ui.item.id;
					}
					target.find('[name="item[][ocultar_print]"]').prop('checked', ui.item.ocultar_print);

					$(this).trigger('change');
					return false;
				}

			}).data('ui-autocomplete')._renderItem = function(ul, item) {
				return $('<li><a><strong>' +  ((item.especial)? 'Especial' : '') + '</strong><em>' + ((item.gasto_fijo)? 'Gasto Fijo' : '') + '</em><span class="highlight">' + item.text + '</span></a></li>').appendTo(ul);
			};
		}
	});

	// htmlObject.focusout(function() {
	$('section.sheet table').on('focusout', 'tbody tr.title', function() {
		if ($(this).find('input[name="item[][nombre]"]').hasClass('ui-autocomplete-input'))
			$(this).find('input[name="item[][nombre]"]').autocomplete('destroy');
	});


// change cotneg >>>>>
	// // cambio de tipo de documento
	// var changeTipoDocumento = function(target, tipo_documento_old, tipo_documento_new) {
	//     // Se actualiza el valor de las horas extras simulando 'cambio' en el input
	//     if (tipo_documento_old != tipo_documento_new)
	//       target.find('input[name="item[][horas_extras]"]').trigger('change');

	//     // Se extraen los datos relevantes para desglosar el precio
	//     var tipo_documento_ratio_old = (typeof target.data('tipo-documento-ratio') != 'undefined')? target.data('tipo-documento-ratio') : 0;
	// 	var tipo_documento_valor_usd_old = (typeof target.data('tipo-documento-valor-usd') != 'undefined')? target.data('tipo-documento-valor-usd') : false; // Impuesto extranjero
	//     var tipo_documento_inverse_old = (typeof target.data('tipo-documento-inverse') != 'undefined')? target.data('tipo-documento-inverse') : false;
	// 	if (target.find('[name="item[][precio_unitario]"]').data('old-value'))
	//     	var base_imponible_old = (tipo_documento_ratio_old > 0)? target.data('base-imponible') : target.find('[name="item[][precio_unitario]"]').data('old-value');
	// 	else
	// 		var base_imponible_old = (tipo_documento_ratio_old > 0)? target.data('base-imponible') : target.find('[name="item[][precio_unitario]"]').val();
	//     var hora_extra_cantidad_old = target.find('[name="item[][horas_extras]"]').val();

	//     // Se reconstruye el precio base

	//     var precio_base = 0;

	//      if (tipo_documento_inverse_old) {
	//       // precio_base = Math.round(base_imponible_old * (1 - tipo_documento_ratio_old));
	//      // precio_base = parseFloat((base_imponible_old * (1 - tipo_documento_ratio_old)).toFixed(currency.decimals + 2));

	// 		if (tipo_documento_valor_usd_old)
	// 	 		precio_base = parseFloat((base_imponible_old * valor_usd_cotizacion * (1 - tipo_documento_ratio_old)).toFixed(currency.decimals + 2));
	// 		else
	// 	 		precio_base = parseFloat((base_imponible_old * (1 - tipo_documento_ratio_old)).toFixed(currency.decimals + 2));
	//   	} else
	//       // precio_base = Math.round(base_imponible_old / (1 + tipo_documento_ratio_old));
	//       precio_base = parseFloat((base_imponible_old / (1 + tipo_documento_ratio_old)).toFixed(currency.decimals + 2));

	//     target.data('tipo-documento', tipo_documento_new);

	//     // Se actualizan valores relacionados a las horas hombre de OT
	//     // TODO: actualziar automáticamente cuando se cambian los días para el contrato por proyecto

	//     if (target.find('input[name="item[][costo_interno]"]').prop('checked')) {

	//       if (typeof target.data('costo-presupuestado-hh-cantidad') == 'undefined')
	//         target.data('costo-presupuestado-hh-cantidad', 0);

	//       if (typeof target.data('costo-presupuestado-hh-valor') == 'undefined')
	//         target.data('costo-presupuestado-hh-valor', 0);

	//       var old_costo_total = parseFloat((target.find('input[name="item[][costo_unitario]"]').data('old-value'))? target.find('input[name="item[][costo_unitario]"]').data('old-value') : target.find('input[name="item[][costo_unitario]"]').val());
	//       var old_costo_interno = target.data('costo-presupuestado-hh-cantidad') * target.data('costo-presupuestado-hh-valor');
	//       var costo_externo = old_costo_total - old_costo_interno;

	//       var new_costo_interno = parseFloat($('input[name="item[][cant_hh_asig]"]').val()) * parseFloat($('input[name="item[][costo_hh_unitario]"]').val());
	//       var new_costo_total = costo_externo + new_costo_interno;

	//       if (old_costo_total != new_costo_total) {
	//         target.find('input[name="item[][costo_unitario]"]').val(new_costo_total.toFixed(currency.decimals)).data('old-value', new_costo_total.toFixed(currency.decimals + 2));
	//         updateRow({
	//           target: target.find('input[name="item[][costo_unitario]"]')
	//         });
	//       }
	//     }

	//     if (target.data('costo-presupuestado-hh-cantidad') > 0 && target.find('input[name="item[][costo_interno]"]').prop('checked'))
	//       target.find('button.detail.cost').visible();
	//     else
	//       target.find('button.detail.cost').invisible();

	//     // Se consulta el tipo de documento elegido y se cambian los parámetros de cálculo de acuerdo a él
	//     if (tipo_documento_old != tipo_documento_new)
	//       $.ajax({
	//         url: '/4DACTION/_V3_getTipoDocumento',
	//         data: {
	//           q: target.data('tipo-documento'),
	//           filter: 'id'
	//         },
	//         dataType: 'json',
	//         async: false,
	//         success: function(data) {
	//           // Se rescatan y cambian los parámetros de cálculo
	//           if (data.rows.length) {
	//             // próximas 2 líneas, ver si se pueden quitar
	//             if (data.rows[0].ratio == 0)
	//               target.find('input[name="item[][precio_unitario]"]').removeClass('edited');
	//             target.data('tipo-documento-text', data.rows[0].text);
	//             target.data('tipo-documento-ratio', data.rows[0].ratio);
	// 			target.data('tipo-documento-valor-usd', data.rows[0].valor_usd); // Impuesto extranjero
	//             target.data('tipo-documento-inverse', data.rows[0].inverse);
	//             target.find('[name="item[][tipo_documento]"]').val(data.rows[0].abbr);

	//             if (typeof data.rows[0].hora_extra != 'undefined') {
	//               target.data('hora-extra-enabled', true);
	//               target.data('hora-extra-factor', data.rows[0].hora_extra.factor);
	//               target.data('hora-extra-jornada', data.rows[0].hora_extra.jornada);
	//               target.find('input[name="item[][horas_extras]"]').val(0).parentTo('td').visible();
	//               target.find('input[name="item[][precio_unitario]"]').addClass('edited')
	//               target.data('hora-extra-dias', data.rows[0].hora_extra.dias);
	//               target.find('button.detail.price').visible();
	//             } else {
	//               target.data('hora-extra-enabled', false);
	//               target.find('input[name="item[][horas_extras]"]').val(0).parentTo('td').invisible();
	//               target.find('input[name="item[][precio_unitario]"]').removeClass('edited').removeClass('special');
	//               target.data('base-imponible', parseFloat((target.find('input[name="item[][precio_unitario]"]').data('old-value'))? target.find('input[name="item[][precio_unitario]"]').data('old-value') : target.find('input[name="item[][precio_unitario]"]').val()));
	//               target.find('button.detail.price').invisible();
	//             }
	//           } else {
	//             target.data('hora-extra-enabled', false);
	//             target.find('input[name="item[][horas_extras]"]').val(0).parentTo('td').invisible();
	//             target.find('input[name="item[][precio_unitario]"]').removeClass('edited').removeClass('special');
	//             target.find('button.detail.price').invisible();
	//             target.data('base-imponible', parseFloat((target.find('input[name="item[][precio_unitario]"]').data('old-value'))? target.find('input[name="item[][precio_unitario]"]').data('old-value') : target.find('input[name="item[][precio_unitario]"]').val()));
	//           }

	//           var precio_unitario = (target.find('input[name="item[][precio_unitario]"]').data('old-value'))? target.find('input[name="item[][precio_unitario]"]').data('old-value') : target.find('input[name="item[][precio_unitario]"]').val();

	//           if (precio_unitario != 0) {

	//             // Se reemplaza el precio base antiguo por el nuevo
	//             target.find('input[name="item[][precio_unitario]"]').trigger('focus').val(0).trigger('blur').trigger('focus').val(precio_base).data('old-value', precio_base).trigger('blur');

	//             // Se reemplaza la cantidad horas extras antigua por la nueva
	//             if (target.data('hora-extra-enabled')) {
	//               target.find('input[name="item[][horas_extras]"]').val(hora_extra_cantidad_old).trigger('change');
	//             }

	//           }

	// 		  // Actualizar previo
	// 		  target.find('input[name="item[][costo_unitario_previo]"]').val(target.find('input[name="item[][costo_unitario]"]').val());
	// 		  target.find('input[name="item[][subtotal_costo_previo]"]').val(target.find('input[name="item[][subtotal_costo]"]').val());

	//         }
	//       });
	// };
// change cotneg <<<<<

	$('section.sheet table').on('focusout', 'tbody tr:not(.title) input[name="item[][nombre]"]', function() {
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
				success: function(data) {
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
	$('section.sheet table').on('focusin', 'tbody tr:not(.title):not(.itemParent)', function() {
		var htmlObject = $(this);
		htmlObject.addClass('focused'); // Fondo línea que se está trabajando
		var inputObject = $(this).find('input[name="item[][nombre]"]');
		
		console.log('[FOCUSIN] Evento focusin disparado. Valor actual:', inputObject.val(), 'Item ID:', htmlObject.data('id'));
		
		// Si el item ya fue guardado (tiene data-id) y NO es una categoría, no permitir editar el nombre
		var itemId = htmlObject.data('id');
		if ((itemId || inputObject.data('item-guardado') || htmlObject.data('nombre-bloqueado')) && !htmlObject.hasClass('title') && !htmlObject.hasClass('itemParent')) {
			console.log('[focusin] Bloqueando edición del nombre. Item ID:', itemId);
			inputObject.prop('readonly', true);
			inputObject.attr('readonly', 'readonly');
			inputObject.css({
				'pointer-events': 'none',
				'background-color': '#f5f5f5',
				'cursor': 'not-allowed',
				'opacity': '0.7'
			});
			htmlObject.find('button.show.item').hide();
			htmlObject.find('button.ui-icon-document.detail.item').hide();
			// Destruir autocomplete si existe
			if (inputObject.hasClass('ui-autocomplete-input')) {
				inputObject.autocomplete('destroy');
			}
			// Prevenir que el autocomplete se inicialice
			inputObject.blur();
			return false;
		}
		
		if (!ingreso_simple_items_cot_neg) {
			// Guardar el valor inicial antes de inicializar el autocomplete
			var initialValue = inputObject.val();
			console.log('[FOCUSIN] Valor inicial del campo:', initialValue);
			if (initialValue && initialValue.trim() !== '') {
				inputObject.data('before-search-value', initialValue);
				console.log('[FOCUSIN] Valor guardado como before-search-value:', initialValue);
			}
			
			// Interceptor para guardar el valor antes de que el usuario escriba
			var lastSavedValue = initialValue;
			inputObject.on('focus', function() {
				var currentVal = $(this).val();
				if (currentVal && currentVal.trim() !== '') {
					$(this).data('before-search-value', currentVal);
					lastSavedValue = currentVal;
				}
			});
			
			// Interceptor agresivo: si el campo se vacía después de una búsqueda sin resultados, restaurarlo
			var restoreTimeout = null;
			var restoreInterval = null;
			
			// Interceptar el evento input para prevenir que se limpie el campo
			inputObject.on('input', function() {
				var $this = $(this);
				var currentVal = $this.val();
				var savedValue = $this.data('before-search-value');
				
				// Si el campo se está vaciando y hay un valor guardado, restaurarlo
				if ((!currentVal || currentVal.trim() === '') && savedValue && savedValue.trim() !== '' && !$this.data('item-selected')) {
					console.log('[AUTOCOMPLETE input] Campo vaciado, restaurando:', savedValue);
					setTimeout(function() {
						if (!$this.val() || $this.val().trim() === '') {
							$this.val(savedValue);
							$this.trigger('change');
						}
					}, 100);
				}
			});
			
			inputObject.on('blur', function() {
				var $this = $(this);
				var currentVal = $this.val();
				var savedValue = $this.data('before-search-value');
				// Si el campo está vacío pero hay un valor guardado, restaurarlo
				if ((!currentVal || currentVal.trim() === '') && savedValue && savedValue.trim() !== '') {
					// Limpiar timeout anterior si existe
					if (restoreTimeout) {
						clearTimeout(restoreTimeout);
					}
					// Esperar un poco para que termine cualquier procesamiento del autocomplete
					restoreTimeout = setTimeout(function() {
						var finalVal = $this.val();
						if ((!finalVal || finalVal.trim() === '') && savedValue) {
							console.log('[AUTOCOMPLETE blur] Restaurando valor:', savedValue);
							$this.val(savedValue);
							$this.trigger('change');
						}
					}, 300);
				}
			});
			
			// Verificación periódica para restaurar el valor si se vacía
			restoreInterval = setInterval(function() {
				var currentVal = inputObject.val();
				var savedValue = inputObject.data('before-search-value');
				// Si el campo está vacío pero hay un valor guardado y no se está seleccionando un item
				if ((!currentVal || currentVal.trim() === '') && savedValue && savedValue.trim() !== '' && !inputObject.data('item-selected') && !inputObject.data('ajax-call')) {
					console.log('[AUTOCOMPLETE interval] Campo vacío detectado, restaurando:', savedValue);
					inputObject.val(savedValue);
					inputObject.trigger('change');
				}
			}, 500);
			
			// Limpiar el intervalo cuando el input se destruya
			inputObject.on('remove', function() {
				if (restoreInterval) {
					clearInterval(restoreInterval);
				}
			});
			
			inputObject.autocomplete({
				source: function(request, response) {
					inputObject.data('ajax-call', true);
					// Guardar el valor actual ANTES de buscar (si no está vacío y es diferente al término de búsqueda)
					var currentVal = inputObject.val();
					// Si no hay un valor guardado previamente, guardar el valor actual
					if (!inputObject.data('before-search-value') && currentVal && currentVal.trim() !== '' && currentVal !== request.term) {
						console.log('[AUTOCOMPLETE] Guardando valor antes de búsqueda:', currentVal, 'Término:', request.term);
						inputObject.data('before-search-value', currentVal);
					}
					// Si el valor actual es diferente del término de búsqueda y no está vacío, actualizar el valor guardado
					else if (currentVal && currentVal.trim() !== '' && currentVal !== request.term) {
						var savedValue = inputObject.data('before-search-value');
						// Solo actualizar si el valor actual es diferente del guardado
						if (!savedValue || savedValue !== currentVal) {
							console.log('[AUTOCOMPLETE] Actualizando valor guardado:', currentVal);
							inputObject.data('before-search-value', currentVal);
						}
					}
					$.ajax({
						url: '/4DACTION/_V3_' + 'getProductoByCategoria',
						dataType: 'json',
						data: {
							q: request.term,
							id: htmlObject.prevTo('.title').data('categoria')
						},
						success: function(data) {
							// Si no hay resultados, restaurar el valor que tenía antes de la búsqueda
							if (data.rows.length === 0) {
								var savedValue = inputObject.data('before-search-value');
								var searchTerm = request.term;
								
								console.log('[AUTOCOMPLETE] Sin resultados. Valor guardado:', savedValue, 'Término buscado:', searchTerm, 'Valor actual:', inputObject.val());
								
								// No mostrar sugerencias pero NO pasar el término de búsqueda vacío
								// Esto previene que jQuery UI limpie el campo
								response([]);
								
								// Restaurar el valor guardado INMEDIATAMENTE antes de que jQuery UI lo procese
								if (savedValue && savedValue.trim() !== '') {
									// Forzar el valor ANTES de que jQuery UI procese la respuesta vacía
									inputObject.val(savedValue);
									
									// Restaurar inmediatamente después de que jQuery UI procese la respuesta
									setTimeout(function() {
										var currentVal = inputObject.val();
										// Si el campo tiene el término de búsqueda (lo que el usuario escribió sin encontrar resultados)
										// o está vacío, restaurar el valor guardado
										if (currentVal === searchTerm || !currentVal || currentVal.trim() === '') {
											console.log('[AUTOCOMPLETE] Restaurando valor guardado:', savedValue, 'Valor actual:', currentVal, 'Término buscado:', searchTerm);
											inputObject.val(savedValue);
											// Forzar el evento change para actualizar otros campos relacionados
											inputObject.trigger('change');
										}
									}, 50);
									
									// Restaurar de nuevo después de un delay más largo como respaldo
									setTimeout(function() {
										var currentVal = inputObject.val();
										if (currentVal === searchTerm || !currentVal || currentVal.trim() === '') {
											console.log('[AUTOCOMPLETE] Restaurando valor guardado (respaldo):', savedValue);
											inputObject.val(savedValue);
											inputObject.trigger('change');
										}
									}, 300);
									
									// Último intento después de más tiempo
									setTimeout(function() {
										var currentVal = inputObject.val();
										if (currentVal === searchTerm || !currentVal || currentVal.trim() === '') {
											console.log('[AUTOCOMPLETE] Restaurando valor guardado (último intento):', savedValue);
											inputObject.val(savedValue);
											inputObject.trigger('change');
										}
									}, 1000);
								} else {
									console.warn('[AUTOCOMPLETE] No hay valor guardado para restaurar');
								}
							} else {
								response($.map(data.rows, function(item) {
									return item;
								}));
							}
							setTimeout(function() {
								inputObject.removeData('ajax-call');
							}, 1500);
						},
						error: function(jqXHR, exception) {
							toastr.error('No se pudo cargar el listado de items. Error de conexión al servidor.');
							inputObject.removeData('ajax-call');
				        }
					});
				},
				minLength: 0,
				delay: 0,
				position: { my: "left top", at: "left bottom", collision: "flip" },
				search: function(event, ui) {
					// Guardar el valor antes de que el usuario empiece a buscar
					var currentVal = $(this).val();
					if (currentVal && currentVal.trim() !== '' && !$(this).data('before-search-value')) {
						$(this).data('before-search-value', currentVal);
					}
				},
				response: function(event, ui) {
					// Interceptar cuando no hay resultados
					if (!ui.content || ui.content.length === 0) {
						var savedValue = inputObject.data('before-search-value');
						console.log('[AUTOCOMPLETE response] Sin contenido. Valor guardado:', savedValue, 'Valor actual:', inputObject.val());
						if (savedValue && savedValue.trim() !== '') {
							// Restaurar inmediatamente
							var currentVal = inputObject.val();
							if (currentVal !== savedValue) {
								console.log('[AUTOCOMPLETE response] Restaurando inmediatamente:', savedValue);
								inputObject.val(savedValue);
								inputObject.trigger('change');
							}
							
							// Verificaciones adicionales
							setTimeout(function() {
								var currentVal = inputObject.val();
								// Restaurar si está vacío o si el valor actual no es el guardado
								if (!currentVal || currentVal.trim() === '' || currentVal !== savedValue) {
									console.log('[AUTOCOMPLETE response] Restaurando (timeout 1):', savedValue);
									inputObject.val(savedValue);
									inputObject.trigger('change');
								}
							}, 100);
							
							setTimeout(function() {
								var currentVal = inputObject.val();
								if (!currentVal || currentVal.trim() === '' || currentVal !== savedValue) {
									console.log('[AUTOCOMPLETE response] Restaurando (timeout 2):', savedValue);
									inputObject.val(savedValue);
									inputObject.trigger('change');
								}
							}, 500);
						}
					}
				},
				open: function() {
					$(this).removeClass('ui-corner-all').addClass('ui-corner-top');
					// Guardar el valor actual cuando se abre el autocomplete
					var currentVal = $(this).val();
					if (currentVal && currentVal.trim() !== '') {
						$(this).data('before-search-value', currentVal);
					}
				},
				close: function() {
					$(this).removeClass('ui-corner-top').addClass('ui-corner-all');
					// Si el campo tenía un valor antes de abrir el autocomplete y no se seleccionó nada, restaurarlo
					var $this = $(this);
					var currentValue = $this.val();
					var savedValue = $this.data('before-search-value');
					
					console.log('[AUTOCOMPLETE close] Valor actual:', currentValue, 'Valor guardado:', savedValue);
					
					// Restaurar si está vacío o si el valor actual es diferente del guardado (y no es un valor seleccionado)
					if (savedValue && savedValue.trim() !== '') {
						// Esperar un poco para que jQuery UI termine de procesar
						setTimeout(function() {
							var finalVal = $this.val();
							// Si el campo está vacío o tiene un valor diferente al guardado, restaurar
							if (!finalVal || finalVal.trim() === '' || (finalVal !== savedValue && !$this.data('item-selected'))) {
								console.log('[AUTOCOMPLETE close] Restaurando valor:', savedValue, 'Valor final:', finalVal);
								$this.val(savedValue);
								$this.trigger('change');
								$this.removeData('item-selected'); // Limpiar flag
							}
						}, 200);
						
						// Verificación adicional después de más tiempo
						setTimeout(function() {
							var finalVal = $this.val();
							if ((!finalVal || finalVal.trim() === '') && savedValue) {
								console.log('[AUTOCOMPLETE close] Restaurando valor (verificación tardía):', savedValue);
								$this.val(savedValue);
								$this.trigger('change');
							}
						}, 800);
					}
				},
				focus: function(event, ui) {
					$(this).val(ui.item.text);
					return false;
				},
				select: function(event, ui) {
					$(this).val(ui.item.text);
					// Marcar que se seleccionó un item
					$(this).data('item-selected', true);
					// Guardar el valor seleccionado para restaurarlo si la búsqueda futura no encuentra resultados
					$(this).data('before-search-value', ui.item.text);
					console.log('[AUTOCOMPLETE select] Item seleccionado:', ui.item.text);
					var target = htmlObject;

					target.data('producto', ui.item.id);
					target.find('[name="item[][codigo]"]').val(ui.item.index);
					target.find('[name="item[][unidad]"]').val(ui.item.unidad);
					target.find('[name="item[][horas_extras]"]').val(0);

					var cantidad = parseFloat(target.find('[name="item[][cantidad]"]').data('old-value'));
					var factor = parseFloat(target.find('[name="item[][factor]"]').data('old-value'));

					if (ui.item.porcentaje_monto_total == 0) {
						target.find('[name="item[][precio_unitario]"]').val(ui.item.precio / exchange_rate).data('old-value', ui.item.precio / exchange_rate);
						target.find('[name="item[][subtotal_precio]"]').val(cantidad * factor * (ui.item.precio / exchange_rate));
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
						target.data('formula-productor-ejecutivo-ratio', ui.item.formula_productor_ejecutivo_ratio);
						// Bloquear nombre, tipo documento y cantidades
						target.find('[name="item[][nombre]"]').prop('readonly', true);
						target.find('button.show.item').invisible();
						//target.find('[name="item[][tipo_documento]"]').prop('readonly', true);
						//target.find('button.show.tipo-documento').hide();
						target.find('[name="item[][cantidad]"]').prop('readonly', true);
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
						target.find('[name="item[][cantidad]"]').prop('readonly', true);
						target.find('[name="item[][factor]"]').prop('readonly', true);
					} else {
						target.removeData('formula-asistente-produccion');
					}

					if (ui.item.porcentaje_monto_total || ui.item.formula_productor_ejecutivo || ui.item.formula_asistente_produccion) {
						target.find('.remove.item').remove();
						target.find('.insert.item').remove();
						target.find('.clone.item').remove();
						target.find('.ui-icon-arrow-4').remove();
					}

					//target.find('[name="item[][precio_unitario]"]').val(ui.item.precio / exchange_rate).data('old-value', ui.item.precio / exchange_rate);
					//target.find('[name="item[][subtotal_precio]"]').val(cantidad * factor * (ui.item.precio / exchange_rate));
					target.find('[name="item[][aplica_sobrecargo]"]').prop('checked', ui.item.aplica_sobrecargo);

					if (typeof copiar_precio_a_costo == 'boolean' && !margen_desde_compra) {
						target.find('[name="item[][costo_unitario]"]').data('auto', true);
						if (ui.item.costo == 0) {
							target.find('[name="item[][costo_unitario]"]').val(ui.item.precio / exchange_rate).data('old-value', ui.item.precio / exchange_rate);
							target.find('[name="item[][subtotal_costo]"]').val(cantidad * factor * (ui.item.precio / exchange_rate));
						} else {
							target.find('[name="item[][costo_unitario]"]').val(ui.item.costo / exchange_rate).data('old-value', ui.item.costo / exchange_rate);
							target.find('[name="item[][subtotal_costo]"]').val(cantidad * factor * (ui.item.costo / exchange_rate));
						}
					} else {
						htmlObject.find('[name="item[][costo_unitario]"]').val(ui.item.costo / exchange_rate).data('old-value', ui.item.costo / exchange_rate);
						htmlObject.find('[name="item[][subtotal_costo]"]').val(cantidad * factor * (ui.item.costo / exchange_rate));
					}

					target.find('[name="item[][nombre]"]').data('nombre-original', ui.item.text);

					var tooltip = ' \
						<p>Nombre ítem:</p> \
						<p>' + ui.item.text.replace("\n", '<p>&nbsp;</p>') + '</p> \
						<p>&nbsp;</p> \
						<p>Descripción larga:</p> \
						<p>' + ((ui.item.observacion!= '')? ui.item.observacion.replace(/\n/g, '</p><p>') : 'N/A') + '</p> \
						<p>&nbsp;</p>\
						<p>Observación interna:</p> \
						<p>N/A</p> \
					';
					target.find('button.profile.item').tooltipster('update', tooltip);

					var subtotal_precio = target.find('[name="item[][subtotal_precio]"]').val();
					var subtotal_costo = target.find('[name="item[][subtotal_costo]"]').val();

					if (margen_desde_compra_inverso)
						var margen_compra = ((1 - subtotal_costo / subtotal_precio) * 100).toFixed(2);
					else
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
					target.data('tipo-documento', 30);
					target.find('input[name="item[][tipo_documento]"]').val('F');
					if (typeof ui.item.tipo_documento != 'undefined' && ui.item.tipo_documento.id != 30) {
						target.data('tipo-documento', ui.item.tipo_documento.id);
						target.data('tipo-documento-text', ui.item.tipo_documento.text);
						target.data('tipo-documento-ratio', ui.item.tipo_documento.ratio);
						target.data('tipo-documento-valor-usd', ui.item.tipo_documento.valor_usd); // Impuesto extranjero
						target.data('tipo-documento-inverse', ui.item.tipo_documento.inverse);
						target.find('[name="item[][tipo_documento]"]').val(ui.item.tipo_documento.abbr);
						if (ui.item.tipo_documento.ratio != 0) {
							target.find('[name="item[][precio_unitario]"]').addClass('edited');
							target.find('button.detail.price').visible();
						} else {
							target.find('[name="item[][precio_unitario]"]').removeClass('edited');
							target.find('button.detail.price').invisible();
						}
					} else {
						target.removeData('tipo-documento');
						target.removeData('tipo-documento-text');
						target.removeData('tipo-documento-ratio');
						target.removeData('tipo-documento-valor-usd'); // Impuesto extranjero
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

					if ((typeof ui.item.tipo_documento != 'undefined' && ui.item.tipo_documento.id != 30) || typeof ui.item.hora_extra != 'undefined')
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
							success: function(data) {
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
					        target.find('[name="item[][margen_compra]"]').trigger('blur');
							target.find('input[name="item[][costo_unitario]"]').trigger('focus').trigger('blur');
							if (!access._566)
					            target.find('[name="item[][margen_compra]"]').prop('readonly', true);
							target.find('[name="item[][margen_compra]"]').visible();
					    } else {
					        target.find('[name="item[][margen_venta]"]').val(ui.item.margen * 100.00);
					        target.find('[name="item[][margen_venta]"]').trigger('blur');
							if (!access._566)
					            target.find('[name="item[][margen_venta]"]').prop('readonly', true);
							target.find('[name="item[][margen_venta]"]').visible();
					    }
					} else {
					    target.data('preset-margen', false);
					}

					// Sección datos cinemágica
					if (!ui.item.costo_directo) {
						target.find('[name="item[][subtotal_costo_previo]"]').css('opacity', .5);
					} else {
						target.find('[name="item[][subtotal_costo_previo]"]').css('opacity', 1);
					}
					target.data('costo-directo', ui.item.costo_directo);
					target.data('costo-admin', ui.item.costo_admin); // Fórmula productor ejecutivo

					$(this).trigger('change');
					if (!modoOffline) {
						updateSubtotalTitulos($(this));
						updateSubtotalItems();
					}
					return false;
				}

			}).data('ui-autocomplete')._renderItem = function(ul, item) {
				return $('<li><a><strong>' + item.index + ' ' + ((item.gasto_fijo)? '[Gasto Fijo]' : '') + ' ' +  ((item.especial)? '[Especial]' : '') + '</strong><em>' +  item.categoria.text + '</em><span class="highlight">' + item.text + '</span>' + ( (item.precio > 0)? '<span>Precio venta: $' + item.precio.toLocaleString() + '</span>' : '' ) + '</a></li>').appendTo(ul);
			};
		}

		if (htmlObject.find('input[name="item[][unidad]"]').length)
			htmlObject.find('input[name="item[][unidad]"]').autocomplete({
				source: function(request, response) {
					$.ajax({
						url: '/4DACTION/_V3_' + 'getUnidad',
						dataType: 'json',
						data: {
							q: request.term
						},
						success: function(data) {
							response($.map(data.rows, function(item) {
								return item;
							}));
						},
						error: function(jqXHR, exception) {
							toastr.error('No se pudo cargar el listado de unidades. Error de conexión al servidor.');
				        }
					});
				},
				minLength: 0,
				delay: 0,
				position: { my: "left top", at: "left bottom", collision: "flip" },
				open: function() {
					$(this).removeClass('ui-corner-all').addClass('ui-corner-top');
				},
				close: function() {
					$(this).removeClass('ui-corner-top').addClass('ui-corner-all');
				},
				focus: function(event, ui) {
					$(this).val(ui.item.text);
					return false;
				},
				select: function(event, ui) {
					$(this).val(ui.item.text);
					var target = htmlObject;

					// $(this).trigger('change');
					if (!modoOffline) {
						updateSubtotalTitulos($(this));
						updateSubtotalItems();
					}
					return false;
				}

			}).data('ui-autocomplete')._renderItem = function(ul, item) {
				return $('<li><a>' +  item.text + '</a></li>').appendTo(ul);
			};

		if (htmlObject.find('input[name="item[][tipo_documento]"]').length)
			htmlObject.find('input[name="item[][tipo_documento]"]').autocomplete({
				source: function(request, response) {
					$.ajax({
						url: '/4DACTION/_V3_' + 'getTipoDocumento',
						dataType: 'json',
						data: {
							q: request.term
						},
						success: function(data) {
							response($.map(data.rows, function(item) {
								return item;
							}));
						},
						error: function(jqXHR, exception) {
							toastr.error('No se pudo cargar el listado de tipos de documento. Error de conexión al servidor.');
				        }
					});
				},
				minLength: 0,
				delay: 0,
				position: { my: "left top", at: "left bottom", collision: "flip" },
				open: function() {
					$(this).removeClass('ui-corner-all').addClass('ui-corner-top');
				},
				close: function() {
					$(this).removeClass('ui-corner-top').addClass('ui-corner-all');
				},
				focus: function(event, ui) {
					$(this).parentTo('tr').trigger('beforeUpdate'); // Logs tiempo real
					$(this).val(ui.item.abbr);
					return false;
				},
				select: function(event, ui) {
					$(this).val(ui.item.abbr);
					var target = htmlObject;

					target.data('no-update', true);

					changeTipoDocumento(target, target.data('tipo-documento'), ui.item.id);

					target.removeData('no-update');

					target.trigger('afterUpdate'); // Logs tiempo real

					// $(this).trigger('change');
					if (!modoOffline) {
						updateSubtotalTitulos($(this));
						updateSubtotalItems();
					}
					return false;
				}

			}).data('ui-autocomplete')._renderItem = function(ul, item) {
				return $('<li><a>' +  item.text + '</a></li>').appendTo(ul);
			};

	});


	// htmlObject.focusout(function() {
	$('section.sheet table').on('focusout', 'tbody tr:not(.title)', function() {
		$(this).removeClass('focused'); // Fondo línea que se está trabajando
		if ($(this).find('input[name="item[][nombre]"]').hasClass('ui-autocomplete-input'))
			$(this).find('input[name="item[][nombre]"]').autocomplete('destroy');
		if ($(this).find('input[name="item[][tipo_documento]"]').hasClass('ui-autocomplete-input'))
			$(this).find('input[name="item[][tipo_documento]"]').autocomplete('destroy');
		if ($(this).find('input[name="item[][unidad]"]').hasClass('ui-autocomplete-input'))
			$(this).find('input[name="item[][unidad]"]').autocomplete('destroy');
	});


	$('section.sheet table').on('click', 'tbody tr:not(.title) button.remove.item', function() {
		contentChanged = true;
		contentReady = false;
		var element = this;
		var title = $(element).parentTo('tr').prevTo('.title');
		$(element).closest('tr').trigger('beforeRemove'); // Logs tiempo real
		$(element).parentTo('tr').fadeOut(400, function() {
			$(this).trigger('afterRemove'); // Logs tiempo real
			$(this).remove(); // FIXME: ver si realmente quita de la memoria los nodos
			if (!modoOffline) {
				updateSubtotalTitulos(title);
				updateSubtotalItems();
			}
		});

		$('section.sheet table.items > tfoot > tr > th.info').trigger('refresh');

		unaBase.changeControl.hasChange = true;

	});

	$('section.sheet table').on('click', 'tbody button.remove.categoria', function() {
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
				current.nextUntil('.title').andSelf().each(function() {
					if (!$(this).find('button.remove.item').isVisible())
						countProtectedItems++;
				});
			}
			else
				countItems = 0;
		}

		var removeTitle = function(title, current) {
			title.trigger('beforeRemove'); // Logs tiempo real
			if (countItems > 0) {
				unaBase.ui.block();

				current = current.prev();
				var stack = [];
				do {
					current = current.next();
					stack.push(current);
					countItems--;
				} while(countItems > 0);

				$.each(stack, function() {
					this.trigger('beforeRemove'); // Logs tiempo real
					this.remove();
					this.trigger('afterRemove'); // Logs tiempo real
				});

				unaBase.ui.unblock();
			}

			title.fadeOut(400, function() {
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
				confirm('¿Desea quitar el título y todos los items dentro del título?').done(function(data) {
					if (data)
						removeTitle(title, current);
				});
			else
				removeTitle(title, current);
		} else
			toastr.warning('No es posible quitar el título, ya que contiene ítems que no pueden eliminarse debido a que tienen gastos asociados.');

	});

	$('section.sheet table').on('click', 'thead button.add.categoria', function() {
		var current = $(this).parentTo('table').find('tbody');

		var row = getElement.titulo('prependTo', current);
		columnsPermissions(row);

		if (current.find('tr').length > 0)
			row.find('input').focus();
		else
			row.find('input').focus();
	});

	$('section.sheet table').on('click', 'tbody button.add.categoria', function() {
		var current = $(this).parentTo('tr');
		while(!(current.next().html() == undefined || current.next().find('th').length > 0)) {
			current = current.next();
		}
		var row = getElement.titulo('insertAfter', current);
		columnsPermissions(row);
		row.find('input[name="item[][nombre]"]').focus();
	});

	$('section.sheet table').on('click', 'tbody button.add.item', function() {
		let current = $(this).parentTo('tr');
		if (current.find('button.toggle.categoria').hasClass('ui-icon-folder-collapsed'))
			current.find('button.toggle.categoria').triggerHandler('click');
		// if (!current.hasClass('title')) {
		// 	while(!(current.next().html() == undefined || current.next().find('th').length > 0)) {
		// 		current = current.next();
		// 	}
		// }
		let row = getElement.item('insertAfter', current);
		//simon itemparent start
		
		
		if(current.hasClass('itemParent')){
			
			let datasetName = typeof parentKey !== 'undefined' ? 'itemparent' : 'parentid';
			row[0].dataset[datasetName] = typeof parentKey !== 'undefined' ? parentKey : current[0].id;
			// row[0].dataset.itemparent = current.data('id');
			// if(typeof row[0].dataset.itemparent !== 'undefined'){
				row.addClass('childItem');	
				row.removeClass('item');					
			// }
		}else{
			row.addClass('item');			
		}
	
		//simon itemparent end
		columnsPermissions(row);
		row.find('input[name="item[][nombre]"]').focus().parentTo('tr').find('input[name="item[][costo_interno]"]').prop('checked', $('section.sheet table.items > thead > tr:last-of-type > th > input[name="item[][costo_interno]"]').prop('checked')).invisible();;
		$('section.sheet table.items > tfoot > tr > th.info').trigger('refresh');
	});

	$('section.sheet table').on('click', 'tbody button.add.parent', function() {
		var current = $(this).parentTo('tr');
		if (current.find('button.toggle.categoria').hasClass('ui-icon-folder-collapsed'))
			current.find('button.toggle.categoria').triggerHandler('click');
		

		
		var row = getElement.itemParent('insertAfter', current);



		columnsPermissions(row);
	});
	$('section.sheet table').on('click', 'tbody button.insert.item', function() {
		var current = $(this).parentTo('tr');
		if (current.find('button.toggle.categoria').hasClass('ui-icon-folder-collapsed'))
			current.find('button.toggle.categoria').triggerHandler('click');
		var row = getElement.item('insertAfter', current);


		

		//simon itemparent start
		
		if(current.hasClass('itemParent')){
			row[0].dataset.itemparent = current.data('id');
			if(typeof row[0].dataset.itemparent !== 'undefined'){
				row.addClass('childItem');
			}
		}else if(current.hasClass('childItem')){
			let parentKey = current[0].dataset.itemparent;
			row[0].dataset.itemparent = parentKey
			if(typeof row[0].dataset.itemparent !== 'undefined'){
				row.addClass('childItem');			
			}		
		}else{
			row.addClass('item');			
		}
	
		//simon itemparent end
		columnsPermissions(row);
		row.find('input[name="item[][nombre]"]').focus().parentTo('tr').find('input[name="item[][costo_interno]"]').prop('checked', $('section.sheet table.items > thead > tr:last-of-type > th > input[name="item[][costo_interno]"]').prop('checked'));
		$('section.sheet table.items > tfoot > tr > th.info').trigger('refresh');
	});

	$('section.sheet table').on('click', 'tbody button.clone.categoria', function() {
		var element = $(this);
		var cloneCategoria = function() {
			unaBase.ui.block();
			var current = element.parentTo('tr').nextUntil('tr.title').andSelf();

			current.each(function(key, item) {
				//if (!$(item).hasClass('title'))
					$(item).find('.profile.item').tooltipster('destroy');
			});

			var cloned = current.clone(true);
			cloned.removeUniqueId().uniqueId(); // Logs tiempo real

			cloned.each(function(key, item) {
				$(item).removeData('id');
				$(item).removeData('itemParent');
				delete(item.dataset.id);
				delete(item.dataset.itemParent);
				delete(item.dataset.itemparent);
				delete(item.dataset.parentid);
				
				$(item).find('input[name="item[][subtotal_costo_real]"]').val(0);
			}).insertAfter(current.nextUntil('tr.title').last());

			current.each(function(key, item) {
				//if (!$(item).hasClass('title'))
					$(item).find('button.profile.item').tooltipster({
						delay: 0,
						interactiveAutoClose: false,
						contentAsHTML: true
					});
			});

			cloned.each(function(key, item) {
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
			var htmlObject = $('<div>¿Confirmas que deseas duplicar la categoría?<br><br><label><input type="checkbox"> No volver a preguntar para este negocio.</label></div>');
			htmlObject.find('input[type="checkbox"]').change(function(event) {
				if ($(event.target).is(':checked')) {
					$('#main-container').data('clone-categoria-no-ask', true);
				}
			});
			confirm(htmlObject).done(function(data) {
				if (data) {
					cloneCategoria();
				}
			});
		}
	});

	$('section.sheet table').on('click', 'tbody button.clone.item', function(event) {
		var element = $(this);
		var cloneItem = function() {
			
			//var current = $(this).parentTo('tr');
			var current = element.parentTo('tr');

			current.find('.profile.item').tooltipster('destroy');

			var cloned = current.removeClass('focused').clone(true);
			cloned.removeUniqueId().uniqueId(); // Logs tiempo real
			cloned.insertAfter(current).removeData('id');
			cloned[0].dataset.id = '';

			current.find('button.profile.item').tooltipster({
				delay: 0,
				interactiveAutoClose: false,
				contentAsHTML: true
			});

			cloned.find('button.profile.item').tooltipster({
				delay: 0,
				interactiveAutoClose: false,
				contentAsHTML: true
			});

			cloned.trigger('beforeClone'); // Logs tiempo real
			cloned.trigger('afterClone'); // Logs tiempo real

			cloned.find('.remove.item').visible();
			cloned.find('.costo.real input').val(0);


			//updateLine({ target: cloned });

			updateSubtotalTitulos(element);
			//updateSubtotalTitulos($(event.target));
			updateSubtotalItems();

			cloned.find('[name="item[][costo_unitario]"]').trigger('focus').trigger('blur');


			$('section.sheet table.items > tfoot > tr > th.info').trigger('refresh');
		};
		if ($('#main-container').data('clone-item-no-ask')) {
			cloneItem();
		} else {
			var htmlObject = $('<div>¿Confirmas que deseas duplicar el ítem?<br><br><label><input type="checkbox"> No volver a preguntar para esta cotización.</label></div>');
			htmlObject.find('input[type="checkbox"]').change(function(event) {
				if ($(event.target).is(':checked')) {
					$('#main-container').data('clone-item-no-ask', true);
				}
			});
			confirm(htmlObject).done(function(data) {
				if (data) {
					cloneItem();
				}
			});
		}
	});

			// simon itemparent
	$('section.sheet table').on('click', 'tbody button.parent.item', function(event) {
		setParent(event, this, 'neg');
	
	});
	$('section.sheet table').on('click', 'tbody button.profile.categoria', function() {
		$('#dialog-profile').dialog('open');
	});

	$('section.sheet table').on('click', 'tbody button.detail.categoria', function(event) {
		saveRow(event, function(id) {
			unaBase.loadInto.dialog('/v3/views/cotizaciones/pop_detalle_items.shtml?id=' + id, 'Detalle de Categoría', 'x-large');
		});
	});

	$('section.sheet table').on('click', 'tbody button.detail.item', function(event) {
		// unaBase.loadInto.dialog('/v3/views/items/content.shtml?id=' + $(this).parentTo('tr').data('id'), 'Detalle de Ítem', 'x-large');
		// return true;
		if ($('section.sheet').data('readonly') || $('section.sheet').data('locked') || !(access._528 || autoriza_modificacion) || $('#main-container').data('closed'))
			unaBase.loadInto.dialog('/v3/views/items/content.shtml?id=' + $(this).parentTo('tr').data('id'), 'Detalle de Ítem', 'x-large');
		else
			saveRow(event, function(id) {
				unaBase.loadInto.dialog('/v3/views/negocios/pop_detalle_items.shtml?id=' + id, 'Detalle de Ítem', 'x-large');
			});
	});

	$('section.sheet table').on('click', 'tbody button.profile.item', function(event) {
		saveRow(event, function(id) {
			var id_item = $(event.target).closest('tr').data('producto');
			unaBase.loadInto.dialog('/v3/views/catalogo/content.shtml?id=' + id_item, 'Perfil de Ítem', 'large');
		});
	});

	$('section.sheet table').on('click', 'tbody button.show.item', function() {
		$(this).parentTo('tr').find('[type="search"]').autocomplete('search', '@').focus();
	});

	$('section.sheet table').on('click', 'tbody button.show.unidad', function() {


		let thisItem = $(this).parentTo('tr').find('[name="item[][unidad]"]');
		let value = thisItem.val();
		thisItem[0].dataset.oldValueUnit = value;
		thisItem.val('');
		thisItem.autocomplete({ minLength: 0 });
		thisItem.keydown();
	});
	$('section.sheet table').on('blur', 'tbody button.show.unidad', function() {
		
		let thisItem = $(this).parentTo('tr').find('[name="item[][unidad]"]');
		let oldValueUnit = thisItem[0].dataset.oldValueUnit;
		if(thisItem.val() === ""){
			thisItem.val(oldValueUnit);
		}
	});
	$('section.sheet table').on('click', 'tbody button.show.tipo-documento', function() {
		
		let thisTypeDoc = $(this).parentTo('tr').find('[name="item[][tipo_documento]"]');
		let value = thisTypeDoc.val();
		thisTypeDoc[0].dataset.oldValueDoc = value;
		console.log(value);
		thisTypeDoc.val('');
		thisTypeDoc.autocomplete({ minLength: 0 });
		thisTypeDoc.keydown();
	});
	$('section.sheet table').on('blur', 'tbody button.show.tipo-documento', function() {
		
		let thisTypeDoc = $(this).parentTo('tr').find('[name="item[][tipo_documento]"]');
		let oldValueDoc = thisTypeDoc[0].dataset.oldValueDoc;
		if(thisTypeDoc.val() === ""){
			thisTypeDoc.val(oldValueDoc);
		}
	});

	var findItem = function(datasource, filter, extraCallbacks, relationship) {
		var options = {
			source: function(request, response) {
				var dataParams = {
					q: request.term,
					filter: ((typeof filter != 'undefined')? filter : undefined)
				};
				if (typeof relationship != 'undefined')
					$.extend(dataParams, dataParams, {
						id: relationship.fk()
					});
				$.ajax({
					url: '/4DACTION/_V3_' + 'get' + datasource + ((typeof relationship != 'undefined')? 'by' + relationship.by : ''),
					dataType: 'json',
					data: dataParams,
					success: function(data) {
						response($.map(data.rows, function(item) {
							return item;
						}));
					}
				});
			},
			minLength: 0,
			open: function() {
				$(this).removeClass('ui-corner-all').addClass('ui-corner-top');
			},
			close: function() {
				$(this).removeClass('ui-corner-top').addClass('ui-corner-all');
			}
		};

		$.extend(options, options, extraCallbacks);

		return options;
	};

	$('input[name^="cotizacion"]').keypress(function(event) {
		if (event.charCode == 13) {
			var nextSibling = $("input:visible,textarea:visible")[$("input:visible,textarea:visible").index() + 1];
			nextSibling.focus();
			return false;
		}
	});

	// $('table.items').delayed('blur', 1, 'tbody th input', {}, function(event) {
	$('table.items').on('blur', 'tbody th input', function(event) {
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
							confirm('La categoría &laquo;' + $(element).parentTo('tr').find('[name="item[][nombre]"]').val().trim() + '&raquo; no existe en el catálogo.\n\n¿Desea crearla?').done(function(data) {
								if (data)
									$.ajax({
										url: '/4DACTION/_V3_setCategoria',
										data: {
											text: $(element).parentTo('tr').find('[name="item[][nombre]"]').val()
										},
										dataType: 'json',
										success: function(subdata) {
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

	var updateLine = function(event) {
		// Interceptar si el campo nombre ya fue guardado
		if ($(event.target).prop('name') == 'item[][nombre]') {
			var $input = $(event.target);
			var $row = $input.closest('tr');
			var itemId = $row.data('id');
			
		if ((itemId || $input.data('item-guardado') || $row.data('nombre-bloqueado')) && !$row.hasClass('title') && !$row.hasClass('itemParent')) {
			console.log('[updateLine] Bloqueando actualización del nombre. Item ID:', itemId);
				// Restaurar valor original
				var originalValue = $input.data('nombre-original') || $input.attr('data-original-value');
				if (originalValue && $input.val() !== originalValue) {
					$input.val(originalValue);
				}
				// Forzar readonly y estilos
				$input.prop('readonly', true);
				$input.attr('readonly', 'readonly');
				$input.css({
					'pointer-events': 'none',
					'background-color': '#f5f5f5',
					'cursor': 'not-allowed',
					'opacity': '0.7'
				});
				// Prevenir que continúe la ejecución
				return false;
			}
		}

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
				var is_valid = (margen_desde_compra &&  margen >= 0 && ( (margen_desde_compra_inverso && margen < 100) || !margen_desde_compra_inverso ) ) || (!margen_desde_compra && margen >= 0 && margen <= 100);

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
			//var element = this;
			var element = event.target;
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
											target.data('formula-productor-ejecutivo-ratio', ui.item.formula_productor_ejecutivo_ratio);
											// Bloquear nombre, tipo documento y cantidades
											target.find('[name="item[][nombre]"]').prop('readonly', true);
											target.find('button.show.item').invisible();
											target.find('[name="item[][tipo_documento]"]').prop('readonly', true);
											target.find('button.show.tipo-documento').hide();
											target.find('[name="item[][cantidad]"]').prop('readonly', true);
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
											target.find('[name="item[][cantidad]"]').prop('readonly', true);
											target.find('[name="item[][factor]"]').prop('readonly', true);
										} else {
											target.removeData('formula-asistente-produccion');
										}

										if (ui.item.porcentaje_monto_total || ui.item.formula_productor_ejecutivo || ui.item.formula_asistente_produccion) {
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

										target.find('[name="item[][aplica_sobrecargo]"]').prop('checked', ui.item.aplica_sobrecargo);

										target.find('[name="item[][ocultar_print]"]').prop('checked', ui.item.ocultar_print);

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
											<p>' + ui.item.text.replace("\n", '<p>&nbsp;</p>') + '</p> \
											<p>&nbsp;</p> \
											<p>Descripción larga:</p> \
											<p>' + ((ui.item.observacion!= '')? ui.item.observacion.replace(/\n/g, '</p><p>') : 'N/A') + '</p> \
											<p>&nbsp;</p>\
											<p>Observación interna:</p> \
											<p>' + ((ui.item.comentario!= '')? ui.item.comentario.replace(/\n/g, '</p><p>') : 'N/A') + '</p> \
										';
										target.find('button.profile.item').tooltipster('update', tooltip);

										// Mostrar signo de admiración (ui-icon-notice) si el ítem tiene comentario
							            // caso contrario mostrar ícono normal (ui-icon-gear)
							            if (ui.item.comentario != '') {
							                target.find('button.profile.item').removeClass('ui-icon-gear').addClass('ui-icon-notice');
							            } else {
							                target.find('button.profile.item').removeClass('ui-icon-notice').addClass('ui-icon-gear');
							            }

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
										target.data('tipo-documento', 30);
										target.find('input[name="item[][tipo_documento]"]').val('F');
										if (typeof ui.item.tipo_documento != 'undefined' && ui.item.tipo_documento.id != 30) {
											target.data('tipo-documento', ui.item.tipo_documento.id);
											target.data('tipo-documento-text', ui.item.tipo_documento.text);
											target.data('tipo-documento-ratio', ui.item.tipo_documento.ratio);
											target.data('tipo-documento-valor-usd', ui.item.tipo_documento.ratio); // Impuesto extranjero
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

										if ((typeof ui.item.tipo_documento != 'undefined' && ui.item.tipo_documento.id != 30) || typeof ui.item.hora_extra != 'undefined')
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
												success: function(data) {
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
										confirm('El ítem &laquo;' + $(element).parentTo('tr').find('[name="item[][nombre]"]').val().trim() + '&raquo; no existe en el catálogo.\n\n¿Desea crearlo?').done(function(data) {
											if (data)
												$.ajax({
													url: '/4DACTION/_V3_setProductoByCategoria',
													data: {
														id: $(element).parentTo('tr').prevTo('tr.title').data('categoria'),
														text: $(element).parentTo('tr').find('[name="item[][nombre]"]').val()
													},
													dataType: 'json',
													success: function(subdata) {
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
				$(event.target).data('old-value', $(event.target).val());
				$(event.target).unbind('.format');
				$(event.target).number(true, decimals, ',', '.');
				console.log('Precio unitario sin decimales es: ' + parseFloat($(event.target).val()).toFixed(0).toString());

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

	};

	$('table.items').on('focus', 'tbody td input[name="item[][precio_unitario]"]', function(event) {
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
				console.log('Precio unitario con decimales es: ' + parseFloat($(event.target).val()).toString());
			//	$(event.target).data('first-focusin', false);
			//	$(event.target).removeData('first-focusout');
			//}
		}
	});

	$('table.items').on('focus', 'tbody td input[name="item[][costo_unitario]"]', function(event) {
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
				$(event.target).unbind('.format');
				$(event.target).number(true, decimals + 2, ',', '.');
				$(event.target).val($(event.target).data('old-value'));
				console.log('Costo unitario con decimales es: ' + parseFloat($(event.target).val()).toString());
				$(event.target).data('first-focusin', false);
				$(event.target).removeData('first-focusout');
			}
		}
	});

	$('table.items').on('focus', 'tbody td input[name="item[][cantidad]"]', function(event) {
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

	$('table.items').on('focus', 'tbody td input[name="item[][factor]"]', function(event) {
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

	$('table.items').on('focus', 'tbody input[name="item[][margen_compra]"], tbody input[name="item[][margen_venta]"]', function(event) {
		$(event.target).data('old-value', $(event.target).val());
	});

	$('table.items').on('blur', 'tbody th input[name="item[][margen_compra]"], tbody th input[name="item[][margen_venta]"]', function(event) {

		var margen = parseFloat($(event.target).val());
		var is_valid = (margen_desde_compra &&  margen >= 0 && ( (margen_desde_compra_inverso && margen < 100) || !margen_desde_compra_inverso ) ) || (!margen_desde_compra && margen >= 0 && margen <= 100);

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
		items.each(function() {
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

	$('table.items').on('focus', 'tfoot th input[name="cotizacion[margenes][margen_venta]"], tfoot th input[name="cotizacion[margenes][margen_compra]"]', function(event) {
		$(event.target).data('old-value', $(event.target).val());
	});

	$('table.items').on('blur', 'tfoot th input[name="cotizacion[margenes][margen_venta]"], tfoot th input[name="cotizacion[margenes][margen_compra]"]', function(event) {
		if (event.originalEvent !== undefined) {
			var margen = parseFloat($(event.target).val());
			var is_valid = (margen_desde_compra &&  margen >= 0 && ( (margen_desde_compra_inverso && margen < 100) || !margen_desde_compra_inverso ) ) || (!margen_desde_compra && margen >= 0 && margen <= 100);
			if (is_valid) {
				unaBase.ui.block();
				var margen_fijo = $(this).closest('tr').find('[name="cotizacion[margenes][fijo]"]').prop('checked');
				$(this).closest('tr').find('[name="cotizacion[margenes][fijo]"]').prop('checked', false).trigger('change');
				var new_margen = parseFloat($(this).val());
				var titulos = $('table.items tbody').find('tr.title');
				titulos.each(function() {
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

	$('table.items').on('change', 'tfoot th input[name="cotizacion[margenes][fijo]"]', function(event) {
		var checked = $(event.target).is(':checked');

		var changeMargenFijo = function(event) {
			if (event.originalEvent !== undefined)
				unaBase.ui.block();

			var items = $('table.items tbody').find('tr:not(.title)');
			if (margen_desde_compra) {
				var margen = $('table.items tfoot th input[name="cotizacion[margenes][margen_compra]"]');
			} else {
				var margen = $('table.items tfoot th input[name="cotizacion[margenes][margen_venta]"]');
			}
			items.each(function() {
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
			confirm('¿Desea cambiar a margen fijo?\n\nEsto podría cambiar los montos.').done(function(data) {
				if (data) {
					changeMargenFijo(event);
				} else {
					event.preventDefault();
					$(event.target).prop('checked', false);
				}
			}).fail(function() {
				$(event.target).prop('checked', false);
			});
		} else {
			changeMargenFijo(event);
		}


	});

	$('table.items').on('keypress', 'tbody tr input', function(event) {
		var target = $(this).parentTo('tr');
		switch(event.keyCode) {
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

	/* $('table.items').delayed('focus', 100, 'tbody button', function(event) {
		// FIXME: revisar, ya que al hacer tab hacia atrás no está permitiendo que se seleccione un campo previo
		$.emulateTab();
	}); */

	// Sobrecargo cinemágica
	if (v3_sobrecargos_cinemagica) {
		$('section.sheet footer .block-totales').on('blur', '[name="sobrecargo[1][subtotal]"]', function(event) {
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
			$('table.items.cotizacion').find('tr.title').each(function(key, item) {
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


	$('section.sheet footer .block-totales').on('blur', '[name^="sobrecargo"][name$="[porcentaje]"]', function(event) {

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
					updateSobrecargos();
				} else {
					for (var i = 0; i <= 10; i++) {
						if (v3_sobrecargos_cinemagica) {
							updateItemsPorcentaje(event);
						}
						updateSobrecargos();
					}
				}
			} else
				updateSobrecargos();
		}
	});

	$('section.sheet footer .block-totales').on('blur', '[name^="sobrecargo"][name$="[valor]"]', function(event) {
		if (event.isSimulated)
			return false;

		if (!scDirectInput) {

			var valor_sobrecargo_anterior = parseFloat($(this).data('old-value'));
			var valor_sobrecargo_actual = parseFloat($(this).val());
			if (valor_sobrecargo_anterior != valor_sobrecargo_actual) {
				var base_total_sobrecargo = parseFloat($('input[name="cotizacion[montos][subtotal_neto]"]').val());
				var porcentaje_sobrecargo = 0;
				if ($(this).parentTo('li').find('[name^="sobrecargo"][name$="[porcentaje]"]').prop('readonly')) {
					var subtotal_sobrecargo_previo = ($(this).parentTo('li').prev().length)? $(this).parentTo('li').prev().find('[name^="sobrecargo"][name$="[subtotal]"]').val() : $('input[name="cotizacion[precios][subtotal]"]').val();
					porcentaje_sobrecargo = (valor_sobrecargo_actual / subtotal_sobrecargo_previo) * 100;
				} else
					porcentaje_sobrecargo = (valor_sobrecargo_actual / base_total_sobrecargo) * 100;

				$(this).parentTo('li').find('[name^="sobrecargo"][name$="[porcentaje]"]').val(porcentaje_sobrecargo.toFixed(2));

				updateSobrecargos();
			}
			$(this).triggerHandler('focus');

			if ($(this).parentTo('li').find('[name^="sobrecargo"][name$="[porcentaje]"]').prop('readonly'))
				$('[name="cotizacion[descuento][valor]"]').triggerHandler('blur');


		}

		updateSobrecargos();

	});

	$('section.sheet footer').on('change', 'li[data-ajuste="true"] [name^="sobrecargo"][name$="[cerrado]"]', function() {
		totales.checkAjuste(true);
	});

	$('section.sheet footer').on('change', '[name^="sobrecargo"][name$="[cerrado]"]', function() {
		updateSobrecargos();
	});

	$('[name="cotizacion[descuento][porcentaje]"]').on('focus', function() {
	    $(this).data('old-value', $(this).val());
	});

	$('[name="cotizacion[descuento][porcentaje]"]').on('blur', function() {
	    var old_value = $(this).data('old-value');
	    var porcentaje_descuento = parseFloat($(this).val());
	    if (porcentaje_descuento >= 0.00 && porcentaje_descuento <= 100.00) {
	        for (var i = 0; i < 20; i++) {
	            var subtotal_precios = parseFloat($('[name="cotizacion[precios][subtotal]"]').val());
	            var subtotal_sobrecargos = parseFloat($('[name="cotizacion[sobrecargos][subtotal]"]').val());

	            var valor_descuento = (subtotal_precios + subtotal_sobrecargos) * porcentaje_descuento / 100.00;
	            if (typeof selected_currency == 'undefined')
	                $('[name="cotizacion[descuento][valor]"]').val(valor_descuento.toFixed(currency.decimals));
	            else
	                $('[name="cotizacion[descuento][valor]"]').val(valor_descuento.toFixed(2));

	            $('[name="cotizacion[descuento][valor]"]').trigger('blur');

	            // updateSubtotalNeto();
	            updateSobrecargos();
	        }
	    } else {
	        toastr.warning('El porcentaje del descuento debe estar entre 0 y 100');
	        $(this).val($(this).data('old-value'));
	    }
	});

	$('[name="cotizacion[descuento][valor]"]').on('blur', function() {
	    $(this).validateNumbers();
	    var subtotal_precios = parseFloat($('[name="cotizacion[precios][subtotal]"]').val());
	    var subtotal_sobrecargos = parseFloat($('[name="cotizacion[sobrecargos][subtotal]"]').val());
	    var valor_descuento = parseFloat($(this).val());

	    var porcentaje_descuento = valor_descuento/ (subtotal_precios + subtotal_sobrecargos) * 100.00;

	    if (valor_descuento >= 0 && valor_descuento <= subtotal_precios + subtotal_sobrecargos) {
	        $('[name="cotizacion[descuento][porcentaje]"]').val(porcentaje_descuento.toFixed(6));
	    } else {
	        toastr.warning('El monto del descuento no debe ser mayor al total');
	        var zero = 0;
	        $('[name="cotizacion[descuento][porcentaje]"]').val(zero.toFixed(6));

	    }

	    // updateSubtotalNeto();
	    updateSobrecargos();

	});

	$('[name="cotizacion[ajuste]"]').on('change', function(event) {
		if (typeof event.originalEvent != 'undefined') {
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
			$('table.items tbody').find('tr').each(function() {
				if (typeof $(this).data('porcentaje-monto-total') == 'object') {
					item = $(this);

					var id_item = item.data('id');
					var cantidad = parseFloat(item.find('input[name="item[][cantidad]"]').data('old-value'));
					var factor = parseFloat(item.find('input[name="item[][factor]"]').data('old-value'));
					var porcentaje_monto_total = $(this).data('porcentaje-monto-total');

					precio_unitario = total_a_cliente * porcentaje_monto_total / (cantidad * factor);

					if (typeof item != 'undefined' && ((fixedTotalCliente && (precio_unitario == 0 || precio_unitario != parseFloat((item.find('input[name="item[][precio_unitario]"]').data('old-value'))? item.find('input[name="item[][precio_unitario]"]').data('old-value') : item.find('input[name="item[][precio_unitario]"]').val()))) || !fixedTotalCliente))
						item.find('input[name="item[][precio_unitario]"]').val(precio_unitario).data('old-value', precio_unitario).trigger('blur');
				}
			});
		}

		$(this).validateNumbers();

		var valor_ajuste = parseFloat($(this).val());
		var subtotal_neto = parseFloat($('input[name="cotizacion[montos][subtotal_neto]"]').val());
		var sobrecargo = parseFloat($('section.sobrecargos li[data-ajuste="true"] input[name$="[valor]"]').val());

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

		$('section.sobrecargos li[data-ajuste="true"] input[name$="[valor]"]').val($(this).data('value')).trigger('blur');
		$('[name="cotizacion[ajuste][diferencia]"]').val($(this).data('value'));

		if (parseFloat($(this).val()) != parseFloat($(this).data('target-value'))) {
			
				unaBase.ui.unblock();
				
				$('input[name="sobrecargo[5][valor]"]').val($('input[name="cotizacion[ajuste][diferencia]"]').val());
			
		} else {
			unaBase.ui.unblock();
			if (diferencia_ajuste != 0) {
				$('[name="cotizacion[montos][subtotal_neto]"]').addClass('ajustado');
			} else
				$('[name="cotizacion[montos][subtotal_neto]"]').removeClass('ajustado');
		}
	});

	$('button.reset.ajuste').button({
		caption: 'Restablecer ajuste',
		icons: {
			primary: 'ui-icon-circle-close'
		},
		text: false
	}).click(function() {
		totalNeto = 0;
		unaBase.ui.block();
		$('section.sobrecargos li[data-ajuste="true"] input[name$="[valor]"]').val(0).trigger('change');
		$('input[name="cotizacion[ajuste][diferencia]"]').val(0);
		unaBase.ui.unblock();
		toastr.info('Ajuste restablecido con éxito.');
		$(this).hide();
		for (var i = 0; i <= 24; i++)
			updateSobrecargos();
	});

	$('[name="cotizacion[montos][impuesto][exento]"]').change(function(event) {
		// Confirmar modificación check exento
		confirm('¿Está seguro de modificar el estado exento del negocio?<br>-Esto podría cambiar los valores totales.').done(function(data) {
			if (data) {
				calcValoresCinemagica();
			} else {
				$(event.target).prop('checked', !$(event.target).prop('checked'));
			}
		}).fail(function() {
			$(event.target).prop('checked', !$(event.target).prop('checked'));
		});
	});


	getDetail(function() {
		var detalle_items = $('section.sheet.detalle-items');

		if (detalle_items.data('readonly') || detalle_items.data('locked') || !(access._528 || autoriza_modificacion)) {
			$('table.items button.toggle.all').trigger('click');
			detalle_items.find('input, textarea, tr *:not(.dropdown-button) span').not('[name="item[][selected]"]').not('.dropdown-button').prop('disabled', true).removeAttr('placeholder');
			if (v3_mod_gastop_compras_cerradas && cerradoCompras) {
			    detalle_items.find('input[name="item[][costo_unitario]"]').prop('disabled', false);
				detalle_items.find('input[name="item[][subtotal_costo]"]').prop('disabled', false);
			}
			detalle_items.find('tr button, ul.editable button, footer button, .fetch.exchange-rate').not('.detail').not('.dropdown-button').not('[name="item[][closed_compras]"]').hide();
			detalle_items.find('table.items > * > tr > *:first-of-type > *').hide();
			detalle_items.find('table.items tbody tr').draggable('destroy');
			detalle_items.find('[name="cotizacion[currency][working]"], [name="cotizacion[tipo_cambio]"]').prop('disabled', true);
		}

		if ((access._528 || autoriza_modificacion) && access._578 && negocioFacturado) {
			detalle_items.find('[name="item[][tipo_documento]"]').prop('readonly', true);
			detalle_items.find('[name="item[][cantidad]"]').prop('readonly', true);
			detalle_items.find('[name="item[][factor]"]').prop('readonly', true);
			detalle_items.find('[name="item[][horas_extras]"]').prop('readonly', true);
			detalle_items.find('[name="item[][precio_unitario]"]').prop('readonly', true);
			detalle_items.find('[name="item[][subtotal_precio]"]').prop('readonly', true);
			detalle_items.find('[name="item[][margen_compra]"]').prop('disabled', true);
			detalle_items.find('[name="item[][margen_venta]"]').prop('disabled', true);
			detalle_items.find('[name="item[][aplica_sobrecargo]"]').prop('disabled', true);
			detalle_items.find('[name="cotizacion[margenes][margen_compra]"]').prop('disabled', true);
			detalle_items.find('[name="cotizacion[margenes][margen_venta]"]').prop('disabled', true);
			detalle_items.find('[name="cotizacion[margenes][fijo]"]').prop('disabled', true);
			detalle_items.find('[name*="sobrecargo"]').prop('disabled', true);
			detalle_items.find('[name*="cotizacion[descuento]"]').prop('disabled', true);
			detalle_items.find('[name*="cotizacion[ajuste]"]').prop('disabled', true);
			detalle_items.find('[name="cotizacion[montos][impuesto][exento]"]').prop('disabled', true);
		}

		// Permiso bloquear sección venta (negocios)
		if (access._590) {
			detalle_items.find('[name="item[][codigo]"]').prop('readonly', true);
			detalle_items.find('[name="item[][nombre]"]').prop('readonly', true);
			detalle_items.find('button.show.item').hide();
			detalle_items.find('button.show.tipo-documento').hide();
		}

		// Hacer readonly el campo nombre de items que ya fueron guardados (tienen data-id)
		$('section.sheet table.items tbody tr').each(function() {
			var $row = $(this);
			var itemId = $row.data('id');
		// Si el item tiene un ID (ya fue guardado) y NO es una categoría, hacer readonly el campo nombre
		if (itemId && !$row.hasClass('title') && !$row.hasClass('itemParent')) {
				var nombreInput = $row.find('[name="item[][nombre]"]');
				nombreInput.prop('readonly', true);
				nombreInput.attr('readonly', 'readonly'); // Asegurar que quede readonly
				// Agregar estilo CSS para prevenir interacción
				nombreInput.css({
					'pointer-events': 'none',
					'background-color': '#f5f5f5',
					'cursor': 'not-allowed'
				});
				nombreInput.data('item-guardado', true); // Marcar como guardado
				$row.data('nombre-bloqueado', true);
				$row.find('button.show.item').hide();
				$row.find('button.ui-icon-document.detail.item').hide();
				// Destruir autocomplete si existe
				if (nombreInput.hasClass('ui-autocomplete-input')) {
					nombreInput.autocomplete('destroy');
				}
			}
		});

		// Interceptor: Prevenir cualquier intento de editar el nombre si el item ya fue guardado
		// Usar captura para interceptar ANTES que otros handlers
		$(document).on('mousedown keydown focus focusin input change keypress', 'section.sheet table tbody tr:not(.title):not(.itemParent) input[name="item[][nombre]"]', function(e) {
			var $input = $(this);
			var $row = $input.closest('tr');
			var itemId = $row.data('id');
			
			if ((itemId || $input.data('item-guardado') || $row.data('nombre-bloqueado')) && !$row.hasClass('title') && !$row.hasClass('itemParent')) {
				console.log('[INTERCEPTOR] Bloqueando edición. Item ID:', itemId, 'Evento:', e.type);
				
				// Si es un evento de input o change, restaurar el valor original
				if (e.type === 'input' || e.type === 'change' || e.type === 'keypress') {
					var originalValue = $input.data('nombre-original') || $input.attr('data-original-value');
					if (originalValue && $input.val() !== originalValue) {
						console.log('[INTERCEPTOR] Restaurando valor original:', originalValue);
						$input.val(originalValue);
					}
				}
				
				// Prevenir la acción
				e.preventDefault();
				e.stopPropagation();
				e.stopImmediatePropagation();
				
				// Forzar readonly y estilos
				$input.prop('readonly', true);
				$input.attr('readonly', 'readonly');
				$input.css({
					'pointer-events': 'none',
					'background-color': '#f5f5f5',
					'cursor': 'not-allowed',
					'opacity': '0.7'
				});
				
				if (e.type !== 'change') {
					$input.blur();
				}
				return false;
			}
		});
		
		// MutationObserver para detectar cuando se remueve el readonly
		if (typeof MutationObserver !== 'undefined') {
			var observer = new MutationObserver(function(mutations) {
				mutations.forEach(function(mutation) {
					if (mutation.type === 'attributes' && mutation.attributeName === 'readonly') {
						var $input = $(mutation.target);
						var $row = $input.closest('tr');
						var itemId = $row.data('id');
						
						if ((itemId || $input.data('item-guardado') || $row.data('nombre-bloqueado')) && !$row.hasClass('title') && !$row.hasClass('itemParent')) {
							if (!$input.prop('readonly')) {
								console.log('[MUTATION] Detectado readonly removido, restaurando...');
								$input.prop('readonly', true);
								$input.attr('readonly', 'readonly');
								$input.css({
									'pointer-events': 'none',
									'background-color': '#f5f5f5',
									'cursor': 'not-allowed',
									'opacity': '0.7'
								});
							}
						}
					}
				});
			});
			
			// Observar todos los campos nombre
			$('section.sheet table.items tbody tr:not(.title) input[name="item[][nombre]"]').each(function() {
				observer.observe(this, {
					attributes: true,
					attributeFilter: ['readonly', 'disabled']
				});
			});
		}

		// Interceptor: Restaurar readonly si se intenta remover
		var restoreReadonly = function() {
			$('section.sheet table.items tbody tr:not(.title):not(.itemParent)').each(function() {
				var $row = $(this);
				var itemId = $row.data('id');
				if ((itemId || $row.data('nombre-bloqueado')) && !$row.hasClass('title') && !$row.hasClass('itemParent')) {
					var nombreInput = $row.find('[name="item[][nombre]"]');
					if (!nombreInput.prop('readonly')) {
						nombreInput.prop('readonly', true);
						nombreInput.attr('readonly', 'readonly');
						nombreInput.css({
							'pointer-events': 'none',
							'background-color': '#f5f5f5',
							'cursor': 'not-allowed'
						});
					}
					// Asegurar que los botones estén ocultos
					$row.find('button.show.item').hide();
					$row.find('button.ui-icon-document.detail.item').hide();
				}
			});
		};

		// Verificar periódicamente que el readonly se mantenga
		setInterval(restoreReadonly, 500);

		// Permiso bloquear gasto presupuestado (negocios)
		if (access._594 && !v3_mod_gastop_compras_cerradas) {
			detalle_items.find('[name="item[][costo_unitario]"]').prop('readonly', true);
			detalle_items.find('[name="item[][subtotal_costo]"]').prop('readonly', true);
		}

		// Permiso bloquear modificación columna previo
		if (access._621) {
			detalle_items.find('[name="item[][costo_unitario_previo]"]').prop('readonly', true);
		}

		if (!modoOffline)
			updateSubtotalItems();


		// Sección datos cinemágica

		blockCinemagica.find('[name="sobrecargo[1][subtotal][usd]"]').number(true, 2, ',', '.');

		blockCinemagica.find('.numeric.percent input').bind('focus', function() {
			if (typeof $(this).data('value') == 'undefined')
				$(this).data('value', $(this).val());
			$(this).unbind('.format').number(true, 6, ',', '.').val($(this).data('value'));
		});

		blockCinemagica.find('.numeric.percent input').bind('focusout', function(event) {
			$(this).data('value', $(this).val()).unbind('.format').number(true, 2, ',', '.');
		});

		// Sección sobrecargos cinemagica
		//refreshValorPeliculaFromSobrecargos();
		//blockCinemagica.find('[name="sobrecargo[1][porcentaje]"]').on('blur', refreshUtilidadBrutaToSobrecargos);
		blockCinemagica.find('[name="sobrecargo[1][porcentaje]"]').on('blur', calcValoresCinemagica);
		//blockCinemagica.find('[name="sobrecargo[1][subtotal]"]').on('blur', refreshValorPeliculaToSobrecargos);
		blockCinemagica.find('[name="sobrecargo[1][subtotal]"]').on('blur', function(event) { calcValoresCinemagica(event); calcValoresCinemagica(event); });
		//blockCinemagica.find('[name="sobrecargo[4][porcentaje]"]').on('blur', refreshCostosFijosToSobrecargos);
		blockCinemagica.find('[name="sobrecargo[4][porcentaje]"]').on('blur', calcValoresCinemagica);
		blockCinemagica.find('[name="sobrecargo[4][valor]"]').on('blur', (event) =>{
			calculaSobrecargoManual(event);
		});
		//blockCinemagica.find('[name="sobrecargo[6][porcentaje]"]').on('blur', refreshComisionAgenciaToSobrecargos);
		blockCinemagica.find('[name="sobrecargo[6][porcentaje]"]').on('blur', calcValoresCinemagica);
		blockCinemagica.find('[name="sobrecargo[6][valor]"]').on('blur', (event) =>{
			calculaSobrecargoManual(event);
		});
		
		//blockCinemagica.find('[name="cotizacion[cinemagica][director][porcentaje]"]').on('blur', refreshDirector);
		blockCinemagica.find('[name="cotizacion[cinemagica][director][porcentaje]"]').on('blur', calcValoresCinemagica);

    /// Permisos por columna
		columnsPermissions();

		business.staff.checkShowTotals();
	});

	var showSobrecargos = function(data) {
		
        var index_utilidad_bruta = totales.utilities.fastArrayObjectSearch(data.rows, 'id', 1);
        var index_costos_fijos = totales.utilities.fastArrayObjectSearch(data.rows, 'id', 4);
        var index_comision_agencia = totales.utilities.fastArrayObjectSearch(data.rows, 'id', 6);
        try{
	        blockCinemagica.find('[name="sobrecargo[1][porcentaje]"]').val(data.rows[index_utilidad_bruta].porcentaje);
	        blockCinemagica.find('[name="sobrecargo[1][valor]"]').val(data.rows[index_utilidad_bruta].valor);

	        blockCinemagica.find('[name="sobrecargo[4][porcentaje]"]').val(data.rows[index_costos_fijos].porcentaje);
	        blockCinemagica.find('[name="sobrecargo[4][valor]"]').val(data.rows[index_costos_fijos].valor);

	        blockCinemagica.find('[name="sobrecargo[6][porcentaje]"]').val(data.rows[index_comision_agencia].porcentaje);
	        blockCinemagica.find('[name="sobrecargo[6][valor]"]').val(data.rows[index_comision_agencia].valor);

	        blockCinemagica.find('[name="sobrecargo[1][subtotal]"]').val(valor_pelicula_guardado);
			blockCinemagica.find('[name="sobrecargo[1][subtotal]"]').data('old-value', valor_pelicula_guardado);

	        blockCinemagica.find('[name="cotizacion[cinemagica][director][porcentaje]"]').val(director_porcentaje_guardado);

        }catch(err){
        	console.log(err)
        }

	};

	if ($('section.sheet').data('new'))
		$.ajax({
			url: '/4DACTION/_V3_getSobrecargo',
			dataType: 'json',
			async: false,
			cache: false,
			data: {
				id: $('section.sheet').data('id')
			},
			success: showSobrecargos
		});
	else
		$.ajax({
			url: '/4DACTION/_V3_getSobrecargoByCotizacion',
			dataType: 'json',
			async: false,
			cache: false,
			data: {
				id: $('section.sheet').data('id')
			},
			success: showSobrecargos
		});

	/*
	totales.checkAjuste($('section.sheet').data('new'));
	if (!modoOffline)
		updateSubtotalItems();
	*/

	var showHelp = function() {
		$('[data-help]').each(function() {
			$(this).qtip({
				content: {
					text: $(this).data('help')
				}
			}).on('click focus', function() {
				$(this).qtip('hide');
			})
			$(this).qtip('show');
		});

		$('section.sheet').bind('scroll mousewheel', function() {
			$('[data-help]').each(function() {
				$(this).qtip('hide');
			});
			$('section.sheet').unbind('scroll mousewheel');
		});
	};

	var hideHelp = function() {
		$('[data-help]').each(function() {
			$(this).qtip('hide');
		});
	};

	// FIXME: Se deshabilita hasta poder corregirlo
	/* if ($('section.sheet').data('new')) {
		setTimeout(showHelp, 1000);
	}; */


	var updatePrecioCotizado = function(event) {

		var exchange_rate_usd = (valor_usd_cotizacion > 0)? valor_usd_cotizacion : valor_usd;
		var exchange_rate_clf = (valor_clf_cotizacion > 0)? valor_clf_cotizacion : valor_clf;

		// Impuesto extranjero 0%
		//if ($(this).parentTo('tr').data('tipo-documento') && $(this).parentTo('tr').data('tipo-documento-ratio')) {
		if ($(this).parentTo('tr').data('tipo-documento') && ($(this).parentTo('tr').data('tipo-documento-ratio') || (!$(this).parentTo('tr').data('tipo-documento-ratio') && $(this).parentTo('tr').data('tipo-documento-valor-usd'))) ) {

			if (typeof selected_currency == 'undefined') {
				// Corrección cuando se ocultan decimales
				//var valor_negociado = parseFloat($(this).val());
				if ($(this).data('old-value'))
					var valor_negociado = parseFloat($(this).data('old-value'));
				else
					var valor_negociado = parseFloat($(this).val());
			} else {
				// Corrección cuando se ocultan decimales
				//var valor_negociado = parseFloat($(this).val());
				if ($(this).data('old-value'))
					var valor_negociado = parseFloat($(this).data('old-value'));
				else
					var valor_negociado = parseFloat($(this).val());
			}

			var impuesto = $(this).parentTo('tr').data('tipo-documento-ratio');
			var is_valor_usd = $(this).parentTo('tr').data('tipo-documento-valor-usd'); // Impuesto extranjero
			var division = $(this).parentTo('tr').data('tipo-documento-inverse');

			var base_imponible = 0;

			$(this).addClass('edited');
			$(this).parentTo('tr').find('button.detail.price').visible();

			if (typeof selected_currency == 'undefined') {
				if (division) {
					 // Impuesto extranjero
					if (is_valor_usd)
						base_imponible = (valor_negociado / (1.00 - impuesto)) * exchange_rate_usd;
					else
						base_imponible = valor_negociado / (1.00 - impuesto);
				} else
					base_imponible = valor_negociado * (1.00 + impuesto);
			} else {
				if (division) {
					// Impuesto extranjero
					if (is_valor_usd)
						base_imponible = (valor_negociado / (1.00 - impuesto)) * exchange_rate_usd;
					else
						base_imponible = valor_negociado / (1.00 - impuesto);
				} else
					base_imponible = valor_negociado * (1.00 + impuesto);
			}

			$(this).val(base_imponible);
			// Corrección cuando se ocultan decimales
			$(this).data('old-value', base_imponible);

			$(this).parentTo('tr').data('base-imponible', base_imponible);

			if ($(this).hasClass('special')) {
				var hora_extra_cantidad = parseFloat($(this).parentTo('tr').find('input[name="item[][horas_extras]"]').val());
				$(this).parentTo('tr').find('input[name="item[][horas_extras]"]').trigger('change');

				var hora_extra_valor = $(this).parentTo('tr').data('hora-extra-valor');
				$(this).val(base_imponible + (hora_extra_valor * hora_extra_cantidad));
				// Corrección cuando se ocultan decimales
				$(this).data('old-value', base_imponible + (hora_extra_valor * hora_extra_cantidad));
			}

		}
		if (typeof $(event.target).data('undo') == 'undefined')
			$(event.target).data('undo', true);

		$(this).parentTo('tr').find('[name="item[][cantidad]"]').trigger('focus').trigger('blur');

		if ($(this).parentTo('tr').find('[name="item[][costo_unitario]"]').data('auto'))
			$(this).parentTo('tr').find('[name="item[][costo_unitario]"]').val(($(this).data('old-value'))? $(this).data('old-value') : $(this).val()).trigger('blur');

	};

	var updatePrecioNegociado = function(event) {

		var exchange_rate_usd = (valor_usd_cotizacion > 0)? valor_usd_cotizacion : valor_usd;
		var exchange_rate_clf = (valor_clf_cotizacion > 0)? valor_clf_cotizacion : valor_clf;

		// Impuesto extranjero 0%
		//if ($(this).parentTo('tr').data('tipo-documento') && $(this).parentTo('tr').data('tipo-documento-ratio')) {
		if ($(this).parentTo('tr').data('tipo-documento') && ($(this).parentTo('tr').data('tipo-documento-ratio') || (!$(this).parentTo('tr').data('tipo-documento-ratio') && $(this).parentTo('tr').data('tipo-documento-valor-usd'))) ) {

			if ($(this).hasClass('special')) {
				// Corrección ocultar decimales
				//var valor_a_cotizar = parseFloat($(this).val());
				if ($(this).data('old-value'))
					var valor_a_cotizar = parseFloat($(this).data('old-value'));
				else
					var valor_a_cotizar = parseFloat($(this).val());
				var hora_extra_cantidad = parseFloat($(this).parentTo('tr').find('input[name="item[][horas_extras]"]').val());

				if (typeof $(this).parentTo('tr').data('hora-extra-valor') == 'undefined')
					$(this).parentTo('tr').find('input[name="item[][horas_extras]"]').trigger('change');

				var hora_extra_valor = $(this).parentTo('tr').data('hora-extra-valor');

				$(this).val(valor_a_cotizar - Math.round(hora_extra_valor * hora_extra_cantidad));
				// Corrección ocultar decimales
				$(this).data('old-value', valor_a_cotizar - (hora_extra_valor * hora_extra_cantidad));
			}

			// Corrección ocultar decimales
			//var valor_a_cotizar = parseFloat($(this).val());
			if ($(this).data('old-value'))
				var valor_a_cotizar = parseFloat($(this).data('old-value'));
			else
				var valor_a_cotizar = parseFloat($(this).val());

			var impuesto = $(this).parentTo('tr').data('tipo-documento-ratio');
			var is_valor_usd = $(this).parentTo('tr').data('tipo-documento-valor-usd'); // Impuesto extranjero
			var multiplicacion = $(this).parentTo('tr').data('tipo-documento-inverse');

			var valor_cotizado = 0;

			$(this).removeClass('edited');
			$(this).parentTo('tr').find('button.detail.price').invisible();

			if (multiplicacion) {
				// Impuesto extranjero
				if (is_valor_usd)
					valor_cotizado = (valor_a_cotizar * (1 - impuesto)) / exchange_rate_usd;
				else
					valor_cotizado = valor_a_cotizar * (1 - impuesto);
			} else
				valor_cotizado = valor_a_cotizar / (1 + impuesto);

			$(this).val(valor_cotizado);
			// Corrección ocultar decimales
			$(this).data('old-value', valor_cotizado);
		}

		unaBase.ui.unblock();

	};

	var updateHorasExtras = function(event) {
		if ($(event.target).parentTo('tr').data('hora-extra-enabled')) {
			var base_imponible = 0;

			if ($(event.target).parentTo('tr').data('base-imponible'))
				base_imponible = $(event.target).parentTo('tr').data('base-imponible');
			else
				// Corrección cuando se ocultan decimales
				//base_imponible = parseFloat($(event.target).parentTo('tr').find('input[name="item[][precio_unitario]"]').val());
				if ($(event.target).parentTo('tr').find('input[name="item[][precio_unitario]"]').data('old-value'))
					base_imponible = parseFloat($(event.target).parentTo('tr').find('input[name="item[][precio_unitario]"]').data('old-value'));
				else
					base_imponible = parseFloat($(event.target).parentTo('tr').find('input[name="item[][precio_unitario]"]').val());

			var hora_extra_cantidad = parseFloat($(event.target).parentTo('tr').find('input[name="item[][horas_extras]"]').val());
			var dias_cantidad = parseFloat($(event.target).parentTo('tr').find('input[name="item[][factor]"]').data('old-value'));
			var hora_extra_factor = $(event.target).parentTo('tr').data('hora-extra-factor');
			var hora_extra_jornada = $(event.target).parentTo('tr').data('hora-extra-jornada');
			var hora_extra_dias = $(event.target).parentTo('tr').data('hora-extra-dias');
			var hora_extra_valor = 0;

			hora_extra_dias = (typeof hora_extra_dias == 'undefined')? 7 : hora_extra_dias;

			if (hora_extra_jornada)
				hora_extra_valor = (base_imponible / dias_cantidad / 10) * hora_extra_factor;
			else
				hora_extra_valor = (base_imponible / hora_extra_dias / 10) * hora_extra_factor;

			$(event.target).parentTo('tr').data('hora-extra-valor', hora_extra_valor);

			if (typeof event.originalEvent != 'undefined')
				$(event.target).parentTo('tr').prevTo('.title').find('input[name="item[][horas_extras]"]').val(null);

			$(event.target).parentTo('tr').find('input[name="item[][precio_unitario]"]').val(base_imponible + Math.round(hora_extra_valor * hora_extra_cantidad));
			// Corrección cuando se ocultan decimales
			$(event.target).parentTo('tr').find('input[name="item[][precio_unitario]"]').data('old-value', base_imponible + Math.round(hora_extra_valor * hora_extra_cantidad));

			if (hora_extra_cantidad > 0)
				$(event.target).parentTo('tr').find('input[name="item[][precio_unitario]"]').addClass('special');
			else
				$(event.target).parentTo('tr').find('input[name="item[][precio_unitario]"]').removeClass('special');

			if (typeof copiar_precio_a_costo == 'boolean' && $(event.target).parentTo('tr').find('input[name="item[][costo_unitario]"]').data('auto')) {
				// Corrección ocultar decimales
				//$(event.target).parentTo('tr').find('input[name="item[][costo_unitario]"]').val(parseFloat($(event.target).parentTo('tr').find('input[name="item[][precio_unitario]"]').val()));
				if ($(event.target).parentTo('tr').find('input[name="item[][precio_unitario]"]').data('old-value'))
					$(event.target).parentTo('tr').find('input[name="item[][costo_unitario]"]').val(parseFloat($(event.target).parentTo('tr').find('input[name="item[][precio_unitario]"]').data('old-value'))).data('old-value', parseFloat($(event.target).parentTo('tr').find('input[name="item[][precio_unitario]"]').data('old-value')));
				else
					$(event.target).parentTo('tr').find('input[name="item[][costo_unitario]"]').val(parseFloat($(event.target).parentTo('tr').find('input[name="item[][precio_unitario]"]').val())).data('old-value', parseFloat($(event.target).parentTo('tr').find('input[name="item[][precio_unitario]"]').val()));
			}

			$(event.target).trigger('focus').trigger('blur');

		}
	};

	$('section.sheet').on('blur', 'tr:not(.title) input[name="item[][precio_unitario]"]', updatePrecioCotizado);
	$('section.sheet').on('focus', 'tr:not(.title) input[name="item[][precio_unitario]"].edited', updatePrecioNegociado);
	$('section.sheet').on('change', 'tr:not(.title) input[name="item[][horas_extras]"]', updateHorasExtras);
	$('section.sheet').on('change', 'tr:not(.title) input[name="item[][factor]"]', updateHorasExtras);

	$('section.sheet').on('change', 'tr.title input[name="item[][horas_extras]"]', function(event) {
		var horas_extras = $(this).val();
		var items = $(this).parentTo('tr').nextUntil('.title');
		items.each(function() {
			$(this).find('input[name="item[][horas_extras]"]').val(horas_extras).trigger('change').trigger('update');
		});
	});

	$('section.sheet').on('hover', 'button.detail.price', function(event) {
		var element = $(this);
		$(this).tooltipster({
			content: function() {
				var exchange_rate_usd = (valor_usd_cotizacion > 0)? valor_usd_cotizacion : valor_usd;
				var exchange_rate_clf = (valor_clf_cotizacion > 0)? valor_clf_cotizacion : valor_clf;

				var htmlObject = $('\
					<ul>																																							\
						<li data-name="tipo-documento">																																\
							<strong style="font-weight: bold; display: inline-block; width: 220px;">Tipo de documento</strong>														\
							<span></span>																																			\
						</li>																																						\
						<li data-name="valor-negociado">																															\
							<strong style="font-weight: bold; display: inline-block; width: 220px;">Valor ingresado<span class="valor-usd"></span></strong>							\
							<span class="numeric currency">' + localCurrency + ' <span style="display: inline-block; width: 100px; text-align: right;"></span></span>				\
						</li>																																						\
						<li data-name="imposiciones">																																\
							<strong style="font-weight: bold; display: inline-block; width: 220px;">Imposiciones (<span class="numeric percent"></span>%)</strong>					\
							<span class="numeric currency">' + localCurrency + ' <span style="display: inline-block; width: 100px; text-align: right;"></span></span>				\
						</li>																																						\
						<li data-name="retencion">																																	\
							<strong style="font-weight: bold; display: inline-block; width: 220px;">Retención (<span class="numeric percent"></span>%)</strong>						\
							<span class="numeric currency">' + localCurrency + ' <span style="display: inline-block; width: 100px; text-align: right;"></span></span>				\
						</li>																																						\
						<li data-name="horas-extras">																																\
							<strong style="font-weight: bold; display: inline-block; width: 220px;">Horas extras (<span class="numeric percent"></span>)</strong>					\
							<span class="numeric currency">' + localCurrency + ' <span style="display: inline-block; width: 100px; text-align: right;"></span></span>				\
						</li>																																						\
						<li data-name="total" style="border-top: 1px solid grey; margin-top: 10px; padding-top: 10px;">																\
							<strong style="font-weight: bold; display: inline-block; width: 220px;">Total</strong>																	\
							<span class="numeric currency">' + localCurrency + ' <span style="display: inline-block; width: 100px; text-align: right;"></span></span>				\
						</li>																																						\
					</ul>																																							\
				');

				var row = element.parentTo('tr');

				var horas_extras_cantidad = parseFloat(row.find('input[name="item[][horas_extras]"]').val());
				if (horas_extras_cantidad == 0)
					htmlObject.find('li[data-name="horas-extras"]').hide();
				var hora_extra_valor = parseFloat(row.data('hora-extra-valor'));
				if (typeof hora_extra_valor == 'undefined') {
					row.find('input[name="item[][horas_extras]"]').trigger('change');
					hora_extra_valor = parseFloat(row.data('hora-extra-valor'));
				}
				var base_imponible = parseFloat(row.data('base-imponible'));

				if (typeof base_imponible == 'undefined') {
					row.find('input[name="item[][precio_unitario]"]').trigger('focus');
					row.find('input[name="item[][precio_unitario]"]').trigger('blur');
					base_imponible = parseFloat(row.data('base-imponible'));
				}

				var tipo_documento = row.data('tipo-documento-text');
				var impuesto = parseFloat(row.data('tipo-documento-ratio'));
				var is_valor_usd = row.data('tipo-documento-valor-usd'); // Impuesto extranjero
				var division = row.data('tipo-documento-inverse');
				if (typeof selected_currency == 'undefined')
					var total = parseFloat((row.find('input[name="item[][precio_unitario]"]').data('old-value'))? row.find('input[name="item[][precio_unitario]"]').data('old-value') : row.find('input[name="item[][precio_unitario]"]').val());
				else
					var total = parseFloat((row.find('input[name="item[][precio_unitario]"]').data('old-value'))? row.find('input[name="item[][precio_unitario]"]').data('old-value') : row.find('input[name="item[][precio_unitario]"]').val());

				var valor_negociado = 0;
				if (division) {
					htmlObject.find('li[data-name="imposiciones"]').hide();
					// Impuesto extranjero
					if (is_valor_usd)
						valor_negociado = base_imponible * (1 - impuesto);
					else
						valor_negociado = base_imponible * (1 - impuesto);
				} else {
					htmlObject.find('li[data-name="retencion"]').hide();
					valor_negociado = base_imponible / (1 + impuesto);
				}

				var imposiciones = base_imponible - valor_negociado;

				// Impuesto extranjero
				if (is_valor_usd)
					htmlObject.find('li[data-name="valor-negociado"] span.valor-usd').text(' (USD ' + (valor_negociado / exchange_rate_usd).toFixed(2).replace(/\./g, ',') + ')'); // Impuesto extranjero

				htmlObject.find('li[data-name="tipo-documento"] > span').text(tipo_documento);

				if (typeof selected_currency == 'undefined')
					htmlObject.find('li[data-name="valor-negociado"] > span > span').text(valor_negociado.toFixed(currency.decimals).replace(/\./g, ','));
				else
					htmlObject.find('li[data-name="valor-negociado"] > span > span').text(valor_negociado.toFixed(2).replace(/\./g, ','));

				htmlObject.find('li[data-name="imposiciones"] > strong span').text((impuesto * 100).toFixed(2));
				if (typeof selected_currency == 'undefined')
					htmlObject.find('li[data-name="imposiciones"] > span > span').text(imposiciones.toFixed(currency.decimals).replace(/\./g, ','));
				else
					htmlObject.find('li[data-name="imposiciones"] > span > span').text(imposiciones.toFixed(2).replace(/\./g, ','));

				htmlObject.find('li[data-name="retencion"] > strong span').text((impuesto * 100).toFixed(2));
				if (typeof selected_currency == 'undefined')
					htmlObject.find('li[data-name="retencion"] > span > span').text(imposiciones.toFixed(currency.decimals).replace(/\./g, ','));
				else
					htmlObject.find('li[data-name="retencion"] > span > span').text(imposiciones.toFixed(2).replace(/\./g, ','));

				htmlObject.find('li[data-name="horas-extras"] > strong span').text(horas_extras_cantidad);
				if (typeof selected_currency == 'undefined')
					htmlObject.find('li[data-name="horas-extras"] > span > span').text(Math.round(hora_extra_valor * horas_extras_cantidad).toFixed(currency.decimals).replace(/\./g, ','));
				else
					htmlObject.find('li[data-name="horas-extras"] > span > span').text((hora_extra_valor * horas_extras_cantidad).toFixed(2).replace(/\./g, ','));

				if (typeof selected_currency == 'undefined')
					htmlObject.find('li[data-name="total"] > span > span').text(total.toFixed(currency.decimals).replace(/\./g, ','));
				else
					htmlObject.find('li[data-name="total"] > span > span').text(total.toFixed(2).replace(/\./g, ','));

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

	$('section.sheet').on('mouseout', 'button.detail.price', function(event) {
		$(this).tooltipster('destroy');
	});


	$('section.sheet').on('hover', 'button.detail.exchange-rate', function(event) {
		var element = $(this);
		$(this).tooltipster({
			content: function() {
				if (currency.code == 'CLP')
					var htmlObject = $('\
						<ul>																																													\
							<li data-name="valor-clp">																																							\
								<strong style="font-weight: bold; display: inline-block; width: 240px;">Precio en ' + currency.name + '</strong>																		\
								<span class="numeric currency"><tt style="font-family: \'Droid Sans Mono\';">' + currency.code + '</tt> <span style="display: inline-block; width: 140px; text-align: right;"></span></span>		\
							</li>																																						\
							<li data-name="valor-usd">																																	\
								<strong style="font-weight: bold; display: inline-block; width: 240px;">Precio en dólares</strong>																\
								<span class="numeric currency"><tt style="font-family: \'Droid Sans Mono\';">USD</tt> <span style="display: inline-block; width: 140px; text-align: right;"></span></span>									\
							</li>																																						\
							<li data-name="valor-clf">																																	\
								<strong style="font-weight: bold; display: inline-block; width: 240px;">Precio en UF</strong>																		\
								<span class="numeric currency"><tt style="font-family: \'Droid Sans Mono\';">CLF</tt> <span style="display: inline-block; width: 140px; text-align: right;"></span></span>									\
							</li>																																						\
							<li data-name="exchange-rate-usd" style="border-top: 1px solid grey; margin-top: 10px; padding-top: 10px;">													\
								<strong style="font-weight: bold; display: inline-block; width: 240px;">Tipo de cambio USD</strong>														\
								<span class="numeric currency"><tt style="font-family: \'Droid Sans Mono\';">' + currency.code + '</tt> <span style="display: inline-block; width: 140px; text-align: right;"></span></span>									\
							</li>																																						\
							<li data-name="exchange-rate-clf">																															\
								<strong style="font-weight: bold; display: inline-block; width: 240px;">Tipo de cambio CLF</strong>														\
								<span class="numeric currency"><tt style="font-family: \'Droid Sans Mono\';">' + currency.code +  '</tt> <span style="display: inline-block; width: 140px; text-align: right;"></span></span>									\
							</li>																																						\
						</ul>																																							\
					');
				else
					var htmlObject = $('\
						<ul>																																													\
							<li data-name="valor-clp">																																							\
								<strong style="font-weight: bold; display: inline-block; width: 240px;">Precio en ' + currency.name + '</strong>																		\
								<span class="numeric currency"><tt style="font-family: \'Droid Sans Mono\';">' + currency.code + '</tt> <span style="display: inline-block; width: 140px; text-align: right;"></span></span>		\
							</li>																																						\
							<li data-name="valor-usd">																																	\
								<strong style="font-weight: bold; display: inline-block; width: 240px;">Precio en dólares</strong>																\
								<span class="numeric currency"><tt style="font-family: \'Droid Sans Mono\';">USD</tt> <span style="display: inline-block; width: 140px; text-align: right;"></span></span>									\
							</li>																																						\
							<li data-name="exchange-rate-usd" style="border-top: 1px solid grey; margin-top: 10px; padding-top: 10px;">													\
								<strong style="font-weight: bold; display: inline-block; width: 240px;">Tipo de cambio USD</strong>														\
								<span class="numeric currency"><tt style="font-family: \'Droid Sans Mono\';">' + currency.code + '</tt> <span style="display: inline-block; width: 140px; text-align: right;"></span></span>									\
							</li>																																						\
						</ul>																																							\
					');

				var row = element.parentTo('tr');

				var total = parseFloat(row.find('input[name="item[][subtotal_precio]"]').val());

				htmlObject.find('li[data-name="valor-clp"] > span > span').text(total.toFixed(currency.decimals).replace(/\./g, ',')).number(true, currency.decimals, ',', '.');

				var exchange_rate_usd = (valor_usd_cotizacion > 0)? valor_usd_cotizacion : valor_usd;
				var exchange_rate_clf = (valor_clf_cotizacion > 0)? valor_clf_cotizacion : valor_clf;

				htmlObject.find('li[data-name="valor-usd"] > span > span').text((total / exchange_rate_usd).toFixed(2).replace(/\./g, ',')).number(true, 2, ',', '.');
				htmlObject.find('li[data-name="valor-clf"] > span > span').text((total / exchange_rate_clf).toFixed(2).replace(/\./g, ',')).number(true, 2, ',', '.');

				htmlObject.find('li[data-name="exchange-rate-usd"] > span > span').text((parseFloat(exchange_rate_usd)).toFixed(2).replace(/\./g, ',')).number(true, 2, ',', '.');
				htmlObject.find('li[data-name="exchange-rate-clf"] > span > span').text((parseFloat(exchange_rate_clf)).toFixed(2).replace(/\./g, ',')).number(true, 2, ',', '.');

				htmlObject.find('span.numeric.percent > span').number(true, 2, ',', '.');

				return htmlObject;
			},
			interactive: true,
			trigger: '',
			delay: 0,
			interactiveAutoClose: true
		});
		$(this).tooltipster('show');
	});

	$('section.sheet').on('mouseout', 'button.detail.exchange-rate', function(event) {
		$(this).tooltipster('destroy');
	});


	$('section.sheet').on('hover', 'button.detail.cost', function(event) {
		var element = $(this);
		$(this).tooltipster({
			content: function() {
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

	$('section.sheet').on('mouseout', 'button.detail.cost', function(event) {
		$(this).tooltipster('destroy');
	});

	$('section.sheet table.items > tfoot > tr > th.info').bind('refresh', function() {
		var items = $('section.sheet table.items > tbody > tr:not(.title)').length;
		$('section.sheet table.items > tfoot > tr > th.info').html(items + ' ítem' + ((items > 1)? 's' : ''));
	});

	$('section.sheet table.items').on('change', '> tbody > tr:not(.title) > td input[name="item[][costo_interno]"]', function(event) {
		$(this).parentTo('tr').find('> td input[name="item[][subtotal_costo]"]').trigger('refresh');
	});

	$('section.sheet table.items').on('refresh', '> tbody > tr:not(.title) > td input[name="item[][subtotal_costo]"]', function(event) {
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

	// Cálculo de costo interno + externo real

	$('section.sheet table.items > tbody').on('refresh', '> tr:not(.title) > td input[name="item[][subtotal_costo_real]"]', function(event) {
		// TODO: 2014-07-01 Falta añadir multiplicadores de cantidad y factor, para sacar el costo p de hh multiplicado por cantidad y factor
		// los multiplicadores deben venir en atributos data


		var row = $(this).parentTo('tr');

		if (row.find('> td input[name="item[][costo_interno]"]').prop('checked')) {
			//if (row.data('costo-real-hh-cantidad') > 0 && row.data('costo-presupuestado-hh-valor') > 0)
			if (row.data('costo-real-hh-total') > 0)
				row.find('button.detail.cost-real').visible();

			if (!$(this).hasClass('edited')) {
				var row = $(this).parentTo('tr');

				var costo_externo = parseFloat($(this).val());
				//var costo_interno = row.data('costo-real-hh-cantidad') * row.data('costo-presupuestado-hh-valor');
				var costo_interno = row.data('costo-real-hh-total');

				if (isNaN(costo_externo))
					costo_externo = 0;

				$(this).val(costo_externo + costo_interno);
				$(this).addClass('edited');
			}
		} else {
			row.find('button.detail.cost-real').invisible();

			if ($(this).hasClass('edited')) {
				var row = $(this).parentTo('tr');

				//var costo_interno = row.data('costo-real-hh-cantidad') * row.data('costo-presupuestado-hh-valor');
				var costo_interno = row.data('costo-real-hh-total');
				var costo_total = parseFloat($(this).val());

				$(this).val(costo_total - costo_interno);
				$(this).removeClass('edited');
			}
		}

		updateRow(event);
	});

	$('section.sheet table > tbody').on('change', 'input[name="item[][costo_interno]"]', function(event) {
		saveRow(event);
	});

	$('section.sheet table.items > thead > tr:last-of-type > th > input[name="item[][costo_interno]"]').change(function() {
		if ($(this).prop('checked')) {
			$('section.sheet table.items > tbody > tr:not(.title)').each(function() {
				$(this).find('input[name="item[][costo_interno]"]:not(:checked)').prop('checked', true).trigger('change');
			});
		} else {
			$('section.sheet table.items > tbody > tr:not(.title)').each(function() {
				$(this).find('input[name="item[][costo_interno]"]:checked').prop('checked', false).trigger('change');
			});
		}
	});

	$('section.sheet table.items > thead > tr:last-of-type > th > input[name="item[][ocultar_print]"]').change(function() {
		if ($(this).prop('checked')) {
			$('section.sheet table.items > tbody > tr').each(function() {
				$(this).find('input[name="item[][ocultar_print]"]:not(:checked)').prop('checked', true);
			});
		} else {
			$('section.sheet table.items > tbody > tr').each(function() {
				$(this).find('input[name="item[][ocultar_print]"]:checked').prop('checked', false);
			});
		}
	});

	$('#main-container').on('change', 'table.items.cotizacion tr.title input[name="item[][ocultar_print]"]', function(event) {
		var titulo = $(event.target).closest('tr');
		if ($(event.target).prop('checked')) {
			titulo.nextUntil("tr.title").find('input[name="item[][ocultar_print]"]:not(:checked)').prop('checked', true);
		} else {
			titulo.nextUntil("tr.title").find('input[name="item[][ocultar_print]"]:checked').prop('checked', false);
		}
	});

	$('#main-container').on('change', 'table.items.cotizacion tr:not(.title) input[name="item[][ocultar_print]"]', function(event) {
		if ($(event.target).prop('checked') && (($(event.target).closest('tr').find('input[name="item[][precio_unitario]"]').data('old-value'))? $(event.target).closest('tr').find('input[name="item[][precio_unitario]"]').data('old-value') : $(event.target).closest('tr').find('input[name="item[][precio_unitario]"]').val()) > 0 ) {
			alert('El ítem seleccionado tiene costo unitario mayor a cero. Al imprimir producirá diferencias en los totales.<br><br>Por favor revisar.');
		}
	});

	// Confirmar al cambiar check sobrecargo, en caso que afecte los montos
	$('#main-container').on('change', 'table.items.cotizacion tr:not(.title) input[name="item[][aplica_sobrecargo]"]', function(event) {
		if (!$('table.items.cotizacion').data('edit-aplica-sobrecargo-remember') && $('section.sobrecargos li[data-items="true"] span.percent input').val() > 0 /* && (($(event.target).closest('tr').find('input[name="item[][precio_unitario]"]').data('old-value'))? $(event.target).closest('tr').find('input[name="item[][precio_unitario]"]').data('old-value') : $(event.target).closest('tr').find('input[name="item[][precio_unitario]"]').val()) > 0 */) {
			// asdf (incluir no volver a preguntar)
			confirm("¿Está seguro de modificar el ítem afecto a comisión?<br>-Esto podría cambiar los valores totales.<br><br><label><input type=\"checkbox\" name=\"edit_aplica_sobrecargo_remember\"> No volver a preguntar para este negocio</label>", 'Sí', 'No').done(function(data) {
				if (!data) {
					var isChecked = $(event.target).prop('checked');
					$(event.target).prop('checked', !isChecked);
					$(event.target).closest('tr').find('[name="item[][precio_unitario]"]').trigger('focus').trigger('blur');
				}
				if ($('[name="edit_aplica_sobrecargo_remember"]').is(':checked')) {
					$('table.items.cotizacion').data('edit-aplica-sobrecargo-remember', true);
				}
			}).fail(function() {
				var isChecked = $(event.target).prop('checked');
				$(event.target).prop('checked', !isChecked);
				$(event.target).closest('tr').find('[name="item[][precio_unitario]"]').trigger('focus').trigger('blur');
			});
		}
	});

	(function() {

		var htmlObject = $('\
				<ul class="dropdown-menu" style="position: absolute; top: 25px; right: 0; z-index: 1000; min-width: 150px; text-align: left;">	\
					<li><a href="#" class="select-all items"><span class="ui-icon ui-icon-radio-on"></span>Seleccionar todo</a></li>			\
					<li><a href="#" class="deselect-all items"><span class="ui-icon ui-icon-radio-off"></span>Deseleccionar todo</a></li>		\
					<li><a href="#" class="close-compras items"><span class="ui-icon ui-icon-locked"></span>Cerrar compras</a></li>				\
					<li><a href="#" class="open-compras items"><span class="ui-icon ui-icon-unlocked"></span>Reabrir compras</a></li>			\
					<li><a href="#" class="create-oc items"><span class="ui-icon ui-icon-document"></span>Crear orden de compra</a></li>		\
					<li><a href="#" class="create-fxr items"><span class="ui-icon ui-icon-document"></span>Crear fondo por rendir</a></li>		\
					<!--<li><a href="#" class="view-oc items"><span class="ui-icon ui-icon-document-b"></span>Item / Vista oc</a></li>			\
					<li><a href="#" class="view-ot items"><span class="ui-icon ui-icon-document-b"></span>Item / Vista ot</a></li>				\
					<li><a href="#" class="view-oc-ot items"><span class="ui-icon ui-icon-document-b"></span>Item / Vista (oc+ot)</a></li>		\
																																				\
					-->																															\
				</ul>																															\
			');
		htmlObject.appendTo('table.items > thead > tr:last-of-type > th:last-of-type').menu().hide();
		if (!access._490)
			htmlObject.find('.close-compras').parentTo('li').remove();
		if (!access._491)
			htmlObject.find('.open-compras').parentTo('li').remove();
	})();

	$('table.items > thead > tr:last-of-type > th:last-of-type a.items').click(function(event) {
		var target = $(event.target);

		$('table.items > thead > tr:last-of-type > th:last-of-type > .dropdown-menu').toggle();

		var selected = $('table.items tbody').find('tr:not(.title)').has('input[type="checkbox"][name="item[][selected]"]:checked');
		var selectable = $('table.items tbody').find('tr:not(.title)').has('input[type="checkbox"][name="item[][selected]"]');

		if (target.hasClass('select-all') || target.hasClass('deselect-all')) {
			if (target.hasClass('select-all'))
				$('table.items tbody').find('tr input[type="checkbox"][name="item[][selected]"]').prop('checked', true);
			if (target.hasClass('deselect-all'))
				$('table.items tbody').find('tr input[type="checkbox"][name="item[][selected]"]').prop('checked', false);
		} else {

			/*if (target.hasClass('view-oc') || target.hasClass('view-ot') || target.hasClass('view-oc-ot')) {
				if (target.hasClass('view-oc')) {

				}
				if (target.hasClass('view-ot')) {

				}
				if (target.hasClass('view-oc-ot')) {

				}
			}else{*/

				if (selected.length == 0) {
					//toastr.warning('Para realizar esta acción, debe seleccionar uno o más ítems de la lista.');
					if (target.hasClass('close-compras')) {
						confirm(MSG.get('CONFIRM_NEGOCIO_CLOSE_COMPRAS_ALL')).done(function(data) {
							if (data)
								$('#menu > ul > li[data-name="close_compras_negocio"] > button').triggerHandler('click');
						});
					} else {
						toastr.warning('No se ha seleccionado ningún ítem');
					}
				} else {

					var closeItemsCompras = function() {
						selected.each(function() {
							var element = this;
							$.ajax({
								url: '/4DACTION/_V3_setItemByNegocio',
								data: {
									id: $(element).data('id'),
									close_compras: true
								},
								dataType: 'json',
								success: function(data) {
									if (data.success) {
										$(element).find('[name="item[][closed_compras]"]').show();

										//toastr.info('Ítem cerrado para compras.');
										unaBase.log.save('El ítem ha sido cerrado para compras' + ( ($(element).find('[name="item[][codigo]"]').val() != '')? ' [Cód.: ' + $(element).find('[name="item[][codigo]"]').val() + ']' : ''), 'negocios', $('section.sheet').data('index'), $('section.sheet').data('id'), $(element).find('[name="item[][nombre]"]').val());
									}
								}
							});
						});
						toastr.info('Ítems seleccionados cerrados para compras.');
					};

					if (target.hasClass('close-compras')) {
						if (selected.length == selectable.length)
							confirm(MSG.get('CONFIRM_NEGOCIO_CLOSE_COMPRAS_AUTO')).done(function(data) {
								if (data)
									$('#menu > ul > li[data-name="close_compras_negocio"] > button').triggerHandler('click');
								closeItemsCompras();
								$('table.items tbody').find('tr input[type="checkbox"][name="item[][selected]"]').prop('checked', false);
							});
						else {
							closeItemsCompras();
							$('table.items tbody').find('tr input[type="checkbox"][name="item[][selected]"]').prop('checked', false);
						}
					}
					if (target.hasClass('open-compras')) {
						selected.each(function() {
							var element = this;
							$.ajax({
								url: '/4DACTION/_V3_setItemByNegocio',
								data: {
									id: $(element).data('id'),
									close_compras: false
								},
								dataType: 'json',
								success: function(data) {
									if (data.success) {
										$(element).find('[name="item[][closed_compras]"]').hide();

										//toastr.info('Ítem abierto para compras.');
										unaBase.log.save('El ítem ha sido abierto para compras' + ( ($(element).find('[name="item[][codigo]"]').val() != '')? ' [Cód.: ' + $(element).find('[name="item[][codigo]"]').val() + ']' : ''), 'negocios', $('section.sheet').data('index'), $('section.sheet').data('id'), $(element).find('[name="item[][nombre]"]').val());
										$('.closed-compras-tag').remove();
                                        $('[data-name="open_compras_negocio"]').hide();
                                        $('[data-name="close_compras_negocio"]').show();
									}
								}
							});
						});
						$('table.items tbody').find('tr input[type="checkbox"][name="item[][selected]"]').prop('checked', false);
						toastr.info('Ítems seleccionados abiertos para compras.');
					}
					if (target.hasClass('create-oc') || target.hasClass('create-fxr')) {
						unaBase.ui.block();
						var itemsGuardados = true;
						var itemsGastables = true;
						var itemsAbiertos = true;
						$('table.items tbody tr:not(.title)').each(function(key, item) {
							var current = $(item);
							if (current.find('[name="item[][selected]"]').is(':checked')) {
								// Marcar todos los títulos de los ítems que ya estén marcados
								current.prevTo('tr.title').find('[name="item[][selected]"]').prop('checked', true);
								// Verificar si el ítem está guardado
								if (!current.data('id')) {
									itemsGuardados = false;
								}
								// Verificar si el ítem es gastable
								if (!access._486) {
									if (parseFloat(current.find('[name="item[][diferencia]"]').val()) <= 0) {
										current.find('[name="item[][diferencia]"]').css('background-color', 'red').css('color', 'white');
										itemsGastables = false;
									} else {
										current.find('[name="item[][diferencia]"]').css('background-color', 'white').css('color', 'black');
									}
								}
								// Verificar si el ítem está abierto para compras
								if (current.find('[name="item[][closed_compras]"]').is(':visible')) {
									itemsAbiertos = false;
								}
							}
						});
						if (!itemsGuardados) {
							errMsg = '<br> -Hay ítems creados sin guardar.';
							toastr.warning('No es posible crear OC de los ítems seleccionados'+ errMsg);
							$('table.items tbody tr.title').find('[name="item[][selected]"]').prop('checked', false);
							unaBase.ui.unblock();
							return false;
						}
						if (!itemsGastables || !itemsAbiertos) {
							var errMsg = '';
							if (!itemsGastables) {
								errMsg+= '<br> -Hay ítems sin monto por gastar (diferencias en rojo).';
							}
							if (!itemsAbiertos) {
								errMsg+= '<br> -Hay ítems cerrados para compras.';
							}
							if (target.hasClass('create-oc')) {
								toastr.warning('No es posible crear OC de los ítems seleccionados'+ errMsg);
							} else {
								toastr.warning('No es posible crear rendición de los ítems seleccionados'+ errMsg);
							}
							$('table.items tbody tr.title').find('[name="item[][selected]"]').prop('checked', false);
							unaBase.ui.unblock();
							return false;
						}
						// begin: Verificación en línea de ítems
						var successRequest = false;
						$.ajax({
							url: '/4DACTION/_V3_checkPorGastarByItems',
							data: {
								ids: items.join('|')
							},
							async: false,
							dataType: 'json',
							success: function(data) {
								successRequest = true;
								for (var i = 0, len = data.rows.length; i < len; i++) {
									if (!data.rows[i].gastable) {
										itemsGastables = false;
										break;
									}
								}
								if (!itemsGastables) {
									errMsg = '<br> -Hay ítems sin monto por gastar.';
									toastr.warning('No es posible crear gasto de los ítems seleccionados'+ errMsg);
								}
							}
						});
						if (!successRequest) {
							toastr.error(NOTIFY.get('ERROR_INTERNAL'));
						}
						if (!successRequest || (successRequest && !itemsGastables)) {
							unaBase.ui.unblock();
							return false;
						}
						// end: Verificación en línea de ítems
						var formItems = '';
						var llave_titulo = '';
						$('table.items tbody tr').each(function(key, item) {
							var current = $(item);
							var llave_actual = ('OC' + (Math.random()*0xFFFFFFFF<<0).toString(16) + (current.hasClass('title')? 'TITULO' : 'ITEM') + (key + 1) + (Math.round(Math.random() * 100000)));
							if (current.hasClass('title')) {
								llave_titulo = llave_actual;
							}
							if (current.find('[name="item[][selected]"]').is(':checked')) {
								var row = {
									'oc[detalle_item][llave]': llave_actual,
									'oc[detalle_item][tipo]': (current.hasClass('title')? 'TITULO' : 'ITEM'),
									'oc[detalle_item][items]': (key + 1),
									'oc[detalle_item][idnv]': $('#main-container').data('id'),
									'oc[detalle_item][origen]': 'PROYECTO',
									'oc[detalle_item][origen][lugar]': 'INTERNO',
									'oc[detalle_item][origen][lugar][des]': 'ITEM DIRECTO',
									'oc[detalle_item][id_tipo_producto]': '04',
									'oc[detalle_item][cod_producto]': '',
									'oc[detalle_item][id_producto]': current[0].dataset.producto || "",
									'oc[detalle_item][llave_nv]': current.data('id'),
									'oc[detalle_item][id_clasif]': current.data('categoria'),
									'oc[detalle_item][des_clasif]': '',
									'oc[detalle_item][llave_titulo]': llave_titulo,
									'oc[detalle_item][observacion_item]': '',
									'oc[detalle_item][nombre]': current.find('[name="item[][nombre]"]').val(),
									'oc[detalle_item][cantidad]': (current.hasClass('title')? 0 : 1),
									'oc[detalle_item][dias]': (current.hasClass('title')? 0 : 1),
									'oc[detalle_item][precio]': (current.hasClass('title')? 0 : (parseFloat(current.find('[name="item[][diferencia]"]').val()) >= 0?current.find('[name="item[][diferencia]"]').val() : 0)),
									'oc[detalle_item][subtotal]': (current.hasClass('title')? 0 : (parseFloat(current.find('[name="item[][diferencia]"]').val()) >= 0?current.find('[name="item[][diferencia]"]').val() : 0)),
									'oc[detalle_item][dscto]': 0,
									'oc[detalle_item][total]': (current.hasClass('title')? 0 : (parseFloat(current.find('[name="item[][diferencia]"]').val()) >= 0?current.find('[name="item[][diferencia]"]').val() : 0))
								};
								formItems = formItems + $.param(row) + '&';
							}
						});
						var from = (target.hasClass('create-oc'))? 'OC' : 'FXR';
						$.ajax({
							url: '/4DACTION/_V3_setCompras',
							data: {
								create_from: from,
								'oc[from]': from
							},
							dataType: 'json',
							success: function(data) {
								var formData = formItems + $.param({
									'id': data.id,
									'oc[negocio][id]' : $('#main-container').data('id'),
									'create_from': from,
									'oc[from]': from
								});
								$.ajax({
									url: '/4DACTION/_V3_setCompras',
									data: formData,
									type: 'POST',
									success: function(subdata) {
										$('table.items tbody').find('tr input[type="checkbox"][name="item[][selected]"]').prop('checked', false);
										unaBase.ui.unblock();
										window.open('#compras/content.shtml?id=' + data.id);
									}
								});
							}
						});
					}
				}
			//}
		}
		event.preventDefault();
	});


	$('button.actions.items').button({
		icons: {
			primary: 'ui-icon-triangle-1-s',
			secondary: 'ui-icon-gear'
		}
	}).click(function() {
		$('table.items > thead > tr:last-of-type > th:last-of-type > .dropdown-menu').toggle();
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
		/*
		$.ajax({
			url: '/4DACTION/_V3_getExchangeRate',
			data: {
				from: selectedCurrency,
				to: currency.code
			},
			dataType: 'json',
			success: function(data) {
				target.find('input[name="cotizacion[tipo_cambio]"]').val(parseFloat(data.rate).toFixed(2).replace(/\./g, ',')).trigger('change');
			}
		});
		*/
		$.ajax({
			url: 'http://apilayer.net/api/live',
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

	$('input[name="cotizacion[ver_solo_items_usados]"]').on('change', updateVistaItems);

	$('section.sheet').on('hover', 'button.detail.total', function(event) {
	    var element = $(this);
	    $(this).tooltipster({
	        content: function() {
	            var exchange_rate_usd = (valor_usd_cotizacion > 0)? valor_usd_cotizacion : valor_usd;

	            var total_a_cliente = parseFloat($('input[name="cotizacion[ajuste]"]').val());

	            var htmlObject = $('\
	                <ul>																																				\
	                    <li data-name="valor-usd">																										        		\
	                        <strong style="font-weight: bold; display: inline-block; width: 140px;">Valor en dólares</strong>											\
	                        <span class="numeric currency">USD <span style="display: inline-block; width: 100px; text-align: right;"></span></span>						\
	                    </li>																																			\
	                </ul>																																				\
	            ');

	            // Valor en dólares
	            htmlObject.find('li[data-name="valor-usd"] span.currency span').text((total_a_cliente / exchange_rate_usd).toFixed(2).replace(/\./g, ',') + ')');

	            htmlObject.find('span.numeric.percent > span').number(true, 2, ',', '.');

	            htmlObject.find('span.numeric.currency > span').number(true, 2, ',', '.'); // usd


	            return htmlObject;
	        },
	        interactive: true,
	        trigger: '',
	        delay: 0,
	        interactiveAutoClose: true
	    });
	    $(this).tooltipster('show');
	});

	$('section.sheet').on('mouseout', 'button.detail.total', function(event) {
	    $(this).tooltipster('destroy');
	});

	if ($('section.sheet').data('index') > 0)
		contentLoaded = true;

	// Logs tiempo real

	var logBeforeAction = function(event) {
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
		log = (typeof log == 'undefined')? [] : log;
		if (log[key] == undefined) {
			log[key] = [];
			if (currentElement.serializeAnything() != '' && currentElement.find('[name="item[][nombre]"]').val() != '') {
                var isCloned = (event.type == 'beforeClone');
				log[key]['old'] = JSON.parse('{ "item[][tipo_documento]": "' + currentElement.find('[name="item[][tipo_documento]"]').val() + '", "observacion": "' + escape(currentElement.data('observacion')) + '", "comentario": "' + escape(currentElement.data('comentario')) + '", "item[][aplica_sobrecargo]": ' + (currentElement.find('[name="item[][aplica_sobrecargo]"]').is(':checked')? 'true' : 'false' ) + ', "item[][costo_interno]": ' + (currentElement.find('[name="item[][costo_interno]"]').is(':checked')? 'true' : 'false' ) + ', "item[][ocultar_print]": ' + (currentElement.find('[name="item[][ocultar_print]"]').is(':checked')? 'true' : 'false' ) + ', "item[][mostrar_carta_cliente]": ' + (currentElement.find('[name="item[][mostrar_carta_cliente]"]').is(':checked')? 'true' : 'false' ) + ', "dragged": ' + (event.type == 'beforeMove'? 'true' : 'false') + ', "cloned": ' + (isCloned? 'true' : 'false') + ', "categoria": { "id": ' + id_categoria + ', "nombre": "' + escape(nombre_categoria) + '"  }, "title": ' + (isTitle? 'true' : 'false') + ', "' + decodeURI(currentElement.serializeAnything().replace(/&/g, "\",\"").replace(/=/g,"\":\"")) + '"}');
			}
		}
		$('#main-container').data('realtime-log', log);
	};

	var logAfterAction = function(event) {
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
		log = (typeof log == 'undefined')? [] : log;
		if (log[key] == undefined) {
			log[key] = [];
		}
		if ($(event.target).closest('tr').serializeAnything() != '') {
            var isCloned = (event.type != 'afterClone' && log[key] && log[key]['new'] && log[key]['new']['cloned']? log[key]['new']['cloned'] : event.type == 'afterClone');
            log[key]['new'] = JSON.parse('{ "item[][tipo_documento]": "' + currentElement.find('[name="item[][tipo_documento]"]').val() + '","observacion": "' + escape(currentElement.data('observacion')) + '", "comentario": "' + escape(currentElement.data('comentario')) + '", "item[][aplica_sobrecargo]": ' + (currentElement.find('[name="item[][aplica_sobrecargo]"]').is(':checked')? 'true' : 'false' ) + ', "item[][costo_interno]": ' + (currentElement.find('[name="item[][costo_interno]"]').is(':checked')? 'true' : 'false' ) + ', "item[][ocultar_print]": ' + (currentElement.find('[name="item[][ocultar_print]"]').is(':checked')? 'true' : 'false' ) + ', "item[][mostrar_carta_cliente]": ' + (currentElement.find('[name="item[][mostrar_carta_cliente]"]').is(':checked')? 'true' : 'false' ) + ', "dropped": ' + (event.type == 'afterMove'? 'true' : 'false') + ', "cloned": ' + (isCloned? 'true' : 'false') + ', "categoria": { "id": ' + id_categoria + ', "nombre": "' + escape(nombre_categoria) + '"  }, "title": ' + (isTitle? 'true' : 'false') + ', "' + decodeURI(currentElement.serializeAnything().replace(/&/g, "\",\"").replace(/=/g,"\":\"")) + '"}');
		}
		$('#main-container').data('realtime-log', log);
	};

	$('table.items.cotizacion').on('focus', 'tbody th input, tbody td input', logBeforeAction);
	$('table.items.cotizacion').on('beforeMove beforeRemove beforeClone beforeUpdate', 'tbody tr', logBeforeAction);

	$('table.items.cotizacion').on('blur', 'tbody th input, tbody td input', logAfterAction);
	$('table.items.cotizacion').on('afterMove afterRemove afterUpdate afterClone', 'tbody tr', logAfterAction);

	// edición empresa y contacto desde negocio
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

	$('button.edit.save.contacto').click(function() {
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

});
// });

// });
