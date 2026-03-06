

var updateIndexes = function(callback) {

		//debugsimon
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
	exchange_rate = document.getElementsByName('cotizacion[tipo_cambio]')[0] ? parseFloat((document.getElementsByName('cotizacion[tipo_cambio]')[0].value.replaceAll(".", "")).replaceAll(",", ".")) : exchange_rate;


	$('#tabs-2 section.sheet table > tbody > tr').each(function(key, item) {

		index+= increment;
		$(item).data('index', index);
		field = $(item).find('input[name="item[][nombre]"]');

		if ($(item).hasClass('title')) {
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

		}else if ($(item).hasClass('itemParent')) {
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

			// campos custom items
			fields['item[' + k + '][custom_data_1]'] = $(item).data('det-custom-data-1');
			fields['item[' + k + '][custom_data_2]'] = $(item).data('det-custom-data-2');
			fields['item[' + k + '][custom_data_3]'] = $(item).data('det-custom-data-3');
			fields['item[' + k + '][custom_data_4]'] = $(item).data('det-custom-data-4');
			fields['item[' + k + '][no_considera_impuesto]'] = $(item).data('det-no_considera_impuesto');
			fields['item[' + k + '][afecto_exportativo]'] = $(item).data('det-afecto-exportativo');
			fields['item[' + k + '][afecto_no_exportativo]'] = $(item).data('det-afecto-no-exportativo');

			fields['item[' + k + '][sobrecargo_predefinido_select]'] = $(item).data('sobrecargo-predefinido-data');
			fields['item[' + k + '][sobrecargo_predefinido_select]'] = $(item)[0].dataset.feepre;

		} else {


			// fields['item[' + k + '][porcentaje_monto_total]'] = parseFloat($(item).data('porcentaje-monto-total') * 100).toString().replace(/\./g, ',');
			fields['item[' + k + '][porcentaje_monto_total]'] = parseFloat($(item).data('porcentaje-monto-total')).toString().replace(/\./g, ',');
			fields['item[' + k + '][formula_productor_ejecutivo]'] = $(item).data('formula-productor-ejecutivo'); // Fórmula productor ejecutivo
			//fields['item[' + k + '][formula_productor_ejecutivo_ratio]'] = $(item).data('formula-productor-ejecutivo-ratio'); // Fórmula productor ejecutivo
			fields['item[' + k + '][formula_productor_ejecutivo_ratio]'] = parseFloat($(item).data('formula-productor-ejecutivo-ratio')).toString().replace(/\./g, ','); // Fórmula productor ejecutivo
			fields['item[' + k + '][formula_asistente_produccion]'] = $(item).data('formula-asistente-produccion'); // Fórmula asistente producción
			
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
			
			// simon itemparent
			fields['item[' + k + '][isParent]'] = item.classList.contains('itemParent');
			fields['item[' + k + '][isChild]'] = item.classList.contains('childItem');
			fields['item[' + k + '][itemParent]'] = item.dataset.itemparent;

			fields['item[' + k + '][tipo_documento]'] = $(item).data('tipo-documento');
			fields['item[' + k + '][tipo_documento][ratio]'] = $(item).data('tipo-documento-ratio');
			fields['item[' + k + '][tipo_documento][valor_usd]'] = $(item).data('tipo-documento-valor-usd'); // Impuesto extranjero
			fields['item[' + k + '][tipo_documento][inverse]'] = $(item).data('tipo-documento-inverse');
			fields['item[' + k + '][hora_extra][factor]'] = $(item).data('hora-extra-factor');
			fields['item[' + k + '][hora_extra][jornada]'] = $(item).data('hora-extra-jornada');
			fields['item[' + k + '][precio_unitario][base_imponible]'] = (parseFloat($(item).data('base-imponible')) * exchange_rate).toString().replace(/\./g, ',');

			fields['item[' + k + '][cant_hh_asig]'] = $(item).data('costo-presupuestado-hh-cantidad');
			fields['item[' + k + '][costo_hh_unitario]'] = $(item).data('costo-presupuestado-hh-valor');
			fields['item[' + k + '][responsable_asig]'] = $(item).data('costo-presupuestado-hh-username');

			// campos custom items
			fields['item[' + k + '][custom_data_1]'] = $(item).data('det-custom-data-1');
			fields['item[' + k + '][custom_data_2]'] = $(item).data('det-custom-data-2');
			fields['item[' + k + '][custom_data_3]'] = $(item).data('det-custom-data-3');
			fields['item[' + k + '][custom_data_4]'] = $(item).data('det-custom-data-4');
			fields['item[' + k + '][no_considera_impuesto]'] = $(item).data('det-no_considera_impuesto');
			fields['item[' + k + '][afecto_exportativo]'] = $(item).data('det-afecto-exportativo');
			fields['item[' + k + '][afecto_no_exportativo]'] = $(item).data('det-afecto-no-exportativo');

			fields['item[' + k + '][sobrecargo_predefinido_select]'] = $(item).data('sobrecargo-predefinido-data');
			fields['item[' + k + '][sobrecargo_predefinido_select]'] = $(item)[0].dataset.feepre;

		}

		if ($(item).next().length) {
			if ($(item).next().hasClass('title'))
				updateSubtotalTitulos($(item));
			//simon itemparent start
			if ($(item).next().hasClass('itemParent'))
				updateSubtotalTitulos($(item));

			//simon itemparent end
		}


		$.extend(data, data, fields);
		k++;
	});

//content
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


};


