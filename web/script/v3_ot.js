(function($){
	$.unserialize = function(serializedString){
		var str = decodeURI(serializedString);
		var pairs = str.split('&');
		var obj = {}, p, idx, val;
		for (var i=0, n=pairs.length; i < n; i++) {
			p = pairs[i].split('=');
			idx = p[0];
 
			if (idx.indexOf("[]") == (idx.length - 2)) {
				// Eh um vetor
				var ind = idx.substring(0, idx.length-2)
				if (obj[ind] === undefined) {
					obj[ind] = [];
				}
				obj[ind].push(p[1]);
			}
			else {
				obj[idx] = p[1];
			}
		}
		return obj;
	};
})(jQuery);

$(document).ready(function(){
	// Inicializar botones
	$('button').button();
	$('.boton').button();	
	$('.a-participantes').button({icons:{primary:"ui-icon-plus"}},{label:"Participantes"});
	$('.a-invitados').button({icons:{primary: "ui-icon-plus"}},{label:"Invitados"});
	$( ".agrandar-text" ).button({icons: {primary: "ui-icon-plus"},text: false});
	$( ".reducir-text" ).button({icons: {primary: "ui-icon-minus"},text: false});	
	$('.dialog-confirm').hide();

	// Open popup preferences
	$("#preferences").click(function(){
		preferences();
	});

	// Cargar ots según busquedas.
	$('.combinadas').on('change keyup', function() {
		var loadOts = function(data) {			
			var target = $('#main-container > article .items tbody');		
			target.find("*").remove();
			var htmlObject;
			$.each(data.rows, function(key, item) {				
				var estado = ""
				if (item.estado=="pendiente") {
					estado = '<td class="verde">'+item.estado+'</td>';
				}
				if (item.estado=="cerrada") {
					estado = '<td class="azul">'+item.estado+'</td>';
				}
				if (item.estado=="atrasada") {
					estado = '<td class="rojo">'+item.estado+'</td>';
				}
				if (item.estado=="anulada") {
					estado = '<td class="gris">'+item.estado+'</td>';
				}

				var notificado = "";
				if (!item.notificado) {
					notificado = '<span class="punto-notificado" title="Por notificar"></span>';
				}				

				htmlObject = $('<tr data-id="'+item.id+'">'+
							'<td>'+notificado+item.folio+'</td>' +
							'<td>'+item.fecha_emision+'</td>' +
							'<td>'+item.fecha_vcto+'</td>' +
							'<td>'+item.hora_vcto+'</td>' +
							'<td>'+item.horas+'</td>' +
							'<td class="left">'+item.cliente+'</td>' +
							'<td class="left">'+item.origen+'</td>' +
							'<td class="left">'+item.referencia+'</td>' +
							'<td>'+item.responsable+'</td>' +
							'<td>'+item.emisor+'</td>' + estado +						
							'</tr>');
				htmlObject.click(function(){
					window.open('/ot.shtml?i='+item.id);
				});
				target.append(htmlObject);
			});			
		};

		$.ajax({
			url: '/4DACTION/_V3_getOts',
			dataType: 'json',
			async: false, // para que no avance hasta que la llamada se complete
			cache: false,
			data: $.unserialize($('#search-form-ots').serialize()),
			success: loadOts
		});

	}).triggerHandler("change").triggerHandler("keyup");	

});

var preferences = function(){
	var id = 0;
	window.parent.unaBase.loadInto.dialog('/v3/views/ots/preferences.shtml?id=' + id, 'Preferencias', 'medium');
}