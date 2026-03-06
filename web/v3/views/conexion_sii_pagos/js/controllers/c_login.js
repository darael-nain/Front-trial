let validate = async  (data) => {

	let config  =  {
					
		method: 'post',
		url:  `http://${window.location.hostname}:${( localStorage.getItem('node_port'))}/login-sii?hostname=${window.location.origin}&clave=${data}&sid=${sid()}`,
					
	};

    try{
		
    	return await axios(config);
    }catch(err){
    	throw err;
    }
	

}
 	
    


