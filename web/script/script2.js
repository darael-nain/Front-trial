$(document).ready(function(){

	//calculo neg
	$('.calculo').keyup(function(){

		//Getter
		var ObjPadre = $(this).parents('.items');
		var llaveItems = $(ObjPadre).attr('id');
		var cantidad = $(ObjPadre).find(".cantidad").val();	
		var dias = $(ObjPadre).find(".dias").val();
		var pu = parseFloat($(ObjPadre).find(".pu").val());

		//Calculos por fila
		var preSubTotal = cantidad*pu;
		var subTotal = preSubTotal;
		if (dias>0) {
			var subTotal = preSubTotal*dias;
		}

		//Setter		
		$(ObjPadre).find(".subtotal").text(subTotal);

		//Calcula totales sin comision
		var subTotalNeto = 0;
		$('.subtotal').each(function(index){
			var monto = Math.floor($(this).text());
			if(monto!=0){
				subTotalNeto = subTotalNeto + monto;
			}
		});

		var subTotalGp = 0;
		$('.gp').each(function(index){
			var monto = Math.floor($(this).text());
			if(monto!=0){
				subTotalGp = subTotalGp + monto;
			}
		});
		
		var subTotalUtilidad = 0;
		$('.utilidad').each(function(index){
			var monto = Math.floor($(this).text());
			if(monto!=0){
				subTotalUtilidad = subTotalUtilidad + monto;
			}
		});


		$('#presub').val(insertFormatMoney(subTotalNeto));
		$('#gastop').val(insertFormatMoney(subTotalGp));
		$('#utilidadp').val(insertFormatMoney(subTotalUtilidad));
		$('#precom').val(insertFormatMoney(subTotalNeto));	
		
		//comisiones
		calculaComision1();
		calculaComision2();
		calculaComision3();
		
		//montos finales
		var valor_descuento = parseFloat($("#descuentos").val());
		var monto_subtotal_com3 = parseFloat(clearFormatMoney($("#sumatotal3").val()));	
		var monto_descuento = Math.round((monto_subtotal_com3*valor_descuento)/100);
		var monto_subtotal_neto = monto_subtotal_com3-monto_descuento;
			
		$("#totaldescuento").val(insertFormatMoney(monto_descuento));
		$("#subtotalfinal").val(insertFormatMoney(monto_subtotal_neto));

		var iva = parseFloat(monto_subtotal_neto * 0.19);
		var total_total = parseFloat(monto_subtotal_neto) + iva;
		
		$('#ivafinal').val(insertFormatMoney(Math.floor(iva)));
		$('#totalfinal').val(insertFormatMoney(Math.floor(total_total)));

	});

	$('.calculogp').keyup(function(){
		//Getter
		var ObjPadre = $(this).parents('.items');		
		var llaveItems = $(ObjPadre).attr('id');
		var subtotal = $(ObjPadre).find(".subtotal").text();	
		var gp = parseFloat($(ObjPadre).find(".gp").val());

		//Calculos por fila utilidad P
		var utilidadp = subtotal-gp;	

		//Setter		
		$(ObjPadre).find(".utilidad").text(utilidadp);		

	});


	//============================
	
	$('#bn-buscar').click(function() {
	  		if($('#txtBuscar').val()!=""){
				$('#frm-buscar').submit();
			}else{
				$(".contenedor-actualizado2 .msg span").addClass("incorrecto");
		 		$(".contenedor-actualizado2 .msg span").html("Debe ingresar valor a buscar.");
		 		$(".contenedor-actualizado2").fadeIn("slow");
				cerrarMsg2();
		  		return false;
			}
	});
	
	$('#buttonbuscar').click(function() {
	  		if($('#txtbuscar').val()!=""){
				$('#frmbuscadores').submit();
			}else{
				$(".contenedor-actualizado2 .msg span").addClass("incorrecto");
		 		$(".contenedor-actualizado2 .msg span").html("Debe ingresar valor a buscar.");
		 		$(".contenedor-actualizado2").fadeIn("slow");
				cerrarMsg2();
		  		return false;
			}	  
	});
	
	$('#bn-login').click(function() {
	  		if($('#txtUsuario').val()!="" && $('#txtPassword').val()!=""){
				$('#frm_login').submit();
			}else{
				$(".contenedor-actualizado2 .msg span").addClass("incorrecto");
		 		$(".contenedor-actualizado2 .msg span").html("Debes completar todos los campos.");
		 		$(".contenedor-actualizado2").fadeIn("slow");
				cerrarMsg2();
		  		return false;
			}	  
	});	
	
	cerrarMsg();	
	$(".contenedor-actualizado2").hide();
	$(".detalle-cadena-items").hide();
	$(".chk-t").hide();
	$(".motivos-anulacion").hide();
	$(".gastos-items-neg").hide();
	$(".muestra-box-aviso").hide();

	color_comision();

	fn_validaFromDg();
	fn_ckeck_validar_rut();
	agrega_items_oc_new();
	delete_rows_det_oc();
	calculate_amounts_row_det_oc();
	/*calculate_amounts_totales_det_oc();*/

	$('#valida-buscar-pago').click(function() {
		if($('#txtbuscar').val()!=""){
			if ($('#opcionbuscarneg').val()=="TODOS") {
				alert("ATENCIÓN:\n -DEBE SELECCIONAR OPCION DE BUSQUEDA");
				return false;	
			}else{				
				$('#tipo_busqueda_pago').val("TEXTO");
				$('#frmbuscadores').submit();
			}
		}else{			
			alert("ATENCIÓN:\n -DEBE INGRESAR UN VALOR A BUSCAR");	
			return false;
		}	  
	});
	
}); 
//======================
function color_comision(){
	if($("#type-comision1").val()=="SI"){
		$(".label-comision1").css({'color': '#F00'});		
		$("#valorcomision1").addClass("rojo-chico");
		$("#montocomision1").addClass("rojo-grande");
		$("#sumatotal1").addClass("rojo-grande");
		
	}else{
		$(".label-comision1").css({'color': '#093'});
		$("#valorcomision1").addClass("verde-chico");
		$("#montocomision1").addClass("verde-grande");
		$("#sumatotal1").addClass("verde-grande");
	}
	
	if($("#type-comision2").val()=="SI"){
		$(".label-comision2").css({'color': '#F00'});		
		$("#valorcomision2").addClass("rojo-chico");
		$("#montocomision2").addClass("rojo-grande");
		$("#sumatotal2").addClass("rojo-grande");
		
	}else{
		$(".label-comision2").css({'color': '#093'});
		$("#valorcomision2").addClass("verde-chico");
		$("#montocomision2").addClass("verde-grande");
		$("#sumatotal2").addClass("verde-grande");
	}
	
	if($("#type-comision3").val()=="SI"){
		$(".label-comision3").css({'color': '#F00'});		
		$("#valorcomision3").addClass("rojo-chico");
		$("#montocomision3").addClass("rojo-grande");
		$("#sumatotal3").addClass("rojo-grande");
		
	}else{
		$(".label-comision3").css({'color': '#093'});
		$("#valorcomision3").addClass("verde-chico");
		$("#montocomision3").addClass("verde-grande");
		$("#sumatotal3").addClass("verde-grande");
	}	
			
	$("#chk-cerrado1").attr('checked', true);	
	$("#chk-cerrado2").attr('checked', true);	
	$("#chk-cerrado3").attr('checked', true);	
	if($("#chk-cerrado1").val()==""){$("#chk-cerrado1").attr('checked', false);}
	if($("#chk-cerrado2").val()==""){$("#chk-cerrado2").attr('checked', false);}
	if($("#chk-cerrado3").val()==""){$("#chk-cerrado3").attr('checked', false);}		
}
//=================================================
function popUp(URL,winName,features) {
	window.open(URL,winName,features);
}
//=================================================
function cerrar_ventana() {
	window.close();
}
//=================================================
function soloNumeros(valor){
	return valor.replace(/[^\d]/g, '');
}

