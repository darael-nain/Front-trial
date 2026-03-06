
let getInfo = async () => {
    let config  =  {
        
        method: 'get',
        url: `https://${window.location.host}/4DACTION/_light_get_server_info?sid=${sid()}`,
                    
    };
    try{
        let res= await  axios(config);
        return res;
    }catch(err){
        throw err;
    }
    
  }
  
  
  const isConnected = (ref) => {
    getInfo()
    .then(res => {
     
      if(!res.data.logged_in){
        location.href = `${window.location.origin}`;
      }
      
     
  
    });
  
  }

