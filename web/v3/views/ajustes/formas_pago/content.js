
$(document).ready(function(){
  	unaBase.ui.block();    
  	formas.menu();
  	formas.init($('#formadepago').data('id'));
  	unaBase.ui.unblock();
  	unaBase.ui.expandable.init();
});
