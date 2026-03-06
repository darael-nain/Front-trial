var mainContainer = dtc.container;

var roundTwo = function (num) {
  return +(Math.round(num + "e+2") + "e-2");
}

/*var resumen_info_general = function(){
  var documento = $('[name="tipo_doc[descripcion]"]').val();
  var folio = $('input[name="dtc[nro_folio]"]').val();
  var emision =  $('#femision').val();
  var referencia = $('input[name="dtc[referencia]"]').val();
  $('strong[name="resumen[dtc][documento]"]').text('');
  $('span[name="resumen[dtc][folio]"]').text('');
  $('strong[name="resumen[dtc][emision]"]').text('');
  $('span[name="resumen[dtc][referencia]"]').text('');
  if (documento != ''){
    $('strong[name="resumen[dtc][documento]"]').text(documento);
  }
  if(folio != ""){
    $('span[name="resumen[dtc][folio]"]').text('Nro. ' + folio);
  }
  $('strong[name="resumen[dtc][emision]"]').text('Emitida el ' + emision);
  if(referencia != ""){
    $('span[name="resumen[dtc][referencia]"]').text(referencia);
  }
}*/
/*var resumen_info_proveedor = function(){
  var alias = $('input[name="contacto[info][alias]"]').val();
  var razon = $('input[name="contacto[info][razon_social]"]').val();
  $('strong[name="resumen[contacto][alias]"]').text(alias);
  $('span[name="resumen[contacto][razon]"]').text(razon);
}
var resumen_info_totales = function(){
  $('span[name="resumen[dtc][total]"]').hide();
  var total = $('input[name="dtc[total]"]').val();
  $('span[name="resumen[dtc][total]"]').show();
  $('span[name="resumen[dtc][total_valor]"]').text(total).number(true, 2, ',', '.');
}*/

/*var get_impuesto_by_doc = function(id){
  var impuestos = {};
  $.ajax({
    url: '/4DACTION/_V3_getImpuestos',
    dataType: 'json',
    data: {
      'dtc[id]': id
    },
    async: false,
    success: function(data) {
     impuestos = data;
    }
  });
  return impuestos;
}*/

/*var get_formas_pago = function(){
  var optionsObject;
  var select3 = $('select[name="forma_pago[id]"]');
  $.ajax({
    url: '/4DACTION/_V3_getFormaPagos',
    dataType: 'json',
    data:{},
    success: function(data) {
      $.each(data.rows, function(key, item){
        optionsObject = $('<option value="'+ item.id +'">'+ item.des +'</option>');
        select3.append(optionsObject);
      });
    }
  });
}*/

var get_nc = function (type = "") {
  var id = $('#sheet-dtc').data('id');

  $.ajax({
    'url': '/4DACTION/_V3_get_nc_dtc',
    data: {
      "factura[id]": id,
      type
    },
    dataType: 'json',
    success: function (data) {

      var container_nc = $('#sheet-dtc table.nc > tbody');
      var container_nd = $('#sheet-dtc table.nd > tbody');

      var htmlObject;
      container_nc.find("*").remove();
      container_nd.find("*").remove();
      if (data.rows.length > 0) {
        // console.log('/././././/././')
        // console.log(data)
        let totalNcNotNull = 0;

        var symbolsNC = currency.symbol;
        var valorCambio = 1;
        if (dtc.data.moneda.code != currency.code && dtc.data.moneda.code != "") {
          symbolsNC = dtc.data.moneda.code;
          valorCambio = dtc.data.moneda.cambio;
          if (dtc.data.moneda.cambio == 0) {
            valorCambio = 1;
          }
        }

        $.each(data.rows, function (key, item) {
          let nullFont = item.estado === "NULO" ? 'class="redBold"' : '';
          htmlObject = $('<tr data-id="' + item.id + '">' +
            '<td>' + item.folio + '</td>' +
            '<td>' + item.documento + '</td>' +
            '<td>' + item.proveedor + '</td>' +
            '<td>' + item.referencia + '</td>' +
            '<td>' + item.emision + '</td>' +
            '<td ' + nullFont + ' >' + item.estado + '</td>' +
            '<td class="currency center">' + item.monto / valorCambio + '</td>' +
            '</tr>');
          htmlObject.find('.currency').formatCurrency({
            region: 'es-CL',
            decimalSymbol: ',',
            digitGroupSymbol: '.',
            roundToDecimalPlace: currency.decimals,
            symbol: '<span class="symbol">' + symbolsNC + '</span>',
            positiveFormat: (currency.is_right) ? '%n%s' : '%s%n',
            negativeFormat: (currency.is_right) ? '-%n%s' : '-%s%n'
          });


          if (item.tipo == '56') {
            htmlObject.click(function () {
              unaBase.loadInto.viewport('/v3/views/dtc/contentnd.shtml?id=' + item.id);
            });
            container_nd.append(htmlObject);
          }

          if (item.tipo == '61') {
            htmlObject.click(function () {
              // alert(item.id);
              unaBase.loadInto.viewport('/v3/views/dtc/contentnc.shtml?id=' + item.id);
            });
            container_nc.append(htmlObject);
          }

          if (item.estado !== "NULO") {
            totalNcNotNull += item.monto
          }
        });

        // $('#scrollncnd h1 span').text(data.rows.length);
        // 
        // container.find('[name="dtc[suma_nc]"]').text(data.total_neto_nc);
        // document.querySelector('span[name="dtc[suma_nc]"]').innerHTML = data.total_neto_nc;
       
        document.querySelector('span[name="dtc[suma_nc]"]').innerHTML = totalNcNotNull / valorCambio;
        

        const ncCountElement = document.querySelector('article.info-nc h1 span');
        const ndCountElementSpan = document.querySelector('article.info-nd h1 span');

        if (ncCountElement) {
          ncCountElement.innerHTML = container_nc.find('tr').length;
        }

        if (ndCountElementSpan) {
          var menuBar = $('#menu ul');
          const ndCountElement = container_nd.find('tr').length;
          ndCountElementSpan.innerHTML = ndCountElement;
          if (ndCountElement > 0) {
            dtc.display.visible(menuBar.find('li[data-name="delete_dtcnc"]'), false);
          }
        }

        //$('.numeric.currency .decinot').number(true, 0, ',', '.');
      } else {
        htmlObject = $('<tr><td colspan="7">No existen notas de crédito asociados.</td></tr>');
        container_nc.append(htmlObject);
      }

    }
  });
};

