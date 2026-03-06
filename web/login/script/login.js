var ready =	function(callback){
	const urlParams = new URLSearchParams(window.location.search);
	const state = urlParams.get('state');
	console.log(`--------${state}`);
	console.log(`--------${state}`);
    // in case the document is already rendered
    if (document.readyState!='loading') callback();
    // modern browsers
    else if (document.addEventListener) document.addEventListener('DOMContentLoaded', callback);
    // IE <= 8
    else document.attachEvent('onreadystatechange', function(){
        if (document.readyState=='complete') callback();
    });
}


var url_string = window.location.href; //window.location.href
var urlx = new URL(url_string);
var reqUrl = urlx.searchParams.get("reqUrl");
var toolcontent = '<div class="passwordRecovery" >'+  
        '<h1>Recuperación de contraseña</h1>'+ 
        '<p>Ingresa tu usuario y correo registrado, te enviaremos una clave temporal que después podrás cambiar.</p><br>'+
          '<span>Usuario</span><input type="text" required="" name="login"><br>'+
          '<span>Correo electrónico</span><input type="mail" required="" name="mail"><br><br>'+
        '<input onclick="pass()" type="button" name="reiniciar" value="Recuperar contraseña"><br><br>'+
      '</div>';  
var toolcontentFunc = user => {
	return '<div class="passwordRecovery" >'+  
        '<h1>Recuperación de contraseña</h1>'+ 
        '<p>Ingresa tu usuario y correo registrado, te enviaremos una clave temporal que después podrás cambiar.</p><br>'+
          '<span>Usuario</span><input type="text" required="" name="login" value="'+user+'"><br>'+
          '<span>Correo electrónico</span><input type="mail" required="" name="mail"><br><br>'+
        '<input onclick="pass()" type="button" name="reiniciar" value="Recuperar contraseña"><br><br>'+
      '</div>';  
}

var login = function(event) {
	let userInput = $('input[name="txtUsuario"]');
	let passInput = $('input[name="txtPassword"]');
	$.ajax({
		url: '/4DACTION/W_INICIA_SESION',
		data: {
			'txtUsuario': userInput.val(),
			'txtPassword': passInput.val()
		},
		type: 'POST',
		async:false,
		dataType: 'json',
		success: function(data) {
			console.log(data.state);
			switch(data.state){
				case 'validacion':

					event.preventDefault();
					toastr.warning("Nombre de usuario y/o contraseña no válidos.\nPor favor, reintente.");
					passInput.val('');
					break;
				case 'validacionRandom':
					event.preventDefault();
					toastr.warning("Su contraseña ha sido reinciada, verifique su correo electrónico o solicite una nueva en \"¿Olvidaste tu contraseña?\".");
					passInput.val('');
					break;
				case 'validacionRandomLate':
					event.preventDefault();
					toastr.warning("Su contraseña ha sido reinciada hace mas de una hora, se ha enviado una nueva a su correo electrónico");
					passInput.val('');
					break;
			}
		}
	});
}

// var pass = function(){

// 	var vLogin = $('input[name="txtUsuario"]').val();
// 	var mail = $('input[name="email"]').val();
// 	
// 	if(vLogin != "" && mail != ""){
// 		$.ajax({
// 			url: '/4DACTION/_V3_SetRandomPassword',
// 			data: {
// 				'vLogin': vLogin,
// 				'fromLogin': true,
// 				'mail': mail
// 			},
// 			async:false,
// 			dataType: 'json',
// 			success: function(data) {
// 				
// 				if(data.success){
// 					toastr.success('Contraseña reestablecida, verifique su correo electrónico.');
// 					// $('div.passwordRecovery').hide();
// 					$('body').trigger('click');
// 					$('p.backToLogin').trigger('click');
// 				}else{
// 					toastr.error('Nombre de usuario y/o correo electrónico no coinciden. Por favor comunicarse con soporte para verificar la información.');
// 				}
// 			}
// 		});

// 	}else{					
// 		toastr.error('Complete todos los campos para reestablecer la contraseña');
// 	}
// }