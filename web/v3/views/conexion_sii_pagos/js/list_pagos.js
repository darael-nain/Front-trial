
//----------------------------------------------------------------
//----------------------- Init --------------
//----------------------------------------------------------------


isConnected('list_dtc');

//----------------------------------------------------------------
//----------------------- Global Var --------------
//----------------------------------------------------------------

var alertObj = new Alert();
var f = document.getElementById("fecha");
var bts = document.querySelectorAll('.action');
var list = document.getElementById("list");
var justifymodal = document.getElementById("modal-oc-match");
var btnClose = document.getElementById('closemodal');
var modaltitle = document.getElementById('modaltitle');
var filtro_fecha = document.getElementById('div-fecha-neg');
var filtro_fecha_fxr = document.getElementById('div-fecha-fxr');
var badge_cont = document.getElementById('doc_cont');
var justifyBtn = document.getElementById('justify-btn');
var importExcelBtn = document.getElementById('import-excel');
var importExcelBtnModal = document.getElementById('import-excel-modal');
var fileInput = document.getElementById('formFile')
var btnImportModal = document.getElementById('open-modal-import')
const select_banco = document.getElementById('sel_banco');
const search_general = document.getElementById('search-general');


const warning = '#FFAC38'
const success = '#4FC276'
const error = '#F47975'

let groupedArray = [];
let dataMatch = []

let cuentas = []


//----------------------------------------------------------------
//----------------------- General Functions section --------------
//----------------------------------------------------------------



const justify = () => {

	const switchProcess = (status) => {
		if (status) {
			loadingLoad('loading-modal', true);
			justifyBtn.disabled = true;
			justifyBtn.style.opacity = "0.2";
			btnClose.disabled = true;
			inputs.forEach(i => i.disabled = true)
			selectors.forEach(i => i.disabled = true)

		} else {
			loadingLoad('loading-modal', false);

			inputs.forEach(i => i.disabled = false)
			selectors.forEach(i => i.disabled = false)
			justifyBtn.disabled = false;
			justifyBtn.style.opacity = "1";
			btnClose.disabled = false;
		}
	}


	let inputs = justifymodal.querySelectorAll('input');


	let selectors = justifymodal.querySelectorAll('select');


	let color = localStorage.getItem('colorCheck');
	let pendingColor = localStorage.getItem('pendingColorCheck')
	let errorMsg = "";


	if (pendingColor != "" && color == "orange")
		color = pendingColor

	switchProcess(true);
	let checkModalChecked = justifymodal.querySelectorAll('input.form-check-input:checked');
	if (checkModalChecked.length == 0)
		errorMsg = 'Ojo!!!, no has seleccionado nada aun.';


	let col = 9;
	switch (color) {

		case 'blue':

			if (checkModalChecked.length > 1)
				errorMsg = 'Debes Seleccionar solo una opción. <br>';

			break;
		default:
			break;

	}

	let ids = [];

	if (checkModalChecked.length > 1 && pendingColor == "blue")
		errorMsg += `Debes Seleccionar solo una opción. <br>`;

	if (errorMsg == '') {


		tr = justifymodal.getElementsByClassName("lielement");

		let checked = 0;
		let id, idmovsys;



		for (i = 0; i < tr.length; i++) {

			td = tr[i].getElementsByTagName("div")[col]?.getElementsByTagName('input')[0];
			if (td && td.checked) {
				checked++;
				if (color == 'red') {


					// selection = tr[i].getElementsByTagName("div")[8]?.getElementsByTagName('input')[0].value;
					// iddoc = tr[i].getElementsByTagName("div")[8]?.getElementsByTagName('input')[0].attributes.iddoc.value;
					// if (selection != '') {
					// 	list = tr[i].getElementsByTagName("div")[8]?.getElementsByTagName('input')[0].attributes.list.value;
					// 	opList = document.getElementById(list).querySelectorAll('option');
					// 	opList.forEach(e => {
					// 		if (e.value == selection)
					// 			idnegoc = e.attributes.id.value;
					// 	});


					// } else {
					// 	errorMsg += `Debes Seleccionar el negocio del documento ${i + 1} del listado. <br>`;
					// }

					// selection = tr[i].getElementsByTagName("div")[10]?.getElementsByTagName('input')[0].value;
					// if (selection != '') {
					// 	list = tr[i].getElementsByTagName("div")[10]?.getElementsByTagName('input')[0].attributes.list.value;
					// 	opList = document.getElementById(list).querySelectorAll('option');
					// 	opList.forEach(e => {
					// 		if (e.value == selection)
					// 			llave = e.attributes.id.value;
					// 	});


					// } else {
					// 	errorMsg += `Debes Seleccionar el Item del documento ${i + 1} del listado. <br>`;
					// }

					// fecha = tr[i].getElementsByTagName("div")[12]?.getElementsByTagName('input')[0].value.split('-').reverse().join('-');


				} else if (color == 'green' || color == 'blue' || color == 'yellow') {


					id = tr[i].getElementsByTagName("div")[col]?.getElementsByTagName('input')[0].dataset.id;
					idmovsys = tr[i].getElementsByTagName("div")[col]?.getElementsByTagName('input')[0].dataset.idmovsys;
					typemov = tr[i].getElementsByTagName("div")[col]?.getElementsByTagName('input')[0].dataset.typemov;


				}



				if (errorMsg == '') {

					ids.push({
						id,
						idmovsys,
						'sid': sid(),
						typemov
					});
				}
			}
		}
	}

	//PROCESO DE JUSTIFICACIÓN

	if (errorMsg != '') {

		switchProcess(false);
		alertObj.msg = errorMsg;
		alertObj.type = 'danger';
		alertLoad(alertObj, 'alertas-modal');
	} else {

		setJustify(ids, color)
			.then(res => {

				switchProcess(false);
				if (res.data[0].success) {
					btnClose.click();

					alertObj.type = 'success';
					alertObj.msg = 'Justificado con exito!!!';
					getMovimientosBancarios(f.value, select_banco.value)
				} else {
					alertObj.type = 'danger';
					alertObj.msg = res.data[0].errorMsg;
				}


				alertLoad(alertObj, 'alertas-modal');




			})
			.catch(err => {
				switchProcess(false);

				alertObj.type = 'danger';
				alertObj.msg = 'Hubo un inconveniente, favor contactar a soporte!!';
				alertLoad(alertObj, 'alertas-modal');
			});




	}

}

const switchStyle = (colorValue = localStorage.getItem('colorCheck'), massive = true) => {

	let checkMassive = document.getElementById('checkColorSelectorMasivo');


	switch (colorValue) {
		case 'blue':
			modaltitle.textContent = 'Selecciona el registro que corresponde al movimiento bancario :';
			justifyBtn.textContent = 'Conciliar';
			justifyBtn.style.backgroundColor = "#03D6F9";
			justifyBtn.style.color = "black";
			filtro_fecha.style.display = 'none';
			filtro_fecha_fxr.style.display = 'none';
			if (massive) {
				checkMassive.style.display = "none";
				checkMassive.checked = false;
			}

			bts.forEach(e => {
				if (e.style.display == "") {
					if (!e.classList.contains('black')) {
						e.style.backgroundColor = "#03D6F9";
						e.style.color = "black";
					}

				}
			});

			break;
		case 'red':
			filtro_fecha.getElementsByTagName('label')[0].textContent = 'Filtrar negocios por año:'
			modaltitle.textContent = 'Selecciona negocio e item :';
			justifyBtn.textContent = 'Crear y Justificar';
			justifyBtn.style.backgroundColor = "#FC4903";
			justifyBtn.style.color = "white";
			filtro_fecha.style.display = '';
			filtro_fecha_fxr.style.display = 'none';


			bts.forEach(e => {
				if (e.style.display == "") {
					if (!e.classList.contains('black')) {

						e.style.backgroundColor = "#FC4903";
						e.style.color = "white";
					}

				}


			});
			if (massive) {
				checkMassive.style.display = "";
				checkMassive.checked = true;
			}


			break;
		case 'green':
			modaltitle.textContent = ' Movimientos coincidentes:';
			justifyBtn.textContent = 'Conciliar';
			justifyBtn.style.backgroundColor = "#34CC02";
			justifyBtn.style.color = "white";
			filtro_fecha.style.display = 'none';
			filtro_fecha_fxr.style.display = 'none';
			if (massive) {
				checkMassive.style.display = "";
				checkMassive.checked = true;
			}
			bts.forEach(e => {
				if (e.style.display == "") {
					if (!e.classList.contains('black')) {

						e.style.backgroundColor = "#34CC02";
						e.style.color = "white";
					}
				}

			});


			break;
		case 'orange':
			modaltitle.textContent = 'Asignar pendientes:';
			justifyBtn.textContent = 'Asignar';
			justifyBtn.style.backgroundColor = "#F9BD00";
			justifyBtn.style.color = "white";
			filtro_fecha.style.display = 'none';
			filtro_fecha_fxr.style.display = 'none';
			if (massive) {
				checkMassive.style.display = "";
				checkMassive.checked = false;
			}

			bts.forEach(e => {
				if (e.style.display == "") {
					if (!e.classList.contains('black')) {

						e.style.backgroundColor = "#F9BD00";
						e.style.color = "white";
					}
				}

			});
			break;
		case 'yellow':
			filtro_fecha_fxr.getElementsByTagName('label')[0].textContent = 'Filtrar pagos por año:'
			modaltitle.textContent = 'Buscar y conciliar:';
			justifyBtn.textContent = 'Conciliar';

			filtro_fecha.style.display = 'none';
			filtro_fecha_fxr.style.display = '';

			if (massive) {
				checkMassive.style.display = "none";
				checkMassive.checked = false;
			}


			break;
		case 'grey':
			filtro_fecha_fxr.style.display = 'none';
			modaltitle.textContent = 'Asignar nota de credito:';
			justifyBtn.textContent = 'Asigar NC';

			filtro_fecha.style.display = 'none';
			filtro_fecha_fxr.style.display = '';

			if (massive) {
				checkMassive.style.display = "none";
				checkMassive.checked = false;
			}


			break;
		case 'black':
			filtro_fecha_fxr.style.display = 'none';
			filtro_fecha.style.display = 'none';
			filtro_fecha_fxr.style.display = '';

			if (massive) {
				checkMassive.style.display = "none";
				checkMassive.checked = false;
			}



			break;
		default:
			// filtro_fecha_fxr.style.display = 'none';
			// if (massive) {
			// 	checkMassive.style.display = "none";
			// 	checkMassive.checked = false;
			// }

			break;
	}


	bts.forEach(e => {
		if (e.classList.contains('black')) {
			if (colorValue != "black") {
				e.textContent = "Anular";
			} else {
				e.textContent = "Desanular";
			}


		}


	});


}

