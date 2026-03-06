$(document).ready(function() {

	$('section.sheet').find('tfoot .numeric.currency input').number(true, currency.decimals, ',', '.');
	$('section.sheet').find('tfoot .numeric.percent input').number(true, 2, ',', '.');
	$('section.sheet').find('footer .numeric.currency input').number(true, currency.decimals, ',', '.');
	$('section.sheet').find('footer .numeric.percent input').number(true, 2, ',', '.');

	const initializeTomSelect = (selector) => {
        let selectElement = document.querySelector(selector);

        new TomSelect(selectElement, {
            valueField: 'id',
            labelField: 'text',
            searchField: ['text'],
            preload: true,
            load: function(query, callback) {
                $.ajax({
                    url: '/4DACTION/_force_get_item_negocio',
                    dataType: 'json',
                    data: {
                        tipo: "TITULO",
                        q: query
                    },
                    success: function(response) {
                        const contactsOptions = response.rows
                            .map(value => ({
                                id: value.id,
                                text: value.nombre
                            }));
                        callback(contactsOptions);
                    },
                    error: function() {
                        callback();
                    }
                });
            },
            render: {
                option: function(item, escape) {
                    return '<div>' + escape(item.text) + '</div>';
                },
                item: function(item, escape) {
                    return '<div>' + escape(item.text) + '</div>';
                }
            },
            placeholder: 'Selecciona un contacto',
            loadingClass: 'loading'
        });
    };

	const initializeTomSelectValidationItems = (selector) => {
    let selectElement = document.querySelector(selector);
    if (!selectElement) return;

    const reglaId = Number($('section.sheet').data('id'));
    console.log('[ReglaValidacion] id actual:', reglaId);

    const ts = new TomSelect(selectElement, {
        valueField: 'id',
        labelField: 'text',
        searchField: ['text'],
        preload: true,
        // maxItems eliminado para permitir múltiples selecciones
        load: function (query, callback) {
            console.log("Query enviado a TomSelect:", query);
            $.ajax({
                url: '/4DACTION/_force_get_item_negocio',
                dataType: 'json',
                data: {
                    tipo: "ITEM",
                    q: query
                },
                success: function (response) {
                    const contactsOptions = response.rows
                        .map(value => ({
                            id: value.id,
                            text: value.nombre,
                            codProd: value.codigoProducto
                        }))
                        .map(item => ({
                            ...item,
                            text: item.text.includes('&') ? item.text.replace(/&/g, '+') : item.text,
                            codProd: item.codProd
                        }));
                    // prevenir textos con '&'
                    callback(contactsOptions);
                },
                error: function () {
                    callback();
                }
            });
        },
        render: {
            option: function (item, escape) {
                return '<div>' + escape(item.codProd) + ' | ' + escape(item.text) + '</div>';
            },
            item: function (item, escape) {
                return '<div>' + escape(item.codProd) + ' | ' + escape(item.text) + '</div>';
            }
        },
        placeholder: 'Selecciona una o más categorías',
        loadingClass: 'loading',

        onItemAdd: function () {
            const allTexts = this.items.map(id => this.options[id].text + '|' + this.options[id].codProd);
            const textoConcatenado = allTexts.join(' & ');

            const inputDestino = document.querySelector('input[name="regla_validacion[valor]"]');
            if (inputDestino) {
                inputDestino.value = textoConcatenado;
            }
        },

        onItemRemove: function () {
            const allTexts = this.items.map(id => this.options[id].text + '|' + this.options[id].codProd);
            const textoConcatenado = allTexts.join(' & ');

            const inputDestino = document.querySelector('input[name="regla_validacion[valor]"]');
            if (inputDestino) {
                inputDestino.value = textoConcatenado;
            }
        }
    });

    if (reglaId) {
        $.ajax({
            url: '/4DACTION/_V3_getReglaValidacion',
            method: 'GET',
            dataType: 'json',
            data: {
                page: 1,
                results: 108,
                q: '',   
                q2: '' 
            },
            success: function (resp) {
                //console.log('resp:', resp);
                const rows = resp.rows || [];
                const regla = rows.find(r => Number(r.id) === reglaId);
                //console.log('regla encontrada:', regla);

                if (!regla || !regla.value) return;

                const valueStr = regla.value; 

                const fragmentos = valueStr
                    .split('&')
                    .map(s => s.trim())
                    .filter(Boolean);

                fragmentos.forEach(fragmento => {
                    const partes = fragmento.split('|').map(s => s.trim());
                    if (partes.length < 2) return;

                    const nombre = partes[0]; 
                    const codigo = partes[1];  

                    const optionId = codigo;

                    if (!ts.options[optionId]) {
                        ts.addOption({
                            id: optionId,
                            text: nombre,
                            codProd: codigo
                        });
                    }

                    ts.addItem(optionId, true);
                });
            },
            error: function (xhr, status, err) {
                console.error('[getReglaValidacion] error:', err);
            }
        });
    }
};


	unaBase.toolbox.init();

	unaBase.toolbox.menu.init({
		entity: 'ReglaValidacion', // especifica entidad sobre la cual se almacenan los datos
							  // y nombre para referenciar los views
		// acá se envía la data que debe validar la API al presionar el botón save
		// y enviar en caso de ser válida
		buttons: /*(
			($('section.sheet').data('index') == -1)?
			[ 'save', 'delete', 'exit', 'preview' ]
			: (
				($('section.sheet').data('index') == 0)?
				[ 'save', 'exit', 'preview' ]
				:
				[ 'save', 'clone_current', 'convert_negocio', 'discard', 'exit', 'share', 'preview', 'template' ]
			)

		)*/
		[ 'save', 'delete_rv', 'exit' ],
		//data: function(index) {
		data: function() {
			var tuple = {};
			var fields = {
				//id: ((typeof index == 'undefined')? $('section.sheet').data('id') : undefined),
				//index: ((typeof index == 'undefined')? $('section.sheet').data('index') : index),
				id: $('section.sheet').data('id'),
				index: $('section.sheet').data('index'),
				'regla_validacion[criterio]': $('input[name="regla_validacion[criterio]"]').data('id'),
				'regla_validacion[valor]': $('input[name="regla_validacion[valor]"]').val(),
				'regla_validacion[valor2]': $('input[name="regla_validacion[valor2]"]').val(),
				'regla_validacion[operador]': $('input[name="regla_validacion[operador]"]').val()
			};

			return fields;
		},
		validate: function() {
			return true;
			//updateIndexes();
			// Acá se definen las reglas de validación

			var isValidEmpresa = true;
			$('input[name="regla_validacion[criterio]"][required]').each(function() {
				if ($(this).val() == '') {
					isValidEmpresa = false;
					//$(this).addClass('invalid');
					$(this).invalid();
				} //else
					//$(this).removeClass('invalid');
			});
			if (!isValidEmpresa) {
				if ($('input[name="cotizacion[empresa][id]"]').data('id'))
					$('button.unlock.empresa').click();
			}

			var isValidEjecutivo = true;
			$('input[name^="cotizacion[ejecutivo]"').each(function() {
				if ($(this).val() == '') {
					isValidEjecutivo = false;
					//$(this).addClass('invalid');
					$(this).invalid();
				} //else
					//$(this).removeClass('invalid');
			});

			var isValidAreaNegocio = true;
			$('input[name^="cotizacion[area_negocio]"').each(function() {
				if ($(this).val() == '') {
					isValidAreaNegocio = false;
					//$(this).addClass('invalid');
					$(this).invalid();
				} //else
					//$(this).removeClass('invalid');
			});


			var isValidContacto = true;
			$('input[name^="cotizacion[empresa][contacto]"][required]').each(function() {
				if ($(this).val() == '') {
					isValidContacto = false;
					//$(this).addClass('invalid');
					$(this).invalid();
				} //else
					//$(this).removeClass('invalid');
			});
			if (!isValidContacto) {
				if ($('input[name="cotizacion[empresa][contacto][id]"]').data('id'))
					$('button.unlock.contacto').click();
			}


			var isValidTitulo = true;
			$('input[name="cotizacion[titulo][text]"]').each(function() {
				if ($(this).val() == '') {
					isValidTitulo = false;
					//$(this).addClass('invalid');
					$(this).invalid();
				} //else
					//$(this).removeClass('invalid');
			});

			var isValidFormaPago = true;
			$('input[name="cotizacion[condiciones][forma_pago]"]').each(function() {
				if ($(this).val() == '') {
					isValidFormaPago = false;
					//$(this).addClass('invalid');
					$(this).invalid();
				} //else
					//$(this).removeClass('invalid');
			});

			var isValidItems = true;
			$('table.items > tbody > tr > * > [name="item[][nombre]"]').each(function (key, item) {
				if ($(item).val() == '') {
					isValidItems = false;
					//$(item).addClass('invalid');
					$(item).invalid();
					isValidItems = isValidItems && false;
				} //else
					//$(item).removeClass('invalid');
			});

			return isValidEmpresa && isValidEjecutivo && isValidAreaNegocio && isValidContacto && isValidTitulo && isValidFormaPago && isValidItems; // devuelve true o false dependiendo de si pasa o no la validación
		}
	});


	// FIXME: Disminuir lag en opción Obtener, quitando el autoguardado de indices (queda comentado)
	/*$('.toolbox > ul > li > button').click(function() {
		updateIndexes();
	});*/


	$('ul button.show').button({
		icons: {
			primary: 'ui-icon-carat-1-s'
		},
		text: false
	});

	$('button.show.criterio-validacion').click(function() {
		var target = $(this).parentTo('ul');
		target.find('input[name="regla_validacion[criterio]"][type="search"]').autocomplete('search', '@').focus();
	});

	$('button.show.valor').click(function() {
		var target = $(this).parentTo('ul');
		target.find('input[name="regla_validacion[valor]"][type="search"]').autocomplete('search', '@').focus();
	});

	$('button.show.valor2').click(function() {
		var target = $(this).parentTo('ul');
		target.find('input[name="regla_validacion[valor2]"][type="search"]').autocomplete('search', '@').focus();
	});


	$('section.sheet > table > tbody').on('click', 'tr:not(.title) button.remove.item', function() {
		var element = this;
		var title = $(element).parentTo('tr').prevTo('.title');
		if ($(element).parentTo('tr').data('id')) {
			$.ajax({
				url: '/4DACTION/_V3_removeUsuarioRV',
				async: false,
				dataType: 'json',
				data: {
					id: $(this).parentTo('tr').data('id')
				},
				success: function(data) {
					if (data.success) {

						$(element).parentTo('tr').fadeOut(400, function() {
							$(this).remove();
						});
					} else {
						if (data.opened) {
							if (data.readonly)
								toastr.error('No fue posible guardar el item. Otro usuario está bloqueando el registro.');
						} else {
							toastr.warning('Este item ya no existe. Probablemente ya fue removido por otro usuario. Se quitó de todos modos.');
							$(element).parentTo('tr').fadeOut(400, function() {
								$(this).remove();
							});
						}
					}
					// FIXME: colocar garbage collector, delete element
				},
				error: function(xhr, text, error) {
					toastr.error('Falló conexión al servidor.');
				}
			});
		} else {
			$(element).parentTo('tr').fadeOut(400, function() {
				$(this).remove(); // FIXME: ver si realmente quita de la memoria los nodos
			});
		}

	});

	$('section.sheet > table > tbody').on('click', 'button.remove.categoria', function() {
		var title = $(this).parent().parent();
		var current = title.next();
		var hasStatus = {
			success: true,
			opened: true,
			readonly: true
		}
		var action = true;

		var countItems = 0;
		if (current.length > 0) {
			if (current.filter('[data-categoria]').length == 0)
				countItems = current.nextUntil('[data-categoria]').length + 1;
			else
				countItems = 0;
		}

		var removeTitle = function() {
			if (countItems > 0) {
				unaBase.ui.block();

				do {

					if (current.data('id')) {
						$.ajax({
							url: '/4DACTION/_V3_removeUsuarioRV',
							dataType: 'json',
							async: false, // debe bloquear esperando hasta completar la acción
							data: {
								id: current.data('id')
							},
							success: function(data) {
								if (data.success)
									current.fadeOut(400, function() {
										$(this).remove();
									});
								else {
									hasStatus.success = false;
									if (data.opened) {
										if (!data.readonly)
											hasStatus.readonly = false;
									} else {
										hasStatus.opened = false;
										current.fadeOut(400, function() {
											$(this).remove();
										});
									}
								}
							},
							error: function(xhr, text, error) {
								hasStatus.success = false;
								hasStatus.opened = null;
								hasStatus.readonly = null;
								toastr.error('Falló conexión al servidor.');
							}
						});
					}

					countItems--;
					current = current.next();
				} while(countItems > 0);

				unaBase.ui.unblock();
			}

			if (hasStatus.success) {
				if (!hasStatus.opened)
					toastr.warn('Algunos usuarios dentro de la jerarquía ya no existían, probablemente fueron removidos antes por otro usuario. Se quitaron de todos modos');

				title.fadeOut(400, function() {
					$(this).remove();
				});

			} else {
				if (hasStatus.readonly)
					toastr.warn('No fue posible quitar la jerarquía, ya que hay usuarios dentro de él que no se pudieron quitar por encontrarse bloqueados.');
				else
					toastr.error('No fue posible quitar la jerarquía, posiblemente debido a un error de conexión.');
			}
		};

		if (countItems > 0)
			confirm('¿Desea quitar el título y todos los items dentro del título?').done(function(data) {
				if (data) {
					removeTitle();
				}
			});
		else
			removeTitle();

	});

	$('section.sheet > table > thead').on('click', 'button.add.categoria', function() {
		var current = $(this).parentTo('table').find('tbody');

		if (current.find('tr').length > 0)
			getElement.titulo('prependTo', current).find('input').focus();
		else
			getElement.titulo('prependTo', current).find('input').focus();
		updateIndexes();
	});

	$('section.sheet > table > tbody').on('click', 'button.add.categoria', function() {
		var current = $(this).parentTo('tr');
		while(!(current.next().html() == undefined || current.next().find('th').length > 0)) {
			current = current.next();
		}
		//getElement.titulo().insertAfter(current).find('input[name="item[][nombre]"]').focus();
		getElement.titulo('insertAfter', current).find('input[name="item[][nombre]"]').focus();
		updateIndexes();
	});

	$('section.sheet > table > tbody').on('click', 'button.add.item', function() {
		var current = $(this).parentTo('tr');
		while(!(current.next().html() == undefined || current.next().find('th').length > 0)) {
			current = current.next();
		}
		//getElement.item().insertAfter(current).find('input[name="item[][nombre]"]').focus();
		getElement.item('insertAfter', current).find('input[name="item[][nombre]"]').focus();
		updateIndexes();
	});

	$('section.sheet > table > tbody').on('click', 'button.profile.categoria', function() {
		$('#dialog-profile').dialog('open');
	});

	$('section.sheet > table > tbody').on('click', 'button.detail.item', function() {
		unaBase.loadInto.dialog('/v3/views/cotizaciones/pop_detalle_items.shtml?id=' + $(this).parentTo('tr').data('id'), 'Detalle de Ítem', 'medium');
	});

	$('section.sheet > table > tbody').on('click', 'button.profile.item', function() {
		alert('perfil ítem en construcción');
	});

	$('section.sheet > table > tbody').on('click', 'button.show.item', function() {
		$(this).parentTo('tr').find('[type="search"]').autocomplete('search', '@').focus();
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

	unaBase.toolbox.form.autocomplete({
		fields: [
			{ local: 'cotizacion[empresa][id]', remote: 'alias', type: 'search', default: true }, // el primero es default
			{ local: 'cotizacion[empresa][razon_social]', remote: 'razon_social', type: 'search' },
			//{ local: 'cotizacion[empresa][rut]', remote: 'rut', type: 'search' },
			{ local: 'cotizacion[empresa][giro]', remote: 'giro', type: 'text' },
			{ local: 'cotizacion[empresa][direccion]', remote: 'direccion', type: 'text' },
			{ local: 'cotizacion[empresa][telefonos]', remote: 'telefonos', type: 'text' }
		],
		data: {
			entity: 'Empresa'
		},
		//restrict: false,
		restrict: true, // test
		response: function(event, ui) {
			var target = $(this).parentTo('ul');
			$(this).data('id', null);
			target.find('input[name^="cotizacion[empresa]"]').not(this).val('');

			$('h2 [name="cotizacion[empresa][id]"]').text('');
			$('h2 [name="cotizacion[empresa][razon_social]"]').text('');
		},
		change: function(event, ui) {
			var target = $(this).parentTo('ul');
			//target.find('input').not(this).val('');
			if ($(this).val() == '')
				$('button.empresa').hide();

			if (!$(this).data('id') && $(this).val() != '') {
			//if (ui.item == null) {
				var element = this;
				confirm('El cliente "' + $(this).val() + '" no está registrado.' + "\n\n" + '¿Desea crearlo?').done(function(data) {
					if (data) {
						$(element).data('id', null);

						target.parent().find('input[name^="cotizacion[empresa][contacto]"]').val('');

						$('button.unlock.empresa').click();
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

			target.find('button.unlock.empresa').show();
			target.find('button.profile.empresa').show();
			target.find('button.edit.empresa').hide();

			$('input[type="search"][name="cotizacion[empresa][id]"]').val((ui.item.text)? ui.item.text : 'Sin Alias');
			$('input[type="search"][name="cotizacion[empresa][id]"]').data('id', ui.item.id);

			target.find('input[name="cotizacion[empresa][razon_social]"]').val(ui.item.razon_social);
			target.find('input[name="cotizacion[empresa][rut]"]').val((ui.item.rut_validar)? unaBase.data.rut.format(ui.item.rut) : ui.item.rut);
			target.find('input[name="cotizacion[empresa][giro]"]').val(ui.item.giro);
			target.find('input[name="cotizacion[empresa][direccion]"]').val(ui.item.direccion);
			target.find('input[name="cotizacion[empresa][telefonos]"]').val(ui.item.telefonos);

			$('h2 [name="cotizacion[empresa][id]"]').text(ui.item.text);
			$('h2 [name="cotizacion[empresa][razon_social]"]').text(ui.item.razon_social);

			$.ajax({
				url: '/4DACTION/_V3_' + 'getContactoByEmpresa',
				dataType: 'json',
				async: false,
				data: {
					id: ui.item.id,
					default: true
				},
				success: function(data) {
					var target = $('input[type="search"][name="cotizacion[empresa][contacto][id]"]').parentTo('ul');

					target.find('input[name="cotizacion[empresa][contacto][id]"]').data('id', 0); // ID 0 desvincula
					target.find('input[name="cotizacion[empresa][contacto][id]"]').val('');
					target.find('input[name="cotizacion[empresa][contacto][cargo]"]').val('');
					target.find('input[name="cotizacion[empresa][contacto][email]"]').val('');

					$('h2 [name="cotizacion[empresa][contacto][id]"]').text('');

					$.map(data.rows, function(item) {
						target.find('input[name="cotizacion[empresa][contacto][id]"]').data('id', item.id);
						target.find('input[name="cotizacion[empresa][contacto][id]"]').val(item.nombre_completo);
						target.find('input[name="cotizacion[empresa][contacto][cargo]"]').val(item.cargo);
						target.find('input[name="cotizacion[empresa][contacto][email]"]').val(item.email);

						$('h2 [name="cotizacion[empresa][contacto][id]"]').text(item.nombre_completo);
					});

					target.find('button.unlock.contacto').show();
					target.find('button.profile.contacto').show();
					target.find('button.edit.contacto').hide();
				}
			});

			return false;
		},
		renderItem: function(ul, item) {

			return $('<li><a><strong class="highlight">' + ((item.text)? item.text : '[Sin Alias]') + '</strong><em>' + ((item.rut_validar)? unaBase.data.rut.format(item.rut) : item.rut) + '</em><span>' + item.razon_social + '</span></a></li>').appendTo(ul);
		}
	});


	unaBase.toolbox.form.autocomplete({
		fields: [
			{ local: 'cotizacion[empresa][razon_social]', remote: 'razon_social', type: 'search', default: true },
			{ local: 'cotizacion[empresa][id]', remote: 'alias', type: 'search' },
			{ local: 'cotizacion[empresa][giro]', remote: 'giro', type: 'text' },
			{ local: 'cotizacion[empresa][direccion]', remote: 'direccion', type: 'text' },
			{ local: 'cotizacion[empresa][telefonos]', remote: 'telefonos', type: 'text' }
		],
		data: {
			entity: 'Empresa'
		},
		restrict: false,
		response: function(event, ui) {
			var target = $(this).parentTo('ul');
			$(this).data('id', null);
			target.find('input[name^="cotizacion[empresa]"]').not(this).val('');

			$('h2 [name="cotizacion[empresa][id]"]').text('');
			$('h2 [name="cotizacion[empresa][razon_social]"]').text('');
		},
		select: function(event, ui) {
			var target = $(this).parentTo('ul');

			target.find('button.unlock.empresa').show();
			target.find('button.edit.empresa').hide();

			$('input[type="search"][name="cotizacion[empresa][razon_social]"]').val((ui.item.razon_social)? ui.item.razon_social : ui.item.alias);
			$('input[type="search"][name="cotizacion[empresa][id]"]').data('id', ui.item.id);

			target.find('input[name="cotizacion[empresa][id]"]').val(ui.item.text);
			target.find('input[name="cotizacion[empresa][rut]"]').val((ui.item.rut_validar)? unaBase.data.rut.format(ui.item.rut) : ui.item.rut);

			$('h2 [name="cotizacion[empresa][id]"]').text(ui.item.text);
			$('h2 [name="cotizacion[empresa][razon_social]"]').text(ui.item.razon_social);

			$.ajax({
				url: '/4DACTION/_V3_' + 'getContactoByEmpresa',
				dataType: 'json',
				async: false,
				data: {
					id: ui.item.id,
					default: true
				},
				success: function(data) {
					var target = $('input[type="search"][name="cotizacion[empresa][contacto][id]"]').parentTo('ul');

					target.find('input[name="cotizacion[empresa][contacto][id]"]').data('id', undefined);
					target.find('input[name="cotizacion[empresa][contacto][id]"]').val('');
					target.find('input[name="cotizacion[empresa][contacto][cargo]"]').val('');
					target.find('input[name="cotizacion[empresa][contacto][email]"]').val('');

					$('h2 [name="cotizacion[empresa][contacto][id]"]').text('');

					$.map(data.rows, function(item) {
						target.find('input[name="cotizacion[empresa][contacto][id]"]').data('id', item.id);
						target.find('input[name="cotizacion[empresa][contacto][id]"]').val(item.nombre_completo);
						target.find('input[name="cotizacion[empresa][contacto][cargo]"]').val(item.cargo);
						target.find('input[name="cotizacion[empresa][contacto][email]"]').val(item.email);

						$('h2 [name="cotizacion[empresa][contacto][id]"]').text(item.nombre_completo);
					});
				}
			});

			return false;
		},
		renderItem: function(ul, item) {
			return $('<li><a><strong>' + ((item.text)? item.text : '[Sin Alias]') + '</strong><em>' + ((item.rut_validar)? unaBase.data.rut.format(item.rut) : item.rut) + '</em><span class="highlight">' + item.razon_social + '</span></a></li>').appendTo(ul);
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
			relationship: function() {
				return {
					key: 'Empresa',
					id: $('input[name="cotizacion[empresa][id]"]').data('id')
				}
			}
		},
		restrict: false,
		response: function(event, ui) {
			var target = $(this).parentTo('ul');
			$(this).data('id', null);
			target.find('input[name^="cotizacion[empresa][contacto]"]').not(this).val('');

			$('h2 [name="cotizacion[empresa][contacto][id]"]').text('');
		},
		change: function(event, ui) {
			var target = $(this).parentTo('ul');
			if ($(this).val() == '')
				target.find('button.contacto').hide();

			if (!$(this).data('id') && $(this).val() != '') {
				var element = this;
				confirm('El contacto "' + $(this).val() + '" no está registrado.' + "\n\n" + '¿Desea crearlo?').done(function(data) {
					if (data) {
						$(element).data('id', null);
						$('button.unlock.contacto').click();
					} else {
						target.find('input[type="search"][name^="cotizacion[empresa][contacto]"]').val('');
						setTimeout(
							function() { $(element).focus(); }
						, 500);
					}
				});
			}

		},
		select: function(event, ui) {
			var target = $('input[type="search"][name="cotizacion[empresa][contacto][id]"]').parentTo('ul');

			target.find('button.unlock.contacto').show();
			target.find('button.edit.contacto').hide();

			$('input[type="search"][name="cotizacion[empresa][contacto][id]"]').val(ui.item.nombre_completo);
			$('input[type="search"][name="cotizacion[empresa][contacto][id]"]').data('id', ui.item.id);

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
					success: function(data) {
						var target = $('input[type="search"][name="cotizacion[empresa][id]"]').parentTo('ul');

						$.map(data.rows, function(item) {
							target.find('input[name="cotizacion[empresa][id]"]').data('id', item.id);
							target.find('input[name="cotizacion[empresa][id]"]').val(item.text);
							target.find('input[name="cotizacion[empresa][razon_social]"]').val(item.razon_social);
							target.find('input[name="cotizacion[empresa][rut]"]').val(item.rut);

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
		renderItem: function(ul, item) {
			return $('<li><a><strong class="highlight">' + item.nombre_completo + '</strong><em>' + item.cargo + '</em><span>' + item.email + '</span></a></li>').appendTo(ul);
		}
	});

	// área de negocio
	
	$('ul.editable:nth-of-type(2) input[name="regla_validacion[valor]"]').autocomplete({
		source: function(request, response) {
			$.ajax({
				url: '/4DACTION/_V3_get' + (typeof ui== 'undefined'? 'AreaNegocio' : ui.item.entity),
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
			$('input[name="regla_validacion[valor]"]').val(ui.item.text);
			return false;
		}
	}).data('ui-autocomplete')._renderItem = function(ul, item) {
		return $('<li><a><span>' + item.text + '</span></a></li>').appendTo(ul);
	};

	if ($('input[name="regla_validacion[criterio]"]').length > 0)
		$('input[name="regla_validacion[criterio]"]').autocomplete({
			source: function(request, response) {
				$.ajax({
					url: '/4DACTION/_V3_' + 'getCriterioValidacion',
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
				console.log(ui.item);
				



				$('input[name="regla_validacion[criterio]"]').val(ui.item.text);
				$('input[name="regla_validacion[criterio]"]').data('id', ui.item.id);
				 toggleCategoriaNegocioByText(ui.item.text);
 
				if (ui.item.has_value) {
					if (ui.item.entity != '') {
						$('ul.editable:nth-of-type(2) input[name="regla_validacion[valor]"]').autocomplete({
							source: function(request, response) {
								$.ajax({
									url: '/4DACTION/_V3_get' + ui.item.entity,
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
								$('input[name="regla_validacion[valor]"]').val(ui.item.text);
								return false;
							}
						}).data('ui-autocomplete')._renderItem = function(ul, item) {
							return $('<li><a><span>' + item.text + '</span></a></li>').appendTo(ul);
						};
						$('ul.editable:nth-of-type(2)').find('button.show.valor').show();
						$('ul.editable:nth-of-type(2)').show().find('input').attr('type', 'search').attr('required', true);
					} else {
						$('ul.editable:nth-of-type(2)').hide().find('input').val(undefined).attr('required', false);
						$('ul.editable:nth-of-type(2)').find('button.show.valor').hide();
					}

					if (ui.item.is_numeric)
						$('ul.editable:nth-of-type(2)').show().find('input').attr('type', 'text').attr('required', true).number(true, currency.decimals, ',', '.');
					if (ui.item.is_text)
						$('ul.editable:nth-of-type(2)').show().find('input').attr('type', 'text').attr('required', true);

				} else {
					$('ul.editable:nth-of-type(2)').hide().find('input').val(undefined).attr('required', false);
				}

				if (ui.item.has_value2) {
					if (/*ui.item.entity != ''*/ true) {
						$('ul.editable:nth-of-type(3) input[name="regla_validacion[valor2]"]').autocomplete({
							source: function(request, response) {
								var entity2 = ui.item.entity.split('+')[1].split('|')[0];
								$.ajax({
									url: '/4DACTION/_V3_get' + entity2,
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
								$('input[name="regla_validacion[valor2]"]').val(ui.item.text);
								return false;
							}
						}).data('ui-autocomplete')._renderItem = function(ul, item) {
							return $('<li><a><span>' + item.text + '</span></a></li>').appendTo(ul);
						};
						$('ul.editable:nth-of-type(3)').find('button.show.valor2').show();
						$('ul.editable:nth-of-type(3)').show().find('input').attr('type', 'search').attr('required', true);
					} else {
						$('ul.editable:nth-of-type(3)').hide().find('input').val(undefined).attr('required', false);
						$('ul.editable:nth-of-type(3)').find('button.show.valor2').hide();
					}

					if (ui.item.is_numeric)
						$('ul.editable:nth-of-type(3)').show().find('input').attr('type', 'text').attr('required', true).number(true, currency.decimals, ',', '.');
					if (ui.item.is_text)
						$('ul.editable:nth-of-type(3)').show().find('input').attr('type', 'text').attr('required', true);

				} else {
					$('ul.editable:nth-of-type(3)').hide().find('input').val(undefined).attr('required', false);
				}

				return false;
			}

		}).data('ui-autocomplete')._renderItem = function(ul, item) {
			return $('<li><a><span>' + item.text + '</span></a></li>').appendTo(ul);
		};


	// $('table.items').on('focus', 'input', function(event) {
	// 	$(this).data('old-value', $(this).val());
	// });

	// Condiciones (formas) de pago

	if ($('input[name="cotizacion[condiciones][forma_pago]"]').length > 0)
		$('input[name="cotizacion[condiciones][forma_pago]"]').autocomplete({
			source: function(request, response) {
				$.ajax({
					url: '/4DACTION/_V3_' + 'getFormaPagos', // FIXME: debe ir en singular
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
			autoFocus: true,
			delay: 5,
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
				// revisar
				$('input[name="cotizacion[condiciones][forma_pago]"]').val(ui.item.text).data('id', ui.item.id);
				return false;
			}

		}).data('ui-autocomplete')._renderItem = function(ul, item) {
			return $('<li><a>' + item.text + '</a></li>').appendTo(ul);
		};

	// Condiciones (formas) de pago

	if ($('input[name="cotizacion[condiciones][validez]"]').length > 0)
		$('input[name="cotizacion[condiciones][validez]"]').autocomplete({
			source: function(request, response) {
				var data = {
					rows: [
						{ text: '5 días hábiles' },
						{ text: '10 días hábiles' },
						{ text: '15 días hábiles' },
						{ text: '20 días hábiles' },
						{ text: '25 días hábiles' },
						{ text: '30 días hábiles' }
					]
				};
				response($.map(data.rows, function(item) {
					return item;
				}));
			},
			minLength: 0,
			autoFocus: true,
			delay: 5,
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
				// revisar
				$('input[name="cotizacion[condiciones][validez]"]').val(ui.item.text).data('id', ui.item.id);
				return false;
			}

		}).data('ui-autocomplete')._renderItem = function(ul, item) {
			return $('<li><a>' +  item.text + '</a></li>').appendTo(ul);
		};

	/*$('table.items > *').on('focus', 'tr input[name="item[][codigo]"], tr input[name="item[][nombre]"]', function(event) {
		$(this).data('old-value', $(this).val());
	});*/


	$('input[name^="cotizacion"]').keypress(function(event) {

		if (event.charCode == 13) {
			var nextSibling = $("input:visible,textarea:visible")[$("input:visible,textarea:visible").index() + 1];
			nextSibling.focus();
			return false;
		}

	});


	$('table.items > *').delayed('change', 1000, 'tr:not(.title) input', {}, function(event) {
		var target = $(this).parentTo('tr');
		var tuple = {};

		var fields = {
			id: target.data('id'),
			index: target.data('index'),
			fk: $('section.sheet').data('id'),
			username: target.data('username'),
			parent: target.prevTo('.title').data('jerarquia')
		};

		//eval("tuple = { '" + $(this).attr('name') + "': '" + $(this).val() + "' };");
		tuple[$(this).attr('name')] = (!$(this).attr('type') == 'checkbox')? $(this).val() : $(this).prop('checked');

		$.extend(fields, fields, tuple);

		var element = this;

		$.ajax({
			url: '/4DACTION/_V3_setUsuarioRVByRV',
			dataType: 'json',
			data: fields,
			//async: false,
			cache: false,
			success: function(data) {
				target.data('id', data.id);
				target.data('index', data.index);
			},
			error: function() {
				toastr.error('No se pudo guardar el item');
				$(element).val($(element).data('old-value'));
			}
		});
	});


	$('table.items > tbody').on('keypress', 'tr input', function(event) {
		var target = $(this).parentTo('tr');
		switch(event.keyCode) {
			case 13:
				if (event.shiftKey) {
					if (target.prev().length > 0)
						target.prev().find('[name="item[][nombre]"]').focus();
				} else {
					if (target.next().length > 0)
						target.next().find('[name="item[][nombre]"]').focus();
					else {
						if (target.find('[name="item[][nombre]"]').val()) {
							if (target.hasClass('title'))
								target.find('button.add.item').click();
							else
								target.prevTo('.title').find('button.add.item').click();
						}
					}
				}
				break;
			case 10:
				target.prevTo('.title').find('button.add.item').click();
				break;
		}
	});

	$('table.items > tbody').on('focus', 'button', function(event) {
		$.emulateTab();
	});

	$('table.items > tbody').on('focus', 'tr input[readonly]', function(event) {
		// FIXME: revisar, ya que al hacer tab hacia atrás no está permitiendo que se seleccione un campo previo
		var target = $(this).parentTo('tr');
		if (target.next().length > 0)
			$.emulateTab();
		else {
			// revisar
			//target.prevUntil('[data-categoria]').last().prev().find('button').eq(2).click();
		}
	});


	// Se carga el detalle al ingresar a la vista
	getDetail();

	var showHelp = function() {
		$('[data-help]').each(function() {
			$(this).qtip({
				content: {
					text: $(this).data('help')
				}
			}).on('click focus', function() {
				//$(this).qtip('hide').qtip('disable');
				$(this).qtip('hide');
			})
			$(this).qtip('show');
		});

		$('section.sheet').bind('scroll mousewheel', function() {
			$('[data-help]').each(function() {
				$(this).qtip('hide');
			});
			$('section.sheet').unbind('scroll mousewheel');
		});
	};

	var hideHelp = function() {
		$('[data-help]').each(function() {
			$(this).qtip('hide');
			//$(this).qtip('disable');
		});
	};

	if ($('section.sheet').data('new')) {
		setTimeout(showHelp, 1000);
	};

	unaBase.ui.expandable.init();
	

	function toggleCategoriaNegocioByText(textoRegla) {
    const categoria = $('.categoria-negocio');

    if (textoRegla === "Gastos - Emisión") {
        const selector = '#input-categoria-negocio';

        categoria.show();

        // Evitar re-inicializar TomSelect si ya existe
        const el = document.querySelector(selector);
        if (el && !el.tomselect) {
            setTimeout(() => {
                initializeTomSelectValidationItems(selector);
            }, 100);
        }
    } else {
        categoria.hide();
    }
}

	const criterioInput = $("input[name='regla_validacion[criterio]']");
	toggleCategoriaNegocioByText(criterioInput.val());
	
	// Mostrar el campo de valores si el criterio es distinto al primero
	if ($('input[name="regla_validacion[criterio]"]').data('id') > 1) {
		$('ul.editable:nth-of-type(2)').show();
		$('ul.editable:nth-of-type(3)').show();
	}

});
