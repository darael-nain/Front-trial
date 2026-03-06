var menus = function(){     
  unaBase.toolbox.init();
    unaBase.toolbox.menu.init({
      entity: 'ItemByCotizacion', // especifica entidad sobre la cual se almacenan los datos
                  // y nombre para referenciar los views
      // acá se envía la data que debe validar la API al presionar el botón save
      // y enviar en caso de ser válida
      buttons: ['save'],
      data: function() {
        

        var target;
        var llave = $('#form-detalle-items').data('llave');
        $('table.items > tbody > tr').each(function() {
          if ($(this).data('id') == llave) {
            target = $(this);
            return false;
          }
        });

        target.data('observacion', $('textarea[name="item[][observacion]"]').val());
        target.data('comentario', $('textarea[name="item[][comentario]"]').val());
        target.data('tipo-documento', $('select[name="item[][tipo_documento]"]').val());



        // Actualizar el costo presupuestado
        
        if (target.find('input[name="item[][costo_interno]"]').prop('checked')) {

          if (typeof target.data('costo-presupuestado-hh-cantidad') == 'undefined')
            target.data('costo-presupuestado-hh-cantidad', 0);

          if (typeof target.data('costo-presupuestado-hh-valor') == 'undefined')
            target.data('costo-presupuestado-hh-valor', 0);

          var old_costo_total = parseFloat(target.find('input[name="item[][costo_unitario]"]').val());
          var old_costo_interno = target.data('costo-presupuestado-hh-cantidad') * target.data('costo-presupuestado-hh-valor');
          var costo_externo = old_costo_total - old_costo_interno;

          var new_costo_interno = parseFloat($('input[name="item[][cant_hh_asig]"]').val()) * parseFloat($('input[name="item[][costo_hh_unitario]"]').val());
          var new_costo_total = costo_externo + new_costo_interno;
          target.find('input[name="item[][costo_unitario]"]').val(new_costo_total.toFixed(0));
          updateRow({
            target: target.find('input[name="item[][costo_unitario]"]')
          });
        }

        // Pasar datos HH a la fila actual de la cotización
        target.data('costo-presupuestado-hh-cantidad', parseFloat($('input[name="item[][cant_hh_asig]"]').val()));
        target.data('costo-presupuestado-hh-valor', parseFloat($('input[name="item[][costo_hh_unitario]"]').val()));
        target.data('costo-presupuestado-hh-username', $('select[name="item[][responsable_asig]"]').val());


        
        $.ajax({
          url: '/4DACTION/_V3_getTipoDocumento',
          data: {
            q: target.data('tipo-documento'),
            filter: 'id'
          },
          dataType: 'json',
          async: false,
          success: function(data) {
            if (data.rows.length) {
              if (data.rows[0].ratio == 0)
                target.find('input[name="item[][precio_unitario]"]').removeClass('edited');
              target.data('tipo-documento-text', data.rows[0].text);
              target.data('tipo-documento-ratio', data.rows[0].ratio);
              target.data('tipo-documento-inverse', data.rows[0].inverse);

              if (typeof data.rows[0].hora_extra != 'undefined') {
                target.data('hora-extra-factor', data.rows[0].hora_extra.factor);
                target.data('hora-extra-jornada', data.rows[0].hora_extra.jornada);
                target.find('input[name="item[][horas_extras]"]').visible();
              } else {
                target.data('hora-extra-factor', null);
                target.data('hora-extra-jornada', null);
                target.find('input[name="item[][horas_extras]"]').invisible();
              }
            }
          }
        });
        
        
        return $('#form-detalle-items').serializeAnything();
      },
      validate: function() {
        return true;
      }
    });
};

$(document).ready(function() {
  $("#dialog-profile-detalleItem").tabs();
    $('.numeric.currency input').number(true, 0, ',', '.');
    menus();
});





