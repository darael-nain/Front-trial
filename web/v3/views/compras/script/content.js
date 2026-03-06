compras.data = {}
var id_dtc_default_old = 0;
var tipopago_default_old = '';
var idbanco_default_old = '';
var tipocuenta_default_old = '';
var nrocuenta_default_old = '';
var mx_clabe_default_old = '';
var mainContainer = $('#sheet-compras');
var containerItems = mainContainer.find('table.items > tbody');
var expensesParams = {}

var verifica_negocio_asociado = function () {
  var targetItems = $('#sheet-compras table.items > tbody > tr[data-tipo="ITEM"][data-deslugarorigen="ITEM DIRECTO"]');
  var counter = 0;
  var previousName = "";
  var currentName = "";
  var currentNro = "";
  targetItems.each(function (key, item) {
    currentName = $(this).data('refnv');
    currentNro = $(this).data('nronv');
    compras.id_nv_negocio = $(this).data('nv');
    compras.folio_negocio = $(this).data('nronv');;
    if (previousName != currentName) {
      previousName = currentName;
      counter++;
    }
  });
  if (counter > 1) {
    compras.id_nv_negocio = 0;
    compras.folio_negocio = "";
  }
}

var check_pending_fxr = function (idSolicitante) {
  var status = true;
  $.ajax({
    'url': '/4DACTION/_v3_check_pending_fxr',
    data: {
      "id_solicitante": idSolicitante
    },
    async: false,
    dataType: 'json',
    success: function (data) {
      if (!data.success) {
        status = false;
      }
    }
  });
  return status;
}

var oc_cambia_titulo_box_dtc = function (tipodtc) {
  $("#scrolldtc h1 label").text("Documentos de compra");
  var tipogasto = $('input[name="oc[tipo_gastos][id]"]').val();

  if ((tipodtc != "") && (tipogasto == "OC")) {
    if ((tipodtc == "FACTURA") || (tipodtc == "FACTURA ELECTRONICA")) {
      $("#scrolldtc h1 label").text("Facturas de compra");
    }
    if ((tipodtc == "FACTURA EXENTA") || (tipodtc == "FACTURA EXENTA ELECTRONICA")) {
      $("#scrolldtc h1 label").text("Facturas exentas de compra");
    }
    if ((tipodtc == "BOLETA DE HONORARIOS") || (tipodtc == "BOLETA DE HONORARIOS ELECTRONICA")) {
      $("#scrolldtc h1 label").text("Boletas de honorario");
    }
    if (tipodtc == "COMPROBANTE") {
      $("#scrolldtc h1 label").text("Comprobantes");
    }
    if (tipodtc == "BOLETA DE VENTA") {
      $("#scrolldtc h1 label").text("Boletas de venta");
    }
    if (tipodtc == "RETIRO") {
      $("#scrolldtc h1 label").text("Retiros");
    }
  }
};

var oc_checkout_text_full = function () {
  $('.sc-full').each(function (key, item) {
    if ($(this).val() == "" || parseFloat($(this).val()) == 0) {
      $(this).addClass('css-fn-yellow');
    } else {
      $(this).removeClass('css-fn-yellow');
    }
  });
};

var get_totales_gastos = function () {

  var idTipoGasto = $('input[name="oc[tipo_gastos][id]"]').val();
  $.ajax({
    'url': '/4DACTION/_v3_get_totales_gastos',
    data: {
      "oc[id]": compras.id,
      "update": "true",
      "oc[id_tipo_gasto]": idTipoGasto
    },
    dataType: 'json',
    async: false,
    success: function (data) {
      ivaOriginalSii = data.impuesto;
      var valorCambio = 1;
      if (compras.moneda.code != currency.code && compras.origen != "PROYECTO") {
        $('.container-symbol-new').text(compras.moneda.code);
        valorCambio = compras.moneda.cambio;
        if (valorCambio == 0) {
          valorCambio = 1;
        }
      } else {
        $('.section-moneda-valor-cambio').hide();
      }


      // Justificacion
      if (idTipoGasto == "FXR" || idTipoGasto == "FTG") {
        mainContainer.find('input[name="oc[total_justificado]"]').val($.number(data.justificado_total / valorCambio, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep));
        mainContainer.find('input[name="oc[total_por_justificar]"]').val($.number(data.saldo_a_justificar_total / valorCambio, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep));
        // mainContainer.find('[name="suma_justificados"]').text(data.justificado_total);
        compras.justificado = data.justificado_total / valorCambio;
        compras.porjustificar = data.saldo_a_justificar_total / valorCambio;
      } else {
        mainContainer.find('input[name="oc[total_justificado]"]').val($.number(data.justificado_neto / valorCambio, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep));
        mainContainer.find('input[name="oc[total_por_justificar]"]').val($.number(data.saldo_a_justificar_neto / valorCambio, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep));
        // mainContainer.find('[name="suma_justificados"]').text(data.justificado_neto);
        compras.justificado = data.justificado_neto / valorCambio;
        compras.porjustificar = data.saldo_a_justificar_neto / valorCambio;
      }

      mainContainer.find('input[name="oc[total_facturas_ventas]"]').val($.number(data.total_fact_ventas / valorCambio, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep));

      // Pagos
      mainContainer.find('input[name="oc[total_pagado]"]').val($.number(data.pagado / valorCambio, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep));
      mainContainer.find('input[name="oc[total_por_pagar]"]').val($.number(data.saldo_a_pagar / valorCambio, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep));
      mainContainer.find('input[name="oc[suma_pagos]"]').val($.number(data.pagado / valorCambio, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep));
      compras.pagado = data.pagado;
      compras.porpagar = data.saldo_a_pagar;

      // Ingresos
      mainContainer.find('input[name="oc[total_cobros]"]').val($.number(data.depositos / valorCambio, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep));
      mainContainer.find('input[name="oc[suma_cobros]"]').val($.number(data.depositos / valorCambio, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep));
      compras.totalcobros = data.depositos;

      // Totales
      mainContainer.find('input[name="oc[saldo_total_fxr]"]').val($.number(data.saldo_real / valorCambio, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep));
      compras.saldo = data.saldo_real / valorCambio;

      // estado
      compras.estado = data.estado;
      compras.container.data('estado', data.estado);
      compras.container.find('[data-name="estado"]').text(data.estado);




      mainContainer.find('input[name="oc[sub_total]"]').val($.number(data.sub_total / valorCambio, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep));
      mainContainer.find('input[name="oc[descuento]"]').val($.number(data.descuento / valorCambio, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep));
      mainContainer.find('input[name="oc[total_exento]"]').val($.number(data.total_exento / valorCambio, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep));
      mainContainer.find('input[name="oc[neto]"]').val($.number(data.neto / valorCambio, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep));
      mainContainer.find('input[name="oc[impuesto]"]').val($.number(data.impuesto / valorCambio, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep));
      // mainContainer.find('input[name="oc[impuesto_extra1]"]').val($.number(data.impuestoextra1/valorCambio, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep));
      // mainContainer.find('input[name="oc[impuesto_extra2]"]').val($.number(data.impuestoextra2/valorCambio, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep));

      mainContainer.find('input[name="oc[total_adicional]"]').val($.number(data.total_adicional / valorCambio, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep));
      mainContainer.find('input[name="oc[total]"]').val($.number(data.total / valorCambio, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep));
      compras.total_oc = data.total;

      mainContainer.find('input[name="oc[detraccion_monto]"]').val($.number(data.total_detraccion / valorCambio, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep));
      compras.total_detraccion = data.total_detraccion / valorCambio;
      compras.total_netos_oc = (data.total_exento + data.neto) / valorCambio;

      // ajuste
      compras.total_ajuste = data.total_ajuste / valorCambio;
      mainContainer.find('input[name="oc[total_ajuste_pre]"]').val($.number(data.total_ajuste / valorCambio, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep));
      mainContainer.find('input[name="oc[total_ajuste]"]').val(data.total_ajuste / valorCambio);
      mainContainer.find('input[name="oc[total_ajuste_impuesto]"]').val(data.total_ajuste_impuesto / valorCambio);

      mainContainer.find('input[name="oc[total_neto_nc]"]').val($.number(data.total_neto_nc / valorCambio, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep));
      mainContainer.find('input[name="oc[total_gasto_real]"]').val($.number(data.total_gasto_real / valorCambio, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep));
      mainContainer.find('input[name="oc[netos_dtc]"]').val($.number(data.justificado_neto / valorCambio, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep));

      if (Math.abs(data.total_ajuste_impuesto) > 0) {
        mainContainer.find('input[name="oc[impuesto]"]').css('color', 'blue');
      }

      // mostrar montos para explicar cálculos
      //$('.section-gasto-real').hide();

      if (idTipoGasto == "FXR" || idTipoGasto == "FTG") {
        $(".section-solicitado").show();
        if (compras.justificado == 0) {
          $(".section-pagado").hide();
        }
        if (data.pagado > 0) {
          $(".section-solicitado").hide();
          $(".section-pagado").show();
        }
        //$('.section-gasto-real').show();
      }

      if (data.total_neto_nc == 0) {
        $(".section-nc").hide();
      }

      // verifica visualización objetos
      oc_validate_fields();
      update_subtotal_items();

    }
  });
};

var resumen_totales = function () {
  var target = $('footer article ul');
  var total = target.find('input[name="oc[total]"]').val();
  var total = total.replace(".", ",");
  $('span[data-name="resumen-total"]').text(total).number(true, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep);
};

// Almacena el valor real del iva
let  ivaOriginalSii = 0;
let isNetoManipulated = false;
$(document).on('input change keyup', 'input[name^="oc[detalle_item]"]', function () {
            isNetoManipulated = true;
        });

//Calcula totales finales (Esta funcion tiene que ir antes de la funcion desde donse se llama)
var update_subtotal_items = function () {

  var containerItems = $('table.items tbody');
  var sumaSubTotales = 0;
  var sumaTotales = 0;
  var sumaExentos = 0;
  var sumaAfectos = 0;
  var sumaAdicional = 0;
  var sumaDescuentos = 0;
  var sumaRetencion = 0;
  var sumaTotales = 0;
  var impuestoIva = 0;
  var impuestoRet = 0;
  var sumaDefault = 0;
  var sumaExtrasRet = 0;
  var sumaExtrasIva = 0;
  var tipoImp = "";
  var sumaExtrasMatriz = [];
  let idsImpMul = [];

  containerItems.find('tr[data-tipo="ITEM"]').each(function () {

    sumaSubTotales += parseFloat($(this).find('input[name="oc[detalle_item][subtotal]"]').val());
    sumaDescuentos += parseFloat($(this).find('input[name="oc[detalle_item][dscto]"]').val());
    var total = parseFloat($(this).find('input[name="oc[detalle_item][total]"]').val());
    sumaTotales += total;
    tipoImp = $(this).find('input[name="oc[detalle_item][imp][id]"]').data('tipoimp');
    var valorImpueto = parseFloat($(this).find('input[name="oc[detalle_item][imp][id]"]').data('valorimp'));

    switch (tipoImp) {

      case "IVA":
        // valorImpueto = 18;
        
        sumaAfectos += total;
        if (isNetoManipulated || ivaOriginalSii < 1){
          impuestoIva += (total * valorImpueto / 100);
        } else{
          impuestoIva = ivaOriginalSii;
        }
        impuestoIva = impuestoIva + compras.total_ajuste_impuesto; // Trabajar aca
        break;

      case "EXENTO":
        sumaExentos += total;
        break;

      case "RETENCION":
        // valorImpueto = 8;
        sumaRetencion += total;
        impuestoRet += (total * valorImpueto / 100);
        impuestoRet = impuestoRet + compras.total_ajuste_impuesto;
        break;

      case "ADICIONAL":
        sumaAdicional += total;
        break;

      case "IVA MULTIPLE":
        sumaAfectos += total;
        impuestoIva += (total * valorImpueto / 100);
        impuestoIva = impuestoIva + compras.total_ajuste_impuesto;

        //let multiple = $('li.extra');

        // multiple.each(function(key,item) {
        //   
        //   let tipoExtraImp = $(this).data('imptipo');
        //   let porcVal=0;
        //   idsImpMul[key]=$(this).data('impid');

        //     let checkedImp = $(this).find('input.check').attr('checked');
        //     if (typeof checkedImp === 'undefined') {
        //       checkedImp="none"
        //     }

        //     if (checkedImp=="checked") {

        //         let impval = String($(this).data('impvalue'));
        //         impval =  impval.replace(",",'.');

        //         impval= parseFloat(impval)/100;
        //         sumaExtra=(total * impval);


        //     }else{


        //         porcVal= parseFloat(unaBase.utilities.transformNumber($(this).find('input.porc').val()))/100;
        //         sumaExtra=(total * porcVal);


        //     }



        //         if (sumaExtrasMatriz[key]==null) {
        //           sumaExtrasMatriz[key]=0;
        //         }

        //         sumaExtrasMatriz[key]+=sumaExtra

        //         if (tipoExtraImp=="RETENCION") {
        //          sumaExtrasRet += sumaExtra;

        //         }
        //         if (tipoExtraImp=="IVA") {
        //          sumaExtrasIva += sumaExtra; 
        //         }



        // });


        break;

      default:
        sumaDefault += total;

    }


    if (tipoImp != "EXENTO") {

      //PARA MULTIPLES EN CUALQUIER TIPO DE IMPUESTO
      let multiple = $('li.extra');

      multiple.each(function (key, item) {

        let tipoExtraImp = $(this).data('imptipo');
        let porcVal = 0;
        idsImpMul[key] = $(this).data('impid');

        let checkedImp = $(this).find('input.check').attr('checked');
        if (typeof checkedImp === 'undefined') {
          checkedImp = "none"
        }

        if (checkedImp == "checked") {

          let impval = String($(this).data('impvalue'));
          impval = impval.replace(",", '.');

          impval = parseFloat(impval) / 100;
          sumaExtra = (total * impval);


        } else {


          porcVal = unaBase.utilities.transformNumber($(this).find('input.porc').val()) / 100;
          sumaExtra = (total * porcVal);


        }



        if (sumaExtrasMatriz[key] == null) {
          sumaExtrasMatriz[key] = 0;
        }

        sumaExtrasMatriz[key] += sumaExtra

        if (tipoExtraImp == "RETENCION") {
          sumaExtrasRet += sumaExtra;

        }
        if (tipoExtraImp == "IVA") {
          sumaExtrasIva += sumaExtra;
        }



      });
    }

  });


  sumaExtrasMatriz.forEach(function (key, item) {


    $('input[name="oc[impuesto_extra' + idsImpMul[item] + ']"]').val($.number(sumaExtrasMatriz[item], compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep));


  });

  // if (tipoImp=="IVA MULTIPLE") {
  //    let multiples = $('li.extra');
  //     multiples.each(function(key,item) {

  //     $(this).removeAttr('style');

  //   });
  // }else{
  //  let multiples = $('li.extra');
  //     multiples.each(function(key,item) {

  //     $(this).attr('style','display:none');

  //   });

  // }


  var totalNeto = (sumaAfectos + sumaRetencion);
  var tipoDoc = $('input[name="tipo_doc[id]"]').val();
  

  $('input[name="oc[sub_total]"]').val($.number(sumaSubTotales, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep));
  $('input[name="oc[descuento]"]').val($.number(sumaDescuentos, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep));
  $('input[name="oc[total_exento]"]').val($.number(sumaExentos, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep));
  $('input[name="oc[neto]"]').val($.number(totalNeto, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep));

  // -- ini-- calulo total adicional-servicio, gin, caso shark
  compras.total_netos_oc = totalNeto;

  let porcentaje = 0;
  if ($('input[name="oc[porcentaje_servicio]"]').length > 0) {
    let porcentaje = parseFloat($('input[name="oc[porcentaje_servicio]"]').val());
  }

  let caluloMonto = (porcentaje / 100) * compras.total_netos_oc;
  $('input[name="oc[total_adicional]"]').val($.number(caluloMonto, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep));
  compras.adicional_servicio = caluloMonto;
  sumaAdicional = sumaAdicional + compras.adicional_servicio;
  // -- fin-- calulo total adicional-servicio, gin, caso shark


  $('input[name="oc[total_adicional]"]').val($.number(sumaAdicional, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep));

  if (impuestoIva > 0 && sumaExtrasIva > 0)
    var impuestooc = unaBase.utilities.general.format.formatAntiSII(impuestoIva + impuestoRet);
  else
    var impuestooc = impuestoRet + impuestoIva;

  $('input[name="oc[impuesto]"]').val($.number(impuestooc, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep));


  if (impuestoIva > 0 && sumaExtrasIva > 0)
    var totaloc = (sumaAfectos + unaBase.utilities.general.format.formatAntiSII(impuestoIva + (sumaRetencion - impuestoRet)) + sumaExentos + sumaAdicional + sumaDefault - sumaExtrasRet + sumaExtrasIva);
  else
    var totaloc = (sumaAfectos + impuestoIva + (sumaRetencion - impuestoRet) + sumaExentos + sumaAdicional + sumaDefault - sumaExtrasRet + sumaExtrasIva);


  // Para facturas a terceros
  if(tipoDoc &&  tipoDoc == 46){
    var totaloc = (sumaAfectos + (sumaRetencion - impuestoRet) + sumaExentos + sumaAdicional + sumaDefault - sumaExtrasRet + sumaExtrasIva);
  }
  
  totaloc = totaloc + compras.total_ajuste;

  $('input[name="oc[total]"]').val($.number(totaloc, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep));

  var nameTipoDoc = $('input[name="tipo_doc[descripcion]"]').val();
  if (tipoDoc == 65 || tipoDoc == 66 || tipoDoc == "118" || tipoDoc == "119") {
    if (tipoDoc == "118") {
      $('span[name="label-neto-hono"]').text('Impuesto');
      $('span[name="label-iva-ret"]').text(retName + " (" + retRate + "%)");
    } else {
      if (tipoDoc == "119") {
        $('span[name="label-neto-hono"]').text('Impuesto');
        $('span[name="label-iva-ret"]').text(retName + " (0%)");
      } else {
        $('span[name="label-neto-hono"]').text('Honorario');
        $('span[name="label-iva-ret"]').text(retName);
      }
    }
  } else {
    $('span[name="label-neto-hono"]').text('Neto');
    // $('span[name="label-iva-ret"]').text(ivaName+" ("+ ivaRate +"%)");
    $('span[name="label-iva-ret"]').text(ivaName);
  }

  resumen_totales();

};


var update_impuesto_multiple = async function (obj) {

  let idoc = compras.id;
  let auto = obj.attributes.auto.value;
  let autocalculado = true;
  let porc = 0;
  let estado = true;
  let idimp = obj.attributes.impid.value;
  let nameWeb = $('li.extra').find('input[impid="' + idimp + '"].porc')[0].attributes.name.value;
  let valor = $('li.extra').find('input[impid="' + idimp + '"].porc');

  if (auto == "1") {
    estado = obj.checked;

    if (!estado) {
      autocalculado = false;

    } else {
      porc = obj.attributes.impvalue.value;
    }


  } else {
    estado = false;
    autocalculado = false;
    let target = obj.parentElement.previousElementSibling;
    target.checked = false;
    if (obj.attributes.tipo.value == 'porc') {
      porc = obj.value;

    } else {
      if (obj.attributes.tipo.value == 'total') {
        let total = $('input[name="oc[neto]"]').val();

        let rem = "";
        if (currency.decimals_sep == ".") {
          rem = ",";
        } else {
          rem = ".";
        }

        let y = await total.replaceAll(rem, '').replaceAll(",", '.');


        porc = parseFloat(obj.value.replaceAll(rem, '').replaceAll(",", '.')) * 100 / parseFloat(y);





      }

    }
  }


  $('li.extra').find('input[impid="' + idimp + '"].porc').val($.number(porc, 6, currency.decimals_sep, currency.thousands_sep));

  valor[0].value = $.number(porc, 6, currency.decimals_sep, currency.thousands_sep);

  await axios('/4DACTION/_V3_set_impuestoMultipleCompra?idoc=' + idoc + '&idimp=' + idimp + '&estado=' + estado + '&porc=' + porc + '&valor=' + valor + '&nameWeb=' + nameWeb + '&autocalculado=' + autocalculado);



  update_subtotal_items();

};



