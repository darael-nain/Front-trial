

//----------------------------------------------------------------
//----------------------- Init --------------
//----------------------------------------------------------------

isConnected('login');



//----------------------------------------------------------------
//----------------------- Global Var --------------
//----------------------------------------------------------------



var btnLogin = document.getElementById("acceder");

//----------------------- Card Load section ----------------------
//----------------------------------------------------------------




//----------------------- Generals functions ----------------------
//-----------------------------------------------------------------

	
let validateCredencials = () =>{

	loadingLoad('loading', true);

	let pass = document.getElementById('password-sii');
	let alertObj = new Alert();
	alertObj.type = 'danger';

	if (pass.value!="") {
		
		pass.disabled=true;
		btnLogin.disabled=true;
			validate(pass.value)
			.then((res)=>{
				
			
				if(res.data.success){
					if(res.data.connection_sii_status)
					location.href = window.location.origin +'/v3/views/conexion_sii_pagos/view/list_pagos.html?v=12121211';
					else
					location.href = window.location.origin +'/v3/views/conexion_sii_pagos/view/standby_screen.html?v=1212121';

				}else{
					if(res.data.errors){
						res.data.errors.forEach(e => {
							alertObj.msg += e + '<br>';
						});
					

					}else{
						alertObj.msg = res.data.message;

					}
					

					alertLoad(alertObj, 'alertas')
				}
					
				
					btnLogin.disabled=false;
					pass.disabled=false;
					loadingLoad('loading', false);

			})
			.catch( err =>{
				
				alertObj.msg = 'Hubo un error!!, favor comunicarse con soporte';
				alertLoad(alertObj, 'alertas')
			
				btnLogin.disabled=false;
				pass.disabled=true;
				loadingLoad('loading', false);

			});

	}else{
		alertObj.msg = 'Debe introducir la contraseña.';
		alertLoad(alertObj, 'alertas')
		loadingLoad('loading', false);

	}



}

 

function initLogin() {
   
	btnLogin.addEventListener("click", (event) => validateCredencials());

};


 




