$(document).ready(function(){

	fn_delete_dtc_rendicion();

	fn_filter_for_proyect();	

	controlEvent();



	$('#cierre-produccion').click(function(){

		if (confirm("ESTÁ SEGURO(A) SE REALIZAR EL CIERRE?")) {

			var idRend = $('#id_rendicion').val();	
			 	

			var comentario = prompt("Ingresar un comentario al cierre (opcional)","");

			$.post("/cierre_web_produccion_fxr",{idRend:idRend,comentario:comentario},

   			function(data){

   				if(data!=0){

   					alert("LA RENDICIÓN FUE CERRADA POR PRODUCCIÓN CORRECTAMENTE.");								

					location.href="/4DACTION/W_EDITAR_RENDICION/"+idRend;			

				}else{  				

					alert("NO DE PUDO CERRAR LA RENDICIÓN.");

				}

   			});			

		}

	});	



	$('#destino').change(function(){

		var cant = $('#grilla-pagos tbody tr').length;

		if (cant>0) {



			var itemsSeleccionado = $('#itemNegocio').val();

			var textoItemSeleccionado = $('#itemNegocio option:selected').text();

			var idnv = $('#idnv').val();

			var itemsAsociados = "";



			if($(this).val()=="VARIOS ITEMS") {

				$.ajax({ 

					type: "GET", 

					url: "/get_items_negocio/"+idnv,

					async:false,

					success: function(data){ 

						itemsAsociados = data;

					} 

				});

				$('#grilla-pagos tbody tr').each(function(index){				

					$(this).find("td").eq(1).html(itemsAsociados);

				});				

			}else{

				itemsAsociados = "<input type='hidden' name='itemsasociado' value='"+itemsSeleccionado+"'><input class='cj-itemAsoc' disabled type='text' value='"+textoItemSeleccionado+"'>";

				$('#grilla-pagos tbody tr').each(function(index){				

					$(this).find("td").eq(1).html(itemsAsociados);

				});

			}			

		}

	});



	$('#itemNegocio').change(function(){

		var cant = $('#grilla-pagos tbody tr').length;

		if (cant>0) {

			if($('#destino').val()!="VARIOS ITEMS") {

				var itemsSeleccionado = $('#itemNegocio').val();

				var textoItemSeleccionado = $('#itemNegocio option:selected').text();			

				var itemsAsociados = "";

				itemsAsociados = "<input type='hidden' name='itemsasociado' value='"+itemsSeleccionado+"'><input class='cj-itemAsoc' disabled type='text' value='"+textoItemSeleccionado+"'>";

				$('#grilla-pagos tbody tr').each(function(index){				

					$(this).find("td").eq(1).html(itemsAsociados);

				});	

			}							

		}

	});



});



function valida_creacion_fxr(){	

	var crear = 0;	

	$.ajax({ 

		type: "GET",

		url: "/validaCreacionFxr",

		async:false,

		success: function(data){

			crear = data;			

		} 

	});

	if(crear==1){

		alert("ATENCIÓN:\n\n UD. CUENTA CON FxR QUE AÚN FALTAN  CERRAR POR ADMINISTRACIÓN.");

		return false;

	}

	return true;

}



function controlEvent(){

	$('.auto-prov').bind({

		mouseleave: function() {

			$(this).html("");

		}

	});

	

	$('.aers').bind({

		click: function() {

			getProveedor(this);

		},

		keyup: function() {

			getProveedor(this);

		},

		mouseover: function() {

			getProveedor(this);

		},

		mouseenter: function() {

			getProveedor(this);

		}

	});

	

}



function fn_delete_dtc_rendicion(){	

	$('.delete-dtc-rend').click(function() {
		var idDTC = $(this).attr("rel");
		var idRendicion = $("#id_rendicion").val();		
  		if(confirm("Estas seguro(a) de ELIMINAR el DTC?")){ 
  			$.ajax({
				url: '/4DACTION/v2_dtc_fxr_delete',
				dataType: 'json',
				type: 'POST',
				data: {
       				idDTC:idDTC,
       				idRendicion:idRendicion
       			}
			}).done(function(data) {
				 if(data!=0){   					 								
					location.href="/4DACTION/W_EDITAR_RENDICION/"+idRendicion;			
				}else{  				
					alert("NO DE PUDO ELIMINAR EL DTC.");
				}  
			});

       		/*$.post("/deleteDtcRen",{
       			idDTC:idDTC,
       			idRendicion:idRendicion
       		},
   			function(data){
   				if(data!=0){   					 								
					location.href="/4DACTION/W_EDITAR_RENDICION/"+idRendicion;			
				}else{  				

					alert("NO DE PUDO ELIMINAR EL DTC.");

				}   				

   			});  */
    	}

	});

}



