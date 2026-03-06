$(document).ready(function(){
  	unaBase.ui.block();    
  	pago.menu();
  	pago.init($('#tipospago').data('id'));
  	unaBase.ui.unblock();
  	unaBase.ui.expandable.init();
});
