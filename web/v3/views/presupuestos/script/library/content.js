var getElement = {
	titulo: function(functor, element) {
		var htmlObject = $(' \
			<tr class="title" data-categoria="0"> \
				<th><span class="ui-icon ui-icon-arrow-4" title="Arrastrar para mover" style="cursor: move;"></span><button class="ui-icon ui-icon-minus remove categoria" title="Quitar categoría"></button></th> \
				<th> \
					<button class="ui-icon ui-icon-folder-open toggle categoria" title="Contraer o expandir título"></button> \
					<button class="ui-icon ui-icon-circle-plus add categoria" title="Agregar categoría debajo" data-help="Haga clic en este botón para añadir un ítem a la categoría creada"></button> \
					<button class="ui-icon ui-icon-plus add item" title="Agregar ítem"></button> \
				</th> \
				<th><input name="item[][nombre]" type="search" value="" placeholder="Buscar categoría por nombre..."><button class="ui-icon ui-icon-plus add all-items"><!-- <button class="show categoria">Ver categorías</button> --><button class="ui-icon ui-icon-document detail categoria" title="Detalle">Detalle</button><button class="ui-icon ui-icon-gear profile categoria" title="Perfil">Perfil</button></th> \
				<th class="info"></th> \
				<th class="segunda-cantidad"></th> \
				<th class="horas-extras numeric qty abs"><input name="item[][horas_extras]" type="number" min="0" max="9999" value=""></th> \
				<th class="venta"></th> \
				<th class="numeric currency venta">' + currency.symbol + ' <span><input readonly name="item[][subtotal_precio]" type="text" value="0"></span> <span class="info"></span></th> \
				<th class="costo"></th> \
				<th class="numeric currency costo presupuestado">' + currency.symbol + ' <span><input readonly name="item[][subtotal_costo]" type="text" value="0"></span></th> \
				<th class="numeric percent margen-desde-venta margen presupuestado"><span><input readonly name="item[][margen_venta]" type="text" value="0"> %</span></th> \
				<th class="numeric percent margen-desde-compra margen presupuestado"><span><input readonly name="item[][margen_compra]" type="text" value="0"> %</span></th> \
				<th class="numeric currency costo real adquisicion">' + currency.symbol + ' <span><input readonly name="item[][subtotal_costo_real]"></span></th> \
				<th class="numeric currency utilidad real adquisicion">' + currency.symbol + ' <span><input readonly name="item[][utilidad_real]"></span></th> \
				<th class="numeric percent margen-desde-venta margen real adquisicion"><span><input readonly name="item[][margen_venta_real]"> %</span></th> \
				<th class="numeric percent margen-desde-compra margen real adquisicion"><span><input readonly name="item[][margen_compra_real]"> %</span></th> \
				<th class="numeric currency adquisicion">' + currency.symbol + ' <span><input readonly name="item[][diferencia]"></span></th> \
				<th class="numeric percent adquisicion"><span><input readonly name="item[][diferencia_ratio]"> %</span></th> \
				<th colspan="2"></th> \
			</tr> \
		');

		htmlObject[functor](element);

		if (typeof selected_currency == 'undefined')
			htmlObject.find('.numeric.currency input').number(true, currency.decimals, ',', '.');
		else
			htmlObject.find('.numeric.currency input').number(true, 2, ',', '.');
		htmlObject.find('.numeric.percent input').number(true, 2, ',', '.');

		/*htmlObject.find('button.toggle.categoria').click(function() {
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

		htmlObject.find('button.add.all-items').click(function() {
			if (htmlObject.data('categoria'))
				addAllItems(htmlObject);
			else
				toastr.warning('Para utilizar esta opción, debe seleccionar una categoría existente en el catálogo.');
		});

		htmlObject.draggable({
			helper: 'clone',
			containment: 'tbody',
			start: function(event, ui) {
				var dragSource = $(event.target).nextUntil('.title');
				var width = dragSource.width();
				var height = dragSource.height()

				dragSource.addClass('moving-src');
				updateSubtotalTitulos($(event.target));
				// FIXME: el helper no responde a cambios en el width
				ui.helper.width(width);
				ui.helper.height(height);
			},
			revert: function(event, ui) {
				$('.moving-src').removeClass('moving-src');
			}
		});

		htmlObject.droppable({
			hoverClass: 'ui-state-active',
			accept: 'table.items > tbody > tr',
			drop: function(event, ui) {
				var dragTarget = $(event.target).nextUntil('.title');
				$(event.target).after(ui.draggable);
				if (ui.draggable.hasClass('title')) {
					dragTarget.addClass('moving-dst');
					ui.draggable.insertAfter($(event.target));
					$('.moving-src').removeClass('moving-src').insertAfter(ui.draggable);
					$('.moving-dst').removeClass('moving-dst').insertAfter($(event.target));

				} else {
					ui.draggable.insertAfter($(event.target));
				}
			}
		});

		htmlObject.focusin(function() {
			$(this).find('input[name="item[][nombre]"]').autocomplete({
				source: function(request, response) {
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
					$(this).trigger('change');
					return false;
				}

			}).data('ui-autocomplete')._renderItem = function(ul, item) {
				return $('<li><a><strong>' +  ((item.especial)? 'Especial' : '') + '</strong><em>' + ((item.gasto_fijo)? 'Gasto Fijo' : '') + '</em><span class="highlight">' + item.text + '</span></a></li>').appendTo(ul);
			};
		});

		htmlObject.focusout(function() {
			if ($(this).find('input[name="item[][nombre"]').hasClass('ui-autocomplete-input'))
				$(this).find('input[name="item[][nombre]"]').autocomplete('destroy');
		});*/

		htmlObject.draggable({
			helper: 'clone',
			containment: 'tbody',
			start: function(event, ui) {
				var dragSource = $(event.target).nextUntil('.title');
				var width = dragSource.width();
				var height = dragSource.height()

				dragSource.addClass('moving-src');
				updateSubtotalTitulos($(event.target));
				// FIXME: el helper no responde a cambios en el width
				ui.helper.width(width);
				ui.helper.height(height);
			},
			revert: function(event, ui) {
				$('.moving-src').removeClass('moving-src');
			}
		});

		htmlObject.droppable({
			hoverClass: 'ui-state-active',
			accept: 'table.items > tbody > tr',
			drop: function(event, ui) {
				var dragTarget = $(event.target).nextUntil('.title');
				$(event.target).after(ui.draggable);
				if (ui.draggable.hasClass('title')) {
					dragTarget.addClass('moving-dst');
					ui.draggable.insertAfter($(event.target));
					$('.moving-src').removeClass('moving-src').insertAfter(ui.draggable);
					$('.moving-dst').removeClass('moving-dst').insertAfter($(event.target));

				} else {
					ui.draggable.insertAfter($(event.target));
				}
			}
		});

		return htmlObject;
	},
	item: function(functor, element) {
		var htmlObject = $(' \
			<tr data-producto="0"> \
				<td><span class="ui-icon ui-icon-arrow-4" title="Arrastrar para mover" style="cursor: move;"></span><button class="ui-icon ui-icon-minus remove item" title="Quitar ítem"></button> <button class="ui-icon ui-icon-plus insert item" title="Agregar ítem"></button> <button class="ui-icon ui-icon-copy clone item" title="Duplicar ítem"></button></td> \
				<td class="numeric code"><input name="item[][codigo]" type="text" readonly></td> \
				<td><input name="item[][nombre]" type="search" placeholder="Buscar producto o servicio por código o por nombre..."><button class="ui-icon ui-icon-carat-1-s show item">Ver ítems</button><button class="ui-icon ui-icon-document detail item" title="Detalle">Detalle</button><button class="ui-icon ui-icon-gear profile item" title="Perfil"></button></td> \
				<td class="numeric qty"><input name="item[][cantidad]" type="number" value="1" min="1" max="9999"> <span class="unit"></span></td> \
				<td class="segunda-cantidad numeric qty abs"><input name="item[][factor]" type="number" value="1" min="1" max="9999"></td> \
				<td class="horas-extras numeric qty abs"><input name="item[][horas_extras]" type="number" value="0" min="0" max="9999"></td> \
				<td class="numeric currency venta extended">' + currency.symbol + ' <span><input name="item[][precio_unitario]" type="text" value="0"></span> <button class="ui-icon ui-icon-notice detail price" title="Ver detalle del precio">Ver detalle del precio</button></td> \
				<td class="numeric currency venta">' + currency.symbol + ' <span><input readonly name="item[][subtotal_precio]" type="text" value="0"></span> <button class="ui-icon ui-icon-calculator detail exchange-rate" title="Ver en otras monedas">Ver en otras monedas</button></td> \
				<td class="numeric currency costo presupuestado">' + currency.symbol + ' <span><input name="item[][costo_unitario]" type="text" text="0" max="9999999999" value="0"></span></td> \
				<td class="numeric currency costo presupuestado">' + currency.symbol + ' <span><input readonly name="item[][subtotal_costo]" type="text" value="0"></span> <button class="ui-icon ui-icon-notice detail cost" title="Ver detalle del costo">Ver detalle del costo</button></td> \
				<td class="numeric percent margen-desde-venta margen presupuestado"><span><input name="item[][margen_venta]" type="text" value="0"> %</span></td> \
				<td class="numeric percent margen-desde-compra margen presupuestado"><span><input name="item[][margen_compra]" type="text" value="0"> %</span></td> \
				<td class="numeric currency costo real adquisicion">' + currency.symbol + ' <span><input readonly name="item[][subtotal_costo_real]"></span> <button class="ui-icon ui-icon-notice detail cost-real" title="Ver detalle del costo">Ver detalle del costo</button> <span name="item[][closed_compras]" class="ui-icon ui-icon-locked"></span></td> \
				<td class="numeric currency utilidad real adquisicion">' + currency.symbol + ' <span><input readonly name="item[][utilidad_real]"></span></td> \
				<td class="numeric percent margen-desde-venta margen real adquisicion"><span><input readonly name="item[][margen_venta_real]"> %</span></td> \
				<td class="numeric percent margen-desde-compra margen real adquisicion"><span><input readonly name="item[][margen_compra_real]"> %</span></td> \
				<td class="numeric currency adquisicion">' + currency.symbol + ' <span><input readonly name="item[][diferencia]"></span></td> \
				<td class="numeric percent adquisicion"><span><input readonly name="item[][diferencia_ratio]"> %</span></td> \
				<td class="fit aplica-sobrecargo"><input name="item[][aplica_sobrecargo]" type="checkbox" value="true"' + (aplica_sobrecargo_items? ' checked' : '') + '></td> \
				<td class="fit costo-interno"><input name="item[][costo_interno]" type="checkbox" value="true"></td> \
			</tr> \
		');

		htmlObject[functor](element);

		htmlObject.find('[name="item[][horas_extras]"]').parentTo('td').invisible();
		htmlObject.find('button.detail.price').invisible();
		htmlObject.find('button.detail.cost').invisible();

		if (margen_desde_compra)
			htmlObject.find('[name="item[][margen_compra]"]').invisible();
		else
			htmlObject.find('[name="item[][margen_venta]"]').invisible();

		if (typeof selected_currency == 'undefined')
			htmlObject.find('.numeric.currency input').number(true, currency.decimals, ',', '.');
		else
			htmlObject.find('.numeric.currency input').number(true, 2, ',', '.');
		htmlObject.find('.numeric.percent input').number(true, 2, ',', '.');

		htmlObject.draggable({
			helper: 'clone',
			containment: 'tbody',
			start: function(event, ui) {
				dragSource = $(event.target);
				$(event.target).invisible();
				updateSubtotalTitulos($(event.target));
				ui.helper.width($(event.target).width());
				ui.helper.height($(event.target).height());
			},
			stop: function(event, ui) {
				$(event.target).visible();
				updateSubtotalTitulos($(event.target));
			}
		});

		htmlObject.droppable({
			hoverClass: 'ui-state-active',
			accept: 'table.items > tbody > tr:not(.title)',
			drop: function(event, ui) {
				if ($(event.target).prevTo('tr.title').find('.ui-icon-folder-collapsed'))
					$(event.target).prevTo('tr.title').find('.ui-icon-folder-collapsed').triggerHandler('click');
				$(event.target).after(ui.draggable);
				//setTimeout(updateIndexes, 2000);
			}
		});


		htmlObject.find('button.profile.item').tooltipster({
			delay: 0,
			interactiveAutoClose: false
		});

		/* htmlObject.focusin(function() {
			$(this).find('input[name="item[][nombre]"]').autocomplete({
				source: function(request, response) {
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
						},
						error: function(jqXHR, exception) {
							toastr.error('No se pudo cargar el listado de items. Error de conexión al servidor.');
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
					target.find('[name="item[][precio_unitario]"]').val(ui.item.precio);
					target.find('[name="item[][subtotal_precio]"]').val(ui.item.precio);
					target.find('[name="item[][aplica_sobrecargo]"]').prop('checked', ui.item.aplica_sobrecargo);

					if (typeof copiar_precio_a_costo == 'boolean' && !margen_desde_compra) {
						target.find('[name="item[][costo_unitario]"]').data('auto', true);
						if (ui.item.costo == 0) {
							target.find('[name="item[][costo_unitario]"]').val(ui.item.precio);
							target.find('[name="item[][subtotal_costo]"]').val(ui.item.precio);
						} else {
							target.find('[name="item[][costo_unitario]"]').val(ui.item.costo);
							target.find('[name="item[][subtotal_costo]"]').val(ui.item.costo);
						}
					} else {
						htmlObject.find('[name="item[][costo_unitario]"]').val(ui.item.costo);
						htmlObject.find('[name="item[][subtotal_costo]"]').val(ui.item.costo);
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

					if (typeof ui.item.tipo_documento != 'undefined') {
						target.data('tipo-documento', ui.item.tipo_documento.id);
						target.data('tipo-documento-text', ui.item.tipo_documento.text);
						target.data('tipo-documento-ratio', ui.item.tipo_documento.ratio);
						target.data('tipo-documento-inverse', ui.item.tipo_documento.inverse);
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

					if (typeof ui.item.tipo_documento != 'undefined' || typeof ui.item.hora_extra != 'undefined')
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
					$(this).trigger('change');
					updateSubtotalTitulos($(this));
					updateSubtotalItems();
					return false;
				}

			}).data('ui-autocomplete')._renderItem = function(ul, item) {
				return $('<li><a><strong>' + item.index + ' ' + ((item.gasto_fijo)? '[Gasto Fijo]' : '') + ' ' +  ((item.especial)? '[Especial]' : '') + '</strong><em>' +  item.categoria.text + '</em><span class="highlight">' + item.text + '</span>' + ( (item.precio > 0)? '<span>Precio venta: $' + item.precio.toLocaleString() + '</span>' : '' ) + '</a></li>').appendTo(ul);
			};
		});

		htmlObject.focusout(function() {
			if ($(this).find('input[name="item[][nombre"]').hasClass('ui-autocomplete-input'))
				$(this).find('input[name="item[][nombre]"]').autocomplete('destroy');
		});
		*/


		return htmlObject;
	}
};


