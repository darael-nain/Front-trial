var container = $('#sheet-permisos');
var containerUsers = $('#sheet-usuarios');




$(document).ready(function() {
    // container.find(".tabs" ).tabs();


    // $('input.currency').number(true , 0, ',', '.');
    
    unaBase.toolbox.init();
    unaBase.toolbox.menu.init({
      entity: 'AreasMany',   
      buttons: ['selectUsersForArea','selectAreas','exit',"applyAreas"],
      data: function(){


        return {
          ids: areas.getSelectedAreas().idsText,
          login: areas.getSelectedUser().idsText
        }         
      },
      validate: function() {
        
        return true;

      }
    });



});
