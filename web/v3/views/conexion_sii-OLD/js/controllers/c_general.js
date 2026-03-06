let getInfo = async () => {
    let config  =  {
				
        method: 'get',
        url: `https://${window.location.host}/4DACTION/_light_get_server_info`,
                    
    };
    try{
        let res= await  axios(config);
        return res;
    }catch(err){
        throw err;
    }
    
}

const getBusiness = async (q,y,t="") => {

    
    let tipo="business";

	
    let config  =  {
            
            method: 'get',
            url: `${localStorage.getItem('node_url')}/light-search?q=${q}&hostname=${localStorage.getItem('web_url')}&tipo=${tipo}&presupuestos=true&year=${y}&limit=100`
    };
        
    try{
        let res= await  axios(config);
        return res;
    }catch(err){
        throw err;
    }
    
       

}


const getItems = async (id,q='') => {

    
    let tipo="item";

		  	
    let config  =  {
            
            method: 'get',
            url: `${localStorage.getItem('node_url')}/light-search?q=${q}&hostname=${localStorage.getItem('web_url')}&tipo=${tipo}&limit=20&id=${id}`
    };
        
    try{
        let res= await  axios(config);
        return res;
    }catch(err){
        throw err;
    }
    
       

}