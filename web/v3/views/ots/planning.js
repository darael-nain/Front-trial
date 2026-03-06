
var refreshPlanned = function(data){
	var tabla = $('iframe').contents().find('.content-planner > table');
	tabla.find('tbody > tr > td > span').not('[data-idplan="0"]').remove("*");

	var resumen = $('iframe').contents().find('section.resumen-timesheet');
	resumen.find('article[data-info="timesheet"] ul:eq(0) li:eq(0) > span').text(data.hours_worked_week+" Hrs. ("+data.hours_worked_week_percent+"%)");
	resumen.find('article[data-info="timesheet"] ul:eq(0) li:eq(1) > span').text(data.hours_week+" Hrs. ("+data.hours_week_percent+"%)");
	resumen.find('article[data-info="timesheet"] ul:eq(1) li:eq(0) > span').text(data.hours_worked_month+" Hrs. ("+data.hours_worked_month_percent+"%)");
	resumen.find('article[data-info="timesheet"] ul:eq(1) li:eq(1) > span').text(data.hours_month+" Hrs. ("+data.hours_month_percent+"%)");

	$.each(data.rows, function(key, item){
		var obj = tabla.find('tbody > tr[data-id="'+item.idot+'"] > td[data-fecha="'+item.fecha+'"]');						
		if (item.all_day) {
			obj.append('<span data-allday="" data-idplan="'+item.id+'" class="'+item.prioridad+'">Todo el día ( '+item.total_hrs_plan+' hrs.)</span>');
		}else{
			obj.append('<span data-idplan="'+item.id+'" class="'+item.prioridad+'">'+item.de+' - '+item.a+' ( '+item.total_hrs_plan+' hrs.)</span>');
		}							
	});

	$.each(data.trabajadas, function(key, item){
		tabla.find('tbody > tr[data-id="'+item.idot+'"] > td[data-trabajadas]').text(item.hrs);
	});

	$('iframe')[0].contentWindow.worked_counter();

	tabla.find('tbody > tr > td[data-days] span').click(function(event){		
		var container = $(this);
		var idot = container.closest('tr').data('id');
		var idPlan = container.data('idplan');									
		var data = "id="+idPlan+"&idot="+idot+"&status=edit";
		window.parent.unaBase.loadInto.dialog('/v3/views/ots/planning_v3.shtml?'+data, 'HORAS TRABAJADAS', 'small');
		event.stopPropagation();
	});	
}

var deletePlanned = function(){
	$('button[name="timesheet[delete]"]').click(function(){
		
		var datePrev = $('iframe').contents().find('.change-weeks > a[data-week="previous"]').data('date');
		var dateNext = $('iframe').contents().find('.change-weeks > a[data-week="next"]').data('date');
		var assigned = $('iframe').contents().find('#search-form-planner').find('select[name="search[assigned]"]').val();

		var target = $(this);
		var params = $("#frmPlanner").serialize();
		confirm("Está seguro(a) de eliminar la planificación?").done(function(data) {
		    if (data) {
		    	var obj = {
					"timesheet[set_type]": "delete",
					"timesheet[dateFrom]": datePrev,
					"timesheet[dateUntil]": dateNext,
					"timesheet[assigned]": assigned
				};
				var objFinal = $.extend({}, obj, $.unserialize(params));
				$.ajax({
				   	url: '/4DACTION/_V3_set_time_planner_by_ot',
				    data: objFinal,
				    dataType:'json',
				    success:function(data){
						if (data.success) {
							toastr.success('Se quitó la planificación exitosamente!');
							refreshPlanned(data);
							$(target).closest('.ui-dialog-content').dialog('close');					
						}else{				
							toastr.error('Error al tratar de eliminar. Intente nuevamente!', 'Error');
						}									
				    }
				});	       
		    }
		});
	});	
}

