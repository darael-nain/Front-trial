var compras = {
	init: function () {
		
		compras.container = $('#sheet-compras');
		compras.id = compras.container.data('id');
		compras.folio = compras.container.data('folio');
		compras.validado = compras.container.data('validado');
		compras.tipoGasto = compras.container.find('input[name="oc[tipo_gastos][id]"]').val();
		compras.porJustificar = compras.container.find('input[name="oc[total_por_justificar]"]').val();
		compras.estado = compras.container.data('estado');
		compras.referencia = compras.container.find('input[name="oc[referencia]"]').val();
		compras.oc_tipo_moneda = "PESOS";
		compras.id_nv_negocio = 0;
		compras.folio_negocio = "";
		compras.mostrar_pdf_negocio = false;
		compras.total_ajuste = 0;
		compras.total_ajuste_impuesto = 0;
		compras.total_oc = 0;
		compras.total_netos_oc = 0;
		compras.origen = origenOc;
		compras.aplica_detraccion = false;
		compras.total_detraccion = 0;
		compras.porcentaje_servicio = 0;
		compras.adicional_servicio = 0;
		compras.reload = false,
		compras.cierreInfo = {
			estado: compras.container.data("cierreadmin"),
			estado_produccion: compras.container.data("cierreproduccion")
		},
		compras.moneda = {
			code: exchange_code,
			cambio: exchange_value,
			decimals: view_decimals || 0
		}

		compras.getDetalleAsientos()

		if(compras.tipoGasto ==  'FTG'){
			compras.container.find("#scrolldtv").on("click", "input.selectedall", function(){
				compras.selected("dtv");
			});
		}

	},
	get: function () {
		/*$.ajax({
			'url':'/4DACTION/xxxxx',
			data:{
			  "oc[id]" : compras.id
			},
			dataType:'json',
			success:function(data){
				compras.data = data;
			}
			});*/
	},
	get_data: function (id) {
		$.ajax({
			'url': '/4DACTION/_force_getGastos',
			data: {
				"id_oc": id
			},
			dataType: 'json',
			async: false,
			success: function (data) {
				compras.data = data.rows[0]
			}
		});
	},
	loadData: [],
	getPendingDtcs: function () {
		unaBase.loadInto.dialog('/v3/views/compras/dialog/dtc_pending.shtml?id=' + compras.id, 'SELECCIONAR DOCUMENTOS DE COMPRA', 'x-large');

	},
	exportListDtc: function () {

		var sid = "";
		$.each($.cookie(), function (clave, valor) {
			if (clave == hash && valor.match(/UNABASE/g)) sid = valor;
		});

		var url =
			nodeUrl +
			"/export-list-dtc-gastos/?download=true&entity=compras&id=" +
			compras.id +
			"&sid=" +
			unaBase.sid.encoded() +
			"&preview=false&nullified=" +
			$("section.sheet").data("readonly") +
			"&hostname=" +
			window.location.origin;

		unaBase.log.save(
			"Ha exportado el listado de dtc del gasto" + compras.folio,
			"compras",
			$("#main-container").data("index")
		);
		var download = window.open(url).blur();
		window.focus();
		try {
			download.close();
		} catch (err) {
			console.log(err);
		}
	},
	addDtc: function () {
		compras.validado = compras.container.data('validado');
		if (compras.validado || unaBase.parametros.add_dtc_compras_no_validas) {
			if ((compras.porjustificar > 0 && compras.tipoGasto == 'OC') || (compras.tipoGasto == 'FXR') || (compras.tipoGasto == 'FTG')) {

				var selectedItem;
				var objItemSelected = {};
				selectedItem = compras.container.find('table.itemsoc > tbody > tr > td input[name="oc[detalle_item][select]"]:checked');

				/*if (selectedItem.length == 0)   
				  selectedItem = compras.container.find('table.itemsoc > tbody > tr > td > input[type="checkbox"]');*/

				// set valores items seleccionados
				var llaveTituloPrev = "";
				selectedItem.each(function (key, item) {
					var tr = $(this).parentTo('tr');
					var llaveTitulo = tr.find('input[name="oc[detalle_item][llave_titulo]"]').val();
					var llave = $(this).parentTo('tr').find('input[name="oc[detalle_item][llave]"]').val();
					if (llaveTitulo != llaveTituloPrev) {
						eval("obj = { 'detalle_oc_llave_titulo_" + key + "': '" + llaveTitulo + "' }");
						$.extend(objItemSelected, objItemSelected, obj);
						llaveTituloPrev = llaveTitulo;
					}
					eval("obj = { 'detalle_oc_llave_items_" + key + "': '" + llave + "' }");
					$.extend(objItemSelected, objItemSelected, obj);
				});

				// setea valores ocdt
				var objOcdt = {};
				eval("obj = { 'id_gasto_" + compras.id + "': '" + compras.id + "' }");
				$.extend(objOcdt, objOcdt, obj);
				eval("obj = { 'cantidad_items_seleccionados': '" + selectedItem.length + "' }");
				$.extend(objOcdt, objOcdt, obj);
				var objFinal = $.extend({}, objOcdt, objItemSelected);

				$.ajax({
					url: '/4DACTION/_V3_setDtc',
					dataType: 'json',
					type: 'POST',
					data: objFinal
				}).done(function (data) {
					unaBase.loadInto.viewport('/v3/views/dtc/content.shtml?id=' + data.id);
				});

			} else {
				toastr.warning('La compra ya se encuentra justificada en su totalidad.');
			}
		} else {
			toastr.warning('El gasto aún no se encuentra validado.');
			$('#viewport').scrollTo($("#scrollval"), 800);
		}
	},
	addFromXml: function () {

	},
	addDtc2: function () {
		unaBase.loadInto.viewport('/v3/views/dtc/content2.shtml?id=17521');
	},
	addExistDtc: function () {
		unaBase.loadInto.dialog('/v3/views/compras/dialog/dtc_disponibles.shtml?id=' + compras.id, 'SELECCIONAR DOCUMENTOS DE COMPRA', 'x-large');
	},
	addExistDtv: function () {
		unaBase.loadInto.dialog('/v3/views/compras/dialog/dtv_disponibles.shtml?id=' + compras.id, 'SELECCIONAR FACTURAS DE VENTA', 'x-large');
	},
	moveItems: function () {
		var selectedItem = compras.container.find('table.itemsoc > tbody > tr > td > input[type="checkbox"]:checked').length;
		if (selectedItem > 0) {
			// unaBase.loadInto.dialog('/v3/views/compras/move_items.shtml?id='+ compras.id +'&from=oc', 'SELECCIONAR NEGOCIO DE DESTINO', 'large');
		} else {
			toastr.warning('Falta seleccionar ítems.');
		}
	},
	closeAdmin: function (docType) { // fxr

		// valida que saldo fxr sea cero para poder hacer cierre administrativo
		if (compras.saldo == 0) {
			confirm("¿Confirma cierre administrativo?").done(function (data) {
				if (data) {
					var htmlObject = $('<section> \
						<span>Ingrese comentario de cierre</span> \
						<textarea name="response" required placeholder="Comentario requerido..."></textarea> \
					</section>');
					htmlObject.find('textarea').on('blur change', function () {
						htmlObject.data('response', $(this).val());
					});
					prompt(htmlObject).done(function (data) {
						var promptData = data;
						if (promptData !== false) {
							let closeType = `close_admin_${docType}`;
							let data = {
								'oc[id]': compras.id,
								'oc[close_admin][comment]': promptData
							}
							data[closeType] = true;
							$.ajax({
								url: '/4DACTION/_V3_setCompras',
								type: 'POST',
								dataType: 'json',
								data,
								async: false
							}).done(function (data) {
								if (data.success) {
									toastr.success(NOTIFY.get('SUCCESS_SAVE_GASTO_OC'));
									setTimeout(function () {
										unaBase.inbox.send({
											subject: 'Ha cerrado la rendición de fondos Nº ' + compras.folio + ' / ' + compras.referencia,
											into: 'viewport',
											href: '/v3/views/compras/content.shtml?id=' + compras.id,
											tag: 'avisos',
											attach: true,
											index: compras.folio,
											id: compras.id
										});
									}, 2000);
									unaBase.loadInto.viewport('/v3/views/compras/content.shtml?id=' + compras.id, undefined, undefined, true);
								} else
									toastr.error(NOTIFY.get('ERROR_RECORD_READONLY'));
							});
						}
					});
				}
			});
		} else {
			if (compras.saldo > 0) {
				if (compras.pagado > 0) {
					alert("No es posible realizar el cierre administrativo.<br><strong>- La rendición cuenta con saldo pendiente por devolver.</strong>");
				} else {
					alert("No es posible realizar el cierre administrativo.<br><strong>- La rendición cuenta con saldo pendiente por justificar.</strong>");
				}
			} else {
				if (compras.saldo < 0) {
					alert("No es posible realizar el cierre administrativo.<br><strong>- La rendición cuenta con saldo pendiente por pagar.</strong>");
				} else {
					alert("No es posible realizar el cierre administrativo.<br><strong>- La rendición cuenta con saldo pendiente.</strong>");
				}
			}
		}

	},
	closeProduction: function (docType) { // fxr

		// valida que saldo fxr sea cero para poder hacer cierre administrativo
		confirm("¿Confirma cierre de produccion?").done(function (data) {
			if (data) {
				var htmlObject = $('<section> \
						<span>Ingrese comentario de cierre</span> \
						<textarea name="response" required placeholder="Comentario requerido..."></textarea> \
					</section>');
				htmlObject.find('textarea').on('blur change', function () {
					htmlObject.data('response', $(this).val());
				});
				prompt(htmlObject).done(function (data) {
					unaBase.ui.block();
					var promptData = data;
					if (promptData !== false) {
						let closeProductionType = `close_production_${docType}`;
						let data = {
							'oc[id]': compras.id,
							'oc[close_admin][comment]': promptData
						}
						data[closeProductionType] = true;
						$.ajax({
							url: '/4DACTION/_V3_setCompras',
							type: 'POST',
							dataType: 'json',
							data,
							async: false
						}).done(function (data) {
							if (data.success) {
								toastr.success(NOTIFY.get('SUCCESS_SAVE_GASTO_OC'));
								unaBase.ui.unblock();
								setTimeout(function () {
									unaBase.inbox.send({
										subject: 'Ha cerrado el proceso produccion de la rendición de fondos Nº ' + compras.folio + ' / ' + compras.referencia,
										into: 'viewport',
										href: '/v3/views/compras/content.shtml?id=' + compras.id,
										tag: 'avisos',
										attach: true,
										index: compras.folio,
										id: compras.id
									});
								}, 2000);
								unaBase.loadInto.viewport('/v3/views/compras/content.shtml?id=' + compras.id, undefined, undefined, true);
							} else
								toastr.error(NOTIFY.get('ERROR_RECORD_READONLY'));
						});
					}
				});
			}
		});


	},
	openProduction: function (docType) { // fxr

		// valida que saldo fxr sea cero para poder hacer cierre administrativo
		confirm("¿Confirma abrir proceso produccion?").done(function (data) {
			if (data) {
				unaBase.ui.block();

				let closeProductionType = `open_production_${docType}`;
				let data = {
					'oc[id]': compras.id,
				}
				data[closeProductionType] = true;
				$.ajax({
					url: '/4DACTION/_V3_setCompras',
					type: 'POST',
					dataType: 'json',
					data,
					async: false
				}).done(function (data) {
					if (data.success) {
						toastr.success(NOTIFY.get('SUCCESS_SAVE_GASTO_OC'));
						unaBase.ui.unblock();
						setTimeout(function () {
							unaBase.inbox.send({
								subject: 'Ha abierto el proceso produccion de la rendición de fondos Nº ' + compras.folio + ' / ' + compras.referencia,
								into: 'viewport',
								href: '/v3/views/compras/content.shtml?id=' + compras.id,
								tag: 'avisos',
								attach: true,
								index: compras.folio,
								id: compras.id
							});
						}, 2000);
						unaBase.loadInto.viewport('/v3/views/compras/content.shtml?id=' + compras.id, undefined, undefined, true);
					} else
						toastr.error(NOTIFY.get('ERROR_RECORD_READONLY'));
				});


			}
		});


	},
	openAdmin: function (docType) { // fxr


		confirm(MSG.get('CONFIRM_FXR_OPEN')).done(function (data) {
			if (data) {
				let closeType = `close_admin_${docType}`;
				let data = {
					'oc[id]': compras.id
				}
				data[closeType] = false;
				$.ajax({
					url: '/4DACTION/_V3_setCompras',
					type: 'POST',
					dataType: 'json',
					data,
					async: false
				}).done(function (data) {
					if (data.success) {
						toastr.success(NOTIFY.get('SUCCESS_SAVE_GASTO_OC'));
						setTimeout(function () {
							// 
							unaBase.inbox.send({
								subject: 'Ha abierto la rendición de fondos Nº ' + compras.folio + ' / ' + compras.referencia,
								into: 'viewport',
								href: '/v3/views/compras/content.shtml?id=' + compras.id,
								tag: 'avisos',
								attach: true,
								index: compras.folio,
								id: compras.id
							});
						}, 2000);
						unaBase.loadInto.viewport('/v3/views/compras/content.shtml?id=' + compras.id, undefined, undefined, true);
					} else
						toastr.error(NOTIFY.get('ERROR_RECORD_READONLY'));
				});
			}

		});
	},
	saveLogsFromWeb: function (data) {
		$.ajax({
			url: '/4DACTION/_V3_setLogsFromWeb',
			type: 'POST',
			dataType: 'json',
			data: data,
			async: false
		}).done(function (data) {
			if (!data.success) {
				toastr.error(NOTIFY.get('ERROR_RECORD_READONLY'));
			}
		});
	},
	setSolicitaPago: function () {
		$.ajax({
			url: '/4DACTION/_V3_setCompras',
			type: 'POST',
			dataType: 'json',
			data: {
				'oc[id]': compras.id,
				'oc_solicitud_pago': true
			},
		}).done(function (data) {
			if (!data.success) {
				toastr.error("Error al solicitar!");
			}
		});
	},
	selected: function (tipo) {
		if (tipo == "dtv") {
			var inputAll = compras.container.find("#scrolldtv input.selectedall");
			if (inputAll.prop("checked")) {
				compras.container.find('#scrolldtv table tbody input[name="selected_one"]').prop("checked", true);
			} else {
				compras.container.find('#scrolldtv table tbody input[name="selected_one"]').prop("checked", false);
			}
		}
	},
	setReadOnly: state => {
		console.log("setReadOnly------->")
		let section = $("section#sheet-compras");
		let fechaEmision = document.querySelector('input[name="oc[fecha_emision]"]');
		if (state) {
			if (accountingMode == false && access._554 == false) {
				//section.find("input input:not(.multiple)").prop("readonly", true);
				section.find("input").prop("readonly", true);
				section.find("button.detail.item").hide();
				section.find("button.profile.item").hide();
				section.find("#main-container button:not(.expand,.approve,.dtc,.egresos,.u-display)").prop("disabled", true);
				section.find(`li[data-name="save"] button:not(.expand,.approve)`).prop("disabled", true);
				section.find(`input[type="checkbox"]`).prop("disabled", true);
				section.find(`input[type="text"]`).prop("disabled", true);
				section.find(`input[type="search"].datepicker`).prop("disabled", true);
				section.find(`select`).prop("disabled", true);


				if (access._662) {
					section.find(`input[name="oc[fecha_emision]"]`).prop("readonly", false);
					if (fechaEmision.hasAttribute("type"))
						fechaEmision.removeAttribute("type");
					fechaEmision.setAttribute("type", "search");

					$('input[name="oc[fecha_emision]"]').prop("disabled", false);
				} else {
					section.find(`input[name="oc[fecha_emision]"]`).prop("readonly", true);
					if (fechaEmision) {
						if (fechaEmision.hasAttribute("type"))
							fechaEmision.removeAttribute("type");
						fechaEmision.setAttribute("type", "text");

						$('input[name="oc[fecha_emision]"]').prop("disabled", true);

					}


				}
			}
		} else {

			section.find("button.detail.item").show();
			section.find("button.profile.item").show();
			section.find("input.multiple.0").prop("readonly", false);
			section.find("#main-container button:not(.expand,.approve,.dtc,.egresos,.u-display)").prop("disabled", false);
			section.find(`li[data-name="save"] button:not(.expand,.approve)`).prop("disabled", false);
			section.find(`input[type="checkbox"]`).prop("disabled", false);
			//section.find(`input[type="text"]`).prop("disabled", false);
			section.find(`input[type="search"].datepicker`).prop("disabled", false);
			section.find(`select`).prop("disabled", false);

			// if (compras.newAccountingSystem) {

			// 	section.find(".nas").prop("readonly", true);
			// 	section.find(".nas").prop("disabled", true);
			// 	section.find("button.nas").hide();

			// }else{
			// 	section.find("input").prop("readonly", false);
			// }



			if (access._662) {
				section.find(`input[name="oc[fecha_emision]"]`).prop("readonly", false);
				if (fechaEmision.hasAttribute("type"))
					fechaEmision.removeAttribute("type");
				fechaEmision.setAttribute("type", "search");

				$('input[name="oc[fecha_emision]"]').prop("disabled", false);
			} else {
				section.find(`input[name="oc[fecha_emision]"]`).prop("readonly", true);
				if (fechaEmision.hasAttribute("type"))
					fechaEmision.removeAttribute("type");
				fechaEmision.setAttribute("type", "text");

				$('input[name="oc[fecha_emision]"]').prop("disabled", true);



			}
		}
	},
	checkReadOnly: () => {
		if (!compras.validado) {
			compras.setReadOnly(false);
		} else {
			console.warn("-------------------------------****");
			console.warn("NO TIENE Validación en curso");

			if (access._450 && compras.validado && compras.estado != 'CERRADA') {
				console.warn("TIENE permiso para modificar validada");
				if (!cierreContable) {
					compras.setReadOnly(false); // false == abierto
				}

			} else if (compras.validado && compras.estado != 'CERRADA') {
				compras.setReadOnly(true);
				console.warn("NO TIENE permiso para modificar validada");
			} else if (compras.validado && compras.estado == 'CERRADA') {
				compras.setReadOnly(true);
				console.warn("NO TIENE permiso para modificar validada");
			} else {
				console.warn("NO TIENE permiso para modificar validada y no esta validada");
				if (!cierreContable) {
					compras.setReadOnly(false); // false == abierto
				}
			}
		}
	},
	duplicate: function () {
		// by gin, 4-8-19

		let duplicateYes = function (neg = 0, ser = "") {
			$.ajax({
				url: '/4DACTION/_V3_duplicateGastos',
				type: 'POST',
				dataType: 'json',
				data: {
					idCopy: compras.id,
					idnv: neg,
					llavenv: ser
				},
			}).done(function (data) {
				if (!data.success) {
					toastr.error("Error al duplicar, intente nuevamente.");
				} else {
					unaBase.loadInto.viewport("/v3/views/compras/content.shtml?id=" + data.id, undefined, undefined, true);
				}
			});
		}

		$.ajax({
			url: '/4DACTION/_V3_checkNegCerradoGastos',
			type: 'POST',
			dataType: 'json',
			data: {
				'id': compras.id
			},
		}).done(function (data) {
			if (!data.cerrado) {
				duplicateYes();
			} else {

				let html = $(
					'<section>\
					<h5>El negocio '+ data.negocio + ', se encuentra cerrado para compras.<br><br><div style="font-weight:bold;">Debes seleccionar otro negocio y servicio para asociar el gasto.</div></h5>\
					<div style="margin-top:5px;">\
						<label>Negocio:</label>\
						<button style="width:30px;height:25px;" class="show negocios ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only" role="button" aria-disabled="false" title="Ver negocios"><span class="ui-button-icon-primary ui-icon ui-icon-carat-1-s"></span><span class="ui-button-text">Ver negocios</span></button>\
						<input style="width:200px;" readonly name="duplicate-id-nv" type="search" data-id="0" value="">\
					</div>\
					<div>\
						<label>Servicio:</label>\
						<select style="border:1px solid lightgray;width:150px;" name="duplicate-llave">\
							<option selected value=""></option>\
						</select>\
					</div>\
				</section>');

				html.find('input[name="duplicate-id-nv"]').autocomplete({
					source: function (request, response) {
						$.ajax({
							url: '/4DACTION/_V3_get_proyectos_compras',
							dataType: 'json',
							data: {
								q: request.term
							},
							success: function (data) {
								response($.map(data.rows, function (item) {
									return item;
								}));
							}
						});
					},
					minLength: 0,
					delay: 5,
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
						$(this).val('[' + ui.item.nro + '] ' + ui.item.referencia);
						$(this).data('id', ui.item.id_nv);
						unaBase.ui.block();
						$.ajax({
							url: '/4DACTION/_V3_proxy_get_ItemsProyCompras',
							data: {
								'oc[negocio][id]': ui.item.id_nv,
								'from': 'oc',
								'title': '@'
							},
							dataType: 'json',
							success: function (data) {
								$('select[name="duplicate-llave"]').find('option').remove();
								$('select[name="duplicate-llave"]').val('');
								for (var i = 0, len = data.rows.length; i < len; i++) {
									var current = data.rows[i];
									var option = $('<option value=' + current.id + '>' + (current.codigo ? '[' + current.codigo + '] ' : '') + current.nombre + '</option>')
									$('select[name="duplicate-llave"]').append(option);
								}
								unaBase.ui.unblock();
							}
						});
						return false;
					}

				}).data('ui-autocomplete')._renderItem = function (ul, item) {
					return $(`<li ${item.isBudget ? 'style="background-color: #e0e0e0;"' : ''} ><a><strong class="highlight">Nº ${item.nro}</strong><em>${item.referencia}</em><span>${item.cliente}</span></a></li>`).appendTo(ul);
				};

				html.find('button.show.negocios').click(function () {
					$('input[name="duplicate-id-nv"]').autocomplete('search', '@').focus();
				});

				prompt(html, "Aceptar", "Cancelar").done(function (data) {
					if (data !== false) {
						let neg = $('input[name="duplicate-id-nv"]').data('id');
						let llave = $('select[name="duplicate-llave"]').val();
						if (parseFloat(neg) > 0 && llave != "") {
							duplicateYes(neg, llave);
						} else {
							toastr.error("Falta seleccionar negocio y servicio.");
						}
					}
				});
			}
		});

	},
	changesMoneda: function () {

		// var selectedMoneyCode = document.querySelector('select[name="oc[moneda][tipo]"]').value;
		// var selectedMoneyRate = document.querySelector('input[name="oc[moneda][valor_cambio]"]').value;
		// compras.moneda.code = selectedMoneyCode;
		// compras.moneda.cambio = parseFloat(selectedMoneyRate.replaceAll(".", "").replaceAll(",", "."));

		var selectedMoneyCode = document.querySelector('select[name="oc[moneda][tipo]"]')
		
		//let sel_rate = selectedMoneyCode.options[selectedMoneyCode.selectedIndex].dataset.rate
		let sel_rate = document.querySelector('input[name="oc[moneda][valor_cambio]"]').value
		compras.moneda.cambio = parseFloat(sel_rate.replaceAll(".", "").replaceAll(",", "."));
		compras.moneda.code = selectedMoneyCode.options[selectedMoneyCode.selectedIndex].value

		document.querySelector('input[name="oc[moneda][valor_cambio]"]').value = unaBase.utilities.transformNumber(compras.moneda.cambio, 'int')
		
		if (compras.moneda.code != currency.code && compras.origen != "PROYECTO") {
			$('.section-moneda-valor-cambio').show();
		} else {
			$('.section-moneda-valor-cambio').hide();
		}


		if (compras.folio != "") {
			$.ajax({
				url: '/4DACTION/_V3_setCompras',
				type: 'POST',
				dataType: 'json',
				data: {
					"oc[id]": compras.id,
					"oc[moneda][tipo]": compras.moneda.code,
					"oc[moneda][valor_cambio]": sel_rate
				},
				async: false
			}).done(function (data) {
				if (data.success) {

					toastr.success(NOTIFY.get('SUCCESS_SAVE_GASTO_OC'));
					unaBase.loadInto.viewport('/v3/views/compras/content.shtml?id=' + compras.id, undefined, undefined, true);
					compras.moneda.code = data.money

					document.querySelector('select[name="oc[moneda][tipo]"]').value = compras.moneda.code


					sel_rate
				} else
					toastr.error(NOTIFY.get('ERROR_RECORD_READONLY'));
			});
		} else {
			get_totales_gastos();
		}
	},
	justificarMasivo: function () {
		unaBase.loadInto.dialog('/v3/views/compras/dialog/justificar_masivo.shtml?id=' + compras.id, 'ITEMS POR JUSTIFICAR', 'x-large');
	},
	checkFechasPago: function (id) {

		

		const setUnlock = (date1, date2, date3, clear) => {
			if (date1) {
				document.getElementsByName('oc[fecha_vcto]')[0].disabled = false;
				document.getElementsByName('oc[fecha_vcto]')[0].readOnly = false
			}

			if (date2) {
				document.getElementsByName('oc[fecha_vcto2]')[0].disabled = false;
				document.getElementsByName('oc[fecha_vcto2]')[0].readOnly = false
			}

			if (date3) {
				document.getElementsByName('oc[fecha_vcto3]')[0].disabled = false;
				document.getElementsByName('oc[fecha_vcto3]')[0].readOnly = false
			}

			if (clear) {
				document.getElementsByName('oc[fecha_vcto]')[0].value = ''
				document.getElementsByName('oc[fecha_vcto2]')[0].value = ''
				document.getElementsByName('oc[fecha_vcto3]')[0].value = ''

				document.getElementById('percentDateOne').innerHTML = ''
				document.getElementById('percentDateTwo').innerHTML = ''
				document.getElementById('percentDateThree').innerHTML = ''
			}
		}

		const setPercent = (percent, type) => {
			if (percent > 0) {
				document.getElementById('percentDate' + type).innerHTML = percent + '% del total'
			}
		}

		const formatToDateInput = (fecha) => {
			const partes = fecha.split('-');
			const dia = partes[0];
			const mes = partes[1];
			const año = partes[2];
			return `${año}-${mes}-${dia}`;
		}

		$.ajax({
			url: '/4DACTION/_force_getProyeccionPago',
			dataType: 'json',
			data: {
				id_forma_pago: id
			},
			async: false,
			cache: false,
			success: function (data) {
				let cont = 1
				let currentDateEmision = document.getElementsByName('oc[fecha_emision]')[0].value
				
				//const fecha = calcula_fecha_vcto_pago_oc(ui.item.id);
				if (data.records.total > 0) {
					
					data.rows.sort((a, b) => a.porcentaje - b.porcentaje);

					data.rows.forEach(val => {
						const date = compras.addDayToDate(currentDateEmision, val.dia)

						if (val.dia < 0) {
							switch (cont) {
								case 1: {
									setUnlock(true, false, false, true)
									setPercent(val.porcentaje, 'One')
									$('input[name="oc[fecha_vcto]"]').val(date);
									document.getElementById('fecha_vcto').value = formatToDateInput(date)
									break;
								}
								case 2: {
									setPercent(val.porcentaje, 'Two')
									setUnlock(false, true, false, false)
									break;
								}

								case 3: {
									setPercent(val.porcentaje, 'Three')
									setUnlock(false, false, true, false)
									break;
								}
							}
						} else if (val.dia == 0) {
							switch (cont) {
								case 1: {
									setUnlock(false, false, false, true)
									setPercent(val.porcentaje, 'One')
									$('input[name="oc[fecha_vcto]"]').val(date)
									document.getElementById('fecha_vcto').value = formatToDateInput(date)
									break;
								}
								case 2: {
									setPercent(val.porcentaje, 'Two')
									setUnlock(false, true, false, false)
									$('input[name="oc[fecha_vcto2]"]').val(date)
									document.getElementById('fecha_vcto2').value = formatToDateInput(date)
									break;
								}

								case 3: {
									setPercent(val.porcentaje, 'Three')
									setUnlock(false, false, true, false)
									$('input[name="oc[fecha_vcto3]"]').val(date)
									document.getElementById('fecha_vcto3').value = formatToDateInput(date)
									break;
								}
							}
						} else if (val.dia > 0 && date !== currentDateEmision) {
							switch (cont) {
								case 1: {
									setUnlock(false, false, false, true)
									setPercent(val.porcentaje, 'One')
									$('input[name="oc[fecha_vcto]"]').val(date);
									document.getElementById('fecha_vcto').value = formatToDateInput(date)
									break;
								}

								case 2: {
									setPercent(val.porcentaje, 'Two')
									$('input[name="oc[fecha_vcto2]"]').val(date);
									document.getElementById('percentDateThree').innerHTML = ''
									document.getElementById('fecha_vcto2').value = formatToDateInput(date)
									break;
								}

								case 3: {
									setPercent(val.porcentaje, 'Three')
									$('input[name="oc[fecha_vcto3]"]').val(date);
									document.getElementById('fecha_vcto3').value = formatToDateInput(date)
									break;
								}
							}
						}

						cont++;
					})

				} else {
					document.getElementById('fecha_vcto').value = '00-00-00'
					document.getElementById('fecha_vcto2').value = '00-00-00'
					document.getElementById('fecha_vcto3').value = '00-00-00'

					document.getElementById('percentDateOne').innerHTML = ''
					document.getElementById('percentDateTwo').innerHTML = ''
					document.getElementById('percentDateThree').innerHTML = ''
				}

			}
		});

	},

	addDayToDate: (date, days) => {
		const dateParts = date.split('-');
		const formattedDate = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
		formattedDate.setDate(formattedDate.getDate() + parseInt(days));

		const day = formattedDate.getDate().toString().padStart(2, '0');
		const month = (formattedDate.getMonth() + 1).toString().padStart(2, '0');
		const year = formattedDate.getFullYear();

		return `${day}-${month}-${year}`;
	},

	getMoney: () => {
		$.ajax({
			url: '/4DACTION/_V3_getCurrency',
			async: false,
			dataType: 'json',
			success: function (data) {
				if (document.querySelector('select[name="oc[moneda][tipo]"]') != null) {

					let sec_exchange = document.querySelector('select[name="oc[moneda][tipo]"]')
					let tipo_money = document.getElementById('money_base').dataset.money
					sec_exchange.innerHTML = ""
					data.rows.map(e => {

						let node = document.createElement("option");
						node.value = e.id
						node.dataset.rate = e.value == "0" ? "1" : e.value
						node.textContent = e.text
						sec_exchange.appendChild(node);
						node.selected = unaBase.doc.currencyCodePrint == e.id ? true : false


					});

					sec_exchange.addEventListener("change", () => compras.changesMoneda());
					document.querySelector('select[name="oc[moneda][tipo]"]').value = tipo_money
				}

			}
		});

	},
	sendToPortalProveedores: async () => {
		const id = $('#sheet-compras').data('id')
		if (unaBase.parametros.portal_proveedores) {
			let config = {
				method: 'POST',
				url: `${nodeUrl}/send-oc-to-portalmx`,
				data: {
					sid: unaBase.sid.encoded(),
					id_oc: id,
					hostname: window.origin
				}

			};

			try {
				let res = await axios(config);
				
				if (res.data.success) {
					toastr.success('Se envio correctamente la OC hacia portal de proveedores');
				} else {
					toastr.warning('Error al enviar OC hacia portal de proveedores.');
				}
			} catch (err) {
				throw err;
			}
		}
	},
	updateOcPortalProveedores: async () => {
		const id = $('#sheet-compras').data('id')
		if (unaBase.parametros.portal_proveedores) {
			let config = {
				method: 'POST',
				url: `${nodeUrl}/update-oc-to-portalmx`,
				data: {
					sid: unaBase.sid.encoded(),
					id_oc: id,
					hostname: window.origin
				}

			};

			try {
				let res = await axios(config);
				
				if (res.data.success) {
					toastr.success('Se actualizo correctamente la OC del portal de proveedores');
				} else {
					toastr.warning('Error al actualizar OC desde portal de proveedores.');
				}
			} catch (err) {
				throw err;
			}
		}
	},
	getDetalleAsientos: async () => {
		const container = document.querySelector("table#detail tbody");
		if (container) {
			container.innerHTML = '';
		}
		
		if(compras.tipoGasto != 'OC'){
			setComprobanteDetalle(compras.id, "OP", compras.tipoGasto);
			setComprobanteDetalle(compras.id,"DTC", compras.tipoGasto);
			setComprobanteDetalle(compras.id, "CB", compras.tipoGasto);
			setComprobanteDetalle(compras.id, "DTV", compras.tipoGasto);
			
			html = $(`<tr class="totals" >
						<td colspan="5">Total:</td>                                     
						<td><input disabled value="" class="debe" type="text" /></td>                                     
						<td><input disabled value="" class="haber" type="text" /></td>  
						<td colspan=2><input disabled value="" class="total" type="text" /></td>                                                               
					</tr>`);
			$(container).append(html);
			calculateTotals();
		}	
	}

}

