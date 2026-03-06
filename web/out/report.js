$(document).ready(function() {
		
	$('.redbg').css('background-color','rgba(255, 0, 0, 0.51)');
	
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();

	if(dd<10) {
	    dd='0'+dd
	} 

	if(mm<10) {
	    mm='0'+mm
	} 

	today = dd+'/'+mm+'/'+yyyy;

	var diasAtras = document.getElementsByClassName('diasatras');
	var cotfecha = document.getElementsByClassName('cotfecha');


	for(var k = 0; k < diasAtras.length; k++){
		var cotfechaval = diasAtras[k].innerHTML;
		 
		if(cotfechaval>30){
			cotfecha[k].className += " redtext";
		}
	}




	//ÓRDENES DE COMPRA POR JUSTIFICAR
	var list = document.getElementsByClassName('abono');

	for(var i = 0; i < list.length; i++){
		var ab = list[i].getAttribute('data-abono') ;
		var vcto = list[i].getAttribute('data-diasatras') ;
		var estado = list[i].getAttribute('data-estado') ;
		if(ab>0 && estado == "PAGADA"){
			list[i].style.borderLeft = '7px solid red';
		}else if(vcto>=30){
			list[i].style.borderLeft = '7px solid orange';
			list[i].className += " sumv";
		}
	}
	
	

	//FACTURAS POR COBRAR
	// var listAtraso = document.getElementsByClassName('atraso');
	// for(var i = 0; i < listAtraso.length; i++){
	// 	var valtext = listAtraso[i].innerHTML;
	// 	var textwithout = valtext.replace(/ /g,'');
	// 	var valor = parseInt(textwithout);

	// 	if(valor > 30){
	// 		listAtraso[i].style.backgroundColor = 'rgba(255, 0, 0, 0.51)';
	// 	}
	// }

	//DOCUMENTOS POR PAGAR
	var listDiasAtras = $('.dvcto');
	for(var j = 0; j < listDiasAtras.length; j++){
		var days = parseInt(listDiasAtras[j].innerHTML);
		if(days < 0){
			listDiasAtras[j].innerHTML = 0;
		}
	}

	// var totalreg = document.getElementsByClassName('count').length;
	// console.log(totalreg)


});

 function difdias( date1, date2 ) {
  //Get 1 day in milliseconds
  var one_day=1000*60*60*24;

  // Convert both dates to milliseconds
  var date1_ms = date1.getTime();
  var date2_ms = date2.getTime();

  // Calculate the difference in milliseconds
  var difference_ms = date2_ms - date1_ms;
    
  // Convert back to days and return
  return Math.round(difference_ms/one_day); 
}

// function abonoBack(){

// 	var list = document.getElementsByClassName('abono');

// 		for(var i = 0; i < list.length; i++){
// 			var ab = list[i].getAttribute('data-abono') ;
// 			if(ab>0){
// 				list[i].style.backgroundColor = 'red';
// 			}
// 		}
// };


// window.onload = abonoBack();