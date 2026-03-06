var container = $('#sheet-permisos');
var containerUsers = $('#sheet-usuarios');




$(document).ready(function() {
    // container.find(".tabs" ).tabs();


    // $('input.currency').number(true , 0, ',', '.');
    
    unaBase.toolbox.init();
    unaBase.toolbox.menu.init({
      entity: 'Permisos',   
      buttons: ['selectUsers','selectAccess','exit',"applyAccess","removeAccess"],
      data: function(){


        return {
          ids: permisos.getSelectedAccess().idsText,
          login: permisos.getSelectedUser().idsText
        }         
      },
      validate: function() {
        
        return true;

      }
    });



});
