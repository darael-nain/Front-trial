if (typeof selected_currency == 'undefined')
	var localCurrency = currency.symbol;
else {
	var localCurrency = selected_currency;
}

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

	// htmlObject.find('button.add.all-items').click(function() {
	$('section.sheet table').on('click', 'tbody tr.title button.add.all-items', function(event) {
		var htmlObject = $(event.target).closest('tr');
		if (htmlObject.data('categoria'))
			addAllItems(htmlObject);
		else
			toastr.warning('Para utilizar esta opción, debe seleccionar una categoría existente en el catálogo.');
	});

	$('section.sheet table.items > tbody').on('change', '> tr.title > th:last-of-type input[name="item[][selected]"]', function(event) {
		var is_checked = $(event.target).prop('checked');
		$(this).closest('tr').nextUntil('tr.title').each(function(key, item) {
			$(item).find('input[name="item[][selected]"]').prop('checked', is_checked);
		});
	});

	// htmlObject.focusin(function() {
	$('section.sheet table').on('focusin', 'tbody tr.title', function(event) {
		var htmlObject = $(this);
		var inputObject = $(this).find('input[name="item[][nombre]"]');
		inputObject.autocomplete({
			source: function(request, response) {
				inputObject.data('ajax-call', true);
				$.ajax({
					url: '/4DACTION/_V3_' + 'getCategoria',
					dataType: 'json',
					data: {
						q: request.term,
						area_negocio: $('[name="cotizacion[area_negocio]"]').data('id')
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

				$(this).trigger('change');
				return false;
			}

		}).data('ui-autocomplete')._renderItem = function(ul, item) {
			return $('<li><a><strong>' +  ((item.especial)? 'Especial' : '') + '</strong><em>' + ((item.gasto_fijo)? 'Gasto Fijo' : '') + '</em><span class="highlight">' + item.text + '</span></a></li>').appendTo(ul);
		};
	});

	// htmlObject.focusout(function() {
	$('section.sheet table').on('focusout', 'tbody tr.title', function() {
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
	    var tipo_documento_inverse_old = (typeof target.data('tipo-documento-inverse') != 'undefined')? target.data('tipo-documento-inverse') : false;
	    var base_imponible_old = (tipo_documento_ratio_old > 0)? target.data('base-imponible') : target.find('[name="item[][precio_unitario]"]').val();
	    var hora_extra_cantidad_old = target.find('[name="item[][horas_extras]"]').val();

	    // Se reconstruye el precio base

	    var precio_base = 0;

	     if (tipo_documento_inverse_old)
	      // precio_base = Math.round(base_imponible_old * (1 - tipo_documento_ratio_old));
	      precio_base = parseFloat((base_imponible_old * (1 - tipo_documento_ratio_old)).toFixed(currency.decimals + 2));
	    else
	      // precio_base = Math.round(base_imponible_old / (1 + tipo_documento_ratio_old));
	      precio_base = parseFloat((base_imponible_old / (1 + tipo_documento_ratio_old)).toFixed(currency.decmials + 2));

	    target.data('tipo-documento', tipo_documento_new);

	    // Se actualizan valores relacionados a las horas hombre de OT
	    // TODO: actualziar automáticamente cuando se cambian los días para el contrato por proyecto

	    if (target.find('input[name="item[][costo_interno]"]').prop('checked')) {

	      if (typeof target.data('costo-presupuestado-hh-cantidad') == 'undefined')
	        target.data('costo-presupuestado-hh-cantidad', 0);

	      if (typeof target.data('costo-presupuestado-hh-valor') == 'undefined')
	        target.data('costo-presupuestado-hh-valor', 0);

	      var old_costo_total = parseFloat(target.find('input[name="item[][costo_unitario]"]').val());
	      var old_costo_interno = target.data('costo-presupuestado-hh-cantidad') * target.data('costo-presupuestado-hh-valor');
	      var costo_externo = old_costo_total - old_costo_interno;

	      var new_costo_interno = parseFloat($('input[name="item[][cant_hh_asig]"]').val()) * parseFloat($('input[name="item[][costo_hh_unitario]"]').val());
	      var new_costo_total = costo_externo + new_costo_interno;
	      if (old_costo_total != new_costo_total) {
	        target.find('input[name="item[][costo_unitario]"]').val(new_costo_total.toFixed(currency.decimals));
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
	              target.data('base-imponible', parseFloat(target.find('input[name="item[][precio_unitario]"]').val()));
	              target.find('button.detail.price').invisible();
	            }
	          } else {
	            target.data('hora-extra-enabled', false);
	            target.find('input[name="item[][horas_extras]"]').val(0).parentTo('td').invisible();
	            target.find('input[name="item[][precio_unitario]"]').removeClass('edited').removeClass('special');
	            target.find('button.detail.price').invisible();
	            target.data('base-imponible', parseFloat(target.find('input[name="item[][precio_unitario]"]').val()));
	          }

	          var precio_unitario = target.find('input[name="item[][precio_unitario]"]').val();

	          if (precio_unitario != 0) {

	            // Se reemplaza el precio base antiguo por el nuevo
	            target.find('input[name="item[][precio_unitario]"]').trigger('focus').val(0).trigger('blur').trigger('focus').val(precio_base).trigger('blur');

	            // Se reemplaza la cantidad horas extras antigua por la nueva
	            if (target.data('hora-extra-enabled')) {
	              target.find('input[name="item[][horas_extras]"]').val(hora_extra_cantidad_old).trigger('change');
	            }

	          }

	        }
	      });
	};

	// htmlObject.focusin(function() {
	$('section.sheet table').on('focusin', 'tbody tr:not(.title)', function() {
		var htmlObject = $(this);
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
					target.find('[name="item[][horas_extras]"]').val(0);
					target.find('[name="item[][precio_unitario]"]').val(ui.item.precio / exchange_rate);
					target.find('[name="item[][subtotal_precio]"]').val(ui.item.precio / exchange_rate);
					target.find('[name="item[][aplica_sobrecargo]"]').prop('checked', ui.item.aplica_sobrecargo);

					if (typeof copiar_precio_a_costo == 'boolean' && !margen_desde_compra) {
						target.find('[name="item[][costo_unitario]"]').data('auto', true);
						if (ui.item.costo == 0) {
							target.find('[name="item[][costo_unitario]"]').val(ui.item.precio / exchange_rate);
							target.find('[name="item[][subtotal_costo]"]').val(ui.item.precio / exchange_rate);
						} else {
							target.find('[name="item[][costo_unitario]"]').val(ui.item.costo / exchange_rate);
							target.find('[name="item[][subtotal_costo]"]').val(ui.item.costo / exchange_rate);
						}
					} else {
						htmlObject.find('[name="item[][costo_unitario]"]').val(ui.item.costo / exchange_rate);
						htmlObject.find('[name="item[][subtotal_costo]"]').val(ui.item.costo / exchange_rate);
					}

					target.find('[name="item[][nombre]"]').data('nombre-original', ui.item.text);

					target.find('button.profile.item').tooltipster('update', ui.item.text);

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
								filter: 'id'
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

					$(this).trigger('change');
					updateSubtotalTitulos($(this));
					updateSubtotalItems();
					return false;
				}

			}).data('ui-autocomplete')._renderItem = function(ul, item) {
				return $('<li><a><strong>' + item.index + ' ' + ((item.gasto_fijo)? '[Gasto Fijo]' : '') + ' ' +  ((item.especial)? '[Especial]' : '') + '</strong><em>' +  item.categoria.text + '</em><span class="highlight">' + item.text + '</span>' + ( (item.precio > 0)? '<span>Precio venta: $' + item.precio.toLocaleString() + '</span>' : '' ) + '</a></li>').appendTo(ul);
			};
		} else {
			updateSubtotalTitulos($(this));
			updateSubtotalItems();
		}

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
				$(this).val(ui.item.abbr);
				return false;
			},
			select: function(event, ui) {
				$(this).val(ui.item.abbr);
				var target = htmlObject;

				target.data('no-update', true);

				changeTipoDocumento(target, target.data('tipo-documento'), ui.item.id);

				target.removeData('no-update');

				// $(this).trigger('change');
				updateSubtotalTitulos($(this));
				updateSubtotalItems();
				return false;
			}

		}).data('ui-autocomplete')._renderItem = function(ul, item) {
			return $('<li><a>' +  item.text + '</a></li>').appendTo(ul);
		};

	});


	// htmlObject.focusout(function() {
	$('section.sheet table').on('focusout', 'tbody tr:not(.title)', function() {
		if ($(this).find('input[name="item[][nombre]"]').hasClass('ui-autocomplete-input'))
			$(this).find('input[name="item[][nombre]"]').autocomplete('destroy');
		if ($(this).find('input[name="item[][tipo_documento]"]').hasClass('ui-autocomplete-input'))
			$(this).find('input[name="item[][tipo_documento]"]').autocomplete('destroy');
	});


	$('section.sheet table').on('click', 'tbody tr:not(.title) button.remove.item', function() {
		contentChanged = true;
		contentReady = false;
		var element = this;
		var title = $(element).parentTo('tr').prevTo('.title');

		$(element).parentTo('tr').fadeOut(400, function() {
			$(this).remove(); // FIXME: ver si realmente quita de la memoria los nodos
			updateSubtotalTitulos(title);
			updateSubtotalItems();
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
					this.remove();
				});

				unaBase.ui.unblock();
			}

			title.fadeOut(400, function() {
				$(this).remove();
				contentChanged = true;
				contentReady = false;
				updateSubtotalItems();
				$('section.sheet table.items > tfoot > tr > th.info').trigger('refresh');
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

		if (current.find('tr').length > 0)
			getElement.titulo('prependTo', current).find('input').focus();
		else
			getElement.titulo('prependTo', current).find('input').focus();
	});

	$('section.sheet table').on('click', 'tbody button.add.categoria', function() {
		var current = $(this).parentTo('tr');
		while(!(current.next().html() == undefined || current.next().find('th').length > 0)) {
			current = current.next();
		}
		getElement.titulo('insertAfter', current).find('input[name="item[][nombre]"]').focus();
	});

	$('section.sheet table').on('click', 'tbody button.add.item', function() {
		var current = $(this).parentTo('tr');
		if (current.find('button.toggle.categoria').hasClass('ui-icon-folder-collapsed'))
			current.find('button.toggle.categoria').triggerHandler('click');
		while(!(current.next().html() == undefined || current.next().find('th').length > 0)) {
			current = current.next();
		}
		getElement.item('insertAfter', current).find('input[name="item[][nombre]"]').focus().parentTo('tr').find('input[name="item[][costo_interno]"]').prop('checked', $('section.sheet table.items > thead > tr:last-of-type > th > input[name="item[][costo_interno]"]').prop('checked')).invisible();;
		$('section.sheet table.items > tfoot > tr > th.info').trigger('refresh');
	});

	$('section.sheet table').on('click', 'tbody button.insert.item', function() {
		var current = $(this).parentTo('tr');
		if (current.find('button.toggle.categoria').hasClass('ui-icon-folder-collapsed'))
			current.find('button.toggle.categoria').triggerHandler('click');
		getElement.item('insertAfter', current).find('input[name="item[][nombre]"]').focus().parentTo('tr').find('input[name="item[][costo_interno]"]').prop('checked', $('section.sheet table.items > thead > tr:last-of-type > th > input[name="item[][costo_interno]"]').prop('checked'));
		$('section.sheet table.items > tfoot > tr > th.info').trigger('refresh');
	});

	$('section.sheet table').on('click', 'tbody button.clone.categoria', function() {
		unaBase.ui.block();
		var current = $(this).parentTo('tr');

		current.nextUntil('tr.title').andSelf().clone(true).each(function(key, item) {
			$(item).removeData('id');
		}).insertAfter(current.nextUntil('tr.title').last());

		$('section.sheet table.items > tfoot > tr > th.info').trigger('refresh');

		updateSubtotalTitulos($(this));
		updateSubtotalItems();

		unaBase.ui.unblock();
	});

	$('section.sheet table').on('click', 'tbody button.clone.item', function() {
		var current = $(this).parentTo('tr');
		current.clone(true).insertAfter(current).removeData('id');
		updateSubtotalTitulos($(this));
		updateSubtotalItems();
		$('section.sheet table.items > tfoot > tr > th.info').trigger('refresh');
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
		if ($('section.sheet').data('readonly') || $('section.sheet').data('locked') || !access._528)
			unaBase.loadInto.dialog('/v3/views/items/content.shtml?id=' + $(this).parentTo('tr').data('id'), 'Detalle de Ítem', 'x-large');
		else
			saveRow(event, function(id) {
				unaBase.loadInto.dialog('/v3/views/negocios/pop_detalle_items.shtml?id=' + id, 'Detalle de Ítem', 'x-large');
			});
	});

	$('section.sheet table').on('click', 'tbody button.profile.item', function() {
		saveRow(event, function(id) {
			unaBase.loadInto.dialog('/v3/views/catalogo/content.shtml?id=' + id, 'Perfil de Ítem', 'large');
		});
	});

	$('section.sheet table').on('click', 'tbody button.show.item', function() {
		$(this).parentTo('tr').find('[type="search"]').autocomplete('search', '@').focus();
	});

	$('section.sheet table').on('click', 'tbody button.show.tipo-documento', function() {
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
				$(element).parentTo('tr').find('input[name="item[][cantidad]"]').val(1);
				$(element).parentTo('tr').find('input[name="item[][factor]"]').val(1);
				$(element).parentTo('tr').find('input[name="item[][horas_extras]"]').val(0);
			} else {
				if ($(element).parentTo('tr').find('[name="item[][nombre]"]').val().trim() != '') {
					if ($(element).parentTo('tr').find('[name="item[][nombre]"]').data('ajax-call') !== undefined) {
						$(element).parentTo('tr').find('[name="item[][nombre]"]').removeClass('edited').data('nombre-original', null);
						$(element).parentTo('tr').find('input').val('');
						$(element).parentTo('tr').find('input[name="item[][cantidad]"]').val(1);
						$(element).parentTo('tr').find('input[name="item[][factor]"]').val(1);
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

		if ($(event.target).closest('tr').data('first-load') !== true) {

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
							$(element).parentTo('tr').find('input[name="item[][cantidad]"]').val(1);
							$(element).parentTo('tr').find('input[name="item[][factor]"]').val(1);
							$(element).parentTo('tr').find('input[name="item[][horas_extras]"]').val(0);
						} else {
							if ($(element).parentTo('tr').find('[name="item[][nombre]"]').val().trim() != '') {
								if ($(element).parentTo('tr').find('[name="item[][nombre]"]').data('ajax-call') !== undefined) {
									$(element).parentTo('tr').find('[name="item[][nombre]"]').removeClass('edited').data('nombre-original', null);
									$(element).parentTo('tr').find('input').val('');
									$(element).parentTo('tr').find('input[name="item[][cantidad]"]').val(1);
									$(element).parentTo('tr').find('input[name="item[][factor]"]').val(1);
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
										target.find('[name="item[][horas_extras]"]').val(0);

										if (ui.item.porcentaje_monto_total == 0) {
											target.find('[name="item[][precio_unitario]"]').val(ui.item.precio / exchange_rate);
											target.find('[name="item[][subtotal_precio]"]').val(ui.item.precio / exchange_rate);
											target.removeData('porcentaje-monto-total');
											target.find('[name="item[][precio_unitario]"]').removeProp('readonly');
										} else {
											// var total_a_cliente = $('[name="sobrecargo[5][subtotal]"]').val();
											var total_a_cliente = parseFloat($('input[name="cotizacion[ajuste]"]').val()) - parseFloat($('input[name="cotizacion[ajuste]"]').val()) * parseFloat($('input[name="sobrecargo[6][porcentaje]"]').val() / 100.00);
											target.data('porcentaje-monto-total', ui.item.porcentaje_monto_total);
											target.find('[name="item[][precio_unitario]"]').prop('readonly', true);
										}

										target.find('[name="item[][aplica_sobrecargo]"]').prop('checked', ui.item.aplica_sobrecargo);

										target.find('[name="item[][ocultar_print]"]').prop('checked', ui.item.ocultar_print);

										// Corrección para caso margen desde compra
										if (typeof copiar_precio_a_costo == 'boolean' && margen_desde_compra)
											target.find('[name="item[][costo_unitario]"]').data('auto', true);

										if (typeof copiar_precio_a_costo == 'boolean' && !margen_desde_compra) {
											target.find('[name="item[][costo_unitario]"]').data('auto', true);
											if (ui.item.costo == 0) {
												target.find('[name="item[][costo_unitario]"]').val(ui.item.precio / exchange_rate);
												target.find('[name="item[][subtotal_costo]"]').val(ui.item.precio / exchange_rate);
											} else {
												target.find('[name="item[][costo_unitario]"]').val(ui.item.costo / exchange_rate);
												target.find('[name="item[][subtotal_costo]"]').val(ui.item.costo / exchange_rate);
											}
										} else {
											htmlObject.find('[name="item[][costo_unitario]"]').val(ui.item.costo / exchange_rate);
											htmlObject.find('[name="item[][subtotal_costo]"]').val(ui.item.costo / exchange_rate);
										}

										target.find('[name="item[][nombre]"]').data('nombre-original', ui.item.text);

										target.find('button.profile.item').tooltipster('update', ui.item.text);

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
													filter: 'id'
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

	};

	$('table.items').on('blur', 'tbody td input:not([type="checkbox"])', updateLine);
	$('table.items').on('change', 'tbody td input[type="checkbox"]', updateLine);
	$('table.items').on('update', 'tbody td input', updateLine);

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
								target.prevTo('.title').find('button.add.item').click();
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


	$('section.sheet footer').on('blur', '[name^="sobrecargo"][name$="[porcentaje]"]', function(event) {
		if (!$(this).prop('readonly')) {
			contentChanged = true;
			contentReady = false;
			if ($(event.target).parentTo('ul').find('li[data-total="true"]').length > 1) {
				for (var i = 0; i <= 24; i++)
					updateSobrecargos();
			} else
				updateSobrecargos();
		}
	});

	$('section.sheet footer').on('blur', '[name^="sobrecargo"][name$="[valor]"]', function(event) {
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
		checkAjuste(true);
	});

	$('section.sheet footer').on('change', '[name^="sobrecargo"][name$="[cerrado]"]', function() {
		updateSobrecargos();
	});

	$('[name="cotizacion[descuento][porcentaje]"]').on('blur', function() {
		var porcentaje_descuento = parseFloat($(this).val());
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
	});

	$('[name="cotizacion[descuento][valor]"]').on('blur', function() {
		$(this).validateNumbers();
		var subtotal_precios = parseFloat($('[name="cotizacion[precios][subtotal]"]').val());
		var subtotal_sobrecargos = parseFloat($('[name="cotizacion[sobrecargos][subtotal]"]').val());
		var valor_descuento = parseFloat($(this).val());

		var porcentaje_descuento = valor_descuento/ (subtotal_precios + subtotal_sobrecargos) * 100.00;
		$('[name="cotizacion[descuento][porcentaje]"]').val(porcentaje_descuento.toFixed(6));

		// updateSubtotalNeto();
		updateSobrecargos();
	});

	$('[name="cotizacion[ajuste]"]').on('blur', function(event) {
		if (typeof event.originalEvent != 'undefined') {
			unaBase.ui.block();

			$(this).data('target-value', parseFloat($(this).val()));
			$(this).data('iterations', parseFloat(1));
		} else {
			if ($(this).data('iterations') == 1)
				totalNeto = parseFloat($(this).val());
			$(this).data('iterations', parseFloat($(this).data('iterations')) + 1);
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
			if ($(this).data('iterations') <= 24)
				$(this).val($(this).data('target-value')).triggerHandler('blur');
			else {
				unaBase.ui.unblock();
				$('section.sobrecargos li[data-ajuste="true"] input[name$="[valor]"]').val($(this).data('first-value')).trigger('change');
				$('[name="cotizacion[ajuste][diferencia]"]').val($(this).data('first-value'));
			}
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

	$('[name="cotizacion[montos][impuesto][exento]"]').change(function() {
		updateTotal();
	});

	getDetail(function() {
		if ($('section.sheet.detalle-items').data('readonly') || $('section.sheet.detalle-items').data('locked') || !access._528) {
			$('table.items button.toggle.all').trigger('click');
			$('section.sheet.detalle-items').find('input, textarea, tr *:not(.dropdown-button) span').not('[name="item[][selected]"]').not('.dropdown-button').prop('disabled', true).removeAttr('placeholder');
			$('section.sheet.detalle-items').find('tr button, ul.editable button, footer button, .fetch.exchange-rate').not('.detail').not('.dropdown-button').not('[name="item[][closed_compras]"]').hide();
			$('section.sheet.detalle-items').find('table.items > * > tr > *:first-of-type > *').hide();
			$('section.sheet.detalle-items').find('table.items tbody tr').draggable('destroy');
		}

		updateSubtotalItems();
	});

	var showSobrecargos = function(data) {
		var target = $('section.sobrecargos > ul');
		var htmlObject;
		$.each(data.rows, function(key, item) {
			if (typeof selected_currency == 'undefined')
				htmlObject = $(' \
					<li data-id="' + item.id + '"' + ((item.ajuste)? ' data-ajuste="true"': '') + ((item.items)? ' data-items="true"': '') + ((item.total)? ' data-total="true"': ( (item.sobre_subtotal_venta)? ' data-subtotal="true"' : ''  )) + '> \
						<span>' + item.nombre + ((item.items)? ' <sup>(*)</sup>' : '') + ((item.total)? ' <sup>(**)</sup>' :  ( (item.sobre_subtotal_venta)? ' <sup>(***)</sup>' : '' )  ) + '</span> \
						<span class="numeric percent"><input class="' + ((item.costo)? 'costo': 'utilidad') + '"' + ((scDirectInput)? ' readonly' : '') + ' required type="text" name="sobrecargo[' + item.id + '][porcentaje]" value="' + item.porcentaje + '"> %</span> \
						<span class="numeric currency">' + localCurrency + ' <input class="' + ((item.costo)? 'costo': 'utilidad') + '"' + ((!scDirectInput)? ' readonly' : ((item.ajuste)? ' readonly' : '')) + ' type="text" name="sobrecargo[' + item.id + '][valor]" value="' + ((item.id == 5 && !item.costo && item.cerrado.enabled && item.total)? parseFloat(item.valor) : (item.porcentaje * parseFloat(((item.items)? $('[name="cotizacion[precios][subtotal]"]').data('aplica-sobrecargo') : $('[name="cotizacion[precios][subtotal]"]').val())) / 100)).toFixed(currency.decimals) + '"></span> \
						<span>Subtotal</span> \
						<span class="numeric currency">' + localCurrency + ' <input type="text" name="sobrecargo[' + item.id + '][subtotal]" value="0"></span> \
						<span class="option"><label title="Oculta el valor del sobrecargo en la vista de impresión, repartiéndolo entre los ítems afectos."><input type="checkbox" name="sobrecargo[' + item.id + '][cerrado]" value="true"' + ((item.cerrado.enabled)? ' checked': '') + ((!item.cerrado.writable)? ' disabled': '') + '> Cerrado</label></span> \
						<span class="option visible"' + ((!item.costo || typeof item.real == 'undefined')? ' style="display: none;"' : '') + '><label title="Permite que el sobrecargo sea considerado automáticamente como gasto real, sin la necesidad de generar orden de compra."><input type="checkbox" name="sobrecargo[' + item.id + '][real]" value="true"' + ((item.real)? ' checked': '') + (($('#main-container').data('closed'))? ' disabled': '') +  '> Gasto R.</label></span> \
					</li> \
				');
			else
				htmlObject = $(' \
					<li data-id="' + item.id + '"' + ((item.ajuste)? ' data-ajuste="true"': '') + ((item.items)? ' data-items="true"': '') + ((item.total)? ' data-total="true"' :  ( (item.sobre_subtotal_venta)? ' data-subtotal="true"' : ''  )  ) + '> \
						<span>' + item.nombre + ((item.items)? ' <sup>(*)</sup>' : '') + ((item.total)? ' <sup>(**)</sup>' :  ( (item.sobre_subtotal_venta)? ' <sup>(***)</sup>' : '' )  ) + '</span> \
						<span class="numeric percent"><input class="' + ((item.costo)? 'costo': 'utilidad') + '"' + ((scDirectInput)? ' readonly' : '') + ' required type="text" name="sobrecargo[' + item.id + '][porcentaje]" value="' + item.porcentaje + '"> %</span> \
						<span class="numeric currency">' + localCurrency + ' <input class="' + ((item.costo)? 'costo': 'utilidad') + '"' + ((!scDirectInput)? ' readonly' : ((item.ajuste)? ' readonly' : '')) + ' type="text" name="sobrecargo[' + item.id + '][valor]" value="' + ((item.id == 5 && !item.costo && item.cerrado.enabled && item.total)? parseFloat(item.valor) : (item.porcentaje * parseFloat(((item.items)? $('[name="cotizacion[precios][subtotal]"]').data('aplica-sobrecargo') : $('[name="cotizacion[precios][subtotal]"]').val())) / 100.00)).toFixed(2) + '"></span> \
						<span>Subtotal</span> \
						<span class="numeric currency">' + localCurrency + ' <input readonly type="text" name="sobrecargo[' + item.id + '][subtotal]" value="0"></span> \
						<span class="option"><label title="Oculta el valor del sobrecargo en la vista de impresión, repartiéndolo entre los ítems afectos."><input type="checkbox" name="sobrecargo[' + item.id + '][cerrado]" value="true"' + ((item.cerrado.enabled)? ' checked': '') + ((!item.cerrado.writable)? ' disabled': '') + '> Cerrado</label></span> \
						<span class="option visible"' + ((!item.costo || typeof item.real == 'undefined')? ' style="display: none;"' : '') + '><label title="Permite que el sobrecargo sea considerado automáticamente como gasto real, sin la necesidad de generar orden de compra."><input type="checkbox" name="sobrecargo[' + item.id + '][real]" value="true"' + ((item.real)? ' checked': '') + (($('#main-container').data('closed'))? ' disabled': '') +  '> Gasto R.</label></span> \
					</li> \
				');

			htmlObject.find('input[name="sobrecargo[' + item.id + '][real]"]').change(function(event) {
				var costo_ratio = (parseFloat($('input[name="cotizacion[costos][subtotal]"]').val()) > 0)? parseFloat($('input[name="cotizacion[costos_real][subtotal]"]').val()) / parseFloat($('input[name="cotizacion[costos][subtotal]"]').val()) : 0;
				var total_neto = parseFloat($('span[name="cotizacion[montos][subtotal_neto]"]').first().text().replace(/\./g, '').replace(/,/g, '.'));
				var costo_sobrecargo = parseFloat(parseFloat($(event.target).parentTo('li').find('input[name="sobrecargo[' + item.id + '][valor]"]').val()) * costo_ratio);
				var costo_real_total = parseFloat($('span[name="cotizacion[montos][costo_real]"]').first().text().replace(/\./g, '').replace(/,/g, '.'));
				// asdf
				if ($(event.target).prop('checked'))
					$('span[name="cotizacion[montos][costo_real]"]').text((costo_real_total + costo_sobrecargo).toFixed(currency.decimals)).number(true, currency.decimals, ',', '.');
				else
					$('span[name="cotizacion[montos][costo_real]"]').text((costo_real_total - costo_sobrecargo).toFixed(currency.decimals)).number(true, currency.decimals, ',', '.');

				costo_real_total = parseFloat($('span[name="cotizacion[montos][costo_real]"]').text().replace(/\./g, '').replace(/,/g, '.'));

				$('span[name="cotizacion[montos][utilidad_real]"]').text(total_neto - costo_real_total).number(true, currency.decimals, ',', '.');
				$('span[name="cotizacion[montos][costo_real_ratio]"]').text((costo_real_total / total_neto).toFixed(2)).number(true, 2, ',', '.');
				$('span[name="cotizacion[montos][utilidad_real_ratio]"]').text(((total_neto - costo_real_total) / total_neto).toFixed(2)).number(true, 2, ',', '.');

				$('li[data-name="save"] > button').triggerHandler('click');
			});

			htmlObject.find('input[name="sobrecargo[' + item.id + '][cerrado]"]').change(function(event) {
				$('li[data-name="save"] > button').triggerHandler('click');
			});

			if (typeof selected_currency == 'undefined')
				htmlObject.find('.numeric.currency input').number(true, currency.decimals, ',', '.');
			else
				htmlObject.find('.numeric.currency input').number(true, 2, ',', '.');
			htmlObject.find('.numeric.percent input').number(true, 2, ',', '.');

			htmlObject.find('.numeric.percent input').bind('focus', function() {
				if (typeof $(this).data('value') == 'undefined')
					$(this).data('value', $(this).val());
				$(this).unbind('.format').number(true, 6, ',', '.').val($(this).data('value'));
			});

			htmlObject.find('.numeric.percent input').bind('focusout', function(event) {
				$(this).data('value', $(this).val()).unbind('.format').number(true, 2, ',', '.');
			});

			if (typeof item.valor != 'undefined') {
				if (typeof selected_currency == 'undefined')
					htmlObject.find('.numeric.currency input').val(item.valor.toFixed(currency.decimals));
				else
					htmlObject.find('.numeric.currency input').val((item.valor / exchange_rate).toFixed(2));
			}

			htmlObject.find('.numeric.percent input').val(item.porcentaje);
			htmlObject.find('.numeric.percent input').data('value', item.porcentaje);

			if (item.ajuste)
				htmlObject.css('opacity', 0.5).find('.percent').invisible();
			if (scDirectInput)
				htmlObject.find('.percent').invisible();

			target.append(htmlObject);
		});

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

	checkAjuste($('section.sheet').data('new'));
	updateSubtotalItems();

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

		if ($(this).parentTo('tr').data('tipo-documento') && $(this).parentTo('tr').data('tipo-documento-ratio')) {

			if (typeof selected_currency == 'undefined')
				var valor_negociado = parseFloat($(this).val());
			else
				var valor_negociado = parseFloat($(this).val());

			var impuesto = $(this).parentTo('tr').data('tipo-documento-ratio');
			var division = $(this).parentTo('tr').data('tipo-documento-inverse');

			var base_imponible = 0;

			$(this).addClass('edited');
			$(this).parentTo('tr').find('button.detail.price').visible();

			if (typeof selected_currency == 'undefined') {
				if (division)
					base_imponible = valor_negociado / (1.00 - impuesto);
				else
					base_imponible = valor_negociado * (1.00 + impuesto);
			} else {
				if (division)
					base_imponible = valor_negociado / (1.00 - impuesto);
				else
					base_imponible = valor_negociado * (1.00 + impuesto);
			}

			$(this).val(base_imponible);

			$(this).parentTo('tr').data('base-imponible', base_imponible);

			if ($(this).hasClass('special')) {
				var hora_extra_cantidad = parseFloat($(this).parentTo('tr').find('input[name="item[][horas_extras]"]').val());
				$(this).parentTo('tr').find('input[name="item[][horas_extras]"]').trigger('change');

				var hora_extra_valor = $(this).parentTo('tr').data('hora-extra-valor');
				$(this).val(base_imponible + (hora_extra_valor * hora_extra_cantidad));
			}

		}
		if (typeof $(event.target).data('undo') == 'undefined')
			$(event.target).data('undo', true);

		$(this).parentTo('tr').find('[name="item[][cantidad]"]').trigger('focus').trigger('blur');

		if ($(this).parentTo('tr').find('[name="item[][costo_unitario]"]').data('auto'))
			$(this).parentTo('tr').find('[name="item[][costo_unitario]"]').val($(this).val()).trigger('blur');

	};

	var updatePrecioNegociado = function(event) {

		if ($(this).parentTo('tr').data('tipo-documento') && $(this).parentTo('tr').data('tipo-documento-ratio')) {

			if ($(this).hasClass('special')) {
				var valor_a_cotizar = parseFloat($(this).val());
				var hora_extra_cantidad = parseFloat($(this).parentTo('tr').find('input[name="item[][horas_extras]"]').val());

				if (typeof $(this).parentTo('tr').data('hora-extra-valor') == 'undefined')
					$(this).parentTo('tr').find('input[name="item[][horas_extras]"]').trigger('change');

				var hora_extra_valor = $(this).parentTo('tr').data('hora-extra-valor');

				$(this).val(valor_a_cotizar - Math.round(hora_extra_valor * hora_extra_cantidad));
			}

			var valor_a_cotizar = parseFloat($(this).val());

			var impuesto = $(this).parentTo('tr').data('tipo-documento-ratio');
			var multiplicacion = $(this).parentTo('tr').data('tipo-documento-inverse');

			var valor_cotizado = 0;

			$(this).removeClass('edited');
			$(this).parentTo('tr').find('button.detail.price').invisible();

			if (multiplicacion)
				valor_cotizado = valor_a_cotizar * (1 - impuesto);
			else
				valor_cotizado = valor_a_cotizar / (1 + impuesto);

			$(this).val(valor_cotizado);
		}

		unaBase.ui.unblock();

	};

	var updateHorasExtras = function(event) {
		if ($(event.target).parentTo('tr').data('hora-extra-enabled')) {
			var base_imponible = 0;

			if ($(event.target).parentTo('tr').data('base-imponible'))
				base_imponible = $(event.target).parentTo('tr').data('base-imponible');
			else
				base_imponible = parseFloat($(event.target).parentTo('tr').find('input[name="item[][precio_unitario]"]').val());

			var hora_extra_cantidad = parseFloat($(event.target).parentTo('tr').find('input[name="item[][horas_extras]"]').val());
			var dias_cantidad = parseFloat($(event.target).parentTo('tr').find('input[name="item[][factor]"]').val());
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

			if (hora_extra_cantidad > 0)
				$(event.target).parentTo('tr').find('input[name="item[][precio_unitario]"]').addClass('special');
			else
				$(event.target).parentTo('tr').find('input[name="item[][precio_unitario]"]').removeClass('special');

			if (typeof copiar_precio_a_costo == 'boolean' && $(event.target).parentTo('tr').find('input[name="item[][costo_unitario]"]').data('auto'))
				$(event.target).parentTo('tr').find('input[name="item[][costo_unitario]"]').val(parseFloat($(event.target).parentTo('tr').find('input[name="item[][precio_unitario]"]').val()));

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
				var htmlObject = $('\
					<ul>																																							\
						<li data-name="tipo-documento">																																\
							<strong style="font-weight: bold; display: inline-block; width: 220px;">Tipo de documento</strong>														\
							<span></span>																																			\
						</li>																																						\
						<li data-name="valor-negociado">																															\
							<strong style="font-weight: bold; display: inline-block; width: 220px;">Valor ingresado</strong>														\
							<span class="numeric currency">' + localCurrency + ' <span style="display: inline-block; width: 100px; text-align: right;"></span></span>									\
						</li>																																						\
						<li data-name="imposiciones">																																\
							<strong style="font-weight: bold; display: inline-block; width: 220px;">Imposiciones (<span class="numeric percent"></span>%)</strong>					\
							<span class="numeric currency">' + localCurrency + ' <span style="display: inline-block; width: 100px; text-align: right;"></span></span>									\
						</li>																																						\
						<li data-name="retencion">																																	\
							<strong style="font-weight: bold; display: inline-block; width: 220px;">Retención (<span class="numeric percent"></span>%)</strong>						\
							<span class="numeric currency">' + localCurrency + ' <span style="display: inline-block; width: 100px; text-align: right;"></span></span>									\
						</li>																																						\
						<li data-name="horas-extras">																																\
							<strong style="font-weight: bold; display: inline-block; width: 220px;">Horas extras (<span class="numeric percent"></span>)</strong>					\
							<span class="numeric currency">' + localCurrency + ' <span style="display: inline-block; width: 100px; text-align: right;"></span></span>									\
						</li>																																						\
						<li data-name="total" style="border-top: 1px solid grey; margin-top: 10px; padding-top: 10px;">																\
							<strong style="font-weight: bold; display: inline-block; width: 220px;">Total</strong>																	\
							<span class="numeric currency">' + localCurrency + ' <span style="display: inline-block; width: 100px; text-align: right;"></span></span>									\
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
				var division = row.data('tipo-documento-inverse');
				if (typeof selected_currency == 'undefined')
					var total = parseFloat(row.find('input[name="item[][precio_unitario]"]').val());
				else
					var total = parseFloat(row.find('input[name="item[][precio_unitario]"]').val());

				var valor_negociado = 0;
				if (division) {
					htmlObject.find('li[data-name="imposiciones"]').hide();
					valor_negociado = base_imponible * (1 - impuesto);
				} else {
					htmlObject.find('li[data-name="retencion"]').hide();
					valor_negociado = base_imponible / (1 + impuesto);
				}

				var imposiciones = base_imponible - valor_negociado;

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

				htmlObject.find('li[data-name="exchange-rate-usd"] > span > span').text((exchange_rate_usd).toFixed(2).replace(/\./g, ',')).number(true, 2, ',', '.');
				htmlObject.find('li[data-name="exchange-rate-clf"] > span > span').text((exchange_rate_clf).toFixed(2).replace(/\./g, ',')).number(true, 2, ',', '.');

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

	$('section.sheet table.items > tbody').on('change', 'tr.title > th > input[name="item[][ocultar_print]"]', function() {
		var titulo = $(this).closest('tr');
		if ($(this).prop('checked')) {
			titulo.nextUntil("tr.title").find('input[name="item[][ocultar_print]"]:not(:checked)').prop('checked', true);
		} else {
			titulo.nextUntil("tr.title").find('input[name="item[][ocultar_print]"]:checked').prop('checked', false);
		}
	});

	$('section.sheet table.items > tbody').on('change', 'tr:not(.title) > td > input[name="item[][ocultar_print]"]', function() {
		if ($(this).prop('checked') && $(this).closest('tr').find('input[name="item[][precio_unitario]"]').val() > 0 ) {
			alert('El ítem seleccionado tiene costo unitario mayor a cero. Al imprimir producirá diferencias en los totales.');
		}
	});

	(function() {

		var htmlObject = $('\
				<ul class="dropdown-menu" style="position: absolute; top: 25px; right: 0; z-index: 1000; min-width: 150px; text-align: left;">	\
					<li><a href="#" class="select-all items"><span class="ui-icon ui-icon-radio-on"></span>Seleccionar todo</a></li>			\
					<li><a href="#" class="deselect-all items"><span class="ui-icon ui-icon-radio-off"></span>Deseleccionar todo</a></li>		\
					<li><a href="#" class="close-compras items"><span class="ui-icon ui-icon-locked"></span>Cerrar compras</a></li>				\
					<li><a href="#" class="open-compras items"><span class="ui-icon ui-icon-unlocked"></span>Reabrir compras</a></li>			\
					<!--<li><a href="#" class="view-oc items"><span class="ui-icon ui-icon-document-b"></span>Item / Vista oc</a></li>			\
					<li><a href="#" class="view-ot items"><span class="ui-icon ui-icon-document-b"></span>Item / Vista ot</a></li>				\
					<li><a href="#" class="view-oc-ot items"><span class="ui-icon ui-icon-document-b"></span>Item / Vista (oc+ot)</a></li>		\
																																				\
					<li><a href="#" class="create-oc items"><span class="ui-icon ui-icon-document"></span>Crear orden de compra</a></li>		\
					<li><a href="#" class="create-fxr items"><span class="ui-icon ui-icon-document"></span>Crear fondo por rendir</a></li>		\
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
					confirm(MSG.get('CONFIRM_NEGOCIO_CLOSE_COMPRAS_ALL')).done(function(data) {
						if (data)
							$('#menu > ul > li[data-name="close_compras_negocio"] > button').triggerHandler('click');
					});
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
									}
								}
							});
						});
						$('table.items tbody').find('tr input[type="checkbox"][name="item[][selected]"]').prop('checked', false);
						toastr.info('Ítems seleccionados abiertos para compras.');
					}
					if (target.hasClass('create-oc')) {
						alert('Falta', false);
						$('table.items tbody').find('tr input[type="checkbox"][name="item[][selected]"]').prop('checked', false);
					} if (target.hasClass('create-fxr')) {
						alert('Falta', false);
						$('table.items tbody').find('tr input[type="checkbox"][name="item[][selected]"]').prop('checked', false);
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
				var rate = data.quotes[selectedCurrency + currency.code];
				target.find('input[name="cotizacion[tipo_cambio]"]').val(parseFloat(rate).toFixed(2).replace(/\./g, ',')).trigger('change');
			}
		});
	});

	if ($('section.sheet').data('index') > 0)
		contentLoaded = true;


});
