
$(document).ready(function() { 
	// DEPRECATED
	// console.warn("from event listener detail")
	// $('section.sheet > table').on('click', 'tbody button.clone.item', function() {
		
	// 	console.warn("from event listener");
	// 	var element = $(this);
	// 	var cloneItem = function() {
			
	// 		//var current = $(this).parentTo('tr');
	// 		var current = element.parentTo('tr');

	// 		current.find('.profile.item').tooltipster('destroy');

	// 		var cloned = current.removeClass('focused').clone(true)
	// 		var oldId = cloned.attr('id');
	// 		cloned.removeUniqueId().uniqueId(); // Logs tiempo real
	// 		cloned.insertAfter(current).removeData('id');
	// 		cloned[0].dataset.id = '';

	// 		current.find('button.profile.item').tooltipster({
	// 			delay: 0,
	// 			interactiveAutoClose: false,
	// 			contentAsHTML: true
	// 		});

	// 		cloned.find('button.profile.item').tooltipster({
	// 			delay: 0,
	// 			interactiveAutoClose: false,
	// 			contentAsHTML: true
	// 		});

	// 		cloned.trigger('afterClone'); // Logs tiempo real
	// 		cloned.trigger('afterClone'); // Logs tiempo real
	// 		if (!modoOffline) {
	// 			updateSubtotalTitulos(element);
	// 			updateSubtotalItems();
	// 			$('section.sheet table.items > tfoot > tr > th.info').trigger('refresh');
	// 		}

	// 		cloned.find('.remove.item').visible();
	// 		cloned.find('.costo.real input').val(0);

	// 		//simon itemparent start
	// 		if(current.hasClass('itemParent')){
	// 			cloned[0].dataset.itemparent = current.data('id');
	// 			if(typeof cloned[0].dataset.itemparent !== 'undefined'){
	// 				cloned.addClass('childItem');		
	// 			cloned.find('.parent.item').remove();		
	// 			}
	// 		}else if(current.hasClass('childItem')){
	// 			let parentKey = current[0].dataset.itemparent;
	// 			cloned[0].dataset.itemparent = parentKey

	// 			if(typeof cloned[0].dataset.itemparent !== 'undefined'){
	// 				cloned.addClass('childItem');
	// 			cloned.find('.parent.item').remove();				
	// 			}
			
	// 		}
		
	// 		//simon itemparent end


	// 		cloned.find('[name="item[][costo_unitario]"]').trigger('focus').trigger('blur');
	// 		cloned.find('.detail.item').remove();

	

	// 		$('section.sheet table.items > tfoot > tr > th.info').trigger('refresh');

		

	// 	};

	// 	if ($('#main-container').data('clone-item-no-ask')) {
	// 		cloneItem();
	// 	} else {
	// 		var htmlObject = $('<div>¿Confirmas que deseas duplicar el ítem?<br><br><label><input type="checkbox"> No volver a preguntar para esta cotización.</label></div>');
	// 		htmlObject.find('input[type="checkbox"]').change(function(event) {
	// 			if ($(event.target).is(':checked')) {
	// 				$('#main-container').data('clone-item-no-ask', true);
	// 			}
	// 		});
	// 		confirm(htmlObject).done(function(data) {
	// 			if (data) {
	// 				cloneItem();
	// 			}
	// 		});
	// 	}
	// });
});