
//-----------------------   Variables   --------------------------
//----------------------------------------------------------------







var business = {
	item: {}
}

var calculo_UR_con_subtotal = false;





//-----------------------  Functions ----------------------------
//----------------------------------------------------------------

business.item.duplicate = item => {

	var element = $(item);
	var cloneItem = function () {

		//var current = $(this).parentTo('tr');
		var current = element.parentTo('tr');

		current.find('.profile.item').tooltipster('destroy');

		var cloned = current.removeClass('focused').clone(true)
		var oldId = cloned.attr('id');
		cloned.removeUniqueId().uniqueId(); // Logs tiempo real
		cloned.insertAfter(current).removeData('id');
		cloned[0].dataset.id = '';

		current.find('button.profile.item').tooltipster({
			delay: 0,
			interactiveAutoClose: false,
			contentAsHTML: true
		});

		cloned.find('button.profile.item').tooltipster({
			delay: 0,
			interactiveAutoClose: false,
			contentAsHTML: true
		});

		cloned.trigger('afterClone'); // Logs tiempo real
		cloned.trigger('afterClone'); // Logs tiempo real
		if (!modoOffline) {
			updateSubtotalTitulos(element);
			updateSubtotalItems();
			$('section.sheet table.items > tfoot > tr > th.info').trigger('refresh');
		}

		cloned.find('.remove.item').visible();
		if (unaBase.doc.type === "NOTA DE VENTA") {
			cloned.find('.costo.real input').val(0);
		}

		//simon itemparent start
		if (current.hasClass('itemParent')) {
			cloned[0].dataset.itemparent = current.data('id');
			if (typeof cloned[0].dataset.itemparent !== 'undefined') {
				cloned.addClass('childItem');
				cloned.find('.parent.item').remove();
			}
		} else if (current.hasClass('childItem')) {
			let parentKey = current[0].dataset.itemparent;
			cloned[0].dataset.itemparent = parentKey

			if (typeof cloned[0].dataset.itemparent !== 'undefined') {
				cloned.addClass('childItem');
				cloned.find('.parent.item').remove();
			}

		}

		//simon itemparent end


		cloned.find('[name="item[][costo_unitario]"]').trigger('focus').trigger('blur');
		cloned.find('.detail.item').remove();
		cloned.find('span.ui-icon-arrow-4[title="Arrastrar para mover"]').hide();



		$('section.sheet table.items > tfoot > tr > th.info').trigger('refresh');

	};

	if ($('#main-container').data('clone-item-no-ask')) {
		cloneItem();
	} else {
		var htmlObject = $('<div>¿Confirmas que deseas duplicar el ítem?<br><br><label><input type="checkbox"> No volver a preguntar para esta cotización.</label></div>');
		htmlObject.find('input[type="checkbox"]').change(function (event) {
			if ($(event.target).is(':checked')) {
				$('#main-container').data('clone-item-no-ask', true);
			}
		});
		confirm(htmlObject).done(function (data) {
			if (data) {
				cloneItem();
			}
		});
	}
}

business.showTotals = true;

//REVISAR REAPER --- propuesta para agregar al nuevo modo reaper
business.currency = {
	askChange: (callback) => {
		return new Promise((resolve, reject) => {

			confirm('¿ Seguro desea modificar el valor tipo de cambio ? ').done(function (data) {
				if (data) {
					resolve(true);
				} else {
					resolve(false);
				}
			});
		})

	}
}