function fn_valida_numero(id,valor)
{
	if(soloNumeros(valor)=="")
	{
		$("#"+id).val("");
		$("#"+id).blur();
	}
		
}
//=================================================
function actualiza_montos(id,valor_aux,llavetitulo){	
	
	/*creamos los identificadores*/
	var largo = id.length;
	var llave = id.substring(0, largo-3);
	var id_cantidad =llave+"_C2";
	var id_precio =llave+"_C3";
	var id_subtotal =llave+"_C4";
	var id_gasto =llave+"_C5";
	var id_utilidad =llave+"_C6";
	var id_margen =llave+"_C7";
	var id_com = llave+"_C8";

	/*recuperamos valores actuales*/
	var msg = "";
	var cantidad = soloNumeros($('#'+id_cantidad).val());
	var precio = soloNumeros($('#'+id_precio).val());
	
	if(!cantidad>0){
		msg = "ccccc";
	}
	if(!precio>0){
		msg = "ccccc";
	}
	var multi = cantidad*precio;
		
if(msg==""){
	
	/*calcula y retorna valores nuevos*/
	
	$('#'+id_subtotal).val(multi);
	cantidad_detalle_titulo = $('#'+id_precio).val();
	
	array_elementos = llavetitulo+"[]";
	var elementos_input = document.frmeditarnegocio.elements[array_elementos];
	if(elementos_input.length>0){
		var suma_subtotales = 0;
		var suma_subtotales_com = 0;
		for(i=0;i<elementos_input.length;i++){
			suma_subtotales += parseFloat(elementos_input[i].value);
			var id_aux =elementos_input[i].id;
			var id_aux7 = "#"+id_aux.substr(0,id_aux.length-2)+"C8";
			if($(id_aux7).is(':checked')){				
				suma_subtotales_com+= parseFloat(elementos_input[i].value);					
			}			
		}
	}else{
		suma_subtotales = parseFloat(elementos_input.value);
		//alert(suma_subtotales);
		var id_aux = elementos_input.id;
			var id_aux7 = "#"+id_aux.substr(0,id_aux.length-2)+"C8";
			if($(id_aux7).is(':checked')){				
				suma_subtotales_com = parseFloat(elementos_input.value);					
			}		
	}
	
	$('#'+id_cantidad).val(cantidad);
	$('#'+id_precio).val(precio)
		
	var idTituloTotal = llavetitulo+"_C4";
	$('#'+idTituloTotal) .val(suma_subtotales) ;
	$('#precom') .val(insertFormatMoney(suma_subtotales_com)) ;
	calculaTotales();
	calculaTotalesFinales();
}
}
//=================================================
function actualizaSubComision(id,llavetitulo)
{		
	array_elementos = llavetitulo+"[]";
	var elementos_input = document.frmeditarnegocio.elements[array_elementos];
	if(elementos_input.length>0){
		var suma_subtotales = 0;
		var suma_subtotales_com = 0;
		for(i=0;i<elementos_input.length;i++){		
			var id_aux =elementos_input[i].id;
			var id_aux7 = "#"+id_aux.substr(0,id_aux.length-2)+"C8";
			if($(id_aux7).is(':checked')){				
				suma_subtotales_com+= parseFloat(elementos_input[i].value);					
			}			
		}
	}else{		
			var id_aux =elementos_input[i].id;
			var id_aux7 = "#"+id_aux.substr(0,id_aux.length-2)+"C8";
			if($(id_aux7).is(':checked')){				
				suma_subtotales_com+= parseFloat(elementos_input[i].value);					
			}		
	}

	if($('#'+id).is(':checked')){				
			$('#'+id).val("afecto");			
	}else{
			$('#'+id).val("noafecto");
	}
		
	$('#precom').val(insertFormatMoney(suma_subtotales_com)) ;
	 calculaTotalesFinales();
}
//=================================================
function cerrarMsg() {	
	setTimeout("msgActualizado()", 3000);
}
//=================================================
function msgActualizado() {
	$(".contenedor-actualizado").fadeOut('slow');
	return false;	
}
//=================================================
function cerrarMsg2() {	
	setTimeout("msgActualizado2()", 3000);	
}
//=================================================
function msgActualizado2() {
	$(".contenedor-actualizado2").fadeOut('slow');
	return false;	
}
//=================================================
function crear_oc(idproveedor,tipo){
	if($("#comboNegocios").val()=="-1"){
		alert("ATENCION:\n"+"- DEBE SELECCIONAR UN PROYECTO.");		
	}else{
		$("#idproveedor").val(idproveedor);
		$("#tipocrea").val(tipo);		
		$("#frm-crear-oc").submit();
	}
}

//=================================================

function agrega_items_oc_new(){
	$('#itemNegocio').change(function(){
		var arrayValues = $(this).val().split(":");
		var idNv =  arrayValues[0];
		var llaveItems = arrayValues[1];
		var countLlave = $('#items-oc-det #'+llaveItems).length;		
		if(countLlave==0 && typeof llaveItems != "undefined"){
			$.get("/getDataItemNv/"+idNv+"/"+llaveItems, function(data){			
				var arrayValues2 = data.split(":");
				var des =  arrayValues2[0];
				var pres = arrayValues2[1];
				var real = arrayValues2[2];
				var dif =  arrayValues2[3];
				$('#gastosP-items-neg').html(insertFormatMoney(Math.floor(pres)));
				$('#gastosR-items-neg').html(insertFormatMoney(Math.floor(real)));
				$('#diferencia-gastos').html(insertFormatMoney(Math.floor(dif)));
				$(".gastos-items-neg").fadeIn();
				var cantRows = $('#items-oc-det tbody tr').length+1;
				var rows = "";

				var cantId = "c-det-"+llaveItems;
				var precioId = "p-det-"+llaveItems;
				var subtotalId = "s-det-"+llaveItems;

				if(Math.floor(dif)<0){
					var precioUnit = 0;
				}else{
					var precioUnit = Math.floor(dif);
				}				

				rows = rows + "<tr id='"+llaveItems+"' style='background:#F2F5A9'>";
				rows = rows + "<td align='center'><input name='"+llaveItems+"' readonly class='nro-items-det-oc items123' type='text' value='"+cantRows+"'></td>";
				rows = rows + "<td id='row'><input name='"+llaveItems+"' class='des-det-oc items123' type='text' value='"+des+"'></td>";
				rows = rows + "<td align='right'><input name='"+llaveItems+"' id='"+cantId+"' class='monto-det-oc cant-det-oc cjcalculate items123' type='text' value='1'></td>";
				rows = rows + "<td align='right'><input name='"+llaveItems+"' id='"+precioId+"' class='monto-det-oc price-det-oc cjcalculate items123' type='text' value='"+precioUnit+"'></td>";
				rows = rows + "<td align='right'><input name='"+llaveItems+"' id='"+subtotalId+"' readonly class='stotal-det-oc cjcalculate items123' type='text' value='"+precioUnit+"'></td>";
				rows = rows + "<td align='center'><button name='"+llaveItems+"' type='button' class='delete-row-det-oc'>Quitar</button></td>";
				rows = rows + "</tr>";
				$('#items-oc-det tbody').append(rows);
				calculate_amounts_row_det_oc();
				calculate_amounts_totales_det_oc();
				delete_rows_det_oc();				

				contadorFilasDetalleOC();

			});
		}
	});
}