function fn_filter_for_proyect(){	

	$('#filter-proyecto-rend').change(function() {

		var idNv= $(this).val();

		if(idNv!="-1"){		

			location.href="/4DACTION/W_LISTA_SOL/pr/"+idNv;	

		}

	});

}



function fn_agregar_row(){	
	var tipoItemsrend = $("#tipoItemsRend").val();
	cadena = "<tr bgcolor='#F5ECCE'>";	
	var elementSelect1 =  "";
	cadena = cadena + "<td>ITEMS<input name='dtc' value='items' type='hidden'/></td>";
	if(tipoItemsrend=="VARIOS ITEMS"){
		cadena = cadena + "<td>"+get_titulos_rf()+"</td>";
		cadena = cadena + "<td><select name='dtc'><option  value='-1' selected='selected'></option></select></td>";
	}
	if(tipoItemsrend=="GASTO DIRECTO ITEM"){		
		cadena = cadena + "<td>"+$("#nombre-titulo-i").val()+"<input name='dtc' value="+$("#llave-titulo-i").val()+" type='hidden'/></td>";
		cadena = cadena + "<td>"+$("#nombre-items-i").val()+"<input name='dtc' value="+$("#llave-items-i").val()+" type='hidden'/></td>";
	}
	cadena = cadena + "<td><input name='dtc' type='text' class='cj-det-fxr-dtc'/></td>";
	cadena = cadena + "<td>"+get_tipos_doc_rf()+"</td>";
	cadena = cadena + "<td><input name='dtc' type='text' class='datepicker cj-det-fxr-dtc'/></td>";	
	cadena = cadena + "<td><div class='auto-prov'></div><input name='0' class='cj-det-fxr-dtc2 aers' type='text' placeholder='buscar...' /><button  class='popNewProv' type='button'>+</button></td>";
	cadena = cadena + "<td><input name='dtc' type='text' class='cj-det-fxr-dtc'/></td>";
	cadena = cadena + "<td></td>";
	cadena = cadena + "<td><input name='dtc' placeholder='$' type='text' class='cj-det-fxr-dtc validadtc'/></td>";
	cadena = cadena + "<td></td>";
	cadena = cadena + "<td><a class='elimina'>Eliminar</a></td>";  
	$("#grilla tbody").append(cadena);
	controlEvent();
	fn_dar_eliminar();
	get_verifica_existe_dtc();
	popNewProv();
	validaneto();
	$(function() {
		$( ".datepicker" ).datepicker({dateFormat: 'dd/mm/y' , monthNames: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'], dayNamesShort: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa']});
	});

}



function validaneto(){
	$(".validaneto").change(function(){
		var value = $(this).val();
		if(isNaN(value)){
			$(this).val(0);
		}
	});	
}



function popNewProv(){	

	$(".popNewProv").click(function(){

		//var targetRow = $(this).parents("tr");

		//var idNomPorv = $(targetRow).children("td:eq(4)").children("input").attr("id");		

		$.get("/getRFFrm/add_prov.html", function(data){
			$("#modal-pop-add-prov").html(data);
		});

		openLightBox("bg-pop-add-prov","modal-pop-add-prov","330","220");

	});

}



function checkValidarRut(){

	var tagRut = $("#new-proveedor-rf input:eq(1)");

	var tagDig = $("#new-proveedor-rf input:eq(2)");

	var chkValida = $("#new-proveedor-rf input:eq(3)");

	var tagValidado = $("#new-proveedor-rf input:eq(6)");

	$(chkValida).click(function(){

		if(chkValida.is(':checked')){

			$(tagValidado).val("SI");

		}else{

			$(tagValidado).val("NO");

		}

		tagDig.val("");

		if(tagRut.val()==""){

			tagRut.focus();

		}else{

			tagDig.focus();

		}

	});

}



