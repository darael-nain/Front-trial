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
			console.trace();
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
	item: function(functor, element) {

		var htmlObject = $(' \
			<tr data-producto="0"> \
				<td></td> \
				<td class="numeric code"><input readonly name="item[][codigo]"></td> \
				<td><input readonly name="item[][nombre]"><button class="ui-icon ui-icon-document detail item" title="Detalle">Detalle</button><!--<button class="ui-icon ui-icon-gear profile item" title="Perfil"></button> --></td> \
				<td class="numeric qty detalle"><input readonly name="item[][cantidad]"> <span class="unit"></td> \
				<td class="segunda-cantidad numeric qty abs detalle"><input readonly name="item[][factor]"></td> \
				<td class="numeric currency detalle venta">' + currency.symbol + ' <span><input readonly name="item[][precio_unitario]"></span></td> \
				<td class="numeric currency venta">' + currency.symbol + ' <span><input readonly name="item[][subtotal_precio]"></span></td> \
				<td class="numeric currency costo presupuestado adquisicion">' + currency.symbol + ' <span><input readonly name="item[][subtotal_costo]"></span> <button class="ui-icon ui-icon-notice detail cost" title="Ver detalle del costo">Ver detalle del costo</button></td> \
				<td class="numeric currency utilidad presupuestado adquisicion">' + currency.symbol + ' <span><input readonly name="item[][utilidad]"></span></td> \
				<td class="numeric percent margen-desde-venta margen presupuestado adquisicion"><span><input readonly name="item[][margen_venta]"> %</span></td> \
				<td class="numeric percent margen-desde-compra margen presupuestado adquisicion"><span><input readonly name="item[][margen_compra]"> %</span></td> \
				<td class="numeric currency costo real adquisicion">' + currency.symbol + ' <span><input readonly name="item[][subtotal_costo_real]"></span> <button class="ui-icon ui-icon-notice detail cost-real" title="Ver detalle del costo">Ver detalle del costo</button> <span name="item[][closed_compras]" class="ui-icon ui-icon-locked"></span></td> \
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
			interactiveAutoClose: false
		});

		return htmlObject;
	}
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

	$('input[name="cotizacion[ajuste][diferencia]"]').val(($('input[name="sobrecargo[5][valor]"]').val()));

};