business.showSobrecargos = function (data) {

	console.log("---showSobrecargos---");

	if (!unaBase.doc.reaperMode) {
		if (unaBase.doc.modoCine) {
			console.warn("***********sobrecargo detalle_cinemagica");
			var index_utilidad_bruta = totales.utilities.fastArrayObjectSearch(data.rows, 'id', 1);
			var index_costos_fijos = totales.utilities.fastArrayObjectSearch(data.rows, 'id', 4);
			var index_comision_agencia = totales.utilities.fastArrayObjectSearch(data.rows, 'id', 6);
			try {
				blockCinemagica.find('[name="sobrecargo[1][porcentaje]"]').val(data.rows[index_utilidad_bruta].porcentaje);
				blockCinemagica.find('[name="sobrecargo[1][valor]"]').val(data.rows[index_utilidad_bruta].valor);

				blockCinemagica.find('[name="sobrecargo[4][porcentaje]"]').val(data.rows[index_costos_fijos].porcentaje);
				blockCinemagica.find('[name="sobrecargo[4][valor]"]').val(data.rows[index_costos_fijos].valor);

				blockCinemagica.find('[name="sobrecargo[6][porcentaje]"]').val(data.rows[index_comision_agencia].porcentaje);
				blockCinemagica.find('[name="sobrecargo[6][valor]"]').val(data.rows[index_comision_agencia].valor);

				blockCinemagica.find('[name="sobrecargo[1][subtotal]"]').val(valor_pelicula_guardado);
				blockCinemagica.find('[name="sobrecargo[1][subtotal]"]').data('old-value', valor_pelicula_guardado);

				blockCinemagica.find('[name="cotizacion[cinemagica][director][porcentaje]"]').val(director_porcentaje_guardado);


			} catch (err) {
				console.warn(err);
			}
		} else {

			//console.warn("*********************sobrecargo detalle");
			//REAPER toneg
			var target = $('section.sobrecargos >  ul.sc');

			var htmlObject;
			$.each(data.rows, function (key, item) {
				if (item.id == 1 && v3_sobrecargos_cinemagica) {
					var subtotal = '<strong style="font-weight: bold;">Val. película</strong>';
					var style = 'font-weight: bold; zoom: 1.1; margin-right: -7px;';
					var readonly = '';
				} else {
					var subtotal = 'Subtotal';
					var style = '';
					var readonly = 'readonly';
				}

				let scType = ""


				if (item.sobre_subtotal_venta) {
					scType = 'sc-subtotal'
				} else if (item.ajuste) {
					scType = 'sc-ajuste'
				} else if (item.total) {
					scType = 'sc-total'
				} else {
					if (item.id == 1) {
						scType = 'sc-subtotal'
					} else {
						scType = 'sc-subtotal_continuo'
					}

				}

				if (typeof selected_currency == 'undefined') {
					htmlObject = $(' \
						<li data-type-sc="old"  data-info="false" data-type="'+ scType + '"  data-formula="false" data-id="' + item.id + '"' + ((item.ajuste) ? ' data-ajuste="true"' : '') + ((item.items) ? ' data-items="true"' : '') + ((item.total) ? ' data-total="true"' : ((item.sobre_subtotal_venta) ? ' data-subtotal="true"' : '')) + ' data-nombre="' + item.nombre + '" data-toother="0"> \
							<span>' + item.nombre + ((item.items) ? ' <sup>(*)</sup>' : '') + ((item.total) ? ' <sup>(**)</sup>' : ((item.sobre_subtotal_venta) ? ' <sup>(***)</sup>' : '')) + '</span> \
							<span class="numeric percent"><input class="' + ((item.costo) ? 'costo' : 'utilidad') + '"' + ((scDirectInput) ? ' readonly' : '') + ' required   type="text" name="sobrecargo[' + item.id + '][porcentaje]" value="' + item.porcentaje + '"> %</span> \
							<span class="numeric currency">' + localCurrency + ' <input class="' + ((item.costo) ? 'costo' : 'utilidad') + '"' + ((!scDirectInput) ? ' readonly' : ((item.ajuste) ? ' readonly' : '')) + ' type="text" name="sobrecargo[' + item.id + '][valor]" value="' + ((item.id == 5 && !item.costo && item.total) ? parseFloat(item.valor) : (item.porcentaje * parseFloat(((item.items) ? $('[name="cotizacion[precios][subtotal]"]').data('aplica-sobrecargo') : $('[name="cotizacion[precios][subtotal]"]').val())) / 100)).toFixed(currency.decimals) + '"></span> \
							<span style="width: 70px; display: inline-block;">' + subtotal + '</span> \
							<span class="numeric currency">' + localCurrency + ' <input style="' + style + '" ' + readonly + ' type="text" name="sobrecargo[' + item.id + '][subtotal]" value="0"></span> \
							<span class="option"><label title="Oculta el valor del sobrecargo en la vista de impresión, repartiéndolo entre los ítems afectos."><input type="checkbox" name="sobrecargo[' + item.id + '][cerrado]" value="true"' + ((item.cerrado.enabled) ? ' checked' : '') + ((!item.cerrado.writable) ? ' disabled' : '') + '> Cerrado</label></span> \
							<span style=""><label title="Permite que el sobrecargo sea considerado automáticamente como ' + ((item.costo) ? 'gasto' : 'utilidad') + ' real, sin la necesidad de generar orden de compra."><input readonly type="checkbox" name="sobrecargo[' + item.id + '][real]" value="true"' + ((typeof item.real != 'undefined') ? ((item.real) ? ' checked' : '') : '') + '> ' + ((item.costo) ? 'Gasto' : 'Utilid.') + ' R.</label></span> \
						</li> \
					');
				} else {
					htmlObject = $(' \
						<li  data-type-sc="old" data-info="false" data-type="'+ scType + '" data-formula="false" data-id="' + item.id + '"' + ((item.ajuste) ? ' data-ajuste="true"' : '') + ((item.items) ? ' data-items="true"' : '') + ((item.total) ? ' data-total="true"' : ((item.sobre_subtotal_venta) ? ' data-subtotal="true"' : '')) + ' data-nombre="' + item.nombre + '"  data-toother="0"> \
							<span>' + item.nombre + ((item.items) ? ' <sup>(*)</sup>' : '') + ((item.total) ? ' <sup>(**)</sup>' : ((item.sobre_subtotal_venta) ? ' <sup>(***)</sup>' : '')) + '</span> \
							<span class="numeric percent"><input class="' + ((item.costo) ? 'costo' : 'utilidad') + '"' + ((scDirectInput) ? ' readonly' : '') + ' required  type="text" name="sobrecargo[' + item.id + '][porcentaje]" value="' + item.porcentaje + '"> %</span> \
							<span class="numeric currency">' + localCurrency + ' <input class="' + ((item.costo) ? 'costo' : 'utilidad') + '"' + ((!scDirectInput) ? ' readonly' : ((item.ajuste) ? ' readonly' : '')) + ' type="text" name="sobrecargo[' + item.id + '][valor]" value="' + (((item.id == 5 && !item.costo && item.total) ? parseFloat(item.valor) : (item.porcentaje * parseFloat(((item.items) ? $('[name="cotizacion[precios][subtotal]"]').data('aplica-sobrecargo') : $('[name="cotizacion[precios][subtotal]"]').val())) / 100.00)) / exchange_rate).toFixed(2) + '"></span> \
							<span style="width: 70px; display: inline-block;">' + subtotal + '</span> \
							<span class="numeric currency">' + localCurrency + ' <input style="' + style + '" ' + readonly + ' type="text" name="sobrecargo[' + item.id + '][subtotal]" value="0"></span> \
							<span class="option"><label title="Oculta el valor del sobrecargo en la vista de impresión, repartiéndolo entre los ítems afectos."><input type="checkbox" name="sobrecargo[' + item.id + '][cerrado]" value="true"' + ((item.cerrado.enabled) ? ' checked' : '') + ((!item.cerrado.writable) ? ' disabled' : '') + '> Cerrado</label></span> \
							<span style=""><label title="Permite que el sobrecargo sea considerado automáticamente como ' + ((item.costo) ? 'gasto' : 'utilidad') + ' real, sin la necesidad de generar orden de compra."><input readonly type="checkbox" name="sobrecargo[' + item.id + '][real]" value="true"' + ((typeof item.real != 'undefined') ? ((item.real) ? ' checked' : '') : '') + '> ' + ((item.costo) ? 'Gasto' : 'Utilid.') + ' R.</label></span> \
						</li> \
					');
				}

				//SOLO PARA NEGOCIO

				htmlObject.find('input[name="sobrecargo[' + item.id + '][real]"]').change(function (event) {

					let utilidad_real_ratio = 0;
					let costo_real_ratio = 0;
					let costo_sobrecargo = 0;
					let costo_ratio = (parseFloat($('input[name="cotizacion[costos][subtotal]"]').val()) > 0) ? parseFloat($('input[name="cotizacion[costos_real][subtotal]"]').val()) / parseFloat($('input[name="cotizacion[costos][subtotal]"]').val()) : 0;
					let subtotal_gr = unaBase.utilities.transformNumber($('input[name="cotizacion[costos_real][subtotal]"]').val())
					let total_neto = parseFloat($('span[name="cotizacion[montos][subtotal_neto]"]').first().text().replace(/\./g, '').replace(/,/g, '.'));
					//var costo_sobrecargo = parseFloat(parseFloat($(event.target).parentTo('li').find('input[name="sobrecargo[' + item.id + '][valor]"]').val()) * costo_ratio);
					if ($(event.target).prop('checked'))
						costo_sobrecargo = parseFloat(parseFloat($(event.target).parentTo('li').find('input[name="sobrecargo[' + item.id + '][valor]"]').val()));
					//var costo_real_total = parseFloat($('span[name="cotizacion[montos][costo_real]"]').first().text().replace(/\./g, '').replace(/,/g, '.'));
					let costo_real_total = subtotal_gr + costo_sobrecargo
					let utilidad_real_total = total_neto - costo_real_total


					$('span[name="cotizacion[montos][costo_real]"]').text(unaBase.utilities.transformNumber((costo_real_total).toFixed(currency.decimals), 'int'));
					$('span[name="cotizacion[montos][utilidad_real]"]').text(unaBase.utilities.transformNumber((utilidad_real_total).toFixed(currency.decimals), 'int'));


					//$('span[name="cotizacion[montos][costo_real_ratio]"]').text((costo_real_total / total_neto).toFixed(2)).number(true, 2, ',', '.');
					//$('span[name="cotizacion[montos][utilidad_real_ratio]"]').text(((total_neto - costo_real_total) / total_neto).toFixed(2)).number(true, 2, ',', '.');

					if (margenCompraResumenes) {
						if (margen_desde_compra_inverso) {
							utilidad_real_ratio = (1 - utilidad_real_total / total_neto) * 100;
							costo_real_ratio = (1 - costo_real_total / total_neto) * 100;
						} else {
							utilidad_real_ratio = utilidad_real_total / costo_real_total * 100;
							costo_real_ratio = 100 - utilidad_real_ratio;
						}
					} else {

						utilidad_real_ratio = (utilidad_real_total * 100) / total_neto
						costo_real_ratio = (costo_real_total * 100) / total_neto
					}
					if (!isFinite(utilidad_real_ratio)) utilidad_real_ratio = 0;
					if (!isFinite(costo_real_ratio)) costo_real_ratio = 0;
					$('span[name="cotizacion[montos][costo_real_ratio]"]').text(unaBase.utilities.transformNumber((costo_real_ratio).toFixed(currency.decimals), 'int'));
					$('span[name="cotizacion[montos][utilidad_real_ratio]"]').text(unaBase.utilities.transformNumber((utilidad_real_ratio).toFixed(currency.decimals), 'int'));

					$('li[data-name="save"] > button').triggerHandler('click');
				});


				//END SOLO PARA NEGOCIO


				if (typeof selected_currency == 'undefined')
					htmlObject.find('.numeric.currency input').number(true, currency.decimals, ',', '.');
				else
					htmlObject.find('.numeric.currency input').number(true, 2, ',', '.');
				htmlObject.find('.numeric.percent input').number(true, 2, ',', '.');

				htmlObject.find('.numeric.percent input').bind('focus', function () {
					if (typeof $(this).data('value') == 'undefined')
						$(this).data('value', $(this).val());
					$(this).unbind('.format').number(true, 6, ',', '.').val($(this).data('value'));
				});

				htmlObject.find('.numeric.percent input').bind('focusout', function (event) {
					$(this).data('value', $(this).val()).unbind('.format').number(true, 2, ',', '.');
				});

				if (typeof item.valor != 'undefined') {
					if (typeof selected_currency == 'undefined')
						htmlObject.find('.numeric.currency input').val(item.valor.toFixed(currency.decimals));
					else
						htmlObject.find('.numeric.currency input').val((item.valor / exchange_rate).toFixed(2));
				}

				htmlObject.find('.numeric.percent input').val(item.porcentaje);
				htmlObject.find('.numeric.percent input').data('value', item.porcentaje);

				if (item.ajuste)
					htmlObject.css('opacity', 0.5).find('.percent').invisible();
				if (scDirectInput)
					htmlObject.find('.percent').invisible();

				target.append(htmlObject);

				arrSobregargosPreFinal.push(
					{ sobrecargo: item.nombre, porcentaje: item.porcentaje, monto_aplicable: 0 }
				);

			});
		}
	}


};
business.item.docs = [];
business.item.set = items => {
	business.item.docs = items.rows;
}
business.staff = {
	checkShowTotals: () => {
		//business.staff.checkShowTotals()

		// verifica permiso para ver todas las cotizaciones o ver todos los negocios dependiendo del caso.
		let viewAllDocs = unaBase.doc.type === "COTIZACION" ? access._476 : access._445;
		let itemsShowed = business.item.docs.filter(item => !item.hidden);
		let itemsHidden = business.item.docs.filter(item => item.hidden);
		if (!viewAllDocs && (itemsShowed.length < business.item.docs.length) && unaBase.doc.isCurrentUserStaff) {
			let titles = document.querySelectorAll('table.items tbody tr.title, table.items tbody tr.itemParent');
			// let parents = document.querySelectorAll('table.items.cotizacion tbody tr.itemParent');
			titles.forEach(title => {
				// title.querySelector(`input[name="item[][subtotal_precio]"]`).remove();
				// title.querySelector(`input[name="item[][subtotal_costo]"]`).remove();
				// title.querySelector(`input[name="item[][utilidad]"]`).remove();
				title.querySelectorAll('th.numeric').forEach(element => {
					while (element.hasChildNodes()) {
						element.removeChild(element.firstElementChild)
						element.textContent = ""
					}
				});

			});
		}
	}
}

