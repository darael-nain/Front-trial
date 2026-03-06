
var roundTwo = function (num) {
  return +(Math.round(num + "e+2") + "e-2");
}

var afterEditEmpresa = function (element) {
  var target = $(element).parentTo('ul');
  target.find('input[name="contacto[info][alias]"]').attr('type', 'search').autocomplete('enable');
  target.find('input[name="contacto[info][alias]"]').attr('placeholder', 'Buscar por alias, RUT, razón social...');
  target.find('input[name="contacto[info][razon_social]"]').attr('readonly', true);
  target.find('input[name="contacto[info][rut]"]').attr('readonly', true);
  target.find('input[name="contacto[info][giro]"]').attr('readonly', true);
  target.find('input[name="contacto[info][alias]"]').focus();
  target.find('button.empresa.edit').hide();
  if ($('input[name="contacto[info][id]"]').val() != '' || $('input[name="contacto[info][razon_social]"]').val() != '')
    target.find('button.empresa.unlock, button.empresa.profile').show();
};

var afterEditContacto = function (element) {
  var target = $(element).parentTo('ul');
  target.find('input[name="relacionado[info][nombre]"]').attr('type', 'search').autocomplete('enable');
  target.find('input[name="relacionado[info][nombre]"]').attr('placeholder', 'Buscar por Nombre y/o Apellidos');
  target.find('input[name="relacionado[info][cargo]"], input[name="relacionado[info][email]"]').attr('readonly', true);
  target.find('input[name="contacto[info][alias]"]').focus();
  target.find('button.contacto.edit').hide();
  target.find('button.unlock.contacto, button.show.contacto, button.profile.contacto').show();
};

var set_dtc_proveedor = function (param) {
  if (parseInt(param.prov) > 0 && parseInt(param.dtc) > 0 && parseInt(param.old) != parseInt(param.dtc)) {
    confirm("¿Desea asignar el nuevo documento por defecto para este Proveedor?").done(function (data) {
      if (data) {
        $.ajax({
          url: '/4DACTION/_V3_setContacto',
          dataType: 'json',
          data: {
            'contact[id]': param.prov,
            'contact[id_dtc_defecto]': param.dtc
          },
          success: function (data) {
            if (data.success) {
              toastr.success('Documento fue asignado correctamente.');
            } else {
              if (data.readonly) {
                toastr.error(NOTIFY.get('ERROR_RECORD_READONLY', 'Error'));
              } else {
                toastr.error(NOTIFY.get('ERROR_INTERNAL', 'Error'));
              }
            }
          },
          error: function (xhr, text, error) {
            toastr.error('Falló conexión al servidor.');
          }
        });
      }
    });
  }
}

var set_tipopago_proveedor = function (param) {
  if (parseInt(param.prov) > 0 && param.tipopago != "" && param.old != param.dtc) {
    confirm("¿Desea asignar el nuevo tipo de pago por defecto para este Proveedor?").done(function (data) {
      if (data) {
        $.ajax({
          url: '/4DACTION/_V3_setContacto',
          dataType: 'json',
          data: {
            'contact[id]': param.prov,
            'contact[tipo_pago]': param.tipopago
          },
          success: function (data) {
            if (data.success) {
              toastr.success('Tipo de pago fue asignado correctamente.');
            } else {
              if (data.readonly) {
                toastr.error(NOTIFY.get('ERROR_RECORD_READONLY', 'Error'));
              } else {
                toastr.error(NOTIFY.get('ERROR_INTERNAL', 'Error'));
              }
            }
          },
          error: function (xhr, text, error) {
            toastr.error('Falló conexión al servidor.');
          }
        });
      }
    });
  }
};

var set_banco_proveedor = function (param) {
  if (parseInt(param.prov) > 0 && param.id_banco != "" && param.old != param.dtc) {
    confirm("¿Desea asignar el nuevo banco por defecto para este Proveedor?").done(function (data) {
      if (data) {
        $.ajax({
          url: '/4DACTION/_V3_setContacto',
          dataType: 'json',
          data: {
            'contact[id]': param.prov,
            'contact[banco]': param.id_banco
          },
          success: function (data) {
            if (data.success) {
              toastr.success('Banco fue asignado correctamente.');
            } else {
              if (data.readonly) {
                toastr.error(NOTIFY.get('ERROR_RECORD_READONLY', 'Error'));
              } else {
                toastr.error(NOTIFY.get('ERROR_INTERNAL', 'Error'));
              }
            }
          },
          error: function (xhr, text, error) {
            toastr.error('Falló conexión al servidor.');
          }
        });
      }
    });
  }
};

var set_tipocuenta_proveedor = function (param) {
  if (parseInt(param.prov) > 0 && param.tipo_cuenta != "" && param.old != param.dtc) {
    confirm("¿Desea asignar el nuevo tipo de cuenta por defecto para este Proveedor?").done(function (data) {
      if (data) {
        $.ajax({
          url: '/4DACTION/_V3_setContacto',
          dataType: 'json',
          data: {
            'contact[id]': param.prov,
            'contact[tipo_cuenta]': param.tipo_cuenta
          },
          success: function (data) {
            if (data.success) {
              toastr.success('Tipo de cuenta fue asignado correctamente.');
            } else {
              if (data.readonly) {
                toastr.error(NOTIFY.get('ERROR_RECORD_READONLY', 'Error'));
              } else {
                toastr.error(NOTIFY.get('ERROR_INTERNAL', 'Error'));
              }
            }
          },
          error: function (xhr, text, error) {
            toastr.error('Falló conexión al servidor.');
          }
        });
      }
    });
  }
};

