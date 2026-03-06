
var send_inbox = function(param){
	$.each(param.members, function(i, item){
		unaBase.inbox.send({
			to: item.login, // se indica destinatario
			subject: param.subject+' Nº '+param.folio+" / "+param.ref, // asunto del mensaje
			into: 'blank', // dónde se debe cargar el enlace de destino al hacer clic (iframe, dialog, viewport)
			href: '/ot.shtml?i='+param.id+'&r='+Math.random(), // enlace de destino
			tag: 'avisos' // etiqueta del mensaje (solicitudes, avisos, reportes)
		});
	});
};

// Si el usuario no tiene permiso para modificar, solo es posible hacer cambios si la OT está en espera de validar
var ot_refresh_permissions = function() {
	refreshAccess();
	if (!access._18 && $('#sheet-ot').data('folio') != 'S/N') {
		if ((!validated_ot && $('#scrollval ul.steps li').length > 0) || validated_ot) {
			$('#referencia-ot').prop('disabled', true); // referencia
			$('#tipo-ot').prop('disabled', true); // tipo ot
			$('#buscar-empresas-auto').prop('disabled', true); // empresa
			 // seleccionar ítems
			$('#buscar-proyectos-auto').prop('disabled', true);
			$('#items-tipo-ot').prop('disabled', true);
			$('#llave-det-nvx').prop('disabled', true);
			$('#motivo').prop('disabled', true); // motivo
			$('#hasignada').prop('disabled', true); // hora asignada
			$('#importancia').prop('disabled', true); // importancia
			$('#area-trabajo').prop('disabled', true); // área
			$('#responsables-area').prop('disabled', true); // responsables
			$('div.s-box-btns-add-part').remove(); // participantes e invitados
			$('a.delete-part-ot').remove();
			$('#idcomment-otxx').prop('disabled', true);
		}
	}
};

/*
var show_objetos = function(){
	var container = $(".sheet-ot");
	var estado = container.data("estado");
	switch (estado) {
		case 'atrasada':
			break;
		case 'pendiente':
			break;
		case 'cerrada':
			break;
		case 'anulada':
			break;
	}
}*/