function contadorFilasDetalleOC(){
		var cantFilas = $('#items-oc-det tbody tr').length;
		if(cantFilas==0){
			$('.tipo-creacion-oc').html("");
		}
		if(cantFilas==1){			
			var textoItemSeleccionado = $('#itemNegocio option:selected').text();
			var texto = "<span>SE CREARÁ UNA OC. DE ITEM DIRECTO, ASOCIADO A:</span> <span style='color:blue'>"+textoItemSeleccionado+"</span>";
			$('.tipo-creacion-oc').html(texto);
		}
		if(cantFilas>1){
			var texto = "<span>SE CREARÁ UNA OC. DE ITEMS AGRUPADOS.</span>"
			$('.tipo-creacion-oc').html(texto);
		}		
}

function calculate_amounts_totales_det_oc(){	
	var sumaNeto = 0;
	$('.stotal-det-oc').each(function(index){
		var montoSub = Math.floor($(this).val());
		if(montoSub!=0){
			sumaNeto = sumaNeto + montoSub;
		}		
	});

	var iva = 19;
	var imp_boleta = 10;
	var factor_iva = parseFloat(iva/100);
	var factor_imp = parseFloat(imp_boleta/100);
	var tipooc_seleccionado = $("#tipodocto").val();
	$("#tipocnuevo").val(tipooc_seleccionado);
	
	switch(tipooc_seleccionado){
				case "65":						
						var valor_imp = parseFloat(sumaNeto*factor_imp);
						var total_oc = parseFloat(sumaNeto-valor_imp);
						$("#impuesto-etiqueta").html("RET.  10%&nbsp;");
						$('#subtotal_oc_new').val(insertFormatMoney(Math.floor(sumaNeto)));
						$('#neto_oc_new').val(insertFormatMoney(Math.floor(sumaNeto)));
						$('#impuesto_oc_new').val(insertFormatMoney(Math.floor(valor_imp)));
						$('#total_oc_new').val(insertFormatMoney(Math.round(total_oc)));				
						break;

				case "66":						
						var valor_imp = parseFloat(sumaNeto*factor_imp);
						var total_oc = parseFloat(sumaNeto-valor_imp);
						$("#impuesto-etiqueta").html("RET.  10%&nbsp;");
						$('#subtotal_oc_new').val(insertFormatMoney(Math.floor(sumaNeto)));
						$('#neto_oc_new').val(insertFormatMoney(Math.floor(sumaNeto)));
						$('#impuesto_oc_new').val(insertFormatMoney(Math.floor(valor_imp)));
						$('#total_oc_new').val(insertFormatMoney(Math.round(total_oc)));	
						break;
				
				case "30"	:						
						var valor_imp = parseFloat(sumaNeto*factor_iva);
						var total_oc = parseFloat(sumaNeto+valor_imp);
						$("#impuesto-etiqueta").html("19 % IVA&nbsp;");
						$('#subtotal_oc_new').val(insertFormatMoney(Math.floor(sumaNeto)));
						$('#neto_oc_new').val(insertFormatMoney(Math.floor(sumaNeto)));
						$('#impuesto_oc_new').val(insertFormatMoney(Math.floor(valor_imp)));
						$('#total_oc_new').val(insertFormatMoney(Math.round(total_oc)));						
						break;

				case "33"	:						
						var valor_imp = parseFloat(sumaNeto*factor_iva);
						var total_oc = parseFloat(sumaNeto+valor_imp);
						$("#impuesto-etiqueta").html("19 % IVA&nbsp;");
						$('#subtotal_oc_new').val(insertFormatMoney(Math.floor(sumaNeto)));
						$('#neto_oc_new').val(insertFormatMoney(Math.floor(sumaNeto)));
						$('#impuesto_oc_new').val(insertFormatMoney(Math.floor(valor_imp)));
						$('#total_oc_new').val(insertFormatMoney(Math.round(total_oc)));						
						break;
				
				case "32":						
						var valor_imp =0;
						var total_oc = sumaNeto;
						$("#impuesto-etiqueta").html("IMPUESTO&nbsp;");
						$('#subtotal_oc_new').val(insertFormatMoney(Math.floor(sumaNeto)));
						$('#neto_oc_new').val(insertFormatMoney(Math.floor(sumaNeto)));
						$('#impuesto_oc_new').val(insertFormatMoney(Math.floor(valor_imp)));
						$('#total_oc_new').val(insertFormatMoney(Math.round(total_oc)));						
						break;
				
				case "99":						
						var valor_imp =0;
						var total_oc = sumaNeto;
						$("#impuesto-etiqueta").html("IMPUESTO&nbsp;");
						$('#subtotal_oc_new').val(insertFormatMoney(Math.floor(sumaNeto)));
						$('#neto_oc_new').val(insertFormatMoney(Math.floor(sumaNeto)));
						$('#impuesto_oc_new').val(insertFormatMoney(Math.floor(valor_imp)));
						$('#total_oc_new').val(insertFormatMoney(Math.round(total_oc)));						
						break;
				
				case "35":						
						var valor_imp =0;
						var total_oc = sumaNeto;
						$("#impuesto-etiqueta").html("IMPUESTO&nbsp;");
						$('#subtotal_oc_new').val(insertFormatMoney(Math.floor(sumaNeto)));
						$('#neto_oc_new').val(insertFormatMoney(Math.floor(sumaNeto)));
						$('#impuesto_oc_new').val(insertFormatMoney(Math.floor(valor_imp)));
						$('#total_oc_new').val(insertFormatMoney(Math.round(total_oc)));						
						break;
				
				case "97"	:						
						var valor_imp =0;
						var total_oc = sumaNeto;
						$("#impuesto-etiqueta").html("IMPUESTO&nbsp;");
						$('#subtotal_oc_new').val(insertFormatMoney(Math.floor(sumaNeto)));
						$('#neto_oc_new').val(insertFormatMoney(Math.floor(sumaNeto)));
						$('#impuesto_oc_new').val(insertFormatMoney(Math.floor(valor_imp)));
						$('#total_oc_new').val(insertFormatMoney(Math.round(total_oc)));					
						break;
				
				default:						
						var valor_imp =0;
						var total_oc = sumaNeto;
						$("#impuesto-etiqueta").html("IMPUESTO&nbsp;");
						$('#subtotal_oc_new').val(insertFormatMoney(Math.floor(sumaNeto)));
						$('#neto_oc_new').val(insertFormatMoney(Math.floor(sumaNeto)));
						$('#impuesto_oc_new').val(insertFormatMoney(Math.floor(valor_imp)));
						$('#total_oc_new').val(insertFormatMoney(Math.round(total_oc)));						
						break;
		}
}