// 	console.warn("before----------  getDetail from negocios/script/library/content");
// var getDetail = function(callback) {	
// 	console.warn("----------  getDetail from negocios/script/library/content");
// 	$.ajax({
// 		url: '/4DACTION/_V3_getItemByCotizacion',
// 		dataType: 'json',
// 		data: {
// 			id: $('section.sheet').data('id')
// 		},
// 		cache: false,
// 		beforeSend: function() {
// 			unaBase.ui.block();
// 		},
// 		complete: function() {

// 		},
// 		success: function(data) {
// 			// guarda todos los items en business.item.docs(array de objectos)
// 			business.item.set(data);
// 			$('section.sheet').data('fetching', true);
// 			var current;

// 			current = $('<tbody>');

// 			var tituloAnterior;
// 			var hidden_items = false;
// 			for (var i = 0; i < data.rows.length; i++) {
// 				var item = data.rows[i];

// 				var htmlObject, margen_compra, margen_venta;
// 				if (item.titulo) {
// 					if (typeof tituloAnterior != 'undefined')
// 						updateSubtotalTitulos(tituloAnterior);
// 					htmlObject = getElement.titulo('appendTo', current);
// 					// Oculta título
// 					if (item.hidden)
// 						htmlObject.hide();
// 					tituloAnterior = htmlObject;
// 					if (typeof item.categoria != 'undefined')
// 						htmlObject.data('categoria', item.categoria.id);
// 				} else {

// 					htmlObject = getElement.item('appendTo', current);

// 					try{
// 						htmlObject[0].dataset.producto = item.producto.id;
// 					}catch(err){
// 						console.log(err);
// 					}
// 					// Oculta ítem
// 					htmlObject[0].dataset.hidden = item.hidden;
// 					if (item.hidden) {
// 						hidden_items = true;

// 						htmlObject.hide();
// 					}

// 					if (typeof item.producto != 'undefined')
// 						htmlObject.data('producto', item.producto.id);

// 					htmlObject.data('first-load', true);

// 					htmlObject.find('[name="item[][codigo]"]').val(item.codigo);
// 					htmlObject.find('[name="item[][cantidad]"]').val(item.cantidad).data('old-value', item.cantidad);
// 					htmlObject.find('[name="item[][factor]"]').val(item.factor).data('old-value', item.factor);
// 					htmlObject.find('[name="item[][precio_unitario]"]').val(item.precio.unitario / exchange_rate).data('old-value', item.precio.unitario / exchange_rate);


