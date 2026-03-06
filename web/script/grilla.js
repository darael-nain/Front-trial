// JavaScript Document

$(document).ready(function(){
	fn_valida_nros();
	$("#titulos-proyecto-rend").hide();
	$("#items-proyecto-rend").hide();
	$("#categorias-proyecto-rend").hide();
	$("#servicios-proyecto-rend").hide();
	$("#tipos-doc-tributarios").hide();
	$("#contactosAll").hide();	
	$("#usuarios-creados").hide();
	$("#box-tr-ch").hide();
	$("#ctasnroch").hide();
	$("#valorctapordefecto").hide();
	$(".mailenvio").hide();
	$("#cantidademitidosx").hide();	
	$(".enviandoxx").hide();		
	fn_search_prov();

	jQuery(function($){
		$.datepicker.regional['es'] = {
			closeText: 'Cerrar',
			prevText: '&#x3c;Ant',
			nextText: 'Sig&#x3e;',
			currentText: 'Hoy',
			monthNames: ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
			'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
			monthNamesShort: ['Ene','Feb','Mar','Abr','May','Jun',
			'Jul','Ago','Sep','Oct','Nov','Dic'],
			dayNames: ['Domingo','Lunes','Martes','Mi&eacute;rcoles','Jueves','Viernes','S&aacute;bado'],
			dayNamesShort: ['Dom','Lun','Mar','Mi&eacute;','Juv','Vie','S&aacute;b'],
			dayNamesMin: ['Do','Lu','Ma','Mi','Ju','Vi','S&aacute;'],
			weekHeader: 'Sm',
			dateFormat: 'dd/mm/yy',
			firstDay: 1,
			isRTL: false,
			showMonthAfterYear: false,
			yearSuffix: ''};
		$.datepicker.setDefaults($.datepicker.regional['es']);
	});	
	$(".datepicker").datepicker();

});

function fn_search_prov(){
	var prov = new Array(); // regular array (add an optional integer
		
	$('#contactosAll option').each(function(index){
		//alert(index);
		var valor = $(this).val();
		var texto = $(this).text();
		prov[index] = {label: texto, value: texto ,idprov:valor};			
	});
		
	$(".busqueda-prov").autocomplete({
        source: prov,
        select: function(event, ui){	  	
        	var idSelec = $(this).attr("id")
        	var elem = idSelec.split('-');
			var elem1 = elem[0];
			var elem2 = elem[1];
			var idProvKeys = "idProvKeys-"+elem2;
        	$("#"+idProvKeys).remove();
        	$(this).before("<input name='idprovedet' id="+idProvKeys+" value="+ui.item.idprov+" type='hidden'/>");        		
        }        
    });
}

function fn_cantidad(){
	cantidad = $("#grilla tbody").find("tr").length;	
	return cantidad;
}


function fn_agregar_row_sol_pagos(){
	var destino = $('#destino').val();
	var itemsSeleccionado = $('#itemNegocio').val();
	var textoItemSeleccionado = $('#itemNegocio option:selected').text();
	var idnv = $('#idnv').val();	

	if(itemsSeleccionado!="-1"){
		var mydate=new Date();
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
		var fechaActual = daym+"/"+month+"/"+year;
		
		var itemsAsociados="";
		if (destino=="VARIOS ITEMS") {
			$.ajax({ 
				type: "GET", 
				url: "/get_items_negocio/"+idnv,
				async:false,
				success: function(data){ 
					itemsAsociados = data;
				} 
			}); 

			/*$.post("/get_items_negocio",{idnv:idnv},function(data){				
				itemsAsociados = data;
			});*/
		}else{
			itemsAsociados = "<input type='hidden' name='itemsasociado' value='"+itemsSeleccionado+"'><input class='cj-itemAsoc' disabled type='text' value='"+textoItemSeleccionado+"'>";
		}

		var cadena="";
		cadena = "<tr bgcolor='#F5ECCE'>";
		cadena = cadena + "<td>S/N</td>";
		cadena = cadena + "<td>"+itemsAsociados+"</td>";
		cadena = cadena + "<td><input name='fechapago' type='text' class='datepicker' value="+fechaActual+"></td>";
		cadena = cadena + "<td><input name='monto' type='text' class='monto-pago-sol'/></td>";
		cadena = cadena + "<td><input name='observacion' class='observacion-sol' type='text'/></td>";	
		cadena = cadena + "<td><a class='elimina'>Eliminar</a></td>";
		$("#grilla-pagos tbody").append(cadena);
		fn_elimina_fila();
		fn_valida_nros();
		$(".datepicker").datepicker();

	}else{
		alert("ATENCION:\n-DEBE SELECCIONAR EL ITEMS ASOCIADO.");
	}

}
function fn_elimina_fila(){
	$("a.elimina").click(function(){
		id = $(this).parents("tr").find("td").eq(0).html();
		respuesta = confirm("Esta seguro de eliminar la Fila ?");
		if (respuesta){
			$(this).parents("tr").fadeOut("normal", function(){
				$(this).remove();				
			})
		}
	});
}

