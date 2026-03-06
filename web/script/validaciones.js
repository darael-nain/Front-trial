/* validaciones generales */
$(document).ready(function(){
	g_ckeck_validar_rut();
});

function g_valida_Rut(rutx){		
	if(rutx!=""){
		var count = 0;
		var count2 = 0;
		var factor = 2;
		var suma = 0;
		var sum = 0;
		var digito = 0;
		var arrRut = rutx.split('-');
		
		var rut = arrRut[0];
		var dvIn = arrRut[1];
		
		count2 = rut.length - 1;
		while(count < rut.length) 
		{
	
			sum = factor * (parseInt(rut.substr(count2,1)));
			suma = suma + sum;
			sum = 0;
	
			count = count + 1;
			count2 = count2 - 1;
			factor = factor + 1;
	
			if(factor > 7){factor=2;}
	
		}
		digito = 11 - (suma % 11);
	
		if (digito == 11){digito = 0;}
		if (digito == 10) {digito = "k";}
		//form.dig.value = digito;
		
		if(digito==dvIn)
		{
			return true;			
		}
		else
		{		
			return false;
		}
	}else{		
		return true;
	}
}

function g_existe_rut(){	
	var rut = $('#rut-global').val();
	var dig = $('#dv-global').val();	
	if($("#validarut").is(':checked')){
		if(g_valida_Rut(rut+"-"+dig)==false){
			alert("EL RUT INGRESADO NO ES VALIDO.");
			$('#dv-global').val("").focus();				
		}else{
			var rutx = rut+dig;
			$.get("/verificaRutExisteIntra/"+rutx, function(data){
				if(data==0){
					alert("EL RUT INGRESADO YA SE ENCUENTRA REGISTRADO.");
					$('#dv-global').val("").focus();
				}
			});
		}
	}else{
		var rutx = rut+dig;
		$.get("/sinCheckVerificaRutExisteIntra/"+rutx, function(data){
			if(data==0){
				alert("EL RUT INGRESADO YA SE ENCUENTRA REGISTRADO Y VALIDADO.");
				$('#dv-global').val("").focus();
			}
		});
	}
}

function g_existe_rut_al_guardar(){	
	var rut = $('#rut-global').val();
	var dig = $('#dv-global').val();
	if($("#validarut").is(':checked')){
		if(g_valida_Rut(rut+"-"+dig)==false){
			//EL RUT INGRESADO NO ES VALIDO.
			return 1;			
		}else{
			var rutx = rut+dig;
			$.get("/verificaRutExisteIntra/"+rutx, function(data){
				if(data==0){
					//EL RUT INGRESADO YA SE ENCUENTRA REGISTRADO.					
					return 2;								
				}
			});
		}
	}else{
		var rutx = rut+dig;		
		$.get("/sinCheckVerificaRutExisteIntra/"+rutx,function(data){
			if(data==0){
				//EL RUT INGRESADO YA SE ENCUENTRA REGISTRADO Y VALIDADO.			
				return 3;								
			}
		});
	}
}

function g_ckeck_validar_rut(){
	$('#validarut').click(function(){
		if($(this).is(':checked')){
			$('#validarut_2').val("SI");
		}else{
			$('#validarut_2').val("NO");
		}
		$('#dv-global').val("");
		if($('#rut-global').val()==""){
			$('#rut-global').focus();
		}else{
			$('#dv-global').focus();
		}
	});	
}