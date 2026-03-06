
var updateHorasExtras =  (event) => {
	if ($(event.target).parentTo('tr').data('hora-extra-enabled')) {
		var base_imponible = 0;
		var hora_extra_cantidad = parseFloat($(event.target).parentTo('tr').find('input[name="item[][horas_extras]"]').val());
		var dias_cantidad = parseFloat($(event.target).parentTo('tr').find('input[name="item[][factor]"]').val());
		var hora_extra_factor = $(event.target).parentTo('tr').data('hora-extra-factor');
		var hora_extra_jornada = $(event.target).parentTo('tr').data('hora-extra-jornada');
		var hora_extra_dias = $(event.target).parentTo('tr').data('hora-extra-dias');
		var hora_extra_valor = 0;

		//FIX NUEVO REAPER 03-03-2024
		if(hora_extra_cantidad == 0)
			$(event.target).parentTo('tr').find('input[name="item[][precio_unitario]"]').prop('readonly', false)
		else
			$(event.target).parentTo('tr').find('input[name="item[][precio_unitario]"]').prop('readonly', true)



		if ($(event.target).parentTo('tr').data('base-imponible'))
			base_imponible = $(event.target).parentTo('tr').data('base-imponible');
		else{
			$(event.target).parentTo('tr').data('base-imponible', parseFloat($(event.target).parentTo('tr').find('input[name="item[][precio_unitario]"]').val()))

			// Corrección cuando se ocultan decimales
			//base_imponible = parseFloat($(event.target).parentTo('tr').find('input[name="item[][precio_unitario]"]').val());
			if ($(event.target).parentTo('tr').find('input[name="item[][precio_unitario]"]').data('old-value'))
				base_imponible = parseFloat($(event.target).parentTo('tr').find('input[name="item[][precio_unitario]"]').data('old-value'));
			else
				base_imponible = parseFloat($(event.target).parentTo('tr').find('input[name="item[][precio_unitario]"]').val());
		}
			

	
		hora_extra_dias = (typeof hora_extra_dias == 'undefined') ? 7 : hora_extra_dias;

		if (hora_extra_jornada)
			hora_extra_valor = (base_imponible / dias_cantidad / 11) * hora_extra_factor;
		else
			hora_extra_valor = (base_imponible / hora_extra_dias / 10) * hora_extra_factor;

		$(event.target).parentTo('tr').data('hora-extra-valor', hora_extra_valor);

		if (typeof event.originalEvent != 'undefined')
			$(event.target).parentTo('tr').prevTo('.title').find('input[name="item[][horas_extras]"]').val(null);

		$(event.target).parentTo('tr').find('input[name="item[][precio_unitario]"]').val(base_imponible + hora_extra_valor * hora_extra_cantidad);
		// Corrección cuando se ocultan decimales
		$(event.target).parentTo('tr').find('input[name="item[][precio_unitario]"]').data('old-value', base_imponible + hora_extra_valor * hora_extra_cantidad);

		if (hora_extra_cantidad > 0)
			$(event.target).parentTo('tr').find('input[name="item[][precio_unitario]"]').addClass('special');
		else
			$(event.target).parentTo('tr').find('input[name="item[][precio_unitario]"]').removeClass('special');

		if (typeof copiar_precio_a_costo == 'boolean' && $(event.target).parentTo('tr').find('input[name="item[][costo_unitario]"]').data('auto')) {
			// Corrección ocultar decimales
			//$(event.target).parentTo('tr').find('input[name="item[][costo_unitario]"]').val(parseFloat($(event.target).parentTo('tr').find('input[name="item[][precio_unitario]"]').val()));
			if ($(event.target).parentTo('tr').find('input[name="item[][precio_unitario]"]').data('old-value'))
				$(event.target).parentTo('tr').find('input[name="item[][costo_unitario]"]').val(parseFloat($(event.target).parentTo('tr').find('input[name="item[][precio_unitario]"]').data('old-value'))).data('old-value', parseFloat($(event.target).parentTo('tr').find('input[name="item[][precio_unitario]"]').data('old-value')));
			else
				$(event.target).parentTo('tr').find('input[name="item[][costo_unitario]"]').val(parseFloat($(event.target).parentTo('tr').find('input[name="item[][precio_unitario]"]').val())).data('old-value', parseFloat($(event.target).parentTo('tr').find('input[name="item[][precio_unitario]"]').val()));
		}

		$(event.target).trigger('focus').trigger('blur');

	}
};