$(document).ready(function(){
	$(".error-falta-datos").hide();
	$("#idpest-det-rev").hide();
	$("#bg-pop-guest").hide();
	$(".items-p-ot").show();
	$('.bloque-revisiones').hide();
	$("#add-asing").hide();
	//$(".add-invitados").hide();
	$("#cerrar-asing").hide();	
	$('#result-proyectos').hide();
	$('#result-empresas').hide();
	$("#status").hide();
	$(".pest-det-rev").hide();
	$(".box-add-guest-rev").hide();	
	$("#status-save-comment").hide();
	$("#status-save-rev").hide();	

	if($("#box-participantes div").length>0){
		$("#box-participantes").show();
	}else{
		$("#box-participantes").hide();
	}
	
	$('.link-sin-acceso').click(function() {
  		alert("UD. NO CUENTA CON PERMISO DE INGRESO A ESTE MODULO.");
	});	
	
	if($("#tipo-ot").val()=="PROYECTO"){
		$(".buscador-de-proyectos").show();
		$(".buscador-de-empresas").hide();		

		var idProy = 0;
		var idProy = $("#idproyecto-select").val();

		if(idProy == 0){
			$(".itemsnv").hide();
			$(".items-p-ot").hide();
		}else{
			if($("#items-tipo-ot").val()=="-1" || $("#items-tipo-ot").val()=="OTROS GASTOS"){				
				$(".items-p-ot").show();
				$(".itemsnv").hide();				
			}else{	
				$(".items-p-ot").show();
				$(".itemsnv").show();				
			}
		}		

	}else{
		$(".buscador-de-proyectos").hide();		
		$(".buscador-de-empresas").show();

		$(".items-p-ot").hide();
		$(".itemsnv").hide();
	}


	$("#buscar-empresas-auto").autocomplete({
		source: function(request,response) {
			$('#idempresa-select').val(0);
			$.ajax({
			  url: "/buscar_empresas_json",
			  dataType: "json",
			  data: {
			    name_startsWith:request.term,
                maxRows: 10
			  },
			  success: function(data) {
			  	response($.map(data.empresas,function(item) {
					return {
						label:item.nombre,
						value: item.nombre,
						idemp:item.idemp,
						email:item.email
					}
			    }));
			  }
			});
		},
		minLength:1,
		select: function(event,ui) {
			$('#idempresa-select').val(ui.item.idemp);		
		},
		change: function(event,ui) {
			var currentId = parseFloat($('#idempresa-select').val());
			var currentName = $("#buscar-empresas-auto").val().toUpperCase();
			if (currentId == 0 && currentName !="") {
				confirm('El cliente <strong style="font-weight:bold">"' + currentName + '"</strong> no está registrado.' + "\n\n" + '¿Deseas crearlo?').done(function(data) {
					if (data) {
						$.ajax({
							url: '/4DACTION/_V3_setContacto',
							dataType: 'json',
							data: {
								'id' : 0,
								'contact[alias]': currentName,
								'contact[razon]': currentName,
								'contact[tipo]' : 'EMPRESA'
							},
							async: false,
							success: function(data) {
								if (data.success) {
									$('#idempresa-select').val(data.id);
									$.ajax({
										url: '/4DACTION/_V3_save_ot_express',
										data: $("#frmnuevaot").serialize(),
										dataType: 'json',
										type: 'POST'
									}).done();
									toastr.success('Cliente creado con éxito!');
								} else {
									$('#idempresa-select').val(0);
									if (data.opened) {
										if (data.readonly)
											toastr.error('No fue posible guardar los datos del contacto. Otro usuario está bloqueando el registro.');
									} else {
										if (!data.unique)
											toastr.error('El contacto que intenta ingresar ya se almacenó previamente en la base de datos.');
										else
											toastr.error('El id del contacto no existe (error desconocido).');
									}
								}
							},
							error: function(xhr, text, error) {
								toastr.error('Falló conexión al servidor.');
							}
						});
					}else{
						$("#buscar-empresas-auto").css('border', '1px solid red');
					}
				});
			}
		}
	});

	$('.ub-user-edit').click(function() {
		unaBase.loadInto.dialog('/v3/views/contactos/content.shtml?id=' + $('#idempresa-select').val(), 'Perfil de Contacto', 'large');
	});

	/*$('#buscar-proyecto').keyup(function() {
		$('#idproyecto-select').val(0);
		$('#buscar-proyecto').removeClass("border-verde").addClass("border-rojo");
  		$.get("/buscaproyectos/"+$('#buscar-proyecto').val(), function(data){  			
	   	if(data!=0){
  				$('#result-proyectos').show();
       			$('#result-proyectos').html(data);	
  			}else{
  				$('#result-proyectos').hide();
       			$('#result-proyectos').html("");
  			}
		});
	});	

	$('#buscar-proyecto').click(function() {		
  		$.get("/buscaproyectos/"+$('#buscar-proyecto').val(), function(data){  			
  			if(data!=0){
  				$('#result-proyectos').show();
       		$('#result-proyectos').html(data);	
  			}else{  				
  				$('#result-proyectos').hide();
       		$('#result-proyectos').html("");	
  			}			 
		});
	});*/

	/*$(".lista-proyectos-ot").mouseleave(function() {
		$(this).hide();
	});*/
	
	/*$('#buscar-empresa').keyup(function(){
		$('#idempresa-select').val(0);		
		$('#buscar-empresa').removeClass("border-verde").addClass("border-rojo");
  		$.get("/buscaempresa/"+$(this).val(), function(data){  			
	   		if(data!=0){
  				$('#result-empresas').show();
       			$('#result-empresas').html(data);	
  			}else{
  				$('#result-empresas').hide();
       			$('#result-empresas').html("");
  			}	
		});
	});

	$('#buscar-empresa').click(function() {
		$.get("/buscaempresa/"+$(this).val(), function(data){  					
  			if(data!=0){
  				$('#result-empresas').show();
       			$('#result-empresas').html(data);	
  			}else{  				
  				$('#result-empresas').hide();
       			$('#result-empresas').html("");	
  			}			 
		});
	});	*/
	
	$('#add-asing').click(function() {
  		$(".add-invitados").fadeIn("slow", function(){
  			$("#cerrar-asing").show();
  			$("#add-asing").hide();
  		});  		
	});

	$('#cerrar-asing').click(function() {
  		$(".add-invitados").fadeOut("slow", function(){
  			$('#add-asing').show();
  			$('#cerrar-asing').hide();
  		});  		
	});	

	$('.cj-busca-invitados').click(function() {
		var valor = $(this).val();
		var areaTrabajo = $('#area-trabajo').val();		
  		$.get("/buscarasignado/"+areaTrabajo+"/"+valor, function(data){	   		
       		$('#list-invitados').html(data);
       		fn_select_user_invitado();
		});
	});

	$('.cj-busca-invitados').keyup(function() {
		var valor = $(this).val();
		var areaTrabajo = $('#area-trabajo').val();		
  		$.get("/buscarasignado/"+areaTrabajo+"/"+valor, function(data){	   		
       		$('#list-invitados').html(data);
       		fn_select_user_invitado();
		});
	});

	$('#saveot').click(function(){
		fn_guardar_nueva_ot();		
	});

	$('#tipo-ot').change(function(){

		if($(this).val()=="PROYECTO"){
			$(".buscador-de-proyectos").show();
			$(".buscador-de-empresas").hide();

			var idproyecto = $("#idproyecto-select").val();
			if(idproyecto>0){
				$(".items-p-ot").show();
				if($("#items-tipo-ot").val()!="-1" && $("#items-tipo-ot").val()!="OTROS GASTOS" ){									
					$(".itemsnv").show();
					$('.show-hide-horas').show();
				}else{
					$('.show-hide-horas').hide();
					$(".itemsnv").hide();
				}
				
			}else{
				$(".items-p-ot").hide();
				$(".itemsnv").hide();
			}
			
		}else{
			$(".buscador-de-proyectos").hide();
			$(".buscador-de-empresas").show();
			
			$(".show-hide-horas").hide();
			
		}		
	});

	$('#close-modal').click(function(){			
		closeModal();
	});

	$('#add-invitado').click(function(){
		var nombreInvitado = $('#guest-name').val();
		var correoInvitado = $('#guest-email').val();
		if(nombreInvitado!="" & correoInvitado!=""){
			$.post("/saveGuest",{name:nombreInvitado,email:correoInvitado});
			correoInvitado = "inv/guest_"+correoInvitado;
			var invitado = "<li><input checked type='checkbox' name='"+nombreInvitado+"' value='"+correoInvitado+"'/><span class='part-invitado'>"+nombreInvitado+"</span></li>";
			$('#container-pop-participantes .lista-participantes').append(invitado);
			$('#guest-name').val("");
			$('#guest-email').val("");
			$('#guest-name').focus();
		}
	});
	
	$('#nueva-revision').click(function(){		
		var idOt = $("#idotrev").val();
		var date = fn_currentDate2();	
		var randomnumber = Math.floor(Math.random()*999999);
		var random = String(randomnumber)+'_'+date+'_'+fn_currentTime('hours-minutes-seconds');		
		$("#asuntorevision").css({'border-color':'#A4A4A4'});
		$("#contenidorevision").css({'border-color':'#A4A4A4'});		
		$("#asuntorevision").val('');
		$('#hora-rev').val(fn_currentTime('hours'));
		$('#date-rev').val(fn_currentDate());
		$('#idrevision').val(0);
		$("#contenidorevision").val('');
		$('#idrevision-temporal').val(random);
		$.get("/getAllPartcipantesOtRev/"+idOt, function(data){
			$('#box-participantes-revision').html(data); 
			fn_click_chk_inv();		
		});
		$('.bloque-revisiones').fadeIn(function(){				
			$('#nueva-revision').fadeOut("fast");					
		});		
	});

	$('#cancelar-rev').click(function(){
		var idRevision = $("#idrevision").val();
		$("#asuntorevision").css({'border-color':'#A4A4A4'});
		$("#contenidorevision").css({'border-color':'#A4A4A4'});		
		$('#idrevision').val(0);
		$('.bloque-revisiones').fadeOut(function(){
			$('#nueva-revision').fadeIn("fast");
		});			
	});

	$('#save-rev').click(function(){
		var error = "";
		var idOt = $("#idotrev").val();
		var resp = $("#loginotrev").val();
		var subj = $("#asuntorevision").val();
		var com = $("#contenidorevision").val();
		var idrev = 0;
		var part = $("#selected-participants").val();
		var horav = $("#hora-rev").val();
		var fechav = $("#date-rev").val();
		var idtemporal = $("#idrevision-temporal").val();
		$("#asuntorevision").css({'border-color':'#A4A4A4'});
		$("#contenidorevision").css({'border-color':'#A4A4A4'});

		var compareDate = fn_valid_current_date(fechav,fn_currentDate());
		var textAddGuest= $('#add-guest-rev').text();
			
		if(subj=="" || com=="" || compareDate=="menor" || textAddGuest=="Cancelar"){
			if(subj == ""){
				error = "error";
				$("#asuntorevision").css({'border-color':'red'});
			}
			if(com == ""){
				error = "error";
				$("#contenidorevision").css({'border-color':'red'});
			}
			if(compareDate=="menor"){
				error = "error";
				alert("LA FECHA TIENE QUE SER MAYOR O IGUAL A LA FECHA ACTUAL.");
			}
			if(textAddGuest=="Cancelar"){
				if(confirm("DESEA AGREGAR EL INVITADO?")){
					alert('si');
				}else{
					alert('no');
				}	
			}
		}

		if(error == ""){

			var notify = "no";
			if(confirm("DESEA NOTIFICAR A LOS PARTICIPANTES?")) { 		
				notify = "si";				
  			}else{
  				notify = "no";	
  			}
			//$(".disabled").attr('disabled',true);

			fn_open_loading('Guardando, espere un momento...');	

			
			$.ajax({
			    type: "POST",
			    url: "/saverev",
			    data: {idOt:idOt,resp:resp,subj:subj,com:com,idrev:idrev,part:part,fechav:fechav,horav:horav,notify:notify,idtemporal:idtemporal},
		        success: function(data){
			       	$(".list-revisiones").fadeOut("fast",function(){   				
	   					$(".list-revisiones").html(data);
	   					fn_deteleRevision();
						fn_see_revision(); 					
	   					fn_clean_input_revision();
						$(".list-revisiones").fadeIn();
						$(".disabled").attr('disabled',false);
						$("#status-save-rev").hide();
						fn_close_loading();					
	   				});
		      	}
			});
		}				
	});	

	$('#ver-all-revisiones').click(function(){
		var idot = $("#id-ot").val();
		$.get("/traeRevOt/"+idot, function(data){	   		
   			$(".list-revisiones").html(data);
			fn_deteleRevision();
			fn_see_revision();	       			
		});
		$(".pest-det-rev").hide();
		$(".pest-det-rev .detalle").html("");
		$(".pest-lista-rev").show();
	});


	

	$('#items-tipo-ot').change(function(){
		var valor = $('#items-tipo-ot').val()
		var idnv = $('#idproyecto-select').val()
		if(valor =="ITEM DIRECTO"){
			$.get("/traeitemsnv/"+idnv, function(data){	   		
       			$('#llave-det-nvx').html(data);       			
			});
			$('.itemsnv').show();
			$('.show-hide-horas').show();
		}else{
			$('.itemsnv').hide();
			$('.show-hide-horas').hide();
		}
	});

	$('#llave-det-nvx').change(function(){
		//alert();
		var idnv = $('#idproyecto-select').val();
		var llaveNv = $('#llave-det-nvx').val();
		$.getJSON("/traeCantItems/"+idnv+"/"+llaveNv, function(data){
			$('#hasignada').val(0);
			$('#hdisp').val(data.hdisponibles);
			$('#htotal').val(data.htotales);	
			$('#hrest').val(data.hdisponibles);
			if($('#idcomment-otxx').val()==""){
				$('#idcomment-otxx').val(data.desdetalle);
			}
			var calculo = parseInt(data.hdisponibles);
			if(calculo<0){
				$('#hdisp').css({'color':'red'});
				$('#hrest').css({'color':'red'});
			}else{
				$('#hdisp').css({'color':'black'});
				$('#hrest').css({'color':'black'});
			}
		});		
	});

	$('#close-modal-file').click(function(){		
		closeModalFile();
	});	
	
	$("#select-all-part-rev").click(function(){
		$(".check-revision").attr('checked',true);
		fn_check_Revision();
	});

	$("#not-select-all-part-rev").click(function(){
		$(".check-revision").attr('checked',false);
		fn_check_Revision();
	});		

	
	

	/*$('.combinadas').bind('change keyup', function() {

		var mes = $("#mes-select-filters").val();
		var ano = $("#ano-select-filters").val();	
		var state = $("#search-estado").val();		
		var login = $("#globalLogin").val();				
		var prioridad = $("#select-filters-prio").val();
		var responsable = $("#select-filters-resp-ot").val();
		var areas = $("#select-filters-areas-ot").val();
		var buscarpor = $("#input-search-ot").val();	

		if (buscarpor=="") {
			buscarpor="all";
		};

		if (state=="PENDIENTE/ATRASADA") {
			state = "PA";
		};

		//var link = "/4DACTION/exportar_ot/"+state+"/"+login+"/"+mes+"/"+ano+"/"+prioridad+"/"+buscarpor+"/"+responsable;
		var link = "/4DACTION/exportar_ot/"+state+"/"+login+"/"+mes+"/"+ano+"/"+prioridad+"/"+buscarpor+"/"+responsable+"/"+areas;
		$(".link-tipo-button").attr("href",link);

		if (state=="PA") {
			state = "PENDIENTE/ATRASADA";
		};
		
		$.post("/busquedasCombinadasOt",{
				state:state,
				login:login,
				mes:mes,
				ano:ano,
				prioridad:prioridad,
				texto:buscarpor,
				areas:areas,
				responsable:responsable				
			},function(data){
				$("#content-list-ot").html(data);				
				initializeOrderTable();
			}
		);

	});*/

	$("#see-hide-file-ot").click(function(){
		var html = $(this).html();
		if(html == "ver"){
			$(".box-items-files").fadeIn();
			$(this).html("ocultar");
		}else{
			$(".box-items-files").fadeOut();
			$(this).html("ver");
		}
	});

	$("#bgtransparent3").click(function(){
		closeModalViewImg();
	});	

	//---
	$("#referencia-ot").keyup(function(){
		var cadena = "\'Hola Mundo\'";
		var valor = $("#referencia-ot").val();
		if(valor==""){
			$(".reference-ot").text("");
		}else{
			var ref =  '\"'+valor+'\"';
			$(".reference-ot").text(ref.toLowerCase());
		}	
		
	});
	$("#referencia-ot").change(function(){
		var cadena = "\'Hola Mundo\'";
		var valor = $("#referencia-ot").val();
		if(valor==""){
			$(".reference-ot").text("");
		}else{
			var ref =  '\"'+valor+'\"';
			$(".reference-ot").text(ref.toLowerCase());
		}	
		
	});
	//---
	
	$("#li-tabs-datos-ot").click(function(){		
		var idOt = $("#id-ot").val();		
		var idRevision = "0";
		var tipo = "OT";	
		$.get("/traeupload/"+idOt+"/"+tipo+"/"+idRevision, function(data){
			$('.box-files-ot').html(data);			
			fn_deteleFileNormal();
			fn_deteleFileComp();
			fn_count_file_ot();
			fn_open_LightBox();
		});
	});	

	$("#li-tabs-files").click(function(){		
		var idOt = $("#id-ot").val();
		$.get("/traeAllFilesOt/"+idOt, function(data){	   		
			$('.block-files').html(data);
			fn_deteleFile();
			fn_open_LightBox();
		});	
	});

	$('#date-rev').change(function(){
		var date = $(this).val();
		var dateVctoOt = $('#fecha-vcto').val();		
		if(fn_valid_current_date(date,dateVctoOt)=='menor'){
			if(fn_valid_current_date(date,fn_currentDate())=="menor"){
				alert("LA FECHA TIENE QUE SER MAYOR O IGUAL A LA FECHA ACTUAL.");
				$(this).val(fn_currentDate());
			}
		}else{
			alert("LA FECHA TIENE QUE SER MENOR A LA FECHA DE VENCIMIENTO DE LA OT.");
			$(this).val(fn_currentDate());
		}		
	});
	
	//fn_save_ot();
	fn_see_revision_guest();
	fn_see_revision();
	fn_delete_user_asing();
	fn_count_asing();
	fn_seleccionar_todo_participantes();
	fn_deseleccionar_todo_participantes();
	fn_upload_file();
	fn_deteleFile();
	fn_deteleFileNormal();
	fn_deteleFileComp();
	fn_deteleRevision();
	fn_sendFile();
	fn_btn_comment_revision();
	fn_btn_comment_revision2();
	fn_check_Revision();
	fn_click_chk_inv();	
	fn_count_file_ot();
	fn_open_LightBox();	

	$('#ver-all-revisionesx').click(function(){	
		$(".list-revisiones").show();		
		$("#idpest-det-rev").hide();


		//$(".pest-det-rev").hide();
		//$(".pest-det-rev .detalle").html("");
				
		/*$.get("/traeRevOt/"+idot, function(data){	   		
   			$(".list-revisiones").html(data);
			fn_deteleRevision();
			fn_see_revision();	       			
		});*/		
	});

});

