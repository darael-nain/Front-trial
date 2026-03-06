var area = {
	container : $("#area"),
	menubar : $('#menu ul'),
	init: function(id) {
            
            if(id === null) id = 0;
            // if(id !== null){
                  $.ajax({
                    'url':'/4DACTION/_V3_proxy_getAreaNegocio',
                    data:{
                      "id" : id
                    },
                    dataType:'json',
                    async: false,
                    success:function(data){
                        
                        unaBase.doc = data;

                        for(let i of Object.keys(unaBase.doc)){
                              setterHtml(unaBase.doc[i], `input[name="${i}"]` )
                        }

                    }
                  });

            // }
          
	},
	menu: function(){
            
	    unaBase.toolbox.init();
	    unaBase.toolbox.menu.init({
		entity: 'AreaNegocio',
		buttons: ['save','exit'],
		data: function(){
                  let data = {};
                  
       
                  for(let i of Object.keys(unaBase.doc)){
                        data[i] = document.querySelector(`input[name="${i}"]`)[getType(unaBase.doc[i])]
                  }
                  



			return data;
		},
		validate: function() {
			return true;
		}
      });
  }   
}