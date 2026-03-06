var dtc = {
	"container" : $('#sheet-dtc'),
	"containerItems" : $('#sheet-dtc').find('table.items > tbody'),
	isDraft: function(){
		return parseInt(document.querySelector(`span[data-name="resumen[dtc][number]"]`).innerHTML) === 0
	},
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
	  	dtc.estado = dtc.data.estado;

	  	var valorCambio = 1;
	  	if (dtc.data.moneda.code != currency.code && dtc.data.moneda.code != "") {
			$('.container-symbol-new').text(dtc.data.moneda.code);
			valorCambio = dtc.data.moneda.cambio;
			if (dtc.data.moneda.cambio == 0) {
			  dtc.data.moneda.cambio = 1;
			  valorCambio = 1;
			}
		}

		dtc.moneda = {
			code : dtc.data.moneda.code,
			cambio : valorCambio
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
	  	$('[name="motivonc"]').val(dtc.data.motivonc);

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

	  	$('[name="sub_total"]').val($.number(dtc.data.montos.sub_total, currency.decimals, currency.decimals_sep, currency.thousands_sep));
	  	$('[name="porcentaje_descuento"]').val(0);
	  	$('[name="descuento"]').val($.number(dtc.data.montos.descuento, currency.decimals, currency.decimals_sep, currency.thousands_sep));
	  	$('[name="exento"]').val($.number(dtc.data.montos.exento, currency.decimals, currency.decimals_sep, currency.thousands_sep));
	  	$('[name="neto"]').val($.number(dtc.data.montos.neto, currency.decimals, currency.decimals_sep, currency.thousands_sep));
	  	$('[name="iva"]').val($.number(dtc.data.montos.iva, currency.decimals, currency.decimals_sep, currency.thousands_sep));
	  	$('[name="adicional"]').val($.number(dtc.data.montos.adicional, currency.decimals, currency.decimals_sep, currency.thousands_sep));
	  	$('[name="total"]').val($.number(dtc.data.montos.total, currency.decimals, currency.decimals_sep, currency.thousands_sep));

	  	/*$('[name="sub_total"]').val(dtc.data.montos.sub_total);
	  	$('[name="porcentaje_descuento"]').val(0);
	  	$('[name="descuento"]').val(dtc.data.montos.descuento);
	  	$('[name="exento"]').val(dtc.data.montos.exento);
	  	$('[name="neto"]').val(dtc.data.montos.neto);
	  	$('[name="iva"]').val(dtc.data.montos.iva);
	  	$('[name="adicional"]').val(dtc.data.montos.adicional);
	  	$('[name="total"]').val(dtc.data.montos.total);*/

	  	// Adicional
	  	$('[name="observacion"]').val(dtc.data.observacion);

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
			dtc.display.visible(menuBar.find('li[data-name="save"], li[data-name="discard"], li[data-name="share_dtc"], li[data-name="delete_dtcnc"]'), false);
			dtc.display.visible(dtc.container.find('button.show, .add.op'), false);
			dtc.display.enabled(dtc.container.find('input, textarea'), false);
			
			switch(dtc.data.estado) {
			    case 'POR EMITIR':
			    	dtc.container.find('input[required]').removeClass('transparent').addClass("required");
			    	dtc.display.visible(menuBar.find('li[data-name="save"]'), true);
					dtc.display.enabled(dtc.container.find('.info-general input'), true);

					dtc.display.enabled(dtc.container.find('.info-general input[name="des_tipo_doc"]').attr("type","text"), false);
					dtc.display.enabled(dtc.container.find('.info-proveedor input[name="contacto[info][alias]"]').attr("type","text"), false);
					dtc.display.enabled(dtc.container.find('.info-proveedor input[name="des_forma_pago"]').attr("type","text"), false);
					if (dtc.data.from == "FXR") {
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

					}
			    	if (access._465) { // eliminar
						dtc.display.visible(menuBar.find('li[data-name="delete_dtcnc"]'), true);
					}
			    	if (dtc.data.id_tipo_doc == "30" || dtc.data.id_tipo_doc == "33") {
			    		dtc.display.visible(dtc.container.find('.info-nc'), true);
			    	}

			        break;

			    case 'POR PAGAR':
			    	dtc.display.visible(menuBar.find('li[data-name="save"]'), true);
			    	dtc.container.find('.info-general').find('.expand').removeClass('active');
					dtc.container.find('.info-proveedor').find('.expand').removeClass('active');
					if (dtc.data.id_tipo_doc == "30" || dtc.data.id_tipo_doc == "33") {
			    		dtc.display.visible(dtc.container.find('.info-nc'), true);
			    	}
			    	if (access._503) { // anular
						dtc.display.visible(menuBar.find('li[data-name="discard"]'), true);
					}
			    	if (access._465) { // eliminar
						dtc.display.visible(menuBar.find('li[data-name="delete_dtcnc"]'), true);
					}

					dtc.display.enabled(dtc.container.find('.info-general input[name="des_tipo_doc"]').attr("type","text"), false);
					dtc.display.enabled(dtc.container.find('.info-proveedor input[name="contacto[info][alias]"]').attr("type","text"), false);
					dtc.display.enabled(dtc.container.find('.info-proveedor input[name="des_forma_pago"]').attr("type","text"), false);
					
					if (access._449) { // modificar
						dtc.display.enabled(dtc.container.find('.info-general input[name="referencia"]'), true);
						dtc.display.enabled(dtc.container.find('.info-general input[name="folio"]'), true);
						dtc.display.enabled(dtc.container.find('.info-general input[name="fecha_emision"]'), true);
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

					dtc.container.find('button.remove.item, button.duplicate.item, button.add.items').hide();

			        break;

			    case 'PAGADO':
			    case 'EMITIDA':
			    	dtc.display.enabled(dtc.container.find('.info-general input[name="des_tipo_doc"]').attr("type","text"), false);
			    	dtc.display.enabled(dtc.container.find('.info-proveedor input[name="des_forma_pago"]').attr("type","text"), false);

			    	if (access._449) { // modificar
			    		dtc.display.visible(menuBar.find('li[data-name="save"]'), true);
			    		dtc.container.find('.info-general').find('.expand').removeClass('active');
						dtc.container.find('.info-proveedor').find('.expand').removeClass('active');
						dtc.display.enabled($('input[name="fecha_emision"]'), true);
						dtc.display.enabled($('input[name="fecha_recepcion"]'), true);
					}else{
						$('input[name="fecha_emision"]').removeClass('datepicker');
						$('input[name="fecha_recepcion"]').removeClass('datepicker');
					}

					if (access._503) { // anular
						dtc.display.visible(menuBar.find('li[data-name="discard"]'), true);
					}

					if (access._465) { // eliminar
						dtc.display.visible(menuBar.find('li[data-name="delete_dtcnc"]'), true);
					}

					if (dtc.data.id_tipo_doc == "30" || dtc.data.id_tipo_doc == "33") {
			    		dtc.display.visible(dtc.container.find('.info-nc'), true);
			    	}

			    	dtc.container.find('button.remove.item, button.duplicate.item, button.add.items').hide();


			    	break;

			     // case 'EMITIDA':

			     	// caso nota de credito

			    	// dtc.display.visible(menuBar.find('li[data-name="save"]'), true);
			    	//break;

			    case 'NULO':
			    	// dtc.display.visible(menuBar.find('li[data-name="discard"]'), true);
			    	// dtc.display.visible(menuBar.find('li[data-name="save"]'), true);
			    	if (access._465) { // eliminar
						dtc.display.visible(menuBar.find('li[data-name="delete_dtcnc"]'), true);
					}
					if (dtc.data.id_tipo_doc == "30" || dtc.data.id_tipo_doc == "33") {
			    		dtc.display.visible(dtc.container.find('.info-nc'), true);
			    	}
			    	dtc.container.find('.info-general').find('.expand').removeClass('active');
					dtc.container.find('.info-proveedor').find('.expand').removeClass('active');

					dtc.display.visible(dtc.container.find('.info-totales .totales-post-save'), false);
			    	dtc.container.find('button.remove.item, button.duplicate.item, button.add.items').hide();

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
			let totalDtcAvailable = 0;
			if (data.rows.length > 0) {
		        dtc.containerItems.find("*").remove();
		        $.each(data.rows, function(key, item){
					if (item.tipo == "TITULO"){
						get_detail.titulo('prependTo', dtc.containerItems, item);
					}else{
						var currentItem = dtc.containerItems.find('tr[data-llave="'+ item.llave_titulo +'"]');
						if(item.llave_titulo == "") {
							get_detail.item('prependTo', dtc.containerItems, item);
						}else{
							get_detail.item('insertAfter', currentItem, item);
						}
						//calcula monto disponible para la NC
						totalDtcAvailable+= item.precio;
					}
					
			    });
			    dtc.data.montos.dtcAvailable = totalDtcAvailable;
		        
			    setTimeout(function(){
			  		dtc.montos.totales();
			  	}, 1000);

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
		fromMany: function(){
			let lines = document.querySelectorAll("article.info-items tr[data-idoc]");
			let ids = [];
			for(let line of lines){
				ids.push(line.dataset.idoc);
			}
			ids = new Set(ids);
			return ids.size >1 
		},
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
			return $('<tr data-idoc="' + item.id + '">' +
		    '<td><input type="hidden" name="ocdt[id_compras]'+ item.id +'" value="'+ item.id +'">' + item.numero + '</td>' +
		    '<td>' + item.documento + '</td>' +
		    '<td class="left">' + item.proveedor + '</td>' +
		    '<td class="left">' + item.referencia + '</td>' +
		    '<td>' + item.emision + '</td>' +
		    '<td>' + item.estado + '</td>' +
		    '<td><input type="hidden" name="ocdt[monto]'+ item.id +'" value="'+ item.total_justificado +'">' + currency.symbol + ' <span class="numeric currency"><label class="otros_montos">'+ item.total_justificado +'</label></span></td>' +
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
			var sumaSubTotales = 0;
			var sumaTotales = 0;
			var sumaExentos = 0;
			var sumaAfectos = 0;
			var sumaAdicional = 0;
			var sumaDescuentos = 0;
			var sumaRetencion = 0;
			var sumaTotales = 0;
			var impuestoIva = 0;
			var impuestoRet = 0;

			dtc.containerItems.find('tr[data-tipo="ITEM"]').each(function() {
				sumaSubTotales += parseFloat($(this).find('input[name="dtc[detalle_item][subtotal]"]').val());
    			sumaDescuentos += parseFloat($(this).find('input[name="dtc[detalle_item][dscto]"]').val());
    			var total = parseFloat($(this).find('input[name="dtc[detalle_item][total]"]').val());
    			sumaTotales += total;

    			var tipoImp = $(this).find('input[name="dtc[detalle_item][imp][id]"]').data('tipoimp');
    			var valorImpueto = parseFloat($(this).find('input[name="dtc[detalle_item][imp][id]"]').data('valorimp'));

				$(this).find('.calculadora').hide();

				switch(tipoImp) {
			        case "IVA":
						sumaAfectos += total;
			            //impuestoIva += Math.round((total * valorImpueto / 100));
			          	impuestoIva += (total * valorImpueto / 100);
			            break;

			        case "EXENTO":
			            sumaExentos += total;
			            break;

			        case "RETENCION":
			            // valorImpueto = 8;
			            sumaRetencion += total;
			            impuestoRet += Math.round((total * valorImpueto / 100));
			            break;

			        case "ADICIONAL":
			            sumaAdicional += total;
			            break;
			    }
				var justificado = total;
				$(this).find('input[name="dtc[detalle_item][total]"]').data('justificado', justificado);
			});

			var totalNeto = sumaAfectos + sumaRetencion;
			dtc.data.montos.sub_total = sumaSubTotales;
			dtc.data.montos.descuento = sumaDescuentos;
			dtc.data.montos.exento = sumaExentos;
			dtc.data.montos.neto = totalNeto;
			var impuestodtc = (impuestoIva + impuestoRet);
			// dtc.data.montos.iva = impuestodtc;
			dtc.data.montos.iva = impuestodtc + dtc.data.montos.total_ajuste_imp;
			dtc.data.montos.adicional = sumaAdicional;
			var totaldtc = (sumaAfectos + impuestoIva + (sumaRetencion - impuestoRet) + sumaExentos + sumaAdicional);
			dtc.data.montos.total = totaldtc;

			$('input[name="sub_total"]').val($.number(dtc.data.montos.sub_total, currency.decimals, currency.decimals_sep, currency.thousands_sep));
			$('input[name="descuento"]').val($.number(dtc.data.montos.descuento, currency.decimals, currency.decimals_sep, currency.thousands_sep));
			$('input[name="neto"]').val($.number(dtc.data.montos.neto, currency.decimals, currency.decimals_sep, currency.thousands_sep));
			$('input[name="iva"]').val($.number(dtc.data.montos.iva, currency.decimals, currency.decimals_sep, currency.thousands_sep));
			$('input[name="exento"]').val($.number(dtc.data.montos.exento, currency.decimals, currency.decimals_sep, currency.thousands_sep));
			$('input[name="adicional"]').val($.number(dtc.data.montos.adicional, currency.decimals, currency.decimals_sep, currency.thousands_sep));
			$('input[name="total"]').val($.number(dtc.data.montos.total, currency.decimals, currency.decimals_sep, currency.thousands_sep));

			// ajusta etiquetas
			if (dtc.data.id_tipo_doc == "65" || dtc.data.id_tipo_doc == "66" || dtc.data.id_tipo_doc == "118" || dtc.data.id_tipo_doc == "119") {
				if (dtc.data.id_tipo_doc == "118") {
				  $('span[name="label-neto-hono"]').text('Impuesto');
				  $('span[name="label-iva-ret"]').text(retName+" ("+ retRate +"%)");
				}else{
				  if (dtc.data.id_tipo_doc == "119") {
				    $('span[name="label-neto-hono"]').text('Impuesto');
				    $('span[name="label-iva-ret"]').text(retName+" (0%)");
				  }else{
				    $('span[name="label-neto-hono"]').text('Honorario');
				    $('span[name="label-iva-ret"]').text(retName+" ("+ retRate +"%)");
				  }
				}
			} else if(dtc.data.id_tipo_doc == "60" || dtc.data.id_tipo_doc == "61"){
				$('span[name="label-neto-hono"]').text('Neto');
				$('span[name="label-iva-ret"]').text("Impuesto ("+ retRate +"%)");
			} else{
				$('span[name="label-neto-hono"]').text('Neto');
				$('span[name="label-iva-ret"]').text(ivaName+" ("+ ivaRate +"%)");
			}

		}

	},
	notasCredito:{
		add: function(){
			$.ajax({
	          url: '/4DACTION/_V3_setNc',
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
			    'url':'/4DACTION/_V3_get_dtc_pagos',
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
			var containerPagos = dtc.container.find('table.pagos > tbody');
			containerPagos.find("*").remove();
		    if (data.rows.length > 0) {
		        $.each(data.rows, function(key,item){
					htmlObject = $('<tr data-id="' + item.id + '">' +
					'<td>' + item.folio + '</td>' +
					'<td>' + item.emision + '</td>' +
					'<td>' + item.vencimiento + '</td>' +
					'<td>' + item.tipo + '</td>' +
					'<td>' + item.documento + '</td>' +
					'<td>' + item.estado + '</td>' +
					'<td class="currency">'+ item.abono + '</td>' +
					'</tr>');
					htmlObject.find('.currency').formatCurrency({
						region: 'es-CL',
						decimalSymbol: ',',
						digitGroupSymbol: '.',
						roundToDecimalPlace: currency.decimals,
						symbol: '<span class="symbol">' + currency.symbol + '</span>',
						positiveFormat: (currency.is_right)? '%n%s' : '%s%n',
						negativeFormat: (currency.is_right)? '-%n%s' :'-%s%n'
					});
		          htmlObject.click(function(){
		            unaBase.loadInto.dialog('/v3/views/pagos/dialog/pago.shtml?id=' + item.id, 'Orden de pago', 'large');
		          });
		          containerPagos.append(htmlObject);
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
		dtc.data[target.name] = target.value;
		dtc.resumen.general();
		dtc.display.paint();
	},
	setMenu: function(){
		unaBase.toolbox.init();
    	unaBase.toolbox.menu.init({
		    entity: 'Dtcnd',
		    buttons: ['save','exit', 'delete_dtcnd'],
		    data: function(){
		      return dtc.data;
		    },
		    validate:function(){
		      return dtc.validate();
		    }
	  	});
	},
	validate: function(){
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
		if (msgError == "") {
			return true;
		}else{
			toastr.error(msgError);
			return false;
		}
	}
}