function fn_see_revision_guest(){	
	$('.items-revision2').click(function(){		
		var idRev = $(this).attr('id');
		var login = $('#globalLogin').val();
		$.get("/guestdetallerevision/"+idRev+"/"+login, function(data){		
			$(".list-revisiones").hide();
			//$(".pest-lista-rev").hide();
			$("#idpest-det-rev .detalle").html(data);			
			$("#idpest-det-rev").show();
			fn_deteleFile();
			fn_open_LightBox();
			fn_btn_comment_revision2();			
		});	
	});
}
	
//============
function fn_valid_current_date(fecha1,fecha2){		
	if(fecha1==fecha2){
		return "igual";
	}else{			
		if(compare_dates(fecha1,fecha2)){
		  //fecha1 es mayor a fecha2
		  return "mayor";
		}else{
		  //fecha1 es menor a fecha2
		  return "menor";
		}
	}
}
//============
function compare_dates(fecha, fecha2){
    var xMonth=fecha.substring(3, 5);
    var xDay=fecha.substring(0, 2);
    var xYear=fecha.substring(6,10);
    var yMonth=fecha2.substring(3, 5);
    var yDay=fecha2.substring(0, 2);
    var yYear=fecha2.substring(6,10);
    if (xYear> yYear)
    {
        return(true)
    }
    else
    {
      if (xYear == yYear)
      { 
        if (xMonth> yMonth)
        {
            return(true)
        }
        else
        { 
          if (xMonth == yMonth)
          {
            if (xDay> yDay)
              return(true);
            else
              return(false);
          }
          else
            return(false);
        }
      }
      else
        return(false);
    }
}

