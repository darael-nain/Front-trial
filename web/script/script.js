$(document).ready(function(){
    $("#frmBuscarProveedor").validate({
		  rules: {
			field: "required"
		  }
	});
});

$(document).ready(function() {
  $('body').click(function(event) {
    if ($(event.target).is('h3')) {
      $(event.target).toggleClass('destacado');
    }
  });
});
