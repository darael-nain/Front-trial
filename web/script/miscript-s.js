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

/*$(document).ready(function(){
    $("#datepicker3").datepicker();
  });*/


//-------------------------------------------------------------
//var n=0; 
function addFila(){
/*alert("entro");*/
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
  objDatos.name='txtNroItemS'+n;
  objDatos.id='txtNroItemS'+n;
  objDatos.size='3';
  objDatos.className='correlativo'; 
  objDatos.readOnly='readonly';
  objDatos.value=correlativo;  
  objCelda.appendChild(objDatos);
  objFila.appendChild(objCelda); 
   //---------------------------------------------------------------   				   
  objCelda = document.createElement('td');
  objDatos = document.createElement('select');
  objDatos.name='clasificacionS'+n; 
  objDatos.id='clasificacionS'+n;
  objDatos.className='style-cbo';  
  var myarrayClas=new Array(13)
  myarrayClas[0] = "[Seleccione clas.]"
  myarrayClas[1] = "ALOJAMIENTO"
  myarrayClas[2] = "ALIMENTACION"
  myarrayClas[3] = "ARRIENDOS"
  myarrayClas[4] = "COMBUSTIBLES"
  myarrayClas[5] = "COMUNICACIONES"
  myarrayClas[6] = "HONORARIOS DE TERRENO"
  myarrayClas[7] = "MAT.DE OFICINA"
  myarrayClas[8] = "MAT.DE CONST.Y LIBRERIA"
  myarrayClas[9] = "MOVILIZACION"
  myarrayClas[10] = "REP./MANTENCION"
  myarrayClas[11] = "VIATICO"
  myarrayClas[12] = "OTROS"
  for (i=0; i<13; i++) {
	opt1 = document.createElement('option');
	opt1.value = myarrayClas[i];
	opt1.innerHTML = myarrayClas[i]; 
	objDatos.appendChild(opt1);
  }  
  //objDatos.onchange= function() {habilitacj(this.value,'txtNroContrato'+n)};
  objCelda.appendChild(objDatos); //agrega información a la celda
  objFila.appendChild(objCelda); //agrega la celda a la fila
  //---------------------------------------------------------------
  objCelda = document.createElement('td'); 
  objDatos = document.createElement('input');
  objDatos.type='text';
  objDatos.name='txtProveedorS'+n;
  objDatos.id='txtProveedorS'+n;   
  objDatos.size='15';
  objDatos.className='cj-texto-nor'; 
  objCelda.appendChild(objDatos); //agrega información a la celda
  objFila.appendChild(objCelda); //agrega la celda a la fila
  //---------------------------------------------------------------   
  objCelda = document.createElement('td');
  objDatos = document.createElement('select');
  objDatos.name='tipoDocS'+n; 
  objDatos.id='tipoDocS'+n;
  objDatos.className='style-cbo';  
  var myarrayTdoc=new Array(9)
  myarrayTdoc[0] = "[Seleccione doc.]"
  myarrayTdoc[1] = "BOLETA HONORARIOS"
  myarrayTdoc[2] = "FACTURA"
  myarrayTdoc[3] = "FACTURA EXENTA"
  myarrayTdoc[4] = "CONTRATO PERSONAL"
  myarrayTdoc[5] = "CONTRATO"
  myarrayTdoc[6] = "BOLETA DE VENTAS"
  myarrayTdoc[7] = "COMPROBANTE"
  myarrayTdoc[8] = "VARIOS" 
  for (x=0; x<9; x++) {
	opt1 = document.createElement('option');
	opt1.value = myarrayTdoc[x];
	opt1.innerHTML = myarrayTdoc[x]; 
	objDatos.appendChild(opt1);
  }  
  //objDatos.onchange= function() {habilitacj(this.value,'txtNroContrato'+n)};
  objCelda.appendChild(objDatos); //agrega información a la celda
  objFila.appendChild(objCelda); //agrega la celda a la fila
  //---------------------------------------------------------------
  objCelda = document.createElement('td'); 
  objDatos = document.createElement('input');
  objDatos.type='text';
  objDatos.name='txtNrodocS'+n;
  objDatos.id='txtNrodocS'+n;
  //objDatos.value='0';
  objDatos.size='5';
  objDatos.className='cj-texto-nor';
  //objDatos.onkeyup= function() {calculaSubTotal(this.id,this.value)}; 
  objCelda.appendChild(objDatos); //agrega información a la celda
  objFila.appendChild(objCelda); //agrega la celda a la fila
   //---------------------------------------------------------------
  objCelda = document.createElement('td'); 
  objDatos = document.createElement('input');
  objDatos.type='text';
  objDatos.name='txtfechadocS'+n;
  objDatos.id='txtfechadocS'+n;
  objDatos.value='00/00/0000';
  objDatos.size='10';
  objDatos.onblur= function() {dateValida(this.id)}; 
  objDatos.className='cj-texto-nor'; 
  objCelda.appendChild(objDatos); //agrega información a la celda
  objFila.appendChild(objCelda); //agrega la celda a la fila
   //---------------------------------------------------------------
  objCelda = document.createElement('td'); 
  objDatos = document.createElement('input');
  objDatos.type='text';
  objDatos.name='txtDescripcionS'+n;
  objDatos.id='txtDescripcionS'+n;  
  objDatos.size='15';
  objDatos.className='cj-texto-nor'; 
  objCelda.appendChild(objDatos); //agrega información a la celda
  objFila.appendChild(objCelda); //agrega la celda a la fila
   //---------------------------------------------------------------
  objCelda = document.createElement('td'); 
  objDatos = document.createElement('input');
  objDatos.type='text';
  objDatos.name='txtCantidadS'+n;
  objDatos.id='txtCantidadS'+n;  
  objDatos.size='5';
  objDatos.value='0';
  objDatos.onkeyup= function() {calculaSubTotal(this.id,this.value)}; 
  objDatos.className='cj-texto-nor'; 
  objCelda.appendChild(objDatos); //agrega información a la celda
  objFila.appendChild(objCelda); //agrega la celda a la fila
    //---------------------------------------------------------------
  objCelda = document.createElement('td'); 
  objDatos = document.createElement('input');
  objDatos.type='text';
  objDatos.name='txtPrecioS'+n;
  objDatos.id='txtPrecioS'+n;  
  objDatos.size='8';
  objDatos.value='0';
  objDatos.onkeyup= function() {calculaSubTotal(this.id,this.value)};
  objDatos.className='cj-texto-nor'; 
  objCelda.appendChild(objDatos); //agrega información a la celda
  objFila.appendChild(objCelda); //agrega la celda a la fila
  //---------------------------------------------------------------
  objCelda = document.createElement('td');
  objDatos = document.createElement('input');
  objDatos.type='text';
  objDatos.name='txtSubTotalS'+n;
  objDatos.id='txtSubTotalS'+n;   
  objDatos.size='10';
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
  objDatos.name='btnEliminarS'+n;
  objDatos.id='btnEliminarS'+n;
  objDatos.value='x';
  objDatos.className='bn-eliminar'; 
  objDatos.onclick = function() {del(this.parentNode.parentNode.rowIndex)};
  objCelda.appendChild(objDatos);  
  objFila.appendChild(objCelda); //agrega la celda a la fila  
  //---------------------------------------------------------------
  objFila.style.backgroundColor='#FFFFCC';
  objTBody.appendChild(objFila);//agrega la nueva fila a la tabla
  //---------------------------------------------------------------
  var anterior=n-1; 
  document.getElementById('btnEliminarS'+anterior).disabled='disabled';
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
		document.getElementById('btnEliminarS'+cItems).disabled='';
	}
  	//---------------------------------------------------------------
	calculaTotales();	
}
//**********************************************************************************************
function calculaSubTotal(idc,valorc){
	if (isNaN(valorc)) {
            alert("Ingrese un valor numerico");
			document.getElementById(idc).value="0";
			calculaTotales();
    }else{           
			var largo=idc.length;			
			var idcantidad="txtCantidadS"+idc.substr(largo-1,1);
			var idprecio="txtPrecioS"+idc.substr(largo-1,1);
			var idsubtotal="txtSubTotalS"+idc.substr(largo-1,1);				
			var cant=document.getElementById(idcantidad).value;
			var precio=document.getElementById(idprecio).value;
			document.getElementById(idsubtotal).value=cant*precio;
			var suma=cant*precio;
			calculaTotales();
    } 	
}
//**********************************************************************************************

