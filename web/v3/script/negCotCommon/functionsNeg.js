



var getElement = {
	titulo: function(functor, element) {
		
		console.warn('functionNeg common');
		let addSubCategoria = '<button class="ui-icon ui-icon-circle-arrow-s add parent" title="Añadir subcategoría"></button>';
		let htmlObject = $(' \
			<tr class="title" data-categoria="0"> \
				<th><span class="ui-icon ui-icon-arrow-4" title="Arrastrar para mover" style="cursor: move;"></span><button class="ui-icon ui-icon-minus remove categoria" title="Quitar categoría"></button></th> \
				<th class="toggleTh"> \
					<button class="ui-icon ui-icon-folder-open toggle categoria" title="Contraer o expandir título"></button> \
					'+((access._647)? addSubCategoria : '' )+'\
					<button class="ui-icon ui-icon-circle-plus add categoria" title="Agregar categoría debajo" data-help="Haga clic en este botón para añadir un ítem a la categoría creada"></button> \
					<button class="ui-icon ui-icon-plus add item" title="Insertar ítem bajo el título"></button> \
				</th> \
				<th><input name="item[][nombre]" type="search" value="" placeholder="Buscar categoría por nombre..."><button class="ui-icon ui-icon-plus add all-items"><!-- <button class="show categoria">Ver categorías</button> --><button class="ui-icon ui-icon-document detail categoria" title="Detalle">Detalle</button></th> \
				<th style="' + (!v3_show_tipodoc_items? 'display:none;' : '') + '" class="tipo-documento"></th> \
				<th class="info"></th> \
				<th style="' + (!showUnidad? 'display:none;' : '') + '" class="unidad"></th> \
				<th class="segunda-cantidad"></th> \
				<th class="horas-extras numeric qty abs"><input name="item[][horas_extras]" type="number" min="0" max="9999" value=""></th> \
				<th class="venta"></th> \
				<th class="numeric currency venta">' + currency.symbol + ' <span><input readonly name="item[][subtotal_precio]" type="text" value="0"></span> <span class="info"></span></th> \
				<th class="costo"></th> \
				<th class="numeric currency costo presupuestado">' + currency.symbol + ' <span><input readonly name="item[][subtotal_costo]" type="text" value="0"></span></th> \
				<th class="numeric currency utilidad presupuestado">' + currency.symbol + ' <span><input readonly name="item[][utilidad]" type="text" value="0"></span></th> \
				<th class="numeric percent margen-desde-venta margen presupuestado"><span><input readonly name="item[][margen_venta]" type="text" value="0"> %</span></th> \
				<th class="numeric percent margen-desde-compra margen presupuestado"><span><input readonly name="item[][margen_compra]" type="text" value="0"> %</span></th> \
				<th class="numeric currency costo real adquisicion">' + currency.symbol + ' <span><input readonly name="item[][subtotal_costo_real]"></span></th> \
				<th class="numeric currency utilidad real adquisicion">' + currency.symbol + ' <span><input readonly name="item[][utilidad_real]"></span></th> \
				<th class="numeric percent margen-desde-venta margen real adquisicion"><span><input readonly name="item[][margen_venta_real]"> %</span></th> \
				<th class="numeric percent margen-desde-compra margen real adquisicion"><span><input readonly name="item[][margen_compra_real]"> %</span></th> \
				<th class="numeric currency adquisicion">' + currency.symbol + ' <span><input readonly name="item[][diferencia]"></span></th> \
				<th class="numeric percent adquisicion"><span><input readonly name="item[][diferencia_ratio]"> %</span></th> \
				<th colspan="2"></th> \
				<th colspan="1" class="ocultar-print"><input name="item[][ocultar_print]" type="checkbox" value="true"></th> \
				<th colspan="1" class="ocultar-print"><input name="item[][mostrar_carta_cliente]" type="checkbox" value="true"></th> \
			</tr> \
		');

		htmlObject[functor](element);

		if (typeof selected_currency == 'undefined')
			htmlObject.find('.numeric.currency input').number(true, currency.decimals, ',', '.');
		else
			htmlObject.find('.numeric.currency input').number(true, 2, ',', '.');
		htmlObject.find('.numeric.percent input').number(true, 2, ',', '.');



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
				
				let itemToMove = ui.draggable;
				let itemReceiver = event.target;
				let dragTarget = $(itemReceiver).nextUntil('.title');
				$(itemReceiver).after(itemToMove);
				if (itemToMove.hasClass('title')) {
					dragTarget.addClass('moving-dst');
					itemToMove.insertAfter($(itemReceiver));
					$('.moving-src').removeClass('moving-src').insertAfter(itemToMove);
					$('.moving-dst').removeClass('moving-dst').insertAfter($(itemReceiver));

				} else {
					itemToMove.insertAfter($(itemReceiver));
				}
				$(itemToMove).trigger('afterMove'); // Logs tiempo real

			
				//simon itemparent start

				if(itemToMove[0].classList.contains('childItem')){
					itemToMove[0].classList.remove('childItem');
					itemToMove[0].classList.add('item');
					itemToMove[0].dataset.itemparent = "";
				}else if (itemToMove[0].classList.contains('itemParent')){
					let parentKey = itemToMove.data('id');
					let parentId = itemToMove[0].id;
					
					if(typeof parentKey  !== 'undefined'){
						let items = document.querySelectorAll(`tr[data-itemparent="${parentKey}"`);

						for(const item of items){
							$(item).insertAfter(itemToMove)
						}
					}else if(typeof parentId  !== 'undefined'){
						let items = document.querySelectorAll(`tr[data-parentId="${parentId}"`);
						for(const item of items){
							$(item).insertAfter(itemToMove)
						}

					}

				}

				//simon itemparent end
			}
		});

		return htmlObject;
	},
	itemParent: function(functor, element) {
		let htmlObject = $(' \
			<tr class="itemParent" data-producto="0" data-categoria="0"> \
				<td style="min-widtd: 90px !important;"> \
					<span class="ui-icon ui-icon-arrow-4" title="Arrastrar para mover" style="cursor: move;"></span><button class="ui-icon ui-icon-minus remove itemParent categoria" title="Quitar categoría"></button> \
					<button class="ui-icon ui-icon-plus add item" title="Insertar ítem bajo el título"></button> \
					<button class="ui-icon ui-icon-copy clone categoria" title="Duplicar categoría"></button> \
				<td><button class="ui-icon ui-icon-folder-open toggle categoria" title="Contraer o expandir título"></button></td> \
				<td style="min-widtd: 150px;"><input name="item[][nombre]" type="search" value="" placeholder="Buscar categoría por nombre..."><button class="ui-icon ui-icon-plus add all-items"><!-- <button class="show categoria">Ver categorías</button> --><button class="ui-icon ui-icon-document detail categoria" title="Detalle">Detalle</button></td> \
				<td class="tipo-documento"></td> \
				<td class="info"></td> \
				<td style="' + (!showUnidad? 'display:none;' : '') + '" class="unidad"></td> \
				<td class="segunda-cantidad"></td> \
				<td class="horas-extras numeric qty abs"><input name="item[][horas_extras]" class="number" min="0" max="9999" value=""></td> \
				<td class="venta"></td> \
				<td class="numeric currency venta">' + localCurrency + ' <span><input readonly name="item[][subtotal_precio]" type="text" value="0"></span> <span class="info" style="display: none !important;"></span></td> \
				<td class="costo previo unitario"></td> \
				<td class="numeric currency costo previo presupuestado">' + localCurrency + ' <span><input readonly name="item[][subtotal_costo_previo]" type="text" value="0"></span></td> \
				<td class="numeric currency utilidad previo presupuestado">' + localCurrency + ' <span><input readonly name="item[][diferencia_costo_previo]" type="text" value="0"></span></td> \
				<td class="costo unitario"></td> \
				<td class="numeric currency costo presupuestado">' + localCurrency + ' <span><input readonly name="item[][subtotal_costo]" type="text" value="0"></span></td> \
				<td class="numeric currency utilidad presupuestado">' + localCurrency + ' <span><input readonly name="item[][utilidad]" type="text" value="0"></span></td> \
				<td class="numeric percent margen-desde-venta margen presupuestado"><span><input name="item[][margen_venta]" type="text" value="0"> %</span></td> \
				<td class="numeric percent margen-desde-compra margen presupuestado"><span><input name="item[][margen_compra]" type="text" value="0"> %</span></td> \
				<td class="numeric currency costo real adquisicion">' + localCurrency + ' <span><input readonly name="item[][subtotal_costo_real]"></span></td> \
				<td class="numeric currency utilidad real adquisicion">' + localCurrency + ' <span><input readonly name="item[][utilidad_real]"></span></td> \
				<td class="numeric percent margen-desde-venta margen real adquisicion"><span><input readonly name="item[][margen_venta_real]"> %</span></td> \
				<td class="numeric percent margen-desde-compra margen real adquisicion"><span><input readonly name="item[][margen_compra_real]"> %</span></td> \
				<td class="numeric currency adquisicion eficiencia">' + localCurrency + ' <span><input readonly name="item[][diferencia]"></span></td> \
				<td class="numeric percent adquisicion eficiencia"><span><input readonly name="item[][diferencia_ratio]"> %</span></td> \
				<td colspan="1"></td> \
				<td></td> \
				<td class="ocultar-print"><input name="item[][ocultar_print]" type="checkbox" value="true"></td> \
				<td><input name="item[][selected]" type="checkbox" value="true"></td> \
			</tr> \
		');

		htmlObject.find('input.number').number(true, 1, ',', ''); // Quitar flecha de campos tipo number

		let target = $(event.target).parentTo('tr');

		if ($(event.target).prop('name') == 'item[][nombre]')
			target.find('button.detail.item').prop('itemParent', target.find('[name="item[][nombre]"]').val());
			
			htmlObject[functor](element);

			if (typeof selected_currency == 'undefined')
				htmlObject.find('.numeric.currency input').number(true, currency.decimals, ',', '.');
			else
				htmlObject.find('.numeric.currency input').number(true, 2, ',', '.');
			htmlObject.find('.numeric.percent input').number(true, 2, ',', '.');

			htmlObject.draggable({
				helper: 'clone',
				containment: 'tbody',
				start: function(event, ui) {
					// 
					let dragSource = $(event.target).nextUntil('.itemParent, .title');
					let width = dragSource.width();
					let height = dragSource.height()

					dragSource.addClass('moving-src');
					updateSubtotalTitulos($(event.target));

					//simon itemparent start
					// updateSubtotalParents($(event.target));
					//simon itemparent end
					// FIXME: el helper no responde a cambios en el width
					ui.helper.width(width);
					ui.helper.height(height);
					$(event.target).trigger('beforeMove'); // Logs tiempo real
				},
				stop: function(event, ui) {
					updateSubtotalTitulos($(event.target));

					//simon itemparent start

					updateSubtotalParents($(event.target));
				
					//simon itemparent end
				},
				revert: function(event, ui) {
					$('.moving-src').removeClass('moving-src');
				}
			});

			htmlObject.droppable({
				hoverClass: 'ui-state-active',
				accept: 'table.items > tbody > tr',
				drop: function(event, ui) {
					if(!ui.draggable.hasClass('title') && !ui.draggable.hasClass('itemParent')){
						
						let dragTarget = $(event.target).nextUntil('.itemParent, .title');
						
							$(event.target).after(ui.draggable);
							
						if (ui.draggable.hasClass('itemParent') ) {
							dragTarget.addClass('moving-dst');
							ui.draggable.insertAfter($(event.target));
							$('.moving-src').removeClass('moving-src').insertAfter(ui.draggable);
							$('.moving-dst').removeClass('moving-dst').insertAfter($(event.target));

						} else {
							ui.draggable.insertAfter($(event.target));
						}
						$(ui.draggable).trigger('afterMove'); // Logs tiempo real
						
						//simon itemparent start
						if(event.target.classList.contains('itemParent') ){
							ui.draggable[0].classList.add('childItem');
							ui.draggable[0].classList.remove('item');
							ui.draggable[0].dataset.itemparent = $(event.target).data('id')
							ui.draggable.find('.parent.item').hide();
						}
						//simon itemparent end
					}else if(ui.draggable.hasClass('itemParent')){
						
						
						
						let dragTarget = null;
						if (itemReceiver.classList.contains('itemParent')) {
							let idSubCat = `#${event.target.id}`;
							 dragTarget = $(idSubCat).nextUntil('.itemParent');
						}else{
							 dragTarget = $(event.target).nextUntil('.title,.item,.itemParent');

						}
						$(event.target).after(ui.draggable);
						if (ui.draggable.hasClass('title')) {
							dragTarget.addClass('moving-dst');
							ui.draggable.insertAfter($(event.target));
							$('.moving-src').removeClass('moving-src').insertAfter(ui.draggable);
							$('.moving-dst').removeClass('moving-dst').insertAfter($(event.target));

						} else {
							ui.draggable.insertAfter(dragTarget.last());
						}
						$(ui.draggable).trigger('afterMove'); // Logs tiempo real

						//simon itemparent start

						if(ui.draggable[0].classList.contains('childItem')){
							ui.draggable[0].classList.remove('childItem');
							ui.draggable[0].classList.add('item');
							ui.draggable[0].dataset.itemparent = "";
						}else if (ui.draggable[0].classList.contains('itemParent')){
							let parentKey = ui.draggable.data('id');
							let items = document.querySelectorAll(`tr[data-itemparent="${parentKey}"`);
							for(const item of items){
								$(item).insertAfter(ui.draggable)
							}

						}
					}
				}
			});

			return htmlObject;
	},
	item: function(functor, element) {
		
		let addSubCategoria = '<button class="ui-icon  ui-icon-circle-arrow-e parent item" title="convertir a subcategoría"></button>';
		let htmlObject = $(' \
			<tr data-producto="0"> \
				<td><span class="ui-icon ui-icon-arrow-4" title="Arrastrar para mover" style="cursor: move;"></span><button class="ui-icon ui-icon-minus remove item" title="Quitar ítem"></button> <button class="ui-icon ui-icon-plus insert item" title="Agregar ítem debajo"></button> <button class="ui-icon ui-icon-copy clone item" title="Duplicar ítem"></button></td> \
				<td class="numeric code" width="100%"><input name="item[][codigo]" type="text" readonly size="70"></td> \
				<td><input name="item[][nombre]" type="search" placeholder="xBuscar producto o servicio por código o por nombre..."><button class="ui-icon ui-icon-document detail item" title="Detalle">Detalle</button><button class="ui-icon ui-icon-gear profile item" title="Perfil"></button></td> \
				<td style="' + (!v3_show_tipodoc_items? 'display:none;' : '') + '" class="tipo-documento"><input type="text" disabled name="item[][tipo_documento]"><button class="ui-icon ui-icon-carat-1-s show tipo-documento">Ver tipos de documento</button></td> \
				<td class="numeric qty"><input name="item[][cantidad]" type="number" value="1" min="1" max="9999"> <span class="unit"></span></td> \
				<td style="' + (!showUnidad? 'display:none;' : '') + '" class="unidad"><input type="text" disabled name="item[][unidad]"><button class="ui-icon ui-icon-carat-1-s show unidad">Ver unidades</button></td> \
				<td class="segunda-cantidad numeric qty abs"><input ' + ((access._595)? ' readonly' : '' ) + '  name="item[][factor]" type="number" value="1" min="1" max="9999"></td> \
				<td class="horas-extras numeric qty abs"><input name="item[][horas_extras]" type="number" value="0" min="0" max="9999"></td> \
				<td class="numeric currency venta extended">' + currency.symbol + ' <span><input name="item[][precio_unitario]" type="text" value="0"></span> <button class="ui-icon ui-icon-notice detail price" title="Ver detalle del precio">Ver detalle del precio</button></td> \
				<td class="numeric currency venta">' + currency.symbol + ' <span><input readonly name="item[][subtotal_precio]" type="text" value="0"></span> <button class="ui-icon ui-icon-calculator detail exchange-rate" title="Ver en otras monedas">Ver en otras monedas</button></td> \
				<td class="numeric currency costo presupuestado">' + currency.symbol + ' <span><input class="zaa" ' + ((access._595)? ' readonly' : '' ) + '  name="item[][costo_unitario]" type="text" text="0" max="9999999999" value="0"></span></td> \
				<td class="numeric currency costo presupuestado">' + currency.symbol + ' <span><input readonly name="item[][subtotal_costo]" type="text" value="0"></span> <button class="ui-icon ui-icon-notice detail cost" title="Ver detalle del costo">Ver detalle del costo</button></td> \
				<td class="numeric currency utilidad presupuestado">' + currency.symbol + ' <span><input readonly name="item[][utilidad]" type="text" value="0"></span></td> \
				<td class="numeric percent margen-desde-venta margen presupuestado"><span><input name="item[][margen_venta]" type="text" value="0"> %</span></td> \
				<td class="numeric percent margen-desde-compra margen presupuestado"><span><input name="item[][margen_compra]" type="text" value="0"> %</span></td> \
				<td class="numeric currency costo real adquisicion">' + currency.symbol + ' <span><input readonly name="item[][subtotal_costo_real]"></span> <button class="ui-icon ui-icon-notice detail cost-real" title="Ver detalle del costo">Ver detalle del costo</button> <div name="item[][closed_compras]" class="ui-icon ui-icon-locked" style="display:inline-block;vertical-align:middle;margin-left:-20px"></div></td> \
				<td class="numeric currency utilidad real adquisicion">' + currency.symbol + ' <span><input readonly name="item[][utilidad_real]"></span></td> \
				<td class="numeric percent margen-desde-venta margen real adquisicion"><span><input readonly name="item[][margen_venta_real]"> %</span></td> \
				<td class="numeric percent margen-desde-compra margen real adquisicion"><span><input readonly name="item[][margen_compra_real]"> %</span></td> \
				<td class="numeric currency adquisicion">' + currency.symbol + ' <span><input readonly name="item[][diferencia]"></span></td> \
				<td class="numeric percent adquisicion"><span><input readonly name="item[][diferencia_ratio]"> %</span></td> \
				<td class="fit aplica-sobrecargo"><input name="item[][aplica_sobrecargo]" type="checkbox" value="true"' + (aplica_sobrecargo_items? ' checked' : '') + '></td> \
				<td class="fit costo-interno"><input name="item[][costo_interno]" type="checkbox" value="true"></td> \
			</tr> \
		');

		htmlObject.find('input.number').number(true, 1, ',', ''); // Quitar flecha de campos tipo number

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
			accept: 'table.items > tbody > tr:not(.itemParent)',
			drop: function(event, ui) {
				if ($(event.target).prevTo('tr.itemParent').find('.ui-icon-folder-collapsed'))
					$(event.target).prevTo('tr.itemParent').find('.ui-icon-folder-collapsed').triggerHandler('click');
				$(event.target).after(ui.draggable);
			}
		});


		htmlObject.find('button.profile.item').tooltipster({
			delay: 0,
			interactiveAutoClose: false,
			contentAsHTML: true
		});

		return htmlObject;
	}
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