const get_comprobantes_modulo = (type) => {
  var id = $('#sheet-dtc').data('id');

  $.ajax({
    'url': '/4DACTION/_V3_get_comprobantes_modulos',
    data: {
      "id": id,
      "tipo": type
    },
    dataType: 'json',
    success: function (data) {

      var containerComprobantes = dtc.container.find('table.comprobantes > tbody');
      containerComprobantes.find("*").remove();
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

        document.querySelector('article.info-comprobantes h1 span').innerHTML = data.rows.length;
      } else {

        htmlObject = $('<tr><td colspan="9">No existen comprobantes asociados.</td></tr>');
        containerComprobantes.append(htmlObject);
      }

    }
  });
};

var get_facturas = function () {
  var id = $('#sheet-dtc').data('id');
  $.ajax({
    'url': '/4DACTION/_V3_get_facturas_nc_dtc',
    data: {
      idnota: id
    },
    dataType: 'json',
    success: function (data) {
      var container = $('#sheet-dtc table.facturas-nc > tbody');
      var container_nd = $('#sheet-dtc table.facturas-nd > tbody');
      var htmlObject;
      container.find("*").remove();

      var symbolsNC = currency.symbol;
      var valorCambio = 1;
      if (dtc.data.moneda.code != currency.code && dtc.data.moneda.code != "") {
        symbolsNC = dtc.data.moneda.code;
        valorCambio = dtc.data.moneda.cambio;
        if (dtc.data.moneda.cambio == 0) {
          valorCambio = 1;
        }
      }

      if (data.rows.length > 0) {
        $.each(data.rows, function (key, item) {
          htmlObject = $('<tr data-id="' + item.id + '">' +
            '<td>' + item.folio + '</td>' +
            '<td>' + item.documento + '</td>' +
            '<td>' + item.proveedor + '</td>' +
            '<td>' + item.referencia + '</td>' +
            '<td>' + item.emision + '</td>' +
            '<td>' + item.estado + '</td>' +
            '<td class="currency center">' + item.monto / valorCambio + '</td>' +
            '</tr>');
          htmlObject.find('.currency').formatCurrency({
            region: 'es-CL',
            decimalSymbol: ',',
            digitGroupSymbol: '.',
            roundToDecimalPlace: currency.decimals,
            symbol: '<span class="symbol">' + symbolsNC + '</span>',
            positiveFormat: (currency.is_right) ? '%n%s' : '%s%n',
            negativeFormat: (currency.is_right) ? '-%n%s' : '-%s%n'
          });


          if (item.tipo_doc == '56') {
            htmlObject.click(function () {
              unaBase.loadInto.viewport('/v3/views/dtc/contentnd.shtml?id=' + item.id);
            });
            container_nd.append(htmlObject);
          }

          if (item.tipo_doc == '33') {
            htmlObject.click(function () {
              unaBase.loadInto.viewport('/v3/views/dtc/content.shtml?id=' + item.id);
            });
            container.append(htmlObject);
          }
        });
        const nd_rows = container_nd.find('tr').length;
        const nc_rows = container.find('tr').length;
        $('.info-facturas h1 span').text(nc_rows);

        $('.info-facturas-nd h1 span').text(nd_rows);
      } else {
        htmlObject = $('<tr><td colspan="7">No existen notas de crédito asociados.</td></tr>');
        container.append(htmlObject);
      }

    }
  });
};

/*
var build_rows_compras = function(item){
  return $('<tr data-idoc="' + item.id + '">' +
    '<td><input type="hidden" name="ocdt[id_compras]'+ item.id +'" value="'+ item.id +'">' + item.numero + '</td>' +
    '<td>' + item.documento + '</td>' +
    '<td class="left">' + item.proveedor + '</td>' +
    '<td class="left">' + item.referencia + '</td>' +
    '<td>' + item.emision + '</td>' +
    '<td>' + item.estado + '</td>' +
    '<td><input type="hidden" name="ocdt[monto]'+ item.id +'" value="'+ item.total_justificado +'">' + currency.symbol + ' <span class="numeric currency">'+ item.total_justificado +'</span></td>' +
    '<td><!--<button class="remove ocs">Quitar</button>--></td>' +
  '</tr>');
}*/

/*var get_dtc_oc = function(id){
  var id = mainContainer.data('id');
  $.ajax({
    'url':'/4DACTION/_V3_get_dtc_oc',
    data:{
      "dtc[id]":id
    },
    dataType:'json',
    success:function(data){
      var container = mainContainer.find('table.ocs > tbody');
      var htmlObject;
      container.find("*").remove();
      if (data.rows.length>0) {
        $.each(data.rows, function(key, item){
          htmlObject = build_rows_compras(item);
          htmlObject.click(function(event){
            if (event.srcElement.localName != 'input' && event.srcElement.className != 'ui-button-text')
              unaBase.loadInto.viewport('/v3/views/compras/content.shtml?id=' + item.id);
          });
          container.append(htmlObject);
        });
        mainContainer.find('#scrollocs h1 span').text(data.rows.length);
        $('button.remove.ocs').button({icons: {primary: 'ui-icon ui-icon-circle-minus'},text: true});
      }else{
        htmlObject = $('<tr><td colspan="8">No existen documentos asociados.</td></tr>');
        container.append(htmlObject);
      }
    }
  });
};*/

/*var update_montos_oc_asociadas = function(){
  setTimeout(function(){
     // setea valores justificados en oc
    var compras = mainContainer.find('table.ocs > tbody > tr');
    var items = mainContainer.find('table.items > tbody > tr[data-tipo="ITEM"]');
    var sumaTotal = 0;
    compras.each(function() {
      var targetoc = $(this);
      var id = targetoc.data('idoc');
      var suma = 0;
      items.each(function() {
        if($(this).data('idoc') == id){
          var monto = parseFloat($(this).find('input[name="dtc[detalle_item][total]"]').data('justificado'));
          suma = suma + monto;
        }
        targetoc.find('input[name^="ocdt[monto]"]').val(Math.round(suma)).closest('td').find('span').text(Math.round(suma));
      });
      sumaTotal = sumaTotal + suma;
    });
    compras.find('span.numeric.currency').number(true, 2, ',', '.');
    $('input[name="dtc[suma_justificado]"]').val(Math.round(sumaTotal));
  },500);
}
*/

