




let validate = async  (data) => {

	let config  =  {
					
		method: 'post',
		url:  `${localStorage.getItem('node_url')}/login-sii?hostname=${window.location.origin}&clave=${data}&sid=${sid()}`,
					
	};

    try{
    	return await axios(config);
    }catch(err){
    	throw err;
    }
	

}
 	
    