function fn_valida_nros(){
	$(".monto-pago-sol").change(function(){
		var valor = $(this).val();
		$(this).val(accounting.formatMoney(valor, "$", 0, ".", ","));
	});
}

function fn_agregar_row_pago(valor){

	if(valor!="-1"){

		$(".mailenvio").hide();
		$("#lista-ch-tr").fadeOut("slow");

		$("#box-tr-ch").fadeOut("slow",function(){
    		var valx = $("#idctacte").val();
    		var textx = $("#desctactex").val();		

			$('#ctacte').find('option:first').attr('selected', 'selected').val(valx);
			$('#ctacte').find('option:first').attr('selected', 'selected').text(textx);
 			
			if(valor=="cheque"){			
				$("#pag-tipo").val("CHEQUE");
				$("#label-fecha").text("Fecha Pago : ");
				$("#fechapag").val("");		
				$(".ch").show();
				$(".tr").hide();
				$("#nroch").val($("#nroactualch").val());
			}else{
				$("#pag-tipo").val("TRANSFERENCIA");
				$("#fechapag").val("");				
				$("#label-fecha").text("Fecha Transferencia : ");
				$(".ch").hide();
				$(".tr").show();
			}
			$("#box-tr-ch").fadeIn("slow");
		});	

		$(function() {
			$( ".datepicker" ).datepicker({dateFormat: 'dd/mm/y' , monthNames: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'], dayNamesShort: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa']});
		});		

	}else{		
		$("#box-tr-ch").fadeOut("slow",function(){
			$("#lista-ch-tr").fadeIn("slow");
		});
	}
}

function fn_verifica_name_prov(valueElement,idElement){
	var elem = idElement.split('-');
	var elem1 = elem[0];
	var elem2 = elem[1];			
	var idProvKeys = "idProvKeys-"+elem2;

	if (!$("#"+idProvKeys).length) {
  		$( "#"+idElement).val("");
	}
}

function fn_dar_eliminar2(){
	$("a.elimina").click(function(){
		id = $(this).parents("tr").find("td").eq(0).html();
		respuesta = confirm("Esta seguro de elimnar la fila ?");
		if (respuesta){
			$(this).parents("tr").fadeOut("normal", function(){
				$(this).remove();
				$("#tipo-pago").fadeIn();		
			})
		}
	});
}

function opcion_select_tit(opcionSelect,idOpcion){
	var llaveTituloAux = opcionSelect;
	var opciones = "<option value='-1' selected='selected'>[Seleccionar]</option>";
	$('#items-proyecto-rend option').each(function(index){
		var valor = $(this).val();
		var texto = $(this).text();		
		var elem = valor.split('/');
		llaveItems = elem[0];
		llaveTitulos= elem[1];
		if(llaveTitulos == llaveTituloAux){
			opciones = opciones+"<option value="+llaveItems+">"+texto+"</option>";
		}		
	});

	//var largo = idOpcion.length;
	//var nro = idOpcion.substring(largo, largo-1);

	var elem = idOpcion.split('-');
	var nro_ = elem[0];
	var nro= elem[1];

	var itemsKeys = "items-"+nro
	var serviciosKeys = "servicios-"+nro
	
	$("#"+serviciosKeys).hide();
	$("#"+itemsKeys).fadeOut('fast',function(){
		$("#"+itemsKeys+" option").remove();		
	});
	$("#"+itemsKeys).fadeIn('fast',function(){
		$("#"+itemsKeys).append(opciones);	
	});	
}

