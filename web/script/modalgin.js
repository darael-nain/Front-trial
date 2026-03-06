var anchoModal = 600; 
var altoModal = 250;

var anchoModal2 = 800; 
var altoModal2 = 600;

var anchoModal3 = 1000; 
var altoModal3 = 1000;

$(document).ready(function(){
	$('#bgtransparent').hide();
	$('#bgtransparent2').hide();
	$('#bgtransparent3').hide();
	$('#bgtransparent-all').hide();
});

function openModal(){
  $('#bgtransparent').show()
// obtenemos ancho y alto de la ventana del explorer
  var wscr = $(window).width();
  var hscr = $(window).height();
  
  //establecemos las dimensiones del fondo
  $('#bgtransparent').css("width", wscr);
  $('#bgtransparent').css("height", hscr);
  //alert(wscr+"-"+hscr);
  
  // estableciendo tama–o de la ventana modal
   $('#bgmodal').css("width", anchoModal+'px');
   $('#bgmodal').css("height", altoModal+'px');
   resize__();
}

function resize__(){
  var wscr = $(window).width();
  var hscr = $(window).height(); 
  
  // estableciendo dimensiones de fondo
  $('#bgtransparent').css("width", wscr);
  $('#bgtransparent').css("height", hscr); 
     
  // estableciendo tamañ–o de la ventana modal
  $('#bgmodal').css("width", anchoModal+'px');
  $('#bgmodal').css("height", altoModal+'px');
 
  // obtiendo tama–o de la ventana modal
   var wcnt = $('#bgmodal').width();
   var hcnt = $('#bgmodal').height();   
    
   // obtener posicion central
   var mleft = ( wscr - wcnt ) / 2;
   var mtop = ( hscr - hcnt ) / 2;
   
   // estableciendo ventana modal en el centro
   $('#bgmodal').css("left", mleft+'px');
   $('#bgmodal').css("top", mtop+'px');
   
  // alert(mleft+" "+mtop);
}

function closeModal(){   
   $('#bgtransparent').fadeOut("fast",function(){
       $('#bgmodal').hide();
    });
}

//=============================

function openModal2(){
  $('#bgtransparent').fadeIn("fast",function(){
       $('#bgmodal').show();
  });
 
// obtenemos ancho y alto de la ventana del explorer
  var wscr = $(window).width();
  var hscr = $(window).height();
  
  //establecemos las dimensiones del fondo
  $('#bgtransparent').css("width", wscr);
  $('#bgtransparent').css("height", hscr);
  //alert(wscr+"-"+hscr);
  
  // estableciendo tama–o de la ventana modal
   $('#bgmodal').css("width", anchoModal2+'px');
   $('#bgmodal').css("height", altoModal2+'px');
   resize2__();
}

function resize2__(){
  var wscr = $(window).width();
  var hscr = $(window).height(); 
  
  // estableciendo dimensiones de fondo
  $('#bgtransparent').css("width", wscr);
  $('#bgtransparent').css("height", hscr); 
     
  // estableciendo tamañ–o de la ventana modal
  $('#bgmodal').css("width", anchoModal2+'px');
  $('#bgmodal').css("height", altoModal2+'px');
 
  // obtiendo tama–o de la ventana modal
   var wcnt = $('#bgmodal').width();
   var hcnt = $('#bgmodal').height();   
    
   // obtener posicion central
   var mleft = ( wscr - wcnt ) / 2;
   var mtop = ( hscr - hcnt ) / 2;
   
   // estableciendo ventana modal en el centro
   $('#bgmodal').css("left", mleft+'px');
   $('#bgmodal').css("top", mtop+'px');  
}

//===================================

function openModalFile(){
  $('#bgtransparent2').fadeIn("fast",function(){
       $('#bgmodal2').show();
  });
 
// obtenemos ancho y alto de la ventana del explorer
  var wscr = $(window).width();
  var hscr = $(window).height();
  
  //establecemos las dimensiones del fondo
  $('#bgtransparent2').css("width", wscr);
  $('#bgtransparent2').css("height", hscr);
  //alert(wscr+"-"+hscr);
  
  // estableciendo tama–o de la ventana modal
   $('#bgmodal2').css("width", anchoModal2+'px');
   $('#bgmodal2').css("height", altoModal2+'px');
   resizefile();
}

function resizefile(){
  var wscr = $(window).width();
  var hscr = $(window).height(); 
  
  // estableciendo dimensiones de fondo
  $('#bgtransparent2').css("width", wscr);
  $('#bgtransparent2').css("height", hscr); 
     
  // estableciendo tamañ–o de la ventana modal
  $('#bgmodal2').css("width", anchoModal2+'px');
  $('#bgmodal2').css("height", altoModal2+'px');
 
  // obtiendo tama–o de la ventana modal
   var wcnt = $('#bgmodal2').width();
   var hcnt = $('#bgmodal2').height();   
    
   // obtener posicion central
   var mleft = ( wscr - wcnt ) / 2;
   var mtop = ( hscr - hcnt ) / 2;
   
   // estableciendo ventana modal en el centro
   $('#bgmodal2').css("left", mleft+'px');
   $('#bgmodal2').css("top", mtop+'px');
}

function closeModalFile(){  
   $('#bgtransparent2').fadeOut("slow",function(){
       $('#bgmodal2').hide();
    });
}

//===================================

function openModaViewImg(data){

  $('#bgtransparent3').fadeIn();
  $('#bgmodal3').show();
  $('#bgmodal3').html(data);

  // obtenemos ancho y alto de la ventana del explorer
  var wscr = $(window).width();
  var hscr = $(window).height();

  // establecemos las dimensiones del fondo
  $('#bgtransparent3').css("width", wscr+"px");
  $('#bgtransparent3').css("height", hscr+"px");

  // estableciendo tamano de la ventana modal
  $('#bgmodal3').css("width", anchoModal3+'px');
  $('#bgmodal3').css("height", altoModal3+'px'); 
}

function resizeViewImg(anchoAux,altoAux){ 

  var wscr = $(window).width();
  var hscr = $(window).height();

  var anchoModal3x = parseInt(anchoAux)+5;
  var altoModal3x = parseInt(altoAux)+5; 

  if(anchoModal3x>wscr){
      anchoModal3x = wscr;
  }

  if(altoModal3x>hscr){
      altoModal3x = hscr;
  }
  
  // estableciendo dimensiones de fondo
  $('#bgtransparent3').css("width", wscr);
  $('#bgtransparent3').css("height", hscr); 
     
  // estableciendo tamano de la ventana modal
  $('#bgmodal3').css("width", anchoModal3x+'px');
  $('#bgmodal3').css("height", altoModal3x+'px');
 
  // obtiendo tamano de la ventana modal
  var wcnt = $('#bgmodal3').width();
  var hcnt = $('#bgmodal3').height();  

  // obtener posicion central
  var mleft = ( wscr - wcnt ) / 2;
  var mtop = ( hscr - hcnt ) / 2; 

  // estableciendo ventana modal en el centro
  $('#bgmodal3').css("left", mleft+'px');
  $('#bgmodal3').css("top", mtop+'px');
}

function closeModalViewImg(){  
   $('#bgtransparent3').fadeOut("slow",function(){
       //$('#bgmodal3').hide();
    });
}

//===================================
