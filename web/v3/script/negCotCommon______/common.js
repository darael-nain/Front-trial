business.item.duplicate = item => {

		var element = $(item);
		var cloneItem = function() {
			
			//var current = $(this).parentTo('tr');
			var current = element.parentTo('tr');

			current.find('.profile.item').tooltipster('destroy');

			var cloned = current.removeClass('focused').clone(true)
			var oldId = cloned.attr('id');
			cloned.removeUniqueId().uniqueId(); // Logs tiempo real
			cloned.insertAfter(current).removeData('id');
			cloned[0].dataset.id = '';

			current.find('button.profile.item').tooltipster({
				delay: 0,
				interactiveAutoClose: false,
				contentAsHTML: true
			});

			cloned.find('button.profile.item').tooltipster({
				delay: 0,
				interactiveAutoClose: false,
				contentAsHTML: true
			});

			cloned.trigger('afterClone'); // Logs tiempo real
			cloned.trigger('afterClone'); // Logs tiempo real
			if (!modoOffline) {
				updateSubtotalTitulos(element);
				updateSubtotalItems();
				$('section.sheet table.items > tfoot > tr > th.info').trigger('refresh');
			}

			cloned.find('.remove.item').visible();
			if(unaBase.doc.type === "NOTA DE VENTA"){
				cloned.find('.costo.real input').val(0);
			}

			//simon itemparent start
			if(current.hasClass('itemParent')){
				cloned[0].dataset.itemparent = current.data('id');
				if(typeof cloned[0].dataset.itemparent !== 'undefined'){
					cloned.addClass('childItem');		
				cloned.find('.parent.item').remove();		
				}
			}else if(current.hasClass('childItem')){
				let parentKey = current[0].dataset.itemparent;
				cloned[0].dataset.itemparent = parentKey

				if(typeof cloned[0].dataset.itemparent !== 'undefined'){
					cloned.addClass('childItem');
				cloned.find('.parent.item').remove();				
				}
			
			}
		
			//simon itemparent end


			cloned.find('[name="item[][costo_unitario]"]').trigger('focus').trigger('blur');
			cloned.find('.detail.item').remove();

	

			$('section.sheet table.items > tfoot > tr > th.info').trigger('refresh');

		};

		if ($('#main-container').data('clone-item-no-ask')) {
			cloneItem();
		} else {
			var htmlObject = $('<div>¿Confirmas que deseas duplicar el ítem?<br><br><label><input type="checkbox"> No volver a preguntar para esta cotización.</label></div>');
			htmlObject.find('input[type="checkbox"]').change(function(event) {
				if ($(event.target).is(':checked')) {
					$('#main-container').data('clone-item-no-ask', true);
				}
			});
			confirm(htmlObject).done(function(data) {
				if (data) {
					cloneItem();
				}
			});
		}
}
business.showTotals = true;
var currencyChange = () => {
	
}
business.showSobrecargos = function(data) {
	if(unaBase.doc.modoCine){
    	console.warn("***********sobrecargo detalle_cinemagica");
        var index_utilidad_bruta = fastArrayObjectSearch(data.rows, 'id', 1);
        var index_costos_fijos = fastArrayObjectSearch(data.rows, 'id', 4);
        var index_comision_agencia = fastArrayObjectSearch(data.rows, 'id', 6);
        try{
            blockCinemagica.find('[name="sobrecargo[1][porcentaje]"]').val(data.rows[index_utilidad_bruta].porcentaje);
            blockCinemagica.find('[name="sobrecargo[1][valor]"]').val(data.rows[index_utilidad_bruta].valor);

            blockCinemagica.find('[name="sobrecargo[4][porcentaje]"]').val(data.rows[index_costos_fijos].porcentaje);
            blockCinemagica.find('[name="sobrecargo[4][valor]"]').val(data.rows[index_costos_fijos].valor);

            blockCinemagica.find('[name="sobrecargo[6][porcentaje]"]').val(data.rows[index_comision_agencia].porcentaje);
            blockCinemagica.find('[name="sobrecargo[6][valor]"]').val(data.rows[index_comision_agencia].valor);

            blockCinemagica.find('[name="sobrecargo[1][subtotal]"]').val(valor_pelicula_guardado);
    		blockCinemagica.find('[name="sobrecargo[1][subtotal]"]').data('old-value', valor_pelicula_guardado);

            blockCinemagica.find('[name="cotizacion[cinemagica][director][porcentaje]"]').val(director_porcentaje_guardado);

        }catch(err){
        	console.warn(err);
        }
	}else{
        		
        //console.warn("*********************sobrecargo detalle");
		var target = $('section.sobrecargos > ul');
		var htmlObject;
		$.each(data.rows, function(key, item) {
			if (item.id == 1 && v3_sobrecargos_cinemagica) {
				var subtotal = '<strong style="font-weight: bold;">Val. película</strong>';
				var style = 'font-weight: bold; zoom: 1.1; margin-right: -7px;';
				var readonly = '';
			} else {
				var subtotal = 'Subtotal';
				var style = '';
				var readonly = 'readonly';
			}
			if (typeof selected_currency == 'undefined')
				htmlObject = $(' \
					<li data-id="' + item.id + '"' + ((item.ajuste)? ' data-ajuste="true"': '') + ((item.items)? ' data-items="true"': '') + ((item.total)? ' data-total="true"': ( (item.sobre_subtotal_venta)? ' data-subtotal="true"' : ''  )) + '> \
						<span>' + item.nombre + ((item.items)? ' <sup>(*)</sup>' : '') + ((item.total)? ' <sup>(**)</sup>' :  ( (item.sobre_subtotal_venta)? ' <sup>(***)</sup>' : '' )  ) + '</span> \
						<span class="numeric percent"><input class="' + ((item.costo)? 'costo': 'utilidad') + '"' + ((scDirectInput)? ' readonly' : '') + ' required type="text" name="sobrecargo[' + item.id + '][porcentaje]" value="' + item.porcentaje + '"> %</span> \
						<span class="numeric currency">' + localCurrency + ' <input class="' + ((item.costo)? 'costo': 'utilidad') + '"' + ((!scDirectInput)? ' readonly' : ((item.ajuste)? ' readonly' : '')) + ' type="text" name="sobrecargo[' + item.id + '][valor]" value="' + ((item.id == 5 && !item.costo && item.cerrado.enabled && item.total)? parseFloat(item.valor) : (item.porcentaje * parseFloat(((item.items)? $('[name="cotizacion[precios][subtotal]"]').data('aplica-sobrecargo') : $('[name="cotizacion[precios][subtotal]"]').val())) / 100)).toFixed(currency.decimals) + '"></span> \
						<span style="width: 70px; display: inline-block;">' + subtotal + '</span> \
						<span class="numeric currency">' + localCurrency + ' <input style="' + style + '" ' + readonly + ' type="text" name="sobrecargo[' + item.id + '][subtotal]" value="0"></span> \
						<span class="option"><label title="Oculta el valor del sobrecargo en la vista de impresión, repartiéndolo entre los ítems afectos."><input type="checkbox" name="sobrecargo[' + item.id + '][cerrado]" value="true"' + ((item.cerrado.enabled)? ' checked': '') + ((!item.cerrado.writable)? ' disabled': '') + '> Cerrado</label></span> \
						<span style="display: none;"><label title="Permite que el sobrecargo sea considerado automáticamente como ' + ((item.costo)? 'gasto' : 'utilidad') + ' real, sin la necesidad de generar orden de compra."><input readonly type="checkbox" name="sobrecargo[' + item.id + '][real]" value="true"' + ((typeof item.real != 'undefined')? ((item.real)? ' checked': '') : '') + '> ' + ((item.costo)? 'Gasto' : 'Utilid.') + ' R.</label></span> \
					</li> \
				');
			else
				htmlObject = $(' \
					<li data-id="' + item.id + '"' + ((item.ajuste)? ' data-ajuste="true"': '') + ((item.items)? ' data-items="true"': '') + ((item.total)? ' data-total="true"' :  ( (item.sobre_subtotal_venta)? ' data-subtotal="true"' : ''  )  ) + '> \
						<span>' + item.nombre + ((item.items)? ' <sup>(*)</sup>' : '') + ((item.total)? ' <sup>(**)</sup>' :  ( (item.sobre_subtotal_venta)? ' <sup>(***)</sup>' : '' )  ) + '</span> \
						<span class="numeric percent"><input class="' + ((item.costo)? 'costo': 'utilidad') + '"' + ((scDirectInput)? ' readonly' : '') + ' required type="text" name="sobrecargo[' + item.id + '][porcentaje]" value="' + item.porcentaje + '"> %</span> \
						<span class="numeric currency">' + localCurrency + ' <input class="' + ((item.costo)? 'costo': 'utilidad') + '"' + ((!scDirectInput)? ' readonly' : ((item.ajuste)? ' readonly' : '')) + ' type="text" name="sobrecargo[' + item.id + '][valor]" value="' + (((item.id == 5 && !item.costo && item.cerrado.enabled && item.total)? parseFloat(item.valor) : (item.porcentaje * parseFloat(((item.items)? $('[name="cotizacion[precios][subtotal]"]').data('aplica-sobrecargo') : $('[name="cotizacion[precios][subtotal]"]').val())) / 100.00)) / exchange_rate).toFixed(2) + '"></span> \
						<span style="width: 70px; display: inline-block;">' + subtotal + '</span> \
						<span class="numeric currency">' + localCurrency + ' <input style="' + style + '" ' + readonly + ' type="text" name="sobrecargo[' + item.id + '][subtotal]" value="0"></span> \
						<span class="option"><label title="Oculta el valor del sobrecargo en la vista de impresión, repartiéndolo entre los ítems afectos."><input type="checkbox" name="sobrecargo[' + item.id + '][cerrado]" value="true"' + ((item.cerrado.enabled)? ' checked': '') + ((!item.cerrado.writable)? ' disabled': '') + '> Cerrado</label></span> \
						<span style="display: none;"><label title="Permite que el sobrecargo sea considerado automáticamente como ' + ((item.costo)? 'gasto' : 'utilidad') + ' real, sin la necesidad de generar orden de compra."><input readonly type="checkbox" name="sobrecargo[' + item.id + '][real]" value="true"' + ((typeof item.real != 'undefined')? ((item.real)? ' checked': '') : '') + '> ' + ((item.costo)? 'Gasto' : 'Utilid.') + ' R.</label></span> \
					</li> \
				');

			if (typeof selected_currency == 'undefined')
				htmlObject.find('.numeric.currency input').number(true, currency.decimals, ',', '.');
			else
				htmlObject.find('.numeric.currency input').number(true, 2, ',', '.');
			htmlObject.find('.numeric.percent input').number(true, 2, ',', '.');

			htmlObject.find('.numeric.percent input').bind('focus', function() {
				if (typeof $(this).data('value') == 'undefined')
					$(this).data('value', $(this).val());
				$(this).unbind('.format').number(true, 6, ',', '.').val($(this).data('value'));
			});

			htmlObject.find('.numeric.percent input').bind('focusout', function(event) {
				$(this).data('value', $(this).val()).unbind('.format').number(true, 2, ',', '.');
			});

			if (typeof item.valor != 'undefined') {
				if (typeof selected_currency == 'undefined')
					htmlObject.find('.numeric.currency input').val(item.valor.toFixed(currency.decimals));
				else
					htmlObject.find('.numeric.currency input').val((item.valor / exchange_rate).toFixed(2));
			}

			htmlObject.find('.numeric.percent input').val(item.porcentaje);
			htmlObject.find('.numeric.percent input').data('value', item.porcentaje);

			if (item.ajuste)
				htmlObject.css('opacity', 0.5).find('.percent').invisible();
			if (scDirectInput)
				htmlObject.find('.percent').invisible();

			target.append(htmlObject);
		});
	}

};
business.item.docs = [];
business.item.set = items => {
	business.item.docs = items.rows;
}
business.staff = {
	checkShowTotals: () => {
		//business.staff.checkShowTotals()
		
		// verifica permiso para ver todas las cotizaciones o ver todos los negocios dependiendo del caso.
		let viewAllDocs = unaBase.doc.type === "COTIZACION" ? access._476 : access._445;
		let itemsShowed = business.item.docs.filter(item => !item.hidden);
		let itemsHidden = business.item.docs.filter(item => item.hidden);
		if(!viewAllDocs && (itemsShowed.length < business.item.docs.length) && unaBase.doc.isCurrentUserStaff){
			let titles= document.querySelectorAll('table.items tbody tr.title, table.items tbody tr.itemParent');
			// let parents = document.querySelectorAll('table.items.cotizacion tbody tr.itemParent');
			titles.forEach(title => {
				// title.querySelector(`input[name="item[][subtotal_precio]"]`).remove();
				// title.querySelector(`input[name="item[][subtotal_costo]"]`).remove();
				// title.querySelector(`input[name="item[][utilidad]"]`).remove();
				title.querySelectorAll('th.numeric').forEach(element => {
					while(element.hasChildNodes()){
						element.removeChild(element.firstElementChild)
						element.textContent = ""
					}
				});

			});
		}
	}
}

