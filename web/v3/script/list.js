/* 
		<!-- Simon Gomes UnaBase may/2017 --> */
// TOMA EL TITLE DE LA PAGINA Y LE RECORTA "UnaBase - BASE DESARROLLO"
// var pagetitle = $(document).find("titlef").text();
// // INGRESA EL TITULO EN LA LISTA
// var titleContainer = $('.maintitle');
// titleContainer.text(pagetitle);

//REMUEVE EL BREAK PARA MEJOR VISUALIZACIÓN DE LOS BOTONES CREAR Y VOLVER
var headerbox = $('header.full-height');
headerbox.find('br').remove();


// REUBICA EL TITULO DEL MODULO Y REMUEVE LOS DUPLICADOS QUE CREA EL APPENDTO
// $('.maintitle').remove();
// titleContainer.clone().appendTo(headerbox);
// for(var i = 1; i < titleContainer.length; i++){
// 	$('.maintitle')[i].remove();
// }