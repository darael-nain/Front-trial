$(document).ready(function() {

	$('section.sheet').find('tfoot .numeric.currency input').number(true, currency.decimals, ',', '.');
	$('section.sheet').find('tfoot .numeric.percent input').number(true, 2, ',', '.');
	$('section.sheet').find('footer .numeric.currency input').number(true, currency.decimals, ',', '.');
	$('section.sheet').find('footer .numeric.percent input').number(true, 2, ',', '.');

	unaBase.toolbox.init();

	unaBase.toolbox.menu.init({
		entity: 'Producto', // especifica entidad sobre la cual se almacenan los datos
							  // y nombre para referenciar los views
		// acá se envía la data que debe validar la API al presionar el botón save
		// y enviar en caso de ser válida
		buttons: [ 'save', 'deactivate', 'activate', 'exit' ],
		data: function() {
			var tuple = {};
			var fields = {
				id: $('section.sheet').data('id'),
				index: $('section.sheet').data('index'),
				text: $('input[name="producto[text]"]').val(),
				categoria: $('input[name="producto[categoria]"]').data('id'),
				'producto[precio]': $('input[name="producto[precio]"]').val(),
				'producto[costo]': $('input[name="producto[costo]"]').val(),
				'producto[observacion]': $('textarea[name="producto[observacion]"]').val(),
				'producto[cod_contable]': $('input[name="producto[cod_contable]"]').val(),
				'producto[precio_uf]': $('input[name="producto[precio_uf]"]').val(),
				'producto[costo_uf]': $('input[name="producto[costo_uf]"]').val()
			};

			return fields;
		},
		validate: function() {
			//updateIndexes();
			// Acá se definen las reglas de validación

			var isValidCategoria = true;
			$('input[name^="producto[categoria]"][required]').each(function() {
				if ($(this).val() == '') {
					isValidCategoria = false;
					//$(this).addClass('invalid');
					$(this).invalid();
				} //else
					//$(this).removeClass('invalid');
			});

			if (!isValidCategoria) {
				if ($('input[name="producto[categoria]"]').data('id'))
					$('button.unlock.categoria').click();
			}

			var isValidTitulo = true;
			$('input[name="producto[text]"]').each(function() {
				if ($(this).val() == '') {
					isValidTitulo = false;
					//$(this).addClass('invalid');
					$(this).invalid();
				} //else
					//$(this).removeClass('invalid');
			});

			return isValidCategoria && isValidTitulo; // devuelve true o false dependiendo de si pasa o no la validación
		}
	});

	if ($('section.sheet').data('id')) {
		if ($('section.sheet').data('readonly'))
			unaBase.toolbox.menu.buttons([ 'save', 'activate', 'exit' ]);
		else
			unaBase.toolbox.menu.buttons([ 'save', 'deactivate', 'exit' ]);
	} else
		unaBase.toolbox.menu.buttons([ 'save', 'exit' ]);


	$('ul button.show').button({
		icons: {
			primary: 'ui-icon-carat-1-s'
		},
		text: false
	});


	$('button.show.categoria').click(function() {
		var target = $(this).parentTo('ul');
		target.find('input[name="producto[categoria]"][type="search"]').autocomplete('search', '@').focus();
	});

	var findItem = function(datasource, filter, extraCallbacks, relationship) {
		var options = {
			source: function(request, response) {
				var dataParams = {
					q: request.term,
					filter: ((typeof filter != 'undefined')? filter : undefined)
				};
				if (typeof relationship != 'undefined')
					$.extend(dataParams, dataParams, {
						id: relationship.fk()
					});
				$.ajax({
					url: '/4DACTION/_V3_' + 'get' + datasource + ((typeof relationship != 'undefined')? 'by' + relationship.by : ''),
					dataType: 'json',
					data: dataParams,
					success: function(data) {
						response($.map(data.rows, function(item) {
							return item;
						}));
					}
				});
			},
			minLength: 0,
			open: function() {
				$(this).removeClass('ui-corner-all').addClass('ui-corner-top');
			},
			close: function() {
				$(this).removeClass('ui-corner-top').addClass('ui-corner-all');
			}
		};

		$.extend(options, options, extraCallbacks);

		return options;
	};
	
	
	// categoría
	/*if ($('input[name="producto[categoria]"]').length > 0)
		$('input[name="producto[categoria]"]').autocomplete({
			source: function(request, response) {
				$.ajax({
					url: '/4DACTION/_V3_' + 'getCategoria',
					dataType: 'json',
					data: {
						q: request.term
					},
					success: function(data) {
						response($.map(data.rows, function(item) {
							return item;
						}));
					}
				});
			},
			minLength: 0,
			delay: 5,
			autoFocus: true,
			position: { my: "left top", at: "left bottom", collision: "flip" },
			open: function() {
				$(this).removeClass('ui-corner-all').addClass('ui-corner-top');
			},
			close: function() {
				$(this).removeClass('ui-corner-top').addClass('ui-corner-all');
			},
			focus: function(event, ui) {
				//$(this).val(ui.item.text);
				return false;
			},
			response: function(event, ui) {
			},
			select: function(event, ui) {
				$('input[name="producto[categoria]"]').val(ui.item.text);
				$('input[name="producto[categoria]"]').data('id', ui.item.id);
				return false;
			}

		}).data('ui-autocomplete')._renderItem = function(ul, item) {
			return $('<li><a><span>' + item.text + '</span></a></li>').appendTo(ul);
		};
	*/

	unaBase.toolbox.form.autocomplete({
		fields: [
			{ local: 'producto[categoria]', remote: 'text', type: 'search', default: true }
		],
		data: {
			entity: 'Categoria'
		},
		//restrict: false,
		restrict: true, // test
		response: function(event, ui) {
			var target = $(this).parentTo('ul');
			$(this).data('id', null);
			target.find('input[name^="producto[categoria]"]').not(this).val('');
		},
		change: function(event, ui) {
			var target = $(this).parentTo('ul');
			//target.find('input').not(this).val('');
			if ($(this).val() == '') {
				$('button.categoria').hide();
				target.find('input').not(this).val('');
			}

			if (!$(this).data('id') && $(this).val() != '') {
			//if (ui.item == null) {
				var element = this;
				confirm('La categoría "' + $(this).val() + '" no está registrada.' + "\n\n" + '¿Desea crearla?').done(function(data) {
					if (data) {
						$(element).data('id', null);
						
						//target.parent().find('input[name^="producto[categoria]"]').val('');
						
						$('button.unlock.categoria').click();
					} else {
						$(element).val('');
						setTimeout(
							function() { $(element).focus(); }
						, 500);
					}
				});
			}


		},
		select: function(event, ui) {
			var target = $(this).parentTo('ul');

			target.find('button.unlock.categoria').show();
			target.find('button.profile.categoria').show();
			target.find('button.edit.categoria').hide();

			$('input[type="search"][name="producto[categoria]"]').val(ui.item.text);
			$('input[type="search"][name="producto[categoria]"]').data('id', ui.item.id);

			return false;
		},
		renderItem: function(ul, item) {
			//return $('<li><a><strong class="highlight">' + ((item.text)? item.text : '[Sin Alias]') + '</strong><em>' + ((item.rut_validar)? unaBase.data.rut.format(item.rut) : item.rut) + '</em><span>' + item.razon_social + '</span></a></li>').appendTo(ul);
			return $('<li><a><span>' + item.text + '</span></a></li>').appendTo(ul);
		}
	});

	$('input[name="producto[codigo]"]').blur(function() {
		$('span#index').text(($(this).val() != '')? $(this).val() : 'Sin código');
		$('section.sheet').data('index', $(this).val());
	});

	$('input[name="producto[precio]"]').blur(function() {
		$('span[name="producto[precio]"]').text($(this).val());
	});

	$('input[name="producto[costo]"]').blur(function() {
		$('span[name="producto[costo]"]').text($(this).val());
	});

	// Oculta botones editar
	$('button.edit').hide();

	$('button.unlock.categoria').button({
		icon: {
			primary: 'ui-icon-unlocked'
		},
		text: false
	}).click(function() {
		var target = $(this).parentTo('ul');
		
		target.find('input[type="search"][name^="producto[categoria]"]').each(function(key, item) {
			try {
				$(item).autocomplete('disable');
			} catch(e) { }
		});

		target.find('input').not('[type="search"][name^="producto[categoria]"]').not('[type="checkbox"]').removeAttr('readonly');
		target.find('input[type="search"][name^="producto[categoria]"]').removeAttr('placeholder').attr('type', 'text');

		target.find('button.categoria').hide();
		target.find('button.edit.categoria').show();
		target.find('input[name="producto[categoria]"]').focus();
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

	$('button.edit.save.categoria').click(function(event) {
		var element = this;
		var fields = {};
		var validate = true;
		$('input[name^="producto[categoria]"').not('[type="checkbox"]').removeClass('invalid');
		$('input[name^="producto[categoria]"').each(function() {
			var tuple = {};

			var name = $(this).attr('name');
			var value = $(this).val();
			var localValidate = true;
			if (value == '')
				localValidate = false;

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


		// se guardan los datos
		if (validate)
			$.ajax({
				url: '/4DACTION/_V3_setCategoria',
				dataType: 'json',
				data: fields,
				success: function(data) {
					if (data.success) {
						if (data.new)
							toastr.info('Categoría creada!');
						else
							toastr.info('Categoría modificada!');
						$('input[name="producto[categoria]"]').data('id', data.id);

						afterEditCategoria(element);
					} else {
						if (data.opened) {
							if (data.readonly)
								toastr.error('No fue posible guardar los datos de la categoría. Otro usuario está bloqueando el registro.');
						} else {
							if (!data.unique)
								toastr.error('La categoría que intenta ingresar ya se almacenó previamente en la base de datos.');
							else
								toastr.error('El id de la categoría no existe (error desconocido).');
						}
						//$('input[name="cotizacion[empresa][id]"]').parent().parent().find('button').click();
						// FIXME: colocar garbage collector (delete element) para ver si funciona
					}
				},
				error: function(xhr, text, error) {
					toastr.error('Falló conexión al servidor.');
					//$('input[name="cotizacion[empresa][id]"]').parent().parent().find('button').click();
				}
			});
		else {
			// mensaje validación
			toastr.error('Hay datos faltantes o incorrecto. Complete y verifique los datos faltantes e intente nuevamente.');
			event.stopImmediatePropagation();
		}
	});

	$('button.edit.discard.categoria').click(function(event) {
		var element = this;
		confirm('¿Desea descartar los cambios?').done(function(data) {
			if (data) {
				// ver si esto se saca

				$('input[name^="producto[categoria]"').removeClass('invalid');
				var target = $(element).parentTo('ul');
				var id = target.find('input[name="producto[categoria]"]').data('id');
				target.find('input[name^="producto[categoria]"]').val('');
				$.ajax({
					url: '/4DACTION/_V3_' + 'get' + 'Categoria',
					dataType: 'json',
					data: {
						q: id,
						filter: 'id'
					},
					success: function(data) {
						$.map(data.rows, function(item) {
							target.find('input[name="producto[categoria]"]').val(item.text);
						});
						afterEditCategoria(element);
						// FIXME: colocar garbage collector, delete element
					}
				});
			}
		});
		event.stopImmediatePropagation();
	});

});