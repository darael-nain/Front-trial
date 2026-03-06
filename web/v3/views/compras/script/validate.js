
var _validationJustified = function () {
	var status = true;
	var container = $('#sheet-compras');
	var tipoGasto = container.find('input[name="oc[tipo_gastos][id]"]').val();
	if (tipoGasto == "OC") {
		var rows = container.find('table.itemsoc > tbody > tr[data-tipo="ITEM"]');
		var selectedItem = container.find('table.itemsoc > tbody > tr > td > input[type="checkbox"]:checked');
		rows.each(function (key, item) {
			var check = $(this).find('input[name="oc[detalle_item][select]"]');
			var justificado = parseFloat($(this).find('input[name="oc[detalle_item][justificado]"]').val());
			var total = parseFloat($(this).find('input[name="oc[detalle_item][total]"]').val());
			if (selectedItem.length > 0) {
				if (check.prop('checked') && justificado >= total)
					status = false;
			} else {
				if (justificado >= total)
					status = false
			}
		});
	}
	return status;
}

var oc_validate_fields = function () {

	// se obtiene valores iniciales
	var targetMenu = $('#menu ul');
	var container = $('#sheet-compras');
	var containerItems = container.find('table.items > tbody');
	var folio = container.data("folio");
	var estado = container.data("estado");
	var validada = container.data("validado");
	var tipoGasto = container.find('input[name="oc[tipo_gastos][id]"]').val();
	var porJustificar = parseFloat(container.find('input[name="oc[total_por_justificar]"]').val());
	var cerradoAdmin = container.data("cierreadmin");
	var cerradoProduccion = container.data("cierreproduccion");
	var saldoFxr = parseFloat(container.find('input[name="oc[saldo_total_fxr]"]').val());
	var saldo_por_pagar = parseFloat(container.find('input[name="oc[total_por_pagar]"]').val());
	var factoring = container.data("factoring");

	// agreagdo 4-8-19, gin
	//targetMenu.find('li[data-name="duplicate_gastos"]').hide();

	var isPaid = false;
	if (parseFloat($('input[name="oc[total_pagado]"]').val()) > 0) {
		isPaid = true;
	}

	// --ini-- agregado por gin el 27-11-17 para modificar etiqueta según tipo doc al entrar
	var tipoDoc = $('input[name="tipo_doc[id]"]').val();
	var nameTipoDoc = $('input[name="tipo_doc[descripcion]"]').val();
	if (tipoDoc == 65 || tipoDoc == 66 || tipoDoc == "118" || tipoDoc == "119" || tipoDoc == "1002" || tipoDoc == "1004") {
		if (tipoDoc == "118") {
			$('span[name="label-neto-hono"]').text('Impuesto');
			$('span[name="label-iva-ret"]').text(retName + " (" + retRate + "%)");
		} else {
			if (tipoDoc == "119") {
				$('span[name="label-neto-hono"]').text('Impuesto');
				$('span[name="label-iva-ret"]').text(retName + " (0%)");
			} else {
				$('span[name="label-neto-hono"]').text('Honorario');
				$('span[name="label-iva-ret"]').text(retName);
			}
		}
	} else {
		$('span[name="label-neto-hono"]').text('Neto');
		// $('span[name="label-iva-ret"]').text(ivaName+" ("+ ivaRate +"%)");
		$('span[name="label-iva-ret"]').text(ivaName);
	}
	// --ini-- agregado por gin el 27-11-17 para modificar etiqueta según tipo doc al entrar

	// se oculta y desactiva objetos por defecto
	$('#scrollPagos .notices').hide();
	targetMenu.find('li[data-name="discard"], li[data-name="payment_request"], li[data-name="new_payment"], li[data-name="restore"],li[data-name="save"], li[data-name="update"], li[data-name="close_production_process"], li[data-name="open_production_process"], li[data-name="close_admin_fxr"], li[data-name="open_admin_fxr"], li[data-name="close_admin_oc"], li[data-name="open_admin_oc"], li[data-name="preview_native"], li[data-name="preview_oc"]').hide();
	$('#scrolldtc, #scrolldtv, button.add.dtc, button.addexist.dtc, #scrollPagos, button.add.orden-pago, #scrollCobros, button.add.cobro, .actions.items').hide();
	$('.objoc, .objfxr, .totales-post-save').hide();
	containerItems.find('button.detail.item').hide();
	container.find('button.show, button.profile, button.unlock, .profile2.empresa').prop('disabled', true);
	container.find('.add.item, .add.items, .remove.item, .tiposg, .clasif').hide();

	//container.find('input, textarea').prop('readonly', true);


	container.find('input[name="chk[sindicato]"]').prop('disabled', true);
	container.find('input.date').removeClass('datepicker');

	targetMenu.find('li[data-name="share_oc"]').hide();
	targetMenu.find('li[data-name="share_oc_val"]').hide();

	$('.options-egresos').hide();

	// 16-10-17 para mostrar botones de ajuste a total gastos
	$(".u-section-button-ajustes").hide();

	// tipo cambio
	$('input[name="oc[valor_cambio]"]').prop('readonly', false);

	//Esconder boton para transformar de fxr a oc o viceversa
	const total_dtc = compras.total_rows_dtc != undefined ? compras.total_rows_dtc : 0
	const total_cobros = compras.total_rows_cobros != undefined ? compras.total_rows_cobros : 0
	const total_pagos = compras.total_rows_pagos != undefined ? compras.total_rows_pagos : 0
	if (accountingMode) {
		$('.tiposg').hide()
		if (total_cobros == 0 && total_pagos == 0 && total_dtc == 0)
			$('.tiposg').show()

	} else {
		if (total_cobros == 0 && total_pagos == 0) {

			$('.tiposg').show()
		}
	}
	// se verifica tipo de gasto
	if (tipoGasto == "FXR" || tipoGasto == "FTG") {
		if (tipoGasto == "FTG")
			$('[name="tipo_doc[descripcion]"]').val("FACTORING");
		else
			$('[name="tipo_doc[descripcion]"]').val("RENDICION");
		$('.objfxr').show();
		$('[name="tipo_doc[id]"]').val("200");
		$('table.items > tbody > tr[data-tipo="ITEM"] > td > input[name="oc[detalle_item][imp][id]"]').val("3");
		$('table.items > tbody > tr[data-tipo="ITEM"] > td > input[name="oc[detalle_item][imp][id]"]').data('valorimp', "0");
		$('table.items > tbody > tr[data-tipo="ITEM"] > td > input[name="oc[detalle_item][imp][id]"]').data('tipoimp', "EXENTO");
		$('table.items > tbody > tr[data-tipo="ITEM"] > td > input[name="oc[detalle_item][imp][des]"]').val("EXENTO");
		if (folio != "" && estado != 'ANULADA' && validada) {

			if (accountingMode) {

				if (cerradoProduccion && access._517) {
					targetMenu.find('li[data-name="open_production_process"]').show();
				}
			}

			if (accountingMode) {
				if (!cerradoProduccion && access._517) {
					targetMenu.find('li[data-name="close_production_process"]').show();
				}
			}


			if (!cerradoAdmin && access._517) {
				targetMenu.find('li[data-name="close_admin_fxr"]').show();
			} else {
				if (cerradoAdmin && access._517) {
					targetMenu.find('li[data-name="open_admin_fxr"]').show();
				}
			}
		}
		$('.show.forma-pago').hide();

		if ((folio != "") && ($('section.sheet').data('factoring'))) {
			$('#scrolldtv').show();
		};

	} else {
		$('.objoc').show();
		if (folio != "" && estado != 'ANULADA' && validada) {
			if (!cerradoAdmin) {
				targetMenu.find('li[data-name="close_admin_oc"]').show();
			} else {
				if (cerradoAdmin) {
					targetMenu.find('li[data-name="open_admin_oc"]').show();
				}
			}
		}
	}

	if (estado == "EMITIDA" && !cerradoAdmin) {
		if (folio == "") { // al estar creando
			containerItems.find('button.detail.item').show();
			container.find('button.show, button.profile, button.unlock, .profile2.empresa').prop('disabled', false);
			container.find('.add.item, .add.items, .remove.item, .clasif').show();
			//container.find('.filltext:not([name="oc[detalle_item][nombre]"])').prop('readonly', false);
			container.find('.filltext').prop('readonly', false);
			container.find('input[name="chk[sindicato]"]').prop('disabled', false);
			container.find('input.date').addClass('datepicker');
		} else {
			$('.totales-post-save, #scrolldtc, #scrollPagos, #scrollCobros').show();
			targetMenu.find('li[data-name="preview_oc"]').show();
			targetMenu.find('li[data-name="preview_native"]').show();
			if (access._656) { // duplicar
				targetMenu.find('li[data-name="duplicate_gastos"]').show();
			}

			if (access._443) { //anular
				targetMenu.find('li[data-name="discard"]').show();
			}



			if (validada) {

				// if (access._450 && !isPaid) { // modificar validadas y sin monto pagado
				// 	containerItems.find('button.detail.item').show();
				//    			container.find('button.show, button.profile, button.unlock, .profile2.empresa').prop('disabled', false);
				//  			container.find('.add.item, .add.items, .remove.item, .tiposg, .clasif').show();
				//  			//container.find('.filltext:not([name="oc[detalle_item][nombre]"])').prop('readonly', false);
				// 	container.find('.filltext').prop('readonly', false);
				//  			container.find('input[name="chk[sindicato]"]').prop('disabled', false);
				//  			container.find('input.date').addClass('datepicker');
				//  		}

				// -- ini -- modificado par apoder editar oc una vez justificado y pagado, gin, 27-04-18
				if (access._450) { // modificar validadas
					if (!isPaid) { // modificar sin pago agregado
						containerItems.find('button.detail.item').show();
						container.find('button.show, button.profile, button.unlock, .profile2.empresa').prop('disabled', false);
						container.find('.add.item, .add.items, .remove.item, .clasif').show();
						container.find('.filltext').prop('readonly', false);
						container.find('input[name="chk[sindicato]"]').prop('disabled', false);
						container.find('input.date').addClass('datepicker');
					} else {
						if (access._554) { // modificar pagadas o cerradas
							containerItems.find('button.detail.item').show();
							container.find('button.show, button.profile, button.unlock, .profile2.empresa').prop('disabled', false);
							container.find('.add.item, .add.items, .remove.item, .clasif').show();
							container.find('.filltext:not([name="oc[detalle_item][nombre]"])').prop('readonly', false);
							container.find('input[name="chk[sindicato]"]').prop('disabled', false);
							container.find('input.date').addClass('datepicker');
						}
					}

				}
				// -- fin -- modificado par apoder editar oc una vez justificado y pagado, gin, 27-04-18

				if (access._444) { // compartir
					targetMenu.find('li[data-name="share_oc"]').show();
				}

				if (porJustificar > 0 && tipoGasto == 'OC') {
					$('button.add.dtc, button.addexist.dtc, .actions.items').show();
				}
				if (tipoGasto == 'FXR' || tipoGasto == 'FTG') {
					let btn_dtc_cobro = !cerradoProduccion ? 'button.add.dtc, ' : ''

					if (cerradoProduccion) $('button.dtc-pend').hide();

					$(`${btn_dtc_cobro} button.add.cobro, button.addexist.dtc, .actions.items`).show();
					$('#scrollCobros').show();
					$('.options-egresos').show();
				}
				if (access._479) { // crear op

					$('.options-egresos').show();
					$('button.add.orden-pago').show();
				} else {
					$('#scrollPagos .notices').show();
					$('.options-egresos').remove();
				}

				targetMenu.find('li[data-name="payment_request"]').show();

			} else {


				if (unaBase.parametros.add_dtc_compras_no_validas) {
					$('button.add.dtc').show();
				}


				if (access._448 || access._450) { // modificar validadas y no
					containerItems.find('button.detail.item').show();
					container.find('button.show, button.profile, button.unlock, .profile2.empresa').prop('disabled', false);
					container.find('.add.item, .add.items, .remove.item, .clasif').show();
					// container.find('.filltext:not([name="oc[detalle_item][nombre]"])').prop('readonly', false);
					container.find('.filltext').prop('readonly', false);
					// containerItems.find('input').prop('readonly', false);
					container.find('input[name="chk[sindicato]"]').prop('disabled', false);
					container.find('input.date').addClass('datepicker');
				} else {
					//TEST DE MODIFICAR COMPRAS NO VALIDADAS
					container.find('input[name="oc[detalle_item][precio]"]').prop('readonly', true);
					container.find('input[name="oc[detalle_item][cantidad]"]').prop('readonly', true);
					container.find('input[name="oc[detalle_item][dias]"]').prop('readonly', true);
				}
			}
		}

		container.find('input[name="oc[fecha_vcto]"]').prop('readonly', false).addClass('datepicker');

		if (access._507 && $('input[name="forma_pago[id]"]').val() != '-1') { // modificar fecha vcto pago
			// container.find('input[name="oc[fecha_vcto]"]').prop('readonly', false).addClass('datepicker');
			// container.find('input[name="oc[fecha_vcto2]"]').prop('readonly', false).addClass('datepicker');
			// container.find('input[name="oc[fecha_vcto3]"]').prop('readonly', false).addClass('datepicker');
		}

		targetMenu.find('li[data-name="save"]').show();

		if (tipoGasto != 'FXR' && bloqueo_para_pagar) {
			$('button.add.orden-pago').hide();
			var tipo_dtc = $('input[name="tipo_doc[descripcion]"]').val();
			$('.tituloh3').text("\"Una vez justificada la Orden de compra deber ser pagada desde el documento de compra asociado (" + tipo_dtc + ")\"");
		}

		if (access._624 && compras.porpagar > 0) { // ajustar total gasto
			$(".u-section-button-ajustes").show();
		}

	} else {
		if (estado == "ANULADA") {
			$('.totales-post-save, #scrolldtc, #scrollPagos').show();
			if (tipoGasto == 'FXR' || tipoGasto == 'FTG') {
				$('#scrollCobros').show();
			}
			if (access._516)
				targetMenu.find('li[data-name="restore"]').show();


			targetMenu.find('li[data-name="validate_request"]').hide();


		} else {
			if (estado == "PAGADA" && !cerradoAdmin) {
				containerItems.find('button.detail.item').show();
				targetMenu.find('li[data-name="preview_oc"]').show();
				targetMenu.find('li[data-name="preview_native"]').show();
				$('.totales-post-save, #scrolldtc, #scrollPagos').show();
				if (tipoGasto == 'OC') {
					if (porJustificar > 0) {
						$('button.add.dtc, button.addexist.dtc, .actions.items').show();
					}
				} else { // FXR
					let btn_dtc_cobro = !cerradoProduccion ? 'button.add.dtc, ' : ''
					if (cerradoProduccion) $('button.dtc-pend').hide();
					$('#scrollCobros').show();
					$(`${btn_dtc_cobro} button.add.cobro, button.addexist.dtc, .actions.items`).show();
					if (access._479) { // crear op

						$('.options-egresos').show();
						$('button.add.orden-pago').show();
					} else {
						$('#scrollPagos .notices').show();
						$('.options-egresos').remove();
					}
				}
				if (access._444) { // compartir
					targetMenu.find('li[data-name="share_oc"]').show();
				}

				if (access._656) { // duplicar
					targetMenu.find('li[data-name="duplicate_gastos"]').show();
				} else
					targetMenu.find('li[data-name="duplicate_gastos"]').hide();



				// -- ini -- descontinuado -- x gin 22-06-17
				if (access._554) { // modificar pagadas o cerradas
					containerItems.find('button.detail.item').show();
					container.find('button.show, button.profile, button.unlock, .profile2.empresa').prop('disabled', false);
					container.find('.add.item, .add.items, .remove.item, .clasif').show();
					container.find('.filltext:not([name="oc[detalle_item][nombre]"])').prop('readonly', false);
					container.find('input[name="chk[sindicato]"]').prop('disabled', false);
					container.find('input.date').addClass('datepicker');
				}
				// -- fin -- descontinuado -- x gin 22-06-17

			}
			if (estado == "CERRADA" && !cerradoAdmin) {
				containerItems.find('button.detail.item').show();
				targetMenu.find('li[data-name="preview_oc"]').show();
				targetMenu.find('li[data-name="preview_native"]').show();
				$('.totales-post-save, #scrolldtc, #scrollPagos').show();
				if (tipoGasto == 'FXR' || tipoGasto == 'FTG') {
					$('#scrollCobros').show();
					if (!cerradoAdmin) {
						let btn_dtc_cobro = !cerradoProduccion ? 'button.add.dtc, ' : ''
						if (cerradoProduccion) $('button.dtc-pend').hide();
						$('#scrollCobros').show();
						$(`${btn_dtc_cobro} button.add.cobro, button.addexist.dtc, .actions.items`).show();
						if (access._479) { // crear op
							$('.options-egresos').show();
							$('button.add.orden-pago').show();
						} else {
							$('#scrollPagos .notices').show();
							$('.options-egresos').remove();
						}
					}
				}
				if (access._444) { // compartir
					targetMenu.find('li[data-name="share_oc"]').show();
				}
				if (access._656) { // duplicar
					targetMenu.find('li[data-name="duplicate_gastos"]').show();
				} else
					targetMenu.find('li[data-name="duplicate_gastos"]').hide();

				// -- ini -- descontinuado -- x gin 22-06-17
				if (access._554) { // modificar pagadas y cerradas
					containerItems.find('button.detail.item').show();
					container.find('button.show, button.profile, button.unlock, .profile2.empresa').prop('disabled', false);
					container.find('.add.item, .add.items, .remove.item, .clasif').show();
					container.find('.filltext:not([name="oc[detalle_item][nombre]"])').prop('readonly', false);
					container.find('input[name="chk[sindicato]"]').prop('disabled', false);
					container.find('input.date').addClass('datepicker');
				}
				// -- fin -- descontinuado -- x gin 22-06-17

				targetMenu.find('li[data-name="validate_request"]').hide();

			}
			targetMenu.find('li[data-name="save"]').show();
		}
	}

	if (cerradoAdmin) {
		$('.totales-post-save, #scrolldtc, #scrollPagos, #scrollCobros').show();

		$("div.u-section-button-ajustes-impuesto").hide();
		$(`li[data-name="save"],li[data-name="preview_oc"]`).hide();
		$(`li[data-name="save"],li[data-name="preview_native"]`).hide();

		if (access._444) { // compartir
			targetMenu.find('li[data-name="share_oc"]').show();
		}
	};

	oc_checkout_text_full();

	if (!validada)
		targetMenu.find('li[data-name="share_oc"]').hide();

	// corregido 02-09-16 - gin (no debería mostrar sección depositos si es oc, solo para fxr)
	if (tipoGasto == "OC") {
		$('#scrollCobros').hide();
	};

	if (access._575 && $('input[name="oc[detalle_item][nombre]"]').val() != '') {
		$('input[name="oc[detalle_item][nombre]"]').prop('readonly', true);
	}


	if (factoring) {
		targetMenu.find('li[data-name="payment_request"]').hide();
		targetMenu.find('li[data-name="restore"]').hide();
		targetMenu.find('li[data-name="validate_send"]').hide();
		targetMenu.find('li[data-name="validate_request"]').hide();
		targetMenu.find('li[data-name="close_admin_fxr"]').hide();
	}

	// Verificación OC/FXR cerrado, deshabilita reiniciar validación
	if (estado != "CERRADA" || estado != "ANULADA") {
		if (parseFloat($('input[name="oc[total_justificado]"]').val()) > 0) {
			targetMenu.find('li[data-name="validate_request"]').hide();
		}
		if (parseFloat($('input[name="oc[total_pagado]"]').val()) > 0) {
			targetMenu.find('li[data-name="validate_request"]').hide();
		}
	} else {
		targetMenu.find('li[data-name="validate_request"]').hide();
	}

	/*if (
		tipoGasto == "OC" &&
		parseFloat($('input[name="oc[total_justificado]"]').val()) == parseFloat($('input[name="oc[neto]"]').val()) &&
		parseFloat($('input[name="oc[total_pagado]"]').val()) == parseFloat($('input[name="oc[total]"]').val())
	) {
		// targetMenu.find('li[data-name="save"]').hide();
		targetMenu.find('li[data-name="validate_request"]').hide();
	}
	if (
		tipoGasto == "FXR" &&
		parseFloat($('input[name="oc[total_justificado]"]').val()) == parseFloat($('input[name="oc[total]"]').val()) &&
		parseFloat($('input[name="oc[total_pagado]"]').val()) == parseFloat($('input[name="oc[total]"]').val())
	) {
		// targetMenu.find('li[data-name="save"]').hide();
		targetMenu.find('li[data-name="validate_request"]').hide();
	}*/
	// $('input[name="oc[valor_cambio]"]').prop('readonly', false);

	if (fxr_dias_vencimiento_default > 0)
		$('input[name="oc[fecha_vcto_fxr]"]').removeClass('datepicker').prop('readonly', true);


	if (!habilitarOpcionIGVIVAFXR) {
		$('.COL-IVA-IGV').hide();
	}
	// if(access._504){
	// 	document.querySelector(`button.add.dtc`).disabled = false;
	// 	$("button.add.dtc").show();
	// }else{
	// 	$("button.add.dtc").hide();
	// }


}

