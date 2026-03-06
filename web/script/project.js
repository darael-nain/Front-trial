$(document).ready(function(){

	//$('#dialog-cerrar-proyecto').hide();

	$("#accordion-etapas" ).accordion({
		header: "> div > h3",
      	collapsible: true,
      	active:false,
      	heightStyle: false     
    });

	$(".accordion-ots" ).accordion({
		header: "> div > h3",
      	collapsible: true,
      	active:false,
      	heightStyle: false     
    });


	$('button').button();
	$('.boton').button();
	$('.boton2').button();
	$('.mas').button({icons:{primary:"ui-icon-plus"}});
	$('.mas-ot').button({icons:{primary:"ui-icon-plus"}});
	$('.delete_etapa').button({icons:{primary:"ui-icon-trash"},text:false});
	$('.delete-tarea').button({icons:{primary:"ui-icon-trash"},text:false});
	$('.s-btn-d-icono').button({icons:{primary:"ui-icon-trash"},text:false});
	$('.s-proy-notificado-ot').button({icons:{primary:"ui-icon-check"}},{label:"Notificado"});


	$("#buscar-clientes").autocomplete({
		source: function(request,response) {
			$.ajax({
			  url: "/buscar_empresas_json",
			  dataType:"json",
			  data: {
			    name_startsWith:request.term,maxRows:12
			  },
			  success: function(data) {
			    response($.map(data.empresas,function(item) {
					return {
						label:item.nombre,value:item.nombre,idemp:item.idemp,email:item.email,giro:item.giro,direccion:item.direccion,rut:item.rut,fono:item.fono

					}

			    }));
			  }
			});
		},

		minLength:1,

		select: function(event,ui) {

			$('#id-cliente').val(ui.item.idemp);

			$('.giro').val(ui.item.giro);

			$('.direccion').val(ui.item.direccion);

			$('.rut').val(ui.item.rut);

			$('.fono').val(ui.item.fono);

			$('.cargo_s').val('');

			$('.fono_s').val('');

			$('.email_s').val('');

			$.getJSON("/get_relacionados_empresa_json/"+ui.item.idemp, function(data){		

				var options = "<option value='0' selected>[ Seleccionar ]</option>";

				$.each(data.relacionados, function(i,item){

					options=options+"<option value="+item.idcontacto+">"+item.nombres+"</option>";							

			    });

			    $('#lista-contactos').html(options);

			});

		} 		

	});


    $.ui.autocomplete.prototype._renderItem = function (ul, item) {
		var format = "<a style='padding:2px;border-bottom:1px solid gray;border-radius:0;position:relative'>";
		format = format + "<strong>";
		if (item.idneg) format = format + "(" + item.idneg +") ";
		if (item.value) format = format + item.value;
		format = format + "</strong>";
		if (item.cliente || item.femision || item.email) format = format + "<br>";
		if (item.cliente) format = format + item.cliente;
		if (item.email) format = format + item.email;
		if (item.femision) format = format + "<span style='position:absolute;bottom:0;right:0;font-size:10px;color:#848484'>"+item.femision+"</span>";
		format = format + "</a>";
		return $("<li></li>").data("item.autocomplete", item).append(format).appendTo(ul);
    };



	$("#buscar-neg").autocomplete({	

		source: function(request,response) {

			$.ajax({

			  url: "/buscar_proyectos_json",

			  dataType: "json",

			  data: {

			    name_startsWith:request.term,

                maxRows: 12

			  },

			  success: function(data) {

			    response($.map(data.negocios,function(item) {

					return {

						//label:"("+item.idnegocio+") "+item.referencia+"\n\n"+item.razoncliente,						

						value: item.referencia,

						idnv:item.idnv,

						idneg:item.idnegocio,

						estado:item.estado,

						cliente:item.razoncliente,

						femision:item.fechaEmision,

					}

			    }));

			  }

			});

		},

		minLength:1,

		select: function(event,ui) {			

			$('#idproyecto-select').val(ui.item.idnv);			

		}   

	});


	$("#cerrar-proyecto").click(function(){		
		var idpro = $("#idproyecto").val();		
		$("#dialog-cerrar-proyecto" ).dialog({
			dialogClass:"dialog-confirm",
			resizable: false,
			height:280,
			width:500,
			modal: true,
			buttons: {
				"Aceptar": function() {
					var mensaje = $("#dialog-cerrar-proyecto").find("textarea").val();
					$.ajax({
						url: '/4DACTION/closeProyecto',
						dataType: 'json',
						type: 'POST',
						data: {
							idpro:idpro,
							str:mensaje
						}
					}).done(function(data) {
						if(data != 0){							
							location.href="editar_proyecto.shtml?i="+ idpro +"&r=" + Math.random();						
						}else{
							alert("OCURRIÓ UN ERROR, INTENTE NUEVAMENTE.");
						}
					});
					/*$.post("/closeProyecto",{idpro:idpro,str:mensaje},function(data){
						if(data!=0){							
							location.href="editar_proyecto.shtml?i="+idpro+"&r="+Math.random();						
						}else{
							alert("OCURRIÓ UN ERROR, INTENTE NUEVAMENTE.");
						}
					});*/		  	
				},
				"Cancelar": function() {	        	
				  	$(this).dialog("close");
				}
			}
	    });		
	});

	$("#abrir-proyecto").click(function(){		
		var idpro = $("#idproyecto").val();
		if(confirm("ESTÁ SEGURO(A) DE ACTIVAR EL PROYECTO?")) {
			$.ajax({
				url: '/4DACTION/activarProyecto',
				dataType: 'json',
				type: 'POST',
				data: {
					idpro:idpro
				}
			}).done(function(data) {
				if(data != 0){							
					location.href="editar_proyecto.shtml?i="+idpro+"&r="+Math.random();						
				}else{
					alert("OCURRIÓ UN ERROR, INTENTE NUEVAMENTE.");
				}
			});
			/*$.post("/activarProyecto",{idpro:idpro},function(data){
				if(data!=0){							
					location.href="editar_proyecto.shtml?i="+idpro+"&r="+Math.random();						
				}else{
					alert("OCURRIÓ UN ERROR, INTENTE NUEVAMENTE.");
				}
			});*/
		}		
	});

	plantillas();
	add_antecedentes();
	save_antecedentes();
	edit_label_ant();
	delete_antecedentes();

	add_etapa();
	save_etapa();
	delete_etapa();
	ver_mas_etapa();
	// guardar_ver_mas();

	add_tarea();
	save_tarea();
	delete_tarea();
	notificar_tarea();

	add_componentes();
	// save_componentes();
	delete_componentes();

	save_valor_componente();
	edit_label_componente();	

	add_cliente();

	
	select_solicitante();
	add_solicitante();

	
	add_participantes();
	delete_participantes();

	uploadForm();
	

	$('.busq-combinada-proyecto').bind('change keyup', function() {
		var buscar = $('#search-text-p').val();
		var estado = $('#search-estado-p').val();
		$.ajax({
			url: '/4DACTION/busqueda_combinada_proyecto',
			dataType: 'json',
			type: 'POST',
			data: {
				texto:buscar,
				estado:estado
			}
		}).done(function(data) {
			$("#contenedor-lista-proyectos").html(data);
			initializeOrderTable();
		});
		/*$.post("/busqueda_combinada_proyecto",{texto:buscar,estado:estado},function(data){
				$("#contenedor-lista-proyectos").html(data);
				initializeOrderTable();
			}
		);*/
	});	

	datepicker_ant();

});