const findBusiness = (obj, manual) => {
	const value = obj.currentTarget.value.toLowerCase();
	const dl = document.getElementById(obj.target.attributes.list.value);
	let currentOpts = [];
	const opts = dl.getElementsByTagName("option");
	if (opts.length > 0)
		currentOpts = Array.from(opts).filter(o => o.attributes.value.value.toLowerCase() == value.toLowerCase())

	if (currentOpts.length != 0) {

		loadingLoad('loading-modal', true, 'Buscando negocios...');
		let dli = document.getElementById(`il${obj.target.attributes.iddoc.value}`);
		eraseHtml(`il${obj.target.attributes.iddoc.value}`);
		let ili = document.getElementById(`is${obj.target.attributes.iddoc.value}`);
		ili.value = '';

		getItems(currentOpts[0].attributes.id.value)
			.then(res => {



				if (res.data.rows.length > 0) {

					let superrow = '';
					res.data.rows.forEach(res_e => {

						superrow += `<option value="${res_e.ruta} ${res_e.nombre}" id="${res_e.llave}"></option>`;




					});
					dli.innerHTML = superrow;

				}

				loadingLoad('loading-modal', false);
				ili.focus();
				ili.click();

			});




	} else {

		if (obj.keyCode === 13) {

			loadingLoad('loading-modal', true, 'Buscando negocios...');
			dl.innerHTML = '';
			if (value.length > 0) {
				getBusiness(value, filtro_fecha.children[1].value)
					.then(res => {



						if (res.data.records.total_records > 0) {

							let superrow = '';
							let loops = res.data.records.total_records;
							let row = "";
							let data = res.data.data.rows.reverse();
							for (let i = 0; i < loops; i++) {

								row = data.pop();
								superrow += `<option value="${row.folio} - ${row.referencia}" id="${row.id}"></option>`;

							}

							dl.innerHTML = superrow;
							superrow = "";
						} else {


							alertObj.msg = 'No se encontraron negocios, intente con otra referencia o folio.';
							alertObj.type = 'warning';
							alertLoad(alertObj, 'alertas-modal');
						}

						loadingLoad('loading-modal', false);
						obj.target.click();
					});

			} else {
				loadingLoad('loading-modal', false);
				obj.target.focus();
			}
		}

	}

}

const SetReload = (date) => {
	loadingLoad('loading', true);
	eraseHtml('list');
	eraseHtml('msg');
	verifyChecked();

	getSiiMovDtc(date)
		.then(res => {
			loadingLoad('loading', false);
			if (select_banco.value) {
				getMovimientosBancarios(f.value, select_banco.value);
			} else {
				alertObj.msg = 'Selecciona un banco';
				alertObj.type = 'warning';
				alertLoad(alertObj, 'alertas');
			}

		});
}

const verifyChecked = (massive = false) => {

	const tr = list.getElementsByTagName("tr");
	let cont = 0;
	let colorCheck = localStorage.getItem('colorCheck')
	let pendingColorCheck = localStorage.getItem('pendingColorCheck')


	for (i = 0; i < tr.length; i++) {
		td = tr[i].getElementsByTagName("td")[0]?.getElementsByTagName('input')[0].checked;

		if (td) {
			cont++;
		}
	}

	if (cont == 0) {
		if (!massive) {
			localStorage.setItem('colorCheck', '')
			localStorage.setItem('pendingColorCheck', '')

		}


		bts.forEach(function (bts_ele) {
			bts_ele.style.display = "none"
		});

	} else {

		if (colorCheck == "orange")
			colorCheck = pendingColorCheck;

		bts.forEach(bts_ele => {


			if (bts_ele.classList.contains(colorCheck)) {
				bts_ele.style.display = ""

				if (pendingColorCheck != "") {
					if (bts_ele.classList.contains('red'))
						bts_ele.style.display = "none"
				}


			} else {


				//YELLOW BUTTON ---> JUSTIFICAR GASTO OC/FXR

				bts_ele.style.display = "none"


				if (pendingColorCheck != "") {
					if (bts_ele.classList.contains('red'))
						bts_ele.style.display = "none"
				}
				if (bts_ele.classList.contains('yellow') && colorCheck == 'green')
					bts_ele.style.display = "none"
				else
					if (bts_ele.classList.contains('yellow') && colorCheck != 'grey' && colorCheck != 'black')
						bts_ele.style.display = ""

				if (bts_ele.classList.contains('black') && pendingColorCheck == '')
					bts_ele.style.display = ""

			}





		});
	}

}

const verifyCheck = (e) => {

	const colorValue = e.currentTarget.attributes.colorselector.value;
	const pendingColorValue = e.currentTarget.attributes.pendingcolorselector.value;
	let res = true;


	if (e.currentTarget.checked) {


		if (localStorage.getItem('colorCheck') && localStorage.getItem('colorCheck') != '') {
			switch (colorValue) {
				case 'blue':
					if (localStorage.getItem('colorCheck') != '') {
						res = false;
						alertObj.msg = 'No puedes seleccionar mas de un documento de este tipo.';
					}
					break;
				case 'orange':
					if (localStorage.getItem('colorCheck') != '') {
						res = false;
						alertObj.msg = 'No puedes seleccionar mas de un documento de este tipo.';
					}
					break;
				case 'red':
					if (localStorage.getItem('colorCheck') != 'red') {
						res = false;
						alertObj.msg = 'No puedes seleccionar documentos distintos a los que ya tienes en selección.';
					}

					break;

				case 'green':
					if (localStorage.getItem('colorCheck') != 'green') {
						res = false;
						alertObj.msg = 'No puedes seleccionar documentos distintos a los que ya tienes en selección.';

					}

				default:

					break;
			}

		} else {
			res = true;
		}

		if (res) {
			switchStyle(colorValue, false);
			if (document.querySelector(`.${colorValue}`))
				document.querySelector(`.${colorValue}`).style.display = "";

			localStorage.setItem('colorCheck', colorValue);
			localStorage.setItem('pendingColorCheck', pendingColorValue)

		} else {
			e.currentTarget.checked = false;
			alertObj.type = 'warning';
			alertLoad(alertObj, 'alertas');

		}
	} else {
		res = false;
	}
	verifyChecked();


	return res;
}

const verifyModalCheck = (e) => {

	let col = 8;



	if (e.checked) {
		tr = justifymodal.getElementsByClassName("lielement");

		let checked = 0;
		for (i = 0; i < tr.length; i++) {
			td = tr[i].getElementsByTagName("div")[col]?.getElementsByTagName('input')[0];
			if (td && td.checked) {
				checked++;


			}
		}
		if (checked > 1) {
			e.checked = false;
			alertObj.type = 'warning';
			alertObj.msg = 'Debes seleccionar solo una opción.';

			alertLoad(alertObj, 'alertas-modal');
		}


	}

}

//FILTROS DE COLORES
const colorSelector = (obj) => {
	//BADGE DE CONTEO DE DOCUMENTOS
	badge_cont.textContent = "0"

	let tr, td, i, colorValue, pendingColorValue;
	let h = obj.currentTarget.value;
	let change = true;
	let cont = 0;





	tr = list.querySelectorAll("div.accordion-item.mov");
	//tr = table.getElementsByTagName("tr");

	tr.forEach(e => {
		if (h === 'cancel') {
			e.style.display = "";
		} else {
			e.style.display = e.classList.contains(h) ? "" : "none";
		}
	});


	// for (i = 0; i < tr.length; i++) {
	// 	td = tr[i].getElementsByTagName("td")[0]?.getElementsByTagName('input')[0];


	// 	if (td) {
	// 		colorValue = td.attributes.colorselector.value;
	// 		pendingColorValue = td.attributes.pendingcolorselector.value;

	// 		if (colorValue.toUpperCase().indexOf(h.toUpperCase()) > -1) {


	// 			if (colorValue != 'blue' && colorValue != 'orange' && h.toUpperCase() != 'CANCEL' && colorValue != 'grey' && colorValue != 'black') {
	// 				td.checked = true;
	// 				localStorage.setItem('colorCheck', colorValue);
	// 				localStorage.setItem('pendingColorCheck', pendingColorValue)

	// 			} else {
	// 				//	switchDisplay(false,'grey')
	// 				td.checked = false;
	// 			}


	// 			tr[i].style.display = "";
	// 			cont++;


	// 		} else if (h.toUpperCase() == 'CANCEL') {
	// 			td.checked = false;
	// 			tr[i].style.display = "";

	// 		} else {

	// 			td.checked = false;
	// 			tr[i].style.display = "none";
	// 		}

	// 	}
	// }


	if (h.toUpperCase() == 'CANCEL') {
		//tr.forEach(e => e.style.display = "")
		switchDisplay(false, 'grey')
		switchDisplay(false, 'black')
		switchDisplay(false, 'orange')
		//switchDisplay(false, 'purple')

	} else {
		//BADGE DE CONTEO DE DOCUMENTOS
		badge_cont.textContent = cont
	}

	if (change) {
		localStorage.setItem('colorCheck', h);
		//localStorage.setItem('pendingColorCheck', pendingColorValue)
	}


	verifyChecked();
	switchStyle(localStorage.getItem('colorCheck'));
}

