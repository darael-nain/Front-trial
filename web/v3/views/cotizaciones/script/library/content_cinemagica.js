
// if (typeof selected_currency == 'undefined')
// 	var localCurrency = currency.symbol;
// else {
// 	var localCurrency = currency.symbol;
// }
var localCurrency =""
var idnegocio = document.querySelector('section.sheet').dataset.id;

// change cotneg >>>>>
// var getElement = {
// 	titulo: function(functor, element) {
// 		var htmlObject = $(' \
// 			<tr class="title" data-categoria="0"> \
// 				<th><span class="ui-icon ui-icon-arrow-4" title="Arrastrar para mover" style="cursor: move;"></span><button class="ui-icon ui-icon-minus remove categoria" title="Quitar categoría"></button> <button class="ui-icon ui-icon-copy clone categoria" title="Duplicar categoría"></button></th> \
// 				<th> \
// 					<button class="ui-icon ui-icon-folder-open toggle categoria" title="Contraer o expandir título"></button> \
// 					<button class="ui-icon ui-icon-circle-plus add categoria" title="Agregar categoría debajo" data-help="Haga clic en este botón para añadir un ítem a la categoría creada"></button> \
// 					<button class="ui-icon ui-icon-plus add item" title="Insertar ítem bajo el título"></button> \
// 				</th> \
// 				<th style="white-space:nowrap;"><input style="' + (!showCodigoItems? 'width: calc(100% - 40px);margin-left: -10px;' : '') + '" name="item[][nombre]" type="search" value="" placeholder="Buscar categoría por nombre..."><button class="ui-icon ui-icon-plus add all-items"><!-- <button class="show categoria">Ver categorías</button> --><button class="ui-icon ui-icon-document detail categoria" title="Detalle">Detalle</button><button class="ui-icon ui-icon-gear profile categoria" title="Perfil">Perfil</button></th> \
// 				<th style="' + (!v3_show_tipodoc_items? 'display:none;' : '') + '" class="tipo-documento"></th> \
// 				<th class="info"></th> \
// 				<th style="' + (!showUnidad? 'display:none;' : '') + '" class="unidad"></th> \
// 				<th class="segunda-cantidad"></th> \
// 				<th class="horas-extras numeric qty abs"><input class="number" name="item[][horas_extras]" value=""></th> \
// 				<th class="venta"></th> \
// 				<th class="numeric currency venta">' + localCurrency + ' <span><input readonly name="item[][subtotal_precio]" type="text" value="0"></span> <span class="info"></span></th> \
// 				<th class="costo unitario"></th> \
// 				<th class="numeric currency costo">' + localCurrency + ' <span><input readonly name="item[][subtotal_costo]" type="text" value="0"></span></th> \
// 				<th class="numeric currency utilidad">' + localCurrency + ' <span><input readonly name="item[][utilidad]" type="text" value="0"></span></th> \
// 				<th class="numeric percent margen-desde-venta margen"><span><input name="item[][margen_venta]" type="text" value="0"> %</span></th> \
// 				<th class="numeric percent margen-desde-compra margen"><span><input name="item[][margen_compra]" type="text" value="0"> %</span></th> \
// 				<th colspan="2"></th> \
// 				<th colspan="1" class="ocultar-print"><input name="item[][ocultar_print]" type="checkbox" value="true"></th> \
// 				<th colspan="1" class="ocultar-print"><input name="item[][mostrar_carta_cliente]" type="checkbox" value="true"></th> \
// 			</tr> \
// 		');

// 		if (!v3_sobrecargos_cinemagica) {
// 			htmlObject.find('[name="item[][mostrar_carta_cliente]"]').closest('th').remove();
// 		}

// 		htmlObject.find('input.number').number(true, 1, ',', ''); // Quitar flecha de campos tipo number

// 		htmlObject[functor](element);

// 		if (typeof selected_currency == 'undefined')
// 			htmlObject.find('.numeric.currency input').number(true, currency.decimals, ',', '.');
// 		else
// 			htmlObject.find('.numeric.currency input').number(true, 2, ',', '.');
// 		htmlObject.find('.numeric.percent input').number(true, 2, ',', '.');

// 		htmlObject.draggable({
// 			helper: 'clone',
// 			containment: 'tbody',
// 			start: function(event, ui) {
// 				var dragSource = $(event.target).nextUntil('.title');
// 				var width = dragSource.width();
// 				var height = dragSource.height();

// 				dragSource.addClass('moving-src');
// 				updateSubtotalTitulos($(event.target));
// 				// FIXME: el helper no responde a cambios en el width
// 				ui.helper.width(width);
// 				ui.helper.height(height);
// 				$(event.target).trigger('beforeMove'); // Logs tiempo real
// 			},
// 			revert: function(event, ui) {
// 				$('.moving-src').removeClass('moving-src');
// 			}
// 		});

// 		htmlObject.droppable({
// 			hoverClass: 'ui-state-active',
// 			accept: 'table.items > tbody > tr',
// 			drop: function(event, ui) {
// 				var dragTarget = $(event.target).nextUntil('.title');
// 				$(event.target).after(ui.draggable);
// 				if (ui.draggable.hasClass('title')) {
// 					dragTarget.addClass('moving-dst');
// 					ui.draggable.insertAfter($(event.target));
// 					$('.moving-src').removeClass('moving-src').insertAfter(ui.draggable);
// 					$('.moving-dst').removeClass('moving-dst').insertAfter($(event.target));

// 				} else {
// 					ui.draggable.insertAfter($(event.target));
// 				}
// 				$(ui.draggable).trigger('afterMove'); // Logs tiempo real
// 			}
// 		});

// 		return htmlObject;
// 	},
// 	item: function(functor, element) {
// 		var htmlObject = $(' \
// 			<tr data-producto="0"> \
// 				<td class="' + (!showCodigoItems? 'counter ' : '') + '"><span class="ui-icon ui-icon-arrow-4" title="Arrastrar para mover" style="cursor: move;"></span><button class="ui-icon ui-icon-minus remove item" title="Quitar ítem"></button> <button class="ui-icon ui-icon-plus insert item" title="Agregar ítem debajo"></button> <button class="ui-icon ui-icon-copy clone item" title="Duplicar ítem"></button></td> \
// 				<td style="' + (!showCodigoItems? 'display: inline;' : '') + '" class="numeric code' + (!showCodigoItems? ' no-counter ' : '') + '"><input name="item[][codigo]" type="text"' + ((editCodigoItems)? '' : ' readonly') + '></td> \
// 				<td><input style="' + (!showCodigoItems? 'width: calc(100% + 20px);margin-left: -70px;' : '') + '" name="item[][nombre]" type="search" placeholder="Buscar producto o servicio por código o por nombre..."><button class="ui-icon ui-icon-carat-1-s show item">Ver ítems</button><button class="ui-icon ui-icon-document detail item" title="Detalle">Detalle</button><button class="ui-icon ui-icon-gear profile item" title="Perfil"></button></td> \
// 				<td style="' + (!v3_show_tipodoc_items? 'display:none;' : '') + '" class="tipo-documento"><input type="text" disabled name="item[][tipo_documento]"><button class="ui-icon ui-icon-carat-1-s show tipo-documento">Ver tipos de documento</button></td> \
// 				<td class="numeric qty"><input class="number" name="item[][cantidad]" type="text" value="1"> <span class="unit"></span></td> \
// 				<td style="' + (!showUnidad? 'display:none;' : '') + '" class="unidad"><input type="text" disabled name="item[][unidad]"><button class="ui-icon ui-icon-carat-1-s show unidad">Ver unidades</button></td> \
// 				<td class="segunda-cantidad numeric qty abs"><input class="number" name="item[][factor]" value="1"></td> \
// 				<td class="horas-extras numeric qty abs"><input class="number" name="item[][horas_extras]" value="0"></td> \
// 				<td class="numeric currency venta extended">' + localCurrency + ' <span><input name="item[][precio_unitario]" type="text" value="0"></span> <button class="ui-icon ui-icon-notice detail price" title="Ver detalle del precio">Ver detalle del precio</button></td> \
// 				<td class="numeric currency venta">' + localCurrency + ' <span><input readonly name="item[][subtotal_precio]" type="text" value="0"></span> <button class="ui-icon ui-icon-calculator detail exchange-rate" title="Ver en otras monedas">Ver en otras monedas</button></td> \
// 				<td class="numeric currency costo unitario">' + localCurrency + ' <span><input' + ((access._557)? ' readonly' : '' ) + ' name="item[][costo_unitario]" type="text" value="0"></span></td> \
// 				<td class="numeric currency costo">' + localCurrency + ' <span><input' + ((subtotal_gasto_p_manual)? '' : ' readonly' ) + ' name="item[][subtotal_costo]" type="text" value="0"></span> <button class="ui-icon ui-icon-notice detail cost" title="Ver detalle del costo">Ver detalle del costo</button></td> \
// 				<td class="numeric currency utilidad">' + localCurrency + ' <span><input readonly name="item[][utilidad]" type="text" value="0"></span></td> \
// 				<td class="numeric percent margen-desde-venta margen"><span><input name="item[][margen_venta]" type="text" value="0"> %</span></td> \
// 				<td class="numeric percent margen-desde-compra margen"><span><input name="item[][margen_compra]" type="text" value="0"> %</span></td> \
// 				<td class="fit aplica-sobrecargo"><input name="item[][aplica_sobrecargo]" type="checkbox" value="true"' + (aplica_sobrecargo_items? ' checked' : '') + '></td> \
// 				<td class="fit costo-interno"><input name="item[][costo_interno]" type="checkbox" value="true"></td> \
// 				<td class="fit ocultar-print"><input name="item[][ocultar_print]" type="checkbox" value="true"></td> \
// 				<td class="fit ocultar-print"><input name="item[][mostrar_carta_cliente]" type="checkbox" value="true"></td> \
// 			</tr> \
// 		');

// 		if (!v3_sobrecargos_cinemagica) {
// 			htmlObject.find('[name="item[][mostrar_carta_cliente]"]').closest('td').remove();
// 		}

// 		htmlObject.find('input.number').number(true, 1, ',', ''); // Quitar flecha de campos tipo number

// 		htmlObject.find('[name="item[][cantidad]"]').data('old-value', 1);
// 		htmlObject.find('[name="item[][factor]"]').data('old-value', 1);

// 		htmlObject[functor](element);

// 		htmlObject.find('[name="item[][horas_extras]"]').parentTo('td').invisible();
// 		htmlObject.find('button.detail.price').invisible();
// 		htmlObject.find('button.detail.cost').invisible();
// 		htmlObject.find('[name="item[][costo_unitario]"]').data('auto', true);

// 		if (margen_desde_compra)
// 			htmlObject.find('[name="item[][margen_compra]"]').invisible();
// 		else
// 			htmlObject.find('[name="item[][margen_venta]"]').invisible();

