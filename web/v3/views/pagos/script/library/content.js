var getElement = {
	titulo: function(functor, element) {
		var htmlObject = $(' \
			<tr class="title" data-categoria="0"> \
				<th><span class="ui-icon ui-icon-arrow-4" title="Arrastrar para mover" style="cursor: move;"></span><button class="ui-icon ui-icon-minus remove categoria" title="Quitar categoría"></button></th> \
				<th><button class="ui-icon ui-icon-folder-open toggle categoria" title="Contraer o expandir título"></button><button class="ui-icon ui-icon-tag add categoria" title="Agregar categoría debajo" data-help="Haga clic en este botón para añadir un ítem a la categoría creada"></button> <button class="ui-icon ui-icon-circle-plus add item" title="Agregar ítem"></button></th> \
				<th><input name="item[][nombre]" type="search" value="" placeholder="Buscar categoría por nombre..."><button class="ui-icon ui-icon-plus add all-items"><!-- <button class="show categoria">Ver categorías</button> --><button class="ui-icon ui-icon-gear profile categoria" title="Perfil">Perfil</button></th> \
				<th class="info"></th> \
				<th class="segunda-cantidad"></th> \
				<th class="horas-extras numeric qty abs"><input name="item[][horas_extras]" type="number" min="0" max="9999" value=""></th> \
				<th></th> \
				<th class="numeric currency venta">' + currency.symbol + ' <span><input readonly name="item[][subtotal_precio]" type="text" value="0"></span></th> \
				<th class="costo"></th> \
				<th class="numeric currency costo">' + currency.symbol + ' <span><input readonly name="item[][subtotal_costo]" type="text" value="0"></span></th> \
				<th class="numeric currency utilidad">' + currency.symbol + ' <span><input readonly name="item[][utilidad]" type="text" value="0"></span></th> \
				<th class="numeric percent margen-desde-venta margen"><span><input readonly name="item[][margen_venta]" type="text" value="0"> %</span></th> \
				<th class="numeric percent margen-desde-compra margen"><span><input readonly name="item[][margen_compra]" type="text" value="0"> %</span></th> \
				<th></th> \
			</tr> \
		');

		htmlObject[functor](element);

		htmlObject.find('.numeric.currency input').number(true, currency.decimals, ',', '.');
		htmlObject.find('.numeric.percent input').number(true, 2, ',', '.');

		htmlObject.find('button.toggle.categoria').click(function() {
			var target = $(this);

			var collapsed = target.hasClass('ui-icon-folder-collapsed');

			if (collapsed)
				target.removeClass('ui-icon-folder-collapsed').addClass('ui-icon-folder-open');
			else
				target.removeClass('ui-icon-folder-open').addClass('ui-icon-folder-collapsed');

			var titles = target.parentTo('tr').nextUntil('.title');

			if (collapsed) {
				titles.removeClass('collapsed');
				target.parentTo('tr').find('.info').html('');

			} else {
				titles.addClass('collapsed');
				target.parentTo('tr').find('.info').html(titles.length + ' ítem' + ((titles.length > 1)? 's' : ''));
			}
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
		});

		return htmlObject;
	},
	item: function(functor, element) {
		var htmlObject = $(' \
			<tr data-producto="0"> \
				<td><span class="ui-icon ui-icon-arrow-4" title="Arrastrar para mover" style="cursor: move;"></span><button class="ui-icon ui-icon-minus remove item" title="Quitar ítem"></button></td> \
				<td class="numeric code"><input name="item[][codigo]" type="text" readonly></td> \
				<td><input name="item[][nombre]" type="search" placeholder="Buscar producto o servicio por código o por nombre..."><button class="ui-icon ui-icon-carat-1-s show item">Ver ítems</button><button class="ui-icon ui-icon-document detail item" title="Detalle">Detalle</button><button class="ui-icon ui-icon-gear profile item" title="Perfil"></button></td> \
				<td class="numeric qty"><input name="item[][cantidad]" type="number" value="1" min="1" max="9999"> <span class="unit"></span></td> \
				<td class="segunda-cantidad numeric qty abs"><input name="item[][factor]" type="number" value="1" min="1" max="9999"></td> \
				<td class="horas-extras numeric qty abs"><input name="item[][horas_extras]" type="number" value="0" min="0" max="9999"></td> \
				<td class="numeric currency extended">' + currency.symbol + ' <span><input name="item[][precio_unitario]" type="text" value="0"></span> <button class="ui-icon ui-icon-notice detail price" title="Ver detalle del precio">Ver detalle del precio</button></td> \
				<td class="numeric currency venta">' + currency.symbol + ' <span><input readonly name="item[][subtotal_precio]" type="text" value="0"></span></td> \
				<td class="numeric currency costo">' + currency.symbol + ' <span><input name="item[][costo_unitario]" type="text" text="0" max="9999999999" value="0"></span></td> \
				<td class="numeric currency costo">' + currency.symbol + ' <span><input readonly name="item[][subtotal_costo]" type="text" value="0"></span></td> \
				<td class="numeric currency utilidad">' + currency.symbol + ' <span><input readonly name="item[][utilidad]" type="text" value="0"></span></td> \
				<td class="numeric percent margen-desde-venta margen"><span><input name="item[][margen_venta]" type="text" value="0"> %</span></td> \
				<td class="numeric percent margen-desde-compra margen"><span><input readonly name="item[][margen_compra]" type="text" value="0"> %</span></td> \
				<td class="fit aplica-sobrecargo"><input name="item[][aplica_sobrecargo]" type="checkbox" value="true"></td> \
			</tr> \
		');

		htmlObject[functor](element);

		htmlObject.find('[name="item[][horas_extras]"]').parentTo('td').invisible();
		htmlObject.find('button.detail.price').invisible();

		htmlObject.find('.numeric.currency input').number(true, currency.decimals, ',', '.');
		htmlObject.find('.numeric.percent input').number(true, 2, ',', '.');

		if (typeof copiar_precio_a_costo == 'boolean')
			htmlObject.find('[name="item[][costo_unitario]"]').data('auto', true);

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

		htmlObject.focusin(function() {
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
					target.find('[name="item[][precio_unitario]"]').val(ui.item.precio);
					target.find('[name="item[][subtotal_precio]"]').val(ui.item.precio);
					target.find('[name="item[][aplica_sobrecargo]"]').prop('checked', ui.item.aplica_sobrecargo);

					if (typeof copiar_precio_a_costo == 'boolean') {
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


					var subtotal_precio = ui.item.precio;
					var subtotal_costo = ui.item.costo;

					var margen_compra = ((subtotal_precio - subtotal_costo) / subtotal_costo * 100).toFixed(2);
					var margen_venta = ((subtotal_precio - subtotal_costo) / subtotal_precio * 100).toFixed(2);


					target.find('[name="item[][margen_venta]"]').val((isFinite(margen_venta))? margen_venta : 0);
					target.find('[name="item[][margen_compra]"]').val((isFinite(margen_compra))? margen_compra : 0);

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
						target.find('button.detail.price').visible();
					}

					// Factor hora extra y jornada
					if (typeof ui.item.hora_extra != 'undefined') {
						target.data('hora-extra-factor', ui.item.hora_extra.factor);
						target.data('hora-extra-jornada', ui.item.hora_extra.jornada);
						target.find('[name="item[][horas_extras]"]').parentTo('td').visible();
					} else {
						target.removeData('hora-extra-factor');
						target.removeData('hora-extra-jornada');
						target.find('[name="item[][horas_extras]"]').parentTo('td').invisible();
					}

					target.find('span.unit').html(ui.item.unidad);
					$(this).trigger('change');
					updateSubtotalTitulos($(this));
					updateSubtotalItems();
					return false;
				}

			}).data('ui-autocomplete')._renderItem = function(ul, item) {
				return $('<li><a><strong>' + item.index + ' ' + ((item.gasto_fijo)? '[Gasto Fijo]' : '') + ' ' +  ((item.especial)? '[Especial]' : '') + '</strong><em>' +  item.categoria.text + '</em><span class="highlight">' + item.text + '</span></a></li>').appendTo(ul);
			};
		});

		htmlObject.focusout(function() {
			if ($(this).find('input[name="item[][nombre"]').hasClass('ui-autocomplete-input'))
				$(this).find('input[name="item[][nombre]"]').autocomplete('destroy');
		});


		return htmlObject;
	}
};


