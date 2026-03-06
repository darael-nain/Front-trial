$(document).ready(function() {
 $('#cargando_imagen').ajaxStart(function() {
 $(this).show();
 }).ajaxStop(function() {
 $(this).hide();
 });
});


$(document).ready(function(){ 
	$("#datepicker1").datepicker();		
  });

$(document).ready(function(){
    $("#datepicker2").datepicker();
  });

//-------------------------------------------------------------
function xxxxdate(){	
		/*var ano=fecha.getFullYear();*/
		var fechaActual = new Date();
		anno = fechaActual.getFullYear();	
		document.getElementById('date').innerHTML=anno;
	}
//-------------------------------------------------------------
//var n=0; 
function addFila(){
 var n=document.getElementById('tabla').rows.length;	
 n++; 
 var correlativo=document.getElementById('cant-items').innerHTML;
 correlativo++;
 var objTBody = document.getElementById('tabla');//tbody
 var objFila  = document.createElement('tr');//fila
  var objCelda; //celda
 var objDatos; //webforms que se ubicacran en cada celda
   //---------------------------------------------------------------
  objCelda = document.createElement('td');  
  objDatos = document.createElement('input');
  objDatos.type='text';
  objDatos.name='txtNroItem'+n;
  objDatos.id='txtNroItem'+n;
  objDatos.size='10';
  objDatos.className='correlativo'; 
  objDatos.readOnly='readonly';
  objDatos.value=correlativo;  
  objCelda.appendChild(objDatos); //agrega información a la celda
  objFila.appendChild(objCelda); //agrega la celda a la fila
 
  //---------------------------------------------------------------
  objCelda = document.createElement('td'); 
  objDatos = document.createElement('input');
  objDatos.type='text';
  objDatos.name='txtDescripcion'+n;
  objDatos.id='txtDescripcion'+n;   
  objDatos.size='50';
  objDatos.className='cj-texto-nor'; 
  objCelda.appendChild(objDatos); //agrega información a la celda
  objFila.appendChild(objCelda); //agrega la celda a la fila
  //---------------------------------------------------------------
  objCelda = document.createElement('td'); 
  objDatos = document.createElement('input');
  objDatos.type='text';
  objDatos.name='txtCantidad'+n;
  objDatos.id='txtCantidad'+n;
  objDatos.value='0';
  objDatos.size='10';
  objDatos.className='cj-texto-nor';
  objDatos.onkeyup= function() {calculaSubTotal(this.id,this.value)}; 
  objCelda.appendChild(objDatos); //agrega información a la celda
  objFila.appendChild(objCelda); //agrega la celda a la fila
   //---------------------------------------------------------------
  objCelda = document.createElement('td'); 
  objDatos = document.createElement('input');
  objDatos.type='text';
  objDatos.name='txtPrecioUnitario'+n;
  objDatos.value='0';
  objDatos.id='txtPrecioUnitario'+n;   
  objDatos.size='20';
  objDatos.className='cj-texto-nor';
  objDatos.onkeyup= function() {calculaSubTotal(this.id,this.value)};  
  objCelda.appendChild(objDatos); //agrega información a la celda
  objFila.appendChild(objCelda); //agrega la celda a la fila 
  //---------------------------------------------------------------
  objCelda = document.createElement('td');
  objDatos = document.createElement('input');
  objDatos.type='text';
  objDatos.name='txtSubTotal'+n;
  objDatos.id='txtSubTotal'+n;   
  objDatos.size='20';
  objDatos.value='0';  
  objDatos.readOnly='readonly'; 
  objDatos.className='totales'; 
  objCelda.appendChild(objDatos); //agrega información a la celda
  objFila.appendChild(objCelda); //agrega la celda a la fila   
    //---------------------------------------------------------------   
  objCelda = document.createElement('td');
  objCelda.align='center'; 
  objDatos = document.createElement('input');
  objDatos.type='button';
  objDatos.name='btnEliminar'+n;
  objDatos.id='btnEliminar'+n;
  objDatos.value='x';
  objDatos.className='bn-eliminar';  
  objDatos.onclick = function() {del(this.parentNode.parentNode.rowIndex)};
  objCelda.appendChild(objDatos);  
  objFila.appendChild(objCelda); //agrega la celda a la fila  
  //---------------------------------------------------------------
  //objFila.style.backgroundColor='#FFFFCC';
  objTBody.appendChild(objFila);//agrega la nueva fila a la tabla
  //---------------------------------------------------------------
  var anterior=n-1; 
  document.getElementById('btnEliminar'+anterior).disabled='disabled';
   //---------------------------------------------------------------
  var cItems=document.getElementById('cant-items').innerHTML;
  cItems++;
  document.getElementById('cant-items').innerHTML=cItems;
} 