var _validationOrigen = function () {
	var origen = $('input[name="oc[origen]"]').val();
	if (origen == "PROYECTO" || origen == "" || origen == "PRESUPUESTO") {
		$('.search-clas').hide();
	} else {
		$('.search-clas').show();
	}
}

/*
var _validationSave = function(){
	var msgError = '';
	var status = true;

	var referencia = $('input[name="oc[referencia]"]').val();
	var proveedor = $('input[name="contacto[info][id]"]').val();
	var origen = $('input[name="oc[origen]"]').val();
	var idprov = $('input[name="contacto[info][id]"]');
	var razon =  $('input[name="contacto[info][razon_social]"]');
	var rut = 	 $('input[name="contacto[info][rut]"]');
	var giro = 	 $('input[name="contacto[info][giro]"]');

	$('#sheet-compras input').removeClass("invalid");

	if ($('input[name="oc[tipo_gastos][des]"]').val() == "") {
		msgError = msgError + '- Falta seleccionar tipo de gasto.<br/>';
		$('input[name="oc[tipo_gastos][des]"]').addClass('invalid');
	}
	if (origen == "GASTO GENERAL") {
		if ($('input[name="oc[origen][clas][des]"]').val()=="") {
			msgError = msgError + '- Falta seleccionar clasificación.<br/>';
			$('input[name="oc[origen][clas][des]"]').addClass('invalid');
		}
	}
	if (referencia == "") {
		msgError = msgError + '- Falta ingresar referencia.<br/>';
		$('input[name="oc[referencia]"]').addClass('invalid');
	}
	if (proveedor == "" || proveedor == "0") {
		msgError = msgError + '- Falta ingresar proveedor.<br/>';
		$('input[name="contacto[info][alias]"]').addClass('invalid');
	}
	if ($('input[name="tipo_doc[id]"]').val() == "" || $('input[name="tipo_doc[id]"]').val() == "0") {
		msgError = msgError + '- Falta seleccionar tipo de documento.<br/>';
		$('input[name="tipo_doc[descripcion]"]').addClass('invalid');
	}

	var items = $('#sheet-compras > table.items > tbody > tr');
	if (items.length > 0) {
		var cant = 0;
		items.each(function(key,item) {
		  var numbers = $(this).find('input[name="oc[detalle_item][total]"]').val();
		  var names = $(this).find('input[name="oc[detalle_item][nombre]"]').val();
		  if ($(this).data('tipo')=="ITEM") {
			if (numbers == 0 || numbers < 0){
					$(this).find('input[name="oc[detalle_item][cantidad]"]').addClass('invalid');
					$(this).find('input[name="oc[detalle_item][precio]"]').addClass('invalid');
					cant++;
			}
		  }
		  if (names.trim()==""){
			$(this).find('input[name="oc[detalle_item][nombre]"]').addClass('invalid');
			cant++;
		  }
		});
		if(cant > 0)
			msgError = msgError + '- Falta ingresar datos en ítem.<br/>';
		}
	}

	// verifica estatus final
	if (msgError == '') {
	  status = true;
	}else{
	  toastr.error(msgError);
	  status = false;
	}

	return status;

}*/

