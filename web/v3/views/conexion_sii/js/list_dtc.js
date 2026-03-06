
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
var table = document.getElementById("tables");
var justifymodal = document.getElementById("modal-oc-match");
var btnClose = document.getElementById('closemodal');
var modaltitle = document.getElementById('modaltitle');
var filtro_fecha = document.getElementById('div-fecha-neg');
var filtro_fecha_fxr = document.getElementById('div-fecha-fxr');

var badge_cont = document.getElementById('doc_cont');
var justifyBtn = document.getElementById('justify-btn');
justifyBtn.addEventListener("click", (event) => justify(event));

const finder = document.getElementById('searchDtc');
const reload = document.getElementById('reload');
const btnStop = document.getElementById('btnStop');
const pending = document.getElementById('pending');
const btnNull = document.getElementById('btnNull');
const btnNC = document.getElementById('btnNC');
const btn0OC = document.getElementById('btn0OC');
const btn1OCplus = document.getElementById('btn1OCplus');
const btn1OC = document.getElementById('btn1OC');
const search_general = document.getElementById('search-general');
let xmlListAttach = []

function resetInputs(state) {
	finder.disabled = state
	reload.disabled = state
	btnStop.disabled = state
	pending.disabled = state
	btnNull.disabled = state
	btnNC.disabled = state
	btn0OC.disabled = state
	btn1OCplus.disabled = state
	btn1OC.disabled = state
}

//----------------------------------------------------------------
//----------------------- General Functions section --------------
//----------------------------------------------------------------

const downloadPDF = (obj) => {
	const id = obj.attributes.id.value;
	const folio = obj.attributes.folio.value;


	downloadPDFDTC(id, folio)


}

const downloadXML = async (obj) => {

	const event = obj
	const attachment = event.dataset.attachment
	const folio = event.dataset.folio

	const integrations = await axios.get(`${location.origin}/4DACTION/_integrations_getData?id=3`, {});


	const apiKey = integrations.data.rows[0].token2

	const createUserResponse = await axios.get(`https://api.syncfy.com/v1/users?api_key=${apiKey}`);
	const userId = createUserResponse.data.response[1].id_user;

	const sessionResponse = await axios.post(`https://api.syncfy.com/v1/sessions?api_key=${apiKey}`, {
		id_user: userId
	}, {
		headers: {
			'Content-Type': 'application/json'
		}
	});

	const sessionToken = sessionResponse.data.response.token;


	const response = await axios.get(`https://api.syncfy.com/v1/attachments/${attachment}`, {
		headers: {
			'Authorization': `Bearer ${sessionToken}`
		}
	});

	// Suponiendo que `response.data` contiene el contenido del XML
	const xmlContent = response.data;

	// Crear un elemento de enlace
	const downloadLink = document.createElement('a');

	// Configurar el contenido y el nombre del archivo
	const blob = new Blob([xmlContent], { type: 'application/xml' });
	const url = URL.createObjectURL(blob);
	downloadLink.href = url;
	downloadLink.download = folio + '.xml';

	// Agregar el enlace al documento y hacer clic en él
	document.body.appendChild(downloadLink);
	downloadLink.click();

	// Limpiar
	document.body.removeChild(downloadLink);
	URL.revokeObjectURL(url);

	console.log(response)


}

