var requestUnblockText = function(name, email,id, number){

	var text = "<!DOCTYPE html>\
	<html lang='es'>\
	<head>\
		<meta charset='UTF-8'>\
		<title>Document</title>\
		<script src='/v3/script/jquery/jquery.js'></script>\
		<script>\
			$('#aLink').click(function(){\
				$.ajax({\
					url: '"+nodeUrl+"/sendEmail',\
					data: {\
						subject: '"+$('html > body.menu.home > aside > div > div > h1').text()+" ha solicitado editar la cotización Nro."+number+"',\
						msg: 'USD',\
						email: '"+email+"',\
					},\
					async: false,\
					dataType: 'json',\
					success: function(data) {\
						toastr.success('Email enviado con exito');\
					}\
				}); \
			});\
		</script>\
	</head>\
	<body>\
		<p>Esta cotización/negocio esta siendo editada por: "+name+" <br/>\
	<a href='#' id='aLink'>Click aqui</a> para solicitar solicitar ingresar</p>\
	</body>\
	</html>"

	return text;
}