var update_impuestos_multiples_view = async function (idDoc) {


  let idoc = compras.id;
  let multiples = "";

  await axios('/4DACTION/_V3_get_impuestoMultiple?idoc=' + idoc + '&iddoc=' + idDoc)
    .then((res) => {

      let extras = $('li.extra');
      let check = "";

      if (extras.length > 0) {
        extras.remove();
      }

      $.each(res.data.rows, function (key, item) {


        if (item.estado) {
          check = "checked";
        } else {
          check = "";
        }

        multiples +=
          '<li class="extra" id="' + item.id_name + '"' + ' data-impvalue="' + item.value + '" data-impname="' + item.name + '" data-impid="' + item.id + '" data-imptipo="' + item.tipo + '">' +
          '<span>' + item.name + '</span>' +
          '<input onclick="update_impuesto_multiple(this)" impid="' + item.id + '" class="check" impvalue="' + item.value + '" name="oc[check_auto_impuesto_' + item.id_name + ']" type="checkbox" ' + check + '  auto="1"  >' +
          '<span class="numeric percent"><input   tipo="porc" class=" multiple ' + item.auto + ' porc "' +
          'type="text" onchange="update_impuesto_multiple(this)" impid="' + item.id + '" ' +
          'name="oc[check_impuesto_' + item.id_name + ']" ' +
          'auto="' + item.auto + '" value="' + item.porc + '"> %</span>' +
          '<span class="numeric currency"><label class="container-symbol-new">$</label><input  tipo="total" class=" multiple ' + item.auto + '"' +
          ' type="text" name="oc[impuesto_' + item.id_name + ']"  value="' + item.valor_total + '"  onchange="update_impuesto_multiple(this)" auto=" ' + item.auto + '" impid="' + item.id + '"></span>' +
          '</li>';
      });

      multiples = $.parseHTML(multiples);

      $('#ivali').after(multiples);
    })
    .then((res) => {
      update_subtotal_items();

    })
    .catch((err) => {

    });





}


// access._486  / gastar mas de lo presupuestado
var valida_excede_gastop = function (item, total, llave_oc) {
  var valida = { 'success': true, 'diferencia': 0 };

  if (compras.folio == "") {
    var origen = item.find('input[name="oc[detalle_item][origen]"]').val();
    var des_lugar = item.find('input[name="oc[detalle_item][origen][lugar][des]"]').val();

    if (compras.origen == "PROYECTO" && des_lugar == "ITEM DIRECTO") {
      //if ((origen == "PROYECTO" || origen == "PRESUPUESTO") && des_lugar == "ITEM DIRECTO") {
      // if (!access._486) {
      var llave = item.find('input[name="oc[detalle_item][llave_nv]"]').val();
      var idnv = item.find('input[name="oc[detalle_item][idnv]"]').val();
      $.ajax({
        'url': '/4DACTION/_v3_valida_excede_gastop',
        data: {
          "item[llave_nv]": llave,
          "item[id_nv]": idnv,
          "item[id_oc]": compras.id,
          "item[llave_oc]": llave_oc
        },
        async: false,
        dataType: 'json',
        success: function (data) {


          // -- ini --- agregado para considerar como exceso el adicional del servicio, cliente shark, 13-06-19, gin
          total = total + compras.adicional_servicio;
          // -- fin ---

          var diferencia = data.diferencia - total;
          if (diferencia < 0) {
            valida = { 'success': false, 'diferencia': diferencia };
          } else {
            valida = { 'success': true, 'diferencia': diferencia };
          }
        }
      });
      // }
    }
  }

  return valida;

};

// !access._596  / gno gastar mayor a la venta del ítem
var valida_excede_venta = function (item, total) {
  var valida = { 'success': true, 'diferencia': 0 };

  if (compras.folio == "") {

    var origen = item.find('input[name="oc[detalle_item][origen]"]').val();
    var des_lugar = item.find('input[name="oc[detalle_item][origen][lugar][des]"]').val();

    if (compras.origen == "PROYECTO" && des_lugar == "ITEM DIRECTO") {
      //if ((origen == "PROYECTO" || origen == "PRESUPUESTO") && des_lugar == "ITEM DIRECTO") {
      // if (!access._486) {
      var llave = item.find('input[name="oc[detalle_item][llave_nv]"]').val();
      var idnv = item.find('input[name="oc[detalle_item][idnv]"]').val();
      $.ajax({
        'url': '/4DACTION/_v3_valida_excede_venta',
        data: {
          "item[llave_nv]": llave,
          "item[id_nv]": idnv
        },
        async: false,
        dataType: 'json',
        success: function (data) {
          //var diferencia = data.venta - total;
          var diferencia = data.diferencia - total;
          if (diferencia < 0) {
            valida = { 'success': false, 'diferencia': diferencia };
          } else {
            valida = { 'success': true, 'diferencia': diferencia };
          }
        }
      });
      // }
    }

  }

  return valida;
};

var calcula_por_filas = function (target, is_refresh) {


  //var is_gasto_real = (considerarSoloGastosValidados && compras.validado) || (!considerarSoloGastosValidados && compras.folio != "");
  var is_gasto_real = is_refresh && ((considerarSoloGastosValidados && compras.validado) || (!considerarSoloGastosValidados && compras.folio != ""));

  var llave_oc = target.find('input[name="oc[detalle_item][llave]"]').val();
  var montoInicial = target.data("montoinicial");

  var cantidad = parseFloat(target.find('input[name="oc[detalle_item][cantidad]"]').val());
  var dias = parseFloat(target.find('input[name="oc[detalle_item][dias]"]').val());

  //-- ini-- modificado el 09-11-17 por gin -- para mostrar correctamente los valores con decimales
  // var precio = parseFloat(target.find('input[name="oc[detalle_item][precio]"]').val());
  var precio = parseFloat(target.find('input[name="oc[detalle_item][precio]"]').data('oldprice'));
  //-- fin-- modificado el 09-11-17 por gin -- para mostrar correctamente los valores con decimales


  var dscto = parseFloat(target.find('input[name="oc[detalle_item][dscto]"]').val());


  if (cantidad == 0 && dias > 0) {
    cantidad = 1;
  } else if (dias == 0 && cantidad != 0) {
    dias = 1;
  }

  // if (dias == 0){dias = 1}
  //var subtotal = roundTwo(cantidad * dias * precio);

  var subtotal = cantidad * dias * precio;
  //var total = roundTwo(subtotal - dscto);
  var total = subtotal - dscto;

  if (is_gasto_real) {
    var valida_gastop = valida_excede_gastop(target, 0, llave_oc);
    var valida_venta = valida_excede_venta(target, 0);
  } else {
    var valida_gastop = valida_excede_gastop(target, total, llave_oc);
    var valida_venta = valida_excede_venta(target, total);
  }

  target.find('input[name="oc[detalle_item][subtotal]"]').val(subtotal);
  target.find('input[name="oc[detalle_item][total]"]').val(total);
  target.find('input[name="oc[detalle_item][total]"]').off().removeClass('warning').data('diferencia', 0).data('diferencia-venta', 0).data('diferencia-gastop', 0);

  valida_gastop.diferencia = valida_gastop.diferencia * -1;
  valida_venta.diferencia = valida_venta.diferencia * -1;

  var FLAG_EXCEDER_GASTOP = Boolean(access._486);
  var FLAG_EXCEDER_VENTA = Boolean(!access._596);

  if (total != 0 && (!valida_gastop.success || !valida_venta.success)) {

    if (!FLAG_EXCEDER_GASTOP && valida_gastop.diferencia > 0) {
      // montoInicial = total - valida_gastop.diferencia;
    }

    if (!FLAG_EXCEDER_VENTA && valida_venta.diferencia > 0) {
      // montoInicial = total - valida_venta.diferencia;
    }

    if (!is_refresh && (!FLAG_EXCEDER_GASTOP || !FLAG_EXCEDER_VENTA)) {
      if (!FLAG_EXCEDER_GASTOP && !FLAG_EXCEDER_VENTA) {
        if (valida_gastop.diferencia > 0 && valida_venta.diferencia > 0) {
          alert("El monto ingresado (" + currency.symbol + $.number(total, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep) + ") excede el gasto presupuestado del ítem en " + currency.symbol + $.number(valida_gastop.diferencia, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep) + " y excede el precio de venta del ítem en " + currency.symbol + $.number(valida_venta.diferencia, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep) + "<br><br>" + "Ingrese un monto igual o menor a " + currency.symbol + $.number(montoInicial, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep) + ". O bien puede solicitar autorización para exceder gasto.");
        } else {
          if (valida_gastop.diferencia > 0) {
            alert("El monto ingresado (" + currency.symbol + $.number(total, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep) + ") excede el gasto presupuestado del ítem en " + currency.symbol + $.number(valida_gastop.diferencia, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep) + "<br><br>" + "Ingrese un monto igual o menor a " + currency.symbol + $.number(montoInicial, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep) + ". O bien puede solicitar autorización para exceder gasto.");
          }
          if (valida_venta.diferencia > 0) {
            alert("El monto ingresado (" + currency.symbol + $.number(total, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep) + ") excede el precio de venta del ítem en " + currency.symbol + $.number(valida_venta.diferencia, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep) + "<br><br>" + "Ingrese un monto igual o menor a " + currency.symbol + $.number(montoInicial, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep) + ". O bien puede solicitar autorización para exceder gasto.");
          }
        }
      }

      if (!FLAG_EXCEDER_GASTOP && FLAG_EXCEDER_VENTA && valida_gastop.diferencia > 0) {
        alert("El monto ingresado (" + currency.symbol + $.number(total, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep) + ") excede el gasto presupuestado del ítem en " + currency.symbol + $.number(valida_gastop.diferencia, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep) + "<br><br>" + "Ingrese un monto igual o menor a " + currency.symbol + $.number(montoInicial, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep) + ". O bien puede solicitar autorización para exceder gasto.");
      }

      if (!FLAG_EXCEDER_VENTA && FLAG_EXCEDER_GASTOP && valida_venta.diferencia > 0) {
        alert("El monto ingresado (" + currency.symbol + $.number(total, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep) + ") excede el precio de venta del ítem en " + currency.symbol + $.number(valida_venta.diferencia, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep) + "<br><br>" + "Ingrese un monto igual o menor a " + currency.symbol + $.number(montoInicial, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep) + ". O bien puede solicitar autorización para exceder gasto.");
      }

    }

    if (FLAG_EXCEDER_GASTOP && !FLAG_EXCEDER_VENTA) {
      if (valida_gastop.diferencia > 0) {
        target.find('input[name="oc[detalle_item][total]"]').addClass('warning').data('diferencia', valida_gastop.diferencia).data('diferencia-gastop', valida_gastop.diferencia).bind('mouseover', function () {
          $(this).qtip({
            content: 'Ítem excede gasto presupuestado en ' + currency.symbol + $.number(valida_gastop.diferencia, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep)
          }).qtip('show');
        });
      }
    }

    if (FLAG_EXCEDER_VENTA && !FLAG_EXCEDER_GASTOP) {
      if (valida_venta.diferencia > 0) {
        target.find('input[name="oc[detalle_item][total]"]').addClass('warning').data('diferencia', valida_gastop.diferencia).data('diferencia-venta', valida_venta.diferencia).bind('mouseover', function () {
          $(this).qtip({
            content: 'Ítem excede precio de venta en ' + currency.symbol + $.number(valida_venta.diferencia, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep)
          }).qtip('show');
        });
      }
    }

    if (!is_refresh && (!FLAG_EXCEDER_GASTOP || !FLAG_EXCEDER_VENTA)) {
      if ((!FLAG_EXCEDER_GASTOP && valida_gastop.diferencia > 0) || (!FLAG_EXCEDER_VENTA && valida_venta.diferencia > 0)) {
        target.find('input[name="oc[detalle_item][cantidad]"]').val(1);
        target.find('input[name="oc[detalle_item][dias]"]').val(1);
        target.find('input[name="oc[detalle_item][precio]"]').val(montoInicial);
        target.find('input[name="oc[detalle_item][subtotal]"]').val(montoInicial);
        target.find('input[name="oc[detalle_item][dscto]"]').val(0);
        target.find('input[name="oc[detalle_item][total]"]').val(montoInicial);

        // target.find('input[name="oc[detalle_item][cantidad]"]').trigger('focus').trigger('blur');
      }
    }

    if (FLAG_EXCEDER_GASTOP && FLAG_EXCEDER_VENTA) {
      if (valida_gastop.diferencia > 0 && valida_venta.diferencia > 0) {
        target.find('input[name="oc[detalle_item][total]"]').addClass('warning').data('diferencia', valida_gastop.diferencia).data('diferencia-gastop', valida_gastop.diferencia).data('diferencia-venta', valida_venta.diferencia).bind('mouseover', function () {
          $(this).qtip({
            content: 'Ítem excede precio de venta en ' + currency.symbol + $.number(valida_venta.diferencia, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep) + ' y gasto presupuestado en ' + currency.symbol + $.number(valida_gastop.diferencia, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep)
          }).qtip('show');
        });
      } else {
        if (valida_gastop.diferencia > 0) {
          target.find('input[name="oc[detalle_item][total]"]').addClass('warning').data('diferencia', valida_gastop.diferencia).data('diferencia-gastop', valida_gastop.diferencia).bind('mouseover', function () {
            $(this).qtip({
              content: 'Ítem excede gasto presupuestado en ' + currency.symbol + $.number(valida_gastop.diferencia, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep)
            }).qtip('show');
          });
        }
        if (valida_venta.diferencia > 0) {
          target.find('input[name="oc[detalle_item][total]"]').addClass('warning').data('diferencia', valida_gastop.diferencia).data('diferencia-venta', valida_venta.diferencia).bind('mouseover', function () {
            $(this).qtip({
              content: 'Ítem excede precio de venta en ' + currency.symbol + $.number(valida_venta.diferencia, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep)
            }).qtip('show');
          });
        }
      }
    }



  }
  if (!is_refresh)
    update_subtotal_items();
};

var calcula_por_porcentaje = function () {
  $('.dscto').on("blur change", function () {
    var sub_total = parseFloat($('input[name="oc[sub_total]"]').val());
    var name = $(this).attr("name");
    var valor = parseFloat($(this).val());
    if (valor >= 0 && valor <= 100) {
      if (name == "oc[porcentaje_descuento]") {
        if (valor > 0) {
          var descuento = (sub_total * valor) / 100;
          $('input[name="oc[descuento]"]').val(descuento);
        } else {
          $('input[name="oc[descuento]"]').val(0);
        }
      } else {
        if (valor > 0) {
          var porcentaje_descuento = (valor * 100) / sub_total;
          $('input[name="oc[porcentaje_descuento]"]').val(porcentaje_descuento);
        } else {
          $('input[name="oc[porcentaje_descuento]"]').val(0);
        }
      }
    } else {
      $('input[name="oc[descuento]"]').val(0);
      $('input[name="oc[porcentaje_descuento]"]').val(0);
    }
    update_subtotal_items();
  });
};

var set_referencia_oc = function () {
  var target = mainContainer.find('table.items > tbody');
  var referencia = $('input[name="oc[referencia]"]').val();
  var cantPro = target.find('tr[data-origen="PROYECTO"]').length + target.find('tr[data-origen="PRESUPUESTO"]').length;
  var cantGen = target.find('tr[data-origen="GASTO GENERAL"]').length;
  var cantOrigenGeneral = target.find('tr[data-tipo="ITEM"][data-deslugarorigen="GASTO GENERAL"]').length;
  var cantItemsDirecto = target.find('tr[data-tipo="ITEM"][data-deslugarorigen="ITEM DIRECTO"]').length;
  var cantOtrosGastos = target.find('tr[data-tipo="ITEM"][data-deslugarorigen="OTROS GASTOS"]').length;
  if ($.trim(referencia) == '') {
    if (cantPro > 0 && cantGen > 0) {
      $('input[name="oc[referencia]"]').val("GG - NEGOCIO / VARIOS ÍTEM");
    } else {
      if (cantPro == 0 && cantGen > 0) {
        if (cantOrigenGeneral == 1) {
          var servicio = target.find('tr[data-tipo="ITEM"][data-deslugarorigen="GASTO GENERAL"]').data('nombre');
          if (servicio != "") {
            var texto = 'GG / ' + servicio;
            $('input[name="oc[referencia]"]').val(texto);
          }
        } else {
          if (cantOrigenGeneral > 1) {
            var texto = 'GG / VARIOS ÍTEM';
            $('input[name="oc[referencia]"]').val(texto);
          }
        }
      } else {
        if (cantGen == 0 && cantPro > 0) {
          if (cantItemsDirecto == 1 && cantOtrosGastos == 0) {
            var targetItems = $('#sheet-compras table.items > tbody > tr[data-tipo="ITEM"][data-deslugarorigen="ITEM DIRECTO"]');
            var item = targetItems.data('nombre');
            var ref = targetItems.data('refnv');
            var nro = targetItems.data('nronv');
            var descripcion = nro + " - " + ref + " / " + item;
            if (compras.origen == "PROYECTO") {
              var texto = 'NEGOCIO / ' + descripcion;
            } else {
              var texto = 'PRESUP. DE GASTO / ' + descripcion;
            }
            $('input[name="oc[referencia]"]').val(texto);
          }
          if (cantItemsDirecto > 1 && cantOtrosGastos == 0) {
            var targetItems = $('#sheet-compras table.items > tbody > tr[data-tipo="ITEM"][data-deslugarorigen="ITEM DIRECTO"]');
            var counter = 0;
            var previousName = "";
            var currentName = "";
            var currentNro = "";
            targetItems.each(function (key, item) {
              currentName = $(this).data('refnv');
              currentNro = $(this).data('nronv');
              if (previousName != currentName) {
                previousName = currentName;
                counter++;
              }
            });
            if (counter > 1) {
              var texto = 'VARIOS NEGOCIOS';
              $('input[name="oc[referencia]"]').val(texto);
            } else {
              var descripcion = currentNro + " - " + currentName;

              if (compras.origen == "PROYECTO") {
                var texto = 'NEGOCIO / ' + descripcion + ' / VARIOS ÍTEM';
              } else {
                var texto = 'PRESUP. DE GASTO / ' + descripcion;
              }
              $('input[name="oc[referencia]"]').val(texto);

            }

          }
          if (cantItemsDirecto == 0 && cantOtrosGastos > 0) {

            if (compras.origen == "PROYECTO") {
              var texto = 'NEGOCIO / OTROS GASTOS';
            } else {
              var texto = 'PRESUP. DE GASTO / OTROS GASTOS';
            }

            $('input[name="oc[referencia]"]').val(texto);

          }
          if (cantItemsDirecto > 0 && cantOtrosGastos > 0) {

            if (compras.origen == "PROYECTO") {
              var texto = 'NEGOCIO / VARIOS ÍTEM';
            } else {
              var texto = 'PRESUP. DE GASTO / VARIOS ÍTEM';
            }

            $('input[name="oc[referencia]"]').val(texto);

          }
        }
      }
    }
  }
}