function datepicker_ant(){
	$(".datepicker-ant").datepicker({
      showOn: "button",
      buttonImage: "imagenes_green/calendar.gif",
      buttonImageOnly: true,
      dateFormat: "dd-mm-yy"
    }).change(function() {
    	$(this).prev().val($(this).val());
    });
}

function add_etapa(){
	$('#add_etapa').click(function(event) {
		var idProyecto = $("#idproyecto").val();		
		$.get("/addFrmEtapaProyecto/frm_nueva_etapa.html/"+idProyecto, function(data){	
			$('.etapas').append(data);
			save_etapa();
			add_tarea();
			delete_etapa();
			ver_mas_etapa();
			$('.mas-ot').button({icons:{primary:"ui-icon-plus"}});
			$('.delete_etapa').button({icons:{primary:"ui-icon-trash"},text:false});	
			$("#accordion-etapas").accordion("refresh");
			$("#accordion-etapas").accordion({active:false});
		});	
	});
}

function add_tarea(){
	$('.add-tarea').click(function(event) {		
		var idEmpresa = $("#id-cliente").val();
		var objEtapa = $(this).parents('.grupo');
		var idEtapa = $(this).parents('.grupo').children('input').val();		
		var frm = "frm_nueva_tarea_.html";
		$(".accordion-ots" ).accordion({
			header: "> div > h3",
	      	collapsible: true,
	      	active:false,
	      	heightStyle: false     
	    });
	    $.ajax({
			url: '/4DACTION/addFrmTarea',
			dataType: 'html',
			type: 'POST',
			data: {
				idEtapax:idEtapa,
				frm:frm,
				idEmpresa:idEmpresa
			}
		}).done(function(data) {
			$("#accordion-etapas").accordion("refresh");
			$(objEtapa).find(".accordion-ots").append(data);		
			$(objEtapa).find('.accordion-ots').accordion("refresh");
			$(objEtapa).find('.accordion-ots').accordion({active:false});
			$("#accordion-etapas").accordion( "option", "collapsible", false );	
			$('.mas-ot').button({icons:{primary:"ui-icon-plus"}});
			$('.delete-tarea').button({icons:{primary:"ui-icon-trash"},text:false});
			delete_tarea();
			save_tarea();
			add_participantes();
			add_componentes();
			delete_participantes();
			$(function(){
				$( ".datepicker" ).datepicker({dateFormat: 'dd/mm/y' , monthNames: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'], dayNamesShort: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa']});
			});
		});
		/*$.post("/addFrmTarea",{idEtapax:idEtapa,frm:frm,idEmpresa:idEmpresa},function(data){
			$("#accordion-etapas").accordion("refresh");
			$(objEtapa).find(".accordion-ots").append(data);		
			$(objEtapa).find('.accordion-ots').accordion("refresh");
			$(objEtapa).find('.accordion-ots').accordion({active:false});
			$("#accordion-etapas").accordion( "option", "collapsible", false );	
			$('.mas-ot').button({icons:{primary:"ui-icon-plus"}});
			$('.delete-tarea').button({icons:{primary:"ui-icon-trash"},text:false});
			delete_tarea();
			save_tarea();
			add_participantes();
			add_componentes();
			delete_participantes();
			$(function(){
				$( ".datepicker" ).datepicker({dateFormat: 'dd/mm/y' , monthNames: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'], dayNamesShort: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa']});
			});
		});*/
	});	
}