/*
var update_subtotal_items = function() {

 // obtiene contenedor items
  var containerItems = $('table.items tbody');

  // para calculo final
  var sumaSubTotal = 0;
  var sumaDescuento = 0;
  var sumaTotal = 0;

  var totalAfecto = 0;
  var totalRetencion = 0;
  var totalAdicional = 0;
  var totalExento = 0;

  // recorrido de item para calular item linea por linea
  containerItems.find('tr[data-tipo="ITEM"]').each(function() {

    // obtiene subtotal y descuento por linea para calcular total por linea
    var subtotalLinea = parseFloat($(this).find('input[name="dtc[detalle_item][subtotal]"]').val());
    var dsctolLinea = parseFloat($(this).find('input[name="dtc[detalle_item][dscto]"]').val());
    var totalLinea = subtotalLinea - dsctolLinea;
    $(this).find('input[name="dtc[detalle_item][total]"]').val(totalLinea);

    // obtiene impuesto por linea
    var tipoImp = $(this).find('input[name="dtc[detalle_item][imp][id]"]').data('tipoimp');
    var valorImpueto = parseFloat($(this).find('input[name="dtc[detalle_item][imp][id]"]').data('valorimp'));

    // calculo total por linea
    if (tipoImp == "IVA") {
      totalAfecto += totalLinea;
    }
    if (tipoImp == "RETENCION") {
      totalRetencion += totalLinea;
    }
    if (tipoImp == "ADICIONAL") {
      totalAdicional += totalLinea;
    }
    if (tipoImp == "EXENTO") {
      totalExento += totalLinea;
    }
    var justificado = totalLinea;

    $(this).find('input[name="dtc[detalle_item][total]"]').data('justificado', justificado);

    // suma subtotal, descuento, total y porjustificar
    sumaSubTotal += subtotalLinea;
    sumaDescuento += dsctolLinea;
    sumaTotal += totalLinea;

  });

  // Totales pie detalle
  $('input[name="dtc[suma_subtotal]"]').val(Math.round(sumaSubTotal));
  $('input[name="dtc[suma_dscto]"]').val(Math.round(sumaDescuento));
  $('input[name="dtc[suma_total]"]').val(Math.round(sumaTotal));

  update_montos_oc_asociadas();

  // montos totales
  var totalNeto = totalAfecto + totalRetencion;
  $('input[name="dtc[descuento]"]').val(Math.round(sumaDescuento));
  $('input[name="dtc[sub_total]"]').val(Math.round(sumaTotal));
  $('input[name="dtc[total_neto]"]').val(Math.round(totalNeto));
  $('input[name="dtc[total_exento]"]').val(Math.round(totalExento));
  $('input[name="dtc[total_adicional]"]').val(Math.round(totalAdicional));

  // impuestos
  var iva = (totalAfecto * 19)/100;
  var ret = (totalRetencion * 10)/100;
  var impuesto = iva + ret;
  $('input[name="dtc[total_iva]"]').val(Math.round(impuesto));

   // calcula monto total
  var total_final = totalAfecto + iva + (totalRetencion - ret) + totalExento + totalAdicional;
  $('input[name="dtc[total]"]').val(Math.round(total_final));

  // ajusta etiquetas
  var tipoDoc = $('[name="tipo_doc[id]"]').val();
  if (tipoDoc == 65 || tipoDoc == 66) {
    $('label[name="label-neto-hono"]').text('Honorario ' + currency.symbol + ':');
    $('label[name="label-iva-ret"]').text('Retención ' + currency.symbol + ':');
  }else{
    $('label[name="label-neto-hono"]').text('Neto ' + currency.symbol + ':');
    $('label[name="label-iva-ret"]').text('Iva ' + currency.symbol + ':');
  }

  // resumen_info_totales();

};*/

/*
var validate_duplicate_folio =  function(){
  var status = true;
  $.ajax({
    'url':'/4DACTION/_V3_valida_folio_dtc',
    data:{
      "dtc[valida][id]": dtc.id,
      "dtc[valida][tipo_doc]": $('[name="tipo_doc[id]"]').val(),
      "dtc[valida][folio]": $('[name="dtc[nro_folio]"]').val(),
      "dtc[valida][id_prov]": $('[name="contacto[info][id]"]').val()
    },
    async: false,
    dataType:'json',
    success: function(data){
      if (!data.success & data.error != 0) {
        if (data.error == 1) {
          status = false;
        }
      }
    }
  });
  return status;
}*/

var validate_minimal_item_to_remove = function () {
  var titulos = mainContainer.find('table.items > tbody > tr[data-tipo="TITULO"]');
  var items = mainContainer.find('table.items > tbody > tr[data-tipo="ITEM"]');
  if (titulos.length == 1) {
    titulos.find('.remove.item').hide();
  } else {
    titulos.find('.remove.item').show();
  }
  if (items.length == 1) {
    items.find('.remove.item').hide();
  } else {
    items.find('.remove.item').show();
  }
}

/*
var menus = function(){
  unaBase.toolbox.init();
    unaBase.toolbox.menu.init({
    entity: 'Dtc',
    buttons: ['save','exit','discard','share_dtc','delete_dtc'],
    data: function(){
      // 
      return mainContainer.serializeAnything();
    },
    validate:function(){
      var msgError = '';
      var status = true;

      // obtiene valore spara validar
      var estado = mainContainer.data('estado');
      var referencia = $('input[name="dtc[referencia]"]').val();
      var tipoDocumento = $('[name="tipo_doc[id]"]').val();
      var folio = $('input[name="dtc[nro_folio]"]').val();
      var proveedor = $('input[name="contacto[info][id]"]').val();
      var subtotal = parseFloat($('input[name="dtc[sub_total]"]').val());
      var from = mainContainer.data('from');
      var maxocJustificar = parseFloat(mainContainer.data('maxoc'));
      var totalJustificado = parseFloat($('input[name="dtc[suma_justificado]"]').val());
      var totaldtc = parseFloat($('input[name="dtc[total]"]').val());

      // remove fondo rojo
      mainContainer.find('input, select').removeClass("invalid");

      if (totalJustificado > maxocJustificar && from == "OC" && estado == "POR EMITIR") {
        msgError = msgError + '- El monto justificado es mayor al total del documento.<br/>';
        mainContainer.find('table.items > tbody input[name="dtc[detalle_item][precio]"]').addClass('invalid');
      }

      if (referencia == "") {
        msgError = msgError + '- Falta ingresar referencia.<br/>';
        $('input[name="dtc[referencia]"]').addClass('invalid');
      }

      var verify1 = false;
      if (tipoDocumento == "") {
        msgError = msgError + '- Falta seleccionar tipo de documento.<br/>';
        $('[name="tipo_doc[descripcion]"]').addClass('invalid');
      }else{
        verify1 = true;
      }

      var verify2 = false;
      if (folio == "") {
        msgError = msgError + '- Falta ingresar número documento.<br/>';
        $('input[name="dtc[nro_folio]"]').addClass('invalid');
      }else{
        verify2 = true;
      }

      var verify3 = false;
      if (proveedor == "" || proveedor == "0") {
        msgError = msgError + '- Falta ingresar proveedor.<br/>';
        $('input[name="contacto[info][alias]"]').addClass('invalid');
      }else{
        verify3 = true;
      }

      if (totaldtc == 0) {
        msgError = msgError + '- Falta ingresar monto.<br/>';
        mainContainer.find('table.items > tbody input[name="dtc[detalle_item][precio]"]').addClass('invalid');
      }

      if (verify1 && verify2 && verify3) {
        if (!validate_duplicate_folio()) {
          msgError = msgError + '- El documento Nro. "'+ folio + '", ya se encuentra registrado, por favor re-ingrese un nuevo número.<br/>';
          $('input[name="dtc[nro_folio]"]').focus().addClass('invalid');
        }
      }

      if (msgError == '') {
        status = true;
      }else{
        toastr.error(msgError);
        status = false;
      }
      return status;

    }
  });
}*/