function calculate_amounts_row_det_oc(){
	$('.cjcalculate').change(function(){
		var llaveItems = $(this).attr('name');		
		var targetCan = "#c-det-"+llaveItems;
		var targetPre = "#p-det-"+llaveItems;
		var targetSub = "#s-det-"+llaveItems;	
		var suma = $(targetCan).val() * $(targetPre).val();
		if(isNaN(suma)){
			$(this).val(0)
		}else{
			$(targetSub).val(suma);			
			calculate_amounts_totales_det_oc();
		}				
	});
}

function sort_nro_items_det_oc(){
	$('.nro-items-det-oc').each(function(index){		
		$(this).val(index+1);
	});	
}

function delete_rows_det_oc(){
	$('.delete-row-det-oc').click(function(){
		var idRows = $(this).attr('name');
		$('#'+idRows).remove();
		sort_nro_items_det_oc();
		calculate_amounts_totales_det_oc();
		contadorFilasDetalleOC();
	});	
}

function validar_nueva_oc(){
	
	var forma_pago = $("#formaspago").val();
	var referencia = $("#referencia").val();
	var msg = "";
	
	if(forma_pago=="-1"){
			 	msg=msg+"- DEBE SELECCIONAR FORMA DE PAGO.\n";
	}
	
	if(referencia==""){
			 	msg=msg+"- DEBE INGRESAR REFERENCIA.\n";
	}
		
	if(msg==""){
		openModal();
		$("#accion").val("ACTUALIZAR");

		//update names items.
		$('.items123').each(function(index){
			var GetNameItem = $(this).attr('name');
			var newName = "items123:"+GetNameItem;
			$(this).attr('name',newName);
		});
		
		$("#frmnuevooc").submit()	
	}else{		
		alert("ATENCION : \n"+msg);
	}
}

//=================================================
/*
function agrega_items_oc(llavedetalleoc){
	array_elementos_oc = llavedetalleoc+"[]";		
	var elementos_input_oc = document.frmnuevooc.elements[array_elementos_oc];	
	if(elementos_input_oc.length>0){	
		for(i=0;i<elementos_input_oc.length;i++){
				switch(i)
					{
				case 1:
					 
					   $("#items-det-oc-new").val(1);	
					  break;
					case 2:
					  var des_items = elementos_input_oc[i].value;
					  $("#des-det-oc-new").val(des_items);	
					   break;
					case 3:
					  $("#cant-det-oc-new").val(elementos_input_oc[i].value);
					  var cant = elementos_input_oc[i].value;
					   break;
					 case 4:
					  $("#precio-det-oc-new").val(Math.floor(elementos_input_oc[i].value));
					  var precio = Math.floor(elementos_input_oc[i].value);
					   break;
					 case 5:
					  $("#total-det-oc-new").val(Math.floor(elementos_input_oc[i].value));
					 case 6:
					 var referencia = elementos_input_oc[i].value+" - "+des_items;
					  $("#referencia").val(referencia);
					  break;
					  case 7:
					  var gastoPres= Math.floor(elementos_input_oc[i].value);
					  $("#gastosP-items-neg").html(insertFormatMoney(gastoPres));
					  break;
					  case 8:
					  var gastoRe= Math.floor(elementos_input_oc[i].value);
					  $("#gastosR-items-neg").html(insertFormatMoney(gastoRe));
					  break;					 						 
					}			
		}
		
		var diferenciaGastos=gastoPres-gastoRe;
		if(diferenciaGastos<0){
			$("#precio-det-oc-new").val(0);
			$("#total-det-oc-new").val(0);
		}else{
			$("#precio-det-oc-new").val(diferenciaGastos);
			$("#total-det-oc-new").val(diferenciaGastos);
		}		
		$("#diferencia-gastos").html(insertFormatMoney(diferenciaGastos));
		$(".gastos-items-neg").fadeIn();		
		calculaTotalesOC();
	}
}*/