// 		if (typeof selected_currency == 'undefined') {
// 			htmlObject.find('.numeric.currency input:not([name="item[][precio_unitario]"]):not([name="item[][costo_unitario]"])').number(true, currency.decimals, ',', '.');
// 			//htmlObject.find('.numeric.currency input[name="item[][precio_unitario]"]').number(true, 2, ',', '.');
// 			// ocultar decimales en precio unitario
// 			htmlObject.find('.numeric.currency input[name="item[][precio_unitario]"]').number(true, 0, ',', '.');

// 			//if (subtotal_gasto_p_manual)
// 			//	htmlObject.find('.numeric.currency input[name="item[][costo_unitario]"]').number(true, currency.decimals + 2, ',', '.');
// 			//else
// 			//	htmlObject.find('.numeric.currency input[name="item[][costo_unitario]"]').number(true, 2, ',', '.');
// 			// ocultar decimales en costo unitario
// 			htmlObject.find('.numeric.currency input[name="item[][costo_unitario]"]').number(true, currency.decimals, ',', '.');

// 		} else {
// 			//htmlObject.find('.numeric.currency input').number(true, 2, ',', '.');
// 			// ocultar decimales en precio unitario
// 			switch (selected_currency) {
// 				case 'USD':
// 					var decimals = 2;
// 					break;
// 				case 'CLF':
// 					var decimals = 2;
// 					break;
// 				default:
// 					var decimals = currency.decimals;
// 					break;
// 			}
// 			htmlObject.find('.numeric.currency input:not([name="item[][precio_unitario]"]):not([name="item[][costo_unitario]"])').number(true, decimals, ',', '.');
// 			htmlObject.find('.numeric.currency input[name="item[][precio_unitario]"]').number(true, decimals, ',', '.');
// 			htmlObject.find('.numeric.currency input[name="item[][costo_unitario]"]').number(true, decimals, ',', '.');
// 		}

// 		htmlObject.find('.numeric.percent input').number(true, 2, ',', '.');

// 		htmlObject.draggable({
// 			helper: 'clone',
// 			containment: 'tbody',
// 			start: function(event, ui) {
// 				dragSource = $(event.target);
// 				$(event.target).invisible();
// 				updateSubtotalTitulos($(event.target));
// 				ui.helper.width($(event.target).width());
// 				ui.helper.height($(event.target).height());
// 				$(event.target).trigger('beforeMove'); // Logs tiempo real
// 			},
// 			stop: function(event, ui) {
// 				$(event.target).visible();
// 				updateSubtotalTitulos($(event.target));
// 			}
// 		});

// 		htmlObject.droppable({
// 			hoverClass: 'ui-state-active',
// 			accept: 'table.items > tbody > tr:not(.title)',
// 			drop: function(event, ui) {
// 				if ($(event.target).prevTo('tr.title').find('.ui-icon-folder-collapsed'))
// 					$(event.target).prevTo('tr.title').find('.ui-icon-folder-collapsed').triggerHandler('click');
// 				$(event.target).after(ui.draggable);
// 				$(ui.draggable).trigger('afterMove'); // Logs tiempo real
// 				//setTimeout(updateIndexes, 2000);
// 			}
// 		});


// 		htmlObject.find('button.profile.item').tooltipster({
// 			delay: 0,
// 			interactiveAutoClose: false,
// 			contentAsHTML: true
// 		});


// 		return htmlObject;
// 	}
// };

// change cotneg <<<<<

var updateIndexes = function(callback) {
	unblockCot();
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

			fields['item[' + k + '][subtotal_costo_previo]'] = (parseFloat($(item).find('[name="item[][subtotal_costo]"]').val()) * exchange_rate).toString().replace(/\./g, ',');

			fields['item[' + k + '][utilidad]'] = (parseFloat($(item).find('[name="item[][utilidad]"]').val()) * exchange_rate).toString().replace(/\./g, ',');
			fields['item[' + k + '][margen_compra]'] = parseFloat($(item).find('[name="item[][margen_compra]"]').val());
			fields['item[' + k + '][margen_venta]'] = parseFloat($(item).find('[name="item[][margen_venta]"]').val());
			fields['item[' + k + '][ocultar_print]'] = $(item).find('[name="item[][ocultar_print]"]').prop('checked');
			fields['item[' + k + '][mostrar_carta_cliente]'] = $(item).find('[name="item[][mostrar_carta_cliente]"]').prop('checked');
			fields['item[' + k + '][observacion]'] = $(item).data('observacion');

		} else if ($(item).hasClass('itemParent')) {
			parent = $(item).data('id');

			//negocios/script/library/content.js
		
			// simon itemparent
			fields['item[' + k + '][isParent]'] = item.classList.contains('itemParent');
			fields['item[' + k + '][isChild]'] = item.classList.contains('childItem');
			fields['item[' + k + '][itemParent]'] = item.dataset.itemparent;

			fields['item[' + k + '][producto]'] = $(item).data('producto');
			fields['item[' + k + '][id]'] = $(item).data('id');
			fields['item[' + k + '][index]'] = $(item).data('index');
			fields['item[' + k + '][categoria]'] = $(item).data('categoria');
			fields['item[' + k + '][nombre]'] = $(item).find('[name="item[][nombre]"]').val();
			fields['item[' + k + '][subtotal_precio]'] = (parseFloat($(item).find('[name="item[][subtotal_precio]"]').val()) * exchange_rate).toString().replace(/\./g, ',');
			fields['item[' + k + '][subtotal_costo]'] = (parseFloat($(item).find('[name="item[][subtotal_costo]"]').val()) * exchange_rate).toString().replace(/\./g, ',');
			fields['item[' + k + '][utilidad]'] = (parseFloat($(item).find('[name="item[][utilidad]"]').val()) * exchange_rate).toString().replace(/\./g, ',');
			fields['item[' + k + '][margen_compra]'] = parseFloat($(item).find('[name="item[][margen_compra]"]').val());
			fields['item[' + k + '][margen_venta]'] = parseFloat($(item).find('[name="item[][margen_venta]"]').val());
		}else {
			fields['item[' + k + '][id]'] = $(item).data('id');
			fields['item[' + k + '][index]'] = $(item).data('index');
			fields['item[' + k + '][categoria]'] = $(item).data('categoria');
			fields['item[' + k + '][producto]'] = $(item).data('producto');
			fields['item[' + k + '][parent]'] = parent;
			fields['item[' + k + '][codigo]'] = $(item).find('[name="item[][codigo]"]').val();
			fields['item[' + k + '][nombre]'] = $(item).find('[name="item[][nombre]"]').val();
			//fields['item[' + k + '][cantidad]'] = parseFloat($(item).find('[name="item[][cantidad]"]').val());
			if ($(item).find('[name="item[][cantidad]"]').data('old-value'))
				fields['item[' + k + '][cantidad]'] = (parseFloat($(item).find('[name="item[][cantidad]"]').data('old-value'))).toString().replace(/\./g, ',');
			else
				fields['item[' + k + '][cantidad]'] = (parseFloat($(item).find('[name="item[][cantidad]"]').val())).toString().replace(/\./g, ',');
			fields['item[' + k + '][unidad]'] = $(item).find('[name="item[][unidad]"]').val();
			//fields['item[' + k + '][factor]'] = parseFloat($(item).find('[name="item[][factor]"]').val());
			if ($(item).find('[name="item[][factor]"]').data('old-value'))
				fields['item[' + k + '][factor]'] = (parseFloat($(item).find('[name="item[][factor]"]').data('old-value'))).toString().replace(/\./g, ',');
			else
				fields['item[' + k + '][factor]'] = (parseFloat($(item).find('[name="item[][factor]"]').val())).toString().replace(/\./g, ',');
			fields['item[' + k + '][horas_extras]'] = parseFloat($(item).find('[name="item[][horas_extras]"]').val());
			fields['item[' + k + '][porcentaje_monto_total]'] = parseFloat($(item).data('porcentaje-monto-total') * 100).toString().replace(/\./g, ',');
			fields['item[' + k + '][formula_productor_ejecutivo]'] = $(item).data('formula-productor-ejecutivo'); // Fórmula productor ejecutivo
			//fields['item[' + k + '][formula_productor_ejecutivo_ratio]'] = $(item).data('formula-productor-ejecutivo-ratio'); // Fórmula productor ejecutivo
			fields['item[' + k + '][formula_productor_ejecutivo_ratio]'] = parseFloat($(item).data('formula-productor-ejecutivo-ratio')).toString().replace(/\./g, ','); // Fórmula productor ejecutivo
			fields['item[' + k + '][formula_asistente_produccion]'] = $(item).data('formula-asistente-produccion'); // Fórmula asistente producción
			fields['item[' + k + '][formula_horas_extras]'] = $(item).data('formula-horas-extras'); // Fórmula horas extras
			fields['item[' + k + '][director_internacional]'] = $(item).data('director-internacional');
			// Corrección cuando se ocultan decimales
			//fields['item[' + k + '][precio_unitario]'] = (parseFloat($(item).find('[name="item[][precio_unitario]"]').val()) * exchange_rate).toString().replace(/\./g, ',');
			if ($(item).find('[name="item[][precio_unitario]"]').data('old-value'))
				fields['item[' + k + '][precio_unitario]'] = (parseFloat($(item).find('[name="item[][precio_unitario]"]').data('old-value')) * exchange_rate).toString().replace(/\./g, ',');
			else
				fields['item[' + k + '][precio_unitario]'] = (parseFloat($(item).find('[name="item[][precio_unitario]"]').val()) * exchange_rate).toString().replace(/\./g, ',');

			fields['item[' + k + '][subtotal_precio]'] = (parseFloat($(item).find('[name="item[][subtotal_precio]"]').val()) * exchange_rate).toString().replace(/\./g, ',');
			fields['item[' + k + '][costo_unitario]'] = (parseFloat(($(item).find('[name="item[][costo_unitario]"]').data('old-value'))? $(item).find('[name="item[][costo_unitario]"]').data('old-value') : $(item).find('[name="item[][costo_unitario]"]').val()) * exchange_rate).toString().replace(/\./g, ',');
			fields['item[' + k + '][subtotal_costo]'] = (parseFloat($(item).find('[name="item[][subtotal_costo]"]').val()) * exchange_rate).toString().replace(/\./g, ',');

			fields['item[' + k + '][costo_unitario_previo]'] = (parseFloat(($(item).find('[name="item[][costo_unitario]"]').data('old-value'))? $(item).find('[name="item[][costo_unitario]"]').data('old-value') : $(item).find('[name="item[][costo_unitario]"]').val()) * exchange_rate).toString().replace(/\./g, ',');
			fields['item[' + k + '][subtotal_costo_previo]'] = (parseFloat($(item).find('[name="item[][subtotal_costo]"]').val()) * exchange_rate).toString().replace(/\./g, ',');

			fields['item[' + k + '][utilidad]'] = (parseFloat($(item).find('[name="item[][utilidad]"]').val()) * exchange_rate).toString().replace(/\./g, ',');
			fields['item[' + k + '][margen_compra]'] = parseFloat($(item).find('[name="item[][margen_compra]"]').val());
			fields['item[' + k + '][margen_venta]'] = parseFloat($(item).find('[name="item[][margen_venta]"]').val());
			fields['item[' + k + '][aplica_sobrecargo]'] = $(item).find('[name="item[][aplica_sobrecargo]"]').prop('checked');
			fields['item[' + k + '][costo_interno]'] = $(item).find('[name="item[][costo_interno]"]').prop('checked');
			fields['item[' + k + '][ocultar_print]'] = $(item).find('[name="item[][ocultar_print]"]').prop('checked');
			fields['item[' + k + '][mostrar_carta_cliente]'] = $(item).find('[name="item[][mostrar_carta_cliente]"]').prop('checked');
			fields['item[' + k + '][observacion]'] = $(item).data('observacion');
			fields['item[' + k + '][comentario]'] = $(item).data('comentario');
			fields['item[' + k + '][tipo_documento]'] = $(item).data('tipo-documento');
			// simon itemparent
			fields['item[' + k + '][isParent]'] = item.classList.contains('itemParent');
			fields['item[' + k + '][isChild]'] = item.classList.contains('childItem');
			fields['item[' + k + '][itemParent]'] = item.dataset.itemparent;


			fields['item[' + k + '][tipo_documento][ratio]'] = $(item).data('tipo-documento-ratio');
			fields['item[' + k + '][tipo_documento][valor_usd]'] = $(item).data('tipo-documento-valor-usd'); // Impuesto extranjero
			fields['item[' + k + '][tipo_documento][inverse]'] = $(item).data('tipo-documento-inverse');
			fields['item[' + k + '][hora_extra][factor]'] = $(item).data('hora-extra-factor');
			fields['item[' + k + '][hora_extra][jornada]'] = $(item).data('hora-extra-jornada');
			fields['item[' + k + '][precio_unitario][base_imponible]'] = (parseFloat($(item).data('base-imponible')) * exchange_rate).toString().replace(/\./g, ',');

			fields['item[' + k + '][cant_hh_asig]'] = $(item).data('costo-presupuestado-hh-cantidad');
			fields['item[' + k + '][costo_hh_unitario]'] = $(item).data('costo-presupuestado-hh-valor');
			fields['item[' + k + '][responsable_asig]'] = $(item).data('costo-presupuestado-hh-username');

			fields['item[' + k + '][closed_compras]'] = $(item).data('closed-compras');

			fields['item[' + k + '][preset_margen]'] = $(item).data('preset-margen');
			fields['item[' + k + '][preset_margen_value]'] = $(item).data('preset-margen-value');

			// Sección datos cinemágica
			fields['item[' + k + '][costo_directo]'] = $(item).data('costo-directo');
			fields['item[' + k + '][costo_admin]'] = $(item).data('costo-admin'); // Fórmula productor ejecutivo

		}

		if ($(item).next().length) {
			if ($(item).next().hasClass('title'))
				updateSubtotalTitulos($(item));
		}


		$.extend(data, data, fields);
		k++;
	});

	var retval = true;

	$.ajax({
		url: '/4DACTION/_V3_batchItemByCotizacion',
		dataType: 'json',
		data: data,
		type: 'POST',
		cache: false,
		async: (typeof callback == 'undefined'),
		success: function(data) {
			if (data.success) {
				// Desbloquear vista previa y compartir en caso de éxito
				$('#menu [data-name="preview"]').show();

				//verificar cinemagica
				if (access._519)
					$('[data-name="share"]').show();

				if (typeof callback != 'undefined')
					setTimeout(function() {
						callback();
					}, 1500);
			} else {
				if (data.valid)
					toastr.error(NOTIFY.get('ERROR_RECORD_READONLY_ITEM'));
				else
					alert('Se encontró diferencias en las cantidades y precios unitarios de los ítems. Por favor, verificar antes de guardar la cotización.');
				unaBase.ui.unblock();
			}
		}
	}).fail(function(err, err2, err3) {
		// Bloquear vista previa y compartir en caso de error
		$('#menu [data-name="preview"]').hide();
		$('#menu [data-name="share"]').hide();

		toastr.error('No se pudieron guardar los ítems de la cotización, posiblemente debido a un error en los datos. Por favor, comunicarse con Soporte Unabase.');
		unaBase.ui.unblock();
		retval = false;
	});

	return retval;

};


