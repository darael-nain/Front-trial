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

var loadOts = function(data) {
	var target = $('#main-container > article .items tbody');
	$('#main-container > article .items tfoot > tr > td:first-of-type').text("Registros encontrados "+data.total);
	target.find("*").remove();
	var htmlObject;
	var total_horas = 0;
	var total_horas_reales = 0;
	$.each(data.rows, function(key, item) {

		var estado = "";
		if (item.estado == "PENDIENTE") {
			estado = '<td class="verde">'+ item.estado +'</td>';
		}
		if (item.estado == "CERRADA") {
			estado = '<td class="azul">'+ item.estado +'</td>';
		}
		if (item.estado == "ATRASADA") {
			estado = '<td class="rojo">'+ item.estado +'</td>';
		}
		if (item.estado == "ANULADA") {
			estado = '<td class="gris">'+ item.estado +'</td>';
		}

		var estilo = '';
		var validada = '';
		if (item.validated) {
			validada = '<td class="verde">Sí</td>';
			estilo = 'style="border-left:4px solid green"';
		} else {
			validada = '<td class="rojo">No</td>';
			estilo = 'style="border-left:4px solid red"';
		}

		var notificado = "";
		if (!item.notificado) {
			notificado = '<span class="punto-notificado" title="Por notificar"></span>';
		}

		var folioNegocio = "";
		if (item.folio_negocio > 0) {
			folioNegocio = "["+item.folio_negocio+"] ";
		}

		htmlObject = $('<tr data-id="'+item.id+'" '+estilo+'>'+
	        '<td>'+notificado+item.folio+'</td>' +
			'<td>'+item.fecha_inicio+' '+item.hora_inicio+'</td>' +
			'<td>'+item.fecha_vcto+' '+item.hora_vcto+'</td>' +
			'<td class="dates-final">'+item.fecha_final+' '+item.hora_final+'</td>' +
			'<td>'+item.horas+'</td>' +
			'<td>'+item.horas_reales+'</td>' +
			'<td class="left">'+item.cliente+'</td>' +
			'<td class="left">'+folioNegocio+item.origen+'</td>' +
			'<td class="left">'+item.referencia+'</td>' +
			'<td>'+item.area+'</td>' +
			'<td>'+item.motivo+'</td>' +
			'<td>'+item.responsable+'</td>' +
			'<td>'+item.emisor+'</td>' +  estado +
			'</tr>');

		if (item.estado != "anulada") {
			total_horas += parseFloat(item.horas.replace(',', '.'));
			total_horas_reales += parseFloat(item.horas_reales.replace(',', '.'));
		}

		htmlObject.click(function(){
			if (g_uso_tareas_easy) {
				var sid = '';
				$.each($.cookie(),function(clave, valor) { if (clave == hash && valor.match(/UNABASE/g)) sid = valor; });
				window.open('http://'+nodejs_public_ipaddr + ':' + nodejs_port + '/tareas/' + item.id);
			}else{
				window.open('/ot.shtml?i='+item.id);
			}
		});

		target.append(htmlObject);

		if(!show_dates_final){
			htmlObject.find('.dates-final').hide();
		}

	});
	/*$('#main-container > article .items tfoot').find('td.horas').html(total_horas);
	$('#main-container > article .items tfoot').find('td.horas_reales').html(total_horas_reales);*/
	$('#main-container > article .items tfoot').find('td.horas').html(Math.round(total_horas*100)/100);
	$('#main-container > article .items tfoot').find('td.horas_reales').html(Math.round(total_horas_reales*100)/100);
};

var getOts = function(){
	$.ajax({
		url: '/4DACTION/_V3_getOts',
		data: $("#search-form-ots").serialize(),
		dataType: 'json',
		async:false,
		success: function(data) {
			loadOts(data);
		}
	});
}

$(document).ready(function(){
	// Inicializar botones
	$('button').button();
	$('.boton').button();

	$('.create').button({icons:{primary:"ui-icon-document"}},{text:true});
	$('.calendar').button({icons:{primary:"ui-icon-calendar"}},{text:true});
	$('.download').button({icons:{primary:"ui-icon-circle-arrow-s"}},{text:true});
	$('.go').button({icons:{primary:"ui-icon-arrowthick-1-ne"}},{text:true});

	$('.btn-planiar').button({icons:{primary:"ui-icon-gear"}},{text:false});
	$('.a-participantes').button({icons:{primary:"ui-icon-plus"}},{label:"Participantes"});
	$('.a-invitados').button({icons:{primary: "ui-icon-plus"}},{label:"Invitados"});
	$( ".agrandar-text" ).button({icons: {primary: "ui-icon-plus"},text: false});
	$( ".reducir-text" ).button({icons: {primary: "ui-icon-minus"},text: false});
	$('.dialog-confirm').hide();

	$('.export').button({icons:{primary:"ui-icon-calculator"}},{text:true});

	getOts();

	$('.combinadas').on("change keyup",function(){
		getOts();
	});

	$('.export').click(function(){
		
		var sid = '';
		$.each($.cookie(),function(clave, valor) { if (clave == hash && valor.match(/UNABASE/g)) sid = valor; });
		var modulo = "OT"
		var url = ""
		var filters = $('#search-form-ots').serializeAnything(true);

		url = nodeUrl + '/export-list-ot/?download=true&sid=' + encodeURIComponent(sid) + '&' + filters+ "&hostname=" + window.location.origin;;
		// url = 'http://' + nodejs_public_ipaddr + ':' + nodejs_port + '/export-list-ot/?download=true&sid=' + encodeURIComponent(sid) + '&' + filters;
		unaBase.log.save('Ha exportado el listado de órdenes de trabajo', 'ot');

		var download = window.open(url);
		download.blur();
		window.focus();

	});

	$('.export_monthly_report').click(function(){

		var sid = '';
		$.each($.cookie(),function(clave, valor) { if (clave == hash && valor.match(/UNABASE/g)) sid = valor; });
		var modulo = "OT"
		var url = ""
		var filters = $('#search-form-ots').serializeAnything(true);

		url = nodeUrl + '/export-monthly-report/?download=true&sid=' + encodeURIComponent(sid) + '&' + filters + "&hostname=" +  window.location.origin;
		// url = 'http://' + nodejs_public_ipaddr + ':' + nodejs_port + '/export-monthly-report/?download=true&sid=' + encodeURIComponent(sid) + '&' + filters;
		unaBase.log.save('Ha exportado el reporte mensual de órdenes de trabajo', 'ot');

		var download = window.open(url);
		download.blur();
		window.focus();

	});

    // se actualiza cada minuto
    setInterval(getOts, 30000);

});