// 					if (item.porcentaje_monto_total == 0) {
// 						htmlObject.removeData('porcentaje-monto-total');
// 						htmlObject.find('[name="item[][precio_unitario]"]').removeProp('readonly');
// 						htmlObject.find('[name="item[][costo_unitario]"]').removeProp('readonly');
// 					} else {
// 						htmlObject.data('porcentaje-monto-total', item.porcentaje_monto_total);
// 						htmlObject.find('[name="item[][precio_unitario]"]').prop('readonly', true);
// 						htmlObject.find('[name="item[][costo_unitario]"]').prop('readonly', true);
// 					}

					
// 					// Fórmula productor ejecutivo
// 					if (item.formula_productor_ejecutivo) {
// 						htmlObject.data('formula-productor-ejecutivo', true);
// 						htmlObject.data('formula-productor-ejecutivo-ratio', item.formula_productor_ejecutivo_ratio);
// 						htmlObject.find('[name="item[][precio_unitario]"]').prop('readonly', true);
// 						htmlObject.find('[name="item[][costo_unitario]"]').prop('readonly', true);
// 						// Bloquear nombre, tipo documento y cantidades
// 						htmlObject.find('[name="item[][nombre]"]').prop('readonly', true);
// 						htmlObject.find('button.show.item').invisible();
// 						htmlObject.find('[name="item[][tipo_documento]"]').prop('readonly', true);
// 						htmlObject.find('button.show.tipo-documento').hide();
// 						htmlObject.find('[name="item[][cantidad]"]').prop('readonly', true);
// 						htmlObject.find('[name="item[][factor]"]').prop('readonly', true);
// 					} else {
// 						htmlObject.removeData('formula-productor-ejecutivo');
// 						htmlObject.removeData('formula-productor-ejecutivo-ratio');
// 					}

// 					// Fórmula asistente producción
// 					if (item.formula_asistente_produccion) {
// 						htmlObject.data('formula-asistente-produccion', true);
// 						htmlObject.find('[name="item[][precio_unitario]"]').prop('readonly', true);
// 						htmlObject.find('[name="item[][costo_unitario]"]').prop('readonly', true);
// 						// Bloquear nombre, tipo documento y cantidades
// 						htmlObject.find('[name="item[][nombre]"]').prop('readonly', true);
// 						htmlObject.find('button.show.item').invisible();
// 						htmlObject.find('[name="item[][tipo_documento]"]').prop('readonly', true);
// 						htmlObject.find('button.show.tipo-documento').hide();
// 						htmlObject.find('[name="item[][cantidad]"]').prop('readonly', true);
// 						htmlObject.find('[name="item[][factor]"]').prop('readonly', true);
// 					} else {
// 						htmlObject.removeData('formula-asistente-produccion');
// 					}

// 					// Fórmula horas extras
// 					if (item.formula_horas_extras) {
// 						htmlObject.data('formula-horas-extras', true);
// 						htmlObject.find('[name="item[][precio_unitario]"]').prop('readonly', true);
// 						htmlObject.find('[name="item[][costo_unitario]"]').prop('readonly', true);
// 						// Bloquear nombre, tipo documento y cantidades
// 						htmlObject.find('[name="item[][nombre]"]').prop('readonly', true);
// 						htmlObject.find('button.show.item').invisible();
// 						htmlObject.find('[name="item[][tipo_documento]"]').prop('readonly', true);
// 						htmlObject.find('button.show.tipo-documento').hide();
// 					} else {
// 						htmlObject.removeData('formula-horas-extras');
// 					}

// 					if (item.director_internacional) {
// 						htmlObject.data('director-internacional', true);
// 					} else {
// 						htmlObject.removeData('director-internacional');
// 					}

// 					if (item.porcentaje_monto_total || item.formula_productor_ejecutivo || item.formula_asistente_produccion || item.formula_horas_extras) {
// 						htmlObject.find('.remove.item').remove();
// 						htmlObject.find('.insert.item').remove();
// 						htmlObject.find('.clone.item').remove();
// 						htmlObject.find('.ui-icon-arrow-4').remove();
// 					}

// 					htmlObject.find('[name="item[][costo_unitario]"]').val(item.costo.presupuestado.unitario / exchange_rate).data('old-value', item.costo.presupuestado.unitario / exchange_rate);

// 					htmlObject.find('[name="item[][aplica_sobrecargo]"]').prop('checked', item.aplica_sobrecargo);

// 					htmlObject.find('[name="item[][costo_interno]"]').prop('checked', item.costo.interno / exchange_rate);

// 					htmlObject.data('observacion', item.observacion);
// 					htmlObject.data('comentario', item.comentario);

// 					if (!item.deletable)
// 						htmlObject.find('button.remove.item').invisible();

// 					htmlObject.data('hora-extra-enabled', item.hora_extra.enabled);
// 					htmlObject.data('hora-extra-factor', item.hora_extra.factor);
// 					htmlObject.data('hora-extra-jornada', item.hora_extra.jornada);
// 					htmlObject.data('base-imponible', item.hora_extra.base_imponible / exchange_rate);
// 					htmlObject.data('hora-extra-dias', item.hora_extra.dias);

