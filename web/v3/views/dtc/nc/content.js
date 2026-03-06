$(document).ready(function() {

   // dtc.init($('#sheet-dtc').data('id'));
    // var id = dtc.id;

    unaBase.toolbox.init();
    unaBase.toolbox.menu.init({
      entity: 'Dtc',
      buttons: ['save'],
      data: function() {
        return $('#form-contacto').serializeAnything();
      },
      validate: function() {
        var isValidRut = true;
        return isValidRut;
      }
    });
 });
