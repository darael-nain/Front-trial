var banco = {
	container : $("#banco"),
	menubar : $('#menu ul'),
	init: function(id) {
		$.ajax({
	        'url':'/4DACTION/_V3_proxy_getBanco',
	        data:{
	          "id" : id,
	          "api" : true
	        },
	        dataType:'json',
	        async: false,
	        success:function(data){
	          banco.data = data;
	          banco.data.creado = data.creado;
	        }
      	});
      banco.id = banco.data.id;
      $('[name="banco"]').val(banco.data.banco);
      $('[name="codigo_banco"]').val(banco.data.codigo_banco);
      $('[name="telefono"]').val(banco.data.telefono);
      
      if (banco.data.estado) {
      	$('[name="estado"]').prop("checked", true)
      };   
      if (banco.data.nomina_bci) {
      	$('[name="nomina_bci"]').prop("checked", true)
      };      
	},
	menu: function(){
	    unaBase.toolbox.init();
	    unaBase.toolbox.menu.init({
		entity: 'banco',
		buttons: ['save','exit'],
		data: function(){
			banco.data.edit = true;
			banco.data.banco = $('[name="banco"]').val();
			banco.data.codigo_banco = $('[name="codigo_banco"]').val();
			banco.data.telefono = $('[name="telefono"]').val();
			banco.data.estado = $('[name="estado"]').prop("checked");		
			banco.data.nomina_bci = $('[name="nomina_bci"]').prop("checked");		
			return banco.data;
		},
		validate: function() {
			return true;
		}
    });
  }
}