// 					// Fix: para evitar que quede en blanco el tipo de documento
// 					htmlObject.data('tipo-documento', 30);
// 					htmlObject.find('input[name="item[][tipo_documento]"]').val('F');
// 					if (typeof item.tipo_documento != 'undefined' && item.tipo_documento.id != 30) {
// 						htmlObject.data('tipo-documento', item.tipo_documento.id);
// 						htmlObject.find('input[name="item[][tipo_documento]"]').val(item.tipo_documento.abbr);
// 						htmlObject.data('tipo-documento-text', item.tipo_documento.text);
// 						htmlObject.data('tipo-documento-ratio', item.tipo_documento.ratio);
// 						htmlObject.data('tipo-documento-valor-usd', item.tipo_documento.valor_usd); // Impuesto extranjero
// 						htmlObject.data('tipo-documento-inverse', item.tipo_documento.inverse);
// 						if (item.tipo_documento.ratio != 0) {
// 							htmlObject.find('[name="item[][precio_unitario]"]').addClass('edited');
// 							htmlObject.find('button.detail.price').visible();
// 						} else {
// 							htmlObject.find('[name="item[][precio_unitario]"]').removeClass('edited');
// 							htmlObject.find('button.detail.price').invisible();
// 						}
// 					} else {
// 						htmlObject.removeData('tipo-documento');
// 						htmlObject.removeData('tipo-documento-text');
// 						htmlObject.removeData('tipo-documento-ratio');
// 						htmlObject.removeData('tipo-documento-valor-usd'); // Impuesto extranjero
// 						htmlObject.removeData('tipo-documento-inverse');
// 						htmlObject.find('[name="item[][precio_unitario]"]').removeClass('edited');
// 						htmlObject.find('button.detail.price').invisible();
// 					}

// 					if (item.hora_extra.enabled) {
// 						htmlObject.find('[name="item[][horas_extras]"]').val(item.hora_extra.cantidad).parentTo('td').visible();
// 						if (item.hora_extra.cantidad > 0)
// 							htmlObject.find('[name="item[][precio_unitario]"]').addClass('special');
// 					} else
// 						htmlObject.find('[name="item[][horas_extras]"]').val(0).parentTo('td').invisible();

// 					htmlObject.data('costo-presupuestado-hh-cantidad', item.costo.presupuestado.hh.cantidad);
// 					htmlObject.data('costo-presupuestado-hh-valor', item.costo.presupuestado.hh.valor / exchange_rate);
// 					htmlObject.data('costo-presupuestado-hh-username', item.costo.presupuestado.hh.username);

// 					if (item.costo.presupuestado.hh.cantidad > 0 && item.costo.presupuestado.hh.valor > 0 && item.costo.interno) {
// 						htmlObject.find('[name="item[][subtotal_costo]"]').addClass('edited').trigger('refresh');
// 						htmlObject.find('button.detail.cost').visible();
// 					}

// 					if (typeof htmlObject.data('hora-extra-valor') == 'undefined')
// 						htmlObject.find('input[name="item[][horas_extras]"]').trigger('change');

// 					if (typeof copiar_precio_a_costo == 'boolean' && typeof fromTemplate != 'undefined')
// 						htmlObject.find('[name="item[][costo_unitario]"]').data('auto', true);


// 					// Datos de gasto real

// 					htmlObject.find('[name="item[][subtotal_costo_real]"]').val(item.costo.real.subtotal);
// 					htmlObject.find('[name="item[][utilidad_real]"]').val(item.precio.subtotal - item.costo.real.subtotal);

// 					if (!item.titulo) {
// 						htmlObject.data('costo-real-hh-cantidad', item.costo.real.hh.cantidad);
// 						htmlObject.data('costo-real-hh-total', item.costo.real.hh.total);

// 						if (item.costo.real.hh.total > 0 && item.costo.interno) {

// 							var old_costo_real = parseFloat(htmlObject.find('[name="item[][subtotal_costo_real]"]').val());
// 							if (isNaN(old_costo_real))
// 								old_costo_real = 0;

// 							var new_costo_real = old_costo_real + item.costo.real.hh.total;

// 							htmlObject.find('[name="item[][subtotal_costo_real]"]').val(new_costo_real);

// 							htmlObject.find('[name="item[][subtotal_costo_real]"]').addClass('edited').trigger('refresh');
// 							htmlObject.find('button.detail.cost-real').visible();
// 						} else {
// 							htmlObject.find('[name="item[][subtotal_costo_real]"]').removeClass('edited');
// 							htmlObject.find('button.detail.cost-real').invisible();
// 						}

