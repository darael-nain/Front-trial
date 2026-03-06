
var calcula_fecha_vcto_pago_oc = function (idForma) {
  var fecha;
  $.ajax({
    'url': '/4DACTION/_v3_get_fecha_vcto_pago_dtv',
    data: {
      "oc[id_forma_pago]": idForma,
      "oc[id_dtv]": dtv.id
    },
    async: false,
    dataType: 'json',
    success: function (data) {
      fecha = data.fecha;
    }
  });
  return fecha;
}

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

var update_totales_dtv = function () {
  
  var containerItems = $('table.items tbody');
  var tipoDoc = $('input[name="id_tipo_doc"]').val();

  var sumaSubTotales = 0;
  containerItems.find('tr').each(function () {
    sumaSubTotales += parseFloat($(this).find('input[name="det_subtotal"]').val());
  });

  var totalExento = 0;
  var totalNeto = 0;
  var impuesto = 0;
  var total = 0;

  // afectos
  /*if (tipoDoc == "30" || tipoDoc == "33" || tipoDoc == "117") {
    totalNeto = sumaSubTotales;
    impuesto = totalNeto * 0.19;
    total = totalNeto * 1.19;
  }else{
     // exentos (tipoDoc == "32" || tipoDoc == "34" || tipoDoc == "78") y otro
    totalExento = sumaSubTotales;
    impuesto = 0;
    total = sumaSubTotales;
  }*/

  // agregado el 15-03-19, gin, para hacer el calculo de acuerto a tabla impuestos
  let factorImpuesto = dtv.valor_impuesto / 100;
  let factorMasUno = factorImpuesto + 1;
  totalNeto = sumaSubTotales;
  impuesto = totalNeto * factorImpuesto; // ej: 0.19 ó 0.18
  total = totalNeto * factorMasUno; // ej: 1.19 ó 1.18

  $('[name="sub_total"]').val(sumaSubTotales);
  $('[name="porc_descuento').val(0);
  $('[name="descuento').val(0);
  $('[name="exento"]').val(totalExento);
  $('[name="neto"]').val(totalNeto);
  $('[name="impuesto"]').val(impuesto);

  var adicional = 0;

  if ($('input[name="adicional"]').val() == "") {
    $('input[name="adicional"]').val("0");
  } else {
    adicional = parseFloat($('input[name="adicional"]').val());
  }

  var nuevoTotal = total + adicional;
  $('[name="total"]').val(nuevoTotal);

  $('[name="total_por_cobrar"]').val(nuevoTotal);
  $('[name="total_cobrado"]').val(0);
  $('[name="saldo_por_cobrar"]').val(nuevoTotal);

  // update objeto
  dtv.data.montos.sub_total = sumaSubTotales;
  dtv.data.montos.exento = totalExento;
  dtv.data.montos.neto = totalNeto;
  dtv.data.montos.iva = impuesto;
  dtv.data.montos.adicional = adicional;
  dtv.data.montos.total = nuevoTotal;
  dtv.data.montos.total_por_cobrar = nuevoTotal;
  dtv.data.montos.total_cobrado = 0;
  dtv.data.montos.saldo_por_cobrar = nuevoTotal;

};