const calculateTotals = () => {
	const debeValues = document.querySelectorAll('input[name="debe"]');
	const haberValues = document.querySelectorAll('input[name="haber"]');

	if (debeValues.length > 0 && haberValues.length > 0) {

		let debe = 0;
		let haber = 0;

		// let re = reFromCurrency(currency);
		for (const item of debeValues) {
			// debe += parseFloat(item.value.replace(reThousand,"").replace(reDecimal, ".")) || 0;
			debe += parseStrToInt(item.value, currency) || 0;
		}
		for (const item of haberValues) {
			// haber += parseFloat(item.value.replace(reThousand,"").replace(reDecimal, ".")) || 0;
			haber += parseStrToInt(item.value, currency) || 0;
		}
		// for (const item of debeValues) {
		//   debe += parseFloat(item.value) || 0;
		// }
		// for (const item of haberValues) {
		//   haber += parseFloat(item.value) || 0;
		// }
		const debeInput = document.querySelector("tr.totals input.debe");
		const haberInput = document.querySelector("tr.totals input.haber");
		const totalInput = document.querySelector("tr.totals input.total");

		debeInput.value = debe;
		haberInput.value = haber;
		totalInput.value = Math.abs(debe - haber);
		if (Math.abs(debe - haber) !== 0) totalInput.classList.add("redBold");
		else totalInput.classList.remove("redBold");
		if (debe > haber) {
			haberInput.classList.add("redBold");
			debeInput.classList.remove("redBold");
		} else if (debe < haber) {
			haberInput.classList.remove("redBold");
			debeInput.classList.add("redBold");
		} else {
			haberInput.classList.remove("redBold");
			debeInput.classList.remove("redBold");
		}

		$(".debe").number(true, currency.decimals, currency.decimals_sep, currency.thousands_sep);
		$(".haber").number(true, currency.decimals, currency.decimals_sep, currency.thousands_sep);
		$(".total").number(true, currency.decimals, currency.decimals_sep, currency.thousands_sep);
	}

}
const setComprobanteDetalle = (idCompras, from, type) => {
	$.ajax({
		url: "/4DACTION/_force_get_comprobantes_fxr",
		data: {
			idCompras,
			from,
			type
		},
		dataType: "json",
		async: false,
		success: function (data) {
			let html = "";
			let innerLine = "";
			const container = document.querySelector("table#detail tbody");
			for (let element of data.details) {
				if (element.cuentaContable != 'none') {
					innerLine = `
						<td>${element.aIdComp}</td>
						<td>${element.aTypeComp}</td>
						<td>${element.folioDoc}</td>
						<td><input readonly name="codigoCuenta" value="${element.codigoCuenta}" type="text" /></td>
						<td><input readonly name="cuentaContable" value="${element.cuentaContable}" type="text" /></td>
						   <td class=""><input class="format-all" readonly name="debe" value="${unaBase.utilities.transformNumber(element.debe, 'int')}"  type="text" /></td>
						<td class=""><input class="format-all" readonly name="haber" value="${unaBase.utilities.transformNumber(element.haber, 'int')}" type="text" /></td>
						<td class=""></td>`


					html = $(`<tr data-id="${element.aIdComp}" class="bg-white" title="detalle-comprobantes">
									  ${innerLine}
								  </tr>`);


					html.click(function () {
						unaBase.loadInto.viewport('/v3/views/comprobantes/content.shtml?id=' + element.aIdComp);

					});
					innerLine = "";

					$(container).append(html);
					let line = $(html).find('a');
					if (line.length > 0) {
						if (line[0].dataset.dialog === "true") {
							line[0].href = "#";
							line[0].addEventListener("click", function (event) {
								event.preventDefault()
								unaBase.loadInto.dialog('/v3/views/ingresos/dialog/ingreso.shtml?id=' + data.id, 'Ingreso', 'large');
							})
						}
					}

				}
			}


		}
	});



}

(function init() {


	$('input[name="oc[fecha_emision]"]').datepicker({
		onSelect: function (dateText) {
			let idpago = $('input[name="forma_pago[id]"]')[0].value
			compras.checkFechasPago(idpago)
		}
	}).on("change", function () {
		alert('change')
	});

	compras.getMoney()
})();













