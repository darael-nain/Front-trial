var getElement = {
	titulo: function(functor, element) {
		var htmlObject = $(' \
			<tr class="title" data-jerarquia="0"> \
				<th><span class="ui-icon ui-icon-arrow-4" title="Arrastrar para mover" style="cursor: move;"></span><button class="ui-icon ui-icon-minus remove categoria" title="Quitar categoría"></button></th> \
				<th><button class="ui-icon ui-icon-folder-open toggle categoria" title="Contraer o expandir jerarquía"></button><button class="ui-icon ui-icon-tag add categoria" title="Agregar categoría debajo" data-help="Haga clic en este botón para añadir un ítem a la categoría creada"></button> <button class="ui-icon ui-icon-circle-plus add item" title="Agregar ítem"></button></th> \
				<th><span class="info"></span></th> \
				<th></th> \
				<th></th> \
				<th></th> \
			</tr> \
		');

		htmlObject[functor](element);

		htmlObject.find('button.toggle.categoria').click(function() {
			var target = $(this);

			var collapsed = target.hasClass('ui-icon-folder-collapsed');

			if (collapsed)
				target.removeClass('ui-icon-folder-collapsed').addClass('ui-icon-folder-open');
			else
				target.removeClass('ui-icon-folder-open').addClass('ui-icon-folder-collapsed');

			console.log('collapsed: ' + collapsed);

			var titles = target.parentTo('tr').nextUntil('.title');

			if (collapsed) {
				titles.removeClass('collapsed');
				target.parentTo('tr').find('.info').html('');

			} else {
				titles.addClass('collapsed');
				target.parentTo('tr').find('.info').html(titles.length + ' usuario' + ((titles.length > 1)? 's' : ''));
			}
		});

		htmlObject.draggable({
			helper: 'clone',
			containment: 'tbody',
			start: function(event, ui) {
				var dragSource = $(event.target).nextUntil('.title');
				var width = dragSource.width();
				var height = dragSource.height()

				dragSource.addClass('moving-src');
				//updateSubtotalTitulos($(event.target));
				// FIXME: el helper no responde a cambios en el width
				ui.helper.width(width);
				ui.helper.height(height);
			},
			revert: function(event, ui) {
				$('.moving-src').removeClass('moving-src');
			}
		});

		htmlObject.droppable({
			hoverClass: 'ui-state-active',
			accept: 'table.items > tbody > tr',
			drop: function(event, ui) {
				var dragTarget = $(event.target).nextUntil('.title');
				$(event.target).after(ui.draggable);
				if (ui.draggable.hasClass('title')) {
					dragTarget.addClass('moving-dst');
					ui.draggable.insertAfter($(event.target));
					$('.moving-src').removeClass('moving-src').insertAfter(ui.draggable);
					$('.moving-dst').removeClass('moving-dst').insertAfter($(event.target));

				} else {
					ui.draggable.insertAfter($(event.target));
				}
			}
		});

		return htmlObject;
	},
	item: function(functor, element) {
		var htmlObject = $(' \
			<tr data-username="0"> \
				<td><span class="ui-icon ui-icon-arrow-4" title="Arrastrar para mover" style="cursor: move;"></span><button class="ui-icon ui-icon-minus remove item" title="Quitar ítem"></button></td> \
				<td></td> \
				<td><input name="item[][nombre]" type="search" placeholder="Buscar usuario..."><button class="ui-icon ui-icon-carat-1-s show item">Ver ítems</button><button class="ui-icon ui-icon-document detail item" title="Detalle">Detalle</button><button class="ui-icon ui-icon-gear profile item" title="Perfil"></button></td> \
				<td class="fit"><input name="item[][required]" type="checkbox" value="true"></td> \
				<td class="fit"><input name="item[][block_email]" type="checkbox" value="true"></td> \
				<td class="fit"><input name="item[][ejecutivo]" type="checkbox" value="true"></td> \
			</tr> \
		');

		htmlObject[functor](element);

		htmlObject.draggable({
			helper: 'clone',
			containment: 'tbody',
			start: function(event, ui) {
				dragSource = $(event.target);
				$(event.target).hide();
				//updateSubtotalTitulos($(event.target));
				ui.helper.width($(event.target).width());
				ui.helper.height($(event.target).height());
			},
			stop: function(event, ui) {
				$(event.target).show();
				//updateSubtotalTitulos($(event.target));
			}
		});

		htmlObject.droppable({
			hoverClass: 'ui-state-active',
			accept: 'table.items > tbody > tr:not(.title)',
			drop: function(event, ui) {
				//
				//$(event.target).find('button.toggle.categoria').removeClass('ui-icon-folder-collapsed').addClass('ui-icon-folder-open').parentTo('tr').nextUntil('.title').removeClass('collapsed');
				// FIXME: revisar que se puedan arrastrar ítems a títulos cerrados y el cambio se refleje correctamente
				$(event.target).after(ui.draggable);
				setTimeout(updateIndexes, 2000);
			}
		});

		htmlObject.find('button.profile.item').tooltipster({
			delay: 0,
			interactiveAutoClose: false
		});


		htmlObject.focusin(function() {
			$(this).find('input[name="item[][nombre]"]').autocomplete({
				source: function(request, response) {
					$.ajax({
						url: '/4DACTION/_V3_' + 'getUsuario',
						dataType: 'json',
						data: {
							q: request.term,
							id: htmlObject.prevTo('.title').data('categoria')
						},
						success: function(data) {
							response($.map(data.rows, function(item) {
								return item;
							}));
						},
						error: function(jqXHR, exception) {
							toastr.error('No se pudo cargar el listado de usuarios. Error de conexión al servidor.');
				        }
					});
				},
				minLength: 0,
				delay: 0,
				position: { my: "left top", at: "left bottom", collision: "flip" },
				open: function() {
					$(this).removeClass('ui-corner-all').addClass('ui-corner-top');
				},
				close: function() {
					$(this).removeClass('ui-corner-top').addClass('ui-corner-all');
				},
				focus: function(event, ui) {
					$(this).val(ui.item.text);
					return false;
				},
				select: function(event, ui) {
					$(this).val(ui.item.text);
					var target = htmlObject;

					target.data('username', ui.item.id);

					target.find('button.profile.item').tooltipster('update', ui.item.text);

					$(this).trigger('change');

					//updateSubtotalTitulos($(this));
					//updateSubtotalItems();
					return false;
				}

			}).data('ui-autocomplete')._renderItem = function(ul, item) {
				return $('<li><a><strong>' + item.id + '</strong>' + ((item.ejecutivo)? '<em>Ejecutivo</em>' : '') + '<span class="highlight">' + item.ap_pat + ' ' + item.ap_mat + ', ' + item.nombres + '</span></a></li>').appendTo(ul);
			};
			//$(this).unbind('click');
		});

		htmlObject.focusout(function() {
			$(this).find('input[name="item[][nombre]"]').autocomplete('destroy');
		});


		return htmlObject;
	}
};