business.checkDifference = id => {
	return new Promise((resolve, reject) => {
		fetch('/4DACTION/_V3_CheckTotalDifferenceNv?id=' + id)
			.then(res => res.json())
			.then(data => {
				unaBase.doc.hasDifference = data.hasDifference;
				console.warn("from negocios.checkDifference");
				console.warn(data);
				resolve(data);
			}).catch(err => {
				reject(err);
			});
	});

}

business.getSobrecargoData = (sobrecargosPlantilla) => {

	let urlSobrecargo = '/4DACTION/_V3_getSobrecargoByCotizacion'; // desde cotización o parametros

	$.ajax({
		url: urlSobrecargo,
		dataType: 'json',
		async: false,
		cache: false,
		data: {
			id: $('section.sheet').data('id')
		},
		success: business.showSobrecargos
	});
}

business.exchangeRateChange = async () => {

	var moduloActivo = $('ul > li.active').data("name") == 'negocios' ? 'negocios' : 'cotizaciones'
	let id = unaBase.doc.id
	let origin = event.target.classList.contains('working_currency') || event.target.classList.contains('working-view') ? 'working_currency' : ''
	let currency = typeof event.target.options != 'undefined' ? event.target.options[event.target.selectedIndex].value : unaBase.doc.currencyCode
	let target = event.target
	let valueExchangeRate = 1
	if (origin == "working_view")
		valueExchangeRate = $('input[name="cotizacion[tipo_cambio]"]').val().toString().replace(/\./g, ',')

	if (selected_currency != currency || origin == 'working_currency') {

		unblockCot();


		const changeCurrency = await business.currency.askChange()

		if (changeCurrency) {


			unblockCot();
			var callback = function () {


				(function () {

					if (selected_currency == "CLF" || selected_currency == "UF") {
						var data = {
							tipo_cambio_clf_express: valueExchangeRate

						};
					} else {
						var data = {};

					}

					if (origin == 'working_currency') {

						data['first_time'] = true;
						data['moneda_trabajo'] = currency;
					}

					var ajaxData = params.data();
					$.extend(data, data, ajaxData);


					$.ajax({
						url: '/4DACTION/_V3_setCotizacion',
						data: data,
						async: false,
						dataType: 'json',
						success: function (data) {
							unaBase.loadInto.viewport(`/v3/views/${moduloActivo}/content.shtml?id=${id}&changed_working_currency=true`, undefined, undefined, true);
						}
					});
					return true;

				})();
			};

			updateIndexes(callback);


		} else {
			let ops = []
			for (let index = 0; index <= target.options.length; index++) {
				ops.push(target.options[index]);
			}
			target.selectedIndex = ops.findIndex(i => i.value == unaBase.doc.currencyCode)
		}


	} else {
		var callback = function () {

			(function () {
				var data = {
					id,
					'cotizacion[tipo_cambio]': valueExchangeRate,
					preview: true
				};

				// var ajaxData = params.data();
				// $.extend(data, data, ajaxData);

				$.ajax({
					url: '/4DACTION/_V3_setCotizacion',
					data: data,
					async: false,
					dataType: 'json',
					success: function (data) {
						console.log('valor tipo cambio actualizado!')
						toastr.success('valor tipo cambio actualizado!')
					}
				});
				return true;
			})();
		}

		callback();
	}

}


