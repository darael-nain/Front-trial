var getElement = {
	titulo: function(functor, element) {
		console.warn('functionCot common');
		let addSubCategoria = '<button class="ui-icon ui-icon-circle-arrow-s add parent" title="Añadir subcategoría"></button>';
		let htmlObject = $(' \
			<tr class="title" data-categoria="0"> \
				<th><span class="ui-icon ui-icon-arrow-4" title="Arrastrar para mover" style="cursor: move;"></span><button class="ui-icon ui-icon-minus remove categoria" title="Quitar categoría"></button>	<button class="ui-icon ui-icon-circle-plus add categoria" title="Agregar categoría debajo" data-help="Haga clic en este botón para añadir un ítem a la categoría creada"></button> \
					<button class="ui-icon ui-icon-plus add item" title="Insertar ítem bajo el título"></button> \
				 <button class="ui-icon ui-icon-copy clone categoria" title="Duplicar categoría"></button>\
				 </th> \
				<th> \
					<button class="ui-icon ui-icon-folder-open toggle categoria" title="Contraer o expandir título"></button> \
					'+((access._647)? addSubCategoria : '' )+'\
				</th> \
				<th style="white-space:nowrap;"><input style="' + (!showCodigoItems? 'width: calc(100% - 40px);margin-left: -10px;' : '') + '" name="item[][nombre]" type="search" value="" placeholder="Buscar categoría por nombre..."><button class="ui-icon ui-icon-plus add all-items"><!-- <button class="show categoria">Ver categorías</button> --><button class="ui-icon ui-icon-document detail categoria" title="Detalle">Detalle</button><button class="ui-icon ui-icon-gear profile categoria" title="Perfil">Perfil</button></th> \
				<th style="' + (!v3_show_tipodoc_items? 'display:none;' : '') + '" class="tipo-documento"></th> \
				<th class="info"></th> \
				<th style="' + (!showUnidad? 'display:none;' : '') + '" class="unidad"></th> \
				<th class="segunda-cantidad"></th> \
				<th class="horas-extras numeric qty abs"><input class="number" name="item[][horas_extras]" value=""></th> \
				<th class="venta"></th> \
				<th class="numeric currency venta">' + localCurrency + ' <span><input readonly name="item[][subtotal_precio]" type="text" value="0"></span> <span class="info"></span></th> \
				<th class="costo unitario"></th> \
				<th class="numeric currency costo">' + localCurrency + ' <span><input readonly name="item[][subtotal_costo]" type="text" value="0"></span></th> \
				<th class="numeric currency utilidad">' + localCurrency + ' <span><input readonly name="item[][utilidad]" type="text" value="0"></span></th> \
				<th class="numeric percent margen-desde-venta margen"><span><input name="item[][margen_venta]" type="text" value="0"> %</span></th> \
				<th class="numeric percent margen-desde-compra margen"><span><input name="item[][margen_compra]" type="text" value="0"> %</span></th> \
				<th colspan="2"></th> \
				<th colspan="1" class="ocultar-print"><input name="item[][ocultar_print]" type="checkbox" value="true"></th> \
				<th colspan="1" class="ocultar-print"><input name="item[][mostrar_carta_cliente]" type="checkbox" value="true"></th> \
			</tr> \
		');

		if (!v3_sobrecargos_cinemagica) {
			htmlObject.find('[name="item[][mostrar_carta_cliente]"]').closest('th').remove();
		}

		htmlObject.find('input.number').number(true, 1, ',', ''); // Quitar flecha de campos tipo number

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
				let dragSource = $(event.target).nextUntil('.title');
				let width = dragSource.width();
				let height = dragSource.height()

				dragSource.addClass('moving-src');
				updateSubtotalTitulos($(event.target));
				//simon itemparent start

				if(target[0] && !target[0].classList.contains('title')){
					updateSubtotalParents($(event.target));
				}
				//simon itemparent end
				// FIXME: el helper no responde a cambios en el width
				ui.helper.width(width);
				ui.helper.height(height);
				$(event.target).trigger('beforeMove'); // Logs tiempo real
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
				$(itemReceiver).after(ui.draggable);
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
					if(typeof parentKey  !== 'undefined'){
						let items = document.querySelectorAll(`tr[data-itemparent="${parentKey}"`);

						for(const item of items){
							$(item).insertAfter(itemToMove)
						}
					}else{
						console.log('no parent parentKey')
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
					<span class="ui-icon ui-icon-arrow-4" title="Arrastrar para mover" style="cursor: move;"></span><button class="ui-icon ui-icon-minus remove itemParent" title="Quitar categoría"></button> \
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
						
						let dragTarget = $(event.target).nextUntil('.title,.item,.itemParent');
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
		// let addSubCategoria = '<button class="ui-icon  ui-icon-circle-arrow-e parent item" title="convertir a subcategoría"></button>';
		let htmlObject = $(' \
			<tr class="item" data-producto="0"> \
				<td class="' + (!showCodigoItems? 'counter ' : '') + '"><span class="ui-icon ui-icon-arrow-4" title="Arrastrar para mover" style="cursor: move;"></span><button class="ui-icon ui-icon-minus remove item" title="Quitar ítem"></button> <button class="ui-icon ui-icon-plus insert item" title="Agregar ítem debajo"></button> <button class="ui-icon ui-icon-copy clone item" title="Duplicar ítem"></button></td> \
				<td style="' + (!showCodigoItems? 'display: inline;' : '') + '" class="numeric code' + (!showCodigoItems? ' no-counter ' : '') + '"><input name="item[][codigo]" type="text"' + ((editCodigoItems)? '' : ' readonly') + '></td> \
				<td><input style="' + (!showCodigoItems? 'width: calc(100% + 20px);margin-left: -70px;' : '') + '" name="item[][nombre]" type="search" placeholder="Buscar producto o servicio por código o por nombre..."><button class="ui-icon ui-icon-carat-1-s show item">Ver ítems</button><button class="ui-icon ui-icon-document detail item" title="Detalle">Detalle</button><button class="ui-icon ui-icon-gear profile item" title="Perfil"></button></td> \
				<td style="' + (!v3_show_tipodoc_items? 'display:none;' : '') + '" class="tipo-documento"><input type="text" disabled name="item[][tipo_documento]"><button class="ui-icon ui-icon-carat-1-s show tipo-documento">Ver tipos de documento</button></td> \
				<td class="numeric qty"><input class="number" name="item[][cantidad]" type="text" value="1"> <span class="unit"></span></td> \
				<td style="' + (!showUnidad? 'display:none;' : '') + '" class="unidad"><input type="text" disabled name="item[][unidad]"><button class="ui-icon ui-icon-carat-1-s show unidad">Ver unidades</button></td> \
				<td class="segunda-cantidad numeric qty abs"><input class="number xx" name="item[][factor]" value="1"></td> \
				<td class="horas-extras numeric qty abs"><input class="number" name="item[][horas_extras]" value="0"></td> \
				<td class="numeric currency venta extended">' + localCurrency + ' <span><input name="item[][precio_unitario]" type="text" value="0"></span> <button class="ui-icon ui-icon-notice detail price" title="Ver detalle del precio">Ver detalle del precio</button></td> \
				<td class="numeric currency venta">' + localCurrency + ' <span><input readonly name="item[][subtotal_precio]" type="text" value="0"></span> <button class="ui-icon ui-icon-calculator detail exchange-rate" title="Ver en otras monedas">Ver en otras monedas</button></td> \
				<td class="numeric currency costo unitario">' + localCurrency + ' <span><input' + ((access._557)? ' readonly' : '' ) + ' name="item[][costo_unitario]" type="text" value="0"></span></td> \
				<td class="numeric currency costo">' + localCurrency + ' <span><input' + ((subtotal_gasto_p_manual)? '' : ' readonly' ) + ' name="item[][subtotal_costo]" type="text" value="0"></span> <button class="ui-icon ui-icon-notice detail cost" title="Ver detalle del costo">Ver detalle del costo</button></td> \
				<td class="numeric currency utilidad">' + localCurrency + ' <span><input readonly name="item[][utilidad]" type="text" value="0"></span></td> \
				<td class="numeric percent margen-desde-venta margen"><span><input name="item[][margen_venta]" type="text" value="0"> %</span></td> \
				<td class="numeric percent margen-desde-compra margen"><span><input name="item[][margen_compra]" type="text" value="0"> %</span></td> \
				<td class="fit aplica-sobrecargo"><input name="item[][aplica_sobrecargo]" type="checkbox" value="true"' + (aplica_sobrecargo_items? ' checked' : '') + '></td> \
				<td class="fit costo-interno"><input name="item[][costo_interno]" type="checkbox" value="true"></td> \
				<td class="fit ocultar-print"><input name="item[][ocultar_print]" type="checkbox" value="true"></td> \
				<td class="fit ocultar-print"><input name="item[][mostrar_carta_cliente]" type="checkbox" value="true"></td> \
			</tr> \
		');

		if (!v3_sobrecargos_cinemagica) {
			htmlObject.find('[name="item[][mostrar_carta_cliente]"]').closest('td').remove();
		}

		htmlObject.find('input.number').number(true, 1, ',', ''); // Quitar flecha de campos tipo number

		htmlObject.find('[name="item[][cantidad]"]').data('old-value', 1);
		htmlObject.find('[name="item[][factor]"]').data('old-value', 1);

		htmlObject[functor](element);

		htmlObject.find('[name="item[][horas_extras]"]').parentTo('td').invisible();
		htmlObject.find('button.detail.price').invisible();
		htmlObject.find('button.detail.cost').invisible();
		htmlObject.find('[name="item[][costo_unitario]"]').data('auto', true);

		//simon itemparent start
		
		if(element.hasClass('itemParent') || element.hasClass('childItem')){
			htmlObject.find('.parent.item').remove();
		}
		//simon itemparent end
		if (margen_desde_compra)
			htmlObject.find('[name="item[][margen_compra]"]').invisible();
		else
			htmlObject.find('[name="item[][margen_venta]"]').invisible();

		if (typeof selected_currency == 'undefined') {
			htmlObject.find('.numeric.currency input:not([name="item[][precio_unitario]"]):not([name="item[][costo_unitario]"])').number(true, currency.decimals, ',', '.');
			// ocultar decimales en precio unitario
			htmlObject.find('.numeric.currency input[name="item[][precio_unitario]"]').number(true, 0, ',', '.');		
			// ocultar decimales en costo unitario
			htmlObject.find('.numeric.currency input[name="item[][costo_unitario]"]').number(true, currency.decimals, ',', '.');

		} else {
			// ocultar decimales en precio unitario
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
			htmlObject.find('.numeric.currency input:not([name="item[][precio_unitario]"]):not([name="item[][costo_unitario]"])').number(true, decimals, ',', '.');
			htmlObject.find('.numeric.currency input[name="item[][precio_unitario]"]').number(true, decimals, ',', '.');
			htmlObject.find('.numeric.currency input[name="item[][costo_unitario]"]').number(true, decimals, ',', '.');
		}

		htmlObject.find('.numeric.percent input').number(true, 2, ',', '.');

		htmlObject.draggable({
			helper: 'clone',
			containment: 'tbody',
			start: function(event, ui) {
				dragSource = $(event.target);
				$(event.target).invisible();
				updateSubtotalTitulos($(event.target));
				//simon itemparent start

				updateSubtotalParents($(event.target));
			
				//simon itemparent end
				ui.helper.width($(event.target).width());
				ui.helper.height($(event.target).height());
				$(event.target).trigger('beforeMove'); // Logs tiempo real
			},
			stop: function(event, ui) {
				$(event.target).visible();
				//simon itemparent start

				updateSubtotalParents($(event.target));
			
				//simon itemparent end
				updateSubtotalTitulos($(event.target));
			}
		});

		htmlObject.droppable({
			hoverClass: 'ui-state-active',
			accept: 'table.items > tbody > tr:not(.title)',
			drop: function(event, ui) {
				let itemToMove = ui.draggable;
				let itemReceiver = event.target;	
				if(!itemToMove.hasClass('itemParent')){
					if ($(itemReceiver).prevTo('tr.title').find('.ui-icon-folder-collapsed'))
						$(itemReceiver).prevTo('tr.title').find('.ui-icon-folder-collapsed').triggerHandler('click');
					$(itemReceiver).after(itemToMove);
					$(itemToMove).trigger('afterMove'); // Logs tiempo real
					//setTimeout(updateIndexes, 2000);

					//simon itemparent start

					if(itemToMove[0].classList.contains('childItem') && !itemReceiver.classList.contains('childItem') && !itemReceiver.classList.contains('itemParent')  ){
						itemToMove[0].classList.remove('childItem');
						itemToMove[0].dataset.itemparent = "";
					}else if (itemToMove[0].classList.contains('itemParent')){
						let parentKey = itemToMove.data('id');
						let items = document.querySelectorAll(`tr[data-itemparent="${parentKey}"`);
						for(const item of items){
							$(item).insertAfter(itemToMove)
						}
						
					}

					//simon itemparent end
					//simon itemparent start
					if(itemReceiver.classList.contains('childItem') && itemReceiver.dataset.itemparent !== ""){
						itemToMove[0].classList.add('childItem');
						itemToMove[0].classList.remove('item');
						itemToMove[0].dataset.itemparent = itemReceiver.dataset.itemparent;
						itemToMove.find('.parent.item').hide();
					}else if(itemReceiver.classList.contains('item')){
						itemToMove[0].classList.add('item');
						itemToMove[0].classList.remove('childItem');
						itemToMove[0].dataset.itemparent = '';
						itemToMove.find('.parent.item').show();
					}
					//simon itemparent end
					
				}else if(itemToMove.hasClass('itemParent')){
					
					let dragTarget = $(itemReceiver).nextUntil('.title,.item,.itemParent');
					$(itemReceiver).after(itemToMove);
					if (itemToMove.hasClass('title')) {
						dragTarget.addClass('moving-dst');
						itemToMove.insertAfter($(itemReceiver));
						$('.moving-src').removeClass('moving-src').insertAfter(itemToMove);
						$('.moving-dst').removeClass('moving-dst').insertAfter($(itemReceiver));

					} else {
						itemToMove.insertAfter(dragTarget.last());
					}
					$(itemToMove).trigger('afterMove'); // Logs tiempo real

					//simon itemparent start

					if(itemToMove[0].classList.contains('childItem')){
						itemToMove[0].classList.remove('childItem');
						itemToMove[0].classList.add('item');
						itemToMove[0].dataset.itemparent = "";
					}else if (itemToMove[0].classList.contains('itemParent')){
						let parentKey = itemToMove.data('id');
						let items = document.querySelectorAll(`tr[data-itemparent="${parentKey}"`);
						for(const item of items){
							$(item).insertAfter(itemToMove)
						}

					}
				}

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