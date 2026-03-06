$(document).ready(function(){
	fn_send_notify_oc();
	fn_show_oc_states();	
});

function fn_send_notify_oc(){	
	$('#btn-send-notify-oc').click(function() {
  		var idoc = $('#send-notify-oc #idoc').val();
  		var to= $('#send-notify-oc #to').val();
  		var message = $('#send-notify-oc #message').val();
  		var emailFrom = $('#send-notify-oc #emailFrom').val(); 
  		var loginFrom = $('#send-notify-oc #loginFrom').val();  		
  		
  		if(to == ""){
  			alert("DEBE INGRESAR UN EMAIL DEL DESTINATARIO.");
  		}else{
  			$.post("/sendNotifyOc",{idoc:idoc,from:emailFrom,to:to,login:loginFrom,message:message},
   			function(){});
   			alert("CORREO ENVIADO CORRECTAMENTE!!");
  		}
	});
}

function fn_show_oc_states(){	
	$('#filters-state-oc').change(function() {
		var type = $('#filters-state-oc').val();			
		if(type=="EMITIDA"){
			location.href="/4DACTION/W_LISTA_OC/e";
		}
		if(type=="PAGADA"){
			location.href="/4DACTION/W_LISTA_OC/p";
		}
		if(type=="ANULADA"){
			location.href="/4DACTION/W_LISTA_OC/a";
		}
		if(type=="CERRADA"){
			location.href="/4DACTION/W_LISTA_OC/c";
		}  		
	});
}