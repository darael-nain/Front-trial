var pago = {
	container : $("#tipospago"),
	menubar : $('#menu ul'),
	init: function(id) {
		$.ajax({
	        'url':'/4DACTION/_V3_proxy_getTipospago',
	        data:{
	          "id" : id,
	          "api" : true
	        },
	        dataType:'json',
	        async: false,
	        success:function(data){
	          pago.data = data;
	          pago.data.creado = data.creado;
	        }
      	});
      	pago.id = pago.data.id;
      	
      $('[name="descripcion"]').val(pago.data.descripcion);
      $('[name="codigo"]').val(pago.data.codigo);
      if (pago.data.estado) {
      	$('[name="estado"]').prop("checked", true)
      };      
    
	},
	menu: function(){
	    unaBase.toolbox.init();
	    unaBase.toolbox.menu.init({
		entity: 'tipospago',
		buttons: ['save','exit'],
		data: function(){
			
			pago.data.edit = true;
			pago.data.estado = $('[name="estado"]').prop("checked" );
			pago.data.ingreso = $('input#ingreso').prop("checked" );
			pago.data.egreso = $('input#egreso').prop("checked" );
			pago.data.codigo = $('[name="codigo"]').val();
			pago.data.descripcion = $('[name="descripcion"]').val();
			return pago.data;
		},
		validate: function() {
			return true;
		}
    });
  }
}