const match = (event) => {
	loadingLoad('loading-modal', true);
	eraseHtml('modal-list');

	let red_type, tr, td, yellow_type;
	let ids = [];
	red_type = event.currentTarget.classList.contains('red');
	yellow_type = event.currentTarget.classList.contains('yellow');
	black_type = event.currentTarget.classList.contains('black');


	let typetoget = event.currentTarget.classList.contains('red') ? "red_type" : event.currentTarget.classList.contains('yellow') ? "yellow_type" : event.currentTarget.classList.contains('black') ? "black_type" : ""


	if (yellow_type) {
		localStorage.setItem('colorCheck', 'yellow');
		switchStyle();

	}


	tr = list.getElementsByTagName("tr");

	for (i = 0; i < tr.length; i++) {
		td = tr[i].getElementsByTagName("td")[0]?.getElementsByTagName('input')[0];

		if (td && td.checked) {
			if (red_type) {

				let folio = tr[i].getElementsByTagName("td")[1].textContent;
				ids.push({
					'id': td.attributes.id.value,
					'folio': `Folio Documento :  N° ${tr[i].getElementsByTagName("td")[1].textContent}`,
					'total': tr[i].getElementsByTagName("td")[9].textContent,
					'proveedor': tr[i].getElementsByTagName("td")[2].textContent,
					'tipo': tr[i].getElementsByTagName("td")[4].textContent,
					'fecha': tr[i].getElementsByTagName("td")[3].textContent,
				});
			} else {
				ids.push(
					td.attributes.id.value
				);

			}


		}
	}

	listObject = new List();

	if (red_type) {
		if (event.currentTarget.classList.contains('two')) {

			if (confirm(`Esta accion creara  ${ids.length == 1 ? 'el' : 'los'} ${ids.length} ${ids.length == 1 ? 'documento' : 'documentos'} en estado "Por asignar " para su posterior asociacion a un gasto. Confimar ?`)) {
				let ids2 = [];
				ids.forEach(ids_e => {
					ids2.push({
						'iddoc': ids_e.id,
						'idnegoc': 0,
						'llaveitem': "",
						'fecha': ids_e.fecha,
						'type': "red",
						'sid': sid(),
						'pending': true
					});

				});


				setJustify(ids2, "red")
					.then(res => {


						alertObj.type = 'success';
						alertObj.msg = 'Documentos creados con exito!!!';
						alertLoad(alertObj, 'alertas');


						getMovimientosBancarios(f.value, select_banco.value);


					})
					.catch(err => {

						alertObj.type = 'danger';
						alertObj.msg = 'Hubo un inconveniente, favor contactar a soporte!!';
						alertLoad(alertObj, 'alertas-modal');
					});

			}

		} else {
			let row = [];

			ids.forEach(ids_e => {


				let adicional = [];

				adicional.push(`<div class="" id="loading-search-neg-${ids_e.id}" style="display:none"><div class="spinner-border text-success" role="status">
								</div>
								<span class="">Espere un momento...</span>
								</div>
								
								<div class="searchbar input-group">
									<label class="input-group-text" for="bs${ids_e.id}" style="width: 35%;">Negocio</label>
									<input list="bl${ids_e.id}" id="bs${ids_e.id}" iddoc="${ids_e.id}"  class="form-control bs"  type="text"   placeholder="Buscar negocio..." autocomplete="off">
									<div id="search_list">
										<datalist id="bl${ids_e.id}" >
										</datalist>
									</div> 
								</div>`);
				adicional.push(`<div class="searchbar  input-group">
									<label class="input-group-text" for="il${ids_e.id}" style="width: 35%;">Item</label>
									<input list="il${ids_e.id}" id="is${ids_e.id}" ${ids_e.id} class="form-control is "  type="text" placeholder="Buscar item..." autocomplete="off">
									<div id="search_list">
										<datalist id="il${ids_e.id}" >
										</datalist>
									</div> 
								</div>`);
				adicional.push(`<div  class="input-group" style="text-align: left;">
									<label for="fecha-oc-${ids_e.id}" style="width:35%;" class="input-group-text">Fecha OC</label>
									<input id="fecha-oc-${ids_e.id}" type="date" class="form-control" value="${ids_e.fecha.split('-').reverse().join('-')}">
								</div>`);


				row.push({
					'class1': 'lielement',
					'l1': ids_e.folio,
					'link1': ids_e.proveedor,
					'l2': ids_e.tipo,
					'l3': ids_e.fecha,
					'l4': ids_e.total,
					'adicional': [...adicional],
					'l5': `<input class="form-check-input " checked style="float: right;" type="checkbox" value="" id="check${ids_e.id}">`

				});





			});


			listObject.bloques.push(row);

			listLoad(listObject, 'modal-list');



			let bss = document.querySelectorAll('.bs');
			bss.forEach(c => {
				c.addEventListener("keyup", (event) => findBusiness(event));
				c.addEventListener("change", (event) => findBusiness(event));
			});


			loadingLoad('loading-modal', false);
		}


	} else if (!black_type) {
		let green = event.currentTarget.classList.contains('green');
		let fxr = event.currentTarget.classList.contains('yellow');

		getMatch(ids, typetoget, fxr, filtro_fecha.children[1].value, green);
	} else {
		let action_des = event.currentTarget.textContent == "Desanular" ? 'desanulara' : 'anulara'

		if (confirm(`Esta acción ${action_des} ${ids.length} ${ids.length == 1 ? 'documento' : 'documentos'}. Confimar ?`)) {
			let ids2 = [];
			ids.forEach(ids_e => {
				ids2.push({
					'iddoc': ids_e,
					'sid': sid(),
					"action": event.currentTarget.textContent == "Desanular" ? 'desanular' : 'anular'

				});

			});


			setActions(ids2)
				.then(res => {


					alertObj.type = 'success';
					alertObj.msg = `Documentos ${action_des == 'desanulara' ? 'desanulados' : 'anulados'} con exito!!!`;
					alertLoad(alertObj, 'alertas');
					getMovimientosBancarios(f.value);


				})
				.catch(err => {

					alertObj.type = 'danger';
					alertObj.msg = 'Hubo un inconveniente, favor contactar a soporte!!';
					alertLoad(alertObj, 'alertas-modal');
				});

		}

	}




}

const getMatch = (ids, type) => {

	getMovMatch(ids, type)
		.then(res => {

			document.querySelector('.total').textContent = ''
			dataMatch = res.data;

			listObject = new List();

			res.data.forEach(res_e => {

				let row = [];
				if (Object.keys(res_e.data).length > 0) {

					// Itera sobre cada elemento de rows
					const groupedByNomina = {};

					const data = { ...res.data[0].data };
					delete data.rows;
					delete data.nominas;

					// Itera sobre cada elemento de rows
					res_e.data.rows.forEach(row => {
						// Encuentra el nomina correspondiente
						const nomina = res_e.data.nominas.find(n => n.id_comprobante === row.idoc);

						if (nomina && nomina.id_nomina) {
							// Si el grupo para id_nomina no existe, inicialízalo
							if (!groupedByNomina[nomina.id_nomina]) {
								groupedByNomina[nomina.id_nomina] = {
									name_nomina: nomina.name_nomina,
									comprobantes: []
								};
							}

							// Añade el row al grupo correspondiente
							groupedByNomina[nomina.id_nomina].comprobantes.push({
								...row,
								name_nomina: nomina.name_nomina
							});
						} else {
							// Si no se encuentra una nomina correspondiente, agrégalo a un grupo 'Unassigned' o similar
							if (!groupedByNomina['Unassigned']) {
								groupedByNomina['Unassigned'] = {
									name_nomina: 'Unassigned',
									comprobantes: []
								};
							}
							groupedByNomina['Unassigned'].comprobantes.push(row);
						}
					});

					groupedArray = Object.keys(groupedByNomina).map(id_nomina => {

						return {
							id_nomina,
							name_nomina: groupedByNomina[id_nomina].name_nomina,
							...data,
							comprobantes: groupedByNomina[id_nomina].comprobantes
						};
					});


					res_e.data.rows.forEach(e => {



						let linkto = `<a href="https://${window.location.host}/4DACTION/wbienvenidos#${e.tipo_mov == "Comprobante" ? 'comprobantes' : ''}/content.shtml?id=${e.idoc}" target="_blank">
						<div class="fw-bold">${e.referencia}</div>
										</a>`

						row.push(e);


					});

				}




			});

			let imgbank;

			switch (res.data[0].data.banco) {
				case "Santander": {
					imgbank = `<img class="imgRedonda santander" src="../css/img/santander.png"  alt="Banco Santander" >`;
					break;
				}
				case "Chile Banconexion": {
					imgbank = `<img class="imgRedonda bchile" src="../css/img/chile_banconexion.png"  alt="Banco Chile" >`;
					break;
				}
				case "BCI": {
					imgbank = `<img class="imgRedonda bci" src="../css/img/bci.png"  alt="BCI" >`;
					break;
				}
				case "Itau": {
					imgbank = `<img class="imgRedonda bci" src="../css/img/itau.jpg"  alt="ITAU" >`;
					break;
				}
				default: {
					imgbank = res.data[0].data.banco;
					break;
				}

			}

			listObject.imgbank = imgbank
			listObject.find = true
			eraseHtml('modal-list');

			if (res.data[0].data.rows.length > 0)
				listObject.bloques.push(res.data[0].data);


			if (listObject.bloques.length > 0) {
				selectorLoad(listObject, 'modal-list');
				initCentroCostoSelects(document.getElementById("modal-list"));
			} else {
				let sm = '<span>No se encontraron movimientos coincidentes con la cuenta.</span>'
				simpleMsg(sm, 'modal-list', true)

			}


			let btns = document.querySelectorAll(`button.comprobante`);
			btns.forEach(b => b.addEventListener("click", getComprobante));

			loadingLoad('loading-modal', false);
		})
		.catch(error => {
			console.log(error);
			loadingLoad('loading-modal', false);
		});
}

// ==============================
// Centro de costo + TomSelect
// ==============================
const CCOSTO = {
	loaded: false,
	loading: false,
	options: [] // [{value:'ID', text:'ID / DESCRIPCION'}]
};

// Ajusta aquí si tu endpoint/campos cambian
async function loadCentroCosto() {
	
	if (CCOSTO.loaded) return CCOSTO;
	if (CCOSTO.loading) {
		// espera simple si ya está cargando
		await new Promise((r) => setTimeout(r, 150));
		return loadCentroCosto();
	}

	CCOSTO.loading = true;
	try {
		// OJO: si tu endpoint es otro, cámbialo aquí
		const url = new URL("/4DACTION/_v3_getAreasNegocio", window.location.origin);
		url.searchParams.set("page", "1");
		url.searchParams.set("results", "5000");
		url.searchParams.set("q", "");
		url.searchParams.set("q2", "");
		url.searchParams.set("activo", "true");

		const resp = await fetch(url.toString(), { credentials: "same-origin" });
		if (!resp.ok) throw new Error("No se pudo cargar centro de costo");

		const data = await resp.json();
		const rows = Array.isArray(data?.rows) ? data.rows : [];

		CCOSTO.options = rows
			.filter(r => r && r.estado === true)
			.map(r => {
				const id = String(r.id ?? "").trim();
				const desc = String(r.descripcion_centrocosto ?? "").trim();
				return { value: id, text: `${id} / ${desc}` };
			})
			.filter(o => o.value);

		CCOSTO.options.sort((a, b) => a.text.localeCompare(b.text, "es"));
		CCOSTO.loaded = true;

		return CCOSTO;
	} finally {
		CCOSTO.loading = false;
	}
}

