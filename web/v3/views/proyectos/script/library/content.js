
var afterEditEmpresa = function(element) {
	var target = $(element).parentTo('ul');

	target.find('input[name="cotizacion[empresa][id]"]')
		.attr('type', 'search')
		.autocomplete('enable');
	target.find('input[name="cotizacion[empresa][id]"]').attr('placeholder', 'Buscar por alias, RUT, razón social...');

	target.find('input[name="cotizacion[empresa][razon_social]"]').attr('readonly', true);

	target.find('input[name="cotizacion[empresa][id]"]').focus();
	target.find('button.empresa.edit').hide();

	if ($('input[name="cotizacion[empresa][id]"]').val() != '' || $('input[name="cotizacion[empresa][razon_social]"]').val() != '')
		target.find('button.empresa.unlock, button.empresa.profile, button.empresa.show').show();
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

var afterEditJefeProyecto = function(element) {
	var target = $(element).parentTo('ul');
	target.find('input[name="cotizacion[jefeProyecto]"]')
		.attr('type', 'search')
		.autocomplete('enable');
	target.find('input[name="cotizacion[jefeProyecto]"]').attr('placeholder', 'Buscar por Nombre y/o Apellidos');
	target.find('input[name="cotizacion[jefeProyecto]"]').focus();
	// target.find('button.contacto.edit').hide();

	/*if (
		$('input[name="cotizacion[empresa][contacto][id]"').val() != ''
	)*/ // revisar
		target.find('button.unlock.jefeProyecto, button.show.jefeProyecto, button.profile.jefeProyecto').show();
};