var updateTotalUtilidadCosto = function() {
	var costo_real_otros = 0;
	var costo_real_sobrecargos = 0;

	/*$.ajax({
		url: '/4DACTION/_V3_getSummaryByNegocio',
		data: {
			id: $('section.sheet').data('id')
		},
		dataType: 'json',
		async: false,
		success: function(data) {
			costo_real_otros = data.rows[0].resumen.gasto_real.otros.value;
			costo_real_sobrecargos = data.rows[0].resumen.gasto_real.sobrecargos.value;
		}
	});*/

	costo_real_otros = summaryNegocioData.rows[0].resumen.gasto_real.otros.value;
	costo_real_sobrecargos = summaryNegocioData.rows[0].resumen.gasto_real.sobrecargos.value;

	var utilidad_items = parseFloat($('[name="cotizacion[utilidades][subtotal]"]').val());
	var costo_items = parseFloat($('[name="cotizacion[costos][subtotal]"]').val());

	var utilidad_real_items = parseFloat($('[name="cotizacion[utilidades_real][subtotal]"]').val());
	var costo_real_items = parseFloat($('[name="cotizacion[costos_real][subtotal]"]').val());

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

	var subtotal_neto = parseFloat($('input[name="cotizacion[montos][subtotal_neto]"]').val());

	var costo_total = (costo_items + costo_sobrecargos).toFixed(currency.decimals);
	var utilidad_total = (utilidad_items + utilidad_sobrecargos - descuento).toFixed(currency.decimals);

	var costo_real_total = (costo_real_items + costo_real_otros + costo_real_sobrecargos).toFixed(currency.decimals);
	//var utilidad_real_total = (utilidad_real_items + utilidad_sobrecargos - descuento).toFixed(0);
	var utilidad_real_total = subtotal_neto - costo_real_total;

	$('input[name="cotizacion[montos][utilidad]"]').val(utilidad_total);
	$('input[name="cotizacion[montos][costo]"]').val(costo_total);
	$('span[name="cotizacion[montos][utilidad]"]').text(utilidad_total);
	$('span[name="cotizacion[montos][costo]"]').text(costo_total);
	$('span[name="cotizacion[montos][utilidad]"]').number(true, currency.decimals, ',', '.');
	$('span[name="cotizacion[montos][costo]"]').number(true, currency.decimals, ',', '.');

	$('input[name="cotizacion[montos][utilidad_real]"]').val(utilidad_real_total);
	$('input[name="cotizacion[montos][costo_real]"]').val(costo_real_total);
	$('span[name="cotizacion[montos][utilidad_real]"]').text(utilidad_real_total);
	$('span[name="cotizacion[montos][costo_real]"]').text(costo_real_total);
	$('span[name="cotizacion[montos][utilidad_real]"]').number(true, currency.decimals, ',', '.');
	$('span[name="cotizacion[montos][costo_real]"]').number(true, currency.decimals, ',', '.');

	$('input[name="cotizacion[montos][utilidad_ratio]"]').val(utilidad_total / subtotal_neto * 100);
	$('input[name="cotizacion[montos][costo_ratio]"]').val(costo_total / subtotal_neto * 100);
	if ($('input[name="cotizacion[montos][utilidad_ratio]"]').length > 0)
		$('span[name="cotizacion[montos][utilidad_ratio]"]').text($('input[name="cotizacion[montos][utilidad_ratio]"]').val().replace('.', ','));
	if ($('input[name="cotizacion[montos][costo_ratio]"]').length > 0)
		$('span[name="cotizacion[montos][costo_ratio]"]').text($('input[name="cotizacion[montos][costo_ratio]"]').val().replace('.', ','));

	$('input[name="cotizacion[montos][utilidad_real_ratio]"]').val(utilidad_real_total / subtotal_neto * 100);
	$('input[name="cotizacion[montos][costo_real_ratio]"]').val(costo_real_total / subtotal_neto * 100);
	$('span[name="cotizacion[montos][utilidad_real_ratio]"]').text((utilidad_real_total / subtotal_neto * 100).toFixed(2).toString().replace('.', ','));
	$('span[name="cotizacion[montos][costo_real_ratio]"]').text((costo_real_total / subtotal_neto * 100).toFixed(2).toString().replace('.', ','));
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

	$('input[name="cotizacion[ajuste]"]').val($('input[name="cotizacion[montos][subtotal_neto]"]').val());

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
	$('section.sobrecargos > ul > li:first-of-type input[name$="[subtotal]"]').val(parseFloat($('input[name="cotizacion[precios][subtotal]"]').val()) + parseFloat($('section.sobrecargos > ul > li:first-of-type input[name$="[valor]"]').val()));
	$('section.sobrecargos > ul > li:not(:first-of-type)').each(function() {
		$(this).find('[name$="[subtotal]"]').val(parseFloat($(this).prevTo('li').find('[name$="[subtotal]"]').val()) + parseFloat($(this).find('[name$="[valor]"]').val()))
	});


	var subtotal_sobrecargos = 0;
	$('[name^="sobrecargo"][name$="[valor]"]').each(function() {
		subtotal_sobrecargos+= parseFloat($(this).val());
	});
	$('[name="cotizacion[sobrecargos][subtotal]"]').val(subtotal_sobrecargos);

	updateSubtotalNeto();
};

var updateSubtotalItems = function() {
	var target = $('table.items > tbody');

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


	updateSubtotalSobrecargos();
	
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


var getDetail = function() {
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


					// Oculta ítem
					if (item.hidden) {
						hidden_items = true;
						htmlObject.hide();
					}

					if (typeof item.producto != 'undefined')
						htmlObject.data('producto', item.producto.id);

					htmlObject.find('[name="item[][codigo]"]').val(item.codigo);
					htmlObject.find('[name="item[][cantidad]"]').val(item.cantidad);
					htmlObject.find('[name="item[][factor]"]').val(item.factor);
					htmlObject.find('[name="item[][precio_unitario]"]').val(item.precio.unitario);

					htmlObject.find('[name="item[][costo_unitario]"]').val(item.costo.presupuestado.unitario);
					
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
				htmlObject.data('index', item.index);

				htmlObject.find('input[name="item[][nombre]"]').val(item.nombre);

				htmlObject.find('button.profile.item').tooltipster('update', item.text);


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
							
						}
					}
				});
			}
		}
	});
};