var updateIndexes = function(callback) {
	var index = 0;
	var increment = 1;
	var fields = {};
	var field;

	var data = {
		fk: $('section.sheet').data('id')
	};

	var jerarquia = 0;
	$('section.sheet > table > tbody > tr.title').each(function(key, item) {
		jerarquia+= increment;
		$(item).data('jerarquia', jerarquia);
	});

	var k = 1;

	$('section.sheet > table > tbody > tr:not(.title)').each(function(key, item) {

		index+= increment;
		$(item).data('index', index);
		field = $(item).find('input[name="item[][nombre]"]');

		fields['item[' + k + '][id]'] = $(item).data('id');
		fields['item[' + k + '][index]'] = $(item).data('index');
		fields['item[' + k + '][username]'] = $(item).data('username');
		fields['item[' + k + '][parent]'] = $(item).prevTo('.title').data('jerarquia');
		fields['item[' + k + '][required]'] = $(item).find('[name="item[][required]"]').prop('checked');
		fields['item[' + k + '][block_email]'] = $(item).find('[name="item[][block_email]"]').prop('checked');
		fields['item[' + k + '][ejecutivo]'] = $(item).find('[name="item[][ejecutivo]"]').prop('checked');


		// se podría optimizar para que los títulos se actualicen solamente si es que se han recorrido todos los items disponibles
		//updateSubtotalTitulos($(item));

		/*if ($(item).next().length) {
			if ($(item).next().hasClass('title'))
				updateSubtotalTitulos($(item));
		}*/


		$.extend(data, data, fields);
		k++;
	});

	$.ajax({
		url: '/4DACTION/_V3_batchUsuarioRVByRV',
		dataType: 'json',
		data: data,
		type: 'POST',
		cache: false,
		success: function(data) {
			// Se debe obtener un response con todo los id e index reasignados
			// se debe ver si es realmente necesario
			/*$(item).data('id', data.id);
			$(item).data('index', data.index);
			*/
			if (typeof callback != 'undefined')
				callback();
		},
		error: function() {
			//toastr.error('No se pudo guardar el item');
			// manejar esta situación
		}
	}).fail(function(err, err2, err3) {
		console.log(err);
		console.log(err2);
		console.log(err3);
	});

	//callback();
};

