// corregido con cinemagica
var getElement = {
	titulo: function(functor, element) {
		var htmlObject = $(' \
			<tr class="title" data-categoria="0"> \
				<th><span class="ui-icon ui-icon-arrow-4" title="Arrastrar para mover" style="cursor: move;"></span><button class="ui-icon ui-icon-minus remove categoria" title="Quitar categoría"></button></th> \
				<th> \
					<button class="ui-icon ui-icon-folder-open toggle categoria" title="Contraer o expandir título"></button> \
					<button class="ui-icon ui-icon-circle-plus add categoria" title="Agregar categoría debajo" data-help="Haga clic en este botón para añadir un ítem a la categoría creada"></button> \
					<button class="ui-icon ui-icon-plus add item" title="Insertar ítem bajo el título"></button> \
				</th> \
				<th><input name="item[][nombre]" type="search" value="" placeholder="Buscar categoría por nombre..."><button class="ui-icon ui-icon-plus add all-items"><!-- <button class="show categoria">Ver categorías</button> --><button class="ui-icon ui-icon-document detail categoria" title="Detalle">Detalle</button></th> \
				<th class="info"></th> \
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
		
		let addSubCategoria = '<button class="ui-icon  ui-icon-circle-arrow-e parent item" title="convertir a subcategoría"></button>';
		let htmlObject = $(' \
			<tr data-producto="0"> \
				<td><span class="ui-icon ui-icon-arrow-4" title="Arrastrar para mover" style="cursor: move;"></span><button class="ui-icon ui-icon-minus remove item" title="Quitar ítem"></button> <button class="ui-icon ui-icon-plus insert item" title="Agregar ítem debajo"></button> <button class="ui-icon ui-icon-copy clone item" title="Duplicar ítem"></button>'+((access._647)? addSubCategoria : '' )+'</td> \
				<td class="numeric code"><input name="item[][codigo]" type="text" readonly/></td> \
				<td><input  name="item[][nombre]" type="search" placeholder="Buscar producto o servicio por código o por nombre..."/><button class="ui-icon ui-icon-document detail item" title="Detalle">Detalle</button><button class="ui-icon ui-icon-gear profile item" title="Perfil"></button></td> \
				<td class="numeric qty"><input name="item[][cantidad]" type="number" value="1" min="1" max="9999"/> <span class="unit"></span></td> \
				<td class="segunda-cantidad numeric qty abs"><input name="item[][factor]" type="number" value="1" min="1" max="9999"></td> \
				<td class="horas-extras numeric qty abs"><input name="item[][horas_extras]" type="number" value="0" min="0" max="9999"></td> \
				<td class="numeric currency venta extended">' + currency.symbol + ' <span><input name="item[][precio_unitario]" type="text" value="0"/></span> <button class="ui-icon ui-icon-notice detail price" title="Ver detalle del precio">Ver detalle del precio</button></td> \
				<td class="numeric currency venta">' + currency.symbol + ' <span><input readonly name="item[][subtotal_precio]" type="text" value="0"/></span> <button class="ui-icon ui-icon-calculator detail exchange-rate" ></button></td> \
				<td class="numeric currency costo presupuestado">' + currency.symbol + ' <span><input name="item[][costo_unitario]" type="text" text="0" max="9999999999" value="0"/></span></td> \
				<td class="numeric currency costo presupuestado">' + currency.symbol + ' <span><input readonly name="item[][subtotal_costo]" type="text" value="0"/></span> <button class="ui-icon ui-icon-notice detail cost" title="Ver detalle del costo">Ver detalle del costo</button></td> \
				<td class="numeric currency utilidad presupuestado">' + currency.symbol + ' <span><input readonly name="item[][utilidad]" type="text" value="0"/></span></td> \
				<td class="numeric percent margen-desde-venta margen presupuestado"><span><input name="item[][margen_venta]" type="text" value="0"/> %</span></td> \
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
			interactiveAutoClose: false,
			contentAsHTML: true
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
			fields['item[' + k + '][utilidad]'] = (parseFloat($(item).find('[name="item[][utilidad]"]').val()) * exchange_rate).toString().replace(/\./g, ',');
			fields['item[' + k + '][margen_compra]'] = parseFloat($(item).find('[name="item[][margen_compra]"]').val());
			fields['item[' + k + '][margen_venta]'] = parseFloat($(item).find('[name="item[][margen_venta]"]').val());

		} else if ($(item).hasClass('itemParent')) {
			parent = $(item).data('id');

			//negocios/script/library/content.js
		

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
			fields['item[' + k + '][cantidad]'] = parseFloat($(item).find('[name="item[][cantidad]"]').data('old-value'));
			fields['item[' + k + '][factor]'] = parseFloat($(item).find('[name="item[][factor]"]').data('old-value'));
			fields['item[' + k + '][horas_extras]'] = parseFloat($(item).find('[name="item[][horas_extras]"]').val());
			fields['item[' + k + '][porcentaje_monto_total]'] = parseFloat($(item).data('porcentaje-monto-total') * 100).toString().replace(/\./g, ',');
			fields['item[' + k + '][formula_productor_ejecutivo]'] = $(item).data('formula-productor-ejecutivo'); // Fórmula productor ejecutivo
			fields['item[' + k + '][formula_productor_ejecutivo_ratio]'] = $(item).data('formula-productor-ejecutivo-ratio'); // Fórmula productor ejecutivo
			fields['item[' + k + '][formula_asistente_produccion]'] = $(item).data('formula-asistente-produccion'); // Fórmula asistente producción
			fields['item[' + k + '][formula_horas_extras]'] = $(item).data('formula-horas-extras'); // Fórmula horas extras
			fields['item[' + k + '][director_internacional]'] = $(item).data('director-internacional');
			fields['item[' + k + '][precio_unitario]'] = (parseFloat(($(item).find('[name="item[][precio_unitario]"]').data('old-value'))? $(item).find('[name="item[][precio_unitario]"]').data('old-value') : $(item).find('[name="item[][precio_unitario]"]').val()) * exchange_rate).toString().replace(/\./g, ',');
			fields['item[' + k + '][subtotal_precio]'] = (parseFloat($(item).find('[name="item[][subtotal_precio]"]').val()) * exchange_rate).toString().replace(/\./g, ',');
			fields['item[' + k + '][costo_unitario]'] = (parseFloat(($(item).find('[name="item[][costo_unitario]"]').data('old-value'))? $(item).find('[name="item[][costo_unitario]"]').data('old-value') : $(item).find('[name="item[][costo_unitario]"]').val()) * exchange_rate).toString().replace(/\./g, ',');
			fields['item[' + k + '][subtotal_costo]'] = (parseFloat($(item).find('[name="item[][subtotal_costo]"]').val()) * exchange_rate).toString().replace(/\./g, ',');
			fields['item[' + k + '][utilidad]'] = (parseFloat($(item).find('[name="item[][utilidad]"]').val()) * exchange_rate).toString().replace(/\./g, ',');
			fields['item[' + k + '][margen_compra]'] = parseFloat($(item).find('[name="item[][margen_compra]"]').val());
			fields['item[' + k + '][margen_venta]'] = parseFloat($(item).find('[name="item[][margen_venta]"]').val());
			fields['item[' + k + '][aplica_sobrecargo]'] = $(item).find('[name="item[][aplica_sobrecargo]"]').prop('checked');
			fields['item[' + k + '][costo_interno]'] = $(item).find('[name="item[][costo_interno]"]').prop('checked');
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
			} else {
				toastr.error(NOTIFY.get('ERROR_RECORD_READONLY_ITEM'));
				unaBase.ui.unblock();
			}
		},
		error: function() {
			//toastr.error('No se pudo guardar el item');
			// manejar esta situación
		}
	}).fail(function(err, err2, err3) {
		console.log(err);
		console.log(err2);
		console.log(err3);
	});

};