//verificar cinemagica
var updateSubtotalItems = function(triggered) {

	var target = $('table.items.cotizacion > tbody');

	var subtotal_precios = 0;
	var subtotal_costos = 0;
	var subtotal_utilidades = 0;
	var aplica_sobrecargo = 0;
	var director_internacional = 0;

	console.log('--- Begin: lista subtotales ---');
	target.find('tr').not('.title').each(function() {
		subtotal_precios+= parseFloat($(this).find('[name="item[][subtotal_precio]"]').val());
		subtotal_costos+= parseFloat($(this).find('[name="item[][subtotal_costo]"]').val());
		subtotal_utilidades+= parseFloat($(this).find('[name="item[][utilidad]"]').val());


		if (parseFloat($(this).find('[name="item[][subtotal_precio]"]').val()) !== 0) {
			console.log('Subtotal: ' + parseFloat($(this).find('[name="item[][subtotal_precio]"]').val()) + ' | Acumulado: ' + subtotal_precios);
		}

		$(this).find('[name="item[][aplica_sobrecargo]"]').each(function() {
			var subtarget;
			//if ($(this).prop('checked') && !$(this).closest('tr').data('director-internacional')) {
			if ($(this).prop('checked')) {
				subtarget = $(this).parentTo('tr').find('[name="item[][subtotal_precio]"]');
				aplica_sobrecargo+= parseFloat(subtarget.val());
			}
			if ($(this).closest('tr').data('director-internacional')) {
				subtarget = $(this).parentTo('tr').find('[name="item[][subtotal_precio]"]');
				director_internacional+= parseFloat(subtarget.val());
			}
		});
	});
	console.log('--- End: lista subtotales ---');

	$('input[name="cotizacion[precios][subtotal]"]').val(subtotal_precios).data('aplica-sobrecargo', aplica_sobrecargo).data('director-internacional', director_internacional);
	$('input[name="cotizacion[costos][subtotal]"]').val(subtotal_costos);
	$('input[name="cotizacion[utilidades][subtotal]"]').val(subtotal_utilidades);


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

	// for (var i = 0; i <= 10; i++) {
	// Optimización cálculos cinemágica
	/*if (!$('section.sheet').data('no-update')) {
		for (var i = 0; i <= 24; i++) {
			updateSobrecargos();
		}

	} else {
		updateSobrecargos();
	}

	if (v3_sobrecargos_cinemagica) {
		refreshValorPeliculaFromSobrecargos();
		refreshCostosDirectos();
		// Actualizar utilidad de valor película (disabled)
		//$('.block-totales [name="sobrecargo[1][porcentaje]"]').val(25).trigger('blur');
		//refreshValorPeliculaFromSobrecargos();
	}*/

	if (triggered !== true)
		calcValoresCinemagica();

};

//verificar cinemagica
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

	if (!current.hasClass('title') && current.length > 0) {
		do {

			if (current.css('visibility') != 'hidden' && !current.hasClass('ui-draggable-dragging')) {
				subtotal_precios+= parseFloat(current.find('[name="item[][subtotal_precio]"]').val());
				subtotal_costos+= parseFloat(current.find('[name="item[][subtotal_costo]"]').val());
				subtotal_utilidades+= parseFloat(current.find('[name="item[][utilidad]"]').val());
			}

			current = current.next();

		} while(!current.hasClass('title') && current.length > 0);
	}

	if (typeof selected_currency == 'undefined') {
		target.find('input[name="item[][subtotal_precio]"]').val(subtotal_precios.toFixed(currency.decimals));
		target.find('input[name="item[][subtotal_costo]"]').val(subtotal_costos.toFixed(currency.decimals));
		target.find('input[name="item[][utilidad]"]').val(subtotal_utilidades.toFixed(currency.decimals));
	} else {
		target.find('input[name="item[][subtotal_precio]"]').val(subtotal_precios.toFixed(2));
		target.find('input[name="item[][subtotal_costo]"]').val(subtotal_costos.toFixed(2));
		target.find('input[name="item[][utilidad]"]').val(subtotal_utilidades.toFixed(2));
	}

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