var add_items_oc = function (data) {
  var container = $('#sheet-compras table.items > tbody');
  var numberOfTitles = container.find('tr[data-tipo="TITULO"]').length;
  compras.presupuesto_gasto = data.presupuesto_gasto
  $.each(data.rows, function (key, item) {
    if (item.tipo == "TITULO") {
      if (numberOfTitles == 0) {
        get_element_oc.titulo('prependTo', container, item); // inserta al principio
      } else {
        var lastRow = container.find('tr').last();
        get_element_oc.titulo('insertAfter', lastRow, item); // inserta al final de todas las filas
      }
    } else {
      if (item.llave_titulo == "") {
        var element = get_element_oc.item('prependTo', container, item);
        calcula_por_filas(element);
      } else {
        var containerItem = container.find('tr[data-llavetitulo="' + item.llave_titulo + '"]').last();  // inserta despues del ultimo item del titulo
        if (containerItem.length == 0) {
          var containerItem = container.find('tr[data-llave="' + item.llave_titulo + '"]'); // inserta despues del titulo
        }
        var element = get_element_oc.item('insertAfter', containerItem, item);
        calcula_por_filas(element);
      }
    }

    if (compras.tipoGasto == "FXR" || compras.tipoGasto == "FTG") {
      $('.objoc').hide();
      $('.objfxr').show();

    } else {
      $('.objfxr').hide();
      $('.objoc').show();
    }

  });

  // calcula_por_filas();
  calcula_por_porcentaje();
  // update_subtotal_items();
  verifica_negocio_asociado();
  tablecompras();
  return false;
}

var get_items = function (id) {

  $.ajax({
    'url': '/4DACTION/_V3_get_items_compras',
    data: {
      "id_oc": id
    },
    dataType: 'json',
    async: false,
    success: function (data) {
      var container = mainContainer.find('table.items > tbody');
      // var containerTitulo;
      container.find("*").remove();
      $.each(data.rows, function (key, item) {
        var numberOfTitles = container.find('tr[data-tipo="TITULO"]').length;
        if (item.tipo == "TITULO") {
          if (numberOfTitles == 0) {
            get_element_oc.titulo('prependTo', container, item); // inserta al principio
          } else {
            var lastRow = container.find('tr').last();
            get_element_oc.titulo('insertAfter', lastRow, item); // inserta al final de todas las filas
          }
          // containerTitulo = get_element_oc.titulo('prependTo', container, item);
        } else {
          if (item.llave_titulo == "") {
            var element = get_element_oc.item('prependTo', container, item);
            calcula_por_filas(element, true);
          } else {
            var containerItem = container.find('tr[data-llavetitulo="' + item.llave_titulo + '"]').last();  // inserta despues del ultimo item del titulo
            if (containerItem.length == 0) {
              var containerItem = container.find('tr[data-llave="' + item.llave_titulo + '"]'); // inserta despues del titulo
            }

            var element = get_element_oc.item('insertAfter', containerItem, item);
            calcula_por_filas(element, true);

            if (item.tipo == "ITEM" && (compras.origen == "PROYECTO" || compras.origen == "PRESUPUESTO")) { // verifica excede gasto y 90% sólo si es ítem y pertecece a proyecto
              // if (item.tipo=="ITEM" && (item.origen == "PROYECTO" || item.origen == "PRESUPUESTO")) { // verifica excede gasto y 90% sólo si es ítem y pertecece a proyecto

              // indicador de excede gasto p

              // if (compras.folio == "") {

              //  alert("verifica exceso get item");

              // $.ajax({
              //   'url': '/4DACTION/_v3_valida_excede_gastop',
              //   data: {
              //     "item[llave_nv]": item.llave_nv,
              //     "item[id_nv]": item.id_nv,
              //     "item[id_oc]": item.id_oc
              //   },
              //   async: false,
              //   cache: false,
              //   dataType: 'json',
              //   success: function (data) {
              //     console.log('valida excede gasto ////////////////////////////////////');
              //     //is_gasto_real = (data.considerarSoloGastosValidados && data.validado) || !data.validado;

              //     // Verifica gastado 90% de lo presupuestado contra lo gastado hasta ahora

              //     let noventaPres = (90 * data.gastoPres) / 100;
              //     let used = unaBase.percentage(data.gastoPres, data.gastoReal);

              //     element.find('[name="oc[detalle_item][total]"]')[0].dataset.percentage = used;
              //     element.find('[name="oc[detalle_item][total]"]')[0].classList.add('percentage');
              //     // if (data.gastoReal < data.gastoPres && data.gastoReal>=noventaPres){
              //     if (data.gastoReal >= noventaPres) {

              //       element.find('[name="oc[detalle_item][total]"]').addClass('noventagp');
              //     }

              //     // Excede gasto
              //     if (data.diferencia < 0) {
              //       element.find('[name="oc[detalle_item][total]"]').addClass('warning').data('diferencia', data.diferencia).bind('mouseover', function () {
              //         //alert('Ítem excede gasto presupuestado en $' + (data.diferencia - parseInt(element.find('[name="oc[detalle_item][total]"]').val())));
              //         $(this).qtip({
              //           //content: 'Ítem excede gasto presupuestado en $' + $.number(-(data.diferencia + parseInt(element.find('[name="oc[detalle_item][total]"]').val())), 0, currency.decimals_sep, currency.thousands_sep)
              //           content: 'Ítem excede gasto presupuestado en ' + currency.symbol + $.number(-data.diferencia, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep)
              //         }).qtip('show');
              //       });
              //     }

              //   }
              // });

              // }

              calcula_por_filas(element, true);
            }

          }

        }

      });

      calcula_por_porcentaje();
      // update_subtotal_items();
      verifica_negocio_asociado();

    }
  });
};

var get_oc_dtc = function (id) {
  var tipo_gasto = $('input[name="oc[tipo_gastos][id]"]').val();
  $.ajax({
    'url': '/4DACTION/_V3_get_oc_dtc',
    data: {
      "oc[id]": id
    },
    dataType: 'json',
    success: function (data) {
      var container = $('#sheet-compras table.dtcs > tbody');
      var htmlObject;
      container.find("*").remove();

      if (data.rows.length > 0) {
        var sumaNetos = 0;
        var sumaExentos = 0;
        var sumaImpuestos = 0;
        var sumaTotales = 0;
        var sumaAdicional = 0;

        $.each(data.rows, function (key, item) {

          var fxr = "";
          if (item.en_rendicion) {
            fxr = "Asociado al FXR Nro. " + item.nro_fxr;
          }

          /*htmlObject = $('<tr class="bg-white" data-iddtc="' + item.id + '">' +
            '<td class="center">' + item.numero + '</td>' +
            '<td class="center">' + item.emision + '</td>' +
            '<td class="center">' + item.documento + '</td>' +
            '<td class="center">' + item.proveedor + '</td>' +
            '<td class="center">' + item.referencia + '</td>' +
            '<td class="center">' + item.estado + '</td>' +
            '<td class="right">' + currency.symbol + ' <span class="numeric currency">' + item.neto + '</span></td>' +
            '<td class="right">' + currency.symbol + ' <span class="numeric currency">' + item.exento + '</span></td>' +
            '<td class="right">' + currency.symbol + ' <span class="numeric currency">' + item.impuesto + '</span></td>' +
            '<td class="right">' + currency.symbol + ' <span class="numeric currency">' + item.adicional + '</span></td>' +
            '<td class="right">' + currency.symbol + ' <span class="numeric currency" style="margin-right:5px">' + item.total + '</span></td>' +
            '<td class="center"><div><input type="checkbox" ' + ((item.cant_nc)? 'checked' : '') + '  readonly></div></td>' +
            '<td class="center"><div><input title="'+ fxr +'" type="checkbox" ' + ((item.en_rendicion)? 'checked' : '') + ' readonly></div></td>' +
          '</tr>');*/

          var symbolDOC = currency.symbol;
          var tneto = item.neto;
          var texento = item.exento;
          var timpuesto = item.impuesto;
          var tadicional = item.adicional;
          var ttotal = item.total;


          if (unaBase.defaulCurrencyCode != item.currency)
            symbolDOC = item.currency;
          // if (compras.moneda.code != currency.code && compras.moneda.code != "") {
          //   symbolDOC = compras.moneda.code;
          //   tneto = item.neto / compras.moneda.cambio;
          //   texento = item.exento / compras.moneda.cambio;
          //   timpuesto = item.impuesto / compras.moneda.cambio;
          //   tadicional = item.adicional / compras.moneda.cambio;
          //   ttotal = item.total / compras.moneda.cambio;
          // }

          htmlObject = $('<tr class="bg-white" data-iddtc="' + item.id + '">' +
            '<td class="center">' + item.numero + '</td>' +
            '<td class="center">' + item.emision + '</td>' +
            '<td class="center">' + item.recepcion + '</td>' +
            '<td class="center">' + item.documento + '</td>' +
            '<td class="center">' + item.proveedor + '</td>' +
            '<td class="center">' + item.referencia + '</td>' +
            '<td class="center">' + item.estado + '</td>' +
            '<td class="right">' + symbolDOC + ' <span>' + $.number(tneto, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep) + '</span></td>' +
            '<td class="right">' + symbolDOC + ' <span>' + $.number(texento, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep) + '</span></td>' +
            '<td class="right">' + symbolDOC + ' <span>' + $.number(timpuesto, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep) + '</span></td>' +
            '<td class="right">' + symbolDOC + ' <span>' + $.number(tadicional, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep) + '</span></td>' +
            '<td class="right">' + symbolDOC + ' <span>' + $.number(ttotal, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep) + '</span></td>' +
            '<td><input type="checkbox"></td>' +
            // '<td class="center"><div><input type="checkbox" ' + ((item.cant_nc)? 'checked' : '') + '  readonly></div></td>' +
            // '<td class="center"><div><input title="'+ fxr +'" type="checkbox" ' + ((item.en_rendicion)? 'checked' : '') + ' readonly></div></td>' +
            '</tr>');

          // $('span numeric.currency').number(true, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep);

          // if (compras.moneda.code != currency.code && compras.moneda.code != "") {
          //   sumaNetos = sumaNetos + (item.neto / compras.moneda.cambio);
          //   sumaExentos = sumaExentos + (item.exento / compras.moneda.cambio);
          //   sumaImpuestos = sumaImpuestos + (item.impuesto / compras.moneda.cambio);
          //   sumaTotales = sumaTotales + (item.total / compras.moneda.cambio);
          //   sumaAdicional = sumaAdicional + (item.adicional / compras.moneda.cambio);
          // } else {
          sumaNetos = sumaNetos + item.neto;
          sumaExentos = sumaExentos + item.exento;
          sumaImpuestos = sumaImpuestos + item.impuesto;
          sumaTotales = sumaTotales + item.total;
          sumaAdicional = sumaAdicional + item.adicional;
          //}

          htmlObject.click(function (event) {
            if (event.target.tagName == "TD") {
              unaBase.loadInto.viewport('/v3/views/dtc/content.shtml?id=' + item.id + '&registrado=si&from=oc');
            }
          });

          container.append(htmlObject);
        });


        var target = $('#sheet-compras');
        var footer = $('#sheet-compras table.dtcs > tfoot');
        footer.find('.container-symbol-new').text(compras.moneda.code)

        compras.total_rows_dtc = data.rows.length
        $('#scrolldtc h1 span').text(data.rows.length);

        $('[name="suma_dtc_netos"]').text($.number(sumaNetos, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep));
        $('[name="suma_dtc_exentos"]').text($.number(sumaExentos, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep));
        $('[name="suma_dtc_impuestos"]').text($.number(sumaImpuestos, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep));
        $('[name="suma_dtc_adicional"]').text($.number(sumaAdicional, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep));
        $('[name="suma_dtc_total"]').text($.number(sumaTotales, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep));

        // $('#scrolldtc .numeric.currency').number(true, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep);
        // $('#scrolldtc .numeric.currency').number(true, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep);

      } else {
        htmlObject = $('<tr><td colspan="12">No existen documentos asociados.</td></tr>');
        container.append(htmlObject);
        $('#scrolldtc table tfoot').hide();

      }

    }
  });
};

var get_factoring_dtv = function (id) {
  $.ajax({
    'url': '/4DACTION/_V3_get_factoring_dtv',
    data: {
      "oc[id]": id
    },
    dataType: 'json',
    success: function (data) {
      var container = $('#sheet-compras table.dtvs > tbody');
      var htmlObject;
      container.find("*").remove();
      if (data.rows.length > 0) {
        $.each(data.rows, function (key, item) {
          htmlObject = $('<tr class="bg-white" data-id="' + item.id + '">' +
            '<td class="center"><input type="checkbox" name="selected_one" class="options_chk chk"></td>' +
            '<td class="center">' + item.folio + '</td>' +
            '<td class="center">' + item.emision + '</td>' +
            // '<td class="center">' + item.tipodoc + '</td>' +
            '<td class="left">' + item.cliente + '</td>' +
            '<td class="left">' + item.referencia + '</td>' +
            '<td class="center">' + item.estado + '</td>' +
            '<td class="right">' + currency.symbol + '<span class="numeric currency">' + item.neto + '</span></td>' +
            '<td class="right">' + currency.symbol + '<span class="numeric currency">' + item.total + '</span></td>' +
            // '<td style="display:none" class="right">' + currency.symbol + '<span class="numeric currency">' + item.cobrado + '</span></td>' +
            // '<td style="display:none" class="right">' + currency.symbol + '<span class="numeric currency">' + item.porcobrar + '</span></td>' +
            '</tr>');
          htmlObject.click(function (event) {
            if (event.target.tagName == "TD") {
              unaBase.loadInto.viewport('/v3/views/dtv/content.shtml?id=' + item.id);
            }
          });
          container.append(htmlObject);
        });
        var footer = $('#sheet-compras table.dtvs > tfoot > tr > th');
        compras.total_rows_dtv = data.rows.length
        $('#scrolldtv h1 span').text(data.rows.length);
        $('#scrolldtv .numeric.currency').number(true, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep);
      } else {
        htmlObject = $('<tr><td colspan="8">No existen facturas asociados.</td></tr>');
        container.append(htmlObject);
        $('#scrolldtv table tfoot').hide();
      }
    }
  });
};

var get_oc_dtc_nc = function (id) {
  var tipo_gasto = $('input[name="oc[tipo_gastos][id]"]').val();
  $.ajax({
    'url': '/4DACTION/_V3_get_oc_dtc_nc',
    data: {
      "oc[id]": id
    },
    dataType: 'json',
    success: function (data) {
      var container = $('#sheet-compras table.dtcsnc > tbody');
      var htmlObject;
      container.find("*").remove();

      if (data.rows.length > 0) {
        var sumaNetos = 0;
        var sumaExentos = 0;
        var sumaImpuestos = 0;
        var sumaTotales = 0;
        var sumaAdicional = 0;
        
        var symbolDOC = currency.symbol;
        if (unaBase.defaulCurrencyCode != compras.moneda.code)
          symbolDOC = compras.moneda.code;

        $.each(data.rows, function (key, item) {

          var tneto2 = item.neto;
          var texento2 = item.exento;
          var timpuesto2 = item.impuesto;
          var tadicional2 = item.adicional;
          var ttotal2 = item.total;
          // if (compras.moneda.code != currency.code && compras.moneda.code != "") {
          //   symbolDOC = compras.moneda.code;
          //   tneto2 = item.neto / compras.moneda.cambio;
          //   texento2 = item.exento / compras.moneda.cambio;
          //   timpuesto2 = item.impuesto / compras.moneda.cambio;
          //   tadicional2 = item.adicional / compras.moneda.cambio;
          //   ttotal2 = item.total / compras.moneda.cambio;
          // }

          htmlObject = $('<tr class="bg-white" data-iddtc="' + item.id + '">' +
            '<td class="center">' + item.numero + '</td>' +
            '<td class="center">' + item.emision + '</td>' +
            '<td class="center">' + item.factura_referencia + '</td>' +
            '<td class="center">' + item.proveedor + '</td>' +
            '<td class="center">' + item.motivo + '</td>' +
            '<td class="right">' + symbolDOC + ' <span class="numeric currency">' + tneto2 + '</span></td>' +
            '<td class="right">' + symbolDOC + ' <span class="numeric currency">' + texento2 + '</span></td>' +
            '<td class="right">' + symbolDOC + ' <span class="numeric currency">' + timpuesto2 + '</span></td>' +
            '<td class="right">' + symbolDOC + ' <span class="numeric currency">' + tadicional2 + '</span></td>' +
            '<td class="right">' + symbolDOC + ' <span class="numeric currency">' + ttotal2 + '</span></td>' +
            '</tr>');

          /*sumaNetos = sumaNetos + item.neto;
          sumaExentos = sumaExentos + item.exento;
          sumaImpuestos = sumaImpuestos + item.impuesto;
          sumaTotales = sumaTotales + item.total;
          sumaAdicional = sumaAdicional + item.adicional;*/

          sumaNetos += tneto2;
          sumaExentos += texento2;
          sumaImpuestos += timpuesto2;
          sumaTotales += ttotal2;
          sumaAdicional += tadicional2;

          htmlObject.click(function () {
            unaBase.loadInto.viewport('/v3/views/dtc/contentnc.shtml?id=' + item.id);
          });
          container.append(htmlObject);

        });

        var target = $('#sheet-compras');
        var footer = $('#sheet-compras table.dtcsnc > tfoot');
        footer.find('.container-symbol-new').text(symbolDOC)
        compras.total_rows_nc = data.rows.length
        $('#scrollnc h1 span').text(data.rows.length);

        /*$('[name="suma_dtc_nc_netos"]').text(sumaNetos);
        $('[name="suma_dtc_nc_exentos"]').text(sumaExentos);
        $('[name="suma_dtc_nc_impuestos"]').text(sumaImpuestos);
        $('[name="suma_dtc_nc_adicional"]').text(sumaAdicional);
        $('[name="suma_dtc_nc_total"]').text(sumaTotales);*/

        /*$('[name="suma_dtc_nc_netos"]').text($.number(sumaNetos, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep));
        $('[name="suma_dtc_nc_exentos"]').text($.number(sumaExentos, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep));
        $('[name="suma_dtc_nc_impuestos"]').text($.number(sumaImpuestos, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep));
        $('[name="suma_dtc_nc_adicional"]').text($.number(sumaAdicional, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep));
        $('[name="suma_dtc_nc_total"]').text($.number(sumaTotales, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep));*/


        $('[name="suma_dtc_nc_netos"]').text(sumaNetos);
        $('[name="suma_dtc_nc_exentos"]').text(sumaExentos);
        $('[name="suma_dtc_nc_impuestos"]').text(sumaImpuestos);
        $('[name="suma_dtc_nc_adicional"]').text(sumaAdicional);
        $('[name="suma_dtc_nc_total"]').text(sumaTotales);

        // $('#scrollnc .numeric.currency').number(true, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep);


        let data_currency = $('#scrollnc .numeric.currency')

        for (i = 0; i < data_currency.length; i++) {

          data_currency[i].textContent = unaBase.utilities.transformNumber(data_currency[i].textContent, 'int');

        }





        $('#scrollnc .numeric.currency').number(true, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep);

      } else {
        $('#scrollnc').hide();
      }

    }
  });
};


