

let getSiiMovDtc= async  (date) => {
		

	let config  =  {
		method: 'get',
		url: `${localStorage.getItem('node_url')}/get-mov-dtc?hostname=${window.location.origin}&date=${date}`,				
	};
	

    try{
		let res = await axios(config);
    	return res.data.data?.rows;
    }catch(err){
    	throw err;
    }
	
	
}


const getDocXRev = async  (date,estado) => {

	let config  =  {
		method: 'get',
		url: `${localStorage.getItem('node_url')}/get-doc-x-rev?hostname=${window.location.origin}&date=${date}&estado=${estado}`,			
	};

    try{
		let res= await axios(config);
    	return res.data;
    }catch(err){
    	throw err;
    }
	
}

//Este es nuevo para los movimientos bancarios
const getMovimientos = async  (date,estado,cuenta_banco) => {

	let config  =  {		
		method: 'get',
		url: `${localStorage.getItem('node_url')}/get-mov-bancarios?hostname=${window.location.origin}&date=${date}&estado=${estado}&cuentabanco=${cuenta_banco}`,			
	};

    try{
		let res= await axios(config);
    	return   res;
    }catch(err){
    	throw err;
    }
	
}

const getComprobantes = async  (id) => {

	let config  =  {
		method: 'get',
		url: `${localStorage.getItem('node_url')}/get-comprobante?hostname=${window.location.origin}&id=${id}&sid=${sid()}&formated=true`,			
	};

    try{
		let res= await axios(config);
    	return   res;
    }catch(err){
    	throw err;
    }
	
}


const getBancosEmpresa = async  (estado) => {

	let config  =  {
					
		method: 'get',
		url: `${localStorage.getItem('node_url')}/get-bancos?hostname=${window.location.origin}&estado=${estado}`,
					
	};

    try{
		let res= await axios(config);
    	return   res.data;
    }catch(err){
    	throw err;
    }
	
}

const getPlanCuentas = async () => {
	let config = {
		method: 'get',
		url: `${window.location.origin}/4DACTION/_force_getPlanAccounts?only_accounts=true`,
	};

	try {
		let res = await axios(config);
		return res.data;
	} catch (err) {
		throw err;
	}
}
 	
 


 const setActions = async  (ids,action) => {

	let config  =  {
					
		method: 'post',
		url: `${(localStorage.getItem('node_url'))}/set-justify?hostname=${window.location.origin}&action=${action}&sid=${sid()}`,
		data: ids	
	};

    try{
    	return  axios(config);
    }catch(err){
    	throw err;
    }
	
}

const getMovMatch = async  (ids,type) => {
	
	let config  =  {
					
		method: 'post',
		url: `${(localStorage.getItem('node_url'))}/get-mov-match?hostname=${window.location.origin}&type=${type}`,
		data: ids	
	};

    try{
    	return  axios(config);
    }catch(err){
    	throw err;
    }
	
}

const getTipoPagos = async  () => {
	
	let config  =  {
					
		method: 'post',
		url: `${(localStorage.getItem('node_url'))}/get_tipo_pagos?hostname=${window.location.origin}`,
	};

    try{
    	return  axios(config);
    }catch(err){
    	throw err;
    }
	
}
 	

const setJustify = async  (ids,type) => {

	let config  =  {
					
		method: 'post',
		url: `${(localStorage.getItem('node_url'))}/conciliar?hostname=${window.location.origin}&type=${type}&sid="${sid()}"`,
		data: ids	
	};

    try{
    	return  axios(config);
    }catch(err){
    	throw err;
    }
	
}


const importCartola = async  (data) => {

	let config = {
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		method: 'post',
		url: `${localStorage.getItem('node_url')}/import-excel?hostname=${window.location.origin}&sid="${sid()}"`,
		data

	};

    try{
    	return  axios(config);
    }catch(err){
    	throw err;
    }
	
}

 	
    
    