function save_etapa(){
	$('.save_etapa').change(function(){
		var idEtapa = $(this).parents('.grupo').children('input[name=idetapa]').val();	
		var name = $(this).val().toUpperCase();
		var this2 = $(this);
		$.ajax({
			url: '/4DACTION/model_etapa',
			dataType: 'json',
			type: 'POST',
			data: {
				dato:'nombre',
				name:name,
				idEtapa:idEtapa
			}
		}).done(function(data) {
			$(this2).parents('.grupo').find('.titulo-acordion').text(name);
			loading();
		});
		/*$.post("/model_etapa",{dato:'nombre',name:name,idEtapa:idEtapa},function(data){		
			$(this2).parents('.grupo').find('.titulo-acordion').text(name);
			loading();
		});*/
	});
}

function delete_etapa(){
	$('.delete_etapa').click(function(event) {
		var idEtapa = $(this).parents('.grupo').children('input[name=idetapa]').val();
		if (confirm('Está seguro(a) de eliminar la etapa?')){
			$(this).parents('.grupo').fadeOut('fast',function(){
				$.ajax({
					url: '/4DACTION/delete_etapa',
					dataType: 'json',
					type: 'POST',
					data: {
						idEtapa:idEtapa
					}
				}).done(function(data) {
					$(this).remove();
				});
				/*$.post("/delete_etapa",{idEtapa:idEtapa},function(data){
					$(this).remove();			
				});*/
			});
		}
	});
}

function delete_tarea(){
	$('.delete-tarea').click(function(){
		if (confirm('Está seguro(a) de eliminar la orden de trabajo?')) {
			var idTarea = $(this).parents('.grupo-ots').children('input[name=idtarea]').val();
			$(this).parents('.grupo-ots').fadeOut('fast',function(){
				$.ajax({
					url: '/4DACTION/delete_tarea',
					dataType: 'json',
					type: 'POST',
					data: {
						idTarea:idTarea
					}
				}).done(function(data) {
					$(this).remove();	
				});
				/*$.post("/delete_tarea",{idTarea:idTarea},function(data){
					$(this).remove();				
				});*/
			});		
		}		
	});
}

function loading(){
	$('.loading').fadeIn();
	setTimeout("$('.loading').fadeOut()",1000);
}

function plantillas(){

	$('.plantillas').click(function(){
		var idProyecto = $('#idproyecto').val();
		var this2 = $(this);
		if ($(this).attr('name')=="si") {
			if(confirm("ESTA SEGURO(A) DE QUITAR COMO PLANTILLA EL PROYECTO?")){
				$.ajax({
					url: '/4DACTION/plantilla',
					dataType: 'json',
					type: 'POST',
					data: {
						idProyecto:idProyecto,
						valor:"no"
					}
				}).done(function(data) {
					loading();
					$(this2).attr('name',"no");
					$(this2).text('Establecer como plantilla');
					$(this2).css({'background-color' : '','border' : '1px solid gray','font-weight' : 'normal'});
				});
				/*$.post('/plantilla',{idProyecto:idProyecto,valor:"no"},function(data){
					loading();
					$(this2).attr('name',"no");
					$(this2).text('Establecer como plantilla');
					$(this2).css({'background-color' : '','border' : '1px solid gray','font-weight' : 'normal'});
				});*/
			}			

		}else{

			if(confirm("ESTA SEGURO(A) DE ESTABLECER COMO PLANTILLA EL PROYECTO?")){
				$.ajax({
					url: '/4DACTION/plantilla',
					dataType: 'json',
					type: 'POST',
					data: {
						idProyecto:idProyecto,
						valor:"si"
					}
				}).done(function(data) {
					loading();
					$(this2).attr('name',"si");
					$(this2).text('Establecido como plantilla');
					$(this2).css({'background-color' : '#daea91','border' : '1px solid green','font-weight' : 'normal','color':'black'});
				});
				/*$.post('/plantilla',{idProyecto:idProyecto,valor:"si"},function(data){
					loading();
					$(this2).attr('name',"si");
					$(this2).text('Establecido como plantilla');
					$(this2).css({'background-color' : '#daea91','border' : '1px solid green','font-weight' : 'normal','color':'black'});
				});*/
			}						

		}

	});	

}



var currentObjGlobal ="";



/* DATOS DEL PROYECTO */

function add_cliente(){

	$('#add-cliente').click(function(){

		$.get("/crear_clientes", function(data){

			$('#dialog-nuevo-cliente').html(data);				

			$("#dialog-nuevo-cliente").dialog({

				dialogClass:"dialog-form",resizable: false,height:500,width:610,modal: true,

				buttons: {

					"Aceptar": function() {

						guardar_contacto();						

					},

					Cancelar: function(){

					  	$(this).dialog("close");

					}

				}

		    });

		});

	});

}