// 						if (item.costo.real.hh.total == 0 && item.costo.presupuestado.hh.cantidad * item.costo.presupuestado.hh.valor == 0)
// 							htmlObject.find('input[name="item[][costo_interno]"]').invisible();
// 					}

// 					var margen_compra_real = ((item.precio.subtotal - item.costo.real.subtotal) / item.costo.real.subtotal * 100).toFixed(2);
// 					var margen_venta_real = ((item.precio.subtotal - item.costo.real.subtotal) / item.precio.subtotal * 100).toFixed(2);

// 					var diferencia_ratio = ((item.costo.presupuestado.subtotal - item.costo.real.subtotal) / item.costo.presupuestado.subtotal * 100).toFixed(2);

// 					htmlObject.find('[name="item[][margen_venta_real]"]').val((isFinite(margen_venta_real))? margen_venta_real : 0);
// 					htmlObject.find('[name="item[][margen_compra_real]"]').val((isFinite(margen_compra_real))? margen_compra_real : 0);

// 					htmlObject.find('[name="item[][diferencia]"]').val(item.costo.presupuestado.subtotal - item.costo.real.subtotal);
// 					htmlObject.find('[name="item[][diferencia_ratio]"]').val(diferencia_ratio);

// 					// Bloquear edición de gasto presupuestado solo si el ítem no está cerrado para compras, en caso de tener el parámetro activado
// 					if (v3_mod_gastop_compras_cerradas && !cerradoCompras && !item.closed_compras) {
// 						htmlObject.find('[name="item[][costo_unitario]"]').prop('readonly', true);
// 						htmlObject.find('[name="item[][subtotal_costo]"]').prop('readonly', true);
// 					}
// 				}

// 				htmlObject.find('[name="item[][subtotal_precio]"]').val(item.precio.subtotal / exchange_rate);
// 				htmlObject.find('[name="item[][subtotal_costo]"]').val(item.costo.presupuestado.subtotal / exchange_rate);
// 				htmlObject.find('[name="item[][utilidad]"]').val((item.precio.subtotal - item.costo.presupuestado.subtotal) / exchange_rate);

// 				if (margen_desde_compra_inverso)
// 					margen_compra = ((1 - item.costo.presupuestado.subtotal / item.precio.subtotal) * 100).toFixed(2);
// 				else
// 					margen_compra = ((item.precio.subtotal - item.costo.presupuestado.subtotal) / item.costo.presupuestado.subtotal * 100).toFixed(2);

// 				margen_venta = ((item.precio.subtotal - item.costo.presupuestado.subtotal) / item.precio.subtotal * 100).toFixed(2);

// 				htmlObject.find('[name="item[][margen_venta]"]').val(margen_venta);
// 				htmlObject.find('[name="item[][margen_compra]"]').val(margen_compra);

// 				if (!isFinite(margen_venta))
// 					htmlObject.find('[name="item[][margen_venta]"]').invisible();
// 				else
// 					htmlObject.find('[name="item[][margen_venta]"]').visible();

// 				if (!isFinite(margen_compra))
// 					htmlObject.find('[name="item[][margen_compra]"]').invisible();
// 				else
// 					htmlObject.find('[name="item[][margen_compra]"]').visible();

// 				htmlObject.data('id', item.id);
// 				htmlObject[0].dataset.id = item.id;
// 				htmlObject.data('index', item.index);
// 				htmlObject.find('input[name="item[][nombre]"]').val(item.nombre);
// 				htmlObject.find('input[name="item[][nombre]"]').data('nombre-original', item.text);

// 				var tooltip = ' \
// 								<p>Nombre ítem:</p> \
// 								<p>' + item.text + '</p> \
// 								<p>&nbsp;</p> \
// 								<p>Descripción larga:</p> \
// 								<p>' + ((item.observacion!= '')? item.observacion.replace(/\n/g, '</p><p>') : 'N/A') + '</p> \
// 							';
// 				htmlObject.find('button.profile.item').tooltipster('update', tooltip);

// 				// Mostrar signo de admiración (ui-icon-notice) si el ítem tiene comentario
// 	            // caso contrario mostrar ícono normal (ui-icon-gear)
// 	            if (item.comentario != '') {
// 	                htmlObject.find('button.profile.item').removeClass('ui-icon-gear').addClass('ui-icon-notice');
// 	            } else {
// 	                htmlObject.find('button.profile.item').removeClass('ui-icon-notice').addClass('ui-icon-gear');
// 	            }

