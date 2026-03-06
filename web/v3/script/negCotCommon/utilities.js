





//-----------------------   Variables   --------------------------
//----------------------------------------------------------------


var utilities = {};

unaBase.doc.generalParams = {
	currencies: []
}


//-----------------------   Eventos ----------------------------
//----------------------------------------------------------------



//-----------------------  Functions ----------------------------
//----------------------------------------------------------------


utilities = {
	shortcuts: {
		init: async () => {
			let res = await totales.adicionales.chargeTotal();
		},
		chargeTotal: () => {

			let url = "";

			url = '/4DACTION/_V3_get_totalAdicionales';

			$.ajax({
				url: url,
				dataType: 'json',
				async: false,
				cache: false,
				data: {
					id: $('section.sheet').data('id'),
					onlytotal: true
				},
				success: function (data) {

					
						let valor = unaBase.utilities.transformNumber(data.total )  / exchange_rate
					document.getElementsByName('cotizacion[total][item][adicional]')[0].value = unaBase.utilities.transformNumber(valor ,'int') ;

					return true;

				},
				error: function (error) {
					console.log(error);
					return false;
				}
			});

		},
		getShortcuts: () => {
			let url = "";

			url = '/4DACTION/_light_get_shortcuts';

			$.ajax({
				url: url,
				dataType: 'json',
				async: false,
				cache: false,
				data: {
					id: $('section.sheet').data('id')
				},
				success: function (data) {
					if (data.rows?.length >0){
						
						let cont = 0;
						data.rows.forEach(function (res_ele) {
	
	
							cont++;
	
							let row = `
								<tr style="margin-right: 10px; " id="${res_ele.id}" >
									<th class="thleft" style="width: 50px;">
										<input type="text" value="${cont}"  readonly />
									</th>
									<th class="thleft">
										<input type="text" value="${res_ele.name}"  class="edit" onchange="utilities.shortcuts.save(this)" placeholder="Ingrese un nombre"></input>
									</th>
									<th class="thleft" >
										<input type="text" class="edit" value="${unaBase.utilities.transformNumber(res_ele.valor ,'int')}"  onchange="utilities.shortcuts.save(this)" onkeyup="utilities.shortcuts.formater(this)"/>
									</th>
									<th class="thleft" >
										<button style="display: inline-block;" class="ui-icon ui-icon-minus" onclick="utilities.shortcuts.delete(this)" title="Eliminar"></button>
									</th>
								</tr>`;
	
	
	
							target = $('#scuts > tbody');
	
							target.append(row);
	
						});
	
					
					}
	
				},
				error: function (error) {
					console.log(error);
					toastr.warning(
						"No se pudieron cargar los shortcuts, favor comunicarse con soporte."
					);
				}
			});
		},
		save: (ad) => {

			

			let tr = ad.offsetParent.parentElement;
			let id_scut = tr.id;
			let name = "";
			let valor = 0;



			name = tr.getElementsByTagName("th")[1]?.getElementsByTagName('input')[0].value;
			valor = tr.getElementsByTagName("th")[2]?.getElementsByTagName('input')[0].value;




			let url = '/4DACTION/_light_set_shortcuts';
			if (name != "") {
				$.ajax({
					url: url,
					dataType: 'json',
					async: false,
					cache: false,
					data: {
						id_nv: $('section.sheet').data('id'),
						action: 'save',
						id_scut,
						valor,
						name,


					},
					success: function (data) {
						if (tr.id == "0") {
							tr.id = data.id;
						}

						toastr.success(
							"Shorcut guardado."
						);


						valor = unaBase.utilities.transformNumber(valor)
							
							if(data.modify){
								[...document.querySelectorAll(`tbody tr.item`)].map(line =>{
									try {
										if(line.dataset.id == undefined)
										line.dataset.id = Math.random() *  (100000000 - 10000) + 10000;

										line.querySelector('input[name="item[][cantidad]"]')
										let c_target =line.querySelector('input[name="item[][cantidad]"]')
										c_target.value = valor;
										
										$(`tr[data-id="${line.dataset.id}"] input[name="item[][cantidad]"]`).data("old-value",valor)
										$(`tr[data-id="${line.dataset.id}"] input[name="item[][cantidad]"]`).data("value",valor)
										c_target.dispatchEvent(new Event('blur'));
									} catch (error) {
										console.log('error')
										toastr.warning(
											"No se pudo recalcular."
										);
									}
								});
							}
					
							
							

					
							// if(data.rows.length > 0){
							// 	data.rows.map(line =>{
							// 	try {
							// 	let c_target = [...document.querySelectorAll(`tbody tr.item`)].find(e => e.dataset.id=="CT540094sc20Item2136524243").querySelector('input[name="item[][cantidad]"]')
							// 	c_target.value = valor;
							// 	$('tbody tr[data-id="CT540094sc20Item2136524243"] input[name="item[][cantidad]"]').data("old-value",valor)
							// 	c_target.dispatchEvent(new Event('blur'));
							// } catch (error) {
							// 	console.log('error')
							// 	toastr.warning(
							// 		"No se pudo recalcular."
							// 	);
							// }
							// 	});
							// }
						


					

						





						document.querySelectorAll('.ui-dialog fieldset.button-fieldset button#add-line-button')[0].disabled = false;
						//totales.updateSubtotalNeto();
					},
					error: function (error) {

						console.log(error);
					}
				});
			} else {
				toastr.warning(
					"Debe ingresar un nombre."
				);
			}

		},
		delete: (ad) => {
			confirm("¿ Seguro que quiere eliminar el shortcut ?").done(function (option) {
				if (option) {


					let tr = ad.offsetParent.parentElement;
					let id_scut = tr.id;

				
					let url = '/4DACTION/_light_set_shortcuts';
					$.ajax({
						url: url,
						dataType: 'json',
						async: false,
						cache: false,
						data: {
							id_nv: $('section.sheet').data('id'),
							action: 'delete',
							id_scut


						},
						success: function (data) {
							
							tr.remove();
							document.querySelectorAll('.ui-dialog fieldset.button-fieldset button#add-line-button')[0].disabled = false;
							toastr.success(
											"Shortcut eliminado."
										);
		

						},
						error: function (error) {
							toastr.warning(
								"No se pudo eliminar el shortcut."
							);
							console.log(error);
						}
					});
				}
			});

		},
		formater: (a) => {

			a.value = unaBase.utilities.transformNumber(a.value, 'view')

		}

	},
	general_params:{
		getGeneralParams: () =>{
			let id_nv = $('section.sheet').data('id')
			let table = document.getElementById('money_by_nv')
			let row = ''

			$.ajax({
				url: '/4DACTION/_force_getTipoCambioByNv',
				data: {
					id_nv: id_nv,
					sid: unaBase.sid.encoded()
				},
				dataType: 'json',
				async: false,
				cache: false,
				success: function (data) {
					unaBase.doc.generalParams.currencies = data.row
					data.row.forEach(v => {
						row += `<tr style="border-bottom:1px solid paleturquoise;" data-code="${v.codigo}">
									<td class="moneda" style="font-weight: bold;">${v.nombre} ${unaBase.defaulCurrencyCode != v.codigo ? '(' + unaBase.utilities.transformNumber(v.current_value,'view','end')+')' : ''}</td>
									<td class="moneda"><input style="width:70px !important;${unaBase.defaulCurrencyCode != v.codigo ? '' : 'display:none;'}" type="text" class="mx-auto moneda form-control" data-id="gp_currency_asignado" data-code="${v.codigo}" value="${unaBase.utilities.transformNumber(v.value ,'view','end')}" onkeyup="unaBase.utilities.general.formater(this)"/></td>
									<td class="moneda">
										<button type="button" data-class="currency-default" title="${v.asignada ? 'Asignada':'Asignar moneda'}" class="btn ${v.asignada ? 'btn-success asign':'btn-outline-success'} currency-default"><i class="fas fa-check"></i></button>
									</td>
									<td class="moneda" style="">
										<button type="button" data-class="currency-print" title="Actualizar valor moneda" class="btn  ${v.asignada_print ? 'btn-success asign':'btn-outline-success'} currency-print"><i class="fas fa-check"></i></button>
									</td>
								</tr>`
					})

					table.innerHTML = row

					document.querySelectorAll('#sheet-monedas table.items input.moneda ').forEach(e => e.addEventListener('click', unaBase.utilities.general.focusNumber))
					document.querySelectorAll('.currency-print').forEach(e => e.addEventListener('click', utilities.general_params.checkedChange))
					document.querySelectorAll('.currency-default').forEach(e => e.addEventListener('click', utilities.general_params.checkedChange))
				},
				error: function (err) {
				}
			});
		},
		setChanges: async () => {
			let id_nv = $('section.sheet').data('id');
			let reload = false;
		
			unaBase.ui.block();
			setTimeout(async () => {
				const update = (code, def, print, value) => {
					$.ajax({
						url: '/4DACTION/_light_set_currency_by_nv',
						data: {
							id_nv,
							code,
							def,
							print,
							value,
							sid: unaBase.sid.encoded()
						},
						dataType: 'json',
						async: false,
						cache: false,
						success: function (data) {
							if (data.success) {
								if (data.reload && !reload) {
									reload = data.reload;
								}
								utilities.general.updateTotalsItemsCurrencyDoc(code, value);
								let moneda = unaBase.tipoDocumentos.find(v => v.code == code);
								if (moneda) {
									//moneda.valor_moneda_nv = value
								}
							} else {
								unaBase.ui.unblock();
								toastr.warning(
									"No se ha guardado el cambio, favor guardar manualmente el presupuesto y comunicarse con soporte."
								);
							}
						},
						error: function (err) {
							unaBase.ui.unblock();
							toastr.warning(
								"No se ha guardado el cambio, favor guardar manualmente el presupuesto y comunicarse con soporte."
							);
						}
					});
				};
		
				document.querySelectorAll('#sheet-monedas tbody tr').forEach(async c => {
					let code = c.dataset.code;
					let def = c.querySelector('td.moneda button.currency-default').classList.contains('asign');
					let print = c.querySelector('td.moneda button.currency-print').classList.contains('asign');
					let value = c.querySelector('td.moneda input[data-id="gp_currency_asignado"]').value;
					value = value === '0' || value === '' ? 1 : value.replace('.', '');
		
					if (unaBase.doc.currencyCode.toUpperCase() === code.toUpperCase()) {
						exchange_rate = unaBase.utilities.transformNumber(value);
					}
		
					await update(code, def, print, value);
				});
		
				totales.updateSubtotalNeto();
				document.querySelector('.ui-dialog button.ui-dialog-titlebar-close').click();
				utilities.general.saveNV(reload);
			}, 100); // Retraso de 100ms
		},
		
		checkedChange: (e) =>{

			document.querySelectorAll(`.${e.currentTarget.dataset.class}`).forEach(a => {
				a.classList.remove("btn-success" , "asign")
				a.classList.add("btn-outline-success")
			});

			e.currentTarget.classList.remove("btn-outline-success")
			e.currentTarget.classList.add("btn-success")

			if(e.currentTarget.classList.contains('asign')==false)
				e.currentTarget.classList.add("asign")
		}

	},
	general:{
		saveNV: (reload)=>{
			let id_nv = $('section.sheet').data('id')
			let moduloActivo = $('ul > li.active').data("name") == 'negocios' ? 'negocios' : 'cotizaciones'

			var callback = function () {


				(function () {

					
					let data = {};
				

					data['first_time'] = true;
				
					let ajaxData = params.data();
					$.extend(data, data, ajaxData);


					$.ajax({
						url: '/4DACTION/_V3_setCotizacion',
						data: data,
						async: false,
						dataType: 'json',
						success: function (data) {
							unaBase.ui.unblock()
							if(reload)
							unaBase.loadInto.viewport(`/v3/views/${moduloActivo}/content.shtml?id=${id_nv}&changed_working_currency=true`, undefined, undefined, true);
						}
					});
					return true;

				})();
			};

			updateIndexes(callback);
		},
		updateTotalsItemsCurrencyDoc: (code, new_value) =>{
			
			document.querySelectorAll(`tbody tr.item`).forEach(line =>{
				try {
					
					if($(line).data('tipo-documento-valor-usd-code') == code ){
						let old_value = parseFloat($(line).data('tipo-documento-valor-moneda'))
						$(line).data('tipo-documento-valor-moneda', String( new_value.replace(',','.')))
						let c_target = line.querySelector('input[name="item[][precio_unitario]"]')
						let valor = unaBase.utilities.transformNumber(c_target.value) / old_value
						
						$(line).find('input[name="item[][precio_unitario]"]').data("old-value", valor)
						$(line).find('input[name="item[][precio_unitario]"]').data("value", valor)
						$(line).find('input[name="item[][precio_unitario]"]').val(valor)

						c_target.dispatchEvent(new Event('blur'))
					}
					
					if($(line).data('tipo-documento-compras-valor-usd-code') == code ){
						let old_value = parseFloat($(line).data('tipo-documento-compras-valor-moneda'))
						$(line).data('tipo-documento-compras-valor-moneda', String( new_value.replace(',','.')))
						let c_target = line.querySelector('input[name="item[][costo_unitario]"]')
						let valor = unaBase.utilities.transformNumber(c_target.value) / old_value
						
						$(line).find('input[name="item[][costo_unitario]"]').data("old-value", valor)
						$(line).find('input[name="item[][costo_unitario]"]').data("value", valor)
						$(line).find('input[name="item[][costo_unitario]"]').val(valor)

						c_target.dispatchEvent(new Event('blur'))
					}
					
				} catch (error) {
					console.log('error')
					toastr.warning(
						"No se pudo recalcular."
					);
				}
			});
		},
		getGeneralParams: () =>{
			let id_nv = unaBase.doc.id
			
			$.ajax({
				url: '/4DACTION/_force_getTipoCambioByNv',
				data: {
					id_nv: id_nv,
					sid: unaBase.sid.encoded()
				},
				dataType: 'json',
				async: false,
				cache: false,
				success: function (data) {
					unaBase.doc.generalParams.currencies = data.row
				},
				error: function (err) {
					data.errorMsg="Ocurrio un error."
				}
			});
		},
	}
}



//----------------------------------------------------------------
//----------------------------- INIT FUNCTION------------------------------
//----------------------------------------------------------------

;

async function setInitTotals(){
		
	
	let config  =  {
					
		method: 'get',
		url: `https://${window.location.host}/4DACTION/_V3_getSummaryByNegocio?id=${unaBase.doc.id}`,
		async:false
					
	};
	
	try{
		let res = await  axios(config);
		totales.summaryNegocioData = res.data;
		return res;
	}catch(err){
		throw err;
	}
	


};