//verificar cinemagica
var updateRow = function(event) {
	
	var target = $(event.target).parentTo('tr');

	if ($(event.target).prop('name') == 'item[][nombre]')
		target.find('button.detail.item').prop('title', target.find('[name="item[][nombre]"]').val());


	if ($(event.target).prop('type') == 'number')
		$(event.target).validateNumbers();

	// if (typeof copiar_precio_a_costo == 'boolean' && !margen_desde_compra) {
	if (typeof copiar_precio_a_costo == 'boolean') {
		var costo_unitario = target.find('[name="item[][costo_unitario]"]');
		if ($(event.target).prop('name') == 'item[][precio_unitario]') {
			if (costo_unitario.data('auto')) {
				// Corrección oculta decimales
				//costo_unitario.val($(event.target).val());
				if ($(event.target).data('old-value'))
					costo_unitario.val($(event.target).data('old-value'));
				else
					costo_unitario.val($(event.target).val());
			}
		}
	}

	if (typeof copiar_precio_a_costo != 'boolean') {
		$(event.target).parentTo('tr').find('[name="item[][costo_unitario]"]').removeData('auto');
	}

	var is_auto = $(event.target).parentTo('tr').find('[name="item[][costo_unitario]"]').data('auto');

	if ($(event.target).prop('name') == 'item[][costo_unitario]' && typeof event.originalEvent != 'undefined') {
		$(event.target).removeData('auto');
	}


	var target = $(event.target).parentTo('tr');

	var cantidad = target.find('[name="item[][cantidad]"]').data('old-value');
	var factor = target.find('[name="item[][factor]"]').data('old-value');

	if (typeof $(event.target).parentTo('tr').data('porcentaje-monto-total') != 'undefined' && $(event.target).parentTo('tr').data('porcentaje-monto-total') > 0) {
		var porcentaje_monto_total = $(event.target).parentTo('tr').data('porcentaje-monto-total');
		var formula_productor_ejecutivo = $(event.target).parentTo('tr').data('formula-productor-ejecutivo'); // Fórmula productor ejecutivo
		var formula_asistente_produccion = $(event.target).parentTo('tr').data('formula-asistente-produccion'); // Fórmula asistente producción
		var formula_productor_ejecutivo_ratio = $(event.target).parentTo('tr').data('formula-productor-ejecutivo-ratio'); // Fórmula productor ejecutivo
		var formula_horas_extras = $(event.target).parentTo('tr').data('formula-horas-extras'); // Fórmula horas extras
		var director_internacional = $(event.target).parentTo('tr').data('director-internacional');
		// var total_a_cliente = $('[name="sobrecargo[5][subtotal]"]').val();
		var porcentaje_sc_6 = (typeof $('.block-totales input[name="sobrecargo[6][porcentaje]"]').val() != 'undefined')? parseFloat($('.block-totales input[name="sobrecargo[6][porcentaje]"]').val()) : 0;

		// (if cinemagica tomar el total a cliente, sino el valor que está en la siguiente fórmula)
		if (v3_sobrecargos_cinemagica) {
			var total_a_cliente = parseFloat($('input[name="cotizacion[ajuste]"]').val());
		} else {
			var total_a_cliente = parseFloat($('input[name="cotizacion[ajuste]"]').val()) - parseFloat($('input[name="cotizacion[ajuste]"]').val()) * parseFloat(porcentaje_sc_6 / 100.00);
		}

		// target.find('[name="item[][precio_unitario]"]').val((total_a_cliente / (1 - porcentaje_monto_total) - total_a_cliente) / cantidad / factor);
		// Corrección cuando se ocultan decimales
		//var precio_unitario = target.find('[name="item[][precio_unitario]"]').val();
		if (target.find('[name="item[][precio_unitario]"]').data('old-value'))
			var precio_unitario = target.find('[name="item[][precio_unitario]"]').data('old-value');
		else
			var precio_unitario = target.find('[name="item[][precio_unitario]"]').val();
	} else {
		// Corrección cuando se ocultan decimales
		//var precio_unitario = target.find('[name="item[][precio_unitario]"]').val();
		if (target.find('[name="item[][precio_unitario]"]').data('old-value'))
			var precio_unitario = target.find('[name="item[][precio_unitario]"]').data('old-value');
		else
			var precio_unitario = target.find('[name="item[][precio_unitario]"]').val();
	}

	if (subtotal_gasto_p_manual && $(event.target).prop('name') == 'item[][subtotal_costo]') {
		var costo_unitario = parseFloat(target.find('[name="item[][subtotal_costo]"]').val()) / (parseFloat(target.find('[name="item[][cantidad]"]').data('old-value')) * parseFloat(target.find('[name="item[][factor]"]').data('old-value')));
		target.find('[name="item[][costo_unitario]"]').val(costo_unitario).data('old-value', costo_unitario);
	} else
		//var costo_unitario = (target.find('[name="item[][costo_unitario]"]').data('old-value'))? target.find('[name="item[][costo_unitario]"]').data('old-value') : target.find('[name="item[][costo_unitario]"]').val();
		var costo_unitario = parseFloat(target.find('[name="item[][costo_unitario]"]').val());

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

				target.find('[name="item[][precio_unitario]"]').val(precio_unitario).data('old-value', precio_unitario);
			} else {
				// Corrección cuando se ocultan decimales
				//precio_unitario = target.find('[name="item[][precio_unitario]"]').val();
				if (target.find('[name="item[][precio_unitario]"]').data('old-value'))
					precio_unitario = target.find('[name="item[][precio_unitario]"]').data('old-value');
				else
					precio_unitario = target.find('[name="item[][precio_unitario]"]').val();
				target.find('[name="item[][costo_unitario]"]').val(precio_unitario).data('old-value', precio_unitario).trigger('blur');
			}

			subtotal_precio = cantidad * factor * precio_unitario;
			subtotal_costo = (target.find('[name="item[][subtotal_costo]"]').hasClass('edited'))? cantidad * factor * costo_unitario + costo_presupuestado_interno : cantidad * factor * costo_unitario;
		} else {
			// Corrección cuando se ocultan decimales
			//precio_unitario = target.find('[name="item[][precio_unitario]"]').val();
			if (target.find('[name="item[][precio_unitario]"]').data('old-value'))
				precio_unitario = target.find('[name="item[][precio_unitario]"]').data('old-value');
			else
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
		if (!event.isSimulated && precio_unitario == 0 && costo_unitario != 0 && is_auto) {
			console.log('entra a la sección de código con bug:');
			console.log(event);
		// if (precio_unitario == 0 && costo_unitario != 0) {
			target.find('[name="item[][precio_unitario]"]').val(costo_unitario).data('old-value', costo_unitario); //.trigger('blur').trigger('focus').trigger('blur');
			target.find('[name="item[][subtotal_precio]"]').val(costo_unitario * cantidad * factor); //.trigger('blur').trigger('focus').trigger('blur');
			subtotal_precio = costo_unitario * cantidad * factor;

			if (!target.data('no-update'))
				target.find('[name="item[][costo_unitario]"]').removeData('auto');
		}

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
				target.find('[name="item[][costo_unitario]"]').val(costo_unitario).data('old-value', costo_unitario);
			} else {
				//costo_unitario = (target.find('[name="item[][costo_unitario]"]').data('old-value'))? target.find('[name="item[][costo_unitario]"]').data('old-value') : target.find('[name="item[][costo_unitario]"]').val();
				costo_unitario = target.find('[name="item[][costo_unitario]"]').val();
				precio_unitario = costo_unitario / (1 - margen_venta / 100);
				target.find('[name="item[][precio_unitario]"]').val(precio_unitario).data('old-value', precio_unitario);
			}

			subtotal_precio = cantidad * factor * precio_unitario;
			subtotal_costo = (target.find('[name="item[][subtotal_costo]"]').hasClass('edited'))? cantidad * factor * costo_unitario + costo_presupuestado_interno : cantidad * factor * costo_unitario;
		} else {
			//costo_unitario = (target.find('[name="item[][costo_unitario]"]').data('old-value'))? target.find('[name="item[][costo_unitario]"]').data('old-value') : target.find('[name="item[][costo_unitario]"]').val();
			costo_unitario = parseFloat(target.find('[name="item[][costo_unitario]"]').val());

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

	if (typeof selected_currency == 'undefined') {
		target.find('[name="item[][subtotal_precio]"]').val(subtotal_precio.toFixed(currency.decimals));
		target.find('[name="item[][subtotal_costo]"]').val(subtotal_costo.toFixed(currency.decimals));
		target.find('[name="item[][utilidad]"]').val((subtotal_precio - subtotal_costo).toFixed(currency.decimals));
	} else {
		target.find('[name="item[][subtotal_precio]"]').val(subtotal_precio.toFixed(2));
		target.find('[name="item[][subtotal_costo]"]').val(subtotal_costo.toFixed(2));
		target.find('[name="item[][utilidad]"]').val((subtotal_precio - subtotal_costo).toFixed(2));
	}

	/* if (
		$(event.target).prop('name') == 'item[][cantidad]' ||
		$(event.target).prop('name') == 'item[][factor]' ||
		$(event.target).prop('name') == 'item[][horas_extras]' ||
		$(event.target).prop('name') == 'item[][precio_unitario]' ||
		$(event.target).prop('name') == 'item[][costo_unitario]'
	) {
		target.data('preset-margen-updated', false);
	} */

	if (target.data('fixed-margen') && margen_desde_compra && target.data('fixed-margen-value') != target.find('input[name="item[][margen_compra]"]').val() && !target.data('fixed-margen-updated')) {
		target.data('fixed-margen-updated', true);
		var readonly = target.find('input[name="item[][margen_compra]"]').prop('readonly');
		target.find('input[name="item[][margen_compra]"]').prop('readonly', false).val(target.data('fixed-margen-value')).trigger('blur').prop('readonly', readonly);
		target.data('fixed-margen-updated', false);
	}

	if (!target.data('fixed-margen') && !access._566 && margen_desde_compra && target.data('preset-margen') && target.data('preset-margen-value') != target.find('input[name="item[][margen_compra]"]').val() && !target.data('preset-margen-updated')) {
		target.data('preset-margen-updated', true);
		var readonly = target.find('input[name="item[][margen_compra]"]').prop('readonly');
		target.find('input[name="item[][margen_compra]"]').prop('readonly', false).val(target.data('preset-margen-value')).trigger('blur').prop('readonly', readonly);
		target.data('preset-margen-updated', false);
	}

	if (target.data('fixed-margen') && !margen_desde_compra && target.data('fixed-margen-value') != target.find('input[name="item[][margen_venta]"]').val() && !target.data('fixed-margen-updated')) {
		target.data('fixed-margen-updated', true);
		var readonly = target.find('input[name="item[][margen_venta]"]').prop('readonly');
		target.find('input[name="item[][margen_venta]"]').prop('readonly', false).val(target.data('fixed-margen-value')).trigger('blur').prop('readonly', readonly);
		target.data('fixed-margen-updated', false);
	}

	if (!target.data('fixed-margen') && !access._566 && !margen_desde_compra && target.data('preset-margen') && target.data('preset-margen-value') != target.find('input[name="item[][margen_venta]"]').val() && !target.data('preset-margen-updated')) {
		target.data('preset-margen-updated', true);
		var readonly = target.find('input[name="item[][margen_venta]"]').prop('readonly');
		target.find('input[name="item[][margen_venta]"]').prop('readonly', false).val(target.data('preset-margen-value')).trigger('blur').prop('readonly', readonly);
		target.data('preset-margen-updated', false);
	}

	// Mostrar subtotal venta distinto de cero en amarillo
	if (parseFloat(target.find('[name="item[][subtotal_precio]"]').val()) != 0) {
		target.find('[name="item[][subtotal_precio]"]').addClass('filled');
	} else {
		target.find('[name="item[][subtotal_precio]"]').removeClass('filled');
	}


	//if (!modoOffline) {
		if (target.data('first-load') !== true && target.data('no-update') === undefined) {
			updateSubtotalTitulos($(event.target));
			updateSubtotalItems();

			// Sección datos cinemágica
			//refreshCostosDirectos();
			//calcValoresCinemagica();
		}
	//}

	if (typeof formulario_cinemagica != 'undefined') {
		calcValoresCinemagica();
	}


};