function opcion_select_categ(opcionSelect,idOpcion){
	var llaveCategoriaAux = opcionSelect;
	var opciones = "<option value='-1' selected='selected'>[Seleccionar]</option>";
	$('#servicios-proyecto-rend option').each(function(index){
		var valor = $(this).val();
		var texto = $(this).text();		
		var elem = valor.split('/');
		llaveServicios = elem[0];
		llaveCategoria = elem[1];
		if(llaveCategoria == llaveCategoriaAux){
			opciones = opciones+"<option value="+llaveServicios+">"+texto+"</option>";
		}
	});
	
	//var largo = idOpcion.length;
	//var nro = idOpcion.substring(largo, largo-1);

	var elem = idOpcion.split('-');
	var nro_ = elem[0];
	var nro= elem[1];

	var itemsKeys = "items-"+nro
	var serviciosKeys = "servicios-"+nro

	$("#"+itemsKeys).hide();
	$("#"+serviciosKeys).fadeOut('fast',function(){
		$("#"+serviciosKeys+" option").remove();		
	});
	$("#"+serviciosKeys).fadeIn('fast',function(){
		$("#"+serviciosKeys).append(opciones);		
	});	
	
}

function fn_get_values_items(){
	var opciones = opciones+"<option>[Seleccionar]</option>";
	$('#items-proyecto-rend option').each(function(index){
		var valor = $(this).val();
		var texto = $(this).text();
		opciones = opciones+"<option value="+valor+">"+texto+"</option>"
	});

	/*var ElementSelect2 =  "";
	ElementSelect2 = ElementSelect2+"<select id='titulos-proyecto' onChange='opcion_select_items(this.value)'>";
	ElementSelect2 = ElementSelect2+opciones;	
	ElementSelect2 = ElementSelect2+"</select>";*/
	return opciones;
}

function fn_get_values_servicios(){
	var opciones = opciones+"<option>[Seleccionar]</option>";
	$('#servicios-proyecto-rend option').each(function(index){
		var valor = $(this).val();
		var texto = $(this).text();
		opciones = opciones+"<option value="+valor+">"+texto+"</option>"
	});
	
	/*var ElementSelect2 =  "";
	ElementSelect2 = ElementSelect2+"<select id='titulos-proyecto' onChange='opcion_select_items(this.value)'>";
	ElementSelect2 = ElementSelect2+opciones;	
	ElementSelect2 = ElementSelect2+"</select>";*/
	return opciones;
}



function fn_ultimo_nro_ch(valor){
	var valorSeleccionado = "";
	$('#ctasnroch option').each(function(index){
		if($(this).val()==valor){
			valorSeleccionado = parseInt($(this).text()) + 1;
		}		
	});

	if($("#pag-tipo").val()=="CHEQUE"){			
		$("#nroch").val(valorSeleccionado);
	}else{
		$("#nrotr").val("");
	}

}

function fn_confirmar_email(){	
	if($("#notificacionpago").is(':checked')){				
		$(".mailenvio").fadeIn("slow");
	}else{
		$(".mailenvio").fadeOut("slow");
	}	
}

function fn_acciones_pago(opcion,idpago){	
	if(confirm("ESTA SEGURO DE "+opcion.toUpperCase()+" EL PAGO?")){

		if (opcion == "anular") {
			var motivo = prompt("INGRESE EL MOTIVO DE LA ANULACION :");
		}else{
			var motivo = "xxxxxxx";
		}
		
		if (motivo!=null && motivo!=""){
			openModal();			
			$("#idpago").val(idpago);
			$("#opcionaccion").val(opcion);
			$("#motivoanulacion").val(motivo);
			$("#accionespago").submit();			
		}else{
			alert("ATENCION : \n\n - DEBE INGRESAR EL MOTIVO DE LA ANULACION.");
		}		
	}	
}