$(document).ready(function(){
	// show_objetos();

	//loading settings
	var folio = $('#folioot').val();
	var htmlObject = $('#frmnuevaot > .tab_container > .tab_content > #tab-1-datos-ot');
	if (folio == "S/N") {
		htmlObject.find('.box-comment-ot').hide();
	}

	if ($('.text-notify').text() == "POR NOTIFICAR") {
		$('.text-notify').css('color', 'red');
	}else{
		$('.text-notify').css('color', 'black');
	}

	if ($('.text-status').text() == "ATRASADA") {
		$('.text-status').css('color', 'red');
	}else{
		if ($('.text-status').text() == "CERRADA") {
			$('.text-status').css('color', '#0040FF');
		}else{
			$('.text-status').css('color', 'black');
		}
	}

	if ($('#frmnuevaot input[name="TipoUsuarioConnect"]').val()=="invitado") {
		$('.delete-part-ot, #btn-subir-archivo, .set-botones, .linea-ql').hide();
	}

	// Call comment ot
	$("#btn-comment-ot").click(function(){
		var comment = $("#text-coment-ot").val();
		var idOt = $("#id-ot").val();

		if(comment!=""){
			$("#status-save-comment").show();
			$("#btn-comment-ot").attr('disabled',true);
			$("#text-coment-ot").attr('disabled',true);

			var obj = ot_save_comments({id:idOt, comment:comment});
			if (obj) {

				// send_inbox($.extend(obj, obj, {'subject':'Ha comentado la orden de trabajo'} ));
				//console.log(obj);

				toastr.success('El comentario se guardó exitosamente!');
				$("#text-coment-ot").val("");
				var objComments = ot_get_comments(obj.id_comment,idOt);
				if (typeof objComments!="null") {
					var target = $('.list-comment-ot');
					target.fadeOut("fast",function(){
   						target.find("*").remove();
   						var htmlObject;
						$.each(objComments.rows, function(key, item) {
							var block1 = '<div><span class="nro">'+item.nro+'</span><span class="photo"><img src="'+item.foto+'"></span><span class="name">'+item.nombre+' / <span class="especial-span">'+item.email+'</span>'+((item.tipo=="guest")? '<span class="guest-tag">( Invitado )</span>':'')+'</span></div>';
							var block2 = '<div><span class="comment">'+item.comentario+'</span><span class="date">Comentado el '+item.fecha+' a las '+item.hora+'</span></div>';
							htmlObject = $('<div class="items-comentario" id="'+item.id+'">'+block1+block2+'</div>');
							target.append(htmlObject);
						});
					}).fadeIn("slow", function(){
						$("#status-save-comment").hide();
						$("#btn-comment-ot").attr('disabled',false);
						$("#text-coment-ot").attr('disabled',false);
					});
				}else{
					toastr.error('Error al mostrar los comentarios. Intente recargando la página.', 'Error');
				}
			}else{
				toastr.error('Error al guardar el comentario. Intente nuevamente.', 'Error');
			}
		}else{
			toastr.warning('Debe ingresar un comentario!');
		}
	});

	// Call notify ot
	$("#notificar-ot").click(function(){
		if(confirm("Está seguro(a) de Notificar la OT?")) {
			fn_open_loading('Notificando, espere un momento...');
			var id = $("#id-ot").val();
			save_ot_express();
			if (ot_notify(id)) {
				toastr.success('La OT ha sido notificada exitosamente!');
				$('#label-notify').removeClass('msg-status-notify-false').addClass('msg-status-notify-true').text("Notificado.");
			}else{
				toastr.error('No se pudo enviar la notificación', 'Error al notificar');
			}

			fn_close_loading();
		}
	});

	$("#buscar-proyectos-auto").autocomplete({
		source: function(request,response) {
			$.ajax({
				url: "/buscar_proyectos_json",
				dataType: "json",
				data: {
					name_startsWith:request.term,
					maxRows: 12
				},
				success: function(data) {
					response($.map(data.negocios,function(item) {
						return {
						//label:"("+item.idnegocio+") "+item.referencia+"\n\n"+item.razoncliente,
						value: item.referencia,
						idnv:item.idnv,
						idneg:item.idnegocio,
						estado:item.estado,
						cliente:item.razoncliente,
						femision:item.fechaEmision,
					}
				}));
				}
			});
		},
		minLength:1,
		select: function(event, ui) {

			$('#idproyecto-select').val(ui.item.idnv);
			var data = "";
			data = data + "<option selected='selected' value='-1'>[ Seleccionar ]</option>";
			data = data + "<option value='ITEM DIRECTO'>ITEM DIRECTO</option>";
			data = data + "<option value='OTROS GASTOS'>OTROS GASTOS</option>";
			$("#items-tipo-ot").html(data);
			$('.items-p-ot').show();
			$('.itemsnv').hide();

			// update link de negocio asociado
			var info = ui.item.value + " (NRO: "+ ui.item.idneg + ")";
			$('#goto-neg-cot').data('id', ui.item.idnv);
			$('#goto-neg-cot > span').text(info);

		}
	});

$.ui.autocomplete.prototype._renderItem = function (ul, item) {
	var format = "<a style='padding:2px;border-bottom:1px solid gray;border-radius:0;position:relative'>";
	format = format + "<strong>";
	if (item.idneg) format = format + "(" + item.idneg +") ";
	if (item.value) format = format + item.value;
	format = format + "</strong>";
	if (item.cliente || item.femision || item.email) format = format + "<br>";
	if (item.cliente) format = format + item.cliente;
	if (item.email) format = format + item.email;
	if (item.femision) format = format + "<span style='position:absolute;bottom:0;right:0;font-size:10px;color:#848484'>"+item.femision+"</span>";
	format = format + "</a>";
	return $("<li></li>").data("item.autocomplete", item).append(format).appendTo(ul);
};

	//$("#buscar-proyectos-auto").autocomplete();

	$("#mes-select-filters").click(function(){
		if($('#ano-select-filters').val()=="all"){
			alert("ATENCIÓN:\nFALTA SELECCIONAR AÑO.");
			$('#ano-select-filters').focus();
		}
	});

	$("#ano-select-filters").change(function(){
		if($(this).val()=="all"){
			$("#mes-select-filters").val("all");
			$("#mes-select-filters option:selected").text('[ Mes ]');
		}
	});

	$('#bn-login-auth-ot').click(function(){
		var idot = $("#idOt").val();
		var txtUsuario = $("#txtUsuario").val();
		var txtPassword = $("#txtPassword").val();
		var msg = "";

		if(txtUsuario=="" || txtPassword=="" ){
			alert("ATENCION:\nLOS DATOS SON INCORRECTOS!");
		}else{
			$.post("/authenticationOt",{
				idOt : idot,
				txtUsuario :  txtUsuario,
				txtPassword : txtPassword
			},function(data){
				if(data!=0){
					var session = data;
					location.href="/ot.shtml?i="+idot+"&r="+Math.random();
					//location.href="/4DACTION/ot/"+session+"/e/"+idot;
				}else{
					alert("ATENCION:\nLOS DATOS SON INCORRECTOS!");
				}
			});
		}
	});

	//setter UI Jquery
	$('button').button();
	$('.boton').button();
	$('.a-participantes').button({icons:{primary:"ui-icon-plus"}},{label:"Participantes"});
	$('.a-invitados').button({icons:{primary: "ui-icon-plus"}},{label:"Invitados"});
	$( ".agrandar-text" ).button({icons: {primary: "ui-icon-plus"},text: false});
	$( ".reducir-text" ).button({icons: {primary: "ui-icon-minus"},text: false});
	$('.dialog-confirm').hide();

	add_invitados();
	buscar_invitados();

	$(".hide-target").hide();
	$(".show-target").show();

	if($(".folio-ot").text()=="S/N"){
		$(".box-bottom-2").hide();
	}

	$("a[rel*=leanModal]").leanModal({ top : 200, overlay : 0.4, closeButton: ".modal_close" });

	$(".data-mandatory").hide();

fn_ver_todos_det_nv_pend();

$("#search-by-proy-pend").change(function(){
	var idNv = $(this).val();
	var login = $("#globalLogin").val();
	if(idNv!="-1"){
		$.get("/searchPend/"+idNv+"/"+login, function(data){
			$("#content-list-ot-pend").html(data);
			$(".datepicker").datepicker();
			fn_edit_date_prop();
			fn_edit_hours_prop();
			fn_ver_todos_det_nv_pend();
		});
	}
});


	//calculated allocation of hours.
	$('#hasignada').bind('keyup change', function(){
		var hasig = parseFloat($(this).val().replace(',','.'));
		var hdisp = parseFloat($("#hdisp").val().replace(',','.'));
		var hrest = hdisp-hasig;

		if(isNaN(hrest)){
			$('#hrest').val(hdisp);
			$('#hrest').css({'color':'black'});
		}else{
			$('#hrest').val(hrest);
			if(hrest<0){
				$('#hrest').css({'color':'red'});
			}else{
				$('#hrest').css({'color':'black'});
			}
		}
	});

	//save popup of preferences.
	/*$("#save-pop-preferencias").click(function(){
		var diasDesde = $("#pref-dias-desde").val();
		var diasHasta = $("#pref-dias-hasta").val();
		var horasDesde = $("#pref-hora-desde").val();
		var horasHasta = $("#pref-hora-hasta").val();
		$.post("/savepreferencesot",
		{
			diasDesde : diasDesde,
			diasHasta : diasHasta,
			horasDesde : horasDesde,
			horasHasta : horasHasta
		},

		function(data){
			//alert("Datos guardados!");
			closeLightBox("bg-preferences","modal-preferences");
		});
	});*/

	//select guest
	fn_select_guest();
	fn_select_guest2();

	//select guest close
	$(".guest-box-suggest").mouseleave(function(){
		$('#guest-list-suggest-email').hide();
		$('#guest-list-suggest-name').hide();
	});

	$('#guest-list-suggest-name').hide();
	$('#guest-list-suggest-email').hide();
	$('#guest-list-suggest-name2').hide();
	$('#guest-list-suggest-email2').hide();

	//fn_filter_resp_planner2();
	$('#bg-loading').hide();

	$("#add-guest-rev").click(function(){
		$.get("/getFrm/frm_add_guest.html", function(data){
			$("#modal-pop-guest").html(data);
			fn_search_guest_by_name2();
			fn_search_guest_by_email2();
			fn_close_box_suggest();
			fn_save_guest_rev();
		});
		openLightBox("bg-pop-guest","modal-pop-guest","400","220");
	});

	// Verifica hora vcto
	$('#hora').change(function(){
		var hora = $(this).val();
		$.ajax({
			'url': '/4DACTION/_V3_ot_get_hour_vcto',
			dataType: 'json',
			success: function(data) {
				if (hora > data.hora) {
					toastr.warning('La hora de vencimiento máxima es a las '+data.hora+' hrs.');
					$('#hora').val(data.hora);
				}
			}
		});

	});

	fn_save_guest_rev();
	fn_search_guest_by_name();
	fn_search_guest_by_email();
	fn_duplicar_ot();
	fn_edit_date_prop();
	fn_edit_hours_prop();
	agrandar_text();
	reducir_text();
	delete_part_ot();
	add_participantes();
	popup_subir_archivos();
	save_ot_express();
	ot_save();
	ot_anular();
	ot_open();
	ot_close();
	ot_refresh_permissions(); // Si el usuario no tiene permiso para modificar, solo es posible hacer cambios si la OT está en espera de validar


});