function guardar_contacto(){	

		var objForm = $('#form-new-client');

		var msg ="";

		if($(objForm).find('input[name=alias]').val()==""){

			msg = msg+"- Ingrese Alias.\n";

		}

		if($(objForm).find('input[name=giro]').val()==""){

			msg = msg+"- Ingrese Giro.\n";

		}

		if($(objForm).find('input[name=razon]').val()==""){

			msg = msg+"- Ingrese Razon Social.\n";

		}

		if($(objForm).find('input[name=chkvalidar]').is(':checked')){

			if($(objForm).find('input[name=rut]').val()=="" || $(objForm).find('input[name=dv]')==""){

				msg = msg+"- Ingrese Rut.\n";

			}

		}

		if(msg=="") {

			var data = $("#form-new-client").serialize();

			$.ajax({
				url: '/4DACTION/guardar_nuevo_contacto',
				dataType: 'json',
				type: 'POST',
				data: data
			}).done(function(data) {
				alert("EL CLIENTE FUE CREADO CORRECTAMENTE.");

				//agrega info de cliente
				$('.giro').val(data.giro);
				$('.direccion').val(data.direccion);
				$('.rut').val(data.rut+"-"+data.dv);
				$('.fono').val(data.fono);
				$('#id-cliente').val(data.idx);
				$('#buscar-clientes').val(data.razon);

				//linpia info solicitante
			    $('#lista-contactos').html("<option value='0' selected>[ Seleccionar ]</option>");
			    $('.cargo_s').val('');
				$('.fono_s').val('');
				$('.email_s').val('');

			    $('#dialog-nuevo-cliente').dialog("close");
			});

			/*$.post("/guardar_nuevo_contacto",data, function(data) {

				alert("EL CLIENTE FUE CREADO CORRECTAMENTE.");

				//agrega info de cliente
				$('.giro').val(data.giro);
				$('.direccion').val(data.direccion);
				$('.rut').val(data.rut+"-"+data.dv);
				$('.fono').val(data.fono);
				$('#id-cliente').val(data.idx);
				$('#buscar-clientes').val(data.razon);

				//linpia info solicitante
			    $('#lista-contactos').html("<option value='0' selected>[ Seleccionar ]</option>");
			    $('.cargo_s').val('');
				$('.fono_s').val('');
				$('.email_s').val('');

			    $('#dialog-nuevo-cliente').dialog("close");

			},"json");	*/

		}else{

			alert("ATENCION : Faltan datos\n"+msg);

		}	

}



function add_solicitante(){

	$('#add-solicitante').click(function(){

		var idEmpresa = $('#id-cliente').val();

		if (idEmpresa>0) {

			$.get("/crear_relacionado/"+idEmpresa, function(data){

				$('#dialog-nuevo-solicitante').html(data);				

				$("#dialog-nuevo-solicitante").dialog({

					dialogClass:"dialog-form",resizable: false,height:350,width:610,modal: true,

					buttons: {

						"Aceptar": function() {

							guardar_relacionado();						

						},

						Cancelar: function(){

						  	$(this).dialog("close");

						}

					}

			    });

			});

		}else{

			alert("PRIMERO DEBE SELECCIONAR UN CLIENTE.");

		}		

	});

}



function guardar_relacionado(){

	//$('.guardar-relacionado').click(function(){

		var objForm = $('#form-new-client-rel');

		var msg ="";

		/*if($(objForm).find('input[name=alias]').val()==""){

			msg = msg+"- Ingrese Alias.\n";

		}*/

		if($(objForm).find('input[name=nombre]').val()==""){

			msg = msg+"- Ingrese Nombre.\n";

		}

		if($(objForm).find('input[name=paterno]').val()==""){

			msg = msg+"- Ingrese A.Paterno.\n";

		}		

		/*if($(objForm).find('input[name=chkvalidar]').is(':checked')){

			if($(objForm).find('input[name=rut]').val()=="" || $(objForm).find('input[name=dv]')==""){

				msg = msg+"- Ingrese Rut.\n";

			}

		}*/



		if(msg=="") {

			var data = $("#form-new-client-rel").serialize();

			$.ajax({
				url: '/4DACTION/guardar_nuevo_relacionado',
				dataType: 'json',
				type: 'POST',
				data: data
			}).done(function(data) {
				alert("EL SOLICITANTE FUE CREADO CORRECTAMENTE.");
				$('#fono_').val(data.fono);
				$('#email_').val(data.email);
				$('#cargo_').val(data.cargo);
				var options = '<option selected value='+data.idcontacto+'>'+data.nombre+'</option>';
				$('#lista-contactos option').each(function(){
					options = options +'<option value='+$(this).val()+'>'+$(this).text()+'</option>'
				});
				$('#lista-contactos').html(options);
			    $('#dialog-nuevo-solicitante').dialog("close");
			});

			/*$.post("/guardar_nuevo_relacionado",data, function(data) {

				alert("EL SOLICITANTE FUE CREADO CORRECTAMENTE.");

				$('#fono_').val(data.fono);

				$('#email_').val(data.email);

				$('#cargo_').val(data.cargo);								

				var options = '<option selected value='+data.idcontacto+'>'+data.nombre+'</option>';

				$('#lista-contactos option').each(function(){				

					options = options +'<option value='+$(this).val()+'>'+$(this).text()+'</option>'

				});

				$('#lista-contactos').html(options);

			    $('#dialog-nuevo-solicitante').dialog("close");

			},"json");*/

		}else{

			alert("ATENCION : Faltan datos\n"+msg);

		}

	//});

}



