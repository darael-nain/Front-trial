$(document).ready(function() {


	unaBase.ui.expandable.init();

	if (
		$('input[name="cotizacion[empresa][id]"]').val() == ''
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

		//maskRut(target.find('input[name="cotizacion[empresa][rut]"]'));

		//target.find('input[name="cotizacion[empresa][rut]"]').parentTo('span').addClass('main');
		//target.find('input[name="cotizacion[empresa][rut][validate]"]').parentTo('span').addClass('secondary').removeClass('hidden');
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
		unaBase.loadInto.dialog('/v3/views/contactos/content.shtml?id=' + $('input[type="search"][name="cotizacion[empresa][id]"]').data('id'), 'Perfil de Empresa', 'large');
	});

	$('button.show.contacto').click(function() {
		var target = $(this).parentTo('ul');
		target.find('input[name="cotizacion[empresa][contacto][id]"][type="search"]').autocomplete('search', '@').focus();
	});

	$('button.show.jefeProyecto').click(function() {
		var target = $(this).parentTo('ul');
		target.find('input[name="cotizacion[jefeProyecto]"][type="search"]').autocomplete('search', '@').focus();
	});

	$('button.show.areaNegocio').click(function() {
		var target = $(this).parentTo('ul');
		target.find('input[name="cotizacion[areaNegocio]"][type="search"]').autocomplete('search', '@').focus();
	});

	$('button.show.empresa').click(function() {
		var target = $(this).parentTo('ul');
		target.find('input[name="cotizacion[empresa][id]"][type="search"]').autocomplete('search', '@').focus();
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
		unaBase.loadInto.dialog('/v3/views/contactos/content.shtml?id=' + $('input[name="cotizacion[empresa][contacto][id]"]').data('id'), 'Perfil de Contacto', 'large');
	});

	$('button.edit.save.empresa').click(function(event) {
		var element = this;
		var fields = {
			'cotizacion[empresa][contacto][id]': $('input[name="cotizacion[empresa][contacto][id]"]').data('id')
		};
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


		if (validate)
			$.ajax({
				url: '/4DACTION/_V3_setEmpresa2',
				dataType: 'json',
				data: fields,
				async: false,
				success: function(data) {
					if (data.success) {
						$('button.show.empresa').show();
						/*if (data.new)
							toastr.info('Empresa creada!');
						else
							toastr.info('Empresa modificada!');*/
						$('input[name="cotizacion[empresa][id]"]').data('id', data.id);

						$('h2 [name="cotizacion[empresa][id]"]').text(fields['cotizacion[empresa][id]']);
						//$('h2 [name="cotizacion[empresa][razon_social]"]').text(fields['cotizacion[empresa][razon_social]']);

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
				error: function(xhr, text, error) {
					toastr.error('Falló conexión al servidor.');
				}
			});
		else {
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

		$.ajax({
			url: '/4DACTION/_V3_setContactoByEmpresa',
			dataType: 'json',
			data: fields,
			async: false,
			success: function(data) {
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
			error: function(xhr, text, error) {
				toastr.error('Falló conexión al servidor.');
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

	unaBase.toolbox.form.autocomplete({
		fields: [
			{ local: 'cotizacion[empresa][id]', remote: 'alias', type: 'search', default: true },
			{ local: 'cotizacion[empresa][razon_social]', remote: 'razon_social', type: 'text' },
			{ local: 'cotizacion[empresa][giro]', remote: 'giro', type: 'text' },
			{ local: 'cotizacion[empresa][direccion]', remote: 'direccion', type: 'text' },
			{ local: 'cotizacion[empresa][telefonos]', remote: 'telefonos', type: 'text' }
		],
		data: {
			entity: 'Empresa',
			relationship: function() {
				return {
					key: 'Contacto',
					id: $('input[type="search"][name="cotizacion[empresa][contacto][id]"]').data('id')
				}
			}
		},
		restrict: true,
		response: function(event, ui) {
			var target = $(this).parentTo('ul');
			$(this).data('id', null);
			target.find('input[name^="cotizacion[empresa]"]').not(this).val('');

			$('h2 [name="cotizacion[empresa][id]"]').text('');
			$('h2 [name="cotizacion[empresa][razon_social]"]').text('');
		},
		change: function(event, ui) {
			var target = $(this).parentTo('ul');
			if ($(this).val() == '') {
				$('button.empresa').hide();
				target.find('input').not(this).val('');
			}

			if (!$(this).data('id') && $(this).val() != '') {
				var element = this;
				if (!access._551) {
					confirm('El cliente "' + $(this).val() + '" no está registrado.' + "\n\n" + '¿Desea crearlo?').done(function(data) {
						if (data) {
							$(element).data('id', null);

							//target.parent().find('input[name^="cotizacion[empresa][contacto]"]').val('');

							$('button.unlock.empresa').click();
						} else {
							$(element).val('');
							setTimeout(
								function() { $(element).focus(); }
							, 500);
						}
					});
				} else {
					$(element).val('');
					setTimeout(
						function() { $(element).focus(); }
					, 500);
				}
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

			target.find('input[name="cotizacion[condiciones][forma_pago]"]').data('id', ui.item.id_forma_default);
			target.find('input[name="cotizacion[condiciones][forma_pago]"]').val(ui.item.des_forma_default);


			$('h2 [name="cotizacion[empresa][id]"]').text(ui.item.text);
			$('h2 [name="cotizacion[empresa][razon_social]"]').text(ui.item.razon_social);

			/*
			$.ajax({
				url: '/4DACTION/_V3_' + 'getContacto',
				dataType: 'json',
				async: false,
				data: {
					id: ui.item.id,
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
					target.find('button.edit.contacto').hide();
				}
			});
			*/

			return false;
		},
		renderItem: function(ul, item) {
			return $('<li><a><strong class="highlight">' + ((item.text)? item.text : '[Sin Alias]') + '</strong><em>' + ((item.rut_validar)? unaBase.data.rut.format(item.rut) : item.rut) + '</em><span>' + item.razon_social + '</span></a></li>').appendTo(ul);
		}
	});

	unaBase.toolbox.form.autocomplete({
		fields: [
			{ local: 'cotizacion[empresa][contacto][id]', remote: 'nombre_completo', type: 'search', default: true },
			{ local: 'cotizacion[empresa][contacto][cargo]', remote: 'cargo', type: 'text' },
			{ local: 'cotizacion[empresa][contacto][email]', remote: 'razon_social', type: 'email' }
		],
		data: {
			entity: 'Contacto2',
			filter: 'nombre_completo'/*,
			relationship: function() {
				return {
					key: 'Empresa',
					id: $('input[name="cotizacion[empresa][id]"]').data('id')
				}
			}*/
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
			/*if ($(this).val() == '')
				target.find('button.contacto').hide();*/

			if (!$(this).data('id') && $(this).val() != '') {
				/*var element = this;
				if (!access._551) {
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
				} else {
					target.find('input[type="search"][name^="cotizacion[empresa][contacto]"]').val('');
					setTimeout(
						function() { $(element).focus(); }
					, 500);
				}*/

				/*var element = this;
				if (!access._551) {
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
				} else {
					$(element).val('');
					setTimeout(
						function() { $(element).focus(); }
					, 500);
				}*/
				var element = this;
				if (!access._551) {
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
				} else {
					target.find('input[type="search"][name^="cotizacion[empresa][contacto]"]').val('');
					setTimeout(
						function() { $(element).focus(); }
					, 500);
				}

			}

		},
		select: function(event, ui) {
			var target = $('input[type="search"][name="cotizacion[empresa][contacto][id]"]').parentTo('ul');

			target.find('button.unlock.contacto').show();
			target.find('button.edit.contacto').hide();
			target.find('button.profile.contacto').show();
			target.find('button.show.contacto').show();

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

			if (!old_empresa || old_empresa != new_empresa) {

				target.find('input[name="cotizacion[empresa][id]"]').data('id', undefined);
				target.find('input[name="cotizacion[empresa][id]"]').val('');
				target.find('input[name="cotizacion[empresa][razon_social]"]').val('');
				target.find('input[name="cotizacion[empresa][rut]"]').val('');

				$('h2 [name="cotizacion[empresa][id]"]').text('');
				$('h2 [name="cotizacion[empresa][razon_social]"]').text('');

				$.ajax({
					url: '/4DACTION/_V3_' + 'getEmpresaByContacto',
					dataType: 'json',
					async: false,
					data: {
						id: new_empresa//,
						//filter: 'id',
						//default: true
					},
					success: function(data) {
						var target = $('input[type="search"][name="cotizacion[empresa][id]"]').parentTo('ul');

						//$.map(data.rows, function(item) {
						var item = data.rows[0];
						if (data.rows.length > 0) {
							target.find('input[name="cotizacion[empresa][id]"]').data('id', item.id);
							target.find('input[name="cotizacion[empresa][id]"]').val(item.text);
							//target.find('input[name="cotizacion[empresa][razon_social]"]').val(item.razon_social);
							//target.find('input[name="cotizacion[empresa][rut]"]').val(item.rut);

							$('h2 [name="cotizacion[empresa][id]"]').text(item.text);
							$('h2 [name="cotizacion[empresa][razon_social]"]').text(item.razon_social);
						//});
						}
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
				element = $('<li><a><strong class="highlight">' + item.nombre_completo + '</strong><em>[' + item.empresa.text + ']</em><span>' + item.cargo + '</span><span>' + item.email + '</span></a></li>').appendTo(ul);
			else
				element = $('<li><a><strong class="highlight">' + item.nombre_completo + '</strong><em>[' + item.empresa.text + ']</em><span>' + item.cargo + '</span><span>' + item.email + '</span></a></li>').appendTo(ul);
			return element;
		}
	});

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

	if ($('input[name="cotizacion[jefeProyecto]"]').length > 0){
		$('input[name="cotizacion[jefeProyecto]"]').autocomplete({
			source: function(request, response) {
				// 
				$.ajax({
					url: '/4DACTION/_V3_' + 'getUsuario',
					dataType: 'json',
					data: {
						q: request.term,
						jefeProyecto: true
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

				$('input[name="cotizacion[jefeProyecto]"]').val(ui.item.nombres + ' ' + ui.item.ap_pat + ((ui.item.ap_mat)? ' ' + ui.item.ap_mat : ''));
				// $('input[name="cotizacion[jefeProyecto]"]').data('id', ui.item.id);
				$('input[name="cotizacion[jefeProyecto]"]').attr('data-login', ui.item.id);
				return false;
			}

		}).data('ui-autocomplete')._renderItem = function(ul, item) {
			return $('<li><a><strong class="highlight">' +  item.ap_pat + ((item.ap_mat)? ' ' + item.ap_mat : '') + ', ' + item.nombres + '</strong><em>' + item.cargo + '</em><span>' + item.email + '</span></a></li>').appendTo(ul);
		};
		
	}

	if ($('input[name="cotizacion[areaNegocio]"]').length > 0){
		$('input[name="cotizacion[areaNegocio]"]').autocomplete({
			source: function(request, response) {
				// 
				$.ajax({
					url: '/4DACTION/_V3_' + 'getCentroCosto',
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

				$('input[name="cotizacion[areaNegocio]"]').val(ui.item.text);
				$('input[name="cotizacion[areaNegocio]"]').attr('data-id', ui.item.id);
				return false;
			}

		}).data('ui-autocomplete')._renderItem = function(ul, item) {
			return $('<li><a>' +  item.text + '</a></li>').appendTo(ul);
		};

	}


});