var get_pagos_oc = function (id) {
  var op_abono_oc = 0;
  var op_total_oc = 0;
  var op_abono_dtc = 0;
  var op_total_dtc = 0;
  var cantidad_pagos_dtc = 0;
  $.ajax({
    'url': '/4DACTION/_V3_get_pagos_oc_2',
    data: {
      "oc[id]": id
    },
    dataType: 'json',
    success: function (data) {
      var container = $('#sheet-compras table.pagos > tbody');
      let footer = $('#sheet-compras table.pagos > tfoot');
      var htmlObject;
      container.find("*").remove();

      var op_total_oc = 0;
      var op_total_dtc = 0;
      var op_abono_dtc = 0;

      // pagos directos
      var pagos_directos = 0;
      if (data.rows.length > 0) {
        $.each(data.rows, function (key, item) {
          if (item.origen == "DIRECTA") {

            let totalPagoOP = item.total_pago;
            let symbolOP = currency.symbol;
            if (item.monedaTipo != '') {
              totalPagoOP = item.total_pago / item.monedaValorCambio;
              symbolOP = item.monedaTipo;
            }

            htmlObject = $('<tr class="bg-white" data-id="' + item.id + '">' +
              '<td>' + item.folio + '</td>' +
              '<td>' + item.emision + '</td>' +
              '<td>' + item.vencimiento + '</td>' +
              '<td>' + item.proveedor + '</td>' +
              '<td>' + item.tipo + '</td>' +
              '<td>' + item.documento + '</td>' +
              '<td ' + ((item.estado == "ANULADA") ? 'style="color:#ff6862;font-weight:bold"' : '') + '>' + item.estado + '</td>' +
              '<td class="right">' + symbolOP + ' <span class="numeric currency">' + unaBase.utilities.transformNumber(totalPagoOP, 'int') + '</span></td>' +
              '</tr>');
            if (item.estado != "ANULADA") {
              //op_total_oc += item.total_pago;
              
              op_total_oc += totalPagoOP;
            }
            htmlObject.click(function () {
              unaBase.loadInto.viewport('/v3/views/pagos/content2.shtml?id=' + item.id);
            });
            container.append(htmlObject);
            pagos_directos++;
          }
        });
      }

      

      compras.total_rows_pagos = pagos_directos

      $('#scrollPagos .numeric.currency').number(true, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep);

      // Actualizar abono y saldo de órdenes de pago / oc
      $('.op_total_oc').text($.number(op_total_oc, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep));

      $('#scrollPagos h1 span').text(pagos_directos);

      if (pagos_directos == 0) {
        htmlObject = $('<tr><td colspan="9">No existen pagos asociados.</td></tr>');
        container.append(htmlObject);
        $('#scrollPagos').hide();
      }


      // pagos desde dtc
      var container_dtc = $('#sheet-compras table.pagos-dtc > tbody');
      let footer_dtc = $('#sheet-compras table.pagos-dtc > tfoot');
      container_dtc.find("*").remove();
      var htmlObject_dtc;
      var pagos_dtc = 0;
      if (data.rows.length > 0) {
        //remueve boton crear egreso, si ya tiene pago desde algún dtc
        let validPayment = data.rows.filter(i => i.estado !== "ANULADA" && i.origen === "DTC");
        if (validPayment.length) $("div.options-egresos").remove();

        $.each(data.rows, function (key, item) {
          if (item.origen != "DIRECTA") {
            let currencySymbol = item.monedaTipo != unaBase.defaulCurrencyCode ? item.monedaTipo : currency.symbol

            htmlObject_dtc = $('<tr class="bg-white" data-id="' + item.id + '">' +
              '<td>' + item.folio + '</td>' +
              '<td>' + item.emision + '</td>' +
              '<td>' + item.vencimiento + '</td>' +
              '<td>' + item.proveedor + '</td>' +
              '<td>' + item.tipo + '</td>' +
              '<td>' + item.documento + '</td>' +
              '<td ' + ((item.estado == "ANULADA") ? 'style="color:#ff6862;font-weight:bold"' : '') + '>' + item.estado + '</td>' +
              '<td class="right">' + currencySymbol + ' <span class="numeric currency">' + $.number(item.abono / item.monedaValorCambio, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep) + '</span></td>' +
              '<td class="right">' + currencySymbol + ' <span class="numeric currency">' + $.number(item.total_pago / item.monedaValorCambio, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep) + '</span></td>' +
              '<td></td>' +
              '<td></td>' +
              '</tr>');
            if (item.estado != "ANULADA") {
              op_total_dtc += item.total_pago / item.monedaValorCambio;
              op_abono_dtc += item.abono / item.monedaValorCambio;
            }
            htmlObject_dtc.click(function () {
              unaBase.loadInto.viewport('/v3/views/pagos/content2.shtml?id=' + item.id);
            });
            container_dtc.append(htmlObject_dtc);
            pagos_dtc++;
          }
        });
      }

      $('#scrollPagos.dtc .numeric.currency').number(true, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep);

      // Actualizar abono y saldo de órdenes de pago / dtc


      $('.op_abono_dtc').text($.number(op_abono_dtc, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep));
      $('.op_total_dtc').text($.number(op_total_dtc, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep));


      if (unaBase.defaulCurrencyCode != compras.moneda.code) {
        footer.find('.container-symbol-new').text(compras.moneda.code)
        footer_dtc.find('.container-symbol-new').text(compras.moneda.code)
      }

      $('#scrollPagos-dtc h1 span').text(pagos_dtc);

      if (pagos_dtc == 0) {
        htmlObject_dtc = $('<tr><td colspan="9">No existen pagos asociados desde los documentos.</td></tr>');
        container_dtc.append(htmlObject_dtc);
        $('#scrollPagos-dtc').hide();
      }

      oc_validate_fields();

    }
  });
};

var get_comprobantes_oc = function (id) {
  $.ajax({
    'url': '/4DACTION/_V3_get_comprobantes_modulos',
    data: {
      id,
      tipo: "OC"
    },
    dataType: 'json',
    success: function (data) {

      var containerComprobantes = $('#sheet-compras table.comprobantes > tbody');
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
      } else {

        htmlObject = $('<tr><td colspan="9">No existen comprobantes asociados.</td></tr>');
        containerComprobantes.append(htmlObject);
      }
    }
  });
};

var get_cobros_oc = function (id) {
  $.ajax({
    'url': '/4DACTION/_V3_get_cobros_oc2',
    data: {
      "oc[id]": id
    },
    dataType: 'json',
    success: function (data) {
      var container = $('#sheet-compras table.cobros > tbody');
      var htmlObject;
      container.find("*").remove();
      var cant = data.rows.length;
      if (cant > 0) {
        $.each(data.rows, function (key, item) {
          htmlObject = $('<tr class="bg-white" data-id="' + item.id + '" data-idctacte="' + item.id_cuenta_cte + '">' +
            '<td>' + item.nro + '</td>' +
            '<td>' + item.fecha + '</td>' +
            '<td>' + item.cta + '</td>' +
            '<td>' + item.tipo + '</td>' +
            '<td>' + item.estado + '</td>' +
            '<td>' + item.monto + '</td>' +
            '</tr>');
          htmlObject.click(function () {
            unaBase.loadInto.dialog('/v3/views/cobros/dialog/cobros.shtml?id=' + item.id, 'Nuevo depósito', 'medium');
          });
          container.append(htmlObject);
        });



        compras.total_rows_cobros = cant
        $('#scrollCobros h1 span').text(cant);

      } else {
        htmlObject = $('<tr><td colspan="6">No existen cobros asociados.</td></tr>');
        container.append(htmlObject);
      }
    }
  });
};

