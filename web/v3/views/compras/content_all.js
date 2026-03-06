$(document).ready(function() {

  $("#dialog-profile-compras").tabs({active:0});

  $('button.show').button({icons:{primary: 'ui-icon-carat-1-s'},text: false});
  $('button.edit').button({icons:{primary: "ui-icon-pencil"},text: false});

  unaBase.toolbox.init();
    unaBase.toolbox.menu.init({
    entity: 'Compras',
    buttons: ['exit', 'save','cancel_oc','preview_oc', 'print_oc', "preview_native"],
  
    data: function(){

      return $('#form-compras').serializeAnything();
    },
    validate:function(){

      return true;
    }
  });

  // CARGAR LISTA FORMA DE PAGO
    $('#dialog-profile-compras button.show.forma-pago').click(function() {
      $('#dialog-profile-compras input[name="oc[forma_pago]"]').autocomplete('search', '@').focus();
    });

    $('#dialog-profile-compras input[name="oc[forma_pago]"]').autocomplete({
      source: function(request, response) {
        $.ajax({
          url: '/4DACTION/_V3_' + 'getFormaPagos?compra=true',
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
        $('#dialog-profile-compras input[name="oc[forma_pago]"]').val(ui.item.des);
        $('#dialog-profile-compras input[name="oc[id_forma_pago]"]').val(ui.item.id);
        return false;
      }

    }).data('ui-autocomplete')._renderItem = function(ul, item) {
      return $('<li><a><strong class="highlight">' +  item.des + '</strong></a></li>').appendTo(ul);
    };

    //Abre popup para editar datos de contacto proveedor
    $('button.edit.proveedor').click(function() {
      var id = $('#dialog-profile-compras input[name="proveedor[id]"]').val();
      unaBase.loadInto.dialog('/v3/views/contactos/pop_perfil.shtml?id=' + id, 'Perfil de Empresa','large');
    });

     //Abre popup para editar de contacto asociado
    $('button.edit.asociado').click(function() {
      var id = $('#dialog-profile-compras input[name="asociado[id]"]').val();
      unaBase.loadInto.dialog('/v3/views/contactos/pop_perfil.shtml?id=' + id, 'Perfil de Empresa','large');
    });

    // CARGAR LISTA TIPO DOCUMENTO DE COMPRAS
    $('button.show.dtc').click(function() {
      $('#dialog-profile-compras input[name="oc[dtc]"]').autocomplete('search', '@').focus();
    });

    $('#dialog-profile-compras input[name="oc[dtc]"]').autocomplete({
      source: function(request, response) {
        $.ajax({
          url: '/4DACTION/_V3_' + 'getTiposDocDeCompras',
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
        $('#dialog-profile-compras input[name="oc[dtc]"]').val(ui.item.des);
        $('#dialog-profile-compras input[name="oc[id_dtc]"]').val(ui.item.id);

        //Verifica tipo doc para marcar o desmarcar exento
        if (ui.item.id == 32 || ui.item.id == 34) { // facturas exentas
          $('#dialog-profile-compras .items-compras tbody input[name="oc[detalle_item][exento]"]').prop('checked',true);
        }else{
           $('#dialog-profile-compras .items-compras tbody input[name="oc[detalle_item][exento]"]').prop('checked',false);
        }
        updateSubtotalItems();
        return false;
      }

    }).data('ui-autocomplete')._renderItem = function(ul, item) {
      return $('<li><a><span class="highlight">' +  item.des + '</span></a></li>').appendTo(ul);
    };

    // Oculta boton cancelar si oc tiene folio
    if ($('#dialog-profile-compras input[name="oc[folio]"]').val()!="S/N") {
      $('#dialog-menu ul li[data-name="cancel_oc"]').remove();
    }

    //Busca proveedores
   $('#dialog-profile-compras input[name="proveedor[nombre]"]').autocomplete({
      source: function(request, response) {
        $.ajax({
          url: '/4DACTION/_V3_getEmpresa',
          dataType: 'json',
          data: {
            q: request.term,
            from: 'oc'
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
        //carga inputs con info del porveedor
        $('#dialog-profile-compras input[name="proveedor[nombre]"]').val(ui.item.nombre_completo);
        $('#dialog-profile-compras input[name="proveedor[id]"]').val(ui.item.id);

        //limpia inputs del asociado al seleccionar un nuevo proveedor
        $('#dialog-profile-compras input[name="asociado[nombre]"]').val("");
        $('#dialog-profile-compras input[name="asociado[id]"]').val("");

        return false;
      }

      }).data('ui-autocomplete')._renderItem = function(ul, item) {
        return $('<li><a><strong class="highlight">' +  item.nombre_completo + '</strong></a></li>').appendTo(ul);
      };


    // Carga en lista todos los contactos asociados a contacto proveedor.
    $('#dialog-profile-compras button.show.asociado').click(function() {
      $('#dialog-profile-compras input[name="asociado[nombre]"]').autocomplete('search', '@').focus();
    });

    $('#dialog-profile-compras input[name="asociado[nombre]"]').autocomplete({
      source: function(request, response) {
        var idProveedor = $('#dialog-profile-compras input[name="proveedor[id]"]').val();
        $.ajax({
          url: '/4DACTION/_V3_' + 'getContactoByEmpresa',
            dataType: 'json',
          data: {
        id: idProveedor,
        default: false
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
        $('#dialog-profile-compras input[name="asociado[nombre]"]').val(ui.item.nombre_completo);
        $('#dialog-profile-compras input[name="asociado[id]"]').val(ui.item.id);
        return false;
      }

    }).data('ui-autocomplete')._renderItem = function(ul, item) {
      return $('<li><a><strong class="highlight">' +  item.nombre_completo + '</strong></a></li>').appendTo(ul);
    };

    //Formatea los numeros - $ y %
    $('#dialog-profile-compras .numeric.currency input').number(true, currency.decimals, ',', '.');
    $('#dialog-profile-compras .numeric.percent input').number(true, 2, ',', '.');

    //Calcula totales finales (Esta funcion tiene que ir antes de la funcion desde donse se llama)
    var updateSubtotalItems = function() {
       // Objetos para referenciar valores
      var targetBody = $('#dialog-profile-compras .items-compras tbody');
      var targetFoot = $('#dialog-profile-compras .items-compras tfoot');

      // Variables a calcular
      var tipo_dtc = $('#dialog-profile-compras input[name="oc[id_dtc]"]').val();
      var iva  = parseFloat($('#dialog-profile-compras input[name="oc[parametros]"]').data("impuesto"));
      var ila  = parseFloat(targetFoot.find('[name="oc[ila]"]').val());
      var boleta = 10;

      // Recorre los detalles de la oc, linea por linea
      var suma_item_afectos = 0;
      var suma_item_exentos = 0;

      targetBody.find('tr').each(function() {
        // Si tipo de documento es exento, marca la linea de detalle como tal.
        if (tipo_dtc == 32 || tipo_dtc == 34) { // facturas exentas
          $(this).find('[name="oc[detalle_item][exento]"]').prop('checked',true);
        }
        if ($(this).find('[name="oc[detalle_item][exento]"]').prop('checked')) {
          suma_item_exentos += parseFloat($(this).find('[name="oc[detalle_item][subtotal]"]').val());
        }else{
          suma_item_afectos += parseFloat($(this).find('[name="oc[detalle_item][subtotal]"]').val());
        }
      });
      var sub_total = suma_item_afectos + suma_item_exentos;

      // Calcula descuento
      var descuento  = parseFloat(targetFoot.find('[name="oc[descuento]"]').val());
      var total_exentos = suma_item_exentos;
      var total_afecto =  suma_item_afectos - descuento;
      var neto = total_afecto + total_exentos;

      // Calculo según tipo de DTC
      if (tipo_dtc==33 || tipo_dtc==30) { // Facturas normal || electrónica
          var impuesto = total_afecto * iva / 100;
          var total = neto + impuesto + ila;
          var saldo = total;
      }
      if (tipo_dtc==65 || tipo_dtc==66) { // Boletas normal || electrónica
          var impuesto = total_afecto * boleta / 100;
          var total = neto - impuesto;
          var saldo = total;
      }
      if (tipo_dtc==32 || tipo_dtc==34) { // exentas normal || electrónica
          var impuesto = 0;
          var total = neto;
          var saldo = total;
      }
      if (tipo_dtc==35 || tipo_dtc==914 || tipo_dtc==97 || tipo_dtc==98 || tipo_dtc==99) { // boleta de venta || declaracion de ingreso de venta || comprobante || retiro || contrato
          var impuesto = 0;
          var total = neto;
          var saldo = total;
      }

      // Carga montos totales calculados.
      targetFoot.find('[name="oc[sub_total]"]').val(sub_total);
      targetFoot.find('[name="oc[total_afecto]"]').val(total_afecto);
      targetFoot.find('[name="oc[total_exento]"]').val(total_exentos);
      targetFoot.find('[name="oc[neto]"]').val(neto);
      targetFoot.find('[name="oc[impuesto]"]').val(impuesto);
      targetFoot.find('[name="oc[total]"]').val(total);
      targetFoot.find('[name="oc[saldo]"]').val(saldo);
    };

    // Calculo subtotal por fila
    $('#dialog-profile-compras .items-compras tbody input').on("blur change", function(){
      var target = $(this).parentTo('tr');
      var cantidad = parseFloat(target.find('[name="oc[detalle_item][cantidad]"]').val());
      var precio = parseFloat(target.find('[name="oc[detalle_item][precio]"]').val());
      var subtotal = cantidad*precio;
      target.find('[name="oc[detalle_item][subtotal]"]').val(subtotal);
      updateSubtotalItems();
    });

    // Calculo por porcentaje
    $('#dialog-profile-compras .items-compras tfoot .dscto').on("blur change", function(){
      var targetFoot = $('#dialog-profile-compras .items-compras tfoot');
      var sub_total =  parseFloat(targetFoot.find('[name="oc[sub_total]"]').val());
      var name = $(this).attr("name");
      var valor = parseFloat($(this).val());
      if (valor>=0 && valor<=100) {
        if (name == "oc[porcentaje_descuento]") {
          if (valor>0) {
            var descuento  = (sub_total * valor) / 100;
            targetFoot.find('[name="oc[descuento]"]').val(descuento);
          }else{
            targetFoot.find('[name="oc[descuento]"]').val(0);
          }
        }else{
          if (valor>0) {
            var porcentaje_descuento  = (valor * 100) / sub_total;
            targetFoot.find('[name="oc[porcentaje_descuento]"]').val(porcentaje_descuento);
          }else{
            targetFoot.find('[name="oc[porcentaje_descuento]"]').val(0);
          }
        }
      }else{
        targetFoot.find('[name="oc[descuento]"]').val(0);
        targetFoot.find('[name="oc[porcentaje_descuento]"]').val(0);
      }
      updateSubtotalItems();
    });

    // Re-escribe referecia en titulo superior de la oc
    $('#dialog-profile-compras #tabs-1 input[name="oc[referencia]"]').keyup(function(){
      var valor = $(this).val().toUpperCase();
      $('#form-compras .info-header article.derecho h2').text(valor);
    });

    //oculta objetos varios
    $('.hide').hide();


});
