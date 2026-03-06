$(document).ready(function(){
  	unaBase.ui.block();    
  	cuenta.menu();
  	cuenta.init($('#tiposcuenta').data('id'));
  	unaBase.ui.unblock();
  	unaBase.ui.expandable.init();
});