function select_solicitante(){
	$('#lista-contactos').change(function() {	
		var idSol = $(this).val();		
		$.getJSON("/get_datos_solicitante/"+idSol, function(data){
			$('#fono_').val(data.fono);
			$('#email_').val(data.email);
			$('#cargo_').val(data.cargo);
		});
	});	
}


/* ANTECEDENTES */

function add_antecedentes(){
	$('#add-antecedentes').click(function(){
		var idProyecto = $("#idproyecto").val();
		var objBlockAnt = $(this).parents('#block-antecedentes');
		$.get("/addFrmAntecedentes/frm_nuevo_antecedente.html/"+idProyecto, function(data){	
			$(objBlockAnt).children('.content-ant').append(data);
			save_antecedentes();
			edit_label_ant();
			datepicker_ant();
			delete_antecedentes();
		});		
	});
}

function save_antecedentes(){
	$('.antecedentes').change(function() {
		var idProyecto = $("#idproyecto").val();
		var idAntecedentes = $(this).parents('.box-ant').attr('id');
		var valor = $(this).val();
		$.ajax({
			url: '/4DACTION/save_antecedentes',
			dataType: 'json',
			type: 'POST',
			data: {
				idProyecto:idAntecedentes,
				idAntecedentes:idAntecedentes,
				valor:valor
			}
		}).done(function(data) {
			loading();
		});
		/*$.post("/save_antecedentes",{idProyecto:idAntecedentes,idAntecedentes:idAntecedentes,valor:valor},function(data){
			loading();
		});*/
	});
}

function edit_label_ant(){
	$('.label-ant').click(function(){
		$(this).css('background-color','none');
		var this2 = $(this);
		var idAntecedentes = $(this).parents('.box-ant').attr('id');
		var valorIngresado = prompt('Ingrese descripción:',$(this).text());
		if (valorIngresado!=null && valorIngresado!='') {
			$.ajax({
				url: '/4DACTION/edit_label_antecedente',
				dataType: 'json',
				type: 'POST',
				data: {
					idAntecedentes:idAntecedentes,
					valorIngresado:valorIngresado
				}
			}).done(function(data) {
				$(this2).text(valorIngresado);
				loading();
			});
			/*$.post("/edit_label_antecedente",{idAntecedentes:idAntecedentes,valorIngresado:valorIngresado},function(data){
				$(this2).text(valorIngresado);
				loading();
			});*/
		};		
	});
}

function delete_antecedentes(){
	$('.delete-antecedente').click(function(){
		if (confirm("Está seguro(a) de eliminar?")){
			var idAnt = $(this).parent().attr('id');
			$($(this).parent()).fadeOut('slow',function(){
				$.ajax({
					url: '/4DACTION/delete_antecedente',
					dataType: 'json',
					type: 'POST',
					data: {
						idAnt:idAnt
					}
				}).done(function(data) {
					$(this).remove();
				});
				/*$.post("/delete_antecedente",{idAnt:idAnt},function(data){
					$(this).remove();
				});*/
			});
		}		
	});
}

function ver_mas_etapa(){
	$('.ver-mas-etapa').click(function(){
		var idEtapa = $(this).parents('.grupo').children('input[name=idetapa]').val();
		$.ajax({
			url: '/4DACTION/ver_mas_etapa',
			dataType: 'html',
			type: 'POST',
			data: {
				idEtapa:idEtapa
			}
		}).done(function(data) {
			$('#dialog-ver-mas').html(data);				
			$("#dialog-ver-mas").dialog({
				dialogClass:"dialog-form",resizable: false,height:500,width:610,modal: true,
				buttons: {
					"Aceptar": function() {
						// leer proyecto_disabled="disabled"
						if($('#proyecto_disabled').val() == 'disabled')
							alert("El proyecto se encuentra anulado. No puede guardar cambios.");
						else
							guardar_ver_mas();				
					},
					Cancelar: function(){
					  	$(this).dialog("close");
					}
				}
		    });	
		});
		/*$.post("/ver_mas_etapa",{idEtapa:idEtapa},function(data){
			$('#dialog-ver-mas').html(data);				
			$("#dialog-ver-mas").dialog({
				dialogClass:"dialog-form",resizable: false,height:500,width:610,modal: true,
				buttons: {
					"Aceptar": function() {
						// leer proyecto_disabled="disabled"
						if($('#proyecto_disabled').val() == 'disabled')
							alert("El proyecto se encuentra anulado. No puede guardar cambios.");
						else
							guardar_ver_mas();				
					},
					Cancelar: function(){
					  	$(this).dialog("close");
					}
				}
		    });			
		});*/
	});
}

function guardar_ver_mas(){	
	// $('.guardar-ver-mas').click(function(){
		var idEtapa = $('#form-ver-mas').find('input[name=idetapa]').val();
		var desLarga = $('#form-ver-mas').find('textarea[name=descripcion]').val();	
		$.ajax({
			url: '/4DACTION/guardar_des_etapa',
			dataType: 'json',
			type: 'POST',
			data: {
				idEtapa:idEtapa,
				desLarga:desLarga
			}
		}).done(function(data) {
			$("#dialog-ver-mas").dialog("close");
		});

		/*var idEtapa = $('#form-ver-mas').find('input[name=idetapa]').val();
		var desLarga = $('#form-ver-mas').find('textarea[name=descripcion]').val();	
		$.post("/guardar_des_etapa",{
			idEtapa:idEtapa,desLarga:desLarga
		},function(data){
			$("#dialog-ver-mas").dialog("close");
		})*/
	// });
}

