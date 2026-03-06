$(document).ready(function(){

	//PAGINADOR
	/*$(function() {			
		$("#paginador-link").paginate({
			count 		: 50,
			start 		: 1,
			display     : 10,
			border					: false,
			text_color  			: '#888',
			background_color    	: '#EEE',	
			text_hover_color  		: 'black',
			background_hover_color	: '#CFCFCF'
		});			
	});
*/
	//MODULO ORDEN DE TRABAJO
	$("#primeros").hide();
	$("#ot-menoscoment").hide();	
});

//MODULO ORDEN DE TRABAJO
function fn_ot_show_primeros(){
	$("#primeros").fadeIn("slow");
	$("#ot-mascoment").hide();
	$("#ot-menoscoment").show();
}

function fn_ot_hide_primeros(){
	$("#primeros").fadeOut("slow");
	$("#ot-mascoment").show();
	$("#ot-menoscoment").hide();
}