var set_fpago_proveedor = function (param) {
  if (parseInt(param.prov) > 0 && parseInt(param.fpago) > 0 && parseInt(param.old) != parseInt(param.dtc)) {
    confirm("¿Desea asignar la forma de pago por defecto para este Cliente?").done(function (data) {
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

$(document).ready(function () {
  unaBase.ui.block();

  $('.country-label-rut').text(country.label_rut);

  dtv.menu();
  dtv.init($('#sheet-dtv').data('id'));
  unaBase.ui.unblock();

  unaBase.ui.expandable.init();

  // ajuste segun pais
  $('.country-label-rut').text(country.label_rut);

  // -- ini -- guarda al cambiar valor cambio
  $('input[name="exchange[rate]"]').on("change", function () {
    // var initialRate = parseFloat($(this).data('oldrate'));
    // var finalRate = parseFloat($(this).val());
    dtv.data.exchange.rate = unaBase.utilities.transformNumber($(this).val());
    dtv.menubar.find('[data-name="save"] button').triggerHandler('click');

  });
  // -- ini -- guarda al cambiar valor cambio

  $('button.add.nv').button({ icons: { primary: 'ui-icon-circle-plus' }, text: true }).click(function () {
    unaBase.loadInto.dialog('/v3/views/dtv/dialog/negocios_disponibles_express.shtml', 'Seleccionar negocios', 'x-large');
  });

  $('button.add.occ').button({ icons: { primary: 'ui-icon-circle-plus' }, text: true }).click(function () {
    unaBase.loadInto.dialog('/v3/views/occlientes/content.shtml?fact=' + dtv.data.id + '&new=true', 'Nueva OC. Cliente', 'x-large');
  });

  $('button.add.nc').button({ icons: { primary: 'ui-icon-circle-plus' }, text: true }).click(function () {

    if (dtv.data.folio == 'S/N') {
      // toastr.warning('No es posible agregar una nota de crédito mientras haya un cobro ingresado.');
      alert('No es posible agregar una nota de crédito mientras la factura no tenga número asignado.');
      return false;
    }

    // Validar si no hay monto cobrado antes de emitir nc
    if (parseFloat($('[name="total_cobrado"]').val()) > 0) {
      // toastr.warning('No es posible agregar una nota de crédito mientras haya un cobro ingresado.');
      alert('No es posible agregar una nota de crédito mientras haya un cobro ingresado.');
      return false;
    }

    var htmlObject;
    let motivosNC = [];

    if (currency.code == "PEN") {

      htmlObject = $('<section data-response="01"> \
            <span style="text-decoration:underline;">MOTIVO DE LA NOTA DE CRÉDITO:</span> \
            <input style="font-weight:bold!important;font-size:13px!important;background-color:yellow;margin-top:5px;border:graylight;padding:2px;" required readonly type="search" name="motivo" value="ANULACIÓN DE LA OPERACIÓN"> \
            <button class="show motivo-anulacion">Ver motivos</button> \
            <div style="margin-top:10px;font-size:10px;color:gray;display:none" class="description-motivo-anulacion">En esta opción podrás generar una NC para anular la factura.</div> \
          </section>');

      // caso PEN
      motivosNC = [
        { id: '01', des: 'ANULACIÓN DE LA OPERACIÓN' },
        { id: '02', des: 'ANULACIÓN POR ERROR EN EL RUC' },
        //{ id : '03', des : 'CORRECCION DE MONTO'},
        { id: '04', des: 'DESCUENTO GLOBAL' }
      ]
    } else {

      htmlObject = $('<section data-response="ANULAR FACTURA"> \
            <span style="text-decoration:underline;">MOTIVO DE LA NOTA DE CRÉDITO:</span> \
            <input style="font-weight:bold!important;font-size:13px!important;background-color:yellow;margin-top:5px;border:graylight;padding:2px;" required readonly type="search" name="motivo" value="ANULAR FACTURA"> \
            <button class="show motivo-anulacion">Ver motivos</button> \
            <div style="margin-top:10px;font-size:10px;color:gray;" class="description-motivo-anulacion">En esta opción podrás generar una NC para anular la factura.</div> \
          </section>');

      // caso CL
      motivosNC = [
        { id: 'ANULAR FACTURA', des: 'ANULAR FACTURA' },
        { id: 'CORRECCION DE MONTO', des: 'CORRECCION DE MONTO' },
      ]
    }

    htmlObject.find('input[type="search"]').autocomplete({
      source: function (request, response) {
        /*var list = [
            // {id: '1', des: 'CORRECCION DE TEXTO'},
            {id: 'ANULAR FACTURA', des: 'ANULAR FACTURA'}, // 3
            {id: 'CORRECCION DE MONTO', des: 'CORRECCION DE MONTO'} // 2
        ];*/
        var list = motivosNC;
        response($.map(list, function (item) {
          return item;
        }));
      },
      minLength: 0,
      autoFocus: true,
      open: function () {
        $(this).removeClass('ui-corner-all').addClass('ui-corner-top');
      },
      close: function () {
        $(this).removeClass('ui-corner-top').addClass('ui-corner-all');
      },
      focus: function (event, ui) {
        return false;
      },
      response: function (event, ui) {
      },
      select: function (event, ui) {
        $(this).val(ui.item.des);
        htmlObject.data('response', $(this).val());
        if (ui.item.des == "CORRECCION DE MONTO") {
          $('.description-motivo-anulacion').text('En esta opción podrás generar una NC para corregir los montos y/o cantidades de la factura.');
        } else {
          $('.description-motivo-anulacion').text('En esta opción podrás generar una NC para anular la factura.');
        }
        return false;
      }

    }).data('ui-autocomplete')._renderItem = function (ul, item) {
      return $('<li><a><span class="highlight">' + item.des + '</span></a></li>').appendTo(ul);
    };

    htmlObject.find('button.show.motivo-anulacion').button({
      icons: {
        primary: 'ui-icon-carat-1-s'
      },
      text: false
    }).click(function () {
      htmlObject.find('input[type="search"]').autocomplete('search', '@');
    });

    prompt(htmlObject).done(function (data) {
      $.ajax({
        url: '/4DACTION/_V3_setNcVentas',
        dataType: 'json',
        type: 'POST',
        data: {
          'idfactura': dtv.id,
          'motivo': htmlObject.data('response')
        }
      }).done(function (data) {
        unaBase.loadInto.viewport('/v3/views/dtv/nc/content.shtml?id=' + data.id);
      });
    });

  });

  $('button.show').button({ icons: { primary: 'ui-icon-carat-1-s' }, text: false });
  $('button.profile').button({ icons: { primary: 'ui-icon-pencil' }, text: false });
  $('button.unlock').button({ icons: { primary: 'ui-icon-unlocked' }, text: false });
  $('button.edit.save').button({ icons: { primary: 'ui-icon-disk' }, text: false });
  $('button.edit.discard').button({ icons: { primary: 'ui-icon-close' }, text: false });
  $(".datepicker").datepicker();
  $('button.minus').button({ icons: { primary: 'ui-icon-circle-minus' }, text: false });

  // Carga tipo factura
  $('button.show.tipo').click(function () {
    $('input[name="des_tipo_doc"]').autocomplete('search', '@').focus();
  });
  $('input[name="des_tipo_doc"]').autocomplete({
    source: function (request, response) {
      $.ajax({
        url: '/4DACTION/_V3_' + 'getTiposDocDeVentas',
        dataType: 'json',
        data: {
          q: request.term
        },
        success: function (data) {
          response($.map(data.rows, function (item) {
            return item;
          }));
        }
      });
    },
    minLength: 0,
    autoFocus: true,
    open: function () {
      $(this).removeClass('ui-corner-all').addClass('ui-corner-top');
    },
    close: function () {
      $(this).removeClass('ui-corner-top').addClass('ui-corner-all');
    },
    focus: function (event, ui) {
      return false;
    },
    response: function (event, ui) {
    },
    select: function (event, ui) {
      $('[name="id_tipo_doc"]').val(ui.item.id);
      $('[name="des_tipo_doc"]').val(ui.item.des);
      dtv.set(event.target);
      dtv.data.valor_impuesto = ui.item.valor_imp;
      dtv.valor_impuesto = dtv.data.valor_impuesto;
      update_totales_dtv();
      return false;
    }
  }).data('ui-autocomplete')._renderItem = function (ul, item) {
    return $('<li><a><span class="highlight">' + item.des + '</span></a></li>').appendTo(ul);
  };

  // forma de pago
  $('button.show.forma-pago').click(function () {
    id_fpago_default_old = $('input[name="id_forma_pago"]').val();
    $('input[name="des_forma_pago"]').autocomplete('search', '@').focus();
  });
  $('input[name="des_forma_pago"]').autocomplete({
    source: function (request, response) {
      $.ajax({
        url: '/4DACTION/_V3_' + 'getFormaPagos?venta=true',
        dataType: 'json',
        data: {
          q: request.term
        },
        success: function (data) {
          response($.map(data.rows, function (item) {
            return item;
          }));
        }
      });
    },
    minLength: 0,
    autoFocus: true,
    open: function () {
      $(this).removeClass('ui-corner-all').addClass('ui-corner-top');
    },
    close: function () {
      $(this).removeClass('ui-corner-top').addClass('ui-corner-all');
    },
    focus: function (event, ui) {
      return false;
    },
    response: function (event, ui) {
    },
    select: function (event, ui) {
      $('input[name="des_forma_pago"]').val(ui.item.des);
      $('input[name="id_forma_pago"]').val(ui.item.id);
      dtv.data.des_forma_pago = ui.item.des;
      dtv.data.id_forma_pago = ui.item.id;
      
      if (ui.item.id != "-1") {
        var fecha = calcula_fecha_vcto_pago_oc(ui.item.id);
        $('input[name="fecha_vencimiento"]').val(fecha);
        dtv.data.fecha_vencimiento = fecha;
      }
      set_fpago_proveedor({
        fpago: ui.item.id,
        prov: $('input[name="contacto[info][id]"]').val(),
        old: id_fpago_default_old
      });
      return false;
    }

  }).data('ui-autocomplete')._renderItem = function (ul, item) {
    return $('<li><a><strong class="highlight">' + item.des + '</strong></a></li>').appendTo(ul);
  };


  // perfil cliente
  $('button.profile.cliente').click(function () {
    if (dtv.data.cliente.id > 0) {
      unaBase.loadInto.dialog('/v3/views/contactos/content.shtml?id=' + dtv.data.cliente.id, 'Perfil del Contacto ', 'large');
    }
  });

  // perfil relacionado
  $('button.profile.contacto').click(function () {
    if (dtv.data.relacionado.id > 0) {
      unaBase.loadInto.dialog('/v3/views/contactos/content.shtml?id=' + dtv.data.relacionado.id, 'Perfil del Contacto ', 'large');
    }
  });

  $('.edit').bind('blur', function (event) {
    if ($(event.target).prop('name') == 'descuento' || $(event.target).prop('name') == 'porc_descuento') {
      dtv.set($('[name="descuento"]')[0]);
      dtv.set($('[name="porc_descuento"]')[0]);
      dtv.set($('[name="exento"]')[0]);
      dtv.set($('[name="neto"]')[0]);
      dtv.set($('[name="impuesto"]')[0]);
      dtv.set($('[name="total"]')[0]);
      dtv.set($('[name="saldo_por_cobrar"]')[0]);
    } else {
      dtv.set(event.target);
    }
  });

  var get_oc_clientes = function (id) {
    $.ajax({
      'url': '/4DACTION/_V3_get_oc_clientes',
      data: {
        "id": id
      },
      dataType: 'json',
      success: function (data) {
        var container = $('#sheet-dtv table.oc_clientes > tbody');
        var htmlObject;
        container.find("*").remove();

        if (data.rows.length > 0) {
          $.each(data.rows, function (key, item) {
            htmlObject = $('<tr class="bg-white" data-id="' + item.id + '">' +
              '<td class="center">' + item.numero + '</td>' +
              '<td class="center">' + item.tipo + '</td>' +
              '<td class="center">' + item.emision + '</td>' +
              '<td class="center">' + item.recepcion + '</td>' +
              '<td class="center">' + item.cliente + '</td>' +
              '<td class="center">' + item.referencia + '</td>' +
              '<td class="right">' + currency.symbol + '<span class="numeric currency">' + item.total + '</span></td>' +
              '<td class="center"><button class="minus">Quitar</button></td>' +
              '</tr>');
            container.append(htmlObject);
          });
          $('#scroll_oc_clientes h1 span').text(data.rows.length);
          container.find('.numeric.currency').number(true, currency.decimals, currency.decimals_sep, currency.thousands_sep);
          $('button.minus').button({ icons: { primary: 'ui-icon-circle-minus' }, text: false }).click(function () {
            var row = $(this).closest("tr");
            var idocc = row.data("id");
            confirm("¿Está seguro(a) que desea quitar la asociación del documento de esta factura?").done(function (data) {
              if (data) {
                var container = $('#sheet-dtc');
                $.ajax({
                  'url': '/4DACTION/_V3_setDtv',
                  data: {
                    'id': dtv.id,
                    'idocc': idocc,
                    'minusocc': true
                  },
                  dataType: 'json',
                  success: function (data) {
                    if (data.success) {
                      toastr.success("Documento quitado con éxito.");
                      row.fadeOut("slow");
                      var counter = $('#scroll_oc_clientes h1 span');
                      counter.text(parseInt(counter.text()) - 1);
                    } else {
                      toastr.error("No fue posible quitar el documento. Intente nuevamente.");
                    }
                  },
                  error: function (xhr, text, error) {
                    toastr.error(NOTIFY.get('ERROR_INTERNAL', 'Error'));
                  }
                });
              }
            });
          });

        } else {
          htmlObject = $('<tr><td colspan="8">No existen documentos asociados.</td></tr>');
          container.append(htmlObject);
          $('#scroll_oc_clientes table tfoot').hide();
        }

      }
    });
  };
  get_oc_clientes($('#sheet-dtv').data('id'));

  var get_notas_de_credito = function (id) {
    $.ajax({
      'url': '/4DACTION/_V3_get_notas_credito_dtv',
      data: {
        "fk": dtv.id
      },
      dataType: 'json',
      success: function (data) {
        var container = $('#sheet-dtv table.nc > tbody');
        var htmlObject;
        container.find("*").remove();
        if (data.rows.length > 0) {
          
          data.rows = data.rows.filter(item => item.tipo == 'NCE')
          $.each(data.rows, function (key, item) {
            htmlObject = $('<tr class="bg-white" data-id="' + item.id + '">' +
              '<td class="center">' + item.numero + '</td>' +
              '<td class="center">' + item.tipo + '</td>' +
              '<td class="center">' + item.emisor + '</td>' +
              '<td class="center">' + item.emision + '</td>' +
              '<td class="center">' + item.rut + '</td>' +
              '<td class="center">' + item.cliente + '</td>' +
              '<td class="right">' + currency.symbol + '<span class="numeric currency">' + item.neto + '</span></td>' +
              '<td class="right">' + currency.symbol + '<span class="numeric currency">' + item.exento + '</span></td>' +
              '<td class="right">' + currency.symbol + '<span class="numeric currency">' + item.iva + '</span></td>' +
              '<td class="right">' + currency.symbol + '<span class="numeric currency">' + item.total + '</span></td>' +
              '<td class="center">' + item.estado + '</td>' +
              '</tr>');
            container.append(htmlObject);
            htmlObject.click(function () {
              unaBase.loadInto.viewport('/v3/views/dtv/nc/content.shtml?id=' + item.id);
            });
          });
          $('#scrollncnd h1 span').text(data.rows.length);
          container.find('.numeric.currency').number(true, currency.decimals, currency.decimals_sep, currency.thousands_sep);
          /*$('button.minus').button({icons: {primary: 'ui-icon-circle-minus'},text: false}).click(function(){
            var row = $(this).closest("tr");
            var idocc = row.data("id");
            confirm("¿Está seguro(a) que desea quitar la asociación del documento de esta factura?").done(function(data) {
              if (data) {
                var container = $('#sheet-dtc');
                $.ajax({
                  'url': '/4DACTION/_V3_setDtv',
                  data: {
                    'id': dtv.id,
                    'idocc': idocc,
                    'minusocc': true
                  },
                  dataType: 'json',
                  success: function(data) {
                    if (data.success) {
                      toastr.success("Documento quitado con éxito.");
                      row.fadeOut("slow");
                                        var counter = $('#scroll_oc_clientes h1 span');
                                        counter.text(parseInt(counter.text()) - 1);
                    }else{
                      toastr.error("No fue posible quitar el documento. Intente nuevamente.");
                    }             },
                  error: function(xhr, text, error) {
                    toastr.error(NOTIFY.get('ERROR_INTERNAL', 'Error'));
                  }
                });
              }
            });
          });*/
        } else {
          htmlObject = $('<tr><td colspan="11">No existen notas de créditos asociadas.</td></tr>');
          container.append(htmlObject);
          $('#scrollncnd table tfoot').hide();
        }

      }
    });
  };
  get_notas_de_credito($('#sheet-dtv').data('id'));

  var get_dtv_comprobantes = function (id) {

    $.ajax({
      'url': '/4DACTION/_V3_get_comprobantes_modulos',
      data: {
        "id": id,
        "tipo": "DTV"
      },
      dataType: 'json',
      success: function (data) {


        var containerComprobantes = $('#sheet-dtv table.comprobantes > tbody');
        var htmlObject;
        containerComprobantes.find("*").remove();

        $('#scrollcomprobantes h1 span').text(data.rows.length);
        if (data.rows.length > 0) {
          $.each(data.rows, function (key, item) {


            htmlObject = $('<tr title="comprobantes" class="bg-white" data-id="' + item.idCom + '">' +
              '<td>' + item.idCom + '</td>' +
              '<td>' + item.descripcion + '</td>' +
              '<td>' + item.fechaReg + '</td>' +
              '<td>' + item.docType + '</td>' +
              '</tr>');
            htmlObject.click(function () {
              unaBase.loadInto.viewport('/v3/views/comprobantes/content.shtml?id=' + item.idCom);
            });
            containerComprobantes.append(htmlObject);
          });
        } else {

          htmlObject = $('<tr><td colspan="9">No existen comprobantes asociados.</td></tr>');
          containerComprobantes.append(htmlObject);
        }


      }
    });
  };
  get_dtv_comprobantes($('#sheet-dtv').data('id'));

//Buscador de contacto relacionado en DTV R
  unaBase.toolbox.form.autocomplete({
    fields: [
      { local: 'relacionado[info][nombre]', remote: 'nombre_completo', type: 'search', default: true },
    ],
    data: {
      entity: 'Contacto',
      filter: 'nombre_completo',
      relationship: function () {
        return {
          key: 'Empresa',
          id: $('input[name="contacto[info][id]').val(),
          strict: true
        }
      }
    },
    restrict: false,
    response: function (event, ui) {
      
      var target = $(this).parentTo('ul');
      $(this).data('id', null);
      target.find('input[name^="relacionado[info]"]').not(this).val('');

      $('h2 [name="cotizacion[empresa][contacto][id]"]').text('');
    },
    change: function (event, ui) {
      
      var target = $(this).parentTo('ul');
      if ($(this).val() == '')
        target.find('button.contacto').hide();

      if (!$(this).data('id') && $(this).val() != '') {
        var element = this;
        if (!access._551) {
          confirm('El contacto "' + $(this).val() + '" no está registrado.' + "\n\n" + '¿Desea crearlo?').done(function (data) {
            if (data) {
              $(element).data('id', null);
              $('button.unlock.contacto').click();
            } else {
              target.find('input[type="search"][name^="cotizacion[empresa][contacto]"]').val('');
              setTimeout(
                function () { $(element).focus(); }
                , 500);
            }
          });
        } else {
          target.find('input[type="search"][name^="cotizacion[empresa][contacto]"]').val('');
          setTimeout(
            function () { $(element).focus(); }
            , 500);
        }

      }

    },
    select: function (event, ui) {
      
      var target = $('input[type="search"][name="relacionado[info][nombre]"]').parentTo('ul');

      target.find('button.unlock.contacto').show();
      target.find('button.edit.contacto').hide();

      $('input[type="search"][name="relacionado[info][nombre]"]').val(ui.item.nombre_completo);
      $('input[type="search"][name="relacionado[info][nombre]"]').data('id', ui.item.id);
      $('input[name="relacionado[info][nombre]"]').attr('data-id', ui.item.id);


      dtv.data.relacionado.id = ui.item.id;
      dtv.data.relacionado.nombre = ui.item.nombre_completo;
      dtv.data.relacionado.cargo = ui.item.cargo;
      dtv.data.relacionado.email = ui.item.email;


      // Definir acá cómo se crea o duplica el contacto relacionado, en caso que se seleccione un contacto externo.
      // La forma planeada es dejar vacío los campos de cargo y email, hacer trigger en el botón editar contacto
      // y dejar referenciado un atributo data para saber a qué entrada de contacto debe asociarse la nueva
      // relación a crear.

      target.find('input[name="relacionado[info][nombre]"]').val(ui.item.nombre_completo);
      target.find('input[name="relacionado[info][cargo]"]').val(ui.item.cargo);
      target.find('input[name="relacionado[info][email]"]').val(ui.item.email);

      $('h2 [name="relacionado[info][nombre]"]').text(ui.item.nombre_completo);

      // var old_empresa = $('input[name="cotizacion[empresa][id]"]').data('id');
      var old_empresa = $('input[name="relacionado[info][nombre]"]').attr('data-id');
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
          success: function (data) {
            var target = $('input[type="search"][name="cotizacion[empresa][id]"]').parentTo('ul');

            $.map(data.rows, function (item) {
              target.find('input[name="cotizacion[empresa][id]"]').data('id', item.id);
              target.find('input[name="cotizacion[empresa][id]"]').val(item.text);
              target.find('input[name="cotizacion[empresa][razon_social]"]').val(item.razon_social);
              target.find('input[name="cotizacion[empresa][rut]"]').val(item.rut);
              target.find('input[name="cotizacion[empresa][rut]"]').data("rut", item.rut);

              // Porcentaje comisión agencia por contacto
              target.find('input[name="cotizacion[empresa][id]"]').data('sobrecargo-ca', item.porcentaje_sobrecargo_ca);
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
    renderItem: function (ul, item) {

      var element;
      if (item.empresa.id == $('input[name="cotizacion[empresa][id]"]').data('id'))
        element = $('<li><a><strong class="highlight">' + item.nombre_completo + '</strong><em>[' + item.empresa.text + ']</em><span>' + item.cargo + '</span><span>' + item.email + '</span></a></li>').appendTo(ul);
      else
        element = $('<li><a><strong class="highlight">' + item.nombre_completo + '</strong><em>[' + item.empresa.text + ']</em><span>' + item.cargo + '</span><span>' + item.email + '</span></a></li>').appendTo(ul);
      return element;
    }
  });

  $('button.unlock.contacto').click(function () {
    var target = $(this).parentTo('ul');
    
    target.find('input[name^="relacionado[info]"][type="search"]').each(function (key, item) {
      // Intentamos deshabilitar el autocomplete, si el campo lo permite
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

  $('button.edit.save.contacto').click(function (event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    
    var element = this;
    var fields = {
      fk: $('input[name="contacto[info][id]"]').val()
    };
    
    $('input[name^="relacionado[info]"').each(function () {
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
      success: function (data) {
        if (data.success) {

          if (data.new)
            toastr.info('Contacto creado!');
          else
            toastr.info('Contacto modificado!');

          $('input[name="relacionado[info][nombre]"]').data('id', data.id);
          $('input[name="relacionado[info][nombre]"]').attr('data-id', data.id);

          $('h2 [name="relacionado[info][nombre]"]').text(fields['relacionado[info][nombre]']);

          
          dtv.data.relacionado.id = data.id;
          dtv.data.relacionado.email = data.index;

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
      error: function (xhr, text, error) {
        toastr.error('Falló conexión al servidor.');
      }
    });
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
    response: function (event, ui) {
      var target = $(this).parentTo('ul');
      
      target.find('input[name^="contacto[info]"]').not(this).val('');
    },
    change: function (event, ui) {
      var target = $(this).parentTo('ul');
      if ($(this).val() == '') {
        $('button.empresa').hide();
        target.find('input').not(this).val('');
      }

      if ($('[name="contacto[info][id]"]').val() == '' && $(this).val() != '') {
        var element = this;
        if (!access._552) {
          confirm('El cliente "' + $(this).val() + '" no está registrado.' + "\n\n" + '¿Desea crearlo?').done(function (data) {
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

      var target = $(this).parentTo('ul');
      target.find('button.profile2.empresa').show();
      target.find('button.profile.contacto').hide();
      
      $('input[type="search"][name="contacto[info][alias]"]').val((ui.item.text) ? ui.item.text : 'Sin Alias');
      $('input[type="hidden"][name="contacto[info][id]"]').val(ui.item.id);
      target.find('input[name="contacto[info][razon_social]"]').val(ui.item.razon_social);
      target.find('input[name="contacto[info][rut]"]').val((ui.item.rut_validar) ? unaBase.data.rut.format(ui.item.rut) : ui.item.rut);
      target.find('input[name="contacto[info][giro]"]').val(ui.item.giro);
      target.find('input[name="contacto[info][direccion]"]').val(ui.item.direccion);
      target.find('input[name="contacto[info][telefono1]"]').val(ui.item.telefonos);
      target.find('input[name="contacto[info][email]"]').val(ui.item.email);

      dtv.data.cliente.id = ui.item.id;
      dtv.data.cliente.alias = ui.item.text;
      dtv.data.cliente.razon = ui.item.razon_social;
      dtv.data.cliente.giro = ui.item.giro;
      dtv.data.cliente.rut = target.find('input[name="contacto[info][rut]"]').val();
      dtv.data.cliente.dv = "";

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
          var target = $('input[type="search"][name="relacionado[info][nombre]"]').parentTo('ul');
          target.find('input[name="relacionado[info][nombre]"]').val('');
          target.find('input[name="relacionado[info][id]"]').val('');
          target.find('input[name="relacionado[info][cargo]"]').val('');
          target.find('input[name="relacionado[info][email]"]').val('');
          // $('span[name="resumen[oc][contacto]"]').text("");
          $.map(data.rows, function (item) {
            target.find('input[name="relacionado[info][nombre]"]').val(item.nombre_completo);
            target.find('input[name="relacionado[info][cargo]"]').val(item.cargo);
            target.find('input[name="relacionado[info][email]"]').val(item.email);
            target.find('input[name="relacionado[info][id]"]').val(item.id);
            // $('span[name="resumen[oc][contacto]"]').text(item.nombre_completo.toUpperCase());

            dtv.data.relacionado.id = item.id;
            dtv.data.relacionado.nombre = item.nombre_completo;
            dtv.data.relacionado.cargo = item.cargo;
            dtv.data.relacionado.email = item.email;

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





});