// 				if (item.text != item.nombre)
// 					htmlObject.find('[name="item[][nombre]"]').addClass('edited');
// 				else
// 					htmlObject.find('[name="item[][nombre]"]').removeClass('edited');

// 			}

// 			// verifica si tiene sobrecargo cinemagica activado
// 			if(unaBase.doc.modoCine){
// 				// Sección datos cinemágica
// 				htmlObject.data('costo-directo', item.costo_directo);
// 				htmlObject.data('costo-admin', item.costo_admin); // Fórmula productor ejecutivo


// 				// Mostrar subtotal venta distinto de cero en amarillo
// 				if (!item.titulo && parseFloat(htmlObject.find('[name="item[][subtotal_precio]"]').val()) != 0) {
// 					htmlObject.find('[name="item[][subtotal_precio]"]').addClass('filled');
// 				}
// 			}

// 			if (hidden_items)
// 				$('table.items > tfoot').invisible();

// 			if (typeof tituloAnterior != 'undefined') {
// 				updateSubtotalTitulos(tituloAnterior);
// 				tituloAnterior = undefined;
// 			}


// 			var items = $('section.sheet table.items > tbody > tr:not(.title)').length;
// 			$('section.sheet table.items > tfoot > tr .info:eq(0)').html(items + ' ítem' + ((items > 1)? 's' : ''));

// 			updateSubtotalItems();

// 			current.find('> *').each(function() {
// 				$(this).appendTo($('table.items tbody'));
// 			});
// 			unaBase.ui.unblock();

// 			if ($('section.sheet').data('index'))
// 				$('section.sheet table > thead button.toggle.all').triggerHandler('click');
// 			if (typeof callback != 'undefined')
// 				callback();
// 			if(unaBase.doc.modoCine){
// 				updateVistaItems(true);
// 				$('section.sheet').removeData('fetching');
							
// 				calcValoresCinemagica();
// 			}
// 			$('section.sheet table.items > tbody > tr').each(function() {
// 				$(this).data('first-load', false);
// 			});

// 			$('section.sheet table.items > tfoot > tr > th.info').trigger('refresh');
// 		},
// 		error: function() {
// 			toastr.error('No se pudieron mostrar los items de la cotización');
// 			// manejar esta situación
// 		}
// 	});

// };




// change cotneg >>>>>
// var afterEditEmpresa = function(element) {
// 	var target = $(element).parentTo('ul');

// 	target.find('input[name="cotizacion[empresa][id]"]')
// 		.attr('type', 'search')
// 		.autocomplete('enable');
// 	target.find('input[name="cotizacion[empresa][id]"]').attr('placeholder', 'Buscar por alias, RUT, razón social...');

// 	target.find('input[name="cotizacion[empresa][razon_social]"]').attr('readonly', true);

// 	target.find('input[name="cotizacion[empresa][id]"]').focus();
// 	target.find('button.empresa.edit').hide();

// 	if ($('input[name="cotizacion[empresa][id]"]').val() != '' || $('input[name="cotizacion[empresa][razon_social]"]').val() != '')
// 		target.find('button.empresa.unlock, button.empresa.profile').show();
// };
// change cotneg <<<<<

//TODO: verificar con netcog
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
// change cotneg >>>>>
// var afterEditContacto = function(element) {
// 	var target = $(element).parentTo('ul');
// 	target.find('input[name="cotizacion[empresa][contacto][id]"]')
// 		.attr('type', 'search')
// 		.autocomplete('enable');
// 	target.find('input[name="cotizacion[empresa][contacto][id]"]').attr('placeholder', 'Buscar por Nombre y/o Apellidos');
// 	target.find('input[name="cotizacion[empresa][contacto][cargo]"], input[name="cotizacion[empresa][contacto][email]"]')
// 		.attr('readonly', true);
// 	target.find('input[name="empresa[contacto][id]"]').focus();
// 	target.find('button.contacto.edit').hide();

// 	/*if (
// 		$('input[name="cotizacion[empresa][contacto][id]"').val() != ''
// 	)*/ // revisar
// 		target.find('button.unlock.contacto, button.show.contacto, button.profile.contacto').show();
// };
// change cotneg <<<<<

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
				            //if (item.comentario != '') {
				            if (item.observacion != '') {
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
