//Lógica para ajustar el valor del IVA
let isNetoManipulated = false;
let isItemManipulated = false;
var dtc = {
	"container": $('#sheet-dtc'),
	"containerItems": $('#sheet-dtc').find('table.items > tbody'),
	"tries": 0,
	isDraft: function () {
		return parseInt(document.querySelector(`span[data-name="resumen[dtc][number]"]`).innerHTML) === 0
	},
	init: function (id) {
		$.ajax({
			'url': '/4DACTION/_V3_proxy_getDtcContent',
			data: {
				"id": id,
				"api": true
			},
			dataType: 'json',
			async: false,
			success: function (data) {
				dtc.data = data;
				dtc.parent = data;
				// Seleccion Tipo Documento por Usuario
				const categoriaSelect = document.querySelector('select[name="tipo_compra"]');

				if (categoriaSelect) {
					const opciones = [...categoriaSelect.options];
					const tipoCompraDiv = document.querySelector('.tipo-compra');

					if (tipoCompraDiv) {
						const desTipo = (dtc.data.des_tipo_doc || '').trim().toUpperCase();

						const mostrar = desTipo ==='FACTURA ELECTRONICA';
						tipoCompraDiv.style.display = mostrar ? '' : 'none';

						if (!mostrar) {
							const select = tipoCompraDiv.querySelector('select[name="tipo_compra"]');
							if (select) select.value = '';
						}
					}

					const setByText = (txt) => {
						if (!txt || txt.trim() === '-') {
							categoriaSelect.value = '';
							return true;
						}
						const buscado = txt.trim().toLowerCase();
						const opt = opciones.find(o => o.text.trim().toLowerCase() === buscado);
						if (opt) {
							categoriaSelect.value = opt.value;
							return true;
						}
						return false;
					};

					if (dtc.data.tipo_compra &&
						opciones.some(o => o.value === dtc.data.tipo_compra)) {
						categoriaSelect.value = dtc.data.tipo_compra;
					} else {
						if (!setByText(dtc.data.tipo_compra)) {
							setByText(dtc.data.tipo_compra_text);
						}
					}

					const syncCategoria = () => {
						const idx = categoriaSelect.selectedIndex;

						dtc.data.tipo_compra = categoriaSelect.value;

						const rawText = idx >= 0 ? categoriaSelect.options[idx].text.trim() : '';
						dtc.data.tipo_compra_text = (rawText === '-' ? '' : rawText);
					};

					syncCategoria();

					categoriaSelect.addEventListener('change', syncCategoria);
				}

			}
		});
		dtc.id = dtc.data.id;
		dtc.estado = dtc.data.estado;
		dtc.idcomp = dtc.data.idComprobante;
		dtc.idCargaLista = dtc.data.idCargaLista;
		dtc.isLibroBoleta = dtc.data.isLibroBoleta;

		var url = dtc.data.urlCargaLista;
		let isModificated = false;

		dtc.moneda = {
			code: (($('#sheet-dtc').data("moneda") != undefined) ? $('#sheet-dtc').data("moneda") : ""),
			cambio: (($('#sheet-dtc').data("valorcambio") != undefined) ? $('#sheet-dtc').data("valorcambio") : 1)
		}




		if (dtc.idCargaLista != 0) {
			$('[data-name="btn-descargar"]').show();
			$('[data-name="btn-descargar"]').click(function (event) {


				if (!dtc.isLibroBoleta) {
					url =
						nodeUrl +
						"/download-pdf-dtc/?download=true&entity=conexion_sii" +
						"&id=" +
						dtc.idCargaLista +
						"&folio=" +
						dtc.data.folio +
						"&sid=" +
						unaBase.sid.encoded() +
						"&hostname=" +
						window.location.origin;



				}


				var download = window.open(url);
				download.blur();
				window.focus();


			});

		} else {
			$('[data-name="btn-descargar').hide();
		}


		if (dtc.idcomp != 0) {
			$('[data-name="comprobante[dtc][origen]"]').show();
			$('[data-name="comprobante[dtc][origen]"]').click(function (event) {

				window.open("http://" + window.location.host + "/4DACTION/wbienvenidos#comprobantes/content.shtml?id=" + dtc.idcomp, '_blank');
			});

		} else {
			$('[data-name="comprobante[dtc][origen]"]').hide();
		}


		dtc.moneda.cambio = dtc.moneda.cambio || 1;

		if (dtc.moneda.code != currency.code && dtc.moneda.code != "") {
			$('.container-symbol-new').text(dtc.moneda.code);
			if (dtc.moneda.cambio == 0) {
				dtc.moneda.cambio = 1;
			}
		}

		if (dtc.data.from == "OC") {
			$('[data-name="resumen[dtc][origen]"]').show().text("ASOCIADA A ORDEN DE COMPRA");
			$('[name="label-referencia"]').text("Referencia");
			$('button.add.items').hide();
		} else {
			if (dtc.data.from == "FXR") {
				$('[data-name="resumen[dtc][origen]"]').show().text("ASOCIADA A RENDICIÓN");
				$('[name="label-referencia"]').text("Concepto");
				$('button.add.items').hide();
			} else {
				$('[data-name="resumen[dtc][origen]"]').hide().text("");
			}
		}

		if (dtc.data.montos.justificado > 0) {
			$('.add.ocs').hide();
		}

		// General
		$('[data-name="resumen[dtc][state]"]').text(dtc.data.estado);
		$('[data-name="resumen[dtc][register]"]').text("CREADA POR " + dtc.data.emisor + " EL " + dtc.data.fecha_registro + " A LAS " + dtc.data.hora_registro + " HRS.");
		$('[name="referencia"]').val(dtc.data.referencia);
		$('[name="id_tipo_doc"]').val(dtc.data.id_tipo_doc);
		$('[name="des_tipo_doc"]').val(dtc.data.des_tipo_doc);
		$('[name="folio"]').val(dtc.data.folio);
		$('[name="fecha_emision"]').val(dtc.data.fecha_emision);
		$('[name="fecha_recepcion"]').val(dtc.data.fecha_recepcion);
		dtc.resumen.general();

		// Proveedor
		$('[name="contacto[info][alias]"]').val(dtc.data.contacto.alias);
		$('[name="contacto[info][razon_social]"]').val(dtc.data.contacto.razon_social);
		$('[name="contacto[info][id]"]').val(dtc.data.contacto.id);
		$('[name="contacto[info][rut]"]').val(dtc.data.contacto.rut);
		$('[name="contacto[info][giro]"]').val(dtc.data.contacto.giro);
		$('[name="des_forma_pago"]').val(dtc.data.des_forma_pago);
		dtc.resumen.contactos();

		// Items
		var items = dtc.items.get(dtc.id);
		dtc.items.load(items);


		// Totales
		// $('[name="descuento_nc_netos"]').val(dtc.data.montos.descuento_nc_netos);
		// $('[name="descuento_nc_total"]').val(dtc.data.montos.descuento_nc_total);

		$('[name="descuento_nc_netos"]').val($.number(dtc.data.montos.descuento_nc_netos / dtc.moneda.cambio, currency.decimals, currency.decimals_sep, currency.thousands_sep));
		$('[name="descuento_nc_total"]').val($.number(dtc.data.montos.descuento_nc_total / dtc.moneda.cambio, currency.decimals, currency.decimals_sep, currency.thousands_sep));

		/*$('[name="por_pagar"]').val(dtc.data.montos.por_pagar);
		$('[name="pagado"]').val(dtc.data.montos.pagado);*/
		$('[name="suma_pagos"]').text(dtc.data.montos.pagado);

		$('[name="por_pagar"]').val($.number(dtc.data.montos.por_pagar / dtc.moneda.cambio, currency.decimals, currency.decimals_sep, currency.thousands_sep));
		$('[name="pagado"]').val($.number(dtc.data.montos.pagado / dtc.moneda.cambio, currency.decimals, currency.decimals_sep, currency.thousands_sep));
		// $('[name="suma_pagos"]').text(dtc.data.montos.pagado, currency.decimals, currency.decimals_sep, currency.thousands_sep));

		/*$('[name="por_justificar"]').val(dtc.data.montos.por_justificar);
		$('[name="justificado"]').val(dtc.data.montos.justificado);*/

		// 

		var sumaJustificado = dtc.data.montos.justificado / (dtc.moneda.cambio || 1);
		$('[name="suma_justificados"]').text($.number(sumaJustificado, currency.decimals, currency.decimals_sep, currency.thousands_sep));

		$('[name="por_justificar"]').val($.number(dtc.data.montos.por_justificar / dtc.moneda.cambio, currency.decimals, currency.decimals_sep, currency.thousands_sep));
		$('[name="justificado"]').val($.number(dtc.data.montos.justificado / dtc.moneda.cambio, currency.decimals, currency.decimals_sep, currency.thousands_sep));
		// $('[name="suma_justificados"]').text($.number(dtc.data.montos.justificado, currency.decimals, currency.decimals_sep, currency.thousands_sep));



		$('[name="sub_total"]').val($.number(dtc.data.montos.sub_total / dtc.moneda.cambio, currency.decimals, currency.decimals_sep, currency.thousands_sep));
		$('[name="porcentaje_descuento"]').val(0);
		$('[name="descuento"]').val($.number(dtc.data.montos.descuento / dtc.moneda.cambio, currency.decimals, currency.decimals_sep, currency.thousands_sep));
		$('[name="exento"]').val($.number(dtc.data.montos.exento / dtc.moneda.cambio, currency.decimals, currency.decimals_sep, currency.thousands_sep));
		$('[name="neto"]').val($.number(dtc.data.montos.neto / dtc.moneda.cambio, currency.decimals, currency.decimals_sep, currency.thousands_sep));

		$('[name="iva"]').val($.number(dtc.data.montos.iva / dtc.moneda.cambio, currency.decimals, currency.decimals_sep, currency.thousands_sep));
		$('[name="adicional"]').val($.number(dtc.data.montos.adicional / dtc.moneda.cambio, currency.decimals, currency.decimals_sep, currency.thousands_sep));

		$('[name="total"]').val($.number(dtc.data.montos.total / dtc.moneda.cambio, currency.decimals, currency.decimals_sep, currency.thousands_sep));

		// ajuste imp - muestra si ajuste es mayor a cero
		$('input[name="total_ajuste_imp"]').val($.number(dtc.data.montos.total_ajuste_imp / dtc.moneda.cambio, currency.decimals, currency.decimals_sep, currency.thousands_sep));
		if (dtc.data.montos.total_ajuste_imp == 0) {
			$('.box-ajuste-imp').hide();
		}

		// ajuste - muestra si ajuste es mayor a cero
		$('input[name="total_ajuste_pre"]').val($.number(dtc.data.montos.total_ajuste / dtc.moneda.cambio, currency.decimals, currency.decimals_sep, currency.thousands_sep));
		$('input[name="total_ajuste"]').val(dtc.data.montos.total_ajuste / dtc.moneda.cambio);
		if (dtc.data.montos.total_ajuste == 0) {
			$('.box-ajuste-total').hide();
		}

		// preliquidacion
		// $('[name="liquido"]').val(dtc.data.liquidacion.liquido);
		// $('[name="sbase"]').val(dtc.data.liquidacion.sbase);

		$('[name="liquido"]').val($.number(dtc.data.liquidacion.liquido / dtc.moneda.cambio, currency.decimals, currency.decimals_sep, currency.thousands_sep));
		$('[name="sbase"]').val($.number(dtc.data.liquidacion.sbase / dtc.moneda.cambio, currency.decimals, currency.decimals_sep, currency.thousands_sep));

		// $('[name="hextras"]').val(dtc.data.liquidacion.hextras);
		// $('[name="gratificaciones"]').val(dtc.data.liquidacion.gratificaciones);

		$('[name="hextras"]').val($.number(dtc.data.liquidacion.hextras / dtc.moneda.cambio, currency.decimals, currency.decimals_sep, currency.thousands_sep));
		$('[name="gratificaciones"]').val($.number(dtc.data.liquidacion.gratificaciones / dtc.moneda.cambio, currency.decimals, currency.decimals_sep, currency.thousands_sep));

		// $('[name="thaberes"]').val(dtc.data.liquidacion.thaberes);
		// $('[name="tdescuentos"]').val(dtc.data.liquidacion.tdescuentos);

		$('[name="thaberes"]').val($.number(dtc.data.liquidacion.thaberes / dtc.moneda.cambio, currency.decimals, currency.decimals_sep, currency.thousands_sep));
		$('[name="tdescuentos"]').val($.number(dtc.data.liquidacion.tdescuentos / dtc.moneda.cambio, currency.decimals, currency.decimals_sep, currency.thousands_sep));

		if (dtc.data.liquidacion.leycinechk) {
			$('[name="leycinechk"]').prop("checked", true);
		} else {
			$('[name="leycinechk"]').prop("checked", false);
		}
		// $('[name="leycinemonto"]').val(dtc.data.liquidacion.leycinemonto);
		$('[name="leycinemonto"]').val($.number(dtc.data.liquidacion.leycinemonto / dtc.moneda.cambio, currency.decimals, currency.decimals_sep, currency.thousands_sep));




		$('[name="lpagaremp"]').val($.number(dtc.data.liquidacion.lpagaremp / dtc.moneda.cambio, currency.decimals, currency.decimals_sep, currency.thousands_sep));
		$('[name="lpagarpre"]').val($.number(dtc.data.liquidacion.lpagarpre / dtc.moneda.cambio, currency.decimals, currency.decimals_sep, currency.thousands_sep));
		$('[name="lpagarsii"]').val($.number(dtc.data.liquidacion.lpagarsii / dtc.moneda.cambio, currency.decimals, currency.decimals_sep, currency.thousands_sep));
		$('[name="tcostoempresa"]').val($.number(dtc.data.liquidacion.tcostoempresa / dtc.moneda.cambio, currency.decimals, currency.decimals_sep, currency.thousands_sep));

		// Adicional
		$('[name="observacion"]').val(dtc.data.observacion);

		// Gastos asociados
		var gastos = dtc.gastos.get(dtc.id);
		dtc.gastos.load(gastos);
		if (dtc.data.from == 'FXR') {
			dtc.container.find('.info-gastos > h1 > label').text('Rendiciones');
		} else {
			dtc.container.find('.info-gastos > h1 > label').text('Órdenes de compra');
		}
		dtc.container.find('.info-gastos > h1 > span').text(gastos.rows.length);

		// Pagos
		var pagos = dtc.pagos.get(dtc.id);
		dtc.pagos.load(pagos);
		dtc.container.find('.info-pagos > h1 > span').text(pagos.rows.length);

		// Comprobantes

		var compr = dtc.comprobantes.get(dtc.id);
		dtc.comprobantes.load(compr);
		dtc.container.find('.info-comprobantes > h1 > span').text(compr.rows.length);

		// Otros
		dtc.setMenu();
		dtc.display.init();
		dtc.display.paint();
	},
	display: {
		init: function () {
			// modificar = 449 / eliminar = 465 / anular 503 / crea = 504
			var menuBar = $('#menu ul');
			dtc.container.find("input").removeClass('required').addClass("transparent");

			// oculta y deshabilita las opciones por defecto
			dtc.display.visible(menuBar.find('li[data-name="save"], li[data-name="discard"], li[data-name="share_dtc"], li[data-name="delete_dtc"]'), false);
			dtc.display.visible(dtc.container.find('button.show, .add.op'), false);
			dtc.display.enabled(dtc.container.find('input, textarea'), false);
			dtc.display.visible(dtc.container.find('.info-nc'), true);
			dtc.display.visible(dtc.container.find('.preliquidacion'), false);

			// info conta
			$('input[name="conta_codigo_contable"]').prop('readonly', true);
			$('input[name="conta_centro_costo"]').prop('readonly', true);

			// detraccion - pe
			$('.info-detraccion').prop('readonly', true);



			switch (dtc.data.estado) {
				case 'POR EMITIR':
					dtc.container.find('input[required]').removeClass('transparent').addClass("required");

					if (dtc.data.bloquear_cambios == false) { // save
						dtc.display.visible(menuBar.find('li[data-name="save"]'), true);
					}

					/*if (access._465) { // eliminar
						dtc.display.visible(menuBar.find('li[data-name="delete_dtc"]'), true);
					}*/

					dtc.display.enabled(dtc.container.find('.info-general input'), true);

					dtc.display.enabled(dtc.container.find('.info-general input[name="des_tipo_doc"]').attr("type", "text"), false);
					dtc.display.enabled(dtc.container.find('.info-proveedor input[name="contacto[info][alias]"]').attr("type", "text"), false);
					dtc.display.enabled(dtc.container.find('.info-proveedor input[name="des_forma_pago"]').attr("type", "text"), false);

					if (dtc.data.from == "FXR" || dtc.data.from == "" || dtc.data.from == "FTG") {
						dtc.display.visible(dtc.container.find('.info-general button.show'), true);
						dtc.display.enabled(dtc.container.find('.info-general input[name="des_tipo_doc"]').attr("type", "search"), true);
						dtc.display.visible(dtc.container.find('.info-proveedor button.show'), true);
						dtc.display.enabled(dtc.container.find('.info-proveedor input[name="contacto[info][alias]"]').attr("type", "search"), true);
						dtc.display.enabled(dtc.container.find('.info-proveedor input[name="des_forma_pago"]').attr("type", "search"), true);
					}

					dtc.display.enabled(dtc.containerItems.find('input[required], input[name="dtc[detalle_item][imp][des]"]'), true);
					dtc.display.visible(dtc.containerItems.find('button.show'), true);

					dtc.display.visible(dtc.container.find('.info-totales .totales-post-save  input:not(.multiple.0)'), false);
					dtc.display.enabled(dtc.container.find('textarea[name="observacion"]'), true);
					dtc.display.visible(dtc.container.find('.info-gastos,  .info-pagos'), false);

					// preliquidacion
					if (dtc.data.id_tipo_doc == "111") {
						dtc.display.visible(dtc.container.find('.preliquidacion'), true);
						dtc.display.enabled(dtc.container.find('.preliquidacion input[data-enabled="true"]'), true);
					}

					// creacion desde cero se muestra opciones, sino se oculta
					// if (dtc.data.from != "") {
					// 	//dtc.container.find('button.remove.item, button.duplicate.item, button.add.items').hide();
					// 	dtc.container.find('button.duplicate.item, button.add.items').hide();
					// }

					// permiso para modificar info contable
					if (access._657) {
						$('input[name="conta_codigo_contable"]').prop('readonly', false);
						$('input[name="conta_centro_costo"]').prop('readonly', false);
					}

					// detraccion - pe
					$('.info-detraccion').prop('readonly', false);

					break;

				case 'POR REVISAR':

					if (!dtc.data.bloquear_cambios) { // save
						dtc.display.visible(menuBar.find('li[data-name="save"]'), true);
					}

					if (access._503) { // anular
						dtc.display.visible(menuBar.find('li[data-name="discard"]'), true);
					}
					if (access._449) { // modificar
						dtc.container.find('.info-general').find('.expand').removeClass('active');
						dtc.container.find('.info-proveedor').find('.expand').removeClass('active');
						dtc.display.enabled(dtc.container.find('.info-general input'), true);
						dtc.display.visible(dtc.container.find('.info-general button.show'), true);

						dtc.display.enabled(dtc.container.find('.info-proveedor input[name="contacto[info][alias]"]'), true);
						dtc.display.enabled(dtc.container.find('.info-proveedor input[name="des_forma_pago"]'), true);
						dtc.display.visible(dtc.container.find('.info-proveedor button.show'), true);

						dtc.display.visible(dtc.container.find('.info-totales .totales-post-save'), true);
						dtc.display.enabled(dtc.container.find('textarea[name="observacion"]'), true);
						dtc.display.visible(dtc.container.find('.info-pagos'), false);

					}
					if (access._465) { // eliminar
						dtc.display.visible(menuBar.find('li[data-name="delete_dtc"]'), true);
					}

					// habilitar creacion nc
					if (dtc.data.id_tipo_doc == "30" || dtc.data.id_tipo_doc == "33" || dtc.data.id_tipo_doc == "32" || dtc.data.id_tipo_doc == "34" || dtc.data.id_tipo_doc == "78") {
						dtc.display.visible(dtc.container.find('.info-nc'), true);
					}

					// preliquidacion
					if (dtc.data.id_tipo_doc == "111") {
						dtc.display.visible(dtc.container.find('.preliquidacion'), true);
						dtc.display.enabled(dtc.container.find('.preliquidacion input[data-enabled="true"]'), true);
					}

					// creacion desde cero se muestra opciones, sino se oculta
					// if (dtc.data.from != "") {
					// 	//dtc.container.find('button.remove.item, button.duplicate.item, button.add.items').hide();
					// 	dtc.container.find('button.duplicate.item, button.add.items').hide();
					// }

					// permiso para modificar info contable
					if (access._657) {
						$('input[name="conta_codigo_contable"]').prop('readonly', false);
						$('input[name="conta_centro_costo"]').prop('readonly', false);
					}

					// detraccion - pe
					$('.info-detraccion').prop('readonly', false);

					break;

				case 'POR PAGAR':

					if (!dtc.data.bloquear_cambios) { // save
						dtc.display.visible(menuBar.find('li[data-name="save"]'), true);
					}

					dtc.container.find('.info-general').find('.expand').removeClass('active');
					dtc.container.find('.info-proveedor').find('.expand').removeClass('active');

					// habilitar creacion nc
					if (dtc.data.id_tipo_doc == "30" || dtc.data.id_tipo_doc == "33" || dtc.data.id_tipo_doc == "32" || dtc.data.id_tipo_doc == "34" || dtc.data.id_tipo_doc == "78") {
						dtc.display.visible(dtc.container.find('.info-nc'), true);
					}

					if ((access._503 && !dtc.data.bloquear_cambios)) { // anular
						dtc.display.visible(menuBar.find('li[data-name="discard"]'), true);
					}

					if ((access._465 && !dtc.data.bloquear_cambios)) { // eliminar
						dtc.display.visible(menuBar.find('li[data-name="delete_dtc"]'), true);
					}

					dtc.display.enabled(dtc.container.find('.info-general input[name="des_tipo_doc"]').attr("type", "text"), false);
					dtc.display.enabled(dtc.container.find('.info-proveedor input[name="contacto[info][alias]"]').attr("type", "text"), false);
					dtc.display.enabled(dtc.container.find('.info-proveedor input[name="des_forma_pago"]').attr("type", "text"), false);

					if (access._449) { // modificar
						dtc.display.enabled(dtc.container.find('.info-general input[name="referencia"]'), true);
						dtc.display.enabled(dtc.container.find('.info-general input[name="folio"]'), true);
						dtc.display.enabled(dtc.container.find('.info-general input[name="fecha_emision"]'), true);
						dtc.display.enabled(dtc.container.find('.info-general input[name="fecha_recepcion"]'), true);
						if (dtc.data.from == "FXR") {
							dtc.display.visible(dtc.container.find('.info-general button.show'), true);
							dtc.display.enabled(dtc.container.find('.info-general input[name="des_tipo_doc"]').attr("type", "search"), true);

							dtc.display.visible(dtc.container.find('.info-proveedor button.show'), true);
							dtc.display.enabled(dtc.container.find('.info-proveedor input[name="contacto[info][alias]"]').attr("type", "search"), true);
							dtc.display.enabled(dtc.container.find('.info-proveedor input[name="des_forma_pago"]').attr("type", "search"), true);
						} else {

						}
						dtc.display.enabled(dtc.containerItems.find('input[required], input[name="dtc[detalle_item][imp][des]"]'), true);
						dtc.display.visible(dtc.containerItems.find('button.show'), true);
						dtc.display.enabled(dtc.container.find('textarea[name="observacion"]'), true);
					}

					// preliquidacion
					if (dtc.data.id_tipo_doc == "111") {
						dtc.display.visible(dtc.container.find('.preliquidacion'), true);
						dtc.display.enabled(dtc.container.find('.preliquidacion input[data-enabled="true"]'), true);
					}

					if (access._479) { // crear op
						dtc.display.visible(dtc.container.find('.add.op'), true);
					} else {
						dtc.display.visible(dtc.container.find('.add.op'), false);
					}

					dtc.container.find('button.remove.item, button.duplicate.item, button.add.items').hide();

					if (access._449) { // opcion modificar dtc
						dtc.container.find('button.remove.item').show();
					}

					// permiso para modificar info contable
					if (access._657) {
						$('input[name="conta_codigo_contable"]').prop('readonly', false);
						$('input[name="conta_centro_costo"]').prop('readonly', false);
					}

					// detraccion - pe
					$('.info-detraccion').prop('readonly', false);

					if (accountingMode) {
						dtc.container.find('input').prop('readonly', true);
					}

					break;

				case 'PAGADO':

					if (!access._652) {
						dtc.container.find('button.remove.item, button.duplicate.item, button.add.items').hide();
						dtc.display.enabled(dtc.container.find('.info-general input[name="des_tipo_doc"]').attr("type", "text"), false);
						dtc.display.enabled(dtc.container.find('.info-proveedor input[name="des_forma_pago"]').attr("type", "text"), false);



					} else {
						dtc.display.enabled(dtc.container.find('input, textarea'), true);

					}
					if (access._449) { // modificar

						if (!dtc.data.bloquear_cambios) { // save
							dtc.display.visible(menuBar.find('li[data-name="save"]'), true);
						}

						dtc.container.find('.info-general').find('.expand').removeClass('active');
						dtc.container.find('.info-proveedor').find('.expand').removeClass('active');
					}
					if ((access._503 && !dtc.data.bloquear_cambios)) { // anular
						dtc.display.visible(menuBar.find('li[data-name="discard"]'), true);
					}

					if ((access._465 && !dtc.data.bloquear_cambios)) { // eliminar
						dtc.display.visible(menuBar.find('li[data-name="delete_dtc"]'), true);
					}

					// habilitar creacion nc
					if (dtc.data.id_tipo_doc == "30" || dtc.data.id_tipo_doc == "33" || dtc.data.id_tipo_doc == "32" || dtc.data.id_tipo_doc == "34" || dtc.data.id_tipo_doc == "78") {
						dtc.display.visible(dtc.container.find('.info-nc'), true);
					}

					// preliquidacion
					if (dtc.data.id_tipo_doc == "111") {
						dtc.display.visible(dtc.container.find('.preliquidacion'), true);
						dtc.display.enabled(dtc.container.find('.preliquidacion input[data-enabled="true"]'), true);
					}

					// permiso para modificar info contable
					if (access._657) {
						$('input[name="conta_codigo_contable"]').prop('readonly', false);
						$('input[name="conta_centro_costo"]').prop('readonly', false);
					}

					// detraccion - pe
					$('.info-detraccion').prop('readonly', false);
					if (accountingMode) {
						dtc.container.find('input').prop('readonly', true);
					}

					break;

				case 'NULO':

					// $('data[name="resumen[dtc][state]"]').attr("style", "color:red!important");

					dtc.display.visible(menuBar.find('li[data-name="save"]'), true);
					dtc.container.find('.info-general').find('.expand').removeClass('active');
					dtc.container.find('.info-proveedor').find('.expand').removeClass('active');

					//dtc.display.visible(dtc.container.find('.info-totales .totales-post-save'), false);
					dtc.display.visible(dtc.container.find('.info-gastos,  .info-pagos'), false);

					// preliquidacion
					if (dtc.data.id_tipo_doc == "111") {
						dtc.display.visible(dtc.container.find('.preliquidacion'), true);
						dtc.display.enabled(dtc.container.find('.preliquidacion input[data-enabled="true"]'), true);
					}

					if ((access._465 && !dtc.bloquear_cambios)) { // eliminar
						dtc.display.visible(menuBar.find('li[data-name="delete_dtc"]'), true);
					}

					dtc.display.visible(dtc.container.find('.info-nc'), true);
					dtc.display.visible(dtc.container.find('.add.nc'), false);
					dtc.display.visible(dtc.container.find('.add.ncFull'), false);
					dtc.display.visible(dtc.container.find('.add.ncPartial'), false);

					dtc.display.visible(dtc.container.find('.info-gastos,  .info-pagos'), true);
					dtc.display.visible(dtc.container.find('.addexist.ocs, .add.op'), false);

					dtc.container.find('button.remove.item, button.duplicate.item, button.add.items').hide();
					if (accountingMode) {
						dtc.container.find('input').prop('readonly', true);
					}

					break;
				case 'POR ASIGNAR':
					if ((access._465 && !dtc.data.bloquear_cambios)) { // eliminar
						dtc.display.visible(menuBar.find('li[data-name="delete_dtc"]'), true);
						dtc.display.visible(menuBar.find('li[data-name="save"]'), true);

					}
					$('input[name="fecha_recepcion"]').prop("readonly", false);

					break;
			}





			dtc.container.find('.info-totales input.multiple.0').prop("readonly", false);


			if (dtc.data.from != "FXR") {
				$('input[name="dtc[detalle_item][imp][des]"]').prop("readonly", true);
			}

			if (dtc.data.bloquear_cambios) { // mostrar infografia bloqueado
				dtc.display.visible(dtc.container.find('li[data-name="resumen[dtc][bloqueado_true]"]'), true);
				dtc.display.visible(dtc.container.find('li[data-name="resumen[dtc][bloqueado_false]"]'), false);

				// clasificaciones especiales
				$('input[name="ivafacturasuperm"]').prop("disabled", true);
				$('input[name="ivaactivofijo"]').prop("disabled", true);
				$('input[name="ivaaduanero"]').prop("disabled", true);

				// files
				$('input[name="resumen[dtc][attachment]"]').prop("disabled", true);

				// agregar y eliminar items
				dtc.display.visible(dtc.container.find('button.remove.item, button.duplicate.item, button.add.items, button.addexist.ocs, button.add.nc,button.add.ncPartial,button.add.ncFull, button.add.op'), false);


			} else {
				dtc.display.visible(dtc.container.find('li[data-name="resumen[dtc][bloqueado_true]"]'), false);
				dtc.display.visible(dtc.container.find('li[data-name="resumen[dtc][bloqueado_false]"]'), true);
			}

			dtc.display.visible(dtc.container.find('li[data-name="resumen[dtc][bloqueado_false]"]'), false);

			const inventarioCheckboxElement = document.querySelector('input[name="inventario[dtc]"]');
			if (inventarioCheckboxElement) {
				if (dtc.data && dtc.data.inventario_dtc !== undefined) {
					inventarioCheckboxElement.checked = dtc.data.inventario_dtc
				}

				inventarioCheckboxElement.addEventListener('change', function (event) {
					try {
						dtc.data.inventario_dtc = event.target.checked;
					} catch (error) {
						console.error('Error al guardar el valor en dtc.data["inventario[dtc]"]:', error);
					}
				});
			} else {
				console.error('El elemento input[name="inventario[dtc]"] no existe en el DOM.');
			}



		},
		visible: function (target, status) {
			if (status) {
				target.show();
			} else {
				target.hide();
			}
		},
		enabled: function (target, status) {
			if (status) {
				target.prop("readonly", false);
			} else {
				target.prop("readonly", true);
			}
		},
		paint: function () {
			$('input[required]').each(function (key, item) {
				if ($(this).val() == "" || parseFloat($(this).val()) == 0) {
					$(this).removeClass('transparent').addClass("required");
				} else {
					$(this).removeClass('required').addClass("transparent");
				}
			});

			// Función para limitar caracteres
			const limitarCaracteres = (texto) => {
				const limite = 18;
				return texto.length > limite ? texto.substring(0, limite) + '...' : texto;
			}

			// Función para configurar la visualización de los elementos
			const configurarElementos = (selector, tieneArchivo, textoArchivo, textoIndicador, btnOtroArchivo) => {
				const contenedor = document.querySelector(selector);
				contenedor.querySelector('.file-indicator').children[1].textContent = tieneArchivo ? textoIndicador : `Sin ${selector == '.xml-upload' ? 'XML' : 'archivo'} adjunto`;
				contenedor.querySelector('.file-text-name').textContent = limitarCaracteres(textoArchivo);
				contenedor.querySelector('.file-upload-btn').style.display = tieneArchivo ? 'none' : '';
				contenedor.querySelector('.file-upload-frame-name').children[1].style.display = tieneArchivo ? '' : 'none';
				contenedor.querySelector('.file-upload-frame-name').children[2].style.display = btnOtroArchivo.style.display != 'none' ? 'none' : '';
			}

			// Referencias a botones
			const btnFile = document.querySelector('.file-upload .file-upload-btn');
			const btnFileXML = document.querySelector('.xml-upload .file-upload-btn');
			// Configurar elementos para archivos adjuntos
			configurarElementos('.file-upload', dtc.data.attached_file != '', dtc.data.attached_file, 'Archivo adjunto', btnFile);

			// Configurar elementos para archivos XML adjuntos
			configurarElementos('.xml-upload', dtc.data.attached_xml != '', dtc.data.attached_xml, 'XML adjunto', btnFileXML);


		}
	},
	impuesto: {
		getByDoc: function () {
			var impuestos;
			$.ajax({
				url: '/4DACTION/_V3_getImpuestos',
				dataType: 'json',
				data: {
					'dtc[id]': dtc.data.id_tipo_doc
				},
				async: false,
				success: function (data) {
					impuestos = data;
				}
			});
			return impuestos;
		},
		assign: function () {
			if (dtc.data.id_tipo_doc != "") {
				$.each(dtc.impuesto.getByDoc().rows, function (key, item) {
					if (item.defecto) {
						if (item.correlativo != "") {
							$('input[name="folio"]').val(item.correlativo);
							dtc.data.folio = item.correlativo;
						}
						$('table.items > tbody > tr[data-tipo="ITEM"] > td > input[name="dtc[detalle_item][imp][id]"]').val(item.id);
						$('table.items > tbody > tr[data-tipo="ITEM"] > td > input[name="dtc[detalle_item][imp][id]"]').data('valorimp', item.valor);
						$('table.items > tbody > tr[data-tipo="ITEM"] > td > input[name="dtc[detalle_item][imp][id]"]').data('tipoimp', item.tipo);
						$('table.items > tbody > tr[data-tipo="ITEM"] > td > input[name="dtc[detalle_item][imp][des]"]').val(item.des);
					}
				});
			}
		}
	},
	items: {
		add: function (data) {
			var container = dtc.container.find('table.items > tbody');
			$.each(data.rows, function (key, item) {
				if (item.tipo == "TITULO") {
					get_detail.titulo('prependTo', container, item);
				} else {
					var containerItem = dtc.container.find('table.items > tbody > tr[data-llave="' + item.llave_titulo + '"]');
					if (item.llave_titulo == "") {
						get_detail.item('prependTo', container, item);
					} else {
						get_detail.item('insertAfter', containerItem, item);
					}
				}
			});
			dtc.impuesto.assign();
			dtc.montos.totales();
			dtc.display.paint();
			return false;
		},
		duplicate: function (current) {

			// create and add cloned
			var cloned = current.clone(true, false);
			cloned.insertAfter(current);

			//DTC11603ITEM2

			// set cloned
			//var idoc = 0;
			var iddtc = dtc.id;
			var sequence = parseInt(current.find('input[name="dtc[detalle_item][items]"]').val()) + 1; // 1,2,3...
			var newKey = 'DTC' + iddtc + 'ITEM' + sequence; // OC18507ITEM44
			//var newKey = 'OC'+ idoc + 'ITEM' +  sequence; // OC18507ITEM44
			// cloned.find('input[name="dtc[detalle_item][llave_det_oc]"]').val(newKey);
			cloned.find('input[name="dtc[detalle_item][llave_det_dtc]"]').val(newKey);
			cloned.find('input[name="dtc[detalle_item][items]"]').val(sequence);
			cloned.find('input[name="dtc[detalle_item][id_det_dtc]"]').val(0);
			cloned.attr('data-llave', newKey);

			// show impuestos por linea
			$('button.show').button({ icons: { primary: 'ui-icon-carat-1-s' }, text: false });
			cloned.find('button.show.impuestos').click(function () {
				$(this).closest('tr').find('input[name="dtc[detalle_item][imp][des]"]').autocomplete('search', '@').focus();
			});

			cloned.focusin(function () {
				dtc.items.search(cloned);
			});

			cloned.focusout(function () {
				$(this).find('input[name="dtc[detalle_item][nombre]"]').autocomplete('destroy');
			});

			// cloned.find('.numeric.currency input').number(true, 2, ',', '.');
			cloned.find('.numeric.currency input').number(true, currency.decimals, currency.decimals_sep, currency.thousands_sep);
			cloned.find('.numeric.percent input').number(true, 1, ',', '.');

			dtc.impuesto.assign();
			dtc.montos.totales();

		},
		get: function (id) {
			var items;
			$.ajax({
				'url': '/4DACTION/_V3_get_items_dtc',
				data: {
					"dtc[id]": id
				},
				dataType: 'json',
				async: false,
				success: function (data) {
					items = data;
				}
			});
			return items;
		},
		load: function (data) {

			if (data.rows.length > 0) {
				dtc.containerItems.find("*").remove();
				var numberOfTitles = dtc.containerItems.find('tr[data-tipo="TITULO"]').length;
				$.each(data.rows, function (key, item) {
					if (item.tipo == "TITULO") {
						if (numberOfTitles == 0) {
							get_detail.titulo('prependTo', dtc.containerItems, item); // inserta al principio
						} else {
							var target = dtc.containerItems.find('tr').last();
							get_detail.titulo('insertAfter', target, item); // inserta al final de todas las filas
						}
					} else {
						var insert = "insertAfter";
						if (item.llave_titulo != "") {
							var target = dtc.containerItems.find('tr[data-llavetitulo="' + item.llave_titulo + '"]').last();  // inserta despues del ultimo item del titulo
							if (target.length == 0) {
								var target = dtc.containerItems.find('tr[data-llave="' + item.llave_titulo + '"]'); // inserta despues del titulo
							}
						} else {
							var target = dtc.containerItems.find('tr').last();
							if (target.length == 0) {
								var target = dtc.containerItems;
								var insert = "appendTo";
							}
						}
						get_detail.item(insert, target, item);
					}
				});

				setTimeout(function () {
					dtc.montos.totales();
				}, 1000);

				// $(".origen-asociado-items").text(dtc.data.from);

			}
		},
		removes: function (target) {
			var tipo = target.data('tipo');
			var llave = target.data('llave');
			var llavetitulo = target.data('llavetitulo');
			if (tipo == "TITULO") {
				confirm(MSG.get('CONFIRM_ITEM_DELETE')).done(function (data) {
					if (data) {
						target.fadeOut('slow', function () {
							$(this).remove();
							dtc.container.find('table.items > tbody > tr[data-llavetitulo="' + llave + '"]').remove();
							var cantTotalItemsRestantes = dtc.container.find('table.items > tbody > tr[data-tipo="ITEM"]').length;
							dtc.montos.totales();
						});
					}
				});
			} else {
				target.fadeOut('slow', function () {
					$(this).remove();
					// verifica cantidad de items restantes del titulo, si es cero se quita oc de la lista y titulo
					if (dtc.container.find('table.items > tbody > tr[data-llavetitulo="' + llavetitulo + '"]').length == 0) {
						dtc.container.find('table.items > tbody > tr[data-llave="' + llavetitulo + '"]').remove();
					}
					var cantTotalItemsRestantes = dtc.container.find('table.items > tbody > tr[data-tipo="ITEM"]').length;
					dtc.montos.totales();
				});
			}
		},
		search: function (htmlObject) {
			htmlObject.find('input[name="dtc[detalle_item][nombre]"]').autocomplete({
				source: function (request, response) {
					$.ajax({
						url: '/4DACTION/_V3_' + 'getProductoByCategoria',
						dataType: 'json',
						data: {
							q: request.term,
							id: htmlObject.prevTo('.title').data('categoria')
						},
						success: function (data) {
							response($.map(data.rows, function (item) {
								return item;
							}));
						},
						error: function (jqXHR, exception) {
							toastr.error('No se pudo cargar el listado de items. Error de conexión al servidor.');
						}
					});
				},
				minLength: 0,
				delay: 0,
				position: { my: "left top", at: "left bottom", collision: "flip" },
				open: function () {
					$(this).removeClass('ui-corner-all').addClass('ui-corner-top');
				},
				close: function () {
					$(this).removeClass('ui-corner-top').addClass('ui-corner-all');
				},
				focus: function (event, ui) {
					$(this).val(ui.item.text);
					return false;
				},
				select: function (event, ui) {
					$(this).val(ui.item.text);
					htmlObject.data('idservicio', ui.item.id);
					htmlObject.data('nombre', ui.item.text);
					htmlObject.find('input[name="dtc[detalle_item][id_producto]"]').val(ui.item.id);
					htmlObject.find('input[name="dtc[detalle_item][cod_producto]"]').val(ui.item.index);
					htmlObject.find('input[name="dtc[detalle_item][id_clasif]"]').val(ui.item.categoria.id);
					htmlObject.find('input[name="dtc[detalle_item][des_clasif]"]').val(ui.item.categoria.text);
					if (dtc.container.find('table.items > tbody > tr[data-tipo="ITEM"]').length == 1 && ui.item.categoria.id > 0) {
						var keyTitle = htmlObject.data('llavetitulo');
						var rowTitle = mainContainer.find('table.items > tbody > tr[data-llave="' + keyTitle + '"]');
						var idCat = rowTitle.find('input[name="dtc[detalle_item][id_clasif]"]').val();
						var cantItemsCat = $('table.items > tbody > tr[data-llavetitulo="' + keyTitle + '"]').length;
						if (idCat == 0 || cantItemsCat == 1) {
							rowTitle.data('categoria', ui.item.categoria.id);
							rowTitle.find('input[name="dtc[detalle_item][nombre]"]').val(ui.item.categoria.text);
							rowTitle.find('input[name="dtc[detalle_item][id_clasif]"]').val(ui.item.categoria.id);
							rowTitle.find('input[name="dtc[detalle_item][des_clasif]"]').val(ui.item.categoria.text);
						}
					}
					return false;
				}

			}).data('ui-autocomplete')._renderItem = function (ul, item) {
				return $('<li><a><strong>' + item.index + ' ' + ((item.gasto_fijo) ? '[Gasto Fijo]' : '') + ' ' + ((item.especial) ? '[Especial]' : '') + '</strong><em>' + item.categoria.text + '</em><span class="highlight">' + item.text + '</span></a></li>').appendTo(ul);
			};

			htmlObject.find('input[name="dtc[detalle_item][imp][des]"]').autocomplete({
				source: function (request, response) {
					$.ajax({
						url: '/4DACTION/_V3_getImpuestos',
						dataType: 'json',
						data: {
							q: request.term,
							doc: dtc.data.id_tipo_doc
						},
						success: function (data) {
							response($.map(data.rows, function (item) {
								return item;
							}));
						}
					});
				},
				minLength: 0,
				autoFocus: true,
				open: function () {
					$(this).removeClass('ui-corner-all').addClass('ui-corner-top');
				},
				close: function () {
					$(this).removeClass('ui-corner-top').addClass('ui-corner-all');
				},
				focus: function (event, ui) {
					return false;
				},
				response: function (event, ui) {
				},
				select: function (event, ui) {
					htmlObject.find('input[name="dtc[detalle_item][imp][id]"]').val(ui.item.id);
					htmlObject.find('input[name="dtc[detalle_item][imp][id]"]').data('valorimp', ui.item.valor);
					htmlObject.find('input[name="dtc[detalle_item][imp][id]"]').data('tipoimp', ui.item.tipo);
					htmlObject.find('input[name="dtc[detalle_item][imp][des]"]').val(ui.item.des);
					htmlObject.find('input[name="dtc[detalle_item][imp][des]"]').autocomplete('destroy');
					dtc.montos.totales();
					return false;
				}
			}).data('ui-autocomplete')._renderItem = function (ul, item) {
				return $('<li><a>' + item.des + '</a></li>').appendTo(ul);
			};

		}
	},
	gastos: {
		fromMany: function () {
			let lines = document.querySelectorAll("article.info-items tr[data-idoc]");
			let ids = [];
			for (let line of lines) {
				ids.push(line.dataset.idoc);
			}
			ids = new Set(ids);
			return ids.size > 1
		},
		get: function (id) {
			var gastos;
			$.ajax({
				'url': '/4DACTION/_V3_get_dtc_oc',
				data: {
					"dtc[id]": id
				},
				dataType: 'json',
				async: false,
				success: function (data) {
					gastos = data;
				}
			});
			return gastos;
		},
		load: function (data) {
			var containerCompras = dtc.container.find('table.ocs > tbody');
			var htmlObject;
			if (data.rows.length > 0) {
				$.each(data.rows, function (key, item) {
					htmlObject = dtc.gastos.build(item);
					htmlObject.click(function (event) {
						if (event.srcElement.localName != 'input' && event.srcElement.className != 'ui-button-text')
							unaBase.loadInto.viewport('/v3/views/compras/content.shtml?id=' + item.id);
					});
					containerCompras.append(htmlObject);
				});
			} else {
				htmlObject = $('<tr><td colspan="8">No existen documentos asociados.</td></tr>');
				containerCompras.append(htmlObject);
			}
		},
		/*build: function(item){
			return $('<tr class="bg-white" data-idoc="' + item.id + '">' +
			'<td><input type="hidden" name="ocdt[id_compras]'+ item.id +'" value="'+ item.id +'">' + item.numero + '</td>' +
			'<td>' + item.documento + '</td>' +
			'<td class="left">' + item.proveedor + '</td>' +
			'<td class="left">' + item.referencia + '</td>' +
			'<td>' + item.emision + '</td>' +
			'<td>' + item.estado + '</td>' +
			'<td class="right">' + currency.symbol + ' <span class="numeric currency"><label class="otros_montos">'+ item.total_justificado +'</label></span></td>' +
			'<td><!--<button class="remove ocs">Quitar</button>--></td>' +
		  '</tr>');
		}*/
		build: function (item) {
			var symbolDOC = currency.symbol;
			if (unaBase.defaultCurrencyCode != item.currency)
				symbolDOC = item.currency

			var montoJustificado = item.total_justificado;

			return $('<tr class="bg-white" data-idoc="' + item.id + '">' +
				'<td><input type="hidden" name="ocdt[id_compras]' + item.id + '" value="' + item.id + '">' + item.numero + '</td>' +
				'<td>' + item.documento + '</td>' +
				'<td class="left">' + item.proveedor + '</td>' +
				'<td class="left">' + item.referencia + '</td>' +
				'<td>' + item.emision + '</td>' +
				'<td>' + item.estado + '</td>' +
				'<td class="right">' + symbolDOC + ' <span>' + $.number(montoJustificado, currency.decimals, currency.decimals_sep, currency.thousands_sep) + '</span></td>' +
				'<td><!--<button class="remove ocs">Quitar</button>--></td>' +
				'</tr>');
		}

	},
	montos: {
		items: function (target) {
			var oldPrice = parseFloat(target.find('input[name="dtc[detalle_item][precio]"]').data('precioold'));
			var oldCant = parseFloat(target.find('input[name="dtc[detalle_item][cantidad]"]').data('cantidadold'));
			var cantidad = parseFloat(target.find('input[name="dtc[detalle_item][cantidad]"]').val());
			var precio = parseFloat(target.find('input[name="dtc[detalle_item][precio]"]').val());
			var dscto = parseFloat(target.find('input[name="dtc[detalle_item][dscto]"]').val());
			var subtotal = roundTwo(cantidad * precio);
			var total = roundTwo(subtotal - dscto);

			if (total > oldPrice && (dtc.data.from != "FXR" && dtc.data.from != "") && !access._673) {
				target.find('input[name="dtc[detalle_item][cantidad]"]').val(oldCant);
				target.find('input[name="dtc[detalle_item][precio]"]').val(oldPrice);
				dtc.tries++;
				if (dtc.tries > 1) {
					alert("No es posible ingresar un valor mayor al saldo por justificar de la linea.");
				}
			} else {
				target.find('input[name="dtc[detalle_item][subtotal]"]').val(subtotal);
				target.find('input[name="dtc[detalle_item][total]"]').val(total);
				dtc.montos.totales();
			}
		},
		totales: function () {

			/*var sumaSubTotal = 0;
				var sumaDescuento = 0;
				var sumaTotal = 0;
				var totalAfecto = 0;
				var totalRetencion = 0;
				var totalAdicional = 0;
				var totalExento = 0;*/

			var sumaSubTotales = 0;
			var sumaTotales = 0;
			var sumaExentos = 0;
			var sumaAfectos = 0;
			var sumaAdicional = 0;
			var sumaDescuentos = 0;
			var sumaRetencion = 0;
			var sumaTotales = 0;
			var impuestoIva = 0;
			var impuestoRet = 0;
			var sumaDefault = 0;
			var sumaExtrasRet = 0;
			var sumaExtrasIva = 0;
			var tipoImp = "";
			var sumaExtrasMatriz = [];
			let idsImpMul = [];

			//SETEO TEMPORAL DECIMAL
			const money_default = unaBase.money.find(v => v.default)
			let decimals_view = 0
			if (money_default) {
				decimals_view = money_default.view_decimal
			}

			dtc.containerItems.find('tr[data-tipo="ITEM"]').each(function () {

				/*var subtotalLinea = parseFloat($(this).find('input[name="dtc[detalle_item][subtotal]"]').val());
				var dsctolLinea = parseFloat($(this).find('input[name="dtc[detalle_item][dscto]"]').val());
				var totalLinea = subtotalLinea - dsctolLinea;*/

				sumaSubTotales += parseFloat($(this).find('input[name="dtc[detalle_item][subtotal]"]').val());
				sumaDescuentos += parseFloat($(this).find('input[name="dtc[detalle_item][dscto]"]').val());
				var total = parseFloat($(this).find('input[name="dtc[detalle_item][total]"]').val());
				sumaTotales += total;

				var tipoImp = $(this).find('input[name="dtc[detalle_item][imp][id]"]').data('tipoimp');
				var valorImpuesto = parseFloat($(this).find('input[name="dtc[detalle_item][imp][id]"]').data('valorimp'));

				// $(this).find('input[name="dtc[detalle_item][total]"]').val(totalLinea);

				/*var tipoImp = $(this).find('input[name="dtc[detalle_item][imp][id]"]').data('tipoimp');
				var valorImpuesto = parseFloat($(this).find('input[name="dtc[detalle_item][imp][id]"]').data('valorimp'));*/

				$(this).find('.calculadora').hide();

				/*if (tipoImp == "IVA") {
					totalAfecto += totalLinea;
					if (tipo_gasto_asociado == "FXR") {
						$(this).find('.calculadora').show();
					}
				}
				if (tipoImp == "RETENCION") {
					totalRetencion += totalLinea;
				}
				if (tipoImp == "ADICIONAL") {
						totalAdicional += totalLinea;
				}
				if (tipoImp == "EXENTO") {
						totalExento += totalLinea;
				}*/


				$(document).on('click', 'button.remove.item', function () {
					isItemManipulated = true;
					console.log('Item manipulado → isItemManipulated = true');
				});


				switch (tipoImp) {
					case "IVA":
						// valorImpuesto = 18;
						sumaAfectos += total;
						//impuestoIva += Math.round((total * valorImpuesto / 100));
						if (!isItemManipulated && dtc.data.montos.iva > 0) {
							// usar el IVA del backend
							impuestoIva = dtc.data.montos.iva;
						} else {
							// recalcular IVA por línea
							impuestoIva += (total * valorImpuesto / 100);
						}
						
						break;

					case "EXENTO":
						sumaExentos += total;
						break;

					case "RETENCION":
						// valorImpuesto = 8;
						sumaRetencion += total;
						//impuestoRet += Math.round((total * valorImpuesto / 100));
						impuestoRet += (total * valorImpuesto / 100);
						break;

					case "ADICIONAL":
						sumaAdicional += total;
						break;
					case "IVA MULTIPLE":

						sumaAfectos += total;
						impuestoIva += (total * valorImpuesto / 100);





						break;
				}
				
				if (tipoImp != "EXENTO") {

					let multiple = $('li.extra');
					multiple.each(function (key, item) {

						let tipoExtraImp = $(this).data('imptipo');
						let porcVal = 0;
						idsImpMul[key] = $(this).data('impid');


						let checkedImp = $(this).find('input.check').attr('checked');
						if (typeof checkedImp === 'undefined') {
							checkedImp = "none"
						}

						if (checkedImp == "checked") {

							let impval = String($(this).data('impvalue'));
							impval = impval.replace(",", '.');

							impval = parseFloat(impval) / 100;
							sumaExtra = (total * impval);

						} else {


							porcVal = $(this).find('input.porc').val().replace(",", '.') / 100;
							sumaExtra = (total * porcVal);

						}

						if (sumaExtrasMatriz[key] == null) {
							sumaExtrasMatriz[key] = 0;
						}

						sumaExtrasMatriz[key] += sumaExtra
						// currentNro = $(this).data('nronv');
						if (tipoExtraImp == "RETENCION") {
							sumaExtrasRet += sumaExtra;

						}
						if (tipoExtraImp == "IVA") {
							sumaExtrasIva += sumaExtra;

						}



					});
				}
				// var justificado = totalLinea;

				var justificado = total;

				$(this).find('input[name="dtc[detalle_item][total]"]').data('justificado', justificado);
				/*sumaSubTotal += subtotalLinea;
				sumaDescuento += dsctolLinea;
				sumaTotal += totalLinea;*/

			});

			// impuestos
			/*var iva = (totalAfecto * ivaRate)/100;
			var ret = (totalRetencion * retRate)/100;
			var impuesto = iva + ret;*/

			// calcula monto total
			// var total_final = totalAfecto + iva + (totalRetencion - ret) + totalExento + totalAdicional;


			sumaExtrasMatriz.forEach(function (key, item) {


				$('input[name="dtc[impuesto_extra' + idsImpMul[item] + ']"]').val($.number(sumaExtrasMatriz[item], decimals_view, currency.decimals_sep, currency.thousands_sep));


			});

			// Calcular suma total de impuestos extras (incluyendo ILA)
			var sumaTotalImpuestosExtras = 0;
			sumaExtrasMatriz.forEach(function (key, item) {
				sumaTotalImpuestosExtras += sumaExtrasMatriz[item];
			});

			var totalNeto = sumaAfectos + sumaRetencion;
			dtc.data.montos.sub_total = sumaSubTotales;
			dtc.data.montos.descuento = sumaDescuentos;
			dtc.data.montos.exento = sumaExentos;
			dtc.data.montos.neto = totalNeto;

			if (impuestoIva > 0 && sumaExtrasIva > 0)
				var impuestodtc = unaBase.utilities.general.format.formatAntiSII(impuestoIva + impuestoRet);
			else
				var impuestodtc = impuestoRet + impuestoIva;

			dtc.data.montos.iva = impuestodtc + dtc.data.montos.total_ajuste_imp;


			// dtc.data.montos.extra1=sumaImpExtra1;
			// dtc.data.montos.extra2=sumaImpExtra2;

			// agregado para sumar a total el adicional por servicio, cliente shark, gin 13-06-19
			sumaAdicional = sumaAdicional + dtc.data.montos.adicional_por_servicio;

			dtc.data.montos.adicional = sumaAdicional;
			var totaldtc;
			// const docTypes = {
			// 	"33": () => {
			// 		//factura
			// 		totaldtc = (sumaAfectos + impuestoIva + (sumaRetencion - impuestoRet ) + sumaExentos + sumaAdicional);
			// 		totaldtc = totaldtc + dtc.data.montos.total_ajuste + dtc.data.montos.total_ajuste_imp;
			// 	},
			// 	"65": () => {					// boleta

			// 		totaldtc = (sumaAfectos + impuestoIva + (sumaRetencion - (impuestoRet + dtc.data.montos.total_ajuste_imp)) + sumaExentos + sumaAdicional);
			// 		totaldtc = totaldtc + dtc.data.montos.total_ajuste;
			// 	}
			// }
			// docTypes[dtc.data.id_tipo_doc || "33"]();




			switch (dtc.data.id_tipo_doc) {
				case "33":
					//factura

					if (impuestoIva > 0 && sumaExtrasIva > 0)
						totaldtc = (sumaAfectos + unaBase.utilities.general.format.formatAntiSII(impuestoIva + (sumaRetencion - impuestoRet)) + sumaExentos + sumaAdicional + sumaDefault - sumaExtrasRet + sumaExtrasIva);
					else
						totaldtc = (sumaAfectos + impuestoIva + (sumaRetencion - impuestoRet) + sumaExentos + sumaAdicional + sumaDefault - sumaExtrasRet + sumaExtrasIva + sumaTotalImpuestosExtras);

					totaldtc = totaldtc + dtc.data.montos.total_ajuste + dtc.data.montos.total_ajuste_imp;
					break;
				case "46":
					//factura a terceros
					if (impuestoIva > 0 && sumaExtrasIva > 0)
						totaldtc = (sumaAfectos + unaBase.utilities.general.format.formatAntiSII(impuestoIva + (sumaRetencion - impuestoRet)) + sumaExentos + sumaAdicional + sumaDefault - sumaExtrasRet + sumaExtrasIva + sumaTotalImpuestosExtras);
					else
						totaldtc = (sumaAfectos + (sumaRetencion - impuestoRet) + sumaExentos + sumaAdicional + sumaDefault - sumaExtrasRet + sumaExtrasIva + sumaTotalImpuestosExtras);

					totaldtc = totaldtc + dtc.data.montos.total_ajuste + dtc.data.montos.total_ajuste_imp;
					break;
				case "65":
					// boleta
					totaldtc = (sumaAfectos + impuestoIva + (sumaRetencion - (impuestoRet + dtc.data.montos.total_ajuste_imp)) + sumaExentos + sumaAdicional + sumaDefault - sumaExtrasRet + sumaExtrasIva + sumaTotalImpuestosExtras);
					totaldtc = totaldtc + dtc.data.montos.total_ajuste;
					break;
				default:
					//otros
					totaldtc = (sumaAfectos + impuestoIva + (sumaRetencion - impuestoRet) + sumaExentos + sumaAdicional + sumaDefault - sumaExtrasRet + sumaExtrasIva + sumaTotalImpuestosExtras);
					totaldtc = totaldtc + dtc.data.montos.total_ajuste + dtc.data.montos.total_ajuste_imp;
					break;
			}



			// if(dtc.data.des_tipo_doc.toLowerCase().includes("factura")){
			// 	//factura
			// 	totaldtc = (sumaAfectos + impuestoIva + (sumaRetencion - impuestoRet ) + sumaExentos + sumaAdicional);

			// 	totaldtc = totaldtc + dtc.data.montos.total_ajuste + dtc.data.montos.total_ajuste_imp;
			// }else if(dtc.data.des_tipo_doc.toLowerCase().includes("boleta")){
			// 	totaldtc = (sumaAfectos + impuestoIva + (sumaRetencion - (impuestoRet + dtc.data.montos.total_ajuste_imp)) + sumaExentos + sumaAdicional);
			// 	totaldtc = totaldtc + dtc.data.montos.total_ajuste;
			// }
			function toNumber(value) {
				if (!value) return 0;
				value = value.replace(/\./g, '').replace(',', '.');
				let num = parseFloat(value);
				return isNaN(num) ? 0 : num;
			}

			$('input[name="sub_total"]').val($.number(dtc.data.montos.sub_total, decimals_view, currency.decimals_sep, currency.thousands_sep));
			$('input[name="descuento"]').val($.number(dtc.data.montos.descuento, decimals_view, currency.decimals_sep, currency.thousands_sep));
			$('input[name="neto"]').val($.number(dtc.data.montos.neto, decimals_view, currency.decimals_sep, currency.thousands_sep));
			
			// Variable que permite recalcular el IVA si es que el usuario lo modifica manualmente 
			

			// Se deja originalmente el valor del IVA de Sii

			$(document).on('input change keyup', 'input[name="dtc[detalle_item][precio]"]', function () {
				//console.log("Evento capturado:", $(this).val());
				isNetoManipulated = true;
			});

			if (isNetoManipulated) {
				var netoStr = $('input[name="neto"]').val();

				let neto = toNumber(netoStr);

				let iva = neto * 0.19; // cambia 0.19 si corresponde otra tasa
				$('input[name="iva"]').val($.number(iva, decimals_view, currency.decimals_sep, currency.thousands_sep));
			} else{
				$('input[name="iva"]').val($.number(dtc.data.montos.iva, decimals_view, currency.decimals_sep, currency.thousands_sep));
			}
			// End Working

			

			$('input[name="exento"]').val($.number(dtc.data.montos.exento, decimals_view, currency.decimals_sep, currency.thousands_sep));
			$('input[name="adicional"]').val($.number(dtc.data.montos.adicional, decimals_view, currency.decimals_sep, currency.thousands_sep));


			dtc.data.montos.total = totaldtc;
			$('input[name="total"]').val($.number(dtc.data.montos.total, decimals_view, currency.decimals_sep, currency.thousands_sep));

			// ajusta etiquetas
			if (dtc.data.id_tipo_doc == "65" || dtc.data.id_tipo_doc == "66" || dtc.data.id_tipo_doc == "118" || dtc.data.id_tipo_doc == "119" || dtc.data.id_tipo_doc == "1002") {
				if (dtc.data.id_tipo_doc == "118") {
					$('span[name="label-neto-hono"]').text('Impuesto');
					$('span[name="label-iva-ret"]').text(retName + " (" + retRate + "%)");
				} else {
					if (dtc.data.id_tipo_doc == "119") {
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

		},
		update_impuesto_multiple: async function (obj) {

			let iddtc = dtc.id;
			let auto = obj.attributes.auto.value;
			let autocalculado = true;
			let porc = 0;
			let estado = true;
			let idimp = obj.attributes.impid.value;
			let nameWeb = $('li.extra').find('input[impid="' + idimp + '"].porc')[0].attributes.name.value;
			let valor = $('li.extra').find('input[impid="' + idimp + '"].porc');




			if (auto == "1") {
				estado = obj.checked;

				if (!estado) {

					autocalculado = false;

				} else {
					porc = obj.attributes.impvalue.value;
				}



			} else {
				estado = false;
				autocalculado = false;
				let target = obj.parentElement.previousElementSibling;
				target.checked = false;
				if (obj.attributes.tipo.value == 'porc') {
					porc = obj.value;
				} else {

					if (obj.attributes.tipo.value == 'total') {
						let total = $('input[name="neto"]').val();

						let rem = "";
						if (currency.decimals_sep == ".") {
							rem = ",";
						} else {
							rem = ".";
						}

						let y = await total.replaceAll(rem, '').replaceAll(",", '.');


						porc = parseFloat(obj.value.replaceAll(rem, '').replaceAll(",", '.')) * 100 / parseFloat(y);






					}

				}
			}
			$('li.extra').find('input[impid="' + idimp + '"].porc').val($.number(porc, 4, currency.decimals_sep, currency.thousands_sep));

			valor[0].value = $.number(porc, 4, currency.decimals_sep, currency.thousands_sep);



			const res = await axios('/4DACTION/_V3_set_impuestoMultipleDtc?iddtc=' + iddtc + '&idimp=' + idimp + '&estado=' + estado + '&porc=' + porc + '&valor=' + valor + '&nameWeb=' + nameWeb + '&autocalculado=' + autocalculado);





			dtc.montos.totales();

		},
		update_impuestos_multiples_view: async function (idDoc) {



			let idoc = dtc.id;
			let multiples = "";

			await axios('/4DACTION/_V3_get_impuestoMultiple?idoc=' + idoc + '&iddoc=' + idDoc + '&origen=dtc')
				.then((res) => {
					let extras = $('li.extra');

					if (extras.length > 0) {
						extras.remove();
					}

					$.each(res.data.rows, function (key, item) {
						if (item.estado) {
							check = "checked";
						} else {
							check = "";
						}

						multiples +=
							'<li class="extra" id="' + item.id_name + '"' + ' data-impvalue="' + item.value + '" data-impname="' + item.name + '" data-impid="' + item.id + '" data-imptipo="' + item.tipo + '">' +
							'<span>' + item.name + '</span>' +
							'<input onclick="dtc.montos.update_impuesto_multiple(this)" impid="' + item.id + '" class="check" impvalue="' + item.value + '"  name="dtc[check_auto_impuesto_' + item.id_name + ']" type="checkbox" ' + check + '  auto="1"  >' +
							'<span class="numeric percent"><input  tipo="porc" class=" multiple ' + item.auto + ' porc "' +
							'type="text" onchange="dtc.montos.update_impuesto_multiple(this)" impid="' + item.id + '" ' +
							'name="dtc[check_impuesto_' + item.id_name + ']" ' +
							'auto="' + item.auto + '" value="' + item.porc + '"> %</span>' +
							'<span class="numeric currency"><label class="container-symbol-new">$</label><input  tipo="total"  class=" multiple ' + item.auto + '"' +
							'type="text" name="dtc[impuesto_' + item.id_name + ']" value="' + item.valor_total + '" nchange="dtc.montos.update_impuesto_multiple(this)" auto=" ' + item.auto + '" impid="' + item.id + '"></span>' +
							'</li>';

					});

					multiples = $.parseHTML(multiples);

					$('#ivali').after(multiples);


				})
				.then((res) => {
					dtc.montos.totales();

				})
				.catch((err) => {

				});







		}

	},
	notasCredito: {
		add: function (type = false, amount = 0) {
			$.ajax({
				url: '/4DACTION/_V3_setDtcnc',
				dataType: 'json',
				type: 'POST',
				data: {
					"credito": true,
					"id_factura": dtc.id,
					type,
					amount
				}
			}).done(function (data) {

				unaBase.loadInto.viewport('/v3/views/dtc/contentnc.shtml?id=' + data.id, undefined, undefined, undefined, { ncType: type, amount });
			});
		},
		get: function (id) {

		},
		load: function (data) {

		}
	},
	pagos: {
		get: function (id) {
			var pagos;
			$.ajax({
				'url': '/4DACTION/_V3_get_dtc_pagos_2',
				data: {
					"dtc[id]": id
				},
				dataType: 'json',
				async: false,
				success: function (data) {

					pagos = data;
				}
			});
			return pagos;
		},
		load: function (data) {
			const formatearNumero = (value) => {
				const decimals = parseInt(currency.decimals)
				let number = parseFloat(value.replace(',', '.'));

				return number.toLocaleString('es-AR', { currency: 'ARS', minimumFractionDigits: decimals, maximumFractionDigits: decimals });
			}

			let op_abono = 0;
			let op_total = 0;
			let symbolOP = currency.symbol;
			if (dtc.moneda.code != currency.code && dtc.moneda.code != "") {
				symbolOP = dtc.moneda.code;

			}
			let containerPagos = dtc.container.find('table.pagos > tbody');
			containerPagos.find("*").remove();
			if (data.rows.length > 0) {
				//remueve boton crear egreso, si ya tiene pago desde algúna Oc
				let validPayment = data.rows.filter(i => i.origenModulo === "OC" && i.estado !== "ANULADA");
				if (validPayment.length) $("button.add.op").remove();
				$.each(data.rows, function (key, item) {

					/*htmlObject = $('<tr title="'+ item.origen +'" class="bg-white" data-id="' + item.id + '">' +
					'<td>' + item.folio + '</td>' +
					'<td>' + item.emision + '</td>' +
					'<td>' + item.vencimiento + '</td>' +
					'<td>' + item.proveedor + '</td>' +
					'<td>' + item.tipo + '</td>' +
					'<td>' + item.documento + '</td>' +
					'<td>' + item.estado + '</td>' +
					'<td class="numeric currency right">' + currency.symbol + ' <span class="decinot">'+ item.abono +'</span></td>' +
					'<td class="numeric currency right">' + currency.symbol + ' <span class="decinot">'+ item.total_pago +'</span></td>' +
					'</tr>');*/


					let tabono = item.abono / item.monedaValorCambio;
					let tpago = item.total_pago / item.monedaValorCambio;


					htmlObject = $('<tr title="' + item.origen + '" class="bg-white" data-id="' + item.id + '">' +
						'<td>' + item.folio + '</td>' +
						'<td>' + item.emision + '</td>' +
						'<td>' + item.vencimiento + '</td>' +
						'<td>' + item.proveedor + '</td>' +
						'<td>' + item.tipo + '</td>' +
						'<td>' + item.documento + '</td>' +
						'<td ' + ((item.estado == "ANULADA") ? 'style="color:red;font-weight:bold"' : '') + '>' + item.estado + '</td>' +
						'<td class="numeric currency right">' + symbolOP + ' <span>' + $.number(tabono, currency.decimals, currency.decimals_sep, currency.thousands_sep) + '</span></td>' +
						'<td class="numeric currency right">' + symbolOP + ' <span>' + $.number(tpago, currency.decimals, currency.decimals_sep, currency.thousands_sep) + '</span></td>' +
						'</tr>');

					if (item.estado != "ANULADA") {
						//op_abono += item.abono;
						//op_total += item.total_pago;
						op_abono += tabono;
						op_total += tpago;
					}
					htmlObject.click(function () {
						unaBase.loadInto.viewport('/v3/views/pagos/content2.shtml?id=' + item.id);
					});
					containerPagos.append(htmlObject);
				});
			} else {
				if (dtc.data.estado == "PAGADO") {
					if (dtc.data.from == "FXR") {
						htmlObject = $('<tr><td colspan="9">Pagado desde la rendición de fondos.</td></tr>');
					} else {
						htmlObject = $('<tr><td colspan="9">Pagado desde la orden de compra.</td></tr>');
					}
				} else {
					htmlObject = $('<tr><td colspan="9">No existen pagos asociados.</td></tr>');
				}
				containerPagos.append(htmlObject);
			}

			// Actualizar abono y saldo de órdenes de pago
			$('.op_abono').text(formatearNumero(String(op_abono)));
			$('.op_total').text(formatearNumero(String(op_total)));
			//$('.numeric.currency span.decinot').number(true, currency.decimals, currency.decimals_sep, currency.thousands_sep);
		}
	},
	comprobantes: {
		get: function (id) {
			var comp;


			$.ajax({
				'url': '/4DACTION/_V3_get_comprobantes_modulos',
				data: {
					"id": id,
					"tipo": "Dtc"
				},
				dataType: 'json',
				async: false,
				success: function (data) {
					comp = data;
				}
			});
			return comp;
		},
		load: function (data) {

			var containerComprobantes = dtc.container.find('table.comprobantes > tbody');
			containerComprobantes.find("*").remove();
			if (data.rows.length > 0) {
				$.each(data.rows, function (key, item) {


					htmlObject = $('<tr title="comprobantes" class="bg-white" data-id="' + item.idCom + '">' +
						'<td>' + item.idCom + '</td>' +
						'<td>' + item.descripcion + '</td>' +
						'<td>' + item.fechaReg + '</td>' +
						'<td>' + item.docType + '</td>' +
						'</tr>');
					htmlObject.click(function () {
						unaBase.loadInto.viewport('/v3/views/comprobantes/content.shtml?id=' + item.idCom);
					});
					containerComprobantes.append(htmlObject);
				});
			} else {

				htmlObject = $('<tr><td colspan="9">No existen comprobantes asociados.</td></tr>');
				containerComprobantes.append(htmlObject);
			}

		}

	},
	resumen: {
		general: function () {
			if (dtc.data.des_tipo_doc != "") {
				$('[data-name="resumen[dtc][doc]"]').text(dtc.data.des_tipo_doc);
			}
			if (dtc.data.folio != "") {
				$('[data-name="resumen[dtc][number]"]').text(dtc.data.folio);
			} else {
				$('[data-name="resumen[dtc][number]"]').text("00000");
			}
			if (dtc.data.fecha_emision != "") {
				$('[data-name="resumen[dtc][emision]"]').text(dtc.data.fecha_emision);
			}
			if (dtc.data.referencia != "") {
				$('[data-name="resumen[dtc][reference]"]').text(dtc.data.referencia);
			} else {
				$('[data-name="resumen[dtc][reference]"]').text("SIN REFERENCIA");
			}
		},
		contactos: function () {
			if (dtc.data.contacto.alias != "") {
				$('[data-name="resumen[contacto][alias]"]').text(dtc.data.contacto.alias);
			} else {
				$('[data-name="resumen[contacto][alias]"]').text("SIN ALIAS");
			}
			if (dtc.data.contacto.razon_social != "") {
				$('[data-name="resumen[contacto][razon]"]').text(dtc.data.contacto.razon_social);
			} else {
				$('[data-name="resumen[contacto][razon]"]').text("SIN RAZÓN SOCIAL");
			}
		}
	},
	set: function (target) {
		if ($(target).attr('type') == 'checkbox') {
			dtc.data[target.name] = $(target).is(':checked');
		} else {
			dtc.data[target.name] = target.value;
		}
		dtc.resumen.general();
		dtc.display.paint();
	},
	setMenu: function () {
		unaBase.toolbox.init();
		unaBase.toolbox.menu.init({
			entity: 'Dtc',
			buttons: ['save', 'exit', 'share_dtc', 'delete_dtc', 'download-dtc'],
			data: function () {

				return dtc.data;
			},
			validate: function () {
				/*if (dtc.validate.save()) {
					var status = dtc.validate.duplicate();
					if (status.error == "locked") {
						alert('El documento Nro. "'+ dtc.data.folio +'", ya se encuentra registrado para el mismo proveedor. Ingrese un nuevo número.');
						$(this).focus();
					}else{
						if(status.error == "warning"){
							var text = "";
							switch (dtc.data.id_tipo_doc) {
								case ("30" || "33" ):
									if (dtc.data.id_tipo_doc = "30") {
										text = "Ya existe una Factura electrónica con número y proveedor similar.<br><br>¿Desea ingresar el documento como Factura de todos modos?";
									}else{
										text = "Ya existe una Factura con número y proveedor similar.<br><br>¿Desea ingresar el documento como Factura electrónica de todos modos?";
									}
									break;

								case ("32" || "34" ):
									if (dtc.data.id_tipo_doc = "32") {
										text = "Ya existe una Factura exenta electrónica con número y proveedor similar.<br><br>¿Desea ingresar el documento como Factura exenta de todos modos?";
									}else{
										text = "Ya existe una Factura exenta con número y proveedor similar.<br><br>¿Desea ingresar el documento como Factura exenta electrónica de todos modos?";
									}
									break;

								case ("60" || "61" ):
									if (dtc.data.id_tipo_doc = "60") {
										text = "Ya existe una Nota de crédito electrónica con número y proveedor similar.<br><br>¿Desea ingresar el documento como Nota de crédito de todos modos?";
									}else{
										text = "Ya existe una Nota de crédito con número y proveedor similar.<br><br>¿Desea ingresar el documento como Nota de crédito electrónica de todos modos?";
									}
									break;

								case ("55" || "56" ):
									if (dtc.data.id_tipo_doc = "55") {
										text = "Ya existe una Nota de débido electrónica con número y proveedor similar.<br><br>¿Desea ingresar el documento como Nota de débido de todos modos?";
									}else{
										text = "Ya existe una Nota de débido con número y proveedor similar.<br><br>¿Desea ingresar el documento como Nota de débido electrónica de todos modos?";
									}
									break;

								case ("65" || "66" ):
									if (dtc.data.id_tipo_doc = "65") {
										text = "Ya existe una Boleta de honorarios electrónica con número y proveedor similar.<br><br>¿Desea ingresar el documento como Boleta de honorarios de todos modos?";
									}else{
										text = "Ya existe una Boleta de honorarios con número y proveedor similar.<br><br>¿Desea ingresar el documento como Boleta de honorarios electrónica de todos modos?";
									}
									break;
							}
							confirm(text).done(function(data) {
								if (data) {
									return true;
								}
							});
						}
					}
				}else{
					return false;
				}*/

				// return dtc.validate.save();
				return (dtc.data.id_tipo_doc === "61" || dtc.data.id_tipo_doc === "60") ? dtc.validate() : dtc.validate.save();

			}
		});
	},
	validate: {
		save: function () {

			var msgError = "";
			dtc.container.find('input').removeClass("invalid");
			if (dtc.data.referencia == "") {
				msgError = msgError + '- Falta ingresar una referencia.<br/>';
				$('[name="referencia"]').addClass('invalid');
			}
			if (dtc.data.id_tipo_doc == "") {
				msgError = msgError + '- Falta seleccionar el tipo de documento.<br/>';
				$('[name="des_tipo_doc"]').addClass('invalid');
			}
			if (dtc.data.folio == "") {
				msgError = msgError + '- Falta ingresar número documento.<br/>';
				$('[name="folio"]').addClass('invalid');
			}
			if (dtc.data.contacto.id == 0) {
				msgError = msgError + '- Falta seleccionar un proveedor.<br/>';
				$('[name="contacto[info][alias]"]').addClass('invalid');
			}

			/*if (dtc.data.montos.sub_total > monto_maximo_rendir && tipo_gasto_asociado == "OC") {
				msgError = msgError + '- El monto ingresado excede el saldo por justificar de la Orden de compra.<br/>';
				$('[name="sub_total"]').addClass('invalid');
			}*/

			if (msgError == "") {
				return true;
			} else {
				toastr.error(msgError);
				return false;
			}
		},
		duplicate: function () {
			var status;
			$.ajax({
				'url': '/4DACTION/_V3_valida_folio_dtc',
				data: {
					"dtc[valida][id]": dtc.id,
					"dtc[valida][tipo_doc]": dtc.data.id_tipo_doc,
					"dtc[valida][folio]": dtc.data.folio,
					"dtc[valida][id_prov]": dtc.data.contacto.id
				},
				async: false,
				dataType: 'json',
				success: function (data) {
					status = data;
				}
			});
			return status;
		}
	},
	addExistOcs: function () {
		unaBase.loadInto.dialog('/v3/views/dtc/dialog/ocs_disponibles.shtml?id=' + dtc.id, 'SELECCIONAR ÓRDENES DE COMPRA', 'x-large');
	},
	downloadXML: function () {

		let id = $('#sheet-dtc').data('id')
		const downloadXML = (url) => {
			var xhr = new XMLHttpRequest();
			xhr.open('GET', url, true);
			xhr.responseType = 'blob';

			xhr.onload = function () {
				if (this.status === 200) {
					var blob = new Blob([this.response], { type: 'application/xml' });
					var link = document.createElement('a');
					link.href = window.URL.createObjectURL(blob);
					link.download = `DTC-${id}|XML.xml`;

					document.body.appendChild(link);
					link.click();

					document.body.removeChild(link);
				}
			};

			xhr.send();
		}

		// Uso:
		let url = window.location.origin + `/4DACTION/_V3_getUpload?index=DTC_XML|${id}`
		downloadXML(url);

	},
	uploadFileDTC: function (type) {
		if (type == 'xml') {
			document.querySelector('input[name="resumen[dtc][attachment_xml]"]').click()
		}

		if (type == 'file') {
			document.querySelector('input[name="resumen[dtc][attachment]"]').click()
		}
	},
	verAdjunto: function () {
		const url = "/4DACTION/_V3_getUpload?index=Doc_Tributario_Compra|" + dtc.data.id
		unaBase.loadInto.dialog(url, 'Archivo adjunto', 'large', true);
	}
}