function fillCentroCostoSelect(selectEl, force = false) {
  if (!force && selectEl.options && selectEl.options.length > 1) return;

  const opts = (CCOSTO.options || [])
    .map(o => `<option value="${o.value}">${o.text}</option>`)
    .join("");

  selectEl.innerHTML = `<option value="">Selecciona...</option>${opts}`;
}



function initCentroCostoTomSelect(selectEl, forceFill = false) {
  if (!selectEl) return;

  // si venía con TomSelect “clonado” visualmente, esto evita conflictos
  if (selectEl.tomselect) {
    try { selectEl.tomselect.destroy(); } catch(e) {}
  }

  fillCentroCostoSelect(selectEl, forceFill);

  new TomSelect(selectEl, {
    maxItems: 1,
    sortField: { field: "text", direction: "asc" },
    render: { no_results: () => '<div class="no-results">Sin resultados</div>' },
	
  });

}


async function initCentroCostoSelects(root = document, forceFill = false) {
  await loadCentroCosto();
  root.querySelectorAll("select.centro_costo").forEach(sel => {
    initCentroCostoTomSelect(sel, forceFill);
  });
}

// Para casos de cloneNode donde se clona el wrapper de TomSelect
function resetTomSelect(selectEl) {
  if (!selectEl) return;

  // si existe instancia real, destruye normal
  if (selectEl.tomselect) {
    try { selectEl.tomselect.destroy(); } catch (e) {}
  } else {
    // si es un clon, borra wrappers huérfanos (suelen ser hermanos)
    const next = selectEl.nextElementSibling;
    if (next && next.classList.contains('ts-wrapper')) next.remove();

    const prev = selectEl.previousElementSibling;
    if (prev && prev.classList.contains('ts-wrapper')) prev.remove();
  }

  // limpia clases/attrs que vienen clonadas
  selectEl.classList.remove('tomselected', 'ts-hidden-accessible');
  selectEl.removeAttribute('tabindex');
  selectEl.removeAttribute('aria-hidden');
  selectEl.removeAttribute('data-ts-hidden-accessible');
  selectEl.style.display = '';
}

function resetCentroCostoInContainer(container) {
  if (!container) return;
  container.querySelectorAll('select.centro_costo').forEach(resetTomSelect);
}







//----------------------------------------------------------------
//----------------------- Card Load section ----------------------
//----------------------------------------------------------------

//----------------------------------------------------------------
//----------------------- Select bank Load section ---------------------
//----------------------------------------------------------------

const getBancos = (estado = "TODOS") => {

	var select_banco = document.getElementById('sel_banco');

	// Cargar plan de cuentas con información de auxiliar
	getPlanCuentas()
		.then((planRes) => {
			// Mapear las cuentas del plan de cuentas al formato esperado
			if (planRes && planRes.rows) {
				cuentas = planRes.rows.map(cuenta => ({
					cuenta: cuenta.number || cuenta.cuenta,
					nombre: cuenta.name || cuenta.nombre,
					auxiliar: cuenta.auxiliar || false
				}));
			}
		})
		.catch((err) => {
			console.error('Error al cargar plan de cuentas:', err);
			// Si falla, intentar usar las cuentas del backend de bancos
			cuentas = [];
		});

	getBancosEmpresa(estado)
		.then((res) => {
			// Ya no usamos res.cuentas.rows porque lo cargamos desde getPlanCuentas
			for (let value of res.rows) {
				var opt = document.createElement('option');
				opt.value = value.cuenta_corriente;
				opt.innerHTML = value.des_banco + ' / Nº : ' + value.cuenta_corriente;
				select_banco.appendChild(opt);

			}
		});

}

//----------------------------------------------------------------
//----------------------- Table Load section ---------------------
//----------------------------------------------------------------

//-------------TABLA MOVIMIENTOS

const getMovimientosBancarios = (date, cuenta_banco = '0') => {
	if (cuenta_banco === "none") {
		alertObj.msg = 'Selecciona un banco';
		alertObj.type = 'warning';
		alertLoad(alertObj, 'alertas');
		loadingLoad('loading', false);
		return;
	}

	//BADGE DE CONTEO DE DOCUMENTOS
	badge_cont.textContent = "0"

	loadingLoad('loading', true);
	eraseHtml('list');
	eraseHtml('msg');
	verifyChecked();

	//Por mientras
	estado = "TODOS";
	getMovimientos(date, estado, cuenta_banco)
		.then((res) => {
			eraseHtml('list');

			if (res.data.length > 0) {
				listObject = new List();
				let totalAbonos = 0;
				let totalCargos = 0;
				res.data.forEach(res_e => {

					let row = [];
					let cont = 0;
					let iddoc = res_e.data.iddoc;
					let imgbank;

					switch (res_e.data.banco) {
						case "Santander": {
							imgbank = `<img class="imgRedonda santander" src="../css/img/santander.png"  alt="Banco Santander" >`;
							break;
						}

						case "Chile Banconexion": {
							imgbank = `<img class="imgRedonda bchile" src="../css/img/chile_banconexion.png"  alt="Banco Chile" >`;
							break;
						}
						case "BCI": {
							imgbank = `<img class="imgRedonda bci" src="../css/img/bci.png"  alt="BCI" >`;
							break;
						}
						case "Itau": {
							imgbank = `<img class="imgRedonda bci" src="../css/img/itau.jpg"  alt="ITAU" >`;
							break;
						}
						default: {
							imgbank = res_e.data.banco;
							break;
						}

					}

					listObject.imgbank = imgbank
					listObject.find = false

					// listObject.cs= cs
					// listObject.color= color

					if (Object.keys(res_e.data).length > 0) {
						listObject.bloques.push(res_e.data);

					}

					const data = res_e.data;

					if (data.siimov_tipo === "ABONO") {
						const abono = Number(data.siimov_total);
						totalAbonos += abono || 0; // Suma abono
					}

					// Verificar si el tipo no es "ABONO" para considerarlo como cargo
					if (data.siimov_tipo !== "ABONO") {
						const cargo = Number(data.siimov_total);
						totalCargos += cargo || 0; // Suma cargo
					}

				});
				document.querySelector('.total-abono').textContent = "$ " + totalAbonos.toLocaleString('es-CL');
				document.querySelector('.total-cargos').textContent = "$ " + totalCargos.toLocaleString('es-CL');

				if (listObject.bloques.length > 0) {
					selectorLoad(listObject, 'list');
					initCentroCostoSelects(document.getElementById("list"));
				} else {
					let sm = '<span>No se encontraron movimientos a conciliar.</span>'
					simpleMsg(sm, 'msg', true)
				}

				//OCULTAR COLORES
				// switchDisplay(false, 'grey')
				// switchDisplay(false, 'black')
				// switchDisplay(false, 'orange')
				switchDisplay(false, 'purple')

				//Inicializar tooltips
				var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
				var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
					return new bootstrap.Tooltip(tooltipTriggerEl)
				})

				let btns = document.querySelectorAll(`button.comprobante`);
				btns.forEach(b => b.addEventListener("click", getComprobante));

				let btns2 = document.querySelectorAll(`button.conciliador`);
				btns2.forEach(b => b.addEventListener("click", conciliar));


				let btns3 = document.querySelectorAll(`button.find-seat`);
				btns3.forEach(b => b.addEventListener("click", findSeat));

				let slts = document.querySelectorAll(`select.account`);
				slts.forEach(b => b.addEventListener("change", selectAccount));
				//BADGE DE CONTEO DE DOCUMENTOS
				badge_cont.textContent = res.data.length


				loadingLoad('loading', false);




			} else {
				let sm = '<span>No se encontraron movimientos a conciliar.</span>'
				simpleMsg(sm, 'msg', true)

				loadingLoad('loading', false);
			}


			document.querySelectorAll('.account').forEach((el) => {
				if (!el.tomselect) {
					let settings = {
						sortField: {
							field: "text",
							direction: "asc"
						},
						render: {
							no_results: function (data, escape) {
								return '<div class="no-results">Sin resultados</div>';
							},
						},
					};
					new TomSelect(el, settings);
				}
			});




		})
		.catch(err => {
			loadingLoad('loading', false);
			console.log('Error:', err)

		})
}

const switchDisplay = (status, color) => {

	let tr = list.querySelectorAll("div.accordion-item.mov");
	tr.forEach(e => e.classList.contains(color) == true ? e.style.display = "none" : null)


	//BADGE DE CONTEO DE DOCUMENTOS
	//badge_cont.textContent = cont

}

const checkMassiveAction = (obj) => {


	let tr, td, i, colorValue, pendingColorValue;
	let h = obj.currentTarget.checked;
	let colorCheck = localStorage.getItem('colorCheck')
	let pendingColorCheck = localStorage.getItem('pendingColorCheck')

	if (colorCheck != "") {
		tr = list.getElementsByTagName("tr");

		for (i = 0; i < tr.length; i++) {
			td = tr[i].getElementsByTagName("td")[0]?.getElementsByTagName('input')[0];


			if (td) {
				colorValue = td.attributes.colorselector.value;
				pendingColorValue = td.attributes.pendingcolorselector.value;



				// if (colorValue == colorCheck && colorValue !='blue' && colorValue !='orange') {
				if (colorValue == colorCheck && colorValue != 'blue') {

					tr[i].style.display = "";

					if (h) {

						td.checked = true;
					} else {
						td.checked = false;
					}



				} else {
					td.checked = false;
					tr[i].style.display = "none";
				}

			}
		}
		verifyChecked(true);
	}


}

filtro_fecha_fxr.addEventListener("change", () => {

	getMatch([], false, true, filtro_fecha_fxr.children[1].value, false);

});