//=================================================
function agrega_items_sol(llavedetalleoc){
	array_elementos_oc = llavedetalleoc+"[]";		
	var elementos_input_oc = document.frmnuevooc.elements[array_elementos_oc];	
	if(elementos_input_oc.length>0){	
		for(i=0;i<elementos_input_oc.length;i++){
			switch(i){
				/*case 0:
				$("#idllavenv").val(elementos_input_oc[i].value);	
				break;*/
				case 1:
					//$("#items-det-oc-new").val(elementos_input_oc[i].value);	
					$("#items-det-oc-new").val(1);	
					break;
				case 2:
					var des_items = elementos_input_oc[i].value;
					$("#des-det-oc-new").val(des_items);	
					break;
				case 3:
					$("#cant-det-oc-new").val(elementos_input_oc[i].value);
					var cant = elementos_input_oc[i].value;
					break;
				case 4:
					$("#precio-det-oc-new").val(Math.floor(elementos_input_oc[i].value));
					var precio = Math.floor(elementos_input_oc[i].value);
					break;
				case 5:
					$("#total-det-oc-new").val(Math.floor(elementos_input_oc[i].value));
				case 6:
					var referencia = elementos_input_oc[i].value+" - "+des_items;
					$("#referencia").val(referencia);
					break;
				case 7:
					var gastoPres= Math.floor(elementos_input_oc[i].value);
					$("#gastosP-items-neg").html(insertFormatMoney(gastoPres));
					break;
				case 8:
					var gastoRe= Math.floor(elementos_input_oc[i].value);
					$("#gastosR-items-neg").html(insertFormatMoney(gastoRe));
					break;					 						 
			}			
		}
		
		/*var diferenciaGastos=gastoPres-gastoRe;
		if(diferenciaGastos<0){
			$("#precio-det-oc-new").val(0);
			$("#total-det-oc-new").val(0);
		}else{
			$("#precio-det-oc-new").val(diferenciaGastos);
			$("#total-det-oc-new").val(diferenciaGastos);
		}		
		$("#diferencia-gastos").html(insertFormatMoney(diferenciaGastos));
		$(".gastos-items-neg").fadeIn();		
		calculaTotalesOC();*/
	}
}
//=================================================
/*function calculaTotalesOC(){
	var cant = $("#cant-det-oc-new").val();
	var precio = $("#precio-det-oc-new").val();	
	var neto_oc = parseFloat(precio*cant);
	var iva = 19;
	var imp_boleta = 10;
	var factor_iva = parseFloat(iva/100);
	var factor_imp = parseFloat(imp_boleta/100);
	//alert(factor_imp);
	var tipooc_seleccionado = $("#tipodocto").val();
	$("#tipocnuevo").val(tipooc_seleccionado);
	
	//FACTURA =30 /FACTURA EXENTA=32 / FACTURA ELECTRONICA=33 / FACTURA EXENTA ELECTRONICA=34 /BOLETA DE VENTA=35
	//BOLETA DE HONORARIOS =65 /BOLETA DE HONORARIOS ELECTRONICA=66 / COMPROBANTE=97 / RETIRO=98 / CONTRATO=99	
			
	//alert(tipooc_seleccionado);
	switch(tipooc_seleccionado){
				case "65":						
						var valor_imp = parseFloat(neto_oc*factor_imp);
						var total_oc = parseFloat(neto_oc-valor_imp);
						$("#impuesto-etiqueta").html("RET.  10%&nbsp;");
						$("#subtotal_oc_new").val(insertFormatMoney(Math.floor(neto_oc)));	
						$("#neto_oc_new").val(insertFormatMoney(Math.floor(neto_oc)));	
						$("#impuesto_oc_new").val(insertFormatMoney(Math.floor(valor_imp)));
						$("#total_oc_new").val(insertFormatMoney(Math.round(total_oc)));
						break;

				case "66":						
						var valor_imp = parseFloat(neto_oc*factor_imp);
						var total_oc = parseFloat(neto_oc-valor_imp);
						$("#impuesto-etiqueta").html("RET.  10%&nbsp;");
						$("#subtotal_oc_new").val(insertFormatMoney(Math.floor(neto_oc)));	
						$("#neto_oc_new").val(insertFormatMoney(Math.floor(neto_oc)));	
						$("#impuesto_oc_new").val(insertFormatMoney(Math.floor(valor_imp)));
						$("#total_oc_new").val(insertFormatMoney(Math.round(total_oc)));
						break;
				
				case "30"	:						
						var valor_imp = parseFloat(neto_oc*factor_iva);
						var total_oc = parseFloat(neto_oc+valor_imp);
						$("#impuesto-etiqueta").html("19 % IVA&nbsp;");
						$("#subtotal_oc_new").val(insertFormatMoney(Math.floor(neto_oc)));	
						$("#neto_oc_new").val(insertFormatMoney(Math.floor(neto_oc)));	
						$("#impuesto_oc_new").val(insertFormatMoney(Math.floor(valor_imp)));
						$("#total_oc_new").val(insertFormatMoney(Math.round(total_oc)));
						break;

				case "33"	:						
						var valor_imp = parseFloat(neto_oc*factor_iva);
						var total_oc = parseFloat(neto_oc+valor_imp);
						$("#impuesto-etiqueta").html("19 % IVA&nbsp;");
						$("#subtotal_oc_new").val(insertFormatMoney(Math.floor(neto_oc)));	
						$("#neto_oc_new").val(insertFormatMoney(Math.floor(neto_oc)));	
						$("#impuesto_oc_new").val(insertFormatMoney(Math.floor(valor_imp)));
						$("#total_oc_new").val(insertFormatMoney(Math.round(total_oc)));
						break;
				
				case "32":						
						var valor_imp =0;
						var total_oc = neto_oc;
						$("#impuesto-etiqueta").html("IMPUESTO&nbsp;");
						$("#subtotal_oc_new").val(insertFormatMoney(Math.floor(neto_oc)));	
						$("#neto_oc_new").val(insertFormatMoney(Math.floor(neto_oc)));	
						$("#impuesto_oc_new").val(insertFormatMoney(Math.floor(valor_imp)));
						$("#total_oc_new").val(insertFormatMoney(Math.round(total_oc)));
						break;
				
				case "99":						
						var valor_imp = 0;
						var total_oc = neto_oc;
						$("#impuesto-etiqueta").html("IMPUESTO&nbsp;");
						$("#subtotal_oc_new").val(insertFormatMoney(Math.floor(neto_oc)));	
						$("#neto_oc_new").val(insertFormatMoney(Math.floor(neto_oc)));	
						$("#impuesto_oc_new").val(insertFormatMoney(Math.floor(valor_imp)));
						$("#total_oc_new").val(insertFormatMoney(Math.round(total_oc)));
						break;
				
				case "35":						
						var valor_imp = 0;
						var total_oc = neto_oc;
						$("#impuesto-etiqueta").html("IMPUESTO&nbsp;");
						$("#subtotal_oc_new").val(insertFormatMoney(Math.floor(neto_oc)));	
						$("#neto_oc_new").val(insertFormatMoney(Math.floor(neto_oc)));	
						$("#impuesto_oc_new").val(insertFormatMoney(Math.floor(valor_imp)));
						$("#total_oc_new").val(insertFormatMoney(Math.round(total_oc)));
						break;
				
				case "97"	:						
						var valor_imp = 0;
						var total_oc = neto_oc;
						$("#impuesto-etiqueta").html("IMPUESTO&nbsp;");
						$("#subtotal_oc_new").val(insertFormatMoney(Math.floor(neto_oc)));	
						$("#neto_oc_new").val(insertFormatMoney(Math.floor(neto_oc)));	
						$("#impuesto_oc_new").val(insertFormatMoney(Math.floor(valor_imp)));
						$("#total_oc_new").val(insertFormatMoney(Math.round(total_oc)));
						break;
				
				default:						
						var valor_imp = 0;
						var total_oc = neto_oc;
						$("#impuesto-etiqueta").html("IMPUESTO&nbsp;");
						$("#subtotal_oc_new").val(insertFormatMoney(Math.floor(neto_oc)));	
						$("#neto_oc_new").val(insertFormatMoney(Math.floor(neto_oc)));	
						$("#impuesto_oc_new").val(insertFormatMoney(Math.floor(valor_imp)));
						$("#total_oc_new").val(insertFormatMoney(Math.round(total_oc)));
						break;
		}
} */
//=================================================
function calculaTotales_oc_edit(){
	var cant = $("#cant-det-oc-new").val();
	var precio = $("#precio-det-oc-new").val();
	var neto_oc = parseFloat(precio*cant);
	var iva = 19;
	var imp_boleta = 10;
	var factor_iva = parseFloat(iva/100);
	var factor_imp = parseFloat(imp_boleta/100);
	var tipooc_seleccionado = $("#tipodocto").val();
	$("#tipocnuevo").val(tipooc_seleccionado);
		
	switch(tipooc_seleccionado){
				case "65":						
						var valor_imp = parseFloat(neto_oc*factor_imp);
						var total_oc = parseFloat(neto_oc-valor_imp);
						//alert(total_oc);
						$("#impuesto-etiqueta").html("RET.  10%&nbsp;");
						$("#subtotal_oc_new").val(insertFormatMoney(Math.floor(neto_oc)));	
						$("#neto_oc_new").val(insertFormatMoney(Math.floor(neto_oc)));	
						$("#impuesto_oc_new").val(insertFormatMoney(Math.floor(valor_imp)));
						$("#total_oc_new").val(insertFormatMoney(Math.round(total_oc)));
						break;
				
				case "30"	:						
						var valor_imp = parseFloat(neto_oc*factor_iva);
						var total_oc = parseFloat(neto_oc+valor_imp);
						$("#impuesto-etiqueta").html("19 % IVA&nbsp;");
						$("#subtotal_oc_new").val(insertFormatMoney(Math.floor(neto_oc)));	
						$("#neto_oc_new").val(insertFormatMoney(Math.floor(neto_oc)));	
						$("#impuesto_oc_new").val(insertFormatMoney(Math.floor(valor_imp)));
						$("#total_oc_new").val(insertFormatMoney(Math.round(total_oc)));						
						break;
				
				case "32":						
						var valor_imp =0;
						var total_oc = neto_oc;
						$("#impuesto-etiqueta").html("IMPUESTO&nbsp;");
						$("#subtotal_oc_new").val(insertFormatMoney(Math.floor(neto_oc)));	
						$("#neto_oc_new").val(insertFormatMoney(Math.floor(neto_oc)));	
						$("#impuesto_oc_new").val(insertFormatMoney(Math.floor(valor_imp)));
						$("#total_oc_new").val(insertFormatMoney(Math.round(total_oc)));
						break;
				
				case "99":						
						var valor_imp = 0;
						var total_oc = neto_oc;
						$("#impuesto-etiqueta").html("IMPUESTO&nbsp;");
						$("#subtotal_oc_new").val(insertFormatMoney(Math.floor(neto_oc)));	
						$("#neto_oc_new").val(insertFormatMoney(Math.floor(neto_oc)));	
						$("#impuesto_oc_new").val(insertFormatMoney(Math.floor(valor_imp)));
						$("#total_oc_new").val(insertFormatMoney(Math.round(total_oc)));
						break;
				
				case "35":						
						var valor_imp = 0;
						var total_oc = neto_oc;
						$("#impuesto-etiqueta").html("IMPUESTO&nbsp;");
						$("#subtotal_oc_new").val(insertFormatMoney(Math.floor(neto_oc)));	
						$("#neto_oc_new").val(insertFormatMoney(Math.floor(neto_oc)));	
						$("#impuesto_oc_new").val(insertFormatMoney(Math.floor(valor_imp)));
						$("#total_oc_new").val(insertFormatMoney(Math.round(total_oc)));
						break;
				
				case "97"	:						
						var valor_imp = 0;
						var total_oc = neto_oc;
						$("#impuesto-etiqueta").html("IMPUESTO&nbsp;");
						$("#subtotal_oc_new").val(insertFormatMoney(Math.floor(neto_oc)));	
						$("#neto_oc_new").val(insertFormatMoney(Math.floor(neto_oc)));	
						$("#impuesto_oc_new").val(insertFormatMoney(Math.floor(valor_imp)));
						$("#total_oc_new").val(insertFormatMoney(Math.round(total_oc)));
						break;
				
				default:						
						var valor_imp = 0;
						var total_oc = neto_oc;
						$("#impuesto-etiqueta").html("IMPUESTO&nbsp;");
						$("#subtotal_oc_new").val(insertFormatMoney(Math.floor(neto_oc)));	
						$("#neto_oc_new").val(insertFormatMoney(Math.floor(neto_oc)));	
						$("#impuesto_oc_new").val(insertFormatMoney(Math.floor(valor_imp)));
						$("#total_oc_new").val(insertFormatMoney(Math.round(total_oc)));
						break;
		}
}
//=================================================
function calculaSubTotalesOC(){
	//alert("calculaSubTotalesOC");
	var cant_sub = $("#cant-det-oc-new").val();
	var precio_sub = $("#precio-det-oc-new").val();
	var msg = "";
	
	if(isNaN(cant_sub)){
			 	msg=msg+"- DEBE INGRESAR UN VALOR NUMERICO EN CANT. \n";
	}else{
		if(cant_sub>0){}else{msg=msg+"- DEBE INGRESAR UN VALOR MAYOR A CERO EN CANT. \n";}
	}
	
	if(isNaN(precio_sub)){
			 	msg=msg+"- DEBE INGRESAR UN VALOR NUMERICO EN PRECIO. \n";
	}else{
		if(precio_sub>0){}else{msg=msg+"- DEBE INGRESAR UN VALOR MAYOR A CERO EN PRECIO. \n";}
	}
	
	if(msg==""){
			$("#total-det-oc-new").val(parseFloat(precio_sub*cant_sub));
			calculaTotalesOC();
	}else{
			alert("ATENCION : \n"+msg);
	}

}
//=================================================
function validar_nueva_sol(){
	var items_negocio = $("#itemNegocio").val();
	var referencia = $("#referencia").val();
	var fechacierre = $("#fecha-cierre").val();
	var msg = "";
	
	if(items_negocio=="-1"){
		msg = msg+"- DEBE SELECCIONAR UN ITEMS ASOCIADO.\n";
	}
	
	if(referencia==""){
		msg = msg+"- DEBE INGRESAR UNA REFERENCIA. \n";
	}	
	
	if(fechacierre==""){
		msg = msg+"- DEBE INGRESAR FECHA DE CIERRE.\n";
	}
	
	var cont = 0;
	var cont2 = 0;
	var cantPagos = 0;
	$('#grilla-pagos input').each(function(index){
		cantPagos++;
		if($(this).val()==""){
			if($(this).attr("name")!="observacion"){
				cont++;
			}			
		}else{
			if($(this).attr("name")=="monto" && accounting.unformat($(this).val())==0){								
				cont2++;	
			}
		}
	});

	if(cantPagos==0){
		msg = msg+"- DEBE INGRESAR AL MENOS UN PAGO.\n";
	}

	if(cont>0){
		msg = msg+"- DEBE COMPLETAR TODOS LOS DATOS DE PAGO.\n";
	}

	if(cont2>0){
		msg = msg+"- EXISTEN MONTOS DE PAGO EN CERO.\n";
	}	

	if(msg==""){
		openModal();		
		$("#frmnuevasol").submit();
	}else{		
		alert("ATENCION : \n"+msg);
	}
}
//=================================================
function selecciona_neg(){
	var count = 0;
	var valor_id_nv =0;
	array_elementos_sel = "chk_negocios[]";		
	var elementos_input_sel= document.chknegdup.elements[array_elementos_sel];	
	if(elementos_input_sel.length>0){	
		for(i=0;i<elementos_input_sel.length;i++){
			if(elementos_input_sel[i].checked){
				count++;			
				valor_id_nv = elementos_input_sel[i].value;
			}			
		}
	}		
		
	if(count==1){		
		$("#idnegseleccionadodup").val(valor_id_nv);
		$("#chknegdup").submit();
		cerrar_ventana();
	}
	if(count==0){
		alert("ATENCION : \n"+"- DEBE SELECCIONAR AL MENOS UN NEGOCIO.");
	}
	if(count>1){
		alert("ATENCION : \n"+"- DEBE SELECCIONAR SOLO UN NEGOCIO A LA VEZ.");
	}
	
}
//=================================================
function selecciona_neg2(idnvseleccionado){
	$("#idnegseleccionadodup").val(idnvseleccionado);
	$("#chknegdup").submit();
}
//=================================================
function format_out(input){
	var target = "#"+input;
	var valor_inicial = $(target).val();	
	var valor_limpio = clearFormatMoney(valor_inicial);
	$(target).val(valor_limpio);
}
//=================================================
function clearFormatMoney(valor){
    var array = valor.split(""); // // [1, 2 ,3];
	var valor_limpio = "";
	for (i=0;i<array.length;i++){
		if((array[i]!="$")&&(array[i]!=".")){
			valor_limpio = valor_limpio+array[i];
		}		
	}
	return valor_limpio;	
}
//=================================================
function format_in(input){
	var target = "#"+input;
	var valor_inicial = $(target).val();	
	var valor_formateado = insertFormatMoney(valor_inicial);
	$(target).val(valor_formateado);
}
//=================================================
function insertFormatMoney(valorx){	
	//var num = valorx.replace(/\./g,'');
	var num = valorx;
	if(!isNaN(num)){		
		num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
		num = num.split('').reverse().join('').replace(/^[\.]/,'');
		var valor_retorno =  "$"+num;			
	}else{ 		
		var valor_retorno = "$0";			
	}
	return valor_retorno;
}
//=================================================
function calculaDescuento(id,valor_aux){
	var valor_new = soloNumeros(valor_aux);
	if(valor_new>0){
		$("#"+id).val(valor_new);
		calculaTotalesFinales();
	}else{
		$("#"+id).val(0);
	}
}
//=================================================
function calculaComision1(){	
	var valor_comision1 = $("#valorcomision1").val();
	var valor_subtotal_afecto = clearFormatMoney($("#precom").val());
	var valor_suma_subtotal = clearFormatMoney($("#presub").val());

	var monto_com1 = (valor_subtotal_afecto*valor_comision1)/100;
	var suma_subtotal1 = insertFormatMoney(parseFloat(valor_suma_subtotal)+parseFloat(monto_com1));
	$("#montocomision1").val(insertFormatMoney(monto_com1));
	$("#sumatotal1").val(suma_subtotal1);	
	
}
//=================================================
function calculaComision2(){
	var valor_comision2 = $("#valorcomision2").val();	
	var valor_subtotal1 = clearFormatMoney($("#sumatotal1").val());

	var monto_com2 = (valor_subtotal1*valor_comision2)/100;	
	var suma_subtotal2 = insertFormatMoney(parseFloat(valor_subtotal1)+parseFloat(monto_com2));	
	$("#montocomision2").val(insertFormatMoney(monto_com2));
	$("#sumatotal2").val(suma_subtotal2);	
}
//=================================================
function calculaComision3(){	
	var valor_comision3 = $("#valorcomision3").val();
	var valor_subtotal2 = clearFormatMoney($("#sumatotal2").val());	
	if($("#com_sobre_total").val()=="si"){	
		var aux = (1-(parseFloat(valor_comision3)/100));		
		var monto_com3 = Math.round(parseFloat(valor_subtotal2)/aux);	
		var suma_subtotal3 = insertFormatMoney(parseFloat(monto_com3)-parseFloat(valor_subtotal2));	
	}else{
		var monto_com3 = Math.round((valor_subtotal2*valor_comision3)/100);
		var suma_subtotal3 = insertFormatMoney(parseFloat(valor_subtotal2)+parseFloat(monto_com3));	
	}	
	$("#montocomision3").val(insertFormatMoney(monto_com3));
	$("#sumatotal3").val(suma_subtotal3);	
}
//=================================================
function calculaTotales(){	
	array_totales_titulos_x = "totalestitulo[]";
	var elementos_input_x = document.frmeditarnegocio.elements[array_totales_titulos_x];
	if(elementos_input_x.length>0){
		var suma_subtotales_x = 0;
		for(j=0;j<elementos_input_x.length;j++){
			suma_subtotales_x += parseFloat(elementos_input_x[j].value);
		}
	}else{
		var suma_subtotales_x = parseFloat(elementos_input_x.value);
	}
	$('#presub') .val(insertFormatMoney(suma_subtotales_x));	
}
//=================================================
function calculaComisiones(id,valor_aux){
	var valor_new = soloNumeros(valor_aux);
	if(valor_new>0){
		$("#"+id).val(valor_new);
		calculaTotalesFinales();
	}else{
		$("#"+id).val(0);
	}
}
//=================================================
function calculaTotalesFinales(){	

	calculaComision1();
	calculaComision2();
	calculaComision3();

	var valor_descuento = parseFloat($("#descuentos").val());
	var monto_subtotal_com3 = parseFloat(clearFormatMoney($("#sumatotal3").val()));	
	var monto_descuento = Math.round((monto_subtotal_com3*valor_descuento)/100);
	var monto_subtotal_neto = monto_subtotal_com3-monto_descuento;
		
	$("#totaldescuento").val(insertFormatMoney(monto_descuento));
	$("#subtotalfinal").val(insertFormatMoney(monto_subtotal_neto));

	var iva = parseFloat(monto_subtotal_neto * 0.19);
	var total_total = parseFloat(monto_subtotal_neto) + iva;
	
	$('#ivafinal') .val(insertFormatMoney(Math.floor(iva))) ;
	$('#totalfinal') .val(insertFormatMoney(Math.floor(total_total))) ;
}
//=================================================
function enviarEditarNeg(){	
	if($("#referencianeg").val()==""){
		alert("ATENCION : \n"+"- DEBE INGRESAR UNA REFERENCIA.");
	}else{
		$("#accion").val("ACTUALIZAR");	
		$('.chk-t').attr('checked', true);
		$('.chk-i').attr('checked', true);
		$('#frmeditarnegocio').submit();
	}
	
}
//=================================================
function enviarEditarRend(op){
	//alert(op);
	var enviar1 = "true";
	var enviar2 = "true";
	$('#grilla select').each(function(index){
		if($(this).val() == "-1"){
			enviar1 = "false";
		}		
	});

	$('#grilla input').each(function(index){
		if($(this).val() == ""){
			enviar2 = "false";
		}	
	});

	

	if(enviar1=="true" & enviar2=="true"){
		openModal();
		$('#opcionSend').val(op);
		$('#frmeditarrendicion').submit();
	}else{
		alert("ATENCION :\n\n"+"- DEBE COMPLETAR TODOS LOS CAMPOS.");
	}
}
//=================================================
function motivoAnulacionOc(){
	if($("#vAnularoc").val()=="SI"){
		$(".motivos-anulacion").fadeIn();
	}else{
		alert("ATENCION : \n\n"+"PARA ANULAR LA ORDEN DE COMPRA, ANTES DEBE ANULAR TODA ORDEN DE PAGO ASOCIADA.");	
	}	
}
//=================================================
function confirmAnular(){	
	var res =confirm("ESTA SEGURO(A) DE ANULAR LA ORDEN DE COMPRA?");
	if (res==true){
		$("#accion").val("ANULAR");		
		$("#idmotivoanulacion").val($("#motivoanulacion").val());		
		$("#frmnuevooc").submit();	
	}else{
		$(".motivos-anulacion").fadeOut();	
	}	
}
//=================================================
function cerrarMotivosAnularOC(){	
	$(".motivos-anulacion").fadeOut();	
}
//=================================================
function confirmCancelarNeg(){
	var res =confirm("CONFIRMACION : \n\n"+"ESTA SEGURO(A) DE CANCELAR LA COTIZACION?");
	if (res==true){
		$("#accion").val("ANULAR");	
		$("#frmeditarnegocio").submit();	
	}
}

