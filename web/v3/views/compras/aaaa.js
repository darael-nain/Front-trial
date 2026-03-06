														// Enviar correo validación aceptada
														var username = $('section.sheet').data('username');
														var email = $('section.sheet').data('email');
														var full_name = $('section.sheet').data('full_name');
														var current_username = $('html > body.menu.home > aside > div > div > h1').data('username');
														var record_name = 'Gasto';
														var index = $('section.sheet').data('index');
														var text = $('input[name="oc[referencia]"]').val();
														var motivo="";
														var usernames = [];
														var emailContacto="";
														const email2 = import("../../script/unabase/email.js?1");
														emailContacto= $('input[name="contacto[info][email]"]').val();



														usernames.push(username);

														
														

														
														for (k in usernames) {

															if (compras.tipoGasto == "OC") {
																record_name = "Orden de Compra"
															}else{
																record_name = "Rendición de fondos"
															}

														

													    $.ajax({
													      url: "/4DACTION/_V3_getUsuario",
													      data: {
													        id: usernames[k]
													      },
													      dataType: "json",
													      async: false,
													      success: function(data) {

													      	
													        let current = data.rows[0];
													        let toName = (
													          current.nombres.trim() +
													          " " +
													          current.ap_pat.trim()
													        ).trim();
													        let toEmail = current.email;


													        if(current.allow_email){
													        	

																var paramsData;
															 	var  paramsData2;
															 	
															 	


													        	paramsData = {
																	to: usernames[k],
																	toName: toName,
																	userValidator: "",
																	nameValidator: "",
																	emailValidator: "",
																	toEmail: toEmail,
																  template: 'validation_accepted',
																  document: record_name,
																  index: index,
																  title: text,
																  motivo: motivo,
																  extra: undefined,
																  detail_uri: 'compras/content.shtml',
																  id_item: $('section.sheet').data('id') || compras.id,
																  attach: true
																}


																if (envioCorreoAutomatico)  {


																	paramsData = {
																	to: usernames[k],
																	toName: toName,
																	userValidator: "",
																	nameValidator: "",
																	emailValidator: "",
																	toEmail: toEmail,
																  template: 'validation_accepted',
																  document: record_name,
																  index: index,
																  title: text + "/          Ha sido enviada al correo de proveedor : " + emailContacto,
																  motivo: motivo,
																  extra: undefined,
																  detail_uri: 'compras/content.shtml',
																  id_item: $('section.sheet').data('id') || compras.id,
																  attach: true
																}

																
																	// Correo automatico al contacto al validar
																paramsData2 = {
																	to: emailContacto,
																	toName: "",
																	userValidator: "",
																	nameValidator: "",
																	emailValidator: "",
																	toEmail: emailContacto,
																	nameContacto:"",
																	emailContacto:emailContacto,
																  template: 'envio_gasto',
																  document: record_name,
																  index: index,
																  title: text,
																  motivo: motivo,
																  extra: undefined,
																  detail_uri: 'compras/content.shtml',
																  id_item: $('section.sheet').data('id') || compras.id,
																  attach: true
																}
												       
												        		

												        		

															}
													


												         
													        email2.then(functions => {
													        	functions.notifyRequestValidationOC(paramsData);
													        	if (envioCorreoAutomatico) {
													        		

													        		functions.notifyRequestValidationOC(paramsData2);	
													        		compras.saveLogsFromWeb({
														                id: $('section.sheet').data('id') || compras.id,
														                folio: index,
														                descripcion:
														                  "Ha compartido el gasto vía email a la dirección: " +
														                  emailContacto,
														                modulo: "gastos",
														                descripcion_larga: ""
														              });
													        		
													        		 toastr.success(
													                	sprintf(NOTIFY.get("SUCCESS_EMAIL_SEND"), emailContacto)
													              	);
													          		
													        	}
												        	
												       	 	});

																		// let paramsData = {
																		// 	to: usernames[k],
																		// 	toName,
																		// 	toEmail,
																		//   template: 'validation_accepted',
																		//   document: record_name,
																		//   index,
																		//   title: text,
																		//   // extra: email_link + comentarioEmisor,
																		//   detail_uri: 'compras/content.shtml',
																		//   id_item: $('section.sheet').data('id') || compras.id,
																		//   attach: true,
																		//   id_usuario_notificacion: true
																
													        }
													      }
													    });