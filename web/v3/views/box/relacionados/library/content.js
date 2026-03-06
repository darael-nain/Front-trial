var getElementRel = {	
	item: function(functor, element, item) {
		var checked = '';
		if (item.defecto_rel) {
			checked = 'checked';
		}
		var htmlObject = $(' \
			<tr data-id="'+ item.id +'"> \
				<td></td> \
				<td><input name="relacionado[id]" type="hidden" value="'+ item.id_rel +'"><input style="width:180px!important" readonly name="relacionado[nombre]" type="text" value="'+ item.nombre_rel +'"></td> \
				<td><input readonly style="width:140px;margin-left:3px" name="relacionado[cargo]" placeholder="ninguno" type="text" value="'+ item.cargo_rel +'"></td> \
				<td><input readonly style="width:140px;margin-left:3px" name="relacionado[fono]" placeholder="ninguno" type="text" value="'+ item.fono_rel +'"></td> \
				<td><input readonly style="width:140px;margin-left:3px" name="relacionado[email]" placeholder="ninguno" type="text" value="'+ item.email_rel +'"></td> \
				<td><textarea readonly style="vertical-align:bottom" name="relacionado[observacion]" placeholder="ninguno">'+ item.observacion_rel +'</textarea></td> \
				<td class="center"><input disabled style="display:inline-blok;margin:auto" name="relacionado[defecto]" type="checkbox" '+ checked +'></td> \
			</tr> \
		');

		htmlObject[functor](element);

		/*htmlObject.find('.numeric.currency input').number(true, 2, ',', '.');
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
		});*/

		return htmlObject;
	}
};

