
var checkD = () => {
  let cant = $('tr:not(.title)  input[name="dtc[detalle_item][cantidad]"]')
  $.each(cant, (key, val) => {

    console.log($(val).prop('readonly'))
  })
}

var get_detail = {
  titulo: function (functor, element, i) {
    var htmlObject;
    var nomTitulo = '<input required name="dtc[detalle_item][nombre]" type="text" value="' + i.nombre + '" placeholder="Nombre de la Categoría...">';
    // var addItem = '<button class="ui-icon ui-icon-circle-plus add item" title="Agregar ítem">';
    var addItem = '';
    var valoresOCultos = '<input type="hidden" name="dtc[detalle_item][llave_det_oc]" value="' + i.llave_det_oc + '">' +
      '<input type="hidden" name="dtc[detalle_item][llave_det_dtc]" value="' + i.llave_det_dtc + '">' +
      '<input type="hidden" name="dtc[detalle_item][id_det_dtc]" value="' + i.id_det_dtc + '">' +
      '<input type="hidden" name="dtc[detalle_item][tipo]" value="' + i.tipo + '">' +
      '<input type="hidden" name="dtc[detalle_item][items]" value="' + i.items + '">' +
      '<input type="hidden" name="dtc[detalle_item][idoc]" value="' + i.id_oc + '">' +
      '<input type="hidden" name="dtc[detalle_item][idnv]" value="' + i.id_nv + '">' +
      '<input type="hidden" name="dtc[detalle_item][origen]" value="' + i.origen + '">' +
      '<input type="hidden" name="dtc[detalle_item][origen][lugar]" value="' + i.lugar_origen + '">' +
      '<input type="hidden" name="dtc[detalle_item][origen][lugar][des]" value="' + i.des_lugar_origen + '">' +
      '<input type="hidden" name="dtc[detalle_item][id_tipo_producto]" value="04">' +
      '<input type="hidden" name="dtc[detalle_item][cod_producto]" value="' + i.cod_prod + '">' +
      '<input type="hidden" name="dtc[detalle_item][id_producto]" value="' + i.id_prod + '">' +
      '<input type="hidden" name="dtc[detalle_item][llave_nv]" value="' + i.llave_nv + '">' +
      '<input type="hidden" name="dtc[detalle_item][id_clasif]" value="' + i.id_clas + '">' +
      '<input type="hidden" name="dtc[detalle_item][des_clasif]" value="' + i.des_clas + '">' +
      '<input type="hidden" name="dtc[detalle_item][llave_titulo]" value="' + i.llave_titulo + '">';

    var htmlObject = $(' \
          <tr class="title" data-id="'+ i.id_dtc + '" data-idoc="' + i.id_oc + '" data-nombre="' + i.nombre + '" data-categoria="0" data-tipo="' + i.tipo + '" data-deslugarorigen="' + i.des_lugar_origen + '" data-idnv="' + i.id_nv + '" data-origen="' + i.origen + '" data-llave="' + i.llave_det_dtc + '"> \
            <th>'+ valoresOCultos + '<button class="ui-icon ui-icon-minus remove item" title="Quitar categoría"></button></th> \
            <th>'+ addItem + '</th> \
            <th></th> \
            <th></th>\
            <th>'+ nomTitulo + '</th> \
            <th class="info"></th> \
            <th></th> \
            <th><input type="hidden" name="dtc[detalle_item][cantidad]" value="0"></th> \
            <th><input type="hidden" name="dtc[detalle_item][precio]" value="0"></th> \
            <th><input type="hidden" name="dtc[detalle_item][subtotal]" value="0"></th> \
            <th><input type="hidden" name="dtc[detalle_item][dscto]" value="0"></th> \
            <th><input type="hidden" name="dtc[detalle_item][total]" value="0"></th> \
            <th></th> \
          </tr> \
        ');

    htmlObject[functor](element);
    return htmlObject;
  },
  item: function (functor, element, i) {
    
    var htmlObject;
    var nomItem = '<input required name="dtc[detalle_item][nombre]" type="text" value="' + i.nombre + '" placeholder="Nombre del servicio...">';
    var inputPos = '';

    var impuesto = '<input name="dtc[detalle_item][imp][des]" placeholder="Seleccionar impuesto" type="text" value="' + i.des_imp + '">';
    i.valor_imp = i.valor_imp.replace(",", ".")
    // ini -- x gin -- 22-06-17 comentado, es muy riegoso dejar los impuratos abiertos al rendir
    impuesto = impuesto + '<input data-valorimp="' + i.valor_imp + '" data-tipoimp="' + i.tipo_imp + '" name="dtc[detalle_item][imp][id]" type="hidden" value="' + i.id_imp + '">';
    
    //REAPER   ---> Se abre el impuesto por peticion de victor
    // if (i.id_origen_gasto == "FXR") {
    //   impuesto = impuesto + '<button type="button" class="show impuestos">ver impuestos</button>';
    // }
      impuesto = impuesto + '<button type="button" class="show impuestos">ver impuestos</button>';
    
    // ini -- x gin -- 22-06-17 comentado, es muy riegoso dejar los impuratos abiertos al rendir
    
    var valoresOCultos = '<input type="hidden" name="dtc[detalle_item][llave_det_oc]" value="' + i.llave_det_oc + '">' +
      '<input type="hidden" name="dtc[detalle_item][llave_det_dtc]" value="' + i.llave_det_dtc + '">' +
      '<input type="hidden" name="dtc[detalle_item][id_det_dtc]" value="' + i.id_det_dtc + '">' +
      '<input type="hidden" name="dtc[detalle_item][tipo]" value="' + i.tipo + '">' +
      '<input type="hidden" name="dtc[detalle_item][items]" value="' + i.items + '">' +
      '<input type="hidden" name="dtc[detalle_item][idoc]" value="' + i.id_oc + '">' +
      '<input type="hidden" name="dtc[detalle_item][idnv]" value="' + i.id_nv + '">' +
      '<input type="hidden" name="dtc[detalle_item][origen]" value="' + i.origen + '">' +
      '<input type="hidden" name="dtc[detalle_item][origen][lugar]" value="' + i.lugar_origen + '">' +
      '<input type="hidden" name="dtc[detalle_item][origen][lugar][des]" value="' + i.des_lugar_origen + '">' +
      '<input type="hidden" name="dtc[detalle_item][id_tipo_producto]" value="04">' +
      '<input type="hidden" name="dtc[detalle_item][cod_producto]" value="' + i.cod_prod + '">' +
      '<input type="hidden" name="dtc[detalle_item][id_producto]" value="' + i.id_prod + '">' +
      '<input type="hidden" name="dtc[detalle_item][llave_nv]" value="' + i.llave_nv + '">' +
      '<input type="hidden" name="dtc[detalle_item][id_clasif]" value="' + i.id_clas + '">' +
      '<input type="hidden" name="dtc[detalle_item][des_clasif]" value="' + i.des_clas + '">' +
      '<input type="hidden" name="dtc[detalle_item][llave_titulo]" value="' + i.llave_titulo + '">';

    var origen_negocio = "";
    if (i.origen == "GASTO GENERAL") {
      origen_negocio = '<label>G.G</label>';
    } else {
      if (access._1) { // acceso modulo negocio
        origen_negocio = '<a style="text-transform:capitalize;font-size:10px!important;color:gray!important" href="' + '//' + window.location.host + '/4DACTION/wbienvenidos#negocios/content.shtml?id=' + i.id_nv + '" target="_blank" style="cursor:pointer">Neg. Nro. ' + i.nro_nv + '</a>';
      } else {
        origen_negocio = '<label>Neg. Nro. ' + i.nro_nv + '</label>';
      }
    }


    var origen_gasto = "";

    if (i.id_origen_gasto == "FXR") {
      if (access._508) { // acceso modulo fxr
        origen_gasto = '<a style="text-transform:capitalize;font-size:10px!important;color:gray!important" href="' + '//' + window.location.host + '/4DACTION/wbienvenidos#compras/content.shtml?id=' + i.id_oc + '" target="_blank" style="cursor:pointer">' + i.origen_oc + '</a>';
      } else {
        origen_gasto = '<label>' + i.origen_oc + '</label>';
      }
    } else if (i.id_origen_gasto == "OC") {
      if (access._4) { // acceso modulo oc
        origen_gasto = '<a style="text-transform:capitalize;font-size:10px!important;color:gray!important" href="' + '//' + window.location.host + '/4DACTION/wbienvenidos#compras/content.shtml?id=' + i.id_oc + '" target="_blank" style="cursor:pointer">' + i.origen_oc + '</a>';
      } else {
        origen_gasto = '<label>' + i.origen_oc + '</label>';
      }
    }else if(i.id_origen_gasto == "DTC"){
          origen_gasto = '<a style="text-transform:capitalize;font-size:10px!important;color:gray!important" href="' + '//' + window.location.host + '/4DACTION/wbienvenidos#dtc/content.shtml?id=' + i.id_dtcNc + '" target="_blank" style="cursor:pointer">'+ i.origen_oc +'</a>';
          origen_negocio = '<label></label>';
        } else {
      origen_gasto = '<label>' + i.origen_oc + '</label>';
    }
    

      if (dtc.moneda == undefined) {
        dtc.moneda = {
          code: (($('#sheet-dtc').data("moneda") != undefined) ? $('#sheet-dtc').data("moneda") : ""),
          cambio: (($('#sheet-dtc').data("valorcambio") != undefined) ? $('#sheet-dtc').data("valorcambio") : 1)
        }
      }

      var symbolito = currency.symbol;
      if (dtc.moneda.code != currency.code && dtc.moneda.code != "") {
        symbolito = dtc.moneda.code;
      }

      htmlObject = $('<tr data-id="' + i.id_dtc + '" data-contacod="' + i.conta_codigo_contable + '" data-contacc="' + i.conta_centro_costo + '" data-idoc="' + i.id_oc + '" data-idservicio="0" data-nombre="' + i.nombre + '" data-refnv="' + i.ref_nv + '" data-nronv="' + i.nro_nv + '" data-tipo="' + i.tipo + '" data-nv="' + i.id_nv + '" data-llave="' + i.llave_det_dtc + '" data-deslugarorigen="' + i.des_lugar_origen + '" data-origen="' + i.origen + '" data-llavetitulo="' + i.llave_titulo + '">' +
        '<td>' + valoresOCultos + '<button class="ui-icon ui-icon-minus remove item" title="Quitar ítem"></button></td>' +
        '<td ' + ((habilitarCorrelativoNegEnGASTOS) ? 'class="no-counter"' : '') + '><button class="ui-icon ui-icon-copy duplicate item" title="Duplicar ítem"></button> ' + ((habilitarCorrelativoNegEnGASTOS) ? '<input name="oc[detalle_item][correlativo]" type="text" readonly value="' + i.correlativo_item_negocio + '">&nbsp;&nbsp;' : '') + '</td>' +
        '<td>'+i.cuentactble_prod+'</td>' +
        '<td>'+i.cod_prod+'</td>' +
        '<td class="left">&nbsp;&nbsp;&nbsp;&nbsp;' + nomItem + ' <button style="' + ((!mostrarInfoContableDTC) ? 'display:none' : '') + '" class="ui-icon ui-icon-document detail item" title="Más info ítem"></button></td>' +
        '<td class="azul center"><div style="margin:3px;text-align:center">' + origen_gasto + '</div><div style="margin:3px;text-align:center">' + origen_negocio + '</div></td>' +
        '<td center style="padding:2px!important">' + impuesto + '</td>' +
        '<td class="numeric center" style="padding:2px!important"><input required style="width:100%!important" class="full" name="dtc[detalle_item][cantidad]" type="number" value="0"></td>' +
        '<td class="numeric currency center">' + symbolito + ' <span><input required style="200px!important" class="full" data-precioold="0" data-modificado="false" name="dtc[detalle_item][precio]" type="text" value="0"></span>' + ((tipo_gasto_asociado == "FXR") ? '<button class="calculadora" title="Calcular valor neto">Calculadora</button>' : '') + '</td>' +
        '<td class="numeric currency center">' + symbolito + ' <span><input readonly style="width:100%!important" name="dtc[detalle_item][subtotal]" type="text" value="0"></span></td>' +
        '<td class="numeric currency center">' + symbolito + ' <span><input style="width:100%!important" name="dtc[detalle_item][dscto]" type="text" value="0"></span></td>' +
        '<td class="numeric currency center">' + symbolito + ' <span><input style="width:100%!important" readonly name="dtc[detalle_item][total]" data-justificado="0" type="text" value="0"></span></td>' +
        // '<td><input '+ ((i.no_considerar_como_gr)? 'checked' : '') +' title="Al marcarse la opción el ítem no será considerado como gasto real en el negocio" type="checkbox" name="dtc[detalle_item][considerar_gasto]"></td>'+                                  
        '<td></td>' +
        '</tr>');

      htmlObject[functor](element);

      // htmlObject.find('.numeric.currency input').number(true, 2, ',', '.');
      // htmlObject.find('.numeric.percent input').number(true, 1, ',', '.');

      htmlObject.find('.numeric.currency input').number(true, currency.decimals, currency.decimals_sep, currency.thousands_sep);
      htmlObject.find('.numeric.percent input').number(true, 1, ',', '.');

      // agreagado by gin para dtc en dolar
      // if (dtc.moneda.code != currency.code && dtc.moneda.code != "") {
      //   htmlObject.find('input[name="dtc[detalle_item][cantidad]"]').val(i.cantidad);
      //   htmlObject.find('input[name="dtc[detalle_item][cantidad]"]').data("cantidadold", i.cantidad);
      //   htmlObject.find('input[name="dtc[detalle_item][precio]"]').val(i.precio / dtc.moneda.cambio);
      //   htmlObject.find('input[name="dtc[detalle_item][precio]"]').data("precioold", i.precio / dtc.moneda.cambio);
      //   htmlObject.find('input[name="dtc[detalle_item][precio]"]').data('oldprice', parseFloat(i.precio / dtc.moneda.cambio));
      //   htmlObject.find('input[name="dtc[detalle_item][subtotal]"]').val(i.subtotal / dtc.moneda.cambio);
      //   htmlObject.find('input[name="dtc[detalle_item][dscto]"]').val(i.descuento / dtc.moneda.cambio);
      //   htmlObject.find('input[name="dtc[detalle_item][total]"]').val(i.total / dtc.moneda.cambio);
      // } else {
        htmlObject.find('input[name="dtc[detalle_item][cantidad]"]').val(i.cantidad);
        htmlObject.find('input[name="dtc[detalle_item][cantidad]"]').data("cantidadold", i.cantidad);
        htmlObject.find('input[name="dtc[detalle_item][precio]"]').val(i.precio);
        htmlObject.find('input[name="dtc[detalle_item][precio]"]').data("precioold", i.precio);
        htmlObject.find('input[name="dtc[detalle_item][precio]"]').data('oldprice', parseFloat(i.precio));
        htmlObject.find('input[name="dtc[detalle_item][subtotal]"]').val(i.subtotal);
        htmlObject.find('input[name="dtc[detalle_item][dscto]"]').val(i.descuento);
        htmlObject.find('input[name="dtc[detalle_item][total]"]').val(i.total);
     // }

      // verifica tipo para ocultar calculadora
      if (i.tipo_imp != "IVA" && i.tipo_imp != "IVA MULTIPLE") {
        htmlObject.find('.calculadora').hide();
      }

      // ini -- 22-06-17 x gin oculta duplicado, es un riego tener la opción abierta
      // if (i.id_origen_gasto != "FXR") {
      //   htmlObject.find('button.duplicate').hide();
      // }

      // fin -- 22-06-17 x gin oculta duplicado, es un riego tener la opción abierta

      // calculadora
      htmlObject.find('button.calculadora').button({ icons: { primary: 'ui-icon-calculator' }, text: false, classes: { "ui-button": "highlight" } }).click(function () {
        
        var htmlObjectItem = $(this).closest("tr");
        var tipo_imp = htmlObjectItem.find('input[name="dtc[detalle_item][imp][id]"]').data("tipoimp");
        if (tipo_imp == "IVA") {
          var modificado = htmlObjectItem.find('input[name="dtc[detalle_item][precio]"]').data("modificado");
          var montoold = parseFloat(htmlObjectItem.find('input[name="dtc[detalle_item][precio]"]').data("precioold"));
          if (!modificado) {
            var monto_actual = parseFloat(htmlObjectItem.find('input[name="dtc[detalle_item][precio]"]').val());
            // var monto_impuesto = monto_actual * 0.19;
            // 
            var monto_impuesto = monto_actual * (ivaRate / 100);
            var nuevomonto = monto_actual - monto_impuesto;
            htmlObjectItem.find('input[name="dtc[detalle_item][precio]"]').val(nuevomonto);
            htmlObjectItem.find('input[name="dtc[detalle_item][precio]"]').data("modificado", true);
          } else {
            htmlObjectItem.find('input[name="dtc[detalle_item][precio]"]').val(montoold);
            htmlObjectItem.find('input[name="dtc[detalle_item][precio]"]').data("modificado", false);
            nuevomonto = montoold;
          }
          var cantidad = parseFloat(htmlObjectItem.find('input[name="dtc[detalle_item][cantidad]"]').val());
          var dscto = parseFloat(htmlObjectItem.find('input[name="dtc[detalle_item][dscto]"]').val());
          var subtotal = roundTwo(cantidad * nuevomonto);
          var total = roundTwo(subtotal - dscto);
          htmlObjectItem.find('input[name="dtc[detalle_item][subtotal]"]').val(subtotal);
          htmlObjectItem.find('input[name="dtc[detalle_item][total]"]').val(total);
          dtc.montos.totales();
        }
      });
     
     $('button.show').button({ icons: { primary: 'ui-icon-carat-1-s' }, text: false });


     //REAPER ---> se quita restriccion por peticion de victor
      // if (i.id_origen_gasto == "FXR") {
        htmlObject.find('button.show.impuestos').click(function () {
          var currentRow = $(this).parentTo('tr');
          currentRow.find('input[name="dtc[detalle_item][imp][des]"]').autocomplete('search', '@').focus();
        });
      // }

      // open detalle item, agregado el 6-8-19, gin
      htmlObject.find('button.detail.item').click(function () {
        let currentRow = $(this).parentTo('tr');
        let cod = currentRow.data('contacod');
        let cc = currentRow.data('contacc');
        let llave = currentRow.find('input[name="dtc[detalle_item][llave_det_dtc]"]').val();

        var htmlObjectItemDet = $('<section> \
        <h6 style="text-decoration:underline;font-weight:bold;">INFO CONTABLE</h6> \
        <div style="margin-top:5px;"><label style="margin-left:10px;diplay:inline-block;">Código contable </label><input style="background-color:lightyellow;border:1px solid gray;padding:2px;" name="conta_codigo_contable" value="'+ cod + '"></div> \
        <div style="margin-top:3px;"><label style="margin-left:32px;diplay:inline-block;">Centro costo </label><input style="background-color:lightyellow;border:1px solid gray;padding:2px;" name="conta_centro_costo" value="'+ cc + '"></div> \
      </section>');

        prompt(htmlObjectItemDet, "Guardar", "Cancelar").done(function (data) {
          if (data !== false) {
            let cod = htmlObjectItemDet.find('input[name="conta_codigo_contable"]').val();
            let cc = htmlObjectItemDet.find('input[name="conta_centro_costo"]').val();
            $.ajax({
              url: '/4DACTION/_V3_setItemsDtcExpress',
              data: {
                'id': llave,
                'conta_codigo_contable': cod,
                'conta_centro_costo': cc
              },
              dataType: 'json',
              success: function (data) {
                if (data.success) {
                  toastr.success("Datos actualizados con éxito.");
                  currentRow.data('contacod', cod);
                  currentRow.data('contacc', cc);
                } else {
                  toastr.error('No fue posible actualizar. Intentar nuevamente.');
                }
              }
            });
          }
        });

      });

      htmlObject.focusin(function () {
        dtc.items.search(htmlObject);
      });

      htmlObject.focusout(function () {
        $(this).find('input[name="dtc[detalle_item][nombre]"]').autocomplete('destroy');
      });

      htmlObject.find('input[name="dtc[detalle_item][precio]"]').on("focus", function (event) {
        var decimals = currency.decimals + 2;
        $(event.target).unbind(".format");
        $(event.target).number(true, decimals, currency.decimals_sep, currency.thousands_sep);
        $(event.target).val(parseFloat($(event.target).data('oldprice')));
      });

      htmlObject.find('input[name="dtc[detalle_item][precio]"]').on("blur", function (event) {

        //check cambio de cantidad deja montos por encima del DTC
        let parent = $(this).parentTo('tr');
        let oldPrice = $(event.target).data('oldprice');
        let newPrice = parseFloat($(event.target).val());
        let quantity = parseFloat(parent.find('input[name="dtc[detalle_item][cantidad]"]').val());
        let dscto = parseFloat(parent.find('input[name="dtc[detalle_item][dscto]"]').val());

        //todo check valor de la linea
        if (dtc.data.isNc & (newPrice > oldPrice)) {

          $(event.target).val(oldPrice);
          parent.find('input[name="dtc[detalle_item][subtotal]"]').val(oldPrice * quantity);
          parent.find('input[name="dtc[detalle_item][total]"]').val((oldPrice * quantity) - dscto);


          dtc.montos.items(parent);

          alert('Has ingresado un monto mayor al disponible por descontar de la linea.');
        }


        $(event.target).data('oldprice', parseFloat($(event.target).val()));
        $(event.target).unbind(".format");
        $(event.target).number(true, currency.decimals, currency.decimals_sep, currency.thousands_sep);

      });

      return htmlObject;
    }
  };