//=================================================

function fn_ckeck_validar_rut(){
	$('#validarut').click(function(){
		if($(this).is(':checked')){
			$('#validarut_2').val("SI");
		}else{
			$('#validarut_2').val("NO");
		}
		$('#dv').val("");
		if($('#rutxxx').val()==""){
			$('#rutxxx').focus();
		}else{
			$('#dv').focus();
		}
	});	
}

//=================================================

function fn_validaFromDg(){
	$('#dv').change(function() {
		var rut = $('#rutxxx').val();
		var dig = $('#dv').val();

		if($("#validarut").is(':checked')){
			if(validaRut(rut+"-"+dig)==false){
				alert("EL RUT INGRESADO NO ES VALIDO.");
				$('#dv').val("");
				$('#dv').focus();
			}else{
				var rutx = rut+dig;
				$.get("/verificaRutExisteIntra/"+rutx, function(data){
					if(data==0){
						alert("EL RUT INGRESADO YA SE ENCUENTRA REGISTRADO.");
						$('#dv').val("");
						$('#dv').focus();
					}
				});
			}
		}else{
			var rutx = rut+dig;
			$.get("/sinCheckVerificaRutExisteIntra/"+rutx, function(data){
				if(data==0){
					alert("EL RUT INGRESADO YA SE ENCUENTRA REGISTRADO Y VALIDADO.");
					$('#dv').val("");
					$('#dv').focus();
				}
			});
		}
	});
}