var set_nrocuenta_proveedor = function (param) {
  if (parseInt(param.prov) > 0 && param.nro_cuenta != "" && param.old != param.dtc) {
    confirm("¿Desea asignar el nuevo número de cuenta por defecto para este Proveedor?").done(function (data) {
      if (data) {
        $.ajax({
          url: '/4DACTION/_V3_setContacto',
          dataType: 'json',
          data: {
            'contact[id]': param.prov,
            'contact[nro_cuenta]': param.nro_cuenta
          },
          success: function (data) {
            if (data.success) {
              toastr.success('Número de cuenta fue asignado correctamente.');
            } else {
              if (data.readonly) {
                toastr.error(NOTIFY.get('ERROR_RECORD_READONLY', 'Error'));
              } else {
                toastr.error(NOTIFY.get('ERROR_INTERNAL', 'Error'));
              }
            }
          },
          error: function (xhr, text, error) {
            toastr.error('Falló conexión al servidor.');
          }
        });
      }
    });
  }
};

var set_mx_clabe = function (param) {

  if (parseInt(param.prov) > 0 && param.nro_cuenta != "" && param.old != param.dtc) {
    confirm("¿Desea asignar clabe por defecto para este Proveedor?").done(function (data) {
      if (data) {
        $.ajax({
          url: '/4DACTION/_V3_setContacto',
          dataType: 'json',
          data: {
            'contact[id]': param.prov,
            'contact[mx_clabe]': param.mx_clabe
          },
          success: function (data) {
            if (data.success) {
              toastr.success('Clabe Interbancaria fue asignada correctamente.');
            } else {
              if (data.readonly) {
                toastr.error(NOTIFY.get('ERROR_RECORD_READONLY', 'Error'));
              } else {
                toastr.error(NOTIFY.get('ERROR_INTERNAL', 'Error'));
              }
            }
          },
          error: function (xhr, text, error) {
            toastr.error('Falló conexión al servidor.');
          }
        });
      }
    });
  }
};

var set_fpago_proveedor = function (param) {
  if (parseInt(param.prov) > 0 && parseInt(param.fpago) > 0 && parseInt(param.old) != parseInt(param.dtc)) {
    confirm("¿Desea asignar la forma de pago por defecto para este Proveedor?").done(function (data) {
      if (data) {
        $.ajax({
          url: '/4DACTION/_V3_setContacto',
          dataType: 'json',
          data: {
            'contact[id]': param.prov,
            'contact[id_fpago_defecto]': param.fpago
          },
          success: function (data) {
            if (data.success) {
              toastr.success('La forma de pago fue asignado correctamente.');
            } else {
              if (data.readonly) {
                toastr.error(NOTIFY.get('ERROR_RECORD_READONLY', 'Error'));
              } else {
                toastr.error(NOTIFY.get('ERROR_INTERNAL', 'Error'));
              }
            }
          },
          error: function (xhr, text, error) {
            toastr.error('Falló conexión al servidor.');
          }
        });
      }
    });
  }
}

var dtc_change = function (data) {
  if (data.tipo == "FXR" || data.tipo == "FTG") {
    $('[name="tipo_doc[descripcion]"]').val("RENDICION");
    $('[name="tipo_doc[id]"]').val("200");
    $('table.items > tbody > tr[data-tipo="ITEM"] > td > input[name="oc[detalle_item][imp][id]"]').val("3");
    $('table.items > tbody > tr[data-tipo="ITEM"] > td > input[name="oc[detalle_item][imp][id]"]').data('valorimp', "0");
    $('table.items > tbody > tr[data-tipo="ITEM"] > td > input[name="oc[detalle_item][imp][id]"]').data('tipoimp', "EXENTO");
    $('table.items > tbody > tr[data-tipo="ITEM"] > td > input[name="oc[detalle_item][imp][des]"]').val("EXENTO");
  } else {
    $('input[name="tipo_doc[id]"]').val(data.id);
    $('input[name="tipo_doc[descripcion]"]').val(data.des);
    $.each(get_impuesto_by_doc(data.id).rows, function (key, item) {
      if (item.defecto) {
        $('table.items > tbody > tr[data-tipo="ITEM"] > td > input[name="oc[detalle_item][imp][id]"]').val(item.id);
        $('table.items > tbody > tr[data-tipo="ITEM"] > td > input[name="oc[detalle_item][imp][id]"]').data('valorimp', item.valor);
        $('table.items > tbody > tr[data-tipo="ITEM"] > td > input[name="oc[detalle_item][imp][id]"]').data('tipoimp', item.tipo);
        $('table.items > tbody > tr[data-tipo="ITEM"] > td > input[name="oc[detalle_item][imp][des]"]').val(item.des);
      }
    });

    oc_cambia_titulo_box_dtc(data.des);
    update_impuestos_multiples_view(data.id);


  }
  $('span[name="resumen[oc][dtc]"]').text(((data.des) ? data.des : '').toUpperCase());
  update_subtotal_items();
};

var tipopago_change = function (data) {
  $('[name="tipo_pago[descripcion]"]').val(data.des);
};

var idbanco_change = function (data) {
  $('[name="tipo_pago[transferencia][id_banco]"]').val(data.id);
  $('[name="tipo_pago[transferencia][nombre_banco]"]').val(data.des);
};

var tipocuenta_change = function (data) {
  $('[name="tipo_pago[transferencia][tipo_cuenta]"]').val(data.des);
};

