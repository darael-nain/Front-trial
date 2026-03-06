function preguntoFecha(){	
	$.get('http://server3.una.cl:8080/4DSCRIPT/xhr3', function(data) {
  		$('#res').html(data);
  		alert('Load was performed.');
	});
}