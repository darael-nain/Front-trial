
$(document).ready(function(){
	
  	unaBase.ui.block();    
  	area.menu();
  	area.init($('#area').data('id'));
  	unaBase.ui.unblock();
  	unaBase.ui.expandable.init();
});
