var impuestos = {
	container : $("#impuestos"),
	menubar : $('#menu ul'),
	init: function(id) {
		$.ajax({
	        'url':'/4DACTION/_V3_proxy_getImpuestos',
	        data:{
	          "id" : id,
	          "api" : true
	        },
	        dataType:'json',
	        async: false,
	        success:function(data){
	          impuestos.data = data;
	          impuestos.data.creado = data.creado;
	        }
      	});
      	impuestos.id = impuestos.data.id;
      	$('[name="descripcion_imp"]').val(impuestos.data.descripcion);

      	$('[name="tipo"]').val(impuestos.data.tipo);
      	$('[name="valor"]').val(impuestos.data.valor);
		if (impuestos.data.estado) {
			$('[name="estado"]').prop("checked", true)
		}    
	},
	set: function(status, origen){
		var create = false;
		var edit = false;
		if (status == 'create') {
			var create = true;
			var edit = false;
		}else{
			var create = false;
			var edit = true;
		}
		$.ajax({
			url: window.location.origin + '/4DACTION/_V3_setImpuestos',
			dataType: 'json',
			type: 'POST',
			data:{
				create : create,
				edit : edit,
				origen: origen
			}
		}).done(function(data) {
			if (data.success) {
				if (origen != "dtc") {
					unaBase.loadInto.viewport('/v3/views/ajustes/impuestos/content.shtml?id=' + data.id);
				}else{
					unaBase.loadInto.dialog('/v3/views/ajustes/impuestos/content-dialog.shtml?id=' + data.id, 'CREAR NUEVO IMPUESTO', 'small');
				}
			}else{
				if (data.readonly) {
					toastr.error(NOTIFY.get('ERROR_RECORD_READONLY', 'Error'));
				}else{
					toastr.error(NOTIFY.get('ERROR_INTERNAL', 'Error'));
				}
			}
		});
	},
	menu: function(){
	    unaBase.toolbox.init();
	    unaBase.toolbox.menu.init({
		entity: 'impuestos',
		buttons: ['searchOff','save','exit'],
		data: function(){
			impuestos.data.edit = true;
			impuestos.data.origen = $('[name="origen"]').val(); 
			impuestos.data.descripcion = $('[name="descripcion_imp"]').val(); 
			impuestos.data.tipo = $('[name="tipo"] option:selected').val(); 
			impuestos.data.valor = $('[name="valor"]').val(); 

			impuestos.data.estado = $('[name="estado"]').prop("checked" );	
			// impuestos.data.dtcid = dtc.id;
			impuestos.data.addtipodtc = $('[name="addtipodtc"]').prop("checked" );
			
			return impuestos.data;
		},
		validate: function() {
			return true;
		}
    });
  }
}