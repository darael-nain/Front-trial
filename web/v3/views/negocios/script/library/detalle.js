var getElement = {
	titulo: function(functor, element) {

		var htmlObject = $(' \
			<tr class="title" data-categoria="0"> \
				<th></th> \
				<th><button class="ui-icon ui-icon-folder-open toggle categoria" title="Contraer o expandir título"></button></th> \
				<th><input readonly name="item[][nombre]"> <!-- <button class="ui-icon ui-icon-gear profile categoria" title="Perfil">Perfil</button> --></th> \
				<th class="info detalle"></th> \
				<th class="segunda-cantidad detalle"></th> \
				<th class="detalle venta"></th> \
				<th class="numeric currency venta">' + currency.symbol + ' <span><input readonly name="item[][subtotal_precio]"></span></th> \
				<th class="numeric currency costo presupuestado adquisicion">' + currency.symbol + ' <span><input readonly name="item[][subtotal_costo]"></span></th> \
				<th class="numeric currency utilidad presupuestado adquisicion">' + currency.symbol + ' <span><input readonly name="item[][utilidad]"></span></th> \
				<th class="numeric percent margen-desde-venta margen presupuestado adquisicion"><span><input readonly name="item[][margen_venta]"> %</span></th> \
				<th class="numeric percent margen-desde-compra margen presupuestado adquisicion"><span><input readonly name="item[][margen_compra]"> %</span></th> \
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

		htmlObject.find('.numeric.currency input').number(true, currency.decimals, ',', '.');
		htmlObject.find('.numeric.percent input').number(true, 2, ',', '.');

		htmlObject.find('button.toggle.categoria').click(function() {
			console.log('script/library/detalle')
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
				<td></td> \
				<td class="numeric code"  ><input readonly name="item[][codigo]"></td> \
				<td><input readonly name="item[][nombre]"><button class="ui-icon ui-icon-document detail item" title="Detalle">Detalle</button><!--<button class="ui-icon ui-icon-gear profile item" title="Perfil"></button> --></td> \
				<td class="numeric qty detalle"><input readonly name="item[][cantidad]"> <span class="unit"></td> \
				<td class="segunda-cantidad numeric qty abs detalle"><input readonly name="item[][factor]"></td> \
				<td class="numeric currency detalle venta">' + currency.symbol + ' <span><input readonly name="item[][precio_unitario]"></span></td> \
				<td class="numeric currency venta">' + currency.symbol + ' <span><input readonly name="item[][subtotal_precio]"></span></td> \
				<td class="numeric currency costo presupuestado adquisicion">' + currency.symbol + ' <span><input readonly name="item[][subtotal_costo]"></span> <button class="ui-icon ui-icon-notice detail cost" title="Ver detalle del costo">Ver detalle del costo</button></td> \
				<td class="numeric currency utilidad presupuestado adquisicion">' + currency.symbol + ' <span><input readonly name="item[][utilidad]"></span></td> \
				<td class="numeric percent margen-desde-venta margen presupuestado adquisicion"><span><input readonly name="item[][margen_venta]"> %</span></td> \
				<td class="numeric percent margen-desde-compra margen presupuestado adquisicion"><span><input readonly name="item[][margen_compra]"> %</span></td> \
				<td class="numeric currency costo real adquisicion">' + currency.symbol + ' <span><input readonly name="item[][subtotal_costo_real]"></span> <button class="ui-icon ui-icon-notice detail cost-real" title="Ver detalle del costo">Ver detalle del costo</button> <div name="item[][closed_compras]" class="ui-icon ui-icon-locked" style="display:inline-block;vertical-align:middle;margin-left:-20px"></div></td> \
				<td class="numeric currency utilidad real adquisicion">' + currency.symbol + ' <span><input readonly name="item[][utilidad_real]"></span></td> \
				<td class="numeric percent margen-desde-venta margen real adquisicion"><span><input readonly name="item[][margen_venta_real]"> %</span></td> \
				<td class="numeric percent margen-desde-compra margen real adquisicion"><span><input readonly name="item[][margen_compra_real]"> %</span></td> \
				<td class="numeric currency adquisicion">' + currency.symbol + ' <span><input readonly name="item[][diferencia]"></span></td> \
				<td class="numeric percent adquisicion"><span><input readonly name="item[][diferencia_ratio]"> %</span></td> \
				<td class="fit costo-interno"><input name="item[][costo_interno]" type="checkbox" value="true"></td> \
				<td class="fit"><input readonly name="item[][selected]" type="checkbox" value="true"></td> \
			</tr> \
		');


		htmlObject[functor](element);

		htmlObject.find('.numeric.currency input').number(true, currency.decimals, ',', '.');
		htmlObject.find('.numeric.percent input').number(true, 2, ',', '.');

		htmlObject.find('button.profile.item').tooltipster({
			delay: 0,
			interactiveAutoClose: false,
			contentAsHTML: true
		});

		return htmlObject;
	}
};




var updateSubtotalItems = function() {
	var target = $('table.items.cotizacion > tbody');

	var subtotal_precios = 0;
	var subtotal_costos = 0;
	var subtotal_utilidades = 0;
	var subtotal_costos_real = 0;
	var subtotal_utilidades_real = 0;

	target.find('tr').not('.title').each(function() {

		subtotal_precios+= parseFloat($(this).find('[name="item[][subtotal_precio]"]').val());
		subtotal_costos+= parseFloat($(this).find('[name="item[][subtotal_costo]"]').val());
		subtotal_utilidades+= parseFloat($(this).find('[name="item[][utilidad]"]').val());

		subtotal_costos_real+= parseFloat($(this).find('[name="item[][subtotal_costo_real]"]').val());
		subtotal_utilidades_real+= parseFloat($(this).find('[name="item[][utilidad_real]"]').val());


	});


	$('input[name="cotizacion[precios][subtotal]"]').val(subtotal_precios);
	$('input[name="cotizacion[costos][subtotal]"]').val(subtotal_costos);
	$('input[name="cotizacion[utilidades][subtotal]"]').val(subtotal_utilidades);


	if (margen_desde_compra_inverso)
		var subtotal_margen_compra = ((1 - subtotal_costos / subtotal_precios) * 100).toFixed(2);
	else
		var subtotal_margen_compra = ((subtotal_precios - subtotal_costos) / subtotal_costos * 100).toFixed(2);

	var subtotal_margen_venta = ((subtotal_precios - subtotal_costos) / subtotal_precios * 100).toFixed(2);

	$('input[name="cotizacion[margenes][margen_venta]"]').val((isFinite(subtotal_margen_venta))? subtotal_margen_venta : 0);
	$('input[name="cotizacion[margenes][margen_compra]"]').val((isFinite(subtotal_margen_compra))? subtotal_margen_compra : 0);

	$('input[name="cotizacion[costos_real][subtotal]"]').val(subtotal_costos_real);
	$('input[name="cotizacion[utilidades_real][subtotal]"]').val(subtotal_utilidades_real);

	if (margen_desde_compra_inverso)
		var subtotal_margen_compra_real = ((1 - subtotal_costos_real / subtotal_precios) * 100).toFixed(2);
	else
		var subtotal_margen_compra_real = ((subtotal_precios - subtotal_costos_real) / subtotal_costos_real * 100).toFixed(2);

	var subtotal_margen_venta_real = ((subtotal_precios - subtotal_costos_real) / subtotal_precios * 100).toFixed(2);

	$('input[name="cotizacion[margenes][margen_venta_real]"]').val((isFinite(subtotal_margen_venta_real))? subtotal_margen_venta_real : 0);
	$('input[name="cotizacion[margenes][margen_compra_real]"]').val((isFinite(subtotal_margen_compra_real))? subtotal_margen_compra_real : 0);

	var diferencia_ratio = ((subtotal_costos - subtotal_costos_real) / subtotal_costos * 100).toFixed(2);

	$('input[name="cotizacion[diferencia]"]').val(subtotal_costos - subtotal_costos_real);
	$('input[name="cotizacion[diferencia_ratio]"]').val(diferencia_ratio);

	
		sobrecargos.updateSubtotalSobrecargos();
	
	

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
	var subtotal_costos_real = 0;
	var subtotal_utilidades_real = 0;
	var subtotal_diferencia = 0;

	var current = target.next();

	do {
		
		if (current.css('visibility') != 'hidden' && !current.hasClass('ui-draggable-dragging')) {

			subtotal_precios+= parseFloat(current.find('[name="item[][subtotal_precio]"]').val());
			subtotal_costos+= parseFloat(current.find('[name="item[][subtotal_costo]"]').val());
			subtotal_utilidades+= parseFloat(current.find('[name="item[][utilidad]"]').val());

			subtotal_costos_real+= parseFloat(current.find('[name="item[][subtotal_costo_real]"]').val());
			subtotal_utilidades_real+= parseFloat(current.find('[name="item[][utilidad_real]"]').val());

			subtotal_diferencia+= parseFloat(current.find('[name="item[][diferencia]"]').val());
		}

		current = current.next();
	} while(!current.hasClass('title') && current.length > 0);
	
	target.find('input[name="item[][subtotal_precio]"]').val(subtotal_precios);
	target.find('input[name="item[][subtotal_costo]"]').val(subtotal_costos);
	target.find('input[name="item[][utilidad]"]').val(subtotal_utilidades);
	target.find('input[name="item[][subtotal_costo_real]"]').val(subtotal_costos_real);
	target.find('input[name="item[][utilidad_real]"]').val(subtotal_utilidades_real);
	target.find('input[name="item[][diferencia]"]').val(subtotal_diferencia);

	var subtotal_diferencia_ratio = ((subtotal_costos - subtotal_costos_real) / subtotal_costos * 100).toFixed(2);

	target.find('input[name="item[][diferencia_ratio]"]').val(subtotal_diferencia_ratio);


	if (margen_desde_compra_inverso)
		var subtotal_margen_compra = ((1 - subtotal_costos / subtotal_precios) * 100).toFixed(2);
	else
		var subtotal_margen_compra = ((subtotal_precios - subtotal_costos) / subtotal_costos * 100).toFixed(2);

	var subtotal_margen_venta = ((subtotal_precios - subtotal_costos) / subtotal_precios * 100).toFixed(2);


	if (margen_desde_compra_inverso)
		var subtotal_margen_compra_real = ((1 - subtotal_costos_real / subtotal_precios) * 100).toFixed(2);
	else
		var subtotal_margen_compra_real = ((subtotal_precios - subtotal_costos_real) / subtotal_costos_real * 100).toFixed(2);

	var subtotal_margen_venta_real = ((subtotal_precios - subtotal_costos_real) / subtotal_precios * 100).toFixed(2);

	target.find('input[name="item[][margen_venta]"]').val((isFinite(subtotal_margen_venta))? subtotal_margen_venta : 0);
	target.find('input[name="item[][margen_compra]"]').val((isFinite(subtotal_margen_compra))? subtotal_margen_compra : 0);

	target.find('input[name="item[][margen_venta_real]"]').val((isFinite(subtotal_margen_venta_real))? subtotal_margen_venta_real : 0);
	target.find('input[name="item[][margen_compra_real]"]').val((isFinite(subtotal_margen_compra_real))? subtotal_margen_compra_real : 0);

};

var updateRow = function(event) {

	var target = $(event.target).parentTo('tr');

	var subtotal_precio = target.find('[name="item[][subtotal_precio]"]').val();
	var subtotal_costo = target.find('[name="item[][subtotal_costo]"]').val();
	var margen_compra = target.find('[name="item[][margen_compra]"]').val();
	var margen_venta = target.find('[name="item[][margen_venta]"]').val();

	var subtotal_costo_real = target.find('[name="item[][subtotal_costo_real]"]').val();
	var margen_compra_real = target.find('[name="item[][margen_compra_real]"]').val();
	var margen_venta_real = target.find('[name="item[][margen_venta_real]"]').val();

	target.find('[name="item[][subtotal_precio]"]').val(subtotal_precio);
	target.find('[name="item[][subtotal_costo]"]').val(subtotal_costo);
	target.find('[name="item[][utilidad]"]').val(subtotal_precio - subtotal_costo);
	target.find('[name="item[][margen_compra]"]').val((isFinite(margen_compra))? margen_compra : 0);
	
	target.find('[name="item[][subtotal_costo_real]"]').val(subtotal_costo_real);
	target.find('[name="item[][utilidad_real]"]').val(subtotal_precio - subtotal_costo_real);
	target.find('[name="item[][margen_compra_real]"]').val((isFinite(margen_compra_real))? margen_compra_real : 0);

	var title = target.prevTo('.title');
	updateSubtotalTitulos(title);
	updateSubtotalItems();
};


	console.warn("before----------  getDetail from negocios/script/library/detalle");
var getDetail = function() {
	console.warn("----------  getDetail from negocios/script/library/detalle");
	$.ajax({
		url: '/4DACTION/_V3_getItemByCotizacion',
		dataType: 'json',
		data: {
			id: $('section.sheet').data('id')
		},
		async: false,
		beforeSend: function() {
			unaBase.ui.block();
		},
		complete: function() {

		},
		success: function(data) {
			debugger;
			// guarda todos los items en business.item.docs(array de objectos)
			business.item.set(data);
			var current;
			current = $('table.items > tbody');
			current.hide();

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
					try{
						htmlObject[0].dataset.producto = item.producto.id;
					}catch(err){
						console.log(err);
					}


					// Oculta ítem
					if (item.hidden) {
						hidden_items = true;
						htmlObject.hide();
					}

					if (typeof item.producto != 'undefined')
						htmlObject.data('producto', item.producto.id);

					htmlObject.find('[name="item[][codigo]"]').val(item.codigo);
					htmlObject.find('[name="item[][cantidad]"]').val(item.cantidad).data('old-value', item.cantidad);
					htmlObject.find('[name="item[][factor]"]').val(item.factor).data('old-value', item.factor);
					htmlObject.find('[name="item[][precio_unitario]"]').val(item.precio.unitario).data('old-value', item.precio.unitario);

					htmlObject.find('[name="item[][costo_unitario]"]').val(item.costo.presupuestado.unitario).data('old-value', item.costo.presupuestado.unitario);

					htmlObject.find('[name="item[][aplica_sobrecargo]"]').prop('checked', item.aplica_sobrecargo).trigger('change');

					htmlObject.find('[name="item[][costo_interno]"]').prop('checked', item.costo.interno);

					htmlObject.data('costo-presupuestado-hh-cantidad', item.costo.presupuestado.hh.cantidad);
					htmlObject.data('costo-presupuestado-hh-valor', item.costo.presupuestado.hh.valor);
					htmlObject.data('costo-presupuestado-hh-username', item.costo.presupuestado.hh.username);


					if (item.costo.presupuestado.hh.cantidad > 0 && item.costo.presupuestado.hh.valor > 0 && item.costo.interno) {
						htmlObject.find('[name="item[][subtotal_costo]"]').addClass('edited').trigger('refresh');
						htmlObject.find('button.detail.cost').visible();
					} else {
						htmlObject.find('[name="item[][subtotal_costo]"]').removeClass('edited');
						htmlObject.find('button.detail.cost').invisible();
					}
					if (item.closed_compras)
						htmlObject.find('[name="item[][closed_compras]"]').show();
					else
						htmlObject.find('[name="item[][closed_compras]"]').hide();

				}

				htmlObject.find('[name="item[][subtotal_precio]"]').val(item.precio.subtotal);
				htmlObject.find('[name="item[][subtotal_costo]"]').val(item.costo.presupuestado.subtotal);
				htmlObject.find('[name="item[][subtotal_costo_real]"]').val(item.costo.real.subtotal);
				htmlObject.find('[name="item[][utilidad]"]').val(item.precio.subtotal - item.costo.presupuestado.subtotal);
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

				if (margen_desde_compra_inverso)
					var margen_compra = ((1 - item.costo.presupuestado.subtotal / item.precio.subtotal) * 100).toFixed(2);
				else
					var margen_compra = ((item.precio.subtotal - item.costo.presupuestado.subtotal) / item.costo.presupuestado.subtotal * 100).toFixed(2);



				var margen_venta = ((item.precio.subtotal - item.costo.presupuestado.subtotal) / item.precio.subtotal * 100).toFixed(2);

				if (margen_desde_compra_inverso)
					var margen_compra_real = ((1 - item.costo.real.subtotal / item.precio.subtotal) * 100).toFixed(2);
				else
					var margen_compra_real = ((item.precio.subtotal - item.costo.real.subtotal) / item.costo.real.subtotal * 100).toFixed(2);


				var margen_venta_real = ((item.precio.subtotal - item.costo.real.subtotal) / item.precio.subtotal * 100).toFixed(2);

				var diferencia_ratio = ((item.costo.presupuestado.subtotal - item.costo.real.subtotal) / item.costo.presupuestado.subtotal * 100).toFixed(2);

				htmlObject.find('[name="item[][margen_venta]"]').val((isFinite(margen_venta))? margen_venta : 0);
				htmlObject.find('[name="item[][margen_compra]"]').val((isFinite(margen_compra))? margen_compra : 0);

				htmlObject.find('[name="item[][margen_venta_real]"]').val((isFinite(margen_venta_real))? margen_venta_real : 0);
				htmlObject.find('[name="item[][margen_compra_real]"]').val((isFinite(margen_compra_real))? margen_compra_real : 0);

				htmlObject.find('[name="item[][diferencia]"]').val(item.costo.presupuestado.subtotal - item.costo.real.subtotal);
				htmlObject.find('[name="item[][diferencia_ratio]"]').val(diferencia_ratio);

				htmlObject.data('id', item.id);
				htmlObject[0].dataset.id = item.id;
				htmlObject.data('index', item.index);

				var nombreInput = htmlObject.find('input[name="item[][nombre]"]');
				nombreInput.val(item.nombre);
				
				// Si el item ya tiene ID (fue guardado) y NO es una categoría (titulo), bloquear el campo nombre
				if (item.id && !item.titulo) {
					nombreInput.prop('readonly', true);
					nombreInput.attr('readonly', 'readonly');
					nombreInput.css({
						'pointer-events': 'none',
						'background-color': '#f5f5f5',
						'cursor': 'not-allowed',
						'opacity': '0.7'
					});
					nombreInput.data('nombre-original', item.nombre);
					nombreInput.attr('data-original-value', item.nombre);
					nombreInput.data('item-guardado', true);
					htmlObject.data('nombre-bloqueado', true);
					htmlObject.find('button.show.item').hide();
					htmlObject.find('button.ui-icon-document.detail.item').hide();
				}

				// campos custom items
				htmlObject.data('det-custom-data-1', item.custom_data_1);
				htmlObject.data('det-custom-data-2', item.custom_data_2);
				htmlObject.data('det-custom-data-3', item.custom_data_3);
				htmlObject.data('det-custom-data-4', item.custom_data_4);
				htmlObject.data('det-afecto-exportativo', item.afecto_exportativo);
				htmlObject.data('det-afecto-no-exportativo', item.afecto_no_exportativo);
				htmlObject.data('det-no_considera_impuesto', item.no_considera_impuesto);

				htmlObject.data('sobrecargo-predefinido-data', item.sobrecargo_predefinido);
				htmlObject.data('feepre', item.sobrecargo_predefinido);
				htmlObject[0].dataset.feepre = item.sobrecargo_predefinido;

				// var tooltip = ' \
				// 	<p>Nombre ítem:</p> \
				// 	<p>' + item.text.replace("\n", '<p>&nbsp;</p>') + '</p> \
				// 	<p>&nbsp;</p> \
				// 	<p>Descripción larga:</p> \
				// 	<p>' + ((item.observacion!= '')? item.observacion.replace(/\n/g, '</p><p>') : 'N/A') + '</p> \
				// 	<p>&nbsp;</p>\
				// 	<p>Observación interna:</p> \
				// 	<p>' + ((item.comentario!= '')? item.comentario.replace(/\n/g, '</p><p>') : 'N/A') + '</p> \
				// ';
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


				// deberia calcularse el titulo anterior cuando éste ha terminado de cargar (corregir)
				//updateSubtotalTitulos(htmlObject);

			}

			if (hidden_items)
				$('table.items > tfoot').invisible();

			updateSubtotalTitulos(tituloAnterior);
			tituloAnterior = undefined;

			// Después de traer los ítems, se calculan subtotales y se muestran en el DOM
			updateSubtotalItems();
			current.show();

			if ($('#main-container').data('closed-compras')) {
				$('button.actions.items').hide();
				$('table.items > * > tr > *:last-of-type > *').hide();
				$('table.items > thead > th.costo-interno:last-of-type > *').hide();
			}

			if ($('#main-container').data('closed-ventas')) {
				$('button.actions.items').hide();
				$('table.items [name="item[][tipo_documento]"]').prop('readonly', true);
				$('table.items [name="item[][tipo_documento]"]').closest('td').find('button').hide();
				$('table.items [name="item[][tipo_documento_compras]"]').prop('readonly', true);
				$('table.items [name="item[][tipo_documento_compras]"]').closest('td').find('button').hide();
				$('table.items [name="item[][cantidad]"]').prop('readonly', true);
				$('table.items [name="item[][factor]"]').prop('readonly', true);
				$('table.items [name="item[][horas_extras]"]').prop('readonly', true);
				$('table.items [name="item[][precio_unitario]"]').prop('readonly', true);
				$('table.items [name="item[][costo_unitario]"]').prop('readonly', true);
				$('table.items [name="item[][subtotal_costo]"]').prop('readonly', true);
			}

			

			unaBase.ui.unblock();
			if ($('section.sheet').data('index'))
				$('section.sheet table > thead button.toggle.all').triggerHandler('click');

			var costo_interno_global = true;
			$('section.sheet table > tbody > tr:not(.title)').each(function() {
				if (!$(this).find('input[name="item[][costo_interno]"]').prop('checked')) {
					costo_interno_global = false;
					return false;
				}
			});

			$('section.sheet table > thead > tr > th input[name="item[][costo_interno]"]').prop('checked', costo_interno_global);


		},
		error: function() {
			toastr.error('No se pudieron mostrar los items de la cotización');
			// manejar esta situación
		}
	});

};


// Guardar dato de costo interno cuando se modifica la fila
var saveRow = function(event) {
	var target = $(event.target).parentTo('tr');

	$.ajax({
		url: '/4DACTION/_V3_setItemByNegocio',
		data: {
			id: target.data('id'),
			costo_interno: target.find('input[name="item[][costo_interno]"]').prop('checked'),
			costo_presupuestado: parseFloat(target.find('input[name="item[][subtotal_costo]"]').val()),
			costo_real: parseFloat(target.find('input[name="item[][subtotal_costo_real]"]').val())
		},
		dataType: 'json',
		async: false,
		success: function(data) {
			if (data.success) {
				// Si el item tiene ID y NO es una categoría (title o itemParent), bloquear el campo nombre
				var itemId = target.data('id');
				if (itemId && !target.hasClass('title') && !target.hasClass('itemParent')) {
					var nombreInput = target.find('[name="item[][nombre]"]');
					if (nombreInput.length > 0) {
						var nombreValue = nombreInput.val();
						nombreInput.prop('readonly', true);
						nombreInput.attr('readonly', 'readonly');
						nombreInput.css({
							'pointer-events': 'none',
							'background-color': '#f5f5f5',
							'cursor': 'not-allowed',
							'opacity': '0.7'
						});
						nombreInput.data('nombre-original', nombreValue);
						nombreInput.attr('data-original-value', nombreValue);
						nombreInput.data('item-guardado', true);
						target.data('nombre-bloqueado', true);
						target.find('button.show.item').hide();
						target.find('button.ui-icon-document.detail.item').hide();
						if (nombreInput.hasClass('ui-autocomplete-input')) {
							nombreInput.autocomplete('destroy');
						}
					}
				}
				
				/*if (target.find('input[name="item[][costo_interno]"]').prop('checked'))
					toastr.success('Costo interno activado para el ítem');
				else
					toastr.success('Costo interno desactivado para el item');
				*/

				// TODO: optimizar esto, para que no se guarde una vez por cada check
				// al cambiar el gasto interno para todos los ítems simultáneamente

				$.ajax({
					url:'/4DACTION/_V3_setCotizacion',
					data: {
						id: $('section.sheet').data('id'),
						'cotizacion[precios][subtotal]': $('input[name="cotizacion[precios][subtotal]"]').val(),
						'cotizacion[costos][subtotal]': $('input[name="cotizacion[costos][subtotal]"]').val(),
						'cotizacion[utilidades][subtotal]': $('input[name="cotizacion[utilidades][subtotal]"]').val(),
						'cotizacion[margenes][margen_venta]': $('input[name="cotizacion[margenes][margen_venta]"]').val(),
						'cotizacion[margenes][margen_compra]': $('input[name="cotizacion[margenes][margen_compra]"]').val(),

						'cotizacion[montos][utilidad]': $('input[name="cotizacion[montos][utilidad]"]').val(),
						'cotizacion[montos][utilidad_ratio]': $('input[name="cotizacion[montos][utilidad_ratio]"]').val(),
						'cotizacion[montos][costo]': $('input[name="cotizacion[montos][costo]"]').val(),
						'cotizacion[montos][costo_ratio]': $('input[name="cotizacion[montos][costo_ratio]"]').val()
					},
					dataType: 'json',
					async: false,
					success: function(data) {
						if (data.success) {
							// Recargar items después de guardar para aplicar bloqueo de nombres
							setTimeout(function() {
								getDetail();
							}, 500);
						}
					}
				});
			}
		}
	});
};
