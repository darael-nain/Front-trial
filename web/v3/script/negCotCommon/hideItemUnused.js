//web/v3/script/negCotCommon/hideItemUnused.js

var updateVistaItems = function(first_time) {
	// 
	if (typeof first_time != 'boolean') {
		$('button.toggle.all.ui-icon-folder-collapsed').trigger('click');
	}
	let hide_empty_items = $('input[name="cotizacion[ver_solo_items_usados]"]').is(':checked');
	//$('table.items tbody tr:not(.title)').each(function(key, item) {

	$('table.items tbody tr').each(function(key, item) {
		let subtotal_precio = parseFloat($(item).find('input[name="item[][subtotal_precio]"]').val());
		let subtotal_costo = parseFloat($(item).find('input[name="item[][subtotal_costo]"]').val());
		let subtotal_costo_real_item = $(item).find('input[name="item[][subtotal_costo_real]"]').val();
		let subtotal_costo_real = parseFloat($(item).find('input[name="item[][subtotal_costo_real]"]').val());

		// if (first_time) {
		// 	$(item).show();
		// }

		if (subtotal_precio == 0 && subtotal_costo == 0 &&  (typeof subtotal_costo_real_item !== 'undefined' ? subtotal_costo_real == 0 : true) && item.dataset.hidden !== "true") {
			if (hide_empty_items)
				// $(item).hide();
				item.style.display = 'none';
			else {
				if (typeof first_time != 'boolean')
					$(item).show();
				item.style.display = '';
			}
		}
	});
};

