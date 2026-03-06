$(document).ready(function(){
	//fn_dialog_notificar();
	$("#dialog-modal").hide();
	$("#dialog-modal2").hide();
    $("#dialog-modal3").hide();
    $("#dialog-modal_notify_oc").hide();   
});

function fn_dialog_notificar_oc()
{
    $( "#dialog:ui-dialog" ).dialog( "destroy" );
    $( "#dialog-modal_notify_oc" ).dialog({
        height: 250,
        modal: true,
        width: 460
    }); 

    $('#lost-focus').blur();    
}

function fn_dialog_notificar()
{
	$( "#dialog:ui-dialog" ).dialog( "destroy" );
    $( "#dialog-modal" ).dialog({
        height: 300,
        modal: true,
        width: 460
    });	

    $('#lost-focus').blur();    
}

function fn_dialog_crear_prov(id)
{
	
    $("#id_fila").val(id);

    //alert(id);
    $( "#dialog:ui-dialog" ).dialog( "destroy" );
    $( "#dialog-modal2" ).dialog({
        height: 310,
        modal: true,
        width: 400
    });	

    $("#status").html("");

    $("#alias-np").val("");
    $("#rut-np").val("");
    $("#dv-np").val("");
    $("#razon-np").val("");
    $("#giro-np").val("");
		
}

function fn_dialog_notificar_neg()
{
    $( "#dialog:ui-dialog" ).dialog( "destroy" );
    $( "#dialog-modal3" ).dialog({
        height: 350,
        modal: true,
        width: 460
    }); 

    $('#lost-focus').blur();
    $('#paranotneg').blur();
}