
//REAPER
//items adicionales al total
$('section.sheet > footer').on('click', ' article.block-totales button.total-adicionales', function (event) {


	unaBase.loadInto.dialog('/v3/views/cotizaciones/dialog/total_adicionales.shtml?id=' + $('section.sheet').data('id'), 'Items adicionales directos al total', 'medium');
});



$('section.sheet').on('click', 'button.shortcuts', function (event) {

	unaBase.loadInto.dialog('/v3/views/cotizaciones/dialog/shortcuts.shtml?id=' + $('section.sheet').data('id'), 'Shortcuts', 'medium');
});



$('section.sheet').on('click', 'button.general_params.detalle', function (event) {

	unaBase.loadInto.dialog('/v3/views/cotizaciones/dialog/general_params.shtml?id=' + $('section.sheet').data('id'), 'Monedas', 'xm2-small');

});






//TIPO DOC LINEAS COT/NEG
$('section.sheet table').on('click', 'tbody button.show.tipo-documento', function () {

	let thisItem = $(this).parentTo('tr').find('[name="item[][tipo_documento]"]');
	let value = thisItem.val();
	thisItem[0].dataset.oldValueDoc = value;
	thisItem.val('');
	thisItem.autocomplete({ minLength: 0 });
	thisItem.keydown();
});
$('section.sheet table').on('blur', 'tbody button.show.tipo-documento', function () {

	let thisItem = $(this).parentTo('tr').find('[name="item[][tipo_documento]"]');
	let oldValueDoc = thisItem[0].dataset.oldValueDoc;
	if (thisItem.val() === "") {
		thisItem.val(oldValueDoc);
	}
});
$('section.sheet table').on('click', 'tbody button.show.tipo-documento-compras', function () {
	let thisItem = $(this).parentTo('tr').find('[name="item[][tipo_documento_compras]"]');
	let value = thisItem.val();
	thisItem[0].dataset.oldValueDoc = value;
	thisItem.val('');
	thisItem.autocomplete({ minLength: 0 });
	thisItem.keydown();
});
$('section.sheet table').on('blur', 'tbody button.show.tipo-documento-compras', function () {

	let thisItem = $(this).parentTo('tr').find('[name="item[][tipo_documento_compras]"]');
	let oldValueDoc = thisItem[0].dataset.oldValueDoc;
	if (thisItem.val() === "") {
		thisItem.val(oldValueDoc);
	}
});


$('section.sheet table.items.cotizacion').on('click', '#global-item', function () {
	let estado = this.checked
	document.querySelectorAll('table.items.cotizacion tbody tr input[name="item[][selected]"]').forEach(r => r.checked = estado)
});

$('section.sobrecargos ul.sc-cine').on('change', 'input.new-input', function () {
	
	sobrecargos.calculate()
});

$('section.sheet table.items.cotizacion').on('change', '.tipo-documento-select', function (event) {
	const el = event;
	//let valorSeleccionado = $(this).val();
	let valorSeleccionado = $(this)[0].options[$(this)[0].options.selectedIndex] != undefined ? $(this)[0].options[$(this)[0].options.selectedIndex].dataset.id : ''

	//$(this)[0].options[$(this)[0].options.selectedIndex].textContent = valorSeleccionado
	var target = $(this).closest('tr');
	if (valorSeleccionado != '') {
		changeTipoDocumento(target, target.data('tipo-documento-compras'), valorSeleccionado, 'compras');

		changeTipoDocumento(target, target.data('tipo-documento'), valorSeleccionado);
		
		if (!modoOffline) {
			updateSubtotalTitulos($(this));
			updateSubtotalItems();
		}

		toastr.success(
			"Valor asignado correctamente!"
		);

	}

});

