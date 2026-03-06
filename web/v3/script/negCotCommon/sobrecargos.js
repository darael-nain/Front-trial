

//-----------------------   Eventos   --------------------------
//----------------------------------------------------------------
$('section.sheet footer .block-totales').on('blur ', '[name^="sobrecargo-info"][name$="[porcentaje-info]"]', function (event) {
	if (event.type == "focusout") {
		event.target.value = unaBase.utilities.transformNumber(event.target.value, 'view', true)
		calculaInformativos();
	}
	else
		event.target.value = unaBase.utilities.transformNumber(event.target.value, 'view')
});

$('section.sheet footer .block-totales').on('blur ', '[name^="sobrecargo"][name$="[porcentaje]"]', function (event) {


	if (event.type == "focusout") {
		event.target.value = unaBase.utilities.transformNumber(event.target.value, 'view', true)
		sobrecargos.calculate();
	}
	else
		event.target.value = unaBase.utilities.transformNumber(event.target.value, 'view')

});



//-----------------------   Variables   --------------------------
//----------------------------------------------------------------

var sobrecargos = {};

//-----------------------   Modo antiguo ----------------------------
//----------------------------------------------------------------



sobrecargos.updateSobrecargos = (chain) => {


	if (!unaBase.reaperMode) {

		let selectedFeeAmount = 0;



		let selectedApplyFee = $('table.items tbody').find('tr:not(.title)').has('input[type="checkbox"][name="item[][aplica_sobrecargo]"]:checked');
		for (let i = 0; i < selectedApplyFee.length; i++) {
			let dataValue = selectedApplyFee[i].dataset.feepre;
			if (dataValue != '' && dataValue != "[ Ninguno ]" && dataValue != "undefined") {
				selectedFeeAmount++;
			}
		}

		// if (arrSobregargosPreFinal.length > 0 && selectedFeeAmount > 0) {
		// 	updateSobrecargosPredefinidos(chain, arrSobregargosPreFinal);

		// }else{

		// todo sigue igual que siempre
		let subtotal_precios = parseFloat($('input[name="cotizacion[precios][subtotal]"]').val());
		let aplica_sobrecargo = parseFloat($('input[name="cotizacion[precios][subtotal]"]').data('aplica-sobrecargo'));
		let director_internacional = parseFloat($('input[name="cotizacion[precios][subtotal]"]').data('director-internacional'));
		let subtotal_sobrecargo = subtotal_precios;
		let valor_sobrecargo;

		$('section.sobrecargos ul.sc li').each(function () {

			let subtotal_sobrecargo_anterior, porcentaje;
			$(this).find('[name^="sobrecargo"][name$="[porcentaje]"]').validateNumbers();
			porcentaje = parseFloat($(this).find('[name^="sobrecargo"][name$="[porcentaje]"]').data('value'));

			if ($(this).data('items')) {

				if (typeof selected_currency == 'undefined') {
					if (!scDirectInput) {
						if (v3_sobrecargos_cinemagica) {
							if ($(this).data('id') == 1) {
								valor_sobrecargo = parseFloat((((aplica_sobrecargo - director_internacional) / (1 - (porcentaje / 100))) - (aplica_sobrecargo - director_internacional)).toFixed(currency.decimals));
							} else {
								valor_sobrecargo = parseFloat(((aplica_sobrecargo / (1 - (porcentaje / 100))) - aplica_sobrecargo).toFixed(currency.decimals));
							}
						} else
							valor_sobrecargo = parseFloat((porcentaje * aplica_sobrecargo / 100).toFixed(currency.decimals));
					} else
						valor_sobrecargo = parseFloat(($(this).find('[name^="sobrecargo"][name$="[valor]"]').val()));
				} else {
					if (!scDirectInput) {
						if (v3_sobrecargos_cinemagica) {
							if ($(this).data('id') == 1) {
								valor_sobrecargo = parseFloat((((aplica_sobrecargo - director_internacional) / (1 - (porcentaje / 100))) - (aplica_sobrecargo - director_internacional)).toFixed(2));
							} else {
								valor_sobrecargo = parseFloat(((aplica_sobrecargo / (1 - (porcentaje / 100))) - aplica_sobrecargo).toFixed(2));
							}
						} else
							valor_sobrecargo = parseFloat((porcentaje * aplica_sobrecargo / 100.00).toFixed(2));

					} else
						valor_sobrecargo = parseFloat(($(this).find('[name^="sobrecargo"][name$="[valor]"]').val()));
				}
				if (v3_sobrecargos_cinemagica && $(this).data('id') == 1) {
					subtotal_sobrecargo += (!isNaN(valor_sobrecargo)) ? valor_sobrecargo - director_internacional : 0;
				} else {
					subtotal_sobrecargo += (!isNaN(valor_sobrecargo)) ? valor_sobrecargo : 0;
				}
			} else {
				if ($(this).data('total')) {
					subtotal_sobrecargo_anterior = (!isNaN(subtotal_sobrecargo)) ? subtotal_sobrecargo : 0;

					if (!$(this).data('ajuste')) {
						var sobrecargos_sobre_total = $('section.sobrecargos li[data-total="true"]:not([data-ajuste="true"])').length;

						if (sobrecargos_sobre_total == 1 || sobrecargos_sobre_total == 0) {
							if (v3_sobrecargos_cinemagica)
								var subtotal_sobrecargo_primero = parseFloat($('.block-totales input[name="sobrecargo[1][subtotal]"]').val());
							if (typeof selected_currency == 'undefined') {
								if (v3_sobrecargos_cinemagica) {
									subtotal_sobrecargo = (!isNaN(parseFloat((subtotal_sobrecargo_primero / (1 - porcentaje / 100)).toFixed(currency.decimals)))) ? parseFloat((subtotal_sobrecargo_primero / (1 - porcentaje / 100)).toFixed(0)) : subtotal_sobrecargo_primero;
									valor_sobrecargo = parseFloat((subtotal_sobrecargo * (porcentaje / 100)).toFixed(currency.decimals));
								} else {
									subtotal_sobrecargo = (!isNaN(parseFloat((subtotal_sobrecargo_anterior / (1 - porcentaje / 100)).toFixed(currency.decimals)))) ? parseFloat((subtotal_sobrecargo_anterior / (1 - porcentaje / 100)).toFixed(0)) : subtotal_sobrecargo_anterior;
									valor_sobrecargo = parseFloat((subtotal_sobrecargo - subtotal_sobrecargo_anterior).toFixed(currency.decimals));
								}
							} else {
								if (v3_sobrecargos_cinemagica) {
									subtotal_sobrecargo = (!isNaN(parseFloat((subtotal_sobrecargo_primero / (1.00 - porcentaje / 100.00)).toFixed(2)))) ? parseFloat((subtotal_sobrecargo_primero / (1.00 - porcentaje / 100.00)).toFixed(2)) : subtotal_sobrecargo_primero;
									valor_sobrecargo = parseFloat((subtotal_sobrecargo * (porcentaje / 100)).toFixed(2));
								} else {
									subtotal_sobrecargo = (!isNaN(parseFloat((subtotal_sobrecargo_anterior / (1.00 - porcentaje / 100.00)).toFixed(2)))) ? parseFloat((subtotal_sobrecargo_anterior / (1.00 - porcentaje / 100.00)).toFixed(2)) : subtotal_sobrecargo_anterior;
									valor_sobrecargo = parseFloat((subtotal_sobrecargo - subtotal_sobrecargo_anterior).toFixed(2));
								}
							}
						}

						if (sobrecargos_sobre_total == 2) {
							var total_neto = parseFloat($('input[name="cotizacion[ajuste]"]').val());
							if (typeof selected_currency == 'undefined') {
								if (!scDirectInput)
									valor_sobrecargo = parseFloat((porcentaje * total_neto / 100).toFixed(currency.decimals));
								else
									valor_sobrecargo = parseFloat(($(this).find('[name^="sobrecargo"][name$="[valor]"]').val()));
							} else {
								if (!scDirectInput)
									valor_sobrecargo = parseFloat((porcentaje * total_neto / 100.00).toFixed(2));
								else
									valor_sobrecargo = parseFloat(($(this).find('[name^="sobrecargo"][name$="[valor]"]').val()));
							}
							subtotal_sobrecargo += (!isNaN(valor_sobrecargo)) ? valor_sobrecargo : 0;
						}
					}
				} else {
					if (!$(this).data('subtotal')) {
						if (!scDirectInput)
							valor_sobrecargo = parseFloat((porcentaje * subtotal_sobrecargo / 100).toFixed(currency.decimals));
						else
							valor_sobrecargo = parseFloat(($(this).find('[name^="sobrecargo"][name$="[valor]"]').val()));
					}
					else {
						if (typeof selected_currency == 'undefined') {
							if (!scDirectInput)
								valor_sobrecargo = parseFloat((porcentaje * subtotal_precios / 100).toFixed(currency.decimals));
							else
								valor_sobrecargo = parseFloat(($(this).find('[name^="sobrecargo"][name$="[valor]"]').val()));
						} else {
							if (!scDirectInput)
								valor_sobrecargo = parseFloat((porcentaje * subtotal_sobrecargo / 100.00).toFixed(2));
							else
								valor_sobrecargo = parseFloat(($(this).find('[name^="sobrecargo"][name$="[valor]"]').val()));
						}
					}
					subtotal_sobrecargo += (!isNaN(valor_sobrecargo)) ? valor_sobrecargo : 0;
				}
			}

			if ($(this).data('ajuste')) {
				if (parseFloat($('input[name="cotizacion[ajuste]"]').data('original-value')) != 0)
					$('input[name="cotizacion[ajuste]"]').data('original-value', $('input[name="cotizacion[ajuste]"]').val())
				else
					$('input[name="cotizacion[ajuste]"]').data('original-value', $('input[name="cotizacion[montos][subtotal_neto]"]').val())

				valor_sobrecargo = parseFloat($(this).find('[name^="sobrecargo"][name$="[valor]"]').val());
				subtotal_sobrecargo += (!isNaN(valor_sobrecargo)) ? valor_sobrecargo : 0;

				if (typeof selected_currency == 'undefined')
					$(this).find('[name^="sobrecargo"][name$="[subtotal]"]').val(subtotal_sobrecargo.toFixed(currency.decimals));
				else
					$(this).find('[name^="sobrecargo"][name$="[subtotal]"]').val(subtotal_sobrecargo.toFixed(2));
			} else {
				if (typeof selected_currency == 'undefined') {
					$(this).find('[name^="sobrecargo"][name$="[subtotal]"]').val(subtotal_sobrecargo.toFixed(currency.decimals));
					if (!scDirectInput)
						$(this).find('[name^="sobrecargo"][name$="[valor]"]').val(valor_sobrecargo.toFixed(currency.decimals));
				} else {
					$(this).find('[name^="sobrecargo"][name$="[subtotal]"]').val(subtotal_sobrecargo.toFixed(2));
					if (!scDirectInput)
						$(this).find('[name^="sobrecargo"][name$="[valor]"]').val(valor_sobrecargo.toFixed(2));
				}
			}
		});



		//REAPER temporal descomentar para modo funky/comentar codigo arriba
		//FUNKY

		// 	let selectedFeeAmount = 0;
		// 	let selectedApplyFee = $('table.items tbody').find('tr:not(.title)').has('input[type="checkbox"][name="item[][aplica_sobrecargo]"]:checked');
		// 	for (let i = 0; i < selectedApplyFee.length; i++) {
		// 		let dataValue = selectedApplyFee[i].dataset.feepre;
		// 		if (dataValue != '' && dataValue != "[ Ninguno ]" &&  dataValue== 'object') {
		// 			selectedFeeAmount ++;
		// 		}
		// 	}

		// 	if (arrSobregargosPreFinal.length > 0 && selectedFeeAmount > 0) {
		// 		sobrecargos.updateSobrecargosPredefinidos(chain, arrSobregargosPreFinal);

		// 	}else{

		// 		todo sigue igual que siempre

		// 		let subtotal_precios = parseFloat($('input[name="cotizacion[precios][subtotal]"]').val());
		// 		let aplica_sobrecargo = parseFloat($('input[name="cotizacion[precios][subtotal]"]').data('aplica-sobrecargo'));
		// 		let director_internacional = parseFloat($('input[name="cotizacion[precios][subtotal]"]').data('director-internacional'));
		// 		let director_internacional = 0;
		// 		let subtotal_sobrecargo = subtotal_precios;
		// 		let valor_sobrecargo;

		// 		REAPER toneg
		// 		funky
		// 		let lis = document.querySelectorAll("section.sobrecargos ul.sc li");
		// 		let sc1;
		// 		END REAPER

		// 		for(let li of lis){ 
		// 			liQuery = $(li);
		// 			let id = liQuery.data('id');
		// 			let liValor = parseFloat(liQuery.find('[name^="sobrecargo"][name$="[valor]"]').val());

		// 			let subtotal_sobrecargo_anterior, porcentaje;
		// 			liQuery.find('[name^="sobrecargo"][name$="[porcentaje]"]').validateNumbers();
		// 			porcentaje = parseFloat(liQuery.find('[name^="sobrecargo"][name$="[porcentaje]"]').data('value'));

		// 			if (liQuery.data('items')) {

		// 				if (typeof selected_currency == 'undefined') {
		// 					if (!scDirectInput) {
		// 						if (v3_sobrecargos_cinemagica) {
		// 							if (id == 1) {
		// 								valor_sobrecargo = parseFloat((((aplica_sobrecargo-director_internacional)/(1-(porcentaje/100)))-(aplica_sobrecargo-director_internacional)).toFixed(currency.decimals));
		// 							} else {
		// 								valor_sobrecargo = parseFloat(((aplica_sobrecargo/(1-(porcentaje/100)))-aplica_sobrecargo).toFixed(currency.decimals));
		// 							}
		// 						} else
		// 						REAPER toneg temporal
		// 							valor_sobrecargo = parseFloat((porcentaje * aplica_sobrecargo / 100).toFixed(currency.decimals));
		// 							funky
		// 							valor_sobrecargo = parseFloat(((aplica_sobrecargo/(1-(porcentaje/100)))-aplica_sobrecargo).toFixed(currency.decimals));
		// 							if(id==1)
		// 							sc1 = valor_sobrecargo;

		// 					} else
		// 						valor_sobrecargo = liValor;
		// 				} else {
		// 					if (!scDirectInput) {
		// 						if (v3_sobrecargos_cinemagica) {
		// 							if (id == 1) {
		// 								valor_sobrecargo = parseFloat((((aplica_sobrecargo-director_internacional)/(1-(porcentaje/100)))-(aplica_sobrecargo-director_internacional)).toFixed(2));
		// 							} else {
		// 								valor_sobrecargo = parseFloat(((aplica_sobrecargo/(1-(porcentaje/100)))-aplica_sobrecargo).toFixed(2));
		// 							}
		// 						} else
		// 							valor_sobrecargo = parseFloat((porcentaje * aplica_sobrecargo / 100.00).toFixed(2));

		// 					} else
		// 						valor_sobrecargo = liValor;
		// 				}
		// 				if (v3_sobrecargos_cinemagica && id == 1) {
		// 					subtotal_sobrecargo+= (!isNaN(valor_sobrecargo))? valor_sobrecargo - director_internacional : 0;
		// 				} else {
		// 					subtotal_sobrecargo+= (!isNaN(valor_sobrecargo))? valor_sobrecargo : 0;
		// 				}
		// 			} else {
		// 				if (liQuery.data('total')) {
		// 					subtotal_sobrecargo_anterior = (!isNaN(subtotal_sobrecargo))? subtotal_sobrecargo : 0;

		// 					if (!liQuery.data('ajuste')) {
		// 						var sobrecargos_sobre_total = $('section.sobrecargos li[data-total="true"]:not([data-ajuste="true"])').length;

		// 						if (sobrecargos_sobre_total == 1 || sobrecargos_sobre_total == 0) {
		// 							if (v3_sobrecargos_cinemagica)
		// 								var subtotal_sobrecargo_primero = parseFloat($('.block-totales input[name="sobrecargo[1][subtotal]"]').val());
		// 							if (typeof selected_currency == 'undefined') {
		// 								if (v3_sobrecargos_cinemagica) {
		// 									subtotal_sobrecargo = (!isNaN(parseFloat((subtotal_sobrecargo_primero / (1 - porcentaje / 100)).toFixed(currency.decimals))))? parseFloat((subtotal_sobrecargo_primero / (1 - porcentaje / 100)).toFixed(0)) : subtotal_sobrecargo_primero;
		// 									valor_sobrecargo = parseFloat((subtotal_sobrecargo * (porcentaje / 100)).toFixed(currency.decimals));
		// 								} else {
		// 									subtotal_sobrecargo = (!isNaN(parseFloat((subtotal_sobrecargo_anterior / (1 - porcentaje / 100)).toFixed(currency.decimals))))? parseFloat((subtotal_sobrecargo_anterior / (1 - porcentaje / 100)).toFixed(0)) : subtotal_sobrecargo_anterior;
		// 									valor_sobrecargo = parseFloat((subtotal_sobrecargo - subtotal_sobrecargo_anterior).toFixed(currency.decimals));
		// 								}
		// 							} else {
		// 								if (v3_sobrecargos_cinemagica) {
		// 									subtotal_sobrecargo = (!isNaN(parseFloat((subtotal_sobrecargo_primero / (1.00 - porcentaje / 100.00)).toFixed(2))))? parseFloat((subtotal_sobrecargo_primero / (1.00 - porcentaje / 100.00)).toFixed(2)) : subtotal_sobrecargo_primero;
		// 									valor_sobrecargo = parseFloat((subtotal_sobrecargo * (porcentaje / 100)).toFixed(2));
		// 								} else {
		// 									subtotal_sobrecargo = (!isNaN(parseFloat((subtotal_sobrecargo_anterior / (1.00 - porcentaje / 100.00)).toFixed(2))))? parseFloat((subtotal_sobrecargo_anterior / (1.00 - porcentaje / 100.00)).toFixed(2)) : subtotal_sobrecargo_anterior;
		// 									valor_sobrecargo = parseFloat((subtotal_sobrecargo - subtotal_sobrecargo_anterior).toFixed(2));
		// 								}
		// 							}
		// 						}

		// 						if (sobrecargos_sobre_total == 2) {
		// 							var total_neto = parseFloat($('input[name="cotizacion[ajuste]"]').val());
		// 							if (typeof selected_currency == 'undefined') {
		// 								if (!scDirectInput)
		// 									valor_sobrecargo = parseFloat((porcentaje * total_neto / 100).toFixed(currency.decimals));
		// 								else
		// 									valor_sobrecargo = liValor;
		// 							} else {
		// 								if (!scDirectInput)
		// 									valor_sobrecargo = parseFloat((porcentaje * total_neto / 100.00).toFixed(2));
		// 								else
		// 									valor_sobrecargo = liValor;
		// 							}
		// 							subtotal_sobrecargo+= (!isNaN(valor_sobrecargo))? valor_sobrecargo : 0;
		// 						}
		// 					}
		// 				} else {
		// 					if (!liQuery.data('subtotal')) {
		// 						if (!scDirectInput)
		// 						REAPER toneg temporal
		// 							funky
		// 							valor_sobrecargo = parseFloat((porcentaje * subtotal_sobrecargo / 100).toFixed(currency.decimals));

		// 							if (id == 3) {
		// 								valor_sobrecargo = parseFloat((porcentaje *  (subtotal_sobrecargo - valor_sobrecargo) / 100).toFixed(currency.decimals));
		// 							} else {
		// 								if (id == 4) {

		// 									valor_sobrecargo = parseFloat(( ( subtotal_sobrecargo / (1 - (porcentaje/100) ) - subtotal_sobrecargo) ).toFixed(currency.decimals));
		// 								} else {
		// 									valor_sobrecargo = parseFloat((porcentaje * subtotal_sobrecargo / 100).toFixed(currency.decimals));
		// 								}
		// 							}


		// 						else
		// 							valor_sobrecargo = liValor;


		// 					}
		// 					else {
		// 						if (typeof selected_currency == 'undefined') {
		// 							if (!scDirectInput){
		// 								REAPER toneg temporal
		// 							funky
		// 							valor_sobrecargo = parseFloat((porcentaje * subtotal_precios / 100).toFixed(currency.decimals));		

		// 								if (id == 4) {

		// 									valor_sobrecargo = parseFloat(( ( subtotal_sobrecargo / (1 - (porcentaje/100) )- subtotal_sobrecargo) ).toFixed(currency.decimals));
		// 								} else {
		// 									valor_sobrecargo = parseFloat((porcentaje * subtotal_precios / 100).toFixed(currency.decimals));	
		// 								}
		// 							}
		// 							else
		// 								valor_sobrecargo = liValor;
		// 						} else {
		// 							if (!scDirectInput)
		// 								valor_sobrecargo = parseFloat((porcentaje * subtotal_sobrecargo / 100.00).toFixed(2));
		// 							else
		// 								valor_sobrecargo = liValor;
		// 						}
		// 					}
		// 					subtotal_sobrecargo+= (!isNaN(valor_sobrecargo))? valor_sobrecargo : 0;
		// 				}
		// 			}

		// 			if (liQuery.data('ajuste')) {
		// 				if (parseFloat($('input[name="cotizacion[ajuste]"]').data('original-value')) != 0)
		// 					$('input[name="cotizacion[ajuste]"]').data('original-value', $('input[name="cotizacion[ajuste]"]').val())
		// 				else
		// 					$('input[name="cotizacion[ajuste]"]').data('original-value', $('input[name="cotizacion[montos][subtotal_neto]"]').val())

		// 				valor_sobrecargo = liValor;
		// 				subtotal_sobrecargo+= (!isNaN(valor_sobrecargo))? valor_sobrecargo : 0;

		// 				if (typeof selected_currency == 'undefined')
		// 					liQuery.find('[name^="sobrecargo"][name$="[subtotal]"]').val(subtotal_sobrecargo.toFixed(currency.decimals));
		// 				else
		// 					liQuery.find('[name^="sobrecargo"][name$="[subtotal]"]').val(subtotal_sobrecargo.toFixed(2));
		// 			} else {
		// 				if (typeof selected_currency == 'undefined') {
		// 					liQuery.find('[name^="sobrecargo"][name$="[subtotal]"]').val(subtotal_sobrecargo.toFixed(currency.decimals));
		// 					if (!scDirectInput)
		// 						liQuery.find('[name^="sobrecargo"][name$="[valor]"]').val(valor_sobrecargo.toFixed(currency.decimals));
		// 				} else {
		// 					liQuery.find('[name^="sobrecargo"][name$="[subtotal]"]').val(subtotal_sobrecargo.toFixed(2));
		// 					if (!scDirectInput)
		// 						liQuery.find('[name^="sobrecargo"][name$="[valor]"]').val(valor_sobrecargo.toFixed(2));
		// 				}
		// 			}


		// 	}
		// }



		if (typeof chain == 'undefined')
			sobrecargos.updateSubtotalSobrecargos();
		else
			calculaInformativos();


	} else {
		//REAPER ->> NO BORRAR LINEA
		if (document.querySelector('input[name="cotizacion[ajuste]"]').value == "")
			if (totales.summaryNegocioData.rows)
				document.querySelector('input[name="cotizacion[ajuste]"]').value = unaBase.utilities.transformNumber(totales.summaryNegocioData.rows[0].utilidad_costo.indicador.total_neto.value, 'int');

		sobrecargos.calculate()

	}


}


