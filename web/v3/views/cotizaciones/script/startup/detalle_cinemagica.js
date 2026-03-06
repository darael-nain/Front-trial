// if (typeof selected_currency == 'undefined')
// 	var localCurrency = currency.symbol;
// else {
// 	var localCurrency = currency.symbol;
// }
var localCurrency =""
$(document).ready(function() {

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

	$('section.sheet > table').on('click', 'tbody tr.title button.toggle.categoria', function() {
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
			target.parentTo('tr').find('.info:eq(0)').html(titles.length + ' ítem' + ((titles.length > 1)? 's' : ''));

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

	// htmlObject.find('button.add.all-items').click(function() {
	$('section.sheet > table').on('click', 'tbody tr.title button.add.all-items', function(event) {
		var htmlObject = $(event.target).closest('tr');
		if (htmlObject.data('categoria'))
			addAllItems(htmlObject);
		else
			toastr.warning('Para utilizar esta opción, debe seleccionar una categoría existente en el catálogo.');
	});


	$('section.sheet > table').on('focusout', 'tbody tr.title input[name="item[][nombre]"]', function() {
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
				}
			});
			htmlObject.trigger('change');
		}
	});

	// htmlObject.focusin(function() {
	$('section.sheet > table').on('focusin', 'tbody tr.title', function(event) {
		var htmlObject = $(this);
		var inputObject = $(this).find('input[name="item[][nombre]"]');
		if (!ingreso_simple_items_cot_neg) {
			inputObject.autocomplete({
				source: function(request, response) {
					inputObject.data('ajax-call', true);
					$.ajax({
						url: '/4DACTION/_V3_' + 'getCategoria',
						dataType: 'json',
						data: {
							q: request.term,
							area_negocio: $('[name="cotizacion[area_negocio]"]').data('id'),
							from: 'negocio'
						},
						success: function(data) {
							response($.map(data.rows, function(item) {
								return item;
							}));
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
					target.data('categoria', ui.item.id);
					target.find('[name="item[][ocultar_print]"]').prop('checked', ui.item.ocultar_print);
					target.find('[name="item[][mostrar_carta_cliente]"]').prop('checked', ui.item.mostrar_carta_cliente);

					$(this).trigger('change');
					return false;
				}

			}).data('ui-autocomplete')._renderItem = function(ul, item) {
				return $('<li><a><strong>' +  ((item.especial)? 'Especial' : '') + '</strong><em>' + ((item.gasto_fijo)? 'Gasto Fijo' : '') + '</em><span class="highlight">' + item.text + '</span></a></li>').appendTo(ul);
			};
		}
	});

	// htmlObject.focusout(function() {
	$('section.sheet > table').on('focusout', 'tbody tr.title', function() {
		if ($(this).find('input[name="item[][nombre]"]').hasClass('ui-autocomplete-input'))
			$(this).find('input[name="item[][nombre]"]').autocomplete('destroy');
	});


	// cambio de tipo de documento
	var changeTipoDocumento = function(target, tipo_documento_old, tipo_documento_new) {
	    // Se actualiza el valor de las horas extras simulando 'cambio' en el input
	    if (tipo_documento_old != tipo_documento_new)
	      target.find('input[name="item[][horas_extras]"]').trigger('change');

	    // Se extraen los datos relevantes para desglosar el precio
	    var tipo_documento_ratio_old = (typeof target.data('tipo-documento-ratio') != 'undefined')? target.data('tipo-documento-ratio') : 0;
		var tipo_documento_valor_usd_old = (typeof target.data('tipo-documento-valor-usd') != 'undefined')? target.data('tipo-documento-valor-usd') : false; // Impuesto extranjero
	    var tipo_documento_inverse_old = (typeof target.data('tipo-documento-inverse') != 'undefined')? target.data('tipo-documento-inverse') : false;
		// Corrección cuando se ocultan decimales
		//var base_imponible_old = (tipo_documento_ratio_old > 0)? target.data('base-imponible') : target.find('[name="item[][precio_unitario]"]').val();
		if (target.find('[name="item[][precio_unitario]"]').data('old-value'))
			var base_imponible_old = (tipo_documento_ratio_old > 0)? target.data('base-imponible') : target.find('[name="item[][precio_unitario]"]').data('old-value');
		else
			var base_imponible_old = (tipo_documento_ratio_old > 0)? target.data('base-imponible') : target.find('[name="item[][precio_unitario]"]').val();
	    var hora_extra_cantidad_old = target.find('[name="item[][horas_extras]"]').val();

	    // Se reconstruye el precio base

	    var precio_base = 0;

	     if (tipo_documento_inverse_old) {
	      // precio_base = Math.round(base_imponible_old * (1 - tipo_documento_ratio_old));
		  if (tipo_documento_valor_usd_old)
		  	precio_base = parseFloat((base_imponible_old * valor_usd_cotizacion * (1 - tipo_documento_ratio_old)).toFixed(currency.decimals + 2));
		  else
	      	precio_base = parseFloat((base_imponible_old * (1 - tipo_documento_ratio_old)).toFixed(currency.decimals + 2));
	  	} else
	      // precio_base = Math.round(base_imponible_old / (1 + tipo_documento_ratio_old));
	      precio_base = parseFloat((base_imponible_old / (1 + tipo_documento_ratio_old)).toFixed(currency.decimals + 2));

	    target.data('tipo-documento', tipo_documento_new);

	    // Se actualizan valores relacionados a las horas hombre de OT
	    // TODO: actualziar automáticamente cuando se cambian los días para el contrato por proyecto

	    if (target.find('input[name="item[][costo_interno]"]').prop('checked')) {

	      if (typeof target.data('costo-presupuestado-hh-cantidad') == 'undefined')
	        target.data('costo-presupuestado-hh-cantidad', 0);

	      if (typeof target.data('costo-presupuestado-hh-valor') == 'undefined')
	        target.data('costo-presupuestado-hh-valor', 0);

	      var old_costo_total = parseFloat((target.find('input[name="item[][costo_unitario]"]').data('old-value'))? target.find('input[name="item[][costo_unitario]"]').data('old-value') : target.find('input[name="item[][costo_unitario]"]').val());
	      var old_costo_interno = target.data('costo-presupuestado-hh-cantidad') * target.data('costo-presupuestado-hh-valor');
	      var costo_externo = old_costo_total - old_costo_interno;

	      var new_costo_interno = parseFloat($('input[name="item[][cant_hh_asig]"]').val()) * parseFloat($('input[name="item[][costo_hh_unitario]"]').val());
	      var new_costo_total = costo_externo + new_costo_interno;
	      if (old_costo_total != new_costo_total) {
	        target.find('input[name="item[][costo_unitario]"]').val(new_costo_total.toFixed(currency.decimals));
			target.find('input[name="item[][costo_unitario]"]').data('old-value', new_costo_total.toFixed(currency.decimals + 2));
	        updateRow({
	          target: target.find('input[name="item[][costo_unitario]"]')
	        });
	      }
	    }

	    if (target.data('costo-presupuestado-hh-cantidad') > 0 && target.find('input[name="item[][costo_interno]"]').prop('checked'))
	      target.find('button.detail.cost').visible();
	    else
	      target.find('button.detail.cost').invisible();
	  	
	    // Se consulta el tipo de documento elegido y se cambian los parámetros de cálculo de acuerdo a él
	    if (tipo_documento_old != tipo_documento_new)
	      $.ajax({
	        url: '/4DACTION/_V3_getTipoDocumento',
	        data: {
	          q: target.data('tipo-documento'),
	          filter: 'id'
	        },
	        dataType: 'json',
	        async: false,
	        success: function(data) {
	          // Se rescatan y cambian los parámetros de cálculo
	          if (data.rows.length) {
	            // próximas 2 líneas, ver si se pueden quitar
	            if (data.rows[0].ratio == 0)
	              target.find('input[name="item[][precio_unitario]"]').removeClass('edited');
	            target.data('tipo-documento-text', data.rows[0].text);
	            target.data('tipo-documento-ratio', data.rows[0].ratio);
				target.data('tipo-documento-valor-usd', data.rows[0].valor_usd); // Impuesto extranjero
	            target.data('tipo-documento-inverse', data.rows[0].inverse);
	            target.find('[name="item[][tipo_documento]"]').val(data.rows[0].abbr);

	            if (typeof data.rows[0].hora_extra != 'undefined') {
	              target.data('hora-extra-enabled', true);
	              target.data('hora-extra-factor', data.rows[0].hora_extra.factor);
	              target.data('hora-extra-jornada', data.rows[0].hora_extra.jornada);
	              target.find('input[name="item[][horas_extras]"]').val(0).parentTo('td').visible();
	              target.find('input[name="item[][precio_unitario]"]').addClass('edited')
	              target.data('hora-extra-dias', data.rows[0].hora_extra.dias);
	              target.find('button.detail.price').visible();
	            } else {
	              target.data('hora-extra-enabled', false);
	              target.find('input[name="item[][horas_extras]"]').val(0).parentTo('td').invisible();
	              target.find('input[name="item[][precio_unitario]"]').removeClass('edited').removeClass('special');
				  // Corrección cuando se ocultan decimales
	              //target.data('base-imponible', parseFloat(target.find('input[name="item[][precio_unitario]"]').val()));
				  if (target.find('input[name="item[][precio_unitario]"]').data('old-value'))
				  	target.data('base-imponible', parseFloat(target.find('input[name="item[][precio_unitario]"]').data('old-value')));
				  else
				  	target.data('base-imponible', parseFloat(target.find('input[name="item[][precio_unitario]"]').val()));
	              target.find('button.detail.price').invisible();
	            }
	          } else {
	            target.data('hora-extra-enabled', false);
	            target.find('input[name="item[][horas_extras]"]').val(0).parentTo('td').invisible();
	            target.find('input[name="item[][precio_unitario]"]').removeClass('edited').removeClass('special');
	            target.find('button.detail.price').invisible();
				// Corrección cuando se ocultan decimales
	            //target.data('base-imponible', parseFloat(target.find('input[name="item[][precio_unitario]"]').val()));
				if (target.find('input[name="item[][precio_unitario]"]').data('old-value'))
				  target.data('base-imponible', parseFloat(target.find('input[name="item[][precio_unitario]"]').data('old-value')));
				else
				  target.data('base-imponible', parseFloat(target.find('input[name="item[][precio_unitario]"]').val()));
	          }

			  // Corrección cuando se ocultan decimales
	          //var precio_unitario = target.find('input[name="item[][precio_unitario]"]').val();
			  if (target.find('input[name="item[][precio_unitario]"]').data('old-value'))
			  	var precio_unitario = target.find('input[name="item[][precio_unitario]"]').data('old-value');
			  else
			  	var precio_unitario = target.find('input[name="item[][precio_unitario]"]').val();

	          if (precio_unitario != 0) {

	            // Se reemplaza el precio base antiguo por el nuevo
	            target.find('input[name="item[][precio_unitario]"]').trigger('focus').val(0).trigger('blur').trigger('focus').val(precio_base).data('old-value', precio_base).trigger('blur');

	            // Se reemplaza la cantidad horas extras antigua por la nueva
	            if (target.data('hora-extra-enabled')) {
	              target.find('input[name="item[][horas_extras]"]').val(hora_extra_cantidad_old).trigger('change');
	            }

	          }

	        }
	      });
	};

	$('section.sheet > table').on('focusout', 'tbody tr:not(.title) input[name="item[][nombre]"]', function() {
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
	$('section.sheet > table').on('focusin', 'tbody tr:not(.title)', function() {
		var htmlObject = $(this);
		htmlObject.addClass('focused'); // Fondo línea que se está trabajando
		var inputObject = $(this).find('input[name="item[][nombre]"]');
		if (!ingreso_simple_items_cot_neg) {
			inputObject.autocomplete({
				source: function(request, response) {
					inputObject.data('ajax-call', true);
					$.ajax({
						url: '/4DACTION/_V3_' + 'getProductoByCategoria',
						dataType: 'json',
						data: {
							q: request.term,
							id: htmlObject.prevTo('.title').data('categoria')
						},
						success: function(data) {
							response($.map(data.rows, function(item) {
								return item;
							}));
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

					target.data('producto', ui.item.id);
					target.find('[name="item[][codigo]"]').val(ui.item.index);
					target.find('[name="item[][unidad]"]').val(ui.item.unidad);
					target.find('[name="item[][horas_extras]"]').val(0);

					var cantidad = (typeof target.find('[name="item[][cantidad]"]').data('old-value') != 'undefined')? parseFloat(target.find('[name="item[][cantidad]"]').data('old-value')) : parseFloat(target.find('[name="item[][cantidad]"]').val());
					var factor = (typeof target.find('[name="item[][factor]"]').data('old-value') != 'undefined')? parseFloat(target.find('[name="item[][factor]"]').data('old-value')) : parseFloat(target.find('[name="item[][factor]"]').val());

										
										//detalle_cinemagica
					if (ui.item.porcentaje_monto_total == 0) {
						target.find('[name="item[][precio_unitario]"]').val(ui.item.precio / exchange_rate).data('old-value', ui.item.precio / exchange_rate);
						target.find('[name="item[][subtotal_precio]"]').val(cantidad * factor * (ui.item.precio / exchange_rate));
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
						target.removeData('formula-productor-ejecutivo-ratio');
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
						target.find('[name="item[][cantidad]"]').prop('readonly', true);
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
						<p>' + ui.item.text + '</p> \
						<p>&nbsp;</p> \
						<p>Descripción larga:</p> \
						<p>' + ((ui.item.observacion!= '')? ui.item.observacion.replace(/\n/g, '</p><p>') : 'N/A') + '</p> \
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
					htmlObject.data('tipo-documento', 30);
					htmlObject.find('input[name="item[][tipo_documento]"]').val('F');
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
	$('section.sheet > table').on('focusout', 'tbody tr:not(.title)', function() {
		$(this).removeClass('focused'); // Fondo línea que se está trabajando
		if ($(this).find('input[name="item[][nombre]"]').hasClass('ui-autocomplete-input'))
			$(this).find('input[name="item[][nombre]"]').autocomplete('destroy');
		if ($(this).find('input[name="item[][tipo_documento]"]').hasClass('ui-autocomplete-input'))
			$(this).find('input[name="item[][tipo_documento]"]').autocomplete('destroy');
		if ($(this).find('input[name="item[][unidad]"]').hasClass('ui-autocomplete-input'))
			$(this).find('input[name="item[][unidad]"]').autocomplete('destroy');
	});


	$('section.sheet > table').on('click', 'tbody tr:not(.title) button.remove.item', function(event) {
		contentChanged = true;
		contentReady = false;
		var element = this;
		var title = $(element).parentTo('tr').prevTo('.title');
		$(event.target).closest('tr').trigger('beforeRemove'); // Logs tiempo real
		$(element).parentTo('tr').fadeOut(400, function() {
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

	$('section.sheet > table').on('click', 'tbody button.remove.categoria', function(event) {
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

	$('section.sheet > table').on('click', 'thead button.add.categoria', function() {
		var current = $(this).parentTo('table').find('tbody');

		if (current.find('tr').length > 0)
			getElement.titulo('prependTo', current).find('input').focus();
		else
			getElement.titulo('prependTo', current).find('input').focus();
	});

	$('section.sheet > table').on('click', 'tbody button.add.categoria', function() {
		var current = $(this).parentTo('tr');
		while(!(current.next().html() == undefined || current.next().find('th').length > 0)) {
			current = current.next();
		}
		getElement.titulo('insertAfter', current).find('input[name="item[][nombre]"]').focus();
	});

	$('section.sheet > table').on('click', 'tbody button.add.item', function() {
		
		var current = $(this).parentTo('tr');
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

		row.find('input[name="item[][nombre]"]').focus().parentTo('tr').find('input[name="item[][costo_interno]"]').prop('checked', $('section.sheet table.items > thead > tr > th > input[name="item[][costo_interno]"]').prop('checked'));
		$('section.sheet table.items > tfoot > tr > th.info').trigger('refresh');
	});
	$('section.sheet table').on('click', 'tbody button.add.parent', function() {
		var current = $(this).parentTo('tr');
		if (current.find('button.toggle.categoria').hasClass('ui-icon-folder-collapsed'))
			current.find('button.toggle.categoria').triggerHandler('click');
		

		
		var row = getElement.itemParent('insertAfter', current);



		columnsPermissions(row);
	});

	$('section.sheet > table').on('click', 'tbody button.insert.item', function() {
		
		var current = $(this).parentTo('tr');
		if (current.find('button.toggle.categoria').hasClass('ui-icon-folder-collapsed'))
			current.find('button.toggle.categoria').triggerHandler('click');
		var row = getElement.item('insertAfter', current);
		columnsPermissions(row);
		
		

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
		row.find('input[name="item[][nombre]"]').focus().parentTo('tr').find('input[name="item[][costo_interno]"]').prop('checked', $('section.sheet table.items > thead > tr > th > input[name="item[][costo_interno]"]').prop('checked'));
		$('section.sheet table.items > tfoot > tr > th.info').trigger('refresh');
	});

	$('section.sheet > table').on('click', 'tbody button.clone.categoria', function() {
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
				item.dataset.id = '';
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
				updateSubtotalTitulos($(this));
				updateSubtotalItems();
			}

			unaBase.ui.unblock();
		};
		if ($('#main-container').data('clone-categoria-no-ask')) {
			cloneCategoria();
		} else {
			var htmlObject = $('<div>¿Confirmas que deseas duplicar la categoría?<br><br><label><input type="checkbox"> No volver a preguntar para esta cotización.</label></div>');
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

	$('section.sheet > table').on('click', 'tbody button.clone.item', function() {
		
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

  //           cloned.trigger('beforeClone'); // Logs tiempo real
		// 	cloned.trigger('afterClone'); // Logs tiempo real

		// 	if (!modoOffline) {
		// 		updateSubtotalTitulos($(this));
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
	$('section.sheet table').on('click', 'tbody button.parent.item', function(event) {
		setParent(event, this, 'cot');
	
	});

	$('section.sheet > table').on('click', 'tbody button.profile.categoria', function() {
		$('#dialog-profile').dialog('open');
	});

	$('section.sheet > table').on('click', 'tbody button.detail.categoria', function(event) {
		saveRow(event, function(id) {
			unaBase.loadInto.dialog('/v3/views/cotizaciones/pop_detalle_items.shtml?id=' + id, 'Detalle de Categoría', 'x-large');
		});
	});

	$('section.sheet > table').on('click', 'tbody button.detail.item', function(event) {
		saveRow(event, function(id) {
			unaBase.loadInto.dialog('/v3/views/cotizaciones/pop_detalle_items.shtml?id=' + id, 'Detalle de Ítem', 'x-large');
		});
	});

	$('section.sheet > table').on('click', 'tbody button.profile.item', function(event) {
		saveRow(event, function(id) {
			var id_item = $(event.target).closest('tr').data('producto');
			unaBase.loadInto.dialog('/v3/views/catalogo/content.shtml?id=' + id_item, 'Perfil de Ítem', 'large');
		});
	});

	$('section.sheet > table').on('click', 'tbody button.show.item', function() {
		$(this).parentTo('tr').find('[name="item[][nombre]"]').autocomplete('search', '@').focus();
	});

	$('section.sheet > table').on('click', 'tbody button.show.unidad', function() {
		$(this).parentTo('tr').find('[name="item[][unidad]"]').autocomplete('search', '@').focus();
	});

	$('section.sheet > table').on('click', 'tbody button.show.tipo-documento', function() {
		$(this).parentTo('tr').find('[name="item[][tipo_documento]"]').autocomplete('search', '@').focus();
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
											target.data('formula-productor-ejecutivo-ratio', ui.item.formula_productor_ejecutivo_ratio);
											// Bloquear nombre, tipo documento y cantidades
											target.find('[name="item[][nombre]"]').prop('readonly', true);
											target.find('button.show.item').invisible();
											target.find('[name="item[][tipo_documento]"]').prop('readonly', true);
											target.find('button.show.tipo-documento').hide();
											//target.find('[name="item[][cantidad]"]').prop('readonly', true);
											target.find('[name="item[][factor]"]').prop('readonly', true);
										} else {
											target.removeData('formula-productor-ejecutivo');
											target.removeData('formula-productor-ejecutivo-ratio');
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
											target.find('[name="item[][costo_unitario]"]').val(ui.item.costo / exchange_rate).data('old-value', ui.item.costo / exchange_rate);
											target.find('[name="item[][subtotal_costo]"]').val(ui.item.costo / exchange_rate);
										}

										target.find('[name="item[][nombre]"]').data('nombre-original', ui.item.text);

										var tooltip = ' \
											<p>Nombre ítem:</p> \
											<p>' + ui.item.text + '</p> \
											<p>&nbsp;</p> \
											<p>Descripción larga:</p> \
											<p>' + ((ui.item.observacion!= '')? ui.item.observacion.replace(/\n/g, '</p><p>') : 'N/A') + '</p> \
											<p>&nbsp;</p>\
											<p>Observación interna:</p> \
											<p>' + ((ui.item.comentario!= '')? ui.item.comentario.replace(/\n/g, '</p><p>') : 'N/A') + '</p> \
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
				$(event.target).data('old-value', $(event.target).val());
				$(event.target).unbind('.format');
				$(event.target).number(true, decimals, ',', '.');
				console.log('Precio unitario sin decimales es: ' + parseFloat($(event.target).val()).toFixed(0).toString());
				console.log('Se guardó en old-value: ' + parseFloat($(event.target).data('old-value')));

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



		$('[name="cotizacion[montos][impuesto][exento]"]').change(function(event) {
			// Confirmar modificación check exento
			confirm('¿Está seguro de modificar el estado exento de la cotización?<br>-Esto podría cambiar los valores totales.').done(function(data) {
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
		//blockCinemagica.find('[name="sobrecargo[6][porcentaje]"]').on('blur', refreshComisionAgenciaToSobrecargos);
		blockCinemagica.find('[name="sobrecargo[6][porcentaje]"]').on('blur', calcValoresCinemagica);
		//blockCinemagica.find('[name="cotizacion[cinemagica][director][porcentaje]"]').on('blur', refreshDirector);
		blockCinemagica.find('[name="cotizacion[cinemagica][director][porcentaje]"]').on('blur', calcValoresCinemagica);

   

    	business.getSobrecargoData(sobrecargosPlantilla);
 
		// Permisos por columna
		//columnsPermissions();

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
			$(this).parentTo('tr').find('[name="item[][costo_unitario]"]').val($(this).val()).data('old-value', $(this).data('old-value')).trigger('blur');

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
				if ($(event.target).parentTo('tr').find('input[name="item[][precio_unitario]"]').data('old-value')) {
					$(event.target).parentTo('tr').find('input[name="item[][costo_unitario]"]').val(parseFloat($(event.target).parentTo('tr').find('input[name="item[][precio_unitario]"]').data('old-value')));
					$(event.target).parentTo('tr').find('input[name="item[][costo_unitario]"]').data('old-value', parseFloat($(event.target).parentTo('tr').find('input[name="item[][precio_unitario]"]').data('old-value')));
				} else {
					$(event.target).parentTo('tr').find('input[name="item[][costo_unitario]"]').val(parseFloat($(event.target).parentTo('tr').find('input[name="item[][precio_unitario]"]').val()));
					$(event.target).parentTo('tr').find('input[name="item[][costo_unitario]"]').data('old-value', parseFloat($(event.target).parentTo('tr').find('input[name="item[][precio_unitario]"]').val()));
				}
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
		if (!modoOffline) {

			var items = $(this).parentTo('tr').nextUntil('.title');
			items.each(function() {
				$(this).find('input[name="item[][horas_extras]"]').val(horas_extras).trigger('change').trigger('update');
			});
		}
	});

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

	$('section.sheet').on('hover', 'button.detail.price', function(event) {
		var element = $(this);
		$(this).tooltipster({
			content: function() {
				var exchange_rate_usd = (valor_usd_cotizacion > 0)? valor_usd_cotizacion : valor_usd;
				var exchange_rate_clf = (valor_clf_cotizacion > 0)? valor_clf_cotizacion : valor_clf;

				var htmlObject = $('\
					<ul>																																				\
						<li data-name="tipo-documento">																													\
							<strong style="font-weight: bold; display: inline-block; width: 220px;">Tipo de documento</strong>											\
							<span></span>																																\
						</li>																																			\
						<li data-name="valor-negociado">																												\
							<strong style="font-weight: bold; display: inline-block; width: 220px;">Valor ingresado<span class="valor-usd"></span></strong>				\
							<span class="numeric currency">' + localCurrency + ' <span style="display: inline-block; width: 100px; text-align: right;"></span></span>	\
						</li>																																			\
						<li data-name="imposiciones">																													\
							<strong style="font-weight: bold; display: inline-block; width: 220px;">Imposiciones (<span class="numeric percent"></span>%)</strong>		\
							<span class="numeric currency">' + localCurrency + ' <span style="display: inline-block; width: 100px; text-align: right;"></span></span>	\
						</li>																																			\
						<li data-name="retencion">																														\
							<strong style="font-weight: bold; display: inline-block; width: 220px;">Retención (<span class="numeric percent"></span>%)</strong>			\
							<span class="numeric currency">' + localCurrency + ' <span style="display: inline-block; width: 100px; text-align: right;"></span></span>	\
						</li>																																			\
						<li data-name="horas-extras">																													\
							<strong style="font-weight: bold; display: inline-block; width: 220px;">Horas extras (<span class="numeric percent"></span>)</strong>		\
							<span class="numeric currency">' + localCurrency + ' <span style="display: inline-block; width: 100px; text-align: right;"></span></span>	\
						</li>																																			\
						<li data-name="total" style="border-top: 1px solid grey; margin-top: 10px; padding-top: 10px;">													\
							<strong style="font-weight: bold; display: inline-block; width: 220px;">Total</strong>														\
							<span class="numeric currency">' + localCurrency + ' <span style="display: inline-block; width: 100px; text-align: right;"></span></span>	\
						</li>																																			\
					</ul>																																				\
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
				if (typeof selected_currency == 'undefined') {
					// Corrección cuando se ocultan decimales
					//var total = parseFloat(row.find('input[name="item[][precio_unitario]"]').val());
					if (row.find('input[name="item[][precio_unitario]"]').data('old-value'))
						var total = parseFloat(row.find('input[name="item[][precio_unitario]"]').data('old-value'));
					else
						var total = parseFloat(row.find('input[name="item[][precio_unitario]"]').val());
				} else {
					// Corrección cuando se ocultan decimales
					//var total = parseFloat(row.find('input[name="item[][precio_unitario]"]').val());
					if (row.find('input[name="item[][precio_unitario]"]').data('old-value'))
						var total = parseFloat(row.find('input[name="item[][precio_unitario]"]').data('old-value'));
					else
						var total = parseFloat(row.find('input[name="item[][precio_unitario]"]').val());
				}

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

	$('section.sheet table.items > thead > tr > th > input[name="item[][costo_interno]"]').change(function() {
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

	// begin edit -- gin (21.10.15)
	$('section.sheet table.items > thead > tr > th > input[name="item[][ocultar_print]"]').change(function() {
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
	// end edit

	// Confirmar al cambiar check sobrecargo, en caso que afecte los montos
	$('#main-container').on('change', 'table.items.cotizacion tr:not(.title) input[name="item[][aplica_sobrecargo]"]', function(event) {
		if (!$('table.items.cotizacion').data('edit-aplica-sobrecargo-remember') && $('section.sobrecargos li[data-items="true"] span.percent input').val() > 0 /* && (($(event.target).closest('tr').find('input[name="item[][precio_unitario]"]').data('old-value'))? $(event.target).closest('tr').find('input[name="item[][precio_unitario]"]').data('old-value') : $(event.target).closest('tr').find('input[name="item[][precio_unitario]"]').val()) > 0 */) {
			// asdf (incluir no volver a preguntar)
			confirm("¿Está seguro de modificar el ítem afecto a comisión?<br>-Esto podría cambiar los valores totales.<br><br><label><input type=\"checkbox\" name=\"edit_aplica_sobrecargo_remember\"> No volver a preguntar para esta cotización</label>", 'Sí', 'No').done(function(data) {
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

	$('input[name="cotizacion[ver_solo_items_usados]"]').on('change', updateVistaItems);

	$('section.sheet').on('hover', 'button.detail.total', function(event) {
	    var element = $(this);
	    $(this).tooltipster({
	        content: function() {
	            var exchange_rate_usd = (valor_usd_cotizacion > 0)? valor_usd_cotizacion : valor_usd;
	            var exchange_rate_clf = (valor_clf_cotizacion > 0)? valor_clf_cotizacion : valor_clf;

	            var total_a_cliente = parseFloat($('[name="cotizacion[ajuste]"]').val());

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

});
