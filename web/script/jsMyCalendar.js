$(document).ready(function(){
	fn_hours_assigned();
	fn_go_ot_calendar();
	fn_dates_vcto();
	fn_go_ot_calendar_vcto();
	fn_change_week();
	fn_hide_rows_calendar();
	fn_cal_filter_priority();
	fn_cal_filter_proyect();
	fn_cal_filter_resp();

	/*$("#btn-mycalendar-ot").click(function(){
		var session = $("#globalSession").val();
		var login = $("#globalLogin").val();
		location.href="/4DACTION/mycalendarOT/l/all/all/all";
	});*/

	$("#btn-view-monthly").click(function(){
		var session = $("#globalSession").val();	
		location.href="/4DACTION/viewMonthly";
	});

	$("#btn-view-weekly").click(function(){
		var session = $("#globalSession").val();
		var login = $("#globalLogin").val();
		location.href="/4DACTION/mycalendarOT/l/"+login+"/all/all";
	});

	$(".column-ots").click(function(){
		var idOt = $(this).attr("id");
		var session = $("#globalSession").val();
		location.href="/ot.shtml?i="+idOt+"&r="+Math.random();
		//location.href="/4DACTION/ot/"+session+"/e/"+idOt;		
	});

	fn_filter_calendar_monthly();
	
});

function fn_filter_calendar_monthly(){
	$(".cal-filtros-all-mensual").change(function(){	
		var resp = $("#mesual-rep").val();
		var mes = $("#mesual-mes").val();
		var ano = $("#mesual-ano").val();		
		$.get("/filterCalendarMonthly/"+resp+"/"+mes+"/"+ano, function(data){						
	   	$('#content-list-ot-monthly').html(data);
		});
	});	
}

function fn_hours_assigned(){
	$('.hours-assigned').each(function(index){
		var thisAux = $(this);
		var getTitle = $(this).attr("title");
		var getArray = getTitle.split(":");
		var fecha = getArray[0];
		var hora = getArray[1];		
		var login = $("#cal-filters-resp").val();
		var priority = $("#cal-filter-priority").val();
		var valNv = $("#cal-filter-proyect").val();
		$.get("/hoursAssignedCal/"+fecha+"/"+hora+"/"+login+"/"+priority+"/"+valNv, function(data){						
	   		if(data!=0){	   								
  				$(thisAux).html(data); 
  				fn_go_ot_calendar();  					
  			}
		});
	});	
}

function fn_go_ot_calendar(){
	$('.hours-on').click(function(index){
		var session = $("#globalSession").val();
		var idOt = $(this).attr("title");
		location.href="/ot.shtml?i="+idOt+"&r="+Math.random();
		//location.href="/4DACTION/ot/"+session+"/e/"+idOt;
	});	
}

function fn_go_ot_calendar_vcto(){
	$('.hours-on-vcto').click(function(index){
		var session = $("#globalSession").val();
		var idOt = $(this).attr("title");
		location.href="/ot.shtml?i="+idOt+"&r="+Math.random();
		//location.href="/4DACTION/ot/"+session+"/e/"+idOt;
	});
}

function fn_dates_vcto(){
	$('.hours-assigned-vcto').each(function(index){
		var thisAux = $(this);
		var getTitle = $(this).attr("title");
		var getArray = getTitle.split(":");
		var fecha = getArray[0];
		var hora = getArray[1];
		var login = $("#cal-filters-resp").val();
		var priority = $("#cal-filter-priority").val();
		var valNv = $("#cal-filter-proyect").val();
		$.get("/datesVctoOt/"+fecha+"/"+hora+"/"+login+"/"+priority+"/"+valNv, function(data){						
	   		if(data!=0){	   								
  				$(thisAux).html(data);
  				fn_go_ot_calendar_vcto();	
  			}
		});
	});	
}

function fn_change_week(){
	$("#link-previous-week").click(function(){		
		var date = $(this).attr("rel");		
		$.get("/showcalendar/"+date+"/previous", function(data){			
			$("#container-all-calendar").html(data);
			fn_change_week();
			fn_hide_rows_calendar();
			fn_hours_assigned();
			fn_dates_vcto();			
		});	
	});

	$("#link-current-week").click(function(){		
		var date = "";		
		$.get("/showcalendar/"+date+"/current", function(data){			
			$("#container-all-calendar").html(data);
			fn_change_week();
			fn_hide_rows_calendar();
			fn_hours_assigned();
			fn_dates_vcto();			
		});	
	});	

	$("#link-next-week").click(function(){		
		var date = $(this).attr("rel");		
		$.get("/showcalendar/"+date+"/next", function(data){				
			$("#container-all-calendar").html(data);
			fn_change_week();
			fn_hide_rows_calendar();
			fn_hours_assigned();
			fn_dates_vcto();			
		});
	});
}

function fn_hide_rows_calendar(){
	$(".table-format-2 .hide").hide();
	$(".table-format-2 .show").show();
}

function fn_cal_filter_resp(){
	$('#cal-filters-resp').change(function(){
		var valResp = $(this).val();
		var globalSession = $("#globalSession").val();
		var valPriority = $("#cal-filter-priority").val();		
		var valNv = $("#cal-filter-proyect").val();
		location.href="/4DACTION/mycalendarOT/n/"+valResp+"/"+valPriority+"/"+valNv;		
	});
}

function fn_cal_filter_priority(){
	$('#cal-filter-priority').change(function(){
		var globalSession = $("#globalSession").val();
		var valPriority = $(this).val();
		var valResp = $("#cal-filters-resp").val();
		var valNv = $("#cal-filter-proyect").val();
		location.href="/4DACTION/mycalendarOT/n/"+valResp+"/"+valPriority+"/"+valNv;		
	});
}

function fn_cal_filter_proyect(){
	$('#cal-filter-proyect').change(function(){
		var globalSession = $("#globalSession").val();
		var valPriority = $("#cal-filter-priority").val();
		var valResp = $("#cal-filters-resp").val();
		var valNv = $(this).val();
		location.href="/4DACTION/mycalendarOT/n/"+valResp+"/"+valPriority+"/"+valNv;		
	});
}