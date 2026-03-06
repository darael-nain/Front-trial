
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


//----------------------------------------------------------------
//----------------------- General Functions section --------------
//----------------------------------------------------------------



const justify = () =>{
	
	const switchProcess = (status) =>{
		if(status){
			loadingLoad('loading-modal', true);
			justifyBtn.disabled = true;
			justifyBtn.style.opacity = "0.2";
			btnClose.disabled = true;
			inputs.forEach(i => i.disabled = true)
			selectors.forEach(i => i.disabled = true)
	
		}else{
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
	let pendingColor =  localStorage.getItem('pendingColorCheck')
	let errorMsg = "";


	if(pendingColor!="" && color=="orange")
	color=pendingColor

	switchProcess(true);
	let checkModalChecked = justifymodal.querySelectorAll('input.form-check-input:checked');
	if(checkModalChecked.length == 0 )
	errorMsg='Ojo!!!, no has seleccionado nada aun.';


	let col = 0;
	switch (color) {
		case 'green':
			
			col=8;
		  break;
		case 'blue':
			col=8;
			if(checkModalChecked.length > 1 )
			errorMsg='Debes Seleccionar solo una opción. <br>';

		  break;
		
		case 'red':
			col=13;
		  break;
		case 'yellow':
			col=8;
		  break;
		default:
			col=8;
		  break;
	}

	let ids = [];
	
	if(checkModalChecked.length > 1  &&  pendingColor=="blue")
		errorMsg+=`Debes Seleccionar solo una opción. <br>`;

	if(errorMsg == '' && color!="yelllow"){
			
		
		tr = justifymodal.getElementsByClassName("lielement");

		let checked = 0;
		let iddoc,llave,list,idnegoc,opList,selection,fecha;



		for (i = 0; i < tr.length; i++) {

			td = tr[i].getElementsByTagName("div")[col]?.getElementsByTagName('input')[0];
			if (td && td.checked) {
				checked++;
				if(color=='red'){
					
					
					selection = tr[i].getElementsByTagName("div")[8]?.getElementsByTagName('input')[0].value;
					iddoc = tr[i].getElementsByTagName("div")[8]?.getElementsByTagName('input')[0].attributes.iddoc.value;
					if(selection!=''){
						list = tr[i].getElementsByTagName("div")[8]?.getElementsByTagName('input')[0].attributes.list.value;
						opList = document.getElementById(list).querySelectorAll('option');
						opList.forEach(e => {
							if(e.value==selection)
							idnegoc=e.attributes.id.value;
						});
						
						
					}else{
						errorMsg+=`Debes Seleccionar el negocio del documento ${i+1} del listado. <br>`;
					}
				
					selection = tr[i].getElementsByTagName("div")[10]?.getElementsByTagName('input')[0].value;
					if(selection!=''){
						list = tr[i].getElementsByTagName("div")[10]?.getElementsByTagName('input')[0].attributes.list.value;
						opList = document.getElementById(list).querySelectorAll('option');
						opList.forEach(e => {
							if(e.value==selection)
							llave=e.attributes.id.value;
						});

					
					}else{
						errorMsg+=`Debes Seleccionar el Item del documento ${i+1} del listado. <br>`;
					}
					
					fecha = tr[i].getElementsByTagName("div")[12]?.getElementsByTagName('input')[0].value.split('-').reverse().join('-');
					

				}else if(color=='green' || color =='blue' || color=='yellow'){


					iddoc = tr[i].getElementsByTagName("div")[6]?.getElementsByTagName('select')[0].attributes.idelement2.value;
					idnegoc = tr[i].getElementsByTagName("div")[6]?.getElementsByTagName('select')[0].attributes.idelement.value;
					llave = tr[i].getElementsByTagName("div")[6]?.getElementsByTagName('select')[0];
					llave = llave.options[llave.selectedIndex].attributes.id.value;
					fecha = "";

					
					
				}

					

				if(errorMsg=='' && color!='yellow'){
						
					ids.push({
						'iddoc': iddoc,
						'idnegoc':  idnegoc,
						'llaveitem':  llave,
						'fecha': fecha,
						'type': color,
						'sid' : sid()
					});
				}else{
					
					if(errorMsg==''){

						
						let trListDoc = document.querySelectorAll('tbody input.form-check-input.match:checked');
						
						if(trListDoc.length ==1 ){
							trListDoc.forEach(e =>{

								
	
											
								ids.push({
									'iddoc': e.id,
									'idnegoc':  idnegoc,
									'llaveitem':  llave,
									'fecha': fecha,
									'type': color,
									'sid' : sid()
								});
	
	
	
							});
						}else{
							errorMsg = 'Solo puede seleccionar una rendición'
							
						}


						


						
					}
				}
			}
		}
	}



	



		

	


	//PROCESO DE JUSTIFICACIÓN

	if(errorMsg!='' ){
		
		switchProcess(false);
		alertObj.msg =errorMsg;
		alertObj.type = 'danger';
		alertLoad(alertObj, 'alertas-modal');
	}else{
		
		setJustify(ids, color)
		.then(res => {
			
			switchProcess(false);
			if(res.data[0].success){
				btnClose.click();
				
				alertObj.type = 'success';
				alertObj.msg = 'Justificado con exito!!!';
				getDocumentosXRevisar(f.value);
			}else{
				alertObj.type = 'danger';
				alertObj.msg = res.data[0].errorMsg;
			}
			
			
			alertLoad(alertObj, 'alertas-modal');

			


		})
		.catch(err =>{
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
				justifyBtn.style.backgroundColor  = "#03D6F9";
				justifyBtn.style.color  = "black";
				filtro_fecha.style.display='none';
				filtro_fecha_fxr.style.display='none';
				if(massive){
					checkMassive.style.display =  "none";
					checkMassive.checked = false;
				}
				
				bts.forEach(e =>{
					if(e.style.display==""){
						if(!e.classList.contains('black')){
							e.style.backgroundColor  = "#03D6F9";
							e.style.color  = "black";
						}
					
					}
				});

			break;
		case 'red':
				filtro_fecha.getElementsByTagName('label')[0].textContent= 'Filtrar negocios por año:'
				modaltitle.textContent = 'Selecciona negocio e item :';
				justifyBtn.textContent = 'Crear y Justificar';
				justifyBtn.style.backgroundColor  = "#FC4903";
				justifyBtn.style.color  = "white";
				filtro_fecha.style.display='';
				filtro_fecha_fxr.style.display='none';
				

				bts.forEach(e =>{
					if(e.style.display==""){
						if(!e.classList.contains('black')){

							e.style.backgroundColor  = "#FC4903";
							e.style.color  = "white";
						}

					}
					

				});
				if(massive){
					checkMassive.style.display = "";
					checkMassive.checked = true;
				}
				

			break;
		case 'green':	
				modaltitle.textContent = 'Gastos coincidentes:';
				justifyBtn.textContent = 'Justificar';
				justifyBtn.style.backgroundColor = "#34CC02";
				justifyBtn.style.color  = "white";
				filtro_fecha.style.display='none';
				filtro_fecha_fxr.style.display='none';
				if(massive){
					checkMassive.style.display = "";
					checkMassive.checked = true;
				}
				bts.forEach(e =>{
					if(e.style.display==""){
						if(!e.classList.contains('black')){

							e.style.backgroundColor  = "#34CC02";
							e.style.color  = "white";
						}
					}
					
				});
				

			break;
		case 'orange':	
				modaltitle.textContent = 'Asignar pendientes:';
				justifyBtn.textContent = 'Asignar';
				justifyBtn.style.backgroundColor = "#F9BD00";
				justifyBtn.style.color  = "white";
				filtro_fecha.style.display='none';
				filtro_fecha_fxr.style.display='none';
				if(massive){
					checkMassive.style.display = "";
					checkMassive.checked = false;
				}
				
				bts.forEach(e =>{
					if(e.style.display==""){
						if(!e.classList.contains('black')){

							e.style.backgroundColor  = "#F9BD00";
							e.style.color  = "white";
						}
					}
					
				});
			break;
		case 'yellow':	
			filtro_fecha_fxr.getElementsByTagName('label')[0].textContent= 'Filtrar gastos por año:'
			modaltitle.textContent = 'Asignar pendientes:';
			justifyBtn.textContent = 'Justificar gasto';
			
			filtro_fecha.style.display='none';
			filtro_fecha_fxr.style.display='';

			if(massive){
				checkMassive.style.display = "none";
				checkMassive.checked = false;
			}
			

		break;
		case 'grey':	
			filtro_fecha_fxr.style.display='none';
			modaltitle.textContent = 'Asignar nota de credito:';
			justifyBtn.textContent = 'Asigar NC';
			
			filtro_fecha.style.display='none';
			filtro_fecha_fxr.style.display='';

			if(massive){
				checkMassive.style.display = "none";
				checkMassive.checked = false;
			}
			

			break;
		case 'black':	
			filtro_fecha_fxr.style.display='none';		
			filtro_fecha.style.display='none';
			filtro_fecha_fxr.style.display='';

			if(massive){
				checkMassive.style.display = "none";
				checkMassive.checked = false;
			}
				
			

		break;
		default:
			filtro_fecha_fxr.style.display='none';
			if(massive){
				checkMassive.style.display = "none";
				checkMassive.checked = false;
			}
			
			break;
	}


	bts.forEach(e =>{
		if(e.classList.contains('black')){
			if(colorValue !="black"){
				e.textContent  = "Anular";
			}else{
				e.textContent  = "Desanular";
			}
			
			
		}
	
	
	});
	

}


const findBusiness = (obj,manual) =>{

	
	const value = obj.currentTarget.value.toLowerCase();
	const dl = document.getElementById(obj.target.attributes.list.value);
	let currentOpts =[];
	const opts= dl.getElementsByTagName("option");
	if(opts.length>0)
	currentOpts =  Array.from(opts).filter(o =>  o.attributes.value.value.toLowerCase() == value.toLowerCase() )

	if (currentOpts.length != 0) {
			
		loadingLoad('loading-modal', true,'Buscando negocios...');
		let dli = document.getElementById(`il${obj.target.attributes.iddoc.value}`);
		eraseHtml(`il${obj.target.attributes.iddoc.value}`);
		let ili = document.getElementById(`is${obj.target.attributes.iddoc.value}`);
		ili.value='';

		getItems(currentOpts[0].attributes.id.value)
		.then(res =>{
			

		   
			if (res.data.rows.length>0) {
				
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
	
	
	
	
	}else{
		
		if (obj.keyCode === 13) {
				
		loadingLoad('loading-modal', true,'Buscando negocios...');
			dl.innerHTML='';
			if (value.length > 0) {
				getBusiness(value,filtro_fecha.children[1].value)
				.then(res =>{
					
	
				
					if (res.data.records.total_records>0) {
						
						let superrow = '';
						let loops =res.data.records.total_records;
						let row="";
						let data =res.data.data.rows.reverse();
						for(let i=0;i<loops;i++){
							
							row = data.pop();
							superrow += `<option value="${row.folio} - ${row.referencia}" id="${row.id}"></option>`;

						}
						
						dl.innerHTML = superrow;
						superrow="";
					}else{
						
						
						alertObj.msg ='No se encontraron negocios, intente con otra referencia o folio.';
						alertObj.type = 'warning';
						alertLoad(alertObj, 'alertas-modal');
					}
					
					loadingLoad('loading-modal', false);
					obj.target.click();
				});
			
			}else{
				loadingLoad('loading-modal', false);
				obj.target.focus();
			}
		}
	
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


const verifyChecked = (massive = false) => {
	
	const tr = table.getElementsByTagName("tr");
	let cont = 0;
	let colorCheck = localStorage.getItem('colorCheck')
	let pendingColorCheck =  localStorage.getItem('pendingColorCheck')


	for (i = 0; i < tr.length; i++) {
		td = tr[i].getElementsByTagName("td")[0]?.getElementsByTagName('input')[0].checked;

		if (td) {
			cont++;
		}
	}

	if (cont == 0) {
		if(!massive){
			localStorage.setItem('colorCheck', '')
			localStorage.setItem('pendingColorCheck', '')

		}
	

		bts.forEach(function (bts_ele) {
			bts_ele.style.display = "none"
		});

	}else{
		
		if(colorCheck=="orange")
				colorCheck = pendingColorCheck;
			
		bts.forEach(bts_ele => {

			
			if(bts_ele.classList.contains(colorCheck)){
				bts_ele.style.display = ""
				
				if(pendingColorCheck != ""){
					if(bts_ele.classList.contains('red'))
						bts_ele.style.display = "none"
				}

				
			}else{
				

				//YELLOW BUTTON ---> JUSTIFICAR GASTO OC/FXR

				bts_ele.style.display = "none"
				
				
				if(pendingColorCheck != ""){
					if(bts_ele.classList.contains('red'))
						bts_ele.style.display = "none"
				}
				if(bts_ele.classList.contains('yellow') && colorCheck=='green')
					bts_ele.style.display = "none"
				else
				if(bts_ele.classList.contains('yellow') && colorCheck !='grey' && colorCheck !='black' )
					bts_ele.style.display = ""

				if(bts_ele.classList.contains('black') && pendingColorCheck =='')
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
			switchStyle(colorValue,false);
			if(document.querySelector(`.${colorValue}`))
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
		if(checked>1){
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

	let tr, td, i, colorValue,pendingColorValue;
	let h = obj.currentTarget.value;
	let change = true;
	let cont = 0;

	
		
		tr = table.getElementsByTagName("tr");

		for (i = 0; i < tr.length; i++) {
			td = tr[i].getElementsByTagName("td")[0]?.getElementsByTagName('input')[0];
			

			if (td ) {
				colorValue = td.attributes.colorselector.value;
				pendingColorValue = td.attributes.pendingcolorselector.value;

				if (colorValue.toUpperCase().indexOf(h.toUpperCase()) > -1 ) {
					
					
					if(colorValue !='blue' && colorValue !='orange' && h.toUpperCase() != 'CANCEL' && colorValue !='grey' && colorValue !='black'){
						td.checked = true;
						localStorage.setItem('colorCheck', colorValue);
						localStorage.setItem('pendingColorCheck', pendingColorValue)

					}else{
					//	switchDisplay(false,'grey')
						td.checked = false;
					}
					
					
					tr[i].style.display = "";
					cont++;


				} else if ( h.toUpperCase() == 'CANCEL' ){
					td.checked = false;
					tr[i].style.display = "";

				}else{
				
					td.checked = false;
					tr[i].style.display = "none";
				}

			}
		}

		
		if(h.toUpperCase() == 'CANCEL'){
			switchDisplay(false,'grey')
			switchDisplay(false,'black')
			switchDisplay(false,'orange')
		}else{
			//BADGE DE CONTEO DE DOCUMENTOS
			badge_cont.textContent = cont
		}
		
		if(change){
			localStorage.setItem('colorCheck', h);
			//localStorage.setItem('pendingColorCheck', pendingColorValue)
		}
	
	

	


	

	verifyChecked();
	switchStyle(localStorage.getItem('colorCheck'));
}

const match = (event) => {
	
	loadingLoad('loading-modal', true);
	eraseHtml('modal-list');
	let red_type, tr, td,yellow_type;
	let ids = [];
	red_type = event.currentTarget.classList.contains('red');
	yellow_type =  event.currentTarget.classList.contains('yellow');
	black_type =  event.currentTarget.classList.contains('black');


	if(yellow_type){
		localStorage.setItem('colorCheck', 'yellow');
		switchStyle();

	}
		

	tr = table.getElementsByTagName("tr");

	for (i = 0; i < tr.length; i++) {
		td = tr[i].getElementsByTagName("td")[0]?.getElementsByTagName('input')[0];

		if (td && td.checked) {
			if(red_type){
				
				let folio =tr[i].getElementsByTagName("td")[1].textContent;
				ids.push({
					'id': td.attributes.id.value,
					'folio': `Folio Documento :  N° ${tr[i].getElementsByTagName("td")[1].textContent}`,
					'total':  tr[i].getElementsByTagName("td")[9].textContent,
					'proveedor': tr[i].getElementsByTagName("td")[2].textContent,
					'tipo': tr[i].getElementsByTagName("td")[4].textContent,
					'fecha': tr[i].getElementsByTagName("td")[3].textContent,
				});
			}else{
				ids.push(
					td.attributes.id.value
				);
				
			}	
			

		}
	}

	listObject = new List();
	
	if(red_type){
		if(event.currentTarget.classList.contains('two')){

			if(confirm(`Esta accion creara  ${ids.length==1?'el':'los'} ${ids.length} ${ids.length==1?'documento':'documentos'} en estado "Por asignar " para su posterior asociacion a un gasto. Confimar ?`)){
				let ids2 = [];
				ids.forEach(ids_e =>{
					ids2.push({
						'iddoc': ids_e.id,
						'idnegoc':  0,
						'llaveitem':  "",
						'fecha': ids_e.fecha,
						'type': "red",
						'sid' : sid(),
						'pending': true
					});

				});


				setJustify(ids2, "red")
				.then(res => {
					
				
					alertObj.type = 'success';
					alertObj.msg = 'Documentos creados con exito!!!';
					alertLoad(alertObj, 'alertas');
					getDocumentosXRevisar(f.value);


				})
				.catch(err =>{
					
					alertObj.type = 'danger';
					alertObj.msg = 'Hubo un inconveniente, favor contactar a soporte!!';
					alertLoad(alertObj, 'alertas-modal');
				});
					
			}
		
		}else{
			let row = [];
	
			ids.forEach(ids_e =>{
				
				
				let adicional = [];
	
				adicional.push( `<div class="" id="loading-search-neg-${ids_e.id}" style="display:none"><div class="spinner-border text-success" role="status">
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
				adicional.push( `<div class="searchbar  input-group">
									<label class="input-group-text" for="il${ids_e.id}" style="width: 35%;">Item</label>
									<input list="il${ids_e.id}" id="is${ids_e.id}" ${ids_e.id} class="form-control is "  type="text" placeholder="Buscar item..." autocomplete="off">
									<div id="search_list">
										<datalist id="il${ids_e.id}" >
										</datalist>
									</div> 
								</div>`);	
				adicional.push( `<div  class="input-group" style="text-align: left;">
									<label for="fecha-oc-${ids_e.id}" style="width:35%;" class="input-group-text">Fecha OC</label>
									<input id="fecha-oc-${ids_e.id}" type="date" class="form-control" value="${ ids_e.fecha.split('-').reverse().join('-')}">
								</div>`);	
										
								
				row.push({
					'class1':'lielement', 
					'l1': ids_e.folio,
					'link1': ids_e.proveedor,
					'l2': ids_e.tipo,
					'l3': ids_e.fecha,
					'l4':  ids_e.total,
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

	
	}else if(!black_type){
		let green = event.currentTarget.classList.contains('green');
		let fxr = event.currentTarget.classList.contains('yellow');
		
		getMatch(ids, red_type,fxr,filtro_fecha.children[1].value,green);
	}else{
		let action_des =  event.currentTarget.textContent == "Desanular" ? 'desanulara' : 'anulara'

		if(confirm(`Esta acción ${action_des} ${ids.length} ${ids.length==1?'documento':'documentos'}. Confimar ?`)){
			let ids2 = [];
			ids.forEach(ids_e =>{
				ids2.push({
					'iddoc': ids_e,
					'sid' : sid(),
					"action": event.currentTarget.textContent == "Desanular" ? 'desanular' : 'anular'
					
				});

			});


			setActions(ids2)
			.then(res => {
				
				
				alertObj.type = 'success';
				alertObj.msg = `Documentos ${action_des=='desanulara' ? 'desanulados':'anulados'} con exito!!!`;
				alertLoad(alertObj, 'alertas');
				getDocumentosXRevisar(f.value);


			})
			.catch(err =>{
				
				alertObj.type = 'danger';
				alertObj.msg = 'Hubo un inconveniente, favor contactar a soporte!!';
				alertLoad(alertObj, 'alertas-modal');
			});
				
		}
	
	}

	


}



const getMatch = (ids, red_type,fxr,year,green) => {
	getOcMatch(ids, red_type,fxr,year)
	.then(res => {
		listObject = new List();

		

		res.data.forEach(res_e => {
			
			let row = [];

			let iddoc = res_e.data.iddoc;
			res_e.data.rows.forEach(e => {
				
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

				row.push({
					'class1':'lielement', 
					'l1': e.folio,
					'link1': `<a href="http://${window.location.host}/4DACTION/wbienvenidos#compras/content.shtml?id=${e.idoc}" target="_blank">
								<div class="fw-bold">${e.referencia}</div>
							</a>`,
					'l2': e.proveedor,
					'l3': e.fecha_emision,
					'l4': parseFloat( e.total_oc),
					'adicional': [select],
					'l5': `<input class="form-check-input" ${green ? 'checked' : 'onclick="verifyModalCheck(this)"' }   style="float: right;" type="checkbox" value="" id="check${e.idoc}">`

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



//----------------------------------------------------------------
//----------------------- Card Load section ----------------------
//----------------------------------------------------------------



//----------------------------------------------------------------
//----------------------- Table Load section ---------------------
//----------------------------------------------------------------


//-------------TABLA DTC´s

const getDocumentosXRevisar = (date,estado = "TODOS") => {

	//BADGE DE CONTEO DE DOCUMENTOS
	badge_cont.textContent = "0"
	
	loadingLoad('loading', true);
	eraseHtml('tables');
	eraseHtml('msg');
	verifyChecked();
	getDocXRev(date,estado)
		.then((res) => {
			
			tableObject = new Table();
			tableObject.headers = [`<button type="button" id="btnColorSelectorMasivo" class="btn" style="cursor: pointer;" > 
			<input class="form-check-input" style="display: none;" id="checkColorSelectorMasivo" type="checkbox" value=""></button>`, 'Numero', 'Emisor', '','Fecha emisión', 'Tipo', 'Neto', 'Impuesto' ,'%' , 'Total','',''];

			let cont = 0;
			let color = '';
			let cs = '';
			
			if (res.records.total_records > 0) {
				res.data.rows.forEach(function (res_ele) {
					let pendingColor =  '';
					let classification = '';
					if(res_ele.pendiente){
						color = '#F9BD00';
						cs = 'orange';
					

						if (res_ele.recordsMatch == 1) {
							pendingColor =  'green';
						} else if (res_ele.recordsMatch == 0) {
							pendingColor =  'red';
						} else {
							
							pendingColor =  'blue';
						}
					}else{
						if(res_ele.tipo != "NOTA DE CREDITO ELECTRONICA" && res_ele.status){
							cont += 1;
							switch(res_ele.recordsMatch){
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

						}else if(!res_ele.status){
							color = '#000000';
							cs = 'black';
						}else{
							color = '#c2c5c3';
							cs = 'grey';
							classification= "NC"
						
						}
						
						
					}		

						

					let tooltip_row = `<div class='container' id='tooltip'>
										<div class='container' >
											<div class='row' >
												<div class='col-4'>
												<strong>

												Fecha Recepción
												</strong>
												</div>
												<div class='col-4'>
												<strong>
												Receptor
												</strong>
												</div>
												<div class='col-4'>
												<strong>

												Pagada
												</strong>
												</div>
											</div>
											<div class='row'>
												<div class='col'>
												${res_ele.fecha_recepcion}
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
										<div class='container' >
											<div class='row' >
												<div class='col-4'>
												<strong>

												Descripción
												</strong>
												</div>
												
											</div>
											<div class='row'>
												<div class='col'>
												${res_ele.description !='' ? res_ele.description :' S/D'}
												</div>
												
											</div>
										</div>
										</div>`;
					let row = [];

					row.push(`<button type="button" id="btn-match-${cont}" class="btn match" style="cursor: pointer;" ${res_ele.blocked ? ' title="Este documento no se puede desanular"   ':''}> 
						<input  ${res_ele.blocked ? 'disabled ':''} class="form-check-input match" style="background-color:${color};" id="${res_ele.id}" colorselector="${cs}" pendingcolorselector="${pendingColor}" classification="${classification}" type="checkbox" value="" id="flexCheckDefault"></button>`);

					row.push(res_ele.folio);
					row.push(res_ele.proveedor);
					row.push(`<button type="button" class="btn"  data-bs-toggle="tooltip" data-bs-html="true" data-bs-placement="top" title="${tooltip_row}">
					<i class="fas fa-info"></i>
				  </button>`);
					row.push(res_ele.fecha);
					row.push(res_ele.tipo);
				
					row.push(`$${new Intl.NumberFormat("de-DE").format(res_ele.neto)}`);
					row.push(`$${new Intl.NumberFormat("de-DE").format(res_ele.impuesto)}`);
					row.push(`${res_ele.impuesto_porc}%`);

				
					row.push(`$${new Intl.NumberFormat("de-DE").format(res_ele.total)}`);
					row.push(`<button type="button" class="btn" title="Descargar XML" ${res_ele.xml !='' ? '' : ' style="display: none;"'}>
								<a class="" style="text-decoration: none;" href="${res_ele.xml}"  target="_blank"><i class="far fa-file-code fa-2x" style="color:#03D6F9"></i></a>
							</button>
							<button type="button" class="btn" title="Descargar pdf" ${res_ele.pdf !='' ? '' : ' style="display: none;"'}>
								<a class="" style="text-decoration: none;" href="${res_ele.pdf}"  target="_blank"><i class="far fa-file-pdf fa-2x" style="color:#F9BD00"></i></a>
							</button>`);
				
					tableObject.bodyRows.push(row);

					


				})

				tableLoad(tableObject, 'tables');

				let btns = document.querySelectorAll(`input.match`);
				btns.forEach(b => b.addEventListener("click", (event) => verifyCheck(event)));

						
				//CHECK HEADERS TABLA DOCUMENTOS
				let checkMasivo =  document.getElementById('checkColorSelectorMasivo');
				checkMasivo.addEventListener("click", (event) => checkMassiveAction(event));


				//OCULTAR COLORES
				switchDisplay(false,'grey')
				switchDisplay(false,'black')
				switchDisplay(false,'orange')
				

				//Inicializar tooltips
				var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
				var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
					return new bootstrap.Tooltip(tooltipTriggerEl)
				})


				//BADGE DE CONTEO DE DOCUMENTOS
				badge_cont.textContent = cont


				loadingLoad('loading', false);


			} else {
				loadingLoad('loading', false);
				simpleMsg('NO SE ENCONTRARON DOCUMENTOS POR REVISAR, TODO HA SIDO REGISTRADO!!', 'msg', true);

			}


		})
		.catch(err => {
			loadingLoad('loading', false);
			alert('Hubo un error!!', err);

		})
}

const switchDisplay = (status,color) =>{

	tr = table.getElementsByTagName("tr");
	let cont = 0;
	for (i = 0; i < tr.length; i++) {
		td = tr[i].getElementsByTagName("td")[0]?.getElementsByTagName('input')[0];
		

		if (td ) {
			colorValue = td.attributes.colorselector.value;
			pendingColorValue = td.attributes.pendingcolorselector.value;

			if (colorValue.toUpperCase().indexOf(color.toUpperCase()) > -1 || color.toUpperCase() == 'CANCEL' ) {
				
	
				tr[i].style.display = "none";


			}else{
				if(tr[i].style.display == "")
				cont ++;
			}

		}
	}
	//BADGE DE CONTEO DE DOCUMENTOS
	badge_cont.textContent = cont

}

const checkMassiveAction = (obj) =>{
	

	let tr, td, i, colorValue,pendingColorValue;
	let h = obj.currentTarget.checked;
	let colorCheck = localStorage.getItem('colorCheck')
	let pendingColorCheck =  localStorage.getItem('pendingColorCheck')
	
	if(colorCheck != ""){
		tr = table.getElementsByTagName("tr");

		for (i = 0; i < tr.length; i++) {
			td = tr[i].getElementsByTagName("td")[0]?.getElementsByTagName('input')[0];
			

			if (td ) {
				colorValue = td.attributes.colorselector.value;
				pendingColorValue = td.attributes.pendingcolorselector.value;

				

				// if (colorValue == colorCheck && colorValue !='blue' && colorValue !='orange') {
				if (colorValue == colorCheck && colorValue !='blue') {

					tr[i].style.display = "";
				
					if(h){
					
						td.checked = true;
					}else{
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
	
	getMatch([], false,true,filtro_fecha_fxr.children[1].value,false);




});


//----------------------------------------------------------------
//----------------------------- INIT FUNCTION------------------------------
//----------------------------------------------------------------



(function init() {

	


	//-----------------------   VARIABLES   ----------------------------

	const finder = document.getElementById('searchDtc');
	const reload = document.getElementById(`reload`);
	const colorSelectors = document.querySelectorAll('.colorSelector');

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

	let filtro =filtro_fecha.children[1];
		for(let i=y-10;i<=y+1;i++){	
			filtro.innerHTML +=`<option value="${i}" id="${i}" ${i==y? 'selected' : ''}>${i}</option>`;
		}
	
			

	//----------- Set fecha filtro frx modal-match


		let filtro_fx =filtro_fecha_fxr.children[1];
		for(let i=y-10;i<=y+1;i++){	
			filtro_fx.innerHTML +=`<option value="${i}" id="${i}" ${i==y? 'selected' : ''}>${i}</option>`;
		}

	//-----------------------   EVENTOS   ---------------------------------------------------------------

	//FINDER

	finder.addEventListener("keyup", (ff) => {
		
		let table, tr, td, i, txtValue;
		let h = ff.currentTarget.value;
		table = document.getElementById("tables");
		tr = table.getElementsByTagName("tr");

		for (i = 0; i < tr.length; i++) {
			td = tr[i].getElementsByTagName("td")[0]?.getElementsByTagName('input')[0];

			if (td && !td.checked) {
				td = tr[i].getElementsByTagName("td")[2];
				if (td) {
					txtValue = td.textContent || td.innerText;
					if (txtValue.toUpperCase().indexOf(h.toUpperCase()) > -1) {
						tr[i].style.display = "";
					} else {
						tr[i].style.display = "none";
					}
				}
			}
		}
	
	});
	

	//RELOAD
	reload.addEventListener("click", () => SetReload(f.value));

	//DATE
	f.addEventListener("change", () => getDocumentosXRevisar(f.value));

	//COLOR SELECTOR
	colorSelectors.forEach(c => c.addEventListener("click", (event) => colorSelector(event)));

	//BUTTONS ACTIONS
	bts.forEach(c => c.addEventListener("click", (event) => match(event)));


	//-----------------------   Ejecutables   -----------------------------


})();