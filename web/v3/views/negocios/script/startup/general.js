$(document).ready(function () {

	$('section.sheet').find('tfoot .numeric.currency input').number(true, currency.decimals, ',', '.', true);
	$('section.sheet').find('tfoot .numeric.percent input').number(true, 2, ',', '.', true);
	//$('section.sheet').find('footer .numeric.currency span').number(true, 0, ',', '.', true);
	//$('section.sheet').find('footer .numeric.percent span').number(true, 2, ',', '.', true);

	unaBase.ui.expandable.init();


	refreshChecklist();
	//unaBase.interval.set(refreshChecklist, 15000);

	(async function () {
		setInitTotals().then(res => {
			refreshSummary();


			//REAPER REVISAR ESTE PROCESO ASINCRONO

			//unaBase.interval.set(refreshSummary, 15000);

			//REAPER COMMENT
			// $('.numeric.currency span').on('change', function () {
			// 	
			// 	$(this).find("input").number(true, currency.decimals, ',', '.', true);


			// });
			/*$('.numeric.percent span').on('change', function() {
				$(this).number(true, 2, ',', '.', true);
			});*/

			$('.numeric span').on('change', function () {
				if ($(this).text().indexOf('-') !== -1)
					$(this).addClass('negative');
			});

			$('[data-name="gasto-real-total-value"]').bind('refresh', function () {

				var gasto_real_interno_enabled = $('[name="negocio[gasto_real_interno_enabled]"]').prop('checked');
				var gasto_real_directo = parseFloat($('[data-name="gasto-real-directo-value"]').text().replace(/\./g, '').replace(/,/g, '.'));
				var gasto_real_interno = parseFloat($('[data-name="gasto-real-interno-value"]').text().replace(/\./g, '').replace(/,/g, '.'));
				var gasto_real_otros = parseFloat($('[data-name="gasto-real-otros-value"]').text().replace(/\./g, '').replace(/,/g, '.'));
				var gasto_real_sobrecargos = parseFloat($('[data-name="gasto-real-sobrecargos-value"]').text().replace(/\./g, '').replace(/,/g, '.'));
				var suma = (gasto_real_interno_enabled) ? gasto_real_directo + gasto_real_interno + gasto_real_otros + gasto_real_sobrecargos : gasto_real_directo + gasto_real_otros + gasto_real_sobrecargos;

				$.ajax({
					url: '/4DACTION/_V3_setNegocios',
					data: {
						id: $('section.sheet').data('id'),
						'negocio[gasto_real_interno_enabled]': gasto_real_interno_enabled
					},
					dataType: 'json',
					success: function (data) {
						if (data.success) {
							$('[data-name="gasto-real-total-value"]').text(suma.toFixed(currency.decimals)).trigger('change');

							if (gasto_real_interno_enabled) {
								totales.summaryNegocioData.rows[0].resumen.gasto_real.interno.enabled = true;
								$('[data-name="gasto-real-interno-value"]').parentTo('li').removeClass('strikeout');
								toastr.info('El gasto interno ha sido incluido en el total.');
							} else {
								totales.summaryNegocioData.rows[0].resumen.gasto_real.interno.enabled = false;
								$('[data-name="gasto-real-interno-value"]').parentTo('li').addClass('strikeout');
								toastr.info('El gasto interno ha sido quitado del total.');
							}

							$.ajax({
								url: '/4DACTION/_V3_getSummaryByNegocio',
								data: {
									id: $('section.sheet').data('id')
								},
								dataType: 'json',
								async: false,
								success: function (data) {
									totales.summaryNegocioData = data;
									refreshSummary();
								}
							});


						} else
							$('[name="negocio[gasto_real_interno_enabled]"]').prop('checked', !gasto_real_interno_enabled);
					},
					error: function (data) {
						$('[name="negocio[gasto_real_interno_enabled]"]').prop('checked', !gasto_real_interno_enabled);
					}
				});

			});

			$('input[name="negocio[gasto_real_interno_enabled]"]').change(function () {
				$('[data-name="gasto-real-total-value"]').trigger('refresh');
			});






			$('ul button.show').button({
				icons: {
					primary: 'ui-icon-carat-1-s'
				},
				text: false
			});


			$('button.show.area-negocio').click(function () {
				var target = $(this).parentTo('ul');
				target.find('input[name="cotizacion[area_negocio]"][type="search"]').autocomplete('search', '@').focus();
			});

			if ($('input[name="cotizacion[area_negocio]"]').length > 0)
				$('input[name="cotizacion[area_negocio]"]').autocomplete({
					source: function (request, response) {
						$.ajax({
							url: '/4DACTION/_V3_' + 'getAreaNegocio',
							dataType: 'json',
							data: {
								q: request.term
							},
							success: function (data) {
								response($.map(data.rows, function (item) {
									return item;
								}));
							}
						});
					},
					minLength: 0,
					delay: 5,
					autoFocus: true,
					position: { my: "left top", at: "left bottom", collision: "flip" },
					open: function () {
						$(this).removeClass('ui-corner-all').addClass('ui-corner-top');
					},
					close: function () {
						$(this).removeClass('ui-corner-top').addClass('ui-corner-all');
					},
					focus: function (event, ui) {
						return false;
					},
					response: function (event, ui) {
					},
					select: function (event, ui) {
						$('input[name="cotizacion[area_negocio]"]').val(ui.item.text);
						$('input[name="cotizacion[area_negocio]"]').data('id', ui.item.id);
						return false;
					}

				}).data('ui-autocomplete')._renderItem = function (ul, item) {
					return $('<li><a><span>' + item.text + '</span></a></li>').appendTo(ul);
				};




			if ($('input[name="cotizacion[proyecto]"]').length > 0) {
				$('input[name="cotizacion[proyecto]"]').autocomplete({
					source: function (request, response) {
						$.ajax({
							url: '/4DACTION/_V3_' + 'getProyecto',
							dataType: 'json',
							data: {
								q: request.term
							},
							success: function (data) {
								response($.map(data.rows, function (item) {
									return item;
								}));
							}
						});
					},
					minLength: 0,
					delay: 5,
					autoFocus: true,
					position: { my: "left top", at: "left bottom", collision: "flip" },
					open: function () {
						$(this).removeClass('ui-corner-all').addClass('ui-corner-top');
					},
					close: function () {
						$(this).removeClass('ui-corner-top').addClass('ui-corner-all');
					},
					focus: function (event, ui) {
						return false;
					},
					response: function (event, ui) {
					},
					select: function (event, ui) {
						$('input[name="cotizacion[proyecto]"]').val(ui.item.text);
						$('input[name="cotizacion[proyecto]"]').data('id', ui.item.id);

						return false;
					}
				}).data('ui-autocomplete')._renderItem = function (ul, item) {
					return $('<li><a><span>' + item.text + '</span></a></li>').appendTo(ul);
				};

			}
		});
	})();




	




});
