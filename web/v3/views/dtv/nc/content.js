$(document).ready(function () {
  $('.country-label-rut').text(country.label_rut);
  unaBase.ui.block();
  notas.menu();
  notas.init($('#sheet-notas').data('id'));
  unaBase.ui.unblock();
  unaBase.ui.expandable.init();

  // initialize buttom
  $('button.show').button({ icons: { primary: 'ui-icon-carat-1-s' }, text: false });
  $('button.profile').button({ icons: { primary: 'ui-icon-pencil' }, text: false });
  $('button.unlock').button({ icons: { primary: 'ui-icon-unlocked' }, text: false });
  $('button.edit.save').button({ icons: { primary: 'ui-icon-disk' }, text: false });
  $('button.edit.discard').button({ icons: { primary: 'ui-icon-close' }, text: false });
  $(".datepicker").datepicker();
  $('button.minus').button({ icons: { primary: 'ui-icon-circle-minus' }, text: false });

  // load type nc
  $('button.show.tipo').click(function () {
    $('input[name="des_tipo_doc"]').autocomplete('search', '@').focus();
  });

  $('button.add.nd').button({ icons: { primary: 'ui-icon-circle-plus' }, text: true }).click(function () {

    if (notas.data.folio == 'S/N') {
      // toastr.warning('No es posible agregar una nota de crédito mientras haya un cobro ingresado.');
      alert('No es posible agregar una nota de debito mientras la nota de credito no tenga número asignado.');
      return false;
    }
    
    $.ajax({
      url: '/4DACTION/_V3_setNdVentas',
      dataType: 'json',
      type: 'POST',
      data: {
        'idnc': notas.id,
        'motivo': ""
      }
    }).done(function (data) {
      unaBase.loadInto.viewport('/v3/views/dtv/nd/content.shtml?id=' + data.id);
    });

  });



  $('input[name="des_tipo_doc"]').autocomplete({
    source: function (request, response) {
      $.ajax({
        url: '/4DACTION/_V3_' + 'getTiposDocDeVentas',
        dataType: 'json',
        data: {
          q: request.term,
          nc: true
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
      // notas.set(event.target);
      //update_totales_dtv();
      return false;
    }
  }).data('ui-autocomplete')._renderItem = function (ul, item) {
    return $('<li><a><span class="highlight">' + item.des + '</span></a></li>').appendTo(ul);
  };

  var get_facturas_venta = function (id) {
    $.ajax({
      'url': '/4DACTION/_V3_get_facturas_venta_nc',
      data: {
        "id": notas.id
      },
      dataType: 'json',
      success: function (data) {
        var container = $('#sheet-notas table.facturas > tbody');
        var htmlObject;
        container.find("*").remove();
        if (data.rows.length > 0) {
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
              unaBase.loadInto.viewport('/v3/views/dtv/content.shtml?id=' + item.id);
            });
          });
          $('#scrollfacturas h1 span').text(data.rows.length);
          container.find('.numeric.currency').number(true, currency.decimals, currency.decimals_sep, currency.thousands_sep);
        } else {
          htmlObject = $('<tr><td colspan="11">No existen facturas de venta asociadas.</td></tr>');
          container.append(htmlObject);
          $('#scrollfacturas table tfoot').hide();
        }

      }
    });
  };
  var get_nc_comprobantes = function (id) {

    $.ajax({
      'url': '/4DACTION/_V3_get_comprobantes_modulos',
      data: {
        "id": id,
        "tipo": "NC"
      },
      dataType: 'json',
      success: function (data) {


        var containerComprobantes = $('#sheet-notas table.comprobantes > tbody');
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

  get_nc_comprobantes($('#sheet-notas').data('id'));
  get_facturas_venta(notas.id);

  var get_notas_de_credito = function (id) {
    $.ajax({
      'url': '/4DACTION/_V3_get_notas_credito_dtv',
      data: {
        "fk": dtv.id
      },
      dataType: 'json',
      success: function (data) {
        
        var container = $('#sheet-notas table.nd > tbody');
        var htmlObject;
        container.find("*").remove();
        if (data.rows.length > 0) {
          data.rows = data.rows.filter(item => item.tipo == 'NDE')
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
              unaBase.loadInto.viewport('/v3/views/dtv/nd/content.shtml?id=' + item.id);
            });
          });
          $('#scrollncnd h1 span').text(data.rows.length);
          container.find('.numeric.currency').number(true, currency.decimals, currency.decimals_sep, currency.thousands_sep);
         
        } else {
          htmlObject = $('<tr><td colspan="11">No existen notas de debito asociadas.</td></tr>');
          container.append(htmlObject);
          $('#scrollncnd table tfoot').hide();
        }

      }
    });
  };
  get_notas_de_credito($('#sheet-dtv').data('id'));


  // perfil cliente
  $('button.profile.cliente').click(function () {
    if (notas.data.cliente.id > 0) {
      unaBase.loadInto.dialog('/v3/views/contactos/content.shtml?id=' + notas.data.cliente.id, 'Perfil del Contacto ', 'large');
    }
  });

  // perfil relacionado
  $('button.profile.contacto').click(function () {
    if (dtv.data.relacionado.id > 0) {
      unaBase.loadInto.dialog('/v3/views/contactos/content.shtml?id=' + notas.data.relacionado.id, 'Perfil del Contacto ', 'large');
    }
  });


  $(document).ready(function () {
    $('.tooltip').tooltipster();
    //$('.tooltip-fixed-amount').tooltipster('open');
    $('.tooltip-fixed-amount').tooltipster({
      trigger: 'click'
    });
  });

});