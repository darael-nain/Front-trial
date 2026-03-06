
$(document).ready(function(){
	$('#bg-preferences').hide();
  $('#bg-ver-planner').hide(); 
});

function openLightBox(back,modal,anchoModal,altoModal){
  var idBack = "#"+back;
  var idModal = "#"+modal;

  //abre fondo del LightBox
  $(idBack).show()
   $(idModal).show()

  //obtenemos ancho y alto de la ventana del explorer
  var wscr = $(window).width();
  var hscr = $(window).height();
  
  //establecemos las dimensiones del fondo
  $(idBack).css("width", wscr);
  $(idBack).css("height", hscr);
   
  //estableciendo tamano de la ventana modal
  $(idModal).css("width", anchoModal+'px');
  $(idModal).css("height", altoModal+'px');

  //redimensionamos para que se ajuste al centro y mas
  resizeLightBox(back,modal,anchoModal,altoModal);
}

function resizeLightBox(back,modal,anchoModal,altoModal){
  var idBack = "#"+back;
  var idModal = "#"+modal;

  var wscr = $(window).width();
  var hscr = $(window).height(); 
  
  //estableciendo dimensiones de fondo
  $(idBack).css("width", wscr);
  $(idBack).css("height", hscr); 
     
  //estableciendo tamano de la ventana modal
  $(idModal).css("width", anchoModal+'px');
  $(idModal).css("height", altoModal+'px');
 
  //obtiendo tamano de la ventana modal
  var wcnt = $(idModal).width();
  var hcnt = $(idModal).height();   
    
  //obtener posicion central
  var mleft = ( wscr - wcnt ) / 2;
  var mtop = ( hscr - hcnt ) / 2;
   
  // estableciendo ventana modal en el centro
  $(idModal).css("left", mleft+'px');
  $(idModal).css("top", mtop+'px');

  //$(".box-lightBox").css("width", anchoModal-5+'px');
  //$(".box-lightBox").css("height", altoModal-15+'px'); 
  
}

function closeLightBox(back,modal){
  var idBack = "#"+back;
  var idModal = "#"+modal;
  $(idBack).fadeOut("fast",function(){
     $(idModal).hide();
  });
}