var getDetail = function() {
	$.ajax({
		url: '/4DACTION/_V3_getUsuarioRVByRV',
		dataType: 'json',
		data: {
			id: $('section.sheet').data('id')
		},
		cache: false,
		beforeSend: function() {
			unaBase.ui.block();
		},
		complete: function() {

		},
		success: function(data) {
			var current;
			current = $('table.items > tbody');
			current.hide();
			var deferred = function(item) {
				var htmlObject;
				var last = current.find('tr:last-of-type');
				if (last.length > 0) {
					if (last.data('parent') != item.jerarquia) {
						htmlObject = getElement.titulo('appendTo', current);
						htmlObject.data('jerarquia', item.jerarquia);
					}
				} else {
					htmlObject = getElement.titulo('appendTo', current);
					htmlObject.data('jerarquia', item.jerarquia);
				}
				/*if (last.length > 0) {
					if (last.data('jerarquia') != item.jerarquia) {
						htmlObject = getElement.titulo('appendTo', current);
						htmlObject.data('id', item.jerarquia);
				}*/

				htmlObject = getElement.item('appendTo', current);
				htmlObject.data('username', item.username);
				htmlObject.find('[name="item[][required]"]').prop('checked', item.required);
				htmlObject.find('[name="item[][block_email]"]').prop('checked', item.block_email);
				htmlObject.find('[name="item[][ejecutivo]"]').prop('checked', item.ejecutivo);

				htmlObject.data('id', item.id);
				htmlObject.data('index', item.index);
				htmlObject.data('parent', item.jerarquia);
				htmlObject.find('input[name="item[][nombre]"]').val(item.username);
			};

			asyncLoop(data.rows.length,
				function(i) {
					deferred(data.rows[i]);
				},
				function() {
					current.show();
					unaBase.ui.unblock();
				}
			);

		},
		error: function() {
			toastr.error('No se pudieron mostrar los usuarios asociados a la regla.');
			// manejar esta situación
		}
	});

};

var afterEditEmpresa = function(element) {
	console.log('entra a AfterEditEmpresa');
	console.log($(element));
	var target = $(element).parentTo('ul');
	target.find('input[name="cotizacion[empresa][id]"], input[name="cotizacion[empresa][razon_social]"], input[name="cotizacion[empresa][rut]"]')
		.attr('type', 'search')
		.autocomplete('enable');
	target.find('input[name="cotizacion[empresa][id]"]').attr('placeholder', 'Buscar por Alias');
	target.find('input[name="cotizacion[empresa][razon_social]"]').attr('placeholder', 'Buscar por Razón Social');
	target.find('input[name="cotizacion[empresa][rut]"]').attr('placeholder', 'Buscar por RUT');
	target.find('input[name="cotizacion[empresa][giro]"], input[name="cotizacion[empresa][direccion]"], input[name="cotizacion[empresa][telefonos]"]')
		.attr('readonly', true);
	target.find('input[name="cotizacion[empresa][id]"]').focus();
	target.find('button.empresa.edit').hide();

	/*if (
		$('input[name="cotizacion[empresa][id]"]').val() != '' ||
		$('input[name="cotizacion[empresa][razon_social]"]').val() != '' ||
		$('input[name="cotizacion[empresa][rut]"]').val() != ''
	)*/ // revisar
		target.find('button.empresa.unlock, button.empresa.profile').show();

	target.find('input[name="cotizacion[empresa][rut]"]').parentTo('span').removeClass('main');
	target.find('input[name="cotizacion[empresa][rut][validate]"]').parentTo('span').removeClass('secondary').addClass('hidden');
};

var afterEditContacto = function(element) {
	var target = $(element).parentTo('ul');
	target.find('input[name="cotizacion[empresa][contacto][id]"]')
		.attr('type', 'search')
		.autocomplete('enable');
	target.find('input[name="cotizacion[empresa][contacto][id]"]').attr('placeholder', 'Buscar por Nombre y/o Apellidos');
	target.find('input[name="cotizacion[empresa][contacto][cargo]"], input[name="cotizacion[empresa][contacto][email]"]')
		.attr('readonly', true);
	target.find('input[name="empresa[contacto][id]"]').focus();
	target.find('button.contacto.edit').hide();

	/*if (
		$('input[name="cotizacion[empresa][contacto][id]"').val() != ''
	)*/ // revisar
		target.find('button.unlock.contacto, button.show.contacto, button.profile.contacto').show();
};