var afterEditEmpresa2 = function(element) {
	var target = $(element).parentTo('ul');

	target.find('input[name="cotizacion[empresa2][id]"]')
		.attr('type', 'search')
		.autocomplete('enable');
	target.find('input[name="cotizacion[empresa2][id]"]').attr('placeholder', 'Buscar por alias, RUT, razón social...');

	target.find('input[name="cotizacion[empresa2][razon_social]"]').attr('readonly', true);

	target.find('input[name="cotizacion[empresa2][id]"]').focus();
	target.find('button.empresa2.edit').hide();

	if ($('input[name="cotizacion[empresa2][id]"]').val() != '' || $('input[name="cotizacion[empresa][razon_social]"]').val() != '')
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
		target.find('button.unlock.contacto, button.show.contacto, button.profile.contacto').show();
};

var afterEditContacto2 = function(element) {
	var target = $(element).parentTo('ul');
	target.find('input[name="cotizacion[empresa2][contacto][id]"]')
		.attr('type', 'search')
		.autocomplete('enable');
	target.find('input[name="cotizacion[empresa2][contacto][id]"]').attr('placeholder', 'Buscar por Nombre y/o Apellidos');
	target.find('input[name="cotizacion[empresa2][contacto][cargo]"], input[name="cotizacion[empresa2][contacto][email]"]')
		.attr('readonly', true);
	target.find('input[name="empresa[contacto2][id]"]').focus();
	target.find('button.contacto2.edit').hide();
		target.find('button.unlock.contacto2, button.show.contacto2, button.profile.contacto2').show();
};