const sumTotal = (e) => {

	const parseInteger = (input) => {
		const onlyNumbers = input.replace(/\D/g, '');
		const integerValue = parseInt(onlyNumbers, 10);
		return isNaN(integerValue) ? 0 : integerValue;
	}
	let acc = document.querySelectorAll('.modal-dialog .accordion-item')
	let haber = 0
	for (let i = 3; i < acc.length; i++) {
		let ac2 = acc[i]
		const check_input = ac2.querySelector('.check-comp').checked

		if (check_input) {
			haber += parseInteger(ac2.querySelector('.total-debe').textContent)
		}
	}
	document.querySelector('.total').textContent = new Intl.NumberFormat('en-DE').format(haber)
}

const getComprobante = (e, t) => {
	let id, targetId, complete


	if (typeof e.currentTarget != 'undefined') {
		id = e.currentTarget.dataset.idcomp
		targetId = e.currentTarget.dataset.id
		complete = false
	} else {
		id = e
		targetId = t
		complete = true
	}

	getComprobantes(id)
		.then((res) => {
			if (complete) {
				let target = document.querySelector(`#list div.accordion-item.mov[data-id="${targetId}"]`)

				let id_created = `created-${targetId - id}`;
				const node = document.createElement("div");

				node.id = id_created
				node.classList.add('accordion-item-list')
				node.classList.add('accordion-item')
				node.classList.add(`accordion-detail-${id}`)

				target.querySelector(`div.accordion`).appendChild(node)


				let ls = `<div class="accordion-header row  align-items-center" style="background-color: #f2f4f5 !important; background-color: grey;
								border-block: inherit;
								border: 1px solid grey;
								border-radius: 12px;">
							<div class=" col-md-11 col-lg-11"  id="panelsStayOpen-heading0_${id}_0-${id}">
									<div class="row"> 
										<button class="accordion-button collapsed comprobante"  data-id="${targetId}-${id}" data-idcomp="${id}" style=" margin-right:10px;background-color: #f2f4f5  !important;" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapse0_${id}_0-${id}" aria-expanded="false" aria-controls="panelsStayOpen-collapse0_${id}_0-${id}">
											
											<div class=" col-md-2 col-lg-2">  
												<strong style="margin-right:20px"><a onclick="toComprobante(event,this)" href="#" data-id="${id}">Asiento #${res.data.id}</a>  </strong><br>
												<small style="margin-right:20px">${res.data.registryDate} </small>
											</div>
											<div class=" col-md-6 col-lg-6"  style="margin-right:20px"> 
												<small style="">${res.data.description}</small>
											</div>
											<div class=" col-md-2 col-lg-2  align-items-right"> 
												<span  style="font-weight: bolder;margin-right:20px;">DEBE</span>  <small  style="font-weight: bolder;">$${new Intl.NumberFormat('en-DE').format(res.data.debe)} </small>
											</div>
											<div class=" col-md-2 col-lg-2  align-items-right"> 
												<span  style="font-weight: bolder;margin-right:20px;">HABER</span>  <small  style="font-weight: bolder;">$${new Intl.NumberFormat('en-DE').format(res.data.haber)} </small>
											</div>
										
										
										</button>
									</div>
							</div>
							<div class="col-md-1 col-lg-1"  style="background-color: #f2f4f5  !important;">
								<button type="button" data-idcomp="${id}" data-id="${targetId}" style="float: right! important; background-color: #f2f4f5 !important;" class="btn conciliador"><i class="fa fa-check-circle-o fa-2x ${res.data.conciliado ? 'green' : ''}"></i></button>
							</div>
						</div>
						
						<div id="panelsStayOpen-collapse0_${id}_0-${id}" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-heading0_${id}_0-${id}">
							<div class="accordion-body body_comprobante"  data-id="${targetId}-${id}" data-idcomp="${id}">
						</div>`

				target.querySelector(`.accordion-item #created-${targetId - id}`).innerHTML += ls


				let btn = target.querySelector(`.accordion-item #created-${targetId - id} button.comprobante`);
				btn.addEventListener("click", getComprobante)

				let btn2 = target.querySelector(`.accordion-item #created-${targetId - id} button.conciliador`);
				btn2.addEventListener("click", conciliar)


			} else {
				comprobantesLoad(res.data, targetId)
			}

		})
		.catch((err) => {

		});
}


const preConciliar = (e) => {
	let id = document.querySelector('#modalmatch div.accordion-item.mov').dataset.id
	let total = document.querySelector('#modalmatch div.accordion-item.mov').dataset.total
	let target = document.querySelector(`#list div.accordion-item.mov[data-id="${id}"]`)
	let icon = target.querySelector('div.icon-estado i')
	let info = target.querySelector('div.estado span')
	let totalJustify = 0
	let postIds = ''
	let ids = []
	let preIds = []
	let create_comp = false
	let cuenta = ''
	let ref = ''
	let masivo = true
	let force = true

	let chk = document.querySelectorAll('#modalmatch .form-check-input:checked');
	chk.forEach(n => {
		preIds.push(n.dataset.idcomp)
		totalJustify += parseFloat(n.dataset.total)
	})


	postIds = preIds.join("|")
	let dif = Math.abs(total - totalJustify)
	if (dif < 2) {

		ids.push({
			id,
			'idmovsys': postIds,
			'sid': sid(),
			'typemov': 'comprobante',
			conciliar: true,
			create_comp,
			cuenta,
			ref,
			masivo,
			force
		});
		setJustify(ids, "conciliar")
			.then((res) => {
				if (res.data[0].success) {
					if (res.data[0].conciliado) {
						document.querySelectorAll('#modal-list .accordion-body .accordion-item').forEach((item) => {
							const checkbox = item.querySelector('input.form-check-input.check-comp');

							if (checkbox && checkbox.checked) {
								const dataTotal = checkbox.getAttribute('data-total');
								const dataIdComp = checkbox.getAttribute('data-idcomp');
								const dataId = checkbox.getAttribute('data-id');

								const parent = checkbox.parentNode;

								const newButton = document.createElement('button');
								newButton.setAttribute('type', 'button');
								newButton.setAttribute('data-total', dataTotal);
								newButton.setAttribute('data-idcomp', dataIdComp);
								newButton.setAttribute('data-id', dataId);
								newButton.setAttribute('style', 'float: right! important; background-color: #f2f4f5 !important;');
								newButton.classList.add('btn', 'conciliador');
								newButton.innerHTML = '<i class="other fa fa-check-circle fa-2x green"></i>';

								parent.replaceChild(newButton, checkbox);


								target.querySelector('.accordion').appendChild(item);

								newButton.addEventListener("click", conciliar);

								console.log('Input reemplazado por botoon y item movidod:', newButton);
							}
						});



						btnClose.click();

						if (chk.length == 1 && target.querySelector(`div.accordion-item button[data-idcomp="${postIds.replaceAll('|', '')}"].conciliador`) != null)
							target.querySelector(`div.accordion-item button[data-idcomp="${postIds.replaceAll('|', '')}"].conciliador i`).classList.add("green")

						target.classList.remove('red', 'blue')
						target.classList.add('purple')

						info.classList.remove('red', 'blue')
						info.classList.add('purple')
						info.textContent = 'CONCILIADO'

						icon.classList.remove('red', 'blue', 'fa-list')
						icon.classList.add('purple', 'fa-check-square')

						target.querySelectorAll('button.find-seat').forEach(b => { b.classList.add('conciliado'); b.setAttribute("disabled", '') })

						alertObj.msg = 'Conciliado con exito!!!';



						// if(idmovsys==0)
						// 	getComprobante(res.data[0].idcom,id)


					} else {
						btnClose.click();

						if (chk.length == 1 && target.querySelector(`div.accordion-item button[data-idcomp="${postIds.replaceAll('|', '')}"].conciliador`) != null)
							target.querySelector(`div.accordion-item button[data-idcomp="${postIds.replaceAll('|', '')}"].conciliador i`).classList.remove("green")

						target.classList.remove('purple')
						target.classList.add('blue')

						info.classList.remove('purple')
						info.classList.add('blue')
						info.textContent = 'DESCONCILIADO'


						icon.classList.remove('purple', 'fa-check-square')
						icon.classList.add('blue', 'fa-list')

						target.querySelectorAll('button.find-seat').forEach(b => { b.classList.remove('conciliado'); b.removeAttribute("disabled") })

						alertObj.msg = 'Desconciliado con exito!!!';
					}
					alertObj.type = 'success';
				} else {
					alertObj.type = 'danger';
					alertObj.msg = res.data[0].errorMsg;
				}

				alertLoad(alertObj, 'alertas');

			})
			.catch((err) => {
				alertObj.type = 'danger';
				alertObj.msg = 'Hubo un error, favor comunicarse con soporte.'
				console.log('Error: ', err)
				alertLoad(alertObj, 'alertas');
			});
	} else {
		alertObj.type = 'danger';
		alertObj.msg = 'El total de los comprobantes seleccionados debe ser igual al total del movimiento.'
		alertLoad(alertObj, 'alertas-modal');
	}
}


const disable = (e) => {

	let respuesta = confirm("¿Estás seguro?");
	if (respuesta) {
		let id = e.dataset.id

		let ids = []

		ids.push({
			id,
			'sid': sid(),
			'disable': true
		});

		setJustify(ids, "disable")
			.then((res) => {
				document.querySelector(`div[data-id="${id}"]`).style.display = "none";
				alertObj.msg = 'Deshabilitado con exito!!!';
			});
	}


}

