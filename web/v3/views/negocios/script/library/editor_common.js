
const generarChartGasto = (data) => {
	const canvasElement = document.getElementById("gasto-chart");
	if (!canvasElement) return;
	
	// Destruir el gráfico existente si existe
	if (Chart.getChart(canvasElement)) {
		Chart.getChart(canvasElement).destroy();
	}
	
	const densityCanvas = canvasElement.getContext('2d');

	// Ordenar los datos por total
	data.sort((a, b) => parseFloat(a.total) - parseFloat(b.total));

	let data_total = [];
	let data_title = [];
	data.forEach(item => {
		if (item.total > 0) {
			data_total.push(item.total);
			data_title.push(item.categoria);
		}
	});

	let title = data_total.length === 0 ? 'Negocio sin gasto real' : 'Gasto real / categoria';

	const dynamicColors = () => {
		const r = Math.floor(Math.random() * 255);
		const g = Math.floor(Math.random() * 255);
		const b = Math.floor(Math.random() * 255);
		return `rgba(${r},${g},${b},0.5)`;
	};

	const coloR = data.map(() => dynamicColors());

	const densityData = {
		data: data_total,
		backgroundColor: coloR,
		borderColor: ['#ffff'],
		borderWidth: 1
	};

	new Chart(densityCanvas, {
		type: "doughnut",
		data: {
			labels: data_title,
			datasets: [densityData]
		},
		options: {
			responsive: true,
			tooltips: {
				enabled: true,
				callbacks: {
					label: function (tooltipItem, data) {
						const dataset = data.datasets[tooltipItem.datasetIndex];
						const total = dataset.data.reduce((sum, value) => sum + value, 0);
						const currentValue = dataset.data[tooltipItem.index];
						const percentage = Math.round((currentValue / total) * 100);
						return `${data.labels[tooltipItem.index]}: ${percentage}%`;
					}
				}
			},
			plugins: {
				legend: {
					display: false,
				},
				title: {
					display: true,
					text: title,
					padding: {
						top: 50,
						bottom: 20
					},
					font: {
						weight: 'bold'
					}
				},
				datalabels: {
					formatter: (value, context) => {
						return `${context.chart.data.labels[context.dataIndex]}: ➡${value}%`;
					},
					anchor: 'end',
					align: 'start',
					offset: (context) => {
						const index = context.dataIndex;
						const dataset = context.chart.data.datasets[0];
						const value = dataset.data[index];
						const total = dataset.data.reduce((sum, val) => sum + val, 0);
						const percentage = (value / total) * 2 * Math.PI;
						return (percentage < 1 ? 20 : 10) * (index % 2 ? 1 : -1);
					},
					clamp: true,
					borderRadius: 4,
					borderWidth: 1,
					borderColor: '#fff',
					backgroundColor: context => context.dataset.backgroundColor[context.dataIndex],
					font: {
						weight: 'bold',
						size: 16
					},
					color: '#fff'
				}
			}
		}
	});
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

		optionsTipos = tiposDocumento

		const exist = tipo && typeof tipo === 'object' ? optionsTipos.findIndex(v => v.id == tipo.id) : -1

		if (exist < 0 && tipo && typeof tipo === 'object' && tipo.id) {
			optionsTipos.push(tipo)
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

		if (exist < 0 && tipo && typeof tipo === 'object' && tipo.id) {
			let index = optionsTipos.findIndex(v => v.id == tipo.id)
			if (index >= 0) optionsTipos.splice(index, 1)
		}

		// Si no hay id especificado, usamos un fallback: data() del row o FE
		if (!id_documento) {
			const dataKey = path === 'tipo_documento' ? 'tipo-documento' : 'tipo-documento-compras';
			const dataDefaultId = htmlObject.data(dataKey);
			if (dataDefaultId) {
				id_documento = dataDefaultId;
			} else {
				const fe = optionsTipos.find(v => (v.abbr || '').toUpperCase() === 'FE')
					|| optionsTipos.find(v => (v.text || '').toLowerCase().includes('factura') && (v.text || '').toLowerCase().includes('electr'))
					|| optionsTipos.find(v => /factura/i.test(v.text));
				if (fe) id_documento = fe.id;
			}
		}

		// Selecciona el valor y muestra su abreviatura
		if (id_documento) {
			selectObject.value = id_documento;
		}
		if (!selectObject.value) {
			// Fallback: buscar FE por abbr o por nombre
			let feId = '';
			for (let i = 0; i < selectObject.options.length; i++) {
				const opt = selectObject.options[i];
				if (opt.dataset && ((opt.dataset.abbr || '').toUpperCase() === 'FE' || ((opt.dataset.text || '').toLowerCase().includes('factura') && (opt.dataset.text || '').toLowerCase().includes('electr')))) {
					feId = opt.value;
					break;
				}
			}
			if (feId) selectObject.value = feId;
		}
		if (selectObject.selectedIndex > 0) {
			selectObject.options[selectObject.selectedIndex].text = selectObject.options[selectObject.selectedIndex].dataset.abbr;
		}

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

var getDetail = async function (callback) {
	console.warn("---------- CARGA VALORES EN ITEMS getDetail from /editor_common");
	unaBase.ui.block();
	let config = {
		url: `${location.origin}/4DACTION/_V3_getItemByCotizacion?${$('section.sheet').data('id')}`,
		method: 'post'
	};

	await axios(config)
		.then(data => {

			data = data.data;
			// guarda todos los items en business.item.docs(array de objectos)
			business.item.set(data);
			// Ver si se activa modo offline
			if (data.rows.length >= modoOfflineCantItems && access._584 && (access._528 || autoriza_modificacion)) {

				if (!modoOfflineRemember) {
					var nombre = $('html > body.menu.home > aside > div > div > h1').text().split(' ')[0].capitalize();
					confirm("Hola " + nombre + ",<br><br>estás trabajando en un negocio que tiene más de " + modoOfflineCantItems.toString() + " ítems.<br><br>¿Deseas habilitar el modo offline para agilizar el proceso de cotizar?<br><br><label><input type=\"checkbox\" name=\"modo_offline_remember\"> No volver a preguntar durante esta sesión</label>", 'Sí', 'No').done(function (data) {
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
			// comentado para permitir que el usuario active y desactive el modo rapido
			// if (modoOfflineSiempre) {
			// 	$('[data-name="offline_mode"] button').prop('disabled', true);
			// }

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
			//Obtener tipos de documentos
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



			var current;

			current = $('<tbody>');

			var tituloAnterior;
			var parentAnterior;

			var hidden_items = false;
			let data_costo_real = []
			for (var i = 0; i < data.rows.length; i++) {
				nv.items = data.rows

				var item = data.rows[i];
				// let titles_array = data.rows.filter(i => i.titulo);
				// let title_quantity = titles_array.length;
				var htmlObject, margen_compra, margen_venta;



				if (item.titulo) {

					let dat_ = { categoria: item.nombre_categoria, total: item.costo.real.subtotal }

					data_costo_real.push(dat_)

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

					tituloAnterior = htmlObject;
					if (typeof item.categoria != 'undefined')
						htmlObject.data('categoria', item.categoria.id);
					htmlObject.find('[name="item[][ocultar_print]"]').prop('checked', item.ocultar_print);
					htmlObject.data('observacion', item.observacion);
					
					// Asignar ID y nombre a la categoría
					htmlObject.data('id', item.id);
					htmlObject[0].dataset.id = item.id;
					var nombreInput = htmlObject.find('input[name="item[][nombre]"]');
					nombreInput.val(item.nombre);
				}
				else if (item.isParent) {

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
						htmlObject.find('[name="item[][tipo_documento]"]').prop('readonly', true);
						htmlObject.find('[name="item[][tipo_documento_compras]"]').prop('readonly', true);

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
						htmlObject.find('[name="item[][tipo_documento_compras]"]').prop('readonly', true);

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

						if (item.hora_extra.cantidad > 0)
							htmlObject.find('[name="item[][precio_unitario]"]').prop('readonly', true)

						htmlObject.data('formula-horas-extras', true);
						// htmlObject.find('[name="item[][costo_unitario]"]').prop('readonly', true);
						// // Bloquear nombre, tipo documento y cantidades
						// htmlObject.find('[name="item[][nombre]"]').prop('readonly', true);
						// htmlObject.find('button.show.item').invisible();
						// htmlObject.find('[name="item[][tipo_documento]"]').prop('readonly', true);
						// htmlObject.find('[name="item[][tipo_documento_compras]"]').prop('readonly', true);

						htmlObject.find('button.show.tipo-documento').hide();
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
					htmlObject.data('hora-extra-valor', item.hora_extra.valor);
					if (item.director_internacional) {
						htmlObject.data('director-internacional', true);
					} else {
						htmlObject.removeData('director-internacional');
					}

					//DESACTIVA BOTONERA
					if (item.porcentaje_monto_total || item.formula_productor_ejecutivo || item.formula_asistente_produccion) {
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

					//htmlObject.find('input[name="item[][tipo_documento]"]').val('FE');
					htmlObject.find('input[name="item[][tipo_documento_compras]"]').val('FE');
					if (typeof item.tipo_documento != 'undefined' && item.tipo_documento.id != 30 && item.tipo_documento.id != 33) {
						htmlObject.data('tipo-documento', item.tipo_documento.id);

						htmlObject.find('input[name="item[][tipo_documento]"]').val(item.tipo_documento.abbr);
						htmlObject.find('input[name="item[][tipo_documento_compras]"]').val(item.tipo_documento.abbr);

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
					if (!access._528) {

						if (v3_mod_gastop_compras_cerradas) {
							if (!cerradoCompras) {
								htmlObject.find('[name="item[][costo_unitario]"]').prop('readonly', true);
								htmlObject.find('[name="item[][subtotal_costo]"]').prop('readonly', true);
							} else {
								htmlObject.find('[name="item[][costo_unitario]"]').prop('readonly', false);
								htmlObject.find('[name="item[][subtotal_costo]"]').prop('readonly', false);
							}
						}
					}
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

					//ITEMS


					htmlObject = getElement.item('appendTo', current);
					htmlObject.uniqueId(); // Logs tiempo real
					try {
						htmlObject[0].dataset.producto = item?.producto.id;
					} catch (err) {
						console.log(err);
					}

					if (unaBase.parametros.btn_sica && item.producto) {
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
							let btn3 = createButtonWithIcon('actual');
							htmlObject[0].children[8].insertBefore(btn1, htmlObject[0].children[8].children[0]);
							htmlObject[0].children[10].insertBefore(btn2, htmlObject[0].children[10].children[0]);
							htmlObject[0].children[14].insertBefore(btn3, htmlObject[0].children[14].children[0]);


						} else {

							htmlObject[0].children[8].children[0].style.marginLeft = "22px"
						}
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

						//htmlObject.find('[name="item[][nombre]"]').prop('readonly', true);
						htmlObject.find('button.show.item').invisible();
						htmlObject.find('[name="item[][cantidad]"]').prop('readonly', true);
						htmlObject.find('[name="item[][factor]"]').prop('readonly', true);
						htmlObject.find('[name="item[][tipo_documento]"]').prop('readonly', true);
						htmlObject.find('[name="item[][tipo_documento_compras]"]').prop('readonly', true);


					} else {
						htmlObject[0].dataset.auto_percent = false
					}

					// Fórmula productor ejecutivos
					if (item.formula_productor_ejecutivo) {
						htmlObject[0].dataset.formula_productor_ejecutivo = true

						htmlObject.data('formula-productor-ejecutivo', true);
						htmlObject.data('formula-productor-ejecutivo-ratio', item.formula_productor_ejecutivo_ratio);
						htmlObject.find('[name="item[][precio_unitario]"]').prop('readonly', true);
						// Bloquear nombre, tipo documento y cantidades
						htmlObject.find('[name="item[][nombre]"]').prop('readonly', true);
						htmlObject.find('button.show.item').invisible();

						//htmlObject.find('[name="item[][tipo_documento]"]').prop('readonly', true);
						//htmlObject.find('button.show.tipo-documento').hide();
						htmlObject.find('[name="item[][factor]"]').prop('readonly', true);
					} else {
						htmlObject[0].dataset.formula_productor_ejecutivo = false

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
						htmlObject.find('[name="item[][tipo_documento_compras]"]').prop('readonly', true);

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
						if (item.hora_extra.cantidad > 0)
							htmlObject.find('[name="item[][precio_unitario]"]').prop('readonly', true)

						htmlObject.data('formula-horas-extras', true);
						// htmlObject.find('[name="item[][costo_unitario]"]').prop('readonly', true);
						// // Bloquear nombre, tipo documento y cantidades
						// htmlObject.find('[name="item[][nombre]"]').prop('readonly', true);
						// htmlObject.find('button.show.item').invisible();
						// htmlObject.find('[name="item[][tipo_documento]"]').prop('readonly', true);
						// htmlObject.find('[name="item[][tipo_documento_compras]"]').prop('readonly', true);

						htmlObject.find('button.show.tipo-documento').hide();
						htmlObject.find('button.show.tipo-documento-compras').hide();
					} else {
						htmlObject.removeData('formula-horas-extras');
						htmlObject.find('[name="item[][horas_extras]"]').val(0).parentTo('td').invisible();
						htmlObject.find('td.horas-extras').invisible();
					}


					//FIX IMPONIBLE COMPRAS
					let bi_compras = item.hora_extra.base_imponible_compras
					if (item.hora_extra.base_imponible_compras == 0 && item.costo.presupuestado.unitario != 0) {
						let multiplicacion = item.tipo_documento_compras.inverse

						let valor_usd = item.tipo_documento_compras.valor_usd
						let valor_moneda_ex = item.tipo_documento_compras.valor_moneda
						let valor_cotizado = 0
						let valor_a_cotizar = item.costo.presupuestado.unitario
						let impuesto = item.tipo_documento_compras.ratio
						if (impuesto > 0) {

							if (multiplicacion) {
								// Impuesto extranjero
								if (valor_usd)
									valor_cotizado = (valor_a_cotizar * (1 - impuesto)) / valor_moneda_ex;
								else
									valor_cotizado = valor_a_cotizar * (1 - impuesto);
							} else
								valor_cotizado = valor_a_cotizar / (1 + impuesto);

							bi_compras = valor_cotizado

						} else
							bi_compras = item.costo.presupuestado.unitario

					}


					htmlObject.data('hora-extra-enabled', item.hora_extra.enabled);
					htmlObject.data('hora-extra-factor', item.hora_extra.factor);
					htmlObject.data('hora-extra-jornada', item.hora_extra.jornada);
					htmlObject.data('base-imponible', item.hora_extra.base_imponible / exchange_rate);
					htmlObject.data('base-imponible-compras', bi_compras / exchange_rate);
					htmlObject.data('hora-extra-dias', item.hora_extra.dias);
					htmlObject.data('original-value', item.hora_extra.base_imponible / exchange_rate);

					if (item.director_internacional) {
						htmlObject.data('director-internacional', true);
					} else {
						htmlObject.removeData('director-internacional');
					}

					//DESACTIVA BOTONERA
					if (item.porcentaje_monto_total || item.formula_productor_ejecutivo || item.formula_asistente_produccion) {
						htmlObject.find('.remove.item').remove();
						htmlObject.find('.insert.item').remove();
						htmlObject.find('.clone.item').remove();
						//simon 29/11/18
						htmlObject.find('.parent.item').remove();
						htmlObject.find('.ui-icon-arrow-4').remove();
					}

					// ocultar decimales en costo unitario
					//Paramtro para copiar el valor unitario de venta a costo
					const costo_unitario = unaBase.parametros.valorventa_mismo_valorcosto ? item.precio.unitario : item.costo.presupuestado.unitario

					htmlObject.find('[name="item[][costo_unitario]"]').val(costo_unitario / exchange_rate).data('old-value', costo_unitario / exchange_rate);

					htmlObject.find('[name="item[][costo_unitario_previo]"]').val(item.costo.previo.unitario / exchange_rate).data('old-value', item.costo.previo.unitario / exchange_rate);
					htmlObject.find('[name="item[][subtotal_costo_previo]"]').val(item.costo.previo.subtotal / exchange_rate).data('old-value', item.costo.previo.subtotal / exchange_rate);
					htmlObject.find('[name="item[][diferencia_costo_previo]"]').val((item.precio.subtotal - item.costo.previo.subtotal) / exchange_rate).data('old-value', (item.precio.subtotal - item.costo.previo.subtotal) / exchange_rate);

					if (typeof copiar_precio_a_costo == 'boolean' && item.precio.unitario == item.costo.presupuestado.unitario) {
						htmlObject.find('[name="item[][costo_unitario]"]').data('auto', true);
					} else {

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


					if (unaBase.doc.separate_sc) {
						htmlObject.find('[name="item[][separate_sc]"]')[0].selectedIndex = htmlObject.find(`[name="item[][separate_sc]"] option[value="${item.sc_separateSelectedId}"]`)[0].index
					} else
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
						htmlObject.data('tipo-documento-compras', item.tipo_documento_compras.id);
						//htmlObject.find('input[name="item[][tipo_documento]"]').val(item.tipo_documento.abbr);
						setTipoDocumento(htmlObject, item, tiposDocumento, 'tipo_documento')
						setTipoDocumento(htmlObject, item, tiposDocumento, 'tipo_documento_compras')
						//htmlObject.find('select[name="item[][tipo_documento]"]').val(item.tipo_documento.id);
						//htmlObject.data('tipo-documento-compras', item.tipo_documento_compras.id);
						//htmlObject.find('input[name="item[][tipo_documento_compras]"]').val(item.tipo_documento_compras.abbr);



						htmlObject.data('tipo-documento-text', item.tipo_documento.text);
						htmlObject.data('tipo-documento-ratio', item.tipo_documento.ratio);

						htmlObject.data('tipo-documento-valor-usd', item.tipo_documento.valor_usd); // Impuesto extranjero
						htmlObject.data('tipo-documento-valor-usd-code', item.tipo_documento.valor_moneda_code); // Impuesto extranjero
						htmlObject.data('tipo-documento-valor-moneda', item.tipo_documento.valor_moneda.replaceAll(',', '.')); // Impuesto extranjero
						htmlObject.data('tipo-documento-inverse', item.tipo_documento.inverse);


						htmlObject.data('tipo-documento-compras-text', item.tipo_documento_compras.text);
						htmlObject.data('tipo-documento-compras-ratio', item.tipo_documento_compras.ratio);
						htmlObject.data('tipo-documento-compras-valor-usd', item.tipo_documento_compras.valor_usd); // Impuesto extranjero
						htmlObject.data('tipo-documento-compras-valor-usd-code', item.tipo_documento_compras.valor_moneda_code); // Impuesto extranjero
						htmlObject.data('tipo-documento-compras-valor-moneda', item.tipo_documento_compras.valor_moneda.replaceAll(',', '.')); // Impuesto extranjero
						htmlObject.data('tipo-documento-compras-inverse', item.tipo_documento_compras.inverse);


						//VENTA

						if (item.tipo_documento.ratio != 0 || (item.tipo_documento.ratio == 0 && item.tipo_documento.valor_usd)) {
							htmlObject.find('[name="item[][precio_unitario]"]').addClass('edited');
							htmlObject.find('button.detail.price').visible();
						} else {
							htmlObject.find('[name="item[][precio_unitario]"]').removeClass('edited');
							htmlObject.find('button.detail.price').invisible();
						}

						//COMPRA
						if (item.tipo_documento.ratio != 0 || (item.tipo_documento.ratio == 0 && item.tipo_documento.valor_usd)) {
							htmlObject.find('[name="item[][costo_unitario]"]').addClass('edited');
							htmlObject.find('button.detail.price').visible();
						} else {
							htmlObject.find('[name="item[][costo_unitario]"]').removeClass('edited');
							htmlObject.find('button.detail.price').invisible();
						}




					} else {
						htmlObject.data('tipo-documento', 33);
						htmlObject.data('tipo-documento-compras', 33);
						// htmlObject.find('input[name="item[][tipo_documento]"]').val('FE');
						// htmlObject.find('input[name="item[][tipo_documento_compras]"]').val('FE');
						setTipoDocumento(htmlObject, item, tiposDocumento, 'tipo_documento')
						setTipoDocumento(htmlObject, item, tiposDocumento, 'tipo_documento_compras')

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
						htmlObject.find('button.detail.price').invisible();
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

					if (item.costo_directo == false) {

						htmlObject.find('[name="item[][subtotal_costo_previo]"]').css('opacity', .5);
						htmlObject.find('[name="item[][diferencia_costo_previo]"]').css('opacity', .5);
						htmlObject.find('[name="item[][subtotal_costo]"]').css('opacity', .5);
						htmlObject.find('[name="item[][utilidad]"]').css('opacity', .5);
						htmlObject.find('[name="item[][subtotal_costo_real]"]').css('opacity', .5);
						htmlObject.find('[name="item[][utilidad_real]"]').css('opacity', .5);
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
						htmlObject.find('[name="item[][diferencia_costo_previo]"]').css('opacity', .1);
						htmlObject.find('[name="item[][subtotal_costo]"]').css('opacity', 1);
						htmlObject.find('[name="item[][utilidad]"]').css('opacity', 1);
						htmlObject.find('[name="item[][subtotal_costo_real]"]').css('opacity', 1);
						htmlObject.find('[name="item[][utilidad_real]"]').css('opacity', 1);
					}

					// Bloquear edición de gasto presupuestado solo si el ítem no está cerrado para compras, en caso de tener el parámetro activado
					if (!access._528) {

						if (v3_mod_gastop_compras_cerradas) {
							if (!cerradoCompras) {
								htmlObject.find('[name="item[][costo_unitario]"]').prop('readonly', true);
								htmlObject.find('[name="item[][subtotal_costo]"]').prop('readonly', true);
							} else {
								htmlObject.find('[name="item[][costo_unitario]"]').prop('readonly', false);
								htmlObject.find('[name="item[][subtotal_costo]"]').prop('readonly', false);
							}
						}
					}

				}


				//AQUI
				htmlObject.find('button.detail.item').prop('title', item.nombre);
				htmlObject.find('[name="item[][subtotal_precio]"]').val(item.precio.subtotal / exchange_rate).data('old-value', item.precio.subtotal / exchange_rate);
				htmlObject.find('[name="item[][subtotal_costo]"]').val(item.costo.presupuestado.subtotal / exchange_rate).data('old-value', item.costo.presupuestado.subtotal / exchange_rate);;
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
				var nombreInput = htmlObject.find('input[name="item[][nombre]"]');
				nombreInput.val(item.nombre);
				nombreInput.data('nombre-original', item.text);
				
				// Guardar el valor del nombre para restaurarlo si el autocomplete no encuentra resultados
				if (item.nombre && item.nombre.trim() !== '') {
					nombreInput.data('before-search-value', item.nombre);
					console.log('[getDetail] Guardando valor inicial del nombre:', item.nombre);
				}
				
				// Si el item ya tiene ID (fue guardado) y NO es una categoría (title o itemParent), bloquear el campo nombre
				if (item.id && !item.titulo && !item.isParent) {
					nombreInput.prop('readonly', true);
					nombreInput.attr('readonly', 'readonly');
					nombreInput.css({
						'pointer-events': 'none',
						'background-color': '#f5f5f5',
						'cursor': 'not-allowed',
						'opacity': '0.7'
					});
					nombreInput.attr('data-original-value', item.nombre || item.text);
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
				// 	<p>' + item.text + '</p> \
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
								<p>' + ((item.observacion != '') ? item.observacion.replace(/\n/g, '</p><p>') : 'N/A') + '</p> \
							';
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


			$('section.sheet table.items tbody').replaceWith(current);

			var items = $('section.sheet table.items > tbody > tr:not(.title)').length;
			$('section.sheet table.items > tfoot > tr .info:eq(0)').html(items + ' ítem' + ((items > 1) ? 's' : ''));

			if (hidden_items)
				$('table.items > tfoot').invisible();


			if (typeof tituloAnterior != 'undefined') {

				updateSubtotalTitulos(tituloAnterior, "line 2765 editor library");

				tituloAnterior = undefined;
			}

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

			if ($('#main-container').data('closed-ventas') || $('#main-container').data('closed')) {
				// ;
				//$('button.actions.items').hide();
				$('tr button.add').hide();
				$('tr button.clone').hide();
				$('tr button.remove').hide();
				$('tr button.insert').hide();
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
				//simon 13julio2017 oculta botones de duplicar, añadir y bloquea modificar montos.
				$('input[name="item[][margen_venta]"]').prop('disabled', true);
				$('section.sheet:not(.staff)').find('input, textarea, tr button:not(.toggle, .detail.item), tr span').prop('disabled', true); // bloquear mientras se espera validación
				$('section.sheet:not(.staff)').find('tr.collapsed').removeClass('collapsed'); // expandir ítems contraídos al bloquear
				//simon 13julio2017 FIX no oculta boton carpeta expandir
				//simon 23enero2019 muestra hoja abrir detalle de item incluso estando cerrado el negocio
				// $('section.sheet:not(.staff)').find('tr button:not(.toggle), tr span.ui-icon, ul.editable button, footer button:not(.approve):not(.reject)').hide();
				$('section.sheet:not(.staff)').find('tr button:not(.toggle, .detail.item), tr span.ui-icon, ul.editable button, footer button:not(.approve):not(.reject)').hide();

				//simon 23enero2019
				$('section.sheet:not(.staff)').find('tr button.toggle').show();
			} else {
				setTimeout(function () {

					if (access._528) {
						//REAPER --> COMMENT bloquea lineas tr td inputs
						//MODIFICADO
						document.querySelectorAll('table.items.cotizacion tr.item').forEach(e => {

							$(e).find('button.add').show();
							$(e).find('button.clone').show();
							$(e).find('button.remove').show();
							$(e).find('button.insert').show();

							if (e.dataset.auto_percent == "false") {

								$(e).find('input[name="item[][tipo_documento]"]').prop('readonly', false);
								$(e).find('input[name="item[][tipo_documento]"]').closest('td').find('button').show();
								$(e).find('input[name="item[][tipo_documento_compras]"]').prop('readonly', false);
								$(e).find('input[name="item[][tipo_documento_compras]"]').closest('td').find('button').show();
								$(e).find('input[name="item[][cantidad]"]').prop('readonly', false);
								$(e).find('input[name="item[][factor]"]').prop('readonly', false);
								$(e).find('input[name="item[][horas_extras]"]').prop('readonly', false);

								if ($(e).find('input[name="item[][horas_extras]"]').val() == 0)
									$(e).find('input[name="item[][precio_unitario]"]').prop('readonly', false);

								if (!access._528) {
									$(e).find('input[name="item[][costo_unitario]"]').prop('readonly', false);
									$(e).find('input[name="item[][subtotal_costo]"]').prop('readonly', false);
								}
							}

							if ($(e).find('input[name="item[][ocultar_print]"]').prop('checked')) {
								const subTotal = $(e).find('input[name="item[][subtotal_precio]"]').val();
								if (subTotal > 0) $(e).find('input[name="item[][ocultar_print]"]').prop('checked', false);
								else {
									$(e).find('input[name="item[][cantidad]"]').prop('readonly', true);
									$(e).find('input[name="item[][factor]"]').prop('readonly', true);
									$(e).find('input[name="item[][precio_unitario]"]').prop('readonly', true)
								}
							}
						})


						//simon 13julio2017 oculta botones de duplicar, añadir y bloquea modificar montos.
						$('input[name="item[][margen_venta]"]').prop('disabled', false);
						$('section.sheet:not(.staff)').find('input, textarea, tr button, tr span').prop('disabled', false); // bloquear mientras se espera validación
						// $('section.sheet:not(.staff)').find('tr.collapsed').removeClass('collapsed'); // expandir ítems contraídos al bloquear
						//simon 13julio2017 FIX no oculta boton carpeta expandir
						$('section.sheet:not(.staff)').find('tr button, tr span.ui-icon:not([name="item[][closed_compras]"]), ul.editable button, footer button:not(.approve):not(.reject)').show();

					}




				}, 200)
			}

			generarChartGasto(data_costo_real)
			unaBase.ui.unblock();

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

			if (unaBase.parametros.ocultar_seccion_sc) {
				document.querySelector('.seleccion-sc').style.display = 'none';
				document.querySelector('.aplica-sobrecargo').style.display = 'none';
				document.querySelector('.costo-interno').style.display = 'none';
				document.querySelector('.ocultar-print').style.display = 'none';
				document.querySelector('.table-budget tfoot th:last-child').style.display = 'none';
			}


		})
		.then(res => {

			sobrecargos.fillSCCategorias()
		})
		.then(res => {

			updateSubtotalItems();
			// if(!unaBase.doc.modoCine){
			// totales.updateSubtotalNeto();
			// }

			if (!unaBase.reaperMode) {
				totales.updateSubtotalNeto();

				//PARA CALCULAR SOBRECARGOS A TOTALES
				$('[name^="sobrecargo"][name$="[porcentaje]"]').trigger('blur')
			} else {
				sobrecargos.updateSobrecargos()
			}
		})
		.catch(err => {
			console.log(err)
			unaBase.ui.unblock();

			toastr.error('No se pudieron mostrar los items de la cotización');

			// manejar esta situación
		});

};








var getElement = {
	titulo: function (functor, element) {
		let sc_td = '';
		sc_td += `<th colspan="1" ${unaBase.parametros.ocultar_seccion_sc ? 'style="display: none;"' : ''}></th> 
    <th ${unaBase.parametros.ocultar_seccion_sc ? 'style="display: none;"' : ''}></th> 
    <th class="ocultar-print" ${unaBase.parametros.ocultar_seccion_sc ? 'style="display: none;"' : ''}><input name="item[][ocultar_print]" type="checkbox" value="true"></th> 
    <th ${unaBase.parametros.ocultar_seccion_sc ? 'style="display: none;"' : ''}></th>`;


		let addSubCategoria = '<button class="ui-icon ui-icon-circle-arrow-s add parent" title="Añadir subcategoría"></button>';
		let htmlObject = $(' \
			<tr class="title" data-categoria="0"> \
				<th style="min-width: 120px !important;padding-left: 9px;"> \
					<span class="move item" title="Mover ítem" style="vertical-align: text-top; padding-right: 8px;"><i class="fas fa-arrows" ></i></span>\
					<input style="width: auto !important;vertical-align: top !important;display: inherit;" name="item[][selected]" type="checkbox" value="true"> \
					<button class="ui-icon ui-icon-minus remove categoria" title="Quitar categoría"></button> \
					<button class="ui-icon ui-icon-circle-plus add categoria" title="Agregar categoría debajo" data-help="Haga clic en este botón para añadir un ítem a la categoría creada"></button> \
					<button class="ui-icon ui-icon-plus add item" title="Insertar ítem bajo el título"></button> \
					<button class="ui-icon ui-icon-copy clone categoria" title="Duplicar categoría"></button> </th>\
				<th><button class="ui-icon ui-icon-folder-open toggle categoria" title="Contraer o expandir título"></button>  '+ ((access._647) ? addSubCategoria : '') + '</th> \
				<th style="min-width: 150px;"><div style="display: flex; align-items: center;"><input name="item[][nombre]" type="search" value="" placeholder="Buscar categoría por nombre..."><!-- <button class="show categoria">Ver categorías</button> --><button class="ui-icon ui-icon-document detail categoria" title="Detalle">Detalle</button><button class="ui-icon ui-icon-plus add all-items"></button></div></th> \
				<th class="tipo-documento"></th> \
				<th class="info"></th> \
				<th style="' + (!showUnidad ? 'display:none;' : '') + '" class="unidad"></th> \
				<th class="segunda-cantidad"></th> \
				<th class="horas-extras numeric qty abs"><input name="item[][horas_extras]" class="number" min="0" max="9999" value=""></th> \
				<th class="venta"></th> \
				<th class="numeric currency venta">' + localCurrency + ' <span><input readonly name="item[][subtotal_precio]" type="text" value="0"></span> <span class="info" style="display: none !important;"></span></th> \
				<th class="costo previo unitario"></th> \
				<th class="numeric currency costo previo presupuestado">' + localCurrency + ' <span><input readonly name="item[][subtotal_costo_previo]" type="text" value="0"></span></th> \
				<th class="numeric currency utilidad previo presupuestado">' + localCurrency + ' <span><input readonly name="item[][diferencia_costo_previo]" type="text" value="0"></span></th> \
				<th class="tipo-documento"></th> \
				<th class="costo unitario"></th> \
				<th class="numeric currency costo presupuestado">' + localCurrency + ' <span style="font-weight: bolder;"><input readonly name="item[][subtotal_costo]" type="text" value="0"></span></th> \
				<th class="numeric currency utilidad presupuestado">' + localCurrency + ' <span><input readonly name="item[][utilidad]" type="text" value="0"></span></th> \
				<th class="numeric percent margen-desde-venta margen presupuestado"><span><input name="item[][margen_venta]" type="text" value="0"> %</span></th> \
				<th class="numeric percent margen-desde-compra margen presupuestado"><span><input name="item[][margen_compra]" type="text" value="0"> %</span></th> \
				<th class="numeric currency costo real adquisicion">' + localCurrency + ' <span><input readonly name="item[][subtotal_costo_real]"></span></th> \
				<th class="numeric currency utilidad real adquisicion">' + localCurrency + ' <span><input readonly name="item[][utilidad_real]"></span></th> \
				<th class="numeric percent margen-desde-venta margen real adquisicion"><span><input readonly name="item[][margen_venta_real]"> %</span></th> \
				<th class="numeric percent margen-desde-compra margen real adquisicion"><span><input readonly name="item[][margen_compra_real]"> %</span></th> \
				<th class="numeric currency adquisicion eficiencia">' + localCurrency + ' <span><input readonly name="item[][diferencia]"></span></th> \
				<th class="numeric percent adquisicion eficiencia"><span><input readonly name="item[][diferencia_ratio]"> %</span></th> \
				' + sc_td + '\
			</tr> \
		');

		htmlObject.find('input.number').number(true, 1, ',', ''); // Quitar flecha de campos tipo number

		let target = $(event.target).parentTo('tr');

		if ($(event.target).prop('name') == 'item[][nombre]')
			target.find('button.detail.item').prop('title', target.find('[name="item[][nombre]"]').val());
		htmlObject[functor](element);

		if (typeof selected_currency == 'undefined')
			htmlObject.find('.numeric.currency input').number(true, currency.decimals, ',', '.');
		else
			htmlObject.find('.numeric.currency input').number(true, currency.decimals, ',', '.');

		htmlObject.find('.numeric.percent input').number(true, currency.decimals, ',', '.');


		htmlObject.draggable({
			helper: 'clone',
			containment: 'tbody',
			start: function (event, ui) {

				let dragSource = $(event.target).nextUntil('.title');
				let width = dragSource.width();
				let height = dragSource.height()

				dragSource.addClass('moving-src');

				updateSubtotalTitulos($(event.target), "line 66 editor library");
				//simon itemparent start

				if (target[0] && !target[0].classList.contains('title')) {
					updateSubtotalParents($(event.target));
				}
				//simon itemparent end

				// FIXME: el helper no responde a cambios en el width
				ui.helper.width(width);
				ui.helper.height(height);
				$(event.target).trigger('beforeMove'); // Logs tiempo real
			},
			revert: function (event, ui) {
				$('.moving-src').removeClass('moving-src');
			}
		});

		htmlObject.droppable({
			hoverClass: 'ui-state-active',
			accept: 'table.items > tbody > tr',
			drop: function (event, ui) {

				let itemToMove = ui.draggable;
				let itemReceiver = event.target;
				let dragTarget = $(itemReceiver).nextUntil('.title');
				$(itemReceiver).after(itemToMove);
				if (itemToMove.hasClass('title')) {
					dragTarget.addClass('moving-dst');
					itemToMove.insertAfter($(itemReceiver));
					$('.moving-src').removeClass('moving-src').insertAfter(itemToMove);
					$('.moving-dst').removeClass('moving-dst').insertAfter($(itemReceiver));

				} else {
					itemToMove.insertAfter($(itemReceiver));
				}
				$(itemToMove).trigger('afterMove'); // Logs tiempo real


				//simon itemparent start

				if (itemToMove[0].classList.contains('childItem')) {
					itemToMove[0].classList.remove('childItem');
					itemToMove[0].classList.add('item');
					itemToMove[0].dataset.itemparent = "";
				} else if (itemToMove[0].classList.contains('itemParent')) {
					let parentKey = itemToMove.data('id');
					let parentId = itemToMove[0].id;

					if (typeof parentKey !== 'undefined') {
						let items = document.querySelectorAll(`tr[data-itemparent="${parentKey}"`);

						for (const item of items) {
							$(item).insertAfter(itemToMove)
						}
					} else if (typeof parentId !== 'undefined') {
						let items = document.querySelectorAll(`tr[data-parentId="${parentId}"`);
						for (const item of items) {
							$(item).insertAfter(itemToMove)
						}

					}

				}

				//simon itemparent end
			}
		});

		return htmlObject;
	},
	itemParent: function (functor, element) {
		let sc_td = '';
		sc_td += `<td colspan="1" ${unaBase.parametros.ocultar_seccion_sc ? 'style="display: none;"' : ''}></td> 
    <td ${unaBase.parametros.ocultar_seccion_sc ? 'style="display: none;"' : ''}></td> \
    <td class="ocultar-print" ${unaBase.parametros.ocultar_seccion_sc ? 'style="display: none;"' : ''}><input name="item[][ocultar_print]" type="checkbox" value="true"></td>
    <td ${unaBase.parametros.ocultar_seccion_sc ? 'style="display: none;"' : ''}><input name="item[][selected]" type="checkbox" value="true"></td>`;

		let htmlObject = $(' \
			<tr class="itemParent" data-producto="0" data-categoria="0"> \
				<td style="min-widtd: 120px !important; padding-left: 9px;"> \
					<span class="move item popo" title="Mover ítem" style="vertical-align: text-top; padding-right: 8px;"><i class="fas fa-arrows"></i></span>\
					<button class="ui-icon ui-icon-minus remove itemParent" title="Quitar categoría"></button> \
					<button class="ui-icon ui-icon-plus add item" title="Insertar ítem bajo el título"></button> \
					<button class="ui-icon ui-icon-copy clone categoria" title="Duplicar categoría"></button> \
				<td><button class="ui-icon ui-icon-folder-open toggle categoria" title="Contraer o expandir título"></button></td> \
				<td style="min-width: 150px;display: flex;"><input name="item[][nombre]" type="search" value="" placeholder="Buscar categoría por nombre..."><button class="ui-icon ui-icon-plus add all-items"><!-- <button class="show categoria">Ver categorías</button> --><button class="ui-icon ui-icon-document detail categoria" title="Detalle">Detalle</button></td> \
				<td class="tipo-documento"></td> \
				<td class="info"></td> \
				<td style="' + (!showUnidad ? 'display:none;' : '') + '" class="unidad"></td> \
				<td class="segunda-cantidad"></td> \
				<td class="horas-extras numeric qty abs"><input name="item[][horas_extras]" class="number" min="0" max="9999" value=""></td> \
				<td class="venta"></td> \
				<td class="numeric currency venta">' + localCurrency + ' <span><input readonly name="item[][subtotal_precio]" type="text" value="0"></span> <span class="info" style="display: none !important;"></span></td> \
				<td class="costo previo unitario"></td> \
				<td class="numeric currency costo previo presupuestado">' + localCurrency + ' <span><input readonly name="item[][subtotal_costo_previo]" type="text" value="0"></span></td> \
				<td class="numeric currency utilidad previo presupuestado">' + localCurrency + ' <span><input readonly name="item[][diferencia_costo_previo]" type="text" value="0"></span></td> \
				<td class="tipo-documento"></td> \
				<td class="costo unitario"></td> \
				<td class="numeric currency costo presupuestado">' + localCurrency + ' <span style="font-weight: bolder;"><input readonly name="item[][subtotal_costo]" type="text" value="0"></span></td> \
				<td class="numeric currency utilidad presupuestado">' + localCurrency + ' <span><input readonly name="item[][utilidad]" type="text" value="0"></span></td> \
				<td class="numeric percent margen-desde-venta margen presupuestado"><span><input name="item[][margen_venta]" type="text" value="0"> %</span></td> \
				<td class="numeric percent margen-desde-compra margen presupuestado"><span><input name="item[][margen_compra]" type="text" value="0"> %</span></td> \
				<td class="numeric currency costo real adquisicion">' + localCurrency + ' <span><input readonly name="item[][subtotal_costo_real]"></span></td> \
				<td class="numeric currency utilidad real adquisicion">' + localCurrency + ' <span><input readonly name="item[][utilidad_real]"></span></td> \
				<td class="numeric percent margen-desde-venta margen real adquisicion"><span><input readonly name="item[][margen_venta_real]"> %</span></td> \
				<td class="numeric percent margen-desde-compra margen real adquisicion"><span><input readonly name="item[][margen_compra_real]"> %</span></td> \
				<td class="numeric currency adquisicion eficiencia">' + localCurrency + ' <span><input readonly name="item[][diferencia]"></span></td> \
				<td class="numeric percent adquisicion eficiencia"><span><input readonly name="item[][diferencia_ratio]"> %</span></td> \
				' + sc_td + '\
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
			start: function (event, ui) {

				let dragSource = $(event.target).nextUntil('.itemParent, .title');
				let width = dragSource.width();
				let height = dragSource.height()

				dragSource.addClass('moving-src');

				updateSubtotalTitulos($(event.target), "line 199 editor library");

				//simon itemparent start
				// updateSubtotalParents($(event.target));
				//simon itemparent end
				// FIXME: el helper no responde a cambios en el width
				ui.helper.width(width);
				ui.helper.height(height);
				$(event.target).trigger('beforeMove'); // Logs tiempo real
			},
			stop: function (event, ui) {

				updateSubtotalTitulos($(event.target), "line 210 editor library");

				//simon itemparent start

				updateSubtotalParents($(event.target));

				//simon itemparent end
			},
			revert: function (event, ui) {
				$('.moving-src').removeClass('moving-src');
			}
		});

		htmlObject.droppable({
			hoverClass: 'ui-state-active',
			accept: 'table.items > tbody > tr',
			drop: function (event, ui) {
				let itemToMove = ui.draggable;
				let itemReceiver = event.target;
				if (!ui.draggable.hasClass('title') && !ui.draggable.hasClass('itemParent')) {

					let dragTarget = $(event.target).nextUntil('.itemParent, .title');

					$(event.target).after(ui.draggable);

					if (ui.draggable.hasClass('itemParent')) {
						dragTarget.addClass('moving-dst');
						ui.draggable.insertAfter($(event.target));
						$('.moving-src').removeClass('moving-src').insertAfter(ui.draggable);
						$('.moving-dst').removeClass('moving-dst').insertAfter($(event.target));

					} else {
						ui.draggable.insertAfter($(event.target));
					}
					$(ui.draggable).trigger('afterMove'); // Logs tiempo real

					//simon itemparent start
					if (event.target.classList.contains('itemParent')) {
						ui.draggable[0].classList.add('childItem');
						ui.draggable[0].classList.remove('item');
						ui.draggable[0].dataset.itemparent = $(event.target).data('id')
						ui.draggable.find('.parent.item').hide();
					}
					//simon itemparent end
				} else if (ui.draggable.hasClass('itemParent')) {


					let dragTarget = null;
					if (itemReceiver.classList.contains('itemParent')) {
						let idSubCat = `#${event.target.id}`;
						dragTarget = $(idSubCat).nextUntil('.itemParent');
					} else {
						dragTarget = $(event.target).nextUntil('.title,.item,.itemParent');

					}
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

					if (ui.draggable[0].classList.contains('childItem')) {
						ui.draggable[0].classList.remove('childItem');
						ui.draggable[0].classList.add('item');
						ui.draggable[0].dataset.itemparent = "";
					} else if (ui.draggable[0].classList.contains('itemParent')) {
						let parentKey = ui.draggable.data('id');
						let items = document.querySelectorAll(`tr[data-itemparent="${parentKey}"`);
						for (const item of items) {
							$(item).insertAfter(ui.draggable)
						}

					}
				}
			}
		});

		return htmlObject;
	},
	item: function (functor, element) {
		//<td class="tipo-documento"><input type="text" style="margin-left: 20px;" disabled name="item[][tipo_documento]"><button class="ui-icon ui-icon-carat-1-s show tipo-documento">Ver tipos de documento</button></td>
		// let addSubCategoria = '<button class="ui-icon  ui-icon-circle-arrow-e parent item" title="convertir a subcategoría"></button>';
		//<td class="tipo-documento"><select class="form-select tipo-documento-select"><option selected>Tipo doc</option></select></td>

		let sc_td = "";

		if (unaBase.doc.separate_sc) {
			let options = '<option value="0"></option>';
			sobrecargos.separate.forEach(s => {
				options += `<option value="${s.id}">${s.name}</option>`;
			});
			sc_td = `<td class="separate_sc" ${unaBase.parametros.ocultar_seccion_sc ? 'style="display: none;"' : ''}><select class="form-select separate_sc-select" name="item[][separate_sc]" style="max-width: 100px;">${options}</select></td>`;
		} else {
			sc_td = `<td class="fit aplica-sobrecargo" ${unaBase.parametros.ocultar_seccion_sc ? 'style="display: none;"' : ''}><input name="item[][aplica_sobrecargo]" type="checkbox" value="true" ${aplica_sobrecargo_items ? ' checked' : ''}></td>`;
		}

		sc_td += `<td class="fit costo-interno" ${unaBase.parametros.ocultar_seccion_sc ? 'style="display: none;"' : ''}><input name="item[][costo_interno]" type="checkbox" value="true"></td>
    <td class="fit" ${unaBase.parametros.ocultar_seccion_sc ? 'style="display: none;"' : ''}><input readonly name="item[][ocultar_print]" type="checkbox" value="true"></td>
    <td class="fit" ${unaBase.parametros.ocultar_seccion_sc ? 'style="display: none;"' : ''}></td>`;


		let htmlObject = $(`
	<tr class="item" data-producto="0">
		<td style="padding-left: 9px;">
			<span class="move item popo2" title="Mover ítem" style="vertical-align: sub; padding-right: 8px;">
				<i class="fas fa-arrows" style="color: #e8eaed;"></i>
			</span>
			<input style="width: auto !important;vertical-align: top !important;display: inherit;"
				   name="item[][selected]" type="checkbox" value="true">
	
			<button class="remove item" title="Quitar ítem" style="vertical-align: sub;">
				<i class="fas fa-minus" style="color: #e8eaed;"></i>
			</button>
			<button class="insert item" title="Agregar ítem debajo" style="vertical-align: sub;">
				<i class="fas fa-plus" style="color: #e8eaed;"></i>
			</button>
			<button class="clone item" title="Duplicar ítem" style="vertical-align: sub;">
				<i class="fas fa-clone" style="color: #e8eaed;"></i>
			</button>
		</td>
	
		<td class="tab" width="150">
			<input class="tab" size="15" name="item[][codigo]" type="text" ${editCodigoItems ? "" : "readonly"}>
		</td>
	
		<td class="tab" align="right" style="display: flex;">
			<input class="tab" name="item[][nombre]" type="search"
				   placeholder="Buscar producto o servicio por código o por nombre...">
			<button class="ui-icon ui-icon-document detail item" title="Detalle">Detalle</button>
			<button class="ui-icon ui-icon-gear profile item" title="Perfil"></button>
		</td>
	
		<td class="tipo-documento">
			<select class="form-select tipo-documento-select" name="item[][tipo_documento]" style="max-width: 50px;"></select>
		</td>
	
		<td class="numeric qty tab">
			<input ${access._595 ? "readonly" : ""} name="item[][cantidad]" class="number tab" value="1" min="1" max="9999">
			<span class="unit"></span>
		</td>
	
		<td class="unidad" style="${!showUnidad ? "display:none;" : ""}">
			<input style="width: 3em;" class="tab" type="text" disabled name="item[][unidad]">
			<button class="ui-icon ui-icon-carat-1-s show unidad">Ver unidades</button>
		</td>
	
		<td class="segunda-cantidad numeric qty abs tab">
			<input ${access._595 ? "readonly" : ""} name="item[][factor]" class="number tab" value="1" min="1" max="9999">
		</td>
	
		<td class="horas-extras numeric qty abs">
			<input ${access._595 ? "readonly" : ""} name="item[][horas_extras]" class="number tab" value="0" min="0" max="9999">
		</td>
	
		<td class="numeric currency venta extended holada" style="${access._683 ? "display:none;" : ""}">
			${localCurrency}
			<span><input class="tab" name="item[][precio_unitario]" type="text" value="0"></span>
			<button class="ui-icon ui-icon-notice detail price" title="Ver detalle del precio">Ver detalle del precio</button>
		</td>
	
		<td class="numeric currency venta">
			${localCurrency}
			<span style="font-weight: bolder;">
				<input readonly name="item[][subtotal_precio]" type="text" value="0">
			</span>
			<button class="ui-icon ui-icon-calculator detail exchange-rate" title="Ver en otras monedas">Ver en otras monedas</button>
		</td>
	
		<td class="numeric currency costo previo unitario">
			${localCurrency}
			<span><input name="item[][costo_unitario_previo]" type="text" max="9999999999" value="0"></span>
		</td>
	
		<td class="numeric currency costo previo">
			${localCurrency}
			<span><input ${subtotal_gasto_p_manual ? "" : "readonly"} name="item[][subtotal_costo_previo]" type="text" value="0"></span>
		</td>
	
		<td class="numeric currency utilidad previo">
			${localCurrency}
			<span><input readonly name="item[][diferencia_costo_previo]" type="text" value="0"></span>
		</td>
	
		<td class="tipo-documento-compras">
			<select class="form-select tipo-documento-compra-select" name="item[][tipo_documento_compras]" style="max-width: 50px;"></select>
		</td>
	
		<td class="numeric currency costo presupuestado unitario tab">
			${localCurrency}
			<span><input ${access._595 ? "readonly" : ""} name="item[][costo_unitario]" class="tab" type="text" max="9999999999" value="0"></span>
		</td>
	
		<td class="numeric currency costo presupuestado subtotal">
			${localCurrency}
			<span style="font-weight: bolder;color: white;border-radius: 10px;">
				<input style="border-radius: 5px;border: 1px solid #FFDD9A;"
					${subtotal_gasto_p_manual && !access._595 ? "" : "readonly"}
					name="item[][subtotal_costo]" type="text" value="0">
			</span>
			<button class="ui-icon ui-icon-notice detail cost" title="Ver detalle del costo">Ver detalle del costo</button>
		</td>
	
		<td class="numeric currency utilidad presupuestado">
			${localCurrency}
			<span style="font-weight: bolder;border-radius: 5px;">
				<input style="color: #489a56;border-radius: 5px;" readonly name="item[][utilidad]" type="text" value="0">
			</span>
		</td>
	
		<td class="numeric percent margen-desde-venta margen presupuestado">
			<span><input ${access._595 ? "readonly" : ""} name="item[][margen_venta]" type="text" value="0"> %</span>
		</td>
	
		<td class="numeric percent margen-desde-compra margen presupuestado">
			<span><input ${access._595 ? "readonly" : ""} name="item[][margen_compra]" type="text" value="0"> %</span>
		</td>
	
		<td class="numeric currency costo real adquisicion">
			${localCurrency}
			<span style="font-weight: bolder;border-radius: 5px;">
				<input style="font-weight: bolder;border-radius: 5px;" readonly name="item[][subtotal_costo_real]" value="0">
			</span>
			<button class="ui-icon ui-icon-notice detail cost-real" title="Ver detalle del costo">Ver detalle del costo</button>
			<span name="item[][closed_compras]" class="ui-icon ui-icon-locked"
				  style="display:inline-block;vertical-align:middle;margin-left:-20px"></span>
		</td>
	
		<td class="numeric currency utilidad real adquisicion">
			${localCurrency}
			<span style="font-weight: bolder;color: white;border-radius: 10px;">
				<input style="color: #489a56;border-radius: 5px;" readonly name="item[][utilidad_real]">
			</span>
		</td>
	
		<td class="numeric percent margen-desde-venta margen real adquisicion">
			<span><input readonly name="item[][margen_venta_real]"> %</span>
		</td>
	
		<td class="numeric percent margen-desde-compra margen real adquisicion">
			<span><input readonly name="item[][margen_compra_real]"> %</span>
		</td>
	
		<td class="numeric currency adquisicion eficiencia">
			${localCurrency} <span><input readonly name="item[][diferencia]"></span>
		</td>
	
		<td class="numeric percent adquisicion eficiencia">
			<span><input readonly name="item[][diferencia_ratio]"> %</span>
		</td>
	
		${sc_td}
	</tr>
	`);


		htmlObject.find('input.number').number(true, 1, ',', ''); // Quitar flecha de campos tipo number
		if (!unaBase.doc.modoCine) {
			htmlObject.find('[name="item[][cantidad]"]').data('old-value', 1);
			htmlObject.find('[name="item[][factor]"]').data('old-value', 1);

		}

		htmlObject[functor](element);

		htmlObject.find('[name="item[][horas_extras]"]').parentTo('td').invisible();
		htmlObject.find('button.detail.price').invisible();
		htmlObject.find('button.detail.cost').invisible();




		htmlObject.find('[name="item[][closed_compras]"]').hide();
		htmlObject.find('.detail.cost-real').hide();




		//simon itemparent start

		if (element.hasClass('itemParent') || element.hasClass('childItem')) {
			htmlObject.find('.parent.item').remove();
		}
		//simon itemparent end
		if (margen_desde_compra)
			htmlObject.find('[name="item[][margen_compra]"]').invisible();
		else
			htmlObject.find('[name="item[][margen_venta]"]').invisible();

		if (typeof selected_currency == 'undefined') {
			htmlObject.find('.numeric.currency input:not([name="item[][precio_unitario]"]):not([name="item[][costo_unitario]"])').number(true, currency.decimals, ',', '.');
			//htmlObject.find('.numeric.currency input[name="item[][precio_unitario]"]').number(true, 2, ',', '.');
			// ocultar decimales en precio unitario
			htmlObject.find('.numeric.currency input[name="item[][precio_unitario]"]').number(true, currency.decimals, ',', '.');

			//if (subtotal_gasto_p_manual)
			//	htmlObject.find('.numeric.currency input[name="item[][costo_unitario]"]').number(true, currency.decimals + 2, ',', '.');
			//else
			//	htmlObject.find('.numeric.currency input[name="item[][costo_unitario]"]').number(true, 2, ',', '.');
			// ocultar decimales en costo unitario
			htmlObject.find('.numeric.currency input[name="item[][costo_unitario]"]').number(true, currency.decimals, ',', '.');

			htmlObject.find('.numeric.currency input[name="item[][costo_unitario_previo]"]').number(true, currency.decimals, ',', '.');

		} else {

			switch (selected_currency) {
				case 'USD':
					var decimals = 2;
					break;
				case 'CLF':
					var decimals = 2;
					break;
				default:
					var decimals = currency.decimals;
					break;
			}

			//htmlObject.find('.numeric.currency input').number(true, 2, ',', '.');
			// ocultar decimales en precio unitario
			htmlObject.find('.numeric.currency input:not([name="item[][precio_unitario]"])').number(true, decimals, ',', '.');
			htmlObject.find('.numeric.currency input[name="item[][precio_unitario]"]').number(true, decimals, ',', '.');
			htmlObject.find('.numeric.currency input[name="item[][costo_unitario]"]').number(true, decimals, ',', '.');

			htmlObject.find('.numeric.currency input[name="item[][costo_unitario_previo]"]').number(true, decimals, ',', '.');
		}

		htmlObject.draggable({
			helper: 'clone',
			containment: 'tbody',
			start: function (event, ui) {

				dragSource = $(event.target);
				$(event.target).invisible();

				updateSubtotalTitulos($(event.target), "line 403 editor library");

				//simon itemparent start

				updateSubtotalParents($(event.target));

				//simon itemparent end
				ui.helper.width($(event.target).width());
				ui.helper.height($(event.target).height());
				$(event.target).trigger('beforeMove'); // Logs tiempo real
			},
			stop: function (event, ui) {
				$(event.target).visible();

				updateSubtotalTitulos($(event.target), "line 416 editor library");

				//simon itemparent start

				updateSubtotalParents($(event.target));

				//simon itemparent end
			}
		});

		htmlObject.droppable({
			hoverClass: 'ui-state-active',
			accept: 'table.items > tbody > tr:not(.title)',
			drop: function (event, ui) {
				let itemToMove = ui.draggable;
				let itemReceiver = event.target;
				if (!itemToMove.hasClass('itemParent')) {
					if ($(itemReceiver).prevTo('tr.title').find('.ui-icon-folder-collapsed'))
						$(itemReceiver).prevTo('tr.title').find('.ui-icon-folder-collapsed').triggerHandler('click');
					$(itemReceiver).after(itemToMove);
					$(itemToMove).trigger('afterMove'); // Logs tiempo real
					//setTimeout(updateIndexes, 2000);

					//simon itemparent start

					if (itemToMove[0].classList.contains('childItem') && !itemReceiver.classList.contains('childItem') && !itemReceiver.classList.contains('itemParent')) {
						itemToMove[0].classList.remove('childItem');
						itemToMove[0].dataset.itemparent = "";
					} else if (itemToMove[0].classList.contains('itemParent')) {
						let parentKey = itemToMove.data('id');
						let items = document.querySelectorAll(`tr[data-itemparent="${parentKey}"`);
						for (const item of items) {
							$(item).insertAfter(itemToMove)
						}

					}

					//simon itemparent end
					//simon itemparent start
					if (itemReceiver.classList.contains('childItem') && itemReceiver.dataset.itemparent !== "") {
						itemToMove[0].classList.add('childItem');
						itemToMove[0].classList.remove('item');
						itemToMove[0].dataset.itemparent = itemReceiver.dataset.itemparent;
						itemToMove.find('.parent.item').hide();
					} else if (itemReceiver.classList.contains('item')) {
						itemToMove[0].classList.add('item');
						itemToMove[0].classList.remove('childItem');
						itemToMove[0].dataset.itemparent = '';
						itemToMove.find('.parent.item').show();
					}
					//simon itemparent end

				} else if (itemToMove.hasClass('itemParent')) {

					let dragTarget = $(itemReceiver).nextUntil('.title,.item,.itemParent');
					$(itemReceiver).after(itemToMove);
					if (itemToMove.hasClass('title')) {
						dragTarget.addClass('moving-dst');
						itemToMove.insertAfter($(itemReceiver));
						$('.moving-src').removeClass('moving-src').insertAfter(itemToMove);
						$('.moving-dst').removeClass('moving-dst').insertAfter($(itemReceiver));

					} else {
						itemToMove.insertAfter(dragTarget.last());
					}
					$(itemToMove).trigger('afterMove'); // Logs tiempo real

					//simon itemparent start

					if (itemToMove[0].classList.contains('childItem')) {
						itemToMove[0].classList.remove('childItem');
						itemToMove[0].classList.add('item');
						itemToMove[0].dataset.itemparent = "";
					} else if (itemToMove[0].classList.contains('itemParent')) {
						let parentKey = itemToMove.data('id');
						let items = document.querySelectorAll(`tr[data-itemparent="${parentKey}"`);
						for (const item of items) {
							$(item).insertAfter(itemToMove)
						}

					}
				}



			}
		});


		htmlObject.find('button.profile.item').tooltipster({
			delay: 0,
			interactiveAutoClose: false,
			contentAsHTML: true
		});


		return htmlObject;
	}
};

var updateIndexes = function (callback) {

	return new Promise((resolve, reject) => {


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


		$('#tabs-2a section.sheet table > tbody > tr').each(function (key, item) {

			index += increment;
			$(item).data('index', index);
			//simon  refactor start
			item.dataset.index = index;
			//simon refactor end
			field = $(item).find('input[name="item[][nombre]"]');




			if ($(item).hasClass('title')) {
				parent = $(item).data('id');

				fields['item[' + k + '][id]'] = $(item).data('id');
				fields['item[' + k + '][index]'] = $(item).data('index');
				fields['item[' + k + '][categoria]'] = $(item).data('categoria');
				fields['item[' + k + '][nombre]'] = $(item).find('[name="item[][nombre]"]').val();
				fields['item[' + k + '][subtotal_precio]'] = (parseFloat($(item).find('[name="item[][subtotal_precio]"]').val()) * exchange_rate).toString().replace(/\./g, ',');
				fields['item[' + k + '][subtotal_costo]'] = (parseFloat($(item).find('[name="item[][subtotal_costo]"]').val()) * exchange_rate).toString().replace(/\./g, ',');
				fields['item[' + k + '][subtotal_costo_previo]'] = (parseFloat($(item).find('[name="item[][subtotal_costo_previo]"]').val()) * exchange_rate).toString().replace(/\./g, ',');
				fields['item[' + k + '][utilidad]'] = (parseFloat($(item).find('[name="item[][utilidad]"]').val()) * exchange_rate).toString().replace(/\./g, ',');
				fields['item[' + k + '][margen_compra]'] = parseFloat($(item).find('[name="item[][margen_compra]"]').val());
				fields['item[' + k + '][margen_venta]'] = parseFloat($(item).find('[name="item[][margen_venta]"]').val());
				fields['item[' + k + '][ocultar_print]'] = $(item).find('[name="item[][ocultar_print]"]').prop('checked');
				fields['item[' + k + '][observacion]'] = $(item).data('observacion');
			} else {

				fields['item[' + k + '][newline]'] = $(item).data('newline') || false;
				fields['item[' + k + '][id]'] = $(item).data('id');
				fields['item[' + k + '][index]'] = $(item).data('index');
				fields['item[' + k + '][categoria]'] = $(item).data('categoria');
				fields['item[' + k + '][producto]'] = $(item).data('producto');
				fields['item[' + k + '][parent]'] = parent;
				fields['item[' + k + '][codigo]'] = $(item).find('[name="item[][codigo]"]').val();
				fields['item[' + k + '][nombre]'] = $(item).find('[name="item[][nombre]"]').val();
				if ($(item).find('[name="item[][cantidad]"]').data('old-value'))
					fields['item[' + k + '][cantidad]'] = (parseFloat($(item).find('[name="item[][cantidad]"]').data('old-value'))).toString().replace(/\./g, ',');
				else
					fields['item[' + k + '][cantidad]'] = (parseFloat($(item).find('[name="item[][cantidad]"]').val())).toString().replace(/\./g, ',');
				fields['item[' + k + '][unidad]'] = $(item).find('[name="item[][unidad]"]').val();
				if ($(item).find('[name="item[][factor]"]').data('old-value'))
					fields['item[' + k + '][factor]'] = (parseFloat($(item).find('[name="item[][factor]"]').data('old-value'))).toString().replace(/\./g, ',');
				else
					fields['item[' + k + '][factor]'] = (parseFloat($(item).find('[name="item[][factor]"]').val())).toString().replace(/\./g, ',');
				fields['item[' + k + '][porcentaje_monto_total]'] = parseFloat($(item).data('porcentaje-monto-total') * 100).toString().replace(/\./g, ',');
				fields['item[' + k + '][item_acumula_impuesto]'] = $(item).data('item_acumula_impuesto'); // ACUMULA IMPUESTO
				fields['item[' + k + '][formula_productor_ejecutivo]'] = $(item).data('formula-productor-ejecutivo'); // Fórmula productor ejecutivo
				fields['item[' + k + '][formula_productor_ejecutivo_ratio]'] = parseFloat($(item).data('formula-productor-ejecutivo-ratio')).toString().replace(/\./g, ','); // Fórmula productor ejecutivo
				fields['item[' + k + '][formula_asistente_produccion]'] = $(item).data('formula-asistente-produccion'); // Fórmula asistente producción
				fields['item[' + k + '][horas_extras]'] = parseFloat($(item).find('[name="item[][horas_extras]"]').val());
				//fields['item[' + k + '][precio_unitario]'] = (parseFloat(($(item).find('[name="item[][precio_unitario]"]').data('old-value'))? $(item).find('[name="item[][precio_unitario]"]').data('old-value') : $(item).find('[name="item[][precio_unitario]"]').val()) * exchange_rate).toString().replace(/\./g, ',');
				if (item.classList.contains('itemParent')) {
					fields['item[' + k + '][precio_unitario]'] = "0";
					fields['item[' + k + '][subtotal_precio]'] = (unaBase.utilities.transformNumber($(item).find('[name="item[][subtotal_precio]"]')[0].value) * exchange_rate).toString().replace(/\./g, ',');
					fields['item[' + k + '][costo_unitario]'] = "0"
					fields['item[' + k + '][subtotal_costo]'] = (unaBase.utilities.transformNumber($(item).find('[name="item[][subtotal_costo]"]')[0].value) * exchange_rate).toString().replace(/\./g, ',');
				} else {
					fields['item[' + k + '][precio_unitario]'] = (parseFloat($(item).find('[name="item[][precio_unitario]"]').data('old-value')) * exchange_rate).toString().replace(/\./g, ',');
					fields['item[' + k + '][subtotal_precio]'] = (parseFloat($(item).find('[name="item[][subtotal_precio]"]').data('old-value')) * exchange_rate).toString().replace(/\./g, ',');
					fields['item[' + k + '][costo_unitario]'] = (parseFloat($(item).find('[name="item[][costo_unitario]"]').data('old-value')) * exchange_rate).toString().replace(/\./g, ',');
					fields['item[' + k + '][subtotal_costo]'] = (parseFloat($(item).find('[name="item[][subtotal_costo]"]').data('old-value')) * exchange_rate).toString().replace(/\./g, ',');
				}

				fields['item[' + k + '][costo_unitario_previo]'] = (parseFloat($(item).find('[name="item[][costo_unitario_previo]"]').val()) * exchange_rate).toString().replace(/\./g, ',');
				fields['item[' + k + '][subtotal_costo_previo]'] = (parseFloat($(item).find('[name="item[][subtotal_costo_previo]"]').val()) * exchange_rate).toString().replace(/\./g, ',');
				fields['item[' + k + '][subtotal_costo_real]'] = (parseFloat($(item).find('[name="item[][subtotal_costo_real]"]').val()) * exchange_rate).toString().replace(/\./g, ',');
				fields['item[' + k + '][utilidad]'] = (parseFloat($(item).find('[name="item[][utilidad]"]').val()) * exchange_rate).toString().replace(/\./g, ',');
				fields['item[' + k + '][margen_compra]'] = parseFloat($(item).find('[name="item[][margen_compra]"]').val());
				fields['item[' + k + '][margen_venta]'] = parseFloat($(item).find('[name="item[][margen_venta]"]').val());
				if (item.classList.contains('itemParent') == false) {
					if (unaBase.doc.separate_sc) {
						fields['item[' + k + '][aplica_sobrecargo]'] = false;
						fields['item[' + k + '][separate_sc]'] = $(item).find('[name="item[][separate_sc]"]')[0].options[$(item).find('[name="item[][separate_sc]"]')[0].selectedIndex].value
					} else
						fields['item[' + k + '][aplica_sobrecargo]'] = $(item).find('[name="item[][aplica_sobrecargo]"]').prop('checked');

				}
				else
					fields['item[' + k + '][aplica_sobrecargo]'] = false;


				fields['item[' + k + '][costo_interno]'] = $(item).find('[name="item[][costo_interno]"]').prop('checked');
				fields['item[' + k + '][ocultar_print]'] = $(item).find('[name="item[][ocultar_print]"]').prop('checked');
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
					updateSubtotalTitulos($(item), "line 621 editor library");

				//simon itemparent start
				updateSubtotalParents($(item), "line 624 editor library");
				//simon itemparent end
			}


			$.extend(data, data, fields);
			k++;
		});

		var retval = true;
		const itemsnegocio = data;
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
					if (access._519)
						$('[data-name="share"]').show();

					// Aplicar bloqueo de nombres solo a items guardados (NO a categorías)
					$('#tabs-2a section.sheet table > tbody > tr').each(function() {
						var $row = $(this);
						var rowId = $row.data('id');
						var nombreInput = $row.find('input[name="item[][nombre]"]');
						
						if (rowId && nombreInput.length > 0) {
							// Solo bloquear items (no categorías ni itemParent)
							if (!$row.hasClass('title') && !$row.hasClass('itemParent')) {
								nombreInput.prop('readonly', true);
								nombreInput.attr('readonly', 'readonly');
								nombreInput.css({
									'pointer-events': 'none',
									'background-color': '#f5f5f5',
									'cursor': 'not-allowed',
									'opacity': '0.7'
								});
								nombreInput.data('item-guardado', true);
								$row.data('nombre-bloqueado', true);
								$row.find('button.show.item').hide();
								$row.find('button.ui-icon-document.detail.item').hide();
								if (nombreInput.hasClass('ui-autocomplete-input')) {
									nombreInput.autocomplete('destroy');
								}
							}
						}
					});

					if (typeof callback != 'undefined')
						callback()

					// Recargar items después de guardar para aplicar bloqueo de nombres
					setTimeout(function() {
						getDetail();
					}, 500);
					
					resolve()


				} else {
					reject()
					retval = false;

					if (typeof data.detail !== 'undefined') {
						if (data.detail.result) {
							toastr.warning(data.detail.data);
						} else {
							toastr.error(NOTIFY.get('ERROR_RECORD_READONLY_ITEM'));
						}

					}
					unaBase.ui.unblock();
				}
				return retval;
			}
		}).fail(function (err, err2, err3) {
			// Bloquear vista previa y compartir en caso de error
			$('#menu [data-name="preview"]').hide();
			$('#menu [data-name="share"]').hide();

			toastr.error('No se pudieron guardar los ítems del negocio, posiblemente debido a un error en los datos. Por favor, comunicarse con Soporte Unabase.');
			unaBase.ui.unblock();
			retval = false;
			reject();
			return retval;
		});



	});



};

var updateIndexes2 = function (callback) {

	let index = 0;
	let increment = 10;
	let fields = {};
	let field;
	let parent;

	let data = {
		fk: $('section.sheet').data('id')
	};

	let k = 1;

	$('#tabs-2a section.sheet table > tbody > tr').each(function (key, item) {

		index += increment;
		$(item).data('index', index);
		field = $(item).find('input[name="item[][nombre]"]');

		if ($(item).hasClass('title')) {
			parent = $(item).data('id');

			fields['item[' + k + '][id]'] = $(item).data('id');
			fields['item[' + k + '][index]'] = $(item).data('index');
			fields['item[' + k + '][categoria]'] = $(item).data('categoria');
			// fields['item[' + k + '][nombre]'] = $(item).find('[name="item[][nombre]"]').val();
			fields['item[' + k + '][nombre]'] = item.querySelector('[name="item[][nombre]"]').value;
			fields['item[' + k + '][subtotal_precio]'] = (parseFloat($(item).find('[name="item[][subtotal_precio]"]').val()) * exchange_rate).toString().replace(/\./g, ',');
			fields['item[' + k + '][subtotal_costo]'] = (parseFloat($(item).find('[name="item[][subtotal_costo]"]').val()) * exchange_rate).toString().replace(/\./g, ',');
			fields['item[' + k + '][subtotal_costo_previo]'] = (parseFloat($(item).find('[name="item[][subtotal_costo_previo]"]').val()) * exchange_rate).toString().replace(/\./g, ',');
			fields['item[' + k + '][utilidad]'] = (parseFloat($(item).find('[name="item[][utilidad]"]').val()) * exchange_rate).toString().replace(/\./g, ',');
			fields['item[' + k + '][margen_compra]'] = parseFloat($(item).find('[name="item[][margen_compra]"]').val());
			fields['item[' + k + '][margen_venta]'] = parseFloat($(item).find('[name="item[][margen_venta]"]').val());
			fields['item[' + k + '][ocultar_print]'] = $(item).find('[name="item[][ocultar_print]"]').prop('checked');
			fields['item[' + k + '][observacion]'] = $(item).data('observacion');
		} else {

			fields['item[' + k + '][newline]'] = $(item).data('newline') || false;
			fields['item[' + k + '][id]'] = $(item).data('id');
			fields['item[' + k + '][index]'] = $(item).data('index');
			fields['item[' + k + '][categoria]'] = $(item).data('categoria');
			fields['item[' + k + '][producto]'] = $(item).data('producto');
			fields['item[' + k + '][parent]'] = parent;
			// fields['item[' + k + '][codigo]'] = $(item).find('[name="item[][codigo]"]').val();
			// fields['item[' + k + '][nombre]'] = $(item).find('[name="item[][nombre]"]').val();
			fields['item[' + k + '][codigo]'] = item.querySelector('[name="item[][codigo]"]').value;
			fields['item[' + k + '][nombre]'] = item.querySelector('[name="item[][nombre]"]').value;
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
			// fields['item[' + k + '][porcentaje_monto_total]'] = parseFloat($(item).data('porcentaje-monto-total') * 100).toString().replace(/\./g, ',');
			fields['item[' + k + '][porcentaje_monto_total]'] = parseFloat($(item).data('porcentaje-monto-total')).toString().replace(/\./g, ',');
			fields['item[' + k + '][formula_productor_ejecutivo]'] = $(item).data('formula-productor-ejecutivo'); // Fórmula productor ejecutivo
			fields['item[' + k + '][item_acumula_impuesto]'] = $(item).data('item_acumula_impuesto'); // ACUMULA IMPUESTO
			fields['item[' + k + '][formula_asistente_produccion]'] = $(item).data('formula-asistente-produccion'); // Fórmula asistente producción
			fields['item[' + k + '][formula_productor_ejecutivo_ratio]'] = parseFloat($(item).data('formula-productor-ejecutivo-ratio')).toString().replace(/\./g, ','); // Fórmula productor ejecutivo
			fields['item[' + k + '][horas_extras]'] = parseFloat($(item).find('[name="item[][horas_extras]"]').val());
			fields['item[' + k + '][precio_unitario]'] = (parseFloat(($(item).find('[name="item[][precio_unitario]"]').data('old-value')) ? $(item).find('[name="item[][precio_unitario]"]').data('old-value') : $(item).find('[name="item[][precio_unitario]"]').val()) * exchange_rate).toString().replace(/\./g, ',');
			fields['item[' + k + '][subtotal_precio]'] = (parseFloat($(item).find('[name="item[][subtotal_precio]"]').val()) * exchange_rate).toString().replace(/\./g, ',');
			fields['item[' + k + '][costo_unitario]'] = (parseFloat(($(item).find('[name="item[][costo_unitario]"]').data('old-value')) ? $(item).find('[name="item[][costo_unitario]"]').data('old-value') : $(item).find('[name="item[][costo_unitario]"]').val()) * exchange_rate).toString().replace(/\./g, ',');
			fields['item[' + k + '][subtotal_costo]'] = (parseFloat($(item).find('[name="item[][subtotal_costo]"]').val()) * exchange_rate).toString().replace(/\./g, ',');
			//fields['item[' + k + '][costo_unitario_previo]'] = (parseFloat(($(item).find('[name="item[][costo_unitario_previo]"]').data('old-value'))? $(item).find('[name="item[][costo_unitario_previo]"]').data('old-value') : $(item).find('[name="item[][costo_unitario_previo]"]').val()) * exchange_rate).toString().replace(/\./g, ',');
			fields['item[' + k + '][costo_unitario_previo]'] = (parseFloat($(item).find('[name="item[][costo_unitario_previo]"]').val()) * exchange_rate).toString().replace(/\./g, ',');
			fields['item[' + k + '][subtotal_costo_previo]'] = (parseFloat($(item).find('[name="item[][subtotal_costo_previo]"]').val()) * exchange_rate).toString().replace(/\./g, ',');
			fields['item[' + k + '][subtotal_costo_real]'] = (parseFloat($(item).find('[name="item[][subtotal_costo_real]"]').val()) * exchange_rate).toString().replace(/\./g, ',');
			fields['item[' + k + '][utilidad]'] = (parseFloat($(item).find('[name="item[][utilidad]"]').val()) * exchange_rate).toString().replace(/\./g, ',');
			fields['item[' + k + '][margen_compra]'] = parseFloat($(item).find('[name="item[][margen_compra]"]').val());
			fields['item[' + k + '][margen_venta]'] = parseFloat($(item).find('[name="item[][margen_venta]"]').val());
			fields['item[' + k + '][aplica_sobrecargo]'] = $(item).find('[name="item[][aplica_sobrecargo]"]').prop('checked');

			fields['item[' + k + '][costo_interno]'] = $(item).find('[name="item[][costo_interno]"]').prop('checked');
			fields['item[' + k + '][ocultar_print]'] = $(item).find('[name="item[][ocultar_print]"]').prop('checked');
			fields['item[' + k + '][observacion]'] = $(item).data('observacion');
			fields['item[' + k + '][comentario]'] = $(item).data('comentario');
			fields['item[' + k + '][tipo_documento]'] = $(item).data('tipo-documento');
			// simon itemparent start
			fields['item[' + k + '][isParent]'] = item.classList.contains('itemParent');
			fields['item[' + k + '][isChild]'] = item.classList.contains('childItem');
			fields['item[' + k + '][itemParent]'] = item.dataset.itemparent;

			// simon itemparent end

			fields['item[' + k + '][tipo_documento][ratio]'] = $(item).data('tipo-documento-ratio');
			fields['item[' + k + '][tipo_documento][valor_usd]'] = $(item).data('tipo-documento-valor-usd'); // Impuesto extranjero

			fields['item[' + k + '][tipo_documento][valor_moneda]'] = $(item).data('tipo-documento-valor-moneda') ? $(item).data('tipo-documento-valor-moneda').toString().replace(/\./g, ',') : 0; // Impuesto extranjero

			fields['item[' + k + '][tipo_documento][inverse]'] = $(item).data('tipo-documento-inverse');
			fields['item[' + k + '][hora_extra][factor]'] = $(item).data('hora-extra-factor');
			fields['item[' + k + '][hora_extra][jornada]'] = $(item).data('hora-extra-jornada');
			fields['item[' + k + '][precio_unitario][base_imponible]'] = (parseFloat($(item).data('base-imponible')) * exchange_rate).toString().replace(/\./g, ',');

			fields['item[' + k + '][cant_hh_asig]'] = $(item).data('costo-presupuestado-hh-cantidad');
			fields['item[' + k + '][costo_hh_unitario]'] = $(item).data('costo-presupuestado-hh-valor');
			fields['item[' + k + '][responsable_asig]'] = $(item).data('costo-presupuestado-hh-username');

			//negocios/script/library/editors.js
			fields['item[' + k + '][closed_compras]'] = $(item).find('[name="item[][closed_compras]"]').is(':visible');

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


		}

		if ($(item).next().length) {

			if ($(item).next().hasClass('title'))
				updateSubtotalTitulos($(item), "line 792 editor library");

			//simon itemparent start

			updateSubtotalParents($(item));

			//simon itemparent end
		}


		$.extend(data, data, fields);
		k++;
	});

	let retval = true;


	console.log('2')
	$.ajax({
		url: '/4DACTION/_V3_batchItemByCotizacion',
		dataType: 'json',
		data: data,
		type: 'POST',
		cache: false,
		async: false,
		success: function (data) {
			if (data.success) {
				retval = true;
				// Desbloquear vista previa y compartir en caso de éxito
				// $('#menu [data-name="preview"]').show();
				document.querySelector('#menu [data-name="preview"]').style.display = ''
				if (access._519)
					// $('[data-name="share"]').show();
					document.querySelector('[data-name="share"]').style.display = ''

				// Aplicar bloqueo de nombres solo a items guardados (NO a categorías)
				$('#tabs-2a section.sheet table > tbody > tr').each(function() {
					var $row = $(this);
					var rowId = $row.data('id');
					var nombreInput = $row.find('input[name="item[][nombre]"]');
					
					if (rowId && nombreInput.length > 0) {
						// Solo bloquear items (no categorías ni itemParent)
						if (!$row.hasClass('title') && !$row.hasClass('itemParent')) {
							nombreInput.prop('readonly', true);
							nombreInput.attr('readonly', 'readonly');
							nombreInput.css({
								'pointer-events': 'none',
								'background-color': '#f5f5f5',
								'cursor': 'not-allowed',
								'opacity': '0.7'
							});
							nombreInput.data('item-guardado', true);
							$row.data('nombre-bloqueado', true);
							$row.find('button.show.item').hide();
							$row.find('button.ui-icon-document.detail.item').hide();
							if (nombreInput.hasClass('ui-autocomplete-input')) {
								nombreInput.autocomplete('destroy');
							}
						}
					}
				});

				if (typeof callback != 'undefined')
					setTimeout(function () {
						callback();
					}, 1500);
				
				// Recargar items después de guardar para aplicar bloqueo de nombres
				setTimeout(function() {
					if (typeof getDetail === 'function') {
						getDetail();
					}
				}, 2000);
			} else {
				retval = false;
				if (data.detail.result) {
					toastr.warning(data.detail.data);
				} else {
					toastr.error(NOTIFY.get('ERROR_RECORD_READONLY_ITEM'));
				}
				unaBase.ui.unblock();
			}

			return retval;

		}


	}).fail(function (err, err2, err3) {
		// Bloquear vista previa y compartir en caso de error
		// $('#menu [data-name="preview"]').hide();
		document.querySelector('#menu [data-name="preview"]').style.display = 'none'
		document.querySelector('#menu [data-name="share"]').style.display = 'none'
		// $('#menu [data-name="share"]').hide();

		toastr.error('No se pudieron guardar los ítems del negocio, posiblemente debido a un error en los datos. Por favor, comunicarse con Soporte Unabase.');
		unaBase.ui.unblock();

	});


};


var updateSubtotalItems = function (triggered) {

	console.log('Entra a updateSubtotalItems  editor_common');
	let subtotal_precios = 0;
	let subtotal_costos = 0;
	let subtotal_costos_previo = 0;
	let subtotal_diferencias_previo = 0;
	let subtotal_costos_real = 0;
	let subtotal_utilidades = 0;
	let subtotal_utilidades_real = 0;
	let subtotal_diferencias = 0;
	let aplica_sobrecargo = 0;
	let director_internacional = 0;



	let items = document.querySelectorAll("table.items.cotizacion > tbody tr:not(.title):not(.itemParent)");

	for (let item of items) {
		let queryItem = $(item);
		let subtotalParse = parseFloat(queryItem.find('[name="item[][subtotal_precio]"]').data('old-value'))
		//simon itemparent end
		subtotal_precios += subtotalParse;
		subtotal_costos_real += parseFloat(queryItem.find('[name="item[][subtotal_costo_real]"]').val());
		subtotal_utilidades += parseFloat(queryItem.find('[name="item[][utilidad]"]').val());
		subtotal_utilidades_real += parseFloat(queryItem.find('[name="item[][utilidad_real]"]').val());
		subtotal_diferencias += parseFloat(queryItem.find('[name="item[][diferencia]"]').val());
		if (queryItem.data('costo-directo')) {
			subtotal_costos += parseFloat(queryItem.find('[name="item[][subtotal_costo]"]').data('old-value'));

			subtotal_costos_previo += parseFloat(queryItem.find('[name="item[][subtotal_costo_previo]"]').val());
			subtotal_diferencias_previo += parseFloat(queryItem.find('[name="item[][diferencia_costo_previo]"]').val());
		}
		queryItem.find('[name="item[][aplica_sobrecargo]"]').each(function () {

			if ($(this).prop('checked')) {
				// subtarget = $(this).parentTo('tr').find('[name="item[][subtotal_precio]"]');
				aplica_sobrecargo += subtotalParse;
			}
			if ($(this).closest('tr').data('director-internacional')) {
				// subtarget = $(this).parentTo('tr').find('[name="item[][subtotal_precio]"]');
				director_internacional += subtotalParse;
			}
		});
	}

	$('input[name="cotizacion[precios][subtotal]"]').val(subtotal_precios).data('aplica-sobrecargo', aplica_sobrecargo).data('director-internacional', director_internacional).data('old-value', subtotal_precios);
	$('input[name="cotizacion[costos][subtotal]"]').val(subtotal_costos);
	$('input[name="cotizacion[costos_previo][subtotal]"]').val(subtotal_costos_previo);
	$('input[name="cotizacion[diferencias_previo][subtotal]"]').val(subtotal_diferencias_previo);
	$('input[name="cotizacion[costos_real][subtotal]"]').val(subtotal_costos_real);
	$('input[name="cotizacion[utilidades][subtotal]"]').val(subtotal_utilidades);
	$('input[name="cotizacion[utilidades_real][subtotal]"]').val(subtotal_utilidades_real);
	$('input[name="cotizacion[diferencia]"]').val(subtotal_diferencias);

	let subtotal_margen_compra;
	if (margen_desde_compra_inverso)
		subtotal_margen_compra = ((1 - subtotal_costos / subtotal_precios) * 100).toFixed(2);
	else
		subtotal_margen_compra = ((subtotal_precios - subtotal_costos) / subtotal_costos * 100).toFixed(2);

	let subtotal_margen_venta = ((subtotal_precios - subtotal_costos) / subtotal_precios * 100).toFixed(2);
	let subtotal_margen_compra_real;
	if (margen_desde_compra_inverso)
		subtotal_margen_compra_real = ((1 - subtotal_costos_real / subtotal_precios) * 100).toFixed(2);
	else
		// var subtotal_margen_compra_real = ((subtotal_precios - subtotal_costos_real) / subtotal_costos_real * 100).toFixed(2);
		// se hace este cambio para que el margen real siempre quede sobre la venta, independientemente que el margen presupuestado quede sobre la compra
		// y además poder conservar la forma de siempre de calcular el margen presupuestado, que sirve a varios clientes
		// var subtotal_margen_compra_real = ((subtotal_precios - subtotal_costos_real) / subtotal_precios * 100).toFixed(2);
		// este es de subtotal
		subtotal_margen_compra_real = ((subtotal_precios - subtotal_costos_real) / subtotal_precios * 100).toFixed(2);

	let subtotal_margen_venta_real = ((subtotal_precios - subtotal_costos_real) / subtotal_precios * 100).toFixed(2);

	$('input[name="cotizacion[margenes][margen_venta]"]').val(subtotal_margen_venta);
	$('input[name="cotizacion[margenes][margen_compra]"]').val(subtotal_margen_compra);
	$('input[name="cotizacion[margenes][margen_venta_real]"]').val(subtotal_margen_venta_real);
	$('input[name="cotizacion[margenes][margen_compra_real]"]').val(subtotal_margen_compra_real);

	let subtotal_diferencia_ratio = (subtotal_diferencias / subtotal_costos * 100).toFixed(2);

	$('input[name="cotizacion[diferencia_ratio]"]').val(subtotal_diferencia_ratio);

	if (!isFinite(subtotal_margen_venta))
		$('input[name="cotizacion[margenes][margen_venta]"]').invisible();
	else
		$('input[name="cotizacion[margenes][margen_venta]"]').visible();

	if (!isFinite(subtotal_margen_venta_real))
		$('input[name="cotizacion[margenes][margen_venta_real]"]').invisible();
	else
		$('input[name="cotizacion[margenes][margen_venta_real]"]').visible();

	if (!isFinite(subtotal_margen_compra))
		$('input[name="cotizacion[margenes][margen_compra]"]').invisible();
	else
		$('input[name="cotizacion[margenes][margen_compra]"]').visible();

	if (!isFinite(subtotal_margen_compra_real))
		$('input[name="cotizacion[margenes][margen_compra_real]"]').invisible();
	else
		$('input[name="cotizacion[margenes][margen_compra_real]"]').visible();

	// console.log('updateSubtotalItems: antes del for');
	// for (var i = 0; i <= 10; i++) {

	//código comentado en cinemagica

	// if(unaBase.doc.modoCine){
	// 	// Optimización cálculos cinemágica
	// 	if (!$('section.sheet').data('no-update')) {
	// 		for (var i = 0; i <= 24; i++) {
	// 			sobrecargos.updateSobrecargos();
	// 		}

	// 	} else {
	// 		sobrecargos.updateSobrecargos();
	// 	}
	// 	// console.log('updateSubtotalItems: después del for');

	// 	// console.log('Sale de updateSubtotalItems');

	// 	if (v3_sobrecargos_cinemagica) {
	// 		refreshValorPeliculaFromSobrecargos();
	// 		refreshCostosDirectos();
	// 		// Actualizar utilidad de valor película (disabled)
	// 		//$('.block-totales [name="sobrecargo[1][porcentaje]"]').val(25).trigger('blur');
	// 		//refreshValorPeliculaFromSobrecargos();
	// 	}

	// }else{
	// 	sobrecargos.updateSobrecargos();
	// 	sobrecargos.updateSobrecargos();

	// }

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

	//código comentado en cinemagica
	if (typeof triggered !== 'undefined' && triggered !== true) {
		calcValoresCinemagica();
	}

};



//REAPER comment ----> update subtotal titulos
var updateSubtotalTitulos = function (element, whereFrom = "nowhere") {

	//console.warn('update titulos from: ' + whereFrom);
	let target;
	if (element.prop('tagName') == 'TR') {
		if (element.hasClass('title'))
			target = element;
		else
			target = element.prevTo('.title');
	} else
		target = element.parentTo('tr').prevTo('.title');

	let subtotal_precios = 0;
	let subtotal_costos = 0;
	let subtotal_costos_previo = 0;
	let subtotal_diferencias_previo = 0;
	let subtotal_costos_real = 0;
	let subtotal_utilidades = 0;
	let subtotal_utilidades_real = 0;
	let subtotal_diferencias = 0;

	let current = target.next();
	let title;

	if (!current.hasClass('title') && current.length > 0) {



		do {

			// if (current.css('visibility') != 'hidden' && !current.hasClass('ui-draggable-dragging') && !current.hasClass('itemParent')) {
			if (current.css('visibility') != 'hidden' && !current.hasClass('ui-draggable-dragging') && (current.hasClass('item') || current.hasClass('childItem'))) {
				subtotal_precios += parseFloat(current.find('[name="item[][subtotal_precio]"]').val());
				subtotal_costos += parseFloat(current.find('[name="item[][subtotal_costo]"]').val());
				subtotal_costos_previo += parseFloat(current.find('[name="item[][subtotal_costo_previo]"]').val());
				subtotal_diferencias_previo += parseFloat(current.find('[name="item[][diferencia_costo_previo]"]').val());
				subtotal_costos_real += parseFloat(current.find('[name="item[][subtotal_costo_real]"]').val());
				subtotal_utilidades += parseFloat(current.find('[name="item[][utilidad]"]').val());
				subtotal_utilidades_real += parseFloat(current.find('[name="item[][utilidad_real]"]').val());
				subtotal_diferencias += parseFloat(current.find('[name="item[][diferencia]"]').val());



			}

			current = current.next();

		} while (!current.hasClass('title') && current.length > 0);




	}






	target.find('input[name="item[][subtotal_precio]"]').val(subtotal_precios);
	target.find('input[name="item[][subtotal_costo]"]').val(subtotal_costos);
	target.find('input[name="item[][subtotal_costo_previo]"]').val(subtotal_costos_previo);
	target.find('input[name="item[][diferencia_costo_previo]"]').val(subtotal_diferencias_previo);

	target.find('input[name="item[][subtotal_costo_real]"]').val(subtotal_costos_real);
	target.find('input[name="item[][utilidad]"]').val(subtotal_utilidades);
	target.find('input[name="item[][utilidad_real]"]').val(subtotal_utilidades_real);
	target.find('input[name="item[][diferencia]"]').val(subtotal_diferencias);


	if (margen_desde_compra_inverso)
		var subtotal_margen_compra = ((1 - subtotal_costos / subtotal_precios) * 100).toFixed(2);
	else
		var subtotal_margen_compra = ((subtotal_precios - subtotal_costos) / subtotal_costos * 100).toFixed(2);

	var subtotal_margen_venta = ((subtotal_precios - subtotal_costos) / subtotal_precios * 100).toFixed(2);

	if (margen_desde_compra_inverso)
		var subtotal_margen_compra_real = ((1 - subtotal_costos_real / subtotal_precios) * 100).toFixed(2);
	else
		// var subtotal_margen_compra_real = ((subtotal_precios - subtotal_costos_real) / subtotal_costos_real * 100).toFixed(2);
		var subtotal_margen_compra_real = ((subtotal_precios - subtotal_costos_real) / subtotal_precios * 100).toFixed(2);

	var subtotal_margen_venta_real = ((subtotal_precios - subtotal_costos_real) / subtotal_precios * 100).toFixed(2);

	target.find('input[name="item[][margen_venta]"]').val(subtotal_margen_venta);
	target.find('input[name="item[][margen_compra]"]').val(subtotal_margen_compra);
	target.find('input[name="item[][margen_venta_real]"]').val(subtotal_margen_venta_real);
	target.find('input[name="item[][margen_compra_real]"]').val(subtotal_margen_compra_real);

	var subtotal_diferencia_ratio = (subtotal_diferencias / subtotal_costos * 100).toFixed(2);

	target.find('input[name="item[][diferencia_ratio]"]').val(subtotal_diferencia_ratio);

	if (!isFinite(subtotal_margen_venta))
		target.find('input[name="item[][margen_venta]"]').invisible();
	else
		target.find('input[name="item[][margen_venta]"]').visible();

	if (!isFinite(subtotal_margen_venta_real))
		target.find('input[name="item[][margen_venta_real]"]').invisible();
	else
		target.find('input[name="item[][margen_venta_real]"]').visible();

	if (!isFinite(subtotal_margen_compra))
		target.find('input[name="item[][margen_compra]"]').invisible();
	else
		target.find('input[name="item[][margen_compra]"]').visible();

	if (!isFinite(subtotal_margen_compra_real))
		target.find('input[name="item[][margen_compra_real]"]').invisible();
	else
		target.find('input[name="item[][margen_compra_real]"]').visible();

};

var updateRow = function (event, force_update = false) {
	console.log('-******************************************updateRow*****************************************************');
	var target = $(event.target).parentTo('tr');


	if ($(event.target).prop('name') == 'item[][nombre]')
		target.find('button.detail.item').prop('title', target.find('[name="item[][nombre]"]').val());

	if ($(event.target).prop('type') == 'number')
		$(event.target).validateNumbers();


	if (typeof copiar_precio_a_costo == 'boolean' && !margen_desde_compra) {
		var costo_unitario = target.find('[name="item[][costo_unitario]"]');
		if ($(event.target).prop('name') == 'item[][precio_unitario]') {

			if (typeof costo_unitario.data('old-value') == 'undefined')
				costo_unitario.data('old-value', parseFloat(costo_unitario.val().replaceAll(".", "").replaceAll(",", ".")))

			if (typeof costo_unitario.data('oldValue') == 'undefined')
				costo_unitario.data('oldValue', parseFloat(costo_unitario.val().replaceAll(".", "").replaceAll(",", ".")))

			if (costo_unitario.data('old-value') == 0 && parseFloat(costo_unitario.val()) != costo_unitario.data('old-value'))
				costo_unitario.data('old-value', parseFloat(costo_unitario.val().replaceAll(".", "").replaceAll(",", ".")))

			if (typeof copiar_precio_a_costo == 'boolean' && costo_unitario.data('old-value') == costo_unitario.val()) {
				costo_unitario.data('auto', true);
			} else {

				//REAPER  -->comentado , desactiva el auto change costo unitario cuando modifico el precio venta
				//costo_unitario.data('auto', false);
			}

			if (costo_unitario.data('auto')) {
				// Corrección oculta decimales
				//costo_unitario.val($(event.target).val());

				if ($(event.target).data('old-value') && $(event.target).data('old-value') == costo_unitario.val())
					costo_unitario.val($(event.target).data('old-value'));
				else
					costo_unitario.val($(event.target).val());

			}

		}
	}



	if ($(event.target).prop('name') == 'item[][costo_unitario]' && (typeof event.originalEvent != 'undefined' || force_update)) {
		if (!unaBase.parametros.valorventa_mismo_valorcosto) {
			$(event.target).removeData('auto');
		}
	}

	var is_auto = $(event.target).parentTo('tr').find('[name="item[][costo_unitario]"]').data('auto');


	var target = $(event.target).parentTo('tr');

	var cantidad = parseFloat(target.find('[name="item[][cantidad]"]').data('old-value'));
	var factor = parseFloat(target.find('[name="item[][factor]"]').data('old-value'));
	var precio_unitario = (target.find('[name="item[][precio_unitario]"]').data('old-value')) ? target.find('[name="item[][precio_unitario]"]').data('old-value') : target.find('[name="item[][precio_unitario]"]').val();
	let costo_unitario_value = target.find('[name="item[][costo_unitario]"]').val();
	
	if (costo_unitario_value == '') {
		target.find('[name="item[][costo_unitario]"]').val(0)
	}


	if (precio_unitario == "")
		precio_unitario = "0"

	var cantidad_previo = parseFloat(target.find('[name="item[][cantidad]"]').data('old-value'));
	var factor_previo = parseFloat(target.find('[name="item[][factor]"]').data('old-value'));
	cantidad_previo = cantidad_previo > 0 ? cantidad_previo : 1;
	factor_previo = factor_previo > 0 ? factor_previo : 1;
	if (subtotal_gasto_p_manual && $(event.target).prop('name') == 'item[][subtotal_costo_previo]') {
		var costo_unitario_previo = parseFloat(target.find('[name="item[][subtotal_costo_previo]"]').val()) / (cantidad_previo * factor_previo);
		target.find('[name="item[][costo_unitario_previo]"]').val(costo_unitario_previo).data('old-value', costo_unitario_previo);
	} else
		//var costo_unitario = (target.find('[name="item[][costo_unitario]"]').data('old-value'))? target.find('[name="item[][costo_unitario]"]').data('old-value') : target.find('[name="item[][costo_unitario]"]').val();
		var costo_unitario_previo = parseFloat(target.find('[name="item[][costo_unitario_previo]"]').val());

	var subtotal_costo_previo = costo_unitario_previo * cantidad_previo * factor_previo;
	var diferencia_costo_previo = precio_unitario * cantidad * factor - subtotal_costo_previo;
	target.find('[name="item[][subtotal_costo_previo]"]').val(subtotal_costo_previo);
	target.find('[name="item[][diferencia_costo_previo]"]').val(diferencia_costo_previo);


	if ($(event.target).prop('name') == 'item[][subtotal_costo_previo]') {
		// target.find('[name="item[][costo_unitario]"]').val(costo_unitario_previo).data('old-value', costo_unitario_previo);
		// target.find('[name="item[][subtotal_costo]"]').val(subtotal_costo_previo);

		// is_auto = false;
	}

	if (typeof $(event.target).parentTo('tr').data('porcentaje-monto-total') == 'object' && $(event.target).parentTo('tr').data('porcentaje-monto-total') > 0) {
		var porcentaje_monto_total = $(event.target).parentTo('tr').data('porcentaje-monto-total');
		var formula_productor_ejecutivo = $(event.target).parentTo('tr').data('formula-productor-ejecutivo'); // Fórmula productor ejecutivo		
		var formula_productor_ejecutivo_ratio = $(event.target).parentTo('tr').data('formula-productor-ejecutivo-ratio'); // Fórmula productor ejecutivo
		var formula_asistente_produccion = $(event.target).parentTo('tr').data('formula-asistente-produccion'); // Fórmula asistente producción
		var formula_horas_extras = $(event.target).parentTo('tr').data('formula-horas-extras'); // Fórmula horas extras
		var director_internacional = $(event.target).parentTo('tr').data('director-internacional');
		// var total_a_cliente = $('[name="sobrecargo[5][subtotal]"]').val();
		var porcentaje_sc_6 = (typeof $('input[name="sobrecargo[6][porcentaje]"]').val() != 'undefined') ? parseFloat($('input[name="sobrecargo[6][porcentaje]"]').val()) : 0;

		// (if cinemagica tomar el total a cliente, sino el valor que está en la siguiente fórmula)
		if (v3_sobrecargos_cinemagica) {
			var total_a_cliente = parseFloat($('input[name="cotizacion[ajuste]"]').val());
		} else {
			var total_a_cliente = parseFloat($('input[name="cotizacion[ajuste]"]').val()) - parseFloat($('input[name="cotizacion[ajuste]"]').val()) * parseFloat(porcentaje_sc_6 / 100.00);
		}

		// target.find('[name="item[][precio_unitario]"]').val((total_a_cliente / (1 - porcentaje_monto_total) - total_a_cliente) / cantidad / factor);
		// Corrección cuando se ocultan decimales
		//var precio_unitario = target.find('[name="item[][precio_unitario]"]').val();



		if (target.find('[name="item[][precio_unitario]"]').data('old-value'))
			var precio_unitario = target.find('[name="item[][precio_unitario]"]').data('old-value');
		else
			var precio_unitario = target.find('[name="item[][precio_unitario]"]').val();
	} else {
		// Corrección cuando se ocultan decimales
		//var precio_unitario = target.find('[name="item[][precio_unitario]"]').val();
		if (target.find('[name="item[][precio_unitario]"]').data('old-value'))
			var precio_unitario = target.find('[name="item[][precio_unitario]"]').data('old-value');
		else
			var precio_unitario = target.find('[name="item[][precio_unitario]"]').val();
	}

	// var costo_unitario = target.find('[name="item[][costo_unitario]"]').val();

	// Si cantidades son iguales a cero y el unitario gasto p es igual al subtotal gasto p, no se debe recalcular el gasto p unitario

	var costo_unitario = parseFloat(target.find('[name="item[][costo_unitario]"]').val());
	var subtotal_costo = parseFloat(target.find('[name="item[][subtotal_costo]"]').val());
	var costo_unitario = 0


	if (v3_sobrecargos_cinemagica && (cantidad === 0 || factor === 0)/* && costo_unitario === subtotal_costo*/) {
		costo_unitario = subtotal_costo;
	} else {
		if (subtotal_gasto_p_manual && $(event.target).prop('name') == 'item[][subtotal_costo]') {

			if (unaBase.no_cant_subcosto_manual)
				costo_unitario = parseFloat(target.find('[name="item[][subtotal_costo]"]').val());
			else
				costo_unitario = parseFloat(target.find('[name="item[][subtotal_costo]"]').val()) / (parseFloat(target.find('[name="item[][cantidad]"]').data('old-value')) * parseFloat(target.find('[name="item[][factor]"]').data('old-value')));

			target.find('[name="item[][costo_unitario]"]').val(costo_unitario).data('old-value', costo_unitario);
		} else
			//var costo_unitario = (target.find('[name="item[][costo_unitario]"]').data('old-value'))? target.find('[name="item[][costo_unitario]"]').data('old-value') : target.find('[name="item[][costo_unitario]"]').val();
			var costo_unitario = parseFloat(target.find('[name="item[][costo_unitario]"]').val());
	}

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


				target.find('[name="item[][precio_unitario]"]').val(precio_unitario).data('old-value', precio_unitario);
			} else {
				precio_unitario = (target.find('[name="item[][precio_unitario]"]').data('old-value')) ? target.find('[name="item[][precio_unitario]"]').data('old-value') : target.find('[name="item[][precio_unitario]"]').val();

				target.find('[name="item[][costo_unitario]"]').val(precio_unitario).data('old-value', precio_unitario).trigger('blur');
			}

			subtotal_precio = cantidad * factor * (unaBase.utilities.transformNumber(precio_unitario)).toFixed(currency.decimals);
			subtotal_costo = (target.find('[name="item[][subtotal_costo]"]').hasClass('edited')) ? cantidad * factor * costo_unitario + costo_presupuestado_interno : cantidad * factor * costo_unitario;
		} else {
			precio_unitario = (target.find('[name="item[][precio_unitario]"]').data('old-value')) ? target.find('[name="item[][precio_unitario]"]').data('old-value') : target.find('[name="item[][precio_unitario]"]').val();



			subtotal_precio = cantidad * factor * (currency.decimals_sep == ',' ? parseFloat(precio_unitario) : unaBase.utilities.transformNumber(precio_unitario));
			if (v3_sobrecargos_cinemagica && (cantidad === 0 || factor === 0)/* && costo_unitario === subtotal_costo*/) {
				//if (v3_sobrecargos_cinemagica) {
				subtotal_costo = parseFloat(target.find('[name="item[][subtotal_costo]"]').val());
			} else {
				subtotal_costo = (target.find('[name="item[][subtotal_costo]"]').hasClass('edited')) ? cantidad * factor * costo_unitario + costo_presupuestado_interno : cantidad * factor * costo_unitario;
			}

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

			subtotal_precio = cantidad * factor * unaBase.utilities.transformNumber(precio_unitario);
			subtotal_costo = (target.find('[name="item[][subtotal_costo]"]').hasClass('edited')) ? cantidad * factor * costo_unitario + costo_presupuestado_interno : cantidad * factor * costo_unitario;
		} else {
			//costo_unitario = (target.find('[name="item[][costo_unitario]"]').data('old-value'))? target.find('[name="item[][costo_unitario]"]').data('old-value') : target.find('[name="item[][costo_unitario]"]').val();
			costo_unitario = parseFloat(target.find('[name="item[][costo_unitario]"]').val());


			subtotal_precio = cantidad * factor * (currency.decimals_sep == ',' ? parseFloat(precio_unitario) : unaBase.utilities.transformNumber(precio_unitario));

			if (unaBase.no_cant_subcosto_manual)
				subtotal_costo = (target.find('[name="item[][subtotal_costo]"]').hasClass('edited')) ? costo_unitario + costo_presupuestado_interno : costo_unitario;
			else
				subtotal_costo = (target.find('[name="item[][subtotal_costo]"]').hasClass('edited')) ? cantidad * factor * costo_unitario + costo_presupuestado_interno : cantidad * factor * costo_unitario;


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

	var subtotal_costo_real = target.find('[name="item[][subtotal_costo_real]"]').val();

	target.find('[name="item[][subtotal_precio]"]').val(subtotal_precio);
	target.find('[name="item[][subtotal_costo]"]').val(subtotal_costo);



	target.find('[name="item[][subtotal_precio]"]').val(subtotal_precio).data('old-value', subtotal_precio);
	target.find('[name="item[][subtotal_costo]"]').val(subtotal_costo).data('old-value', subtotal_costo);


	let hola = target.find('[name="item[][subtotal_precio]"]').data('old-value')

	target.find('[name="item[][utilidad]"]').val(subtotal_precio - subtotal_costo);
	target.find('[name="item[][diferencia]"]').val(subtotal_costo - subtotal_costo_real);
	target.find('[name="item[][diferencia_ratio]"]').val((((subtotal_costo - subtotal_costo_real) / subtotal_costo) * 100).toFixed(2));


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

	//FIX HORAS EXTRAS al cambiar manualmene el precio unitario
	if ($(event.target).prop('name') == "item[][precio_unitario]") {
		// FIX NUEVO REAPER 03-03-2024
		if ($(event.target).data('old-value') != $(event.target).data('original-value'))
			if ($(event.target).data('original-value') != undefined)
				$(event.target).parentTo('tr').data('base-imponible', parseFloat($(event.target).parentTo('tr').find('input[name="item[][precio_unitario]"]').val()))
	}

	if ($(event.target).prop('name') == "item[][costo_unitario]") {

		// FIX NUEVO REAPER 15-05-2024
		if ($(event.target).data('old-value') != $(event.target).data('original-value'))
			if ($(event.target).data('original-value') != undefined)
				$(event.target).parentTo('tr').data('baseImponibleCompras', parseFloat($(event.target).parentTo('tr').find('input[name="item[][costo_unitario]"]').val()))
	}

	if (target.data('first-load') !== true && target.data('no-update') === undefined) {

		updateSubtotalTitulos($(event.target), "line 1954 editor library");
		//simon itemparent start

		if (!target[0].classList.contains('title')) {
			updateSubtotalParents($(event.target))
		}
		//simon itemparent end

		if (!modoOffline) {
			updateSubtotalItems();

			// Sección datos cinemágica
			refreshCostosDirectos();
		}

		if (unaBase.doc.modoCine) {
			calcValoresCinemagica();
		}

		if (subtotal_gasto_p_manual && $(event.target).prop('name') == 'item[][subtotal_costo]')
			target.find('[name="item[][costo_unitario]"]').trigger('blur')
	}

};





var calcValoresCinemagica = function (event) {
	console.log("------------------------- calcValoresCinemagica");
	if ($('section.sheet.detalle-items').data('fetching')) {
		return false;
	}

	// Llenado de objeto con datos del formulario
	var data = {
		rows: []
	};
	$('section.sheet.detalle-items table.items tbody').find('tr').each(function (key, item) {
		var item_tmp = $(item);

		var cantidad = item_tmp.find('input[name="item[][cantidad]"]').length > 0 ? parseFloat(item_tmp.find('input[name="item[][cantidad]"]').data('old-value')) : undefined;
		var factor = item_tmp.find('input[name="item[][factor]"]').length > 0 ? parseFloat(item_tmp.find('input[name="item[][factor]"]').data('old-value')) : undefined;
		var precio_unitario = item_tmp.find('input[name="item[][precio_unitario]"]').length > 0 ? parseFloat(item_tmp.find('input[name="item[][precio_unitario]"]').val()) : undefined;
		var subtotal_precio = item_tmp.find('input[name="item[][subtotal_precio]"]').length > 0 ? parseFloat(item_tmp.find('input[name="item[][subtotal_precio]"]').val()) : undefined;
		var costo_unitario = item_tmp.find('input[name="item[][costo_unitario]"]').length > 0 ? parseFloat(item_tmp.find('input[name="item[][costo_unitario]"]').val()) : undefined;
		var subtotal_costo = item_tmp.find('input[name="item[][subtotal_costo]"]').length > 0 ? parseFloat(item_tmp.find('input[name="item[][subtotal_costo]"]').val()) : undefined;

		var row = {
			id: item_tmp.data('id'),
			titulo: typeof item_tmp.data('categoria') !== 'undefined',
			nombre: item_tmp.find('[name="item[][nombre]"]').val(),
			porcentaje_monto_total: item_tmp.data('porcentaje-monto-total'),
			formula_productor_ejecutivo: item_tmp.data('formula-productor-ejecutivo'),
			formula_productor_ejecutivo_ratio: item_tmp.data('formula-productor-ejecutivo-ratio'),
			formula_asistente_produccion: item_tmp.data('formula-asistente-produccion'),
			formula_horas_extras: item_tmp.data('formula-horas-extras'),
			costo_directo: item_tmp.data('costo-directo'),
			cantidad,
			factor,
			hora_extra: {
				enabled: item_tmp.data('hora-extra-enabled'),
				jornada: item_tmp.data('hora-extra-jornada'),
				base_imponible: item_tmp.data('base-imponible')
			},
			precio: {
				unitario: precio_unitario,
				subtotal: subtotal_precio
			},
			costo: {
				unitario: costo_unitario,
				subtotal: subtotal_costo
			},
			tipo_documento: {
				id: item_tmp.data('tipo-documento'),
				abbr: item_tmp.data('tipo-documento-abbr'),
				text: item_tmp.data('tipo-documento-text'),
				ratio: item_tmp.data('tipo-documento-ratio'),
				valor_usd: item_tmp.data('tipo-documento-valor-usd'),
				valor_moneda: item_tmp.data('tipo-documento-valor-moneda') ? item_tmp.data('tipo-documento-valor-moneda') : 0,
				inverse: item_tmp.data('tipo-documento-inverse')
			}
		};
		data.rows.push(row);
	});

	// Terminar si no hay ítems
	if (data.rows.length === 0) {

		var retval = {
			rows: data.rows,
			extra: {
				subtotal_items: 0,
				valor_pelicula: 0,
				costos_independientes_total: 0,
				costos_dependientes_total: 0,
				costos_directos: 0,
				costo_presupuestado_directo: 0,
				utilidad_bruta: {
					porcentaje: 0,
					monto: 0
				},
				costos_fijos: {
					monto: 0
				},
				utilidad_neta: 0,
				director: {
					monto: 0
				},
				compania: 0,
				comision_agencia: {
					monto: 0
				},
				total_neto: 0
			}
		};

		fillValoresCinemagica(data, retval);

		console.log('calcValoresCinemagica returned false: empty list.');
		return false;
	}

	// Calcular horas extras
	var horas_extras_jornada = 0;
	var horas_extras_proyecto = 0;
	for (var index = 0, len = data.rows.length; index < len; index++) {
		var item = data.rows[index];
		if (!item.titulo && item.costo_directo) {
			if (item.hora_extra.enabled) {
				if (item.hora_extra.jornada) {
					horas_extras_jornada += item.precio.subtotal;
				} else {
					horas_extras_proyecto += item.precio.subtotal;
				}
			}
		}
	}

	// Obtener días filmación
	var dias_filmacion = parseFloat($('#main-container').find('[name="dato[5][valor]"]').val());
	if (isNaN(dias_filmacion)) {
		dias_filmacion = 1;
	} else {
		if (dias_filmacion == 0) {
			dias_filmacion = 1;
		}
	}

	// Fórmula de horas extras
	var subtotal_horas_extras = 1.5 * horas_extras_jornada / dias_filmacion / 10 + 1.5 * horas_extras_proyecto / 10 / 10;
	console.log('Suma items jornada: ', horas_extras_jornada);
	console.log('Suma items proyecto: ', horas_extras_proyecto);
	console.log('Subtotal horas extras: ', subtotal_horas_extras);

	// Buscar nodo de horas extras y asignar monto calculado
	var index = totales.utilities.fastArrayObjectSearch(data.rows, 'formula_horas_extras', true);
	if (index !== -1) {
		var factor_horas_extras = (1 + data.rows[index].tipo_documento.ratio);
		var item = data.rows[index];
		data.rows[index].precio.unitario = subtotal_horas_extras * factor_horas_extras;
		data.rows[index].precio.subtotal = subtotal_horas_extras * item.cantidad * item.factor * factor_horas_extras;
		data.rows[index].hora_extra.base_imponible = subtotal_horas_extras * item.cantidad * item.factor * factor_horas_extras;
	}

	// Cálculo costos independientes del total
	var costos_independientes_total = 0;
	for (var index = 0, len = data.rows.length; index < len; index++) {
		var item = data.rows[index];
		if (!item.titulo && !item.formula_productor_ejecutivo && !item.formula_asistente_produccion && !item.porcentaje_monto_total) {
			costos_independientes_total += item.precio.unitario * item.cantidad * item.factor;
		}
	}

	// Cálculo costos directos
	var costos_directos = 0;
	var costo_presupuestado_directo = 0;
	for (var index = 0, len = data.rows.length; index < len; index++) {
		var item = data.rows[index];
		if (!item.titulo && item.costo_directo) {
			costos_directos += item.precio.subtotal;
			costo_presupuestado_directo += item.costo.subtotal;
		}
	}

	// Obtener valor película
	var valor_pelicula = parseFloat(blockCinemagica.find('[name="sobrecargo[1][subtotal]"]').val());

	// Obtener porcentaje comisión agencia
	var porcentaje_comision_agencia = parseFloat(blockCinemagica.find('[name="sobrecargo[6][porcentaje]"]').val());

	// Cálculo total neto
	var total_neto = valor_pelicula / (1 - porcentaje_comision_agencia / 100);

	// Buscar ítems con porcentaje de monto total y asignar monto calculado (gastos máxima y otros)
	var gastos_maxima = 0;
	var gastos_maxima_indice = '';

	var indices = totales.utilities.multiArrayObjectSearch(data.rows, 'porcentaje_monto_total', 0, true);
	for (var index = 0, len = indices.length; index < len; index++) {
		var current_index = indices[index];
		var item = data.rows[current_index];
		var monto_calculado = total_neto * item.porcentaje_monto_total; // porcentaje_monto_total [0,1]
		data.rows[current_index].precio.unitario = monto_calculado;
		data.rows[current_index].precio.subtotal = monto_calculado * item.cantidad * item.factor;
		if ((data.rows[current_index].nombre.toUpperCase() === "GASTOS MÁXIMA") || (data.rows[current_index].nombre.toUpperCase() === "GASTOS ADMINISTRACION") || (data.rows[current_index].nombre.toUpperCase() === "COSTO FINANCIERO")) {
			gastos_maxima += data.rows[current_index].precio.subtotal;
			gastos_maxima_indice = data.rows[current_index].nombre.toUpperCase();
		}
	}

	// Buscar ítems con fórmula productor ejecutivo y asignar monto calculado
	var comision_productor = 0.15; // (15%)
	var productor_ejecutivo = 0;
	//var index = totales.utilities.fastArrayObjectSearch(data.rows, 'formula_productor_ejecutivo', true);
	var indexes = totales.utilities.multiArrayObjectSearch(data.rows, 'formula_productor_ejecutivo', true);
	//if (index !== -1) {
	if (indexes.length > 0) {
		for (var i = 0, len = indexes.length; i < len; i++) {
			var index = indexes[i];
			var item = data.rows[index];
			if (data.rows[index].formula_productor_ejecutivo_ratio) {
				comision_productor = data.rows[index].formula_productor_ejecutivo_ratio / 100.00;
			}

			if (vIDOrigen == 32158 || vIDOrigen == 34259 || vIDOrigen == 34234 || gastos_maxima_indice == "GASTOS ADMINISTRACION" || gastos_maxima_indice == "COSTO FINANCIERO") {
				productor_ejecutivo = (valor_pelicula - costos_directos - gastos_maxima) * comision_productor;

			} else {

				productor_ejecutivo = (valor_pelicula - costos_directos - gastos_maxima) * comision_productor * valor_pelicula / (total_neto + valor_pelicula * comision_productor);

			}

			data.rows[index].precio.unitario = productor_ejecutivo;
			data.rows[index].precio.subtotal = productor_ejecutivo * item.cantidad * item.factor;




		}
	}

	if (gastos_maxima_indice == "GASTOS ADMINISTRACION") {
		var comision_asistente = 0.013; // ( 1%)
	} else {
		var comision_asistente = 0.01; // ( 1%)

	}

	var asistente_produccion = 0;
	//var index = totales.utilities.fastArrayObjectSearch(data.rows, 'formula_asistente_produccion', true);
	var indexes = totales.utilities.multiArrayObjectSearch(data.rows, 'formula_asistente_produccion', true);
	//if (index !== -1) {
	if (indexes.length > 0) {
		for (var i = 0, len = indexes.length; i < len; i++) {
			var index = indexes[i];
			var item = data.rows[index];
			if (item.cantidad === 0 || item.factor === 0) {
				asistente_produccion = 0;
			} else {
				if (data.rows[index].formula_productor_ejecutivo_ratio > 0) {
					comision_asistente = data.rows[index].formula_productor_ejecutivo_ratio / 100.00;
				}
				//asistente_produccion = ((valor_pelicula > 200000000) ? 200000000 * comision_asistente : valor_pelicula * comision_asistente) / (item.cantidad * item.factor);

				asistente_produccion = (valor_pelicula * comision_asistente) / (item.cantidad * item.factor);
			}
			data.rows[index].precio.unitario = asistente_produccion;
			data.rows[index].precio.subtotal = asistente_produccion * item.cantidad * item.factor;
		}
	}

	// Cálculo costos dependientes del total
	var costos_dependientes_total = 0;
	for (var index = 0, len = data.rows.length; index < len; index++) {
		var item = data.rows[index];
		if (!item.titulo && (item.formula_productor_ejecutivo || item.formula_asistente_produccion || item.porcentaje_monto_total)) {
			costos_dependientes_total += item.precio.unitario * item.cantidad * item.factor;
		}
	}

	// Cálculo subtotal ítems
	var subtotal_items = costos_independientes_total + costos_dependientes_total;

	// Cálculo utilidad bruta
	var utilidad_bruta = valor_pelicula - subtotal_items;

	// Cálculo porcentaje utilidad bruta
	var porcentaje_utilidad_bruta = (utilidad_bruta / valor_pelicula) * 100;

	// Cálculo costos fijos
	var porcentaje_costos_fijos = parseFloat(blockCinemagica.find('[name="sobrecargo[4][porcentaje]"]').val());
	var costos_fijos = valor_pelicula * (porcentaje_costos_fijos / 100);

	// Cálculo utilidad neta
	var utilidad_neta = utilidad_bruta - costos_fijos;


	// Cálculo director y compañía
	var porcentaje_director = parseFloat(blockCinemagica.find('[name="cotizacion[cinemagica][director][porcentaje]"]').val());
	var director = utilidad_neta * (porcentaje_director / 100);
	var compania = utilidad_neta - director;

	// Cálculo comisión agencia
	var comision_agencia = total_neto - valor_pelicula;


	var retval = {
		rows: data.rows,
		extra: {
			subtotal_items,
			valor_pelicula,
			costos_independientes_total,
			costos_dependientes_total,
			costos_directos,
			costo_presupuestado_directo,
			utilidad_bruta: {
				porcentaje: porcentaje_utilidad_bruta,
				monto: utilidad_bruta
			},
			costos_fijos: {
				porcentaje: porcentaje_costos_fijos,
				monto: costos_fijos
			},
			utilidad_neta,
			director: {
				porcentaje: porcentaje_director,
				monto: director
			},
			compania,
			comision_agencia: {
				porcentaje: porcentaje_comision_agencia,
				monto: comision_agencia
			},
			total_neto
		}
	};

	fillValoresCinemagica(data, retval);

};

var afterEditContacto2 = function (element) {
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
		'item[][item_acumula_impuesto]': target.data('item_acumula_impuesto'), // ACUMULA IMPUESTO
		'item[][formula_productor_ejecutivo]': target.data('formula-productor-ejecutivo'), // Fórmula productor ejecutivo
		'item[][formula_productor_ejecutivo_ratio]': target.data('formula-productor-ejecutivo-ratio'), // Fórmula productor ejecutivo
		'item[][formula_asistente_produccion]': target.data('formula-asistente-produccion'), // Fórmula asistente producción
		'item[][formula_horas_extras]': target.data('formula-horas-extras'), // Fórmula horas extras
		'item[][director_internacional]': target.data('director-internacional'),
		'item[][precio_unitario]': parseFloat((target.find('[name="item[][precio_unitario]"]').data('old-value')) ? target.find('[name="item[][precio_unitario]"]').data('old-value') : target.find('[name="item[][precio_unitario]"]').val()),
		'item[][subtotal_precio]': parseFloat(target.find('[name="item[][subtotal_precio]"]').val()),
		'item[][costo_unitario]': parseFloat((target.find('[name="item[][costo_unitario]"]').data('old-value')) ? target.find('[name="item[][costo_unitario]"]').data('old-value') : target.find('[name="item[][costo_unitario]"]').val()),
		'item[][subtotal_costo]': parseFloat(target.find('[name="item[][subtotal_costo]"]').val()),
		'item[][utilidad]': parseFloat(target.find('[name="item[][utilidad]"]').val()),
		'item[][margen_compra]': parseFloat(target.find('[name="item[][margen_compra]"]').val()),
		'item[][margen_venta]': parseFloat(target.find('[name="item[][margen_venta]"]').val()),
		'item[][aplica_sobrecargo]': unaBase.doc.separate_sc ? false : target.find('[name="item[][aplica_sobrecargo]"]').prop('checked'),
		'item[][costo_interno]': target.find('[name="item[][costo_interno]"]').prop('checked'),
		'item[][observacion]': target.data('observacion'),
		'item[][comentario]': target.data('comentario'),
		'item[][tipo_documento]': target.data('tipo-documento'),
		'item[][tipo_documento][ratio]': target.data('tipo-documento-ratio'),
		'item[][tipo_documento][valor_usd]': target.data('tipo-documento-valor-usd'), // Impuesto extranjero
		'item[][tipo_documento][valor_moneda]': target.data('tipo-documento-valor-moneda') ? target.data('tipo-documento-valor-moneda').toString().replace(/\./g, ',') : 0,// Impuesto extranjero
		'item[][tipo_documento][inverse]': target.data('tipo-documento-inverse'),
		'item[][tipo_documento_compras]': target.data('tipo-documento'),
		'item[][tipo_documento_compras][ratio]': target.data('tipo-documento-ratio'),
		'item[][tipo_documento_compras][valor_usd]': target.data('tipo-documento-valor-usd'), // Impuesto extranjero
		'item[][tipo_documento_compras][valor_moneda]': target.data('tipo-documento-valor-moneda') ? target.data('tipo-documento-valor-moneda').toString().replace(/\./g, ',') : 0,// Impuesto extranjero
		'item[][tipo_documento_compras][inverse]': target.data('tipo-documento-inverse'),
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

	$.ajax({
		url: '/4DACTION/_V3_setItemByCotizacion',
		dataType: 'json',
		data: fields,
		async: false,
		cache: false,
		success: function (data) {
			target.data('id', data.id);
			target.data('index', data.index);

			// Si el item fue guardado exitosamente (tiene ID) y NO es una categoría (title o itemParent), hacer readonly el campo nombre
			if (data.id && !target.hasClass('title') && !target.hasClass('itemParent')) {
				var bloquearNombre = function() {
					var nombreInput = target.find('[name="item[][nombre]"]');
					if (nombreInput.length === 0) {
						console.warn('[saveRow] No se encontró el campo nombre para el item ID:', data.id);
						return;
					}
					
					var nombreValue = nombreInput.val();
					console.log('[saveRow] Bloqueando nombre del item ID:', data.id, 'Valor:', nombreValue);
					
					// Guardar el valor original para restaurarlo si se intenta cambiar
					nombreInput.data('nombre-original', nombreValue);
					nombreInput.attr('data-original-value', nombreValue);
					
					// Hacer readonly
					nombreInput.prop('readonly', true);
					nombreInput.attr('readonly', 'readonly');
					nombreInput.attr('disabled', false); // No usar disabled porque no se envía en el form
					
					// Agregar estilo CSS para prevenir interacción
					nombreInput.css({
						'pointer-events': 'none',
						'background-color': '#f5f5f5',
						'cursor': 'not-allowed',
						'opacity': '0.7'
					});
					
					// También ocultar el botón de búsqueda si existe
					target.find('button.show.item').hide();
					target.find('button.ui-icon-document.detail.item').hide();
					
					// Destruir autocomplete si existe
					if (nombreInput.hasClass('ui-autocomplete-input')) {
						nombreInput.autocomplete('destroy');
					}
					
					// Marcar el campo como guardado para prevenir edición futura
					nombreInput.data('item-guardado', true);
					target.data('nombre-bloqueado', true);
					
					console.log('[saveRow] Campo nombre bloqueado. Readonly:', nombreInput.prop('readonly'));
				};
				
				// Ejecutar inmediatamente
				bloquearNombre();
				setTimeout(bloquearNombre, 100);
				setTimeout(bloquearNombre, 500);
			}

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
		error: function () {
			toastr.error('No se pudo guardar el item');
			$(element).val($(element).data('old-value'));
		}
	});
};

var addAllItems = function (title) {
	confirm('¿Desea cargar todos los ítems de la categoría a la misma?').done(function (data) {
		if (data) {
			unaBase.ui.block();
			$.ajax({
				url: '/4DACTION/_V3_getProductoByCategoria',
				data: {
					id: title.data('categoria'),
					strict: true
				},
				dataType: 'json',
				success: function (data) {
					if (data.rows.length > 0) {
						for (var i = data.rows.length - 1; i >= 0; i--) {
							var item = data.rows[i];

							var htmlObject = getElement.item('insertAfter', title);
							try {
								htmlObject[0].dataset.producto = item.producto.id;
							} catch (err) {
								console.log(err);
							}

							htmlObject.data('producto', item.id);
							htmlObject.find('[name="item[][codigo]"]').val(item.index);
							htmlObject.find('[name="item[][unidad]"]').val(item.unidad);
							htmlObject.find('[name="item[][horas_extras]"]').val(0);
							htmlObject.find('[name="item[][precio_unitario]"]').val(item.precio).data('old-value', item.precio);
							htmlObject.find('[name="item[][subtotal_precio]"]').val(item.precio);
							htmlObject.find('[name="item[][aplica_sobrecargo]"]').prop('checked', item.aplica_sobrecargo);

							if (item.porcentaje_monto_total == 0) {
								htmlObject.find('[name="item[][precio_unitario]"]').val(item.precio / exchange_rate).data('old-value', item.precio);
								htmlObject.find('[name="item[][subtotal_precio]"]').val(item.precio / exchange_rate);

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
								htmlObject.find('[name="item[][tipo_documento]"]').prop('readonly', true);
								htmlObject.find('button.show.tipo-documento').hide();
								htmlObject.find('[name="item[][tipo_documento_compras]"]').prop('readonly', true);
								htmlObject.find('button.show.tipo-documento').hide();
								//htmlObject.find('[name="item[][cantidad]"]').prop('readonly', true);
								htmlObject.find('[name="item[][factor]"]').prop('readonly', true);
							} else {
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
								htmlObject.find('[name="item[][tipo_documento_compras]"]').prop('readonly', true);
								htmlObject.find('button.show.tipo-documento').hide();
								//htmlObject.find('[name="item[][cantidad]"]').prop('readonly', true);
								htmlObject.find('[name="item[][factor]"]').prop('readonly', true);
							} else {
								htmlObject.removeData('formula-asistente-produccion');
							}

							if (item.porcentaje_monto_total || item.formula_productor_ejecutivo || item.formula_asistente_produccion) {
								htmlObject.find('.remove.item').remove();
								htmlObject.find('.insert.item').remove();
								htmlObject.find('.clone.item').remove();
								//simon 29/11/18
								htmlObject.find('.parent.item').remove();
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
								<p>Nombre ítem:</p> \
								<p>' + item.text + '</p> \
								<p>&nbsp;</p> \
								<p>Descripción larga:</p> \
								<p>' + ((item.observacion != '') ? item.observacion.replace(/\n/g, '</p><p>') : 'N/A') + '</p> \
							';
							htmlObject.find('button.profile.item').tooltipster('update', tooltip);

							// Mostrar signo de admiración (ui-icon-notice) si el ítem tiene comentario
							// caso contrario mostrar ícono normal (ui-icon-gear)
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


							if (typeof item.tipo_documento != 'undefined' && item.tipo_documento.id != 30 && item.tipo_documento.id != 33) {
								htmlObject.data('tipo-documento', item.tipo_documento.id);
								htmlObject.find('input[name="item[][tipo_documento]"]').val(item.tipo_documento.abbr);
								htmlObject.data('tipo-documento-text', item.tipo_documento.text);
								htmlObject.data('tipo-documento-ratio', item.tipo_documento.ratio);

								htmlObject.data('tipo-documento-valor-usd', item.tipo_documento.valor_usd);
								htmlObject.data('tipo-documento-valor-moneda', item.tipo_documento.valor_moneda.replaceAll(',', '.')); // Impuesto extranjero
								htmlObject.data('tipo-documento-inverse', item.tipo_documento.inverse);
								if (item.tipo_documento.ratio != 0) {
									htmlObject.find('[name="item[][precio_unitario]"]').addClass('edited');
									htmlObject.find('button.detail.price').visible();
								}

								htmlObject.data('tipo-documento-compras', item.tipo_documento.id);
								htmlObject.find('input[name="item[][tipo_documento_compras]"]').val(item.tipo_documento.abbr);
								htmlObject.data('tipo-documento-compras-text', item.tipo_documento.text);
								htmlObject.data('tipo-documento-compras-ratio', item.tipo_documento.ratio);
								htmlObject.data('tipo-documento-compras-valor-usd', item.tipo_documento.valor_usd);
								htmlObject.data('tipo-documento-compras-valor-moneda', item.tipo_documento.valor_moneda.replaceAll(',', '.')); // Impuesto extranjero
								htmlObject.data('tipo-documento-compras-inverse', item.tipo_documento.inverse);
								if (item.tipo_documento.ratio != 0) {
									htmlObject.find('[name="item[][precio_unitario]"]').addClass('edited');
									htmlObject.find('button.detail.price').visible();
								}

							} else {
								htmlObject.removeData('tipo-documento');
								htmlObject.removeData('tipo-documento-text');
								htmlObject.removeData('tipo-documento-ratio');
								htmlObject.removeData('tipo-documento-valor-usd');
								htmlObject.removeData('tipo-documento-valor-moneda'); // Impuesto extranjero
								htmlObject.removeData('tipo-documento-inverse');
								htmlObject.removeData('tipo-documento-compras');
								htmlObject.removeData('tipo-documento-compras-text');
								htmlObject.removeData('tipo-documento-compras-ratio');
								htmlObject.removeData('tipo-documento-compras-valor-usd');
								htmlObject.removeData('tipo-documento-compras-valor-moneda'); // Impuesto extranjero
								htmlObject.removeData('tipo-documento-compras-inverse');


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

						updateSubtotalTitulos(source, "line 3268 editor library");
						//simon itemparent start

						updateSubtotalParents(source);

						//simon itemparent end

						console.warn('update4')
						//if (!modoOffline) {
						updateSubtotalItems();
						updateIndexes();
						//}

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

var afterEditEmpresa2 = function (element) {
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


// Sección datos cinemágica
var blockTotales = $('article.block-totales');
var blockCinemagica = $('article.block-cinemagica');


var resetItemsAutomaticos = function (event) {
	$('section.sheet table.items tbody tr:not(.title)').each(function (key, item) {
		var costo_admin = $(item).data('costo-admin');
		var formula_productor_ejecutivo = $(item).data('formula-productor-ejecutivo');
		var formula_productor_ejecutivo_ratio = $(item).data('formula-productor-ejecutivo-ratio');
		var formula_asistente_produccion = $(item).data('formula-asistente-produccion');
		if (costo_admin || formula_productor_ejecutivo || formula_asistente_produccion) {
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
	//blockCinemagica.find('[name="cotizacion[cinemagica][costos_directos]"]').val(costos_directos);
	$('[name="cotizacion[cinemagica][costos_directos]"]').val(costos_directos);
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
				}
			}

			// Fórmula productor ejecutivo
			if (typeof $(this).data('formula-productor-ejecutivo') != 'undefined') {
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
							item.find('input[name="item[][costo_unitario]"]').val(precio_unitario).data('old-value', precio_unitario);
							if (i == 29) item.find('input[name="item[][precio_unitario]"]').trigger('blur');
							console.log('Precio en el campo: ', item.find('input[name="item[][precio_unitario]"]').val());
						}
					} else {
						console.log('Precio calculado: ', precio_unitario);
						//precio_unitario = precio_unitario.toFixed(2).replace('.', ',');
						item.find('input[name="item[][precio_unitario]"]').val(precio_unitario).data('old-value', precio_unitario);//.trigger('blur');
						item.find('input[name="item[][costo_unitario]"]').val(precio_unitario).data('old-value', precio_unitario);
						item.find('input[name="item[][precio_unitario]"]').trigger('blur');
						console.log('Precio en el campo: ', item.find('input[name="item[][precio_unitario]"]').val());
					}
				}
			}

			// Fórmula asistente producción
			if (typeof $(this).data('formula-asistente-produccion') != 'undefined') {
				item = $(this);

				var id_item = item.data('id');
				var cantidad = parseFloat(item.find('input[name="item[][cantidad]"]').data('old-value'));
				var factor = parseFloat(item.find('input[name="item[][factor]"]').data('old-value'));

				precio_unitario = ((valor_pelicula > 200000000) ? 200000000 * comision_asistente : valor_pelicula * comision_asistente) / (cantidad * factor);
				if (typeof item != 'undefined' && ((fixedTotalCliente && (precio_unitario == 0 || precio_unitario != parseFloat((item.find('input[name="item[][precio_unitario]"]').data('old-value')) ? item.find('input[name="item[][precio_unitario]"]').data('old-value') : item.find('input[name="item[][precio_unitario]"]').val()))) || !fixedTotalCliente)) {
					item.find('input[name="item[][precio_unitario]"]').val(precio_unitario).data('old-value', precio_unitario).trigger('blur');
					item.find('input[name="item[][costo_unitario]"]').val(precio_unitario).data('old-value', precio_unitario).trigger('blur');
				}
			}

		});
	}
};

var fillValoresCinemagica = function (data, retval) {
	// Llenado del formulario con valores calculados
	var current = $('section.sheet.detalle-items table.items tbody').find('tr').first();
	for (var index = 0, len = data.rows.length; index < len; index++) {
		var item = data.rows[index];

		if (!item.titulo && (item.formula_productor_ejecutivo || item.formula_asistente_produccion || item.formula_horas_extras || item.porcentaje_monto_total)) {
			current.find('input[name="item[][cantidad]"]').val(item.cantidad).data('old-value', item.cantidad);
			current.find('input[name="item[][factor]"]').val(item.factor).data('old-value', item.factor);
			current.find('input[name="item[][precio_unitario]"]').val(item.precio.unitario);
			current.find('input[name="item[][subtotal_precio]"]').val(item.precio.subtotal);
			// Actualiza previo y gasto P
			//current.find('input[name="item[][costo_unitario_previo]"]').val(item.precio.unitario);
			//current.find('input[name="item[][subtotal_costo_previo]"]').val(item.precio.subtotal);
			current.find('input[name="item[][costo_unitario]"]').val(item.precio.unitario);
			current.find('input[name="item[][subtotal_costo]"]').val(item.precio.subtotal);

			current.data('base-imponible', item.hora_extra.base_imponible);

			updateSubtotalTitulos(current);
		}

		current = current.next();

	}

	blockCinemagica.find('[name="sobrecargo[1][porcentaje]"]').val(retval.extra.utilidad_bruta.porcentaje);
	blockCinemagica.find('[name="sobrecargo[1][valor]"]').val(retval.extra.utilidad_bruta.monto);
	blockCinemagica.find('[name="sobrecargo[1][subtotal]"]').val(retval.extra.valor_pelicula);

	//blockCinemagica.find('[name="cotizacion[cinemagica][costos_directos]"]').val(retval.extra.costos_directos);
	$('[name="cotizacion[cinemagica][costos_directos]"]').val(retval.extra.costos_directos);
	$('[name="cotizacion[costos][subtotal_directo]"]').val(retval.extra.costo_presupuestado_directo);
	$('[name="cotizacion[utilidades][subtotal_directo]"]').val(retval.extra.costos_directos - retval.extra.costo_presupuestado_directo);
	$('[name="cotizacion[margenes][margen_venta_directo]"]').val(((retval.extra.costos_directos - retval.extra.costo_presupuestado_directo) / retval.extra.costos_directos) * 100.00);
	if (margen_desde_compra_inverso) {
		$('[name="cotizacion[margenes][margen_compra_directo]"]').val((1 - ((retval.extra.costos_directos - retval.extra.costo_presupuestado_directo) / retval.extra.costos_directos)) * 100.00);
	} else {
		$('[name="cotizacion[margenes][margen_compra_directo]"]').val(((retval.extra.costos_directos - retval.extra.costo_presupuestado_directo) / retval.extra.costo_presupuestado_directo) * 100.00);
	}

	var exchange_rate_usd = (valor_usd_cotizacion > 0) ? valor_usd_cotizacion : valor_usd;
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

	$('span[name="cotizacion[ajuste]"]').text((retval.extra.total_neto).toFixed(currency.decimals)).number(true, currency.decimals, ',', '.');

	var impuesto = 0;
	if (blockCinemagica.find('[name="cotizacion[montos][impuesto][exento]"]').is(':checked')) {
		blockCinemagica.find('[name="cotizacion[montos][impuesto]"]').val(0);
	} else {
		var porcentaje_impuesto = parseFloat(blockCinemagica.find('[name="cotizacion[montos][impuesto]"]').data('porcentaje'));
		var impuesto = retval.extra.total_neto * porcentaje_impuesto / 100;
		blockCinemagica.find('[name="cotizacion[montos][impuesto]"]').val(impuesto);
	}
	blockCinemagica.find('[name="cotizacion[montos][total]"]').val(retval.extra.total_neto + impuesto);

	// Actualizar costos y utilidades
	var utilidad_items = parseFloat($('[name="cotizacion[utilidades][subtotal]"]').val());
	var costo_items = parseFloat($('[name="cotizacion[costos][subtotal]"]').val());

	var utilidad_sobrecargos = 0;
	var costo_sobrecargos = 0;

	$('section.sobrecargos li').each(function () {
		var target = $(this).find('[name^="sobrecargo"][name$="[valor]"]');
		if (target.hasClass('utilidad'))
			utilidad_sobrecargos += parseFloat(target.val());
		else
			costo_sobrecargos += parseFloat(target.val());
	});

	var descuento = 0;

	if (typeof selected_currency == 'undefined') {
		var utilidad_total = (utilidad_items + utilidad_sobrecargos - descuento).toFixed(currency.decimals);
		var costo_total = (costo_items + costo_sobrecargos).toFixed(currency.decimals);
	} else {
		var utilidad_total = (utilidad_items + utilidad_sobrecargos - descuento).toFixed(2);
		var costo_total = (costo_items + costo_sobrecargos).toFixed(2);
	}

	$('input[name="cotizacion[montos][utilidad]"]').val(utilidad_total);
	$('input[name="cotizacion[montos][costo]"]').val(costo_total);
	$('span[name="cotizacion[montos][utilidad]"]').text(utilidad_total.replace('.', ','));
	$('span[name="cotizacion[montos][costo]"]').text(costo_total.replace('.', ','));
	if (typeof selected_currency == 'undefined') {
		$('span[name="cotizacion[montos][utilidad]"]').number(true, currency.decimals, ',', '.');
		$('span[name="cotizacion[montos][costo]"]').number(true, currency.decimals, ',', '.');
	} else {
		$('span[name="cotizacion[montos][utilidad]"]').number(true, 2, ',', '.');
		$('span[name="cotizacion[montos][costo]"]').number(true, 2, ',', '.');
	}

	var subtotal_neto = parseFloat($('input[name="cotizacion[ajuste]"]').val());

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
	$('input[name="cotizacion[montos][utilidad_ratio]"]').val(utilidad_ratio);
	$('input[name="cotizacion[montos][costo_ratio]"]').val(costo_ratio);

	if ($('input[name="cotizacion[montos][utilidad_ratio]"]').length > 0)
		$('span[name="cotizacion[montos][utilidad_ratio]"]').text($('input[name="cotizacion[montos][utilidad_ratio]"]').val().replace('.', ','));
	if ($('input[name="cotizacion[montos][costo_ratio]"]').length > 0)
		$('span[name="cotizacion[montos][costo_ratio]"]').text($('input[name="cotizacion[montos][costo_ratio]"]').val().replace('.', ','));


	updateSubtotalItems(true);
	updateVistaItems(true);

	totales.updateTotalUtilidadCosto();

	console.log(retval);

	
};