//======
function fn_currentDate(){
	var mydate = new Date();
	var year=mydate.getYear();
	if (year < 1000)
		year+=1900;

	var day=mydate.getDay();
	var month=mydate.getMonth()+1;
	if (month<10)
		month="0"+month;
	
	var daym=mydate.getDate();
	if (daym<10)
		daym="0"+daym;

	return daym+"/"+month+"/"+year;
}

function fn_currentDate2(){
	var mydate = new Date();
	var year=mydate.getYear();
	if (year < 1000)
		year+=1900;

	var day=mydate.getDay();
	var month=mydate.getMonth()+1;
	if (month<10)
		month="0"+month;
	
	var daym=mydate.getDate();
	if (daym<10)
		daym="0"+daym;

	return daym+":"+month+":"+year;
}

function fn_currentTime(formats){
	var current = new Date(); 
   	var hour = current.getHours();
   	var minute = current.getMinutes(); 
   	var second = current.getSeconds();   
    if(hour<10){
      hour = "0"+hour;
    }
    if(minute<10){
      minute = "0"+minute;
    }
    if(second<10){
      second = "0"+second;
    }

    var timesAux="";
    if(formats=="hours"){
    	timesAux = hour+":00:00";
    }    	

    if(formats=="hours-minutes"){
    	timesAux = hour+":"+minute+":00";
    }

    if(formats=="hours-minutes-seconds"){
    	timesAux = hour+":"+minute+":"+second;
    }    	
    return timesAux;
}
//================================
function fn_open_LightBox(){
	$(".img-popup").click(function(){
		var file = this.id;
		var alt = $(this).attr("alt");
		var dim = alt.split("-");
		var wimg =  dim[0];
		var himg = dim[1];
		$.get("/showFilePopUp/"+file, function(data){						
			openModaViewImg(data);			
			resizeViewImg(wimg,himg);		
		});
	});
}
//================================
function fn_click_chk_inv(){
	$(".check-revision").click(function(){		
		fn_check_Revision();
	});
}

