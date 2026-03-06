$(document).ready(function() {
	unaBase.ui.expandable.init();
  var container = $('.sheet');

  $('span[data-name="resumen-neto"]').number(true, 2, ',', '.');
  $('button.profile2').button({icons: {primary: 'ui-icon-pencil'},text: false});

 	// abrir perfil proveedor
  $('button.profile2.empresa').click(function() { 
    if ($('[name="contacto[info][id]"]').val() > 0) {
      unaBase.loadInto.dialog('/v3/views/contactos/content.shtml?id=' + $('[name="contacto[info][id]"]').val() + '&from=dtc', 'Perfil del Contacto ', 'large');
    }
  });

  // Buscar proveedor por alias
  unaBase.toolbox.form.autocomplete({
    fields: [
      { local: 'contacto[info][alias]', remote: 'alias', type: 'search', default: true }, // el primero es default
      { local: 'contacto[info][razon_social]', remote: 'razon_social', type: 'text' },
      { local: 'contacto[info][giro]', remote: 'giro', type: 'text' },
      { local: 'contacto[info][direccion]', remote: 'direccion', type: 'text' },
      { local: 'contacto[info][telefono1]', remote: 'telefonos', type: 'text' }
    ],
    data: {
      entity: 'Empresa'
    },
    //restrict: false,
    restrict: true, // test
    response: function(event, ui) {
      var target = $(this).parentTo('ul');
      target.find('input[name^="contacto[info]"]').not(this).val('');
    },
    change: function(event, ui) {
      var target = $(this).parentTo('ul');
      if ($(this).val() == '') {
        $('button.empresa').hide();
        target.find('input').not(this).val('');
      }
      if ($('[name="contacto[info][id]"]').val() == '' && $(this).val() != '') {
        var element = this;
				if (!access._553) {
					confirm('El cliente "' + $(this).val() + '" no está registrado.' + "\n\n" + '¿Desea crearlo?').done(function(data) {
						if (data) {
							$('[name="contacto[info][id]"]').val('');
							unaBase.loadInto.dialog('/v3/views/contactos/content.shtml?id=0&from=dtc', 'Perfil de Contacto', 'large');

							// Contacto
							target.find('button.profile2.empresa').show();

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
      target.find('button.profile2.empresa').show();
      $('input[name="contacto[info][alias]"]').val((ui.item.text)? ui.item.text : 'Sin Alias');
      $('input[name="contacto[info][id]"]').val(ui.item.id);

      target.find('input[name="contacto[info][razon_social]"]').val(ui.item.razon_social);
      target.find('input[name="contacto[info][rut]"]').val((ui.item.rut_validar)? unaBase.data.rut.format(ui.item.rut) : ui.item.rut);
      target.find('input[name="contacto[info][giro]"]').val(ui.item.giro);
      target.find('input[name="contacto[info][direccion]"]').val(ui.item.direccion);
      target.find('input[name="contacto[info][telefono1]"]').val(ui.item.telefonos);
      $('input[name="des_forma_pago"]').val(ui.item.des_forma_default);

      dtc.data.contacto.id = ui.item.id;
      dtc.data.contacto.alias = ui.item.text;
      dtc.data.contacto.razon_social = ui.item.razon_social;
      dtc.data.contacto.rut = ui.item.rut;
      dtc.data.contacto.giro = ui.item.giro;
      dtc.data.id_forma_pago = ui.item.id_forma_default;
      dtc.data.des_forma_pago = ui.item.des_forma_default;

      dtc.resumen.contactos();

      // verifica duplicacion de ingreso dtc
      if (dtc.data.id_tipo_doc !="" && dtc.data.folio !="" && dtc.data.contacto.id !=0) {
        var status = dtc.validate.duplicate();
        if (status.error == "locked") {
          alert('El documento Nro. "'+ dtc.data.folio +'", ya se encuentra registrado para el mismo proveedor. Ingrese un nuevo número.');
          $('[name="folio"]').val("").focus();
          dtc.data.folio = "";
        }
      }


      return false;
    },
    renderItem: function(ul, item) {
      return $('<li><a><strong class="highlight">' + ((item.text)? item.text : '[Sin Alias]') + '</strong><em>' + ((item.rut_validar)? unaBase.data.rut.format(item.rut) : item.rut) + '</em><span>' + item.razon_social + '</span></a></li>').appendTo(ul);
    }
  });

  /*$('button.show.forma-pago').click(function() {
      $('input[name="forma_pago[descripcion]"]').autocomplete('search', '@').focus();
    });
    $('input[name="forma_pago[descripcion]"]').autocomplete({
      source: function(request, response) {
        $.ajax({
          url: '/4DACTION/_V3_' + 'getFormaPagos',
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
      open: function() {
        $(this).removeClass('ui-corner-all').addClass('ui-corner-top');
      },
      close: function() {
        $(this).removeClass('ui-corner-top').addClass('ui-corner-all');
      },
      focus: function(event, ui) {
        return false;
      },
      response: function(event, ui) {
      },
      select: function(event, ui) {
        $('input[name="forma_pago[descripcion]"]').val(ui.item.des);
        $('input[name="forma_pago[id]"]').val(ui.item.id);
        var fecha = calcula_fecha_vcto_pago_oc(ui.item.id);
        $('input[name="oc[fecha_vcto]"]').val(fecha);
        return false;
      }

    }).data('ui-autocomplete')._renderItem = function(ul, item) {
      return $('<li><a><strong class="highlight">' +  item.des + '</strong></a></li>').appendTo(ul);
    };*/

});
