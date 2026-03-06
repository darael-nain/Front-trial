var formas = {
	container : $("#formadepago"),
	menubar : $('#menu ul'),
	init: function(id) {
		$.ajax({
	        'url':'/4DACTION/_V3_proxy_getFormaspago',
	        data:{
	          "id" : id,
	          "api" : true
	        },
	        dataType:'json',
	        async: false,
	        success:function(data){
	          formas.data = data;
	          formas.data.creado = data.creado;
	        }
      	});
      formas.id = formas.data.id;
      $('[name="descripcion"]').val(formas.data.descripcion);
      $('[name="observaciones"]').val(formas.data.observaciones);
      if (formas.data.estado) {
      	$('[name="estado"]').prop("checked", true)
      };      
      if (formas.data.personalizado) {
      	$('[name="isCustom"]').prop("checked", true)
      };      
      if (formas.data.compra) {
      	$('[name="compra"]').prop("checked", true)
      };      
      if (formas.data.venta) {
      	$('[name="venta"]').prop("checked", true)
      };      
      
      $('[name="personalizado"]').val(formas.data.suma_dias1);
      // $('[name="periodo"]').val(formas.data.suma_dias1);

      // alert(formas.data.suma_dias1);

      // $('#periodo').val(formas.data.suma_dias1);

      if(formas.data.creado){
      	var info = formas.data.suma_dias1 + " días";
      	$('#periodo option:selected').text(info);
      }

     //  alert($('#periodo option:selected').val());
      
      // $('[name="id_empresa"]').val(formas.data.id_empresa);
      // $('[name="suma_dias1"]').val(formas.data.suma_dias1);
      // $('[name="suma_dias2"]').val(formas.data.suma_dias2);
      // $('[name="suma_dias3"]').val(formas.data.suma_dias3);
      


	},
	menu: function(){
	    unaBase.toolbox.init();
	    unaBase.toolbox.menu.init({
		entity: 'formaspago',
		buttons: ['save','exit'],
		data: function(){
			formas.data.edit = true;
			formas.data.descripcion = $('[name="descripcion"]').val();
			formas.data.observaciones = $('[name="observaciones"]').val();
			formas.data.estado = $('[name="estado"]').prop("checked" );	
						
			formas.data.suma_dias1 = $('[name="personalizado"]').val();

			// formas.data.id_empresa = $('[name="id_empresa"]').val();
			// formas.data.suma_dias1 = $('[name="suma_dias1"]').val();
			// formas.data.suma_dias2 = $('[name="suma_dias2"]').val();
			// formas.data.suma_dias3 = $('[name="suma_dias3"]').val();

			formas.data.personalizado = $('[name="isCustom"]').prop("checked");
			formas.data.venta = $('input#venta').prop("checked");
			formas.data.compra = $('input#compra').prop("checked");
			console.log(formas.data);
			return formas.data;
		},
		validate: function() {
			return true;
		}
    });
  }
}