//==============================================
function fn_seleccionar_todo_participantes(){
	$('#todo-part').click(function() {
		$('#container-pop-participantes input').each(function(index){			
			$(this).attr('checked', true);			
		});
	});	
}
//==============================================
function fn_deseleccionar_todo_participantes(){
	$('#ninguno-part').click(function() {
		$('#container-pop-participantes input').each(function(index){			
			$(this).attr('checked', false);			
		});
	});	
}
//==============================================
function fn_check_Revision(){	
	var valorNew = "";	
	$(".check-revision").each(function(index){
		if($(this).is(":checked")){
			valorNew = valorNew +":"+ $(this).val();			
		}			
	});		
	$("#selected-participants").val(valorNew);
}
//================================



//================================

function fn_btn_comment_revision(){
	$("#btn-comment-revision").click(function(){		
		var _comment = $("#text-coment").val();
		var _idRevision = $("#input-id-det-revision").val();
		
		$(".box-general-det-rev #text-coment").css({'border-color':'black'});

		if(_comment!=""){
			fn_open_loading('Guardando, espere un momento...');			
			$.post("/saveCommentRevision",
				{
					comment : _comment,
					idRevision : _idRevision					
				},
	   			function(data){
	   			$("#list-coment-rev").fadeOut("fast",function(){	   				
	   				$("#text-coment").val("");			
	   				$(this).html(data);
	   				$(this).fadeIn("fast");
	   				fn_close_loading();			
	   			});
   			});
		}else{			
			$(".box-general-det-rev #text-coment").css({'border-color':'red'});
		}	
	});	
}

