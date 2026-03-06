
$(document).ready(function() {
		var id = $('.form-contact').find('input[name="id"]').val();

		// get relacionados
		$.ajax({
			url: '/4DACTION/_v3_getRelacionadosById',
			dataType: 'json',
			data:{
				'contacto[id]' : id
			},
          	success: function(data) {
          		if (data.rows.length > 0) {
          			$.each(data.rows, function(key, item){
		           	 	var target = $('.ui-dialog section.sheet > fieldset > table.items.relacionados > tbody');
		            	var current = target;
						while(!(current.next().html() == undefined || current.next().find('th').length > 0)) {
							current = current.next();
						}
						dialog_getElementRel.item('insertAfter', current, item);
	           	 	});
            	}else{
            		$('.ui-dialog section.sheet > fieldset > table.items.relacionados > thead').remove();
            		var htmlObject = $('<tr><td colspan="7"><div style="padding:5px 0 5px 0">No existen contactos relacionados.</div></td></tr>');
            		var target = $('section.sheet > fieldset > table.items.relacionados > tbody');
	            	var current = target;
					while(!(current.next().html() == undefined || current.next().find('th').length > 0)) {
						current = current.next();
					}
					htmlObject['insertAfter'](current);
            	}
        	}
        });


});