var save_ot_express = function(){
	$(".guardar-express-ot").on("change ",function(){
		var options = { year: 'numeric', month: 'numeric', day: 'numeric' };

		if ($( this ).hasClass( "ff" )) {
			let ff= '';
			let ff2=new Date($( this ).val());
		  	ff= String(( ff2).toLocaleDateString("es-ES", options));
		  	$( this ).val(ff);
	

		}
		

		$.ajax({
			url: '/4DACTION/_V3_save_ot_express',
			data: $("#frmnuevaot").serialize(),
			dataType: 'json',
			type: 'POST',
			beforeSend: function(){
				$('.saved-status').text("Guardando...");
			},
		}).done(function(){
			 $('.saved-status').text("Todos los cambios se han guardado");
		});
	});
}

/*var check_to_notify = function(){
	var status = false;
	var msg = "Enviar notificaciones?<br><br>¿Quieres enviar notificacicones a los participantes?";
	confirm(msg, 'Enviar', 'No enviar').done(function(data) {
		if (data) {
			status = true;
		}
	});
	return status;
}*/

var ot_save = function(){
	$('#saveot-ajax').click(function(){

		var container = $('.sheet-ot');
		msjError = "";

		var folio = container.data('folio');
		var fVcto = $("#fecha-vcto").val();
		var hVcto = $("#hora").val();
		var ref = $("#referencia-ot").val();
		var impor = $("#importancia").val();
		var area = $("#area-trabajo").val();
		var resp = $("#responsables-area").val();
		var hasig = $("#hasignada").val();
		var desc = $("#idcomment-otxx").val();
		var tipoOt = $("#tipo-ot").val();
		var proyecto = $("#idproyecto-select").val();
		var general = $("#idempresa-select").val();

		info.number = folio;
		info.reference = ref;
		info.comment = desc.replace(/\n/g,'<br/>');;

		/*var fecha_comienzo = $('input[name="fecha_comienzo"]').val();
		var hora_comienzo = $('input[name="hora_comienzo"]').val();
		var fecha_final = $('input[name="fecha_final"]').val();
		var hora_final = $('input[name="hora_final"]').val();
		var motivo = $('[name="motivo"]').val();*/

		var origen = $("#items-tipo-ot").val();
		var itemSeleccionado = $("#llave-det-nvx").val();

		if(tipoOt=="PROYECTO"){
			if(parseInt(proyecto)==0){
				msjError = msjError + "- Seleccionar un Negocio.<br>"
			}else{
				if (origen=="-1") {
					msjError = msjError + "- Seleccionar un Origen.<br>"
				}else{
					if (origen=="ITEM DIRECTO" && itemSeleccionado=="-1") {
						msjError = msjError + "- Seleccionar item.<br>"
					}
				}
			}
		}else{
			if(parseInt(general)==0){
				msjError = msjError + "- Seleccionar un Cliente.<br>"
			}
		}

		if(fVcto=="00/00/00" || fVcto=="00-00-00"){
			msjError = msjError + "- Seleccionar fecha de vencimiento.<br>"
		}

		if(resp=="-1"){
			msjError = msjError + "- Seleccionar un Responsable.<br>"
		}

		if(desc==""){
			msjError = msjError + "- Ingresar una descripción.<br>"
		}

		if(ref==""){
			msjError = msjError + "- Ingresar una referencia.<br>"
		}

		if(impor=="-1"){
			msjError = msjError + "- Seleccionar Importancia.<br>"
		}

		if(area=="-1"){
			msjError = msjError + "- Seleccionar Area.<br>"
		}

		if (motivo_obligatorio && folio == "S/N") {
			if ($("#motivo").val() == "0") {
				msjError = msjError + "- Seleccionar Motivo.<br>"
			}
		}		

		// no se valida ingreso de datos
		if (ingreso_rapido) {
			msjError = "";
		}

		if(msjError == ""){

			if (folio == "S/N") {
				/*if (ask_to_notify) {
					if(check_to_notify){
						$("#send-notifyx").val("si");
					}
				}else{
					$("#send-notifyx").val("si");
				}*/
				$("#send-notifyx").val("si");

			}

			$.ajax({
				url: '/4DACTION/_v3_ot_save',
				data: $("#frmnuevaot").serialize(),
				dataType: 'json',
				type: 'POST',
				success: function(data) {
					ot.index = data.folio;
					if (data.id > 0) {
						toastr.success('La OT se guardó exitosamente!');
						//ots.notify.email(info);
						if (folio == "S/N") {
							$('div.folio-ot').text(ot.index);
							$('#sheet-ot').data('folio', ot.index);
							// send_inbox($.extend(data, data, {'subject':'Ha creado la orden de trabajo'} ));

							// begin: validación OT
							$.ajax({
							    url: '/4DACTION/_V3_setLogValidacion',
							    data: {
							        table: 'OT',
							        id_record: ot.id,
							        index_record: ot.index,
							        ref_record: ot.ref,
							        test: true,
							        async: false
							    },
							    dataType: 'json',
							    async: false,
							    success: function(data) {
							        if (!crear_oc_validada)
							            crear_oc_validada = (data.rows.length == 0);
							    }
							});

							if (!crear_oc_validada) {
							    if (!deferReglaValidacion) {
							        initLogValidacion();
							        sendValidar = true;

							    } else {
							        $.ajax({
							            url: '/4DACTION/_V3_setLogValidacion',
							            data: {
							                table: 'OT',
							                id_record: ot.id,
							                index_record: ot.index,
							                ref_record: ot.ref,
							                test: true,
							                async: false
							            },
							            dataType: 'json',
							            async: false,
							            success: function(data) {
							                has_rules = (data.rows.length > 0);
							                if (has_rules) {
							                    $('#menu [data-name="validate_send"]').show();
							                } else {
							                    $.ajax({
							                        url: '/4DACTION/_v3_ot_save',
							                        data: {
							                            id: ot.id,
							                            'approved': true,
							                            auto: true
							                        },
							                        dataType: 'json',
							                        async: false,
							                        success: function(subdata) {
							                        	//ots.notify.email(info);
														location.href="/ot.shtml?i=" + subdata.id + "&r="+Math.random();
							                        }
							                    });
							                }
							            }
							        });
							    }
							} else {
							    $.ajax({
							        url: '/4DACTION/_v3_ot_save',
							        data: {
							            id: ot.id,
							            'approved': true,
							            auto: true
							        },
							        dataType: 'json',
							        async: false,
							        success: function(subdata) {
							        	//ots.notify.email(info);
										location.href="/ot.shtml?i=" + subdata.id + "&r="+Math.random();
							        }
							    });

							}
							ot_refresh_permissions();
							// end: validación OT

						} else {
							
							location.href="/ot.shtml?i=" + data.id + "&r="+Math.random();
						}

					}else{
						toastr.error('Error al guardar la OT. Intente nuevamente.', 'Error');
					}
				},
				error: function(data){
					console.log(data);
				}
			});

		}else{
			toastr.error(msjError, 'Faltan datos:');
		}
	});
}