$('section.sheet table.items.cotizacion').on('change', '.tipo-documento-compra-select', function (event) {
	const el = event;
	//let valorSeleccionado = $(this).val();
	let valorSeleccionado = $(this)[0].options[$(this)[0].options.selectedIndex] != undefined ? $(this)[0].options[$(this)[0].options.selectedIndex].dataset.id : ''
	//$(this)[0].options[$(this)[0].options.selectedIndex].textContent = valorSeleccionado

	var target = $(this).closest('tr');
	if (valorSeleccionado != '') {
		changeTipoDocumento(target, target.data('tipo-documento-compras'), valorSeleccionado, 'compras');
		if (!modoOffline) {
			updateSubtotalTitulos($(this));
			updateSubtotalItems();
		}

		toastr.success(
			"Valor asignado correctamente!"
		);

	}

});



// $('section.sheet table.items.cotizacion').on('keydown', 'td', function () {
// 	
// 	if(event.keyCode == 9){

// 		event.preventDefault()
// 		const nextSibling = (el) =>{


// 		}
// 			el.nextElementSibling != null
// 				? el.nextElementSibling.classList.contains('tab') 
// 					? typeof $(el.nextElementSibling).find('input.tab') != 'undefined' 
// 						? $(el.nextElementSibling).find('input.tab').focus() 
// 						: el.closest("tr").nextElementSibling.classList.contains('item') 
// 							? el.closest("tr").nextElementSibling.closest('td.tab').focus()
// 							: nextSibling(el.closest("tr").nextElementSibling.closest('td')) 
// 					: typeof el.nextElementSibling != 'undefined' 
// 						? nextSibling(el.nextElementSibling)
// 						: null
// 				:  el.closest("tr").nextElementSibling.classList.contains('item') 
// 					?  $(el.closest("tr").nextElementSibling).find('td.tab input.tab').focus()
// 					// : nextSibling(el.closest("tr").nextElementSibling) null
// 					:  null

// 		nextSibling(this)
// 	}
// });

// $('section.sheet table.items.cotizacion').on('hover', 'tbody tr.item', function () {
// 	
// 	this.querySelectorAll('i').forEach(i => i.classList.add("illuminate"))

// });