business.exchangeRate = {
	init: () => {

		business.exchangeRate.initPrintSection()
	},
	initPrintSection: () => {

		$.ajax({
			url: '/4DACTION/_V3_getCurrency',
			async: false,
			dataType: 'json',
			success: function (data) {

				let sec_exchange = document.querySelector('select[name="cotizacion[moneda]"]')
				let sec_exchange_val = document.querySelector('input[name="cotizacion[moneda_impresion]"]')


				if (unaBase.defaulCurrencyCode == unaBase.doc.currencyCodePrint)
					sec_exchange_val.value = unaBase.utilities.transformNumber(exchange_rate, 'int')
				else
					sec_exchange_val.value = unaBase.utilities.transformNumber(exchange_rate_print, 'view')

				sec_exchange.innerHTML = ""
				data.rows.map(e => {

					let node = document.createElement("option");
					node.value = e.id
					node.dataset.rate = e.value == "0" ? "1" : e.value
					node.textContent = e.text
					sec_exchange.appendChild(node);
					node.selected = unaBase.doc.currencyCodePrint == e.id ? true : false


				});

				sec_exchange.addEventListener("change", () => business.exchangeRate.changePrintExchange());


			}
		});


	},
	changePrintExchange: () => {

		let selectOpts = event.target.options;
		let sl = selectOpts[selectOpts.selectedIndex]
		document.querySelector('input[name="cotizacion[moneda_impresion]"]').value = unaBase.doc.currencyCode == sl.value ? unaBase.utilities.transformNumber(exchange_rate, 'int') : unaBase.utilities.transformNumber(sl.dataset.rate, 'view')
	}
}

