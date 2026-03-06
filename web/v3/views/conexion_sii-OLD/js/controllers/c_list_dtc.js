

let getSiiDtc= async  (date) => {
		
	


	let config  =  {
					
		method: 'get',
		url: `${localStorage.getItem('node_url')}/get-sii-dtc?hostname=${window.location.host}&date=${date}`,

					
	};

    try{
		let res= await axios(config);
    	return   res.data.data?.rows;
    }catch(err){
    	throw err;
    }
	
	
}


const getDocXRev = async  (date,estado) => {

	let config  =  {
					
		method: 'get',
		url: `${localStorage.getItem('node_url')}/get-doc-x-rev?hostname=${window.location.host}&date=${date}&estado=${estado}`,
					
	};
	

    try{
		let res= await axios(config);
    	return   res.data;
    }catch(err){
    	throw err;
    }
	
}
 	
 


 const setActions = async  (ids,action) => {

	let config  =  {
					
		method: 'post',
		url: `${localStorage.getItem('node_url')}/set-justify?hostname=${window.location.host}&action=${action}&sid="${sid()}"`,
		data: ids	
	};

    try{
    	return  axios(config);
    }catch(err){
    	throw err;
    }
	
}

const getOcMatch = async  (ids,type,fxr,date) => {
	
	let config  =  {
					
		method: 'post',
		url: `${localStorage.getItem('node_url')}/get-oc-match?hostname=${window.location.host}&type=${type}&fxr=${fxr}&date=${date}`,
		data: ids	
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
		url: `${localStorage.getItem('node_url')}/set-justify?hostname=${window.location.host}&type=${type}&sid="${sid()}"`,
		data: ids	
	};

    try{
    	return  axios(config);
    }catch(err){
    	throw err;
    }
	
}

const downloadPDFDTC = (id,folio) => {

	console.log("ID EN C_LIST_DTC: ", id)

	var url =
		localStorage.getItem('node_url') +
		"/download-pdf-dtc/?download=true&entity=conexion_sii" +
		"&id=" +
		id +
		"&folio=" +
		folio +
		"&sid=" +
		sid() +
		"&hostname=" +
		window.location.origin;

		var download = window.open(url);
        download.blur();	
		window.focus();



}
 	
    
    