sobrecargos.updateSubtotalSobrecargos = () => {

	var subtotal_sobrecargos = 0;
	$('section.sobrecargos [name^="sobrecargo"][name$="[valor]"]').each(function () {
		// cinemagica, excluir costo fijo (4 = costo fijo)
		if ((v3_sobrecargos_cinemagica && $(this).closest('li').data('id') != 4) || !v3_sobrecargos_cinemagica) {
			subtotal_sobrecargos += parseFloat($(this).val());
		}
	});
	// Cinemágica
	if (v3_sobrecargos_cinemagica) {
		var director_internacional = parseFloat($('[name="cotizacion[precios][subtotal]"]').data('director-internacional'));
		$('[name="cotizacion[sobrecargos][subtotal]"]').val(subtotal_sobrecargos - director_internacional);
	} else {
		$('[name="cotizacion[sobrecargos][subtotal]"]').val(subtotal_sobrecargos);
	}
	totales.updateDescuento();
}

sobrecargos.updateSobrecargosPredefinidos = (chain, arrSobregargosPreFinal) => {
	var subtotal_precios = parseFloat($('input[name="cotizacion[precios][subtotal]"]').val());

	$('section.sobrecargos li').each(function () {
		var sobrecargoActual = $(this).data('nombre');

		// actualia montos aplicables por fee recorreindo cada item
		var selectedCurrentFee = $('table.items tbody').find('tr[data-feepre="' + sobrecargoActual + '"]').has('input[type="checkbox"][name="item[][aplica_sobrecargo]"]:checked');

		// update porcentaje y montos aplicables fee y 
		for (var i = 0; i < arrSobregargosPreFinal.length; i++) {

			if (arrSobregargosPreFinal[i].sobrecargo == sobrecargoActual) {

				arrSobregargosPreFinal[i].monto_aplicable = 0;
				for (var x = 0; x < selectedCurrentFee.length; x++) {
					var valueFormated = selectedCurrentFee[x].querySelector('[name="item[][subtotal_precio]"]').value;
					valueFormated = valueFormated.replace(/\./g, '');
					var valueRaw = valueFormated.replace(/\,/g, '.');
					arrSobregargosPreFinal[i].monto_aplicable += parseFloat(valueRaw);
				}

				// actualiza los procentajes por fee
				var percent = parseFloat($(this).find('[name="sobrecargo[' + $(this).data('id') + '][porcentaje]"]').val());
				arrSobregargosPreFinal[i].porcentaje = parseFloat(percent);
			}
		}

		var results = arrSobregargosPreFinal.filter(function (arrSobregargosPreFinal) { return arrSobregargosPreFinal.sobrecargo == sobrecargoActual; });
		var obj = (results.length > 0) ? results[0] : null;
		if (obj) {
			var nombreCampoValor = 'sobrecargo[' + $(this).data('id') + '][valor]';
			var nombreCampoSubtotal = 'sobrecargo[' + $(this).data('id') + '][subtotal]';
			var valor_sobrecargo = parseFloat((obj.porcentaje * obj.monto_aplicable / 100).toFixed(currency.decimals));
			var subtotal_sobrecargo = obj.monto_aplicable + valor_sobrecargo;
			$(this).find('input[name="' + nombreCampoValor + '"]').val(valor_sobrecargo);
			$(this).find('input[name="' + nombreCampoSubtotal + '"]').val(subtotal_sobrecargo.toFixed(currency.decimals));
		}
	});

	if (typeof chain == 'undefined')
		sobrecargos.updateSubtotalSobrecargos();

}