var changeTipoDocumento = function (target, tipo_documento_old, tipo_documento_new, tipo = "") {
	
	// Se actualiza el valor de las horas extras simulando 'cambio' en el input
	if (tipo_documento_old != tipo_documento_new)
		target.find('input[name="item[][horas_extras]"]').trigger('change');



	if (tipo != "")
		tipo = "-compras"

	// Se extraen los datos relevantes para desglosar el precio
	var tipo_documento_ratio_old = (typeof target.data(`tipo-documento${tipo}-ratio`) != 'undefined') ? target.data(`tipo-documento${tipo}-ratio`) : 0;
	var tipo_documento_valor_usd_old = (typeof target.data(`tipo-documento${tipo}-valor-usd`) != 'undefined') ? target.data(`tipo-documento${tipo}-valor-usd`) : false; // Impuesto extranjero
	let tipo_documento_valor_moneda_old = (typeof target.data(`tipo-documento${tipo}-valor-moneda`) != 'undefined') ? target.data(`tipo-documento${tipo}-valor-moneda`) : 1; // Impuesto extranjero


	var tipo_documento_inverse_old = (typeof target.data(`tipo-documento${tipo}-inverse`) != 'undefined') ? target.data(`tipo-documento${tipo}-inverse`) : false;
	var base_imponible_old = 0
	let id_nv = $('section.sheet').data('id')
	var hora_extra_cantidad_old = target.find('[name="item[][horas_extras]"]').val();
	var precio_base = 0;
	let id_doc = 0


	target.data(`tipo-documento${tipo}`, tipo_documento_new);


	
	if (tipo != "") {
		if (target.find('[name="item[][costo_unitario]"]').data('old-value'))
			base_imponible_old = (tipo_documento_ratio_old > 0) ? target.data('base-imponible-compras') : target.find('[name="item[][costo_unitario]"]').data('old-value');
		else
			base_imponible_old = (tipo_documento_ratio_old > 0) ? target.data('base-imponible-compras') : target.find('[name="item[][costo_unitario]"]').val();

	} else {
		if (target.find('[name="item[][precio_unitario]"]').data('old-value'))
			base_imponible_old = (tipo_documento_ratio_old > 0) ? target.data('base-imponible') : target.find('[name="item[][precio_unitario]"]').data('old-value');
		else
			base_imponible_old = (tipo_documento_ratio_old > 0) ? target.data('base-imponible') : target.find('[name="item[][precio_unitario]"]').val();

	}

	// Se reconstruye el precio base

	
	if (tipo_documento_valor_usd_old)
		precio_base = parseFloat(((base_imponible_old / tipo_documento_valor_moneda_old) * (1 - tipo_documento_ratio_old)).toFixed(currency.decimals + 2));
	else
		precio_base = base_imponible_old
	
	// if (tipo_documento_inverse_old) {
	// 	// precio_base = Math.round(base_imponible_old * (1 - tipo_documento_ratio_old));
	// 	// precio_base = parseFloat((base_imponible_old * (1 - tipo_documento_ratio_old)).toFixed(currency.decimals + 2));

	// 	if (tipo_documento_valor_usd_old)
	// 		//precio_base = parseFloat((((base_imponible_old / tipo_documento_valor_moneda_old ) * valor_moneda_new) * (1 - tipo_documento_ratio_old)).toFixed(currency.decimals + 2));
	// 		precio_base = parseFloat(((base_imponible_old / tipo_documento_valor_moneda_old) * (1 - tipo_documento_ratio_old)).toFixed(currency.decimals + 2));
	// 	else
	// 		precio_base = parseFloat((base_imponible_old * (1 - tipo_documento_ratio_old)).toFixed(currency.decimals + 2));
	// }
	// else
	// 	//precio_base = parseFloat((base_imponible_old / (1 + tipo_documento_ratio_old)).toFixed(currency.decimals + 2));
	// 	precio_base = base_imponible_old


	if (tipo == '') {

		id_doc = target.data('tipo-documento')
		// Se actualizan valores relacionados a las horas hombre de OT
		// TODO: actualziar automáticamente cuando se cambian los días para el contrato por proyecto

		if (target.find('input[name="item[][costo_interno]"]').prop('checked')) {

			if (typeof target.data('costo-presupuestado-hh-cantidad') == 'undefined')
				target.data('costo-presupuestado-hh-cantidad', 0);

			if (typeof target.data('costo-presupuestado-hh-valor') == 'undefined')
				target.data('costo-presupuestado-hh-valor', 0);

			var old_costo_total = parseFloat((target.find('input[name="item[][costo_unitario]"]').data('old-value')) ? target.find('input[name="item[][costo_unitario]"]').data('old-value') : target.find('input[name="item[][costo_unitario]"]').val());
			var old_costo_interno = target.data('costo-presupuestado-hh-cantidad') * target.data('costo-presupuestado-hh-valor');
			var costo_externo = old_costo_total - old_costo_interno;

			var new_costo_interno = parseFloat($('input[name="item[][cant_hh_asig]"]').val()) * parseFloat($('input[name="item[][costo_hh_unitario]"]').val());
			var new_costo_total = costo_externo + new_costo_interno;

			if (old_costo_total != new_costo_total) {
				target.find('input[name="item[][costo_unitario]"]').val(new_costo_total.toFixed(currency.decimals)).data('old-value', new_costo_total.toFixed(currency.decimals + 2));
				updateRow({
					target: target.find('input[name="item[][costo_unitario]"]')
				});
			}
		}

		if (target.data('costo-presupuestado-hh-cantidad') > 0 && target.find('input[name="item[][costo_interno]"]').prop('checked'))
			target.find('button.detail.cost').visible();
		else
			target.find('button.detail.cost').invisible();

	} else {
		id_doc = target.data('tipo-documento-compras')
		// if (target.find('[name="item[][precio_unitario]"]').data('old-value'))
		// 	base_imponible_old = (tipo_documento_ratio_old > 0)? target.data('base-imponible') : target.find('[name="item[][costo_unitario]"]').data('old-value');
		// else
		// 	base_imponible_old = (tipo_documento_ratio_old > 0)? target.data('base-imponible') : target.find('[name="item[][costo_unitario]"]').val();

	}



	// Se consulta el tipo de documento elegido y se cambian los parámetros de cálculo de acuerdo a él
	if (tipo_documento_old != tipo_documento_new) {
		// Se rescatan y cambian los parámetros de cálculo

		
		let data = unaBase.tipoDocumentos.find(v => v.id == id_doc)
		if (data) {

			let precio_unitario = 0

			
			target.data(`tipo-documento${tipo}-text`, data.text);
			target.data(`tipo-documento${tipo}-ratio`, data.ratio);
			target.data(`tipo-documento${tipo}-valor-usd`, data.valor_usd); // Impuesto extranjero
			target.data(`tipo-documento${tipo}-valor-moneda`, parseFloat(String(data.valor_moneda_nv).replace(',', '.'))); // Impuesto extranjero
			target.data(`tipo-documento${tipo}-valor-usd-code`, data.code); // Impuesto extranjero
			let status = data.inverse
			target.data(`tipo-documento${tipo}-inverse`, status);
			target.find(`[name="item[][tipo_documento${tipo == '' ? tipo : '_compras'}]"]`).val(data.id);

			if (tipo != "") {
				target.find(`[name="item[][tipo_documento${tipo == '' ? tipo : '_compras'}]"] option:selected`).text(data.abbr)


				if (data.ratio == 0)
					target.find(`input[name="item[][costo_unitario]"]`).removeClass('edited');
				else
				target.find(`input[name="item[][costo_unitario]"]`).addClass('edited')

				//target.data('base-imponible-compras', parseFloat((target.find('input[name="item[][costo_unitario]"]').data('old-value')) ? target.find('input[name="item[][costo_unitario]"]').data('old-value') : target.find('input[name="item[][costo_unitario]"]').val()));

			} else {
				if (data.ratio == 0){

					target.find(`input[name="item[][precio_unitario]"]`).removeClass('edited');
					target.find('button.detail.price').invisible();
				}
				else{
					target.find('button.detail.price').visible();
					target.find(`input[name="item[][precio_unitario]"]`).addClass('edited')
				}


				if (typeof data.hora_extra != 'undefined') {
					target.data('hora-extra-enabled', true);
					target.data('hora-extra-factor', data.hora_extra.factor);
					target.data('hora-extra-jornada', data.hora_extra.jornada);
					target.find('input[name="item[][horas_extras]"]').val(0).parentTo('td').visible();
					target.find('input[name="item[][precio_unitario]"]').addClass('edited')
					target.data('hora-extra-dias', data.hora_extra.dias);
					target.find('button.detail.price').visible();
				} else {
					target.data('hora-extra-enabled', false);
					target.find('input[name="item[][horas_extras]"]').val(0).parentTo('td').invisible();

					target.find('input[name="item[][precio_unitario]"]').removeClass('edited').removeClass('special');
					//target.data('base-imponible', parseFloat((target.find('input[name="item[][precio_unitario]"]').data('old-value')) ? target.find('input[name="item[][precio_unitario]"]').data('old-value') : target.find('input[name="item[][precio_unitario]"]').val()));
					
				}

			}



		} else {
			if (tipo == "") {
				target.data('hora-extra-enabled', false);
				target.find('input[name="item[][horas_extras]"]').val(0).parentTo('td').invisible();
				target.find('input[name="item[][precio_unitario]"]').removeClass('edited').removeClass('special');
				target.find('button.detail.price').invisible();
				//target.data('base-imponible', parseFloat((target.find('input[name="item[][precio_unitario]"]').data('old-value')) ? target.find('input[name="item[][precio_unitario]"]').data('old-value') : target.find('input[name="item[][precio_unitario]"]').val()));
			}
		}
		
		if (tipo == '')
			precio_unitario = (target.find('input[name="item[][precio_unitario]"]').data('old-value')) ? target.find('input[name="item[][precio_unitario]"]').data('old-value') : target.find('input[name="item[][precio_unitario]"]').val();
		else
			precio_unitario = (target.find('input[name="item[][costo_unitario]"]').data('old-value')) ? target.find('input[name="item[][costo_unitario]"]').data('old-value') : target.find('input[name="item[][costo_unitario]"]').val();


		if (precio_unitario != 0) {
			
			// Se reemplaza el precio base antiguo por el nuevo
			if (tipo == '')
				target.find('input[name="item[][precio_unitario]"]').trigger('focus').val(precio_base).trigger('blur').data('old-value', precio_base).trigger('blur');
			else
				target.find('input[name="item[][costo_unitario]"]').trigger('focus').val(precio_base).trigger('blur').data('old-value', precio_base).trigger('blur');




			// Se reemplaza la cantidad horas extras antigua por la nueva
			if (target.data('hora-extra-enabled')) {
				target.find('input[name="item[][horas_extras]"]').val(hora_extra_cantidad_old).trigger('change');
			}

		}

		// Actualizar previo
		target.find('input[name="item[][costo_unitario_previo]"]').val(target.find('input[name="item[][costo_unitario]"]').val());
		
		target.find('input[name="item[][subtotal_costo_previo]"]').val(target.find('input[name="item[][subtotal_costo]"]').val());
	}
	// if (tipo_documento_old != tipo_documento_new)
	// 	$.ajax({
	// 		url: '/4DACTION/_V3_getTipoDocumento',
	// 		data: {
	// 			q: id_doc,
	// 			// q: '',
	// 			filter: 'id',
	// 			id_nv
	// 		},
	// 		dataType: 'json',
	// 		async: false,
	// 		success: function (data) {
	// 			// Se rescatan y cambian los parámetros de cálculo
	// 			if (data.rows.length) {

	// 				let precio_unitario = 0
	// 				
	// 				target.data(`tipo-documento${tipo}-text`, data.rows[0].text);
	// 				target.data(`tipo-documento${tipo}-ratio`, data.rows[0].ratio);
	// 				target.data(`tipo-documento${tipo}-valor-usd`, data.rows[0].valor_usd); // Impuesto extranjero
	// 				target.data(`tipo-documento${tipo}-valor-moneda`, parseFloat(data.rows[0].valor_moneda_nv.replace(',', '.'))); // Impuesto extranjero
	// 				target.data(`tipo-documento${tipo}-valor-usd-code`, data.rows[0].code); // Impuesto extranjero
	// 				target.data(`tipo-documento${tipo}-inverse`, data.rows[0].inverse);
	// 				target.find(`[name="item[][tipo_documento${tipo == '' ? tipo : '_compras'}]"]`).val(data.rows[0].abbr);

	// 				if (tipo != "") {
	// 					if (data.rows[0].ratio == 0)
	// 						target.find(`input[name="item[][costo_unitario]"]`).removeClass('edited');

	// 					target.data('base-imponible-compras', parseFloat((target.find('input[name="item[][costo_unitario]"]').data('old-value')) ? target.find('input[name="item[][costo_unitario]"]').data('old-value') : target.find('input[name="item[][costo_unitario]"]').val()));

	// 				} else {
	// 					if (data.rows[0].ratio == 0)
	// 						target.find(`input[name="item[][precio_unitario]"]`).removeClass('edited');

	// 					if (typeof data.rows[0].hora_extra != 'undefined') {
	// 						target.data('hora-extra-enabled', true);
	// 						target.data('hora-extra-factor', data.rows[0].hora_extra.factor);
	// 						target.data('hora-extra-jornada', data.rows[0].hora_extra.jornada);
	// 						target.find('input[name="item[][horas_extras]"]').val(0).parentTo('td').visible();
	// 						target.find('input[name="item[][precio_unitario]"]').addClass('edited')
	// 						target.data('hora-extra-dias', data.rows[0].hora_extra.dias);
	// 						target.find('button.detail.price').visible();
	// 					} else {
	// 						target.data('hora-extra-enabled', false);
	// 						target.find('input[name="item[][horas_extras]"]').val(0).parentTo('td').invisible();

	// 						target.find('input[name="item[][precio_unitario]"]').removeClass('edited').removeClass('special');
	// 						target.data('base-imponible', parseFloat((target.find('input[name="item[][precio_unitario]"]').data('old-value')) ? target.find('input[name="item[][precio_unitario]"]').data('old-value') : target.find('input[name="item[][precio_unitario]"]').val()));
	// 						target.find('button.detail.price').invisible();
	// 					}

	// 				}



	// 			} else {
	// 				if (tipo == "") {
	// 					target.data('hora-extra-enabled', false);
	// 					target.find('input[name="item[][horas_extras]"]').val(0).parentTo('td').invisible();
	// 					target.find('input[name="item[][precio_unitario]"]').removeClass('edited').removeClass('special');
	// 					target.find('button.detail.price').invisible();
	// 					target.data('base-imponible', parseFloat((target.find('input[name="item[][precio_unitario]"]').data('old-value')) ? target.find('input[name="item[][precio_unitario]"]').data('old-value') : target.find('input[name="item[][precio_unitario]"]').val()));
	// 				}
	// 			}

	// 			if (tipo == '')
	// 				precio_unitario = (target.find('input[name="item[][precio_unitario]"]').data('old-value')) ? target.find('input[name="item[][precio_unitario]"]').data('old-value') : target.find('input[name="item[][precio_unitario]"]').val();
	// 			else
	// 				precio_unitario = (target.find('input[name="item[][costo_unitario]"]').data('old-value')) ? target.find('input[name="item[][costo_unitario]"]').data('old-value') : target.find('input[name="item[][costo_unitario]"]').val();


	// 			if (precio_unitario != 0) {
					
	// 				// Se reemplaza el precio base antiguo por el nuevo
	// 				if (tipo == '')
	// 					target.find('input[name="item[][precio_unitario]"]').trigger('focus').val(0).trigger('blur').trigger('focus').val(precio_base).data('old-value', precio_base).trigger('blur');
	// 				else
	// 					target.find('input[name="item[][costo_unitario]"]').trigger('focus').val(0).trigger('blur').trigger('focus').val(precio_base).data('old-value', precio_base).trigger('blur');



	// 				// Se reemplaza la cantidad horas extras antigua por la nueva
	// 				if (target.data('hora-extra-enabled')) {
	// 					target.find('input[name="item[][horas_extras]"]').val(hora_extra_cantidad_old).trigger('change');
	// 				}

	// 			}

	// 			// Actualizar previo
	// 			target.find('input[name="item[][costo_unitario_previo]"]').val(target.find('input[name="item[][costo_unitario]"]').val());
	// 			target.find('input[name="item[][subtotal_costo_previo]"]').val(target.find('input[name="item[][subtotal_costo]"]').val());

	// 		}
	// 	});
};