function calculaTotales(){	
	//var tipoDoc=document.getElementById('tipodocto').value;
	var subTotales=0;
	var totalNeto=0;
	var impuesto=0;
	var totalGeneral=0;
	var cItemsxx=document.getElementById('cant-items').innerHTML;
  	cItemsxx=parseInt(cItemsxx);	
	var indice=1;	
	 for (x=0; x<cItemsxx; x++) {		
		indice++;		
		var idsacar="txtSubTotalS"+indice;		
		var valors=document.getElementById(idsacar).value;		
		subTotales=subTotales+parseInt(valors);		
  	}
	
	if (isNaN(subTotales)){
		subTotales=0;
	}
	document.getElementById('txtSumaTotales').value=subTotales;
}

//**********************************************************************************************
/*var cItems=document.getElementById('cant-items').innerHTML;
  	cItems--;
  	document.getElementById('cant-items').innerHTML=cItems;
*/
function validafrm(tip)
{
	/*alert("entro");*/
	var msg="";	
	if((tip=="act")&(document.getElementById('apro').innerHTML=="APROBADO")){
		var cfilas=document.getElementById('tabla').rows.length;
		var cont = 0; 
		  cfilas++	 
		  for (var x=2; x < cfilas; x++) {
			  if(document.getElementById('txtDescripcionS'+x).value==''){
				 var T=x-1
				 msg=msg+"- Ingrese Descripcion fila:"+T+"\n";
			  }
			  
			  if((document.getElementById('txtCantidadS'+x).value=='')||(document.getElementById('txtCantidadS'+x).value=='0')){
				 var D=x-1;
				 msg=msg+"- Ingrese Cantidad fila:"+D+"\n";
			  }
			  
			   if((document.getElementById('txtPrecioS'+x).value=='')||(document.getElementById('txtPrecioS'+x).value=='0')){
				  var O=x-1;
				 msg=msg+"- Ingrese Precio fila:"+O+"\n";
			  }	  
		  }
	}  	  
	
	if(tip=='ing'){
		if (document.frmingsol.itemNegocio.value=="[Seleccione Item]"){
			msg=msg+"- Debe seleccionar un ITEM ASOCIADO a la SOLICITUD\n";
		}		
	}
	
	
	if((tip=="act")&(document.getElementById('apro').innerHTML=="NO APROBADO")){
		if (document.frmingsol.txtReferencia.value==""){
			msg=msg+"- Ingrese una REFERENCIA a la SOLICITUD\n";
		}
	}else if(tip=="ing"){
		if (document.frmingsol.txtReferencia.value==""){
			msg=msg+"- Ingrese una REFERENCIA a la SOLICITUD\n";
		}
	}

	  if (msg!=""){		
		var msg1="POSIBLES ERRORES:\n";
        alert(msg1+msg)
        return 0;
      } else{
		 
		  document.frmingsol.submit();			  
	  }			
			 
}	

