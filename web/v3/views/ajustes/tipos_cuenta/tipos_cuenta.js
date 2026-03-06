var cuenta = {
	container : $("#tiposcuenta"),
	menubar : $('#menu ul'),
	init: function(id) {
		$.ajax({
	        'url':'/4DACTION/_V3_proxy_getTiposCuenta',
	        data:{
	          "id" : id,
	          "api" : true
	        },
	        dataType:'json',
	        async: false,
	        success:function(data){
	          cuenta.data = data;
	          cuenta.data.creado = data.creado;
	        }
      	});
      cuenta.id = cuenta.data.id;
      $('[name="descripcion_tipocuenta"]').val(cuenta.data.descripcion);
      $('[name="codigo_tipocuenta"]').val(cuenta.data.codigo);
      if (cuenta.data.estado) {
      	$('[name="estado_tipocuenta"]').prop("checked", true)
      };      
    
	},
	menu: function(){
	    unaBase.toolbox.init();
	    unaBase.toolbox.menu.init({
		entity: 'tiposcuenta',
		buttons: ['save','exit'],
		data: function(){
			cuenta.data.edit = true;
			cuenta.data.estado = $('[name="estado_tipocuenta"]').prop("checked" );
			cuenta.data.codigo = $('[name="codigo_tipocuenta"]').val();
			cuenta.data.descripcion = $('[name="descripcion_tipocuenta"]').val();
			return cuenta.data;
		},
		validate: function() {
			return true;
		}
    });
  }
}