$('section.sheet').on('hover', 'button.detail.price', function (event) {
	var element = $(this);
	$(this).tooltipster({
		content: function () {
			var htmlObject = $('\
				<ul>																																							\
					<li data-name="tipo-documento">																																\
						<strong style="font-weight: bold; display: inline-block; width: 300px;">Tipo de documento</strong>														\
						<span></span>																																			\
					</li>																																						\
					<li data-name="valor-negociado">																															\
						<strong style="font-weight: bold; display: inline-block; width: 300px;">Valor ingresado<span class="valor-usd"></span></strong>							\
						<span class="numeric currency">' + localCurrency + ' <span style="display: inline-block; width: 100px; text-align: right; font-family: Calibri""></span></span>				\
					</li>																																						\
					<li data-name="imposiciones">																																\
						<strong style="font-weight: bold; display: inline-block; width: 300px;">Imposiciones (<span class="numeric percent"></span>%)</strong>					\
						<span class="numeric currency">' + localCurrency + ' <span style="display: inline-block; width: 100px; text-align: right; font-family: Calibri""></span></span>				\
					</li>																																						\
					<li data-name="retencion">																																	\
						<strong style="font-weight: bold; display: inline-block; width: 300px;">Retención (<span class="numeric percent"></span>%)</strong>						\
						<span class="numeric currency">' + localCurrency + ' <span style="display: inline-block; width: 100px; text-align: right; font-family: Calibri""></span></span>				\
					</li>																																						\
					<li data-name="horas-extras">																																\
						<strong style="font-weight: bold; display: inline-block; width: 300px;">Horas extras (<span class="numeric percent"></span>)</strong>					\
						<span class="numeric currency">' + localCurrency + ' <span style="display: inline-block; width: 100px; text-align: right; font-family: Calibri""></span></span>				\
					</li>																																						\
					<li data-name="total" style="border-top: 1px solid grey; margin-top: 10px; padding-top: 10px;">																\
						<strong style="font-weight: bold; display: inline-block; width: 300px;">Total</strong>																	\
						<span class="numeric currency">' + localCurrency + ' <span style="display: inline-block; width: 100px; text-align: right; font-family: Calibri""></span></span>				\
					</li>																																						\
				</ul>																																							\
			');

			var row = element.parentTo('tr');

			var horas_extras_cantidad = parseFloat(row.find('input[name="item[][horas_extras]"]').val());
			if (horas_extras_cantidad == 0)
				htmlObject.find('li[data-name="horas-extras"]').hide();
			var hora_extra_valor = parseFloat(row.data('hora-extra-valor'));
			if (typeof hora_extra_valor == 'undefined') {
				row.find('input[name="item[][horas_extras]"]').trigger('change');
				hora_extra_valor = parseFloat(row.data('hora-extra-valor'));
			}

			var base_imponible = parseFloat(row.data('base-imponible'));

			if (typeof base_imponible == 'undefined') {
				row.find('input[name="item[][precio_unitario]"]').trigger('focus');
				row.find('input[name="item[][precio_unitario]"]').trigger('blur');
				base_imponible = parseFloat(row.data('base-imponible'));
			}

			var tipo_documento = row.data('tipo-documento-text');
			var impuesto = parseFloat(row.data('tipo-documento-ratio'));
			var valor_usd = row.data('tipo-documento-valor-usd'); // Impuesto extranjero
			let valor_moneda = row.data('tipo-documento-valor-moneda'); // Impuesto extranjero
			let codigoLinea = row.data('tipo-documento-text') // Impuesto extranjero


			var division = row.data('tipo-documento-inverse');



			if (typeof selected_currency == 'undefined')
				var total = parseFloat((row.find('input[name="item[][precio_unitario]"]').data('old-value')) ? row.find('input[name="item[][precio_unitario]"]').data('old-value') : row.find('input[name="item[][precio_unitario]"]').val());
			else
				var total = parseFloat((row.find('input[name="item[][precio_unitario]"]').data('old-value')) ? row.find('input[name="item[][precio_unitario]"]').data('old-value') : row.find('input[name="item[][precio_unitario]"]').val());

			var valor_cotizado = row.find('input[name="item[][precio_unitario]"]').data('old-value');



			htmlObject.find('li[data-name="imposiciones"]').hide();

			// if (division) {
			// 	// Impuesto extranjero
			// 	if (valor_usd)
			// 	valor_cotizado = (base_imponible * (1 - impuesto)) / valor_moneda;
			// 	else
			// } else{
			// 	htmlObject.find('li[data-name="imposiciones"]').hide();
			// 	valor_cotizado = base_imponible / (1 + impuesto);
			// }
			


			// if (division) {

			// 	// Impuesto extranjero
			// 	if (valor_usd)
			// 		valor_cotizado = base_imponible * (1 - impuesto);
			// 	else
			// 		valor_cotizado = base_imponible * (1 - impuesto);
			// } else {
			// 	htmlObject.find('li[data-name="retencion"]').hide();
			// 	valor_cotizado = base_imponible / (1 + impuesto);
			// }

			var imposiciones = Math.abs(base_imponible - valor_cotizado);

			// Impuesto extranjero
			if (valor_usd)
				htmlObject.find('li[data-name="valor-negociado"] span.valor-usd').text(' (' + codigoLinea + ' ' + unaBase.utilities.transformNumber(parseFloat(String(valor_moneda).replace(',','.')).toFixed(2).replace(/\./g, ','), 'view', 'end') + ')'); // Impuesto extranjero

			htmlObject.find('li[data-name="tipo-documento"] > span').text(tipo_documento);

			if (typeof selected_currency == 'undefined')
				htmlObject.find('li[data-name="valor-negociado"] > span > span').text(base_imponible.toFixed(currency.decimals).replace(/\./g, ','));
			else
				htmlObject.find('li[data-name="valor-negociado"] > span > span').text(base_imponible.toFixed(2).replace(/\./g, ','));

			htmlObject.find('li[data-name="imposiciones"] > strong span').text((impuesto * 100).toFixed(2));
			if (typeof selected_currency == 'undefined')
				htmlObject.find('li[data-name="imposiciones"] > span > span').text(imposiciones.toFixed(currency.decimals).replace(/\./g, ','));
			else
				htmlObject.find('li[data-name="imposiciones"] > span > span').text(imposiciones.toFixed(2).replace(/\./g, ','));

			htmlObject.find('li[data-name="retencion"] > strong span').text((impuesto * 100).toFixed(2));
			if (typeof selected_currency == 'undefined')
				htmlObject.find('li[data-name="retencion"] > span > span').text(imposiciones.toFixed(currency.decimals).replace(/\./g, ','));
			else
				htmlObject.find('li[data-name="retencion"] > span > span').text(imposiciones.toFixed(2).replace(/\./g, ','));

			htmlObject.find('li[data-name="horas-extras"] > strong span').text(horas_extras_cantidad);
			if (typeof selected_currency == 'undefined')
				htmlObject.find('li[data-name="horas-extras"] > span > span').text(Math.round(hora_extra_valor * horas_extras_cantidad).toFixed(currency.decimals).replace(/\./g, ','));
			else
				htmlObject.find('li[data-name="horas-extras"] > span > span').text((hora_extra_valor * horas_extras_cantidad).toFixed(2).replace(/\./g, ','));

			if (typeof selected_currency == 'undefined')
				htmlObject.find('li[data-name="total"] > span > span').text(total.toFixed(currency.decimals).replace(/\./g, ','));
			else
				htmlObject.find('li[data-name="total"] > span > span').text(total.toFixed(2).replace(/\./g, ','));

			htmlObject.find('span.numeric.percent > span').number(true, 2, ',', '.');
			if (typeof selected_currency == 'undefined')
				htmlObject.find('span.numeric.currency > span').number(true, currency.decimals, ',', '.');
			else
				htmlObject.find('span.numeric.currency > span').number(true, 2, ',', '.');


			return htmlObject;
		},
		interactive: true,
		trigger: '',
		delay: 0,
		interactiveAutoClose: true
	});
	$(this).tooltipster('show');
});

$('section.sheet').on('mouseout', 'button.detail.price', function (event) {
	$(this).tooltipster('destroy');
});
