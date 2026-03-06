$(document).ready(function(){
	$('#loading-global').hide();	
});

function fn_open_loading(msg){
	$('#loading-global').show();
	var wscr = $(window).width();
	var hscr = $(window).height();      

	//obtiendo tamano de la ventana modal
	var wcnt = $('.cargasxxx').width();
	var hcnt = $('.cargasxxx').height();    

	var mleft = ( wscr - wcnt ) / 2;
	var mtop = ( hscr - hcnt ) / 2;	

	$('.cargasxxx p').text(msg);

	$('.cargasxxx').css("left", mleft+'px');
	$('.cargasxxx').css("top", mtop+'px');	
}

function fn_close_loading(){
	$('#loading-global').hide();
}
/*
 $('.cargasxxx').css({
           position:'absolute',
           left: ($(window).width() - $('.cargasxxx').outerWidth())/2,
           top: ($(window).height() - $('.cargasxxx').outerHeight())/2
      });*/