var updateIndexes = function(callback) {

	return new Promise((resolve, reject) => {
	    
		var index = 0;
		var increment = 10;
		var fields = {};
		var field;
		var parent;

		var data = {
			fk: $('section.sheet').data('id')
		};

		var k = 1;

		$('#tabs-2 section.sheet table > tbody > tr').each(function(key, item) {

			index+= increment;
			$(item).data('index', index);
			field = $(item).find('input[name="item[][nombre]"]');

			if ($(item).hasClass('title')) {
				parent = $(item).data('id');

				fields['item[' + k + '][id]'] = $(item).data('id');
				fields['item[' + k + '][index]'] = $(item).data('index');
				fields['item[' + k + '][categoria]'] = $(item).data('categoria');
				fields['item[' + k + '][nombre]'] = $(item).find('[name="item[][nombre]"]').val();
				fields['item[' + k + '][subtotal_precio]'] = (parseFloat($(item).find('[name="item[][subtotal_precio]"]').val()) * exchange_rate).toString().replace(/\./g, ',');
				fields['item[' + k + '][subtotal_costo]'] = (parseFloat($(item).find('[name="item[][subtotal_costo]"]').val()) * exchange_rate).toString().replace(/\./g, ',');
				fields['item[' + k + '][margen_compra]'] = parseFloat($(item).find('[name="item[][margen_compra]"]').val());
				fields['item[' + k + '][margen_venta]'] = parseFloat($(item).find('[name="item[][margen_venta]"]').val());
			} else {
				fields['item[' + k + '][id]'] = $(item).data('id');
				fields['item[' + k + '][index]'] = $(item).data('index');
				fields['item[' + k + '][categoria]'] = $(item).data('categoria');
				fields['item[' + k + '][producto]'] = $(item).data('producto');
				fields['item[' + k + '][parent]'] = parent;
				fields['item[' + k + '][codigo]'] = $(item).find('[name="item[][codigo]"]').val();
				fields['item[' + k + '][nombre]'] = $(item).find('[name="item[][nombre]"]').val();
				fields['item[' + k + '][cantidad]'] = parseFloat($(item).find('[name="item[][cantidad]"]').val());
				fields['item[' + k + '][factor]'] = parseFloat($(item).find('[name="item[][factor]"]').val());
				fields['item[' + k + '][horas_extras]'] = parseFloat($(item).find('[name="item[][horas_extras]"]').val());
				fields['item[' + k + '][precio_unitario]'] = (parseFloat($(item).find('[name="item[][precio_unitario]"]').val()) * exchange_rate).toString().replace(/\./g, ',');
				fields['item[' + k + '][subtotal_precio]'] = (parseFloat($(item).find('[name="item[][subtotal_precio]"]').val()) * exchange_rate).toString().replace(/\./g, ',');
				fields['item[' + k + '][costo_unitario]'] = (parseFloat($(item).find('[name="item[][costo_unitario]"]').val()) * exchange_rate).toString().replace(/\./g, ',');
				fields['item[' + k + '][subtotal_costo]'] = (parseFloat($(item).find('[name="item[][subtotal_costo]"]').val()) * exchange_rate).toString().replace(/\./g, ',');
				fields['item[' + k + '][margen_compra]'] = parseFloat($(item).find('[name="item[][margen_compra]"]').val());
				fields['item[' + k + '][margen_venta]'] = parseFloat($(item).find('[name="item[][margen_venta]"]').val());
				fields['item[' + k + '][aplica_sobrecargo]'] = $(item).find('[name="item[][aplica_sobrecargo]"]').prop('checked');
				fields['item[' + k + '][costo_interno]'] = $(item).find('[name="item[][costo_interno]"]').prop('checked');
				fields['item[' + k + '][observacion]'] = $(item).data('observacion');
				fields['item[' + k + '][comentario]'] = $(item).data('comentario');
				fields['item[' + k + '][tipo_documento]'] = $(item).data('tipo-documento');


				fields['item[' + k + '][tipo_documento][ratio]'] = $(item).data('tipo-documento-ratio');
				fields['item[' + k + '][tipo_documento][inverse]'] = $(item).data('tipo-documento-inverse');
				fields['item[' + k + '][hora_extra][factor]'] = $(item).data('hora-extra-factor');
				fields['item[' + k + '][hora_extra][jornada]'] = $(item).data('hora-extra-jornada');
				fields['item[' + k + '][precio_unitario][base_imponible]'] = (parseFloat($(item).data('base-imponible')) * exchange_rate).toString().replace(/\./g, ',');

				fields['item[' + k + '][cant_hh_asig]'] = $(item).data('costo-presupuestado-hh-cantidad');
				fields['item[' + k + '][costo_hh_unitario]'] = $(item).data('costo-presupuestado-hh-valor');
				fields['item[' + k + '][responsable_asig]'] = $(item).data('costo-presupuestado-hh-username');

			}

			if ($(item).next().length) {
				if ($(item).next().hasClass('title'))
					updateSubtotalTitulos($(item));
			}


			$.extend(data, data, fields);
			k++;
		});

		$.ajax({
			url: '/4DACTION/_V3_batchItemByCotizacion',
			dataType: 'json',
			data: data,
			type: 'POST',
			cache: false,
			async: (typeof callback == 'undefined'),
			success: function(data) {
				if (data.success) {
					if (typeof callback != 'undefined')
						setTimeout(function() {
							callback();
						}, 1500);
					resolve()
				} else {
					toastr.error(NOTIFY.get('ERROR_RECORD_READONLY_ITEM'));
					unaBase.ui.unblock();
					reject()
				}
			},
			error: function() {
				reject()
				//toastr.error('No se pudo guardar el item');
				// manejar esta situación
			}
		}).fail(function(err, err2, err3) {
			reject()
			console.log(err);
			console.log(err2);
			console.log(err3);
		});
});
};