function calculaSobrecargoManual(event) {


	//CINEMAGICA

	let sobrecargo = event.currentTarget.attributes.id.value;

	let total = $(`input[name="sobrecargo[1][subtotal]"]`);
	// let valorActual = $(`input[name="${sobrecargo}"]`);

	// valorActual= valorActual[0].value;
	// valorActual=valorActual.replaceAll ( ".", "");
	// valorActual=valorActual.replaceAll ( ",", ".");

	// valorActual=parseInt(valorActual);	

	total = total[0].value;
	total = total.replaceAll(".", "");
	total = total.replaceAll(",", ".");

	total = parseInt(total);



	let valor = event.currentTarget.value;

	valor = valor.replaceAll(".", "");
	valor = valor.replaceAll(",", ".");

	valor = parseInt(valor);

	let ajustado = 0;

	if (sobrecargo == "sobrecargo[6]") {


		ajustado = valor * 100 / (total + valor);
	} else if (sobrecargo == "sobrecargo[4]") {


		ajustado = valor * 100 / (total);
	}


	$(`input[name="${sobrecargo}[porcentaje]"]`).val(ajustado);


	calcValoresCinemagica();


}






function calculaInformativos() {
	try {
		//DISEÑADO PARA FUNKY

		//ARREGLAR ESTA FUNCION ---> DEBE QUEDAR GENERAL
		let section_sc = document.querySelector('section.sobrecargos');
		let scs = section_sc.getElementsByTagName('li');
		let infos = document.querySelector('.sc-info').getElementsByTagName('li')
		let valorAnterior = unaBase.utilities.transformNumber(document.querySelector('li[data-ajuste="true"]').getElementsByTagName('input')[1].value)
		let acumulado = 0


		for (i = 0; i < infos.length; i++) {
			let item = infos[i];
			let res = 0;
			let anterior;
			let percent = item.getElementsByTagName('input')[0].value;
			percent = percent.replaceAll(".", "");
			percent = percent.replaceAll(",", ".");
			let sc1 = document.querySelector('.sc').getElementsByTagName('li')[0].getElementsByTagName('input')[1].value
			let sc2 = document.querySelector('.sc').getElementsByTagName('li')[1].getElementsByTagName('input')[1].value
			sc1 = sc1.replaceAll(".", "");
			sc1 = sc1.replaceAll(",", ".");

			// switch (item.dataset.id) {
			// 	case '6':

			// 		res = sc1 * (percent / 100);

			// 		break;
			// 	case '7':

			// 		anterior = infos[0].getElementsByTagName('input')[1].value;
			// 		anterior = anterior.replaceAll(".", "");
			// 		anterior = anterior.replaceAll(",", ".");

			// 		res = (sc1 - anterior) * (percent / 100);


			// 		break;
			// 	case '8':

			// 		anterior = infos[0].getElementsByTagName('input')[1].value;
			// 		anterior = anterior.replaceAll(".", "");
			// 		anterior = anterior.replaceAll(",", ".");

			// 		res = (sc1 - anterior) * (percent / 100);

			// 		break;
			// 	default:

			// 		break;
			// }

			let calculo_final = 0
			let valor_base = 0;
			let utilidad = 0
			let formula_inversa = item.dataset.formula_inversa == "true" ? true : false;
			let formula = item.dataset.formula


			// SI ES TO OTHER Y ES Al ACUMULADO
			let totalOtherScCumulative = 0
			let toOtherSc = item.dataset.toother != "" ? item.dataset.toother : '';
			let otherScTarget = toOtherSc != "0" ? section_sc.querySelector(`li[data-id="${toOtherSc}"]`) : '';
			if (otherScTarget)
				otherScTarget.dataset.info == "false" ?
					totalOtherScCumulative = toOtherSc != "0" && otherScTarget != null ? unaBase.utilities.transformNumber(otherScTarget.getElementsByTagName('input')[2].value) : 0
					: totalOtherScCumulative = 0;
			let totalOtherScValue = toOtherSc != "0" && otherScTarget != null ? unaBase.utilities.transformNumber(otherScTarget.getElementsByTagName('input')[1].value) : 0;

			utilidad = $('input[name="cotizacion[montos][utilidad]"]').val()

			if (otherScTarget != "")
				if (parseInt(item.dataset.toothervalue))
					valor_base = totalOtherScValue
				else
					valor_base = totalOtherScCumulative
			else
				valor_base = valorAnterior

			let valorFinal = unaBase.utilities.transformNumber(document.querySelector('input[name="cotizacion[ajuste]"]').value)
			let sc2Value = unaBase.utilities.transformNumber(sc2)

			switch (item.dataset.type) {
				case 'sc-subtotal':
					break;
				case 'sc-subtotal_continuo':


					//FORMULA PERSONALIZADA	
					switch (formula) {
						case '-':
							//VALOR BASE MENOS EL CONTINUO ANTERIOR
							calculo_final = valor_base - valorAnterior
							if (calculo_final < 0)
								calculo_final = 0


							break;
						case '+':
							//VALOR BASE MENOS EL CONTINUO ANTERIOR
							calculo_final = valor_base + valorAnterior
							if (calculo_final < 0)
								calculo_final = 0


							break;
						case '*':
							//VALOR BASE MENOS EL CONTINUO ANTERIOR
							calculo_final = valor_base * valorAnterior
							if (calculo_final < 0)
								calculo_final = 0


							break;
						case '*-':
							//VALOR BASE MENOS TODOS LOS ACUMULADOS ANTERIORES
							calculo_final = valor_base - acumulado
							if (calculo_final < 0)
								calculo_final = 0


							break;
						default:
							calculo_final = formula_inversa ? ((valor_base * 100) / (100 - percent)) - valor_base : (valor_base * percent) / 100

							break;
					}
					acumulado += calculo_final
					break;
				case 'sc-total':
					calculo_final = ((valorFinal - sc2Value) * percent) / 100
					acumulado += calculo_final
					break;


				case 'sc-categoria':
					break;
				case 'sc-ajuste':
					break;
				case 'sc-utilidad':

					calculo_final = parseFloat(utilidad)
					//FORMULA PERSONALIZADA	
					switch (formula) {
						case '-':

							calculo_final = calculo_final - totalOtherScValue
							if (calculo_final < 0)
								calculo_final = 0


							break;
						case '+':

							calculo_final = calculo_final + totalOtherScValue
							if (calculo_final < 0)
								calculo_final = 0


							break;
						case '*':
							//VALOR BASE MENOS EL CONTINUO ANTERIOR
							calculo_final = calculo_final * totalOtherScValue
							if (calculo_final < 0)
								calculo_final = 0

							break;
						case '*-':
							//VALOR BASE MENOS TODOS LOS ACUMULADOS ANTERIORES
							calculo_final = calculo_final - acumulado
							if (calculo_final < 0)
								calculo_final = 0


							break;
						default:
							calculo_final = formula_inversa ? ((calculo_final * 100) / (100 - percent)) - calculo_final : (calculo_final * percent) / 100

							break;
					}

					break;

				case 'sc-productor':
					//calculo_final = formula_inversa ? ((	sobrecargos.utilidad_valor * 100) / (100 - percent)) - 	sobrecargos.utilidad_valor : (	sobrecargos.utilidad_valor * percent) / 100

					let factor = utilidad


					switch (formula) {
						case '-':

							factor -= totalOtherScValue
							if (factor < 0)
								factor = 0


							break;
						case '+':

							factor += totalOtherScValue
							if (factor < 0)
								factor = 0


							break;
						case '*':
							//VALOR BASE MENOS EL CONTINUO ANTERIOR
							factor = factor * totalOtherScValue
							if (factor < 0)
								factor = 0

							break;
						case '*-':
							//VALOR BASE MENOS TODOS LOS ACUMULADOS ANTERIORES
							factor -= acumulado
							if (factor < 0)
								factor = 0


							break;
						default:


							break;
					}
					calculo_final = formula_inversa ? ((factor * 100) / (100 - percent)) - factor : (factor * percent) / 100
					acumulado += calculo_final
					break;

				default:

					break;
			}

			valorAnterior = calculo_final
			res = new Intl.NumberFormat("de-DE").format(calculo_final)

			item.getElementsByTagName('input')[1].value = res;
			item.getElementsByClassName('additional-info')[0].textContent = new Intl.NumberFormat("de-DE").format((calculo_final * 100 / unaBase.utilities.transformNumber(document.querySelector('input[name="cotizacion[ajuste]"]').value)).toFixed(2)) + "% del Total a cliente";
		}
	} catch (ex) {
		console.log(ex)
	}

}




