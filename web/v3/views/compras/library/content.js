var get_element_oc = {
  titulo: function (functor, element, i) {
    var htmlObject;
    if (i.des_lugar_origen == "GASTO GENERAL" || i.des_lugar_origen == "OTROS GASTOS") {
      var nomTitulo = '<input class="sc-full" style="width:250px" name="oc[detalle_item][nombre]" type="search" value="' + i.nombre + '" placeholder="Buscar categoría por nombre...">';
      var addItem = '<button class="ui-icon ui-icon-circle-plus add item" title="Agregar ítem">';
    } else {
      var nomTitulo = '<input style="width:250px" name="oc[detalle_item][nombre]" type="text" value="' + i.nombre + '">';
      var addItem = '';
    }
    var idNeg = parseInt($('input[name="oc[negocio][id]"]').val());
    if (idNeg == 0) {
      $('input[name="oc[negocio][id]"]').val(i.id_nv);
    }

    var valoresOCultos = '<input type="hidden" name="oc[detalle_item][llave]" value="' + i.llave + '">' +
      '<input type="hidden" name="oc[detalle_item][tipo]" value="' + i.tipo + '">' +
      '<input type="hidden" name="oc[detalle_item][items]" value="' + i.items + '">' +
      '<input type="hidden" name="oc[detalle_item][idnv]" value="' + i.id_nv + '">' +
      '<input type="hidden" name="oc[detalle_item][origen]" value="' + i.origen + '">' +
      '<input type="hidden" name="oc[detalle_item][origen][lugar]" value="' + i.lugar_origen + '">' +
      '<input type="hidden" name="oc[detalle_item][origen][lugar][des]" value="' + i.des_lugar_origen + '">' +
      '<input type="hidden" name="oc[detalle_item][id_tipo_producto]" value="04">' +
      '<input type="hidden" name="oc[detalle_item][cod_producto]" value="' + i.cod_prod + '">' +
      '<input type="hidden" name="oc[detalle_item][id_producto]" value="' + i.id_prod + '">' +
      '<input type="hidden" name="oc[detalle_item][llave_nv]" value="' + i.llave_nv + '">' +
      '<input type="hidden" name="oc[detalle_item][id_clasif]" value="' + i.id_clas + '">' +
      '<input type="hidden" name="oc[detalle_item][des_clasif]" value="' + i.des_clas + '">' +
      '<input type="hidden" name="oc[detalle_item][llave_titulo]" value="' + i.llave_titulo + '">' +
      '<input type="hidden" name="oc[detalle_item][observacion_item]" value="' + $('<div />').text(i.observacion_item).html() + '">';


      var htmlObject = $(`
      <tr class="title"
          data-destit="${i.nombre}"
          data-nombre="${i.nombre}"
          data-categoria="${i.id_clas}"
          data-tipo="${i.tipo}"
          data-deslugarorigen="${i.des_lugar_origen}"
          data-idnv="${i.id_nv}"
          data-origen="${i.origen}"
          data-llave="${i.llave}">
          
        <th>
          ${valoresOCultos}
          <button class="ui-icon ui-icon-minus remove item" title="Quitar categoría"></button>
        </th>
        
        <th>${addItem}</th>
        <th colspan="2"></th>
        <th colspan="2">${nomTitulo}</th>
        <th></th>
        
        <th>
          <input type="hidden" name="oc[detalle_item][cantidad]" value="0">
        </th>
        
        <th class="columna-dias">
          <input type="hidden" name="oc[detalle_item][dias]" value="0">
        </th>
        
        <th>
          <input type="hidden" name="oc[detalle_item][precio]" value="0">
        </th>
        
        <th>
          <input type="hidden" name="oc[detalle_item][subtotal]" value="0">
        </th>
        
        <th>
          <input name="oc[detalle_item][dscto]" type="hidden" value="0">
        </th>
        
        <th>
          <input name="oc[detalle_item][total]" type="hidden" value="0">
        </th>
        
        <th></th>
        
        <!-- Columna COL-IVA oculta -->
        <th class="objfxr COL-IVA-IGV" style="display: none;"></th>
        
        <th></th>
      </tr>
    `);
    

    if (!mostrar_columna_dias) {
      $(".columna-dias").hide();
    }

    htmlObject[functor](element);

    htmlObject.focusin(function () {
      $(this).find('input[name="oc[detalle_item][nombre]"]').autocomplete({
        source: function (request, response) {
          $.ajax({
            url: '/4DACTION/_V3_' + 'getCategoria',
            dataType: 'json',
            data: {
              q: request.term
            },
            success: function (data) {
              response($.map(data.rows, function (item) {
                return item;
              }));
            },
            error: function (jqXHR, exception) {
              toastr.error('No se pudo cargar los datos. Error de conexión al servidor. Por favor, intente nuevamente.');
              htmlObject.find('input[name="oc[detalle_item][id_clasif]"]').val(0);
              htmlObject.find('input[name="oc[detalle_item][des_clasif]"]').val("");
              htmlObject.find('input[name="oc[detalle_item][nombre]"]').focus();
            }
          });
        },
        minLength: 0,
        delay: 0,
        position: { my: "left top", at: "left bottom", collision: "flip" },
        open: function () {
          $(this).removeClass('ui-corner-all').addClass('ui-corner-top');
        },
        close: function () {
          $(this).removeClass('ui-corner-top').addClass('ui-corner-all');
        },
        focus: function (event, ui) {
          $(this).val(ui.item.text);
          return false;
        },
        select: function (event, ui) {
          $(this).val(ui.item.text);
          htmlObject.data('categoria', ui.item.id);
          htmlObject.find('input[name="oc[detalle_item][id_clasif]"]').val(ui.item.id);
          htmlObject.find('input[name="oc[detalle_item][des_clasif]"]').val(ui.item.text);
          return false;
        }

      }).data('ui-autocomplete')._renderItem = function (ul, item) {
        return $('<li><a><strong>' + ((item.especial) ? 'Especial' : '') + '</strong><em>' + ((item.gasto_fijo) ? 'Gasto Fijo' : '') + '</em><span class="highlight">' + item.text + '</span></a></li>').appendTo(ul);
      };

    });

    htmlObject.focusout(function () {
      $(this).find('input[name="oc[detalle_item][nombre]"]').autocomplete('destroy');
    });

    return htmlObject;
  },
  item: function (functor, element, i) {

    var htmlObject;

    var precio = 0;
    if (i.precio == 0) {
      if (i.diferencia < 0) {
        precio = 0;
      } else {
        precio = i.diferencia;
      }
    } else {
      precio = i.precio;
    }

    var desOrigen = "";
    //let moduleOrigin = negocio_tipo_presupuesto ? 'presupuestos' : 'negocios';
    const tipo = compras.presupuesto_gasto ? compras.presupuesto_gasto : negocio_tipo_presupuesto
    let moduleOrigin = tipo ? 'presupuestos' : 'negocios';
    let nvId;
    
    if (i.origen == "PROYECTO") {
      nvId = i.id_nv;
      var titles = 'NEGOCIO #' + i.nro_nv + ' - ' + i.ref_nv + '/ Ítem: ' + i.nombre_llave_nv;
      if (i.des_lugar_origen == "OTROS GASTOS") {
        //var desOrigen = 'Neg. #'+i.nro_nv+' '+i.ref_nv+' '+'(Otros)';

        if (access._1) { // acceso modulo negocio
          desOrigen = '<a data-llave=' + i.llave_nv + ' style="text-transform:capitalize;font-weight:bold!important;font-size:10px!important;color:gray!important" class="tooltipsItem" style="text-transform:capitalize;font-size:10px!important" href="' + '//' + window.location.host + '/4DACTION/wbienvenidos#' + moduleOrigin + '/content.shtml?id=' + i.id_nv + '" target="_blank" style="cursor:pointer" titlee="' + titles + '">' + moduleOrigin.slice(0, -1).capitalize() + ' ' + i.nro_nv + ' (Otros)</a>';
        } else {
          desOrigen = '<label style="color:rgb(103,103,103)">Neg. Nro. ' + i.nro_nv + '</label>';
        }

      } else {

        //var desOrigen = 'Neg. #'+i.nro_nv+' '+i.ref_nv+' '+'(Item)';

        if (access._1) { // acceso modulo negocio
          desOrigen = '<a data-llave=' + i.llave_nv + ' style="text-transform:capitalize;font-weight:bold!important;font-size:10px!important;color:gray!important" class="tooltipsItem"  style="text-transform:capitalize;font-size:10px!important" href="' + '//' + window.location.host + '/4DACTION/wbienvenidos#' + moduleOrigin + '/content.shtml?id=' + i.id_nv + '" target="_blank" style="cursor:pointer" titlee="' + titles + '">' + moduleOrigin.slice(0, -1).capitalize() + i.nro_nv + ' (Item)<br>'+ '('+i.codigo_sap +')</a>';
        } else {
          desOrigen = '<label style="color:rgb(103,103,103)">Neg. Nro. ' + i.nro_nv + '</label>';
        }

      }
    } else if (i.origen == "PRESUPUESTO") {
      nvId = i.id_nv;
      var titles = 'PRESUP. #' + i.nro_nv + ' - ' + i.ref_nv + '/ Ítem: ' + i.nombre_llave_nv;
      if (i.des_lugar_origen == "OTROS GASTOS") {
        //var desOrigen = 'Neg. #'+i.nro_nv+' '+i.ref_nv+' '+'(Otros)';
        var desOrigen = '<a style="text-transform:capitalize;font-weight:bold!important;font-size:10px!important;color:gray!important" href="' + '//' + window.location.host + '/4DACTION/wbienvenidos#' + moduleOrigin + '/content.shtml?id=' + i.id_nv + '" target="_blank" style="cursor:pointer" title="' + titles + '">' + moduleOrigin.slice(0, -1).capitalize() + ' ' + i.nro_nv + ' (Otros)</a>';

      } else {
        //var desOrigen = 'Neg. #'+i.nro_nv+' '+i.ref_nv+' '+'(Item)';
        var desOrigen = '<a style="text-transform:capitalize;font-weight:bold!important;font-size:10px!important;color:gray!important" href="' + '//' + window.location.host + '/4DACTION/wbienvenidos#' + moduleOrigin + '/content.shtml?id=' + i.id_nv + '" target="_blank" style="cursor:pointer" title="' + titles + '">' + moduleOrigin.slice(0, -1).capitalize() + ' ' + i.nro_nv + ' (Item)</a>';

      }

    } else {
      var desOrigen = '<a >G.G</a>';
      //var desOrigen = 'GASTO GENERAL';
    }

    if (i.des_lugar_origen == "GASTO GENERAL" || i.des_lugar_origen == "OTROS GASTOS") {
      var nomItem = '<input class="sc-full filltext" style="width:200px" name="oc[detalle_item][nombre]" type="search" value="' + i.nombre + '" placeholder="Buscar servicio por nombre...">';
    } else {

      if ((i.nombre_item_negocio != "") && (i.nombre_item_negocio != i.nombre))
        var nomItem = '<input class="filltext" title="El nombre del ítem fue modificado" style="width:200px;color:blue" name="oc[detalle_item][nombre]" type="text" value="' + i.nombre + '">';
      else
        var nomItem = '<input class="filltext" style="width:200px" name="oc[detalle_item][nombre]" type="text" value="' + i.nombre + '">';

    }

    // var inputPos = '$ <span><input readonly class="restante-item" data-dif="'+i.dif+'" data-pos="0" type="text" value="0"></span>';


    i.valor_imp = i.valor_imp.replace(",", ".");
    let desImp = i.exento_linea_nv ? 'EXENTO' : i.des_imp
    let idImp = i.exento_linea_nv ? 3 : i.id_imp
    let valImp = i.exento_linea_nv ? 0 : i.valor_imp
    let tipoImp = i.exento_linea_nv ? 'EXENTO' : i.tipo_imp
    var impuesto = '<input style="inline-block;width:50px;font-size:10px" readonly name="oc[detalle_item][imp][des]" placeholder="Seleccionar impuesto" type="search" value="' + desImp + '">';
    impuesto = impuesto + '<button style="inline-block;width:20px" type="button" class="show impuestos">ver impuestos</button>';
    impuesto = impuesto + '<input data-valorimp="' + valImp + '" data-tipoimp="' + tipoImp + '" name="oc[detalle_item][imp][id]" type="hidden" value="' + idImp + '">';

    var valoresOCultos = '<input type="hidden" name="oc[detalle_item][llave]" value="' + i.llave + '">' +
      '<input type="hidden" name="oc[detalle_item][tipo]" value="' + i.tipo + '">' +
      '<input type="hidden" name="oc[detalle_item][items]" value="' + i.items + '">' +
      '<input type="hidden" name="oc[detalle_item][idnv]" value="' + i.id_nv + '">' +
      '<input type="hidden" name="oc[detalle_item][origen]" value="' + i.origen + '">' +
      '<input type="hidden" name="oc[detalle_item][origen][lugar]" value="' + i.lugar_origen + '">' +
      '<input type="hidden" name="oc[detalle_item][origen][lugar][des]" value="' + i.des_lugar_origen + '">' +
      '<input type="hidden" name="oc[detalle_item][id_tipo_producto]" value="04">' +
      '<input type="hidden" name="oc[detalle_item][cod_producto]" value="' + i.cod_prod + '">' +
      '<input type="hidden" name="oc[detalle_item][id_producto]" value="' + i.id_prod + '">' +
      '<input type="hidden" name="oc[detalle_item][llave_nv]" value="' + i.llave_nv + '">' +
      '<input type="hidden" name="oc[detalle_item][id_clasif]" value="' + i.id_clas + '">' +
      '<input type="hidden" name="oc[detalle_item][des_clasif]" value="' + i.des_clas + '">' +
      '<input type="hidden" name="oc[detalle_item][llave_titulo]" value="' + i.llave_titulo + '">' +
      '<input type="hidden" name="oc[detalle_item][observacion_item]" value="' + $('<div />').text(i.observacion_item).html() + '">';

    htmlObject = $('<tr data-id="' + i.id_oc + '" data-montoinicial="' + i.precio + '" data-itemid="' + i.llave_nv + '" data-idservicio="' + i.id_prod + '" data-nombre="' + i.nombre + '" data-refnv="' + i.ref_nv + '" data-nronv="' + i.nro_nv + '" data-tipo="' + i.tipo + '" data-nv="' + i.id_nv + '" data-llave="' + i.llave + '" data-deslugarorigen="' + i.des_lugar_origen + '" data-origen="' + i.origen + '" data-llavetitulo="' + i.llave_titulo + '" data-module="origen_' + moduleOrigin + '">' +
      '<td style="width:5%">' + valoresOCultos + '<button class="ui-icon ui-icon-minus remove item" title="Quitar ítem"></button> <button class="ui-icon ui-icon-copy duplicate item" title="Duplicar ítem"></button></td>' +
      '<td class="numeric code ' + ((habilitarCorrelativoNegEnGASTOS) ? 'no-counter' : '') + '" style="width:5%"><input name="oc[detalle_item][correlativo]" type="text" readonly value="' + ((habilitarCorrelativoNegEnGASTOS) ? i.correlativo_item_negocio : '') + '"></td>' +
      '<td class="" style="width:10%">' +i.codigo_cuenta_contable + '<br>' + i.cuenta_contable + '</td>' +
      '<td class="" style="width:10%">' + i.cod_prod + '</td>' +
      '<td class="left" style="width:22%">' + nomItem + '<button class="ui-icon ui-icon-document detail item" title="Detalle">Detalle</button><button class="profile item" title="Perfil"></button></td>' +
      '<td class="azul center tooltipsItem nvId" data-nv="' + nvId + '"  style="width:5%" title="' + i.areaNegocio + '">' + desOrigen + '</td>' +
      '<td class="objoc" style="width:10%">' + impuesto + '</td>' +
      '<td class="numeric center" style="width:5%"><input class="sc-full filltext" style="width:50px" name="oc[detalle_item][cantidad]" type="number" value="0"></td>' +
      '<td class="numeric center columna-dias" style="width:5%"><input class="sc-full filltext" style="width:50px" name="oc[detalle_item][dias]" type="number" value="0"></td>' +
      '<td class="numeric currency" style="width:9%"><label class="container-symbol-new">' + (compras.moneda.code != currency.code ? compras.moneda.code : currency.symbol) + ' </label><span><input class="sc-full filltext" style="width:70px" name="oc[detalle_item][precio]" type="text" value="0"></span></td>' +
      '<td class="numeric currency" style="width:9%"><label class="container-symbol-new">' + (compras.moneda.code != currency.code ? compras.moneda.code : currency.symbol) + ' </label></label><span><input style="width:70px" readonly name="oc[detalle_item][subtotal]" type="text" value="0"></span></td>' +
      '<td class="numeric currency" style="width:9%"><label class="container-symbol-new">' + (compras.moneda.code != currency.code ? compras.moneda.code : currency.symbol) + ' </label><span><input class="filltext" style="width:70px" name="oc[detalle_item][dscto]" type="text" value="0"></span></td>' +
      '<td class="numeric currency" style="width:9%"><label class="container-symbol-new">' + (compras.moneda.code != currency.code ? compras.moneda.code : currency.symbol) + ' </label><span><input style="width:70px" readonly name="oc[detalle_item][total]" type="text" value="0"></span></td>' +
      //'<td class="numeric currency costo restante-col-item">$ <span><input readonly name="oc[detalle_item][restante]" data-restante="'+i.restante+'" type="text" value="'+i.restante+'"></span></td>'+
      '<td class="numeric currency costo" style="width:9%"><label class="container-symbol-new">' + (compras.moneda.code != currency.code ? compras.moneda.code : currency.symbol) + ' </label><span><input style="width:70px" readonly name="oc[detalle_item][justificado]" type="text" value="0"></span></td>' +
      //'<td style="width:5%" class="objfxr COL-IVA-IGV"><input name="oc[detalle_item][select_igv_iva_text]" type="hidden" value="' + ((i.aplicaIGV_IVA) ? 'true' : 'false') + '"/><input name="oc[detalle_item][select_igv_iva]" class="select_igv_iva" type="checkbox" ' + ((i.aplicaIGV_IVA) ? 'checked' : '') + ' value="' + ((i.aplicaIGV_IVA) ? 'true' : 'false') + '"></td>' +
      '<td style="width:5%"><input name="oc[detalle_item][select]" type="checkbox" data-tipoimp="' + i.tipo_imp + '" data-selected=""></td>' +
      '</tr>');
    htmlObject[functor](element);

    // htmlObject.find('.numeric.currency input').number(true, 2, ',', '.');

    htmlObject.find('.numeric.currency input').number(true, currency.decimals, currency.decimals_sep, currency.thousands_sep);
    htmlObject.find('.numeric.percent input').number(true, 1, ',', '.');

    //set value numeric
    htmlObject.find('input[name="oc[detalle_item][cantidad]"]').val(i.cantidad);
    htmlObject.find('input[name="oc[detalle_item][dias]"]').val(i.dias);

    // agreagado by gin para oc en dolar
    if (compras.moneda.code != currency.code) {
      htmlObject.find('input[name="oc[detalle_item][precio]"]').val(parseFloat(precio) / compras.moneda.cambio);
      htmlObject.find('input[name="oc[detalle_item][precio]"]').data('oldprice', parseFloat(precio) / compras.moneda.cambio);
      htmlObject.find('input[name="oc[detalle_item][subtotal]"]').val(i.subtotal / compras.moneda.cambio);
      htmlObject.find('input[name="oc[detalle_item][dscto]"]').val(i.descuento / compras.moneda.cambio);
      htmlObject.find('input[name="oc[detalle_item][total]"]').val(i.total / compras.moneda.cambio);
      htmlObject.find('input[name="oc[detalle_item][justificado]"]').val(i.justificado / compras.moneda.cambio);
    } else {
      htmlObject.find('input[name="oc[detalle_item][precio]"]').val(parseFloat(precio));
      htmlObject.find('input[name="oc[detalle_item][precio]"]').data('oldprice', parseFloat(precio));
      htmlObject.find('input[name="oc[detalle_item][subtotal]"]').val(i.subtotal);
      htmlObject.find('input[name="oc[detalle_item][dscto]"]').val(i.descuento);
      htmlObject.find('input[name="oc[detalle_item][total]"]').val(i.total);
      htmlObject.find('input[name="oc[detalle_item][justificado]"]').val(i.justificado);
    }



    oc_checkout_text_full();

    if (!access._1) { // acceso modulo negocio
      htmlObject.find('button.tooltipsItem').hide();
    }

    // left = 37
    // up = 38
    // right = 39
    // down = 40

    // enter
    /*htmlObject.find('input[name="oc[detalle_item][nombre]"]').keydown(function(event) {

      // enter and arrow down
      if (event.which == 13 || event.which == 40) {
        var current = $(this).parentTo('tr');
        current.next().find('input[name="oc[detalle_item][nombre]"]').focus();
      }

      // arrow right
      if (event.which == 39 ) {
        var current = $(this).parentTo('tr');
        current.next().find('input[name="oc[detalle_item][cantidad]"]').focus();
      }

      // arrow left
      if (event.which == 37 ) {
        $(this).prev().find('input').focus();
      }

      // arrow up
      if (event.which == 38 ) {
        var current = $(this).parentTo('tr');
        current.prev().find('input[name="oc[detalle_item][nombre]"]').focus();
      }

    });*/

    // $('button.noticecon').button({icons: { primary: 'ui-icon-notice'}, text: false }).css({"background":"transparent", "border":"none"});




    if (!mostrar_columna_dias) {
      $(".columna-dias").hide();
    }


    $('button.show').button({ icons: { primary: 'ui-icon-carat-1-s' }, text: false });
    htmlObject.find('button.show.impuestos').click(function () {
      var currentRow = $(this).parentTo('tr');
      currentRow.find('input[name="oc[detalle_item][imp][des]"]').autocomplete('search', '@').focus();
    });

    htmlObject.focusin(function (event) {
      $(this).find('input[name="oc[detalle_item][nombre]"]').autocomplete({
        source: function (request, response) {
          $.ajax({
            url: '/4DACTION/_V3_' + 'getProductoByCategoria',
            dataType: 'json',
            data: {
              q: request.term,
              id: htmlObject.prevTo('.title').data('categoria')
            },
            success: function (data) {
              response($.map(data.rows, function (item) {
                return item;
              }));
            },
            error: function (jqXHR, exception) {
              toastr.error('No se pudo cargar los datos. Error de conexión al servidor. Por favor, intente nuevamente.');
              htmlObject.data('idservicio', 0);
              htmlObject.data('nombre', "");
              htmlObject.find('input[name="oc[detalle_item][id_producto]"]').val(0);
              htmlObject.find('input[name="oc[detalle_item][cod_producto]"]').val("");
              htmlObject.find('input[name="oc[detalle_item][nombre]"]').val("");
              htmlObject.find('input[name="oc[detalle_item][id_clasif]"]').val(0);
              htmlObject.find('input[name="oc[detalle_item][des_clasif]"]').val("");
              htmlObject.find('input[name="oc[detalle_item][nombre]"]').focus();

            }
          });
        },
        minLength: 0,
        delay: 0,
        position: { my: "left top", at: "left bottom", collision: "flip" },
        open: function () {
          $(this).removeClass('ui-corner-all').addClass('ui-corner-top');
        },
        close: function () {
          $(this).removeClass('ui-corner-top').addClass('ui-corner-all');
        },
        focus: function (event, ui) {
          // $(this).val(ui.item.text);
          return false;
        },
        select: function (event, ui) {
           

          var $row = htmlObject.closest('tr');

          console.log('INPUTS DE LA FILA:');
          console.log($row.find('input').serializeArray());

          $(this).val(ui.item.text);
          htmlObject.data('idservicio', ui.item.id);
          htmlObject.data('nombre', ui.item.text);
          htmlObject.find('input[name="oc[detalle_item][id_producto]"]').val(ui.item.id);
          htmlObject.find('input[name="oc[detalle_item][cod_producto]"]').val(ui.item.index);
          htmlObject.find('input[name="oc[detalle_item][id_clasif]"]').val(ui.item.categoria.id);
          htmlObject.find('input[name="oc[detalle_item][des_clasif]"]').val(ui.item.categoria.text);
          htmlObject.find('input[name="oc[detalle_item][cod_producto]"]').val(ui.item.index);

          // Modificar cuenta contable y Codigo de producto (index) solo visual:
          var $tdCuenta = $row.find('td').eq(2);
          var $tdIndex = $row.find('td').eq(3);
          $tdCuenta.text(ui.item.cuenta_contable_categoria);
          $tdIndex.text(ui.item.index);

          

          // Cargar la categoría automática al seleccionar el ítem
          //if (ui.item.idcategoria>0) {
          if (ui.item.categoria.id > 0) {
            var keyTitle = htmlObject.data('llavetitulo');
            var rowTitle = $('table.items > tbody > tr[data-llave="' + keyTitle + '"]');
            var idCat = rowTitle.find('input[name="oc[detalle_item][id_clasif]"]').val();
            var cantItemsCat = $('table.items > tbody > tr[data-llavetitulo="' + keyTitle + '"]').length;
            // Se carga categoría sólo si no hay ninguno seleccionado.
            if (idCat == 0 || cantItemsCat == 1) {
              //rowTitle.data('categoria', ui.item.idcategoria);
              //rowTitle.find('input[name="oc[detalle_item][nombre]"]').val(ui.item.categoria);
              //rowTitle.find('input[name="oc[detalle_item][id_clasif]"]').val(ui.item.idcategoria);
              //rowTitle.find('input[name="oc[detalle_item][des_clasif]"]').val(ui.item.categoria);
              rowTitle.data('categoria', ui.item.categoria.id);
              rowTitle.find('input[name="oc[detalle_item][nombre]"]').val(ui.item.categoria.text);
              rowTitle.find('input[name="oc[detalle_item][id_clasif]"]').val(ui.item.categoria.id);
              rowTitle.find('input[name="oc[detalle_item][des_clasif]"]').val(ui.item.categoria.text);
              
            }
          }

          set_referencia_oc();
          return false;
        }

      }).data('ui-autocomplete')._renderItem = function (ul, item) {
        return $('<li><a><strong>' + item.index + ' ' + ((item.gasto_fijo) ? '[Gasto Fijo]' : '') + ' ' + ((item.especial) ? '[Especial]' : '') + '</strong><em>' + item.categoria.text + '</em><span class="highlight">' + item.text + '</span></a></li>').appendTo(ul);
      };

      var element = $(this);
      var tipoDoc = $('[name="tipo_doc[id]"]').val();
      $(this).find('input[name="oc[detalle_item][imp][des]"]').autocomplete({
        source: function (request, response) {
          $.ajax({
            url: '/4DACTION/_V3_getImpuestos',
            dataType: 'json',
            data: {
              'dtc[id]': tipoDoc
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

          element.find('input[name="oc[detalle_item][imp][id]"]').val(ui.item.id);
          element.find('input[name="oc[detalle_item][imp][id]"]').data('valorimp', ui.item.valor);
          element.find('input[name="oc[detalle_item][imp][id]"]').data('tipoimp', ui.item.tipo);
          element.find('input[name="oc[detalle_item][imp][des]"]').val(ui.item.des);
          element.find('input[name="oc[detalle_item][imp][des]"]').autocomplete('destroy');

          update_subtotal_items();
          return false;
        }

      }).data('ui-autocomplete')._renderItem = function (ul, item) {
        return $('<li><a>' + item.des + '</a></li>').appendTo(ul);
      };

    });

    htmlObject.focusout(function (event) {
      oc_checkout_text_full();
      $(this).find('input[name="oc[detalle_item][nombre]"]').autocomplete('destroy');
    });

    htmlObject.find('input[name="oc[detalle_item][precio]"]').on("focus", function (event) {
      var decimals = currency.decimals + 2;
      $(event.target).unbind(".format");
      $(event.target).number(true, decimals, currency.decimals_sep, currency.thousands_sep);
      $(event.target).val(parseFloat($(event.target).data('oldprice')));
    });

    htmlObject.find('input[name="oc[detalle_item][precio]"]').on("blur", function (event) {
      
      $(event.target).data('oldprice', parseFloat($(event.target).val()));
      $(event.target).unbind(".format");
      $(event.target).number(true, currency.decimals, currency.decimals_sep, currency.thousands_sep);
    });

    htmlObject.find('td.numeric input').on("blur change", function () {
      calcula_por_filas($(this).closest('tr'));
    });

    htmlObject.find('.select_igv_iva').on("click", function (event) {
      if ($(this).prop('checked')) {
        htmlObject.find('input[name="oc[detalle_item][select_igv_iva_text]"]').val('true');
      } else {
        htmlObject.find('input[name="oc[detalle_item][select_igv_iva_text]"]').val('false');
      }
    });

    return htmlObject;
  }
};

