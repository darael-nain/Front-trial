//web/v3/script/negCotCommon/itemParent.js

var verifySubitems = ()=>{
	let items = document.querySelectorAll('.childItem');
	
	let fail = 0
	for(const item of items){
		if(typeof item.dataset.itemparent === 'undefined' || item.dataset.itemparent === ''  || item.dataset.itemparent === 'undefined' ){
			
			console.warn('error in subitem' + item.querySelector('input[name="item[][nombre]"]').value)
			fail+=1
		}
	}

	return fail

}
var fixSubitems = ()=>{
	let parents = document.querySelectorAll('tr.itemParent');
	let id;
	let element;
	for(const parent of parents){
		id = $(parent).data('id');
		element = parent.nextSibling
		while(element && element.classList.contains('childItem')){
			
			element.dataset.itemparent = id;

			element = element.nextSibling;
		}
		
	}
}
			// simon itemparent

var parentLine =  (item, fields) => {
	// console.warn($(item).data('id'))

	for(const field of fields){
		field.value = 0
		$(field).trigger('blur')
	}
	let isParent = item.classList.contains('itemParent');

	// $.ajax({
	// 	url: '/4DACTION/_V3_itemParent',
	// 	data: {
	// 		isParent: !isParent,
	// 		Llave_NV: $(item).data('id')
	// 	},
	// 	dataType: 'json',
	// 	success: function(res) {
	// 		console.log(res)
	// 	}
	// });
	item.classList.toggle('itemParent')
}

var setParent = (event, element, from) => {
	
		let item = element.closest('tr')
		// let Llave_NV = $(item).data('id')
		let numerics = []
		let fields = []
		$(item).find('.parent.item').remove();
		$(item).find('input[name="item[][codigo]"]').remove();

		fields.push(item.querySelector('input[name="item[][precio_unitario]"]'));
		fields.push(item.querySelector('input[name="item[][subtotal_precio]"]'));

		if(from === 'neg'){
			fields.push(item.querySelector('input[name="item[][costo_unitario_previo]"]'));
		}
		fields.push(item.querySelector('input[name="item[][costo_unitario]"]'));
		// fields.push(item.querySelector('input[name="item[][subtotal_costo_previo]"]'))

		for(const field of fields){
			numerics.push(parseFloat(field.value))
		}
		let sum = numerics.reduce((total, num) => total + num);

		let numericField = $(item).find('.numeric.code');
		let removeBtn = $(item).find('.remove.item');
		numericField.removeClass('numeric');
		numericField.removeClass('code');


		numericField[0].innerHTML = `<button class="ui-icon ui-icon-folder-open toggle categoria" title="Contraer o expandir título"></button>`;
		removeBtn.removeClass('item');
		removeBtn.addClass('itemParent');
		item.classList.remove('item');


		$(item).find('.tipo-documento').empty();
		$(item).find('.numeric.qty').empty();
		$(item).find('.unidad').empty();
		$(item).find('.segunda-cantidad.numeric.qty.abs').empty();
		$(item).find('.horas-extras.numeric.qty.abs').empty();
		$(item).find('.numeric.currency.venta.extended').empty();
		$(item).find('.numeric.currency.costo.previo.unitario').empty();
		$(item).find('.numeric.currency.costo.presupuestado.unitario').empty();
		$(item).find('.fit.aplica-sobrecargo').empty();
		$(item).find('button.clone').removeClass('item').addClass('categoria');
		// let folder = $('<button class="ui-icon toggle categoria ui-icon-folder-open" title="Contraer o expandir título"></button>');
		// $(item).find('.numeric.code').append(folder);


	
		if(from === 'neg'){
			let realCost = parseFloat(item.querySelector('input[name="item[][subtotal_costo_real]"]').value);
			if(realCost){
				alert('La linea posee gasto real por tal mótivo no se puede convertir en item padre')	
			}else if(!sum ){
				parentLine(item, fields)
			}else{
				confirm('La linea seleccionada posee montos definidos, si la conviertes en un item padre, estos montos se eliminaran ¿ deseas continuas ?').done(function(data) {
					if (data)
						parentLine(item, fields)
				});
			}

		}else if(from === 'cot'){			
				parentLine(item, fields);
		}
}