//================================

function fn_btn_comment_revision2(){
	$("#btn-comment-revision2").click(function(){		
		var loginGuest = $("#globalLogin").val();
		var comment = $("#text-coment").val();
		var idRevision = $("#input-id-det-revision").val();
		$(".box-general-det-rev #text-coment").css({'border-color':'black'});
		if(comment!=""){
			fn_open_loading('Guardando, espere un momento...');		
			$.post("/2saveCommentRevision",
				{
					login : loginGuest, 
					comment : comment,
					idRevision : idRevision		
				},
	   			function(data){
	   			$("#list-coment-rev").fadeOut("fast",function(){	   				
	   				$("#text-coment").val("");			
	   				$(this).html(data);
	   				$(this).fadeIn("fast");
	   				fn_close_loading();			
	   			});
   			});
		}else{			
			$(".box-general-det-rev #text-coment").css({'border-color':'red'});
		}
	});	
}
//==============================================
function fn_deteleRevision(){	
	$(".items-revision .delete-revision").click(function(){
		var idOt = $("#id-ot").val();
		var idRevision = $(this).attr("name");
		$.get("/deleteRevision/"+idRevision, function(data){			
			if(data!=0){
				$("#"+idRevision).fadeOut("slow",function(){
					$(this).remove();
				});
				$.get("/traeAllFilesOt/"+idOt, function(data){	   		
					$('.block-files').html(data);
					fn_deteleFile();			
				});				
			}else{  				
				alert("NO SE PUDO ELIMINAR EL ARCHIVO.");
			}			 
		});		
	});	
}
//==============================================
function fn_deteleFile(){	
	$('.delete-file').click(function(){	
		var idFile = $(this).parent().attr('id');	
		var this2 = $(this);
		$.get("/deleteFile/"+idFile, function(data){			
			if(data!=0){
				$(this2).parent().fadeOut("slow",function(){
					$(this).remove();
				});						
			}else{  				
				alert("NO SE PUDO ELIMINAR EL ARCHIVO.");
			}			 
		});
	});
}