function validaDgFR(){

	var tagRut = $("#new-proveedor-rf input:eq(1)");

	var tagDig = $("#new-proveedor-rf input:eq(2)");

	var chkValida = $("#new-proveedor-rf input:eq(3)");

	

	if(chkValida.is(':checked')){

		if(!validaRut(tagRut.val()+"-"+tagDig.val())){

			alert("EL RUT INGRESADO NO ES VALIDO.");

			tagDig.val("").focus();		

		}else{

			var rutx = tagRut.val()+tagDig.val();

			$.get("/verificaRutExisteIntra/"+rutx, function(data){

				if(data==0){

					alert("EL RUT INGRESADO YA SE ENCUENTRA REGISTRADO.");

					tagDig.val("").focus();		

				}

			});

		}

	}else{

		var rutx = tagRut.val()+tagDig.val();

		$.get("/sinCheckVerificaRutExisteIntra/"+rutx, function(data){

			if(data==0){

				alert("EL RUT INGRESADO YA SE ENCUENTRA REGISTRADO Y VALIDADO.");

				tagDig.val("").focus();		

			}

		});

	}

}



function saveProveedor(target){	

	var tagAlias = $('#new-proveedor-rf input[name="alias"]');
	var tagRut =  $('#new-proveedor-rf input[name="rut"]');
	var tagDv =  $('#new-proveedor-rf input[name="dv"]');
	var chkValida = $('#new-proveedor-rf input[name="validacion"]');
	var tagRazon =$('#new-proveedor-rf input[name="razon"]');
	var tagGiro =  $('#new-proveedor-rf input[name="giro"]');
	var msgAlert ="";

	if(tagAlias==""){
		msgAlert=msgAlert+"\n- DEBE INGRESAR UNA ALIAS.";
	}
	if(chkValida.is(':checked')){

		if(tagRut.val()=="" | tagDv.val()==""){

			msgAlert=msgAlert+"\n- DEBE INGRESAR UN RUT.";

		}

	}
	

	if(tagRazon.val()==""){

		msgAlert=msgAlert+"\n- DEBE INGRESAR UNA RAZON SOCIAL.";

	}

	

	if(tagGiro.val()==""){

		msgAlert=msgAlert+"\n- DEBE INGRESAR UN GIRO.";

	}

	

	if(msgAlert==""){	

		setTimeout(function(){

			$.ajax({
				url: '/4DACTION/v2_setNewContactoRF',
				dataType: 'json',
				type: 'POST',
				data: $("#new-proveedor-rf").serialize()
			}).done(function(data) {
				 // closeLightBox("bg-pop-add-prov","modal-pop-add-prov'");
			});

			// $.post("/setNewContactoRF", $("#new-proveedor-rf").serialize(), function(data) {
				/*	var arrays = data.split("/");
					var id = arrays[0];
					var nombre = arrays[1];*/

					/*var idcj = arrays[2];
					$('#'+idcj).val(nombre);
					$('#'+idcj).attr('name',id);*/
			   // }
		   // );

		   closeLightBox("bg-pop-add-prov","modal-pop-add-prov'");

	   },1500);				

	}else{

		alert("ATENCION :"+ msgAlert);	

	}

	

}



function provSelect(target){	

	var idProv = $(target).attr("id");	

    var nomProv = $(target).text();

	var targetRow = $(target).parents("tr");

	$(targetRow).children("td:eq(6)").children("input").val(nomProv);

	$(targetRow).children("td:eq(6)").children("input").attr('name',idProv);

	$('.auto-prov').html("");

}



function getProveedor(target){	

	var value1 = $(target).val();   

	var targetRow = $(target).parents("tr");

	$.ajax({ 

		type: "GET",

		url: "/getProveedoresRf/"+value1,

		async:false,

		success: function(data){

			$(targetRow).children("td:eq(6)").children(".auto-prov").html(data);			

		} 

	});

	

	var pos = $(target).position();	

	var top = pos.top + 16;

	$(targetRow).children("td:eq(6)").children(".auto-prov").css("top",top);

}



function opcion_select_tipo(target){

	var value = $(target).val();

	var targetRow = $(target).parents("tr");

	if(value=='items'){

		$(targetRow).children("td").eq(1).html(get_titulos_rf());

	}else{

		$(targetRow).children("td").eq(1).html(get_categorias_rf());

	}	

	$(targetRow).children("td").eq(2).html("<select></select>");	

}