sobrecargos.getSobrecargosInfo = () => {

	let urlSobrecargo = "";

	urlSobrecargo = '/4DACTION/_light_getSobrecargos';  // desde parametros 


	$.ajax({
		url: urlSobrecargo,
		dataType: 'json',
		async: false,
		cache: false,
		data: {
			id: $('section.sheet').data('id'),
			info: true,
		},
		success: function (data) {

			sobrecargos.chargeSobrecargos(data, true)
		},
		error: function (error) {

			console.log(error);
		}
	});
}

sobrecargos.getSobrecargos = () => {

	if (unaBase.doc.reaperMode) {

		let urlSobrecargo = "";

		urlSobrecargo = '/4DACTION/_light_getSobrecargos';  // desde parametros 


		$.ajax({
			url: urlSobrecargo,
			dataType: 'json',
			async: false,
			cache: false,
			data: {
				id: unaBase.doc.id,
				info: false
			},
			success: function (data) {

				sobrecargos.data = data
				sobrecargos.chargeSobrecargos(data)

			},
			error: function (error) {

				console.log(error);
			}
		});
	}

}



sobrecargos.chargeSobrecargos = function (data, info = false) {
	if ((!unaBase.doc.modoCine && unaBase.doc.reaperMode) | info) {


		console.warn("*********************sobrecargos info");
		//REAPER toneg
		let targetScInfo = $('section.sobrecargos >  ul.sc-info');
		let targetSc = $('section.sobrecargos >  ul.sc');


		let htmlObject;
		let htmlObject2;


		$.each(data.rows, function (key, item) {
			let name = `sobrecargo`
			let tipo = `${item.is_info ? 'info' : ''}`
			let info = '  (*)';

			switch (item.tipo_sc) {
				case 'sc-cine':
					document.querySelector('.sc-cine').style.display = ''
					document.querySelector('.sc-cine li input[name="sobrecargo[0][cine][valor]"]').value = item.valor

					break;

				default:

					if (item.tipo_sc == "sc-categoria") {
						info += '(****)'
					}
					if (item.tipo_sc == "sc-subtotal") {
						info += '(**)'
					}
					if (item.tipo_sc == "sc-total") {
						info += '(***)'
					}
					if (item.to_other != "0") {
						info += '(↑)'
					}
					if (item.tipo_sc == "sc-utilidad") {
						info += '(U)'
					}


					htmlObject2 =
						`<span style="width: 70px; display: inline-block;">subtotal</span> 
						<span class="numeric currency">${localCurrency} <input  readonly type="text" name="${name}[${item.id}][subtotal]" value="0"></span>
						<span class="option">
							<label title="Oculta el valor del sobrecargo en la vista de impresión, repartiéndolo entre los ítems afectos.">
								<input type="checkbox" ${item.ajuste ? ' readonly' : ''} name="${name}[${item.id}][cerrado]"  ${item.is_close ? ' checked' : ''}  ${item.is_writable ? ' disabled' : ''}> 
								Cerrado
							</label>
						</span>
						<span style="">
						${item.tipo == "costo"
							? `<label  title="Permite que el sobrecargo sea considerado automáticamente como gasto real."}>
									<input readonly type="checkbox" name="${name}[real]" ${item.is_real ? ' checked' : ''} ${item.ajuste ? ' readonly' : ''}>
									${item.tipo} R.
								</label>`
							: ''}	
						</span>

						${item.tipo_sc == 'sc-categoria'
							? '<br><br><span style="!important;min-width: 70px !important; display: inline-block;">Categoria</span> <span style=" display: inline-block;"><select class="select_cat" ' + ` name="${name}[select-cat]" ` + ' ><option' + ` value="${item.id_categoria}">` + '</option></select></span>' +
							'<br><span style="!important;min-width: 70px !important; display: inline-block;">Reparto  </span> <span style=" display: inline-block;"><select class="select_reparto" ' + ` name="${name}[select-reparto]" ` + ' ><option ' + ` value="${item.id_reparto}">` + '</option></select></span><br><br>'
							: ''}
					</li>`;

					// title="Permite hacer referencia a una categoria para generar el sobrecargo"
					//title="Permite seleccionar categoria de reparto al cerrar el sobrecargo"

					htmlObject =
						`<li class="${item.tipo}" data-type-sc="new" data-id="${item.id}"  data-info="${item.is_info}" data-type="${item.ajuste ? 'sc-ajuste' : item.tipo_sc}" ${item.ajuste ? ' data-ajuste="true" ' : ''}    style="${item.ajuste ? 'opacity: 0.5;' : ''} ${item.is_hide ? 'display: none;' : ''}" data-formula="${item.formula}" data-formula_inversa="${item.formula_inversa}" data-toother="${item.to_other}" data-toothervalue="${item.to_other_value}"> 						
						<span>${item.name}${info}</span> 						
						<span class="numeric percent" style="${item.ajuste || item.is_percent_hide ? 'visibility: hidden;' : ''}"><input class="${item.tipo}"  ${item.ajuste ? ' readonly' : ''} type="text" name="${name}[${item.id}][porcentaje]" value="${item.porcentaje}" > %</span> 						
						<span class="numeric currency">${localCurrency} <input class="${item.tipo}" ${item.ajuste ? ' readonly' : 'readonly'} type="text" name="${name}[${item.id}][valor]"  value="${item.valor}"></span> 
						${item.is_info ? '<span class="additional-info" style="margin-left: 10px"></li>' : htmlObject2}`;


					//if (scDirectInput)


					if (item.is_info)
						targetScInfo.append(htmlObject);
					else
						targetSc.append(htmlObject);
					break;
			}

			if (item.tipo_sc == "sc-cine") {
				document.querySelector('.sc-cine li input[name="sobrecargo[0][cine][valor]"]').value = item.valor


			} else {

			}




		});
	}
};