const conciliar = (e) => {

	let id = e.currentTarget.dataset.id
	let target = document.querySelector(`div.accordion-item.mov[data-id="${id}"]`)
	let icon = target.querySelector('div.icon-estado i')
	let info = target.querySelector('div.estado span')
	let sel = target.querySelector("#tipo_asiento");
	let sel_tipo = sel.options[sel.selectedIndex].text
	let idmovsys = e.currentTarget.dataset.idcomp
	let ids = []
	let conciliar = true
	let create_comp = false
	let cuenta = ''
	let ref = ''
	let cuentas_conciliar = []
	let conditionMet = true; // Asumimos que se cumple la condición

	//Verificar si esta cuadrado los asientos
	let btn = e.target
	if (btn.classList.contains('conciliador')) {
		let totalDebe = target.querySelectorAll('div.row-totales')[0].children[5].querySelector('span').textContent.replace('.', '')
		let totalHaber = target.querySelectorAll('div.row-totales')[0].children[6].querySelector('span').textContent.replace('.', '')
		// Convierte las cadenas a números
		let numDebe = Number(totalDebe);
		let numHaber = Number(totalHaber);

		// Comprueba si los números son diferentes y muestra una alerta en caso afirmativo
		if (numDebe !== numHaber) {
			alertObj.type = 'danger';
			alertObj.msg = 'No se puede conciliar debido a que existe diferencias entre el total de asientos.'
			alertLoad(alertObj, 'alertas');
			return
		}

	}


	if (typeof idmovsys == 'undefined')
		idmovsys = 0

	if (e.target.classList.contains("green") != false)
		conciliar = false

	if (e.target.classList.contains("create"))
		create_comp = true

	// Obtener información de contactos asignados y mapearla a las cuentas
	let contactos = [];
	const contactoContainers = target.querySelectorAll('.contacto-cell');

	contactoContainers.forEach((container, index) => {
		const contactId = container.getAttribute('data-idcont');

		if (contactId && contactId.trim() !== '') {
			// Obtener nombre y RUT del contacto
			const rutSpan = container.querySelector('span[name*="auxiliar_rut"]');
			const nombreSpan = container.querySelector('span[name*="auxiliar_desc"]');

			contactos.push({
				id: contactId,
				nombre: nombreSpan ? nombreSpan.textContent : '',
				rut: rutSpan ? rutSpan.textContent : ''
			});
		}
	});

	// Validar que haya al menos un contacto asignado antes de proceder
	if (create_comp) {
		if (contactos.length === 0) {
			alertObj.type = 'danger';
			alertObj.msg = 'Debe asignar al menos un contacto antes de poder crear y conciliar.';
			alertLoad(alertObj, 'alertas');
			return;
		}
	}

	if (create_comp) {
		ref = target.querySelector('div textarea.ref').value
		cuenta = target.querySelector('div input.num-account').value.trim()

		if (target.querySelectorAll('div input.num-account').length > 0) {

			let size = target.querySelector('div.accordion-main-' + id).children.length - 2
			for (let i = 2; i < size; i++) {
				
				let cuenta = target.querySelectorAll('div.accordion-main-' + id)[0].children[i].children[2].querySelector('input').value
				let glosa = target.querySelectorAll('div.accordion-main-' + id)[0].children[i].children[4].querySelector('input').value
				let debe = target.querySelectorAll('div.accordion-main-' + id)[0].children[i].children[5].querySelector('input').value
				let haber = target.querySelectorAll('div.accordion-main-' + id)[0].children[i].children[6].querySelector('input').value
				const ccSel = target.querySelectorAll(`.accordion-main-${id} select.centro_costo`)[i - 2];
				const centroCosto = ccSel?.tomselect ? ccSel.tomselect.getValue() : (ccSel?.value || "");

				// Obtener el contacto correspondiente a esta fila (por índice)
				let contactoInfo = null;
				const contactoCell = contactoContainers[i - 2];
				if (contactoCell) {
					const contactId = contactoCell.getAttribute('data-idcont');
					if (contactId && contactId.trim() !== '') {
						const rutSpan = contactoCell.querySelector('span[name*="auxiliar_rut"]');
						const nombreSpan = contactoCell.querySelector('span[name*="auxiliar_desc"]');
						contactoInfo = {
							id: contactId,
							nombre: nombreSpan ? nombreSpan.textContent : '',
							rut: rutSpan ? rutSpan.textContent : ''
						};
					}
				}

				// Crear el objeto de cuenta con información del contacto
				let cuentaObj = { cuenta, debe, haber };
				cuentaObj.glosa = glosa;
				cuentaObj.centro_costo = centroCosto;
				if (contactoInfo) {
					cuentaObj.idAuxiliar = contactoInfo.id;
					cuentaObj.idDocumento = 0;
					cuentaObj.tipoDocumento = 'dtv';
					cuentaObj.auxiliar_rut = contactoInfo.rut;
					cuentaObj.auxiliar_desc = contactoInfo.nombre;

				}

				cuentas_conciliar.push(cuentaObj)
			}

			let msgError = '';

			// Verificar cada objeto en el array cuentas_conciliar
			for (let i = 0; i < cuentas_conciliar.length; i++) {
				let cuenta = cuentas_conciliar[i].cuenta;
				let debe = Number(cuentas_conciliar[i].debe.replace(/[.,]/g, ''));
				let haber = Number(cuentas_conciliar[i].haber.replace(/[.,]/g, ''));

				// Verificar si cuenta no está vacía
				if (cuenta.trim() == "") {
					msgError = 'Debes seleccionar una cuenta!.';
					conditionMet = false; // Si la condición no se cumple, cambiamos la variable a false
					break; // Salir del bucle si se encuentra un error
				}
				// Verificar si debe o haber son mayores que cero (solo uno de ellos)
				else if (!(debe > 0 ^ haber > 0)) {
					msgError = 'Debes agregar un valor en debe o haber!.';
					conditionMet = false; // Si la condición no se cumple, cambiamos la variable a false
					break; // Salir del bucle si se encuentra un error
				}
			}



			// target.querySelectorAll('div input.num-account').forEach(v => {
			// 	cuentas_conciliar.push({ cuenta: v.value })
			// })
		}
	}


	// Mostrar el mensaje de error si se encuentra alguna cuenta vacia

	if (!conditionMet) {
		alertObj.type = 'danger';
		alertObj.msg = 'Existen cuentas con campos vacios.'
		alertLoad(alertObj, 'alertas');
		return;
	}



	ids.push({
		id,
		idmovsys,
		'sid': sid(),
		'typemov': 'comprobante',
		conciliar,
		create_comp,
		cuenta,
		ref,
		sel_tipo,
		cuentas_conciliar
	});



	if ((cuenta != '' && create_comp) || (create_comp == false))
		setJustify(ids, "conciliar")
			.then((res) => {
				if (res.data[0].success) {
					if (res.data[0].conciliado) {

						if (create_comp == false)
							e.target.classList.add("green")

						target.classList.remove('red', 'blue')
						target.classList.add('purple')

						info.classList.remove('red', 'blue')
						info.classList.add('purple')
						info.textContent = 'CONCILIADO'

						icon.classList.remove('red', 'blue', 'fa-list')
						icon.classList.add('purple', 'fa-check-square')

						if (create_comp)
							target.querySelector('button.find-seat.create').click()

						target.querySelectorAll('button.find-seat').forEach(b => { b.classList.add('conciliado'); b.setAttribute("disabled", '') })

						// if(target.querySelector(`div.accordion-item button[data-idcomp="${id}"].conciliador`) != null)
						// 	target.querySelector(`div.accordion-item button[data-idcomp="${id}"].conciliador i`).classList.add("green")

						// Renderizar el comprobante directamente - el contacto ya se guardó en el backend
						if (idmovsys == 0) {
							getComprobante(res.data[0].idcom, id);
						}

						alertObj.msg = 'Conciliado con exito!!!';
					} else {

						e.target.classList.remove("green")

						target.classList.remove('purple')
						target.classList.add('blue')
						info.classList.remove('purple')
						info.classList.add('blue')
						icon.classList.remove('purple', 'fa-check-square')
						icon.classList.add('blue', 'fa-list')
						info.textContent = 'DESCONCILIADO'

						if (res.data[0].conciliado_bandeja) {

							target.querySelector(`.accordion-detail-${res.data[0].idcom}`).remove()
						}






						target.querySelectorAll('button.find-seat').forEach(b => { b.classList.remove('conciliado'); b.removeAttribute("disabled") })

						alertObj.msg = 'Desconciliado con exito!!!';
					}

					alertObj.type = 'success';
				} else {
					alertObj.type = 'danger';
					alertObj.msg = res.data[0].errorMsg;
				}

				alertLoad(alertObj, 'alertas');

			})
			.catch((err) => {
				alertObj.type = 'danger';
				alertObj.msg = 'Hubo un error, favor comunicarse con soporte.'
				console.log('Error: ', err)
				alertLoad(alertObj, 'alertas');
			});
	else {
		alertObj.type = 'danger';
		alertObj.msg = 'Debes seleccionar una cuenta para el asiento.'
		alertLoad(alertObj, 'alertas');
	}

}

const selectAccount = (e) => {
	const selectedOption = e.target.options[e.target.selectedIndex];
	const cuentaValue = selectedOption.value;
	const auxiliar = selectedOption.getAttribute('data-auxiliar') === 'true';

	// Actualizar el valor de la cuenta
	e.target.parentNode.previousElementSibling.querySelector('input').value = cuentaValue;

	// Encontrar la fila completa
	const row = e.target.closest('.row');

	// Buscar el botón de búsqueda de contacto en la misma fila
	const searchBtn = row.querySelector('.search-btn');

	if (searchBtn) {
		// Mostrar u ocultar el botón según el valor de auxiliar
		if (auxiliar && cuentaValue !== '') {
			searchBtn.style.display = 'inline-block';
		} else {
			searchBtn.style.display = 'none';
			// Limpiar el contacto si se oculta la lupa
			const contactoCell = searchBtn.closest('.contacto-cell');
			if (contactoCell) {
				contactoCell.setAttribute('data-idcont', '');
				contactoCell.innerHTML = `
					<button class="search-btn" data-type="auxiliar" data-id="${searchBtn.getAttribute('data-id')}" onClick="showDialogContact(this)" title="Buscar contacto" style="font-size: 12px; padding: 2px 4px; display: none;">
						<i class="fas fa-search"></i>
					</button>
				`;
			}
		}
	}
}

const findSeat = (e) => {
	actualizaTotalesAsiento(e)
	loadingLoad('loading-modal', true);
	eraseHtml('modal-list');
	let id = e.currentTarget.dataset.id
	let ids = [];

	ids.push({
		id
	});


	getMatch(ids, "find");


}