business.checkDifference = id => {
	return new Promise((resolve, reject) => {
		fetch('/4DACTION/_V3_CheckTotalDifferenceNv?id='+id)
			.then( res => res.json())
			.then(data => {
				unaBase.doc.hasDifference = data.hasDifference;
				console.warn("from negocios.checkDifference");
				console.warn(data);
				resolve(data);
			}).catch(err => {
				reject(err);
			});
	});

}

business.getSobrecargoData = (sobrecargosPlantilla) => {
	// 
   	let urlSobrecargo = "";
	if (!$('section.sheet').data('new') || (sobrecargosPlantilla && unaBase.doc.fromTemplate)){
		urlSobrecargo = '/4DACTION/_V3_getSobrecargoByCotizacion'; // desde cotización o parametros

	// }else if(sobrecargosPlantilla && !unaBase.doc.fromTemplate){
	}else{
		urlSobrecargo = '/4DACTION/_V3_getSobrecargo';  // desde parametros 
	}
	// else if(sobrecargosPlantilla && unaBase.doc.fromTemplate){
	// 	urlSobrecargo = '/4DACTION/_V3_getSobrecargoByCotizacion'; // desde cotización o parametros
	// }

	$.ajax({
		url: urlSobrecargo,
		dataType: 'json',
		async: false,
		cache: false,
		data: {
			id: $('section.sheet').data('id')
		},
		success: business.showSobrecargos
	});
}





unaBase.ready(() => {


});