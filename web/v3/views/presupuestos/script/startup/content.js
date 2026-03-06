$(document).ready(function() {

	// FIXME: Solución quick&dirty para poder mostrar correctamente los valores con decimales
	// se usa input en vez de span, y se cambia la apariencia del input en línea
	/*
	$('section.sheet').delegate('.numeric.currency span[name]', 'change', function() {
		$(this).number(true, 0, ',', '.');
	});
	$('section.sheet').delegate('.numeric.percent span[name]', 'change', function() {
		$(this).number(true, 2, ',', '.');
	});
	*/

	$('section.sheet').find('tfoot .numeric.currency input').number(true, currency.decimals, ',', '.');
	$('section.sheet').find('tfoot .numeric.percent input').number(true, 2, ',', '.');
	$('section.sheet').find('footer .numeric.currency input').number(true, currency.decimals, ',', '.');
	$('section.sheet').find('footer .numeric.percent input:not([name="cotizacion[descuento][porcentaje]"])').number(true, 2, ',', '.');


	$('section.sheet table > thead button.toggle.all').click(function() {
		unaBase.ui.block();
		if ($(this).hasClass('ui-icon-folder-open')) {
			$(this).removeClass('ui-icon-folder-open');
			$(this).addClass('ui-icon-folder-collapsed');
			$(this).attr('title', 'Contraer todo');
			$('section.sheet table > tbody > tr.title button.toggle.categoria.ui-icon-folder-open').each(function() {
				$(this).triggerHandler('click');
			});
		} else {
			$(this).removeClass('ui-icon-folder-collapsed');
			$(this).addClass('ui-icon-folder-open');
			$(this).attr('title', 'Expandir todo');
			$('section.sheet table > tbody > tr.title button.toggle.categoria.ui-icon-folder-collapsed').each(function() {
				$(this).triggerHandler('click');
			});
		}
		unaBase.ui.unblock();
	});


	// Detalle ítem negocio

	$('section.sheet table > tbody').on('click', 'button.detail.item', function(event) {
		unaBase.loadInto.dialog('/v3/views/items/content.shtml?id=' + $(this).parentTo('tr').data('id'), 'Detalle de Ítem', 'x-large');
		//unaBase.loadInto.dialog('/v3/views/cotizaciones/pop_detalle_items.shtml?id=' + $(this).parentTo('tr').data('id'), 'Detalle de Ítem', 'medium');
	});

	$('section.sheet table > tbody').on('click', 'button.profile.item', function() {
		alert('perfil ítem en construcción');
	});

	getDetail(function() {
		updateSubtotalItems();
	});


	var htmlObject;

	htmlObject = $('\
		<ul class="dropdown-menu" style="position: absolute; top: 25px; right: 0; z-index: 1000; min-width: 150px; text-align: left;">	\
			<li><a href="#" class="select-all items"><span class="ui-icon ui-icon-radio-on"></span>Seleccionar todo</a></li>			\
			<li><a href="#" class="deselect-all items"><span class="ui-icon ui-icon-radio-off"></span>Deseleccionar todo</a></li>		\
			<li><a href="#" class="close-compras items"><span class="ui-icon ui-icon-locked"></span>Cerrar compras</a></li>				\
			<li><a href="#" class="open-compras items"><span class="ui-icon ui-icon-unlocked"></span>Reabrir compras</a></li>			\
			<!--<li><a href="#" class="view-oc items"><span class="ui-icon ui-icon-document-b"></span>Item / Vista oc</a></li>			\
			<li><a href="#" class="view-ot items"><span class="ui-icon ui-icon-document-b"></span>Item / Vista ot</a></li>				\
			<li><a href="#" class="view-oc-ot items"><span class="ui-icon ui-icon-document-b"></span>Item / Vista (oc+ot)</a></li>		\
																																		\
			<li><a href="#" class="create-oc items"><span class="ui-icon ui-icon-document"></span>Crear orden de compra</a></li>		\
			<li><a href="#" class="create-fxr items"><span class="ui-icon ui-icon-document"></span>Crear fondo por rendir</a></li>		\
			-->																															\
		</ul>																															\
	');

	if (!access._490)
		htmlObject.find('.close-compras').parentTo('li').remove();
	if (!access._491)
		htmlObject.find('.open-compras').parentTo('li').remove();

	htmlObject.appendTo('table.items > thead > tr:last-of-type > th:last-of-type').menu().hide();

	$('button.actions.items').button({
		icons: {
			primary: 'ui-icon-triangle-1-s',
			secondary: 'ui-icon-gear'
		}
	}).click(function() {
		$('table.items > thead > tr:last-of-type > th:last-of-type > .dropdown-menu').toggle();
	});


	$('table.items > thead > tr:last-of-type > th:last-of-type a.items').click(function(event) {
		var target = $(event.target);

		$('table.items > thead > tr:last-of-type > th:last-of-type > .dropdown-menu').toggle();
		
		var selected = $('table.items tbody').find('tr:not(.title)').has('input[type="checkbox"][name="item[][selected]"]:checked');
		var selectable = $('table.items tbody').find('tr:not(.title)').has('input[type="checkbox"][name="item[][selected]"]');

		if (target.hasClass('select-all') || target.hasClass('deselect-all')) {
			if (target.hasClass('select-all'))
				$('table.items tbody').find('tr input[type="checkbox"][name="item[][selected]"]').prop('checked', true);
			if (target.hasClass('deselect-all'))
				$('table.items tbody').find('tr input[type="checkbox"][name="item[][selected]"]').prop('checked', false);
		} else {

			/*if (target.hasClass('view-oc') || target.hasClass('view-ot') || target.hasClass('view-oc-ot')) {
				if (target.hasClass('view-oc')) {
					
				}
				if (target.hasClass('view-ot')) {
					
				}
				if (target.hasClass('view-oc-ot')) {
					
				}
			}else{*/

				if (selected.length == 0) {
					//toastr.warning('Para realizar esta acción, debe seleccionar uno o más ítems de la lista.');
					confirm(MSG.get('CONFIRM_NEGOCIO_CLOSE_COMPRAS_ALL')).done(function(data) {
						if (data)
							$('#menu > ul > li[data-name="close_compras_negocio"] > button').triggerHandler('click');
					});
				} else {

					var closeItemsCompras = function() {
						selected.each(function() {
							var element = this;
							$.ajax({
								url: '/4DACTION/_V3_setItemByNegocio',
								data: {
									id: $(element).data('id'),
									close_compras: true
								},
								dataType: 'json',
								success: function(data) {
									if (data.success) {
										$(element).find('[name="item[][closed_compras]"]').show();

										//toastr.info('Ítem cerrado para compras.');
										unaBase.log.save('El ítem ha sido cerrado para compras' + ( ($(element).find('[name="item[][codigo]"]').val() != '')? ' [Cód.: ' + $(element).find('[name="item[][codigo]"]').val() + ']' : ''), 'negocios', $('section.sheet').data('index'), $('section.sheet').data('id'), $(element).find('[name="item[][nombre]"]').val());
									}
								}
							});
						});
						toastr.info('Ítems seleccionados cerrados para compras.');
					};

					if (target.hasClass('close-compras')) {
						if (selected.length == selectable.length)
							confirm(MSG.get('CONFIRM_NEGOCIO_CLOSE_COMPRAS_AUTO')).done(function(data) {
								if (data)
									$('#menu > ul > li[data-name="close_compras_negocio"] > button').triggerHandler('click');
								closeItemsCompras();
								$('table.items tbody').find('tr input[type="checkbox"][name="item[][selected]"]').prop('checked', false);
							});
						else {
							closeItemsCompras();
							$('table.items tbody').find('tr input[type="checkbox"][name="item[][selected]"]').prop('checked', false);
						}
					}
					if (target.hasClass('open-compras')) {
						selected.each(function() {
							var element = this;
							$.ajax({
								url: '/4DACTION/_V3_setItemByNegocio',
								data: {
									id: $(element).data('id'),
									close_compras: false
								},
								dataType: 'json',
								success: function(data) {
									if (data.success) {
										$(element).find('[name="item[][closed_compras]"]').hide();

										//toastr.info('Ítem abierto para compras.');
										unaBase.log.save('El ítem ha sido abierto para compras' + ( ($(element).find('[name="item[][codigo]"]').val() != '')? ' [Cód.: ' + $(element).find('[name="item[][codigo]"]').val() + ']' : ''), 'negocios', $('section.sheet').data('index'), $('section.sheet').data('id'), $(element).find('[name="item[][nombre]"]').val());
									}
								}
							});
						});
						$('table.items tbody').find('tr input[type="checkbox"][name="item[][selected]"]').prop('checked', false);
						toastr.info('Ítems seleccionados abiertos para compras.');
					}
					if (target.hasClass('create-oc')) {
						alert('Falta', false);
						$('table.items tbody').find('tr input[type="checkbox"][name="item[][selected]"]').prop('checked', false);
					} if (target.hasClass('create-fxr')) {
						alert('Falta', false);
						$('table.items tbody').find('tr input[type="checkbox"][name="item[][selected]"]').prop('checked', false);
					}
				}
			//}
		}
		event.preventDefault();
	});

	var showSobrecargos = function(data) {
		var target = $('section.sobrecargos > ul');
		var htmlObject;
		$.each(data.rows, function(key, item) {
			htmlObject = $(' \
				<li data-id="' + item.id + '"' + ((item.ajuste)? ' data-ajuste="true"': '') + ((item.items)? ' data-items="true"': '') + ((item.total)? ' data-total="true"': ( (item.sobre_subtotal_venta)? ' data-subtotal="true"' : ''  )) + '> \
					<span>' + item.nombre + ((item.items)? ' <sup>(*)</sup>' : '') + ((item.total)? ' <sup>(**)</sup>' :  ( (item.sobre_subtotal_venta)? ' <sup>(***)</sup>' : '' )  ) + '</span> \
					<span class="numeric percent"><input class="' + ((item.costo)? 'costo': 'utilidad') + '" readonly type="text" name="sobrecargo[' + item.id + '][porcentaje]" value="' + item.porcentaje + '"> %</span> \
					<span class="numeric currency">' + currency.symbol + ' <input class="' + ((item.costo)? 'costo': 'utilidad') + '" readonly type="text" name="sobrecargo[' + item.id + '][valor]" value="' + ((item.id == 5 && !item.costo && item.cerrado.enabled && item.total)? parseFloat(item.valor) : (item.porcentaje * parseFloat(((item.items)? $('[name="cotizacion[precios][subtotal]"]').data('aplica-sobrecargo') : $('[name="cotizacion[precios][subtotal]"]').val())) / 100)).toFixed(currency.decimals) + '"></span> \
					<span>Subtotal</span> \
					<span class="numeric currency">' + currency.symbol + ' <input readonly type="text" name="sobrecargo[' + item.id + '][subtotal]" value="0"></span> \
					<span class="option"><label title="Oculta el valor del sobrecargo en la vista de impresión, repartiéndolo entre los ítems afectos."><input type="checkbox" name="sobrecargo[' + item.id + '][cerrado]" value="true"' + ((item.cerrado.enabled)? ' checked': '') + ((!item.cerrado.writable)? ' disabled': '') + '> Cerrado</label></span> \
					<span class="option visible"' + ((!item.costo || typeof item.real == 'undefined')? ' style="display: none;"' : '') + '><label title="Permite que el sobrecargo sea considerado automáticamente como gasto real, sin la necesidad de generar orden de compra."><input type="checkbox" name="sobrecargo[' + item.id + '][real]" value="true"' + ((item.real)? ' checked': '') + (($('#main-container').data('closed'))? ' disabled': '') +  '> Gasto R.</label></span> \
				</li> \
			');

			htmlObject.find('input[name="sobrecargo[' + item.id + '][real]"]').change(function(event) {
				var costo_ratio = (parseFloat($('input[name="cotizacion[costos][subtotal]"]').val()) > 0)? parseFloat($('input[name="cotizacion[costos_real][subtotal]"]').val()) / parseFloat($('input[name="cotizacion[costos][subtotal]"]').val()) : 0;
				var total_neto = parseFloat($('span[name="cotizacion[montos][subtotal_neto]"]').first().text().replace(/\./g, '').replace(/,/g, '.'));
				var costo_sobrecargo = parseFloat(parseFloat($(event.target).parentTo('li').find('input[name="sobrecargo[' + item.id + '][valor]"]').val()) * costo_ratio);
				var costo_real_total = parseFloat($('span[name="cotizacion[montos][costo_real]"]').first().text().replace(/\./g, '').replace(/,/g, '.'));
				// asdf
				if ($(event.target).prop('checked'))
					$('span[name="cotizacion[montos][costo_real]"]').text(costo_real_total + costo_sobrecargo).number(true, currency.decimals, ',', '.');
				else
					$('span[name="cotizacion[montos][costo_real]"]').text(costo_real_total - costo_sobrecargo).number(true, currency.decimals, ',', '.');

				costo_real_total = parseFloat($('span[name="cotizacion[montos][costo_real]"]').text().replace(/\./g, '').replace(/,/g, '.'));

				$('span[name="cotizacion[montos][utilidad_real]"]').text(total_neto - costo_real_total).number(true, currency.decimals, ',', '.');
				$('span[name="cotizacion[montos][costo_real_ratio]"]').text((costo_real_total / total_neto).toFixed(2)).number(true, 2, ',', '.');
				$('span[name="cotizacion[montos][utilidad_real_ratio]"]').text(((total_neto - costo_real_total) / total_neto).toFixed(2)).number(true, 2, ',', '.');

				$('li[data-name="save"] > button').triggerHandler('click');
			});

			htmlObject.find('input[name="sobrecargo[' + item.id + '][cerrado]"]').change(function(event) {
				$('li[data-name="save"] > button').triggerHandler('click');
			});


			htmlObject.find('.numeric.currency input').number(true, currency.decimals, ',', '.');
			htmlObject.find('.numeric.percent input').number(true, 2, ',', '.');

			/*htmlObject.find('.numeric.percent input').bind('focus', function() {
				if (typeof $(this).data('value') == 'undefined')
					$(this).data('value', $(this).val());
				$(this).unbind('.format').number(true, 6, ',', '.').val($(this).data('value'));
			});

			htmlObject.find('.numeric.percent input').bind('focusout', function(event) {
				$(this).data('value', $(this).val()).unbind('.format').number(true, 2, ',', '.');
			});*/

			if (typeof item.valor != 'undefined')
				htmlObject.find('.numeric.currency input').val(item.valor.toFixed(currency.decimals));
			//htmlObject.find('.numeric.percent input').val((item.porcentaje / 100.00));
			htmlObject.find('.numeric.percent input').val(item.porcentaje);
			htmlObject.find('.numeric.percent input').data('value', item.porcentaje);

			// FIXME: habilitación de los sobrecargos con monto modificable
			/*
			if (item.total)
				htmlObject.find('input[name^="sobrecargo"][name$="[valor]"]').removeAttr('readonly');
			*/

			// Mostrar temporalmente el Ajuste
			if (item.ajuste) {
				htmlObject.find('> span:not(.visible)').css('opacity', 0.5);
				htmlObject.find('.percent').invisible();
			}
			if (scDirectInput)
				htmlObject.find('.percent').invisible();

			target.append(htmlObject);
		});
		
	};

	// llamada a sobrecargos

	$.ajax({
		url: '/4DACTION/_V3_getSobrecargoByCotizacion',
		dataType: 'json',
		async: false, // para que no avance hasta que la llamada se complete
		cache: false,
		data: {
			id: $('section.sheet').data('id')
		},
		success: showSobrecargos
	});

	checkAjuste(false);

	updateSubtotalItems();


	unaBase.ui.expandable.init();


	


	// Desglose de costo presupuestado

	$('section.sheet').on('hover', 'button.detail.cost', function(event) {
		var element = $(this);
		$(this).tooltipster({
			content: function() {
				var htmlObject = $('\
					<ul>																																																						\
						<li data-name="costo-presupuestado-externo">																																											\
							<strong style="font-weight: bold; display: inline-block; width: 350px;">Gasto P. externo</strong>																													\
							<span class="numeric currency">' + currency.symbol + ' <span style="display: inline-block; width: 100px; text-align: right;"></span></span>																								\
						</li>																																																					\
						<li data-name="costo-presupuestado-interno">																																											\
							<strong style="font-weight: bold; display: inline-block; width: 350px;">Gasto P. interno (<span class="numeric"></span> HH &times; <span class="numeric currency">$ <span></span></span>: <span></span>)</strong>	\
							<span class="numeric currency">' + currency.symbol + ' <span style="display: inline-block; width: 100px; text-align: right;"></span></span>																								\
						</li>																																																					\
						<li data-name="total" style="border-top: 1px solid grey; margin-top: 10px; padding-top: 10px;">																															\
							<strong style="font-weight: bold; display: inline-block; width: 350px;">Total</strong>																																\
							<span class="numeric currency">' + currency.symbol + ' <span style="display: inline-block; width: 100px; text-align: right;"></span></span>																								\
						</li>																																																					\
					</ul>																																																						\
				');

				var row = element.parentTo('tr');

				var total = parseFloat(row.find('input[name="item[][subtotal_costo]"]').val());
				var hh_cantidad = row.data('costo-presupuestado-hh-cantidad');
				var hh_valor = row.data('costo-presupuestado-hh-valor');
				var hh_username = row.data('costo-presupuestado-hh-username');
				var costo_presupuestado_interno = hh_cantidad * hh_valor;
				var costo_presupuestado_externo = total - costo_presupuestado_interno;

				htmlObject.find('li[data-name="costo-presupuestado-externo"] > span > span').text(costo_presupuestado_externo.toFixed(currency.decimals));

				htmlObject.find('li[data-name="costo-presupuestado-interno"] > strong span:nth-of-type(1)').text(hh_cantidad.toFixed(2));
				htmlObject.find('li[data-name="costo-presupuestado-interno"] > strong span:nth-of-type(2) > span').text(hh_valor.toFixed(currency.decimals));
				htmlObject.find('li[data-name="costo-presupuestado-interno"] > strong span:nth-of-type(3)').text(hh_username);
				htmlObject.find('li[data-name="costo-presupuestado-interno"] > span > span').text(costo_presupuestado_interno.toFixed(currency.decimals));

				htmlObject.find('li[data-name="total"] > span > span').text(total.toFixed(currency.decimals));

				htmlObject.find('span.numeric.percent > span').number(true, 2, ',', '.');
				htmlObject.find('span.numeric.currency > span').number(true, currency.decimals, ',', '.');


				return htmlObject;
			},
			interactive: true,
			trigger: '',
			delay: 0,
			interactiveAutoClose: true
		});
		$(this).tooltipster('show');
	});

	$('section.sheet').on('mouseout', 'button.detail.cost', function(event) {
		$(this).tooltipster('destroy');
	});


	// Desglose de costo real

	$('section.sheet').on('hover', 'button.detail.cost-real', function(event) {
		var element = $(this);
		$(this).tooltipster({
			content: function() {
				var htmlObject = $('\
					<ul>																																																						\
						<li data-name="costo-real-externo">																																														\
							<strong style="font-weight: bold; display: inline-block; width: 350px;">Gasto R. externo</strong>																													\
							<span class="numeric currency">' + currency.symbol + ' <span style="display: inline-block; width: 100px; text-align: right;"></span></span>																								\
						</li>																																																					\
						<li data-name="costo-real-interno">																																														\
							<strong style="font-weight: bold; display: inline-block; width: 350px;">Gasto R. interno (<span class="numeric"></span> HH &times; <span class="numeric currency">$ <span></span></span><!--: <span></span>-->)</strong>	\
							<span class="numeric currency">' + currency.symbol + ' <span style="display: inline-block; width: 100px; text-align: right;"></span></span>																								\
						</li>																																																					\
						<li data-name="total" style="border-top: 1px solid grey; margin-top: 10px; padding-top: 10px;">																															\
							<strong style="font-weight: bold; display: inline-block; width: 350px;">Total</strong>																																\
							<span class="numeric currency">' + currency.symbol + ' <span style="display: inline-block; width: 100px; text-align: right;"></span></span>																								\
						</li>																																																					\
					</ul>																																																						\
				');

				var row = element.parentTo('tr');

				var total = parseFloat(row.find('input[name="item[][subtotal_costo_real]"]').val());
				var hh_cantidad = row.data('costo-real-hh-cantidad');
				//var hh_valor = row.data('costo-real-hh-valor');
				var hh_total = row.data('costo-real-hh-total');
				var hh_valor = hh_total / hh_cantidad;
				//var hh_username = row.data('costo-presupuestado-hh-username');
				var hh_username = 'falta username'; // TODO
				//var costo_real_interno = hh_cantidad * hh_valor;
				var costo_real_interno = hh_total;
				var costo_real_externo = total - costo_real_interno;

				htmlObject.find('li[data-name="costo-real-externo"] > span > span').text(costo_real_externo.toFixed(currency.decimals));

				htmlObject.find('li[data-name="costo-real-interno"] > strong span:nth-of-type(1)').text(hh_cantidad.toFixed(2));
				htmlObject.find('li[data-name="costo-real-interno"] > strong span:nth-of-type(2) > span').text(hh_valor.toFixed(currency.decimals));
				htmlObject.find('li[data-name="costo-real-interno"] > strong span:nth-of-type(3) > span').text(hh_total.toFixed(currency.decimals));
				//htmlObject.find('li[data-name="costo-real-interno"] > strong span:nth-of-type(4)').text(hh_username);
				htmlObject.find('li[data-name="costo-real-interno"] > span > span').text(costo_real_interno.toFixed(currency.decimals));

				htmlObject.find('li[data-name="total"] > span > span').text(total.toFixed(currency.decimals));

				htmlObject.find('span.numeric.percent > span').number(true, 2, ',', '.');
				htmlObject.find('span.numeric.currency > span').number(true, currency.decimals, ',', '.');


				return htmlObject;
			},
			interactive: true,
			trigger: '',
			delay: 0,
			interactiveAutoClose: true
		});
		$(this).tooltipster('show');
	});

	$('section.sheet').on('mouseout', 'button.detail.cost-real', function(event) {
		$(this).tooltipster('destroy');
	});


	// Control de costo interno

	$('section.sheet table.items > tbody').on('change', '> tr:not(.title) > td input[name="item[][costo_interno]"]', function(event) {
		$(this).parentTo('tr').find('> td input[name="item[][subtotal_costo]"]').trigger('refresh');
		$(this).parentTo('tr').find('> td input[name="item[][subtotal_costo_real]"]').trigger('refresh');
	});

	$('section.sheet table.items > thead > tr:last-of-type > th > input[name="item[][costo_interno]"]').change(function() {
		if ($(this).prop('checked')) {
			$('section.sheet table.items > tbody > tr:not(.title)').each(function() {
				$(this).find('input[name="item[][costo_interno]"]:not(:checked)').prop('checked', true).trigger('change');
			});
		} else {
			$('section.sheet table.items > tbody > tr:not(.title)').each(function() {
				$(this).find('input[name="item[][costo_interno]"]:checked').prop('checked', false).trigger('change');
			});
		}
	});


	// Cálculo de costo interno + externo presupuestado

	$('section.sheet table.items > tbody').on('refresh', '> tr:not(.title) > td input[name="item[][subtotal_costo]"]', function(event) {
		// TODO: 2014-07-01 Falta añadir multiplicadores de cantidad y factor, para sacar el costo p de hh multiplicado por cantidad y factor
		// los multiplicadores deben venir en atributos data
		

		var row = $(this).parentTo('tr');

		if (row.find('> td input[name="item[][costo_interno]"]').prop('checked')) {
			if (row.data('costo-presupuestado-hh-cantidad') > 0 && row.data('costo-presupuestado-hh-valor') > 0)
				row.find('button.detail.cost').visible();

			if (!$(this).hasClass('edited')) {
				var row = $(this).parentTo('tr');
			
				var costo_externo = parseFloat($(this).val());
				var costo_interno = row.data('costo-presupuestado-hh-cantidad') * row.data('costo-presupuestado-hh-valor');

				$(this).val(costo_externo + costo_interno);
				$(this).addClass('edited');
			}
		} else {
			row.find('button.detail.cost').invisible();
			
			if ($(this).hasClass('edited')) {
				var row = $(this).parentTo('tr');

				var costo_interno = row.data('costo-presupuestado-hh-cantidad') * row.data('costo-presupuestado-hh-valor');
				var costo_total = parseFloat($(this).val());

				$(this).val(costo_total - costo_interno);
				$(this).removeClass('edited');
			}
		}

		updateRow(event);
	});


	// Cálculo de costo interno + externo real

	$('section.sheet table.items > tbody').on('refresh', '> tr:not(.title) > td input[name="item[][subtotal_costo_real]"]', function(event) {
		// TODO: 2014-07-01 Falta añadir multiplicadores de cantidad y factor, para sacar el costo p de hh multiplicado por cantidad y factor
		// los multiplicadores deben venir en atributos data
		

		var row = $(this).parentTo('tr');

		if (row.find('> td input[name="item[][costo_interno]"]').prop('checked')) {
			//if (row.data('costo-real-hh-cantidad') > 0 && row.data('costo-presupuestado-hh-valor') > 0)
			if (row.data('costo-real-hh-total') > 0)
				row.find('button.detail.cost-real').visible();

			if (!$(this).hasClass('edited')) {
				var row = $(this).parentTo('tr');
			
				var costo_externo = parseFloat($(this).val());
				//var costo_interno = row.data('costo-real-hh-cantidad') * row.data('costo-presupuestado-hh-valor');
				var costo_interno = row.data('costo-real-hh-total');

				if (isNaN(costo_externo))
					costo_externo = 0;

				$(this).val(costo_externo + costo_interno);
				$(this).addClass('edited');
			}
		} else {
			row.find('button.detail.cost-real').invisible();
			
			if ($(this).hasClass('edited')) {
				var row = $(this).parentTo('tr');

				//var costo_interno = row.data('costo-real-hh-cantidad') * row.data('costo-presupuestado-hh-valor');
				var costo_interno = row.data('costo-real-hh-total');
				var costo_total = parseFloat($(this).val());

				$(this).val(costo_total - costo_interno);
				$(this).removeClass('edited');
			}
		}

		updateRow(event);
	});

	$('section.sheet table > tbody').on('change', 'input[name="item[][costo_interno]"]', function(event) {
		saveRow(event);
	});

});