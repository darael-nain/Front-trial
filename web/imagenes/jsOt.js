$(document).ready(function(){

	$(".data-mandatory").hide();
	
	$("#btn-new-ot-").click(function(){		
		location.href="/4DACTION/ot/n/0";
	});


	$("#btn-planner-ot").click(function(){
		location.href="/4DACTION/plannerOT/all/TODOS/TODOS/TODOS";
	});
	
	//calculated allocation of hours.
	$("#hasignada").change(function(){
		var hasig = parseInt($(this).val());
		var hPres = parseInt($("#hpre").val());
		var calculo = hPres-hasig;
		$("#hdif").val(calculo);
		if(calculo<0){
			$("#hdif").css({'color':'red'});
		}else{
			$("#hdif").css({'color':'black'});
		}
	});

	//open popup of preferences.
	$("#btn-preferences-ot").click(function(){
		openLightBox("bg-preferences","modal-preferences","400","400");
	});

	//close popup of preferences.
	$("#close-pop-preferencias").click(function(){
		closeLightBox("bg-preferences","modal-preferences");
	});

	//save popup of preferences.
	$("#save-pop-preferencias").click(function(){
		var diasDesde = $("#pref-dias-desde").val();
		var diasHasta = $("#pref-dias-hasta").val();
		var horasDesde = $("#pref-hora-desde").val();
		var horasHasta = $("#pref-hora-hasta").val();
		$.post("/savepreferencesot",
		{
			diasDesde : diasDesde,
			diasHasta : diasHasta,
			horasDesde : horasDesde,
			horasHasta : horasHasta
		},
		function(data){
			//alert("Datos guardados!");
			closeLightBox("bg-preferences","modal-preferences");
		});		
	});

	//open popup of planner.
	$("#ver-planner-from-ot").click(function(){			
		fn_ot_show_planner_();		
		openLightBox("bg-ver-planner","modal-ver-planner","1100","500");
	});

	//close popup of planner.
	$("#close-pop-planner-ot").click(function(){
		close_pop_planner();
	});	

	//select guest
	fn_select_guest();
	fn_select_guest2();

	//select guest close
	$(".guest-box-suggest").mouseleave(function(){		
		$('#guest-list-suggest-email').hide();
		$('#guest-list-suggest-name').hide();		
	});

	$('#guest-list-suggest-name').hide();
	$('#guest-list-suggest-email').hide();
	$('#guest-list-suggest-name2').hide();
	$('#guest-list-suggest-email2').hide();

	fn_filter_resp_planner2();
	$('#bg-loading').hide();
	
	$("#add-guest-rev").click(function(){
		$.get("/getFrm/frm_add_guest.html", function(data){
			$("#modal-pop-guest").html(data);
			fn_search_guest_by_name2();
			fn_search_guest_by_email2();
			fn_close_box_suggest();
			fn_save_guest_rev();
		});				
		openLightBox("bg-pop-guest","modal-pop-guest","400","220");
	});

	fn_save_guest_rev();
});

//==========

function fn_close_box_suggest(){
	$(".guest-box-suggest").mouseleave(function(){		
		$('#guest-list-suggest-email2').hide();
		$('#guest-list-suggest-name2').hide();
	});	
}

function fn_search_guest_by_name(){
	//search guest by name
	$('#guest-name').bind('keyup click', function() {		
  		var name = $(this).val();
  		$.get("/searchSuggestGuest/name/"+name, function(data){  			
	   		if(data!=0){  				
       			$('#guest-list-suggest-name').html(data);
       			$('#guest-list-suggest-name').show();
       			fn_select_guest();
  			}else{  				
       			$('#guest-list-suggest-name').html("");
       			$('#guest-list-suggest-name').hide();
  			}
		});
	});
}

function fn_search_guest_by_email(){
	//search guest by email
	$('#guest-email').bind('keyup click', function() {
  		var email = $(this).val();
  		$.get("/searchSuggestGuest/email/"+email, function(data){  			
	   		if(data!=0){  				
       			$('#guest-list-suggest-email').html(data);
       			$('#guest-list-suggest-email').show();
       			fn_select_guest();
  			}else{  				
       			$('#guest-list-suggest-email').html("");
       			$('#guest-list-suggest-email').hide();
  			}
		});
	});
}

