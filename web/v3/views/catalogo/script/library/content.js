var afterEditCategoria = function(element) {
	var target = $(element).parentTo('ul');
	//target.find('input[name="cotizacion[empresa][id]"], input[name="cotizacion[empresa][razon_social]"], input[name="cotizacion[empresa][rut]"]')
	target.find('input[name="producto[categoria]"]')
		.attr('type', 'search')
		.autocomplete('enable');
	target.find('input[name="producto[categoria]"]').attr('placeholder', 'Buscar...');
	/*
	target.find('input[name="cotizacion[empresa][razon_social]"]').attr('placeholder', 'Buscar por Razón Social');
	target.find('input[name="cotizacion[empresa][rut]"]').attr('placeholder', 'Buscar por RUT');
	target.find('input[name="cotizacion[empresa][giro]"], input[name="cotizacion[empresa][direccion]"], input[name="cotizacion[empresa][telefonos]"]')
		.attr('readonly', true);
	*/
	
	target.find('input[name="producto[categoria]"]').focus();
	target.find('button.categoria.edit').hide();

	if (
		$('input[name="producto[categoria]"]').val() != ''
	)
		target.find('button.categoria.unlock, button.categoria.profile').show();

	/*
	target.find('input[name="cotizacion[empresa][rut]"]').parentTo('span').removeClass('main');
	target.find('input[name="cotizacion[empresa][rut][validate]"]').parentTo('span').removeClass('secondary').addClass('hidden');
	*/
};