//**********************************************************************************************
function del(obj){	
	document.getElementById('tabla').deleteRow(obj)
    //n--;
	var cItems=document.getElementById('cant-items').innerHTML;
  	cItems--;
  	document.getElementById('cant-items').innerHTML=cItems;
	//---------------------------------------------------------------
	cItems++;
	if(cItems>2){
		document.getElementById('btnEliminar'+cItems).disabled='';
	}
  	//---------------------------------------------------------------
	calculaTotales();	
}
//**********************************************************************************************
function calculaSubTotal(idc,valorc){
	if (isNaN(valorc)) {
            alert("Ingrese un valor numerico");    
    }else{           
			var largo=idc.length;			
			var idcantidad="txtCantidad"+idc.substr(largo-1,1);
			var idprecio="txtPrecioUnitario"+idc.substr(largo-1,1);
			var idsubtotal="txtSubTotal"+idc.substr(largo-1,1);				
			var cant=document.getElementById(idcantidad).value;
			var precio=document.getElementById(idprecio).value;			
			document.getElementById(idsubtotal).value=Math.round(cant*precio);
			var suma=Math.round(cant*precio);
			calculaTotales();
    } 	
}
//**********************************************************************************************

function calculaTotales(){	
	var tipoDoc=document.getElementById('tipodocto').value;
	var subTotales=0;
	var totalNeto=0;
	var impuesto=0;
	var totalGeneral=0;
	var cItemsxx=document.getElementById('cant-items').innerHTML;
  	cItemsxx=parseInt(cItemsxx);	
	var indice=1;	
	 for (x=0; x<cItemsxx; x++) {		
		indice++;		
		var idsacar="txtSubTotal"+indice;		
		var valors=document.getElementById(idsacar).value;		
		subTotales=Math.round(subTotales+parseInt(valors));		
  	}
	
	if (isNaN(subTotales)==true){		
		subTotales=0;
	}
	
	switch(tipoDoc)
		{
		case 'BOLETA HONORARIOS':			
			totalNeto=Math.round(subTotales);
			impuesto=Math.round((totalNeto*10)/100);
			totalGeneral=Math.round(totalNeto-impuesto);
			
		/*	totalNeto=subTotales;
			impuesto=(totalNeto*10)/100;
			totalGeneral==totalNeto-impuesto;*/
			document.getElementById('txtSumaTotales').value=subTotales;
			document.getElementById('txtNeto').value=totalNeto;			
			document.getElementById('txtImpuesto').value=impuesto;
			document.getElementById('txtTotalGeneral').value=totalGeneral;
			break;
		case 'FACTURA':			
			totalNeto=Math.round(subTotales);
			impuesto=Math.round((totalNeto*19)/100);			
			
			totalGeneral=Math.round(totalNeto+impuesto);
			document.getElementById('txtSumaTotales').value=subTotales;
			document.getElementById('txtNeto').value=totalNeto;			
			document.getElementById('txtImpuesto').value=impuesto;
			document.getElementById('txtTotalGeneral').value=totalGeneral;
			break;
		default:			
			totalNeto=Math.round(subTotales);
			impuesto=0;
			totalGeneral=totalNeto;
			document.getElementById('txtSumaTotales').value=subTotales;
			document.getElementById('txtNeto').value=totalNeto;			
			document.getElementById('txtImpuesto').value=impuesto;
			document.getElementById('txtTotalGeneral').value=totalGeneral;
			break;
		}
		document.getElementById('tip-dp').value=tipoDoc;
		
		
	
}
//**********************************************************************************************
function adjuntar(idadj){

	if(idadj=="si-adjuntar"){		
	    document.getElementById('adjuntar').style.display='';
		document.getElementById('no-adjuntar').style.display='';
		document.getElementById('si-adjuntar').style.display='none';
		document.getElementById('tip-dp').value=document.getElementById('tipodocto').value;
	}else if(idadj=="no-adjuntar"){
		document.getElementById('adjuntar').style.display='none';
		document.getElementById('no-adjuntar').style.display='none';
		document.getElementById('si-adjuntar').style.display='';
		document.getElementById('tip-dp').value='';
		document.getElementById('txtNro-dp').value='';
		
	}
}

