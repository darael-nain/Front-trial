$(document).ready(function(){
  	unaBase.ui.block();    
  	reportes.menu();
  	reportes.init($('#reportes').data('id'));
  	unaBase.ui.unblock();
  	unaBase.ui.expandable.init();
});