var menus = function () {
  unaBase.toolbox.init();

  if (!uVar.experimental) {

    expensesParams = {
      entity: 'Compras',
      buttons: ['save', 'exit', 'discard', 'restore', 'preview_oc', 'duplicate_gastos', 'share_oc', 'validate', 'payment_request', 'new_payment', 'update', 'close_admin_fxr', 'open_admin_fxr', 'close_admin_oc', 'open_admin_oc', 'approve_excess', 'ultimate_val', "preview_native", "justificar_masivo", "share_oc_val", "close_production_process", "open_production_process"],
      buttonAccess: {
        close_admin_oc: '_650',
        open_admin_oc: '_650'
      },
      data: function () {
        // 
        //   const defaultMoney = document.getElementById("defaultMoney");
        //   const printMoney = document.getElementById("printMoney");
        //   valueByPrint = settingsMoney.find(s => s.codigo === printMoney.value).value
        //   exchangeRate = settingsMoney.find(s => s.codigo === defaultMoney.value).value

        //   const exchangeData = JSON.stringify({
        //     codigoByPrint: printMoney.value,
        //     valueByPrint,
        //     'exchange[rate]': exchangeRate,
        //     'exchange[type]': defaultMoney.value
        //   })
        //var objCloned = $('#sheet-compras').clone(true, true);
        var objCloned = $('#sheet-compras');
        
        // Find disabled inputs, and remove the "disabled" attribute
        var disabled = objCloned.find(':input:disabled').removeAttr('disabled');
        objCloned.find('table.items tbody tr[data-tipo="ITEM"]').each(function () {

          var target = $(this).find('input[name="oc[detalle_item][precio]"]');
          var price = parseFloat(target.data("oldprice"));
          target.unbind(".format");
          if (currency.thousands_sep == ",") {
            // caso peru
            target.prop('value', price.toString().replace(/\,/g, '.'));
          } else {
            // caso chile
            target.prop('value', price.toString().replace(/\./g, ','));
          }
        });

        // serialize the form
        //TODO serializy no toma campos disabled, estos se deben dejar readonly y no disabled
        var serialized = objCloned.serializeAnything();

        // re-disabled the set of inputs that you previously enabled
        disabled.attr('disabled', 'disabled');
        return serialized + '&fromSave=save';
      },
      validate: function () {
        var msgError = '';
        var status = true;

        var referencia = $.trim($('input[name="oc[referencia]"]').val());
        var proveedor = $('input[name="contacto[info][id]"]').val();
        var origen = $('input[name="oc[origen]"]').val();
        var idprov = $('input[name="contacto[info][id]"]');
        var razon = $.trim($('input[name="contacto[info][razon_social]"]').val());
        var rut = $.trim($('input[name="contacto[info][rut]"]').val());
        var tipo_contacto = $.trim($('input[name="contacto[info][tipo]"]').val());
        var giro = $.trim($('input[name="contacto[info][giro]"]').val());
        var validaDatosComerciales = mainContainer.data('validadatoscomerciales');
        var tipoGasto = $('input[name="oc[tipo_gastos][id]"]').val();
        var email = $('input[name="contacto[info][email]"]').val();
        var blockEmailObligatorio = mainContainer.data('blockemailobligatorio');

        $('#sheet-compras input').removeClass("invalid");

        if ($('input[name="oc[tipo_gastos][des]"]').val() == "") {
          msgError = msgError + '- Falta seleccionar tipo de gasto.<br/>';
          $('input[name="oc[tipo_gastos][des]"]').addClass('invalid');
        }
        if (compras.origen == "GASTO GENERAL") {
          if ($('input[name="oc[origen][clas][des]"]').val() == "") {
            msgError = msgError + '- Falta seleccionar clasificación.<br/>';
            $('input[name="oc[origen][clas][des]"]').addClass('invalid');
          }
        }
        if (referencia == "") {
          msgError = msgError + '- Falta ingresar referencia.<br/>';
          $('input[name="oc[referencia]"]').addClass('invalid');
        }


        if (tipoGasto == 'OC') {
          if (proveedor == "" || proveedor == "0") {
            msgError = msgError + '- Falta ingresar datos del proveedor.<br/>';
            $('input[name="contacto[info][alias]"]').addClass('invalid');
          } else {
            if (validaDatosComerciales) {

              if (razon == "" || (rut == "" && tipo_contacto.toLowerCase() != 'extranjero') || giro == "") {
                msgError = msgError + '- Falta ingresar algunos datos comerciales de proveedor como: razón social, rut o giro).<br/>';
                if (razon == "") {
                  $('input[name="contacto[info][razon_social]"]').addClass('invalid');
                }
                if (rut == "") {
                  $('input[name="contacto[info][rut]"]').addClass('invalid');
                }
                if (giro == "") {
                  $('input[name="contacto[info][giro]"]').addClass('invalid');
                }

              }

            }

          }
        } else {

          if (proveedor == "" || proveedor == "0") {
            msgError = msgError + '- Falta ingresar datos del solicitante.<br/>';
            $('input[name="contacto[info][alias]"]').addClass('invalid');
          } else {
            if (no_crear_fxr_tiene_pendientes) {
              if (!check_pending_fxr(proveedor)) {
                msgError = msgError + '- No es posible crear la rendición. El solicitante cuenta con solicitudes pendientes por cerrar.<br/>';
                $('input[name="contacto[info][alias]"]').addClass('invalid');
              }
            }
          }

        }
        if (!blockEmailObligatorio) {
          if (email == "") {
            msgError += '- Falta ingresar email.<br/>';
            $('input[name="contacto[info][email]"]').addClass('invalid');
          }
        }

        if ($('input[name="tipo_doc[id]"]').val() == "" || $('input[name="tipo_doc[id]"]').val() == "0") {
          msgError = msgError + '- Falta seleccionar tipo de documento.<br/>';
          $('input[name="tipo_doc[descripcion]"]').addClass('invalid');
        }


        if (v3_tipo_pago_obligatorio) {

          var tipo_pago = $('input[name="tipo_pago[descripcion]"]').val();

          if ($('input[name="tipo_pago[descripcion]"]').val() == "") {
            msgError = msgError + '- Falta seleccionar tipo de pago.<br/>';
            $('input[name="tipo_pago[descripcion]"]').addClass('invalid');
          }
          
          if (tipo_pago == "TRANSFERENCIA") {
            if ($('input[name="tipo_pago[transferencia][nombre_banco]"]').val() == "") {
              msgError = msgError + '- Falta seleccionar banco.<br/>';
              $('input[name="tipo_pago[transferencia][nombre_banco]"]').addClass('invalid');
            }

            if ($('input[name="tipo_pago[transferencia][tipo_cuenta]"]').val() == "") {
              msgError = msgError + '- Falta seleccionar tipo de cuenta.<br/>';
              $('input[name="tipo_pago[transferencia][tipo_cuenta]"]').addClass('invalid');
            }

            if ($('input[name="tipo_pago[transferencia][nro_cuenta]"]').val() == "") {
              msgError = msgError + '- Falta ingresar número de cuenta.<br/>';
              $('input[name="tipo_pago[transferencia][nro_cuenta]"]').addClass('invalid');
            }
          }

        }


        //Verificar campos en FXR
        if (validar_datos_bancarios && tipoGasto == 'FXR') {
          var tipo_pago = $('input[name="tipo_pago[descripcion]"]').val();

          if (tipo_pago == "TRANSFERENCIA") {
            if ($('input[name="tipo_pago[transferencia][nombre_banco]"]').val() == "") {
              msgError = msgError + '- Falta seleccionar banco.<br/>';
              $('input[name="tipo_pago[transferencia][nombre_banco]"]').addClass('invalid');
            }

            if ($('input[name="tipo_pago[transferencia][tipo_cuenta]"]').val() == "") {
              msgError = msgError + '- Falta seleccionar tipo de cuenta.<br/>';
              $('input[name="tipo_pago[transferencia][tipo_cuenta]"]').addClass('invalid');
            }

            if ($('input[name="tipo_pago[transferencia][nro_cuenta]"]').val() == "") {
              msgError = msgError + '- Falta ingresar número de cuenta.<br/>';
              $('input[name="tipo_pago[transferencia][nro_cuenta]"]').addClass('invalid');
            }

            if (document.querySelector('input[name="tipo_pago[transferencia][mx_clabe]')) {

              if ($('input[name="tipo_pago[transferencia][mx_clabe]').val() == "") {
                msgError = msgError + '- Falta ingresar número de clabe interbancaria.<br/>';
                $('input[name="tipo_pago[transferencia][mx_clabe]').addClass('invalid');
              }

            }
          }

        }

        var items = $('#sheet-compras table.items tbody > tr');

        if (items.length > 0) {
          var cant = 0;
          items.each(function (key, item) {
            var numbers = $(this).find('input[name="oc[detalle_item][total]"]').val();
            var names = $.trim($(this).find('input[name="oc[detalle_item][nombre]"]').val());

            if (!ocs_con_valor_cero) {

              if ($(this).data('tipo') == "ITEM") {
                // if (numbers == 0 || numbers < 0){
                if (numbers == 0) {
                  $(this).find('input[name="oc[detalle_item][cantidad]"]').addClass('invalid');
                  $(this).find('input[name="oc[detalle_item][precio]"]').addClass('invalid');
                  cant++;
                }
              }
            }

            if (names == "") {
              $(this).find('input[name="oc[detalle_item][nombre]"]').addClass('invalid');
              cant++;
            }

          });

          if (cant > 0) {
            msgError = msgError + '- Falta ingresar datos en ítem.<br/>';
          }

        } else {
          msgError = msgError + '- Falta agregar ítem a la compra.<br/>';
        }

        // Validar si existen datos bancarios (para validar, depende del parámetro)
        //desactivado temporal
        // if (typeof validar_datos_bancarios != 'undefined') {
        //   if (validar_datos_bancarios && tipoGasto == 'FXR') {
        //     $.ajax({
        //       url: '/4DACTION/_V3_getEmpresa',
        //       data: {
        //         q: parseFloat($('input[type="hidden"][name="contacto[info][id]"]').val()),
        //         filter: 'id',
        //         from: 'oc'
        //       },
        //       dataType: 'json',
        //       async: false,
        //       success: function (data) {
        //         try {
        //           if (!data.rows[0].has_payment_data)
        //             msgError += '- Falta ingresar datos bancarios del proveedor.<br/>';
        //         } catch (e) { }
        //       }
        //     });
        //   }

        // }

        // verifica estatus final
        if (msgError == '') {
          status = true;
        } else {
          toastr.error(msgError);
          status = false;
        }

        return status;
      }
    }

    unaBase.toolbox.menu.init(expensesParams);

  } else {
    unaBase.toolbox.menu.newInit({
      entity: 'Compras',
      // buttons: ['save', 'exit', 'discard', 'restore', 'preview_oc', 'duplicate_gastos','share_oc','validate','payment_request','new_payment', 'update', 'close_admin_fxr', 'open_admin_fxr',  'close_admin_oc', 'open_admin_oc', 'approve_excess', 'ultimate_val', "preview_native"],
      // buttonAccess: {
      //   close_admin_oc: '_650',
      //   open_admin_oc: '_650'
      // },
      buttonsList: [
        {
          name: "save",
          icon: "ui-icon-disk",
          caption: "Guardar",
          action: function (event) {
            unaBase.ui.block();
            setTimeout(() => {
              let success = false;
              let element = $(this);
              let sendValidar = false;

              var setData = function (without_items, data) {
                $('[data-name="share"]').data("is-saved", false);
                $.ajax({
                  url: "/4DACTION/_V3_set" + params.entity,
                  type: "POST",
                  dataType: "json",
                  data: params.data(),
                  async: true
                }).done(function (data) {
                  if ($("table.items.cotizacion").data("gastop-mayor-venta")) {
                    unaBase.log.save(
                      "[En estado " +
                      params.entity.toLowerCase() +
                      "] Se guardó la cotización con gasto presupuestado mayor al precio de venta",
                      modulo,
                      folio,
                      data.id
                    );
                    $("table.items.cotizacion").removeData(
                      "gastop-mayor-venta"
                    );
                  }
                  success = data.success;
                  unaBase.changeControl.init();
                  if (data.success) {
                    $('[data-name="share"]').data("is-saved", true);
                    if (compras.tipoGasto == "FXR" || compras.tipoGasto == "FTG") {
                      toastr.success(NOTIFY.get("SUCCESS_SAVE_GASTO_FXR"));
                    } else {
                      toastr.success(NOTIFY.get("SUCCESS_SAVE_GASTO_OC"));
                    }
                    var target = $("#sheet-compras");
                    target.find('input[name="oc[total_justificado]"]').val(data.justificado);
                    target.find('input[name="oc[total_por_justificar]"]').val(data.saldoJustificar);
                    target.find('input[name="oc[saldo_total_fxr]"]').val(data.saldoTotalFxr);
                    var footer = $("#sheet-compras table.dtcs > tfoot > tr > th");
                    footer.find('input[name="oc[suma_justificado]"]').val(data.justificado);
                    var nuevo = false;
                    if (target.data("index") == "") {
                      nuevo = true;
                      compras.folio = data.index;
                      target.data("index", compras.folio);
                      target.data("folio", compras.folio);
                      target.find("#index").text("Nº " + compras.folio);
                      $('#dialog-menu ul li[data-name="cancel_oc"]').remove();
                    }
                    unaBase.ui.expandable.init();
                    if (nuevo) {
                      $.ajax({
                        url: "/4DACTION/_V3_setLogValidacion",
                        data: {
                          table: "Orden_de_compra",
                          id_record: $("section.sheet").data("id"),
                          index_record: $("section.sheet").data("index"),
                          ref_record: $("section.sheet").find('[name="oc[referencia]"]').val(),
                          test: true
                        },
                        dataType: "json",
                        async: false,
                        success: function (data) {
                          has_rules = data.rows.length > 0;
                          if (has_rules && !crear_oc_validada) {
                            sendValidar = true;
                          } else {
                            $.ajax({
                              url: "/4DACTION/_V3_setCompras",
                              data: {
                                id: $("section.sheet").data("id"),
                                "oc[approved]": true,
                                auto: true
                              },
                              dataType: "json",
                              async: false,
                              success: function (subdata) {
                                var labelValidada = $("section.sheet footer article p span.validation-status");
                                compras.validado = 1;
                                $("#sheet-compras").data("validado", true);
                                $("#sheet-compras").find('input[name="oc[validado]"]').val(true);
                                labelValidada.text("Validada").attr("style", "color:black!important").removeClass("false").addClass("true");
                                $("section.sheet button.add.dtc").visible();
                                $("section.sheet button.add.orden-pago").visible();
                                $("section.sheet button.add.cobro").visible();
                              }
                            });
                          }
                        }
                      });
                    }
                    var idoc = $("#sheet-compras").data("id");
                    get_items(idoc);
                    get_totales_gastos();
                    get_oc_dtc(idoc);
                    if (nuevo) {
                      var tipoGasto = target.find('input[name="oc[tipo_gastos][id]"]').val();
                      var origenGasto = target.find('input[name="oc[origen]"]').val();
                      var neto = target.find('input[name="oc[neto]"]').val();
                      var id_prov = target.find('input[name="contacto[info][id]"]').val();
                      var folio = target.data("folio");
                      unaBase.inbox.send({
                        subject: "Ha creado el gasto - " + " Nº " + folio + " / " + target.find('input[name="oc[referencia]"]').val(),
                        into: "viewport",
                        href: "/v3/views/compras/content.shtml?id=" + data.id,
                        tag: "avisos"
                      });
                      if (compras.origen == "PROYECTO" || compras.origen == "PRESUPUESTO") {
                        $.ajax({
                          url: "/4DACTION/_V3_verificaOcDuplicada",
                          data: {
                            "verifica[id_oc_creando]": idoc,
                            "verifica[id_prov]": id_prov,
                            "verifica[neto]": neto,
                            "verifica[origen]": origenGasto
                          },
                          dataType: "json",
                          success: function (result) {
                            if (result.success) {
                              unaBase.inbox.send({
                                subject: "Ha creado posible gasto duplicado - " + tipoGasto + " Nº " + folio + " / " + target.find('input[name="oc[referencia]"]').val(),
                                into: "viewport",
                                href: "/v3/views/compras/content.shtml?id=" + data.id,
                                tag: "avisos"
                              });
                            }
                          }
                        });
                        var cantItemExcede = $("#sheet-compras table > tbody > tr").find('input[name="oc[detalle_item][total]"].warning').length;
                        if (cantItemExcede > 0) {
                          unaBase.inbox.send({
                            subject: "Ha excedido el gasto presupuestado - " + tipoGasto + " Nº " + folio + " / " + target.find('input[name="oc[referencia]"]').val(),
                            into: "viewport",
                            href: "/v3/views/compras/content.shtml?id=" + data.id,
                            tag: "avisos"
                          });
                        }
                        let gasto90Pres = $("#sheet-compras table > tbody > tr").find('input[name="oc[detalle_item][total]"].noventagp').length;
                        let used = parseInt($("#sheet-compras table > tbody > tr").find('input[name="oc[detalle_item][total]"].percentage')[0]?.dataset?.percentage || 0);
                        let expenseOrigin = compras.origen === 'PROYECTO' ? 'negocio' : 'presupuesto';
                        if (gasto90Pres > 0 && used > 90) {
                          unaBase.inbox.send({
                            subject: `Ha creado gasto de ${expenseOrigin} con 90% presupuestado - ` + tipoGasto + " Nº " + folio + " / " + target.find('input[name="oc[referencia]"]').val(),
                            into: "viewport",
                            href: "/v3/views/compras/content.shtml?id=" + data.id,
                            tag: "avisos"
                          });
                        }
                      }
                    }
                    oc_validate_fields();
                    unaBase.ui.unblock();
                    if (unaBase.save.callback !== null) {
                      unaBase.save.callback();
                      unaBase.save.clearCallback();
                    }
                  } else {
                    if (typeof data.detail != "undefined" && data.detail.result) {
                      toastr.warning(data.detail.data);
                    } else {
                      if (typeof data.computer != "undefined") {
                        var bloqueo = "";
                        if (typeof data.computer != "undefined") {
                          bloqueo = "<br>-Desde: " + data.bloqueo;
                        }
                        toastr.error(
                          NOTIFY.get("ERROR_RECORD_READONLY") +
                          "<br><br>Bloqueado por:<br><br>-Equipo: " +
                          data.computer +
                          "<br>-Proceso: " +
                          data.process +
                          bloqueo
                        );
                      } else {
                        toastr.error(NOTIFY.get("ERROR_RECORD_READONLY"));
                      }
                    }
                    unaBase.ui.unblock();
                  }
                });
              };

              if (params.validate()) {
                unaBase.ui.block();
                window.setTimeout(function () {
                  setData();
                  if (sendValidar)
                    window.setTimeout(function () {
                      initLogValidacion();
                    }, 1);
                }, 1);
              } else {
                toastr.error(
                  "Es necesario completar la información requerida antes de guardar.",
                  "Faltan datos"
                );
                unaBase.ui.unblock();
              }
            }, 10);
            return { success: true };
          }
        }
      ],
      data: function () {
        //var objCloned = $('#sheet-compras').clone(true, true);
        var objCloned = $('#sheet-compras');
        objCloned.find('table.items tbody tr[data-tipo="ITEM"]').each(function () {

          var target = $(this).find('input[name="oc[detalle_item][precio]"]');
          var price = parseFloat(target.data("oldprice"));
          target.unbind(".format");
          if (currency.thousands_sep == ",") {
            // caso peru
            target.prop('value', price.toString().replace(/\,/g, '.'));
          } else {
            // caso chile
            target.prop('value', price.toString().replace(/\./g, ','));
          }
        });
        return objCloned.serializeAnything();
      },
      validate: function () {
        var msgError = '';
        var status = true;

        var referencia = $.trim($('input[name="oc[referencia]"]').val());
        var proveedor = $('input[name="contacto[info][id]"]').val();
        var origen = $('input[name="oc[origen]"]').val();
        var idprov = $('input[name="contacto[info][id]"]');
        var razon = $.trim($('input[name="contacto[info][razon_social]"]').val());
        var rut = $.trim($('input[name="contacto[info][rut]"]').val());
        var giro = $.trim($('input[name="contacto[info][giro]"]').val());
        var validaDatosComerciales = mainContainer.data('validadatoscomerciales');
        var tipoGasto = $('input[name="oc[tipo_gastos][id]"]').val();

        $('#sheet-compras input').removeClass("invalid");

        if ($('input[name="oc[tipo_gastos][des]"]').val() == "") {
          msgError = msgError + '- Falta seleccionar tipo de gasto.<br/>';
          $('input[name="oc[tipo_gastos][des]"]').addClass('invalid');
        }
        if (compras.origen == "GASTO GENERAL") {
          if ($('input[name="oc[origen][clas][des]"]').val() == "") {
            msgError = msgError + '- Falta seleccionar clasificación.<br/>';
            $('input[name="oc[origen][clas][des]"]').addClass('invalid');
          }
        }
        if (referencia == "") {
          msgError = msgError + '- Falta ingresar referencia.<br/>';
          $('input[name="oc[referencia]"]').addClass('invalid');
        }

        if (tipoGasto == 'OC') {
          if (proveedor == "" || proveedor == "0") {
            msgError = msgError + '- Falta ingresar datos del proveedor.<br/>';
            $('input[name="contacto[info][alias]"]').addClass('invalid');
          } else {
            if (validaDatosComerciales) {
              if (razon == "" || rut == "" || giro == "") {
                msgError = msgError + '- Falta ingresar algunos datos comerciales de Proveedor como: razón social, rut o giro).<br/>';
                if (razon == "") {
                  $('input[name="contacto[info][razon_social]"]').addClass('invalid');
                }
                if (rut == "") {
                  $('input[name="contacto[info][rut]"]').addClass('invalid');
                }
                if (giro == "") {
                  $('input[name="contacto[info][giro]"]').addClass('invalid');
                }
              }
            }
          }
        } else {

          if (proveedor == "" || proveedor == "0") {
            msgError = msgError + '- Falta ingresar datos del solicitante.<br/>';
            $('input[name="contacto[info][alias]"]').addClass('invalid');
          } else {
            if (no_crear_fxr_tiene_pendientes) {
              if (!check_pending_fxr(proveedor)) {
                msgError = msgError + '- No es posible crear la rendición. El solicitante cuenta con solicitudes pendientes por cerrar.<br/>';
                $('input[name="contacto[info][alias]"]').addClass('invalid');
              }
            }
          }

        }

        if ($('input[name="tipo_doc[id]"]').val() == "" || $('input[name="tipo_doc[id]"]').val() == "0") {
          msgError = msgError + '- Falta seleccionar tipo de documento.<br/>';
          $('input[name="tipo_doc[descripcion]"]').addClass('invalid');
        }

        if (v3_tipo_pago_obligatorio) {

          var tipo_pago = $('input[name="tipo_pago[descripcion]"]').val();

          if ($('input[name="tipo_pago[descripcion]"]').val() == "") {
            msgError = msgError + '- Falta seleccionar tipo de pago.<br/>';
            $('input[name="tipo_pago[descripcion]"]').addClass('invalid');
          }
          
          if (tipo_pago == "TRANSFERENCIA") {
            if ($('input[name="tipo_pago[transferencia][nombre_banco]"]').val() == "") {
              msgError = msgError + '- Falta seleccionar banco.<br/>';
              $('input[name="tipo_pago[transferencia][nombre_banco]"]').addClass('invalid');
            }

            if ($('input[name="tipo_pago[transferencia][tipo_cuenta]"]').val() == "") {
              msgError = msgError + '- Falta seleccionar tipo de cuenta.<br/>';
              $('input[name="tipo_pago[transferencia][tipo_cuenta]"]').addClass('invalid');
            }

            if ($('input[name="tipo_pago[transferencia][nro_cuenta]"]').val() == "") {
              msgError = msgError + '- Falta ingresar número de cuenta.<br/>';
              $('input[name="tipo_pago[transferencia][nro_cuenta]"]').addClass('invalid');
            }
          }

        }

        var items = $('#sheet-compras table.items tbody > tr');

        if (items.length > 0) {
          var cant = 0;
          items.each(function (key, item) {
            var numbers = $(this).find('input[name="oc[detalle_item][total]"]').val();
            var names = $.trim($(this).find('input[name="oc[detalle_item][nombre]"]').val());

            if (!ocs_con_valor_cero) {
              if ($(this).data('tipo') == "ITEM") {
                // if (numbers == 0 || numbers < 0){
                if (numbers == 0) {
                  $(this).find('input[name="oc[detalle_item][cantidad]"]').addClass('invalid');
                  $(this).find('input[name="oc[detalle_item][precio]"]').addClass('invalid');
                  cant++;
                }
              }
            }

            if (names == "") {
              $(this).find('input[name="oc[detalle_item][nombre]"]').addClass('invalid');
              cant++;
            }

          });

          if (cant > 0) {
            msgError = msgError + '- Falta ingresar datos en ítem.<br/>';
          }

        } else {
          msgError = msgError + '- Falta agregar ítem a la compra.<br/>';
        }

        // Validar si existen datos bancarios (para validar, depende del parámetro)
        if (typeof validar_datos_bancarios != 'undefined')
          $.ajax({
            url: '/4DACTION/_V3_getEmpresa',
            data: {
              q: parseFloat($('input[type="hidden"][name="contacto[info][id]"]').val()),
              filter: 'id',
              from: 'oc'
            },
            dataType: 'json',
            async: false,
            success: function (data) {
              try {
                if (!data.rows[0].has_payment_data)
                  msgError += '- Falta ingresar datos bancarios del proveedor.<br/>';
              } catch (e) { }
            }
          });

        // verifica estatus final
        if (msgError == '') {
          status = true;
        } else {
          toastr.error(msgError);
          status = false;
        }

        return status;
      }
    });
  }
}

var scrolling = function () {
  var from = $('#sheet-compras').data('from');
  if (from != "self") {
    $('#viewport').scrollTo($("#scroll" + from), 800);
  };
}

var calcula_fecha_vcto_pago_oc = function (idForma) {
  var fecha;
  $.ajax({
    'url': '/4DACTION/_v3_get_fecha_vcto_pago_oc',
    data: {
      "oc[id_forma_pago]": idForma
    },
    async: false,
    dataType: 'json',
    success: function (data) {

      fecha = data.fecha;
    }
  });
  return fecha;
}

var calcula_fecha_cierre_fxr = function () {
  var fecha;
  $.ajax({
    'url': '/4DACTION/_v3_get_fecha_cierre_fxr',
    data: {},
    async: false,
    dataType: 'json',
    success: function (data) {
      fecha = data.fecha;
    }
  });
  return fecha;
}

var calcula_fecha_vcto_factoring = function (dias, fecha_anticipo) {
  var fecha;
  $.ajax({
    'url': '/4DACTION/_v3_get_fecha_vcto_factoring',
    data: {
      "factoring[fecha]": fecha_anticipo,
      "factoring[dias]": dias
    },
    async: false,
    dataType: 'json',
    success: function (data) {
      fecha = data.fecha;
    }
  });
  return fecha;
}

var get_impuesto_by_doc = function (id) {
  var impuestos = {};
  $.ajax({
    url: '/4DACTION/_V3_getImpuestos',
    dataType: 'json',
    data: {
      'dtc[id]': id
    },
    async: false,
    success: function (data) {
      impuestos = data;
    }
  });
  return impuestos;
}

