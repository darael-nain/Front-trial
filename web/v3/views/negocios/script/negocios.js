var negocios = {
	init: function() {
		negocios.id = 0;
		negocios.tipo = "NOTA DE VENTA"; // NOTA DE VENTA, COTIZACION
		negocios.folio = "";
		negocios.cerrado_compras = false;
		negocios.cerrado_ventas = false;
		negocios.estado = "EN PROCESO"; // EN PROCESO, CERRADO, NULO
	},
	display: function() {
		
		switch(negocios.estado) {
		    case "EN PROCESO":
		        break;
		    case "CERRADO":
		    	// general
		    	$('.titulofinal').prop('readonly', true);

		    	// items
		        break;
		}
	},
	changeVersion: async () => {
		const url = `${location.origin}/4DACTION/_force_setGeneralParamsNV`;
        let formData = new FormData();
        formData.append('id', nv.id);
        formData.append('sid', unaBase.sid.encoded());
        formData.append('id_version', nv.id_version);
        
		const response = await axios.post(url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
		toastr.success('version actualizada!')
	}
}
