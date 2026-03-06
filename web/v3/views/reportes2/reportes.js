var reportes = {
	container : $("#reportes"),
	menubar : $('#menu ul'),
	init: function(id) {
		$.ajax({
	        'url':'/4DACTION/_V3_proxy_getReportes',
	        data:{
	          "id" : id,
	          "api" : true
	        },
	        dataType:'json',
	        async: false,
	        success:function(data){
	          reportes.data = data;
	          // reportes.data.creado = data.creado;
	        }
      	});
      	reportes.id = reportes.data.id;
      $('[name="descripcion"]').val(reportes.data.descripcion);
      $('[name="origen"]').val(reportes.data.origen);

      $('[name="descripcion_reporte"]').val(reportes.data.descripcion_reporte);

      $('[name="copiara"]').val(reportes.data.copiara);
      $('[name="enviara"]').val(reportes.data.enviara);
      $('[name="hora"]').val(reportes.data.hora);
      // $('[name="periocidad"]').val(reportes.data.periocidad);
      if(reportes.data.periocidad == "TODOS LOS DIAS"){
      	$('[name="periocidad"]').val(1);		
      }else if (reportes.data.periocidad == "TODOS LOS VIERNES") {
      	$('[name="periocidad"]').val(2);		
      }else if (reportes.data.periocidad == "TODOS LOS LUNES") {
      	$('[name="periocidad"]').val(3);		
      }else if (reportes.data.periocidad == "MENSUAL (PRIMER LUNES)") {      	
      	$('[name="periocidad"]').val(4);		
      }




      // $('[name="periocidad"] option:selected').text(reportes.data.periocidad);

      if (reportes.data.estado) {
      	$('[name="estado"]').prop("checked", true)
      };      
    
	},
	menu: function(){
	    unaBase.toolbox.init();
	    unaBase.toolbox.menu.init({
		entity: 'reportes',
		buttons: ['save','exit','send_mail_report_each'],
		data: function(){
			reportes.data.edit = true;
			reportes.data.estado = $('[name="estado"]').prop("checked" );

			// reportes.data.origen = $('[name="origen"]').val();
			// reportes.data.descripcion_reporte = $('[name="descripcion_reporte"]').val();
			// reportes.data.descripcion = $('[name="descripcion"]').val();

			reportes.data.enviara = $('[name="enviara"]').val();
			reportes.data.copiara = $('[name="copiara"]').val();
			var hour = $('[name="hora"]').val();
			reportes.data.hora = $('[name="hora"]').val();
			// reportes.data.periocidad = $('[name="periocidad"]').val();
			reportes.data.periocidad = $('[name="periocidad"] option:selected').text();


			return reportes.data;
		},
		validate: function() {
			return true;
		}
    });
  }
}