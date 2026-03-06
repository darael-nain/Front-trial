$(document).ready(function() {


	$( "#dialog-profile-negocio" ).tabs();
	$('button.show').button({icons:{primary: 'ui-icon-carat-1-s'},text: false});
	$('button.edit').button({
		icons: {
			primary: "ui-icon-pencil"
		},
		text: false
	});
	unaBase.toolbox.init();
	unaBase.toolbox.menu.init({
		entity: 'Proyecto',
		presupuesto: true,
		buttons: ['exit', 'save', 'create_cot_from_proyecto' , 'create_ot_from_proyecto' ],
		data: function(){
			//
			//return $('#form-negocios').serializeAnything();
			var values = {
				id: $('#main-container').data('id'),
				text: $('input[name="cotizacion[titulo][text]"]').val(),
				empresa: $('input[name="cotizacion[empresa][id]"]').data('id'),
				contacto: $('input[name="cotizacion[empresa][contacto][id]"]').data('id'),
				jefeProyecto: $('input[name="cotizacion[jefeProyecto]"]').attr('data-login'),
				areaNegocio: $('input[name="cotizacion[areaNegocio]"]').attr('data-id'),
				fechaInicio: $('input[name="proyecto[fecha_inicio_datepicker]"]').val(),
				fechaTermino: $('input[name="proyecto[fecha_termino_datepicker]"]').val()
			};


			return values;
		},
		validate: function() {
			var msgError = '';

			var isValidContent = true;

			var isValidEmpresa = true;
			/*$('input[name^="cotizacion[empresa]"][required]').not('[name^="cotizacion[empresa][contacto]"]').not('[type="checkbox"]').each(function() {
				if ($(this).val() == '') {
					isValidEmpresa = false;
					$(this).invalid();
				}
			});*/

			if (!isValidEmpresa) {
				msgError+= "- Falta seleccionar empresa.<br/>";
				if ($('input[name="cotizacion[empresa][id]"]').data('id'))
					$('button.unlock.empresa').click();
			}


			var isValidContacto = true;
			/*$('input[name^="cotizacion[empresa][contacto]"][required]').each(function() {
				if ($(this).val() == '') {
					isValidContacto = false;
					$(this).invalid();
				}
			});
			if (!isValidContacto) {
				msgError+= "- Falta seleccionar contacto.<br/>";
				if ($('input[name="cotizacion[empresa][contacto][id]"]').data('id'))
					$('button.unlock.contacto').click();
			}*/

			var isValidTitulo = true;
			$('input[name="cotizacion[titulo][text]"]').each(function() {
				if ($(this).val() == '') {
					isValidTitulo = false;
					$(this).invalid();
				}
			});

			if (!isValidTitulo)
				msgError+= "- Falta ingresar título.<br/>";


			if (msgError != '')
        		toastr.error(msgError);

			return isValidContent && isValidEmpresa && isValidContacto && isValidTitulo; // devuelve true o false dependiendo de si pasa o no la validación
		}
	});


	formatCurrency();


	$('section.sheet').find('tfoot .numeric.currency input').number(true, currency.decimals, ',', '.');
	$('section.sheet').find('tfoot .numeric.percent input').number(true, 2, ',', '.');

	$('section.sheet').find('footer .numeric.currency input').number(true, currency.decimals, ',', '.');
	$('section.sheet').find('footer .numeric.percent input:not([name="cotizacion[descuento][porcentaje]"])').number(true, 2, ',', '.');


});