function fn_dar_eliminar(){

	$("a.elimina").click(function(){

		id = $(this).parents("tr").find("td").eq(0).html();	

		$(this).parents("tr").fadeOut("normal", function(){

			$(this).remove();				

		});

	});

}



function get_titulos_rf(){

	var idRend = $('#id_rendicion').val();

	$.ajax({ 

		type: "GET", 

		url: "/getRFTitulosNv/"+idRend,

		async:false,

		success: function(data){ 

			value = data;

		} 

	}); 	

	return value;

}



function get_items_titulos_rf(llaveTitulo,thisParents){

	var idRend = $('#id_rendicion').val();

	$.ajax({ 

		type: "GET", 

		url: "/getRFItemsTitulosNv/"+idRend+"/"+llaveTitulo,

		async:false,

		success: function(data){ 

			value = data;

		} 

	});

	

	//to add data to row 3

	if(llaveTitulo!="-1"){

		$(thisParents).children("td").eq(2).html(value);			

	}else{

		$(thisParents).children("td").eq(2).html("<select></select>");			

	}	

}



function get_categorias_rf(){

	$.ajax({ 

		type: "GET", 

		url: "/getRFCategorias/",

		async:false,

		success: function(data){ 

			value = data;

		} 

	}); 	

	return value;

}



function get_servicios_rf(target){

	var idCategoria = $(target).val();

	$.ajax({ 

		type: "GET", 

		url: "/getRFServicios/"+idCategoria,

		async:false,

		success: function(data){ 

			value = data;

		} 

	}); 

	

	//to add data to row 3

	var targetRow = $(target).parents("tr");

	$(targetRow).children("td").eq(2).html(value);		

}



function get_tipos_doc_rf(){

	$.ajax({ 

		type: "GET", 

		url: "/getRFTiposDoc/",

		async:false,

		success: function(data){ 

			value = data;

		} 

	}); 	

	return value;

}



function get_verific_check_fxr_dtc(){

	$.ajax({ 

		type: "GET", 

		url: "/getRFCheckOptions/",

		async:false,

		success: function(data){

			if(data==0){				

				value = false;

			}else{			

				value = true;

			}

		}

	});

	return value;

}



function get_verifica_existe_dtc(){	

	$('.validadtc').change(function(event) {

		var msg ="";
		var targetRow = $(this).parents("tr");
		var idproveedor = $(targetRow).children("td:eq(6)").children("input").attr("name");
		var tipoDoc = $(targetRow).children("td:eq(4)").children("select").val();
		var folio = $(targetRow).children("td:eq(3)").children("input").val();
		var input = folio.toUpperCase();
		var output = '';
		var valid_text = '';
		var is_zero = false;
		var start_content = false;
		var ascii_prev = 48;
		var length_parsed = 0;
		for(var i = 0; i < input.length; i++) {
			var valid_text = valid_text + input.charAt(i);
			var ascii = input.charCodeAt(i);
			if (((ascii >= 48 && ascii <= 57) || (ascii >= 65 && ascii <=90)) && i < 255) {
				length_parsed = valid_text.length;
				if (length_parsed > 0 && !start_content) {
					ascii_prev = valid_text.charCodeAt(length_parsed - 1);
					if (ascii_prev != 48) start_content = true;
				}
				if (ascii == 48) is_zero = true;
				var leading_zero = (is_zero && !start_content);
				if(!leading_zero)
					output = output + String.fromCharCode(ascii);
			}
		}
		$(targetRow).children("td:eq(3)").children("input").val(output);
		folio = output;

		if(idproveedor == 0){
			msg = msg +"- DEBE SELECCIONAR PROVEEDOR.\n";
		}
		if(tipoDoc == "-1"){
			msg = msg +"- DEBE SELECCIONAR TIPO DOC.\n";
		}

		if(msg==""){

			$.ajax({ 

				type: "GET", 

				url: "/getValidaDTCFR/"+idproveedor+"/"+tipoDoc+"/"+folio,

				async:false,

				success: function(data){

					if(data!=0){				

						alert("ATENCION:\n - DOCUMENTO YA SE ENCUENTRA REGISTRADO.");

						$(targetRow).children("td:eq(3)").children("input").val("").focus();

					}

				}

			});

		}else{

			alert("ATENCION:\n"+msg);

		}			

	});

}