/*

var validations = function(){
  var folio = mainContainer.find('input[name="dtc[nro_folio]"]').val();
  var from = mainContainer.data('from');
  var estado = mainContainer.data('estado');
  var tipogasto = mainContainer.data('tipogasto');
  var tipodoc =  mainContainer.find('[name="tipo_doc[id]"]').val();
  var items = mainContainer.find('table.items > tbody');
  var cantItems = items.length;
  $('#menu ul li[data-name="delete_dtc"]').hide();
  $('#menu ul li[data-name="discard"]').hide();

  $('.objoc, .objfxr').show();
  if (from == "FXR") {
    $('.objoc').hide();
  }else{
    $('.objfxr').hide();
    $('.show.dtc').hide();
  }

  if (estado == "POR EMITIR" || estado == "POR REVISAR") {
    get_formas_pago();
    if(cantItems > 0){
      $('input[name="dtc[sub_total]"], input[name="dtc[descuento]"], input[name="dtc[descuento]"], input[name="dtc[total_exento]"], input[name="dtc[total_adicional]"]').prop('readonly', true).addClass( "nofull" );
    }
    if (estado == "POR EMITIR") {
      if (from == "FXR") {
        $('.max').hide();
        $('input[name="contacto[info][alias]"], input[name="contacto[info][razon_social]"], input[name="contacto[info][rut]"], input[name="contacto[info][giro]"]').val('');
        $('input[name="name="contacto[info][id]"]').val('0');
        $('.info-proveedor .expand').addClass('active');
        mainContainer.find('input[name="dtc[referencia]"]').val('');
        $('.profile2.empresa').hide();
        setTimeout(function(){
           $('input[name="dtc[referencia]"]').focus();
        }, 1);
      }else{
        $('input[name="tipo_doc[descripcion]"], input[name="contacto[info][alias]"]').attr('type', 'text').removeClass("full");
        setTimeout(function(){
           $('input[name="dtc[nro_folio]"]').focus();
        }, 1);
      }
    }
    if (estado == "POR REVISAR") {
      if (access._503) { // anular
        $('#menu ul li[data-name="discard"]').show();
      }
    }

    $('#scrollocs').hide();
    validate_minimal_item_to_remove();
  }else{

    // POR PAGAR - PAGADO - NULO
    $('.info-general > .expand').removeClass('active');
     mainContainer.find('input[type="search"]').attr('type', 'text');
    $('input[name="dtc[fecha_emision]"').removeClass("datepicker2");
    mainContainer.find('input').prop('readonly', true).removeClass("full");
    $('.show.dtc, .duplicate.item, .show.impuestos, .profile2.empresa, .add.item, .add.items, .remove.item, .max').hide();
    setTimeout(function(){
      $('.remove.ocs').hide();
    }, 500);
    if (estado == "POR PAGAR" && from == "OC" && access._449) { // 449 modificar dtc
      $('.info-general > .expand').addClass('active');
      $('input[name="dtc[referencia]"], input[name="dtc[nro_folio]"], input[name="dtc[fecha_emision]"], input[name="dtc[detalle_item][cantidad]"], input[name="dtc[detalle_item][precio]"]').prop('readonly', false).addClass("full");
      $('input[name="dtc[fecha_emision]"').addClass("datepicker2");
      $('.duplicate.item, .show.impuestos').show();
      $('input[name="dtc[detalle_item][nombre]"], input[name="dtc[detalle_item][dscto]"]').prop('readonly', false);
    }
  }

  if (tipodoc == "61" || from == "OC") {
    $('input[name="contacto[info][alias]"]').prop('readonly', true).attr('type', 'text');
    $('label[name="text[alias]"]').text('Alias:');
    $('.add.item, .add.items').hide();
    $('.info-general > .expand').addClass('active');
    $('input[name="dtc[referencia]"], input[name="dtc[nro_folio]"], input[name="dtc[fecha_emision]"], input[name="dtc[detalle_item][cantidad]"], input[name="dtc[detalle_item][precio]"]').prop('readonly', false).addClass("full");
  }

  if (access._465) { // eliminar
   $('#menu ul li[data-name="delete_dtc"]').show();
  }

  $('#menu ul li[data-name="share_dtc"]').hide(); // oculto ya que actualmente no hace nada.

}

*/

/*
var get_items = function(id){
  $.ajax({
    'url':'/4DACTION/_V3_get_items_dtc',
    data:{
      "dtc[id]":id
    },
    dataType:'json',
    async:false,
    success:function(data){
      if (data.rows.length > 0) {
        var current = mainContainer.find('table.items > tbody');
        var currentTitulo;
        current.find("*").remove();
        $.each(data.rows, function(key, item){
          if (item.tipo == "TITULO"){
            currentTitulo = get_detail.titulo('prependTo', current, item);
          }else{
            var currentItem = mainContainer.find('table.items > tbody > tr[data-llave="'+item.llave_titulo+'"]');
            if(item.llave_titulo == "") {
              get_detail.item('prependTo', current, item);
            }else{
              get_detail.item('insertAfter', currentItem, item);
            }
          }
        });
        calcula_por_filas();
        update_subtotal_items();
      }else{
        $('table.items').hide();
      }
    }
  });
};*/

