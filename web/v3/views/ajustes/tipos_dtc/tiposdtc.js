var dtc = {
	container : $("#tiposdtc"),
	menubar : $('#menu ul'),
	init: function(id) {
		$.ajax({
	        'url':'/4DACTION/_V3_proxy_getTiposdtc',
	        data:{
	          "id" : id,
	          "api" : true
	        },
	        dataType:'json',
	        async: false,
	        success:function(data){
                dtc.data = data;
	          dtc.data.creado = data.creado;
	        }
      	});
      dtc.id = dtc.data.id;
      $('[name="descripcion"]').val(dtc.data.descripcion);
      $('[name="correlativo_sugerido"]').val(dtc.data.correlativo_sugerido);

                  if(dtc.data.docSii) document.querySelector('input[name="descripcion"]').setAttribute('readonly', true);
      // $('[name="id_impuesto"]').val(dtc.data.id_impuesto);
      // var imp_desc = dtc.data.descripcion_imp

      // for (var i = 0; i < imp_desc.length; i++){   

      //       $('[name="imp_desc"]').append('<option value="'+imp_desc.des[i]+'" selected="selected">'+ imp_desc.des[i] +'</option>');
      // }



      $('[name="ctble_tipodocsoftland"]').val(dtc.data.ctble_tipodocsoftland);
      $('[name="abreviatura"]').val(dtc.data.abreviatura);
      $('[name="ctble_tipodocsoftlandventa"]').val(dtc.data.ctble_tipodocsoftlandventa);

      if (dtc.data.valido) {
      	$('[name="valido"]').prop("checked", true)
      };  
      if (dtc.data.oc) {
      	$('[name="oc"]').prop("checked", true)
      };  
      if (dtc.data.especial) {
      	$('[name="especial"]').prop("checked", true)
      };  
      if (dtc.data.libro_c) {
      	$('[name="libro_c"]').prop("checked", true)
      };  
      if (dtc.data.libro_boletas) {
      	$('[name="libro_boletas"]').prop("checked", true)
      };  
      if (dtc.data.ventas) {
      	$('[name="ventas"]').prop("checked", true)
      };  
      if (dtc.data.afecto_ventas) {
      	$('[name="afecto_ventas"]').prop("checked", true)
      };  
      if (dtc.data.ventas_default) {
      	$('[name="ventas_default"]').prop("checked", true)
      };  
      if (dtc.data.justifica_automatico) {
      	$('[name="justifica_automatico"]').prop("checked", true)
      };  
      if (dtc.data.negocio) {
      	$('[name="negocio"]').prop("checked", true)
      };  
      if (dtc.data.contrato_jornada) {
      	$('[name="contrato_jornada"]').prop("checked", true)
      };  
      if (dtc.data.afecto_horas_extras) {
      	$('[name="afecto_horas_extras"]').prop("checked", true)
      };  
      if (dtc.data.boleta_leycine) {
      	$('[name="boleta_leycine"]').prop("checked", true)
      };  
      if (dtc.data.excluir_gastos) {
      	$('[name="excluir_gastos"]').prop("checked", true)
      };  
      if (dtc.data.valor_usd) {
      	$('[name="valor_usd"]').prop("checked", true)
      };      
    
	},
	menu: function(){
	    unaBase.toolbox.init();
	    unaBase.toolbox.menu.init({
		entity: 'tiposdtc',
		buttons: ['save','exit', 'create_impuesto_from_tipodtc'],
		data: function(){
			dtc.data.edit = true;
			dtc.data.valido = $('[name="valido"]').prop("checked" );
			dtc.data.oc = $('[name="oc"]').prop("checked" );
			dtc.data.especial = $('[name="especial"]').prop("checked" );
			dtc.data.libro_c = $('[name="libro_c"]').prop("checked" );
			dtc.data.libro_boletas = $('[name="libro_boletas"]').prop("checked" );
			dtc.data.ventas = $('[name="ventas"]').prop("checked" );
			dtc.data.afecto_ventas = $('[name="afecto_ventas"]').prop("checked" );
			dtc.data.ventas_default = $('[name="ventas_default"]').prop("checked" );
			dtc.data.justifica_automatico = $('[name="justifica_automatico"]').prop("checked" );
			dtc.data.negocio = $('[name="negocio"]').prop("checked" );
			dtc.data.contrato_jornada = $('[name="contrato_jornada"]').prop("checked" );
			dtc.data.afecto_horas_extras = $('[name="afecto_horas_extras"]').prop("checked" );
			dtc.data.boleta_leycine = $('[name="boleta_leycine"]').prop("checked" );
			dtc.data.excluir_gastos = $('[name="excluir_gastos"]').prop("checked" );
			dtc.data.valor_usd = $('[name="valor_usd"]').prop("checked" );

			dtc.data.descripcion =  $('[name="descripcion"]').val();
			dtc.data.correlativo_sugerido = $('[name="correlativo_sugerido"]').val();
			dtc.data.id_impuesto = $('[name="id_impuesto"]').val();
			dtc.data.ctble_tipodocsoftland = $('[name="ctble_tipodocsoftland"]').val();
			dtc.data.abreviatura = $('[name="abreviatura"]').val();
			dtc.data.ctble_tipodocsoftlandventa = $('[name="ctble_tipodocsoftlandventa"]').val();





			return dtc.data;
		},
		validate: function() {
			return true;
		}
    });
  }
}