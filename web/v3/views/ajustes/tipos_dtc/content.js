
$(document).ready(function(){
  	unaBase.ui.block();    
  	dtc.menu();
  	dtc.init($('#tiposdtc').data('id'));
  	unaBase.ui.unblock();
  	unaBase.ui.expandable.init();
});