//==============================================
function fn_sendFile(){	
	$('.send-file').click(function(){	
		var idFile = $(this).parent().attr('id');	
		var filename = $(this).parent().find('span.des-file').text();
		var username = $('#globalLogin').val();
		$("#dialog-send-file").dialog({
			resizable: false,
			height:135,
			width:380,
			modal: true,
			title: "Enviar archivo via email: " + filename,
			buttons: {
				"Aceptar": function() {
					var email = $("#dialog-send-file").find("input").val();
					if(email != "") {
						$.get("/sendFile/"+idFile.substring(2)+"/"+email+"/"+filename.replace(/[^a-z0-9\.\-_]/gi, '-')+"/"+username, function(data){
							if(data!=0) {
								alert("Archivo " + filename + " enviado por correo a " + email);
								$("#dialog-send-file").dialog("close");
							}
							else
								alert("No fue posible enviar el archivo " + filename + ". Error interno del servidor.");
						});
					} else
						alert("No ha ingresado ninguna dirección de email. Por favor, reintente.");
				},
				"Cancelar": function() {	        	
				  	$(this).dialog("close");
				}
			}
	    });	

		
	});
}

//==============================================
function fn_count_file_ot(){
	if($('.box-files-ot a').length == 0){
		$('.label-archivos-ot').hide();					
	}else{
		$('.label-archivos-ot').show();		
	}
}
//==============================================
function fn_deteleFileNormal(){	
	$('.delete-file-normal').click(function(){		
		var idFile = $(this).attr("rel");		
		var idOt = $("#id-ot").val();		
		$.get("/OTdeleteFile/"+idFile, function(data){			
			if(data!=0){
				$("#id"+idFile).fadeOut("slow",function(){
					$(this).remove();
					fn_count_file_ot();
				});			

			}else{  				
				alert("NO SE PUDO ELIMINAR EL ARCHIVO.");
			}							
		});
	});
}
//==============================================
function fn_deteleFileComp(){	
	$('.delete-file-comp').click(function(){	
		var idFile = $(this).attr("rel");		
		var idOt = $("#id-ot").val();
		$.post("/delete_componente",{idComponente:idFile},function(data){
			if(data!=0){
				$("#id"+idFile).fadeOut("slow",function(){
					$(this).remove();
					fn_count_file_ot();
				});						
			}else{  				
				alert("NO SE PUDO ELIMINAR EL ARCHIVO.");
			}
		});		
	});
}
//==============================================
function fn_see_revision(){	
	$('.items-revision .click').click(function(){		
		var _idrev = $(this).attr("style");
		$.get("/detallerevision/"+_idrev, function(data){
			$(".pest-lista-rev").hide();
			$(".pest-det-rev .detalle").html(data);
			fn_deteleFile();
			fn_open_LightBox();	
			$(".pest-det-rev").show();
			fn_btn_comment_revision();
		});	
	});
}