sobrecargos.fillSCCategorias = () => {

	let selectOptions = document.querySelectorAll('section.sobrecargos ul.sc li select');

	selectOptions.forEach(b => {
		let cats = document.querySelectorAll('table.items.cotizacion tr.title');
		let selected_cat = b.selectedOptions[0].value;
		b.innerHTML = '';
		let con = 0;

		if (cats.length > 0) {
			cats.forEach(function (res_ele) {

				con++;
				b.innerHTML += `<option value="${res_ele.dataset.id}" ${res_ele.dataset.id == selected_cat ? 'selected' : ''} ${con == cats.length && selected_cat.length < 4 ? 'selected' : ''}>${res_ele.querySelector('input[name="item[][nombre]"]').value}</option>`;

			});

		} else {
			b.innerHTML += `<option value="0">Seleccione...</option>`;
		}


	});


};

(function fillItemSelector() {
	let urlSobrecargo = "";

	urlSobrecargo = '/4DACTION/_light_getSobrecargos';


	$.ajax({
		url: urlSobrecargo,
		dataType: 'json',
		async: false,
		cache: false,
		data: {
			id: unaBase.doc.id,
			separate: true
		},
		success: function (data) {
			sobrecargos.separate = data.rows
		},
		error: function (error) {

			console.log(error);
		}
	});
})()