var checkAjuste = function(reset) {
	var target = $('section.sobrecargos > ul > li[data-ajuste="true"]');

	if (reset) {
		target.find('.percent').val(0).trigger('change');
		target.find('.currency').val(0);
		target.find('.currency').trigger('change');
	}

	target.find('.percent').prop('readonly', true);

	$('input[name="cotizacion[ajuste]"]').parentTo('li').show();

	if (target.find('.utilidad').length)
		$('[name="cotizacion[ajuste][diferencia]"]').addClass('utilidad');
	else
		$('[name="cotizacion[ajuste][diferencia]"]').addClass('costo');
};

var updateAjuste = function() {

	var original_value = parseFloat($('input[name="cotizacion[ajuste]"]').data('original-value'));
	var subtotal_neto = parseFloat($('input[name="cotizacion[montos][subtotal_neto]"]').val());
	var ajuste = parseFloat($('input[name="cotizacion[ajuste]"]').val());

	if (!(original_value == subtotal_neto || subtotal_neto == ajuste)) {
		if (!contentLoaded && parseFloat($('input[name="cotizacion[ajuste]"]').val()) !== totalNeto)
			$('input[name="cotizacion[ajuste]"]').val(totalNeto).triggerHandler('change');

		if (contentLoaded && parseFloat($('input[name="cotizacion[montos][subtotal_neto]"]').val()) != parseFloat($('input[name="cotizacion[ajuste]"]').val())) {
			var scrollTop = $('#tabs-2').scrollTop();
			$('input[name="cotizacion[ajuste]"]').trigger('focus').val($('input[name="cotizacion[ajuste]"]').data('original-value')).trigger('blur');
			$('#tabs-2').scrollTop(scrollTop);
		}
	} else {
		if (!contentReady) {
			contentReady = true;
			if (contentChanged && totalNeto > 0 && fixedTotalCliente) {
				contentChanged = false;
				var scrollTop = $('#tabs-2').scrollTop();
				$('input[name="cotizacion[ajuste]"]').trigger('focus').val(totalNeto).trigger('blur');
				$('#tabs-2').scrollTop(scrollTop);
			}
		}
	}

};

var updateTotalUtilidadCosto = function() {
	// var utilidad_items = parseFloat($('[name="cotizacion[utilidades][subtotal]"]').val());
	var costo_items = parseFloat($('[name="cotizacion[costos][subtotal]"]').val());

	var utilidad_sobrecargos = 0;
	var costo_sobrecargos = 0;

	$('section.sobrecargos li').each(function() {
		var target = $(this).find('[name^="sobrecargo"][name$="[valor]"]');
		if (target.hasClass('utilidad'))
			utilidad_sobrecargos+= parseFloat(target.val());
		else
			costo_sobrecargos+= parseFloat(target.val());
	});

	var descuento = parseFloat($('[name="cotizacion[descuento][valor]"]').val());

	if (typeof selected_currency == 'undefined') {
		var utilidad_total = (utilidad_items + utilidad_sobrecargos - descuento).toFixed(currency.decimals);
		var costo_total = (costo_items + costo_sobrecargos).toFixed(currency.decimals);
	} else {
		var utilidad_total = (utilidad_items + utilidad_sobrecargos - descuento).toFixed(2);
		var costo_total = (costo_items + costo_sobrecargos).toFixed(2);
	}

	$('input[name="cotizacion[montos][utilidad]"]').val(utilidad_total);
	$('input[name="cotizacion[montos][costo]"]').val(costo_total);
	$('span[name="cotizacion[montos][utilidad]"]').text(utilidad_total);
	$('span[name="cotizacion[montos][costo]"]').text(costo_total);
	if (typeof selected_currency == 'undefined') {
		$('span[name="cotizacion[montos][utilidad]"]').number(true, currency.decimals, ',', '.');
		$('span[name="cotizacion[montos][costo]"]').number(true, currency.decimals, ',', '.');
	} else {
		$('span[name="cotizacion[montos][utilidad]"]').number(true, 2, ',', '.');
		$('span[name="cotizacion[montos][costo]"]').number(true, 2, ',', '.');
	}

	var subtotal_neto = parseFloat($('input[name="cotizacion[montos][subtotal_neto]"]').val());

	$('input[name="cotizacion[montos][utilidad_ratio]"]').val(utilidad_total / subtotal_neto * 100);
	$('input[name="cotizacion[montos][costo_ratio]"]').val(costo_total / subtotal_neto * 100);
	if ($('input[name="cotizacion[montos][utilidad_ratio]"]').length > 0)
		$('span[name="cotizacion[montos][utilidad_ratio]"]').text($('input[name="cotizacion[montos][utilidad_ratio]"]').val().replace('.', ','));
	if ($('input[name="cotizacion[montos][costo_ratio]"]').length > 0)
		$('span[name="cotizacion[montos][costo_ratio]"]').text($('input[name="cotizacion[montos][costo_ratio]"]').val().replace('.', ','));

	updateAjuste();
};