$(document).ready(function () {

  compras.init();

  $('[name="oc[tipo_moneda]"] option:selected').val(currency.name.toUpperCase()).text(currency.name.toUpperCase());

  // calcula la fecha de vcto factoring
  $('.calculo_fecha_anticipo_factoring').change(function () {
    var dias = $('[name="oc[plazo_dias_factoring]"]').val();
    var fecha_anticipo = $('[name="oc[fecha_anticipo]"]').val();
    var fecha = calcula_fecha_vcto_factoring(dias, fecha_anticipo);
    $('[name="oc[fecha_vcto_factoring]"]').val(fecha);
  });



  // $('.numeric.currency input').number(true, 2, currency.decimals_sep, currency.thousands_sep);
  // $('.numeric.currency .deciyes').number(true, 2, currency.decimals_sep, currency.thousands_sep);
  // $('.numeric.currency .decinot').number(true, 0, currency.decimals_sep, currency.thousands_sep);
  // $('.numeric.currency span.decinot').number(true, 0, currency.decimals_sep, currency.thousands_sep);


  var container = $('#sheet-compras');

  setTimeout(function () {
    scrolling();
  }, 1000);

  // habilita menus
  menus();
  $('#dropdown_menu_').menu().hide();
  $('nav#menu').find('[data-name="restore"]').hide();

  // oculta mas info
  $('.hide').hide();

  // Funciones
  resumen_totales();


  // bloqueo de edicion fecha de emision con permiso


  // fechaEmision.prop("readonly",true);
  // fechaEmision.setAttribute("type", "text");

  // $('input[name="oc[fecha_emision]"]').prop("readonly",true);

  // inputFecha.val(fecha).prop("readonly",true);


  // Cambia resumen referencia
  $('input[name="oc[referencia]"]').keyup(function () {
    $('.referencia-resumen').text($(this).val().toUpperCase());
  });

  $('button.info').button({ icons: { primary: 'ui-icon-notice' }, text: false }).css({ "background": "transparent", "border": "none" });

  $('button.export.dtc').button({ icons: { primary: 'ui-icon-arrowthickstop-1-s' }, text: true }).click(function () {
    compras.exportListDtc();
  });
  //AGREGAR DOCUMENTOS PENDIENTES
  $('button.search.dtc-pend').button({ icons: { primary: 'ui-icon-circle-plus' }, text: true }).click(function () {
    compras.getPendingDtcs();
  });
  // agregar dtc
  $('button.add.dtc').button({ icons: { primary: 'ui-icon-circle-plus' }, text: true }).click(function () {
    // add_dtc();
    compras.addDtc();
  });

  $('button.add.xml').button({ icons: { primary: 'ui-icon-circle-plus' }, text: true }).click(function () {
    // add_dtc();
    compras.addFromXml();
  });

  // agregar dtc
  $('button.addexist.dtc').button({ icons: { primary: 'ui-icon-circle-zoomin' }, text: true }).click(function () {
    compras.addExistDtc();
  });

  // agregar dtc
  $('button.add.dtv').button({ icons: { primary: 'ui-icon-circle-plus' }, text: true }).click(function () {
    // compras.addDtc();
  });

  // agregar dtc
  $('button.addexist.dtv').button({ icons: { primary: 'ui-icon-circle-zoomin' }, text: true }).click(function () {
    compras.addExistDtv();
  });

  // redondear montos totoales gastos
  $('button.u-redondear-sumar').button({ icons: { primary: 'ui-icon-circle-plus' }, text: false }).click(function () {
    compras.total_ajuste++;
    mainContainer.find('input[name="oc[total_ajuste_pre]"]').val($.number(compras.total_ajuste, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep));
    mainContainer.find('input[name="oc[total_ajuste]"]').val(compras.total_ajuste);
    update_subtotal_items();
  });
  $('button.u-redondear-restar').button({ icons: { primary: 'ui-icon-circle-minus' }, text: false }).click(function () {
    compras.total_ajuste--;
    mainContainer.find('input[name="oc[total_ajuste_pre]"]').val($.number(compras.total_ajuste, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep));
    mainContainer.find('input[name="oc[total_ajuste]"]').val(compras.total_ajuste);
    update_subtotal_items();
  });

  // redondear montos totoales gastos
  $('button.u-redondear-sumar-impuesto').button({ icons: { primary: 'ui-icon-circle-plus' }, text: false }).click(function () {
    compras.total_ajuste_impuesto++;
    mainContainer.find('input[name="oc[total_ajuste_impuesto]"]').val(compras.total_ajuste_impuesto);
    update_subtotal_items();
  });
  $('button.u-redondear-restar-impuesto').button({ icons: { primary: 'ui-icon-circle-minus' }, text: false }).click(function () {
    compras.total_ajuste_impuesto--;
    mainContainer.find('input[name="oc[total_ajuste_impuesto]"]').val(compras.total_ajuste_impuesto);
    update_subtotal_items();
  });

  /*$('button.add.dtc2').button({icons: { primary: 'ui-icon-circle-plus'}, text: true }).click(function() {
    compras.addDtc2();
  });*/

  // agregar pagos
  $('button.add.orden-pago').button({ icons: { primary: 'ui-icon-circle-plus' }, text: true }).click(function () {
    if (compras.tipoGasto == "FXR" && $('section#sheet-compras').data('excedida')) {
      toastr.warning('La rendición no puede ser pagada si no se valida el exceso.');
    } else {
      $('#menu [data-name="new_payment"] button').triggerHandler('click');
      // unaBase.loadInto.viewport('/v3/views/pagos/content2.shtml?id=0');
    }
  });

  // agregar depositos
  $('button.add.cobro').button({ icons: { primary: 'ui-icon-circle-plus' }, text: true }).click(function () {
    var id = 0;
    unaBase.loadInto.dialog('/v3/views/cobros/dialog/cobros.shtml?id=' + id, 'Nuevo depósito', 'medium');
  });

  // Muestra opciones origen
  $('button.add.items').click(function () {
    var dropdown = $('#dropdown_menu_');
    var li = dropdown.find('li').length;
    if (li > 0) {

      if (access._440 || access._442 || access._560) {
        dropdown.toggle();
      } else {
        alert("NO CUENTA CON PERMISO PARA REALIZAR NINGÚN TIPO DE GASTO.");
      }
      if (!access._440) {
        dropdown.find('li > a[data-origen="PROYECTO"]').parent().hide();
      }
      if (!access._442) {
        dropdown.find('li > a[data-origen="GASTO GENERAL"]').parent().hide();
      }
      if (!access._560) {
        dropdown.find('li > a[data-origen="PRESUPUESTO"]').parent().hide();
      }

      // verifica items para ocultar opciones de nenu (proyecto o gg)
      var itemsp = $('#sheet-compras table.items > tbody > tr[data-origen="PROYECTO"]').length + $('#sheet-compras table.items > tbody > tr[data-origen="PRESUPUESTO"]').length;
      var itemsg = $('#sheet-compras table.items > tbody > tr[data-origen="GASTO GENERAL"]').length;
      if (itemsp > 0 && itemsg == 0) {
        dropdown.find('li > a[data-origen="GASTO GENERAL"]').parent().hide();
      } else {
        if (itemsg > 0 && itemsp == 0) {
          dropdown.find('li > a[data-origen="PROYECTO"]').parent().hide();
          dropdown.find('li > a[data-origen="PRESUPUESTO"]').parent().hide();
        }
      }
    } else {
      alert("NO CUENTA CON PERMISO PARA REALIZAR NINGÚN TIPO DE GASTO.");
      // toastr.warning('NO CUENTA CON PERMISO PARA REALIZAR NINGÚN TIPO DE GASTO.');
    }
  });

  // Selecciona opción origen y agrega categoria e ítem
  $('#dropdown_menu_ li a').click(function () {

    var cantTitulos = $('#sheet-compras table.items > tbody > tr[data-tipo="TITULO"]').length;
    var correlativo = $('#sheet-compras table.items > tbody > tr').length;

    var origen = $(this).data('origen');
    $('input[name="oc[origen]"]').val(origen);


    const rows = document.querySelectorAll('table#items-gastos tbody tr');
    let module_ = origen == 'PROYECTO' ? 'origen_negocios' : 'origen_presupuestos'
    let flag = false
    
    for (let row of rows) {
      if (row.dataset.module) {
        let d = row.dataset.module
        if (d != module_) {
          flag = true
        }

      }
    }

    if (flag && unaBase.accounting_mode) {
      toastr.warning('No es posible agregar ítems de un origen diferente a los ya agregados')
      return
    }





    if (origen == "PROYECTO") {
      compras.origen = "PROYECTO";
      unaBase.loadInto.dialog('/v3/views/compras/proyectos2.shtml?id=' + compras.id + '&from=oc', 'SELECCIONAR ' + etiqueta_negocio.toUpperCase(), 'large');
    } else if (origen == "PRESUPUESTO") {
      compras.origen = "PRESUPUESTO";
      unaBase.loadInto.dialog('/v3/views/compras/presupuestos2.shtml?id=' + compras.id + '&from=oc', 'SELECCIONAR PRESUPUESTO DE GASTOS', 'large');
    } else {
      compras.origen = "GASTO GENERAL";
      var idDtc = $('#sheet-compras input[name="tipo_doc[id]"]').val();
      $.ajax({
        'url': '/4DACTION/_v3_get_rows_compras',
        data: {
          "oc[rows][id_oc]": compras.id,
          "oc[rows][id_nv]": 0,
          "oc[rows][origen]": "GASTO GENERAL",
          "oc[rows][tipo]": "AMBOS",
          "oc[rows][cant_titulos]": cantTitulos,
          "oc[rows][correlativo]": correlativo,
          "oc[rows][tipo_doc][id]": idDtc
        },
        dataType: 'json',
        success: function (data) {
          add_items_oc(data);
          set_referencia_oc();
        }
      });
    }
    _validationOrigen();
    $(this).parentTo('ul').menu().hide();
    return false;
  });

  // Carga dtc
  $('button.show.dtc').click(function () {
    id_dtc_default_old = $('input[name="tipo_doc[id]"]').val();
    $('input[name="tipo_doc[descripcion]"]').autocomplete('search', '@').focus();




  });
  $('button.show.tipopago').click(function () {
    tipopago_default_old = $('input[name="tipo_pago[descripcion]"]').val();
    $('input[name="tipo_pago[descripcion]"]').autocomplete('search', '@').focus();
  });
  $('button.show.banco').click(function () {
    idbanco_default_old = $('input[name="tipo_pago[transferencia][id_banco]"]').val();
    $('input[name="tipo_pago[transferencia][nombre_banco]"]').autocomplete('search', '@').focus();
  });
  $('button.show.cuentas').click(function () {

    $('input[name="contact[cuenta]num"]').autocomplete('search', '@').focus();
  });
  $('button.show.tipocuenta').click(function () {
    tipocuenta_default_old = $('input[name="tipo_pago[transferencia][tipo_cuenta]"]').val();
    $('input[name="tipo_pago[transferencia][tipo_cuenta]"]').autocomplete('search', '@').focus();
  });

  $('input[name="tipo_pago[transferencia][nro_cuenta]"]').focus(function () {
    nrocuenta_default_old = $('input[name="tipo_pago[transferencia][nro_cuenta]"]').val();
  });

  $('input[name="tipo_pago[transferencia][mx_clabe]"]').focus(function () {
    mx_clabe_default_old = $('input[name="tipo_pago[transferencia][mx_clabe]"]').val();
  });

  $('input[name="tipo_doc[descripcion]"]').autocomplete({
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

      var tipo_gastos = $('input[name="oc[tipo_gastos][id]"]').val();
      var data = { 'tipo': tipo_gastos, 'id': ui.item.id, 'des': ui.item.des, 'imp_multiple': ui.item.imp_multiple };
      if (data.imp_multiple) {
        update_impuestos_multiples_view(data.id);
      } else {
        let extras = $('li.extra');

        if (extras.length > 0) {
          extras.remove();
        }

      }

      dtc_change(data);
      set_dtc_proveedor({ "dtc": ui.item.id, "prov": $('input[name="contacto[info][id]"]').val(), old: id_dtc_default_old });
      return false;
    }

  }).data('ui-autocomplete')._renderItem = function (ul, item) {
    return $('<li><a><span class="highlight">' + item.des + '</span></a></li>').appendTo(ul);
  };



  if (compras.newAccountingSystem) {
    $('input[name="contact[cuenta]num"]').autocomplete({
      source: function (request, response) {

        if (compras.newAccountingSystem) {
          let idContact = $('input[name="contacto[info][id]"]').val();
          $.ajax({
            url: '/4DACTION/_V3_getCuentasContacto',
            dataType: 'json',
            data: {
              "id": idContact

            },
            success: function (data) {

              response($.map(data.rows, function (item) {
                return item;
              }));


              if (data.rows.length == 0) {

                alert("Aun no ha agregado ninguna cuenta bancaria");

              }
            }
          });
        }
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

        let asig = "";
        let data = ui.item;

        if (data.asig == "oc") {
          asig = "Orden de compra";
        } else {
          if (data.asig == "fxr") {
            asig = "Rendición";
          } else {
            asig = "Adicional";
          }
        }


        $('input#cuenta_asig').val(asig);
        $('input[name="contact[cuenta]num"]').val("Cuenta " + data.accountId);
        $('input[name="tipo_pago[transferencia][tipo_cuenta]"]').val(data.accountType);
        $('input[name="tipo_pago[transferencia][nombre_banco]"]').val(data.bank);
        $('input[name="tipo_pago[transferencia][id_banco]"]').val(data.idBank);
        $('input[name="tipo_pago[transferencia][nro_cuenta]"]').val(data.accountNumber);
        $('input[name="tipo_pago[transferencia][mx_clabe]"]').val(data.accountMxClabe);


        return false;
      }

    }).data('ui-autocomplete')._renderItem = function (ul, item) {
      return $('<li><a><span class="highlight">Cuenta ' + item.accountId + '</span></a></li>').appendTo(ul);
    };
  }





  // Get cuenta contacto nueva
  $('button#add_cuenta').on('click', function () {
    let idContact = $('input[name="contacto[info][id]"]').val();

    $.ajax({
      url: '/4DACTION/_V3_getCuentasContacto',
      dataType: 'json',
      data: {
        "id": idContact,
        "numCuenta": "new"
      },
      success: function (data) {

        $('input[name="contact[cuenta]num"]').val("Cuenta " + data.rows[0].accountId);
        $('input[name="tipo_pago[transferencia][tipo_cuenta]"]').val(data.rows[0].accountType);
        $('input[name="tipo_pago[transferencia][nombre_banco]"]').val(data.rows[0].bank);
        $('input[name="tipo_pago[transferencia][id_banco]"]').val(data.rows[0].idBank);
        $('input[name="tipo_pago[transferencia][nro_cuenta]"]').val(data.rows[0].accountNumber);
        $('input[name="tipo_pago[transferencia][mx_clabe]"]').val(data.rows[0].accountMxClabe);


      }
    });
  });



  $('input[name="tipo_pago[descripcion]"]').autocomplete({
    source: function (request, response) {
      // var list = [
      //     { id: 'CH', des: 'CHEQUE' },
      //     { id: 'EF', des: 'EFECTIVO' },
      //     { id: 'TC', des: 'TARJETA DE CREDITO' },
      //     { id: 'PP', des: 'PAYPAL' },
      //     { id: 'VV', des: 'VALE VISTA'},
      //     { id: 'TR', des: 'TRANSFERENCIA' }
      // ];
      // response($.map(list, function(item) {
      //   return item;
      // }));



      $.ajax({
        // url: '/4DACTION/api_tipospago?page=1&results=10&q=&q2=&searchCheckbox=true&activo=true&egreso=true',
        url: '/4DACTION/_V3_getTipoPagos?egreso=true',
        data: {
          q: ''
        },
        dataType: 'json',
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
      
      var fields = [
        $('[name="contact[cuenta_asig]gasto"]').closest('li'),
        $('[name="contact[cuenta]num"]').closest('li'),
        $('[name="tipo_pago[transferencia][nombre_banco]"]').closest('li'),
        $('[name="tipo_pago[transferencia][tipo_cuenta]"]').closest('li'),
        $('[name="tipo_pago[transferencia][nro_cuenta]"]').closest('li'),
        $('[name="tipo_pago[transferencia][mx_clabe]"]').closest('li')
      ];

      var tipo_pago = $('input[name="oc[tipo_pago][descripcion]"]').val();
      var data = { 'id': ui.item.codigo, 'des': ui.item.text };
      tipopago_change(data);
      if (compras.newAccountingSystem == false) {
        set_tipopago_proveedor({ "tipopago": ui.item.text, "prov": $('input[name="contacto[info][id]"]').val(), old: tipopago_default_old });
      }
      
      if (validar_datos_bancarios == false) {
        if (ui.item.codigo_tipopago == 'TR') {
          $.each(fields, function (key, item) {
            item.removeClass('transferencia');
          });
        } else {
          $.each(fields, function (key, item) {
            item.addClass('transferencia');
          });
        }


      } else {
        $.each(fields, function (key, item) {
          item.removeClass('transferencia');
        });

      }
      return false;
    }

  }).data('ui-autocomplete')._renderItem = function (ul, item) {
    return $('<li><a><span class="highlight">' + item.text + '</span></a></li>').appendTo(ul);
  };

  $('input[name="tipo_pago[transferencia][nombre_banco]"]').autocomplete({
    source: function (request, response) {
      $.ajax({
        url: '/4DACTION/_V3_getBancos',
        data: {
          q: ''
        },
        dataType: 'json',
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
      // $('input[name="tipo_pago[transferencia][tipo_cuenta]"]').val('');
      // $('input[name="tipo_pago[transferencia][nro_cuenta]"]').val('');

      var tipo_pago = $('input[name="tipo_pago[transferencia][nombre_banco]"]');
      var data = { 'id': ui.item.id, 'des': ui.item.des };
      idbanco_change(data);
      if (compras.newAccountingSystem == false) {
        set_banco_proveedor({ "id_banco": ui.item.id, "prov": $('input[name="contacto[info][id]"]').val(), old: idbanco_default_old });
      }
      return false;
    }

  }).data('ui-autocomplete')._renderItem = function (ul, item) {
    return $('<li><a><span class="highlight">' + item.des + '</span></a></li>').appendTo(ul);
  };

  $('input[name="tipo_pago[transferencia][tipo_cuenta]"]').autocomplete({
    source: function (request, response) {
      $.ajax({
        url: '/4DACTION/_V3_getTiposCuentas?egreso=true',
        data: {
          q: ''
        },
        dataType: 'json',
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
      //$('input[name="tipo_pago[transferencia][nro_cuenta]"]').val('');

      var tipo_pago = $('input[name="oc[tipo_pago][descripcion]"]').val();
      var data = { 'id': ui.item.text, 'des': ui.item.text };
      tipocuenta_change(data);
      if (compras.newAccountingSystem == false) {
        set_tipocuenta_proveedor({ "tipo_cuenta": ui.item.text, "prov": $('input[name="contacto[info][id]"]').val(), old: tipocuenta_default_old });
      }
      return false;
    }

  }).data('ui-autocomplete')._renderItem = function (ul, item) {
    return $('<li><a><span class="highlight">' + item.text + '</span></a></li>').appendTo(ul);
  };

  $('input[name="tipo_pago[transferencia][nro_cuenta]"]').blur(function (event) {
    var tipo_pago = $('input[name="oc[tipo_pago][descripcion]"]').val();
    if (compras.newAccountingSystem == false) {
      set_nrocuenta_proveedor({ "nro_cuenta": $(event.target).val(), "prov": $('input[name="contacto[info][id]"]').val(), old: nrocuenta_default_old });
    }
  });

  $('input[name="tipo_pago[transferencia][mx_clabe]"]').blur(function (event) {
    var tipo_pago = $('input[name="oc[tipo_pago][descripcion]"]').val();
    if (compras.newAccountingSystem == false) {
      set_mx_clabe({ "mx_clabe": $(event.target).val(), "prov": $('input[name="contacto[info][id]"]').val(), old: mx_clabe_default_old });
    }

  });


  // Agregar items
  $('#sheet-compras table.items > tbody').on('click', 'button.add.item', function () {


    var current = $(this).parentTo('tr');
    var idnv = current.data('idnv');
    var origen = current.data('origen');
    var llave_titulo = current.data('llave');
    var cantTitulos = $('#sheet-compras table.items > tbody > tr[data-tipo="TITULO"]').length;
    var correlativo = $('#sheet-compras table.items > tbody > tr').length;
    while (!(current.next().html() == undefined || current.next().find('th').length > 0)) {
      current = current.next();
    }
    var idDtc = $('#sheet-compras input[name="tipo_doc[id]"]').val();
    $.ajax({
      'url': '/4DACTION/_v3_get_rows_compras',
      data: {
        "oc[rows][id_oc]": compras.id,
        "oc[rows][id_nv]": idnv,
        "oc[rows][origen]": origen,
        "oc[rows][tipo]": "SOLO ITEM",
        "oc[rows][cant_titulos]": cantTitulos,
        "oc[rows][llave_titulo]": llave_titulo,
        "oc[rows][correlativo]": correlativo,
        "oc[rows][tipo_doc][id]": idDtc
      },
      dataType: 'json',
      success: function (data) {
        add_items_oc(data);
      }
    });
  });

  //ELIMINAR ITEM
  containerItems.on('click', 'button.remove.item', function () {
    var target = $(this).parentTo('tr');
    var id_proyecto = target.data('nv');
    var llave = target.data('llave');
    var tipo = target.data('tipo');

    // verifica que el ítem no tenga monto justificado para poder ser quitado
    var remove = true;
    if (tipo == 'ITEM') {
      var monto = parseFloat(target.find('input[name="oc[detalle_item][justificado]"]').val());
      if (monto > 0) {
        remove = false;
      }
    } else {
      // si es tipo "TITULO"
      var monto = 0;
      var cantItemsJustificados = 0;
      containerItems.find('tr[data-llavetitulo="' + llave + '"]').each(function (key, item) {
        var valor = parseFloat($(this).find('input[name="oc[detalle_item][justificado]"]').val());
        monto += valor;
        if (valor > 0) {
          cantItemsJustificados++;
        }
      });
      if (monto > 0) {
        remove = false;
      }
    }

    if (remove) {
      $.ajax({
        url: '/4DACTION/_V3_setCompras',
        async: false,
        dataType: 'json',
        data: {
          "oc[id]": compras.id,
          "oc[negocio][id]": id_proyecto,
          "oc[delete_item][status]": "yes",
          "oc[delete_item][llave]": llave,
          "oc[delete_item][tipo]": tipo
        },
        success: function (data) {
          if (data.success) {
            $(target).fadeOut(400, function () {
              if (tipo == "TITULO") {
                $(this).remove();
                containerItems.find('tr[data-llavetitulo="' + llave + '"]').remove();
              } else {
                $(this).remove();
              }
              update_subtotal_items();
              set_referencia_oc();
              tablecompras();
            });
          } else {
            if (data.opened) {
              if (data.readonly)
                toastr.error('No fue posible eliminar el ítem. Otro usuario está bloqueando el registro.');
            } else {
              toastr.warning('Este ítem ya no existe. Probablemente ya fue removido por otro usuario. Se quitó de todos modos.');
              $(target).fadeOut(400, function () {
                if (tipo == "TITULO") {
                  $(this).remove();
                  containerItems.find('tr[data-llavetitulo="' + llave + '"]').remove();
                } else {
                  $(this).remove();
                }
                tablecompras();
              });
            }
          }
        },
        error: function (xhr, text, error) {
          toastr.error('Falló conexión al servidor.');
        }
      });
    } else {
      if (tipo == "TITULO") {
        if (cantItemsJustificados == 1) {
          toastr.warning('La categoría contiene un ítem que se encuentra justificado, no puede eliminarse.');
        } else {
          toastr.warning('La categoría contiene (' + cantItemsJustificados + ') ítems que se encuentran justificados, no puede eliminarse.');
        }
      } else {
        toastr.warning('El ítem se encuentra justificado, no puede eliminarse.');
      }
    }

  });

  //DUPLICAR ITEM
  containerItems.on('click', 'button.duplicate.item', function () {
    
    let target = $(this).parentTo('tr');
    let id_nv = target.data('nv');
    let llave = target.data('llave');
    let tipo = target.data('tipo');
    let id_oc = target.data('id');

    
    let config = {
      method: 'post',
      url: `${nodeUrl}/compras-actions?hostname=${location.origin}`,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: {
        id_oc,
        llave,
        'action': 'duplicate'
      }
    }


    axios(config)
      .then((data) => {

        add_items_oc(data.data);
      })
      .catch((err) => {
        toastr.warning(err.data.errorMsg);

      });
  });


  // Carga tipos gasto
  $('button.show.tiposg').click(function () {
    $('input[name="oc[tipo_gastos][des]"]').autocomplete('search', '@').focus();
  });
  $('input[name="oc[tipo_gastos][des]"]').autocomplete({
    source: function (request, response) {
      $.ajax({
        url: '/4DACTION/_V3_get_tipo_gasto',
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
      var inputFecha = $('input[name="oc[fecha_vcto]"]');
      $('input[name="oc[tipo_gastos][id]"]').val(ui.item.id);
      $('input[name="oc[tipo_gastos][des]"]').val(ui.item.text);
      if (ui.item.id == "FXR" || ui.item.id == "FTG") {
        var fecha = calcula_fecha_cierre_fxr();
        if (fecha == "00-00-0000") {
          inputFecha.val(fecha).prop("readonly", false);
        } else {
          inputFecha.val(fecha).prop("readonly", true);
        }
        //$('span[name="label-vencimientos"]').text("Fecha estimada de cierre");
        $('.obj-fxr').hide();
        var data = { 'tipo': 'FXR', 'id': '', 'des': '' };
        dtc_change(data);
      } else {
        // limpia campos al cambiar de tipo gasto a compra
        $('input[name="tipo_doc[descripcion]"]').val("");
        $('input[name="tipo_doc[id]"]').val("");
        $('table.items > tbody > tr[data-tipo="ITEM"] > td > input[name="oc[detalle_item][imp][id]"]').val("");
        $('table.items > tbody > tr[data-tipo="ITEM"] > td > input[name="oc[detalle_item][imp][id]"]').data('valorimp', "");
        $('table.items > tbody > tr[data-tipo="ITEM"] > td > input[name="oc[detalle_item][imp][id]"]').data('tipoimp', "");
        $('table.items > tbody > tr[data-tipo="ITEM"] > td > input[name="oc[detalle_item][imp][des]"]').val("");
        var formaPago = $('input[name="forma_pago[id]"]').val();
        var fecha = calcula_fecha_vcto_pago_oc(formaPago);
        //$('span[name="label-vencimientos"]').text("Vencimiento");
        inputFecha.val(fecha).prop("readonly", true);
        $('.obj-fxr').show();
      }
      oc_validate_fields();
      return false;
    }
  }).data('ui-autocomplete')._renderItem = function (ul, item) {
    return $('<li><a><strong class="highlight">' + item.text + '</strong></a></li>').appendTo(ul);
  };

  // Carga clasificaciones
  $('button.show.clasif').click(function () {
    $('input[name="oc[origen][clas][des]"]').autocomplete('search', '@').focus();
  });
  $('input[name="oc[origen][clas][des]"]').autocomplete({
    source: function (request, response) {
      $.ajax({
        url: '/4DACTION/_V3_get_clasif_gastos',
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
      $('input[name="oc[origen][clas][id]"]').val(ui.item.id);
      $('input[name="oc[origen][clas][des]"]').val(ui.item.des);
      return false;
    }
  }).data('ui-autocomplete')._renderItem = function (ul, item) {
    return $('<li><a><strong class="highlight">' + item.des + '</strong></a></li>').appendTo(ul);
  };

  //Cajón cliente(alias), cambiar nombre del campo según estado
  /*$('input[name="contacto[info][alias]"]').blur(function(event) {
    var target = $(this).parentTo('li');
    if ($(this).val() == '') {
      target.find('span:first-of-type').text('Buscar');
      target.parentTo('ul').find('li:nth-of-type(2) input').attr('placeholder', 'No se ha seleccionado proveedor...');
    } else {
      target.find('span:first-of-type').text('Proveedor (Alias)');
      target.parentTo('ul').find('li:nth-of-type(2) input').removeAttr('placeholder');
    }
  });*/

  _validationOrigen();

  get_items(compras.id);
  get_oc_dtc(compras.id);
  get_factoring_dtv(compras.id);
  get_oc_dtc_nc(compras.id);
  get_pagos_oc(compras.id);
  get_comprobantes_oc(compras.id);
  get_cobros_oc(compras.id);
  get_totales_gastos();

  $('#sheet-compras table.dtcs').bind('refresh', function () {
    get_oc_dtc(compras.id);
    get_oc_dtc_nc(compras.id);
    get_totales_gastos();
  });

  $('#sheet-compras table.pagos').bind('refresh', function () {
    get_pagos_oc(compras.id);
    get_totales_gastos();
  });

  $('#sheet-compras table.cobros').bind('refresh', function () {
    get_cobros_oc(compras.id);
    get_totales_gastos();
    if (compras.tipoGasto == 'FTG') {
      compras.getDetalleAsientos()
    }
  });

  // Set referencia si no está ingresada
  $('input[name="oc[referencia]"]').on("focusin blur", function () {
    if ($.trim($(this).val()) == "") {
      set_referencia_oc();
    }
  });

  // crear dtc
  var htmlObject;
  htmlObject = $('\
    <ul class="dropdown-menu-dtc" style="position: absolute; top: 25px; right: 0; z-index: 1000; min-width: 150px; text-align: left;"> \
      <li><a style="color:black!important" href="#" class="create-dtc items"><span class="ui-icon ui-icon-document"></span>Crear documento de compra</a></li> \
    </ul> \
  ');
  // <li><a style="color:black!important" href="#" class="move items"><span class="ui-icon ui-icon-transfer-e-w"></span>Mover ítem</a></li> \

  htmlObject.appendTo('table.items > thead > tr > th:last-of-type').menu().hide();
  $('button.actions.items').button({
    icons: {
      primary: 'ui-icon-triangle-1-s',
      secondary: 'ui-icon-gear'
    }
  }).click(function () {
    $('table.items > thead > tr > th:last-of-type > .dropdown-menu-dtc').toggle();
  })

  // Al dar click en una opción
  $('table.items > thead > tr > th:last-of-type a.items').click(function (event) {
    var target = $(event.target);
    if (target.hasClass('create-dtc')) {
      compras.addDtc();
    }
    event.preventDefault();
  });

  /*$('table.items > thead > tr > th:last-of-type a.items').click(function(event) {
    var target = $(event.target);
    if (target.hasClass('move')) {
      compras.moveItems();
    }
    event.preventDefault();
  });*/

  // open detail and profile item(added 03-03-15 by gin)
  $('section.sheet table > tbody').on('click', 'button.detail.item', function (event) {
    var id = $(this).closest('tr').data('llave');
    var llavenv = $(this).closest('tr').find('input[name="oc[detalle_item][llave_nv]"]').val();
    unaBase.loadInto.dialog('/v3/views/compras/detalle/content.shtml?id=' + id + '&llavenv=' + llavenv, 'Detalle del Ítem', 'large');
  });

  $('section.sheet table > tbody').on('click', 'button.profile.item', function () {
    var id = $(this).closest('tr').data('idservicio');
    unaBase.loadInto.dialog('/v3/views/catalogo/content.shtml?id=' + id, 'Perfil del Ítem', 'large');
  });

  $('.sc-full').bind("change blur click", function () {
    oc_checkout_text_full();
  });

  $('input[name="chk[sindicato]"]').change(function () {
    if ($(this).prop('checked')) {
      $('input[name="contrato[sindicato]"]').val('true');
    } else {
      $('input[name="contrato[sindicato]"]').val('false');
    }
  });

  // Impide ingresar categorías no existentes si no hay permiso
  $('table.items').on('blur', 'tbody th input[name="oc[detalle_item][nombre]"]', function (event) {
    contentLoaded = true;
    var element = this;
    if ($(element).parentTo('tr').find('[name="oc[detalle_item][nombre]"]').val().trim() == '')
      $(element).parentTo('tr').data('categoria', null);

    if (!$(element).parentTo('tr').data('categoria')) {
      // asdf
      if (!access._521) {
        $(element).parentTo('tr').find('[name="oc[detalle_item][nombre]"]').removeClass('edited').data('nombre-original', null);
        $(element).parentTo('tr').find('input').val('');
      } else {
        if ($(element).parentTo('tr').find('[name="oc[detalle_item][nombre]"]').val().trim() != '')
          confirm('La categoría &laquo;' + $(element).parentTo('tr').find('[name="oc[detalle_item][nombre]"]').val().trim() + '&raquo; no existe en el catálogo.\n\n¿Desea crearla?').done(function (data) {
            if (data)
              $.ajax({
                url: '/4DACTION/_V3_setCategoria',
                data: {
                  text: $(element).parentTo('tr').find('[name="oc[detalle_item][nombre]"]').val()
                },
                dataType: 'json',
                success: function (subdata) {
                  if (subdata.success) {
                    $(element).parentTo('tr').data('categoria', subdata.id);
                    toastr.info('Se ha agregado una nueva categoría al catálogo');
                  }
                }
              });
            else
              $(element).parentTo('tr').find('[name="oc[detalle_item][nombre]"]').val('');
          });

      }
    }
  });

  $('table.items').on('blur', 'tbody td input[name="oc[detalle_item][nombre]"]', function (event) {
    contentChanged = true;
    contentReady = false;
    var element = this;
    if (!$(element).prop('readonly')) {

      if ($(element).parentTo('tr').find('[name="oc[detalle_item][nombre]"]').val().trim() == '')
        $(element).parentTo('tr').data('idservicio', null);

      if (!$(element).parentTo('tr').data('idservicio')) {
        if (!access._521) {
          $(element).parentTo('tr').find('[name="oc[detalle_item][nombre]"]').removeClass('edited').data('nombre-original', null);
          $(element).parentTo('tr').find('[name="oc[detalle_item][nombre]"]').val('');
          $(element).parentTo('tr').find('input[name="oc[detalle_item][cantidad]"]').val(1);
        } else {
          if ($(element).parentTo('tr').find('[name="oc[detalle_item][nombre]"]').val().trim() != '')
            confirm('El ítem &laquo;' + $(element).parentTo('tr').find('[name="oc[detalle_item][nombre]"]').val().trim() + '&raquo; no existe en el catálogo.\n\n¿Desea crearlo?').done(function (data) {
              if (data)
                $.ajax({
                  url: '/4DACTION/_V3_setProductoByCategoria',
                  data: {
                    id: $(element).parentTo('tr').prevTo('tr.title').data('categoria'),
                    text: $(element).parentTo('tr').find('[name="oc[detalle_item][nombre]"]').val()
                  },
                  dataType: 'json',
                  success: function (subdata) {
                    if (subdata.success) {
                      $(element).parentTo('tr').data('idservicio', subdata.id);
                      $(element).parentTo('tr').find('[name="oc[detalle_item][nombre]"]').data('nombre-original', $(element).parentTo('tr').find('[name="oc[detalle_item][nombre]"]').val());
                      toastr.info('Se ha agregado un nuevo ítem al catálogo');
                    }
                  }
                });
              else
                $(element).parentTo('tr').find('[name="oc[detalle_item][nombre]"]').val('');
            });
        }

        var has_change =
          (
            $(element).parentTo('tr').find('[name="oc[detalle_item][nombre]"]').val() != $(element).parentTo('tr').find('[name="oc[detalle_item][nombre]"]').data('nombre-original')
          ) && (
            $(element).parentTo('tr').find('[name="oc[detalle_item][nombre]"]').data('nombre-original') != ''
          );

        if (has_change) {

          if (!$(element).parentTo('tr').hasClass('title')) {
            if ($(element).parentTo('tr').data('idservicio'))
              $(element).parentTo('tr').find('[name="oc[detalle_item][nombre]"]').addClass('edited');
          }

        } else
          $(element).parentTo('tr').find('[name="oc[detalle_item][nombre]"]').removeClass('edited');
      }
    }
  });

  var tipodtc = $('input[name="tipo_doc[descripcion]"]').val();
  if (tipodtc != "") {
    oc_cambia_titulo_box_dtc(tipodtc);
  }

  if (access._552) {
    $('button.unlock.contacto').remove();
    $('button.profile2.empresa').remove();
    $('button.profile.contacto').remove();
  }


  if (compras.tipoGasto == "FXR") {
    $('input[name="oc[tipo_gastos][des]"]').val(etiqueta_rendiciones);
  } else if (compras.tipoGasto == "FTG") {
    $('input[name="oc[tipo_gastos][des]"]').val('Factoring');
  }

  unaBase.ui.unblock();


  var content = "";
  $('td.tooltipsItem').tooltipster({
    content: content,
    contentAsHTML: true,
    contentCloning: false,
    interactive: true,
    maxWidth: 800,
    multiple: true
  });


  var loadTooltips = function (target, id, itemid) {

    var tooltipHtml = "";
    $.ajax({
      'url': '/4DACTION/_V3_getItemFromOc',
      data: {
        'detalle_id': itemid,
        'idOC': id
      },
      dataType: 'json',
      async: false,
      success: function (data) {

        var linea = $("[data-llave='" + itemid + "']");
        var porValidar = linea.find('input[name="oc[detalle_item][total]"]').val();

        var diferencia = data.presupuesto - data.gastoActual;
        var diferenciaValidado = data.presupuesto - data.gastoActual - parseFloat(porValidar);

        var venta = $.number(data.venta, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep);


        var presupuesto = $.number(data.presupuesto, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep);
        var gastoActual = $.number(porValidar, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep);
        var item = $.number(data.gastoActual, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep);
        var diferenciaf = $.number(diferencia, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep);
        var diferenciaValidadof = $.number(diferenciaValidado, compras.moneda.decimals, currency.decimals_sep, currency.thousands_sep);



        if (access._452) {
          var tdVenta = "<td class='rightNum'>" + venta + "</td>";
        }
        var tdPresupuesto = "<td class='rightNum'>" + presupuesto + "</td>";

        var tdGastoActual = "<td class='rightNum'>" + gastoActual + "</td>";


        var tdItem = "<td class='rightNum boldtext'>" + item + "</td>";

        if (parseFloat(diferenciaf) < 0) {

          var tdDiferencia = "<td  class='rightNum redTd'>" + diferenciaf + "</td>";
        } else {

          var tdDiferencia = "<td class='rightNum'>" + diferenciaf + "</td>";
        }
        if (parseFloat(diferenciaValidadof) < 0) {

          var tdDiferenciaValidado = "<td class='rightNum redTd'>" + diferenciaValidadof + "</td>";
        } else {

          var tdDiferenciaValidado = "<td class='rightNum'>" + diferenciaValidadof + "</td>";
        }




        if (access._452) {
          if (data.ocValidada) {
            tooltipHtml = "<table class='tabletooltip'>\
                        <thead>\
                            <tr>\
                                <th width='15%' class='blacknv'>Negocio\
                                </th>\
                                <th width='15%' class='blacknv'>Area de negocio\
                                </th>\
                                <th width='15%' class='blacknv'>Ítem\
                                </th>\
                                <th width='10%' class='blacknv'>Venta\
                                </th>\
                                <th width='10%' class='greynv'>Presupuestado\
                                </th>\
                                <th width='10%' class='orangenv'>Real Validado\
                                </th>\
                                <th width='10%' class='greennv'>Diferencia hoy\
                                </th>\
                            </tr>\
                        </thead>\
                        <tbody>\
                          <tr>\
                            <td>"+ data.negocio + "\
                            </td>\
                            <td>"+ data.nombre + "\
                            </td>\
                            </td>"+ tdVenta + tdPresupuesto + tdItem + tdDiferencia + "\
                            </td>\
                          </tr>\
                        </tbody>\
                        </table>";

          } else {
            tooltipHtml = "<table class='tabletooltip'>\
                        <thead>\
                            <tr>\
                                <th width='15%' class='blacknv'>Negocio\
                                </th>\
                                <th width='15%' class='blacknv'>Area de negocio\
                                </th>\
                                <th width='15%' class='blacknv'>Ítem\
                                </th>\
                                <th width='10%' class='blacknv'>Venta\
                                </th>\
                                <th width='10%' class='greynv'>Presupuestado\
                                </th>\
                                <th width='10%' class='orangenv'>Real Validado\
                                </th>\
                                <th width='10%' class='orange2nv'>Real + Pendiente de validar\
                                </th>\
                                <th width='10%' class='greennv'>Diferencia hoy\
                                </th>\
                                <th width='10%' class='greennv'>Diferencia Posterior\
                                </th>\
                            </tr>\
                        </thead>\
                        <tbody>\
                          <tr>\
                            <td>"+ data.negocio + "\
                            </td>\
                            <td>"+ data.areaNegocio + "\
                            </td>\
                            <td>"+ data.nombre + "\
                            </td>\
                            </td>"+ tdVenta + tdPresupuesto + tdItem + tdGastoActual + tdDiferencia + tdDiferenciaValidado + "\
                            </td>\
                          </tr>\
                        </tbody>\
                        </table>";

          }

        } else {
          if (data.ocValidada) {
            tooltipHtml = "<table class='tabletooltip'>\
                          <thead>\
                              <th width='15%' class='blacknv'>Negocio\
                              </th>\
                                <th width='15%' class='blacknv'>Area de negocio\
                                </th>\
                                <th width='15%' class='blacknv'>Ítem\
                                </th>\
                              <th width='10%' class='greynv'>Presupuestado\
                              </th>\
                              <th width='10%' class='orangenv'>Real Validado\
                              </th>\
                              <th width='10%' class='greennv'>Diferencia hoy\
                              </th>\
                            </tr>\
                          </thead>\
                        <tbody>\
                          <tr>\
                            <td>"+ data.negocio + "\
                            </td>\
                            <td>"+ data.areaNegocio + "\
                            </td>\
                            <td>"+ data.nombre + "\
                            </td>\
                            </td>"+ tdVenta + tdPresupuesto + tdItem + tdDiferencia + "\
                            </td>\
                          </tr>\
                        </tbody>\
                        </table>";


          } else {
            tooltipHtml = "<table class='tabletooltip'>\
                          <thead>\
                              <th width='15%' class='blacknv'>Negocio\
                              </th>\
                                <th width='15%' class='blacknv'>Area de negocio\
                                </th>\
                                <th width='15%' class='blacknv'>Ítem\
                                </th>\
                              <th width='10%' class='greynv'>Presupuestado\
                              </th>\
                              <th width='10%' class='orangenv'>Real Validado\
                              </th>\
                              <th width='10%' class='orange2nv'>Real + Pendiente de validar\
                              </th>\
                              <th width='10%' class='greennv'>Diferencia hoy\
                              </th>\
                              <th width='10%' class='greennv'>Diferencia Posterior\
                              </th>\
                            </tr>\
                          </thead>\
                        <tbody>\
                          <tr>\
                            <td>"+ data.negocio + "\
                            </td>\
                            <td>"+ data.areaNegocio + "\
                            </td>\
                            <td>"+ data.nombre + "\
                            </td>\
                            </td>"+ tdVenta + tdPresupuesto + tdItem + tdGastoActual + tdDiferencia + tdDiferenciaValidado + "\
                            </td>\
                          </tr>\
                        </tbody>\
                        </table>";

          }

        }
      }
    });

    if (access._1) {
      target.tooltipster('update', tooltipHtml);
    } else {
      target.tooltipster('update', "Negocio");
    }

  }

  $('button.noticecon').button({ icons: { primary: 'ui-icon-notice' }, text: false }).css({ "background": "transparent", "border": "none" });

  $('td.tooltipsItem').on('hover', function () {

    var tr = $(this).closest('tr');
    if (tr.data('origen') == "PROYECTO") {
      loadTooltips($(this), tr.data('id'), tr.data('llave'));
    } else {

      $(this).tooltipster('update', "Gasto General");
    }
  });

  unaBase.print.url({
    aliasfiles: 'OC_',
    entity: 'compras',
    preview: true,
    nullified: false,
    form: 'print',
    hostname: window.location.origin,
    folio: compras.folio,
    id: compras.id,
  });

  if (compras.cierreInfo.estado) {
    $("div.u-section-button-ajustes-impuesto").hide();
  }


  //Establecer fechas
  const setFechas = () => {
    if (compras.tipoGasto != "FTG") {
      const fechavcto1 = document.querySelector('input[name="oc[fecha_vcto]"]');
      const fechavcto2 = document.querySelector('input[name="oc[fecha_vcto2]"]');
      const fechavcto3 = document.querySelector('input[name="oc[fecha_vcto3]"]');

      const convertirFechaAFormatoISO = (fechaLocal) => {
        if (!fechaLocal) return '';
        const [day, month, year] = fechaLocal.split('-');
        return `${year}-${month}-${day}`; // convertir a aaaa-mm-dd
      };

      // Asignar valores iniciales de los inputs ocultos a los inputs de tipo 'date'
      if (fechavcto1.value) {
        document.getElementById('fecha_vcto').value = convertirFechaAFormatoISO(fechavcto1.value);
      }
      if (fechavcto2.value) {
        document.getElementById('fecha_vcto2').value = convertirFechaAFormatoISO(fechavcto2.value);
      }
      if (fechavcto3.value) {
        document.getElementById('fecha_vcto3').value = convertirFechaAFormatoISO(fechavcto3.value);
      }

      document.getElementById('fecha_vcto').addEventListener('change', (event) => {
        fechavcto1.value = event.target.value ? convertirFechaAFormatoISO(event.target.value) : '';
      });

      document.getElementById('fecha_vcto2').addEventListener('change', (event) => {
        fechavcto2.value = event.target.value ? convertirFechaAFormatoISO(event.target.value) : '';
      });

      document.getElementById('fecha_vcto3').addEventListener('change', (event) => {
        fechavcto3.value = event.target.value ? convertirFechaAFormatoISO(event.target.value) : '';
      });
    }
  };

  setFechas()


  compras.data.id_tipo_doc_sap = 20

  const deaccount = document.getElementById('deaccount')

  if (deaccount) {
    if (!access._682) deaccount.style.display = 'none'
    document.getElementById('deaccount').addEventListener('change', () => {
      console.log('ASD')
      unaBase.ui.block()
      
      $.ajax({
        'url': '/4DACTION/_force_deaccount',
        data: {
          "id_compra": compras.id,
        },
        async: false,
        dataType: 'json',
        success: function (data) {
          unaBase.ui.unblock()

          const tbody = document.querySelector('.comprobantes tbody');
          if (tbody) {
            tbody.innerHTML = '';
            toastr.success('Descontabilizado con exito!')
          }
        }
      });





    })

  }

  const deleteDtc = async (id, rowElement) => {
    try {
      let checkPagosResponse = await $.ajax({
        url: '/4DACTION/_V3_checkPagosDtc',
        data: { id: id },
        dataType: 'json',
      });

      unaBase.ui.unblock();

      if (checkPagosResponse.success) {
        let deleteDtcResponse = await $.ajax({
          url: '/4DACTION/_V3_setDtc',
          data: {
            "dtc[id]": id,
            delete: true
          },
          dataType: 'json',
        });

        unaBase.ui.unblock();

        if (rowElement) {
          rowElement.remove(); 
          toastr.success('Borrado con éxito!!');
        }
      } else {
        toastr.warning('El DTC ' + id + ' no se eliminó porque tiene pagos.');
      }
    } catch (error) {
      toastr.error('Error al realizar la operación.');
    }
  };

  // Función para seleccionar o deseleccionar todos los checkboxes
  document.querySelector('.all_dtc_docs')?.addEventListener('change', function () {
    const checkboxes = document.querySelectorAll('.dtcs tbody input[type="checkbox"]');
    checkboxes.forEach(function (checkbox) {
      checkbox.checked = document.querySelector('.all_dtc_docs').checked;
    });
  });

  // Agregar evento al botón fuera de la tabla
  document.querySelector('.delete-dtc-manual')?.addEventListener('click', async function () {
    const tbody = document.querySelector('.dtcs tbody');
    const checkboxes = tbody.querySelectorAll('input[type="checkbox"]:checked');

    if (checkboxes.length === 0) {
      toastr.warning('No hay DTCs seleccionados para eliminar.');
      return;
    }

    for (const checkbox of checkboxes) {
      const tr = checkbox.closest('tr');
      const id = tr.getAttribute('data-iddtc'); 

      if (id) {
        await deleteDtc(id, tr); 
      }
    }

    unaBase.loadInto.viewport('/v3/views/compras/content.shtml?id=' + compras.id);
  });



  //-----------------------------------
  //----------------------------------
  const importDialogCore = (() => {
    let capturedFileData = null;
    let selectedItemsLlaves = []; // Changed from single to array
    let loadedItems = [];
    let selectAllActive = false;

    const reveal = () => {
      document.getElementById('importOverlayCore').classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    const dismiss = () => {
      document.getElementById('importOverlayCore').classList.remove('active');
      document.body.style.overflow = '';

      setTimeout(() => {
        reinitialize();
      }, 300);
    };

    const reinitialize = () => {
      capturedFileData = null;
      selectedItemsLlaves = [];
      selectAllActive = false;
      document.getElementById('filePreviewCore').classList.remove('active');
      document.getElementById('uploadZoneCore').style.display = 'block';
      document.getElementById('processingViewCore').classList.remove('active');
      document.getElementById('importActionsCore').style.display = 'flex';
      document.getElementById('confirmBtnCore').disabled = true;
      document.getElementById('fileInputCore').value = '';
      document.getElementById('itemSelectorCore').classList.remove('active');
    };

    const captureFile = (event) => {
      const file = event.target.files[0];
      if (file) {
        capturedFileData = file;
        renderfilePreviewCore(file);
      }
    };

    const renderfilePreviewCore = (file) => {
      const fileNameEl = document.getElementById('fileNameCore');
      const fileSizeEl = document.getElementById('fileSizeCore');
      const fileEmblemEl = document.getElementById('fileEmblemCore');
      const previewContainer = document.getElementById('filePreviewCore');

      fileNameEl.textContent = file.name;
      fileSizeEl.textContent = calculateReadableSize(file.size);

      if (file.type.includes('pdf')) {
        fileEmblemEl.textContent = '📕';
      } else if (file.type.includes('image')) {
        fileEmblemEl.textContent = '🖼️';
      }

      previewContainer.classList.add('active');

      // Load items after showing file preview
      loadItems();
    };

    // Alias for backwards compatibility
    const renderFilePreview = renderfilePreviewCore;

    const loadItems = () => {
      const itemSelector = document.getElementById('itemSelectorCore');
      const itemsLoading = document.getElementById('itemsLoadingCore');
      const itemsList = document.getElementById('itemsListCore');
      const itemsError = document.getElementById('itemsErrorCore');

      // Show selector and loading state
      itemSelector.classList.add('active');
      itemsLoading.classList.add('active');
      itemsList.classList.remove('active');
      itemsError.classList.remove('active');

      // Get data-id from sheet element
      const sheetElement = document.querySelector('#sheet-compras');
      const dataId = sheetElement ? sheetElement.getAttribute('data-id') : null;

      if (!dataId) {
        itemsLoading.classList.remove('active');
        itemsError.classList.add('active');
        return;
      }

      $.ajax({
        url: `/4DACTION/_V3_get_items_compras?id_oc=${dataId}`,
        type: 'GET',
        dataType: 'json',
        success: (response) => {
          if (response.success === "1" && response.rows) {
            renderItems(response.rows);
            itemsLoading.classList.remove('active');
            itemsList.classList.add('active');
          } else {
            console.error('No items found');
            itemsLoading.classList.remove('active');
            itemsError.classList.add('active');
          }
        },
        error: (xhr, status, error) => {
          console.error('Error loading items:', error);
          itemsLoading.classList.remove('active');
          itemsError.classList.add('active');
        }
      });
    };

    const renderItems = (items) => {
      const itemsList = document.getElementById('itemsListCore');
      const selectAllBtn = document.getElementById('selectAllBtn');
      itemsList.innerHTML = '';

      // Filter only ITEM type (not TITULO)
      const itemsOnly = items.filter(item => item.tipo === 'ITEM');

      // Store items for later use
      loadedItems = itemsOnly;

      // Show select all button if more than 1 item
      if (itemsOnly.length > 1) {
        selectAllBtn.style.display = 'block';
      } else {
        selectAllBtn.style.display = 'none';
      }

      itemsOnly.forEach(item => {
        const card = document.createElement('div');
        card.className = 'atm-item-card';
        card.dataset.llave = item.llave;

        const formatCurrency = (value) => {
          return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0
          }).format(value);
        };

        card.innerHTML = `
        <div class="atm-item-title">${item.areaNegocio || 'Sin área'}</div>
        <div class="atm-item-name">${item.nombre}</div>
        <div class="atm-item-details">
            <div class="atm-item-detail">
                <strong>Código:</strong> ${item.cod_prod || 'N/A'}
            </div>
            <div class="atm-item-detail">
                <strong>Cantidad:</strong> ${item.cantidad}
            </div>
            <div class="atm-item-detail">
                <strong>Total:</strong> ${formatCurrency(item.total)}
            </div>
        </div>
        ${item.nro_nv ? `
            <div style="margin-top: 8px;">
                <span class="atm-item-badge atm-item-negocio">
                    Negocio #${item.nro_nv}
                </span>
                ${item.ref_nv ? `<span class="atm-item-badge">${item.ref_nv}</span>` : ''}
            </div>
        ` : ''}
      `;

        card.addEventListener('click', () => toggleItemSelection(card, item.llave));
        itemsList.appendChild(card);
      });

      if (itemsOnly.length === 0) {
        itemsList.innerHTML = '<div style="padding: 24px; text-align: center; color: var(--atm-text-secondary);">No hay ítems disponibles para justificar</div>';
      }
    };

    const toggleItemSelection = (cardElement, llave) => {
      const index = selectedItemsLlaves.indexOf(llave);

      if (index > -1) {
        // Deselect
        selectedItemsLlaves.splice(index, 1);
        cardElement.classList.remove('selected');
      } else {
        // Select
        selectedItemsLlaves.push(llave);
        cardElement.classList.add('selected');
      }

      // Update select all button state
      updateSelectAllButton();

      // Enable/disable import button
      document.getElementById('confirmBtnCore').disabled = selectedItemsLlaves.length === 0;
    };

    const toggleSelectAll = () => {
      const allCards = document.querySelectorAll('.atm-item-card');
      const selectAllBtn = document.getElementById('selectAllBtn');

      if (selectAllActive) {
        // Deselect all
        selectedItemsLlaves = [];
        allCards.forEach(card => card.classList.remove('selected'));
        selectAllBtn.classList.remove('active');
        selectAllBtn.textContent = 'Seleccionar todos';
        selectAllActive = false;
        document.getElementById('confirmBtnCore').disabled = true;
      } else {
        // Select all
        selectedItemsLlaves = loadedItems.map(item => item.llave);
        allCards.forEach(card => card.classList.add('selected'));
        selectAllBtn.classList.add('active');
        selectAllBtn.textContent = 'Deseleccionar todos';
        selectAllActive = true;
        document.getElementById('confirmBtnCore').disabled = false;
      }
    };

    const updateSelectAllButton = () => {
      const selectAllBtn = document.getElementById('selectAllBtn');
      if (selectedItemsLlaves.length === loadedItems.length && loadedItems.length > 0) {
        selectAllBtn.classList.add('active');
        selectAllBtn.textContent = 'Deseleccionar todos';
        selectAllActive = true;
      } else {
        selectAllBtn.classList.remove('active');
        selectAllBtn.textContent = 'Seleccionar todos';
        selectAllActive = false;
      }
    };

    const clearSelection = () => {
      capturedFileData = null;
      selectedItemsLlaves = [];
      selectAllActive = false;
      document.getElementById('filePreviewCore').classList.remove('active');
      document.getElementById('itemSelectorCore').classList.remove('active');
      document.getElementById('confirmBtnCore').disabled = true;
      document.getElementById('fileInputCore').value = '';
    };

    const calculateReadableSize = (bytes) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const executeImport = async () => {
      if (!capturedFileData) return;

      // Validate item selection
      if (selectedItemsLlaves.length === 0) {
        alert('Por favor selecciona al menos un ítem a justificar');
        return;
      }

      document.getElementById('uploadZoneCore').style.display = 'none';
      document.getElementById('importActionsCore').style.display = 'none';
      document.getElementById('processingViewCore').classList.add('active');

      try {
        // Get data-id from the sheet element
        const sheetElement = document.querySelector('#sheet-compras');
        const dataId = sheetElement ? sheetElement.getAttribute('data-id') : null;

        // Prepare form data for upload
        const formData = new FormData();
        formData.append('file', capturedFileData);

        if (dataId) {
          formData.append('id_oc', dataId);
        }

        formData.append('sid', unaBase.sid.encoded());

        // Send all selected items count
        formData.append('selected_items_count', selectedItemsLlaves.length);

        // Send all selected items details
        selectedItemsLlaves.forEach((llave, index) => {
          const selectedItemData = loadedItems.find(item => item.llave === llave);

          if (selectedItemData) {
            // Add each item with index prefix
            formData.append(`items[${index}][llave]`, selectedItemData.llave);
            formData.append(`items[${index}][nombre]`, selectedItemData.nombre);
            formData.append(`items[${index}][cod_prod]`, selectedItemData.cod_prod || '');
            formData.append(`items[${index}][cod_servicio]`, selectedItemData.cod_servicio || '');
            formData.append(`items[${index}][id_prod]`, selectedItemData.id_prod || '');
            formData.append(`items[${index}][cantidad]`, selectedItemData.cantidad);
            formData.append(`items[${index}][precio]`, selectedItemData.precio);
            formData.append(`items[${index}][dias]`, selectedItemData.dias);
            formData.append(`items[${index}][subtotal]`, selectedItemData.subtotal);
            formData.append(`items[${index}][descuento]`, selectedItemData.descuento);
            formData.append(`items[${index}][total]`, selectedItemData.total);
            formData.append(`items[${index}][id_nv]`, selectedItemData.id_nv || '');
            formData.append(`items[${index}][nro_nv]`, selectedItemData.nro_nv || '');
            formData.append(`items[${index}][ref_nv]`, selectedItemData.ref_nv || '');
            formData.append(`items[${index}][llave_nv]`, selectedItemData.llave_nv || '');
            formData.append(`items[${index}][nombre_llave_nv]`, selectedItemData.nombre_llave_nv || '');
            formData.append(`items[${index}][area_negocio]`, selectedItemData.areaNegocio || '');
            formData.append(`items[${index}][id_detalle]`, selectedItemData.id_detalle || '');
            formData.append(`items[${index}][id_clas]`, selectedItemData.id_clas || '');
            formData.append(`items[${index}][des_clas]`, selectedItemData.des_clas || '');
            formData.append(`items[${index}][tipo_imp]`, selectedItemData.tipo_imp || '');
            formData.append(`items[${index}][valor_imp]`, selectedItemData.valor_imp || '');
            formData.append(`items[${index}][id_imp]`, selectedItemData.id_imp || '');
            formData.append(`items[${index}][des_imp]`, selectedItemData.des_imp || '');
            formData.append(`items[${index}][cuenta_contable]`, selectedItemData.cuenta_contable || '');
            formData.append(`items[${index}][codigo_cuenta_contable]`, selectedItemData.codigo_cuenta_contable || '');
            formData.append(`items[${index}][codigo_sap]`, selectedItemData.codigo_sap || '');
            formData.append(`items[${index}][origen]`, selectedItemData.origen || '');
            formData.append(`items[${index}][lugar_origen]`, selectedItemData.lugar_origen || '');
            formData.append(`items[${index}][des_lugar_origen]`, selectedItemData.des_lugar_origen || '');
            formData.append(`items[${index}][llave_titulo]`, selectedItemData.llave_titulo || '');
            formData.append(`items[${index}][observacion_item]`, selectedItemData.observacion_item || '');
            formData.append(`items[${index}][correlativo_item_negocio]`, selectedItemData.correlativo_item_negocio || '');
          }
        });

        // Send file to backend for AI processing
        const response = await axios.post(nodeUrl + '/process-document', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        // Simulate additional processing time for UI feedback
        await new Promise(resolve => setTimeout(resolve, 1000));


        console.log('Document processed successfully:', response.data);

        dismiss();

        setTimeout(() => {
          unaBase.loadInto.viewport(
            "/v3/views/dtc/content.shtml?id=" + response.data.id_dtc,
            undefined,
            undefined,
            true
          );
        }, 300);

        toastr.success("Importado con exito!, considera revisar y guardar el documento")
      } catch (error) {
        dismiss();
        toastr.error("Error en la lectura del documento")
        reinitialize();
      }
    };

    const initializeDragDrop = () => {
      const dropSurface = document.getElementById('dropSurfaceCore');

      dropSurface.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropSurface.classList.add('dragover');
      });

      dropSurface.addEventListener('dragleave', () => {
        dropSurface.classList.remove('dragover');
      });

      dropSurface.addEventListener('drop', (e) => {
        e.preventDefault();
        dropSurface.classList.remove('dragover');

        const files = e.dataTransfer.files;
        if (files.length > 0) {
          const file = files[0];
          if (file.type.includes('pdf') || file.type.includes('image')) {
            capturedFileData = file;
            renderfilePreviewCore(file);
            document.getElementById('fileInputCore').files = files;
          } else {
            alert('Por favor selecciona un archivo PDF o imagen');
          }
        }
      });

      // Click to open file selector
      dropSurface.addEventListener('click', () => {
        document.getElementById('fileInputCore').click();
      });
    };

    const initializeFileInput = () => {
      const fileInput = document.getElementById('fileInputCore');
      fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
          capturedFileData = file;
          renderFilePreview(file);
        }
      });
    };

    const initializeButtons = () => {
      // Demo trigger button (optional - remove in production)
      const demoBtn = document.getElementById('demoTriggerBtn');
      if (demoBtn) {
        demoBtn.addEventListener('click', reveal);
      }

      // Close button
      const dismissBtn = document.getElementById('dismissTriggerBtn');
      dismissBtn.addEventListener('click', dismiss);

      // Cancel button
      const cancelBtn = document.getElementById('cancelActionBtn');
      cancelBtn.addEventListener('click', dismiss);

      // Confirm button
      const confirmBtn = document.getElementById('confirmBtnCore');
      confirmBtn.addEventListener('click', executeImport);

      // Remove file button
      const removeBtn = document.getElementById('removeFileTrigger');
      removeBtn.addEventListener('click', clearSelection);

      // Select all button
      const selectAllBtn = document.getElementById('selectAllBtn');
      if (selectAllBtn) {
        selectAllBtn.addEventListener('click', toggleSelectAll);
      }
    };

    const initializeOverlayEvents = () => {
      document.getElementById('importOverlayCore').addEventListener('click', (e) => {
        if (e.target === document.getElementById('importOverlayCore')) {
          dismiss();
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.getElementById('importOverlayCore').classList.contains('active')) {
          dismiss();
        }
      });
    };

    initializeDragDrop();
    initializeFileInput();
    initializeButtons();
    initializeOverlayEvents();

    return {
      reveal,
      dismiss,
      captureFile,
      clearSelection,
      executeImport,
      renderFilePreview
    };
  })();

  document.querySelector('.dtc-load-doc')?.addEventListener('click', async function () {
    importDialogCore.reveal()
  });




});