var _validationDocAsociadosOC = function () {
	var targetCompras = $('#sheet-compras');
	var id = targetCompras.data('id');
	var state = true;
	$.ajax({
		'url': '/4DACTION/_v3_verifica_doc_asociados_oc',
		data: {
			"id_oc": id
		},
		dataType: 'json',
		async: false,
		success: function (data) {
			state = data.success;
		}
	});
	return state;
}

const validateFieldsFXR = () => {
	var container = $('#sheet-compras');
	var tipoGasto = container.find('input[name="oc[tipo_gastos][id]"]').val();
	if (tipoGasto == 'FXR') {
		document.querySelectorAll('.input_banco, .input_nro_cuenta, .input_clabe, .input_tipo_cuenta').forEach((input) => {
			input.classList.remove('transferencia');
		})

	}

}


const validateFieldsOC = () => {
	const datos_extras = unaBase.parametros.datos_extras_banco_contacto;
	if (!datos_extras) {
		let ulElement = document.querySelector('.datos-extras');
		ulElement.innerHTML = '';
	}

	if (compras.tipoGasto && compras.tipoGasto != "FTG") {


		const setFieldsContacto = (path, value) => {
			const id = $('input[type="hidden"][name="contacto[info][id]"]').val()
			$.ajax({
				url: '/4DACTION/_V3_setContacto',
				method: 'POST',
				data: {
					id,
					[path]: value
				},
				dataType: 'json',
				success: function (data) {
					toastr.success('Contacto actualizado correctamente!');
				},
				error: function (error) {
					// Manejo de error
					console.error('Error en la solicitud:', error);
				}
			});
		}

		if (datos_extras) {
			let inputElements = document.querySelectorAll('.datos-extras li input');
			inputElements.forEach(input => {
				input.addEventListener('change', (event) => {
					console.log('Input changed:', event.target.name, event.target.value);
					setFieldsContacto(event.target.name, event.target.value);
				});
			});
		}
	}
}





(function init() {
	validateFieldsFXR()
	validateFieldsOC()


})();