var ot_notify = function(id){
	var state = false;
	$.ajax({
		url: '/4DACTION/_V3_ot_notify',
		data: {id:id},
		dataType: 'json',
		async:false,
		success: function(data) {
			if (data.success) {
				// send_inbox($.extend(data, data, {'subject':'Ha reenviado la orden de trabajo'} ));
				state = true;
			}
		}
	});
	return state;
}

function buscar_invitados(){
	$(".buscar-invitados").autocomplete({
		source: function(request,response) {
			$.ajax({
				url: "/buscar_invitados_json",
				dataType: "json",
				data: {
					name_startsWith:request.term,
					maxRows: 12
				},
				success: function(data) {
					response($.map(data.invitados,function(item) {
						return {
							label:item.nombre+" / "+item.email,
							value: item.nombre,
							cod:item.cod,
							email:item.email
						}
					}));
				}
			});
		},
		minLength:1,
		select: function(event,ui) {
			$('#email-invitado').val(ui.item.email);
		}
	});
}


function fn_duplicar_ot(){
	$('#duplicar-ot').click(function(){

		/*if(confirm("Está seguro(a) de duplicar la OT?")) {
			var id = $('#id-ot').val();
			$.ajax({
				url: '/4DACTION/_V3_ot_duplicate',
				data: {id:id},
				dataType: 'json',
				type: 'POST'
			}).done(function(data){
				if (data.id>0) {
					toastr.success('La OT ha sido duplicada exitosamente!');
					location.href="/ot.shtml?i="+data.id+"&r="+Math.random();
				}else{
					toastr.error('Error al duplicar la OT. Intente nuevamente.', 'Error');
				}
			});
		}*/

		confirm("Está seguro(a) de duplicar la OT?").done(function(data) {
			if (data) {
				var id = $('#id-ot').val();
				$.ajax({
					url: '/4DACTION/_V3_ot_duplicate',
					data: {id:id},
					dataType: 'json',
					type: 'POST'
				}).done(function(data){
					if (data.id>0) {
						toastr.success('La OT ha sido duplicada exitosamente!');
						location.href="/ot.shtml?i="+data.id+"&r="+Math.random();
					}else{
						toastr.error('Error al duplicar la OT. Intente nuevamente.', 'Error');
					}
				});
			}
		});

	});
}

function ot_anular(){
	$("#btn-cancel-ot").click(function(){
		
		/*if(confirm("Está seguro de ANULAR la OT?")){
			var idOt = $("#id-ot").val();
			$.ajax({
				url: '/4DACTION/_V3_anular_ot',
				data: {id:idOt},
				dataType: 'json',
				type: 'POST'
			}).done(function(data){
				if (data.id>0) {
					// send_inbox($.extend(data, data, {'subject':'Ha anulado la orden de trabajo'} ));
					toastr.success('La OT ha sido anulada exitosamente!');
					location.href="/ot.shtml?i="+data.id+"&r="+Math.random();
				}else{
					toastr.error('Error al anular la OT. Intente nuevamente.', 'Error');
				}
			});
		}*/

		confirm("Está seguro de ANULAR la OT?").done(function(data) {
			if (data) {
				var idOt = $("#id-ot").val();
				$.ajax({
					url: '/4DACTION/_V3_anular_ot',
					data: {id:idOt},
					dataType: 'json',
					type: 'POST'
				}).done(function(data){
					if (data.id>0) {
						// send_inbox($.extend(data, data, {'subject':'Ha anulado la orden de trabajo'} ));
						toastr.success('La OT ha sido anulada exitosamente!');
						location.href="/ot.shtml?i="+data.id+"&r="+Math.random();
					}else{
						toastr.error('Error al anular la OT. Intente nuevamente.', 'Error');
					}
				});
			}
		});


	});
}

