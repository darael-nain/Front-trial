
var notas = {
  "container": $('#sheet-notas'),
  "containerItems": $('#sheet-notas').find('table.items.nc > tbody'),
  "menubar": $('#menu ul'),
  init: function (id) {
    $.ajax({
      'url': '/4DACTION/_V3_proxy_getNcVentasContent',
      data: {
        "id": id,
        "api": true
      },
      dataType: 'json',
      async: false,
      success: function (data) {
        notas.data = data;
      }
    });
    notas.id = notas.data.id;
    notas.itemsValoresIniciales = notas.data.items;

    $('[data-name="tipo_documento"]').text(notas.data.des_tipo_doc);
    $('[data-name="folio"]').text(notas.data.folio);
    $('[data-name="fecha_emision"]').text(notas.data.fecha_emision);
    $('[data-name="referencia"]').text(notas.data.referencia);
    $('[data-name="estado"]').text(notas.data.estado);
    $('[data-name="login_registro"]').text(notas.data.login_registro);
    $('[data-name="fecha_registro"]').text(notas.data.fecha_registro);
    $('[data-name="hora_registro"]').text(notas.data.hora_registro);
    $('[data-name="motivo-nc"]').text(notas.data.motivo);

    if (notas.data.motivo_sunat != "") {
      $('[data-name="motivo-nc-sunat"]').text(notas.data.motivo_sunat);
    } else {
      $('.box-motivo-sunat').hide();
    }

    $('[name="referencia"]').val(notas.data.referencia);
    $('[name="des_tipo_doc"]').val(notas.data.des_tipo_doc);
    $('[name="id_tipo_doc"]').val(notas.data.id_tipo_doc);
    $('[name="folio"]').val(notas.data.folio);
    $('[name="fecha_emision"]').val(notas.data.fecha_emision);

    $('[data-name="alias"]').text(notas.data.cliente.alias);
    $('[data-name="razon"]').text(notas.data.cliente.razon);
    $('[data-name="contacto"]').text(notas.data.relacionado.nombre);
    $('[name="contacto[info][alias]"]').val(notas.data.cliente.alias);
    $('[name="contacto[info][id]"]').val(notas.data.cliente.id);
    $('[name="contacto[info][razon_social]"]').val(notas.data.cliente.razon);
    $('[name="contacto[info][rut]"]').val(notas.data.cliente.rut + "-" + notas.data.cliente.dv);
    $('[name="contacto[info][giro]"]').val(notas.data.cliente.giro);

    $('[name="relacionado[info][id]"]').val(notas.data.relacionado.id);
    $('[name="relacionado[info][nombre]"]').val(notas.data.relacionado.nombre);
    $('[name="relacionado[info][cargo]"]').val(notas.data.relacionado.cargo);
    $('[name="relacionado[info][email]"]').val(notas.data.relacionado.email);

    $('[name="fecha_vencimiento"]').val(notas.data.fecha_vencimiento);
    $('[name="sub_total"]').val(notas.data.montos.sub_total);
    $('[name="porc_descuento"]').val(notas.data.montos.porc_descuento);
    $('[name="descuento"]').val(notas.data.montos.descuento);
    $('[name="exento"]').val(notas.data.montos.exento);
    $('[name="neto"]').val(notas.data.montos.neto);
    $('[name="impuesto"]').val(notas.data.montos.iva);
    $('[name="adicional"]').val(notas.data.montos.adicional);
    $('[name="total"]').val(notas.data.montos.total);
    $('[name="total_por_cobrar"]').val(notas.data.montos.total);

    // agregado 28-8-19, by gin, caso peru
    if (currency.code == "PEN" && notas.data.exchange.type == "USD") {
      $('.exchange-section').show();
      $('input[name="exchange[rate]"]').val(notas.data.exchange.rate);
      $('input[name="exchange[monto]"]').val(notas.data.exchange.monto);
      $('.label-curency-total').text('$');
    }

    // $('[name="observacion"]').val(notas.data.observacion);
    notas.container.find('.numeric.currency input').number(true, currency.decimals, currency.decimals_sep, currency.thousands_sep);
    notas.loadItems(notas.data.items);
    notas.display();
  },
  menu: function () {
    unaBase.toolbox.init();
    unaBase.toolbox.menu.init({
      entity: 'NcVentas',
      buttons: ['save', 'exit', 'delete', 'preview', 'dtv_nc_emitir_manual', 'dtv_nc_emitir_electronico', 'dtv_nc_pdf_electronico', 'emitir-modo-pe-FA_NC', 'dtv_pdf_electronico_FEPE_NC', 'dtv_nc_emitir_bsale', 'dtv_pdf_electronico_bsale'],
      data: function () {
        notas.data.id_tipo_doc = $('[name="id_tipo_doc"]').val();
        notas.data.des_tipo_doc = $('[name="des_tipo_doc"]').val();

        // notas.data.observacion =  $('[name="observacion"]').val();
        /*if (notas.data.motivo == "CORRECCION DE MONTO") {
          let bodyItemsNC = $('table.items.nc > tbody');
          let ITEMSNC = bodyItemsNC.find('tr[data-tipo="ITEM"]');
          ITEMSNC.each(function(key, item){
            let llave = $(this).data('id');
            let cantidad = $(this).find('input[name="det_cantidad"]').val();
            let precio = $(this).find('input[name="det_precio"]').val();
            eval("obj = { 'ITEMS[ID]["+ llave +"]': '" + llave + "' }");
            $.extend(notas.data, notas.data, obj);
            eval("obj = { 'ITEMS[CANT]["+ llave +"]': '" + cantidad + "' }");
            $.extend(notas.data, notas.data, obj);
            eval("obj = { 'ITEMS[PRECIO]["+ llave +"]': '" + precio + "' }");
            $.extend(notas.data, notas.data, obj);
          });

        }*/
        return notas.data;
      },
      validate: function () {
        return true;
      }
    });
  },
  display: function () {

    // setTimeout(function(){

    notas.menubar.find('li[data-name="delete"]').hide();
    notas.menubar.find('li[data-name="dtv_nc_emitir_manual"]').hide();
    notas.menubar.find('li[data-name="dtv_emitir_bsale"]').hide();

    notas.container.find('input.edit').prop('readonly', true);
    notas.containerItems.find('input.edit').prop('readonly', true);

    // CL
    notas.menubar.find('li[data-name="dtv_nc_emitir_electronico"]').hide();
    notas.menubar.find('li[data-name="dtv_nc_pdf_electronico"]').hide();
    // notas.menubar.find('li[data-name="dtv_emitir_electronico_plane"]').hide();

    // PE
    notas.menubar.find('li[data-name="emitir-modo-pe-FA_NC"]').hide();
    notas.menubar.find('li[data-name="dtv_pdf_electronico_FEPE_NC"]').hide();

    let objBtnElectronico = notas.menubar.find('[data-name="dtv_nc_emitir_electronico"]');
    if (currency.code == "PEN") {
      objBtnElectronico = notas.menubar.find('[data-name="emitir-modo-pe-FA_NC"]');
    }

    if (notas.data.urlPdfbsale == '') {
      notas.menubar.find('li[data-name="dtv_pdf_electronico_bsale"]').hide();
    }

    switch (notas.data.estado) {
      case 'PREVISUALIZACION':
        notas.container.find('input[name="fecha_emision"]').removeClass("datepicker");
        break;

      case 'POR EMITIR':
        notas.container.find('input[name="fecha_emision"]').removeClass("datepicker");

        if (access._540) { // eliminar manual
          notas.menubar.find('li[data-name="delete"]').show();
        }

        if (access._543) { // emitir manual
          notas.menubar.find('li[data-name="dtv_nc_emitir_manual"]').show();
        }

        if ((access._547 && notas.data.id_tipo_doc == "61" && doc_electronico)) { // emitir electrónico
          //notas.menubar.find('li[data-name="dtv_nc_emitir_electronico"]').show();
          objBtnElectronico.show();
        }

        notas.menubar.find('li[data-name="dtv_emitir_bsale"]').show();

        break;

      case 'EMITIDA':
        notas.container.find('button.edit').hide();
        notas.container.find('input.edit, thousands_sep textarea.edit').prop('readonly', true).removeClass('datepicker');
        notas.containerItems.find('input').prop('readonly', true);
        notas.menubar.find('li[data-name="dtv_emitir_bsale"]').hide();

        if ((access._540 && !doc_electronico)) { // eliminar
          notas.menubar.find('li[data-name="delete"]').show();
        }

        if ((currency.code != "PEN" && notas.data.id_tipo_doc == "61" && doc_electronico)) {
          notas.menubar.find('li[data-name="dtv_nc_pdf_electronico"]').show();
        }

        if ((currency.code == "PEN" && notas.data.id_tipo_doc == "61" && doc_electronico)) {
          notas.menubar.find('li[data-name="dtv_pdf_electronico_FEPE_NC"]').show();
        }

        notas.container.find('input[name="adicional"]').prop('readonly', false);
        break;

      case 'ANULADA':
        notas.containerItems.find('input').prop('readonly', true);

        if ((access._540 && !doc_electronico)) { // eliminar
          notas.menubar.find('li[data-name="delete"]').show();
        }

        break;
    }
    // notas.menubar.find('li[data-name="dtv_emitir_electronico_plane"]').hide();

    // }, 1000);

  },
  loadItems: function (items) {
    let rows = "";

    let currencySymbol = currency.symbol;
    if (currency.code == "PEN" && notas.data.exchange.type == "USD") {
      currencySymbol = "$";
    }

    notas.containerItems.find("*").remove();
    $.each(items, function (key, item) {

      let precio = notas.data.exchange.v3_exchange_type === "USD" ? item.v3_exchange_monto_facturado : item.det_precio;
      let sub_total = notas.data.exchange.v3_exchange_type === "USD" ? item.v3_exchange_monto_facturado / item.det_cantidad : item.det_subtotal;
      var row = '';
      row += '<tr data-tipo="ITEM" data-id="' + item.det_id + '" data-key="' + key + '" data-descripcion-larga="' + item.det_descripcion_larga + '">';
      row += '<td style="width:5%"><button class="ui-icon ui-icon-minus remove item" title="Quitar ítem" style="display: inline-block;"></button></td>';
      row += '<td class="center" style="width:10%"><input style="padding:2px" class="edit" name="det_codigo" type="text" value="' + item.det_codigo + '"></td>';
      row += '<td style="width:35%"><input style="padding: 2px; text-transform: none !important;" class="edit" name="det_descripcion" type="text" value="' + item.det_descripcion + '"> <span class="ui-icon ui-icon-pencil change descripcion" style="cursor: pointer;" title="Cambiar descripción larga"></span> <span class="ui-icon ui-icon-notice detail descripcion" style="cursor: pointer;"></span></td>';
      //row += '<td class="center" style="width:15%"><input style="width: 50px;" '+ ((notas.data.motivo == "ANULAR FACTURA") ? 'readonly' : '') +' name="det_cantidad" type="number" value="'+ item.det_cantidad +'"></td>';
      row += '<td class="center" style="width:15%"><input ' + ((currency.code == "PEN") ? 'readonly' : '') + ' style="width: 50px;" name="det_cantidad" type="number" value="' + item.det_cantidad + '"></td>';
      // row += '<td style="width:15%" class="numeric currency right">' + currency.symbol + ' <span><input '+ ((notas.data.motivo == "ANULAR FACTURA") ? 'readonly' : '') +' style="width:auto" name="det_precio" type="text" value="'+ item.det_precio +'"></span></td>';
      row += '<td style="width:15%" class="numeric currency right">' + currencySymbol + ' <span><input onkeyup="unaBase.utilities.general.formater(this)" ' + ((currency.code == "PEN") ? 'readonly' : '') + ' style="width:auto" name="det_precio" type="text" value="' + precio + '"></span></td>';
      row += '<td style="width:15%" class="numeric currency right">' + currencySymbol + ' <span><input readonly style="width:auto" name="det_subtotal" type="text" value="' + sub_total + '"></span></td>';
      row += '</tr>';

      var htmlRow = $(row);

      /*if (currency.code != "PEN") {
        htmlRow.find('input[name="det_cantidad"], input[name="det_precio"]').css('background-color', 'yellow');
      }*/

      if (notas.data.motivo == "CORRECCION DE MONTO") {
        htmlRow.find('input[name="det_cantidad"], input[name="det_precio"]').css('background-color', 'yellow').prop('readonly', false);
      }

      htmlRow.find('input[name="det_cantidad"]').on('blur', function () {
        let current = this;
        $.ajax({
          url: '/4DACTION/_V3_setNcVentas',
          data: {
            'id': notas.id,
            'edit_items': true,
            'dato_item': 'cantidad_item',
            'id_item': htmlRow.data("id"),
            'value_item': $(this).val()
          },
          dataType: 'json',
          success: function (data) {
            switch (data.errorMsg) {
              case 'monto_cero':
                alert("El monto a descontar debe ser mayor a cero.");
                notas.loadItems(notas.itemsValoresIniciales);
                break;
              case 'excede_monto':
                alert("Monto ingresado excede el total de la NC. Ingrese un monto menor.");
                notas.loadItems(notas.itemsValoresIniciales);
                break;
            }
            notas.get_line_total(item.det_id);
            notas.get_totales();
          }
        });
      });

      htmlRow.find('input[name="det_precio"]').on('blur', function () {
        let current = this;

        $.ajax({
          url: '/4DACTION/_V3_setNcVentas',
          data: {
            'id': notas.id,
            'edit_items': true,
            'dato_item': 'precio_item',
            'id_item': htmlRow.data("id"),
            'value_item': notas.data.exchange.v3_exchange_type === "USD" ? $(this).val() * notas.data.exchange.v3_exchange_rate : $(this).val(),
            'exchange_amount': notas.data.exchange.v3_exchange_type === "USD" ? $(this).val() : 0,
          },
          dataType: 'json',
          success: function (data) {
            switch (data.errorMsg) {
              case 'monto_cero':
                alert("El monto a descontar debe ser mayor a cero.");
                notas.loadItems(notas.itemsValoresIniciales);
                break;
              case 'excede_monto':
                alert("Monto ingresado excede el total de la NC. Ingrese un monto menor.");
                notas.loadItems(notas.itemsValoresIniciales);
                break;
            }
            notas.get_line_total(item.det_id);
            notas.get_totales();
          }
        });
      });
      htmlRow.find('.remove.item').on('click', function () {
        if (notas.data.items.length > 1) {
          const current = this;
          const parent = current.closest("tr");
          const id = parent.dataset.id;


          $.ajax({
            url: '/4DACTION/_V3_deleteDetalleNc',
            data: {
              'id': notas.id,
              'id_item': htmlRow.data("id"),
            },
            dataType: 'json',
            success: function (data) {
              if (data.success) {
                // parent.parentNode.removeChild(parent);
                // notas.data.items = notas.data.items.filter(i => i.det_id !== id);
                // const index = notas.data.items.findIndex(i => i.det_id === id);
                // notas.data.items[index].delete = true;
                notas.init(notas.id);
                notas.get_totales();
              }
            }
          });

        } else {
          toastr.warning("No puedes eliminar la única linea de la nota.");
        }


      });

      htmlRow.find('.detail.descripcion').tooltipster({
        content: function () {
          var htmlObject = $('\
            <div style="white-space: pre;">' + (item.det_descripcion_larga ? item.det_descripcion_larga : '') + '</div>\
          ');
          return htmlObject;
        },
        delay: 0,
        interactiveAutoClose: false,
        contentAsHTML: true
      });

      htmlRow.find('.detail.descripcion').tooltipster({
        content: function () {
          var htmlObject = $('\
            <div style="white-space: pre;">' + (item.det_descripcion_larga ? item.det_descripcion_larga : '') + '</div>\
          ');
          return htmlObject;
        },
        delay: 0,
        interactiveAutoClose: false,
        contentAsHTML: true
      });

      if (item.det_descripcion_larga == '') {
        htmlRow.find('.detail.descripcion').invisible();
      } else {
        htmlRow.find('.detail.descripcion').visible();
      }
      // notas.containerItems.find("*").remove();

      if (notas.data.motivo === "ANULAR FACTURA" || items.length === 1) {
        htmlRow.find(".remove.item").remove();
      }
      notas.containerItems.append(htmlRow);

    });

    var htmlObject = notas.containerItems;

    htmlObject.find('.change.descripcion').click(function (event) {
      var row = $(event.target).closest('tr');
      var htmlObject = $('<section> \
        <span>Ingrese descripción larga</span><br> \
        <textarea name="descripcion_larga"></textarea> \
      </section>');
      htmlObject.find('textarea').val(row.data('descripcion-larga'));
      htmlObject.find('textarea').on('blur change', function () {
        htmlObject.data('response', $(this).val());
      });
      prompt(htmlObject).done(function (data) {
        var text = data;
        if (data !== false) {
          $.ajax({
            url: '/4DACTION/_V3_setNcVentas',
            data: {
              'id': notas.id,
              'edit_items': true,
              'dato_item': 'descripcion_larga',
              'id_item': row.data("id"),
              'value_item': text
            },
            dataType: 'json',
            success: function (data) {
              row.data('descripcion-larga', text);
              toastr.success('Descipción larga cambiada con éxito.');
              var tooltip = ('<div style="white-space: pre;">' + text + '</div>');
              row.find('.detail.descripcion').tooltipster('update', text);
              if (text == '') {
                row.find('.detail.descripcion').invisible();
              } else {
                row.find('.detail.descripcion').visible();
              }
            }
          });
        }
      });
    });

    

    notas.containerItems.find('.numeric.currency input').number(true, currency.decimals, currency.decimals_sep, currency.thousands_sep);
    notas.display();

  },
  get_line_total(key) {
    // console.log("get_line_total");
    // const parent = line.closest("tr");
    // console.log(line);
    // console.log(parent);
    const parent = document.querySelector(`#sheet-notas tr[data-id="${key}"]`);

    const precio = parseStrToInt(parent.querySelector(`input[name="det_precio"]`).value, currency);
    const cantidad = parseStrToInt(parent.querySelector(`input[name="det_cantidad"]`).value, currency);

    let totalLine = precio * cantidad;
    parent.querySelector(`input[name="det_subtotal"]`).value = totalLine;
    $(parent).find('.numeric.currency input').number(true, currency.decimals, currency.decimals_sep, currency.thousands_sep);
  },
  get_totales: function () {
    $.ajax({
      'url': '/4DACTION/_V3_proxy_getNcVentasContent',
      data: {
        "id": notas.id,
        "api": true
      },
      dataType: 'json',
      async: false,
      success: function (data) {
        notas.data = data;
        $('[name="sub_total"]').val(notas.data.montos.sub_total);
        $('[name="porc_descuento"]').val(notas.data.montos.porc_descuento);
        $('[name="descuento"]').val(notas.data.montos.descuento);
        $('[name="exento"]').val(notas.data.montos.exento);
        $('[name="neto"]').val(notas.data.montos.neto);
        $('[name="impuesto"]').val(notas.data.montos.iva);
        $('[name="adicional"]').val(notas.data.montos.adicional);
        $('[name="total"]').val(notas.data.montos.total);
        $('[name="total_por_cobrar"]').val(notas.data.montos.total);
      }
    });

  },
  getTokenAccess: function () {
    let encodedString = btoa(notas.data.apiFE.string);
    let formDataToken = {
      "grant_type": "client_credentials"
    };
    let url = notas.data.apiFE.urlServicio + '/oauth2/token';
    $.ajax({
      "url": url,
      "type": "POST",
      "data": JSON.stringify(formDataToken),
      async: false,
      "headers": {
        "Content-Type": "application/json",
        "Authorization": "Basic " + encodedString,
        "Cache-Control": "no-cache"
      },
      error: function (xhr, text, error) {
        var myObj = JSON.parse(xhr.responseText);
      }
    }).done(function (response) {
      notas.data.apiFE.token = response.access_token;
      notas.data.apiFE.tokenStatus = true;
      $.ajax({
        'url': '/4DACTION/_V3_setUpdateTokenFEPE',
        data: {
          'tokenFEPE': notas.data.apiFE.token
        },
        async: false,
        dataType: 'json',
        success: function (data) {
          if (!data.success) {
            toastr.error("No se puedo actualizar el Token en el sistema.");
          }
        },
        error: function (xhr, text, error) {
          toastr.error(NOTIFY.get('ERROR_INTERNAL', 'Error'));
        }
      });
    });
    return notas.data.apiFE.token;
  },
  trim: function (cadena) {
    cadena2 = "";
    len = cadena.length;
    for (var i = 0; i <= len; i++) if (cadena.charAt(i) != " ") { cadena2 += cadena.charAt(i); }
    return cadena2;
  },
  esnumero: function (campo) {
    return (!(isNaN(campo)));
  },
  validaRUC: function (valor) {
    valor = notas.trim(valor)
    if (notas.esnumero(valor)) {
      if (valor.length == 8) {
        suma = 0
        for (i = 0; i < valor.length - 1; i++) {
          digito = valor.charAt(i) - '0';
          if (i == 0) suma += (digito * 2)
          else suma += (digito * (valor.length - i))
        }
        resto = suma % 11;
        if (resto == 1) resto = 11;
        if (resto + (valor.charAt(valor.length - 1) - '0') == 11) {
          return true
        }
      } else if (valor.length == 11) {
        suma = 0
        x = 6
        for (i = 0; i < valor.length - 1; i++) {
          if (i == 4) x = 8
          digito = valor.charAt(i) - '0';
          x--
          if (i == 0) suma += (digito * x)
          else suma += (digito * x)
        }
        resto = suma % 11;
        resto = 11 - resto

        if (resto >= 10) resto = resto - 10;
        if (resto == valor.charAt(valor.length - 1) - '0') {
          return true
        }
      }
    }
    return false
  },
  previewFEPE: function () {

    let msj = "";
    let rucin = notas.data.cliente.rut + notas.data.cliente.dv;

    if (notas.data.cliente.razon == "") {
      msj += "- Falta ingresar Razon social del cliente.<br>";
    }

    if (notas.data.cliente.direccion == "") {
      msj += "- Falta ingresar dirección del cliente.<br>";
    }

    if (rucin.length == 11) {
      if (!notas.validaRUC(rucin)) {
        msj += "- RUC: " + rucin + " no es valido.<br>";
      }
    } else {
      msj += "- RUC: " + rucin + " no es valido. Debe contener 11 digitos.<br>";
    }

    if (notas.data.referenciadoc.tipoDocumentoRef == "03") {
      msj += "- No es posible emitir NC a una boleta.<br>";
    }

    if (msj == "") {
      unaBase.loadInto.dialog('/v3/views/dtv/dialog/confirmFEPENC.shtml?id=' + notas.id, 'CONFIRMACIÓN ANTES DE ENVIAR', 'medium');
    } else {
      toastr.error(msj);
    }
  },
  sendFEPE: function () {
    var status = true;
    let tasaIgv = notas.data.tasaIGVIVA;
    let detalles = [];
    $.each(notas.data.items, function (key, item) {
      item.unidadMedidaItemFEPE = notas.unidadMedidaItemFEPESelected;
      let ObjDetail = {
        "codItem": ((item.det_codigo != "") ? item.det_codigo : "10005"),
        "tasaIgv": notas.data.tasaIGVIVA,
        "montoIgv": item.det_subtotal * notas.data.tasaIGVIVA,
        "montoItem": item.det_subtotal,
        "nombreItem": item.det_descripcion,
        "precioItem": item.det_precio,
        "idOperacion": item.det_id,
        "cantidadItem": item.det_cantidad,
        "codAfectacionIgv": notas.data.codigoTipoAfectacionFEPE, // 10 Gravado - Operación Onerosa // 30 = Inafecto - Operación Onerosa
        "precioItemSinIgv": item.det_precio,
        "unidadMedidaItem": item.unidadMedidaItemFEPE // sino existe unidad dejar como NIU // ZZ= servicio y NIU=producto
      }
      detalles.push(ObjDetail);
    });

    let formData = {
      "detalle": detalles,
      "impuesto": [
        {
          "codImpuesto": "1000",
          "tasaImpuesto": tasaIgv,
          "montoImpuesto": notas.data.montos.iva
        }
      ],
      "documento": {
        "serie": notas.data.serieActualFE,
        "mntNeto": notas.data.montos.neto,
        "mntTotal": notas.data.montos.total,
        "tipoMoneda": ((notas.data.exchange.type == "") ? notas.data.exchange.default : notas.data.exchange.type),
        "correlativo": notas.data.folioNextFE,
        "mntTotalIgv": notas.data.montos.iva,
        "nombreEmisor": notas.data.emisor.razon,
        "numDocEmisor": notas.data.emisor.nrodoc,
        "tipoDocEmisor": "6",
        "nombreReceptor": notas.data.cliente.razon,
        "numDocReceptor": notas.data.cliente.rut + notas.data.cliente.dv,
        "direccionOrigen": notas.data.emisor.direccion,
        "direccionUbigeo": "150101", // LIMA
        "tipoDocReceptor": "6", // 6=RUC // 1=DNI
        "direccionDestino": notas.data.cliente.direccion,
        "fechaVencimiento": notas.data.fecha_vencimiento_formato_FE,
        "tipoFormatoRepresentacionImpresa": "GENERAL",
        "tipoCambioDestino": notas.data.exchange.rate,
        "tipoMotivoNotaModificatoria": notas.data.tipoMotivoNotaModificatoria, // 01 = ANULACIÓN DE LA OPERACIÓN // 02 = ANULACIÓN POR ERROR EN EL RUC
        "sustento": notas.data.sustento
      },
      "referencia": [{
        "tipoDocumentoRef": notas.data.referenciadoc.tipoDocumento, // "01" = factura
        "serieRef": notas.data.referenciadoc.serieRef,
        "correlativoRef": notas.data.referenciadoc.correlativo,
        "fechaEmisionRef": notas.data.referenciadoc.fechaEmisionRef
      }],
      "fechaEmision": notas.data.fecha_emision_formato_FE,
      "idTransaccion": notas.data.serieActualFE + "-" + notas.data.folioNextFE + "-" + notas.data.id, //ej:F011-48047-01
      "tipoDocumento": notas.data.tipoDocumentoFEPE, // 01 = factura, 03 = boletas
      "correoReceptor": notas.data.cliente.email_receptor_fe
    };

    let url = notas.data.apiFE.urlServicio + '/emission/documents';
    $.ajax({
      "url": url,
      "type": "POST",
      "data": JSON.stringify(formData),
      "headers": {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + notas.data.apiFE.token,
        "Cache-Control": "no-cache"
      },
      async: false,
      error: function (xhr, text, error) {
        var myObj = JSON.parse(xhr.responseText);
        toastr.error(myObj.errors[0].detail + ". Intenta enviar nuevamente.");
        if (myObj.errors[0].status == 401 && myObj.errors[0].code == "10") {
          notas.getTokenAccess();
        }
        status = false;
      }
    }).done(function (response) {
      switch (response.data.estadoEmision) {
        case 'A':
          toastr.success("Documento aceptado!");
          notas.setPostFE();
          status = true;
          break;
        case 'E':
          toastr.success("Enviado a SUNAT");
          notas.setPostFE();
          status = true;
          break;
        case 'N':
          toastr.warning("Envio Erroneo. Revisar con soporte.");
          status = false;
          break;
        case 'O':
          toastr.warning("Aceptado con observación.\n" + response.data.observaciones[0].codigo + ": " + response.data.observaciones[0].mensaje);
          notas.setPostFE();
          status = true;
          break;
        case 'R':
          toastr.warning("Documento rechazado!");
          notas.setPostFE();
          status = true;
          break;
        case 'P':
          toastr.warning("Pendiente de envió SUNAT (Recibido por PSE).");
          notas.setPostFE();
          status = true;
          break;
        default:
          toastr.warning("Estado desconocido. Revisar con soporte.");
          status = false;
      }
    });

    return status;

  },
  getFiles: function () {
    let name = notas.data.emisor.nrodoc + "-" + notas.data.tipoDocumentoFEPE + "-" + notas.data.folio;
    let ID = "6-" + name;
    let url = notas.data.apiFE.urlServicio + '/download/documents/' + ID;
    $.ajax({
      "url": url,
      "type": "GET",
      "headers": {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + notas.data.apiFE.token,
        "Cache-Control": "no-cache"
      },
      async: false,
      error: function (xhr, text, error) {
        var myObj = JSON.parse(xhr.responseText);
        if (myObj.errors[0].status == 404) {
          toastr.error("Documento no se encuentra disponible.");
        } else {
          if (myObj.errors[0].status == 401 && myObj.errors[0].code == "10") {
            toastr.error(myObj.errors[0].detail + ". Vuelva a intentar.");
            notas.getTokenAccess();
          } else {
            toastr.error(myObj.errors[0].detail);
          }
        }
      }
    }).done(function (response) {
      var result = response.data;

      toastr.success("Documentos obtenidos con éxito!");
      const base64URL = "data:application/pdf;base64," + result.pdf;
      const linkSource = base64URL;
      const downloadLink = document.createElement("a");
      const fileName = name + ".pdf";
      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();

      const base64URL2 = "data:application/xml;base64," + result.xml;
      const linkSource2 = base64URL2;
      const downloadLink2 = document.createElement("a");
      const fileName2 = name + ".xml";
      downloadLink2.href = linkSource2;
      downloadLink2.download = fileName2;
      downloadLink2.click();

    });
  },
  setPostFE: function () {
    $.ajax({
      'url': '/4DACTION/_V3_setNcVentas',
      data: {
        'id': notas.id,
        'SET_POST_FE_PEN': true,
        'SET_POST_FE_PEN_FOLIO': notas.data.folioNextFE,
        'SET_POST_FE_PEN_SERIE_FOLIO': notas.data.serieActualFE + "-" + notas.data.folioNextFE,
        'SET_POST_FE_PEN_EMISION': notas.data.fecha_emision_formato_FE
      },
      dataType: 'json',
      success: function (data) {
        if (data.success) {
          notas.data.folio = notas.data.serieActualFE + "-" + notas.data.folioNextFE;
          toastr.success("Datos actualizados con éxito!");
          unaBase.loadInto.viewport('/v3/views/dtv/nc/content.shtml?id=' + notas.id, undefined, undefined, true);
        } else {
          toastr.error("No se pudo actualizar el correlativo. Es necesario ajustar manualmente el folio antes del próximo envio. \nSi tienes dudas comuníquese con soporte.");
        }
      },
      error: function (xhr, text, error) {
        toastr.error(NOTIFY.get('ERROR_INTERNAL', 'Error'));
      }
    });
  }

}