//==============================================
function fn_clean_input_revision(){
	$("#asuntorevision").val("");
	$("#contenidorevision").val("");
	$("#lista_de_archivos_rev").html("");
	$('#box-participantes-revision input').each(function(index){			
		$(this).attr('checked', false);			
	});

	$('.bloque-revisiones').fadeOut(function(){
		$('#nueva-revision').fadeIn("fast");
	});
}
//==============================================
function fn_verificar_existe_participante_rev(valorx){
	var cont = 0;	
	$('#box-participantes-revision input').each(function(index){		
		if($(this).val() == valorx){
			cont++;
		}			
	});
	return cont;
}
//==============================================
function fn_select_user_invitado(){	
	$('#list-invitados select option').click(function() {
		var valorAux = $("#select-inv").val();		
		var cant = 0;
		$('#box-asignados input').each(function(index){
			var valor = $(this).val();
			if(valor == valorAux){
				cant++;	
			}					
		});
		if(cant>0){
			alert("EL USUARIO YA SE ENCUENTRA AGREGADO!");
			$('#nombre-invitado').val("");
			$('#correo-invitado').val("");
			$('#nombre-invitado').focus();
		}
		$('#list-invitados select').remove();
	});
}
//==============================================
function fn_count_asing(){
	var cant = $("#box-asignados div").length;
	$(".cant-asing").html(cant);	
}
//==============================================
function fn_delete_user_asing(){	
	$('.delete').click(function(){
		$(this).parent("div").fadeOut("slow",function(){			
			$(this).remove();			
			fn_count_asing();
		});		
	});
}

//==============================================
/*function fn_select_proyecto(idNv,referencia){	
	$('#idproyecto-select').val(idNv);
	$('#buscar-proyecto').val(referencia);
	$('#buscar-proyecto').removeClass("border-rojo").addClass("border-verde");
	$('#result-proyectos').hide();

	var data = "";
	data = data + "<option selected='selected' value='-1'>[ Seleccionar ]</option>";
	data = data + "<option value='ITEM DIRECTO'>ITEM DIRECTO</option>";
	data = data + "<option value='OTROS GASTOS'>OTROS GASTOS</option>";	
	$(".items-p-ot").show();
	$(".itemsnv").hide();
	$("#items-tipo-ot").html(data);

}*/
//==============================================
/*function fn_select_empresa(idEmpresa,referencia){
	$('#idempresa-select').val(idEmpresa);
	$('#buscar-empresa').val(referencia);
	$('#buscar-empresa').removeClass("border-rojo").addClass("border-verde");
	$('#result-empresas').hide();
}*/
//==============================================
function fn_guardar_nueva_ot(){	
	var msjError = "";
	var tipoOt = $("#tipo-ot").val();

	if(tipoOt == "PROYECTO"){
		if($("#idproyecto-select").val() == ""){
			msjError = msjError+"\n- DEBE SELECCIONAR UN PROYECTO.";
		}
	}else{
		if($("#idempresa-select").val() == ""){
			msjError = msjError+"\n- DEBE SELECCIONAR UNA EMPRESA.";
		}
	}

	if($("#referencia-ot").val() == ""){
		msjError = msjError+"\n- DEBE INGRESAR UNA REFERENCIA.";
	}

	if($("#area-trabajo").val() == "-1"){
		msjError = msjError+"\n- DEBE SELECCIONAR UNA AREA DE TRABAJO.";
	}
	
	if($("#container-pop-participantes").find("input").length == 0){
		msjError = msjError+"\n- DEBE ASIGNAR AL MENOS UN USUARIO.";
	}

	if($("#tipo-tarea").val() == "-1"){
		msjError = msjError+"\n- DEBE SELECCIONAR UN TIPO DE TAREA.";
	}

	if($("#importancia").val() == "-1"){
		msjError = msjError+"\n- DEBE SELECCIONAR LA IMPORTANCIA.";
	}

	if($("#fecha-vcto").val() == ""){
		msjError = msjError+"\n- DEBE SELECCIONAR UNA FECHA DE VCTO.";
	}

	if($("#hora").val() == ""){
		msjError = msjError+"\n- DEBE SELECCIONAR UNA HORA.";
	}

	if($("#contenido").val() == ""){
		msjError = msjError+"\n- DEBE INGRESAR UN CONTENIDO.";
	}	

	if(msjError == ""){
		$("#frmnuevaot").submit();
	}else{
		alert("ATENCION :"+msjError);
	}
}