function ot_close(){
	$("#btn-close-ot").click(function(){
		var idOt = $("#id-ot").val();
		$("#dialog-cerrar-ot" ).dialog({
			dialogClass:"dialog-confirm",
			resizable: false,
			height:280,
			width:500,
			modal: true,
			buttons: {
				"Aceptar": function() {
					var mensaje = $("#dialog-cerrar-ot").find("textarea").val();
					$.ajax({
						url: '/4DACTION/_V3_cerrar_ot',
						data: {id:idOt,mensaje:mensaje},
						dataType: 'json',
						type: 'POST'
					}).done(function(data){
						if (data.id > 0) {
							// send_inbox($.extend(data, data, {'subject':'Ha cerrado la orden de trabajo'} ));
							toastr.success('La OT ha sido cerrada exitosamente!');
							location.href="/ot.shtml?i="+ data.id +"&r="+Math.random();
						}else{
							toastr.error('Error al cerrar la OT. Intente nuevamente.', 'Error');
						}
					});
				},
				"Cancelar": function() {
				  	$(this).dialog("close");
				}
			}
	    });
	});
}

function ot_open(){
	$("#btn-open-ot").click(function(){
		if(confirm("Está seguro de Abrir la OT?")){
			var idOt = $("#id-ot").val();
			$.ajax({
				url: '/4DACTION/_V3_abrir_ot',
				data: {id:idOt},
				dataType: 'json',
				type: 'POST'
			}).done(function(data){
				if (data.id>0) {
					// send_inbox($.extend(data, data, {'subject':'Ha reabierto la orden de trabajo'} ));
					toastr.success('La OT ha sido abierta exitosamente!');
					location.href="/ot.shtml?i="+data.id+"&r="+Math.random();
				}else{
					toastr.error('Error al abrir la OT. Intente nuevamente.', 'Error');
				}
			});
		}
	});
}

function fn_ver_todos_det_nv_pend(){
	$('.table-items2').click(function(){
		var idNv = $(this).attr('lang');
		var loginResp = $("#globalLogin").val();
		$.get("/showDetNvPend/"+idNv+"/"+loginResp, function(data){
			$("#signup").html(data);
		});
	});
}

function fn_close_box_suggest(){
	$(".guest-box-suggest").mouseleave(function(){
		$('#guest-list-suggest-email2').hide();
		$('#guest-list-suggest-name2').hide();
	});
}

function fn_search_guest_by_name(){
	//search guest by name
	$('#guest-name').bind('keyup click', function(){
		var name = $(this).val();
		$.get("/searchSuggestGuest/name/"+name, function(data){
			if(data!=0){
				$('#guest-list-suggest-name').html(data);
				$('#guest-list-suggest-name').show();
				fn_select_guest();
			}else{
				$('#guest-list-suggest-name').html("");
				$('#guest-list-suggest-name').hide();
			}
		});
	});
}

function fn_search_guest_by_email(){
	//search guest by email
	$('#guest-email').bind('keyup click', function() {
		var email = $(this).val();
		$.get("/searchSuggestGuest/email/"+email, function(data){
			if(data!=0){
				$('#guest-list-suggest-email').html(data);
				$('#guest-list-suggest-email').show();
				fn_select_guest();
			}else{
				$('#guest-list-suggest-email').html("");
				$('#guest-list-suggest-email').hide();
			}
		});
	});
}

function fn_search_guest_by_name2(){
	//search guest by name2
	$('#guest-name2').bind('keyup click', function() {
		var name = $(this).val();
		$.get("/searchSuggestGuest/name/"+name, function(data){
			if(data!=0){
				$('#guest-list-suggest-name2').html(data);
				$('#guest-list-suggest-name2').show();
				fn_select_guest2();
			}else{
				$('#guest-list-suggest-name2').html("");
				$('#guest-list-suggest-name2').hide();
			}
		});
	});
}

function fn_search_guest_by_email2(){
	//search guest by email2
	$('#guest-email2').bind('keyup click', function() {
		var email = $(this).val();
		$.get("/searchSuggestGuest/email/"+email, function(data){
			if(data!=0){
				$('#guest-list-suggest-email2').html(data);
				$('#guest-list-suggest-email2').show();
				fn_select_guest2();
			}else{
				$('#guest-list-suggest-email2').html("");
				$('#guest-list-suggest-email2').hide();
			}
		});
	});
}

function fn_select_guest(){
	$('.select-guest').click(function() {
		var array = $(this).attr("rel").split(":");
		var name = array[0];
		var email = array[1];
		$('#guest-name').val(name);
		$('#guest-email').val(email);
		$('#guest-list-suggest-name').hide();
		$('#guest-list-suggest-email').hide();
	});
}

function fn_select_guest2(){
	$('.select-guest2').click(function() {
		var array = $(this).attr("rel").split(":");
		var name = array[0];
		var email = array[1];
		$('#guest-name2').val(name);
		$('#guest-email2').val(email);
		$('#guest-list-suggest-name2').hide();
		$('#guest-list-suggest-email2').hide();
	});
}

