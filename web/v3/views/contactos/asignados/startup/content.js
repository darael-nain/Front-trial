
$(document).ready(function() {
		var id = $('.form-contact').find('input[name="id"]').val();

		// get servicios - asignados
		$.ajax({
			url: '/4DACTION/_v3_getContactoCatalogo',
			dataType: 'json',
			data:{
				'contacto' : id,
				'asignados' : true 	
			},
          	success: function(data) {          	
	            $.each(data.rows, function(key, item){
	            	if (item.venta_tarifa > 0) {
	            		var target = $('.ui-dialog section.sheet > fieldset > table.items.ventas > tbody').find('button.add.item');
		            	var current = target.parentTo('tr');
						var tipo = target.data('tipo');
						while(!(current.next().html() == undefined || current.next().find('th').length > 0)) {
							current = current.next();
						}	
						dialog_getElement.item('insertAfter', current, tipo, item);
	            	}
	            	if (item.compra_tarifa > 0) {
	            		var target = $('.ui-dialog section.sheet > fieldset > table.items.compras > tbody').find('button.add.item');
		            	var current = target.parentTo('tr');
						var tipo = target.data('tipo');
						while(!(current.next().html() == undefined || current.next().find('th').length > 0)) {
							current = current.next();
						}	
						dialog_getElement.item('insertAfter', current, tipo, item);
	            	}	            	
	            });
        	}
        });
		
		$('.ui-dialog section.sheet > fieldset > table > tbody').find('button.add.item').click(function(){
			var current = $(this).parentTo('tr');
			var tipo = $(this).data('tipo');
			while(!(current.next().html() == undefined || current.next().find('th').length > 0)) {
				current = current.next();
			}	
			dialog_getElement.item('insertAfter', current, tipo);
		});

		$('.ui-dialog section.sheet > fieldset > table > tbody').on('click', 'tr:not(.title) button.remove.item', function() {
			var element = this;
			var title = $(element).parentTo('tr').prevTo('.title');
			var id = $(element).parentTo('tr').data('id');
			var tipo = 	$(element).parentTo('tr').data('tipo');
			if (id > 0) {
				confirm("¿Quieres eliminar el servicio asociado?").done(function(data) {
					if (data) {
						$.ajax({
							url: '/4DACTION/_V3_setContactoCatalogo',
							async: false,
							dataType: 'json',
							data: {
								'id': id,
								'delete' : 'true',
								'tipo' : tipo
							},
							success: function(data) {
								if (data.success) {
									$(element).parentTo('tr').fadeOut(400, function() {
										$(this).remove();
									});
								} else {
									if (data.opened) {
										if (data.readonly)
											toastr.error('No fue posible guardar el item. Otro usuario está bloqueando el registro.');
									} else {
										toastr.warning('Este item ya no existe. Probablemente ya fue removido por otro usuario. Se quitó de todos modos.');
										$(element).parentTo('tr').fadeOut(400, function() {
											$(this).remove();
										});
									}
								}
								// FIXME: colocar garbage collector, delete element
							},
							error: function(xhr, text, error) {
								toastr.error('Falló conexión al servidor.');
							}
						});
					}
				});
			}else {
				$(element).parentTo('tr').fadeOut(400, function() {
					$(this).remove();
				});
			}	
			
		});

});





