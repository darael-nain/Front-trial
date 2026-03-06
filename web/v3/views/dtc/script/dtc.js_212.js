var dtc = {
	"container" : $('#sheet-dtc'),
	"containerItems" : $('#sheet-dtc').find('table.items > tbody'),
	init: function(id) {
		$.ajax({
		    'url':'/4DACTION/_V3_proxy_getDtcContent',
		    data:{
		    	"id" : id,
		    	"api" : true
		    },
		    dataType:'json',
		    async: false,
		    success:function(data){
		    	dtc.data = data;
		    }
	  	});
	  	dtc.id = dtc.data.id;

	  	if(dtc.data.from == "OC"){
	  		$('[data-name="resumen[dtc][origen]"]').show().text("ASOCIADA A ORDEN DE COMPRA");
	  		$('[name="label-referencia"]').text("Referencia");
	  	}else{
	  		if (dtc.data.from == "FXR") {
	  			$('[data-name="resumen[dtc][origen]"]').show().text("ASOCIADA A RENDICIÓN");
	  			$('[name="label-referencia"]').text("Concepto");
	  		}else{
	  			$('[data-name="resumen[dtc][origen]"]').hide().text("");
	  		}
	  	}

	  	if (dtc.data.montos.justificado > 0) {
	  		$('.add.ocs').hide();
	  	}

	  	// General
	  	$('[data-name="resumen[dtc][state]"]').text(dtc.data.estado);
	  	$('[data-name="resumen[dtc][register]"]').text("CREADA POR "+ dtc.data.emisor +" EL "+ dtc.data.fecha_registro +" A LAS "+ dtc.data.hora_registro +" HRS.");
	  	$('[name="referencia"]').val(dtc.data.referencia);
	  	$('[name="id_tipo_doc"]').val(dtc.data.id_tipo_doc);
	  	$('[name="des_tipo_doc"]').val(dtc.data.des_tipo_doc);
	  	$('[name="folio"]').val(dtc.data.folio);
	  	$('[name="fecha_emision"]').val(dtc.data.fecha_emision);
		$('[name="fecha_recepcion"]').val(dtc.data.fecha_recepcion);
	  	dtc.resumen.general();

	  	// Proveedor
	  	$('[name="contacto[info][alias]"]').val(dtc.data.contacto.alias);
	  	$('[name="contacto[info][razon_social]"]').val(dtc.data.contacto.razon_social);
	  	$('[name="contacto[info][id]"]').val(dtc.data.contacto.id);
	  	$('[name="contacto[info][rut]"]').val(dtc.data.contacto.rut);
	  	$('[name="contacto[info][giro]"]').val(dtc.data.contacto.giro);
	  	$('[name="des_forma_pago"]').val(dtc.data.des_forma_pago);
	  	dtc.resumen.contactos();

	  	// Items
	  	var items = dtc.items.get(dtc.id);
	  	dtc.items.load(items);

	  	// Totales
	  	$('[name="descuento_nc_netos"]').val(dtc.data.montos.descuento_nc_netos);
	  	$('[name="descuento_nc_total"]').val(dtc.data.montos.descuento_nc_total);

	  	$('[name="por_pagar"]').val(dtc.data.montos.por_pagar);
	  	$('[name="pagado"]').val(dtc.data.montos.pagado);
	  	$('[name="suma_pagos"]').text(dtc.data.montos.pagado);

	  	$('[name="por_justificar"]').val(dtc.data.montos.por_justificar);
	  	$('[name="justificado"]').val(dtc.data.montos.justificado);
	  	$('[name="suma_justificados"]').text(dtc.data.montos.justificado);

	  	

	  	$('[name="sub_total"]').val(dtc.data.montos.sub_total);
	  	$('[name="porcentaje_descuento"]').val(0);
	  	$('[name="descuento"]').val(dtc.data.montos.descuento);
	  	$('[name="exento"]').val(dtc.data.montos.exento);
	  	$('[name="neto"]').val(dtc.data.montos.neto);
	  	$('[name="iva"]').val(dtc.data.montos.iva);
	  	$('[name="adicional"]').val(dtc.data.montos.adicional);
	  	$('[name="total"]').val(dtc.data.montos.total);

	  	// preliquidacion
	  	$('[name="liquido"]').val(dtc.data.liquidacion.liquido);
	  	$('[name="sbase"]').val(dtc.data.liquidacion.sbase);

	  	$('[name="hextras"]').val(dtc.data.liquidacion.hextras);
	  	$('[name="gratificaciones"]').val(dtc.data.liquidacion.gratificaciones);

	  	$('[name="thaberes"]').val(dtc.data.liquidacion.thaberes);
	  	$('[name="tdescuentos"]').val(dtc.data.liquidacion.tdescuentos);
	  	if(dtc.data.liquidacion.leycinechk){
	  		$('[name="leycinechk"]').prop("checked", true);
	  	}else{
	  		$('[name="leycinechk"]').prop("checked", false);
	  	}
	  	$('[name="leycinemonto"]').val(dtc.data.liquidacion.leycinemonto);

	  	$('[name="lpagaremp"]').val(dtc.data.liquidacion.lpagaremp);
	  	$('[name="lpagarpre"]').val(dtc.data.liquidacion.lpagarpre);
	  	$('[name="lpagarsii"]').val(dtc.data.liquidacion.lpagarsii);
	  	$('[name="tcostoempresa"]').val(dtc.data.liquidacion.tcostoempresa);

	  	// Adicional
	  	$('[name="observacion"]').val(dtc.data.observacion);

	 	// Gastos asociados
	 	var gastos = dtc.gastos.get(dtc.id);
	  	dtc.gastos.load(gastos);
	 	if (dtc.data.from == 'FXR') {
	 		dtc.container.find('.info-gastos > h1 > label').text('Rendiciones');
	 	}else{
	 		dtc.container.find('.info-gastos > h1 > label').text('Órdenes de compra');
	 	}
	 	dtc.container.find('.info-gastos > h1 > span').text(gastos.rows.length);

	 	// Pagos
	 	var pagos = dtc.pagos.get(dtc.id);
	  	dtc.pagos.load(pagos);
	  	dtc.container.find('.info-pagos > h1 > span').text(pagos.rows.length);

	 	// Otros
	 	dtc.setMenu();
	  	dtc.display.init();
	  	dtc.display.paint();

	},
	display: {
		init: function(){
			// modificar = 449 / eliminar = 465 / anular 503 / crea = 504
			var menuBar = $('#menu ul');
			dtc.container.find("input").removeClass('required').addClass("transparent");

			// oculta y deshabilita las opciones por defecto
			dtc.display.visible(menuBar.find('li[data-name="save"], li[data-name="discard"], li[data-name="share_dtc"], li[data-name="delete_dtc"]'), false);
			dtc.display.visible(dtc.container.find('button.show, .add.op'), false);
			dtc.display.enabled(dtc.container.find('input, textarea'), false);
			dtc.display.visible(dtc.container.find('.info-nc'), false);
			dtc.display.visible(dtc.container.find('.preliquidacion'), false);

			switch(dtc.data.estado) {
			    case 'POR EMITIR':
			    	dtc.container.find('input[required]').removeClass('transparent').addClass("required");
			    	dtc.display.visible(menuBar.find('li[data-name="save"]'), true);

			    	/*if (access._465) { // eliminar
						dtc.display.visible(menuBar.find('li[data-name="delete_dtc"]'), true);
					}*/

					dtc.display.enabled(dtc.container.find('.info-general input'), true);

					dtc.display.enabled(dtc.container.find('.info-general input[name="des_tipo_doc"]').attr("type","text"), false);
					dtc.display.enabled(dtc.container.find('.info-proveedor input[name="contacto[info][alias]"]').attr("type","text"), false);
					dtc.display.enabled(dtc.container.find('.info-proveedor input[name="des_forma_pago"]').attr("type","text"), false);

					if (dtc.data.from == "FXR" || dtc.data.from == "") {
						dtc.display.visible(dtc.container.find('.info-general button.show'), true);
						dtc.display.enabled(dtc.container.find('.info-general input[name="des_tipo_doc"]').attr("type","search"), true);
						dtc.display.visible(dtc.container.find('.info-proveedor button.show'), true);
						dtc.display.enabled(dtc.container.find('.info-proveedor input[name="contacto[info][alias]"]').attr("type","search"), true);
						dtc.display.enabled(dtc.container.find('.info-proveedor input[name="des_forma_pago"]').attr("type","search"), true);
					}

					dtc.display.enabled(dtc.containerItems.find('input[required], input[name="dtc[detalle_item][imp][des]"]'), true);
					dtc.display.visible(dtc.containerItems.find('button.show'), true);

					dtc.display.visible(dtc.container.find('.info-totales .totales-post-save'), false);
					dtc.display.enabled(dtc.container.find('textarea[name="observacion"]'), true);
					dtc.display.visible(dtc.container.find('.info-gastos,  .info-pagos'), false);

					// preliquidacion
					if (dtc.data.id_tipo_doc == "111") {
						dtc.display.visible(dtc.container.find('.preliquidacion'), true);
						dtc.display.enabled(dtc.container.find('.preliquidacion input[data-enabled="true"]'), true);
					}

			    	break;

			    case 'POR REVISAR':
			    	dtc.display.visible(menuBar.find('li[data-name="save"]'), true);
			    	if (access._503) { // anular
						dtc.display.visible(menuBar.find('li[data-name="discard"]'), true);
					}
			    	if (access._449) { // modificar
			    		dtc.container.find('.info-general').find('.expand').removeClass('active');
						dtc.container.find('.info-proveedor').find('.expand').removeClass('active');
						dtc.display.enabled(dtc.container.find('.info-general input'), true);
						dtc.display.visible(dtc.container.find('.info-general button.show'), true);

						dtc.display.enabled(dtc.container.find('.info-proveedor input[name="contacto[info][alias]"]'), true);
						dtc.display.enabled(dtc.container.find('.info-proveedor input[name="des_forma_pago"]'), true);
						dtc.display.visible(dtc.container.find('.info-proveedor button.show'), true);

						dtc.display.visible(dtc.container.find('.info-totales .totales-post-save'), true);
						dtc.display.enabled(dtc.container.find('textarea[name="observacion"]'), true);
						dtc.display.visible(dtc.container.find('.info-pagos'), false);

					}
			    	if (access._465) { // eliminar
						dtc.display.visible(menuBar.find('li[data-name="delete_dtc"]'), true);
					}

			    	// habilitar creacion nc
					if (dtc.data.id_tipo_doc == "30" || dtc.data.id_tipo_doc == "33" || dtc.data.id_tipo_doc == "32" || dtc.data.id_tipo_doc == "34" || dtc.data.id_tipo_doc == "78") {
			    		dtc.display.visible(dtc.container.find('.info-nc'), true);
			    	}

			    	// preliquidacion
					if (dtc.data.id_tipo_doc == "111") {
						dtc.display.visible(dtc.container.find('.preliquidacion'), true);
						dtc.display.enabled(dtc.container.find('.preliquidacion input[data-enabled="true"]'), true);
					}

			        break;

			    case 'POR PAGAR':
			    	dtc.display.visible(menuBar.find('li[data-name="save"]'), true);
			    	dtc.container.find('.info-general').find('.expand').removeClass('active');
					dtc.container.find('.info-proveedor').find('.expand').removeClass('active');

					// habilitar creacion nc
					if (dtc.data.id_tipo_doc == "30" || dtc.data.id_tipo_doc == "33" || dtc.data.id_tipo_doc == "32" || dtc.data.id_tipo_doc == "34" || dtc.data.id_tipo_doc == "78") {
			    		dtc.display.visible(dtc.container.find('.info-nc'), true);
			    	}

			    	if (access._503) { // anular
						dtc.display.visible(menuBar.find('li[data-name="discard"]'), true);
					}

			    	if (access._465) { // eliminar
						dtc.display.visible(menuBar.find('li[data-name="delete_dtc"]'), true);
					}

					dtc.display.enabled(dtc.container.find('.info-general input[name="des_tipo_doc"]').attr("type","text"), false);
					dtc.display.enabled(dtc.container.find('.info-proveedor input[name="contacto[info][alias]"]').attr("type","text"), false);
					dtc.display.enabled(dtc.container.find('.info-proveedor input[name="des_forma_pago"]').attr("type","text"), false);
					if (access._449) { // modificar
						dtc.display.enabled(dtc.container.find('.info-general input[name="referencia"]'), true);
						dtc.display.enabled(dtc.container.find('.info-general input[name="folio"]'), true);
						dtc.display.enabled(dtc.container.find('.info-general input[name="fecha_emision"]'), true);
                        dtc.display.enabled(dtc.container.find('.info-general input[name="fecha_recepcion"]'), true);
						if (dtc.data.from == "FXR") {
							dtc.display.visible(dtc.container.find('.info-general button.show'), true);
							dtc.display.enabled(dtc.container.find('.info-general input[name="des_tipo_doc"]').attr("type","search"), true);

							dtc.display.visible(dtc.container.find('.info-proveedor button.show'), true);
							dtc.display.enabled(dtc.container.find('.info-proveedor input[name="contacto[info][alias]"]').attr("type","search"), true);
							dtc.display.enabled(dtc.container.find('.info-proveedor input[name="des_forma_pago"]').attr("type","search"), true);
						}else{

						}
						dtc.display.enabled(dtc.containerItems.find('input[required], input[name="dtc[detalle_item][imp][des]"]'), true);
						dtc.display.visible(dtc.containerItems.find('button.show'), true);
						dtc.display.enabled(dtc.container.find('textarea[name="observacion"]'), true);
					}

					// preliquidacion
					if (dtc.data.id_tipo_doc == "111") {
						dtc.display.visible(dtc.container.find('.preliquidacion'), true);
						dtc.display.enabled(dtc.container.find('.preliquidacion input[data-enabled="true"]'), true);
					}

			        break;

			    case 'PAGADO':
			    	dtc.display.enabled(dtc.container.find('.info-general input[name="des_tipo_doc"]').attr("type","text"), false);
			    	dtc.display.enabled(dtc.container.find('.info-proveedor input[name="des_forma_pago"]').attr("type","text"), false);
			    	if (access._449) { // modificar
			    		dtc.display.visible(menuBar.find('li[data-name="save"]'), true);
			    		dtc.container.find('.info-general').find('.expand').removeClass('active');
						dtc.container.find('.info-proveedor').find('.expand').removeClass('active');
					}
					if (access._503) { // anular
						dtc.display.visible(menuBar.find('li[data-name="discard"]'), true);
					}

					if (access._465) { // eliminar
						dtc.display.visible(menuBar.find('li[data-name="delete_dtc"]'), true);
					}

					// habilitar creacion nc
					if (dtc.data.id_tipo_doc == "30" || dtc.data.id_tipo_doc == "33" || dtc.data.id_tipo_doc == "32" || dtc.data.id_tipo_doc == "34" || dtc.data.id_tipo_doc == "78") {
			    		dtc.display.visible(dtc.container.find('.info-nc'), true);
			    	}

			    	// preliquidacion
					if (dtc.data.id_tipo_doc == "111") {
						dtc.display.visible(dtc.container.find('.preliquidacion'), true);
						dtc.display.enabled(dtc.container.find('.preliquidacion input[data-enabled="true"]'), true);
					}

			    	break;

			    case 'NULO':

			    	dtc.display.visible(menuBar.find('li[data-name="save"]'), true);
			    	dtc.container.find('.info-general').find('.expand').removeClass('active');
					dtc.container.find('.info-proveedor').find('.expand').removeClass('active');

					dtc.display.visible(dtc.container.find('.info-totales .totales-post-save'), false);
					dtc.display.visible(dtc.container.find('.info-gastos,  .info-pagos'), false);

					// preliquidacion
					if (dtc.data.id_tipo_doc == "111") {
						dtc.display.visible(dtc.container.find('.preliquidacion'), true);
						dtc.display.enabled(dtc.container.find('.preliquidacion input[data-enabled="true"]'), true);
					}

					if (access._465) { // eliminar
						dtc.display.visible(menuBar.find('li[data-name="delete_dtc"]'), true);
					}

			    	break;
			}
		},
		visible:function(target, status){
			if (status) {
				target.show();
			}else{
				target.hide();
			}
		},
		enabled:function(target, status){
			if (status) {
				target.prop( "readonly", false);
			}else{
				target.prop( "readonly", true);
			}
		},
		paint: function(){
			$('input[required]').each(function(key, item){
				if($(this).val() == "" || parseFloat($(this).val()) == 0){
				  	$(this).removeClass('transparent').addClass("required");
				}else{
					$(this).removeClass('required').addClass("transparent");
				}
			});
		}
	},
	impuesto: {
		getByDoc: function(){
			var impuestos;
			$.ajax({
				url: '/4DACTION/_V3_getImpuestos',
				dataType: 'json',
				data: {
				  'dtc[id]': dtc.data.id_tipo_doc
				},
				async: false,
				success: function(data) {
					impuestos = data;
				}
			});
			return impuestos;
		},
		assign: function(){
			if (dtc.data.id_tipo_doc != "") {
				$.each(dtc.impuesto.getByDoc().rows, function(key, item){
				  if (item.defecto) {
				    if (item.correlativo != "") {
				    	$('input[name="folio"]').val(item.correlativo);
				    	dtc.data.folio = item.correlativo;
				    }
				    $('table.items > tbody > tr[data-tipo="ITEM"] > td > input[name="dtc[detalle_item][imp][id]"]').val(item.id);
				    $('table.items > tbody > tr[data-tipo="ITEM"] > td > input[name="dtc[detalle_item][imp][id]"]').data('valorimp', item.valor);
				    $('table.items > tbody > tr[data-tipo="ITEM"] > td > input[name="dtc[detalle_item][imp][id]"]').data('tipoimp', item.tipo);
				    $('table.items > tbody > tr[data-tipo="ITEM"] > td > input[name="dtc[detalle_item][imp][des]"]').val(item.des);
				  }
				});
			}
		}
	},
	items: {
		add: function(data){
			var container = dtc.container.find('table.items > tbody');
			$.each(data.rows, function(key, item){
				if (item.tipo == "TITULO"){
					get_detail.titulo('prependTo', container, item);
				}else{
					var containerItem = dtc.container.find('table.items > tbody > tr[data-llave="'+ item.llave_titulo +'"]');
					if(item.llave_titulo == ""){
						get_detail.item('prependTo', container, item);
					}else{
						get_detail.item('insertAfter', containerItem, item);
					}
				}
			});
			dtc.impuesto.assign();
			dtc.montos.totales();
			dtc.display.paint();
			return false;
		},
		duplicate: function(current){

		    // create and add cloned
		    var cloned = current.clone();
		    cloned.insertAfter(current);

		    // set cloned
		    var idoc = 0;
		    var sequence = parseInt(current.find('input[name="dtc[detalle_item][items]"]').val()) + 1; // 1,2,3...
		    var newKey = 'OC'+ idoc + 'ITEM' +  sequence; // OC18507ITEM44
		    // cloned.find('input[name="dtc[detalle_item][llave_det_oc]"]').val(newKey);
		    cloned.find('input[name="dtc[detalle_item][llave_det_dtc]"]').val(newKey);
		    cloned.find('input[name="dtc[detalle_item][items]"]').val(sequence);
		    cloned.find('input[name="dtc[detalle_item][id_det_dtc]"]').val(0);
		    cloned.attr('data-llave', newKey);

		    // show impuestos por linea
		    $('button.show').button({icons: {primary: 'ui-icon-carat-1-s'},text: false});
		    cloned.find('button.show.impuestos').click(function() {
		    	var currentRow = $(this).parentTo('tr');
		    	currentRow.find('input[name="dtc[detalle_item][imp][des]"]').autocomplete('search', '@').focus();
		    });

		    cloned.focusin(function() {
		    	dtc.items.search(cloned);
		    });

		    cloned.focusout(function() {
		      $(this).find('input[name="dtc[detalle_item][nombre]"]').autocomplete('destroy');
		    });

		    cloned.find('.numeric.currency input').number(true, 2, ',', '.');
		    cloned.find('.numeric.percent input').number(true, 1, ',', '.');
		    dtc.impuesto.assign();
		    dtc.montos.totales();

		},
		get: function(id){
			var items;
			$.ajax({
			    'url':'/4DACTION/_V3_get_items_dtc',
			    data:{
			      "dtc[id]":id
			    },
			    dataType:'json',
			    async:false,
			    success:function(data){
			     	items = data;
			    }
			});
			return items;
		},
		load: function(data){
			if (data.rows.length > 0) {
		        dtc.containerItems.find("*").remove();
		        var numberOfTitles = dtc.containerItems.find('tr[data-tipo="TITULO"]').length;
		        $.each(data.rows, function(key, item){
					if (item.tipo == "TITULO"){
						if (numberOfTitles == 0) {
							get_detail.titulo('prependTo', dtc.containerItems, item); // inserta al principio
						}else{
							var target = dtc.containerItems.find('tr').last();
							get_detail.titulo('insertAfter', target, item); // inserta al final de todas las filas
						}
					}else{
						var insert = "insertAfter";
						if (item.llave_titulo != "") {
							var target = dtc.containerItems.find('tr[data-llavetitulo="'+ item.llave_titulo +'"]').last();  // inserta despues del ultimo item del titulo
							if (target.length == 0) {
				            	var target = dtc.containerItems.find('tr[data-llave="'+ item.llave_titulo +'"]'); // inserta despues del titulo
				            }
						}else{
							var target = dtc.containerItems.find('tr').last();
							if (target.length == 0) {
								var target = dtc.containerItems;
								var insert = "appendTo";
							}
						}
			            get_detail.item(insert, target, item);
					}
			    });

			    setTimeout(function(){
			  		dtc.montos.totales();
			  	}, 1000);

			    $(".origen-asociado-items").text(dtc.data.from);

			}
		},
		removes: function(target){
		    var tipo = target.data('tipo');
		    var llave = target.data('llave');
		    var llavetitulo = target.data('llavetitulo');
		    if (tipo == "TITULO") {
				confirm(MSG.get('CONFIRM_ITEM_DELETE')).done(function(data) {
					if (data) {
						target.fadeOut('slow', function(){
							$(this).remove();
							dtc.container.find('table.items > tbody > tr[data-llavetitulo="'+ llave +'"]').remove();
							var cantTotalItemsRestantes = dtc.container.find('table.items > tbody > tr[data-tipo="ITEM"]').length;
							dtc.montos.totales();
						});
					}
				});
		    }else{
				target.fadeOut('slow', function(){
					$(this).remove();
					// verifica cantidad de items restantes del titulo, si es cero se quita oc de la lista y titulo
					if (dtc.container.find('table.items > tbody > tr[data-llavetitulo="'+ llavetitulo +'"]').length == 0) {
						dtc.container.find('table.items > tbody > tr[data-llave="'+ llavetitulo +'"]').remove();
					}
					var cantTotalItemsRestantes = dtc.container.find('table.items > tbody > tr[data-tipo="ITEM"]').length;
					dtc.montos.totales();
				});
		    }
		},
		search: function(htmlObject){
			htmlObject.find('input[name="dtc[detalle_item][nombre]"]').autocomplete({
		        source: function(request, response) {
		          $.ajax({
		            url: '/4DACTION/_V3_' + 'getProductoByCategoria',
		            dataType: 'json',
		            data: {
		              q: request.term,
		              id: htmlObject.prevTo('.title').data('categoria')
		            },
		            success: function(data) {
		              response($.map(data.rows, function(item) {
		                return item;
		              }));
		            },
		            error: function(jqXHR, exception) {
		              toastr.error('No se pudo cargar el listado de items. Error de conexión al servidor.');
		                }
		          });
		        },
		        minLength: 0,
		        delay: 0,
		        position: { my: "left top", at: "left bottom", collision: "flip" },
		        open: function() {
		          $(this).removeClass('ui-corner-all').addClass('ui-corner-top');
		        },
		        close: function() {
		          $(this).removeClass('ui-corner-top').addClass('ui-corner-all');
		        },
		        focus: function(event, ui) {
		          $(this).val(ui.item.text);
		          return false;
		        },
		        select: function(event, ui) {
		          $(this).val(ui.item.text);
		          htmlObject.data('idservicio', ui.item.id);
		          htmlObject.data('nombre', ui.item.text);
		          htmlObject.find('input[name="dtc[detalle_item][id_producto]"]').val(ui.item.id);
		          htmlObject.find('input[name="dtc[detalle_item][cod_producto]"]').val(ui.item.index);
		          htmlObject.find('input[name="dtc[detalle_item][id_clasif]"]').val(ui.item.categoria.id);
		          htmlObject.find('input[name="dtc[detalle_item][des_clasif]"]').val(ui.item.categoria.text);
					if (dtc.container.find('table.items > tbody > tr[data-tipo="ITEM"]').length == 1 && ui.item.categoria.id > 0) {
						var keyTitle = htmlObject.data('llavetitulo');
						var rowTitle = mainContainer.find('table.items > tbody > tr[data-llave="'+keyTitle+'"]');
						var idCat = rowTitle.find('input[name="dtc[detalle_item][id_clasif]"]').val();
						var cantItemsCat = $('table.items > tbody > tr[data-llavetitulo="'+keyTitle+'"]').length;
						if (idCat == 0 || cantItemsCat == 1){
						  rowTitle.data('categoria', ui.item.categoria.id);
						  rowTitle.find('input[name="dtc[detalle_item][nombre]"]').val(ui.item.categoria.text);
						  rowTitle.find('input[name="dtc[detalle_item][id_clasif]"]').val(ui.item.categoria.id);
						  rowTitle.find('input[name="dtc[detalle_item][des_clasif]"]').val(ui.item.categoria.text);
						}
					}
		          	return false;
		        }

			}).data('ui-autocomplete')._renderItem = function(ul, item) {
				return $('<li><a><strong>' + item.index + ' ' + ((item.gasto_fijo)? '[Gasto Fijo]' : '') + ' ' +  ((item.especial)? '[Especial]' : '') + '</strong><em>' +  item.categoria.text + '</em><span class="highlight">' + item.text + '</span></a></li>').appendTo(ul);
			};

			htmlObject.find('input[name="dtc[detalle_item][imp][des]"]').autocomplete({
				source: function(request, response) {
				  $.ajax({
				    url: '/4DACTION/_V3_getImpuestos',
				    dataType: 'json',
				    data: {
				      q: request.term,
				      doc: dtc.data.id_tipo_doc
				    },
				    success: function(data) {
				      response($.map(data.rows, function(item) {
				        return item;
				      }));
				    }
				  });
				},
				minLength: 0,
				autoFocus: true,
				open: function() {
				  $(this).removeClass('ui-corner-all').addClass('ui-corner-top');
				},
				close: function() {
				  $(this).removeClass('ui-corner-top').addClass('ui-corner-all');
				},
				focus: function(event, ui) {
				  return false;
				},
				response: function(event, ui) {
				},
				select: function(event, ui) {
				  htmlObject.find('input[name="dtc[detalle_item][imp][id]"]').val(ui.item.id);
				  htmlObject.find('input[name="dtc[detalle_item][imp][id]"]').data('valorimp',ui.item.valor);
				  htmlObject.find('input[name="dtc[detalle_item][imp][id]"]').data('tipoimp',ui.item.tipo);
				  htmlObject.find('input[name="dtc[detalle_item][imp][des]"]').val(ui.item.des);
				  htmlObject.find('input[name="dtc[detalle_item][imp][des]"]').autocomplete('destroy');
				  dtc.montos.totales();
				  return false;
				}
			}).data('ui-autocomplete')._renderItem = function(ul, item) {
				return $('<li><a>' +  item.des + '</a></li>').appendTo(ul);
			};

		}
	},
	gastos:{
		get:function(id){
			var gastos;
			$.ajax({
			    'url':'/4DACTION/_V3_get_dtc_oc',
			    data:{
			      "dtc[id]":id
			    },
			    dataType:'json',
			    async:false,
			    success:function(data){
			      gastos = data;
			    }
			});
			return gastos;
		},
		load: function(data){
			var containerCompras = dtc.container.find('table.ocs > tbody');
      		var htmlObject;
			if (data.rows.length > 0) {
		        $.each(data.rows, function(key, item){
		        	htmlObject = dtc.gastos.build(item);
		          	htmlObject.click(function(event){
			            if (event.srcElement.localName != 'input' && event.srcElement.className != 'ui-button-text')
			            	unaBase.loadInto.viewport('/v3/views/compras/content.shtml?id=' + item.id);
		          	});
		          	containerCompras.append(htmlObject);
		        });
	      	}else{
	        	htmlObject = $('<tr><td colspan="8">No existen documentos asociados.</td></tr>');
	        	containerCompras.append(htmlObject);
	      	}
		},
		build: function(item){
			return $('<tr class="bg-white" data-idoc="' + item.id + '">' +
		    '<td><input type="hidden" name="ocdt[id_compras]'+ item.id +'" value="'+ item.id +'">' + item.numero + '</td>' +
		    '<td>' + item.documento + '</td>' +
		    '<td class="left">' + item.proveedor + '</td>' +
		    '<td class="left">' + item.referencia + '</td>' +
		    '<td>' + item.emision + '</td>' +
		    '<td>' + item.estado + '</td>' +
		    '<td class="right">' + currency.symbol + ' <span class="numeric currency"><label class="otros_montos">'+ item.total_justificado +'</label></span></td>' +
		    '<td><!--<button class="remove ocs">Quitar</button>--></td>' +
		  '</tr>');
		}
	},
	montos: {
		items: function(target){
		    var cantidad = parseFloat(target.find('input[name="dtc[detalle_item][cantidad]"]').val());
		    var precio = parseFloat(target.find('input[name="dtc[detalle_item][precio]"]').val());
		    var dscto = parseFloat(target.find('input[name="dtc[detalle_item][dscto]"]').val());
		    var subtotal = roundTwo(cantidad * precio);
		    var total = roundTwo(subtotal - dscto);
		    target.find('input[name="dtc[detalle_item][subtotal]"]').val(subtotal);
		    target.find('input[name="dtc[detalle_item][total]"]').val(total);
		    dtc.montos.totales();
		},
		totales: function(){

			var sumaSubTotal = 0;
		  	var sumaDescuento = 0;
		  	var sumaTotal = 0;
		  	var totalAfecto = 0;
		  	var totalRetencion = 0;
		  	var totalAdicional = 0;
		  	var totalExento = 0;

			dtc.containerItems.find('tr[data-tipo="ITEM"]').each(function() {
				
				var subtotalLinea = parseFloat($(this).find('input[name="dtc[detalle_item][subtotal]"]').val());
				var dsctolLinea = parseFloat($(this).find('input[name="dtc[detalle_item][dscto]"]').val());
				var totalLinea = subtotalLinea - dsctolLinea;
				$(this).find('input[name="dtc[detalle_item][total]"]').val(totalLinea);
				var tipoImp = $(this).find('input[name="dtc[detalle_item][imp][id]"]').data('tipoimp');
				var valorImpueto = parseFloat($(this).find('input[name="dtc[detalle_item][imp][id]"]').data('valorimp'));

				$(this).find('.calculadora').hide();
				if (tipoImp == "IVA") {
					totalAfecto += totalLinea;
					if (tipo_gasto_asociado == "FXR") {
						$(this).find('.calculadora').show();
					}
				}
				if (tipoImp == "RETENCION") {
					totalRetencion += totalLinea;
				}
				if (tipoImp == "ADICIONAL") {
				  	totalAdicional += totalLinea;
				}
				if (tipoImp == "EXENTO") {
				  	totalExento += totalLinea;
				}
				var justificado = totalLinea;

				$(this).find('input[name="dtc[detalle_item][total]"]').data('justificado', justificado);
				sumaSubTotal += subtotalLinea;
				sumaDescuento += dsctolLinea;
				sumaTotal += totalLinea;
			});

			// impuestos
		  	var iva = (totalAfecto * 19)/100;
			var ret = (totalRetencion * 10)/100;
			var impuesto = iva + ret;

			// calcula monto total
			var total_final = totalAfecto + iva + (totalRetencion - ret) + totalExento + totalAdicional;

			// montos totales
			var totalNeto = totalAfecto + totalRetencion;
			dtc.data.montos.sub_total = Math.round(sumaTotal);
			dtc.data.montos.descuento = Math.round(sumaDescuento);
			dtc.data.montos.exento = Math.round(totalExento);
			dtc.data.montos.neto = Math.round(totalNeto);
			dtc.data.montos.iva = Math.round(impuesto);
			dtc.data.montos.adicional = Math.round(totalAdicional);
			dtc.data.montos.total = Math.round(total_final);
			
			/*alert(sumaTotal);
			alert(totalNeto);*/

			/*dtc.data.montos.sub_total = $.number(sumaTotal, currency.decimals, ',', '.');
			dtc.data.montos.descuento = $.number(sumaDescuento, currency.decimals, ',', '.');
			dtc.data.montos.exento = $.number(totalExento, currency.decimals, ',', '.');
			dtc.data.montos.neto = $.number(totalNeto, currency.decimals, ',', '.');
			dtc.data.montos.iva = $.number(impuesto, currency.decimals, ',', '.');
			dtc.data.montos.adicional = $.number(totalAdicional, currency.decimals, ',', '.');
			dtc.data.montos.total = $.number(total_final, currency.decimals, ',', '.');*/

			$('input[name="sub_total"]').val(dtc.data.montos.sub_total);
			$('input[name="descuento"]').val(dtc.data.montos.descuento);
			$('input[name="neto"]').val(dtc.data.montos.neto);
			$('input[name="iva"]').val(dtc.data.montos.iva);
			$('input[name="exento"]').val(dtc.data.montos.exento);
			$('input[name="adicional"]').val(dtc.data.montos.adicional);
			$('input[name="total"]').val(dtc.data.montos.total);

			// ajusta etiquetas
			if (dtc.data.id_tipo_doc == "65" || dtc.data.id_tipo_doc == "66") {
				$('[name="label-neto-hono"]').text("Honorario");
				$('[name="label-iva-ret"]').text("Retención");
			}else{
				$('[name="label-neto-hono"]').text("Neto");
				$('[name="label-iva-ret"]').text("Iva");
			}

		}

	},
	notasCredito:{
		add: function(){
			$.ajax({
	          url: '/4DACTION/_V3_setDtcnc',
	          dataType: 'json',
	          type: 'POST',
	          data: {
	          	"credito" : true,
	          	"id_factura" : dtc.id
	          }
	        }).done(function(data) {
	          unaBase.loadInto.viewport('/v3/views/dtc/contentnc.shtml?id=' + data.id);
	        });
		},
		get: function(id){

		},
		load: function(data){

		}
	},
	pagos:{
		get: function(id){
			var pagos;
			$.ajax({
			    'url':'/4DACTION/_V3_get_dtc_pagos_2',
			    data:{
			      "dtc[id]":id
			    },
			    dataType:'json',
			    async:false,
			    success:function(data){
			      pagos = data;
			    }
			});
			return pagos;
		},
		load: function(data){			
			var op_abono = 0;
  			var op_total = 0;
			var containerPagos = dtc.container.find('table.pagos > tbody');
			containerPagos.find("*").remove();
		    if (data.rows.length > 0) {
		        $.each(data.rows, function(key,item){
					htmlObject = $('<tr title="'+ item.origen +'" class="bg-white" data-id="' + item.id + '">' +
					'<td>' + item.folio + '</td>' +
					'<td>' + item.emision + '</td>' +
					'<td>' + item.vencimiento + '</td>' +
					'<td>' + item.proveedor + '</td>' +
					'<td>' + item.tipo + '</td>' +
					'<td>' + item.documento + '</td>' +
					'<td>' + item.estado + '</td>' +
					'<td class="numeric currency right">' + currency.symbol + ' <span class="decinot">'+ item.abono +'</span></td>' +
					'<td class="numeric currency right">' + currency.symbol + ' <span class="decinot">'+ item.total_pago +'</span></td>' +
					'</tr>');
					if(item.estado != "ANULADA"){
						op_abono += item.abono;
          				op_total += item.total_pago;
					}					
					htmlObject.click(function(){
						// unaBase.loadInto.dialog('/v3/views/pagos/dialog/pago.shtml?id=' + item.id, 'Orden de pago', 'large');
						unaBase.loadInto.viewport('/v3/views/pagos/content2.shtml?id=' + item.id);
					});
		          containerPagos.append(htmlObject);
		          $('.numeric.currency span.decinot').number(true, 0, ',', '.');
		        });
		    }else{
		    	if(dtc.data.estado == "PAGADO"){
		    		if (dtc.data.from == "FXR") {
		    			htmlObject = $('<tr><td colspan="7">Pagado desde la rendición de fondos.</td></tr>');
		    		}else{
		    			htmlObject = $('<tr><td colspan="7">Pagado desde la orden de compra.</td></tr>');
		    		}
		    	}else{
		    		htmlObject = $('<tr><td colspan="7">No existen pagos asociados.</td></tr>');
		    	}
				containerPagos.append(htmlObject);
			}

			 // Actualizar abono y saldo de órdenes de pago
      		$('.op_abono').text(op_abono);
     		$('.op_total').text(op_total);
     		$('.numeric.currency span.decinot').number(true, 0, ',', '.');
		}
	},
	resumen: {
		general: function(){
			if (dtc.data.des_tipo_doc != "") {
				$('[data-name="resumen[dtc][doc]"]').text(dtc.data.des_tipo_doc);
			}
			if (dtc.data.folio != "") {
				$('[data-name="resumen[dtc][number]"]').text(dtc.data.folio);
			}else{
				$('[data-name="resumen[dtc][number]"]').text("00000");
			}
			if (dtc.data.fecha_emision != "") {
				$('[data-name="resumen[dtc][emision]"]').text(dtc.data.fecha_emision);
			}
			if (dtc.data.referencia != "") {
				$('[data-name="resumen[dtc][reference]"]').text(dtc.data.referencia);
			}else{
				$('[data-name="resumen[dtc][reference]"]').text("SIN REFERENCIA");
			}
		},
		contactos: function(){
			if (dtc.data.contacto.alias != "") {
				$('[data-name="resumen[contacto][alias]"]').text(dtc.data.contacto.alias);
			}else{
				$('[data-name="resumen[contacto][alias]"]').text("SIN ALIAS");
			}
			if (dtc.data.contacto.razon_social != "") {
				$('[data-name="resumen[contacto][razon]"]').text(dtc.data.contacto.razon_social);
			}else{
				$('[data-name="resumen[contacto][razon]"]').text("SIN RAZÓN SOCIAL");
			}
		}
	},
	set: function(target){
		if ($(target).attr('type') == 'checkbox') {
			dtc.data[target.name] = $(target).is(':checked');
		} else {
			dtc.data[target.name] = target.value;
		}
		dtc.resumen.general();
		dtc.display.paint();
	},
	setMenu: function(){
		unaBase.toolbox.init();
    	unaBase.toolbox.menu.init({
		    entity: 'Dtc',
		    buttons: ['save','exit','discard','share_dtc','delete_dtc'],
		    data: function(){
		      return dtc.data;
		    },
		    validate:function(){
		    	/*if (dtc.validate.save()) {
		    		var status = dtc.validate.duplicate();
					if (status.error == "locked") {
						alert('El documento Nro. "'+ dtc.data.folio +'", ya se encuentra registrado para el mismo proveedor. Ingrese un nuevo número.');
						$(this).focus();
					}else{
						if(status.error == "warning"){
							var text = "";
				    		switch (dtc.data.id_tipo_doc) {
								case ("30" || "33" ):
									if (dtc.data.id_tipo_doc = "30") {
										text = "Ya existe una Factura electrónica con número y proveedor similar.<br><br>¿Desea ingresar el documento como Factura de todos modos?";
									}else{
										text = "Ya existe una Factura con número y proveedor similar.<br><br>¿Desea ingresar el documento como Factura electrónica de todos modos?";
									}
									break;

								case ("32" || "34" ):
									if (dtc.data.id_tipo_doc = "32") {
										text = "Ya existe una Factura exenta electrónica con número y proveedor similar.<br><br>¿Desea ingresar el documento como Factura exenta de todos modos?";
									}else{
										text = "Ya existe una Factura exenta con número y proveedor similar.<br><br>¿Desea ingresar el documento como Factura exenta electrónica de todos modos?";
									}
									break;

								case ("60" || "61" ):
									if (dtc.data.id_tipo_doc = "60") {
										text = "Ya existe una Nota de crédito electrónica con número y proveedor similar.<br><br>¿Desea ingresar el documento como Nota de crédito de todos modos?";
									}else{
										text = "Ya existe una Nota de crédito con número y proveedor similar.<br><br>¿Desea ingresar el documento como Nota de crédito electrónica de todos modos?";
									}
									break;

								case ("55" || "56" ):
									if (dtc.data.id_tipo_doc = "55") {
										text = "Ya existe una Nota de débido electrónica con número y proveedor similar.<br><br>¿Desea ingresar el documento como Nota de débido de todos modos?";
									}else{
										text = "Ya existe una Nota de débido con número y proveedor similar.<br><br>¿Desea ingresar el documento como Nota de débido electrónica de todos modos?";
									}
									break;

								case ("65" || "66" ):
									if (dtc.data.id_tipo_doc = "65") {
										text = "Ya existe una Boleta de honorarios electrónica con número y proveedor similar.<br><br>¿Desea ingresar el documento como Boleta de honorarios de todos modos?";
									}else{
										text = "Ya existe una Boleta de honorarios con número y proveedor similar.<br><br>¿Desea ingresar el documento como Boleta de honorarios electrónica de todos modos?";
									}
									break;
							}
							confirm(text).done(function(data) {
								if (data) {
									return true;
								}
							});
						}
					}
		    	}else{
		    		return false;
		    	}*/

		    	return dtc.validate.save();

		    }
	  	});
	},
	validate: {
		save: function(){
			var msgError = "";
			dtc.container.find('input').removeClass("invalid");
			if (dtc.data.referencia == "") {
				msgError = msgError + '- Falta ingresar una referencia.<br/>';
	        	$('[name="referencia"]').addClass('invalid');
			}
			if (dtc.data.id_tipo_doc == "") {
				msgError = msgError + '- Falta seleccionar el tipo de documento.<br/>';
	        	$('[name="des_tipo_doc"]').addClass('invalid');
			}
			if (dtc.data.folio == "") {
				msgError = msgError + '- Falta ingresar número documento.<br/>';
	        	$('[name="folio"]').addClass('invalid');
			}
			if (dtc.data.contacto.id == 0) {
				msgError = msgError + '- Falta seleccionar un proveedor.<br/>';
	        	$('[name="contacto[info][alias]"]').addClass('invalid');
			}

			if (dtc.data.montos.sub_total > monto_maximo_rendir && tipo_gasto_asociado == "OC") {
				msgError = msgError + '- El monto ingresado excede el saldo por justificar de la Orden de compra.<br/>';
	        	$('[name="sub_total"]').addClass('invalid');
			}
			if (msgError == "") {
				return true;
			}else{
				toastr.error(msgError);
				return false;
			}
		},
		duplicate: function(){
			var status;
			$.ajax({
				'url':'/4DACTION/_V3_valida_folio_dtc',
				data:{
					"dtc[valida][id]": dtc.id,
					"dtc[valida][tipo_doc]": dtc.data.id_tipo_doc,
					"dtc[valida][folio]": dtc.data.folio,
					"dtc[valida][id_prov]": dtc.data.contacto.id
				},
				async: false,
				dataType:'json',
				success: function(data){
				 	status = data;
				}
			});
			return status;
		}
	},
	addExistOcs: function(){		
		unaBase.loadInto.dialog('/v3/views/dtc/dialog/ocs_disponibles.shtml?id='+dtc.id, 'SELECCIONAR ÓRDENES DE COMPRA', 'x-large');
	}
}