function save_tarea(){
	$('.save-tarea').change(function() {
		var valor = $(this).val();
		var nombre = $(this).attr('name');
		var this2 =  $(this);
		var idTarea = $(this).parents('.grupo-ots').children('input[name=idtarea]').val();
		var valorTarea = $(this).parents('.grupo-ots').find('input[name=nombre-tarea]').val();
		var responsable = $(this).parents('.grupo-ots').find('.responsables option:selected').text();
		var fvcto = $(this).parents('.grupo-ots').find('input[name=fecha-vcto]').val();

		$.ajax({
			url: '/4DACTION/save_tarea',
			dataType: 'json',
			type: 'POST',
			data: {
				nombre:nombre,
				valor:valor,
				idTarea:idTarea
			}
		}).done(function(data) {
			loading();
			if(nombre=="area-trabajo"){
				//carga responsables del area seleccionada
				var options = "";
				options = options+'<option selected value="">[Seleccionar]</option>';
				$.each(data.responsables, function(i,item){
					options = options+'<option value="'+item.login_rep.toUpperCase()+'">'+item.nombres_resp.toUpperCase()+'</option>';	
			    });
			    $(this2).parents('.grupo-ots').find('.responsables').html(options);  

			   //carga participantes por defectos del area seleccionada
			   var part = '';
			   if (data.pordefecto.length>0) {
					$.each(data.pordefecto, function(i,item2){
						part = part + '<div><span>'+item2.nombres_def.toLowerCase()+'</span></div>';
					});
			   }else{
			   		part = '<h2>El área no cuenta con participantes predefinidos.</h2>';
			   }			  
			   $(this2).parents('.grupo-ots').find('.block-participantes .content-p').html(part);
			}

			if (nombre=="nombre-tarea" || nombre=="responsables" || nombre=="fecha-vcto") {
				var cadena = "";
				if (valorTarea!="") {
					cadena = cadena+valorTarea+" | ";
				}

				if (responsable!="[Seleccionar]") {
					cadena = cadena+responsable+" | ";
				}

				if (fvcto!="00-00-00") {
					cadena = cadena+fvcto;
				}			

				$(this2).parents('.grupo-ots').find('.titulo-tarea').text(cadena.toUpperCase());
			}
		});

		/*$.post("/save_tarea",{nombre:nombre,valor:valor,idTarea:idTarea},function(data){
			loading();
			if(nombre=="area-trabajo"){
				//carga responsables del area seleccionada
				var options = "";
				options = options+'<option selected value="">[Seleccionar]</option>';
				$.each(data.responsables, function(i,item){
					options = options+'<option value="'+item.login_rep.toUpperCase()+'">'+item.nombres_resp.toUpperCase()+'</option>';	
			    });
			    $(this2).parents('.grupo-ots').find('.responsables').html(options);  

			   //carga participantes por defectos del area seleccionada
			   var part = '';
			   if (data.pordefecto.length>0) {
					$.each(data.pordefecto, function(i,item2){
						part = part + '<div><span>'+item2.nombres_def.toLowerCase()+'</span></div>';
					});
			   }else{
			   		part = '<h2>El área no cuenta con participantes predefinidos.</h2>';
			   }			  
			   $(this2).parents('.grupo-ots').find('.block-participantes .content-p').html(part);
			}

			if (nombre=="nombre-tarea" || nombre=="responsables" || nombre=="fecha-vcto") {
				var cadena = "";
				if (valorTarea!="") {
					cadena = cadena+valorTarea+" | ";
				}

				if (responsable!="[Seleccionar]") {
					cadena = cadena+responsable+" | ";
				}

				if (fvcto!="00-00-00") {
					cadena = cadena+fvcto;
				}			

				$(this2).parents('.grupo-ots').find('.titulo-tarea').text(cadena.toUpperCase());
			}

		},"json");*/
		

	});

}



/*

function show_acciones(){

	$('.task').bind({

	  mouseover: function() {

	    $(this).children('.acciones-tarea').children('a').show();

	    $(this).children('.acciones-componentes').children('a').show();	    

	  },

	  mouseout: function() {

	    $(this).children('.acciones-tarea').children('a').hide();

	    $(this).children('.acciones-componentes').children('a').hide();

	  }

	});

}*/



function notificar_tarea(){

	$('.notificar-tarea').click(function(){

		if (confirm('Está seguro(a) de notificar la orden de trabajo?')) {

			var idTarea = $(this).parents('.grupo-ots').children('input[name=idtarea]').val();

			var loginResponsable = $(this).parents('.grupo-ots').find('select[name|=responsables]').val();					

			if(loginResponsable!=""){

				$.ajax({
					url: '/4DACTION/notificar_tarea',
					dataType: 'json',
					type: 'POST',
					data: {
						idTarea:idTarea
					}
				}).done(function(data) {
					alert("ATENCION : La Orden de trabajo ha sido notificada.");
				});				

				/*$.post("/notificar_tarea",{idTarea:idTarea},function(data){
					alert("ATENCION : La Orden de trabajo ha sido notificada.");
				});	*/

			}else{

				alert("ATENCION : Debe seleccionar el Responsable de la OT.");

				//$(this2).text('Notificar');

			}

		}

	});

}