function fn_search_guest_by_name2(){
	//search guest by name2
	$('#guest-name2').bind('keyup click', function() {		
  		var name = $(this).val();
  		$.get("/searchSuggestGuest/name/"+name, function(data){  			
	   		if(data!=0){  				
       			$('#guest-list-suggest-name2').html(data);
       			$('#guest-list-suggest-name2').show();
       			fn_select_guest2();
  			}else{  				
       			$('#guest-list-suggest-name2').html("");
       			$('#guest-list-suggest-name2').hide();
  			}
		});
	});
}

function fn_search_guest_by_email2(){
	//search guest by email2
	$('#guest-email2').bind('keyup click', function() {
  		var email = $(this).val();
  		$.get("/searchSuggestGuest/email/"+email, function(data){  			
	   		if(data!=0){  				
       			$('#guest-list-suggest-email2').html(data);
       			$('#guest-list-suggest-email2').show();
       			fn_select_guest2();
  			}else{  				
       			$('#guest-list-suggest-email2').html("");
       			$('#guest-list-suggest-email2').hide();
  			}
		});
	});	
}

function fn_select_guest(){
	$('.select-guest').click(function() {
		var array = $(this).attr("rel").split(":");
		var name = array[0];
		var email = array[1];
		$('#guest-name').val(name);
		$('#guest-email').val(email);
		$('#guest-list-suggest-name').hide();
		$('#guest-list-suggest-email').hide();
	});	
}

function fn_select_guest2(){
	$('.select-guest2').click(function() {
		var array = $(this).attr("rel").split(":");
		var name = array[0];
		var email = array[1];
		$('#guest-name2').val(name);
		$('#guest-email2').val(email);
		$('#guest-list-suggest-name2').hide();
		$('#guest-list-suggest-email2').hide();
	});	
}

function close_pop_planner(){
	closeLightBox("bg-ver-planner","modal-ver-planner");
}

function fn_show_asignados_planner2(){
	$('.pointer').each(function(index){		
		var datos = $(this).attr("title");
		var dim = datos.split(":");
		var _hora = dim[0];
		var _idOt = dim[1];		
		var _fVcto = dim[2];
		var _fActual = dim[3];
		var _prioridad = dim[4];		
		var this2 = $(this);		
		$(this2).css({"width":"auto"});
		$.get("/showAsignados/"+_idOt+"/"+_hora+"/"+_fActual, function(data){						
	   		if(data==1){
				//$(this2).text("x");  				
  				if(_prioridad=="baja"){
  					$(this2).parent("td").addClass("color-back-baja");			
  				}
  				if(_prioridad=="media"){
  					$(this2).parent("td").addClass("color-back-media");  					
  				}
  				if(_prioridad=="alta"){
  					$(this2).parent("td").addClass("color-back-alta");  					
  				}  	
			}

			if(data==2){
				//$(this2).text("x"); 							
  				if(_prioridad=="baja"){
  					$(this2).parent("td").addClass("color-back-baja");			
  				}
  				if(_prioridad=="media"){
  					$(this2).parent("td").addClass("color-back-media");  					
  				}
  				if(_prioridad=="alta"){
  					$(this2).parent("td").addClass("color-back-alta");  					
  				}

				$(this2).addClass("color-border-rev");
				$(this2).text("R");
			}

			if(data==3){
				$(this2).addClass("color-border-rev");
				$(this2).text("R");
			}

		});
	});
}

function fn_select_time_planner(){
	$('.select-time').click(function(index){
		var datos = $(this).attr("title");
		var dim = datos.split(":");
		var hora = String(dim[0]);
		var fecha = String(dim[1]);
		if(hora.length==1){
			hora = "0"+hora;
		}
		$("#fecha-vcto").val(fecha);
		$("#hora").val(hora+":00:00");		
		close_pop_planner();
	});
}