/*
function close_pop_planner(){
	closeLightBox("bg-ver-planner","modal-ver-planner");
}

function fn_show_asignados_planner2(){
	$('.pointer').each(function(index){
		var datos = $(this).attr("title");
		var dim = datos.split(":");
		var _hora = dim[0];
		var _idOt = dim[1];
		var _fVcto = dim[2];
		var _fActual = dim[3];
		var _prioridad = dim[4];
		var this2 = $(this);
		$(this2).css({"width":"auto"});

		$.get("/showAsignados/"+_idOt+"/"+_hora+"/"+_fActual, function(data){
			if(data==1){
				//$(this2).text("x");
				if(_prioridad=="baja"){
					$(this2).parent("td").addClass("color-back-baja");
				}
				if(_prioridad=="media"){
					$(this2).parent("td").addClass("color-back-media");
				}
				if(_prioridad=="alta"){
					$(this2).parent("td").addClass("color-back-alta");
				}
			}

			if(data==2){
				//$(this2).text("x");
				if(_prioridad=="baja"){
					$(this2).parent("td").addClass("color-back-baja");
				}
				if(_prioridad=="media"){
					$(this2).parent("td").addClass("color-back-media");
				}
				if(_prioridad=="alta"){
					$(this2).parent("td").addClass("color-back-alta");
				}

				$(this2).addClass("color-border-rev");
				$(this2).text("R");
			}

			if(data==3){
				$(this2).addClass("color-border-rev");
				$(this2).text("R");
			}

		});
	});
}

function fn_select_time_planner(){
	$('.select-time').click(function(index){
		var datos = $(this).attr("title");
		var dim = datos.split(":");
		var hora = String(dim[0]);
		var fecha = String(dim[1]);
		if(hora.length==1){
			hora = "0"+hora;
		}
		$("#fecha-vcto").val(fecha);
		$("#hora").val(hora+":00:00");
		close_pop_planner();
	});
}

function fn_ot_show_planner_(){
	var session = $("#globalSession").val();
	var date = $(this).attr("rel");
	var valPriority = "TODOS";
	var valResp = "TODOS";
	var valNv = "TODOS";

	$.get("/2showPlanner/"+date+"/current/r/"+valResp+"/"+valPriority+"/"+valNv, function(data){
		$("#ot_container-all-planner").html(data);
		fn_change_week_planner2();
		fn_show_asignados_planner2();
		fn_select_time_planner();
	});
}

function fn_change_week_planner2(){
	$("#link-previous-week-planner").click(function(){
		var session = $("#globalSession").val();
		var date = $(this).attr("rel");
		var valPriority = "TODOS";
		var valResp = $("#filters-resp-planner2").val();
		var valNv = "TODOS";
		$.get("/2showPlanner/"+date+"/previous/r/"+valResp+"/"+valPriority+"/"+valNv, function(data){
			$("#ot_container-all-planner").html(data);
			fn_change_week_planner2();
			fn_show_asignados_planner2();
			fn_select_time_planner();
			fn_filter_resp_planner2();
		});
	});

	$("#link-current-week-planner").click(function(){
		var session = $("#globalSession").val();
		var date = $(this).attr("rel");
		var valPriority = "TODOS";
		var valResp = $("#filters-resp-planner2").val();
		var valNv = "TODOS";

		$.get("/2showPlanner/"+date+"/current/r/"+valResp+"/"+valPriority+"/"+valNv, function(data){
			$("#ot_container-all-planner").html(data);
			fn_change_week_planner2();
			fn_show_asignados_planner2();
			fn_select_time_planner();
			fn_filter_resp_planner2();
		});
	});

	$("#link-next-week-planner").click(function(){
		var session = $("#globalSession").val();
		var date = $(this).attr("rel");
		var valPriority = "TODOS";
		var valResp = $("#filters-resp-planner2").val();
		var valNv = "TODOS";
		$.get("/2showPlanner/"+date+"/next/r/"+valResp+"/"+valPriority+"/"+valNv, function(data){
			$("#ot_container-all-planner").html(data);
			fn_change_week_planner2();
			fn_show_asignados_planner2();
			fn_select_time_planner();
			fn_filter_resp_planner2();
		});
	});
}

function fn_filter_resp_planner2(){
	$('#filters-resp-planner2').change(function() {
		var session = $("#globalSession").val();
		var date = "";
		var valPriority = "TODOS";
		var valResp = $("#filters-resp-planner2").val();
		var valNv = "TODOS";

		$.get("/2showPlanner/"+date+"/current/r/"+valResp+"/"+valPriority+"/"+valNv, function(data){
			$("#ot_container-all-planner").html(data);
			fn_change_week_planner2();
			fn_show_asignados_planner2();
			fn_select_time_planner();
			fn_filter_resp_planner2();
		});
	});
}*/

function fn_save_guest_rev(){
	$("#btn-save-guest-rev").click(function(){
		var name = $("#guest-name2").val();
		var email = $("#guest-email2").val();

		$("#guest-name2").css({'border-color':'#F5D0A9'});
		$("#guest-email2").css({'border-color':'#F5D0A9'});

		var error = "";
		if(name!="" && email!=""){
			if(!fn_valid_email(email)){
				$("#guest-email2").css({'border-color':'red'});
				error = "error";
			}
		}else{
			if(name==""){
				$("#guest-name2").css({'border-color':'red'});
				error = "error";
			}
			if(email==""){
				$("#guest-email2").css({'border-color':'red'});
				error = "error";
			}
		}

		if(error == ""){
			$.post("/saveGuest",{name:name,email:email});
			var valor = "inv/guest_"+email;
			var cadena = "<input class='check-revision' type='checkbox' name='"+name+"' value='"+valor+"'/><span class='part-invitado'>"+name+"</span>";
			$('#box-participantes-revision').append(cadena);
			$(".box-add-guest-rev").fadeOut();
			$("#add-guest-rev").html("+ Invitado");
			fn_click_chk_inv();
			closeLightBox('bg-pop-guest','modal-pop-guest');
		}
	});
}

function fn_edit_date_prop(){
	$(".input-date-pend").change(function(){
		var getName = $(this).attr("name").split(":");
		var getDate = $(this).val();
		var idNv = getName[0];
		var llaveDet = getName[1];
		var this2 = $(this);
		$.get("/editDatePropuestaPend:"+idNv+":"+llaveDet+":"+getDate, function(data){
			if(data==0){
				alert("- NO SE PUEDO ACTUALIZAR LA FECHA.");
			}
			if(data==1){
				$(this2).css({'border':'2px solid green'});
				setTimeout(function(){
					$(this2).css({'border':'1px solid gray'});
				},1000);
			}
		});
	});
}