//verificar cinemgica
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
			// guarda todos los items en business.item.docs(array de objectos)
			business.item.set(data);
			$('section.sheet').data('fetching', true);

			// Ver si se activa modo offline
			if (modoOfflineCantItems > 0 && data.rows.length >= modoOfflineCantItems && access._584) {
				if (!modoOfflineRemember) {
					var nombre = $('html > body.menu.home > aside > div > div > h1').text().split(' ')[0].capitalize();
					confirm("Hola " + nombre + ",<br><br>estás trabajando en una cotización que tiene más de " + modoOfflineCantItems.toString() + " ítems.<br><br>¿Deseas habilitar el modo offline para agilizar el proceso de cotizar?<br><br><label><input type=\"checkbox\" name=\"modo_offline_remember\"> No volver a preguntar durante esta sesión</label>", 'Sí', 'No').done(function(data) {
						if (data) {
							modoOffline = true;
							$('[data-name="offline_mode"]').addClass('active');
						}
						if ($('[name="modo_offline_remember"]').is(':checked')) {
							modoOfflineRemember = true;
							modoOfflineRememberGlobal = modoOffline;
						}
					});
				} else {
					$('[data-name="offline_mode"]').addClass('active');
					modoOffline = modoOfflineRememberGlobal;
				}
			}
			if (modoOffline) {
				$('[data-name="offline_mode"]').addClass('active');
			}

			// if (modoOfflineSiempre) {
			// 	$('[data-name="offline_mode"] button').prop('disabled', true);
			// }


			var current;

			current = $('<tbody>');

			var tituloAnterior;

			for (var i = 0; i < data.rows.length; i++) {
				var item = data.rows[i];

				var htmlObject, margen_compra, margen_venta;

				if (item.titulo) {
					if (typeof tituloAnterior != 'undefined'){
						updateSubtotalTitulos(tituloAnterior);
					//simon itemparent start
						updateSubtotalParents(tituloAnterior);
					
					//simon itemparent end
					}
					htmlObject = getElement.titulo('appendTo', current);
					htmlObject.uniqueId(); // Logs tiempo real
					tituloAnterior = htmlObject;
					if (typeof item.categoria != 'undefined')
						htmlObject.data('categoria', item.categoria.id);
					htmlObject.find('[name="item[][ocultar_print]"]').prop('checked', item.ocultar_print);
					htmlObject.find('[name="item[][mostrar_carta_cliente]"]').prop('checked', item.mostrar_carta_cliente);
					htmlObject.data('observacion', item.observacion);
				} else {
					htmlObject = getElement.item('appendTo', current);
					htmlObject.uniqueId(); // Logs tiempo real
					htmlObject.find('[name="item[][costo_unitario]"]').data('auto', false);
					if (typeof item.producto != 'undefined')
						htmlObject.data('producto', item.producto.id);

					htmlObject.data('first-load', true);

					htmlObject.find('[name="item[][codigo]"]').val(item.codigo);
					htmlObject.find('[name="item[][cantidad]"]').val(item.cantidad).data('old-value', item.cantidad);
					htmlObject.find('[name="item[][unidad]"]').val(item.unidad);
					htmlObject.find('[name="item[][factor]"]').val(item.factor).data('old-value', item.factor);

					htmlObject.find('[name="item[][precio_unitario]"]').val(item.precio.unitario / exchange_rate).data('old-value', item.precio.unitario / exchange_rate);

					if (item.porcentaje_monto_total == 0) {
						htmlObject.removeData('porcentaje-monto-total');
						delete(htmlObject[0].dataset.porcentajeMontoTotal);
						htmlObject.find('[name="item[][precio_unitario]"]').removeProp('readonly');
						htmlObject.find('[name="item[][costo_unitario]"]').removeProp('readonly');
					} else {
						htmlObject.data('porcentaje-monto-total', item.porcentaje_monto_total);
						htmlObject[0].dataset.porcentajeMontoTotal = item.porcentaje_monto_total;
						htmlObject.find('[name="item[][precio_unitario]"]').prop('readonly', true);
						htmlObject.find('[name="item[][costo_unitario]"]').prop('readonly', true);
					}

					// Fórmula productor ejecutivo
					if (item.formula_productor_ejecutivo) {
						htmlObject.data('formula-productor-ejecutivo', true);
						//verificar cinemgica
						htmlObject.data('formula-productor-ejecutivo-ratio', item.formula_productor_ejecutivo_ratio);
						htmlObject.find('[name="item[][precio_unitario]"]').prop('readonly', true);
						htmlObject.find('[name="item[][costo_unitario]"]').prop('readonly', true);
						// Bloquear nombre, tipo documento y cantidades
						htmlObject.find('[name="item[][nombre]"]').prop('readonly', true);
						htmlObject.find('button.show.item').invisible();
						//htmlObject.find('[name="item[][tipo_documento]"]').prop('readonly', true);
						//htmlObject.find('button.show.tipo-documento').hide();
						htmlObject.find('[name="item[][cantidad]"]').prop('readonly', true);
						htmlObject.find('[name="item[][factor]"]').prop('readonly', true);
					} else {
						htmlObject.removeData('formula-productor-ejecutivo');
						htmlObject.removeData('formula-productor-ejecutivo-ratio');
					}

					// Fórmula asistente producción
					if (item.formula_asistente_produccion) {
						htmlObject.data('formula-asistente-produccion', true);
						htmlObject.data('formula-productor-ejecutivo-ratio', item.formula_productor_ejecutivo_ratio);
						htmlObject.find('[name="item[][precio_unitario]"]').prop('readonly', true);
						htmlObject.find('[name="item[][costo_unitario]"]').prop('readonly', true);
						// Bloquear nombre, tipo documento y cantidades
						htmlObject.find('[name="item[][nombre]"]').prop('readonly', true);
						htmlObject.find('button.show.item').invisible();
						htmlObject.find('[name="item[][tipo_documento]"]').prop('readonly', true);
						htmlObject.find('button.show.tipo-documento').hide();
						htmlObject.find('[name="item[][cantidad]"]').prop('readonly', true);
						htmlObject.find('[name="item[][factor]"]').prop('readonly', true);
					} else {
						htmlObject.removeData('formula-asistente-produccion');
					}

					// Fórmula horas extras
					if (item.formula_horas_extras) {
						htmlObject.data('formula-horas-extras', true);
						htmlObject.find('[name="item[][precio_unitario]"]').prop('readonly', true);
						htmlObject.find('[name="item[][costo_unitario]"]').prop('readonly', true);
						// Bloquear nombre, tipo documento y cantidades
						htmlObject.find('[name="item[][nombre]"]').prop('readonly', true);
						htmlObject.find('button.show.item').invisible();
						htmlObject.find('[name="item[][tipo_documento]"]').prop('readonly', true);
						htmlObject.find('button.show.tipo-documento').hide();
					} else {
						htmlObject.removeData('formula-horas-extras');
					}

					if (item.director_internacional) {
						htmlObject.data('director-internacional', true);
					} else {
						htmlObject.removeData('director-internacional');
					}

					if (item.porcentaje_monto_total || item.formula_productor_ejecutivo || item.formula_asistente_produccion || item.formula_horas_extras) {
						htmlObject.find('.remove.item').remove();
						htmlObject.find('.insert.item').remove();
						htmlObject.find('.clone.item').remove();
						htmlObject.find('.ui-icon-arrow-4').remove();
					}

					// ocultar decimales en costo unitario
					htmlObject.find('[name="item[][costo_unitario]"]').val(item.costo.presupuestado.unitario / exchange_rate).data('old-value', item.costo.presupuestado.unitario / exchange_rate);

					if (typeof copiar_precio_a_costo == 'boolean' && item.precio.unitario == item.costo.presupuestado.unitario)
						htmlObject.find('[name="item[][costo_unitario]"]').data('auto', true);

					if (item.preset_margen) {
						htmlObject.data('preset-margen', true);
						htmlObject.data('preset-margen-value', item.preset_margen_value);
					    if (margen_desde_compra) {
					        htmlObject.find('[name="item[][margen_compra]"]').val(item.margen * 100.00);
					        htmlObject.find('[name="item[][margen_compra]"]').trigger('blur');
							if (!access._566)
					            htmlObject.find('[name="item[][margen_compra]"]').prop('readonly', true);
					    } else {
					        htmlObject.find('[name="item[][margen_venta]"]').val(item.margen * 100.00);
					        htmlObject.find('[name="item[][margen_venta]"]').trigger('blur');
							if (!access._566)
					            htmlObject.find('[name="item[][margen_venta]"]').prop('readonly', true);
					    }
					} else {
					    htmlObject.data('preset-margen', false);
					}

					htmlObject.find('[name="item[][aplica_sobrecargo]"]').prop('checked', item.aplica_sobrecargo);

					htmlObject.find('[name="item[][costo_interno]"]').prop('checked', item.costo.interno);

					htmlObject.find('[name="item[][ocultar_print]"]').prop('checked', item.ocultar_print);
					htmlObject.find('[name="item[][mostrar_carta_cliente]"]').prop('checked', item.mostrar_carta_cliente);

					htmlObject.data('observacion', item.observacion);
					htmlObject.data('comentario', item.comentario);

					if (!item.deletable){
						htmlObject.find('button.remove.item').invisible();

						// se agrego para que no se pueda cambiar el area neg al tener el items gastos, se oculta el boton (caso qec)
						if (integracion) {
							$('#main-container .sheet').find('button.show.area-negocio').hide();
						}

					}

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
						htmlObject.data('tipo-documento-valor-usd', item.tipo_documento.valor_usd); // Impuesto extranjero
						htmlObject.data('tipo-documento-inverse', item.tipo_documento.inverse);
						// Impuesto extranjero 0%
						//if (item.tipo_documento.ratio != 0) {
						if (item.tipo_documento.ratio != 0 || (item.tipo_documento.ratio == 0 && item.tipo_documento.valor_usd)) {
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
						htmlObject.removeData('tipo-documento-valor-usd'); // Impuesto extranjero
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

					htmlObject.data('closed-compras', item.closed_compras);

				}

				htmlObject.find('button.detail.item').prop('title', item.nombre);

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

				htmlObject.find('[name="item[][margen_compra]"]').prop('readonly', false);
				htmlObject.find('[name="item[][margen_venta]"]').prop('readonly', false);

				if (margen_desde_compra && item.preset_margen && !access._566)
					htmlObject.find('[name="item[][margen_compra]"]').prop('readonly', true);


				if (!margen_desde_compra && item.preset_margen && !access._566)
					htmlObject.find('[name="item[][margen_venta]"]').prop('readonly', true);

				htmlObject.data('preset-margen', item.preset_margen);
				htmlObject.data('preset-margen-value', item.preset_margen_value);

				htmlObject.data('id', item.id);
				htmlObject[0].dataset.id = item.id;
				htmlObject.data('index', item.index);
				htmlObject.find('input[name="item[][nombre]"]').val(item.nombre);
				htmlObject.find('input[name="item[][nombre]"]').data('nombre-original', item.text);
				
				var tooltip = ' \
					<p>Nombre ítem:</p> \
					<p>' + item.text + '</p> \
					<p>&nbsp;</p> \
					<p>Descripción larga:</p> \
					<p>' + ((item.observacion!= '')? item.observacion.replace(/\n/g, '</p><p>') : 'N/A') + '</p> \
					<p>&nbsp;</p>\
					<p>Observación interna:</p> \
					<p>' + ((item.comentario!= '')? item.comentario.replace(/\n/g, '</p><p>') : 'N/A') + '</p> \
				';
				htmlObject.find('button.profile.item').tooltipster('update', tooltip);
				//htmlObject.find('button.profile.item').data('tooltip', tooltip);

				// Mostrar signo de admiración (ui-icon-notice) si el ítem tiene comentario
	            // caso contrario mostrar ícono normal (ui-icon-gear)
	            if (item.comentario != '') {
	                htmlObject.find('button.profile.item').removeClass('ui-icon-gear').addClass('ui-icon-notice');
	            } else {
	                htmlObject.find('button.profile.item').removeClass('ui-icon-notice').addClass('ui-icon-gear');
	            }

				if (item.text != item.nombre)
					htmlObject.find('[name="item[][nombre]"]').addClass('edited');
				else
					htmlObject.find('[name="item[][nombre]"]').removeClass('edited');

				// Sección datos cinemágica
				htmlObject.data('costo-directo', item.costo_directo);
				htmlObject.data('costo-admin', item.costo_admin); // Fórmula productor ejecutivo


				// Mostrar subtotal venta distinto de cero en amarillo
				if (!item.titulo && parseFloat(htmlObject.find('[name="item[][subtotal_precio]"]').val()) != 0) {
					htmlObject.find('[name="item[][subtotal_precio]"]').addClass('filled');
				}

			}





			/*current.find('> *').each(function(key, item) {
				$(item).appendTo($('section.sheet table.items tbody'));
			});*/

			$('section.sheet table.items tbody').replaceWith(current);

			var items = $('section.sheet table.items > tbody > tr:not(.title)').length;
			$('section.sheet table.items > tfoot > tr .info:eq(0)').html(items + ' ítem' + ((items > 1)? 's' : ''));

			if (typeof tituloAnterior != 'undefined') {
				updateSubtotalTitulos(tituloAnterior);
				tituloAnterior = undefined;
			}

			updateSubtotalItems();

			unaBase.ui.unblock();

			if ($('section.sheet').data('index'))
				$('section.sheet table > thead button.toggle.all').triggerHandler('click');

			if (typeof callback != 'undefined')
				callback();

			updateVistaItems(true);

			$('section.sheet table.items > tbody > tr').each(function() {
				$(this).data('first-load', false);
			});

			$('section.sheet table.items > tfoot > tr > th.info').trigger('refresh');

			$('section.sheet').removeData('fetching');

			calcValoresCinemagica();

		},
		error: function() {
			toastr.error('No se pudieron mostrar los items de la cotización');
			// manejar esta situación
		}
	});

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
		'item[][cantidad]': parseFloat(target.find('[name="item[][cantidad]"]').data('old-value')),
		'item[][factor]': parseFloat(target.find('[name="item[][factor]"]').data('old-value')),
		'item[][horas_extras]': parseFloat(target.find('[name="item[][horas_extras]"]').val()),
		'item[][porcentaje_monto_total]': parseFloat(target.data('porcentaje-monto-total') * 100),
		'item[][formula_productor_ejecutivo]': target.data('formula-productor-ejecutivo'), // Fórmula productor ejecutivo
		'item[][formula_productor_ejecutivo_ratio]': target.data('formula-productor-ejecutivo-ratio'), // Fórmula productor ejecutivo
		'item[][formula_asistente_produccion]': target.data('formula-asistente-produccion'), // Fórmula asistente producción
		'item[][formula_horas_extras]': target.data('formula-horas-extras'), // Fórmula horas extras
		'item[][director_internacional]': target.data('director-internacional'),
		// Corrección cuando se ocultan decimales
		'item[][precio_unitario]': parseFloat((target.find('[name="item[][precio_unitario]"]').data('old-value'))? target.find('[name="item[][precio_unitario]"]').data('old-value') : target.find('[name="item[][precio_unitario]"]').val()),
		//'item[][precio_unitario]': parseFloat((target.find('[name="item[][precio_unitario]"]').data('old-value'))? target.find('[name="item[][precio_unitario]"]').data('old-value') : target.find('[name="item[][precio_unitario]"]').val()),
		'item[][subtotal_precio]': parseFloat(target.find('[name="item[][subtotal_precio]"]').val()),
		'item[][costo_unitario]': parseFloat((target.find('[name="item[][costo_unitario]"]').data('old-value'))? target.find('[name="item[][costo_unitario]"]').data('old-value') : target.find('[name="item[][costo_unitario]"]').val()),
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
		'item[][tipo_documento][valor_usd]': target.data('tipo-documento-valor-usd'), // Impuesto extranjero
		'item[][tipo_documento][inverse]': target.data('tipo-documento-inverse'),
		'item[][hora_extra][factor]': target.data('hora-extra-factor'),
		'item[][hora_extra][jornada]': target.data('hora-extra-jornada'),
		'item[][hora_extra][dias]': target.data('hora-extra-dias'),
		'item[][precio_unitario][base_imponible]': target.data('base-imponible'),
		'item[][cant_hh_asig]': target.data('costo-presupuestado-hh-cantidad'),
		'item[][costo_hh_unitario]': target.data('costo-presupuestado-hh-valor'),
		'item[][responsable_asig]': target.data('costo-presupuestado-hh-username'),
		'item[][preset_margen]': target.data('preset-margen'),
		'item[][preset_margen_value]': target.data('preset-margen-value')
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
						$(element).parentTo('tr').find('input[name="item[][cantidad]"]').val(1).data('old-value', 1);
						$(element).parentTo('tr').find('input[name="item[][factor]"]').val(1).data('old-value', 1);
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
					strict: true,
					addAllItems: true
				},
				dataType: 'json',
				success: function(data) {
					if (data.rows.length > 0) {
						for (var i = data.rows.length - 1; i >= 0; i--) {
							var item = data.rows[i];

							var htmlObject = getElement.item('insertAfter', title);

							htmlObject.data('producto', item.id);
							htmlObject.find('[name="item[][codigo]"]').val(item.index);
							htmlObject.find('[name="item[][unidad]"]').val(item.unidad);
							htmlObject.find('[name="item[][horas_extras]"]').val(0);

							if (item.porcentaje_monto_total == 0) {
								htmlObject.find('[name="item[][precio_unitario]"]').val(item.precio / exchange_rate).data('old-value', item.precio);
								htmlObject.find('[name="item[][subtotal_precio]"]').val(item.precio / exchange_rate);

								delete(htmlObject[0].dataset.porcentajeMontoTotal);
								htmlObject.removeData('porcentaje-monto-total');
								htmlObject.find('[name="item[][precio_unitario]"]').removeProp('readonly');
								htmlObject.find('[name="item[][costo_unitario]"]').removeProp('readonly');
							} else {
								htmlObject[0].dataset.porcentajeMontoTotal = item.porcentaje_monto_total;
								htmlObject.data('porcentaje-monto-total', item.porcentaje_monto_total);
								htmlObject.find('[name="item[][precio_unitario]"]').prop('readonly', true);
								htmlObject.find('[name="item[][costo_unitario]"]').prop('readonly', true);
							}

							// Fórmula productor ejecutivo
							if (item.formula_productor_ejecutivo) {
								htmlObject.data('formula-productor-ejecutivo', true);
								htmlObject.data('formula-productor-ejecutivo-ratio', item.formula_productor_ejecutivo_ratio);
								htmlObject.find('[name="item[][precio_unitario]"]').prop('readonly', true);
								htmlObject.find('[name="item[][costo_unitario]"]').prop('readonly', true);
								// Bloquear nombre, tipo documento y cantidades
								htmlObject.find('[name="item[][nombre]"]').prop('readonly', true);
								htmlObject.find('button.show.item').invisible();
								//htmlObject.find('[name="item[][tipo_documento]"]').prop('readonly', true);
								//htmlObject.find('button.show.tipo-documento').hide();
								htmlObject.find('[name="item[][cantidad]"]').prop('readonly', true);
								htmlObject.find('[name="item[][factor]"]').prop('readonly', true);
							} else {
								htmlObject.removeData('formula-productor-ejecutivo');
							}

							// Fórmula asistente producción
							if (item.formula_asistente_produccion) {
								htmlObject.data('formula-asistente-produccion', true);
								htmlObject.find('[name="item[][precio_unitario]"]').prop('readonly', true);
								htmlObject.find('[name="item[][costo_unitario]"]').prop('readonly', true);
								// Bloquear nombre, tipo documento y cantidades
								htmlObject.find('[name="item[][nombre]"]').prop('readonly', true);
								htmlObject.find('button.show.item').invisible();
								htmlObject.find('[name="item[][tipo_documento]"]').prop('readonly', true);
								htmlObject.find('button.show.tipo-documento').hide();
								htmlObject.find('[name="item[][cantidad]"]').prop('readonly', true);
								htmlObject.find('[name="item[][factor]"]').prop('readonly', true);
							} else {
								htmlObject.removeData('formula-asistente-produccion');
							}

							// Fórmula horas extras
							if (item.formula_horas_extras) {
								htmlObject.data('formula-horas-extras', true);
								htmlObject.find('[name="item[][precio_unitario]"]').prop('readonly', true);
								htmlObject.find('[name="item[][costo_unitario]"]').prop('readonly', true);
								// Bloquear nombre, tipo documento y cantidades
								htmlObject.find('[name="item[][nombre]"]').prop('readonly', true);
								htmlObject.find('button.show.item').invisible();
								htmlObject.find('[name="item[][tipo_documento]"]').prop('readonly', true);
								htmlObject.find('button.show.tipo-documento').hide();
							} else {
								htmlObject.removeData('formula-horas-extras');
							}

							if (item.director_internacional) {
								htmlObject.data('director-internacional', true);
							} else {
								htmlObject.removeData('director-internacional');
							}

							if (item.porcentaje_monto_total || item.formula_productor_ejecutivo || item.formula_asistente_produccion || item.formula_horas_extras) {
								htmlObject.find('.remove.item').remove();
								htmlObject.find('.insert.item').remove();
								htmlObject.find('.clone.item').remove();
								htmlObject.find('.ui-icon-arrow-4').remove();
							}

							if (item.margen != 0) {
							    htmlObject.data('preset-margen', true);
								htmlObject.data('preset-margen-value', item.margen * 100.00);
							    if (margen_desde_compra) {
							        htmlObject.find('[name="item[][margen_compra]"]').val(item.margen * 100.00);
							        htmlObject.find('[name="item[][margen_compra]"]').trigger('blur');
									if (!access._566)
							            htmlObject.find('[name="item[][margen_compra]"]').prop('readonly', true);
							    } else {
							        htmlObject.find('[name="item[][margen_venta]"]').val(item.margen * 100.00);
							        htmlObject.find('[name="item[][margen_venta]"]').trigger('blur');
									if (!access._566)
							            htmlObject.find('[name="item[][margen_venta]"]').prop('readonly', true);
							    }
							} else {
							    htmlObject.data('preset-margen', false);
							}

							htmlObject.find('[name="item[][aplica_sobrecargo]"]').prop('checked', item.aplica_sobrecargo);

							if (typeof copiar_precio_a_costo == 'boolean') {
								htmlObject.find('[name="item[][costo_unitario]"]').data('auto', true);
								if (item.costo == 0) {
									// ocultar decimales en costo unitario
									htmlObject.find('[name="item[][costo_unitario]"]').val(item.precio).data('old-value', item.precio);
									htmlObject.find('[name="item[][subtotal_costo]"]').val(item.precio);
								} else {
									// ocultar decimales en costo unitario
									htmlObject.find('[name="item[][costo_unitario]"]').val(item.costo).data('old-value', item.costo);
									htmlObject.find('[name="item[][subtotal_costo]"]').val(item.costo);
								}
							} else {
								// ocultar decimales en costo unitario
								htmlObject.find('[name="item[][costo_unitario]"]').val(item.costo).data('old-value', item.costo);
								htmlObject.find('[name="item[][subtotal_costo]"]').val(item.costo);
							}

							htmlObject.find('[name="item[][nombre]"]').data('nombre-original', item.text);
							htmlObject.find('[name="item[][nombre]"]').val(item.text);

							var tooltip = ' \
								<p>Nombre ítem:</p> \
								<p>' + item.text + '</p> \
								<p>&nbsp;</p> \
								<p>Descripción larga:</p> \
								<p>' + ((item.observacion!= '')? item.observacion.replace(/\n/g, '</p><p>') : 'N/A') + '</p> \
							';
							htmlObject.find('button.profile.item').tooltipster('update', tooltip);
							//htmlObject.find('button.profile.item').data('tooltip', tooltip);


							var subtotal_precio = item.precio;
							var subtotal_costo = item.costo;

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
								htmlObject.data('tipo-documento-valor-usd', item.tipo_documento.valor_usd);
								htmlObject.data('tipo-documento-inverse', item.tipo_documento.inverse);
								htmlObject.find('[name="tipo_documento"]').val(item.tipo_documento.abbr);
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
								htmlObject.removeData('tipo-documento-valor-usd');
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



// Sección datos cinemágica
/* var blockTotales = $('article.block-totales'); */
var blockCinemagica = $('article.block-cinemagica');


var calcValoresCinemagica = function(event) {

	if ($('section.sheet').data('fetching')) {
		return false;
	}

	// Llenado de objeto con datos del formulario
	var data = {
		rows: []
	};
	$('table.items.cotizacion tbody').find('tr').each(function(key, item) {
		var item_tmp = $(item);

		var cantidad = item_tmp.find('input[name="item[][cantidad]"]').length > 0? parseFloat(item_tmp.find('input[name="item[][cantidad]"]').data('old-value')) : undefined;
		var factor = item_tmp.find('input[name="item[][factor]"]').length > 0? parseFloat(item_tmp.find('input[name="item[][factor]"]').data('old-value')) : undefined;
		var precio_unitario = item_tmp.find('input[name="item[][precio_unitario]"]').length > 0? parseFloat(item_tmp.find('input[name="item[][precio_unitario]"]').val()) : undefined;
		var subtotal_precio = item_tmp.find('input[name="item[][subtotal_precio]"]').length > 0? parseFloat(item_tmp.find('input[name="item[][subtotal_precio]"]').val()) : undefined;

		var row = {
			id: item_tmp.data('id'),
			titulo: typeof item_tmp.data('categoria') !== 'undefined',
			nombre: item_tmp.find('[name="item[][nombre]"]').val(),
			porcentaje_monto_total: item_tmp.data('porcentaje-monto-total'),
			formula_productor_ejecutivo: item_tmp.data('formula-productor-ejecutivo'),
			formula_productor_ejecutivo_ratio: item_tmp.data('formula-productor-ejecutivo-ratio'),
			formula_asistente_produccion: item_tmp.data('formula-asistente-produccion'),
			formula_horas_extras: item_tmp.data('formula-horas-extras'),
			costo_directo: item_tmp.data('costo-directo'),
			cantidad,
			factor,
			hora_extra: {
				enabled: item_tmp.data('hora-extra-enabled'),
				jornada: item_tmp.data('hora-extra-jornada'),
				base_imponible : item_tmp.data('base-imponible')
			},
			precio: {
				unitario: precio_unitario,
				subtotal: subtotal_precio
			},
			tipo_documento: {
				id: item_tmp.data('tipo-documento'),
				abbr: item_tmp.data('tipo-documento-abbr'),
				text: item_tmp.data('tipo-documento-text'),
				ratio: item_tmp.data('tipo-documento-ratio'),
				valor_usd: item_tmp.data('tipo-documento-valor-usd'),
				inverse: item_tmp.data('tipo-documento-inverse')
			}
		};
		data.rows.push(row);
	});

	// Terminar si no hay ítems
	if (data.rows.length === 0) {

		var retval = {
			rows: data.rows,
			extra: {
				subtotal_items: 0,
				valor_pelicula: 0,
				costos_independientes_total: 0,
				costos_dependientes_total: 0,
				costos_directos: 0,
				utilidad_bruta: {
					porcentaje: 0,
					monto: 0
				},
				costos_fijos: {
					monto: 0
				},
				utilidad_neta: 0,
				comision_pe: 0,
				director: {
					monto: 0
				},
				compania: 0,
				comision_agencia: {
					monto: 0
				},
				total_neto: 0
			}
		};

		fillValoresCinemagica(data, retval);

		console.log('calcValoresCinemagica returned false: empty list.');
		return false;
	}

	// Calcular horas extras
	var horas_extras_jornada = 0;
	var horas_extras_proyecto = 0;
	for (var index = 0, len = data.rows.length; index < len; index++) {
		var item = data.rows[index];
		if (!item.titulo && item.costo_directo) {
			if (item.hora_extra.enabled) {
				if (item.hora_extra.jornada) {
					horas_extras_jornada+= item.precio.subtotal;
				} else {
					horas_extras_proyecto+= item.precio.subtotal;
				}
			}
		}
	}

	// Obtener días filmación
	var dias_filmacion = parseFloat($('#main-container').find('[name="dato[5][valor]"]').val());
	if (isNaN(dias_filmacion)) {
		dias_filmacion = 1;
	} else {
		if (dias_filmacion == 0) {
			dias_filmacion = 1;
		}
	}

	// Fórmula de horas extras
	var subtotal_horas_extras = 1.5 * horas_extras_jornada / dias_filmacion / 10 + 1.5 * horas_extras_proyecto / 10 / 10;
	console.log('Suma items jornada: ', horas_extras_jornada);
	console.log('Suma items proyecto: ', horas_extras_proyecto);
	console.log('Subtotal horas extras: ', subtotal_horas_extras);

	// Buscar nodo de horas extras y asignar monto calculado
	var index = totales.utilities.fastArrayObjectSearch(data.rows, 'formula_horas_extras', true);
	if (index !== -1) {
		var factor_horas_extras = (1 + data.rows[index].tipo_documento.ratio);
		var item = data.rows[index];
		data.rows[index].precio.unitario = subtotal_horas_extras * factor_horas_extras;
		data.rows[index].precio.subtotal = subtotal_horas_extras * item.cantidad * item.factor * factor_horas_extras;
		data.rows[index].hora_extra.base_imponible = subtotal_horas_extras * item.cantidad * item.factor * factor_horas_extras;
	}

	// Cálculo costos independientes del total
	var costos_independientes_total = 0;
	for (var index = 0, len = data.rows.length; index < len; index++) {
		var item = data.rows[index];
		if (!item.titulo && !item.formula_productor_ejecutivo && !item.formula_asistente_produccion && !item.porcentaje_monto_total) {
			costos_independientes_total+= item.precio.unitario * item.cantidad * item.factor;
		}
	}

	// Cálculo costos directos
	var costos_directos = 0;
	for (var index = 0, len = data.rows.length; index < len; index++) {
		var item = data.rows[index];
		if (!item.titulo && item.costo_directo) {
			costos_directos+= item.precio.subtotal;
		}
	}

	// Obtener valor película
	var valor_pelicula = parseFloat(blockCinemagica.find('[name="sobrecargo[1][subtotal]"]').val());

	// Obtener porcentaje comisión agencia
	var porcentaje_comision_agencia = parseFloat(blockCinemagica.find('[name="sobrecargo[6][porcentaje]"]').val());

	// Cálculo total neto
	var total_neto = valor_pelicula / (1 - porcentaje_comision_agencia / 100);

	// Buscar ítems con porcentaje de monto total y asignar monto calculado (gastos máxima y otros)
	var gastos_maxima = 0;
	var gastos_maxima_indice = '';
	var indices = totales.utilities.multiArrayObjectSearch(data.rows, 'porcentaje_monto_total', 0, true);
	for (var index = 0, len = indices.length; index < len; index++) {
		var current_index = indices[index];
		var item = data.rows[current_index];
		var monto_calculado = total_neto * item.porcentaje_monto_total; // porcentaje_monto_total [0,1]
		data.rows[current_index].precio.unitario = monto_calculado;
		data.rows[current_index].precio.subtotal = monto_calculado * item.cantidad * item.factor;
		if ((data.rows[current_index].nombre.toUpperCase() === "GASTOS MÁXIMA") || (data.rows[current_index].nombre.toUpperCase() === "GASTOS ADMINISTRACION") || (data.rows[current_index].nombre.toUpperCase() === "COSTO FINANCIERO")){
				gastos_maxima += data.rows[current_index].precio.subtotal;
				gastos_maxima_indice = data.rows[current_index].nombre.toUpperCase();
				;
			}
	}

	// Buscar ítems con fórmula productor ejecutivo y asignar monto calculado
	var comision_productor = 0.15; // (15%)
	var productor_ejecutivo = 0;
	//var index = totales.utilities.fastArrayObjectSearch(data.rows, 'formula_productor_ejecutivo', true);
	var indexes = totales.utilities.multiArrayObjectSearch(data.rows, 'formula_productor_ejecutivo', true);
	//if (index !== -1) {
	if (indexes.length > 0) {
		for (var i = 0, len = indexes.length; i < len; i++) {
			var index = indexes[i];
			var item = data.rows[index];
			if (data.rows[index].formula_productor_ejecutivo_ratio) {
				comision_productor = data.rows[index].formula_productor_ejecutivo_ratio / 100.00;
			}
			let id = document.querySelector('section.sheet').dataset.id

			let username = document.querySelector('section.sheet').dataset.username

			
				if(vIDOrigen==32158 || vIDOrigen==34259 || vIDOrigen==34234 || gastos_maxima_indice == "GASTOS ADMINISTRACION" || gastos_maxima_indice == "COSTO FINANCIERO"){
								productor_ejecutivo = (valor_pelicula - costos_directos - gastos_maxima ) * comision_productor;

				}else{

								productor_ejecutivo = (valor_pelicula - costos_directos - gastos_maxima) * comision_productor * valor_pelicula / (total_neto + valor_pelicula * comision_productor);
	
				}


			data.rows[index].precio.unitario = productor_ejecutivo;
			data.rows[index].precio.subtotal = productor_ejecutivo * item.cantidad * item.factor;
		}
	}

	// Buscar ítems con fórmula asistente producción y asignar monto calculado
	var comision_asistente = 0.01; // ( 1%)
	var asistente_produccion = 0;
	//var index = totales.utilities.fastArrayObjectSearch(data.rows, 'formula_asistente_produccion', true);
	var indexes = totales.utilities.multiArrayObjectSearch(data.rows, 'formula_asistente_produccion', true);
	//if (index !== -1) {
	if (indexes.length > 0) {


		for (var i = 0, len = indexes.length; i < len; i++) {
			var index = indexes[i];
			var item = data.rows[index];
			if (item.cantidad === 0 || item.factor === 0) {
				asistente_produccion = 0;
			} else {
				if (item.formula_productor_ejecutivo_ratio>0) {
				
				comision_asistente = item.formula_productor_ejecutivo_ratio / 100.00;

				}




				//asistente_produccion = ( (valor_pelicula > 200000000)? 200000000 * comision_asistente : valor_pelicula * comision_asistente ) / (item.cantidad * item.factor);

				asistente_produccion = ( valor_pelicula * comision_asistente ) / (item.cantidad * item.factor);
			}
			data.rows[index].precio.unitario = asistente_produccion;
			data.rows[index].precio.subtotal = asistente_produccion * item.cantidad * item.factor;
		}
	}

	// Cálculo costos dependientes del total
	var costos_dependientes_total = 0;
	for (var index = 0, len = data.rows.length; index < len; index++) {
		var item = data.rows[index];
		if (!item.titulo && (item.formula_productor_ejecutivo || item.formula_asistente_produccion || item.porcentaje_monto_total)) {
			costos_dependientes_total+= item.precio.unitario * item.cantidad * item.factor;
		}
	}

	// Cálculo subtotal ítems
	var subtotal_items = costos_independientes_total + costos_dependientes_total;
	// Cálculo utilidad bruta
	var utilidad_bruta = valor_pelicula - subtotal_items;

	// Cálculo porcentaje utilidad bruta
	var porcentaje_utilidad_bruta = (utilidad_bruta / valor_pelicula) * 100;

	// Cálculo costos fijos
	var porcentaje_costos_fijos = parseFloat(blockCinemagica.find('[name="sobrecargo[4][porcentaje]"]').val());
	// var costos_fijos = total_neto * (porcentaje_costos_fijos / 100);
	var costos_fijos = valor_pelicula * (porcentaje_costos_fijos / 100);

	// Cálculo utilidad neta
	var utilidad_neta = utilidad_bruta - costos_fijos;

	// Cálculo utilidad neta

	var comision_pe = utilidad_neta * (15 / 100);


	// Cálculo director y compañía
	var porcentaje_director = parseFloat(blockCinemagica.find('[name="cotizacion[cinemagica][director][porcentaje]"]').val());
	var director = utilidad_neta * (porcentaje_director / 100);
	var compania = utilidad_neta - director;

	// Cálculo comisión agencia
	var comision_agencia = total_neto - valor_pelicula;


	var retval = {
		rows: data.rows,
		extra: {
			subtotal_items,
			valor_pelicula,
			costos_independientes_total,
			costos_dependientes_total,
			costos_directos,
			utilidad_bruta: {
				porcentaje: porcentaje_utilidad_bruta,
				monto: utilidad_bruta
			},
			costos_fijos: {
				porcentaje: porcentaje_costos_fijos,
				monto: costos_fijos
			},
			utilidad_neta,
			comision_pe,
			director: {
				porcentaje: porcentaje_director,
				monto: director
			},
			compania,
			comision_agencia: {
				porcentaje: porcentaje_comision_agencia,
				monto: comision_agencia
			},
			total_neto
		}
	};

	fillValoresCinemagica(data, retval);

};

var fillValoresCinemagica = function(data, retval) {
	// Llenado del formulario con valores calculados

	var current = $('table.items.cotizacion tbody').find('tr').first();
	for (var index = 0, len = data.rows.length; index < len; index++) {
		var item = data.rows[index];

		if (!item.titulo && (item.formula_productor_ejecutivo || item.formula_asistente_produccion || item.formula_horas_extras || item.porcentaje_monto_total)) {
			current.find('input[name="item[][cantidad]"]').val(item.cantidad).data('old-value', item.cantidad);
			current.find('input[name="item[][factor]"]').val(item.factor).data('old-value', item.factor);
			current.find('input[name="item[][precio_unitario]"]').val(item.precio.unitario).data('old-value', item.precio.unitario);
			current.find('input[name="item[][subtotal_precio]"]').val(item.precio.subtotal).data('old-value', item.precio.subtotal);
			// Actualiza gasto P
			current.find('input[name="item[][costo_unitario]"]').val(item.precio.unitario).data('old-value', item.precio.unitario);
			current.find('input[name="item[][subtotal_costo]"]').val(item.precio.subtotal).data('old-value', item.precio.subtotal);

			current.data('base-imponible', item.hora_extra.base_imponible);

			updateSubtotalTitulos(current);
		}

		current = current.next();

	}

	blockCinemagica.find('[name="sobrecargo[1][porcentaje]"]').val(retval.extra.utilidad_bruta.porcentaje);
	blockCinemagica.find('[name="sobrecargo[1][valor]"]').val(retval.extra.utilidad_bruta.monto);
	blockCinemagica.find('[name="sobrecargo[1][subtotal]"]').val(retval.extra.valor_pelicula);

	blockCinemagica.find('[name="cotizacion[cinemagica][costos_directos]"]').val(retval.extra.costos_directos);

	var exchange_rate_usd = (valor_usd_cotizacion > 0)? valor_usd_cotizacion : valor_usd;
	var valor_pelicula_usd = retval.extra.valor_pelicula / exchange_rate_usd;
	blockCinemagica.find('[name="sobrecargo[1][subtotal][usd]"]').val(valor_pelicula_usd);

	blockCinemagica.find('[name="sobrecargo[4][valor]"]').val(retval.extra.costos_fijos.monto);

	blockCinemagica.find('[name="sobrecargo[6][valor]"]').val(retval.extra.comision_agencia.monto);

	blockCinemagica.find('[name="cotizacion[cinemagica][utilidad_neta]"]').val(retval.extra.utilidad_neta);
	blockCinemagica.find('[name="cotizacion[cinemagica][comision_pe]"]').val(retval.extra.comision_pe);

	blockCinemagica.find('[name="cotizacion[cinemagica][director][valor]"]').val(retval.extra.director.monto);
	blockCinemagica.find('[name="cotizacion[cinemagica][compania][valor]"]').val(retval.extra.compania);

	blockCinemagica.find('[name="cotizacion[ajuste]"]').val(retval.extra.total_neto);
	var impuesto = 0;
	if (blockCinemagica.find('[name="cotizacion[montos][impuesto][exento]"]').is(':checked')) {
		blockCinemagica.find('[name="cotizacion[montos][impuesto]"]').val(0);
	} else {
		var porcentaje_impuesto = parseFloat(blockCinemagica.find('[name="cotizacion[montos][impuesto]"]').data('porcentaje'));
		var impuesto = retval.extra.total_neto * porcentaje_impuesto / 100;
		blockCinemagica.find('[name="cotizacion[montos][impuesto]"]').val(impuesto);
	}
	blockCinemagica.find('[name="cotizacion[montos][total]"]').val(retval.extra.total_neto + impuesto);

	// Actualizar costos y utilidades
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

	var descuento = 0;

	if (typeof selected_currency == 'undefined') {
		var utilidad_total = (utilidad_items + utilidad_sobrecargos - descuento).toFixed(currency.decimals);
		var costo_total = (costo_items + costo_sobrecargos).toFixed(currency.decimals);
	} else {
		var utilidad_total = (utilidad_items + utilidad_sobrecargos - descuento).toFixed(2);
		var costo_total = (costo_items + costo_sobrecargos).toFixed(2);
	}

	$('input[name="cotizacion[montos][utilidad]"]').val(utilidad_total);
	$('input[name="cotizacion[montos][costo]"]').val(costo_total);
	$('span[name="cotizacion[montos][utilidad]"]').text(utilidad_total.replace('.',','));
	$('span[name="cotizacion[montos][costo]"]').text(costo_total.replace('.',','));
	if (typeof selected_currency == 'undefined') {
		$('span[name="cotizacion[montos][utilidad]"]').number(true, currency.decimals, ',', '.');
		$('span[name="cotizacion[montos][costo]"]').number(true, currency.decimals, ',', '.');
	} else {
		$('span[name="cotizacion[montos][utilidad]"]').number(true, 2, ',', '.');
		$('span[name="cotizacion[montos][costo]"]').number(true, 2, ',', '.');
	}

	var subtotal_neto = parseFloat($('input[name="cotizacion[ajuste]"]').val());

	//$('input[name="cotizacion[montos][utilidad_ratio]"]').val(utilidad_total / subtotal_neto * 100);
	//$('input[name="cotizacion[montos][costo_ratio]"]').val(costo_total / subtotal_neto * 100);
	var utilidad_ratio = 0;
	var costo_ratio = 0;
	if (margenCompraResumenes) {
	    if (margen_desde_compra_inverso) {
	        utilidad_ratio = (1 - utilidad_total / subtotal_neto) * 100;
	        costo_ratio = (1 - costo_total / subtotal_neto) * 100;
	    } else {
			utilidad_ratio = utilidad_total / costo_total * 100;
	        costo_ratio = 100 - utilidad_ratio;
	    }
	} else {
	    utilidad_ratio = utilidad_total / subtotal_neto * 100;
	    costo_ratio = costo_total / subtotal_neto * 100;
	}
	$('input[name="cotizacion[montos][utilidad_ratio]"]').val(utilidad_ratio);
	$('input[name="cotizacion[montos][costo_ratio]"]').val(costo_ratio);

	if ($('input[name="cotizacion[montos][utilidad_ratio]"]').length > 0)
		$('span[name="cotizacion[montos][utilidad_ratio]"]').text($('input[name="cotizacion[montos][utilidad_ratio]"]').val().replace('.', ','));
	if ($('input[name="cotizacion[montos][costo_ratio]"]').length > 0)
		$('span[name="cotizacion[montos][costo_ratio]"]').text($('input[name="cotizacion[montos][costo_ratio]"]').val().replace('.', ','));


	updateSubtotalItems(true);
	updateVistaItems(true);

	console.log(retval);

};
