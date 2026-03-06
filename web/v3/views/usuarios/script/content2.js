var container = $('#sheet-usuarios');
var idContacto = container.find('input[name="id"]').val();


var valida_duplicacion_usuario = function  (login) {
  var estatus = true;
  $.ajax({
      url: '/4DACTION/_V3_Validar_Usuario_Duplicado',
      data: {
        'login': login
      },
      async:false,
      dataType: 'json',
      success: function(data) {
        if (data.cantidad > 0) {
         estatus = false;
        }
      }
    });
  return estatus;
}



$(document).ready(function() {
    container.find(".tabs" ).tabs();   
    
    unaBase.toolbox.init();
    unaBase.toolbox.menu.init({
      entity: 'Usuarios',   
      buttons: ['save','exit'],
      data: function(){      
        return container.serializeAnything();            
      },
      validate: function() {
        var msgError = '';
        var status = true;

        var login = container.find('input[name="usuario[login]"]').val();
        var pass = container.find('input[name="usuario[pass]"]').val();
        var apellido = container.find('input[name="usuario[apellido_paterno]"]').val();
        var nombres = container.find('input[name="usuario[nombres]"]').val();

        container.find('input').removeClass("invalid"); 

        if (pass == '') {
          msgError = msgError + '- Falta ingresar password.<br/>';
          container.find('input[name="usuario[pass]"]').addClass('invalid');
        }
        if (login == '') {
          msgError = msgError + '- Falta ingresar nombre de usuario.<br/>';
          container.find('input[name="usuario[login]"]').addClass('invalid');
        }
        if (nombres == '') {
          msgError = msgError + '- Falta ingresar su Nombre.<br/>';
          container.find('input[name="usuario[nombres]"]').addClass('invalid');
        }
        if (apellido == '') {
          msgError = msgError + '- Falta ingresar su Apellido.<br/>';
          container.find('input[name="usuario[apellido_paterno]"]').addClass('invalid');
        }


        else{
          if(!valida_duplicacion_usuario(login)){
            msgError = msgError + '- Usuario ya se encuentra registrado, por favor intentar con otro nombre de usuario..<br/>';
            container.find('input[name="usuario[login]"]').addClass('invalid');
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

    $('input[name="usuario[login]"]').unbind('blur').bind('blur', function(){
      var login = $(this).val();
      if(!valida_duplicacion_usuario(login)){
        toastr.error('Usuario ya se encuentra registrado, por favor intentar con otro login.');
        $(this).val("").focus();
      }    
    });

});