function fn_edit_hours_prop(){
	$(".input-hours-pend").change(function(){
		var getName = $(this).attr("name").split(":");
		var getHours = $(this).val();
		var idNv = getName[0];
		var llaveDet = getName[1];
		var this2 = $(this);
		if(fn_validate_number(getHours)){
			$.get("/editHoursRealPend:"+idNv+":"+llaveDet+":"+getHours, function(data){
				if(data==0){
					fn_alert("- NO SE PUDO ACTUALIZAR LA HORA.");
				}
				if(data==1){
					$(this2).css({'border':'2px solid green'});
					setTimeout(function(){
						$(this2).css({'border':'1px solid gray'});
					},1000);
				}
			});
		}else{
			alert("- EL VALOR INGRESADO NO ES UN NÚMERO.");
			$(this).val("0");
		}
	});
}

function fn_validate_number(number){
	if (!/^([0-9])*$/.test(number)){
		return false;
	}else{
		return true;
	}
}

function agrandar_text(){
	$('.agrandar-text').click(function(){
		var heightx = $('#idcomment-otxx').height();
		var heightx2 = heightx+100;
		$('#idcomment-otxx').height(heightx2);
		if (heightx2>81) {
			$('.reducir-text').show();
		}else{
			$('.reducir-text').hide();
		}
	});
}

function reducir_text(){
	$('.reducir-text').click(function(){
		var heightx = $('#idcomment-otxx').height();
		var heightx2 = heightx-100;
		$('#idcomment-otxx').height(heightx2);
		if (heightx2>81) {
			$('.reducir-text').show();
		}else{
			$('.reducir-text').hide();
		}
	});
}

/* Participantes - integrantes*/
function add_participantes(){
	$('.add-participantes').click(function(){
		var idOT = $('#id-ot').val();
		var idArea = $('#area-trabajo').val();
		var loginResponsable = $('#responsables-area').val();
		if(idArea=="-1" | loginResponsable=="-1"){
			alert("ATENCION : Debe seleccionar el Area de Trabajo y su Responsable.");
		}else{
			$.ajax({
				url: '/4DACTION/_V3_ot_get_participantes',
				data: {id:idOT,area:idArea},
				dataType: 'html',
				type: 'POST'
			}).done(function(data){
				$('#dialog-participantes').html(data);
				$("#dialog-participantes").dialog({
					dialogClass:"dialog-confirm",resizable: false,height:330,width:500,modal: true,
					buttons: {
						"Aceptar": function() {
							save_integrantes();
							$(this).dialog("close");
						},
						Cancelar: function() {
							$(this).dialog("close");
						}
					}
				});
			});
		}
	});
}

function save_integrantes(){
	var participantes="";
	var login = "";
	var idot = $('#id-ot').val();
	var idArea = $('#area-trabajo').val();
	var loginResponsable = $('#responsables-area').val();

	// Selecciona login de los participantes seleccionados
	$('#container-popup article input').each(function(){
		if ($(this).is(':checked')) {
			var login = $(this).val();
			participantes = participantes+"/"+login;
		}
	});
	$.ajax({
		url: '/4DACTION/_V3_ot_save_integrantes',
		data: {
			id:idot,
			participantes:participantes,
			area:idArea,
			login:loginResponsable
		},
		dataType: 'html',
		type: 'POST'
	}).done(function(data){
		$('#box-participantesx').html(data);
		delete_part_ot();
	});
}

/* Participantes - invitados */
function add_invitados(){
	$('.add-invitados').click(function(){
		if($('#area-trabajo').val()=="-1" || $('#responsables-area').val()=="-1"){
			alert("ATENCION : Debe seleccionar el Area de Trabajo y su Responsable.");
		}else{
			$.ajax({
				url: '/proyecto/invitados.html',
				dataType: 'html',
				type: 'GET'
			}).done(function(data){
				$('#dialog-invitados').html(data);
				buscar_invitados();
				$("#dialog-invitados").dialog({
					dialogClass:"dialog-confirm",resizable: false,height:250,width:450,modal: true,
					buttons: {
						"Aceptar": function() {
							if (save_invitados())
								$(this).dialog("close");
							else
								toastr.error('Debe completar todos los datos.', 'Faltan datos');

						},
						Cancelar: function() {
							$(this).dialog("close");
						}
					}
				});
			});
		}
	});
}

function save_invitados(){
	var id_ot = $('#id-ot').val();
	var id_area = $('#area-trabajo').val();
	var nombre = $('#nombres-invitado').val();
	var email = $('#email-invitado').val();
	var validate = false;
	if (nombre!="" && email!="") {
		$.ajax({
			url: '/4DACTION/_V3_ot_save_invitados',
			data: {
				id:id_ot,
				area:id_area,
				nombre:nombre,
				email:email
			},
			dataType: 'html',
			type: 'POST'
		}).done(function(data){
			$('#box-participantesx').html(data);
			delete_part_ot();
		});
		validate = true;
	}
	return validate;
}


function delete_part_ot(){
	$('.delete-part-ot').click(function(){
		var idOT = $('#id-ot').val();
		var login = $(this).attr('id');
		var this2 = $(this);
		$.ajax({
			url: '/4DACTION/_V3_ot_delete_participantes',
			data: {
				id:idOT,
				login:login
			},
			dataType: 'json',
			type: 'POST'
		}).done(function(data){
			if (data==1) {
				$(this2).parent().fadeOut('fast',function(){
					this.remove();
				});
			}
		});
	});
}