function add_componentes(){
	$('.add-componentes').click(function(){
		var idTarea = $(this).parents('.grupo-ots').children('input[name=idtarea]').val();
		$.ajax({
			url: '/4DACTION/get_form_crear_componente',
			dataType: 'html',
			type: 'POST',
			data: {
				idTarea:idTarea
			}
		}).done(function(data) {
			$('#dialog-componente').html(data);				
			$("#dialog-componente").dialog({
				dialogClass:"dialog-confirm",resizable: false,heiht:250,width:500,modal: true,
				buttons: {
					"Aceptar": function() {
						save_componentes();
					},
					Cancelar: function(){
					  	$(this).dialog("close");
					}
				}
		    });
		});
		/*$.post("/get_form_crear_componente",{idTarea:idTarea},function(data){
			$('#dialog-componente').html(data);				
			$("#dialog-componente").dialog({
				dialogClass:"dialog-confirm",resizable: false,heiht:250,width:500,modal: true,
				buttons: {
					"Aceptar": function() {
						save_componentes();
					},
					Cancelar: function(){
					  	$(this).dialog("close");
					}
				}
		    });
		});*/
	});
}


function save_componentes(){
	// $('.guardar-componente').click(function(){		
		

		var idTarea = $('#form-new-componente').find('input[name=idtarea]').val();
		var tipo = $('#form-new-componente').find('select[name=tipo]').val();
		var nombre = $('#form-new-componente').find('input[name=nombre]').val();
		var obligatorio = $('#form-new-componente').find('select[name=obligatorio]').val();
		var msj = "";

		if (tipo=="-1")
			msj ="&&";
		

		if (nombre == "")
			msj ="&&";	

		if (msj == "") {
			$.ajax({
				url: '/4DACTION/save_componente',
				dataType: 'html',
				type: 'POST',
				data: {
					tipo:tipo,
					nombre:nombre,
					obligatorio:obligatorio,
					idTarea:idTarea
				}
			}).done(function(data) {
				// alert(data);
				$('.list-componente-'+idTarea).append(data);
				delete_componentes();
		        save_valor_componente();
		        uploadForm();
		        edit_label_componente();
		       	currentObjGlobal ="";
		       	$('.s-btn-d-icono').button({icons:{primary:"ui-icon-trash"},text:false});
		       	$('#dialog-componente').dialog("close");
			});

			/*$.post("/save_componente",{tipo:tipo,nombre:nombre,obligatorio:obligatorio,idTarea:idTarea},function(data){
				$('.list-componente-'+idTarea).append(data);
				delete_componentes();
		        save_valor_componente();
		        uploadForm();
		        edit_label_componente();
		       	currentObjGlobal ="";
		       	$('.s-btn-d-icono').button({icons:{primary:"ui-icon-trash"},text:false});
		       	$('#dialog-componente').dialog("close");
			});*/

		}else{
			alert("ATENCION : Faltan datos.");
		}

	// });

}



function delete_componentes(){
	$('.delete-comp').click(function(){
		if (confirm('Está seguro(a) de eliminar el componente?')) {
			var idComponente = $(this).val();
			$(this).parent().fadeOut(function(){
				$.ajax({
					url: '/4DACTION/delete_componente',
					dataType: 'json',
					type: 'POST',
					data: {
						idComponente:idComponente
					}
				}).done(function(data) {
					$(this).remove();
				});
				/*$.post("/delete_componente",{idComponente:idComponente},function(data){
					$(this).remove();
				});*/
			});
		}		
	});

}



/* --- COMPONENTES VALOR--- */

function save_valor_componente(){

	$('.save-valor-comp').change(function(){
		//var tipo = $(this).attr('title');
		var tipo = "";
		var idComponente = $(this).attr('name');
		var valor = $(this).val();
		$.ajax({
			url: '/4DACTION/save_valor_componente',
			dataType: 'json',
			type: 'POST',
			data: {
				tipo:tipo,
				idComponente:idComponente,
				valor:valor
			}
		}).done(function(data) {
			loading();
		});

		/*$.post("/save_valor_componente",{tipo:tipo,idComponente:idComponente,valor:valor},function(data){
			loading();
		});*/

	});

}



function edit_label_componente(){

	$('.label-comp').click(function(){		

		// si el proyecto está deshabilitado, rechazar el evento
		if($('#proyecto_disabled').val() == 'disabled')
			return false;

		$(this).css('background-color','none');

		var thisAux = $(this);

		var idComponente = $(this).parent().attr('id');		

		var valorIngresado = prompt('Ingrese descripción:',$(this).text());		

		if (valorIngresado!=null && valorIngresado!='') {

			$.ajax({
				url: '/4DACTION/edit_label_componente',
				dataType: 'json',
				type: 'POST',
				data: {
					idComponente:idComponente,
					valorIngresado:valorIngresado
				}
			}).done(function(data) {
				$(thisAux).text(valorIngresado.toUpperCase());
				loading();
			});

			/*$.post("/edit_label_componente",{idComponente:idComponente,valorIngresado:valorIngresado},function(data){

				$(thisAux).text(valorIngresado.toUpperCase());
				loading();

			});	*/

		}	

	});

}





/* participantes */