unaBase.ready(() => {
	calculo_UR_con_subtotal = unaBase.serverInfo.calculo_UR_con_subtotal
});

var updatePrecioCotizado = function (event) {
	// Impuesto extranjero 0%
	
	//if ($(this).parentTo('tr').data('tipo-documento') && $(this).parentTo('tr').data('tipo-documento-ratio')) {
	let tipo = event.currentTarget.attributes.name.value == "item[][costo_unitario]" ? '-compras' : ''

	if ($(this).parentTo('tr').data(`tipo-documento${tipo}`) && ($(this).parentTo('tr').data(`tipo-documento${tipo}-ratio`) || (!$(this).parentTo('tr').data(`tipo-documento${tipo}-ratio`) && $(this).parentTo('tr').data(`tipo-documento${tipo}-valor-usd`)))) {

		

		if ($(this).parentTo('tr').data(`tipo-documento${tipo}-ratio`) > 0 || $(this).parentTo('tr').data(`tipo-documento${tipo}-valor-usd`)){

			if (typeof selected_currency == 'undefined') {
				// Corrección cuando se ocultan decimales
				//var valor_negociado = parseFloat($(this).val());
				if ($(this).data('old-value'))
					var valor_negociado = parseFloat($(this).data('old-value'));
				else
					var valor_negociado = parseFloat($(this).val());
			} else {
				// Corrección cuando se ocultan decimales
				//var valor_negociado = parseFloat($(this).val());
				if ($(this).data('old-value'))
					var valor_negociado = parseFloat($(this).data('old-value'));
				else
					var valor_negociado = parseFloat($(this).val());
			}

			var impuesto = $(this).parentTo('tr').data(`tipo-documento${tipo}-ratio`);
			var valor_usd = $(this).parentTo('tr').data(`tipo-documento${tipo}-valor-usd`); // Impuesto extranjero
			var division = $(this).parentTo('tr').data(`tipo-documento${tipo}-inverse`);
			let valor_moneda_ex = $(this).parentTo('tr').data(`tipo-documento${tipo}-valor-moneda`)// Impuesto extranjero

			var base_imponible = 0;

			$(this).addClass('edited');
			$(this).parentTo('tr').find('button.detail.price').visible();

			if (typeof selected_currency == 'undefined') {
				if (division) {
					// Impuesto extranjero
					if (valor_usd)
						base_imponible = (valor_negociado / (1.00 - impuesto)) * valor_moneda_ex;
					else
						base_imponible = valor_negociado / (1.00 - impuesto);
				} else
					base_imponible = valor_negociado * (1.00 + impuesto);
			} else {
				if (division) {
					// Impuesto extranjero
					if (valor_usd)
						base_imponible = (valor_negociado / (1.00 - impuesto)) * valor_moneda_ex;
					else
						base_imponible = valor_negociado / (1.00 - impuesto);
				} else
					base_imponible = valor_negociado * (1.00 + impuesto);
			}

			$(this).val(base_imponible);
			// Corrección cuando se ocultan decimales
			$(this).data('old-value', base_imponible);

			//$(this).parentTo('tr').data(`base-imponible${tipo}`, base_imponible);

			if ($(this).hasClass('special')) {
				var hora_extra_cantidad = parseFloat($(this).parentTo('tr').find('input[name="item[][horas_extras]"]').val());
				$(this).parentTo('tr').find('input[name="item[][horas_extras]"]').trigger('change');

				var hora_extra_valor = $(this).parentTo('tr').data('hora-extra-valor');
				$(this).val(base_imponible + (hora_extra_valor * hora_extra_cantidad));
				// Corrección cuando se ocultan decimales
				$(this).data('old-value', base_imponible + (hora_extra_valor * hora_extra_cantidad));
			}
		} else {
			if (tipo == "") {

				let bi = $(this).parentTo('tr').data('base-imponible')

				$(this).val(bi);
				$(this).data('old-value', bi);
			} else {
				let bi = $(this).parentTo('tr').data('baseImponibleCompras')
				if (bi == 0) {
					$(this).parentTo('tr').data('baseImponibleCompras', $(this).val())
					bi = $(this).val()

				}
				$(this).val(bi);
				$(this).data('old-value', bi);
			}

		}



	}


	if (typeof $(event.target).data('undo') == 'undefined')
		$(event.target).data('undo', true);

	let target = {
		target: $(this).parentTo('tr')[0].querySelector('[name="item[][cantidad]"]')
	}

	updateRow(target)
	updateRow(target)


	if (tipo == "")
		if ($(this).parentTo('tr').find('[name="item[][costo_unitario]"]').data('auto')) {
			//$(this).parentTo('tr').find('[name="item[][costo_unitario]"]').val(($(this).data('old-value')) ? $(this).data('old-value') : $(this).val()).trigger('blur');
			$(this).parentTo('tr').data('base-imponible-compras', $(this).parentTo('tr').data('base-imponible'))
			$(this).parentTo('tr').find('[name="item[][costo_unitario]"]').val(($(this).data('old-value')) ? $(this).data('old-value') : $(this).val()).trigger('update');
			
		}

};

