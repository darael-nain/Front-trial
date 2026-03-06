var contact = {
	verifyDuplicate : function(id = null, rut= null){
	  // var contacto = {
	  //   id : idContacto,
	  //   rut: containerContacto.find('input[name="contact[rut]"]').val(),
	  //   nombre: containerContacto.find('input[name="contact[nombre]"]').val(),
	  //   paterno: containerContacto.find('input[name="contact[paterno]"]').val(),
	  //   razon: containerContacto.find('input[name="contact[razon]"]').val()       
	  // }
	  return new Promise((resolve, reject) => {
		  $.ajax({
		    url: '/4DACTION/_V3_verificaContactoDuplicado',
		    dataType: 'json',
		    data: {
		    	id,
		    	rut
		    },
		    async: false,
		    success: function(data) {
		    	resolve(data);
		      if (data.success) {
		        // var nombre = "";
		        // $.each(data.contactos, function(key,item){
		        //   nombre = item.nombre_completo;
		        // });
		        // alert("El rut ingresado ya se encuentra asociado a otro contacto. Pertenece a:<br/><br/>"+ nombre);
		        // containerContacto.find('input[name="contact[rut]"]').val('').focus();
		        // containerContacto.find('input[name="contact[validar_rut]"]').prop('checked', false);
		      }
		    },
		    error: function(err){
		    	reject(err);
		    }
		  });

	  })
	}
}