function add_participantes(){

	$('.add-participantes').click(function(){
		var idTarea = $(this).parents('.grupo-ots').children('input[name=idtarea]').val();
		var idArea = $(this).parents('.grupo-ots').find('select[name|=area-trabajo]').val();
		var loginResponsable = $(this).parents('.grupo-ots').find('select[name|=responsables]').val();
		if(idArea==0 | loginResponsable==""){
			alert("ATENCION : Debe seleccionar el Area de Trabajo y su Responsable.");
		}else{			

			$.get("/get_participantes/"+idArea+"/"+idTarea, function(data){
				$('#dialog-participantes').html(data);				
				$("#dialog-participantes").dialog({
					dialogClass:"dialog-confirm",resizable: false,height:330,width:500,modal: true,
					buttons: {
						"Aceptar": function() {
							guardar_participantes_tarea();
							$(this).dialog("close");
						},

						Cancelar: function(){
						  	$(this).dialog("close");
						}

					}

			    });				

			});					

		}		

	});

}



function guardar_participantes_tarea(){
	var participantes="";
	var login = "";
	var idtarea = $('#idTareaParticipantesxxx').val();
	$('#container-popup article input').each(function(){
		if ($(this).is(':checked')) {
			var login = $(this).val();		
			participantes = participantes+"/"+login;
		}		
	});	

	$.ajax({
		url: '/4DACTION/xguardar_part_tarea',
		dataType: 'html',
		type: 'POST',
		data: {
			idtarea:idtarea,
			participantes:participantes
		}
	}).done(function(data) {
		$("#"+idtarea).find('.content-p').html(data);		
		delete_participantes();
	});

	/*$.post("/xguardar_part_tarea",{idtarea:idtarea,participantes:participantes},function(data){		
		$("#"+idtarea).find('.content-p').html(data);		
		delete_participantes();
	});*/
	//closeDialog();

}



function delete_participantes(){
	$('.delete-part').click(function(){
		if (confirm('Está seguro(a) de eliminar el participante de la orden de trabajo?')) {
			var idTarea = $(this).parents('.grupo-ots').children('input[name=idtarea]').val();	
			var this2 = $(this);			
			var login = $(this).attr('id');
			$.ajax({
				url: '/4DACTION/delete_part_tarea',
				dataType: 'json',
				type: 'POST',
				data: {
					login:login,
					idtarea:idTarea
				}
			}).done(function(data) {
				if (data==1) {
					$(this2).parent().fadeOut('fast',function(){
						this.remove();
					});
				};
			});
			/*$.post("/delete_part_tarea",{login:login,idtarea:idTarea},function(data){
				if (data==1) {
					$(this2).parent().fadeOut('fast',function(){
						this.remove();
					});
				};
			});*/
		}
	});
}


var uploadForm = function(){
	$('.adjuntos').change(function(){
		/*$("#status").ajaxStart(function(){});*/
		var this2 = $(this);
		var objAdjunto = $(this).parents('.box-comp');
		var idComponentes = $(this).parents('.box-comp').attr('id');
		$(this).attr('id',"WU_xb_file");
		$.ajaxFileUpload({
			url:'/4DACTION/xupload_adjunto_componenente/' + idComponentes,
			secureuri:false,
			fileElementId:'WU_xb_file',
			dataType: 'json',
			success: function (data, status){
				loading();
				$(objAdjunto).find('.adjuntos').fadeOut();
				var adjunto = '';
				if (data.des_formato=="IMAGEN") {
					adjunto = adjunto+'<a target="_black" href="/uploads_componentes_tarea/'+data.ruta+'">';
					adjunto = adjunto+'<img width="80px" height="80px" src="/uploads_componentes_tarea/'+data.ruta+'">';
					adjunto = adjunto+'</a>';
					$(objAdjunto).find('.file-comp').html(adjunto);
				}else{
					adjunto = adjunto+'<a target="_black" href="/uploads_componentes_tarea/'+data.ruta+'">';
					adjunto = adjunto+'<img width="80px" height="80px" src="/extensiones/PNG/'+data.formato+'.png">';
					adjunto = adjunto+'</a>';
					$(objAdjunto).find('.file-comp').html(adjunto);
				}
				$(objAdjunto).find('.adjuntos').attr('id','');
			},
			error: function (data, status, e){
				alert("Ocurrió un ERROR al subir el archivo, intertar nuevamente.");
			}
		});
		return false;
	});	
}


function valida_pro(){
	if ($('#frm-proyect').find('input[name=nombre]').val()=="") {
		alert('ATENCION :\n FALTA INGRESAR EL NOMBRE DEL PROYECTO.');
		return false;
	}
	if ($('#frm-proyect').find('input[name=id-cliente]').val()==0) {
		alert('ATENCION :\n FALTA INGRESAR LOS DATOS DEL CLIENTE.');
		return false;
	}
	return true;
}


function anular_proyecto(){
	if(confirm("ESTÁ SEGURO(A) DE ANULAR EL PROYECTO?")) {
		var idProyecto = $('#idproyecto').val();
		$.ajax({
			url: '/4DACTION/anularproyecto',
			dataType: 'json',
			type: 'POST',
			data: {
				idProyecto:idProyecto
			}
		}).done(function(data) {
			if(data==1){		
				location.href="/4DACTION/proyectos/editp/"+idProyecto;	
			}
		});
		/*$.post("/anularproyecto",{idProyecto:idProyecto},function(data){
			if(data==1){		
				location.href="/4DACTION/proyectos/editp/"+idProyecto;	
			}
		});*/
	}
}