/*
var add_items_dtc = function(data){
  var container = mainContainer.find('table.items > tbody');
  $.each(data.rows, function(key, item){
    if (item.tipo == "TITULO"){
        get_detail.titulo('prependTo', container, item);
    }else{
      var containerItem = mainContainer.find('table.items > tbody > tr[data-llave="'+item.llave_titulo+'"]');
      if(item.llave_titulo == ""){
        get_detail.item('prependTo', container, item);
      }else{
        get_detail.item('insertAfter', containerItem, item);
      }
    }
  });
  // calcula_por_filas();
  // update_subtotal_items();
  dtc.display.paint();
  return false;
}
*/

$(document).ready(function () {

  dtc.init($('#sheet-dtc').data('id'));
  var id = dtc.id;
  //console.log(dtc.data)
  $('.country-label-rut').text(country.label_rut);

  // $('.numeric.currency input').number(true, 2, ',', '.');
  // $('.numeric.currency .deciyes').number(true, 2, ',', '.');
  // $('.numeric.currency .decinot').number(true, 0, ',', '.');
  $('.numeric.currency label.otros_montos').number(true, 0, ',', '.');
  $('.numeric.currency span.otros_montos').number(true, 0, ',', '.');

  $('button.show').button({ icons: { primary: 'ui-icon-carat-1-s' }, text: false });
  $('button.profile2').button({ icons: { primary: 'ui-icon-pencil' }, text: false });
  $('button.profile').button({ icons: { primary: 'ui-icon-gear' }, text: false });
  $('button.unlock').button({ icons: { primary: 'ui-icon-unlocked' }, text: false });
  $('button.edit.save').button({ icons: { primary: 'ui-icon-disk' }, text: false });
  $('button.edit.discard').button({ icons: { primary: 'ui-icon-close' }, text: false });
  $('button.add.nc').button({ icons: { primary: 'ui-icon ui-icon-circle-plus' }, text: true });

  // agregar ocs
  $('button.addexist.ocs').button({ icons: { primary: 'ui-icon-circle-zoomin' }, text: true }).click(function () {
    dtc.addExistOcs();
  });


  dtc.container.on('change blur click', 'input[required]', function () {
    dtc.display.paint();
  });

  $('.edit').bind('change', function (event) {
    dtc.set(event.target);
  });

  dtc.containerItems.on("blur change", "td.numeric input", function () {
    $(this).validateNumbers();
    dtc.montos.items($(this).closest('tr'));
  });

  // add categoria e items
  $('button.add.items').click(function () {
    var id = mainContainer.data('id');
    var idoc = mainContainer.data('idoc');
    var cantTitulos = mainContainer.find('table.items > tbody > tr[data-tipo="TITULO"]').length;
    var correlativo = mainContainer.find('table.items > tbody > tr').length;
    var tipodoc = mainContainer.find('[name="tipo_doc[id]"]').val();
    $.ajax({
      'url': '/4DACTION/_v3_get_rows_dtc',
      data: {
        "oc[rows][id_oc]": idoc,
        "oc[rows][id_dtc]": id,
        "oc[rows][id_nv]": 0,
        "oc[rows][tipo]": "AMBOS",
        "oc[rows][cant_titulos]": cantTitulos,
        "oc[rows][correlativo]": correlativo,
        "oc[rows][tipo_doc][id]": tipodoc
      },
      dataType: 'json',
      success: function (data) {
        dtc.items.add(data);
      }
    });
    return false;
  });

  // quitar asociación a dtc
  $('button.remove.ocs').button({ icons: { primary: 'ui-icon ui-icon-circle-minus' }, text: true });
  $('table.ocs > tbody').bind('click', 'button.remove.ocs', function (event) {
    var targetoc = $(event.target).closest('tr');
    if (event.srcElement.localName == 'span') {
      confirm('¿Desea quitar la Orden de compra?').done(function (data) {
        if (data) {

          // quita oc
          var idoc = targetoc.data('idoc');
          targetoc.remove();

          // quita items
          var targetItems = mainContainer.find('table.items > tbody > tr[data-tipo="ITEM"][data-idoc="' + idoc + '"]');
          var llaveTitulo = targetItems.data('llavetitulo');
          targetItems.remove();

          // quita titulo
          mainContainer.find('table.items > tbody > tr[data-tipo="TITULO"][data-llave="' + llaveTitulo + '"]').remove();

          // verifica si existe filas para ocultar sección items
          var rows = mainContainer.find('table.items > tbody > tr');
          if (rows.length == 0) {
            $('table.items').hide();
          }

          // update_subtotal_items();

        }
      });
    }
  });

  // add oc a dtc
  $('button.add.ocs').button({ icons: { primary: 'ui-icon ui-icon-circle-plus' }, text: true }).click(function () {
    var proveedor = $('input[name="contacto[info][id]"]').val();
    var tipodoc = $('[name="tipo_doc[id]"]').val();
    var totaljust = $('input[name="dtc[total]"]').val();
    unaBase.loadInto.dialog('/v3/views/dtc/buscar_oc.shtml?id=' + id + '&pro=' + proveedor + '&tipo=' + tipodoc + '&total=' + totaljust, 'SELECCIONAR ORDEN DE COMPRA', 'large');
  });

  // add nc
  $('button.add.nc').button({ icons: { primary: 'ui-icon ui-icon-circle-plus' }, text: true }).click(function () {
    dtc.notasCredito.add();
  });
  // add ncFull
  $('button.add.ncFull').button({ icons: { primary: 'ui-icon ui-icon-circle-plus' }, text: true }).click(function () {
    dtc.notasCredito.add('full');
  });

  $('button.add.ndFull').button({ icons: { primary: 'ui-icon ui-icon-circle-plus' }, text: true }).click(function () {
    dtc.notasDebito.add('full');
  });

  // add ncPartial
  $('button.add.ncPartial').button({ icons: { primary: 'ui-icon ui-icon-circle-plus' }, text: true }).click(function () {
    let html = `<section> 
                <span>Crear nota de crédito</span> 
                <br/>
                <br/>
                <label style="cursor:pointer;" for="ncItem">
                  <input id="ncItem"  type="radio" name="ncType" value="item"> Por ítem<br>
                
                <br/>
                </label>
                <label style="cursor:pointer;" for="ncAmount">
                  <input id="ncAmount" type="radio" name="ncType" value="amount"> Por Monto<br>
                </label>
                </section>`;


    prompt(html).done(function (data) {
      let ncType = $('input[name="ncType"]:checked').val();
      if (ncType === 'item') {
        dtc.notasCredito.add();
      } else {
        let monto = dtc.data.montos.neto - dtc.data.montos.descuento_nc_netos;
        // let html = `<section> 
        //         <div>
        //           <span>Selecciona el monto o porcentaje a descontar de la factura.</span> 
        //           <br/>
        //           <span style="text-align:center;">Máximo a descontar: ${$.number(monto, currency.decimals, currency.decimals_sep, currency.thousands_sep)}</span> 
        //         </div>
        //         <br/>
        //         <br/>
        //         <div>
        //         <table>
        //           <thead>
        //             <tr>
        //               <span>Monto a descontar</span>
        //             </tr>
        //             <tr>
        //               <span>%</span>
        //             </tr>
        //             <tr>
        //               <span>Saldo</span>
        //             </tr>
        //           </thead>
        //           <tbody>
        //             <tr>                    
        //               <label class="numeric currency" for="percentage">
        //                 <input id="percentage"  class="fill1" type="text" name="percentage" value="${$.number(monto, currency.decimals, currency.decimals_sep, currency.thousands_sep)}">             
        //               </label>
        //             </tr>
        //             <tr>       
        //               <label class="numeric percent" for="amount">
        //                 <input id="amount" class="fill1" type="text" name="amount" value="100">
        //               </label>
        //             </tr>
        //             <tr>       
        //               <span>Saldo</span>
        //             </tr>
        //           </tbody>

        //         </table>
        //         </div>
        //         </section>`;
        //         $(html).find('input[name="percentage"]').on("focus", function(event){
        //           let decimals = currency.decimals + 2;
        //           $(event.target).number(true, decimals, currency.decimals_sep, currency.thousands_sep);
        //           $(event.target).val($(event.target).data('value'));
        //         });
        // prompt(html).done(function(data) {

        //   $(this).remove();
        // });

        unaBase.loadInto.dialog('/v3/views/dtc/dialog/ncMonto.shtml', 'Nota de crédito por monto', 'x-large');
      }
      $(this).remove();
    });
    // dtc.notasCredito.add('partial');
  });

  $('button.add.ndPartial').button({ icons: { primary: 'ui-icon ui-icon-circle-plus' }, text: true }).click(function () {
    dtc.notasDebito.add();
  });

  $('#dropdown_menu_').menu().hide();

  // valida que folio no se repita
  $('input[name="folio"]').change(function () {

    var warning = false;
    if (dtc.data.id_tipo_doc != "" && dtc.data.folio != "" && dtc.data.contacto.id != 0) {
      var status = (dtc.data.id_tipo_doc === "56" || dtc.data.id_tipo_doc === "61" || dtc.data.id_tipo_doc === "60") ? dtc.validate() : dtc.validate.duplicate();
      if (status.error == "locked") {
        alert('El documento Nro. "' + dtc.data.folio + '", ya se encuentra registrado. Ingrese un nuevo número.');
        $(this).val("").focus();
        dtc.data.folio = "";
      }
    }
  });

  // Agregar items
  mainContainer.find('table.items > tbody').on('click', 'button.add.item', function () {
    var current = $(this).parentTo('tr');
    var id = mainContainer.data('id');
    var idoc = mainContainer.data('idoc');
    var llave_titulo = current.data('llave');
    var cantTitulos = mainContainer.find('table.items > tbody > tr[data-tipo="TITULO"]').length;
    var correlativo = mainContainer.find('table.items > tbody > tr').length;
    var tipodoc = mainContainer.find('[name="tipo_doc[id]"]').val();
    $.ajax({
      'url': '/4DACTION/_v3_get_rows_dtc',
      data: {
        "oc[rows][id_oc]": idoc,
        "oc[rows][id_dtc]": id,
        "oc[rows][id_nv]": 0,
        "oc[rows][tipo]": "ITEM",
        "oc[rows][cant_titulos]": cantTitulos,
        "oc[rows][llave_titulo]": llave_titulo,
        "oc[rows][correlativo]": correlativo,
        "oc[rows][tipo_doc][id]": tipodoc
      },
      dataType: 'json',
      success: function (data) {
        add_items_dtc(data);
      }
    });
  });


  // quitar items
  dtc.container.find('table.items > tbody').on('click', 'button.remove.item', function () {
    if ($('table.items tbody tr').length <= 2) {

    } else {
      dtc.items.removes($(this).closest('tr'));
    }
  });

  // duplicar items
  dtc.container.find('table.items > tbody').on('click', 'button.duplicate.item', function () {
    dtc.items.duplicate($(this).closest('tr'));
  });

  // carga forma de pago
  $('button.show.forma-pago').click(function () {
    $('input[name="des_forma_pago"]').autocomplete('search', '@').focus();
  });
  $('input[name="des_forma_pago"]').autocomplete({
    source: function (request, response) {
      $.ajax({
        url: '/4DACTION/_V3_' + 'getFormaPagos?compra=true',
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
      dtc.data.id_forma_pago = ui.item.id;
      dtc.data.des_forma_pago = ui.item.des;
      return false;
    }

  }).data('ui-autocomplete')._renderItem = function (ul, item) {
    return $('<li><a><strong class="highlight">' + item.des + '</strong></a></li>').appendTo(ul);
  };

  // Carga dtc
  $('button.show.dtc').click(function () {
    $('input[name="des_tipo_doc"]').autocomplete('search', '@').focus();
  });
  $('input[name="des_tipo_doc"]').autocomplete({
    source: function (request, response) {
      $.ajax({
        url: '/4DACTION/_V3_' + 'getTiposDocDeCompras',
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
      dtc.data.id_tipo_doc = ui.item.id;
      dtc.data.des_tipo_doc = ui.item.des;
      $('input[name="folio"]').val("");
      dtc.data.folio = "";

      $('[name="des_tipo_doc"]').val(dtc.data.des_tipo_doc);
      if (dtc.data.id_tipo_doc != "") {
        $.each(dtc.impuesto.getByDoc(dtc.data.id_tipo_doc).rows, function (key, item) {
          if (item.defecto) {
            if (item.correlativo != "") {
              $('input[name="folio"]').val(item.correlativo);
              dtc.data.folio = item.correlativo;
            }
            $('table.items > tbody > tr[data-tipo="ITEM"] td input[name="dtc[detalle_item][imp][id]"]').val(item.id);
            $('table.items > tbody > tr[data-tipo="ITEM"] td input[name="dtc[detalle_item][imp][id]"]').data('valorimp', item.valor);
            $('table.items > tbody > tr[data-tipo="ITEM"] td input[name="dtc[detalle_item][imp][id]"]').data('tipoimp', item.tipo);
            $('table.items > tbody > tr[data-tipo="ITEM"] td input[name="dtc[detalle_item][imp][des]"]').val(item.des);
          }
        });
      }


      if (ui.item.imp_multiple) {
        dtc.montos.update_impuestos_multiples_view(ui.item.id);
      } else {
        let extras = $('li.extra');

        if (extras.length > 0) {
          extras.remove();
        }

      }


      dtc.montos.totales();
      dtc.resumen.general();
      return false;
    }
  }).data('ui-autocomplete')._renderItem = function (ul, item) {
    return $('<li><a><span class="highlight">' + item.des + '</span></a></li>').appendTo(ul);
  };





  switch (dtc.data.id_tipo_doc) {
    case "61":
      get_facturas();
      get_nc('nc');
      break;
    case "56":
      get_nc('nde');
      get_comprobantes_modulo('nde');
      break;
    default:
      get_facturas();
      get_nc();
      break;
  }





  $('input[name="resumen[dtc][attachment]"]').change(function () {
    unaBase.ui.block();
    var data = new FormData();

    if ($('input[name="resumen[dtc][attachment]').get(0).files[0].type != 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      const nameFile = $('[data-name="resumen[dtc][doc]"]').text() + ' ' + $('[data-name="resumen[dtc][number]"]').text()
      data.append('file', $('input[name="resumen[dtc][attachment]').get(0).files[0]);
      data.append('filename', nameFile);
      data.append('index', 'Doc_Tributario_Compra|' + $('section.sheet').data('id'));
      $.ajax({
        url: '/4DACTION/_V3_setUpload',
        type: 'POST',
        contentType: false,
        data: data,
        dataType: 'json',
        processData: false,
        cache: false,
        success: function (data) {

          toastr.success('Archivo cargado con éxito!');
          $('input[name="resumen[dtc][attachment]').val(undefined);

          dtc.data.attached_file = nameFile
          dtc.display.paint()
          unaBase.ui.unblock();
        }
      });
    } else {
      toastr.warning('Formato de archivo no permitido');
      unaBase.ui.unblock();
    }

  });


  $('input[name="resumen[dtc][attachment_xml]"]').change(function () {
    unaBase.ui.block();
    var data = new FormData();
    const fileXML = $('input[name="resumen[dtc][attachment_xml]"]').get(0).files[0]


    // Validar que el archivo sea XML
    if (fileXML.type != 'text/xml') {
      toastr.warning('Formato de archivo no permitido. Por favor, seleccione un archivo XML.');
      unaBase.ui.unblock();
      return; // Detener la ejecución si el archivo no es XML
    }

    // Proceder con el archivo XML
    data.append('file', $('input[name="resumen[dtc][attachment_xml]"]').get(0).files[0]);
    data.append('filename', fileXML.name + ' ' + $('[data-name="resumen[dtc][number]"]').text());
    data.append('index', 'DTC_XML|' + $('section.sheet').data('id'));

    $.ajax({
      url: '/4DACTION/_V3_setUpload',
      type: 'POST',
      contentType: false,
      data: data,
      dataType: 'json',
      processData: false,
      cache: false,
      success: function (data) {
        toastr.success('Archivo cargado con éxito!');
        $('input[name="resumen[dtc][attachment_xml]"]').val(undefined);
        dtc.data.attached_xml = fileXML.name + ' ' + $('[data-name="resumen[dtc][number]"]').text()
        dtc.display.paint()
        unaBase.ui.unblock();
      }
    });
  });


  if (access._553) {
    $('button.profile2.empresa').remove();
  }

  $('input[name="contabilizado"]').change(function () {
    if ($(this).not(':checked')) {
      confirm('¿Desea quitar la información de contabilización?').done(function (data) {
        if (data) {
          $.ajax({
            url: '/4DACTION/_V3_removeContabilizadoDtc',
            data: {
              id: $('section.sheet').data('id')
            },
            dataType: 'json',
            success: function (subdata) {
              if (subdata.success) {
                toastr.success('Se ha quitado la información de contabilización.');
                $('input[name="correlativo"]').val(0);
                $('input[name="fecha_contable"]').val('00-00');
                $('input[name="fecha_hora_envio"]').val('00-00-00 00:00:00');
                $('input[name="enviado_por"]').val('');
                $('input[name="enviado_por"]').closest('ul').remove();
              }
            }
          });
        }
      });
    }
  });

  $('.preliquidacion input[data-estimate="true"]').bind("change blur", function () {

    dtc.data.liquidacion.hextras = parseFloat($('input[name="hextras"]').val().replace(/\./g, ''));
    dtc.data.liquidacion.gratificaciones = parseFloat($('input[name="gratificaciones"]').val().replace(/\./g, ''));
    dtc.data.liquidacion.thaberes = parseFloat($('input[name="thaberes"]').val().replace(/\./g, ''));
    dtc.data.liquidacion.tdescuentos = parseFloat($('input[name="tdescuentos"]').val().replace(/\./g, ''));

    dtc.data.liquidacion.leycinemonto = (dtc.data.liquidacion.thaberes * 0.1075);
    dtc.data.liquidacion.leycinechk = $('input[name="leycinechk"]').is(':checked');
    if (dtc.data.liquidacion.leycinechk) {
      // $('input[name="leycinemonto"]').val(dtc.data.liquidacion.leycinemonto);
      $('input[name="leycinemonto"]').val($.number(dtc.data.liquidacion.leycinemonto, currency.decimals, currency.decimals_sep, currency.thousands_sep));
    } else {
      $('input[name="leycinemonto"]').val(0);
      dtc.data.liquidacion.leycinemonto = 0;
    }
    dtc.data.liquidacion.lpagaremp = dtc.data.liquidacion.thaberes - dtc.data.liquidacion.tdescuentos - dtc.data.liquidacion.leycinemonto;
    dtc.data.liquidacion.tcostoempresa = dtc.data.liquidacion.thaberes;

    // corregido 04-08-17 - gin
    $('input[name="lpagaremp"]').val($.number(dtc.data.liquidacion.lpagaremp, currency.decimals, currency.decimals_sep, currency.thousands_sep));
    $('input[name="lpagarpre"]').val($.number(dtc.data.liquidacion.tdescuentos, currency.decimals, currency.decimals_sep, currency.thousands_sep));
    $('input[name="lpagarsii"]').val($.number(dtc.data.liquidacion.leycinemonto, currency.decimals, currency.decimals_sep, currency.thousands_sep));
    $('input[name="tcostoempresa"]').val($.number(dtc.data.liquidacion.tcostoempresa, currency.decimals, currency.decimals_sep, currency.thousands_sep));

    /*$('input[name="lpagaremp"]').val(dtc.data.liquidacion.lpagaremp);
    $('input[name="lpagarpre"]').val(dtc.data.liquidacion.tdescuentos);
    $('input[name="lpagarsii"]').val(dtc.data.liquidacion.leycinemonto);
    $('input[name="tcostoempresa"]').val(dtc.data.liquidacion.tcostoempresa);*/

    var totalDescuentoMasLey = dtc.data.liquidacion.tdescuentos + dtc.data.liquidacion.leycinemonto;
    // $('input[name="iva"]').val(totalDescuentoMasLey);
    $('input[name="iva"]').val($.number(totalDescuentoMasLey, currency.decimals, currency.decimals_sep, currency.thousands_sep));

    // cargar y ajusta formato al cambiar valor, corregido 04-08-17 - gin
    $('[name="thaberes"]').val($.number(dtc.data.liquidacion.thaberes, currency.decimals, currency.decimals_sep, currency.thousands_sep));
    $('[name="hextras"]').val($.number(dtc.data.liquidacion.hextras, currency.decimals, currency.decimals_sep, currency.thousands_sep));
    $('[name="gratificaciones"]').val($.number(dtc.data.liquidacion.gratificaciones, currency.decimals, currency.decimals_sep, currency.thousands_sep));
    $('[name="tdescuentos"]').val($.number(dtc.data.liquidacion.tdescuentos, currency.decimals, currency.decimals_sep, currency.thousands_sep));

  });

  // seleccionar fecha
  $('input[name="fecha_emision"]').change(function () {
    var date = $(this).val();
    var day = parseInt(date.substring(0, 2));
    var month = parseInt(date.substring(3, 5));
    var year = parseInt(date.substring(6, 10));

    var days = 90;

    var selected_date = new Date(year, month - 1, day);
    var past_date = new Date();
    past_date.setDate(past_date.getDate() - days);


    var inputObject = $('input[name="fecha_emision"]');
    var spanObject = inputObject.closest('span');

    spanObject.find('span.aviso-dias').remove();
    if (selected_date < past_date) {
      spanObject.append('<span class="aviso-dias" style="color: red; font-weight: bold; font-size: 11px;">documento excede ' + days + ' días</span>');
    }
  });

  // agregar pagos 10-08-17 - gin
  $('button.add.op').button({ icons: { primary: 'ui-icon-circle-plus' }, text: true }).click(function () {
    // 479 crear op
    if (dtc.data.estado == "POR PAGAR") {
      if (access._479) {
        $.ajax({
          url: '/4DACTION/_V3_setPago',
          dataType: 'json',
          type: 'POST',
          async: false,
          data: {
            "origen": "DTC",
            "id_origen": dtc.id
          }
        }).done(function (data) {
          if (data.success)
            unaBase.loadInto.viewport('/v3/views/pagos/content2.shtml?id=' + data.id);
          else
            toastr.warning(data.errorMsg);

        });
      } else {
        toastr.warning(NOTIFY.get('No es posible realizar el pago. No cuenta con los permisos asignados.'));
      }
    } else {
      toastr.warning(NOTIFY.get('No es posible realizar el pago. No cuenta con saldo a pagar.'));
    }
  });
  // 
  if (!access._651) {
    dtc.display.visible(dtc.container.find('.add.ncFull'), false);
    dtc.display.visible(dtc.container.find('.add.ncPartial'), false);
  }

  if (uVar.data !== null) {
    if (typeof uVar.data.ncType !== 'undefined') {
      
      switch (uVar.data.ncType) {
        case 'full':
          $('.remove.item').remove();
          $('.duplicate.item').remove();
          $('table.items input').prop('readonly', true);
          break;
        case 'amount':
          $('.remove.item').remove();
          $('.duplicate.item').remove();
          $('table.items input').prop('readonly', true);
          // let lines = $('table.items tbody tr:not(.title)');
          let lines = document.querySelectorAll('table.items tbody tr:not(.title)');
          let percentage = parseFloat(uVar.data.amount) / 100;
          console.log(lines);
          for (let line of lines) {
            // console.log(line);

            let pu = line.querySelector('input[name="dtc[detalle_item][precio]"]');
            let puValue = parseFloat(pu.value.replace(currency.thousands_sep, ''));
            let subtotal = line.querySelector('input[name="dtc[detalle_item][subtotal]"]');
            let total = line.querySelector('input[name="dtc[detalle_item][total]"]');

            // let quantity = parseFloat(parent.find('input[name="dtc[detalle_item][cantidad]"]').val());
            let quantity = parseFloat(line.querySelector('input[name="dtc[detalle_item][cantidad]"]'));
            let newPrice = puValue * percentage;

            pu.value = $.number(newPrice, currency.decimals, currency.decimals_sep, currency.thousands_sep);
            // subtotal.value = newPrice * quantity;

            // dtc.montos.items(parent);
            // parent.find('input[name="dtc[detalle_item][subtotal]"]').val(oldPrice * quantity);
            // parent.find('input[name="dtc[detalle_item][total]"]').val((oldPrice * quantity) - dscto);
            dtc.montos.items($(line));
          }
          break;
      }
    }
  }
  setTimeout(() => {
    if (dtc.isDraft() && dtc.gastos.fromMany()) {
      let priceLines = document.querySelectorAll(`input[name="dtc[detalle_item][precio]"]`);
      priceLines.forEach(line => {
        dtc.display.enabled($(line), false);
      })
    }

  }, 500);
  if (!access._659) {
    $('button.op.add').hide();
  }
});