function fn_load_user(idarea){
	if(idarea!=-1){
		var idOT = $('#id-ot').val();
		$('#box-participantesx').html("");
		$.ajax({
			url: '/4DACTION/_V3_ot_get_responsables',
			dataType: 'json',
			data: {
				area: idarea,
				ot: idOT,
			},
			success: function(data) {
				//RESPONSABLES DEL AREA
				var options1 = "<option value='-1' selected>[ Seleccionar ]</option>";
				$.each(data.responsables, function(i,item){
					options1 = options1+"<option value="+item.login_rep+">"+item.nombres_resp+"</option>";
				});
				$('#responsables-area').html(options1);

				//PARTICIPANTES DEL AREA POR DEFECTOS
				var options2="";
				$.each(data.pordefecto, function(i,item){
					options2 = options2+"<div class='items-asignados-int'>"+item.nombres_def.toLowerCase()+"</div>";
				});
				$('#box-participantesx').html(options2);
			}
		});
	}else{
		$('#box-participantesx').html("");
	}
}

function guarda_responsable(loginResponsable){
	if(loginResponsable!=-1){
		var idOT = $('#id-ot').val();
		$.ajax({
			url: '/4DACTION/_V3_ot_save_responsables',
			data: {id:idOT,resp:loginResponsable},
			dataType: 'json',
			type: 'POST'
		}).done(function(data) {
			var target = $('#box-participantesx');

			target.find("*").remove();
			var htmlObject;
			$.each(data.rows, function(key, item) {
				var visto = "";
				var porDefecto = "";

				// Tipo participante (por defecto integrante normal)
				var tipo = "items-asignados-int";
				if (item.tipo=="INVITADO") {
					tipo = "items-asignados-inv";
				}

				// Si participante ha visto la ot, agrega icono visto
				if (item.folio) {
					visto = '<span class="check-ot" title="El participante ha visto la OT">✓</span>';
				}

				// Verfica si se puede o no eliminar dela lista al participante
				if (item.pordefecto=="no" || item.tipo=="INVITADO") {
					porDefecto = '<a id="'+item.login+'" class="delete-part-ot">x</a>';
				}

				// Se agrega el participante a la lista
				htmlObject = $('<div class="'+tipo+'">'+visto+item.nombre.toLowerCase()+porDefecto+'</div>');
				target.append(htmlObject);
			});
			delete_part_ot();
		});

		/*$.post("/0001jsongetparticipantesot",{idOT:idOT,loginResponsable:loginResponsable,loginUsuario:loginUsuario}, function(data) {
			$('#box-participantesx').html(data);
			delete_part_ot();
		});*/
	}
}

function buscar_por_estado_participantes(estado){
	if (estado!="-1") {
		var session = $("#globalSession").val();
		location.href="lista_ot_de_participante.shtml?e="+estado+"&r="+Math.random();
	}
}

function selecccionar_todos_participantes(this2){
	var desLink = $(this2).text();
	if (desLink=="Seleccionar todo") {
		$(this2).text('Ninguno');
		$('.participantes-chk').attr('checked',true);
	}else{
		$(this2).text('Seleccionar todo');
		$('.participantes-chk').attr('checked',false);
	}
}

/* abrir popup subir archivo */
function popup_subir_archivos(){
	$('#btn-subir-archivo').click(function(){
		$.post("/popup_subir_archivos",function(data){
			$('#dialog-subir-archivos').html(data);
			$("#dialog-subir-archivos").dialog({
				dialogClass:"dialog-form",
				resizable: false,height:300,width:500,
				modal: true,
				buttons: {
					"Aceptar": function() {
						subir_archivo_ot();
					},
					Cancelar: function() {
						$(this).dialog("close");
					}
				}
			});
		});
	});
}

function subir_archivo_ot(){
	var idOt = $("#id-ot").val();
	var valor = $('#WU_xb_file').val();
	if (valor!="") {
		//muestra mensaje subiendo los archivos.
		$("#status").ajaxStart(function(){
			var img = '<img src="/imagenes_green/ajaxloadesr.gif" alt="cargando...">';
			var label = '<label>Subiendo el archivo, espere un momento por favor.</label>';
			$(this).html(img+label);
			$('#dialog_form').fadeOut();
		});
		$.ajaxFileUpload({
			url: '/4DACTION/_V3_uploadFile/'+idOt,
			secureuri:false,
			fileElementId: 'WU_xb_file',
			dataType: 'xml',
			success: function (data,status){
				$.get("/traeupload/"+idOt+"/OT/0", function(data){
					$('.box-files-ot').html(data);
					fn_deteleFileNormal();
					fn_deteleFileComp();
					fn_count_file_ot();
					fn_open_LightBox();
					fn_sendFile();
				});
				$('#dialog-subir-archivos').dialog("close");
			},
			error: function (data, status, e){
				$("#status").html("<span class='fail'>Ocurrio un error, intentar nuevamente.</span>");
				$('#dialog_form').fadeIn();
			}
		});
	}else{
		alert("ATENCIÓN:\n\nDEBE SELECCIONAR UN ARCHIVO.");
	}
	return false;
}

/*$(".buscar-invitados").autocomplete({
	source: function(request,response) {
		$.ajax({
			url: "buscar_invitados_json",
			dataType: "jsonp",
			data: {
				featureClass: "P",
				style: "full",
				maxRows: 12,
				name_startsWith:request.term
			},
			success: function(data) {
				response($.map(data.invitados,function(item) {
					return {
						label: item.name + (item.adminName1 ? ", " + item.adminName1 : "") + ", " + item.countryName,
						value: item.name
					}
				}));
			}
		});
	},
	minLength:1,
	select: function(event,ui) {
		alert("hola");
	}
});*/

/* Comment ot */
var ot_save_comments = function(param){
	console.log(param);
	var obj = null;
	if(param.comment!=""){
		$.ajax({
			url: '/4DACTION/_V3_ot_save_comments',
		    type: "POST",
		    data: param,
		    dataType:"json",
		  	async:false,
	        success: function(data){
	        	if (data.success) {
	        		obj = data;
	        	}
	      	}
		});
	}
	return obj;
}

var ot_get_comments = function(idComment,idOt){
	var obj = null;
	$.ajax({
		url: '/4DACTION/_V3_ot_get_comments',
	    data: {id:idComment,ot:idOt},
	    dataType:"json",
	    async:false,
        success: function(data){
        	obj = data;
      	}
	});
	return obj;
}