var updatePrecioNegociado = function (event) {
	// Impuesto extranjero 0%
	
	if (event.currentTarget.readOnly == false) {

		let tipo = event.currentTarget.attributes.name.value == "item[][costo_unitario]" || event.currentTarget.attributes.name.value == "item[][subtotal_costo]" ? '-compras' : ''

		if ($(this).parentTo('tr').data(`tipo-documento${tipo}`) && ($(this).parentTo('tr').data(`tipo-documento${tipo}-ratio`) || (!$(this).parentTo('tr').data(`tipo-documento${tipo}-ratio`) && $(this).parentTo('tr').data(`tipo-documento${tipo}-valor-usd`)))) {

			if ($(this).hasClass('special')) {
				// Corrección ocultar decimales
				//var valor_a_cotizar = parseFloat($(this).val());
				if ($(this).data('old-value'))
					var valor_a_cotizar = parseFloat($(this).data('old-value'));
				else
					var valor_a_cotizar = parseFloat($(this).val());
				var hora_extra_cantidad = parseFloat($(this).parentTo('tr').find('input[name="item[][horas_extras]"]').val());

				if (typeof $(this).parentTo('tr').data('hora-extra-valor') == 'undefined')
					$(this).parentTo('tr').find('input[name="item[][horas_extras]"]').trigger('change');

				var hora_extra_valor = $(this).parentTo('tr').data('hora-extra-valor');

				$(this).val(valor_a_cotizar - Math.round(hora_extra_valor * hora_extra_cantidad));
				// Corrección ocultar decimales
				$(this).data('old-value', valor_a_cotizar - (hora_extra_valor * hora_extra_cantidad));
			}

			// Corrección ocultar decimales
			//var valor_a_cotizar = parseFloat($(this).val());
			// if ($(this).data('old-value'))
			// 	var valor_a_cotizar = parseFloat($(this).data('old-value'));
			// else
			var valor_a_cotizar = parseFloat($(this).val());

			var impuesto = $(this).parentTo('tr').data(`tipo-documento${tipo}-ratio`);
			var valor_usd = $(this).parentTo('tr').data(`tipo-documento${tipo}-valor-usd`); // Impuesto extranjero
			var multiplicacion = $(this).parentTo('tr').data(`tipo-documento${tipo}-inverse`);
			let valor_moneda_ex = $(this).parentTo('tr').data(`tipo-documento${tipo}-valor-moneda`)// Impuesto extranjero

			var valor_cotizado = 0;

			$(this).removeClass('edited');
			$(this).parentTo('tr').find('button.detail.price').invisible();

			if (multiplicacion) {
				// Impuesto extranjero
				if (valor_usd)
					valor_cotizado = (valor_a_cotizar * (1 - impuesto)) / valor_moneda_ex;
				else
					valor_cotizado = valor_a_cotizar * (1 - impuesto);
			} else
				valor_cotizado = valor_a_cotizar / (1 + impuesto);

			$(this).val(valor_cotizado);
			// Corrección ocultar decimales

			$(this).data('old-value', valor_cotizado);
		}
	}

	unaBase.ui.unblock();

};