//==============================================
function fn_upload_file(){	
	$('#upload-file-revision').click(function(){
		var from = $('#origen-file').val();
		uploadForm('WU_xb_file',from);
		closeModalFile();
		return false;
	});	
}

//==============================================
var uploadForm = function(elementId,tipo){
	var idOt = $("#id-ot").val();
	var login = $("#login-ot").val();
	//var idRevision = $("#idrevision").val();
	var idRevisionTemp = $("#idrevision-temporal").val();	

	if(tipo!="REVISION"){
		idRevisionTemp = 0;
	}

	$("#status").ajaxStart(function(){		
		$(this).show();
		$(this).html('Por favor espere...');
	});
	
	$.ajaxFileUpload({
		url:'/upload/'+idOt+'/'+tipo+'/'+login+'/'+idRevisionTemp,
		secureuri:false,
		fileElementId:elementId,
		dataType: 'xml',
		success: function (data, status){
			$("#status").html("<span class='ok'></span>");
			fn_trae_archivos_upload(idOt,tipo,idRevisionTemp);		
		},
		error: function (data, status, e){			
			$("#status").html("<span class='fail'></span>");			
		}
	});	
	return false;
};

//==============================================
function fn_trae_archivos_upload(id,tipo,_idrevision){
	$.get("/traeupload/"+id+"/"+tipo+"/"+_idrevision, function(data){
		if(tipo=="REVISION"){
			$('#lista_de_archivos_rev').html(data);
			fn_open_LightBox();
			fn_deteleFile();
		}
		if(tipo=="OT"){				
			$('.box-files-ot').html(data);
			fn_deteleFileNormal();
			fn_deteleFileComp();
			fn_count_file_ot();
			fn_open_LightBox();	
		}
		if(tipo=="FILES"){
			$('#lista_de_archivos_rev').html(data);
			fn_deteleFile();
		}
	});
}
//==============================================

function fn_valid_email(value){
	if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)){
		return true;
	}else{		
		return false;
	}
}

//==============================================
function fn_anular_rendicion(idRend){
	var login = $('#globalLogin').val();	
	if(confirm("ESTA SEGURO DE ANULAR LA RENDICION.?")){
		var motivo = prompt("Ingrese motivo : ","");
		if(motivo!=""){
			$.get("/anularRendicion/"+idRend+"/"+motivo+"/"+login, function(data){
				if(data==0){
					alert("NO SE PUDO ANULAR LA RENDICION, INTENTELO DE NUEVO.");
				}
				if(data==1){
					location.href="/4DACTION/W_LISTA_SOL/ln/0";
				}
				if(data==2){
					alert("NO SE PUDO ANULAR, LA RENDICION POSEE DOCUMENTOS RENDIDOS.");
				}
			});	
		}
	}
}
//==============================================
//<a href="/4DACTION/W_LISTA_SOL/ln/0">RENDICION</a>


/*$("#fecha-vcto").css({'border':'1px solid #A4A4A4'});
$("#hora").css({'border':'1px solid #A4A4A4'});
$("#referencia-ot").css({'border':'1px solid #A4A4A4'});
$("#importancia").css({'border':'1px solid #A4A4A4'});
$("#area-trabajo").css({'border':'1px solid #A4A4A4'});
$("#idcomment-otxx").css({'border-color':'#A4A4A4'});
$("#box-part-").css({'border':'none'});
$("#buscar-empresa").css({'border':'1px solid #A4A4A4'});
$("#buscar-proyecto").css({'border':'1px solid #A4A4A4'});*/

//|| hasig=="0"   || resp=="-1" || hVcto=="-1" || cantPart==0


/*$(".error-falta-datos").fadeIn();
			setTimeout("$('.error-falta-datos').fadeOut();",2500);*/
		
			/*if(fVcto=="00/00/00"){
				$("#fecha-vcto").css({'border':'2px solid red'});
			}
			if(hVcto=="-1"){
				$("#hora").css({'border-color':'red'});
			}
			if(ref==""){
				$("#referencia-ot").css({'border':'2px solid red'});
			}
			if(impor=="-1"){
				$("#importancia").css({'border':'2px solid red'});
			}
			if(area=="-1"){
				$("#area-trabajo").css({'border':'2px solid red'});
			}*/
			/*if(resp=="-1"){
				$("#responsables-area").css({'border-color':'red'});
			}
			if(hasig=="0"){
				$("#hasignada").css({'border-color':'red'});
			}*/
								
			/*if(desc==""){
				$("#idcomment-otxx").css({'border':'2px solid red'});
			}*/
			
		/*	if(cantPart==0){				
				$("#box-part-").css({'border':'2px solid red'});
			}
			
			if(proyGen==0){
				if(tipoOt=="PROYECTO"){
					$("#buscar-proyecto").css({'border':'2px solid red'});
				}else{
					$("#buscar-empresa").css({'border':'2px solid red'});
				}				
			}*/