var savePlanned = function(){
	$('button[name="timesheet[save]"]').click(function(){
		//var params = $("#frmPlanner").serialize();
		var params = decodeURIComponent($("#frmPlanner").serialize());		

		var datePrev = $('iframe').contents().find('.change-weeks > a[data-week="previous"]').data('date');
		var dateNext = $('iframe').contents().find('.change-weeks > a[data-week="next"]').data('date');
		var assigned = $('iframe').contents().find('#search-form-planner').find('select[name="search[assigned]"]').val();
		
		var target = $(this);
		var dateFrom = $('input[name="timesheet[start_date]"]').val();
		var dateTo = $('input[name="timesheet[end_date]"]').val();
		var starHours = $('input[name="timesheet[start_time]"]').val();
		var endHours = $('input[name="timesheet[end_time]"]').val();
		if (dateFrom > dateTo) {
			toastr.warning('FECHA INICIO SUPERA LA FECHA TERMINO.');
		}else{
			if (starHours!="00") {
				if (starHours > endHours && endHours!="00") {
					toastr.warning('HORA INICIO SUPERA LA HORA TERMINO.');
					$('input[name="time[star_hours]"]').focus();
				}else{
					var obj = {						
						"timesheet[dateFrom]": datePrev,
						"timesheet[dateUntil]": dateNext,
						"timesheet[assigned]":assigned
					};

					var objFinal = $.extend({}, obj, $.unserialize(params));
					$.ajax({
						url: '/4DACTION/_V3_set_time_planner_by_ot',
						data: objFinal,
						dataType: 'json',
						type: 'POST'
					}).done(function(data){						
						if (data.success) {
							if (data.err==0) {
								toastr.success('LA PLANIFICACIÓN SE GUARDÓ EXISTOSAMENTE');
								refreshPlanned(data);		
								$(target).closest('.ui-dialog-content').dialog('close');					
							}else{
								if (data.err == 1) {
									toastr.warning('NO QUEDAN HORAS DISPONIBLES A PLANIFICAR');
								}
								if (data.err == 2) {
									toastr.warning('EL RANGO DE HORA YA SE ENCUENTRA ASIGNADA PARA EL MISMO');
								}													
							}					
						}else{				
							toastr.error('AL GUARDAR. INTENTE NUEVAMENTE', 'ERROR');
						}					
					});
				}				
			}else{
				toastr.warning('DEBE INGRESAR AL MENOS LA HORA DE INICIO.');
				$('input[name="time[star_hours]"]').focus();
			}
		}		
	});
}

$(document).ready(function(){

	// setting buttons
	$('.popup-planner .days button').button({icons:{primary:"ui-icon-plus"}},{text:false});
	$('button[name="timesheet[delete]"]').button({icons:{primary:"ui-icon-trash"}},{text:false});
	$('button[name="timesheet[save]"]').button({icons:{primary:"ui-icon-disk"}},{text:true});	
	$('.calendar-from, .calendar-until').button({
		text: true,
		icons: {
			primary: 'ui-icon-calendar'
		}
	}).click(function() {
		$('[name="calendar[desde-hasta]"]').datepicker('show');			
	});

	// setting calendars
	$.datepicker.setDefaults($.datepicker.regional["es"]);
	$(".datepicker").datepicker({
		showButtonPanel: true,
		minDate: $('input[name="timesheet[fechaDesdeCalendar]"]').val(),
		maxDate: $('input[name="timesheet[fechaHastaCalendar]"]').val()					
	});

	// Habilita boton para eliminar
	$('button[name="timesheet[delete]"]').hide();
	var idplan = parseFloat($('input[name="timesheet[id_plan]"]').val());
	if (idplan>0) {
		$('button[name="timesheet[delete]"]').show();
	}



	// Habilita todo el día
	var allday = $('input[name="timesheet[all_day]"]');
	if (allday.prop('checked')) {
		$('input[data-types="times"]').hide();
	}

	$('input[name="timesheet[all_day]"]').click(function(){		
		if ($(this).prop('checked')) {
			$('input[data-types="times"]').hide();
		}else{
			$('input[data-types="times"]').show();
		}		
	});
	
	savePlanned();
	deletePlanned();
});


/*setTimeout(function() {
	// Popup changes title	
	var state = $('input[name="planner[estado]"]').val().toUpperCase();
	var resp = $('input[name="planner[responsable]"]').val().toUpperCase();
	var folio = $('input[name="planner[folio]"]').val().toUpperCase();
	$('.ui-dialog-titlebar .ui-dialog-title').text("Planificación Orden de Trabajo #"+folio+" / Estado: "+state+" / Resp: "+resp);

	// Enables and disables objects	
	if (state=="ATRASADA" || state=="CERRADA" || state=="ANULADA") {
		$('select, input, button[name="planner[save]').attr("disabled","disabled");
	}				
}, 10);	*/