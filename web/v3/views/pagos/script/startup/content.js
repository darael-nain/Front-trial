$(document).ready(function() {

	$('section.sheet').find('tfoot .numeric.currency input').number(true, currency.decimals, ',', '.');
	$('section.sheet').find('tfoot .numeric.percent input').number(true, 2, ',', '.');
	$('section.sheet').find('footer .numeric.currency input').number(true, currency.decimals, ',', '.');
	$('section.sheet').find('footer .numeric.percent input').number(true, 2, ',', '.');

	unaBase.toolbox.init();

	unaBase.toolbox.menu.init({
		entity: 'Cotizacion', // especifica entidad sobre la cual se almacenan los datos
							  // y nombre para referenciar los views
		// acá se envía la data que debe validar la API al presionar el botón save
		// y enviar en caso de ser válida
		buttons: [ 'save', 'delete', 'clone_current', 'convert_negocio', 'discard', 'exit', 'preview', 'share', 'template' ],
		data: function() {
			var tuple = {};
			var fields = {
				id: $('section.sheet').data('id'),
				index: $('section.sheet').data('index'),
				text: $('input[name="cotizacion[titulo][text]"]').val(),
				empresa: $('input[name="cotizacion[empresa][id]"]').data('id'),
				contacto: $('input[name="cotizacion[empresa][contacto][id]"]').data('id'),
				ejecutivo: $('input[name="cotizacion[ejecutivo][id]"]').data('id'),
				area_negocio: $('input[name="cotizacion[area_negocio]"]').data('id'),
				readonly: $('section.sheet').data('readonly'),
				'cotizacion[precios][subtotal]': $('input[name="cotizacion[precios][subtotal]"]').val(),
				'cotizacion[costos][subtotal]': $('input[name="cotizacion[costos][subtotal]"]').val(),
				'cotizacion[utilidades][subtotal]': $('input[name="cotizacion[utilidades][subtotal]"]').val(),
				'cotizacion[costos][subtotal]': $('input[name="cotizacion[costos][subtotal]"]').val(),
				'cotizacion[margenes][margen_venta]': $('input[name="cotizacion[margenes][margen_venta]"]').val(),
				'cotizacion[margenes][margen_compra]': $('input[name="cotizacion[margenes][margen_compra]"]').val(),
				'cotizacion[descuento][porcentaje]': $('input[name="cotizacion[descuento][porcentaje]"]').val().replace('.',','),
				'cotizacion[descuento][valor]': $('input[name="cotizacion[descuento][valor]"]').val(),
				'cotizacion[montos][impuesto]': $('input[name="cotizacion[montos][impuesto]"]').val(),
				'cotizacion[montos][impuesto][exento]': $('input[name="cotizacion[montos][impuesto][exento]"]').prop('checked'),
				'cotizacion[montos][subtotal_neto]': $('input[name="cotizacion[montos][subtotal_neto]"]').val(),
				'cotizacion[montos][total]': $('input[name="cotizacion[montos][total]"]').val(),
				'cotizacion[condiciones][forma_pago]': $('input[name="cotizacion[condiciones][forma_pago]"]').data('id'),
				'cotizacion[condiciones][validez]': $('input[name="cotizacion[condiciones][validez]"]').val(),
				'cotizacion[condiciones][fecha_entrega]': $('input[name="cotizacion[condiciones][fecha_entrega]"]').val(),
				'cotizacion[condiciones][notas]': $('[name="cotizacion[condiciones][notas]"]').val(),
				'cotizacion[montos][utilidad]': $('input[name="cotizacion[montos][utilidad]"]').val(),
				'cotizacion[montos][utilidad_ratio]': $('input[name="cotizacion[montos][utilidad_ratio]"]').val(),
				'cotizacion[montos][costo]': $('input[name="cotizacion[montos][costo]"]').val(),
				'cotizacion[montos][costo_ratio]': $('input[name="cotizacion[montos][costo_ratio]"]').val()
			};

			// se guardan los sobrecargos

			$('section.sheet section.sobrecargos ul li').each(function() {
				var fields = {
					id: $(this).data('id'),
					fk: $('section.sheet').data('id'),
					porcentaje: parseFloat($(this).find('[name^="sobrecargo"][name$="[porcentaje]"]').val()),
					valor: parseFloat($(this).find('[name^="sobrecargo"][name$="[valor]"]').val()),
					cerrado: $(this).find('[name^="sobrecargo"][name$="[cerrado]"]').prop('checked')
				};

				$.ajax({
					url: '/4DACTION/_V3_setSobrecargoByCotizacion',
					dataType: 'json',
					data: fields,
					async: false, // ver que pasa si se saca
					cache: false,
					success: function(data) {
					},
					error: function() {
						toastr.error('No se pudo guardar el sobrecargo');
						// manejar esta situación
					}
				});
			});

			return fields;
		},
		validate: function() {
			//updateIndexes();
			// Acá se definen las reglas de validación

			var isValidEmpresa = true;
			$('input[name^="cotizacion[empresa]"][required]').not('[name^="cotizacion[empresa][contacto]"]').not('[type="checkbox"]').each(function() {
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
			$('input[name^="cotizacion[ejecutivo]"]').each(function(key) {
				if ($(this).val() == '') {
					isValidEjecutivo = false;
					//$(this).addClass('invalid');
					$(this).invalid();
				} //else
					//$(this).removeClass('invalid');
			});


			var isValidAreaNegocio = true;
			$('input[name^="cotizacion[area_negocio]"]').each(function() {
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


	if ($('section.sheet').data('index') == -1)
		unaBase.toolbox.menu.buttons([ 'save', 'delete', 'exit', 'preview' ]);
	else {
		if ($('section.sheet').data('index') == 0)
			unaBase.toolbox.menu.buttons([ 'save', 'exit', 'preview' ]);
		else
			unaBase.toolbox.menu.buttons([ 'save', 'clone_current', 'convert_negocio', 'discard', 'exit', 'share', 'preview', 'template' ]);
	}

	// FIXME: Disminuir lag en opción Obtener, quitando el autoguardado de indices (queda comentado)
	/*$('.toolbox > ul > li > button').click(function() {
		updateIndexes();
	});*/

	if (
		$('input[name="cotizacion[empresa][id]"]').val() == '' &&
		$('input[name="cotizacion[empresa][razon_social]"]').val() == ''
	)
		$('button.empresa').hide();

	if (
		$('input[name="cotizacion[empresa][contacto][id]"]').val() == ''
	)
		$('button.contacto').hide();

	var maskRut = function(selector) {
		selector.on('change blur focus', function() {
			$(this).val(
				unaBase.data.rut.format(
					$(this).val()
				)
			);
		});

	};

	var unmaskRut = function(selector) {
		selector.unbind('change blur focus');
	};


	// Oculta botones en ambos lados
	$('button.edit').hide();

	$('input[name="cotizacion[empresa][rut][validate]"]').change(function(event) {
		var checked = $(this).prop('checked');
		if (checked)
			maskRut($('input[name="cotizacion[empresa][rut]"]'));
		else
			unmaskRut($('input[name="cotizacion[empresa][rut]"]'));
		$('input[name="cotizacion[empresa][rut]"]').change();
	});

	$('button.unlock.empresa').button({
		icon: {
			primary: 'ui-icon-unlocked'
		},
		text: false
	}).click(function() {
		var target = $(this).parentTo('ul');
		
		target.find('input[type="search"][name^="cotizacion[empresa]"]').each(function(key, item) {
			try {
				$(item).autocomplete('disable');
			} catch(e) { }
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

	$('button.profile.empresa').click(function() {
		unaBase.loadInto.dialog('/v3/views/contactos/pop_perfil.shtml?id=' + $('input[name="cotizacion[empresa][id]"]').data('id'), 'Perfil de Empresa', 'large');
	});

	$('button.show.area-negocio').click(function() {
		var target = $(this).parentTo('ul');
		target.find('input[name="cotizacion[area_negocio]"][type="search"]').autocomplete('search', '@').focus();
	});

	$('button.show.ejecutivo').click(function() {
		var target = $(this).parentTo('ul');
		target.find('input[name="cotizacion[ejecutivo][id]"][type="search"]').autocomplete('search', '@').focus();
	});

	$('button.show.contacto').click(function() {
		var target = $(this).parentTo('ul');
		target.find('input[name="cotizacion[empresa][contacto][id]"][type="search"]').autocomplete('search', '@').focus();
	});

	$('button.show.forma-pago').click(function() {
		var target = $(this).parentTo('ul');
		target.find('input[name="cotizacion[condiciones][forma_pago]"][type="search"]').autocomplete('search', '@').focus();
	});

	$('button.show.validez').click(function() {
		var target = $(this).parentTo('ul');
		target.find('input[name="cotizacion[condiciones][validez]"][type="search"]').autocomplete('search', '@').focus();
	});

	$('button.unlock.contacto').click(function() {
		var target = $(this).parentTo('ul');

		target.find('input[name^="cotizacion[empresa][contacto]"][type="search"]').each(function(key, item) {
			// Intentamos deshabilitar el autocomplete, si el campo lo permite
			try {
				$(item).autocomplete('disable');
			} catch(e) {
				// Si no se puede deshabilitar, se deja pasar la excepción
			}
		});

		target.find('input[name^="cotizacion[empresa][contacto]"]').not('[type="search"]').removeAttr('readonly');
		target.find('input[name^="cotizacion[empresa][contacto]"][type="search"]').removeAttr('placeholder').attr('type', 'text');

		target.find('button.show.contacto, button.unlock.contacto, button.profile.contacto').hide();
		target.find('button.edit.contacto').show();
		target.find('input[name="cotizacion[empresa][contacto][id]"]').focus();
	});

	$('button.profile.contacto').click(function() {
		unaBase.loadInto.dialog('/v3/views/contactos/pop_perfil.shtml?id=' + $('[name="cotizacion[empresa][contacto][id]"]').data('id'), 'Perfil de Contacto', 'large');
	});




	$('button.edit.save.empresa').click(function(event) {
		var element = this;
		var fields = {};
		var validate = true;
		$('input[name^="cotizacion[empresa]"').not('[type="checkbox"]').not('input[name^="cotizacion[empresa][contacto]"]').removeClass('invalid');
		$('input[name^="cotizacion[empresa]"').not('input[name^="cotizacion[empresa][contacto]"]').each(function() {
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


		// se guardan los datos
		if (validate)
			$.ajax({
				url: '/4DACTION/_V3_setEmpresa',
				dataType: 'json',
				data: fields,
				success: function(data) {
					if (data.success) {
						if (data.new)
							toastr.info('Empresa creada!');
						else
							toastr.info('Empresa modificada!');
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

	$('button.edit.discard.empresa').click(function(event) {
		var element = this;
		confirm('¿Desea descartar los cambios?').done(function(data) {
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
					success: function(data) {
						$.map(data.rows, function(item) {
							target.find('input[name="cotizacion[empresa][id]"]').val(item.text);
							target.find('input[name="cotizacion[empresa][razon_social]"]').val(item.razon_social);
							target.find('input[name="cotizacion[empresa][rut]"]').val((item.rut_validar)? unaBase.data.rut.format(item.rut) : item.rut);
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

	// botones contacto
	$('button.edit.save.contacto').click(function() {
		var element = this;
		var fields = {
			fk: $('input[name="cotizacion[empresa][id]"]').data('id')
		};
		$('input[name^="cotizacion[empresa][contacto]"').each(function() {
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

		// se guardan los datos
		$.ajax({
			url: '/4DACTION/_V3_setContactoByEmpresa',
			dataType: 'json',
			data: fields,
			success: function(data) {
				if (data.success) {
					if (data.new)
						toastr.info('Contacto creado!');
					else
						toastr.info('Contacto modificado!');
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
					//$('input[name="cotizacion[empresa][contacto][id]"]').parent().parent().find('button').click();
					// FIXME: colocar garbage collector, delete element
				}
			},
			error: function(xhr, text, error) {
				toastr.error('Falló conexión al servidor.');
				//$('input[name="cotizacion[empresa][contacto][id]"]').parent().parent().find('button').click();
			}
		});
	});

	$('button.edit.discard.contacto').click(function(event) {
		var element = this;
		confirm('¿Desea descartar los cambios?').done(function(data) {
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
					success: function(data) {
						$.map(data.rows, function(item) {
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

	$('section.sheet > table > tbody').on('click', 'tr:not(.title) button.remove.item', function() {
		var element = this;
		var title = $(element).parentTo('tr').prevTo('.title');
		if ($(element).parentTo('tr').data('id')) {
			$.ajax({
				url: '/4DACTION/_V3_removeItem',
				async: false,
				dataType: 'json',
				data: {
					id: $(this).parentTo('tr').data('id')
				},
				success: function(data) {
					if (data.success) {

						$(element).parentTo('tr').fadeOut(400, function() {
							$(this).remove();
							updateSubtotalTitulos(title);
							updateSubtotalItems();
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
			updateSubtotalTitulos(title);
			updateSubtotalItems();
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
						/*$.ajax({
							url: '/4DACTION/_V3_removeItem',
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
						});*/
						current.fadeOut(400, function() {
							$(this).remove();
						});
					}

					countItems--;
					current = current.next();
				} while(countItems > 0);

				unaBase.ui.unblock();
			}

			/*if (hasStatus.success) {
				if (!hasStatus.opened)
					toastr.warn('Algunos items ya no existían, probablemente fueron removidos antes por otro usuario. Se quitaron de todos modos');
				if (title.data('id')) {
					if (countItems == 0) {
						$.ajax({
							url: '/4DACTION/_V3_removeItem',
							dataType: 'json',
							async: false, // debe bloquear esperando hasta completar la acción
							data: {
								id: title.data('id')
							},
							success: function(data) {
								if (data.success)
									title.fadeOut(400, function() {
										$(this).remove();
										updateSubtotalItems();
									});
								else {
									hasStatus.success = false;
									if (data.opened) {
										if (!data.readonly)
											hasStatus.readonly = false;
									} else {
										hasStatus.opened = false;
										title.fadeOut(400, function() {
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
				} else
					title.fadeOut(400, function() {
						$(this).remove();
					});
			} else {
				if (hasStatus.readonly)
					toastr.warn('No fue posible quitar el título, ya que hay items dentro de él que no se pudieron quitar por encontrarse bloqueados.');
				else
					toastr.error('No fue posible quitar el título, posiblemente debido a un error de conexión.');
			}*/
			title.fadeOut(400, function() {
				$(this).remove();
			});
		};

		if (countItems > 0)
			confirm('¿Desea quitar el título y todos los items dentro del título?').done(function(data) {
				if (data)
					removeTitle();
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
		//No debería guardar automáticamente
		//updateIndexes();
	});

	$('section.sheet > table > tbody').on('click', 'button.add.categoria', function() {
		var current = $(this).parentTo('tr');
		while(!(current.next().html() == undefined || current.next().find('th').length > 0)) {
			current = current.next();
		}
		//getElement.titulo().insertAfter(current).find('input[name="item[][nombre]"]').focus();
		getElement.titulo('insertAfter', current).find('input[name="item[][nombre]"]').focus();
		//No debería guardar automáticamente
		//updateIndexes();
	});

	$('section.sheet > table > tbody').on('click', 'button.add.item', function() {
		var current = $(this).parentTo('tr');
		if (current.find('button.toggle.categoria').hasClass('ui-icon-folder-collapsed'))
			current.find('button.toggle.categoria').triggerHandler('click');
		while(!(current.next().html() == undefined || current.next().find('th').length > 0)) {
			current = current.next();
		}
		//getElement.item().insertAfter(current).find('input[name="item[][nombre]"]').focus();
		getElement.item('insertAfter', current).find('input[name="item[][nombre]"]').focus();
		//No debería guardar automáticamente
		//updateIndexes();
	});

	$('section.sheet > table > tbody').on('click', 'button.profile.categoria', function() {
		$('#dialog-profile').dialog('open');
	});

	$('section.sheet > table > tbody').on('click', 'button.detail.item', function(event) {
		saveRow(event);
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
			//{ local: 'cotizacion[empresa][razon_social]', remote: 'razon_social', type: 'search' },
			{ local: 'cotizacion[empresa][razon_social]', remote: 'razon_social', type: 'text' },
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
			if ($(this).val() == '') {
				$('button.empresa').hide();
				target.find('input').not(this).val('');
			}

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
					default: true,
					strict: true
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

					target.find('button.unlock.contacto, button.profile.contacto, button.show.contacto').show();

					/*target.find('button.unlock.contacto').show();
					target.find('button.profile.contacto').show();*/
					target.find('button.edit.contacto').hide();
				}
			});

			return false;
		},
		renderItem: function(ul, item) {
			return $('<li><a><strong class="highlight">' + ((item.text)? item.text : '[Sin Alias]') + '</strong><em>' + ((item.rut_validar)? unaBase.data.rut.format(item.rut) : item.rut) + '</em><span>' + item.razon_social + '</span></a></li>').appendTo(ul);
		}
	});

	// Se deshabilita para poder buscar solo desde el alias, no de la razón social
	/*
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
	*/

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
			var element;
			if (item.empresa.id == $('input[name="cotizacion[empresa][id]"]').data('id'))
				element = $('<li><a><strong class="highlight">' + item.nombre_completo + '</strong><em>' + item.cargo + '</em><span>' + item.email + '</span></a></li>').appendTo(ul);
			else
				element = $('<li><a><strong class="highlight">' + item.nombre_completo + '</strong><em>[Sin asociar]</em><span>' + item.email + '</span></a></li>').appendTo(ul);
			return element;
		}
	});


	if ($('input[name="cotizacion[ejecutivo][id]"]').length > 0)
		$('input[name="cotizacion[ejecutivo][id]"]').autocomplete({
			source: function(request, response) {
				$.ajax({
					url: '/4DACTION/_V3_' + 'getUsuario',
					dataType: 'json',
					data: {
						q: request.term,
						ejecutivo: true
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
				$('input[name="cotizacion[ejecutivo][id]"]').val(ui.item.nombres + ' ' + ui.item.ap_pat + ((ui.item.ap_mat)? ' ' + ui.item.ap_mat : ''));
				$('input[name="cotizacion[ejecutivo][id]"]').data('id', ui.item.id);
				return false;
			}

		}).data('ui-autocomplete')._renderItem = function(ul, item) {
			return $('<li><a><strong class="highlight">' +  item.ap_pat + ((item.ap_mat)? ' ' + item.ap_mat : '') + ', ' + item.nombres + '</strong><em>' + item.cargo + '</em><span>' + item.email + '</span></a></li>').appendTo(ul);
		};

	// área de negocio
	if ($('input[name="cotizacion[area_negocio]"]').length > 0)
		$('input[name="cotizacion[area_negocio]"]').autocomplete({
			source: function(request, response) {
				$.ajax({
					url: '/4DACTION/_V3_' + 'getAreaNegocio',
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
				$('input[name="cotizacion[area_negocio]"]').val(ui.item.text);
				$('input[name="cotizacion[area_negocio]"]').data('id', ui.item.id);
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


	//$('table.items > *').delayed('change', 1000, 'tr input', {}, saveRow);

	
	// TEST: ver si esto influye en la demora o no
	//$('table.items > tbody').on('blur', 'tr > td.numeric input', updateRow);
	//$('table.items > tbody').on('change', 'tr > td input[type="checkbox"]', updateRow);

	//$('table.items > tbody').delayed('blur', 1, 'tr > td.numeric input', {}, updateRow);
	//$('table.items > tbody').delayed('blur', 1, 'tr > td input[type="checkbox"]', {}, updateRow);
	$('table.items > tbody').delayed('blur', 1, 'td input', {}, function(event) {
		if (!$(this).prop('readonly')) {
			if ($(this).parentTo('td').hasClass('numeric') || $(this).prop('type') == 'checkbox') {
				//$.proxy(updateRow, this, event);
				updateRow(event);
			}/* else {
				//$.proxy(saveRow, this, event);
				saveRow(event);
			}*/
			else {

				if ($(this).parentTo('tr').find('[name="item[][nombre]"]').val() == '')
					$(this).parentTo('tr').data('producto', null);					

				if (!$(this).parentTo('tr').data('producto')) {
					$(this).parentTo('tr').find('[name="item[][nombre]"]').removeClass('edited').data('nombre-original', null);
					$(this).parentTo('tr').find('input').val('');
					// FIXME: línea repetida de código (?)
					$(this).parentTo('tr').find('input').val('');
					$(this).parentTo('tr').find('input[name="item[][cantidad]"]').val(1);
					$(this).parentTo('tr').find('input[name="item[][factor]"]').val(1);
				}

				// has_change y todo lo relacionado se puso acá poque ahora la comprobación ya no se hace al guardar
				var has_change =
				(
					$(this).parentTo('tr').find('[name="item[][nombre]"]').val() != $(this).parentTo('tr').find('[name="item[][nombre]"]').data('nombre-original')
				) && (
					$(this).parentTo('tr').find('[name="item[][nombre]"]').data('nombre-original') != ''
				);

				if (has_change) {
				
					// Antes, se permitían los ítems con nombre custom
					/*$$(element).parentTo('tr').find('input').val('');;*/

					/*
					// A partir de ahora (2014-04-22), se deben restringir y rechazar
					if (!$(element).parentTo('tr').hasClass('title')) {
						$(element).parentTo('tr').find('[name="item[][nombre]"]').removeClass('edited').data('nombre-original', null);
						$(element).parentTo('tr').find('input').val('');
						$(element).parentTo('tr').find('input').val('');
						$(element).parentTo('tr').find('input[name="item[][cantidad]"]').val(1);
						$(element).parentTo('tr').find('input[name="item[][factor]"]').val(1);
					}
					*/

					// (2014-05-07) se deben permitir en la medida que no sea un nombre ingresado por primera vez al ítem

					//if (!$(element).parentTo('tr').hasClass('title') && !$(element).parentTo('tr').find('[name="item[][nombre]"]').hasClass('edited')) {
					//if (!$(element).parentTo('tr').hasClass('title') && !$(element).parentTo('tr').data('producto')) {

					if (!$(this).parentTo('tr').hasClass('title')) {
						if (!$(this).parentTo('tr').data('producto')) {
							// FIXME: puede que el código dentro de este IF jamás se ejecute
							// fue reubicado más arriba. Si funciona el de arriba, esta porción de código
							// se debe eliminar
							/*
							$(this).parentTo('tr').find('[name="item[][nombre]"]').removeClass('edited').data('nombre-original', null);
							$(this).parentTo('tr').find('input').val('');
							// FIXME: línea repetida de código (?)
							$(this).parentTo('tr').find('input').val('');
							$(this).parentTo('tr').find('input[name="item[][cantidad]"]').val(1);
							$(this).parentTo('tr').find('input[name="item[][factor]"]').val(1);
							*/
							
						} else
							$(this).parentTo('tr').find('[name="item[][nombre]"]').addClass('edited');
					}

				} else
					$(this).parentTo('tr').find('[name="item[][nombre]"]').removeClass('edited');
			}
		}
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

	// FIXME: problema de incompatibilidad con cálculo automático de gasto presupuestado
	/*$('table.items > tbody').on('focus', 'tr input[readonly]', function(event) {
		// FIXME: revisar, ya que al hacer tab hacia atrás no está permitiendo que se seleccione un campo previo
		var target = $(this).parentTo('tr');
		if (target.next().length > 0)
			$.emulateTab();
		else {
			// revisar
			//target.prevUntil('[data-categoria]').last().prev().find('button').eq(2).click();
		}
	});*/


	$('section.sheet footer').on('blur', '[name^="sobrecargo"][name$="[porcentaje]"]', function() {
		// Si el porcentaje se puede modificar, el cambio se propaga de manera normal
		if (!$(this).prop('readonly'))
			updateSobrecargos();
		/*$(this).parentTo('li').find('[name^="sobrecargo"][name$="[valor]"]').triggerHandler('focus');*/
	});

	/*$('section.sheet footer').on('focus', '[name^="sobrecargo"][name$="[valor]"]', function() {
		// FIXME: ver opción de almacenar la base del sobrecargo en otro lado, quizá en el li en donde reside
		// porque si el valor de sobrecargo es 0, el editor de porcentaje deja de servir
		$(this).data('old-value', parseFloat($(this).val()).toFixed(0));
	});*/

	$('section.sheet footer').on('change', '[name^="sobrecargo"][name$="[valor]"]', function() {
		$(this).validateNumbers();
		var valor_sobrecargo_anterior = parseFloat($(this).data('old-value'));
		var valor_sobrecargo_actual = parseFloat($(this).val());
		if (valor_sobrecargo_anterior != valor_sobrecargo_actual) {
			var base_total_sobrecargo = parseFloat($('input[name="cotizacion[montos][subtotal_neto]"]').val());
			//var porcentaje_sobrecargo = valor_sobrecargo_actual / base_total_sobrecargo;
			var porcentaje_sobrecargo = 0;
			if ($(this).parentTo('li').find('[name^="sobrecargo"][name$="[porcentaje]"]').prop('readonly')) {
				//var subtotal_sobrecargo = parseFloat($(this).parentTo('li').find('[name^="sobrecargo"][name$="[subtotal]"]').val());
				var subtotal_sobrecargo_previo = ($(this).parentTo('li').prev().length)? $(this).parentTo('li').prev().find('[name^="sobrecargo"][name$="[subtotal]"]').val() : $('input[name="cotizacion[precios][subtotal]"]').val();
				porcentaje_sobrecargo = (valor_sobrecargo_actual / subtotal_sobrecargo_previo) * 100;
			} else
				porcentaje_sobrecargo = (valor_sobrecargo_actual / base_total_sobrecargo) * 100;

			// // Si el porcentaje se puede modificar, el cambio se propaga de manera normal
			// // De lo contrario, se debe calcular automáticamente

			// //if (!$(this).parentTo('li').find('[name^="sobrecargo"][name$="[porcentaje]"]').prop('readonly'))
			// //	$(this).parentTo('li').find('[name^="sobrecargo"][name$="[porcentaje]"]').val(porcentaje_sobrecargo.toFixed(2));
			// //else
			$(this).parentTo('li').find('[name^="sobrecargo"][name$="[porcentaje]"]').val(porcentaje_sobrecargo.toFixed(2));

			updateSobrecargos();
		}
		$(this).triggerHandler('focus');

		// Cuando se cambia el sobrecargo asociado a ajuste, se debe tocar el valor del descuento
		// para actualizar el ratio

		if ($(this).parentTo('li').find('[name^="sobrecargo"][name$="[porcentaje]"]').prop('readonly'))
			$('[name="cotizacion[descuento][valor]"]').triggerHandler('blur');
	});

	// Se revisa ajuste si es que se modifica el "cerrado" del quinto sobrecargo
	$('section.sheet footer').on('change', 'li[data-ajuste="true"] [name^="sobrecargo"][name$="[cerrado]"]', function() {
		checkAjuste(true);
	});

	$('section.sheet footer').on('change', '[name^="sobrecargo"][name$="[cerrado]"]', function() {
		updateSobrecargos();
	});

	//$('[name="cotizacion[descuento][porcentaje]"]').on('blur change', function() {
	$('[name="cotizacion[descuento][porcentaje]"]').on('blur', function() {
		//$(this).validateNumbers();
		var subtotal_precios = parseFloat($('[name="cotizacion[precios][subtotal]"]').val());
		var subtotal_sobrecargos = parseFloat($('[name="cotizacion[sobrecargos][subtotal]"]').val());
		var porcentaje_descuento = parseFloat($(this).val());

		var valor_descuento = (subtotal_precios + subtotal_sobrecargos) * porcentaje_descuento / 100;
		$('[name="cotizacion[descuento][valor]"]').val(valor_descuento.toFixed(currency.decimals));

		updateSubtotalNeto();
	});

	//$('[name="cotizacion[descuento][valor]"]').on('blur change', function() {
	$('[name="cotizacion[descuento][valor]"]').on('blur', function() {
		$(this).validateNumbers();
		var subtotal_precios = parseFloat($('[name="cotizacion[precios][subtotal]"]').val());
		var subtotal_sobrecargos = parseFloat($('[name="cotizacion[sobrecargos][subtotal]"]').val());
		var valor_descuento = parseFloat($(this).val());

		var porcentaje_descuento = valor_descuento/ (subtotal_precios + subtotal_sobrecargos) * 100;
		$('[name="cotizacion[descuento][porcentaje]"]').val(porcentaje_descuento.toFixed(2));

		updateSubtotalNeto();
	});

	
	/*
	$('[name="cotizacion[ajuste]"]').on('blur', function() {
		$(this).validateNumbers();

		var valor_ajuste = parseFloat($(this).val());

		var subtotal_neto = 0;
		var diferencia_ajuste = 0;
		if (!$(this).data('value'))
			$('input[name="cotizacion[montos][subtotal_neto]"]').data('value', parseFloat($('input[name="cotizacion[montos][subtotal_neto]"]').val()));

		diferencia_ajuste = valor_ajuste - parseFloat($('input[name="cotizacion[montos][subtotal_neto]"]').data('value'));

		if (diferencia_ajuste >= 0) {

			$(this).data('value', diferencia_ajuste);
			var test = $(this).data('value');
			toastr.info('Diferencia ajuste: ' + diferencia_ajuste);

			$('[name="cotizacion[montos][subtotal_neto]"]').val(valor_ajuste);

			//updateSubtotalNeto();
		} else {
			$(this).val($('input[name="cotizacion[montos][subtotal_neto]"]').data('value'));
			toastr.warning('El valor del ajuste debe ser igual o mayor al total neto.');
		}
	});
	*/

	$('[name="cotizacion[ajuste]"]').on('blur', function(event) {
		if (typeof event.originalEvent != 'undefined') {
			unaBase.ui.block();

			$(this).data('target-value', parseFloat($(this).val()));
			$(this).data('iterations', parseFloat(1));
		} else
			$(this).data('iterations', parseFloat($(this).data('iterations')) + 1);

		$(this).validateNumbers();

		var valor_ajuste = parseFloat($(this).val());
		var subtotal_neto = parseFloat($('input[name="cotizacion[montos][subtotal_neto]"]').val());
		var sobrecargo = parseFloat($('section.sobrecargos li[data-ajuste="true"] input[name$="[valor]"]').val());

		//var subtotal_neto = parseFloat($('input[name="cotizacion[ajuste]"]').val());
		var diferencia_ajuste = valor_ajuste - subtotal_neto + sobrecargo;

		if (diferencia_ajuste > 0) {
			$('button.reset.ajuste').show();
			$('[name="cotizacion[montos][subtotal_neto]"]').addClass('ajustado');
		} else {
			$('button.reset.ajuste').hide();
			$('[name="cotizacion[montos][subtotal_neto]"]').removeClass('ajustado');
		}

		if (typeof event.originalEvent != 'undefined')
			$(this).data('first-value', diferencia_ajuste);

		//if (diferencia_ajuste >= 0) {
		if (sobrecargo >= 0) {
			$('[name="cotizacion[montos][subtotal_neto]"]').addClass('ajustado');

			$(this).data('value', diferencia_ajuste);

			if (diferencia_ajuste > 0)
				$('[name="cotizacion[montos][subtotal_neto]"]').addClass('ajustado');
			else
				$('[name="cotizacion[montos][subtotal_neto]"]').removeClass('ajustado');
			//toastr.info('Diferencia ajuste: $' + diferencia_ajuste);

			$('section.sobrecargos li[data-ajuste="true"] input[name$="[valor]"]').val($(this).data('value')).trigger('change');
			$('[name="cotizacion[ajuste][diferencia]"]').val($(this).data('value'));

			if (parseFloat($(this).val()) != parseFloat($(this).data('target-value'))) {
				if ($(this).data('iterations') <= 24)
					$(this).val($(this).data('target-value')).triggerHandler('blur');
				else {
					unaBase.ui.unblock();
					$('section.sobrecargos li[data-ajuste="true"] input[name$="[valor]"]').val($(this).data('first-value')).trigger('change');
					$('[name="cotizacion[ajuste][diferencia]"]').val($(this).data('first-value'));
					//toastr.warning('No fue posible ajustar el total neto. Número máximo de iteraciones excedido. Ajustando al valor más cercano posible.');
					toastr.warning('Ajustando al valor más cercano posible.');
				}
			} else {
				unaBase.ui.unblock();
				//toastr.info('Diferencia ajuste: $' + diferencia_ajuste);
				//toastr.info('Iteraciones: ' + $(this).data('iterations'));
				if (diferencia_ajuste > 0)
					$('[name="cotizacion[montos][subtotal_neto]"]').addClass('ajustado');
				else
					$('[name="cotizacion[montos][subtotal_neto]"]').removeClass('ajustado');
			}


			// updateSubtotalNeto();
		} else {
			unaBase.ui.unblock();
			$(this).data('value', 0);
			$(this).val($('input[name="cotizacion[montos][subtotal_neto]"]').val());
			toastr.warning('El valor del ajuste debe ser igual o mayor al total neto.');
			$('section.sobrecargos li[data-ajuste="true"] input[name$="[valor]"]').val($(this).data('value')).trigger('change');
			$('[name="cotizacion[ajuste][diferencia]"]').val($(this).data('value'));
			$('[name="cotizacion[montos][subtotal_neto]"]').removeClass('ajustado');
		}

	});

	$('button.reset.ajuste').button({
		caption: 'Restablecer ajuste',
		icons: {
			primary: 'ui-icon-circle-close'
		},
		text: false
	}).click(function() {
		unaBase.ui.block();
		$('section.sobrecargos li[data-ajuste="true"] input[name$="[valor]"]').val(0).trigger('change');
		$('input[name="cotizacion[ajuste][diferencia]"]').val(0);
		unaBase.ui.unblock();
		toastr.info('Ajuste restablecido con éxito.');
		$(this).hide();
		for (var i = 0; i < 24; i++)
			updateSobrecargos();
	});

	$('[name="cotizacion[montos][impuesto][exento]"]').change(function() {
		updateTotal();
	});

	// Se carga el detalle de la cotización al ingresar a la vista
	getDetail();

	updateSubtotalItems(); // primera pasada: actualiza subtotales sin sobrecargos

	var showSobrecargos = function(data) {
		var target = $('section.sobrecargos > ul');
		var htmlObject;
		$.each(data.rows, function(key, item) {
			htmlObject = $(' \
				<li data-id="' + item.id + '"' + ((item.ajuste)? ' data-ajuste="true"': '') + ((item.items)? ' data-items="true"': '') + ((item.total)? ' data-total="true"': '') + '> \
					<span>' + item.nombre + ((item.items)? ' <sup>(*)</sup>' : '') + ((item.total)? ' <sup>(**)</sup>' : '') + '</span> \
					<span class="numeric percent"><input class="' + ((item.costo)? 'costo': 'utilidad') + '" required type="text" name="sobrecargo[' + item.id + '][porcentaje]" value="' + item.porcentaje + '"> %</span> \
					<span class="numeric currency">' + currency.symbol + ' <input class="' + ((item.costo)? 'costo': 'utilidad') + '" readonly type="text" name="sobrecargo[' + item.id + '][valor]" value="' + ((item.id == 5 && !item.costo && item.cerrado.enabled && item.total)? item.valor : (item.porcentaje * parseFloat(((item.items)? $('[name="cotizacion[precios][subtotal]"]').data('aplica-sobrecargo') : $('[name="cotizacion[precios][subtotal]"]').val())) / 100)).toFixed(currency.decimals) + '"></span> \
					<span>Subtotal</span> \
					<span class="numeric currency">' + currency.symbol + ' <input readonly type="text" name="sobrecargo[' + item.id + '][subtotal]" value="0"></span> \
					<span class="option"><label title="Oculta el valor del sobrecargo en la vista de impresión, repartiéndolo entre los ítems afectos."><input type="checkbox" name="sobrecargo[' + item.id + '][cerrado]" value="true"' + ((item.cerrado.enabled)? ' checked': '') + ((!item.cerrado.writable)? ' disabled': '') + '> Cerrado</label></span> \
				</li> \
			');


			htmlObject.find('.numeric.currency input').number(true, currency.decimals, ',', '.');
			htmlObject.find('.numeric.percent input').number(true, 2, ',', '.');
			if (typeof item.valor != 'undefined')
				htmlObject.find('.numeric.currency input').val(item.valor.toFixed(currency.decimals));
			htmlObject.find('.numeric.percent input').val(item.porcentaje.toFixed(2));

			// FIXME: habilitación de los sobrecargos con monto modificable
			/*
			if (item.total)
				htmlObject.find('input[name^="sobrecargo"][name$="[valor]"]').removeAttr('readonly');
			*/

			// Mostrar temporalmente el Ajuste
			if (item.ajuste)
				htmlObject.css('opacity', 0.5).find('.percent').invisible();

			target.append(htmlObject);
		});
		
	};

	// llamada a sobrecargos

	if ($('section.sheet').data('new'))
		$.ajax({
			url: '/4DACTION/_V3_getSobrecargo',
			dataType: 'json',
			async: false, // para que no avance hasta que la llamada se complete
			cache: false,
			data: {
				id: $('section.sheet').data('id')
			},
			success: showSobrecargos
		});
	else
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

	checkAjuste($('section.sheet').data('new')); // se revisa para activar campo de ajuste, según corresponda

	updateSubtotalItems(); // segunda pasada: actualiza los subtotales con sobrecargos

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

	// FIXME: Se deshabilita hasta poder corregirlo
	/* if ($('section.sheet').data('new')) {
		setTimeout(showHelp, 1000);
	}; */

	/* BEGIN: Menú dropdown */
	
	var htmlObject;

	if ($('section.sheet').data('index') == -1)
		htmlObject = $('\
			<ul id="dropdown_menu" class="dropdown-menu" style="position: absolute; top: 49px; right: 13px; z-index: 1000;"> \
				<li><a href="/v3/views/cotizaciones/dialog/dato_adicional.shtml" data-size="medium"><span class="ui-icon ui-icon-wrench"></span>Datos adicionales</a></li> \
				<li><a href="/v3/views/cotizaciones/dialog/attachment.shtml" data-size="x-large"><span class="ui-icon ui-icon-image"></span>Imágenes adjuntas</a></li> \
				<li><a href="/v3/views/cotizaciones/dialog/links.shtml" data-size="x-large"><span class="ui-icon ui-icon-link"></span>Archivos enlazados</a></li> \
				<li><a class="load items"><span class="ui-icon ui-icon-transferthick-e-w"></span>Cargar todo el catálogo</a></li> \
			</ul> \
		');
	else
		htmlObject = $('\
			<ul id="dropdown_menu" class="dropdown-menu" style="position: absolute; top: 49px; right: 13px; z-index: 1000;"> \
				<li><a href="/v3/views/cotizaciones/dialog/dato_adicional.shtml" data-size="medium"><span class="ui-icon ui-icon-wrench"></span>Datos adicionales</a></li> \
				<li><a href="/v3/views/cotizaciones/dialog/version.shtml" data-size="x-large"><span class="ui-icon ui-icon-note"></span>Versiones</a></li> \
				<li><a href="/v3/views/cotizaciones/dialog/attachment.shtml" data-size="x-large"><span class="ui-icon ui-icon-image"></span>Imágenes adjuntas</a></li> \
				<li><a href="/v3/views/cotizaciones/dialog/links.shtml" data-size="x-large"><span class="ui-icon ui-icon-link"></span>Archivos enlazados</a></li> \
				<li><a href="#" class="load items"><span class="ui-icon ui-icon-transferthick-e-w"></span>Cargar todo el catálogo</a></li> \
				<li><a href="/v3/views/cotizaciones/dialog/excel.shtml" data-size="small"><span class="ui-icon ui-icon-calculator"></span>Modificar desde Excel</a></li> \
			</ul> \
		');

	htmlObject.find('a.load.items').click(function() {
		$('#dropdown_menu').toggle();
		if ($('section.sheet > table > tbody').find('tr').length == 0) {
			var htmlObject = $('<section> \
				<span>¿Desea cargar automáticamente todo el catálogo en la cotización?</span> \
				<label><input type="checkbox" name="precios"> Incluir precios</label> \
			</section>');
			htmlObject.find('input').bind('change', function() {
				htmlObject.data('response', $('input[name="precios"]').prop('checked'));
			});
			prompt(htmlObject, 'Sí', 'No').done(function(data) {
				unaBase.ui.block();

				var include_values = (typeof data != 'undefined')? data : false;

				$('section.sheet > table > tbody').hide();

				$.ajax({
					url: '/4DACTION/_V3_cloneCatalogoToCotizacion',
					data: {
						id: $('section.sheet').data('id'),
						precios: include_values
					},
					dataType: 'json',
					cache: false
				}).success(function(data) {
					unaBase.ui.unblock();
					var callback = function() {
						$('section.sheet > table > tbody').show('fast', function() {
							if ($('section.sheet > table > thead > tr > th > button.toggle.all').hasClass('ui-icon-folder-open')) {
								$('section.sheet > table > thead > tr > th > button.toggle.all').trigger('click');
							}
						});
					}
					getDetail(callback);
				});

			});
		} else
			toastr.warning('No es posible utilizar esta opción. La cotización no debe contener ningún ítem para poder cargar el catálogo en ella.', 'Opción no disponible');
		event.preventDefault();
	});

	htmlObject.find('a[href!="#"]').each(function() {
		$(this).click(function(event) {
			unaBase.loadInto.dialog($(this).attr('href'), $(this).text(), $(this).data('size'));
			$(this).parentTo('ul').hide();
			event.preventDefault();
		});
	});

	htmlObject.menu().hide();

	$('#dropdown_launcher').parentTo('header').before(htmlObject);

	$('#dropdown_launcher').click(function() {
		var element = this;
		$('#dropdown_menu').toggle();
	}).show();

	/* END: Menú dropdown */

	// Bloquear si está anulada

	if ($('section.sheet').data('readonly')) {
		$('section.sheet').find('input, textarea, tr button, tr span').prop('disabled', true).attr('placeholder', '');
		$('section.sheet').find('tr button, tr span.ui-icon, ul.editable button, footer button').hide();
		$('nav.toolbox').find(' \
			[data-name="save"], \
			[data-name="convert_negocio"], \
			[data-name="discard"] \
		').hide();
		$('span#index').html($('span#index').html() + ' [Anulada]');
	}

	$('section.sheet table > thead button.toggle.all').click(function() {
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
	});

	/*$('section.sheet table > thead button.toggle.unused').click(function() {
		if ($(this).hasClass('ui-icon-radio-off')) {
			$(this).removeClass('ui-icon-radio-off');
			$(this).addClass('ui-icon-radio-on');
			$(this).attr('title', 'Ver todos los ítems');
			$('section.sheet table > tbody > tr:not(.title)').has('input[name="item[][precio_unitario]"]:contains("0")').show();
		} else {
			$(this).removeClass('ui-icon-radio-on');
			$(this).addClass('ui-icon-radio-off');
			$(this).attr('title', 'Ver solamente ítems cotizados');
			$('section.sheet table > tbody > tr:not(.title)').has('input[name="item[][precio_unitario]"]:contains("0")').hide();
		}
	});*/

	//Cajón cliente(alias), cambiar nombre del campo según estado
	$('input[name="cotizacion[empresa][id]"]').blur(function(event) {
		var target = $(this).parentTo('li');
		if ($(this).val() == '') {
			target.find('span:first-of-type').text('Buscar');
			target.parentTo('ul').find('li:nth-of-type(2) input').attr('placeholder', 'No se ha seleccionado cliente...');
		} else {
			target.find('span:first-of-type').text('Cliente (Alias)');
			target.parentTo('ul').find('li:nth-of-type(2) input').removeAttr('placeholder');
		}
	});

	unaBase.ui.expandable.init();


	// Valores con impuesto y horas extras

	var updatePrecioCotizado = function(event) {
		//
		if ($(this).parentTo('tr').data('tipo-documento') && $(this).parentTo('tr').data('tipo-documento-ratio')) {

			var valor_negociado = parseFloat($(this).val());

			var impuesto = $(this).parentTo('tr').data('tipo-documento-ratio');
			var division = $(this).parentTo('tr').data('tipo-documento-inverse');

			var base_imponible = 0;

			$(this).addClass('edited');
			$(this).parentTo('tr').find('button.detail.price').visible();

			if (division)
				base_imponible = Math.round(valor_negociado / (1 - impuesto));
			else
				base_imponible = Math.round(valor_negociado * (1 + impuesto));

			
			

			$(this).val(base_imponible);

			$(this).parentTo('tr').data('base-imponible', base_imponible);

			if ($(this).hasClass('special')) {
				
				//var valor_a_cotizar = parseInt($(this).val());

				var hora_extra_cantidad = parseFloat($(this).parentTo('tr').find('input[name="item[][horas_extras]"]').val());

				// Queda comentada la siguiente línea para que siempre se actualice el valor hora extra
				//if (typeof $(this).parentTo('tr').data('hora-extra-valor') == 'undefined')
					$(this).parentTo('tr').find('input[name="item[][horas_extras]"]').trigger('change');

				var hora_extra_valor = $(this).parentTo('tr').data('hora-extra-valor');

				//$(this).val(valor_a_cotizar + Math.round(hora_extra_valor * hora_extra_cantidad));
				$(this).val(base_imponible + Math.round(hora_extra_valor * hora_extra_cantidad));

			}

		}
	};

	var updatePrecioNegociado = function(event) {
		//
		if ($(this).parentTo('tr').data('tipo-documento') && $(this).parentTo('tr').data('tipo-documento-ratio')) {

			// TEST: Forzar actualización del valor de las horas extras
			//if ($(this).parentTo('tr').find('input[name="item[][horas_extras]"]').isVisible() && typeof event.isTrigger == 'undefined')
				//$(this).parentTo('tr').find('input[name="item[][horas_extras]"]').trigger('blur');
				//updateHorasExtras();

			if ($(this).hasClass('special')) {
				var valor_a_cotizar = parseFloat($(this).val());

				var hora_extra_cantidad = parseFloat($(this).parentTo('tr').find('input[name="item[][horas_extras]"]').val());

				// Si el valor de la hora extra no existe, se debe ir a actualizar
				//
				if (typeof $(this).parentTo('tr').data('hora-extra-valor') == 'undefined')
					$(this).parentTo('tr').find('input[name="item[][horas_extras]"]').trigger('change');

				var hora_extra_valor = $(this).parentTo('tr').data('hora-extra-valor');

				$(this).val(valor_a_cotizar - Math.round(hora_extra_valor * hora_extra_cantidad));

			}
			
			//var base_imponible = $(this).parentTo('tr').data('base-imponible');

			var valor_a_cotizar = parseFloat($(this).val());

			var impuesto = $(this).parentTo('tr').data('tipo-documento-ratio');
			var multiplicacion = $(this).parentTo('tr').data('tipo-documento-inverse');

			var valor_cotizado = 0;

			$(this).removeClass('edited');
			$(this).parentTo('tr').find('button.detail.price').invisible();

			if (multiplicacion)
				valor_cotizado = Math.round(valor_a_cotizar * (1 - impuesto));
				//valor_cotizado = Math.round(base_imponible * (1 - impuesto));
			else
				valor_cotizado = Math.round(valor_a_cotizar / (1 + impuesto));
				//valor_cotizado = Math.round(base_imponible / (1 + impuesto));

			$(this).val(valor_cotizado);

		}
	};

	var updateHorasExtras = function(event) {
		
		// Se debe quitar el foco del precio unitario, para mostrar en él la base imponible
		// en caso de ser necesaria y según sea el caso
		/*$(this).parentTo('tr').find('input[name="item[][precio_unitario]"]').trigger('blur');*/

		var base_imponible = 0;

		if ($(this).parentTo('tr').data('base-imponible'))
			base_imponible = $(this).parentTo('tr').data('base-imponible');
		else
			base_imponible = parseFloat($(this).parentTo('tr').find('input[name="item[][precio_unitario]"]').val());

		var hora_extra_cantidad = parseFloat($(this).parentTo('tr').find('input[name="item[][horas_extras]"]').val());
		var dias_cantidad = parseFloat($(this).parentTo('tr').find('input[name="item[][factor]"]').val());
		//
		var hora_extra_factor = $(this).parentTo('tr').data('hora-extra-factor');
		var hora_extra_jornada = $(this).parentTo('tr').data('hora-extra-jornada');
		var hora_extra_valor = 0;

		if (hora_extra_jornada)
			hora_extra_valor = (base_imponible / dias_cantidad / 10) * hora_extra_factor;
		else
			hora_extra_valor = (base_imponible / 7 / 10) * hora_extra_factor;

		$(this).parentTo('tr').data('hora-extra-valor', hora_extra_valor);

		
		

		// Si el evento se llama vía trigger, no se debe cambiar el valor del precio unitario
		//
		if (typeof event.originalEvent != 'undefined') {

			// Se borra el valor de horas extras presente en el título
			$(this).parentTo('tr').prevTo('.title').find('input[name="item[][horas_extras]"]').val(null);

			// Se cambia el valor del precio unitario
			$(this).parentTo('tr').find('input[name="item[][precio_unitario]"]').val(base_imponible + Math.round(hora_extra_valor * hora_extra_cantidad));

			if (hora_extra_cantidad > 0)
				$(this).parentTo('tr').find('input[name="item[][precio_unitario]"]').addClass('special');
			else
				$(this).parentTo('tr').find('input[name="item[][precio_unitario]"]').removeClass('special');

			if (typeof copiar_precio_a_costo == 'boolean' && $(this).parentTo('tr').find('input[name="item[][costo_unitario]"]').data('auto'))
				$(this).parentTo('tr').find('input[name="item[][costo_unitario]"]').val(parseFloat($(this).parentTo('tr').find('input[name="item[][precio_unitario]"]').val()));
		}

	};

	// Cálculo de valor a cotizar desde valor negociado y horas extras
	$('section.sheet').on('blur', 'tr:not(.title) input[name="item[][precio_unitario]"]', updatePrecioCotizado);

	// Cálculo de valor negociado desde valor a cotizar y horas extras
	$('section.sheet').on('focus', 'tr:not(.title) input[name="item[][precio_unitario]"].edited', updatePrecioNegociado);

	// Cálculo de valor de horas extras
	// se realiza al cambiar la cantidad de horas extras o la cantidad de días (jornadas)
	$('section.sheet').on('change', 'tr:not(.title) input[name="item[][horas_extras]"]', updateHorasExtras);
	$('section.sheet').on('change', 'tr:not(.title) input[name="item[][factor]"]', updateHorasExtras);

	// Copiar horas extras a todos los ítems del título
	$('section.sheet').on('change', 'tr.title input[name="item[][horas_extras]"]', function(event) {
		var horas_extras = $(this).val();
		var items = $(this).parentTo('tr').nextUntil('.title');
		items.each(function() {
			$(this).find('input[name="item[][horas_extras]"]').val(horas_extras).trigger('change');
		});
	});

	$('section.sheet').on('hover', 'button.detail.price', function(event) {
		var element = $(this);
		$(this).tooltipster({
			content: function() {
				var htmlObject = $('\
					<ul>																																							\
						<li data-name="tipo-documento">																																\
							<strong style="font-weight: bold; display: inline-block; width: 180px;">Tipo de documento</strong>														\
							<span></span>																																			\
						</li>																																						\
						<li data-name="valor-negociado">																															\
							<strong style="font-weight: bold; display: inline-block; width: 180px;">Valor ingresado</strong>														\
							<span class="numeric currency">' + currency.symbol + ' <span style="display: inline-block; width: 100px; text-align: right;"></span></span>									\
						</li>																																						\
						<li data-name="imposiciones">																																\
							<strong style="font-weight: bold; display: inline-block; width: 180px;">Imposiciones (<span class="numeric percent"></span>%)</strong>					\
							<span class="numeric currency">' + currency.symbol + ' <span style="display: inline-block; width: 100px; text-align: right;"></span></span>									\
						</li>																																						\
						<li data-name="retencion">																																	\
							<strong style="font-weight: bold; display: inline-block; width: 180px;">Retención (<span class="numeric percent"></span>%)</strong>						\
							<span class="numeric currency">' + currency.symbol + ' <span style="display: inline-block; width: 100px; text-align: right;"></span></span>									\
						</li>																																						\
						<li data-name="horas-extras">																																\
							<strong style="font-weight: bold; display: inline-block; width: 180px;">Horas extras (<span class="numeric percent"></span>)</strong>					\
							<span class="numeric currency">' + currency.symbol + ' <span style="display: inline-block; width: 100px; text-align: right;"></span></span>									\
						</li>																																						\
						<li data-name="total" style="border-top: 1px solid grey; margin-top: 10px; padding-top: 10px;">																\
							<strong style="font-weight: bold; display: inline-block; width: 180px;">Total</strong>																	\
							<span class="numeric currency">' + currency.symbol + ' <span style="display: inline-block; width: 100px; text-align: right;"></span></span>									\
						</li>																																						\
					</ul>																																							\
				');

				var row = element.parentTo('tr');

				var horas_extras_cantidad = parseFloat(row.find('input[name="item[][horas_extras]"]').val());
				if (horas_extras_cantidad == 0)
					htmlObject.find('li[data-name="horas-extras"]').hide();
				var hora_extra_valor = row.data('hora-extra-valor');
				if (typeof hora_extra_valor == 'undefined') {
					row.find('input[name="item[][horas_extras]"]').trigger('change');
					hora_extra_valor = row.data('hora-extra-valor');
				}
				var base_imponible = row.data('base-imponible');
				var tipo_documento = row.data('tipo-documento-text');
				var impuesto = row.data('tipo-documento-ratio');
				var division = row.data('tipo-documento-inverse');
				var total = parseFloat(row.find('input[name="item[][precio_unitario]"]').val());

				var valor_negociado = 0;
				if (division) {
					htmlObject.find('li[data-name="imposiciones"]').hide();
					valor_negociado = base_imponible * (1 - impuesto);
				} else {
					htmlObject.find('li[data-name="retencion"]').hide();
					valor_negociado = base_imponible / (1 + impuesto);
				}

				var imposiciones = base_imponible - valor_negociado;

				htmlObject.find('li[data-name="tipo-documento"] > span').text(tipo_documento);

				htmlObject.find('li[data-name="valor-negociado"] > span > span').text(valor_negociado.toFixed(currency.decimals));

				htmlObject.find('li[data-name="imposiciones"] > strong span').text((impuesto * 100).toFixed(2));
				htmlObject.find('li[data-name="imposiciones"] > span > span').text(imposiciones.toFixed(currency.decimals));

				htmlObject.find('li[data-name="retencion"] > strong span').text((impuesto * 100).toFixed(2));
				htmlObject.find('li[data-name="retencion"] > span > span').text(imposiciones.toFixed(currency.decimals));

				htmlObject.find('li[data-name="horas-extras"] > strong span').text(horas_extras_cantidad);
				htmlObject.find('li[data-name="horas-extras"] > span > span').text(Math.round(hora_extra_valor * horas_extras_cantidad).toFixed(0));

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

	$('section.sheet').on('mouseout', 'button.detail.price', function(event) {
		$(this).tooltipster('destroy');
	});


	  

});