//**********************************************************************************************
function validafrm(tip)
{
	var msg="";
	
		var cfilas=document.getElementById('tabla').rows.length;
		var cont = 0; 
		  cfilas++	 
		  for (var x=2; x < cfilas; x++) {
			  if(document.getElementById('txtDescripcion'+x).value==''){
				 var T=x-1
				 msg=msg+"- Ingrese Descripcion fila:"+T+"\n";
			  }
			  
			  if((document.getElementById('txtCantidad'+x).value=='')||(document.getElementById('txtCantidad'+x).value=='0')){
				  var D=x-1
				 msg=msg+"- Ingrese Cantidad fila:"+D+"\n";
			  }
			  
			   if((document.getElementById('txtPrecioUnitario'+x).value=='')||(document.getElementById('txtPrecioUnitario'+x).value=='0')){
				  var O=x-1
				 msg=msg+"- Ingrese Precio fila:"+O+"\n";
			  }	  
		  }
	
	  
	if ((document.getElementById('adjuntar').style.display=='')&(document.getElementById('txtNro-dp').value=='')){
		if (!document.getElementById('chkPend-dp').checked){
			var auxmsg="(En caso de no contar con el numero de Doc. \"MARCAR PENDIENTE\")\n"
			msg=msg+"- Ingrese NRO del Documento Adjunto\n"+auxmsg;
		}
	}
	
	if (document.frmingoc.txtReferencia.value==""){
		msg=msg+"- Ingrese una REFERENCIA a la O.C\n";
	}	
	
	if(tip=='ing'){
		if (document.frmingoc.itemNegocio.value=="[Seleccione Item]"){
			msg=msg+"- Debe seleccionar un ITEM ASOCIADO a la O.C\n";
		}		
	}
	

	  if (msg!=""){		
		var msg1="POSIBLES ERRORES:\n";
        alert(msg1+msg)
        return 0;
      } else{
		 
		  document.frmingoc.submit();			  
	  }			
			 
}	

//**********************************************************************************************
function validaBuscar()
{		
	if(document.frmBuscarProveedor.cboBuscarpor.value=="n"){
		var opcion=" \"RAZON SOCIAL\" ";
	}else{
		var opcion=" \"RUT\" ";
	}
	if (document.frmBuscarProveedor.txtBuscar.value==""){
		 alert("- DEBE INGRESAR"+" "+opcion+" "+"A BUSCAR");
		 return 0;
	}else{
		document.frmBuscarProveedor.submit();
	}			 
}	

//**********************************************************************************************

function validateEmail(valor)
{
	
			if(valor!="")
			{
					if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(valor))
						{
							//NADA
						} 
						else
						{
							alert("- Ingrese un EMAIL valido")
							document.getElementById('txtEmailContacto').value="";								
						}
				
			}
			else
			{			
			//NADA
			}
		
}
//**********************************************************************************************
function dateValida(fecha){	
	if (fecha !=undefined && fecha.value !=""){
		//alert("entro");
		if (!/^\d{2}\/\d{2}\/\d{4}$/.test(fecha.value)){
		  alert("formato de fecha no válido (mes/dia/año)");
		  document.getElementById('txtfechadocS2').value="00/00/0000";		   
		  return false;
        }
		/*var dia=parseInt(fecha.value.substring(0,2),10);
        var mes=parseInt(fecha.value.substring(3,5),10);
        var anio=parseInt(fecha.value.substring(6),10);
		*/
		var mes=parseInt(fecha.value.substring(0,2),10);
        var dia=parseInt(fecha.value.substring(3,5),10);
        var anio=parseInt(fecha.value.substring(6),10);
		
		switch(mes)
		{
		  case 1:
		  case 3:
		  case 5:
		  case 7:
		  case 8:
		  case 10:
		  case 12:
		       var numDias=31;
               break;
	      case 4:
		  case 6:
		  case 9:
		  case 11:
			  var numDias=30; 
			  break; 
		  case 2:
			  if(comprobarSiBisisesto(anio)){
				  numDias=29;
			  }else{
				  numDias=28;
			  }
			  break;
		  default:
		  var msg="Formato valido: \"mes/dia/año\""
			  alert("MES NO VALIDO\n\n"+msg);
			  document.getElementById('txtfechadocS2').value="00/00/0000";			  
			  return false;			  
		 }
		 if(dia > numDias || dia==0){
			  var msg="Formato valido: \"mes/dia/año\""
			  alert("DIA NO VALIDO\n\n"+msg);
			  document.getElementById('txtfechadocS2').value="00/00/0000";
			  return true;
		  }
		
	}
}

