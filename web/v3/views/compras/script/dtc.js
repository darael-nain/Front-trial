$(document).ready(function() {
	var addDtc = function(){
		var container = $('#sheet-compras');
		var validado = container.data('validado');
		var idoc = container.data('id');		
		var porJustificar = container.find('input[name="oc[total_por_justificar]"]').val();
		var tipoGasto = container.find('input[name="oc[tipo_gastos][id]"]').val();

		if (validado) {
			if ((porJustificar > 0 && tipoGasto == 'OC') || (tipoGasto == 'FXR')) {					
				var selectedItem;
				var objItemSelected = {};
				selectedItem = container.find('table.itemsoc > tbody > tr > td input[name="oc[detalle_item][select]"]:checked');

				if (selectedItem.length==0)		
					selectedItem = container.find('table.itemsoc > tbody > tr > td input[name="oc[detalle_item][select]"]');					

				selectedItem.each(function(key,item) {
					var tr = $(this).parentTo('tr');								
					var llaveTitulo = tr.find('input[name="oc[detalle_item][llave_titulo]"]').val();
					var llave = tr.find('input[name="oc[detalle_item][llave]"]').val();
					eval("obj = { 'oc[detalle_item][llave][titulo]"+key+"': '" + llaveTitulo + "' }");
					$.extend(objItemSelected, objItemSelected, obj );
					eval("obj = { 'oc[detalle_item][llave][item]"+key+"': '" + llave + "' }");
					$.extend(objItemSelected,objItemSelected,obj);
				});

				// Cuanta cantidad de titulo y correlativo items oc, en el caso que se cree ítem desde el dtc
				var ct = $('#sheet-compras > table.items > tbody > tr[data-tipo="TITULO"]').length;
				var co = $('#sheet-compras > table.items > tbody > tr').length;
				
				var obj = {"dtc[oc][id]": idoc };


				var objFinal = $.extend({}, obj, objItemSelected);	
				$.ajax({
					url: '/4DACTION/_V3_setDtc',
					dataType: 'json',
					type: 'POST',
					data: objFinal									
				}).done(function(data) {
					unaBase.loadInto.viewport('/v3/views/dtc/content.shtml?id=' + data.id+'&registrado=no&from=oc&ct='+ct+'&co='+co);
				});
			}else{
				var cant = container.find('table.itemsoc > tbody > tr[data-tipo="ITEM"]');
				if (cant.length==1){
					toastr.warning('La compra ya se encuentra justificada en su totalidad.');
				}else{
					if (cant.length>1) {
						toastr.warning('Ya existe ítems justificados en su totalidad, por favor seleccionar faltantes.');
					}
				}
			}
		}else{
			toastr.warning('El gasto aún no se encuentra validada.');
			$('#viewport').scrollTo($("#scrollval"),800);
		}
	}

	var htmlObject;
	htmlObject = $('\
		<ul class="dropdown-menu-dtc" style="position: absolute; top: 25px; right: 0; z-index: 1000; min-width: 150px; text-align: left;"> \
			<li><a href="#" class="create-dtc items"><span class="ui-icon ui-icon-document"></span>Crear documento de compra</a></li> \
			<li><a href="#" class="select-all items"><span class="ui-icon ui-icon-radio-on"></span>Seleccionar todo</a></li> \
			<li><a href="#" class="deselect-all items"><span class="ui-icon ui-icon-radio-off"></span>Deseleccionar todo</a></li> \
		</ul> \
	');

	htmlObject.appendTo('table.items > thead > tr > th:last-of-type').menu().hide();	
	$('button.actions.items').button({
		icons: {
			primary: 'ui-icon-triangle-1-s',
			secondary: 'ui-icon-gear'
		}
	}).click(function() {		
		$('table.items > thead > tr > th:last-of-type > .dropdown-menu-dtc').toggle();
	});

	// Al dar click en una opción
	$('table.items > thead > tr > th:last-of-type a.items').click(function(event) {
		var target = $(event.target);
		$('table.items > thead > tr > th:last-of-type > .dropdown-menu-dtc').toggle();
		if (target.hasClass('select-all') || target.hasClass('deselect-all')) {
			if (target.hasClass('select-all'))
				$('table.items tbody').find('tr input[type="checkbox"][data-selected]').prop('checked', true);
			if (target.hasClass('deselect-all'))
				$('table.items tbody').find('tr input[type="checkbox"][data-selected]').prop('checked', false);
		} else {					
			if (target.hasClass('create-dtc')) {
				addDtc();
			}
		}
		event.preventDefault();
	});
	
});