const switchProcess = (status, block_e = true) => {

	let inputs = []
	let selectors = []
	if (block_e) {
		inputs = justifymodal.querySelectorAll('input');
		selectors = justifymodal.querySelectorAll('select');
	}

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


const uploadFile = async (obj, xml = false) => {

	const formData = new FormData();
	//formData.append('pdfFile', e.files[0]);input-file-attach
	formData.append('file', xml ? obj.file : document.getElementById('input-file-attach').files[0]);
	formData.append('filename', `${obj.tipo_doc} ${obj.folio_doc}`);
	formData.append('index', xml ? 'DTC_XML|' + obj.iddoc : 'Doc_Tributario_Compra|' + obj.iddoc);


	// const response = await axios.post(location.origin + '/4DACTION/_V3_setUpload', formData , {
	// 	headers: {
	// 		'Content-Type': 'application/json'
	// 	}
	//   });

	$.ajax({
		url: location.origin + '/4DACTION/_V3_setUpload',
		type: 'POST',
		contentType: false,
		data: formData,
		dataType: 'json',
		processData: false,
		cache: false,
		success: function (data) {
			alertObj.type = 'success';
			alertObj.msg = 'Adjunto cargado con exito.';
			alertLoad(alertObj, 'alertas');
		},
		error: function (xhr, text, error) {
			alertObj.msg = 'El archivo adjunto no se pudo cargar, favor comunicarse con soporte.';
			alertObj.type = 'danger';
			alertLoad(alertObj, 'alertas');
		}

	});


}

const fetchUserSession = async () => {
	const integrations = await axios.get(`${location.origin}/4DACTION/_integrations_getData?id=3`);
	const apiKey = integrations.data.rows[0].token2;

	const createUserResponse = await axios.get(`https://api.syncfy.com/v1/users?api_key=${apiKey}`);
	const userId = createUserResponse.data.response[1].id_user;

	const sessionResponse = await axios.post(`https://api.syncfy.com/v1/sessions?api_key=${apiKey}`, { id_user: userId }, {
		headers: { 'Content-Type': 'application/json' }
	});

	return {
		apiKey,
		sessionToken: sessionResponse.data.response.token
	};
};

const fetchXmlContent = async (attachmentId, token) => {
	const response = await axios.get(`https://api.syncfy.com/v1/attachments/${attachmentId}`, {
		headers: { 'Authorization': `Bearer ${token}` }
	});
	return response.data;
};

const uploadXml = async (obj) => {
	if (obj.length > 0 && xmlListAttach.length > 0) {
		let listFiles = [];

		for (const e of xmlListAttach) {
			for (const f of obj) {
				if (e.folio === f.folio_doc) {
					try {
						const { apiKey, sessionToken } = await fetchUserSession();

						const xmlContent = await fetchXmlContent(e.id_attachment, sessionToken);

						// Crear un Blob con tu XML, especificando el tipo MIME correcto
						const blob = new Blob([xmlContent], { type: 'text/xml' });
						const file = new File([blob], "nombre_del_archivo.xml", { type: 'text/xml' });
						listFiles.push({ ...f, file });
					} catch (error) {
						console.error("Error fetching data: ", error);
					}
				}
			}
		}

		listFiles.forEach(f => uploadFile(f, true));
	}
};

const justify = () => {

	let errorMsg = "";
	let color = localStorage.getItem('colorCheck');
	let pendingColor = localStorage.getItem('pendingColorCheck')
	let ids = [];
	if ((document.getElementById('input-file-attach').files.length > 0 && document.getElementById('input-file-attach').files.length.type != 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') || (document.getElementById('input-file-attach').files.length == 0)) {



		if (pendingColor != "" && color == "orange")
			color = pendingColor

		switchProcess(true);

		let checkModalChecked = justifymodal.querySelectorAll('input.form-check-input:checked');
		if (checkModalChecked.length == 0)
			errorMsg = 'Ojo!!!, no has seleccionado nada aun.';


		let col = 0;
		switch (color) {
			case 'green':

				col = 9;
				break;
			case 'blue':
				col = 9;
				if (checkModalChecked.length > 1)
					errorMsg = 'Debes Seleccionar solo una opción. <br>';

				break;

			case 'red':
				col = 14;
				break;
			case 'yellow':
				col = 9;
				break;

			case 'grey-justify':
				col = 8;
				break;
			default:
				col = 8;
				break;
		}


		if (checkModalChecked.length > 1 && pendingColor == "blue")
			errorMsg += `Debes Seleccionar solo una opción. <br>`;



		if (errorMsg == '' && color != "yelllow") {

			tr = justifymodal.getElementsByClassName("lielement");


			let checked = 0;
			let typedoc = ''
			let iddoc, llave, list, idnegoc, opList, selection, fecha, fecha_recepcion, iddtc;

			llave = ""

			for (i = 0; i < tr.length; i++) {
				td = tr[i].getElementsByTagName("div")[col]?.getElementsByTagName('input')[0];
				if (td && td.checked) {
					checked++;

					if (color == 'red') {

						typedoc = tr[i].dataset?.type
						selection = tr[i].getElementsByTagName("div")[8]?.getElementsByTagName('input')[0].value;
						iddoc = tr[i].getElementsByTagName("div")[8]?.getElementsByTagName('input')[0].attributes.iddoc.value;
						if (selection != '') {
							list = tr[i].getElementsByTagName("div")[8]?.getElementsByTagName('input')[0].attributes.list.value;
							opList = document.getElementById(list).querySelectorAll('option');
							opList.forEach(e => {
								if (e.value == selection)
									idnegoc = e.attributes.id.value;
							});


						} else {
							errorMsg += `Debes Seleccionar el negocio del documento ${i + 1} del listado. <br>`;
						}

						selection = tr[i].getElementsByTagName("div")[10]?.getElementsByTagName('input')[0].value;
						if (selection != '') {
							list = tr[i].getElementsByTagName("div")[10]?.getElementsByTagName('input')[0].attributes.list.value;
							opList = document.getElementById(list).querySelectorAll('option');



							opList.forEach(e => {
								if (e.value == selection)
									llave = e.attributes.id.value;
							});


						} else {
							errorMsg += `Debes Seleccionar el Item del documento ${i + 1} del listado. <br>`;
						}

						fecha = tr[i].getElementsByTagName("div")[12]?.getElementsByTagName('input')[0].value.split('-').reverse().join('-');

						fecha_recepcion = tr[i].getElementsByTagName("div")[13]?.getElementsByTagName('input')[0].value.split('-').reverse().join('-');


					} else if (color == 'green' || color == 'blue' || color == 'yellow') {


						iddoc = tr[i].getElementsByTagName("div")[6]?.getElementsByTagName('select')[0].attributes.idelement2.value;
						idnegoc = tr[i].getElementsByTagName("div")[6]?.getElementsByTagName('select')[0].attributes.idelement.value;
						llave = tr[i].getElementsByTagName("div")[6]?.getElementsByTagName('select')[0];
						llave = llave.options[llave.selectedIndex].attributes.id.value;
						fecha = "";
						fecha_recepcion = tr[i].getElementsByTagName("div")[8]?.getElementsByTagName('input')[0].value.split('-').reverse().join('-');



					} else if (color == 'aqua') {


						iddoc = tr[i].getElementsByTagName("div")[6]?.getElementsByTagName('input')[0].dataset.iddoc
						iddtc = tr[i].getElementsByTagName("div")[6]?.getElementsByTagName('input')[0].dataset.iddtc
						fecha = "";
						fecha_recepcion = tr[i].getElementsByTagName("div")[6]?.getElementsByTagName('input')[0].value.split('-').reverse().join('-');



					} else if (color == 'grey-justify') {

						typedoc = tr[i].dataset?.type
						iddoc = tr[i].getElementsByTagName("div")[6]?.getElementsByTagName('input')[0].dataset.iddoc;
						iddtc = tr[i].getElementsByTagName("div")[6]?.getElementsByTagName('input')[0].dataset.iddtc;
						//idnegoc = tr[i].getElementsByTagName("div")[6]?.getElementsByTagName('select')[0].attributes.idelement.value;
						//llave = tr[i].getElementsByTagName("div")[6]?.getElementsByTagName('select')[0];
						//llave = llave.options[llave.selectedIndex].attributes.id.value;
						fecha = "";

						fecha_recepcion = tr[i].getElementsByTagName("div")[7]?.getElementsByTagName('input')[0].value.split('-').reverse().join('-');



					}

					if (typedoc == "gg" && (typeof llave == "undefined" || llave == ""))
						errorMsg = `Debes Seleccionar el Item del documento ${i + 1} del listado. <br>`;
					if (errorMsg == '' && color != 'yellow') {
						if (color === 'grey-justify') {

							ids.push({
								'iddoc': iddoc,
								'iddtc': iddtc,
								'fecha': fecha,
								'type': color,
								'typedoc': typedoc,
								'fecha_recepcion': fecha_recepcion,
								'sid': sid()
							});
						} else if (color === 'aqua') {
							ids.push({
								'iddoc': iddoc,
								'iddtc': iddtc,
								'fecha': fecha,
								'type': color,
								'typedoc': typedoc,
								'fecha_recepcion': fecha_recepcion,
								'sid': sid()
							});
						} else {
							ids.push({
								'iddoc': iddoc,
								'idnegoc': idnegoc,
								'llaveitem': llave,
								'fecha': fecha,
								'type': color,
								'typedoc': typedoc,
								'fecha_recepcion': fecha_recepcion,
								'sid': sid()
							});
						}
					} else {

						if (errorMsg == '') {


							let trListDoc = document.querySelectorAll('tbody input.form-check-input.match:checked');

							if (trListDoc.length == 1) {
								trListDoc.forEach(e => {




									ids.push({
										'iddoc': e.id,
										'idnegoc': idnegoc,
										'llaveitem': llave,
										'fecha': fecha,
										'typedoc': "neg",
										'type': color,
										'fecha_recepcion': fecha_recepcion,
										'sid': sid()
									});



								});
							} else {
								errorMsg = 'Solo puede seleccionar una rendición'

							}






						}
					}
				}
			}
		}

	} else {
		errorMsg = 'Formato de archivo no permitido.'
	}




	//PROCESO DE JUSTIFICACIÓN

	if (errorMsg != '') {

		switchProcess(false);
		alertObj.msg = errorMsg.replaceAll('<br>', '\n');
		alertObj.type = 'danger';
		alertLoad(alertObj, 'alertas-modal');
	} else {


		setJustify(ids, color)
			.then(res => {
				if (xmlListAttach.length > 0) {
					uploadXml(res.data)
				}

				if (document.getElementById('input-file-attach').files.length > 0)
					uploadFile(res.data[0]);
				switchProcess(false);
				if (res.data[0].success) {
					btnClose.click();

					alertObj.type = 'success';
					alertObj.msg = 'Justificado con exito!!!';
					getDocumentosXRevisar(f.value);
				} else {
					alertObj.type = 'danger';
					alertObj.msg = res.data[0].errorMsg.replaceAll('SL', '\n');
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
			modaltitle.textContent = 'Selecciona un gasto :';
			justifyBtn.textContent = 'Justificar';
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
			modaltitle.textContent = 'Gastos coincidentes:';
			justifyBtn.textContent = 'Justificar';
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
			filtro_fecha_fxr.getElementsByTagName('label')[0].textContent = 'Filtrar gastos por año:'
			modaltitle.textContent = 'Asignar pendientes:';
			justifyBtn.textContent = 'Justificar gasto';

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
		case 'grey-justify':
			filtro_fecha_fxr.getElementsByTagName('label')[0].textContent = 'Filtrar gastos por año:'
			modaltitle.textContent = 'Asignar pendientes:';
			justifyBtn.textContent = 'Justificar gasto';
			justifyBtn.style.backgroundColor = "#c2c5c3";

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
		case 'aqua':
			modaltitle.textContent = 'Documentos coincidentes:';
			filtro_fecha_fxr.style.display = 'none';
			if (massive) {
				checkMassive.style.display = "none";
				checkMassive.checked = false;
			}
		default:
			filtro_fecha_fxr.style.display = 'none';
			if (massive) {
				checkMassive.style.display = "none";
				checkMassive.checked = false;
			}

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

const findClasification = (obj, manual) => {
	const dl = document.getElementById(obj.target.attributes.list.value);

	if (obj.keyCode === 13) {

		loadingLoad('loading-modal', true, 'Buscando clasificación...');
		dl.innerHTML = '';
		switchProcess(true, false)
		getClasification()
			.then(res => {
				let superrow = '';
				res.data.rows.forEach(val => {
					superrow += `<option value="${val.des}" id="${val.id}" data-type="gg"></option>`;

				})

				dl.innerHTML = superrow;
				superrow = "";
				obj.target.click();
				switchProcess(false, false)

				loadingLoad('loading-modal', false);

			});
	}
}

const findItemByCatalogo = (obj, manual) => {
	const value = obj.currentTarget.value.toLowerCase();
	const dli = document.getElementById(`il${obj.target.attributes.iddoc.value}`);
	if (obj.keyCode === 13) {
		loadingLoad('loading-modal', true, 'Buscando items...');
		switchProcess(true, false)
		getItemByCatalogo(value, filtro_fecha.children[1].value)
			.then(res => {
				if (res.data.rows.length > 0) {

					let superrow = '';
					res.data.rows.forEach(res_e => {


						superrow += `<option value="${res_e.text}" id="${res_e.id}"></option>`;




					});
					dli.innerHTML = superrow;

				}
				loadingLoad('loading-modal', false);
				switchProcess(false, false)
			});
	}


}

const SetReload = (date) => {
	loadingLoad('loading', true);
	eraseHtml('tables');
	eraseHtml('msg');
	verifyChecked();
	getSiiDtc(date)
		.then(res => {
			loadingLoad('loading', false);
			getDocumentosXRevisar(f.value);
		});
}


// Requiere: variables globales `table` y `bts` (NodeList/Array de botones)
const verifyChecked = (massive = false) => {
	if (!table || !bts) return;

	// 1) Contar seleccionados (primer <td> con <input type="checkbox"> marcado)
	const selectedCount = (() => {
		let n = 0;
		const rows = table.getElementsByTagName('tr');
		for (let i = 0; i < rows.length; i++) {
			const td0 = rows[i].getElementsByTagName('td')[0];
			const input = td0?.getElementsByTagName('input')[0];
			if (input?.checked) n++;
		}
		return n;
	})();

	const selectedCountTotalZero = (() => {
		let n = 0;
		const rows = table.getElementsByTagName('tr');
		for (let i = 1; i < rows.length; i++) {
			const td0 = rows[i].getElementsByTagName('td')[0];
			const input = td0?.getElementsByTagName('input')[0];
			const size = rows[i].getElementsByTagName('td').length - 2
			const total = rows[i].getElementsByTagName('td')[size]?.textContent.replace('$', '').trim();
			if (input?.checked && total == '0') {
				n++;
			}
		}
		return n;
	})();

	// 2) Helpers de visibilidad y clases
	const show = (el) => (el.style.display = '');
	const hide = (el) => (el.style.display = 'none');
	const has = (el, cls) => el.classList.contains(cls);

	// 3) Sin selección → limpiar (si corresponde) y ocultar todo
	if (selectedCount === 0) {
		if (!massive) {
			localStorage.setItem('colorCheck', '');
			localStorage.setItem('pendingColorCheck', '');
		}
		bts.forEach(hide);
		return;
	}

	// 4) Con selección → calcular color efectivo y reglas
	const storedColor = localStorage.getItem('colorCheck') || '';
	const pending = localStorage.getItem('pendingColorCheck') || '';
	// regla original: si colorCheck === "orange" usar pendingColorCheck como efectivo
	const color = storedColor === 'orange' ? pending : storedColor;

	// 5) Evaluar cada botón
	bts.forEach((btn) => {

		// Si no cae en ninguna regla, queda oculto (estado por defecto).
		if (selectedCountTotalZero === 1 && selectedCount === 1) {
			if (btn.classList.contains('lightgreen')) {
				
				show(btn);
				return
			} else {
				hide(btn);
				return
			}
		}

		// Por defecto, oculto:
		hide(btn);

		// Regla de anulación global: si hay pending != "" y el botón es 'red' → siempre oculto
		if (pending !== '' && has(btn, 'red')) {
			return;
		}

		// A) Botón cuyo color coincide con el color efectivo → mostrar
		if (has(btn, color)) {
			show(btn);
			return; // ya se resolvió este botón
		}

		// B) Reglas adicionales por tipo de botón (mismo comportamiento que tu código):
		// - grey visible cuando color == 'grey'
		if (has(btn, 'grey') && color === 'grey') {
			show(btn);
			return;
		}

		// - aqua visible cuando color == 'aqua'
		if (has(btn, 'aqua') && color === 'aqua') {
			show(btn);
			return;
		}

		// - red visible cuando color == 'blue'
		if (has(btn, 'red') && color === 'blue') {
			show(btn);
			return;
		}

		// - black visible solo si NO hay pending
		if (has(btn, 'black') && pending === '') {
			show(btn);
			return;
		}

		// - yellow (Justificar gasto): mismas condiciones agregadas que tenías,
		//   consolidadas para evitar duplicación:
		//     * oculto si hay más de 1 seleccionado
		//     * oculto si color ∈ {green, grey, aqua, blue, black}
		//     * visible en los demás casos (incluye 'red', 'orange'⇒pending ya aplicado, etc.)
		if (has(btn, 'yellow')) {
			const notAllowed = new Set(['green', 'grey', 'aqua', 'blue', 'black']);
			if (selectedCount === 1 && !notAllowed.has(color)) {
				show(btn);
			} else {
				hide(btn);
			}
			return;
		}


	});
};


const verifyModalCheck = (e) => {

	let col = 9;



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
			alertObj.msg = 'Debes seleccionar solo un gasto.';

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

	document.querySelector('#colorSelector').value = h


	tr = table.getElementsByTagName("tr");

	for (i = 0; i < tr.length; i++) {
		td = tr[i].getElementsByTagName("td")[0]?.getElementsByTagName('input')[0];


		if (td) {
			colorValue = td.attributes.colorselector.value;
			pendingColorValue = td.attributes.pendingcolorselector.value;

			if (colorValue.toUpperCase().indexOf(h.toUpperCase()) > -1) {


				if (colorValue != 'blue' && colorValue != 'orange' && h.toUpperCase() != 'CANCEL' && colorValue != 'grey' && colorValue != 'black') {
					td.checked = true;
					localStorage.setItem('colorCheck', colorValue);
					localStorage.setItem('pendingColorCheck', pendingColorValue)

				} else {
					//	switchDisplay(false,'grey')
					td.checked = false;
				}


				tr[i].style.display = "";
				cont++;


			} else if (h.toUpperCase() == 'CANCEL') {
				td.checked = false;
				tr[i].style.display = "";

			} else {

				td.checked = false;
				tr[i].style.display = "none";
			}

		}
	}


	if (h.toUpperCase() == 'CANCEL') {
		switchDisplay(false, 'grey')
		switchDisplay(false, 'black')
		switchDisplay(false, 'orange')
		switchDisplay(false, 'aqua')
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

const verifyCheck = (e) => {

	const colorValue = e.currentTarget.attributes.colorselector.value;
	const pendingColorValue = e.currentTarget.attributes.pendingcolorselector.value;
	let res = true;

	// const trElement = e.target.parentNode.parentNode.parentNode;

	// if (trElement && trElement.querySelectorAll('td').length > 5) {
	// 	const tipo = trElement.querySelectorAll('td')[5].textContent.trim();
	// 	if (tipo === 'NOTA DE DEBITO ELECTRONICA') {
	// 		const ndeElement = document.querySelector('.nde');

	// 		if (ndeElement) {

	// 			const currentDisplay = ndeElement.style.display;
	// 			ndeElement.style.display = currentDisplay === 'none' ? '' : 'none';
	// 			localStorage.setItem('colorCheck', 'nde');
	// 			return
	// 		}
	// 	}
	// }


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

				case 'aqua':
					if (localStorage.getItem('colorCheck') != 'aqua') {
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
const match = (event) => {



	loadingLoad('loading-modal', true);
	eraseHtml('modal-list');
	let red_type, tr, td, yellow_type, nde_type, black_type, grey_type, blue_type, green_type, lightgreen;
	let ids = [];
	search_general.value = ""
	let colorCheck = localStorage.getItem('colorCheck')

	
	red_type = event.currentTarget.classList.contains('red');
	yellow_type = event.currentTarget.classList.contains('yellow');
	black_type = event.currentTarget.classList.contains('black');
	lightgreen = event.currentTarget.classList.contains('lightgreen');
	grey_type = event.currentTarget.classList.contains('grey');
	aqua_type = event.currentTarget.classList.contains('aqua');
	blue_type = event.currentTarget.classList.contains('blue');
	green_type = event.currentTarget.classList.contains('green');

	// Para nota de debito electronica
	nde_type = event.currentTarget.classList.contains('aqua');
	if (nde_type & colorCheck == 'aqua') {

		localStorage.setItem('colorCheck', 'aqua');
		switchStyle();

	}

	if (yellow_type & colorCheck != 'grey') {
		localStorage.setItem('colorCheck', 'yellow');
		switchStyle();

	}

	if (red_type & colorCheck == 'yellow') {
		localStorage.setItem('colorCheck', 'red');
		switchStyle();

	}

	if (colorCheck == 'grey') {
		localStorage.setItem('colorCheck', 'grey-justify');
		switchStyle();

	}

	// // Posible fallo by me (r)

	if (blue_type || green_type) {
		localStorage.setItem('allItem', 'true');
	} else {
		localStorage.setItem('allItem', 'false');
	}


	tr = table.getElementsByTagName("tr");

	let fecha_rec = ''
	xmlListAttach = []

	for (i = 0; i < tr.length; i++) {
		td = tr[i].getElementsByTagName("td")[0]?.getElementsByTagName('input')[0];

		if (td && td.checked) {
			if (red_type) {

				let folio = tr[i].getElementsByTagName("td")[1].textContent;
				let btn_info = tr[i].getElementsByTagName("td")[3].querySelector('button')
				var tooltipHtml = btn_info.getAttribute('data-bs-original-title');
				// Crea un nuevo elemento DOM temporario y setea el innerHTML con el valor extraído
				var tempDiv = document.createElement('div');
				tempDiv.innerHTML = tooltipHtml;
				// Busca el segundo div con clase 'row' y el primer div dentro de él
				var rows = tempDiv.getElementsByClassName('row');
				var fecha_recepcion = rows[1].getElementsByClassName('col')[0].textContent.trim()
				const id_attachment = tr[i].getElementsByTagName("td")[tr[i].getElementsByTagName("td").length - 1].querySelector('button') ? tr[i].getElementsByTagName("td")[tr[i].getElementsByTagName("td").length - 1].querySelector('button').dataset.attachment ? tr[i].getElementsByTagName("td")[tr[i].getElementsByTagName("td").length - 1].querySelector('button').dataset.attachment : '' : ''

				if (id_attachment != '') {
					xmlListAttach.push({
						'id': td.attributes.id.value,
						'folio': `${tr[i].getElementsByTagName("td")[1].textContent}`,
						'id_attachment': tr[i].getElementsByTagName("td")[tr[i].getElementsByTagName("td").length - 1].querySelector('button') ? tr[i].getElementsByTagName("td")[tr[i].getElementsByTagName("td").length - 1].querySelector('button').dataset.attachment : ''
					})

				}
				ids.push({
					'id': td.attributes.id.value,
					'folio': `Folio Documento :  N° ${tr[i].getElementsByTagName("td")[1].textContent}`,
					'total': tr[i].getElementsByTagName("td")[tr[i].getElementsByTagName("td").length - 2].textContent,
					'proveedor': tr[i].getElementsByTagName("td")[2].textContent,
					'tipo': tr[i].getElementsByTagName("td")[5].textContent,
					'fecha': tr[i].getElementsByTagName("td")[4].textContent,
					'fecha_recepcion': fecha_recepcion
				});
			} else if (grey_type) {

				let btn_infoo = tr[i].getElementsByTagName("td")[3].querySelector('button')
				var tooltipHtml = btn_infoo.getAttribute('data-bs-original-title');
				var tempDiv = document.createElement('div');
				tempDiv.innerHTML = tooltipHtml;
				var rows = tempDiv.getElementsByClassName('row');
				var fecha_recepcion = rows[1].getElementsByClassName('col')[0].textContent.trim()
				ids.push({
					id: td.attributes.id.value,
					fecha: fecha_recepcion
				}
				);
				let btn_info = td.closest('tr').children[3].querySelector('button')
				var tooltipHtml = btn_info.getAttribute('data-bs-original-title');
				// Crea un nuevo elemento DOM temporario y setea el innerHTML con el valor extraído
				var tempDiv = document.createElement('div');
				tempDiv.innerHTML = tooltipHtml;
				// Busca el segundo div con clase 'row' y el primer div dentro de él
				var rows = tempDiv.getElementsByClassName('row');
				fecha_rec = rows[1].getElementsByClassName('col')[0].textContent.trim()


			} else if (aqua_type) {

				let btn_infoo = tr[i].getElementsByTagName("td")[3].querySelector('button')
				var tooltipHtml = btn_infoo.getAttribute('data-bs-original-title');
				var tempDiv = document.createElement('div');
				tempDiv.innerHTML = tooltipHtml;
				var rows = tempDiv.getElementsByClassName('row');
				var fecha_recepcion = rows[1].getElementsByClassName('col')[0].textContent.trim()
				ids.push({
					id: td.attributes.id.value,
					fecha: fecha_recepcion
				}
				);
				let btn_info = td.closest('tr').children[3].querySelector('button')
				var tooltipHtml = btn_info.getAttribute('data-bs-original-title');
				// Crea un nuevo elemento DOM temporario y setea el innerHTML con el valor extraído
				var tempDiv = document.createElement('div');
				tempDiv.innerHTML = tooltipHtml;
				// Busca el segundo div con clase 'row' y el primer div dentro de él
				var rows = tempDiv.getElementsByClassName('row');
				fecha_rec = rows[1].getElementsByClassName('col')[0].textContent.trim()


			} else if (lightgreen) {
				let folio = tr[i].getElementsByTagName("td")[1].textContent;
				let btn_info = tr[i].getElementsByTagName("td")[3].querySelector('button')
				var tooltipHtml = btn_info.getAttribute('data-bs-original-title');
				// Crea un nuevo elemento DOM temporario y setea el innerHTML con el valor extraído
				var tempDiv = document.createElement('div');
				tempDiv.innerHTML = tooltipHtml;
				// Busca el segundo div con clase 'row' y el primer div dentro de él
				var rows = tempDiv.getElementsByClassName('row');
				var fecha_recepcion = rows[1].getElementsByClassName('col')[0].textContent.trim()
				const id_attachment = tr[i].getElementsByTagName("td")[tr[i].getElementsByTagName("td").length - 1].querySelector('button') ? tr[i].getElementsByTagName("td")[tr[i].getElementsByTagName("td").length - 1].querySelector('button').dataset.attachment ? tr[i].getElementsByTagName("td")[tr[i].getElementsByTagName("td").length - 1].querySelector('button').dataset.attachment : '' : ''

				if (id_attachment != '') {
					xmlListAttach.push({
						'id': td.attributes.id.value,
						'folio': `${tr[i].getElementsByTagName("td")[1].textContent}`,
						'id_attachment': tr[i].getElementsByTagName("td")[tr[i].getElementsByTagName("td").length - 1].querySelector('button') ? tr[i].getElementsByTagName("td")[tr[i].getElementsByTagName("td").length - 1].querySelector('button').dataset.attachment : ''
					})

				}
				ids.push({
					'id': td.attributes.id.value,
					'folio': `Folio Documento :  N° ${tr[i].getElementsByTagName("td")[1].textContent}`,
					'total': tr[i].getElementsByTagName("td")[tr[i].getElementsByTagName("td").length - 2].textContent,
					'proveedor': tr[i].getElementsByTagName("td")[2].textContent,
					'tipo': tr[i].getElementsByTagName("td")[5].textContent,
					'fecha': tr[i].getElementsByTagName("td")[4].textContent,
					'fecha_recepcion': fecha_recepcion
				});
			}
			else {

				ids.push(
					td.attributes.id.value
				);
				let btn_info = td.closest('tr').children[3].querySelector('button')
				var tooltipHtml = btn_info.getAttribute('data-bs-original-title');
				// Crea un nuevo elemento DOM temporario y setea el innerHTML con el valor extraído
				var tempDiv = document.createElement('div');
				tempDiv.innerHTML = tooltipHtml;
				// Busca el segundo div con clase 'row' y el primer div dentro de él
				var rows = tempDiv.getElementsByClassName('row');
				//fecha_rec = rows[1].getElementsByClassName('col')[0].textContent.trim()
				fecha_rec = td.closest('tr').children[4].textContent


			}


		}
	}

	listObject = new List();

	if (red_type) {
		if (event.currentTarget.classList.contains('two')) {

			if (confirm(`Esta accion creara  ${ids.length == 1 ? 'el' : 'los'} ${ids.length} ${ids.length == 1 ? 'documento' : 'documentos'} en estado "Por asignar " para su posterior asociacion a un gasto. Confimar ?`)) {
				spinnerMain(window.FX, true)
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

						if (!res.data[0].success) {
							alertObj.type = 'warning';
							alertObj.msg = res.data[0].errorMsg;
							alertLoad(alertObj, 'alertas');
							spinnerMain(window.FX, false)
						} else {

							alertObj.type = 'success';
							alertObj.msg = 'Documentos creados con exito!!!';
							alertLoad(alertObj, 'alertas');
							getDocumentosXRevisar(f.value);
							spinnerMain(window.FX, false)
						}



					})
					.catch(err => {

						alertObj.type = 'danger';
						alertObj.msg = 'Hubo un inconveniente, favor contactar a soporte!!';
						alertLoad(alertObj, 'alertas-modal');
						spinnerMain(window.FX, false)
					});

			}

		} else if (event.currentTarget.classList.contains('gg')) {
			let row = [];
			if (ids.length == 1) {
				search_general.style.display = "none"
			} else {
				search_general.style.display = ""
			}
			ids.forEach(ids_e => {


				let adicional = [];

				adicional.push(`<div class="" id="loading-search-neg-${ids_e.id}" style="display:none"><div class="spinner-border text-success" role="status">
								</div>
								<span class="">Espere un momento...</span>
								</div>
								
								<div class="searchbar input-group">
									<label class="input-group-text" for="bs${ids_e.id}" style="width: 35%;">Clasificación</label>

									
									<input list="bl${ids_e.id}" id="bs${ids_e.id}" iddoc="${ids_e.id}"  class="form-control bs"  type="text"   placeholder="Buscar clasificación..." autocomplete="off">
									<div id="search_list">
										<datalist id="bl${ids_e.id}" >
										</datalist>
										<span class="badge rounded-pill bg-light text-dark" style="opacity:0.5;">* Presiona ENTER para comenzar la busqueda</span>
									</div>
									
								</div>`);
				adicional.push(`<div class="searchbar input-group">
									<label class="input-group-text" for="il${ids_e.id}" style="width: 35%;">Item</label>
									<input list="il${ids_e.id}" id="is${ids_e.id}" iddoc="${ids_e.id}" class="form-control is"  type="text" placeholder="Buscar item..." autocomplete="off">
									<div id="search_list">
										<datalist id="il${ids_e.id}"  >
										</datalist>
										<span class="badge rounded-pill bg-light text-dark" style="opacity:0.5;">* Presiona ENTER para comenzar la busqueda</span>
									</div>
								</div>`);
				adicional.push(`<div  class="input-group" style="text-align: left;">
								<label for="fecha-oc-${ids_e.id}" style="width:35%;" class="input-group-text">Fecha OC</label>
								<input id="fecha-oc-${ids_e.id}" type="date" class="form-control" value="${ids_e.fecha.split('-').reverse().join('-')}">
							</div>`);

				adicional.push(`<div  class="input-group" style="text-align: left;">
								<label for="fecha-rc-${ids_e.id}" style="width:40%;" class="input-group-text">Fecha Recepción</label>
								<input id="fecha-rc-${ids_e.id}" type="date" class="form-control" value="${ids_e.fecha_recepcion.split('-').reverse().join('-')}">
							</div>`);



				row.push({
					'class1': 'lielement',
					'type': 'gg',
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

			// let bss = document.querySelector('#select_c');
			// bss.addEventListener("click", (event) => findClasification(event));

			let bss = document.querySelectorAll('.bs');
			bss.forEach(c => {
				c.addEventListener("keyup", (event) => findClasification(event));
				c.addEventListener("change", (event) => findClasification(event));

			});

			let iss = document.querySelectorAll('.is');
			iss.forEach(c => {
				c.addEventListener("keyup", (event) => findItemByCatalogo(event));
				c.addEventListener("change", (event) => findItemByCatalogo(event));

			});


			loadingLoad('loading-modal', false);
		} else {
			let row = [];
			if (ids.length == 1) {
				search_general.style.display = "none"
			} else {
				search_general.style.display = ""
			}
			const getFormattedDate = () => {
				var date = new Date();
				var day = date.getDate().toString().padStart(2, '0');
				var month = (date.getMonth() + 1).toString().padStart(2, '0');
				var year = date.getFullYear();
				return `${year}-${month}-${day}`;
			}
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
										<span class="badge rounded-pill bg-light text-dark" style="opacity:0.5;">* Presiona ENTER para comenzar la busqueda</span>
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
									<label for="fecha-oc-${ids_e.id}" style="width:40%;" class="input-group-text">Fecha emisión OC</label>
									<input id="fecha-oc-${ids_e.id}" type="date" class="form-control" value="${ids_e.fecha.split('-').reverse().join('-')}">
								</div>`);

				adicional.push(`<div  class="input-group" style="text-align: left;">
								<label for="fecha-rc-${ids_e.id}" style="width:60%;" class="input-group-text">Fecha Recepción doc.</label>
								<input id="fecha-rc-${ids_e.id}" type="date" class="form-control" value="${ids_e.fecha_recepcion != '00-00-00' ? ids_e.fecha_recepcion.split('-').reverse().join('-') : getFormattedDate()}">
							</div>`);


				row.push({
					'class1': 'lielement',
					'l1': ids_e.folio,
					'link1': ids_e.proveedor,
					'l2': ids_e.tipo,
					'l3': ids_e.fecha,
					'l4': ids_e.total,
					'adicional': [...adicional],
					'attachment': ids_e.id_attachment,
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


	} else if (grey_type) {

		getMatchNc(ids, filtro_fecha_fxr.children[1].value);

	} else if (nde_type) {

		getMatchNb(ids, filtro_fecha.children[1].value, "nc");

	} else if (!black_type && !lightgreen) {
		let green = event.currentTarget.classList.contains('green');
		let fxr = event.currentTarget.classList.contains('yellow');
		let fecha_recepcion = event


		getMatch(ids, red_type, fxr, filtro_fecha.children[1].value, green, fecha_rec);
	} else if (lightgreen) {
		
		if (confirm(`Esta accion creara  ${ids.length == 1 ? 'el' : 'los'} ${ids.length} ${ids.length == 1 ? 'documento' : 'documentos'} en estado "Pagada". Confimar ?`)) {
			spinnerMain(window.FX, true)
			let ids2 = [];
			
			ids.forEach(ids_e => {
				ids2.push({
					'iddoc': ids_e.id,
					'idnegoc': 0,
					'llaveitem': "",
					'fecha': ids_e.fecha,
					'type': "lightgreen",
					'sid': sid(),
					'pending': false
				});

			});

			setJustify(ids2, "lightgreen")
				.then(res => {

					if (!res.data[0].success) {
						alertObj.type = 'warning';
						alertObj.msg = res.data[0].errorMsg;
						alertLoad(alertObj, 'alertas');
						spinnerMain(window.FX, false)
					} else {

						alertObj.type = 'success';
						alertObj.msg = 'Documentos creados con exito!!!';
						alertLoad(alertObj, 'alertas');
						getDocumentosXRevisar(f.value);
						spinnerMain(window.FX, false)
					}



				})
				.catch(err => {

					alertObj.type = 'danger';
					alertObj.msg = 'Hubo un inconveniente, favor contactar a soporte!!';
					alertLoad(alertObj, 'alertas-modal');
					spinnerMain(window.FX, false)
				});

		}
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
					getDocumentosXRevisar(f.value);


				})
				.catch(err => {

					alertObj.type = 'danger';
					alertObj.msg = 'Hubo un inconveniente, favor contactar a soporte!!';
					alertLoad(alertObj, 'alertas-modal');
				});

		}

	}


}

const getMatchNc = (ids, year, fechaRecepcion = "") => {
	search_general.style.display = ""

	let id_carga = []
	id_carga.push(ids[0].id)
	debugger
	getDTCMatch(id_carga, year, '', 'NC')
		.then(res => {

			listObject = new List();

			if (!res.data[0].records.total_records) {
				loadingLoad('loading-modal', false);
				alertObj.type = 'danger';
				alertObj.msg = 'Sin resultados!';
				alertLoad(alertObj, 'alertas-modal');
				return;
			}

			res.data.forEach(res_e => {

				let row = [];

				let iddoc = res_e.data.iddoc;


				res_e.data.rows.forEach(e => {


					let n, y, m, d, date_value;
					let fecha_recepcion = ids[0].fecha

					n = new Date();
					//Año
					y = n.getFullYear();
					//Mes
					m = n.getMonth() + 1;
					//Día
					d = n.getDate();
					if (d < 10) d = '0' + d;
					if (m < 10) m = '0' + m;

					date_value = y + "-" + m + "-" + d;

					if (fechaRecepcion != '') {
						let parts = fechaRecepcion.split('-');
						if (parts.length === 3) {
							fecha_recepcion = `${parts[2]}-${parts[1]}-${parts[0]}`;
						}
					} else {
						let parts = fecha_recepcion.split('-');
						if (parts.length === 3) {
							fecha_recepcion = `${parts[2]}-${parts[1]}-${parts[0]}`;
						}
					}




					let adicional = [];

					adicional.push(`<div  class="input-group" style="text-align: left;">
								<label for="fecha-rc-${e.idoc}" style="width:40%;" class="input-group-text">Fecha Recepción</label>
								<input id="fecha-rc-${e.idoc}" type="date" class="form-control" value="${fecha_recepcion}" data-iddtc="${e.idoc}" data-iddoc="${ids[0].id}" data-tipodoc="${e.tipodoc}" data-folio="${e.folio}" data-estado="${e.estado}">
							</div>`);

					row.push({
						'class1': 'lielement',
						'l1': e.folio,
						'link1': `<a href="${window.location.origin}/4DACTION/wbienvenidos#dtc/content.shtml?id=${e.idoc}" target="_blank">
								<div class="fw-bold">${e.referencia}</div>
							</a>`,
						'l2': e.proveedor,
						'l3': e.fecha_emision,
						'l4': parseFloat(e.total_oc),
						'adicional': [...adicional],
						'l5': `<input class="form-check-input" style="float: right;" type="checkbox" value="" id="check${e.idoc}">`

					});



				});






				listObject.bloques.push(row);

			});
			eraseHtml('modal-list');
			listLoad(listObject, 'modal-list');




			loadingLoad('loading-modal', false);
		})
		.catch(error => {
			console.log(error);
			loadingLoad('loading-modal', false);
		});
}

const getMatchNb = (ids, year, tipodoc) => {
	search_general.style.display = ""

	let idss = []
	idss.push(ids[0].id)
	getDTCMatch(idss, year, tipodoc)
		.then(res => {

			listObject = new List();

			if (!res.data[0].records.total_records) {
				loadingLoad('loading-modal', false);
				alertObj.type = 'danger';
				alertObj.msg = 'Sin resultados!';
				alertLoad(alertObj, 'alertas-modal');
				return;
			}

			res.data.forEach(res_e => {

				let row = [];

				let iddoc = res_e.data.iddoc;


				res_e.data.rows.forEach(e => {


					let n, y, m, d, date_value;

					n = new Date();
					//Año
					y = n.getFullYear();
					//Mes
					m = n.getMonth() + 1;
					//Día
					d = n.getDate();
					if (d < 10) d = '0' + d;
					if (m < 10) m = '0' + m;

					date_value = y + "-" + m + "-" + d;
					let adicional = [];

					const fecha_recepcion = ids[0] != undefined ? ids[0].fecha : date_value

					const formatDateForInput = dateStr => {
						const [day, month, year] = dateStr.split("-");
						return `${year}-${month}-${day}`;
					};

					// Ejemplo de uso
					const formattedDate = formatDateForInput(fecha_recepcion);



					adicional.push(`<div  class="input-group" style="text-align: left;">
								<label for="fecha-rc-${e.idoc}" style="width:40%;" class="input-group-text">Fecha Recepción</label>
								<input id="fecha-rc-${e.idoc}" type="date" class="form-control" value="${formattedDate}" data-iddtc="${e.idoc}" data-iddoc="${ids[0].id}" data-tipodoc="${e.tipodoc}" data-folio="${e.folio}" data-estado="${e.estado}">
							</div>`);


					let path = e.tipodoc == '61' ? `#dtc/contentnc.shtml?id=${e.idoc}` : `#dtc/content.shtml?id=${e.idoc}`

					row.push({
						'class1': 'lielement',
						'l1': e.folio,
						'link1': `<a href="${window.location.origin}/4DACTION/wbienvenidos${path}" target="_blank">
								<div class="fw-bold">${e.referencia}</div>
							</a>`,
						'l2': e.proveedor,
						'l3': e.fecha_emision,
						'l4': parseFloat(e.total_oc),
						'adicional': [...adicional],
						'l5': `<input class="form-check-input" style="float: right;" type="checkbox" value="" id="check${e.idoc}">`

					});



				});






				listObject.bloques.push(row);

			});
			eraseHtml('modal-list');
			listLoad(listObject, 'modal-list');




			loadingLoad('loading-modal', false);
		})
		.catch(error => {
			console.log(error);
			loadingLoad('loading-modal', false);
		});
}



const getMatch = (ids, red_type, fxr, year, green, fecha_rec = '') => {
	search_general.style.display = ""
	document.getElementById('input-file-attach').value = '';


	getOcMatch(ids, red_type, fxr, year)
		.then(res => {
			listObject = new List();



			res.data.forEach(res_e => {

				let row = [];

				let iddoc = res_e.data.iddoc;

				res_e.data.rows.forEach(e => {

					if (e.items.length > 0) {

						selectObject = new Select();
						e.items.forEach(ei_ => {
							selectObject.options.push({
								'id': ei_.id,
								'name': ei_.name
							});
						});

						selectObject.label_name = 'Selecciona el Item';
						selectObject.id = e.idoc;
						selectObject.id0 = iddoc;
						let select = selectLoad(selectObject);

						let n, y, m, d, date_value;

						n = new Date();
						//Año
						y = n.getFullYear();
						//Mes
						m = n.getMonth() + 1;
						//Día
						d = n.getDate();
						if (d < 10) d = '0' + d;
						if (m < 10) m = '0' + m;

						date_value = y + "-" + m + "-" + d;

						const fecha_recepcion = fecha_rec != undefined || fecha_rec != '' ? fecha_rec : date_value
						let adicional = [];
						adicional.push(select)

						adicional.push(`<div  class="input-group" style="text-align: left;">
									<label for="fecha-rc-${e.idoc}" style="width:40%;" class="input-group-text">Fecha Recepción</label>
									<input id="fecha-rc-${e.idoc}" type="date" class="form-control" value="${fecha_recepcion.split('-').reverse().join('-')}">
								</div>`);

						// adicional.push(`<div  class="input-group" style="text-align: left;">
						// 		<input id="input-file-${e.idoc}" type="file" data-id="${e.idoc}" class="form-control input-file-adjunto" value="${date_value}" onchange="uploadFile(this)">
						// 	</div>`);

						row.push({
							'class1': 'lielement',
							'l1': e.folio,
							'link1': `<a href="${window.location.origin}/4DACTION/wbienvenidos#compras/content.shtml?id=${e.idoc}" target="_blank">
									<div class="fw-bold">${e.referencia}</div>
								</a>`,
							'l2': e.proveedor,
							'l3': e.fecha_emision,
							'l4': parseFloat(e.total_oc),
							'adicional': [...adicional],
							'l5': `<input class="form-check-input" ${green ? 'checked' : 'onclick="verifyModalCheck(this)"'}   style="float: right;" type="checkbox" value="" id="check${e.idoc}">`

						});
					}

				});







				listObject.bloques.push(row);

			});

			eraseHtml('modal-list');
			listLoad(listObject, 'modal-list');




			loadingLoad('loading-modal', false);
		})
		.catch(error => {
			console.log(error);
			loadingLoad('loading-modal', false);
		});
}



//----------------------------------------------------------------
//----------------------- Card Load section ----------------------
//----------------------------------------------------------------



//----------------------------------------------------------------
//----------------------- Table Load section ---------------------
//----------------------------------------------------------------
const formatearNumero = (value) => {
	const decimals = parseInt(bandejaDtc.view_decimal)
	let number = parseFloat(value.replace(',', '.'));

	return number.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

//-------------TABLA DTC´s
const getDocumentosXRevisar = (date, estado = "TODOS") => {

	//BADGE DE CONTEO DE DOCUMENTOS
	badge_cont.textContent = "0"
	f.disabled = true;
	resetInputs(true)

	loadingLoad('loading', true);
	eraseHtml('tables');
	eraseHtml('msg');
	verifyChecked();
	let li = ''
	getTipoDoc()
		.then((res) => {
			li += `<li><a class="dropdown-item" onclick="filterByTipoDoc(this)" data-id="">Todos</a></li>`
			for (var i in res.rows) {

				li += `<li><a class="dropdown-item" onclick="filterByTipoDoc(this)" data-id="${res.rows[i].id}">${res.rows[i].tipo}</a></li>`
			}
		})
		.catch(err => {
			loadingLoad('loading', false);
			alert('Hubo un error!!', err);

		})



	getDocXRev(date, estado)
		.then((res) => {

			tableObject = new Table();

			dropdown = `<div class="dropdown">
			<button class="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" style="background-color:#F1EFEF">
			  Tipo
			</button>
			<ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
				${li}
			  
			</ul>
		  </div>`


			let cont = 0;
			let color = '';
			let cs = '';
			if (res.records.total_records == 0) {
				loadingLoad('loading', false);
				alertObj.type = 'warning';
				alertObj.msg = 'No hay movimientos para el periodo seleccionado.';
				alertLoad(alertObj, 'alertas');
				f.disabled = false;
				return
			}




			if (res.records.total_records > 0) {
				const impuestosUnicos = [];

				res.data.impuestos_docs.forEach(doc => {
					const impuestoExistente = impuestosUnicos.find(impuesto => impuesto.id_impuesto === doc.id_impuesto);
					if (!impuestoExistente) {
						impuestosUnicos.push({
							id_impuesto: doc.id_impuesto,
							name: doc.name,
							namefull: doc.namefull
						});
					}
				});



				tableObject.headers = [`<button type="button" id="btnColorSelectorMasivo" class="btn" style="cursor: pointer;" > 
			<input class="form-check-input" style="display: none;" id="checkColorSelectorMasivo" type="checkbox" value=""></button>`, 'Numero', 'Emisor', '', 'Fecha recepción', dropdown, 'Neto', 'Exento'];

				// Encuentra el índice de la posición donde se encuentra "Exento"
				const indexExento = tableObject.headers.findIndex(header => header === 'Exento');

				// Inserta los nombres de los impuestos únicos después de "Exento"
				impuestosUnicos.forEach(impuesto => {
					tableObject.headers.splice(indexExento + 1, 0, impuesto.namefull);
				});

				// Agrega el resto de los headers después de los impuestos
				tableObject.headers.push('Total', '', '');
				res.data.rows.forEach(function (res_ele) {
					let pendingColor = '';
					let classification = '';
					if (res_ele.pendiente) {
						color = '#F9BD00';
						cs = 'orange';


						if (res_ele.recordsMatch == 1) {
							pendingColor = 'green';
						} else if (res_ele.recordsMatch == 0) {
							pendingColor = 'red';
						} else {

							pendingColor = 'blue';
						}
					} else {
						if (res_ele.tipo != "NOTA DE CREDITO ELECTRONICA" && res_ele.tipo != "NOTA DE DEBITO ELECTRONICA" && res_ele.status) {
							cont += 1;
							switch (res_ele.recordsMatch) {
								case 1:
									color = '#34CC02';
									cs = 'green';
									break;
								case 0:
									color = '#FC4903';
									cs = 'red';

									break;

								default:
									color = '#03D6F9';
									cs = 'blue';
									break;
							}

						} else if (!res_ele.status) {
							color = '#000000';
							cs = 'black';
						} else if (res_ele.tipo == "NOTA DE DEBITO ELECTRONICA" && res_ele.status) {

							color = '#0ef5f5';
							cs = 'aqua';
						} else {
							color = '#c2c5c3';
							cs = 'grey';
							classification = "NC"

						}


					}



					let tooltip_row = `
						<div class='container' id='tooltip'>
							<div class='container'>
								<div class='row'>
									<div class='col-4'>
										<strong>Fecha emisión</strong>
									</div>
									<div class='col-4'>
										<strong>Receptor</strong>
									</div>
									<div class='col-4'>
										<strong>Pagada</strong>
									</div>
								</div>
								<div class='row'>
									<div class='col'>
										${res_ele.fecha}
									</div>
									<div class='col'>
										${res_ele.receptor}
									</div>
									<div class='col'>
										${res_ele.pagado}
									</div>
								</div>
							</div>
							<hr>
							<div class='container'>
								<div class='row'>
									<div class='col-4'>
										<strong>Descripción</strong>
									</div>
								</div>
								<div class='row'>
									<div class='col'>
										${res_ele.description != '' ? res_ele.description.replace(/\"/g, "'").replace(/\//g, "") : ' S/D'}
									</div>
								</div>
							</div>
						</div>`;
					let row = [];


					row.push(`<button type="button" id="btn-match-${cont}" class="btn match" style="cursor: pointer;" ${res_ele.blocked ? ' title="Este documento no se puede desanular"   ' : ''}> 
						<input  ${res_ele.blocked ? 'disabled ' : ''} class="form-check-input match" style="background-color:${color};" id="${res_ele.id}" colorselector="${cs}" pendingcolorselector="${pendingColor}" classification="${classification}" type="checkbox" value="" id="flexCheckDefault"></button>`);

					row.push(res_ele.folio);
					row.push(res_ele.proveedor);
					row.push(`<div style="display: inline-flex"><button type="button" class="btn"  data-bs-toggle="tooltip" data-bs-html="true" data-bs-placement="top" title="${tooltip_row}">
					<i class="fas fa-info"></i>
				  </button></div>`);
					row.push(res_ele.fecha_recepcion);
					row.push(res_ele.tipo);

					row.push(`${formatearNumero(res_ele.neto)}`);
					row.push(`${formatearNumero(res_ele.exento)}`);



					// Inicializa un objeto para almacenar los impuestos del documento actual
					let impuestosDelDocumento = {};

					// Busca los impuestos relacionados con el documento actual
					res.data.impuestos_docs.forEach((impuesto) => {
						if (impuesto.id_doc === String(res_ele.id)) {
							impuestosDelDocumento[impuesto.name] = impuesto;
						}
					});

					// Agrega los valores de los impuestos al array de la fila
					tableObject.headers.forEach(function (header, index) {
						// Verificar si el header corresponde a un impuesto
						if (impuestosUnicos.some(impuesto => impuesto.namefull === header)) {
							const impuestoCorrespondiente = impuestosUnicos.find(impuesto => impuesto.namefull === header);
							// Si el documento tiene el impuesto, agrega su valor; de lo contrario, agrega cero
							if (impuestosDelDocumento.hasOwnProperty(impuestoCorrespondiente.name)) {
								row.push(`${formatearNumero(impuestosDelDocumento[impuestoCorrespondiente.name].valor)}`);
							} else {
								row.push(formatearNumero('0'));
							}
						}
					});





					//row.push(`${res_ele.impuesto_porc}%`);


					row.push(`${formatearNumero(res_ele.total)}`);

					let btn_pdf = "";
					if (res_ele.tipo.includes("BOLETA"))
						btn_pdf = `<button type="button" class="btn" title="Descargar pdf" ${res_ele.pdf != '' ? '' : ' style="display: none;"'}>
						<a class="" style="text-decoration: none;" href="${res_ele.pdf}"  target="_blank"><i class="far fa-file-pdf fa-2x" style="color:#F9BD00"></i></a>
						</button>`;
					else
						btn_pdf = `<button type="button" class="btn" title="Descargar pdf" onclick="downloadPDF(this)" id="${res_ele.id}" data-id="${res_ele.id}" folio="${res_ele.folio}" style="display: "><i class="far fa-file-pdf fa-2x" style="color:#FC4903"></i></button>`;




					// row.push(`<button type="button" class="btn" title="Descargar XML" ${res_ele.xml != '' ? '' : ' style="display: none;"'}>
					// 			<a class="" style="text-decoration: none;" href="${res_ele.xml}"  target="_blank"><i class="far fa-file-code fa-2x" style="color:#03D6F9"></i></a>
					// 		</button>

					// 		${btn_pdf}`);
					if (res_ele.attachment_xml != '') {
						row.push(`<button type="button" class="btn" onclick="downloadXML(this)" data-attachment="${res_ele.attachment_xml}" data-folio="${res_ele.folio}" title="Descargar XML">
						<a class="" style="text-decoration: none;" target="_blank"><i class="far fa-file-code fa-2x" style="color:#03D6F9"></i></a>
					</button>`);

					} else {
						row.push(`<button type="button" class="btn" title="Descargar XML" ${res_ele.xml != '' ? '' : ' style="display: none;"'}>
						<a class="" style="text-decoration: none;" href="${res_ele.xml}"  target="_blank"><i class="far fa-file-code fa-2x" style="color:#03D6F9"></i></a>
					</button>
					
					${btn_pdf}`);
					}



					tableObject.bodyRows.push(row);




				})

				tableLoad(tableObject, 'tables');

				let btns = document.querySelectorAll(`input.match`);
				btns.forEach(b => b.addEventListener("click", (event) => verifyCheck(event)));


				//CHECK HEADERS TABLA DOCUMENTOS
				let checkMasivo = document.getElementById('checkColorSelectorMasivo');
				checkMasivo.addEventListener("click", (event) => checkMassiveAction(event));


				//OCULTAR COLORES
				switchDisplay(false, 'grey')
				switchDisplay(false, 'black')
				switchDisplay(false, 'orange')
				switchDisplay(false, 'aqua')


				//Inicializar tooltips
				var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
				var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
					return new bootstrap.Tooltip(tooltipTriggerEl)
				})


				//BADGE DE CONTEO DE DOCUMENTOS
				badge_cont.textContent = cont


				loadingLoad('loading', false);

				finderTable(finder)
				f.disabled = false;
				resetInputs(false)

			} else {
				loadingLoad('loading', false);
				simpleMsg('NO SE ENCONTRARON DOCUMENTOS POR REVISAR, TODO HA SIDO REGISTRADO!!', 'msg', true);
				f.disabled = false;
				resetInputs(false)
			}


		})
		.catch(err => {

			loadingLoad('loading', false);
			alert('Hubo un error!!', err);
			f.disabled = false;
			resetInputs(false)
		})

}

const switchDisplay = (status, color) => {

	tr = table.getElementsByTagName("tr");
	let cont = 0;

	for (i = 0; i < tr.length; i++) {
		td = tr[i].getElementsByTagName("td")[0]?.getElementsByTagName('input')[0];


		if (td) {
			colorValue = td.attributes.colorselector.value;
			pendingColorValue = td.attributes.pendingcolorselector.value;

			if (colorValue.toUpperCase().indexOf(color.toUpperCase()) > -1 || color.toUpperCase() == 'CANCEL') {


				tr[i].style.display = "none";


			} else {
				if (tr[i].style.display == "")
					cont++;
			}

		}
	}
	//BADGE DE CONTEO DE DOCUMENTOS
	badge_cont.textContent = cont

}

const checkMassiveAction = (obj) => {


	let tr, td, i, colorValue, pendingColorValue;
	let h = obj.currentTarget.checked;
	let colorCheck = localStorage.getItem('colorCheck')
	let pendingColorCheck = localStorage.getItem('pendingColorCheck')

	if (colorCheck != "") {
		tr = table.getElementsByTagName("tr");

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

	const rows = document.querySelectorAll('#tables tbody tr'); // Seleccionamos todas las filas del tbody
	let idNc = ''
	let fechaRecepcion = ''
	rows.forEach(row => {
		const checkbox = row.querySelector('input[type="checkbox"].match'); // Seleccionamos el input checkbox
		const button = row.querySelector('button[data-id]'); // Seleccionamos el botón con data-id

		if (checkbox && checkbox.checked && button) {
			idNc = button.getAttribute('data-id')
			fechaRecepcion = row.children[4].innerText

		}
	});


	const colorCheck = localStorage.getItem('colorCheck')

	if (colorCheck && colorCheck == 'grey-justify') {
		getMatchNc([{ id: idNc, fecha: filtro_fecha_fxr.children[1].value }], filtro_fecha_fxr.children[1].value, fechaRecepcion)
	} else {
		getMatch([], false, true, filtro_fecha_fxr.children[1].value, false);
	}





});

const filterByTipoDoc = (event) => {
	let id = event.dataset.id
	let color = document.querySelector('#colorSelector').value

	let filter = ''

	switch (id) {
		case '1': {
			filter = 'BOLETA DE HONORARIOS'
			break;
		}

		case '2': {
			filter = 'FACTURA ELECTRONICA'
			break;
		}

		case '3': {
			filter = 'FACTURA ELECTRONICA EXENTA'
			break;
		}

		case '4': {
			filter = 'NOTA DE CREDITO ELECTRONICA'
			break;
		}
	}

	let table, tr, td, i, txtDoc, colorValue, pendingColorValue;
	let td_tipodoc;
	table = document.getElementById("tables");
	tr = table.getElementsByTagName("tr");
	if (filter != '') {
		for (i = 0; i < tr.length; i++) {
			td = tr[i].getElementsByTagName("td")[0]?.getElementsByTagName('input')[0];
			td_tipodoc = tr[i].getElementsByTagName("td")[5];
			if (td) {
				colorValue = td.attributes.colorselector.value;
				pendingColorValue = td.attributes.pendingcolorselector.value;
				txtDoc = td_tipodoc.textContent || td_tipodoc.innerText;

				switch (color) {
					case "green": {
						if (txtDoc === filter && colorValue === "green") {
							tr[i].style.display = "";
						} else {
							tr[i].style.display = "none";
						}
						break;
					}

					case "blue": {
						if (txtDoc === filter && colorValue === "blue") {
							tr[i].style.display = "";
						} else {
							tr[i].style.display = "none";
						}
						break;
					}

					case "red": {
						if (txtDoc === filter && colorValue === "red") {
							tr[i].style.display = "";
						} else {
							tr[i].style.display = "none";
						}
						break;
					}

					case "black": {
						if (txtDoc === filter && colorValue === "black") {
							tr[i].style.display = "";
						} else {
							tr[i].style.display = "none";
						}
						break;
					}

					case "grey": {
						if (txtDoc === filter && colorValue === "grey") {
							tr[i].style.display = "";
						} else {
							tr[i].style.display = "none";
						}
						break;
					}

					default: {
						if (txtDoc === filter) {
							tr[i].style.display = "";
						} else {
							tr[i].style.display = "none";
						}
					}
				}

			}


		}
	} else {
		document.querySelector('#colorSelector').value = ""

		for (i = 0; i < tr.length; i++) {
			tr[i].style.display = "";
		}
	}

}

const spinnerMain = (fx, status) => {
	if (status) {

		document.getElementById('loading-screen').style.display = 'block'
		// fx.fadeIn(document.getElementById('loading-screen'), {
		// 	duration: 2000,
		// 	complete: function () {
		// 		//alert('Complete');
		// 	}
		// });
	} else {
		document.getElementById('loading-screen').style.display = 'none'
		// fx.fadeOut(document.getElementById('loading-screen'), {
		// 	duration: 2000,
		// 	complete: function () {
		// 		//alert('Complete');
		// 	}
		// });

	}
}
//----------------------------------------------------------------
const finderTable = (event) => {

	let table, tr, td, i, txtValue, txtFolio;
	let td_folio;
	if (event.value === "") return;
	let h = event.value != undefined ? event.value : event.currentTarget.value;
	table = document.getElementById("tables");
	tr = table.getElementsByTagName("tr");

	for (i = 0; i < tr.length; i++) {
		td = tr[i].getElementsByTagName("td")[0]?.getElementsByTagName('input')[0];
		if (td && !td.checked) {
			td_folio = tr[i].getElementsByTagName("td")[1];
			td = tr[i].getElementsByTagName("td")[2];
			if (td) {
				txtValue = td.textContent || td.innerText;
				txtFolio = td_folio.textContent || td_folio.innerText;
				if (txtValue.toUpperCase().indexOf(h.toUpperCase()) > -1) {
					tr[i].style.display = "";
				} else if (txtFolio.toUpperCase().indexOf(h.toUpperCase()) > -1) {
					tr[i].style.display = "";
				} else {
					tr[i].style.display = "none";
				}
			}


		}
	}
}

const finderDiv = (event) => {
	let table, tr, td, i, txtValue, hr;
	if (event.value === "") return;
	let h = event.value != undefined ? event.value : event.currentTarget.value;
	table = document.getElementById("list-content");
	tr = table.getElementsByTagName("li");
	hr = table.getElementsByTagName("hr");
	for (i = 0; i < tr.length; i++) {
		td = tr[i];
		if (td) {
			txtValue = td.textContent || td.innerText;
			if (txtValue.toUpperCase().indexOf(h.toUpperCase()) > -1) {
				tr[i].style.display = "";
				hr[i].style.display = "";
			} else {
				tr[i].style.display = "none";
				hr[i].style.display = "none";
			}

		}
	}
}

//----------------------------------------------------------------
//----------------------------- INIT FUNCTION------------------------------
//----------------------------------------------------------------



(function init() {


	//-----------------------   VARIABLES   ----------------------------

	const colorSelectors = document.querySelectorAll('.colorSelector');
	f.disabled = true;
	resetInputs(true)

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

	//FINDER

	finder.addEventListener("keyup", (ff) => finderTable(ff));
	search_general.addEventListener("keyup", (ff) => finderDiv(ff));



	//RELOAD
	//reload.addEventListener("click", () => SetReload(f.value));

	//DATE
	f.addEventListener("change", () => getDocumentosXRevisar(f.value));

	//COLOR SELECTOR
	colorSelectors.forEach(c => c.addEventListener("click", (event) => colorSelector(event)));

	//BUTTONS ACTIONS
	bts.forEach(c => c.addEventListener("click", (event) => match(event)));


	//-----------------------   Ejecutables   -----------------------------

	getDocumentosXRevisar(f.value);




	var FX = {
		easing: {
			linear: function (progress) {
				return progress;
			},
			quadratic: function (progress) {
				return Math.pow(progress, 2);
			},
			swing: function (progress) {
				return 0.5 - Math.cos(progress * Math.PI) / 2;
			},
			circ: function (progress) {
				return 1 - Math.sin(Math.acos(progress));
			},
			back: function (progress, x) {
				return Math.pow(progress, 2) * ((x + 1) * progress - x);
			},
			bounce: function (progress) {
				for (var a = 0, b = 1, result; 1; a += b, b /= 2) {
					if (progress >= (7 - 4 * a) / 11) {
						return -Math.pow((11 - 6 * a - 11 * progress) / 4, 2) + Math.pow(b, 2);
					}
				}
			},
			elastic: function (progress, x) {
				return Math.pow(2, 10 * (progress - 1)) * Math.cos(20 * Math.PI * x / 3 * progress);
			}
		},
		animate: function (options) {
			var start = new Date;
			var id = setInterval(function () {
				var timePassed = new Date - start;
				var progress = timePassed / options.duration;
				if (progress > 1) {
					progress = 1;
				}
				options.progress = progress;
				var delta = options.delta(progress);
				options.step(delta);
				if (progress == 1) {
					clearInterval(id);
					options.complete();
				}
			}, options.delay || 10);
		},
		fadeOut: function (element, options) {
			var to = 1;
			this.animate({
				duration: options.duration,
				delta: function (progress) {
					progress = this.progress;
					return FX.easing.swing(progress);
				},
				complete: options.complete,
				step: function (delta) {
					element.style.opacity = to - delta;
				}
			});
		},
		fadeIn: function (element, options) {
			var to = 0;
			this.animate({
				duration: options.duration,
				delta: function (progress) {
					progress = this.progress;
					return FX.easing.swing(progress);
				},
				complete: options.complete,
				step: function (delta) {
					element.style.opacity = to + delta;
				}
			});
		}
	};
	window.FX = FX;
	spinnerMain(window.FX, false)

	//Cambiar aqui

	document.getElementById('list-dtc-title').textContent = 'Bandeja de documentos'

})();