const importExcel = (frommodal = false) => {
	let file = document.getElementById('formFile')

	if (file.files.length > 0) {
		loadingLoadOnModal('loading-modal-2', true);
		document.getElementById('import-excel-modal').disabled = true
		importExcelBtn.disabled = true
		readXlsxFile(file.files[0]).then(function (data) {

			importCartola(data)
				.then(function (response) {
					if (response.data.success) {
						loadingLoadOnModal('loading-modal-2', false);
						document.getElementsByClassName('closeModal')[0].click()
						alertObj.type = 'success';
						alertObj.msg = 'Plantilla importada con exito!.'
						file.value = ''
						alertLoad(alertObj, 'alertas');

					}
				})
				.catch(function (error) {
					console.log(error);
				});
		})

	} else {

		if (frommodal) {
			document.getElementById('warning-modal').style.display = ''
			document.getElementById('warning-modal').innerHTML = 'Debes seleccionar un achivo excel para poder importarlo!'
			return;
		}
		var url = localStorage.getItem('node_url') + '/export-template-cartola/?&sid=' + sid() + '&hostname=' + window.location.origin;
		window.open(url).blur();
		alertObj.type = 'success';
		alertObj.msg = 'Plantilla exportada con exito!.'
		alertLoad(alertObj, 'alertas');

	}
}

const onChangeInputFile = (e) => {

	if (e.target.files.length > 0) {
		document.getElementById('warning-modal').style.display = 'none'
		document.getElementById('import-excel-modal').disabled = false
	}
}

const onCheckModalImport = (e) => {
	document.getElementById('import-excel-modal').disabled = false
	document.getElementById('formFile').value = ''
	importExcelBtn.disabled = false
}


const finderDiv = (event) => {
	let accordion_button;
	if (event.value === "") return;
	let h = event.value != undefined ? event.value : event.currentTarget.value;

	let main_accordion = document.querySelectorAll('#modal-list .accordion .accordion-body .accordion-item')
	for (let i = 2; i < main_accordion.length; i++) {
		accordion_button = main_accordion[i].querySelector('.accordion-button')
		if (accordion_button.children !== undefined) {
			let asiento = accordion_button.children[0].children[0].textContent
			let glosa = accordion_button.children[3].children[0].outerText
			let debe = accordion_button.children[5].children[1].outerText.replace('$', '')
			let haber = accordion_button.children[6].children[1].outerText.replace('$', '')
			let debe_dotless = debe.replace('.', '')
			let haber_dotless = haber.replace('.', '')
			if (asiento.split('#')[1].indexOf(h.toUpperCase()) > -1) {
				main_accordion[i].style.display = ''
			} else if (glosa.toUpperCase().indexOf(h.toUpperCase()) > -1) {
				main_accordion[i].style.display = ''
			} else if (debe.indexOf(h.toUpperCase()) > -1) {
				main_accordion[i].style.display = ''
			} else if (haber.indexOf(h.toUpperCase()) > -1) {
				main_accordion[i].style.display = ''
			} else if (debe_dotless.indexOf(h.toUpperCase()) > -1) {
				main_accordion[i].style.display = ''
			} else if (haber_dotless.indexOf(h.toUpperCase()) > -1) {
				main_accordion[i].style.display = ''
			} else {
				main_accordion[i].style.display = 'none'
			}


		}
	}

}

const formatNumber = (nStr) => {
	nStr += "";
	const x = nStr.split(".");
	let x1 = x[0];
	const x2 = x.length > 1 ? "." + x[1] : "";
	const rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, "$1" + "." + "$2");
	}
	return x1 + x2;
}

const formatNumber2 = (numberStr) => {
	let parts = [];
	while (numberStr.length) {
		let segment = numberStr.substr(-3); // Toma los últimos 3 caracteres
		parts.unshift(segment); // Agrega al inicio del arreglo
		numberStr = numberStr.slice(0, -3); // Actualiza la cadena
	}
	return parts.join('.');
}

const actualizaTotalesAsiento = (e) => {
	const target = e.target != undefined ? e.target : e
	let baseElement = target.parentNode.parentNode.parentNode;
	let totalDebe = baseElement.querySelector('.row-totales').children[5].querySelector('span');
	let totalHaber = baseElement.querySelector('.row-totales').children[6].querySelector('span');
	let rows = baseElement.querySelectorAll('div.row');
	let size = rows.length - 2;
	let totalsDebe = 0, totalsHaber = 0;

	let i_ = target.classList.contains('find-seat') ? 3 : 2

	for (let i = i_; i < size; i++) {
		// Validar que los elementos existan antes de acceder a sus propiedades
		let debeInput = rows[i].children[5]?.querySelector('input');
		let haberInput = rows[i].children[6]?.querySelector('input');

		if (!debeInput || !haberInput) {
			console.error('No se encontraron los inputs de debe/haber en la fila', i);
			continue;
		}

		let debe = debeInput.value.replaceAll('.', '');
		let haber = haberInput.value.replaceAll('.', '');
		totalsDebe += isNaN(debe) ? 0 : Number(debe);
		totalsHaber += isNaN(haber) ? 0 : Number(haber);
	}

	// Comprobar los valores y asignar colores
	if (totalsDebe < totalsHaber) {
		totalDebe.style.setProperty('color', 'red', 'important');
		totalHaber.style.setProperty('color', 'black', 'important');
	} else if (totalsHaber < totalsDebe) {
		totalHaber.style.setProperty('color', 'red', 'important');
		totalDebe.style.setProperty('color', 'black', 'important');
	} else {
		totalDebe.style.setProperty('color', 'black', 'important');
		totalHaber.style.setProperty('color', 'black', 'important');
	}

	// Formatear con separador de miles y asignar
	totalDebe.textContent = formatNumber2(String(totalsDebe));
	totalHaber.textContent = formatNumber2(String(totalsHaber));
}

const onInputCheckEmptyAndFormat = (event) => {
	const target = event.target != undefined ? event.target : event
	// Verificar si cuenta_select está vacío
	if (target.parentNode.parentNode.children[2].querySelector('input').value == '') {
		Toastify({
			text: 'Debes seleccionar una cuenta!.',
			duration: 3000,
			close: true,
			gravity: "top", // `top` or `bottom`
			position: 'right', // `left`, `center` or `right`
			backgroundColor: warning,
		}).showToast();

		// Limpiar el campo de entrada
		target.value = '';

		// Detener la ejecución de la función
		return;
	}

	// Continuar si cuenta_select no está vacío
	const onlyNumbers = target.value.replace(/\D/g, "");
	const formattedNumber = formatNumber(onlyNumbers);

	// Establecer el valor formateado en el input
	target.value = formattedNumber;
	actualizaTotalesAsiento(event);
}

const onEnterPressed = (event, el) => {
	if (event.key === "Enter") {
		console.log("Se presionó Enter");
		addAccount(event, 'add')
	}
};

const toComprobante = (event, el) => {
	event.preventDefault(); // Evitar el comportamiento por defecto del click en el enlace
	let id = el.getAttribute('data-id'); // Obtener el id
	let url = window.origin + "/4DACTION/wbienvenidos#comprobantes/content.shtml?id=" + id
	// Abrir la URL en una nueva pestaña
	window.open(url, '_blank');
}

const createSelectElement = (cuentas) => {
	const selectElement = document.createElement('select');

	// Crear y agregar la opción "Seleccionar cuenta" al inicio del select
	const defaultOptionElement = document.createElement('option');
	defaultOptionElement.value = '';
	defaultOptionElement.textContent = 'Seleccionar cuenta';
	selectElement.appendChild(defaultOptionElement);

	// Agrega las opciones al elemento select
	cuentas.forEach((val) => {
		const optionElement = document.createElement('option');
		optionElement.value = val.cuenta;
		optionElement.dataset.id = val.id;
		optionElement.textContent = val.cuenta + ' / ' + val.nombre;
		selectElement.appendChild(optionElement);
	});

	selectElement.addEventListener('change', (e) => {
		// Cuenta Contable cambia al escuchar cambiar Nombre cuenta
		const input = e.target.parentNode.parentNode.children[2].querySelector('input');
		input.value = e.target.options[e.target.selectedIndex].value;

		const selectedOptionIndex = e.target.selectedIndex;

		if (selectedOptionIndex !== 0) {
			defaultOptionElement.selected = false;
			defaultOptionElement.disabled = true;
		}
	});

	return selectElement;
}

const onBlurRestoreZero = (event) => {
	const target = event.target != undefined ? event.target : event
	if (target.value === '') {
		target.value = '0';
	}
}

const onFocusClearZero = (event) => {
	const target = event.target != undefined ? event.target : event
	if (target.value === '0') {
		target.value = '';
	}
}