var updateTotal = function() {
	var subtotal_neto = parseFloat($('input[name="cotizacion[montos][subtotal_neto]"]').val());
	var porcentaje_impuesto  = parseFloat($('[name="cotizacion[montos][impuesto]"]').data('porcentaje'));
	var valor_impuesto;

	if ($('[name="cotizacion[montos][impuesto][exento]"]').prop('checked'))
		valor_impuesto = 0;
	else
		valor_impuesto = subtotal_neto * porcentaje_impuesto / 100;

	if (typeof selected_currency == 'undefined') {
		$('[name="cotizacion[montos][impuesto]"]').val(Math.abs(valor_impuesto.toFixed(currency.decimals)));

		var total = subtotal_neto + valor_impuesto;

		$('[name="cotizacion[montos][total]"]').val(Math.abs(total.toFixed(currency.decimals)));
	} else {
		$('[name="cotizacion[montos][impuesto]"]').val(Math.abs(valor_impuesto.toFixed(2)));

		var total = subtotal_neto + valor_impuesto;

		$('[name="cotizacion[montos][total]"]').val(Math.abs(total.toFixed(2)));
	}

	updateTotalUtilidadCosto();
};

var updateSubtotalNeto = function() {
	var subtotal_precios = parseFloat($('[name="cotizacion[precios][subtotal]"]').val());
	var subtotal_sobrecargos = parseFloat($('[name="cotizacion[sobrecargos][subtotal]"]').val());
	var descuento = parseFloat($('[name="cotizacion[descuento][valor]"]').val());

	if (typeof selected_currency == 'undefined')
		$('input[name="cotizacion[montos][subtotal_neto]"]').val(Math.abs((subtotal_precios + subtotal_sobrecargos - descuento).toFixed(currency.decimals)));
	else
		$('input[name="cotizacion[montos][subtotal_neto]"]').val(Math.abs((subtotal_precios + subtotal_sobrecargos - descuento).toFixed(2)));

	$('input[name="cotizacion[ajuste]"]').val($('input[name="cotizacion[montos][subtotal_neto]"]').val());
	$('input[name="cotizacion[ajuste][diferencia]"]').val($('section.sobrecargos li[data-ajuste="true"] input[name$="[valor]"]').val());

	if ($('section.sobrecargos li[data-ajuste="true"] input[name$="[valor]"]').val() != 0) {
		$('input[name="cotizacion[montos][subtotal_neto]"]').addClass('ajustado');
		$('button.reset.ajuste').show();
	} else {
		$('input[name="cotizacion[montos][subtotal_neto]"]').removeClass('ajustado');
		$('button.reset.ajuste').hide();
	}

	if (typeof selected_currency == 'undefined') {
		$('span[name="cotizacion[montos][subtotal_neto]"]').text(Math.abs((subtotal_precios + subtotal_sobrecargos - descuento).toFixed(currency.decimals)));
		$('span[name="cotizacion[montos][subtotal_neto]"]').number(true, currency.decimals, ',', '.');
	} else {
		$('span[name="cotizacion[montos][subtotal_neto]"]').text(Math.abs((subtotal_precios + subtotal_sobrecargos - descuento).toFixed(2)));
		$('span[name="cotizacion[montos][subtotal_neto]"]').number(true, 2, ',', '.');
	}

	updateTotal();
};

var updateDescuento = function() {
	var porcentaje_descuento = parseFloat($('[name="cotizacion[descuento][porcentaje]"]').val());
	var subtotal_sobrecargos = parseFloat($('section.sobrecargos > ul > li:last-of-type input[name*="subtotal"]').val());
	if (typeof selected_currency == 'undefined')
		$('[name="cotizacion[descuento][valor]"]').val((porcentaje_descuento * subtotal_sobrecargos / 100).toFixed(currency.decimals));
	else
		$('[name="cotizacion[descuento][valor]"]').val((porcentaje_descuento * subtotal_sobrecargos / 100.00).toFixed(2));
	updateSubtotalNeto();
};

var updateSubtotalSobrecargos = function() {
	var subtotal_sobrecargos = 0;
	$('[name^="sobrecargo"][name$="[valor]"]').each(function() {
		subtotal_sobrecargos+= parseFloat($(this).val());
	});
	$('[name="cotizacion[sobrecargos][subtotal]"]').val(subtotal_sobrecargos);
	updateSubtotalNeto();
};

var updateSobrecargos = function() {

	console.log('Entra a updateSobrecargos');

	var subtotal_precios = parseFloat($('input[name="cotizacion[precios][subtotal]"]').val());
	var aplica_sobrecargo = parseFloat($('input[name="cotizacion[precios][subtotal]"]').data('aplica-sobrecargo'));
	var subtotal_sobrecargo = subtotal_precios;
	var valor_sobrecargo;

	$('section.sobrecargos li').each(function() {
		var subtotal_sobrecargo_anterior, porcentaje;
		$(this).find('[name^="sobrecargo"][name$="[porcentaje]"]').validateNumbers();
		porcentaje = parseFloat($(this).find('[name^="sobrecargo"][name$="[porcentaje]"]').data('value'));

		if ($(this).data('items')) {
			if (typeof selected_currency == 'undefined') {
				if (!scDirectInput)
					valor_sobrecargo = parseFloat((porcentaje * aplica_sobrecargo / 100).toFixed(currency.decimals));
				else
					valor_sobrecargo = parseFloat(($(this).find('[name^="sobrecargo"][name$="[valor]"]').val()));
			} else {
				if (!scDirectInput)
					valor_sobrecargo = parseFloat((porcentaje * aplica_sobrecargo / 100.00).toFixed(2));
				else
					valor_sobrecargo = parseFloat(($(this).find('[name^="sobrecargo"][name$="[valor]"]').val()));
			}
			subtotal_sobrecargo+= (!isNaN(valor_sobrecargo))? valor_sobrecargo : 0;
		} else {
			if ($(this).data('total')) {
				subtotal_sobrecargo_anterior = (!isNaN(subtotal_sobrecargo))? subtotal_sobrecargo : 0;

				if (!$(this).data('ajuste')) {
					var sobrecargos_sobre_total = $('section.sobrecargos li[data-total="true"]:not([data-ajuste="true"])').length;

					if (sobrecargos_sobre_total == 1 || sobrecargos_sobre_total == 0) {
						if (typeof selected_currency == 'undefined') {
							subtotal_sobrecargo = (!isNaN(parseFloat((subtotal_sobrecargo_anterior / (1 - porcentaje / 100)).toFixed(currency.decimals))))? parseFloat((subtotal_sobrecargo_anterior / (1 - porcentaje / 100)).toFixed(0)) : subtotal_sobrecargo_anterior;
							valor_sobrecargo = parseFloat((subtotal_sobrecargo - subtotal_sobrecargo_anterior).toFixed(currency.decimals));
						} else {
							subtotal_sobrecargo = (!isNaN(parseFloat((subtotal_sobrecargo_anterior / (1.00 - porcentaje / 100.00)).toFixed(2))))? parseFloat((subtotal_sobrecargo_anterior / (1.00 - porcentaje / 100.00)).toFixed(2)) : subtotal_sobrecargo_anterior;
							valor_sobrecargo = parseFloat((subtotal_sobrecargo - subtotal_sobrecargo_anterior).toFixed(2));
						}
					}

					if (sobrecargos_sobre_total == 2) {
						var total_neto = parseFloat($('input[name="cotizacion[ajuste]"]').val());
						if (typeof selected_currency == 'undefined') {
							if (!scDirectInput)
								valor_sobrecargo = parseFloat((porcentaje * total_neto / 100).toFixed(currency.decimals));
							else
								valor_sobrecargo = parseFloat(($(this).find('[name^="sobrecargo"][name$="[valor]"]').val()));
						} else {
							if (!scDirectInput)
								valor_sobrecargo = parseFloat((porcentaje * total_neto / 100.00).toFixed(2));
							else
								valor_sobrecargo = parseFloat(($(this).find('[name^="sobrecargo"][name$="[valor]"]').val()));
						}
						subtotal_sobrecargo+= (!isNaN(valor_sobrecargo))? valor_sobrecargo : 0;
					}
				}
			} else {
				if (typeof selected_currency == 'undefined') {
					if (!scDirectInput)
						valor_sobrecargo = parseFloat((porcentaje * subtotal_sobrecargo / 100).toFixed(currency.decimals));
					else
						valor_sobrecargo = parseFloat(($(this).find('[name^="sobrecargo"][name$="[valor]"]').val()));
				} else {
					if (!scDirectInput)
						valor_sobrecargo = parseFloat((porcentaje * subtotal_sobrecargo / 100.00).toFixed(2));
					else
						valor_sobrecargo = parseFloat(($(this).find('[name^="sobrecargo"][name$="[valor]"]').val()));
				}
				subtotal_sobrecargo+= (!isNaN(valor_sobrecargo))? valor_sobrecargo : 0;
			}
		}

		if ($(this).data('ajuste')) {
			if (parseFloat($('input[name="cotizacion[ajuste]"]').data('original-value')) != 0)
				$('input[name="cotizacion[ajuste]"]').data('original-value', $('input[name="cotizacion[ajuste]"]').val())
			else
				$('input[name="cotizacion[ajuste]"]').data('original-value', $('input[name="cotizacion[montos][subtotal_neto]"]').val())

			valor_sobrecargo = parseFloat($(this).find('[name^="sobrecargo"][name$="[valor]"]').val());
			subtotal_sobrecargo+= (!isNaN(valor_sobrecargo))? valor_sobrecargo : 0;

			if (typeof selected_currency == 'undefined')
				$(this).find('[name^="sobrecargo"][name$="[subtotal]"]').val(subtotal_sobrecargo.toFixed(currency.decimals));
			else
				$(this).find('[name^="sobrecargo"][name$="[subtotal]"]').val(subtotal_sobrecargo.toFixed(2));
		} else {
			if (typeof selected_currency == 'undefined') {
				$(this).find('[name^="sobrecargo"][name$="[subtotal]"]').val(subtotal_sobrecargo.toFixed(currency.decimals));
				if (!scDirectInput)
					$(this).find('[name^="sobrecargo"][name$="[valor]"]').val(valor_sobrecargo.toFixed(currency.decimals));
			} else {
				$(this).find('[name^="sobrecargo"][name$="[subtotal]"]').val(subtotal_sobrecargo.toFixed(2));
				if (!scDirectInput)
					$(this).find('[name^="sobrecargo"][name$="[valor]"]').val(valor_sobrecargo.toFixed(2));
			}
		}
	});

	console.log('updateSobrecargos: antes de updateSubtotalSobrecargos');
	updateSubtotalSobrecargos();
	console.log('updateSobrecargos: después de updateSubtotalSobrecargos');


	console.log('Sale de updateSobrecargos');

};