//**********************************************************************************************
function dateValida(id){
	
	var fecha=document.getElementById(id);
	//alert(id);
	if (fecha !=undefined && fecha.value !=""){
		//alert("entro");
		if (!/^\d{2}\/\d{2}\/\d{4}$/.test(fecha.value)){
		  alert("formato de fecha no válido (mes/dia/año)");
		  fecha.value="00/00/0000";		   
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
			  document.getElementById(id).value="00/00/0000";			  
			  return false;			  
		 }
		 if(dia > numDias || dia==0){
			  var msg="Formato valido: \"mmes/dia/año\""
			  alert("DIA NO VALIDO\n\n"+msg);
			  document.getElementById(id).value="00/00/0000";
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
function validaNum(idc,valord){
	if (isNaN(valord)) {
            alert("Ingrese un valor numerico");
			document.getElementById(idc).value="0";
    }
}
//**********************************************************************************************
function transfer(idTra){
	if(idTra=="chk-cheque"){
	   if(document.getElementById("chk-transf").checked){
		  document.getElementById("chk-cheque").checked='checked';
		  document.getElementById("chk-transf").checked='';
		  document.getElementById('transferencia').style.display='none';
	   }else{
		  document.getElementById("chk-cheque").checked='';
		  document.getElementById("chk-transf").checked='checked';
		  document.getElementById('transferencia').style.display=''; 
	   }
	   
    }else{
		if(document.getElementById("chk-cheque").checked){
		  document.getElementById("chk-cheque").checked='';
		  document.getElementById("chk-transf").checked='checked';
		  document.getElementById('transferencia').style.display='';
	   }else{
		  document.getElementById("chk-cheque").checked='checked';
		  document.getElementById("chk-transf").checked='';
		  document.getElementById('transferencia').style.display='none'; 
	   }
	}
}
//**********************************************************************************************
		