sobrecargos.calculate = function (data) {
	try {
		if (!unaBase.doc.modoCine && calculateAll) {

			let ajustado = false;
			let valorAjuste = 0;
			let valorFinal = 0;
			let valorFinalAjustado = 0;
			let valorFinalSinAjustar = 0;
			let valorManualAjustado = 0
			let valor_con_descuento = 0;
			let itemsToDesc = 0
			let scutilidad = [], sccosto = [], separate_sc_item = []
			let SCSUBs = 0, SCCSUBs = [], SCTOTALs = 0, ITEMSSCs = 0, SCCATEGORYs = 0, SCDIFCINE = 0;  //PORCENTAJES
			//	let cont_SCSUBs, cont_SCCSUBs, cont_SCTOTALs;  // CONTADOR DE SOBRECARGOS DEL MISMO TIPO


			let section_sc = document.querySelector('section.sobrecargos > ul.sc');
			let scs = section_sc.getElementsByTagName('li');
			let subtotal = 0, subtotal_costos = 0, subtotal_raw = 0
			let valor_pelicula = unaBase.utilities.transformNumber($('article.block-totales ul.sc-cine input.new-input')[0].value)

			let totalsItems = document.querySelectorAll('table.items.cotizacion tr.item[data-auto_percent="true"]')
			let prodItems = document.querySelectorAll('table.items.cotizacion tr.item[data-formula_productor_ejecutivo="true"]')
			let porcentaje_descuento = parseFloat($('[name="cotizacion[descuento][porcentaje]"').val());
			let sc2 = document.querySelector('.sc').getElementsByTagName('li')[1].getElementsByTagName('input')[1].value
			const sc2Value = unaBase.utilities.transformNumber(sc2)

			//let subtotal = unaBase.utilities.transformNumber(document.getElementsByName('cotizacion[precios][subtotal]')[0].value);
			//let subtotal = $('input[name="cotizacion[precios][subtotal]"]').data('aplica-sobrecargo')
			document.querySelectorAll('table.items.cotizacion tr.item').forEach(t => {
				let is_calculate = false
				if (typeof t.dataset.auto_percent != "undefined") {
					if (t.dataset.auto_percent == "true") {
						is_calculate = true
					}
				} else {
					t.dataset.auto_percent = "false"
				}

				if (typeof t.dataset.formula_productor_ejecutivo != "undefined") {
					if (t.dataset.formula_productor_ejecutivo == "true") {
						is_calculate = true
					}
				}

				if (!is_calculate) {
					subtotal_costos += unaBase.utilities.transformNumber($(t).find('input[name="item[][subtotal_costo]"]')[0].value)
					subtotal += unaBase.utilities.transformNumber($(t).find('input[name="item[][subtotal_precio]"]')[0].value)
					if (unaBase.doc.separate_sc) {

						if ($(t).find('[name="item[][separate_sc]"]')[0].selectedIndex != 0) {
							subtotal_raw += unaBase.utilities.transformNumber($(t).find('input[name="item[][subtotal_precio]"]')[0].value)
							let id = $(t).find('[name="item[][separate_sc]"]')[0].options[$(t).find('[name="item[][separate_sc]"]')[0].selectedIndex].value
							let value = unaBase.utilities.transformNumber($(t).find('input[name="item[][subtotal_precio]"]')[0].value)

							if (typeof separate_sc_item.find(f => f.id == id) == 'undefined')
								separate_sc_item.push({ id, value })
							else
								separate_sc_item.forEach(r => r.id == id ? r.value += value : null)


						}
					}
					else if ($(t).find('input[name="item[][aplica_sobrecargo]"]')[0].checked)
						subtotal_raw += unaBase.utilities.transformNumber($(t).find('input[name="item[][subtotal_precio]"]')[0].value)


				}


			});

			//contador de sobrecargos
			for (i = 0; i < scs.length; i++) {



				let item = scs[i];

				//BUSCANDO AJUSTADO
				if (item.dataset.type == 'sc-ajuste' && parseFloat(item.getElementsByTagName('input')[1].value) != 0) {
					ajustado = true;
				}

				//CLASIFICANDO SOBRECARGOS
				item.classList.contains('utilidad') ? scutilidad.push(item) : sccosto.push(item)


				let val = 0
				//variable formula indica el calculo tipo retencion en boleta
				let formula_inversa = item.dataset.formula_inversa == "true" ? true : false;

				let percent = unaBase.utilities.transformNumber(item.getElementsByTagName('input')[0].value);

				if (percent > 0 || item.dataset.type == 'sc-diferencia-cine') {


					switch (item.dataset.type) {
						case 'sc-subtotal':

							SCSUBs += formula_inversa ? (100 / (100 - percent)) * percent : percent;

							break;
						case 'sc-subtotal_continuo':


							val = formula_inversa ? (100 / (100 - percent)) * percent : percent

							if (item.dataset.toother != "0")
								if (SCCSUBs.length > 0)
									SCCSUBs[SCCSUBs.length - 1] += val;
								else
									SCCSUBs.push(val);
							else
								SCCSUBs.push(val);


							break;
						case 'sc-total':

							SCTOTALs += percent

							break;
						case 'sc-categoria':

							SCCATEGORYs += percent;

							break;

						case 'sc-diferencia-cine':

							if (valor_pelicula > 0)
								SCDIFCINE = ((valor_pelicula * 100) / subtotal) - 100;

							SCSUBs += SCDIFCINE
							item.getElementsByTagName('input')[0].value = unaBase.utilities.transformNumber(SCDIFCINE, 'int');
							break;

						default:

							break;
					}


				}

			};





			//contador de items al total
			for (j = 0; j < totalsItems.length; j++) {
				//subtotal-= unaBase.utilities.transformNumber($(totalsItems[j]).find('input[name="item[][precio_unitario]"]')[0].value)
				ITEMSSCs += parseFloat(totalsItems[j].dataset.auto_percent_value)
			}

			//Despues de calcular los acumulados de los porcentajes en las variables SCCSUBs,SCCSUBs,SCTOTALs,SCCATEGORYs

			//Calculo de SC CATEGORIAS




			//CALCULO DE R    :  loop => SCCSUBs { SCSUBs% += SCCSUBs%[i] + (  SCSUBs% *  SCCSUBs%[i] ) / 100

			let r = 0
			//if(SCCSUBs.length >0)
			r = SCSUBs;

			SCCSUBs.forEach(e => { r += e + ((r * e) / 100) });


			//CALCULO DE ITEMSSCs   :  items con formula porcentaje al total

			let r2 = SCCSUBs.length == 0 ? 0 : r
			let totalItemsSCs = 0;
			if (ITEMSSCs > 0) {
				totalItemsSCs = ITEMSSCs + ((ITEMSSCs * (r2 == 0 ? SCSUBs - SCDIFCINE : r2)) / 100);
				//totalItemsSCs-= (porcentaje_descuento/100)
			}
			//calculo para items productor ejecutivo
			const calculateProdEj = () => {

				if (prodItems.length > 0) {

					let acumulado = 0
					for (i = 0; i < prodItems.length; i++) {
						calculateAll = false
						let line = prodItems[i]

						let lineProdPercent = $(line).data('formulaProductorEjecutivoRatio') / 100
						let c_target = line.querySelector('input[name="item[][precio_unitario]"]')
						let valor = accTotalSCsUt * lineProdPercent
						acumulado += valor


						$(line).find('input[name="item[][precio_unitario]"]').data("old-value", valor)
						$(line).find('input[name="item[][precio_unitario]"]').data("value", valor)
						$(line).find('input[name="item[][precio_unitario]"]').val(valor)
						$(line).find('input[name="item[][costo_unitario]"]').data("old-value", valor)
						$(line).find('input[name="item[][costo_unitario]"]').data("value", valor)
						$(line).find('input[name="item[][costo_unitario]"]').val(valor)
						c_target.dispatchEvent(new Event('blur'))

					};

					if (ajustado == false) {
						valorFinal += acumulado
					}
				}
			}

			//*********************************** APLICANDO FORMULA FINAL *******************************************************************************************


			//FORMULA FINAL***********************************************************************


			let dif_sc_check = subtotal - subtotal_raw

			if (porcentaje_descuento >= 100)
				valorFinalSinAjustar = 0
			else
				valorFinalSinAjustar = (dif_sc_check + ((subtotal_raw * (100 + r)) / ((100 - totalItemsSCs - SCTOTALs)))) * (1 - (porcentaje_descuento / 100))


			if (ajustado) {
				valorManualAjustado = unaBase.utilities.transformNumber(document.querySelector('input[name="cotizacion[ajuste]"]').value)
				//EJEMPLOS 10 = % en impuesto sc totales
				// let SCTOTALsAj= ( (0.1*9000) / 10080) *100
				// SCTOTALsAj=9.9107142857142857142857142857143

				//valorAjuste = Math.round((( subtotal *  ( 100 + r) ) / ( 100 - totalItemsSCs - SCTOTALs))- 90000)
				//valorFinalAjustado = ( subtotal *  ( 100 + r) ) / (100 - totalItemsSCs -  8.9285714285714285714285714285714)
				if (valorManualAjustado > 0) {
					valorFinalAjustado = valorManualAjustado
					valorFinal = valorFinalAjustado
				} else {
					ajustado = false
					valorFinal = valorFinalSinAjustar
				}

				//valorAjuste = valorFinalSinAjustar - valorFinalAjustado

			} else {
				valorFinal = valorFinalSinAjustar
				valor_con_descuento = valorFinal
			}
			//********************************************************************************************************************************************************



			//REPARTO DE VALORES ITEMS FORMULAS
			const calculateItemsTotals = () => {

				for (i = 0; i < totalsItems.length; i++) {
					calculateAll = false
					let line = totalsItems[i]
					let lineAutoPercent = parseFloat(line.dataset.auto_percent_value)
					let c_target = line.querySelector('input[name="item[][precio_unitario]"]')
					let valor = (valorFinal-sc2Value) * lineAutoPercent / 100
					itemsToDesc += valor
					$(line).find('input[name="item[][precio_unitario]"]').data("old-value", valor)
					$(line).find('input[name="item[][precio_unitario]"]').data("value", valor)
					$(line).find('input[name="item[][precio_unitario]"]').val(valor)
					$(line).find('input[name="item[][costo_unitario]"]').data("old-value", valor)
					$(line).find('input[name="item[][costo_unitario]"]').data("value", valor)
					$(line).find('input[name="item[][costo_unitario]"]').val(valor)
					c_target.dispatchEvent(new Event('blur'))

				};
				subtotal += itemsToDesc
			}

			calculateItemsTotals()


			//REPARTO DE VALORES A SOBRECARGOS
			//subtotal_raw = $('input[name="cotizacion[precios][subtotal]"]').data('aplica-sobrecargo')
			// subtotal_raw = subtotal
			subtotal_costo_raw = unaBase.utilities.transformNumber(document.querySelector('input[name="cotizacion[costos][subtotal]"]').value)
			let itemAnterior = null
			let valorAnterior = subtotal;
			let subtotalSCs = 0;
			let sccsCumulative = subtotal_raw
			let accTotalSCsUt = 0

			const reparto = (item, utilidad = false) => {
				try {
					
					let calculo_final = 0
					let valor_base = 0;
					let formula_inversa = item.dataset.formula_inversa == "true" ? true : false;
					let toOtherSc = item.dataset.toother != "" ? item.dataset.toother : '';
					let otherScTarget = toOtherSc != "0" ? section_sc.querySelector(`li[data-id="${toOtherSc}"]`) : '';
					let totalOtherSc = otherScTarget & toOtherSc != "0" ? unaBase.utilities.transformNumber(otherScTarget.getElementsByTagName('input')[1].value) : 0;
					item.classList.contains('utilidad') ? utilidad = true : utilidad = false

					//SI ES ACUMULATIVO
					let cumulativeSc = item.dataset.cumulative == "true" ? true : false;
					let cumulativeScTargets = cumulativeSc ? section_sc.querySelectorAll(`li`) : [];
					let totalCumulativeSc = 0;

					// SI ES TO OTHER Y ES Al ACUMULADO
					let totalOtherScCumulative = otherScTarget & toOtherSc != "0" ? unaBase.utilities.transformNumber(otherScTarget.getElementsByTagName('input')[2].value) : 0;

					cumulativeScTargets.forEach(e => {
						if (e.dataset.order < item.dataset.order)
							totalCumulativeSc += unaBase.utilities.transformNumber(e.getElementsByTagName('input')[1].value);

					});


					let percent = unaBase.utilities.transformNumber(item.getElementsByTagName('input')[0].value);
					if (itemAnterior != null)
						valorAnterior = itemAnterior.getElementsByTagName('input')[2] ? unaBase.utilities.transformNumber(itemAnterior.getElementsByTagName('input')[2].value) : valorAnterior;


					switch (item.dataset.type) {
						case 'sc-subtotal':
							//calculo_final = formula ? ((valorAnterior * 100) / (100 - percent)) - valorAnterior : (valorAnterior * percent) / 100
							if (unaBase.doc.separate_sc) {
								let sum = typeof separate_sc_item.find(w => w.id == item.dataset.id) != 'undefined' ? separate_sc_item.find(w => w.id == item.dataset.id).value : 0

								calculo_final = (sum * percent) / 100
							} else
								calculo_final = formula_inversa ? ((subtotal_raw * 100) / (100 - percent)) - subtotal_raw : (subtotal_raw * percent) / 100



							sccsCumulative += calculo_final
							break;
						case 'sc-subtotal_continuo':
							//COLOCAR PARAMETRO PARA CALCULO AL ACUMULADO DE TO OTHER
							// valor_base = totalOtherScCumulative     // true
							// valor_base = totalOtherScCumultotalOtherScative   // false

							if (otherScTarget != "")
								valor_base = totalOtherScCumulative
							else
								valor_base = sccsCumulative

							calculo_final = formula_inversa ? ((valor_base * 100) / (100 - percent)) - valor_base : (valor_base * percent) / 100
							sccsCumulative += calculo_final
							break;
						case 'sc-total':
							calculo_final = (valorFinal * percent) / 100
							break;

						case 'sc-categoria':
							//IDENTIFICANDO LLAVE DE LA CATEGORIA
							let sc_key_selected_cat = item.querySelector('select.select_cat')?.selectedOptions[0].value;
							//BUSCANDO LA CATEGORIA PARA SACAR EL SUBTOTAL
							let subtotal_cats = document.querySelector(`table.items.cotizacion tr[data-id="${sc_key_selected_cat}"]`);

							let subtotal_categoria = '';
							//SACANDO VALOR DE SUBTOTAL DE LA CATEGORIA
							if (subtotal_cats === null)
								subtotal_categoria = 0;
							else
								subtotal_categoria = unaBase.utilities.transformNumber(subtotal_cats.querySelector('th.numeric.currency.venta input[name="item[][subtotal_precio]"]').value)

							calculo_final = formula_inversa ? (((subtotal_categoria + totalCumulativeSc + totalOtherSc) * 100) / (100 - percent)) - (subtotal_categoria + totalCumulativeSc + totalOtherSc) : ((subtotal_categoria + totalCumulativeSc + totalOtherSc) * percent) / 100


							break;
						case 'sc-ajuste':

							if (valorFinalAjustado != 0) {
								valorAjuste = valorFinalAjustado - valorAnterior
							}
							calculo_final = valorAjuste
							break;

						case 'sc-diferencia-cine':
							if (valor_pelicula > 0)
								SCDIFCINE = ((valor_pelicula * 100) / subtotal_raw) - 100;


							item.getElementsByTagName('input')[0].value = unaBase.utilities.transformNumber(SCDIFCINE, 'int');
							calculo_final = formula_inversa ? ((subtotal_raw * 100) / (100 - SCDIFCINE)) - subtotal_raw : (subtotal_raw * SCDIFCINE) / 100
							sccsCumulative += calculo_final
							break;
						default:

							break;
					}

					if (utilidad)
						accTotalSCsUt += calculo_final

					
					//REPARTIENDO EN INPUTS
					item.getElementsByTagName('input')[1].value = unaBase.utilities.transformNumber(calculo_final, 'int');
					item.getElementsByTagName('input')[2].value = unaBase.utilities.transformNumber(valorAnterior + (calculo_final), 'int');
					subtotalSCs += calculo_final;
					itemAnterior = item
				} catch (error) {
					console.error(error)
				}

			}

			//PARA EL PRODUCTOR EJECUTIVO DEPRECATED
			// scutilidad.forEach(item =>reparto(item,true))
			// calculateProdEj()
			// 
			// sccosto.forEach(item =>reparto(item,true))
			for (i = 0; i < scs.length; i++) {
				reparto(scs[i])
			}

			sobrecargos.utilidad_valor = accTotalSCsUt

			//EVITA QUE TODO SE VAYA AL CARAJO
			calculateAll = true

			//ESTABLECIENDO EL SUBTOTAL DE LOS SOBRECARGOSEN EL INPUT OCULTO EN LA SECCION TOTALES
			document.querySelector('input[name="cotizacion[ajuste][diferencia]"]').value = unaBase.utilities.transformNumber(valorAjuste, 'int');
			$('[name="cotizacion[sobrecargos][subtotal]"]').val(subtotalSCs);

			calculaInformativos();

			//ARREGLAR DESCUENTO
			sobrecargos.calculateDesc(valorFinal);

			totales.updateSubtotalNeto();




		}
	} catch (ex) {
		console.log(ex)
	}


};


