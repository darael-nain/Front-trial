$(document).ready(function(){
	var container = $('.sheet-detalle-items-oc');
	var id = container.data('id');
	let itemsNegocio = []
  var descripcion = container.find('textarea[name="detail[descripcion_larga]"]').val();
	unaBase.toolbox.init();
    unaBase.toolbox.menu.init({
      entity: 'ItemByCompra',
      buttons: ['save'],
      data: function() {
        return {
        	'id' : id,
          'descripcion_larga' : container.find('textarea[name="detail[descripcion_larga]"]').val()
    	};
      },
      validate: function() {
        return true;
      }
    });

	unaBase.ui.block();
	// traer datos para la lista de negocios, excluir negocio actual
	/*$.ajax({
		url: '/4DACTION/_V3_get_proyectos_compras',
		data: {
			q: ''
		},
		dataType: 'json',
		async: false,
		success: function(data) {
			for (var i = 0, len = data.rows.length; i < len; i++) {
				var current = data.rows[i];
				if (current.id_nv != $('select[name="id_nv"]').val()) {
					var option = $('<option value=' + current.id_nv + '>[' + current.nro + '] ' + current.referencia + '</option>')
					$('select[name="id_nv"]').append(option);
				}
			}
		}
	});*/
	// traer datos para la lista de ítems del negocio actual
	$.ajax({
		url: '/4DACTION/_V3_proxy_get_ItemsProyCompras',
		data: {
			 'oc[negocio][id]': $('[name="id_nv"]').data('id'),
			 'from': 'oc',
			 'title': '@'
		},
		dataType: 'json',
		async: false,
		success: function(data) {
			for (var i = 0, len = data.rows.length; i < len; i++) {
				var current = data.rows[i];
				if (current.id != $('select[name="llave_nv"]').val()) {
					var option = $('<option value=' + current.id + '>' + (current.codigo? '[' + current.codigo + '] ' : '') + current.nombre + '</option>')
					$('select[name="llave_nv"]').append(option);
				}
			}
			
		}
	});

	unaBase.ui.unblock();

	/*$('select[name="id_nv"]').change(function(event) {
		// traer datos para la lista de ítems del negocio actual
		unaBase.ui.block();
		$.ajax({
			url: '/4DACTION/_V3_proxy_get_ItemsProyCompras',
			data: {
				 'oc[negocio][id]': $('select[name="id_nv"]').val(),
				 'from': 'oc',
				 'title': '@'
			},
			dataType: 'json',
			success: function(data) {
				$('select[name="llave_nv"]').find('option').remove();
				$('select[name="llave_nv"]').val('');
				for (var i = 0, len = data.rows.length; i < len; i++) {
					var current = data.rows[i];
					var option = $('<option value=' + current.id + '>' + (current.codigo? '[' + current.codigo + '] ' : '') + current.nombre + '</option>')
					$('select[name="llave_nv"]').append(option);
				}
				unaBase.ui.unblock();
			}
		});
	});*/
	
	$('input[name="id_nv"]').autocomplete({
	    source: function(request, response) {
	        $.ajax({
	            url: '/4DACTION/_V3_get_proyectos_compras',
	            dataType: 'json',
	            data: {
	                q: request.term,
	                origen: "reasociar"
	            },
	            success: function(data) {
	                response($.map(data.rows, function(item) {
	                    return item;
	                }));
	            }
	        });
	    },
	    minLength: 0,
	    delay: 5,
	    position: { my: "left top", at: "left bottom", collision: "flip" },
	    open: function() {
	        $(this).removeClass('ui-corner-all').addClass('ui-corner-top');
	    },
	    close: function() {
	        $(this).removeClass('ui-corner-top').addClass('ui-corner-all');
	    },
	    focus: function(event, ui) {
	        $(this).val(ui.item.text);
	        return false;
	    },
	    select: function(event, ui) {
	        $(this).val('[' + ui.item.nro + '] ' + ui.item.referencia);
	        $(this).data('id', ui.item.id_nv);
	        unaBase.ui.block();
			$.ajax({
				url: '/4DACTION/_V3_proxy_get_ItemsProyCompras',
				data: {
					'oc[negocio][id]': ui.item.id_nv,
					'from': 'oc',
					'title': '@'
				},
				dataType: 'json',
				success: function (data) {
					// Limpiar el select existente
					$('select[name="llave_nv"]').find('option').remove();
					$('select[name="llave_nv"]').val('');
					itemsNegocio = data.rows
					// Preparar opciones para TomSelect
					const options = [];
					for (var i = 0, len = data.rows.length; i < len; i++) {
						var current = data.rows[i];
						options.push({
							id: current.id,
							text: (current.codigo ? '[' + current.codigo + '] ' : '') + current.nombre,
							index: current.codigo || ''
						});
					}
			
					// Inicializar TomSelect
					new TomSelect('select[name="llave_nv"]', {
						options: options,
						valueField: 'id',
						labelField: 'text',
						searchField: 'text',
						onChange: function (value) {
							if (value && value !== '') {
								const selectedItem = this.options[value];
								if (selectedItem) {
									// Asignar el código seleccionado al input correspondiente
									const codigoInput = document.querySelector('input#coditem');
									if (codigoInput) {
										codigoInput.value = selectedItem.index;
									}
								}
							}
						}
					});
			
					unaBase.ui.unblock();
				}
			});
			
	        return false;
	    }

	}).data('ui-autocomplete')._renderItem = function(ul, item) {
	    //return $('<li><a><span>' + item.referencia + '</span></a></li>').appendTo(ul);
		return $(`<li ${item.isBudget ? 'style="background-color: #FFF8DC;"' : ''} ><a><strong class="highlight">Nº ${item.nro }</strong><em>${item.referencia}</em><span>${item.cliente}</span></a></li>`).appendTo(ul);
	};

	$('button.show.negocios').click(function() {
		$('input[name="id_nv"]').autocomplete('search', '@').focus();
	});

	$('button.save-item-change').button({
		icons: {
			primary: 'ui-icon-arrowreturnthick-1-e'
		},
		label: 'Reasociar ítem'
	}).click(function(event) {
		confirm('Quieres reasociar el ítem del gasto al ítem de negocio seleccionado?').done(function(data) {
			if (data) {
				unaBase.ui.block();
				// guardar cambios del ítem
				$.ajax({
					url: '/4DACTION/_V3_changeItemOcFromItemNeg',
					data: {
						id_oc: $('.item-info').data('id-oc'),
						llave_detalle_oc: $('.item-info').data('llave-detalle-oc'),
						id_nv: $('.item-info').data('id-nv'),
						llave_nv: $('.item-info').data('llave-nv'),
						id_nv_new: $('[name="id_nv"]').data('id'),
						llave_nv_new: $('[name="llave_nv"]').val()
					},
					dataType: 'json',
					success: function(data) {
						unaBase.ui.unblock();
						if (data.success) {
							get_items(data.id);
							toastr.success('El ítem se reasoció con éxito.');
						} else {
							toastr.success('No fue posible reasociar el ítem. Otro usuario está bloqueando el registro.');
						}
					}
				});
				// guardar ítems de oc sin guardar folio
				// refrescar ítems de oc
			}
		});
	});

	$('button.save-oc-change').button({
		icons: {
			primary: 'ui-icon-arrowreturnthick-1-e'
		},
		label: 'Reasociar OC Completa (NOUSAR)'
	}).click(async function(event) {
		
				// const asociarOc = (id_oc, llave_detalle_oc, id_nv, id_nv_new, llave_nv_new) => {
				// 	return $.ajax({
				// 		url: '/4DACTION/_V3_changeItemOcFromItemNeg',
				// 		data: {
				// 			id_oc: id_oc,
				// 			llave_detalle_oc: llave_detalle_oc,
				// 			id_nv: id_nv,
				// 			llave_nv: $('.item-info').data('llave-nv'),
				// 			id_nv_new: id_nv_new,
				// 			llave_nv_new: llave_nv_new
				// 		},
				// 		dataType: 'json',
				// 		success: function(data) {
				// 			unaBase.ui.unblock();
				// 			if (data.success) {
				// 				//get_items(data.id);
				// 				toastr.success('El ítem se reasoció con éxito.');
				// 			} else {
				// 				toastr.success('No fue posible reasociar el ítem. Otro usuario está bloqueando el registro.');
				// 			}
				// 		}
				// 	});
				// };
	
				// // Obtenemos todas las filas del tbody con id "items-gastos"
				// const tableItemsOcs = document.querySelectorAll('#items-gastos tbody tr');
				// 
				// for (const t of tableItemsOcs) {
				// 	
				// 	// Suponiendo que la 4ta celda (td) es la que contiene el código
				// 	const codeTd = t.querySelector('td:nth-child(4)');

				// 	// Verificamos si la celda no tiene valor alguno (está vacía)
				// 	if (codeTd && codeTd.textContent.trim() === '') {
				// 		// Si no tiene código, buscamos el input con el nombre del ítem
				// 		const nameInput = t.querySelector('input[name="oc[detalle_item][nombre]"]');
				// 		if (!nameInput) continue; // Si no se encuentra el input, saltar esta fila
				// 		if (nameInput) {
				// 			
				// 			const nameItem = nameInput.value;
				// 			const itemNeg = itemsNegocio.find(i => i.nombre === nameItem);
				// 			if (!itemNeg) continue; // Si no se encuentra el ítem en itemsNegocio, saltar
			
				// 			const llave_nv_new = itemNeg.id;
				// 			const id_oc = $('.item-info').data('id-oc');
				// 			const id_nv = $('.item-info').data('id-nv');
				// 			const id_nv_new = $('[name="id_nv"]').data('id');
				// 			const llave_detalle_oc = t.dataset.llave;
			
				// 			await asociarOc(id_oc, llave_detalle_oc, id_nv, id_nv_new, llave_nv_new);
				// 			console.log('ITEM ACTUALIZADO: ', nameItem)
				// 		}
				// 	}
					
				// }
	
	});
	



	
});
