var dialog_getElement = {	
	item: function(functor, element, tipo, item) {

		if (tipo == 'compras') {
			if (item) {
				var checked = '';
				if (item.compra_sugerida) {
					checked = 'checked';
				}
				var htmlObject = $(' \
					<tr data-username="0" data-id="'+ item.id +'" data-tipo="compras"> \
						<td><input style="width:100px" name="item_asociado[][tipo]" type="hidden" value="compras"><input style="width:100px" name="item_asociado[][id]" type="hidden" value="'+ item.servicio_id +'"><button class="ui-icon ui-icon-minus remove item" title="Quitar ítem"></button></td> \
						<td><input name="item_asociado[][nombre]" type="search" placeholder="Buscar servicio..." value="'+ item.servicio_nombre +'"></td> \
						<td class="numeric currency">' + currency.symbol + '<input name="item_asociado[][tarifa]" style="width:120px"  type="text" value="'+ item.compra_tarifa +'"></td> \
						<td><textarea name="item_asociado[][observacion]" style="height:100px">'+ item.observacion +'</textarea></td> \
						<td><input name="item_asociado[][sugerido]" type="checkbox" '+ checked +'></td> \
					</tr> \
				');
			}else{
				var htmlObject = $(' \
					<tr data-username="0" data-id="0" data-tipo="compras"> \
						<td><input style="width:100px" name="item_asociado[][tipo]" type="hidden" value="compras"><input style="width:100px" name="item_asociado[][id]" type="hidden"><button class="ui-icon ui-icon-minus remove item" title="Quitar ítem"></button></td> \
						<td><input name="item_asociado[][nombre]" type="search" placeholder="Buscar servicio..."></td> \
						<td class="numeric currency">' + currency.symbol + '<input name="item_asociado[][tarifa]" style="width:120px"  type="text"></td> \
						<td><textarea name="item_asociado[][observacion]" style="height:100px"></textarea></td> \
						<td><input name="item_asociado[][sugerido]" type="checkbox"></td> \
					</tr> \
				');
			}			
		}else{
			if (item) {
				var htmlObject = $(' \
					<tr data-username="0" data-id="'+ item.id +'" data-tipo="ventas"> \
						<td><input style="width:100px" name="item_asociado[][tipo]" type="hidden" value="ventas"><input style="width:100px" name="item_asociado[][id]" type="hidden" value="'+ item.servicio_id +'"><button class="ui-icon ui-icon-minus remove item" title="Quitar ítem"></button></td> \
						<td><input name="item_asociado[][nombre]" type="search" placeholder="Buscar servicio..." value="'+ item.servicio_nombre +'"></td> \
						<td class="numeric currency">' + currency.symbol + '<input name="item_asociado[][tarifa]" style="width:200px" type="text" value="'+ item.venta_tarifa +'"></td> \
					</tr> \
				');
			}else{
				var htmlObject = $(' \
					<tr data-username="0" data-id="0" data-tipo="ventas"> \
						<td><input style="width:100px" name="item_asociado[][tipo]" type="hidden" value="ventas"><input style="width:100px" name="item_asociado[][id]" type="hidden"><button class="ui-icon ui-icon-minus remove item" title="Quitar ítem"></button></td> \
						<td><input name="item_asociado[][nombre]" type="search" placeholder="Buscar servicio..."></td> \
						<td class="numeric currency">' + currency.symbol + '<input name="item_asociado[][tarifa]" style="width:200px" type="text"></td> \
					</tr> \
				');
			}			
		}		

		htmlObject[functor](element);

		htmlObject.find('.numeric.currency input').number(true, 2, ',', '.');
    	htmlObject.find('.numeric.percent input').number(true, 1, ',', '.');

		htmlObject.focusin(function() {     
	      	$(this).find('input[name="item_asociado[][nombre]"]').autocomplete({
	        source: function(request, response) {         
	          $.ajax({
	            url: '/4DACTION/_V3_' + 'getProductoByCategoria',
	            dataType: 'json',
	            data: {
	              q: request.term,
	              id: 0
	            },
	            success: function(data) {             
	              response($.map(data.rows, function(item) {
	                return item;
	              }));
	            },
	            error: function(jqXHR, exception) {
	              toastr.error('No se pudo cargar el listado de items. Error de conexión al servidor.');
	            }
	          });
	        },
	        minLength: 0,
	        delay: 0,
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
	          $(this).val(ui.item.text);
	          $('input[name="item_asociado[][id]"]').val(ui.item.id);	         
	          return false;
	        }

			}).data('ui-autocomplete')._renderItem = function(ul, item) {
			return $('<li><a><strong>' + item.index + ' ' + ((item.gasto_fijo)? '[Gasto Fijo]' : '') + ' ' +  ((item.especial)? '[Especial]' : '') + '</strong><em>' +  item.categoria.text + '</em><span class="highlight">' + item.text + '</span></a></li>').appendTo(ul);
			};
		});

		htmlObject.focusout(function() {
			$(this).find('input[name="item_asociado[][nombre]"]').autocomplete('destroy');
		});

		return htmlObject;
	}
};

