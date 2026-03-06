$(document).ready(function() {			




  $(".form-contact > .tabs" ).tabs();
  unaBase.toolbox.init();
  unaBase.toolbox.menu.init({
    entity: 'Producto',
    buttons: ['save'],
    //buttons: [],
    data: function() {
      var serializedForm = $('.form-contact').serializeAnything();
      return serializedForm;
    },
    validate: function() {
      var isValidRut = true;
      /*var auxRut = $('.form-popup input[name=rut]').val();        
      if ($('.form-popup input[name=validar-rut]').is(':checked')) {             
        if (auxRut!="" && unaBase.data.rut.validate(auxRut))
          isValidRut = true;
        else
          isValidRut = false;
      }else{
        if (auxRut!="" && unaBase.data.rut.validate(auxRut)) {                 
          $('.form-popup input[name=validar-rut]').attr('checked',true);
          isValidRut = true;
        }
      }*/
      return isValidRut;
    }
  });



  
  
});