//=================================================

function validaRut(rutx){		
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
//=================================================
function validate_send_contacto(){
	var msgAlert;
	msgAlert="";
	
	if($("#frm-contacto #alias").val()==""){
		msgAlert=msgAlert+"\n- DEBE INGRESAR UNA ALIAS.";
	}
	
	if($("#validarut").is(':checked')){
		if($("#frm-contacto #rutxxx").val()=="" || $("#frm-contacto #dv").val()==""){
			msgAlert=msgAlert+"\n- DEBE INGRESAR UN RUT.";
		}
	}
		
	if($("#frm-contacto #razon").val()==""){
		msgAlert=msgAlert+"\n- DEBE INGRESAR UNA RAZON SOCIAL.";
	}
	if($("#frm-contacto #giro").val()==""){
		msgAlert=msgAlert+"\n- DEBE INGRESAR UN GIRO.";
	}
	
	if(msgAlert==""){		
		$("#frm-contacto").submit();
	}else{
		alert("ATENCION :"+msgAlert);	
	}	
}

//================================================
function cerrar_aviso_rut()
{
	$(".box-aviso-existe-rut").fadeOut();		
}

//================================================
function cerrar_aviso_rut2()
{
	$(".box-aviso-existe-rut2").fadeOut(
		function()
		{
			$(".muestra-box-aviso").fadeIn();
		}
	);
}

function mostrar_aviso_rut()
{
	$(".muestra-box-aviso").fadeOut(
		function()
		{
			$(".box-aviso-existe-rut2").fadeIn();
		}
	);	
}

function fn_send_notificacion()
{
	if($("#lost-focus").val()!="")
	{
		$("#send-notificacion").submit();
	}	
}

function fn_crear_prov_ex()
{
		
	var msjError="";
	if($("#alias-np").val()=="")
	{
		msjError = "xxxxxxx";
	}

	if($("#rut-np").val()=="")
	{
		msjError = "xxxxxxx";
	}

	if($("#razon-np").val()=="")
	{
		msjError = "xxxxxxx";
	}

	if($("#giro-np").val()=="")
	{
		msjError = "xxxxxxx";
	}

	if(msjError=="")
	{
		$("#status").html("<span class='correcto'>Datos correctos.</span>");

		var aleatorio = "random-"+Math.random();

		cadena = "";
		cadena = cadena + "<input name='random' value='"+aleatorio+"'>";
		cadena = cadena + "<input name='alias' value='"+$("#alias-np").val()+"'>";
		cadena = cadena + "<input name='rut' value='"+$("#rut-np").val()+"'>";
		cadena = cadena + "<input name='dv' value='"+$("#dv-np").val()+"'>";
		cadena = cadena + "<input name='razom' value='"+$("#razon-np").val()+"'>";
		cadena = cadena + "<input name='giro' value='"+$("#giro-np").val()+"'><br/>";		

		$("#usuarios-creados").append(cadena);

		var cantActual = $("#cantidadusuarios").val();
		$("#cantidadusuarios").val(parseInt(cantActual)+6);
		

		var idSelec = $("#id_fila").val();
    	var elem = idSelec.split('-');
		var elem1 = elem[0];
		var elem2 = elem[1];

		var idProvKeys = "idProvKeys-"+elem2;
		var nomProvKeys = "idnomprov-"+elem2;

    	$("#"+idProvKeys).remove();
    	$("#"+nomProvKeys).before("<input name='idprovedet' id="+idProvKeys+" value="+aleatorio+" type='hidden'/>");
    	$("#"+nomProvKeys).val($("#razon-np").val());

		setTimeout(function(){
			$( "#dialog-modal2" ).dialog("close");
		},500);

	}else{
		$("#status").html("<span class='error'>Debe completar todos los campos.</span>");
	}
}

//=================================================
function validate_send_pago(){
	var msgAlert;
	msgAlert="";

	if ($("#cantidademitidosx").val()==0) {

		if($("#tipo-pago").val()=="-1"){
			msgAlert="";
		}else{
			if($("#pag-tipo").val()=="CHEQUE"){
				if($("#nroch").val()==""){
					msgAlert=msgAlert+"\n- DEBE INGRESAR NRO DE CHEQUE.";
				}

				if($("#fechapag").val()==""){
					msgAlert=msgAlert+"\n- DEBE CONFIRMAR FECHA DE PAGO.";
				}

			}else{
				if($("#nrotr").val()==""){
					msgAlert=msgAlert+"\n- DEBE INGRESAR NRO DE TRANSFERENCIA.";
				}

				if($("#fechapag").val()==""){
					msgAlert=msgAlert+"\n- DEBE CONFIRMAR FECHA DE TRANSFERENCIA.";
				}
			}


			if(msgAlert==""){
				if(confirm("DESEA VALIDAR EL PAGO?")){
				  $("#validadar-pago").val("validado");
				}else{
				  $("#validadar-pago").val("novalidado");
				}
				openModal();
				$("#frmeditarpago").submit();
			}else{
				alert("ATENCION :"+msgAlert);	
			}
		}
	}
}

function fn_tipo_opcion(opcion){
	if(opcion == "TODOS"){
		$("#frmbuscadores").submit();		
	}	
}

function fn_tipo_opcion_pago(opcion){
	if((opcion == "TODOS")|(opcion == "PAGADA")|(opcion == "EMITIDA")|(opcion == "ANULADA")){
		$('#tipo_busqueda_pago').val(opcion);
		$("#frmbuscadores").submit();		
	}	
}

function fn_imprimir_boucher(){	
	if ($("#cantidademitidosx").val()>0) {
		$("#inprimirboucher").submit();
	}
}

function fn_convertir_a_neg(){
	var res =confirm("ESTA SEGURO(A) DE CONVERTIR EN NEGOCIO?");
	if (res==true){
		//fn_dialog_notificar()
		$("#convertiraneg").submit();
	}		
}

function fn_send_notificacion_neg()
{
	var msg = "";
	if($("#lost-focus").val()=="")
	{
		msg = "xxxxxx";
	}
	if($("#lost-focus").val()=="")
	{
		msg = "xxxxxxx";
	}

	if(msg == "")
	{
		$(".bloque-envios-not").fadeOut("fast",function(){
			$(".enviandoxx").fadeIn();
		});
		$("#send-notificacion").submit();
	}	
}