const setFormaPagosCompras = () => {
  if (compras.tipoGasto && compras.tipoGasto != "FTG") {
    if (!compras) {
      return;
    }
    $.ajax({
      url: window.origin + '/4DACTION/_V3_getFormaPagos?compra=true',
      dataType: "json",
      success: function (data) {
        const id_forma_pago = document.getElementById('forma_pago[id]');
        let select = document.getElementById('formas_pagos');

        data.rows.forEach(v => {
          let option = document.createElement('option');
          option.text = v.text;
          option.value = v.id;
          select.appendChild(option);
        });

        // Inicializar Tom Select
        let settings = {
          create: true,
          sortField: {
            field: "text",
            direction: "asc"
          },
          render: {
            option_create: function (data, escape) {
              return '<div class="create">Agregar <strong>' + escape(data.input) + '</strong>&hellip;</div>';
            },
            no_results: function (data, escape) {
              return '<div class="no-results">Sin resultados</div>';
            },
          }
        };
        let tomSelect = new TomSelect(select, settings);

        // Añadir evento al botón para mostrar las opciones
        document.querySelector('.formas_pago').addEventListener('click', function () {
          tomSelect.open();
        });

        // Establecer valor por defecto si existe
        tomSelect.setValue(id_forma_pago.value, true);

        // Manejar la adición de items
        tomSelect.on('item_add', function (value, item) {
          
          id_forma_pago.value = value != '' && !isNaN(value) ? value : id_forma_pago.value;
          compras.checkFechasPago(value)
        });



        // Función para añadir la nueva opción
        async function handleOptionAdd(value, item) {
          const url = `${location.origin}/4DACTION/_V3_setFormaspago`;
          let formData = new FormData();
          formData.append('create', true);
          formData.append('id', compras.id);
          formData.append('sid', unaBase.sid.encoded());
          formData.append('descripcion', value);
          formData.append('estado', true);
          formData.append('compra', true);
          const response = await axios.post(url, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          id_forma_pago.value = response.data.id;
          toastr.success('Forma de pago creada!');
        }

        // Manejar la adición de nuevas opciones
        tomSelect.on('option_add', function (value, item) {
          if (this.options[value] && this.options[value].$order) {
            this.lock();
            confirmationDialog.show();
            let title = document.querySelector('.custom-modal-body-p p');
            title.textContent = 'Esta forma de pago no existe, ¿desea agregarla?';
            let self = this;
            console.log('EVENTO ADD')

            confirmationDialog.setOnAccept(async () => {
              console.log('EVENTO CLICK')
              
              await handleOptionAdd(value, item);
              self.unlock();
              confirmationDialog.hide();
            });

            confirmationDialog.setOnCancel(() => {
              let lastOptionKey = Object.keys(this.options).pop();
              if (lastOptionKey) {
                this.removeOption(lastOptionKey);
              }
              
              this.addItem(id_forma_pago.value);
              self.unlock();
              confirmationDialog.hide();
            });
            return false;
          }
        });
      },
      error: function (xhr, text, error) {
        toastr.error("Error");
      }
    });
  }
}

$(document).ready(function () {
  unaBase.ui.expandable.init();
  var container = $('.sheet');
  container.find('button.unlock.empresa, button.profile2.empresa, button.profile2.empresa_ce, button.show.contacto, button.unlock.contacto, button.profile.contacto').hide();

  var empresa = $('input[name="contacto[info][alias]"]').val();
  var empresa_ce = $('input[name="contacto[info][alias]"]').val();

  var contacto = $('input[name="relacionado[info][nombre]"]').val();
  
  if (empresa != "") {
    container.find('button.unlock.empresa, button.profile2.empresa, button.show.contacto').show();
    if (contacto != "") {
      container.find('button.unlock.contacto, button.profile.contacto').show();
    }
  }
  if (empresa_ce != "") {
    container.find('button.unlock.empresa, button.profile2.empresa_ce').show();
  }

  const id_contacto = document.querySelector('input[name="contacto[info][alias]"]').dataset?.id
  
  if (id_contacto != '' && id_contacto != '0') {
    container.find('button.profile2.empresa').show();
  }
  $('span[data-name="resumen-neto"]').number(true, 2, ',', '.');

  $('button.show').button({ icons: { primary: 'ui-icon-carat-1-s' }, text: false });
  $('button.profile2').button({ icons: { primary: 'ui-icon-pencil' }, text: false });
  $('button.profile').button({ icons: { primary: 'ui-icon-gear' }, text: false });
  $('button.unlock').button({ icons: { primary: 'ui-icon-unlocked' }, text: false });
  $('button.edit.save').button({ icons: { primary: 'ui-icon-disk' }, text: false });
  $('button.edit.discard').button({ icons: { primary: 'ui-icon-close' }, text: false });
  $('.edit.save.empresa, .edit.discard.empresa, .edit.save.contacto, .edit.discard.contacto').hide();

  // abrir perfil proveedor
  $('button.profile2.empresa').click(function () {
    if ($('[name="contacto[info][id]"]').val() > 0) {
      if(compras.tipoGasto == "FTG"){
        compras.editInput = 'cedente'
      }
      unaBase.loadInto.dialog('/v3/views/contactos/content.shtml?id=' + $('[name="contacto[info][id]"]').val() + '&from=gastos', 'Perfil del Contacto ', 'large');
    }
  });

  // abrir perfil proveedor
  $('button.profile2.empresa_ce').click(function () {
    if ($('[name="contacto[info][id_ce]"]').val() > 0) {
      if(compras.tipoGasto == "FTG"){
        compras.editInput = 'cesionario'
      }
      unaBase.loadInto.dialog('/v3/views/contactos/content.shtml?id=' + $('[name="contacto[info][id_ce]"]').val() + '&from=gastos', 'Perfil del Contacto ', 'large');
    }
  });

  // abrir perfil contacto
  $('button.profile.contacto').click(function () {
    if ($('[name="relacionado[info][id]"]').val() > 0) {
      unaBase.loadInto.dialog('/v3/views/contactos/content.shtml?id=' + $('[name="relacionado[info][id]"]').val(), 'Perfil del Contacto', 'large');
    }
  });

  // ver lista de contactos asociados
  $('button.show.contacto').click(function () {
    var target = $(this).parentTo('ul');
    target.find('input[name="relacionado[info][nombre]"][type="search"]').autocomplete('search', '@').focus();
  });

  // FORMA DE PAGO
  //if($('input[name="forma_pago[descripcion]"]').length > 0){
  $('button.show.forma-pago').click(function () {
    id_fpago_default_old = $('input[name="forma_pago[id]"]').val();
    $('input[name="forma_pago[descripcion]"]').autocomplete('search', '@').focus();
  });
  $('.forma-pago-custom').invisible();

  // $('input[name="forma_pago[descripcion]"]').autocomplete({
  //   source: function (request, response) {
  //     $.ajax({
  //       url: '/4DACTION/_V3_' + 'getFormaPagos?compra=true',
  //       dataType: 'json',
  //       data: {
  //         q: request.term
  //       },
  //       success: function (data) {
  //         response($.map(data.rows, function (item) {
  //           return item;
  //         }));
  //       }
  //     });
  //   },
  //   minLength: 0,
  //   autoFocus: true,
  //   open: function () {
  //     $(this).removeClass('ui-corner-all').addClass('ui-corner-top');
  //   },
  //   close: function () {
  //     $(this).removeClass('ui-corner-top').addClass('ui-corner-all');
  //   },
  //   focus: function (event, ui) {
  //     return false;
  //   },
  //   response: function (event, ui) {
  //   },
  //   select: function (event, ui) {
  //     compras.checkFechasPago(ui.item.id)

  //     $('input[name="forma_pago[descripcion]"]').val(ui.item.des);
  //     $('input[name="forma_pago[id]"]').val(ui.item.id);
  //     if (ui.item.id != "-1") {
  //       $('.forma-pago-custom').invisible();
  //       $('.forma-pago-custom').find('input').val('');
  //       if (!access._507) {
  //         //$('input[name="oc[fecha_vcto]"]').prop('readonly', true).datepicker('destroy');
  //       }
  //     } else {
  //       $('.forma-pago-custom').visible();
  //       if (!access._507) {
  //         //$('input[name="oc[fecha_vcto]"]').prop('readonly', false).datepicker();
  //       }


  //       //$('input[name="oc[fecha_vcto]"]').val('');
  //     }
  //     set_fpago_proveedor({
  //       fpago: ui.item.id,
  //       prov: $('input[name="contacto[info][id]"]').val(),
  //       old: id_fpago_default_old
  //     });
  //     return false;
  //   }

  // }).data('ui-autocomplete')._renderItem = function (ul, item) {
  //   return $('<li><a><strong class="highlight">' + item.des + '</strong></a></li>').appendTo(ul);
  // };
  //}

  var resumen_proveedor = function (data) {
    $('strong[name="resumen[oc][alias]"]').text(((data.alias) ? data.alias : 'Sin Alias').toUpperCase());
    $('span[name="resumen[oc][razon]"]').text(((data.razon) ? data.razon : '').toUpperCase());
  }

  var resumen_proveedor_ce = function (data) {
    $('strong[name="resumen[oc][alias_ce]"]').text(((data.alias) ? data.alias : 'Sin Alias').toUpperCase());
    $('span[name="resumen[oc][razon_ce]"]').text(((data.razon) ? data.razon : '').toUpperCase());
  }

  // Buscar proveedor por alias
  unaBase.toolbox.form.autocomplete({
    fields: [
      { local: 'contacto[info][alias]', remote: 'alias', type: 'search', default: true }
    ],
    data: {
      entity: 'Empresa',
      otherParams: {
        from: 'oc'
      }
    },
    //restrict: false,
    restrict: true, // test
    response: function (event, ui) {
      var target = $(this).parentTo('ul');
      target.find('input[name^="contacto[info]"]').not(this).val('');
    },
    change: function (event, ui) {
      var target = $(this).parentTo('ul');
      
      if ($(this).val() == '') {
        $('button.empresa').hide();
        target.find('input').not(this).val('');
        document.querySelector('input[type="search"][name="contacto[info][alias]"]').dataset.id = ''
      }

      if ($('[name="contacto[info][id]"]').val() == '' && $(this).val() != '') {
        var element = this;
        if (!access._552) {
          confirm('El proveedor "' + $(this).val() + '" no está registrado.' + "\n\n" + '¿Desea crearlo?').done(function (data) {
            if (data) {
              $('[name="contacto[info][id]"]').val('');
              target.parent().find('input[name^="relacionado[info]"]').val('');
              unaBase.loadInto.dialog('/v3/views/contactos/content.shtml?id=0&from=gastos', 'Perfil de Contacto', 'large');

              // Contacto
              target.find('button.profile2.empresa').show();

              // Relacionado
              target.find('button.contacto').hide();

            } else {
              $(element).val('');
              setTimeout(
                function () { $(element).focus(); }
                , 500);
            }
          });
        } else {
          $(element).val('');
          setTimeout(
            function () { $(element).focus(); }
            , 500);
        }

      }

    },
    select: function (event, ui) {
      $('[name="tipo_pago[descripcion]"]').val('');
      $('[name="tipo_doc[id]"]').data('tipoimp', ui.item.tipo_imp);
      $('[name="tipo_doc[id]"]').data('valorimp', ui.item.valor_imp);

      var target = $(this).parentTo('ul');
      target.find('button.profile2.empresa').show();
      target.find('button.profile.contacto').hide();

      $('input[type="search"][name="contacto[info][alias]"]').val((ui.item.text) ? ui.item.text : 'Sin Alias');
      $('input[type="search"][name="contacto[info][alias]"]').data('id', ui.item.id);
      $('input[type="hidden"][name="contacto[info][id]"]').val(ui.item.id);
      target.find('input[name="contacto[info][razon_social]"]').val(ui.item.razon_social);
      target.find('input[name="contacto[info][rut]"]').val((ui.item.rut_validar) ? unaBase.data.rut.format(ui.item.rut) : ui.item.rut);
      target.find('input[name="contacto[info][giro]"]').val(ui.item.giro);
      target.find('input[name="contacto[info][direccion]"]').val(ui.item.direccion);
      target.find('input[name="contacto[info][telefono1]"]').val(ui.item.telefonos);
      target.find('input[name="contacto[info][email]"]').val(ui.item.email);

      // Nuevas asignaciones
      
      if (document.querySelector('input[name="contacto[info][no_aba_bic]"]')) {
        document.querySelector('input[name="contacto[info][no_aba_bic]"]').value = ui.item.no_aba_banco_intermediario;
      }
      if (document.querySelector('input[name="contacto[info][no_swift_bic]"]')) {
        document.querySelector('input[name="contacto[info][no_swift_bic]"]').value = ui.item.no_swift_banco_intermediario;
      }
      if (document.querySelector('input[name="contacto[info][direccion_bic]"]')) {
        document.querySelector('input[name="contacto[info][direccion_bic]"]').value = ui.item.direccion_banco_intermediario;
      }
      if (document.querySelector('input[name="contacto[info][beneficiario_bn]"]')) {
        document.querySelector('input[name="contacto[info][beneficiario_bn]"]').value = ui.item.nombre_beneficiario_banco_nacional;
      }
      if (document.querySelector('input[name="contacto[info][codigo_swift_bn]"]')) {
        document.querySelector('input[name="contacto[info][codigo_swift_bn]"]').value = ui.item.codigo_swift_banco_nacional;
      }
      if (document.querySelector('input[name="contacto[info][direccion_bn]"]')) {
        document.querySelector('input[name="contacto[info][direccion_bn]"]').value = ui.item.direccion_beneficiario_cuenta_nacional;
      }



      // dtc
      var tipo_gasto = $('input[name="oc[tipo_gastos][id]"]').val();
      var data = { 'tipo': tipo_gasto, 'id': ui.item.id_dtc_default, 'des': ui.item.des_dtc_default };
      dtc_change(data);

      // forma pago
      if (ui.item.id_forma_default != "" && (tipo_gasto != "FXR" || tipo_gasto != "FTG")) {
        $('input[name="forma_pago[id]"]').val(ui.item.id_forma_default);
        $('input[name="forma_pago[descripcion]"]').val(ui.item.des_forma_default);
        var fechaVcto = calcula_fecha_vcto_pago_oc(ui.item.id_forma_default);
        $('input[name="oc[fecha_vcto]').val(fechaVcto);
      }

      if (ui.item.tipopago_default != "") {
        $('input[name="tipo_pago[descripcion]"]').val(ui.item.tipopago_default);
      }


      if (compras.newAccountingSystem) {
        let modulo = $('section#sheet-compras')[0].dataset.tipogasto;

        let idContact = $('input[name="contacto[info][id]"]').val();
        $.ajax({
          url: '/4DACTION/_V3_getCuentasContacto',
          dataType: 'json',
          data: {
            "id": idContact,
            "modulo": modulo

          },
          success: function (data) {

            let asig = "";





            if (data.rows.length == 0) {

              alert("No hay cuenta bancaria para ese contacto y/o no se le ha asignado una por defecto para este modulo");
              $('input#cuenta_asig').val(asig);
              $('input[name="contact[cuenta]num"]').val("0");
              $('input[name="tipo_pago[transferencia][tipo_cuenta]"]').val("");
              $('input[name="tipo_pago[transferencia][nombre_banco]"]').val("");
              $('input[name="tipo_pago[transferencia][id_banco]"]').val("");
              $('input[name="tipo_pago[transferencia][nro_cuenta]"]').val("");
              $('input[name="tipo_pago[transferencia][mx_clabe]"]').val("");

            } else {

              if (data.rows[0].asig == "oc") {
                asig = "Orden de compra";
              } else {
                if (data.rows[0].asig == "fxr") {
                  asig = "Rendición";
                } else {
                  asig = "Adicional";
                }
              }
              $('input#cuenta_asig').val(asig);
              $('input[name="contact[cuenta]num"]').val(data.rows[0].accountId);
              $('input[name="tipo_pago[transferencia][tipo_cuenta]"]').val(data.rows[0].accountType);
              $('input[name="tipo_pago[transferencia][nombre_banco]"]').val(data.rows[0].bank);
              $('input[name="tipo_pago[transferencia][id_banco]"]').val(data.rows[0].idBank);
              $('input[name="tipo_pago[transferencia][nro_cuenta]"]').val(data.rows[0].accountNumber);
              $('input[name="tipo_pago[transferencia][mx_clabe]"]').val(data.rows[0].accountMxClabe);

            }
          }
        });

      } else {

        if (ui.item.id_banco_default != "") {
          $('input[name="tipo_pago[transferencia][id_banco]"]').val(ui.item.id_banco_default);
        }
        if (ui.item.nombre_banco_default != "") {
          $('input[name="tipo_pago[transferencia][nombre_banco]"]').val(ui.item.nombre_banco_default);
        }
        if (ui.item.tipo_cuenta_default != "") {
          $('input[name="tipo_pago[transferencia][tipo_cuenta]"]').val(ui.item.tipo_cuenta_default);
        }
        if (ui.item.nro_cuenta_default != "") {
          $('input[name="tipo_pago[transferencia][nro_cuenta]"]').val(ui.item.nro_cuenta_default);
        }
        if (ui.item.mx_clabe_default != "") {
          $('input[name="tipo_pago[transferencia][mx_clabe]"]').val(ui.item.mx_clabe_default);
        }

      }




      var fields = [
        $('[name="contact[cuenta_asig]gasto"]').closest('li'),
        $('[name="contact[cuenta]num"]').closest('li'),
        $('[name="tipo_pago[transferencia][nombre_banco]"]').closest('li'),
        $('[name="tipo_pago[transferencia][tipo_cuenta]"]').closest('li'),
        $('[name="tipo_pago[transferencia][nro_cuenta]"]').closest('li'),
        $('[name="tipo_pago[transferencia][mx_clabe]"]').closest('li')
      ];

      if (ui.item.tipopago_default == "TRANSFERENCIA") {
        $.each(fields, function (key, item) {
          item.removeClass('transferencia');
        });
      } else {
        $.each(fields, function (key, item) {
          item.addClass('transferencia');
        });
      }

      // tipo pago

      $('span[name="resumen[oc][dtc]"]').text(((ui.item.des_dtc_default) ? ui.item.des_dtc_default : '').toUpperCase());
      resumen_proveedor({ 'alias': ui.item.text, 'razon': ui.item.razon_social });

      // relacionado
      $.ajax({
        url: '/4DACTION/_V3_getContactoByEmpresa',
        dataType: 'json',
        async: false,
        data: {
          id: ui.item.id,
          default: true,
          strict: true
        },
        success: function (data) {
          var target_data_extra = $('datos-extras').parentTo('ul');
          
          var target = $('input[type="search"][name="relacionado[info][nombre]"]').parentTo('ul');
          target.find('input[name="relacionado[info][nombre]"]').val('');
          target.find('input[name="relacionado[info][id]"]').val('');
          target.find('input[name="relacionado[info][cargo]"]').val('');
          target.find('input[name="relacionado[info][email]"]').val('');
          $('span[name="resumen[oc][contacto]"]').text("");
          $.map(data.rows, function (item) {
            target.find('input[name="relacionado[info][nombre]"]').val(item.nombre_completo);
            target.find('input[name="relacionado[info][cargo]"]').val(item.cargo);
            target.find('input[name="relacionado[info][email]"]').val(item.email);
            target.find('input[name="relacionado[info][id]"]').val(item.id);
            $('span[name="resumen[oc][contacto]"]').text(item.nombre_completo.toUpperCase());
          });

          target.find('button.show.contacto').show();
          if (data.rows.length > 0) {
            target.find('button.unlock.contacto, button.profile.contacto').show();
          };


        }
      });

      return false;
    },
    renderItem: function (ul, item) {
      return $('<li><a><strong class="highlight">' + ((item.text) ? item.text : '[Sin Alias]') + '</strong><em>' + ((item.rut_validar) ? unaBase.data.rut.format(item.rut) : item.rut) + '</em><span>' + item.razon_social + '</span></a></li>').appendTo(ul);
    }
  });

  // Lista de contactos
  unaBase.toolbox.form.autocomplete({
    fields: [
      { local: 'relacionado[info][nombre]', remote: 'nombre_completo', type: 'search', default: true },
      { local: 'relacionado[info][cargo]', remote: 'cargo', type: 'text' },
      { local: 'relacionado[info][email]', remote: 'razon_social', type: 'email' }
    ],
    data: {
      entity: 'Contacto',
      filter: 'nombre_completo',
      relationship: function () {
        return {
          key: 'Empresa',
          id: $('input[name="contacto[info][id]"]').val()
        }
      }
    },
    restrict: false,
    response: function (event, ui) {
      var target = $(this).parentTo('ul');
      $('[name="relacionado[info][id]"]').val('');
      target.find('input[name^="relacionado[info]"]').not(this).val('');
    },
    change: function (event, ui) {
      var target = $(this).parentTo('ul');

      if ($(this).val() == '') {
        target.find('button.unlock.contacto, button.profile.contacto').hide();
      }

      if ($('[name="relacionado[info][id]"]').val() == "" && $(this).val() != '') {
        var element = this;
        if (!access._552) {
          confirm('El contacto "' + $(this).val() + '" no está registrado.' + "\n\n" + '¿Desea crearlo?').done(function (data) {
            if (data) {
              $('[name="relacionado[info][id]"]').val('');
              $('button.unlock.contacto').click();
            } else {
              target.find('input[type="search"][name^="relacionado[info]"]').val('');
              target.find('button.unlock.contacto, button.profile.contacto').hide();
              setTimeout(
                function () { $(element).focus(); }
                , 500);
            }
          });
        } else {
          target.find('input[type="search"][name^="relacionado[info]"]').val('');
          target.find('button.unlock.contacto, button.profile.contacto').hide();
          setTimeout(
            function () { $(element).focus(); }
            , 500);
        }

      }

    },
    select: function (event, ui) {
      var target = $('input[type="search"][name="relacionado[info][nombre]"]').parentTo('ul');
      target.find('button.unlock.contacto, button.profile.contacto ').show();
      target.find('button.edit.contacto').hide();
      $('input[type="search"][name="relacionado[info][nombre]"]').val(ui.item.nombre_completo);
      target.find('input[name="relacionado[info][id]"]').val(ui.item.id);
      target.find('input[name="relacionado[info][cargo]"]').val(ui.item.cargo);
      target.find('input[name="relacionado[info][email]"]').val(ui.item.email);

      var old_empresa = $('input[name="contacto[info][id]"]').val();
      var new_empresa = ui.item.empresa.id;

      $('span[name="resumen[oc][contacto]"]').text(ui.item.nombre_completo.toUpperCase());

      if (!old_empresa) {
        target.find('input[name="contacto[info][id]"]').val('');
        target.find('input[name="contacto[info][razon_social]"]').val('');
        target.find('input[name="contacto[info][rut]"]').val('');
        $.ajax({
          url: '/4DACTION/_V3_getEmpresa',
          dataType: 'json',
          async: false,
          data: {
            q: new_empresa,
            filter: 'id',
            from: 'oc'
          },
          success: function (data) {
            var target = $('input[type="search"][name="contacto[info][alias]"]').parentTo('ul');

            $.map(data.rows, function (item) {
              target.find('input[name="contacto[info][alias]"]').val(item.text);
              target.find('input[name="contacto[info][razon_social]"]').val(item.razon_social);
              target.find('input[name="contacto[info][rut]"]').val(item.rut);
              target.find('input[name="contacto[info][id]"]').val(item.id);

            });



            $('button.empresa').show();
            $('button.empresa.edit').hide();
          }
        });
      }

      return false;
    },
    renderItem: function (ul, item) {
      return $('<li><a><strong class="highlight">' + item.nombre_completo + '</strong><em>' + item.cargo + '</em><span>' + item.email + '</span></a></li>').appendTo(ul);
    }
  });

  // desbloquear para editar contacto
  $('button.unlock.contacto').click(function () {
    var target = $(this).parentTo('ul');

    target.find('input[name^="relacionado[info]"][type="search"]').each(function (key, item) {
      try {
        $(item).autocomplete('disable');
      } catch (e) {
        // Si no se puede deshabilitar, se deja pasar la excepción
      }
    });

    target.find('input[name^="relacionado[info]"]').not('[type="search"]').removeAttr('readonly');
    target.find('input[name^="relacionado[info]"][type="search"]').removeAttr('placeholder').attr('type', 'text');

    target.find('button.show.contacto, button.unlock.contacto, button.profile.contacto').hide();
    target.find('button.edit.contacto').show();
    target.find('input[name="relacionado[info][nombre]"]').focus();
  });

  // botones editar y guardar contacto
  $('button.edit.save.contacto').click(function () {
    var element = this;
    var fields = {
      'fk': $('input[name="contacto[info][id]"]').val(),
      'id': $('input[name="relacionado[info][id]"]').val(),
      'cotizacion[empresa][contacto][id]': $('input[name="relacionado[info][nombre]"]').val(),
      'cotizacion[empresa][contacto][cargo]': $('input[name="relacionado[info][cargo]"]').val(),
      'cotizacion[empresa][contacto][email]': $('input[name="relacionado[info][email]"]').val()
    };
    $.ajax({
      url: '/4DACTION/_V3_setContactoByEmpresa',
      dataType: 'json',
      data: fields,
      success: function (data) {
        if (data.success) {
          if (data.new) {
            toastr.info('Contacto fue creado correctamente.');
          } else {
            toastr.info('Contacto fue modificado correctamente.');
          }
          $('input[name="relacionado[info][id]"]').val(data.id);
          $('h2 [name="relacionado[info][id]"]').text(fields['relacionado[info][id]']);
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
        }
      },
      error: function (xhr, text, error) {
        toastr.error('Falló conexión al servidor.');
      }
    });
  });

  // descartar creacion de relacionado
  $('button.edit.discard.contacto').click(function (event) {
    var element = this;
    confirm('¿Desea descartar los cambios?').done(function (data) {
      if (data) {
        var target = $(element).parentTo('ul');
        var id = target.find('input[name="relacionado[info][id]"]').val();
        target.find('input[name^="relacionado[info]"]').val('');
        $.ajax({
          url: '/4DACTION/_V3_getContacto',
          dataType: 'json',
          data: {
            q: id,
            filter: 'id'
          },
          success: function (data) {
            $.map(data.rows, function (item) {
              target.find('input[name="relacionado[info][id]"]').val(item.id);
              target.find('input[name="relacionado[info][nombre]"]').val(item.nombre_completo);
              target.find('input[name="relacionado[info][cargo]"]').val(item.cargo);
              target.find('input[name="relacionado[info][email]"]').val(item.email);
            });
            afterEditContacto(element);
          }
        });
      }
    });
    event.stopImmediatePropagation();
  });

  // -- ini - buscar por alias cesioanrio
  unaBase.toolbox.form.autocomplete({
    fields: [
      { local: 'contacto[info][alias_ce]', remote: 'alias', type: 'search', default: true }, // el primero es default
      { local: 'contacto[info][razon_social_ce]', remote: 'razon_social', type: 'text' },
      { local: 'contacto[info][giro_ce]', remote: 'giro', type: 'text' },
      /*{ local: 'contacto[info][direccion]', remote: 'direccion', type: 'text' },
      { local: 'contacto[info][telefono1]', remote: 'telefonos', type: 'text' }*/
    ],
    data: {
      entity: 'Empresa'
    },
    //restrict: false,
    restrict: true, // test
    response: function (event, ui) {
      var target = $(this).parentTo('ul');
      target.find('input[name^="contacto[info]"]').not(this).val('');
    },
    change: function (event, ui) {
      var target = $(this).parentTo('ul');
      if ($(this).val() == '') {
        $('button.empresa_ce').hide();
        target.find('input').not(this).val('');
      }

      if ($('[name="contacto[info][id_ce]"]').val() == '' && $(this).val() != '') {
        var element = this;
        if (!access._552) {
          confirm('El Contacto "' + $(this).val() + '" no está registrado.' + "\n\n" + '¿Desea crearlo?').done(function (data) {
            if (data) {
              $('[name="contacto[info][id_ce]"]').val('');
              //target.parent().find('input[name^="relacionado[info]"]').val('');
              unaBase.loadInto.dialog('/v3/views/contactos/content.shtml?id=0&from=gastos', 'Perfil de Contacto', 'large');

              // Contacto
              target.find('button.profile2.empresa_ce').show();

              // Relacionado
              // target.find('button.contacto').hide();

            } else {
              $(element).val('');
              setTimeout(
                function () { $(element).focus(); }
                , 500);
            }
          });
        } else {
          $(element).val('');
          setTimeout(
            function () { $(element).focus(); }
            , 500);
        }

      }

    },
    select: function (event, ui) {
      /*$('[name="tipo_pago[descripcion]"]').val('');
      $('[name="tipo_doc[id]"]').data('tipoimp', ui.item.tipo_imp);
      $('[name="tipo_doc[id]"]').data('valorimp', ui.item.valor_imp);*/

      var target = $(this).parentTo('ul');
      target.find('button.profile2.empresa_ce').show();
      // target.find('button.profile.contacto').hide();

      $('input[type="search"][name="contacto[info][alias_ce]"]').val((ui.item.text) ? ui.item.text : 'Sin Alias');
      $('input[type="hidden"][name="contacto[info][id_ce]"]').val(ui.item.id);
      target.find('input[name="contacto[info][razon_social_ce]"]').val(ui.item.razon_social);
      target.find('input[name="contacto[info][rut_ce]"]').val((ui.item.rut_validar) ? unaBase.data.rut.format(ui.item.rut) : ui.item.rut);
      target.find('input[name="contacto[info][giro_ce]"]').val(ui.item.giro);
      /*target.find('input[name="contacto[info][direccion]"]').val(ui.item.direccion);
      target.find('input[name="contacto[info][telefono1]"]').val(ui.item.telefonos);*/
      target.find('input[name="contacto[info][email_ce]"]').val(ui.item.email);

      // dtc
      /*var tipo_gasto = $('input[name="oc[tipo_gastos][id]"]').val();
      var data = {'tipo':tipo_gasto ,'id':ui.item.id_dtc_default, 'des':ui.item.des_dtc_default};
      dtc_change(data);*/

      // forma pago
      /*if (ui.item.id_forma_default != "" && tipo_gasto!="FXR") {
          $('input[name="forma_pago[id]"]').val(ui.item.id_forma_default);
          $('input[name="forma_pago[descripcion]"]').val(ui.item.des_forma_default);
          var fechaVcto = calcula_fecha_vcto_pago_oc(ui.item.id_forma_default);
          $('input[name="oc[fecha_vcto]').val(fechaVcto);
      }


      if (ui.item.tipopago_default != "") {
          $('input[name="tipo_pago[descripcion]"]').val(ui.item.tipopago_default);
      }
      if (ui.item.id_banco_default != "") {
          $('input[name="tipo_pago[transferencia][id_banco]"]').val(ui.item.id_banco_default);
      }
      if (ui.item.nombre_banco_default != "") {
          $('input[name="tipo_pago[transferencia][nombre_banco]"]').val(ui.item.nombre_banco_default);
      }
      if (ui.item.tipo_cuenta_default != "") {
          $('input[name="tipo_pago[transferencia][tipo_cuenta]"]').val(ui.item.tipo_cuenta_default);
      }
      if (ui.item.nro_cuenta_default != "") {
          $('input[name="tipo_pago[transferencia][nro_cuenta]"]').val(ui.item.nro_cuenta_default);
      }*/

      /*var fields = [
        $('[name="tipo_pago[transferencia][nombre_banco]"]').closest('li'),
        $('[name="tipo_pago[transferencia][tipo_cuenta]"]').closest('li'),
        $('[name="tipo_pago[transferencia][nro_cuenta]"]').closest('li')
      ];

      if (ui.item.tipopago_default == "TRANSFERENCIA") {
          $.each(fields, function(key, item) {
              item.removeClass('transferencia');
          });
      } else {
          $.each(fields, function(key, item) {
              item.addClass('transferencia');
          });
      }*/

      // tipo pago

      /*$('span[name="resumen[oc][dtc]"]').text(((ui.item.des_dtc_default)? ui.item.des_dtc_default : '').toUpperCase());*/
      resumen_proveedor_ce({ 'alias': ui.item.text, 'razon': ui.item.razon_social });

      // relacionado
      /*$.ajax({
        url: '/4DACTION/_V3_getContactoByEmpresa',
        dataType: 'json',
        async: false,
        data: {
          id: ui.item.id,
          default: true,
          strict: true
        },
        success: function(data) {
          var target = $('input[type="search"][name="relacionado[info][nombre]"]').parentTo('ul');
          target.find('input[name="relacionado[info][nombre]"]').val('');
          target.find('input[name="relacionado[info][id]"]').val('');
          target.find('input[name="relacionado[info][cargo]"]').val('');
          target.find('input[name="relacionado[info][email]"]').val('');
          $('span[name="resumen[oc][contacto]"]').text("");
          $.map(data.rows, function(item) {
            target.find('input[name="relacionado[info][nombre]"]').val(item.nombre_completo);
            target.find('input[name="relacionado[info][cargo]"]').val(item.cargo);
            target.find('input[name="relacionado[info][email]"]').val(item.email);
            target.find('input[name="relacionado[info][id]"]').val(item.id);
            $('span[name="resumen[oc][contacto]"]').text(item.nombre_completo.toUpperCase());
          });

          target.find('button.show.contacto').show();
          if (data.rows.length > 0) {
            target.find('button.unlock.contacto, button.profile.contacto').show();
          };


        }

      });*/

      return false;
    },
    renderItem: function (ul, item) {
      return $('<li><a><strong class="highlight">' + ((item.text) ? item.text : '[Sin Alias]') + '</strong><em>' + ((item.rut_validar) ? unaBase.data.rut.format(item.rut) : item.rut) + '</em><span>' + item.razon_social + '</span></a></li>').appendTo(ul);
    }
  });
  // -- end - buscar por alias cesioanrio
  setFormaPagosCompras()


});