var updateSubtotalItems = function() {

	console.log('Entra a updateSubtotalItems');

	var target = $('table.items > tbody');

	var subtotal_precios = 0;
	var subtotal_costos = 0;
	// var subtotal_utilidades = 0;
	var aplica_sobrecargo = 0;

	target.find('tr').not('.title').each(function() {
		subtotal_precios+= parseFloat($(this).find('[name="item[][subtotal_precio]"]').val());
		subtotal_costos+= parseFloat($(this).find('[name="item[][subtotal_costo]"]').val());
		// subtotal_utilidades+= parseFloat($(this).find('[name="item[][utilidad]"]').val());

		$(this).find('[name="item[][aplica_sobrecargo]"]').each(function() {
			var subtarget;
			if ($(this).prop('checked')) {
				subtarget = $(this).parentTo('tr').find('[name="item[][subtotal_precio]"]');
				aplica_sobrecargo+= parseFloat(subtarget.val());
			}
		});
	});

	$('input[name="cotizacion[precios][subtotal]"]').val(subtotal_precios).data('aplica-sobrecargo', aplica_sobrecargo);
	$('input[name="cotizacion[costos][subtotal]"]').val(subtotal_costos);
	// $('input[name="cotizacion[utilidades][subtotal]"]').val(subtotal_utilidades);

	if (margen_desde_compra_inverso)
		var subtotal_margen_compra = ((1 - subtotal_costos / subtotal_precios) * 100).toFixed(2);
	else
		var subtotal_margen_compra = ((subtotal_precios - subtotal_costos) / subtotal_costos * 100).toFixed(2);

	var subtotal_margen_venta = ((subtotal_precios - subtotal_costos) / subtotal_precios * 100).toFixed(2);

	$('input[name="cotizacion[margenes][margen_venta]"]').val(subtotal_margen_venta);
	$('input[name="cotizacion[margenes][margen_compra]"]').val(subtotal_margen_compra);

	if (!isFinite(subtotal_margen_venta))
		$('input[name="cotizacion[margenes][margen_venta]"]').invisible();
	else
		$('input[name="cotizacion[margenes][margen_venta]"]').visible();

	if (!isFinite(subtotal_margen_compra))
		$('input[name="cotizacion[margenes][margen_compra]"]').invisible();
	else
		$('input[name="cotizacion[margenes][margen_compra]"]').visible();

	console.log('updateSubtotalItems: antes del for');
	// for (var i = 0; i <= 10; i++) {
	for (var i = 0; i <= 24; i++) {
		updateSobrecargos();
	}
	console.log('updateSubtotalItems: después del for');

	console.log('Sale de updateSubtotalItems');

};

var updateSubtotalTitulos = function(element) {

	var target;
	if (element.prop('tagName') == 'TR') {
		if (element.hasClass('title'))
			target = element;
		else
			target = element.prevTo('.title');
	} else
		target = element.parentTo('tr').prevTo('.title');

	var subtotal_precios = 0;
	var subtotal_costos = 0;
	// var subtotal_utilidades = 0;

	var current = target.next();

	do {

		if (current.css('visibility') != 'hidden' && !current.hasClass('ui-draggable-dragging')) {
			subtotal_precios+= parseFloat(current.find('[name="item[][subtotal_precio]"]').val());
			subtotal_costos+= parseFloat(current.find('[name="item[][subtotal_costo]"]').val());
			// subtotal_utilidades+= parseFloat(current.find('[name="item[][utilidad]"]').val());
		}

		current = current.next();

	} while(!current.hasClass('title') && current.length > 0);

	target.find('input[name="item[][subtotal_precio]"]').val(subtotal_precios);
	target.find('input[name="item[][subtotal_costo]"]').val(subtotal_costos);
	// target.find('input[name="item[][utilidad]"]').val(subtotal_utilidades);


	if (margen_desde_compra_inverso)
		var subtotal_margen_compra = ((1 - subtotal_costos / subtotal_precios) * 100).toFixed(2);
	else
		var subtotal_margen_compra = ((subtotal_precios - subtotal_costos) / subtotal_costos * 100).toFixed(2);

	var subtotal_margen_venta = ((subtotal_precios - subtotal_costos) / subtotal_precios * 100).toFixed(2);

	target.find('input[name="item[][margen_venta]"]').val(subtotal_margen_venta);
	target.find('input[name="item[][margen_compra]"]').val(subtotal_margen_compra);

	if (!isFinite(subtotal_margen_venta))
		target.find('input[name="item[][margen_venta]"]').invisible();
	else
		target.find('input[name="item[][margen_venta]"]').visible();

	if (!isFinite(subtotal_margen_compra))
		target.find('input[name="item[][margen_compra]"]').invisible();
	else
		target.find('input[name="item[][margen_compra]"]').visible();


};

