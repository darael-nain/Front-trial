$(document).ready(function(){
  fn_years(); 
	fn_reloj();
	fn_update_visitas(); 
  fn_cantidad_reg();  
  fn_filters_all();
  fn_pop_visit();

  $('#search-number-vt').keyup(function() {
      var nroVt = $(this).val();    
      $.get("/porNroUpdateVisitas/"+nroVt, function(data){       
          $('#box').html(data);
          fn_cantidad_reg();
          fn_pop_visit();
      });
  });

  $('#search-number-vt').change(function() {
      var nroVt = $(this).val();    
      $.get("/porNroUpdateVisitas/"+nroVt, function(data){       
          $('#box').html(data);
          fn_cantidad_reg();
          fn_pop_visit();
      });
  });

});

function fn_reloj(){   
   	var momentoActual = new Date(); 
   	var hora = String(momentoActual.getHours());
   	var minuto = String(momentoActual.getMinutes()); 
   	var segundo = String(momentoActual.getSeconds());
   
    if(hora.length==1){
      hora = "0"+hora;
    }
    if(minuto.length==1){
      minuto = "0"+minuto;
    }
    if(segundo.length==1){
      segundo = "0"+segundo;
    }

   	var horaImprimible = hora+ " : " + minuto+ " : " + segundo;
   	$('#spanreloj').text(horaImprimible);
   	setTimeout("fn_reloj()",1000);
}

function fn_cantidad_reg(){ 
  var cant = $(".reg").length; 
  $(".cant").text("Cantidad : "+cant); 
}

function fn_update_visitas(){ 
  fn_filters();
	setTimeout("fn_update_visitas()",15000);
}

/*function fn_filters_states(){ 
  $("#filters-state").change(function(){   
    fn_filters();
  });
}

function fn_filters_tecnicos(){ 
  $("#filters-tecnico").change(function(){   
    fn_filters();
  });
}

function fn_filters_month(){ 
  $("#filters-month").change(function(){   
    fn_filters();
  });
}*/

function fn_filters_all(){ 
  $(".filters-all").change(function(){   
    fn_filters();
  });
}

function fn_filters(){ 
  var states = $("#filters-state").val();
  var tecnico = $("#filters-tecnico").val();
  var month = $("#filters-month").val();
  var year = $("#filters-year").val();
  $.get("/updateVisitas/"+states+"/"+tecnico+"/"+month+"/"+year, function(data){        
    $('#box').html(data);
    fn_cantidad_reg();
    fn_pop_visit();
  });
}

function fn_years(){  
  var currentDate = new Date();
  var from = 2012;
  var to = currentDate.getFullYear(); 
  var cadena = "<option selected='selected' value='"+to+"'>"+to+"</option>";
  for (i=to; i>=from; i--){
    if(i!=to){
       cadena = cadena + "<option value="+i+">"+i+"</option>";
     }   
  }
  $("#filters-year").html(cadena);
}

function fn_pop_visit(){ 
  $(".reg").click(function(){   
    //alert(this.id);
    //alert("hola! :)");
  });
}

