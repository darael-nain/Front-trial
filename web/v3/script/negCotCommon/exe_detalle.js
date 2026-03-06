//REAPER

totales.adicionales.init();
var inputTypeSC = '';
    if(unaBase.doc.reaperMode)
    inputTypeSC= 'sc';
  
$('section.sheet').on('change', '[name="item[][separate_sc]"]', function (event) {
	sobrecargos.updateSobrecargos()	
});



$('section.sheet footer .block-totales').on('blur', `[name^="sobrecargo"][name$="[porcentaje-${inputTypeSC}]"]`, function(event) {
				

	if (v3_sobrecargos_cinemagica && typeof chain == 'undefined') {
		// actualiza porcentaje de item
		var item;
		var precio_unitario = 0;
	}

	if (!$(this).prop('readonly')) {
		contentChanged = true;
		contentReady = false;
		if ($(event.target).parentTo('ul').find('li[data-total="true"]').length > 1 || $(event.target).prop('name') == 'sobrecargo[1][porcentaje]') {
			if ($('section.sheet').data('no-update')) { // Optimización cálculos cinemágica
				updateItemsPorcentaje(event);
				sobrecargos.updateSobrecargos();
			} else {
				for (var i = 0; i <= 10; i++) {
					if (v3_sobrecargos_cinemagica) {
						updateItemsPorcentaje(event);
					}
					sobrecargos.updateSobrecargos();
				}
			}
		} else
		sobrecargos.updateSobrecargos();
	}
});


//$('section.sheet footer .block-totales').on('blur', '[name^="sobrecargo-info"][name$="[porcentaje-info]"]', function(event) {
$('section.sheet footer .block-totales').on('blur', 'ul.sc-info.lisc input', function(event) {
	sobrecargos.calculaInformativos();
});



$('section.sheet footer .block-totales').on('blur', `[name^="sobrecargo"][name$="[valor-${inputTypeSC}]"]`, function(event) {


	//REAPER OPTIMIZACION TEST
	//Esto actualiza la diferencia en la seccion totales, la diferencia bajo el TOTAL A CLIENTE en comparacion son los sobrecargos
	
	if (event.isSimulated )
		return false;

	
	if (!scDirectInput) {

		var valor_sobrecargo_anterior = parseFloat($(this).data('old-value'));
		var valor_sobrecargo_actual = parseFloat($(this).val());
		if (valor_sobrecargo_anterior != valor_sobrecargo_actual) {
			var base_total_sobrecargo = parseFloat($('input[name="cotizacion[montos][subtotal_neto]"]').val());



			var porcentaje_sobrecargo = 0;
			if ($(this).parentTo('li').find('[name^="sobrecargo"][name$="[porcentaje]"]').prop('readonly')) {
				var subtotal_sobrecargo_previo = ($(this).parentTo('li').prev().length)? $(this).parentTo('li').prev().find('[name^="sobrecargo"][name$="[subtotal]"]').val() : $('input[name="cotizacion[precios][subtotal]"]').val();
				porcentaje_sobrecargo = (valor_sobrecargo_actual / subtotal_sobrecargo_previo) * 100;
			} else
				porcentaje_sobrecargo = (valor_sobrecargo_actual / base_total_sobrecargo) * 100;

			$(this).parentTo('li').find('[name^="sobrecargo"][name$="[porcentaje]"]').val(porcentaje_sobrecargo.toFixed(2));

			sobrecargos.updateSobrecargos();
		}
		$(this).triggerHandler('focus');

		if ($(this).parentTo('li').find('[name^="sobrecargo"][name$="[porcentaje]"]').prop('readonly'))
			$('[name="cotizacion[descuento][valor]"]').triggerHandler('blur');

		
	}else{
		sobrecargos.updateSobrecargos();
	}

});

$('section.sheet footer').on('change', 'li[data-ajuste="true"] [name^="sobrecargo"][name$="[cerrado]"]', function() {
	totales.checkAjuste(true);
});







//-----------------------   Eventos   --------------------------
//----------------------------------------------------------------

//Para select de sobrecargos a categorias modo reaper

let selectOptions = document.querySelectorAll('section.sobrecargos ul.sc li select');

selectOptions.forEach(b => b.addEventListener("change", (event) => {
	console.log('-------------------- Selección de  SC Categorias -----------------------');
	
	// let cats = document.querySelectorAll('table.items.cotizacion tr.title');
	// b.innerHTML='';
	// cats.forEach(function (res_ele) {

	// 	b.innerHTML+= `<option value="${res_ele.dataset.id}">${res_ele.querySelector('input[name="item[][nombre]"]').value}</option>`;

	// });

	//sobrecargos.fillSCCategorias();
	sobrecargos.calculate()


}));

selectOptions.forEach(b => b.addEventListener("focusin", (event) => {
	console.log('-------------------- charge new  de  SC Categorias -----------------------');
	
	// let cats = document.querySelectorAll('table.items.cotizacion tr.title');
	// b.innerHTML='';
	// cats.forEach(function (res_ele) {

	// 	b.innerHTML+= `<option value="${res_ele.dataset.id}">${res_ele.querySelector('input[name="item[][nombre]"]').value}</option>`;

	// });

	sobrecargos.fillSCCategorias();
	//	sobrecargos.calculate()


}));


if (unaBase.parametros.ocultar_montos_adicionales) {
    document.querySelectorAll('.ocultar-montos-adicionales').forEach(function(element) {
        element.style.display = 'none';
    });
} 