//simon itemparent start
var updateSubtotalParents = function(element) {
	
	if(!calculoSubcategoria){

		//console.warn('update parents')
		let target;
		if (element.prop('tagName') == 'TR') {
			if (element.hasClass('itemParent') || element.hasClass('title'))
				target = element;
			else
				target = element.prevTo('.itemParent, .title');
		} else
			target = element.parentTo('tr').prevTo('.itemParent, .title');

	// if(!element[0].classList.contains('title') && !element[0].classList.contains('item')){
		
		
	if(!target[0].classList.contains('title') && !target[0].classList.contains('item') ){
		let subtotal_precios = 0;
		let subtotal_costos = 0;
		let subtotal_costos_previo = 0;
		let subtotal_diferencias_previo = 0;
		let subtotal_costos_real = 0;
		let subtotal_utilidades = 0;
		let subtotal_utilidades_real = 0;
		let subtotal_diferencias = 0;

		let current = target.next();

		if (!current.hasClass('itemParent') && !current.hasClass('title') && current.hasClass('childItem') && current.length > 0) {

			do {

				if (current.css('visibility') != 'hidden' && !current.hasClass('ui-draggable-dragging')) {
					subtotal_precios+= parseFloat(current.find('[name="item[][subtotal_precio]"]').val());
					subtotal_costos+= parseFloat(current.find('[name="item[][subtotal_costo]"]').val());
					subtotal_costos_previo+= parseFloat(current.find('[name="item[][subtotal_costo_previo]"]').val());
					subtotal_diferencias_previo+= parseFloat(current.find('[name="item[][diferencia_costo_previo]"]').val());
					subtotal_costos_real+= parseFloat(current.find('[name="item[][subtotal_costo_real]"]').val());
					subtotal_utilidades+= parseFloat(current.find('[name="item[][utilidad]"]').val());
					subtotal_utilidades_real+= parseFloat(current.find('[name="item[][utilidad_real]"]').val());
					subtotal_diferencias+= parseFloat(current.find('[name="item[][diferencia]"]').val());
				}

				current = current.next();

			} while(!current.hasClass('itemParent') && !current.hasClass('title') && current.hasClass('childItem') && current.length > 0);

		}

		
		target.find('input[name="item[][subtotal_precio]"]').val(subtotal_precios);
		target.find('input[name="item[][subtotal_costo]"]').val(subtotal_costos);
		target.find('input[name="item[][subtotal_costo_previo]"]').val(subtotal_costos_previo);
		target.find('input[name="item[][diferencia_costo_previo]"]').val(subtotal_diferencias_previo);
		target.find('input[name="item[][subtotal_costo_real]"]').val(subtotal_costos_real);
		target.find('input[name="item[][utilidad]"]').val(subtotal_utilidades);
		target.find('input[name="item[][utilidad_real]"]').val(subtotal_utilidades_real);
		target.find('input[name="item[][diferencia]"]').val(subtotal_diferencias);


		if (margen_desde_compra_inverso)
			var subtotal_margen_compra = ((1 - subtotal_costos / subtotal_precios) * 100).toFixed(2);
		else
			var subtotal_margen_compra = ((subtotal_precios - subtotal_costos) / subtotal_costos * 100).toFixed(2);

		var subtotal_margen_venta = ((subtotal_precios - subtotal_costos) / subtotal_precios * 100).toFixed(2);

		if (margen_desde_compra_inverso)
			var subtotal_margen_compra_real = ((1 - subtotal_costos_real / subtotal_precios) * 100).toFixed(2);
		else
			// var subtotal_margen_compra_real = ((subtotal_precios - subtotal_costos_real) / subtotal_costos_real * 100).toFixed(2);
			var subtotal_margen_compra_real = ((subtotal_precios - subtotal_costos_real) / subtotal_precios * 100).toFixed(2);

		var subtotal_margen_venta_real = ((subtotal_precios - subtotal_costos_real) / subtotal_precios * 100).toFixed(2);

		target.find('input[name="item[][margen_venta]"]').val(subtotal_margen_venta);
		target.find('input[name="item[][margen_compra]"]').val(subtotal_margen_compra);
		target.find('input[name="item[][margen_venta_real]"]').val(subtotal_margen_venta_real);
		target.find('input[name="item[][margen_compra_real]"]').val(subtotal_margen_compra_real);

		var subtotal_diferencia_ratio = (subtotal_diferencias / subtotal_costos * 100).toFixed(2);

		target.find('input[name="item[][diferencia_ratio]"]').val(subtotal_diferencia_ratio);

		if (!isFinite(subtotal_margen_venta))
			target.find('input[name="item[][margen_venta]"]').invisible();
		else
			target.find('input[name="item[][margen_venta]"]').visible();

		if (!isFinite(subtotal_margen_venta_real))
			target.find('input[name="item[][margen_venta_real]"]').invisible();
		else
			target.find('input[name="item[][margen_venta_real]"]').visible();

		if (!isFinite(subtotal_margen_compra))
			target.find('input[name="item[][margen_compra]"]').invisible();
		else
			target.find('input[name="item[][margen_compra]"]').visible();

		if (!isFinite(subtotal_margen_compra_real))
			target.find('input[name="item[][margen_compra_real]"]').invisible();
		else
			target.find('input[name="item[][margen_compra_real]"]').visible();


	// 	console.warn({
	// 		subtotal_precios,
	// subtotal_costos,
	// subtotal_costos_previo,
	// subtotal_diferencias_previo,
	// subtotal_costos_real,
	// subtotal_utilidades,
	// subtotal_utilidades_real,
	// subtotal_diferencias})


	}
	}
	
};







	