var updateRow = function(event) {

	if ($(event.target).prop('type') == 'number')
		$(event.target).validateNumbers();

	if ($(event.target).prop('name') == 'item[][costo_unitario]' && typeof event.originalEvent != 'undefined')
		$(event.target).removeData('auto');

	if (typeof copiar_precio_a_costo == 'boolean' && !margen_desde_compra) {
		var target = $(event.target).parentTo('tr');
		var costo_unitario = target.find('[name="item[][costo_unitario]"]');
		if ($(event.target).prop('name') == 'item[][precio_unitario]') {
			if (costo_unitario.data('auto'))
				costo_unitario.val($(event.target).val());
		}
	}


	var target = $(event.target).parentTo('tr');

	var cantidad = target.find('[name="item[][cantidad]"]').val();
	var factor = target.find('[name="item[][factor]"]').val();
	var precio_unitario = target.find('[name="item[][precio_unitario]"]').val();
	var costo_unitario = target.find('[name="item[][costo_unitario]"]').val();

	var margen_venta, margen_compra, costo_unitario, subtotal_precio, subtotal_costo;

	var hh_cantidad = target.data('costo-presupuestado-hh-cantidad');
	var hh_valor = target.data('costo-presupuestado-hh-valor');
	var costo_presupuestado_interno = hh_cantidad * hh_valor;

	if (margen_desde_compra) {

		if ($(event.target).prop('name') == 'item[][margen_compra]') {
			margen_compra = target.find('[name="item[][margen_compra]"]').val();

			// Corrección para calcular precio de venta desde el costo y el margen
			if (costo_unitario > 0) {

				if (margen_desde_compra_inverso)
					precio_unitario = costo_unitario / (1 - margen_compra / 100);
				else
					precio_unitario = costo_unitario * (1 + margen_compra / 100);

				target.find('[name="item[][precio_unitario]"]').val(precio_unitario);
			} else {
				precio_unitario = target.find('[name="item[][precio_unitario]"]').val();
				target.find('[name="item[][costo_unitario]"]').val(precio_unitario).trigger('blur');
			}

			subtotal_precio = cantidad * factor * precio_unitario;
			subtotal_costo = (target.find('[name="item[][subtotal_costo]"]').hasClass('edited'))? cantidad * factor * costo_unitario + costo_presupuestado_interno : cantidad * factor * costo_unitario;
		} else {
			precio_unitario = target.find('[name="item[][precio_unitario]"]').val();

			subtotal_precio = cantidad * factor * precio_unitario;
			subtotal_costo = (target.find('[name="item[][subtotal_costo]"]').hasClass('edited'))? cantidad * factor * costo_unitario + costo_presupuestado_interno : cantidad * factor * costo_unitario;

			if (margen_desde_compra_inverso)
				margen_compra = ((1 - subtotal_costo / subtotal_precio) * 100).toFixed(2);
			else
				margen_compra = ((subtotal_precio - subtotal_costo) / subtotal_costo * 100).toFixed(2);

			target.find('[name="item[][margen_compra]"]').val(margen_compra);

			if (!isFinite(margen_compra))
				target.find('[name="item[][margen_compra]"]').invisible();
			else
				target.find('[name="item[][margen_compra]"]').visible();

		}

		// Evitar que el valor de margen se vaya a infinito
		if (costo_unitario == 0)
			target.find('[name="item[][margen_compra]"]').invisible();
		else
			target.find('[name="item[][margen_compra]"]').visible();

		// Copia el costo al precio de venta
		if (precio_unitario == 0 && costo_unitario != 0)
			target.find('[name="item[][precio_unitario]"]').val(costo_unitario).trigger('blur');

		var margen_venta = ((subtotal_precio - subtotal_costo) / subtotal_precio * 100).toFixed(2);

		target.find('[name="item[][margen_venta]"]').val(margen_venta);

		if (!isFinite(margen_venta))
			target.find('[name="item[][margen_venta]"]').invisible();
		else
			target.find('[name="item[][margen_venta]"]').visible();

	} else {

		if ($(event.target).prop('name') == 'item[][margen_venta]') {
			margen_venta = target.find('[name="item[][margen_venta]"]').val();

			// Corrección para calcular precio de venta desde el costo y el margen
			if (precio_unitario > 0) {
				costo_unitario = (1 - margen_venta / 100) * precio_unitario;
				target.find('[name="item[][costo_unitario]"]').val(costo_unitario);
			} else {
				costo_unitario = target.find('[name="item[][costo_unitario]"]').val();
				precio_unitario = costo_unitario / (1 - margen_venta / 100);
				target.find('[name="item[][precio_unitario]"]').val(precio_unitario);
			}

			subtotal_precio = cantidad * factor * precio_unitario;
			subtotal_costo = (target.find('[name="item[][subtotal_costo]"]').hasClass('edited'))? cantidad * factor * costo_unitario + costo_presupuestado_interno : cantidad * factor * costo_unitario;
		} else {
			costo_unitario = target.find('[name="item[][costo_unitario]"]').val();

			subtotal_precio = cantidad * factor * precio_unitario;
			subtotal_costo = (target.find('[name="item[][subtotal_costo]"]').hasClass('edited'))? cantidad * factor * costo_unitario + costo_presupuestado_interno : cantidad * factor * costo_unitario;

			margen_venta = ((subtotal_precio - subtotal_costo) / subtotal_precio * 100).toFixed(2);

			target.find('[name="item[][margen_venta]"]').val(margen_venta);

			if (!isFinite(margen_venta))
				target.find('[name="item[][margen_venta]"]').invisible();
			else
				target.find('[name="item[][margen_venta]"]').visible();
		}

		if (margen_desde_compra_inverso)
			var margen_compra = ((1 - subtotal_costo / subtotal_precio) * 100).toFixed(2);
		else
			var margen_compra = ((subtotal_precio - subtotal_costo) / subtotal_costo * 100).toFixed(2);

		target.find('[name="item[][margen_compra]"]').val(margen_compra);

		if (!isFinite(margen_compra))
			target.find('[name="item[][margen_compra]"]').invisible();
		else
			target.find('[name="item[][margen_compra]"]').visible();

	}

	target.find('[name="item[][subtotal_precio]"]').val(subtotal_precio);
	target.find('[name="item[][subtotal_costo]"]').val(subtotal_costo);
	target.find('[name="item[][utilidad]"]').val(subtotal_precio - subtotal_costo);

	if (target.data('first-load') !== true && target.data('no-update') === undefined) {
		updateSubtotalTitulos($(event.target));
		updateSubtotalItems();
	}


};


