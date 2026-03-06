
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

var worked_counter = function(){
	var iframe_jquery = $("<iframe>");
	var iframe = iframe_jquery.get(0);
	if (iframe){
	   
	}
	var sumaTotal = 0;
	for (var i = 1; i < 8; i++) {
		var sumaDias = 0;
		$('.content-planner > table > tbody > tr > td[data-days="'+i+'"]').each(function(){
			
			var valor = $(this).find('span[data-idplan] strong').text();
			if (valor=="") {
				valor = 0;
			}
			sumaDias = sumaDias + parseFloat(valor);				
		});
		$('.content-planner > table > thead > tr > th[data-days="'+i+'"] strong').text(sumaDias);
		$('.infografia strong').text(sumaTotal);
	}	
}

var timesheet_get = function(){
	var target = $('.change-weeks');
	var dateFrom = target.find('a[data-week="previous"]').data('date');
	var dateUntil = target.find('a[data-week="next"]').data('date');
	var assigned = $('#search-form-planner').find('select[name="search[assigned]"]').val();	
	$.ajax({
		url: '/4DACTION/_V3_ot_get_planned_week',
		data: {
			"from":dateFrom,
			"until":dateUntil,
			"assigned": assigned
		},
		dataType: 'json',
		async:false,
		success: function(data) {
			var resumen = $('section.resumen-timesheet');
			resumen.find('article[data-info="timesheet"] ul:eq(0) li:eq(0) > span').text(data.hours_worked_week+" Hrs. ("+data.hours_worked_week_percent+"%)");
			resumen.find('article[data-info="timesheet"] ul:eq(0) li:eq(1) > span').text(data.hours_week+" Hrs. ("+data.hours_week_percent+"%)");
			resumen.find('article[data-info="timesheet"] ul:eq(1) li:eq(0) > span').text(data.hours_worked_month+" Hrs. ("+data.hours_worked_month_percent+"%)");
			resumen.find('article[data-info="timesheet"] ul:eq(1) li:eq(1) > span').text(data.hours_month+" Hrs. ("+data.hours_month_percent+"%)");
			$.each(data.rows, function(key, item){					
				var obj = $('.content-planner > table > tbody > tr[data-id="'+item.idot+'"] > td[data-fecha="'+item.fecha+'"]');						
				if (item.all_day) {
					obj.append('<span data-allday="" data-idplan="'+item.id+'" class="'+item.prioridad+'">Todo el día ( <strong>'+item.total_hrs_plan+'</strong> hrs.)</span>');
				}else{
					obj.append('<span data-idplan="'+item.id+'" class="'+item.prioridad+'">'+item.de+' - '+item.a+' ( <strong>'+item.total_hrs_plan+'</strong> hrs.)</span>');
				}					
			});
			worked_counter();	
		}
	});
}

var timesheet_settings = function(){
	
	// Set today
	var table = $('.content-planner > table');
	var today = table.data('today');
	table.find('thead > tr > th[data-date="'+today+'"]').addClass("current");

	// Set show weeks
	var startWeek = parseInt(table.data('startweek'));
	var endWeek = parseInt(table.data('endweek'))+1;	
	table.find('thead > tr > th[data-days], tbody > tr > td[data-days]').hide();	
	for (var i = startWeek; i < endWeek; i++) {	
		table.find('thead > tr > th[data-days="'+i+'"], tbody > tr > td[data-days="'+i+'"]').show();
	}
}

var timesheet_load = function(changeWeeks, dateWeeks){
	var searching = $("#search-form-planner").serialize(); 
	var obj = {
		"timesheet[change_weeks]": changeWeeks,
		"timesheet[date_weeks]": dateWeeks			
	};	
	var objFinal = $.extend({}, obj, $.unserialize(searching));
	$.ajax({		
		url:'/ajax/week_planner.shtml',
		data: objFinal,
		dataType:'html',
		async:false,
		success: function(data) {
			$('.container-timesheet').html(data);
			timesheet_get();
			timesheet_change_weeks();
			timesheet_create();
			timesheet_edit();
			timesheet_settings();
		}
	});	
}

var timesheet_create = function(){
	$('.content-planner > table > tbody > tr > td[data-days]').click(function(event){			
		var container = $(this);
		var cantAllDay = container.find('span[data-allday]').length;
		if (cantAllDay==0) {
			var idot = container.closest('tr').data('id');
			var date = container.data('fecha');
			var idPlan = 0;
			var data = "id="+idPlan+"&idot="+idot+"&status=new&date="+date;
			window.parent.unaBase.loadInto.dialog('/v3/views/ots/planning_v3.shtml?'+data, 'HORAS TRABAJADAS', 'small');
		}else{
			window.parent.toastr.warning('Ya existe un registro por todo el día.');
		}
		event.stopImmediatePropagation();
	});
}

var timesheet_edit = function(){	
	$('.content-planner > table > tbody > tr > td[data-days] span').click(function(event){		
		var container = $(this);
		var idot = container.closest('tr').data('id');
		var idPlan = container.data('idplan');
		if (parseFloat(idPlan)>0) {
			var data = "id="+idPlan+"&idot="+idot+"&status=edit";
			window.parent.unaBase.loadInto.dialog('/v3/views/ots/planning_v3.shtml?'+data, 'HORAS TRABAJADAS', 'small');
		}		
		event.stopPropagation();	
	});
}

var timesheet_change_weeks = function(){
	$('.change-weeks > a').click(function(){
		var changeWeeks = $(this).data('week');
		var dateWeeks = $(this).data('date');
		timesheet_load(changeWeeks, dateWeeks);
		return false;
	});	
}


$(document).ready(function(){

	// Settings
	$('button, .boton').button();	
	$('.settings').button({icons:{primary:"ui-icon-gear"}},{text:true});
	$('.boton.exportar, .temp, .holiday').hide();

	$('.settings').click(function(){
		window.parent.unaBase.loadInto.dialog('/v3/views/ots/preferences.shtml', 'AJUSTES', 'small');
	});
			
	// timesheet actions
	timesheet_load('current','00-00-0000');
	timesheet_create();
	timesheet_edit();
	timesheet_change_weeks();

	$('[data-search="true"]').change(function(){
		timesheet_load('current','00-00-0000');
	});

});