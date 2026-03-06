
var containerContacto = $('.form-contact');

$(document).ready(function() {

    $(".form-contact > .tabs" ).tabs();
    unaBase.toolbox.init();
    unaBase.toolbox.menu.init({
      entity: 'Box',
      buttons: ['save'],
      data: function() {    
        return $('.form-contact').serializeAnything();
      },
      validate: function() {
        var msgError = '';
        var status = true;

        return status;

      }
    });
});