
var containerContacto = $('.form-factura');
var idContacto = containerContacto.find('input[name="id"]').val();

var verifica_duplicacion = function(){
  var contacto = {
    id : idContacto,
    rut: containerContacto.find('input[name="contact[rut]"]').val(),
    nombre: containerContacto.find('input[name="contact[nombre]"]').val(),
    paterno: containerContacto.find('input[name="contact[paterno]"]').val(),
    razon: containerContacto.find('input[name="contact[razon]"]').val()       
  }
  $.ajax({
    url: '/4DACTION/_V3_verificaContactoDuplicado',
    dataType: 'json',
    data: contacto,
    async: false,
    success: function(data) {
      if (data.success) {
        var nombre = "";
        $.each(data.contactos, function(key,item){
          nombre = item.nombre_completo;
        });
        alert("El rut ingresado ya se encuentra asociado a otro contacto. Pertenece a:<br/><br/>"+ nombre);
        containerContacto.find('input[name="contact[rut]"]').val('').focus();
        containerContacto.find('input[name="contact[validar_rut]"]').prop('checked', false);
      }
    }
  });
}

$(document).ready(function() {

    $(".form-factura > .tabs" ).tabs();
    unaBase.toolbox.init();
    unaBase.toolbox.menu.init({
      entity: 'Contacto',
      buttons: ['save'],
      data: function() {    
        return $('.form-factura').serializeAnything();
      },
      validate: function() {
        var msgError = '';
        var status = true;

        var rut = containerContacto.find('input[name="contact[rut]"]').val();
        var nombre = containerContacto.find('input[name="contact[nombre]"]').val();
        var paterno = containerContacto.find('input[name="contact[paterno]"]').val();
        var materno = containerContacto.find('input[name="contact[materno]"]').val();
        var razon = containerContacto.find('input[name="contact[razon]"]').val();
        var validacionRut = containerContacto.find('input[name="check[validar_rut]"]');

        containerContacto.find('input').removeClass("invalid"); 

        // valida ingreso rut
        if (rut!="") {
          if (!unaBase.data.rut.validate(rut)){
            if (validacionRut.prop('checked')) {    
              msgError = msgError + '- Rut ingresado no es válido.<br/>';
              containerContacto.find('input[name="contact[rut]"]').addClass('invalid');             
            }else{
              validacionRut.prop('checked', false);
              containerContacto.find('input[name="contact[validar_rut]"]').val('false');
            }
          }else{
            validacionRut.prop('checked', true);
            containerContacto.find('input[name="contact[validar_rut]"]').val('true');
          }    
        }else{        
          //validacionRut.prop('checked', false);
          containerContacto.find('input[name="contact[rut]"]').val('');
          containerContacto.find('input[name="contact[validar_rut]"]').val('false');
        }

        // valida ingreso nombre o razón social
        if (nombre == '' && paterno == '' && razon == '') {
           msgError = msgError + '- Falta ingresar Nombre y Apellido patermo o Razón social.<br/>';
           containerContacto.find('input[name="contact[nombre]"]').addClass('invalid');
           containerContacto.find('input[name="contact[paterno]"]').addClass('invalid'); 
           containerContacto.find('input[name="contact[razon]"]').addClass('invalid'); 
        }else{
          if (razon == '') {
            if (nombre == '' || paterno == '') {
              if (nombre == '') {
                msgError = msgError + '- Falta ingresar Nombre(s).<br/>';
                containerContacto.find('input[name="contact[nombre]"]').addClass('invalid'); 
              }
              if (paterno == '') {
                msgError = msgError + '- Falta ingresar Apellido paterno.<br/>';
                containerContacto.find('input[name="contact[paterno]"]').addClass('invalid');
              }
            }else{
              if (materno != '') {
                var cadena = nombre + " " + paterno+ " " + materno;
              }else{
                var cadena = nombre + " " + paterno;
              }              
              containerContacto.find('input[name="contact[razon]"]').val(cadena);
            }
          }
        }

        // verifica estatus final
        if (msgError == '') {
          status = true;
        }else{
          toastr.error(msgError);
          status = false;
        }
        return status;

      }
    });
});