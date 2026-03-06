
var roundTwo= function(num){    
    return +(Math.round(num + "e+2")  + "e-2");
}

var afterEditEmpresa = function(element) {
  var target = $(element).parentTo('ul');
  target.find('input[name="cotizacion[empresa][id]"]')
    .attr('type', 'search')
    .autocomplete('enable');
  target.find('input[name="cotizacion[empresa][id]"]').attr('placeholder', 'Buscar por alias, RUT, razón social...');
 
  target.find('input[name="cotizacion[empresa][razon_social]"]').attr('readonly', true);
  target.find('input[name="cotizacion[empresa][rut]"]').attr('readonly', true);
  target.find('input[name="cotizacion[empresa][giro]"]').attr('readonly', true);
  
  target.find('input[name="cotizacion[empresa][id]"]').focus();
  target.find('button.empresa.edit').hide();

  if (
    $('input[name="cotizacion[empresa][id]"]').val() != '' ||
    $('input[name="cotizacion[empresa][razon_social]"]').val() != ''
  )
    target.find('button.empresa.unlock, button.empresa.profile').show();
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

  target.find('button.unlock.contacto, button.show.contacto, button.profile.contacto').show();
};

$(document).ready(function() {
	unaBase.ui.expandable.init();
  var container = $('.sheet');
  container.find('button.unlock.empresa, button.profile.empresa, button.show.contacto, button.unlock.contacto, button.profile.contacto').hide();    
  
  var empresa = $('input[name="cotizacion[empresa][id]"]').val();
  var contacto = $('input[name="cotizacion[empresa][contacto][id]"]').val();
  if (empresa!="") {
    container.find('button.unlock.empresa, button.profile.empresa, button.show.contacto').show();      
    if (contacto!="") {
      container.find('button.unlock.contacto, button.profile.contacto').show();
    }
  }
  
  $('span[data-name="resumen-neto"]').number(true, 2, ',', '.');

	$('button.show').button({icons: {primary: 'ui-icon-carat-1-s'},text: false});
	$('button.profile').button({icons: {primary: 'ui-icon-gear'},text: false});
	$('button.unlock').button({icons: {primary: 'ui-icon-unlocked'},text: false});
	$('button.edit.save').button({icons: {primary: 'ui-icon-disk'},text: false});
	$('button.edit.discard').button({icons: {primary: 'ui-icon-close'},text: false});	
	$('.edit.save.empresa, .edit.discard.empresa, .edit.save.contacto, .edit.discard.contacto').hide();

 	// Open profile proveedor
	$('button.profile.empresa').click(function() {
		//unaBase.loadInto.dialog('/v3/views/contactos/pop_perfil.shtml?id=' + $('[name="cotizacion[empresa][id]"]').data('id'), 'Perfil ', 'large');
	   unaBase.loadInto.dialog('/v3/views/contactos/content.shtml?id=' + $('[name="cotizacion[empresa][id]"]').data('id'), 'Perfil de Contacto ', 'large');
  });

	// Open profile contacto
	$('button.profile.contacto').click(function() {
    //unaBase.loadInto.dialog('/v3/views/contactos/pop_perfil.shtml?id=' + $('[name="cotizacion[empresa][contacto][id]"]').data('id'), 'Perfil de Contacto', 'large');
		unaBase.loadInto.dialog('/v3/views/contactos/content.shtml?id=' + $('[name="cotizacion[empresa][contacto][id]"]').data('id'), 'Perfil de Contacto', 'large');
	});

	// ver lista de contactos asociados
	$('button.show.contacto').click(function() {
		var target = $(this).parentTo('ul');
		target.find('input[name="cotizacion[empresa][contacto][id]"][type="search"]').autocomplete('search', '@').focus();
	});
  


  if($('input[name="forma_pago[descripcion]"]').length > 0){
  	// Carga forma pago
    $('button.show.forma-pago').click(function() {          
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
    };
  }

  var resumen_proveedor = function(data){
    $('strong[name="resumen[oc][alias]"]').text(((data.alias)? data.alias : 'Sin Alias').toUpperCase());
    $('span[name="resumen[oc][razon]"]').text(((data.razon)? data.razon : '').toUpperCase());
  }

  // Buscar proveedor por alias
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
      $('input[type="hidden"][name="oc[prov][id]"]').val(ui.item.id);
      $('input[type="hidden"][name="empresa[id]"]').val(ui.item.id);
      
      target.find('input[name="cotizacion[empresa][razon_social]"]').val(ui.item.razon_social);
      target.find('input[name="cotizacion[empresa][rut]"]').val((ui.item.rut_validar)? unaBase.data.rut.format(ui.item.rut) : ui.item.rut);
      target.find('input[name="cotizacion[empresa][giro]"]').val(ui.item.giro);
      target.find('input[name="cotizacion[empresa][direccion]"]').val(ui.item.direccion);
      target.find('input[name="cotizacion[empresa][telefonos]"]').val(ui.item.telefonos);

      // Carga tipo doc según provedor seleccionado
      var modulo = $('section.sheet-gastos').data('modulo');
      if (modulo == "compras") {
        var tipo_gasto = $('input[name="oc[tipo_gastos][id]"]').val();
        var data = {'tipo':tipo_gasto ,'id':ui.item.id_dtc_default, 'des':ui.item.des_dtc_default};
        dtc_change(data);
        //id_dtc_default_old = ui.item.id_dtc_default;
      }

      if (ui.item.id_forma_default != "") {         
          $('input[name="forma_pago[id]"]').val(ui.item.id_forma_default);
          $('input[name="forma_pago[descripcion]"]').val(ui.item.des_forma_default);
          var fechaVcto = calcula_fecha_vcto_pago_oc(ui.item.id_forma_default);
          $('input[name="oc[fecha_vcto]').val(fechaVcto);       
      }

      resumen_proveedor({'alias' : ui.item.text,'razon': ui.item.razon_social});
      
      $('span[name="resumen[oc][dtc]"]').text(((ui.item.des_dtc_default)? ui.item.des_dtc_default : '').toUpperCase());
     
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
          target.find('input[name="asociado[id]"]').val(0);
          $('span[name="resumen[oc][contacto]"]').text("");
         
          $.map(data.rows, function(item) {
            target.find('input[name="cotizacion[empresa][contacto][id]"]').data('id', item.id);
            target.find('input[name="cotizacion[empresa][contacto][id]"]').val(item.nombre_completo);
            target.find('input[name="cotizacion[empresa][contacto][cargo]"]').val(item.cargo);
            target.find('input[name="cotizacion[empresa][contacto][email]"]').val(item.email);
            target.find('input[name="asociado[id]"]').val(item.id);
            $('span[name="resumen[oc][contacto]"]').text(item.nombre_completo.toUpperCase());
          });

          target.find('button.unlock.contacto, button.profile.contacto, button.show.contacto').show();      
          target.find('button.edit.contacto').hide();
        }
      });

      return false;
    },
    renderItem: function(ul, item) {
      return $('<li><a><strong class="highlight">' + ((item.text)? item.text : '[Sin Alias]') + '</strong><em>' + ((item.rut_validar)? unaBase.data.rut.format(item.rut) : item.rut) + '</em><span>' + item.razon_social + '</span></a></li>').appendTo(ul);
    }
  });
 
 // Desbloquea cajones para editar empresa
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

    target.find('input').removeClass("invalid"); 

    target.find('input').not('[type="search"][name^="cotizacion[empresa]"]').not('[type="checkbox"]').removeAttr('readonly');
    target.find('input').not('[type="search"][name^="cotizacion[empresa]"]').not('[type="checkbox"]').removeAttr('readonly');
    target.find('input[type="search"][name^="cotizacion[empresa]"]').removeAttr('placeholder').attr('type', 'text');

    //maskRut(target.find('input[name="cotizacion[empresa][rut]"]'));

    target.find('input[name="cotizacion[empresa][rut]"]').parentTo('span').addClass('main');
    target.find('input[name="cotizacion[empresa][rut][validate]"]').parentTo('span').addClass('secondary').removeClass('hidden');

    target.find('button.empresa').hide();
    target.find('button.edit.empresa').show();

    target.find('input[name="cotizacion[empresa][id]"]').focus();

  });

  // Guarda datos editados de la empresa
  $('button.edit.save.empresa').click(function(event) {

    //alert();

    var validate = true;

    var text = "";
    var localValidate = true;
    var rut = $('input[name="cotizacion[empresa][rut]"]').val();
    var giro = $('input[name="cotizacion[empresa][giro]"]').val();

    if (giro==""){
      text = text + "- Giro.<br>";
      localValidate = false;
    }

    //alert(rut.length);
    //var estado = unaBase.data.rut.validate(rut);    

    if (rut!="") {
      if (!unaBase.data.rut.validate(rut)) {
        text = text + "- Rut ingresado es incorrecto.<br>";
        localValidate = false;
      }        
    }else{
      text = text + "- Rut.<br>";
      localValidate = false;
    }
    
    if (!localValidate)
        $(this).invalid();

    var element = this;
    var fields = {};

    var allFields = ($('input[name^="cotizacion[empresa][contacto]"]').length == 0)? $('input[name^="cotizacion[empresa]"') : $('input[name^="cotizacion[empresa]"').not('input[name^="cotizacion[empresa][contacto]"]');
      allFields.not('[type="checkbox"]').removeClass('invalid');
      allFields.each(function() {
        var tuple = {};

      var name = $(this).attr('name');
      if (name == 'cotizacion[empresa][rut][validate]')
        var value = $(this).prop('checked');
      else
        var value = $(this).val();
      //var localValidate = true;
      //if (value == '' && $('[name="cotizacion[empresa][rut][validate]"]').prop('checked'))
        //localValidate = false;
      /*if (name == 'cotizacion[empresa][rut]') {
        if ($('input[name="cotizacion[empresa][rut][validate]"]').prop('checked') && !unaBase.data.rut.validate(value))
          localValidate = false;
      }*/

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
        
    });
    

    // se guardan los datos
    if (localValidate)
      $.ajax({
        url: '/4DACTION/_V3_setEmpresa',
        dataType: 'json',
        data: fields,
        success: function(data) {         
          if (data.success) {
            if (data.new)
              toastr.info('Contacto ha sido creado correctamente.');
            else
              toastr.info('Contacto ha sido modificado correctamente.');
            $('input[name="cotizacion[empresa][id]"]').data('id', data.id);

            // gastos
            $('input[name="oc[prov][id]"]').val(data.id);

            // dtc
            $('input[name="empresa[id]"]').val(data.id);

            // resumen
            var alias = $('input[name="cotizacion[empresa][id]"]').val();
            var razon = $('input[name="cotizacion[empresa][razon_social]"]').val();
            resumen_proveedor({'alias' : alias,'razon': razon});
            
            //$('h2 [name="cotizacion[empresa][id]"]').text(fields['cotizacion[empresa][id]']);
            //$('h2 [name="cotizacion[empresa][razon_social]"]').text(fields['cotizacion[empresa][razon_social]']);

            afterEditEmpresa(element);
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
      toastr.error('Hay datos faltantes o incorrectos:<br>'+text);
      event.stopImmediatePropagation();
    }
  });
  
  // Descarta cambios al editar la empresa
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

  // Lista de contactos
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

      target.find('button.unlock.contacto, button.profile.contacto ').show();
      target.find('button.edit.contacto').hide();

      $('input[type="search"][name="cotizacion[empresa][contacto][id]"]').val(ui.item.nombre_completo);
      $('input[type="search"][name="cotizacion[empresa][contacto][id]"]').data('id', ui.item.id);

      $('input[type="hidden"][name="asociado[id]"]').val(ui.item.id);
     

      target.find('input[name="cotizacion[empresa][contacto][id]"]').val(ui.item.nombre_completo);
      target.find('input[name="cotizacion[empresa][contacto][cargo]"]').val(ui.item.cargo);
      target.find('input[name="cotizacion[empresa][contacto][email]"]').val(ui.item.email);

      var old_empresa = $('input[name="cotizacion[empresa][id]"]').data('id');
      var new_empresa = ui.item.empresa.id;

      $('span[name="resumen[oc][contacto]"]').text(ui.item.nombre_completo.toUpperCase());
      
      if (!old_empresa) {

        target.find('input[name="cotizacion[empresa][id]"]').data('id', undefined);
        target.find('input[name="cotizacion[empresa][id]"]').val('');
        target.find('input[name="cotizacion[empresa][razon_social]"]').val('');
        target.find('input[name="cotizacion[empresa][rut]"]').val('');

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

  // desbloquear para editar contacto
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

          // gastos
          $('input[name="asociado[id]"]').data('id', data.id);

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

});