const addAccount = (e, type) => {
	const target = e.target != undefined ? e.target : e
	let main_accordion = document.querySelector(`.accordion-main-${target.dataset.id}`)
	//let main_accordion = e.parentNode.parentNode.parentNode.parentNode
	let row = target.closest('.row')

	if (type === 'del') {
		if (main_accordion && row) {
			main_accordion.removeChild(row)
		} else {
			console.error('Cannot remove row - main_accordion or row is null');
		}
	}

	if (type === 'add') {
		// Verificar si hay alguna fila con campos vacios
		const size = main_accordion.children.length - 2;
		let conditionMet = true; // Asumimos que se cumple la condición
		let msgError = ''

		for (let i = 2; i < size; i++) {
			let input = main_accordion.children[i].children[2].querySelector('input'); // Cuenta Contable

			// Validar que los elementos existan antes de acceder a sus propiedades
			let debeInput = main_accordion.children[i].children[5]?.querySelector('input');
			let haberInput = main_accordion.children[i].children[6]?.querySelector('input');

			if (!debeInput || !haberInput) {
				console.error('No se encontraron los inputs de debe/haber en la fila', i);
				continue;
			}

			let debe = Number(debeInput.value.replace(/[.,]/g, '')); // Debe
			let haber = Number(haberInput.value.replace(/[.,]/g, '')); // Haber

			// Verificamos si input no está vacío
			if (input.value.trim() == "") {
				msgError = 'Debes seleccionar una cuenta!.'
				conditionMet = false; // Si la condición no se cumple, cambiamos la variable a false
				break; // Salir del bucle si se encuentra un error
			}
			// Verificamos si debe o haber son mayores que cero (solo uno de ellos)
			else if (!(debe > 0 ^ haber > 0)) {
				msgError = 'Debes agregar un valor en debe o haber!.'
				conditionMet = false; // Si la condición no se cumple, cambiamos la variable a false
				break; // Salir del bucle si se encuentra un error
			}
		}

		// Mostrar el mensaje de error si se encuentra uno
		if (!conditionMet) {
			// Aquí puedes manejar lo que sucede si la condición no se cumplió en alguna iteración
			Toastify({
				text: msgError,
				duration: 3000,
				close: true,
				gravity: "top", // `top` or `bottom`
				position: 'right', // `left`, `center` or `right`
				backgroundColor: "#FFAC38",
			}).showToast();
			return
		}
		//Verificar debe y haber
		const parseInteger = (input) => {
			const onlyNumbers = input.value.replace(/\D/g, '');
			const integerValue = parseInt(onlyNumbers, 10);
			return isNaN(integerValue) ? 0 : integerValue;
		}




		
		const cuenta = row.children[2].querySelector('input').value
		if (cuenta === '') {
			Toastify({
				text: 'Debes agregar un valor en debe o haber!.',
				duration: 3000,
				close: true,
				gravity: "top", // `top` or `bottom`
				position: 'right', // `left`, `center` or `right`
				backgroundColor: "#FFE5B3",
			}).showToast();

			return
		}


		const inputDebe = row.children[5].querySelector('input');
		const inputHaber = row.children[6].querySelector('input');

		const integerValueDebe = parseInteger(inputDebe);
		const integerValueHaber = parseInteger(inputHaber);

		if (integerValueDebe > 0 ^ integerValueHaber > 0) {
			//Clonar elemento
			let newElement = row.cloneNode(true);
			newElement.style.marginTop = '10px';

			resetCentroCostoInContainer(newElement);

			// Obtener las referencias a los elementos de entrada
			const inputs = Array.from(newElement.children)
				.filter((child, index) => [2, 5, 6].includes(index))
				.map(child => child.querySelector('input'));
			const selectInputs = inputs.slice(1);

			// Hacer editable y limpiar input
			inputs.forEach(input => {
				if (input) {
					input.readOnly = false;
					input.value = '0';
					input.onkeydown = null;
					input.oninput = null;
				}
			});

			//Formatear input
			selectInputs.forEach(input => {
				if (input) {
					input.addEventListener('focus', onFocusClearZero);
					input.addEventListener('blur', onBlurRestoreZero);
					input.addEventListener("input", onInputCheckEmptyAndFormat);
					input.addEventListener('keydown', onEnterPressed);
				}
			});

			// Habilitar elemento
			if (newElement.children[5]?.children[0]?.children[1]) {
				newElement.children[5].children[0].children[1].disabled = false;
			}

			//Limpiar select
			if (newElement.children[3]?.children) {
				while (newElement.children[3].children.length > 0) {
					newElement.children[3].children[0].remove();
				}
			}

			// Crea un nuevo elemento select
			const selectElement = createSelectElement(cuentas);
			// Nombre de cuenta
			if (newElement.children[3]) {
				newElement.children[3].appendChild(selectElement);
			}

			// Limpiar y resetear el contacto en la nueva fila
			const contactoCell = newElement.children[0]?.querySelector('.contacto-cell');
			if (contactoCell) {
				// Limpiar el ID del contacto
				contactoCell.setAttribute('data-idcont', '');

				// Limpiar los spans de información del contacto
				const rutSpan = contactoCell.querySelector('span[name*="auxiliar_rut"]');
				const nombreSpan = contactoCell.querySelector('span[name*="auxiliar_desc"]');
				if (rutSpan) rutSpan.textContent = '';
				if (nombreSpan) nombreSpan.textContent = '';

				// Generar un nuevo ID único para el botón de búsqueda
				const searchBtn = contactoCell.querySelector('.search-btn');
				if (searchBtn) {
					const currentId = searchBtn.getAttribute('data-id');
					// Extraer el prefijo (ej: "1093") y generar un nuevo sufijo único
					const parts = currentId.split('_');
					const prefix = parts[0];
					const newSuffix = Date.now(); // Usar timestamp para asegurar unicidad
					searchBtn.setAttribute('data-id', `${prefix}_${newSuffix}`);
				}
			}

			let settings = {
				sortField: {
					field: "text",
					direction: "asc"
				}
			};

			// Crea la instancia de TomSelect
			let ts = new TomSelect(selectElement, settings);

			if (row.nextElementSibling) {
				main_accordion.insertBefore(newElement, row.nextElementSibling);
			} else {
				main_accordion.appendChild(newElement);
			}

			// SIEMPRE inicializar centro_costo
			initCentroCostoSelects(newElement, true).catch(console.error);

			// Inicializa select de Centro Costo
			
			
			// Enfoca el elemento select
			ts.open();


		} else {

			alertObj.type = 'warning';
			alertObj.msg = 'Debes agregar un valor en debe o haber!.'
			alertLoad(alertObj, 'alertas');
		}

	}


}

const checkGroup = (e) => {
	e.stopPropagation();

	let target = e.currentTarget;
	let id = target.dataset.id;

	// Seleccionar el accordion-item con el data-id correspondiente
	const accItem = document.querySelector('.accordion-item[data-id-nomina="' + id + '"]');


	// Seleccionar todos los checkboxes dentro del accordion-item seleccionado
	const checkboxes = accItem.querySelectorAll('.form-switch .check-comp2');

	// Iterar sobre los checkboxes y cambiar su estado
	checkboxes.forEach(checkbox => {
		checkbox.checked = target.checked; // Cambiar el estado del checkbox
	});
};

const downloadInformeConciliacion = (e) => {
	const banco = document.getElementById('sel_banco').value;
	let fecha = document.getElementById('fecha').value;

	// Verificar que el banco esté seleccionado
	if (banco && (banco == '' || banco == 'none')) {
		alertObj.type = 'danger';
		alertObj.msg = 'Debes seleccionar un banco para poder descargar el informe de conciliación.';
		alertLoad(alertObj, 'alertas');
		return;
	}

	// Obtener el día actual
	const today = new Date();
	const currentDay = String(today.getDate()).padStart(2, '0'); // Asegurarse de que el día tenga 2 dígitos
	const currentMonth = String(today.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript son 0-indexed
	const currentYear = today.getFullYear();

	// Reformatear la fecha de yyyy-mm al formato dd-mm-yyyy
	let dateFrom, dateTo;
	if (fecha) {
		const [year, month] = fecha.split('-');

		// Primer día del mes
		dateFrom = `01-${month}-${year}`;

		// Último día del mes
		const lastDay = new Date(year, month, 0).getDate(); // Calcula el último día del mes
		dateTo = `${lastDay}-${month}-${year}`;
	}


	const node = localStorage.getItem('node_url')
	const url = `${node}/informe-conciliacion?cuenta_banco=${banco}&sid=${sid()}&hostname=${window.location.origin}&dateFrom=${dateFrom}&dateTo=${dateTo}`;
	window.open(url, '_blank');
}

const exportCartola = (e) => {
	const banco = document.getElementById('sel_banco').value;
	let fecha = document.getElementById('fecha').value;
	
	// Verificar que el banco esté seleccionado
	if (banco && (banco == '' || banco == 'none')) {
		alertObj.type = 'danger';
		alertObj.msg = 'Debes seleccionar un banco para poder descargar el informe de conciliación.';
		alertLoad(alertObj, 'alertas');
		return;
	}

	const node = localStorage.getItem('node_url')
	const url = `${node}/export-cartola?sid=${sid()}&hostname=${window.location.origin}&date=${fecha}&estado=TODOS&cuentabanco=${banco}`;
	window.open(url, '_blank');
}

const formatearNumero = (value) => {

	const decimals = parseInt(bandejaDtc.view_decimal)
	let number = parseFloat(value.replace(',', '.'));

	return number.toLocaleString('es-AR', { currency: 'ARS', minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}
//----------------------------------------------------------------
//----------------------------- INIT FUNCTION------------------------------
//----------------------------------------------------------------



(function init() {
	//-----------------------   VARIABLES   ----------------------------


	const reload = document.getElementById(`reload`);
	const colorSelectors = document.querySelectorAll('.colorSelector');
	const btnInformeConciliacion = document.getElementById('informe-conciliacion')
	const btnExportCartola = document.getElementById('export-cartola')

	let n, y, m, d;


	//-----------------------   Set html elements   ---------------------------------------------------


	//-----------set fecha

	n = new Date();
	//Año
	y = n.getFullYear();
	//Mes
	m = n.getMonth() + 1;
	//Día
	d = n.getDate();
	if (d < 10) d = '0' + d;
	if (m < 10) m = '0' + m;

	f.value = y + "-" + m;


	//----------- Set fecha filtro negocios modal-match

	let filtro = filtro_fecha.children[1];
	for (let i = y - 10; i <= y + 1; i++) {
		filtro.innerHTML += `<option value="${i}" id="${i}" ${i == y ? 'selected' : ''}>${i}</option>`;
	}



	//----------- Set fecha filtro frx modal-match


	let filtro_fx = filtro_fecha_fxr.children[1];
	for (let i = y - 10; i <= y + 1; i++) {
		filtro_fx.innerHTML += `<option value="${i}" id="${i}" ${i == y ? 'selected' : ''}>${i}</option>`;
	}

	//-----------------------   EVENTOS   ---------------------------------------------------------------

	select_banco.addEventListener("change", () => {
		getMovimientosBancarios(f.value, select_banco.value);
	});



	btnInformeConciliacion.addEventListener("click", downloadInformeConciliacion);

	btnExportCartola.addEventListener("click", exportCartola);


	//DATE
	f.addEventListener("change", () => getMovimientosBancarios(f.value, select_banco.value));


	//RELOAD
	//reload.addEventListener("click", () => SetReload(f.value));
	reload.addEventListener("click", () => getMovimientosBancarios(f.value, select_banco.value));

	//COLOR SELECTOR
	colorSelectors.forEach(c => c.addEventListener("click", (event) => colorSelector(event)));

	//BUTTONS ACTIONS
	bts.forEach(c => c.addEventListener("click", (event) => match(event)));


	justifyBtn.addEventListener("click", preConciliar);
	importExcelBtn.addEventListener("click", (e) => importExcel(false));
	importExcelBtnModal.addEventListener("click", (e) => importExcel(true));
	fileInput.addEventListener("change", (e) => onChangeInputFile(e));
	btnImportModal.addEventListener("click", (e) => onCheckModalImport(e));
	search_general.addEventListener("keyup", (ff) => finderDiv(ff));


	//-----------------------   Ejecutables   -----------------------------

	getBancos();




})();