sobrecargos.calculateDesc = function (total) {

	//$('input[name="cotizacion[descuento][porcentaje]"]').trigger('blur')
	var subtotal_precios = parseFloat($('[name="cotizacion[precios][subtotal]"]').val());
	var subtotal_sobrecargos = parseFloat($('[name="cotizacion[sobrecargos][subtotal]"]').val());
	//var valor_descuento = parseFloat($('[name="cotizacion[descuento][valor]"').val());
	//var porcentaje_descuento = valor_descuento/ (subtotal_precios + subtotal_sobrecargos) * 100.00;

	var porcentaje_descuento = parseFloat($('[name="cotizacion[descuento][porcentaje]"').val());
	var valor_descuento = (subtotal_precios + subtotal_sobrecargos) - total;
	// var valor_descuento = ((subtotal_precios + subtotal_sobrecargos) * porcentaje_descuento) / 100.00;
	if (valor_descuento > 0 && valor_descuento <= subtotal_precios + subtotal_sobrecargos) {
		$('[name="cotizacion[descuento][valor]"]').val(valor_descuento.toFixed(6));
	} else {
		if (porcentaje_descuento > 0)
			toastr.warning(
				"No puedes aplicar descuento, el total a cliente ha sido modificado manualmente."
			);
		$('[name="cotizacion[descuento][porcentaje]"').val((0).toFixed(6))
		$('[name="cotizacion[descuento][valor]"]').val((0).toFixed(6));
	}
};
