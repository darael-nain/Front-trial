if (typeof selected_currency == 'undefined')
	var localCurrency = currency.symbol;
else {
	//var localCurrency = selected_currency;
	var localCurrency = currency.symbol;

}

var arrSobregargosPreFinal = [];
var tiposDocumento = []

$(document).ready(function () {

	const setTipoDocumento = (row, tiposDocumento, path) => {
		let selectObject = row.find(`.form-select.tipo-documento${path}`);

		var defaultOption = $('<option>', {
			text: 'Tipo doc',
			value: '',
			disabled: true
		});
		selectObject.append(defaultOption);

		tiposDocumento.forEach(function (tipoDocumento) {
			var option = $('<option>', {
				text: tipoDocumento.text,
				value: tipoDocumento.id,
				"data-id": tipoDocumento.id,
				"data-abbr": tipoDocumento.abbr,
				"data-text": tipoDocumento.text
			});
			selectObject.append(option);
		});

        // Elegir valor por defecto: data() -> FE
        let id_documento;
        const dataKey = path === '-select' ? 'tipo-documento' : 'tipo-documento-compras';
        const dataDefaultId = row.data(dataKey);
        if (dataDefaultId) {
            id_documento = dataDefaultId;
        } else {
            const fe = tiposDocumento.find(v => (v.abbr || '').toUpperCase() === 'FE')
                || tiposDocumento.find(v => /factura/i.test(v.text));
            if (fe) id_documento = fe.id;
        }

        if (id_documento) {
            selectObject.val(id_documento);
        }

        // Fallback: si sigue en blanco, seleccionar explícitamente la opción FE
        if (!selectObject.val()) {
            const optFe = selectObject.find('option').filter(function () {
                const ab = ($(this).data('abbr') || '').toString().toUpperCase();
                const tx = ($(this).data('text') || '').toString().toLowerCase();
                return ab === 'FE' || (tx.includes('factura') && tx.includes('electr'));
            }).first();
            if (optFe.length) {
                selectObject.val(optFe.val());
            }
        }

        // Mostrar abreviatura del seleccionado
        const selectedOption = selectObject.find('option:selected');
        if (selectedOption.index() > 0) {
            selectedOption.text(selectedOption.data('abbr'));
        }

		selectObject.on('change', function () {
			let selectedOption = $(this).find('option:selected');
			if (selectedOption.index() > 0) {
				selectedOption.text(selectedOption.data('abbr'));
			}
		});

		selectObject.on('mousedown', function () {
			$(this).find('option').each(function (i, option) {
				if (i > 0) {
					$(option).text($(option).data('text'));
				}
			});
		});

        selectObject.on('blur', function () {
			let selectedOption = $(this).find('option:selected');
			if (selectedOption.index() > 0) {
				selectedOption.text(selectedOption.data('abbr'));
			}
		});

        // No resetear si ya se seleccionó un valor por defecto
        if (!selectObject.val()) {
            selectObject.val('');
        }
	}
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

	if (typeof selected_currency == 'undefined') {
		$('section.sheet').find('tfoot .numeric.currency input').number(true, currency.decimals, ',', '.');
		$('section.sheet').find('footer section:not(.sobrecargos) .numeric.currency input').number(true, currency.decimals, ',', '.');
	} else {
		$('section.sheet').find('tfoot .numeric.currency input').number(true, 2, ',', '.');
		$('section.sheet').find('footer section:not(.sobrecargos) .numeric.currency input').number(true, 2, ',', '.');
	}

	$('section.sheet').find('tfoot .numeric.percent input').number(true, 2, ',', '.');
	$('section.sheet').find('footer section:not(.sobrecargos) .numeric.percent input:not([name="cotizacion[descuento][porcentaje]"])').number(true, 2, ',', '.');

	$('section.sheet table > thead button.toggle.all').click(function () {
		if ($(this).hasClass('ui-icon-folder-open')) {
			$(this).removeClass('ui-icon-folder-open');
			$(this).addClass('ui-icon-folder-collapsed');
			$(this).attr('title', 'Contraer todo');
			$('section.sheet table > tbody > tr.title button.toggle.categoria.ui-icon-folder-open').each(function (key, element) {
				$(element).trigger('click');
			});
		} else {
			$(this).removeClass('ui-icon-folder-collapsed');
			$(this).addClass('ui-icon-folder-open');
			$(this).attr('title', 'Expandir todo');
			$('section.sheet table > tbody > tr.title button.toggle.categoria.ui-icon-folder-collapsed').each(function (key, element) {
				$(element).trigger('click');
			});
		}
	});

	$('section.sheet table').on('click', 'tbody tr.title button.toggle.categoria', function () {
		//TODO verificar calcular sin hacer trigger del click, entra por cada categoria para calcular totales
		var target = $(this);

		var collapsed = target.hasClass('ui-icon-folder-collapsed');

		if (collapsed)
			target.removeClass('ui-icon-folder-collapsed').addClass('ui-icon-folder-open');
		else
			target.removeClass('ui-icon-folder-open').addClass('ui-icon-folder-collapsed');

		var titles = target.parentTo('tr').nextUntil('.title');

		if (collapsed) {
			titles.removeClass('collapsed');
			target.parentTo('tr').find('.info:eq(0)').html('');
			target.parentTo('tr').find('.info:eq(1)').html('');

		} else {
			titles.addClass('collapsed');
			target.parentTo('tr').find('.info:eq(0)').html(titles.length + '&nbsp;ítem' + ((titles.length > 1) ? 's' : ''));

			var total = 0;
			$('section.sheet table.items > tbody > tr.title').each(function () {
				total += parseFloat($(this).find('input[name="item[][subtotal_precio]"]').val());
			});
			var subtotal = parseFloat(target.parentTo('tr').find('input[name="item[][subtotal_precio]"]').val());
			var ratio = (total > 0) ? subtotal / total : 0;
			target.parentTo('tr').find('.info:eq(1)').html((ratio * 100).toFixed(2) + '%');

		}
		$('#tabs-2').trigger('scroll');

		// $('.item').removeClass('collapsed');
	});
	$('section.sheet table').on('click', 'tbody tr.itemParent button.toggle.categoria', function () {

		var target = $(this);

		var collapsed = target.hasClass('ui-icon-folder-collapsed');

		if (collapsed)
			target.removeClass('ui-icon-folder-collapsed').addClass('ui-icon-folder-open');
		else
			target.removeClass('ui-icon-folder-open').addClass('ui-icon-folder-collapsed');

		var titles = target.parentTo('tr').nextUntil('.title,.itemParent,:not(.childItem)');

		if (collapsed) {
			titles.removeClass('collapsed');
			target.parentTo('tr').find('.info:eq(0)').html('');
			target.parentTo('tr').find('.info:eq(1)').html('');

		} else {
			titles.addClass('collapsed');
			target.parentTo('tr').find('.info:eq(0)').html(titles.length + '&nbsp;ítem' + ((titles.length > 1) ? 's' : ''));

			var total = 0;
			$('section.sheet table.items > tbody > tr.itemParent').each(function () {
				total += parseFloat($(this).find('input[name="item[][subtotal_precio]"]').val());
			});
			var subtotal = parseFloat(target.parentTo('tr').find('input[name="item[][subtotal_precio]"]').val());
			var ratio = (total > 0) ? subtotal / total : 0;
			target.parentTo('tr').find('.info:eq(1)').html((ratio * 100).toFixed(2) + '%');

		}
		$('#tabs-2').trigger('scroll');
	});

	// htmlObject.find('button.add.all-items').click(function() {
	$('section.sheet table').on('click', 'tbody tr.title button.add.all-items', function (event) {
		var htmlObject = $(event.target).closest('tr');
		if (htmlObject.data('categoria'))
			addAllItems(htmlObject);
		else
			toastr.warning('Para utilizar esta opción, debe seleccionar una categoría existente en el catálogo.');
	});

	$('section.sheet table').on('change', 'tr.title th input[name="item[][selected]"]', function (event) {
		if (!event.isSimulated) {
			var is_checked = $(event.target).prop('checked');
			$(this).closest('tr').nextUntil('tr.title').each(function (key, item) {
				$(item).find('input[name="item[][selected]"]').prop('checked', is_checked);
			});
		}
	});

	$('section.sheet table').on('focusout', 'tbody tr.title input[name="item[][nombre]"]', function () {
		var htmlObject = $(this).closest('tr');
		var inputObject = $(this);
		if (ingreso_simple_items_cot_neg && inputObject.val().trim() != '') {
			$.ajax({
				url: '/4DACTION/_V3_setCategoria',
				data: {
					text: inputObject.val(),
					replace: true
				},
				dataType: 'json',
				async: false,
				cache: false,
				success: function (data) {
					htmlObject.data('categoria', data.id);
					// Si la categoría se guardó exitosamente, guardar el ID
					if (data.id) {
						htmlObject.data('id', data.id);
						htmlObject[0].dataset.id = data.id;
					}
				}
			});
			htmlObject.trigger('change');
		}
	});

	// htmlObject.focusin(function() {
	$('section.sheet table').on('focusin', 'tbody tr.title', function (event) {
		var htmlObject = $(this);
		var inputObject = $(this).find('input[name="item[][nombre]"]');

		if (!ingreso_simple_items_cot_neg) {
			// Guardar el valor inicial antes de inicializar el autocomplete
			var initialValue = inputObject.val();
			if (initialValue && initialValue.trim() !== '') {
				inputObject.data('before-search-value', initialValue);
			}

			// Interceptor para guardar el valor antes de que el usuario escriba
			inputObject.on('focus', function() {
				var currentVal = $(this).val();
				if (currentVal && currentVal.trim() !== '') {
					$(this).data('before-search-value', currentVal);
				}
			});

			inputObject.autocomplete({
				source: function (request, response) {
					inputObject.data('ajax-call', true);
					
					// Guardar el valor actual ANTES de buscar
					var currentVal = inputObject.val();
					if (!inputObject.data('before-search-value') && currentVal && currentVal.trim() !== '' && currentVal !== request.term) {
						console.log('[EDITOR.JS CATEGORIA AUTOCOMPLETE] Guardando valor antes de búsqueda:', currentVal, 'Término:', request.term);
						inputObject.data('before-search-value', currentVal);
					} else if (currentVal && currentVal.trim() !== '' && currentVal !== request.term) {
						var savedValue = inputObject.data('before-search-value');
						if (!savedValue || savedValue !== currentVal) {
							console.log('[EDITOR.JS CATEGORIA AUTOCOMPLETE] Actualizando valor guardado:', currentVal);
							inputObject.data('before-search-value', currentVal);
						}
					}
					
					$.ajax({
						url: '/4DACTION/_V3_' + 'getCategoria',
						dataType: 'json',
						data: {
							q: request.term,
							area_negocio: $('[name="cotizacion[area_negocio]"]').data('id'),
							from: 'negocio'
						},
						success: function (data) {
							// Si no hay resultados, restaurar el valor que tenía antes de la búsqueda
							if (data.rows.length === 0) {
								var savedValue = inputObject.data('before-search-value');
								var searchTerm = request.term;
								
								console.log('[EDITOR.JS CATEGORIA AUTOCOMPLETE] Sin resultados. Valor guardado:', savedValue, 'Término buscado:', searchTerm, 'Valor actual:', inputObject.val());
								
								// No mostrar sugerencias
								response([]);
								
								// Restaurar el valor guardado SIEMPRE cuando no hay resultados
								if (savedValue && savedValue.trim() !== '') {
									// Forzar el valor ANTES de que jQuery UI procese la respuesta vacía
									inputObject.val(savedValue);
									
									// Restaurar inmediatamente después de que jQuery UI procese la respuesta
									setTimeout(function() {
										var currentVal = inputObject.val();
										if (currentVal === searchTerm || !currentVal || currentVal.trim() === '') {
											console.log('[EDITOR.JS CATEGORIA AUTOCOMPLETE] Restaurando valor guardado (50ms):', savedValue, 'Valor actual:', currentVal);
											inputObject.val(savedValue);
											inputObject.trigger('change');
										}
									}, 50);
									
									// Restaurar de nuevo después de un delay más largo como respaldo
									setTimeout(function() {
										var currentVal = inputObject.val();
										if (currentVal === searchTerm || !currentVal || currentVal.trim() === '') {
											console.log('[EDITOR.JS CATEGORIA AUTOCOMPLETE] Restaurando valor guardado (300ms respaldo):', savedValue);
											inputObject.val(savedValue);
											inputObject.trigger('change');
										}
									}, 300);
									
									// Último intento después de más tiempo
									setTimeout(function() {
										var currentVal = inputObject.val();
										if (currentVal === searchTerm || !currentVal || currentVal.trim() === '') {
											console.log('[EDITOR.JS CATEGORIA AUTOCOMPLETE] Restaurando valor guardado (1000ms respaldo final):', savedValue);
											inputObject.val(savedValue);
											inputObject.trigger('change');
										}
									}, 1000);
								} else {
									console.warn('[EDITOR.JS CATEGORIA AUTOCOMPLETE] No hay valor guardado para restaurar');
								}
							} else {
								response($.map(data.rows, function (item) {
									return item;
								}));
							}
							setTimeout(function () {
								inputObject.removeData('ajax-call');
							}, 1500);
						},
						error: function (jqXHR, exception) {
							toastr.error('No se pudo cargar el listado de categorías. Error de conexión al servidor.');
							inputObject.removeData('ajax-call');
						}
					});
				},
				minLength: 0,
				delay: 0,
				position: { my: "left top", at: "left bottom", collision: "flip" },
				search: function(event, ui) {
					// Guardar el valor antes de que el usuario empiece a buscar
					var currentVal = $(this).val();
					if (currentVal && currentVal.trim() !== '' && !$(this).data('before-search-value')) {
						$(this).data('before-search-value', currentVal);
					}
				},
				response: function(event, ui) {
					// Interceptar cuando no hay resultados
					if (!ui.content || ui.content.length === 0) {
						var savedValue = inputObject.data('before-search-value');
						if (savedValue) {
							setTimeout(function() {
								var currentVal = inputObject.val();
								// Restaurar si está vacío o si el valor actual no es el guardado
								if (!currentVal || currentVal.trim() === '' || currentVal !== savedValue) {
									console.log('[EDITOR.JS CATEGORIA AUTOCOMPLETE response] Restaurando valor guardado:', savedValue);
									inputObject.val(savedValue);
									inputObject.trigger('change');
								}
							}, 250);
						}
					}
				},
				open: function () {
					$(this).removeClass('ui-corner-all').addClass('ui-corner-top');
					// Guardar el valor actual cuando se abre el autocomplete
					var currentVal = $(this).val();
					if (currentVal && currentVal.trim() !== '') {
						$(this).data('before-search-value', currentVal);
					}
				},
				close: function () {
					$(this).removeClass('ui-corner-top').addClass('ui-corner-all');
					// Si el campo tenía un valor antes de abrir el autocomplete y no se seleccionó nada, restaurarlo
					var currentValue = $(this).val();
					var savedValue = $(this).data('before-search-value');
					if (savedValue && (!currentValue || currentValue.trim() === '')) {
						console.log('[EDITOR.JS CATEGORIA AUTOCOMPLETE close] Campo vacío al cerrar, restaurando:', savedValue);
						$(this).val(savedValue);
						$(this).trigger('change');
					}
				},
				focus: function (event, ui) {
					//$(this).val(ui.item.text);
					return false;
				},
				select: function (event, ui) {
					$(this).val(ui.item.text);
					// Guardar el valor seleccionado para restaurarlo si la búsqueda futura no encuentra resultados
					$(this).data('before-search-value', ui.item.text);
					var target = htmlObject;
					target.data('categoria', ui.item.id);
					// Guardar el ID de la categoría, pero NO bloquear todavía (solo después de guardar)
					if (ui.item.id) {
						target.data('id', ui.item.id);
						target[0].dataset.id = ui.item.id;
					}
					target.find('[name="item[][ocultar_print]"]').prop('checked', ui.item.ocultar_print);

					$(this).trigger('change');
					return false;
				}

			}).data('ui-autocomplete')._renderItem = function (ul, item) {
				return $('<li><a><strong>' + ((item.especial) ? 'Especial' : '') + '</strong><em>' + ((item.gasto_fijo) ? 'Gasto Fijo' : '') + '</em><span class="highlight">' + item.text + '</span></a></li>').appendTo(ul);
			};
		}
	});

	// htmlObject.focusout(function() {
	$('section.sheet table').on('focusout', 'tbody tr.title', function () {
		if ($(this).find('input[name="item[][nombre]"]').hasClass('ui-autocomplete-input'))
			$(this).find('input[name="item[][nombre]"]').autocomplete('destroy');
	});


	$('section.sheet table').on('focusout', 'tbody tr:not(.title) input[name="item[][nombre]"]', function () {
		var htmlObject = $(this).closest('tr');
		var inputObject = $(this);
		if (ingreso_simple_items_cot_neg && inputObject.val().trim() != '') {
			$.ajax({
				url: '/4DACTION/_V3_setProductoByCategoria',
				data: {
					id: htmlObject.prevTo('.title').data('categoria'),
					text: inputObject.val(),
					replace: true
				},
				dataType: 'json',
				async: false,
				cache: false,
				success: function (data) {
					htmlObject.data('producto', data.id);
				}
			});
			if (!modoOffline) {
				updateSubtotalTitulos($(this));
				//updateSubtotalItems();
			}
		}
	});

	// htmlObject.focusin(function() {
	$('section.sheet table').on('focusin', 'tbody tr:not(.title):not(.itemParent)', function () {
		var htmlObject = $(this);
		htmlObject.addClass('focused'); // Fondo línea que se está trabajando
		var inputObject = $(this).find('input[name="item[][nombre]"]');
		
		console.log('[EDITOR.JS FOCUSIN] Evento focusin disparado. Valor actual:', inputObject.val(), 'Item ID:', htmlObject.data('id'));
		
		// Guardar el valor inicial antes de inicializar el autocomplete
		var initialValue = inputObject.val();
		if (initialValue && initialValue.trim() !== '') {
			inputObject.data('before-search-value', initialValue);
			console.log('[EDITOR.JS FOCUSIN] Valor guardado como before-search-value:', initialValue);
		}
		
		if (!ingreso_simple_items_cot_neg) {
			inputObject.autocomplete({
				source: function (request, response) {
					inputObject.data('ajax-call', true);
					
					// Guardar el valor actual ANTES de buscar
					var currentVal = inputObject.val();
					if (!inputObject.data('before-search-value') && currentVal && currentVal.trim() !== '' && currentVal !== request.term) {
						console.log('[EDITOR.JS AUTOCOMPLETE] Guardando valor antes de búsqueda:', currentVal, 'Término:', request.term);
						inputObject.data('before-search-value', currentVal);
					} else if (currentVal && currentVal.trim() !== '' && currentVal !== request.term) {
						var savedValue = inputObject.data('before-search-value');
						if (!savedValue || savedValue !== currentVal) {
							console.log('[EDITOR.JS AUTOCOMPLETE] Actualizando valor guardado:', currentVal);
							inputObject.data('before-search-value', currentVal);
						}
					}
					
					$.ajax({
						url: '/4DACTION/_V3_' + 'getProductoByCategoria',
						dataType: 'json',
						data: {
							q: request.term,
							id: htmlObject.prevTo('.title').data('categoria')
						},
						success: function (data) {
							// Si no hay resultados, restaurar el valor que tenía antes de la búsqueda
							if (data.rows.length === 0) {
								var savedValue = inputObject.data('before-search-value');
								var searchTerm = request.term;
								
								console.log('[EDITOR.JS AUTOCOMPLETE] Sin resultados. Valor guardado:', savedValue, 'Término buscado:', searchTerm, 'Valor actual:', inputObject.val());
								
								// No mostrar sugerencias
								response([]);
								
								// Restaurar el valor guardado SIEMPRE cuando no hay resultados
								if (savedValue && savedValue.trim() !== '') {
									// Forzar el valor ANTES de que jQuery UI procese la respuesta vacía
									inputObject.val(savedValue);
									
									// Restaurar inmediatamente después de que jQuery UI procese la respuesta
									setTimeout(function() {
										var currentVal = inputObject.val();
										if (currentVal === searchTerm || !currentVal || currentVal.trim() === '') {
											console.log('[EDITOR.JS AUTOCOMPLETE] Restaurando valor guardado:', savedValue, 'Valor actual:', currentVal);
											inputObject.val(savedValue);
											inputObject.trigger('change');
										}
									}, 50);
									
									// Restaurar de nuevo después de un delay más largo como respaldo
									setTimeout(function() {
										var currentVal = inputObject.val();
										if (currentVal === searchTerm || !currentVal || currentVal.trim() === '') {
											console.log('[EDITOR.JS AUTOCOMPLETE] Restaurando valor guardado (respaldo):', savedValue);
											inputObject.val(savedValue);
											inputObject.trigger('change');
										}
									}, 300);
									
									// Último intento después de más tiempo
									setTimeout(function() {
										var currentVal = inputObject.val();
										if (currentVal === searchTerm || !currentVal || currentVal.trim() === '') {
											console.log('[EDITOR.JS AUTOCOMPLETE] Restaurando valor guardado (último intento):', savedValue);
											inputObject.val(savedValue);
											inputObject.trigger('change');
										}
									}, 1000);
								} else {
									console.warn('[EDITOR.JS AUTOCOMPLETE] No hay valor guardado para restaurar');
								}
							} else {
								response($.map(data.rows, function (item) {
									return item;
								}));
							}
							setTimeout(function () {
								inputObject.removeData('ajax-call');
							}, 1500);
						},
						error: function (jqXHR, exception) {
							toastr.error('No se pudo cargar el listado de items. Error de conexión al servidor.');
							inputObject.removeData('ajax-call');
						}
					});
				},
				minLength: 0,
				delay: 0,
				position: { my: "left top", at: "left bottom", collision: "flip" },
				search: function(event, ui) {
					// Guardar el valor antes de que el usuario empiece a buscar
					var currentVal = $(this).val();
					if (currentVal && currentVal.trim() !== '' && !$(this).data('before-search-value')) {
						$(this).data('before-search-value', currentVal);
					}
				},
				response: function(event, ui) {
					// Interceptar cuando no hay resultados
					if (!ui.content || ui.content.length === 0) {
						var savedValue = inputObject.data('before-search-value');
						console.log('[EDITOR.JS response] Sin contenido. Valor guardado:', savedValue, 'Valor actual:', inputObject.val());
						if (savedValue && savedValue.trim() !== '') {
							// Restaurar inmediatamente
							var currentVal = inputObject.val();
							if (currentVal !== savedValue) {
								console.log('[EDITOR.JS response] Restaurando inmediatamente:', savedValue);
								inputObject.val(savedValue);
								inputObject.trigger('change');
							}
							
							// Verificaciones adicionales
							setTimeout(function() {
								var currentVal = inputObject.val();
								if (!currentVal || currentVal.trim() === '' || currentVal !== savedValue) {
									console.log('[EDITOR.JS response] Restaurando (timeout 1):', savedValue);
									inputObject.val(savedValue);
									inputObject.trigger('change');
								}
							}, 100);
							
							setTimeout(function() {
								var currentVal = inputObject.val();
								if (!currentVal || currentVal.trim() === '' || currentVal !== savedValue) {
									console.log('[EDITOR.JS response] Restaurando (timeout 2):', savedValue);
									inputObject.val(savedValue);
									inputObject.trigger('change');
								}
							}, 500);
						}
					}
				},
				open: function () {
					$(this).removeClass('ui-corner-all').addClass('ui-corner-top');
					// Guardar el valor actual cuando se abre el autocomplete
					var currentVal = $(this).val();
					if (currentVal && currentVal.trim() !== '') {
						$(this).data('before-search-value', currentVal);
					}
				},
				close: function () {
					$(this).removeClass('ui-corner-top').addClass('ui-corner-all');
					// Si el campo tenía un valor antes de abrir el autocomplete y no se seleccionó nada, restaurarlo
					var $this = $(this);
					var currentValue = $this.val();
					var savedValue = $this.data('before-search-value');
					
					console.log('[EDITOR.JS close] Valor actual:', currentValue, 'Valor guardado:', savedValue);
					
					if (savedValue && savedValue.trim() !== '') {
						setTimeout(function() {
							var finalVal = $this.val();
							if (!finalVal || finalVal.trim() === '' || (finalVal !== savedValue && !$this.data('item-selected'))) {
								console.log('[EDITOR.JS close] Restaurando valor:', savedValue, 'Valor final:', finalVal);
								$this.val(savedValue);
								$this.trigger('change');
								$this.removeData('item-selected');
							}
						}, 200);
						
						setTimeout(function() {
							var finalVal = $this.val();
							if ((!finalVal || finalVal.trim() === '') && savedValue) {
								console.log('[EDITOR.JS close] Restaurando valor (verificación tardía):', savedValue);
								$this.val(savedValue);
								$this.trigger('change');
							}
						}, 800);
					}
				},
				focus: function (event, ui) {
					//$(this).val(ui.item.text);
					return false;
				},
				select: function (event, ui) {
					$(this).val(ui.item.text);
					// Marcar que se seleccionó un item
					$(this).data('item-selected', true);
					// Guardar el valor seleccionado para restaurarlo si la búsqueda futura no encuentra resultados
					$(this).data('before-search-value', ui.item.text);
					console.log('[EDITOR.JS select] Item seleccionado:', ui.item.text);
					var target = htmlObject;
					$(this)[0].dataset.id = ui.item.id
					if (unaBase.parametros.btn_sica) {
						//let btn = `<button class="detail argentina" title="Configuracion"><i class="fas fa-search-dollar"></i></i></button>`
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


						$.ajax({
							url: '/4DACTION/_light_getValoresSicaServicio',
							data: {
								id_servicio: ui.item.id
							},
							dataType: 'json',
							async: false,
							cache: false,
							success: function (data) {

								if (data.records.total > 0) {
									htmlObject[0].children[8].insertBefore(btn1, htmlObject[0].children[8].children[0]);
									htmlObject[0].children[10].insertBefore(btn2, htmlObject[0].children[10].children[0]);
								} else {
									htmlObject[0].children[8].children[0].style.marginLeft = "22px"
									htmlObject[0].children[10].children[0].style.marginLeft = "22px"
								}

							}
						});
					}

					target.data('producto', ui.item.id);
					target.find('[name="item[][codigo]"]').val(ui.item.index);
					target.find('[name="item[][unidad]"]').val(ui.item.unidad);
					target.find('[name="item[][horas_extras]"]').val(0);

					var cantidad = parseFloat(target.find('[name="item[][cantidad]"]').data('old-value'));
					var factor = parseFloat(target.find('[name="item[][factor]"]').data('old-value'));

					if (ui.item.porcentaje_monto_total == 0) {
						target.find('[name="item[][precio_unitario]"]').val(ui.item.precio / exchange_rate).data('old-value', ui.item.precio / exchange_rate);
						target.find('[name="item[][subtotal_precio]"]').val(cantidad * factor * (ui.item.precio / exchange_rate)).data('old-value', cantidad * factor * (ui.item.precio / exchange_rate));
						target.removeData('porcentaje-monto-total');
						target.find('[name="item[][precio_unitario]"]').removeProp('readonly');
					} else {
						// var total_a_cliente = $('[name="sobrecargo[5][subtotal]"]').val();
						var total_a_cliente = parseFloat($('input[name="cotizacion[ajuste]"]').val()) - parseFloat($('input[name="cotizacion[ajuste]"]').val()) * parseFloat($('input[name="sobrecargo[6][porcentaje]"]').val() / 100.00);
						target.data('porcentaje-monto-total', ui.item.porcentaje_monto_total);
						target.find('[name="item[][precio_unitario]"]').prop('readonly', true);
					}

					// Fórmula productor ejecutivo
					if (ui.item.formula_productor_ejecutivo) {
						target.find('[name="item[][precio_unitario]"]').prop('readonly', true);
						target.data('formula-productor-ejecutivo', true);
						// Bloquear nombre, tipo documento y cantidades
						target.find('[name="item[][nombre]"]').prop('readonly', true);
						target.find('button.show.item').invisible();
						target.find('[name="item[][tipo_documento]"]').prop('readonly', true);
						target.find('button.show.tipo-documento').hide();
						//target.find('[name="item[][cantidad]"]').prop('readonly', true);
						target.find('[name="item[][factor]"]').prop('readonly', true);
					} else {
						target.removeData('formula-productor-ejecutivo');
					}

					// Fórmula asistente producción
					if (ui.item.formula_asistente_produccion) {
						target.find('[name="item[][precio_unitario]"]').prop('readonly', true);
						target.data('formula-asistente-produccion', true);
						// Bloquear nombre, tipo documento y cantidades
						target.find('[name="item[][nombre]"]').prop('readonly', true);
						target.find('button.show.item').invisible();
						target.find('[name="item[][tipo_documento]"]').prop('readonly', true);
						target.find('button.show.tipo-documento').hide();
						//target.find('[name="item[][cantidad]"]').prop('readonly', true);
						target.find('[name="item[][factor]"]').prop('readonly', true);
					} else {
						target.removeData('formula-asistente-produccion');
					}

					if (ui.item.porcentaje_monto_total || ui.item.formula_productor_ejecutivo || ui.item.formula_asistente_produccion) {
						target.find('.remove.item').remove();
						target.find('.insert.item').remove();
						target.find('.clone.item').remove();
						//simon itemparent start
						target.find('.parent.item').remove();
						//simon itemparent end
						target.find('.ui-icon-arrow-4').remove();
					}

					//target.find('[name="item[][precio_unitario]"]').val(ui.item.precio / exchange_rate).data('old-value', ui.item.precio / exchange_rate);
					//target.find('[name="item[][subtotal_precio]"]').val(cantidad * factor * (ui.item.precio / exchange_rate));
					target.find('[name="item[][aplica_sobrecargo]"]').prop('checked', ui.item.aplica_sobrecargo);

					if (typeof copiar_precio_a_costo == 'boolean' && !margen_desde_compra) {
						target.find('[name="item[][costo_unitario]"]').data('auto', true);
						if (ui.item.costo == 0) {
							target.find('[name="item[][costo_unitario]"]').val(ui.item.precio / exchange_rate).data('old-value', ui.item.precio / exchange_rate);
							target.find('[name="item[][subtotal_costo]"]').val(cantidad * factor * (ui.item.precio / exchange_rate));
						} else {
							target.find('[name="item[][costo_unitario]"]').val(ui.item.costo / exchange_rate).data('old-value', ui.item.costo / exchange_rate);
							target.find('[name="item[][subtotal_costo]"]').val(cantidad * factor * (ui.item.costo / exchange_rate));
						}
					} else {
						htmlObject.find('[name="item[][costo_unitario]"]').val(ui.item.costo / exchange_rate).data('old-value', ui.item.costo / exchange_rate);
						htmlObject.find('[name="item[][subtotal_costo]"]').val(cantidad * factor * (ui.item.costo / exchange_rate));
					}

					target.find('[name="item[][nombre]"]').data('nombre-original', ui.item.text);

					var tooltip = ' \
						<p>Nombre ítem:</p> \
						<p>' + ui.item.text.replace("\n", '<p>&nbsp;</p>') + '</p> \
						<p>&nbsp;</p> \
						<p>Descripción larga:</p> \
						<p>' + ((ui.item.observacion != '') ? ui.item.observacion.replace(/\n/g, '</p><p>') : 'N/A') + '</p> \
						<p>&nbsp;</p>\
						<p>Observación interna:</p> \
						<p>N/A</p> \
					';
					target.find('button.profile.item').tooltipster('update', tooltip);

					var subtotal_precio = target.find('[name="item[][subtotal_precio]"]').val();
					var subtotal_costo = target.find('[name="item[][subtotal_costo]"]').val();

					if (margen_desde_compra_inverso)
						var margen_compra = ((1 - subtotal_costo / subtotal_precio) * 100).toFixed(2);
					else
						var margen_compra = ((subtotal_precio - subtotal_costo) / subtotal_costo * 100).toFixed(2);

					var margen_venta = ((subtotal_precio - subtotal_costo) / subtotal_precio * 100).toFixed(2);

					target.find('[name="item[][margen_venta]"]').val(margen_venta);
					target.find('[name="item[][margen_compra]"]').val(margen_compra);

					if (!isFinite(margen_venta))
						target.find('[name="item[][margen_venta]"]').invisible();
					else
						target.find('[name="item[][margen_venta]"]').visible();

					if (!isFinite(margen_compra))
						target.find('[name="item[][margen_compra]"]').invisible();
					else
						target.find('[name="item[][margen_compra]"]').visible();

					target.find('[name="item[][utilidad]"]').val(subtotal_precio - subtotal_costo);

					// Fix: para evitar que quede en blanco el tipo de documento
					target.data('tipo-documento', 33);
					//target.find('input[name="item[][tipo_documento]"]').val('FE');
					if (typeof ui.item.tipo_documento != 'undefined' && ui.item.tipo_documento.id != 30 && ui.item.tipo_documento.id != 33) {
						target.data('tipo-documento', ui.item.tipo_documento.id);
						target.data('tipo-documento-text', ui.item.tipo_documento.text);
						target.data('tipo-documento-ratio', ui.item.tipo_documento.ratio);
						
						target.data('tipo-documento-valor-usd', ui.item.tipo_documento.valor_usd); // Impuesto extranjero
						target.data('tipo-documento-valor-moneda', ui.item.tipo_documento.valor_moneda); // Impuesto extranjero

						target.data('tipo-documento-inverse', ui.item.tipo_documento.inverse);
						target.find('[name="item[][tipo_documento]"]').val(ui.item.tipo_documento.abbr);
						if (ui.item.tipo_documento.ratio != 0) {
							target.find('[name="item[][precio_unitario]"]').addClass('edited');
							target.find('button.detail.price').visible();
						} else {
							target.find('[name="item[][precio_unitario]"]').removeClass('edited');
							target.find('button.detail.price').invisible();
						}
					} else {
						target.removeData('tipo-documento');
						target.removeData('tipo-documento-text');
						target.removeData('tipo-documento-ratio');
						target.removeData('tipo-documento-valor-usd'); // Impuesto extranjero
						target.removeData('tipo-documento-valor-moneda'); // Impuesto extranjero
						target.removeData('tipo-documento-inverse');
						target.find('[name="item[][precio_unitario]"]').removeClass('edited');
					}

					// Factor hora extra y jornada
					if (typeof ui.item.hora_extra != 'undefined') {
						target.data('hora-extra-enabled', true);
						target.data('hora-extra-factor', ui.item.hora_extra.factor);
						target.data('hora-extra-jornada', ui.item.hora_extra.jornada);
						target.data('hora-extra-dias', ui.item.hora_extra.dias);
						target.find('[name="item[][horas_extras]"]').parentTo('td').visible();
					} else {
						target.removeData('hora-extra-enabled');
						target.removeData('hora-extra-factor');
						target.removeData('hora-extra-jornada');
						target.data('hora-extra-dias', 7);
						target.find('[name="item[][horas_extras]"]').parentTo('td').invisible();
					}

					if ((typeof ui.item.tipo_documento != 'undefined' && ui.item.tipo_documento.id != 30 && ui.item.tipo_documento.id != 33) || typeof ui.item.hora_extra != 'undefined')
						target.find('button.detail.price').visible();

					var title = target.prevTo('.title');

					if (title.find('input[name="item[][nombre]"]').val() == '') {
						$.ajax({
							url: '/4DACTION/_V3_getCategoria',
							data: {
								q: ui.item.categoria.id,
								filter: 'id',
								from: 'negocio'
							},
							dataType: 'json',
							success: function (data) {
								if (data.rows.length) {
									var categoria = data.rows[0];
									title.data('categoria', categoria.id);
									title.find('input[name="item[][nombre]"]').val(categoria.text);
								}
							}
						});
					}

					target.find('span.unit').html(ui.item.unidad);

					target.data('observacion', ui.item.observacion);
					target.data('comentario', ui.item.comentario);

					if (ui.item.margen != 0) {
						target.data('preset-margen', true);
						target.data('preset-margen-value', ui.item.margen * 100.00);
						if (margen_desde_compra) {
							target.find('[name="item[][margen_compra]"]').val(ui.item.margen * 100.00);
							target.find('[name="item[][margen_compra]"]').trigger('blur');
							target.find('input[name="item[][costo_unitario]"]').trigger('focus').trigger('blur');
							if (!access._566)
								target.find('[name="item[][margen_compra]"]').prop('readonly', true);
							target.find('[name="item[][margen_compra]"]').visible();
						} else {
							target.find('[name="item[][margen_venta]"]').val(ui.item.margen * 100.00);
							target.find('[name="item[][margen_venta]"]').trigger('blur');
							if (!access._566)
								target.find('[name="item[][margen_venta]"]').prop('readonly', true);
							target.find('[name="item[][margen_venta]"]').visible();
						}
					} else {
						target.data('preset-margen', false);
					}

					// Sección datos cinemágica
					if (!ui.item.costo_directo) {
						target.find('[name="item[][subtotal_costo_previo]"]').css('opacity', .5);
					} else {
						target.find('[name="item[][subtotal_costo_previo]"]').css('opacity', 1);
					}
					target.data('costo-directo', ui.item.costo_directo);
					target.data('costo-admin', ui.item.costo_admin); // Fórmula productor ejecutivo

					$(this).trigger('change');
					if (!modoOffline) {
						updateSubtotalTitulos($(this));
						updateSubtotalItems();
					}
					return false;
				}

			}).data('ui-autocomplete')._renderItem = function (ul, item) {
				return $('<li><a><strong>' + item.index + ' ' + ((item.gasto_fijo) ? '[Gasto Fijo]' : '') + ' ' + ((item.especial) ? '[Especial]' : '') + '</strong><em>' + item.categoria.text + '</em><span class="highlight">' + item.text + '</span>' + ((item.precio > 0) ? '<span>Precio venta: $' + item.precio.toLocaleString() + '</span>' : '') + '</a></li>').appendTo(ul);
			};
		}

		if (htmlObject.find('input[name="item[][unidad]"]').length)
			htmlObject.find('input[name="item[][unidad]"]').autocomplete({
				source: function (request, response) {
					$.ajax({
						url: '/4DACTION/_V3_' + 'getUnidad',
						dataType: 'json',
						data: {
							q: request.term
						},
						success: function (data) {
							response($.map(data.rows, function (item) {
								return item;
							}));
						},
						error: function (jqXHR, exception) {
							toastr.error('No se pudo cargar el listado de unidades. Error de conexión al servidor.');
						}
					});
				},
				minLength: 0,
				delay: 0,
				position: { my: "left top", at: "left bottom", collision: "flip" },
				open: function () {
					$(this).removeClass('ui-corner-all').addClass('ui-corner-top');
				},
				close: function () {
					$(this).removeClass('ui-corner-top').addClass('ui-corner-all');
				},
				focus: function (event, ui) {
					$(this).val(ui.item.text);
					return false;
				},
				select: function (event, ui) {
					$(this).val(ui.item.text);
					var target = htmlObject;

					// $(this).trigger('change');
					if (!modoOffline) {
						updateSubtotalTitulos($(this));
						updateSubtotalItems();
					}
					return false;
				}

			}).data('ui-autocomplete')._renderItem = function (ul, item) {
				return $('<li><a>' + item.text + '</a></li>').appendTo(ul);
			};


		var selectObject = htmlObject.find('select[name="item\\[\\]\\[tipo_documento\\]"]');
		if (selectObject.length) {
			selectObject.on('focus', function (event) {
				// Crea una cadena con las opciones del select
				// let opciones = tiposDocumento.map(obj => `<option value="${obj.id}">${obj.abbr}</option>`).join('');
				// // Agrega la opción predeterminada al inicio de la cadena
				// opciones = `<option value="" disabled selected>Tipo doc</option>` + opciones;
				// // Establece las opciones del select
				// $(this).html(opciones);
			});

			// selectObject.off('change').on('change', function (event) {
			// 	const el = event;
			// 	//let valorSeleccionado = $(this).val();
			// 	let valorSeleccionado = $(this)[0].options[$(this)[0].options.selectedIndex].dataset.id
			// 	//$(this)[0].options[$(this)[0].options.selectedIndex].textContent = valorSeleccionado
			// 	
			// 	var target = htmlObject;
			// 	changeTipoDocumento(target, target.data('tipo-documento'), valorSeleccionado);
			// 	if (!modoOffline) {
			// 		updateSubtotalTitulos($(this));
			// 		updateSubtotalItems();
			// 	}

			// 	toastr.success(
			// 		"Valor asignado correctamente!"
			// 	);


			// });
		}


		if (htmlObject.find('select[name="item[][tipo_documento]"]').length) {

			// 
			// htmlObject.find('select[name="item[][tipo_documento]"]').on('focus', '.tipo-documento-select', function (event) {
			// 	// Crea una cadena con las opciones del select
			// 	let opciones = tiposDocumento.map(obj => `<option value="${obj.id}">${obj.abbr}</option>`).join('');

			// 	// Agrega la opción predeterminada al inicio de la cadena
			// 	opciones = `<option value="" disabled selected>Tipo doc</option>` + opciones;
			// 	// Establece las opciones del select
			// 	$(this).html(opciones);
			// });


			// htmlObject.find('select[name="item[][tipo_documento]"]').on('change', '.tipo-documento-select', function (event) {
			// 	const el = event
			// 	let valorSeleccionado = $(this).val();
			// 	var target = htmlObject;
			// 	console.log('Valor seleccionado:', valorSeleccionado);
			// 	

			// 	changeTipoDocumento(target, target.data('tipo-documento'), valorSeleccionado);

			// 	if (!modoOffline) {
			// 		updateSubtotalTitulos($(this));
			// 		updateSubtotalItems();
			// 	}


			// });

			// htmlObject.find('input[name="item[][tipo_documento]"]').autocomplete({
			// 	source: function (request, response) {
			// 		$.ajax({
			// 			url: '/4DACTION/_V3_' + 'getTipoDocumento',
			// 			dataType: 'json',
			// 			data: {
			// 				q: request.term
			// 			},
			// 			success: function (data) {
			// 				response($.map(data.rows, function (item) {
			// 					return item;
			// 				}));
			// 			},
			// 			error: function (jqXHR, exception) {
			// 				toastr.error('No se pudo cargar el listado de tipos de documento. Error de conexión al servidor.');
			// 			}
			// 		});
			// 	},
			// 	minLength: 0,
			// 	delay: 0,
			// 	position: { my: "left top", at: "left bottom", collision: "flip" },
			// 	open: function () {
			// 		$(this).removeClass('ui-corner-all').addClass('ui-corner-top');
			// 	},
			// 	close: function () {
			// 		$(this).removeClass('ui-corner-top').addClass('ui-corner-all');
			// 	},
			// 	focus: function (event, ui) {
			// 		$(this).parentTo('tr').trigger('beforeUpdate'); // Logs tiempo real
			// 		$(this).val(ui.item.abbr);
			// 		return false;
			// 	},
			// 	select: function (event, ui) {
			// 		$(this).val(ui.item.abbr);
			// 		var target = htmlObject;
			// 		

			// 		target.data('no-update', true);

			// 		changeTipoDocumento(target, target.data('tipo-documento'), ui.item.id);

			// 		target.removeData('no-update');

			// 		target.trigger('afterUpdate'); // Logs tiempo real

			// 		// $(this).trigger('change');
			// 		if (!modoOffline) {
			// 			updateSubtotalTitulos($(this));
			// 			updateSubtotalItems();
			// 		}
			// 		return false;
			// 	}

			// }).data('ui-autocomplete')._renderItem = function (ul, item) {
			// 	return $('<li><a>' + item.text + '</a></li>').appendTo(ul);
			// };
		}


		// if (htmlObject.find('input[name="item[][tipo_documento_compras]"]').length)
		// 	htmlObject.find('input[name="item[][tipo_documento_compras]"]').autocomplete({
		// 		source: function (request, response) {
		// 			$.ajax({
		// 				url: '/4DACTION/_V3_' + 'getTipoDocumento',
		// 				dataType: 'json',
		// 				data: {
		// 					q: request.term
		// 				},
		// 				success: function (data) {
		// 					response($.map(data.rows, function (item) {
		// 						return item;
		// 					}));
		// 				},
		// 				error: function (jqXHR, exception) {
		// 					toastr.error('No se pudo cargar el listado de tipos de documento. Error de conexión al servidor.');
		// 				}
		// 			});
		// 		},
		// 		minLength: 0,
		// 		delay: 0,
		// 		position: { my: "left top", at: "left bottom", collision: "flip" },
		// 		open: function () {
		// 			$(this).removeClass('ui-corner-all').addClass('ui-corner-top');
		// 		},
		// 		close: function () {
		// 			$(this).removeClass('ui-corner-top').addClass('ui-corner-all');
		// 		},
		// 		focus: function (event, ui) {
		// 			$(this).parentTo('tr').trigger('beforeUpdate'); // Logs tiempo real
		// 			$(this).val(ui.item.abbr);
		// 			return false;
		// 		},
		// 		select: function (event, ui) {

		// 			$(this).val(ui.item.abbr);
		// 			var target = htmlObject;

		// 			target.data('no-update', true);
		// 			
		// 			changeTipoDocumento(target, target.data('tipo-documento-compras'), ui.item.id, 'compras');

		// 			target.removeData('no-update');

		// 			//target.trigger('afterUpdate'); // Logs tiempo real

		// 			// $(this).trigger('change');
		// 			if (!modoOffline) {
		// 				updateSubtotalTitulos($(this));
		// 				updateSubtotalItems();
		// 			}
		// 			return false;
		// 		}

		// 	}).data('ui-autocomplete')._renderItem = function (ul, item) {
		// 		return $('<li><a>' + item.text + '</a></li>').appendTo(ul);
		// 	};
	});


	// htmlObject.focusout(function() {
	$('section.sheet table').on('focusout', 'tbody tr:not(.title)', function () {
		$(this).removeClass('focused'); // Fondo línea que se está trabajando
		if ($(this).find('input[name="item[][nombre]"]').hasClass('ui-autocomplete-input'))
			$(this).find('input[name="item[][nombre]"]').autocomplete('destroy');
		if ($(this).find('input[name="item[][tipo_documento]"]').hasClass('ui-autocomplete-input'))
			$(this).find('input[name="item[][tipo_documento]"]').autocomplete('destroy');
		if ($(this).find('input[name="item[][tipo_documento_compras]"]').hasClass('ui-autocomplete-input'))
			$(this).find('input[name="item[][tipo_documento_compras]"]').autocomplete('destroy');
		if ($(this).find('input[name="item[][unidad]"]').hasClass('ui-autocomplete-input'))
			$(this).find('input[name="item[][unidad]"]').autocomplete('destroy');
	});


	$('section.sheet table').on('click', 'tbody tr:not(.title) button.remove.item', function () {
		contentChanged = true;
		contentReady = false;
		var element = this;
		var title = $(element).parentTo('tr').prevTo('.title');
		$(element).closest('tr').trigger('beforeRemove'); // Logs tiempo real
		$(element).parentTo('tr').fadeOut(400, function () {
			$(this).trigger('afterRemove'); // Logs tiempo real
			$(this).remove();
			if (!modoOffline) {
				updateSubtotalTitulos(title);
				updateSubtotalItems();
			}
		});

		$('section.sheet table.items > tfoot > tr > th.info').trigger('refresh');

		unaBase.changeControl.hasChange = true;

	});

	$('section.sheet table').on('click', 'tbody button.remove.categoria', function () {

		var title = $(this).parentTo('tr');
		var current = title.next();
		var hasStatus = {
			success: true,
			opened: true,
			readonly: true
		}
		var action = true;

		var countItems = 0;
		var countProtectedItems = 0;
		if (current.length > 0) {
			if (current.filter('.title').length == 0) {
				countItems = current.nextUntil('.title').andSelf().length;
				current.nextUntil('.title').andSelf().each(function () {
					if (!$(this).find('button.remove.item').isVisible())
						countProtectedItems++;
				});
			}
			else
				countItems = 0;
		}

		var removeTitle = function (title, current) {
			title.trigger('beforeRemove'); // Logs tiempo real
			if (countItems > 0) {
				unaBase.ui.block();

				current = current.prev();
				var stack = [];
				do {
					current = current.next();
					stack.push(current);
					countItems--;
				} while (countItems > 0);

				$.each(stack, function () {
					this.trigger('beforeRemove'); // Logs tiempo real
					this.remove();
					this.trigger('afterRemove'); // Logs tiempo real
				});

				unaBase.ui.unblock();
			}

			title.fadeOut(400, function () {
				$(this).remove();
				$(this).trigger('afterRemove'); // Logs tiempo real
				contentChanged = true;
				contentReady = false;
				if (!modoOffline) {
					updateSubtotalItems();
					$('section.sheet table.items > tfoot > tr > th.info').trigger('refresh');
				}
			});
		};

		if (countProtectedItems == 0) {
			if (countItems > 0)
				confirm('¿Desea quitar el título y todos los items dentro del título?').done(function (data) {
					if (data)
						removeTitle(title, current);
				});
			else
				removeTitle(title, current);
		} else
			toastr.warning('No es posible quitar el título, ya que contiene ítems que no pueden eliminarse debido a que tienen gastos asociados.');

	});
	//simon itemparent start
	//simon itemparent start
	$('section.sheet table').on('click', 'tbody button.remove.itemParent', function () {

		var title = $(this).parentTo('tr');
		let parentKey = title.data('id');
		var current = title.next();
		var hasStatus = {
			success: true,
			opened: true,
			readonly: true
		}
		var action = true;

		var countItems = 0;
		var countProtectedItems = 0;
		if (current.length > 0) {
			if (current.filter('.title').length == 0) {
				countItems = current.nextUntil(':not(.childItem)').andSelf().length;
				current.nextUntil(':not(.childItem)').andSelf().each(function () {
					if (!$(this).find('button.remove.item').isVisible())
						countProtectedItems++;
				});
			}
			else
				countItems = 0;
		}

		var removeTitle = function (title, current) {
			title.trigger('beforeRemove'); // Logs tiempo real
			if (countItems > 0) {
				unaBase.ui.block();

				current = current.prev();
				var stack = [];

				do {
					// if(current.hasClass('childItem')){
					current = current.next();
					stack.push(current);
					// }

					countItems--;
				} while (countItems > 0);

				$.each(stack, function () {
					this.trigger('beforeRemove'); // Logs tiempo real
					this.remove();
					this.trigger('afterRemove'); // Logs tiempo real
				});

				unaBase.ui.unblock();
			}

			title.fadeOut(400, function () {
				$(this).remove();
				$(this).trigger('afterRemove'); // Logs tiempo real
				contentChanged = true;
				contentReady = false;
				if (!modoOffline) {
					updateSubtotalItems();
					$('section.sheet table.items > tfoot > tr > th.info').trigger('refresh');
				}
			});
		};

		if (countProtectedItems == 0) {
			if (countItems > 0)
				confirm('¿Desea quitar el título y todos los items dentro del título?').done(function (data) {
					if (data)
						removeTitle(title, current);
				});
			else
				removeTitle(title, current);
		} else
			toastr.warning('No es posible quitar el título, ya que contiene ítems que no pueden eliminarse debido a que tienen gastos asociados.');

	});

	//simon itemparent end

	$('section.sheet table').on('click', 'thead button.add.categoria', function () {
		var current = $(this).parentTo('table').find('tbody');

		var row = getElement.titulo('prependTo', current);
		columnsPermissions(row);

		if (current.find('tr').length > 0)
			row.find('input').focus();
		else
			row.find('input').focus();
	});

	$('section.sheet table').on('click', 'tbody button.add.categoria', function () {
		var current = $(this).parentTo('tr');
		while (!(current.next().html() == undefined || current.next().find('th').length > 0)) {
			current = current.next();
		}

		var row = getElement.titulo('insertAfter', current);
		columnsPermissions(row);
		row.find('input[name="item[][nombre]"]').focus();
	});



	$('section.sheet table').on('click', 'tbody button.add.item', function () {
		let current = $(this).parentTo('tr');

		if (current.find('button.toggle.categoria').hasClass('ui-icon-folder-collapsed'))
			current.find('button.toggle.categoria').triggerHandler('click');



		let row = getElement.item('insertAfter', current);

		//Merca de item nuevo
		row[0].dataset.newline = true

		setTipoDocumento(row, tiposDocumento, '-select')
		setTipoDocumento(row, tiposDocumento, '-compra-select')

		//simon itemparent start

		if (current.hasClass('itemParent')) {

			let datasetName = typeof parentKey !== 'undefined' ? 'itemparent' : 'parentid';
			row[0].dataset[datasetName] = typeof parentKey !== 'undefined' ? parentKey : current[0].id;
			let idnv = $('#main-container').data('id')
			const myRnId = () => (Date.now() * Math.random()).toString().substring(0, 5);
			row[0].dataset.tempnvsica = idnv + '-' + myRnId()
			// if(typeof row[0].dataset.itemparent !== 'undefined'){
			row.addClass('childItem');
			row.removeClass('item');
			// }
		} else {
			row.addClass('item');
		}

		//simon itemparent end

		columnsPermissions(row);
		row.find('input[name="item[][nombre]"]').focus().parentTo('tr').find('input[name="item[][costo_interno]"]').prop('checked', $('section.sheet table.items > thead > tr:last-of-type > th > input[name="item[][costo_interno]"]').prop('checked')).invisible();;
		$('section.sheet table.items > tfoot > tr > th.info').trigger('refresh');
	});
	$('section.sheet table').on('click', 'tbody button.add.parent', function () {
		var current = $(this).parentTo('tr');
		if (current.find('button.toggle.categoria').hasClass('ui-icon-folder-collapsed'))
			current.find('button.toggle.categoria').triggerHandler('click');



		var row = getElement.itemParent('insertAfter', current);



		columnsPermissions(row);
	});

	$('section.sheet table').on('click', 'tbody button.insert.item', function () {

		var current = $(this).parentTo('tr');
		let next = current.next();
		if (current.find('button.toggle.categoria').hasClass('ui-icon-folder-collapsed'))
			current.find('button.toggle.categoria').triggerHandler('click');
		var row = getElement.item('insertAfter', current);
		setTipoDocumento(row, tiposDocumento, '-select')
		setTipoDocumento(row, tiposDocumento, '-compra-select')



		//simon itemparent start

		if (current.hasClass('itemParent')) {
			row[0].dataset.itemparent = current.data('id');
			if (typeof row[0].dataset.itemparent !== 'undefined') {
				row.addClass('childItem');
			}
		} else if (current.hasClass('childItem')) {
			let parentKey = current[0].dataset.itemparent;
			row[0].dataset.itemparent = parentKey
			if (typeof row[0].dataset.itemparent !== 'undefined') {
				row.addClass('childItem');
			}
		} else {
			row.addClass('item');
		}

		//simon itemparent end
		columnsPermissions(row);
		row.find('input[name="item[][nombre]"]').focus().parentTo('tr').find('input[name="item[][costo_interno]"]').prop('checked', $('section.sheet table.items > thead > tr:last-of-type > th > input[name="item[][costo_interno]"]').prop('checked'));
		$('section.sheet table.items > tfoot > tr > th.info').trigger('refresh');

		// startTooltip();
		// updateTooltip();
	});


	// $('section.sheet table').on('click', 'tbody button.plus.categoria', function() {
	// 	console.log('//');
	// 	console.log(event);
	// });



	$('section.sheet table').on('click', 'tbody button.clone.categoria', function () {
		var element = $(this);
		// Permiso Duplicar Unitario y Bloquear Duplicar Item/Categoria
		if(access._684) return;



		var cloneCategoria = function () {

			let trElement = element.parentTo('tr');
			let isTitle = trElement.hasClass('title') ? true : false;
			let isParent = trElement.hasClass('itemParent') ? true : false;
			let nextClass = isTitle ? 'tr.title' : 'tr.title, tr.itemParent, tr.item';
			unaBase.ui.block();
			var current = element.parentTo('tr').nextUntil(nextClass).andSelf();

			current.each(function (key, item) {
				//if (!$(item).hasClass('title'))
				$(item).find('.profile.item').tooltipster('destroy');
			});

			var cloned = current.clone(true);

			const setEventos = (selectClone) => {
				selectClone.on('change', function () {
					let selectedOption = $(this).find('option:selected');
					if (selectedOption.index() > 0) {
						selectedOption.text(selectedOption.data('abbr'));
					}
				});

				selectClone.on('mousedown', function () {
					$(this).find('option').each(function (i, option) {
						if (i > 0) {
							$(option).text($(option).data('text'));
						}
					});
				});

				selectClone.on('blur', function () {
					let selectedOption = $(this).find('option:selected');
					if (selectedOption.index() > 0) {
						selectedOption.text(selectedOption.data('abbr'));
					}
				});
			}

			// Guarda los valores de los select antes de clonar
			var selectValues = current.find('.tipo-documento-select').map(function () {
				return $(this).val();
			}).get();

			var selectValuesCompras = current.find('.tipo-documento-compra-select').map(function () {
				return $(this).val();
			}).get();
			// Asigna los valores originales a los select en los elementos clonados
			cloned.find('.tipo-documento-select').each(function (index) {
				//$(this).val(selectValues[index]);
				var selectClone = $(this);
				selectClone.val(selectValues[index]);
				setEventos(selectClone)

			});

			cloned.find('.tipo-documento-compra-select').each(function (index) {
				//$(this).val(selectValues[index]);
				var selectClone = $(this);
				selectClone.val(selectValuesCompras[index]);
				setEventos(selectClone)

			});


			cloned.each(function (key, item) {
				$(item).removeData('id');
				$(item).removeData('itemParent');
				delete (item.dataset.id);
				delete (item.dataset.itemParent);
				delete (item.dataset.itemparent);
				delete (item.dataset.parentid);
				$(item).find('input[name="item[][subtotal_costo_real]"]').val(0);
			}).insertAfter(current.nextUntil(nextClass).last());

			current.each(function (key, item) {
				//if (!$(item).hasClass('title'))
				$(item).find('button.profile.item').tooltipster({
					delay: 0,
					interactiveAutoClose: false,
					contentAsHTML: true
				});
			});

			cloned.each(function (key, item) {
				//if (!$(item).hasClass('title'))
				$(item).find('button.profile.item').tooltipster({
					delay: 0,
					interactiveAutoClose: false,
					contentAsHTML: true
				});
				$(item).removeUniqueId().uniqueId(); // Logs tiempo real
				$(item).removeData('id');
			});

			cloned.trigger('beforeClone'); // Logs tiempo real
			cloned.trigger('afterClone'); // Logs tiempo real






			$('section.sheet table.items > tfoot > tr > th.info').trigger('refresh');

			if (!modoOffline) {
				updateSubtotalTitulos(element);
				updateSubtotalItems();
			}

			unaBase.ui.unblock();
		};




		if ($('#main-container').data('clone-categoria-no-ask')) {
			cloneCategoria();
		} else {
			var htmlObject = $('<div>¿Confirmas que deseas duplicar la categoría?<br><br><label><input type="checkbox"> No volver a preguntar para este negocio.</label></div>');
			htmlObject.find('input[type="checkbox"]').change(function (event) {
				if ($(event.target).is(':checked')) {
					$('#main-container').data('clone-categoria-no-ask', true);
				}
			});
			confirm(htmlObject).done(function (data) {
				if (data) {
					cloneCategoria();
				}
			});
		}
	});

	$('section.sheet table').on('click', 'tbody button.clone.item', function (event) {
		// Permiso Duplicar Unitario y Bloquear Duplicar Item/Categoria
		if(access._684) return;
		business.item.duplicate(this);
		// var element = $(this);
		// var cloneItem = function() {

		// 	//var current = $(this).parentTo('tr');
		// 	var current = element.parentTo('tr');

		// 	current.find('.profile.item').tooltipster('destroy');

		// 	var cloned = current.removeClass('focused').clone(true)
		// 	var oldId = cloned.attr('id');
		// 	cloned.removeUniqueId().uniqueId(); // Logs tiempo real
		// 	cloned.insertAfter(current).removeData('id');
		// 	cloned[0].dataset.id = '';

		// 	current.find('button.profile.item').tooltipster({
		// 		delay: 0,
		// 		interactiveAutoClose: false,
		// 		contentAsHTML: true
		// 	});

		// 	cloned.find('button.profile.item').tooltipster({
		// 		delay: 0,
		// 		interactiveAutoClose: false,
		// 		contentAsHTML: true
		// 	});

		// 	cloned.trigger('afterClone'); // Logs tiempo real
		// 	cloned.trigger('afterClone'); // Logs tiempo real

		// 	cloned.find('.remove.item').visible();
		// 	cloned.find('.costo.real input').val(0);

		// 	//simon itemparent start
		// 	if(current.hasClass('itemParent')){
		// 		cloned[0].dataset.itemparent = current.data('id');
		// 		if(typeof cloned[0].dataset.itemparent !== 'undefined'){
		// 			cloned.addClass('childItem');		
		// 		cloned.find('.parent.item').remove();		
		// 		}
		// 	}else if(current.hasClass('childItem')){
		// 		let parentKey = current[0].dataset.itemparent;
		// 		cloned[0].dataset.itemparent = parentKey

		// 		if(typeof cloned[0].dataset.itemparent !== 'undefined'){
		// 			cloned.addClass('childItem');
		// 		cloned.find('.parent.item').remove();				
		// 		}

		// 	}

		// 	//simon itemparent end


		// 	cloned.find('[name="item[][costo_unitario]"]').trigger('focus').trigger('blur');
		// 	cloned.find('.detail.item').remove();



		// 	$('section.sheet table.items > tfoot > tr > th.info').trigger('refresh');

		// 	// startTooltip();
		// 	updateTooltip();

		// };

		// if ($('#main-container').data('clone-item-no-ask')) {
		// 	cloneItem();
		// } else {
		// 	var htmlObject = $('<div>¿Confirmas que deseas duplicar el ítem?<br><br><label><input type="checkbox"> No volver a preguntar para esta cotización.</label></div>');
		// 	htmlObject.find('input[type="checkbox"]').change(function(event) {
		// 		if ($(event.target).is(':checked')) {
		// 			$('#main-container').data('clone-item-no-ask', true);
		// 		}
		// 	});
		// 	confirm(htmlObject).done(function(data) {
		// 		if (data) {
		// 			cloneItem();
		// 		}
		// 	});
		// }
	});



	// simon itemparent
	$('section.sheet table').on('click', 'tbody button.parent.item', function (event) {
		setParent(event, this, 'neg');

	});


	$('section.sheet table').on('click', 'tbody button.profile.categoria', function () {
		$('#dialog-profile').dialog('open');
	});

	$('section.sheet table').on('click', 'tbody button.detail.categoria', function (event) {
		saveRow(event, function (id) {
			unaBase.loadInto.dialog('/v3/views/cotizaciones/pop_detalle_items.shtml?id=' + id, 'Detalle de Categoría', 'x-large');
		});
	});

	$('section.sheet table').on('click', 'tbody button.detail.item', function (event) {
		// unaBase.loadInto.dialog('/v3/views/items/content.shtml?id=' + $(this).parentTo('tr').data('id'), 'Detalle de Ítem', 'x-large');
		// return true;
		//NO ELIMINAR
		unaBase.doc.lineTrSup = $(event.target).closest('tr.item')[0]
		if ($('section.sheet').data('readonly') || $('section.sheet').data('locked') || !(access._528 || autoriza_modificacion) || $('#main-container').data('closed'))
			unaBase.loadInto.dialog('/v3/views/items/content.shtml?id=' + $(this).parentTo('tr').data('id'), 'Detalle de Ítem', 'x-large');
		else
			saveRow(event, function (id) {
				unaBase.loadInto.dialog('/v3/views/negocios/pop_detalle_items.shtml?id=' + id, 'Detalle de Ítem', 'x-large');
			});
	});

	$('section.sheet table').on('click', 'tbody button.profile.item', function (event) {
		saveRow(event, function (id) {
			var id_item = $(event.target).closest('tr').data('producto');
			unaBase.loadInto.dialog('/v3/views/catalogo/content.shtml?id=' + id_item, 'Perfil de Ítem', 'large');
		});
	});

	$('section.sheet table').on('click', 'tbody button.show.item', function () {
		$(this).parentTo('tr').find('[type="search"]').autocomplete('search', '@').focus();
	});

	$('section.sheet table').on('click', 'tbody button.show.unidad', function () {


		let thisItem = $(this).parentTo('tr').find('[name="item[][unidad]"]');
		let value = thisItem.val();
		thisItem[0].dataset.oldValueUnit = value;
		thisItem.val('');
		thisItem.autocomplete({ minLength: 0 });
		thisItem.keydown();
	});
	$('section.sheet table').on('blur', 'tbody button.show.unidad', function () {

		let thisItem = $(this).parentTo('tr').find('[name="item[][unidad]"]');
		let oldValueUnit = thisItem[0].dataset.oldValueUnit;
		if (thisItem.val() === "") {
			thisItem.val(oldValueUnit);
		}
	});

	var findItem = function (datasource, filter, extraCallbacks, relationship) {
		var options = {
			source: function (request, response) {
				var dataParams = {
					q: request.term,
					filter: ((typeof filter != 'undefined') ? filter : undefined)
				};
				if (typeof relationship != 'undefined')
					$.extend(dataParams, dataParams, {
						id: relationship.fk()
					});
				$.ajax({
					url: '/4DACTION/_V3_' + 'get' + datasource + ((typeof relationship != 'undefined') ? 'by' + relationship.by : ''),
					dataType: 'json',
					data: dataParams,
					success: function (data) {
						response($.map(data.rows, function (item) {
							return item;
						}));
					}
				});
			},
			minLength: 0,
			open: function () {
				$(this).removeClass('ui-corner-all').addClass('ui-corner-top');
			},
			close: function () {
				$(this).removeClass('ui-corner-top').addClass('ui-corner-all');
			}
		};

		$.extend(options, options, extraCallbacks);

		return options;
	};

	$('input[name^="cotizacion"]').keypress(function (event) {
		if (event.charCode == 13) {
			var nextSibling = $("input:visible,textarea:visible")[$("input:visible,textarea:visible").index() + 1];
			nextSibling.focus();
			return false;
		}
	});

	// $('table.items').delayed('blur', 1, 'tbody th input', {}, function(event) {
	$('table.items').on('blur', 'tbody th input', function (event) {
		contentLoaded = true;
		var element = this;
		if ($(element).parentTo('tr').find('[name="item[][nombre]"]').val().trim() == '')
			$(element).parentTo('tr').data('categoria', null);

		if (!$(element).parentTo('tr').data('categoria')) {
			if (!access._480) {
				$(element).parentTo('tr').find('[name="item[][nombre]"]').removeClass('edited').data('nombre-original', null);
				$(element).parentTo('tr').find('input').val('');
				$(element).parentTo('tr').find('input[name="item[][cantidad]"]').val(1).data('old-value', 1);
				$(element).parentTo('tr').find('input[name="item[][factor]"]').val(1).data('old-value', 1);
				$(element).parentTo('tr').find('input[name="item[][horas_extras]"]').val(0);
			} else {
				if ($(element).parentTo('tr').find('[name="item[][nombre]"]').val().trim() != '') {
					if ($(element).parentTo('tr').find('[name="item[][nombre]"]').data('ajax-call') !== undefined) {
						$(element).parentTo('tr').find('[name="item[][nombre]"]').removeClass('edited').data('nombre-original', null);
						$(element).parentTo('tr').find('input').val('');
						$(element).parentTo('tr').find('input[name="item[][cantidad]"]').val(1).data('old-value', 1);
						$(element).parentTo('tr').find('input[name="item[][factor]"]').val(1).data('old-value', 1);
						$(element).parentTo('tr').find('input[name="item[][horas_extras]"]').val(0);
					} else {
						var text = $($(element).parentTo('tr').find('[name="item[][nombre]"]').data('ui-autocomplete').bindings[1]).find('li:first-of-type span').text();
						if ($($(element).parentTo('tr').find('[name="item[][nombre]"]').data('ui-autocomplete').bindings[1]).find('li:first-of-type').length > 0 && $(element).parentTo('tr').find('[name="item[][nombre]"]').val().toLowerCase() == text.toLowerCase()) {
							$(element).parentTo('tr').find('[name="item[][nombre]"]').removeClass('edited').data('nombre-original', null);
							$(element).parentTo('tr').find('[name="item[][nombre]"]').val(text);
							$(element).parentTo('tr').data('categoria', $($(element).parentTo('tr').find('[name="item[][nombre]"]').data('ui-autocomplete').bindings[1]).find('li:first-of-type').closest('li').data('ui-autocomplete-item').id);
						} else {
							confirm('La categoría &laquo;' + $(element).parentTo('tr').find('[name="item[][nombre]"]').val().trim() + '&raquo; no existe en el catálogo.\n\n¿Desea crearla?').done(function (data) {
								if (data)
									$.ajax({
										url: '/4DACTION/_V3_setCategoria',
										data: {
											text: $(element).parentTo('tr').find('[name="item[][nombre]"]').val()
										},
										dataType: 'json',
										success: function (subdata) {
											if (subdata.success) {
												$(element).parentTo('tr').data('categoria', subdata.id);
												toastr.info('Se ha agregado una nueva categoría al catálogo');
											}
										}
									});
								else
									$(element).parentTo('tr').find('[name="item[][nombre]"]').val('');
							});
						}
					}
				}

			}
		}
	});

	var updateLine = function (event) {
		
		// mostrar decimales en cantidad 1
		if (typeof event.originalEvent != "undefined" && $(event.target).prop('name') == 'item[][cantidad]') {
			if (typeof $(event.target).data('first-focusout') == 'undefined') $(event.target).data('first-focusout', true);
			if ($(event.target).data('first-focusout')) {
				$(event.target).data('old-value', $(event.target).val());
				$(event.target).unbind('.format');
				$(event.target).number(true, 1, ',', '.');
				$(event.target).data('first-focusout', false);
				$(event.target).removeData('first-focusin');
			}
		}

		// mostrar decimales en cantidad 2
		if (event.originalEvent !== undefined && $(event.target).prop('name') == 'item[][factor]') {
			if (typeof $(event.target).data('first-focusout') == 'undefined') $(event.target).data('first-focusout', true);
			if ($(event.target).data('first-focusout')) {
				$(event.target).data('old-value', $(event.target).val());
				$(event.target).unbind('.format');
				$(event.target).number(true, 1, ',', '.');
				$(event.target).data('first-focusout', false);
				$(event.target).removeData('first-focusin');
			}
		}

		if ($(event.target).closest('tr').data('first-load') !== true) {

			if (event.originalEvent !== undefined && $(event.target).prop('name') == 'item[][margen_compra]' || $(event.target).prop('name') == 'item[][margen_venta]') {
				var margen = parseFloat($(event.target).val());
				var is_valid = (margen_desde_compra && margen >= 0 && ((margen_desde_compra_inverso && margen < 100) || !margen_desde_compra_inverso)) || (!margen_desde_compra && margen >= 0 && margen <= 100);

				if (!is_valid) {
					if (margen_desde_compra) {
						if (margen_desde_compra_inverso) {
							toastr.warning('El margen debe ser mayor o igual que 0, y menor que 100.');
						} else {
							toastr.warning('El margen no debe ser negativo.');
						}
					} else {
						toastr.warning('El margen debe tener un valor entre 0 y 100.');
					}
					$(event.target).val($(event.target).data('old-value'));
					return false;
				}
			}

			contentChanged = true;
			contentReady = false;
			//var element = this;
			var element = event.target;
			if (!$(element).prop('readonly')) {
				if ($(element).parentTo('td').hasClass('numeric') || $(element).prop('type') == 'checkbox') {
					
					updateRow(event);
				} else {
					if ($(element).parentTo('tr').find('[name="item[][nombre]"]').val().trim() == '')
						$(element).parentTo('tr').data('producto', null);

					if (!$(element).parentTo('tr').data('producto')) {
						if (!access._480) {
							$(element).parentTo('tr').find('[name="item[][nombre]"]').removeClass('edited').data('nombre-original', null);
							$(element).parentTo('tr').find('input').val('');
							$(element).parentTo('tr').find('input[name="item[][cantidad]"]').val(1).data('old-value', 1);
							$(element).parentTo('tr').find('input[name="item[][factor]"]').val(1).data('old-value', 1);
							$(element).parentTo('tr').find('input[name="item[][horas_extras]"]').val(0);
						} else {
							if ($(element).parentTo('tr').find('[name="item[][nombre]"]').val().trim() != '') {
								if ($(element).parentTo('tr').find('[name="item[][nombre]"]').data('ajax-call') !== undefined) {
									$(element).parentTo('tr').find('[name="item[][nombre]"]').removeClass('edited').data('nombre-original', null);
									$(element).parentTo('tr').find('input').val('');
									$(element).parentTo('tr').find('input[name="item[][cantidad]"]').val(1).data('old-value', 1);
									$(element).parentTo('tr').find('input[name="item[][factor]"]').val(1).data('old-value', 1);
									$(element).parentTo('tr').find('input[name="item[][horas_extras]"]').val(0);
								} else {
									var text = $($(element).parentTo('tr').find('[name="item[][nombre]"]').data('ui-autocomplete').bindings[1]).find('li:first-of-type span').text();

									if ($($(element).parentTo('tr').find('[name="item[][nombre]"]').data('ui-autocomplete').bindings[1]).find('li:first-of-type').length > 0 && $(element).parentTo('tr').find('[name="item[][nombre]"]').val().toLowerCase() == text.toLowerCase()) {
										var target = $(element).parentTo('tr');
										var ui = {
											item: $($(element).parentTo('tr').find('[name="item[][nombre]"]').data('ui-autocomplete').bindings[1]).find('li:first-of-type').closest('li').data('ui-autocomplete-item')
										};

										target.find('[name="item[][nombre]"]').removeClass('edited').data('nombre-original', null);
										target.find('[name="item[][nombre]"]').val(text);
										target.data('producto', ui.item.id);
										target.data('categoria', ui.item.categoria.id);

										target.find('[name="item[][codigo]"]').val(ui.item.index);
										target.find('[name="item[][unidad]"]').val(ui.item.unidad);
										target.find('[name="item[][horas_extras]"]').val(0);

										if (ui.item.porcentaje_monto_total == 0) {
											target.find('[name="item[][precio_unitario]"]').val(ui.item.precio / exchange_rate).data('old-value', ui.item.precio / exchange_rate);
											target.find('[name="item[][subtotal_precio]"]').val(ui.item.precio / exchange_rate);
											target.removeData('porcentaje-monto-total');
											target.find('[name="item[][precio_unitario]"]').removeProp('readonly');
										} else {
											// var total_a_cliente = $('[name="sobrecargo[5][subtotal]"]').val();
											var total_a_cliente = parseFloat($('input[name="cotizacion[ajuste]"]').val()) - parseFloat($('input[name="cotizacion[ajuste]"]').val()) * parseFloat($('input[name="sobrecargo[6][porcentaje]"]').val() / 100.00);
											target.data('porcentaje-monto-total', ui.item.porcentaje_monto_total);
											target.find('[name="item[][precio_unitario]"]').prop('readonly', true);
										}

										// Fórmula productor ejecutivo
										if (ui.item.formula_productor_ejecutivo) {
											target.find('[name="item[][precio_unitario]"]').prop('readonly', true);
											target.data('formula-productor-ejecutivo', true);
											// Bloquear nombre, tipo documento y cantidades
											target.find('[name="item[][nombre]"]').prop('readonly', true);
											target.find('button.show.item').invisible();
											target.find('[name="item[][tipo_documento]"]').prop('readonly', true);
											target.find('button.show.tipo-documento').hide();
											//target.find('[name="item[][cantidad]"]').prop('readonly', true);
											target.find('[name="item[][factor]"]').prop('readonly', true);
										} else {
											target.removeData('formula-productor-ejecutivo');
										}

										// Fórmula asistente producción
										if (ui.item.formula_asistente_produccion) {
											target.find('[name="item[][precio_unitario]"]').prop('readonly', true);
											target.data('formula-asistente-produccion', true);
											// Bloquear nombre, tipo documento y cantidades
											target.find('[name="item[][nombre]"]').prop('readonly', true);
											target.find('button.show.item').invisible();
											target.find('[name="item[][tipo_documento]"]').prop('readonly', true);
											target.find('button.show.tipo-documento').hide();
											//target.find('[name="item[][cantidad]"]').prop('readonly', true);
											target.find('[name="item[][factor]"]').prop('readonly', true);
										} else {
											target.removeData('formula-asistente-produccion');
										}

										if (ui.item.porcentaje_monto_total || ui.item.formula_productor_ejecutivo || ui.item.formula_asistente_produccion) {
											target.find('.remove.item').remove();
											target.find('.insert.item').remove();
											//simon itemparent start
											target.find('.parent.item').remove();
											//simon itemparent end
											target.find('.clone.item').remove();
											target.find('.ui-icon-arrow-4').remove();
										}

										if (ui.item.margen != 0) {
											target.data('preset-margen', true);
											target.data('preset-margen-value', ui.item.margen * 100.00);
											if (margen_desde_compra) {
												target.find('[name="item[][precio_unitario]"]').trigger('focus').val(0).data('old-value', 0).trigger('blur');
												target.find('[name="item[][margen_compra]"]').val(ui.item.margen * 100.00);
												target.find('[name="item[][margen_compra]"]').trigger('blur');
												if (!access._566)
													target.find('[name="item[][margen_compra]"]').prop('readonly', true);
											} else {
												target.find('[name="item[][margen_venta]"]').val(ui.item.margen * 100.00);
												target.find('[name="item[][margen_venta]"]').trigger('blur');
												if (!access._566)
													target.find('[name="item[][margen_venta]"]').prop('readonly', true);
											}
										} else {
											target.data('preset-margen', false);
										}

										target.find('[name="item[][aplica_sobrecargo]"]').prop('checked', ui.item.aplica_sobrecargo);

										target.find('[name="item[][ocultar_print]"]').prop('checked', ui.item.ocultar_print);

										// Corrección para caso margen desde compra
										if (typeof copiar_precio_a_costo == 'boolean' && margen_desde_compra)
											target.find('[name="item[][costo_unitario]"]').data('auto', true);

										if (typeof copiar_precio_a_costo == 'boolean' && !margen_desde_compra) {
											target.find('[name="item[][costo_unitario]"]').data('auto', true);
											if (ui.item.costo == 0) {
												target.find('[name="item[][costo_unitario]"]').val(ui.item.precio / exchange_rate).data('old-value', ui.item.precio / exchange_rate);
												target.find('[name="item[][subtotal_costo]"]').val(ui.item.precio / exchange_rate);
											} else {
												target.find('[name="item[][costo_unitario]"]').val(ui.item.costo / exchange_rate).data('old-value', ui.item.costo / exchange_rate);
												target.find('[name="item[][subtotal_costo]"]').val(ui.item.costo / exchange_rate);
											}
										} else {
											htmlObject.find('[name="item[][costo_unitario]"]').val(ui.item.costo / exchange_rate).data('old-value', ui.item.costo / exchange_rate);
											htmlObject.find('[name="item[][subtotal_costo]"]').val(ui.item.costo / exchange_rate);
										}

										target.find('[name="item[][nombre]"]').data('nombre-original', ui.item.text);

										var tooltip = ' \
											<p>Nombre ítem:</p> \
											<p>' + ui.item.text.replace("\n", '<p>&nbsp;</p>') + '</p> \
											<p>&nbsp;</p> \
											<p>Descripción larga:</p> \
											<p>' + ((ui.item.observacion != '') ? ui.item.observacion.replace(/\n/g, '</p><p>') : 'N/A') + '</p> \
											<p>&nbsp;</p>\
											<p>Observación interna:</p> \
											<p>' + ((ui.item.comentario != '') ? ui.item.comentario.replace(/\n/g, '</p><p>') : 'N/A') + '</p> \
										';
										target.find('button.profile.item').tooltipster('update', tooltip);

										// Mostrar signo de admiración (ui-icon-notice) si el ítem tiene comentario
										// caso contrario mostrar ícono normal (ui-icon-gear)
										if (ui.item.comentario != '') {
											target.find('button.profile.item').removeClass('ui-icon-gear').addClass('ui-icon-notice');
										} else {
											target.find('button.profile.item').removeClass('ui-icon-notice').addClass('ui-icon-gear');
										}

										var subtotal_precio = target.find('[name="item[][subtotal_precio]"]').val();
										var subtotal_costo = target.find('[name="item[][subtotal_costo]"]').val();

										var margen_compra = ((subtotal_precio - subtotal_costo) / subtotal_costo * 100).toFixed(2);
										var margen_venta = ((subtotal_precio - subtotal_costo) / subtotal_precio * 100).toFixed(2);

										target.find('[name="item[][margen_venta]"]').val(margen_venta);
										target.find('[name="item[][margen_compra]"]').val(margen_compra);

										if (!isFinite(margen_venta))
											target.find('[name="item[][margen_venta]"]').invisible();
										else
											target.find('[name="item[][margen_venta]"]').visible();

										if (!isFinite(margen_compra))
											target.find('[name="item[][margen_compra]"]').invisible();
										else
											target.find('[name="item[][margen_compra]"]').visible();

										target.find('[name="item[][utilidad]"]').val(subtotal_precio - subtotal_costo);

										// Fix: para evitar que quede en blanco el tipo de documento
										target.data('tipo-documento', 33);
										//target.find('input[name="item[][tipo_documento]"]').val('FE');
										if (typeof ui.item.tipo_documento != 'undefined' && ui.item.tipo_documento.id != 30 && ui.item.tipo_documento.id != 33) {
											target.data('tipo-documento', ui.item.tipo_documento.id);
											target.data('tipo-documento-text', ui.item.tipo_documento.text);
											target.data('tipo-documento-ratio', ui.item.tipo_documento.ratio);
											
											target.data('tipo-documento-valor-usd', ui.item.tipo_documento.valor_usd); // Impuesto extranjero
											target.data('tipo-documento-valor-moneda', ui.item.tipo_documento.valor_moneda); // Impuesto extranjero
											target.data('tipo-documento-inverse', ui.item.tipo_documento.inverse);
											target.find('[name="item[][tipo_documento]"]').val(ui.item.tipo_documento.abbr);
											if (ui.item.tipo_documento.ratio != 0) {
												target.find('[name="item[][precio_unitario]"]').addClass('edited');
												target.find('button.detail.price').visible();
											}
										} else {
											target.removeData('tipo-documento');
											target.removeData('tipo-documento-text');
											target.removeData('tipo-documento-ratio');
											target.removeData('tipo-documento-valor-usd'); // Impuesto extranjero
											target.removeData('tipo-documento-valor-moneda'); // Impuesto extranjero
											target.removeData('tipo-documento-inverse');
											target.find('[name="item[][precio_unitario]"]').removeClass('edited');
										}

										// Factor hora extra y jornada
										if (typeof ui.item.hora_extra != 'undefined') {
											target.data('hora-extra-enabled', true);
											target.data('hora-extra-factor', ui.item.hora_extra.factor);
											target.data('hora-extra-jornada', ui.item.hora_extra.jornada);
											target.data('hora-extra-dias', ui.item.hora_extra.dias);
											target.find('[name="item[][horas_extras]"]').parentTo('td').visible();
										} else {
											target.removeData('hora-extra-enabled');
											target.removeData('hora-extra-factor');
											target.removeData('hora-extra-jornada');
											target.data('hora-extra-dias', 7);
											target.find('[name="item[][horas_extras]"]').parentTo('td').invisible();
										}

										if ((typeof ui.item.tipo_documento != 'undefined' && ui.item.tipo_documento.id != 30 && ui.item.tipo_documento.id != 33) || typeof ui.item.hora_extra != 'undefined')
											target.find('button.detail.price').visible();

										var title = target.prevTo('.title');

										if (title.find('input[name="item[][nombre]"]').val() == '') {
											$.ajax({
												url: '/4DACTION/_V3_getCategoria',
												data: {
													q: ui.item.categoria.id,
													filter: 'id',
													from: 'negocio'
												},
												dataType: 'json',
												success: function (data) {
													if (data.rows.length) {
														var categoria = data.rows[0];
														title.data('categoria', categoria.id);
														title.find('input[name="item[][nombre]"]').val(categoria.text);
													}
												}
											});
										}

										target.find('span.unit').html(ui.item.unidad);

										target.data('observacion', ui.item.observacion);
										target.data('comentario', ui.item.comentario);

									} else {

										confirm('El ítem &laquo;' + $(element).parentTo('tr').find('[name="item[][nombre]"]').val().trim() + '&raquo; no existe en el catálogo.\n\n¿Desea crearlo?').done(function (data) {
											if (data)
												$.ajax({
													url: '/4DACTION/_V3_setProductoByCategoria',
													data: {
														id: $(element).parentTo('tr').prevTo('tr.title').data('categoria'),
														text: $(element).parentTo('tr').find('[name="item[][nombre]"]').val()
													},
													dataType: 'json',
													success: function (subdata) {
														if (subdata.success) {
															$(element).parentTo('tr').data('producto', subdata.id);
															$(element).parentTo('tr').find('[name="item[][nombre]"]').data('nombre-original', $(element).parentTo('tr').find('[name="item[][nombre]"]').val());
															toastr.info('Se ha agregado un nuevo ítem al catálogo');
														}
													}
												});
											else
												$(element).parentTo('tr').find('[name="item[][nombre]"]').val('');
										});
									}
								}
							}
						}
					}

					var has_change =
						(
							$(element).parentTo('tr').find('[name="item[][nombre]"]').val() != $(element).parentTo('tr').find('[name="item[][nombre]"]').data('nombre-original')
						) && (
							$(element).parentTo('tr').find('[name="item[][nombre]"]').data('nombre-original') != ''
						);

					if (has_change) {

						if (!$(element).parentTo('tr').hasClass('title')) {
							if ($(element).parentTo('tr').data('producto'))
								$(element).parentTo('tr').find('[name="item[][nombre]"]').addClass('edited');
						}

					} else
						$(element).parentTo('tr').find('[name="item[][nombre]"]').removeClass('edited');
				}
			}

			if ($(event.target).prop('name') == 'item[][margen_venta]')
				$(this).closest('tr').find('input[name="item[][costo_unitario]"]').trigger('focus').trigger('blur');

		}

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

		// mostrar decimales en precio unitario
		if (event.originalEvent !== undefined && $(event.target).prop('name') == 'item[][precio_unitario]') {
			$(event.target).data('old-value', $(event.target).val());
			$(event.target).unbind('.format');
			$(event.target).number(true, decimals, ',', '.');

			if ($(event.target).data('preset-margen')) {
				toastr.warning('No es posible modificar el monto, ya que el ítem cuenta con un margen de porcentaje predeterminado desde el catalogo.')
			}
		}

		// mostrar decimales en costo unitario
		if (event.originalEvent !== undefined && $(event.target).prop('name') == 'item[][costo_unitario]') {
			if (typeof $(event.target).data('first-focusout') == 'undefined') $(event.target).data('first-focusout', true);
			if ($(event.target).data('first-focusout')) {
				$(event.target).data('old-value', $(event.target).val());
				$(event.target).unbind('.format');
				$(event.target).number(true, decimals, ',', '.');
				$(event.target).data('first-focusout', false);
				$(event.target).removeData('first-focusin');
			}
		}
		if ($('section.sobrecargos li[data-total="true"]:not([data-ajuste="true"])').length > 0) {
			if (!unaBase.reaperMode) {
				for (var i = 0; i <= 6; i++) {
					if (v3_sobrecargos_cinemagica) {
						updateItemsPorcentaje(event);
					}
					sobrecargos.updateSobrecargos();
				}
			}
		}

	};

	$('table.items').on('focus', 'tbody td input[name="item[][precio_unitario]"]', function (event) {

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
		// ocultar decimales en precio unitario
		if (event.originalEvent !== undefined) {
			//if (typeof $(event.target).data('first-focusin') == 'undefined') $(event.target).data('first-focusin', true);
			//if ($(event.target).data('first-focusin')) {
			$(event.target).unbind('.format');
			$(event.target).number(true, decimals + 2, ',', '.');
			$(event.target).val($(event.target).data('old-value'));
			//	$(event.target).data('first-focusin', false);
			//	$(event.target).removeData('first-focusout');
			//}
		}
	});

	$('table.items').on('focus', 'tbody td input[name="item[][costo_unitario]"]', function (event) {
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

		// ocultar decimales en costo unitario
		if (event.originalEvent !== undefined) {
			if (typeof $(event.target).data('first-focusin') == 'undefined') $(event.target).data('first-focusin', true);
			if ($(event.target).data('first-focusin')) {
				if (typeof $(event.target).data('old-value') == 'undefined')
					$(event.target).data('old-value', parseFloat($(event.target).val().replaceAll(".", "").replaceAll(",", ".")))

				if (typeof $(event.target).data('oldValue') == 'undefined')
					$(event.target).data('oldValue', parseFloat($(event.target).val().replaceAll(".", "").replaceAll(",", ".")))

				if ($(event.target).data('old-value') == 0 && parseFloat($(event.target).val()) != $(event.target).data('old-value'))
					$(event.target).data('old-value', parseFloat($(event.target).val().replaceAll(".", "").replaceAll(",", ".")))

				$(event.target).unbind('.format');
				$(event.target).number(true, decimals + 2, ',', '.');
				$(event.target).val($(event.target).data('old-value'));
				$(event.target).data('first-focusin', false);
				$(event.target).removeData('first-focusout');
			}
		}
	});

	$('table.items').on('focus', 'tbody td input[name="item[][cantidad]"]', function (event) {
		if (event.originalEvent !== undefined) {
			if (typeof $(event.target).data('first-focusin') == 'undefined') $(event.target).data('first-focusin', true);
			if ($(event.target).data('first-focusin')) {
				$(event.target).unbind('.format');
				$(event.target).number(true, decimalesCantidad1, ',', '.');
				$(event.target).val(parseFloat($(event.target).data('old-value')));
				$(event.target).data('first-focusin', false);
				$(event.target).removeData('first-focusout');
			}
		}
	});

	$('table.items').on('focus', 'tbody td input[name="item[][factor]"]', function (event) {
		if (event.originalEvent !== undefined) {
			if (typeof $(event.target).data('first-focusin') == 'undefined') $(event.target).data('first-focusin', true);
			if ($(event.target).data('first-focusin')) {
				$(event.target).unbind('.format');
				$(event.target).number(true, decimalesCantidad2, ',', '.');
				$(event.target).val(parseFloat($(event.target).data('old-value')));
				$(event.target).data('first-focusin', false);
				$(event.target).removeData('first-focusout');
			}
		}
	});


	//REAPER FIX ---> caso desaparicion de casilla (input) al modificar valor (problema carlos robles)
	$('table.items').on('blur', 'tbody td input:not([type="checkbox"])', function (event) {

		updateLine(event)
	});
	// $('table.items').on('change', 'tbody input',  function(event) {

	// 	updateLine(event)});
	// $('table.items').on('change', 'tbody input[name="item[][subtotal_costo]"]',  function(event) {
	// 	
	// 	updateLine(event)});
	$('table.items').on('focus', 'tbody input[name="item[][margen_compra]"], tbody input[name="item[][margen_venta]"]', function (event) {
		$(event.target).data('old-value', $(event.target).val());
	});

	$('table.items').on('blur', 'tbody th input[name="item[][margen_compra]"], tbody th input[name="item[][margen_venta]"]', function (event) {

		var margen = parseFloat($(event.target).val());
		var is_valid = (margen_desde_compra && margen >= 0 && ((margen_desde_compra_inverso && margen < 100) || !margen_desde_compra_inverso)) || (!margen_desde_compra && margen >= 0 && margen <= 100);

		if (!is_valid && event.originalEvent !== undefined) {
			if (margen_desde_compra) {
				if (margen_desde_compra_inverso) {
					toastr.warning('El margen debe ser mayor o igual que 0, y menor que 100.');
				} else {
					toastr.warning('El margen no debe ser negativo.');
				}
			} else {
				toastr.warning('El margen debe tener un valor entre 0 y 100.');
			}
			$(event.target).val($(event.target).data('old-value'));
			return false;
		}

		if (event.originalEvent !== undefined) {
			unaBase.ui.block();
		}

		var new_margen = parseFloat($(this).val());
		var items = $(this).closest('tr').nextUntil('tr.title');
		items.each(function () {
			if (($(this).data('preset-margen') && access._566) || !$(this).data('preset-margen')) {
				if (margen_desde_compra) {
					$(this).find('[name="item[][margen_compra]"]').trigger('focus').val(new_margen).trigger('blur');
				} else {
					$(this).find('[name="item[][margen_venta]"]').trigger('focus').val(new_margen).trigger('blur');
				}
			}
		});

		if (event.originalEvent !== undefined) {
			unaBase.ui.unblock();
		}
	});

	$('table.items').on('focus', 'tfoot th input[name="cotizacion[margenes][margen_venta]"], tfoot th input[name="cotizacion[margenes][margen_compra]"]', function (event) {
		$(event.target).data('old-value', $(event.target).val());
	});

	$('table.items').on('blur', 'tfoot th input[name="cotizacion[margenes][margen_venta]"], tfoot th input[name="cotizacion[margenes][margen_compra]"]', function (event) {
		if (event.originalEvent !== undefined) {
			var margen = parseFloat($(event.target).val());
			var is_valid = (margen_desde_compra && margen >= 0 && ((margen_desde_compra_inverso && margen < 100) || !margen_desde_compra_inverso)) || (!margen_desde_compra && margen >= 0 && margen <= 100);
			if (is_valid) {
				unaBase.ui.block();
				var margen_fijo = $(this).closest('tr').find('[name="cotizacion[margenes][fijo]"]').prop('checked');
				$(this).closest('tr').find('[name="cotizacion[margenes][fijo]"]').prop('checked', false).trigger('change');
				var new_margen = parseFloat($(this).val());
				var titulos = $('table.items tbody').find('tr.title');
				titulos.each(function () {
					if (margen_desde_compra) {
						$(this).find('[name="item[][margen_compra]"]').trigger('focus').val(new_margen).trigger('blur');
					} else {
						$(this).find('[name="item[][margen_venta]"]').trigger('focus').val(new_margen).trigger('blur');
					}
				});
				$(this).closest('tr').find('[name="cotizacion[margenes][fijo]"]').prop('checked', margen_fijo).trigger('change');
				unaBase.ui.unblock();
			} else {
				if (margen_desde_compra) {
					if (margen_desde_compra_inverso) {
						toastr.warning('El margen debe ser mayor o igual que 0, y menor que 100.');
					} else {
						toastr.warning('El margen no debe ser negativo.');
					}
				} else {
					toastr.warning('El margen debe tener un valor entre 0 y 100.');
				}
				$(event.target).val($(event.target).data('old-value'));
			}
		}
	});

	$('table.items').on('change', 'tfoot th input[name="cotizacion[margenes][fijo]"]', function (event) {
		var checked = $(event.target).is(':checked');

		var changeMargenFijo = function (event) {
			if (event.originalEvent !== undefined)
				unaBase.ui.block();

			var items = $('table.items tbody').find('tr:not(.title)');
			if (margen_desde_compra) {
				var margen = $('table.items tfoot th input[name="cotizacion[margenes][margen_compra]"]');
			} else {
				var margen = $('table.items tfoot th input[name="cotizacion[margenes][margen_venta]"]');
			}
			items.each(function () {
				var target = $(this);
				if (checked) {
					target.data('fixed-margen', true);
					target.data('fixed-margen-value', parseFloat(margen.val()));
					if (margen_desde_compra) {
						//target.find('[name="item[][margen_compra]"]').trigger('blur');
						target.find('[name="item[][margen_compra]"]').prop('readonly', true);
						target.find('[name="item[][margen_compra]"]').visible();
					} else {
						//target.find('[name="item[][margen_venta]"]').trigger('blur');
						target.find('[name="item[][margen_venta]"]').prop('readonly', true);
						target.find('[name="item[][margen_venta]"]').visible();
					}
				} else {
					target.data('fixed-margen', false);
					if (margen_desde_compra) {
						if (!access._566)
							target.find('[name="item[][margen_compra]"]').prop('readonly', target.data('preset-margen'));
						else
							target.find('[name="item[][margen_compra]"]').prop('readonly', false);
						//target.find('[name="item[][margen_compra]"]').trigger('blur');
					} else {
						if (!access._566)
							target.find('[name="item[][margen_venta]"]').prop('readonly', target.data('preset-margen'));
						else
							target.find('[name="item[][margen_venta]"]').prop('readonly', false);
						//target.find('[name="item[][margen_venta]"]').trigger('blur');
					}
				}
			});

			if (event.originalEvent !== undefined) {
				if (margen_desde_compra) {
					$('table.items tfoot th input[name="cotizacion[margenes][margen_compra]"]').trigger('focus').trigger('blur');
				} else {
					$('table.items tfoot th input[name="cotizacion[margenes][margen_venta]"]').trigger('focus').trigger('blur');
				}
				unaBase.ui.unblock();
			}
		}

		if (event.originalEvent !== undefined && checked) {
			confirm('¿Desea cambiar a margen fijo?\n\nEsto podría cambiar los montos.').done(function (data) {
				if (data) {
					changeMargenFijo(event);
				} else {
					event.preventDefault();
					$(event.target).prop('checked', false);
				}
			}).fail(function () {
				$(event.target).prop('checked', false);
			});
		} else {
			changeMargenFijo(event);
		}


	});

	$('table.items').on('keypress', 'tbody tr input', function (event) {

		var target = $(this).parentTo('tr');
		switch (event.keyCode) {
			case 13:
				if (event.shiftKey) {
					if (target.prev().length > 0)
						target.prev().find('[name="item[][nombre]"]').focus();
				} else {
					target.find('[name="item[][nombre]"]').addClass('invalid');
					if (target.next().length > 0)
						target.next().find('[name="item[][nombre]"]').focus();
					else {
						if (target.find('[name="item[][nombre]"]').val() != '' && target.find('[name="item[][nombre]"]').data('ajax-call') === undefined) {
							if (target.hasClass('title'))
								target.find('button.add.item').click();
							else
								//target.prevTo('.title').find('button.add.item').click();
								target.find('button.insert.item').click();
						}
					}
					target.find('[name="item[][nombre]"]').removeClass('invalid');
				}
				break;
			case 10:
				target.prevTo('.title').find('button.add.item').click();
				break;
		}
	});

	/* $('table.items').delayed('focus', 100, 'tbody button', function(event) {
		// FIXME: revisar, ya que al hacer tab hacia atrás no está permitiendo que se seleccione un campo previo
		$.emulateTab();
	}); */

	// Sobrecargo cinemágica
	if (v3_sobrecargos_cinemagica) {
		$('section.sheet footer .block-totales').on('blur', '[name="sobrecargo[1][subtotal]"]', function (event) {
			var valor_pelicula = parseFloat($(event.target).closest('li').find('[name^="sobrecargo"][name$="[subtotal]"]').val());
			var valorObject = $(event.target).closest('li').find('[name^="sobrecargo"][name$="[valor]"]');
			var porcentajeObject = $(event.target).closest('li').find('[name^="sobrecargo"][name$="[porcentaje]"]');
			var subtotal_items = parseFloat($('[name="cotizacion[precios][subtotal]"]').val());
			var director_internacional = parseFloat($('[name="cotizacion[precios][subtotal]"]').data('director-internacional'));

			if (valor_pelicula < subtotal_items) {
				toastr.warning('El valor película no puede ser menor al subtotal de ítems.');
				porcentajeObject.val(0).data('value', 0).trigger('focus').trigger('blur');

				// Sección datos cinemágica
				refreshValorPeliculaFromSobrecargos();

				return false;
			}

			//var valor_nuevo_sobrecargo = valor_pelicula - subtotal_items;
			var valor_nuevo_sobrecargo = valor_pelicula - (subtotal_items - director_internacional);

			//var porcentaje = (1 - subtotal_items / valor_pelicula) * 100.00;
			var porcentaje = (1 - (subtotal_items - director_internacional) / valor_pelicula) * 100.00;

			valorObject.val(valor_nuevo_sobrecargo);
			porcentajeObject.val(porcentaje).data('value', porcentaje).trigger('focus').trigger('blur');
			unaBase.ui.block();
			$('table.items.cotizacion').find('tr.title').each(function (key, item) {
				var next = $(item).next();
				if (next.length > 0)
					updateSubtotalTitulos(next);
			});
			updateSubtotalItems();
			unaBase.ui.unblock();

			if (typeof event.originalEvent == 'object') {
				$('section.sheet footer .block-totales [name="sobrecargo[1][subtotal]"]').val(valor_pelicula).trigger('blur');
				//$('section.sheet footer .block-totales [name="sobrecargo[1][subtotal]"]').val(valor_pelicula - director_internacional).trigger('blur');
			}

		});
	}

	$('section.sheet footer .block-totales').on('blur', '[name^="sobrecargo"][name$="[porcentaje]"]', function (event) {

		if (v3_sobrecargos_cinemagica && typeof chain == 'undefined') {
			// actualiza porcentaje de item
			var item;
			var precio_unitario = 0;
		}

		if (!$(this).prop('readonly')) {
			contentChanged = true;
			contentReady = false;
			if ($(event.target).parentTo('ul').find('li[data-total="true"]').length > 1 || $(event.target).prop('name') == 'sobrecargo[1][porcentaje]') {
				if ($('section.sheet').data('no-update')) { // Optimización cálculos cinemágica
					updateItemsPorcentaje(event);
					sobrecargos.updateSobrecargos();
				} else {
					if (!unaBase.reaperMode) {
						for (var i = 0; i <= 10; i++) {
							if (v3_sobrecargos_cinemagica) {
								updateItemsPorcentaje(event);
							}
							sobrecargos.updateSobrecargos();
						}
					} else {
						sobrecargos.updateSobrecargos();
					}

				}
			} else
				sobrecargos.updateSobrecargos();
		}
	});

	$('section.sheet footer .block-totales').on('blur', '[name^="sobrecargo"][name$="[valor]"]', function (event) {
		if (event.isSimulated)
			return false;

		if (!scDirectInput) {

			var valor_sobrecargo_anterior = parseFloat($(this).data('old-value'));
			var valor_sobrecargo_actual = parseFloat($(this).val());
			if (valor_sobrecargo_anterior != valor_sobrecargo_actual) {
				var base_total_sobrecargo = parseFloat($('input[name="cotizacion[montos][subtotal_neto]"]').val());
				var porcentaje_sobrecargo = 0;
				if ($(this).parentTo('li').find('[name^="sobrecargo"][name$="[porcentaje]"]').prop('readonly')) {
					var subtotal_sobrecargo_previo = ($(this).parentTo('li').prev().length) ? $(this).parentTo('li').prev().find('[name^="sobrecargo"][name$="[subtotal]"]').val() : $('input[name="cotizacion[precios][subtotal]"]').val();
					porcentaje_sobrecargo = (valor_sobrecargo_actual / subtotal_sobrecargo_previo) * 100;
				} else
					porcentaje_sobrecargo = (valor_sobrecargo_actual / base_total_sobrecargo) * 100;

				$(this).parentTo('li').find('[name^="sobrecargo"][name$="[porcentaje]"]').val(porcentaje_sobrecargo.toFixed(2));

				sobrecargos.updateSobrecargos();
			}
			$(this).triggerHandler('focus');

			if ($(this).parentTo('li').find('[name^="sobrecargo"][name$="[porcentaje]"]').prop('readonly'))
				$('[name="cotizacion[descuento][valor]"]').triggerHandler('blur');


		}

		sobrecargos.updateSobrecargos();

	});

	$('section.sheet footer').on('change', 'li[data-ajuste="true"] [name^="sobrecargo"][name$="[cerrado]"]', function () {
		checkAjuste(true);
	});

	$('section.sheet footer').on('change', '[name^="sobrecargo"][name$="[cerrado]"]', function (event) {
		// Confirmar cambio en cierre de sobrecargo
		if (!$('table.items.cotizacion').data('edit-sobrecargo-cerrado-remember')) {
			unaBase.ui.unblock();
			confirm("¿Está seguro de cambiar el cierre del sobrecargo?<br><br><label><input type=\"checkbox\" name=\"edit_sobrecargo_cerrado_remember\"> No volver a preguntar para esta cotización</label>", 'Sí', 'No').done(function (data) {
				if (data) {
					sobrecargos.updateSobrecargos();
					$('li[data-name="save"] > button').triggerHandler('click');
				} else {
					var isChecked = $(event.target).prop('checked');
					$(event.target).prop('checked', !isChecked);
				}
				if ($('[name="edit_sobrecargo_cerrado_remember"]').is(':checked')) {
					$('table.items.cotizacion').data('edit-sobrecargo-cerrado-remember', true);
				}
			}).fail(function () {
				var isChecked = $(event.target).prop('checked');
				$(event.target).prop('checked', !isChecked);
			});
		} else {
			sobrecargos.updateSobrecargos();
			$('li[data-name="save"] > button').triggerHandler('click');
		}
	});

	$('[name="cotizacion[descuento][porcentaje]"]').on('focus', function () {
		$(this).data('old-value', $(this).val());
	});

	$('[name="cotizacion[descuento][porcentaje]"]').on('change', function () {

		var old_value = $(this).data('old-value');
		var porcentaje_descuento = parseFloat($(this).val());
		if (porcentaje_descuento >= 0.00 && porcentaje_descuento <= 100.00) {
			// for (var i = 0; i < 20; i++) {
			// 	var subtotal_precios = parseFloat($('[name="cotizacion[precios][subtotal]"]').val());
			// 	var subtotal_sobrecargos = parseFloat($('[name="cotizacion[sobrecargos][subtotal]"]').val());

			// 	var valor_descuento = (subtotal_precios + subtotal_sobrecargos) * porcentaje_descuento / 100.00;
			// 	if (typeof selected_currency == 'undefined')
			// 		$('[name="cotizacion[descuento][valor]"]').val(valor_descuento.toFixed(currency.decimals));
			// 	else
			// 		$('[name="cotizacion[descuento][valor]"]').val(valor_descuento.toFixed(2));

			// 	$('[name="cotizacion[descuento][valor]"]').trigger('blur');

			// 	// updateSubtotalNeto();
			sobrecargos.updateSobrecargos();
			//}
		} else {
			toastr.warning('El porcentaje del descuento debe estar entre 0 y 100');
			$(this).val($(this).data('old-value'));
		}
	});

	$('[name="cotizacion[descuento][valor]"]').on('change', function () {
		$(this).validateNumbers();
		var subtotal_precios = parseFloat($('[name="cotizacion[precios][subtotal]"]').val());
		var subtotal_sobrecargos = parseFloat($('[name="cotizacion[sobrecargos][subtotal]"]').val());
		var valor_descuento = parseFloat($(this).val());

		var porcentaje_descuento = valor_descuento / (subtotal_precios + subtotal_sobrecargos) * 100.00;
		//var porcentaje_descuento =( valor_descuento * 100 )/ (subtotal_precios + subtotal_sobrecargos);

		if (valor_descuento >= 0 && valor_descuento <= subtotal_precios + subtotal_sobrecargos) {
			$('[name="cotizacion[descuento][porcentaje]"]').val(porcentaje_descuento.toFixed(6));
		} else {
			toastr.warning('El monto del descuento no debe ser mayor al total');
			var zero = 0;
			$('[name="cotizacion[descuento][porcentaje]"]').val(zero.toFixed(6));

		}

		// updateSubtotalNeto();
		sobrecargos.updateSobrecargos();

	});

	$('[name="cotizacion[ajuste]"]').on('blur', function (event) {

		if (typeof event.originalEvent != 'undefined') {
			unaBase.ui.block();

			$(this).data('target-value', parseFloat($(this).val()));
			$(this).data('iterations', parseFloat(1));
		} else {
			if ($(this).data('iterations') == 1)
				totalNeto = parseFloat($(this).val());
			$(this).data('iterations', parseFloat($(this).data('iterations')) + 1);
		}

		// actualiza porcentaje de item
		var item;
		var precio_unitario = 0;

		if ($(this).data('iterations') == 1) {
			if (v3_sobrecargos_cinemagica) {
				var total_a_cliente = parseFloat($('input[name="cotizacion[ajuste]"]').val());
			} else {
				var total_a_cliente = parseFloat($('input[name="cotizacion[ajuste]"]').val()) - parseFloat($('input[name="cotizacion[ajuste]"]').val()) * parseFloat($('input[name="sobrecargo[6][porcentaje]"]').val() / 100.00);
			}
			var that = this;
			$('table.items tbody').find('tr').each(function () {
				if (typeof $(this).data('porcentaje-monto-total') == 'object') {
					item = $(this);

					var id_item = item.data('id');
					var cantidad = parseFloat(item.find('input[name="item[][cantidad]"]').data('old-value'));
					var factor = parseFloat(item.find('input[name="item[][factor]"]').data('old-value'));
					var porcentaje_monto_total = $(this).data('porcentaje-monto-total');

					precio_unitario = total_a_cliente * porcentaje_monto_total / (cantidad * factor);

					if (typeof item != 'undefined' && ((fixedTotalCliente && (precio_unitario == 0 || precio_unitario != parseFloat((item.find('input[name="item[][precio_unitario]"]').data('old-value')) ? item.find('input[name="item[][precio_unitario]"]').data('old-value') : item.find('input[name="item[][precio_unitario]"]').val()))) || !fixedTotalCliente))
						item.find('input[name="item[][precio_unitario]"]').val(precio_unitario).data('old-value', precio_unitario).trigger('blur');
				}
			});
		}

		$(this).validateNumbers();

		let typesc = 'input[name$="[valor]"]';
		// if(unaBase.doc.reaperMode)
		// 	typesc= 'input[name$="[valor-sc]"]';
		// else
		// 	typesc= 'input[name$="[valor]"]';


		var valor_ajuste = parseFloat($(this).val());
		var subtotal_neto = parseFloat($('input[name="cotizacion[montos][subtotal_neto]"]').val());
		var sobrecargo = parseFloat($(`section.sobrecargos li[data-ajuste="true"] ${typesc}`).val());




		var diferencia_ajuste = valor_ajuste - subtotal_neto + sobrecargo;

		if (diferencia_ajuste != 0) {
			$('button.reset.ajuste').show();
			$('[name="cotizacion[montos][subtotal_neto]"]').addClass('ajustado');
		} else {
			$('button.reset.ajuste').hide();
			$('[name="cotizacion[montos][subtotal_neto]"]').removeClass('ajustado');
		}

		if (typeof event.originalEvent != 'undefined')
			$(this).data('first-value', diferencia_ajuste);

		$('[name="cotizacion[montos][subtotal_neto]"]').addClass('ajustado');

		$(this).data('value', diferencia_ajuste);

		if (diferencia_ajuste > 0)
			$('[name="cotizacion[montos][subtotal_neto]"]').addClass('ajustado');
		else
			$('[name="cotizacion[montos][subtotal_neto]"]').removeClass('ajustado');

		$(`section.sobrecargos li[data-ajuste="true"] ${typesc}`).val($(this).data('value')).trigger('blur');
		if (!unaBase.reaperMode) {

			$('[name="cotizacion[ajuste][diferencia]"]').val($(this).data('value'));
		}

		if (parseFloat($(this).val()) != parseFloat($(this).data('target-value'))) {
			if ($(this).data('iterations') <= 24)
				$(this).val($(this).data('target-value')).triggerHandler('blur');
			else {
				unaBase.ui.unblock();
				//$('[name="cotizacion[ajuste][diferencia]"]').val($(this).data('first-value'));
				$('input[name="sobrecargo[5][valor]"]').val($('input[name="cotizacion[ajuste][diferencia]"]').val());
			}
		} else {
			unaBase.ui.unblock();
			if (diferencia_ajuste != 0) {
				$('[name="cotizacion[montos][subtotal_neto]"]').addClass('ajustado');
			} else
				$('[name="cotizacion[montos][subtotal_neto]"]').removeClass('ajustado');
		}
	});

	$('button.reset.ajuste').button({
		caption: 'Restablecer ajuste',
		icons: {
			primary: 'ui-icon-circle-close'
		},
		text: false
	}).click(function () {
		totalNeto = 0;
		unaBase.ui.block();

		let typesc = 'input[name$="[valor]"]';
		// if(unaBase.doc.reaperMode)
		// 	typesc= 'input[name$="[valor-sc]"]';
		// else
		// 	typesc= 'input[name$="[valor]"]';

		$(`section.sobrecargos li[data-ajuste="true"] ${typesc}`).val(0).trigger('change');
		$('input[name="cotizacion[ajuste][diferencia]"]').val(0);
		unaBase.ui.unblock();
		toastr.info('Ajuste restablecido con éxito.');
		$(this).hide();
		if (!unaBase.reaperMode) {
			for (var i = 0; i <= 24; i++)
				sobrecargos.updateSobrecargos();
		} else
			sobrecargos.updateSobrecargos();
	});

	$('[name="cotizacion[montos][impuesto][exento]"]').change(function (event) {
		// Confirmar modificación check exento
		confirm('¿Está seguro de modificar el estado exento del negocio?<br>-Esto podría cambiar los valores totales.').done(function (data) {
			if (data) {
				totales.updateTotal();
			} else {
				$(event.target).prop('checked', !$(event.target).prop('checked'));
			}
		}).fail(function () {
			$(event.target).prop('checked', !$(event.target).prop('checked'));
		});
	});

	getDetail(function () {
		var detalle_items = $('section.sheet.detalle-items');

		if (detalle_items.data('readonly') || detalle_items.data('locked') || !(access._528 || autoriza_modificacion)) {
			// $('table.items button.toggle.all').trigger('click');
			detalle_items.find('input, textarea, tr *:not(.dropdown-button) span').not('[name="item[][selected]"]').not('.dropdown-button').prop('disabled', true).removeAttr('placeholder');
			if (v3_mod_gastop_compras_cerradas && cerradoCompras) {
				detalle_items.find('input[name="item[][costo_unitario]"]').prop('disabled', false);
				detalle_items.find('input[name="item[][subtotal_costo]"]').prop('disabled', false);
			}

			// simon 20julio2017 muestra siempre boton de colapsar categoria e items
			//alert();
			detalle_items.find('tr button:not(.toggle), ul.editable button, footer button, .fetch.exchange-rate').not('.detail').not('.dropdown-button').not('[name="item[][closed_compras]"]').hide();
			detalle_items.find('table.items > * > tr > *:first-of-type > *').hide();
			detalle_items.find('table.items tbody tr').draggable('destroy');
			detalle_items.find('[name="cotizacion[currency][working]"], [name="cotizacion[tipo_cambio]"]').prop('disabled', true);
			detalle_items.find('select[name="item[][tipo_documento]"]').attr('disabled', true);
			detalle_items.find('select[name="item[][tipo_documento_compras]"]').attr('disabled', true);

		}
		
		if ((access._528 || autoriza_modificacion) && access._578 && negocioFacturado) {
			detalle_items.find('[name="item[][tipo_documento]"]').prop('readonly', true);
			detalle_items.find('[name="item[][cantidad]"]').prop('readonly', true);
			detalle_items.find('[name="item[][factor]"]').prop('readonly', true);
			detalle_items.find('[name="item[][horas_extras]"]').prop('readonly', true);
			detalle_items.find('[name="item[][precio_unitario]"]').prop('readonly', true);
			detalle_items.find('[name="item[][subtotal_precio]"]').prop('readonly', true);
			detalle_items.find('[name="item[][margen_compra]"]').prop('disabled', true);
			detalle_items.find('[name="item[][margen_venta]"]').prop('disabled', true);
			detalle_items.find('[name="item[][aplica_sobrecargo]"]').prop('disabled', true);
			detalle_items.find('[name="cotizacion[margenes][margen_compra]"]').prop('disabled', true);
			detalle_items.find('[name="cotizacion[margenes][margen_venta]"]').prop('disabled', true);
			detalle_items.find('[name="cotizacion[margenes][fijo]"]').prop('disabled', true);
			detalle_items.find('[name*="sobrecargo"]').prop('disabled', true);
			detalle_items.find('[name*="cotizacion[descuento]"]').prop('disabled', true);
			detalle_items.find('[name*="cotizacion[ajuste]"]').prop('disabled', true);
			detalle_items.find('[name="cotizacion[montos][impuesto][exento]"]').prop('disabled', true);

		}

		// Permiso bloquear sección venta (negocios)
		if (access._590) {
			detalle_items.find('[name="item[][codigo]"]').prop('readonly', true);
			detalle_items.find('[name="item[][nombre]"]').prop('readonly', true);
			detalle_items.find('button.show.item').hide();
			detalle_items.find('button.show.tipo-documento').hide();
			detalle_items.find('[name="item[][tipo_documento]"]').prop('readonly', true);
			//detalle_items.find('[name="item[][cantidad]"]').prop('readonly', true);
			//detalle_items.find('[name="item[][factor]"]').prop('readonly', true);
			detalle_items.find('[name="item[][horas_extras]"]').prop('readonly', true);
			detalle_items.find('[name="item[][precio_unitario]"]').prop('readonly', true);
			detalle_items.find('[name="item[][subtotal_precio]"]').prop('readonly', true);
		}

		// Permiso bloquear gasto presupuestado (negocios)
		if (access._595 && !v3_mod_gastop_compras_cerradas) {
			detalle_items.find('[name="item[][costo_unitario]"]').prop('readonly', true);
			detalle_items.find('[name="item[][subtotal_costo]"]').prop('readonly', true);
		}


		updateSubtotalItems();


		// Sección datos cinemágica

		blockCinemagica.find('[name="sobrecargo[1][subtotal][usd]"]').number(true, 2, ',', '.');

		blockCinemagica.find('.numeric.percent input').bind('focus', function () {
			if (typeof $(this).data('value') == 'undefined')
				$(this).data('value', $(this).val());
			$(this).unbind('.format').number(true, 6, ',', '.').val($(this).data('value'));
		});

		blockCinemagica.find('.numeric.percent input').bind('focusout', function (event) {
			$(this).data('value', $(this).val()).unbind('.format').number(true, 2, ',', '.');
		});

		// Sección sobrecargos cinemagica
		refreshValorPeliculaFromSobrecargos();
		blockCinemagica.find('[name="sobrecargo[1][porcentaje]"]').on('blur', refreshUtilidadBrutaToSobrecargos);
		blockCinemagica.find('[name="sobrecargo[1][subtotal]"]').on('blur', refreshValorPeliculaToSobrecargos);
		blockCinemagica.find('[name="sobrecargo[4][porcentaje]"]').on('blur', refreshCostosFijosToSobrecargos);
		blockCinemagica.find('[name="sobrecargo[6][porcentaje]"]').on('blur', refreshComisionAgenciaToSobrecargos);
		blockCinemagica.find('[name="cotizacion[cinemagica][director][porcentaje]"]').on('blur', refreshDirector);

		var valor_pelicula = parseFloat(blockCinemagica.find('[name="sobrecargo[1][subtotal]"]').val());
		blockCinemagica.find('[name="sobrecargo[1][subtotal]"]').data('old-value', valor_pelicula);

		// Permisos por columna
		columnsPermissions();

		//business.staff.checkShowTotals();
	});



	//-----------------------   Eventos   --------------------------
	//----------------------------------------------------------------

	business.getSobrecargoData();
	sobrecargos.getSobrecargos();
	sobrecargos.getSobrecargosInfo();

	totales.checkAjuste($('section.sheet').data('new'));

	var showHelp = function () {
		$('[data-help]').each(function () {
			$(this).qtip({
				content: {
					text: $(this).data('help')
				}
			}).on('click focus', function () {
				$(this).qtip('hide');
			})
			$(this).qtip('show');
		});

		$('section.sheet').bind('scroll mousewheel', function () {
			$('[data-help]').each(function () {
				$(this).qtip('hide');
			});
			$('section.sheet').unbind('scroll mousewheel');
		});
	};

	var hideHelp = function () {
		$('[data-help]').each(function () {
			$(this).qtip('hide');
		});
	};

	// FIXME: Se deshabilita hasta poder corregirlo
	/* if ($('section.sheet').data('new')) {
		setTimeout(showHelp, 1000);
	}; */


	$('section.sheet').on('blur', 'tr:not(.title) input[name="item[][precio_unitario]"]', updatePrecioCotizado);
	$('section.sheet').on('focus', 'tr:not(.title) input[name="item[][precio_unitario]"].edited', updatePrecioNegociado);
	$('section.sheet').on('blur', 'tr:not(.title) input[name="item[][costo_unitario]"]', updatePrecioCotizado);
	$('section.sheet').on('focus', 'tr:not(.title) input[name="item[][costo_unitario]"].edited', updatePrecioNegociado);
	$('section.sheet').on('focus', 'tr:not(.title) input[name="item[][subtotal_costo]"]', updatePrecioNegociado);
	$('section.sheet').on('change', 'tr:not(.title) input[name="item[][horas_extras]"]', updateHorasExtras);
	$('section.sheet').on('change', 'tr:not(.title) input[name="item[][factor]"]', updateHorasExtras);
	$('section.sheet').on('change', 'tr:not(.title) input[name="item[][cantidad]"]', updateHorasExtras);


	$('section.sheet').on('change', 'tr.title input[name="item[][horas_extras]"]', function (event) {
		var horas_extras = $(this).val();
		var items = $(this).parentTo('tr').nextUntil('.title');
		items.each(function () {
			$(this).find('input[name="item[][horas_extras]"]').val(horas_extras).trigger('change').trigger('update');
		});
	});

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
							<span class="numeric currency">' + localCurrency + ' <span style="display: inline-block; width: 100px; text-align: right; ""></span></span>				\
						</li>																																						\
						<li data-name="imposiciones">																																\
							<strong style="font-weight: bold; display: inline-block; width: 300px;">Imposiciones (<span class="numeric percent"></span>%)</strong>					\
							<span class="numeric currency">' + localCurrency + ' <span style="display: inline-block; width: 100px; text-align: right; ""></span></span>				\
						</li>																																						\
						<li data-name="retencion">																																	\
							<strong style="font-weight: bold; display: inline-block; width: 300px;">Retención (<span class="numeric percent"></span>%)</strong>						\
							<span class="numeric currency">' + localCurrency + ' <span style="display: inline-block; width: 100px; text-align: right; ""></span></span>				\
						</li>																																						\
						<li data-name="horas-extras">																																\
							<strong style="font-weight: bold; display: inline-block; width: 300px;">Horas extras (<span class="numeric percent"></span>)</strong>					\
							<span class="numeric currency">' + localCurrency + ' <span style="display: inline-block; width: 100px; text-align: right; ""></span></span>				\
						</li>																																						\
						<li data-name="total" style="border-top: 1px solid grey; margin-top: 10px; padding-top: 10px;">																\
							<strong style="font-weight: bold; display: inline-block; width: 300px;">Total</strong>																	\
							<span class="numeric currency">' + localCurrency + ' <span style="display: inline-block; width: 100px; text-align: right;""></span></span>				\
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

				var valor_negociado = 0;
				if (division) {
					htmlObject.find('li[data-name="imposiciones"]').hide();
					// Impuesto extranjero
					if (valor_usd)
						valor_negociado = base_imponible * (1 - impuesto);
					else
						valor_negociado = base_imponible * (1 - impuesto);
				} else {
					htmlObject.find('li[data-name="retencion"]').hide();
					valor_negociado = base_imponible / (1 + impuesto);
				}

				var imposiciones = base_imponible - valor_negociado;

				// Impuesto extranjero
				if (valor_usd)
					htmlObject.find('li[data-name="valor-negociado"] span.valor-usd').text(' (' + codigoLinea + ' ' + unaBase.utilities.transformNumber((valor_negociado / valor_moneda).toFixed(2).replace(/\./g, ','), 'view', 'end') + ')'); // Impuesto extranjero

				htmlObject.find('li[data-name="tipo-documento"] > span').text(tipo_documento);

				if (typeof selected_currency == 'undefined')
					htmlObject.find('li[data-name="valor-negociado"] > span > span').text(valor_negociado.toFixed(currency.decimals).replace(/\./g, ','));
				else
					htmlObject.find('li[data-name="valor-negociado"] > span > span').text(valor_negociado.toFixed(2).replace(/\./g, ','));

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

	$('section.sheet').on('click', 'button.detail.argentina', function (event) {
		var element = $(this);

		const saveNvSica = (idnv, llave, temp_llave_nv, cantidad, dias, id_sica, subtotal, type) => {

			$.ajax({
				url: '/4DACTION/_force_setNVSica',
				data: {
					id_nv: idnv,
					cantidad: cantidad,
					dias: dias,
					id_sica: id_sica,
					subtotal,
					llave_nv: llave,
					llave_nv_temp: temp_llave_nv,
					type

				},
				dataType: 'json',
				async: false,
				cache: false,
				success: function (data) {
					let total = 0;

				}
			});
		}

		element.tooltipster({
			content: function () {

				let parentElement = element[0].parentNode.parentNode;

				let id_servicio = parentElement.dataset.producto !== "0" ?
					parentElement.dataset.producto :
					(parentElement.children[2].children[1].dataset.id !== undefined ?
						parentElement.children[2].children[1].dataset.id :
						parentElement.children[2].children[0].dataset.id);


				const id_nv = element[0].parentNode.parentNode.dataset.id

				const type_ = element[0].classList[2]
				let tipo_ = 0
				switch (type_) {
					case 'presupuesto': {
						tipo_ = 1
						break;
					}

					case 'previo': {
						tipo_ = 2
						break;
					}

					case 'actual': {
						tipo_ = 3
						break;
					}
				}

				const type_sica = tipo_

				//let idnv = $('section.sheet').data('id')
				let idnv = $('#main-container').data('id')
				//let temp_llave_nv = idnv + '' + element[0].parentNode.parentNode.children[2].children[1].value.substring(0, 5) + '' + id_servicio
				let llave_nv = element[0].parentNode.parentNode.dataset.id != undefined ? element[0].parentNode.parentNode.dataset.id : ''

				let temp_llave_nv = element[0].parentNode.parentNode.dataset.tempnvsica

				let sel = '<select class="my-1 mr-sm-2 form-control" id="select_version" style="margin-bottom: 20px!important; border: 1px solid #98A1B2;min-width: 180px;min-height: 30px;">'
				$.ajax({
					url: '/4DACTION/_light_getSicaVersion',
					dataType: 'json',
					async: false,
					cache: false,
					success: function (data) {
						let size = data.rows.length

						let cont = 1
						data.rows.forEach(v => {
							sel += `<option value="${v.id}" data-id="${v.id}" ${cont == data.rows.length ? 'selected' : ''}>${v.text}</option>`
							cont++
						})

					}
				});

				sel += '</select>'


				let htmlObject = `<div class="table-responsive" style="padding:10px;background-color:white;font-size: 10px;" class="lines-details-calculate">
				
					${sel}
				
				<table class="table table-striped">
					<thead style="background-color: #F9BD00"; color: white>
						<tr  height="30px" >		
							<th style="font-weight:bold; text-align: center;vertical-align:middle;" width="70px">Nombre</th>
							
							<th  style="font-weight:bold; text-align: center;vertical-align:middle;" width="70px">Cantidad</th>	

							<th  style="font-weight:bold; text-align: center;vertical-align:middle;" width="70px">Dias</th>	
										
							<th style="font-weight:bold; text-align: center;vertical-align:middle;" width="70px">Rate</th>
							
							<th  style="font-weight:bold; text-align: center;vertical-align:middle;" width="70px">Subtotal</th>

							<th  style="font-weight:bold; text-align: center;vertical-align:middle;" width="70px"></th>
							
						</tr>	
						
					</thead>				
				<tbody class="ui-selectable" id="table-data-sica">`;





				$.ajax({
					url: '/4DACTION/_light_getValoresSicaServicio',
					data: {
						id_servicio,
						id_nv: idnv,
						llave_nv: llave_nv,
						llave_nv_temp: temp_llave_nv,
						type: type_sica
					},
					dataType: 'json',
					async: false,
					cache: false,
					success: function (data) {
						let total = 0;
						let subtotal = 0;
						if (data.records.total > 0) {

							data.rows.forEach(val => {


								htmlObject += `<tr title="" height="20px" class="line-detail-calculate" data-id="${val.id}">
											<td style="color:#000000!important;margin: 10px;text-align: center;vertical-align:middle;">${val.nombre_valor}</td>
											<td style="color:#000000 !important;margin-right: 10px;text-align: center;vertical-align:middle;"><input type="text" class="text-center cantidad" value="${unaBase.utilities.transformNumber(val.cantidad, "int")}"></td>
											<td style="color:#000000 !important;margin-right: 10px;text-align: center;vertical-align:middle;"><input type="text" class="text-center cantidad" value="${val.dias}"></td>
											<td style="color:#000000 !important;margin-right: 10px;text-align: center;vertical-align:middle;" class="rate">${unaBase.utilities.transformNumber(val.rate, "int")}</td>
											<td style="color:#000000 !important;margin-right: 10px;text-align: center;vertical-align:middle;" class="subtotal">${unaBase.utilities.transformNumber(val.subtotal.replaceAll(',', '.'), "int")}</td>
											<td style="color:#000000 !important;margin-right: 10px;text-align: center;vertical-align:middle;"></i></td>
										</tr>`;

								total += parseFloat(val.rate);
								subtotal += parseFloat(val.subtotal)

							})




							htmlObject += `</tbody>
										<tfoot>
											<td style="color:#000000!important;margin: 10px;text-align: center;vertical-align:middle;"></td>
											<td style="color:#000000 !important;margin-right: 10px;text-align: center;vertical-align:middle;"></td>
											<td style="color:#000000 !important;margin-right: 10px;text-align: center;vertical-align:middle;"></td>
											<td style="color:#000000 !important;margin-right: 10px;text-align: center;vertical-align:middle;"></td>
											<td style="color:#000000 !important;margin-right: 10px;text-align: center;vertical-align:middle;  font-weight: bold; font-size: 15px;" class="lines-details-subtotal">${unaBase.utilities.transformNumber(subtotal, "int")}</td>
											<td style="color:#000000 !important;margin-right: 10px;text-align: center;vertical-align:middle;" class="apply">  
												<button type="button" class="btn btn-success apply" style="font-size: 0.8em">
													ASIGNAR
												</button>
												
												
											</td>
										</tfoot>
									</table>
								</div>`;


							htmlObject = $(htmlObject);

							const getValoresSica = (idversion, table) => {
								$.ajax({
									url: '/4DACTION/_light_getValoresSicaServicio',
									data: {
										id_servicio,
										id_nv: idnv,
										llave_nv: llave_nv,
										llave_nv_temp: temp_llave_nv,
										id_version: idversion,
										type: type_sica
									},
									dataType: 'json',
									async: false,
									cache: false,
									success: function (data) {
										if (data.records.total > 0) {
											let row = ''
											table[0].innerHTML = ''

											data.rows.forEach(val => {
												row += `<tr title="" height="20px" class="line-detail-calculate" data-id="${val.id}">
													<td style="color:#000000!important;margin: 10px;text-align: center;vertical-align:middle;">${val.nombre_valor}</td>
													<td style="color:#000000 !important;margin-right: 10px;text-align: center;vertical-align:middle;"><input type="text" class="text-center cantidad" value="${unaBase.utilities.transformNumber(val.cantidad, "int")}"></td>
													<td style="color:#000000 !important;margin-right: 10px;text-align: center;vertical-align:middle;"><input type="text" class="text-center cantidad" value="${val.dias}"></td>
													<td style="color:#000000 !important;margin-right: 10px;text-align: center;vertical-align:middle;" class="rate">${unaBase.utilities.transformNumber(val.rate, "int")}</td>
													<td style="color:#000000 !important;margin-right: 10px;text-align: center;vertical-align:middle;" class="subtotal">${unaBase.utilities.transformNumber(val.subtotal.replaceAll(',', '.'), "int")}</td>
													<td style="color:#000000 !important;margin-right: 10px;text-align: center;vertical-align:middle;"></i></td>
												</tr>`
											})

											table[0].innerHTML = row

											const changeInput = (event) => {
												let cantidad = event.target.parentNode.parentNode.children[1].firstElementChild.value
												let dias = event.target.parentNode.parentNode.children[2].firstElementChild.value
												let id_sica = event.target.parentNode.parentNode.dataset.id

												let subtotal = unaBase.utilities.transformNumber(unaBase.utilities.transformNumber(event.target.parentNode.parentNode.children[1].firstElementChild.value) * parseFloat(event.target.parentNode.parentNode.children[2].firstElementChild.value.replaceAll(',', '.')) * parseFloat(event.target.parentNode.parentNode.children[3].textContent.replaceAll('.', '')), "int");

												event.target.parentNode.parentNode.children[4].textContent = subtotal
												let c = 0;
												$('tr.line-detail-calculate td.subtotal').each(function (i, e) {
													c += unaBase.utilities.transformNumber(e.textContent)
												});
												$('td.lines-details-subtotal')[0].textContent = unaBase.utilities.transformNumber(c, "int");

												//saveNvSica(idnv, llave_nv, temp_llave_nv, cantidad, dias, id_sica, subtotal, type_sica)
											}

											table[0].querySelectorAll('td > input.cantidad').forEach(e => {
												e.addEventListener('change', (e) => changeInput(e))
											})

											let total = 0
											table[0].querySelectorAll('td.subtotal').forEach(e => {
												total += parseFloat(e.textContent.replaceAll('.', ''))
											})



											document.querySelector('.lines-details-subtotal').textContent = unaBase.utilities.transformNumber(total, "int")



										}
									}
								})
							}

							htmlObject.find('select#select_version').on("change", function (event) {
								let sel = event.target
								let id = sel.options[sel.selectedIndex].dataset.id
								let table = htmlObject.find('#table-data-sica')
								getValoresSica(id, table)

							})

							htmlObject.find('button.apply').on("click", function (event) {
								let subtotal = event.target.parentNode.parentNode.children[4].textContent
								//element[0].parentNode.parentNode.children[8].children[1].children[0].value = subtotal
								let type = element[0].classList[2]

								let input = ''
								if (type == 'presupuesto') {
									input = 'input[name="item[][precio_unitario]"]'
									element[0].parentNode.parentNode.querySelector(input).value = subtotal
								}

								if (type == 'previo') {
									input = 'input[name="item[][costo_unitario_previo]"]'
									element[0].parentNode.parentNode.querySelector(input).value = subtotal
									//updateSubtotalItems()
								}

								if (type == 'actual') {
									input = 'input[name="item[][costo_unitario]"]'
									element[0].parentNode.parentNode.querySelector(input).value = subtotal
								}
								let c_target = $(element[0].parentNode.parentNode.querySelector(input))

								c_target.data("old-value", subtotal)
								c_target.data("value", subtotal)
								c_target[0].dispatchEvent(new Event('blur'));
								let trs = event.target.parentNode.parentNode.parentNode.parentNode.querySelectorAll('tbody tr')
								let values = [];


								for (let i = 0; i < trs.length; i++) {
									let tds = trs[i].querySelectorAll('td'); // obtenemos todas las celdas de la fila
									if (tds.length > 2) { // aseguramos que haya al menos 3 celdas
										values.push({ idnv, llave_nv, temp_llave_nv, cantidad: tds[1].querySelector('input').value, dias: tds[2].querySelector('input').value, id_sica: trs[i].dataset.id, subtotal: tds[4].innerText, type_sica }); // tomamos el valor de la tercera columna
									}
								}

								if (values.length > 0) {
									values.forEach(v => {
										if (v.subtotal > 0) {

											saveNvSica(v.idnv, v.llave_nv, v.temp_llave_nv, v.cantidad, v.dias, v.id_sica, v.subtotal, v.type_sica)
										}
									})
								}


								toastr.success(
									"Valor asignado correctamente!"
								);


							});

							htmlObject.find('td > input.cantidad').on("change", function (event) {
								let cantidad = event.target.parentNode.parentNode.children[1].firstElementChild.value
								let dias = event.target.parentNode.parentNode.children[2].firstElementChild.value
								let id_sica = event.target.parentNode.parentNode.dataset.id

								let subtotal = unaBase.utilities.transformNumber(unaBase.utilities.transformNumber(event.target.parentNode.parentNode.children[1].firstElementChild.value) * parseFloat(event.target.parentNode.parentNode.children[2].firstElementChild.value.replaceAll(',', '.')) * parseFloat(event.target.parentNode.parentNode.children[3].textContent.replaceAll('.', '')), "int");

								event.target.parentNode.parentNode.children[4].textContent = subtotal
								let c = 0;
								$('tr.line-detail-calculate td.subtotal').each(function (i, e) {
									c += unaBase.utilities.transformNumber(e.textContent)
								});
								$('td.lines-details-subtotal')[0].textContent = unaBase.utilities.transformNumber(c, "int");

								//saveNvSica(idnv, llave_nv, temp_llave_nv, cantidad, dias, id_sica, subtotal, type_sica)


							});

						}



					}
				});

				return htmlObject;


			},
			interactive: true,
			autoClose: true,
			delay: 2000,
			contentAsHTML: true,
			onlyOne: true,
			position: 'left',
			interactiveTolerance: 1000,
			theme: 'tooltipster-punk',
			functionReady: function () {

			},
			functionAfter: function () {


			}
		});


		element.tooltipster('show');


		//$(this).load('/v3/views/negocios/compras_items.shtml?id=73937&detail=true')
	});


	$('section.sheet').on('hover', 'button.detail.exchange-rate', function (event) {
		var element = $(this);
		$(this).tooltipster({
			content: function () {
				let idnv = $('section.sheet').data('id')
				let htmlObject = '<ul>'
				$.ajax({
					url: '/4DACTION/_force_getTipoCambioByNv',
					dataType: 'json',
					data: {
						id_nv: idnv
					},
					async: false,
					cache: false,
					success: function (data) {
						var row = element.parentTo('tr');
						var total = parseFloat(row.find('input[name="item[][subtotal_precio]"]').val());
						let curr = document.querySelector('#simbol_code').dataset.simbol
						// Buscar el índice del objeto que tenga el mismo valor de curr
						const index = data.row.findIndex((obj) => obj.codigo === curr);
						let newArray = data.row.filter(obj => obj.codigo === curr);
						htmlObject += `<li data-name="valor-clp">																																							
								<strong style="font-weight: bold; display: inline-block; width: 240px;font-family: 'Calibri'">Precio en ${newArray[0].nombre}</strong>																		
								<span class="numeric currency">${curr} <span style="display: inline-block; width: 140px; text-align: right; font-family: 'Calibri'">${unaBase.utilities.transformNumber(total, 'int')}</span></span>		
							</li>`
						let res_conv = total * parseFloat(newArray[0].value.replace(',', '.'))
						data.row.splice(index, 1)
						data.row.forEach(v => {
							let value = parseFloat(v.value.replace(',', '.'))
							let res = v.codigo === currency.code ? total * value : res_conv / value
							if (v.codigo === currency.code) {
								htmlObject += `<li>																																	
							<strong style="font-weight: bold; display: inline-block; width: 240px; font-family: 'Calibri'">Precio en ${v.nombre} (${v.value})</strong>																
							<span class="numeric currency">${v.codigo}<span style="display: inline-block; width: 140px; text-align: right; font-family: 'Calibri'">${unaBase.utilities.transformNumber(Math.round(res_conv), 'int')}</span></span>									
						</li>`
							} else {
								htmlObject += `<li>																																	
								<strong style="font-weight: bold; display: inline-block; width: 240px; font-family: 'Calibri'">Precio en ${v.nombre} (${v.value})</strong>																
								<span class="numeric currency">${v.codigo}<span style="display: inline-block; width: 140px; text-align: right; font-family: 'Calibri'">${unaBase.utilities.transformNumber(Math.round(res), 'int')}</span></span>									
							</li>`

							}
						})



						htmlObject += `</ul>`
						htmlObject = $(htmlObject);




					},
					error: function (err) {
					}
				});

				return htmlObject;
			},
			interactive: true,
			autoClose: true,
			delay: 2000,
			contentAsHTML: true,
			onlyOne: true,
			position: 'left',
			interactiveTolerance: 1000,
			theme: 'tooltipster-punk'
		});
		$(this).tooltipster('show');
	});



	//REAPER PAGINADOR DEL GASTOS REAL TOOLTIP
	$.fn.pageMe = function (opts) {
		var $this = this,
			defaults = {
				perPage: 7,
				showPrevNext: false,
				hidePageNumbers: false
			},
			settings = $.extend(defaults, opts);

		var listElement = $this;
		var perPage = settings.perPage;
		var children = listElement.children();
		var pager = $('.pager');

		if (typeof settings.childSelector != "undefined") {
			children = listElement.find(settings.childSelector);
		}

		if (typeof settings.pagerSelector != "undefined") {
			pager = $(settings.pagerSelector);
		}

		var numItems = children.size();
		var numPages = Math.ceil(numItems / perPage);

		pager.data("curr", 0);

		if (settings.showPrevNext) {
			$('<li style="display:inline-block;margin-right:10px;"><a href="#" class="prev_link">«</a></li>').appendTo(pager);
		}

		var curr = 0;
		while (numPages > curr && (settings.hidePageNumbers == false)) {
			$('<li style="display:inline-block;margin-right:10px;"><a href="#" class="page_link">' + (curr + 1) + '</a></li>').appendTo(pager);
			curr++;
		}

		if (settings.showPrevNext) {
			$('<li style="display:inline-block; margin-right:10px;"><a href="#" class="next_link">»</a></li>').appendTo(pager);
		}

		pager.find('.page_link:first').addClass('active');
		pager.find('.prev_link').hide();
		if (numPages <= 1) {
			pager.find('.next_link').hide();
		}
		pager.children().eq(1).addClass("active");

		children.hide();
		children.slice(0, perPage).show();

		pager.find('li .page_link').click(function () {
			var clickedPage = $(this).html().valueOf() - 1;
			goTo(clickedPage, perPage);
			return false;
		});
		pager.find('li .prev_link').click(function () {
			previous();
			return false;
		});
		pager.find('li .next_link').click(function () {
			next();
			return false;
		});

		function previous() {
			var goToPage = parseInt(pager.data("curr")) - 1;
			goTo(goToPage);
		}

		function next() {
			goToPage = parseInt(pager.data("curr")) + 1;
			goTo(goToPage);
		}

		function goTo(page) {
			var startAt = page * perPage,
				endOn = startAt + perPage;

			children.css('display', 'none').slice(startAt, endOn).show();

			if (page >= 1) {
				pager.find('.prev_link').show();
			}
			else {
				pager.find('.prev_link').hide();
			}

			if (page < (numPages - 1)) {
				pager.find('.next_link').show();
			}
			else {
				pager.find('.next_link').hide();
			}

			pager.data("curr", page);
			pager.children().removeClass("active");
			pager.children().eq(page + 1).addClass("active");

		}
	};

	$('section.sheet').on('hover', 'td.costo.real.adquisicion', function (event) {



		var element = $(this);
		let llave = $(this).parent().attr("data-id")
		$.ajax({
			url: '/4DACTION/_V3_getOrdenesByNegocioItems',
			dataType: 'json',
			async: false, // para que no avance hasta que la llamada se complete
			cache: false,
			data: {
				llave,
				'fxr': false,
				'notNull': true
			},
			success: function (data) {


				data.rows = data.rows.filter(row => {
					const totalItemGastoNumber = parseFloat(row.total_item_gasto.replace(/[^0-9.-]+/g, ""));
					return totalItemGastoNumber > 0;
				});

				if (data.rows.length > 0) {
					let totalGasto = 0
					data.rows.forEach(row => {
						const totalItemGastoNumber = parseFloat(row.costoempresa_);
						if (totalItemGastoNumber > 0) {
							totalGasto += parseFloat(totalItemGastoNumber);
						}
					});

					const formatNumber = (nStr) => {
						nStr = Math.floor(nStr).toString();
						const rgx = /(\d+)(\d{3})/;
						while (rgx.test(nStr)) {
							nStr = nStr.replace(rgx, "$1" + "." + "$2");
						}
						return nStr;
					};



					element.tooltipster({
						content: function () {

							let htmlObject = `<div style=" padding: 10px;background-color:white;font-size: 10px;${data.rows.length > 10 ? 'min-height: 250px' : ''};">
							<div style="display: flex; justify-content: space-between; align-items: center;">
							<div></div> <!-- Contenedor vacío para mantener el espacio a la izquierda -->
							<span style="color:black;font-weight:bold;padding-bottom:2px;"> TOTAL GASTO REAL: $ ${formatNumber(String(totalGasto))} </span>
						</div>
									<table class="expenses-list-info">
													<thead style="background-color:#6b6b6b;">
														<tr  height="30px">		
															<th style="font-weight:bold; text-align: center;vertical-align:middle;margin-left:10px" width="20px" >#</th>			
															<th style="font-weight:bold; text-align: center;vertical-align:middle;" width="70px"  >Número</th>
															
															<th  style="font-weight:bold; text-align: center;vertical-align:middle;" width="40px"  >Tipo</th>	

															<th  style="font-weight:bold; text-align: center;vertical-align:middle;" width="30px"  >Doc</th>	

															<th  style="font-weight:bold; text-align: center;vertical-align:middle;" width="100px"  >Estado</th>	
																		
															<th style="font-weight:bold; text-align: center;vertical-align:middle;" width="70px" >Fecha</th>
															
															<th  style="font-weight:bold; text-align: center;vertical-align:middle;" width="200px">Proveedor</th>
															
															<th  style="font-weight:bold; text-align: center;vertical-align:middle;" width="80px">Total GR</th>

															<th  style="font-weight:bold; text-align: center;vertical-align:middle;" width="80px">Justificado</th>
														</tr>	
														
													</thead>				
													<tbody class="ui-selectable" id="tb-info-expenses">`;


							$.each(data.rows, function (key, item) {


								htmlObject += `

					 					 <tr title="" data-id="${item.id}" onclick="unaBase.utilities.toUrl('#compras/content.shtml?id=${item.id}')"  height="20px">
					 					 	<td style="color:#000000 !important;font-weight:bold; text-align: center;vertical-align:middle;margin-left:10px" width="20px">${key + 1}</td>	

									        <td style="color:#000000!important;margin: 10px;text-align: center;vertical-align:middle;" width="70px"> ${item.folio}</td>
									      
									        <td style="color:#000000 !important;margin-right: 10px;text-align: center;vertical-align:middle;" width="40px" >${item.tipo}</td>

									         <td style="color:#000000 !important;margin-right: 10px;text-align: center;vertical-align:middle;" width="30px" >${item.sigla_documento}</td>
									         
									          <td style="color:#000000 !important;margin-right: 10px;text-align: center;vertical-align:middle;" width="100px"  >${item.estado}</td>

									        <td style="color:#000000 !important;margin-right: 10px;text-align: center;vertical-align:middle;" width="70px" >${item.fecha}</td>
									       
									        <td style="color:#000000 !important;margin-right: 10px;text-align: center;vertical-align:middle;" width="200px" >${item.proveedor}</td>
											<td style="color:#000000 !important;margin-right: 10px;text-align: center;vertical-align:middle;" width="80px" >${item.total_item_gasto}</td>

											<td style="color:#000000 !important;margin-right: 10px;text-align: center;vertical-align:middle;" width="80px" >${item.justificado}</td>
									    </tr>`;
							});


							htmlObject += `</tbody>
										  	<tfoot></tfoot>
										</table>

									
										</div>
										<hr>
										<div><ol class="pagination pagination-lg pager" id="myPager"></ol></div>`;


							htmlObject = $(htmlObject);


							htmlObject.find('#tb-info-expenses').pageMe({ pagerSelector: htmlObject.find('#myPager'), showPrevNext: true, hidePageNumbers: false, perPage: 10 });

							return htmlObject;

						},
						interactive: true,
						autoClose: true,
						delay: 2000,
						contentAsHTML: true,
						onlyOne: true,
						position: 'left',
						interactiveTolerance: 1000,
						positionTracker: true,
						theme: 'tooltipster-punk',
						functionReady: function () {

						},
						functionAfter: function () {


						}
					});


					element.tooltipster('show');



				}

			}
		}).fail(function (a, b, c) {

		});




		//$(this).load('/v3/views/negocios/compras_items.shtml?id=73937&detail=true')
	});




	$('section.sheet').on('click', 'td.detail.expenses-details', function (event) {

		//$('button.detail.expenses-details').each()
		var element = $(this);

		$.ajax({
			url: '/4DACTION/_V3_getOrdenesByNegocioItems',
			dataType: 'json',
			async: false, // para que no avance hasta que la llamada se complete
			cache: false,
			data: {
				llave: 'CT73952sc20Item2135880184'
			},
			success: function (data) {

				unaBase.loadInto.dialog('/v3/views/items/content.shtml?id=' + element.parentTo('tr').data('id'), 'Detalle de Ítem', 'x-large');


			}
		}).fail(function (a, b, c) {

		});




		//$(this).load('/v3/views/negocios/compras_items.shtml?id=73937&detail=true')
	});


	/*
		$('section.sheet').on('mouseout', 'div.expenses-details-tooltipster', function(event) {
			
			$(this).tooltipster('destroy');
		});
	*/
	$('section.sheet').on('mouseout', 'button.detail.exchange-rate', function (event) {
		$(this).tooltipster('destroy');
	});


	$('section.sheet').on('hover', 'button.detail.cost', function (event) {
		var element = $(this);
		$(this).tooltipster({
			content: function () {
				var htmlObject = $('\
					<ul>																																																						\
						<li data-name="costo-presupuestado-externo">																																											\
							<strong style="font-weight: bold; display: inline-block; width: 350px;">Gasto P. externo</strong>																													\
							<span class="numeric currency">' + localCurrency + ' <span style="display: inline-block; width: 100px; text-align: right;"></span></span>																								\
						</li>																																																					\
						<li data-name="costo-presupuestado-interno">																																											\
							<strong style="font-weight: bold; display: inline-block; width: 350px;">Gasto P. interno (<span class="numeric"></span> HH &times; <span class="numeric currency">$ <span></span></span>: <span></span>)</strong>	\
							<span class="numeric currency">' + localCurrency + ' <span style="display: inline-block; width: 100px; text-align: right;"></span></span>																								\
						</li>																																																					\
						<li data-name="total" style="border-top: 1px solid grey; margin-top: 10px; padding-top: 10px;">																															\
							<strong style="font-weight: bold; display: inline-block; width: 350px;">Total</strong>																																\
							<span class="numeric currency">' + localCurrency + ' <span style="display: inline-block; width: 100px; text-align: right;"></span></span>																								\
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

				if (typeof selected_currency == 'undefined')
					htmlObject.find('li[data-name="costo-presupuestado-externo"] > span > span').text(costo_presupuestado_externo.toFixed(currency.decimals));
				else
					htmlObject.find('li[data-name="costo-presupuestado-externo"] > span > span').text(costo_presupuestado_externo.toFixed(2));

				htmlObject.find('li[data-name="costo-presupuestado-interno"] > strong span:nth-of-type(1)').text(hh_cantidad.toFixed(currency.decimals));
				if (typeof selected_currency == 'undefined')
					htmlObject.find('li[data-name="costo-presupuestado-interno"] > strong span:nth-of-type(2) > span').text(hh_valor.toFixed(currency.decimals));
				else
					htmlObject.find('li[data-name="costo-presupuestado-interno"] > strong span:nth-of-type(2) > span').text(hh_valor.toFixed(2));
				htmlObject.find('li[data-name="costo-presupuestado-interno"] > strong span:nth-of-type(3)').text(hh_username);
				if (typeof selected_currency == 'undefined')
					htmlObject.find('li[data-name="costo-presupuestado-interno"] > span > span').text(costo_presupuestado_interno.toFixed(currency.decimals));
				else
					htmlObject.find('li[data-name="costo-presupuestado-interno"] > span > span').text(costo_presupuestado_interno.toFixed(2));

				if (typeof selected_currency == 'undefined')
					htmlObject.find('li[data-name="total"] > span > span').text(total.toFixed(currency.decimals));
				else
					htmlObject.find('li[data-name="total"] > span > span').text(total.toFixed(2));

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

	$('section.sheet').on('mouseout', 'button.detail.cost', function (event) {
		$(this).tooltipster('destroy');
	});

	$('section.sheet table.items > tfoot > tr > th.info').bind('refresh', function () {
		var items = $('section.sheet table.items > tbody > tr:not(.title)').length;
		$('section.sheet table.items > tfoot > tr > th.info').html(items + ' ítem' + ((items > 1) ? 's' : ''));
	});

	$('section.sheet table.items').on('change', '> tbody > tr:not(.title) > td input[name="item[][costo_interno]"]', function (event) {
		$(this).parentTo('tr').find('> td input[name="item[][subtotal_costo]"]').trigger('refresh');
	});

	$('section.sheet table.items').on('refresh', '> tbody > tr:not(.title) > td input[name="item[][subtotal_costo]"]', function (event) {
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


		// if ($(event.target).closest('tr').data('first-load') !== true)
		updateRow(event);

	});

	// Cálculo de costo interno + externo real

	$('section.sheet table.items > tbody').on('refresh', '> tr:not(.title) > td input[name="item[][subtotal_costo_real]"]', function (event) {
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

	$('section.sheet table > tbody').on('change', 'input[name="item[][costo_interno]"]', function (event) {
		saveRow(event);
	});

	$('section.sheet table.items > thead > tr:last-of-type > th > input[name="item[][costo_interno]"]').change(function () {
		if ($(this).prop('checked')) {
			$('section.sheet table.items > tbody > tr:not(.title)').each(function () {
				$(this).find('input[name="item[][costo_interno]"]:not(:checked)').prop('checked', true).trigger('change');
			});
		} else {
			$('section.sheet table.items > tbody > tr:not(.title)').each(function () {
				$(this).find('input[name="item[][costo_interno]"]:checked').prop('checked', false).trigger('change');
			});
		}
	});

	$('section.sheet table.items > thead > tr:last-of-type > th > input[name="item[][ocultar_print]"]').change(function () {
		if ($(this).prop('checked')) {
			$('section.sheet table.items > tbody > tr').each(function () {
				const subTotal = $(this).find('input[name="item[][subtotal_precio]"]')
				if (subTotal && subTotal.val() > 0) {
					$(this).find('input[name="item[][ocultar_print]"]:checked').prop('checked', false);
				} else {
					$(this).find('input[name="item[][ocultar_print]"]:not(:checked)').prop('checked', true);
					$(this).find('input[name="item[][precio_unitario]"]').prop('readonly', true);
					$(this).find('input[name="item[][cantidad]"]').prop('readonly', true);
					$(this).find('input[name="item[][factor]"]').prop('readonly', true);
				}
			});
		} else {
			$('section.sheet table.items > tbody > tr').each(function () {
				$(this).find('input[name="item[][ocultar_print]"]:checked').prop('checked', false);
				$(this).find('input[name="item[][precio_unitario]"]').prop('readonly', false);
				$(this).find('input[name="item[][cantidad]"]').prop('readonly', false);
				$(this).find('input[name="item[][factor]"]').prop('readonly', false);
			});
		}
	});

	$('#main-container').on('change', 'table.items.cotizacion tr.title input[name="item[][ocultar_print]"]', function (event) {
		var titulo = $(event.target).closest('tr');
		if ($(event.target).prop('checked')) {
			titulo.nextUntil("tr.title").find('input[name="item[][ocultar_print]"]:not(:checked)').prop('checked', true);
		} else {
			titulo.nextUntil("tr.title").find('input[name="item[][ocultar_print]"]:checked').prop('checked', false);
		}

	});

	$('#main-container').on('change', 'table.items.cotizacion tr:not(.title) input[name="item[][ocultar_print]"]', function (event) {
		const checkbox = $(event.target);
		const checked = checkbox.prop('checked');
		const tr = checkbox.closest('tr');
		const subTotal = parseFloat(tr.find('input[name="item[][subtotal_precio]"]').val());

		const cantidad = tr.find('input[name="item[][cantidad]"]');
		const dias = tr.find('input[name="item[][factor]"]');
		const precio_unitario = tr.find('input[name="item[][precio_unitario]"]');
		if (checked && subTotal > 0) {
			const mensaje = 'El ítem seleccionado tiene costo unitario mayor a cero. Al imprimir producirá diferencias en los totales.<br><br>Por eso no puede ocultarlo.';
			alert(mensaje);
			checkbox.prop('checked', false);
			cantidad.prop('readonly', false);
			dias.prop('readonly', false);
			precio_unitario.prop('readonly', false);
		}
		if (checked && subTotal === 0) {
			cantidad.prop('readonly', true);
			dias.prop('readonly', true);
			precio_unitario.prop('readonly', true);
		}
		if (!checked) {
			cantidad.prop('readonly', false);
			dias.prop('readonly', false);
			precio_unitario.prop('readonly', false);
		}
	});

	// Confirmar al cambiar check sobrecargo, en caso que afecte los montos
	// $('#main-container').on('change', 'table.items.cotizacion tr:not(.title) input[name="item[][aplica_sobrecargo]"]', function(event) {
	// 	
	// 	if (!$('table.items.cotizacion').data('edit-aplica-sobrecargo-remember') && $('section.sobrecargos li[data-items="true"] span.percent input').val() > 0 /* && (($(event.target).closest('tr').find('input[name="item[][precio_unitario]"]').data('old-value'))? $(event.target).closest('tr').find('input[name="item[][precio_unitario]"]').data('old-value') : $(event.target).closest('tr').find('input[name="item[][precio_unitario]"]').val()) > 0 */) {
	// 		confirm("¿Está seguro de modificar el ítem afecto a comisión?<br>-Esto podría cambiar los valores totales.<br><br><label><input type=\"checkbox\" name=\"edit_aplica_sobrecargo_remember\"> No volver a preguntar para este negocio</label>", 'Sí', 'No').done(function(data) {
	// 			if (!data) {
	// 				var isChecked = $(event.target).prop('checked');
	// 				$(event.target).prop('checked', !isChecked);
	// 				$(event.target).closest('tr').find('[name="item[][precio_unitario]"]').trigger('focus').trigger('blur');
	// 			}
	// 			if ($('[name="edit_aplica_sobrecargo_remember"]').is(':checked')) {
	// 				$('table.items.cotizacion').data('edit-aplica-sobrecargo-remember', true);
	// 			}
	// 		}).fail(function() {
	// 			var isChecked = $(event.target).prop('checked');
	// 			$(event.target).prop('checked', !isChecked);
	// 			$(event.target).closest('tr').find('[name="item[][precio_unitario]"]').trigger('focus').trigger('blur');
	// 		});
	// 	}
	// });

	$('#main-container').on('change', 'table.items.cotizacion tr:not(.title) input[name="item[][aplica_sobrecargo]"]', function (event) {

		confirm("¿Está seguro de modificar el ítem afecto a comisión?<br>-Esto podría cambiar los valores totales.<br><br><label><input type=\"checkbox\" name=\"edit_aplica_sobrecargo_remember\"> No volver a preguntar para este negocio</label>", 'Sí', 'No')
			.done(function (data) {
				if (data) {
					var isChecked = $(event.target).prop('checked');
					$(event.target).prop('checked', isChecked);
					$(event.target).closest('tr').find('[name="item[][precio_unitario]"]').trigger('focus').trigger('blur');
				}
				if ($('[name="edit_aplica_sobrecargo_remember"]').is(':checked')) {
					$('table.items.cotizacion').data('edit-aplica-sobrecargo-remember', true);
				}
			}).fail(function () {
				var isChecked = $(event.target).prop('checked');
				$(event.target).prop('checked', !isChecked);
				$(event.target).closest('tr').find('[name="item[][precio_unitario]"]').trigger('focus').trigger('blur');
			});
	});

	(function () {

		htmlObject = $('\
		<ul class="dropdown-menu" style="position: absolute;z-index: 1000; min-width: 150px;text-align: left;">\
			<li><a href="#" class="close-compras items"><span class="ui-icon ui-icon-locked"></span>Cerrar compras</a></li>				\
			<li><a href="#" class="open-compras items"><span class="ui-icon ui-icon-unlocked"></span>Reabrir compras</a></li>			\
			<li><a href="#" class="create-oc items"><span class="ui-icon ui-icon-document"></span>Crear orden de compra</a></li>		\
			<li><a href="#" class="create-fxr items"><span class="ui-icon ui-icon-document"></span>Crear fondo por rendir</a></li>		\
			</ul>																														\
		');

		if (!access._490)
			htmlObject.find('.close-compras').parentTo('li').remove();
		if (!access._491)
			htmlObject.find('.open-compras').parentTo('li').remove();

		htmlObject.appendTo('table.items  thead  th div.actionsitems').menu().hide();



	})();

	$('table.items  thead ul.dropdown-menu a.items').click(function (event) {

		var target = $(event.target);

		$('table.items thead  .dropdown-menu').toggle();

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
				if (target.hasClass('close-compras')) {
					confirm(MSG.get('CONFIRM_NEGOCIO_CLOSE_COMPRAS_ALL')).done(function (data) {
						if (data)
							$('#menu > ul > li[data-name="close_compras_negocio"] > button').triggerHandler('click');
					});
				} else {
					toastr.warning('No se ha seleccionado ningún ítem');
				}
			} else {

				var closeItemsCompras = function () {
					selected.each(function () {
						var element = this;
						$.ajax({
							url: '/4DACTION/_V3_setItemByNegocio',
							data: {
								id: $(element).data('id'),
								close_compras: true
							},
							dataType: 'json',
							success: function (data) {

								//8
								if (data.success) {
									$(element).find('[name="item[][closed_compras]"]').show();

									//toastr.info('Ítem cerrado para compras.');
									unaBase.log.save('El ítem ha sido cerrado para compras' + (($(element).find('[name="item[][codigo]"]').val() != '') ? ' [Cód.: ' + $(element).find('[name="item[][codigo]"]').val() + ']' : ''), 'negocios', $('section.sheet').data('index'), $('section.sheet').data('id'), $(element).find('[name="item[][nombre]"]').val());
								}
							}
						});
					});
					toastr.info('Ítems seleccionados cerrados para compras.');
				};

				if (target.hasClass('close-compras')) {
					if (selected.length == selectable.length)
						confirm(MSG.get('CONFIRM_NEGOCIO_CLOSE_COMPRAS_AUTO')).done(function (data) {
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
					selected.each(function () {
						var element = this;
						$.ajax({
							url: '/4DACTION/_V3_setItemByNegocio',
							data: {
								id: $(element).data('id'),
								close_compras: false
							},
							dataType: 'json',
							success: function (data) {
								if (data.success) {
									// alert();
									$(element).find('[name="item[][closed_compras]"]').hide();

									//toastr.info('Ítem abierto para compras.');
									unaBase.log.save('El ítem ha sido abierto para compras' + (($(element).find('[name="item[][codigo]"]').val() != '') ? ' [Cód.: ' + $(element).find('[name="item[][codigo]"]').val() + ']' : ''), 'negocios', $('section.sheet').data('index'), $('section.sheet').data('id'), $(element).find('[name="item[][nombre]"]').val());
									$('.closed-compras-tag').remove();
									$('[data-name="open_compras_negocio"]').hide();
									$('[data-name="close_compras_negocio"]').show();
								}
							}
						});
					});
					$('table.items tbody').find('tr input[type="checkbox"][name="item[][selected]"]').prop('checked', false);
					toastr.info('Ítems seleccionados abiertos para compras.');
				}
				if (target.hasClass('create-oc') || target.hasClass('create-fxr')) {
					unaBase.ui.block();
					var itemsGuardados = true;
					var itemsGastables = true;
					var itemsAbiertos = true;
					var items = []; // Verificación en línea de ítems
					$('table.items tbody tr:not(.title)').each(function (key, item) {
						var current = $(item);
						if (current.find('[name="item[][selected]"]').is(':checked')) {
							items.push(current.data('id'));
							// Marcar todos los títulos de los ítems que ya estén marcados
							current.prevTo('tr.title').find('[name="item[][selected]"]').prop('checked', true);
							// Verificar si el ítem está guardado
							if (!current.data('id')) {
								itemsGuardados = false;
							}
							// Verificar si el ítem es gastable
							if (!access._486) {
								if (parseFloat(current.find('[name="item[][diferencia]"]').val()) <= 0) {
									current.find('[name="item[][diferencia]"]').css('background-color', 'red').css('color', 'white');
									itemsGastables = false;
								} else {
									current.find('[name="item[][diferencia]"]').css('background-color', 'white').css('color', 'black');
								}
							}


							// Verificar si el ítem está abierto para compras
							if (current.find('[name="item[][closed_compras]"]').is(':visible')) {
								itemsAbiertos = false;
							}
						}
					});
					if (!itemsGuardados) {
						errMsg = '<br> -Hay ítems creados sin guardar.';
						toastr.warning('No es posible crear gasto de los ítems seleccionados' + errMsg);
						$('table.items tbody tr.title').find('[name="item[][selected]"]').prop('checked', false);
						unaBase.ui.unblock();
						return false;
					}
					if (!itemsGastables || !itemsAbiertos) {
						var errMsg = '';
						if (!itemsGastables) {
							errMsg += '<br> -Hay ítems sin monto por gastar (diferencias en rojo).';
						}
						if (!itemsAbiertos) {
							errMsg += '<br> -Hay ítems cerrados para compras.';
						}
						toastr.warning('No es posible crear gasto de los ítems seleccionados' + errMsg);
						$('table.items tbody tr.title').find('[name="item[][selected]"]').prop('checked', false);
						unaBase.ui.unblock();
						return false;
					}
					// begin: Verificación en línea de ítems
					var successRequest = false;
					$.ajax({
						url: '/4DACTION/_V3_checkPorGastarByItems',
						data: {
							ids: items.join('|')
						},
						async: false,
						dataType: 'json',
						success: function (data) {
							successRequest = true;
							for (var i = 0, len = data.rows.length; i < len; i++) {
								if (!data.rows[i].gastable) {
									itemsGastables = false;
									break;
								}
							}
							if (!itemsGastables) {
								errMsg = '<br> -Hay ítems sin monto por gastar.';
								toastr.warning('No es posible crear gasto de los ítems seleccionados' + errMsg);
							}
						}
					});
					if (!successRequest) {
						toastr.error(NOTIFY.get('ERROR_INTERNAL'));
					}
					if (!successRequest || (successRequest && !itemsGastables)) {
						unaBase.ui.unblock();
						return false;
					}
					// end: Verificación en línea de ítems
					var formItems = '';
					var llave_titulo = '';
					$('table.items tbody tr').each(function (key, item) {
						var current = $(item);
						var llave_actual = ('OC' + (Math.random() * 0xFFFFFFFF << 0).toString(16) + (current.hasClass('title') ? 'TITULO' : 'ITEM') + (key + 1) + (Math.round(Math.random() * 100000)));
						if (current.hasClass('title')) {
							llave_titulo = llave_actual;
						}
						if (current.find('[name="item[][selected]"]').is(':checked')) {
							var row = {
								'oc[detalle_item][llave]': llave_actual,
								'oc[detalle_item][tipo]': (current.hasClass('title') ? 'TITULO' : 'ITEM'),
								'oc[detalle_item][items]': (key + 1),
								'oc[detalle_item][idnv]': $('#main-container').data('id'),
								'oc[detalle_item][origen]': 'PROYECTO',
								'oc[detalle_item][origen][lugar]': 'INTERNO',
								'oc[detalle_item][origen][lugar][des]': 'ITEM DIRECTO',
								'oc[detalle_item][id_tipo_producto]': '04',
								'oc[detalle_item][cod_producto]': '',
								'oc[detalle_item][id_producto]': current[0].dataset.producto || "",
								'oc[detalle_item][llave_nv]': current.data('id'),
								'oc[detalle_item][id_clasif]': current.data('categoria'),
								'oc[detalle_item][des_clasif]': '',
								'oc[detalle_item][llave_titulo]': llave_titulo,
								'oc[detalle_item][observacion_item]': '',
								'oc[detalle_item][nombre]': current.find('[name="item[][nombre]"]').val(),
								'oc[detalle_item][cantidad]': (current.hasClass('title') ? 0 : 1),
								'oc[detalle_item][dias]': (current.hasClass('title') ? 0 : 1),
								'oc[detalle_item][precio]': (current.hasClass('title') ? 0 : (parseFloat(current.find('[name="item[][diferencia]"]').val()) >= 0 ? current.find('[name="item[][diferencia]"]').val() : 0)),
								'oc[detalle_item][subtotal]': (current.hasClass('title') ? 0 : (parseFloat(current.find('[name="item[][diferencia]"]').val()) >= 0 ? current.find('[name="item[][diferencia]"]').val() : 0)),
								'oc[detalle_item][dscto]': 0,
								'oc[detalle_item][total]': (current.hasClass('title') ? 0 : (parseFloat(current.find('[name="item[][diferencia]"]').val()) >= 0 ? current.find('[name="item[][diferencia]"]').val() : 0))
							};
							formItems = formItems + $.param(row) + '&';
						}
					});
					var from = (target.hasClass('create-oc')) ? 'OC' : 'FXR';
					$.ajax({
						url: '/4DACTION/_V3_setCompras',
						data: {
							create_from: from,
							'oc[from]': from
						},
						dataType: 'json',
						success: function (data) {
							var formData = formItems + $.param({
								'id': data.id,
								'oc[negocio][id]': $('#main-container').data('id'),
								'create_from': from,
								'oc[from]': from
							});
							$.ajax({
								url: '/4DACTION/_V3_setCompras',
								data: formData,
								type: 'POST',
								success: function (subdata) {
									$('table.items tbody').find('tr input[type="checkbox"][name="item[][selected]"]').prop('checked', false);
									unaBase.ui.unblock();
									window.open('#compras/content.shtml?id=' + data.id);
								}
							});
						}
					});
				}


				var targetNew = target;
				if (targetNew.hasClass('definir-sobrecargo') && selected.length > 0) {

					var options = document.createElement('option');
					if (selected.length == 1 && selected[0].dataset.feepre != '') {
						options.value = selected[0].dataset.feepre;
						options.innerHTML = selected[0].dataset.feepre;
					} else {
						options.value = "";
						options.innerHTML = "[ Ninguno ]";
					}

					var select = document.createElement('select');
					select.appendChild(options);

					for (var i = 0; i < arrSobregargosPreFinal.length; i++) {
						if (arrSobregargosPreFinal[i].sobrecargo != "Diferencia") {
							var options = document.createElement('option');
							options.value = arrSobregargosPreFinal[i].sobrecargo;
							options.innerHTML = arrSobregargosPreFinal[i].sobrecargo;
							select.appendChild(options);
						}
					}

					select.addEventListener("change", function () {
						this.dataset.response = this.value;
					});

					select.setAttribute("style", "background-color:yellow;border:1px solid gray;border-radius:5px;");

					var span = document.createElement('span');
					span.innerHTML = "Seleccionar sobrecargo: ";
					span.setAttribute("style", "font-weight:bold;");

					var section = document.createElement('section');
					section.appendChild(span);
					section.appendChild(select);

					prompt(section).done(function (data) {
						var text = section.querySelector("select").dataset.response;
						if (text != "") {
							for (var i = 0; i < selected.length; i++) {
								selected[i].dataset.feepre = text;
							}
							sobrecargos.updateSobrecargos();
						}
					});

				} else {
					toastr.info('Falta seleccionar ítems.');
				}


			}
			//}
		}
		event.preventDefault();
	});


	$('button.actions.items').click(function () {
		$('table.items thead ul.dropdown-menu').toggle();
	});

	$('button.fetch.exchange-rate').button({
		icons: {
			primary: 'ui-icon-refresh'
		},
		text: false
	}).click(function (event) {
		var selectedCurrency;
		var target = $(this).parentTo('ul');

		if ($(event.target).parent().hasClass('working-currency'))
			selectedCurrency = $('select[name="cotizacion[currency][working]"]').val();
		else {
			switch ($('input[name="cotizacion[moneda]"]').first().val()) {
				case 'UF':
					selectedCurrency = 'CLF';
					break;
				case 'DOLARES':
					selectedCurrency = 'USD';
					break;
				case currency.name:
					selectedCurrency = currency.code;
					break;
			}
		}
		/*
		$.ajax({
			url: '/4DACTION/_V3_getExchangeRate',
			data: {
				from: selectedCurrency,
				to: currency.code
			},
			dataType: 'json',
			success: function(data) {
				target.find('input[name="cotizacion[tipo_cambio]"]').val(parseFloat(data.rate).toFixed(2).replace(/\./g, ',')).trigger('change');
			}
		});
		*/
		$.ajax({
			url: 'http://apilayer.net/api/live',
			data: {
				source: selectedCurrency,
				currencies: currency.code,
				format: 1,
				access_key: 'c3a832a8192829837075ef403d7d00c4'
			},
			dataType: 'jsonp',
			success: function (data) {
				if (data.success) {
					var rate = data.quotes[selectedCurrency + currency.code];
					target.find('input[name="cotizacion[tipo_cambio]"]').val(parseFloat(rate).toFixed(2).replace(/\./g, ',')).trigger('change');
				} else {
					toastr.error('No se pudo obtener el valor del tipo de cambio del día ya que el servicio no está disponible. Por favor ingresar manualmente.');
					console.log(data.error);
				}
			}
		});
	});

	$('input[name="cotizacion[ver_solo_items_usados]"]').on('change', updateVistaItems);

	$('section.sheet').on('hover', 'button.detail.total', async function (event) {
		var element = $(this);
		$(this).tooltipster({
			content: function () {
				let idnv = $('section.sheet').data('id')
				let htmlObject = '<ul>'
				$.ajax({
					url: '/4DACTION/_force_getTipoCambioByNv',
					dataType: 'json',
					data: {
						id_nv: idnv
					},
					async: false,
					cache: false,
					success: function (data) {
						var row = element.parentTo('tr');
						var total = parseFloat($('input[name="cotizacion[ajuste]"]').val());
						let curr = document.querySelector('#simbol_code').dataset.simbol
						// Buscar el índice del objeto que tenga el mismo valor de curr
						const index = data.row.findIndex((obj) => obj.codigo === curr);
						let newArray = data.row.filter(obj => obj.codigo === curr);
						htmlObject += `<li data-name="valor-clp">																																							
								<strong style="font-weight: bold; display: inline-block; width: 240px;font-family: 'Calibri'">Precio en ${newArray[0].nombre}</strong>																		
								<span class="numeric currency">${curr} <span style="display: inline-block; width: 140px; text-align: right; font-family: 'Calibri'">${unaBase.utilities.transformNumber(total, 'int')}</span></span>		
							</li>`
						let res_conv = total * parseFloat(newArray[0].value.replace(',', '.'))
						data.row.splice(index, 1)

						data.row.forEach(v => {
							let value = parseFloat(v.value.replace(',', '.'))
							let res = v.codigo === currency.code ? total * value : res_conv / value
							if (v.codigo === currency.code) {
								htmlObject += `<li>																																	
							<strong style="font-weight: bold; display: inline-block; width: 240px; font-family: 'Calibri'">Precio en ${v.nombre} (${v.value})</strong>																
							<span class="numeric currency">${v.codigo}<span style="display: inline-block; width: 140px; text-align: right; font-family: 'Calibri'">${unaBase.utilities.transformNumber(Math.round(res_conv), 'int')}</span></span>									
						</li>`
							} else {
								htmlObject += `<li>																																	
								<strong style="font-weight: bold; display: inline-block; width: 240px; font-family: 'Calibri'">Precio en ${v.nombre} (${v.value})</strong>																
								<span class="numeric currency">${v.codigo}<span style="display: inline-block; width: 140px; text-align: right; font-family: 'Calibri'">${unaBase.utilities.transformNumber(Math.round(res), 'int')}</span></span>									
							</li>`

							}
						})
						htmlObject += `</ul>`
						htmlObject = $(htmlObject);
					},
					error: function (err) {
					}
				});


				return htmlObject;
			},
			interactive: true,
			trigger: '',
			delay: 0,
			interactiveAutoClose: true
		});
		$(this).tooltipster('show');
	});

	$('section.sheet').on('mouseout', 'button.detail.total', function (event) {
		$(this).tooltipster('destroy');
	});

	if ($('section.sheet').data('index') > 0)
		contentLoaded = true;

	// Logs tiempo real

	var logBeforeAction = function (event) {

		var currentElement = $(event.target).closest('tr');
		var isTitle = currentElement.hasClass('title');
		currentElement.uniqueId();
		var key = parseInt(currentElement.prop('id').substring(6));
		var log = $('#main-container').data('realtime-log');
		var id_categoria = 0

		if (isTitle) {
			id_categoria = key;
			var nombre_categoria = currentElement.find('[name="item[][nombre]"]').val();
		} else {
			currentElement.prevTo('tr.title').uniqueId();
			id_categoria = parseInt(currentElement.prevTo('tr.title').prop('id').substring(6));
			var nombre_categoria = currentElement.prevTo('tr.title').find('[name="item[][nombre]"]').val();
		}
		log = (typeof log == 'undefined') ? [] : log;
		if (log[key] == undefined) {
			log[key] = [];
			if (currentElement.serializeAnything() != '' && currentElement.find('[name="item[][nombre]"]').val() != '') {
				var isCloned = (event.type == 'beforeClone');
				log[key]['old'] = JSON.parse('{ "item[][tipo_documento]": "' + currentElement.find('[name="item[][tipo_documento]"]').val() + '", "observacion": "' + escape(currentElement.data('observacion')) + '", "comentario": "' + escape(currentElement.data('comentario')) + '", "item[][aplica_sobrecargo]": ' + (currentElement.find('[name="item[][aplica_sobrecargo]"]').is(':checked') ? 'true' : 'false') + ', "item[][costo_interno]": ' + (currentElement.find('[name="item[][costo_interno]"]').is(':checked') ? 'true' : 'false') + ', "item[][ocultar_print]": ' + (currentElement.find('[name="item[][ocultar_print]"]').is(':checked') ? 'true' : 'false') + ', "item[][mostrar_carta_cliente]": ' + (currentElement.find('[name="item[][mostrar_carta_cliente]"]').is(':checked') ? 'true' : 'false') + ', "dragged": ' + (event.type == 'beforeMove' ? 'true' : 'false') + ', "cloned": ' + (isCloned ? 'true' : 'false') + ', "categoria": { "id": ' + id_categoria + ', "nombre": "' + escape(nombre_categoria) + '"  }, "title": ' + (isTitle ? 'true' : 'false') + ', "' + decodeURI(currentElement.serializeAnything().replace(/&/g, "\",\"").replace(/=/g, "\":\"")) + '"}');
			}
		}
		$('#main-container').data('realtime-log', log);
	};

	var logAfterAction = function (event) {
		var currentElement = $(event.target).closest('tr');
		var isTitle = currentElement.hasClass('title');
		currentElement.uniqueId();
		var id_categoria = 0
		var key = parseInt(currentElement.prop('id').substring(6));
		var log = $('#main-container').data('realtime-log');
		if (isTitle) {
			id_categoria = key;
			var nombre_categoria = currentElement.find('[name="item[][nombre]"]').val();
		} else {
			currentElement.prevTo('tr.title').uniqueId();
			id_categoria = parseInt(currentElement.prevTo('tr.title').prop('id').substring(6));
			var nombre_categoria = currentElement.prevTo('tr.title').find('[name="item[][nombre]"]').val();
		}
		log = (typeof log == 'undefined') ? [] : log;
		if (log[key] == undefined) {
			log[key] = [];
		}
		if ($(event.target).closest('tr').serializeAnything() != '') {
			var isCloned = (event.type != 'afterClone' && log[key] && log[key]['new'] && log[key]['new']['cloned'] ? log[key]['new']['cloned'] : event.type == 'afterClone');
			log[key]['new'] = JSON.parse('{ "item[][tipo_documento]": "' + currentElement.find('[name="item[][tipo_documento]"]').val() + '","observacion": "' + escape(currentElement.data('observacion')) + '", "comentario": "' + escape(currentElement.data('comentario')) + '", "item[][aplica_sobrecargo]": ' + (currentElement.find('[name="item[][aplica_sobrecargo]"]').is(':checked') ? 'true' : 'false') + ', "item[][costo_interno]": ' + (currentElement.find('[name="item[][costo_interno]"]').is(':checked') ? 'true' : 'false') + ', "item[][ocultar_print]": ' + (currentElement.find('[name="item[][ocultar_print]"]').is(':checked') ? 'true' : 'false') + ', "item[][mostrar_carta_cliente]": ' + (currentElement.find('[name="item[][mostrar_carta_cliente]"]').is(':checked') ? 'true' : 'false') + ', "dropped": ' + (event.type == 'afterMove' ? 'true' : 'false') + ', "cloned": ' + (isCloned ? 'true' : 'false') + ', "categoria": { "id": ' + id_categoria + ', "nombre": "' + escape(nombre_categoria) + '"  }, "title": ' + (isTitle ? 'true' : 'false') + ', "' + decodeURI(currentElement.serializeAnything().replace(/&/g, "\",\"").replace(/=/g, "\":\"")) + '"}');
		}
		$('#main-container').data('realtime-log', log);
	};

	$('table.items.cotizacion').on('focus', 'tbody th input, tbody td input', logBeforeAction);
	$('table.items.cotizacion').on('beforeMove beforeRemove beforeClone beforeUpdate', 'tbody tr', logBeforeAction);

	$('table.items.cotizacion').on('blur', 'tbody th input, tbody td input', logAfterAction);
	$('table.items.cotizacion').on('afterMove afterRemove afterUpdate afterClone', 'tbody tr', logAfterAction);

	// edición empresa y contacto desde negocio
	if (
		$('input[name="cotizacion[empresa][id]"]').val() == '' &&
		$('input[name="cotizacion[empresa][razon_social]"]').val() == ''
	)
		$('button.empresa').hide();

	if (
		$('input[name="cotizacion[empresa][contacto][id]"]').val() == ''
	)
		$('button.contacto').hide();

	if (
		$('input[name="cotizacion[empresa2][id]"]').val() == '' &&
		$('input[name="cotizacion[empresa2][razon_social]"]').val() == ''
	)
		$('button.empresa2').hide();

	if (
		$('input[name="cotizacion[empresa2][contacto][id]"]').val() == ''
	)
		$('button.contacto2').hide();

	var maskRut = function (selector) {
		selector.on('change blur focus', function () {
			$(this).val(
				unaBase.data.rut.format(
					$(this).val()
				)
			);
		});

	};

	var unmaskRut = function (selector) {
		selector.unbind('change blur focus');
	};


	$('button.edit').hide();

	$('input[name="cotizacion[empresa][rut][validate]"]').change(function (event) {
		var checked = $(this).prop('checked');
		if (checked)
			maskRut($('input[name="cotizacion[empresa][rut]"]'));
		else
			unmaskRut($('input[name="cotizacion[empresa][rut]"]'));
		$('input[name="cotizacion[empresa][rut]"]').change();
	});

	$('input[name="cotizacion[empresa2][rut][validate]"]').change(function (event) {
		var checked = $(this).prop('checked');
		if (checked)
			maskRut($('input[name="cotizacion[empresa2][rut]"]'));
		else
			unmaskRut($('input[name="cotizacion[empresa2][rut]"]'));
		$('input[name="cotizacion[empresa2][rut]"]').change();
	});

	$('button.unlock.empresa').button({
		icon: {
			primary: 'ui-icon-unlocked'
		},
		text: false
	}).click(function () {
		var target = $(this).parentTo('ul');

		target.find('input[type="search"][name^="cotizacion[empresa]"]').each(function (key, item) {
			try {
				$(item).autocomplete('disable');
			} catch (e) { }
		});

		target.find('input').not('[type="search"][name^="cotizacion[empresa]"]').not('[type="checkbox"]').removeAttr('readonly');
		target.find('input[type="search"][name^="cotizacion[empresa]"]').removeAttr('placeholder').attr('type', 'text');

		maskRut(target.find('input[name="cotizacion[empresa][rut]"]'));

		target.find('input[name="cotizacion[empresa][rut]"]').parentTo('span').addClass('main');
		target.find('input[name="cotizacion[empresa][rut][validate]"]').parentTo('span').addClass('secondary').removeClass('hidden');

		target.find('button.empresa').hide();
		target.find('button.edit.empresa').show();
		target.find('input[name="cotizacion[empresa][id]"]').focus();
	});

	$('button.unlock.empresa2').button({
		icon: {
			primary: 'ui-icon-unlocked'
		},
		text: false
	}).click(function () {
		var target = $(this).parentTo('ul');

		target.find('input[type="search"][name^="cotizacion[empresa2]"]').each(function (key, item) {
			try {
				$(item).autocomplete('disable');
			} catch (e) { }
		});

		target.find('input').not('[type="search"][name^="cotizacion[empresa2]"]').not('[type="checkbox"]').removeAttr('readonly');
		target.find('input[type="search"][name^="cotizacion[empresa2]"]').removeAttr('placeholder').attr('type', 'text');

		maskRut(target.find('input[name="cotizacion[empresa2][rut]"]'));

		target.find('input[name="cotizacion[empresa2][rut]"]').parentTo('span').addClass('main');
		target.find('input[name="cotizacion[empresa2][rut][validate]"]').parentTo('span').addClass('secondary').removeClass('hidden');

		target.find('button.empresa2').hide();
		target.find('button.edit.empresa2').show();
		target.find('input[name="cotizacion[empresa2][id]"]').focus();
	});

	$('ul button.show').button({
		icons: {
			primary: 'ui-icon-carat-1-s'
		},
		text: false
	});

	$('ul button.profile').button({
		icons: {
			primary: 'ui-icon-gear'
		},
		text: false
	});

	$('ul button.unlock').button({
		icons: {
			primary: 'ui-icon-unlocked'
		},
		text: false
	});

	$('ul button.edit.save').button({
		icons: {
			primary: 'ui-icon-disk'
		},
		text: false
	});

	$('ul button.edit.discard').button({
		icons: {
			primary: 'ui-icon-close'
		},
		text: false
	});

	$('button.profile.empresa').click(function () {
		unaBase.loadInto.dialog('/v3/views/contactos/content.shtml?id=?id=' + $('input[name="cotizacion[empresa][id]"]').data('id'), 'Perfil de Empresa', 'large');
	});

	$('button.profile.empresa2').click(function () {
		unaBase.loadInto.dialog('/v3/views/contactos/content.shtml?id=?id=' + $('input[name="cotizacion[empresa2][id]"]').data('id'), 'Perfil de Empresa', 'large');
	});

	$('button.show.contacto').click(function () {


		var target = $(this).parentTo('ul');
		target.find('input[name="cotizacion[empresa][contacto][id]"][type="search"]').autocomplete('search', '@').focus();
	});

	$('button.show.contacto2').click(function () {

		var target = $(this).parentTo('ul');
		target.find('input[name="cotizacion[empresa2][contacto][id]"][type="search"]').autocomplete('search', '@').focus();


	});

	$('button.show.forma-pago').click(function () {



		var target = $(this).parentTo('ul');
		target.find('input[type="search"][name="cotizacion[condiciones][forma_pago]"]').autocomplete('search', '@').focus();


	});

	$('button.show.forma-pago2').click(function () {



		var target = $(this).parentTo('ul');
		target.find('input[name="cotizacion[condiciones2][forma_pago]"][type="search"]').autocomplete('search', '@').focus();



	});

	$('button.unlock.contacto').click(function () {
		var target = $(this).parentTo('ul');

		target.find('input[name^="cotizacion[empresa][contacto]"][type="search"]').each(function (key, item) {
			// Intentamos deshabilitar el autocomplete, si el campo lo permite
			try {
				$(item).autocomplete('disable');
			} catch (e) {
				// Si no se puede deshabilitar, se deja pasar la excepción
			}
		});

		target.find('input[name^="cotizacion[empresa][contacto]"]').not('[type="search"]').removeAttr('readonly');
		target.find('input[name^="cotizacion[empresa][contacto]"][type="search"]').removeAttr('placeholder').attr('type', 'text');

		target.find('button.show.contacto, button.unlock.contacto, button.profile.contacto').hide();
		target.find('button.edit.contacto').show();
		target.find('input[name="cotizacion[empresa][contacto][id]"]').focus();
	});

	$('button.unlock.contacto2').click(function () {
		var target = $(this).parentTo('ul');

		target.find('input[name^="cotizacion[empresa2][contacto]"][type="search"]').each(function (key, item) {
			// Intentamos deshabilitar el autocomplete, si el campo lo permite
			try {
				$(item).autocomplete('disable');
			} catch (e) {
				// Si no se puede deshabilitar, se deja pasar la excepción
			}
		});

		target.find('input[name^="cotizacion[empresa2][contacto]"]').not('[type="search"]').removeAttr('readonly');
		target.find('input[name^="cotizacion[empresa2][contacto]"][type="search"]').removeAttr('placeholder').attr('type', 'text');

		target.find('button.show.contacto2, button.unlock.contacto2, button.profile.contacto2').hide();
		target.find('button.edit.contacto2').show();
		target.find('input[name="cotizacion[empresa2][contacto][id]"]').focus();
	});

	$('button.profile.contacto').click(function () {
		unaBase.loadInto.dialog('/v3/views/contactos/content.shtml?id=' + $('input[name="cotizacion[empresa][contacto][id]"]').data('id'), 'Perfil de Contacto', 'large');
	});

	$('button.profile.contacto2').click(function () {
		unaBase.loadInto.dialog('/v3/views/contactos/content.shtml?id=' + $('input[name="cotizacion[empresa2][contacto][id]"]').data('id'), 'Perfil de Contacto', 'large');
	});

	$('button.edit.save.empresa').click(function (event) {
		var element = this;
		var fields = {};
		var validate = true;
		$('input[name^="cotizacion[empresa]"').not('[type="checkbox"]').not('input[name^="cotizacion[empresa][contacto]"]').removeClass('invalid');
		$('input[name^="cotizacion[empresa]"').not('input[name^="cotizacion[empresa][contacto]"]').each(function () {
			var tuple = {};

			var name = $(this).attr('name');
			if (name == 'cotizacion[empresa][rut][validate]')
				var value = $(this).prop('checked');
			else
				var value = $(this).val();
			var localValidate = true;
			if (value == '' && $('[name="cotizacion[empresa][rut][validate]"]').prop('checked'))
				localValidate = false;
			if (name == 'cotizacion[empresa][rut]') {
				if ($('input[name="cotizacion[empresa][rut][validate]"]').prop('checked') && !unaBase.data.rut.validate(value))
					localValidate = false;
			}

			if (!localValidate)
				$(this).invalid();

			if ($(this).data('id')) {
				// TODO: Buscar una alternativa al eval que funcione
				eval('var tuple = { "id": "' + $(this).data('id') + '" };');
				/*tuple = {
					id: $(this).data('id')
				};*/
				$.extend(fields, fields, tuple);
			}

			// TODO: Buscar una alternativa al eval que funcione
			eval('var tuple = { "' + name + '": "' + value + '" };');
			/*tuple = {
				name: value
			};*/
			$.extend(fields, fields, tuple);

			validate = validate && localValidate;
		});


		if (validate) {
			fields.nvType = unaBase.doc.type;
			fields.nvId = unaBase.doc.number;
			$.ajax({
				url: '/4DACTION/_V3_setEmpresa',
				dataType: 'json',
				data: fields,
				async: false,
				success: function (data) {
					if (data.success) {
						/*if (data.new)
							toastr.info('Empresa creada!');
						else
							toastr.info('Empresa modificada!');*/
						$('input[name="cotizacion[empresa][id]"]').data('id', data.id);

						$('h2 [name="cotizacion[empresa][id]"]').text(fields['cotizacion[empresa][id]']);
						$('h2 [name="cotizacion[empresa][razon_social]"]').text(fields['cotizacion[empresa][razon_social]']);

						afterEditEmpresa(element);
					} else {
						if (data.opened) {
							if (data.readonly)
								toastr.error('No fue posible guardar los datos de la empresa. Otro usuario está bloqueando el registro.');
						} else {
							if (!data.unique)
								toastr.error('La empresa que intenta ingresar ya se almacenó previamente en la base de datos.');
							else
								toastr.error('El id de la empresa no existe (error desconocido).');
						}
						// FIXME: colocar garbage collector (delete element) para ver si funciona
					}
				},
				error: function (xhr, text, error) {
					toastr.error('Falló conexión al servidor.');
				}
			});

		}
		else {
			toastr.error('Hay datos faltantes o incorrecto. Complete y verifique los datos faltantes e intente nuevamente.');
			event.stopImmediatePropagation();
		}
	});

	$('button.edit.save.empresa').click(function (event) {
		var element = this;
		var fields = {};
		var validate = true;
		$('input[name^="cotizacion[empresa]"').not('[type="checkbox"]').not('input[name^="cotizacion[empresa][contacto]"]').removeClass('invalid');
		$('input[name^="cotizacion[empresa]"').not('input[name^="cotizacion[empresa][contacto]"]').each(function () {
			var tuple = {};

			var name = $(this).attr('name');
			if (name == 'cotizacion[empresa][rut][validate]')
				var value = $(this).prop('checked');
			else
				var value = $(this).val();
			var localValidate = true;
			if (value == '' && $('[name="cotizacion[empresa][rut][validate]"]').prop('checked'))
				localValidate = false;
			if (name == 'cotizacion[empresa][rut]') {
				if ($('input[name="cotizacion[empresa][rut][validate]"]').prop('checked') && !unaBase.data.rut.validate(value))
					localValidate = false;
			}

			if (!localValidate)
				$(this).invalid();

			if ($(this).data('id')) {
				// TODO: Buscar una alternativa al eval que funcione
				eval('var tuple = { "id": "' + $(this).data('id') + '" };');
				/*tuple = {
					id: $(this).data('id')
				};*/
				$.extend(fields, fields, tuple);
			}

			// TODO: Buscar una alternativa al eval que funcione
			eval('var tuple = { "' + name + '": "' + value + '" };');
			/*tuple = {
				name: value
			};*/
			$.extend(fields, fields, tuple);

			validate = validate && localValidate;
		});


		if (validate) {
			fields.nvType = unaBase.doc.type;
			fields.nvId = unaBase.doc.number;
			$.ajax({
				url: '/4DACTION/_V3_setEmpresa',
				dataType: 'json',
				data: fields,
				async: false,
				success: function (data) {
					if (data.success) {
						/*if (data.new)
							toastr.info('Empresa creada!');
						else
							toastr.info('Empresa modificada!');*/
						$('input[name="cotizacion[empresa][id]"]').data('id', data.id);

						$('h2 [name="cotizacion[empresa][id]"]').text(fields['cotizacion[empresa][id]']);
						$('h2 [name="cotizacion[empresa][razon_social]"]').text(fields['cotizacion[empresa][razon_social]']);

						afterEditEmpresa(element);
					} else {
						if (data.opened) {
							if (data.readonly)
								toastr.error('No fue posible guardar los datos de la empresa. Otro usuario está bloqueando el registro.');
						} else {
							if (!data.unique)
								toastr.error('La empresa que intenta ingresar ya se almacenó previamente en la base de datos.');
							else
								toastr.error('El id de la empresa no existe (error desconocido).');
						}
						// FIXME: colocar garbage collector (delete element) para ver si funciona
					}
				},
				error: function (xhr, text, error) {
					toastr.error('Falló conexión al servidor.');
				}
			});

		}
		else {
			toastr.error('Hay datos faltantes o incorrecto. Complete y verifique los datos faltantes e intente nuevamente.');
			event.stopImmediatePropagation();
		}
	});

	$('button.edit.save.empresa2').click(function (event) {
		var element = this;
		var fields = {};
		var validate = true;
		$('input[name^="cotizacion[empresa2]"').not('[type="checkbox"]').not('input[name^="cotizacion[empresa2][contacto]"]').removeClass('invalid');
		$('input[name^="cotizacion[empresa2]"').not('input[name^="cotizacion[empresa2][contacto]"]').each(function () {
			var tuple = {};

			var name = $(this).attr('name');
			if (name == 'cotizacion[empresa2][rut][validate]')
				var value = $(this).prop('checked');
			else
				var value = $(this).val();
			var localValidate = true;
			if (value == '' && $('[name="cotizacion[empresa2][rut][validate]"]').prop('checked'))
				localValidate = false;
			if (name == 'cotizacion[empresa2][rut]') {
				if ($('input[name="cotizacion[empresa2][rut][validate]"]').prop('checked') && !unaBase.data.rut.validate(value))
					localValidate = false;
			}

			if (!localValidate)
				$(this).invalid();

			if ($(this).data('id')) {
				// TODO: Buscar una alternativa al eval que funcione
				eval('var tuple = { "id": "' + $(this).data('id') + '" };');
				/*tuple = {
					id: $(this).data('id')
				};*/
				$.extend(fields, fields, tuple);
			}

			// TODO: Buscar una alternativa al eval que funcione
			eval('var tuple = { "' + name + '": "' + value + '" };');
			/*tuple = {
				name: value
			};*/
			$.extend(fields, fields, tuple);

			validate = validate && localValidate;
		});


		if (validate)
			$.ajax({
				url: '/4DACTION/_V3_setEmpresa_cot2',
				dataType: 'json',
				data: fields,
				async: false,
				success: function (data) {
					if (data.success) {
						/*if (data.new)
							toastr.info('Empresa creada!');
						else
							toastr.info('Empresa modificada!');*/
						$('input[name="cotizacion[empresa2][id]"]').data('id', data.id);

						$('h2 [name="cotizacion[empresa2][id]"]').text(fields['cotizacion[empresa2][id]']);
						$('h2 [name="cotizacion[empresa2][razon_social]"]').text(fields['cotizacion[empresa2][razon_social]']);

						afterEditEmpresa2(element);
					} else {
						if (data.opened) {
							if (data.readonly)
								toastr.error('No fue posible guardar los datos de la empresa. Otro usuario está bloqueando el registro.');
						} else {
							if (!data.unique)
								toastr.error('La empresa que intenta ingresar ya se almacenó previamente en la base de datos.');
							else
								toastr.error('El id de la empresa no existe (error desconocido).');
						}
						// FIXME: colocar garbage collector (delete element) para ver si funciona
					}
				},
				error: function (xhr, text, error) {
					toastr.error('Falló conexión al servidor.');
				}
			});
		else {
			toastr.error('Hay datos faltantes o incorrecto. Complete y verifique los datos faltantes e intente nuevamente.');
			event.stopImmediatePropagation();
		}
	});

	$('button.edit.discard.empresa').click(function (event) {
		var element = this;
		confirm('¿Desea descartar los cambios?').done(function (data) {
			if (data) {
				// ver si esto se saca

				$('input[name^="cotizacion[empresa]"').not('input[name^="cotizacion[empresa][contacto]"]').removeClass('invalid');
				var target = $(element).parentTo('ul');
				var id = target.find('input[name="cotizacion[empresa][id]"]').data('id');
				target.find('input[name^="cotizacion[empresa]"]').val('');
				$.ajax({
					url: '/4DACTION/_V3_' + 'get' + 'Empresa',
					dataType: 'json',
					data: {
						q: id,
						filter: 'id'
					},
					success: function (data) {
						$.map(data.rows, function (item) {
							target.find('input[name="cotizacion[empresa][id]"]').val(item.text);
							target.find('input[name="cotizacion[empresa][razon_social]"]').val(item.razon_social);
							target.find('input[name="cotizacion[empresa][rut]"]').val((item.rut_validar) ? unaBase.data.rut.format(item.rut) : item.rut);
							target.find('input[name="cotizacion[empresa][giro]"]').val(item.giro);
							target.find('input[name="cotizacion[empresa][direccion]"]').val(item.direccion);
							target.find('input[name="cotizacion[empresa][telefonos]"]').val(item.telefonos);
						});
						afterEditEmpresa(element);
						// FIXME: colocar garbage collector, delete element
					}
				});
			}
		});
		event.stopImmediatePropagation();
	});

	$('button.edit.discard.empresa2').click(function (event) {
		var element = this;
		confirm('¿Desea descartar los cambios?').done(function (data) {
			if (data) {
				// ver si esto se saca

				$('input[name^="cotizacion[empresa2]"').not('input[name^="cotizacion[empresa2][contacto]"]').removeClass('invalid');
				var target = $(element).parentTo('ul');
				var id = target.find('input[name="cotizacion[empresa2][id]"]').data('id');
				target.find('input[name^="cotizacion[empresa2]"]').val('');
				$.ajax({
					url: '/4DACTION/_V3_' + 'get' + 'Empresa',
					dataType: 'json',
					data: {
						q: id,
						filter: 'id'
					},
					success: function (data) {
						$.map(data.rows, function (item) {
							target.find('input[name="cotizacion[empresa2][id]"]').val(item.text);
							target.find('input[name="cotizacion[empresa2][razon_social]"]').val(item.razon_social);
							target.find('input[name="cotizacion[empresa2][rut]"]').val((item.rut_validar) ? unaBase.data.rut.format(item.rut) : item.rut);
							target.find('input[name="cotizacion[empresa2][giro]"]').val(item.giro);
							target.find('input[name="cotizacion[empresa2][direccion]"]').val(item.direccion);
							target.find('input[name="cotizacion[empresa2][telefonos]"]').val(item.telefonos);
						});
						afterEditEmpresa2(element);
						// FIXME: colocar garbage collector, delete element
					}
				});
			}
		});
		event.stopImmediatePropagation();
	});

	$('button.edit.save.contacto').click(function () {
		var element = this;
		//$('input[name="cotizacion[empresa][id]"]').data('id')
		var fields = {
			fk: document.querySelector('.input-contacto').dataset.id
		};
		$('input[name^="cotizacion[empresa][contacto]"').each(function () {
			var tuple = {};

			var name = $(this).attr('name');
			var value = $(this).val();
			if ($(this).data('id')) {
				//eval('var tuple = { "id": "' + $(this).data('id') + '" };');
				tuple = {
					'id': $(this).data('id')
				};
				$.extend(fields, fields, tuple);
			}

			//eval('var tuple = { "' + name + '": "' + value + '" };');

			tuple[name] = value;

			$.extend(fields, fields, tuple);
		});

		$.ajax({
			url: '/4DACTION/_V3_setContactoByEmpresa',
			dataType: 'json',
			data: fields,
			async: false,
			success: function (data) {

				if (data.success) {
					/*if (data.new)
						toastr.info('Contacto creado!');
					else
						toastr.info('Contacto modificado!');*/
					$('input[name="cotizacion[empresa][contacto][id]"]').data('id', data.id);

					$('h2 [name="cotizacion[empresa][contacto][id]"]').text(fields['cotizacion[empresa][contacto][id]']);

					afterEditContacto(element);
				} else {
					if (data.opened) {
						if (data.readonly)
							toastr.error('No fue posible guardar los datos del contacto. Otro usuario está bloqueando el registro.');
					} else {
						if (!data.unique)
							toastr.error('El contacto que intenta ingresar ya se almacenó previamente en la base de datos.');
						else
							toastr.error('El id del contacto no existe (error desconocido).');
					}
					// FIXME: colocar garbage collector, delete element
				}
			},
			error: function (xhr, text, error) {
				toastr.error('Falló conexión al servidor.');
			}
		});
	});

	$('button.edit.save.contacto2').click(function () {
		var element = this;
		var fields = {
			fk: $('input[name="cotizacion[empresa2][id]"]').data('id')
		};
		$('input[name^="cotizacion[empresa2][contacto]"').each(function () {
			var tuple = {};

			var name = $(this).attr('name');
			var value = $(this).val();
			if ($(this).data('id')) {
				//eval('var tuple = { "id": "' + $(this).data('id') + '" };');
				tuple = {
					'id': $(this).data('id')
				};
				$.extend(fields, fields, tuple);
			}

			//eval('var tuple = { "' + name + '": "' + value + '" };');

			tuple[name] = value;

			$.extend(fields, fields, tuple);
		});

		$.ajax({
			url: '/4DACTION/_V3_setContactoByEmpresa_cot2',
			dataType: 'json',
			data: fields,
			async: false,
			success: function (data) {
				if (data.success) {
					/*if (data.new)
						toastr.info('Contacto creado!');
					else
						toastr.info('Contacto modificado!');*/
					$('input[name="cotizacion[empresa2][contacto][id]"]').data('id', data.id);

					$('h2 [name="cotizacion[empresa2][contacto][id]"]').text(fields['cotizacion[empresa2][contacto][id]']);

					afterEditContacto2(element);
				} else {
					if (data.opened) {
						if (data.readonly)
							toastr.error('No fue posible guardar los datos del contacto. Otro usuario está bloqueando el registro.');
					} else {
						if (!data.unique)
							toastr.error('El contacto que intenta ingresar ya se almacenó previamente en la base de datos.');
						else
							toastr.error('El id del contacto no existe (error desconocido).');
					}
					// FIXME: colocar garbage collector, delete element
				}
			},
			error: function (xhr, text, error) {
				toastr.error('Falló conexión al servidor.');
			}
		});
	});

	$('button.edit.discard.contacto').click(function (event) {
		var element = this;
		confirm('¿Desea descartar los cambios?').done(function (data) {
			if (data) {
				var target = $(element).parentTo('ul');
				var id = target.find('input[name="cotizacion[empresa][contacto][id]"]').data('id');
				target.find('input[name^="cotizacion[empresa][contacto]"]').val('');
				$.ajax({
					url: '/4DACTION/_V3_' + 'get' + 'Contacto',
					dataType: 'json',
					data: {
						q: id,
						filter: 'id'
					},
					success: function (data) {
						$.map(data.rows, function (item) {
							target.find('input[name="cotizacion[empresa][contacto][id]"]').val(item.nombre_completo);
							target.find('input[name="cotizacion[empresa][contacto][cargo]"]').val(item.cargo);
							target.find('input[name="cotizacion[empresa][contacto][email]"]').val(item.email);
						});
						afterEditContacto(element);
						// FIXME: colocar garbage collector, delete element
					}
				});
			}
		});
		event.stopImmediatePropagation();
	});

	$('button.edit.discard.contacto2').click(function (event) {
		var element = this;
		confirm('¿Desea descartar los cambios?').done(function (data) {
			if (data) {
				var target = $(element).parentTo('ul');
				var id = target.find('input[name="cotizacion[empresa2][contacto][id]"]').data('id');
				target.find('input[name^="cotizacion[empresa2][contacto]"]').val('');
				$.ajax({
					url: '/4DACTION/_V3_' + 'get' + 'Contacto',
					dataType: 'json',
					data: {
						q: id,
						filter: 'id'
					},
					success: function (data) {
						$.map(data.rows, function (item) {
							target.find('input[name="cotizacion[empresa2][contacto][id]"]').val(item.nombre_completo);
							target.find('input[name="cotizacion[empresa2][contacto][cargo]"]').val(item.cargo);
							target.find('input[name="cotizacion[empresa2][contacto][email]"]').val(item.email);
						});
						afterEditContacto2(element);
						// FIXME: colocar garbage collector, delete element
					}
				});
			}
		});
		event.stopImmediatePropagation();
	});

	unaBase.toolbox.form.autocomplete({
		fields: [
			{ local: 'cotizacion[empresa][id]', remote: 'alias', type: 'search', default: true },
			{ local: 'cotizacion[empresa][razon_social]', remote: 'razon_social', type: 'text' },
			{ local: 'cotizacion[empresa][giro]', remote: 'giro', type: 'text' },
			{ local: 'cotizacion[empresa][direccion]', remote: 'direccion', type: 'text' },
			{ local: 'cotizacion[empresa][telefonos]', remote: 'telefonos', type: 'text' }
		],
		data: {
			entity: 'Empresa'
		},
		restrict: true,
		response: function (event, ui) {
			var target = $(this).parentTo('ul');
			$(this).data('id', null);
			target.find('input[name^="cotizacion[empresa]"]').not(this).val('');

			$('h2 [name="cotizacion[empresa][id]"]').text('');
			$('h2 [name="cotizacion[empresa][razon_social]"]').text('');
		},
		change: function (event, ui) {
			var target = $(this).parentTo('ul');
			if ($(this).val() == '') {
				$('button.empresa').hide();
				target.find('input').not(this).val('');
			}

			if (!$(this).data('id') && $(this).val() != '') {
				var element = this;
				if (!access._551) {

					confirm('El cliente "' + $(this).val() + '" no está registrado.' + "\n\n" + '¿Desea crearlo?').done(function (data) {
						if (data) {
							$(element).data('id', null);

							target.parent().find('input[name^="cotizacion[empresa][contacto]"]').val('');

							$('button.unlock.empresa').click();
						} else {
							$(element).val('');
							setTimeout(
								function () { $(element).focus(); }
								, 500);
						}
					});
				} else {
					$(element).val('');
					setTimeout(
						function () { $(element).focus(); }
						, 500);
				}
			}


		},
		select: function (event, ui) {
			var target = $(this).parentTo('ul');

			target.find('button.unlock.empresa').show();
			target.find('button.profile.empresa').show();
			target.find('button.edit.empresa').hide();

			$('input[type="search"][name="cotizacion[empresa][id]"]').val((ui.item.text) ? ui.item.text : 'Sin Alias');
			$('input[type="search"][name="cotizacion[empresa][id]"]').data('id', ui.item.id);

			target.find('input[name="cotizacion[empresa][razon_social]"]').val(ui.item.razon_social);
			target.find('input[name="cotizacion[empresa][rut]"]').val((ui.item.rut_validar) ? unaBase.data.rut.format(ui.item.rut) : ui.item.rut);
			target.find('input[name="cotizacion[empresa][giro]"]').val(ui.item.giro);
			target.find('input[name="cotizacion[empresa][direccion]"]').val(ui.item.direccion);
			target.find('input[name="cotizacion[empresa][telefonos]"]').val(ui.item.telefonos);

			target.find('input[name="cotizacion[condiciones][forma_pago]"]').data('id', ui.item.id_forma_default);
			target.find('input[name="cotizacion[condiciones][forma_pago]"]').val(ui.item.des_forma_default);


			$('h2 [name="cotizacion[empresa][id]"]').text(ui.item.text);
			$('h2 [name="cotizacion[empresa][razon_social]"]').text(ui.item.razon_social);

			// Porcentaje comisión agencia por contacto
			target.find('input[name="cotizacion[empresa][id]"]').data('sobrecargo-ca', ui.item.porcentaje_sobrecargo_ca);
			if (v3_sobrecargos_cinemagica && ui.item.porcentaje_sobrecargo_ca > 0) {
				$('.block-cinemagica input[name="sobrecargo[6][porcentaje]"]').val(ui.item.porcentaje_sobrecargo_ca).trigger('blur');
			}

			$.ajax({
				url: '/4DACTION/_V3_' + 'getContactoByEmpresa',
				dataType: 'json',
				async: false,
				data: {
					id: ui.item.id,
					default: true,
					strict: true
				},
				success: function (data) {
					var target = $('input[type="search"][name="cotizacion[empresa][contacto][id]"]').parentTo('ul');

					target.find('input[name="cotizacion[empresa][contacto][id]"]').data('id', 0); // ID 0 desvincula
					target.find('input[name="cotizacion[empresa][contacto][id]"]').val('');
					target.find('input[name="cotizacion[empresa][contacto][cargo]"]').val('');
					target.find('input[name="cotizacion[empresa][contacto][email]"]').val('');

					$('h2 [name="cotizacion[empresa][contacto][id]"]').text('');

					$.map(data.rows, function (item) {
						target.find('input[name="cotizacion[empresa][contacto][id]"]').data('id', item.id);
						target.find('input[name="cotizacion[empresa][contacto][id]"]').val(item.nombre_completo);
						target.find('input[name="cotizacion[empresa][contacto][cargo]"]').val(item.cargo);
						target.find('input[name="cotizacion[empresa][contacto][email]"]').val(item.email);

						$('h2 [name="cotizacion[empresa][contacto][id]"]').text(item.nombre_completo);
					});

					target.find('button.unlock.contacto, button.profile.contacto, button.show.contacto').show();
					target.find('button.edit.contacto').hide();
				}
			});

			return false;
		},
		renderItem: function (ul, item) {
			return $('<li><a><strong class="highlight">' + ((item.text) ? item.text : '[Sin Alias]') + '</strong><em>' + ((item.rut_validar) ? unaBase.data.rut.format(item.rut) : item.rut) + '</em><span>' + item.razon_social + '</span></a></li>').appendTo(ul);
		}
	});

	unaBase.toolbox.form.autocomplete({
		fields: [
			{ local: 'cotizacion[empresa2][id]', remote: 'alias', type: 'search', default: true },
			{ local: 'cotizacion[empresa2][razon_social]', remote: 'razon_social', type: 'text' },
			{ local: 'cotizacion[empresa2][giro]', remote: 'giro', type: 'text' },
			{ local: 'cotizacion[empresa2][direccion]', remote: 'direccion', type: 'text' },
			{ local: 'cotizacion[empresa2][telefonos]', remote: 'telefonos', type: 'text' }
		],
		data: {
			entity: 'Empresa'
		},
		restrict: true,
		response: function (event, ui) {

			var target = $(this).parentTo('ul');
			$(this).data('id', null);
			target.find('input[name^="cotizacion[empresa2]"]').not(this).val('');

			$('h2 [name="cotizacion[empresa2][id]"]').text('');
			$('h2 [name="cotizacion[empresa2][razon_social]"]').text('');
		},
		change: function (event, ui) {

			var target = $(this).parentTo('ul');
			if ($(this).val() == '') {
				$('button.empresa2').hide();
				target.find('input').not(this).val('');
			}

			if (!$(this).data('id') && $(this).val() != '') {
				var element = this;
				if (!access._551) {

					confirm('El cliente "' + $(this).val() + '" no está registrado.' + "\n\n" + '¿Desea crearlo?').done(function (data) {
						if (data) {
							$(element).data('id', null);

							target.parent().find('input[name^="cotizacion[empresa2][contacto]"]').val('');

							$('button.unlock.empresa2').click();
						} else {
							$(element).val('');
							setTimeout(
								function () { $(element).focus(); }
								, 500);
						}
					});
				} else {
					$(element).val('');
					setTimeout(
						function () { $(element).focus(); }
						, 500);
				}
			}


		},
		select: function (event, ui) {
			var target = $(this).parentTo('ul');

			target.find('button.unlock.empresa2').show();
			target.find('button.profile.empresa2').show();
			target.find('button.edit.empresa2').hide();

			$('input[type="search"][name="cotizacion[empresa2][id]"]').val((ui.item.text) ? ui.item.text : 'Sin Alias');
			$('input[type="search"][name="cotizacion[empresa2][id]"]').data('id', ui.item.id);

			target.find('input[name="cotizacion[empresa2][razon_social]"]').val(ui.item.razon_social);
			target.find('input[name="cotizacion[empresa2][rut]"]').val((ui.item.rut_validar) ? unaBase.data.rut.format(ui.item.rut) : ui.item.rut);
			target.find('input[name="cotizacion[empresa2][giro]"]').val(ui.item.giro);
			target.find('input[name="cotizacion[empresa2][direccion]"]').val(ui.item.direccion);
			target.find('input[name="cotizacion[empresa2][telefonos]"]').val(ui.item.telefonos);

			target.find('input[name="cotizacion[condiciones2][forma_pago]"]').data('id', ui.item.id_forma_default);
			target.find('input[name="cotizacion[condiciones2][forma_pago]"]').val(ui.item.des_forma_default);


			$('h2 [name="cotizacion[empresa2][id]"]').text(ui.item.text);
			$('h2 [name="cotizacion[empresa2][razon_social]"]').text(ui.item.razon_social);

			$.ajax({
				url: '/4DACTION/_V3_' + 'getContactoByEmpresa',
				dataType: 'json',
				async: false,
				data: {
					id: ui.item.id,
					default: true,
					strict: true
				},
				success: function (data) {
					var target = $('input[type="search"][name="cotizacion[empresa2][contacto][id]"]').parentTo('ul');

					target.find('input[name="cotizacion[empresa2][contacto][id]"]').data('id', 0); // ID 0 desvincula
					target.find('input[name="cotizacion[empresa2][contacto][id]"]').val('');
					target.find('input[name="cotizacion[empresa2][contacto][cargo]"]').val('');
					target.find('input[name="cotizacion[empresa2][contacto][email]"]').val('');

					$('h2 [name="cotizacion[empresa2][contacto][id]"]').text('');

					$.map(data.rows, function (item) {
						target.find('input[name="cotizacion[empresa2][contacto][id]"]').data('id', item.id);
						target.find('input[name="cotizacion[empresa2][contacto][id]"]').val(item.nombre_completo);
						target.find('input[name="cotizacion[empresa2][contacto][cargo]"]').val(item.cargo);
						target.find('input[name="cotizacion[empresa2][contacto][email]"]').val(item.email);

						$('h2 [name="cotizacion[empresa2][contacto][id]"]').text(item.nombre_completo);
					});

					target.find('button.unlock.contacto2, button.profile.contacto2, button.show.contacto2').show();
					target.find('button.edit.contacto2').hide();
				}
			});

			return false;
		},
		renderItem: function (ul, item) {

			return $('<li><a><strong class="highlight">' + ((item.text) ? item.text : '[Sin Alias]') + '</strong><em>' + ((item.rut_validar) ? unaBase.data.rut.format(item.rut) : item.rut) + '</em><span>' + item.razon_social + '</span></a></li>').appendTo(ul);
		}
	});

	unaBase.toolbox.form.autocomplete({
		fields: [
			{ local: 'cotizacion[empresa][contacto][id]', remote: 'nombre_completo', type: 'search', default: true },
			{ local: 'cotizacion[empresa][contacto][cargo]', remote: 'cargo', type: 'text' },
			{ local: 'cotizacion[empresa][contacto][email]', remote: 'razon_social', type: 'email' }
		],
		data: {
			entity: 'Contacto',
			filter: 'nombre_completo',
			relationship: function () {
				return {
					key: 'Empresa',
					id: $('input[name="cotizacion[empresa][id]"]').data('id')
				}
			}
		},
		restrict: false,
		response: function (event, ui) {
			var target = $(this).parentTo('ul');
			$(this).data('id', null);
			target.find('input[name^="cotizacion[empresa][contacto]"]').not(this).val('');

			$('h2 [name="cotizacion[empresa][contacto][id]"]').text('');
		},
		change: function (event, ui) {
			var target = $(this).parentTo('ul');
			if ($(this).val() == '')
				target.find('button.contacto').hide();

			if (!$(this).data('id') && $(this).val() != '') {
				var element = this;
				if (!access._551) {
					confirm('El contacto "' + $(this).val() + '" no está registrado.' + "\n\n" + '¿Desea crearlo?').done(function (data) {
						if (data) {
							$(element).data('id', null);
							$('button.unlock.contacto').click();
						} else {
							target.find('input[type="search"][name^="cotizacion[empresa][contacto]"]').val('');
							setTimeout(
								function () { $(element).focus(); }
								, 500);
						}
					});
				} else {
					target.find('input[type="search"][name^="cotizacion[empresa][contacto]"]').val('');
					setTimeout(
						function () { $(element).focus(); }
						, 500);
				}

			}

		},
		select: function (event, ui) {
			var target = $('input[type="search"][name="cotizacion[empresa][contacto][id]"]').parentTo('ul');

			target.find('button.unlock.contacto').show();
			target.find('button.edit.contacto').hide();

			$('input[type="search"][name="cotizacion[empresa][contacto][id]"]').val(ui.item.nombre_completo);
			$('input[type="search"][name="cotizacion[empresa][contacto][id]"]').data('id', ui.item.id);

			// Definir acá cómo se crea o duplica el contacto relacionado, en caso que se seleccione un contacto externo.
			// La forma planeada es dejar vacío los campos de cargo y email, hacer trigger en el botón editar contacto
			// y dejar referenciado un atributo data para saber a qué entrada de contacto debe asociarse la nueva
			// relación a crear.

			target.find('input[name="cotizacion[empresa][contacto][id]"]').val(ui.item.nombre_completo);
			target.find('input[name="cotizacion[empresa][contacto][cargo]"]').val(ui.item.cargo);
			target.find('input[name="cotizacion[empresa][contacto][email]"]').val(ui.item.email);

			$('h2 [name="cotizacion[empresa][contacto][id]"]').text(ui.item.nombre_completo);

			var old_empresa = $('input[name="cotizacion[empresa][id]"]').data('id');
			var new_empresa = ui.item.empresa.id;

			if (!old_empresa) {

				target.find('input[name="cotizacion[empresa][id]"]').data('id', undefined);
				target.find('input[name="cotizacion[empresa][id]"]').val('');
				target.find('input[name="cotizacion[empresa][razon_social]"]').val('');
				target.find('input[name="cotizacion[empresa][rut]"]').val('');

				$('h2 [name="cotizacion[empresa][id]"]').text('');
				$('h2 [name="cotizacion[empresa][razon_social]"]').text('');

				$.ajax({
					url: '/4DACTION/_V3_' + 'getEmpresa',
					dataType: 'json',
					async: false,
					data: {
						q: new_empresa,
						filter: 'id'
					},
					success: function (data) {
						var target = $('input[type="search"][name="cotizacion[empresa][id]"]').parentTo('ul');

						$.map(data.rows, function (item) {
							target.find('input[name="cotizacion[empresa][id]"]').data('id', item.id);
							target.find('input[name="cotizacion[empresa][id]"]').val(item.text);
							target.find('input[name="cotizacion[empresa][razon_social]"]').val(item.razon_social);
							target.find('input[name="cotizacion[empresa][rut]"]').val(item.rut);

							// Porcentaje comisión agencia por contacto
							target.find('input[name="cotizacion[empresa][id]"]').data('sobrecargo-ca', item.porcentaje_sobrecargo_ca);
							if (v3_sobrecargos_cinemagica && item.porcentaje_sobrecargo_ca > 0) {
								$('.block-cinemagica input[name="sobrecargo[6][porcentaje]"]').val(item.porcentaje_sobrecargo_ca).trigger('blur');
							}

							$('h2 [name="cotizacion[empresa][id]"]').text(item.text);
							$('h2 [name="cotizacion[empresa][razon_social]"]').text(item.razon_social);
						});
						$('button.empresa').show();
						$('button.empresa.edit').hide();
					}
				});
			}

			return false;
		},
		renderItem: function (ul, item) {
			var element;
			if (item.empresa.id == $('input[name="cotizacion[empresa][id]"]').data('id'))
				element = $('<li><a><strong class="highlight">' + item.nombre_completo + '</strong><em>[' + item.empresa.text + ']</em><span>' + item.cargo + '</span><span>' + item.email + '</span></a></li>').appendTo(ul);
			else
				element = $('<li><a><strong class="highlight">' + item.nombre_completo + '</strong><em>[' + item.empresa.text + ']</em><span>' + item.cargo + '</span><span>' + item.email + '</span></a></li>').appendTo(ul);
			return element;
		}
	});

	unaBase.toolbox.form.autocomplete({
		fields: [
			{ local: 'cotizacion[empresa2][contacto][id]', remote: 'nombre_completo', type: 'search', default: true },
			{ local: 'cotizacion[empresa2][contacto][cargo]', remote: 'cargo', type: 'text' },
			{ local: 'cotizacion[empresa2][contacto][email]', remote: 'razon_social', type: 'email' }
		],
		data: {
			entity: 'Contacto',
			filter: 'nombre_completo',
			relationship: function () {
				return {
					key: 'Empresa',
					id: $('input[name="cotizacion[empresa2][id]"]').data('id')
				}
			}
		},
		restrict: false,
		response: function (event, ui) {
			var target = $(this).parentTo('ul');
			$(this).data('id', null);
			target.find('input[name^="cotizacion[empresa2][contacto]"]').not(this).val('');

			$('h2 [name="cotizacion[empresa2][contacto][id]"]').text('');
		},
		change: function (event, ui) {
			var target = $(this).parentTo('ul');
			if ($(this).val() == '')
				target.find('button.contacto2').hide();

			if (!$(this).data('id') && $(this).val() != '') {
				var element = this;
				if (!access._551) {
					confirm('El contacto "' + $(this).val() + '" no está registrado.' + "\n\n" + '¿Desea crearlo?').done(function (data) {
						if (data) {
							$(element).data('id', null);
							$('button.unlock.contacto2').click();
						} else {
							target.find('input[type="search"][name^="cotizacion[empresa2][contacto]"]').val('');
							setTimeout(
								function () { $(element).focus(); }
								, 500);
						}
					});
				} else {
					target.find('input[type="search"][name^="cotizacion[empresa2][contacto]"]').val('');
					setTimeout(
						function () { $(element).focus(); }
						, 500);
				}

			}

		},
		select: function (event, ui) {
			var target = $('input[type="search"][name="cotizacion[empresa2][contacto][id]"]').parentTo('ul');

			target.find('button.unlock.contacto2').show();
			target.find('button.edit.contacto2').hide();

			$('input[type="search"][name="cotizacion[empresa2][contacto][id]"]').val(ui.item.nombre_completo);
			$('input[type="search"][name="cotizacion[empresa2][contacto][id]"]').data('id', ui.item.id);

			// Definir acá cómo se crea o duplica el contacto relacionado, en caso que se seleccione un contacto externo.
			// La forma planeada es dejar vacío los campos de cargo y email, hacer trigger en el botón editar contacto
			// y dejar referenciado un atributo data para saber a qué entrada de contacto debe asociarse la nueva
			// relación a crear.

			target.find('input[name="cotizacion[empresa2][contacto][id]"]').val(ui.item.nombre_completo);
			target.find('input[name="cotizacion[empresa2][contacto][cargo]"]').val(ui.item.cargo);
			target.find('input[name="cotizacion[empresa2][contacto][email]"]').val(ui.item.email);

			$('h2 [name="cotizacion[empresa2][contacto][id]"]').text(ui.item.nombre_completo);

			var old_empresa = $('input[name="cotizacion[empresa2][id]"]').data('id');
			var new_empresa = ui.item.empresa.id;

			if (!old_empresa) {

				target.find('input[name="cotizacion[empresa2][id]"]').data('id', undefined);
				target.find('input[name="cotizacion[empresa2][id]"]').val('');
				target.find('input[name="cotizacion[empresa2][razon_social]"]').val('');
				target.find('input[name="cotizacion[empresa2][rut]"]').val('');

				$('h2 [name="cotizacion[empresa2][id]"]').text('');
				$('h2 [name="cotizacion[empresa2][razon_social]"]').text('');

				$.ajax({
					url: '/4DACTION/_V3_' + 'getEmpresa',
					dataType: 'json',
					async: false,
					data: {
						q: new_empresa,
						filter: 'id'
					},
					success: function (data) {
						var target = $('input[type="search"][name="cotizacion[empresa2][id]"]').parentTo('ul');

						$.map(data.rows, function (item) {
							target.find('input[name="cotizacion[empresa2][id]"]').data('id', item.id);
							target.find('input[name="cotizacion[empresa2][id]"]').val(item.text);
							target.find('input[name="cotizacion[empresa2][razon_social]"]').val(item.razon_social);
							target.find('input[name="cotizacion[empresa2][rut]"]').val(item.rut);

							$('h2 [name="cotizacion[empresa2][id]"]').text(item.text);
							$('h2 [name="cotizacion[empresa2][razon_social]"]').text(item.razon_social);
						});
						$('button.empresa2').show();
						$('button.empresa2.edit').hide();
					}
				});
			}

			return false;
		},
		renderItem: function (ul, item) {
			var element;
			if (item.empresa.id == $('input[name="cotizacion[empresa2][id]"]').data('id'))
				element = $('<li><a><strong class="highlight">' + item.nombre_completo + '</strong><em>[' + item.empresa.text + ']</em><span>' + item.cargo + '</span><span>' + item.email + '</span></a></li>').appendTo(ul);
			else
				element = $('<li><a><strong class="highlight">' + item.nombre_completo + '</strong><em>[' + item.empresa.text + ']</em><span>' + item.cargo + '</span><span>' + item.email + '</span></a></li>').appendTo(ul);
			return element;
		}
	});

	if ($('input[name="cotizacion[condiciones][forma_pago]"]').length > 0) {

		$('input[name="cotizacion[condiciones][forma_pago]"]').autocomplete({

			source: function (request, response) {

				$.ajax({
					url: '/4DACTION/_V3_' + 'getFormaPagos?venta=true', // FIXME: debe ir en singular
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
			autoFocus: true,
			delay: 5,
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

				$('input[name="cotizacion[condiciones][forma_pago]"]').val(ui.item.text).data('id', ui.item.id);
				return false;
			}

		}).data('ui-autocomplete')._renderItem = function (ul, item) {

			return $('<li><a>' + item.text + '</a></li>').appendTo(ul);
		};
	}






});
