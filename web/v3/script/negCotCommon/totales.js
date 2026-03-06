





//-----------------------   Variables   --------------------------
//----------------------------------------------------------------


var totales = {};
totales.summaryNegocioData = {};
//EVITA QUE TODO SE VAYA AL CARAJO
var calculateAll = true



//-----------------------   Eventos ----------------------------
//----------------------------------------------------------------



//-----------------------  Functions ----------------------------
//----------------------------------------------------------------



totales = {
	adicionales: {
		init: async () => {

			let res = await totales.adicionales.chargeTotal();



		},
		chargeTotal: () => {

			let url = "";

			url = '/4DACTION/_V3_get_totalAdicionales';

			$.ajax({
				url: url,
				dataType: 'json',
				async: false,
				cache: false,
				data: {
					id: $('section.sheet').data('id'),
					onlytotal: true
				},
				success: function (data) {


					let valor = unaBase.utilities.transformNumber(data.total) / exchange_rate
					document.getElementsByName('cotizacion[total][item][adicional]')[0].value = unaBase.utilities.transformNumber(valor, 'int');

					return true;

				},
				error: function (error) {
					console.log(error);
					return false;
				}
			});

		},

		setTomSelect: (select, cont, element_selected = '') => {
			var target = document.getElementById('Adds').getElementsByTagName('tbody')[0];
			let settings = {
				create: true,
				addPrecedence: true,
				sortField: {
					field: "text",
					direction: "asc"
				},
				render: {
					option: function (data, escape) {
						return '<div style="text-align: left;">' + escape(data.text) + '</div>';
					},
					item: function (data, escape) {
						return '<div style="text-align: left;">' + escape(data.text) + '</div>';
					},
					option_create: function (data, escape) {
						return '<div class="create" style="font-size: 10px;">Agregar <strong>' + escape(data.input) + '</strong>&hellip;</div>';
					},
					no_results: function (data, escape) {
						return '<div class="no-results" style="font-size: 10px;">No hay resultados para "' + escape(data.input) + '"</div>';
					},
					not_loading: function (data, escape) {
						// no default content
					},
					optgroup: function (data) {
						let optgroup = document.createElement('div');
						optgroup.className = 'optgroup';
						optgroup.appendChild(data.options);
						return optgroup;
					},
					optgroup_header: function (data, escape) {
						return '<div class="optgroup-header">' + escape(data.label) + '</div>';
					},
					loading: function (data, escape) {
						return '<div class="spinner"></div>';
					},
					dropdown: function () {
						return '<div></div>';
					}
				},

			};


			let newlyAddedSelect = target.querySelector('.catalogo_select_' + cont);
			let tomSelect = new TomSelect(newlyAddedSelect, settings);
			if (element_selected !== '') {
				tomSelect.setValue(element_selected)
			}
			tomSelect.on('item_add', function (value, item) {
				let originalOption = select.querySelector(`option[value="${value}"]`);
				if (originalOption) {
					let myCode = originalOption.dataset.code;
					let row = item.closest('tr')

					// Si encontramos la fila, obtenemos el primer 'th'
					if (row) {
						let firstTh = row.querySelector('th:first-child');
						if (firstTh) {
							firstTh.textContent = myCode;
							totales.adicionales.save(row)
						}
					}
				}
			});


			tomSelect.on('option_add', function (value, data) {
				console.log('Nueva opción agregada:', value);

				let row = newlyAddedSelect.closest('tr');

				// Si encontramos la fila, obtenemos el primer 'th'
				if (row) {
					// Asigna cualquier valor o acción que desees aquí
					totales.adicionales.save(row, true, value);
				}
			});

		},
		getTotalAdicionales: () => {
			let url = "";

			url = '/4DACTION/_V3_get_totalAdicionales';

			$.ajax({
				url: url,
				dataType: 'json',
				async: false,
				cache: false,
				data: {
					id: $('section.sheet').data('id')
				},
				success: function (data) {
					if (data.rows?.length > 0) {
						let cont = 0;
						const getCode = (id_servicio) => {
							let code

							code = totales.catalogo.find(v => v.id_servicio == id_servicio)
							code = code.index
							return code
						}
						let row = ''
						data.rows.forEach(function (res_ele) {

							let valor = unaBase.utilities.transformNumber(res_ele.valor) / exchange_rate

							if (unaBase.parametros.items_categoria) {
								let select = document.createElement('select');
								select.className = 'catalogo_select_' + cont;
								let index = totales.catalogo.findIndex(v => v.id_servicio == res_ele.id_servicio)
								if (index < 0) {

									let obj = {
										id_servicio: res_ele.id_servicio,
										index: 'S/C',
										text: res_ele.name
									}
									totales.catalogo.push(obj)
								}
								totales.catalogo.forEach(v => {
									if (v.text != '') {
										let option = document.createElement('option');
										option.text = v.text;
										option.value = v.id_servicio;
										option.dataset.code = v.index;
										select.appendChild(option);

									}
								});

								row = `
									<tr style="margin-right: 10px; " id="${res_ele.id}" >
										<th class="thleft" style="width: 50px;">
											<input type="text" value="${getCode(res_ele.id_servicio)}"  readonly />
										</th>
										<th class="thleft">
											${select.outerHTML}
				
										</th>
										<th class="thleft" >
											<input type="text" class="edit" value="${unaBase.utilities.transformNumber(valor, 'int')}"  onchange="totales.adicionales.save(this)" onkeyup="totales.adicionales.formater(this)"/>
										</th>
										<th class="thleft" >
											<button style="display: inline-block;" class="ui-icon ui-icon-minus" onclick="totales.adicionales.delete(this)" title="Eliminar"></button>
										</th>
									</tr>`;
								target = $('#Adds > tbody');

								target.append(row);
								totales.adicionales.setTomSelect(select, cont, res_ele.id_servicio)
							} else {
								row = `
								<tr style="margin-right: 10px; " id="${res_ele.id}" >
									<th class="thleft" style="width: 50px;">
										<input type="text" value="${cont}"  readonly />
									</th>
									<th class="thleft">
										<input type="text" value="${res_ele.name}"  class="edit" onchange="totales.adicionales.save(this)" placeholder="Ingrese un nombre"></input>
			
									</th>
									<th class="thleft" >
										<input type="text" class="edit" value="${unaBase.utilities.transformNumber(valor, 'int')}"  onchange="totales.adicionales.save(this)" onkeyup="totales.adicionales.formater(this)"/>
									</th>
									<th class="thleft" >
										<button style="display: inline-block;" class="ui-icon ui-icon-minus" onclick="totales.adicionales.delete(this)" title="Eliminar"></button>
									</th>
								</tr>`;

								target = $('#Adds > tbody');

								target.append(row);
							}






							cont++;

						});

						let targetTotal = $('#Adds > tfoot span#totalAdicionales')[0];

						let total = unaBase.utilities.transformNumber(data.total) / exchange_rate
						targetTotal.textContent = unaBase.utilities.transformNumber(total, 'int');
					}

				},
				error: function (error) {
					console.log(error);
				}
			});
		},

		getCatalogo: () => {

			const getCatalogo = async () => {
				try {
					const url = `https://${window.location.host}/4DACTION/_light_getProducto?all_records=true`;
					const res = await axios.get(url);
					totales.catalogo = res.data.rows;
				} catch (err) {
					throw err;
				}
			};

			getCatalogo();
		},
		save: (ad, new_item = false, name_item = '') => {

			let tr
			if (ad.nodeName == 'TR') {
				tr = ad
			} else {
				tr = ad.offsetParent.parentElement;
			}


			let id_ad = tr.id;
			let name = "";
			let valor = 0;

			if (unaBase.doc.currencyCode != unaBase.defaulCurrencyCode)
				valor = unaBase.utilities.transformNumber(unaBase.utilities.transformNumber(tr.getElementsByTagName("th")[2]?.getElementsByTagName('input')[0].value) * exchange_rate, 'int');
			else
				valor = tr.getElementsByTagName("th")[2]?.getElementsByTagName('input')[0].value;


			let id_servicio
			if (unaBase.parametros.items_categoria) {
				let selectElement = tr.querySelector('select');
				let tomInstance = selectElement.tomselect;
				let selectedValue = tomInstance.getValue();
				if (!new_item) {
					let selectedOption = tomInstance.getOption(selectedValue);
					name = selectedOption ? selectedOption.textContent : '';
					id_servicio = selectedValue | 0
				} else {
					id_servicio = 0
					name = name_item
				}
			} else {
				id_servicio = 0
				name = tr.getElementsByTagName("th")[1]?.getElementsByTagName('input')[0].value;
			}


			//name = tr.getElementsByTagName("th")[1]?.getElementsByTagName('input')[0].value;
			let url = '/4DACTION/_V3_set_totalAdicionales';
			if (name != "") {
				$.ajax({
					url: url,
					dataType: 'json',
					async: false,
					cache: false,
					data: {
						id: $('section.sheet').data('id'),
						action: 'save',
						id_ad,
						valor,
						name,
						id_servicio
					},
					success: function (data) {
						if (tr.id == "0") {
							tr.id = data.id;
						}

						let targetTotal = $('#Adds > tfoot span#totalAdicionales')[0];

						let total = unaBase.utilities.transformNumber(data.total) / exchange_rate
						targetTotal.textContent = unaBase.utilities.transformNumber(total, 'int');

						toastr.success(
							"Item adicional guardado."
						);


						document.getElementsByName('cotizacion[total][item][adicional]')[0].value = unaBase.utilities.transformNumber(total, 'int');;

						document.querySelectorAll('.ui-dialog fieldset.button-fieldset button#add-line-button')[0].disabled = false;
						totales.updateSubtotalNeto();
					},
					error: function (error) {

						console.log(error);
					}
				});
			} else {
				toastr.warning(
					"Debe ingresar un nombre."
				);
			}

		},
		delete: (ad) => {
			confirm("¿ Seguro que quiere eliminar el item ?").done(function (option) {
				if (option) {

					let tr = ad.offsetParent.parentElement;
					let id_ad = tr.id;

					let url = '/4DACTION/_V3_set_totalAdicionales';
					$.ajax({
						url: url,
						dataType: 'json',
						async: false,
						cache: false,
						data: {
							id: $('section.sheet').data('id'),
							action: 'delete',
							id_ad


						},
						success: function (data) {
							tr.remove();

							document.querySelectorAll('.ui-dialog fieldset.button-fieldset button#add-line-button')[0].disabled = false;
							let targetTotal = $('#Adds > tfoot span#totalAdicionales')[0];
							let total = unaBase.utilities.transformNumber(data.total) / exchange_rate
							targetTotal.textContent = unaBase.utilities.transformNumber(total, 'int');

							document.getElementsByName('cotizacion[total][item][adicional]')[0].value = total;
							totales.updateSubtotalNeto();
							toastr.success(
								"Item eliminado."
							);
						},
						error: function (error) {
							toastr.warning(
								"No se pudo eliminar el item."
							);
							console.log(error);
						}
					});
				}
			});
		},
		formater: (a) => {

			a.value = unaBase.utilities.transformNumber(a.value, 'view')

		}

	},
	updateSubtotalNeto: () => {

		try {
			var subtotal_precios = parseFloat($('[name="cotizacion[precios][subtotal]"]').val());
			if (unaBase.items_venta_nulo)
				subtotal_precios = 0
			var subtotal_sobrecargos = parseFloat($('[name="cotizacion[sobrecargos][subtotal]"]').val());
			var descuento = parseFloat($('[name="cotizacion[descuento][valor]"]').val());
			let dif_val = ""

			if (parseFloat(document.querySelector('section.sobrecargos li[data-ajuste="true"] input[name$="[valor]"]').value) == 0) {

				if (unaBase.defaulCurrencyCode != selected_currency || selected_currency == "PEN" || selected_currency == "USD")
					$('input[name="cotizacion[montos][subtotal_neto]"]').val(((subtotal_precios + subtotal_sobrecargos - descuento + unaBase.utilities.transformNumber(document.getElementsByName('cotizacion[total][item][adicional]')[0].value)).toFixed(2)));
				else
					$('input[name="cotizacion[montos][subtotal_neto]"]').val((subtotal_precios + subtotal_sobrecargos - descuento + unaBase.utilities.transformNumber(document.getElementsByName('cotizacion[total][item][adicional]')[0].value)).toFixed(unaBase.doc.view_decimals));
			} else {
				$('input[name="cotizacion[montos][subtotal_neto]"]').val($('input[name="cotizacion[ajuste]"]').val());
			}
			

			$('input[name="cotizacion[ajuste]"]').val($('input[name="cotizacion[montos][subtotal_neto]"]').val());

			document.querySelector('input[name="cotizacion[ajuste][diferencia]"]').value = document.querySelector('section.sobrecargos li[data-ajuste="true"] input[name$="[valor]"]').value

			if ($('section.sobrecargos li[data-ajuste="true"] input[name$="[valor]"]').val() != 0) {
				$('input[name="cotizacion[montos][subtotal_neto]"]').addClass('ajustado');
				$('button.reset.ajuste').show();
			} else {
				$('input[name="cotizacion[montos][subtotal_neto]"]').removeClass('ajustado');
				$('button.reset.ajuste').hide();
			}




			if (unaBase.defaulCurrencyCode == selected_currency) {

				$('span[name="cotizacion[montos][subtotal_neto]"]').text(((subtotal_precios + subtotal_sobrecargos - descuento + unaBase.utilities.transformNumber(document.getElementsByName('cotizacion[total][item][adicional]')[0].value)).toFixed(unaBase.doc.view_decimals)).toString().replace('.', ','));
				$('span[name="cotizacion[montos][subtotal_neto]"]').number(true, unaBase.doc.view_decimals, ',', '.');
			} else {


				var sumTotalCliente = subtotal_precios + subtotal_sobrecargos - descuento;


				$('span[name="cotizacion[montos][subtotal_neto]"]').text($.number(sumTotalCliente, unaBase.doc.view_decimals, ',', '.'));

			}

			totales.updateTotal();
		} catch (ex) {
			console.log(ex)
		}
	},
	updateDescuento: () => {
		var porcentaje_descuento = parseFloat($('[name="cotizacion[descuento][porcentaje]"]').val());
		var subtotal_sobrecargos = parseFloat($('section.sobrecargos > ul > li:last-of-type input[name*="subtotal"]').val());
		if (typeof selected_currency == 'undefined')
			$('[name="cotizacion[descuento][valor]"]').val((porcentaje_descuento * subtotal_sobrecargos / 100).toFixed(currency.decimals));
		else
			$('[name="cotizacion[descuento][valor]"]').val((porcentaje_descuento * subtotal_sobrecargos / 100.00).toFixed(2));

		sobrecargos.updateSobrecargos(true);
		totales.updateSubtotalNeto();
	},
	updateTotal: () => {

		var subtotal_neto = parseFloat($('input[name="cotizacion[montos][subtotal_neto]"]').val());
		var porcentaje_impuesto = parseFloat($('[name="cotizacion[montos][impuesto]"]').data('porcentaje'));
		var valor_impuesto;

		if ($('[name="cotizacion[montos][impuesto][exento]"]').prop('checked'))
			valor_impuesto = 0;
		else
			valor_impuesto = subtotal_neto * porcentaje_impuesto / 100;

		if (typeof selected_currency == 'undefined') {
			$('[name="cotizacion[montos][impuesto]"]').val((valor_impuesto.toFixed(currency.decimals)));
			var total = subtotal_neto + valor_impuesto;
			$('[name="cotizacion[montos][total]"]').val((total.toFixed(currency.decimals)));
		} else {
			$('[name="cotizacion[montos][impuesto]"]').val((valor_impuesto.toFixed(2)));
			var total = subtotal_neto + valor_impuesto;
			$('[name="cotizacion[montos][total]"]').val((total.toFixed(2)));
		}

		totales.updateTotalUtilidadCosto();
	},
	checkAjuste: (reset) => {
		var target = $('section.sobrecargos > ul > li[data-ajuste="true"]');
		if (reset) {
			target.find('.percent').val(0).trigger('change');
			target.find('.currency').val(0);
			target.find('.currency').trigger('change');
		}

		target.find('.percent').prop('readonly', true);

		$('input[name="cotizacion[ajuste]"]').parentTo('li').show();

		if (target.find('.utilidad').length)
			$('[name="cotizacion[ajuste][diferencia]"]').addClass('utilidad');
		else
			$('[name="cotizacion[ajuste][diferencia]"]').addClass('costo');
	},
	updateAjuste: () => {

		//REAPER
		let adicionales = unaBase.utilities.transformNumber(document.getElementsByName('cotizacion[total][item][adicional]')[0].value);
		var original_value = parseFloat($('input[name="cotizacion[ajuste]"]').data('original-value'));
		var subtotal_neto = parseFloat($('input[name="cotizacion[montos][subtotal_neto]"]').val()) + adicionales;
		var ajuste = parseFloat($('input[name="cotizacion[ajuste]"]').val());
		ajuste = (ajuste == 0 ? ajuste += adicionales : ajuste)

		if (!(original_value == subtotal_neto || subtotal_neto == ajuste)) {
			if (!contentLoaded && parseFloat($('input[name="cotizacion[ajuste]"]').val()) !== totalNeto)
				$('input[name="cotizacion[ajuste]"]').val(totalNeto).triggerHandler('change');

			if (contentLoaded && parseFloat($('input[name="cotizacion[montos][subtotal_neto]"]').val()) != parseFloat($('input[name="cotizacion[ajuste]"]').val())) {
				var scrollTop = $('#tabs-2').scrollTop();
				$('input[name="cotizacion[ajuste]"]').trigger('change').val($('input[name="cotizacion[ajuste]"]').data('original-value'));
				$('#tabs-2').scrollTop(scrollTop);
			}
		} else {
			if (!contentReady) {
				contentReady = true;
				if (contentChanged && totalNeto > 0 && fixedTotalCliente) {
					contentChanged = false;
					var scrollTop = $('#tabs-2').scrollTop();
					$('input[name="cotizacion[ajuste]"]').trigger('change').val(totalNeto);
					$('#tabs-2').scrollTop(scrollTop);
				}
			}
		}

	},
	updateTotalUtilidadCosto: async () => {


		var subtotal_items = parseFloat($('table.items [name="cotizacion[precios][subtotal]"]').val());

		var utilidad_items = parseFloat($('[name="cotizacion[utilidades][subtotal]"]').val());
		var costo_items = parseFloat($('[name="cotizacion[costos][subtotal]"]').val());

		var utilidad_sobrecargos = 0;
		var costo_sobrecargos = 0;

		var costo_real_otros = 0;
		var costo_real_sobrecargos = 0;

		if (!totales.summaryNegocioData) {

			await setInitTotals();
		}


		costo_real_otros = totales.summaryNegocioData.rows[0].resumen.gasto_real.otros.value / exchange_rate;
		costo_real_sobrecargos = totales.summaryNegocioData.rows[0].resumen.gasto_real.sobrecargos.value / exchange_rate;

		var utilidad_items = parseFloat($('[name="cotizacion[utilidades][subtotal]"]').val());
		var costo_items = parseFloat($('[name="cotizacion[costos][subtotal]"]').val());

		var utilidad_real_items = parseFloat($('[name="cotizacion[utilidades_real][subtotal]"]').val());
		var costo_real_items = parseFloat($('[name="cotizacion[costos_real][subtotal]"]').val());

		$('section.sobrecargos ul.sc li').each(function () {
			var target = $(this).find('[name^="sobrecargo"][name$="[valor]"]');
			if (target.hasClass('utilidad'))
				utilidad_sobrecargos += unaBase.utilities.transformNumber(target[0].value);
			else
				costo_sobrecargos += unaBase.utilities.transformNumber(target[0].value);
		});


		if (unaBase.doc.modoCine) {
			var descuento = 0;

			var subtotal_neto = parseFloat($('input[name="cotizacion[ajuste]"]').val());
		} else {
			var descuento = parseFloat($('[name="cotizacion[descuento][valor]"]').val());

			var subtotal_neto = parseFloat($('input[name="cotizacion[montos][subtotal_neto]"]').val());

		}


		if (typeof selected_currency == 'undefined') {
			var utilidad_total = (utilidad_items + utilidad_sobrecargos - descuento).toFixed(currency.decimals);
			var costo_total = (costo_items + costo_sobrecargos).toFixed(currency.decimals);

			var costo_real_total = (costo_real_items + costo_real_otros + costo_real_sobrecargos).toFixed(currency.decimals);

			if (calculo_UR_con_subtotal) {
				var utilidad_real_total = subtotal_items - costo_real_total;
			} else {
				var utilidad_real_total = subtotal_neto - costo_real_total;
			}

		} else {
			var utilidad_total = (utilidad_items + utilidad_sobrecargos - descuento).toFixed(2);
			var costo_total = (costo_items + costo_sobrecargos).toFixed(2);

			var costo_real_total = (costo_real_items + costo_real_otros + costo_real_sobrecargos).toFixed(2);
			if (calculo_UR_con_subtotal) {
				var utilidad_real_total = subtotal_items - costo_real_total;
			} else {
				var utilidad_real_total = subtotal_neto - costo_real_total;
			}
		}



		//var utilidad_real_total = (utilidad_real_items + utilidad_sobrecargos - descuento).toFixed(0);


		$('input[name="cotizacion[montos][utilidad]"]').val(utilidad_total);
		$('input[name="cotizacion[montos][costo]"]').val(costo_total);
		$('span[name="cotizacion[montos][utilidad]"]').text(parseFloat(utilidad_total).toFixed(2).toString().replace('.', ','));
		$('span[name="cotizacion[montos][costo]"]').text((parseFloat(costo_total)).toFixed(2).toString().replace('.', ','));
		if (typeof selected_currency == 'undefined') {
			$('span[name="cotizacion[montos][utilidad]"]').number(true, currency.decimals, ',', '.');
			$('span[name="cotizacion[montos][costo]"]').number(true, currency.decimals, ',', '.');
		} else {
			$('span[name="cotizacion[montos][utilidad]"]').number(true, 2, ',', '.');
			$('span[name="cotizacion[montos][costo]"]').number(true, 2, ',', '.');
		}

		var subtotal_neto = parseFloat($('input[name="cotizacion[montos][subtotal_neto]"]').val());

		//$('input[name="cotizacion[montos][utilidad_ratio]"]').val(utilidad_total / subtotal_neto * 100);
		//$('input[name="cotizacion[montos][costo_ratio]"]').val(costo_total / subtotal_neto * 100);
		var utilidad_ratio = 0;
		var costo_ratio = 0;
		if (margenCompraResumenes) {
			if (margen_desde_compra_inverso) {
				utilidad_ratio = (1 - utilidad_total / subtotal_neto) * 100;
				costo_ratio = (1 - costo_total / subtotal_neto) * 100;
			} else {
				utilidad_ratio = utilidad_total / costo_total * 100;
				costo_ratio = 100 - utilidad_ratio;
			}
		} else {
			utilidad_ratio = utilidad_total / subtotal_neto * 100;
			costo_ratio = costo_total / subtotal_neto * 100;
		}
		if (unaBase.doc.modoCine) {
			if (!isFinite(utilidad_real_ratio)) utilidad_real_ratio = 0;
			if (!isFinite(costo_real_ratio)) costo_real_ratio = 0;
		}

		$('input[name="cotizacion[montos][utilidad_ratio]"]').val(utilidad_ratio);
		$('input[name="cotizacion[montos][costo_ratio]"]').val(costo_ratio);

		if ($('input[name="cotizacion[montos][utilidad_ratio]"]').length > 0)
			$('span[name="cotizacion[montos][utilidad_ratio]"]').text(parseFloat($('input[name="cotizacion[montos][utilidad_ratio]"]').val()).toFixed(2).replace('.', ','));
		if ($('input[name="cotizacion[montos][costo_ratio]"]').length > 0)
			$('span[name="cotizacion[montos][costo_ratio]"]').text(parseFloat($('input[name="cotizacion[montos][costo_ratio]"]').val()).toFixed(2).replace('.', ','));

		$('input[name="cotizacion[montos][utilidad_real]"]').val(utilidad_real_total);
		$('input[name="cotizacion[montos][costo_real]"]').val(costo_real_total);
		$('span[name="cotizacion[montos][utilidad_real]"]').text(parseFloat(utilidad_real_total).toFixed(2).toString().replace('.', ','));
		$('span[name="cotizacion[montos][costo_real]"]').text(parseFloat(costo_real_total).toFixed(2).toString().replace('.', ','));
		if (typeof selected_currency == 'undefined') {
			$('span[name="cotizacion[montos][utilidad_real]"]').number(true, currency.decimals, ',', '.');
			$('span[name="cotizacion[montos][costo_real]"]').number(true, currency.decimals, ',', '.');
		} else {
			$('span[name="cotizacion[montos][utilidad_real]"]').number(true, 2, ',', '.');
			$('span[name="cotizacion[montos][costo_real]"]').number(true, 2, ',', '.');
		}

		var utilidad_real_ratio = 0;
		var costo_real_ratio = 0;
		if (margenCompraResumenes) {
			if (margen_desde_compra_inverso) {
				utilidad_real_ratio = (1 - utilidad_real_total / (calculo_UR_con_subtotal ? subtotal_items : subtotal_neto)) * 100;
				costo_real_ratio = (1 - costo_real_total / (calculo_UR_con_subtotal ? subtotal_items : subtotal_neto)) * 100;
			} else {
				utilidad_real_ratio = utilidad_real_total / costo_real_total * 100;
				costo_real_ratio = 100 - utilidad_real_ratio;
			}
		} else {
			utilidad_real_ratio = utilidad_real_total / (calculo_UR_con_subtotal ? subtotal_items : subtotal_neto) * 100;
			costo_real_ratio = costo_real_total / (calculo_UR_con_subtotal ? subtotal_items : subtotal_neto) * 100;
		}
		if (!isFinite(utilidad_real_ratio)) utilidad_real_ratio = 0;
		if (!isFinite(costo_real_ratio)) costo_real_ratio = 0;
		$('input[name="cotizacion[montos][utilidad_real_ratio]"]').val(utilidad_real_ratio);
		$('input[name="cotizacion[montos][costo_real_ratio]"]').val(costo_real_ratio);
		$('span[name="cotizacion[montos][utilidad_real_ratio]"]').text((utilidad_real_ratio).toFixed(2).toString().replace('.', ','));
		$('span[name="cotizacion[montos][costo_real_ratio]"]').text((costo_real_ratio).toFixed(2).toString().replace('.', ','));

		/* Porter */

		var ca = parseFloat($('[name="sobrecargo[4][valor]"]').val());

		var gasto_of_ratio_raw = 0.58;

		var ejecutivo_ca_ratio_raw = 0.10;
		var ejecutivo_resultado_ratio_raw = 0.08;

		if (typeof selected_currency == 'undefined') {
			var delta = (subtotal_items - parseFloat(costo_real_total)).toFixed(currency.decimals).toString().replace('.', ',');
			var gasto_of = (delta * gasto_of_ratio_raw).toFixed(currency.decimals).toString().replace('.', ',');

			var resultado_evento_raw = delta - gasto_of;
			var resultado_evento = (resultado_evento_raw).toFixed(currency.decimals).toString().replace('.', ',');

			var ejecutivo_ca = (ca * ejecutivo_ca_ratio_raw).toFixed(currency.decimals).toString().replace('.', ',');
			var ejecutivo_resultado = (resultado_evento * ejecutivo_resultado_ratio_raw).toFixed(currency.decimals).toString().replace('.', ',');

			var total_comision_ejecutivo_raw = ca * ejecutivo_ca_ratio_raw + resultado_evento * ejecutivo_resultado_ratio_raw;
			var total_comision_ejecutivo = (total_comision_ejecutivo_raw).toFixed(currency.decimals).toString().replace('.', ',');

			var dif = (ca - (ca * ejecutivo_ca_ratio_raw));
			var dif_ca_empresa = (ca - (ca * ejecutivo_ca_ratio_raw)).toFixed(currency.decimals).toString().replace('.', ',');

			var resultado_final_raw = (delta - gasto_of) - (ca * ejecutivo_ca_ratio_raw + resultado_evento * ejecutivo_resultado_ratio_raw);

			resultado_final_raw = resultado_final_raw + dif;
			var resultado_final = (resultado_final_raw).toFixed(currency.decimals).toString().replace('.', ',');

			var saldo_raw = resultado_evento_raw - total_comision_ejecutivo_raw;
			var saldo = (saldo_raw).toFixed(currency.decimals).toString().replace('.', ',');

		} else {
			var delta = (subtotal_items - costo_real_total).toFixed(2).toString().replace('.', ',');
			var gasto_of = (delta * gasto_of_ratio_raw).toFixed(2).toString().replace('.', ',');

			var resultado_evento_raw = delta - gasto_of;
			var resultado_evento = (resultado_evento_raw).toFixed(2).toString().replace('.', ',');

			var ejecutivo_ca = (ca * ejecutivo_ca_ratio_raw).toFixed(2).toString().replace('.', ',');
			var ejecutivo_resultado = (resultado_evento * ejecutivo_resultado_ratio_raw).toFixed(2).toString().replace('.', ',');

			var total_comision_ejecutivo_raw = ca * ejecutivo_ca_ratio_raw + resultado_evento * ejecutivo_resultado_ratio_raw;
			var total_comision_ejecutivo = (total_comision_ejecutivo_raw).toFixed(2).toString().replace('.', ',');

			var dif = (ca - (ca * ejecutivo_ca_ratio_raw));
			var dif_ca_empresa = (dif).toFixed(2).toString().replace('.', ',');

			var resultado_final_raw = (delta - gasto_of) - (ca * ejecutivo_ca_ratio_raw + resultado_evento * ejecutivo_resultado_ratio_raw);

			resultado_final_raw = resultado_final_raw + dif;
			var resultado_final = (resultado_final_raw).toFixed(2).toString().replace('.', ',');

			var saldo_raw = resultado_evento_raw - total_comision_ejecutivo_raw;
			var saldo = (saldo_raw).toFixed(currency.decimals).toString().replace('.', ',');

		}

		var resultado_final_ratio_raw = resultado_final_raw / subtotal_items;

		var gasto_of_ratio = (gasto_of_ratio_raw * 100.00).toFixed(2).toString().replace('.', ',');
		var ejecutivo_ca_ratio = (ejecutivo_ca_ratio_raw * 100.00).toFixed(2).toString().replace('.', ',');
		var ejecutivo_resultado_ratio = (ejecutivo_resultado_ratio_raw * 100.00).toFixed(2).toString().replace('.', ',');
		var resultado_final_ratio = (resultado_final_ratio_raw * 100.00).toFixed(2).toString().replace('.', ',');

		var diferencia_ca_ratio = ((dif / ca) * 100.00).toFixed(2).toString().replace('.', ',');

		$('span[name="cotizacion[montos][subtotal_flotante]"]').text(subtotal_items.toFixed(2).toString().replace('.', ','));

		$('span[name="cotizacion[montos_custom][delta]"]').text(delta);
		$('span[name="cotizacion[montos_custom][gasto_of]"]').text(gasto_of);
		$('span[name="cotizacion[montos_custom][gasto_of_ratio]"]').text(gasto_of_ratio);
		$('span[name="cotizacion[montos_custom][resultado_evento]"]').text(resultado_evento);

		$('span[name="cotizacion[montos_custom][ejecutivo_ca]"]').text(ejecutivo_ca);
		$('span[name="cotizacion[montos_custom][ejecutivo_ca_ratio]"]').text(ejecutivo_ca_ratio);
		$('span[name="cotizacion[montos_custom][ejecutivo_resultado]"]').text(ejecutivo_resultado);
		$('span[name="cotizacion[montos_custom][ejecutivo_resultado_ratio]"]').text(ejecutivo_resultado_ratio);

		$('span[name="cotizacion[montos_custom][total_comision_ejecutivo]"]').text(total_comision_ejecutivo);

		$('span[name="cotizacion[montos_custom][resultado_final]"]').text(resultado_final);

		$('span[name="cotizacion[montos_custom][resultado_final_ratio]"]').text(resultado_final_ratio);


		$('span[name="cotizacion[montos_custom][dif_ca_empresa]"]').text(dif_ca_empresa);

		$('span[name="cotizacion[montos_custom][diferencia_ca_ratio]"]').text(diferencia_ca_ratio);

		$('span[name="cotizacion[montos_custom][saldo]"]').text(saldo);


		if (typeof selected_currency == 'undefined') {
			$('span[name="cotizacion[montos][subtotal_flotante]"]').number(true, currency.decimals, ',', '.');
			$('span[name="cotizacion[montos_custom][delta]"]').number(true, currency.decimals, ',', '.');
			$('span[name="cotizacion[montos_custom][gasto_of]"]').number(true, currency.decimals, ',', '.');
			$('span[name="cotizacion[montos_custom][resultado_evento]"]').number(true, currency.decimals, ',', '.');

			$('span[name="cotizacion[montos_custom][ejecutivo_ca]"]').number(true, currency.decimals, ',', '.');
			$('span[name="cotizacion[montos_custom][ejecutivo_resultado]"]').number(true, currency.decimals, ',', '.');

			$('span[name="cotizacion[montos_custom][total_comision_ejecutivo]"]').number(true, currency.decimals, ',', '.');

			$('span[name="cotizacion[montos_custom][dif_ca_empresa]"]').number(true, currency.decimals, ',', '.');

			$('span[name="cotizacion[montos_custom][resultado_final]"]').number(true, currency.decimals, ',', '.');

			$('span[name="cotizacion[montos_custom][saldo]"]').number(true, currency.decimals, ',', '.');

		} else {
			$('span[name="cotizacion[montos][subtotal_flotante]"]').number(true, 2, ',', '.');
			$('span[name="cotizacion[montos_custom][delta]"]').number(true, 2, ',', '.');
			$('span[name="cotizacion[montos_custom][gasto_of]"]').number(true, 2, ',', '.');
			$('span[name="cotizacion[montos_custom][resultado_evento]"]').number(true, 2, ',', '.');

			$('span[name="cotizacion[montos_custom][ejecutivo_ca]"]').number(true, 2, ',', '.');
			$('span[name="cotizacion[montos_custom][ejecutivo_resultado]"]').number(true, 2, ',', '.');

			$('span[name="cotizacion[montos_custom][total_comision_ejecutivo]"]').number(true, 2, ',', '.');

			$('span[name="cotizacion[montos_custom][dif_ca_empresa]"]').number(true, 2, ',', '.');

			$('span[name="cotizacion[montos_custom][resultado_final]"]').number(true, 2, ',', '.');

			$('span[name="cotizacion[montos_custom][saldo]"]').number(true, 2, ',', '.');
		}

		$('span[name="cotizacion[montos_custom][gasto_of_ratio]"]').number(true, 2, ',', '.');
		$('span[name="cotizacion[montos_custom][ejecutivo_ca_ratio]"]').number(true, 2, ',', '.');
		$('span[name="cotizacion[montos_custom][ejecutivo_resultado_ratio]"]').number(true, 2, ',', '.');
		$('span[name="cotizacion[montos_custom][diferencia_ca_ratio]"]').number(true, 2, ',', '.');
		$('span[name="cotizacion[montos_custom][resultado_final_ratio]"]').number(true, 2, ',', '.');

		if (!unaBase.doc.modoCine) {
			totales.updateAjuste();
			calculaInformativos()
		}

	},
	utilities: {
		multiArrayObjectSearch: (dataset, attribute, value, distinct) => {
			var indices = [];
			for (var i = 0, len = dataset.length; i < len; i++) {
				if (distinct) {
					if (typeof dataset[i][attribute] !== 'undefined' && dataset[i][attribute] !== value) {
						indices.push(i);
					}
				} else {
					if (dataset[i][attribute] === value) {
						indices.push(i);
					}
				}
			}
			return indices;
		},
		fastArrayObjectSearch: (dataset, attribute, value, distinct) => {
			for (var i = 0, len = dataset.length; i < len; i++) {
				if (distinct) {
					if (typeof dataset[i][attribute] !== 'undefined' && dataset[i][attribute] !== value) {
						return i;
					}
				} else {
					if (dataset[i][attribute] === value) {
						return i;
					}
				}
			}
			return -1;
		}

	}




}



//----------------------------------------------------------------
//----------------------------- INIT FUNCTION------------------------------
//----------------------------------------------------------------

async function setInitTotals() {

	let config = {

		method: 'get',
		url: `https://${window.location.host}/4DACTION/_V3_getSummaryByNegocio?id=${unaBase.doc.id}`,
		async: false

	};

	try {
		let res = await axios(config);
		totales.summaryNegocioData = res.data;
		return res;
	} catch (err) {
		throw err;
	}







};