function fn_ot_show_planner_(){
	var date = $(this).attr("rel");
	var valPriority = "TODOS";
	var valResp = "TODOS";
	var valNv = "TODOS";		
	$.get("/2showPlanner/"+date+"/current/r/"+valResp+"/"+valPriority+"/"+valNv, function(data){
		$("#ot_container-all-planner").html(data);
		fn_change_week_planner2();
		fn_show_asignados_planner2();
		fn_select_time_planner();
	});
}

function fn_change_week_planner2(){	
	$("#link-previous-week-planner").click(function(){
		var date = $(this).attr("rel");
		var valPriority = "TODOS";
		var valResp = $("#filters-resp-planner2").val();
		var valNv = "TODOS";
		$.get("/2showPlanner/"+date+"/previous/r/"+valResp+"/"+valPriority+"/"+valNv, function(data){			
			$("#ot_container-all-planner").html(data);
			fn_change_week_planner2();
			fn_show_asignados_planner2();
			fn_select_time_planner();
			fn_filter_resp_planner2();
		});
	});

	$("#link-current-week-planner").click(function(){
		var date = $(this).attr("rel");
		var valPriority = "TODOS";
		var valResp = $("#filters-resp-planner2").val();
		var valNv = "TODOS";	
		$.get("/2showPlanner/"+date+"/current/r/"+valResp+"/"+valPriority+"/"+valNv, function(data){
			$("#ot_container-all-planner").html(data);
			fn_change_week_planner2();
			fn_show_asignados_planner2();
			fn_select_time_planner();
			fn_filter_resp_planner2();	
		});
	});

	$("#link-next-week-planner").click(function(){
		var date = $(this).attr("rel");
		var valPriority = "TODOS";
		var valResp = $("#filters-resp-planner2").val();
		var valNv = "TODOS";
		$.get("/2showPlanner/"+date+"/next/r/"+valResp+"/"+valPriority+"/"+valNv, function(data){
			$("#ot_container-all-planner").html(data);
			fn_change_week_planner2();
			fn_show_asignados_planner2();
			fn_select_time_planner();
			fn_filter_resp_planner2();		
		});	
	});

}

function fn_filter_resp_planner2(){	
	$('#filters-resp-planner2').change(function() {
		var date = "";
		var valPriority = "TODOS";
		var valResp = $("#filters-resp-planner2").val();
		var valNv = "TODOS";	
		$.get("/2showPlanner/"+date+"/current/r/"+valResp+"/"+valPriority+"/"+valNv, function(data){
			$("#ot_container-all-planner").html(data);
			fn_change_week_planner2();
			fn_show_asignados_planner2();
			fn_select_time_planner();
			fn_filter_resp_planner2();
		});	
	});
}

function fn_save_guest_rev(){
	$("#btn-save-guest-rev").click(function(){		
		var name = $("#guest-name2").val();
		var email = $("#guest-email2").val();

		$("#guest-name2").css({'border-color':'#F5D0A9'});
		$("#guest-email2").css({'border-color':'#F5D0A9'});

		var error = "";
		if(name!="" && email!=""){			
			if(!fn_valid_email(email)){
				$("#guest-email2").css({'border-color':'red'});
				error = "error";
			}
		}else{
			if(name==""){
				$("#guest-name2").css({'border-color':'red'});
				error = "error";
			}
			if(email==""){
				$("#guest-email2").css({'border-color':'red'});
				error = "error";
			}			
		}

		if(error == ""){		
			$.post("/saveGuest",{name:name,email:email});
			var valor = "inv/gest_"+email;
			var cadena = "<input class='check-revision' type='checkbox' name='"+name+"' value='"+valor+"'/><span class='part-invitado'>"+name+"</span>";
			$('#box-participantes-revision').append(cadena);			
			$(".box-add-guest-rev").fadeOut();
			$("#add-guest-rev").html("+ Invitado");
			fn_click_chk_inv();
			closeLightBox('bg-pop-guest','modal-pop-guest');
		}
		
	});
	
}