//TODO: verificar con negcot
var updateDescuento = function() {
	var porcentaje_descuento = parseFloat($('[name="cotizacion[descuento][porcentaje]"]').val());
	var subtotal_sobrecargos = parseFloat($('section.sobrecargos > ul > li:last-of-type input[name*="subtotal"]').val());
	if (typeof selected_currency == 'undefined')
		$('[name="cotizacion[descuento][valor]"]').val((porcentaje_descuento * subtotal_sobrecargos / 100).toFixed(currency.decimals));
	else
		$('[name="cotizacion[descuento][valor]"]').val((porcentaje_descuento * subtotal_sobrecargos / 100.00).toFixed(2));
	updateSubtotalNeto();
};

//TODO: verificar con negcot
var updateSubtotalSobrecargos = function() {
	var subtotal_sobrecargos = 0;
	$('[name^="sobrecargo"][name$="[valor]"]').each(function() {
		subtotal_sobrecargos+= parseFloat($(this).val());
	});
	$('[name="cotizacion[sobrecargos][subtotal]"]').val(subtotal_sobrecargos);
	updateSubtotalNeto();
};

//TODO: verificar con negcot
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
	var subtotal_utilidades = 0;

	var current = target.next();

	do {

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
			if (costo_unitario.data('auto')) {
				costo_unitario.val(($(event.target).data('old-value'))? $(event.target).data('old-value') : $(event.target).val());
				costo_unitario.data('old-value', ($(event.target).data('old-value'))? $(event.target).data('old-value') : $(event.target).val());
			}
		}
	}


	var target = $(event.target).parentTo('tr');

	var cantidad = target.find('[name="item[][cantidad]"]').data('old-value');
	var factor = target.find('[name="item[][factor]"]').data('old-value');
	var precio_unitario = (target.find('[name="item[][precio_unitario]"]').data('old-value'))? target.find('[name="item[][precio_unitario]"]').data('old-value') : target.find('[name="item[][precio_unitario]"]').val();
	var costo_unitario = (target.find('[name="item[][costo_unitario]"]').data('old-value'))? target.find('[name="item[][costo_unitario]"]').data('old-value') : target.find('[name="item[][costo_unitario]"]').val();

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
				target.find('[name="item[][precio_unitario]"]').data('old-value', precio_unitario);
			} else {
				precio_unitario = (target.find('[name="item[][precio_unitario]"]').data('old-value'))? target.find('[name="item[][precio_unitario]"]').data('old-value') : target.find('[name="item[][precio_unitario]"]').val();
				target.find('[name="item[][costo_unitario]"]').val(precio_unitario).data('old-value', precio_unitario).trigger('blur');
			}

			subtotal_precio = cantidad * factor * precio_unitario;
			subtotal_costo = (target.find('[name="item[][subtotal_costo]"]').hasClass('edited'))? cantidad * factor * costo_unitario + costo_presupuestado_interno : cantidad * factor * costo_unitario;
		} else {
			precio_unitario = (target.find('[name="item[][precio_unitario]"]').data('old-value'))? target.find('[name="item[][precio_unitario]"]').data('old-value') : target.find('[name="item[][precio_unitario]"]').val();

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
			target.find('[name="item[][precio_unitario]"]').val(costo_unitario).data('old-value', costo_unitario)trigger('blur');

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
				costo_unitario = target.find('[name="item[][costo_unitario]"]').val();
				precio_unitario = costo_unitario / (1 - margen_venta / 100);
				target.find('[name="item[][precio_unitario]"]').val(precio_unitario).data('old-value', precio_unitario);
			}

			subtotal_precio = cantidad * factor * precio_unitario;
			subtotal_costo = (target.find('[name="item[][subtotal_costo]"]').hasClass('edited'))? cantidad * factor * costo_unitario + costo_presupuestado_interno : cantidad * factor * costo_unitario;
		} else {
			costo_unitario = (target.find('[name="item[][costo_unitario]"]').data('old-value'))? target.find('[name="item[][costo_unitario]"]').data('old-value') : target.find('[name="item[][costo_unitario]"]').val();

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

	if (typeof formulario_cinemagica != 'undefined') {
		calcValoresCinemagica();
	}


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

	if ($('input[name="cotizacion[empresa2][id]"]').val() != '' || $('input[name="cotizacion[empresa2][razon_social]"]').val() != '')
		target.find('button.empresa2.unlock, button.empresa2.profile').show();
};