var getDetail = function(callback) {
	$.ajax({
		url: '/4DACTION/_V3_getItemByCotizacion',
		dataType: 'json',
		data: {
			id: $('section.sheet').data('id')
		},
		cache: false,
		beforeSend: function() {
			unaBase.ui.block();
		},
		complete: function() {

		},
		success: function(data) {
			var current;

			current = $('<tbody>');

			var tituloAnterior;
			var hidden_items = false;
			for (var i = 0; i < data.rows.length; i++) {
				var item = data.rows[i];

				var htmlObject, margen_compra, margen_venta;
				if (item.titulo) {
					if (typeof tituloAnterior != 'undefined')
						updateSubtotalTitulos(tituloAnterior);
					htmlObject = getElement.titulo('appendTo', current);
					// Oculta título
					if (item.hidden)
						htmlObject.hide();
					tituloAnterior = htmlObject;
					if (typeof item.categoria != 'undefined')
						htmlObject.data('categoria', item.categoria.id);
				} else {

					htmlObject = getElement.item('appendTo', current);

					// Oculta ítem
					if (item.hidden) {
						hidden_items = true;
						htmlObject.hide();
					}

					if (typeof item.producto != 'undefined')
						htmlObject.data('producto', item.producto.id);

					htmlObject.data('first-load', true);

					htmlObject.find('[name="item[][codigo]"]').val(item.codigo);
					htmlObject.find('[name="item[][cantidad]"]').val(item.cantidad);
					htmlObject.find('[name="item[][factor]"]').val(item.factor);
					htmlObject.find('[name="item[][precio_unitario]"]').val(item.precio.unitario / exchange_rate).data('old-value', item.precio.unitario / exchange_rate);

					htmlObject.find('[name="item[][costo_unitario]"]').val(item.costo.presupuestado.unitario / exchange_rate);

					htmlObject.find('[name="item[][aplica_sobrecargo]"]').prop('checked', item.aplica_sobrecargo);

					htmlObject.find('[name="item[][costo_interno]"]').prop('checked', item.costo.interno / exchange_rate);

					htmlObject.data('observacion', item.observacion);
					htmlObject.data('comentario', item.comentario);

					if (!item.deletable)
						htmlObject.find('button.remove.item').invisible();

					htmlObject.data('hora-extra-enabled', item.hora_extra.enabled);
					htmlObject.data('hora-extra-factor', item.hora_extra.factor);
					htmlObject.data('hora-extra-jornada', item.hora_extra.jornada);
					htmlObject.data('base-imponible', item.hora_extra.base_imponible / exchange_rate);
					htmlObject.data('hora-extra-dias', item.hora_extra.dias);

					// Fix: para evitar que quede en blanco el tipo de documento
					htmlObject.data('tipo-documento', 30);
					htmlObject.find('input[name="item[][tipo_documento]"]').val('F');
					if (typeof item.tipo_documento != 'undefined' && item.tipo_documento.id != 30) {
						htmlObject.data('tipo-documento', item.tipo_documento.id);
						htmlObject.find('input[name="item[][tipo_documento]"]').val(item.tipo_documento.abbr);
						htmlObject.data('tipo-documento-text', item.tipo_documento.text);
						htmlObject.data('tipo-documento-ratio', item.tipo_documento.ratio);
						htmlObject.data('tipo-documento-inverse', item.tipo_documento.inverse);
						if (item.tipo_documento.ratio != 0) {
							htmlObject.find('[name="item[][precio_unitario]"]').addClass('edited');
							htmlObject.find('button.detail.price').visible();
						} else {
							htmlObject.find('[name="item[][precio_unitario]"]').removeClass('edited');
							htmlObject.find('button.detail.price').invisible();
						}
					} else {
						htmlObject.removeData('tipo-documento');
						htmlObject.removeData('tipo-documento-text');
						htmlObject.removeData('tipo-documento-ratio');
						htmlObject.removeData('tipo-documento-inverse');
						htmlObject.find('[name="item[][precio_unitario]"]').removeClass('edited');
						htmlObject.find('button.detail.price').invisible();
					}

					if (item.hora_extra.enabled) {
						htmlObject.find('[name="item[][horas_extras]"]').val(item.hora_extra.cantidad).parentTo('td').visible();
						if (item.hora_extra.cantidad > 0)
							htmlObject.find('[name="item[][precio_unitario]"]').addClass('special');
					} else
						htmlObject.find('[name="item[][horas_extras]"]').val(0).parentTo('td').invisible();

					htmlObject.data('costo-presupuestado-hh-cantidad', item.costo.presupuestado.hh.cantidad);
					htmlObject.data('costo-presupuestado-hh-valor', item.costo.presupuestado.hh.valor / exchange_rate);
					htmlObject.data('costo-presupuestado-hh-username', item.costo.presupuestado.hh.username);

					if (item.costo.presupuestado.hh.cantidad > 0 && item.costo.presupuestado.hh.valor > 0 && item.costo.interno) {
						htmlObject.find('[name="item[][subtotal_costo]"]').addClass('edited').trigger('refresh');
						htmlObject.find('button.detail.cost').visible();
					}

					if (typeof htmlObject.data('hora-extra-valor') == 'undefined')
						htmlObject.find('input[name="item[][horas_extras]"]').trigger('change');

					if (typeof copiar_precio_a_costo == 'boolean' && typeof fromTemplate != 'undefined')
						htmlObject.find('[name="item[][costo_unitario]"]').data('auto', true);


					// Datos de gasto real

					htmlObject.find('[name="item[][subtotal_costo_real]"]').val(item.costo.real.subtotal);
					htmlObject.find('[name="item[][utilidad_real]"]').val(item.precio.subtotal - item.costo.real.subtotal);

					if (!item.titulo) {
						htmlObject.data('costo-real-hh-cantidad', item.costo.real.hh.cantidad);
						htmlObject.data('costo-real-hh-total', item.costo.real.hh.total);

						if (item.costo.real.hh.total > 0 && item.costo.interno) {

							var old_costo_real = parseFloat(htmlObject.find('[name="item[][subtotal_costo_real]"]').val());
							if (isNaN(old_costo_real))
								old_costo_real = 0;

							var new_costo_real = old_costo_real + item.costo.real.hh.total;

							htmlObject.find('[name="item[][subtotal_costo_real]"]').val(new_costo_real);

							htmlObject.find('[name="item[][subtotal_costo_real]"]').addClass('edited').trigger('refresh');
							htmlObject.find('button.detail.cost-real').visible();
						} else {
							htmlObject.find('[name="item[][subtotal_costo_real]"]').removeClass('edited');
							htmlObject.find('button.detail.cost-real').invisible();
						}

						if (item.costo.real.hh.total == 0 && item.costo.presupuestado.hh.cantidad * item.costo.presupuestado.hh.valor == 0)
							htmlObject.find('input[name="item[][costo_interno]"]').invisible();
					}

					var margen_compra_real = ((item.precio.subtotal - item.costo.real.subtotal) / item.costo.real.subtotal * 100).toFixed(2);
					var margen_venta_real = ((item.precio.subtotal - item.costo.real.subtotal) / item.precio.subtotal * 100).toFixed(2);

					var diferencia_ratio = ((item.costo.presupuestado.subtotal - item.costo.real.subtotal) / item.costo.presupuestado.subtotal * 100).toFixed(2);

					htmlObject.find('[name="item[][margen_venta_real]"]').val((isFinite(margen_venta_real))? margen_venta_real : 0);
					htmlObject.find('[name="item[][margen_compra_real]"]').val((isFinite(margen_compra_real))? margen_compra_real : 0);
					
					htmlObject.find('[name="item[][diferencia]"]').val(item.costo.presupuestado.subtotal - item.costo.real.subtotal);
					htmlObject.find('[name="item[][diferencia_ratio]"]').val(diferencia_ratio);
				}

				htmlObject.find('[name="item[][subtotal_precio]"]').val(item.precio.subtotal / exchange_rate);
				htmlObject.find('[name="item[][subtotal_costo]"]').val(item.costo.presupuestado.subtotal / exchange_rate);
				htmlObject.find('[name="item[][utilidad]"]').val((item.precio.subtotal - item.costo.presupuestado.subtotal) / exchange_rate);

				if (margen_desde_compra_inverso)
					margen_compra = ((1 - item.costo.presupuestado.subtotal / item.precio.subtotal) * 100).toFixed(2);
				else
					margen_compra = ((item.precio.subtotal - item.costo.presupuestado.subtotal) / item.costo.presupuestado.subtotal * 100).toFixed(2);

				margen_venta = ((item.precio.subtotal - item.costo.presupuestado.subtotal) / item.precio.subtotal * 100).toFixed(2);

				htmlObject.find('[name="item[][margen_venta]"]').val(margen_venta);
				htmlObject.find('[name="item[][margen_compra]"]').val(margen_compra);

				if (!isFinite(margen_venta))
					htmlObject.find('[name="item[][margen_venta]"]').invisible();
				else
					htmlObject.find('[name="item[][margen_venta]"]').visible();

				if (!isFinite(margen_compra))
					htmlObject.find('[name="item[][margen_compra]"]').invisible();
				else
					htmlObject.find('[name="item[][margen_compra]"]').visible();

				htmlObject.data('id', item.id);
				htmlObject.data('index', item.index);
				htmlObject.find('input[name="item[][nombre]"]').val(item.nombre);
				htmlObject.find('input[name="item[][nombre]"]').data('nombre-original', item.text);

				htmlObject.find('button.profile.item').tooltipster('update', item.text);

				if (item.text != item.nombre)
					htmlObject.find('[name="item[][nombre]"]').addClass('edited');
				else
					htmlObject.find('[name="item[][nombre]"]').removeClass('edited');

			}

			if (hidden_items)
				$('table.items > tfoot').invisible();

			if (typeof tituloAnterior != 'undefined') {
				updateSubtotalTitulos(tituloAnterior);
				tituloAnterior = undefined;
			}


			var items = $('section.sheet table.items > tbody > tr:not(.title)').length;
			$('section.sheet table.items > tfoot > tr .info:eq(0)').html(items + ' ítem' + ((items > 1)? 's' : ''));

			updateSubtotalItems();

			current.find('> *').each(function() {
				$(this).appendTo($('table.items tbody'));
			});
			unaBase.ui.unblock();

			if ($('section.sheet').data('index'))
				$('section.sheet table > thead button.toggle.all').triggerHandler('click');
			if (typeof callback != 'undefined')
				callback();


			$('section.sheet table.items > tbody > tr').each(function() {
				$(this).data('first-load', false);
			});

			$('section.sheet table.items > tfoot > tr > th.info').trigger('refresh');

		},
		error: function() {
			toastr.error('No se pudieron mostrar los items de la cotización');
			// manejar esta situación
		}
	});

};

var afterEditEmpresa = function(element) {
	var target = $(element).parentTo('ul');

	target.find('input[name="cotizacion[empresa][id]"]')
		.attr('type', 'search')
		.autocomplete('enable');
	target.find('input[name="cotizacion[empresa][id]"]').attr('placeholder', 'Buscar por alias, RUT, razón social...');

	target.find('input[name="cotizacion[empresa][razon_social]"]').attr('readonly', true);

	target.find('input[name="cotizacion[empresa][id]"]').focus();
	target.find('button.empresa.edit').hide();

	if ($('input[name="cotizacion[empresa][id]"]').val() != '' || $('input[name="cotizacion[empresa][razon_social]"]').val() != '')
		target.find('button.empresa.unlock, button.empresa.profile').show();
};

var afterEditContacto = function(element) {
	var target = $(element).parentTo('ul');
	target.find('input[name="cotizacion[empresa][contacto][id]"]')
		.attr('type', 'search')
		.autocomplete('enable');
	target.find('input[name="cotizacion[empresa][contacto][id]"]').attr('placeholder', 'Buscar por Nombre y/o Apellidos');
	target.find('input[name="cotizacion[empresa][contacto][cargo]"], input[name="cotizacion[empresa][contacto][email]"]')
		.attr('readonly', true);
	target.find('input[name="empresa[contacto][id]"]').focus();
	target.find('button.contacto.edit').hide();

	/*if (
		$('input[name="cotizacion[empresa][contacto][id]"').val() != ''
	)*/ // revisar
		target.find('button.unlock.contacto, button.show.contacto, button.profile.contacto').show();
};