var updateIndexes = function(callback) {
	var index = 0;
	var increment = 10;
	var fields = {};
	var field;
	var parent;

	var data = {
		fk: $('section.sheet').data('id')
	};

	var k = 1;
	
	$('section.sheet > table > tbody > tr').each(function(key, item) {

		index+= increment;
		$(item).data('index', index);
		field = $(item).find('input[name="item[][nombre]"]');
		
		if ($(item).hasClass('title')) {
			parent = $(item).data('id');

			fields['item[' + k + '][id]'] = $(item).data('id');
			fields['item[' + k + '][index]'] = $(item).data('index');
			fields['item[' + k + '][categoria]'] = $(item).data('categoria');
			fields['item[' + k + '][nombre]'] = $(item).find('[name="item[][nombre]"]').val();
			fields['item[' + k + '][subtotal_precio]'] = parseFloat($(item).find('[name="item[][subtotal_precio]"]').val());
			fields['item[' + k + '][subtotal_costo]'] = parseFloat($(item).find('[name="item[][subtotal_costo]"]').val());
			fields['item[' + k + '][utilidad]'] = parseFloat($(item).find('[name="item[][utilidad]"]').val());
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
			fields['item[' + k + '][precio_unitario]'] = parseFloat($(item).find('[name="item[][precio_unitario]"]').val());
			fields['item[' + k + '][subtotal_precio]'] = parseFloat($(item).find('[name="item[][subtotal_precio]"]').val());
			fields['item[' + k + '][costo_unitario]'] = parseFloat($(item).find('[name="item[][costo_unitario]"]').val());
			fields['item[' + k + '][subtotal_costo]'] = parseFloat($(item).find('[name="item[][subtotal_costo]"]').val());
			fields['item[' + k + '][utilidad]'] = parseFloat($(item).find('[name="item[][utilidad]"]').val());
			fields['item[' + k + '][margen_compra]'] = parseFloat($(item).find('[name="item[][margen_compra]"]').val());
			fields['item[' + k + '][margen_venta]'] = parseFloat($(item).find('[name="item[][margen_venta]"]').val());
			fields['item[' + k + '][aplica_sobrecargo]'] = $(item).find('[name="item[][aplica_sobrecargo]"]').prop('checked');
			fields['item[' + k + '][observacion]'] = $(item).data('observacion');
			fields['item[' + k + '][comentario]'] = $(item).data('comentario');
			fields['item[' + k + '][tipo_documento]'] = $(item).data('tipo-documento');


			fields['item[' + k + '][tipo_documento][ratio]'] = $(item).data('tipo-documento-ratio');
			fields['item[' + k + '][tipo_documento][inverse]'] = $(item).data('tipo-documento-inverse');
			//fields['item[' + k + '][hora_extra][valor]'] = $(item).data('hora-extra-valor');
			fields['item[' + k + '][hora_extra][factor]'] = $(item).data('hora-extra-factor');
			fields['item[' + k + '][hora_extra][jornada]'] = $(item).data('hora-extra-jornada');
			fields['item[' + k + '][precio_unitario][base_imponible]'] = $(item).data('base-imponible');
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
		success: function(data) {
			// Se debe obtener un response con todo los id e index reasignados
			// se debe ver si es realmente necesario
			/*$(item).data('id', data.id);
			$(item).data('index', data.index);
			*/
			if (typeof callback != 'undefined')
				callback();
		},
		error: function() {
			//toastr.error('No se pudo guardar el item');
			// manejar esta situación
		}
	}).fail(function(err, err2, err3) {
		
		
		
	});

};

var checkAjuste = function(reset) {
	/*
	Si el sobrecargo está cerrado, y está calculado sobre el total, entonces:
		a) Se oculta el campo de porcentaje
		b) Se establece el valor del ajuste al subtotal neto
		c) Se muestra el campo de ajuste
	*/

	var target = $('section.sobrecargos > ul > li[data-ajuste="true"]');

	//if (target.find('[type="checkbox"]').prop('checked') && target.data('total')) {
		if (reset) {
			target.find('.percent').val(0).trigger('change');
			target.find('.currency').val(0);
			target.find('.currency').trigger('change');
		}
		//target.find('.percent .utilidad').parentTo('span').invisible();
		target.find('.percent').prop('readonly', true);
		//$('input[name="cotizacion[ajuste]"]').val($('input[name="cotizacion[montos][subtotal_neto]"]').val()).parentTo('li').show();
		$('input[name="cotizacion[ajuste]"]').parentTo('li').show();

		if (target.find('.utilidad').length)
			$('[name="cotizacion[ajuste][diferencia]"]').addClass('utilidad');
		else
			$('[name="cotizacion[ajuste][diferencia]"]').addClass('costo');

	/*} else {
		if (reset) {
			target.find('.percent').val(0);
			target.find('.currency').val(0);
			target.find('.percent').trigger('change');
		}
		//target.find('.percent .utilidad').parentTo('span').visible();
		target.find('.percent').prop('readonly', false);

		$('input[name="cotizacion[ajuste]"]').parentTo('li').hide();
	}*/

};

var updateTotalUtilidadCosto = function() {
	var utilidad_items = parseFloat($('[name="cotizacion[utilidades][subtotal]"]').val());
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

	var utilidad_total = (utilidad_items + utilidad_sobrecargos - descuento).toFixed(currency.decimals);
	var costo_total = (costo_items + costo_sobrecargos).toFixed(currency.decimals);

	$('input[name="cotizacion[montos][utilidad]"]').val(utilidad_total);
	$('input[name="cotizacion[montos][costo]"]').val(costo_total);
	$('span[name="cotizacion[montos][utilidad]"]').text(utilidad_total);
	$('span[name="cotizacion[montos][costo]"]').text(costo_total);
	$('span[name="cotizacion[montos][utilidad]"]').number(true, currency.decimals, ',', '.');
	$('span[name="cotizacion[montos][costo]"]').number(true, currency.decimals, ',', '.');

	var subtotal_neto = parseFloat($('input[name="cotizacion[montos][subtotal_neto]"]').val());

	$('input[name="cotizacion[montos][utilidad_ratio]"]').val(utilidad_total / subtotal_neto * 100);
	$('input[name="cotizacion[montos][costo_ratio]"]').val(costo_total / subtotal_neto * 100);
	if ($('input[name="cotizacion[montos][utilidad_ratio]"]').length > 0)
		$('span[name="cotizacion[montos][utilidad_ratio]"]').text($('input[name="cotizacion[montos][utilidad_ratio]"]').val().replace('.', ','));
	if ($('input[name="cotizacion[montos][costo_ratio]"]').length > 0)
		$('span[name="cotizacion[montos][costo_ratio]"]').text($('input[name="cotizacion[montos][costo_ratio]"]').val().replace('.', ','));
	/*$('span[name="cotizacion[montos][utilidad_ratio]"]').number(true, 2, ',', '.');
	$('span[name="cotizacion[montos][costo_ratio]"]').number(true, 2, ',', '.');*/
};


var updateTotal = function() {
	var subtotal_neto = parseFloat($('input[name="cotizacion[montos][subtotal_neto]"]').val());
	var porcentaje_impuesto  = parseFloat($('[name="cotizacion[montos][impuesto]"]').data('porcentaje'));
	var valor_impuesto;

	if ($('[name="cotizacion[montos][impuesto][exento]"]').prop('checked'))
		valor_impuesto = 0;
	else
		valor_impuesto = subtotal_neto * porcentaje_impuesto / 100;

	$('[name="cotizacion[montos][impuesto]"]').val(Math.abs(valor_impuesto.toFixed(currency.decimals)));

	var total = subtotal_neto + valor_impuesto;

	$('[name="cotizacion[montos][total]"]').val(Math.abs(total.toFixed(currency.decimals)));

	updateTotalUtilidadCosto();
};

var updateSubtotalNeto = function() {
	var subtotal_precios = parseFloat($('[name="cotizacion[precios][subtotal]"]').val());
	var subtotal_sobrecargos = parseFloat($('[name="cotizacion[sobrecargos][subtotal]"]').val());
	var descuento = parseFloat($('[name="cotizacion[descuento][valor]"]').val());
	$('input[name="cotizacion[montos][subtotal_neto]"]').val(Math.abs((subtotal_precios + subtotal_sobrecargos - descuento).toFixed(currency.decimals)));
	/*
	var ajuste = 0;
	if ($('input[name="cotizacion[ajuste]"]').data('value')) {
		ajuste = parseFloat($('input[name="cotizacion[ajuste]"]').data('value'));
		$('input[name="cotizacion[ajuste]"]').val(Math.abs((subtotal_precios + subtotal_sobrecargos - descuento + ajuste).toFixed(0)));
	} else {
		$('input[name="cotizacion[ajuste]"]').val(Math.abs((subtotal_precios + subtotal_sobrecargos - descuento).toFixed(0)));
	}
	$('span[name="cotizacion[montos][subtotal_neto]"]').text(Math.abs((subtotal_precios + subtotal_sobrecargos - descuento + ajuste).toFixed(0)));
	*/
	// Copiar a ajuste
	$('input[name="cotizacion[ajuste]"]').val($('input[name="cotizacion[montos][subtotal_neto]"]').val());
	$('input[name="cotizacion[ajuste][diferencia]"]').val($('section.sobrecargos li[data-ajuste="true"] input[name$="[valor]"]').val());

	if ($('section.sobrecargos li[data-ajuste="true"] input[name$="[valor]"]').val() > 0) {
		$('input[name="cotizacion[montos][subtotal_neto]"]').addClass('ajustado');
		$('button.reset.ajuste').show();
	} else {
		$('input[name="cotizacion[montos][subtotal_neto]"]').removeClass('ajustado');
		$('button.reset.ajuste').hide();
	}

	$('span[name="cotizacion[montos][subtotal_neto]"]').text(Math.abs((subtotal_precios + subtotal_sobrecargos - descuento).toFixed(currency.decimals)));
	$('span[name="cotizacion[montos][subtotal_neto]"]').number(true, currency.decimals, ',', '.');

	updateTotal();
};

var updateDescuento = function() {
	var porcentaje_descuento = parseFloat($('[name="cotizacion[descuento][porcentaje]"]').val());
	var subtotal_sobrecargos = parseFloat($('section.sobrecargos > ul > li:last-of-type input[name*="subtotal"]').val());
	$('[name="cotizacion[descuento][valor]"]').val((porcentaje_descuento * subtotal_sobrecargos / 100).toFixed());
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
	var subtotal_precios = parseFloat($('[name="cotizacion[precios][subtotal]"]').val());
	var aplica_sobrecargo = parseFloat($('[name="cotizacion[precios][subtotal]"]').data('aplica-sobrecargo'));
	var subtotal_sobrecargo = subtotal_precios;
	var valor_sobrecargo;

	$('section.sobrecargos li').each(function() {
		var subtotal_sobrecargo_anterior, porcentaje;
		$(this).find('[name^="sobrecargo"][name$="[porcentaje]"]').validateNumbers();
		porcentaje = parseFloat($(this).find('[name^="sobrecargo"][name$="[porcentaje]"]').val());

		// revisar más adelante el redondeo, para el caso que se necesite adaptar a UF o a USD

		if ($(this).data('items')) {
			valor_sobrecargo = parseFloat((porcentaje * aplica_sobrecargo / 100).toFixed(currency.decimals));
			subtotal_sobrecargo+= valor_sobrecargo;
		} else {
			if ($(this).data('total')) {
				subtotal_sobrecargo_anterior = subtotal_sobrecargo;

				if (!$(this).data('ajuste')) {

					// Cantidad de sobrecargos sobre el total. Se excluye el ajuste
					var sobrecargos_sobre_total = $('section.sobrecargos li[data-total="true"]:not([data-ajuste="true"])').length;

					// Cálculo con último sobrecargo sobre el total, o ninguno sobre el total
					if (sobrecargos_sobre_total == 1 || sobrecargos_sobre_total == 0) {
						subtotal_sobrecargo = parseFloat((subtotal_sobrecargo_anterior / (1 - porcentaje / 100)).toFixed(currency.decimals));
						valor_sobrecargo = parseFloat((subtotal_sobrecargo - subtotal_sobrecargo_anterior).toFixed(currency.decimals));
					}

					// Cálculo con 2 últimos sobrecargos sobre el total
					if (sobrecargos_sobre_total == 2) {
						var total_neto = parseFloat($('input[name="cotizacion[ajuste]"]').val());
						valor_sobrecargo = parseFloat((porcentaje * total_neto / 100).toFixed(currency.decimals));
						subtotal_sobrecargo+= valor_sobrecargo;
					}
				}
			} else {
				valor_sobrecargo = parseFloat((porcentaje * subtotal_sobrecargo / 100).toFixed(currency.decimals));
				subtotal_sobrecargo+= valor_sobrecargo;
			}
		}

		if ($(this).data('ajuste')) {
			valor_sobrecargo = parseFloat($(this).find('[name^="sobrecargo"][name$="[valor]"]').val());
			
			subtotal_sobrecargo+= valor_sobrecargo;
			$(this).find('[name^="sobrecargo"][name$="[subtotal]"]').val(subtotal_sobrecargo.toFixed(currency.decimals));

		} else {
			$(this).find('[name^="sobrecargo"][name$="[subtotal]"]').val(subtotal_sobrecargo.toFixed(currency.decimals));
			$(this).find('[name^="sobrecargo"][name$="[valor]"]').val(valor_sobrecargo.toFixed(currency.decimals));
		
		}

	});
	updateSubtotalSobrecargos();
};

var updateSubtotalItems = function() {
	var target = $('table.items > tbody');

	var subtotal_precios = 0;
	var subtotal_costos = 0;
	var subtotal_utilidades = 0;
	var aplica_sobrecargo = 0;
	
	target.find('tr').not('.title').each(function() {
		subtotal_precios+= parseFloat($(this).find('[name="item[][subtotal_precio]"]').val());
		subtotal_costos+= parseFloat($(this).find('[name="item[][subtotal_costo]"]').val());
		subtotal_utilidades+= parseFloat($(this).find('[name="item[][utilidad]"]').val());

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
	$('input[name="cotizacion[utilidades][subtotal]"]').val(subtotal_utilidades);

	var subtotal_margen_compra = ((subtotal_precios - subtotal_costos) / subtotal_costos * 100).toFixed(2);
	var subtotal_margen_venta = ((subtotal_precios - subtotal_costos) / subtotal_precios * 100).toFixed(2);

	$('input[name="cotizacion[margenes][margen_venta]"]').val((isFinite(subtotal_margen_venta))? subtotal_margen_venta : 0);
	$('input[name="cotizacion[margenes][margen_compra]"]').val((isFinite(subtotal_margen_compra))? subtotal_margen_compra : 0);

	for (var i = 0; i < 24; i++)
		updateSobrecargos();
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
	var subtotal_utilidades = 0;

	var current = target.next();

	do {
		// Se comprueba que los elementos a calcular no sean ni el oculto que aún no se coloca oficialmente
		// ni tampoco el clon helper que se está mostrando al arrastrar
		//if (current.is(':visible') && !current.hasClass('ui-draggable-dragging')) {
		if (current.css('visibility') != 'hidden' && !current.hasClass('ui-draggable-dragging')) {
			subtotal_precios+= parseFloat(current.find('[name="item[][subtotal_precio]"]').val());
			subtotal_costos+= parseFloat(current.find('[name="item[][subtotal_costo]"]').val());
			subtotal_utilidades+= parseFloat(current.find('[name="item[][utilidad]"]').val());
		}

		current = current.next();
	} while(!current.hasClass('title') && current.length > 0);

	target.find('input[name="item[][subtotal_precio]"]').val(subtotal_precios);
	target.find('input[name="item[][subtotal_costo]"]').val(subtotal_costos);
	target.find('input[name="item[][utilidad]"]').val(subtotal_utilidades);

	var subtotal_margen_compra = ((subtotal_precios - subtotal_costos) / subtotal_costos * 100).toFixed(2);
	var subtotal_margen_venta = ((subtotal_precios - subtotal_costos) / subtotal_precios * 100).toFixed(2);

	target.find('input[name="item[][margen_venta]"]').val((isFinite(subtotal_margen_venta))? subtotal_margen_venta : 0);
	target.find('input[name="item[][margen_compra]"]').val((isFinite(subtotal_margen_compra))? subtotal_margen_compra : 0);

};

var updateRow = function(event) {
	// TODO: optimizar en velocidad de respuesta, para ello revisar las siguientes llamadas a funciones que actualizan
	// a partir de la llamada actual

	/*if ($(this).prop('type') == 'number')
		$(this).validateNumbers();*/
	if ($(event.target).prop('type') == 'number')
		$(event.target).validateNumbers();

	// Copiar precio a costo

	/*if ($(this).prop('name') == 'item[][costo_unitario]')
		$(this).data('auto', false);*/
	if ($(event.target).prop('name') == 'item[][costo_unitario]')
		$(event.target).data('auto', false);

	if (typeof copiar_precio_a_costo == 'boolean') {
		//var target = $(this).parentTo('tr');
		var target = $(event.target).parentTo('tr');
		var costo_unitario = target.find('[name="item[][costo_unitario]"]');
		//if ($(this).prop('name') == 'item[][precio_unitario]') {
		if ($(event.target).prop('name') == 'item[][precio_unitario]') {
			if (costo_unitario.data('auto'))
				//costo_unitario.val($(this).val());
				costo_unitario.val($(event.target).val()); //.triggerHandler('change');
		}
	}

	
	//var target = $(this).parentTo('tr');
	var target = $(event.target).parentTo('tr');

	var cantidad = target.find('[name="item[][cantidad]"]').val();
	var factor = target.find('[name="item[][factor]"]').val();
	var precio_unitario = target.find('[name="item[][precio_unitario]"]').val();

	var margen_venta, costo_unitario, subtotal_precio, subtotal_costo;

	//if ($(this).prop('name') == 'item[][margen_venta]') {
	if ($(event.target).prop('name') == 'item[][margen_venta]') {
		margen_venta = target.find('[name="item[][margen_venta]"]').val();
		costo_unitario = (1 - margen_venta / 100) * precio_unitario;

		target.find('[name="item[][costo_unitario]"]').val(costo_unitario);

		subtotal_precio = cantidad * factor * precio_unitario;
		subtotal_costo = cantidad * factor * costo_unitario;
	} else {
		costo_unitario = target.find('[name="item[][costo_unitario]"]').val();

		subtotal_precio = cantidad * factor * precio_unitario;
		subtotal_costo = cantidad * factor * costo_unitario;

		margen_venta = ((subtotal_precio - subtotal_costo) / subtotal_precio * 100).toFixed(2);

		target.find('[name="item[][margen_venta]"]').val((isFinite(margen_venta))? margen_venta : 0);
	}

	var margen_compra = ((subtotal_precio - subtotal_costo) / subtotal_costo * 100).toFixed(2);

	target.find('[name="item[][subtotal_precio]"]').val(subtotal_precio);
	target.find('[name="item[][subtotal_costo]"]').val(subtotal_costo);
	target.find('[name="item[][utilidad]"]').val(subtotal_precio - subtotal_costo);
	target.find('[name="item[][margen_compra]"]').val((isFinite(margen_compra))? margen_compra : 0);

	//updateSubtotalTitulos($(this));
	updateSubtotalTitulos($(event.target));
	updateSubtotalItems();

	// No debería guardar filas en tiempo real
	/*
	saveRow(event);
	//setTimeout(function() {
		saveRow(event);
	//}, 1);
	*/
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
			current = $('table.items > tbody');
			current.hide();
			var deferred = function(item) {
				var htmlObject, margen_compra, margen_venta;
				if (item.titulo) {
					htmlObject = getElement.titulo('appendTo', current);
					if (typeof item.categoria != 'undefined')
						htmlObject.data('categoria', item.categoria.id);
				} else {
					htmlObject = getElement.item('appendTo', current);
					if (typeof item.producto != 'undefined')
						htmlObject.data('producto', item.producto.id);

					htmlObject.find('[name="item[][codigo]"]').val(item.codigo);
					htmlObject.find('[name="item[][cantidad]"]').val(item.cantidad);
					htmlObject.find('[name="item[][factor]"]').val(item.factor);
					htmlObject.find('[name="item[][precio_unitario]"]').val(item.precio.unitario);

					htmlObject.find('[name="item[][costo_unitario]"]').val(item.costo.presupuestado.unitario);
					
					htmlObject.find('[name="item[][aplica_sobrecargo]"]').prop('checked', item.aplica_sobrecargo);

					htmlObject.data('observacion', item.observacion);
					htmlObject.data('comentario', item.comentario);

					// Factor hora extra y jornada
					htmlObject.data('hora-extra-factor', item.hora_extra.factor);
					htmlObject.data('hora-extra-jornada', item.hora_extra.jornada);
					htmlObject.data('base-imponible', item.hora_extra.base_imponible);

					if (typeof item.tipo_documento != 'undefined') {
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

					// Cantidad horas extras
					//htmlObject.data('hora-extra-cantidad', item.hora_extra.cantidad);
					if (typeof item.hora_extra != 'undefined') {
						htmlObject.find('[name="item[][horas_extras]"]').val(item.hora_extra.cantidad).visible();
						if (item.hora_extra.cantidad > 0)
							htmlObject.find('[name="item[][precio_unitario]"]').addClass('special');
					} else
						htmlObject.find('[name="item[][horas_extras]"]').val(0).invisible();


				}

				htmlObject.find('[name="item[][subtotal_precio]"]').val(item.precio.subtotal);
				htmlObject.find('[name="item[][subtotal_costo]"]').val(item.costo.presupuestado.subtotal);
				htmlObject.find('[name="item[][utilidad]"]').val(item.precio.subtotal - item.costo.presupuestado.subtotal);

				margen_compra = ((item.precio.subtotal - item.costo.presupuestado.subtotal) / item.costo.presupuestado.subtotal * 100).toFixed(2);
				margen_venta = ((item.precio.subtotal - item.costo.presupuestado.subtotal) / item.precio.subtotal * 100).toFixed(2);

				htmlObject.find('[name="item[][margen_venta]"]').val((isFinite(margen_venta))? margen_venta : 0);
				htmlObject.find('[name="item[][margen_compra]"]').val((isFinite(margen_compra))? margen_compra : 0);

				htmlObject.data('id', item.id);
				htmlObject.data('index', item.index);
				htmlObject.find('input[name="item[][nombre]"]').val(item.nombre);
				htmlObject.find('input[name="item[][nombre]"]').data('nombre-original', item.text);

				htmlObject.find('button.profile.item').tooltipster('update', item.text);

				if (item.text != item.nombre)
					htmlObject.find('[name="item[][nombre]"]').addClass('edited');
				else
					htmlObject.find('[name="item[][nombre]"]').removeClass('edited');

			};

			asyncLoop(data.rows.length,
				function(i) {
					deferred(data.rows[i]);
				},
				function() {
					updateSubtotalItems();
					current.show();
					unaBase.ui.unblock();
					if ($('section.sheet').data('index'))
						$('section.sheet table > thead button.toggle.all').triggerHandler('click');
					if (typeof callback != 'undefined')
						callback();
				}
			);

		},
		error: function() {
			toastr.error('No se pudieron mostrar los items de la cotización');
			// manejar esta situación
		}
	});
	
};

var afterEditEmpresa = function(element) {
	var target = $(element).parentTo('ul');
	//target.find('input[name="cotizacion[empresa][id]"], input[name="cotizacion[empresa][razon_social]"], input[name="cotizacion[empresa][rut]"]')
	target.find('input[name="cotizacion[empresa][id]"]')
		.attr('type', 'search')
		.autocomplete('enable');
	target.find('input[name="cotizacion[empresa][id]"]').attr('placeholder', 'Buscar por alias, RUT, razón social...');
	/*
	target.find('input[name="cotizacion[empresa][razon_social]"]').attr('placeholder', 'Buscar por Razón Social');
	target.find('input[name="cotizacion[empresa][rut]"]').attr('placeholder', 'Buscar por RUT');
	target.find('input[name="cotizacion[empresa][giro]"], input[name="cotizacion[empresa][direccion]"], input[name="cotizacion[empresa][telefonos]"]')
		.attr('readonly', true);
	*/
	target.find('input[name="cotizacion[empresa][razon_social]"]').attr('readonly', true);
	
	target.find('input[name="cotizacion[empresa][id]"]').focus();
	target.find('button.empresa.edit').hide();

	if (
		$('input[name="cotizacion[empresa][id]"]').val() != '' ||
		$('input[name="cotizacion[empresa][razon_social]"]').val() != ''/* ||
		$('input[name="cotizacion[empresa][rut]"]').val() != ''*/
	)
		target.find('button.empresa.unlock, button.empresa.profile').show();

	/*
	target.find('input[name="cotizacion[empresa][rut]"]').parentTo('span').removeClass('main');
	target.find('input[name="cotizacion[empresa][rut][validate]"]').parentTo('span').removeClass('secondary').addClass('hidden');
	*/
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

// FIXME: Ver la opción de comentar este método, ya que no será usado nuevamente
var saveRow = function(event) {
	//var target = $(this).parentTo('tr');
	var target = $(event.target).parentTo('tr');
	var tuple = (target.hasClass('title'))? {
		'item[][subtotal_precio]': $('[name="item[][subtotal_precio]"]').val(),
		'item[][subtotal_costo]': $('[name="item[][subtotal_costo]"]').val(),
		'item[][utilidad]': $('[name="item[][utilidad]"]').val(),
		'item[][margen_venta]': $('[name="item[][margen_venta]"]').val(),
		'item[][margen_compra]': $('[name="item[][margen_compra]"]').val()
	} : {};
	
	var fields = {
		id: target.data('id'),
		index: target.data('index'),
		fk: target.parent().parent().parent().data('id'),
		producto: target.data('producto'),
		categoria: target.data('categoria'),
		parent: target.prevTo('.title').data('id')
	};

	$.extend(fields, fields, tuple);

	//tuple[$(this).attr('name')] = $(this).val();
	tuple[$(event.target).attr('name')] = $(event.target).val();

	$.extend(fields, fields, tuple);

	//var element = this;
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
				
				// Antes, se permitían los ítems con nombre custom
				/*$$(element).parentTo('tr').find('input').val('');;*/

				/*
				// A partir de ahora (2014-04-22), se deben restringir y rechazar
				if (!$(element).parentTo('tr').hasClass('title')) {
					$(element).parentTo('tr').find('[name="item[][nombre]"]').removeClass('edited').data('nombre-original', null);
					$(element).parentTo('tr').find('input').val('');
					$(element).parentTo('tr').find('input').val('');
					$(element).parentTo('tr').find('input[name="item[][cantidad]"]').val(1);
					$(element).parentTo('tr').find('input[name="item[][factor]"]').val(1);
				}
				*/

				// (2014-05-07) se deben permitir en la medida que no sea un nombre ingresado por primera vez al ítem

				//if (!$(element).parentTo('tr').hasClass('title') && !$(element).parentTo('tr').find('[name="item[][nombre]"]').hasClass('edited')) {
				//if (!$(element).parentTo('tr').hasClass('title') && !$(element).parentTo('tr').data('producto')) {

				if (!$(element).parentTo('tr').hasClass('title')) {
					if (!$(element).parentTo('tr').data('producto')) {
						$(element).parentTo('tr').find('[name="item[][nombre]"]').removeClass('edited').data('nombre-original', null);
						$(element).parentTo('tr').find('input').val('');
						// FIXME: línea repetida de código (?)
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
					for (var i = data.rows.length - 1; i >= 0; i--) {
						var item = data.rows[i];

						var htmlObject = getElement.item('insertAfter', title);

						htmlObject.data('producto', item.id);
						htmlObject.find('[name="item[][codigo]"]').val(item.index);
						htmlObject.find('[name="item[][precio_unitario]"]').val(item.precio);
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

						var margen_compra = ((subtotal_precio - subtotal_costo) / subtotal_costo * 100).toFixed(2);
						var margen_venta = ((subtotal_precio - subtotal_costo) / subtotal_precio * 100).toFixed(2);


						htmlObject.find('[name="item[][margen_venta]"]').val((isFinite(margen_venta))? margen_venta : 0);
						htmlObject.find('[name="item[][margen_compra]"]').val((isFinite(margen_compra))? margen_compra : 0);

						htmlObject.find('[name="item[][utilidad]"]').val(subtotal_precio - subtotal_costo);

						htmlObject.find('span.unit').html(item.unidad);


						if (typeof item.tipo_documento != 'undefined') {
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

						var source = htmlObject.find('[name="item[][nombre]"]');

						//
						//source.trigger('change');
						/*(function(saveRow, source) {
							$.proxy(saveRow, source);
						})(saveRow, source);*/
						//updateSubtotalTitulos(source);
						//test
						/*

						var saveDeferred = function(saveRow, source) {
							$.proxy(saveRow, source);
						};
						setTimeout(saveDeferred(saveRow, source), 1000);*/
					}

					title.nextUntil('.title').each(function() {
						//$(this).find('[name="item[][nombre]"]').triggerHandler('blur');
						$.proxy(saveRow, this, this);
						//updateSubtotalTitulos(source);
					});

					updateSubtotalTitulos(source);


					// TODO: esta es una forma de actualizar las filas, tomando como referencia la última que se agregó
					// debe mejorarse para ver si no falla al hacerlo con categorías que no tienen productos
					/*var source = htmlObject.find('[name="item[][nombre]"]')
					source.trigger('change');
					updateSubtotalTitulos(source);*/

					updateSubtotalItems();
					updateIndexes();

					if (title.find('button.toggle.categoria').hasClass('ui-icon-folder-collapsed'))
						title.find('button.toggle.categoria').triggerHandler('click');

					unaBase.ui.unblock();
				},
				fail: function(a,b,c) {
					toastr.info(a + b + c);
				}
			});
		}
	});
};