//TODO: verificar negcot
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

	/*if (
		$('input[name="cotizacion[empresa2][contacto][id]"').val() != ''
	)*/ // revisar
		target.find('button.unlock.contacto2, button.show.contacto2, button.profile.contacto2').show();
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
					strict: true
				},
				dataType: 'json',
				success: function(data) {
					if (data.rows.length > 0) {
						for (var i = data.rows.length - 1; i >= 0; i--) {
							var item = data.rows[i];

							var htmlObject = getElement.item('insertAfter', title);
							try{
								htmlObject[0].dataset.producto = item.producto.id;
							}catch(err){
								console.log(err);
							}

							htmlObject.data('producto', item.id);
							htmlObject.find('[name="item[][codigo]"]').val(item.index);
							htmlObject.find('[name="item[][horas_extras]"]').val(0);
							htmlObject.find('[name="item[][precio_unitario]"]').val(item.precio).data('old-value', item.precio);
							htmlObject.find('[name="item[][subtotal_precio]"]').val(item.precio);
							htmlObject.find('[name="item[][aplica_sobrecargo]"]').prop('checked', item.aplica_sobrecargo);

							if (typeof copiar_precio_a_costo == 'boolean') {
								htmlObject.find('[name="item[][costo_unitario]"]').data('auto', true);
								if (item.costo == 0) {
									htmlObject.find('[name="item[][costo_unitario]"]').val(item.precio).data('old-value', item.precio);
									htmlObject.find('[name="item[][subtotal_costo]"]').val(item.precio);
								} else {
									htmlObject.find('[name="item[][costo_unitario]"]').val(item.costo).data('old-value', item.costo);
									htmlObject.find('[name="item[][subtotal_costo]"]').val(item.costo);
								}
							} else {
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

							// Mostrar signo de admiración (ui-icon-notice) si el ítem tiene comentario
				            // caso contrario mostrar ícono normal (ui-icon-gear)
				            if (item.comentario != '') {
				                htmlObject.find('button.profile.item').removeClass('ui-icon-gear').addClass('ui-icon-notice');
				            } else {
				                htmlObject.find('button.profile.item').removeClass('ui-icon-notice').addClass('ui-icon-gear');
				            }


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
								htmlObject.data('tipo-documento-valor-usd', item.tipo_documento.valor_usd);
								htmlObject.data('tipo-documento-inverse', item.tipo_documento.inverse);
								if (item.tipo_documento.ratio != 0) {
									htmlObject.find('[name="item[][precio_unitario]"]').addClass('edited');
									htmlObject.find('button.detail.price').visible();
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


var blockCinemagica = $('article.block-cinemagica');


var fillValoresCinemagica = function(data, retval) {
	
	// Llenado del formulario con valores calculados

	var current = $('table.items.cotizacion tbody').find('tr').first();
	for (var index = 0, len = data.rows.length; index < len; index++) {
		var item = data.rows[index];

		if (!item.titulo && (item.formula_productor_ejecutivo || item.formula_asistente_produccion || item.formula_horas_extras || item.porcentaje_monto_total)) {
			current.find('input[name="item[][cantidad]"]').val(item.cantidad).data('old-value', item.cantidad);
			current.find('input[name="item[][factor]"]').val(item.factor).data('old-value', item.factor);
			current.find('input[name="item[][precio_unitario]"]').val(item.precio.unitario);
			current.find('input[name="item[][subtotal_precio]"]').val(item.precio.subtotal);
			updateSubtotalTitulos(current);
		}

		current = current.next();

	}

	blockCinemagica.find('[name="sobrecargo[1][porcentaje]"]').val(retval.extra.utilidad_bruta.porcentaje);
	blockCinemagica.find('[name="sobrecargo[1][valor]"]').val(retval.extra.utilidad_bruta.monto);
	blockCinemagica.find('[name="sobrecargo[1][subtotal]"]').val(retval.extra.valor_pelicula);

	// blockCinemagica.find('[name="cotizacion[cinemagica][costos_directos]"]').val(retval.extra.costos_directos);
	$('[name="cotizacion[cinemagica][costos_directos]"]').val(retval.extra.costos_directos);

	var exchange_rate_usd = (valor_usd_cotizacion > 0)? valor_usd_cotizacion : valor_usd;
	var valor_pelicula_usd = retval.extra.valor_pelicula / exchange_rate_usd;
	blockCinemagica.find('[name="sobrecargo[1][subtotal][usd]"]').val(valor_pelicula_usd);

	//blockCinemagica.find('[name="sobrecargo[4][porcentaje]"]').val(retval.extra.costos_fijos.porcentaje);
	blockCinemagica.find('[name="sobrecargo[4][valor]"]').val(retval.extra.costos_fijos.monto);

	//blockCinemagica.find('[name="sobrecargo[6][porcentaje]"]').val(retval.extra.comision_agencia.porcentaje);
	blockCinemagica.find('[name="sobrecargo[6][valor]"]').val(retval.extra.comision_agencia.monto);

	blockCinemagica.find('[name="cotizacion[cinemagica][utilidad_neta]"]').val(retval.extra.utilidad_neta);

	//blockCinemagica.find('[name="cotizacion[cinemagica][director][porcentaje]"]').val(retval.extra.director.porcentaje);

	blockCinemagica.find('[name="cotizacion[cinemagica][director][valor]"]').val(retval.extra.director.monto);
	blockCinemagica.find('[name="cotizacion[cinemagica][compania][valor]"]').val(retval.extra.compania);

	blockCinemagica.find('[name="cotizacion[ajuste]"]').val(retval.extra.total_neto);

	$('span[name="cotizacion[ajuste]"]').text(retval.extra.total_neto);

	var impuesto = 0;
	if (blockCinemagica.find('[name="cotizacion[montos][impuesto][exento]"]').is(':checked')) {
		blockCinemagica.find('[name="cotizacion[montos][impuesto]"]').val(0);
	} else {
		var porcentaje_impuesto = parseFloat(blockCinemagica.find('[name="cotizacion[montos][impuesto]"]').data('porcentaje'));
		var impuesto = retval.extra.total_neto * porcentaje_impuesto / 100;
		blockCinemagica.find('[name="cotizacion[montos][impuesto]"]').val(impuesto);
	}
	blockCinemagica.find('[name="cotizacion[montos][total]"]').val(retval.extra.total_neto + impuesto);

	updateSubtotalItems(true);
	updateVistaItems(true);

	console.log(retval);

};
