
$(document).ready(function(){
  	unaBase.ui.block();    
  	banco.menu();
  	banco.init($('#banco').data('id'));
  	unaBase.ui.unblock();
  	unaBase.ui.expandable.init();
});
