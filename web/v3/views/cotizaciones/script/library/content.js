
// if (typeof selected_currency == 'undefined')
// 	var localCurrency = currency.symbol;
// else {
// 	var localCurrency = currency.symbol;
// }
var localCurrency = ""


var updateIndexes = function (callback) {

	return new Promise((resolve, reject) => {

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

		if (_V3_defaultCurrencyCode != selected_currency) {
			utilities.general.getGeneralParams()
			exchange_rate = parseFloat(unaBase.doc.generalParams.currencies.find(e => e.codigo == selected_currency).value.replaceAll('.', '').replaceAll(',', '.'))
		}



		$('#tabs-2 section.sheet table > tbody > tr').each(function (key, item) {


			index += increment;
			$(item).data('index', index);
			field = $(item).find('input[name="item[][nombre]"]');

			if ($(item).hasClass('title')) {
				parent = $(item).data('id');

				//EXPERIMENTO
				fields['item[' + k + '][newline]'] = $(item).data('newline') || false;

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
				//EXPERIMENTO
				fields['item[' + k + '][newline]'] = $(item).data('newline') || false;
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
				//EXPERIMENTO

				fields['item[' + k + '][newline]'] = $(item).data('newline') || false;
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
				// fields['item[' + k + '][porcentaje_monto_total]'] = parseFloat($(item).data('porcentaje-monto-total') ).toString().replace(/\./g, ',');
				fields['item[' + k + '][formula_productor_ejecutivo]'] = $(item).data('formula-productor-ejecutivo'); // Fórmula productor ejecutivo
				fields['item[' + k + '][item_acumula_impuesto]'] = $(item).data('item_acumula_impuesto'); // ACUMULA IMPUESTO
				fields['item[' + k + '][formula_asistente_produccion]'] = $(item).data('formula-asistente-produccion'); // Fórmula asistente producción
				fields['item[' + k + '][formula_productor_ejecutivo_ratio]'] = parseFloat($(item).data('formula-productor-ejecutivo-ratio')).toString().replace(/\./g, ','); // Fórmula productor ejecutivo
				fields['item[' + k + '][formula_horas_extras]'] = $(item).data('formula-horas-extras'); // Fórmula horas extras
				fields['item[' + k + '][director_internacional]'] = $(item).data('director-internacional');
				// Corrección cuando se ocultan decimales
				//fields['item[' + k + '][precio_unitario]'] = (parseFloat($(item).find('[name="item[][precio_unitario]"]').val()) * exchange_rate).toString().replace(/\./g, ',');
				if (item.classList.contains('itemParent')) {
					fields['item[' + k + '][precio_unitario]'] = "0";
					fields['item[' + k + '][subtotal_precio]'] = (unaBase.utilities.transformNumber($(item).find('[name="item[][subtotal_precio]"]')[0].value) * exchange_rate).toString().replace(/\./g, ',');
					fields['item[' + k + '][costo_unitario]'] = "0"
					fields['item[' + k + '][subtotal_costo]'] = (parseFloat($(item).find('[name="item[][subtotal_costo]"]').val()) * exchange_rate).toString().replace(/\./g, ',');

				} else {
					if ($(item).find('[name="item[][precio_unitario]"]').data('old-value'))
						fields['item[' + k + '][precio_unitario]'] = (parseFloat($(item).find('[name="item[][precio_unitario]"]').data('old-value')) * exchange_rate).toString().replace(/\./g, ',');
					else
						fields['item[' + k + '][precio_unitario]'] = (parseFloat($(item).find('[name="item[][precio_unitario]"]').val()) * exchange_rate).toString().replace(/\./g, ',');

					fields['item[' + k + '][subtotal_precio]'] = (parseFloat($(item).find('[name="item[][subtotal_precio]"]').val()) * exchange_rate).toString().replace(/\./g, ',');
					fields['item[' + k + '][costo_unitario]'] = (parseFloat(($(item).find('[name="item[][costo_unitario]"]').data('old-value')) ? $(item).find('[name="item[][costo_unitario]"]').data('old-value') : $(item).find('[name="item[][costo_unitario]"]').val()) * exchange_rate).toString().replace(/\./g, ',');
					fields['item[' + k + '][subtotal_costo]'] = (parseFloat($(item).find('[name="item[][subtotal_costo]"]').val()) * exchange_rate).toString().replace(/\./g, ',');


				}





				fields['item[' + k + '][costo_unitario_previo]'] = (parseFloat(($(item).find('[name="item[][costo_unitario]"]').data('old-value')) ? $(item).find('[name="item[][costo_unitario]"]').data('old-value') : $(item).find('[name="item[][costo_unitario]"]').val()) * exchange_rate).toString().replace(/\./g, ',');
				fields['item[' + k + '][subtotal_costo_previo]'] = (parseFloat($(item).find('[name="item[][subtotal_costo]"]').val()) * exchange_rate).toString().replace(/\./g, ',');

				fields['item[' + k + '][utilidad]'] = (parseFloat($(item).find('[name="item[][utilidad]"]').val()) * exchange_rate).toString().replace(/\./g, ',');
				fields['item[' + k + '][margen_compra]'] = parseFloat($(item).find('[name="item[][margen_compra]"]').val());
				fields['item[' + k + '][margen_venta]'] = parseFloat($(item).find('[name="item[][margen_venta]"]').val());
				if(item.classList.contains('itemParent')==false){
					if(unaBase.doc.separate_sc){
						fields['item[' + k + '][aplica_sobrecargo]'] = false;
						fields['item[' + k + '][separate_sc]'] =   $(item).find('[name="item[][separate_sc]"]')[0].options[$(item).find('[name="item[][separate_sc]"]')[0].selectedIndex].value
					}
					else
					fields['item[' + k + '][aplica_sobrecargo]'] = $(item).find('[name="item[][aplica_sobrecargo]"]').prop('checked');

				}
				else
					fields['item[' + k + '][aplica_sobrecargo]'] = false;

				fields['item[' + k + '][costo_interno]'] = $(item).find('[name="item[][costo_interno]"]').prop('checked');
				fields['item[' + k + '][ocultar_print]'] = $(item).find('[name="item[][ocultar_print]"]').prop('checked');
				fields['item[' + k + '][mostrar_carta_cliente]'] = $(item).find('[name="item[][mostrar_carta_cliente]"]').prop('checked');
				fields['item[' + k + '][observacion]'] = $(item).data('observacion');
				fields['item[' + k + '][comentario]'] = $(item).data('comentario');
				fields['item[' + k + '][isParent]'] = item.classList.contains('itemParent');
				fields['item[' + k + '][isChild]'] = item.classList.contains('childItem');
				fields['item[' + k + '][itemParent]'] = item.dataset.itemparent;

				fields['item[' + k + '][tipo_documento]'] = $(item).data('tipo-documento');
				fields['item[' + k + '][tipo_documento][ratio]'] = $(item).data('tipo-documento-ratio');
				fields['item[' + k + '][tipo_documento][valor_usd]'] = $(item).data('tipo-documento-valor-usd'); // Impuesto extranjero
				fields['item[' + k + '][tipo_documento][valor_moneda]'] = $(item).data('tipo-documento-valor-moneda') ? $(item).data('tipo-documento-valor-moneda').toString().replace(/\./g, ',') : 0; // Impuesto extranjero
				fields['item[' + k + '][tipo_documento][inverse]'] = $(item).data('tipo-documento-inverse');

				fields['item[' + k + '][tipo_documento_compras]'] = $(item).data('tipo-documento-compras');
				fields['item[' + k + '][tipo_documento_compras][ratio]'] = $(item).data('tipo-documento-compras-ratio');
				fields['item[' + k + '][tipo_documento_compras][valor_usd]'] = $(item).data('tipo-documento-compras-valor-usd'); // Impuesto extranjero
				fields['item[' + k + '][tipo_documento_compras][valor_moneda]'] = $(item).data('tipo-documento-compras-valor-moneda') ? $(item).data('tipo-documento-compras-valor-moneda').toString().replace(/\./g, ',') : 0; // Impuesto extranjero
				fields['item[' + k + '][tipo_documento_compras][inverse]'] = $(item).data('tipo-documento-compras-inverse');

				fields['item[' + k + '][auto_percent][value]'] = unaBase.utilities.transformNumber(item.dataset.auto_percent_value, 'int');
				fields['item[' + k + '][hora_extra][factor]'] = $(item).data('hora-extra-factor');
				fields['item[' + k + '][hora_extra][jornada]'] = $(item).data('hora-extra-jornada');
				fields['item[' + k + '][precio_unitario][base_imponible]'] = (parseFloat($(item).data('base-imponible')) * exchange_rate).toString().replace(/\./g, ',');
				fields['item[' + k + '][costo_unitario][base_imponible_compras]'] = (parseFloat($(item).data('base-imponible-compras')) * exchange_rate).toString().replace(/\./g, ',');
				fields['item[' + k + '][hora_extra][valor]'] = $(item).data('hora-extra-valor');

				fields['item[' + k + '][cant_hh_asig]'] = $(item).data('costo-presupuestado-hh-cantidad');
				fields['item[' + k + '][costo_hh_unitario]'] = $(item).data('costo-presupuestado-hh-valor');
				fields['item[' + k + '][responsable_asig]'] = $(item).data('costo-presupuestado-hh-username');

				fields['item[' + k + '][closed_compras]'] = $(item).data('closed-compras');

				fields['item[' + k + '][preset_margen]'] = $(item).data('preset-margen');
				fields['item[' + k + '][preset_margen_value]'] = $(item).data('preset-margen-value');

				// Sección datos cinemágica
				fields['item[' + k + '][costo_directo]'] = $(item).data('costo-directo');
				fields['item[' + k + '][costo_admin]'] = $(item).data('costo-admin'); // Fórmula productor ejecutivo

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


				fields['item[' + k + '][id_nv_temp_sica]'] = $(item).data('tempnvsica')

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

		var retval = true;


		$.ajax({
			url: '/4DACTION/_V3_batchItemByCotizacion',
			dataType: 'json',
			data: data,
			type: 'POST',
			cache: false,
			async: false,
			success: function (data) {
				if (data.success) {

					// Desbloquear vista previa y compartir en caso de éxito
					$('#menu [data-name="preview"]').show();

					//verificar cinemagica
					if ($('section.sheet').find('.validation-status').text() != 'No validada') {
						if (access._519) {
							$('[data-name="share"]').show();
						}
					}
					if (typeof callback != 'undefined')
						callback()


					resolve()

				} else {
					reject()
					retval = false;

					if (data.valid)
						toastr.error(NOTIFY.get('ERROR_RECORD_READONLY_ITEM'));
					else
						alert('Se encontró diferencias en las cantidades y precios unitarios de los ítems. Por favor, verificar antes de guardar la cotización.');
					unaBase.ui.unblock();
				}
				return retval;

			}
		}).fail(function (err, err2, err3) {
			// Bloquear vista previa y compartir en caso de error
			$('#menu [data-name="preview"]').hide();
			$('#menu [data-name="share"]').hide();

			toastr.error('No se pudieron guardar los ítems de la cotización, posiblemente debido a un error en los datos. Por favor, comunicarse con Soporte Unabase.');
			unaBase.ui.unblock();
			retval = false;
			reject()
			return retval;

		});
	});
};



//verificar cinemagica
var updateSubtotalItems = function () {


	let target = $('table.items.cotizacion > tbody');


	let items = document.querySelectorAll("table.items.cotizacion > tbody tr:not(.title):not(.itemParent)");
	let subtotal_precios = 0;
	let subtotal_costos = 0;
	let subtotal_utilidades = 0;
	let aplica_sobrecargo = 0;
	let director_internacional = 0;

	let sumaMontoAplicables = 0;
	for (let i = 0; i < arrSobregargosPreFinal.length; i++) {
		arrSobregargosPreFinal[i].monto_aplicable = 0;
	}

	for (let item of items) {
		sItem = $(item);
		let applySobrecargo = false
		let currentSubtotalItem = parseFloat(sItem.find('[name="item[][subtotal_precio]"]').val());
		if(unaBase.doc.separate_sc)
			applySobrecargo = sItem.find('[name="item[][aplica_sobrecargo]"]').prop('checked');

		subtotal_precios += currentSubtotalItem;
		subtotal_costos += parseFloat(sItem.find('[name="item[][subtotal_costo]"]').val());
		subtotal_utilidades += parseFloat(sItem.find('[name="item[][utilidad]"]').val());

		sItem.find('[name="item[][aplica_sobrecargo]"]').each(function () {
			let qItem = $(this);
			let subtarget;
			//if (qItem.prop('checked') && !qItem.closest('tr').data('director-internacional')) {
			if (qItem.prop('checked')) {
				subtarget = qItem.parentTo('tr').find('[name="item[][subtotal_precio]"]');
				aplica_sobrecargo += parseFloat(subtarget.val());
			}
			if (qItem.closest('tr').data('director-internacional')) {
				subtarget = qItem.parentTo('tr').find('[name="item[][subtotal_precio]"]');
				director_internacional += parseFloat(subtarget.val());
			}
		});

		//---------- INI ---------- "
		let sobrecargoName = sItem.data("sobrecargo-predefinido-data");
		if (sobrecargoName != "" && applySobrecargo) {
			for (let i = 0; i < arrSobregargosPreFinal.length; i++) {
				if (arrSobregargosPreFinal[i].sobrecargo == sobrecargoName) {
					arrSobregargosPreFinal[i].monto_aplicable += currentSubtotalItem;
				}
			}
		}
		//---------- FIN ---------- "
	}


	// target.find('tr').not('.title').each(function() {

	// 	let currentSubtotalItem = parseFloat($(this).find('[name="item[][subtotal_precio]"]').val());
	// 	let applySobrecargo = $(this).find('[name="item[][aplica_sobrecargo]"]').prop('checked');

	// 	subtotal_precios+= parseFloat($(this).find('[name="item[][subtotal_precio]"]').val());
	// 	subtotal_costos+= parseFloat($(this).find('[name="item[][subtotal_costo]"]').val());
	// 	subtotal_utilidades+= parseFloat($(this).find('[name="item[][utilidad]"]').val());

	// 	$(this).find('[name="item[][aplica_sobrecargo]"]').each(function() {
	// 		let subtarget;
	// 		//if ($(this).prop('checked') && !$(this).closest('tr').data('director-internacional')) {
	// 		if ($(this).prop('checked')) {
	// 			subtarget = $(this).parentTo('tr').find('[name="item[][subtotal_precio]"]');
	// 			aplica_sobrecargo+= parseFloat(subtarget.val());
	// 		}
	// 		if ($(this).closest('tr').data('director-internacional')) {
	// 			subtarget = $(this).parentTo('tr').find('[name="item[][subtotal_precio]"]');
	// 			director_internacional+= parseFloat(subtarget.val());
	// 		}
	// 	});

	// 	//---------- INI ---------- "
	// 	let sobrecargoName = $(this).data("sobrecargo-predefinido-data");
	// 	if (sobrecargoName != "" && applySobrecargo) {
	// 		for (let i = 0; i < arrSobregargosPreFinal.length; i++) {
	// 			if (arrSobregargosPreFinal[i].sobrecargo == sobrecargoName) {
	// 				arrSobregargosPreFinal[i].monto_aplicable += currentSubtotalItem;
	// 			}
	// 		}
	// 	}
	// 	//---------- FIN ---------- "

	// });


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



	//REAPER OPTIMIZACION TEST
	//if(!unaBase.doc.modoCine){
	if (unaBase.doc.modoCine) {
		// Optimización cálculos cinemágica
		if (!$('section.sheet').data('no-update')) {
			for (var i = 0; i <= 24; i++) {
				sobrecargos.updateSobrecargos();
			}

		} else {
			sobrecargos.updateSobrecargos();
		}
		// console.log('updateSubtotalItems: después del for');

		// console.log('Sale de updateSubtotalItems');

		if (v3_sobrecargos_cinemagica) {
			refreshValorPeliculaFromSobrecargos();
			refreshCostosDirectos();
			// Actualizar utilidad de valor película (disabled)
			//$('.block-totales [name="sobrecargo[1][porcentaje]"]').val(25).trigger('blur');
			//refreshValorPeliculaFromSobrecargos();
		}

	} else {
		sobrecargos.updateSobrecargos();
	}


};

//verificar cinemagica
var updateSubtotalTitulos = function (element) {

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
			//HOLAAAA2
			if (current.css('visibility') != 'hidden' && !current.hasClass('ui-draggable-dragging') && !current.hasClass('itemParent')) {
				subtotal_precios += parseFloat(current.find('[name="item[][subtotal_precio]"]').val());
				subtotal_costos += parseFloat(current.find('[name="item[][subtotal_costo]"]').val());
				subtotal_utilidades += parseFloat(current.find('[name="item[][utilidad]"]').val());
			}

			current = current.next();

		} while (!current.hasClass('title') && current.length > 0);
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
var updateRow = function (event) {

	var target = $(event.target).parentTo('tr');

	if ($(event.target).prop('name') == 'item[][nombre]')
		target.find('button.detail.item').prop('title', target.find('[name="item[][nombre]"]').val());


	if ($(event.target).prop('type') == 'number')
		$(event.target).validateNumbers();

	// if (typeof copiar_precio_a_costo == 'boolean' && !margen_desde_compra) {
	if (typeof copiar_precio_a_costo == 'boolean') {

		var costo_unitario = target.find('[name="item[][costo_unitario]"]');
		if ($(event.target).prop('name') == 'item[][precio_unitario]') {


			if (typeof copiar_precio_a_costo == 'boolean' && $(event.target).data('old-value') == costo_unitario.val()) {
				costo_unitario.data('auto', true);
			} else {

				//REAPER  -->comentado , desactiva el auto change costo unitario cuando modifico el precio venta
				//costo_unitario.data('auto', false);
			}

			if (costo_unitario.data('auto')) {
				// Corrección oculta decimales
				//costo_unitario.val($(event.target).val());
				if ($(event.target).data('old-value') && $(event.target).data('old-value') == costo_unitario.val())
					costo_unitario.val($(event.target).data('value'));
				// else
				// 	costo_unitario.val($(event.target).val());

			}
		}
	}
	if (typeof copiar_precio_a_costo != 'boolean') {
		$(event.target).parentTo('tr').find('[name="item[][costo_unitario]"]').removeData('auto');
	}

	var is_auto = $(event.target).parentTo('tr').find('[name="item[][costo_unitario]"]').data('auto');

	if ($(event.target).prop('name') == 'item[][costo_unitario]' && typeof event.originalEvent != 'undefined') {
		if (!unaBase.parametros.valorventa_mismo_valorcosto) {
			$(event.target).removeData('auto');
		}
	}


	var target = $(event.target).parentTo('tr');

	var cantidad = target.find('[name="item[][cantidad]"]').data('old-value');
	var factor = target.find('[name="item[][factor]"]').data('old-value');
	var costo_unitario = 0

	if (typeof $(event.target).parentTo('tr').data('porcentaje-monto-total') != 'undefined' && $(event.target).parentTo('tr').data('porcentaje-monto-total') > 0) {
		var porcentaje_monto_total = $(event.target).parentTo('tr').data('porcentaje-monto-total');
		var formula_productor_ejecutivo = $(event.target).parentTo('tr').data('formula-productor-ejecutivo'); // Fórmula productor ejecutivo
		var formula_asistente_produccion = $(event.target).parentTo('tr').data('formula-asistente-produccion'); // Fórmula asistente producción
		var formula_horas_extras = $(event.target).parentTo('tr').data('formula-horas-extras'); // Fórmula horas extras
		var director_internacional = $(event.target).parentTo('tr').data('director-internacional');
		// var total_a_cliente = $('[name="sobrecargo[5][subtotal]"]').val();
		var porcentaje_sc_6 = (typeof $('.block-totales input[name="sobrecargo[6][porcentaje]"]').val() != 'undefined') ? parseFloat($('.block-totales input[name="sobrecargo[6][porcentaje]"]').val()) : 0;

		// (if cinemagica tomar el total a cliente, sino el valor que está en la siguiente fórmula)
		if (v3_sobrecargos_cinemagica) {
			var total_a_cliente = parseFloat($('input[name="cotizacion[ajuste]"]').val());
		} else {
			var total_a_cliente = parseFloat($('input[name="cotizacion[ajuste]"]').val()) - parseFloat($('input[name="cotizacion[ajuste]"]').val()) * parseFloat(porcentaje_sc_6 / 100.00);
		}

		var total_a_cliente = parseFloat($('input[name="cotizacion[ajuste]"]').val());
		//REAPER -----test ----08-09-2021

		target.find('[name="item[][precio_unitario]"]').val((total_a_cliente - (total_a_cliente * (1 - porcentaje_monto_total))) / cantidad / factor);
		// Corrección cuando se ocultan decimales
		//var precio_unitario = target.find('[name="item[][precio_unitario]"]').val();
		// if (target.find('[name="item[][precio_unitario]"]').data('old-value'))
		// 	var precio_unitario = target.find('[name="item[][precio_unitario]"]').data('old-value');
		// else
		// 	var precio_unitario = target.find('[name="item[][precio_unitario]"]').val();

		var precio_unitario = target.find('[name="item[][precio_unitario]"]').val();
		target.find('[name="item[][precio_unitario]"]').data('old-value', precio_unitario);

		//END REAPER ----test

	} else {


		//REAPER COMENTADO: 
		// Corrección cuando se ocultan decimales
		var precio_unitario = target.find('[name="item[][precio_unitario]"]').val();
		// if (target.find('[name="item[][precio_unitario]"]').data('old-value'))
		// 	var precio_unitario = target.find('[name="item[][precio_unitario]"]').data('old-value');
		// else
		// 	var precio_unitario = target.find('[name="item[][precio_unitario]"]').val();
	}



	if (subtotal_gasto_p_manual && $(event.target).prop('name') == 'item[][subtotal_costo]') {
		if (unaBase.no_cant_subcosto_manual)
			costo_unitario = parseFloat(target.find('[name="item[][subtotal_costo]"]').val());
		else
			costo_unitario = parseFloat(target.find('[name="item[][subtotal_costo]"]').val()) / (parseFloat(target.find('[name="item[][cantidad]"]').data('old-value')) * parseFloat(target.find('[name="item[][factor]"]').data('old-value')));


		target.find('[name="item[][costo_unitario]"]').val(costo_unitario).data('old-value', costo_unitario);
	} else
		var costo_unitario = parseFloat(target.find('[name="item[][costo_unitario]"]').val());
	//var costo_unitario = (target.find('[name="item[][costo_unitario]"]').data('old-value'))? target.find('[name="item[][costo_unitario]"]').data('old-value') : target.find('[name="item[][costo_unitario]"]').val();

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
					precio_unitario = costo_unitario / (1 - (margen_compra / 100));
				else
					precio_unitario = costo_unitario * (1 + margen_compra / 100);

				target.find('[name="item[][precio_unitario]"]').val(precio_unitario).data('old-value', precio_unitario);
			} else {
				// Corrección cuando se ocultan decimales
				//precio_unitario = target.find('[name="item[][precio_unitario]"]').val();

				//REAPER---> comentado: estupidez humana
				// if (target.find('[name="item[][precio_unitario]"]').data('old-value'))
				// 	precio_unitario = target.find('[name="item[][precio_unitario]"]').data('old-value');
				// else
				// 	precio_unitario = target.find('[name="item[][precio_unitario]"]').val();
				precio_unitario = target.find('[name="item[][precio_unitario]"]').val();

				target.find('[name="item[][costo_unitario]"]').val(precio_unitario).data('old-value', precio_unitario).trigger('blur');
			}

			subtotal_precio = cantidad * factor * precio_unitario;
			subtotal_costo = (target.find('[name="item[][subtotal_costo]"]').hasClass('edited')) ? cantidad * factor * costo_unitario + costo_presupuestado_interno : cantidad * factor * costo_unitario;
		} else {
			// Corrección cuando se ocultan decimales
			//precio_unitario = target.find('[name="item[][precio_unitario]"]').val();
			if (target.find('[name="item[][precio_unitario]"]').data('old-value'))
				precio_unitario = target.find('[name="item[][precio_unitario]"]').data('old-value');
			else
				precio_unitario = target.find('[name="item[][precio_unitario]"]').val();

			subtotal_precio = cantidad * factor * precio_unitario;
			subtotal_costo = (target.find('[name="item[][subtotal_costo]"]').hasClass('edited')) ? cantidad * factor * costo_unitario + costo_presupuestado_interno : cantidad * factor * costo_unitario;

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


			subtotal_precio = cantidad * factor * (unaBase.utilities.transformNumber(precio_unitario).toFixed(currency.decimals));
			subtotal_costo = (target.find('[name="item[][subtotal_costo]"]').hasClass('edited')) ? cantidad * factor * costo_unitario + costo_presupuestado_interno : cantidad * factor * costo_unitario;
		} else {
			//costo_unitario = (target.find('[name="item[][costo_unitario]"]').data('old-value'))? target.find('[name="item[][costo_unitario]"]').data('old-value') : target.find('[name="item[][costo_unitario]"]').val();
			costo_unitario = parseFloat(target.find('[name="item[][costo_unitario]"]').val());

			//REAPER para el camlulo correcto---problema de decimales en queguay--- cambio borrado, volver a revisar //RECHECK
			//subtotal_precio = cantidad * factor * precio_unitario;

			if (unaBase.no_cant_subcosto_manual)
				subtotal_costo = (target.find('[name="item[][subtotal_costo]"]').hasClass('edited')) ? costo_unitario + costo_presupuestado_interno : costo_unitario;
			else
				subtotal_costo = (target.find('[name="item[][subtotal_costo]"]').hasClass('edited')) ? cantidad * factor * costo_unitario + costo_presupuestado_interno : cantidad * factor * costo_unitario;

			subtotal_precio = cantidad * factor * precio_unitario;
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


	//FIX HORAS EXTRAS al cambiar manualmente el precio unitario
	if($(event.target).prop('name')=="item[][precio_unitario]"){
		// FIX NUEVO REAPER 03-03-2024
		if($(event.target).data('old-value')!= $(event.target).data('original-value'))
			if($(event.target).data('original-value')!= undefined)
				$(event.target).parentTo('tr').data('base-imponible',  parseFloat($(event.target).parentTo('tr').find('input[name="item[][precio_unitario]"]').val()))
	}

	if($(event.target).prop('name')=="item[][costo_unitario]"){
		// FIX NUEVO REAPER 15-05-2024
		if($(event.target).data('old-value')!= $(event.target).data('original-value'))
			if($(event.target).data('original-value')!= undefined)
				$(event.target).parentTo('tr').data('baseImponibleCompras',  parseFloat($(event.target).parentTo('tr').find('input[name="item[][costo_unitario]"]').val()))
	}


	if (!modoOffline) {
		if (target.data('first-load') !== true && target.data('no-update') === undefined) {

			if (!target[0].classList.contains('title')) {
				updateSubtotalParents($(event.target))
			}
			updateSubtotalTitulos($(event.target));
			updateSubtotalItems();

			// Sección datos cinemágica
			refreshCostosDirectos();

			if (subtotal_gasto_p_manual && $(event.target).prop('name') == 'item[][subtotal_costo]')
				target.find('[name="item[][costo_unitario]"]').trigger('blur')
		}
	}


};

const setTipoDocumento = (htmlObject, item, tiposDocumento, path) => {
	try {
		var selectObject = htmlObject[0].querySelector(`select[name="item[][${path}]"]`);
		let id_documento = path == 'tipo_documento' && item.tipo_documento != undefined ? item.tipo_documento.id : item.tipo_documento_compras != undefined ? item.tipo_documento_compras.id : '';

		// Limpia todas las opciones anteriores
		selectObject.innerHTML = '';

		var defaultOption = document.createElement('option');
		defaultOption.text = 'Tipo doc';
		defaultOption.value = '';
		defaultOption.disabled = true;
		selectObject.appendChild(defaultOption);

		let tipo = path == 'tipo_documento' ? item.tipo_documento : item.tipo_documento_compras
		let optionsTipos = []
		let exist = 0

		optionsTipos = tiposDocumento

		if (tipo != undefined) {
			exist = optionsTipos.findIndex(v => v.id == tipo.id)
			if (exist < 0) {
				optionsTipos.push(tipo)
			}

		}

		optionsTipos.forEach((tipoDocumento) => {
			var option = document.createElement('option');
			option.text = tipoDocumento.text;
			option.value = tipoDocumento.id;
			option.dataset.id = tipoDocumento.id;
			option.dataset.abbr = tipoDocumento.abbr;
			option.dataset.text = tipoDocumento.text;
			selectObject.appendChild(option);
		});

		if (exist < 0) {
			let index = optionsTipos.findIndex(v => v.id == tipo.id)

			optionsTipos.splice(index, 1)
		}

		selectObject.value = id_documento;

		// Cuando se selecciona una opción, cambia su texto a su abreviatura
		selectObject.addEventListener('change', function () {
			if (this.selectedIndex > 0) {
				this.options[this.selectedIndex].text = this.options[this.selectedIndex].dataset.abbr;
			}
		});

		// Cuando se hace clic en el select, restablece el texto de todas las opciones a su nombre completo
		selectObject.addEventListener('mousedown', function () {
			for (let i = 1; i < this.options.length; i++) {
				this.options[i].text = this.options[i].dataset.text;
			}
		});

		// Cuando el select pierde el foco, cambia el texto de la opción seleccionada a su abreviatura
		selectObject.addEventListener('blur', function () {
			if (this.selectedIndex > 0) {
				this.options[this.selectedIndex].text = this.options[this.selectedIndex].dataset.abbr;
			}
		});

		// Dispara el evento change manualmente para establecer el texto correcto en la opción seleccionada inicialmente
		var event = new Event('change');
		selectObject.dispatchEvent(event);
	} catch (ex) {
		console.log('Error: ', ex)
	}
}













//CARGA DETALLE TITULOS,SUBCAT,ITEMS
var getDetail = async function (callback) {


	unaBase.ui.block();
	let config = {
		url: `${location.origin}/4DACTION/_V3_getItemByCotizacion?${$('section.sheet').data('id')}`,
		method: 'post'
	};

	await axios(config)
		.then(data => {
			data = data.data;


			console.time("offline");
			// guarda todos los items en business.item.docs(array de objectos)
			business.item.set(data);
			// Ver si se activa modo offline
			if (modoOfflineCantItems > 0 && data.rows.length >= modoOfflineCantItems && access._584) {
				if (!modoOfflineRemember) {
					var nombre = $('html > body.menu.home > aside > div > div > h1').text().split(' ')[0].capitalize();
					confirm("Hola " + nombre + ",<br><br>estás trabajando en una cotización que tiene más de " + modoOfflineCantItems.toString() + " ítems.<br><br>¿Deseas habilitar el modo offline para agilizar el proceso de cotizar?<br><br><label><input type=\"checkbox\" name=\"modo_offline_remember\"> No volver a preguntar durante esta sesión</label>", 'Sí', 'No').done(function (data) {
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

			console.timeEnd("offline");
			// if (modoOfflineSiempre) {
			// 	$('[data-name="offline_mode"] button').prop('disabled', true);
			// }
			var hidden_items = false;

			console.time("forloop");
			var current;

			current = $('<tbody>');

			//Check valores sica
			let data_sica = []
			if (unaBase.parametros.btn_sica) {
				$.ajax({
					url: '/4DACTION/_light_getValoresSicaServicio',
					dataType: 'json',
					async: false,
					cache: false,
					success: function (data) {
						data.rows.forEach(val => {
							data_sica.push(val.id_servicio)
						})
					}
				});
			}

			let tiposDocumento = []
			let idnv = document.querySelector('section.sheet').dataset.id
			//Obtener tipos de documentos
			$.ajax({
				url: "/4DACTION/_V3_getTipoDocumento",
				dataType: "json",
				type: "POST",
				data: {
					sid: unaBase.sid.encoded(),
					q: '',
					valido: true,
					id_nv: idnv
				},
				async: false
			}).done(function (data) {
				tiposDocumento = data.rows
			});

			localStorage.setItem('hasSent', false);

			var tituloAnterior;

			for (var i = 0; i < data.rows.length; i++) {
				var item = data.rows[i];
				// let titles_array = data.rows.filter(i => i.titulo);
				// let title_quantity = titles_array.length;
				var htmlObject, margen_compra, margen_venta;

				if (item.titulo) {
					if (typeof tituloAnterior != 'undefined') {
						// if (item.index == titles_array[title_quantity-1].index && typeof tituloAnterior != 'undefined'){

						updateSubtotalTitulos(tituloAnterior, "line 2033 editor_common library");

						//simon itemparent start
						// updateSubtotalParents(tituloAnterior);

						//simon itemparent end
					}


					htmlObject = getElement.titulo('appendTo', current);
					htmlObject.uniqueId(); // Logs tiempo real

					// Oculta título
					htmlObject[0].dataset.hidden = item.hidden;
					if (item.hidden)
						htmlObject.hide();

					//HOLAAAA
					if (item.item_user) {
						//htmlObject.find('[name="item[][subtotal_precio]"]').hide()
						//htmlObject.find('[name="item[][subtotal_costo]"]').hide()
					}

					tituloAnterior = htmlObject;
					if (typeof item.categoria != 'undefined')
						htmlObject.data('categoria', item.categoria.id);
					htmlObject.find('[name="item[][ocultar_print]"]').prop('checked', item.ocultar_print);
					htmlObject.data('observacion', item.observacion);

				} else if (item.isParent) {

					htmlObject = getElement.itemParent('appendTo', current);
					htmlObject.uniqueId(); // Logs tiempo real

					//simon 20julio2017
					var idTr = htmlObject.attr('id');
					// makeTooltips(htmlObject,idTr);

					// Oculta ítem
					htmlObject[0].dataset.hidden = item.hidden;
					if (item.hidden) {
						hidden_items = true;
						htmlObject.hide();
					}

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
						htmlObject.find('[name="item[][precio_unitario]"]').removeProp('readonly');
					} else {
						htmlObject.data('porcentaje-monto-total', item.porcentaje_monto_total);
						htmlObject.find('[name="item[][precio_unitario]"]').prop('readonly', true);
					}

					// Fórmula productor ejecutivo
					if (item.formula_productor_ejecutivo) {
						htmlObject.data('formula-productor-ejecutivo', true);
						htmlObject.data('formula-productor-ejecutivo-ratio', item.formula_productor_ejecutivo_ratio);
						htmlObject.find('[name="item[][precio_unitario]"]').prop('readonly', true);
						// Bloquear nombre, tipo documento y cantidades
						htmlObject.find('[name="item[][nombre]"]').prop('readonly', true);
						htmlObject.find('button.show.item').invisible();
						//htmlObject.find('[name="item[][tipo_documento]"]').prop('readonly', true);
						//htmlObject.find('button.show.tipo-documento').hide();
						//htmlObject.find('[name="item[][cantidad]"]').prop('readonly', true);
						htmlObject.find('[name="item[][factor]"]').prop('readonly', true);
					} else {
						htmlObject.removeData('formula-productor-ejecutivo');
						htmlObject.removeData('formula-productor-ejecutivo-ratio');
					}

					// Fórmula asistente producción
					if (item.formula_asistente_produccion) {
						htmlObject.data('formula-asistente-produccion', true);
						htmlObject.find('[name="item[][precio_unitario]"]').prop('readonly', true);
						// Bloquear nombre, tipo documento y cantidades
						htmlObject.find('[name="item[][nombre]"]').prop('readonly', true);
						htmlObject.find('button.show.item').invisible();
						htmlObject.find('[name="item[][tipo_documento]"]').prop('readonly', true);
						htmlObject.find('button.show.tipo-documento').hide();
						//htmlObject.find('[name="item[][cantidad]"]').prop('readonly', true);
						htmlObject.find('[name="item[][factor]"]').prop('readonly', true);
					} else {
						htmlObject.removeData('formula-asistente-produccion');
					}

					// Fórmula horas extras
					if (item.formula_horas_extras) {
						htmlObject.find('td.horas-extras').visible();
						htmlObject.find('[name="item[][horas_extras]"]').val(item.hora_extra.cantidad).parentTo('td').visible();
						htmlObject.find('[name="item[][precio_unitario]"]').addClass('special');
						if(item.hora_extra.cantidad>0)	
							htmlObject.find('[name="item[][precio_unitario]"]').prop('readonly', true)

						htmlObject.data('formula-horas-extras', true);
					
						//htmlObject.find('[name="item[][costo_unitario]"]').prop('readonly', true);
						// Bloquear nombre, tipo documento y cantidades
						//htmlObject.find('[name="item[][nombre]"]').prop('readonly', true);
						// htmlObject.find('button.show.item').invisible();
						// htmlObject.find('[name="item[][tipo_documento]"]').prop('readonly', true);
						// htmlObject.find('button.show.tipo-documento').hide();
					} else {
						htmlObject.removeData('formula-horas-extras');
						htmlObject.find('[name="item[][horas_extras]"]').val(0).parentTo('td').invisible();
						htmlObject.find('td.horas-extras').invisible();
					}

					htmlObject.data('hora-extra-enabled', item.hora_extra.enabled);
					htmlObject.data('hora-extra-factor', item.hora_extra.factor);
					htmlObject.data('hora-extra-jornada', item.hora_extra.jornada);
					htmlObject.data('base-imponible', item.hora_extra.base_imponible / exchange_rate);
					htmlObject.data('hora-extra-dias', item.hora_extra.dias);

					if (item.director_internacional) {
						htmlObject.data('director-internacional', true);
					} else {
						htmlObject.removeData('director-internacional');
					}

					if (item.porcentaje_monto_total || item.formula_productor_ejecutivo || item.formula_asistente_produccion ) {
						htmlObject.find('.remove.item').remove();
						htmlObject.find('.insert.item').remove();
						htmlObject.find('.clone.item').remove();
						//simon itemparent start
						htmlObject.find('.parent.item').remove();
						//simon itemparent end
						htmlObject.find('.ui-icon-arrow-4').remove();
					}

					// ocultar decimales en costo unitario
					htmlObject.find('[name="item[][costo_unitario]"]').val(item.costo.presupuestado.unitario / exchange_rate).data('old-value', item.costo.presupuestado.unitario / exchange_rate);

					htmlObject.find('[name="item[][costo_unitario_previo]"]').val(item.costo.previo.unitario / exchange_rate).data('old-value', item.costo.previo.unitario / exchange_rate);
					htmlObject.find('[name="item[][subtotal_costo_previo]"]').val(item.costo.previo.subtotal / exchange_rate).data('old-value', item.costo.previo.subtotal / exchange_rate);
					htmlObject.find('[name="item[][diferencia_costo_previo]"]').val((item.precio.subtotal - item.costo.previo.subtotal) / exchange_rate).data('old-value', (item.precio.subtotal - item.costo.previo.subtotal) / exchange_rate);

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

					htmlObject.data('observacion', item.observacion);
					htmlObject.data('comentario', item.comentario);

					if (!item.deletable)
						htmlObject.find('button.remove.item').invisible();

				

					// Fix: para evitar que quede en blanco el tipo de documento
					htmlObject.data('tipo-documento', 33);
					if (typeof item.tipo_documento != 'undefined' && item.tipo_documento.id != 30 && item.tipo_documento.id != 33) {
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

					// TODO: revisar candado cierre de compras

					//2
					if (item.closed_compras) {
						htmlObject.find('[name="item[][closed_compras]"]').show();
					} else {
						htmlObject.find('[name="item[][closed_compras]"]').hide();
					}

					// Datos de gasto real


					htmlObject.find('[name="item[][subtotal_costo_real]"]').val(item.costo.real.subtotal / exchange_rate);
					htmlObject.find('[name="item[][utilidad_real]"]').val((item.precio.subtotal - item.costo.real.subtotal) / exchange_rate);

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
						var margen_compra_real = ((1 - item.costo.real.subtotal / item.precio.subtotal) * 100).toFixed(2);
					else
						// var margen_compra_real = ((item.precio.subtotal - item.costo.real.subtotal) / item.costo.real.subtotal * 100).toFixed(2);
						// se corrige para que muestre bien el margen real
						var margen_compra_real = ((item.precio.subtotal - item.costo.real.subtotal) / item.precio.subtotal * 100).toFixed(2);

					var margen_venta_real = ((item.precio.subtotal - item.costo.real.subtotal) / item.precio.subtotal * 100).toFixed(2);

					var diferencia_ratio = ((item.costo.presupuestado.subtotal - item.costo.real.subtotal) / item.costo.presupuestado.subtotal * 100).toFixed(2);

					htmlObject.find('[name="item[][margen_venta_real]"]').val((isFinite(margen_venta_real)) ? margen_venta_real : 0);
					htmlObject.find('[name="item[][margen_compra_real]"]').val((isFinite(margen_compra_real)) ? margen_compra_real : 0);

					htmlObject.find('[name="item[][diferencia]"]').val((item.costo.presupuestado.subtotal - item.costo.real.subtotal) / exchange_rate);
					htmlObject.find('[name="item[][diferencia_ratio]"]').val(isNaN(diferencia_ratio) ? '0.00' : diferencia_ratio);

					if (!item.costo_directo) {
						// ;
						htmlObject.find('[name="item[][subtotal_costo_previo]"]').css('opacity', .5);
						// Ocultar si el usuario tiene activado permiso para solo ver gastos directos
						if (access._605) {
							htmlObject.hide();
							var prevTitle = htmlObject.prevTo('tr.title:not(:hidden)');
							var itemsVisibles = prevTitle.next().nextUntil('tr.title');
							if (itemsVisibles.length == 0) {
								prevTitle.hide();
							}
						}
					} else {
						htmlObject.find('[name="item[][subtotal_costo_previo]"]').css('opacity', 1);
					}

					// Bloquear edición de gasto presupuestado solo si el ítem no está cerrado para compras, en caso de tener el parámetro activado

					//simon itemparent start

					if (item.isParent) {
						htmlObject.addClass('itemParent');
						htmlObject.find('[name="item[][subtotal_costo]"]').prop('readonly', true);
					} else if (item.itemParent !== "") {
						htmlObject.addClass('childItem')
						htmlObject.find('.parent.item').remove()
					} else {
						htmlObject.addClass('item')
					}
					htmlObject[0].dataset.itemparent = item.itemParent
					//simon itemparent end

					if (typeof parentAnterior != 'undefined') {


						//simon itemparent start
						updateSubtotalParents(parentAnterior);

						//simon itemparent end
					}
					parentAnterior = htmlObject;
				} else {
					//***********************************ITEMS ****************************************************************/

					htmlObject = getElement.item('appendTo', current);


					htmlObject.uniqueId(); // Logs tiempo real
					try {
						htmlObject[0].dataset.producto = item.producto != undefined ? item.producto.id : '';
					} catch (err) {
						console.log(err);
					}

					if (unaBase.parametros.btn_sica) {
						if (item.producto != undefined) {

							if (data_sica.includes(item.producto.id)) {
								const createButtonWithIcon = (type) => {
									let btn = document.createElement('button');
									btn.classList.add('detail', 'argentina', type);

									let i = document.createElement('i');
									i.classList.add('fas', 'fa-search-dollar');
									btn.appendChild(i);

									return btn;
								}

								let btn1 = createButtonWithIcon('presupuesto');
								let btn2 = createButtonWithIcon('previo');
								htmlObject[0].children[8].insertBefore(btn1, htmlObject[0].children[8].children[0]);
								htmlObject[0].children[11].insertBefore(btn2, htmlObject[0].children[11].children[0]);

							} else {

								htmlObject[0].children[8].children[0].style.marginLeft = "22px"
								htmlObject[0].children[11].children[0].style.marginLeft = "22px"
							}
						}


					}

					if (item.nombre == "ANIMADOR") {



					}

					//simon 20julio2017
					var idTr = htmlObject.attr('id');
					// makeTooltips(htmlObject,idTr);

					// Oculta ítem
					htmlObject[0].dataset.hidden = item.hidden;
					if (item.hidden) {
						hidden_items = true;
						htmlObject.hide();
					}

					if (typeof item.producto != 'undefined')
						htmlObject.data('producto', item.producto.id);

					htmlObject.data('first-load', true);
					//simon itemparent start

					if (item.isParent) {
						htmlObject.addClass('itemParent')
					} else if (item.itemParent !== "") {
						htmlObject.addClass('childItem')
						htmlObject.find('.parent.item').remove()
					} else {
						htmlObject.addClass('item')
					}
					htmlObject[0].dataset.itemparent = item.itemParent
					//simon itemparent end


					htmlObject.find('[name="item[][codigo]"]').val(item.codigo);
					htmlObject.find('[name="item[][cantidad]"]').val(item.cantidad).data('old-value', item.cantidad);
					htmlObject.find('[name="item[][unidad]"]').val(item.unidad);
					htmlObject.find('[name="item[][factor]"]').val(item.factor).data('old-value', item.factor);
					htmlObject.find('[name="item[][precio_unitario]"]').val(item.precio.unitario / exchange_rate).data('old-value', item.precio.unitario / exchange_rate);

					if (item.ocultar_print) {
						if (item.precio.subtotal > 0) item.ocultar_print = false
						else {
							htmlObject.find('[name="item[][cantidad]"]').prop('disabled', true);
							htmlObject.find('[name="item[][factor]"]').prop('disabled', true);
							htmlObject.find('[name="item[][precio_unitario]"]').prop('disabled', true);
						}
					}

					if (item.porcentaje_monto_total == 0) {
						htmlObject.removeData('porcentaje-monto-total');
						htmlObject.find('[name="item[][precio_unitario]"]').removeProp('readonly');
					} else {
						htmlObject.data('porcentaje-monto-total', item.porcentaje_monto_total);
						htmlObject.find('[name="item[][precio_unitario]"]').prop('readonly', true);
					}


					htmlObject[0].dataset.auto_percent_value = item.porcentaje_automatico

					//BLOQUEO DE CAMPOS
					// ITEM ACUMULADO IMPUESTO Y porcentaje automatico
					if (item.item_acumula_impuesto || parseFloat(item.porcentaje_automatico) > 0) {
						htmlObject[0].dataset.auto_percent = parseFloat(item.porcentaje_automatico) > 0 ? true : false
						htmlObject[0].dataset.auto_percent_value = item.porcentaje_automatico
						htmlObject.data('item_acumula_impuesto', item.item_acumula_impuesto);
						htmlObject.find('[name="item[][precio_unitario]"]').prop('disabled', true);
						htmlObject.find('[name="item[][costo_unitario]"]').prop('disabled', true);
						htmlObject.find('[name="item[][subtotal_costo]"]').prop('disabled', true);
						//htmlObject.find('[name="item[][precio_unitario]"]').prop('readonly', true);
						// Bloquear nombre, tipo documento y cantidades
						htmlObject.find('[name="item[][nombre]"]').prop('disabled', true);
						htmlObject.find('button.show.item').invisible();
						htmlObject.find('[name="item[][cantidad]"]').prop('disabled', true);
						htmlObject.find('[name="item[][factor]"]').prop('disabled', true);
						htmlObject.find('[name="item[][tipo_documento]"]').prop('disabled', true);
						htmlObject.find('[name="item[][tipo_documento_compras]"]').prop('disabled', true);

						htmlObject.find('[name="item[][nombre]"]').prop('readonly', true);
						htmlObject.find('button.show.item').invisible();
						htmlObject.find('[name="item[][cantidad]"]').prop('readonly', true);
						htmlObject.find('[name="item[][factor]"]').prop('readonly', true);
						htmlObject.find('[name="item[][tipo_documento]"]').prop('readonly', true);
						htmlObject.find('[name="item[][tipo_documento_compras]"]').prop('disabled', true);

					} else {
						htmlObject[0].dataset.auto_percent = false
					}


					// Fórmula productor ejecutivo
					if (item.formula_productor_ejecutivo) {
						htmlObject[0].dataset.formula_productor_ejecutivo = true
						htmlObject.data('formula-productor-ejecutivo-ratio', item.formula_productor_ejecutivo_ratio);

						htmlObject.data('formula-productor-ejecutivo', true);
						htmlObject.find('[name="item[][precio_unitario]"]').prop('readonly', true);
						// Bloquear nombre, tipo documento y cantidades
						htmlObject.find('[name="item[][nombre]"]').prop('readonly', true);
						htmlObject.find('button.show.item').invisible();
						//htmlObject.find('[name="item[][tipo_documento]"]').prop('readonly', true);
						//htmlObject.find('button.show.tipo-documento').hide();
						//htmlObject.find('[name="item[][cantidad]"]').prop('readonly', true);
						htmlObject.find('[name="item[][factor]"]').prop('readonly', true);
					} else {
						htmlObject[0].dataset.formula_productor_ejecutivo = false
						htmlObject.removeData('formula-productor-ejecutivo-ratio');
						htmlObject.removeData('formula-productor-ejecutivo');
					}

					// Fórmula asistente producción
					if (item.formula_asistente_produccion) {
						htmlObject.data('formula-asistente-produccion', true);
						htmlObject.find('[name="item[][precio_unitario]"]').prop('readonly', true);
						// Bloquear nombre, tipo documento y cantidades
						htmlObject.find('[name="item[][nombre]"]').prop('readonly', true);
						htmlObject.find('button.show.item').invisible();
						htmlObject.find('[name="item[][tipo_documento]"]').prop('readonly', true);
						htmlObject.find('button.show.tipo-documento').hide();
						htmlObject.find('button.show.tipo-documento-compras').hide();

						//htmlObject.find('[name="item[][cantidad]"]').prop('readonly', true);
						htmlObject.find('[name="item[][factor]"]').prop('readonly', true);
					} else {
						htmlObject.removeData('formula-asistente-produccion');
					}

					// Fórmula horas extras
					if (item.formula_horas_extras) {
						htmlObject.find('td.horas-extras').visible();
						htmlObject.find('[name="item[][horas_extras]"]').val(item.hora_extra.cantidad).parentTo('td').visible();
						htmlObject.find('[name="item[][precio_unitario]"]').addClass('special');
						if(item.hora_extra.cantidad>0)	
							htmlObject.find('[name="item[][precio_unitario]"]').prop('readonly', true)

						htmlObject.data('formula-horas-extras', true);
						// htmlObject.find('[name="item[][precio_unitario]"]').prop('readonly', true);
						// htmlObject.find('[name="item[][costo_unitario]"]').prop('readonly', true);
						// // Bloquear nombre, tipo documento y cantidades
						// htmlObject.find('[name="item[][nombre]"]').prop('readonly', true);
						// htmlObject.find('button.show.item').invisible();
						// htmlObject.find('[name="item[][tipo_documento]"]').prop('readonly', true);
						// htmlObject.find('button.show.tipo-documento').hide();
					} else {
						htmlObject.removeData('formula-horas-extras');
						htmlObject.find('[name="item[][horas_extras]"]').val(0).parentTo('td').invisible();
						htmlObject.find('td.horas-extras').invisible();

					}

					//FIX IMPONIBLE COMPRAS
					let bi_compras = item.hora_extra.base_imponible_compras
					if( item.hora_extra.base_imponible_compras == 0 && item.costo.presupuestado.unitario !=0 ){
						let multiplicacion = item.tipo_documento_compras.inverse
						let valor_usd = item.tipo_documento_compras.valor_usd
						let valor_moneda_ex = item.tipo_documento_compras.valor_moneda
						let valor_cotizado = 0
						let valor_a_cotizar = item.costo.presupuestado.unitario
						let impuesto = item.tipo_documento_compras.ratio
						if(impuesto > 0){

							if (multiplicacion) {
								// Impuesto extranjero
								if (valor_usd)
									valor_cotizado = (valor_a_cotizar * (1 - impuesto)) / valor_moneda_ex;
								else
									valor_cotizado = valor_a_cotizar * (1 - impuesto);
							} else
								valor_cotizado = valor_a_cotizar / (1 + impuesto);

								bi_compras = valor_cotizado

						}else
							bi_compras = item.costo.presupuestado.unitario

					}



					htmlObject.data('hora-extra-enabled', item.hora_extra.enabled);
					htmlObject.data('hora-extra-factor', item.hora_extra.factor);
					htmlObject.data('hora-extra-jornada', item.hora_extra.jornada);
					htmlObject.data('base-imponible', item.hora_extra.base_imponible / exchange_rate);
					htmlObject.data('base-imponible-compras', bi_compras / exchange_rate);
					htmlObject.data('hora-extra-dias', item.hora_extra.dias);
					htmlObject.data('hora-extra-valor', item.hora_extra.valor);
					htmlObject.data('original-value', item.hora_extra.base_imponible / exchange_rate);


					if (item.director_internacional) {
						htmlObject.data('director-internacional', true);
					} else {
						htmlObject.removeData('director-internacional');
					}

					//DESACTIVA BOTONERA
					if (item.porcentaje_monto_total || item.formula_productor_ejecutivo || item.formula_asistente_produccion ) {
						htmlObject.find('.remove.item').remove();
						htmlObject.find('.insert.item').remove();
						htmlObject.find('.clone.item').remove();
						//simon 29/11/18
						htmlObject.find('.parent.item').remove();
						htmlObject.find('.ui-icon-arrow-4').remove();
					}

					// ocultar decimales en costo unitario
					
					const costo_unitario = unaBase.parametros.valorventa_mismo_valorcosto ? item.precio.unitario : item.costo.presupuestado.unitario
					htmlObject.find('[name="item[][costo_unitario]"]').val(costo_unitario / exchange_rate).data('old-value', costo_unitario / exchange_rate);

					htmlObject.find('[name="item[][costo_unitario_previo]"]').val(item.costo.previo.unitario / exchange_rate).data('old-value', item.costo.previo.unitario / exchange_rate);
					htmlObject.find('[name="item[][subtotal_costo_previo]"]').val(item.costo.previo.subtotal / exchange_rate).data('old-value', item.costo.previo.subtotal / exchange_rate);
					htmlObject.find('[name="item[][diferencia_costo_previo]"]').val((item.precio.subtotal - item.costo.previo.subtotal) / exchange_rate).data('old-value', (item.precio.subtotal - item.costo.previo.subtotal) / exchange_rate);

					if (typeof copiar_precio_a_costo == 'boolean' && item.precio.unitario == item.costo.presupuestado.unitario) {
						htmlObject.find('[name="item[][costo_unitario]"]').data('auto', true);

					}else {
						//Paramtro para copiar el valor unitario de venta a costo
						if (unaBase.parametros.valorventa_mismo_valorcosto) {
							htmlObject.find('[name="item[][costo_unitario]"]').data('auto', true);
						} else {
							htmlObject.find('[name="item[][costo_unitario]"]').data('auto', false);
						}
					}

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

					if(unaBase.doc.separate_sc){
						htmlObject.find('[name="item[][separate_sc]"]')[0].selectedIndex=htmlObject.find(`[name="item[][separate_sc]"] option[value="${item.sc_separateSelectedId}"]`)[0].index
					}else
						htmlObject.find('[name="item[][aplica_sobrecargo]"]').prop('checked', item.aplica_sobrecargo);
					
						

					htmlObject.find('[name="item[][costo_interno]"]').prop('checked', item.costo.interno);

					htmlObject.find('[name="item[][ocultar_print]"]').prop('checked', item.ocultar_print);

					htmlObject.data('observacion', item.observacion);
					htmlObject.data('comentario', item.comentario);

					if (!item.deletable)
						htmlObject.find('button.remove.item').invisible();


					// Fix: para evitar que quede en blanco el tipo de documento
					//TIPO DOC ITEM DEFAULT

					if ((typeof item.tipo_documento != 'undefined' && item.tipo_documento.id != 30 && item.tipo_documento.id != 33) || (typeof item.tipo_documento_compras != 'undefined' && item.tipo_documento_compras.id != 30 && item.tipo_documento_compras.id != 33)) {
						htmlObject.data('tipo-documento', item.tipo_documento.id);
						//htmlObject.find('input[name="item[][tipo_documento]"]').val(item.tipo_documento.abbr);

						setTipoDocumento(htmlObject, item, tiposDocumento, 'tipo_documento')
						htmlObject.data('tipo-documento-text', item.tipo_documento.text);
						htmlObject.data('tipo-documento-ratio', item.tipo_documento.ratio);
						htmlObject.data('tipo-documento-valor-usd', item.tipo_documento.valor_usd); // Impuesto extranjero
						htmlObject.data('tipo-documento-valor-usd-code', item.tipo_documento.valor_moneda_code); // Impuesto extranjero
						htmlObject.data('tipo-documento-valor-moneda', item.tipo_documento.valor_moneda.replaceAll(',', '.')); // Impuesto extranjero
				
						htmlObject.data('tipo-documento-inverse',  item.tipo_documento_compras.inverse);
						// Impuesto extranjero 0%
						//if (item.tipo_documento.ratio != 0) {
						if (item.tipo_documento.ratio != 0 || (item.tipo_documento.ratio == 0 && item.tipo_documento.valor_usd)) {
							htmlObject.find('[name="item[][precio_unitario]"]').addClass('edited');
							htmlObject.find('button.detail.price').visible();
						} else {
							htmlObject.find('[name="item[][precio_unitario]"]').removeClass('edited');
							htmlObject.find('button.detail.price').invisible();
						}


						//COMPRA
						if (item.tipo_documento_compras.ratio != 0 || (item.tipo_documento_compras.ratio == 0 && item.tipo_documento_compras.valor_usd)) {
							htmlObject.find('[name="item[][costo_unitario]"]').addClass('edited');
							htmlObject.find('button.detail.price').visible();
						} else {
							htmlObject.find('[name="item[][costo_unitario]"]').removeClass('edited');
							htmlObject.find('button.detail.price').invisible();
						}

						htmlObject.data('tipo-documento-compras', item.tipo_documento_compras.id);
						//htmlObject.find('input[name="item[][tipo_documento_compras]"]').val(item.tipo_documento_compras.abbr);

						setTipoDocumento(htmlObject, item, tiposDocumento, 'tipo_documento_compras')
						htmlObject.data('tipo-documento-compras-text', item.tipo_documento_compras.text);
						htmlObject.data('tipo-documento-compras-ratio', item.tipo_documento_compras.ratio);
						htmlObject.data('tipo-documento-compras-valor-usd', item.tipo_documento_compras.valor_usd); // Impuesto extranjero
						htmlObject.data('tipo-documento-compras-valor-usd-code', item.tipo_documento_compras.valor_moneda_code); // Impuesto extranjero
						htmlObject.data('tipo-documento-compras-valor-moneda', item.tipo_documento_compras.valor_moneda.replaceAll(',', '.')); // Impuesto extranjero

						let tipo_documento_compras = item.tipo_documento_compras

						htmlObject.data('tipo-documento-compras-inverse', tipo_documento_compras.inverse);


					} else {
						htmlObject.data('tipo-documento', 33);
						htmlObject.data('tipo-documento-compras', 33);
						setTipoDocumento(htmlObject, item, tiposDocumento, 'tipo_documento')
						setTipoDocumento(htmlObject, item, tiposDocumento, 'tipo_documento_compras')
						// htmlObject.find('input[name="item[][tipo_documento]"]').val('FE');
						// htmlObject.find('input[name="item[][tipo_documento_compras]"]').val('FE');

						htmlObject.removeData('tipo-documento');
						htmlObject.removeData('tipo-documento-text');
						htmlObject.removeData('tipo-documento-ratio');
						htmlObject.removeData('tipo-documento-valor-usd'); // Impuesto extranjero
						htmlObject.removeData('tipo-documento-valor-usd-code'); // Impuesto extranjero
						htmlObject.removeData('tipo-documento-valor-moneda'); // Impuesto extranjero
						htmlObject.removeData('tipo-documento-inverse');
						htmlObject.find('[name="item[][precio_unitario]"]').removeClass('edited');
						htmlObject.find('button.detail.price').invisible();


						htmlObject.removeData('tipo-documento-compras');
						htmlObject.removeData('tipo-documento-compras-text');
						htmlObject.removeData('tipo-documento-compras-ratio');
						htmlObject.removeData('tipo-documento-compras-valor-usd'); // Impuesto extranjero
						htmlObject.removeData('tipo-documento-compras-valor-usd-code'); // Impuesto extranjero
						htmlObject.removeData('tipo-documento-compras-valor-moneda'); // Impuesto extranjero
						htmlObject.removeData('tipo-documento-compras-inverse');
						htmlObject.find('[name="item[][costo_unitario]"]').removeClass('edited');
					}

				

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

					// TODO: revisar candado cierre de compras


					if (item.closed_compras) {
						htmlObject.find('span[name="item[][closed_compras]"]').show();
					} else {
						htmlObject.find('span[name="item[][closed_compras]"]').hide();
					}

					// Datos de gasto real


					htmlObject.find('[name="item[][subtotal_costo_real]"]').val(item.costo.real.subtotal / exchange_rate);
					htmlObject.find('[name="item[][utilidad_real]"]').val((item.precio.subtotal - item.costo.real.subtotal) / exchange_rate);

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
						var margen_compra_real = ((1 - item.costo.real.subtotal / item.precio.subtotal) * 100).toFixed(2);
					else
						// var margen_compra_real = ((item.precio.subtotal - item.costo.real.subtotal) / item.costo.real.subtotal * 100).toFixed(2);
						// se corrige para que muestre bien el margen real
						var margen_compra_real = ((item.precio.subtotal - item.costo.real.subtotal) / item.precio.subtotal * 100).toFixed(2);

					var margen_venta_real = ((item.precio.subtotal - item.costo.real.subtotal) / item.precio.subtotal * 100).toFixed(2);

					var diferencia_ratio = ((item.costo.presupuestado.subtotal - item.costo.real.subtotal) / item.costo.presupuestado.subtotal * 100).toFixed(2);

					htmlObject.find('[name="item[][margen_venta_real]"]').val((isFinite(margen_venta_real)) ? margen_venta_real : 0);
					htmlObject.find('[name="item[][margen_compra_real]"]').val((isFinite(margen_compra_real)) ? margen_compra_real : 0);

					htmlObject.find('[name="item[][diferencia]"]').val((item.costo.presupuestado.subtotal - item.costo.real.subtotal) / exchange_rate);
					htmlObject.find('[name="item[][diferencia_ratio]"]').val(isNaN(diferencia_ratio) ? '0.00' : diferencia_ratio);

					if (!item.costo_directo) {
						// ;
						htmlObject.find('[name="item[][subtotal_costo_previo]"]').css('opacity', .5);
						// Ocultar si el usuario tiene activado permiso para solo ver gastos directos
						if (access._605) {
							htmlObject.hide();
							var prevTitle = htmlObject.prevTo('tr.title:not(:hidden)');
							var itemsVisibles = prevTitle.next().nextUntil('tr.title');
							if (itemsVisibles.length == 0) {
								prevTitle.hide();
							}
						}
					} else {
						htmlObject.find('[name="item[][subtotal_costo_previo]"]').css('opacity', 1);
					}



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

				htmlObject.data('deletable', item.deletable);
				htmlObject.find('input[name="item[][nombre]"]').val(item.nombre);
				htmlObject.find('input[name="item[][nombre]"]').data('nombre-original', item.text);

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
				// 	<p>' + item.text + '</p> \
				// 	<p>&nbsp;</p> \
				// 	<p>Descripción larga:</p> \
				// 	<p>' + ((item.observacion!= '')? item.observacion.replace(/\n/g, '</p><p>') : 'N/A') + '</p> \
				// 	<p>&nbsp;</p>\
				// 	<p>Observación interna:</p> \
				// 	<p>' + ((item.comentario!= '')? item.comentario.replace(/\n/g, '</p><p>') : 'N/A') + '</p> \
				// ';
				var tooltip = ' \
					<div style="max-width:200px;"> \
						<p>Nombre ítem:</p> \
						<p>' + item.text + '</p> \
						<p>&nbsp;</p> \
						<p>Descripción larga:</p> \
						<p >' + ((item.observacion != '') ? item.observacion.replace(/\n/g, '</p><p>') : 'N/A') + '</p> \
					</div>';
				htmlObject.find('button.profile.item').tooltipster('update', tooltip);

				// Mostrar signo de admiración (ui-icon-notice) si el ítem tiene comentario
				// caso contrario mostrar ícono normal (ui-icon-gear)
				if (item.observacion != '') {
					htmlObject.find('button.profile.item').removeClass('ui-icon-gear').addClass('ui-icon-notice');
				} else {
					htmlObject.find('button.profile.item').removeClass('ui-icon-notice').addClass('ui-icon-gear');
				}

				if (item.text != item.nombre)
					htmlObject.find('[name="item[][nombre]"]').addClass('edited');
				else
					htmlObject.find('[name="item[][nombre]"]').removeClass('edited');

				if (!item.deletable && access._574) {
					htmlObject.find('input:not([type="checkbox"])').prop('readonly', true);
					htmlObject.find('input[type="checkbox"]').prop('disabled', true);
					htmlObject.find('button.show').remove();
					htmlObject.find('button.clone').remove();
				}

				// Sección datos cinemágica
				htmlObject.data('costo-directo', item.costo_directo);
				htmlObject.data('costo-admin', item.costo_admin); // Fórmula productor ejecutivo

				// Mostrar subtotal venta distinto de cero en amarillo
				if (!item.titulo && parseFloat(htmlObject.find('[name="item[][subtotal_precio]"]').val()) != 0) {
					htmlObject.find('[name="item[][subtotal_precio]"]').addClass('filled');
				}

				let diff = htmlObject.find('[name="item[][diferencia]"]');

				if (diff.val() < 0) {
					diff.css('color', 'red');
					diff.css('font-weight', '900');
				}



			}



			console.time("block3");
			$('section.sheet table.items tbody').replaceWith(current);

			var items = $('section.sheet table.items > tbody > tr:not(.title)').length;
			$('section.sheet table.items > tfoot > tr .info:eq(0)').html(items + ' ítem' + ((items > 1) ? 's' : ''));

			if (hidden_items)
				$('table.items > tfoot').invisible();


			if (typeof tituloAnterior != 'undefined') {
				updateSubtotalTitulos(tituloAnterior, "line 2765 editor library");

				tituloAnterior = undefined;
			}

			console.timeEnd("block3");
			console.time("block4");
			if (typeof parentAnterior != 'undefined') {


				//simon itemparent start
				updateSubtotalParents(parentAnterior);
				parentAnterior = undefined;
				//simon itemparent end
			}

			// test speed
			//if (!modoOffline)
			// updateSubtotalItems();
			// 30seg



			console.timeEnd("block4");
			/*current.find('> *').each(function() {
				$(this).appendTo($('table.items tbody'));
			});*/

			console.time("block5");



			if ($('section.sheet').data('index'))
				$('section.sheet table > thead button.toggle.all').triggerHandler('click');
			if (typeof callback != 'undefined')
				callback();		// 30seg

			updateVistaItems(true);

			$('section.sheet table.items > tbody > tr').each(function () {
				$(this).data('first-load', false);
			});

			if (unaBase.doc.modoCine) {
				if ($('section.sheet.detalle-items').data('readonly') || $('section.sheet.detalle-items').data('locked')) {
					$('section.sheet').find('input, textarea, tr button:not(.detail.item), tr span').prop('disabled', true).attr('placeholder', '');
					$('section.sheet').find('tr button:not(.detail.item), tr span.ui-icon, ul.editable button, footer button').hide();
					try {
						$('section.sheet.detalle-items').find('table.items tbody tr').draggable('destroy');
					} catch (err) { }
					$('#menu [data-name="save"]').hide();
				}

				$('section.sheet.detalle-items').removeData('fetching');
				calcValoresCinemagica();

			}

			console.timeEnd("block5");
			if (unaBase.parametros.ocultar_seccion_sc) {
				document.querySelector('.seleccion-sc').style.display = 'none';
				document.querySelector('.seleccion-sc-2').style.display = 'none';
				document.querySelector('.aplica-sobrecargo').style.display = 'none';
				document.querySelector('.costo-interno').style.display = 'none';
				document.querySelector('.ocultar-print').style.display = 'none';
				document.querySelector('.table-budget tfoot th:last-child').style.display = 'none';
			}


			unaBase.ui.unblock();

		})
		.then(res => {

			sobrecargos.fillSCCategorias()
		})
		.then(res => {

			updateSubtotalItems();


			if (!unaBase.reaperMode) {
				totales.updateSubtotalNeto();

				//PARA CALCULAR SOBRECARGOS A TOTALES
				$('[name^="sobrecargo"][name$="[porcentaje]"]').trigger('blur');
			} else {
				sobrecargos.updateSobrecargos()
			}


		})
		.catch(err => {

			unaBase.ui.unblock();
			toastr.error('No se pudieron mostrar los items de la cotización');
			console.log(err)
			// manejar esta situación
		});


	// $.ajax({
	// 	url: '/4DACTION/_V3_getItemByCotizacion',
	// 	dataType: 'json',
	// 	data: {
	// 		id: $('section.sheet').data('id')
	// 	},
	// 	cache: false,
	// 	beforeSend: function() {
	// 		unaBase.ui.block();
	// 	},
	// 	complete: function() {

	// 	},
	// 	success: function(data) {

	// 	},
	// 	error: function() {

	// 	}
	// });

};



var saveRow = function (event, callback) {

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
		'item[][item_acumula_impuesto]': target.data('item_acumula_impuesto'), // ACUMULA IMPUESTO
		'item[][formula_asistente_produccion]': target.data('formula-asistente-produccion'), // Fórmula asistente producción
		'item[][formula_horas_extras]': target.data('formula-horas-extras'), // Fórmula horas extras
		'item[][director_internacional]': target.data('director-internacional'),
		// Corrección cuando se ocultan decimales
		'item[][precio_unitario]': parseFloat((target.find('[name="item[][precio_unitario]"]').data('old-value')) ? target.find('[name="item[][precio_unitario]"]').data('old-value') : target.find('[name="item[][precio_unitario]"]').val()),
		//'item[][precio_unitario]': parseFloat((target.find('[name="item[][precio_unitario]"]').data('old-value'))? target.find('[name="item[][precio_unitario]"]').data('old-value') : target.find('[name="item[][precio_unitario]"]').val()),
		'item[][subtotal_precio]': parseFloat(target.find('[name="item[][subtotal_precio]"]').val()),
		'item[][costo_unitario]': parseFloat((target.find('[name="item[][costo_unitario]"]').data('old-value')) ? target.find('[name="item[][costo_unitario]"]').data('old-value') : target.find('[name="item[][costo_unitario]"]').val()),
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
		'item[][tipo_documento][valor_moneda]': target.data('tipo-documento-valor-moneda'), // Impuesto extranjero
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
	fields.hostname = window.origin
	axios.post(`${nodeUrl}/set-item-nv`, fields)
		.then(function (res) {

			const data = res.data[0]
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
		})
		.catch(function (error) {
			// Este bloque de código se ejecuta si la solicitud falla
			toastr.error('No se pudo guardar el item');
			$(element).val($(element).data('old-value'));
		});
	// $.ajax({
	// 	url: '/4DACTION/_V3_setItemByCotizacion',
	// 	dataType: 'json',
	// 	data: fields,
	// 	async: false,
	// 	cache: false,
	// 	success: function(data) {
	// 		target.data('id', data.id);
	// 		target.data('index', data.index);

	// 		var has_change =
	// 		(
	// 			$(element).parentTo('tr').find('[name="item[][nombre]"]').val() != $(element).parentTo('tr').find('[name="item[][nombre]"]').data('nombre-original')
	// 		) && (
	// 			$(element).parentTo('tr').find('[name="item[][nombre]"]').data('nombre-original') != ''
	// 		);

	// 		if (has_change) {

	// 			if (!$(element).parentTo('tr').hasClass('title')) {
	// 				if (!$(element).parentTo('tr').data('producto')) {
	// 					$(element).parentTo('tr').find('[name="item[][nombre]"]').removeClass('edited').data('nombre-original', null);
	// 					$(element).parentTo('tr').find('input').val('');
	// 					$(element).parentTo('tr').find('input[name="item[][cantidad]"]').val(1).data('old-value', 1);
	// 					$(element).parentTo('tr').find('input[name="item[][factor]"]').val(1).data('old-value', 1);
	// 					$(element).parentTo('tr').find('input[name="item[][horas_extras]"]').val(0);
	// 				} else {
	// 					$(element).parentTo('tr').find('[name="item[][nombre]"]').addClass('edited');
	// 				}
	// 			}

	// 		} else
	// 			$(element).parentTo('tr').find('[name="item[][nombre]"]').removeClass('edited');

	// 		if (typeof callback != 'undefined')
	// 			callback(data.id);
	// 	},
	// 	error: function() {
	// 		toastr.error('No se pudo guardar el item');
	// 		$(element).val($(element).data('old-value'));
	// 	}
	// });
};

var addAllItems = function (title) {
	confirm('¿Desea cargar todos los ítems de la categoría a la misma?').done(function (data) {
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
				success: function (data) {

					if (data.rows.length > 0) {
						for (var i = data.rows.length - 1; i >= 0; i--) {

							;

							var item = data.rows[i];

							var htmlObject = getElement.item('insertAfter', title);

							htmlObject.data('producto', item.id);
							htmlObject.find('[name="item[][codigo]"]').val(item.index);
							htmlObject.find('[name="item[][unidad]"]').val(item.unidad);
							htmlObject.find('[name="item[][horas_extras]"]').val(0);


							//content
							if (item.porcentaje_monto_total == 0) {
								htmlObject.find('[name="item[][precio_unitario]"]').val(item.precio / exchange_rate).data('old-value', item.precio);
								htmlObject.find('[name="item[][subtotal_precio]"]').val(item.precio / exchange_rate);

								delete (htmlObject[0].dataset.porcentajeMontoTotal);
								htmlObject.removeData('porcentaje-monto-total');
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
								htmlObject.find('[name="item[][precio_unitario]"]').prop('readonly', true);
								htmlObject.find('[name="item[][costo_unitario]"]').prop('readonly', true);
								// Bloquear nombre, tipo documento y cantidades
								htmlObject.find('[name="item[][nombre]"]').prop('readonly', true);
								htmlObject.find('button.show.item').invisible();
								//htmlObject.find('[name="item[][tipo_documento]"]').prop('readonly', true);
								//htmlObject.find('button.show.tipo-documento').hide();
								//htmlObject.find('[name="item[][cantidad]"]').prop('readonly', true);
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
								//htmlObject.find('[name="item[][cantidad]"]').prop('readonly', true);
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

							//DESACTIVA BOTONERA
							if (item.porcentaje_monto_total || item.formula_productor_ejecutivo || item.formula_asistente_produccion ) {
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
								<p>' + ((item.observacion != '') ? item.observacion.replace(/\n/g, '</p><p>') : 'N/A') + '</p> \
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
							htmlObject.data('tipo-documento', 33);
							if (typeof item.tipo_documento != 'undefined' && item.tipo_documento.id != 30 && item.tipo_documento.id != 33) {
								htmlObject.data('tipo-documento', item.tipo_documento.id);
								htmlObject.data('tipo-documento-text', item.tipo_documento.text);
								htmlObject.data('tipo-documento-ratio', item.tipo_documento.ratio);
								htmlObject.data('tipo-documento-valor-usd', item.tipo_documento.valor_usd);
								htmlObject.data('tipo-documento-valor-moneda', item.tipo_documento.valor_moneda);
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
								htmlObject.removeData('tipo-documento-valor-moneda');
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

							if ((typeof item.tipo_documento != 'undefined' && item.tipo_documento.id != 30 && item.tipo_documento.id != 33) || typeof item.hora_extra != 'undefined')
								htmlObject.find('button.detail.price').visible();

							var source = htmlObject.find('[name="item[][nombre]"]');
						}

						title.nextUntil('.title').each(function () {
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
				fail: function (a, b, c) {
					toastr.info(a + b + c);
				}
			});
		}
	});
};



// Sección datos cinemágica
var blockTotales = $('article.block-totales');
var blockCinemagica = $('article.block-cinemagica');

var resetItemsAutomaticos = function (event) {
	$('section.sheet table.items tbody tr:not(.title)').each(function (key, item) {
		var costo_admin = $(item).data('costo-admin');
		var formula_productor_ejecutivo = $(item).data('formula-productor-ejecutivo');
		var formula_asistente_produccion = $(item).data('formula-asistente-produccion');
		var formula_horas_extras = $(item).data('formula-horas-extras');
		var director_internacional = $(item).data('director-internacional');
		if (costo_admin || formula_productor_ejecutivo || formula_asistente_produccion || formula_horas_extras) {
			$(item).find('[name="item[][precio_unitario]"]').trigger('focus').val(0).trigger('blur');
		}
	});
}

var refreshValorPeliculaFromSobrecargos = function (event) {
	blockCinemagica.find('[name="sobrecargo[1][subtotal]"]').val(parseFloat(blockTotales.find('[name="sobrecargo[1][subtotal]"]').val()));
	refreshValorPeliculaUsd(event);
};
var refreshValorPeliculaToSobrecargos = function (event) {
	//blockCinemagica.find('span.loading').text('Calculando...');
	unaBase.ui.block();

	resetItemsAutomaticos();

	// Calcular horas extras
	var horas_extras_jornada = 0;
	var horas_extras_proyecto = 0;
	$('table.items.cotizacion tbody').find('tr:not(.title)').each(function (key, item) {
		if ($(item).data('hora-extra-enabled')) {
			if ($(item).data('hora-extra-jornada')) {
				horas_extras_jornada += parseFloat($(item).find('[name="item[][subtotal_precio]"]').val());
			} else {
				horas_extras_proyecto += parseFloat($(item).find('[name="item[][subtotal_precio]"]').val());
			}
		}
	});
	var dias_filmacion = parseFloat($('#main-container').find('[name="dato[5][valor]"]').val());
	if (isNaN(dias_filmacion)) {
		dias_filmacion = 1;
	} else {
		if (dias_filmacion == 0) {
			dias_filmacion = 1;
		}
	}
	var subtotal_horas_extras = 1.5 * horas_extras_jornada / dias_filmacion / 10 + 1.5 * horas_extras_proyecto / 10 / 10;
	$('table.items.cotizacion tbody').find('tr:not(.title)').each(function (key, item) {
		if ($(item).data('formula-horas-extras')) {
			$(item).find('[name="item[][precio_unitario]"]').trigger('focus').val(subtotal_horas_extras).trigger('blur');
			$(item).find('[name="item[][costo_unitario]"]').val(subtotal_horas_extras);
			$(item).find('[name="item[][cantidad]"]').trigger('blur');
			return false;
		}
	});

	var touchValorPelicula = function (sync) {
		var valor_pelicula = parseFloat(blockCinemagica.find('[name="sobrecargo[1][subtotal]"]').val());
		blockCinemagica.find('[name="sobrecargo[1][subtotal]"]').data('old-value', valor_pelicula);
		var subtotalObject = blockTotales.find('[name="sobrecargo[1][subtotal]"]');
		subtotalObject.trigger('focus');
		subtotalObject.val(valor_pelicula);
		subtotalObject.trigger('blur');
		subtotalObject.trigger('focus');
		subtotalObject.val(valor_pelicula);
		subtotalObject.trigger('blur');
		refreshValorPeliculaUsd(event);

		//blockCinemagica.find('span.loading').text('');
		if (!sync) {
			unaBase.ui.unblock();
		}
	};

	if ($('section.sheet').data('sync')) {
		touchValorPelicula(true);
	} else {
		setTimeout(touchValorPelicula, 1000);
	}

};
var refreshValorPeliculaUsd = function (event) {
	var exchange_rate_usd = (valor_usd_cotizacion > 0) ? valor_usd_cotizacion : valor_usd;
	var valor_pelicula = parseFloat(blockCinemagica.find('[name="sobrecargo[1][subtotal]"]').val());
	var valor_pelicula_usd = valor_pelicula / exchange_rate_usd;
	blockCinemagica.find('[name="sobrecargo[1][subtotal][usd]"]').val(valor_pelicula_usd);
	refreshUtilidadBrutaFromSobrecargos(event);
};
var refreshUtilidadBrutaFromSobrecargos = function (event) {

	blockCinemagica.find('[name="sobrecargo[1][porcentaje]"]').val(parseFloat(blockTotales.find('[name="sobrecargo[1][porcentaje]"]').val()));
	blockCinemagica.find('[name="sobrecargo[1][porcentaje]"]').data('value', parseFloat(blockTotales.find('[name="sobrecargo[1][porcentaje]"]').data('value')));
	blockCinemagica.find('[name="sobrecargo[1][valor]"]').val(parseFloat(blockTotales.find('[name="sobrecargo[1][valor]"]').val()));
	blockCinemagica.find('[name="sobrecargo[1][valor]"]').data('value', parseFloat(blockTotales.find('[name="sobrecargo[1][valor]"]').data('value')));
	refreshCostosFijosFromSobrecargos(event);
};
var refreshUtilidadBrutaToSobrecargos = function (event) {


	var i = 0;
	var max_iterations = 12;

	var porcentaje_utilidad_bruta = parseFloat(blockCinemagica.find('[name="sobrecargo[1][porcentaje]"]').data('value'));

	var refreshRecursivo = function () {
		if (i > max_iterations) {
			$('section.sheet').removeData('no-update');
			return false;
		}
		resetItemsAutomaticos();

		blockTotales.find('[name="sobrecargo[1][porcentaje]"]').trigger('focus');
		blockTotales.find('[name="sobrecargo[1][porcentaje]"]').val(porcentaje_utilidad_bruta);
		blockTotales.find('[name="sobrecargo[1][porcentaje]"]').trigger('blur');

		var valor_pelicula = parseFloat(blockTotales.find('[name="sobrecargo[1][subtotal]"]').val());
		var subtotalObject = blockTotales.find('[name="sobrecargo[1][subtotal]"]');
		subtotalObject.trigger('focus');
		subtotalObject.val(valor_pelicula);
		subtotalObject.trigger('blur');

		updateItemsPorcentaje(event);

		i++;
		refreshRecursivo();
	};

	unaBase.ui.block();
	$('section.sheet').data('no-update', true);
	setTimeout(function () {
		refreshRecursivo();

		//subtotalObject.trigger('focus');
		var valor_utilidad_bruta = parseFloat(blockTotales.find('[name="sobrecargo[1][valor]"]').val());
		//subtotalObject.val(valor_pelicula);
		//subtotalObject.trigger('blur');

		var exchange_rate_usd = (valor_usd_cotizacion > 0) ? valor_usd_cotizacion : valor_usd;
		var valor_pelicula = parseFloat(blockCinemagica.find('[name="sobrecargo[1][subtotal]"]').val());
		var valor_pelicula_usd = valor_pelicula / exchange_rate_usd;
		blockCinemagica.find('[name="sobrecargo[1][subtotal][usd]"]').val(valor_pelicula_usd);

		refreshCostosFijosFromSobrecargos(event);

		updateItemsPorcentaje(event);

		blockTotales.find('[name="sobrecargo[1][porcentaje]"]').trigger('focus');
		blockTotales.find('[name="sobrecargo[1][porcentaje]"]').val(porcentaje_utilidad_bruta);
		blockTotales.find('[name="sobrecargo[1][porcentaje]"]').trigger('blur');

		updateItemsPorcentaje(event);

		unaBase.ui.unblock();
	}, 1000);

};

var refreshCostosFijosFromSobrecargos = function (event) {
	blockCinemagica.find('[name="sobrecargo[4][porcentaje]"]').val(parseFloat(blockTotales.find('[name="sobrecargo[4][porcentaje]"]').val()));
	blockCinemagica.find('[name="sobrecargo[4][porcentaje]"]').data('value', parseFloat(blockTotales.find('[name="sobrecargo[4][porcentaje]"]').data('value')));
	blockCinemagica.find('[name="sobrecargo[4][valor]"]').val(parseFloat(blockTotales.find('[name="sobrecargo[4][valor]"]').val()));
	blockCinemagica.find('[name="sobrecargo[4][valor]"]').data('value', parseFloat(blockTotales.find('[name="sobrecargo[4][valor]"]').data('value')));
	refreshComisionAgenciaFromSobrecargos(event);
};
var refreshCostosFijosToSobrecargos = function (event) {
	blockTotales.find('[name="sobrecargo[4][porcentaje]"]').val(parseFloat(blockCinemagica.find('[name="sobrecargo[4][porcentaje]"]').val()));
	blockTotales.find('[name="sobrecargo[4][porcentaje]"]').data('value', parseFloat(blockCinemagica.find('[name="sobrecargo[4][porcentaje]"]').data('value')));
	blockTotales.find('[name="sobrecargo[4][porcentaje]"]').trigger('blur');
	refreshCostosFijosFromSobrecargos(event);
};

var refreshComisionAgenciaFromSobrecargos = function (event) {
	blockCinemagica.find('[name="sobrecargo[6][porcentaje]"]').val(parseFloat(blockTotales.find('[name="sobrecargo[6][porcentaje]"]').val()));
	blockCinemagica.find('[name="sobrecargo[6][porcentaje]"]').data('value', parseFloat(blockTotales.find('[name="sobrecargo[6][porcentaje]"]').data('value')));
	blockCinemagica.find('[name="sobrecargo[6][valor]"]').val(parseFloat(blockTotales.find('[name="sobrecargo[6][valor]"]').val()));
	blockCinemagica.find('[name="sobrecargo[6][valor]"]').data('value', parseFloat(blockTotales.find('[name="sobrecargo[6][valor]"]').data('value')));
	refreshCostosDirectos(event);
};
var refreshComisionAgenciaToSobrecargos = function (event) {
	if (event !== true) {
		blockTotales.find('[name="sobrecargo[6][porcentaje]"]').val(parseFloat(blockCinemagica.find('[name="sobrecargo[6][porcentaje]"]').val()));
		blockTotales.find('[name="sobrecargo[6][porcentaje]"]').data('value', parseFloat(blockCinemagica.find('[name="sobrecargo[6][porcentaje]"]').data('value')));
		blockTotales.find('[name="sobrecargo[6][porcentaje]"]').trigger('blur');
	}
	refreshComisionAgenciaFromSobrecargos(event);
};

var refreshCostosDirectos = function (event) {
	var costos_directos = 0;
	var costos_admin = 0; // Fórmula productor ejecutivo
	$('table.items tbody').find('tr:not(.title)').each(function (key, item) {
		if (($(item).data('costo-directo') && !($(item).data('formula-productor-ejecutivo'))) || $(item).data('formula-asistente-produccion')) // Fórmula productor ejecutivo y asistente producción
			costos_directos += parseFloat($(item).find('[name="item[][subtotal_precio]"]').val());
		// Fórmula productor ejecutivo
		if ($(item).data('costo-admin')) // Fórmula productor ejecutivo y asistente producción
			costos_admin += parseFloat($(item).find('[name="item[][subtotal_precio]"]').val());
	});
	blockCinemagica.find('[name="cotizacion[cinemagica][costos_directos]"]').val(costos_directos);
	blockCinemagica.data('costos-admin', costos_admin); // Fórmula productor ejecutivo
	refreshUtilidadNeta(event);
};

var refreshUtilidadNeta = function (event) {

	var utilidad_bruta = parseFloat(parseFloat(blockCinemagica.find('[name="sobrecargo[1][valor]"]').val()));
	var costos_fijos = parseFloat(parseFloat(blockCinemagica.find('[name="sobrecargo[4][valor]"]').val()));
	var utilidad_neta = utilidad_bruta - costos_fijos;
	blockCinemagica.find('[name="cotizacion[cinemagica][utilidad_neta]"]').val(utilidad_neta);
	refreshDirector(event);
};

var refreshDirector = function (event) {
	var utilidad_neta = parseFloat(blockCinemagica.find('[name="cotizacion[cinemagica][utilidad_neta]"]').val());
	var porcentaje_director = parseFloat(blockCinemagica.find('[name="cotizacion[cinemagica][director][porcentaje]"]').val());
	var valor_director = utilidad_neta * porcentaje_director / 100.00;
	blockCinemagica.find('[name="cotizacion[cinemagica][director][valor]"]').val(valor_director);
	var valor_compania = utilidad_neta - valor_director;
	blockCinemagica.find('[name="cotizacion[cinemagica][compania][valor]"]').val(valor_compania);
};

var updateItemsPorcentaje = function (event) {

	if ($(event.target).prop('name') == 'sobrecargo[1][porcentaje]') {
		//var total_a_cliente = parseFloat($('input[name="cotizacion[ajuste]"]').val()) - parseFloat($('input[name="cotizacion[ajuste]"]').val()) * parseFloat($('input[name="sobrecargo[6][porcentaje]"]').val() / 100.00);
		// cinemagica
		var total_a_cliente = parseFloat($('input[name="cotizacion[ajuste]"]').val());

		var valor_pelicula = parseFloat($('.block-totales [name="sobrecargo[1][subtotal]"]').val());
		var costos_directos = parseFloat($('.block-cinemagica [name="cotizacion[cinemagica][costos_directos]"]').val());
		var costos_admin = parseFloat(blockCinemagica.data('costos-admin'));

		var comision_productor = 0.15; // asdf test (15%)
		var comision_asistente = 0.01; // asdf test ( 1%)

		$('table.items tbody').find('tr').each(function () {
			if (typeof $(this).data('porcentaje-monto-total') == 'object' && $(this).data('porcentaje-monto-total') > 0) {
				item = $(this);

				var id_item = item.data('id');
				var cantidad = parseFloat(item.find('input[name="item[][cantidad]"]').data('old-value'));
				var factor = parseFloat(item.find('input[name="item[][factor]"]').data('old-value'));
				var porcentaje_monto_total = $(this).data('porcentaje-monto-total');

				precio_unitario = total_a_cliente * porcentaje_monto_total / (cantidad * factor);

				if (typeof item != 'undefined' && ((fixedTotalCliente && (precio_unitario == 0 || precio_unitario != parseFloat((item.find('input[name="item[][precio_unitario]"]').data('old-value')) ? item.find('input[name="item[][precio_unitario]"]').data('old-value') : item.find('input[name="item[][precio_unitario]"]').val()))) || !fixedTotalCliente)) {

					item.find('input[name="item[][precio_unitario]"]').val(precio_unitario).data('old-value', precio_unitario).trigger('blur');
					item.find('input[name="item[][costo_unitario]"]').val(precio_unitario).data('old-value', precio_unitario).trigger('blur');
					item.find('[name="item[][cantidad]"]').trigger('blur');
				}
			}

			// Fórmula productor ejecutivo
			if (typeof $(this).data('formula-productor-ejecutivo') != 'undefined' && $(this).data('formula-productor-ejecutivo')) {
				item = $(this);

				var id_item = item.data('id');
				var cantidad = parseFloat(item.find('input[name="item[][cantidad]"]').data('old-value'));
				var factor = parseFloat(item.find('input[name="item[][factor]"]').data('old-value'));

				precio_unitario = ((valor_pelicula - costos_directos - costos_admin) * comision_productor * valor_pelicula / (total_a_cliente + valor_pelicula * comision_productor)) / (cantidad * factor);

				console.log({
					'Valor película': valor_pelicula,
					'Costos directos': costos_directos,
					'Costos admin': costos_admin,
					'ValorPelicula-CostosDirectos-CostosAdmin': (valor_pelicula - costos_directos - costos_admin),
					'Comisión productor': comision_productor,
					'Total a cliente': total_a_cliente
				});

				if (typeof item != 'undefined' && ((fixedTotalCliente && (precio_unitario == 0 || precio_unitario != parseFloat((item.find('input[name="item[][precio_unitario]"]').data('old-value')) ? item.find('input[name="item[][precio_unitario]"]').data('old-value') : item.find('input[name="item[][precio_unitario]"]').val()))) || !fixedTotalCliente)) {
					if (!$('section.sheet').data('no-update')) {
						for (var i = 0; i < 30; i++) {
							console.log('Precio calculado: ', precio_unitario);
							//precio_unitario = precio_unitario.toFixed(2).replace('.', ',');
							item.find('input[name="item[][precio_unitario]"]').val(precio_unitario).data('old-value', precio_unitario);//.trigger('blur');
							item.find('input[name="item[][subtotal_precio]"]').val(precio_unitario).data('old-value', precio_unitario);
							item.find('input[name="item[][costo_unitario]"]').val(precio_unitario).data('old-value', precio_unitario);//.trigger('blur');
							item.find('input[name="item[][subtotal_costo]"]').val(precio_unitario).data('old-value', precio_unitario);
							if (i == 29) {
								item.find('input[name="item[][precio_unitario]"]').trigger('blur');
								item.find('[name="item[][cantidad]"]').trigger('blur');
							}
							console.log('Precio en el campo: ', item.find('input[name="item[][precio_unitario]"]').val());
						}
					} else {
						console.log('Precio calculado: ', precio_unitario);

						//precio_unitario = precio_unitario.toFixed(2).replace('.', ',');
						item.find('input[name="item[][precio_unitario]"]').val(precio_unitario).data('old-value', precio_unitario);//.trigger('blur');
						item.find('input[name="item[][subtotal_precio]"]').val(precio_unitario).data('old-value', precio_unitario);
						item.find('input[name="item[][costo_unitario]"]').val(precio_unitario).data('old-value', precio_unitario);
						item.find('input[name="item[][subtotal_costo]"]').val(precio_unitario).data('old-value', precio_unitario);
						item.find('input[name="item[][precio_unitario]"]').trigger('blur');
						item.find('[name="item[][cantidad]"]').trigger('blur');
						console.log('Precio en el campo: ', item.find('input[name="item[][precio_unitario]"]').val());
					}
				}
			}

			// Fórmula asistente producción
			if (typeof $(this).data('formula-asistente-produccion') != 'undefined' && $(this).data('formula-asistente-produccion')) {
				item = $(this);

				var id_item = item.data('id');
				var cantidad = parseFloat(item.find('input[name="item[][cantidad]"]').data('old-value'));
				var factor = parseFloat(item.find('input[name="item[][factor]"]').val('old-value'));

				precio_unitario = ((valor_pelicula > 200000000) ? 200000000 * comision_asistente : valor_pelicula * comision_asistente) / (cantidad * factor);
				if (typeof item != 'undefined' && ((fixedTotalCliente && (precio_unitario == 0 || precio_unitario != parseFloat((item.find('input[name="item[][precio_unitario]"]').data('old-value')) ? item.find('input[name="item[][precio_unitario]"]').data('old-value') : item.find('input[name="item[][precio_unitario]"]').val()))) || !fixedTotalCliente)) {
					item.find('input[name="item[][precio_unitario]"]').val(precio_unitario).data('old-value', precio_unitario).trigger('blur');
					item.find('input[name="item[][subtotal_precio]"]').val(precio_unitario).data('old-value', precio_unitario).trigger('blur');
					item.find('input[name="item[][costo_unitario]"]').val(precio_unitario).data('old-value', precio_unitario).trigger('blur');
					item.find('input[name="item[][subtotal_costo]"]').val(precio_unitario).data('old-value', precio_unitario).trigger('blur');
					item.find('[name="item[][cantidad]"]').trigger('blur');
				}
			}

		});
	}
};