//**********************************************************************************************
function comprobarSiBisisesto(anio){  
      if ( ( anio % 100 != 0) && ((anio % 4 == 0) || (anio % 400 == 0))) { 
          return true; 
          }
      else {   
          return false;
          }
}      
//**********************************************************************************************
 /* function esFechaValida(fecha){
          if (fecha != undefined && fecha.value != "" ){
              if (!/^\d{2}\/\d{2}\/\d{4}$/.test(fecha.value)){
                  alert("formato de fecha no válido (dd/mm/aaaa)");
                  return false;
              }
			  //lo valido como "mm/dd/aaaa"
              var dia  =  parseInt(fecha.value.substring(0,2),10);
              var mes  =  parseInt(fecha.value.substring(3,5),10);
              var anio =  parseInt(fecha.value.substring(6),10);
          switch(mes){
              case 1:
              case 3:
              case 5:
              case 7:
              case 8:
              case 10:
              case 12:
                  numDias=31;
                  break;
              case 4: case 6: case 9: case 11:
                  numDias=30; 
                  break;
              case 2:
                  if (comprobarSiBisisesto(anio)){ numDias=29 }else{ numDias=28};
                  break;
              default:
                  alert("Fecha introducida errónea");  
                  return false;  
          }       
  
              if (dia>numDias || dia==0){
                  alert("Fecha introducida errónea"); 
              return true;
          }
      }

//**********************************************************************************************
      function comprobarSiBisisesto(anio){  
      if ( ( anio % 100 != 0) && ((anio % 4 == 0) || (anio % 400 == 0))) { 
          return true; 
          }
      else {   
          return false;
          }
		}
//**********************************************************************************************

*/
 function buscar_op(obj,cadena){
   var puntero=cadena.length;
   var encontrado=false;
   var opcombo=0;
	  while (!encontrado && (opcombo < obj.length)){
		if(obj[opcombo].text.substr(0,puntero).toLowerCase()==cadena.toLowerCase()){
		   obj.selectedIndex=opcombo;
		   encontrado=true;
		   }else{
			opcombo++;
		 }
	  }
} 

//**********************************************************************************************
function popUp(URL,winName,features) {
//day = new Date();
//id = day.getTime();
//eval("page" + id + " = window.open(URL, '" + id + "', 'toolbar=0,scrollbars=1,location=0,statusbar=0,menubar=0,resizable=0,width=450,height=250,left = 420,top = 195');")
window.open(URL,winName,features);
}
//**********************************************************************************************
function opcionNeg(idopcion,valid,tip) {	
	if(idopcion=="encontrados"){		
		if(tip=='o'){
			document.getElementById('txtTipoD').value='orden';
		}else{
			document.getElementById('txtTipoD').value='solicitud';
		}
		document.getElementById('encontrados').style.display='none';		
		document.getElementById('ir-negocios').style.display='';
		document.getElementById('txtIdProveedor').value=valid;
		
	}else{		
		document.getElementById('encontrados').style.display='';		
		document.getElementById('ir-negocios').style.display='none';
		document.getElementById('txtIdProveedor').value=valid;
	}
}
//**********************************************************************************************
function enviarCrearOc() {	
	document.frmocNeg.submit();
}

//**********************************************************************************************
function validafrmcont() {
		//alert("entro");
		var msg="";		
/*	if (document.frmingprov.txtRut.value==""){
		msg=msg+"- Ingrese un RUT\n";
	}else{
		if(Rut(document.frmingprov.txtRut.value)=="n"){
			alert("malo");
			msg=msg+"- Ingrese un RUT VALIDO\n";
		}	
	}
	*/
	if (document.frmingprov.txtAlias.value==""){
		msg=msg+"- Ingrese un ALIAS\n";
	}	
	
	if (document.frmingprov.txtRazon.value==""){
		msg=msg+"- Ingrese una RAZON SOCIAL\n";
	}
	
	if (document.frmingprov.txtEmail.value!=""){
		if (validarEmail(document.frmingprov.txtEmail.value)=="n"){		
			msg=msg+"- Ingrese un EMAIL VALIDO\n";
		}		
	}

	  if (msg!=""){		
		var msg1="POSIBLES ERRORES:\n";
		alert(msg1+msg);
		return 0;
	  }else{
		 document.frmingprov.submit();			  
	  }			
			 
}

