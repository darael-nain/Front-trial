
$(document).ready(function(){
  	unaBase.ui.block();    
  	impuestos.menu();
  	impuestos.init($('#impuestos').data('id'));
  	unaBase.ui.unblock();
  	unaBase.ui.expandable.init();
});