var saveRow = function(event, callback) {
	var target = $(event.target).parentTo('tr');
	var parent = target.prevTo('.title').data('id');
	var tuple = {
		'item[][id]': target.data('id'),
		'item[][index]': target.data('index'),
		'item[][categoria]': target.data('categoria'),
		'item[][producto]': target.data('producto'),
		'item[][parent]': parent,
		'item[][codigo]': target.find('[name="item[][codigo]"]').val(),
		'item[][nombre]': target.find('[name="item[][nombre]"]').val(),
		'item[][cantidad]': parseFloat(target.find('[name="item[][cantidad]"]').val()),
		'item[][factor]': parseFloat(target.find('[name="item[][factor]"]').val()),
		'item[][horas_extras]': parseFloat(target.find('[name="item[][horas_extras]"]').val()),
		'item[][precio_unitario]': parseFloat(target.find('[name="item[][precio_unitario]"]').val()),
		'item[][subtotal_precio]': parseFloat(target.find('[name="item[][subtotal_precio]"]').val()),
		'item[][costo_unitario]': parseFloat(target.find('[name="item[][costo_unitario]"]').val()),
		'item[][subtotal_costo]': parseFloat(target.find('[name="item[][subtotal_costo]"]').val()),
		'item[][utilidad]': parseFloat(target.find('[name="item[][utilidad]"]').val()),
		'item[][margen_compra]': parseFloat(target.find('[name="item[][margen_compra]"]').val()),
		'item[][margen_venta]': parseFloat(target.find('[name="item[][margen_venta]"]').val()),
		'item[][aplica_sobrecargo]': target.find('[name="item[][aplica_sobrecargo]"]').prop('checked'),
		'item[][costo_interno]': target.find('[name="item[][costo_interno]"]').prop('checked'),
		'item[][observacion]': target.data('observacion'),
		'item[][comentario]': target.data('comentario'),
		'item[][tipo_documento]': target.data('tipo-documento'),
		'item[][tipo_documento][ratio]': target.data('tipo-documento-ratio'),
		'item[][tipo_documento][inverse]': target.data('tipo-documento-inverse'),
		'item[][hora_extra][factor]': target.data('hora-extra-factor'),
		'item[][hora_extra][jornada]': target.data('hora-extra-jornada'),
		'item[][hora_extra][dias]': target.data('hora-extra-dias'),
		'item[][precio_unitario][base_imponible]': target.data('base-imponible'),
		'item[][cant_hh_asig]': target.data('costo-presupuestado-hh-cantidad'),
		'item[][costo_hh_unitario]': target.data('costo-presupuestado-hh-valor'),
		'item[][responsable_asig]': target.data('costo-presupuestado-hh-username')
	};

	var fields = {
		id: target.data('id'),
		index: target.data('index'),
		fk: target.parentTo('section.sheet').data('id'),
		producto: target.data('producto'),
		categoria: target.data('categoria'),
		parent: parent
	};

	$.extend(fields, fields, tuple);

	var element = event.target;

	$.ajax({
		url: '/4DACTION/_V3_setItemByCotizacion',
		dataType: 'json',
		data: fields,
		async: false,
		cache: false,
		success: function(data) {
			target.data('id', data.id);
			target.data('index', data.index);

			var has_change =
			(
				$(element).parentTo('tr').find('[name="item[][nombre]"]').val() != $(element).parentTo('tr').find('[name="item[][nombre]"]').data('nombre-original')
			) && (
				$(element).parentTo('tr').find('[name="item[][nombre]"]').data('nombre-original') != ''
			);

			if (has_change) {

				if (!$(element).parentTo('tr').hasClass('title')) {
					if (!$(element).parentTo('tr').data('producto')) {
						$(element).parentTo('tr').find('[name="item[][nombre]"]').removeClass('edited').data('nombre-original', null);
						$(element).parentTo('tr').find('input').val('');
						$(element).parentTo('tr').find('input[name="item[][cantidad]"]').val(1);
						$(element).parentTo('tr').find('input[name="item[][factor]"]').val(1);
						$(element).parentTo('tr').find('input[name="item[][horas_extras]"]').val(0);
					} else {
						$(element).parentTo('tr').find('[name="item[][nombre]"]').addClass('edited');
					}
				}

			} else
				$(element).parentTo('tr').find('[name="item[][nombre]"]').removeClass('edited');

			if (typeof callback != 'undefined')
				callback(data.id);
		},
		error: function() {
			toastr.error('No se pudo guardar el item');
			$(element).val($(element).data('old-value'));
		}
	});
};

var addAllItems = function(title) {
	confirm('¿Desea cargar todos los ítems de la categoría a la misma?').done(function(data) {
		if (data) {
			unaBase.ui.block();
			$.ajax({
				url: '/4DACTION/_V3_getProductoByCategoria',
				data: {
					id: title.data('categoria'),
					strict: true
				},
				dataType: 'json',
				success: function(data) {
					if (data.rows.length > 0) {
						for (var i = data.rows.length - 1; i >= 0; i--) {
							var item = data.rows[i];

							var htmlObject = getElement.item('insertAfter', title);

							htmlObject.data('producto', item.id);
							htmlObject.find('[name="item[][codigo]"]').val(item.index);
							htmlObject.find('[name="item[][horas_extras]"]').val(0);
							htmlObject.find('[name="item[][precio_unitario]"]').val(item.precio).data('old-value', item.precio);
							htmlObject.find('[name="item[][subtotal_precio]"]').val(item.precio);
							htmlObject.find('[name="item[][aplica_sobrecargo]"]').prop('checked', item.aplica_sobrecargo);

							if (typeof copiar_precio_a_costo == 'boolean') {
								htmlObject.find('[name="item[][costo_unitario]"]').data('auto', true);
								if (item.costo == 0) {
									htmlObject.find('[name="item[][costo_unitario]"]').val(item.precio);
									htmlObject.find('[name="item[][subtotal_costo]"]').val(item.precio);
								} else {
									htmlObject.find('[name="item[][costo_unitario]"]').val(item.costo);
									htmlObject.find('[name="item[][subtotal_costo]"]').val(item.costo);
								}
							} else {
								htmlObject.find('[name="item[][costo_unitario]"]').val(item.costo);
								htmlObject.find('[name="item[][subtotal_costo]"]').val(item.costo);
							}

							htmlObject.find('[name="item[][nombre]"]').data('nombre-original', item.text);
							htmlObject.find('[name="item[][nombre]"]').val(item.text);

							htmlObject.find('button.profile.item').tooltipster('update', item.text);


							var subtotal_precio = item.precio;
							var subtotal_costo = item.costo;

							if (margen_desde_compra_inverso)
								var margen_compra = ((1 - subtotal_costo / subtotal_precio) * 100).toFixed(2);
							else
								var margen_compra = ((subtotal_precio - subtotal_costo) / subtotal_costo * 100).toFixed(2);

							var margen_venta = ((subtotal_precio - subtotal_costo) / subtotal_precio * 100).toFixed(2);

							htmlObject.find('[name="item[][margen_venta]"]').val(margen_venta);
							htmlObject.find('[name="item[][margen_compra]"]').val(margen_compra);

							if (!isFinite(margen_venta))
								htmlObject.find('[name="item[][margen_venta]"]').invisible();
							else
								htmlObject.find('[name="item[][margen_venta]"]').visible();

							if (!isFinite(margen_compra))
								htmlObject.find('[name="item[][margen_compra]"]').invisible();
							else
								htmlObject.find('[name="item[][margen_compra]"]').visible();

							htmlObject.find('[name="item[][utilidad]"]').val(subtotal_precio - subtotal_costo);

							htmlObject.find('span.unit').html(item.unidad);

							// Fix: para evitar que quede en blanco el tipo de documento
							htmlObject.data('tipo-documento', 30);
							htmlObject.find('input[name="item[][tipo_documento]"]').val('F');
							if (typeof item.tipo_documento != 'undefined' && item.tipo_documento.id != 30) {
								htmlObject.data('tipo-documento', item.tipo_documento.id);
								htmlObject.data('tipo-documento-text', item.tipo_documento.text);
								htmlObject.data('tipo-documento-ratio', item.tipo_documento.ratio);
								htmlObject.data('tipo-documento-inverse', item.tipo_documento.inverse);
								if (item.tipo_documento.ratio != 0) {
									htmlObject.find('[name="item[][precio_unitario]"]').addClass('edited');
									htmlObject.find('button.detail.price').visible();
								}
							} else {
								htmlObject.removeData('tipo-documento');
								htmlObject.removeData('tipo-documento-text');
								htmlObject.removeData('tipo-documento-ratio');
								htmlObject.removeData('tipo-documento-inverse');
								htmlObject.find('[name="item[][precio_unitario]"]').removeClass('edited');
								htmlObject.find('button.detail.price').invisible();
							}

							if (typeof item.hora_extra != 'undefined') {
								htmlObject.data('hora-extra-factor', item.hora_extra.factor);
								htmlObject.data('hora-extra-jornada', item.hora_extra.jornada);
								htmlObject.find('[name="item[][horas_extras]"]').parentTo('td').visible();
								htmlObject.data('hora-extra-dias', item.hora_extra.dias);
							} else {
								htmlObject.removeData('hora-extra-factor');
								htmlObject.removeData('hora-extra-jornada');
								htmlObject.find('[name="item[][horas_extras]"]').parentTo('td').invisible();
							}

							if ((typeof item.tipo_documento != 'undefined' && item.tipo_documento.id != 30) || typeof item.hora_extra != 'undefined')
								htmlObject.find('button.detail.price').visible();

							var source = htmlObject.find('[name="item[][nombre]"]');
						}

						title.nextUntil('.title').each(function() {
							$.proxy(saveRow, this, this);
						});

						updateSubtotalTitulos(source);

						updateSubtotalItems();
						updateIndexes();

						if (title.find('button.toggle.categoria').hasClass('ui-icon-folder-collapsed'))
							title.find('button.toggle.categoria').triggerHandler('click');

					} else
						toastr.warning('La categoría seleccionada no tiene ítems asociados');

					unaBase.ui.unblock();
				},
				fail: function(a,b,c) {
					toastr.info(a + b + c);
				}
			});
		}
	});
};