//**********************************************************************************************
//
// Validador de Rut
function revisarDigito( dvr )
{	
	dv = dvr + ""	
	if ( dv != '0' && dv != '1' && dv != '2' && dv != '3' && dv != '4' && dv != '5' && dv != '6' && dv != '7' && dv != '8' && dv != '9' && dv != 'k'  && dv != 'K')	
	{		
		/*alert("Debe ingresar un digito verificador valido");		
		window.document.form1.rut.focus();		
		window.document.form1.rut.select();	*/	
		return 0;	
	}	
	return 1;
}

function revisarDigito2( crut )
{	
	largo = crut.length;	
	if ( largo < 2 )	
	{		
		/*alert("Debe ingresar el rut completo")		
		window.document.form1.rut.focus();		
		window.document.form1.rut.select();		*/
		return 1;	
	}	
	if ( largo > 2 )		
		rut = crut.substring(0, largo - 1);	
	else		
		rut = crut.charAt(0);	
	dv = crut.charAt(largo-1);	
	revisarDigito( dv );	

	if ( rut == null || dv == null )
		return 0	

	var dvr = '0'	
	suma = 0	
	mul  = 2	

	for (i= rut.length -1 ; i >= 0; i--)	
	{	
		suma = suma + rut.charAt(i) * mul		
		if (mul == 7)			
			mul = 2		
		else    			
			mul++	
	}	
	res = suma % 11	
	if (res==1)		
		dvr = 'k'	
	else if (res==0)		
		dvr = '0'	
	else	
	{		
		dvi = 11-res		
		dvr = dvi + ""	
	}
	if ( dvr != dv.toLowerCase() )	
	{		
		/*alert("EL rut es incorrecto")		
		window.document.form1.rut.focus();		
		window.document.form1.rut.select();	*/	
		return 0;	
	}

	return 1;
}

function Rut(texto)
{	
	var tmpstr = "";	
	for ( i=0; i < texto.length ; i++ )		
		if ( texto.charAt(i) != ' ' && texto.charAt(i) != '.' && texto.charAt(i) != '-' )
			tmpstr = tmpstr + texto.charAt(i);	
	texto = tmpstr;	
	largo = texto.length;	

	if ( largo < 2 )	
	{		
	/*	alert("Debe ingresar el rut completo")		
		window.document.form1.rut.focus();		
		window.document.form1.rut.select();		*/
		return 0;	
	}	

	for (i=0; i < largo ; i++ )	
	{			
		if ( texto.charAt(i) !="0" && texto.charAt(i) != "1" && texto.charAt(i) !="2" && texto.charAt(i) != "3" && texto.charAt(i) != "4" && texto.charAt(i) !="5" && texto.charAt(i) != "6" && texto.charAt(i) != "7" && texto.charAt(i) !="8" && texto.charAt(i) != "9" && texto.charAt(i) !="k" && texto.charAt(i) != "K" )
 		{			
			/*alert("El valor ingresado no corresponde a un R.U.T valido");			
			window.document.form1.rut.focus();			
			window.document.form1.rut.select();*/
			return 0;		
		}	
	}	

	var invertido = "";	
	for ( i=(largo-1),j=0; i>=0; i--,j++ )		
		invertido = invertido + texto.charAt(i);	
	var dtexto = "";	
	dtexto = dtexto + invertido.charAt(0);	
	dtexto = dtexto + '-';	
	cnt = 0;	

	for ( i=1,j=2; i<largo; i++,j++ )	
	{		
		//alert("i=[" + i + "] j=[" + j +"]" );		
		if ( cnt == 3 )		
		{			
			dtexto = dtexto + '.';			
			j++;			
			dtexto = dtexto + invertido.charAt(i);			
			cnt = 1;		
		}		
		else		
		{				
			dtexto = dtexto + invertido.charAt(i);			
			cnt++;		
		}	
	}	

	invertido = "";	
	for ( i=(dtexto.length-1),j=0; i>=0; i--,j++ )		
		invertido = invertido + dtexto.charAt(i);	

	window.document.form1.rut.value = invertido.toUpperCase()		

	if ( revisarDigito2(texto) )		
		return 1;

	return 0;
}

//**********************************************************************************************
// validador de email
function validarEmail(valor) {
	if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(valor)){
	//alert("La dirección de email " + valor + " es correcta.")
	return true;
	} else {
	//alert("Email incorrecto.");	
	return false;
	}
}
//**********************************************************************************************
